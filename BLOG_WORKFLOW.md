# Blog maintenance workflow

This repository uses a source-first workflow for **My Blog: Post AGI**. The
Markdown source is the authority; the HTML files are build output.

## Files and responsibilities

- `blog_posts.md` is the canonical source for every post and its metadata.
- `build_blog.py` parses that file and generates `blog.html` plus one
  `blog-<slug>.html` page for each post.
- `blog.html` and `blog-*.html` are generated files. Do not hand-edit them;
  regeneration will overwrite manual changes.
- Every generated HTML page begins with a `GENERATED FILE — DO NOT EDIT
  DIRECTLY` banner that identifies the source and rebuild command.
- `styles.css` controls the presentation. Change it only when the requested
  work is about layout or styling rather than article copy.

## Required protocol

For every blog change, follow this sequence:

1. Read the relevant post in `blog_posts.md` before editing it.
2. Make the content change in `blog_posts.md`, not in generated HTML.
3. Run this command from the repository root:

   ```bash
   python3 build_blog.py
   ```

   This command is required every time before upload, deployment, commit, or
   push. It keeps the index, article pages, numbering, dates, and navigation in
   sync.

4. Review the generated article and index diff. Confirm that only the intended
   post and expected generated files changed.
5. Run the basic checks:

   ```bash
   git diff --check
   git status --short
   ```

6. Only after the build and checks pass should the site be uploaded or
   deployed. Commit or push only when the user or the project workflow asks
   for it.

Do not stage unrelated files such as `.DS_Store` or `__pycache__/`.

## Adding a post

Add a new `---`-delimited record to `blog_posts.md`. Use a unique URL-safe
`slug`, an ISO publication date, and the required metadata fields:

```markdown
---
slug: example-post
date: 2026-09-08
category: Ideas / AI
read_time: 6 min read
title: The Article Title
deck: A short description shown on the article page.
archive_deck: A short description shown in the blog index.
archive_title: Optional shorter title for the index.
---

The article body goes here.
```

`archive_title` is optional; if omitted, the full `title` is used in the
index. The generator sorts posts by `date` from newest to oldest and assigns
the visible post numbers automatically. Do not hard-code or manually renumber
posts. Use the actual calendar date rather than relative labels such as “one
week ago.”

The parser supports headings, bold and italic text, ordered and unordered
lists, blockquotes, inline code, and Markdown links. A standalone `---` line
marks the boundary between posts, so do not use a standalone horizontal rule
inside an article body.

## Exact-copy requests

When a user supplies replacement article text, preserve the supplied wording,
punctuation, paragraph order, headings, and attribution. Do not summarize,
soften, modernize, or editorially rewrite it unless explicitly requested.
Markdown markers may be added or adjusted for presentation, but the visible
article text must remain faithful to the supplied copy.

For copy-only changes, leave the post's existing `slug`, date, category,
reading time, and archive metadata unchanged unless the user explicitly asks
to change them. If the supplied title is different, update `title` and use
`archive_title` when a shorter index label is needed.

## Final handoff checklist

Before uploading or deploying, confirm:

- `python3 build_blog.py` completed successfully.
- The updated source is in `blog_posts.md`.
- The generated article shows the requested title and copy.
- The index still shows the correct newest-to-oldest order and post number.
- “Next older post” and “Back to the blog” links work.
- `git diff --check` reports no whitespace errors.
- No unrelated or generated cache files are included in the upload.
