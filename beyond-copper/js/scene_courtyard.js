'use strict';
// =====================================================================
//  DISK 2: COPLA + DAWN - the quiet heart of "Leyenda" and its ending.
//  A moonlit courtyard of horseshoe arcades around a reflecting pool,
//  staged like a letterboxed adventure-game cutscene in three shots:
//  the walk along the water, a crane up to the roofs where the moon lies
//  in the pool, and a tracking shot through the arches. Every melody
//  note is a droplet that falls into the water and rings.
//  DAWN returns to the same place at sunrise for the end credits: the
//  lanterns go out on the timpani hits while the credits roll in 8x8.
// =====================================================================
(() => {
  const FS = `
uniform vec4 uRip[10];      // x, z, age (negative: the droplet is still falling), amplitude (+2 = long, bowed note)
uniform vec3 uCam, uTgt;
uniform float uDawn, uOut, uSunE, uCredA, uFov;
uniform sampler2D uCred;
#define PW 1.6
#define AX 3.0
#define P 1.7
vec3 MOON, SUN, LD;
float sdBox(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
float sdBox2(vec2 p, vec2 b){ vec2 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,q.y),0.); }
float lanLit(float cell, float side){ return smoothstep(uOut-.03,uOut+.03,hash21(vec2(cell,side*3.+7.))*.9+.05); }
float map(vec3 p, out float m){
  vec3 a=p; a.x=abs(a.x);
  float fl=max(a.y-.1,PW-a.x); m=1.;
  float d=min(fl,max(a.y+.5,a.x-PW));
  float cop=sdBox(a-vec3(PW+.09,.13,0.),vec3(.1,.04,1e3)); if(cop<d){ d=cop; m=1.; }
  vec3 c=a-vec3(AX,0.,0.); c.z=mod(c.z+P*.5,P)-P*.5;
  float col=max(length(c.xz)-.085,abs(c.y-1.)-1.);
  col=min(col,sdBox(c-vec3(0.,2.0,0.),vec3(.15,.06,.15)));
  col=min(col,max(length(c.xz)-.11-.04*smoothstep(1.8,1.94,c.y),abs(c.y-1.87)-.07));
  col=min(col,sdBox(c-vec3(0.,.15,0.),vec3(.13,.05,.13)));
  if(col<d){ d=col; m=2.; }
  float oz=mod(a.z,P)-P*.5;
  float slab=sdBox(vec3(c.x,c.y-2.62,0.),vec3(.17,.57,1.));
  float hole=min(length(vec2(oz,c.y-2.25))-.6,sdBox2(vec2(oz,c.y-1.6),vec2(.5,.65)));
  slab=max(slab,-hole); if(slab<d){ d=slab; m=3.; }
  float eave=sdBox(a-vec3(AX+.5,3.26,0.),vec3(.95,.07,1e3)); if(eave<d){ d=eave; m=4.; }
  float back=max(AX+1.35-a.x,a.y-3.3); if(back<d){ d=back; m=5.; }
  vec3 q=a-vec3(AX+.5,2.25,(floor(a.z/P)+.5)*P);
  float lan=sdBox(q,vec3(.05,.075,.05))-.012; if(lan<d){ d=lan; m=6.; }
  float ch=max(length(q.xz)-.007,abs(q.y-.52)-.44); if(ch<d){ d=ch; m=4.; }
  return d;
}
float mapD(vec3 p){ float m; return map(p,m); }
vec3 nrm(vec3 p){ vec2 e=vec2(.003,0.); return normalize(vec3(mapD(p+e.xyy)-mapD(p-e.xyy),mapD(p+e.yxy)-mapD(p-e.yxy),mapD(p+e.yyx)-mapD(p-e.yyx))); }
// what stands beyond the walls: hills, cypresses and one palace tower, as a silhouette against the sky
float skyline(float phi){
  float h=.035+.02*sin(phi*3.+1.)+.012*sin(phi*7.3);
  float s=phi*11., c=floor(s), f=fract(s)-.5, hh=hash11(c+3.);
  if(hh>.42){ float w=.1+.1*hh; h=max(h,(.09+.13*hh)*(1.-pow(min(abs(f)/w,1.),1.6))); }
  float dp=abs(phi-.13);
  h=max(h,step(dp,.034)*(.2+.008*step(.5,fract(phi*90.))));
  h=max(h,step(dp,.02)*(.215+sqrt(max(0.,.0004-dp*dp))*1.4));
  h=max(h,step(dp,.003)*.275);
  return h;
}
vec3 sky(vec3 rd){
  float md=dot(rd,MOON);
  vec3 night=mix(vec3(.022,.034,.085),vec3(.002,.004,.016),smoothstep(0.,.55,rd.y));
  night+=vec3(.95,.96,1.)*smoothstep(.99935,.9996,md)*2.2+vec3(.16,.2,.34)*pow(max(md,0.),90.)+vec3(.035,.05,.1)*pow(max(md,0.),7.);
  float phi=atan(rd.x,rd.z), el=rd.y/max(length(rd.xz),1e-3);
  vec2 sg=vec2(phi*130.,el*130.), si=floor(sg); float sh=hash21(si);
  night+=vec3(.8,.85,1.)*step(.992,sh)*smoothstep(.35,.0,length(fract(sg)-.5))*(.5+.5*sin(uGT*2.+sh*90.))*step(0.,rd.y)*1.3;
  float cl=smoothstep(.5,.85,fbm(vec2(phi*3.+uGT*.004,el*9.)))*smoothstep(.6,.1,el);
  night+=cl*(vec3(.02,.03,.055)+vec3(.12,.15,.24)*pow(max(md,0.),5.));
  vec3 day=mix(vec3(1.,.56,.32),vec3(.24,.36,.62),smoothstep(-.05,.5,rd.y));
  float sd=max(dot(rd,SUN),0.);
  day+=vec3(1.,.82,.5)*pow(sd,500.)*5.+vec3(1.,.5,.2)*pow(sd,10.)*.55;
  day=mix(day,vec3(1.,.72,.55),cl*.5);
  vec3 c=mix(night,day,uDawn);
  float sl=skyline(phi);
  if(el<sl){
    vec3 far=mix(vec3(.008,.011,.026),vec3(.32,.2,.26),uDawn)+vec3(1.,.6,.3)*pow(sd,6.)*.25*uDawn;
    float win=step(abs(phi-.13),.006)*step(abs(el-.155),.012)*(1.-uDawn);
    c=mix(far,c,smoothstep(.0,.012,el-sl)*.0)+vec3(1.,.6,.25)*win*1.5;
  }
  return c;
}
float march(vec3 ro, vec3 rd, float tmax, int steps, out float m, out vec3 glow){
  float t=.02; m=0.; glow=vec3(0.);
  for(int i=0;i<110;i++){
    if(i>=steps) break;
    vec3 p=ro+rd*t; float d=map(p,m);
    vec3 a=vec3(abs(p.x),p.y,p.z); float cell=floor(a.z/P);
    vec3 q=a-vec3(AX+.5,2.25,(cell+.5)*P);
    glow+=lanLit(cell,sign(p.x))*min(d,.6)/(1.+dot(q,q)*26.);
    if(abs(d)<.0012*t) return t; t+=d; if(t>tmax) break;
  }
  m=0.; return 1e9;
}
vec3 lanterns(vec3 p, vec3 n){
  vec3 L=vec3(0.);
  for(int s=0;s<2;s++){ float sx=s==0?-1.:1.;
    for(int k=-1;k<=1;k++){ float cell=floor(p.z/P)+float(k); vec3 dv=vec3(sx*(AX+.5),2.25,(cell+.5)*P)-p; float dd=dot(dv,dv);
      L+=lanLit(cell,sx)*(.07+.93*max(dot(n,dv*inversesqrt(dd)),0.))/(1.+dd*2.2); } }
  return vec3(1.,.5,.17)*L*1.9*step(p.y,3.2);
}
vec3 roofTile(vec3 p, vec3 a, float t){ float k=exp(-t*.09); return vec3(.5,.27,.2)*(1.-k*.55*(1.-abs(sin(p.z*30.))))*(1.-k*.3*step(.5,fract(a.x*4.))); }
float star8(vec2 p){ vec2 q=abs(p); float a=max(q.x,q.y); vec2 r=abs(mat2(.7071,.7071,-.7071,.7071)*p); return min(a,max(r.x,r.y)); }
vec3 shade(vec3 p, vec3 rd, float m, float t, bool shadows){
  vec3 n=nrm(p), a=vec3(abs(p.x),p.y,p.z);
  vec3 alb; float gloss=.15;
  if(m>5.5){ float cell=floor(a.z/P); return vec3(1.,.55,.2)*(.15+5.5*lanLit(cell,sign(p.x)))*(.6+.4*step(.02,abs(fract(p.y*14.)-.5))); }
  if(m<1.5){
    if(a.x<PW+.19&&p.y<.2){ alb=a.x<PW?vec3(.1,.33,.36):vec3(.78,.76,.7); gloss=.5; }      // pool wall, marble coping
    else { vec2 g=vec2(a.x-PW-.19,p.z)/.45; g=mat2(.7071,.7071,-.7071,.7071)*g; vec2 gf=abs(fract(g)-.5);
      float ch=mod(floor(g.x)+floor(g.y),2.);
      alb=mix(vec3(.6,.57,.52),vec3(.47,.42,.38),ch)*(.9+.2*noise(p.xz*9.));
      alb*=.55+.45*smoothstep(.0,.03,.5-max(gf.x,gf.y)); gloss=.45; }
  } else if(m<2.5){ vec3 cc=a-vec3(AX,0.,0.); cc.z=mod(cc.z+P*.5,P)-P*.5;
    alb=vec3(.86,.84,.79)*(.86+.14*noise(vec2(p.y*7.+p.z*3.,p.x*9.)));
    if(p.y>.22&&p.y<1.78) alb*=.74+.26*smoothstep(-.3,.6,cos(atan(cc.z,cc.x)*14.));     // fluted shafts
    alb*=.6+.4*smoothstep(.1,.5,p.y)*smoothstep(2.08,1.7,p.y); gloss=.6; }
  else if(m<3.5){
    float oz=mod(a.z,P)-P*.5; vec2 ac=vec2(oz,p.y-2.25); float r=length(ac), an=atan(ac.x,ac.y);
    alb=vec3(.8,.7,.56);
    vec2 q=vec2(mod(p.z,.2)-.1,mod(p.y,.2)-.1); float s=abs(abs(q.x)+abs(q.y)-.07);
    alb*=.72+.28*smoothstep(.0,.018,s);                                                   // carved lattice
    if(r<.8&&ac.y>-.25) alb=mix(vec3(.9,.87,.8),vec3(.62,.2,.12),step(.5,fract(an*4.4/PI+.5)));   // red and white voussoirs
    alb=mix(alb,vec3(.3,.42,.55),step(abs(p.y-3.02),.035));
    if(abs(n.x)<.5) alb*=.8;
  } else if(m<4.5){
    if(n.y>.5){ alb=roofTile(p,a,t); gloss=1.6; }  // roof tiles
    else alb=vec3(.2,.1,.05)*(.6+.4*step(.3,fract(p.z*3.5)));
  } else {
    if(n.y>.5){ alb=roofTile(p,a,t); gloss=1.6; }
    else {
      alb=vec3(.72,.63,.5)*(.8+.25*fbm(vec2(p.z*1.3,p.y*2.)));
      if(p.y<1.25){ vec2 g=vec2(p.z,p.y)/.21, gi=floor(g), gf=fract(g)-.5; float s8=star8(gf);
        float hh=hash21(gi);
        vec3 tile=hh<.4?vec3(.04,.2,.62):hh<.7?vec3(.85,.84,.78):vec3(.05,.4,.3);
        vec3 zl=mix(vec3(.8,.62,.25),tile,step(s8,.3)); zl=mix(zl,vec3(.86,.85,.8),step(s8,.14));
        alb=mix(vec3(.3,.36,.45),zl,exp(-t*.07)); gloss=.7; }
      alb=mix(alb,vec3(.8,.62,.25),step(abs(p.y-1.29),.03));
      float dz=abs(mod(p.z,P)-P*.5); float door=step(dz,.4)*step(p.y,1.75+sqrt(max(0.,.16-dz*dz))*.9);
      alb=mix(alb,vec3(.1,.045,.02)*(.7+.3*step(.5,fract(p.z*14.))),door);
    }
  }
  float sh=1.;
  if(shadows){ float ts=.05; for(int i=0;i<18;i++){ float m2; float h=map(p+n*.012+LD*ts,m2); sh=min(sh,10.*h/ts); ts+=clamp(h,.06,.6); if(sh<.02||ts>9.) break; } sh=clamp(sh,0.,1.); }
  vec3 lc=mix(vec3(.34,.45,.82)*.6,vec3(1.,.72,.45)*2.1,uDawn);
  vec3 amb=mix(vec3(.022,.03,.065),vec3(.3,.27,.33),uDawn);
  float dif=max(dot(n,LD),0.);
  vec3 h=normalize(LD-rd);
  vec3 c=alb*(lc*dif*sh+amb*(.55+.45*n.y)+lanterns(p,n));
  c+=lc*pow(max(dot(n,h),0.),40.)*gloss*sh*.5;
  return c;
}
void main(){
  vec2 sc=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  MOON=normalize(vec3(-.14,.215,1.)); SUN=normalize(vec3(.055,uSunE,1.));
  LD=normalize(mix(vec3(-.35,.6,.6),vec3(.3,max(uSunE*2.2,.08)+.12,1.),uDawn));
  vec3 ro=uCam, f=normalize(uTgt-ro), r=normalize(cross(f,vec3(0,1,0))), u=cross(r,f);
  vec3 rd=normalize(f*uFov+sc.x*r+sc.y*u);
  float m; vec3 glow; float t=march(ro,rd,60.,100,m,glow), tw=rd.y<0.?-ro.y/rd.y:1e9;
  vec3 col; vec3 moonc=mix(vec3(.6,.72,1.),vec3(1.,.8,.55),uDawn);
  bool water=tw<t&&abs(ro.x+rd.x*tw)<PW;
  if(water){
    vec3 p=ro+rd*tw; vec3 n=vec3(0,1,0); float crest=0.;
    for(int i=0;i<10;i++){ vec4 R=uRip[i]; if(R.w<=0.||R.z<0.) continue;
      float wide=step(1.5,R.w), amp=R.w-2.*wide, age=R.z;
      vec2 dv=p.xz-R.xy; float rr=length(dv)+1e-4, r0=age*mix(.5,.3,wide)+.02, w=mix(.045,.09,wide)+.02*age;
      float env=amp*exp(-age*mix(.95,.5,wide)), x=(rr-r0)/w, pk=exp(-x*x);
      n.xz-=dv/rr*cos(x*3.2)*pk*env*.42;
      crest+=exp(-x*x*9.)*env*.5+exp(-rr*rr*500.)*exp(-age*9.)*amp*3.; }
    vec2 wn=vec2(noise(p.xz*3.+uTime*.3),noise(p.xz*3.-uTime*.3+5.))-.5;
    wn+=(vec2(noise(p.xz*17.+uTime*.9),noise(p.xz*17.-uTime*.8+9.))-.5)*.35*uDawn;
    n.xz+=wn*.035; n=normalize(n);
    vec3 rr=reflect(rd,n); float m2; vec3 g2; float t2=march(p+n*.01,rr,45.,56,m2,g2);
    vec3 rc=t2<1e8?shade(p+rr*t2,rr,m2,t2,false):sky(rr);
    if(t2<1e8) rc=mix(rc,sky(rr),1.-exp(-t2*.035));
    rc+=vec3(1.,.5,.17)*g2*.55;
    float fre=.04+.96*pow(1.-max(dot(n,-rd),0.),5.);
    // what lies under the surface: a turquoise mosaic with slow caustics, seen when you look down into the pool
    vec2 fu=p.xz+rd.xz/max(-rd.y,.15)*.4+n.xz*.5, fg=fu*7., fq=abs(fract(fg)-.5);
    float mh=hash21(floor(fg)), band=step(abs(abs(fu.x)-1.25),.11)+step(abs(fu.x),.09);
    vec3 mos=mix(mix(vec3(.02,.22,.26),vec3(.04,.34,.33),mh),mix(vec3(.75,.6,.25),vec3(.9,.88,.8),step(.5,mh)),min(band,1.)*step(.3,mh));
    mos*=smoothstep(.5,.42,max(fq.x,fq.y));
    float ca=pow(1.-abs(sin(fu.x*5.+sin(fu.y*3.1+uTime*.5)*1.4+uTime*.3))*abs(sin(fu.y*4.3+sin(fu.x*2.7-uTime*.4)*1.6)),3.);
    vec3 deep=mos*(moonc*(.1+.5*ca)*mix(.35,1.2,uDawn)+lanterns(p,vec3(0,1,0))*.12);
    col=mix(deep,rc,.22+.75*fre)+lanterns(p,n)*vec3(.02,.05,.06);
    col+=moonc*crest*(.8+fre);
    vec2 pc=p.xz*vec2(1.6,1.1)+vec2(uTime*.02,uTime*.035), pi=floor(pc), pf=fract(pc)-.5; float ph=hash21(pi);   // drifting petals
    if(ph>.86){ vec2 o=(hash22(pi+3.)-.5)*.55; float pd=length((pf-o)*vec2(1.,1.8)*rot(ph*20.));
      col=mix(col,(mix(vec3(.5,.16,.2),vec3(.85,.6,.6),ph*3.-2.58))*(.12+.5*uDawn+lanterns(p,vec3(0,1,0))*.6+moonc*.12),smoothstep(.075,.055,pd)); }
    t=tw;
  } else if(t<1e8){ col=shade(ro+rd*t,rd,m,t,true); }
  else col=sky(rd);
  if(!water&&t>1e8){ t=60.; }
  col=mix(col,sky(rd)*mix(.6,.9,uDawn),1.-exp(-min(t,60.)*.022));
  // thin mist lying on the water and the paving (analytic exponential height fog)
  float b=2.2, ky=abs(rd.y)<1e-3?1e-3:rd.y, fo=.07*exp(-b*max(ro.y,0.))*(1.-exp(-b*ky*min(t,40.)))/(b*ky);
  vec3 mistc=mix(vec3(.05,.07,.13),vec3(.6,.42,.3),uDawn)+vec3(1.,.5,.17)*glow*.25;
  col=mix(col,mistc,clamp(fo,0.,.75));
  col+=vec3(1.,.5,.17)*glow*.75;
  // falling droplets: one per note, landing exactly on the note
  for(int i=0;i<10;i++){ vec4 R=uRip[i]; if(R.w<=0.||R.z>=0.) continue;
    vec3 dp=vec3(R.x,-R.z*3.2,R.y)-ro; float td=dot(dp,rd); if(td<0.||td>t) continue;
    vec3 pe=dp-rd*td; pe.y*=.35; float dd=dot(pe,pe);
    col+=moonc*(.00003/(dd+.00001*td*td*.02+1e-7))*min(1.,.02/(td*td*.004+.02)); }
  // fireflies in the arcades (night only)
  for(int i=0;i<7;i++){ float fi=float(i), sd=mod(fi,2.)*2.-1.;
    float zc=ro.z+mod(fi*2.9+3.-ro.z,16.)-2.;
    vec3 fp=vec3(sd*(2.+.5*sin(uGT*.31+fi*2.)),.5+.35*sin(uGT*.43+fi*1.7)+.25*hash11(fi),zc+.4*sin(uGT*.27+fi));
    vec3 dp=fp-ro; float td=dot(dp,rd); if(td<0.||td>t) continue; vec3 pe=dp-rd*td;
    col+=vec3(.75,1.,.35)*(.5+.5*sin(uGT*2.3+fi*4.))*(1.-uDawn)*.00002/(dot(pe,pe)+.00002); }
  // end credits: the PIX framebuffer, pixel-doubled, with a one-pixel drop shadow
  if(uCredA>0.){
    float k=max(1.,floor(uRes.y/360.+.5)); vec2 c=floor((gl_FragCoord.xy-.5*uRes)/k)+vec2(160.,128.);
    if(c.x>=1.&&c.x<320.&&c.y>=0.&&c.y<255.){
      ivec2 ic=ivec2(int(c.x),255-int(c.y));
      vec3 tx=texelFetch(uCred,ic,0).rgb, ts=texelFetch(uCred,ic+ivec2(-1,-1),0).rgb;
      float edge=smoothstep(0.,26.,c.y)*smoothstep(255.,229.,c.y)*uCredA;
      float ink=step(.01,dot(tx,vec3(1.))), shd=step(.01,dot(ts,vec3(1.)));
      col=mix(col,col*.25,shd*edge*.8);
      col=mix(col,tx*tx*1.5,ink*edge);
    }
  }
  fragColor=vec4(col,1.);
}`;
  let prog, RIP = [], RIPD = [];
  const P = PIX, X = P.hex;
  const rip = new Float32Array(40);
  const h1 = x => { const s = Math.sin(x * 91.7) * 43758.5453; return s - Math.floor(s); };
  const cl = x => Math.min(1, Math.max(0, x));
  const sm = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  let A0, AD, T70, T76, T78, T86, TEND, TD_END;

  // ----------------------------- camera -----------------------------
  const zA = d2 => (d2 - A0) * 0.5, zC = d2 => zA(T86) + 6 + (d2 - T86) * 0.34, zD = d2 => (d2 - AD) * 0.4;
  function poseCopla(d2) {
    const z = zA(d2), sw = Math.sin(z * 0.13);
    // two shots before the crane: the walk along the water, then (bar 70, the second phrase) low over the pool,
    // drifting across it towards the lanterns, with the notes landing right in front of the lens
    const kl = cl((d2 - T70) / (T76 - T70)), ke = kl * (2 - kl);
    const walk = d2 < T70 ? { c: [sw * 0.5, 0.5 + 0.12 * Math.sin(z * 0.21), z], t: [sw * 0.2, 0.72, z + 3] }
      : { c: [-1.15 + 1.5 * ke, 0.2 + 0.16 * ke, z], t: [1.9 - 1.9 * ke, 0.5 + 0.2 * ke, z + 4.2], fov: 1.15 + 0.2 * ke };
    if (d2 < T76) return walk;
    if (d2 < T86) {                                              // crane straight up; from above every ring is a circle
      const k = sm(T76, T78, d2), kb = cl((d2 - T78) / (T86 - T78));
      const c = [walk.c[0] * (1 - k) + (0.9 - 1.8 * kb) * k, walk.c[1] + (9.2 - 1.2 * kb - walk.c[1]) * sm(0, 1, k), z];
      const hi = [0.6 * Math.sin(kb * 2.4 - 0.6), 0, z + 8.5 + 1.5 * kb];
      return { c, t: mix(walk.t, hi, sm(0.05, 0.95, k)), fov: walk.fov + (2.1 - walk.fov) * k };
    }
    const zc = zC(d2), k = cl((d2 - T86) / (TEND - T86));      // inside the gallery, looking out through the arches
    return { c: [4.12, 1.25 + 0.06 * Math.sin(zc * 0.5), zc], t: [-2.6 + 0.8 * k, 0.9 + 0.3 * k, zc + 5.2] };
  }
  function focus(t, x, h) {                                      // where on the water the note of time t lands
    if (t < T76 - 0.3) return [x, zA(t) + 3 + h * 3.5];
    if (t < T86 - 0.6) return [x, zA(t) + 5.5 + h * 7];
    return [x, zC(t) + 1.2 + h * 5];
  }
  function ripples(list, d2) {
    let n = 0; rip.fill(0);
    for (let i = list.length - 1; i >= 0 && n < 10; i--) {
      const R = list[i]; if (R.t > d2 + 0.34) continue; const age = d2 - R.t; if (age > (R.wide ? 8 : 4.2)) { if (age > 9) break; continue; }
      rip.set([R.x, R.z, age, R.a + (R.wide ? 2 : 0)], n * 4); n++;
    }
  }

  // ----------------------------- credits -----------------------------
  const CRED = [
    ['BEYOND THE COPPER', 2], [''], ['A NEON BLITTER PRODUCTION', 0], [''], [''], [''],
    ['DISK ONE', 1], [''], ['ORIGINAL SOUNDTRACK', 0], ['IN FOUR CHANNELS AND BEYOND', 0], [''], [''], [''],
    ['DISK TWO', 1], [''], ['ISAAC ALBENIZ', 0], ['ASTURIAS (LEYENDA), 1892', 0], ['PLAYED ON SIX MODELLED STRINGS', 0], [''], [''], [''],
    ['NO SAMPLES, NO TEXTURES, NO ASSETS', 0], ['EVERYTHING IS CODE', 0], [''], [''], [''], [''],
    ['FOR THE MACHINE THAT TAUGHT US', 0], ['TO DREAM IN 4096 COLOURS', 0],
  ];
  const GOLD = [X(0xFFD), X(0xFE9), X(0xFD6), X(0xFB4), X(0xF92), X(0xE71), X(0xC50), X(0xA40)];
  const ICE = [X(0xFFF), X(0xEFF), X(0xCEF), X(0xADF), X(0x8CF), X(0x7AE), X(0x69D), X(0x58C)];
  function drawCredits(k) {                                       // k: 0..1 through the roll
    P.clear(X(0x000));
    const LH = 13, total = CRED.length * LH, rest = 128 - (total - LH - 6);   // the last two lines come to rest mid-screen
    const y0 = Math.round(Math.max(rest, 262 - k * 1.06 * (262 - rest)));
    CRED.forEach(([s, kind], i) => {
      const y = y0 + i * LH; if (!s || y < -20 || y > 260) return;
      if (kind === 2) P.centre(s, y - 6, (r, j, sh) => sh === 2 ? X(0xFFF) : GOLD[r >> 1], { font: P.font16 });
      else P.centre(s, y, r => (kind ? ICE : GOLD)[r]);
    });
  }

  function draw(st, tgt, dawn) {
    const d2 = st.t - LEY.AT, lt = st.lt;
    let pose, uni;
    if (!dawn) {
      pose = poseCopla(d2); ripples(RIP, d2);
      uni = { uDawn: 0, uOut: -0.1, uSunE: 0.05, uCredA: 0, uCred: P.tex };
    } else {
      const z = zD(d2), k = sm(0, st.dur, lt), sw = Math.sin(z * 0.1);
      pose = { c: [sw * 0.4, 0.95 + 0.75 * k, z], t: [sw * 0.15, 1.05 + 0.95 * k, z + 3] };
      ripples(RIPD, d2);
      const C = LEY.chords; let n = 0, last = -9; for (const c of C) { if (c >= AD && c <= d2) { n++; last = c; } else if (c > d2) break; }
      const N = C.filter(c => c >= AD && c < TD_END).length || 1;
      const out = n ? (n - 1 + sm(0, 0.5, d2 - last)) / N : 0;      // each timpani hit puts out the next lanterns
      const credK = cl((d2 - LEY.barT[115]) / (LEY.barT[126] - LEY.barT[115]));
      drawCredits(credK); P.upload();
      uni = { uDawn: sm(0, 9, lt) * 0.92 + 0.08 * sm(9, st.dur, lt), uOut: -0.1 + 1.25 * out, uSunE: -0.035 + 0.2 * sm(0, st.dur, lt), uCred: P.tex,
        uCredA: sm(LEY.barT[115] - 0.5, LEY.barT[115] + 1, d2) * (1 - sm(LEY.barT[127] + 0.8, LEY.barT[128] + 0.8, d2)) };
    }
    G.draw(prog, { uRip: rip, uCam: pose.c, uTgt: pose.t, uFov: pose.fov || 1.35, ...uni }, tgt);
    const fade = dawn ? sm(0, 2.2, lt) * sm(st.dur, st.dur - 1.6, lt)
      : sm(0, 1.8, lt) * Math.min(1, 0.04 + Math.abs(d2 - T86) / 0.45, 0.04 + Math.abs(d2 - T70) / 0.4) * sm(st.dur, st.dur - 1.3, lt);
    return { bloom: dawn ? 0.5 : 0.7, thresh: dawn ? 0.85 : 0.6, expo: dawn ? 1.0 : 1.5, letter: 0.24, vig: 0.5, grain: 0.03, fade };
  }
  function init() {
    prog = G.program(FS, 'courtyard');
    const B = LEY.barT;
    A0 = LEY.sec('copla')[0]; AD = LEY.sec('dawn')[0]; TD_END = LEY.sec('dawn')[1];
    T70 = B[70]; T76 = B[76]; T78 = B[78]; T86 = B[86]; TEND = B[94];
    const mk = (m, i, f) => { const x = Math.max(-1.3, Math.min(1.3, (m.n - 68) * 0.11)), [fx, fz] = f(m.t, x, h1(i));
      return { t: m.t, x: fx, z: fz, a: 0.55 + 0.45 * h1(i * 3 + 1), wide: m.d > 0.85 }; };
    RIP = LEY.melody.filter(m => m.n >= 55 && m.t >= A0 - 1 && m.t < TEND).map((m, i) => mk(m, i, focus));
    RIPD = LEY.melody.filter(m => m.n >= 55 && m.t >= AD - 1 && m.t < TD_END).map((m, i) => mk(m, i, (t, x, h) => [x, zD(t) + 3 + h * 4.5]));
  }
  (window.SCENES = window.SCENES || []).push(
    { name: 'Courtyard', title: 'COPLA', disk: 2, scale: 0.7, init, draw: (s, t) => draw(s, t, false),
      range: () => [LEY.AT + LEY.sec('copla')[0], LEY.AT + LEY.sec('copla')[1]],
      caps: [{ at: 3.5, len: 5.5, title: 'COPLA', sub: 'EVERY NOTE FALLS INTO THE WATER', align: 'center', scale: 4, y: 978, hue: 215 }] },
    { name: 'Dawn', disk: 2, scale: 0.7, draw: (s, t) => draw(s, t, true),
      range: () => [LEY.AT + LEY.sec('dawn')[0], LEY.AT + LEY.sec('dawn')[1]] },
  );
})();
