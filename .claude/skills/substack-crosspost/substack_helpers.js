// Helpers for cross-posting a blog post to gokhanmergen.substack.com.
//
// Paste this whole file into the Substack editor page (Claude in Chrome's
// javascript_tool, on /publish/post/<id>) after typing the title and subtitle.
// It defines window.crosspost. Then call, one step per javascript_tool call:
//
//   await crosspost.buildBody('who-broke-the-budget', 'October 18, 2026')
//   await crosspost.fill()          // loads the body into the editor, math included
//   await crosspost.addWidgets()    // after dateline, mid-article, at the end
//   await crosspost.foldSections(<draft id>)  // if buildBody listed folds; then waitSaved
//   await crosspost.verify(<draft id>)
//
// buildBody uploads the post's images to Substack and swaps each table for
// its image (made by render_tables.py and pushed to the site), with the
// table's links in the caption. It does not handle SVG images; see SKILL.md.
//
//   await crosspost.audit()         // compares every published post with the blog
//
// To update a published post, open /publish/post/<id>, paste this file, then:
//
//   await crosspost.fixBody(<id>, '<slug>', { tables: true })  // or {} for widgets only
//   await crosspost.waitSaved(<id>)  // until the server has the new body
//
// or, for paragraphs or tables edited on the blog after cross-posting:
//
//   await crosspost.syncEdits(<id>, '<slug>', { paragraphs: [['<old opening>', '<new opening>']], tables: true })
//   await crosspost.update()         // clicks Update, then Update now
//
// or, when edits split, merge or rewrite many paragraphs, lists or headings:
//
//   await crosspost.resync(<id>, '<slug>')  // then waitSaved and update
//
// or, to fold appendices and references as the blog does:
//
//   await crosspost.foldSections(<id>)  // the sections the blog folds

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

  // The live page, with the article's links made absolute: a root-relative
  // link, such as /pubs/….pdf, would point at the Substack site.
  async livePage(slug) {
    const postUrl = `${this.SITE}/blog-${slug}.html`;
    const html = await fetch(postUrl, { cache: 'no-store' }).then((r) => r.text());
    const doc = new DOMParser().parseFromString(html, 'text/html');
    for (const a of doc.querySelectorAll('.blog-article-content a[href]')) a.setAttribute('href', new URL(a.getAttribute('href'), postUrl).href);
    return doc;
  },

  // A math node's id: 10 random capital letters.
  letters() {
    return Array.from({ length: 10 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
  },

  // Split the text runs of a node in the editor's JSON around inline math,
  // \(…\), which becomes inline_latex nodes.
  mathify(node) {
    if (!node.content) return node;
    const content = [];
    for (const ch of node.content) {
      if (ch.type !== 'text' || !/\\\(/.test(ch.text)) {
        content.push(this.mathify(ch));
        continue;
      }
      for (const part of ch.text.split(/(\\\(.+?\\\))/)) {
        const m = part.match(/^\\\((.+)\\\)$/);
        if (m) content.push({ type: 'inline_latex', attrs: { persistentExpression: m[1], id: this.letters() } });
        else if (part) content.push({ ...ch, text: part });
      }
    }
    return { ...node, content };
  },

  // Replace each table with <figure><img><figcaption>Links: …</figcaption>.
  // The image is posts/images/<slug>/table-<n>.png on the site. The caption
  // keeps the table's links, named after their row: the first column, or the
  // second when the first is a "#" rank.
  tablesToImages(doc, slug) {
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
            link.href = a.getAttribute('href');
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

  // Ready the live article for the editor: tables become images; each
  // display equation becomes a MATHBLOCK<n> paragraph, which fill swaps for a
  // math block (its LaTeX goes in this.math); and each folded section is
  // unwrapped, since the editor rejects <details> (foldSections folds it
  // again). Returns the folded sections' headings.
  prepare(doc, slug) {
    const art = doc.querySelector('.blog-article-content');
    const tables = this.tablesToImages(doc, slug);
    this.math = [...art.querySelectorAll('.blog-math')].map((div, i) => {
      const p = doc.createElement('p');
      p.textContent = `MATHBLOCK${i}`;
      div.replaceWith(p);
      return div.textContent.trim().replace(/^\\\[/, '').replace(/\\\]$/, '').trim();
    });
    const folds = [...art.querySelectorAll('details')].map((d) => {
      const summary = d.querySelector(':scope > summary');
      const heading = summary.textContent.trim();
      d.replaceWith(...summary.children, ...[...d.childNodes].filter((n) => n !== summary));
      return heading;
    });
    return { art, tables, folds };
  },

  // Fetch the live article, ready it (prepare), upload images, add the dateline.
  async buildBody(slug, dateText) {
    const postUrl = `${this.SITE}/blog-${slug}.html`;
    const doc = await this.livePage(slug);
    const { art, tables, folds } = this.prepare(doc, slug);

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
    const inlineMath = (art.innerHTML.match(/\\\(/g) || []).length;
    return { uploads, tables, math: this.math.length, inlineMath, folds, tablesLeft: art.querySelectorAll('table').length, htmlLength: this.bodyHtml.length };
  },

  // Load the body into the editor, then swap in the math nodes.
  async fill() {
    const ed = this.editor();
    ed.commands.setContent(this.bodyHtml, true);
    await new Promise((r) => setTimeout(r, 1500));
    const inline = (this.bodyHtml.match(/\\\(/g) || []).length;
    if (this.math.length || inline) {
      ed.commands.setContent(this.withMath(ed.getJSON()), true);
      await new Promise((r) => setTimeout(r, 2000));
    }
    const after = ed.getJSON();
    const count = (t) => (JSON.stringify(after).match(new RegExp(`"type":"${t}"`, 'g')) || []).length;
    if (count('latex_block') !== this.math.length || count('inline_latex') !== inline) {
      throw new Error(`${count('latex_block')} math blocks and ${count('inline_latex')} inline math nodes; the post has ${this.math.length} and ${inline}`);
    }
    return { nodes: after.content.length, mathBlocks: this.math.length, inlineMath: inline };
  },

  // The editor's JSON with each MATHBLOCK<n> paragraph made a latex_block
  // holding this.math[n], and inline math made inline_latex nodes.
  withMath(doc) {
    const content = doc.content.map((n) => {
      const m = n.type === 'paragraph' && this.text(n).trim().match(/^MATHBLOCK(\d+)$/);
      return m ? { type: 'latex_block', attrs: { persistentExpression: this.math[+m[1]], id: this.letters() } } : this.mathify(n);
    });
    return { ...doc, content };
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
    const raw = d.draft_body || '{"content":[]}';
    const body = JSON.parse(raw);
    // Images and math are counted inside folded sections too; widgets only at the top level.
    const count = (t) => (raw.match(new RegExp(`"type":"${t}"`, 'g')) || []).length;
    const draftText = this.text(body).replace(/\s+/g, ' ');
    const art = (await this.livePage(this.slug)).querySelector('.blog-article-content');
    const blocks = [...art.querySelectorAll('p, li, h2, h3')]
      .filter((e) => !e.closest('table'))
      .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
      .filter((t) => t.length > 20);
    return {
      title: d.draft_title,
      subtitle: d.draft_subtitle,
      widgets: body.content.filter((n) => n.type === 'subscribeWidget').length,
      images: count('captionedImage'),
      liveImages: art.querySelectorAll('figure img').length + art.querySelectorAll('table').length,
      math: count('latex_block') + count('inline_latex'),
      liveMath: art.querySelectorAll('.blog-math').length + (art.innerHTML.match(/\\\(/g) || []).length,
      folds: count('collapsedContent'),
      liveFolds: art.querySelectorAll('details').length,
      links: (raw.match(/"type":"link"/g) || []).length,
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
    const after = ed.getJSON();
    this.expected = this.fingerprint(after);
    return { replaced, midText, before: orig.content.length, after: after.content.length, widgets: this.expected.split('|')[0] };
  },

  // Bring a published post in line with edits made on the blog after it was
  // cross-posted. Each pair in `paragraphs` gives the opening words of a
  // paragraph on Substack and of its new version on the live page; that
  // paragraph is replaced. With tables: true, every table image is uploaded
  // again from the site, in order. The widgets stay where they are. The old
  // body is stashed in sessionStorage as orig-<id>.
  async syncEdits(postId, slug, { paragraphs = [], tables = false } = {}) {
    const ed = this.editor();
    const orig = ed.getJSON();
    sessionStorage.setItem(`orig-${postId}`, JSON.stringify(orig));
    const fail = (msg) => {
      ed.commands.setContent(orig, false);
      throw new Error(msg);
    };
    const c = JSON.parse(JSON.stringify(orig.content));
    const art = (await this.livePage(slug)).querySelector('.blog-article-content');
    const replaced = [];
    for (const [oldStart, newStart] of paragraphs) {
      const at = c.findIndex((n) => n.type === 'paragraph' && this.text(n).startsWith(oldStart));
      const p = [...art.querySelectorAll('p')].find((e) => e.textContent.trim().startsWith(newStart));
      if (at < 0) fail(`No Substack paragraph starts "${oldStart}"`);
      if (!p) fail(`No paragraph on the blog starts "${newStart}"`);
      ed.commands.setContent(p.outerHTML, false);
      c[at] = ed.getJSON().content[0];
      replaced.push(at);
    }
    let images = 0;
    if (tables) {
      const isTable = (n) => n.type === 'captionedImage' && JSON.stringify(n).includes('"alt":"Table: ');
      const at = c.map((n, i) => (isTable(n) ? i : -1)).filter((i) => i >= 0);
      const nodes = await this.tableNodes(slug);
      if (at.length !== nodes.length) fail(`${at.length} table images but ${nodes.length} tables`);
      at.forEach((i, k) => (c[i] = nodes[k]));
      images = nodes.length;
    }
    ed.commands.setContent({ type: 'doc', content: c }, true);
    await new Promise((r) => setTimeout(r, 2500));
    this.expected = this.fingerprint(ed.getJSON());
    return { replaced, images, nodes: c.length };
  },

  // Bring a published post's main text in line with the live page after
  // edits that split, merge or rewrite paragraphs, lists or headings, where
  // syncEdits' one-for-one swap is not enough. It lines up Substack's
  // top-level blocks with the page's by their text, keeps every block that
  // still matches as it is (images, math, table images), replaces each run of
  // changed text blocks with the page's version, and puts the three widgets
  // back by the usual rule. Only the main text is compared: the first folded
  // section and everything after it stay as they are. Inline math in a new
  // paragraph becomes inline_latex nodes. It refuses to drop or add anything
  // but text. The old body is stashed in sessionStorage as orig-<id>.
  async resync(postId, slug) {
    const ed = this.editor();
    const orig = ed.getJSON();
    sessionStorage.setItem(`orig-${postId}`, JSON.stringify(orig));
    const fail = (msg) => {
      ed.commands.setContent(orig, false);
      throw new Error(msg);
    };
    const norm = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
    const art = (await this.livePage(slug)).querySelector('.blog-article-content');

    const strip = (n) => (n.content ? { ...n, content: n.content.filter((x) => x.type !== 'subscribeWidget').map(strip) } : n);
    const c = strip(orig).content;
    while (c.length && c[c.length - 1].type === 'paragraph' && !c[c.length - 1].content) c.pop();
    if (!/^Originally published on/.test(this.text(c[0]))) fail('The body does not start with the dateline');
    let end = c.findIndex((n) => n.type === 'collapsedContent');
    if (end < 0) end = c.length;
    else if (c[end - 1].type === 'heading') end -= 1; // the folded section's visible heading
    const live = [...art.children];
    let liveEnd = live.findIndex((e) => e.tagName === 'DETAILS');
    if (liveEnd < 0) liveEnd = live.length;

    // Lists and quotes read as their items joined by spaces on both sides.
    const liveText = (e) => {
      const kids = [...e.children].filter((k) => ['P', 'LI', 'UL', 'OL'].includes(k.tagName));
      return kids.length ? kids.map(liveText).join(' ') : e.textContent;
    };
    const TEXT = ['paragraph', 'heading', 'bulletList', 'orderedList', 'blockquote'];
    const sKey = (n) => (TEXT.includes(n.type) ? 'T' + norm(this.text(n)) : n.type === 'captionedImage' ? 'I' : n.type === 'latex_block' ? 'M' : 'X' + n.type);
    const lKey = (e) => {
      if (['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'BLOCKQUOTE'].includes(e.tagName)) return 'T' + norm(liveText(e));
      if (e.tagName === 'FIGURE' || e.classList.contains('blog-table')) return 'I';
      if (e.classList.contains('blog-math')) return 'M';
      return 'X' + e.tagName;
    };
    const convert = (e) => {
      ed.commands.setContent(e.outerHTML, false);
      const nodes = ed.getJSON().content.map((n) => this.mathify(n));
      if (!nodes.length) fail(`Could not convert "${e.textContent.slice(0, 60)}"`);
      return nodes;
    };

    // Subscribe buttons added on Substack (signal-changes-form has one) have
    // no counterpart on the blog. Each stays in front of the block it preceded.
    const isButton = (n) => n.type === 'button' && n.attrs?.url === '%%checkout_url%%';
    const S = [];
    const before = [];
    let pending = [];
    for (const n of c.slice(1, end)) {
      if (isButton(n)) pending.push(n);
      else {
        S.push(n);
        before.push(pending);
        pending = [];
      }
    }

    // Longest common subsequence of block keys; what is left over are the edits.
    const L = live.slice(0, liveEnd);
    const sk = S.map(sKey);
    const lk = L.map(lKey);
    const dp = Array.from({ length: sk.length + 1 }, () => new Int32Array(lk.length + 1));
    for (let i = sk.length - 1; i >= 0; i--) {
      for (let j = lk.length - 1; j >= 0; j--) dp[i][j] = sk[i] === lk[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
    const out = [c[0]];
    const hunks = [];
    let cur = null;
    let i = 0;
    let j = 0;
    while (i < sk.length || j < lk.length) {
      if (i < sk.length && j < lk.length && sk[i] === lk[j]) {
        out.push(...before[i], S[i++]);
        j++;
        cur = null;
        continue;
      }
      if (!cur) hunks.push((cur = { removed: 0, added: 0, first: '' }));
      if (i < sk.length && (j >= lk.length || dp[i + 1][j] >= dp[i][j + 1])) {
        if (sk[i][0] !== 'T') fail(`Only on Substack, and not text: ${sk[i].slice(0, 40)}`);
        out.push(...before[i]);
        cur.removed++;
        i++;
      } else {
        if (lk[j][0] !== 'T') fail(`Only on the blog, and not text: ${lk[j].slice(0, 40)}`);
        out.push(...convert(L[j]));
        cur.first ||= lk[j].slice(1, 70);
        cur.added++;
        j++;
      }
    }
    out.push(...pending, ...c.slice(end));

    const mid = this.mid(out);
    const midText = this.text(out[mid]).slice(0, 80);
    out.push(this.widget());
    out.splice(mid, 0, this.widget());
    out.splice(1, 0, this.widget());
    ed.commands.setContent({ type: 'doc', content: out }, true);
    await new Promise((r) => setTimeout(r, 2500));
    const after = ed.getJSON();
    this.expected = this.fingerprint(after);
    const draftText = norm(this.text(after));
    const missing = [...art.querySelectorAll('p, li, h2, h3')]
      .filter((e) => !e.closest('table') && !e.closest('details'))
      .map((e) => norm(e.textContent))
      .filter((t) => t.length > 20 && !draftText.includes(t));
    return { hunks: hunks.length, removed: hunks.reduce((s, h) => s + h.removed, 0), added: hunks.reduce((s, h) => s + h.added, 0), midText, missing: missing.map((t) => t.slice(0, 80)), nodes: after.content.length };
  },

  // Fold the sections the blog folds (appendices, references) into Substack's
  // collapsible block. Each `## <prefix>...` heading stays visible; what follows
  // it goes into a collapsedContent block that opens with "Show appendix" (or
  // "Show references", "Show sources"). Without prefixes, it folds the sections the blog
  // folds. A fold ends where the blog's does, at the next folded heading or at
  // the end widget, so a closing note after the last fold stays visible.
  // Every image gets its width and height from its file name: without them,
  // an image in a block that starts closed shrinks to 300px. The old body is
  // stashed in sessionStorage as orig-<id>.
  async foldSections(postId, prefixes) {
    const ed = this.editor();
    const orig = ed.getJSON();
    sessionStorage.setItem(`orig-${postId}`, JSON.stringify(orig));
    const slug = (JSON.stringify(orig).match(/gokhanmergen\.com\/blog-([a-z0-9-]+)\.html/) || [])[1];
    if (!slug) throw new Error('No dateline link to the blog');
    const art = (await this.livePage(slug)).querySelector('.blog-article-content');
    const { content: c, folded } = this.folded(orig.content, art, prefixes);
    let sized = 0;
    const size = (n) => {
      const m = n.type === 'image2' && !n.attrs.width && (n.attrs.src || '').match(/_(\d+)x(\d+)\.\w+$/);
      if (m) {
        n.attrs.width = +m[1];
        n.attrs.height = +m[2];
        sized++;
      }
      (n.content || []).forEach(size);
    };
    c.forEach(size);
    ed.commands.setContent({ type: 'doc', content: c }, true);
    await new Promise((r) => setTimeout(r, 2500));
    const after = ed.getJSON();
    if (this.text(after).replace(/\s+/g, ' ') !== this.text(orig).replace(/\s+/g, ' ')) {
      ed.commands.setContent(orig, false);
      throw new Error('The text changed; restored the old body');
    }
    this.expected = this.fingerprint(after);
    return { folded, sized, nodes: after.content.length };
  },

  // The body's top-level blocks with the folds made (see foldSections); `art`
  // is the live article.
  folded(content, art, prefixes) {
    const norm = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
    const c = JSON.parse(JSON.stringify(content));
    if (c.some((n) => n.type === 'collapsedContent')) throw new Error('Already folded');
    const details = [...art.querySelectorAll(':scope > details')];
    const summary = (d) => norm(d.querySelector('summary').textContent);
    prefixes = (prefixes || details.map(summary)).map(norm);
    const heads = prefixes.map((p) => c.findIndex((n) => n.type === 'heading' && n.attrs.level === 2 && norm(this.text(n)).startsWith(p)));
    if (!heads.length) throw new Error('Nothing to fold');
    if (heads.some((i) => i < 0)) throw new Error(`Headings not found: ${prefixes.filter((_, k) => heads[k] < 0)}`);
    if (heads.some((h, k) => k && h <= heads[k - 1])) throw new Error('Headings out of order');
    const last = c[c.length - 1].type === 'subscribeWidget' ? c.length - 1 : c.length;
    const ends = heads.map((h, k) => {
      const end = k + 1 < heads.length ? heads[k + 1] : last;
      // On the blog, the block after this fold's <details>, if the fold ends before the next folded heading.
      const next = details.find((d) => summary(d).startsWith(prefixes[k]))?.nextElementSibling;
      if (!next || next.tagName === 'DETAILS') return end;
      const t = norm(next.textContent).slice(0, 60);
      const at = c.findIndex((n, i) => i > h && i < end && t && norm(this.text(n)).startsWith(t));
      if (at < 0) throw new Error(`The block after "${prefixes[k]}" on the blog ("${t}") is not where it should be`);
      return at;
    });
    for (let k = heads.length - 1; k >= 0; k--) {
      const h = heads[k];
      const heading = this.text(c[h]);
      const what = /^Reference/.test(heading) ? 'references' : /^Sources/.test(heading) ? 'sources' : /^Further reading/i.test(heading) ? 'further reading' : 'appendix';
      const body = c.slice(h + 1, ends[k]);
      c.splice(h + 1, body.length, { type: 'collapsedContent', attrs: { expandLabel: `Show ${what}`, collapseLabel: `Hide ${what}` }, content: body });
    }
    return { content: c, folded: heads.length };
  },

  // What waitSaved compares: the widget positions, the image sources and the text.
  fingerprint(body) {
    const widgets = body.content.map((n, i) => (n.type === 'subscribeWidget' ? i : -1)).filter((i) => i >= 0).join(',');
    const srcs = (JSON.stringify(body).match(/"src":"[^"]*"/g) || []).join(',');
    return `${widgets}|${srcs}|${this.text(body).replace(/\s+/g, ' ').trim()}`;
  },

  // Wait until the server's draft matches the editor after fixBody or
  // syncEdits. The editor's "Saved" badge can be early, and Update publishes
  // the server's copy.
  async waitSaved(postId) {
    let got = '';
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const d = await fetch(`/api/v1/drafts/${postId}`, { cache: 'no-store' }).then((r) => r.json());
      got = this.fingerprint(JSON.parse(d.draft_body));
      if (got === this.expected) return { saved: true, title: d.draft_title };
    }
    throw new Error(`The server's draft still differs from the editor (widgets at ${got.split('|')[0]}, expected ${this.expected.split('|')[0]})`);
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
