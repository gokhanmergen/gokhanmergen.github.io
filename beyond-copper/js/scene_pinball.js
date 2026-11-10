'use strict';
// =====================================================================
//  DISK 2, BONUS STAGE: "PINBALL" - the Amiga pinball table.
//  Bars 94-114 of Asturias, the dance-like middle. The table is flamenco:
//  red lacquer with white lunares, a fan whose ribs light on the melody,
//  and a guitar rosette whose sound hole is the lock.
//  THEN: top-down, flat, vertically scrolling after the ball, a
//  dot-matrix score line. The raster beam passes at bar 98 and the same
//  table is ray traced: a chrome ball that mirrors the playfield, clear
//  coat, glowing bumpers; then the camera tilts down to a player's view.
//  The music plays the game. The ball's whole flight is planned from the
//  score: it meets a pop bumper on every accented chord (the castanets),
//  slingshots and targets on melody notes, a flipper on the kick, lights
//  one lamp per note around the orbit, and in bars 111-113 spirals round
//  the rosette, a lamp per arpeggio note, into the sound hole on bar 114.
//  Table units: x across (-1..1.18), y up the table (0..4.4); the ball
//  is 0.055. In 3D the playfield is the plane h = 0: p = (x, h, y).
// =====================================================================
(() => {
  const NL = 56, R = 0.055, GR = 2.2;
  const BUMP = [[-0.42, 2.45], [0.46, 2.45], [0.02, 1.98]], PK = [0.02, 2.74], RC = [0.09, 3.4], AC = [0.09, 3.3], TY = [1.4, 1.6, 1.8];

  const FS = PIX.GLSL + `
uniform sampler2D uAtlas, uMsg;
uniform vec3 uCam, uCF, uCR, uCU, uBall, uBallP, uBf, uLamp[${NL}];
uniform vec2 uSf;
uniform float uFl, uScroll, uLt, uScore, uDmd, uFa, uTg[6], uFan[12];
const float HT=.26;
const vec2 RC=vec2(.09,3.4), PKP=vec2(.02,2.74), FAN=vec2(.02,1.);
const vec2 BP[3]=vec2[3](vec2(-.42,2.45),vec2(.46,2.45),vec2(.02,1.98));
const vec3 GOLD=vec3(1.,.66,.25);
float old_, mt;
vec3 invAces(vec3 y){ y=clamp(y,0.,1.02); vec3 a=2.43*y-2.51, b=.59*y-.03, c=.14*y; return (-b-sqrt(max(b*b-4.*a*c,0.)))/(2.*a); }
vec3 o12(vec3 c){ return invAces((min(floor(clamp(c,0.,1.)*15.+.5),14.)+.02)/15.); }
vec3 H(int h){ return vec3(float((h>>8)&15),float((h>>4)&15),float(h&15))/15.; }
float bay(vec2 p){ ivec2 i=ivec2(mod(p,4.)); const float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return (m[i.y*4+i.x]+.5)/16.; }
float box2(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.))+min(max(d.x,d.y),0.); }
float ext(float d, float y, float h, float r){ vec2 w=vec2(d,y-h)+r; return min(max(w.x,w.y),0.)+length(max(w,0.))-r; }   // a 2D shape extruded to height h
float capD(vec2 p, vec2 a, vec2 b, float ra, float rb){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-mix(ra,rb,h); }
float dOutF(vec2 q){ return q.y<3.3 ? max(abs(q.x-.09)-1.09,-.05-q.y) : length(q-vec2(.09,3.3))-1.09; }   // > 0 outside the playfield
float cv(float d, float px){ return px>0. ? smoothstep(px,-px,d) : step(d,0.); }

// ------------------------- everything that stands on the table -------------------------
float map(vec3 p){
  vec2 q=p.xz, m=vec2(abs(q.x),q.y); float d, e;
  float dO=dOutF(q); d=ext(max(-dO,dO-.12),p.y,.22,.012); mt=1.;                                                    // cabinet walls and the top arch
  e=ext(box2(q-vec2(1.02,1.66),vec2(.02,1.71)),p.y,.2,.01); if(e<d){ d=e; mt=2.; }         // shooter-lane rail
  e=ext(max(max(dot(m-vec2(1.,.98),vec2(-.7071,.7071)),.44-m.x),q.x-1.),p.y,.17,.012); if(e<d){ d=e; mt=3.; }   // inlane aprons
  e=ext(max(max(m.x-.72,dot(m-vec2(.72,.8),vec2(.316,-.949))),dot(m-vec2(.72,1.2),vec2(-.857,.514)))-.02,p.y,.15,.012); if(e<d){ d=e; mt=4.; }   // slingshots
  if(q.y<.95){
    vec2 pv=vec2(q.x<0.?-.46:.46,.5), tip=pv+.34*vec2(q.x<0.?cos(uFa):-cos(uFa),sin(uFa));
    e=ext(capD(q,pv,tip,.055,.03),p.y,.11,.02); if(e<d){ d=e; mt=5.; }                     // flippers
    e=ext(length(vec2(q.x-1.11,max(q.y-.26,0.)))-.04,p.y,.09,.01); if(e<d){ d=e; mt=10.; } // plunger
  }
  for(int i=0;i<3;i++){
    float r=length(q-BP[i]);
    if(r>.45) continue;
    e=min(ext(r-.112,p.y,.19,.01),ext(r-.176,p.y,.022,.008));
    vec2 w=vec2(r-.15*(1.+.06*uBf[i]),abs(p.y-.205)-.03)+.015; e=min(e,min(max(w.x,w.y),0.)+length(max(w,0.))-.015);
    if(e<d){ d=e; mt=6.+float(i)*.1; }
  }
  e=ext(length(q-PKP)-.04,p.y,.13,.015); if(e<d){ d=e; mt=7.; }                             // the post between the top bumpers
  float ly=q.y-1.4-clamp(floor((q.y-1.3)/.2),0.,2.)*.2;
  e=ext(box2(vec2(m.x-.975,ly),vec2(.02,.058)),p.y,.105,.006); if(e<d){ d=e; mt=8.; }         // stand-up targets
  vec3 pa=p-uBall, ba=uBallP-uBall; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-7),0.,1.);
  e=length(pa-ba*h)-.055; if(e<d){ d=e; mt=9.; }                                             // the ball (stretched along its motion)
  return d;
}

// ------------------------------- the painted playfield -------------------------------
void art(vec2 q, vec2 cell, float px, out vec3 a, out vec3 e){
  bool o=px<=0.; e=vec3(0.);
  vec3 RED=o?H(0xA01):vec3(.4,.012,.03), WHT=o?H(0xEED):vec3(.85,.83,.78), GLD=o?H(0xEA3):vec3(.95,.62,.2), BLK=o?H(0x101):vec3(.012,.01,.014), BLU=o?H(0x05A):vec3(0.,.09,.38);
  float dO=dOutF(q);
  if(dO>0.){ a=vec3(0.); return; }
  a=RED;
  vec2 g=q/.2; g.x+=.5*mod(floor(g.y),2.);
  a=mix(a,WHT,cv(length(fract(g)-.5)*.2-.033,px));                                           // lunares
  if(o&&dO>-.05&&bay(cell)<.5) a=H(0x601);
  a=mix(a,GLD,cv(abs(dO+.075)-.008,px));
  float cf=box2(q-vec2(.02,1.78),vec2(.34,.86))-.28;                                          // the black lacquer field in the middle
  a=mix(a,o?BLK:vec3(.03,.011,.018),cv(cf,px)); a=mix(a,GLD,cv(abs(cf)-.009,px));
  if(q.y<.3) a=BLK;
  if(q.x>1.03){ float s=fract((q.y-abs(q.x-1.11)*1.3)/.24); a=mix(BLK,o?H(0x960):GLD*.5,cv((abs(s-.5)-.14)*.24,px)); }
  // the guitar rosette around the sound hole
  vec2 rv=q-RC; float rr=length(rv);
  if(rr<.63){
    vec3 c=BLK;
    if(rr>.46){ float ti=floor(atan(rv.y,rv.x)/TAU*48.), tj=floor((rr-.46)/.0275), k=mod(ti+tj*2.+step(2.,tj),4.);
      c=rr>.57?GLD:k<1.?WHT:k<2.?BLU:k<3.?RED:GLD; }
    c=mix(c,GLD,cv(abs(rr-.45)-.008,px)); c=mix(c,GLD,cv(abs(rr-.3)-.003,px)); c=mix(c,GLD,cv(abs(rr-.115)-.016,px));
    if(!o) c*=.55+.45*smoothstep(.1,.6,rr);
    c=mix(c,vec3(0.),cv(rr-.097,px));
    a=mix(a,c,cv(rr-.6,px));
  }
  // the fan: one rib per melody note
  vec2 fv=q-FAN; float fr=length(fv), fk=(atan(fv.y,fv.x)-.349)/.2036;
  if(fr<.66&&fk>-.3&&fk<12.3){
    float id=clamp(floor(fk),0.,11.), ff=fk-id, lit=uFan[int(id)];
    float din=max(max(.13-fr,fr-.62),max(-fk,fk-12.)*.2036*fr);
    vec3 c=fr<.27?(o?H(0xC82):vec3(.6,.36,.12)):(mod(id,2.)<1.?BLU:WHT);
    c=mix(c,GLD,cv((min(ff,1.-ff)-.07)*.2036*fr,px)); c=mix(c,GLD,cv(abs(fr-.27)-.008,px)); c=mix(c,GLD,cv(abs(fr-.605)-.012,px));
    if(o){ if(lit>.45) c=fr<.27?H(0xFD6):H(0xFE8); } else e+=vec3(1.,.72,.38)*lit*1.5*cv(din+.01,px);
    a=mix(a,c,cv(din,px));
  }
  a=mix(a,GLD,cv(fr-.05,px));
  // O, L, E: an insert in front of each target
  float sx=q.x<0.?-1.:1., tk=clamp(floor((q.y-1.3)/.2),0.,2.); vec2 tl=vec2(q.x-sx*.78,q.y-1.4-tk*.2); float td=length(tl)-.06;
  if(td<.03){
    float lit=uTg[int(tk)+(sx>0.?3:0)];
    vec3 c=o?(lit>.5?H(0xFD6):H(0x740)):mix(vec3(.2,.1,.03),vec3(1.,.72,.3),min(lit,1.));
    float ink=pixGlyph(uAtlas,tk>1.5?47.:tk>.5?44.:37.,vec2(tl.x/.085+.56,.5-tl.y/.085));
    c=mix(c,o?H(0x200):vec3(.04,.01,.01),ink);
    if(!o) e+=vec3(1.,.6,.2)*lit*1.3*(1.-ink)*cv(td,px);
    a=mix(a,c,cv(td,px)); a=mix(a,GLD,cv(abs(td)-.007,px));
  }
  // a lamp wherever the ball will be when a note of the orbit, or of the arpeggios, sounds
  if(q.y>1.75) for(int i=0;i<${NL};i++){
    vec3 L=uLamp[i]; float d=length(q-L.xy)-(i<20?.03:.024); if(d>.03) continue;
    vec3 lc=i<20?vec3(.4,.68,1.):vec3(1.,.66,.28);
    vec3 c=o?(L.z>.5?(i<20?H(0xBEF):H(0xFE8)):(i<20?H(0x124):H(0x530))):mix(lc*.07,lc,min(L.z,1.));
    a=mix(a,c,cv(d,px)); a=mix(a,GLD,cv(abs(d)-.006,px));
    if(!o) e+=lc*L.z*2.4*cv(d,px);
  }
  for(int i=0;i<3;i++){
    float r=length(q-BP[i]); a=mix(a,GLD,cv(abs(r-.215)-.009,px));
    if(!o){ float f=uBf[i], age=-log(max(f,1e-3))/5.; e+=vec3(1.,.5,.2)*f*1.2*exp(-pow((r-.2-age*1.7)*13.,2.)); }   // the kick, as a ring of light
  }
  vec2 l=vec2((q.x+.35)/.1,(.21-q.y)/.1);
  if(l.x>0.&&l.x<7.&&l.y>0.&&l.y<1.) a=mix(a,GLD,pixGlyph(uAtlas,pixMsg(uMsg,20.+floor(l.x)),vec2(fract(l.x),l.y)));
}

// the dot-matrix line: 20 characters of amber dots
vec3 dmd(vec2 P, bool fine){
  float gx=P.x+160., gy=128.-P.y, ci=floor(gx/16.), code=0.;
  if(uDmd<.5) code=fract(uLt*2.2)<.7?pixMsg(uMsg,ci):0.;
  else if(ci<9.) code=pixMsg(uMsg,20.+(uDmd>1.5?9.:0.)+ci);
  else if(ci>11.) code=16.+mod(floor(uScore/pow(10.,19.-ci)+.001),10.);
  float ink=pixGlyph(uAtlas,code,(floor(vec2(mod(gx,16.),gy)/2.)+.5)/8.);
  if(uDmd>1.5&&ci<9.&&fract(uLt*9.)<.5) ink=1.-ink;
  bool dot=!fine||mod(floor(gx),2.)<1.||mod(floor(gy),2.)<1.;
  return gy>15.&&fine?H(0xEA3):dot?(ink>.5?H(0xFA1):fine?H(0x410):H(0x200)):H(0x100);
}

vec3 env(vec3 d){                                     // the room: two soft boxes overhead and the glow of the backbox
  float k=max(d.y,.05), up=smoothstep(0.,.25,d.y);
  vec3 c=vec3(.004,.0035,.006);
  c+=vec3(1.,.8,.58)*1.7*exp(-pow((d.z/k-.9)*1.5,2.))*up*smoothstep(1.5,.3,abs(d.x/k));
  c+=vec3(.3,.48,1.)*.9*exp(-pow((d.z/k+.75)*1.7,2.))*up*smoothstep(1.7,.4,abs(d.x/k));
  c+=vec3(1.,.33,.1)*.22*exp(-pow((d.y-.16)*6.,2.))*smoothstep(.55,.95,d.z);
  return c;
}

void main(){
  old_=isOld(); float asp=uRes.x/uRes.y;
  vec2 cell=floor(vUv*vec2(256.*asp,256.));
  vec3 ro, rd, col=vec3(0.), wgt=vec3(1.);
  if(old_>.5){
    vec2 P=cell+.5-vec2(128.*asp,128.);
    if(P.y>112.){ fragColor=vec4(o12(dmd(P,true)),1.); return; }
    ro=vec3(.09+P.x/136.,1.,uScroll+(P.y+128.)/136.); rd=vec3(0.,-1.,0.);
  } else {
    vec2 uv=(gl_FragCoord.xy-.5*uRes)/(.5*uRes.y);
    ro=uCam; rd=normalize(uCF*uFl+uCR*uv.x+uCU*uv.y);
  }
  float pxk=1.6/(uFl*uRes.y), dist=0.;
  for(int b=0;b<2;b++){
    bool down=rd.y<-1e-4; float t0=0., t1;
    if(down){ t0=max((HT-ro.y)/rd.y,0.); t1=-ro.y/rd.y; } else t1=rd.y>1e-4?(HT-ro.y)/rd.y:9.;
    t1=min(t1,t0+9.);
    float t=t0+.001; bool hit=false;
    if(t1>t0) for(int i=0;i<48;i++){ float d=map(ro+rd*t); if(d<.0012){ hit=true; break; } t+=d*.95; if(t>=t1) break; }
    float tb=(4.62-ro.z)/rd.z;                           // the backbox: the title in lights, and the same dot-matrix score line
    if(old_<.5&&rd.z>0.&&tb>0.&&tb<(hit?t:down?t1:1e9)){
      vec3 pb=ro+rd*tb; vec2 bq=vec2(pb.x-.09,pb.y-.3);
      if(abs(bq.x)<1.15&&bq.y>0.&&bq.y<1.02){
        vec3 c=vec3(.05,.004,.008);
        vec2 l=vec2((bq.x+1.05)/.3,(.86-bq.y)/.3);
        if(l.x>0.&&l.x<7.&&l.y>0.&&l.y<1.) c=mix(c,vec3(1.,.6,.18)*(2.2+uBf.x+uBf.y+uBf.z),pixGlyph(uAtlas,pixMsg(uMsg,20.+floor(l.x)),vec2(fract(l.x),l.y)));
        if(abs(bq.y-.2)<.0575) c=dmd(vec2(bq.x/1.09*160.,112.+(bq.y-.1425)/.115*16.),false)*vec3(2.4,2.,1.6);
        if(abs(bq.x)>1.1||bq.y<.04||bq.y>.98) c=GOLD*.35;
        col+=wgt*c; break;
      }
    }
    if(!hit&&!down){ col+=wgt*env(rd); break; }
    if(!hit) t=t1;
    float hm=hit?mt:0.; bool ball=hm>8.5&&hm<9.5;
    vec3 p=ro+rd*t; vec2 q=p.xz, m=vec2(abs(q.x),q.y); dist+=t;
    // normal, and how close the nearest thing stands (contact shadows; in 1985 a hard drop shadow instead)
    vec3 n=vec3(0.); float av=0.;
    for(int i=0;i<4;i++){
      vec3 k=.5773*(2.*vec3(float(((i+3)>>1)&1),float((i>>1)&1),float(i&1))-1.);
      float v=map(old_>.5?p+vec3(-.03,.075,.03):p+k*.0015); n+=k*v; av+=v*.25;
    }
    float nv0=max(-rd.y,.12), px=old_>.5?0.:max(pxk*dist/nv0,1e-4);
    vec3 a=vec3(0.), e=vec3(0.), oc; float met=0., gls=.3;
    if(hm<.5){ art(q,cell,px,a,e); oc=a; if(old_>.5&&av<0.&&mod(cell.x+cell.y,2.)<1.) oc=H(0x200); }
    else if(hm<1.5){ float dO=dOutF(q); bool rail=dO<.05||p.y<.2; a=rail?GOLD:vec3(.03,.004,.008); met=rail?1.:0.; gls=.6;
      oc=dO<.018?H(0xFD6):dO<.05?H(0xC82):H(0x501); }
    else if(hm<2.5){ a=GOLD; met=1.; oc=H(0xC82); }
    else if(hm<3.5){ bool ed=dot(m-vec2(1.,.98),vec2(-.7071,.7071))>-.035; a=ed?GOLD:vec3(.3,.01,.02); met=ed?1.:0.; gls=.6; oc=ed?H(0xEA3):H(0x801); }
    else if(hm<4.5){ float f=q.x<0.?uSf.x:uSf.y; bool rub=dot(m-vec2(.72,1.2),vec2(-.857,.514))>-.05||p.y<.135;
      a=rub?vec3(.85,.83,.8):vec3(.4,.012,.03); e=vec3(1.,.6,.25)*f*(rub?1.1:.25); gls=.6; oc=f>.5?H(0xFE8):rub?H(0xEED):H(0xC12); }
    else if(hm<5.5){ float dp=length(q-vec2(q.x<0.?-.46:.46,.5)); bool cap=dp<.03;
      a=cap?GOLD:p.y>.095?vec3(.88,.86,.78):vec3(.65,.03,.04); met=cap?1.:0.; gls=.5; oc=cap?H(0xC12):H(0xEED); }
    else if(hm<6.5){
      int bi=int((hm-6.)*10.+.5); float f=uBf[bi]; vec2 v=q-BP[bi]; float r=length(v), an=atan(v.y,v.x);
      if(p.y<.1&&r>.125){ a=vec3(.85,.84,.8); oc=H(0xBBC); }
      else if(p.y<.165){ a=vec3(.9,.85,.8); e=vec3(1.,.55,.2)*(.45+3.*f); oc=H(0xEED); }
      else { gls=.7;
        if(r>.132){ a=GOLD; met=1.; oc=H(0xFD6); }
        else if(r<.034+.014*cos(an*8.)){ a=GOLD; met=1.; e=GOLD*f*2.; oc=H(0xFD6); }
        else if(length(vec2(r-.092,(fract(an/TAU*8.+.5)-.5)*TAU/8.*r))<.021){ a=vec3(.9); e=vec3(1.,.9,.7)*f*4.; oc=H(0xFFF); }
        else { a=vec3(.42,.012,.03); e=vec3(1.,.25,.08)*f*1.5; oc=f>.55?H(0xF80):H(0xC12); } }
    }
    else if(hm<7.5){ bool cap=length(q-PKP)<.024; a=cap?GOLD:vec3(.7,.03,.05); met=cap?1.:0.; oc=cap?H(0xFD6):H(0xC12); }
    else if(hm<8.5){ float lit=uTg[int(clamp(floor((q.y-1.3)/.2),0.,2.))+(q.x>0.?3:0)]; float ly2=q.y-1.4-clamp(floor((q.y-1.3)/.2),0.,2.)*.2; bool dotp=length(vec2(ly2,p.y-.055))<.028;
      a=dotp?vec3(.88):vec3(.4,.012,.03); e=vec3(1.,.7,.3)*lit*(dotp?2.2:.5); gls=.6; oc=lit>.5?H(0xFD6):H(0xEED); }
    else if(ball){ a=vec3(.9,.92,.95); met=1.; vec2 bd=(q-uBall.xz)/.055;
      oc=length(bd-vec2(-.36,.36))<.27?H(0xFFF):dot(bd,vec2(-.7071,.7071))<-.42?H(0x556):H(0xBBC); }
    else { a=vec3(.6,.6,.65); met=1.; oc=H(0x99A); }
    if(old_>.5){ col=oc; break; }
    if(hm<.5&&dOutF(q)>0.) break;                      // the dark room around the cabinet

    vec3 N=normalize(n);
    if(hm<.5){ vec2 rv=q-RC; float rr=length(rv); N=normalize(vec3(-rv.x,0.,-rv.y)/max(rr,1e-3)*.13*smoothstep(.6,.5,rr)*smoothstep(.1,.2,rr)+vec3(0.,1.,0.)); }
    float nv=max(dot(N,-rd),0.), ao=hm<.5?.25+.75*smoothstep(0.,.075,av):.5+.5*smoothstep(0.,.1,p.y);
    vec3 dif=vec3(.06,.055,.065)*(.5+.5*N.y), spc=vec3(0.);
    for(int i=0;i<9;i++){
      vec3 lp=i<3?vec3(BP[i].x,.36,BP[i].y):i==3?vec3(-.56,.3,.98):i==4?vec3(.56,.3,.98):i==5?vec3(-.86,.5,3.):i==6?vec3(.86,.5,3.):i==7?vec3(.09,.55,4.05):vec3(0.,.6,.25);
      vec3 lc=i<3?vec3(1.,.55,.25)*(.3+2.6*uBf[i]):i<5?vec3(1.,.8,.6)*(.22+2.*uSf[i-3]):i<8?vec3(1.,.8,.55)*.8:vec3(.75,.85,1.)*1.1;
      vec3 L=lp-p; float d2=dot(L,L); L*=inversesqrt(d2);
      float sh=1.;
      if(!ball){ vec3 bc=uBall-p; float tc=dot(bc,L); if(tc>0.&&tc*tc<d2) sh=smoothstep(.0012,.0075,dot(bc,bc)-tc*tc); }
      vec3 I=lc*sh/(1.+d2*3.5); float ndl=max(dot(N,L),0.);
      dif+=I*ndl; spc+=I*ndl*pow(max(dot(N,normalize(L-rd)),0.),70.);
    }
    col+=wgt*(a*dif*ao*(1.-met)+e+spc*gls*1.6*(met>.5?a:vec3(1.)));
    if(met>.5&&!(ball&&b==0)) col+=wgt*env(reflect(rd,N))*a*ao;
    if(b==0&&(hm<.5||ball)){ wgt*=ball?vec3(.86,.88,.92):vec3(.05+.6*pow(1.-nv,3.))*ao; ro=p+N*.003; rd=reflect(rd,N); } else break;
  }
  fragColor=vec4(old_>.5?o12(col):col,1.);
}`;

  // ============================ the choreography ============================
  const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const mix = (a, b, k) => a + (b - a) * k, nrm2 = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  const A = {                                                    // where the ball can be when something sounds
    B0: { c: BUMP[0], r: 0.19, b: 0 }, B1: { c: BUMP[1], r: 0.19, b: 1 }, B2: { c: BUMP[2], r: 0.19, b: 2 }, PK: { c: PK, r: 0.097 },
    TL0: { p: [-0.9, TY[0]], tg: 2 }, TL1: { p: [-0.9, TY[1]], tg: 1 }, TL2: { p: [-0.9, TY[2]], tg: 0 },     // tg indexes O, L, E from the top
    TR0: { p: [0.9, TY[0]], tg: 5 }, TR1: { p: [0.9, TY[1]], tg: 4 }, TR2: { p: [0.9, TY[2]], tg: 3 },
    SL: { p: [-0.506, 0.989], sl: 0 }, SR: { p: [0.506, 0.989], sl: 1 }, FL: { p: [-0.3, 0.65], fl: 1 }, FR: { p: [0.3, 0.65], fl: 1 },
  };
  // [beat from bar 94, what the ball meets]. Chords (castanets) fall on beats 4 5 | 10 11 | 15..26 | 33 35 | 40 41 | 46 47.
  const SCRIPT = [
    [0, 'PLUNGE'], [4, 'B0'], [4.5, 'TL2'], [5, 'B2'], [6, 'SL'], [7, 'SR'], [8, 'SL'], [9, 'FR'],
    [10, 'B0'], [10.5, 'TL1'], [11, 'B2'], [12, 'TR1'], [13, 'SL'], [14, 'SR'],
    [15, 'B2'], [15.5, 'TR2'], [16, 'B1'], [16.5, 'PK'], [17, 'B0'], [17.5, 'TL1'],
    [18, 'B2'], [18.5, 'TR1'], [19, 'B1'], [19.5, 'PK'], [20, 'B0'], [20.5, 'TL2'],
    [21, 'B2'], [21.5, 'TL1'], [22, 'B0'], [22.5, 'PK'], [23, 'B1'], [23.5, 'TR2'],
    [24, 'B2'], [24.5, 'TR1'], [25, 'B1'], [25.5, 'PK'], [26, 'B0'], [27, 'FL'],
    [33, 'B1'], [33.5, 'TR2'], [34.5, 'SL'], [35, 'B2'], [36, 'SL'], [37, 'SR'], [38, 'SL'], [39, 'FR'],
    [40, 'B0'], [40.5, 'TL2'], [41, 'B2'], [42, 'SR'], [43, 'SL'], [44, 'SR'], [45, 'FL'],
    [46, 'B1'], [46.5, 'TR1'], [47, 'B2'], [48, 'SL'], [49, 'SR'], [50, 'SL'], [51, 'FR'], [60, 'HOLE'],
  ];
  let prog, msg, T94 = 0, BEAT = 0.5556, segs = [], hits = { b: [[], [], []], sl: [[], []], tg: [[], [], [], [], [], []], fl: [], all: [] };
  let lamps = [], notes = [], fanNotes = [], spiral = null;
  const lampBuf = new Float32Array(NL * 3), fanBuf = new Float32Array(12), tgBuf = new Float32Array(6);

  const line = (a, b, n) => Array.from({ length: n }, (_, i) => [mix(a[0], b[0], (i + 1) / n), mix(a[1], b[1], (i + 1) / n)]);
  const arc = (c, r, a0, a1, n) => Array.from({ length: n }, (_, i) => { const a = mix(a0, a1, (i + 1) / n); return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; });
  const bez = (a, b, c, n) => Array.from({ length: n }, (_, i) => { const t = (i + 1) / n, u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]; });
  // A ball rolling along a guided path keeps its energy: v^2 = v0^2 - 2 g (y - y0). Find the launch speed that takes exactly T seconds.
  function energyPath(pts, T) {
    const n = pts.length, y0 = pts[0][1], ds = [0];
    for (let i = 1; i < n; i++) ds.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const time = (v0, out) => { let t = 0; for (let i = 1; i < n; i++) { const v2 = v0 * v0 - 2 * GR * ((pts[i][1] + pts[i - 1][1]) / 2 - y0); if (v2 < 1e-3) return Infinity; t += ds[i] / Math.sqrt(v2); if (out) out[i] = t; } return t; };
    let lo = 0.05, hi = 80; for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (time(mid) > T) lo = mid; else hi = mid; }
    const tt = [0]; const tot = time(hi, tt);
    const fn = u => { const t = Math.min(1, Math.max(0, u)) * tot; let a = 0, b = n - 1; while (b - a > 1) { const m = (a + b) >> 1; if (tt[m] <= t) a = m; else b = m; }
      const f = (t - tt[a]) / Math.max(1e-9, tt[b] - tt[a]); return [mix(pts[a][0], pts[b][0], f), mix(pts[a][1], pts[b][1], f)]; };
    fn.vEnd = Math.sqrt(Math.max(0.01, hi * hi - 2 * GR * (pts[n - 1][1] - y0)));
    return fn;
  }

  function plan() {
    const B = LEY.barT; T94 = B[94]; BEAT = (B[95] - B[94]) / 3;
    const ev = SCRIPT.map(([beat, name]) => ({ beat, t: beat * BEAT, name, a: A[name] || {} }));
    // guide points of the three guided runs (the plunge, the orbit, the shot into the rosette), for aiming the contacts next to them
    const guide = { 0: { next: [-0.93, 3.3] }, 27: { next: [-0.72, 1.9] }, 33: { prev: [0.87, 3.4] }, 4: { prev: [-0.93, 3.3] }, 51: { next: [0.89, 1.9] } };
    ev.forEach(e => { e.p = e.a.p ? e.a.p.slice() : e.a.c ? e.a.c.slice() : e.name === 'PLUNGE' ? [1.11, 0.35] : RC.slice(); });
    for (let pass = 0; pass < 3; pass++) ev.forEach((e, i) => {
      if (!e.a.c) return;
      const g = guide[e.beat] || {}, pp = g.prev || ev[i - 1].p, pn = g.next || ev[i + 1].p, c = e.a.c;
      const u = nrm2(pp[0] - c[0], pp[1] - c[1]), v = nrm2(pn[0] - c[0], pn[1] - c[1]);
      let d = nrm2(u[0] + v[0], u[1] + v[1]); if (Math.hypot(u[0] + v[0], u[1] + v[1]) < 0.2) d = u;
      e.p = [c[0] + d[0] * e.a.r, c[1] + d[1] * e.a.r];
    });
    segs = [];
    for (let i = 0; i < ev.length - 1; i++) {
      const a = ev[i], b = ev[i + 1], T = b.t - a.t; let fn;
      if (a.beat === 0) fn = energyPath([a.p, ...line(a.p, [1.11, 3.3], 40), ...arc(AC, 1.02, 0, Math.PI, 60), ...bez([-0.93, 3.3], [-0.93, 2.95], b.p, 20)], T);
      else if (a.beat === 27) fn = energyPath([a.p, ...bez(a.p, [-0.72, 1.9], [-0.69, 3.4], 50), ...arc(RC, 0.78, Math.PI, 0, 60), ...bez([0.87, 3.4], [0.87, 3.0], b.p, 20)], T);
      else if (a.beat === 51) {
        // the shot up the right-hand lane, then the spiral: faster and tighter until the sound hole takes the ball
        const Ts = 1.5 * BEAT, shot = energyPath([a.p, ...bez(a.p, [0.89, 1.9], [0.87, 3.4], 50)], Ts);
        const T1 = 8.72 * BEAT - Ts, w0 = shot.vEnd / 0.78, k = Math.log(13.5 / w0);
        spiral = { t0: a.t + Ts, T1 };
        fn = u => {
          const t = u * T; if (t < Ts) return shot(t / Ts);
          const s = Math.min(1, (t - Ts) / T1), th = w0 / k * (Math.exp(k * s) - 1) * T1, r = (0.105 + 0.675 * Math.pow(1 - s, 1.15)) * (1 - sm(T1, T - Ts, t - Ts));
          return [RC[0] + r * Math.cos(th), RC[1] + r * Math.sin(th)];
        };
      } else fn = u => [mix(a.p[0], b.p[0], u), mix(a.p[1], b.p[1], u) + GR / 2 * T * T * u * (1 - u)];   // free flight on the tilted table
      segs.push({ t0: a.t, t1: b.t, fn });
    }
    hits = { b: [[], [], []], sl: [[], []], tg: [[], [], [], [], [], []], fl: [], all: [] };
    ev.forEach(e => { if (e.a.b !== undefined) hits.b[e.a.b].push(e.t); if (e.a.sl !== undefined) hits.sl[e.a.sl].push(e.t); if (e.a.tg !== undefined) hits.tg[e.a.tg].push(e.t); if (e.a.fl) hits.fl.push(e.t); });
    hits.fl.unshift(-9);
    // one lamp per melody note of the guided runs, placed where the ball is when the note sounds
    notes = LEY.melody.filter(m => m.t >= T94 - 1e-3 && m.t < B[114] - 1e-3).map(m => m.t - T94);
    lamps = []; fanNotes = [];
    const run = (b0, b1) => notes.filter(t => t > b0 * BEAT + 0.01 && t < b1 * BEAT - 0.01).forEach(t => { const p = ballAt(t); if (p[1] > 1.9 && Math.hypot(p[0] - RC[0], p[1] - RC[1]) > 0.15 && lamps.length < NL) lamps.push({ x: p[0], y: p[1], t, vortex: b0 > 50 }); });
    run(0, 4); run(27, 33);
    while (lamps.length < 20) lamps.push({ x: 99, y: 99, t: 1e9 });
    run(51, 60);
    while (lamps.length < NL) lamps.push({ x: 99, y: 99, t: 1e9 });
    lamps.forEach((l, i) => { lampBuf[i * 3] = l.x; lampBuf[i * 3 + 1] = l.y; });
    notes.forEach(t => { const b = t / BEAT; if (!(b > 27.2 && b < 33) && b < 51) fanNotes.push(t); });
    return ev;
  }
  function ballAt(t) {
    t = Math.min(60 * BEAT - 1e-4, Math.max(0, t));
    let s = segs[0]; for (const g of segs) if (g.t0 <= t) s = g;
    return s.fn((t - s.t0) / (s.t1 - s.t0));
  }
  const ballH = t => R - 0.2 * sm(59.6 * BEAT, 60 * BEAT, t);
  const last = (arr, t) => { let v = -9; for (const x of arr) if (x <= t) v = x; return v; };
  const count = (arr, t) => { let n = 0; for (const x of arr) if (x <= t) n++; return n; };

  function init() {
    prog = G.program(FS, 'pinball');
    msg = PIX.message('    BONUS STAGE     LEYENDA    OLE!   ');
    plan();
  }

  const BEAM0 = 12, BEAMD = 1.4;                                   // the beam starts on the downbeat of bar 98
  function draw(st, tgt) {
    const lt = st.lt, t = st.t - LEY.AT - T94, tb = BEAM0 * BEAT;
    const beam = Math.min(1, Math.max(0, (lt - tb) / BEAMD));
    const tq = beam < 1 ? Math.floor(t * 50) / 50 : t;                // the old table moves at 50 Hz
    const P = ballAt(tq), P0 = ballAt(tq - 0.006), h = ballH(tq);
    // ---- what the table is doing
    const bf = hits.b.map(a => Math.exp(-(t - last(a, t)) * 5)), sf = hits.sl.map(a => Math.exp(-(t - last(a, t)) * 7));
    const tf = last(hits.fl, t + 0.06), fa = -0.5 + (sm(tf - 0.05, tf + 0.02, t) - sm(tf + 0.16, tf + 0.36, t));
    const lock = sm(59.55 * BEAT, 59.8 * BEAT, t);
    hits.tg.forEach((a, i) => { const l = last(a, t); tgBuf[i] = l < 0 ? 0.04 : 0.45 + 1.2 * Math.exp(-(t - l) * 2.5); });
    lamps.forEach((l, i) => { const d = t - l.t; lampBuf[i * 3 + 2] = d < 0 ? 0.03 + (l.vortex ? lock * (0.6 + 0.4 * Math.sin(t * 50 + i)) : 0) : l.vortex ? 0.6 + 1.3 * Math.exp(-d * 3) + lock : 0.22 + 1.4 * Math.exp(-d * 1.2); });
    fanBuf.fill(0.03);
    fanNotes.forEach((nt, i) => { if (nt > t || t - nt > 5) return; const k = i % 22, rib = k < 12 ? k : 22 - k; fanBuf[rib] = Math.max(fanBuf[rib], 0.03 + 1.3 * Math.exp(-(t - nt) * 1.5)); });
    const chordT = last(LEY.chords.map(c => c - T94), t);
    const score = 1000 * count(LEY.chords, t + T94) - 1000 * count(LEY.chords, T94 - 0.01) + 50 * count(notes, t) + 250 * hits.tg.reduce((s, a) => s + count(a, t), 0) + 10 * hits.sl.reduce((s, a) => s + count(a, t), 0);
    // ---- 1985: the screen scrolls after the ball
    let ay = 0; for (let k = -2; k <= 2; k++) ay += ballAt(tq + k * 0.1)[1] / 5;
    const scroll = Math.round(Math.min(4.45 - 256 / 136, Math.max(-0.06, ay - 0.8)) * 136) / 136;
    // ---- now: a camera that starts as that same top-down view and tilts down to the player's eye; over the rosette for the ending
    let lx = 0, ly = 0, w = 0;
    for (let k = -7; k <= 7; k++) { const g = Math.exp(-k * k / 14), q = ballAt(t + k * 0.15); lx += q[0] * g; ly += q[1] * g; w += g; }
    lx /= w; ly = Math.min(3.25, Math.max(1.15, ly / w));
    const tilt = sm(tb + 1.5, tb + 4.0, lt), vort = sm(51.4 * BEAT, 54.5 * BEAT, t), shake = (bf[0] + bf[1] + bf[2]) * 0.012;
    const top = { p: [0.09, 30, scroll + 128 / 136], g: [0.09, 0, scroll + 128 / 136], fl: 30 / (128 / 136) };
    const orb = 0.5 * Math.sin(lt * 0.21);
    const low = { p: [lx * 0.3 + 0.12 * orb, 0.72, ly - 1.25], g: [lx * 0.5 + 0.02, 0.05, ly + 0.15], fl: 1.45 };
    const lap = sm(27.4 * BEAT, 29.2 * BEAT, t) * (1 - sm(31.6 * BEAT, 33.2 * BEAT, t));   // the orbit lap is watched from above too
    const va = t < 40 * BEAT ? 0.45 - 0.14 * (t - 27 * BEAT) : -0.35 + 0.085 * (t - 51 * BEAT);
    const bowl = { p: [RC[0] + 1.0 * Math.sin(va), 1.25 - 0.25 * sm(57 * BEAT, 60 * BEAT, t), RC[1] - 1.0 * Math.cos(va)], g: [RC[0], 0.0, RC[1] - 0.03], fl: 1.9 + 0.5 * sm(57 * BEAT, 60 * BEAT, t) };
    const vb = Math.max(vort, 0.8 * lap);
    const lo2 = { p: low.p.map((v, i) => mix(v, bowl.p[i], vb)), g: low.g.map((v, i) => mix(v, bowl.g[i], vb)), fl: mix(low.fl, bowl.fl, vb) };
    const cam = [mix(top.p[0], lo2.p[0], tilt) + shake * Math.sin(t * 61), Math.exp(mix(Math.log(top.p[1]), Math.log(lo2.p[1]), tilt)), mix(top.p[2], lo2.p[2], tilt) + shake * Math.cos(t * 53)];
    const tg = top.g.map((v, i) => mix(v, lo2.g[i], tilt)), fl = Math.exp(mix(Math.log(top.fl), Math.log(lo2.fl), tilt));
    const nrm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); }, crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const f = nrm([tg[0] - cam[0], tg[1] - cam[1], tg[2] - cam[2]]), r = nrm(crs(nrm([0, tilt, 1 - tilt]), f)), u = crs(f, r);

    G.draw(prog, {
      uAtlas: PIX.atlas, uMsg: msg, uBeam: beam, uCam: cam, uCF: f, uCR: r, uCU: u, uFl: fl, uScroll: scroll, uLt: lt, uScore: score,
      uDmd: lt < 1.9 ? 0 : t - chordT < 0.42 ? 2 : 1, uBall: [P[0], h, P[1]], uBallP: beam < 1 ? [P[0], h, P[1]] : [P0[0], ballH(tq - 0.006), P0[1]],
      uBf: bf, uSf: sf, uFa: fa, uTg: tgBuf, uFan: fanBuf, uLamp: lampBuf,
    }, tgt);
    const crt = 1 - sm(tb + 0.3, tb + 2.1, lt), wide = sm(tb + 0.7, tb + 2.7, lt), end = st.dur - lt;
    return { lines: 256, beam, crt, fa: 1.25 + (st.W / st.H - 1.25) * wide, scan: 256, bloom: 0.55, thresh: 1.0, expo: 1.0,
      aberr: 0.22 * crt, grain: 0.03, vig: 0.35 + 0.25 * (1 - crt), fade: Math.min(1, lt / 0.45, end / 0.22) };
  }

  (window.SCENES = window.SCENES || []).push({
    name: 'Pinball', disk: 2, init, draw, plan, ballAt,
    range: () => [LEY.AT + LEY.sec('pinball')[0], LEY.AT + LEY.sec('pinball')[1]],
    caps: [{ at: 9.6, len: 4.2, title: 'BONUS STAGE', sub: 'EVERY CASTANET IS A BUMPER' }],
  });
})();
