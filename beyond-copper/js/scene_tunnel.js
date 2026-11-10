'use strict';
// =====================================================================
//  PART 5: TUNNEL - three generations of one effect, one texture, one
//  palette (8 ambers + 8 teals).
//   1990: a chunky 2x2 rotozoomer of a 32x32 XOR tile
//   1992: the same sheet is rolled up (a conformal fold z -> (z^k-1)/k,
//         k: 1 -> 0, the seam is the sheet's own edge) into the classic
//         lookup-table tunnel
//   2026: the raster beam passes and the tunnel is a place: the tiles are
//         inlaid emissive panels between wet metal ribs, kick-launched
//         light pulses run down the rings, the path starts to wind.
//  Old and new share one camera model, so the picture lines up across the beam.
// =====================================================================
(() => {
  const AMB = [0x100, 0x310, 0x620, 0x940, 0xC60, 0xE80, 0xFB3, 0xFE9], TEAL = [0x011, 0x022, 0x044, 0x066, 0x088, 0x0AA, 0x4CC, 0xAFE];
  const v3 = h => `vec3(${(((h >> 8) & 15) / 15).toFixed(4)},${(((h >> 4) & 15) / 15).toFixed(4)},${((h & 15) / 15).toFixed(4)})`;
  const FS = `
const vec3 PAL[16]=vec3[16](${[...AMB, ...TEAL].map(v3).join(',')});
uniform float uFold, uPersp, uZ, uRoll, uWarp, uAmp, uZoom, uPl, uKickAge, uPunch;
uniform vec2 uOff;
const float R=2., NA=12., S=NA*32./TAU, TL=TAU*R/NA, FOC=1.1, R0=.45, RIB=6.*TL;
// so that the post chain's ACES gives back exactly the 12-bit palette colour
vec3 invAces(vec3 y){ y=clamp(y,0.,.97); vec3 a=2.51-2.43*y, b=.03-.59*y, c=-.14*y; return (-b+sqrt(b*b-4.*a*c))/(2.*a); }
// the one texture: p in texels, 32 per tile. returns (shade 0..7, ramp 0 amber / 1 teal, groove)
vec3 tileTex(vec2 p){
  vec2 f=floor(p); ivec2 i=ivec2(f), c=i&31, t=i>>5;
  float chk=float((t.x+t.y)&1);
  float v=float((c.x^c.y)&31)/31.;
  float pl=.5+.5*sin(f.y*.0490874+sin(f.x*.031+uPl)*1.7+uPl*1.3);          // plasma band, periodic around the tunnel
  float idx=clamp(floor((v*.8+pl*.42-.16)*8.),0.,7.);
  bool gr=c.x<1||c.y<1||c.x>30||c.y>30;
  if(!gr&&(c.x==1||c.y==1)) idx=min(idx+2.,7.);
  if(!gr&&(c.x==30||c.y==30)) idx=max(idx-2.,0.);
  if(abs(float(c.x)-15.5)<2.&&abs(float(c.y)-15.5)<2.){ idx=7.; chk=1.-chk; }  // a rivet of the other colour
  return vec3(gr?0.:idx,chk,gr?1.:0.);
}
vec3 palC(float idx, float ramp){ return PAL[int(clamp(idx,0.,7.))+(ramp>.5?8:0)]; }

// ---- 1990/1992: rotozoomer folding into the lookup-table tunnel ----
vec3 oldFx(vec2 uv){
  vec2 q=rot(uRoll)*uv; float r=max(length(q),1e-4), th=atan(q.y,q.x);
  float k=max(uFold,.02);
  vec2 wk=(pow(r/R0,k)*vec2(cos(k*th),sin(k*th))-vec2(1.,0.))/k;
  vec2 w=mix(vec2(log(r/R0),th),wk,smoothstep(.02,.15,uFold));
  w.x=mix(w.x,-FOC/r,uPersp);
  vec3 tt=tileTex(w*S*uZoom+uOff);
  float dark=uPersp*floor(smoothstep(.34,.02,r)*8.)+(1.-uFold)*(1.-uPersp)*floor(smoothstep(.2,.0,r)*8.);
  return palC(tt.x-dark,tt.y)*step(dark,tt.x+.5);
}

// ---- 2026: the same tunnel as a place ----
vec2 path(float z){ return uAmp*vec2(sin(z*.11)*2.+sin(z*.047)*1.4, cos(z*.09)*1.5-1.5); }
float ribZ(float z){ return mod(z+RIB*.5,RIB)-RIB*.5; }
float map(vec3 p){
  vec2 c=p.xy-path(p.z); float r=length(c), th=atan(c.y,c.x);
  vec2 f=abs(fract(vec2(p.z/TL,th/TAU*NA))-.5); float g=.5-max(f.x,f.y);
  float rz=abs(ribZ(p.z));
  return R-r+.035*smoothstep(.04,.0,g)-.15*smoothstep(.27,.13,rz)-.03*smoothstep(.07,.03,rz);
}
vec3 nrm(vec3 p){ vec2 e=vec2(.004,0.); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }
float ringB(float zr){ float dz=zr-uZ; return .3+3.2*exp(-pow((dz-uKickAge*75.)*.11,2.))*exp(-uKickAge*2.2); }
const vec3 RINGC=vec3(1.,.5,.13), TEALC=vec3(.05,.85,.75);
vec3 tunnel3d(vec2 uv){
  float z=uZ; vec3 ro=vec3(path(z),z), ta=vec3(path(z+3.),z+3.);
  vec3 f=normalize(ta-ro), rg=normalize(cross(vec3(0,1,0),f)), up=cross(f,rg);
  vec2 q=rot(uRoll)*uv; float F=FOC*(1.-.5*uWarp)-uPunch;
  vec3 rd=normalize(f*F+q.x*rg+q.y*up);
  float t=.05; vec3 glow=vec3(0.); bool hit=false;
  for(int i=0;i<100;i++){
    vec3 p=ro+rd*t; float d=map(p);
    float rz=ribZ(p.z), zr=p.z-rz;
    glow+=RINGC*ringB(zr)*.0011/(.03+rz*rz)*d;
    if(d<.0012*t){ hit=true; break; } if(t>90.) break; t+=d*.85;
  }
  vec3 haze=vec3(.002,.011,.014);
  vec3 col=haze;
  if(hit){
    vec3 p=ro+rd*t, n=nrm(p);
    vec2 c=p.xy-path(p.z); float th=atan(c.y,c.x);
    vec2 fc=abs(fract(vec2(p.z/TL,th/TAU*NA))-.5); float g=.5-max(fc.x,fc.y);
    float rz=ribZ(p.z), zr=p.z-rz, arz=abs(rz), B=ringB(zr);
    vec3 tt=tileTex(vec2(-p.z/TL*32.,th*S));
    float lod=smoothstep(.35,1.6,t/(uRes.y*F)*32./TL);                 // far away the texels melt into the tile's mean
    vec3 pc=mix(pow(palC(tt.x,tt.y),vec3(2.2)),pow(palC(3.,tt.y),vec3(2.2))*1.25,lod);
    float tileM=smoothstep(.2,.3,arz)*smoothstep(.0,.03,g);
    float breathe=.75+.25*sin(floor(-p.z/TL)*1.7+floor(th/TAU*NA)*2.3+uTime*2.);
    vec3 emi=pc*(.07+1.1*pow(tt.x/7.,2.2)*(1.-lod)+.3*lod)*tileM*breathe;
    emi+=TEALC*smoothstep(.03,.0,g)*smoothstep(.25,.32,arz)*(.12+uHat*1.6);          // grooves flicker on the hats
    emi+=mix(RINGC,vec3(1.,.9,.6),clamp(B*.2,0.,1.))*smoothstep(.05,.02,arz)*B*1.7;   // the light strip in each rib
    vec3 V=-rd; float fre=.06+.94*pow(1.-max(dot(n,V),0.),5.);
    vec3 rr=reflect(rd,n), spec=vec3(0.);
    float sg=rr.z>0.?1.:-1.;
    for(int i=0;i<4;i++){                                              // wet streaks: the next rings mirrored in the wall
      float zi=zr+float(i)*RIB*sg, s=(zi-p.z)/rr.z; if(s<=0.02) continue;
      vec3 qq=p+rr*s; float dr=length(qq.xy-path(zi))-(R-.17);
      spec+=RINGC*ringB(zi)*exp(-dr*dr*26.)/(1.+s*.12);
    }
    vec3 pool=RINGC*B*exp(-arz*1.3);                                    // light pooling around each ring
    vec3 alb=mix(vec3(.05,.052,.058),vec3(.02)+pc*.25,tileM);
    col=alb*min(pool,vec3(2.5))*.7+emi+spec*fre*1.5;
    col=mix(col,haze,1.-exp(-t*.028));
  }
  col+=glow*.6;
  float hs=hash21(floor(vec2(atan(uv.y,uv.x)*90.,3.)));
  float sl=smoothstep(1.-.45*uWarp,1.,hs)*uWarp*smoothstep(.1,.75,length(uv));
  return col+vec3(1.,.62,.22)*sl*2.5+vec3(1.,.8,.5)*pow(uWarp,3.)*exp(-length(uv)*5.)*2.;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 col=isOld()>.5?invAces(oldFx(uv)):tunnel3d(uv);
  fragColor=vec4(col,1.);
}`;
  let prog, zTab = null;
  const PAT = MUSIC.PAT, DT = 0.01;
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const warpAt = (lt, dur) => sm(dur - 2.7, dur, lt);
  const speed = (lt, dur) => 6.5 * sm(3, 5.6, lt) + 3 * sm(PAT, PAT + 3, lt) + 6 * sm(PAT, 2.6 * PAT, lt) + 34 * Math.pow(warpAt(lt, dur), 2);
  const zAt = (lt, dur) => {                                      // forward distance = integral of speed (tabulated: seek-safe)
    if (!zTab) { zTab = new Float32Array(Math.ceil(dur / DT) + 2); for (let i = 1; i < zTab.length; i++) zTab[i] = zTab[i - 1] + speed((i - 0.5) * DT, dur) * DT; }
    const x = Math.min(zTab.length - 2, Math.max(0, lt / DT)), i = x | 0; return zTab[i] + (zTab[i + 1] - zTab[i]) * (x - i);
  };
  function draw(st, tgt) {
    const beam = sm(PAT, PAT + 1.4, st.lt);
    const lt = beam < 1 ? Math.floor(st.lt * 50) / 50 : st.lt;      // 50 Hz until the beam has passed
    const fold = 1 - sm(3.0, 5.6, lt), fs = fold * fold * (3 - 2 * fold), warp = warpAt(lt, st.dur), z = zAt(lt, st.dur);
    const zoom = 1 + (0.15 + 0.75 * Math.sin(lt * 1.3)) * fs;
    const roll = 0.55 * lt * (1 - sm(2.5, 6, lt)) + 0.55 * 4.25 * sm(2.5, 6, lt) + Math.sin(lt * 0.21) * 0.5 * sm(5, 10, lt);
    const ox = lt * 46 * fs + Math.sin(lt * 0.9) * 30 * fs - z * 32 / (2 * Math.PI * 2 / 12), oy = Math.cos(lt * 0.7) * 70 * fs;
    G.draw(prog, { uBeam: beam, uFold: fold, uPersp: sm(4.8, 6.6, lt), uZ: z, uRoll: roll, uWarp: warp, uAmp: sm(PAT + 1.2, PAT + 6, lt),
      uZoom: zoom, uOff: [ox, oy], uPl: lt * 0.8, uKickAge: Math.min(4, MUSIC.since('kick', st.t)), uPunch: 0.05 * st.kick * sm(PAT + 1.4, PAT + 3, lt) }, tgt);
    const end = st.dur - st.lt, crt = 1 - sm(PAT + 1.0, PAT + 2.4, st.lt);
    return { lines: 128, scan: 256, ocs: 1, beam, crt, fa: 1.25 + (st.W / st.H - 1.25) * sm(PAT + 1.3, PAT + 2.9, st.lt),
      bloom: 0.22 + 0.5 * beam, thresh: 0.75, expo: 1, aberr: 0.15 + warp * 2.2, vig: 0.5 - 0.15 * crt,
      flash: Math.pow(Math.max(0, 1 - end / 0.45), 2), fade: Math.min(1, st.lt * 6) };
  }
  (window.SCENES = window.SCENES || []).push({
    name: 'Tunnel', from: 15, to: 18, draw, scale: 0.85, tube: 0.5, init() { prog = G.program(FS, 'tunnel'); },
    caps: [{ at: PAT + 2.2, len: 4.5, title: 'TUNNEL', sub: 'THE SAME 32 TEXELS, GOING DEEPER', hue: 32 }],
  });
})();
