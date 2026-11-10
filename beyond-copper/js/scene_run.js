'use strict';
// =====================================================================
//  DISK 2, LEVEL 1: "RUN" - the multi-layer parallax action game.
//  Bars 8-24 of Asturias. THEN: a copper-gradient dusk, a dithered moon,
//  seven flat parallax layers and a silhouette runner inside the CRT.
//  The raster beam passes at bar 12 and the same level gains real depth:
//  27 layers with atmospheric perspective, moon shafts through the
//  aqueduct arches, mist, a reflecting lake, fireflies, a ribbon of
//  light behind the hero.  The music plays the game: every thumb-melody
//  note is a footfall, every second bar a leap across a stream.
//  All coordinates are 320x256 "lo-res pixels" (y up, origin at centre).
// =====================================================================
(() => {
  const FS = PIX.GLSL + `
uniform sampler2D uAtlas, uMsg;
uniform float uS, uJt, uJd, uJh, uScore, uLt, uVpx, uWind, uGlow, uZoom;
uniform vec4 uGap, uFoot[6];
uniform vec2 uJ[19];
const float WY=-30., GY=-80., HX=-34.;
const vec2 MOON=vec2(-78.,62.), LGT=vec2(-.41,.91);   // LGT: key light on the hero, from the moon side
#define NR 12
#define NH 8
float old_, aaw, refl_;
vec3 invAces(vec3 y){ y=clamp(y,0.,1.02); vec3 a=2.43*y-2.51, b=.59*y-.03, c=.14*y; return (-b-sqrt(max(b*b-4.*a*c,0.)))/(2.*a); }
vec3 o12(vec3 c){ return invAces((min(floor(clamp(c,0.,1.)*15.+.5),14.)+.02)/15.); }
vec3 H(int h){ return vec3(float((h>>8)&15),float((h>>4)&15),float(h&15))/15.; }
float bay(vec2 p){ ivec2 i=ivec2(mod(p,4.)); const float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return (m[i.y*4+i.x]+.5)/16.; }
float vn(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(hash11(i),hash11(i+1.),f); }
float scr(float par){ return old_>.5 ? floor(uS*par) : uS*par; }
float edge(float d){ return old_>.5 ? step(d,0.) : smoothstep(aaw,-aaw,d); }
float sdCap(vec2 p, vec2 a, vec2 b, float ra, float rb){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-mix(ra,rb,h); }

// ------------------------------- sky -------------------------------
vec3 skyGrad(float y){
  float f=clamp((y-WY)/158.,0.,1.);
  vec3 c=mix(vec3(1.,.56,.2),vec3(.9,.28,.36),smoothstep(0.,.2,f));
  c=mix(c,vec3(.52,.14,.46),smoothstep(.13,.42,f));
  c=mix(c,vec3(.2,.07,.34),smoothstep(.36,.66,f));
  return mix(c,vec3(.035,.02,.13),smoothstep(.6,1.,f));
}
vec3 sky(vec2 P, vec2 cell){
  vec2 d=(P-MOON)/22.; float r=length(d);
  if(old_>.5){
    vec3 c=skyGrad(floor((P.y-WY)/2.)*2.+WY);                       // copper: a new colour every other raster line
    float h=hash21(cell+7.);
    if(P.y>26.&&h>.9915) c=fract(h*77.+floor(uLt*3.)*.37)>.3?H(0xCCE):H(0x77A);
    if(r<1.){ float f=dot(d,normalize(vec2(.75,-.55)))*.5+.5, b=bay(cell);
      f+=.35*smoothstep(.34,.2,length(d-vec2(-.3,.25)))+.3*smoothstep(.2,.1,length(d-vec2(.2,-.35)))+.25*smoothstep(.16,.08,length(d-vec2(-.45,-.3)));
      c=f>.86+(b-.5)*.3?H(0xB97):f>.5+(b-.5)*.4?H(0xDC9):H(0xFEB); }
    return c;
  }
  vec3 c=skyGrad(P.y)*.85;
  vec2 g=floor(P*1.6), f=fract(P*1.6)-.5; float h=hash21(g);
  c+=vec3(.8,.85,1.)*step(.985,h)*smoothstep(.45,.0,length(f))*smoothstep(10.,60.,P.y)*(.5+.5*sin(uLt*3.+h*90.))*1.5;
  float cl=fbm(vec2(P.x*.012+uLt*.01,P.y*.045+3.))*smoothstep(-20.,40.,P.y);
  c=mix(c,vec3(.32,.2,.42)+vec3(.5,.5,.8)*exp(-length(P-MOON)*.012),smoothstep(.5,.85,cl)*.5);
  float mg=exp(-max(r-1.,0.)*1.1)*.5+exp(-max(r-1.,0.)*.22)*.22;
  c+=vec3(.75,.8,1.)*mg*(1.+uGlow*.5);
  if(r<1.03){ float cr=fbm(d*3.+5.)*.5+.3*smoothstep(.34,.15,length(d-vec2(-.3,.25)))+.25*smoothstep(.2,.08,length(d-vec2(.2,-.35)));
    float lim=sqrt(max(1.-r*r,0.));
    vec3 m=vec3(1.,.95,.82)*(2.6-cr*1.3)*(.55+.45*lim)*(1.-.35*smoothstep(-.2,.9,dot(d,normalize(vec2(.75,-.55)))));
    c=mix(c,m,smoothstep(1.03,.97,r)); }
  return c;
}

// --------------------------- the far world ---------------------------
float ridge(float x, float k){ float n=0., a=.5, f=1.; for(int i=0;i<4;i++){ n+=a*(1.-abs(vn(x*f+k*17.3)*2.-1.)); f*=2.13; a*=.5; } return n; }
float aqD(vec2 P){                         // the aqueduct: one tier of tall arches standing in the lake
  float x=P.x+scr(.46), y=P.y-WY; if(y>42.||y<-2.) return 9.;
  float a=floor(x/46.), lx=x-a*46.-23.;
  float dO=y>16.?length(vec2(lx,y-16.))-17.:abs(lx)-17.;
  float d=max(y-41.,-dO), hs=hash11(a+3.);
  if(hs<.16) d=max(d,y-(7.+hs*130.+2.5*sin(x*.8)+1.5*sin(x*2.3)));            // a ruined span
  return d;
}
float palm(vec2 q, float Hp, float sc){     // q relative to the trunk base
  float d=9.;
  if(q.y<Hp+1.) d=abs(q.x-3.*sin(q.y/Hp*1.3))-(1.15-.5*q.y/Hp)*sc;
  d=max(d,-q.y);
  vec2 c=q-vec2(3.*sin(1.3),Hp);
  if(dot(c,c)<200.*sc*sc){
    for(int k=0;k<7;k++){ float an=-.55+float(k)*.71, L=10.*sc*(.8+.3*hash11(float(k)+Hp)); vec2 a=vec2(0.);
      for(int s=1;s<=3;s++){ float t=float(s)/3.; vec2 b=L*vec2(cos(an)*t,sin(an)*t-.85*t*t); d=min(d,sdCap(c,a,b,.9*sc,.35*sc)); a=b; } }
  }
  return d;
}
vec4 far(vec2 P, vec2 cell){               // front to back: aqueduct, far shore hills, sierras, sky
  vec3 col=vec3(0.); float acc=0.;
  vec3 haze=vec3(.95,.5,.3);
  float da=aqD(P);
  if(da<aaw){
    float a=edge(da), x=P.x+scr(.46), y=P.y-WY, lx=mod(x,46.)-23.; vec3 c;
    if(old_>.5) c=(y>39.||(lx>17.&&lx<19.))?H(0x648):H(0x314);
    else { c=vec3(.085,.04,.14)+vec3(.3,.3,.55)*(exp(-max(lx-17.,0.)*.6)*step(17.,lx)*.5+exp(-(41.-y)*.9)*.6);
      c*=.75+.5*hash21(floor(vec2(x*.25,y*.3))); c=mix(c,haze*.5,.12); }
    col+=(1.-acc)*a*c; acc+=(1.-acc)*a;
  }
  for(int j=NH-1;j>=0;j--){
    if(acc>.995) break;
    if(old_>.5&&j!=NH-1&&j!=NH-4) continue;
    float fj=float(j)/float(NH-1), x=P.x+scr(mix(.28,.42,fj)), fo=float(j);
    float base=mix(13.,4.,fj)+vn(x/55.+fo*9.1)*mix(8.,5.,fj)+vn(x/19.+fo*3.7)*2.5;
    if(P.y-WY>base+34.) continue;
    float w=mix(15.,21.,fj), c=floor(x/w), h=hash11(c*1.37+fo*17.), lx=x-(c+.5)*w-(h-.5)*w*.5, t=0.;
    float d=P.y-WY-base;
    if(h>.45){ float Ht=mix(9.,17.,fract(h*7.3))*mix(.75,1.35,fj), hw=1.2+Ht*.11; d=P.y-WY-base-Ht*pow(max(0.,1.-abs(lx)/hw),.6); }
    else if(h<.2&&refl_<.5&&(j==NH-1||j==NH-3)){ float cx=(c+.5)*w+(h-.5)*w*.5, sc=mix(.75,1.2,fj);
      float b2=mix(13.,4.,fj)+vn(cx/55.+fo*9.1)*mix(8.,5.,fj)+vn(cx/19.+fo*3.7)*2.5;
      d=min(d,palm(vec2(lx,P.y-WY-b2+1.),mix(15.,24.,fract(h*31.))*sc,sc)); }
    float a=edge(d); if(a<=0.) continue;
    vec3 cc;
    if(old_>.5) cc=j==NH-1?H(0x201):H(0x313);
    else { cc=mix(vec3(.2,.085,.2),vec3(.035,.015,.07),pow(fj,.7)); cc=mix(cc,haze*.45,(1.-fj)*.3);
      cc+=vec3(.25,.28,.5)*exp(d*1.2)*.22*(.4+.6*fj); }
    col+=(1.-acc)*a*cc; acc+=(1.-acc)*a;
  }
  for(int k=NR-1;k>=0;k--){
    if(acc>.995) break;
    if(old_>.5&&k!=2&&k!=6&&k!=10) continue;
    float fk=float(k)/float(NR-1), x=P.x+scr(mix(.03,.2,fk));
    float top=mix(30.,8.,fk)+ridge(x/mix(95.,52.,fk),float(k))*mix(62.,27.,fk);
    float d=P.y-WY-top, a=edge(d); if(a<=0.) continue;
    vec3 cc;
    if(old_>.5) cc=k==2?H(0xA46):k==6?H(0x735):H(0x424);
    else { cc=mix(vec3(.72,.3,.3),vec3(.1,.045,.17),pow(fk,.75));
      cc=mix(cc,haze*.75,smoothstep(0.,-55.,d)*.55*(1.-fk*.5)); cc+=vec3(.3,.3,.5)*exp(d*.5)*.1; }
    col+=(1.-acc)*a*cc; acc+=(1.-acc)*a;
  }
  if(acc<.995) col+=(1.-acc)*sky(P,cell);
  return vec4(col,1.);
}
float shaft(vec2 P){                       // 2D shadow cast by the aqueduct against the moon: light pours through the arches
  if(P.y>WY+41.) return .35;
  float lit=0.; vec2 dir=(MOON-P)/(MOON.y-P.y);
  float y0=max(P.y,WY);
  for(int i=0;i<10;i++){ float y=mix(y0,WY+41.5,(float(i)+.5)/10.); lit+=smoothstep(-1.,1.5,aqD(P+dir*(y-P.y))); }
  return pow(lit/10.,3.);
}

// ------------------------------ the hero ------------------------------
// A slim, tall (7 heads) prince in a loose ivory shirt and baggy trousers gathered at the ankles, a narrow
// red sash, dark hair and slippers.  The pose (19 joints) is solved once per frame in JS (see pose()):
// 0 hip, 1 shoulder line, 2 neck, 3 head centre, 4 head up-vector, 5-7 near knee/ankle/toe, 8-10 far leg,
// 11-12 near elbow/wrist, 13-14 far arm, 15-17 sash knot/middle/tip, 18 trunk up-vector.
// Six paint layers, back to front: far arm, far leg, torso, near leg, head, near arm.  Each layer keeps its
// distance hD, material hM (0 cloth 1 skin 2 hair 3 sash 4 slipper 5 eye), a rounded normal hN (axis->edge,
// length 0..1, for banded / lit shading) and hC, the crease where two of its capsules meet (cloth folds).
float jy(float tt){ float j=tt/uJd; return (j>0.&&j<1.)?uJh*4.*j*(1.-j):0.; }
float scarfY(float d, float y0){           // height of the light trail d pixels behind the sash
  float tt=uJt-d/uVpx;
  return y0+jy(tt)-jy(uJt)+1.5+d*.02+sin(d*.2/(1.+d*.01)-uLt*9.)*(.5+2.4*(1.-exp(-d/22.)))*(1.+.4*uWind);
}
float hD[6], hM[6], hC[6]; vec2 hN[6];
vec3 capN(vec2 p, vec2 a, vec2 b, float ra, float rb){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-4),0.,1.);
  vec2 q=pa-ba*h; float r=mix(ra,rb,h); return vec3(length(q)-r,q/r); }
void put(int L, vec3 c, float m){
  float o=hD[L]; hC[L]=max(hC[L],smoothstep(.7,0.,abs(c.x-o))*step(max(c.x,o),-.25));
  if(c.x<o){ hD[L]=c.x; hM[L]=m; hN[L]=c.yz; }
}
float hero(vec2 P){
  for(int i=0;i<6;i++){ hD[i]=1e3; hM[i]=0.; hC[i]=0.; hN[i]=vec2(0.); }
  vec2 H=uJ[0], C=uJ[1], N=uJ[2], Hd=uJ[3], hu=uJ[4], up=uJ[18], f=vec2(up.y,-up.x), hf=vec2(hu.y,-hu.x);
  for(int i=0;i<2;i++){                       // legs: i=0 near (layer 3), i=1 far (layer 1)
    int L=3-2*i; vec2 K=uJ[5+i*3], A=uJ[6+i*3], T=uJ[7+i*3];
    vec2 B=mix(K,A,.62)+vec2(-.8,0.);           // baggy trousers billow out behind the calf ...
    put(L,capN(P,H,K,3.4,2.7),0.);
    put(L,capN(P,K,B,2.6,3.15),0.);
    put(L,capN(P,B,A,3.15,1.5),0.);             // ... and gather at the ankle
    vec2 fd=normalize(T-A), fn=vec2(-fd.y,fd.x);
    put(L,capN(P,A-fd*.8-fn*.2,T,1.3,.7),4.);
    put(L,capN(P,T,T+normalize(fd+fn*1.6),.6,.35),4.);   // pointed, upturned slipper toe
  }
  for(int i=0;i<2;i++){                       // arms: i=0 near (layer 5), i=1 far (layer 0)
    int L=5-5*i; vec2 S=C-up*1.1, E=uJ[11+i*2], W=uJ[12+i*2], ad=normalize(W-E);
    put(L,capN(P,S,E,2.1,1.75),0.);
    put(L,capN(P,E,W,1.1,.95),1.);              // bare forearm ...
    put(L,capN(P,E,mix(E,W,.42),1.8,2.05),0.);  // ... under a loose sleeve that ends below the elbow
    put(L,capN(P,W,W+ad*1.6,1.15,.95),1.);
  }
  put(2,capN(P,H-up*.4,H+up*7.+f*.6,3.9,4.15),0.);  // the loose shirt, bloused over the sash
  put(2,capN(P,H+up*7.+f*.6,C,4.15,3.5),0.);
  float sb=dot(P-H,up); if(hD[2]<0.&&sb>.9&&sb<2.9) hM[2]=3.;
  put(2,capN(P,uJ[15],uJ[16],1.,.85),3.); put(2,capN(P,uJ[16],uJ[17],.85,.45),3.);   // the sash end
  put(4,capN(P,N-up*.8,Hd-hu*2.,1.4,1.3),1.);                                       // neck
  put(4,vec3(length(P-Hd)-3.15,(P-Hd)/3.15),1.);                                    // small head
  put(4,capN(P,Hd+hf*.2,Hd+hf*1.4-hu*2.3,2.5,1.1),1.);                              // jaw
  put(4,capN(P,Hd+hf*2.9+hu*.3,Hd+hf*3.5-hu*.4,.5,.4),1.);                          // nose
  put(4,capN(P,Hd-hf*1.2+hu*1.1,Hd-hf*2.4-hu*2.7,2.5,1.4),2.);                      // dark hair down to the nape
  vec2 r=P-Hd; float ra=dot(r,hf), rb=dot(r,hu);
  if(hD[4]<0.&&hM[4]==1.&&rb>-2.2){ if(rb>1.45-.25*ra||ra<-.6) hM[4]=2.; if(abs(ra-1.85)<.42&&abs(rb+.15)<.42) hM[4]=5.; }
  return min(min(min(hD[0],hD[1]),min(hD[2],hD[3])),min(hD[4],hD[5]));
}
vec3 matCol(float m){ return m<.5?vec3(.9,.87,.78):m<1.5?vec3(.82,.52,.32):m<2.5?vec3(.1,.055,.035):m<3.5?vec3(.62,.1,.08):m<4.5?vec3(.22,.1,.06):vec3(.03); }
const int HPAL[24]=int[24](0xFFE,0xDDC,0x99A,0x547, 0xEB8,0xC86,0xA54,0x632, 0x543,0x321,0x210,0x100,
                            0xE43,0xB22,0x712,0x401, 0x743,0x522,0x311,0x200, 0x000,0x000,0x000,0x000);

// ------------------------------ pixel text ------------------------------
float txt(vec2 P, vec2 o, float i0, float n, float sc){
  vec2 l=vec2(P.x-o.x,o.y-P.y)/(8.*sc); if(l.x<0.||l.x>=n||l.y<0.||l.y>=1.) return 0.;
  return pixGlyph(uAtlas,pixMsg(uMsg,i0+floor(l.x)),vec2(fract(l.x),l.y));
}
float num(vec2 P, vec2 o, float v, float nd){
  vec2 l=vec2(P.x-o.x,o.y-P.y)/8.; if(l.x<0.||l.x>=nd||l.y<0.||l.y>=1.) return 0.;
  return pixGlyph(uAtlas,16.+mod(floor(v/pow(10.,nd-1.-floor(l.x))+.001),10.),vec2(fract(l.x),l.y));
}

void main(){
  float asp=uRes.x/uRes.y; old_=isOld(); aaw=256./uRes.y*.9/uZoom; refl_=0.;
  vec2 cell=floor(vUv*vec2(256.*asp,256.));
  vec2 P=old_>.5 ? cell+.5-vec2(128.*asp,128.) : (vUv-.5)*vec2(256.*asp,256.)/uZoom+vec2(HX+34.,-52.)*(1.-1./uZoom);
  vec3 col; float gS=scr(1.), gx=P.x+gS;
  float gap=min(abs(gx-uGap.x)-uGap.y,abs(gx-uGap.z)-uGap.w)+(GY-P.y)*.22;
  float gtop=GY+(old_>.5 ? step(.62,hash11(floor(gx/3.)))*step(3.,gap) : (noise(vec2(gx*.9,1.))*1.6+pow(noise(vec2(gx*2.7,5.)),3.)*3.)*smoothstep(0.,4.,gap));
  float dg=max(P.y-gtop,-gap);

  // ---- far world, or its reflection in the lake ----
  if(P.y>=WY){
    col=far(P,cell).rgb;
    if(old_<.5){
      float sh=shaft(P), md=exp(-pow((P.y-WY-6.)/20.,2.));
      float mist=fbm(vec2((P.x+uS*.5)*.014+uLt*.015,P.y*.09))*md;
      col+=vec3(.5,.56,.95)*sh*(.1+.26*md+mist*.35)*exp(-length(P-MOON)*.0045)*(1.+uGlow*.9);
      col=mix(col,vec3(.5,.42,.6),mist*.28);
    }
  } else {
    float dep=WY-P.y;
    if(old_>.5){
      float row=cell.y; vec2 Pm=vec2(P.x+floor(sin(row*.9+floor(uLt*10.)*.55)*1.6+.5),2.*WY-P.y);
      refl_=1.; col=far(Pm,floor(Pm)).rgb*vec3(.6,.52,.78); refl_=0.;
      // the moon's glitter path: a dash on every other line, widening towards the viewer, shimmering at 12.5 Hz
      float ph=floor(uLt*12.5), hw=(1.5+dep*.2)*(.5+.5*sin(row*2.4+ph*.9)), dx=abs(P.x-MOON.x-floor(sin(row*1.7+ph*.35)*(1.+dep*.07)+.5));
      if(mod(row,2.)<1.&&dep>2.&&hw>.8&&dx<hw) col=dx<hw-1.5?H(0xFEB):H(0xC9A);
    } else {
      vec2 Pm=vec2(P.x+sin(P.y*.9+uLt*2.2)*(1.+dep*.07)+sin(P.y*2.7-uLt*3.1)*.5,2.*WY-P.y+sin(P.x*.11+uLt*1.3)*.6);
      col=far(Pm,cell).rgb*vec3(.5,.48,.72)*mix(1.,.55,smoothstep(0.,50.,dep));
      float sh=shaft(Pm);
      col+=vec3(.5,.56,.95)*sh*.1*exp(-length(Pm-MOON)*.0045);
      float pw=7.+dep*.42, px=(P.x-MOON.x)/pw;                                    // the moon's glitter path: thin
      float gl=pow(noise(vec2(P.x*.33+sin(P.y*1.3+uLt*1.7)*1.2,P.y*2.6+uLt*1.6)),6.)*exp(-px*px);   // wave crests, not static
      col+=vec3(1.,.93,.8)*gl*(2.6+1.6*uGlow)*smoothstep(0.,3.,dep);
      float mist=fbm(vec2((P.x+uS*.7)*.016-uLt*.02,P.y*.11+9.))*exp(-dep*.06);
      col=mix(col,vec3(.5,.42,.62),mist*.4);
    }
  }

  // ---- the near bank ----
  if(dg<aaw){
    float a=edge(dg), dp=gtop-P.y; vec3 c;
    if(old_>.5){ c=dp<2.?H(0x756):(dp<4.&&bay(cell)>.5)?H(0x423):H(0x201); if(gap<3.&&dp>=2.&&dp<14.) c=H(0x423);
      if(hash21(floor(vec2(gx,P.y)/2.))>.985&&dp>5.) c=H(0x312); }
    else { c=mix(vec3(.035,.016,.055),vec3(.006,.004,.012),smoothstep(0.,40.,dp));
      c+=vec3(.32,.36,.62)*exp(-dp*.75)*(.55+.45*noise(vec2(gx*.6,3.)))*(1.+uGlow*.6);
      c+=vec3(.2,.16,.3)*exp(-max(gap,0.)*.5)*smoothstep(16.,2.,dp)*.6;
      c+=vec3(.05,.03,.06)*noise(vec2(gx*.21,P.y*.3)); }
    col=mix(col,c,a);
  }
  // ---- footfalls: dust puffs then, rings of light now ----
  for(int i=0;i<6;i++){
    vec4 F=uFoot[i]; if(F.y<0.||F.y>1.2) continue;
    vec2 c=vec2(F.x-gS,GY); float ag=F.y;
    if(old_>.5){
      if(ag<.32){ vec2 q=P-c-vec2(-3.-ag*26.,1.5+ag*16.); vec2 q2=P-c-vec2(-7.-ag*14.,1.+ag*7.);
        if(max(abs(q.x),abs(q.y))<1.6-ag*2.||max(abs(q2.x),abs(q2.y))<1.1) col=H(0x978); }
    } else {
      float rr=length((P-c)*vec2(1.,3.6)), R=3.+ag*46.;
      col+=vec3(1.,.55,.16)*(exp(-pow((rr-R)*.45,2.))*exp(-ag*4.2)*2.2+exp(-rr*.22)*exp(-ag*9.)*3.)*F.z*smoothstep(1.5,-.5,dg-1.5);
      for(int k=0;k<4;k++){ float fk=float(k)+F.x*.37; vec2 v=vec2(-28.+34.*hash11(fk),30.+34.*hash11(fk*1.7));
        vec2 sp=c+vec2(0.,1.)+v*ag-vec2(0.,95.)*ag*ag; col+=vec3(1.,.7,.3)*exp(-dot(P-sp,P-sp)*1.4)*exp(-ag*5.)*5.*F.z; }
    }
  }
  // ---- hero ----
  if(abs(P.x-HX)<52.&&P.y>GY-3.&&P.y<GY+95.||(old_<.5&&P.x<HX&&P.x>HX-190.)){
    float hd=hero(P);
    int T=-1; for(int i=0;i<6;i++) if(hD[i]<0.) T=i;          // the top paint layer under this pixel
    if(old_>.5){
      // hand-pixelled look: 4 hard shades per material, far limbs one shade down, contact shadows under the
      // layers in front, fold pixels where capsules meet, and a dark rim on the shadow side
      if(T>=0){
        float occ=1.; for(int i=T+1;i<6;i++) occ=min(occ,smoothstep(0.,1.6,hD[i]));
        float lv=dot(hN[T],LGT)+.12-(T<2?.5:0.)-(1.-occ)*.8-hC[T]*.55;
        if(hD[T]>-.95&&lv<0.) lv-=.6;
        int b=lv>.42?0:lv>-.12?1:lv>-.62?2:3;
        col=H(HPAL[int(hM[T]+.5)*4+b]);
      }
    } else {
      vec2 tp=uJ[17]; float dx=tp.x-P.x;
      if(dx>0.){ float yy=scarfY(dx,tp.y), dd=abs(P.y-yy);                     // a faint trail of light, left
        float w=1.2+dx*.02;                                                     // behind, not tied to him
        col+=vec3(1.,.5,.12)*(exp(-dd*dd/(w*w))*1.5+exp(-dd*.3)*.14)*exp(-dx/(52.+60.*uWind))*smoothstep(1.,16.,dx); }
      for(int i=0;i<6;i++){ float w=edge(hD[i]); if(w<=0.) continue;
        float occ=1.; for(int j=i+1;j<6;j++) occ*=mix(.5,1.,smoothstep(0.,2.2,hD[j]));
        vec2 n=hN[i]; float lv=dot(n,LGT), fr=i<2?.62:1.;
        vec3 c=matCol(hM[i]);
        vec3 b=c*(.22+.52*clamp(lv*.6+.5,0.,1.))*occ*fr*(1.-.4*hC[i]);
        float rim=pow(max(dot(normalize(n+1e-5),normalize(MOON-P)),0.),2.)*smoothstep(-1.8,-.1,hD[i])*smoothstep(.4,.9,length(n));
        b+=vec3(.55,.62,1.)*rim*(1.2+uGlow)*fr*fr+c*vec3(1.,.45,.1)*max(-n.y,0.)*.3*occ;
        col=mix(col,b,w);
      }
    }
  }
  // ---- fireflies and wind (now only) ----
  if(old_<.5){
    for(int k=0;k<2;k++){ float fk=float(k); vec2 s=vec2(P.x+uS*(1.25+fk*.5),P.y)/vec2(34.,26.)+fk*13.7;
      vec2 c=floor(s), f=fract(s)-.5; float h=hash21(c);
      vec2 o=(hash22(c+3.)-.5)*.6+.18*vec2(sin(uLt*1.1+h*40.),cos(uLt*1.4+h*23.));
      col+=vec3(1.,.75,.25)*exp(-dot(f-o,f-o)*900.)*step(.55,h)*(.5+.5*sin(uLt*2.5+h*60.))*4.*smoothstep(-20.,-60.,P.y)*smoothstep(-128.,-100.,P.y); }
    float wr=floor(P.y/2.5), wh=hash11(wr*1.3+5.), wp=fract(P.x*.0035+uLt*(1.2+wh*1.6)+wh*7.);
    col+=vec3(.6,.65,1.)*step(.9,wh)*smoothstep(0.,.03,wp)*smoothstep(.16,.05,wp)*uWind*.5;
  }
  // ---- foreground: reeds and brush racing past, out of focus ----
  {
    float fx=P.x+scr(1.75), w=7., c=floor(fx/w), h=hash11(c*1.9+2.), lx=fx-(c+.5)*w+sin(uLt*1.7+c)*1.2*(P.y+128.)/30.;
    float top=-128.+5.+vn(fx/37.)*13.+(h>.35?h*30.*pow(max(0.,1.-abs(lx)/(w*.42)),.45):0.);
    float d=P.y-top;
    if(old_>.5){ if(d<0.) col=H(0x000); }
    else { float a=smoothstep(2.6,-2.6,d); col=mix(col,vec3(.004,.003,.008)+vec3(.1,.11,.2)*smoothstep(-5.,0.,d)*.35,a); }
  }
  // ---- the game's status bar exists only in 1985 ----
  if(old_>.5){
    float ink=txt(P,vec2(-152.,120.),0.,6.,1.)+num(P,vec2(-104.,120.),uScore,6.);
    float lv=txt(P,vec2(-28.,120.),6.,7.,1.);
    float hp=0.; for(int i=0;i<3;i++){ vec2 l=vec2(P.x-(120.+float(i)*10.),120.-P.y)/8.; hp+=pixGlyph(uAtlas,65.,l); }
    if(ink>.5) col=H(0xEEE); if(lv>.5) col=H(0xFC4); if(hp>.5) col=H(0xF52);
    if(uLt>.35&&uLt<2.9&&fract(uLt*2.5)<.72){
      float a=txt(P,vec2(-56.,38.),6.,7.,2.), s=txt(P,vec2(-56.+1.,37.),6.,7.,2.), b=txt(P,vec2(-72.,10.),13.,18.,1.);
      if(s>.5) col=H(0x201); if(a>.5) col=P.y>30.?H(0xFEB):H(0xF80); if(b>.5) col=H(0xEEE); }
    col=o12(col);
  }
  fragColor=vec4(col,1.);
}`;

  let prog, msg, gaps = [], jumps = [], C = [];
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const HXP = -34, foot = new Float32Array(24), J19 = new Float32Array(38);
  const S = s => 24 * s + (s > 84 ? (10 / 12) * (s - 84) * (s - 84) : 0);       // scroll in px as a function of the step count
  const spd = s => 24 + (s > 84 ? (20 / 12) * (s - 84) : 0);                    // px per step

  // ------------------------- the runner's gait (solved once per frame) -------------------------
  // A rotoscope-style run: one footfall per beat (every second thumb-melody note), a stride of about one
  // body height.  C[] lists every ground contact {t: step count, leg, x: ankle ahead of the hip, take/land}.
  // A stance foot is locked to the ground (it moves exactly with the scroll S), the hip/knee come from IK;
  // a swing leg follows keyframed hip / knee / ankle angles from running biomechanics (toe-off, heel folds
  // up to the buttock, knee drive, reach, retraction), joined to the stance IK at toe-off and at the next
  // contact with Hermite splines, so nothing pops.  Lo-res px, y up from the ground line GY.
  const R = Math.PI / 180, TH = 12.5, FL = Math.hypot(3.8, 0.9), FA0 = Math.atan2(-0.9, 3.8);
  const HLO = 24.2, HHI = 26.4, HTO = 27.2;      // hip height: lowest at mid-stance, highest in flight, at take-off
  // swing keys [fraction of the swing, hip angle (from vertical, + forward), knee flexion, ankle plantarflexion] deg
  const NORMAL = [[.167, -14, 65, 45], [.359, 2, 100, 32], [.513, 22, 115, 22], [.679, 40, 85, 16], [.833, 44, 40, 10], [.936, 35, 22, 10]];
  const TRAIL = [[.225, -2, 112, 25], [.45, 24, 112, 20], [.65, 40, 80, 16], [.825, 44, 40, 10], [.925, 35, 22, 10]];
  const herm = (p0, m0, p1, m1, h, u) => { const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * h * m0 + (3 * u2 - 2 * u3) * p1 + (u3 - u2) * h * m1; };
  const stD = c => (c.take ? 13 : 21.3) / spd(c.t);                            // stance duration (steps)
  const at = s => { let k = 0; while (k + 1 < C.length && C[k + 1].t <= s) k++; return k; };
  function hb(k, s) {                    // hip height over the half cycle that starts with contact k
    const c0 = C[k], c1 = C[k + 1], u = (s - c0.t) / (c1.t - c0.t), sg = 21.3 / spd(s) / (c1.t - c0.t);   // sg from the speed *now*: no step between cycles
    return (HLO + HHI) / 2 - (HHI - HLO) / 2 * Math.cos(2 * Math.PI * (u - sg / 2));
  }
  function hn(k, s) {                    // ... plus the landing: the hip arrives with the fall's velocity and the knees absorb it
    const L = C[k].land, tau = s - C[k].t;
    return hb(k, s) + (L ? L.v * tau * Math.exp(-tau / 0.26) : 0);
  }
  function pelY(s) {
    const k = at(s), c0 = C[k];
    if (!c0.take) return hn(k, s);
    const J = c0.take, tA = c0.t + stD(c0), Hl = hn(k + 1, J.b), v0 = (Hl - HTO + 4 * J.h) / (J.b - tA);
    if (s >= tA) { const u = (s - tA) / (J.b - tA); return HTO + (Hl - HTO) * u + J.h * 4 * u * (1 - u); }
    const y0 = hn(k - 1, c0.t), m0 = (y0 - hn(k - 1, c0.t - 0.02)) / 0.02;     // gather, then spring off one leg
    return herm(y0, m0, HTO, v0, tA - c0.t, (s - c0.t) / (tA - c0.t));
  }
  function stance(c, s) {                // [hip angle, knee flexion, ankle] of a planted foot (toe locked, heel peels off)
    const q = Math.min(1, Math.max(0, (s - c.t) / stD(c)));
    const toe = c.x + 3.8 - (S(s) - S(c.t)), gf = FA0 - (c.take ? 58 : 50) * R * sm(0.35, 1, q);
    const ax = toe - FL * Math.cos(gf), dy = 0.6 - FL * Math.sin(gf) - pelY(s);
    const d = Math.min(Math.hypot(ax, dy), 2 * TH - 0.01), k = Math.acos(d / (2 * TH)), th = Math.atan2(ax, -dy) + k;
    return [th, 2 * k, th - 2 * k - gf];
  }
  function leg(L, s) {                   // -> [knee x,y, ankle x,y, toe x,y] relative to (HX, GY)
    let i = at(s); while (C[i].leg !== L) i--;
    const c0 = C[i], mid = C[i + 1], c1 = C[i + 2], te = c0.t + stD(c0);
    let a;
    if (s < te) a = stance(c0, s);
    else {
      const e = 0.03, A0 = stance(c0, te), A0b = stance(c0, te - e), A1 = stance(c1, c1.t), A1b = stance(c1, c1.t + e);
      const keys = [[te, ...A0]], sc = Math.sqrt(spd(s) / 24), add = (t, h, k, p) => keys.push([t, h * sc * R, k * R, p * R]);
      if (c0.take) {                     // take-off leg: trails back, bent, through the leap; swings through after landing
        const b = mid.t, T = c1.t - b; add(te + 0.4 * (b - te), -32, 85, 40); add(b - 0.15, -26, 95, 35);
        for (const [f, h, k, p] of TRAIL) add(b + f * T, h, k, p);
      } else if (mid.take) {             // lead leg: drives the knee up at take-off, reaches far forward, lands
        const ta = mid.t, tA = ta + stD(mid), b = c1.t;
        add(te + 0.5 * (ta - te), -14, 70, 45); add(ta, 4, 105, 30); add(tA, 42, 95, 20);
        add(tA + 0.4 * (b - tA), 56, 22, 12); add(tA + 0.8 * (b - tA), 40, 18, 12);
      } else for (const [f, h, k, p] of NORMAL) add(te + f * (c1.t - te), h, k, p);
      keys.push([c1.t, ...A1]);
      let j = 0; while (j < keys.length - 2 && keys[j + 1][0] <= s) j++;
      const n = keys.length - 1, h = keys[j + 1][0] - keys[j][0], u = (s - keys[j][0]) / h;
      const tan = (m, c) => m === 0 ? (A0[c - 1] - A0b[c - 1]) / e : m === n ? (A1b[c - 1] - A1[c - 1]) / e
        : (keys[m + 1][c] - keys[m - 1][c]) / (keys[m + 1][0] - keys[m - 1][0]);
      a = [1, 2, 3].map(c => herm(keys[j][c], tan(j, c), keys[j + 1][c], tan(j + 1, c), h, u));
    }
    const hy = pelY(s), [th, tk, ps] = a, kx = TH * Math.sin(th), ky = hy - TH * Math.cos(th), sa = th - tk;
    const ax = kx + TH * Math.sin(sa), ay = ky - TH * Math.cos(sa), gf = sa - ps;
    return [kx, ky, ax, ay, ax + FL * Math.cos(gf), ay + FL * Math.sin(gf)];
  }
  function pose(s, lt, wind) {           // fills J19 (absolute lo-res coordinates), see the shader's hero()
    const GYP = -80, P = (k, x, y) => { J19[k * 2] = HXP + x; J19[k * 2 + 1] = GYP + y; }, V = (k, x, y) => { J19[k * 2] = x; J19[k * 2 + 1] = y; };
    const ph = L => { let i = at(s); while (C[i].leg !== L) i--; const c0 = C[i], m = C[i + 1], c1 = C[i + 2];
      return s < m.t ? 0.5 * (s - c0.t) / (m.t - c0.t) : 0.5 + 0.5 * (s - m.t) / (c1.t - m.t); };
    let w = 0, land = 0;                 // w: the leap pose (arms forward and up), land: knee-flex absorption
    for (const J of jumps) { const tA = J.a + 13 / spd(J.a);
      w = Math.max(w, sm(J.a - 0.3, tA + 0.15, s) * (1 - sm(J.b - 0.35, J.b + 0.9, s)));
      land = Math.max(land, sm(J.b, J.b + 0.45, s) * (1 - sm(J.b + 0.45, J.b + 1.5, s))); }
    const hy = pelY(s), p0 = ph(0), lean = (11 + 5 * wind) * R + 0.015 * Math.cos(4 * Math.PI * p0) - 0.07 * w + 0.07 * land;
    const ux = Math.sin(lean), uy = Math.cos(lean), fx = uy, fy = -ux;
    P(0, 0, hy); P(1, 15 * ux, hy + 15 * uy); P(2, 15.6 * ux, hy + 15.6 * uy);
    const hl = lean * 0.4, hux = Math.sin(hl), huy = Math.cos(hl), bob = 0.35 * (hy - 25.3) * (1 - w);   // the head stays steadier
    P(3, 15.6 * ux + 3.7 * hux + 0.3, hy + 15.6 * uy + 3.7 * huy - bob); V(4, hux, huy); V(18, ux, uy);
    for (let L = 0; L < 2; L++) { const g = leg(L, s); for (let k = 0; k < 3; k++) P(5 + L * 3 + k, g[k * 2], g[k * 2 + 1]); }
    const sc = Math.sqrt(spd(s) / 24);
    for (let L = 0; L < 2; L++) {        // arms counter-swing from the shoulder, elbows held at 80-105 deg
      const c = Math.cos(2 * Math.PI * ph(L));
      let ts = (4 - 38 * sc * c) * R, te = (92 - 15 * c) * R;
      ts += (((L ? 82 : 112) * R) - ts) * w; te += (((L ? 55 : 35) * R) - te) * w; ts += lean;
      const sx = 13.9 * ux, sy = hy + 13.9 * uy, ex = sx + 8.5 * Math.sin(ts), ey = sy - 8.5 * Math.cos(ts);
      P(11 + L * 2, ex, ey); P(12 + L * 2, ex + 7.5 * Math.sin(ts + te), ey - 7.5 * Math.cos(ts + te));
    }
    const kx = 1.9 * ux - 3.6 * fx, ky = hy + 1.9 * uy - 3.6 * fy;                // the sash end flutters behind
    const a1 = (40 + 25 * wind + 40 * w + 7 * Math.sin(lt * 10.3) + 3 * Math.sin(lt * 17.1)) * R, a2 = a1 + (14 + 9 * Math.sin(lt * 10.3 - 1.4)) * R;
    const mx = kx - 3.4 * Math.sin(a1), my = ky - 3.4 * Math.cos(a1);
    P(15, kx, ky); P(16, mx, my); P(17, mx - 3 * Math.sin(a2), my - 3 * Math.cos(a2));
  }

  function init() {
    prog = G.program(FS, 'run');
    msg = PIX.message('SCORE LEVEL 1THE SIERRA AT DUSK');
    // a leap every second bar (take-off on a beat, landing on the downbeats of bars 10, 12 ... 22), and one
    // long last leap into bar 24 (taking off on the beat at step 92 so that every footfall is on a beat)
    for (let k = 1; k <= 7; k++) jumps.push({ a: 12 * k - 2, b: 12 * k, h: 15 });
    jumps.push({ a: 92, b: 96.6, h: 34 });
    gaps = jumps.map(j => ({ x: S((j.a + j.b) / 2) + HXP, hw: (S(j.b) - S(j.a)) * 0.5 - 9 }));
    // footfalls: one per beat (two steps), the take-off foot plants just before the gap edge, the lead leg lands
    for (let t = -4, i = 0; t < 112; i++) {
      const J = jumps.find(j => j.a === t);
      C.push({ t, leg: i & 1, x: J ? 3 : 7, take: J || null, land: jumps.find(j => j.b === t) || null });
      t = J ? J.b : t + 2;
    }
    // the hip's vertical speed when a leap lands (minus the run cycle's own), carried into the landing by hn()
    C.forEach((c, k) => { const J = c.take; if (!J) return; const tA = c.t + stD(c), Hl = hb(k + 1, J.b);
      J.v = (Hl - HTO - 4 * J.h) / (J.b - tA) - (hb(k + 1, J.b + 1e-3) - Hl) / 1e-3; });
  }

  // the beam on the downbeat of bar 12 (shared with the soundtrack, which opens with it)
  const beamAt = lt => Math.min(1, Math.max(0, (lt - (LEY.barT[12] - LEY.barT[8])) / 1.5));
  function draw(st, tgt) {
    const lt = st.lt, d2 = st.t - LEY.AT, B = LEY.barT, stepDur = (B[9] - B[8]) / 6;
    const s = Math.max(0, (d2 - B[8]) / stepDur), sc = S(s), v = spd(s);
    // the most recent take-off drives the arc left behind in the light trail
    let J = null; for (const j of jumps) if (j.a <= s) J = j;
    const tA = J ? J.a + 13 / spd(J.a) : 0;
    const near = gaps.slice().sort((a, b) => Math.abs(a.x - sc - HXP) - Math.abs(b.x - sc - HXP));
    foot.fill(-1); let n = 0;
    for (let k = at(s); k >= 0 && n < 6; k--) {
      const c = C[k]; foot.set([S(c.t) + HXP + c.x + 1.5, (s - c.t) * stepDur, c.land ? 1.8 : c.take ? 1.3 : 1, 0], n * 4); n++;
    }
    const jumpsDone = jumps.filter(j => j.b <= s).length;
    const beam = beamAt(lt);
    const wind = sm(84, 96, s);
    pose(s, lt, wind);
    G.draw(prog, {
      uAtlas: PIX.atlas, uMsg: msg, uBeam: beam, uS: sc, uJ: J19,
      uJt: J ? (s - tA) * stepDur : -1, uJd: J ? (J.b - tA) * stepDur : 1, uJh: J ? J.h : 0, uScore: Math.floor(s) * 50 + jumpsDone * 500,
      uLt: lt, uVpx: v / stepDur, uWind: wind, uGlow: LEY.env('kick', d2, 5),
      uGap: [near[0].x, near[0].hw, near[1].x, near[1].hw], uFoot: foot, uZoom: 1 + 0.24 * sm(7.0, 11.5, lt) + 0.06 * wind,
    }, tgt);
    const crt = 1 - sm(7.3, 9.1, lt), wide = sm(7.7, 9.7, lt), end = st.dur - lt;
    return { lines: 256, beam, crt, fa: 1.25 + (st.W / st.H - 1.25) * wide, scan: 256, bloom: 0.3 + 0.2 * beam + 0.1 * wind, thresh: 1.0, expo: 1.0,
      aberr: 0.22 * crt + Math.max(0, 1 - end / 0.5) * 1.2, grain: 0.03, vig: 0.35 + 0.2 * (1 - crt), fade: Math.min(1, lt / 0.3) };
  }

  (window.SCENES = window.SCENES || []).push({
    name: 'Run', title: 'LEVEL 1: RUN', disk: 2, init, draw, tube: 0.6, beamAt, paula: true,
    range: () => [LEY.AT + LEY.sec('run')[0], LEY.AT + LEY.sec('run')[1]],
  });
})();
