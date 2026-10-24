# Blog maintenance workflow

This repository uses a source-first workflow for **My Blog: Post AGI**. The
Markdown sources in `posts/` are the authority; the HTML files are build
output.

## Files and responsibilities

- `posts/` holds the canonical source: one Markdown file per post, named
  `<slug>.md`, with the post's metadata in front matter at the top.
- `build_blog.py` parses those files and generates `blog.html` plus one
  `blog-<slug>.html` page for each post.
- `blog.html` and `blog-*.html` are generated files. Do not hand-edit them;
  regeneration will overwrite manual changes.
- Every generated HTML page begins with a `GENERATED FILE — DO NOT EDIT
  DIRECTLY` banner that identifies the source and rebuild command.
- `styles.css` controls the presentation. Change it only when the requested
  work is about layout or styling rather than article copy.

## Required protocol

For every blog change, follow this sequence:

1. Read the relevant post in `posts/<slug>.md` before editing it.
2. Make the content change in `posts/<slug>.md`, not in generated HTML.
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

Create `posts/<slug>.md`, where `<slug>` is a unique URL-safe name. The file
starts with a `---`-delimited front matter block holding the same `slug`, an
ISO publication date, and the required metadata fields. The build stops if
the file name and `slug` disagree.

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
index. `time` is also optional: a 24-hour `HH:MM` such as `time: 20:20`. It
is not shown anywhere and only orders posts that share a date, with the later
time first. Posts without one count as `00:00`, and ties keep file-name order.

`email: send` is optional too, and a new post leaves it out. Email
subscribers get a post only once the author asks for it and this line is
added (see "Comments, feed, and email subscriptions").

`title_colors` colors words of the title on the article page, such as
`title_colors: Blue #1D5BC4, Red #C1302B`: each word of the title followed by
a hex color, separated by commas. The index, the browser tab and the feed
keep the plain title.

The generator sorts posts by `date` from newest to oldest and assigns the
visible post numbers automatically. Do not hard-code or manually renumber
posts. Use the actual calendar date rather than relative labels such as “one
week ago.”

The parser supports headings, bold and italic text, ordered and unordered
lists, blockquotes, inline code, and Markdown links. Horizontal rules are not
supported; a standalone `---` line in the body renders as plain text.

A blockquote renders as a pull quote. Each further `> ` line in the same
quote goes on its own line in smaller, lighter type, for a source or a
translation:

```markdown
> “The morning breeze has things to tell you. Do not go back to sleep.”
> — **Rumi**
```

To add an image, put it in the repository root and write a line containing
only `![Alt text](image.jpg)`. It renders as a full-width figure. Remember to
commit the image file itself. Keep a chart's source files, such as SVG
originals and full-size exports, in `posts/images/<slug>/`. The page shows
only the copy in the root.

To embed an interactive page, such as a quiz, put its HTML file in the
repository root and write a line containing only
`!embed[Title for screen readers](page.html)`. It renders as a full-width
iframe. To put a caption under it in small type, add it in quotes:
`!embed[Title](page.html "Caption text")`. The page should be
self-contained, and it should post its height to the article so the frame
fits it without scrolling:

```js
parent.postMessage({ type: 'embed-height', height: Math.ceil(document.body.getBoundingClientRect().height) }, '/');
```

`blue-or-red.html` does this from a `ResizeObserver`. Inside the iframe it
also switches to the site's light theme and hides its own title, deck and
privacy note, since the post shows them (the privacy note as the caption).

Tables use standard pipe syntax: a header row, a separator row such as
`| --- | --- |`, then one row per line. Cells may contain links and emphasis.

Math is rendered with KaTeX, which loads only on posts that contain math.
Write a display equation between two lines containing only `$$`, and inline
math as `\(s_{AI}\)`. Do not use single `$` delimiters; dollar amounts in the
text stay plain.

Appendices and References sections are always folded, each in its own
fold, as the author asked on 2026-10-20. To fold a section, so that it
starts closed, put a line
containing only `::: fold` before its `##` (or `###`) heading and a line
containing only `:::` after its last line. The heading stays visible with an
arrow, and clicking it opens the section. Folds can't be nested, and the feed
excerpt stops at the first one. Count only the unfolded text for
`read_time`.

```markdown
::: fold
## Appendix A: Data

The appendix text, tables and images.
:::
```

## Adding a translation

A translation is its own file, named after its own slug (for example
`posts/example-post-tr.md`), with two extra fields:

```markdown
---
slug: example-post-tr
translation_of: example-post
lang: tr
date: 2026-09-08
category: Fikirler / Yapay Zekâ
read_time: 6 dk okuma
title: Makalenin Başlığı
deck: Makale sayfasında görünen kısa açıklama.
archive_deck: Required, but not shown in the index.
---
```

Translations are not listed or numbered separately in the index. The original
post's index entry gets a “Türkçe oku” link, both article pages link to each
other, and the translated page uses the original post's number and its
localized interface text. A translated page's “next older post” button goes to
the next older post's translation in the same language, or to the original if
there is none. Supported languages are the keys of `UI_TEXT` in
`build_blog.py` (currently `en` and `tr`).

