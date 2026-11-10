'use strict';
// =====================================================================
//  MUSIC: a tiny "tracker" that renders an original tune offline.
//  Chip sections emulate Paula (4 hard-panned channels, 8-bit samples,
//  nearest-neighbour playback at ~16 kHz). Modern sections add supersaws,
//  resonant filters, sidechain pumping, stereo reverb and ping-pong delay.
// =====================================================================
const MUSIC = (() => {
  const SR = 44100, BPM = 125;               // ProTracker's default tempo
  const ROW = 60 / BPM / 4, BAR = ROW * 16, PAT = ROW * 64;
  const TAU = Math.PI * 2;
  const mtof = n => 440 * Math.pow(2, (n - 69) / 12);
  let seed = 1985;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2147483648 - 1;

  // ---- 8-bit, 32-sample wavetables (like hand-drawn chip samples) ----
  const tbl = f => { const a = new Float32Array(32); for (let i = 0; i < 32; i++) a[i] = Math.round(f(i / 32) * 127) / 128; return a; };
  const W_LEAD = tbl(p => (p < 0.5 ? 0.7 : -0.7) + 0.3 * (2 * p - 1));
  const W_ARP = tbl(p => (p < 0.25 ? 0.9 : -0.6));
  const W_BASS = tbl(p => 0.65 * (4 * Math.abs(p - 0.5) - 1) + 0.35 * (p < 0.5 ? 1 : -1));
  const DET = [-0.19, -0.11, -0.04, 0, 0.04, 0.11, 0.19].map(c => Math.pow(2, c / 12));
  const CR = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0].map(x => x * 2.2);
  const CHD = [0.996, 1, 1.004];

  const adsr = (t, dur, a, d, s, r) => {
    let e = t < a ? t / a : s + (1 - s) * Math.exp(-(t - a) / d);
    return t > dur ? e * Math.exp(-(t - dur) / r) : e;
  };
  const svf = (v, x, fc, q) => {          // Chamberlin state-variable filter
    const f = 2 * Math.sin(Math.PI * Math.min(fc, SR / 6) / SR);
    v.lo += f * v.bp; const hp = x - v.lo - q * v.bp; v.bp += f * hp; return v.lo;
  };
  const pitch = (e, t) => {
    let n = e.n;
    if (e.arp) n += e.arp[Math.floor(t * 50) % e.arp.length];          // 0xy arpeggio @ 50 Hz
    if (e.from !== undefined) n = e.from + (n - e.from) * Math.min(1, t / 0.07); // 3xx portamento
    if (e.vib) n += e.vib * Math.sin(TAU * 5.5 * t) * Math.min(1, Math.max(0, t - 0.18) * 4); // 4xy vibrato
    return mtof(n);
  };

  // ---------------------------- instruments ----------------------------
  const I = {
    chip: { rel: 0.03, tick(v, t, e) {
      v.ph = (v.ph + pitch(e, t) / SR) % 1;
      return e.w[(v.ph * 32) | 0] * adsr(t, e.dur, 0.002, e.dec || 0.4, e.sus ?? 0.6, 0.02);
    } },
    kick: { rel: 0, tick(v, t) {
      v.ph += (42 + 130 * Math.exp(-t * 30)) / SR;
      return Math.sin(TAU * v.ph) * Math.exp(-t * 6) * Math.min(1, t * 2000) + rnd() * Math.exp(-t * 400) * 0.25;
    } },
    snare: { rel: 0, tick(v, t) {
      const n = rnd(); v.lo += (n - v.lo) * 0.35;
      return Math.sin(TAU * 190 * t) * Math.exp(-t * 25) * 0.45 + Math.sin(TAU * 330 * t) * Math.exp(-t * 30) * 0.15 + (n - v.lo) * Math.exp(-t * 11) * 0.9;
    } },
    hat: { rel: 0, tick(v, t, e) { const n = rnd(); v.lo += (n - v.lo) * 0.7; return (n - v.lo) * Math.exp(-t * (e.open ? 7 : 50)); } },
    crash: { rel: 0, tick(v, t) {
      const n = rnd(); v.lo += (n - v.lo) * 0.5; let m = 0;
      for (let i = 0; i < 6; i++) m += (t * CR[i]) % 1 < 0.5 ? 1 : -1;
      return ((n - v.lo) * 0.7 + m * 0.05) * Math.exp(-t * 2.2);
    } },
    riser: { rel: 0, tick(v, t, e) {
      const k = t / e.dur; svf(v, rnd(), 300 * Math.pow(30, k), 0.25);
      v.ph += 110 * Math.pow(4, k) / SR;
      return (v.bp * 0.8 + ((v.ph % 1) * 2 - 1) * 0.12) * k * k;
    } },
    impact: { rel: 0, tick(v, t) {
      v.ph += (28 + 60 * Math.exp(-t * 4)) / SR; const n = rnd(); v.lo += (n - v.lo) * 0.05;
      return Math.tanh(Math.sin(TAU * v.ph) * 1.6) * Math.exp(-t * 1.2) + v.lo * Math.exp(-t * 3) * 2;
    } },
    mbass: { rel: 0.04, tick(v, t, e) {
      const f = pitch(e, t); v.ph = (v.ph + f / SR) % 1; v.ph2 = (v.ph2 + f * 1.004 / SR) % 1;
      const x = (2 * v.ph - 1) * 0.6 + (v.ph2 < 0.5 ? 0.45 : -0.45);
      return svf(v, x, 160 + (e.cut || 2400) * Math.exp(-t * 14), 0.5) * adsr(t, e.dur, 0.003, 0.25, 0.7, 0.03);
    } },
    sub: { rel: 0.2, tick(v, t, e) { v.ph = (v.ph + pitch(e, t) / SR) % 1; return Math.tanh(Math.sin(TAU * v.ph) * 1.8) * adsr(t, e.dur, 0.01, 1, 1, 0.2); } },
    saw: { rel: 0.25, tick(v, t, e) {
      const f = pitch(e, t); v.ph = (v.ph + f / SR) % 1; v.ph2 = (v.ph2 + f * 1.006 / SR) % 1; v.ph3 = (v.ph3 + f * 0.5 / SR) % 1;
      const x = (v.ph + v.ph2 - 1) + (v.ph3 < 0.5 ? 0.3 : -0.3);
      return svf(v, x, 900 + 3500 * Math.exp(-t * 3), 0.6) * adsr(t, e.dur, 0.005, 0.6, 0.7, 0.2) * 0.7;
    } },
    super: { rel: 0.3, init(v) { v.p = new Float64Array(7).map(() => Math.random()); }, tick(v, t, e) {
      const f = pitch(e, t) / SR; let x = 0;
      for (let i = 0; i < 7; i++) { let p = v.p[i] + f * DET[i]; p -= p | 0; v.p[i] = p; x += p; }
      return svf(v, (x - 3.5) * 0.35, e.cut || 5200, 0.7) * adsr(t, e.dur, e.att || 0.01, 0.8, 0.75, e.rel || 0.3);
    } },
    bell: { rel: 1.6, tick(v, t, e) {
      const f = pitch(e, t); v.ph = (v.ph + f / SR) % 1; v.ph2 = (v.ph2 + f * 3.5 / SR) % 1;
      return Math.sin(TAU * v.ph + 2.2 * Math.exp(-t * 4) * Math.sin(TAU * v.ph2)) * Math.exp(-t * 2.2) * Math.min(1, t * 500);
    } },
    flute: { rel: 0.2, tick(v, t, e) {
      const f = pitch(e, t); v.ph = (v.ph + f / SR) % 1; const n = rnd(); v.lo += (n - v.lo) * 0.1;
      return ((1 - 4 * Math.abs(v.ph - 0.5)) * 0.8 + Math.sin(TAU * 2 * v.ph) * 0.2 + v.lo * 0.4) * adsr(t, e.dur, 0.06, 0.8, 0.8, 0.2);
    } },
    // Extended Karplus-Strong nylon string: noise burst shaped by brightness and pluck position,
    // averaging loss filter, allpass fractional delay for exact tuning. The string rings until
    // e.dur (the next pluck of the same string), then it is damped like a finger touching it.
    guitar: { rel: 0.14, init(v, e) {
      const f = mtof(e.n), P = SR / f, S = Math.min(0.5, Math.max(0.12, 0.5 - (e.n - 52) * 0.012));  // lighter loss up high
      let N = Math.floor(P - S), fr = P - S - N; if (fr < 0.2) { N--; fr += 1; }
      v.C = (1 - fr) / (1 + fr); v.N = N; v.i = 0; v.last = 0; v.ax = 0; v.ay = 0; v.S = S;
      v.g = Math.min(2, Math.max(0.8, Math.pow(f / 165, 0.35)));
      const b = new Float32Array(N), br = e.br ?? 0.55; let lp = 0, m = 0, pk = 1e-6;
      for (let i = 0; i < N; i++) { lp += (rnd() - lp) * (0.12 + 0.78 * br); b[i] = lp; }
      const M = Math.max(1, Math.round(N * (e.pos ?? 0.13))), c = Float32Array.from(b);
      for (let i = 0; i < N; i++) { b[i] = c[i] - c[(i - M + N) % N]; m += b[i]; }
      m /= N; for (let i = 0; i < N; i++) { b[i] -= m; pk = Math.max(pk, Math.abs(b[i])); }
      for (let i = 0; i < N; i++) b[i] /= pk;
      v.b = b;
      v.rho = Math.pow(0.001, 1 / (f * Math.min(9, Math.max(2.5, 8 * Math.sqrt(110 / f))) * (e.ring ?? 1)));
    }, tick(v, t, e) {
      const cur = v.b[v.i], nv = (1 - v.S) * cur + v.S * v.last; v.last = cur;
      const ap = v.C * nv + v.ax - v.C * v.ay; v.ax = nv; v.ay = ap;
      v.b[v.i] = ap * (t > e.dur ? 0.55 : v.rho);
      if (++v.i >= v.N) v.i = 0;
      return cur * v.g;
    } },
    castanet: { rel: 0, tick(v, t) {
      let s = 0;
      for (let k = 0; k < 2; k++) { const tt = t - k * 0.012; if (tt >= 0) s += Math.sin(TAU * (2300 + k * 350) * tt) * Math.exp(-tt * 320); }
      return s * 0.8 + rnd() * Math.exp(-t * 600) * 0.5;
    } },
    shaker: { rel: 0, tick(v, t) { const n = rnd(); v.lo += (n - v.lo) * 0.8; return (n - v.lo) * (t < 0.012 ? t / 0.012 : Math.exp(-(t - 0.012) * 45)); } },
    timp: { rel: 0, tick(v, t, e) {
      v.ph += mtof(e.n) * (1 + 0.04 * Math.exp(-t * 10)) / SR; const n = rnd(); v.lo += (n - v.lo) * 0.08;
      return (Math.sin(TAU * v.ph) + 0.3 * Math.sin(TAU * 1.51 * v.ph) * Math.exp(-t * 3)) * Math.exp(-t * 1.6) * Math.min(1, t * 400) + v.lo * Math.exp(-t * 30) * 1.5;
    } },
    choir: { rel: 0.7, init(v) { v.f2 = { lo: 0, bp: 0 }; v.p = new Float64Array(3).map(() => Math.random()); }, tick(v, t, e) {
      const f = pitch(e, t) * (1 + 0.004 * Math.sin(TAU * 5.1 * t)) / SR; let x = 0;
      for (let i = 0; i < 3; i++) { let p = v.p[i] + f * CHD[i]; p -= p | 0; v.p[i] = p; x += p - 0.5; }
      svf(v, x, 760, 0.25); const a = v.bp; svf(v.f2, x, 1180, 0.3);
      return (a * 0.9 + v.f2.bp * 0.6) * adsr(t, e.dur, e.att || 0.45, 1, 1, 0.7);
    } },
    bow: { rel: 0.45, tick(v, t, e) {
      const f = pitch(e, t); v.ph = (v.ph + f / SR) % 1; v.ph2 = (v.ph2 + f * 1.003 / SR) % 1;
      return svf(v, v.ph + v.ph2 - 1, 2600, 0.8) * adsr(t, e.dur, e.att || 0.12, 1, 1, 0.4);
    } },
    click: { rel: 0, tick(v, t) { return rnd() * Math.exp(-t * 300) * 0.6 + Math.sin(TAU * 95 * t) * Math.exp(-t * 50); } },
    motor: { rel: 0.3, tick(v, t, e) {
      v.ph = (v.ph + (50 + 3 * Math.sin(t * 2)) / SR) % 1; const n = rnd(); v.lo += (n - v.lo) * 0.02;
      return (Math.sin(TAU * v.ph) * 0.5 + Math.sin(TAU * 3 * v.ph) * 0.25 + v.lo * 3) * adsr(t, e.dur, 0.3, 1, 1, 0.3);
    } },
  };

  // ------------------------------ the song ------------------------------
  const CH = { Am: [57, 60, 64], F: [53, 57, 60], C: [52, 55, 60], G: [55, 59, 62], E: [52, 56, 59], D: [54, 57, 62],
    Fmaj7: [53, 57, 60, 64], Em7: [52, 55, 59, 62] };
  const ROOT = { Am: 9, F: 5, C: 0, G: 7, E: 4, D: 2, Fmaj7: 5, Em7: 4 };
  const PROG = { A: ['Am', 'F', 'C', 'G'], B: ['F', 'G', 'Am', 'Am'], V: ['Am', 'Am', 'C', 'D'],
    C: ['Fmaj7', 'G', 'Em7', 'Am'], D1: ['Am', 'Am', 'G', 'G'], D2: ['F', 'F', 'E', 'E'] };
  const MEL = {
    A1: 'E5 . . . A5 . . . G5 . E5 . D5 . E5 .  C5 . . . . . A4 . C5 . D5 . . . C5 .  E5 . . . G5 . . . E5 . D5 . C5 . D5 .  B4 . . . . . G4 . A4 . B4 . D5 . . .',
    A2: 'E5 . . . A5 . . . B5 . C6 . B5 . A5 .  G5 . . . F5 . . . E5 . F5 . . . E5 .  C5 . . . E5 . G5 . C6 . . . B5 . G5 .  D5 . . . G5 . . . A5 . . . . . - .',
    B1: 'A4 . C5 . F5 . . . E5 . . . C5 . . .  D5 . . . G5 . . . B4 . D5 . G5 . A5 .  C6 . . . . . B5 . A5 . . . E5 . . .  A5 . G5 . E5 . D5 . C5 . D5 . E5 . . .',
    B2: 'F5 . . . A5 . . . C6 . . . A5 . G5 .  B5 . . . . . . . D6 . . . B5 . G5 .  A5 . . . E6 . . . D6 . C6 . B5 . C6 .  A5 . . . . . . . E5 . G5 . A5 . . .',
    C1: 'C6 . . . . . . . A5 . . . G5 . . .  B5 . . . . . . . D6 . . . . . . .  G5 . . . . . . . E5 . . . G5 . . .  A5 . . . . . . . . . . . . . . .',
    C2: 'A5 . . . C6 . . . E6 . . . D6 . C6 .  D6 . . . . . B5 . G5 . . . A5 . B5 .  G5 . . . . . E5 . B5 . . . A5 . G5 .  A5 . . . . . . . . . . . . . . .',
  };
  const DR = {
    D1: { k: 'x.......x.x.....', s: '....x.......x...', h: '..x...x...x...x.' },
    D2: { k: 'x...x...x...x...', s: '....x.......x...', h: 'x...x...x...x...', o: '..x...x...x...x.' },
    D3: { k: 'x.........x.....', s: '........x.......', h: '.x.x.x.x.x.x.x.x' },
    D4: { k: 'x..x..x...x..x..', s: '....x.......x..x', h: 'xxxxxxxxxxxxxxxx' },
  };
  const FILL = { k: 'x.....x.........', s: '....x...x.x.xxxx' };
  const SEQ = [0, 2, 4, 2, 1, 3, 5, 3, 0, 2, 4, 6, 5, 4, 3, 1];

  const SONG = [
    { boot: 1 },                                                                        // 0  boot / disk loading
    { p: 'A', chip: 1, bass: 'oct', arp: 1 },                                           // 1  cracktro
    { p: 'A', chip: 1, bass: 'oct', arp: 1, dr: 'D1', mel: 'A1' },
    { p: 'A', chip: 1, bass: 'oct', arp: 1, dr: 'D1', mel: 'A2' },
    { p: 'A', chip: 1, bass: 'oct', arp: 1, dr: 'D1', mel: 'A1', fill: 1, riser: 1 },
    { p: 'B', bass: 'sub', arp: 1, pad: 1, impact: 1, fill: 1 },                        // 5  breakout / boing
    { p: 'B', bass: 'mod', arp: 1, pad: 1, dr: 'D2', mel: 'B1', lead: 'saw', crash: 1 },
    { p: 'B', bass: 'mod', arp: 1, pad: 1, dr: 'D2', mel: 'B2', lead: 'saw' },
    { p: 'B', bass: 'mod', arp: 1, pad: 1, dr: 'D2', mel: 'B1', lead: 'saw', oct: 12, fill: 1, riser: 1 },
    { p: 'V', bass: 'roll', arp: 1, dr: 'D2', seq: 'chip', crash: 1 },                  // 9  vector balls
    { p: 'V', bass: 'roll', arp: 1, dr: 'D2', seq: 'chip', pad: 1 },
    { p: 'V', bass: 'roll', arp: 1, dr: 'D2', seq: 'super', pad: 1, fill: 1, riser: 1 },
    { p: 'C', bass: 'long', pad: 1, bell: 1, dr: 'D3', mel: 'C1', lead: 'flute', crash: 1 }, // 12 parallax
    { p: 'C', bass: 'long', pad: 1, bell: 1, dr: 'D3', mel: 'C2', lead: 'flute' },
    { p: 'C', bass: 'long', pad: 1, bell: 1, dr: 'D3', mel: 'C1', lead: 'flute', fill: 1, riser: 1 },
    { p: 'D1', bass: 'roll', dr: 'D4', seq: 'super', arp: 1, crash: 1 },                // 15 tunnel
    { p: 'D2', bass: 'roll', dr: 'D4', seq: 'super', arp: 1, pad: 1 },
    { p: 'D1', bass: 'roll', dr: 'D4', seq: 'super', arp: 1, pad: 1, fill: 1, riser: 1 },
    { p: 'A', bass: 'mod', dr: 'D2', pad: 1, mel: 'A1', lead: 'super', oct: 12, arp: 1, impact: 1, crash: 1 }, // 18 fractal
    { p: 'A', bass: 'mod', dr: 'D2', pad: 1, mel: 'A2', lead: 'super', oct: 12, arp: 1 },
    { p: 'A', bass: 'mod', dr: 'D2', pad: 1, mel: 'A1', lead: 'super', oct: 12, arp: 1, seq: 'bell', crash: 1 },
    { p: 'A', bass: 'mod', dr: 'D2', pad: 1, mel: 'A2', lead: 'super', oct: 12, arp: 1, seq: 'bell', fill: 1, riser: 1 },
    { p: 'A', chip: 1, bass: 'oct', arp: 1, dr: 'D1', mel: 'A2', crash: 1 },            // 22 greetings
    { p: 'A', chip: 1, bass: 'oct', arp: 1, dr: 'D1', mel: 'A1' },
    { end: 1 },                                                                         // 24 the end
  ];
  const NPAT = SONG.length, LEN = NPAT * PAT + 2, N = Math.ceil(LEN * SR);

  const parseMel = str => {
    const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }; const out = []; let cur = null;
    str.trim().split(/\s+/).forEach((k, i) => {
      if (k === '.') { if (cur) cur.len++; return; }
      cur = null; if (k === '-') return;
      const m = k.match(/^([A-G])(#?)(\d)$/);
      cur = { step: i, n: NOTE[m[1]] + (m[2] ? 1 : 0) + 12 * (+m[3] + 1), len: 1 }; out.push(cur);
    });
    return out;
  };

  const SYNC = { kick: [], snare: [], hat: [], bass: [], lead: [], crash: [] };

  function build() {
    const ev = [], kicks = [];
    const add = o => { ev.push(o); const s = SYNC[o.sync || o.i]; if (s) s.push(o.t); return o; };
    const ext = ch => [ch[0], ch[1], ch[2], ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24];
    SONG.forEach((sec, pi) => {
      const T0 = pi * PAT;
      if (sec.boot) {
        add({ t: 0.3, i: 'motor', dur: 4.6, v: 0.18 });
        [0.5, 1.4, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.5, 3.56, 3.62, 3.68, 3.74, 4.1, 4.2, 4.3, 4.4].forEach(t => add({ t, i: 'click', dur: 0.08, v: 0.35, pan: -0.2 }));
        for (let t = 4.7; t < 7.4; t += ROW / 4) {                // decrunch blips
          const n = [57, 60, 62, 64, 67, 69, 72, 76][(Math.abs(rnd()) * 8) | 0];
          add({ t, i: 'chip', w: W_ARP, n, dur: ROW / 5, dec: 0.02, sus: 0.3, v: 0.05 + 0.04 * (t - 4.7) / 2.7, pan: rnd() * 0.8, chip: 1 });
        }
        return;
      }
      if (sec.end) {
        add({ t: T0, i: 'kick', dur: 0.6, v: 1 }); add({ t: T0, i: 'crash', dur: 3, v: 0.4, rv: 0.4 }); add({ t: T0, i: 'impact', dur: 3, v: 0.5 });
        CH.Am.concat([69, 45]).forEach((n, j) => add({ t: T0, i: 'super', n, dur: PAT - 2, att: 0.05, rel: 2.5, cut: 2200, v: 0.11, pan: (j % 2 ? 0.5 : -0.5), rv: 0.6 }));
        for (let s = 0; s < 24; s++) add({ t: T0 + s * ROW * 2, i: 'bell', n: ext(CH.Am)[s % 7] + 12, dur: 0.1, v: 0.12 * (1 - s / 24), pan: Math.sin(s) * 0.7, rv: 0.6, dl: 0.4 });
        return;
      }
      const chip = !!sec.chip, modern = !chip;
      const P = chip ? { dr: -0.75, bass: 0.75, lead: 0.75, arp: -0.75 } : { dr: 0, bass: 0, lead: 0.1, arp: -0.35 };
      const RV = chip ? 0.03 : 0.28;
      if (sec.impact) { add({ t: T0, i: 'impact', dur: 3, v: 0.8 }); add({ t: T0, i: 'crash', dur: 3, v: 0.45, rv: 0.4 }); }
      else if (sec.crash) add({ t: T0, i: 'crash', dur: 3, v: 0.3, rv: 0.35 });
      if (sec.riser) add({ t: T0 + PAT - 2 * BAR, i: 'riser', dur: 2 * BAR, v: 0.3, rv: 0.3 });
      for (let bar = 0; bar < 4; bar++) {
        const tb = T0 + bar * BAR, cn = PROG[sec.p][bar], ch = CH[cn], root = 33 + ((ROOT[cn] + 3) % 12);
        const fill = sec.fill && bar === 3;
        // ---- drums ----
        const d = sec.dr ? DR[sec.dr] : (fill ? DR.D2 : null);
        if (d) for (let s = 0; s < 16; s++) {
          const t = tb + s * ROW, kp = fill ? FILL.k : d.k, sp = fill ? FILL.s : d.s;
          if (kp[s] === 'x') { add({ t, i: 'kick', dur: 0.6, v: chip ? 0.85 : 1, pan: chip ? P.dr : 0, chip }); if (modern) kicks.push(t); }
          if (sp[s] === 'x') add({ t, i: 'snare', dur: 0.4, v: fill ? 0.3 + 0.4 * s / 16 : 0.6, pan: chip ? P.dr : 0.05, chip, rv: RV * 0.7 });
          if (d.h[s] === 'x' && !fill) add({ t, i: 'hat', dur: 0.1, v: s % 4 === 0 ? 0.2 : 0.13, pan: chip ? P.dr : 0.3, chip });
          if (d.o && d.o[s] === 'x' && !fill) add({ t, i: 'hat', sync: 'hat', open: 1, dur: 0.3, v: 0.12, pan: -0.3, rv: 0.1 });
        }
        // ---- bass ----
        const B = { pan: P.bass, chip, duck: modern, sync: 'bass' };
        if (sec.bass === 'oct') for (let s = 0; s < 16; s += 2) add({ ...B, t: tb + s * ROW, i: 'chip', w: W_BASS, n: root + 12 + ((s >> 1) % 2 ? 12 : 0), dur: ROW * 1.6, dec: 0.15, sus: 0.4, v: 0.5 });
        if (sec.bass === 'sub') add({ ...B, t: tb, i: 'sub', n: root, dur: BAR * 0.95, v: 0.55 });
        if (sec.bass === 'mod') [0, 3, 6, 8, 10, 12, 14].forEach((s, j) => add({ ...B, t: tb + s * ROW, i: 'mbass', n: root + [0, 12, 0, 0, 12, 0, 12][j], dur: ROW * 1.5, v: 0.5 }));
        if (sec.bass === 'roll') for (let s = 0; s < 16; s++) add({ ...B, t: tb + s * ROW, i: 'mbass', n: root + (s % 4 === 2 ? 12 : 0), dur: ROW * 0.8, cut: 1500, v: s % 4 === 0 ? 0.55 : 0.4 });
        if (sec.bass === 'long') [0, 8].forEach((s, j) => add({ ...B, t: tb + s * ROW, i: 'sub', n: root + j * 7, dur: BAR / 2 * 0.95, v: 0.4 }));
        // ---- arpeggio chord (the classic 0xy chord) ----
        if (sec.arp) [0, 8].forEach(s => add({ t: tb + s * ROW, i: 'chip', w: W_ARP, n: ch[0] + 12, arp: ch.map(x => x - ch[0]), dur: BAR / 2 - 0.02,
          dec: 0.3, sus: 0.5, v: chip ? 0.2 : 0.13, pan: P.arp, chip, rv: chip ? 0.03 : 0.25, dl: chip ? 0 : 0.25, duck: modern }));
        // ---- pad ----
        if (sec.pad) ch.forEach((n, j) => add({ t: tb, i: 'super', n, dur: BAR, att: 0.35, rel: 0.8, cut: 1600, v: 0.085, pan: j % 2 ? 0.45 : -0.45, rv: 0.45, duck: true }));
        // ---- 16th sequencer lines ----
        if (sec.seq) for (let s = 0; s < 16; s++) {
          const n = ext(ch)[SEQ[s]] + 12, t = tb + s * ROW;
          if (sec.seq === 'chip') add({ t, i: 'chip', w: W_ARP, n, dur: ROW * 0.8, dec: 0.08, sus: 0.2, v: 0.15, pan: s % 2 ? 0.5 : -0.5, rv: 0.2, dl: 0.3, duck: true });
          if (sec.seq === 'super') add({ t, i: 'super', n, dur: ROW * 0.7, att: 0.003, rel: 0.08, cut: 1500 + 3000 * (bar + s / 16) / 4, v: 0.1, pan: s % 2 ? 0.4 : -0.4, dl: 0.3, rv: 0.2, duck: true });
          if (sec.seq === 'bell' && s % 2 === 0) add({ t, i: 'bell', n: n + 12, dur: 0.1, v: 0.08, pan: s % 4 ? 0.6 : -0.6, rv: 0.5, dl: 0.35 });
        }
        if (sec.bell) for (let s = 0; s < 8; s++) add({ t: tb + s * ROW * 2, i: 'bell', n: ext(ch)[s % 7] + 12, dur: 0.1, v: 0.09, pan: Math.sin(s * 2.1) * 0.7, rv: 0.55, dl: 0.35 });
      }
      // ---- lead melody ----
      if (sec.mel) {
        let prev = null;
        parseMel(MEL[sec.mel]).forEach(m => {
          const e = { t: T0 + m.step * ROW, n: m.n + (sec.oct || 0), dur: m.len * ROW * 0.95, sync: 'lead' };
          const legato = prev && prev.step + prev.len === m.step;
          const L = sec.lead || 'chip';
          if (L === 'chip') add({ ...e, i: 'chip', w: W_LEAD, vib: 0.12, dec: 0.5, sus: 0.7, v: 0.26, pan: P.lead, chip: 1 });
          if (L === 'saw') add({ ...e, i: 'saw', vib: 0.15, from: legato ? prev.n + (sec.oct || 0) : undefined, v: 0.3, pan: P.lead, rv: 0.3, dl: 0.22 });
          if (L === 'flute') add({ ...e, i: 'flute', vib: 0.18, v: 0.3, rv: 0.5, dl: 0.3 });
          if (L === 'super') {
            add({ ...e, i: 'super', vib: 0.12, from: legato ? prev.n + 12 : undefined, cut: 5200, rel: 0.3, v: 0.16, rv: 0.35, dl: 0.25 });
            add({ ...e, sync: 'x', i: 'saw', n: e.n - 12, vib: 0.12, v: 0.16, pan: -0.2, rv: 0.3 });
          }
          prev = m;
        });
      }
    });
    ev.sort((a, b) => a.t - b.t);
    return { ev, kicks };
  }

  // ------------------------------ renderer ------------------------------
  // Shared by both disks. renderGen() is a generator that yields whenever its time
  // slice is used up, so a song can be rendered behind a loader or in the background.
  function renderEv(e, B, duck, N) {
    const inst = I[e.i], v = { ph: 0, ph2: 0, ph3: 0, lo: 0, bp: 0 };
    if (inst.init) inst.init(v, e);
    const s0 = Math.round(e.t * SR), len = Math.min(N - s0, Math.ceil((e.dur + (e.rel ?? inst.rel)) * SR));
    const pan = e.pan || 0, gl = Math.sqrt(0.5 * (1 - pan)), gr = Math.sqrt(0.5 * (1 + pan));
    const vol = e.v ?? 1, rv = e.rv || 0, dl = e.dl || 0, chip = e.chip, bus = e.bus && B.GT;
    const { L, R, RV, DL } = B;
    let held = 0;
    for (let i = 0; i < len; i++) {
      let s = inst.tick(v, i / SR, e);
      if (chip) { if (i % 3 === 0) held = Math.round(s * 127) / 127; s = held; } // Paula: 8-bit, ~14.7 kHz S&H
      const j = s0 + i;
      s *= e.duck ? vol * duck[j >> 7] : vol;
      if (bus) { bus[j] += s; continue; }
      L[j] += s * gl; R[j] += s * gr;
      if (rv) RV[j] += s * rv;
      if (dl) DL[j] += s * dl;
    }
  }

  function makeReverb(size = 1) {
    const C = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(d => Math.round(d * size)), A = [556, 441, 341, 225];
    const mk = sp => ({ c: C.map(d => ({ b: new Float32Array(d + sp), i: 0, f: 0 })), a: A.map(d => ({ b: new Float32Array(d + sp), i: 0 })) });
    const ch = [mk(0), mk(23)], fb = size > 1 ? 0.88 : 0.86;
    return (inp, outs, from, to) => {
      for (let k = 0; k < 2; k++) {
        const { c, a } = ch[k], o = outs[k];
        for (let j = from; j < to; j++) {
          const x = inp[j] * 0.015; let y = 0;
          for (let m = 0; m < 8; m++) { const cb = c[m], out = cb.b[cb.i]; cb.f = out * 0.75 + cb.f * 0.25; cb.b[cb.i] = x + cb.f * fb; if (++cb.i >= cb.b.length) cb.i = 0; y += out; }
          for (let m = 0; m < 4; m++) { const ap = a[m], bo = ap.b[ap.i]; ap.b[ap.i] = y + bo * 0.5; if (++ap.i >= ap.b.length) ap.i = 0; y = bo - y; }
          o[j] += y * 1.3;
        }
      }
    };
  }
  function makeDelay(sec = ROW * 3) {
    const D = Math.round(sec * SR), bl = new Float32Array(D), br = new Float32Array(D); let idx = 0, lpL = 0, lpR = 0;
    return (inp, L, R, from, to) => {
      for (let j = from; j < to; j++) {
        const dL = bl[idx], dR = br[idx];
        lpL += (dR - lpL) * 0.5; lpR += (dL - lpR) * 0.5;
        bl[idx] = inp[j] + lpL * 0.45; br[idx] = lpR * 0.9;
        if (++idx >= D) idx = 0;
        L[j] += dL * 0.8; R[j] += dR * 0.8;
      }
    };
  }
  function bq(type, f0, Q, db) {                       // RBJ biquad coefficients
    const A = Math.pow(10, db / 40), w = TAU * f0 / SR, cs = Math.cos(w), sn = Math.sin(w), al = sn / (2 * Q);
    let b0, b1, b2, a0, a1, a2;
    if (type === 'peak') { b0 = 1 + al * A; b1 = -2 * cs; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * cs; a2 = 1 - al / A; }
    else if (type === 'hshelf') {
      const sq = 2 * Math.sqrt(A) * al;
      b0 = A * ((A + 1) + (A - 1) * cs + sq); b1 = -2 * A * ((A - 1) + (A + 1) * cs); b2 = A * ((A + 1) + (A - 1) * cs - sq);
      a0 = (A + 1) - (A - 1) * cs + sq; a1 = 2 * ((A - 1) - (A + 1) * cs); a2 = (A + 1) - (A - 1) * cs - sq;
    } else { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = (1 + cs) / 2; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
    return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
  }

  const slice = { end: Infinity };
  const busy = () => performance.now() > slice.end;
  // Guitar bus: nylon-guitar body resonances, a little stereo width, reverb send.
  function* guitarBus(B, N, o) {
    const F = [bq('hp', 70, 0.7, 0), bq('peak', 102, 1.4, 5), bq('peak', 210, 2.2, 3), bq('peak', 2900, 0.9, 2.5), bq('hshelf', 6500, 0.7, -6)];
    const S = F.map(() => new Float64Array(4)), G = B.GT;
    const d1 = Math.round(0.0113 * SR), d2 = Math.round(0.0171 * SR), w = o.width ?? 0.3, rv = o.rev ?? 0.3;
    for (let j = 0; j < N; j++) {
      let x = G[j];
      for (let k = 0; k < 5; k++) { const c = F[k], s = S[k], y = c[0] * x + c[1] * s[0] + c[2] * s[1] - c[3] * s[2] - c[4] * s[3]; s[1] = s[0]; s[0] = x; s[3] = s[2]; s[2] = y; x = y; }
      G[j] = x;
      B.L[j] += x + w * (j >= d1 ? G[j - d1] : 0);
      B.R[j] += x + w * (j >= d2 ? G[j - d2] : 0);
      B.RV[j] += x * rv;
      if ((j & 8191) === 0 && busy()) yield { p: 0.72, msg: 'TUNING SIX STRINGS' };
    }
  }
  function* renderGen(ev, kicks, LEN, o = {}) {
    const N = Math.ceil(LEN * SR), duck = new Float32Array((N >> 7) + 2).fill(1);
    kicks.forEach(t => {
      const k0 = Math.floor(t * SR / 128);
      for (let k = k0; k < k0 + 0.4 * SR / 128 && k < duck.length; k++) {
        const dt = k * 128 / SR - t; const g = 1 - (o.duck ?? 0.55) * Math.min(1, Math.max(0, dt) * 150) * Math.exp(-Math.max(0, dt) * 8);
        if (g < duck[k]) duck[k] = g;
      }
    });
    const B = { L: new Float32Array(N), R: new Float32Array(N), RV: new Float32Array(N), DL: new Float32Array(N), GT: o.gtr ? new Float32Array(N) : null };
    const msg = o.msg || 'DEPACKING SOUNDTRACK';
    for (let i = 0; i < ev.length; i++) { renderEv(ev[i], B, duck, N); if (busy()) yield { p: 0.7 * i / ev.length, msg }; }
    if (B.GT) { yield* guitarBus(B, N, o.gtr); B.GT = null; }
    const rev = makeReverb(o.room || 1), dly = makeDelay(o.delay), BLK = 1 << 13;
    for (let j = 0; j < N; j += BLK) {
      const e = Math.min(N, j + BLK); dly(B.DL, B.L, B.R, j, e); rev(B.RV, [B.L, B.R], j, e);
      if (busy()) yield { p: 0.75 + 0.2 * j / N, msg: 'MIXING THROUGH PAULA' };
    }
    B.RV = B.DL = null;
    let peak = 0;
    for (let j = 0; j < N; j++) {
      const a = Math.abs(B.L[j]), b = Math.abs(B.R[j]); if (a > peak) peak = a; if (b > peak) peak = b;
      if ((j & 65535) === 0 && busy()) yield { p: 0.95, msg: 'MASTERING' };
    }
    const g = (o.gain || 1.3) / (peak || 1), fade = o.fade ?? 3.5, fadeFrom = (LEN - fade) * SR, { L, R } = B;
    for (let j = 0; j < N; j++) {
      const f = j > fadeFrom ? Math.max(0, 1 - (j - fadeFrom) / (fade * SR)) : 1;
      L[j] = Math.tanh(L[j] * g) * 0.92 * f; R[j] = Math.tanh(R[j] * g) * 0.92 * f;
      if ((j & 65535) === 0 && busy()) yield { p: 0.97, msg: 'MASTERING' };
    }
    return { L, R, SR, N };
  }
  const step = (gen, ms) => { slice.end = performance.now() + ms; const r = gen.next(); slice.end = Infinity; return r; };
  const tick = () => new Promise(r => setTimeout(r, 0));
  async function drive(gen, progress) {
    for (;;) { const r = step(gen, 35); if (r.done) return r.value; progress(r.value.p, r.value.msg); await tick(); }
  }
  let built = null;
  const prepare = () => { if (!built) { built = build(); for (const k in SYNC) SYNC[k].sort((a, b) => a - b); } return built; };
  async function render(progress) {
    const { ev, kicks } = prepare();
    const out = await drive(renderGen(ev, kicks, LEN), progress);
    progress(1, 'READY');
    return out;
  }

  // ---- sync helpers: time since last event of a type, exponential envelope ----
  const lastIdx = (arr, t) => { let lo = 0, hi = arr.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (arr[m] <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r; };
  const makeSync = S => ({
    since: (type, t) => { const a = S[type] || [], i = lastIdx(a, t); return i < 0 ? 1e3 : t - a[i]; },
    env(type, t, rate) { return Math.exp(-this.since(type, t) * rate); },
    count: (type, t) => lastIdx(S[type] || [], t) + 1,
  });
  const S1 = makeSync(SYNC);

  return { SR, BPM, ROW, BAR, PAT, NPAT, LEN, render, prepare, SYNC, since: S1.since, env: (ty, t, r) => S1.env(ty, t, r), count: S1.count,
    engine: { SR, TAU, mtof, rnd, I, W: { LEAD: W_LEAD, ARP: W_ARP, BASS: W_BASS }, renderGen, step, drive, makeSync, lastIdx } };
})();
