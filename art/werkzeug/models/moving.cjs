// Shader models for the Nesne Kasası: moving and travel things (box, vans, rope, chain, wheel, umbrella, glasses, magazine, bow and arrow).
module.exports={
 "karton":{view:{"cam":[1.2,4.0,7.2],"target":[0,0.0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.55)*q.xz;q.y+=0.15;return q;}
const vec3 B=vec3(0.78,0.5,0.56);
const float T=0.035;
// one flap, hinge along x at the origin, opening towards +z with elevation a
float flap(vec3 h,float a,float w,float L){
 h.yz=rot(-a)*h.yz;
 return sdRoundBox(h-vec3(0.0,0.0,L*0.5),vec3(w,T*0.5,L*0.5),0.012);
}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){float s=fbm(p*14.0);t.alb=srgb2lin(mix(vec3(0.76,0.51,0.28),vec3(0.69,0.45,0.24),s));t.rough=0.75;t.spec=0.15;return true;}
 if(m==101.0){t.alb=srgb2lin(vec3(0.62,0.41,0.22));t.rough=0.8;t.spec=0.1;return true;}
 if(m==102.0){t.alb=srgb2lin(vec3(0.91,0.74,0.47));t.rough=0.1;t.spec=1.0;return true;}
 return false;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float outer=sdRoundBox(q,B,0.025);
 float hy=B.y+0.15-T*0.5;
 float inner=sdBox(q-vec3(0.0,hy-B.y+T,0.0),vec3(B.x-T,hy,B.z-T));
 float box=max(outer,-inner);
 bool inside=abs(q.x)<B.x-T+0.004&&abs(q.z)<B.z-T+0.004&&q.y>-B.y+T-0.004;
 vec2 res=vec2(box,inside?101.0:100.0);
 // four flaps, opened outwards at different angles
 float L=B.z*0.92;
 float f=flap(vec3(q.x,q.y-B.y,q.z-(B.z-T*0.5)),0.28,B.x-0.01,L);
 f=min(f,flap(vec3(q.x,q.y-B.y,-q.z-(B.z-T*0.5)),0.95,B.x-0.01,L));
 f=min(f,flap(vec3(q.z,q.y-B.y,q.x-(B.x-T*0.5)),0.5,B.z-0.03,L));
 f=min(f,flap(vec3(q.z,q.y-B.y,-q.x-(B.x-T*0.5)),0.62,B.z-0.03,L));
 res=U(res,vec2(f,100.0));
 // packing tape over the top seam, running down the short side wall
 float tape=sdRoundBox(q-vec3(B.x,B.y-0.36,0.0),vec3(0.01,0.37,0.13),0.006);
 res=U(res,vec2(tape,102.0));
 return res;
}`},
 "kette":{view:{"cam":[0.0,3.9,6.2],"target":[0.2,0.1,0],"fov":28},glsl:`
