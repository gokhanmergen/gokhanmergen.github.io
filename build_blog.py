#!/usr/bin/env python3
"""Build the static blog pages from blog_posts.md."""

from __future__ import annotations

import html
import re
from dataclasses import dataclass
from datetime import date, datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from typing import Dict, List, Optional


ROOT = Path(__file__).resolve().parent
SOURCE_PATH = ROOT / "blog_posts.md"
BRAND = "My Blog: Post AGI"
AUTHOR = "Gökhan Mergen"
SITE_URL = "https://www.gokhanmergen.com"
FEED_FILENAME = "feed.xml"
# Comments are GitHub Discussions on this repository, rendered by giscus.
# Translations share the original post's thread.
GISCUS = {
    "repo": "gokhanmergen/gokhanmergen.github.io",
    "repo_id": "R_kgDOUQjsYw",
    "category": "Announcements",
    "category_id": "DIC_kwDOUQjsY84DHS59",
}
# The /exec URL of the newsletter/Code.gs Apps Script web app. The email
# sign-up form is only rendered once this is set.
# Opening paragraphs included in feed.xml (and so in subscriber emails) as a
# preview: whole paragraphs until at least this many words.
EXCERPT_WORDS = 150
SUBSCRIBE_URL = "https://script.google.com/macros/s/AKfycbyMgkWyLDugpKs2FhQ5tvIEUmPvQk8MXuIIiCxF0XAPpWb6Ice00VOj39yuu2wRJv6WTA/exec"
GENERATED_NOTICE = """<!--
GENERATED FILE — DO NOT EDIT DIRECTLY.
Source: blog_posts.md
Generator: build_blog.py
Regenerate from the repository root with: python3 build_blog.py
Manual changes will be overwritten.
-->

"""
TURKISH_MONTHS = (
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
)
UI_TEXT = {
    "en": {
        "back": f"← Back to {BRAND}",
        "post": "Post",
        "details": "Post details",
        "portrait": f"Portrait of {AUTHOR}",
        "kicker": f"More from {BRAND}",
        "another": "Read another article.",
        "browse": "Browse the archive or continue with the next older post.",
        "all_posts": "All blog posts",
        "next_older": "Next older post",
        "publications": "Publications",
        "footer": "Back to the blog ↑",
        "read_in": "Read in English",
        "comments": "Comments",
        "subscribe_kicker": "Subscribe",
        "subscribe_title": "Get new posts by email.",
        "follow_title": "Follow new posts.",
        "subscribe_copy": "One email when a new post is published. Unsubscribe anytime.",
        "subscribe_rss": "Or follow the",
        "email_label": "Email address",
        "subscribe_button": "Subscribe",
        "subscribe_sending": "Subscribing…",
        "subscribe_sent": "Almost done: check your inbox for a confirmation link.",
        "subscribe_failed": "Something went wrong. Please try again later.",
    },
    "tr": {
        "back": "← Bloga dön",
        "post": "Yazı",
        "details": "Yazı bilgileri",
        "portrait": f"{AUTHOR} portresi",
        "kicker": "Blogdan daha fazlası",
        "another": "Başka bir yazı okuyun.",
        "browse": "Arşive göz atın ya da bir önceki yazıyla devam edin.",
        "all_posts": "Tüm yazılar",
        "next_older": "Bir önceki yazı",
        "publications": "Yayınlar",
        "footer": "Bloga dön ↑",
        "read_in": "Türkçe oku",
        "comments": "Yorumlar",
        "subscribe_kicker": "Abone ol",
        "subscribe_title": "Yeni yazıları e-postayla alın.",
        "follow_title": "Yeni yazıları takip edin.",
        "subscribe_copy": "Yeni bir yazı yayımlandığında tek bir e-posta. İstediğiniz zaman abonelikten çıkabilirsiniz. E-postalar İngilizcedir.",
        "subscribe_rss": "Ya da takip edin:",
        "email_label": "E-posta adresi",
        "subscribe_button": "Abone ol",
        "subscribe_sending": "Abone olunuyor…",
        "subscribe_sent": "Neredeyse bitti: onay bağlantısı için gelen kutunuza bakın.",
        "subscribe_failed": "Bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
    },
}


