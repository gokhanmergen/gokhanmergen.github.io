# Gokhan Mergen

Personal website for Gokhan Mergen, featuring his biography, publications, quantitative finance notes, code, and photography.

## Repository contents

- `index.html` — responsive homepage and biography
- `pubs.html` — publications, patents, and related paper links
- `research.html` — research spotlight for four machine learning and AI works
- `blog.html` — “My Blog: Post AGI,” a notes archive for AI, systems, and useful automation
- `blog-autonomous-ai.html` — first post: “Biggest AI Risk: Autonomous AI”
- `blog-ai-job-apocalypse.html` — second post: “Why the Upcoming AI Job-Apocalypse Predictions Will Be Proven Wrong”
- `blog-machine-economy.html` — third post: “The Rise of the Machine Economy”
- `blog-ai-music-production.html` — fourth post: “Artificial Intelligence and Music Production”
- `blog-ai-awakening.html` — fifth post: “The Awakening of Artificial Intelligence”
- `blog-singularity-big-nothing.html` — sixth post: “Why the Technological Singularity May Be a Big Nothing”
- `photography.html` — self-hosted photography archive and viewer
- `quantBibliography.html` — quantitative finance bibliography and research notes
- `styles.css` — homepage layout and responsive styling
- `pubs/` — downloadable papers and presentation slides
- `gokhan.jpg`, `gokhan2.jpg` — homepage image assets
- `photos/` — 84 self-hosted photography originals
- `CNAME` — custom domain configuration for `www.gokhanmergen.com`

## Run locally

This is a static site with no build step or dependencies. From the repository root, start a local server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

## Deployment

The repository can be deployed as a static GitHub Pages site. Keep `CNAME` in the repository root when using the configured custom domain.