#define HAS_MAT
float sdLink(vec3 p,float le,float r1,float r2){vec3 q=vec3(p.x,max(abs(p.y)-le,0.0),p.z);return length(vec2(length(q.xy)-r1,q.z))-r2;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.74,0.77,0.82));t.metal=1.0;t.rough=0.26;return true;}
 return false;
}
vec2 objectMap(vec3 p){
 const float le=0.12,r1=0.165,r2=0.066;
 const float sp=2.0*le+2.0*r1-2.0*r2-0.01;
 const float Rc=1.15;
 const int N=9;
 float dA=sp/Rc;
 float a0=-0.5*dA*float(N-1);
 float d=1e9;
 for(int i=0;i<N;i++){
  float a=a0+dA*float(i)+3.14159;
  vec3 P=vec3(Rc*sin(a),0.0,Rc*cos(a)+0.45);
  vec3 Tg=vec3(cos(a),0.0,-sin(a));vec3 Nr=vec3(sin(a),0.0,cos(a));
  vec3 r=p-P;
  float along=dot(r,Tg),side=dot(r,Nr);
  float l;
  if(i%2==0){l=sdLink(vec3(side,along,r.y-2.2*r2),le,r1,r2);}
  else{l=sdLink(vec3(r.y-(r1+r2),along,side),le,r1,r2);}
  d=min(d,l);
 }
 return vec2(d,100.0);
}`},
 "umzugswagen":{view:{"cam":[0.0,2.5,7.4],"target":[0.2,0.0,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.62)*q.xz;q.y+=0.9;return q;}
// wheel with the axle along z, outer face towards +z (both sides mirrored)
vec2 wheelAt(vec3 q,float x){
 vec3 w=vec3(q.x-x,q.y-0.3,abs(q.z)-0.44);
 vec2 r=vec2(sdCylY(vec3(w.x,w.z,w.y),0.13,0.3,0.09),M_RUBBER);
 r=U(r,vec2(sdCylY(vec3(w.x,w.z-0.04,w.y),0.11,0.165,0.04),M_STEEL));
 r=U(r,vec2(sdCylY(vec3(w.x,w.z-0.12,w.y),0.04,0.06,0.02),M_GREY));
 return r;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 res=wheelAt(q,-0.82);
 res=U(res,wheelAt(q,0.82));
 // chassis
 res=U(res,vec2(sdRoundBox(q-vec3(0.05,0.38,0.0),vec3(1.28,0.08,0.34),0.03),M_CHARCOAL));
 // cab, front at -x
 vec3 c=q-vec3(-0.9,0.84,0.0);
 float cab=sdRoundBox(c,vec3(0.42,0.5,0.5),0.17);
 cab=smax(cab,-(length(q.xy-vec2(-0.82,0.3))-0.39),0.03);
 vec2 res2=vec2(cab,M_TEAL);
 // windows: thin shells on the cab surface
 float wfront=max(cab-0.014,sdRoundBox(c-vec3(-0.55,0.24,0.0),vec3(0.36,0.17,0.43),0.05));
 float wside=max(cab-0.014,sdRoundBox(c-vec3(0.05,0.24,0.0),vec3(0.2,0.17,0.7),0.05));
 res2=U(res2,vec2(min(wfront,wside),M_SKY));
 // grille, lamps and bumper
 float gr=max(cab-0.012,sdRoundBox(c-vec3(-0.6,-0.17,0.0),vec3(0.2,0.12,0.24),0.03));
 gr=max(gr,-sdBox(vec3(c.x+0.43,mod(c.y+0.17+0.03,0.06)-0.03,c.z),vec3(0.03,0.012,0.2)));
 res2=U(res2,vec2(gr,M_CHARCOAL));
 vec3 lz=vec3(c.x+0.42,c.y+0.17,abs(c.z)-0.37);
 res2=U(res2,vec2(sdEllipsoid(lz,vec3(0.05,0.07,0.07)),M_YELLOW));
 res2=U(res2,vec2(sdRoundBox(c-vec3(-0.44,-0.42,0.0),vec3(0.07,0.07,0.52),0.05),M_GREY));
 // mirrors
 vec3 mz=vec3(c.x+0.3,c.y-0.18,abs(c.z)-0.6);
 res2=U(res2,vec2(min(sdRoundBox(mz,vec3(0.03,0.1,0.05),0.025),sdCapsule(mz,vec3(0.0,-0.05,0.0),vec3(0.0,-0.05,-0.12),0.015)),M_CHARCOAL));
 res=U(res,res2);
 // big white box body with panel grooves
 vec3 b=q-vec3(0.47,1.13,0.0);
 float box=sdRoundBox(b,vec3(0.92,0.67,0.57),0.07);
 float id=clamp(round(b.x/0.31),-2.0,2.0);
 float groove=sdBox(vec3(b.x-id*0.31,b.y,abs(b.z)-0.57),vec3(0.008,0.6,0.012));
 box=max(box,-groove);
 float door=sdBox(vec3(b.x-0.92,b.y,b.z),vec3(0.012,0.6,0.008));
 box=max(box,-door);
 res=U(res,vec2(box,M_WHITE));
 // door handles and tail lights
 res=U(res,vec2(sdCapsule(b,vec3(0.94,-0.15,0.06),vec3(0.94,-0.15,0.15),0.018),M_GREY));
 res=U(res,vec2(sdCapsule(b,vec3(0.94,-0.15,-0.06),vec3(0.94,-0.15,-0.15),0.018),M_GREY));
 res=U(res,vec2(sdRoundBox(vec3(q.x-1.35,q.y-0.4,abs(q.z)-0.3),vec3(0.03,0.04,0.06),0.015),M_RED));
 return res;
}`},
 "lastwagen":{view:{"cam":[0.0,2.8,7.4],"target":[0.2,0.0,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.62)*q.xz;q.y+=0.75;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.z*2.0,q.x,q.y*2.0);}