@dataclass(frozen=True)
class Post:
    slug: str
    published: date
    category: str
    read_time: str
    title: str
    deck: str
    archive_deck: str
    archive_title: str
    body: str
    lang: str = "en"
    translation_of: Optional[str] = None

    @property
    def filename(self) -> str:
        return f"blog-{self.slug}.html"

    @property
    def url(self) -> str:
        return f"{SITE_URL}/{self.filename}"

    @property
    def display_date(self) -> str:
        if self.lang == "tr":
            return f"{self.published.day} {TURKISH_MONTHS[self.published.month - 1]} {self.published.year}"
        return self.published.strftime("%b %-d, %Y")


def escape(value: str) -> str:
    return html.escape(value, quote=True)


def parse_front_matter(source: str) -> List[Post]:
    sections = re.split(r"^---\s*$", source, flags=re.MULTILINE)
    posts: List[Post] = []

    if len(sections) < 3:
        raise ValueError("blog_posts.md does not contain a post front matter block")

    for index in range(1, len(sections) - 1, 2):
        front_matter = sections[index].strip()
        body = sections[index + 1].strip()
        if not front_matter:
            continue

        fields: Dict[str, str] = {}
        for line in front_matter.splitlines():
            if not line.strip():
                continue
            if ":" not in line:
                raise ValueError(f"Invalid front matter line: {line}")
            key, value = line.split(":", 1)
            fields[key.strip()] = value.strip()

        required = (
            "slug",
            "date",
            "category",
            "read_time",
            "title",
            "deck",
            "archive_deck",
        )
        missing = [key for key in required if not fields.get(key)]
        if missing:
            raise ValueError(f"Missing front matter fields for {fields.get('slug', 'post')}: {', '.join(missing)}")

        posts.append(
            Post(
                slug=fields["slug"],
                published=date.fromisoformat(fields["date"]),
                category=fields["category"],
                read_time=fields["read_time"],
                title=fields["title"],
                deck=fields["deck"],
                archive_deck=fields["archive_deck"],
                archive_title=fields.get("archive_title", fields["title"]),
                body=body,
                lang=fields.get("lang", "en"),
                translation_of=fields.get("translation_of"),
            )
        )
        if posts[-1].lang not in UI_TEXT:
            raise ValueError(f"Unsupported lang for {posts[-1].slug}: {posts[-1].lang}")

    if not posts:
        raise ValueError("No posts found in blog_posts.md")

    slugs = [post.slug for post in posts]
    if len(set(slugs)) != len(slugs):
        raise ValueError("Post slugs must be unique")

    return sorted(posts, key=lambda post: post.published, reverse=True)


INLINE_TOKEN = re.compile(
    r"\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*([^*]+?)\*|`([^`]+?)`"
)


def render_inline(value: str) -> str:
    rendered: List[str] = []
    cursor = 0

    for match in INLINE_TOKEN.finditer(value):
        rendered.append(escape(value[cursor : match.start()]))
        link_text, link_target, bold, italic, code = match.groups()

        if link_text is not None:
            safe_target = link_target
            if not safe_target.startswith(("http://", "https://", "/", "#")):
                safe_target = "#"
            external = safe_target.startswith(("http://", "https://"))
            attributes = f' href="{escape(safe_target)}"'
            if external:
                attributes += ' target="_blank" rel="noopener noreferrer"'
            rendered.append(f"<a{attributes}>{render_inline(link_text)}</a>")
        elif bold is not None:
            rendered.append(f"<strong>{render_inline(bold)}</strong>")
        elif italic is not None:
            rendered.append(f"<em>{render_inline(italic)}</em>")
        else:
            rendered.append(f"<code>{escape(code or '')}</code>")

        cursor = match.end()

    rendered.append(escape(value[cursor:]))
    return "".join(rendered)


