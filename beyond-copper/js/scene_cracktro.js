'use strict';
// =====================================================================
//  PART 0+1: cold boot, disk loading, decrunch, and a proper cracktro.
//  All of it is drawn by PIX: 320x256, 12-bit colour, 50 Hz, a real
//  bitmap font, a chrome logo built pixel by pixel, a copper list that
//  changes colour per raster line, and a one-pixel-column sine scroller.
// =====================================================================
(() => {
  const P = PIX, W = P.W, H = P.H, X = P.hex, c12 = P.c12;
  const BLACK = X(0x000), WHITE = X(0xFFF), BLUE = X(0x05A), ORANGE = X(0xF80);

  // --------------------------- PART 0: BOOT ---------------------------
  const BOOT = ['NEON BLITTER BOOTBLOCK V1.3', '', 'ROM CHECKSUM ......... OK', 'CHIP RAM 512K  FAST RAM 512K',
    'AGNUS  DENISE  PAULA ... OK', '', 'DF0: SEEKING', 'LOADING "BEYOND THE COPPER"'];
  function drawBoot(st) {
    const t = Math.floor(st.lt * 50) / 50;
    if (t < 0.1 || t > 7.5) { P.clear(BLACK); P.upload(); return P.crt({ fade: 1 }); }
    if (t < 0.4) P.clear(t < 0.2 ? X(0x444) : t < 0.3 ? X(0x999) : WHITE);          // the power-on colour steps
    else if (t < 4.6) {
      P.clear(BLUE);
      const n = Math.min(BOOT.length, Math.floor((t - 0.4) * 2.4));
      for (let i = 0; i < n; i++) P.text(BOOT[i], 16, 24 + i * 12, i === 0 ? ORANGE : WHITE);
      if (n >= 7) P.text('TRACK ' + String(Math.min(79, Math.floor((t - 3.2) * 50))).padStart(2, '0'), 16 + 13 * 8, 24 + 6 * 12, WHITE);
      if ((t * 2 | 0) % 2) P.rect(16, 24 + n * 12, 8, 8, ORANGE);
    } else TRACKER.rasters(0, 'DECRUNCHING', (t - 4.6) / 2.9);
    P.upload(); return P.crt();
  }

  // ------------------------- PART 1: CRACKTRO -------------------------
  // The logo: the 8x8 font Scale2x'ed twice, squeezed to tall narrow letters, sheared into italics,
  // then given what every 1989 logo had: chrome gradient with a horizon, bevel, outline and drop shadow.
  const LW = 312, LH = 54, LOGO_H = 46;
  let logo;                                                     // per pixel: 0 empty, 1 shadow, 2 outline, 3 body, 4 lit edge
  function makeLogo() {
    const src = P.bitmap('NEON BLITTER', 2), w = 288, sh = 14, a = new Uint8Array(LW * LH);
    const at = (x, y) => (x < 0 || y < 0 || x >= LW || y >= LH) ? 0 : a[y * LW + x];
    for (let y = 0; y < LOGO_H; y++) for (let x = 0; x < w; x++) {
      const sx = Math.floor((x + 0.5) / 0.75), sy = Math.floor((y + 0.5) * 32 / LOGO_H);
      if (src.m[sy * src.w + sx]) a[(y + 2) * LW + x + 3 + Math.round((LOGO_H - 1 - y) / LOGO_H * sh)] = 3;
    }
    const b = Uint8Array.from(a);
    for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) {
      const i = y * LW + x;
      if (b[i] === 3) { if (at(x - 1, y) !== 3 || at(x, y - 1) !== 3) a[i] = 4; continue; }
      let near = false; for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) if ((b[(y + dy) * LW + x + dx] | 0) === 3 && y + dy >= 0 && y + dy < LH && x + dx >= 0 && x + dx < LW) { near = true; break; }
      if (near) a[i] = 2; else if (x >= 4 && y >= 4 && b[(y - 4) * LW + x - 4] === 3) a[i] = 1;
    }
    return a;
  }
  const SKY = [0x127, 0x24A, 0x36C, 0x69E, 0x9CF, 0xDEF].map(X), GROUND = [0x310, 0x630, 0xA50, 0xE80, 0xFC2, 0xFFA].map(X);
  const chrome = (f, x, y) => f < 0.47 ? P.dith(SKY, f / 0.47, x, y) : f < 0.53 ? WHITE : P.dith(GROUND, (f - 0.53) / 0.47, x, y);
  function drawLogo(lx, ly, t, wob) {
    if (!logo) logo = makeLogo();
    for (let y = 0; y < LH; y++) {
      const yy = ly + y; if (yy < 0 || yy >= H) continue;
      const dx = Math.round(Math.sin(y * 0.16 + t * 5) * wob), f = (y - 2) / LOGO_H;
      for (let x = 0; x < LW; x++) {
        const v = logo[y * LW + x]; if (!v) continue; const xx = lx + x + dx; if (xx < 0 || xx >= W) continue;
        P.px[yy * W + xx] = v === 1 ? X(0x002) : v === 2 ? X(0x014) : v === 4 ? (f < 0.5 ? WHITE : X(0xFE8)) : chrome(f, x, y);
      }
    }
  }
  function glint(x, y, s) {                                     // a four-point sparkle that crosses the chrome horizon
    for (let i = -s; i <= s; i++) { const c = Math.abs(i) < s / 2 ? WHITE : X(0x9CF); P.pset(x + i, y, c); if (Math.abs(i) <= s * 0.6) P.pset(x, y + i, c); }
    P.pset(x - 1, y - 1, WHITE); P.pset(x + 1, y - 1, WHITE); P.pset(x - 1, y + 1, WHITE); P.pset(x + 1, y + 1, WHITE);
  }

  const stars = Array.from({ length: 110 }, (_, i) => ({ x: Math.random() * W, y: (Math.random() * 190) | 0, l: i % 3 }));
  const STARC = [X(0x446), X(0x88A), WHITE];
  const BARS = [[1, .15, .1], [1, .5, 0], [1, .9, .15], [.2, .9, .25], [.1, .75, 1], [.25, .3, 1], [.8, .25, 1]];
  const SCROLL = '    NEON BLITTER PRESENTS ... BEYOND THE COPPER!   4096 COLOURS. FOUR CHANNELS. NO LIMITS.   HOLD ON ...       ';
  const GOLD = [0xFFC, 0xFF6, 0xFD2, 0xFA0, 0xE70, 0xB40, 0x820, 0x510].map(X);
  const TITLE = 'BEYOND THE COPPER';

  function drawCrack(st) {
    const t = Math.floor(st.lt * 50) / 50, end = st.dur - t, f16 = P.font16;
    const glitch = Math.max(0, 1 - end / (MUSIC.BAR * 2));
    const kick = MUSIC.env('kick', st.t, 9), snare = MUSIC.env('snare', st.t, 12), lead = MUSIC.env('lead', st.t, 7);
    const intro = Math.min(1, t / 1.5);
    // copper list: one background colour per raster line (deep space blue, snare lifts it, glitch corrupts it)
    for (let y = 0; y < 192; y++) {
      const f = y / 192, s = snare * 0.3 * (1 - f) * (1 - f), g = glitch * (Math.random() < glitch * 0.25 ? Math.random() * 0.5 : 0);
      P.hline(y, c12(0.02 + s * 0.6 + g, 0.01 + s * 0.3 + g * 0.4, 0.07 + 0.2 * Math.pow(Math.sin(f * Math.PI), 2) + s));
    }
    stars.forEach(s => { const x = ((s.x - t * (14 + s.l * 30)) % W + W) % W | 0; P.px[s.y * W + x] = STARC[s.l]; });
    // seven copper bars chasing each other on a sine, back ones drawn first
    const nb = Math.min(BARS.length, Math.floor(t * 3));
    BARS.slice(0, nb).map((c, i) => ({ c, a: t * 1.9 - i * 0.42 }))
      .sort((a, b) => Math.cos(a.a) - Math.cos(b.a))
      .forEach(b => {
        const yc = 140 + Math.sin(b.a) * 42, depth = 0.55 + 0.45 * Math.cos(b.a), hh = 6 + 3 * depth;
        for (let dy = -Math.ceil(hh); dy <= Math.ceil(hh); dy++) {
          const y = Math.round(yc + dy); if (y < 98 || y >= 190) continue;
          const k = Math.max(0, 1 - Math.abs(dy) / hh), hl = Math.pow(k, 5) * (0.75 + lead * 0.25), m = Math.pow(k, 0.7) * depth;
          P.hline(y, c12(b.c[0] * m + hl, b.c[1] * m + hl, b.c[2] * m + hl));
        }
      });
    // logo: drops in, bounces, nods on the kick
    const ly = Math.round(-80 * Math.pow(1 - intro, 2) * Math.abs(Math.cos(intro * 9)) + 5 - kick * 3);
    drawLogo(4, ly, t, kick * 1.5 + glitch * glitch * 26);
    const gp = (t * 0.45) % 1; if (t > 2 && gp < 0.35) glint(Math.round(20 + gp / 0.35 * 280), ly + 26, 2 + Math.round(4 * Math.sin(gp / 0.35 * Math.PI)));
    if (t > 1.2) P.centre('P R E S E N T S', 64, X(0x8AC));
    if (t > 1.8) {                                                // the title: copper running through the letters
      const n = Math.min(TITLE.length, Math.floor((t - 1.8) * 14));
      P.text(TITLE.slice(0, n), 24, 77, (r, i, shd) => shd === 2 && lead > 0.5 ? WHITE : GOLD[Math.min(7, Math.max(0, Math.round(3.5 + 3.5 * Math.sin(r * 0.42 - t * 4 + i * 0.5))))], { font: f16 });
    }
    // checkerboard floor: perspective divide per scanline, distance fog by dithering to the horizon colour
    for (let y = 192; y < H; y++) {
      const z = 34 / (y - 187), fog = Math.min(1, (y - 192) / 44), v = Math.floor(z * 3.2 + t * 3.2);
      const a = P.mix12(X(0x013), X(0x39F), fog), b = P.mix12(X(0x013), X(0x026), fog);
      for (let x = 0; x < W; x++) P.px[y * W + x] = ((Math.floor((x - 160) * z * 0.16 + Math.sin(t * 0.6) * 5) + v) & 1) ? a : b;
    }
    P.hline(191, X(0x9CF)); P.hline(192, X(0x36C));
    // sine scroller: every pixel column has its own height; 16x16 font drawn twice as tall, bevelled, gold
    if (t > 1.6) {
      // Follow a moving font column: phase speed is omega - waveNumber * speed.
      const speed = 64, amp = 27 + glitch * 10;
      const sx0 = (t - 1.6) * speed, omega = 0.021 * speed + 1.5 * speed / 27;
      for (let pass = 0; pass < 2; pass++) for (let x = 0; x < W; x++) {
        const sx = Math.floor(x + sx0), ci = Math.floor(sx / 16); if (ci >= SCROLL.length) continue;
        const g = SCROLL.charCodeAt(ci) - 32; if (g <= 0 || g >= 64) continue;
        const cx = sx & 15, y0 = Math.round(128 + Math.sin(x * 0.021 + t * omega) * amp) + (pass ? 0 : 3), xx = x + (pass ? 0 : 3);
        if (xx >= W) continue;
        for (let r = 0; r < 16; r++) {
          const shd = f16.bev[g * 256 + r * 16 + cx]; if (!shd) continue;
          const col = !pass ? X(0x102) : shd === 2 ? X(0xFFE) : shd === 3 ? X(0x520) : GOLD[r >> 1];
          for (let d = 0; d < 2; d++) { const yy = y0 + r * 2 + d; if (yy >= 0 && yy < 190) P.px[yy * W + xx] = pass && d && shd === 1 ? GOLD[Math.min(7, (r >> 1) + ((x + r) & 1))] : col; }
        }
      }
    }
    // the machine straining at its limits: lines tear sideways
    if (glitch > 0) for (let i = 0; i < glitch * 26; i++) { const y = Math.random() * H | 0, off = (Math.random() - 0.5) * 50 * glitch | 0; P.px.copyWithin(y * W + Math.max(0, off), y * W + Math.max(0, -off), y * W + W - Math.abs(off)); }
    P.upload();
    return P.crt({ aberr: 0.22 + glitch * 1.6, bloom: 0.38 + glitch * 0.3, fade: Math.min(1, t * 6) });
  }

  (window.SCENES = window.SCENES || []).push(
    { name: 'Boot', from: 0, to: 1, init() { logo = makeLogo(); }, draw: drawBoot },
    { name: 'Cracktro', from: 1, to: 5, draw: drawCrack },
  );
})();
