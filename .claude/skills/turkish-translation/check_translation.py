"""Compare a Turkish translation's structure against its English source.

Usage (from the repository root):
    python3 -B .claude/skills/turkish-translation/check_translation.py <slug> [--loose]

--loose lets paragraphs be split or merged freely (for a Turkish style pass);
headings, lists, blockquotes, tables, images, links and math must still match.

Checks the front matter with build_blog.parse_post, renders the body with
build_blog.render_markdown, and compares block structure, links, images and
math with posts/<slug>.md. Prints PASS or a list of problems. Writes nothing.
"""
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path.cwd()
sys.path.insert(0, str(ROOT))
import build_blog  # noqa: E402

SITE = "https://www.gokhanmergen.com/"
CATEGORIES = {
    "Agents / Economy": "Ajanlar / Ekonomi",
    "Longevity / Biotech": "Uzun Ömür / Biyoteknoloji",
    "Culture / Discovery": "Kültür / Keşif",
    "Work / AI": "Çalışma Hayatı / Yapay Zekâ",
    "Culture / AI": "Kültür / Yapay Zekâ",
    "Humanity / AI": "İnsanlık / Yapay Zekâ",
    "AI / Safety": "Yapay Zekâ / Güvenlik",
    "Longevity / Medicine": "Uzun Ömür / Tıp",
    "Futures / AI": "Gelecek / Yapay Zekâ",
    "ASI / Society": "Süper Zekâ / Toplum",
    "Mathematics / AI": "Matematik / Yapay Zekâ",
    "Economy / Agents": "Ekonomi / Ajanlar",
    "Economy / Politics": "Ekonomi / Siyaset",
    "Longevity / AI": "Uzun Ömür / Yapay Zekâ",
    "Truth / Society": "Hakikat / Toplum",
    "Ideas / Quotations": "Fikirler / Alıntılar",
    "Books / Markets": "Kitaplar / Piyasalar",
    "Career / AI": "Kariyer / Yapay Zekâ",
    "Ideas / AI futures": "Fikirler / Yapay Zekânın Geleceği",
}


def blocks(body):
    """Classify each non-blank line by its block type."""
    kinds = Counter()
    for line in body.splitlines():
        s = line.strip()
        if not s:
            continue
        if m := re.match(r"^(#{1,6})\s", s):
            kinds[f"heading h{len(m.group(1))}"] += 1
        elif build_blog.is_image(s):
            kinds["image"] += 1
        elif build_blog.is_table_row(s):
            kinds["table row"] += 1
        elif s.startswith(">"):
            kinds["blockquote line"] += 1
        elif build_blog.is_unordered(s):
            kinds["unordered item"] += 1
        elif build_blog.is_ordered(s):
            kinds["ordered item"] += 1
        elif s == "$$":
            kinds["$$ delimiter"] += 1
        else:
            kinds["paragraph or math line"] += 1
    return kinds


def urls(body):
    found = re.findall(r"\]\(([^)\s]+)\)", body)
    return Counter(found)


def expected_url(url):
    """Links to a blog post that has a Turkish version should point at it."""
    m = re.fullmatch(r"((?:https://www\.gokhanmergen\.com/)?)blog-([a-z0-9-]+)\.html(#.*)?", url)
    if m and not m.group(2).endswith("-tr") and (ROOT / "posts" / f"{m.group(2)}-tr.md").exists():
        return f"{m.group(1)}blog-{m.group(2)}-tr.html{m.group(3) or ''}"
    return url


def main(slug, loose=False):
    problems = []
    src_path = ROOT / "posts" / f"{slug}.md"
    tr_path = ROOT / "posts" / f"{slug}-tr.md"
    src = build_blog.parse_post(src_path)
    try:
        tr = build_blog.parse_post(tr_path)
    except Exception as exc:  # report and stop
        print(f"FAIL front matter: {exc}")
        return 1

    if tr.lang != "tr":
        problems.append(f"lang is {tr.lang!r}, expected 'tr'")
    if tr.translation_of != slug:
        problems.append(f"translation_of is {tr.translation_of!r}, expected {slug!r}")
    if tr.published != src.published:
        problems.append(f"date {tr.published} differs from source {src.published}")
    if tr.published_time != src.published_time:
        problems.append(f"time {tr.published_time} differs from source {src.published_time}")
    want_cat = CATEGORIES.get(src.category)
    if want_cat and tr.category != want_cat:
        problems.append(f"category {tr.category!r}, expected {want_cat!r}")
    n = re.match(r"(\d+)", src.read_time).group(1)
    if tr.read_time != f"{n} dk okuma":
        problems.append(f"read_time {tr.read_time!r}, expected '{n} dk okuma'")

    try:
        build_blog.render_markdown(tr.body)
    except Exception as exc:
        problems.append(f"render_markdown failed: {exc}")

    sb, tb = blocks(src.body), blocks(tr.body)
    for kind in sorted(set(sb) | set(tb)):
        if loose and kind == "paragraph or math line":
            if sb[kind] != tb[kind]:
                print(f"info: paragraphs/math lines: source {sb[kind]}, translation {tb[kind]}")
            continue
        if sb[kind] != tb[kind]:
            problems.append(f"{kind}: source {sb[kind]}, translation {tb[kind]}")

    su = Counter()
    for u, c in urls(src.body).items():
        su[expected_url(u)] += c
    tu = urls(tr.body)
    for u in sorted(set(su) | set(tu)):
        if su[u] != tu[u]:
            problems.append(f"link target {u}: expected {su[u]}x, found {tu[u]}x")

    src_math = re.findall(r"\\\((.+?)\\\)", src.body)
    tr_math = re.findall(r"\\\((.+?)\\\)", tr.body)
    if len(src_math) != len(tr_math):
        problems.append(f"inline math: source {len(src_math)}, translation {len(tr_math)}")
    if re.search(r"(?<![\\$])\$(?!\$)[^$\n]*[a-zA-Z_\\^{}][^$\n]*(?<!\\)\$(?!\$)", tr.body) and not re.search(
        r"(?<![\\$])\$(?!\$)[^$\n]*[a-zA-Z_\\^{}][^$\n]*(?<!\\)\$(?!\$)", src.body
    ):
        problems.append("possible single-$ math delimiters (use \\( \\) or $$ blocks)")

    prose = re.sub(r"\]\([^)]*\)", "]", tr.body)
    leftover = re.findall(r"\b(the|and|which|that|with|from|this|have|will)\b", prose)
    if len(leftover) > 15:
        problems.append(
            f"{len(leftover)} common English words remain; check for untranslated passages "
            "(proper names, titles and quotes kept in English are fine)"
        )

    if problems:
        print("FAIL")
        for p in problems:
            print(" -", p)
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], "--loose" in sys.argv[2:]))