IMAGE_LINE = re.compile(r"^!\[([^\]]*)\]\(([^)\s]+)\)$")


def is_image(line: str) -> bool:
    return IMAGE_LINE.match(line) is not None


def is_unordered(line: str) -> bool:
    return line.startswith("- ") or line.startswith("* ")


def is_ordered(line: str) -> bool:
    return re.match(r"^\d+\.\s+", line) is not None


def is_block_start(line: str) -> bool:
    return (
        line.startswith("# ")
        or line.startswith("## ")
        or line.startswith("### ")
        or line.startswith("> ")
        or is_image(line)
        or is_unordered(line)
        or is_ordered(line)
    )


def render_markdown(markdown: str) -> str:
    lines = markdown.strip().splitlines()
    output: List[str] = []
    cursor = 0

    while cursor < len(lines):
        line = lines[cursor].strip()
        if not line:
            cursor += 1
            continue

        if line.startswith("### "):
            output.append(f"<h3>{render_inline(line[4:].strip())}</h3>")
            cursor += 1
            continue

        if line.startswith("## "):
            output.append(f"<h2>{render_inline(line[3:].strip())}</h2>")
            cursor += 1
            continue

        if line.startswith("# "):
            output.append(f"<h2>{render_inline(line[2:].strip())}</h2>")
            cursor += 1
            continue

        if line.startswith("> "):
            quote_lines: List[str] = []
            while cursor < len(lines) and lines[cursor].strip().startswith("> "):
                quote_lines.append(lines[cursor].strip()[2:].strip())
                cursor += 1
            quote = " ".join(quote_lines)
            output.append(f'<p class="blog-article-emphasis">{render_inline(quote)}</p>')
            continue

        image = IMAGE_LINE.match(line)
        if image:
            alt, src = image.groups()
            if src.startswith(("javascript:", "data:")):
                src = "#"
            output.append(
                f'<figure class="blog-article-figure"><img src="{escape(src)}" alt="{escape(alt)}" loading="lazy"></figure>'
            )
            cursor += 1
            continue

        if is_unordered(line):
            items: List[str] = []
            while cursor < len(lines) and is_unordered(lines[cursor].strip()):
                items.append(lines[cursor].strip()[2:].strip())
                cursor += 1
            output.append("<ul>" + "".join(f"<li>{render_inline(item)}</li>" for item in items) + "</ul>")
            continue

        if is_ordered(line):
            items = []
            while cursor < len(lines) and is_ordered(lines[cursor].strip()):
                item = re.sub(r"^\d+\.\s+", "", lines[cursor].strip())
                items.append(item)
                cursor += 1
            output.append("<ol>" + "".join(f"<li>{render_inline(item)}</li>" for item in items) + "</ol>")
            continue

        paragraph: List[str] = []
        while cursor < len(lines):
            current = lines[cursor].strip()
            if not current or (paragraph and is_block_start(current)):
                break
            paragraph.append(current)
            cursor += 1
        if paragraph:
            output.append(f"<p>{render_inline(' '.join(paragraph))}</p>")
        else:
            cursor += 1

    return "\n\n".join(output)


def navigation() -> str:
    return """      <nav class="site-nav" aria-label="Primary navigation">
        <a class="nav-link" href="index.html#about">About</a>
        <a class="nav-link" href="blog.html" aria-current="page">My Blog</a>
        <a class="nav-link" href="pubs.html">Publications</a>
        <a class="nav-link" href="https://www.linkedin.com/in/gokhanmergen/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a class="nav-link" href="quantBibliography.html">Quant finance</a>
        <a class="nav-link" href="https://github.com/gokhanmergen/" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="nav-link" href="photography.html">Photography</a>
      </nav>"""


