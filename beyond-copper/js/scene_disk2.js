'use strict';
// =====================================================================
//  DISK 2, parts 0+1: "PLEASE INSERT DISK 2" and a 4-channel tracker
//  playing the opening of Asturias on Paula (8-bit, 50 Hz, CRT).
//  Drawn with PIX (320x256, 12-bit, 8x8 font). The tracker screen is
//  exported as window.TRACKER so the finale can show it on the machine.
// =====================================================================
(() => {
  const P = PIX, W = P.W, H = P.H, X = P.hex;
  const BLACK = X(0x000), WHITE = X(0xFFF), BLUE = X(0x05A), ORANGE = X(0xF80), GREY = X(0xAAA), DGREY = X(0x555), LGREY = X(0xCCC);
  const panel = (x, y, w, h, fill = GREY) => P.bevel(x, y, w, h, fill, WHITE, X(0x333));
  const well = (x, y, w, h, fill = BLACK) => P.bevel(x, y, w, h, fill, X(0x333), WHITE);

  // ----------------------- PART D2-0: DISK CHANGE -----------------------
  function floppy(x, y) { // label readable; shutter leads into the slot below
    const body = X(0x23A), dark = X(0x126);
    P.bevel(x, y, 64, 66, body, X(0x56D), dark);
    P.rect(x + 60, y + 62, 4, 4, BLUE);
    P.rect(x + 5, y + 4, 54, 33, X(0xEED));
    P.rect(x + 5, y + 4, 54, 5, ORANGE);
    P.text('DISK 2', x + 8, y + 13, dark);
    P.text('LEYENDA', x + 4, y + 25, X(0xC30));
    P.rect(x + 14, y + 43, 34, 22, X(0xBBC));
    P.rect(x + 14, y + 43, 34, 1, X(0xEEE));
    P.rect(x + 34, y + 46, 8, 16, body);
    P.rect(x + 3, y + 4, 3, 4, dark);
  }
  function rasters(k, label, pct) {                             // decrunch flicker, shared look with Disk 1
    let y = 0;
    while (y < H) { const h = 1 + (Math.random() * 6 | 0), col = P.c12(Math.random(), Math.random(), Math.random()); for (let j = 0; j < h && y < H; j++, y++) P.hline(y, col); }
    well(70, 108, 180, 40); P.centre(label, 116, WHITE); P.centre(String(Math.min(100, Math.floor(pct * 100))).padStart(3, ' ') + '%', 132, ORANGE);
  }
  function drawDisk(st) {
    const t = Math.floor(st.lt * 50) / 50, wait = st.wait;
    if (t > 6.3 && wait === undefined) { P.clear(BLACK); P.upload(); return P.crt(); }
    if (t < 4.6 || wait !== undefined) {
      P.clear(BLUE);
      P.rect(0, 0, W, 11, WHITE); P.text('NEON BLITTER : BEYOND THE COPPER', 4, 2, BLUE);
      P.rect(W - 26, 1, 10, 9, BLUE); P.rect(W - 24, 3, 6, 5, WHITE); P.rect(W - 13, 1, 10, 9, BLUE); P.rect(W - 11, 3, 6, 2, WHITE);   // depth gadgets
      P.centre('END OF SIDE ONE', 28, WHITE); P.centre('PLEASE INSERT DISK 2 IN DRIVE DF0:', 42, ORANGE);
      const drive = () => { panel(88, 200, 144, 26, LGREY); well(100, 208, 112, 6); P.rect(102, 210, 108, 2, X(0x222)); P.rect(216, 216, 9, 5, DGREY); };
      drive();
      const ins = wait !== undefined ? 0 : Math.min(1, Math.max(0, (t - 0.9) / 1.1));
      floppy(128, 74 + Math.round(ins * ins * 134));
      P.rect(0, 209, W, H - 209, BLUE); drive(); P.rect(88, 209, 144, 17, LGREY); P.rect(88, 225, 144, 1, X(0x333)); P.rect(231, 209, 1, 17, X(0x333)); P.rect(88, 209, 1, 17, WHITE);
      well(100, 208, 112, 6); P.rect(102, 210, 108, 2, ins > 0.5 ? X(0x23A) : X(0x222)); P.rect(216, 216, 9, 5, DGREY);                 // the drive swallows the disk
      const led = wait === undefined && t > 2 && (t * 8 | 0) % 2; P.rect(94, 216, 8, 3, led ? X(0xF22) : X(0x400));
      if (wait !== undefined) {
        P.centre('READING DISK 2 ... ' + String(Math.floor(wait * 100)).padStart(3, ' ') + '%', 232, WHITE);
        well(60, 243, 200, 8); P.rect(61, 244, Math.round(198 * wait), 6, ORANGE);
      } else if (t > 2.3) P.centre('DF0: TRACK ' + String(Math.min(79, Math.floor((t - 2.3) * 34))).padStart(2, '0'), 236, WHITE);
    } else rasters(0, 'DECRUNCHING LEYENDA', (t - 4.6) / 1.7);
    P.upload();
    return P.crt({ off: wait !== undefined ? 0 : Math.max(0, 1 - st.lt / 0.6) * (st.lt < 0.6 ? 1 : 0), fade: 1 });
  }

  // --------------------- PART D2-1: PAULA'S TRACKER ---------------------
  const NOTE = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];
  const nn = n => NOTE[n % 12] + (Math.floor(n / 12) - 1);
  const RPB = 18;                                                 // rows per bar: one per triplet sixteenth
  let rows = [], rowT = [];                                       // rows[r] = 4 note strings, rowT[r][c] = note-on time
  function buildRows() {
    LEYENDA_TAB.forEach((bar, b) => {
      let tk = 0; const trip = bar.length === 18;
      bar.forEach(([ticks, , notes], k) => {
        const r = b * RPB + Math.min(RPB - 1, Math.floor(tk / 4)), R = rows[r] = rows[r] || ['', '', '', ''];
        const put = (c, n) => { if (!R[c]) R[c] = nn(n); };
        if (notes.length >= 3) notes.slice(0, 4).forEach((n, i) => put(i, n));
        else if (notes.length) { put(trip ? k % 3 : 0, notes[0]); if (notes.length > 1) put(3, notes[1]); }
        tk += ticks;
      });
    });
  }
  const chanAmp = (d2, c) => {                                    // loudness of a channel = decay since its last note row
    const bar = LEY.barAt(d2), b0 = LEY.barT[bar], bl = (LEY.barT[bar + 1] ?? b0 + 1.4) - b0, rNow = bar * RPB + Math.min(RPB - 1, Math.floor((d2 - b0) / bl * RPB));
    for (let r = rNow; r > rNow - RPB && r >= 0; r--) if (rows[r] && rows[r][c]) {
      const rb = Math.floor(r / RPB), t = LEY.barT[rb] + ((LEY.barT[rb + 1] ?? LEY.barT[rb] + 1.4) - LEY.barT[rb]) * (r % RPB) / RPB;
      return Math.exp(-Math.max(0, d2 - t) * (c === 0 ? 5 : 9));
    }
    return 0;
  };
  function scope(x, y, w, h, amp, c, t) {
    well(x, y, w, h);
    const f = [3, 5, 5, 2][c], mid = y + (h >> 1);
    for (let i = 1; i < w - 1; i++) {
      const ph = i / w * f + t * (4 + c), v = Math.sin(ph * 6.283) * 0.7 + Math.sin(ph * 12.566 + c) * 0.3;
      P.pset(x + i, mid + Math.round(v * amp * (h / 2 - 2)), X(0x4F6));
    }
  }
  // Draw the tracker for Disk 2 time d2 (seconds since Disk 2 started). Does not upload.
  function tracker(d2, o = {}) {
    if (!rows.length) buildRows();
    const t = Math.floor(d2 * 50) / 50, bar = Math.min(LEY.NB - 1, LEY.barAt(d2)), b0 = LEY.barT[bar], bl = LEY.barT[bar + 1] - b0;
    const inBar = Math.min(0.9999, Math.max(0, (d2 - b0) / bl)), row = bar * RPB + Math.floor(inBar * RPB);
    P.clear(DGREY);
    panel(0, 0, W, 66);
    P.rect(0, 0, W, 10, X(0x26B)); P.text('NEONTRACKER 2.6', 4, 1, WHITE); P.text('(' + (o.chip === false ? 'HI-FI' : 'PAULA') + ')', 132, 1, X(0xFD6)); P.text('CHIP 478K', 244, 1, X(0xBDF));
    const field = (x, y, w, label, val) => { panel(x, y, w, 11); P.text(label, x + 3, y + 2, BLACK); P.text(val, x + w - 3 - val.length * 8, y + 2, X(0x127)); };
    field(2, 12, 92, 'POS', String(bar).padStart(4, '0')); field(2, 24, 92, 'PATT', String(bar % 64).padStart(4, '0'));
    field(2, 36, 92, 'BPM', String(Math.round(LEY.bpm(bar))).padStart(4, ' ')); field(2, 48, 92, 'ROW', String(row % RPB).padStart(4, '0'));
    panel(96, 12, 222, 11); P.text('SONG: ASTURIAS (LEYENDA)', 99, 14, BLACK);
    panel(96, 24, 222, 11); P.text('SMPL: 01 NYLONGTR.8SVX', 99, 26, BLACK);
    for (let c = 0; c < 4; c++) scope(96 + c * 56, 36, 54, 28, Math.min(1, chanAmp(d2, c)), c, t);
    well(0, 66, W, H - 66);
    const y0 = 70, rh = 9, vis = Math.floor((H - y0 - 4) / rh), mid = vis >> 1;
    P.rect(1, y0 + mid * rh - 1, W - 2, rh + 1, X(0x227)); P.rect(1, y0 + mid * rh - 1, W - 2, 1, X(0x55B)); P.rect(1, y0 + mid * rh + rh - 1, W - 2, 1, X(0x114));
    for (let c = 0; c < 4; c++) P.rect(25 + c * 74, 67, 1, H - 68, X(0x223));
    for (let i = 0; i < vis; i++) {
      const r = row + i - mid, y = y0 + i * rh; if (r < 0 || r >= LEY.NB * RPB) continue;
      const cur = i === mid, beat = r % 6 === 0;
      P.text((r % RPB).toString().padStart(2, '0'), 5, y, cur ? WHITE : beat ? X(0xBB8) : X(0x666));
      const R = rows[r] || ['', '', '', ''];
      for (let c = 0; c < 4; c++) {
        if (R[c]) { P.text(R[c], 28 + c * 74, y, cur ? X(0xFF8) : X(0x8CF)); P.text('01', 56 + c * 74, y, cur ? WHITE : X(0x69B)); P.text(c === 0 && r % RPB === 0 ? 'C40' : '000', 74 + c * 74, y, cur ? X(0xFB4) : X(0x446)); }
        else P.text('---', 28 + c * 74, y, cur ? X(0x88A) : X(0x334));
      }
    }
    for (let c = 0; c < 4; c++) {                                 // VU meters grow out of the bottom border
      const h = Math.round(chanAmp(d2, c) * 44);
      for (let j = 0; j < h; j++) P.rect(84 + c * 74, H - 4 - j, 10, 1, j > 34 ? X(0xF42) : j > 24 ? X(0xFC2) : X(0x4D4));
    }
    return { bar, row };
  }
  function drawTracker(st) {
    const d2 = st.t - LEY.AT, end = LEY.barT[8] - d2, pk = LEY.env('pluck', d2, 12);
    tracker(d2);
    if (end < 0.6) for (let i = 0; i < (0.6 - end) * 60; i++) { const y = Math.random() * H | 0; P.px.copyWithin(y * W + 6, y * W, y * W + W - 6); }
    P.upload();
    return P.crt({ aberr: 0.2 + Math.max(0, 0.6 - end) * 2, bloom: 0.32 + pk * 0.12, fade: Math.min(1, st.lt * 4) });
  }
  window.TRACKER = { draw: tracker, rasters };

  const D2 = () => LEY.AT;
  (window.SCENES = window.SCENES || []).push(
    { name: 'Disk Change', disk: 2, init: buildRows, range: () => [D2(), D2() + LEY.T0], draw: drawDisk },
    { name: 'Paula Tracker', disk: 2, range: () => [D2() + LEY.sec('tracker')[0], D2() + LEY.sec('tracker')[1]], draw: drawTracker },
  );
})();
