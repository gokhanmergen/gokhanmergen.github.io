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
// buildBody uploads the post's images to Substack and turns tables into
// lists. It does not handle math or SVG images; see SKILL.md for those.

window.crosspost = {
  SITE: 'https://www.gokhanmergen.com',
  CAPTION: "Thanks for reading Gokhan's Substack! Subscribe for free to receive new posts and support my work.",

  editor() {
    return document.querySelector('.ProseMirror').editor;
  },

  // Fetch the live article, convert tables, upload images, add the dateline.
  async buildBody(slug, dateText) {
    const postUrl = `${this.SITE}/blog-${slug}.html`;
    const html = await fetch(postUrl, { cache: 'no-store' }).then((r) => r.text());
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const art = doc.querySelector('.blog-article-content');
    if (art.querySelector('.blog-math') || /\\\(/.test(art.textContent)) {
      throw new Error('Post has math: follow the math steps in SKILL.md');
    }

    // Each table row becomes one list item: first cell bold, then "*Header:* value".
    for (const wrap of [...art.querySelectorAll('div.blog-table')]) {
      const table = wrap.querySelector('table');
      const headers = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
      const ul = doc.createElement('ul');
      for (const tr of table.querySelectorAll('tbody tr')) {
        const cells = [...tr.children];
        const li = doc.createElement('li');
        const p0 = doc.createElement('p');
        const strong = doc.createElement('strong');
        strong.innerHTML = cells[0].innerHTML;
        p0.appendChild(strong);
        li.appendChild(p0);
        cells.slice(1).forEach((td, i) => {
          const p = doc.createElement('p');
          const em = doc.createElement('em');
          em.textContent = headers[i + 1] + ':';
          p.appendChild(em);
          p.append(' ');
          p.insertAdjacentHTML('beforeend', td.innerHTML);
          li.appendChild(p);
        });
        ul.appendChild(li);
      }
      wrap.replaceWith(ul);
    }

    // Upload each image to Substack's CDN and point the <img> at it.
    const uploads = [];
    for (const img of art.querySelectorAll('figure img')) {
      const abs = new URL(img.getAttribute('src'), postUrl).href;
      if (abs.endsWith('.svg')) throw new Error(`SVG image ${abs}: render it to PNG first (SKILL.md)`);
      const blob = await fetch(abs).then((r) => r.blob());
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
    return { uploads, tablesLeft: art.querySelectorAll('table').length, htmlLength: this.bodyHtml.length };
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

  // Three widgets: after the dateline, before the h2 nearest the middle, at the end.
  async addWidgets() {
    const editor = this.editor();
    const json = editor.getJSON();
    const c = json.content;
    if (c.some((n) => n.type === 'subscribeWidget')) throw new Error('Widgets already present');
    const h2s = c.map((n, i) => (n.type === 'heading' && n.attrs.level === 2 && i > 2 ? i : -1)).filter((i) => i >= 0);
    const mid = h2s.reduce((best, i) => (Math.abs(i - c.length / 2) < Math.abs(best - c.length / 2) ? i : best), h2s[0]);
    const midHeading = (c[mid].content || []).map((x) => x.text).join('');
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
    const walk = (n) => (n.text ? n.text : (n.content || []).map(walk).join(n.type === 'paragraph' || n.type === 'heading' ? '' : ' '));
    const draftText = walk(body).replace(/\s+/g, ' ');
    const html = await fetch(`${this.SITE}/blog-${this.slug}.html`, { cache: 'no-store' }).then((r) => r.text());
    const art = new DOMParser().parseFromString(html, 'text/html').querySelector('.blog-article-content');
    const blocks = [...art.querySelectorAll('p, li, h2, h3')]
      .filter((e) => !e.closest('table'))
      .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
      .filter((t) => t.length > 20);
    return {
      title: d.draft_title,
      subtitle: d.draft_subtitle,
      widgets: count('subscribeWidget'),
      images: count('captionedImage'),
      liveImages: art.querySelectorAll('figure img').length,
      links: (JSON.stringify(body).match(/"type":"link"/g) || []).length,
      liveLinksPlusDateline: art.querySelectorAll('a').length + 1,
      textBlocksChecked: blocks.length,
      missing: blocks.filter((t) => !draftText.includes(t)).map((t) => t.slice(0, 80)),
      published: d.is_published,
    };
  },
};
'crosspost helpers loaded';