def page_shell(
    title: str,
    description: str,
    main: str,
    footer_link: str = "Back to the homepage ↑",
    footer_href: str = "index.html",
    lang: str = "en",
    head_extra: str = "",
) -> str:
    return f'''{GENERATED_NOTICE}<!doctype html>
<html lang="{escape(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{escape(description)}">
  <title>{escape(title)}</title>
  <link rel="alternate" type="application/rss+xml" title="{escape(BRAND)}" href="{FEED_FILENAME}">
{head_extra}  <link rel="stylesheet" href="styles.css">
</head>
<body class="blog-page">
  <div class="page-shell">
    <header class="site-header">
      <a class="brand" href="index.html" aria-label="Gökhan Mergen home">Gökhan <span>Mergen</span></a>

{navigation()}
    </header>

{main}

    <footer class="site-footer">
      <span>Gökhan Mergen (c) 2026</span>
      <a href="{escape(footer_href)}">{escape(footer_link)}</a>
    </footer>
  </div>
</body>
</html>
'''


def subscribe_section(lang: str) -> str:
    text = UI_TEXT[lang]
    form = ""
    if SUBSCRIBE_URL:
        form = f'''
        <form class="blog-subscribe-form" action="{escape(SUBSCRIBE_URL)}" method="post" data-sending="{escape(text["subscribe_sending"])}" data-sent="{escape(text["subscribe_sent"])}" data-failed="{escape(text["subscribe_failed"])}">
          <label class="visually-hidden" for="subscribe-email">{escape(text["email_label"])}</label>
          <input id="subscribe-email" type="email" name="email" required maxlength="254" autocomplete="email" placeholder="you@example.com">
          <input class="blog-subscribe-trap" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="button button-primary" type="submit">{escape(text["subscribe_button"])}</button>
          <p class="blog-subscribe-status" role="status" aria-live="polite"></p>
        </form>
        <script>
          document.querySelector(".blog-subscribe-form").addEventListener("submit", async (event) => {{
            event.preventDefault();
            const form = event.currentTarget;
            const status = form.querySelector(".blog-subscribe-status");
            form.querySelector("button").disabled = true;
            status.textContent = form.dataset.sending;
            try {{
              await fetch(form.action, {{ method: "POST", mode: "no-cors", body: new URLSearchParams(new FormData(form)) }});
              form.reset();
              status.textContent = form.dataset.sent;
            }} catch (error) {{
              status.textContent = form.dataset.failed;
            }}
            form.querySelector("button").disabled = false;
          }});
        </script>'''
    return f'''      <section class="blog-subscribe" aria-labelledby="subscribe-title">
        <div>
          <p class="section-kicker">{escape(text["subscribe_kicker"])}</p>
          <h2 id="subscribe-title">{escape(text["subscribe_title" if SUBSCRIBE_URL else "follow_title"])}</h2>
          <p>{escape(text["subscribe_copy"]) + " " if SUBSCRIBE_URL else ""}{escape(text["subscribe_rss"])} <a href="{FEED_FILENAME}">RSS feed</a>.</p>
        </div>{form}
      </section>'''


def comments_section(post: Post) -> str:
    attributes = {
        "src": "https://giscus.app/client.js",
        "data-repo": GISCUS["repo"],
        "data-repo-id": GISCUS["repo_id"],
        "data-category": GISCUS["category"],
        "data-category-id": GISCUS["category_id"],
        "data-mapping": "specific",
        "data-term": post.translation_of or post.slug,
        "data-strict": "1",
        "data-reactions-enabled": "1",
        "data-emit-metadata": "0",
        "data-input-position": "top",
        "data-theme": "light",
        "data-lang": post.lang,
        "data-loading": "lazy",
        "crossorigin": "anonymous",
    }
    script_attributes = " ".join(f'{name}="{escape(value)}"' for name, value in attributes.items())
    return f'''      <section class="blog-comments" aria-labelledby="comments-title">
        <h2 id="comments-title">{escape(UI_TEXT[post.lang]["comments"])}</h2>
        <script {script_attributes} async></script>
      </section>'''


