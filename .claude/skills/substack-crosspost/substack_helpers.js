// Helpers for cross-posting a blog post to gokhanmergen.substack.com.
//
// Paste this whole file into the Substack editor page (Claude in Chrome's
// javascript_tool, on /publish/post/<id>) after typing the title and subtitle.
// It defines window.crosspost. Then call, one step per javascript_tool call:
//
//   await crosspost.buildBody('who-broke-the-budget', 'October 18, 2026')
//   await crosspost.fill()          // loads the body into the editor
//   await crosspost.addWidgets()    // after dateline, mid-article, at the end
//   await crosspost.verify(<draft id>)
//
// buildBody uploads the post's images to Substack and swaps each table for
// its image (made by render_tables.py and pushed to the site), with the
// table's links in the caption. It does not handle math or SVG images; see
// SKILL.md for those.
//
//   await crosspost.audit()         // compares every published post with the blog
//
// To update a published post, open /publish/post/<id>, paste this file, then:
//
//   await crosspost.fixBody(<id>, '<slug>', { tables: true })  // or {} for widgets only
//   await crosspost.waitSaved(<id>)  // until the server has the new body
//   await crosspost.update()         // clicks Update, then Update now

window.crosspost = {
  SITE: 'https://www.gokhanmergen.com',
  CAPTION: "Thanks for reading Gokhan's Substack! Subscribe for free to receive new posts and support my work.",

  editor() {
    return document.querySelector('.ProseMirror').editor;
  },

  // Plain text of a node in Substack's JSON. Inline math reads \(…\), as on the blog.
  text(n) {
    if (n.type === 'inline_latex') return `\\(${n.attrs.persistentExpression}\\)`;
    if (n.text) return n.text;
    return (n.content || []).map((c) => this.text(c)).join(n.type === 'paragraph' || n.type === 'heading' ? '' : ' ');
  },

  async livePage(slug) {
    const html = await fetch(`${this.SITE}/blog-${slug}.html`, { cache: 'no-store' }).then((r) => r.text());
    return new DOMParser().parseFromString(html, 'text/html');
  },

  // Replace each table with <figure><img><figcaption>Links: …</figcaption>.
  // The image is posts/images/<slug>/table-<n>.png on the site. The caption
  // keeps the table's links, named after their row: the first column, or the
  // second when the first is a "#" rank.
  tablesToImages(doc, slug) {
    const postUrl = `${this.SITE}/blog-${slug}.html`;
    const tables = [...doc.querySelectorAll('.blog-article-content div.blog-table')];
    tables.forEach((wrap, i) => {
      const table = wrap.querySelector('table');
      const headers = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
      const labelCol = headers[0] === '#' ? 1 : 0;
      const links = [];
      for (const tr of table.querySelectorAll('tbody tr')) {
        const cells = [...tr.children];
        const labelCell = cells[labelCol];
        const rowName = (labelCell.querySelector('a') || labelCell).textContent.split(': ')[0].trim();
        cells.forEach((td, c) => {
          for (const a of td.querySelectorAll('a')) {
            const text = a.textContent.trim();
            // A link elsewhere in the row is named after the row; its own text is
            // added when it is words, like "earlier tracking", not "4.06 · 35k".
            const name = c === labelCol ? text.split(': ')[0] : /[a-z]{3}/i.test(text) ? `${rowName}, ${text}` : rowName;
            const link = doc.createElement('a');
            link.href = new URL(a.getAttribute('href'), postUrl).href;
            link.textContent = name;
            links.push(link);
          }
        });
      }
      const fig = doc.createElement('figure');
      const img = doc.createElement('img');
      img.setAttribute('src', `${this.SITE}/posts/images/${slug}/table-${i + 1}.png`);
      img.setAttribute('alt', `Table: ${headers.filter((h) => h !== '#').join(', ')}`);
      fig.appendChild(img);
      if (links.length) {
        const cap = doc.createElement('figcaption');
        cap.append('Links: ');
        links.forEach((link, k) => cap.append(...(k ? [' · ', link] : [link])));
        fig.appendChild(cap);
      }
      wrap.replaceWith(fig);
    });
    return tables.length;
  },

  // Fetch the live article, swap tables for images, upload images, add the dateline.
  async buildBody(slug, dateText) {
    const postUrl = `${this.SITE}/blog-${slug}.html`;
    const doc = await this.livePage(slug);
    const art = doc.querySelector('.blog-article-content');
    if (art.querySelector('.blog-math') || /\\\(/.test(art.textContent)) {
      throw new Error('Post has math: follow the math steps in SKILL.md');
    }
    const tables = this.tablesToImages(doc, slug);

    // Upload each image to Substack's CDN and point the <img> at it.
    const uploads = [];
    for (const img of art.querySelectorAll('figure img')) {
      const abs = new URL(img.getAttribute('src'), postUrl).href;
      if (abs.endsWith('.svg')) throw new Error(`SVG image ${abs}: render it to PNG first (SKILL.md)`);
      const res = await fetch(abs, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${abs}: ${res.status}. Are the table images pushed? (render_tables.py)`);
      const blob = await res.blob();
      const dataUrl = await new Promise((res) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.readAsDataURL(blob);
      });
      const up = await fetch('/api/v1/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      }).then((r) => r.json());
      uploads.push({ src: abs, url: up.url });
      img.setAttribute('src', up.url);
      img.removeAttribute('loading');
    }

    const dateline = `<p><em>Originally published on <a href="${postUrl}">gokhanmergen.com</a> on ${dateText}.</em></p>`;
    this.slug = slug;
    this.bodyHtml = dateline + art.innerHTML;
    return { uploads, tables, tablesLeft: art.querySelectorAll('table').length, htmlLength: this.bodyHtml.length };
  },

  async fill() {
    this.editor().commands.setContent(this.bodyHtml, true);
    await new Promise((r) => setTimeout(r, 1500));
    return { nodes: this.editor().getJSON().content.length };
  },

  widget() {
    return {
      type: 'subscribeWidget',
      attrs: { url: '%%checkout_url%%', text: 'Subscribe', language: 'en' },
      content: [{ type: 'ctaCaption', content: [{ type: 'text', text: this.CAPTION }] }],
    };
  },

  // Where the middle widget goes: before the h2 nearest the middle of the body.
  // Without h2s, an h3; without headings, a paragraph opening with a bold lead
  // ("**3. Limitations…**"); failing that, any paragraph.
  mid(c) {
    const nearest = (is) => {
      const idx = c.map((n, i) => (i > 2 && is(n) ? i : -1)).filter((i) => i >= 0);
      return idx.reduce((best, i) => (Math.abs(i - c.length / 2) < Math.abs(best - c.length / 2) ? i : best), idx[0]);
    };
    const lead = (n) => n.type === 'paragraph' && n.content && (n.content[0].marks || []).some((m) => m.type === 'bold');
    const mid = [
      (n) => n.type === 'heading' && n.attrs.level === 2,
      (n) => n.type === 'heading' && n.attrs.level === 3,
      lead,
      (n) => n.type === 'paragraph',
    ].reduce((found, is) => (found === undefined ? nearest(is) : found), undefined);
    if (!(mid > 1)) throw new Error('No place for the middle widget');
    return mid;
  },

  // Three widgets: after the dateline, mid-article (see mid), at the end.
  async addWidgets() {
    const editor = this.editor();
    const json = editor.getJSON();
    const c = json.content;
    if (c.some((n) => n.type === 'subscribeWidget')) throw new Error('Widgets already present');
    const mid = this.mid(c);
    const midHeading = this.text(c[mid]);
    c.push(this.widget());
    c.splice(mid, 0, this.widget());
    c.splice(1, 0, this.widget());
    editor.commands.setContent(json, true);
    await new Promise((r) => setTimeout(r, 2000));
    const after = editor.getJSON().content;
    return { midHeading, widgets: after.map((n, i) => (n.type === 'subscribeWidget' ? i : -1)).filter((i) => i >= 0), nodes: after.length };
  },

  // Check the server's copy of the draft against the live article.
  async verify(draftId) {
    await new Promise((r) => setTimeout(r, 3000));
    const d = await fetch(`/api/v1/drafts/${draftId}`, { cache: 'no-store' }).then((r) => r.json());
    const body = JSON.parse(d.draft_body || '{"content":[]}');
    const count = (t) => body.content.filter((n) => n.type === t).length;
    const draftText = this.text(body).replace(/\s+/g, ' ');
    const art = (await this.livePage(this.slug)).querySelector('.blog-article-content');
    const blocks = [...art.querySelectorAll('p, li, h2, h3')]
      .filter((e) => !e.closest('table'))
      .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
      .filter((t) => t.length > 20);
    return {
      title: d.draft_title,
      subtitle: d.draft_subtitle,
      widgets: count('subscribeWidget'),
      images: count('captionedImage'),
      liveImages: art.querySelectorAll('figure img').length + art.querySelectorAll('table').length,
      links: (JSON.stringify(body).match(/"type":"link"/g) || []).length,
      liveLinksPlusDateline: art.querySelectorAll('a').length + 1,
      textBlocksChecked: blocks.length,
      missing: blocks.filter((t) => !draftText.includes(t)).map((t) => t.slice(0, 80)),
      published: d.is_published,
    };
  },

  // A list made from a table before 2026-10-19: every item's second paragraph
  // starts with an italic "Header:".
  isTableList(n) {
    return n.type === 'bulletList' && n.content.every((li) => {
      const t = li.content[1]?.content?.[0];
      return t && (t.marks || []).some((m) => m.type === 'italic') && /:\s*$/.test(t.text || '');
    });
  },

  // Upload the live post's table images and return them as editor nodes. It
  // parses them with the editor's own rules, which replaces the editor's
  // content without saving; fixBody puts the whole body back.
  async tableNodes(slug) {
    const doc = await this.livePage(slug);
    const n = this.tablesToImages(doc, slug);
    const figs = [...doc.querySelectorAll('.blog-article-content figure')]
      .filter((f) => f.querySelector('img').getAttribute('src').includes(`/posts/images/${slug}/table-`));
    for (const f of figs) {
      const img = f.querySelector('img');
      const res = await fetch(img.getAttribute('src'), { cache: 'no-store' });
      if (!res.ok) throw new Error(`${img.getAttribute('src')}: ${res.status}. Are the table images pushed?`);
      const blob = await res.blob();
      const dataUrl = await new Promise((r) => {
        const fr = new FileReader();
        fr.onload = () => r(fr.result);
        fr.readAsDataURL(blob);
      });
      const up = await fetch('/api/v1/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      }).then((r) => r.json());
      if (!up.url) throw new Error(`Upload failed: ${JSON.stringify(up)}`);
      img.setAttribute('src', up.url);
    }
    this.editor().commands.setContent(figs.map((f) => f.outerHTML).join(''), false);
    const nodes = this.editor().getJSON().content.filter((x) => x.type === 'captionedImage');
    if (nodes.length !== n) throw new Error(`Parsed ${nodes.length} of ${n} tables`);
    return nodes;
  },

  // Rework a published post's body in the editor: drop every subscribe widget,
  // nested ones too (an end widget once landed inside a final list), optionally
  // cut everything from the block whose text is `dropFrom` and swap table lists
  // for table images, then add the three widgets. The old body is stashed in
  // sessionStorage as orig-<id>.
  async fixBody(postId, slug, { tables = false, dropFrom = null } = {}) {
    const ed = this.editor();
    const orig = ed.getJSON();
    sessionStorage.setItem(`orig-${postId}`, JSON.stringify(orig));
    const strip = (n) => (n.content ? { ...n, content: n.content.filter((x) => x.type !== 'subscribeWidget').map(strip) } : n);
    let c = strip(orig).content;
    const trim = () => {
      while (c.length && c[c.length - 1].type === 'paragraph' && !c[c.length - 1].content) c.pop();
    };
    trim();
    if (dropFrom) {
      const at = c.findIndex((n) => this.text(n) === dropFrom);
      if (at < 0) throw new Error(`"${dropFrom}" not found`);
      c = c.slice(0, at);
      trim();
    }
    let replaced = 0;
    if (tables) {
      const lists = c.filter((n) => this.isTableList(n));
      const nodes = await this.tableNodes(slug);
      if (lists.length !== nodes.length) {
        ed.commands.setContent(orig, false);
        throw new Error(`${lists.length} table lists but ${nodes.length} tables`);
      }
      c = c.map((n) => (lists.includes(n) ? nodes[replaced++] : n));
    }
    if (!/^Originally published on/.test(this.text(c[0]))) {
      ed.commands.setContent(orig, false);
      throw new Error('The body does not start with the dateline');
    }
    const mid = this.mid(c);
    const midText = this.text(c[mid]).slice(0, 80);
    c.push(this.widget());
    c.splice(mid, 0, this.widget());
    c.splice(1, 0, this.widget());
    ed.commands.setContent({ type: 'doc', content: c }, true);
    await new Promise((r) => setTimeout(r, 2500));
    const after = ed.getJSON().content;
    this.expectedWidgets = after.map((n, i) => (n.type === 'subscribeWidget' ? i : -1)).filter((i) => i >= 0).join(',');
    return { replaced, midText, before: orig.content.length, after: after.length, widgets: this.expectedWidgets };
  },

  // Wait until the server's draft has the widgets where fixBody put them. The
  // editor's "Saved" badge can be early, and Update publishes the server's copy.
  async waitSaved(postId) {
    let at = '';
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const d = await fetch(`/api/v1/drafts/${postId}`, { cache: 'no-store' }).then((r) => r.json());
      at = JSON.parse(d.draft_body).content.map((n, k) => (n.type === 'subscribeWidget' ? k : -1)).filter((k) => k >= 0).join(',');
      if (at === this.expectedWidgets) return { saved: true, title: d.draft_title };
    }
    throw new Error(`Server has widgets at ${at}, expected ${this.expectedWidgets}`);
  },

  // Click the orange Update button, then Update now. Returns the checked radio
  // labels (audience, comments), which should both be Everyone. The page then
  // moves to the share center; check the post with GET /api/v1/drafts/<id>.
  async update() {
    const button = (t) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === t);
    button('Update').click();
    for (let i = 0; i < 20 && !button('Update now'); i++) await new Promise((r) => setTimeout(r, 300));
    const checked = [...document.querySelectorAll('input[type=radio]:checked')].map((r) => r.closest('label')?.innerText.trim() || r.value);
    if (checked.some((t) => t !== 'Everyone')) throw new Error(`Dialog settings: ${checked}`);
    button('Update now').click();
    return { checked };
  },

  // Compare every published post with its live blog page, and list blog posts
  // with no Substack copy. Read-only. Each row's `problems` is empty when the
  // post matches the conventions in SKILL.md.
  async audit() {
    const norm = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
    const walk = (n) => this.text(n);
    const list = await fetch('/api/v1/posts?limit=50', { cache: 'no-store' }).then((r) => r.json());
    const rows = [];
    const mirrored = new Set();
    for (const p of Array.isArray(list) ? list : list.posts) {
      const d = await fetch(`/api/v1/drafts/${p.id}`, { cache: 'no-store' }).then((r) => r.json());
      const raw = d.draft_body || '{"content":[]}';
      const body = JSON.parse(raw);
      const slug = (raw.match(/gokhanmergen\.com\/blog-([a-z0-9-]+)\.html/) || [])[1];
      const row = { id: p.id, slug, url: d.canonical_url || p.canonical_url, problems: [] };
      rows.push(row);
      if (!slug) {
        row.problems.push(`no dateline link to the blog ("${d.draft_title}")`);
        continue;
      }
      mirrored.add(slug);
      const doc = await this.livePage(slug);
      const art = doc.querySelector('.blog-article-content');
      const count = (t) => (raw.match(new RegExp(`"type":"${t}"`, 'g')) || []).length;
      const draftText = norm(walk(body));
      const liveText = norm(art.textContent);

      if (!/^Originally published on/.test(walk(body.content.find((n) => n.type === 'paragraph') || {}))) row.problems.push('no dateline at the top');
      if (count('subscribeWidget') !== 3) row.problems.push(`${count('subscribeWidget')} subscribe widgets, not 3`);
      if (body.content.filter((n) => n.type === 'subscribeWidget').length !== count('subscribeWidget')) row.problems.push('a subscribe widget is nested inside another block');
      if (norm(d.draft_title) !== norm(doc.querySelector('h1').textContent)) row.problems.push(`title differs: "${d.draft_title}" vs "${doc.querySelector('h1').textContent}"`);
      const deck = norm(doc.querySelector('.blog-article-dek')?.textContent || '');
      if (!deck.startsWith(norm(d.draft_subtitle || '').replace(/\.$/, ''))) row.problems.push(`subtitle differs from the deck: "${d.draft_subtitle}"`);

      const tables = art.querySelectorAll('table').length;
      const figures = art.querySelectorAll('figure img').length;
      const images = count('captionedImage');
      if (images !== figures + tables) row.problems.push(`${images} images; the blog has ${figures} images and ${tables} tables`);
      const liveMath = art.querySelectorAll('.blog-math').length + (art.innerHTML.match(/\\\(/g) || []).length;
      const math = count('latex_block') + count('inline_latex');
      if (math !== liveMath) row.problems.push(`${math} math nodes; the blog has ${liveMath}`);
      // Compare addresses, not counts: a link over mixed formatting is stored once per text run.
      const hrefs = new Set([...raw.matchAll(/"href":"([^"]+)"/g)].map((m) => m[1]));
      const liveHrefs = new Set([...art.querySelectorAll('a')].map((a) => new URL(a.getAttribute('href'), this.SITE + '/').href));
      const lost = [...liveHrefs].filter((h) => !hrefs.has(h));
      const added = [...hrefs].filter((h) => !liveHrefs.has(h) && !h.includes(`blog-${slug}.html`));
      if (lost.length) row.problems.push(`${lost.length} blog links missing, e.g. ${lost[0]}`);
      if (added.length) row.problems.push(`${added.length} links not on the blog, e.g. ${added[0]}`);

      // Text on the blog that the Substack copy lacks, and the other way round.
      const blocks = [...art.querySelectorAll('p, li, h2, h3')].filter((e) => !e.closest('table')).map((e) => norm(e.textContent)).filter((t) => t.length > 20);
      const missing = blocks.filter((t) => !draftText.includes(t));
      const ours = [];
      const collect = (n) => {
        if (n.type === 'captionedImage' || n.type === 'subscribeWidget') return;
        if (n.type === 'paragraph' || n.type === 'heading') ours.push(norm(walk(n)));
        else (n.content || []).forEach(collect);
      };
      collect(body);
      // Table rows made into lists read "Header: value"; check the value alone.
      const extra = ours.filter((t) => t.length > 20 && !/^Originally published on/.test(t) && !liveText.includes(t) && !liveText.includes(t.replace(/^[^:]{1,40}: /, '')));
      if (missing.length) row.problems.push(`${missing.length} blog paragraphs missing or changed, e.g. "${missing[0].slice(0, 90)}"`);
      if (extra.length) row.problems.push(`${extra.length} Substack paragraphs not on the blog, e.g. "${extra[0].slice(0, 90)}"`);
    }
    const feed = new DOMParser().parseFromString(await fetch(`${this.SITE}/feed.xml`, { cache: 'no-store' }).then((r) => r.text()), 'text/xml');
    const notMirrored = [...feed.querySelectorAll('item > link')]
      .map((l) => l.textContent.match(/blog-([a-z0-9-]+)\.html/)[1])
      .filter((s) => !mirrored.has(s));
    return { posts: rows.length, rows, notMirrored };
  },
};
'crosspost helpers loaded';