vec2 wheelAt(vec3 q,float x){
 vec3 w=vec3(q.x-x,q.y-0.3,abs(q.z)-0.44);
 vec2 r=vec2(sdCylY(vec3(w.x,w.z,w.y),0.13,0.3,0.09),M_RUBBER);
 r=U(r,vec2(sdCylY(vec3(w.x,w.z-0.04,w.y),0.11,0.165,0.04),M_STEEL));
 r=U(r,vec2(sdCylY(vec3(w.x,w.z-0.12,w.y),0.04,0.06,0.02),M_GREY));
 return r;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 res=wheelAt(q,-0.85);
 res=U(res,wheelAt(q,0.55));
 res=U(res,wheelAt(q,1.18));
 // chassis and fuel tank
 res=U(res,vec2(sdRoundBox(q-vec3(0.1,0.4,0.0),vec3(1.38,0.08,0.34),0.03),M_CHARCOAL));
 res=U(res,vec2(sdCylY(vec3(q.y-0.36,q.x+0.15,abs(q.z)-0.4),0.2,0.11,0.04),M_STEEL));
 // cab, front at -x
 vec3 c=q-vec3(-0.93,0.9,0.0);
 float cab=sdRoundBox(c,vec3(0.43,0.55,0.53),0.15);
 cab=smax(cab,-(length(q.xy-vec2(-0.85,0.3))-0.39),0.03);
 vec2 res2=vec2(cab,M_RED);
 float wfront=max(cab-0.014,sdRoundBox(c-vec3(-0.55,0.26,0.0),vec3(0.36,0.18,0.45),0.05));
 float wside=max(cab-0.014,sdRoundBox(c-vec3(0.06,0.26,0.0),vec3(0.2,0.18,0.7),0.05));
 res2=U(res2,vec2(min(wfront,wside),M_SKY));
 // chrome grille with bars
 float gr=max(cab-0.016,sdRoundBox(c-vec3(-0.6,-0.18,0.0),vec3(0.2,0.15,0.3),0.03));
 gr=max(gr,-sdBox(vec3(c.x+0.45,mod(c.y+0.18+0.035,0.07)-0.035,c.z),vec3(0.03,0.014,0.26)));
 res2=U(res2,vec2(gr,M_STEEL));
 vec3 lz=vec3(c.x+0.43,c.y+0.2,abs(c.z)-0.42);
 res2=U(res2,vec2(sdEllipsoid(lz,vec3(0.05,0.07,0.07)),M_YELLOW));
 res2=U(res2,vec2(sdRoundBox(c-vec3(-0.45,-0.47,0.0),vec3(0.08,0.08,0.55),0.05),M_CHARCOAL));
 vec3 mz=vec3(c.x+0.3,c.y-0.2,abs(c.z)-0.63);
 res2=U(res2,vec2(min(sdRoundBox(mz,vec3(0.03,0.11,0.05),0.025),sdCapsule(mz,vec3(0.0,-0.05,0.0),vec3(0.0,-0.05,-0.12),0.015)),M_CHARCOAL));
 res=U(res,res2);
 // open cargo bed: wooden floor, low red drop sides, taller headboard behind the cab
 vec3 b=q-vec3(0.55,0.0,0.0);
 float floorb=sdRoundBox(b-vec3(0.0,0.55,0.0),vec3(0.95,0.06,0.56),0.02);
 res=U(res,vec2(floorb,M_WOOD));
 float sides=sdRoundBox(vec3(b.x,b.y-0.8,abs(b.z)-0.54),vec3(0.95,0.2,0.035),0.02);
 sides=min(sides,sdRoundBox(b-vec3(0.93,0.8,0.0),vec3(0.035,0.2,0.56),0.02));
 float head=sdRoundBox(b-vec3(-0.93,0.92,0.0),vec3(0.04,0.32,0.56),0.03);
 // ribs on the drop sides
 float rib=sdRoundBox(vec3(b.x,b.y-0.8,abs(b.z)-0.575),vec3(0.95,0.025,0.012),0.01);
 rib=min(rib,sdRoundBox(vec3(b.x-0.965,b.y-0.8,b.z),vec3(0.012,0.025,0.56),0.01));
 float sid=clamp(round(b.x/0.47),-1.0,1.0);
 float post=sdRoundBox(vec3(b.x-sid*0.47,b.y-0.78,abs(b.z)-0.575),vec3(0.03,0.22,0.015),0.012);
 res=U(res,vec2(min(min(sides,head),rib),M_RED));
 res=U(res,vec2(post,M_CHARCOAL));
 // head board window grid
 float grid=max(head-0.01,sdBox(b-vec3(-0.93,1.05,0.0),vec3(0.1,0.14,0.45)));
 grid=max(grid,-sdBox(vec3(b.x+0.93,b.y-1.05,mod(b.z+0.05,0.1)-0.05),vec3(0.1,0.12,0.03)));
 res=U(res,vec2(grid,M_CHARCOAL));
 res=U(res,vec2(sdRoundBox(vec3(q.x-1.49,q.y-0.42,abs(q.z)-0.33),vec3(0.03,0.04,0.07),0.015),M_ORANGE));
 return res;
}`},
 "seil":{view:{"cam":[0.4,3.6,6.4],"target":[0.25,0.2,0.3],"fov":28},glsl:`
