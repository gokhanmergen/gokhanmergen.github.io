# Will Cheaper Machine Intelligence Raise Employment?

*Demand Expansion, Substitution, and the Early Evidence.* Gökhan Mergen, working paper, October 2026.

This folder holds the companion paper to the blog post
[A Gold Rush Without Miners?](../../blog-gold-rush-without-miners.html).

| File | What it is |
| --- | --- |
| `cheaper-intelligence.pdf` | The article and its online appendix. This is the file to link to. |
| `cheaper-intelligence.md` | Source of the article. Edit this. |
| `online-appendix.md` | Source of the online appendix. |
| `figures/figure1.png` | Figure 1, exported from the drafting document. |
| `figures/figure2.py` | Script that computes and draws Figure 2 (`figure2.pdf`, `figure2.png`). |
| `Makefile`, `header.tex` | Build instructions and page layout for the PDF. |

## Rebuilding the PDF

After editing either Markdown file, run `make` in this folder. It needs:

- pandoc 3.x and a TeX distribution with `xelatex`;
- the TeX Gyre Pagella and Latin Modern Math fonts (both ship with TeX Live).
  On macOS, XeTeX finds fonts by name only if they are installed in the
  system, so copy `texgyrepagella-*.otf` and `latinmodern-math.otf` from the
  TeX tree's `fonts/opentype/public` folder into `~/Library/Fonts`;
- Python 3 with `numpy` and `matplotlib`, only if `figures/figure2.py` changes.

Keep the PDF's file name unchanged so that links to it keep working; git
history records each version.

## Editing notes

- Inline math is written `$s_{M}$`, and display equations sit between two
  lines containing only `$$`. Equation numbers in the appendix use `\tag{A1}`.
- Dollar amounts are escaped as `\$` so they are not read as math.
- Tables are pipe tables. The number of dashes in each column of the
  separator row sets that column's relative width in the PDF.
- Figure 1 is an image. To change it, redraw it and replace the PNG.

## Dating the predictions

The article's predictions and thresholds were fixed in October 2026. The
commit that first adds this folder to the repository gives a public
timestamp for them.
