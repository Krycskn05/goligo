// Shader models for the Nesne Kasası: rooms of the house (bathroom, attic, cellar, kitchen) and roof parts.
// Each entry: camera view + GLSL that defines objectMap(p) -> vec2(distance, material).

// Shared GLSL for the roof pictures: rows of clay tiles on a plane.
// Roof frame r: x along the eave, y down the slope (0 = top edge), z out of the roof (0 = base plane).
const TILES=`
#define HAS_MAT
#define M_CLAY 100.0
bool clayMat(float m,vec3 p,inout Mat t){
 if(m!=M_CLAY)return false;
 float s=fbm(p*9.0);
 t.alb=srgb2lin(mix(vec3(0.86,0.38,0.20),vec3(0.76,0.31,0.17),s));t.rough=0.6;t.spec=0.3;
 return true;}
#define TS 0.27
#define TP 0.25
float tileRow(vec3 r,float k,float W){
 float vt=k*TS-0.08,vb=(k+1.0)*TS;
 float w=r.z-0.07*clamp((r.y-vt)/(vb-vt),0.0,1.0);
 float n=floor(W/TP-0.5);
 float u=r.x-TP*clamp(round(r.x/TP),-n,n);
 float slab=abs(w-0.025)-0.025;
 float hump=length(vec2(u,w))-0.105;
 float d2=smin(slab,hump,0.035);
 d2=max(d2,-w);
 d2=max(d2,abs(r.x)-W);
 float e=abs(r.y-(vt+vb)*0.5)-(vb-vt)*0.5;
 vec2 q=vec2(d2+0.02,e+0.02);
 return length(max(q,0.0))+min(max(q.x,q.y),0.0)-0.02;
}
float tiles(vec3 r,float W,float rows){
 // cheap bound far away from the tile layer
 float bnd=sdBox(r-vec3(0.0,rows*TS*0.5-0.05,0.09),vec3(W+0.01,rows*TS*0.5+0.05,0.12));
 if(bnd>0.1)return bnd;
 float k=clamp(floor(r.y/TS),0.0,rows-1.0);
 float d=tileRow(r,k,W);
 d=min(d,tileRow(r,max(k-1.0,0.0),W));
 d=min(d,tileRow(r,min(k+1.0,rows-1.0),W));
 return d;
}
`;

module.exports={
 "dachziegel":{view:{"cam":[0.6,2.6,5.6],"target":[0,0.15,0],"fov":27},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m!=100.0)return false;
 float s=fbm(p*9.0);
 t.alb=srgb2lin(mix(vec3(0.86,0.38,0.20),vec3(0.76,0.31,0.17),s));t.rough=0.6;t.spec=0.3;
 return true;}
float sdArc(vec2 p,vec2 sc,float ra,float rb){p.x=abs(p.x);return((sc.y*p.x>sc.x*p.y)?length(p-sc*ra):abs(length(p)-ra))-rb;}
vec2 objectMap(vec3 p){
 vec3 q=p;q.xz=rot(0.55)*q.xz;
 // slightly tapered: wider at the front end (z>0)
 float sc0=1.0/(1.0+0.07*q.z);
 // S-shaped cross-section in xy: a big hump in the middle, a trough with an up-turned lip on each side
 vec2 s=vec2(q.x*sc0,q.y);
 const float ha=1.27;
 vec2 sc=vec2(sin(ha),cos(ha));
 float ra=0.36,rt=0.19;
 float main=sdArc(s,sc,ra,0.0);
 vec2 e0=sc*ra;
 vec2 c=e0+sc*rt;
 vec2 t=vec2(abs(s.x)-c.x,-(s.y-c.y));
 float trough=sdArc(t,sc,rt,0.0);
 float d2=min(main,trough)-0.035;
 // extrude along z with rounded ends
 vec2 e=vec2(d2,abs(q.z)-1.05+0.03);
 float d=length(max(e,0.0))+min(max(e.x,e.y),0.0)-0.03;
 return vec2(d*0.95,100.0);
}`},
 "dach":{view:{"cam":[-7.0,3.4,3.9],"target":[0,0.45,0],"fov":28},glsl:TILES+`
#define M_BEAM 101.0
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==M_BEAM){float s=fbm(p*vec3(4.0,4.0,4.0));t.alb=srgb2lin(mix(vec3(0.84,0.60,0.34),vec3(0.72,0.48,0.25),s));t.rough=0.5;t.spec=0.3;return true;}
 return clayMat(m,p,t);}
#define LX 1.25
#define H 1.0
vec2 objectMap(vec3 p){
 // ridge along x at height H, eaves at z=+-1, both slopes from one evaluation (mirror in z)
 vec3 m=vec3(p.x,p.y,abs(p.z));
 const float a=0.785398;
 vec3 vd=vec3(0.0,-sin(a),cos(a));
 vec3 wn=vec3(0.0,cos(a),sin(a));
 vec3 o=vec3(0.0,H,0.0);
 vec3 rr=vec3(m.x,dot(m-o,vd),dot(m-o,wn));
 vec3 r=rr-vec3(0.0,0.07,0.05);
 float d=tiles(r,LX+0.12,6.0);
 vec2 res=vec2(d,M_CLAY);
 // ridge caps
 vec3 c=p-vec3(0.0,H+0.08,0.0);
 float cx=c.x-0.3*clamp(round(c.x/0.3),-4.0,4.0);
 float cap=sdCylY(vec3(c.y,cx,c.z),0.135,0.12,0.05);
 cap=max(cap,abs(p.x)-LX-0.12);
 res=U(res,vec2(cap,M_CLAY));
 // wooden boards under the tiles, barge boards along both gable edges
 float board=max(abs(rr.z+0.0)-0.05,abs(rr.x)-LX-0.08);
 board=max(board,max(-rr.y-0.05,rr.y-1.5));
 float barge=sdRoundBox(vec3(abs(rr.x)-LX-0.02,rr.y-0.72,rr.z+0.1),vec3(0.06,0.8,0.11),0.03);
 board=min(board,barge);
 // gable frame (both ends): tie beam and king post
 float gx=abs(p.x)-LX+0.04;
 float tie=sdRoundBox(vec3(gx,p.y-0.09,p.z),vec3(0.06,0.07,0.92),0.025);
 float post=sdRoundBox(vec3(gx,p.y-0.55,p.z),vec3(0.055,0.45,0.06),0.02);
 // eave beams sticking out at both ends
 float plate=sdRoundBox(vec3(p.x,p.y-0.0,abs(p.z)-0.82),vec3(LX+0.14,0.07,0.07),0.025);
 res=U(res,vec2(min(min(board,plate),min(tie,post)),M_BEAM));
 // cream infill wall set back inside the gable
 float wall=max(rr.z+0.1,abs(p.x)-LX+0.2);
 wall=max(wall,0.02-p.y);
 res=U(res,vec2(wall,M_SAND));
 return res;
}`},
 "dachfenster":{view:{"cam":[1.0,4.2,6.4],"target":[0,0.3,0],"fov":28},glsl:TILES+`
