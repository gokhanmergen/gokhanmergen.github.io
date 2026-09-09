#!/usr/bin/env python3
"""Build the static blog pages from blog_posts.md."""

from __future__ import annotations

import html
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Dict, List, Optional


ROOT = Path(__file__).resolve().parent
SOURCE_PATH = ROOT / "blog_posts.md"
BRAND = "My Blog: Post AGI"
AUTHOR = "Gökhan Mergen"
GENERATED_NOTICE = """<!--
GENERATED FILE — DO NOT EDIT DIRECTLY.
Source: blog_posts.md
Generator: build_blog.py
Regenerate from the repository root with: python3 build_blog.py
Manual changes will be overwritten.
-->

"""


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

    @property
    def filename(self) -> str:
        return f"blog-{self.slug}.html"

    @property
    def display_date(self) -> str:
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
            )
        )

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
            rendered.append(f"<a{attributes}>{escape(link_text)}</a>")
        elif bold is not None:
            rendered.append(f"<strong>{escape(bold)}</strong>")
        elif italic is not None:
            rendered.append(f"<em>{escape(italic)}</em>")
        else:
            rendered.append(f"<code>{escape(code or '')}</code>")

        cursor = match.end()

    rendered.append(escape(value[cursor:]))
    return "".join(rendered)


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
) -> str:
    return f'''{GENERATED_NOTICE}<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{escape(description)}">
  <title>{escape(title)}</title>
  <link rel="stylesheet" href="styles.css">
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


def render_index(posts: List[Post]) -> str:
    items: List[str] = []
    for number, post in enumerate(posts, start=1):
        number_text = f"{number:02d}"
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
              <a class="blog-list-read" href="{escape(post.filename)}">Read article <span aria-hidden="true">→</span></a>
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
    </main>'''
    return page_shell(
        f"{BRAND} | Gökhan Mergen",
        f"{BRAND} — essays by {AUTHOR} on artificial intelligence, work, creativity, and the systems built around them.",
        main,
    )


def render_post(post: Post, number: int, next_post: Optional[Post]) -> str:
    if next_post is None:
        next_href = "pubs.html"
        next_label = "Publications"
    else:
        next_href = next_post.filename
        next_label = "Next older post"

    main = f'''    <main>
      <header class="blog-article-intro" aria-labelledby="page-title">
        <a class="blog-article-back" href="blog.html">← Back to {escape(BRAND)}</a>
        <p class="eyebrow">{escape(BRAND)} · Post {number:02d}</p>
        <h1 id="page-title">{escape(post.title)}</h1>
        <p class="blog-article-dek">{escape(post.deck)}</p>

        <div class="blog-author-row">
          <div class="blog-author">
            <img src="gokhan2.jpg" alt="Portrait of Gökhan Mergen">
            <div>
              <strong>{escape(AUTHOR)}</strong>
              <span>{escape(BRAND)}</span>
            </div>
          </div>
          <div class="blog-article-meta" aria-label="Post details">
            <span>{escape(post.display_date)} · {escape(post.read_time)}</span>
          </div>
        </div>
      </header>

      <div class="blog-article-layout">
        <article class="blog-article-content">
{render_markdown(post.body)}
        </article>
      </div>

      <section class="blog-article-footer" aria-labelledby="next-reading-title">
        <div>
          <p class="section-kicker">More from {escape(BRAND)}</p>
          <h2 id="next-reading-title">Read another article.</h2>
        </div>
        <div class="blog-closing-copy">
          <p>Browse the archive or continue with the next older post.</p>
          <div class="page-actions">
            <a class="button button-primary" href="blog.html">All blog posts <span aria-hidden="true">↗</span></a>
            <a class="button button-secondary" href="{escape(next_href)}">{escape(next_label)} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>'''

    return page_shell(
        f"{post.title} | {BRAND}",
        f"{post.title} — {post.deck}",
        main,
        footer_link="Back to the blog ↑",
        footer_href="blog.html",
    ).replace('<body class="blog-page">', '<body class="blog-page blog-post-page">')


def build() -> None:
    posts = parse_front_matter(SOURCE_PATH.read_text(encoding="utf-8"))
    (ROOT / "blog.html").write_text(render_index(posts), encoding="utf-8")

    for number, post in enumerate(posts, start=1):
        next_post = posts[number] if number < len(posts) else None
        (ROOT / post.filename).write_text(render_post(post, number, next_post), encoding="utf-8")

    print(f"Built {len(posts)} posts from {SOURCE_PATH.name}")


if __name__ == "__main__":
    build()
