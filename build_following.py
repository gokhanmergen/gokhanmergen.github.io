#!/usr/bin/env python3
"""Build following.html, the page of people worth following, from following/.

    python3 build_following.py           # render from the stored items
    python3 build_following.py --fetch   # read every feed first, then render

The people, their channels and their feeds are in following/sources.toml, the
topics in following/interests.toml and the picks in following/picks.toml.
--fetch adds new items from the feeds to following/items.json, which keeps
them after they scroll off the feeds. .github/workflows/following.yml runs it
every day and commits the result.
"""

from __future__ import annotations

import html
import json
import re
import sys
import tomllib
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Dict, List, Optional

# Importing build_blog would otherwise leave a __pycache__ in the repository.
sys.dont_write_bytecode = True
from build_blog import load_posts, navigation  # noqa: E402


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "following"
SOURCES_FILE = DATA_DIR / "sources.toml"
INTERESTS_FILE = DATA_DIR / "interests.toml"
PICKS_FILE = DATA_DIR / "picks.toml"
ITEMS_FILE = DATA_DIR / "items.json"
PAGE_FILE = ROOT / "following.html"
OPML_FILE = ROOT / "following.opml"
# The page shows items published in the last WINDOW_DAYS, at most a feed's
# max_items of them per feed. items.json forgets items after KEEP_DAYS and
# keeps at most STORED_PER_FEED per feed.
WINDOW_DAYS = 30
DEFAULT_MAX_ITEMS = 3
KEEP_DAYS = 120
STORED_PER_FEED = 30
PICKS_SHOWN = 6
SUMMARY_STORED = 400
SUMMARY_SHOWN = 200
USER_AGENT = "Mozilla/5.0 (compatible; gokhanmergen.com following page; +https://www.gokhanmergen.com/following.html)"
KINDS = {"post": "Post", "paper": "Paper", "podcast": "Podcast", "video": "Video", "report": "Report"}
GENERATED_NOTICE = """<!--
GENERATED FILE — DO NOT EDIT DIRECTLY.
Source: following/*.toml and following/items.json
Generator: build_following.py
Regenerate from the repository root with: python3 build_following.py
Manual changes will be overwritten.
-->
"""

ATOM = "{http://www.w3.org/2005/Atom}"
MEDIA = "{http://search.yahoo.com/mrss/}"
DC = "{http://purl.org/dc/elements/1.1/}"
CONTENT = "{http://purl.org/rss/1.0/modules/content/}"
RSS1 = "{http://purl.org/rss/1.0/}"


@dataclass(frozen=True)
class Topic:
    id: str
    label: str
    categories: tuple
    pattern: re.Pattern


@dataclass(frozen=True)
class Feed:
    url: str
    label: str
    kind: str
    # The topics its items can have; the person's topics unless set.
    topics: tuple
    # Keep only items that match one of those topics' keywords.
    match_topics: bool
    # Drop items whose title matches this regular expression.
    exclude: Optional[re.Pattern]
    max_items: int
    show_summary: bool


@dataclass(frozen=True)
class Person:
    id: str
    name: str
    role: str
    topics: tuple
    why: str
    channels: tuple
    start: tuple
    feeds: tuple


def escape(value: str) -> str:
    return html.escape(value, quote=True)


def keyword_pattern(keywords: List[str]) -> re.Pattern:
    parts = []
    for keyword in keywords:
        prefix = keyword.endswith("*")
        parts.append(re.escape(keyword.rstrip("*")) + (r"\w*" if prefix else ""))
    return re.compile(rf"(?<!\w)(?:{'|'.join(parts)})(?!\w)", re.IGNORECASE)


def load_topics() -> tuple[Dict[str, Topic], List[str]]:
    data = tomllib.loads(INTERESTS_FILE.read_text(encoding="utf-8"))
    topics: Dict[str, Topic] = {}
    for entry in data["topic"]:
        topics[entry["id"]] = Topic(
            id=entry["id"],
            label=entry["label"],
            categories=tuple(entry.get("categories", ())),
            pattern=keyword_pattern(entry["keywords"]),
        )
    return topics, data.get("ignore_categories", [])