Before writing or revising a Turkish translation, read
[`.claude/skills/turkish-translation/SKILL.md`](.claude/skills/turkish-translation/SKILL.md).
It holds the translation principles, the house conventions (categories,
terminology, spelling, numbers) and the process, including the structure check
`check_translation.py` in the same folder.

## Cross-posting to Substack

English posts are mirrored on gokhanmergen.substack.com once they are live
on the site. To add, publish or update a post there, follow
[`.claude/skills/substack-crosspost/SKILL.md`](.claude/skills/substack-crosspost/SKILL.md).
It covers the approved conventions (dateline, three subscribe widgets, tables
as images), the step-by-step editor procedure, the helper scripts beside it,
how to verify the result, and how to audit the published posts. A post with
tables needs its table images rendered and pushed before it is cross-posted.

## Comments, feed, and email subscriptions

- **Comments** are GitHub Discussions in this repository's "Announcements"
  category, embedded by [giscus](https://giscus.app). Each post's thread is
  keyed by its slug (a translation uses its original's slug), so changing a
  slug detaches the post from its existing comments. The repository and
  category IDs are in `GISCUS` in `build_blog.py`.
- **`feed.xml`** is an RSS feed of the original posts, regenerated by
  `python3 build_blog.py`. Commit it with every post change.
- **Email subscriptions** run on the Google Apps Script in
  `newsletter/Code.gs`, deployed as a web app from the owner's Google
  account. Subscribers are kept in a private "Blog subscribers" Google Sheet.
  Every hour the script reads the live `feed.xml` and emails confirmed
  subscribers each post marked `<blog:email>send</blog:email>` that it has
  not sent before. A personal Gmail account can send about 100 emails a day
  this way; an unfinished send resumes the next day.
- **Sending a post by email** happens only when the author asks. Publishing
  a post does not email anyone. To send one, add `email: send` to its front
  matter, run `python3 build_blog.py`, commit and push. The hourly run
  emails it within the hour; to send it at once, run `checkFeed` in the Apps
  Script editor after GitHub Pages has published the feed. A post is emailed
  only once, so removing the line afterwards changes nothing. The sign-up form appears once `SUBSCRIBE_URL` in
  `build_blog.py` holds the web app's `/exec` URL.
- **Changing the email script:** edit `newsletter/Code.gs`, paste it into the
  "Blog subscriptions" Apps Script project, and save. The hourly sender and
  `sendTestEmail` use the saved code right away. Changes to `doPost` or
  `doGet` (sign-up, confirm, unsubscribe) only go live after **Deploy →
  Manage deployments → Edit → New version**, which keeps the same URL.
- **Previewing the email:** run `sendTestEmail` in the Apps Script editor. It
  sends the newest post's email, marked "[Test]", to `OWNER_EMAIL` only, and
  doesn't affect subscribers or the record of sent posts.
- **Resending to a few subscribers:** in the Apps Script editor, put their
  addresses in `RESEND_TO` and run `resendLatestPost`. It sends the newest
  post's email to those of them who are confirmed subscribers, each with
  their own unsubscribe link. Empty the list again afterwards, and never fill
  it in the repository copy, since this repository is public.

## The following page

`following.html` lists people worth following on the blog's topics: where
each of them publishes, what to read first, and their newest work. Nothing
on the site links to it yet, it carries `noindex`, and it is not part of
`blog.html` or `feed.xml`, so it never reaches email subscribers.

- `following/sources.toml` holds the page's intro, the people, their
  channels, their "start here" works and their feeds. A feed can take
  `topics`, `match_topics = true` (keep only items matching those topics'
  keywords, for broad blogs), `exclude` (a regular expression for titles to
  drop), `max_items` (default 5 on the page) and `summary = false`.
- `following/interests.toml` holds the topics, their keywords, and which post
  categories each one covers. The build warns about a post category no topic
  covers, and about a topic nobody covers.
- `following/picks.toml` holds hand-written picks shown above the stream.
- `following/items.json` stores the items fetched from the feeds. Only the
  fetch writes it.
- `build_following.py` renders `following.html` and `following.opml` (all
  the feeds, for a feed reader) from those files. With `--fetch` it first
  reads every feed. It is separate from `build_blog.py`.

`.github/workflows/following.yml` runs `python3 build_following.py --fetch`
every day at 05:17 UTC, and on any push that changes `following/*.toml` or
the script, then commits the page if it changed. Because of those commits,
run `git pull --rebase` before pushing. To edit the people or topics, change
the TOML files, run `python3 build_following.py` to preview, and push; the
workflow fetches the new feeds. A feed that fails is logged in the
workflow's output and listed under `failing` in `items.json`, with the date
it started failing.

How the page came about, and the principles behind it, are in
[following.md](following.md).

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
- The updated source is in `posts/<slug>.md`.
- The generated article shows the requested title and copy.
- The index still shows the correct newest-to-oldest order and post number.
- “Next older post” and “Back to the blog” links work.
- `git diff --check` reports no whitespace errors.
- No unrelated or generated cache files are included in the upload.
