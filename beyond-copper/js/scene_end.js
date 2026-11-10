'use strict';
// =====================================================================
//  PART 7: GREETINGS + END OF DISK ONE. THEN: a one-pixel sine scroller
//  in the 8x8 font, its drop shadow, three copper bars and the classic
//  rippling mirror copy under a copper horizon. The raster beam passes
//  and every font pixel is a glossy bevelled cube: the same scroller,
//  now snaking in y and z over black water. PIXELS -> VOXELS. On the
//  final chord the cubes of the last words fly up and re-form as the
//  title, the CRT closes around it and the set is switched off.
// =====================================================================
(() => {
  const PAT = MUSIC.PAT, BAR = MUSIC.BAR, ROW = MUSIC.ROW;
  const FOV = 0.8, FL = 1 / Math.tan(FOV / 2), S = 0.06, LINE = S / 3;        // one cube = 3 PAL lines when seen head-on
  const D0 = 128 * LINE * FL, CAMY = 0.1, Y0 = CAMY + 24 * LINE, FLOOR = CAMY - 30 * LINE, AMP = 30 * LINE;
  const NC = 448, KW = 0.07, KZ = 0.032;
  const TEXT = 'GREETINGS TO ALL WHO KEPT THE COPPER FLOWING:  CODERS  MUSICIANS  GRAPHICIANS  SWAPPERS  SYSOPS  CRACKERS  ' +
    'TRAINER MAKERS  PARTY ORGANISERS    C-3 01 F06';
  const T1 = 'BEYOND THE COPPER', T2 = 'END OF DISK ONE', YT1 = 0.42, YT2 = -0.1;
  const BEAM0 = 2 * BAR, BEAM1 = BEAM0 + 1.4, TS = 2 * PAT, TE = TS - 0.7;        // the scroller has stopped by TE; the title forms from TS
  const SC0 = -34, SCE = (TEXT.length - 5) * 8, VEL = (SCE - SC0) / (TE - 0.6);
  // scroll position in font columns (the column at the middle of the screen): constant speed, then 1.2 s of braking
  // Include phase advection: a moving font column sees WSPD - KW * VEL.
  // Up/down rate of a letter: VEL * S / AMP rad/s (slowed 1.5x from the earlier 1.5 * VEL * S / AMP), so its peak
  // vertical speed now equals the horizontal scroll speed.
  const WSPD = KW * VEL + VEL * S / AMP;
  const scrollAt = lt => { const t1 = TE - 1.2; if (lt < t1) return SC0 + VEL * lt; const u = Math.min(1.2, lt - t1); return SC0 + VEL * (t1 + u - u * u / 2.4); };

  // camera, sky and water shared by the background and the cube shader
  const ENV = `
uniform vec3 uCam, uCF, uCR, uCU;
uniform float uFl, uFloorY, uBarT, uLit;
const vec3 BARC[3]=vec3[3](vec3(1.,.45,.08),vec3(.1,.42,1.),vec3(1.,.78,.3));
float barLine(int k){ return 80.+20.*sin(uBarT*1.15+float(k)*2.1); }           // PAL line (above screen centre) of copper bar k
vec3 sky(vec3 rd, float soft){
  float e=max(rd.y,0.), az=atan(rd.x,-rd.z), zz=max(-rd.z,1e-3);
  vec3 c=vec3(.003,.004,.010)+vec3(0.,.008,.03)*smoothstep(0.,.8,e);
  c+=vec3(1.,.42,.1)*(exp(-e*20.)*.2+exp(-e*5.)*.04)*uLit;
  c+=vec3(1.,.8,.5)*exp(-e*120.)*.1*uLit;
  vec2 g=vec2(az*58.,e*70.), id=floor(g), f=fract(g)-.5;                         // stars
  float h=hash21(id+3.7); c+=vec3(.75,.85,1.)*step(.95,h)*smoothstep(.16+soft*4.,.0,length(f-(hash22(id)-.5)*.6))*(.5+.5*sin(uBarT*3.+h*90.))*smoothstep(.03,.2,e)*.8;
  // the copper bars, now long light strips on a wall far behind the scroller
  float yl=rd.y/zz*uFl*128., win=step(0.,-rd.z)*smoothstep(2.4,1.5,abs(rd.x/zz));
  for(int k=0;k<3;k++){ float d=abs(yl-barLine(k))/(3.2+soft*90.); c+=BARC[k]*(smoothstep(1.,.35,d)*.6+smoothstep(.45,0.,d)*.5+exp(-d*.9)*.07)*win*uLit; }
  return c;
}`;
  const BG = ENV + PIX.GLSL + `
uniform sampler2D uAtlas, uMsg;
uniform float uScroll, uWT, uAmp, uLen, uGlow, uZ0;
const vec3 COP[16]=vec3[16](vec3(15,13,6),vec3(15,11,4),vec3(15,9,3),vec3(14,7,2),vec3(12,6,2),vec3(11,5,2),vec3(9,4,2),vec3(8,3,2),
  vec3(6,2,3),vec3(5,2,4),vec3(4,1,4),vec3(3,1,5),vec3(2,1,4),vec3(1,0,3),vec3(1,0,2),vec3(0,0,1));
const vec3 GOLD[8]=vec3[8](vec3(15,15,13),vec3(15,14,8),vec3(15,13,4),vec3(15,11,2),vec3(15,9,0),vec3(13,6,0),vec3(10,4,0),vec3(7,2,0));
const vec3 BARP[6]=vec3[6](vec3(15,15,15),vec3(15,12,8),vec3(15,8,3),vec3(12,5,1),vec3(8,3,0),vec3(4,1,0));
vec3 h12(vec3 c){ return (c+.02)/15.; }
vec3 invAces(vec3 y){ y=clamp(y,0.,.97); vec3 a=2.51-2.43*y, b=.03-.59*y, c=-.14*y; return (-b+sqrt(b*b-4.*a*c))/(2.*a); }
// 1990: which row (1..8, 0 = none) of the scroller covers lo-res pixel (X,Y)? One font pixel is 3x3 PAL pixels.
float scr(float X, float Y){
  float c=floor((X+floor(uScroll*3.))/3.), ch=floor(c/8.);
  if(ch<0.||ch>=uLen) return 0.;
  float top=36.+floor(uAmp*sin((c-uScroll)*${KW}+uWT)+.5), row=floor((top-Y)/3.);
  if(row<0.||row>7.) return 0.;
  return pixGlyph(uAtlas,pixMsg(uMsg,ch),vec2((mod(c,8.)+.5)/8.,(row+.5)/8.))>.5?row+1.:0.;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);
  vec3 col;
  if(isOld()>.5){
    float X=floor(uv.x*128.), Y=floor(uv.y*128.);
    col=vec3(0.);
    if(Y>=0.){
      float s=hash21(vec2(X,Y)); if(s>.9972) col=s>.9992?vec3(10,11,14):vec3(4,5,8);
      for(int k=0;k<3;k++){ float d=abs(Y-floor(barLine(k))); if(d<6.) col=BARP[int(d)]*(k==1?vec3(.1,.55,1.):k==2?vec3(1.,.9,.5):vec3(1.)); }
    } else { int k=int(-Y/2.); if(k<16) col=COP[k]; }
    // three taps of the same scroller: its mirror image in the "water" (every other line, rippling), its drop shadow, itself
    for(int i=0;i<3;i++){
      float my=2.*${(-30).toFixed(1)}-Y;
      vec2 q=i==0?vec2(X+floor(2.5*sin(Y*.3+uWT*1.7)+.5),my):i==1?vec2(X-3.,Y+3.):vec2(X,Y);
      if(i==0&&(Y>=-30.||mod(Y,2.)<1.)) continue;
      float r=scr(q.x,q.y); if(r<.5) continue;
      col=i==0?floor(GOLD[int(r)-1]*vec3(.3,.42,.6))+vec3(0,1,4):i==1?vec3(3,1,0):GOLD[int(r)-1];
    }
    col=invAces(h12(col));
  } else {
    vec3 rd=normalize(uCF*uFl+uCR*uv.x+uCU*uv.y), r=rd, add=vec3(0.); float k=1., soft=0.;
    if(rd.y<0.){                                                                // black water: a rippled mirror of the sky
      float t=(uFloorY-uCam.y)/rd.y; vec3 p=uCam+rd*t; float fo=1./(1.+t*.25);
      vec2 w=vec2(sin(p.x*2.1+p.z*3.7+uBarT*1.3)+sin(p.x*5.3-p.z*2.2-uBarT*1.9)*.5, sin(p.z*4.1-p.x*1.7+uBarT*1.6)+sin(p.z*7.9+p.x*3.1+uBarT*2.3)*.5)*.007*fo;
      r=reflect(rd,normalize(vec3(w.x,1.,w.y))); r.y=abs(r.y);
      k=mix(.22,.9,.04+.96*pow(1.-abs(rd.y),5.)); soft=.01;
      float dz=p.z-uZ0; add=vec3(1.,.62,.22)*exp(-dz*dz*1.1)*exp(-abs(p.x)*.14)*uGlow*.035;      // the letters' glow on the water
    }
    col=sky(r,soft)*k+add;
  }
  fragColor=vec4(col,1.);
}`;
  const VS = `#version 300 es
precision highp float;
uniform mat4 uP, uV;
uniform sampler2D uAtlas, uMsg, uTitle;
uniform float uScroll, uWT, uAmp, uZamp, uLen, uStage, uTE, uMirror, uFloorY, uTime;
uniform vec4 uSync;                 // lead: wave position (column) and envelope; hats: seed and envelope
uniform vec3 uSweep;                // title glint: x position, width, strength
out vec2 vUv; out vec3 vLP; out vec3 vWP; out vec3 vCol; out vec3 vGlow; out float vDepth;
const float S=${S}, NC=${NC}.;
float h1(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
vec3 spos(float c, float row){                                                   // where font pixel (column c, row) of the scroller is
  return vec3((c+.5-uScroll)*S, ${Y0.toFixed(4)}+(3.5-row)*S+uAmp*sin((c-uScroll)*${KW}+uWT), uZamp*sin(c*${KZ}+uWT*.45));
}
float edge(float c){ return 1.-smoothstep(NC*.5-40.,NC*.5-6.,abs(c+.5-uScroll)); }
void main(){
  int vid=gl_VertexID, f=vid/6, k=vid-f*6, id=gl_InstanceID;
  vec2 q=vec2((k==1||k==2||k==4)?1.:-1.,(k==2||k==4||k==5)?1.:-1.);
  vec3 lp=f==0?vec3(q,1.):f==1?vec3(-q.x,q.y,-1.):f==2?vec3(1.,q.y,-q.x):f==3?vec3(-1.,q.y,q.x):f==4?vec3(q.x,1.,-q.y):vec3(q.x,-1.,q.y);
  vec3 p; float hs, row, c; vec3 col; vUv=q; vGlow=vec3(0.);
  const vec3 TOP=vec3(1.,.74,.27), BOT=vec3(.95,.28,.03), BLU=vec3(.10,.42,1.);
  if(uStage<.5){
    row=float(id&7); c=floor(uScroll)+float(id>>3)-NC*.5;
    float ch=floor(c/8.);
    if(ch<0.||ch>=uLen){ gl_Position=vec4(2.,2.,2.,1.); return; }
    float code=floor(texelFetch(uMsg,ivec2(int(ch),0),0).r*255.+.5);
    float on=texelFetch(uAtlas,ivec2(int(mod(code,16.))*8+int(mod(c,8.)),int(floor(code/16.))*8+int(row)),0).r;
    if(code<.5||on<.5){ gl_Position=vec4(2.,2.,2.,1.); return; }
    p=spos(c,row); hs=S*.46*edge(c); col=mix(TOP,BOT,row/7.);
  } else {
    vec4 A=texelFetch(uTitle,ivec2(id&255,(id>>8)*2),0), B=texelFetch(uTitle,ivec2(id&255,(id>>8)*2+1),0);
    c=A.x; row=A.y;
    float m=clamp((uTE-A.z)/1.5,0.,1.); m=m*m*m*(m*(m*6.-15.)+10.);
    vec3 src=spos(c,row), dst=vec3(B.xy,0.);
    float arc=sin(m*3.14159);
    p=mix(src,dst,m)+vec3(0.,.3*(h1(float(id)*1.31)-.25),.5+1.5*h1(float(id)*.37))*arc;
    hs=S*.46*mix(edge(c),B.z,m);
    vec3 tc=B.w<.5?mix(TOP,BOT,A.w/7.):mix(vec3(.8,.9,1.),BLU,A.w/7.);
    col=mix(mix(TOP,BOT,row/7.),tc,m);
    float sw=exp(-pow((dst.x-uSweep.x)/uSweep.y,2.))*uSweep.z*step(.999,m);
    vGlow+=vec3(1.,.95,.85)*sw*2.6; c=dst.x/S+uScroll;
  }
  // sync: every melody note sends a bright crest along the letters, every hat lights a few cubes
  float crest=exp(-pow((c-uSync.x)/16.,2.))*uSync.y;
  float spk=step(.94,h1(c*.713+row*3.37+uSync.z*7.1))*uSync.w;
  vGlow+=vec3(1.,.85,.55)*crest*.55+vec3(.6,.85,1.)*spk*1.1;
  p.y+=crest*.035; hs*=1.+crest*.12;
  vec3 pw=p+lp*hs; vDepth=0.;
  if(uMirror>.5){
    pw.y=2.*uFloorY-pw.y; lp.y=-lp.y; vDepth=uFloorY-pw.y;
    pw.x+=sin(vDepth*11.+uTime*2.1+pw.z*2.)*.014*min(vDepth*2.5,1.);
  }
  vLP=lp; vWP=pw; vCol=col;
  gl_Position=uP*uV*vec4(pw,1.);
}`;
  const FS = `
uniform vec3 uCam, uL;
uniform float uMirror, uLit;
in vec3 vLP; in vec3 vWP; in vec3 vCol; in vec3 vGlow; in float vDepth;
void main(){
  if(isOld()>.5) discard;                                                         // below the beam the scroller is still pixels
  vec3 a=abs(vLP), n=normalize(sign(vLP)*pow(a,vec3(5.)));                         // a cube with rounded, bevelled edges
  float face=max(a.x,max(a.y,a.z)), rim=a.x+a.y+a.z-face;                          // 0 mid-face .. 2 at a corner
  vec3 V=normalize(uCam-vWP), H=normalize(uL+V);
  float dif=max(dot(n,uL),0.), sp=pow(max(dot(n,H),0.),70.), fre=.04+.96*pow(1.-max(dot(n,V),0.),5.);
  vec3 R=reflect(-V,n);
  vec3 env=R.y>0.?vec3(.02,.04,.10)*R.y+vec3(1.,.45,.12)*exp(-R.y*7.)*.55:vCol*.22*exp(R.y*3.);      // sky and horizon glow above, its neighbours below
  vec3 amb=mix(vec3(.10,.045,.015),vec3(.05,.09,.2),.5+.5*n.y);
  float ao=1.-.3*smoothstep(1.,1.9,rim);
  vec3 col=vCol*(dif*1.55+amb*1.4)*ao+vec3(1.,.95,.85)*sp*3.+env*fre*1.6+vGlow*(.35+.65*vCol);
  col*=uLit;
  float dist=length(uCam-vWP);
  col*=exp(-max(dist-6.,0.)*.11);
  if(uMirror>.5) col*=.5*exp(-vDepth*.75)*(.5+.5*pow(1.-abs(V.y),3.));
  fragColor=vec4(col,1.);
}`;

  let cubes, bg, vao, msg, titleTex, M = 0;
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const nrm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
  const glyph = ch => { const k = ch.toUpperCase().charCodeAt(0) - 32; return k >= 0 && k < 64 ? k : 0; };
  const pixels = s => { const o = []; for (let i = 0; i < s.length; i++) { const g = glyph(s[i]); for (let c = 0; c < 8; c++) for (let r = 0; r < 8; r++) if (PIX.font8.mask[g * 64 + r * 8 + c]) o.push([i * 8 + c, r]); } return o; };

  function init() {
    cubes = G.program(FS, 'voxels', VS); bg = G.program(BG, 'voxels-bg');
    vao = G.gl.createVertexArray(); msg = PIX.message(TEXT);
    // the end title is built from the cubes that are on screen when the scroller stops: source font pixel -> title position
    const src = pixels(TEXT).filter(p => Math.abs(p[0] + 0.5 - SCE) < NC / 2 - 6);
    const dst = pixels(T1).map(p => [(p[0] - T1.length * 4 + 0.5) * S, YT1 + (3.5 - p[1]) * S, 1, 0, p[1]])
      .concat(pixels(T2).map(p => [(p[0] - T2.length * 4 + 0.5) * S * 0.7, YT2 + (3.5 - p[1]) * S * 0.7, 0.7, 1, p[1]]));
    src.sort((a, b) => a[0] - b[0]); dst.sort((a, b) => a[0] - b[0]);
    M = Math.max(src.length, dst.length);
    const h = i => { const s = Math.sin(i * 127.1 + 1.7) * 43758.5453; return s - Math.floor(s); };
    const rows = Math.ceil(M / 256), d = new Float32Array(256 * rows * 2 * 4);
    for (let i = 0; i < M; i++) {
      const s = src[Math.floor(i * src.length / M)], t = dst[Math.floor(i * dst.length / M)];
      const o = ((i >> 8) * 2 * 256 + (i & 255)) * 4, delay = (t[3] ? 1.25 : 0.05) + 0.75 * (t[0] / (T1.length * 8 * S) + 0.5) + 0.25 * h(i);
      d.set([s[0], s[1], delay, t[4]], o); d.set([t[0], t[1], t[2], t[3]], o + 256 * 4);
    }
    titleTex = G.texture(256, rows * 2, { float32: true, nearest: true, data: d });
  }

  function draw(st, tgt) {
    const gl = G.gl, lt0 = st.lt, beam = Math.min(1, Math.max(0, (lt0 - BEAM0) / (BEAM1 - BEAM0)));
    const lt = beam < 1 ? Math.floor(lt0 * 50) / 50 : lt0, endT = lt0 - TS, asp = st.W / st.H;       // 50 Hz while any of it is still 1990
    const now = sm(BEAM1 - 0.3, BEAM1 + 3.2, lt), fin = sm(TE - 0.8, TS + 1.6, lt), stage = lt >= TS ? 1 : 0;
    // ---- camera: locked head-on for the pixels, then it swings round the scroller, and squares up for the title
    const yaw = now * 0.58 * Math.cos((lt - BEAM1 - 1.2) * 0.33) * (1 - fin);
    const dist = D0 + now * (-2.1 + 0.25 * Math.sin(lt * 0.4)) * (1 - fin) + fin * 2.4;
    const tg = [0.45 * Math.sin(yaw) * (1 - fin), CAMY + now * 0.2 * (1 - fin) - fin * 0.42, 0];
    const cam = [tg[0] + Math.sin(yaw) * dist, CAMY + now * (0.7 + 0.12 * Math.sin(lt * 0.47)) * (1 - fin) + fin * 0.02, Math.cos(yaw) * dist];
    const f = nrm([tg[0] - cam[0], tg[1] - cam[1], tg[2] - cam[2]]), r = nrm([-f[2], 0, f[0]]), u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    const P = G.m4.persp(FOV, asp, 0.1, 80), V = G.m4.look(cam, tg);
    // ---- the scroller
    const scroll = scrollAt(lt), wt = lt * WSPD, amp = AMP * (1 + 0.22 * st.kick * now) * (1 - 0.6 * sm(TE - 1.4, TE, lt)) * (1 - 0.5 * sm(TS, TS + 2.5, lt));
    const zamp = 0.18 * sm(BEAM1 - 0.2, BEAM1 + 3, lt) * (1 - sm(TE - 1, TS + 1, lt));
    const ls = MUSIC.since('lead', st.t), hs = MUSIC.since('hat', st.t), hc = MUSIC.count('hat', st.t);
    const sync = [scroll + 110 - ls * 420, Math.exp(-ls * 3.2) * (stage ? 0 : 1), hc, Math.exp(-hs * 9) * (stage ? 0.4 : 1)];
    const lit = 1 + 0.12 * st.kick + 0.6 * sm(TS + 1, TS + 3, lt);
    const env = { uCam: cam, uCF: f, uCR: r, uCU: u, uFl: FL, uFloorY: FLOOR, uBarT: lt, uLit: lit, uBeam: beam };
    G.draw(bg, { ...env, uAtlas: PIX.atlas, uMsg: msg, uScroll: scroll, uWT: wt, uAmp: amp / LINE, uLen: TEXT.length,
      uGlow: (1 + 0.6 * st.kick) * (1 - 0.5 * fin), uZ0: 0 }, tgt);
    if (beam > 0) {
      const Lw = nrm([-0.5 * r[0] - 0.55 * f[0], 0.8, -0.5 * r[2] - 0.55 * f[2]]), sw = endT - 3.1;
      const U = { ...env, uP: P, uV: V, uAtlas: PIX.atlas, uMsg: msg, uTitle: titleTex, uScroll: scroll, uWT: wt, uAmp: amp, uZamp: zamp, uLen: TEXT.length,
        uStage: stage, uTE: endT, uTime: lt, uSync: sync, uSweep: [-5 + sw * 9, 0.7, sw > 0 && sw < 1.3 ? 1 : 0] };
      const count = stage ? M : NC * 8;
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS);
      // the mirror image in the water: added on top of the reflected sky
      G.use(cubes, { ...U, uMirror: 1, uL: [Lw[0], -Lw[1], Lw[2]] }, tgt);
      gl.clear(gl.DEPTH_BUFFER_BIT); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      gl.bindVertexArray(vao); gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, count);
      gl.disable(gl.BLEND);
      G.use(cubes, { ...U, uMirror: 0, uL: Lw }, tgt);
      gl.clear(gl.DEPTH_BUFFER_BIT); gl.bindVertexArray(vao); gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, count);
      gl.disable(gl.DEPTH_TEST);
    }
    // ---- post: beam at the start; at the end the CRT closes around the title and is switched off (timings as in the 2D version)
    const crt = Math.max(1 - sm(BEAM1 - 0.2, BEAM1 + 1.3, lt0), sm(3.2, 4.6, endT)), off = sm(5.6, 6.8, endT);
    return { beam, lines: beam < 1 ? 256 : undefined, ocs: 1, scan: 256, bloom: 0.2 + 0.4 * beam, thresh: 1.6 - 0.75 * beam, expo: 1,
      crt, fa: asp + (1.25 - asp) * crt, aberr: 0.12 + 0.1 * crt, off, grain: 0.02, vig: 0.5,
      fade: endT > 6.85 ? 0 : Math.min(1, lt0 / 0.3) };
  }

  (window.SCENES = window.SCENES || []).push({
    name: 'Greetings', from: 22, to: 25, init, draw, scale: 1,
    caps: [{ at: BEAM1 + 1.4, len: 4.2, title: 'GREETINGS', sub: 'EVERY PIXEL GREW UP TO BE A VOXEL' }],
  });
})();
