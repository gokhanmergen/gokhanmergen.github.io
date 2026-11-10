'use strict';
// =====================================================================
//  PART 2: BOING. The 1984 demo exactly as it looked (flat red/white
//  ball, grey room, purple grid, a shadow that is just a darker patch),
//  then the raster beam passes and the same room is photographed for
//  real: soft shadows, gloss, reflections. Then the walls fall away into
//  the other Amiga icon of the 80s, the ray-traced checkerboard under a
//  blue sky, with chrome and glass spheres landing on the beat.
// =====================================================================
(() => {
  const FS = `
uniform vec4 uBall[8], uBallM[8], uRip[8];
uniform int uN;
uniform vec3 uCam, uTgt;
uniform float uFov, uStage;

float iSph(vec3 ro, vec3 rd, vec4 s){ vec3 oc=ro-s.xyz; float b=dot(oc,rd), c=dot(oc,oc)-s.w*s.w, h=b*b-c; return h<0.?-1.:-b-sqrt(h); }
float sphSoft(vec3 ro, vec3 rd, vec4 s, float k){
  vec3 oc=ro-s.xyz; float b=dot(oc,rd), c=dot(oc,oc)-s.w*s.w, h=b*b-c;
  float d=sqrt(max(0.,s.w*s.w-h))-s.w, t=-b-sqrt(max(h,0.));
  return t<0.?1.:smoothstep(0.,1.,2.5*k*d/t);
}
float wallZ(){ return -7.-uStage*uStage*300.; }
float trace(vec3 ro, vec3 rd, out int id){
  float tm=1e9; id=-1;
  for(int i=0;i<8;i++){ if(i>=uN) break; float t=iSph(ro,rd,uBall[i]); if(t>1e-3&&t<tm){tm=t;id=i;} }
  if(rd.y<0.){ float t=-ro.y/rd.y; if(t>1e-3&&t<tm){tm=t;id=10;} }
  if(rd.z<0.&&uStage<.999){ float t=(wallZ()-ro.z)/rd.z; if(t>1e-3&&t<tm){tm=t;id=11;} }
  return tm;
}
const vec3 SUN=vec3(-.6,.52,.6);
vec3 sky(vec3 rd){
  float y=max(rd.y,0.);
  vec3 c=mix(vec3(.42,.6,.95),vec3(.01,.05,.32),pow(y,.5));
  c+=vec3(.5,.6,.8)*exp(-y*22.)*.35;
  float s=max(dot(rd,normalize(SUN)),0.);
  c+=vec3(1.,.85,.62)*(pow(s,1200.)*45.+pow(s,60.)*.35+pow(s,6.)*.06);
  float cl=fbm(rd.xz/(y+.12)*1.3+vec2(uGT*.01,0.)); c=mix(c,vec3(.95,.93,.9),smoothstep(.55,.9,cl)*smoothstep(.02,.25,y)*.55);
  return mix(vec3(.62),c,uStage);
}
float gridL(vec2 p, float w){ vec2 d=abs(fract(p-.5)-.5); return 1.-smoothstep(w*.5,w*1.5+.004,min(d.x,d.y)); }
float grid2(vec2 p, vec2 w){ vec2 d=abs(fract(p-.5)-.5); w=min(w,vec2(.22)); vec2 l=1.-step(w,d); return max(l.x,l.y); }
vec3 ballAlb(int i, vec3 n){
  vec4 m=uBallM[i]; vec3 l=n; l.xy=rot(m.z)*l.xy; l.xz=rot(m.y)*l.xz;
  float u=atan(l.z,l.x)/TAU*16., v=acos(clamp(l.y,-1.,1.))/PI*8.;
  float ch=mod(floor(u)+floor(v),2.);
  vec3 a=m.x<.5?vec3(.9,.02,.02):m.x<2.5?vec3(.02,.2,.85):vec3(1.,.5,.02);
  return mix(a,vec3(.95),ch);
}
// ---- 1984: no light, no shading: eight colours and a patch of darker grey for a shadow ----
vec3 oldRender(vec3 ro, vec3 rd){
  float t=iSph(ro,rd,uBall[0]);
  if(t>0.){ vec3 n=normalize(ro+rd*t-uBall[0].xyz); vec4 m=uBallM[0]; n.xy=rot(m.z)*n.xy; n.xz=rot(m.y)*n.xz;
    float ch=mod(floor(atan(n.z,n.x)/TAU*16.)+floor(acos(clamp(n.y,-1.,1.))/PI*8.),2.); return mix(vec3(1.,0.,0.),vec3(1.),ch); }
  float tf=rd.y<0.?-ro.y/rd.y:1e9, tw=rd.z<0.?(-7.-ro.z)/rd.z:1e9, tt=min(tf,tw);
  vec3 p=ro+rd*tt; float px=tt*2./(256.*uFov), g;
  if(tf<tw) g=grid2(vec2(p.x,p.z*.5+.5),vec2(px*.55,px*.3/max(-rd.y,.02))); else g=grid2(p.xy,vec2(px*.55));
  float sh=tf<tw?0.:step(0.,iSph(p,normalize(vec3(-.42,.26,1.)),uBall[0]));
  vec3 col=mix(vec3(.667),vec3(.667,0.,.667),g);
  return mix(col,col*vec3(.6,.6,.6),sh);
}
vec3 render(vec3 ro, vec3 rd){
  vec3 col=vec3(0.), thr=vec3(1.);
  vec3 L=normalize(mix(vec3(-.42,.5,.8),SUN,uStage)); float dist=0.;
  vec3 lc=mix(vec3(1.,.97,.92)*1.5,vec3(1.,.9,.74)*2.3,uStage);
  for(int b=0;b<4;b++){
    int id; float t=trace(ro,rd,id);
    if(id<0){ col+=thr*sky(rd); break; }
    vec3 p=ro+rd*t, n, alb, emi=vec3(0.); float refl=0., metal=0.; dist+=t; float fw=dist*2./(uRes.y*uFov);
    if(id<8){
      n=normalize(p-uBall[id].xyz); float m=uBallM[id].x;
      if(m>3.5){                                   // glass: refract through, add a Fresnel sheen of the sky
        float fr=.04+.96*pow(1.-max(dot(n,-rd),0.),5.);
        col+=thr*fr*sky(reflect(rd,n));
        vec3 din=refract(rd,n,1./1.45); float tx=-2.*dot(din,n)*uBall[id].w; vec3 p2=p+din*tx, n2=normalize(p2-uBall[id].xyz);
        vec3 dout=refract(din,-n2,1.45); if(dot(dout,dout)<.01) dout=reflect(din,-n2);
        thr*=(1.-fr)*exp(-tx*vec3(.10,.03,.02)); ro=p2+n2*2e-3; rd=dout; dist+=tx; continue;
      }
      if(m>.5&&m<1.5){ alb=vec3(.96,.97,1.); refl=.9; metal=1.; } else { alb=ballAlb(id,n); refl=.06; }
    } else if(id==10){
      n=vec3(0,1,0); float fp=fw/max(abs(rd.y),.05);
      float g=gridL(p.xz,fp*.8)*smoothstep(.6,.1,fp)*(1.-uStage);
      vec2 e=(abs(fract(p.xz*.5)-.5)-.25)*2.; vec2 sg=clamp(e/vec2(fw*1.2,fp*1.2),-1.,1.); float ch=mix(.5-.5*sg.x*sg.y,.5,smoothstep(.3,1.2,fp));
      vec3 room=mix(vec3(.60),vec3(.5,.06,.55),g);
      vec3 chk=mix(vec3(.015,.11,.42),vec3(.9,.88,.84),ch);
      alb=mix(room,chk,uStage); refl=mix(.16,.14,uStage);
      for(int i=0;i<8;i++){ if(i>=uN) break; vec4 r=uRip[i]; vec2 dv=p.xz-r.xy; float d=length(dv)+1e-4, f=d-r.z*6.;   // impact ripples in the gloss
        n.xz+=dv/d*sin(f*9.)*exp(-f*f*.6)*exp(-r.z*2.6)*r.w*.05*uStage; }
      n=normalize(n);
    } else {
      n=vec3(0,0,1); float g=gridL(p.xy,fw*.8/max(abs(rd.z),.08));
      alb=mix(vec3(.60),vec3(.5,.06,.55),g); refl=.03;
    }
    float dif=max(dot(n,L),0.), sh=1., occ=1.;
    for(int i=0;i<8;i++){ if(i>=uN) break; if(i==id) continue; vec4 s=uBall[i];
      sh*=mix(1.,sphSoft(p+n*1e-3,L,s,mix(7.,10.,uStage)),uBallM[i].x>3.5?.45:1.);
      vec3 di=s.xyz-p; float l=length(di); occ*=1.-max(0.,dot(n,di/l))*s.w*s.w/(l*l); }
    vec3 h=normalize(L-rd); float spec=pow(max(dot(n,h),0.),90.)*sh;
    vec3 amb=mix(vec3(.26,.26,.3),vec3(.16,.24,.42),uStage)*(.7+.3*n.y);
    vec3 c=alb*(dif*sh*lc+occ*amb)*(1.-metal)+spec*lc*1.2+emi;
    if(id==11) c=mix(c,sky(rd),uStage);
    if(id==10) c=mix(c,sky(normalize(vec3(rd.x,.0,rd.z))),uStage*(1.-exp(-dist*.006)));
    float fre=refl+(1.-refl)*pow(1.-max(dot(n,-rd),0.),5.)*step(.01,refl)*(id==10?.55:1.);
    col+=thr*c*(1.-fre);
    thr*=fre*mix(vec3(1.),alb,metal);
    if(max(thr.x,max(thr.y,thr.z))<.015) break;
    ro=p+n*2e-3; rd=reflect(rd,n);
  }
  return col;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 f=normalize(uTgt-uCam), r=normalize(cross(f,vec3(0,1,0))), u=cross(r,f);
  vec3 rd=normalize(f*uFov+uv.x*r+uv.y*u);
  vec3 col=isOld()>.5?oldRender(uCam,rd):render(uCam,rd);
  fragColor=vec4(col,1.);
}`;

  let prog, physics;
  const PAT = MUSIC.PAT, BAR = MUSIC.BAR, BEAT = 60 / MUSIC.BPM;
  const tri = x => 1 - 4 * Math.abs((x - Math.floor(x)) - 0.5);
  // m: 0 red checker, 1 chrome, 2 blue checker, 3 gold checker, 4 glass.  pb: beats per bounce, ph: phase in beats
  const BALLS = [
    { m: 0, r: 1.0, ph: 0, pb: 2, X: 2.7, vx: 0.09, xp: 0.25, Z: 0, vz: 0, zp: 0, h: 2.8, spin: 2.4, tilt: 0.4, spawn: -9 },
    { m: 1, r: 0.75, ph: 1, pb: 2, X: 4.0, vx: 0.10, xp: 0.6, Z: 2.2, vz: 0.06, zp: 0.1, h: 2.2, spin: -3, tilt: -0.3, spawn: 2 * PAT },
    { m: 4, r: 0.85, ph: 0.5, pb: 2, X: 3.6, vx: 0.09, xp: 0.1, Z: 2.0, vz: 0.07, zp: 0.7, h: 2.0, spin: 3.2, tilt: 0.2, spawn: 2 * PAT + BAR },
    { m: 1, r: 0.55, ph: 0.25, pb: 2, X: 3.9, vx: 0.10, xp: 0.4, Z: 2.4, vz: 0.08, zp: 0.3, h: 1.8, spin: 4, tilt: 0.5, spawn: 3 * PAT },
    { m: 3, r: 0.7, ph: 1.5, pb: 2, X: 3.7, vx: 0.10, xp: 0.8, Z: 2.2, vz: 0.05, zp: 0.55, h: 2.3, spin: -2.6, tilt: -0.5, spawn: 3 * PAT },
    { m: 2, r: 0.6, ph: 0.75, pb: 2, X: 3.9, vx: 0.08, xp: 0.9, Z: 2.5, vz: 0.09, zp: 0.9, h: 1.9, spin: 3.5, tilt: 0.1, spawn: 3 * PAT + BAR },
    { m: 4, r: 0.95, ph: 1.25, pb: 2, X: 3.4, vx: 0.09, xp: 0.45, Z: 1.8, vz: 0.07, zp: 0.2, h: 2.6, spin: -2, tilt: 0.3, spawn: 3 * PAT + 2 * BAR },
  ];
  const pos = (b, beat, t) => {
    const f = ((beat + b.ph) / b.pb) % 1;
    return [b.X * tri(t * b.vx + b.xp), b.r + b.h * 4 * f * (1 - f), b.Z * tri(t * b.vz + b.zp)];
  };
  const ball = new Float32Array(32), mat = new Float32Array(32), rip = new Float32Array(32);
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

  function draw(st, tgt) {
    const lt = st.lt, beat = st.t / BEAT;
    let n = 0;
    BALLS.forEach((b, i) => {
      if (lt < b.spawn) return;
      const physical = lt >= 2 * PAT ? BOING_PHYSICS.sample(physics, lt, i) : null;
      const p = physical ? physical.p : pos(b, beat, st.t), drop = Math.max(0, 1 - (lt - b.spawn) / 1.2);
      if (!physical) p[1] += drop * drop * 9;
      ball.set([p[0], p[1], p[2], b.r], n * 4);
      mat.set([b.m, st.t * b.spin, b.tilt, 0], n * 4);
      const bi = Math.floor((beat + b.ph) / b.pb) * b.pb - b.ph, age = (beat - bi) * BEAT;  // last impact
      const pi = pos(b, bi, st.t - age);
      rip.set(physical
        ? [physical.impact[0], physical.impact[1], lt - physical.impact[2], b.r]
        : [pi[0], pi[2], age, drop > 0 ? 0 : b.r], n * 4);
      n++;
    });
    const beam = sm(BAR, BAR + 1.6, lt), stage = sm(PAT - 0.2, PAT + 1.6, lt);
    const m = sm(PAT - 0.5, PAT + 7, lt), a = Math.sin((lt - PAT) * 0.17) * 1.15 * m, rad = 10 - 2.2 * m + Math.sin(lt * 0.3) * m;
    const cam = [Math.sin(a) * rad, 2.3 + 0.5 * m + Math.sin(lt * 0.23) * 0.7 * m, Math.cos(a) * rad];
    G.draw(prog, { uBall: ball, uBallM: mat, uRip: rip, uN: n, uCam: cam, uTgt: [0, 1.6 + 0.35 * m, 0], uFov: 1.6 - 0.22 * m, uStage: stage, uBeam: beam }, tgt);
    return {
      lines: 256, ocs: 1, beam, crt: 1 - sm(2 * BAR, 2 * BAR + 1.5, lt), fa: 1.25 + (st.W / st.H - 1.25) * sm(2 * BAR + 0.5, 3 * BAR + 0.2, lt), scan: 256,
      flash: Math.max(0, 1 - lt * 9) * 0.6, bloom: 0.35, thresh: 1.15, expo: 0.92, aberr: 0.25 * (1 - beam), vig: 0.45, fade: Math.min(1, (st.dur - lt) * 8),
    };
  }

  (window.SCENES = window.SCENES || []).push({ name: 'Boing', from: 5, to: 9, draw, init() {
    prog = G.program(FS, 'boing');
    physics = BOING_PHYSICS.bake(BALLS, { from: 2 * PAT, to: 4 * PAT, startTime: 5 * PAT, beat: BEAT, position: pos });
    physics.spawnFrames = BALLS.map(b => Math.max(0, Math.ceil((b.spawn - 2 * PAT) * BOING_PHYSICS.HZ - 1e-9)));
  } });
})();
