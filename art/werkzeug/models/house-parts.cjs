// Shader models for the Nesne Kasası: parts of a house (window, front door, wall, stairs, brick, antenna, gutter, downpipe).
module.exports={
 "fenster":{view:{"cam":[-2.2,1.4,8.2],"target":[0.15,-0.08,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
// wooden window in the xy plane, glass facing +z
const float FX=1.12; // outer frame half width
const float FY=0.92; // outer frame half height
const float FT=0.15; // outer frame member width
const float CW=0.485; // casement half width (two casements side by side)
const float CH=0.77; // casement half height
const float CT=0.1; // casement member width
const float BY=0.12; // height of the horizontal glazing bar
vec2 casementLocal(vec3 p){return vec2(p.x-sign(p.x)*CW,p.y);}
vec3 objectWoodSpace(vec3 p){
 // grain runs along each frame member
 bool hor=false;
 if(p.y<-FY+0.015)hor=true; // sill and the bottom of the frame
 else if(abs(p.x)<FX-FT&&abs(p.y)>FY-FT)hor=true;
 else{vec2 c=casementLocal(p);
  if(abs(c.x)<CW-CT&&abs(c.y)>CH-CT)hor=true;
  if(abs(c.y-BY)<0.045&&abs(c.x)>0.04&&abs(p.x)<FX-FT)hor=true;}
 return hor?vec3(p.y,p.x,p.z):p;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  // sky-blue glass with two soft diagonal reflection streaks
  vec2 c=casementLocal(p);
  float k=c.x*0.9+c.y;
  float s=smoothstep(0.03,0.0,abs(k+0.05)-0.07)+0.7*smoothstep(0.02,0.0,abs(k-0.28)-0.025);
  vec3 col=mix(srgb2lin(vec3(0.52,0.78,0.97)),srgb2lin(vec3(0.70,0.88,1.0)),clamp(0.5+c.y*0.6,0.0,1.0));
  col=mix(col,srgb2lin(vec3(0.95,0.98,1.0)),clamp(s,0.0,1.0)*0.7);
  t.alb=col;t.rough=0.08;t.spec=1.0;return true;}
 return false;}
vec2 objectMap(vec3 p){
 // outer frame
 float outer=sdRoundBox(p,vec3(FX,FY,0.14),0.04);
 float hole=sdBox(p,vec3(FX-FT,FY-FT,0.3));
 vec2 res=vec2(max(outer,-hole),M_WOOD);
 // two casements, recessed a little behind the frame
 vec2 cl=casementLocal(p);
 vec3 c=vec3(cl,p.z-0.02);
 float cas=sdRoundBox(c,vec3(CW-0.012,CH,0.07),0.025);
 float pane=sdBox(c,vec3(CW-0.012-CT,CH-CT,0.2));
 cas=max(cas,-pane);
 // glazing bars (a cross in each casement)
 float bars=min(sdRoundBox(c,vec3(0.035,CH-0.02,0.045),0.015),sdRoundBox(c-vec3(0,BY,0),vec3(CW-0.03,0.035,0.045),0.015));
 res=U(res,vec2(min(cas,bars),M_WOOD));
 // glass
 float glass=sdBox(c-vec3(0,0,-0.01),vec3(CW-0.06,CH-0.06,0.012));
 res=U(res,vec2(glass,100.0));
 // window sill
 float sill=sdRoundBox(p-vec3(0,-FY-0.045,0.13),vec3(FX+0.17,0.055,0.28),0.03);
 res=U(res,vec2(sill,M_WOOD));
 // window handle on the right casement
 vec3 h=p-vec3(0.065,0.0,0.0);
 float plate=sdRoundBox(h-vec3(0,0.02,0.1),vec3(0.03,0.075,0.02),0.015);
 float lever=sdCapsule(h,vec3(0,0.0,0.13),vec3(0,-0.24,0.16),0.026);
 lever=smin(lever,length(h-vec3(0,0,0.13))-0.04,0.02);
 res=U(res,vec2(min(plate,lever),M_STEEL));
 return res;
}`},
 "haustuer":{view:{"cam":[2.2,1.5,8.8],"target":[0.1,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
// front door in the xy plane facing +z, with a stone surround, a step and a potted plant
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  float k=(p.x+0.0)*1.2+(p.y-0.6);
  float s=smoothstep(0.03,0.0,abs(k+0.05)-0.05)+0.6*smoothstep(0.02,0.0,abs(k-0.22)-0.02);
  vec3 col=mix(srgb2lin(vec3(0.52,0.78,0.97)),srgb2lin(vec3(0.95,0.98,1.0)),clamp(s,0.0,1.0)*0.7);
  t.alb=col;t.rough=0.08;t.spec=1.0;return true;}
 return false;}
vec2 objectMap(vec3 p){
 // stone surround (U shape) and a top cornice
 float sur=sdRoundBox(p-vec3(0,0.05,0),vec3(0.9,1.38,0.15),0.04);
 float open=sdBox(p-vec3(0,-0.1,0),vec3(0.63,1.28,0.4));
 sur=max(sur,-open);
 float top=sdRoundBox(p-vec3(0,1.46,0.02),vec3(0.99,0.07,0.2),0.03);
 vec2 res=vec2(min(sur,top),M_CREAM);
 // door leaf
 vec3 d=p-vec3(0,-0.12,-0.04);
 float leaf=sdRoundBox(d,vec3(0.61,1.26,0.06),0.025);
 // grooved panel in the lower half
 vec2 g=abs(d.xy-vec2(0,-0.55))-vec2(0.36,0.5);
 float groove=abs(length(max(g,0.0))+min(max(g.x,g.y),0.0))-0.02;
 leaf=smax(leaf,-max(groove,abs(d.z-0.06)-0.03),0.01);
 // glass window in the upper half
 vec3 w=d-vec3(0,0.62,0);
 leaf=smax(leaf,-sdBox(w-vec3(0,0,0.06),vec3(0.17,0.36,0.06)),0.01);
 res=U(res,vec2(leaf,M_TEAL));
 float glass=sdBox(w,vec3(0.18,0.37,0.01));
 res=U(res,vec2(glass,100.0));
 // white trim and glazing grid
 vec2 tb=abs(w.xy)-vec2(0.17,0.36);
 float trim=max(abs(length(max(tb,0.0))+min(max(tb.x,tb.y),0.0))-0.025,abs(w.z-0.035)-0.03);
 float grid=min(sdBox(w-vec3(0,0,0.015),vec3(0.012,0.36,0.012)),sdBox(vec3(w.x,abs(w.y)-0.12,w.z-0.015),vec3(0.17,0.012,0.012)));
 res=U(res,vec2(min(trim,grid),M_WHITE));
 // lever handle with a back plate and a key hole
 vec3 h=p-vec3(0.47,-0.1,0.02);
 float plate=sdRoundBox(h-vec3(0,-0.05,0),vec3(0.045,0.2,0.02),0.018);
 float lever=sdCapsule(h,vec3(0,0.05,0.0),vec3(0,0.05,0.1),0.028);
 lever=smin(lever,sdCapsule(h,vec3(0,0.05,0.1),vec3(-0.2,0.05,0.11),0.03),0.03);
 res=U(res,vec2(min(plate,lever),M_STEEL));
 float key=sdBox(h-vec3(0,-0.17,0.02),vec3(0.012,0.03,0.01));
 res=U(res,vec2(key,M_DARK));
 // door step
 float step=sdRoundBox(p-vec3(0.17,-1.45,0.24),vec3(1.22,0.1,0.4),0.03);
 res=U(res,vec2(step,M_CONCRETE));
 // small potted plant beside the door
 vec3 q=p-vec3(1.08,-1.35,0.34);
 float pot=sdCappedCone(q-vec3(0,0.16,0),0.16,0.12,0.16);
 pot=min(pot,sdTorus(q-vec3(0,0.31,0),vec2(0.16,0.025)));
 res=U(res,vec2(pot,M_TERRA));
 float bush=1e9;
 // round shrub: a ball with leafy bumps
 vec3 bc=vec3(0,0.56,0);
 bush=length(q-bc)-0.17;
 for(int i=0;i<10;i++){float fi=float(i);float z=1.0-fi/9.0*1.4;float rr=sqrt(max(1.0-z*z,0.0));float a=fi*2.39996;
  vec3 dir=vec3(cos(a)*rr,z,sin(a)*rr);
  bush=smin(bush,length(q-bc-dir*0.15)-0.085,0.03);}
 res=U(res,vec2(bush,M_LEAF));
 return res;
}`},
 "mauer":{view:{"cam":[-3.1,2.3,7.4],"target":[0.1,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
// a section of brick wall: running bond, light mortar joints
const float PW=0.475; // brick pitch along the wall
const float PH=0.205; // course height
const float HX=1.17;  // wall half length
const float HZ=0.2;   // wall half thickness
// brick cell in course j: centre x and half length
vec2 brickCell(float x,float j){
 if(mod(j,2.0)<0.5){float i=clamp(round(x/PW),-2.0,2.0);return vec2(i*PW,PW*0.5-0.018);}
 float i=clamp(round(x/PW-0.5),-3.0,2.0);float cx=(i+0.5)*PW;
 if(abs(cx)>1.0)return vec2(sign(cx)*(HX+0.968)*0.5,(HX-0.968)*0.5);
 return vec2(cx,PW*0.5-0.018);}
float course(vec3 p,float j){
 vec2 c=brickCell(p.x,j);
 float h=hash31(vec3(c.x*7.0,j,1.3));
 vec3 q=vec3(p.x-c.x,p.y-(j-3.5)*PH,p.z-(h-0.5)*0.02);
 return sdRoundBox(q,vec3(c.y,PH*0.5-0.018,HZ),0.035);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  float j=clamp(round(p.y/PH+3.5),0.0,7.0);
  vec2 c=brickCell(p.x,j);
  float h=hash31(vec3(c.x*7.0,j,4.1));
  vec3 base=mix(vec3(0.80,0.35,0.22),vec3(0.66,0.25,0.17),h);
  if(h>0.9)base=vec3(0.84,0.42,0.25);
  base*=0.88+0.22*fbm(p*12.0);
  t.alb=srgb2lin(base);t.rough=0.75;t.spec=0.2;return true;}
 if(m==101.0){float s=fbm(p*30.0);t.alb=srgb2lin(mix(vec3(0.94,0.91,0.84),vec3(0.85,0.82,0.75),s));t.rough=0.9;t.spec=0.1;return true;}
 return false;}
vec2 objectMap(vec3 p){
 float u=p.y/PH+3.5;
 float j=clamp(round(u),0.0,7.0);
 float j2=clamp(j+(u>j?1.0:-1.0),0.0,7.0);
 float b=min(course(p,j),course(p,j2));
 // mortar core shows in the joints
 float mortar=sdBox(p,vec3(HX-0.03,4.0*PH-0.03,HZ-0.035));
 vec2 res=vec2(mortar,101.0);
 res=U(res,vec2(b,100.0));
 return res;
}`},
 "treppe":{view:{"cam":[4.9,3.3,6.5],"target":[0,0.0,0],"fov":28},glsl:`
#define HAS_WOOD
// a wooden staircase with six steps and a railing on the open side
const float RH=0.28; // rise
const float RR=0.36; // run
const float W=0.62;  // half width
const float ZR=0.55; // railing line
vec3 local(vec3 p){vec3 q=p;q.x=-q.x;q+=vec3(1.08,1.3,0.0);return q;}
float railY(float x){return (x/RR+1.0)*RH+0.78;}
vec3 objectWoodSpace(vec3 p){
 vec3 q=local(p);
 if(abs(q.z-ZR)<0.09&&q.y>railY(q.x)-0.12){
  // hand rail: grain along the slope
  vec2 dir=normalize(vec2(RR,RH));
  return vec3(dot(q.xy,vec2(-dir.y,dir.x)),dot(q.xy,dir),q.z);}
 if(abs(q.z-ZR)<0.09)return q;
 return vec3(q.z,q.x,q.y);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // white solid body under the steps
 float body=1e9;
 for(int k=0;k<6;k++){float fk=float(k);
  float x0=fk*RR,x1=6.0*RR,y0=0.0,y1=(fk+1.0)*RH-0.06;
  body=min(body,sdBox(q-vec3((x0+x1)*0.5,(y0+y1)*0.5,0),vec3((x1-x0)*0.5,(y1-y0)*0.5,W)));}
 vec2 res=vec2(body-0.01,M_CREAM);
 // wooden treads with a small nosing
 float tread=1e9;
 float k=clamp(floor((q.x+0.06)/RR),0.0,5.0);
 for(int o=-1;o<=1;o++){float kk=clamp(k+float(o),0.0,5.0);
  float x0=kk*RR-0.06,x1=(kk+1.0)*RR;
  tread=min(tread,sdRoundBox(q-vec3((x0+x1)*0.5,(kk+1.0)*RH-0.035,0),vec3((x1-x0)*0.5,0.04,W+0.03),0.025));}
 res=U(res,vec2(tread,M_WOOD));
 // balusters, one on each tread
 float bal=1e9;
 float kb=clamp(round((q.x-RR*0.5)/RR),0.0,5.0);
 for(int o=-1;o<=1;o++){float kk=clamp(kb+float(o),0.0,5.0);float x=kk*RR+RR*0.5;
  bal=min(bal,sdCapsule(q,vec3(x,(kk+1.0)*RH,ZR),vec3(x,railY(x),ZR),0.03));}
 res=U(res,vec2(bal,M_WOOD));
 // newel posts and the hand rail
 float xa=0.1,xb=6.0*RR-0.12;
 float post=sdRoundBox(q-vec3(xa,(railY(xa)+0.08)*0.5,ZR),vec3(0.065,(railY(xa)+0.08)*0.5,0.065),0.02);
 post=min(post,length(q-vec3(xa,railY(xa)+0.15,ZR))-0.085);
 float yb0=6.0*RH;
 post=min(post,sdRoundBox(q-vec3(xb,(yb0+railY(xb)+0.08)*0.5,ZR),vec3(0.06,(railY(xb)+0.08-yb0)*0.5,0.06),0.02));
 post=min(post,length(q-vec3(xb,railY(xb)+0.15,ZR))-0.08);
 float rail=sdCapsule(q,vec3(xa,railY(xa),ZR),vec3(xb,railY(xb),ZR),0.05);
 res=U(res,vec2(min(post,rail),M_DARKWOOD));
 return res;
}`},
 "ziegelstein":{view:{"cam":[2.5,4.3,6.4],"target":[0,-0.05,0],"fov":27},glsl:`
#define HAS_MAT
// one perforated clay brick with a 5 x 3 grid of holes
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.35)*q.xz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  vec3 q=local(p);
  float s=fbm(q*9.0);float sp=noise3(q*45.0);
  vec3 base=mix(vec3(0.80,0.35,0.21),vec3(0.66,0.25,0.15),s);
  base=mix(base,vec3(0.55,0.22,0.14),smoothstep(0.75,0.95,sp)*0.6);
  t.alb=srgb2lin(base);t.rough=0.75;t.spec=0.2;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float brick=sdRoundBox(q,vec3(0.95,0.32,0.46),0.06);
 vec2 c=vec2(q.x-clamp(round(q.x/0.31),-2.0,2.0)*0.31,q.z-clamp(round(q.z/0.26),-1.0,1.0)*0.26);
 vec2 d=abs(c)-vec2(0.095,0.08)+0.025;
 float hole=length(max(d,0.0))+min(max(d.x,d.y),0.0)-0.025;
 brick=smax(brick,-hole,0.02);
 return vec2(brick,100.0);
}`},
 "antenne":{view:{"cam":[1.6,3.4,8.6],"target":[0,-0.2,0],"fov":28},glsl:`
// rooftop TV antenna: two Yagi arrays (boom with many cross rods) on a mast
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.70,0.74,0.80));t.metal=1.0;t.rough=0.25;return true;}
 return false;}
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.8)*q.xz;return q;}
// one Yagi array: boom along x at height y, n directors starting at x0
float yagi(vec3 q,float y,float xr,float xd,float x0,float dx,float n,float l0,float dl,out float box){
 float boom=sdCapsule(q,vec3(xr-0.05,y,0),vec3(x0+dx*(n-1.0)+0.06,y,0),0.05);
 // reflector and dipole
 float el=sdCapsule(q,vec3(xr,y,-l0-0.12),vec3(xr,y,l0+0.12),0.03);
 vec3 r=q-vec3(xd,y,0);
 float dip=min(sdCapsule(r,vec3(0,0,-l0),vec3(0,0,l0),0.03),sdCapsule(r,vec3(0.07,0,-l0),vec3(0.07,0,l0),0.025));
 el=min(el,dip);
 box=sdRoundBox(r-vec3(0.03,0.0,0),vec3(0.07,0.06,0.08),0.025);
 // directors, nearest three only (clamped repetition)
 float i=clamp(round((q.x-x0)/dx),0.0,n-1.0);
 for(int o=-1;o<=1;o++){float ii=clamp(i+float(o),0.0,n-1.0);float x=x0+ii*dx;float l=l0-ii*dl;
  el=min(el,sdCapsule(q,vec3(x,y,-l),vec3(x,y,l),0.028));}
 return min(boom,el);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // mast with a foot plate
 float mast=sdCapsule(q,vec3(0,-1.75,0),vec3(0,1.12,0),0.065);
 float foot=sdCylY(q-vec3(0,-1.8,0),0.04,0.3,0.015);
 foot=min(foot,sdCylY(q-vec3(0,-1.66,0),0.12,0.11,0.02));
 vec2 res=vec2(mast,M_GREY);
 res=U(res,vec2(foot,M_CHARCOAL));
 // clamps where the booms meet the mast
 float clamps=min(sdRoundBox(q-vec3(0,1.0,0),vec3(0.1,0.11,0.1),0.03),sdRoundBox(q-vec3(0,0.25,0),vec3(0.1,0.1,0.1),0.03));
 res=U(res,vec2(clamps,M_CHARCOAL));
 float b1,b2;
 float a1=yagi(q,1.0,-1.35,-1.05,-0.78,0.21,10.0,0.5,0.017,b1);
 float a2=yagi(q-vec3(0.1,0,0),0.25,-0.8,-0.55,-0.3,0.2,5.0,0.36,0.02,b2);
 res=U(res,vec2(min(a1,a2),100.0));
 res=U(res,vec2(min(b1,b2),M_WHITE));
 return res;
}`},
 "regenrinne":{view:{"cam":[-3.4,1.9,7.4],"target":[0.1,0.1,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
// half-round rain gutter hanging under the edge of a tiled roof
const float R=0.3;   // gutter radius
const float GT=0.028; // sheet thickness
const float GL=1.3;  // gutter half length
vec3 objectWoodSpace(vec3 p){return abs(p.x)>GL+0.05?p:vec3(p.y,p.x,p.z);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.80,0.83,0.87));t.metal=1.0;t.rough=0.28;return true;}
 return false;}
// roof frame: u runs down the slope (0 at the lower tile edge), v is the height above the roof plane
vec2 roofUV(vec3 q){vec2 rel=q.yz-vec2(0.4,-0.18);return vec2(dot(rel,vec2(-0.5,0.866)),dot(rel,vec2(0.866,0.5)));}
float tileRow(vec3 q,vec2 uv,float k){
 float tl=0.42;float u1=-k*tl+0.0,u0=u1-tl-0.05;
 float hump=0.07*abs(sin((q.x+k*0.0)*3.14159/0.36));
 float top=0.035+0.06*(uv.x-u0)/(u1-u0)+hump;
 float d=max(max(uv.y-top,-uv.y),max(uv.x-u1,u0-uv.x));
 return max(d,abs(q.x)-GL-0.12)*0.8;}
vec2 objectMap(vec3 p){
 vec3 q=p;
 // gutter: lower half of a thin tube, open ends, rolled bead at the front
 float ring=max(abs(length(q.yz)-R)-GT,q.y);
 float gut=max(ring,abs(q.x)-GL);
 float bead=sdCapsule(q,vec3(-GL,0.0,R+0.015),vec3(GL,0.0,R+0.015),0.045);
 float back=sdBox(q-vec3(0,0.06,-R),vec3(GL,0.06,GT));
 vec2 res=vec2(min(gut,min(bead,back)),100.0);
 // brackets: straps under the gutter, fixed to the fascia board
 float xb=clamp(round(q.x/0.85),-1.0,1.0)*0.85;
 vec3 b=q-vec3(xb,0,0);
 float strap=max(max(abs(length(b.yz)-R-GT-0.018)-0.016,b.y),abs(b.x)-0.045);
 strap=min(strap,sdRoundBox(b-vec3(0,0.13,-R-0.06),vec3(0.045,0.17,0.016),0.01));
 strap=min(strap,sdRoundBox(b-vec3(0,0.0,R+0.03),vec3(0.045,0.03,0.035),0.01));
 res=U(res,vec2(strap,M_STEEL));
 float bolt=length(b-vec3(0,0.22,-R-0.07))-0.028;
 res=U(res,vec2(bolt,M_CHARCOAL));
 // fascia board and the wooden roof body behind it
 float fascia=sdRoundBox(q-vec3(0,0.17,-0.43),vec3(GL+0.08,0.21,0.05),0.02);
 vec2 uv=roofUV(q);
 float body=max(sdBox(q-vec3(0,0.45,-0.85),vec3(GL+0.08,0.45,0.42)),uv.y);
 res=U(res,vec2(min(fascia,body),M_WOOD));
 // two rows of clay pantiles
 float tiles=min(tileRow(q,uv,0.0),tileRow(q,uv,1.0));
 res=U(res,vec2(tiles,M_TERRA));
 return res;
}`},
 "fallrohr":{view:{"cam":[3.6,1.6,10.5],"target":[0,-0.1,0],"fov":28},glsl:`
#define HAS_MAT
// a downpipe on a piece of house wall: gutter at the top, swan neck, straight pipe with clips, outlet bend
const float PX=0.2;   // pipe x position
const float PZ=0.2;   // pipe axis distance from the wall
const float PR=0.115; // pipe radius
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.60,0.64,0.68));t.rough=0.25;t.spec=0.9;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=p;
 // plastered wall with a plinth
 float wall=sdRoundBox(q-vec3(0,-0.15,-0.3),vec3(0.82,1.9,0.3),0.03);
 vec2 res=vec2(wall,M_CREAM);
 float plinth=sdRoundBox(q-vec3(0,-1.86,-0.26),vec3(0.85,0.2,0.32),0.03);
 res=U(res,vec2(plinth,M_CONCRETE));
 // eave: roof tiles on top, fascia board
 vec2 rel=q.yz-vec2(1.92,0.62);
 float u=dot(rel,vec2(-0.3,0.954)),v=dot(rel,vec2(0.954,0.3));
 float hump=0.05*abs(sin(q.x*3.14159/0.3));
 float tiles=max(max(v-0.07-hump,-v-0.02),max(u,-u-1.25));
 tiles=max(tiles,abs(q.x)-0.92)*0.85;
 res=U(res,vec2(tiles,M_TERRA));
 float fascia=sdRoundBox(q-vec3(0,1.82,0.46),vec3(0.9,0.12,0.04),0.015);
 float soffit=sdBox(q-vec3(0,1.8,0.2),vec3(0.88,0.1,0.26));
 res=U(res,vec2(min(fascia,soffit),M_WHITE));
 // short piece of gutter
 vec3 g=q-vec3(0,1.78,0.68);
 float gut=max(max(abs(length(g.yz)-0.17)-0.022,g.y),abs(g.x)-0.9);
 gut=min(gut,sdCapsule(g,vec3(-0.9,0,0.185),vec3(0.9,0,0.185),0.03));
 // swan neck: outlet stub, slanted piece back to the wall
 vec3 a=vec3(PX,1.62,0.68),b=vec3(PX,1.38,0.68),c=vec3(PX,0.92,PZ),d=vec3(PX,0.7,PZ);
 float pipe=sdCapsule(q,a,b,PR*0.9);
 pipe=smin(pipe,sdCapsule(q,b,c,PR),0.06);
 pipe=smin(pipe,sdCapsule(q,c,d,PR),0.06);
 // straight downpipe
 vec3 e=vec3(PX,-1.5,PZ);
 pipe=min(pipe,sdCapsule(q,d,e,PR));
 // outlet bend at the bottom, open end facing forward
 vec3 f=vec3(PX,-1.74,PZ+0.05),h=vec3(PX,-1.86,PZ+0.36);
 float shoe=smin(sdCapsule(q,e,f,PR),sdCapsule(q,f,h,PR),0.07);
 vec3 dir=normalize(h-f);
 shoe=max(shoe,dot(q-h,dir));
 shoe=max(shoe,-(sdCapsule(q,f+dir*0.05,h+dir*0.2,PR-0.025)));
 pipe=min(pipe,shoe);
 res=U(res,vec2(min(gut,pipe),100.0));
 // collars and wall clips
 float clip=1e9;
 vec3 cq=q-vec3(PX,0,PZ);
 float yc=clamp(round((q.y-0.45)/0.85),-2.0,0.0)*0.85+0.45;
 for(int o=-1;o<=1;o++){float yy=clamp(yc+float(o)*0.85,-1.25,0.45);
  vec3 r=cq-vec3(0,yy,0);
  clip=min(clip,max(abs(length(r.xz)-PR-0.012)-0.018,abs(r.y)-0.04));
  clip=min(clip,sdBox(r-vec3(0,0,-PR-0.06),vec3(0.03,0.03,0.06)));}
 float collar=max(abs(length(cq.xz)-PR-0.008)-0.016,abs(q.y-0.66)-0.06);
 res=U(res,vec2(min(clip,collar),M_CHARCOAL));
 return res;
}`},
};
