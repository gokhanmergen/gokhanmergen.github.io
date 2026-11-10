'use strict';
// =====================================================================
//  PIX: the "1985 side" of the demo. A 320x256 software framebuffer with
//  a 12-bit (OCS) palette, a real 8x8 bitmap font, a Scale2x'ed 16x16
//  demo font with bevels, sprites from ASCII art, Bayer dithering, and
//  font/message textures so shaders can print in the same typeface.
//  Everything that should look like it came out of Denise goes through here.
// =====================================================================
const PIX = (() => {
  const W = 320, H = 256;
  const buf = new Uint8Array(W * H * 4), px = new Uint32Array(buf.buffer);
  let tex = null, atlasTex = null;
  const q = x => Math.round(Math.min(1, Math.max(0, x)) * 15) * 17;
  const c12 = (r, g, b) => (0xff000000 | (q(b) << 16) | (q(g) << 8) | q(r)) >>> 0;
  const hex = h => (0xff000000 | ((h & 15) * 17 << 16) | (((h >> 4) & 15) * 17 << 8) | ((h >> 8) & 15) * 17) >>> 0;   // 0xRGB
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];
  // ordered-dither between palette entries: pal is an array of colours, f in 0..1 runs through it
  const dith = (pal, f, x, y) => { const k = Math.min(0.9999, Math.max(0, f)) * (pal.length - 1), i = k | 0; return pal[k - i > bayer(x, y) ? i + 1 : i]; };
  const mix12 = (a, b, f) => {                                   // blend two packed colours, re-quantised to 12 bit
    const ch = s => ((a >> s) & 255) + (((b >> s) & 255) - ((a >> s) & 255)) * f;
    return c12(ch(0) / 255, ch(8) / 255, ch(16) / 255);
  };

  // ------------------------------ 8x8 font ------------------------------
  // Glyphs 32..95, one hex byte per row, bit 0 = leftmost pixel (the public-domain BIOS-style 8x8 set),
  // with the serifed capitals replaced by plain two-pixel stems, closer to what a Workbench screen looked like.
  const HEXF =
    '0000000000000000183c3c1818001800363600000000000036367f367f3636000c3e031e301f0c00006333180c6663001c361c6e3b336e000606030000000000' +
    '180c0606060c1800060c1818180c060000663cff3c660000000c0c3f0c0c000000000000000c0c060000003f0000000000000000000c0c006030180c06030100' +
    '3e63737b6f673e000c0e0c0c0c0c3f001e33301c06333f001e33301c30331e00383c36337f3078003f031f3030331e001c06031f33331e003f3330180c0c0c00' +
    '1e33331e33331e001e33333e30180e00000c0c00000c0c00000c0c00000c0c06180c0603060c180000003f00003f0000060c1830180c06001e3330180c000c00' +
    '3e637b7b7b031e000c1e33333f3333003f66663e66663f003c66030303663c001f36666666361f007f46161e16467f007f46161e16060f003c66030373667c00' +
    '3333333f333333001e0c0c0c0c0c1e007830303033331e006766361e366667000f06060646667f0063777f7f6b63630063676f7b736363001c36636363361c00' +
    '3f66663e06060f001e3333333b1e38003f66663e366667001e33070e38331e003f2d0c0c0c0c1e003333333333333f0033333333331e0c006363636b7f776300' +
    '6363361c1c3663003333331e0c0c1e007f6331184c667f001e06060606061e0003060c18306040001e18181818181e00081c36630000000000000000000000ff';
  const SANS = {
    B: ['XXXXX.', 'XX..XX', 'XX..XX', 'XXXXX.', 'XX..XX', 'XX..XX', 'XXXXX.'], D: ['XXXX..', 'XX.XX.', 'XX..XX', 'XX..XX', 'XX..XX', 'XX.XX.', 'XXXX..'],
    E: ['XXXXXX', 'XX....', 'XX....', 'XXXXX.', 'XX....', 'XX....', 'XXXXXX'], F: ['XXXXXX', 'XX....', 'XX....', 'XXXXX.', 'XX....', 'XX....', 'XX....'],
    C: ['.XXXX.', 'XX..XX', 'XX....', 'XX....', 'XX....', 'XX..XX', '.XXXX.'], G: ['.XXXX.', 'XX..XX', 'XX....', 'XX.XXX', 'XX..XX', 'XX..XX', '.XXXXX'],
    I: ['.XXXX.', '..XX..', '..XX..', '..XX..', '..XX..', '..XX..', '.XXXX.'], J: ['..XXXX', '...XX.', '...XX.', '...XX.', 'XX.XX.', 'XX.XX.', '.XXX..'],
    K: ['XX..XX', 'XX.XX.', 'XXXX..', 'XXX...', 'XXXX..', 'XX.XX.', 'XX..XX'], L: ['XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XXXXXX'],
    P: ['XXXXX.', 'XX..XX', 'XX..XX', 'XXXXX.', 'XX....', 'XX....', 'XX....'], R: ['XXXXX.', 'XX..XX', 'XX..XX', 'XXXXX.', 'XX.XX.', 'XX..XX', 'XX..XX'],
    T: ['XXXXXX', '..XX..', '..XX..', '..XX..', '..XX..', '..XX..', '..XX..'], Z: ['XXXXXX', '....XX', '...XX.', '..XX..', '.XX...', 'XX....', 'XXXXXX'],
    O: ['.XXXX.', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', '.XXXX.'], Q: ['.XXXX.', 'XX..XX', 'XX..XX', 'XX..XX', 'XX.XXX', 'XX..XX', '.XXXXX'],
    S: ['.XXXX.', 'XX..XX', 'XX....', '.XXXX.', '....XX', 'XX..XX', '.XXXX.'], U: ['XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', '.XXXX.'],
    // extra glyphs above 95: block cursor, heart, right arrow, up arrow, copyright-ish ring, full dot
    '`': ['XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX'],
    a: ['.XX.XX..', 'XXXXXXX.', 'XXXXXXX.', 'XXXXXXX.', '.XXXXX..', '..XXX...', '...X....'], b: ['...X....', '...XX...', 'XXXXXX..', 'XXXXXXX.', 'XXXXXX..', '...XX...', '...X....'],
    c: ['...X....', '..XXX...', '.XXXXX..', 'XXXXXXX.', '..XXX...', '..XXX...', '..XXX...'], d: ['.XXXXX..', 'X.....X.', 'X..XX.X.', 'X.X...X.', 'X..XX.X.', 'X.....X.', '.XXXXX..'],
    e: ['........', '..XXX...', '.XXXXX..', '.XXXXX..', '.XXXXX..', '..XXX...', '........'],
  };
  const NG = 102;                                                 // glyph codes 32..133
  const font8 = { cw: 8, ch: 8, n: NG, mask: new Uint8Array(NG * 64) };
  for (let g = 0; g < 64; g++) for (let r = 0; r < 8; r++) {
    const b = parseInt(HEXF.substr((g * 8 + r) * 2, 2), 16);
    for (let c = 0; c < 8; c++) font8.mask[g * 64 + r * 8 + c] = (b >> c) & 1;
  }
  for (const k in SANS) {
    const g = k.charCodeAt(0) - 32; font8.mask.fill(0, g * 64, g * 64 + 64);
    SANS[k].forEach((row, r) => { for (let c = 0; c < row.length; c++) if (row[c] === 'X') font8.mask[g * 64 + r * 8 + c] = 1; });
  }
  const code = ch => { let k = ch.charCodeAt(0); if (k >= 97 && k <= 122) k -= 32; k -= 32; return k >= 0 && k < 64 ? k : 0; };
  const SPECIAL = { cursor: '`', heart: 'a', right: 'b', up: 'c', ring: 'd', dot: 'e' };   // PIX.text('...' + PIX.sym.heart) etc: use raw()
  const rawCode = ch => ch.charCodeAt(0) - 32;                    // no upper-casing: lets you reach the extra glyphs

  // Scale2x (EPX): doubles a 1-bit glyph and rounds its diagonals, like a hand-smoothed demo font
  function scale2x(src, w, h) {
    const out = new Uint8Array(w * h * 4), at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : src[y * w + x];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const P = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1), o = (y * 2) * (w * 2) + x * 2;
      out[o] = (C === A && C !== D && A !== B) ? A : P; out[o + 1] = (A === B && A !== C && B !== D) ? B : P;
      out[o + w * 2] = (D === C && D !== B && C !== A) ? C : P; out[o + w * 2 + 1] = (B === D && B !== A && D !== C) ? D : P;
    }
    return out;
  }
  // shade map for a glyph bitmap: 0 empty, 1 body, 2 lit edge (up/left is empty), 3 dark edge (down/right is empty)
  function bevelMap(m, w, h) {
    const o = new Uint8Array(w * h), at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : m[y * w + x];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m[y * w + x])
      o[y * w + x] = (!at(x - 1, y) || !at(x, y - 1)) ? 2 : (!at(x + 1, y) || !at(x, y + 1)) ? 3 : 1;
    return o;
  }
  function upFont(f) {
    const cw = f.cw * 2, ch = f.ch * 2, mask = new Uint8Array(f.n * cw * ch);
    for (let g = 0; g < f.n; g++) mask.set(scale2x(f.mask.subarray(g * f.cw * f.ch, (g + 1) * f.cw * f.ch), f.cw, f.ch), g * cw * ch);
    return { cw, ch, n: f.n, mask };
  }
  const font16 = upFont(font8), font32 = upFont(font16);
  [font8, font16, font32].forEach(f => { f.bev = new Uint8Array(f.mask.length); for (let g = 0; g < f.n; g++) f.bev.set(bevelMap(f.mask.subarray(g * f.cw * f.ch, (g + 1) * f.cw * f.ch), f.cw, f.ch), g * f.cw * f.ch); });

  // ------------------------------ drawing ------------------------------
  const clear = col => px.fill(col);
  const rect = (x, y, w, h, col) => { x |= 0; y |= 0; for (let yy = Math.max(0, y); yy < Math.min(H, y + h); yy++) { const a = Math.max(0, x), b = Math.min(W, x + w); if (b > a) px.fill(col, yy * W + a, yy * W + b); } };
  const hline = (y, col) => { if (y >= 0 && y < H) px.fill(col, y * W, y * W + W); };      // one raster line: what the copper does
  const pset = (x, y, col) => { if (x >= 0 && x < W && y >= 0 && y < H) px[(y | 0) * W + (x | 0)] = col; };
  const bevel = (x, y, w, h, fill, hi, lo) => { rect(x, y, w, h, fill); rect(x, y, w, 1, hi); rect(x, y, 1, h, hi); rect(x, y + h - 1, w, 1, lo); rect(x + w - 1, y, 1, h, lo); };
  // text(str, x, y, col, opts): col is a packed colour or fn(row, charIndex, shade, column) -> colour (0 = skip pixel).
  // opts: { font: PIX.font8|font16|font32, raw: true to address glyphs above 95, sx, sy: integer stretch }
  function text(s, x, y, col, o = {}) {
    const f = o.font || font8, sx = o.sx || 1, sy = o.sy || 1, fn = typeof col === 'function' ? col : null, cc = o.raw ? rawCode : code;
    x |= 0; y |= 0;
    for (let i = 0; i < s.length; i++) {
      const g = cc(s[i]); if (g <= 0 || g >= f.n) continue; const base = g * f.cw * f.ch, x0 = x + i * f.cw * sx;
      if (x0 >= W || x0 + f.cw * sx <= 0) continue;
      for (let r = 0; r < f.ch; r++) for (let c = 0; c < f.cw; c++) {
        const sh = f.bev[base + r * f.cw + c]; if (!sh) continue;
        const v = fn ? fn(r, i, sh, c) : col; if (!v) continue;
        for (let dy = 0; dy < sy; dy++) { const yy = y + r * sy + dy; if (yy < 0 || yy >= H) continue;
          for (let dx = 0; dx < sx; dx++) { const xx = x0 + c * sx + dx; if (xx >= 0 && xx < W) px[yy * W + xx] = v; } }
      }
    }
    return s.length * f.cw * sx;
  }
  const centre = (s, y, col, o = {}) => text(s, (W - s.length * (o.font || font8).cw * (o.sx || 1)) >> 1, y, col, o);
  // A text string as a free-standing 1-bit bitmap (for logos): { w, h, m } with optional Scale2x passes
  function bitmap(s, passes = 0) {
    let w = s.length * 8, h = 8, m = new Uint8Array(w * h);
    for (let i = 0; i < s.length; i++) { const g = code(s[i]); for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) m[r * w + i * 8 + c] = font8.mask[g * 64 + r * 8 + c]; }
    for (let p = 0; p < passes; p++) { m = scale2x(m, w, h); w *= 2; h *= 2; }
    return { w, h, m };
  }
  // sprite(rows, pal): rows of characters, pal maps a character to a packed colour ('.' and ' ' are transparent)
  function sprite(rows, pal) {
    const h = rows.length, w = Math.max(...rows.map(r => r.length)), d = new Uint32Array(w * h);
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = pal[row[x]]; if (c) d[y * w + x] = c; } });
    return { w, h, d };
  }
  function blit(s, x, y, o = {}) {
    x |= 0; y |= 0; const sc = o.scale || 1;
    for (let r = 0; r < s.h * sc; r++) { const yy = y + r; if (yy < 0 || yy >= H) continue;
      for (let c = 0; c < s.w * sc; c++) { const xx = x + c; if (xx < 0 || xx >= W) continue;
        const sxx = o.flip ? s.w - 1 - ((c / sc) | 0) : (c / sc) | 0, v = s.d[((r / sc) | 0) * s.w + sxx]; if (v) px[yy * W + xx] = o.tint || v; } }
  }

  // ------------------------------ GL side ------------------------------
  function init() {
    tex = G.texture(W, H, { nearest: true });
    // font atlas for shaders: 16 glyphs per row, 8x8 each, 1 = ink. Bottom-up rows (texelFetch friendly).
    const aw = 128, ah = 64, d = new Uint8Array(aw * ah * 4);
    for (let g = 0; g < NG; g++) for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const v = font8.mask[g * 64 + r * 8 + c] * 255, o = (((g >> 4) * 8 + r) * aw + (g & 15) * 8 + c) * 4;
      d[o] = d[o + 1] = d[o + 2] = d[o + 3] = v;
    }
    atlasTex = G.texture(aw, ah, { nearest: true, data: d });
  }
  const upload = () => G.uploadRGBA(tex, buf);
  // a string as a 1-row texture of glyph codes, for shader scrollers (see GLSL below)
  function message(s) {
    const d = new Uint8Array(s.length * 4); for (let i = 0; i < s.length; i++) d[i * 4] = code(s[i]);
    return G.texture(s.length, 1, { nearest: true, data: d });
  }
  // GLSL: float pixGlyph(sampler2D atlas, float code, vec2 uv) -> 0/1 ink, uv in 0..1 with (0,0) at the glyph's top-left.
  //       float pixMsg(sampler2D msg, float i) -> glyph code of character i.  Both textures use NEAREST.
  const GLSL = `
float pixGlyph(sampler2D atlas, float code, vec2 uv){
  if(code<.5||uv.x<0.||uv.x>=1.||uv.y<0.||uv.y>=1.) return 0.;
  ivec2 c=ivec2(int(mod(code,16.))*8+int(uv.x*8.), int(floor(code/16.))*8+int(uv.y*8.));
  return texelFetch(atlas,c,0).r;
}
float pixMsg(sampler2D msg, float i){ return floor(texelFetch(msg,ivec2(int(i),0),0).r*255.+.5); }
`;
  // post-chain options for showing the framebuffer on the simulated CRT
  const crt = extra => ({ tex, flipY: true, crt: 1, fa: 1.25, crop: 0, inset: 0.06, scan: 256, tm: 0, bloom: 0.38, thresh: 0.5, grain: 0.03, vig: 0.35, aberr: 0.22, ...extra });

  return { W, H, px, buf, c12, hex, mix12, bayer, dith, clear, rect, hline, pset, bevel, text, centre, bitmap, scale2x, bevelMap, sprite, blit,
    font8, font16, font32, sym: SPECIAL, init, upload, message, GLSL, crt, get tex() { return tex; }, get atlas() { return atlasTex; } };
})();