#define M_SKYGLASS 102.0
const float SA=0.62;
// roof frame: x across, y down the slope from the top edge, z out of the roof
vec3 toRoof(vec3 p){
 vec3 o=vec3(0.0,1.05,-1.0);
 vec3 vd=vec3(0.0,-sin(SA),cos(SA));vec3 wn=vec3(0.0,cos(SA),sin(SA));
 return vec3(p.x,dot(p-o,vd),dot(p-o,wn));}
const vec2 WC=vec2(0.0,1.12);
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==M_SKYGLASS){
  vec3 r=toRoof(p);vec2 uv=vec2(r.x-WC.x,WC.y-r.y);
  vec3 c=mix(vec3(0.62,0.84,0.99),vec3(0.24,0.55,0.93),smoothstep(-0.45,0.45,uv.y));
  // two little clouds
  float cl=min(min(length(uv-vec2(-0.16,-0.22))-0.085,length(uv-vec2(-0.05,-0.19))-0.11),length(uv-vec2(0.06,-0.24))-0.075);
  cl=min(cl,max(length((uv-vec2(-0.05,-0.27))*vec2(0.6,1.4))-0.1,0.0));
  float cl2=min(min(length(uv-vec2(0.16,0.2))-0.06,length(uv-vec2(0.23,0.22))-0.075),length(uv-vec2(0.3,0.19))-0.055);
  c=mix(vec3(1.0),c,smoothstep(-0.01,0.01,min(cl,cl2)));
  // diagonal glare
  float g=abs(uv.x+uv.y*0.8-0.12);
  c=mix(c,vec3(0.92,0.97,1.0),0.35*smoothstep(0.05,0.0,g));
  t.alb=srgb2lin(c);t.rough=0.08;t.spec=1.0;return true;}
 if(m==105.0){t.alb=srgb2lin(vec3(0.46,0.47,0.50));t.rough=0.4;t.spec=0.5;return true;}
 return clayMat(m,p,t);}
vec2 objectMap(vec3 p){
 vec3 r=toRoof(p);
 vec2 w=r.xy-WC;
 float d=tiles(r,1.05,9.0);
 // hole in the tiles around the window
 vec2 hq=abs(w-vec2(0.0,0.03))-vec2(0.7,0.83);
 d=max(d,-(length(max(hq,0.0))+min(max(hq.x,hq.y),0.0)));
 vec2 res=vec2(d,M_CLAY);
 // dark flashing plate around the window
 float fl=sdRoundBox(vec3(w.x,w.y+0.03,r.z-0.05),vec3(0.7,0.83,0.04),0.03);
 res=U(res,vec2(fl,105.0));
 // board under the tiles so no gaps show
 float ub=sdBox(r-vec3(0.0,1.2,-0.035),vec3(1.0,1.18,0.03));
 res=U(res,vec2(ub,M_BROWN));
 // chunky dark frame
 float fr=sdRoundBox(vec3(w,r.z-0.12),vec3(0.54,0.66,0.12),0.06);
 vec2 iq=abs(w)-vec2(0.38,0.5);
 float hole=length(max(iq,0.0))+min(max(iq.x,iq.y),0.0)-0.03;
 fr=max(fr,-hole);
 res=U(res,vec2(fr,M_CHARCOAL));
 // light wooden lining inside the frame
 float lin=max(sdRoundBox(vec3(w,r.z-0.1),vec3(0.41,0.53,0.1),0.02),-(length(max(abs(w)-vec2(0.33,0.45),0.0))-0.01));
 res=U(res,vec2(lin,M_SAND));
 // sky-blue glass pane
 float gl=sdBox(vec3(w,r.z-0.1),vec3(0.36,0.48,0.012));
 res=U(res,vec2(gl,M_SKYGLASS));
 return res;
}`},
 "kamin":{view:{"cam":[-2.6,3.9,7.4],"target":[0,1.35,0],"fov":28},glsl:TILES+`
#define M_BRICKS 103.0
#define M_SMOKE 104.0
const float SA=0.5;
vec3 toRoof(vec3 p){
 vec3 o=vec3(0.0,0.85,-0.95);
 vec3 vd=vec3(0.0,-sin(SA),cos(SA));vec3 wn=vec3(0.0,cos(SA),sin(SA));
 return vec3(p.x,dot(p-o,vd),dot(p-o,wn));}
const vec3 CC=vec3(0.0,0.0,-0.1);
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==M_BRICKS){
  vec3 q=p-CC;
  vec2 uv=abs(n.x)>abs(n.z)?vec2(q.z,q.y):vec2(q.x,q.y);
  float row=floor(uv.y/0.13);
  float bx=uv.x/0.27+0.5*mod(row,2.0);
  vec2 f=vec2(fract(bx)*0.27,fract(uv.y/0.13)*0.13);
  float mort=min(min(f.x,0.27-f.x),min(f.y,0.13-f.y));
  float h=hash31(vec3(floor(bx),row,7.0));
  vec3 b=mix(vec3(0.78,0.30,0.20),vec3(0.66,0.24,0.16),h);
  vec3 c=mix(vec3(0.88,0.85,0.78),b,smoothstep(0.008,0.016,mort));
  t.alb=srgb2lin(c);t.rough=0.7;t.spec=0.2;return true;}
 if(m==M_SMOKE){t.alb=srgb2lin(vec3(0.80,0.81,0.84));t.rough=0.7;t.spec=0.15;t.sss=0.5;return true;}
 return clayMat(m,p,t);}
vec2 objectMap(vec3 p){
 vec3 r=toRoof(p);
 vec3 q=p-CC;
 float d=tiles(r,1.05,7.0);
 // tiles are cut around the chimney
 vec2 hq=abs(q.xz)-vec2(0.44,0.42);
 d=max(d,-(length(max(hq,0.0))+min(max(hq.x,hq.y),0.0)));
 vec2 res=vec2(d,M_CLAY);
 // brick stack
 float ch=sdRoundBox(q-vec3(0.0,0.95,0.0),vec3(0.34,0.95,0.32),0.03);
 ch=max(ch,-r.z-0.2);
 res=U(res,vec2(ch,M_BRICKS));
 // board under the tiles so no gaps show
 float ub=sdBox(r-vec3(0.0,0.93,-0.035),vec3(1.0,0.92,0.03));
 res=U(res,vec2(max(ub,-max(abs(q.x)-0.34,abs(q.z)-0.32)),M_BROWN));
 // grey flashing collar where the chimney meets the roof
 float col=sdRoundBox(vec3(q.x,0.0,q.z),vec3(0.42,1.0,0.4),0.04);
 col=max(col,abs(r.z-0.08)-0.1);
 res=U(res,vec2(col,M_GREY));
 // concrete cap and a chimney pot
 float cap=sdRoundBox(q-vec3(0.0,1.93,0.0),vec3(0.42,0.07,0.4),0.03);
 res=U(res,vec2(cap,M_CONCRETE));
 float pot=sdCylY(q-vec3(0.0,2.1,0.0),0.12,0.14,0.03);
 pot=min(pot,sdCylY(q-vec3(0.0,2.21,0.0),0.04,0.17,0.03));
 pot=max(pot,-(length(q.xz)-0.09));
 res=U(res,vec2(pot,M_CLAY));
 // little stylised smoke cloud drifting up and to the right
 float sm=length(q-vec3(0.06,2.5,0.0))-0.15;
 sm=smin(sm,length(q-vec3(0.22,2.78,-0.04))-0.2,0.08);
 sm=smin(sm,length(q-vec3(0.5,3.02,-0.08))-0.24,0.08);
 sm=smin(sm,length(q-vec3(0.28,3.12,-0.06))-0.17,0.08);
 res=U(res,vec2(sm,M_SMOKE));
 return res;
}`},
 "bad":{view:{"cam":[-3.9,3.9,6.2],"target":[0.05,0.6,-0.4],"fov":28},glsl:`
