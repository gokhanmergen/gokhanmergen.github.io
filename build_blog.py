#!/usr/bin/env python3
"""Build the static blog pages from the Markdown posts in posts/."""

from __future__ import annotations

import html
import re
from dataclasses import dataclass
from datetime import date, datetime, time, timezone
from email.utils import format_datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple


ROOT = Path(__file__).resolve().parent
# One Markdown file per post, named <slug>.md.
POSTS_DIR = ROOT / "posts"
BRAND = "My Blog: Post AGI"
AUTHOR = "Gökhan Mergen"
SITE_URL = "https://www.gokhanmergen.com"
FEED_FILENAME = "feed.xml"
# Namespace for feed fields RSS has no element for, read by newsletter/Code.gs.
FEED_NAMESPACE = f"{SITE_URL}/feed"
# Comments are GitHub Discussions on this repository, rendered by giscus.
# Translations share the original post's thread.
GISCUS = {
    "repo": "gokhanmergen/gokhanmergen.github.io",
    "repo_id": "R_kgDOUQjsYw",
    "category": "Announcements",
    "category_id": "DIC_kwDOUQjsY84DHS59",
}
# Opening paragraphs included in feed.xml (and so in subscriber emails) as a
# preview: whole paragraphs until at least this many words.
EXCERPT_WORDS = 300
# The Substack publication that emails new posts. The subscribe button links
# to its sign-up page, and is only rendered while this is set.
SUBSCRIBE_URL = "https://gokhanmergen.substack.com"
# KaTeX renders LaTeX math on posts that contain it: display blocks fenced by
# $$ lines, and inline math written as \( ... \). Other pages don't load it.
KATEX_VERSION = "0.16.11"
KATEX_CDN = f"https://cdn.jsdelivr.net/npm/katex@{KATEX_VERSION}/dist"
KATEX_HEAD = f'''  <link rel="stylesheet" href="{KATEX_CDN}/katex.min.css" integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" crossorigin="anonymous">
  <script defer src="{KATEX_CDN}/katex.min.js" integrity="sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg" crossorigin="anonymous"></script>
  <script defer src="{KATEX_CDN}/contrib/auto-render.min.js" integrity="sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk" crossorigin="anonymous" onload="renderMathInElement(document.querySelector('.blog-article-content'), {{delimiters: [{{left: '\\\\[', right: '\\\\]', display: true}}, {{left: '\\\\(', right: '\\\\)', display: false}}], throwOnError: false}})"></script>
'''
# A line holding only !embed[Title](page.html) shows a page from the
# repository root, such as an interactive quiz, in an iframe; with
# !embed[Title](page.html "Caption") a small caption goes under it. The page posts
# {type: "embed-height", height} to its parent, and this script fits the
# iframe to it. Posts without an embed don't load it.
EMBED_HEAD = '''  <script>
    window.addEventListener("message", (event) => {
      if (event.origin !== location.origin || event.data?.type !== "embed-height") return;
      for (const frame of document.querySelectorAll(".blog-article-embed iframe")) {
        if (frame.contentWindow === event.source) frame.style.height = `${Math.ceil(event.data.height)}px`;
      }
    });
  </script>
'''
GENERATED_NOTICE = """<!--
GENERATED FILE — DO NOT EDIT DIRECTLY.
Source: {source}
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
        "subscribe_copy": "New posts arrive by email through my Substack. Unsubscribe anytime.",
        "subscribe_rss": "Or follow the",
        "subscribe_button": "Subscribe on Substack",
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
        "subscribe_copy": "Yeni yazılar Substack üzerinden e-postayla gelir. İstediğiniz zaman abonelikten çıkabilirsiniz. E-postalar İngilizcedir.",
        "subscribe_rss": "Ya da takip edin:",
        "subscribe_button": "Substack'te abone ol",
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
    # Orders posts that share a date; it is not shown anywhere.
    published_time: time = time(0)
    # Email subscribers get the post only once its front matter says "email: send".
    email: bool = False
    # Words of the title shown in color on the article page, with their hex
    # colors, from "title_colors: Blue #1D5BC4, Red #C1302B".
    title_colors: Tuple[Tuple[str, str], ...] = ()

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


def parse_title_colors(path: Path, fields: Dict[str, str]) -> Tuple[Tuple[str, str], ...]:
    colors = []
    for pair in filter(None, (item.strip() for item in fields.get("title_colors", "").split(","))):
        word, _, color = pair.rpartition(" ")
        if not word or not re.fullmatch(r"#[0-9A-Fa-f]{6}", color) or not re.search(rf"\b{re.escape(word)}\b", fields["title"]):
            raise ValueError(f"{path.name}: title_colors wants a word of the title and a hex color, such as 'Blue #1D5BC4', not '{pair}'")
        colors.append((word.strip(), color))
    return tuple(colors)


def parse_post(path: Path) -> Post:
    sections = re.split(r"^---\s*$", path.read_text(encoding="utf-8"), maxsplit=2, flags=re.MULTILINE)
    if len(sections) < 3 or sections[0].strip():
        raise ValueError(f"{path.name} must begin with a ---delimited front matter block")
    front_matter, body = sections[1].strip(), sections[2].strip()

    fields: Dict[str, str] = {}
    for line in front_matter.splitlines():
        if not line.strip():
            continue
        if ":" not in line:
            raise ValueError(f"Invalid front matter line in {path.name}: {line}")
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
        raise ValueError(f"Missing front matter fields in {path.name}: {', '.join(missing)}")
    if fields["slug"] != path.stem:
        raise ValueError(f"{path.name} has slug {fields['slug']}; rename the file or fix the slug")

    post = Post(
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
        published_time=time.fromisoformat(fields.get("time", "00:00")),
        email=fields.get("email") == "send",
        title_colors=parse_title_colors(path, fields),
    )
    if fields.get("email", "send") != "send":
        raise ValueError(f"{path.name}: email must be 'send' or left out, not {fields['email']}")
    if post.lang not in UI_TEXT:
        raise ValueError(f"Unsupported lang for {post.slug}: {post.lang}")
    return post


def load_posts() -> List[Post]:
    posts = [parse_post(path) for path in sorted(POSTS_DIR.glob("*.md"))]
    if not posts:
        raise ValueError(f"No posts found in {POSTS_DIR.name}/")
    return sorted(posts, key=lambda post: (post.published, post.published_time), reverse=True)


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


EMBED_LINE = re.compile(r'^!embed\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$')


def is_embed(line: str) -> bool:
    return EMBED_LINE.match(line) is not None


def has_embed(markdown: str) -> bool:
    return any(is_embed(line.strip()) for line in markdown.splitlines())


def is_unordered(line: str) -> bool:
    return line.startswith("- ") or line.startswith("* ")


def is_ordered(line: str) -> bool:
    return re.match(r"^\d+\.\s+", line) is not None


TABLE_SEPARATOR = re.compile(r"^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$")


def is_table_row(line: str) -> bool:
    return line.startswith("|")


def table_cells(line: str) -> List[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def render_table(rows: List[str]) -> str:
    header, body = table_cells(rows[0]), [table_cells(row) for row in rows[2:]]
    head_html = "".join(f"<th>{render_inline(cell)}</th>" for cell in header)
    body_html = "".join(
        "<tr>" + "".join(f"<td>{render_inline(cell)}</td>" for cell in row) + "</tr>"
        for row in body
    )
    return f'<div class="blog-table"><table><thead><tr>{head_html}</tr></thead><tbody>{body_html}</tbody></table></div>'


def has_math(markdown: str) -> bool:
    return re.search(r"^\$\$|\\\(", markdown, flags=re.MULTILINE) is not None


def is_block_start(line: str) -> bool:
    return (
        line.startswith("# ")
        or line.startswith("## ")
        or line.startswith("### ")
        or line.startswith("> ")
        or line.startswith("$$")
        or line.startswith(":::")
        or is_table_row(line)
        or is_image(line)
        or is_embed(line)
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
            # Lines after the first (a source or a translation) go on their own lines.
            quote = "<br>".join(
                [render_inline(quote_lines[0])]
                + [
                    f'<span class="blog-article-quote-source">{render_inline(quote_line)}</span>'
                    for quote_line in quote_lines[1:]
                ]
            )
            output.append(f'<p class="blog-article-emphasis">{quote}</p>')
            continue

        # "::: fold" up to a ":::" line is a section that starts closed; its
        # first line, a ## or ### heading, is what the reader clicks to open it.
        if line == "::: fold":
            end = next((i for i in range(cursor + 1, len(lines)) if lines[i].strip() == ":::"), None)
            if end is None:
                raise ValueError("A '::: fold' section has no closing ':::' line")
            heading, _, rest = render_markdown("\n".join(lines[cursor + 1 : end])).partition("\n\n")
            if not re.match(r"<h[23]>", heading):
                raise ValueError("A '::: fold' section must start with a ## or ### heading")
            output.append(f'<details class="blog-article-fold"><summary>{heading}</summary>\n\n{rest}\n\n</details>')
            cursor = end + 1
            continue

        if line.startswith(":::"):
            raise ValueError(f"Unexpected line {line!r}: a fold opens with '::: fold' and closes with ':::'")

        if line.startswith("$$"):
            math_lines = [line[2:]]
            cursor += 1
            while not math_lines[-1].rstrip().endswith("$$") and cursor < len(lines):
                math_lines.append(lines[cursor].strip())
                cursor += 1
            math = "\n".join(math_lines).rstrip()[:-2].strip()
            output.append(f'<div class="blog-math">\\[{escape(math)}\\]</div>')
            continue

        if is_table_row(line) and cursor + 1 < len(lines) and TABLE_SEPARATOR.match(lines[cursor + 1].strip()):
            rows: List[str] = []
            while cursor < len(lines) and is_table_row(lines[cursor].strip()):
                rows.append(lines[cursor].strip())
                cursor += 1
            output.append(render_table(rows))
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

        embed = EMBED_LINE.match(line)
        if embed:
            title, src, caption = embed.groups()
            if not re.fullmatch(r"[\w-]+\.html", src):
                raise ValueError(f"!embed takes a page in the repository root, such as quiz.html, not {src}")
            figcaption = f"<figcaption>{render_inline(caption)}</figcaption>" if caption else ""
            output.append(
                f'<figure class="blog-article-embed"><iframe src="{escape(src)}" title="{escape(title)}" loading="lazy"></iframe>{figcaption}</figure>'
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
    source: str = f"{POSTS_DIR.name}/*.md",
) -> str:
    return f'''{GENERATED_NOTICE.format(source=source)}<!doctype html>
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
    button = ""
    if SUBSCRIBE_URL:
        button = f'''
        <a class="button button-primary blog-subscribe-button" href="{escape(SUBSCRIBE_URL)}/subscribe" target="_blank" rel="noopener">{escape(text["subscribe_button"])}</a>'''
    return f'''      <section class="blog-subscribe" aria-labelledby="subscribe-title">
        <div>
          <p class="section-kicker">{escape(text["subscribe_kicker"])}</p>
          <h2 id="subscribe-title">{escape(text["subscribe_title" if SUBSCRIBE_URL else "follow_title"])}</h2>
          <p>{escape(text["subscribe_copy"]) + " " if SUBSCRIBE_URL else ""}{escape(text["subscribe_rss"])} <a href="{FEED_FILENAME}">RSS feed</a>.</p>
        </div>{button}
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
    """Return the post's opening paragraphs, with their section headings, as HTML.

    Lists, images and the caption right after an image are skipped, since the
    caption makes no sense without its image. A caption is a paragraph set
    entirely in italics, such as "*Source: ...*"; an ordinary paragraph after
    an image stays. A heading stays only
    if a paragraph follows it in the excerpt, so the excerpt never ends on
    one. Pull quotes stay, as plain paragraphs, since the text around them
    often refers to them. Folded sections end the excerpt.
    """
    paragraphs: List[str] = []
    words = 0
    after_image = False
    heading = None
    pull_quote = '<p class="blog-article-emphasis">'
    for block in render_markdown(post.body).split("\n\n"):
        if block.startswith("<details"):
            break
        if block.startswith(pull_quote):
            block = "<p>" + block[len(pull_quote):]
        is_caption = after_image and re.fullmatch(r"<p><em>(?:(?!</em>).)*</em></p>", block, flags=re.S) is not None
        after_image = block.startswith("<figure")
        if block.startswith(("<h2>", "<h3>")):
            heading = block
            continue
        if not block.startswith("<p>") or is_caption:
            continue
        if heading:
            paragraphs.append(heading)
            heading = None
        paragraphs.append(block)
        words += len(re.sub(r"<[^>]+>", " ", block).split())
        if words >= EXCERPT_WORDS:
            break
    return "\n".join(paragraphs)


def render_feed(posts: List[Post]) -> str:
    # newsletter/Code.gs emails only the items marked <blog:email>send</blog:email>.
    email_flag = "\n      <blog:email>send</blog:email>"
    items = "".join(
        f'''
    <item>
      <title>{escape(post.title)}</title>
      <link>{escape(post.url)}</link>
      <guid isPermaLink="true">{escape(post.url)}</guid>
      <pubDate>{format_datetime(datetime(post.published.year, post.published.month, post.published.day, tzinfo=timezone.utc))}</pubDate>
      <category>{escape(post.category)}</category>
      <description>{escape(post.deck)}</description>
      <blog:readTime>{escape(post.read_time)}</blog:readTime>{email_flag if post.email else ""}
      <content:encoded>{escape(render_excerpt(post))}</content:encoded>
    </item>'''
        for post in posts
    )
    return f'''<?xml version="1.0" encoding="utf-8"?>
{GENERATED_NOTICE.format(source=f"{POSTS_DIR.name}/*.md").strip()}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:blog="{FEED_NAMESPACE}">
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
          <h2 id="blog-index-footer-title">Papers I’ve written, and people I read.</h2>
        </div>
        <div class="blog-index-footer-links">
          <a class="blog-index-footer-link" href="pubs.html">Publications <span aria-hidden="true">→</span></a>
          <a class="blog-index-footer-link" href="following.html">People worth following <span aria-hidden="true">→</span></a>
        </div>
      </section>

{subscribe_section("en")}
    </main>'''
    return page_shell(
        f"{BRAND} | Gökhan Mergen",
        f"{BRAND} — essays by {AUTHOR} on artificial intelligence, work, creativity, and the systems built around them.",
        main,
    )


def render_title(post: Post) -> str:
    """Return the article heading, with the words in title_colors colored."""
    if not post.title_colors:
        return escape(post.title)
    colors = dict(post.title_colors)
    words = "|".join(re.escape(word) for word in colors)
    parts = re.split(rf"\b({words})\b", post.title)
    # re.split puts the matched words at the odd indexes.
    return "".join(
        f'<span style="color: {colors[part]}">{escape(part)}</span>' if index % 2 else escape(part)
        for index, part in enumerate(parts)
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
    if has_math(post.body):
        head_extra += KATEX_HEAD
    if has_embed(post.body):
        head_extra += EMBED_HEAD

    main = f'''    <main>
      <header class="blog-article-intro" aria-labelledby="page-title">
        <a class="blog-article-back" href="blog.html">{escape(text["back"])}</a>
        <p class="eyebrow">{escape(BRAND)} · {escape(text["post"])} {number:02d}</p>
        <h1 id="page-title">{render_title(post)}</h1>
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
        <article class="blog-article-content" data-slug="{escape(post.slug)}">
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
        source=f"{POSTS_DIR.name}/{post.slug}.md",
    ).replace('<body class="blog-page">', '<body class="blog-page blog-post-page">')


def build() -> None:
    all_posts = load_posts()
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
        next_versions = [next_post] + translations.get(next_post.slug, []) if next_post else []
        for version in versions:
            # Link to the next older post in the reader's language when it exists.
            next_version = next((v for v in next_versions if v.lang == version.lang), next_post)
            (ROOT / version.filename).write_text(
                render_post(version, number, next_version, versions), encoding="utf-8"
            )

    translation_count = sum(len(items) for items in translations.values())
    print(f"Built {len(posts)} posts and {translation_count} translations from {POSTS_DIR.name}/")


if __name__ == "__main__":
    build()
