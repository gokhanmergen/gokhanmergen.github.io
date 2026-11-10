'use strict';
// =====================================================================
//  PART 3: VECTOR BALLS. THEN: 125 sprite "bobs" (three tones and a
//  specular dot, painter-sorted, three sprite sizes) in a tumbling 5x5x5
//  lattice over a copper horizon. The raster beam passes and every bob
//  is a lit sphere; the lattice subdivides 125 -> 1000 -> 16 384 and
//  the swarm morphs sphere -> torus knot -> galaxy -> AMIGA above a
//  black mirror floor. One instanced draw (plus one for the reflection),
//  sphere impostors with correct per-pixel depth.
// =====================================================================
(() => {
  const N = 16384, PAT = MUSIC.PAT, BAR = MUSIC.BAR, ROW = MUSIC.ROW;
  const R0 = 0.2, R1 = 0.105, RS = 0.034, FLOOR = -2.05, FOV = 0.85, REF = 6.6;
  // camera / studio shared by the background and the reflection pass
  const ENV = `
uniform vec3 uCam, uCF, uCR, uCU;
uniform float uFl, uFloorY, uShadow;
vec3 h12(float r, float g, float b){ return (vec3(r,g,b)+.02)/15.; }          // an exact 12-bit colour (survives the OCS quantiser)
vec3 invAces(vec3 y){ y=clamp(y,0.,.97); vec3 a=2.51-2.43*y, b=.03-.59*y, c=-.14*y; return (-b+sqrt(b*b-4.*a*c))/(2.*a); }
vec3 rayDir(){ vec2 uv=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y); return normalize(uCF*uFl+uCR*uv.x+uCU*uv.y); }
vec3 skyCol(vec3 rd){
  float e=abs(rd.y), az=.62+.38*cos(atan(rd.x,-rd.z)-.5);
  vec3 c=vec3(.004,.006,.014)+vec3(.0,.01,.035)*smoothstep(0.,.9,e);
  c+=vec3(1.,.42,.1)*(exp(-e*24.)*.3+exp(-e*5.)*.055)*az;
  c+=vec3(1.,.8,.5)*exp(-e*110.)*.22*az;
  return c;
}
vec3 floorCol(vec3 ro, vec3 rd){
  float t=(uFloorY-ro.y)/rd.y; vec3 p=ro+rd*t;
  float fre=.05+.95*pow(1.-abs(rd.y),4.);
  vec3 c=skyCol(vec3(rd.x,-rd.y,rd.z))*mix(.16,.9,fre);
  float r2=dot(p.xz,p.xz);
  c+=vec3(.35,.45,.7)*exp(-r2*.035)*.03*(1.-.9*exp(-r2*.2)*uShadow);        // faint overhead pool with the swarm's soft shadow
  return c;
}`;
  const BG = ENV + `
const vec3 COP[16]=vec3[16](vec3(15,13,6),vec3(15,11,4),vec3(15,9,3),vec3(14,7,2),vec3(12,6,2),vec3(11,5,2),vec3(9,4,2),vec3(8,3,2),
  vec3(6,2,3),vec3(5,2,4),vec3(4,1,4),vec3(3,1,5),vec3(2,1,4),vec3(1,0,3),vec3(1,0,2),vec3(0,0,1));
void main(){
  vec3 rd=rayDir(), col;
  if(isOld()>.5){
    vec2 uv=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);
    float ln=(-(uCF.y*uFl)/uCU.y-uv.y)*128.;                                   // PAL lines below the horizon
    col=vec3(0.);
    if(ln>=0.){ int k=int(ln/3.); if(k<16) col=(COP[k]+.02)/15.; }
    else { vec2 g=floor(uv*vec2(128.,128.)); float s=hash21(g); if(s>.9935) col=s>.998?h12(10.,11.,14.):h12(4.,5.,8.); }
    col=invAces(col);
  } else col=rd.y>0.?skyCol(rd):floorCol(uCam,rd);
  fragColor=vec4(col,1.);
}`;
  const VS = `#version 300 es
precision highp float;
uniform mat4 uP, uV;
uniform mat3 uObj;
uniform vec3 uLitDir, uSweep;
uniform vec4 uSync;                 // seq wave height, seq env, hat sweep position, hat env
uniform float uTime, uKick, uStage, uSplit, uWarp, uMorph, uShapeA, uShapeB, uRA, uRB, uMirror, uFloorY, uOldOn, uTextW;
uniform sampler2D uTextPos;
out vec2 vUv; out vec2 vC; out vec2 vScl; out vec3 vCol; out vec3 vVP; out vec3 vDirC; out vec3 vGlow; out float vRad; out float vOld; out float vWY;
const float N=${N}., S1=.26;
#define TAU 6.28318530718
float h1(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
vec3 lc(float g){ return vec3(mod(g,10.),mod(floor(g/10.),10.),floor(g/100.)); }
vec3 warp(vec3 p){ float l=length(p), m=max(abs(p.x),max(abs(p.y),abs(p.z))); return l<1e-4?p:mix(p,p/l*m*1.3,uWarp); }
vec3 lat1(float g){ return warp((lc(g)-4.5)*S1); }
vec3 lat0(float g){ return warp((floor(lc(g)*.5)-2.)*S1*2.); }
const vec3 COPPER=vec3(1.,.40,.07), GOLD=vec3(1.,.76,.30), BLUE=vec3(.03,.30,.95), DEEP=vec3(.0,.10,.42);
vec3 shape(float s, float id){
  if(s<.5){ float y=1.-2.*(id+.5)/N, r=sqrt(1.-y*y), a=id*2.39996323; return vec3(cos(a)*r,y,sin(a)*r)*1.72; }
  if(s<2.5){ float ring=floor(id/24.), k=mod(id,24.), a=ring/(N/24.)*TAU, b=k/24.*TAU;
    vec3 c=vec3((2.+cos(3.*a))*cos(2.*a),(2.+cos(3.*a))*sin(2.*a),-sin(3.*a)*1.3);
    float a2=a+.002; vec3 c2=vec3((2.+cos(3.*a2))*cos(2.*a2),(2.+cos(3.*a2))*sin(2.*a2),-sin(3.*a2)*1.3);
    vec3 T=normalize(c2-c), Nn=normalize(cross(T,vec3(0,0,1))), B=cross(T,Nn);
    return (c+(Nn*cos(b)+B*sin(b))*.42)*.56; }
  if(s<3.5){ float arm=mod(id,3.), rr=pow(h1(id*1.7),.7)*2.5, ang=rr*2.6+arm*TAU/3.+(h1(id*3.1)-.5)*.5/(rr+.3);
    return vec3(cos(ang)*rr,(h1(id*5.3)-.5)*.3*(1.-rr/2.7),sin(ang)*rr); }
  if(s<4.5) return texelFetch(uTextPos,ivec2(int(mod(id,256.)),int(id/256.)),0).xyz;
  return lat1(mod(id,1000.));
}
vec3 tint(float s, float id, vec3 p){
  if(s<.5){ float t=.5+.5*sin(p.y*2.4+atan(p.z,p.x)*2.+uTime*.5); return mix(mix(DEEP,BLUE,smoothstep(0.,.45,t)),mix(COPPER,GOLD,smoothstep(.7,1.,t)),smoothstep(.45,.62,t)); }
  if(s<2.5){ float t=fract(floor(id/24.)/(N/24.)*18.); return mix(BLUE,GOLD,smoothstep(.62,.7,t)*(1.-smoothstep(.92,1.,t))); }
  if(s<3.5){ float r=length(p.xz)/2.5; return mix(mix(vec3(1.,.9,.7),COPPER,smoothstep(.0,.4,r)),BLUE,smoothstep(.35,.9,r)); }
  if(s<4.5) return mix(mix(COPPER,GOLD,smoothstep(-.6,.1,p.y)),vec3(1.,.93,.75),smoothstep(.15,.6,p.y));
  vec3 c=floor(lc(mod(id,1000.))*.5); return mod(c.x+c.y+c.z,2.)<.5?mix(COPPER,GOLD,.25):BLUE;
}
void main(){
  int vid=gl_VertexID; vec2 c=vec2((vid==1||vid==2||vid==4)?1.:-1.,(vid==2||vid==4||vid==5)?1.:-1.);
  float id=float(gl_InstanceID);
  vec3 p; float r; vOld=0.;
  if(uStage<.5){                                             // the lattice: 125 parents, each splitting into 8
    vec3 lcI=lc(id), par=floor(lcI*.5);
    float child=dot(mod(lcI,2.),vec3(1.,2.,4.));
    float e=clamp(uSplit*1.4-h1(dot(par,vec3(1.,5.,25.))*.37)*.4,0.,1.); e=e*e*(3.-2.*e);
    p=mix(lat0(id),lat1(id),e)*(1.+.25*sin(e*3.14159)); r=mix(${R0},${R1},e);
    vOld=mod(par.x+par.y+par.z,2.);
    vCol=vOld<.5?mix(COPPER,GOLD,.25):BLUE;
    if(uSplit<=0.&&child>.5){ gl_Position=vec4(2.,2.,2.,1.); return; }
  } else {
    float m=smoothstep(0.,1.,clamp(uMorph*1.5-h1(id*.77)*.5,0.,1.));
    vec3 A=shape(uShapeA,id), B=shape(uShapeB,id);
    p=mix(A,B,m)+sin(m*3.14159)*normalize(cross(B-A+1e-4,vec3(0,1,0)))*.7;
    float var=.75+.5*h1(id*4.4);
    r=mix(uRA*(uShapeA>5.5?1.:var),uRB*var,m);
    vCol=mix(tint(uShapeA,id,A),tint(uShapeB,id,B),m);
  }
  // sync: every 16th of the sequence lights the slice at its pitch height; every hat sweeps a sparkle through
  float wave=exp(-pow((p.y-uSync.x)*4.5,2.))*uSync.y;
  float spk=exp(-pow((dot(p,uSweep)-uSync.z)*2.6,2.))*uSync.w*step(.72,h1(id*9.7));
  vGlow=(vec3(1.,.8,.45)*wave*.4*(.35+.65*vCol)+vec3(.7,.9,1.)*spk*1.3)*clamp(.05/r-.25,.15,1.);
  vec3 pw=uObj*p*(1.+uKick*.06);
  vec3 cw=vec3(0.);
  vWY=pw.y;
  if(uMirror>.5){ pw.y=2.*uFloorY-pw.y; cw.y=2.*uFloorY; }
  vec4 vp=uV*vec4(pw,1.);
  vDirC=normalize(vp.xyz-(uV*vec4(cw,1.)).xyz+1e-5);
  // sprite size for the 1985 half: no perspective, three sizes picked by depth
  float ro=${R0}*(-vp.z/${REF.toFixed(1)})*(1.+.18*clamp(floor((${REF.toFixed(1)}+vp.z)/.7+.5),-1.,1.));
  float q=uOldOn>.5?max(r,ro):r;
  vScl=vec2(q/r,q/ro); vVP=vp.xyz; vRad=r; vC=c; vUv=c;
  vp.xy+=c*q;
  gl_Position=uP*vp;
}`;
  const FS = ENV + `
uniform mat4 uP;
uniform vec3 uLV, uUpV;
uniform float uMirror, uAO;
in vec2 vC; in vec2 vScl; in vec3 vCol; in vec3 vVP; in vec3 vDirC; in vec3 vGlow; in float vRad; in float vOld; in float vWY;
void main(){
  if(isOld()>.5){                                             // a bob: flat sprite, sprite depth, a handful of colours
    if(uMirror>.5) discard;
    vec2 d=vC*vScl.y; float d2=dot(d,d); if(d2>1.) discard;
    vec4 cp=uP*vec4(vVP,1.); gl_FragDepth=(cp.z/cp.w)*.5+.5;
    float lam=dot(vec3(d,sqrt(1.-d2)),normalize(vec3(-.55,.6,.58)));
    vec3 col;
    if(vOld<.5) col=d2>.8?h12(4.,1.,0.):lam>.74?h12(15.,10.,3.):lam>.3?h12(13.,5.,0.):h12(8.,2.,0.);
    else        col=d2>.8?h12(0.,1.,4.):lam>.74?h12(5.,10.,15.):lam>.3?h12(0.,5.,10.):h12(0.,2.,6.);
    if(length(d-vec2(-.36,.4))<.17) col=h12(14.,14.,14.);
    fragColor=vec4(invAces(col),1.); return;
  }
  vec2 d=vC*vScl.x; float d2=dot(d,d); if(d2>1.) discard;
  vec3 n=vec3(d,sqrt(1.-d2)), vp=vVP+n*vRad;
  vec4 cp=uP*vec4(vp,1.); gl_FragDepth=(cp.z/cp.w)*.5+.5;
  vec3 V=normalize(-vp), h=normalize(uLV+V);
  float dif=max(dot(n,uLV),0.), sp=pow(max(dot(n,h),0.),90.), rim=pow(1.-max(dot(n,V),0.),3.);
  float ao=mix(1.,.3+.7*smoothstep(-.7,.8,dot(n,vDirC)),uAO);            // the side facing the swarm's centre is occluded
  vec3 amb=mix(vec3(.34,.13,.03),vec3(.03,.07,.16),.5+.5*dot(n,uUpV));   // copper bounce from the floor, cool from above
  vec3 col=vCol*(dif*1.2*ao+amb*ao*1.25)+vec3(1.,.95,.85)*sp*2.*ao+rim*mix(vCol,vec3(.35,.55,1.),.5)*.3*ao+vGlow;
  col*=1.+uKick*.25;
  col=mix(col,vec3(.03,.014,.01),1.-exp(-max(-vp.z-7.,0.)*.11));                 // far balls sink into the haze
  if(uMirror>.5){
    float depth=max(uFloorY-(2.*uFloorY-vWY),0.);          // how far the real ball hovers above the floor
    vec3 rd=rayDir();
    col=floorCol(uCam,rd)+col*.62*exp(-depth*.22)*(.6+.4*pow(1.-abs(rd.y),3.));
  }
  fragColor=vec4(col,1.);
}`;
  let prog, bg, vao, textTex;
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const SEQ = [0, 2, 4, 2, 1, 3, 5, 3, 0, 2, 4, 6, 5, 4, 3, 1];          // the tune's 16th sequence (degrees of the chord)
  const BEAM0 = 2 * BAR, BEAM1 = BEAM0 + 1.4, T2 = PAT;                   // beam after two bars; the swarm stage starts with pattern 10
  const SHAPES = [6, 0, 2, 3, 4], TIMES = [0, T2, T2 + 2 * BAR, T2 + 4 * BAR, T2 + 6 * BAR], MORPH = [1, 2.0, 1.7, 1.7, 1.5];

  function makeText() {                                       // AMIGA, set in the demo's own pixel font: every font pixel a clump of balls
    const b = PIX.bitmap('AMIGA', 2), pts = [];
    for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) if (b.m[y * b.w + x]) pts.push([x, y]);
    const a = new Float32Array(N * 4), h = i => { const s = Math.sin(i * 127.1) * 43758.5453; return s - Math.floor(s); }, k = 0.0385;
    for (let i = 0; i < N; i++) {
      const p = pts[(i * 7919) % pts.length];
      a.set([(p[0] + h(i) - b.w / 2) * k, -(p[1] + h(i + 0.5) - b.h / 2) * k, (Math.floor(h(i + 0.25) * 3) - 1) * 0.075, 1], i * 4);
    }
    return G.texture(256, N / 256, { float32: true, nearest: true, data: a });
  }
  function init() {
    prog = G.program(FS, 'vballs', VS); bg = G.program(BG, 'vballs-bg');
    vao = G.gl.createVertexArray(); textTex = makeText();
  }
  const mul3 = (a, b) => { const o = new Array(9); for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) o[c * 3 + r] = a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2]; return o; };
  const nrm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };

  function draw(st, tgt) {
    const gl = G.gl, lt = st.lt, beam = Math.min(1, Math.max(0, (lt - BEAM0) / (BEAM1 - BEAM0)));
    const tt = beam < 1 ? Math.floor(lt * 50) / 50 : lt;      // 50 Hz while any of the picture is still 1990
    // ---- object motion: a fast two-axis tumble that settles into a slow turntable
    const s = Math.min(1, Math.max(0, (tt - 4) / 4)), F = tt < 4 ? tt : 4 + 4 * (s - s * s * s + s * s * s * s / 2);
    let k = 0; while (k + 1 < TIMES.length && lt >= TIMES[k + 1]) k++;
    const stage2 = lt >= T2, A = k === 0 ? 6 : SHAPES[k - 1], B = SHAPES[k], morph = k === 0 ? 1 : Math.min(1, (lt - TIMES[k]) / MORPH[k]);
    const tw = sm(0, 1, B === 4 ? morph : 0), gw = sm(0, 1, B === 3 ? morph : A === 3 ? 1 - morph : 0);
    // ---- camera: locked off for the bobs, then a slow orbit
    const w = sm(BEAM1 - 0.3, BEAM1 + 3.5, lt), a = 0.16 * Math.max(0, lt - BEAM1) * w + Math.sin(lt * 0.21) * 0.25 * w;
    const rad = 6.6 + 0.6 * w, cy = -0.7 + 1.5 * w + Math.sin(lt * 0.17) * 0.25 * w;      // crane up from below the horizon to reveal the floor
    const cam = [Math.sin(a) * rad, cy, Math.cos(a) * rad], tg = [0, 0.35 - 1.45 * w, 0];
    const f = nrm([tg[0] - cam[0], tg[1] - cam[1], tg[2] - cam[2]]), r = nrm([-f[2], 0, f[0]]), u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    const asp = st.W / st.H, P = G.m4.persp(FOV, asp, 0.1, 100), V = G.m4.look(cam, tg);
    let ax = (0.3 + 2 * Math.PI) * F / 6, ay = 0.25 * tt + 0.9 * F;
    const el = Math.atan2(cy - 0.1, rad), face = a + 2 * Math.PI * Math.round((ay - a) / (2 * Math.PI));
    ay += (face - ay) * Math.max(tw, gw); ax += (2 * Math.PI + 0.95 - ax) * gw; ax += (2 * Math.PI - el - ax) * tw;
    const cxr = Math.cos(ax), sxr = Math.sin(ax), cyr = Math.cos(ay), syr = Math.sin(ay);
    const sp = 0.45 * (lt - TIMES[3]) * gw, cs = Math.cos(sp), ss = Math.sin(sp);                 // the galaxy turns about its own axis
    const obj = mul3(mul3([cyr, 0, -syr, 0, 1, 0, syr, 0, cyr], [1, 0, 0, 0, cxr, sxr, 0, -sxr, cxr]), [cs, 0, -ss, 0, 1, 0, ss, 0, cs]);      // Ry * Rx, column-major
    // ---- sync
    const row = Math.floor((st.t % BAR) / ROW + 1e-4) & 15, hs = MUSIC.since('hat', st.t), hc = MUSIC.count('hat', st.t), ha = hc * 2.4;
    const sync = [-1.5 + 3 * SEQ[row] / 6, Math.exp(-(st.t % ROW) * 12) * (stage2 ? 1 : 0.5), -2.4 + hs * 20, Math.exp(-hs * 7)];
    const Lw = nrm([-0.55 * r[0] - 0.5 * f[0], 0.75, -0.55 * r[2] - 0.5 * f[2]]),      // the key light rides with the camera
       v3 = (m, d) => [m[0] * d[0] + m[4] * d[1] + m[8] * d[2], m[1] * d[0] + m[5] * d[1] + m[9] * d[2], m[2] * d[0] + m[6] * d[1] + m[10] * d[2]];
    const env = { uCam: cam, uCF: f, uCR: r, uCU: u, uFl: 1 / Math.tan(FOV / 2), uFloorY: FLOOR, uShadow: 1, uBeam: beam };
    G.draw(bg, env, tgt);
    const split = sm(3 * BAR, 3 * BAR + 1.3, lt);
    const U = { ...env, uP: P, uV: V, uObj: obj, uStage: stage2 ? 1 : 0, uSplit: split,
      uWarp: stage2 ? 0 : sm(BAR, BAR + 1.5, lt) * (1 - sm(3 * BAR, 3 * BAR + 1.2, lt)),
      uMorph: morph, uShapeA: A, uShapeB: B, uRA: A === 6 ? R1 : RS, uRB: RS * (1 - 0.42 * tw), uTextPos: textTex, uTextW: tw,
      uAO: 1 - 0.85 * tw, uSync: sync, uSweep: nrm([Math.cos(ha), 0.5 * Math.sin(ha * 1.3), Math.sin(ha)]), uOldOn: beam < 1 ? 1 : 0, uTime: tt };
    const count = stage2 ? N : 1000;
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.bindVertexArray(vao);
    if (beam > 0) {                                           // the mirror image in the floor (only exists above the beam)
      G.use(prog, { ...U, uMirror: 1, uLV: v3(V, [Lw[0], -Lw[1], Lw[2]]), uUpV: v3(V, [0, -1, 0]) }, tgt);
      gl.clear(gl.DEPTH_BUFFER_BIT); gl.bindVertexArray(vao); gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
    }
    G.use(prog, { ...U, uMirror: 0, uLV: v3(V, Lw), uUpV: v3(V, [0, 1, 0]) }, tgt);
    gl.clear(gl.DEPTH_BUFFER_BIT); gl.bindVertexArray(vao); gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
    gl.disable(gl.DEPTH_TEST);
    const out = sm(BEAM1 - 0.2, BEAM1 + 1.3, lt);
    return { beam, lines: beam < 1 ? 256 : undefined, ocs: 1, crt: 1 - out, fa: 1.25 + (asp - 1.25) * sm(BEAM1, BEAM1 + 1.6, lt), scan: 256,
      bloom: 0.15 + 0.5 * beam, thresh: 2.6 - 1.75 * beam, expo: 1, aberr: 0.15 * (1 - out), grain: 0.02, vig: 0.35 + 0.25 * out, fade: 1 };
  }

  (window.SCENES = window.SCENES || []).push({
    name: 'Vector Balls', from: 9, to: 12, init, draw, tube: 0.6,
    caps: [{ at: PAT + 2.4, len: 4.2, title: 'VECTOR BALLS', sub: 'ONCE THERE WERE A HUNDRED' }],
  });
})();