#define HAS_MAT
const float R0=0.74;
const float RR=0.12;
const float PITCH=0.19;
const float TURNS=4.0;
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-2.35)*q.xz;return q;}
// twisted three strand surface: crest is 1 on a strand and 0 in the groove between strands
float crest(float phi,float s){return abs(cos(1.5*phi+10.5*s));}
// x: distance, y: crest value
vec2 helix(vec3 q){
 float a=atan(q.z,q.x);
 float r=length(q.xz);
 float n=clamp(round(q.y/PITCH-a/6.2831853),0.0,TURNS-1.0);
 float th=a+6.2831853*n;
 float yc=th/6.2831853*PITCH;
 vec2 cs=vec2(r-R0,q.y-yc);
 float c=crest(atan(cs.y,cs.x),th*R0);
 if(gNoGlass)c=0.75;
 return vec2((length(cs)-RR*(0.86+0.14*c))*0.85,c);
}
// rope segment between a and b (s0 = rope length at a)
vec2 seg(vec3 p,vec3 a,vec3 b,float r,float s0){
 vec3 pa=p-a,ba=b-a;float l=length(ba);vec3 t=ba/l;
 float h=clamp(dot(pa,t),0.0,l);
 vec3 v=pa-t*h;
 vec3 e1=normalize(cross(t,vec3(0.0,1.0,0.0)));vec3 e2=cross(e1,t);
 float c=crest(atan(dot(v,e2),dot(v,e1)),s0+h);
 if(gNoGlass)c=0.75;
 return vec2((length(v)-r*(0.86+0.14*c))*0.85,c);
}
vec2 V(vec2 a,vec2 b){return a.x<b.x?a:b;}
vec2 rope(vec3 p){
 vec3 q=local(p);
 vec2 d=helix(q);
 // loose end: leaves the top turn and falls to the floor in front
 float ang=3.14159+6.2831853*(TURNS-1.0);
 float yt=ang/6.2831853*PITCH;
 vec3 e0=vec3(0.52,yt,0.52);
 vec3 e1=vec3(0.22,yt+0.02,0.92);
 vec3 e2=vec3(0.18,0.32,1.22);
 vec3 e3=vec3(0.32,-0.02,1.42);
 vec3 e4=vec3(0.85,-0.08,1.55);
 vec3 e5=vec3(1.35,-0.08,1.32);
 d=V(d,seg(p,e0,e1,RR,0.0));
 d=V(d,seg(p,e1,e2,RR,0.4));
 d=V(d,seg(p,e2,e3,RR,0.8));
 d=V(d,seg(p,e3,e4,RR,1.1));
 d=V(d,seg(p,e4,e5,RR,1.7));
 // shadow rays see a filled coil (no crevices between the turns)
 if(gNoGlass){
  float a=atan(q.z,q.x);
  float hh=0.5*(TURNS-1.0)*PITCH;
  vec2 f=abs(vec2(length(q.xz)-R0,q.y-(a/6.2831853*PITCH+hh)))-vec2(0.1,hh);
  d.x=min(d.x,length(max(f,0.0))+min(max(f.x,f.y),0.0));
 }
 return d;
}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  float c=rope(p).y;
  float f=fbm(p*vec3(40.0,40.0,40.0));
  vec3 col=mix(vec3(0.52,0.35,0.17),vec3(0.88,0.68,0.40),smoothstep(0.0,0.55,c));
  t.alb=srgb2lin(col*(0.9+0.2*f));t.rough=0.85;t.spec=0.1;t.sss=0.1;return true;}
 if(m==101.0){float f=noise3(p*vec3(9.0,90.0,90.0));t.alb=srgb2lin(vec3(0.90,0.74,0.48)*(0.75+0.4*f));t.rough=0.9;t.spec=0.05;return true;}
 if(m==102.0){float f=0.5+0.5*sin(dot(p,vec3(1.0,0.0,2.0))*90.0);t.alb=srgb2lin(mix(vec3(0.62,0.20,0.14),vec3(0.75,0.26,0.18),f));t.rough=0.6;t.spec=0.2;return true;}
 return false;
}
vec2 objectMap(vec3 p){
 vec2 res=vec2(rope(p).x,100.0);
 // whipped end with a short frayed tuft
 vec3 e4=vec3(0.85,-0.08,1.55);vec3 e5=vec3(1.35,-0.08,1.32);vec3 dir=normalize(e5-e4);
 float band=sdCapsule(p,e5-dir*0.1,e5,RR*1.08);
 res=U(res,vec2(band,102.0));
 float tuft=sdRoundCone(p,e5,e5+dir*0.2,RR*0.85,RR*1.15);
 res=U(res,vec2(tuft,101.0));
 return res;
}`},
 "rad":{view:{"cam":[1.0,2.0,7.2],"target":[0,0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.72)*q.xz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.22,0.22,0.24));t.rough=0.55;t.spec=0.35;return true;}
 return false;
}
float sdRB2(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // axle along z, the rim faces +z
 float r=length(q.xy);
 float a=atan(q.y,q.x);
 float z=q.z;
 // tyre
 float tyre=sdRB2(vec2(r-0.82,z),vec2(0.2,0.33),0.14);
 // tread blocks: centre groove and chevron cross grooves
 float u=a*1.0;
 float P=6.2831853/26.0;
 float g=abs(z)-0.022;
 float l1=abs(mod(u+z*0.5,P)-P*0.5)-0.028;
 float l2=abs(mod(u-z*0.5+P*0.5,P)-P*0.5)-0.028;
 g=min(g,z>0.0?l1:l2);
 tyre=max(tyre,-max(g,0.955-r));
 // sidewall ring
 tyre=smin(tyre,length(vec2(r-0.88,abs(z)-0.31))-0.022,0.03);
 vec2 res=vec2(tyre*0.9,100.0);
 // rim: dish face with five spokes
 float zf=0.1+0.11*(r/0.63)*(r/0.63);
 float face=max(abs(z-zf)-0.035,r-0.635)*0.8;
 float as=mod(a+0.31416,1.2566)-0.6283;
 vec2 hp=r*vec2(cos(as),sin(as));
 float hole=(length((hp-vec2(0.41,0.0))/vec2(0.13,0.17))-1.0)*0.12;
 face=max(face,-hole);
 float lip=length(vec2(r-0.63,z-0.22))-0.045;
 float barrel=max(abs(r-0.615)-0.02,abs(z)-0.22);
 float rim=min(min(face,lip),barrel);
 // hub cap and nuts
 rim=min(rim,sdCylY(vec3(q.x,z-0.19,q.y),0.06,0.15,0.045));
 res=U(res,vec2(rim,M_STEEL));
 float an=mod(a,1.2566)-0.6283;
 vec2 np=r*vec2(cos(an),sin(an));
 float nut=sdCylY(vec3(np.x-0.23,z-0.17,np.y),0.05,0.035,0.012);
 res=U(res,vec2(nut,M_GREY));
 // dark inside behind the spokes
 float inner=max(abs(z+0.04)-0.03,r-0.62);
 res=U(res,vec2(inner,M_DARK));
 return res;
}`},
 "regenschirm":{view:{"cam":[0.3,2.6,7.8],"target":[0.1,0.0,0],"fov":28},glsl:`
#define HAS_MAT
#define HAS_WOOD
// tilted to the left, seen from the side and a little above
vec3 local(vec3 p){vec3 q=p;q.xy=rot(0.42)*q.xy;q.yz=rot(0.04)*q.yz;q.y-=0.42;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.x*2.0,q.y,q.z*2.0);}
const float RS=1.5;
const float CY=-0.78;
const float YRIM=-0.14;
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.05,0.40,0.43));t.rough=0.5;t.spec=0.25;return true;}
 if(m==101.0){t.alb=srgb2lin(vec3(0.07,0.56,0.59));t.rough=0.68;t.spec=0.22;t.sss=0.1;return true;}
 return false;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // octagonal canopy: polygon radius rho, ribs at ac=0
 vec3 c=q;c.xz=rot(0.39)*c.xz;
 float l=length(c.xz);
 float a=atan(c.z,c.x);
 float ac=mod(a+0.3927,0.7854)-0.3927;
 float rho=l*cos(0.3927-abs(ac))/0.92388;
 float sd=length(vec2(rho,c.y-CY))-RS;
 float rimcut=(YRIM+0.16*pow(sin(4.0*ac),2.0))-c.y;
 float shell=max(abs(sd)-0.022,rimcut)*0.9;
 // shadow rays see a thicker shell (grown inwards) so no light leaks through it
 if(gNoGlass)shell=max(abs(sd+0.04)-0.062,rimcut)*0.9;
 vec2 res=vec2(shell,sd<0.0?100.0:101.0);
 // ribs as ridges along the panel seams
 float rib=max(length(vec2(l*sin(ac),sd))-0.03,rimcut+0.01);
 res=U(res,vec2(rib,101.0));
 // rib tips
 float lt=sqrt(RS*RS-(YRIM-CY)*(YRIM-CY));
 vec3 rq=vec3(l*cos(ac),c.y,l*sin(ac));
 res=U(res,vec2(length(rq-vec3(lt,YRIM+0.01,0.0))-0.04,M_DARK));
 // stretchers from the runner to the ribs (mostly hidden under the canopy)
 float st=sdCapsule(rq,vec3(0.03,-0.5,0.0),vec3(0.72,0.44,0.0),0.014);
 res=U(res,vec2(st,M_STEEL));
 // top ferrule and shaft
 float top=CY+RS;
 res=U(res,vec2(sdRoundCone(q,vec3(0.0,top,0.0),vec3(0.0,top+0.2,0.0),0.06,0.025),M_DARK));
 float shaft=sdCapsule(q,vec3(0.0,-1.2,0.0),vec3(0.0,top,0.0),0.035);
 shaft=min(shaft,sdCylY(q-vec3(0.0,-0.5,0.0),0.06,0.055,0.02));
 res=U(res,vec2(shaft,M_STEEL));
 // curved wooden handle
 float grip=sdRoundCone(q,vec3(0.0,-1.62,0.0),vec3(0.0,-1.15,0.0),0.08,0.065);
 vec3 h=q-vec3(0.21,-1.62,0.0);
 float hook=sdCappedTorus(vec3(h.x,-h.y,h.z),vec2(sin(1.8),cos(1.8)),0.21,0.08);
 res=U(res,vec2(smin(grip,hook,0.02),M_DARKWOOD));
 return res;
}`},
 "schirmstaender":{view:{"cam":[0.5,2.7,8.2],"target":[0,0.3,0],"fov":28},glsl:`
#define HAS_MAT
#define HAS_WOOD
const float R=0.58;
vec3 objectWoodSpace(vec3 p){return vec3(p.x*2.0,p.y,p.z*2.0);}
// blue and white porcelain pattern on the outside of the stand
vec3 porcelain(vec3 p){
 float a=atan(p.z,p.x);
 vec2 uv=vec2(a*R,p.y);
 vec3 white=vec3(0.96,0.96,0.97);vec3 blue=vec3(0.13,0.28,0.68);
 float ink=0.0;
 // bands at the top and the bottom
 float yb=abs(p.y-0.0);
 ink=max(ink,smoothstep(0.012,0.0,abs(yb-0.66)-0.035));
 ink=max(ink,smoothstep(0.008,0.0,abs(yb-0.585)-0.008));
 // little waves in the bands
 float wv=abs(yb-0.74+0.025*sin(uv.x*40.0))-0.01;
 ink=max(ink,smoothstep(0.008,0.0,wv)*step(yb,0.79));
 // flowers on a staggered grid
 if(yb<0.55){
  vec2 g=vec2(uv.x/(6.2831853*R/7.0),uv.y/0.36);
  vec2 id=floor(g);vec2 f=fract(g)-0.5;
  if(mod(id.y,2.0)>0.5){f=fract(g+vec2(0.5,0.0))-0.5;}
  f*=vec2(6.2831853*R/7.0,0.36);
  float r=length(f);float an=atan(f.y,f.x);
  float petal=r-(0.085+0.045*cos(6.0*an));
  ink=max(ink,smoothstep(0.008,0.0,petal));
  ink=min(ink,1.0-smoothstep(0.012,0.0,r-0.03)*0.85);
  ink=max(ink,smoothstep(0.006,0.0,r-0.012));
  // small leaves between the flowers
  vec2 lf=f-vec2(0.13,0.1);lf=rot(0.6)*lf;
  ink=max(ink,smoothstep(0.006,0.0,length(lf/vec2(0.05,0.022))-1.0));
  vec2 lf2=f-vec2(-0.13,-0.1);lf2=rot(0.6)*lf2;
  ink=max(ink,smoothstep(0.006,0.0,length(lf2/vec2(0.05,0.022))-1.0));
 }
 return srgb2lin(mix(white,blue,ink));
}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=porcelain(p);t.rough=0.12;t.spec=0.9;return true;}
 if(m==101.0){t.alb=srgb2lin(vec3(0.13,0.28,0.68));t.rough=0.12;t.spec=0.9;return true;}
 return false;
}
// one closed umbrella standing tip-down: base point b, axis d, side vector s for the hook
vec2 umbrella(vec3 p,vec3 b,vec3 d,vec3 s,float cm,float hm){
 vec3 n3=cross(d,s);
 vec3 v=p-b;
 float al=dot(v,d);
 vec3 rv=v-d*al;
 float fa=atan(dot(rv,n3),dot(rv,s));
 // folded canopy with soft pleats
 float rr=mix(0.16,0.045,clamp((al-0.2)/1.55,0.0,1.0));
 rr*=1.0+0.08*cos(fa*8.0);
 float can=max(length(rv)-rr,max(al-1.75,0.2-al))*0.8;
 vec2 res=vec2(can,cm);
 // strap around the folded canopy
 float strap=max(length(rv)-mix(0.16,0.045,clamp((1.35-0.2)/1.55,0.0,1.0))-0.025,abs(al-1.35)-0.04);
 res=U(res,vec2(strap,cm));
 float shaft=sdCapsule(p,b+d*1.7,b+d*2.1,0.027);
 res=U(res,vec2(shaft,M_STEEL));
 // handle: straight grip and the crook
 vec3 g0=b+d*2.05;vec3 g1=b+d*2.3;
 float grip=sdRoundCone(p,g0,g1,0.06,0.058);
 vec3 h=p-(g1+s*0.16);
 float hook=sdCappedTorus(vec3(dot(h,s),dot(h,d),dot(h,n3)),vec2(sin(1.9),cos(1.9)),0.16,0.058);
 res=U(res,vec2(smin(grip,hook,0.02),hm));
 return res;
}
vec2 objectMap(vec3 p){
 vec3 q=p;q.xz=rot(0.3)*q.xz;
 // the stand: hollow cylinder with a rolled rim and a small foot
 float outer=sdCylY(q,0.8,R,0.06);
 float inner=sdCylY(q-vec3(0.0,0.1,0.0),0.8,R-0.05,0.04);
 float body=max(outer,-inner);
 vec2 res=vec2(body,(length(q.xz)>R-0.02&&abs(q.y)<0.79)?100.0:M_WHITE);
 float rim=sdTorus(q-vec3(0.0,0.79,0.0),vec2(R-0.025,0.045));
 res=U(res,vec2(rim,101.0));
 float foot=sdTorus(q-vec3(0.0,-0.77,0.0),vec2(R-0.01,0.04));
 res=U(res,vec2(foot,101.0));
 // two closed umbrellas leaning in the stand
 res=U(res,umbrella(q,vec3(0.12,-0.7,0.05),normalize(vec3(0.24,1.0,0.1)),normalize(vec3(1.0,-0.24,0.0)),M_RED,M_DARKWOOD));
 res=U(res,umbrella(q,vec3(-0.15,-0.7,-0.08),normalize(vec3(-0.2,1.0,-0.12)),normalize(vec3(-1.0,-0.2,0.25)),M_NAVY,M_YELLOW));
 return res;
}`},
 "brille":{view:{"cam":[0.0,2.5,6.4],"target":[0,0.0,-0.2],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.5)*q.xz;q.z-=0.75;q.yz=rot(-0.1)*q.yz;return q;}