#define HAS_MAT
#define M_WALLTILE 110.0
#define M_FLOORTILE 111.0
#define M_MIRROR 112.0
#define M_PORC 113.0
float grout(vec2 uv,float s,float w){vec2 f=abs(fract(uv/s+0.5)-0.5)*s;return smoothstep(w*0.5,w,min(f.x,f.y));}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 p.x=-p.x;n.x=-n.x;
 if(m==M_WALLTILE){
  vec2 uv=abs(n.x)>0.5?p.zy:p.xy;
  float g=grout(uv,0.18,0.016);
  float h=hash31(vec3(floor(uv/0.18+0.5),3.0));
  vec3 c=mix(vec3(0.93,0.96,0.97),mix(vec3(0.52,0.77,0.90),vec3(0.47,0.72,0.87),h),g);
  t.alb=srgb2lin(c);t.rough=0.25;t.spec=0.7;return true;}
 if(m==M_FLOORTILE){
  float g=grout(p.xz,0.3,0.02);
  vec2 id=floor(p.xz/0.3+0.5);
  vec3 c=mod(id.x+id.y,2.0)<0.5?vec3(0.95,0.95,0.94):vec3(0.84,0.86,0.88);
  t.alb=srgb2lin(mix(vec3(0.70,0.72,0.74),c,g));t.rough=0.3;t.spec=0.5;return true;}
 if(m==M_MIRROR){
  float gl=abs(p.x*0.9+p.y-1.55);
  vec3 c=mix(vec3(0.78,0.88,0.94),vec3(0.95,0.98,1.0),smoothstep(0.04,0.0,gl)*0.8);
  t.alb=srgb2lin(c);t.rough=0.05;t.spec=1.0;return true;}
 if(m==M_PORC){t.alb=srgb2lin(vec3(0.97,0.97,0.96));t.rough=0.18;t.spec=0.8;return true;}
 return false;}
vec2 tub(vec3 p){
 vec3 c=(p-vec3(-0.6,0.0,-0.82))/1.1;
 float outer=sdRoundBox(c-vec3(0.0,0.28,0.0),vec3(0.54,0.28,0.32),0.1);
 float inner=sdRoundBox(c-vec3(0.0,0.62,0.0),vec3(0.45,0.5,0.23),0.14);
 vec2 res=vec2(max(outer,-inner),M_PORC);
 // water with a few foam bubbles
 float wat=max(inner,c.y-0.42);
 res=U(res,vec2(wat,M_WATER));
 float fo=length(c-vec3(0.15,0.43,0.02))-0.1;
 fo=smin(fo,length(c-vec3(0.28,0.44,-0.06))-0.08,0.04);
 fo=smin(fo,length(c-vec3(0.05,0.43,-0.08))-0.07,0.04);
 fo=smin(fo,length(c-vec3(0.3,0.43,0.1))-0.06,0.04);
 res=U(res,vec2(fo,M_FOAM));
 // tap on the wall
 vec3 f=c-vec3(-0.32,0.72,-0.34);
 float tap=sdCapsule(f,vec3(0.0),vec3(0.0,0.0,0.14),0.03);
 tap=min(tap,sdCapsule(f,vec3(0.0,0.0,0.14),vec3(0.0,-0.07,0.17),0.028));
 tap=min(tap,sdCylY(vec3(f.x-0.13,f.y,f.z-0.04),0.03,0.045,0.015));
 tap=min(tap,sdCylY(vec3(f.x+0.13,f.y,f.z-0.04),0.03,0.045,0.015));
 res=U(res,vec2(tap,M_STEEL));
 return res;}
vec2 sink(vec3 p){
 vec3 c=(p-vec3(0.36,0.0,-0.95))/1.15;
 float ped=sdRoundCone(c,vec3(0.0,0.0,-0.04),vec3(0.0,0.6,-0.04),0.12,0.08);
 float bas=sdRoundBox(c-vec3(0.0,0.7,0.02),vec3(0.27,0.09,0.19),0.08);
 bas=smax(bas,-sdEllipsoid(c-vec3(0.0,0.8,0.05),vec3(0.21,0.13,0.13)),0.02);
 vec2 res=vec2(smin(ped,bas,0.05),M_PORC);
 float tap=sdCapsule(c,vec3(0.0,0.75,-0.15),vec3(0.0,0.9,-0.15),0.028);
 tap=min(tap,sdCapsule(c,vec3(0.0,0.9,-0.15),vec3(0.0,0.88,-0.05),0.026));
 tap=min(tap,sdCylY(c-vec3(0.0,0.93,-0.15),0.02,0.05,0.01));
 res=U(res,vec2(tap,M_STEEL));
 // mirror with a wooden frame
 vec3 mq=p-vec3(0.36,1.33,-1.19);
 float fr=sdRoundBox(mq,vec3(0.22,0.27,0.03),0.03);
 fr=max(fr,-sdBox(mq-vec3(0.0,0.0,0.03),vec3(0.16,0.21,0.03)));
 res=U(res,vec2(fr,M_WOOD));
 res=U(res,vec2(sdBox(mq,vec3(0.17,0.22,0.02)),M_MIRROR));
 return res;}
vec2 toilet(vec3 p){
 vec3 c=(p-vec3(0.92,0.0,-0.93))/1.15;
 float tank=sdRoundBox(c-vec3(0.0,0.66,-0.14),vec3(0.2,0.2,0.09),0.06);
 float base=sdRoundCone(c,vec3(0.0,0.0,0.12),vec3(0.0,0.26,0.12),0.13,0.11);
 float bowl=sdEllipsoid(c-vec3(0.0,0.33,0.14),vec3(0.18,0.13,0.25));
 bowl=max(bowl,c.y-0.42);
 float back=sdRoundBox(c-vec3(0.0,0.38,-0.06),vec3(0.12,0.08,0.1),0.05);
 float body=smin(smin(base,bowl,0.08),back,0.05);
 body=min(body,tank);
 float lid=sdEllipsoid(c-vec3(0.0,0.44,0.15),vec3(0.19,0.035,0.26));
 body=min(body,lid);
 vec2 res=vec2(body,M_PORC);
 res=U(res,vec2(sdCylY(c-vec3(0.0,0.87,-0.14),0.02,0.05,0.015),M_STEEL));
 return res;}
