'use strict';
// =====================================================================
//  DISK 2 SOUNDTRACK: Isaac Albéniz, "Asturias (Leyenda)" (public domain)
//  Arranged from the guitar tab in js/leyenda_tab.js. Fixes over the
//  original amiga_gemini playback:
//   - exact 24-ticks-per-beat timing (no 0.1667 drift), every bar 3 beats
//   - opening ostinato restored to p-i-m triplets (melody + two pedal B's)
//   - drums written for 3/4, not a 4/4 grid drifting against the bar
//   - a tempo map: driving A section, a slow singing copla, ritardando coda
//   - Karplus-Strong nylon guitar, each string rings until it is re-plucked
//  Bars 0-7 are played "on Paula" (8-bit, hard left); bar 8 goes hi-fi.
// =====================================================================
const LEY = (() => {
  const { rnd, W, renderGen, makeSync } = MUSIC.engine;
  const TAB = LEYENDA_TAB, TPB = 24, NB = TAB.length, T0 = 6.5;   // T0: disk-change interlude before bar 0
  const bpm = b => b < 60 ? 132 : b === 60 ? 104 : b === 61 ? 92 : b < 92 ? (b === 77 ? 80 : 96) : b < 94 ? 100 : b < 114 ? 108
    : b < 129 ? 84 - Math.max(0, b - 123) * 3.5 : b < 131 ? 100 : b < 133 ? 100 - (b - 130) * 10 : 60;
  const barT = [T0]; for (let b = 0; b < NB; b++) barT.push(barT[b] + 180 / bpm(b));
  const LEN = barT[NB] + 5, beat = b => 60 / bpm(b), at = (b, tick) => barT[b] + tick / TPB * beat(b);
  const SEC = { tracker: [0, 8], run: [8, 24], shmup: [24, 48], race: [48, 62], copla: [62, 94], pinball: [94, 114], dawn: [114, 129], finale: [129, NB] };
  const dyn = b => b < 8 ? 0.9 : b < 16 ? 0.45 + 0.25 * (b - 8) / 8 : b < 24 ? 0.75 : b < 48 ? 0.85 : b < 52 ? 0.5 : b < 60 ? 0.6 + 0.4 * (b - 52) / 8
    : b < 62 ? 1 : b < 94 ? 0.95 : b < 114 ? 0.8 : b < 129 ? 0.85 : 0.6;

  const SYNC = { kick: [], snare: [], hat: [], crash: [], chord: [], pluck: [], melody: [], bass: [] };
  const ev = [], kicks = [], plucks = [], melody = [], chords = [];
  const add = o => { ev.push(o); const s = SYNC[o.sync || o.i]; if (s) s.push(o.t); if (o.i === 'kick') kicks.push(o.t); return o; };
  const bars = (a, z, fn) => { for (let b = a; b < Math.min(z, NB); b++) fn(b, barT[b], beat(b)); };

  // ------------------------------ guitar ------------------------------
  const chordAt = []; let lastChord = [52, 59, 64, 67];          // E minor until the first written chord
  TAB.forEach((bar, b) => {
    let tk = 0; const chip = b < 8, trip = bar.length === 18;
    chordAt[b] = lastChord;
    bar.forEach(([ticks, flag, notes, strs], k) => {
      const t = at(b, tk), dur = ticks / TPB * beat(b), nn = notes.length;
      if (nn >= 3) { lastChord = notes; if (tk < TPB) chordAt[b] = notes; if (flag === 1) { chords.push(t); SYNC.chord.push(t); } }
      const pedal = trip && k % 3 !== 0 && nn === 1;
      if (nn && !pedal && nn <= 2) { melody.push({ t, n: Math.max(...notes), d: dur }); SYNC.melody.push(t); }
      const v = dyn(b) * (pedal ? 0.6 : 1) * (flag === 1 ? 1.2 : flag === 2 ? 0.8 : 1) / Math.pow(Math.max(1, nn), 0.35);
      notes.forEach((n, i) => plucks.push({ t: t + (nn >= 3 ? (flag === 1 ? 0.011 : 0.02) * (nn - 1 - i) : 0), n, s: strs[i] ?? 2, v,
        br: flag === 1 ? 0.8 : pedal ? 0.42 : 0.58, chip, b }));
      if (flag === 1 && nn >= 5 && b < 62)                     // rasgueado: two finger flicks rolling into the accent
        for (const back of [0.07, 0.035]) notes.forEach((n, i) => plucks.push({ t: t - back + 0.006 * (nn - 1 - i), n, s: strs[i] ?? 2, v: v * 0.45, br: 0.7, chip, b }));
      tk += ticks;
    });
  });
  plucks.sort((a, b) => a.t - b.t);
  const lastOn = [], byString = [[], [], [], [], [], []];
  plucks.forEach(p => { const q = lastOn[p.s]; if (q) q.end = p.t; lastOn[p.s] = p; byString[p.s].push(p); });
  plucks.forEach(p => {
    p.end = Math.min(p.end || p.t + 6, p.t + 6);
    const dur = Math.max(0.02, p.end - p.t);
    add(p.chip ? { t: p.t, i: 'guitar', n: p.n, dur, v: p.v * 1.1, br: p.br, chip: 1, pan: -0.75, sync: 'pluck' }
      : { t: p.t, i: 'guitar', n: p.n, dur, v: p.v, br: p.br, bus: 'gtr', sync: 'pluck' });
  });

  // ------------------------- harmony: pad, choir -------------------------
  const pcs = c => [...new Set(c.map(n => n % 12))].sort((x, y) => x - y);
  const voice = c => pcs(c).map(pc => 55 + ((pc - 55) % 12 + 12) % 12).sort((x, y) => x - y).slice(0, 4);
  function padRun(a, z, o) {
    let s = a;
    for (let b = a + 1; b <= z; b++) {
      if (b < z && pcs(chordAt[b]).join() === pcs(chordAt[s]).join() && b - s < 8) continue;
      const t = barT[s], dur = barT[b] - t;
      voice(chordAt[s]).forEach((n, j) => {
        if (o.pad) add({ t, i: 'super', n, dur, att: 0.6, rel: 1.4, cut: o.cut || 1500, v: o.pad, pan: j % 2 ? 0.5 : -0.5, rv: 0.55, duck: o.duck });
        if (o.choir) add({ t, i: 'choir', n, dur, att: 0.9, v: o.choir, pan: (j - 1.5) * 0.4, rv: 0.65 });
      });
      s = b;
    }
  }
  padRun(8, 24, { pad: 0.03, cut: 1100 }); padRun(24, 48, { pad: 0.035, duck: true }); padRun(48, 52, { pad: 0.025, cut: 900 });
  padRun(52, 62, { pad: 0.04, cut: 2200, duck: true }); padRun(62, 94, { pad: 0.04, choir: 0.065 }); padRun(94, 114, { pad: 0.035 });
  padRun(114, NB, { pad: 0.035, choir: 0.06 });

  // ------------------------------- bass -------------------------------
  const low = b => { let m = 99; TAB[b].slice(0, 3).forEach(e => e[2].forEach(n => { m = Math.min(m, n); })); return m; };
  function bassRun(a, z, o) {
    bars(a, z, (b, t, bt) => {
      let n = low(b); if (n > 90) return; while (n > 47) n -= 12; if (n < 28) n += 12;
      add({ t, i: 'sub', n, dur: bt * 3 * 0.96, v: o.v, duck: o.duck, sync: 'bass' });
      if (o.drive) [0, 3].forEach(e8 => add({ t: t + e8 * bt / 2, i: 'mbass', n: n + 12 * (e8 ? 2 : 1), dur: bt * 0.45, cut: 1400, v: o.drive, duck: true }));
    });
  }
  bassRun(8, 16, { v: 0.16 }); bassRun(16, 36, { v: 0.32, duck: true }); bassRun(36, 48, { v: 0.32, duck: true, drive: 0.22 });
  add({ t: barT[48], i: 'sub', n: 35, dur: barT[52] - barT[48], v: 0.25 });
  bassRun(52, 61, { v: 0.36, duck: true }); bassRun(94, 114, { v: 0.26 }); bassRun(114, 129, { v: 0.3 });

  // ------------------------------- drums -------------------------------
  const D = (i, t, v, o = {}) => add({ t, i, dur: i === 'crash' ? 3 : i === 'kick' ? 0.6 : 0.4, v, ...o });
  const hit = (b, big) => { const t = barT[b]; D('crash', t, big ? 0.45 : 0.28, { rv: 0.35 }); if (big) { add({ t, i: 'impact', dur: 3, v: 0.7 }); add({ t, i: 'timp', n: 40, dur: 2.5, v: 0.6, rv: 0.3 }); } };
  bars(16, 24, (b, t, bt) => {                                  // soft entry: kick, brushed snare on 3, shaker eighths
    D('kick', t, 0.55); D('snare', t + 2 * bt, 0.16, { rv: 0.25 });
    for (let e = 0; e < 6; e++) add({ t: t + e * bt / 2, i: 'shaker', dur: 0.12, v: e % 2 ? 0.07 : 0.11, pan: 0.35, sync: 'hat' });
  });
  add({ t: barT[22], i: 'riser', dur: barT[24] - barT[22], v: 0.18, rv: 0.3 });
  bars(24, 48, (b, t, bt) => {                                  // 3/4 groove: K . S K S (K)
    const full = b >= 36, h = bt / 2, u = bt / 6;
    D('kick', t, 1); D('kick', t + 3 * h, 0.8); if (full) D('kick', t + 5 * h, 0.5);
    D('snare', t + 2 * h, 0.55, { rv: 0.25 }); D('snare', t + 4 * h, 0.62, { rv: 0.25 });
    for (let e = 0; e < 6; e++) D('hat', t + e * h, e % 2 ? 0.16 : 0.1, full && e % 2 ? { pan: 0.3, open: 1, dur: 0.3 } : { pan: 0.3 });
    if (full) for (let k = 0; k < 18; k++) add({ t: t + k * u, i: 'shaker', dur: 0.1, v: 0.045, pan: -0.4, sync: 'hat' });
    if (TAB[b][0][1] === 1) [14, 15, 16, 17].forEach((k, j) => add({ t: t + k * u, i: 'castanet', dur: 0.06, v: 0.12 + j * 0.05, pan: -0.45, rv: 0.2 }));
    if (b % 4 === 3) for (let k = 12; k < 18; k++) D('snare', t + k * u, 0.25 + (k - 12) * 0.07, { rv: 0.2 });
  });
  hit(24, true); hit(36, true); [28, 32, 40, 44].forEach(b => hit(b, false));
  add({ t: barT[48], i: 'timp', n: 47, dur: 2.5, v: 0.45, rv: 0.4 });
  bars(52, 60, (b, t, bt) => {                                  // build: kick on every beat, snare roll tightening
    const k = (b - 52) / 8;
    for (let q = 0; q < 3; q++) D('kick', t + q * bt, 0.6 + 0.4 * k);
    const div = b < 56 ? 0 : b < 58 ? 2 : 6;
    if (div) for (let q = 0; q < 3 * div; q++) D('snare', t + q * bt / div, 0.15 + 0.5 * (b - 56 + q / (3 * div)) / 4, { rv: 0.2 });
  });
  hit(52, false); add({ t: barT[56], i: 'riser', dur: barT[60] - barT[56], v: 0.3, rv: 0.3 });
  hit(60, true); D('kick', barT[60], 1);
  [59, 63, 66, 71].forEach((n, j) => add({ t: barT[60], i: 'choir', n, dur: barT[62] - barT[60], att: 0.15, v: 0.08, pan: (j - 1.5) * 0.4, rv: 0.7 }));
  bars(94, 114, (b, t, bt) => {                                 // dance: soft kick, shaker, castanets on accents
    D('kick', t, 0.45);
    for (let e = 0; e < 6; e++) add({ t: t + e * bt / 2, i: 'shaker', dur: 0.1, v: e % 2 ? 0.05 : 0.08, pan: 0.4, sync: 'hat' });
  });
  chords.forEach(t => {
    const b = barT.findIndex(x => x > t) - 1;
    if (b >= 94 && b < 114) [0, 0.09].forEach((o, j) => add({ t: t + o, i: 'castanet', dur: 0.06, v: 0.2 - j * 0.06, pan: -0.45, rv: 0.25 }));
    if (b >= 114 && b < 129) add({ t, i: 'timp', n: 40, dur: 2.5, v: 0.35, rv: 0.4 });
  });
  hit(94, false); hit(114, false);
  hit(133, true); [52, 55, 59, 64].forEach((n, j) => add({ t: barT[133], i: 'choir', n, dur: 7, att: 0.3, v: 0.08, pan: (j - 1.5) * 0.4, rv: 0.75 }));

  // ------------------------ violin doubling the copla ------------------------
  let prevV = null;
  melody.forEach(m => {
    const b = barT.findIndex(x => x > m.t) - 1;
    if (!((b >= 62 && b < 92) || (b >= 114 && b < 129)) || m.n < 62) { prevV = null; return; }
    const legato = prevV && Math.abs(prevV.t + prevV.d - m.t) < 0.03 && Math.abs(prevV.n - m.n) <= 5;
    add({ t: m.t, i: 'bow', n: m.n, from: legato ? prevV.n : undefined, dur: m.d * 0.98, vib: 0.14, v: 0.1, pan: 0.3, rv: 0.55, dl: 0.12 });
    prevV = m;
  });

  // ---------------------- disk-change interlude sound ----------------------
  add({ t: 2.0, i: 'timp', n: 36, dur: 0.6, v: 0.22 }); add({ t: 2.0, i: 'click', dur: 0.08, v: 0.5 }); add({ t: 2.12, i: 'click', dur: 0.08, v: 0.4 });
  add({ t: 2.3, i: 'motor', dur: 3.6, v: 0.16 });
  [2.5, 2.9, 3.0, 3.1, 3.2, 3.3, 3.8, 3.85, 3.9, 3.95, 4.0, 4.4, 4.45, 4.5].forEach(t => add({ t, i: 'click', dur: 0.08, v: 0.32, pan: -0.2 }));
  for (let t = 4.6; t < T0 - 0.2; t += 0.03) {
    const n = [57, 60, 62, 64, 67, 69, 72, 76][(Math.abs(rnd()) * 8) | 0];
    add({ t, i: 'chip', w: W.ARP, n, dur: 0.024, dec: 0.02, sus: 0.3, v: 0.04 + 0.03 * (t - 4.6) / 1.7, pan: rnd() * 0.8, chip: 1 });
  }

  for (const k in SYNC) SYNC[k].sort((a, b) => a - b);
  ev.sort((a, b) => a.t - b.t);
  const S = makeSync(SYNC);
  const start = () => renderGen(ev, kicks, LEN, { gtr: { rev: 0.32, width: 0.28 }, room: 1.3, delay: 60 / 132 * 0.75, fade: 4, gain: 1.2, duck: 0.4, msg: 'READING DISK 2' });
  const barAt = t => { let lo = 0, hi = NB; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (barT[m] <= t) lo = m; else hi = m - 1; } return lo; };
  // Disk 2's audio starts 1.5 s before Disk 1's tail ends (AT is on the global timeline)
  return { AT: MUSIC.LEN - 1.5, T0, LEN, NB, barT, bpm, SEC, sec: k => [barT[SEC[k][0]], barT[Math.min(NB, SEC[k][1])]], barAt,
    plucks, byString, melody, chords, SYNC, since: S.since, env: (ty, t, r) => S.env(ty, t, r), count: S.count, start, events: ev.length };
})();
