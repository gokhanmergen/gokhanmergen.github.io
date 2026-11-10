'use strict';
// =====================================================================
//  DISK 2: FINALE - for the first time we see the machine from outside.
//  A dark desk at night, raymarched: an Amiga 1200, an external
//  floppy drive, a small CRT monitor that is the only light in the room.
//  On it the tracker from the start of Disk 2 plays the last bars; on
//  the final chord it shows THE END, and in the tail somebody switches
//  the monitor off: line, dot, afterglow, two LEDs in the dark.
//  The monitor picture is the PIX framebuffer (js/pix.js), sampled live.
//
//  The A1200 is modelled to scale (1 unit = 1 m): 470 x 240 mm footprint,
//  a plain wedge ~28 mm high at the front rising to ~68 mm at the back,
//  rounded edges, the keyboard sunk in a well, a rear deck with the long
//  vent slots on the left, "AMIGA 1200" + C= on the right and the three
//  light pipes (power green, floppy and hard disk amber) above the keypad;
//  DF0: on the right flank, the PCMCIA slot on the left flank.
// =====================================================================
(() => {
  // ---------------- A1200 keyboard: the Amiga ISO layout (as on a UK machine) ----------------
  // Key units u (19 mm). 23 u wide: main block 0..15, Del/Help + inverted-T cursor keys 15.5..18.5,
  // keypad 19..23. Rows: 0 Esc + F1-F10 (wide, short caps in two groups of five), 1 numbers, 2 QWERTY,
  // 3 Ctrl/Caps Lock/ASDF, 4 Shift/ZXCV, 5 Alt/Amiga/space bar (indented at both ends).
  // A legend is up to 8 glyphs of the demo's 8x8 font, '\n' starts a second line (the shifted symbol sits
  // above, as printed on the caps); characters the font lacks stay blank. Private codes: \x01 left,
  // \x02 down, \x03 up, \x04 right arrow, \x05 filled 'A' (left Amiga key), \x06 outline 'A' (right Amiga
  // key), \x07 the bent Return arrow.
  const KEYS = [];
  const kr = (r, list) => { let x = 0;
    for (const it of list) { const [w, lg, sp] = typeof it === 'string' ? [1, it] : it; if (lg !== null) KEYS.push({ r, x, w, lg, sp: sp || 1 }); x += w; } };
  const Fk = n => [1.25, 'F' + n], gap = w => [w, null];
  kr(0, ['ESC', gap(.5), Fk(1), Fk(2), Fk(3), Fk(4), Fk(5), gap(.5), Fk(6), Fk(7), Fk(8), Fk(9), Fk(10)]);
  kr(1, ['', '!\n1', '@\n2', '#\n3', '$\n4', '%\n5', '^\n6', '&\n7', '*\n8', '(\n9', ')\n0', '_\n-', '+\n=', '\\', '\x01',
    gap(.5), [1.5, 'DEL'], [1.5, 'HELP'], gap(.5), '(', ')', '/', '*']);
  kr(2, [[1.5, 'TAB'], ...'QWERTYUIOP[]', [1.5, '\x07', 'L'], gap(4), '7', '8', '9', '-']);
  kr(3, ['CTRL', [1.25, 'CAPS\nLOCK'], ...'ASDFGHJKL', ':\n;', '"\n\'', '#', gap(.75), gap(1.5), '\x03', gap(1.5), '4', '5', '6', '+']);
  kr(4, [[1.25, '\x03'], '>\n<', ...'ZXCVBNM', '<\n,', '>\n.', '?\n/', [2.75, '\x03'], gap(.5), '\x01', '\x02', '\x04', gap(.5), '1', '2', '3', [1, 'ENT', 2]]);
  kr(5, [gap(1), [1.25, 'ALT'], [1.25, '\x05'], [8.5, ''], [1.25, '\x06'], [1.25, 'ALT'], gap(4.5), [2, '0'], '.']);
  const RET = KEYS.findIndex(k => k.sp === 'L');
  // per key: x0, x1, y0, y1 in u (y up the slope from the front of the space bar row; F-row caps are short)
  const KG = KEYS.map(k => [k.x, k.x + k.w, k.r === 0 ? 5.2 : k.sp === 2 ? 4 - k.r : 5 - k.r, k.r === 0 ? 5.92 : 6 - k.r]);
  // slot table: 6 rows x 92 quarter-u slots -> key index + 1 and the slot run of the cell (key or empty stretch)
  const NS = 92, KTAB = new Array(6 * NS).fill(0);
  KEYS.forEach((k, i) => { const rows = k.sp === 2 ? [k.r, k.r + 1] : k.sp === 'L' ? [k.r, k.r + 1] : [k.r];
    for (const r of rows) { const x0 = (r > k.r && k.sp === 'L' ? k.x + 0.75 : k.x) * 4, x1 = (k.x + k.w) * 4;
      for (let s = x0; s < x1; s++) KTAB[r * NS + s] = (i + 1) | (x0 << 8) | (x1 << 16); } });
  for (let r = 0; r < 6; r++) for (let s = 0; s < NS;) { if (KTAB[r * NS + s]) { s++; continue; }
    let e = s; while (e < NS && !KTAB[r * NS + e]) e++; for (let j = s; j < e; j++) KTAB[r * NS + j] = (s << 8) | (e << 16); s = e; }
  const SPC = { '\x01': 120, '\x02': 121, '\x03': 67, '\x04': 66, '\x05': 122, '\x06': 123, '\x07': 124, '\n': 127 };
  const gcode = ch => { if (ch in SPC) return SPC[ch]; const c = ch.toUpperCase().charCodeAt(0) - 32; return c > 0 && c < 64 ? c : 126; };
  const KL = KEYS.map(k => { const c = [...k.lg].slice(0, 8).map(gcode), n = c.filter(v => v !== 127).length;
    const size = n <= 1 ? 0 : k.lg.includes('\n') && n === 2 ? 1 : 2, w = [0, 0];     // glyph size class: big / stacked pair / words
    c.forEach((v, i) => { w[i >> 2] |= v << (7 * (i & 3)); }); w[1] |= size << 28; return w; });
  const NK = KEYS.length;
  const FS = PIX.GLSL + `
uniform sampler2D uScr, uAtlas;
uniform vec3 uCam, uTgt, uQ[4];        // uQ: mean linear colour of the four screen quadrants (TL, TR, BL, BR)
uniform float uOffA, uLight, uFov, uGlow, uLed;
const vec3 SC=vec3(0.,.255,-.074);     // centre of the picture tube
const vec2 SH=vec2(.15,.12);           // half size of the visible picture
float sdBox(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
float sdR(vec3 p, vec3 b, float r){ return sdBox(p,b-r)-r; }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.))-r; }
vec2 U(vec2 a, vec2 b){ return a.x<b.x?a:b; }
// ---- A1200 geometry. f = kfr(p): x, distance up the sloped top from its front edge, height above the top ----
const float CZF=.385, CZC=.265, CH0=.028, CSL=.165;                     // front z, centre z, front height, slope of the top
const vec3 KO=vec3(0.,CH0,CZF), KN=vec3(0.,1.,CSL)/1.013521, KT=vec3(0.,CSL,-1.)/1.013521;
const float KU=.019, KX0=-.2185, KA0=.017;                                 // key pitch; left and front edge of the keys
const float VA0=.150, VP=.0058, VN=14., VX0=-.214, VX1=.02;                // vent slots on the rear deck (along, pitch, count, x range)
const int KTAB[${6 * NS}]=int[${6 * NS}](${KTAB.join(',')});
const vec4 KG[${NK}]=vec4[${NK}](${KG.map(g => 'vec4(' + g.map(v => v.toFixed(2)).join(',') + ')').join(',')});
const ivec2 KL[${NK}]=ivec2[${NK}](${KL.map(w => 'ivec2(' + w.join(',') + ')').join(',')});
vec3 kfr(vec3 p){ vec3 d=p-KO; return vec3(p.x,dot(d,KT),dot(d,KN)); }
float rint(float a, float b, float r){ return min(-r,max(a,b))+length(max(vec2(a,b)+r,0.)); }   // intersection with a rounded edge
// one key cap: K = x0, x1, y0, y1 in u; l = metres from the keyboard's left/front corner (x, along, height above the top)
float cap(vec3 l, vec4 K){
  vec2 c=(K.xz+K.yw)*.5*KU, h=(K.yw-K.xz)*.5*KU-.0012;                     // 2.4 mm between neighbouring caps
  float sh=.0024*clamp((l.z+.0075)/.0135,0.,1.);                            // sloped sides: the top is 4.8 mm smaller
  vec3 q=vec3(abs(l.x-c.x)-h.x+sh,abs(l.z+.00075)-.00675,abs(l.y-c.y)-h.y+sh)+.0012;
  return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-.0012;
}
// distance to the keyboard: the cap that owns this cell, and a bound for all others (they start beyond
// the cell's inner edges plus half a gap), so only one cap is evaluated per step
float keyD(vec3 f){
  vec3 l=vec3(f.x-KX0,f.y-KA0,f.z); vec2 g=l.xy/KU;
  float bb=sdBox(vec3(l.x-11.5*KU,l.z+.001,l.y-3.*KU),vec3(11.5*KU,.0075,3.*KU));
  if(bb>.003) return bb;
  int r=5-int(clamp(floor(g.y),0.,5.)), e=KTAB[r*92+int(clamp(floor(g.x*4.),0.,91.))], k=(e&255)-1;
  float x0=float((e>>8)&255)*.25, x1=float((e>>16)&255)*.25, y0=float(5-r), y1=y0+1., d=1e3;
  if(k>=0){ d=cap(l,KG[k]); if(k==${RET}) d=min(d,cap(l,vec4(14.25,15.,2.,4.))); }   // Return: the tall reversed L
  float bx=min(min(x0>0.?g.x-x0:1e3,x1<23.?x1-g.x:1e3),min(y0>0.?g.y-y0:1e3,y1<6.?y1-g.y:1e3))*KU;
  return min(d,length(vec2(max(bx,0.)+.0012,max(l.z-.006,0.))));
}
float caseD(vec3 p, vec3 f){
  vec2 q=abs(p.xz-vec2(0.,CZC))-vec2(.221,.106);
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-.014;                         // 470 x 240 mm, 14 mm corner radius
  d=rint(d,f.z-.0022*smoothstep(.1355,.1395,f.y),.004);                        // wedge top; the deck behind the keys stands 2 mm proud
  d=rint(d,-p.y,.002);
  d=rint(d,-sdBox(vec3(p.x,f.z-.05,f.y-.074),vec3(.2205,.058,.0595)),.001);     // the keyboard well, 8 mm deep
  float i=clamp(floor((f.y-VA0)/VP),0.,VN-1.);
  d=max(d,-sdR(vec3(p.x-(VX0+VX1)*.5,f.z-.002,f.y-VA0-(i+.5)*VP),vec3((VX1-VX0)*.5,.008,.0011),.001));
  d=max(d,-sdBox(p-vec3(.235,.0215,.30),vec3(.006,.0022,.047)));               // DF0: on the right flank
  d=max(d,-sdBox(p-vec3(-.235,.031,.228),vec3(.005,.0026,.045)));              // PCMCIA slot on the left flank
  return min(d,sdR(p-vec3(.2335,.0125,.345),vec3(.0035,.003,.006),.001));       // eject button
}
vec2 map(vec3 p){
  vec2 d=vec2(sdBox(p-vec3(0.,-.02,0.),vec3(3.,.02,.62)),1.);
  d=U(d,vec2(p.z+.62,2.));
  float mon=sdR(p-vec3(0.,.25,-.26),vec3(.2,.172,.2),.014);
  mon=max(mon,-sdBox(p-vec3(0.,.255,-.06),vec3(.16,.13,.014)));
  mon=min(mon,sdR(p-vec3(0.,.04,-.26),vec3(.13,.04,.15),.01));
  d=U(d,vec2(mon,3.));
  float cb=sdBox(p-vec3(0.,.035,.265),vec3(.24,.04,.126));                      // the A1200's bounding box
  if(cb<.01){ vec3 f=kfr(p); d=U(d,vec2(caseD(p,f),5.)); d=U(d,vec2(keyD(f),6.)); } else d=U(d,vec2(cb,5.));
  d=U(d,vec2(sdR(p-vec3(.37,.028,.2),vec3(.052,.028,.115),.006),7.));
  vec3 q=p-vec3(-.39,0.,.2); q.xz=rot(.3)*q.xz;
  float fl=sdBox(q-vec3(0.,.0065,0.),vec3(.045,.0065,.047));
  vec3 q2=p-vec3(-.385,.0166,.205); q2.xz=rot(-.22)*q2.xz;
  fl=min(fl,sdBox(q2,vec3(.045,.0033,.047)));
  d=U(d,vec2(fl-.0008,8.));
  vec3 j=p-vec3(-.37,0.,-.07);
  d=U(d,vec2(sdR(j-vec3(0.,.02,0.),vec3(.055,.02,.055),.01),9.));
  float js=min(sdCap(j,vec3(0.,.04,0.),vec3(.015,.125,-.012),.007),length(j-vec3(.017,.14,-.014))-.019);
  js=min(js,max(length(j.xz-vec2(.032,.032))-.011,abs(j.y-.042)-.004));
  d=U(d,vec2(js,10.));
  vec3 g=p-vec3(.44,0.,-.13);
  float mg=max(length(g.xz)-.04,abs(g.y-.047)-.047); mg=max(mg,-max(length(g.xz)-.034,.012-g.y));
  float hd=max(length(vec2(length(g.xy-vec2(.047,.05))-.022,g.z))-.006,.036-g.x);
  d=U(d,vec2(min(mg,hd),11.));
  d=U(d,vec2(sdR(p-vec3(.35,.014,.47),vec3(.027,.014,.044),.011),12.));
  return d;
}
vec3 nrm(vec3 p){ vec3 n=vec3(0.); for(int i=0;i<4;i++){ vec3 e=.5773*(2.*vec3(float(((i+3)>>1)&1),float((i>>1)&1),float(i&1))-1.); n+=e*map(p+e*.0006).x; } return normalize(n); }
vec3 quad(vec2 c){ return mix(mix(uQ[2],uQ[3],smoothstep(-.3,.3,c.x)),mix(uQ[0],uQ[1],smoothstep(-.3,.3,c.x)),smoothstep(-.3,.3,c.y)); }
// the picture on the tube. c: -.5..+.5 across the picture, foot: size of one screen pixel in picture heights
vec3 tube(vec2 c, float foot){
  vec2 b=c*(1.+.12*dot(c,c));
  float sy=mix(1.,.007,smoothstep(0.,.45,uOffA)), sx=mix(1.,.012,smoothstep(.4,.8,uOffA));
  vec2 q=b/vec2(sx,sy);
  float inside=step(abs(q.x),.5)*step(abs(q.y),.5);
  vec2 o=vec2(foot*.3,foot*.3); vec3 t=vec3(0.);
  for(int i=0;i<4;i++){ vec2 s=q+o*vec2(i<2?-1.:1.,mod(float(i),2.)<.5?-1.:1.); vec3 x=texture(uScr,vec2(s.x+.5,.5-s.y)).rgb; t+=x*x; }
  t*=.25;
  t*=mix(1.,.6+.4*cos(q.y*256.*TAU),clamp(1.6-foot*256.*2.2,0.,1.)*step(uOffA,0.));
  float boost=1.+4.*smoothstep(0.,.5,uOffA), fade=1.-smoothstep(.8,1.,uOffA);
  vec3 col=mix(t,vec3(.75,.88,1.)*.7,smoothstep(.1,.45,uOffA))*inside*boost*fade;
  col*=smoothstep(.5,.485,abs(b.x))*smoothstep(.5,.485,abs(b.y));
  col+=vec3(.2,.4,.3)*uGlow*exp(-dot(b,b)*5.)*.03+vec3(.5,.8,.7)*uGlow*exp(-dot(b,b)*900.)*.6;
  return col;
}
vec3 screenLight(vec3 p, vec3 n){
  vec3 E=vec3(0.);
  for(int i=0;i<4;i++){ vec3 lp=SC+vec3(mod(float(i),2.)<.5?-.08:.08,i<2?.06:-.06,0.); vec3 dv=lp-p; float d2=dot(dv,dv); vec3 l=dv*inversesqrt(d2);
    E+=uQ[i]*max(dot(n,l),0.)*max(-l.z,0.)/(d2+.012); }
  return E*.42;
}
float shadow(vec3 p, vec3 n){
  vec3 dv=SC+vec3(0.,0.,.03)-p; float L=length(dv); vec3 l=dv/L, o=p+n*.006; float r=1., t=.012+.012*hash21(gl_FragCoord.xy+7.), ph=1e9;
  for(int i=0;i<26;i++){ float h=map(o+l*t).x; if(h<.0006){ r=0.; break; }
    float y=h*h/(2.*ph), d=sqrt(max(h*h-y*y,0.)); r=min(r,9.*d/max(1e-4,t-y)); ph=h; t+=clamp(h*.9,.006,.08); if(t>L-.02) break; }
  return smoothstep(0.,1.,clamp(r,0.,1.));
}
void main(){
  vec2 sc=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 ro=uCam, f=normalize(uTgt-ro), r=normalize(cross(f,vec3(0,1,0))), u=cross(r,f);
  vec3 rd=normalize(f*uFov+sc.x*r+sc.y*u);
  float t=.02; vec2 h=vec2(1.,0.); bool hit=false;
  for(int i=0;i<90;i++){ h=map(ro+rd*t); if(h.x<.0004*t+.0001){ hit=true; break; } t+=h.x*.85; if(t>4.) break; }
  vec3 avg=(uQ[0]+uQ[1]+uQ[2]+uQ[3])*.25;
  vec3 col=vec3(0.);
  if(hit){
    vec3 p=ro+rd*t, n=nrm(p); float id=h.y;
    vec3 alb=vec3(.6,.56,.48), emi=vec3(0.); float gloss=.25, refl=0.;
    if(id<1.5){ alb=mix(vec3(.13,.075,.04),vec3(.27,.16,.09),fbm(vec2(p.x*2.5,p.z*38.)))*(.85+.15*noise(p.xz*90.)); gloss=.5; refl=.5; }
    else if(id<2.5){ alb=vec3(.4,.38,.35)*(.92+.08*noise(p.xy*60.))*(.94+.06*step(.5,fract(p.x*9.))); gloss=.05; }
    else if(id<3.5){
      alb=vec3(.6,.56,.47);
      vec2 c=(p.xy-SC.xy)/(SH*2.);
      if(p.z<-.0715&&abs(p.x)<.159&&abs(p.y-.255)<.129){                 // the tube
        if(abs(c.x)<.5&&abs(c.y)<.5) emi=tube(c,t/(uRes.y*uFov*.24))*2.3;
        alb=vec3(.012,.014,.013); gloss=3.;
        emi+=vec3(.25,.4,.8)*.012*smoothstep(.2,.0,abs(c.x+.2-c.y*.3))*smoothstep(.5,.2,abs(c.y-.1));   // window, faintly, in the glass
      } else if(p.z<-.059&&abs(p.x)<.162&&abs(p.y-.255)<.132) alb=vec3(.03);
      else if(n.z>.5&&p.y<.118&&p.y>.08){                                 // control strip under the tube
        alb=mix(alb,vec3(.1),step(length(vec2(mod(p.x+.11,.03)-.015,p.y-.1)),.006)*step(abs(p.x+.065),.06));
        float led=step(length(vec2(p.x-.15,p.y-.1)),.004); alb=mix(alb,vec3(.02),led); emi+=vec3(.1,1.,.25)*led*1.5*step(uOffA,.01);
      }
      if(n.y>.5&&p.y>.3) alb*=.75+.25*step(.4,fract(p.z*70.));           // cooling slots
    }
    else if(id<5.5){                                                         // the A1200's case: slightly yellowed ABS
      vec3 f=kfr(p); float up=dot(n,KN);
      alb=vec3(.585,.545,.455)*(.95+.05*noise(p.xz*420.+p.y*300.)); gloss=.32;
      n=normalize(n+.035*(vec3(noise(p.zy*2400.),noise(p.xz*2400.+3.),noise(p.xy*2400.+7.))-.5));   // fine moulded texture
      bool well=abs(p.x)<.2207&&f.y>.0143&&f.y<.1337&&f.z<.0004;
      if(well){ if(f.z<-.0068) alb=vec3(.035,.034,.032); }                  // the dark keyboard base between the caps
      else if(up>.75&&f.y>.137){                                             // rear deck
        if(p.x>VX0-.001&&p.x<VX1+.001&&f.y>VA0&&f.y<VA0+VN*VP){              // stepped vent louvres, each rising to the next slot
          float fr=fract((f.y-VA0)/VP);
          if(f.z<.0016) alb=vec3(.02); else { float w=fract(fr+.31)/.62; if(w<1.){ n=normalize(n-KT*.22); alb*=.86+.14*w; } }
        }
        // AMIGA 1200 with the C= mark, printed in dark grey on the right of the deck
        vec2 uv=vec2((p.x-.094)/.0085,(.2035-f.y)/.009); int i=int(floor(uv.x));
        const int badge[10]=int[10](33,45,41,39,33,0,17,18,16,16);
        if(i>=0&&i<10&&uv.y>=0.&&uv.y<1.) alb=mix(alb,vec3(.07,.07,.075),pixGlyph(uAtlas,float(badge[i]),vec2(fract(uv.x),uv.y))*.9);
        vec2 cu=(vec2(p.x,f.y)-vec2(.0835,.199))/.0047; float cr=length(cu);
        float cC=step(.5,cr)*step(cr,1.)*step(cu.x,.14), cF=step(.2,cu.x)*step(.06,abs(cu.y))*step(abs(cu.y),.46)*step(cu.x,.62+.8*(abs(cu.y)-.06));
        alb=mix(alb,vec3(.03,.07,.3),max(cC,cF*step(0.,cu.y))); alb=mix(alb,vec3(.45,.03,.02),cF*step(cu.y,0.));
        // three light pipes above the keypad, power / floppy / hard disk, with their symbols behind them
        for(int j=0;j<3;j++){ float x=.162+.018*float(j), lens=step(abs(p.x-x),.0035)*step(abs(f.y-.1465),.0013);
          vec2 s=vec2(p.x-x,f.y-.1545); float ic=j==0?step(abs(length(s)-.0014),.0004):j==1?step(max(abs(s.x),abs(s.y)),.0014)*(1.-step(max(abs(s.x+.0003),abs(s.y+.0005)),.0006)):step(abs(s.x),.0018)*step(abs(s.y),.0011)*(1.-step(abs(s.y),.0003));
          alb=mix(alb,vec3(.18,.17,.15),ic*.85); alb=mix(alb,vec3(.04),lens);
          emi+=lens*(j==0?vec3(.15,1.,.1)*.8:j==1?vec3(1.,.45,.03)*uLed*1.5:vec3(1.,.45,.03)*.05); }
      }
      if(abs(n.y)<.5&&abs(p.y-.017)<.0004) alb*=.6;                         // top/bottom shell joint
      if(p.x>.228){ if(abs(p.y-.0215)<.0024&&abs(p.z-.30)<.047) alb=vec3(.02);                     // DF0: slot
        if(abs(p.y-.0125)<.0032&&abs(p.z-.345)<.0062) alb*=.8; }                                    // eject button
      if(p.x<-.228&&abs(p.y-.031)<.0028&&abs(p.z-.228)<.045) alb=vec3(.02);                         // PCMCIA
    }
    else if(id<6.5){                                                         // key caps: matte, a shade greyer and lighter than the case
      vec3 f=kfr(p), l=vec3(f.x-KX0,f.y-KA0,f.z); vec2 g=l.xy/KU;
      int k=(KTAB[(5-int(clamp(floor(g.y),0.,5.)))*92+int(clamp(floor(g.x*4.),0.,91.))]&255)-1;
      alb=vec3(.63,.615,.565)*(.97+.03*noise(p.xz*900.)); gloss=.16;
      if(k>=0&&dot(n,KN)>.85){
        vec4 K=KG[k]; float cy=(K.z+K.w)*.5*KU, hy=(K.w-K.z)*.5*KU-.0036;
        if(k==${RET}){ cy=3.5*KU; hy=.5*KU-.0036; }
        n=normalize(n-KT*clamp((l.y-cy)/hy,-1.,1.)*.2);                       // dished top, concave front to back
        vec2 tl=vec2(l.x-K.x*KU-.0036,K.w*KU-.0036-l.y)-.0009;               // from the rear-left corner of the top face
        ivec2 L=KL[k]; int sz=(L.y>>28)&3; float gs=sz==0?.0042:sz==1?.0031:.0026, lp=gs*1.3;
        int ln=int(floor(tl.y/lp)), cl=int(floor(tl.x/gs)), sel=0, li=0, ci=0;
        if(min(tl.x,tl.y)>=0.) for(int i=0;i<8;i++){ int cc=((i<4?L.x:L.y)>>(7*(i&3)))&127; if(cc==0) break;
          if(cc==127){ li++; ci=0; continue; } if(li==ln&&ci==cl) sel=cc; ci++; }
        vec2 gu=vec2(fract(tl.x/gs),fract(tl.y/lp)*1.3);
        if(sel>0&&gu.y<1.){
          float gc=float(sel); if(sel==120||sel==124){ gc=66.; gu.x=1.-gu.x; } else if(sel==121){ gc=67.; gu.y=1.-gu.y; } else if(sel>121) gc=33.;
          float ink=pixGlyph(uAtlas,gc,gu);
          if(sel==124) ink=max(ink,step(.75,gu.x)*step(gu.y,.5));          // Return: the bent arrow
          if(sel==122||sel==123){ float dl=max(max(ink,pixGlyph(uAtlas,gc,gu+vec2(.125,0.))),max(pixGlyph(uAtlas,gc,gu-vec2(.125,0.)),pixGlyph(uAtlas,gc,gu+vec2(0.,.125))));
            ink=sel==122?dl:dl-ink; }                                         // Amiga keys: filled A left, outline A right
          alb=mix(alb,vec3(.085,.085,.08),ink*.9);
        }
      }
    }
    else if(id<7.5){ alb=vec3(.62,.58,.5);
      if(n.z>.5){ alb=mix(alb,vec3(.02),step(abs(p.y-.036),.0035)*step(abs(p.x-.37),.043));
        alb=mix(alb,vec3(.3,.29,.26),step(abs(p.y-.014),.005)*step(abs(p.x-.4),.008));
        float led=step(abs(p.x-.335),.006)*step(abs(p.y-.015),.0028); alb=mix(alb,vec3(.02),led); emi+=vec3(.15,1.,.2)*led*2.*uLed; } }
    else if(id<8.5){ float top=step(.0158,p.y), lay=floor(p.y/.0066);
      alb=top>.5?vec3(.05,.1,.42):(lay==1.?vec3(.05):vec3(.06,.12,.45));
      if(n.y>.5){ vec3 q2=p-vec3(-.385,.0166,.205); q2.xz=rot(-.22)*q2.xz; if(top<.5){ q2=p-vec3(-.39,0.,.2); q2.xz=rot(.3)*q2.xz; }
        alb=mix(alb,vec3(.8,.78,.7),step(abs(q2.x),.036)*step(abs(q2.z+.012),.03));
        alb=mix(alb,vec3(.9,.45,.1),step(abs(q2.x),.036)*step(abs(q2.z+.036),.005));
        alb=mix(alb,vec3(.55,.56,.6),step(abs(q2.x+.006),.02)*step(abs(q2.z-.034),.012)); gloss=.5; } }
    else if(id<9.5){ alb=vec3(.035); gloss=.8; }
    else if(id<10.5){ vec3 j=p-vec3(-.37,0.,-.07); alb=(j.y>.118||(j.y<.05&&length(j.xz-vec2(.032,.032))<.013))?vec3(.7,.04,.03):vec3(.03); gloss=1.2; }
    else if(id<11.5){ vec3 g=p-vec3(.44,0.,-.13); alb=mix(vec3(.75,.73,.68),vec3(.85,.4,.08),step(abs(g.y-.058),.012)*step(.037,length(g.xz))); gloss=1.; }
    else { alb=vec3(.62,.58,.5); alb*=1.-.5*step(abs(p.x-.35),.0012)*step(.47,p.z)-.5*step(abs(p.z-.47),.0012); gloss=.5; }

    float occ=1.; for(int i=1;i<=4;i++){ float e=float(i)*.012; occ-=(e-map(p+n*e).x)*.9/float(i); } occ=clamp(occ,0.,1.);
    vec3 E=screenLight(p,n)*uLight;
    float sh=dot(E,vec3(1.))>.002?shadow(p,n):0.;                           // no shadow ray where the tube cannot reach anyway
    E*=sh;
    vec3 l=normalize(SC-p), hv=normalize(l-rd);
    vec3 moon=vec3(.05,.085,.17)*.6*(.2+.8*max(dot(n,normalize(vec3(.75,.45,.5))),0.));
    if(id>1.5&&id<2.5){ float bl=smoothstep(.0,.03,p.x-.12-p.y*.25)*smoothstep(.0,.04,.78-p.x+p.y*.25)*smoothstep(.1,.16,p.y)*smoothstep(.72,.64,p.y);
      moon+=vec3(.06,.1,.2)*.9*bl*smoothstep(.3,.5,abs(fract((p.y-p.x*.12)*13.)-.5)*2.+.15); }      // moonlight through blinds
    if(id>2.5&&id<3.5&&n.z>.5){ vec2 c=(p.xy-SC.xy)/(SH*2.); vec2 o=max(abs(c)-.5,0.)*SH*2.;        // the tube spills onto its own bezel
      E+=quad(c)*uLight*.5*exp(-length(o)*55.); }
    col=alb*(E+moon)*occ;
    col+=avg*uLight*pow(max(dot(n,hv),0.),30.+gloss*40.)*gloss*sh*.35/(dot(SC-p,SC-p)+.05);
    if(refl>0.){                                                            // the desk mirrors the tube, blurred
      vec3 rr=reflect(rd,n); if(rr.z<0.){ float tr=(SC.z-p.z)/rr.z; vec2 c=((p+rr*tr).xy-SC.xy)/(SH*2.); float bl=.1+tr*.5;
        float m=smoothstep(.5+bl,.5-bl,abs(c.x))*smoothstep(.5+bl,.5-bl,abs(c.y));
        col+=quad(c)*m*uLight*refl*1.6*pow(1.-max(dot(n,-rd),0.),2.)*occ; } }
    col+=emi;
  }
  // dust in the light of the tube: a soft cone of scatter, and a few motes that catch it
  float tm=min(t,1.8), jit=hash21(gl_FragCoord.xy), sca=0.;
  for(int i=0;i<12;i++){ float s=(float(i)+jit)/12.*tm; vec3 v=ro+rd*s-SC; if(v.z>0.){ float l2=dot(v,v); sca+=v.z*v.z/(l2*(l2+.03)); } }
  col+=avg*uLight*sca*tm/12.*.03;
  for(int i=0;i<22;i++){ float fi=float(i);
    vec3 mp=vec3(hash11(fi*1.3)-.5,hash11(fi*2.7)*.4+.04,hash11(fi*4.1)*.75-.05)*vec3(.7,1.,1.);
    mp+=.03*vec3(sin(uGT*.21+fi),sin(uGT*.17+fi*2.)*.6-fract(uGT*.004+fi*.37)*.0,cos(uGT*.13+fi*3.));
    vec3 dp=mp-ro; float td=dot(dp,rd); if(td<.05||td>t) continue; vec3 pe=dp-rd*td;
    vec3 v=mp-SC; float l2=dot(v,v), lobe=max(v.z,0.)*max(v.z,0.)/(l2*(l2+.03));
    float rad=.0009+.0004*hash11(fi*7.);
    col+=avg*uLight*lobe*.05*exp(-dot(pe,pe)/(rad*rad+td*td*2e-7)); }
  fragColor=vec4(col,1.);
}`;
  let prog;
  const P = PIX, X = P.hex;
  const cl = x => Math.min(1, Math.max(0, x));
  const sm = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const mix3 = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  const quads = new Float32Array(12);
  const GOLD = [];
  function endScreen(te) {                                        // te: seconds since the final chord
    P.clear(X(0x05A));
    P.rect(0, 0, P.W, 11, X(0xFFF)); P.text('LEYENDA', 4, 2, X(0x05A));
    P.rect(P.W - 26, 1, 10, 9, X(0x05A)); P.rect(P.W - 24, 3, 6, 5, X(0xFFF)); P.rect(P.W - 13, 1, 10, 9, X(0x05A)); P.rect(P.W - 11, 3, 6, 2, X(0xFFF));
    if (!GOLD.length) for (let i = 0; i < 32; i++) GOLD.push(P.dith.bind(null, [X(0xFFF), X(0xFE8), X(0xFB3), X(0xF80), X(0xC40)], i / 31));
    P.centre('THE END', 84, (r, i, sh, c) => sh === 2 ? X(0xFFF) : sh === 3 ? X(0x830) : GOLD[r](i * 32 + c, r), { font: P.font32 });
    if (te > 0.9) P.centre('BEYOND THE COPPER', 140, X(0xFFF));
    if (te > 1.5) P.centre('NEON BLITTER 2026', 154, X(0xF80));
    P.text('1>', 8, 236, X(0xFFF)); if ((te * 2 | 0) % 2 === 0) P.rect(28, 236, 8, 8, X(0xF80));
  }
  function draw(st, tgt) {
    const d2 = st.t - LEY.AT, B = LEY.barT, lt = st.lt, tail = d2 - B[LEY.NB], tEnd = d2 - B[133];
    if (tEnd < 0 && window.TRACKER) window.TRACKER.draw(d2, { chip: false }); else endScreen(Math.max(0, tEnd));
    P.upload();
    // what the room receives: mean linear colour of each quadrant of the picture
    quads.fill(0); const px = P.px;
    for (let y = 2; y < 256; y += 4) for (let x = 2; x < 320; x += 4) {
      const v = px[y * 320 + x], q = (y < 128 ? 0 : 2) + (x < 160 ? 0 : 1), r = (v & 255) / 255, g = ((v >> 8) & 255) / 255, b = ((v >> 16) & 255) / 255;
      quads[q * 3] += r * r; quads[q * 3 + 1] += g * g; quads[q * 3 + 2] += b * b;
    }
    for (let i = 0; i < 12; i++) quads[i] = Math.sqrt(quads[i] / 1280) * 0.75;      // compressed: a dim tracker still lights the desk
    const off = sm(1.5, 2.7, tail), light = (1 - sm(1.5, 2.05, tail)) * (0.93 + 0.07 * Math.sin(st.t * 31) * Math.sin(st.t * 7.3));
    const glow = tail > 1.6 ? Math.exp(-(tail - 1.6) * 1.5) : 0;
    const k = sm(1.2, B[133] - B[129] + 3.5, lt), k2 = cl(lt / st.dur);
    const cam = mix3([0.0, 0.257, 0.335], [-0.39, 0.53, 1.04], k), tg = mix3([0, 0.255, -0.074], [0.02, 0.13, 0.07], sm(0, 1, k));
    cam[0] += 0.004 * Math.sin(st.t * 0.7) - 0.03 * k2 * k; cam[1] += 0.003 * Math.sin(st.t * 0.9) + 0.03 * Math.sin(k * Math.PI);
    G.draw(prog, { uScr: P.tex, uAtlas: P.atlas, uCam: cam, uTgt: tg, uQ: quads, uOffA: off, uLight: light, uFov: 1.6 - 0.25 * k, uGlow: glow,
      uLed: 0.55 + 0.45 * LEY.env('pluck', d2, 9) }, tgt);
    return { bloom: 0.75, thresh: 0.7, expo: 1.25, vig: 0.85, grain: 0.045, aberr: 0.12, fade: sm(0, 1.4, lt) * (1 - sm(3.75, 4.4, tail)) };
  }
  (window.SCENES = window.SCENES || []).push({
    name: 'Finale', disk: 2, scale: 0.8, init() { prog = G.program(FS, 'finale'); }, draw,
    range: () => [LEY.AT + LEY.sec('finale')[0], LEY.AT + LEY.LEN],
  });
})();