// the room is built with its walls on the left and back, then mirrored so the light falls into it
vec2 roomMap(vec3 p){
 // floor slab and two tiled walls
 float fl=sdRoundBox(p-vec3(-0.03,-0.07,-0.385),vec3(1.29,0.07,0.935),0.02);
 vec2 res=vec2(fl,M_FLOORTILE);
 float wl=sdRoundBox(p-vec3(-1.26,0.85,-0.385),vec3(0.06,0.85,0.935),0.02);
 wl=min(wl,sdRoundBox(p-vec3(-0.03,0.85,-1.26),vec3(1.29,0.85,0.06),0.02));
 res=U(res,vec2(wl,M_WALLTILE));
 // white trim on the wall tops and front edges
 float tr=sdRoundBox(p-vec3(-1.26,1.73,-0.385),vec3(0.08,0.035,0.955),0.02);
 tr=min(tr,sdRoundBox(p-vec3(-0.03,1.73,-1.26),vec3(1.31,0.035,0.08),0.02));
 res=U(res,vec2(tr,M_WOOD));
 // bath mat
 res=U(res,vec2(sdRoundBox(p-vec3(-0.45,0.018,-0.12),vec3(0.36,0.018,0.2),0.018),M_TEAL));
 // towel on the left wall
 vec3 tq=p-vec3(-1.15,0.95,-0.05);
 float tw=sdRoundBox(tq,vec3(0.035,0.26,0.17),0.03);
 tw=min(tw,sdCapsule(tq,vec3(-0.03,0.27,-0.2),vec3(-0.03,0.27,0.2),0.025));
 res=U(res,vec2(tw,M_CORAL));
 // furniture, each behind a bounding box
 float b=sdBox(p-vec3(-0.6,0.45,-0.82),vec3(0.66,0.5,0.45));
 vec2 o=tub(p);res=U(res,b>0.1?vec2(b,0.0):vec2(o.x*1.1,o.y));
 b=sdBox(p-vec3(0.36,0.84,-0.93),vec3(0.43,0.86,0.33));
 o=sink(p);res=U(res,b>0.1?vec2(b,0.0):vec2(o.x*1.15,o.y));
 b=sdBox(p-vec3(0.92,0.56,-0.85),vec3(0.3,0.58,0.45));
 o=toilet(p);res=U(res,b>0.1?vec2(b,0.0):vec2(o.x*1.15,o.y));
 return res;
}
vec2 objectMap(vec3 p){return roomMap(vec3(-p.x,p.y,p.z));}`},
 "kueche":{view:{"cam":[-3.6,3.9,6.3],"target":[0.05,0.62,-0.4],"fov":28},glsl:`
#define HAS_MAT
#define M_KWALL 120.0
#define M_PLANKS 121.0
#define M_CAB 122.0
#define M_SPLASH 123.0
#define M_OVENGLASS 124.0
float grout(vec2 uv,float s,float w){vec2 f=abs(fract(uv/s+0.5)-0.5)*s;return smoothstep(w*0.5,w,min(f.x,f.y));}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 p.x=-p.x;n.x=-n.x;
 if(m==M_KWALL){t.alb=srgb2lin(vec3(0.99,0.84,0.56));t.rough=0.6;t.spec=0.2;return true;}
 if(m==M_SPLASH){vec2 uv=abs(n.x)>0.5?p.zy:p.xy;uv.x+=0.5*0.12*mod(floor(uv.y/0.08),2.0);
  vec2 f=abs(fract(uv/vec2(0.12,0.08))-0.5)*vec2(0.12,0.08);float g=smoothstep(0.004,0.008,min(f.x,f.y));
  t.alb=srgb2lin(mix(vec3(0.85,0.82,0.76),vec3(0.98,0.97,0.94),g));t.rough=0.2;t.spec=0.7;return true;}
 if(m==M_PLANKS){
  float row=floor(p.z/0.16);float x=p.x+hash31(vec3(row,1.0,2.0))*0.7;
  float col=floor(x/0.7);
  float h=hash31(vec3(row,col,5.0));
  vec2 f=vec2(fract(x/0.7)*0.7,fract(p.z/0.16)*0.16);
  float seam=smoothstep(0.004,0.009,min(min(f.x,0.7-f.x),min(f.y,0.16-f.y)));
  float g=fbm(vec3(p.x*3.0,0.0,p.z*30.0));
  vec3 c=mix(vec3(0.86,0.60,0.34),vec3(0.76,0.50,0.27),h*0.7+g*0.4);
  t.alb=srgb2lin(mix(vec3(0.45,0.28,0.15),c,seam));t.rough=0.45;t.spec=0.35;return true;}
 if(m==M_CAB){t.alb=srgb2lin(vec3(0.55,0.72,0.60));t.rough=0.35;t.spec=0.5;return true;}
 if(m==M_OVENGLASS){t.alb=srgb2lin(vec3(0.12,0.12,0.14));t.rough=0.1;t.spec=1.0;return true;}
 return false;}
// base cabinet front with a door groove and a knob, x range [x0,x1]
vec2 baseCab(vec3 p,float x0,float x1){
 float cx=(x0+x1)*0.5,hx=(x1-x0)*0.5;
 float b=sdRoundBox(p-vec3(cx,0.4,-0.92),vec3(hx-0.01,0.38,0.28),0.03);
 vec3 dq=p-vec3(cx,0.42,-0.635);
 float groove=sdBox(vec3(abs(dq.x)-0.0,dq.y,dq.z),vec3(0.008,0.3,0.03));
 b=max(b,-groove);
 vec2 res=vec2(b,M_CAB);
 float kn=length(dq-vec3(0.0,0.2,0.01)-vec3(0.05,0.0,0.0))-0.025;
 kn=min(kn,length(dq-vec3(-0.05,0.2,0.01))-0.025);
 res=U(res,vec2(kn,M_BRASS));
 return res;}
vec2 counter(vec3 p){
 vec2 res=baseCab(p,-1.2,-0.33);
 res=U(res,baseCab(p,0.25,0.64));
 float top=sdRoundBox(p-vec3(-0.28,0.81,-0.9),vec3(0.94,0.035,0.33),0.02);
 res=U(res,vec2(top,M_WOOD));
 return res;}
