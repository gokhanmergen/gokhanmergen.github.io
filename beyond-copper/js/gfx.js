'use strict';
// =====================================================================
//  GFX: minimal WebGL2 toolkit - programs, render targets, post chain
// =====================================================================
const G = (() => {
  let gl, vao, hasFloat = false;
  const VS = `#version 300 es
out vec2 vUv;
void main(){ vec2 p = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2)); vUv = p; gl_Position = vec4(p*2.-1., 0., 1.); }`;

  const COMMON = `#version 300 es
precision highp float;
precision highp int;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime, uGT, uKick, uSnare, uHat, uBass, uLead, uBeat, uProg;
#define PI 3.14159265359
#define TAU 6.28318530718
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,s,-s,c); }
float hash11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float hash21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 hash22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x), mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*noise(p); p=p*2.03+17.1; a*=.5; } return s; }
vec3 pal(float t, vec3 a, vec3 b, vec3 c, vec3 d){ return a+b*cos(TAU*(c*t+d)); }
vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
// Raster-beam transition: a scene passes uBeam (the same value it returns as o.beam) and asks isOld()
// per pixel: 1 below the beam (still 1985: use the old technique's shading), 0 above it (modern).
uniform float uBeam;
float isOld(){ return uBeam<=0.?1.:uBeam>=1.?0.:step(gl_FragCoord.y/uRes.y,1.-uBeam*1.04+.02); }
`;

  const numbered = s => s.split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n');
  function compile(type, src, name) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s); console.error(name, log, '\n' + numbered(src));
      throw new Error('Shader "' + name + '" failed:\n' + log);
    }
    return s;
  }
  function program(fs, name = 'fs', vs = VS) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs, name + '.vs'));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, COMMON + fs, name));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Link "' + name + '": ' + gl.getProgramInfoLog(p));
    const U = {}; let unit = 0;
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      U[info.name.replace(/\[0\]$/, '')] = { loc: gl.getUniformLocation(p, info.name), type: info.type, size: info.size,
        unit: info.type === gl.SAMPLER_2D ? unit++ : -1 };
    }
    return { p, U, name };
  }
  function setU(pr, name, v) {
    const u = pr.U[name]; if (!u || v === undefined) return;
    switch (u.type) {
      case gl.FLOAT: u.size > 1 ? gl.uniform1fv(u.loc, v) : gl.uniform1f(u.loc, v); break;
      case gl.FLOAT_VEC2: gl.uniform2fv(u.loc, v); break;
      case gl.FLOAT_VEC3: gl.uniform3fv(u.loc, v); break;
      case gl.FLOAT_VEC4: gl.uniform4fv(u.loc, v); break;
      case gl.INT: case gl.BOOL: gl.uniform1i(u.loc, v); break;
      case gl.FLOAT_MAT3: gl.uniformMatrix3fv(u.loc, false, v); break;
      case gl.FLOAT_MAT4: gl.uniformMatrix4fv(u.loc, false, v); break;
      case gl.SAMPLER_2D: gl.activeTexture(gl.TEXTURE0 + u.unit); gl.bindTexture(gl.TEXTURE_2D, v.tex || v); gl.uniform1i(u.loc, u.unit); break;
    }
  }
  const globals = {};
  function use(pr, uniforms, tgt) {
    bind(tgt);
    gl.useProgram(pr.p);
    setU(pr, 'uRes', tgt ? [tgt.w, tgt.h] : [gl.canvas.width, gl.canvas.height]);
    for (const k in globals) setU(pr, k, globals[k]);
    for (const k in uniforms) setU(pr, k, uniforms[k]);
  }
  function bind(tgt) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, tgt ? tgt.fb : null);
    gl.viewport(0, 0, tgt ? tgt.w : gl.canvas.width, tgt ? tgt.h : gl.canvas.height);
  }
  function draw(pr, uniforms, tgt) { use(pr, uniforms, tgt); gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLES, 0, 3); }

  function texture(w, h, o = {}) {
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    const f = o.nearest ? gl.NEAREST : gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, o.repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, o.repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    if (o.float32) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, o.data || null);
    else if (o.hdr && hasFloat) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, o.data || null);
    return { tex, w, h };
  }
  function uploadRGBA(t, data) { gl.bindTexture(gl.TEXTURE_2D, t.tex); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, t.w, t.h, gl.RGBA, gl.UNSIGNED_BYTE, data); }
  function uploadCanvas(t, cv) {
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, cv);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    t.w = cv.width; t.h = cv.height;
  }
  function target(w, h, o = {}) {
    const t = texture(w, h, { hdr: true, ...o });
    t.fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
    if (o.depth) {
      t.rb = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, t.rb);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, t.rb);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    t.opts = o;
    return t;
  }
  function free(t) { if (!t) return; gl.deleteTexture(t.tex); if (t.fb) gl.deleteFramebuffer(t.fb); if (t.rb) gl.deleteRenderbuffer(t.rb); }
  function ensure(t, w, h, o) { w = Math.max(1, w | 0); h = Math.max(1, h | 0); if (t && t.w === w && t.h === h) return t; free(t); return target(w, h, o); }

  // ---------------------------- tiny mat4 ----------------------------
  const m4 = {
    persp(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2), r = 1 / (n - f); return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (n + f) * r, -1, 0, 0, 2 * n * f * r, 0]; },
    look(e, c, up = [0, 1, 0]) {
      const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], nrm = a => { const l = Math.hypot(...a) || 1; return a.map(x => x / l); };
      const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const z = nrm(sub(e, c)), x = nrm(crs(up, z)), y = crs(z, x);
      return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1];
    },
  };

  // --------------------------- post chain ---------------------------
  const DOWN = `uniform sampler2D uSrc; uniform vec2 uTexel; uniform float uThresh;
void main(){ vec2 o=uTexel; vec3 c=(texture(uSrc,vUv+o*vec2(-1,-1)).rgb+texture(uSrc,vUv+o*vec2(1,-1)).rgb+texture(uSrc,vUv+o*vec2(-1,1)).rgb+texture(uSrc,vUv+o*vec2(1,1)).rgb)*.25;
  c=max(c,0.); float l=max(c.r,max(c.g,c.b)); c*=max(l-uThresh,0.)/max(l,1e-4); fragColor=vec4(min(c,vec3(40.)),1.); }`;
  const BLUR = `uniform sampler2D uSrc; uniform vec2 uDir;
void main(){ vec3 c=texture(uSrc,vUv).rgb*.227027;
  c+=(texture(uSrc,vUv+uDir*1.3846).rgb+texture(uSrc,vUv-uDir*1.3846).rgb)*.3162162;
  c+=(texture(uSrc,vUv+uDir*3.2308).rgb+texture(uSrc,vUv-uDir*3.2308).rgb)*.0702703; fragColor=vec4(c,1.); }`;
  // Composite. Besides bloom/tonemap/CRT it implements the demo's signature transition, the RASTER BEAM:
  // uBeam sweeps a glowing scanline down the picture; below it the image is still "1985" (uPix-sized pixels,
  // 12-bit colour with ordered dither, scanlines), above it the same image is shown at full modern fidelity.
  const COMP = `uniform sampler2D uScene, uB1, uB2, uB3, uCap;
uniform float uCRT, uPix, uBloom, uExpo, uAberr, uFlash, uFade, uOff, uFA, uCrop, uScan, uTM, uCapA, uGrain, uVig, uFlipY, uOcs, uLetter, uInset;
uniform vec3 uTint;
vec3 samp(vec2 uv){ if(uFlipY>.5) uv.y=1.-uv.y; return texture(uScene,uv).rgb; }
float bayer4(vec2 p){ ivec2 i=ivec2(mod(p,4.)); int k=i.y*4+i.x;
  const float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return (m[k]+.5)/16.; }
void main(){
  vec2 uv=vUv; float sa=uRes.x/uRes.y;
  if(uOff>0.){ float sy=mix(1.,.003,smoothstep(0.,.55,uOff)), sx=mix(1.,.002,smoothstep(.55,1.,uOff)); uv=(uv-.5)/vec2(sx,sy)+.5; }
  vec2 p=uv-.5; p.x*=sa/uFA;
  vec2 q=p*2.; float r2=dot(q,q); q*=1.+uCRT*(.07*r2+.025*r2*r2); vec2 fuv=q*.5+.5;
  // retro = 1 below the beam, 0 above it (uBeam 0 = all retro, 1 = all modern)
  float by=1.-uBeam*1.04+.02, retro=uBeam<=0.?1.:uBeam>=1.?0.:step(fuv.y,by);
  float pix=mix(1.,uPix,retro);
  vec2 suv=uCrop>.5 ? .5+(fuv-.5)*vec2(uFA/sa,1.) : fuv, cell=vec2(0.);
  // overscan: the 320x256 display sits inside a border that repeats its edge colour (so copper bars run into it)
  suv=clamp(.5+(suv-.5)*(1.+uInset),0.,1.);
  if(pix>1.){ cell=floor(suv*uRes/pix); suv=(cell+.5)*pix/uRes; }
  float rad=.04*uCRT, rc=length(max(abs(fuv-.5)-.5+rad,0.));
  float inside=step(rc,rad+1e-5);
  vec3 col;
  if(uAberr>0.){ vec2 ca=(fuv-.5)*uAberr*.015; col=vec3(samp(suv+ca).r, samp(suv).g, samp(suv-ca).b); } else col=samp(suv);
  vec2 buv=uFlipY>.5 ? vec2(suv.x,1.-suv.y) : suv;
  vec3 bl=texture(uB1,buv).rgb*.55+texture(uB2,buv).rgb*.7+texture(uB3,buv).rgb*.75;
  col+=bl*uBloom;
  col*=uExpo*uTint; col=mix(col,aces(col),uTM);
  if(uOcs*retro>0.&&pix>1.) col=floor(clamp(col,0.,1.)*15.+bayer4(cell)*uOcs)/15.;
  float hasBeam=step(1.5,uPix), k=mix(uCRT,retro*max(uCRT,.75),hasBeam);
  if(k>0.){
    float sl=.5+.5*cos(fuv.y*uScan*TAU);
    col*=mix(1.,.52+.48*sl,k*.85);
    float m=mod(gl_FragCoord.x,3.); vec3 mask=m<1.?vec3(1.,.72,.72):m<2.?vec3(.72,1.,.72):vec3(.72,.72,1.);
    col*=mix(vec3(1.),mask*1.3,k*.5);
  }
  if(uCRT>0.){
    col*=mix(1.,pow(clamp(16.*fuv.x*fuv.y*(1.-fuv.x)*(1.-fuv.y),0.,1.),.3)*1.25,uCRT);
    col*=mix(1.,smoothstep(rad,rad-.012,rc),uCRT);
  }
  // the beam itself: a hot line, a soft glow below (phosphor about to be rewritten) and a faint one above
  if(uBeam>0.&&uBeam<1.){ float d=fuv.y-by; float hot=exp(-abs(d)*900.)+.35*exp(-abs(d)*90.)+.12*exp(-max(d,0.)*14.)*step(0.,d);
    col+=vec3(.75,.9,1.)*hot*(1.6+.4*sin(fuv.x*900.+uGT*90.)); }
  // the bezel: light from the picture spills a little way onto it and dies off
  vec3 bez=(min(texture(uB3,clamp(fuv,0.,1.)).rgb,vec3(1.5))*.3*exp(-max(rc-rad,0.)*14.)+vec3(.012,.012,.014))*uCRT;
  bez+=vec3(.04,.04,.05)*uCRT*smoothstep(.02,.0,abs(rc-rad-.012));
  col=mix(col,vec3(1.),clamp(uFlash,0.,1.));                  // a flash is light from the picture: it stays inside the frame
  bez+=vec3(.05,.05,.055)*uCRT*clamp(uFlash,0.,1.);
  col=inside>.5?col:bez;
  if(uLetter>0.){ float lb=abs(vUv.y-.5)*2.; col*=smoothstep(1.-uLetter+.004,1.-uLetter-.004,lb); }
  vec2 vv=vUv-.5; col*=1.-uVig*dot(vv,vv)*1.3;
  col+=(hash21(gl_FragCoord.xy+fract(uGT*7.31)*311.)-.5)*uGrain;
  col*=uFade;
  if(uOff>0.){ col*=1.+uOff*1.5; if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.) col=vec3(0.); if(uOff>=1.) col=vec3(0.); }
  vec4 cap=texture(uCap,vUv); col=col*(1.-cap.a*uCapA)+cap.rgb*uCapA;
  fragColor=vec4(max(col,0.),1.);
}`;
  let P = {}, B = {}, capTex, capCanvas, capKey = '';

  function init(canvas) {
    gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL2 is not available in this browser.');
    hasFloat = !!gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');
    vao = gl.createVertexArray();
    P.down = program(DOWN, 'down'); P.blur = program(BLUR, 'blur'); P.comp = program(COMP, 'composite');
    capCanvas = document.createElement('canvas'); capCanvas.width = 1920; capCanvas.height = 1080;
    capTex = texture(4, 4); uploadCanvas(capTex, capCanvas);
    api.gl = gl;
  }

  // Part labels: the demo's only text overlay, set in the 8x8 pixel font (crisp, integer-scaled) with a
  // copper gradient, like the info line of a tracker or a trainer menu. cap = { title, sub, x, y, align, scale, hue }
  function caption(cap) {
    const key = JSON.stringify(cap || 0); if (key === capKey) return; capKey = key;
    const c = capCanvas.getContext('2d'); c.clearRect(0, 0, 1920, 1080);
    if (cap) {
      const f = PIX.font8, draw = (s, x0, y0, sc, colFn, shadow) => {
        s = String(s).toUpperCase();
        for (let i = 0; i < s.length; i++) { const g = s.charCodeAt(i) - 32; if (g <= 0 || g >= 64) continue;
          for (let r = 0; r < 8; r++) { c.fillStyle = shadow || colFn(r / 7);
            for (let k = 0; k < 8; k++) if (f.mask[g * 64 + r * 8 + k]) c.fillRect(x0 + (i * 8 + k) * sc + (shadow ? sc : 0), y0 + r * sc + (shadow ? sc : 0), sc, sc); } }
      };
      const sc = cap.scale || 6, s2 = Math.max(2, Math.round(sc / 2)), al = cap.align || 'left', hue = cap.hue ?? 30;
      const w1 = (cap.title || '').length * 8 * sc, w2 = (cap.sub || '').length * 8 * s2;
      const ax = w => al === 'center' ? (cap.x ?? 960) - w / 2 : al === 'right' ? (cap.x ?? 1840) - w : (cap.x ?? 80);
      const y = cap.y ?? 930;
      const grad = k => `hsl(${hue + 25 - 50 * k},100%,${Math.round(86 - 46 * k)}%)`;
      if (cap.title) { draw(cap.title, ax(w1), y, sc, null, 'rgba(0,0,0,.75)'); draw(cap.title, ax(w1), y, sc, grad); }
      if (cap.sub) { const yy = y + 8 * sc + 2 * s2; draw(cap.sub, ax(w2), yy, s2, null, 'rgba(0,0,0,.75)'); draw(cap.sub, ax(w2), yy, s2, () => 'rgb(200,215,235)'); }
    }
    uploadCanvas(capTex, capCanvas);
  }

  function post(scene, o, W, H) {
    B.a = ensure(B.a, W / 4, H / 4); B.b = ensure(B.b, W / 4, H / 4);
    B.c = ensure(B.c, W / 8, H / 8); B.d = ensure(B.d, W / 8, H / 8);
    B.e = ensure(B.e, W / 16, H / 16); B.f = ensure(B.f, W / 16, H / 16);
    draw(P.down, { uSrc: scene, uTexel: [1 / scene.w, 1 / scene.h], uThresh: o.thresh ?? 0.8 }, B.a);
    draw(P.blur, { uSrc: B.a, uDir: [1 / B.a.w, 0] }, B.b); draw(P.blur, { uSrc: B.b, uDir: [0, 1 / B.a.h] }, B.a);
    draw(P.down, { uSrc: B.a, uTexel: [1 / B.a.w, 1 / B.a.h], uThresh: 0 }, B.c);
    draw(P.blur, { uSrc: B.c, uDir: [1 / B.c.w, 0] }, B.d); draw(P.blur, { uSrc: B.d, uDir: [0, 1 / B.c.h] }, B.c);
    draw(P.down, { uSrc: B.c, uTexel: [1 / B.c.w, 1 / B.c.h], uThresh: 0 }, B.e);
    draw(P.blur, { uSrc: B.e, uDir: [1 / B.e.w, 0] }, B.f); draw(P.blur, { uSrc: B.f, uDir: [0, 1 / B.e.h] }, B.e);
    draw(P.blur, { uSrc: B.e, uDir: [2 / B.e.w, 0] }, B.f); draw(P.blur, { uSrc: B.f, uDir: [0, 2 / B.e.h] }, B.e);
    // o.lines: show the scene as an N-line picture (256 = PAL lo-res) wherever the beam has not passed yet
    const pix = o.lines ? Math.max(1, H / o.lines) : (o.pix || 1);
    draw(P.comp, {
      uScene: scene, uB1: B.a, uB2: B.c, uB3: B.e, uCap: capTex,
      uCRT: o.crt || 0, uPix: pix, uBloom: o.bloom ?? 0.5, uExpo: o.expo ?? 1, uAberr: o.aberr || 0,
      uFlash: o.flash || 0, uFade: o.fade ?? 1, uOff: o.off || 0, uFA: o.fa || W / H, uCrop: o.crop ?? 1, uScan: o.scan || o.lines || 256,
      uTM: o.tm ?? 1, uCapA: o.cap || 0, uGrain: o.grain ?? 0.025, uVig: o.vig ?? 0.6, uFlipY: o.flipY ? 1 : 0,
      uBeam: o.beam === undefined ? (o.lines || (o.pix || 1) > 1 ? 0 : 1) : o.beam, uOcs: o.ocs || 0, uLetter: o.letter || 0, uInset: o.inset || 0, uTint: o.tint || [1, 1, 1],
    }, null);
  }

  const api = { init, program, draw, use, bind, setU, texture, target, ensure, free, uploadRGBA, uploadCanvas, m4, post, caption, globals, VS };
  return api;
})();
