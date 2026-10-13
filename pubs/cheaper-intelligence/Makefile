# Build the PDF from the Markdown sources.
# Requires pandoc (3.x) and a TeX distribution with xelatex; Python 3 with
# matplotlib and numpy for Figure 2.

PDF  = cheaper-intelligence.pdf
SRC  = cheaper-intelligence.md online-appendix.md
FIGS = figures/figure1.png figures/figure2.pdf

$(PDF): $(SRC) $(FIGS) header.tex
	pandoc $(SRC) -o $@ \
	  --from markdown+autolink_bare_uris \
	  --shift-heading-level-by=-1 \
	  --pdf-engine=xelatex \
	  --include-in-header=header.tex \
	  -V fontfamily=fontspec -V mainfont="TeX Gyre Pagella" -V mathfont="Latin Modern Math" \
	  -V geometry:margin=1in -V fontsize=11pt -V linestretch=1.15 \
	  -V colorlinks=true -V urlcolor=linkblue -V linkcolor=linkblue

figures/figure2.pdf: figures/figure2.py
	cd figures && python3 figure2.py

clean:
	rm -f $(PDF)

.PHONY: clean