vec2 stove(vec3 p){
 vec3 c=p-vec3(-0.04,0.0,-0.92);
 float body=sdRoundBox(c-vec3(0.0,0.42,0.0),vec3(0.27,0.42,0.3),0.03);
 vec2 res=vec2(body,M_WHITE);
 // black cooktop with four burners
 float ct=sdRoundBox(c-vec3(0.0,0.86,0.0),vec3(0.27,0.02,0.3),0.015);
 res=U(res,vec2(ct,M_DARK));
 vec2 g=vec2(abs(c.x)-0.13,abs(c.z+0.0)-0.13);
 float bu=sdTorus(vec3(g.x,c.y-0.885,g.y),vec2(0.075,0.02));
 res=U(res,vec2(bu,M_CHARCOAL));
 // oven door: window and handle
 float win=sdRoundBox(c-vec3(0.0,0.36,0.3),vec3(0.18,0.13,0.02),0.03);
 res=U(res,vec2(win,M_OVENGLASS));
 float hd=sdCapsule(c,vec3(-0.17,0.58,0.34),vec3(0.17,0.58,0.34),0.022);
 hd=min(hd,sdCapsule(c,vec3(-0.17,0.58,0.3),vec3(-0.17,0.58,0.34),0.018));
 hd=min(hd,sdCapsule(c,vec3(0.17,0.58,0.3),vec3(0.17,0.58,0.34),0.018));
 res=U(res,vec2(hd,M_STEEL));
 // knobs
 vec3 kq=c-vec3(0.0,0.72,0.31);kq.x=abs(kq.x);kq.x-=0.07;kq.x=abs(kq.x)-0.06;
 float kn=sdCylY(vec3(kq.x,kq.z,kq.y),0.025,0.035,0.01);
 res=U(res,vec2(kn,M_DARK));
 // red pot on the front left burner
 vec3 pq=c-vec3(-0.13,0.9,0.13);
 float pot=sdCylY(pq-vec3(0.0,0.11,0.0),0.11,0.12,0.02);
 pot=max(pot,-sdCylY(pq-vec3(0.0,0.2,0.0),0.08,0.1,0.01));
 float lid=sdCylY(pq-vec3(0.0,0.215,0.0),0.012,0.125,0.008);
 lid=min(lid,length(pq-vec3(0.0,0.245,0.0))-0.025);
 float ears=sdCapsule(pq,vec3(-0.16,0.17,0.0),vec3(0.16,0.17,0.0),0.02);
 res=U(res,vec2(min(min(pot,lid),ears),M_RED));
 return res;}
vec2 fridge(vec3 p){
 vec3 c=p-vec3(0.93,0.0,-0.9);
 float b=sdRoundBox(c-vec3(0.0,0.75,0.0),vec3(0.27,0.75,0.3),0.07);
 b=max(b,-sdBox(c-vec3(0.0,1.02,0.3),vec3(0.3,0.008,0.03)));
 vec2 res=vec2(b,M_MINT);
 float h=sdCapsule(c,vec3(-0.2,1.12,0.34),vec3(-0.2,1.32,0.34),0.022);
 h=min(h,sdCapsule(c,vec3(-0.2,0.7,0.34),vec3(-0.2,0.92,0.34),0.022));
 res=U(res,vec2(h,M_STEEL));
 return res;}
vec2 uppers(vec3 p){
 vec3 c=p-vec3(-0.78,1.38,-1.05);
 float b=sdRoundBox(c,vec3(0.42,0.22,0.16),0.03);
 b=max(b,-sdBox(vec3(c.x,c.y,c.z-0.16),vec3(0.008,0.2,0.02)));
 vec2 res=vec2(b,M_CAB);
 float kn=min(length(c-vec3(0.05,-0.14,0.17))-0.025,length(c-vec3(-0.05,-0.14,0.17))-0.025);
 res=U(res,vec2(kn,M_BRASS));
 // extractor hood over the stove
 vec3 hq=p-vec3(-0.04,1.3,-1.02);
 float hood=sdRoundBox(hq,vec3(0.28,0.05,0.18),0.02);
 hood=min(hood,sdRoundBox(hq-vec3(0.0,0.2,-0.06),vec3(0.1,0.2,0.08),0.02));
 res=U(res,vec2(hood,M_STEEL));
 return res;}
vec2 shelf(vec3 p){
 // open shelf on the left wall with three jars and a plant on the counter
 vec3 c=p-vec3(-1.08,1.22,-0.22);
 vec2 res=vec2(sdRoundBox(c,vec3(0.13,0.025,0.36),0.01),M_WOOD);
 vec3 j=c-vec3(0.0,0.13,0.0);
 float jz=j.z-0.24*clamp(round(j.z/0.24),-1.0,1.0);
 float jar=sdCylY(vec3(j.x,j.y,jz),0.1,0.075,0.03);
 float lidj=sdCylY(vec3(j.x,j.y-0.12,jz),0.025,0.065,0.015);
 float id=clamp(round(j.z/0.24),-1.0,1.0);
 res=U(res,vec2(jar,id<-0.5?M_YELLOW:(id<0.5?M_CORAL:M_LAVENDER)));
 res=U(res,vec2(lidj,M_WHITE));
 // potted plant on the counter
 vec3 pq=p-vec3(-0.98,0.84,-1.0);
 float pot=sdCappedCone(pq-vec3(0.0,0.1,0.0),0.1,0.08,0.11);
 res=U(res,vec2(pot,M_TERRA));
 float lv=sdEllipsoid(pq-vec3(0.0,0.3,0.0),vec3(0.15,0.13,0.15));
 lv=smin(lv,sdEllipsoid(pq-vec3(0.08,0.38,0.04),vec3(0.09,0.1,0.09)),0.04);
 lv=smin(lv,sdEllipsoid(pq-vec3(-0.07,0.4,-0.03),vec3(0.08,0.1,0.08)),0.04);
 res=U(res,vec2(lv,M_LEAF));
 return res;}
// the room is built with its walls on the left and back, then mirrored so the light falls into it
vec2 roomMap(vec3 p){
 float fl=sdRoundBox(p-vec3(-0.03,-0.07,-0.385),vec3(1.29,0.07,0.935),0.02);
 vec2 res=vec2(fl,M_PLANKS);
 float wl=sdRoundBox(p-vec3(-1.26,0.85,-0.385),vec3(0.06,0.85,0.935),0.02);
 wl=min(wl,sdRoundBox(p-vec3(-0.03,0.85,-1.26),vec3(1.29,0.85,0.06),0.02));
 res=U(res,vec2(wl,M_KWALL));
 // tiled splash-back behind the counter
 float sp=sdBox(p-vec3(-0.28,1.0,-1.2),vec3(0.94,0.17,0.012));
 res=U(res,vec2(sp,M_SPLASH));
 float tr=sdRoundBox(p-vec3(-1.26,1.73,-0.385),vec3(0.08,0.035,0.955),0.02);
 tr=min(tr,sdRoundBox(p-vec3(-0.03,1.73,-1.26),vec3(1.31,0.035,0.08),0.02));
 res=U(res,vec2(tr,M_WHITE));
 float b=sdBox(p-vec3(-0.28,0.45,-0.9),vec3(0.98,0.48,0.38));
 res=U(res,b>0.1?vec2(b,0.0):counter(p));
 b=sdBox(p-vec3(-0.04,0.6,-0.9),vec3(0.32,0.62,0.38));
 res=U(res,b>0.1?vec2(b,0.0):stove(p));
 b=sdBox(p-vec3(0.93,0.76,-0.9),vec3(0.3,0.78,0.38));
 res=U(res,b>0.1?vec2(b,0.0):fridge(p));
 b=sdBox(p-vec3(-0.45,1.45,-1.05),vec3(0.8,0.3,0.22));
 res=U(res,b>0.1?vec2(b,0.0):uppers(p));
 b=min(sdBox(p-vec3(-1.08,1.35,-0.22),vec3(0.15,0.17,0.4)),sdBox(p-vec3(-0.98,1.1,-1.0),vec3(0.18,0.28,0.18)));
 res=U(res,b>0.1?vec2(b,0.0):shelf(p));
 return res;
}
vec2 objectMap(vec3 p){return roomMap(vec3(-p.x,p.y,p.z));}`},
 "dachboden":{view:{"cam":[-0.7,2.4,8.0],"target":[-0.05,0.8,-0.2],"fov":28},glsl:TILES+`
