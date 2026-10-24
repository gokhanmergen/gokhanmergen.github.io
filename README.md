# Gokhan Mergen

Personal website for Gokhan Mergen, featuring his biography, publications, quantitative finance notes, code, and photography.

## Repository contents

- `index.html` — responsive homepage with an interactive biography timeline
- `timeline.js` — hover/tap/keyboard behavior for the homepage biography timeline
- `pubs.html` — publications, patents, and related paper links
- `blog.html` — “My Blog: Post AGI,” a notes archive for AI, systems, and useful automation
- `posts/` — canonical Markdown source, one file per blog post with its metadata
- `build_blog.py` — dependency-free generator for the blog index and article pages
- `BLOG_WORKFLOW.md` — maintenance protocol for future agents adding or updating posts
- `blog-<slug>.html` — generated article pages, one for each post and translation in `posts/`
- `photography.html` — self-hosted photography archive and viewer
- `quantBibliography.html` — quantitative finance bibliography and research notes
- `following.html` — page of people worth following, linked from the bottom of the blog index and refreshed daily (see BLOG_WORKFLOW.md)
- `following.opml` — every feed on the following page, for importing into a feed reader
- `following/` — the following page's sources: people, topics, picks, and the stored feed items
- `build_following.py` — dependency-free generator for `following.html` and `following.opml`; `--fetch` reads the feeds first
- `.github/workflows/following.yml` — GitHub Action that refreshes the following page every day
- `following.md` — the prompts, progress, and principles behind the following page
- `styles.css` — homepage layout and responsive styling
- `pubs/` — downloadable papers and presentation slides
- `gokhan.jpg`, `gokhan2.jpg` — homepage image assets
- `photos/` — 84 self-hosted photography originals
- `CNAME` — custom domain configuration for `www.gokhanmergen.com`

## Run locally

This is a static site with no runtime dependencies. The blog pages are generated from the Markdown files in `posts/`. After editing a post, regenerate the index and article pages from the repository root:

```bash
python3 build_blog.py
```

To rebuild the following page from its stored items, run `python3 build_following.py`; add `--fetch` to read the feeds first.

Then start a local server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

For the complete source, build, validation, and upload protocol, see [BLOG_WORKFLOW.md](BLOG_WORKFLOW.md).

## Deployment

The repository can be deployed as a static GitHub Pages site. Always run `python3 build_blog.py` after editing blog content and before every upload or deployment. Keep `CNAME` in the repository root when using the configured custom domain. A GitHub Action commits the refreshed following page to `main` every day, so run `git pull --rebase` before pushing.
