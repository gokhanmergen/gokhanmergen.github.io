'use strict';
// =====================================================================
//  PART 4: GLENZ -> GLASS. THEN: a glenz vector, the tumbling faceted
//  solid with translucent white and blue faces whose back shows through
//  its front, over three copper bars. The raster beam passes and it is
//  glass: an analytically ray traced convex polyhedron (26 half-spaces)
//  with refraction, dispersion (R, G and B are traced separately),
//  internal bounces and absorption, in a dark studio whose light strips
//  are the copper bars reborn. The flute re-cuts the crystal on each downbeat, one slow cut at a time
//  (octahedron -> truncated -> cuboctahedron -> ...), every bell glints. The glenz gets all of pattern 12,
//  and the beam that ends it is refracted by the crystal: seen through the glass it bends at every facet
//  and splits into its colours.
// =====================================================================
(() => {
  const PAT = MUSIC.PAT, BAR = MUSIC.BAR, ROW = MUSIC.ROW, FOV = 0.72, FLOOR = -1.8, RW = 16;
  const FS = `
uniform vec3 uCam, uCF, uCR, uCU, uD, uFam, uCtr;
uniform mat3 uRot;
uniform float uFl, uFloorY, uLit;
uniform vec4 uBarY;                  // 1985: screen heights of the copper bars (the same places the light strips will be)
uniform vec3 uGl[2];                 // bell glints: screen position, intensity
const float RW=${RW}., K3=.57735027, K2=.70710678;
const vec3 PN[26]=vec3[26](vec3(1,0,0),vec3(-1,0,0),vec3(0,1,0),vec3(0,-1,0),vec3(0,0,1),vec3(0,0,-1),
  vec3(K3,K3,K3),vec3(-K3,K3,K3),vec3(K3,-K3,K3),vec3(K3,K3,-K3),vec3(-K3,-K3,K3),vec3(-K3,K3,-K3),vec3(K3,-K3,-K3),vec3(-K3,-K3,-K3),
  vec3(K2,K2,0),vec3(-K2,K2,0),vec3(K2,-K2,0),vec3(-K2,-K2,0),vec3(K2,0,K2),vec3(-K2,0,K2),vec3(K2,0,-K2),vec3(-K2,0,-K2),
  vec3(0,K2,K2),vec3(0,-K2,K2),vec3(0,K2,-K2),vec3(0,-K2,-K2));
const vec3 SC[4]=vec3[4](vec3(1.,.38,.07)*7.,vec3(1.,.72,.26)*6.,vec3(.06,.36,1.)*5.5,vec3(1.,.92,.8)*7.);   // strip colours
const vec4 SH=vec4(.6,2.3,4.1,-.85), SW=vec4(.34,.25,.3,.065);                                                // heights, half widths
float pd(int i){ return i<6?uD.x:i<14?uD.y:uD.z; }
vec3 h12(vec3 c){ return (floor(clamp(c,0.,14.)+.5)+.02)/15.; }               // snap to an exact 12-bit colour
vec3 invAces(vec3 y){ y=clamp(y,0.,.97); vec3 a=2.51-2.43*y, b=.03-.59*y, c=-.14*y; return (-b+sqrt(b*b-4.*a*c))/(2.*a); }
// convex polyhedron = intersection of half-spaces; t2 is the runner-up entry (for edge antialiasing)
bool hull(vec3 ro, vec3 rd, out float tN, out float tF, out float t2, out int iN, out int iF){
  tN=-1e9; tF=1e9; t2=-1e9; iN=0; iF=0;
  for(int i=0;i<26;i++){
    float den=dot(PN[i],rd), dist=pd(i)-dot(PN[i],ro);
    if(den<-1e-6){ float t=dist/den; if(t>tN){ t2=tN; tN=t; iN=i; } else if(t>t2) t2=t; }
    else if(den>1e-6){ float t=dist/den; if(t<tF){ tF=t; iF=i; } }
    else if(dist<0.) return false;
  }
  return tN<tF&&tF>0.;
}
float exitT(vec3 ro, vec3 rd, out vec3 n){
  float tF=1e9; n=vec3(0,1,0);
  for(int i=0;i<26;i++){ float den=dot(PN[i],rd); if(den>1e-5){ float t=(pd(i)-dot(PN[i],ro))/den; if(t<tF){ tF=t; n=PN[i]; } } }
  return max(tF,0.);
}
// ---- the studio: a round dark room ringed by long light strips, a softbox overhead, a black stone floor
vec3 walls(vec3 ro, vec3 rd){
  vec3 c=vec3(.006,.008,.016)*(1.+1.5*smoothstep(-2.,6.,ro.y+rd.y*RW));
  vec2 o=ro.xz, d=rd.xz; float a=dot(d,d);
  if(a<1e-5) return c+vec3(.5,.62,.9)*step(0.,rd.y);
  float b=dot(o,d), t=(-b+sqrt(max(b*b-a*(dot(o,o)-RW*RW),0.)))/a;
  float y=ro.y+t*rd.y; vec2 h=o+d*t; float az=atan(h.y,h.x);
  if(y>9.5) return c+vec3(.5,.62,.9)*smoothstep(.5,.95,rd.y);
  for(int k=0;k<4;k++){
    float dy=abs(y-SH[k]), seg=smoothstep(-.42,-.3,cos(az*(k==1?3.:2.)+float(k)*1.9+.6));
    c+=SC[k]*(smoothstep(SW[k],SW[k]*.55,dy)+exp(-dy*1.1)*.035)*seg*uLit;
  }
  return c;
}
vec3 floorDif(vec2 q){ float r2=dot(q,q); return vec3(.02,.022,.03)*(.35+1.3*exp(-r2*.07))*(1.-.78*exp(-r2*.5)); }
// NOTE on structure: the Metal shader compiler inlines every call, so each heavy function below has exactly ONE
// call site (inside a loop where several rays are needed). Calling them from several places multiplies the
// compiled size and once took three minutes to build.
vec3 env(vec3 ro, vec3 rd){
  float fre=1.; vec3 add=vec3(0.);
  if(rd.y<0.){ float t=(uFloorY-ro.y)/rd.y; vec3 p=ro+rd*t;
    if(dot(p.xz,p.xz)<RW*RW){ fre=.07+.93*pow(1.-abs(rd.y),5.); add=floorDif(p.xz-uCtr.xz); ro=p; rd=vec3(rd.x,-rd.y,rd.z); } }
  return walls(ro,rd)*fre+add;
}
// ---- light inside the crystal: follow one wavelength through up to three facets
vec3 through(vec3 p, vec3 d, float ior, out vec3 ex){
  vec3 acc=vec3(0.); float w=1., path=0.; bool out_=false; ex=d;
  for(int b=0;b<4;b++){
    vec3 o=d; float wt=w*.6;                                    // b==3: what is still bouncing around leaves here
    if(b<3){
      vec3 m; float t=exitT(p,d,m); p+=d*t; path+=t;
      o=refract(d,-m,ior); wt=0.;
      if(dot(o,o)>.5){ float f=.04+.96*pow(1.-clamp(dot(o,m),0.,1.),5.); wt=w*(1.-f); w*=f; if(!out_){ ex=o; out_=true; } }
      d=reflect(d,m);
    }
    if(wt>0.) acc+=wt*env(uRot*p+uCtr,uRot*o);
    if(w<.04) break;
  }
  return acc*exp(-path*vec3(.20,.085,.03));                    // thick glass goes faintly Workbench blue
}
// where a world direction lies on the screen (0 bottom .. 1 top), for the beam seen through the glass. Squeezed
// towards the middle (a weaker lens than the real crystal), so that facets looking far above or below the screen are
// still crossed by the line during its sweep rather than all switching when it starts or when it ends.
float scrY(vec3 w){ float z=dot(w,uCF); return .5+.55*clamp(z>1e-3?.5*uFl*dot(w,uCU)/z:sign(dot(w,uCU))*9.,-.9,.9); }
vec3 glass(vec3 roO, vec3 rdO, float tN, int iN, bool hq, out vec3 fy){
  vec3 n=PN[iN], p=roO+rdO*tN;
  float f=.04+.96*pow(1.-clamp(-dot(rdO,n),0.,1.),5.);
  vec3 tr=vec3(0.), ex;
  for(int c=0;c<3;c++){
    float ior=hq?(c==0?1.468:c==1?1.48:1.494):1.48;
    vec3 t=through(p,refract(rdO,n,1./ior),ior,ex);
    fy[c]=scrY(uRot*ex);
    if(hq) tr[c]=t[c]; else { tr=t; fy=vec3(fy[0]); break; }
  }
  // the mirror image on the facet: the room only (cheap walls+floor lookup, no second crystal)
  vec3 rr=uRot*reflect(rdO,n), rp=uRot*p+uCtr, col=vec3(.0025,.0025,.004);
  { float y=rp.y+rr.y*RW*.9; for(int k=0;k<4;k++){ float dy=abs(y-SH[k]); col+=SC[k]*(smoothstep(SW[k],SW[k]*.55,dy)+exp(-dy*1.5)*.014)*.75*uLit; } }
  return col*f+tr*(1.-f);
}
float cls(int i, vec3 n){ return i<6?2.:i<14?(n.x*n.y*n.z>0.?0.:1.):i<18?3.:i<22?0.:1.; }
// ------------------------------- 1991 -------------------------------
vec3 old91(vec2 uv, bool hit, int iN, int iF){
  vec3 col=vec3(0.);
  float ln=uv.y*128.;
  for(int k=0;k<4;k++){ if(k==3) continue; float dl=abs(floor(ln)+.5-floor(uBarY[k]*128.))/7.; if(dl<1.) col=SC[k]/7.5*15.*(1.-dl*dl*.9)*(k==2?1.5:1.); }
  vec2 g=floor(uv*128.); float s=hash21(g); if(dot(col,col)<.01&&s>.994) col=vec3(5.,6.,9.);
  if(hit){
    float cf=cls(iN,PN[iN]), cb=cls(iF,PN[iF]);
    vec3 fr=cf<.5?vec3(15.,15.,15.):cf<1.5?vec3(1.,5.,15.):cf<2.5?vec3(15.,8.,1.):vec3(7.,11.,15.);
    vec3 bk=cb<.5?vec3(9.,10.,12.):cb<1.5?vec3(0.,2.,8.):cb<2.5?vec3(9.,4.,1.):vec3(2.,5.,9.);
    col=mix(bk,fr,cf<.5?.58:cf<1.5?.5:.6);
  }
  return invAces(h12(col));
}
float gOwn=1.;   // alpha for the post chain: 1 = the straight beam decides this pixel; below .75 = decided here (o.mask)
vec3 shade(vec2 fc, out float edge){
  vec2 uv=(fc-.5*uRes)/(.5*uRes.y);
  vec3 rd=normalize(uCF*uFl+uCR*uv.x+uCU*uv.y), ro=uCam;
  vec3 roO=(ro-uCtr)*uRot, rdO=rd*uRot;
  float tN,tF,t2; int iN,iF; bool hit=hull(roO,rdO,tN,tF,t2,iN,iF);
  float px=3.5*tN/(uRes.y*uFl); edge=0.;
  bool split=hit&&uBeam>0.&&uBeam<1.;                        // the beam is on screen and this pixel looks through the glass
  vec3 oc=vec3(0.);
  if(isOld()>.5||split){ oc=old91(uv,hit,iN,iF); if(!split) return oc; }
  // ------------------------------- now -------------------------------
  vec3 gro=roO, grd=rdO, wro=ro, wrd=rd, add=vec3(0.); float gt=tN, wgt=1.; int gi=iN; bool hq=true, doGlass=hit;
  if(hit) edge=step(min(tN-t2,tF-tN),px);
  else {
  edge=step(tN-tF,px)*step(tN,1e8)*step(0.,tF);
  if(rd.y<0.){
    float t=(uFloorY-ro.y)/rd.y; vec3 p=ro+rd*t; vec2 q=p.xz-uCtr.xz; float r2=dot(q,q);
    if(dot(p.xz,p.xz)<RW*RW){
      vec3 R=vec3(rd.x,-rd.y,rd.z), dif=floorDif(q);
      float fre=.07+.93*pow(1.-abs(rd.y),5.);
      wro=p; wrd=R; wgt=fre;
      vec3 pO=(p-uCtr)*uRot, RO=R*uRot;
      if(hull(pO,RO,tN,tF,t2,iN,iF)&&tN>0.){ doGlass=true; hq=false; gro=pO; grd=RO; gt=tN; gi=iN; }   // the crystal mirrored in the stone
      if(r2<14.){                                                         // faked caustics: each lit facet throws a soft, colour-fringed patch
        vec3 ca=vec3(0.);
        for(int i=0;i<26;i++){
          float w=i<6?uFam.x:i<14?uFam.y:uFam.z; if(w<.02) continue;
          vec3 n=uRot*PN[i]; float dn=smoothstep(.6,-.3,n.y)*w;
          vec2 al=normalize(n.xz+vec2(1e-4,0.)), o=n.xz*(1.+.55*(1.-n.y));
          vec3 g; for(int c=0;c<3;c++){ vec2 e=q-o*(.92+.08*float(c)); float u=dot(e,al), v=dot(e,vec2(-al.y,al.x)); g[c]=exp(-(u*u*4.5+v*v*13.)); }
          ca+=g*dn;
        }
        dif+=ca*ca*vec3(1.,.82,.6)*.11*uLit+vec3(1.,.8,.55)*exp(-r2*1.6)*.05;
      }
      add=dif;
    }
  }
  }
  vec3 fy=vec3(0.);
  vec3 c=doGlass?glass(gro,grd,gt,gi,hq,fy):walls(wro,wrd);
  c=c*wgt+add;
  if(split){
    // Through the crystal the beam is a distant line seen through a prism: every wavelength left the glass in its own
    // direction (fy: where that direction is on screen), so the line bends at each facet and splits into colours,
    // and each channel shows 1991 or now depending on which side of the beam it ended up looking at.
    vec3 by=vec3(1.-uBeam*1.04+.02), o3=step(fy,by), d=fy-by;
    c=mix(c,oc,o3);
    c+=vec3(.75,.9,1.)*(exp(-abs(d)*900.)+.35*exp(-abs(d)*90.)+.12*exp(-max(d,0.)*14.)*step(0.,d))*4.;
    gOwn=.5*o3.g;
  }
  return c;
}
void main(){
  const vec2 OFF[4]=vec2[4](vec2(0.),vec2(.38,.12),vec2(-.12,.38),vec2(-.38,-.12));
  float e=0., n=0.; vec3 col=vec3(0.);
  for(int s=0;s<4;s++){                                                  // 4x supersampling only along facet edges and the silhouette
    float d; col+=shade(gl_FragCoord.xy+OFF[s],d); n+=1.;
    if(s==0) e=d; if(e<.5) break;
  }
  col/=n;
  if(isOld()<.5){
    vec2 uv=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);
    for(int i=0;i<2;i++){ vec2 q=uv-uGl[i].xy;
      float s=exp(-length(q)*70.)+.55*(exp(-abs(q.x)*260.-abs(q.y)*16.)+exp(-abs(q.y)*260.-abs(q.x)*16.));
      col+=vec3(1.,.9,.72)*s*uGl[i].z*4.; }
  }
  fragColor=vec4(col,gOwn);
}`;
  // a, b, c: plane distances of the cube / octahedron / edge families; then how much each family really shows (for the caustics)
  const SOLID = {
    O: [1.473, 0.85, 1.042, 0, 1, 0], TO: [1.05, 0.909, 1.115, 1, 1, 0], CO: [1.0, 1.1547, 1.415, 1, 1, 0],
    RCO: [1.15, 1.214, 1.15, 1, 1, 1], RD: [1.415, 1.2255, 1.0, 0, 0, 1], C: [0.95, 1.646, 1.344, 1, 0, 0],
  };
  const CYCLE = ['O', 'TO', 'CO', 'RCO', 'RD', 'RCO', 'CO', 'C', 'CO', 'TO'];
  // Re-cuts: the flute plays up to four notes a second, far faster than a solid can be re-cut. A note starts a new cut
  // only if the previous one has had CUT_GAP to finish (in practice: the flute note on each downbeat), and every cut
  // eases over MORPH seconds, so a morph is never interrupted and the shape can never snap.
  const CUT_GAP = 1.8, MORPH = 1.3;
  let prog, cuts = null;
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const sm5 = x => { const k = Math.min(1, Math.max(0, x)); return k * k * k * (k * (k * 6 - 15) + 10); };   // smootherstep: no jolt at either end
  const nrm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
  const mul3 = (a, b) => { const o = new Array(9); for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) o[c * 3 + r] = a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2]; return o; };
  const h1 = x => { const s = Math.sin(x * 127.1 + 3.3) * 43758.5453; return s - Math.floor(s); };
  const BEAM0 = PAT, BEAM1 = BEAM0 + 1.4;                        // the glenz has all of pattern 12; the beam on 13
  const beamAt = lt => Math.min(1, Math.max(0, (lt - BEAM0) / (BEAM1 - BEAM0)));
  const glint = new Float32Array(6);

  function draw(st, tgt) {
    const lt = st.lt, t0 = st.t - lt, beam = beamAt(lt);
    const tt = beam < 1 ? Math.floor(lt * 50) / 50 : lt;
    // ---- which solid: a flute note re-cuts the crystal once the previous cut has settled
    if (!cuts) {
      cuts = [];
      for (const n of MUSIC.SYNC.lead) if (n >= t0 - 0.01 && n < t0 + st.dur && (!cuts.length || n - cuts[cuts.length - 1] >= CUT_GAP)) cuts.push(n);
    }
    let j = 0; while (j < cuts.length && cuts[j] <= st.t) j++;   // cuts so far; cut #1 just shows the first solid
    const k = Math.max(0, j - 1), mf = sm5((st.t - (cuts[k] ?? st.t)) / MORPH);
    const A = SOLID[CYCLE[(k + CYCLE.length - 1) % CYCLE.length]], B = SOLID[CYCLE[k % CYCLE.length]], grow = sm(0, 0.45, lt) * (1 + 0.02 * st.kick);
    const S = k === 0 ? B : A.map((a, i) => a + (B[i] - a) * mf);
    // ---- tumble that calms down, camera that starts to orbit once the picture is modern
    const s = Math.min(1, Math.max(0, (tt - 4) / 5)), F = tt < 4 ? tt : 4 + 5 * (s - s * s * s + s * s * s * s / 2);
    const ax = 0.2 * tt + 0.75 * F, ay = 0.16 * tt + 1.05 * F, az = 0.5 * F + 0.07 * tt;
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay), cz = Math.cos(az), sz = Math.sin(az);
    const rot = mul3(mul3([cy, 0, -sy, 0, 1, 0, sy, 0, cy], [1, 0, 0, 0, cx, sx, 0, -sx, cx]), [cz, sz, 0, -sz, cz, 0, 0, 0, 1]);
    const w = sm(BEAM1 - 0.2, BEAM1 + 4, lt), a = 0.11 * Math.max(0, lt - BEAM1) * w;
    const rad = 6.3 - 0.9 * w, cam = [Math.sin(a) * rad, 0.45 + 0.75 * w + 0.25 * Math.sin(lt * 0.19) * w, Math.cos(a) * rad], tg = [0, 0.05 - 0.3 * w, 0];
    const f = nrm([tg[0] - cam[0], tg[1] - cam[1], tg[2] - cam[2]]), r = nrm([-f[2], 0, f[0]]), u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    const fl = 1 / Math.tan(FOV / 2), ctr = [0, 0.07 * Math.sin(lt * 0.8) * w, 0];
    const proj = p => { const d = [p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]], z = d[0] * f[0] + d[1] * f[1] + d[2] * f[2]; return [(d[0] * r[0] + d[2] * r[2]) / z * fl, (d[0] * u[0] + d[1] * u[1] + d[2] * u[2]) / z * fl]; };
    const bars = [0.6, 2.3, 4.1, -0.85].map(h => proj([0, h, -RW])[1]);
    // ---- bells (one every two rows): a glint on a corner of the crystal
    const bi = Math.floor(lt / (2 * ROW));
    for (let j = 0; j < 2; j++) {
      const i = bi - j, age = lt - i * 2 * ROW, d = nrm([h1(i) - 0.5, h1(i + 0.3) - 0.5, h1(i + 0.7) - 0.5]).map(x => x * 1.25);
      const pw = [rot[0] * d[0] + rot[3] * d[1] + rot[6] * d[2] + ctr[0], rot[1] * d[0] + rot[4] * d[1] + rot[7] * d[2] + ctr[1], rot[2] * d[0] + rot[5] * d[1] + rot[8] * d[2] + ctr[2]];
      const q = proj(pw); glint.set([q[0], q[1], i < 0 ? 0 : Math.exp(-age * 5.5) * Math.min(1, age * 40)], j * 3);
    }
    G.draw(prog, { uCam: cam, uCF: f, uCR: r, uCU: u, uFl: fl, uFloorY: FLOOR, uRot: rot, uCtr: ctr, uD: S.slice(0, 3).map(x => x * grow), uFam: S.slice(3),
      uBarY: bars, uGl: glint, uLit: 1 + 0.22 * st.kick + 0.1 * st.snare, uBeam: beam }, tgt);
    const out = sm(BEAM1 - 0.2, BEAM1 + 1.3, lt), asp = st.W / st.H;
    return { beam, mask: 1, lines: beam < 1 ? 256 : undefined, ocs: 1, crt: 1 - out, fa: 1.25 + (asp - 1.25) * sm(BEAM1, BEAM1 + 1.6, lt), scan: 256,
      bloom: 0.15 + 0.45 * beam, thresh: 2.6 - 1.6 * beam, expo: 1, aberr: 0.15 * (1 - out), grain: 0.02, vig: 0.35 + 0.2 * out,
      fade: Math.min(1, lt / 0.08, (st.dur - lt) / 0.12) };
  }

  (window.SCENES = window.SCENES || []).push({
    name: 'Glenz', from: 12, to: 15, draw, tube: 0.6, beamAt, paula: true, init() { prog = G.program(FS, 'glenz'); },
    caps: [{ at: BEAM1 + 2.2, len: 4.2, title: 'GLENZ', sub: 'IT ALWAYS WANTED TO BE GLASS' }],
  });
})();