#define M_FLOORB 130.0
#define M_BOARDS 131.0
#define M_RAFTER 132.0
#define M_CARTON 133.0
#define M_TRUNK 134.0
#define M_GABLE 135.0
#define M_ROUNDSKY 136.0
#define M_BULB 137.0
const float SA=0.82;
const float ZF=0.6,ZB=-1.0;
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==M_FLOORB||m==M_BOARDS||m==M_GABLE){
  // wooden boards: seams across x for the floor, across z for the roof, across x for the gable wall
  float coord=m==M_BOARDS?p.z:p.x;float w=m==M_FLOORB?0.2:0.17;
  float id=floor(coord/w);float f=fract(coord/w)*w;
  float seam=smoothstep(0.004,0.01,min(f,w-f));
  float h=hash31(vec3(id,m,3.0));
  float g=fbm(vec3(p.x*3.0,p.y*3.0,p.z*3.0)+vec3(id*7.0));
  vec3 a=m==M_FLOORB?vec3(0.88,0.66,0.40):(m==M_BOARDS?vec3(0.82,0.58,0.34):vec3(0.74,0.50,0.29));
  vec3 c=a*(0.88+0.12*h+0.08*g);
  t.alb=srgb2lin(mix(a*0.55,c,seam));t.rough=0.55;t.spec=0.25;return true;}
 if(m==M_RAFTER){float g=fbm(p*vec3(5.0));t.alb=srgb2lin(mix(vec3(0.60,0.37,0.20),vec3(0.50,0.30,0.16),g));t.rough=0.5;t.spec=0.3;return true;}
 if(m==M_CARTON){t.alb=srgb2lin(vec3(0.84,0.64,0.40));t.rough=0.75;t.spec=0.12;return true;}
 if(m==M_TRUNK){t.alb=srgb2lin(vec3(0.24,0.50,0.60));t.rough=0.4;t.spec=0.45;return true;}
 if(m==M_ROUNDSKY){t.alb=srgb2lin(mix(vec3(0.62,0.85,1.0),vec3(0.35,0.65,0.95),smoothstep(0.9,1.2,p.y)));t.rough=0.08;t.spec=1.0;return true;}
 if(m==M_BULB){t.alb=srgb2lin(vec3(1.0,0.9,0.55));t.rough=0.2;t.spec=0.6;t.sss=1.0;return true;}
 return clayMat(m,p,t);}
vec2 box(vec3 p,vec3 c,vec3 h,float a){
 vec3 q=p-c;q.xz=rot(a)*q.xz;
 vec2 res=vec2(sdRoundBox(q,h,0.025),M_CARTON);
 // packing tape over the top
 float tape=sdBox(q-vec3(0.0,h.y,0.0),vec3(h.x+0.004,0.006,0.05));
 tape=min(tape,sdBox(q-vec3(h.x,h.y*0.5,0.0),vec3(0.006,h.y*0.5+0.004,0.05)));
 res=U(res,vec2(tape,M_SAND));
 return res;}
vec2 stuff(vec3 p){
 vec2 res=box(p,vec3(-0.5,0.21,-0.42),vec3(0.27,0.21,0.23),0.1);
 res=U(res,box(p,vec3(-0.48,0.58,-0.44),vec3(0.2,0.16,0.18),-0.2));
 res=U(res,box(p,vec3(0.0,0.16,-0.75),vec3(0.2,0.16,0.18),0.35));
 // old trunk with a round lid and brass bands
 vec3 q=p-vec3(0.5,0.0,-0.12);q.xz=rot(-0.3)*q.xz;
 float body=sdRoundBox(q-vec3(0.0,0.17,0.0),vec3(0.38,0.17,0.22),0.03);
 float lid=sdCylY(vec3(q.y-0.32,q.x,q.z),0.38,0.22,0.03);
 lid=max(lid,0.33-q.y);
 vec2 tr=vec2(min(body,lid),M_TRUNK);
 vec3 bq=q;bq.x=abs(bq.x)-0.24;
 float band=sdRoundBox(bq-vec3(0.0,0.17,0.0),vec3(0.035,0.175,0.245),0.02);
 band=min(band,max(sdCylY(vec3(bq.y-0.32,bq.x,bq.z),0.035,0.245,0.015),0.3-q.y));
 band=min(band,sdRoundBox(q-vec3(0.0,0.3,0.235),vec3(0.05,0.06,0.02),0.012));
 tr=U(tr,vec2(band,M_BRASS));
 res=U(res,tr);
 return res;}