def load_sources(topics: Dict[str, Topic]) -> tuple[dict, List[Person]]:
    data = tomllib.loads(SOURCES_FILE.read_text(encoding="utf-8"))
    people: List[Person] = []
    for entry in data["person"]:
        person_topics = tuple(entry["topics"])
        feeds = []
        for feed in entry.get("feed", []):
            feed_topics = tuple(feed.get("topics", person_topics))
            kind = feed.get("kind", "post")
            if kind not in KINDS:
                raise ValueError(f"{entry['id']}: feed kind must be one of {', '.join(KINDS)}, not {kind}")
            feeds.append(Feed(
                url=feed["url"],
                label=feed["label"],
                kind=kind,
                topics=feed_topics,
                match_topics=feed.get("match_topics", False),
                exclude=re.compile(feed["exclude"]) if "exclude" in feed else None,
                max_items=feed.get("max_items", DEFAULT_MAX_ITEMS),
                show_summary=feed.get("summary", True),
            ))
        for topic in person_topics + tuple(t for f in feeds for t in f.topics):
            if topic not in topics:
                raise ValueError(f"{entry['id']}: unknown topic {topic}; add it to {INTERESTS_FILE.name}")
        people.append(Person(
            id=entry["id"],
            name=entry["name"],
            role=entry.get("role", ""),
            topics=person_topics,
            why=entry.get("why", "").strip(),
            channels=tuple(entry.get("channel", [])),
            start=tuple(entry.get("start", [])),
            feeds=tuple(feeds),
        ))
    ids = [person.id for person in people]
    if len(ids) != len(set(ids)):
        raise ValueError(f"Duplicate person ids in {SOURCES_FILE.name}")
    return data.get("page", {}), people


def load_picks() -> List[dict]:
    if not PICKS_FILE.exists():
        return []
    picks = tomllib.loads(PICKS_FILE.read_text(encoding="utf-8")).get("pick", [])
    return sorted(picks, key=lambda pick: pick["date"], reverse=True)[:PICKS_SHOWN]


def check_categories(topics: Dict[str, Topic], ignored: List[str]) -> None:
    """Warn about post categories that no topic covers."""
    covered = {category for topic in topics.values() for category in topic.categories} | set(ignored)
    categories = sorted({post.category for post in load_posts() if post.translation_of is None})
    for category in categories:
        if category not in covered:
            print(f"warning: no topic in {INTERESTS_FILE.name} covers the post category '{category}'")


# Fetching