def render_excerpt(post: Post) -> str:
    """Return the post's opening paragraphs as HTML, skipping headings and images."""
    paragraphs: List[str] = []
    words = 0
    for block in render_markdown(post.body).split("\n\n"):
        if not block.startswith("<p>"):
            continue
        paragraphs.append(block)
        words += len(re.sub(r"<[^>]+>", " ", block).split())
        if words >= EXCERPT_WORDS:
            break
    return "\n".join(paragraphs)


def render_feed(posts: List[Post]) -> str:
    items = "".join(
        f'''
    <item>
      <title>{escape(post.title)}</title>
      <link>{escape(post.url)}</link>
      <guid isPermaLink="true">{escape(post.url)}</guid>
      <pubDate>{format_datetime(datetime(post.published.year, post.published.month, post.published.day, tzinfo=timezone.utc))}</pubDate>
      <category>{escape(post.category)}</category>
      <description>{escape(post.deck)}</description>
      <content:encoded>{escape(render_excerpt(post))}</content:encoded>
    </item>'''
        for post in posts
    )
    return f'''<?xml version="1.0" encoding="utf-8"?>
{GENERATED_NOTICE.strip()}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>{escape(BRAND)}</title>
    <link>{SITE_URL}/blog.html</link>
    <atom:link href="{SITE_URL}/{FEED_FILENAME}" rel="self" type="application/rss+xml"/>
    <description>Essays by {escape(AUTHOR)} on artificial intelligence, work, creativity, and the systems built around them.</description>
    <language>en</language>{items}
  </channel>
</rss>
'''


def render_index(posts: List[Post], translations: Dict[str, List[Post]]) -> str:
    items: List[str] = []
    for number, post in enumerate(posts, start=1):
        number_text = f"{number:02d}"
        translation_links = "".join(
            f'\n              <a class="blog-list-read blog-list-translation" href="{escape(t.filename)}" hreflang="{t.lang}" lang="{t.lang}">{escape(UI_TEXT[t.lang]["read_in"])} <span aria-hidden="true">→</span></a>'
            for t in translations.get(post.slug, [])
        )
        items.append(
            f'''          <article class="blog-list-post" id="{escape(post.slug)}">
            <div class="blog-list-meta">
              <span class="blog-list-number">{number_text}</span>
              <time datetime="{post.published.isoformat()}">{escape(post.display_date)}</time>
              <span>{escape(post.category)}</span>
            </div>
            <div class="blog-list-body">
              <h3><a href="{escape(post.filename)}">{escape(post.archive_title)}</a></h3>
              <p>{escape(post.archive_deck)}</p>
              <a class="blog-list-read" href="{escape(post.filename)}">Read article <span aria-hidden="true">→</span></a>{translation_links}
            </div>
          </article>'''
        )

    main = f'''    <main class="blog-index">
      <section class="blog-index-intro" aria-labelledby="blog-index-title">
        <p class="eyebrow">{escape(BRAND)} · {len(posts)} posts</p>
        <h1 id="blog-index-title">Imagining possibilities for a post-AGI world.</h1>
      </section>

      <section class="blog-archive" id="archive-start" aria-labelledby="archive-title">
        <h2 class="visually-hidden" id="archive-title">Blog posts</h2>
        <div class="blog-post-list">
{chr(10).join(items)}
        </div>
      </section>

      <section class="blog-index-footer" aria-labelledby="blog-index-footer-title">
        <div>
          <p class="section-kicker">Elsewhere on the site</p>
          <h2 id="blog-index-footer-title">More work on models and systems.</h2>
        </div>
        <a class="blog-index-footer-link" href="pubs.html">Publications <span aria-hidden="true">→</span></a>
      </section>

{subscribe_section("en")}
    </main>'''
    return page_shell(
        f"{BRAND} | Gökhan Mergen",
        f"{BRAND} — essays by {AUTHOR} on artificial intelligence, work, creativity, and the systems built around them.",
        main,
    )