vec2 objectMap(vec3 p){
 // floor
 float fl=sdRoundBox(p-vec3(0.0,-0.07,-0.22),vec3(1.42,0.07,0.86),0.02);
 vec2 res=vec2(fl,M_FLOORB);
 // roof frame for both slopes (mirror in x): x along the eave (=z), y down the slope, z out of the roof
 vec3 m=vec3(abs(p.x),p.y,p.z);
 vec3 o=vec3(0.0,1.78,0.0);
 vec3 vd=vec3(cos(SA),-sin(SA),0.0);vec3 wn=vec3(sin(SA),cos(SA),0.0);
 vec3 r=vec3(m.z+0.2,dot(m-o,vd),dot(m-o,wn));
 // tiles outside
 float td=tiles(r-vec3(0.0,0.06,0.0),0.86,8.0);
 td=max(td,r.y-2.12);
 res=U(res,vec2(td,M_CLAY));
 // board layer under the tiles, seen from inside
 float bd=max(abs(r.z+0.04)-0.04,abs(r.x)-0.84);
 bd=max(bd,max(-r.y-0.1,r.y-2.1));
 res=U(res,vec2(bd,M_BOARDS));
 // rafters under the boards, the front one frames the cut-away
 float zr=p.z-0.6*clamp(round((p.z-0.55)/0.6),-2.0,0.0)-0.55;
 float rf=sdRoundBox(vec3(zr,r.y-1.0,r.z+0.15),vec3(0.06,1.08,0.08),0.02);
 // ridge beam
 float cb=1e9;
 float rb=sdRoundBox(vec3(p.x,p.y-1.6,p.z+0.2),vec3(0.07,0.07,0.86),0.02);
 // knee walls at the eaves
 float kw=sdRoundBox(vec3(m.x-1.33,p.y-0.17,p.z+0.22),vec3(0.06,0.17,0.86),0.02);
 res=U(res,vec2(min(rf,min(rb,kw)),M_RAFTER));
 // back gable wall with a round window
 float gw=max(abs(p.z-ZB+0.04)-0.04,r.z+0.02);
 gw=max(gw,-p.y);
 vec3 wq=vec3(p.x,p.y-0.88,p.z-ZB);
 float hole=length(wq.xy)-0.17;
 gw=max(gw,-hole);
 res=U(res,vec2(gw,M_GABLE));
 float ring=sdTorus(vec3(wq.x,wq.z-0.0,wq.y),vec2(0.19,0.04));
 res=U(res,vec2(ring,M_RAFTER));
 res=U(res,vec2(max(length(wq.xy)-0.18,abs(wq.z+0.03)-0.01),M_ROUNDSKY));
 // bulb hanging from the ridge beam
 float cord=sdCapsule(p,vec3(0.0,1.55,0.15),vec3(0.0,1.12,0.15),0.012);
 res=U(res,vec2(cord,M_DARK));
 res=U(res,vec2(sdCylY(p-vec3(0.0,1.1,0.15),0.035,0.04,0.01),M_BRASS));
 res=U(res,vec2(length(p-vec3(0.0,1.0,0.15))-0.075,M_BULB));
 // ridge caps
 vec3 c=p-vec3(0.0,1.83,-0.2);
 float cz=c.z-0.29*clamp(round(c.z/0.29),-3.0,3.0);
 float cap=sdCylY(vec3(c.x,cz,c.y),0.13,0.115,0.045);
 cap=max(cap,abs(c.z)-0.82);
 res=U(res,vec2(cap,M_CLAY));
 // boxes and trunk
 float b=sdBox(p-vec3(-0.1,0.4,-0.4),vec3(1.1,0.42,0.72));
 res=U(res,b>0.1?vec2(b,0.0):stuff(p));
 return res;
}`},
 "keller":{view:{"cam":[-4.2,3.9,6.1],"target":[0.05,0.62,-0.3],"fov":28},glsl:`
#define HAS_MAT
#define M_STONE 140.0
#define M_CFLOOR 141.0
#define M_STEP 142.0
#define M_BOTTLE 143.0
#define M_BULB 144.0
#define M_CRATE 145.0
#define M_SHELFW 146.0
#define M_DIMSKY 147.0
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 p.x=-p.x;n.x=-n.x;
 if(m==M_STONE){
  // irregular stone blocks with dark mortar
  vec2 uv=abs(n.x)>0.5?vec2(p.z,p.y):(abs(n.z)>0.5?vec2(p.x,p.y):vec2(p.x+p.z,p.y+0.07));
  float row=floor(uv.y/0.21);
  float off=hash31(vec3(row,4.0,1.0));
  float x=uv.x/0.36+off;float col=floor(x);
  vec2 f=vec2(fract(x)*0.36,fract(uv.y/0.21)*0.21);
  float mort=min(min(f.x,0.36-f.x),min(f.y,0.21-f.y));
  float h=hash31(vec3(col,row,9.0));
  float g=fbm(p*7.0);
  vec3 c=mix(vec3(0.47,0.50,0.56),vec3(0.36,0.39,0.45),h)*(0.9+0.2*g);
  t.alb=srgb2lin(mix(vec3(0.21,0.22,0.25),c,smoothstep(0.008,0.018,mort)));t.rough=0.85;t.spec=0.15;return true;}
 if(m==M_CFLOOR){float g=fbm(p*6.0);t.alb=srgb2lin(mix(vec3(0.38,0.39,0.43),vec3(0.31,0.32,0.36),g));t.rough=0.8;t.spec=0.15;return true;}
 if(m==M_STEP){float g=fbm(p*8.0);t.alb=srgb2lin(mix(vec3(0.54,0.55,0.59),vec3(0.46,0.47,0.51),g));t.rough=0.8;t.spec=0.15;return true;}
 if(m==M_BOTTLE){t.alb=srgb2lin(vec3(0.16,0.52,0.30));t.rough=0.08;t.spec=1.0;return true;}
 if(m==M_BULB){t.alb=srgb2lin(vec3(1.0,0.9,0.55));t.rough=0.2;t.spec=0.6;t.sss=1.0;return true;}
 if(m==M_SHELFW){float g=fbm(p*vec3(3.0,12.0,3.0));t.alb=srgb2lin(mix(vec3(0.70,0.48,0.28),vec3(0.60,0.39,0.22),g));t.rough=0.55;t.spec=0.25;return true;}
 if(m==148.0){t.alb=srgb2lin(vec3(0.56,0.57,0.60));t.rough=0.7;t.spec=0.2;return true;}
 if(m==M_DIMSKY){t.alb=srgb2lin(vec3(0.55,0.75,0.92));t.rough=0.08;t.spec=1.0;return true;}
 return false;}
// one stair column: from the floor up to its step
float stepCol(vec3 p,float k){
 float top=(k+1.0)*0.215;float z1=0.32-k*0.235;
 return sdRoundBox(p-vec3(-0.92,top*0.5,z1-0.1175),vec3(0.28,top*0.5,0.1175),0.015);}
vec2 stairs(vec3 p){
 float k=clamp(floor((0.32-p.z)/0.235),0.0,6.0);
 float d=min(stepCol(p,k),min(stepCol(p,max(k-1.0,0.0)),stepCol(p,min(k+1.0,6.0))));
 vec2 res=vec2(d,M_STEP);
 // wooden hand rail on the open side
 vec3 a=vec3(-0.66,0.98,0.2),b=vec3(-0.66,1.85,-0.75);
 float rail=sdCapsule(p,a,b,0.035);
 float pz=p.z-0.75*clamp(round((p.z-0.1)/0.75),-1.0,0.0)-0.1;
 float kk=clamp(floor((0.32-p.z)/0.235),0.0,6.0);
 float post=sdCapsule(vec3(p.x,p.y,pz),vec3(-0.66,0.0,0.0),vec3(-0.66,1.55,0.0),0.03);
 post=max(post,p.y-(1.32+(0.2-p.z)*0.78));
 post=max(post,-p.y+(0.215*clamp(floor((0.32-p.z)/0.235)+1.0,1.0,7.0))-0.02);
 res=U(res,vec2(min(rail,post),M_SHELFW));
 return res;}
vec2 bottle(vec3 q){
 float b=sdCylY(q-vec3(0.0,0.11,0.0),0.11,0.055,0.03);
 b=smin(b,sdRoundCone(q,vec3(0.0,0.2,0.0),vec3(0.0,0.33,0.0),0.04,0.018),0.03);
 vec2 res=vec2(b,M_BOTTLE);
 res=U(res,vec2(sdCylY(q-vec3(0.0,0.34,0.0),0.02,0.022,0.008),M_SAND));
 return res;}
