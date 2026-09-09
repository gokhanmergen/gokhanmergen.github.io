# Gokhan Mergen

Personal website for Gokhan Mergen, featuring his biography, publications, quantitative finance notes, code, and photography.

## Repository contents

- `index.html` — responsive homepage with an interactive biography timeline
- `timeline.js` — hover/tap/keyboard behavior for the homepage biography timeline
- `pubs.html` — publications, patents, and related paper links
- `research.html` — research spotlight for four machine learning and AI works
- `blog.html` — “My Blog: Post AGI,” a notes archive for AI, systems, and useful automation
- `blog_posts.md` — canonical Markdown source for all blog posts and their metadata
- `build_blog.py` — dependency-free generator for the blog index and article pages
- `BLOG_WORKFLOW.md` — maintenance protocol for future agents adding or updating posts
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

This is a static site with no runtime dependencies. The blog pages are generated from `blog_posts.md`. After editing that file, regenerate the index and article pages from the repository root:

```bash
python3 build_blog.py
```

Then start a local server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

For the complete source, build, validation, and upload protocol, see [BLOG_WORKFLOW.md](BLOG_WORKFLOW.md).

## Deployment

The repository can be deployed as a static GitHub Pages site. Always run `python3 build_blog.py` after editing blog content and before every upload or deployment. Keep `CNAME` in the repository root when using the configured custom domain.