def render_post(post: Post, number: int, next_post: Optional[Post], versions: List[Post]) -> str:
    text = UI_TEXT[post.lang]
    if next_post is None:
        next_href = "pubs.html"
        next_label = text["publications"]
    else:
        next_href = next_post.filename
        next_label = text["next_older"]

    alternates = [version for version in versions if version is not post]
    lang_links = "".join(
        f'\n            <a class="blog-article-lang" href="{escape(v.filename)}" hreflang="{v.lang}" lang="{v.lang}">{escape(UI_TEXT[v.lang]["read_in"])}</a>'
        for v in alternates
    )
    head_extra = "".join(
        f'  <link rel="alternate" hreflang="{v.lang}" href="{escape(v.filename)}">\n'
        for v in versions
    ) if alternates else ""

    main = f'''    <main>
      <header class="blog-article-intro" aria-labelledby="page-title">
        <a class="blog-article-back" href="blog.html">{escape(text["back"])}</a>
        <p class="eyebrow">{escape(BRAND)} · {escape(text["post"])} {number:02d}</p>
        <h1 id="page-title">{escape(post.title)}</h1>
        <p class="blog-article-dek">{escape(post.deck)}</p>

        <div class="blog-author-row">
          <div class="blog-author">
            <img src="gokhan2.jpg" alt="{escape(text["portrait"])}">
            <div>
              <strong>{escape(AUTHOR)}</strong>
              <span>{escape(BRAND)}</span>
            </div>
          </div>
          <div class="blog-article-meta" aria-label="{escape(text["details"])}">
            <span>{escape(post.display_date)} · {escape(post.read_time)}</span>{lang_links}
          </div>
        </div>
      </header>

      <div class="blog-article-layout">
        <article class="blog-article-content">
{render_markdown(post.body)}
        </article>
      </div>

{subscribe_section(post.lang)}

{comments_section(post)}

      <section class="blog-article-footer" aria-labelledby="next-reading-title">
        <div>
          <p class="section-kicker">{escape(text["kicker"])}</p>
          <h2 id="next-reading-title">{escape(text["another"])}</h2>
        </div>
        <div class="blog-closing-copy">
          <p>{escape(text["browse"])}</p>
          <div class="page-actions">
            <a class="button button-primary" href="blog.html">{escape(text["all_posts"])} <span aria-hidden="true">↗</span></a>
            <a class="button button-secondary" href="{escape(next_href)}">{escape(next_label)} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>'''

    return page_shell(
        f"{post.title} | {BRAND}",
        f"{post.title} — {post.deck}",
        main,
        footer_link=text["footer"],
        footer_href="blog.html",
        lang=post.lang,
        head_extra=head_extra,
    ).replace('<body class="blog-page">', '<body class="blog-page blog-post-page">')


def build() -> None:
    all_posts = parse_front_matter(SOURCE_PATH.read_text(encoding="utf-8"))
    posts = [post for post in all_posts if post.translation_of is None]
    original_slugs = {post.slug for post in posts}
    translations: Dict[str, List[Post]] = {}
    for post in all_posts:
        if post.translation_of is None:
            continue
        if post.translation_of not in original_slugs:
            raise ValueError(f"{post.slug} is a translation of unknown post {post.translation_of}")
        translations.setdefault(post.translation_of, []).append(post)

    (ROOT / "blog.html").write_text(render_index(posts, translations), encoding="utf-8")
    (ROOT / FEED_FILENAME).write_text(render_feed(posts), encoding="utf-8")

    for number, post in enumerate(posts, start=1):
        next_post = posts[number] if number < len(posts) else None
        versions = [post] + translations.get(post.slug, [])
        for version in versions:
            (ROOT / version.filename).write_text(
                render_post(version, number, next_post, versions), encoding="utf-8"
            )

    translation_count = sum(len(items) for items in translations.values())
    print(f"Built {len(posts)} posts and {translation_count} translations from {SOURCE_PATH.name}")


if __name__ == "__main__":
    build()