def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8",
    })
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def parse_date(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    value = value.strip()
    try:
        moment = parsedate_to_datetime(value)
    except (TypeError, ValueError):
        try:
            moment = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.astimezone(timezone.utc).date()


def clean_text(value: Optional[str]) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", " ", value or ""))
    text = re.sub(r"\s+", " ", text).strip()
    # WordPress boilerplate.
    text = re.sub(r"\s*The post .{0,300} (?:appeared first|first appeared) on .{0,200}$", "", text)
    text = re.sub(r"\s*Continue reading\b.*$", "", text)
    text = re.sub(r"\s*\[(?:…|&#8230;|\.\.\.)\]\s*$", "…", text)
    return text


def shorten(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0].rstrip(" ,;:.—-")
    return cut + "…"


def clean_url(url: str) -> str:
    parts = urllib.parse.urlsplit(url.strip())
    query = [(k, v) for k, v in urllib.parse.parse_qsl(parts.query, keep_blank_values=True) if not k.startswith("utm_")]
    return urllib.parse.urlunsplit(parts._replace(query=urllib.parse.urlencode(query)))


def rss_field(item: ET.Element, name: str) -> Optional[str]:
    """A child's text in RSS 2.0, which has no namespace, or RSS 1.0 (RDF)."""
    return item.findtext(name) or item.findtext(f"{RSS1}{name}")


def parse_feed(data: bytes) -> List[dict]:
    root = ET.fromstring(data)
    entries = []
    if root.tag == f"{ATOM}feed":
        for entry in root.findall(f"{ATOM}entry"):
            links = entry.findall(f"{ATOM}link")
            link = next((l.get("href") for l in links if l.get("rel", "alternate") == "alternate"), None)
            entries.append({
                "title": entry.findtext(f"{ATOM}title"),
                "url": link,
                "published": entry.findtext(f"{ATOM}published") or entry.findtext(f"{ATOM}updated"),
                "summary": entry.findtext(f"{ATOM}summary")
                or entry.findtext(f"{ATOM}content")
                or entry.findtext(f"{MEDIA}group/{MEDIA}description"),
                "kind": None,
            })
    else:
        for item in [*root.iter("item"), *root.iter(f"{RSS1}item")]:
            guid = item.find("guid")
            link = rss_field(item, "link")
            if not link and guid is not None and guid.get("isPermaLink", "true") == "true":
                link = guid.text
            enclosure = item.find("enclosure")
            media = enclosure.get("type", "") if enclosure is not None else ""
            kind = "podcast" if media.startswith("audio/") else "video" if media.startswith("video/") else None
            entries.append({
                "title": rss_field(item, "title"),
                "url": link,
                "published": rss_field(item, "pubDate") or item.findtext(f"{DC}date"),
                "summary": rss_field(item, "description") or item.findtext(f"{CONTENT}encoded"),
                "kind": kind,
            })
    return [entry for entry in entries if entry["url"] and entry["title"]]


def matches(feed: Feed, title: str, summary: str, topics: Dict[str, Topic]) -> bool:
    if feed.exclude and feed.exclude.search(title):
        return False
    if feed.match_topics:
        text = f"{title} {summary}"
        return any(topics[topic].pattern.search(text) for topic in feed.topics)
    return True


def load_state() -> dict:
    if ITEMS_FILE.exists():
        return json.loads(ITEMS_FILE.read_text(encoding="utf-8"))
    return {"items": [], "failing": {}}


def save_state(state: dict) -> None:
    state["items"].sort(key=lambda item: (item["published"], item["url"]), reverse=True)
    ITEMS_FILE.write_text(json.dumps(state, indent=1, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")


def fetch_all(people: List[Person], topics: Dict[str, Topic], today: date) -> None:
    state = load_state()
    items = {item["url"]: item for item in state["items"]}
    failing: Dict[str, dict] = state.get("failing", {})
    oldest = today - timedelta(days=KEEP_DAYS)
    added = 0
    for person in people:
        for feed in person.feeds:
            try:
                entries = parse_feed(fetch(feed.url))
            except Exception as error:  # A broken feed must not stop the others.
                since = failing.setdefault(feed.url, {"since": today.isoformat()})["since"]
                print(f"warning: {person.name} · {feed.label}: {error} (failing since {since})")
                continue
            failing.pop(feed.url, None)
            for entry in entries:
                url = clean_url(entry["url"])
                title = clean_text(entry["title"])
                summary = shorten(clean_text(entry["summary"]), SUMMARY_STORED)
                item = items.get(url)
                # An undated entry keeps the date it was first seen.
                published = parse_date(entry["published"]) or (date.fromisoformat(item["published"]) if item else today)
                published = min(published, today)
                if published < oldest or not matches(feed, title, summary, topics):
                    continue
                if item is None:
                    item = items[url] = {"url": url, "first_seen": today.isoformat()}
                    added += 1
                item.update({
                    "title": title,
                    "summary": summary,
                    "person": person.id,
                    "feed": feed.url,
                    "kind": entry["kind"] or feed.kind,
                    "published": published.isoformat(),
                })

    # Forget old items and items of feeds no longer in sources.toml, and keep
    # only each feed's newest STORED_PER_FEED.
    feeds = {feed.url for person in people for feed in person.feeds}
    kept: List[dict] = []
    per_feed: Dict[str, int] = {}
    for item in sorted(items.values(), key=lambda item: item["published"], reverse=True):
        if item["feed"] not in feeds or item["published"] < oldest.isoformat():
            continue
        per_feed[item["feed"]] = per_feed.get(item["feed"], 0) + 1
        if per_feed[item["feed"]] <= STORED_PER_FEED:
            kept.append(item)
    state["items"] = kept
    state["failing"] = {url: value for url, value in failing.items() if url in feeds}
    save_state(state)
    print(f"Fetched {len(feeds)} feeds: {added} new items, {len(kept)} stored, {len(state['failing'])} failing")


# Rendering

def item_topics(item: dict, feed: Feed, topics: Dict[str, Topic]) -> List[str]:
    """The feed's topics whose keywords the item matches, else the first one."""
    text = f"{item['title']} {item['summary']}"
    return [topic for topic in feed.topics if topics[topic].pattern.search(text)] or [feed.topics[0]]


def display_date(value: date) -> str:
    return value.strftime("%b %-d, %Y")


def link(url: str, text: str, css: str = "") -> str:
    external = not url.startswith("#")
    attributes = ' target="_blank" rel="noopener noreferrer"' if external else ""
    css_attribute = f' class="{css}"' if css else ""
    return f'<a{css_attribute} href="{escape(url)}"{attributes}>{escape(text)}</a>'


def render_topic_filter(topics: Dict[str, Topic]) -> str:
    buttons = ['          <button class="following-topic" type="button" data-topic="all" aria-pressed="true">All</button>']
    buttons += [
        f'          <button class="following-topic" type="button" data-topic="{topic.id}" aria-pressed="false">{escape(topic.label)}</button>'
        for topic in topics.values()
    ]
    return f'''      <nav class="following-topics" aria-label="Show one topic" hidden>
{chr(10).join(buttons)}
      </nav>'''


def render_picks(picks: List[dict], people: Dict[str, Person]) -> str:
    if not picks:
        return ""
    rows = []
    for pick in picks:
        person = people.get(pick.get("person", ""))
        source = f'{link("#" + person.id, person.name)} · ' if person else ""
        topics_attribute = " ".join(person.topics) if person else ""
        rows.append(f'''          <li class="following-pick" data-topics="{topics_attribute}">
            {link(pick["url"], pick["title"], "following-item-title")}
            <p class="following-item-source">{source}<time datetime="{pick["date"].isoformat()}">{display_date(pick["date"])}</time></p>
            <p class="following-pick-note">{escape(pick["note"])}</p>
          </li>''')
    return f'''
      <section class="following-section" aria-labelledby="picks-title">
        <div class="following-section-head">
          <h2 id="picks-title">Picks</h2>
          <p>Recent work I think is worth the time, and why.</p>
        </div>
        <ol class="following-picks">
{chr(10).join(rows)}
        </ol>
      </section>
'''


def render_latest(items: List[dict], feeds: Dict[str, tuple], topics: Dict[str, Topic], today: date) -> str:
    start = (today - timedelta(days=WINDOW_DAYS)).isoformat()
    shown: Dict[str, int] = {}
    days: Dict[str, List[str]] = {}
    for item in items:
        if item["published"] < start:
            continue
        person, feed = feeds[item["feed"]]
        shown[feed.url] = shown.get(feed.url, 0) + 1
        if shown[feed.url] > feed.max_items:
            continue
        summary = shorten(item["summary"], SUMMARY_SHOWN) if feed.show_summary else ""
        summary_html = f'\n              <p class="following-item-summary">{escape(summary)}</p>' if summary else ""
        days.setdefault(item["published"], []).append(f'''          <li class="following-item" data-topics="{" ".join(item_topics(item, feed, topics))}">
            <span class="following-kind following-kind-{item["kind"]}">{KINDS[item["kind"]]}</span>
            <div>
              {link(item["url"], item["title"], "following-item-title")}
              <p class="following-item-source">{link("#" + person.id, person.name)} · {escape(feed.label)}</p>{summary_html}
            </div>
          </li>''')
    groups = [
        f'''        <div class="following-day">
          <h3><time datetime="{day}">{display_date(date.fromisoformat(day))}</time></h3>
          <ol class="following-items">
{chr(10).join(rows)}
          </ol>
        </div>'''
        for day, rows in sorted(days.items(), reverse=True)
    ]
    return f'''
      <section class="following-section following-latest" aria-labelledby="latest-title">
        <div class="following-section-head">
          <h2 id="latest-title">Latest</h2>
          <p>New work from the people below, from the last {WINDOW_DAYS} days. It updates every day.</p>
        </div>
{chr(10).join(groups)}
        <p class="following-empty" hidden>Nothing new on this topic in the last {WINDOW_DAYS} days.</p>
      </section>
'''


def render_person(person: Person, latest: Optional[dict], topics: Dict[str, Topic]) -> str:
    labels = " · ".join(escape(topics[topic].label) for topic in person.topics)
    role = f'\n            <p class="following-person-role">{escape(person.role)}</p>' if person.role else ""
    why = f'\n          <p class="following-person-why">{escape(person.why)}</p>' if person.why else ""
    channels = "".join(
        f'\n              <li>{link(channel["url"], channel["label"])}'
        + (f' <span>{escape(channel["note"])}</span>' if channel.get("note") else "")
        + "</li>"
        for channel in person.channels
    )
    feeds = " · ".join(link(feed.url, feed.label) for feed in person.feeds)
    feeds_html = f'\n          <p class="following-person-feeds">RSS: {feeds}</p>' if feeds else ""
    start = ""
    if person.start:
        works = "".join(
            f'\n              <li>{link(work["url"], work["title"])}'
            + (f' <span>{escape(work["note"])}</span>' if work.get("note") else "")
            + "</li>"
            for work in person.start
        )
        start = f'''
          <div class="following-person-list">
            <h4>Start here</h4>
            <ul>{works}
            </ul>
          </div>'''
    latest_html = ""
    if latest:
        latest_html = (
            f'\n          <p class="following-person-latest">Latest: {link(latest["url"], latest["title"])}'
            f' <span>{display_date(date.fromisoformat(latest["published"]))}</span></p>'
        )
    return f'''        <article class="following-person" id="{escape(person.id)}" data-topics="{" ".join(person.topics)}">
          <p class="following-person-topics">{labels}</p>
          <header>
            <h3>{escape(person.name)}</h3>{role}
          </header>{why}
          <div class="following-person-list">
            <h4>Follow</h4>
            <ul>{channels}
            </ul>
          </div>{start}{feeds_html}{latest_html}
        </article>'''


def render_page(page: dict, topics: Dict[str, Topic], people: List[Person], picks: List[dict], state: dict, today: date) -> str:
    feeds = {feed.url: (person, feed) for person in people for feed in person.feeds}
    # Filter again, so a changed exclude or keyword list applies to stored items.
    items = [
        item for item in state["items"]
        if item["feed"] in feeds and matches(feeds[item["feed"]][1], item["title"], item["summary"], topics)
    ]
    latest_by_person: Dict[str, dict] = {}
    for item in items:  # Newest first.
        latest_by_person.setdefault(item["person"], item)
    cards = "\n".join(render_person(person, latest_by_person.get(person.id), topics) for person in people)
    newest = max((item["first_seen"] for item in items), default=None)
    status = f"Updated daily from {len(feeds)} feeds."
    if newest:
        status += f" The newest item arrived on {display_date(date.fromisoformat(newest))}."
    title = page.get("title", "People worth following")
    lede = page.get("lede", "")
    main = f'''    <main class="following">
      <section class="following-intro" aria-labelledby="following-title">
        <p class="eyebrow">{escape(page.get("eyebrow", "Worth following"))}</p>
        <h1 id="following-title">{escape(title)}</h1>
        <p class="following-dek">{escape(lede)}</p>
      </section>

{render_topic_filter(topics)}
{render_picks(picks, {person.id: person for person in people})}{render_latest(items, feeds, topics, today)}
      <section class="following-section" aria-labelledby="people-title">
        <div class="following-section-head">
          <h2 id="people-title">People</h2>
          <p>Where each of them publishes, and what to read first. <a href="{OPML_FILE.name}">Add all their feeds to a reader (OPML)</a>.</p>
        </div>
        <div class="following-people">
{cards}
        </div>
      </section>

      <p class="following-status">{escape(status)}</p>
    </main>'''
    return f'''{GENERATED_NOTICE}<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta name="description" content="{escape(lede)}">
  <title>{escape(title)} | Gökhan Mergen</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="blog-page following-page">
  <div class="page-shell">
    <header class="site-header">
      <a class="brand" href="index.html" aria-label="Gökhan Mergen home">Gökhan <span>Mergen</span></a>

{navigation().replace(' aria-current="page"', "")}
    </header>

{main}

    <footer class="site-footer">
      <span>Gökhan Mergen (c) 2026</span>
      <a href="index.html">Back to the homepage ↑</a>
    </footer>
  </div>
  <script>
    (() => {{
      const filter = document.querySelector(".following-topics");
      const buttons = [...filter.querySelectorAll("button")];
      const show = (topic) => {{
        for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.topic === topic));
        for (const element of document.querySelectorAll("[data-topics]")) {{
          element.hidden = topic !== "all" && !element.dataset.topics.split(" ").includes(topic);
        }}
        for (const day of document.querySelectorAll(".following-day")) {{
          day.hidden = !day.querySelector(".following-item:not([hidden])");
        }}
        const picks = document.querySelector(".following-picks");
        if (picks) picks.closest("section").hidden = !picks.querySelector("li:not([hidden])");
        document.querySelector(".following-empty").hidden = Boolean(document.querySelector(".following-item:not([hidden])"));
      }};
      for (const button of buttons) {{
        button.addEventListener("click", () => {{
          show(button.dataset.topic);
          history.replaceState(null, "", button.dataset.topic === "all" ? location.pathname : `#${{button.dataset.topic}}`);
        }});
      }}
      filter.hidden = false;
      const topic = location.hash.slice(1);
      const selected = buttons.find((button) => button.dataset.topic === topic);
      if (selected) {{
        show(topic);
        filter.scrollLeft = selected.offsetLeft - filter.offsetLeft;
      }}
    }})();
  </script>
</body>
</html>
'''


def render_opml(page: dict, topics: Dict[str, Topic], people: List[Person]) -> str:
    groups = []
    for topic in topics.values():
        outlines = [
            f'      <outline type="rss" text="{escape(person.name)} · {escape(feed.label)}" title="{escape(person.name)} · {escape(feed.label)}" xmlUrl="{escape(feed.url)}"'
            + (f' htmlUrl="{escape(person.channels[0]["url"])}"' if person.channels else "")
            + "/>"
            for person in people
            if person.topics[0] == topic.id
            for feed in person.feeds
        ]
        if outlines:
            groups.append(f'    <outline text="{escape(topic.label)}">\n' + "\n".join(outlines) + "\n    </outline>")
    return f'''<?xml version="1.0" encoding="utf-8"?>
{GENERATED_NOTICE.strip()}
<opml version="2.0">
  <head>
    <title>{escape(page.get("title", "People worth following"))} · Gökhan Mergen</title>
  </head>
  <body>
{chr(10).join(groups)}
  </body>
</opml>
'''


def build(fetch_feeds: bool) -> None:
    topics, ignored = load_topics()
    page, people = load_sources(topics)
    today = datetime.now(timezone.utc).date()
    check_categories(topics, ignored)
    for topic in topics.values():
        if not any(topic.id in person.topics for person in people):
            print(f"warning: nobody in {SOURCES_FILE.name} covers the topic '{topic.label}'")
    if fetch_feeds:
        fetch_all(people, topics, today)
    state = load_state()
    PAGE_FILE.write_text(render_page(page, topics, people, load_picks(), state, today), encoding="utf-8")
    OPML_FILE.write_text(render_opml(page, topics, people), encoding="utf-8")
    print(f"Built {PAGE_FILE.name} with {len(people)} people and {OPML_FILE.name}")


if __name__ == "__main__":
    build(fetch_feeds="--fetch" in sys.argv[1:])