float sdRB2(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){float s=fbm(p*9.0);t.alb=srgb2lin(mix(vec3(0.33,0.16,0.07),vec3(0.45,0.24,0.10),s));t.rough=0.22;t.spec=0.8;return true;}
 return false;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // frame front in the xy plane, temples go back towards -z
 vec3 l=vec3(abs(q.x)-0.58,q.y,q.z);
 float lr=length(l.xy);
 float rim=sdRB2(vec2(lr-0.46,l.z),vec2(0.045,0.055),0.04);
 // bridge
 float bridge=sdCappedTorus(vec3(q.x,q.y-0.1,q.z),vec2(sin(1.1),cos(1.1)),0.17,0.035);
 // hinge blocks
 float hinge=sdRoundBox(l-vec3(0.47,0.1,-0.06),vec3(0.05,0.055,0.08),0.03);
 // temples: straight back, then bent down over the ear
 float tmp=sdCapsule(l,vec3(0.5,0.1,-0.1),vec3(0.55,0.1,-1.45),0.035);
 tmp=smin(tmp,sdCapsule(l,vec3(0.55,0.1,-1.45),vec3(0.55,-0.22,-1.78),0.035),0.03);
 float d=min(min(rim,bridge),min(hinge,tmp));
 vec2 res=vec2(d,100.0);
 // nose pads
 res=U(res,vec2(sdEllipsoid(vec3(abs(q.x)-0.2,q.y+0.1,q.z+0.08),vec3(0.035,0.06,0.025)),M_WHITE));
 if(!gNoGlass){
  float lens=max(abs(l.z)-0.018,lr-0.47);
  res=U(res,vec2(lens,M_CLEAR));
 }
 return res;
}`},
 "zeitschrift":{view:{"cam":[0.6,4.6,4.4],"target":[0,-0.1,0.05],"fov":28},glsl:`
