---
name: substack-crosspost
description: Cross-post a blog post from gokhanmergen.com to gokhanmergen.substack.com (dateline, three subscribe widgets, tables as images, images, math), publish or update it, verify it, and audit the published posts against the blog. Use when asked to add, mirror, publish, update or check posts on Substack.
---

# Cross-posting to Substack

Every English post on gokhanmergen.com is mirrored on
**gokhanmergen.substack.com**. The Turkish translations are not mirrored.
The work happens in the Substack web editor, through Claude in Chrome, in the
owner's logged-in browser.

**Publish to the blog first:**
1. If the post has tables, render them as images (see "Tables" below) and
   commit the images with the post.
2. Push the post.
3. Wait for GitHub Pages to finish building.
4. Confirm that `https://www.gokhanmergen.com/blog-<slug>.html` serves the new
   version.

The Substack copy is built from that live page.

## Conventions the author has approved

- **Title and subtitle:** the post's `title`, with the `deck` as the
  subtitle. Substack curls straight apostrophes on its own. A subtitle longer
  than about 256 characters fails to save, so shorten it by dropping the
  final sentence.
- **Dateline:** the body starts with an italic dateline: *Originally published on
  [gokhanmergen.com](https://www.gokhanmergen.com/blog-<slug>.html) on
  Month D, YYYY.* Substack can't backdate a post; the publish dialog only
  offers future times.
- **Three subscribe widgets,** always:
  - right after the dateline;
  - just before the `##` section heading nearest the middle of the post, by
    block count. Older posts without `##` use the nearest `###`; without
    headings, the nearest paragraph that opens with a bold lead ("**3.
    Limitations…**"); failing that, the nearest paragraph. Never put it
    between a section title and its first paragraph;
  - at the very end, as a top-level block (not inside a final list).

  Each uses the default caption: "Thanks for reading Gokhan's Substack!
  Subscribe for free to receive new posts and support my work."
- **Tables become images.** Substack has no table node. Until 2026-10-19
  they became bulleted lists; the author then asked for images instead.
  - `render_tables.py` draws each table as the blog does, on white, 728 CSS
    pixels wide at 2x. It saves the tables in page order as
    `posts/images/<slug>/table-<n>.png`.
  - `buildBody` swaps each table for its image, fetched from the live site,
    so the images must be pushed first.
  - Alt text: "Table: " and the column headers.
  - Links can't be clicked in an image, so the image's caption keeps them:
    "Links: A · B · C". Each link is named after its row: the first column,
    or the second when the first is a "#" rank. Its own text is added when it
    is words ("Yale Budget Lab, earlier tracking"), not when it is a figure
    such as a rating.
- **Images** are uploaded to Substack's CDN. Their alt text is kept.
- **The whole post is mirrored,** including appendices and references.
- **Publishing:**
  - When the author asks to publish, use **Send to everyone now**:
    - email and app delivery on, not scheduled;
    - audience Everyone;
    - comments Everyone.
  - If the request doesn't mention publishing, make the draft and ask.
- **Long posts** show the editor banner "Your post may be truncated in some
  email clients" (Gmail clips large emails, with a "View entire message"
  link). Tell the author. They have published such posts anyway
  (betting-on-longevity, who-broke-the-budget).

## Steps for a new post

1. **Open a draft.** Load the core Claude in Chrome tools in one ToolSearch
   call (include `javascript_tool` and `find`). Call `tabs_context_mcp`, then
   navigate to `https://gokhanmergen.substack.com/publish/post?type=newsletter`.
   It redirects to `/publish/post/<id>`; that `<id>` is the draft id.
2. **Title and subtitle.** Click the Title field and type the title. Take a
   screenshot: a long title wraps to two lines and pushes the subtitle field
   down. Then click the subtitle field and type the deck.
3. **Tables.** If the post has tables, render them from the repository root,
   after `python3 build_blog.py`:

   ```bash
   python3 -B .claude/skills/substack-crosspost/render_tables.py <slug>
   ```

   It uses headless Chrome and Pillow. Look at each image before you commit
   and push them; this belongs in step 1 of "Publish to the blog first". After
   a table changes on the blog, render it again and push it before updating
   the Substack copy.
4. **Body.** Read `substack_helpers.js` in this folder and run its full text
   with `javascript_tool` on the editor page. Then run each of these in its
   own call:

   ```js
   await crosspost.buildBody('<slug>', 'October 18, 2026')  // tables -> images, image uploads, dateline
   await crosspost.fill()                                    // loads the body into the editor
   await crosspost.addWidgets()                              // returns the heading the middle widget precedes
   await crosspost.verify(<draft id>)                        // checks the server's copy
   ```

   `verify` must show:
   - 3 widgets;
   - `images` equal to `liveImages` (the blog's images plus its tables);
   - `links` equal to `liveLinksPlusDateline`;
   - an empty `missing` list.

   Don't trust the editor's "Saved" badge: drafts have come back empty from
   the server. Wait about 3 seconds after the editor loads before filling it.
5. **Look at it.** Take screenshots of the top (dateline and first widget)
   and of one table image with its caption. Check for the truncation banner,
   using `find`.
6. **Publish** (only when asked):
   1. Click **Continue**, at the top right.
   2. In the dialog, confirm with `javascript_tool` that "Send via email and
      the Substack app" is checked, "Schedule time" is unchecked, and both
      radios are on Everyone.
   3. Click **Send to everyone now** once.
   4. The page moves to `/publish/posts/detail/<id>/share-center`.
   5. Confirm with `GET /api/v1/drafts/<id>` that `is_published` is true and
      `email_sent_at` is set. The dialog can resize between clicks, so
      always check `is_published` before clicking again.
   6. The public URL is `https://gokhanmergen.substack.com/p/<slug from the API>`.
7. Close the browser tab you opened.

## Special content

- **Math.** The live HTML has display math as raw text in
  `<div class="blog-math">\[...\]</div>`, and inline math as `\(x\)`.
  `buildBody` refuses posts with math, so handle them by hand:
  1. Replace each math div with a placeholder paragraph before `fill()`.
  2. In `editor.getJSON()`, replace each placeholder with a `latex_block`
     node.
  3. Split inline text around an `inline_latex` node.

  Both node types take attrs `{persistentExpression: '<latex>', id: '<10
  random A–Z letters>'}`. Don't use the editor's insertLatex commands: they
  create empty nodes that crash the editor.
- **SVG images.** Render each one to a 2x PNG on a canvas, then upload the
  PNG as a data URL. `buildBody` refuses SVGs.
- **Editor JSON marks.** The editor's schema calls the marks `italic` and
  `bold`. The server's stored JSON (`/api/v1/drafts`) calls them `em` and
  `strong`. JSON copied from the server must have its marks renamed before
  `setContent`, or it fails with "Invalid JSON content".

## Updating a post that is already published

Updating a published post changes public content, so do it only when the
author asks. It sends no email, and `post_date` and `email_sent_at` stay the
same. The Substack URL slug stays too, even when the title changes, so old
links keep working.

1. Find the id with `GET /api/v1/posts?limit=50` (or from `audit()`) and open
   `/publish/post/<id>`. Wait about 3 seconds for the editor.
2. Paste `substack_helpers.js`. To paste it once per session, store its text
   in `sessionStorage` and run `(0, eval)(sessionStorage.getItem('cp'))` on
   each editor page; the page allows it.
3. Rework the body in the editor. `fixBody` works on the editor's JSON, so the
   dateline, images, math nodes and their ids stay as they are:

   ```js
   await crosspost.fixBody(<id>, '<slug>', {})                    // widgets only
   await crosspost.fixBody(<id>, '<slug>', { tables: true })      // also table lists -> images
   await crosspost.fixBody(<id>, '<slug>', { dropFrom: '<text>' }) // also cut from that block on
   ```

   It always rebuilds the three widgets. It stashes the old body in
   `sessionStorage` as `orig-<id>`. For other edits, change
   `crosspost.editor().getJSON()` and `setContent` it; JSON copied from the
   server needs its marks renamed (see "Editor JSON marks").
4. A new title goes in the `textarea.page-title` field: click it, select all
   with cmd+a, and type the title. The subtitle is `textarea.subtitle`.
5. `await crosspost.waitSaved(<id>)` waits until the server's draft has the
   new body. Don't rely on the "Saved" badge: a check made 4 seconds after
   `setContent` once still found the old body.
6. `await crosspost.update()` clicks **Update**, checks that audience and
   comments are on Everyone, and clicks **Update now**. The page then moves to
   `/publish/posts/detail/<id>/share-center`, which ends any running
   JavaScript, so check the result in a new call: `GET /api/v1/posts/<slug>`
   returns the public `body_html`.
7. When you are done, run `audit()` again.

Several posts can be updated in one `browser_batch`: navigate, run steps 2–6
in one `javascript_tool` call, wait about 4 seconds, then check that the page
reached the share center before navigating on. A check that throws stops the
batch.

## Auditing the published posts

To find Substack posts that need fixing, open any page under
`https://gokhanmergen.substack.com/publish/`, run the full text of
`substack_helpers.js`, then:

```js
await crosspost.audit()
```

It is read-only. For each published post, it compares the server's copy with
the live blog page and lists problems:
- no dateline;
- not exactly 3 subscribe widgets;
- title, or subtitle, different from the blog's title and deck;
- image count different from the blog's images plus tables (a table still
  shown as a list);
- math node count different from the blog's;
- links on one side only;
- paragraphs on one side only, which means the blog post changed after it was
  cross-posted.

It also lists blog posts with no Substack copy (`notMirrored`). Fixing a post
means updating it as below, which the author must approve.

## API endpoints used

All of these are same-origin requests from the editor page, so the browser's
login session handles authentication.

- `GET /api/v1/posts?limit=N`: published posts (id, title, `post_date`).
- `GET /api/v1/drafts/<id>`: one draft or post: `draft_title`,
  `draft_subtitle`, `draft_body` (JSON string), `is_published`,
  `email_sent_at`, `audience`, `write_comment_permissions`.
- `POST /api/v1/image` with JSON `{image: dataUrl}`: returns `{url,
  imageWidth, imageHeight, bytes}`. `url` is on
  `substack-post-media.s3.amazonaws.com`.
