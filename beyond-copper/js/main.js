'use strict';
// =====================================================================
//  MAIN: loader, two-disk audio clock, scene timeline, background
//  depacking of Disk 2, adaptive resolution, keys
// =====================================================================
(async () => {
  const $ = id => document.getElementById(id);
  const ui = $('ui'), status = $('status'), fill = $('fill'), go = $('go'), hud = $('hud'), errEl = $('err'), canvas = $('c');
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
  let dead = false;                      // set by a fatal error: the render loops stop instead of failing again every frame
  const guru = e => {
    dead = true; console.error(e); ui.style.display = ''; ui.classList.remove('hidden');
    status.innerHTML = '<span style="color:#f33">SOFTWARE FAILURE. &nbsp;GURU MEDITATION #8000000' + (Math.random() * 9 | 0) + '</span>';
    errEl.textContent = String((e && e.message) || e);
  };
  window.addEventListener('error', ev => guru(ev.error || ev.message));

  // The start/end screen is drawn with PIX into a 320x256 canvas, so the very first thing on screen is already 1985.
  const ld = $('ld'), lctx = ld.getContext('2d'), limg = lctx.createImageData(PIX.W, PIX.H);
  function paintUI() {
    if (ui.classList.contains('hidden') || ui.style.display === 'none') return;
    const P = PIX, X = P.hex, t = performance.now() / 1000, err = errEl.textContent, WHITE = X(0xFFF), BLUE = X(0x05A), ORANGE = X(0xF80);
    const GOLD = [0xFFC, 0xFF6, 0xFD2, 0xFA0, 0xE70, 0xB40, 0x820, 0x510].map(X);
    P.clear(BLUE);
    P.rect(0, 0, 320, 11, WHITE); P.text('NEON BLITTER : BEYOND THE COPPER', 4, 2, BLUE);
    P.rect(294, 1, 10, 9, BLUE); P.rect(296, 3, 6, 5, WHITE); P.rect(307, 1, 10, 9, BLUE); P.rect(309, 3, 6, 2, WHITE);
    P.centre('BEYOND THE COPPER', 44, (r, i, sh) => sh === 2 ? X(0xFFE) : sh === 3 ? X(0x520) : GOLD[Math.min(7, Math.max(0, Math.round(3.5 + 3.5 * Math.sin(r * 0.42 - t * 3 + i * 0.5))))], { font: P.font16 });
    P.centre('A TWO-DISK MEGADEMO BY NEON BLITTER', 68, ORANGE); P.centre('DISK 1: THE DEMOS    DISK 2: THE GAMES', 82, X(0x9CF));
    if (err) {
      const on = (t * 1.5 | 0) % 2; P.rect(8, 104, 304, 52, X(0x000)); if (on) { P.rect(8, 104, 304, 3, X(0xF00)); P.rect(8, 153, 304, 3, X(0xF00)); P.rect(8, 104, 3, 52, X(0xF00)); P.rect(309, 104, 3, 52, X(0xF00)); }
      P.centre('SOFTWARE FAILURE.', 112, X(0xF00)); P.centre(status.textContent.replace(/^.*GURU/, 'GURU').slice(0, 36), 124, X(0xF00)); P.centre(err.replace(/\s+/g, ' ').slice(0, 36), 138, X(0xF00));
    } else {
      P.centre(status.textContent.slice(0, 38), 116, WHITE);
      const p = parseFloat(fill.style.width) / 100 || 0;
      if (ui.dataset.end) P.centre('SEVEN MINUTES, TWO DISKS, NO ASSETS', 134, ORANGE);
      else { P.bevel(58, 130, 204, 12, X(0x000), X(0x026), X(0x9CF)); for (let x = 0; x < Math.round(200 * p); x++) P.rect(60 + x, 132, 1, 8, ((x >> 3) & 1) ? ORANGE : X(0xFB2)); }
      if (go.style.display !== 'none' && go.style.display !== '') {
        const on = (t * 2 | 0) % 2, lbl = go.textContent.toUpperCase(), w = lbl.length * 8 + 24, x0 = (320 - w) >> 1;
        P.bevel(x0, 158, w, 20, on ? ORANGE : X(0x000), WHITE, X(0x026)); P.text(lbl, x0 + 12, 164, on ? X(0x000) : WHITE);
      }
    }
    P.centre('SPACE PAUSE   ' + String.fromCharCode(60, 45, 32, 45, 62) + ' PART   F FULLSCREEN', 214, X(0x9CF));
    P.centre('1 2 DISK   H STATS   Q QUALITY', 226, X(0x9CF));
    P.centre('HEADPHONES ON!', 240, ORANGE);
    limg.data.set(P.buf); lctx.putImageData(limg, 0, 0);
  }
  setInterval(paintUI, 60); paintUI();
  // on-screen display: one line of pixel text that fades out (hold = stays until the next message)
  const osdEl = $('osd'), octx = osdEl.getContext('2d'); let osdTimer = 0;
  function osd(text, hold) {
    const f = PIX.font8, s = String(text).toUpperCase(), sc = Math.max(2, Math.round(innerHeight / 300));
    osdEl.width = s.length * 8 + 12; osdEl.height = 14; osdEl.style.width = osdEl.width * sc + 'px'; osdEl.style.height = 14 * sc + 'px';
    octx.fillStyle = 'rgba(0,0,0,.72)'; octx.fillRect(0, 0, osdEl.width, 14);
    for (let i = 0; i < s.length; i++) { const g = s.charCodeAt(i) - 32; if (g <= 0 || g >= 64) continue;
      for (let r = 0; r < 8; r++) { octx.fillStyle = `hsl(${40 - 3 * r},100%,${78 - 5 * r}%)`;
        for (let c = 0; c < 8; c++) if (f.mask[g * 64 + r * 8 + c]) octx.fillRect(6 + i * 8 + c, 3 + r, 1, 1); } }
    osdEl.classList.add('on'); clearTimeout(osdTimer);
    if (!hold) osdTimer = setTimeout(() => osdEl.classList.remove('on'), 1300);
  }
  ui.addEventListener('click', () => { if (go.style.display !== 'none' && go.style.display !== '') go.onclick && go.onclick(); });

  const PAT = MUSIC.PAT, AT2 = LEY.AT, TOTAL = AT2 + LEY.LEN;
  const SC = window.SCENES || [];
  const params = new URLSearchParams(location.search), startT = +params.get('t') || 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = innerWidth * dpr, h = innerHeight * dpr;
    const s = Math.min(1, Math.sqrt(3840 * 2160 / (w * h)));
    canvas.width = Math.round(w * s); canvas.height = Math.round(h * s);
  };
  resize(); window.addEventListener('resize', resize);

  try {
    G.init(canvas); PIX.init();
    // dev: ?only=run,shmup initialises just the scenes whose name contains one of these (the rest stay black)
    const only = (params.get('only') || '').toLowerCase().split(',').filter(Boolean);
    for (const s of SC) { if (only.length && !only.some(k => s.name.toLowerCase().includes(k))) { s.skip = true; continue; } if (s.init) { status.textContent = 'COMPILING ' + s.name.toUpperCase() + '...'; await nextFrame(); s.init(); } }
  } catch (e) { guru(e); return; }
  // one continuous timeline in seconds: Disk 1 parts are in patterns, Disk 2 parts in bar times
  SC.forEach(s => { [s.t0, s.t1] = s.range ? s.range() : [s.from * PAT, s.to * PAT]; });
  SC.sort((a, b) => a.t0 - b.t0);
  SC.forEach((s, i) => { s.t1 = i < SC.length - 1 ? SC[i + 1].t0 : TOTAL; });
  const sceneAt = t => SC.find(s => t >= s.t0 && t < s.t1) || SC[SC.length - 1];

  // ------------------------------ one frame ------------------------------
  let tgt = null, quality = 1, scaleNow = 1;
  function frame(t, extra) {
    const sc = sceneAt(t), lt = t - sc.t0, dur = sc.t1 - sc.t0, d2 = t - AT2;
    const W = canvas.width, H = canvas.height; scaleNow = (sc.scale || 1) * quality;
    tgt = G.ensure(tgt, W * scaleNow, H * scaleNow, { depth: true });
    const env = sc.disk === 2
      ? { kick: LEY.env('kick', d2, 8), snare: LEY.env('snare', d2, 10), hat: LEY.env('hat', d2, 20), bass: LEY.env('pluck', d2, 6), lead: LEY.env('melody', d2, 5) }
      : { kick: MUSIC.env('kick', t, 8), snare: MUSIC.env('snare', t, 10), hat: MUSIC.env('hat', t, 20), bass: MUSIC.env('bass', t, 6), lead: MUSIC.env('lead', t, 5) };
    Object.assign(G.globals, { uTime: lt, uGT: t, uKick: env.kick, uSnare: env.snare, uHat: env.hat, uBass: env.bass, uLead: env.lead,
      uBeat: sc.disk === 2 ? d2 * 2.2 : t / (60 / MUSIC.BPM), uProg: lt / dur });
    if (sc.skip) { G.bind(null); G.gl.clearColor(0, 0, 0, 1); G.gl.clear(G.gl.COLOR_BUFFER_BIT); return sc; }
    const o = sc.draw({ t, lt, dur, p: lt / dur, W: tgt.w, H: tgt.h, ...env, ...extra }, tgt) || {};
    let capA = 0;
    (sc.caps || []).forEach(c => {
      if (lt >= c.at && lt < c.at + c.len) { G.caption(c); capA = Math.max(0, Math.min(1, (lt - c.at) / 0.5, (c.at + c.len - lt) / 0.7)); }
    });
    o.cap = capA;
    if (o.fade === undefined) o.fade = Math.min(1, lt / 0.25);
    // The mirror image of the beam: a part that ended up modern and wide closes back into the 5:4 tube over its
    // last moments, so the next part's 1985 picture appears in the same glass (sc.tube = seconds).
    if (sc.tube) {
      const k = Math.min(1, Math.max(0, (lt - (dur - sc.tube)) / (sc.tube - 0.08))), e = k * k * (3 - 2 * k), asp = W / H;
      if (e > 0) { o.crt = (o.crt || 0) + (1 - (o.crt || 0)) * e; o.fa = (o.fa || asp) + (1.25 - (o.fa || asp)) * e;
        o.aberr = Math.max(o.aberr || 0, 0.22 * e); o.vig = (o.vig ?? 0.6) + (0.35 - (o.vig ?? 0.6)) * e; }
    }
    G.post(o.tex || tgt, o, W, H);
    return sc;
  }

  // dev: ?still=<seconds> shows one frozen moment without audio (&run=1 lets time advance; window.__t seeks)
  if (params.has('still')) {
    MUSIC.prepare(); ui.style.display = 'none';
    const run = params.has('run'), p0 = performance.now(); window.__t = +params.get('still'); window.__frames = 0;
    const loop = () => { if (dead) return; requestAnimationFrame(loop); try { frame(window.__t + (run ? (performance.now() - p0) / 1000 : 0)); window.__frames++; } catch (e) { guru(e); } };
    requestAnimationFrame(loop);
    // dev: await __bench() -> GPU milliseconds per frame at the current canvas size and time
    window.__bench = (n = 30) => { const gl = G.gl, px = new Uint8Array(4), t0 = performance.now();
      for (let i = 0; i < n; i++) { frame(window.__t + i * 0.016); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
      return +((performance.now() - t0) / n).toFixed(2); };
    return;
  }

  let song;
  try {
    song = await MUSIC.render((p, msg) => { fill.style.width = (p * 100).toFixed(1) + '%'; status.textContent = msg + '  ' + Math.floor(p * 100) + '%'; });
  } catch (e) { guru(e); return; }

  status.textContent = 'READY. INSERT DISK... OR JUST CLICK';
  go.style.display = 'inline-block';
  if (!params.has('autostart')) await new Promise(res => {
    const k = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); done(); } };
    const done = () => { window.removeEventListener('keydown', k); res(); };
    go.onclick = done; window.addEventListener('keydown', k);
  });

  // --------------------------- audio clock ---------------------------
  const AC = window.AudioContext || window.webkitAudioContext, ac = new AC();
  const toBuffer = s => { const b = ac.createBuffer(2, s.N, s.SR); b.copyToChannel(s.L, 0); b.copyToChannel(s.R, 1); return b; };
  const ab1 = toBuffer(song); song = null;
  let ab2 = null, gen2 = LEY.start(), prog2 = 0;               // Disk 2 depacks in the background, a few ms per frame
  let src1 = null, src2 = null, startAt = 0, offset = 0;
  let showHud = false, qMode = 0, ended = false, holding = false, pendingSeek = AT2;
  const stopAll = () => { [src1, src2].forEach(s => { if (s) { try { s.stop(); } catch (e) { /* not started */ } s.disconnect(); } }); src1 = src2 = null; };
  const clock = () => offset + (ac.currentTime - startAt);
  const schedule2 = () => {
    if (!ab2 || src2) return;
    const tn = clock(); src2 = ac.createBufferSource(); src2.buffer = ab2; src2.connect(ac.destination);
    if (tn < AT2) src2.start(ac.currentTime + (AT2 - tn)); else src2.start(0, tn - AT2);
  };
  const play = from => {
    stopAll(); offset = Math.max(0, Math.min(from, TOTAL - 0.1)); startAt = ac.currentTime;
    holding = false; pendingSeek = Math.max(AT2, offset);
    if (offset < MUSIC.LEN) { src1 = ac.createBufferSource(); src1.buffer = ab1; src1.connect(ac.destination); src1.start(0, offset); }
    schedule2();
  };
  const now = () => clock() - (ac.outputLatency || ac.baseLatency || 0);
  if (ac.state === 'suspended') { ac.resume(); window.addEventListener('pointerdown', () => ac.resume(), { once: true }); }
  play(startT);
  ui.classList.add('hidden'); go.style.display = 'none';

  // ------------------------------ controls ------------------------------
  const Q = ['auto', 1, 0.75, 0.5];
  const seek = from => { ended = false; delete ui.dataset.end; ui.classList.add('hidden'); go.style.display = 'none'; play(from); };
  const jump = s => { seek(s.t0); if (ac.state !== 'running') ac.resume(); osd(`${SC.indexOf(s) + 1}/${SC.length}  ${s.title || s.name}`); };
  // the pointer disappears while the demo plays and nobody moves it
  let idleTimer = 0;
  const wake = () => { document.body.classList.remove('idle'); clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!ended) document.body.classList.add('idle'); }, 2200); };
  window.addEventListener('pointermove', wake); wake();
  canvas.addEventListener('dblclick', () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); });
  window.addEventListener('keydown', e => {
    if (e.repeat && [' ', 'f', 'F', 'q', 'Q'].includes(e.key)) return;
    const t = now(), s = sceneAt(t), i = SC.indexOf(s);
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === ' ') { e.preventDefault(); if (ended) { seek(0); ac.resume(); } else if (ac.state === 'running') { ac.suspend(); osd('PAUSED', true); } else { ac.resume(); osd('PLAY'); } }
    else if (e.key === 'ArrowRight' && i < SC.length - 1) { e.preventDefault(); jump(SC[i + 1]); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); jump(t - s.t0 > 2 || i === 0 ? s : SC[i - 1]); }
    else if (e.key === 'Home' || e.key === '1') { e.preventDefault(); jump(SC[0]); }
    else if (e.key === '2') jump(sceneAt(AT2));
    else if (e.key === 'f' || e.key === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
    else if (e.key === 'h' || e.key === 'H') { showHud = !showHud; hud.style.display = showHud ? 'block' : 'none'; }
    else if (e.key === 'q' || e.key === 'Q') { qMode = (qMode + 1) % Q.length; if (Q[qMode] !== 'auto') quality = Q[qMode];
      osd('QUALITY ' + (Q[qMode] === 'auto' ? 'AUTO' : Q[qMode] * 100 + '%')); }
  });
  go.onclick = () => { seek(0); ac.resume(); };

  // ------------------------------ main loop ------------------------------
  let last = performance.now(), acc = 0, frames = 0, fps = 0, lastAdj = 0;
  function loop() {
    if (dead) return;
    requestAnimationFrame(loop);
    const pnow = performance.now(), dt = pnow - last; last = pnow;
    if (dt > 250) { acc = 0; frames = 0; lastAdj = pnow; }     // the tab was hidden or the machine stalled: not a GPU verdict
    else { acc += dt; frames++; }
    if (acc > 1000) {
      fps = frames * 1000 / acc;
      if (Q[qMode] === 'auto' && pnow - lastAdj > 1500 && !holding) {
        if (fps < (gen2 ? 44 : 50) && quality > 0.45) { quality = Math.max(0.45, quality - 0.1); lastAdj = pnow; }   // while Disk 2 depacks, small dips are CPU, not GPU
        else if (fps > 58 && quality < 1) { quality = Math.min(1, quality + 0.05); lastAdj = pnow; }
      }
      acc = 0; frames = 0;
    }
    let t = Math.max(0, now());
    // background depacking of Disk 2 (faster while the viewer is waiting at the disk change)
    if (gen2) {
      try {
        const r = MUSIC.engine.step(gen2, holding ? 60 : 4);
        if (r.done) { ab2 = toBuffer(r.value); gen2 = null; prog2 = 1; if (holding) { holding = false; play(pendingSeek); t = Math.max(0, now()); } else schedule2(); }
        else prog2 = r.value.p;
      } catch (e) { guru(e); return; }
    }
    if (!ab2 && t >= AT2) { holding = true; t = AT2; }
    if (t >= TOTAL - 0.05 && !ended) {
      ended = true; ui.dataset.end = '1'; ui.classList.remove('hidden'); document.body.classList.remove('idle');
      status.textContent = 'THE END.  THANKS FOR WATCHING.'; go.textContent = 'WATCH AGAIN'; go.style.display = 'inline-block';
    }
    let sc;
    try { sc = frame(Math.min(t, TOTAL - 0.001), { wait: holding ? prog2 : undefined }); } catch (e) { guru(e); return; }
    if (showHud) {
      const d2 = t - AT2, where = sc.disk === 2 ? `disk 2  bar ${LEY.barAt(d2)}  ${LEY.bpm(LEY.barAt(d2))} bpm` : `disk 1  pattern ${Math.floor(t / PAT)}  row ${Math.floor((t % PAT) / MUSIC.ROW)}`;
      hud.textContent = `${fps.toFixed(0)} fps  ${canvas.width}x${canvas.height}  scene ${(scaleNow * 100).toFixed(0)}% (${Q[qMode]})\n${sc.name}  ${t.toFixed(2)}s  ${where}` +
        (ab2 ? '' : `\ndisk 2 depacking ${(prog2 * 100).toFixed(0)}%`);
    }
  }
  requestAnimationFrame(loop);
})();
