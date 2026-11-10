'use strict';
// =====================================================================
//  DISK 2, LEVEL 2: "RASGUEADO" - the vertical shoot-'em-up.
//  Bars 24-48 of Asturias, flown over an endless floor of eight-point
//  star tiles. THEN: a flat three-colour tile floor, hard sprites, two
//  pixel bolts, chunky four-frame explosions, inside the CRT. The raster
//  beam passes on the crash of bar 28 and the floor is real: raised
//  glazed tiles over glowing copper grout, soft shadows, HDR bolts,
//  thousands of sparks. The music plays the game: every pluck fires a
//  shot, every rasgueado chord is a smart bomb whose shockwave lifts the
//  tiles and re-glazes them in the colour of its harmony (B major cobalt,
//  E minor violet, C7 crimson). From bar 36 a mandala of star tiles
//  assembles; each chord strips a ring of its armour.
//  The whole level is "pre-played" once at init from the note data, so
//  any moment can be drawn from the time alone.
//  Coordinates are 320x256 lo-res pixels (y up, origin at centre).
// =====================================================================
(() => {
  const NE = 28, NBO = 24, NX = 14, NSP = 32, NS = 96, TL = 36, ALT = 26, CD = 420, PY = -94, SV = 64, VB = 430, BS = 1.1;
  const RR = [14.5, 25, 35, 45, 55, 65, 75], RN = [8, 12, 16, 20, 24, 28, 32];
  const ringR = a => 20 + 520 * a;

  // ------------------------------ the craft ------------------------------
  // Project-X-style sprites (original art, not ripped). Each craft is a little "model" of bevelled, domed and
  // engraved primitives (lo-res pixel units, y up; enemies fly nose-down, the player nose-up) that is
  // pre-rendered once at init, the way 1992 artists rendered and then pixelled their sprites.
  // THEN: 16 pre-lit rotation frames per craft (5 banking frames for the player), lit from the upper left
  //   into hand-picked 12-bit ramps with a dark outline; the light stays put while a sprite turns.
  // NOW: the same model at twice the resolution as albedo + height + glow + gloss + a distance field,
  //   lit per pixel in the shader as glossy HDR metal with glowing canopies, eyes and engines.
  // <sprites>
  const SPR = (() => {
    const SC = 48, SM = 96, AW = 768, AH = 480, NF = 16;          // frame cell, hi-res cell (2x), atlas size, rotation frames
    // material: [12-bit ramp dark -> light, diffuse, glow (0 lit, 1 self-lit), gloss]
    const MAT = {
      H: [[0x112, 0x223, 0x345, 0x567, 0x789, 0x9AB, 0xBCD, 0xDEF, 0xFFF], 1, 0, .85],   // silver blue-grey alloy
      h: [[0x011, 0x122, 0x234, 0x346, 0x458, 0x57A, 0x79C, 0x9BE], 1, 0, .7],          // blue steel panels
      B: [[0x002, 0x014, 0x026, 0x138, 0x24B, 0x46D, 0x79F, 0xBDF], 1, 0, .9],          // blue paint trim
      C: [[0x001, 0x013, 0x025, 0x048, 0x07B, 0x3AE, 0x8DF, 0xEFF], .8, .45, 1],       // canopy glass
      E: [[0x000, 0x111, 0x222, 0x334, 0x445, 0x667, 0x99A], 1, 0, .55],               // gunmetal
      I: [[0x000, 0x000, 0x101, 0x112, 0x223], 1, 0, .15],                              // intakes, vents
      R: [[0x112, 0x334, 0x556, 0x889, 0xAAB, 0xCCD, 0xEEF, 0xFFF], 1, 0, 1],           // chrome
      G: [[0x011, 0x022, 0x033, 0x154, 0x276, 0x398, 0x5BA, 0x9DC, 0xDFE], 1, 0, .95],  // bio carapace
      g: [[0x001, 0x012, 0x123, 0x135, 0x247, 0x469, 0x7AB], 1, 0, .45],               // wing membrane
      O: [[0x100, 0x210, 0x420, 0x630, 0x941, 0xB62, 0xD94, 0xFC7, 0xFEB], 1, 0, .85], // bronze armour
      o: [[0x000, 0x100, 0x210, 0x320, 0x531, 0x742, 0x963], 1, 0, .5],                // dark bronze, scorched
      L: [[0x200, 0x510, 0x930, 0xD50, 0xF82, 0xFC6, 0xFFC], 1, 1, .6],                // lamps and exhausts
      K: [[0x111, 0x333, 0x555, 0x888, 0xBBB, 0xEEE, 0xFFF], 1, 1, .8],                // glow tinted with the enemy colour
    };
    const poly = (m, p, o = {}) => ({ k: 0, m, p, ...o }), ell = (m, x, y, rx, ry, o = {}) => ({ k: 1, m, x, y, rx, ry, ...o });
    const cap = (m, x0, y0, x1, y1, r, o = {}) => ({ k: 2, m, x0, y0, x1, y1, r, ...o });
    const M = { mir: 1 }, cut = (x0, y0, x1, y1, o = {}) => cap(null, x0, y0, x1, y1, .32, { rel: 1, z: -.7, ...o });
    const riv = (x, y, o = {}) => ell(null, x, y, .55, .55, { rel: 1, z: .35, b: .3, w: .55, ...o });
    const polar = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
    const disc = [], dk = Math.PI / 4;                              // b) segmented chrome mine with a glowing core
    for (let k = 0; k < 4; k++) { const a = k * 2 * dk + dk / 2; disc.push(poly('E', [polar(8.5, a - .26), polar(12.6, a), polar(8.5, a + .26)], { z: .4, w: 1.2 })); }
    disc.push(ell('R', 0, 0, 10, 10, { z: .4, b: 1.8, w: 2.8 }));
    for (let k = 0; k < 8; k++) { const a = k * dk + dk / 2, p = polar(6.6, a), q = polar(10.6, a); disc.push(cut(p[0], p[1], q[0], q[1], { z: -.9 })); }
    disc.push(ell('E', 0, 0, 6.8, 6.8, { z: .3, b: .5, w: 2 }));
    for (let k = 0; k < 4; k++) { const p = polar(5.7, k * 2 * dk + dk / 2), q = polar(5.8, k * 2 * dk + 3 * dk / 2); disc.push(riv(p[0], p[1]), cap('I', q[0] * .9, q[1] * .9, q[0] * 1.1, q[1] * 1.1, .55, { rel: 1, z: -.5 })); }
    disc.push(ell('R', 0, 0, 4.6, 4.6, { z: 1.3, b: 1, w: 1.4 }), ell('K', 0, 0, 3.1, 3.1, { z: 1.5, b: 1.7, w: 3.1 }));
    const D = {
      // the player: silver interceptor, blue canopy and spine, swept wings with dark leading edges, wingtip
      // cannon pods and twin engines (the flames are drawn by the shader)
      ship: [
        poly('H', [[2, 7], [14, -4.5], [15.6, -5.5], [15.6, -10], [12, -10.4], [3, -8.5]], { z: .4, b: 1, w: 2.5, ...M }),
        poly('h', [[2, 7.5], [14, -4.5], [15.6, -5.5], [14.6, -7.3], [2.6, 3.4]], { rel: 1, ...M }),
        cut(2.6, 3.4, 14.4, -7.4, { ...M }), cut(9, -3.6, 9, -10, M), cut(12.5, -6.2, 12.5, -10.2, M), riv(10.8, -9, M), riv(7.2, -7.8, M),
        cap('E', 15, -1, 15, -11.2, 1.45, { z: 1, b: 1.2, w: 1.45, ...M }), ell('L', 15, -10.5, .8, .8, { rel: 1, z: .2, b: .5, ...M }),
        poly('h', [[2.4, 9.5], [5.8, 6.2], [5.8, 5.2], [2.6, 6]], { z: 1.4, b: .6, w: 1, ...M }),
        cap('H', 5.6, 3, 5.6, -12.4, 2.7, { z: 1.2, b: 1.8, w: 2.7, ...M }), cap('B', 5.6, -8.4, 5.6, -10, 2.8, { rel: 1, ...M }),
        ell('I', 5.6, 2.8, 1.8, 1.3, { rel: 1, z: -1.2, ...M }), cut(3.6, -3, 7.6, -3, M),
        ell('E', 5.6, -13, 2.4, 1.8, { z: 2.2, b: .8, w: 1.5, ...M }), ell('I', 5.6, -13.6, 1.4, 1, { rel: 1, z: -.7, ...M }),
        poly('H', [[0, 16.5], [1.3, 13], [2.6, 7], [3.4, 0], [3.4, -9], [2.4, -13.2], [0, -13.2]], { z: 2, b: 2.2, w: 3, ...M }),
        poly('h', [[0, 17], [2, 12.2], [0, 11.6]], { rel: 1, ...M }),
        cap('B', 0, .6, 0, -11, .9, { rel: 1, z: .2, b: .2, w: .9 }), cut(-3.4, -3, 3.4, -3), cut(-3.4, -7.6, 3.4, -7.6),
        ell('C', 0, 6, 1.9, 4.4, { rel: 1, z: .3, b: 1.4, w: 1.9 }), cut(-1.9, 3.4, 1.9, 3.4, { z: -.4, w: .25 }),
      ],
      disc,
      // a) insectoid bio-drone: teal carapace, membrane wings, claws and glowing eyes
      bug: [
        poly('g', [[2, 1], [10.5, 6.5], [11.8, 2.6], [9.6, -1.6], [3, -2]], { z: .2, b: .4, w: 1.5, ...M }),
        cap(null, 3, 0, 10.6, 4.4, .3, { rel: 1, z: .4, ...M }), cap(null, 4, -1, 10.6, .6, .3, { rel: 1, z: .4, ...M }),
        poly('g', [[2, -1], [8.4, -4.6], [9.2, -7.6], [6.4, -7.2], [2.4, -3.4]], { z: .2, b: .4, w: 1.2, ...M }),
        cap('E', 2.5, -5, 6.2, -8.6, .75, { z: .6, b: .6, w: .75, ...M }), cap('E', 6.2, -8.6, 5, -11.6, .6, { z: .6, b: .6, w: .6, ...M }),
        cap('E', 3, 5, 6.6, 9.4, .6, { z: .4, b: .5, w: .6, ...M }),
        ell('G', 0, 4.6, 4.2, 6.6, { z: 1, b: 2.4, w: 4 }), cut(-4.4, 2.6, 4.4, 2.6), cut(-4, 5.4, 4, 5.4), cut(-3, 8.2, 3, 8.2),
        ell('K', 3, 4, .7, .7, { rel: 1, z: .2, b: .4, ...M }),
        ell('G', 0, -2.4, 3.7, 3.3, { z: 1.6, b: 2, w: 3 }), cap(null, 0, -4.6, 0, 7, .5, { rel: 1, z: .4, b: .2 }),
        cap('E', 1, -9, 2.2, -11.8, .55, { z: .8, b: .4, w: .55, ...M }),
        ell('G', 0, -7, 3, 2.6, { z: 1.6, b: 1.8, w: 2.6 }), ell('K', 1.55, -7.9, 1.15, 1.05, { rel: 1, z: .4, b: .8, w: 1.05, ...M }),
      ],
      // d) bronze attack craft: forward blades, wingtip guns, twin exhausts, a glowing canopy
      bronze: [
        poly('O', [[2, -1.5], [11, -6.5], [12.3, -3.5], [11.5, 3], [3, 6]], { z: .4, b: 1, w: 2, ...M }),
        poly('o', [[6, -3.8], [11, -6.5], [12.3, -3.5], [7, -.8]], { rel: 1, ...M }), cut(7, -.8, 12, -3.4, M), riv(9.5, 1.2, M), riv(6, 2.6, M),
        cap('E', 11.6, -1.5, 11.6, -9.5, .9, { z: 1, b: .8, w: .9, ...M }),
        cap('O', 4.2, 8, 4.2, -.5, 2.3, { z: 1, b: 1.6, w: 2.3, ...M }), cut(2.2, 4, 6.2, 4, M),
        ell('E', 4.2, 8.5, 1.9, 1.4, { z: 1.8, b: .6, w: 1, ...M }), ell('L', 4.2, 9, 1.1, .75, { rel: 1, z: .2, b: .4, ...M }),
        poly('O', [[0, -12.5], [1.7, -9], [3, -3], [3, 6], [0, 9.5]], { z: 2, b: 2, w: 2.8, ...M }),
        poly('o', [[0, -12.5], [1.4, -9.6], [0, -9.2]], { rel: 1, ...M }), cut(-3, 1, 3, 1), cut(-3, 4.4, 3, 4.4), cap('o', 0, 1.2, 0, 8.6, .7, { rel: 1, z: .2, b: .2 }),
        ell('K', 0, -5, 1.5, 2.7, { rel: 1, z: .3, b: 1.1, w: 1.5 }),
      ],
      // c) armoured twin-boom gunship with two chrome turrets
      gun: [
        poly('h', [[0, -1.5], [13, -3.5], [13, 5], [0, 6.5]], { z: .4, b: .8, w: 1.5, ...M }), riv(4, 4.6, M), riv(4, -.5, M), cut(6.5, -2.4, 6.5, 5.6, M),
        cap('H', 10, -13, 10, 11, 3, { z: 1.2, b: 2, w: 3, ...M }), cap('O', 10, -13.5, 10, -8.6, 3.1, { rel: 1, ...M }),
        cut(7, -8.4, 13, -8.4, M), cut(7, 3, 13, 3, M), cut(7, 7, 13, 7, M), ell('L', 10, -14.6, .9, .9, { rel: 1, z: .2, b: .5, ...M }),
        ell('E', 10, 12, 2.5, 1.7, { z: 2, b: .6, w: 1.2, ...M }), ell('L', 10, 12.8, 1.4, .8, { rel: 1, z: .2, b: .4, ...M }),
        ell('H', 0, 1, 5.6, 9.4, { z: 1.8, b: 2.2, w: 4 }), cap('O', 0, 5, 0, 10.4, 5.7, { rel: 1 }), cut(-5.6, 4.4, 5.6, 4.4),
        cap('E', 1.1, -6, 1.1, -12.6, .6, { z: 3.4, b: .5, w: .6, ...M }),
        ell('R', 0, -4, 3.3, 3.3, { z: 3.2, b: 1.3, w: 2.2 }), ell('I', 0, -5.3, 1.5, .7, { rel: 1, z: -.4 }),
        ell('R', 0, 6, 2.7, 2.7, { z: 3, b: 1.1, w: 2 }), ell('K', 0, 6, 1.3, 1.3, { rel: 1, z: .3, b: .8, w: 1.3 }),
      ],
      // debris from the mandala: a scorched bronze armour plate
      shard: [
        poly('O', [[-6, -2], [-2, -6.4], [5, -4.4], [6.6, 1], [2, 5.6], [-4.2, 4.2]], { z: .5, b: 1.2, w: 2 }),
        poly('o', [[2, 5.6], [6.6, 1], [3, -.4], [-.4, 2.8]], { rel: 1 }), cut(-5, 1, 4, -3.4), riv(-2.6, -3.2), riv(3.6, -1.8), riv(-3, 2.6),
      ],
    };
    const SP = [D.ship, D.disc, D.bug, D.bronze, D.gun, D.shard];
    // signed distance to one primitive (> 0 inside), clipped to its bounding box
    for (const s of SP) for (const q of s) {
      const xs = q.k === 0 ? q.p.map(p => p[0]) : q.k === 1 ? [q.x - q.rx, q.x + q.rx] : [q.x0 - q.r, q.x0 + q.r, q.x1 - q.r, q.x1 + q.r];
      const ys = q.k === 0 ? q.p.map(p => p[1]) : q.k === 1 ? [q.y - q.ry, q.y + q.ry] : [q.y0 - q.r, q.y0 + q.r, q.y1 - q.r, q.y1 + q.r];
      q.bb = [Math.min(...xs) - 4.5, Math.min(...ys) - 4.5, Math.max(...xs) + 4.5, Math.max(...ys) + 4.5];
      if (q.rel) q.b = q.b ?? 0; q.b = q.b ?? 1; q.z = q.z || 0; q.w = q.w || 2;
    }
    function sd(q, x, y) {
      if (q.mir) x = Math.abs(x);
      if (x < q.bb[0] || x > q.bb[2] || y < q.bb[1] || y > q.bb[3]) return -5;
      if (q.k === 1) { const r = Math.hypot((x - q.x) / q.rx, (y - q.y) / q.ry); return (1 - r) * Math.min(q.rx, q.ry); }
      if (q.k === 2) { const ex = q.x1 - q.x0, ey = q.y1 - q.y0, wx = x - q.x0, wy = y - q.y0, t = Math.min(1, Math.max(0, (wx * ex + wy * ey) / (ex * ex + ey * ey || 1)));
        return q.r - Math.hypot(wx - ex * t, wy - ey * t); }
      let d = 1e9, ins = false; const p = q.p;
      for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
        const ax = p[j][0], ay = p[j][1], bx = p[i][0], by = p[i][1];
        if ((ay > y) !== (by > y) && x < ax + (y - ay) * (bx - ax) / (by - ay)) ins = !ins;
        if (q.mir && ax === 0 && bx === 0) continue;                // the mirror seam is not an edge
        const ex = bx - ax, ey = by - ay, wx = x - ax, wy = y - ay, t = Math.min(1, Math.max(0, (wx * ex + wy * ey) / (ex * ex + ey * ey)));
        d = Math.min(d, (wx - ex * t) ** 2 + (wy - ey * t) ** 2);
      }
      return ins ? Math.sqrt(d) : -Math.sqrt(d);
    }
    // the model at one point: material (null = empty), height, distance to the silhouette, nearest material
    function at(s, x, y) {
      let m = null, h = 0, sdf = -5, nm = 'E';
      for (const q of s) {
        const d = sd(q, x, y);
        if (!q.rel && d > sdf) { sdf = d; nm = q.m; }
        if (d <= 0 || (q.rel && !m)) continue;
        const t = Math.min(d / q.w, 1);
        h = (q.rel ? h : 0) + q.z + q.b * (1 - (1 - t) * (1 - t));
        if (q.m) m = q.m;
      }
      return [m, h, sdf, m || nm];
    }
    const rgb = c => [(c >> 8 & 15) * 17, (c >> 4 & 15) * 17, (c & 15) * 17];
    const L = [-.371, .53, .763], HV = (() => { const v = [L[0], L[1], L[2] + 1], n = Math.hypot(...v); return v.map(x => x / n); })();
    const data = new Uint8Array(AW * AH * 4);
    const put = (x, y, r, g, b, a) => { const o = (y * AW + x) * 4; data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = a; };
    // THEN: one pre-lit frame (rotated by ang, banked by bank) into the cell at (ox, oy); texel rows run bottom-up
    function frame(s, ang, bank, ox, oy) {
      const N = SC * 3, hs = new Float32Array(N * N), ms = new Array(N * N), c = Math.cos(ang), sn = Math.sin(ang), kx = 1 - .28 * Math.abs(bank);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const wx = (i + .5) / 3 - SC / 2, wy = (j + .5) / 3 - SC / 2, r = at(s, (c * wx - sn * wy) / kx, sn * wx + c * wy);
        hs[j * N + i] = r[1]; ms[j * N + i] = r[0];
      }
      const H = (i, j) => hs[Math.min(N - 1, Math.max(0, j)) * N + Math.min(N - 1, Math.max(0, i))];
      const hp = new Float32Array(SC * SC), op = new Uint8Array(SC * SC);
      for (let j = 0; j < SC; j++) for (let i = 0; i < SC; i++) { let a = 0; for (let b = 0; b < 9; b++) a += H(i * 3 + b % 3, j * 3 + (b / 3 | 0)); hp[j * SC + i] = a / 9; }
      const rl = bank * .55, cr = Math.cos(rl), sr = Math.sin(rl);
      for (let j = 0; j < SC; j++) for (let i = 0; i < SC; i++) {
        const m = ms[(j * 3 + 1) * N + i * 3 + 1]; if (!m) continue;
        let gx = 0, gy = 0;
        for (let b = 0; b < 9; b++) { const u = i * 3 + b % 3, v = j * 3 + (b / 3 | 0); gx += (H(u + 1, v) - H(u - 1, v)) * 1.5; gy += (H(u, v + 1) - H(u, v - 1)) * 1.5; }
        let n = [-gx / 9, -gy / 9, 1]; const nl = Math.hypot(...n); n = n.map(v => v / nl);
        n = [n[0] * cr + n[2] * sr, n[1], -n[0] * sr + n[2] * cr];
        let nb = 0, cnt = 0; for (let v = -1; v <= 1; v++) for (let u = -1; u <= 1; u++) { const x = i + u, y = j + v; if (x >= 0 && y >= 0 && x < SC && y < SC) { nb += hp[y * SC + x]; cnt++; } }
        const [ramp, kd, glow, gloss] = MAT[m], dif = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
        const sp = Math.pow(Math.max(0, n[0] * HV[0] + n[1] * HV[1] + n[2] * HV[2]), 6 + 40 * gloss);
        let lit = .04 + .78 * dif * kd + Math.min(.12, Math.max(-.25, (hp[j * SC + i] - nb / cnt) * .18));
        lit = lit * (1 - glow) + glow * (.22 + .78 * Math.pow(Math.max(n[2], 0), 4)) + sp * gloss * .9;
        const k = Math.max(0, Math.min(ramp.length - 1, Math.round(lit * (ramp.length - 1))));
        if (m === 'K') put(ox + i, oy + j, Math.round(Math.min(1, lit) * 255), 0, 0, 128);
        else { const [r, g, b] = rgb(ramp[k]); put(ox + i, oy + j, r, g, b, 255); }
        op[j * SC + i] = 1;
      }
      for (let j = 0; j < SC; j++) for (let i = 0; i < SC; i++) if (!op[j * SC + i] && ((i > 0 && op[j * SC + i - 1]) || (i < SC - 1 && op[j * SC + i + 1]) || (j > 0 && op[(j - 1) * SC + i]) || (j < SC - 1 && op[(j + 1) * SC + i])))
        put(ox + i, oy + j, 17, 0, 17, 255);                         // the dark outline
    }
    // NOW: albedo (a = tint with the enemy colour) at (s*SM, 288), height/glow/gloss/distance at (s*SM, 384)
    function hires(s, ox) {
      for (let j = 0; j < SM; j++) for (let i = 0; i < SM; i++) {
        const [m, h, sdf, nm] = at(s, (i + .5) / 2 - SC / 2, (j + .5) / 2 - SC / 2), [ramp, , glow, gloss] = MAT[nm];
        const al = rgb(ramp[Math.round(ramp.length * .62) - 1]).map(v => Math.round(Math.pow(v / 255, 1.1) * 255));
        put(ox + i, 288 + j, al[0], al[1], al[2], nm === 'K' ? 255 : 0);
        put(ox + i, 384 + j, Math.min(255, h / 8 * 255), m ? glow * 255 : 0, gloss * 255, Math.max(0, Math.min(255, 128 + sdf * 32)));
      }
    }
    function build() {
      for (let b = 0; b < 5; b++) frame(SP[0], 0, (b - 2) / 2, b * SC, 0);
      for (let s = 1; s < SP.length; s++) for (let f = 0; f < NF; f++) frame(SP[s], f * 2 * Math.PI / NF, 0, f * SC, s * SC);
      SP.forEach((s, i) => hires(s, i * SM));
      return { data, w: AW, h: AH };
    }
    return { build, MAT };
  })();
  // </sprites>

  const FS = PIX.GLSL + `
uniform sampler2D uAtlas, uMsg, uSpr;
uniform float uLt, uScroll, uTilt, uScore, uGlow, uLiftMax, uBossRot, uBossHit, uHeart, uNE, uNB, uNX, uCrack, uOuter, uZoom;
uniform vec4 uShip;                 // x, y, bank, thrust
uniform vec4 uEa[${NE}], uEb[${NE}];        // x, y, angle, scale | type, colour, hit flash, alpha
uniform vec4 uBo[${NBO}];                // x, y, kind, angle
uniform vec4 uEx[${NX}];                // x, y, age, size
uniform vec4 uRing[2];              // floor x, floor y, age, -
uniform vec3 uPal;                  // harmony before the newest shockwave, harmony behind it
uniform vec3 uBoss;                 // x, y, present
uniform float uBR[7];               // per armour ring: 0 absent, 0..1 assembling, 1 intact, 1..2 being shed
const float TL=${TL}., TS=${(TL / (2 * Math.SQRT2)).toFixed(4)}, GR=1.15, H0=2.2, ALT=${ALT}., CD=${CD}., BS=${BS};
const float RR[7]=float[7](${RR.map(x => x.toFixed(1)).join(',')}), RN[7]=float[7](${RN.map(x => x.toFixed(1)).join(',')});
const vec3 LM=vec3(-.371,.53,.763);                              // the moon, upper left
float old_, aaw;
vec3 invAces(vec3 y){ y=clamp(y,0.,1.02); vec3 a=2.43*y-2.51, b=.59*y-.03, c=.14*y; return (-b-sqrt(max(b*b-4.*a*c,0.)))/(2.*a); }
vec3 o12(vec3 c){ return invAces((min(floor(clamp(c,0.,1.)*15.+.5),14.)+.02)/15.); }
vec3 H(int h){ return vec3(float((h>>8)&15),float((h>>4)&15),float(h&15))/15.; }
float bay(vec2 p){ ivec2 i=ivec2(mod(p,4.)); const float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return (m[i.y*4+i.x]+.5)/16.; }
float sdCap(vec2 p, vec2 a, vec2 b, float ra, float rb){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-mix(ra,rb,h); }
float star8(vec2 p, float r){ p=abs(p); return min(max(p.x,p.y),(p.x+p.y)*.70710678)-r; }
float rhomb(vec2 p, float a, float b){ p=abs(p); return (p.x/a+p.y/b-1.)*a*b/sqrt(a*a+b*b); }

// ------------------------------ the floor ------------------------------
// star-and-cross zellige: e<0 on a tile, 0..GR in the grout; c = the tile's centre, k = 0 star / 1 cross
float tileE(vec2 p){ return GR-abs(star8(p-floor(p/TL+.5)*TL,TS)); }
float tile(vec2 p, out vec2 c, out float k){
  vec2 g=floor(p/TL+.5)*TL; float d=star8(p-g,TS);
  if(d<0.){ c=g; k=0.; } else { c=(floor(p/TL)+.5)*TL; k=1.; }
  return GR-abs(d);
}
float ringRad(float a){ return 20.+520.*a; }
float lift(vec2 c){
  float l=0.;
  for(int i=0;i<2;i++){ float ag=uRing[i].z; if(ag<0.||ag>1.7) continue;
    float r=length(c-uRing[i].xy)-ringRad(ag);
    l+=13.*exp(-r*r/900.)*exp(-ag*2.1)*smoothstep(0.,.04,ag);
    l+=2.2*sin(r*.11)*exp(r*.012)*step(r,0.)*exp(-ag*3.); }                    // the floor rings on behind the front
  return l+.7*uGlow*hash21(c*.173);
}
float hgt(vec2 p){ vec2 c; float k; float e=tile(p,c,k); return e<0. ? H0+lift(c)-1.3*smoothstep(-2.2,0.,e) : 0.; }
float palAt(vec2 c){ float ag=uRing[0].z; return (ag<0.||ag>1.7||length(c-uRing[0].xy)<ringRad(ag)) ? uPal.y : uPal.x; }
vec3 tStar(float p){ return p<.5?vec3(.01,.07,.4):p<1.5?vec3(.12,.028,.34):vec3(.4,.017,.028); }
vec3 tCross(float p){ return p<.5?vec3(.012,.03,.115):p<1.5?vec3(.045,.02,.125):vec3(.13,.02,.03); }
vec3 eCol(float c){ return c<.5?vec3(1.,.47,.08):c<1.5?vec3(1.,.83,.45):vec3(.08,.85,.78); }

// ------------------------------ sprites ------------------------------
// the pre-rendered craft (see SPR): sprite s = 0 player, 1 mine, 2 bio-drone, 3 bronze craft, 4 gunship, 5 debris
// THEN: texel of frame f (rotation, or bank for the player); a=1 lit colour, a~.5 glow to tint (r = level)
vec4 sprOld(float s, float f, vec2 l){
  ivec2 p=ivec2(floor(l))+24; if(p.x<0||p.y<0||p.x>47||p.y>47) return vec4(0.);
  return texelFetch(uSpr,ivec2(int(f)*48,int(s)*48)+p,0);
}
// NOW: uv of the 2x hi-res albedo cell (the data cell sits 96 texels above)
vec2 sprUv(float s, vec2 l){ return (vec2(s*96.+48.,336.)+l*2.)/vec2(768.,480.); }
// the mandala: seven counter-rotating rings of star tiles around the heart
float bossD(vec2 q, out float ring, out vec2 loc){
  float d=1e3, r=length(q), a=atan(q.y,q.x); ring=-1.; loc=vec2(0.);
  for(int k=0;k<7;k++){
    float st=uBR[k]; if(st<=0.||st>=2.) continue;
    float as=min(st,1.), shed=max(st-1.,0.), ea=1.-pow(1.-as,3.);
    float rr=RR[k]*mix(3.4,1.,ea)+150.*(1.-exp(-3.2*shed)), sz=(k==0?5.6:4.25)*mix(.55,1.,ea)*(1.-.55*shed);
    if(abs(r-rr)>sz*1.5) continue;
    float sp=uBossRot*(mod(float(k),2.)<.5?1.:-1.)*(1.+.12*float(k))+(1.-ea)*(2.5+float(k)*.3)+shed*1.4;
    float sec=TAU/RN[k], aa=mod(a+sp,sec)-.5*sec;
    vec2 l=vec2(cos(aa)*r-rr,sin(aa)*r);
    l=rot(shed*9.+float(k)*.3927+(1.-ea)*5.)*l;
    float dk=mod(float(k),2.)<.5 ? star8(l,sz) : min(rhomb(l,sz*1.42,sz*.62),rhomb(l,sz*.62,sz*1.42));
    if(dk<d){ d=dk; ring=float(k); loc=l/sz; }
  }
  return d;
}

// ------------------------------ pixel text ------------------------------
float txt(vec2 P, vec2 o, float i0, float n, float sc){
  vec2 l=vec2(P.x-o.x,o.y-P.y)/(8.*sc); if(l.x<0.||l.x>=n||l.y<0.||l.y>=1.) return 0.;
  return pixGlyph(uAtlas,pixMsg(uMsg,i0+floor(l.x)),vec2(fract(l.x),l.y));
}
float num(vec2 P, vec2 o, float v, float nd){
  vec2 l=vec2(P.x-o.x,o.y-P.y)/8.; if(l.x<0.||l.x>=nd||l.y<0.||l.y>=1.) return 0.;
  return pixGlyph(uAtlas,16.+mod(floor(v/pow(10.,nd-1.-floor(l.x))+.001),10.),vec2(fract(l.x),l.y));
}

void main(){
  float asp=uRes.x/uRes.y; old_=isOld(); aaw=256./uRes.y*.9;
  bool OLD=old_>.5;
  vec2 cell=floor(vUv*vec2(256.*asp,256.));
  vec2 P=OLD ? cell+.5-vec2(128.*asp,128.) : (vUv-.5)*vec2(256.*asp,256.)/uZoom-vec2(0.,128.*(1.-1./uZoom));
  if(!OLD) aaw/=uZoom;
  float scroll=OLD ? floor(uScroll) : uScroll;
  // ---- where this pixel's ray meets the flight plane (Q) and the floor (Fp), both in screen-fixed play coordinates
  vec2 Q=P, Fp=P; vec3 rd=vec3(0.,0.,-1.); float fz=0., dist=CD;
  if(!OLD){
    vec3 f=vec3(0.,sin(uTilt),-cos(uTilt)), u=vec3(0.,cos(uTilt),sin(uTilt)), ro=vec3(0.,0.,ALT)-f*CD;
    rd=normalize(f*CD+vec3(P.x,0.,0.)+u*P.y);
    Q=(ro+rd*((ALT-ro.z)/rd.z)).xy;
    float zt=H0+uLiftMax+.05;
    vec3 a=ro+rd*((zt-ro.z)/rd.z), b=ro+rd*(-ro.z/rd.z);
    float s0=0., s1=1.;
    for(int i=1;i<=12;i++){ float s=float(i)/12.; vec3 p=mix(a,b,s); if(p.z<=hgt(p.xy+vec2(0.,scroll))){ s1=s; break; } s0=s; }
    for(int i=0;i<4;i++){ float s=.5*(s0+s1); vec3 p=mix(a,b,s); if(p.z<=hgt(p.xy+vec2(0.,scroll))) s1=s; else s0=s; }
    vec3 hp=mix(a,b,s1); Fp=hp.xy; fz=hp.z; dist=length(hp-ro);
  }
  vec2 Fw=Fp+vec2(0.,scroll);

  // ---- everything that flies: pass 0 = its shadow and light on the floor, pass 1 = the thing itself
  float sh=0.; vec3 Lf=vec3(0.); vec4 oc=vec4(0.);
  vec2 SO=OLD ? vec2(7.,-9.) : vec2(-LM.x,-LM.y)/LM.z*(ALT-fz);
  for(int pass=0;pass<2;pass++){
    vec2 X=pass==0 ? Fp-SO : Q;
    // -- the player (i = -1) and everything it shoots at: one pre-rendered sprite each
    for(int i=-1;i<${NE};i++){
      if(float(i)>=uNE) break;
      bool pl=i<0;
      vec4 A=pl?vec4(uShip.xy,0.,1.25):uEa[max(i,0)], B=pl?vec4(0.,0.,0.,1.):uEb[max(i,0)];   // B: sprite, colour, hit flash, alpha
      float sc=A.w/1.25, kx=pl?1.-.28*abs(uShip.z):1.; vec2 e=X-A.xy;
      if(pl&&pass==0){ vec2 f=abs(Fp-uShip.xy-vec2(0.,-17.)); Lf+=vec3(1.,.6,.35)*exp(-dot(f,f)/260.)*(.5+.5*uShip.w); }
      if(abs(e.x)>25.*sc||abs(e.y)>25.*sc) continue;
      vec3 ec=eCol(B.y);
      if(OLD){
        vec2 lp=floor((X-floor(A.xy))/sc);
        vec4 t=sprOld(B.x,pl?clamp(floor(uShip.z*2.+2.5),0.,4.):mod(floor(A.z/.392699+.5),16.),lp);
        if(pass==0){ sh=max(sh,step(.01,t.a)*B.w); continue; }
        if(pl){ float fl=step(.5,fract(uLt*12.5)), fx=abs(abs(lp.x+.5)-5.6*kx);                   // two-frame engine flames
          if(fx<1.5&&lp.y<-15.&&lp.y>-18.-2.*fl-2.*uShip.w) oc=vec4(fx<.6&&lp.y>-17.?H(0xFFF):fl>.5?H(0xFB4):H(0x6CF),1.); }
        if(t.a>.01) oc=vec4(B.z>.5?H(0xFFF):t.a>.7?t.rgb:mix(ec*t.r*1.15,vec3(1.),smoothstep(.72,1.,t.r)),1.);
      } else {
        vec2 l=rot(A.z)*e/sc; l.x/=kx;
        if(max(abs(l.x),abs(l.y))>23.5) continue;
        vec2 uv=sprUv(B.x,l), dv=vec2(0.,.2);
        vec4 Dd=texture(uSpr,uv+dv); float d=(128.-Dd.a*255.)/32.*sc;
        if(pass==0){ sh=max(sh,smoothstep(4.,-3.,d)*.8*B.w); continue; }
        if(pl){ vec2 qa=vec2(abs(e.x),e.y); float fl=.75+.25*sin(uLt*70.+e.x), len=5.+5.*uShip.w;
          vec2 fq=(qa-vec2(5.6*kx,-15.))/vec2(1.5,len); fq.y=min(fq.y,0.);
          oc.rgb+=(vec3(1.,.45,.12)*exp(-dot(fq,fq)*1.5)*3.*fl+vec3(.4,.7,1.)*exp(-dot(fq,fq)*5.)*3.+vec3(1.)*exp(-dot(fq,fq)*14.)*4.)*step(e.y,-14.); }
        if(d<aaw){
          vec4 Ab=texture(uSpr,uv); vec2 tx=vec2(1./768.,0.), ty=vec2(0.,1./480.);
          vec2 g=vec2(texture(uSpr,uv+dv+tx).r-texture(uSpr,uv+dv-tx).r,texture(uSpr,uv+dv+ty).r-texture(uSpr,uv+dv-ty).r)*8./sc;   // height slope per lo-res pixel
          g=(g*vec2(1./kx,1.))*rot(A.z);                                                            // back into the screen frame
          vec3 n=normalize(vec3(-g,1.));
          if(pl){ float r=uShip.z*.55; n=vec3(n.x*cos(r)+n.z*sin(r),n.y,-n.x*sin(r)+n.z*cos(r)); }   // the bank rolls the hull
          vec3 alb=Ab.rgb*Ab.rgb, R=reflect(vec3(0.,0.,-1.),n);
          float gls=Dd.b, dif=max(dot(n,LM),0.), sp=pow(max(dot(R,LM),0.),10.+140.*gls*gls);
          vec3 env=mix(vec3(1.,.4,.1)*(.15+.35*uGlow),vec3(.09,.12,.26),smoothstep(-.15,.45,R.z))+vec3(.5,.55,.7)*pow(max(R.y,0.),3.)*.25;
          vec3 c=alb*(vec3(.03,.035,.06)+dif*vec3(1.1,1.12,1.25))+(env*.7+sp*vec3(1.5,1.55,1.7)*2.6)*gls*mix(vec3(.3),alb*1.5+.12,.6);
          vec3 em=(Ab.a>.5?ec*(1.+.8*uGlow):alb*2.)*(1.+2.6*pow(max(n.z,0.),4.));                     // canopies, eyes, cores, exhausts
          c=mix(c,em+sp*gls*2.,Dd.g)+vec3(1.)*B.z*2.5;
          float al=smoothstep(aaw,-aaw,d)*B.w; oc=vec4(mix(oc.rgb,c,al),max(oc.a,al));
        }
        if(!pl&&B.x<3.5) oc.rgb+=ec*exp(-dot(e,e)*.012)*.12*B.w;                                  // a little halo
      }
    }
    // -- the mandala and its heart
    if(uBoss.z>.5){
      vec2 bq=(X-uBoss.xy)/BS; float br=length(bq);
      if(br<95.){
        float ring; vec2 loc; float d=bossD(bq,ring,loc)*BS;
        float hd=(br-8.5-3.5*uHeart)*BS;
        if(pass==0){ sh=max(sh,smoothstep(5.,-3.,min(d,hd))*.8); Lf+=vec3(1.,.4,.1)*exp(-br*br/1500.)*(.5+uHeart*1.5+uGlow*.5); }
        else {
          if(d<aaw){
            float st=uBR[int(ring)], as=min(st,1.), shed=max(st-1.,0.);
            float dome=clamp(-d/2.6,0.,1.); vec3 n=normalize(vec3(normalize(loc+1e-4)*(1.-dome),.4+dome));
            vec3 base=mod(ring,2.)<.5?vec3(.02,.42,.44):vec3(.07,.1,.45);
            base=mix(base,vec3(1.,.78,.36),smoothstep(.4,.0,abs(d+1.1)));
            vec3 c=base*(.16+.95*max(dot(n,LM),0.))+pow(max(dot(reflect(vec3(0.,0.,-1.),n),LM),0.),70.)*vec3(1.,1.1,1.4);
            c+=vec3(1.,.45,.12)*exp(-dot(loc,loc)*4.)*(.9+1.6*uGlow);
            c+=vec3(1.,.85,.6)*uBossHit*.9*step(abs(ring-uOuter),.5)+vec3(1.,.6,.25)*shed*2.5+vec3(.15,.4,1.)*(1.-as)*.7;
            float al=smoothstep(aaw,-aaw,d)*smoothstep(0.,.25,as)*(1.-shed*shed); oc=vec4(mix(oc.rgb,c,al),max(oc.a,al));
          }
          // the heart: a copper ember behind an eight-point iris; cracks spread once the shell is gone
          float ha=atan(bq.y,bq.x), iris=star8(rot(-uBossRot*2.)*bq,4.2);
          float cr=pow(abs(sin(ha*4.+br*.6+sin(br*1.3)*1.2)),24.)*uCrack;
          vec3 hc=vec3(1.,.38,.07)*(1.5+2.5*uGlow+5.*uHeart)*(1.-.5*br/8.5)+vec3(1.,.9,.6)*(smoothstep(.6,-.6,iris)*2.+cr*8.+uBossHit*uHeart*5.);
          float al=smoothstep(aaw,-aaw,hd); oc=vec4(mix(oc.rgb,hc,al),max(oc.a,al));
          oc.rgb+=vec3(1.,.4,.1)*exp(-max(hd,0.)*.16)*(.25+.6*uHeart+.3*uGlow);
          oc.rgb+=vec3(1.,.5,.15)*pow(max(cos(ha*4.+uBossRot*2.5),0.),10.)*exp(-max(hd,0.)*.075)*uHeart*(1.+2.5*uGlow)*1.6;   // the bare heart flares on the kick
        }
      }
    }
    // -- bolts
    for(int i=0;i<${NBO};i++){
      if(float(i)>=uNB) break;
      vec4 b=uBo[i]; vec2 e=X-b.xy;
      if(abs(e.x)>34.||abs(e.y)>34.) continue;
      vec3 bc=b.z>1.5?vec3(1.,.42,.1):b.z>.5?vec3(1.,.8,.35):vec3(.55,.75,1.);
      if(pass==0){ Lf+=bc*exp(-dot(e,e)/420.)*(b.z>.5?.9:.5); continue; }
      vec2 l=rot(-b.w)*e;
      if(OLD){ float hw=b.z>.5?1.:.5, hl=b.z>1.5?4.:b.z>.5?4.:3.;
        if(abs(l.x)<=hw+.01&&abs(l.y)<=hl) oc=vec4(b.z>1.5?H(0xF80):b.z>.5?(l.y>1.?H(0xFFF):H(0xFE4)):H(0xCEF),1.); }
      else { float hl=b.z>.5?6.:4., d=sdCap(l,vec2(0.,-hl),vec2(0.,hl),.25,.75);
        oc.rgb+=bc*(exp(-max(d,0.)*1.9)*(b.z>.5?5.:3.2)+.3/(1.+d*d*.14))+vec3(1.)*smoothstep(.4,-.5,d)*3.; }
    }
    // -- explosions
    for(int i=0;i<${NX};i++){
      if(float(i)>=uNX) break;
      vec4 x=uEx[i]; vec2 e=X-x.xy; float ag=x.z;
      if(pass==0){ Lf+=vec3(1.,.55,.2)*exp(-dot(e,e)/(700.*x.w))*exp(-ag*7.)*2.2; continue; }
      if(OLD){
        if(ag<.3){ float fr=floor(ag/.075), r=(3.+3.*fr)*x.w, rl=length(floor(e/2.)*2.+1.); float h=hash21(floor(e/2.)+fr*7.+x.xy);
          if(fr<.5){ if(rl<r) oc=vec4(H(0xFFF),1.); }
          else if(fr<1.5){ if(rl<r) oc=vec4(rl<r*.5?H(0xFFF):H(0xFE4),1.); }
          else if(fr<2.5){ if(rl<r&&rl>r*.3&&h>.3) oc=vec4(h>.65?H(0xFE4):H(0xF80),1.); }
          else if(rl<r&&h>.68) oc=vec4(h>.86?H(0xF80):H(0xA20),1.); }
      } else {
        float r2=dot(e,e)/x.w;
        oc.rgb+=vec3(1.,.8,.5)*exp(-r2*.035)*exp(-ag*16.)*7.+vec3(1.,.4,.1)*exp(-r2*.008)*exp(-ag*6.)*.8;
        float rr=sqrt(r2)-ag*150.; oc.rgb+=vec3(1.,.6,.3)*exp(-rr*rr*.12)*exp(-ag*9.)*1.2;
      }
    }
  }

  // ---- the floor
  vec3 col; vec2 c; float k; float e=tile(Fw,c,k);
  float pidx=palAt(c), hs=hash21(c*.37+3.);
  float rg=0., rband=0.;
  for(int i=0;i<2;i++){ float ag=uRing[i].z; if(ag<0.||ag>1.7) continue; float r=length((OLD?c:Fw)-uRing[i].xy)-ringRad(ag);
    rg+=exp(-r*r/60.)*exp(-ag*2.6); if(OLD&&ag<.62&&abs(length(Fw-uRing[i].xy)-ringRad(ag))<1.6) rband=1.; if(OLD&&ag<.62&&abs(r)<11.) rband=max(rband,.5); }
  if(OLD){
    vec2 q=Fw-c;
    if(e>=0.) col=H(0x730);
    else if(k<.5){ col=pidx<.5?H(0x05A):pidx<1.5?H(0x427):H(0x913);
      if(tileE(Fw+vec2(-1.5,1.5))>=0.) col=pidx<.5?H(0x28C):pidx<1.5?H(0x759):H(0xD45);
      else if(tileE(Fw+vec2(1.5,-1.5))>=0.) col=pidx<.5?H(0x037):pidx<1.5?H(0x214):H(0x602);
      if(star8(q,2.6)<0.) col=H(0x9BD); }
    else { col=H(0x024);
      if(tileE(Fw+vec2(-1.5,1.5))>=0.) col=H(0x136); else if(tileE(Fw+vec2(1.5,-1.5))>=0.) col=H(0x012);
      if(abs(q.x)+abs(q.y)<2.5) col=H(0x05A); }
    if(rband>.75) col=fract(uLt*25.)<.5?H(0xFFF):H(0xFE4);                                // the bomb's ring
    else if(rband>.25&&e<0.) col=k<.5?H(0x9CF):H(0x05A);                                  // tiles flash as it passes
    if(sh>.5&&mod(cell.x+cell.y,2.)<1.) col=H(0x001);                                     // dithered shadow
    if(oc.a>.5) col=oc.rgb;
    // the game's status bar exists only in 1985
    float ink=txt(P,vec2(-152.,120.),0.,6.,1.)+num(P,vec2(-104.,120.),uScore,6.);
    float lv=txt(P,vec2(-28.,120.),6.,7.,1.);
    float hp=0.; for(int i=0;i<3;i++){ vec2 l=vec2(P.x-(120.+float(i)*10.),120.-P.y)/8.; hp+=pixGlyph(uAtlas,65.,l); }
    if(P.y>110.&&abs(P.x)<160.) col=H(0x000);
    if(ink>.5) col=H(0xEEE); if(lv>.5) col=H(0xFC4); if(hp>.5) col=H(0xF52);
    if(uLt>.3&&uLt<2.6&&fract(uLt*2.5)<.72){
      float a=txt(P,vec2(-56.,38.),6.,7.,2.), s=txt(P,vec2(-55.,37.),6.,7.,2.), b=txt(P,vec2(-72.,10.),13.,18.,1.), s2=txt(P,vec2(-71.,9.),13.,18.,1.);
      if(s>.5||s2>.5) col=H(0x201); if(a>.5) col=P.y>30.?H(0xFEB):H(0xF80); if(b>.5) col=H(0xEEE); }
    col=o12(col);
  } else {
    float top=H0+lift(c), lf=top-H0;
    vec3 base=k<.5?tStar(pidx):tCross(pidx);
    base*=.72+.56*hs;
    vec2 q=Fw-c;
    if(k<.5){ float di=abs(star8(q,TS*.5))-.45; base=mix(base,vec3(.5,.36,.2),smoothstep(.5,-.2,di)*.4);
      base=mix(base,vec3(.5,.52,.5),smoothstep(.4,-.4,star8(q,TS*.17))); }
    else base=mix(base,tStar(pidx)*1.3,smoothstep(.5,-.5,abs(q.x)+abs(q.y)-3.));
    vec3 copper=vec3(1.,.4,.09);
    float gl=.2+1.25*uGlow+6.*rg;
    if(e>=0.){                                                                           // grout: the copper glows from below
      col=copper*gl*(.35+.65*e/GR)*(.6+.4*noise(Fw*.35))*(1.-.6*sh)+Lf*.05;
    } else if(fz<top-1.6&&e>-1.){                                                        // the flank of a lifted tile
      col=base*.05+copper*gl*.5*(1.-fz/top);
    } else {
      vec2 g=vec2(tileE(Fw+vec2(.7,0.))-tileE(Fw-vec2(.7,0.)),tileE(Fw+vec2(0.,.7))-tileE(Fw-vec2(0.,.7)))/1.4;
      float bv=smoothstep(-2.4,-.1,e);
      vec3 n=normalize(vec3(g*bv*1.3+(hash22(c*.71)-.5)*.1,1.));
      float lit=1.-.78*sh;
      vec3 R=reflect(rd,n); float fre=.05+.95*pow(1.-max(dot(n,-rd),0.),5.);
      float mh=max(dot(R,LM),0.);
      col=base*(vec3(.04,.05,.09)+vec3(.55,.62,.95)*max(dot(n,LM),0.)*lit);
      col+=(vec3(.75,.85,1.)*(pow(mh,1500.)*.4+pow(mh,120.)*.07+pow(mh,24.)*.03)*lit+mix(vec3(.28,.1,.3),vec3(.03,.04,.12),clamp(R.z,0.,1.))*fre*2.5)*(.4+.6*lit);
      col+=copper*exp(e*.8)*gl*.42;                                                       // grout light climbing the bevel
      col+=base*Lf*1.4+Lf*.05;
      col*=(1.+.09*lf)*(1.-.5*sh); col+=copper*lf*.015*(1.+3.*rg);
    }
    col+=vec3(1.,.6,.3)*rg*.25;
    col=mix(col,vec3(.03,.02,.07),smoothstep(430.,640.,dist)*.7);
    col=col*(1.-oc.a)+oc.rgb;
  }
  fragColor=vec4(col,1.);
}`;

  // sparks: NSP bursts of NS instanced streaks, each a pure function of its burst's age
  const SVS = `#version 300 es
precision highp float;
uniform vec4 uSp[${NSP}], uSq[${NSP}];      // x, y, age, size | seed, colour, life, -
uniform float uTilt, uAsp, uZoom;
out vec2 vUv; out vec3 vCol;
const float ALT=${ALT}., CD=${CD}., TAU=6.28318530718;
float h1(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
vec3 wpos(vec4 E, float sd, float k, float age){
  float a=TAU*h1(k*1.37+sd*91.7), el=h1(k*2.71+sd*17.3), sp=(25.+230.*pow(h1(k*3.31+sd*5.1),2.2))*(.6+.4*E.w);
  vec3 v=vec3(cos(a),sin(a),0.)*sp; v.z=sp*(el*1.1-.2);
  vec3 p=vec3(E.xy,ALT)+v*(1.-exp(-3.4*age))/3.4; p.z-=120.*age*age;
  if(p.z<0.){ p.z=-p.z*.3; p.y-=${SV}.*age*.5; }
  return p;
}
vec2 proj(vec3 p){ vec3 f=vec3(0.,sin(uTilt),-cos(uTilt)), u=vec3(0.,cos(uTilt),sin(uTilt)), d=p-(vec3(0.,0.,ALT)-f*CD); return vec2(d.x,dot(d,u))/dot(d,f)*CD; }
void main(){
  int vid=gl_VertexID; vec2 c=vec2((vid==1||vid==2||vid==4)?1.:-1.,(vid==2||vid==4||vid==5)?1.:-1.);
  int e=gl_InstanceID/${NS}; float k=float(gl_InstanceID-e*${NS});
  vec4 E=uSp[e], S=uSq[e]; float age=E.z, life=S.z*(.35+.65*h1(k*7.7+S.x*3.3));
  vUv=c; vCol=vec3(0.);
  if(age<0.||age>life||k>=${NS}.*min(1.,E.w*.8+.1)){ gl_Position=vec4(2.,2.,2.,1.); return; }
  vec2 p1=proj(wpos(E,S.x,k,age)), p0=proj(wpos(E,S.x,k,max(age-.03,0.)));
  vec2 dir=p1-p0; float L=length(dir); dir=L>1e-4?dir/L:vec2(0.,1.);
  float tl=age/life, w=.55+.5*h1(k*5.3+S.x)*(1.-.5*tl);
  vec2 pos=mix(p0,p1,c.y*.5+.5)+dir*c.y*w+vec2(-dir.y,dir.x)*c.x*w;
  pos=(pos+vec2(0.,128.*(1.-1./uZoom)))*uZoom;
  gl_Position=vec4(pos/vec2(128.*uAsp,128.),0.,1.);
  vec3 base=S.y<.5?vec3(1.,.5,.12):S.y<1.5?vec3(1.,.8,.4):S.y<2.5?vec3(.15,.9,.8):vec3(.5,.7,1.);
  vCol=mix(mix(vec3(1.,.95,.85),base,smoothstep(0.,.3,tl)),base*vec3(.7,.25,.15),smoothstep(.5,1.,tl))*(1.-tl*tl)*(2.5+4.*h1(k*9.1+S.x));
}`;
  const SFS = `in vec3 vCol;
void main(){ if(isOld()>.5) discard; float a=exp(-dot(vUv,vUv)*2.4); fragColor=vec4(vCol*a,1.); }`;

  let prog, sprog, vao, msg, sprTex, M = null;
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const ease = k => 1 - Math.pow(1 - clamp(k, 0, 1), 3);
  const lowerB = (arr, t, key) => { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (key(arr[m]) < t) lo = m + 1; else hi = m; } return lo; };

  // where an enemy is at time t
  function posE(e, t) {
    const tau = t - e.ts;
    if (e.deb) { const k = (1 - Math.exp(-2.4 * tau)) / 2.4; return [e.sx + e.vx * k, e.sy + e.vy * k - SV * 0.5 * tau]; }
    const k = ease(tau / e.dur), sw = clamp(tau / e.dur, 0, 1), out = Math.max(0, tau - e.stay);
    return [e.sx + (e.tx - e.sx) * k + (e.arc || 0) * Math.sin(Math.PI * sw) + 10 * sw * Math.sin(1.9 * tau + e.ph),
      e.sy + (e.ty - e.sy) * k + 5 * sw * Math.sin(2.6 * tau + e.ph * 1.7) + 150 * out * out];
  }
  const bossPos = (M, t) => { const tau = t - M.B[36], k = sm(0.3, 2.5, tau), h = sm(M.B[44] - M.B[36], M.B[44] - M.B[36] + 1, tau);
    return [(44 + 14 * h) * k * Math.sin(tau * (0.9 + 0.5 * h)), 38 - 4 * h + 5 * Math.sin(tau * 1.7)]; };

  // ---------------- pre-play the whole level from the note data ----------------
  function build() {
    const B = LEY.barT, T0 = B[24], T1 = B[48], bd = B[25] - B[24], TD = B[47];
    let seed = 20261; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const chords = LEY.chords.filter(t => t >= T0 - 0.01 && t < T1).map(t => {
      const pcs = new Set(LEY.plucks.filter(p => Math.abs(p.t - t) < 0.09).map(p => p.n % 12));
      return { t, ty: pcs.has(10) ? 2 : pcs.has(3) ? 0 : 1 };
    });
    const palAt = t => { let ty = 0; for (const c of chords) if (c.t <= t) ty = c.ty; return ty; };
    const lim = t => t < B[29] + 0.5 ? 132 : 196;

    // ---- the cast
    const E = [];
    const form = (ts, sx, sy, tx, ty, o = {}) => E.push({ ts, type: o.type || 0, hp: o.hp || 4, col: o.col ?? palAt(ts), sx, sy, tx, ty, dur: o.dur || 0.8, arc: o.arc || 0,
      stay: o.stay || 3.3, ph: rnd() * 6.28, spin: (rnd() < 0.5 ? -1 : 1) * (1.5 + rnd()), td: 1e9, hits: [] });
    const wave = (ts, kind, L) => {
      const s = rnd() < 0.5 ? -1 : 1;
      if (kind === 0) for (let i = 0; i < 7; i++) form(ts + 0.05 * Math.abs(i - 3), (i - 3) * 16, 182 + 12 * Math.abs(i - 3), (i - 3) * 0.24 * L, 78 - Math.abs(i - 3) * 18);
      if (kind === 1) for (let i = 0; i < 8; i++) form(ts + 0.08 * i, s * (L + 70), 120 + 8 * i, s * (-0.84 * L + i * L * 0.24), 34 + 7 * i, { dur: 0.95, arc: -s * 0, type: 1 });
      if (kind === 2) for (let i = 0; i < 8; i++) { const sd = i % 2 ? 1 : -1, j = i >> 1; form(ts + 0.09 * j, sd * (L * 0.6 + 22 * j), 180, sd * (20 + j * 0.25 * L), 90 - j * 21, { type: j === 0 ? 0 : 1, arc: sd * 30 }); }
      if (kind === 3) for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; form(ts + 0.04 * i, s * 40 + 170 * Math.cos(a), 205 + 40 * Math.sin(a), s * 0.2 * L + 0.36 * L * Math.cos(a), 54 + 34 * Math.sin(a)); }
    };
    wave(T0 - 1.15, 0, 132);                                        // already in formation when the level starts: the first chord gets a full screen
    const kinds = [3, 1, 2, 0, 1, 3, 2, 1, 0, 2, 3, 0];
    for (let b = 24; b < 36; b++) {
      wave(B[b] + 0.38 * bd, kinds[b - 24], lim(B[b] + 0.5 * bd));
      if (b % 4 === 3) [-1, 1].forEach(s => form(B[b] + 0.05 * bd, s * 150, 185, s * 78, 58, { type: 2, hp: 14, dur: 1.1 }));
    }
    for (let b = 37; b < 47; b++) for (let i = 0; i < 4; i++) {     // the mandala's escorts
      const s = i % 2 ? 1 : -1, ts = B[b] + (0.4 + 0.05 * i) * bd, bp = bossPos({ B }, ts);
      form(ts, bp[0] + s * 20, bp[1], s * (70 + 60 * (i >> 1) + 30 * rnd()), 10 - 28 * (i >> 1) + 14 * rnd(), { type: 1, dur: 0.75, arc: s * 26, stay: 2.6 });
    }
    E.sort((a, b) => a.ts - b.ts);

    // ---- shots: one per pluck, a six-way fan on a chord
    const melT = new Set(LEY.melody.map(m => Math.round(m.t * 1000)));
    const shots = [];
    for (const p of LEY.plucks) {
      if (p.t < T0 - 0.001 || p.t >= TD - 0.05) continue;
      const c = chords.find(c => p.t > c.t - 0.12 && p.t < c.t + 0.09);
      if (c) { if (p.t < c.t - 0.001) continue; shots.push({ t0: c.t, ang: (p.s - 2.5) * 0.17, kind: 2, t1: 1e9 }); }
      else shots.push({ t0: p.t, ang: 0, kind: melT.has(Math.round(p.t * 1000)) ? 1 : 0, t1: 1e9 });
    }
    shots.sort((a, b) => a.t0 - b.t0);

    // ---- the mandala
    const boss = { on: B[36] + 0.05, solid: B[36] + 1.25, dead: TD, shed: new Array(7).fill(1e9), hits: [] };
    const shedBy = [44, 43, 42, 41, 40, 38, 37];                   // armour ring k falls to the chord of this bar

    // ---- play it
    const dt = 1 / 120, N = Math.ceil((T1 - T0) / dt) + 2, px = new Float32Array(N), pv = new Float32Array(N);
    const rings = [], ex = [], kills = [], hitT = [];
    let x = 0, v = 0, si = 0, ci = 0, live = [], gun = 1, maxLive = 0;
    const boom = (t, bx, by, size, col) => ex.push({ t, x: bx, y: by, size, col, seed: rnd() });
    for (let n = 0; n < N; n++) {
      const t = T0 + n * dt;
      px[n] = x; pv[n] = v;
      if (t >= TD && !boss.gone) { boss.gone = 1; const bp = bossPos({ B }, TD); rings.push({ t: TD, x: bp[0], y: bp[1] + SV * (TD - T0), ty: palAt(TD) }); }   // its death is one last shockwave
      while (ci < chords.length && chords[ci].t <= t) { const c = chords[ci++]; rings.push({ t: c.t, x, y: PY + SV * (c.t - T0), ty: c.ty }); }
      while (si < shots.length && shots[si].t0 <= t) { const s = shots[si++]; gun = -gun; s.x0 = x + (s.kind === 2 ? 0 : gun * 4); s.y0 = PY + 11; live.push(s); }
      const bAct = t >= boss.solid && t < boss.dead, bp = bossPos({ B }, t);
      // armour falls when the chord's shockwave reaches it
      if (bAct) for (let k = 0; k < 7; k++) if (boss.shed[k] > 1e8) {
        const r = rings.find(r => Math.abs(r.t - B[shedBy[k]]) < 0.05); if (!r) continue;
        const d = Math.hypot(bp[0] - r.x, bp[1] + SV * (t - T0) - r.y) - RR[k] * BS;
        if (ringR(t - r.t) >= d) { boss.shed[k] = t; for (let j = 0; j < 5; j++) { const a = rnd() * 6.283; boom(t, bp[0] + Math.cos(a) * RR[k] * BS, bp[1] + Math.sin(a) * RR[k] * BS, 1.1, 2); } }
      }
      let outer = -1; for (let k = 0; k < 7; k++) if (boss.shed[k] > t) outer = k;
      const bR = outer < 0 ? 8.5 * BS : (RR[outer] + 5.5) * BS;
      const act = []; for (const e of E) { if (e.ts > t) break; if (e.td > t && !e.deb) { const p = posE(e, t); if (p[1] < 205) { e.p = p; act.push(e); } } }
      maxLive = Math.max(maxLive, act.length);
      // bolts against tiles and mandala
      live = live.filter(s => {
        const tau = t - s.t0, bx = s.x0 + Math.sin(s.ang) * VB * tau, by = s.y0 + Math.cos(s.ang) * VB * tau;
        if (by > 150 || Math.abs(bx) > 250) { s.t1 = t; return false; }
        for (const e of act) if (e.td > t && e.p[1] < 150 && Math.abs(bx - e.p[0]) < (e.type === 2 ? 14.5 : 11) && Math.abs(by - e.p[1]) < (e.type === 2 ? 15 : 11)) {
          s.t1 = t; e.hits.push(t); hitT.push(t);
          if (--e.hp <= 0) { e.td = t; kills.push(t); boom(t, e.p[0], e.p[1], e.type === 2 ? 1.8 : 1, e.col); } else ex.push({ t, x: bx, y: by, size: 0.3, col: 3, seed: rnd(), small: 1 });
          return false;
        }
        if (bAct && Math.hypot(bx - bp[0], by - bp[1]) < bR) { s.t1 = t; boss.hits.push(t); hitT.push(t); ex.push({ t, x: bx, y: by, size: 0.3, col: 3, seed: rnd(), small: 1 }); return false; }
        return true;
      });
      // smart bombs
      for (const r of rings) { const ag = t - r.t; if (ag > 0.5) continue;
        for (const e of act) if (e.td > t && e.p[1] < 140 && Math.hypot(e.p[0] - r.x, e.p[1] + SV * (t - T0) - r.y) < ringR(ag)) { e.td = t; kills.push(t); boom(t, e.p[0], e.p[1], e.type === 2 ? 1.8 : 1, e.col); } }
      // the pilot: lead the lowest tile, or strafe the mandala
      let tg = null; for (const e of act) if (e.td > t && e.p[1] < 140 && e.p[1] > PY + 22 && (!tg || e.p[1] < tg.p[1])) tg = e;
      let want = 50 * Math.sin((t - T0) * 1.3);
      if (tg) want = posE(tg, t + (tg.p[1] - PY) / VB)[0];
      else if (bAct) want = bp[0] + 62 * Math.sin((t - T0) * 2.3);
      want = clamp(want, -lim(t) + 12, lim(t) - 12);
      v += (70 * (want - x) - 15 * v) * dt; v = clamp(v, -330, 330); x += v * dt;
    }
    // ---- the end: the heart goes on the downbeat of bar 47, the rest follows on its last six thumb notes
    for (let j = 0; j < 5; j++) { boom(TD, bossPos({ B }, TD)[0], bossPos({ B }, TD)[1], 3, j % 3); if (j) ex[ex.length - 1].small = 2; }
    LEY.melody.filter(m => m.t > TD + 0.05 && m.t < T1 - 0.2).forEach(m => { const bp = bossPos({ B }, TD); for (let j = 0; j < 2; j++) boom(m.t, bp[0] + (rnd() - 0.5) * 90, bp[1] + (rnd() - 0.5) * 70, 1.7, j ? 0 : 2); });
    for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + rnd() * 0.3, sp = 90 + 190 * rnd(), bp = bossPos({ B }, TD);
      E.push({ ts: TD, deb: 1, type: 3, col: 0, sx: bp[0], sy: bp[1], vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, td: 1e9, hits: [], ph: rnd() * 6, spin: 5 + 6 * rnd() }); }
    ex.sort((a, b) => a.t - b.t); kills.sort((a, b) => a - b); hitT.sort((a, b) => a - b);
    return { B, T0, T1, TD, dt, px, pv, E, shots, rings, ex, kills, hitT, boss, chords, palAt, maxLive };
  }

  const ea = new Float32Array(NE * 4), eb = new Float32Array(NE * 4), bo = new Float32Array(NBO * 4), xs = new Float32Array(NX * 4);
  const sp = new Float32Array(NSP * 4), sq = new Float32Array(NSP * 4), rg = new Float32Array(8), br = new Float32Array(7);

  function init() {
    prog = G.program(FS, 'shmup'); sprog = G.program(SFS, 'shmup-sparks', SVS);
    vao = G.gl.createVertexArray();
    msg = PIX.message('SCORE LEVEL 2THE FLOOR OF STARS');
    const a = SPR.build(); sprTex = G.texture(a.w, a.h, { data: a.data });   // texelFetch for 1985, bilinear for now
  }

  // the beam on the crash of bar 28 (shared with the soundtrack, which opens with it)
  const beamAt = lt => Math.min(1, Math.max(0, (lt - (LEY.barT[28] - LEY.barT[24])) / 1.5));
  function draw(st, tgt) {
    if (!M) M = build();
    const lt = st.lt, t = st.t - LEY.AT, B = M.B, gl = G.gl;
    const beam = beamAt(lt);
    const fi = clamp((t - M.T0) / M.dt, 0, M.px.length - 1.001), i0 = Math.floor(fi), fr = fi - i0;
    const sx = M.px[i0] + (M.px[i0 + 1] - M.px[i0]) * fr, sv = M.pv[i0];
    const tilt = 0.42 * sm(8.0, 12.5, lt) + 0.03 * Math.sin(lt * 0.37) * sm(12, 16, lt);
    // tiles
    let ne = 0;
    for (const e of M.E) {
      if (e.ts > t) break; if (t >= e.td || ne >= NE) continue;
      const p = posE(e, t), tau = t - e.ts; if (p[1] > 205) continue;
      let ang = e.ph + e.spin * tau, sc = 1.25, al = 1, fl = 0;
      if (e.type === 1) { const p2 = posE(e, t + 0.03); ang = -Math.atan2(p2[0] - p[0], -(p2[1] - p[1])) * sm(0, 0.5, e.dur * 1.2 - tau) + 0.25 * Math.sin(tau * 3 + e.ph) * sm(e.dur, e.dur + 0.4, tau); }
      if (e.type === 2) ang = e.spin * 0.35 * tau;
      if (e.deb) { if (tau > 1.5) continue; sc = 1.3 - 0.6 * tau / 1.5; al = 1 - Math.pow(tau / 1.5, 2); }
      for (const h of e.hits) if (h <= t) fl = Math.max(fl, 1 - (t - h) / 0.09);
      // sprite: tiles -> mines, interceptors -> bio-drones or bronze craft (alternate bars), gunships, debris
      const spr = e.type === 0 ? 1 : e.type === 1 ? (e.v ??= 2 + (lowerB(B, e.ts, x => x) & 1)) : e.type === 2 ? 4 : 5;
      ea.set([p[0], p[1], ang, sc], ne * 4); eb.set([spr, e.col, fl, al], ne * 4); ne++;
    }
    // bolts
    let nb = 0;
    for (let i = lowerB(M.shots, t - 1.2, s => s.t0); i < M.shots.length && nb < NBO; i++) {
      const s = M.shots[i]; if (s.t0 > t) break; if (t >= s.t1) continue;
      const tau = t - s.t0; bo.set([s.x0 + Math.sin(s.ang) * VB * tau, s.y0 + Math.cos(s.ang) * VB * tau, s.kind, s.ang], nb * 4); nb++;
    }
    // explosions (newest first), and the spark bursts they throw
    let nx = 0, ns = 0; sp.fill(-1);
    for (let i = lowerB(M.ex, t + 1e-6, e => e.t) - 1; i >= 0; i--) {
      const e = M.ex[i], ag = t - e.t; if (ag > 1.3) break;
      const life = e.small === 1 ? 0.35 : 0.75 + 0.3 * e.size;
      if (!e.small && ag < 0.6 && nx < NX) { xs.set([e.x, e.y, ag, e.size], nx * 4); nx++; }
      if (ag < life && ns < NSP) { sp.set([e.x, e.y, ag, e.size], ns * 4); sq.set([e.seed, e.col, life, 0], ns * 4); ns++; }
    }
    // shockwaves and harmony
    rg.fill(-1); let lmax = 1, r0 = null, pal0 = 0;
    for (let i = M.rings.length - 1, n = 0; i >= 0 && n < 2; i--) {
      const r = M.rings[i]; if (r.t > t) continue;
      if (n === 0) { r0 = r; pal0 = i > 0 ? M.rings[i - 1].ty : 0; }
      const ag = t - r.t; if (ag < 1.7) { rg.set([r.x, r.y, ag, 0], n * 4); lmax = Math.max(lmax, 13 * Math.exp(-ag * 2.1) + 3); }
      n++;
    }
    // the mandala
    const bs = M.boss, bp = bossPos(M, t), bOn = t >= bs.on && t < bs.dead;
    for (let k = 0; k < 7; k++) br[k] = !bOn ? 0 : t >= bs.shed[k] ? 1 + Math.min(1, (t - bs.shed[k]) / 0.75) : clamp((t - bs.on - 0.07 * (6 - k)) / 0.85, 0.001, 1);
    let bh = 0; { const i = lowerB(bs.hits, t + 1e-6, x => x) - 1; if (i >= 0) bh = Math.max(0, 1 - (t - bs.hits[i]) / 0.1); }
    let outer = -1; for (let k = 0; k < 7; k++) if (bs.shed[k] > t) outer = k;
    const zoom = 1 + 0.1 * sm(7.7, 11.5, lt);
    const open = t >= bs.shed[0] ? sm(0, 0.4, t - bs.shed[0]) : 0, crack = open * clamp((t - bs.shed[0]) / (M.TD - bs.shed[0]), 0, 1);
    const kick = LEY.env('kick', t, 6);
    G.draw(prog, {
      uAtlas: PIX.atlas, uMsg: msg, uSpr: sprTex, uBeam: beam, uLt: lt, uScroll: SV * (t - M.T0), uTilt: tilt,
      uScore: 8800 + 10 * lowerB(M.hitT, t + 1e-6, x => x) + 100 * lowerB(M.kills, t + 1e-6, x => x),
      uGlow: kick, uLiftMax: lmax, uShip: [sx, PY, clamp(sv / 300, -1, 1), 0.4 + 0.6 * LEY.env('pluck', t, 14)],
      uEa: ea, uEb: eb, uNE: ne, uBo: bo, uNB: nb, uEx: xs, uNX: nx, uRing: rg, uPal: [pal0, r0 ? r0.ty : 0, 0],
      uBoss: [bp[0], bp[1], bOn ? 1 : 0], uBR: br, uBossRot: (t - B[36]) * (0.5 + 0.9 * open), uBossHit: bh, uHeart: open * (0.4 + 0.6 * crack), uCrack: crack, uOuter: outer, uZoom: zoom,
    }, tgt);
    if (ns > 0) {
      G.use(sprog, { uSp: sp, uSq: sq, uTilt: tilt, uAsp: tgt.w / tgt.h, uBeam: beam, uZoom: zoom }, tgt);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.bindVertexArray(vao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, ns * NS);
      gl.disable(gl.BLEND);
    }
    const crt = 1 - sm(7.3, 9.1, lt), wide = sm(7.7, 9.7, lt), end = st.dur - lt;
    return { lines: 256, beam, crt, fa: 1.25 + (st.W / st.H - 1.25) * wide, scan: 256, bloom: 0.5, thresh: 1.0, expo: 1.0,
      aberr: 0.22 * crt, grain: 0.03, vig: 0.35 + 0.2 * (1 - crt), fade: Math.min(1, end / 0.15) };
  }

  (window.SCENES = window.SCENES || []).push({
    name: 'Shmup', title: 'LEVEL 2: THE FLOOR OF STARS', disk: 2, init, draw, tube: 0.7, beamAt, paula: true,
    range: () => [LEY.AT + LEY.sec('shmup')[0], LEY.AT + LEY.sec('shmup')[1]],
  });
})();