#define HAS_PAPER
const vec2 HS=vec2(0.8,1.07);
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.32)*q.xz;return q;}
// cover picture, uv from the top left corner (0..1)
vec3 cover(vec2 uv){
 vec3 c=vec3(0.97,0.97,0.95);
 vec2 asp=vec2(HS.x/HS.y,1.0);
 // top photo: sky, sun, sea and a green island
 if(uv.x>0.04&&uv.x<0.96&&uv.y>0.14&&uv.y<0.6){
  float y=(uv.y-0.14)/0.46;
  c=mix(vec3(0.42,0.72,0.96),vec3(0.75,0.90,1.0),smoothstep(0.0,0.55,y));
  vec2 sp=(uv-vec2(0.76,0.25))*asp;
  c=mix(c,vec3(1.0,0.93,0.6),smoothstep(0.1,0.06,length(sp)));
  c=mix(c,vec3(1.0,0.80,0.15),smoothstep(0.065,0.058,length(sp)));
  float isl=0.5-0.18*exp(-pow((uv.x-0.25)*5.0,2.0));
  if(y>isl&&uv.x<0.55)c=mix(vec3(0.30,0.68,0.30),vec3(0.20,0.55,0.25),smoothstep(0.3,0.5,y));
  if(y>0.55){
   c=mix(vec3(0.10,0.55,0.80),vec3(0.05,0.35,0.65),smoothstep(0.55,1.0,y));
   float w=sin(uv.x*60.0+sin(y*30.0)*2.0)*0.5+0.5;
   c=mix(c,vec3(0.75,0.92,1.0),smoothstep(0.92,0.98,w)*step(fract(y*9.0),0.5));
  }
  if(y>0.84)c=mix(c,vec3(0.96,0.86,0.6),smoothstep(0.84,0.88,y+0.04*sin(uv.x*9.0)));
 }
 // bottom left: a pink flower on leaves
 if(uv.x>0.04&&uv.x<0.53&&uv.y>0.63&&uv.y<0.96){
  vec2 f=(uv-vec2(0.285,0.795))*asp;
  c=vec3(0.36,0.66,0.32);
  vec2 lf=rot(0.7)*(f-vec2(0.08,0.06));
  c=mix(c,vec3(0.20,0.48,0.22),smoothstep(0.01,0.0,length(lf/vec2(0.16,0.05))-1.0));
  vec2 lf2=rot(-0.5)*(f+vec2(0.1,-0.07));
  c=mix(c,vec3(0.20,0.48,0.22),smoothstep(0.01,0.0,length(lf2/vec2(0.15,0.05))-1.0));
  float a=atan(f.y,f.x);float r=length(f);
  float pet=r-(0.085+0.05*cos(5.0*a));
  c=mix(c,vec3(0.95,0.36,0.56),smoothstep(0.006,0.0,pet));
  c=mix(c,vec3(1.0,0.86,0.3),smoothstep(0.03,0.024,r));
 }
 // bottom right: hills at sunset
 if(uv.x>0.56&&uv.x<0.96&&uv.y>0.63&&uv.y<0.96){
  float y=(uv.y-0.63)/0.33;
  c=mix(vec3(1.0,0.72,0.25),vec3(1.0,0.86,0.45),y*1.5);
  float h1=0.55+0.12*sin(uv.x*14.0);
  if(y>h1)c=vec3(0.45,0.72,0.30);
  float h2=0.75+0.08*sin(uv.x*22.0+1.0);
  if(y>h2)c=vec3(0.30,0.58,0.26);
 }
 // coloured band at the top, no letters
 if(uv.y>0.03&&uv.y<0.11&&uv.x>0.04&&uv.x<0.96)c=vec3(0.90,0.22,0.24);
 return srgb2lin(c);
}
vec3 objectPaper(vec3 p,vec3 n){
 vec3 q=local(p);
 vec3 ln=n;ln.xz=rot(0.32)*ln.xz;
 if(ln.y>0.6&&q.y>0.07)return cover(vec2((q.x+HS.x)/(2.0*HS.x),(q.z+HS.y)/(2.0*HS.y)));
 if(q.y<-0.07)return srgb2lin(vec3(0.90,0.22,0.24));
 float s=0.5+0.5*sin(q.y*700.0);
 return srgb2lin(mix(vec3(0.97,0.97,0.95),vec3(0.82,0.82,0.80),s*0.6));
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // covers and the page block
 float cov=sdRoundBox(q-vec3(0.0,0.075,0.0),vec3(HS.x,0.012,HS.y),0.008);
 float back=sdRoundBox(q-vec3(0.0,-0.075,0.0),vec3(HS.x,0.012,HS.y),0.008);
 float pages=sdRoundBox(q-vec3(-0.01,0.0,0.0),vec3(HS.x-0.02,0.065,HS.y-0.015),0.01);
 float d=min(cov,min(back,pages));
 // a few pages fanned out around the spine
 for(int i=0;i<3;i++){
  float fi=float(i);
  vec3 r=q-vec3(-HS.x,-0.035+fi*0.035,-HS.y);
  r.xz=rot(0.03+0.025*fi)*r.xz;
  d=min(d,sdRoundBox(r-vec3(HS.x-0.02,0.0,HS.y-0.015),vec3(HS.x-0.03,0.006,HS.y-0.03),0.005));
 }
 return vec2(d,M_PAPER);
}`},
 "bogen":{view:{"cam":[0.4,1.8,7.4],"target":[0,0.0,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
const float L=1.18;
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.25)*q.xz;q.xy=rot(-0.42)*q.xy;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.x*2.0,q.y*0.5,q.z*2.0);}
// limb centre line: x as a function of u=|y|/L, with the recurved tips
float limbX(float u){float k=max(u-0.75,0.0);return 0.46*u*u-4.2*k*k;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){vec3 q=local(p);float s=0.5+0.5*sin((q.y*1.0+atan(q.z,q.x)*0.04)*90.0);t.alb=srgb2lin(mix(vec3(0.30,0.17,0.09),vec3(0.40,0.24,0.13),s));t.rough=0.6;t.spec=0.2;return true;}
 return false;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // limbs (symmetric), elliptic cross section: wide in z, thin in x
 vec3 s=vec3(q.x,abs(q.y),q.z*0.55);
 float d=1e9;
 for(int i=0;i<8;i++){
  float u0=float(i)/8.0,u1=float(i+1)/8.0;
  vec3 a=vec3(limbX(u0),u0*L,0.0),b=vec3(limbX(u1),u1*L,0.0);
  d=min(d,sdRoundCone(s,a,b,mix(0.078,0.04,u0),mix(0.078,0.04,u1)));
 }
 vec2 res=vec2(d,M_WOOD);
 // darker tips
 res=U(res,vec2(sdRoundCone(s,vec3(limbX(0.93),0.93*L,0.0),vec3(limbX(1.0),L,0.0),0.046,0.042),M_DARKWOOD));
 // leather wrapped grip
 float grip=sdRoundBox(q-vec3(-0.01,0.0,0.0),vec3(0.095,0.22,0.08),0.07);
 res=U(res,vec2(grip,100.0));
 // string: straight between the recurves, then along them to the tips
 float sx=limbX(0.84)+0.045;
 vec3 sp=vec3(q.x,abs(q.y),q.z);
 float str=sdCapsule(sp,vec3(sx,0.0,0.0),vec3(sx,0.84*L,0.0),0.016);
 str=min(str,sdCapsule(sp,vec3(sx,0.84*L,0.0),vec3(limbX(0.92)+0.04,0.92*L,0.0),0.016));
 str=min(str,sdCapsule(sp,vec3(limbX(0.92)+0.04,0.92*L,0.0),vec3(limbX(0.98)+0.035,0.98*L,0.0),0.016));
 res=U(res,vec2(str,M_CREAM));
 return res;
}`},
 "pfeil":{view:{"cam":[0.0,1.8,7.4],"target":[0.3,0.0,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.3)*q.xz;q.xy=rot(0.62)*q.xy;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.y*3.0,q.x,q.z*3.0);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0||m==101.0){
  vec3 q=local(p);
  float s=0.5+0.5*sin((q.x-length(q.yz)*0.8)*140.0);
  vec3 c=m==100.0?vec3(0.90,0.18,0.16):vec3(1.0,0.80,0.15);
  t.alb=srgb2lin(c*(0.88+0.12*s));t.rough=0.6;t.spec=0.2;t.sss=0.2;return true;}
 return false;
}
// one feather vane: x along the shaft, r out from the shaft, z across
float vane(vec3 v){
 float tt=clamp((v.x-0.62)/0.56,0.0,1.0);
 float h=0.05+0.25*smoothstep(0.0,0.75,tt)-0.07*smoothstep(0.86,1.0,tt);
 float d2=max(v.y-h,max(0.62-v.x,v.x-1.18))*0.75;
 d2=max(d2,-v.y);
 return max(d2,abs(v.z)-0.02+0.008*smoothstep(0.1,0.3,v.y))-0.004;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // shaft along x, tip at -x
 float shaft=sdCapsule(q,vec3(-1.0,0.0,0.0),vec3(1.25,0.0,0.0),0.045);
 vec2 res=vec2(shaft,M_WOOD);
 // painted bands
 float bands=max(length(q.yz)-0.05,abs(abs(q.x-0.5)-0.035)-0.018);
 res=U(res,vec2(bands,M_RED));
 // nock
 float nock=sdRoundCone(vec3(q.y,q.x,q.z),vec3(0.0,1.2,0.0),vec3(0.0,1.33,0.0),0.05,0.06);
 nock=max(nock,-sdBox(q-vec3(1.36,0.0,0.0),vec3(0.06,0.025,0.1)));
 res=U(res,vec2(nock,M_ORANGE));
 // broadhead: flat barbed blade with bevelled edges, plus the socket
 float x=q.x;
 float w=0.21*clamp((x+1.5)/0.52,0.0,1.0);
 float side=(abs(q.y)-w)/1.08;
 float back=(x+0.98+0.45*(0.21-abs(q.y)));
 float blade2=max(side,max(back,-(x+1.5)));
 float th=0.008+0.035*clamp(1.0-abs(q.y)/max(w,0.001),0.0,1.0);
 float blade=max(blade2,abs(q.z)-th)*0.7;
 float sock=sdRoundCone(vec3(q.y,q.x,q.z),vec3(0.0,-0.92,0.0),vec3(0.0,-1.12,0.0),0.055,0.035);
 res=U(res,vec2(smin(blade,sock,0.02),M_STEEL));
 // fletching: three vanes, the cock feather points up
 float d1=vane(vec3(q.x,q.y,q.z));
 vec3 r2=q;r2.yz=rot(2.0944)*r2.yz;
 vec3 r3=q;r3.yz=rot(-2.0944)*r3.yz;
 res=U(res,vec2(d1,101.0));
 res=U(res,vec2(min(vane(r2),vane(r3)),100.0));
 return res;
}`},
};
