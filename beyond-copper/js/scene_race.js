'use strict';
// =====================================================================
//  DISK 2, LEVEL 3: "NIGHT DRIVE" - the pseudo-3D road racer.
//  Bars 48-62 of Asturias. THEN (the hush): a scanline road with banded
//  stripes, cypresses and lamp posts as flat sprites that pop through
//  their size steps, a copper dusk sky and a palace small on the horizon.
//  The raster beam passes on the crash at bar 52 and the same drive is a
//  real place: wet asphalt, lamp streaks, headlights in mist. The music
//  is the throttle: one lamp passes the car on every kick (two per beat
//  under the snare eighths, four under the triplets), one rocket bursts
//  over the palace on every beat, and on the climax chord the car crests
//  the hill, the palace fills the horizon and six shells go off at once.
//  Coordinates are 320x256 "lo-res pixels" (y up, origin at centre); the
//  road is a real plane seen by a real camera: z = depth in metres.
// =====================================================================
(() => {
  const NS = 12, NSP = 300, NTR = 8, NG = 6, SP = 28;
  const FS = PIX.GLSL + `
uniform sampler2D uAtlas, uMsg;
uniform float uLt, uDl, uF, uH, uHY, uYh, uQ, uK, uCamX, uZvis, uZc, uPs, uBx, uScore, uKmh, uRoll, uBlur, uMb, uSmoke, uPulse, uWarp, uBrake;
uniform float uCarX, uYaw, uHv, uLift;       // the car: metres right of the camera, yaw vs the road (rad), body heave and wheel lift (m)
uniform vec2 uVp; uniform float uRefl;
uniform vec3 uFl;                    // what the bursts throw on the world
uniform vec4 uGl[${NG}];             // burst glows: x, y, radius (px), intensity
uniform vec3 uGlC[${NG}];
const float RW=5.2, SP=${SP}., ZMAX=330.;
const vec2 MOON=vec2(104.,84.);
#define NL 12
float old_, aaw;
vec3 invAces(vec3 y){ y=clamp(y,0.,1.02); vec3 a=2.43*y-2.51, b=.59*y-.03, c=.14*y; return (-b-sqrt(max(b*b-4.*a*c,0.)))/(2.*a); }
vec3 o12(vec3 c){ return invAces((min(floor(clamp(c,0.,1.)*15.+.5),14.)+.02)/15.); }
vec3 H(int h){ return vec3(float((h>>8)&15),float((h>>4)&15),float(h&15))/15.; }
float bay(vec2 p){ ivec2 i=ivec2(mod(p,4.)); const float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return (m[i.y*4+i.x]+.5)/16.; }
float vn(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(hash11(i),hash11(i+1.),f); }
float sdCap(vec2 p, vec2 a, vec2 b, float r){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.); return length(pa-ba*h)-r; }
float rbox(vec2 p, vec2 b, float r){ vec2 d=abs(p)-b+r; return length(max(d,0.))+min(max(d.x,d.y),0.)-r; }
float cov(float d, float hw, float px){ return clamp((d+hw)/px+.5,0.,1.)-clamp((d-hw)/px+.5,0.,1.); }       // box-filtered stripe
float pulse(float x, float duty, float w){ float p=smoothstep(duty*.5+w*.5,duty*.5-w*.5,abs(fract(x)-.5)); return mix(p,duty,smoothstep(.45,1.3,w)); }
float ridge(float x, float k){ float n=0., a=.5, f=1.; for(int i=0;i<4;i++){ n+=a*(1.-abs(vn(x*f+k*17.3)*2.-1.)); f*=2.13; a*=.5; } return n; }

// ------------------------------- sky -------------------------------
vec3 skyGrad(float y){                       // y: lo-res lines above the far horizon
  float f=clamp(y/128.,0.,1.);
  vec3 c=mix(vec3(1.,.5,.16),vec3(.72,.2,.26),smoothstep(0.,.1,f));
  c=mix(c,vec3(.34,.09,.33),smoothstep(.06,.24,f));
  c=mix(c,vec3(.1,.05,.26),smoothstep(.18,.46,f));
  return mix(c,vec3(.012,.016,.09),smoothstep(.4,.95,f));
}
// the palace, in wall-heights; origin at the foot of its gate
float palH(float x){
  float ax=abs(x), m=.1*step(.5,fract(x*4.5+.25)), h=-9.;
  if(ax<5.6) h=1.+m;                                             // curtain wall
  if(x>3.7&&x<4.9) h=2.+m;                                       // the great bastion
  if(x>-5.&&x<-4.3) h=1.55+m;                                    // and a lesser one
  if(ax<1.6) h=1.6+m;                                            // the keep
  if(ax<1.1) h=max(h,1.62+1.12*sqrt(1.-ax*ax/1.21));             // its dome
  if(ax<.045) h=max(h,3.2);
  float tx=abs(ax-2.9);                                          // twin towers
  if(tx<.27) h=2.8+.32*sqrt(1.-tx*tx/.0729);
  if(tx<.035) h=3.45;
  return h;
}
void palace(inout vec3 col, inout float open, vec2 p, float px, vec2 cell){
  if(abs(p.x)>6.5||p.y>3.7||p.y<0.) return;
  float ax=abs(p.x), tx=abs(ax-2.9), h=palH(p.x);
  float d=min(p.y-h, max(tx-.37,abs(p.y-2.28)-.08));
  float fx=fract(p.x/.34)-.5, wi=floor(p.x/.34);
  bool win=ax<1.5&&abs(fx)<.2&&p.y>.92&&(p.y<1.22||length(vec2(fx*.34,p.y-1.22))<.068)&&hash11(wi+3.)>.25;
  win=win||(tx<.07&&abs(p.y-2.02)<.13)||(p.x>3.95&&p.x<4.65&&abs(fract(p.x*3.)-.5)<.18&&abs(p.y-1.5)<.12);
  bool gate=ax<.36&&(p.y<.5||length(vec2(ax,p.y-.5))<.36);
  bool arc=ax>.7&&ax<5.4&&abs(fract(p.x/.6)-.5)<.17&&p.y>.3&&p.y<.62&&hash11(floor(p.x/.6)+9.)>.35;
  if(old_>.5){
    if(d<0.){
      vec3 c=H(0x213);
      if((tx<.27&&ax-2.9<-.1*sign(p.x))||(ax<1.1&&p.y>1.62&&p.x<-.15)||(p.x>3.7&&p.x<3.95)) c=H(0x435);
      if(arc) c=H(0xA42); if(win) c=fract(hash11(wi)*7.+floor(uLt*2.)*.31)>.2?H(0xFB4):H(0xA42); if(gate) c=H(0xFC6);
      col=c; open=0.;
    }
    return;
  }
  float a=smoothstep(px,-px,d);
  if(a>0.){
    vec3 c=vec3(.045,.03,.065)*(.75+.5*hash21(floor(p*vec2(9.,15.))));
    c+=vec3(.9,.42,.13)*.28*exp(-p.y*1.7)+vec3(.05,.065,.13)*(.5-.5*sin(p.x*2.1+.7));
    c+=uFl*.22*(.25+.75*smoothstep(0.,3.,p.y));
    if(ax<1.1&&p.y>1.62+.0){ float nx=p.x/1.1, ny=(p.y-1.62)/1.12, lam=max(0.,-nx*.6+ny*.55+.3);
      c=vec3(.04,.055,.11)*(.35+1.7*lam)+vec3(.5,.3,.1)*.22*smoothstep(.09,.03,abs(fract(asin(clamp(nx,-1.,1.))*2.2)-.5));
      c+=(uFl*.7+vec3(.3,.34,.5)*.25)*pow(max(0.,1.-length(vec2(nx+.28,ny-.6))*1.5),3.); }
    if(tx<.27) c*=.7+.6*smoothstep(.27,-.27,(ax-2.9)*sign(p.x));
    if(arc) c=vec3(1.,.5,.16)*(.9+.5*hash11(floor(p.x/.6)));
    if(win) c=vec3(1.,.62,.24)*(1.7+1.3*sin(uLt*(2.+3.*hash11(wi))+wi*7.)*.4);
    if(gate) c=vec3(1.,.6,.22)*4.5;
    col=mix(col,c,a); open*=1.-a;
  }
  // fiesta: strings of bulbs along every roofline, a glow at the gate
  float bx=fract(p.x*4.5)-.5, bi=floor(p.x*4.5), by=p.y-palH((bi+.5)/4.5)-.09;
  float bd=length(vec2(bx/4.5,by)), tw=.6+.4*sin(uLt*5.+bi*2.4);
  vec3 bc=mod(bi,3.)<1.?vec3(1.,.55,.18):mod(bi,3.)<2.?vec3(1.,.92,.75):vec3(.35,.6,1.);
  col+=bc*tw*(smoothstep(.05+px,.02,bd)*3.+exp(-bd*bd*260.)*.5)*step(abs(p.x),5.6);
  col+=vec3(1.,.5,.15)*.5*exp(-length(vec2(p.x,p.y-.3)*vec2(1.,1.6))*1.8);
}
vec4 back(vec2 P, vec2 cell){                 // everything beyond the road; a = 1 where the sky is open (sparks show there)
  float y=P.y-uHY, x=P.x-uBx; vec3 col; float open=1.;
  if(old_>.5){
    float f=floor(y/2.)*2.+1.; vec3 g=skyGrad(f+(bay(cell)-.5)*9.);                    // copper bands, dithered where they meet
    col=(floor(g*15.+.5))/15.;
    float h=hash21(floor(vec2(P.x-uBx*.3,P.y-uHY))+7.);
    if(y>30.&&h>.992) col=fract(h*77.+floor(uLt*3.)*.37)>.3?H(0xCCE):H(0x77A);
    vec2 d=(P-vec2(MOON.x+uBx*.3,MOON.y+uHY))/11.; float r=length(d);
    if(r<1.){ float m=dot(d,normalize(vec2(-.75,.55)))*.5+.5+.3*smoothstep(.3,.15,length(d-vec2(.25,.2))); float b=bay(cell);
      col=m<.3+(b-.5)*.3?H(0xB97):m<.62+(b-.5)*.4?H(0xDC9):H(0xFEB); }
  } else {
    col=skyGrad(y)*.8;
    vec2 sg=vec2(P.x-uBx*.3,y)*1.5, g=floor(sg), f=fract(sg)-.5; float h=hash21(g);
    col+=vec3(.8,.85,1.)*step(.982,h)*smoothstep(.45,0.,length(f))*smoothstep(12.,60.,y)*(.5+.5*sin(uLt*3.+h*90.))*1.6;
    vec2 d=(P-vec2(MOON.x+uBx*.3,MOON.y+uHY))/11.; float r=length(d);
    col+=vec3(.7,.78,1.)*(exp(-max(r-1.,0.)*1.2)*.45+exp(-max(r-1.,0.)*.2)*.16);
    if(r<1.04){ float cr=fbm(d*3.+5.)*.5+.3*smoothstep(.34,.15,length(d-vec2(.25,.2)));
      col=mix(col,vec3(1.,.95,.82)*(2.5-cr*1.3)*(.5+.5*sqrt(max(1.-r*r,0.)))*(1.-.4*smoothstep(-.2,.9,dot(d,normalize(vec2(.75,-.55))))),smoothstep(1.04,.97,r)); }
    // bursts light their own smoke from inside
    vec3 gl=vec3(0.);
    for(int i=0;i<${NG};i++){ vec4 q=uGl[i]; if(q.w<=0.) continue; vec2 e=P-q.xy; float r2=dot(e,e)/(q.z*q.z); gl+=uGlC[i]*q.w*(exp(-r2)+.1*exp(-r2*.18)); }
    gl/=1.+.75*max(gl.r,max(gl.g,gl.b));
    float sm=fbm(vec2(x*.02+uLt*.013,y*.034-uLt*.022))*smoothstep(-6.,26.,y)*exp(-y*.008);
    float cl=smoothstep(.42,.8,fbm(vec2(x*.008+uLt*.006+4.,y*.03+1.7)))*smoothstep(20.,70.,y);
    col=mix(col,vec3(.08,.06,.13)+vec3(.3,.34,.6)*exp(-r*.1)*.5,cl*.45);
    col+=gl*(.16+1.1*sm*uSmoke+.5*cl)+vec3(.04,.032,.045)*sm*uSmoke+uFl*.02;
    open=1.-.35*cl;
  }
  // three ridges of the sierra, sliding against each other as the road turns
  for(int k=0;k<3;k++){
    float fk=float(k)*.5, xx=P.x-uBx*mix(.45,.85,fk);
    float top=mix(13.,3.,fk)+ridge(xx/mix(120.,70.,fk),float(k)+4.)*mix(44.,20.,fk);
    float d=y-top;
    if(old_>.5){ if(d<0.){ col=k==0?H(0x526):k==1?H(0x314):H(0x202); open=0.; } }
    else { float a=smoothstep(aaw,-aaw,d); vec3 c=mix(vec3(.2,.085,.2),vec3(.035,.02,.06),fk);
      c=mix(c,vec3(.6,.28,.14),smoothstep(0.,-40.,d)*.3*(1.-fk))+uFl*.05*exp(d*.15); col=mix(col,c,a); open*=1.-a; }
  }
  if(y<0.){                                    // the plain beyond the crest, with the lights of the town
    if(old_>.5) col=H(0x101);
    else { float h=hash21(floor(vec2(x*.8,y*2.5))); col=vec3(.012,.009,.02)+vec3(1.,.6,.25)*step(.93,h)*.5*exp(y*.12)+vec3(.5,.25,.1)*.1*exp(y*.2); }
    open=0.;
  }
  palace(col,open,vec2(x,y)/uPs,1.2*aaw/uPs,cell);
  return vec4(col,open);
}

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
  float asp=uRes.x/uRes.y; old_=isOld(); aaw=256./uRes.y*.9;
  vec2 cell=floor(vUv*vec2(256.*asp,256.));
  vec2 P=old_>.5 ? cell+.5-vec2(128.*asp,128.) : (vUv-.5)*vec2(256.*asp,256.);
  // ---- which point of the road plane is under this pixel? (flat ground bent by one hill term: analytic) ----
  float e=(P.y-uHY)/uF, disc=e*e+2.*uQ*uH, z=-1.;
  if(disc>=0.){ float dn=sqrt(disc)-e; if(dn>1e-5) z=2.*uH/dn; }
  bool gnd=z>0.&&z<uZvis;
  float s=uDl*SP+z-uZc, u=P.x*z/uF-(uK*z*z*.5-uCamX), au=abs(u);
  vec3 col; float mask=0., fres=0., wet=0.;
  vec4 bk=vec4(0.);
  if(!(gnd&&old_>.5)){
    vec2 Pb=P;
    if(gnd){ float rp=noise(vec2(u*5.,s*.3))-.5, dy=uYh-P.y; Pb=vec2(P.x+(noise(vec2(u*1.7,s*.21))-.5)*(3.+dy*.12),uYh+dy*(1.+rp*1.1)+rp*4.); }
    bk=back(Pb,cell);
  }
  if(!gnd){ col=bk.rgb; mask=bk.a; }
  else if(old_>.5){
    // ------------------------------- 1985: one colour decision per scanline band -------------------------------
    float b=step(.5,fract(s/14.));
    col=b>.5?H(0x213):H(0x102);
    if(au<RW+.7) col=b>.5?H(0xD63):H(0xEEC);
    if(au<RW) col=b>.5?H(0x445):H(0x334);
    if(abs(au-(RW-.45))<.1) col=H(0x99A);
    if(au<.16&&b>.5) col=H(0xFEB);
  } else {
    // ------------------------------- now: wet asphalt -------------------------------
    float pxm=z/uF, psz=z*z/(uF*uH)+uMb, road=cov(u,RW,pxm), rum=cov(au-(RW+.35),.35,pxm);
    float gr=noise(vec2(u*5.,s*3./(1.+uMb*1.5))), pud=smoothstep(.3,.7,noise(vec2(u*.33,s*.05))+.25*noise(vec2(u*1.1,s*.2)));
    vec3 alb=mix(vec3(.05,.06,.065)*(.35+1.1*noise(vec2(u*.7,s*.4))*noise(vec2(u*4.,s*1.3/(1.+uMb)))),vec3(.05,.052,.06)*(.75+.5*gr),road);
    alb=mix(alb,mix(vec3(.75,.3,.1),vec3(.8,.8,.75),pulse(s/7.,.5,psz/7.)),rum*.9);
    float mk=cov(au-(RW-.45),.09,pxm)*.8+cov(u,.09,pxm)*pulse(s/14.,.4,psz/14.);
    alb=mix(alb,vec3(.7,.7,.66),min(mk,1.)*road);
    float ds=mod(s+SP*.5,SP)-SP*.5, lu=au-(RW-1.4), ss=81.+uMb*uMb;
    float pool=exp(-(ds*ds/ss+lu*lu/38.))*9./sqrt(ss);
    float zr=z-uZc-1.2, du=u-uCamX-uCarX, hl=smoothstep(0.,3.5,zr)*exp(-max(zr,0.)/30.)*exp(-pow((du-uYaw*max(zr,0.))/(1.7+max(zr,0.)*.17),2.));
    vec3 lit=vec3(.02,.03,.06)+vec3(1.,.6,.26)*pool*1.5+vec3(.85,.92,1.)*hl*2.4+uFl*.5;
    col=alb*lit+vec3(.8,.85,.9)*mk*road*hl*.7;
    float zt=z-uZc+.2; col+=vec3(1.,.08,.04)*alb*5.*(1.+uBrake)*exp(-(zt*zt/2.5+du*du/1.6))*step(zt,.4);
    wet=mix(.12,.4+.6*pud,road);
    fres=.03+.97*pow(1.-clamp(uH/sqrt(uH*uH+z*z),0.,1.),4.);
    col+=min(bk.rgb,vec3(1.6))*fres*wet*.75*uRefl;
    float fog=1.-exp(-z/150.);
    col=mix(col,vec3(.05,.035,.06)+uFl*.06,fog*.75);
    col+=(vec3(.3,.13,.1)*.22+uFl*.3)*exp(-(uYh-P.y)*.35);
    mask=fres*wet*.85*(1.-fog*.6)*uRefl;
  }

  // ---- roadside: cypresses and lamp posts, far to near ----
  for(int j=NL-1;j>=0;j--){
    float zl=(float(j)-fract(uDl))*SP+uZc, idx=floor(uDl)+float(j);
    float z2=zl+SP*.5;
    if(z2>1.5&&z2<uZvis){
      float sc=uF/z2, xc=uF*(uK*z2*.5-uCamX/z2), yb=uHY+uF*(uQ*z2*.5-uH/z2);
      if(old_>.5){ sc=exp2(floor(log2(sc)*3.+.5)/3.); xc=floor(xc)+.5; yb=floor(yb); }
      float sd=P.x>xc?1.:-1., h=hash21(vec2(idx,sd*3.+1.)), u0=RW+3.6+3.2*h, Ht=8.+5.5*fract(h*7.3);
      float lx=abs(P.x-xc)/sc-u0, ly=(P.y-yb)/sc;
      if(h>.22&&ly>-.1&&ly<Ht+.2&&abs(lx)<2.3){
        float t=clamp(ly/Ht,0.,1.), w=ly<.8?.17:1.5*pow(t,.4)*pow(1.-t,.55)+.04;
        if(old_>.5){ if(abs(lx)<w) col=(lx<-w*.35&&bay(cell)>.4&&ly>.8)?H(0x245):H(0x012); if(abs(lx)<w) mask=0.; }
        else { w+=(noise(vec2(ly*2.3+idx*7.,sd))-.5)*.3*step(.8,ly);
          float bl=min(u0*sc*uBlur/z2,.9*sc), a=smoothstep(aaw+bl,-aaw-bl,(abs(lx)-w)*sc)*smoothstep(-.1,0.,ly)/(1.+.6*bl/sc)*smoothstep(1.5,4.,z2);
          float fg=1.-exp(-z2/170.);
          vec3 c=vec3(.004,.007,.009)+(vec3(1.,.58,.25)*.05+uFl*.1)*smoothstep(.3,-1.2,lx)*(.4+.6*noise(vec2(ly*5.,lx*5.+idx)));
          c=mix(c,vec3(.07,.045,.075)+uFl*.08,fg*.8);
          col=mix(col,c,a); mask*=1.-a; }
      }
    }
    if(zl>.7&&zl<uZvis){
      float sc=uF/zl, xc=uF*(uK*zl*.5-uCamX/zl), yb=uHY+uF*(uQ*zl*.5-uH/zl);
      if(old_>.5){ sc=exp2(floor(log2(sc)*3.+.5)/3.); xc=floor(xc)+.5; yb=floor(yb); }
      float sd=P.x>xc?1.:-1.;
      vec2 q=vec2(abs(P.x-xc),P.y-yb);
      float px0=(RW+1.3)*sc, ax0=(RW-1.5)*sc, top=7.6*sc, pw=max(.085*sc,.5);
      vec2 hp=vec2(ax0,top+.42*sc);
      float d=max(abs(q.x-px0)-pw,max(-q.y,q.y-top));
      d=min(d,sdCap(q,vec2(px0,top),hp,pw*.8));
      if(old_>.5){
        if(d<0.){ col=H(0x556); mask=0.; }
        float hr=max(.3*sc,.9); vec2 hq=abs(q-hp);
        if(max(hq.x,hq.y)<hr*2.2&&min(hq.x,hq.y)<hr*.5&&sc>1.8) col=H(0xF93);
        if(max(hq.x,hq.y)<hr){ col=H(0xFEB); mask=0.; }
      } else {
        float fg=exp(-zl/190.);
        float a=smoothstep(aaw,-aaw,d)*smoothstep(1.,3.5,zl); col=mix(col,vec3(.012,.013,.02)+vec3(1.,.6,.25)*.25*smoothstep(top*.6,top,q.y),a*fg); mask*=1.-a*fg;
        vec2 hs=vec2(xc+sd*hp.x,yb+hp.y), dv=hs-uVp; float ln=length(dv), Lb=ln*uBlur/zl;
        vec2 dr=dv/max(ln,1e-3);
        float dd=sdCap(P,hs-dr*Lb*.6,hs+dr*Lb*.4,0.), core=max(.2*sc,.55);
        float gI=(exp(-dd*dd/(core*core))*7.+.6*smoothstep(1.5,6.,zl)/(1.+dd*dd/(core*core*8.)))*core/(core+Lb*.25);
        col+=vec3(1.,.7,.34)*gI*fg;
        float cy=hs.y-P.y;                                                                // its cone in the mist
        if(cy>0.&&cy<top*1.1&&zl<170.) col+=vec3(1.,.66,.3)*.07*fg*smoothstep(2.,8.,zl)*smoothstep(0.,.4*sc,cy)*exp(-pow((P.x-hs.x)/min(.3*sc+cy*.36,hp.x*.42),2.))*(1.-cy/(top*1.1));
        if(gnd&&P.y<yb+1.&&zl>4.){ float ym=yb-hp.y*.8, w=max(.5*sc,.9)+abs(P.y-ym)*.05;         // and its streak in the wet road
          float rp=.6+.8*noise(vec2(u*2.2,s*.5));
          col+=vec3(1.,.64,.28)*fg*wet*rp*1.7*smoothstep(4.,16.,zl)*smoothstep(yb+1.,yb-1.-.4*sc,P.y)*exp(-pow((P.x-hs.x)/w,2.))/(1.+pow((P.y-ym)/(3.2*sc),2.))*min(1.,sc*.6); }
      }
    }
  }

  // ---- the car: a red wedge in the spirit of Lotus's Esprit Turbo SE seen from behind (original procedural art): wide low
  //      tail, full-width wing on stanchions, black louvres between flying-buttress C-pillars, rectangular lamps in a black
  //      band, yellow plate, twin pipes, fat tyres. Car metres: x right, y up, origin = the road under the rear axle.
  //      The tyres stay planted on the contact line; only the body above the springs heaves and rolls (about the roll
  //      centre at axle height); yaw swings the tail out of the turn and shows a sliver of side panel (5 frames in 1985) ----
  float cs=uF/uZc; vec2 cb=vec2(uF*(uK*uZc*.5+uCarX/uZc),uHY+uF*(uQ*uZc*.5-uH/uZc));
  float yw=clamp(uYaw*12.,-1.,1.), rl=uRoll, hv=uHv, lf=uLift;
  if(old_>.5){ float ox=128.*asp; cb=vec2(floor(cb.x+ox+.5)-ox,floor(cb.y+.5));                  // whole pixels, whole frames
    yw=floor(yw*2.+.5)*.5; rl=floor(rl*cs+.5)/cs; hv=floor(hv*cs+.5)/cs; lf=floor(lf*cs+.5)/cs; }
  if(old_<.5){                                                                            // headlights in the mist ahead of it
    float hy=P.y-cb.y-.5*cs; float m=.6+.8*fbm(vec2(P.x*.03,P.y*.05-uLt*1.5));
    col+=vec3(.5,.6,.9)*.11*m*smoothstep(-.2*cs,.6*cs,hy)*exp(-max(hy,0.)/(2.4*cs))*exp(-pow((P.x-cb.x-(uK*60.+uYaw*2.2)*hy)/(1.5*cs+max(hy,0.)*.9),2.));
    for(int i=0;i<2;i++){ float lxp=cb.x+((float(i)*2.-1.)*.69-yw*.07)*cs, dy=cb.y+.2*cs-P.y;       // tail lights in the wet road
      if(gnd&&dy>0.) col+=vec3(1.,.07,.03)*(.45+1.3*uBrake)*wet*(.3+1.1*noise(vec2(u*5.,s*.6)))*exp(-pow((P.x-lxp)/(.2*cs+dy*.02),2.))*exp(-dy/(.5*cs)); }
  }
  vec2 c0=(P-cb)/cs;
  if(abs(c0.x)<1.6&&c0.y>-1.3&&c0.y<1.35){
    float sd=yw<0.?1.:-1., ay=abs(yw), px=1.3*aaw/cs, dTl1=1.;                   // sd: the side that shows (away from the turn)
    float lp=fract(uDl), dz=lp>.5?(1.-lp)*SP:-lp*SP;                              // the nearest pair of lamps: metres ahead of the car
    vec3 P0=vec3(.42,.018,.01), sky=vec3(.07,.09,.2)+vec3(1.,.62,.28)*uPulse*.6+uFl*.6, LC=vec3(1.,.62,.28);
    for(int it=0;it<2;it++){                                                      // pass 0: its mirror image in the wet asphalt; pass 1: the car
      vec2 c=c0; float kR=1., pxx=px;
      if(it==0){
        if(old_>.5||!gnd||c.y>0.) continue;
        float rp=noise(vec2(u*3.,s*.45)), rq=noise(vec2(u*9.,s*1.6));
        c=vec2(c.x+(rp-.5)*.18*(.1-c.y)+(rq-.5)*.04,-c.y*(1.+.3*(rq-.5)));       // mirrored about the contact line, rippled
        kR=(.2+.9*fres)*(.4+.6*wet)*exp(-c.y*1.2); pxx=px*(1.+c.y*5.);
      } else {
        // contact shadows under the tyres, and the dark under the floor pan; the road keeps them when the wheels go light
        vec2 w0=vec2(c.x+yw*.07,c.y); float wx0=abs(w0.x);
        if(old_>.5){
          float r1=1./cs;
          if(abs(w0.x)<.62&&c.y>=0.&&c.y<.16) col=H(0x101);
          if(abs(w0.x)<1.02&&c.y<0.&&c.y>-3.*r1&&(bay(cell)>.45||c.y>-r1)) col=H(0x101);
          if(abs(wx0-.79)<.2+.08*step(0.,w0.x*sd)*ay&&c.y<0.&&c.y>-2.*r1) col=H(0x000);
        } else {
          float ct=exp(-pow((wx0-.79-.07*step(0.,w0.x*sd)*ay)/(.24+.07*ay),4.)-pow((c.y+.01)/(.045+lf*.6),2.))*(1.-lf*10.);
          float ao=exp(-pow(w0.x/.98,6.))*smoothstep(-.32,.02,c.y)*smoothstep(.4,.12,c.y);
          float sh=max(ct*.92,ao*.85)+.25*exp(-pow(w0.x/1.15,4.)-pow((c.y+.05)/.22,2.));
          col*=1.-min(sh,.95); mask*=1.-min(sh,.95);
        }
      }
      c.y-=lf;
      vec2 w=vec2(c.x+yw*.07,c.y);                                                // the wheels: on the road; the tail swings out of the turn
      vec2 q=c-vec2(0.,hv+.28);                                                   // the body: heave, then roll about the roll centre
      if(old_>.5) q.x+=q.y*rl; else q=vec2(cos(rl)*q.x+sin(rl)*q.y,cos(rl)*q.y-sin(rl)*q.x);
      q.y+=.28;
      vec2 r=vec2(q.x+yw*.07,q.y), k=vec2(q.x-yw*.06,q.y);                       // tail; the cabin sits further forward and swings into the turn
      float ax=abs(r.x), kx=abs(k.x), wx=abs(w.x), sx=r.x*sd;
      // ------ silhouettes (< 0 inside) ------
      float wo=.98+(w.x*sd>0.?.16:-.03)*ay;
      float dTy=rbox(vec2(wx-(.6+wo)*.5,w.y-.21),vec2((wo-.6)*.5,.21),.05);                     // fat rear tyres
      float bot=mix(.14,.31,smoothstep(.56,.64,ax));                                            // valance, then the wheel arches
      float dBo=max(ax-(.95-max(0.,r.y-.48)*.15),max(bot-r.y,r.y-.7));                         // the tail panel
      float dDk=max(ax-(.91-(r.y-.7)*.7),max(.69-r.y,r.y-.77));                                // the flat rear deck, from above
      float dSi=ay<.02?1.:max(max(.9-sx,sx-(.95+.3*ay)),max(.31-r.y,r.y-(.69-(sx-.95)*.5)));   // the side panel, when it yaws
      float hw=mix(.8,.5,clamp((k.y-.76)/.27,0.,1.));
      float dCa=max(kx-hw,max(.74-k.y,k.y-1.1+max(0.,kx-.36)*.45));                            // cabin: buttresses and roof
      float lw=mix(.46,.36,clamp((k.y-.79)/.21,0.,1.));
      float dLv=max(kx-lw,max(.79-k.y,k.y-1.));                                                 // louvred glass and engine cover
      float dGp=max(abs(kx-lw-.035)-.022,max(.79-k.y,k.y-.97));                                // light through the flying buttresses
      float dMi=rbox(vec2(kx-.77,k.y-.865),vec2(.055,.026),.012);                                 // door mirrors
      float dWg=min(min(max(ax-.95,abs(r.y-.825)-.026),max(abs(ax-.56)-.025,max(.7-r.y,r.y-.81))),max(abs(ax-.93)-.02,abs(r.y-.81)-.045));
      float dBa=max(ax-.925,abs(r.y-.51)-.072), dTl=max(abs(ax-.69)-.205,abs(r.y-.51)-.05);    // black band, lamp clusters
      float dPl=max(ax-.24,abs(r.y-.345)-.05);                                                  // the plate
      float dEx=min(length(vec2(r.x+.43,r.y-.18))-.048,length(vec2(r.x+.31,r.y-.18))-.048);   // twin pipes
      float dCar=min(min(min(dTy,dBo),min(dDk,dSi)),min(min(dCa,dWg),min(dMi,dEx)));
      if(it==1) dTl1=dTl;
      bool val=ax<.6&&r.y<.3;
      if(old_>.5){
        // ------ 1985: four reds, a black outline, a few specular pixels ------
        float b4=bay(cell), r1=1./cs;
        if(dCar<r1&&dCar>=0.) col=H(0x000);
        if(dTy<0.){ col=fract(c.y*cs*.25-uDl*SP*.9)<.5?H(0x111):H(0x222); if(abs(wx-.79)<.6*r1) col=H(0x000);
          if(wx>.9&&w.y>.22) col=H(0x333); if(w.x*sd>.97) col=fract(c.y*2.4)<.5?H(0x333):H(0x444); if(w.y>.4) col=H(0x000); }
        if(dSi<0.) col=r.y>.65-(sx-.95)*.5?H(0xA11):H(0x711);
        if(dBo<0.){ col=r.y<.36||(r.y<.42&&b4>.5)?H(0x811):H(0xC22); if(r.y>.665) col=H(0xF54); if(ax>.9&&r.y<.665) col=H(0x811); if(val) col=H(0x111); }
        if(dCa<0.){ col=k.y>1.015?H(0xD33):kx>hw-.05?H(0x500):H(0xA11); }
        if(dLv<0.) col=mod(floor((k.y-.79)*cs),2.)<1.?H(0x000):H(0x334);
        if(dGp<0.) col=H(0x000);
        if(dDk<0.){ col=H(0xF54); if(r.y<.715) col=H(0xC22); if(abs(r.x+.62)<.06&&abs(r.y-.735)<.6*r1) col=H(0xFDB); }
        if(dMi<0.) col=k.y<.855?H(0x500):H(0xB11);
        if(dWg<0.){ col=r.y>.835?H(0xF76):r.y<.81?H(0x611):H(0xC22); if(abs(ax-.56)<.03&&r.y<.8) col=H(0x400);
          if(r.x<-.7&&r.x>-.82&&r.y>.835) col=H(0xFFE); }
        if(dBa<0.&&dBo<0.) col=H(0x000);
        if(dTl<0.){ col=ax<.6?H(0xF90):H(0xD11); if(r.y>.53) col=ax<.6?H(0xFC4):H(0xF54); if(uBrake>.5&&ax>.6) col=r.y>.53?H(0xFDC):H(0xF55); }
        if(dPl<0.){ col=H(0xFD2); if(abs(r.y-.345)<.022&&fract(r.x*cs*.25)<.5&&ax<.2) col=H(0x110); }
        if(dEx<0.) col=dEx<-.022?H(0x000):H(0x888);
        if(dCar<r1) mask=0.;
      } else {
        // ------ now: glossy paint mirroring the sky, the lamps sweeping over it as they pass ------
        float a=smoothstep(pxx,-pxx,dCar);
        if(a>0.){
          float g=clamp(dz/10.,0.,1.), gy=mix(.7,1.1,g), on=step(0.,dz)*smoothstep(14.,6.,dz);
          float glint=exp(-pow((q.y-gy)/.028,2.))*on*(.35+.65*smoothstep(.1,.6,abs(q.x)));          // the lamps, mirrored by every upward surface
          float wash=step(dz,0.)*exp(dz/5.);                                                         // ...and the tail panel lit once they are behind
          vec3 b=vec3(.012);
          if(dTy<0.){ b=(vec3(.016)+LC*.025*(uPulse+wash))*(1.+.7*smoothstep(.2,.42,w.y))*(.5+.5*step(.012,abs(fract((wx-.6)/.095)-.5)*.095));
            b+=vec3(.035,.035,.045)*smoothstep(-.035,0.,dTy);
            if(w.x*sd>.975) b=vec3(.028)+vec3(.05)*smoothstep(.12,.0,abs(length(vec2((w.x*sd-.98)*3.,w.y-.21))-.1))+LC*.04*wash; }
          if(dSi<0.) b=P0*.28+LC*.05*(1.+uPulse)+sky*.08*smoothstep(.52,.69,r.y);
          if(dBo<0.){ b=P0*(.45+.55*smoothstep(.15,.7,r.y))+LC*.12*wash*smoothstep(.3,.7,r.y)+sky*.25*smoothstep(.63,.7,r.y);
            b+=vec3(.3,.34,.5)*.06*smoothstep(-.06,0.,dBo); if(val) b=vec3(.006); }
          if(dCa<0.){ b=P0*.55+sky*.35*smoothstep(.74,1.,k.y)+LC*glint*.6; if(k.y>1.015) b=P0*.6+sky*.9+LC*glint*1.6; if(kx>hw-.04) b*=.6; }
          if(dLv<0.){ b=vec3(.01,.012,.024)+sky*.12*(k.y-.77)*4.;
            float sl=smoothstep(.3,.6,fract((k.y-.79)*20.)); b*=.25+.75*sl; b+=(LC*glint*1.1+sky*.15)*sl; }
          if(dGp<0.) b=vec3(.03,.04,.07)+uFl*.15;
          if(dDk<0.) b=P0*.7+sky*1.1*smoothstep(.69,.77,r.y)+LC*glint*1.8;
          if(dMi<0.) b=k.y<.855?vec3(.02,.002,.001):P0*.8+sky*.5;
          if(dWg<0.){ b=P0*.75+sky*.2; if(r.y>.835) b=P0*.8+sky*1.2+LC*glint*1.8; if(r.y<.805) b=P0*.3;
            if(abs(ax-.56)<.03&&r.y<.8) b=vec3(.02,.002,.002); }
          if(dBa<0.&&dBo<0.) b=vec3(.006)+sky*.04;
          if(dTl<0.) b=(ax<.6?vec3(1.,.42,.05)*1.6:vec3(1.,.06,.03)*(2.5+4.5*uBrake))*(.6+.4*step(.3,fract(r.x*18.)))*smoothstep(0.,-.02,dTl);
          if(dPl<0.){ b=vec3(.5,.42,.06)*(.5+.5*uPulse)+uFl*.3; if(abs(r.y-.345)<.022&&ax<.2&&fract(r.x*11.)<.6) b=vec3(.02); }
          if(dEx<0.) b=dEx<-.02?vec3(.002):vec3(.08,.08,.09)*(1.+LC*wash);
          if(it==0){ col=mix(col,col*.45+b*kR,a); mask*=1.-.8*a; }
          else { col=mix(col,b,a); mask*=1.-a; }
        }
      }
    }
    if(old_<.5) col+=vec3(1.,.05,.02)*(.08+.25*uBrake)*exp(-max(dTl1,0.)*16.)*step(0.,dTl1);
  }
  if(old_<.5&&uWarp>0.){                                                                 // speed: the mist streaks out of the vanishing point
    vec2 dv=P-uVp; float an=atan(dv.y,dv.x), r=length(dv), h=hash11(floor(an*170.)+3.);
    float sp=fract(log(r+2.)*.9-uLt*(1.5+h*2.)+h*9.);
    col+=vec3(.6,.68,1.)*uWarp*.16*step(.93,h)*smoothstep(0.,.2,sp)*smoothstep(.5,.25,sp)*smoothstep(30.,150.,r);
  }
  // ---- the game's status bar exists only in 1985 ----
  if(old_>.5){
    float ink=txt(P,vec2(-152.,120.),0.,6.,1.)+num(P,vec2(-104.,120.),uScore,6.)+txt(P,vec2(-152.,-110.),35.,3.,1.);
    float lv=txt(P,vec2(-28.,120.),6.,7.,1.)+num(P,vec2(-120.,-110.),uKmh,3.);
    float hp=0.; for(int i=0;i<3;i++){ vec2 l=vec2(P.x-(120.+float(i)*10.),120.-P.y)/8.; hp+=pixGlyph(uAtlas,65.,l); }
    if(ink>.5) col=H(0xEEE); if(lv>.5) col=H(0xFC4); if(hp>.5) col=H(0xF52);
    if(uLt>.35&&uLt<2.9&&fract(uLt*2.5)<.72){
      float a=txt(P,vec2(-56.,60.),6.,7.,2.), sh=txt(P,vec2(-55.,59.),6.,7.,2.), b=txt(P,vec2(-88.,32.),13.,22.,1.);
      if(sh>.5) col=H(0x201); if(a>.5) col=P.y>52.?H(0xFEB):H(0xF80); if(b>.5) col=H(0xEEE); }
    if(ink+lv+hp>.5) mask=0.;
    col=o12(col);
  }
  fragColor=vec4(col,mask);
}`;

  // ------------- the fireworks: every spark is an instanced quad, placed by the vertex shader from its shell's age -------------
  const SVS = `#version 300 es
precision highp float;
uniform vec4 uSh[${NS}];             // x, y (firework units from the palace roof), age in s (< 0: still rising), kind + seed
uniform vec4 uShC[${NS}];            // colour, radius
uniform vec2 uAnch, uRes;
uniform float uFs, uMir, uYh, uBeam, uTw;
out vec2 vUv; out vec4 vCol;
const float RISE=.42, TAU=6.28318530718;
float h1(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
void main(){
  const vec2 QD[6]=vec2[6](vec2(0,0),vec2(1,0),vec2(0,1),vec2(0,1),vec2(1,0),vec2(1,1));
  vec2 qd=QD[gl_VertexID]; vUv=qd; vCol=vec4(0.); gl_Position=vec4(2.,2.,2.,1.);
  int id=gl_InstanceID, si=id/${NSP * NTR}, r=id-si*${NSP * NTR}, sp=r/${NTR}, tr=r-sp*${NTR};
  vec4 S=uSh[si], C=uShC[si];
  float kind=floor(S.w), seed=fract(S.w), fsp=float(sp), ftr=float(tr), R=C.w, a=S.z;
  float life=kind==1.?3.6:kind==4.?2.8:2.3;
  if(R<=0.||a<-RISE||a>life) return;
  vec2 pos; float br, sz=1.; vec3 col=C.rgb;
  if(a<0.){                                                     // the rocket climbing from the palace, shedding embers
    if(sp>=14) return;
    float lag=ftr*.016+fsp*.006, uu=1.+a/RISE-lag; if(uu<0.) return;
    float e=1.-(1.-uu)*(1.-uu), hh=h1(fsp*3.1+ftr*1.7+seed*9.);
    pos=mix(vec2(-S.x*.5,-S.y),vec2(0.),e)+vec2(sin(uu*10.+seed*40.)*.05+(hh-.5)*lag*1.6,-lag*lag*5.);
    br=(sp==0&&tr==0?5.:1.)*exp(-lag*14.); col=vec3(1.,.72,.36); sz=sp==0&&tr==0?1.:.6;
  } else {
    float dt=kind==1.?.085:kind==4.?.06:.028, ta=a-ftr*dt; if(ta<0.) return;
    float ha=h1(fsp*1.31+seed*71.), hb=h1(fsp*2.17+seed*13.+.5), hc=h1(fsp*.73+seed*29.+.2);
    float cz=ha*2.-1., ph=hb*TAU, sr=sqrt(1.-cz*cz); vec3 d=vec3(sr*cos(ph),sr*sin(ph),cz); float vs=.86+.14*hc;
    if(kind==2.){ if(sp>${Math.floor(NSP / 5)}){ float ti=seed*5.; d=vec3(cos(ph),sin(ph)*cos(ti),sin(ph)*sin(ti)); d.xy=mat2(cos(ti*3.),sin(ti*3.),-sin(ti*3.),cos(ti*3.))*d.xy; vs=.97+.03*hc; } else vs*=.4; }
    if(kind==4.){ float arm=floor(fsp/${NSP / 12}.), aa=h1(arm+seed*17.)*TAU, ab=h1(arm*1.7+seed*5.)*.9+.25;
      d=normalize(vec3(cos(aa)*sin(ab),cos(ab)*.9+.2,sin(aa)*sin(ab))+(vec3(ha,hb,hc)-.5)*.1); vs=.3+.7*hc; }
    if(kind==1.) vs=.7+.3*hc;
    float k=kind==1.?1.5:kind==4.?1.9:2.7, g=kind==1.?1.5:kind==4.?1.3:.8, ex=1.-exp(-k*ta);
    pos=d.xy*R*vs*ex*((kind==1.||kind==4.)?1.15:1.)-vec2(0.,g*(ta/k-ex/(k*k)));
    pos+=(vec2(h1(fsp+ftr*7.3),h1(fsp*1.9+ftr*3.1))-.5)*.05*R*ftr/${NTR}.-vec2(0.,.22*(a-ta));
    float fd=kind==1.?.75:kind==4.?1.:1.5;
    br=exp(-ta*fd)*pow(1.-ftr/${NTR}.,1.3)*(.55+.45*sin(uTw*(18.+hc*30.)+ha*60.+ftr))*(.7+.3*d.z)*smoothstep(life,life*.55,a);
    col=mix(vec3(1.,.95,.85),col,smoothstep(0.,.22,ta));
    if(kind==1.) col=mix(col,vec3(1.,.42,.1),smoothstep(.4,2.4,ta));
    if(kind==3.&&ta>.85){ br*=step(.55,h1(fsp+floor(uTw*26.)*.37))*3.2; col=mix(col,vec3(1.,.97,.9),.7); }
    br*=tr==0?5.:2.3; sz=tr==0?1.:.62;
  }
  float asp=uRes.x/uRes.y;
  vec2 P=uAnch+(S.xy+pos)*uFs;
  bool old=uBeam<=0.||(uBeam<1.&&(P.y/256.+.5)<1.-uBeam*1.04+.02);
  vec2 hs=vec2(max(.095*uFs*sz,old?1.:.62));
  if(uMir>.5){ if(P.y<uYh) return; P.y=2.*uYh-P.y; hs.y*=3.5; br*=.55; } else if(P.y<uYh-1.) return;
  P+=(qd*2.-1.)*hs;
  gl_Position=vec4(P.x/(128.*asp),P.y/128.,0.,1.); vCol=vec4(col*br,old?1.:0.);
}`;
  const SFS = `
in vec4 vCol;
void main(){ vec2 q=vUv*2.-1.; float d=dot(q,q); if(d>1.) discard;
  fragColor=vec4(vCol.rgb*(vCol.a>.5?1.:exp(-d*3.)*(1.-d)),0.); }`;

  let prog, sparks, vao, msg, shells = [], Dtab, T0, B, RD = {}, LAT;
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const lerp = (a, b, k) => a + (b - a) * k, h1 = x => { const s = Math.sin(x * 127.1 + 3.3) * 43758.5453; return s - Math.floor(s); };
  const DT = 1 / 500, shU = new Float32Array(NS * 4), shC = new Float32Array(NS * 4), glU = new Float32Array(NG * 4), glC = new Float32Array(NG * 3);
  const LDT = 1 / 240, L0 = -1, NLAT = 6;            // the car's pre-simulated state: lateral y, camera x, yaw, roll, heave, wheel lift
  const COLS = [[1, 0.72, 0.3], [0.55, 0.75, 1], [1, 0.4, 0.12], [1, 0.9, 0.7], [1, 0.16, 0.2]];
  // firework time runs slow in the silence of bar 61
  const warp = t => { const x = t - B[61]; return x < 0 ? t : B[61] + 0.2 * x + 0.8 * 0.3 * (1 - Math.exp(-x / 0.3)); };
  const rate = t => { const x = t - B[61]; return x < 0 ? 1 : 0.2 + 0.8 * Math.exp(-x / 0.3); };

  function init() {
    prog = G.program(FS, 'race'); sparks = G.program(SFS, 'race-sparks', SVS); vao = G.gl.createVertexArray();
    msg = PIX.message('SCORE LEVEL 3THE ROAD TO THE FIESTAKMH');
    B = LEY.barT; T0 = B[48] - 1;
    const beat = (B[53] - B[52]) / 3, W = 0.13;
    // speed in lamp-posts per second: 2 per bar in the hush, then 1, 2 and 4 per beat; linear ramps centred on the bar lines keep the phase
    const ramp = (t, tb, a, b) => t < tb - W ? a : t > tb + W ? b : a + (b - a) * (t - tb + W) / (2 * W);
    const speed = t => (t < B[54] ? ramp(t, B[52], 2 / 3, 1) : t < B[57] ? ramp(t, B[56], 1, 2) : t < B[59] ? ramp(t, B[58], 2, 4)
      : t < B[60] ? 4 : Math.max(1.1, 4 * Math.exp(-(t - B[60]) / 1.5))) / beat * rate(t);
    const n = Math.ceil((B[62] + 2 - T0) / DT); Dtab = new Float32Array(n + 1);
    for (let i = 0; i < n; i++) Dtab[i + 1] = Dtab[i] + speed(T0 + (i + 0.5) * DT) * DT;
    const off = Dtab[Math.round((B[52] - T0) / DT)];
    for (let i = 0; i <= n; i++) Dtab[i] -= off;
    // ---- the road as a function of scene time x: heading, curvature (1/m), hill curvature; shared by draw() and the simulation ----
    const T52 = B[52] - B[48], T56 = B[56] - B[48], T58 = B[58] - B[48], T60 = B[60] - B[48], T61 = B[61] - B[48];
    RD.env = x => 1 - sm(T58 - 1.5, T60 - 0.6, x);                      // the road winds, then straightens for the climb
    RD.th = x => (0.2 * Math.sin(x * 0.62 + 0.4) + 0.07 * Math.sin(x * 1.47 + 2)) * RD.env(x);
    RD.K = x => (RD.th(x + 0.05) - RD.th(x - 0.05)) / 0.1 * 0.021 * (0.4 + 0.6 * RD.env(x));
    RD.crest = x => sm(T60 - 0.3, T60 + 0.22, x);
    RD.Q = x => { const crest = RD.crest(x);
      return 0.0004 * Math.sin(x * 1.15) * (1 - sm(T52, T56, x)) + 0.0002 * Math.sin(x * 0.9 + 1) * sm(T52, T60, x) * (1 - sm(T58 - 1, T58, x))
        + 0.0026 * sm(T58 - 0.4, T60 - 0.8, x) * (1 - crest) - 0.0028 * crest * (1 - 0.75 * sm(T60 + 0.2, T61 + 0.6, x)); };
    // ---- the car, pre-simulated at 240 Hz over the whole drive (deterministic: any moment can be drawn, seeking works).
    //  Road frame: y = metres right of the centre line. The demo's speeds are exaggerated (up to ~900 km/h), so the dynamics run
    //  on a compressed "felt" speed ve. A curve pushes the car outwards with ve^2*K; the driver steers for a racing line
    //  (outside -> apex -> outside, plus a lazy weave) with a reaction lag; the tyres give at most AMAX (soft limit), and near
    //  the limit the tail steps out (drift angle). Yaw (heading vs road) = lateral velocity / speed + drift. The body rolls
    //  outwards on a spring-damper driven by the lateral acceleration (it overshoots a little on direction changes) and heaves
    //  on another, driven by road bumps, the kick drum, the hill's curvature (compressed in the dip, unweighted over the crest)
    //  and squat / lift under acceleration / braking. The camera follows the car's lateral position with a lag. ----
    const kicks = LEY.SYNC.kick.filter(t => t > B[48] && t < B[62]).map(t => t - B[48]);
    const L1 = B[62] + 2 - B[48], nl = Math.ceil((L1 - L0) / LDT) + 1; LAT = new Float32Array(nl * NLAT);
    const AMAX = 13, WD = 2 * Math.PI * 0.42, WR = 2 * Math.PI * 1.7, WH = 2 * Math.PI * 1.75, WC = 2 * Math.PI * 0.5, EDGE = 5.2 - 1.15;
    const ve = x => 36 * Math.pow(speed(B[48] + x) * SP / 36, 0.42);
    const bump = d => 0.009 * Math.sin(d / 2.3) + 0.006 * Math.sin(d / 1.13 + 1) + 0.004 * Math.sin(d / 0.61 + 2);
    let y = 0, vy = 0, ac = 0, rl = 0, rlv = 0, cam = 0, cav = 0, hv = 0, hvv = 0, lift = 0, lv = 0, ki = 0, vp = ve(L0), d = 0;
    const line = x => Math.max(-3, Math.min(3, 300 * (1.45 * RD.K(x + 0.45) - 0.225 * (RD.K(x - 0.7) + RD.K(x + 1.6))) + 0.8 * Math.sin(x * 0.53 + 1) * RD.env(x)));
    y = cam = line(L0);
    for (let i = 0; i < nl; i++) {
      const x = L0 + i * LDT, v = ve(x), K = RD.K(x);
      const ades = WD * WD * (line(x) - y) - 2 * 0.8 * WD * vy + v * v * RD.K(x + 0.12);   // to the line, plus what the bend will ask for
      ac += (ades - ac) * LDT / 0.16;                                                     // reaction lag
      const at = AMAX * Math.tanh(ac / AMAX);                                             // grip limit
      vy += (at - v * v * K) * LDT; y += vy * LDT;
      if (Math.abs(y) > EDGE) { y = Math.sign(y) * EDGE; vy *= -0.2; }                    // stays on the tarmac
      const sat = ac / AMAX, yaw = vy / v + 0.28 * Math.sign(sat) * Math.max(0, Math.abs(sat) - 0.55) ** 2;
      rlv += (WR * WR * (0.0038 * at - rl) - 2 * 0.32 * WR * rlv) * LDT; rl += rlv * LDT;
      cav += (WC * WC * (y - cam) - 2 * 0.9 * WC * cav) * LDT; cam += cav * LDT;
      const along = Math.max(-20, Math.min(20, (v - vp) / LDT)); vp = v; d += speed(B[48] + x) * SP * LDT;
      const f = WH * WH * bump(d) - 0.55 * v * v * RD.Q(x) - 0.25 * along;
      while (ki < kicks.length && kicks[ki] <= x) { hvv -= kicks[ki] >= T60 - 0.01 ? 0.35 : 0.06 + 0.1 * sm(T52, T60, x); ki++; }
      hvv += (f - WH * WH * hv - 2 * 0.3 * WH * hvv) * LDT; hv += hvv * LDT;
      const up = -0.55 * v * v * RD.Q(x) - 8.6;                                           // over the crest the road falls away faster than g
      if (lift > 0 || up > 0) { lv += up * LDT; lift = Math.min(0.05, lift + lv * LDT); if (lift <= 0) { lift = 0; lv = 0; hvv -= 0.3; } }
      LAT.set([y, cam, yaw, rl, hv, lift], i * NLAT);
    }
    // the shells: one per kick (bursting on it), extra ones between the beats under the triplets, six on the climax, one for the last chord
    const K = LEY.SYNC.kick.filter(t => t >= B[52] - 0.01 && t < B[60] - 0.05);
    K.forEach((t, i) => { const big = sm(B[52], B[60], t);
      shells.push({ t, x: ((i * 0.618 + 0.2) % 1 - 0.5) * 9, y: 3.3 + 2.4 * h1(i * 3.7), R: 1.5 + 0.9 * big + 0.5 * h1(i + 0.5), kind: [0, 1, 2, 0, 3, 4][i % 6], col: COLS[i % 4] }); });
    for (let t = B[58] + beat / 2, i = 0; t < B[60] - 0.1; t += beat, i++)
      shells.push({ t, x: ((i * 0.382 + 0.6) % 1 - 0.5) * 11, y: 2.6 + 2 * h1(i * 5.1), R: 1.3, kind: [3, 0, 2][i % 3], col: COLS[(i + 2) % 5] });
    [[-7.4, 4.3, 1, 0], [-4.3, 6.2, 0, 1], [-1.5, 4.6, 4, 2], [1.7, 6.5, 3, 3], [4.5, 4.4, 2, 4], [7.5, 6, 1, 0]].forEach(([x, y, kind, c], i) =>
      shells.push({ t: B[60] + i * 0.035, x, y, R: 3.6 + 0.5 * (i % 2), kind, col: COLS[c], huge: 1 }));
    shells.push({ t: B[61], x: 0.4, y: 6.3, R: 5.2, kind: 1, col: COLS[0], huge: 1 });
    shells.forEach((s, i) => { s.seed = h1(i * 7.7 + 1.3) * 0.98; s.tw = warp(s.t); });
  }
  const dist = t => { const x = Math.max(0, Math.min(Dtab.length - 2, (t - T0) / DT)), i = Math.floor(x); return Dtab[i] + (Dtab[i + 1] - Dtab[i]) * (x - i); };
  const latAt = lt => { const x = Math.max(0, Math.min(LAT.length / NLAT - 2, (lt - L0) / LDT)), i = Math.floor(x), f = x - i, o = [];
    for (let c = 0; c < NLAT; c++) o.push(LAT[i * NLAT + c] + (LAT[(i + 1) * NLAT + c] - LAT[i * NLAT + c]) * f); return o; };

  function draw(st, tgt) {
    const gl = G.gl, lt = st.lt, T52 = B[52] - B[48], T56 = B[56] - B[48], T58 = B[58] - B[48], T60 = B[60] - B[48], T61 = B[61] - B[48];
    const beam = Math.min(1, Math.max(0, (lt - T52) / 1.4));
    const ltq = beam < 1 ? Math.floor(lt * 50) / 50 : lt, t = B[48] + ltq;          // the old machine runs at 50 Hz
    const D = dist(t), vel = (dist(t + 0.01) - dist(t - 0.01)) / 0.02 * SP;         // lamp units; metres per second
    const drive = sm(T52, T60, ltq), low = sm(T56, T60 - 0.4, ltq), after = sm(T60, T60 + 1.2, ltq);
    // camera: drops and widens as the music builds; the hill grows under the triplets and falls away on the climax chord
    const kick = LEY.env('kick', t, 9);
    const F = lerp(lerp(185, 118, low), 160, after * 0.7) - 5 * kick * drive;
    const Hc = lerp(lerp(2.9, 1.45, sm(T52 + 0.4, T60 - 0.4, ltq)), 1.9, after), Zc = lerp(lerp(5.6, 3.9, sm(T52 + 0.4, T60 - 0.4, ltq)), 4.6, after);
    const crest = RD.crest(ltq), Q = RD.Q(ltq);
    const HY = lerp(14, -24, sm(T52 + 0.2, T60 - 0.5, ltq)) + 9 * crest * (1 - sm(T60 + 0.1, T60 + 1.4, ltq));
    const ZMAX = 330, zs = Q < 0 ? Math.sqrt(2 * Hc / -Q) : 1e9, Zvis = Math.min(zs, ZMAX);
    const Yh = Q < 0 && zs < ZMAX ? HY - F * Math.sqrt(2 * -Q * Hc) : HY + F * (Q * ZMAX / 2 - Hc / ZMAX);
    // the road winds, then straightens for the climb so that the palace stands dead ahead
    const theta = RD.th(ltq), K = RD.K(ltq);
    // the car and the camera that chases it (pre-simulated in init)
    const [carY, camX, yaw, roll, heave, lift] = latAt(ltq);
    const ps = 6.2 * Math.pow(1.36, Math.min(lt, T52) / T52) * Math.pow(1.75, sm(T52, T58 + 1, ltq)) * Math.pow(2.1, sm(T60 - 0.35, T60 + 0.35, ltq)) * (1 + 0.12 * after);
    const fs = lerp(6.5, 16.5, sm(T52, T60, ltq) ** 1.25) * (1 + 0.06 * after), bx = -theta * 185, anch = [bx, HY + ps * 1.05];
    // ---- fireworks: the twelve most recent shells, the six brightest glows ----
    const tw = warp(B[48] + lt); let fl = [0, 0, 0];
    const act = shells.filter(s => tw - s.tw > -0.42 && tw - s.tw < 3.7).sort((a, b) => b.t - a.t).slice(0, NS);
    shU.fill(0); shC.fill(0); glU.fill(0); glC.fill(0);
    act.forEach((s, i) => { shU.set([s.x, s.y, tw - s.tw, s.kind + s.seed], i * 4); shC.set([...s.col, s.R], i * 4); });
    act.map(s => { const a = tw - s.tw; return { s, I: a < 0 ? 0 : (Math.exp(-a * 5) * 1.5 + 0.22 * Math.exp(-a * 1.1)) * Math.min(s.R, 2.6) / 2.6 }; })
      .sort((a, b) => b.I - a.I).slice(0, NG).forEach((g, i) => {
        glU.set([anch[0] + g.s.x * fs, anch[1] + g.s.y * fs, g.s.R * fs * 1.1, g.I], i * 4); glC.set(g.s.col, i * 3);
        for (let c = 0; c < 3; c++) fl[c] += g.s.col[c] * g.I * 0.38;
      });
    { const m = Math.max(...fl); if (m > 1.3) fl = fl.map(v => v * 1.3 / m); }
    const fr = D - Math.floor(D), pulse = Math.exp(-Math.pow(Math.min(fr, 1 - fr) * SP / 5, 2)) * sm(0, 1, beam);
    const sil = sm(T61, T61 + 0.5, lt), end = st.dur - lt;
    G.draw(prog, {
      uAtlas: PIX.atlas, uMsg: msg, uBeam: beam, uLt: ltq, uDl: D, uF: F, uH: Hc, uHY: HY, uYh: Yh, uQ: Q, uK: K, uCamX: camX, uZvis: Zvis, uZc: Zc,
      uPs: ps, uBx: bx, uScore: 48250 + LEY.count('melody', t) * 50, uKmh: Math.min(999, Math.round(vel * 3.6)), uRoll: roll,
      uBlur: vel * 0.013, uMb: vel * 0.011, uSmoke: sm(T52, T56, lt) * 0.6 + 0.4 * sm(T58, T60, lt), uPulse: pulse, uWarp: sm(T56, T60, ltq) * (1 - sil),
      uCarX: carY - camX, uYaw: yaw, uHv: heave, uLift: lift, uBrake: sil,
      uVp: [F * (K * 60 - camX / 120), Yh], uRefl: 1 - 0.85 * sm(0.0004, 0.0016, Q), uFl: fl, uGl: glU, uGlC: glC,
    }, tgt);
    // the sparks, added where the sky is open, and once more upside down in the wet road
    gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.DST_ALPHA, gl.ONE, gl.ZERO, gl.ONE);
    for (let m = 0; m < 2; m++) {
      if (m && beam <= 0) break;
      G.use(sparks, { uSh: shU, uShC: shC, uAnch: anch, uFs: fs, uMir: m, uYh: Yh, uBeam: beam, uTw: tw }, tgt);
      gl.bindVertexArray(vao); gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, NS * NSP * NTR);
    }
    gl.disable(gl.BLEND);
    const crt = 1 - sm(T52 + 0.9, T52 + 2.5, lt), wide = sm(T52 + 1.1, T52 + 2.9, lt), hit = Math.exp(-Math.max(0, lt - T60) * 7) * (lt >= T60 ? 1 : 0);
    return { lines: 256, ocs: 1, beam, crt, fa: 1.25 + (st.W / st.H - 1.25) * wide, scan: 256, bloom: 0.5 + 0.15 * low, thresh: 1.0, expo: 1.0,
      aberr: 0.22 * crt + 0.35 * low * (1 - sil), grain: 0.03, vig: 0.35 + 0.25 * (1 - crt), flash: 0.22 * hit,
      fade: Math.min(1, lt / 0.3) * sm(0.12, 1.5, end) };
  }

  (window.SCENES = window.SCENES || []).push({
    name: 'Night Drive', title: 'LEVEL 3: THE ROAD TO THE FIESTA', disk: 2, init, draw,
    range: () => [LEY.AT + LEY.sec('race')[0], LEY.AT + LEY.sec('race')[1]],
  });
})();
