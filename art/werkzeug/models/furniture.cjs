// Shader models for the Nesne Kasası: furniture (bed, stool, mattress, shelf, wardrobe, armchair, sofa, chair, table, chest).
module.exports={
 "bett":{view:{"cam":[3.2,3.5,6.9],"target":[0.3,0.05,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.12)*q.xz;q.y+=0.75;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);
 // posts stand upright, head and foot boards run along z, side rails along x
 if(abs(abs(q.x)-1.18)<0.11&&abs(abs(q.z)-0.68)<0.11)return q;
 if(abs(abs(q.x)-1.18)<0.11)return vec3(q.x,q.z,q.y);
 return vec3(q.z,q.x,q.y);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 s=vec3(q.x,q.y,abs(q.z));
 // corner posts with round knobs: tall at the head (x<0), short at the foot
 float headPost=sdRoundBox(s-vec3(-1.18,0.74,0.68),vec3(0.09,0.74,0.09),0.04);
 float footPost=sdRoundBox(s-vec3(1.18,0.44,0.68),vec3(0.09,0.44,0.09),0.04);
 float knobs=min(length(s-vec3(-1.18,1.55,0.68))-0.12,length(s-vec3(1.18,0.94,0.68))-0.12);
 float wood=min(min(headPost,footPost),knobs);
 // headboard: chunky top rail and three planks
 wood=min(wood,sdRoundBox(q-vec3(-1.18,1.36,0),vec3(0.075,0.09,0.62),0.05));
 float py=q.y-(0.62+0.22*clamp(round((q.y-0.62)/0.22),0.0,2.0));
 wood=min(wood,sdRoundBox(vec3(q.x+1.18,py,q.z),vec3(0.045,0.095,0.6),0.035));
 // footboard: one plank and a top rail
 wood=min(wood,sdRoundBox(q-vec3(1.18,0.66,0),vec3(0.07,0.07,0.62),0.045));
 wood=min(wood,sdRoundBox(q-vec3(1.18,0.46,0),vec3(0.045,0.1,0.6),0.035));
 // side rails
 wood=min(wood,sdRoundBox(s-vec3(0,0.36,0.68),vec3(1.12,0.1,0.05),0.035));
 vec2 res=vec2(wood,M_WOOD);
 // mattress
 res=U(res,vec2(sdRoundBox(q-vec3(-0.02,0.6,0),vec3(1.06,0.13,0.6),0.1),M_WHITE));
 // pillow leaning against the headboard
 vec3 pq=q-vec3(-0.84,0.84,0);pq.xy=rot(0.35)*pq.xy;
 float pillow=sdRoundBox(pq,vec3(0.16,0.04,0.44),0.06);
 pillow=smin(pillow,sdEllipsoid(pq,vec3(0.24,0.11,0.48)),0.06);
 res=U(res,vec2(pillow,M_WHITE));
 // teal blanket draped over mattress and side rails, with soft folds
 vec3 b=q-vec3(0.29,0.55,0);
 float blanket=sdRoundBox(b,vec3(0.78,0.24,0.76),0.09);
 blanket+=0.018*sin(q.x*10.0+0.6)*smoothstep(0.55,0.75,abs(q.z))*smoothstep(0.75,0.4,q.y);
 res=U(res,vec2(blanket,M_VELVET));
 // white sheet folded back over the top edge of the blanket
 float fold=sdRoundBox(q-vec3(-0.4,0.79,0),vec3(0.13,0.035,0.775),0.035);
 res=U(res,vec2(fold,M_WHITE));
 return res;
}`},
 "hocker":{view:{"cam":[0.8,2.6,6.0],"target":[0,0,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.45)*q.xz;q.y+=0.6;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return q.y>0.98?vec3(q.z,q.x,q.y):q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // round seat with a soft rim
 float seat=sdCylY(q-vec3(0,1.1,0),0.1,0.64,0.07);
 // four splayed legs (mirrored into one quadrant)
 vec3 s=vec3(abs(q.x),q.y,abs(q.z));
 float leg=sdRoundCone(s,vec3(0.43,0.0,0.43),vec3(0.27,1.05,0.27),0.075,0.085);
 // stretchers: front/back pair lower than the side pair
 float r1=sdCapsule(s,vec3(0.0,0.4,0.369),vec3(0.369,0.4,0.369),0.042);
 float r2=sdCapsule(s,vec3(0.35,0.55,0.0),vec3(0.35,0.55,0.35),0.042);
 float d=min(min(seat,leg),min(r1,r2));
 return vec2(d,M_WOOD);
}`},
 "matratze":{view:{"cam":[2.0,4.9,7.6],"target":[0.3,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.42)*q.xz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 vec3 q=local(p);
 if(m==100.0){ // side band: white ticking with fine pale blue stripes
  float s=0.5+0.5*cos((q.x+q.z)*110.0);
  t.alb=srgb2lin(mix(vec3(0.95,0.95,0.94),vec3(0.70,0.80,0.90),smoothstep(0.75,0.95,s)));t.rough=0.75;t.spec=0.15;t.sss=0.2;return true;}
 if(m==101.0){t.alb=srgb2lin(vec3(0.55,0.68,0.84));t.rough=0.5;t.spec=0.3;return true;} // piping and buttons
 if(m==102.0){t.alb=srgb2lin(vec3(0.97,0.97,0.96));t.rough=0.8;t.spec=0.12;t.sss=0.35;return true;} // quilted top
 return false;}
float rrect(vec2 p,vec2 b,float r){vec2 d=abs(p)-b+r;return length(max(d,0.0))+min(max(d.x,d.y),0.0)-r;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // side band
 float band=sdRoundBox(q-vec3(0,-0.1,0),vec3(1.2,0.23,0.85),0.06);
 vec2 res=vec2(band,100.0);
 // quilted pillow top: puffy squares between stitched seams
 vec2 cs=vec2(0.295,0.2767);
 vec2 f=fract(q.xz/cs)-0.5;
 float puff=(1.0-4.0*f.x*f.x)*(1.0-4.0*f.y*f.y);
 float edge=smoothstep(0.0,0.12,1.18-abs(q.x))*smoothstep(0.0,0.12,0.83-abs(q.z));
 float top=sdRoundBox(q-vec3(0,0.15,0),vec3(1.18,0.09,0.83),0.09);
 top-=0.055*puff*edge*smoothstep(0.12,0.22,q.y);
 res=U(res,vec2(top*0.7,102.0));
 // tufting buttons at the seam crossings
 vec2 id=clamp(round(q.xz/cs),vec2(-3.0,-2.0),vec2(3.0,2.0));
 vec3 bq=vec3(q.x-id.x*cs.x,q.y-0.235,q.z-id.y*cs.y);
 res=U(res,vec2(sdEllipsoid(bq,vec3(0.035,0.02,0.035)),101.0));
 // piping around the top and bottom edges
 float rr=rrect(q.xz,vec2(1.2,0.85),0.06);
 float pipe=min(length(vec2(rr,q.y-0.12))-0.028,length(vec2(rr,q.y+0.33))-0.028);
 res=U(res,vec2(pipe,101.0));
 return res;
}`},
 "regal":{view:{"cam":[2.4,2.6,7.6],"target":[0.5,0.05,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
#define HAS_RATTAN
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.12)*q.xz;q.y+=1.32;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);
 if(abs(q.x)>0.67||q.z<-0.235)return q;
 return vec3(q.z,q.x,q.y);}
float objectRattanCoord(vec3 p){vec3 q=local(p);return q.y*1.2+0.057*step(0.0,sin((q.x+q.z)*40.0));} // basket weave
float h1(float x){return fract(sin(x*12.9898)*43758.5453);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m<100.0||m>107.5)return false;
 int i=int(m-99.5);
 vec3 c=vec3(0.88,0.20,0.18);
 if(i==1)c=vec3(0.20,0.46,0.88);
 if(i==2)c=vec3(1.00,0.76,0.15);
 if(i==3)c=vec3(0.10,0.60,0.60);
 if(i==4)c=vec3(0.98,0.55,0.16);
 if(i==5)c=vec3(0.58,0.38,0.82);
 if(i==6)c=vec3(0.36,0.70,0.30);
 if(i==7)c=vec3(0.16,0.25,0.50);
 t.alb=srgb2lin(c);t.rough=0.35;t.spec=0.5;return true;}
// one upright book of a row
vec2 book(vec3 q,float x0,float w,float yf,float seed,float id){
 float h=0.3+0.12*h1(id*1.37+seed);
 float dz=0.15+0.03*h1(id*2.11+seed*1.7);
 float cx=x0+(id+0.5)*w;
 float d=sdRoundBox(q-vec3(cx,yf+h*0.5,0.12-dz),vec3(w*0.5-0.008,h*0.5,dz),0.018);
 return vec2(d,100.0+floor(h1(id*3.3+seed*2.9)*7.99));}
// a row of n books standing on the floor yf, starting at x0 (two nearest cells checked)
vec2 bookRow(vec3 q,float x0,float n,float w,float yf,float seed){
 float u=(q.x-x0)/w-0.5;
 float id=clamp(round(u),0.0,n-1.0);
 float id2=clamp(id+(u>id?1.0:-1.0),0.0,n-1.0);
 return U(book(q,x0,w,yf,seed,id),book(q,x0,w,yf,seed,id2));}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // frame: sides, top, plinth, back panel and shelves
 float wood=sdRoundBox(vec3(abs(q.x)-0.74,q.y-1.3,q.z),vec3(0.06,1.3,0.3),0.025);
 wood=min(wood,sdRoundBox(q-vec3(0,2.56,0.0),vec3(0.83,0.05,0.32),0.03));
 wood=min(wood,sdRoundBox(q-vec3(0,0.09,0.0),vec3(0.7,0.09,0.27),0.02));

 float sy=q.y-0.17-0.6*clamp(round((q.y-0.17)/0.6),0.0,3.0);
 wood=min(wood,sdRoundBox(vec3(q.x,sy,q.z),vec3(0.7,0.035,0.29),0.015));
 vec2 res=vec2(wood,M_WOOD);
 // darker back panel makes the open shelves read as deep
 res=U(res,vec2(sdRoundBox(q-vec3(0,1.3,-0.265),vec3(0.7,1.28,0.025),0.01),M_DARKWOOD));
 // books
 res=U(res,bookRow(q,-0.66,6.0,0.11,2.005,1.0));
 res=U(res,bookRow(q,-0.66,9.0,0.11,1.405,2.0));
 res=U(res,bookRow(q,0.0,6.0,0.11,0.805,3.0));
 // stack of lying books
 for(int i=0;i<3;i++){float fi=float(i);
  float d=sdRoundBox(q-vec3(-0.36+0.03*sin(fi*2.0),0.85+fi*0.09,-0.02),vec3(0.26-0.02*fi,0.04,0.17),0.015);
  res=U(res,vec2(d,i==0?101.0:(i==1?104.0:106.0)));}
 res=U(res,vec2(sdRoundBox(q-vec3(0.555,1.445,-0.02),vec3(0.1,0.04,0.15),0.015),102.0));
 // small plant in a pot on the top shelf
 vec3 pp=q-vec3(0.38,2.005,-0.03);
 float pot=sdCappedCone(pp-vec3(0,0.1,0),0.1,0.1,0.13);
 pot=min(pot,sdTorus(pp-vec3(0,0.2,0),vec2(0.13,0.025)));
 res=U(res,vec2(pot,M_TERRA));
 float bush=length(pp-vec3(0,0.31,0))-0.12;
 bush=smin(bush,length(pp-vec3(-0.11,0.28,0.03))-0.09,0.05);
 bush=smin(bush,length(pp-vec3(0.11,0.29,-0.02))-0.09,0.05);
 bush=smin(bush,length(pp-vec3(0.02,0.38,0.06))-0.08,0.05);
 bush=smin(bush,length(pp-vec3(-0.03,0.27,0.11))-0.08,0.05);
 res=U(res,vec2(bush,M_LEAF));
 // storage box with lid and a woven basket on the bottom shelf
 float box=sdRoundBox(q-vec3(-0.35,0.37,-0.02),vec3(0.27,0.16,0.21),0.03);
 res=U(res,vec2(box,M_MINT));
 float lid=sdRoundBox(q-vec3(-0.35,0.54,-0.02),vec3(0.285,0.03,0.225),0.02);
 res=U(res,vec2(lid,M_MINT));
 vec3 bq=q-vec3(0.36,0.36,-0.02);
 float basket=sdRoundBox(bq,vec3(0.26,0.155,0.2),0.05);
 basket=max(basket,-sdRoundBox(bq-vec3(0,0.1,0),vec3(0.22,0.16,0.16),0.04));
 basket=min(basket,sdRoundBox(bq-vec3(0,0.145,0),vec3(0.265,0.025,0.205),0.025));
 res=U(res,vec2(basket,M_RATTAN));
 return res;
}`},
 "schrank":{view:{"cam":[-1.7,2.2,6.4],"target":[0,0.05,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.y+=1.32;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);
 if(q.y>2.38||q.y<0.24)return vec3(q.z,q.x,q.y);
 return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 s=vec3(abs(q.x),q.y,q.z);
 // carcass
 float wood=sdRoundBox(q-vec3(0,1.32,0),vec3(0.82,1.1,0.38),0.03);
 // crown moulding in two steps
 wood=min(wood,sdRoundBox(q-vec3(0,2.56,0.02),vec3(0.93,0.07,0.47),0.035));
 wood=min(wood,sdRoundBox(q-vec3(0,2.45,0.01),vec3(0.87,0.05,0.42),0.03));
 // plinth and bun feet
 wood=min(wood,sdRoundBox(q-vec3(0,0.15,0.02),vec3(0.9,0.07,0.45),0.03));
 wood=min(wood,sdEllipsoid(s-vec3(0.76,0.06,0.0)-vec3(0,0,sign(q.z)*0.36),vec3(0.1,0.08,0.1)));
 // two doors with raised panels
 vec3 dq=vec3(s.x-0.4,q.y,q.z);
 wood=min(wood,sdRoundBox(dq-vec3(0,1.31,0.39),vec3(0.385,1.07,0.03),0.02));
 wood=min(wood,sdRoundBox(dq-vec3(0,1.68,0.42),vec3(0.27,0.56,0.02),0.03));
 wood=min(wood,sdRoundBox(dq-vec3(0,0.67,0.42),vec3(0.27,0.3,0.02),0.03));
 vec2 res=vec2(wood,M_WOOD);
 // handles near the middle seam
 float hd=sdCapsule(s,vec3(0.1,1.12,0.48),vec3(0.1,1.42,0.48),0.025);
 hd=min(hd,sdCapsule(s,vec3(0.1,1.14,0.42),vec3(0.1,1.14,0.48),0.018));
 hd=min(hd,sdCapsule(s,vec3(0.1,1.40,0.42),vec3(0.1,1.40,0.48),0.018));
 res=U(res,vec2(hd,M_CHARCOAL));
 return res;
}`},
 "sessel":{view:{"cam":[-1.3,2.3,6.2],"target":[0,0.0,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.1)*q.xz;q.y+=0.85;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 s=vec3(abs(q.x),q.y,q.z);
 // frame: base, arms with rolled tops and the back
 float base=sdRoundBox(q-vec3(0,0.48,0.0),vec3(0.9,0.24,0.72),0.12);
 float arm=sdRoundBox(s-vec3(0.8,0.72,0.0),vec3(0.17,0.34,0.72),0.12);
 float roll=sdCapsule(s,vec3(0.86,1.04,-0.55),vec3(0.86,1.04,0.64),0.2);
 float back=sdRoundBox(q-vec3(0,1.2,-0.56),vec3(0.82,0.52,0.17),0.16);
 float body=smin(smin(base,arm,0.05),smin(roll,back,0.05),0.05);
 vec2 res=vec2(body,M_SAGE);
 // seat and back cushions
 res=U(res,vec2(sdRoundBox(q-vec3(0,0.82,0.14),vec3(0.62,0.11,0.56),0.1),M_SAGE));
 res=U(res,vec2(sdRoundBox(q-vec3(0,1.18,-0.3),vec3(0.6,0.36,0.12),0.12),M_SAGE));
 // short wooden legs
 vec3 l=vec3(abs(q.x),q.y,abs(q.z));
 res=U(res,vec2(sdRoundCone(l,vec3(0.72,0.03,0.58),vec3(0.72,0.28,0.58),0.05,0.07),M_WOOD));
 return res;
}`},
 "sofa":{view:{"cam":[1.8,3.2,10.2],"target":[0.4,0.0,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.08)*q.xz;q.y+=0.75;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 s=vec3(abs(q.x),q.y,q.z);
 // frame: base, rolled arms and back
 float base=sdRoundBox(q-vec3(0,0.46,0.0),vec3(1.55,0.22,0.66),0.12);
 float arm=sdRoundBox(s-vec3(1.47,0.68,0.0),vec3(0.16,0.32,0.66),0.12);
 float roll=sdCapsule(s,vec3(1.52,0.98,-0.5),vec3(1.52,0.98,0.58),0.18);
 float back=sdRoundBox(q-vec3(0,1.06,-0.52),vec3(1.5,0.42,0.15),0.15);
 float body=smin(smin(base,arm,0.05),smin(roll,back,0.05),0.05);
 vec2 res=vec2(body,M_VELVET);
 // three seat cushions and three back cushions
 float cx=q.x-0.9*clamp(round(q.x/0.9),-1.0,1.0);
 res=U(res,vec2(sdRoundBox(vec3(cx,q.y-0.78,q.z-0.12),vec3(0.43,0.1,0.52),0.1),M_VELVET));
 vec3 bc=vec3(cx,q.y-1.08,q.z+0.29);bc.yz=rot(-0.12)*bc.yz;
 res=U(res,vec2(sdRoundBox(bc,vec3(0.42,0.3,0.1),0.11),M_VELVET));
 // throw pillows at both ends
 vec3 t=s-vec3(1.05,1.12,-0.08);t.xy=rot(-0.25)*t.xy;t.yz=rot(-0.3)*t.yz;
 res=U(res,vec2(sdRoundBox(t,vec3(0.2,0.2,0.05),0.08),M_VELVET));
 // short wooden legs
 vec3 l=vec3(abs(q.x),q.y,abs(q.z));
 res=U(res,vec2(sdRoundCone(l,vec3(1.38,0.03,0.52),vec3(1.38,0.26,0.52),0.05,0.07),M_WOOD));
 return res;
}`},
 "stuhl":{view:{"cam":[0.4,2.6,6.2],"target":[0,0.05,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.7)*q.xz;q.y+=1.05;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);
 if(abs(q.y-0.9)<0.1&&abs(q.x)<0.3)return vec3(q.x,q.z,q.y);
 return q;}
float zb(float y){return -0.36-0.122*(y-0.9);} // backrest plane leans back
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 s=vec3(abs(q.x),q.y,q.z);
 // seat
 float wood=sdRoundBox(q-vec3(0,0.9,0.02),vec3(0.48,0.055,0.46),0.05);
 // legs; the back legs go on up as the posts of the backrest
 wood=min(wood,sdRoundCone(s,vec3(0.38,0.0,0.36),vec3(0.38,0.86,0.36),0.055,0.07));
 wood=min(wood,sdRoundCone(s,vec3(0.38,0.0,-0.33),vec3(0.38,0.9,-0.36),0.055,0.07));
 wood=min(wood,sdRoundCone(s,vec3(0.38,0.9,-0.36),vec3(0.37,2.05,-0.5),0.07,0.06));
 // stretchers
 wood=min(wood,sdCapsule(s,vec3(0.38,0.32,0.34),vec3(0.38,0.32,-0.33),0.032));
 wood=min(wood,sdCapsule(s,vec3(0.0,0.42,0.36),vec3(0.38,0.42,0.36),0.032));
 // backrest: curved top rail, lower rail and four spindles
 vec3 b=vec3(q.x,q.y,q.z-zb(q.y));
 b.z+=0.06*(q.x*q.x/0.16);
 wood=min(wood,sdRoundBox(b-vec3(0,1.93,0),vec3(0.4,0.11,0.04),0.04));
 wood=min(wood,sdRoundBox(b-vec3(0,1.2,0),vec3(0.38,0.045,0.03),0.025));
 float cx=q.x-(-0.24+0.16*clamp(round((q.x+0.24)/0.16),0.0,3.0));
 wood=min(wood,sdRoundBox(vec3(cx,b.y-1.55,b.z),vec3(0.03,0.36,0.025),0.022));
 return vec2(wood*0.9,M_WOOD);
}`},
 "tisch":{view:{"cam":[2.4,3.4,6.4],"target":[0.45,0.0,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.1)*q.xz;q.y+=0.65;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);
 if(q.y>1.12)return vec3(q.z,q.x,q.y)*0.8;
 return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 s=vec3(abs(q.x),q.y,abs(q.z));
 float wood=sdRoundBox(q-vec3(0,1.2,0),vec3(1.2,0.07,0.68),0.05);
 wood=min(wood,sdRoundBox(q-vec3(0,1.04,0),vec3(0.93,0.1,0.45),0.025));
 // tapered square legs
 float lw=mix(0.07,0.1,clamp(q.y/1.13,0.0,1.0));
 wood=min(wood,sdRoundBox(s-vec3(0.96,0.565,0.48),vec3(lw,0.565,lw),0.03));
 return vec2(wood,M_WOOD);
}`},
 "truhe":{view:{"cam":[-2.1,2.5,5.6],"target":[0,0.0,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.y+=0.65;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.z,q.x,q.y);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.30,0.31,0.34));t.metal=1.0;t.rough=0.4;return true;} // iron bands
 return false;}
float chest(vec3 q){
 float body=sdRoundBox(q-vec3(0,0.43,0),vec3(1.0,0.43,0.6),0.04);
 vec3 l=q-vec3(0,0.86,0);
 float lid=(length(vec2(l.z/0.62,l.y/0.4))-1.0)*0.4;
 lid=smax(lid,-l.y,0.02);
 lid=smax(lid,abs(l.x)-1.02,0.04);
 return min(body,lid);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float c=chest(q);
 // plank seams on the body and on the lid
 float seam=abs(fract(q.y/0.215)-0.5)*0.215;
 float ang=atan(q.y-0.86,q.z);
 float lseam=abs(fract(ang/0.52)-0.5)*0.52*0.5;
 float g=q.y<0.86?seam:lseam;
 float wood=c+0.01*smoothstep(0.02,0.0,g);
 // dark seam between lid and body
 wood=max(wood,-(abs(q.y-0.86)-0.012));
 vec2 res=vec2(wood*0.9,M_DARKWOOD);
 // iron bands: over the lid, around the corners and along the lid edge
 float shell=abs(c)-0.025;
 float mask=abs(abs(q.x)-0.62)-0.07;
 mask=min(mask,max(max(0.86-abs(q.x),0.46-abs(q.z)),q.y-0.86));
 mask=min(mask,max(abs(q.y-0.93)-0.05,0.0));
 float bands=max(shell,mask);
 res=U(res,vec2(bands,100.0));
 // brass lock plate with a dark keyhole
 float plate=sdRoundBox(q-vec3(0,0.78,0.62),vec3(0.13,0.16,0.025),0.03);
 float hasp=sdRoundBox(q-vec3(0,0.98,0.63),vec3(0.06,0.1,0.02),0.02);
 res=U(res,vec2(min(plate,hasp),M_BRASS));
 vec2 kh=q.xy-vec2(0,0.76);
 float key=min(length(kh-vec2(0,0.03))-0.028,sdBox(vec3(kh-vec2(0,-0.03),0),vec3(0.012,0.05,1.0)));
 key=max(key,abs(q.z-0.65)-0.008);
 res=U(res,vec2(key,M_DARK));
 // ring handles on the sides
 vec3 h=vec3(abs(q.x)-1.07,q.y-0.52,q.z);
 res=U(res,vec2(sdTorus(vec3(h.z,h.x,h.y),vec2(0.11,0.025)),100.0));
 return res;
}`},
};
