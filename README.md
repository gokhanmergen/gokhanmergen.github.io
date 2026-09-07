# Gokhan Mergen

Personal website for Gokhan Mergen, featuring his biography, publications, quantitative finance notes, code, and photography.

## Repository contents

- `index.html` — responsive homepage and biography
- `pubs.html` — publications, patents, and related paper links
- `quantBibliography.html` — quantitative finance bibliography and research notes
- `styles.css` — homepage layout and responsive styling
- `pubs/` — downloadable papers and presentation slides
- `gokhan.jpg`, `gokhan2.jpg` — homepage image assets
- `CNAME` — custom domain configuration for `www.gokhanmergen.com`

## Run locally

This is a static site with no build step or dependencies. From the repository root, start a local server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

## Deployment

The repository can be deployed as a static GitHub Pages site. Keep `CNAME` in the repository root when using the configured custom domain.
