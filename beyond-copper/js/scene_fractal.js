'use strict';
// =====================================================================
//  PART 6: FRACTAL DREAMS - Disk 1's climax, one equation three ways.
//   THEN: it opens inside the tunnel the last part ended in: the same
//         tiles still rushing outward, but their vanishing point is now
//         the Mandelbrot set and the rings bend to its equipotentials.
//         Ring by ring from the outside in, the tiles drain into the set
//         at 320x256 in 32 colours with real colour cycling (palette
//         rotation), 40 iterations, slow zoom.
//   BEAM: the same view, smooth-coloured, distance-estimated, deep zoom
//         into seahorse valley, then a whoosh back out while the set
//         gains relief ...
//   ... and lifts into 3D: a Mandelbulb whose equatorial slice IS the
//         Mandelbrot set (z-up triplex), power 2 -> 8, singing the lead.
//   Finally a dive into an infinite Menger sponge with kick/bell pulses.
// =====================================================================
(() => {
  const PAL32 = [0x000, 0x100, 0x210, 0x320, 0x530, 0x740, 0x950, 0xB60, 0xD70, 0xF80, 0xF93, 0xFB5, 0xFC7, 0xFDA, 0xFEC, 0xFFF,
    0xDEF, 0xBDF, 0x9CF, 0x7AE, 0x58D, 0x36C, 0x25B, 0x05A, 0x049, 0x038, 0x027, 0x016, 0x015, 0x004, 0x003, 0x001];
  const v3 = h => `vec3(${(((h >> 8) & 15) / 15).toFixed(4)},${(((h >> 4) & 15) / 15).toFixed(4)},${((h & 15) / 15).toFixed(4)})`;
  const INV = `vec3 invAces(vec3 y){ y=clamp(y,0.,.97); vec3 a=2.51-2.43*y, b=.03-.59*y, c=-.14*y; return (-b+sqrt(b*b-4.*a*c))/(2.*a); }`;

  const MANDEL = `
const vec3 PAL[32]=vec3[32](${PAL32.map(v3).join(',')});
uniform vec2 uC; uniform float uS, uCyc, uEmb, uIt, uBand, uFlow, uDrain, uRoll;
${INV}
${window.TUNNEL_TILE || ''}
float bayer4(vec2 p){ ivec2 i=ivec2(mod(p,4.)); int k=i.y*4+i.x;
  const float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return (m[k]+.5)/16.; }
// The tunnel the picture arrives through, still running. The outside of the set is a tunnel in disguise: the smooth
// escape count is the depth (its level lines start as circles and bend to the set further in) and the 12 tiles
// around are sectors of the screen, as they were in the tunnel. The same tile and the same 16 colours.
// mu below uDrain: that ring has already drained into the plain colour-cycled bands.
bool arrive(vec2 uv, vec2 c, out vec3 col){
  vec2 w=vec2(0.); float m=0.;
  for(int i=0;i<64;i++){ w=vec2(w.x*w.x-w.y*w.y,2.*w.x*w.y)+c; if(dot(w,w)>1e4) break; m++; }
  if(m>=64.) return false;
  float mu=m+1.-log2(log(dot(w,w))*.5/log(100.));
  if(mu<uDrain+1.5*bayer4(floor(gl_FragCoord.xy/(uRes.y/256.)))) return false;
  vec2 q=rot(uRoll)*uv;
  vec3 tt=tileTex(vec2(-(mu+uFlow)*32.,(atan(q.y,q.x)/TAU*12.+.5)*32.));
  float dark=floor(smoothstep(5.,16.,mu)*8.);                           // deeper rings sink into the dark, as in the tunnel
  col=palC(tt.x-dark,tt.y)*step(dark,tt.x+.5);
  return true;
}
vec3 palS(float x){ x=mod(x,32.); float i=floor(x), f=x-i; vec3 a=PAL[int(i)], b=PAL[int(mod(i+1.,32.))]; return mix(a*a,b*b,f*f*(3.-2.*f)); }
vec3 shadeM(vec2 c){
  vec2 z=vec2(0.), dz=vec2(0.); float n=0., trap=1e9; int N=int(uIt); bool esc=false;
  for(int i=0;i<420;i++){
    if(i>=N) break;
    dz=2.*vec2(z.x*dz.x-z.y*dz.y,z.x*dz.y+z.y*dz.x)+vec2(1.,0.);
    z=vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c; trap=min(trap,dot(z,z));
    if(dot(z,z)>256.){ esc=true; break; } n++;
  }
  vec3 solid=vec3(.55,.2,.05);                                           // the copper the set will be made of when it rises
  if(!esc) return mix(vec3(.0,.004,.012)+vec3(.5,.22,.05)*exp(-trap*9.)*.05,solid*.5,uEmb);
  float m2=dot(z,z), sn=n-log2(log2(m2))+4.;
  vec3 col=palS(sn*uBand+uCyc);
  float d=.5*sqrt(m2/max(dot(dz,dz),1e-20))*log(m2), dpx=d/(2.*uS/uRes.y);
  vec2 u=vec2(z.x*dz.x+z.y*dz.y,z.y*dz.x-z.x*dz.y); u/=max(length(u),1e-9);  // direction to the set = a free normal map
  float lit=(dot(u,normalize(vec2(-.6,.8)))+1.4)/2.4;
  col*=mix(1.,.35+1.1*lit,.35+.65*uEmb);
  col+=vec3(1.,.72,.3)*exp(-dpx*.55)*.9;                                 // filaments
  col=mix(col,vec3(.004,.008,.022)+col*.03+solid*exp(-dpx*.14)*.4,uEmb*.95);
  return col;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  if(isOld()>.5){
    vec2 c=uC+uv*2.*uS, z=vec2(0.); int n=0;
    for(int i=0;i<40;i++){ z=vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c; if(dot(z,z)>4.) break; n++; }
    vec3 col=n>=40?vec3(0.):PAL[(n+int(uCyc))&31], tc;
    if(uDrain<60.&&arrive(uv,c,tc)) col=tc;
    fragColor=vec4(invAces(col),1.); return;
  }
  vec3 acc=vec3(0.); float px=2.*uS/uRes.y;
  acc+=shadeM(uC+uv*2.*uS+px*vec2(.125,.375)); acc+=shadeM(uC+uv*2.*uS+px*vec2(-.375,.125));
  acc+=shadeM(uC+uv*2.*uS+px*vec2(.375,-.125)); acc+=shadeM(uC+uv*2.*uS+px*vec2(-.125,-.375));
  fragColor=vec4(acc*.25,1.);
}`;

  const BULB = `
uniform vec3 uCam, uTgt, uUp; uniform float uPow, uIter, uRise;
float bulb(vec3 p, out vec4 trap){
  vec3 w=p; float m=dot(w,w), dz=1.; trap=vec4(abs(w),m); int N=int(uIter);
  for(int i=0;i<12;i++){
    if(i>=N) break;
    dz=uPow*pow(m,(uPow-1.)*.5)*dz+1.;
    float r=sqrt(m), th=uPow*asin(clamp(w.z/r,-1.,1.)), ph=uPow*atan(w.y,w.x);
    w=p+pow(r,uPow)*vec3(cos(th)*cos(ph),cos(th)*sin(ph),sin(th));
    trap=min(trap,vec4(abs(w),m));
    m=dot(w,w); if(m>256.) break;
  }
  return .25*log(m)*sqrt(m)/dz;
}
float map(vec3 p){ vec4 t; p.z/=uRise; return bulb(p,t)*min(uRise,1.); }
vec3 nrm(vec3 p, float e){ vec2 h=vec2(e,0.); return normalize(vec3(map(p+h.xyy)-map(p-h.xyy),map(p+h.yxy)-map(p-h.yxy),map(p+h.yyx)-map(p-h.yyx))); }
float shadow(vec3 ro, vec3 rd){ float r=1., t=.012; for(int i=0;i<26;i++){ float h=map(ro+rd*t); r=min(r,9.*h/t); t+=clamp(h,.012,.2); if(r<.01||t>2.6) break; } return clamp(r,0.,1.); }
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 ro=uCam, f=normalize(uTgt-ro), r=normalize(cross(f,uUp)), u=cross(r,f);
  vec3 rd=normalize(f*1.45+uv.x*r+uv.y*u);
  // ground-less studio: a deep blue void with a soft copper halo breathing behind the object
  float halo=exp(-dot(uv,uv)*3.2);
  vec3 col=vec3(.004,.008,.022)+vec3(.02,.04,.1)*halo+vec3(.5,.2,.05)*halo*halo*(.05+.07*uKick);
  float b=dot(ro,rd), c=dot(ro,ro)-4.4, h=b*b-c, glow=0.;
  if(h>0.){
    float t=max(-b-sqrt(h),0.), tmax=-b+sqrt(h), st=0.; bool hit=false;
    for(int i=0;i<110;i++){ float d=map(ro+rd*t); st++; if(d<.0005*t){ hit=true; break; } t+=d; if(t>tmax) break; }
    glow=st/110.;
    if(hit){
      vec3 p=ro+rd*t; vec4 trap; vec3 q=p; q.z/=uRise; bulb(q,trap); vec3 n=nrm(p,.0005*t);
      vec3 L=normalize(r*-.55+u*.65-f*.5);                                   // key light rides with the camera, upper left
      vec3 alb=mix(vec3(1.,.4,.09),vec3(.06,.33,.95),smoothstep(.2,.85,trap.x));
      alb=mix(alb,vec3(1.,.82,.5),smoothstep(.3,.95,trap.z)*.45);
      alb=mix(alb,vec3(1.,.93,.8),clamp(pow(trap.w,4.),0.,1.)*.3);
      alb=mix(vec3(.75,.27,.065),alb,smoothstep(2.3,5.,uPow));                 // it rises as the plain copper solid of the 2D set
      float occ=clamp(pow(clamp(trap.w,0.,1.),.7)*1.4,0.,1.)*(1.-glow*.55);
      float dif=max(dot(n,L),0.)*shadow(p+n*.003,L);
      float fre=pow(1.-max(dot(n,-rd),0.),4.), sp=pow(max(dot(reflect(rd,n),L),0.),34.);
      col=alb*(dif*1.7+occ*vec3(.07,.1,.24)+max(-n.z,0.)*vec3(.0,.03,.09))+sp*dif*1.3+fre*vec3(.1,.3,1.)*occ*.8;
      col+=vec3(1.,.42,.1)*alb*(1.-occ)*uLead*1.6;                           // the melody glows in the crevices
      col+=alb*vec3(1.,.5,.2)*uKick*.16*occ;
    }
  }
  col+=vec3(.08,.25,1.)*pow(glow,2.2)*.8;
  fragColor=vec4(col,1.);
}`;

  const MENGER = `
uniform float uZ, uRoll, uBell, uDie;
float menger(vec3 p, out float lv){
  float d=-1e9, s=1.; lv=0.;
  for(int m=0;m<5;m++){
    vec3 a=mod(p*s,2.)-1.; s*=3.;
    vec3 r=abs(1.-3.*abs(a));
    float c=(min(max(r.x,r.y),min(max(r.y,r.z),max(r.z,r.x)))-1.)/s;
    if(c>d){ d=c; lv=float(m); }
  }
  return d;
}
float map(vec3 p){ float l; return menger(p,l); }
vec3 nrm(vec3 p, float e){ vec2 h=vec2(e,0.); return normalize(vec3(map(p+h.xyy)-map(p-h.xyy),map(p+h.yxy)-map(p-h.yxy),map(p+h.yyx)-map(p-h.yyx))); }
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  uv=rot(uRoll)*uv;
  vec3 ro=vec3(0.,0.,uZ);
  vec3 rd=normalize(vec3(uv,1.3));
  rd.xz=rot(sin(uTime*.23)*.35)*rd.xz; rd.yz=rot(sin(uTime*.17)*.25)*rd.yz;
  float t=.02, st=0.; bool hit=false;
  for(int i=0;i<110;i++){ float d=map(ro+rd*t); st++; if(abs(d)<.0005*t){ hit=true; break; } t+=d; if(t>14.) break; }
  vec3 fogc=vec3(.004,.012,.035), col=fogc;
  if(hit){
    vec3 p=ro+rd*t; float lv; menger(p,lv); vec3 n=nrm(p,.0005*t);
    float occ=1.-st/110.;
    vec3 alb=lv<1.5?vec3(.6,.58,.55):lv<2.5?vec3(1.,.5,.14):vec3(.12,.38,1.);  // stone, copper inlay, blue inlay
    vec3 L=normalize(ro+vec3(0.,0.,.3)-p);
    float dif=max(dot(n,L),0.), at=1./(1.+t*t*.15);
    // light pulses run down the corridor: copper ones ride the kick, blue ones the bell eighths
    float ps=p.z-uTime*3., id=floor(ps/4.), pulse=smoothstep(.16,0.,abs(mod(ps,4.)-2.));
    float isBlue=mod(id,2.);
    vec3 pc=mix(vec3(1.,.5,.12),vec3(.15,.45,1.),isBlue);
    float drive=mix(1.1+uKick*3.2,1.+uBell*3.2,isBlue)*(1.-uDie);
    float edge=smoothstep(.97,1.,max(abs(n.x),max(abs(n.y),abs(n.z))));
    col=alb*(dif*at*1.7*(1.-uDie)+vec3(.012,.02,.045))*occ*occ;
    col+=pc*pulse*(1.-edge*.5)*drive*occ;
    col+=alb*pc*exp(-abs(mod(ps,4.)-2.)*1.6)*.25*drive*occ;                      // each pulse lights the stone around it
    col+=vec3(.2,.4,1.)*.12*uSnare*occ*(1.-uDie);
  }
  col=mix(col,fogc*(1.-uDie),1.-exp(-t*.2));
  col+=vec3(.12,.3,1.)*pow(st/110.,3.)*.5*(1.-uDie);
  fragColor=vec4(col,1.);
}`;

  let pMan, pBulb, pMeng;
  const PAT = MUSIC.PAT, HB = PAT / 2, TZ = 6.55;
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const C0 = [-0.743643887037151, 0.13182590420533], LS0 = Math.log(1.5), LSE = Math.log(1.35);
  // the first second also zooms in from twice as far out, so the set grows out of the tunnel's dark vanishing point
  const lsIn = t => (t <= HB ? LS0 - 0.165 * t : LS0 - 0.165 * t - 0.79 * (t - HB) * (t - HB)) + Math.log(2.2) * Math.exp(-1.5 * t);
  const norm = a => { const l = Math.hypot(...a) || 1; return a.map(x => x / l); };

  const beamAt = lt => lt < PAT ? sm(HB, HB + 1.4, lt) : 1;
  function drawMandel(st, tgt) {
    const beam = beamAt(st.lt), lt = beam < 1 ? Math.floor(st.lt * 50) / 50 : st.lt;
    // the tunnel keeps running for a bar (slowing from the warp), then drains ring by ring into the set by the beam
    const flow = 9 * lt + 10 / 3 * (1 - Math.exp(-3 * lt)), drain = beam > 0 ? 99 : 1 + 27 * sm(MUSIC.BAR * 0.9, HB - 0.15, lt);
    let ls, cx, cy;
    if (lt <= TZ) { ls = lsIn(lt); const s = Math.exp(ls), k = s / 1.5; cx = C0[0] + (-0.6 - C0[0]) * k; cy = C0[1] * (1 - k) + 0.4 * s * sm(0.95, 0.45, s) * sm(0.004, 0.04, s); }   // keep the open valley, not the black bulbs, in frame
    else { const w = sm(TZ, PAT - 0.02, lt); ls = lsIn(TZ) + (LSE - lsIn(TZ)) * w * w; const k = Math.exp(ls) / 1.35; cx = C0[0] + (-0.45 - C0[0]) * k; cy = C0[1] * (1 - k); }
    const depth = Math.max(0, -ls);
    G.draw(pMan, { uBeam: beam, uC: [cx, cy], uS: Math.exp(ls), uCyc: beam < 1 ? Math.floor(lt * 14) : lt * 14, uEmb: sm(6.5, PAT - 0.05, lt),
      uIt: Math.min(420, 90 + 46 * depth), uBand: 1 / (1 + 0.45 * Math.max(0, depth - 0.9)), uFlow: flow, uDrain: drain, uRoll: 0.3 * lt, uPl: lt * 0.8 }, tgt);
    const crt = 1 - sm(HB + 1.0, HB + 2.4, st.lt);
    return { lines: 256, ocs: 1, beam, crt, fa: 1.25 + (st.W / st.H - 1.25) * sm(HB + 1.3, HB + 2.9, st.lt), scan: 256, aberr: 0.15 * crt,
      bloom: 0.2 + 0.3 * beam, thresh: 0.8, expo: 1, vig: 0.45 - 0.1 * crt, fade: 1 };
  }
  function drawBulb(st, tgt, l) {                                   // l: seconds since the P19 boundary
    const k = sm(0.15, 4.2, l), dive = sm(PAT - 1.0, PAT, l), az = l * 0.42 * k - 0.5;
    const tilt = 1.12 * sm(0.3, 4.0, l) + Math.sin(l * 0.9 + 1) * 0.3 * k;      // 0 = looking straight down the pole at the "2D" set
    const rad = 3.9 - 1.5 * k + Math.sin(l * 0.6) * 0.2 * k - 0.95 * dive * dive, tx = -0.45 * (1 - k);
    const cam = [tx + Math.sin(tilt) * Math.cos(az) * rad, Math.sin(tilt) * Math.sin(az) * rad, Math.cos(tilt) * rad];
    const up = norm([0, 1 - k, k]);
    const pw = 2 + 6 * sm(0.4, 4.6, l) + st.lead * 0.22 * k + Math.sin(l * 0.7) * 0.15 * k;
    G.draw(pBulb, { uCam: cam, uTgt: [tx, 0, 0], uUp: up, uPow: pw, uIter: pw < 4 ? 10 : 7, uRise: 0.45 + 0.55 * sm(0, 1.2, l) }, tgt);
    return { bloom: 0.6, thresh: 0.9, expo: 1.15, aberr: dive * 1.2, fade: 1 };
  }
  function drawMenger(st, tgt, l2) {
    const end = 2 * PAT - l2, die = 1 - sm(0.05, 1.3, end);
    const bell = Math.exp(-(((st.t - 20 * PAT) % (2 * MUSIC.ROW)) + 0) * 9);
    const z = 0.5 + l2 * 0.55 + 1.6 * (1 - Math.exp(-l2 * 2.2)) + 2.2 * Math.pow(Math.max(0, 1.6 - end) / 1.6, 3);
    G.draw(pMeng, { uZ: z, uRoll: l2 * 0.12 + Math.sin(l2 * 0.4) * 0.4, uBell: bell, uDie: die }, tgt);
    return { bloom: 0.6, thresh: 0.85, expo: 1.05, aberr: 0.25 + 1.5 * Math.exp(-l2 * 3), fade: Math.min(1, end / 0.15) };
  }
  function draw(st, tgt) {
    const lt = st.lt;
    if (lt < PAT) return drawMandel(st, tgt);
    if (lt < 2 * PAT) return drawBulb(st, tgt, lt - PAT);
    return drawMenger(st, tgt, lt - 2 * PAT);
  }
  (window.SCENES = window.SCENES || []).push({
    name: 'Fractal', title: 'FRACTAL DREAMS', from: 18, to: 22, draw, scale: 0.7, tube: 0.6, beamAt, paula: true,
    init() { pMan = G.program(MANDEL, 'mandelbrot'); pBulb = G.program(BULB, 'mandelbulb'); pMeng = G.program(MENGER, 'menger'); },
    caps: [{ at: PAT + 3.2, len: 4.2, title: 'FRACTAL DREAMS', sub: 'THE SAME EQUATION, ONE DIMENSION UP', hue: 28 }],
  });
})();
