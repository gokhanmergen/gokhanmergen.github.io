#!/usr/bin/env python3
"""Render a post's tables as PNG images for its Substack copy.

Substack has no table node, so the cross-post shows each table as an image.
This script takes each table from the built page blog-<slug>.html, styles it
with the site's styles.css on a white background, takes a 2x screenshot with
headless Chrome, and saves it as posts/images/<slug>/table-<n>.png, numbered
in page order. Commit and push the images: substack_helpers.js fetches them
from the live site.

    python3 -B .claude/skills/substack-crosspost/render_tables.py <slug> [<slug> ...]

Run python3 build_blog.py first, so the page matches the post's source.
"""

import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[3]
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# CSS width of the rendered table. Substack's text column is 728px wide.
WIDTH = 728
SCALE = 2
# White space kept above and below the table, in CSS pixels.
MARGIN = 12

PAGE = """<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="{css}">
<style>
  html, body {{ margin: 0; background: #fff; }}
  .shot {{ box-sizing: border-box; width: {width}px; max-width: none; padding: {margin}px 16px; }}
  .blog-table {{ margin: 0; overflow: visible; }}
  .blog-table table {{ min-width: 0; font-size: 15px; }}
  /* The row label is dark: the first column, or the second after a "#" rank. */
  .blog-table td:first-child, .ranked td:nth-child(2) {{ color: var(--ink); }}
  /* Links can't be clicked in an image, so they look like the text around them. */
  .blog-table a {{ color: inherit; font-weight: inherit; text-decoration: none; }}
</style></head>
<body><div class="blog-article-content shot {ranked}">{table}</div></body></html>
"""


def tables(slug: str) -> list:
    html = (ROOT / f"blog-{slug}.html").read_text(encoding="utf-8")
    return re.findall(r'<div class="blog-table">.*?</table></div>', html, re.S)


def screenshot(page: Path, out: Path, profile: str) -> None:
    subprocess.run(
        [
            CHROME,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--user-data-dir={profile}",
            f"--force-device-scale-factor={SCALE}",
            f"--window-size={WIDTH},6000",
            f"--screenshot={out}",
            page.as_uri(),
        ],
        check=True,
        capture_output=True,
        timeout=60,
    )


def crop(path: Path) -> Image.Image:
    """Cut the screenshot off below the table, keeping MARGIN of white."""
    img = Image.open(path).convert("RGB")
    box = ImageChops.difference(img, Image.new("RGB", img.size, "white")).getbbox()
    if box is None:
        raise SystemExit(f"{path}: screenshot is blank")
    if box[3] >= img.height - 1:
        raise SystemExit(f"{path}: table is taller than the window; raise --window-size")
    return img.crop((0, 0, img.width, box[3] + MARGIN * SCALE))


def main(slugs: list) -> None:
    css = (ROOT / "styles.css").as_uri()
    with tempfile.TemporaryDirectory() as tmp:
        for slug in slugs:
            found = tables(slug)
            if not found:
                print(f"{slug}: no tables")
                continue
            out_dir = ROOT / "posts" / "images" / slug
            out_dir.mkdir(parents=True, exist_ok=True)
            for n, table in enumerate(found, 1):
                page = Path(tmp) / f"{slug}-{n}.html"
                ranked = "ranked" if "<th>#</th>" in table else ""
                page.write_text(PAGE.format(css=css, width=WIDTH, margin=MARGIN, ranked=ranked, table=table), encoding="utf-8")
                shot = Path(tmp) / f"{slug}-{n}.png"
                screenshot(page, shot, str(Path(tmp) / "profile"))
                out = out_dir / f"table-{n}.png"
                # A table has few colors; a 64-color palette looks the same at a third of the size.
                crop(shot).quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(out, optimize=True)
                with Image.open(out) as img:
                    print(f"{out.relative_to(ROOT)}  {img.width}x{img.height}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    main(sys.argv[1:])