vec2 shelf(vec3 p){
 vec3 c=p-vec3(0.62,0.0,-1.0);
 float sides=sdRoundBox(vec3(abs(c.x)-0.45,c.y-0.66,c.z),vec3(0.035,0.66,0.19),0.015);
 float yb=c.y-0.45*clamp(round((c.y-0.12)/0.45),0.0,2.0)-0.12;
 float boards=sdRoundBox(vec3(c.x,yb,c.z),vec3(0.46,0.025,0.19),0.012);
 vec2 res=vec2(min(sides,boards),M_SHELFW);
 // bottles lying... standing on the two lower boards
 vec3 bq=c-vec3(0.0,0.145,0.0);
 float ix=clamp(round(bq.x/0.15),-2.0,2.0);
 float iy=clamp(round(bq.y/0.45),0.0,1.0);
 vec3 l=vec3(bq.x-ix*0.15,bq.y-iy*0.45,bq.z);
 res=U(res,bottle(l));
 // jars on the top board
 vec3 jq=c-vec3(0.0,1.05,0.0);
 float jx=clamp(round(jq.x/0.26),-1.0,1.0);
 vec3 jl=vec3(jq.x-jx*0.26,jq.y,jq.z);
 float jar=sdCylY(jl-vec3(0.0,0.09,0.0),0.09,0.075,0.03);
 res=U(res,vec2(jar,jx<-0.5?M_ORANGE:(jx<0.5?M_RED:M_YELLOW)));
 res=U(res,vec2(sdCylY(jl-vec3(0.0,0.19,0.0),0.02,0.065,0.01),M_STEEL));
 return res;}
vec2 crates(vec3 p){
 // red drinks crate with bottle tops
 vec3 c=p-vec3(0.45,0.0,-0.32);c.xz=rot(0.15)*c.xz;
 float cr=sdRoundBox(c-vec3(0.0,0.17,0.0),vec3(0.3,0.17,0.22),0.03);
 cr=max(cr,-sdBox(c-vec3(0.0,0.3,0.0),vec3(0.26,0.2,0.18)));
 cr=max(cr,-sdBox(c-vec3(0.0,0.24,0.0),vec3(0.18,0.05,0.3)));
 vec2 res=vec2(cr,M_RED);
 vec2 g=c.xz-vec2(0.12,0.12)*clamp(round(c.xz/vec2(0.12,0.12)),vec2(-2.0,-1.0),vec2(2.0,1.0));
 vec3 bq=vec3(g.x,c.y,g.y);
 float neck=sdRoundCone(bq,vec3(0.0,0.14,0.0),vec3(0.0,0.4,0.0),0.05,0.02);
 neck=max(neck,abs(c.x)-0.26);
 res=U(res,vec2(neck,M_BOTTLE));
 res=U(res,vec2(max(sdCylY(bq-vec3(0.0,0.41,0.0),0.015,0.025,0.006),abs(c.x)-0.26),M_YELLOW));
 // wooden crate
 vec3 w=p-vec3(-0.25,0.0,-0.95);w.xz=rot(-0.2)*w.xz;
 float wc=sdRoundBox(w-vec3(0.0,0.17,0.0),vec3(0.24,0.17,0.2),0.02);
 // open top and thin gaps between the side slats
 wc=max(wc,-sdBox(w-vec3(0.0,0.3,0.0),vec3(0.2,0.2,0.16)));
 float sl=abs(fract(w.y/0.115)-0.5)*0.115;
 wc=max(wc,-max(sl-0.007,0.215-max(abs(w.x)-0.0,abs(w.z)+0.04)));
 res=U(res,vec2(wc,M_SHELFW));
 return res;}
// the room is built with its walls on the left and back, then mirrored so the light falls into it
vec2 roomMap(vec3 p){
 float fl=sdRoundBox(p-vec3(-0.03,-0.07,-0.26),vec3(1.29,0.07,1.06),0.02);
 vec2 res=vec2(fl,M_CFLOOR);
 float wl=sdRoundBox(p-vec3(-1.27,0.85,-0.26),vec3(0.07,0.85,1.06),0.02);
 wl=min(wl,sdRoundBox(p-vec3(-0.03,0.85,-1.27),vec3(1.29,0.85,0.07),0.02));
 // small cellar window up in the back wall
 vec3 wq=p-vec3(0.62,1.48,-1.2);
 wl=max(wl,-sdBox(wq,vec3(0.2,0.11,0.2)));
 res=U(res,vec2(wl,M_STONE));
 res=U(res,vec2(sdBox(wq+vec3(0.0,0.0,0.03),vec3(0.2,0.11,0.01)),M_DIMSKY));
 float bars=sdBox(vec3(abs(abs(wq.x)-0.07)-0.0,wq.y,wq.z),vec3(0.012,0.11,0.012));
 bars=min(bars,sdBox(vec3(abs(wq.x)-0.14,wq.y,wq.z),vec3(0.012,0.11,0.012)));
 res=U(res,vec2(bars,M_CHARCOAL));
 // concrete caps on the walls
 float tr=sdRoundBox(p-vec3(-1.27,1.73,-0.26),vec3(0.09,0.035,1.08),0.02);
 tr=min(tr,sdRoundBox(p-vec3(-0.03,1.73,-1.27),vec3(1.31,0.035,0.09),0.02));
 res=U(res,vec2(tr,148.0));
 // joist end with a hanging bulb
 float jo=sdRoundBox(p-vec3(-0.15,1.62,-0.95),vec3(0.07,0.07,0.28),0.02);
 res=U(res,vec2(jo,M_SHELFW));
 res=U(res,vec2(sdCapsule(p,vec3(-0.15,1.55,-0.8),vec3(-0.15,1.22,-0.8),0.012),M_DARK));
 res=U(res,vec2(sdCylY(p-vec3(-0.15,1.2,-0.8),0.035,0.04,0.01),M_BRASS));
 res=U(res,vec2(length(p-vec3(-0.15,1.1,-0.8))-0.075,M_BULB));
 float b=sdBox(p-vec3(-0.92,0.9,-0.5),vec3(0.36,1.1,0.95));
 res=U(res,b>0.1?vec2(b,0.0):stairs(p));
 b=sdBox(p-vec3(0.62,0.7,-1.0),vec3(0.55,0.75,0.24));
 res=U(res,b>0.1?vec2(b,0.0):shelf(p));
 b=min(sdBox(p-vec3(0.45,0.22,-0.32),vec3(0.4,0.24,0.34)),sdBox(p-vec3(-0.25,0.18,-0.95),vec3(0.32,0.2,0.3)));
 res=U(res,b>0.1?vec2(b,0.0):crates(p));
 return res;
}
vec2 objectMap(vec3 p){return roomMap(vec3(-p.x,p.y,p.z));}`},
};
