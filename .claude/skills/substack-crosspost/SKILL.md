---
name: substack-crosspost
description: Cross-post a blog post from gokhanmergen.com to gokhanmergen.substack.com (dateline, three subscribe widgets, tables as lists, images, math), publish or update it, and verify it. Use when asked to add, mirror, publish or update a post on Substack.
---

# Cross-posting to Substack

Every English post on gokhanmergen.com is mirrored on
**gokhanmergen.substack.com**. The Turkish translations are not mirrored.
The work happens in the Substack web editor, through Claude in Chrome, in the
owner's logged-in browser.

**Publish to the blog first:**
1. Push the post.
2. Wait for GitHub Pages to finish building.
3. Confirm that `https://www.gokhanmergen.com/blog-<slug>.html` serves the new
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
    block count;
  - at the very end.

  Each uses the default caption: "Thanks for reading Gokhan's Substack!
  Subscribe for free to receive new posts and support my work."
- **Tables become bulleted lists.** Substack has no table node.
  - Each row is one list item made of paragraphs.
  - The first column comes first, in bold, keeping any link.
  - Then each other column gets its own paragraph: "*Header:* value".
  - A leading "#" column merges into the label ("**1. Not smoking**"), and a
    "–" rank is dropped.
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
3. **Body.** Read `substack_helpers.js` in this folder and run its full text
   with `javascript_tool` on the editor page. Then run each of these in its
   own call:

   ```js
   await crosspost.buildBody('<slug>', 'October 18, 2026')  // tables -> lists, image uploads, dateline
   await crosspost.fill()                                    // loads the body into the editor
   await crosspost.addWidgets()                              // returns the heading the middle widget precedes
   await crosspost.verify(<draft id>)                        // checks the server's copy
   ```

   `verify` must show:
   - 3 widgets;
   - `images` equal to `liveImages`;
   - `links` equal to `liveLinksPlusDateline`;
   - an empty `missing` list.

   Don't trust the editor's "Saved" badge: drafts have come back empty from
   the server. Wait about 3 seconds after the editor loads before filling it.
4. **Look at it.** Take screenshots of the top (dateline and first widget)
   and of one converted table. Check for the truncation banner, using `find`.
5. **Publish** (only when asked):
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
6. Close the browser tab you opened.

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

1. Find the id with `GET /api/v1/posts?limit=50` and open
   `/publish/post/<id>`.
2. Stash the old `draft_body` (for example in `sessionStorage`) so you can
   reuse its dateline, widget nodes and `inline_latex` ids. Rename the marks
   from `em`/`strong` to `italic`/`bold`.
3. `setContent` the new body and splice in the dateline and widgets.
4. Click the orange **Update** button, then **Update now** in the dialog.
   - This sends no email.
   - `post_date` and `email_sent_at` stay the same.
   - The page redirects to the share center, which kills any running
     JavaScript call, so verify afterwards with `GET /api/v1/drafts/<id>`.

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
