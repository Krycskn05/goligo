// Shader models for the Nesne Kasası: furnishings (painting, frame, mirror, cushion, lamp, rug, curtains) and home electronics.
module.exports={
 "bild":{view:{"cam":[1.7,1.3,7.6],"target":[0.3,-0.1,-0.2],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.38)*q.xz;return q;}
float sdBox2(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float sdRBox2(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
// fir tree crown made of three stacked tiers, b = foot of the crown (negative inside)
float pine(vec2 uv,vec2 b,float h,float w){
 float y=(uv.y-b.y)/h;
 float t=fract(y*3.0);
 float wid=w*(1.0-y)*(1.0-0.4*t);
 return max(abs(uv.x-b.x)-wid,max(-y,y-1.0)*h);
}
// the painted landscape: sky, clouds, snowy mountains, hills, a lake and fir trees
vec3 painting(vec2 uv){
 vec3 c=mix(vec3(0.88,0.95,0.99),vec3(0.38,0.66,0.95),smoothstep(-0.05,0.68,uv.y));
 float cl=min(length((uv-vec2(-0.5,0.5))*vec2(1.0,2.0))-0.17,length((uv-vec2(-0.33,0.55))*vec2(1.0,1.7))-0.13);
 cl=min(cl,min(length((uv-vec2(0.55,0.46))*vec2(1.0,2.0))-0.15,length((uv-vec2(0.7,0.49))*vec2(1.0,2.0))-0.11));
 c=mix(vec3(1.0),c,smoothstep(0.0,0.015,cl));
 float m1=0.40-abs(uv.x+0.12)*1.05;
 float m2=0.22-abs(uv.x-0.5)*0.85;
 float m3=0.10-abs(uv.x+0.78)*0.9;
 float top=0.40,px=-0.12;
 if(m2>m1&&m2>m3){top=0.22;px=0.5;}
 if(m3>m1&&m3>m2){top=0.10;px=-0.78;}
 float mh=max(m1,max(m2,m3));
 bool lit=uv.x<px;
 vec3 rock=lit?vec3(0.52,0.58,0.78):vec3(0.37,0.42,0.62);
 float snow=uv.y-(top-0.13+0.025*sin(uv.x*40.0));
 rock=mix(rock,lit?vec3(1.0):vec3(0.84,0.88,0.96),smoothstep(-0.005,0.005,snow));
 c=mix(rock,c,smoothstep(-0.005,0.005,uv.y-mh));
 float hy=-0.12+0.05*sin(uv.x*3.2+1.0);
 c=mix(mix(vec3(0.34,0.64,0.27),vec3(0.52,0.80,0.34),smoothstep(-0.4,-0.1,uv.y)),c,smoothstep(-0.005,0.005,uv.y-hy));
 float lake=length((uv-vec2(0.15,-0.36))*vec2(1.0,3.6))-0.62;
 vec3 water=mix(vec3(0.20,0.50,0.86),vec3(0.42,0.72,0.97),smoothstep(-0.5,-0.25,uv.y));
 water=mix(water,vec3(0.88,0.96,1.0),0.75*step(0.85,sin(uv.y*90.0))*step(abs(uv.x-0.15+0.1*sin(uv.y*30.0)),0.25));
 c=mix(water,c,smoothstep(-0.005,0.005,lake));
 float gy=-0.56+0.04*sin(uv.x*6.0);
 c=mix(vec3(0.24,0.52,0.20),c,smoothstep(-0.005,0.005,uv.y-gy));
 float trunk=min(sdBox2(uv-vec2(-0.74,-0.47),vec2(0.03,0.06)),min(sdBox2(uv-vec2(-0.52,-0.52),vec2(0.025,0.05)),sdBox2(uv-vec2(0.80,-0.45),vec2(0.025,0.05))));
 c=mix(vec3(0.45,0.28,0.15),c,smoothstep(-0.004,0.004,trunk));
 float tr=min(pine(uv,vec2(-0.74,-0.42),0.62,0.21),pine(uv,vec2(-0.52,-0.48),0.42,0.15));
 tr=min(tr,pine(uv,vec2(0.80,-0.40),0.40,0.14));
 c=mix(vec3(0.10,0.40,0.22),c,smoothstep(-0.004,0.004,tr));
 return srgb2lin(c);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){vec3 q=local(p);t.alb=painting(q.xy)*1.15;t.rough=0.55;t.spec=0.2;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // golden moulding: a rounded profile swept along a rectangle (centre line 1.1 x 0.8)
 float d2=sdBox2(q.xy,vec2(1.1,0.8));
 float frame=sdRBox2(vec2(d2,q.z),vec2(0.13,0.09),0.05);
 frame=smin(frame,length(vec2(d2,q.z-0.08))-0.06,0.03);
 frame=smin(frame,length(vec2(d2-0.13,q.z-0.03))-0.045,0.02);
 vec2 res=vec2(frame,M_BRASS);
 // painted canvas set back inside the frame
 float canvas=sdBox(q-vec3(0.0,0.0,-0.03),vec3(1.0,0.7,0.025));
 res=U(res,vec2(canvas,100.0));
 return res;
}`},
 "bilderrahmen":{view:{"cam":[-0.7,1.2,6.8],"target":[0.15,0,-0.1],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.22)*q.xz;return q;}
float sdBox2(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float sdRBox2(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
// half disc with a scalloped edge, pointing away from the frame (sc.y > 0), extruded in z
float shellD(vec2 sc,float r,float z){
 float srad=r*(0.86+0.14*abs(cos(atan(sc.x,sc.y)*5.0)));
 float fan=max(length(sc)-srad,-sc.y);
 return (length(vec2(max(fan+0.04,0.0),max(abs(z-0.08)-0.02,0.0)))-0.04)*0.8;}
// wood grain runs along each side of the frame
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);
 if(abs(q.x)/0.82>abs(q.y)/1.06)return vec3(q.x,q.y,q.z);
 return vec3(q.y,q.x,q.z);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // carved wooden moulding swept along a rectangle (centre line 0.66 x 0.9), empty in the middle
 float d2=sdBox2(q.xy,vec2(0.66,0.9));
 float body=sdRBox2(vec2(d2,q.z),vec2(0.15,0.08),0.05);
 body=smin(body,length(vec2(d2-0.04,q.z-0.07))-0.055,0.03);
 vec2 res=vec2(body,M_DARKWOOD);
 vec2 a=abs(q.xy);
 // gilded bead row along the inner edge
 const float s=0.075;
 float bx=clamp(round(q.x/s),-7.0,7.0)*s;
 float by=clamp(round(q.y/s),-10.0,10.0)*s;
 float gold=min(length(vec3(q.x-bx,a.y-0.77,q.z-0.075))-0.033,length(vec3(a.x-0.53,q.y-by,q.z-0.075))-0.033);
 // corner rosettes with petals
 vec3 c=vec3(a.x-0.66,a.y-0.9,q.z-0.09);
 float pr=length(c.xy);
 float rad=0.12+0.05*abs(cos(atan(c.y,c.x)*3.0+0.3));
 float ros=(length(vec2(max(pr-rad+0.04,0.0),max(abs(c.z)-0.02,0.0)))-0.04)*0.75;
 ros=min(ros,length(c-vec3(0.0,0.0,0.05))-0.085);
 // scalloped shell crests: large on top, small at the bottom and on the sides
 float sz=q.y>0.0?1.0:0.55;
 float shell=min(shellD(vec2(q.x,a.y-0.92),0.25*sz,q.z),shellD(vec2(q.y,a.x-0.68),0.15,q.z));
 gold=min(gold,min(ros,shell));
 res=U(res,vec2(gold,M_BRASS));
 return res;
}`},
 "kissen":{view:{"cam":[1.2,2.0,7.4],"target":[0.25,-0.05,-0.1],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.55)*q.xz;q.yz=rot(-0.28)*q.yz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // soft teal fabric (same colour as M_VELVET, without the fine weave so it stays calm when small)
 if(m==101.0){float s=fbm(p*7.0);t.alb=srgb2lin(mix(vec3(0.11,0.54,0.60),vec3(0.08,0.47,0.53),s));t.rough=0.85;t.spec=0.1;t.sss=0.25;return true;}
 if(m==100.0){t.alb=srgb2lin(vec3(0.05,0.38,0.43));t.rough=0.6;t.spec=0.2;t.sss=0.1;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 const float W=0.9;
 vec2 a=abs(q.xy)/W;
 // outline with slightly pulled-in sides so the corners stick out
 float b=max(abs(q.x)-W+0.09*(1.0-a.y*a.y),abs(q.y)-W+0.09*(1.0-a.x*a.x));
 // puffy thickness, thin at the seam, with small pinch creases running in from the corners
 vec2 c=clamp(a,0.0,1.0);
 float f=(1.0-c.x*c.x*c.x*c.x)*(1.0-c.y*c.y*c.y*c.y);
 float h=0.1+0.36*pow(f,0.5);
 float dg=(c.x-c.y)*7.0;
 h-=0.04*exp(-dg*dg)*smoothstep(0.45,0.9,(c.x+c.y)*0.5);
 float body=smax(abs(q.z)-h,b,0.08)*0.6;
 vec2 res=vec2(body,101.0);
 // piping along the seam
 float seam=length(vec2(b,q.z))-0.045;
 res=U(res,vec2(seam,100.0));
 return res;
}`},
 "lampe":{view:{"cam":[0.7,1.6,6.8],"target":[0.1,1.0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.45)*q.xz;return q;}
const vec3 J0=vec3(0.3,0.3,0.0);
const vec3 J1=vec3(0.7,1.3,0.0);
const vec3 J2=vec3(-0.3,1.9,0.0);
// brass joint knob with its axis along z
float jointZ(vec3 p,vec3 c){vec3 d=p-c;return sdCylY(vec3(d.x,d.z,d.y),0.11,0.1,0.03);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=vec3(3.2,2.8,1.7);t.rough=0.3;t.spec=0.3;t.sss=1.0;return true;}
 if(m==102.0){t.alb=srgb2lin(vec3(1.0,0.93,0.68))*1.8;t.rough=0.5;t.spec=0.1;t.sss=1.0;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // round base
 float base=sdCylY(q-vec3(0.3,0.07,0.0),0.07,0.58,0.05);
 base=smin(base,sdEllipsoid(q-vec3(0.3,0.12,0.0),vec3(0.42,0.12,0.42)),0.05);
 vec2 res=vec2(base,M_TEAL);
 // post and the two arms
 float arms=min(sdCapsule(q,J0,J1,0.065),sdCapsule(q,J1,J2,0.065));
 arms=min(arms,sdCapsule(q,vec3(0.3,0.15,0.0),J0,0.08));
 res=U(res,vec2(arms,M_TEAL));
 float j=min(jointZ(q,J0),min(jointZ(q,J1),jointZ(q,J2)));
 j=min(j,sdCylY(q-vec3(0.62,0.2,0.22),0.04,0.07,0.02));
 res=U(res,vec2(j,M_BRASS));
 // cone shade on the last joint, opening down and towards the front
 vec3 dir=normalize(vec3(-0.15,-0.5,0.85));
 vec3 s=q-(J2+dir*0.42);
 float ay=-dot(s,dir);
 float rr=length(s+dir*ay);
 vec3 sp=vec3(rr,ay,0.0);
 float outer=sdCappedCone(sp,0.28,0.44,0.14);
 float inner=sdCappedCone(sp-vec3(0.0,-0.05,0.0),0.28,0.40,0.10);
 float shade=max(outer,-inner);
 shade=min(shade,length(vec2(rr-0.42,ay+0.28))-0.03);
 shade=smin(shade,length(s+dir*0.3)-0.16,0.03);
 res=U(res,vec2(shade,(-inner>outer&&ay>-0.25)?102.0:M_TEAL));
 // glowing bulb inside
 res=U(res,vec2(length(s+dir*0.06)-0.16,100.0));
 return res;
}`},
 "spiegel":{view:{"cam":[0.9,1.3,6.2],"target":[0,0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.3)*q.xz;q.yz=rot(-0.18)*q.yz;return q;}
float sdEll2(vec2 p,vec2 r){float k0=length(p/r);float k1=max(length(p/(r*r)),1e-4);return k0*(k0-1.0)/k1;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==101.0){vec3 q=local(p);
  // silver glass with soft diagonal highlight streaks
  float s=q.x*0.8+q.y*0.6;
  float streak=smoothstep(0.1,0.0,abs(s-0.2))+0.8*smoothstep(0.045,0.0,abs(s-0.45));
  vec3 base=mix(vec3(0.78,0.86,0.94),vec3(0.97,0.99,1.0),smoothstep(-0.9,0.9,q.y*0.7-q.x*0.4));
  t.alb=srgb2lin(mix(base,vec3(1.0),clamp(streak,0.0,1.0)))*(1.0+0.25*clamp(streak,0.0,1.0));
  t.metal=1.0;t.rough=0.05;t.spec=1.0;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float e=sdEll2(q.xy,vec2(0.72,1.02));
 // chunky round golden frame ring with a thin inner bead
 float ring=length(vec2(e,q.z))-0.12;
 ring=smin(ring,length(vec2(e+0.14,q.z-0.02))-0.035,0.02);
 vec2 res=vec2(ring,M_BRASS);
 // mirror glass
 float glass=max(e+0.1,abs(q.z+0.005)-0.025);
 res=U(res,vec2(glass,101.0));
 return res;
}`},
 "teppich":{view:{"cam":[0.0,5.4,4.6],"target":[0,0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.5)*q.xz;return q;}
// kilim-like pattern: border with zigzag, nested diamond medallion, corner triangles
vec3 rug(vec2 uv){
 vec3 RED=vec3(0.80,0.22,0.18);vec3 CREAM=vec3(0.97,0.90,0.74);vec3 TEAL=vec3(0.10,0.56,0.58);
 vec3 ORA=vec3(0.97,0.62,0.20);vec3 NAVY=vec3(0.18,0.25,0.48);vec3 MUST=vec3(0.96,0.80,0.32);
 vec2 g=(floor(uv/0.04)+0.5)*0.04;
 vec2 a=abs(g);
 float ex=1.2-a.x,ey=0.8-a.y;
 float edge=min(ex,ey);
 if(edge<0.17){
  float along=ex<ey?g.y:g.x;
  float across=(edge-0.03)/0.11;
  float zig=abs(fract(along/0.16)-0.5)*2.0;
  vec3 c=RED;
  if(across>0.0&&across<1.0&&abs(across-zig)<0.28)c=CREAM;
  if(edge<0.03)c=NAVY;
  if(edge>0.14)c=MUST;
  return c;}
 vec3 c=CREAM;
 float d=a.x/0.85+a.y/0.55;
 if(d<1.0)c=RED;
 if(d<0.8)c=CREAM;
 if(d<0.62)c=TEAL;
 if(d<0.44)c=ORA;
 if(d<0.24)c=NAVY;
 float k=(1.03-a.x)/0.5+(0.63-a.y)/0.32;
 if(k<1.0)c=TEAL;
 if(k<0.55)c=ORA;
 float sd=abs(a.x-0.5)/0.1+abs(a.y-0.45)/0.1;
 if(sd<1.0)c=NAVY;
 if(sd<0.45)c=MUST;
 return c;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){vec3 q=local(p);vec3 c=rug(q.xz);
  float w=0.5+0.5*sin(q.x*260.0)*sin(q.z*260.0);c*=0.92+0.08*w;
  t.alb=srgb2lin(c);t.rough=0.85;t.spec=0.08;t.sss=0.1;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float rugd=sdRoundBox(q-vec3(0.0,0.04,0.0),vec3(1.2,0.04,0.8),0.03);
 vec2 res=vec2(rugd,100.0);
 // fringes on the short ends
 vec3 f=vec3(abs(q.x),q.y,q.z);
 const float s=0.07;
 float id=clamp(round(f.z/s),-11.0,11.0);
 float len=0.16+0.03*sin(id*2.7);
 float fr=sdCapsule(vec3(f.x,f.y,f.z-id*s),vec3(1.17,0.03,0.0),vec3(1.2+len,0.018,0.012*sin(id*1.9)),0.018);
 res=U(res,vec2(fr,M_ROPE));
 return res;
}`},
 "vorhang":{view:{"cam":[1.0,1.1,8.8],"target":[0.45,-0.1,-0.2],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.2)*q.xz;return q;}
// the view through the window: sky, a cloud and green tree tops
vec3 view(vec2 uv){
 vec3 c=mix(vec3(0.80,0.92,0.99),vec3(0.45,0.72,0.96),smoothstep(-0.4,0.7,uv.y));
 float cl=min(length((uv-vec2(-0.22,0.42))*vec2(1.0,1.8))-0.15,length((uv-vec2(-0.05,0.46))*vec2(1.0,1.6))-0.11);
 c=mix(vec3(1.0),c,smoothstep(0.0,0.012,cl));
 float tree=uv.y-(-0.40+0.08*sin(uv.x*9.0)+0.05*sin(uv.x*23.0+1.0));
 c=mix(vec3(0.33,0.66,0.30),c,smoothstep(-0.006,0.006,tree));
 c=mix(vec3(0.22,0.50,0.24),c,smoothstep(-0.006,0.006,uv.y-(-0.58+0.05*sin(uv.x*12.0))));
 float gl=uv.x*0.7+uv.y;
 c=mix(c,vec3(1.0),0.35*smoothstep(0.06,0.0,abs(gl-0.35)));
 return srgb2lin(c);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==103.0){vec3 q=local(p);t.alb=view(q.xy-vec2(0.0,-0.05));t.rough=0.1;t.spec=0.8;return true;}
 if(m==102.0){t.alb=srgb2lin(vec3(0.38,0.52,0.30));t.rough=0.8;t.spec=0.1;t.sss=0.2;return true;}
 return false;}
// one curtain (the right one, mirrored for the left): folds gathered by a tie-back
float curtain(vec3 q){
 float d=1e9;
 for(int i=0;i<5;i++){
  float fi=float(i);float zo=mod(fi,2.0)*2.0-1.0;
  vec3 top=vec3(0.46+fi*0.18,0.88,0.2+0.04*zo);
  vec3 tie=vec3(0.78+fi*0.045,-0.2,0.2+0.03*zo);
  vec3 bot=vec3(0.55+fi*0.15,-1.0,0.2+0.05*zo);
  float f=min(sdRoundCone(q,top,tie,0.1,0.065),sdRoundCone(q,tie,bot,0.065,0.11));
  d=smin(d,f,0.07);
 }
 d=smin(d,sdRoundBox(q-vec3(0.82,0.9,0.2),vec3(0.46,0.05,0.07),0.04),0.04);
 d=smax(d,-(q.y+1.04),0.03);
 return d;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 m=vec3(abs(q.x),q.y,q.z);
 vec2 res=vec2(curtain(m),M_SAGE);
 // tie-backs
 vec3 tb=m-vec3(0.87,-0.2,0.2);
 res=U(res,vec2(sdTorus(vec3(tb.x,tb.y,tb.z*1.5),vec2(0.17,0.045))/1.5,102.0));
 // rod with round finials and curtain rings
 float rod=sdCapsule(q,vec3(-1.3,1.0,0.2),vec3(1.3,1.0,0.2),0.045);
 rod=min(rod,length(m-vec3(1.36,1.0,0.2))-0.09);
 res=U(res,vec2(rod,M_DARKWOOD));
 float rings=1e9;
 for(int i=0;i<5;i++){float x=0.46+float(i)*0.18;rings=min(rings,sdTorus(vec3(q.y-1.0,m.x-x,q.z-0.2),vec2(0.075,0.018)));}
 res=U(res,vec2(rings,M_BRASS));
 // small white window with cross bars and a sill
 vec3 w=q-vec3(0.0,-0.05,0.0);
 float fr=sdRoundBox(w,vec3(0.62,0.78,0.07),0.04);
 fr=max(fr,-sdBox(w,vec3(0.5,0.66,0.2)));
 fr=min(fr,min(sdRoundBox(w,vec3(0.025,0.66,0.035),0.012),sdRoundBox(w-vec3(0.0,0.08,0.0),vec3(0.5,0.025,0.035),0.012)));
 fr=min(fr,sdRoundBox(w-vec3(0.0,-0.8,0.06),vec3(0.74,0.04,0.14),0.02));
 res=U(res,vec2(fr,M_WHITE));
 res=U(res,vec2(sdBox(w-vec3(0.0,0.0,-0.03),vec3(0.51,0.67,0.01)),103.0));
 return res;
}`},
 "fernseher":{view:{"cam":[1.3,1.5,7.6],"target":[0.25,-0.1,-0.1],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.4)*q.xz;return q;}
// soft colourful glow with a few round shapes and a glass reflection
vec3 screen(vec2 uv){
 vec3 c=mix(vec3(0.20,0.30,0.82),vec3(0.62,0.32,0.84),smoothstep(-0.8,0.6,uv.x+uv.y*0.5));
 c=mix(c,vec3(0.98,0.48,0.62),smoothstep(0.2,1.2,uv.x-uv.y*0.6));
 c=mix(c,vec3(1.0,0.82,0.35),smoothstep(0.24,0.20,length(uv-vec2(0.45,0.12)))*0.95);
 c=mix(c,vec3(0.40,0.90,0.85),smoothstep(0.17,0.13,length(uv-vec2(-0.45,-0.18)))*0.9);
 c=mix(c,vec3(1.0,0.62,0.78),smoothstep(0.12,0.09,length(uv-vec2(-0.05,0.32)))*0.9);
 float s=uv.x*0.6+uv.y;
 c=mix(c,vec3(1.0),0.22*smoothstep(0.1,0.0,abs(s-0.55)));
 return c;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){vec3 q=local(p);t.alb=srgb2lin(screen(q.xy-vec2(0.0,0.25)))*1.5;t.rough=0.1;t.spec=0.8;t.sss=0.6;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 s=q-vec3(0.0,0.25,0.0);
 // thin black bezel with a recess for the screen and a slim back housing
 float bez=sdRoundBox(s,vec3(1.25,0.74,0.06),0.05);
 bez=max(bez,-sdBox(s-vec3(0.0,0.0,0.07),vec3(1.16,0.65,0.03)));
 bez=smin(bez,sdRoundBox(s-vec3(0.0,-0.05,-0.08),vec3(0.85,0.48,0.06),0.06),0.04);
 vec2 res=vec2(bez,M_DARK);
 res=U(res,vec2(sdBox(s-vec3(0.0,0.0,0.035),vec3(1.16,0.65,0.01)),100.0));
 // stand: neck and flat foot
 float neck=sdRoundBox(q-vec3(0.0,-0.68,-0.06),vec3(0.12,0.22,0.04),0.03);
 float foot=sdRoundBox(q-vec3(0.0,-0.88,0.0),vec3(0.55,0.03,0.25),0.03);
 res=U(res,vec2(min(neck,foot),M_CHARCOAL));
 // small power light
 res=U(res,vec2(length(s-vec3(1.05,-0.7,0.06))-0.018,M_RED));
 return res;
}`},
 "kofferradio":{view:{"cam":[1.5,1.8,7.6],"target":[0.25,0.5,-0.1],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.35)*q.xz;return q;}
float sdBox2(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 vec3 q=local(p);
 if(m==100.0){
  // speaker grille: light mesh with staggered dark holes
  vec2 g=(q.xy-vec2(-0.45,-0.03))/0.075;g.x+=0.5*mod(floor(g.y+0.5),2.0);
  float h=length(fract(g+0.5)-0.5)-0.22;
  t.alb=srgb2lin(mix(vec3(0.18,0.15,0.13),vec3(0.88,0.80,0.64),smoothstep(-0.05,0.05,h)));
  t.rough=0.6;t.spec=0.2;return true;}
 if(m==101.0){
  // tuning scale: cream panel, tick marks, a teal band and a red needle
  vec2 uv=q.xy-vec2(0.48,0.2);
  vec3 c=vec3(0.98,0.93,0.78);
  float tx=fract(uv.x/0.055+0.5)-0.5;
  c=mix(c,vec3(0.25,0.22,0.2),step(abs(tx),0.13)*step(abs(uv.y-0.025),0.04));
  c=mix(c,vec3(0.10,0.55,0.58),step(abs(uv.y+0.055),0.012));
  c=mix(c,vec3(0.9,0.15,0.12),step(abs(uv.x-0.08),0.011));
  t.alb=srgb2lin(c);t.rough=0.15;t.spec=0.8;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 g=q-vec3(-0.45,-0.03,0.32);
 float body=sdRoundBox(q,vec3(1.0,0.6,0.32),0.15);
 body=max(body,-sdCylY(vec3(g.x,g.z,g.y),0.05,0.36,0.0));
 vec2 res=vec2(body,M_ORANGE);
 // chrome trim around the front face
 float steel=length(vec2(sdBox2(q.xy,vec2(0.84,0.44)),q.z-0.32))-0.022;
 // speaker: chrome ring and mesh
 steel=min(steel,sdTorus(vec3(g.x,g.z,g.y),vec2(0.36,0.04)));
 res=U(res,vec2(sdCylY(vec3(g.x,g.z+0.03,g.y),0.02,0.36,0.01),100.0));
 // tuning window with chrome bezel
 vec3 dl=q-vec3(0.48,0.2,0.3);
 res=U(res,vec2(sdRoundBox(dl,vec3(0.3,0.1,0.02),0.02),101.0));
 steel=min(steel,length(vec2(sdBox2(dl.xy,vec2(0.3,0.1)),dl.z-0.025))-0.022);
 // knobs with knurled edges
 vec3 k1=q-vec3(0.62,-0.22,0.36);
 float kn=sdCylY(vec3(k1.x,k1.z,k1.y),0.06,0.15,0.03)+0.008*smoothstep(0.3,1.0,cos(atan(k1.y,k1.x)*18.0));
 vec3 k2=q-vec3(0.25,-0.22,0.35);
 kn=min(kn,sdCylY(vec3(k2.x,k2.z,k2.y),0.05,0.1,0.025)+0.006*smoothstep(0.3,1.0,cos(atan(k2.y,k2.x)*14.0)));
 steel=min(steel,kn);
 // carrying handle
 vec3 hm=vec3(abs(q.x),q.y,q.z);
 float hd=smin(sdCapsule(hm,vec3(0.62,0.55,0.0),vec3(0.56,0.88,0.0),0.055),sdCapsule(hm,vec3(0.56,0.88,0.0),vec3(0.0,0.88,0.0),0.07),0.06);
 steel=min(steel,hd);
 // telescopic antenna from the back right corner
 vec3 ab=vec3(0.78,0.64,-0.14);
 vec3 ad=normalize(vec3(-0.45,1.0,-0.12));
 float ant=length(q-ab)-0.065;
 ant=min(ant,sdCapsule(q,ab,ab+ad*0.5,0.032));
 ant=min(ant,sdCapsule(q,ab+ad*0.5,ab+ad*1.0,0.024));
 ant=min(ant,sdCapsule(q,ab+ad*1.0,ab+ad*1.42,0.017));
 ant=min(ant,length(q-ab-ad*1.44)-0.04);
 steel=min(steel,ant);
 res=U(res,vec2(steel,M_STEEL));
 // rubber feet
 res=U(res,vec2(sdCylY(vec3(abs(q.x)-0.75,q.y+0.6,abs(q.z)-0.18),0.04,0.07,0.02),M_RUBBER));
 return res;
}`},
 "plattenspieler":{view:{"cam":[1.0,4.1,5.9],"target":[0.1,-0.1,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.3)*q.xz;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.z,q.x,q.y);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 vec3 q=local(p);
 vec2 r=q.xz-vec2(-0.25,0.0);float rr=length(r);
 if(m==100.0){
  // black vinyl: fine grooves, track gaps and a soft sheen
  float a=atan(r.y,r.x);
  float groove=0.5+0.5*sin(rr*220.0);
  float gaps=smoothstep(0.008,0.0,abs(rr-0.38))+smoothstep(0.008,0.0,abs(rr-0.5))+smoothstep(0.008,0.0,abs(rr-0.6));
  float sheen=pow(abs(cos(a-0.6)),16.0)*smoothstep(0.25,0.32,rr);
  t.alb=vec3(0.03+0.012*groove+0.03*gaps+0.08*sheen);t.rough=0.25;t.spec=0.7;return true;}
 if(m==101.0){
  // coloured label with a ring and the centre hole
  vec3 c=vec3(1.0,0.78,0.12);
  c=mix(c,vec3(0.88,0.18,0.14),step(abs(rr-0.17),0.018));
  c=mix(c,vec3(0.88,0.18,0.14),step(rr,0.07));
  t.alb=srgb2lin(c);t.rough=0.35;t.spec=0.5;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // wooden plinth
 vec2 res=vec2(sdRoundBox(q-vec3(0.0,-0.2,0.0),vec3(1.25,0.2,0.92),0.08),M_WOOD);
 // feet
 res=U(res,vec2(sdCylY(vec3(abs(q.x)-1.0,q.y+0.42,abs(q.z)-0.7),0.04,0.1,0.02),M_RUBBER));
 // platter, record, label and spindle
 vec3 c=q-vec3(-0.25,0.0,0.0);
 res=U(res,vec2(sdCylY(c-vec3(0.0,0.04,0.0),0.04,0.74,0.015),M_STEEL));
 res=U(res,vec2(sdCylY(c-vec3(0.0,0.095,0.0),0.015,0.7,0.006),100.0));
 res=U(res,vec2(sdCylY(c-vec3(0.0,0.105,0.0),0.012,0.23,0.004),101.0));
 res=U(res,vec2(sdCylY(c-vec3(0.0,0.14,0.0),0.04,0.025,0.01),M_STEEL));
 // tone arm: pivot, arm, headshell on the record and a counterweight
 vec3 A=vec3(0.85,0.26,-0.5);vec3 B=vec3(0.6,0.24,0.25);vec3 H=vec3(0.3,0.16,0.38);
 float arm=sdCylY(q-vec3(0.85,0.06,-0.5),0.06,0.15,0.03);
 arm=min(arm,sdCylY(q-vec3(0.85,0.18,-0.5),0.08,0.05,0.02));
 arm=min(arm,sdCapsule(q,A,B,0.03));
 arm=min(arm,sdCapsule(q,B,H,0.028));
 res=U(res,vec2(arm,M_STEEL));
 vec3 wd=normalize(A-B);
 res=U(res,vec2(sdCapsule(q,A+wd*0.1,A+wd*0.24,0.075),M_CHARCOAL));
 res=U(res,vec2(sdEllipsoid(q-H,vec3(0.1,0.04,0.07)),M_DARK));
 // arm rest and control knobs
 res=U(res,vec2(sdCylY(q-vec3(1.02,0.07,0.12),0.07,0.03,0.01),M_STEEL));
 res=U(res,vec2(sdCylY(q-vec3(0.95,0.04,0.66),0.04,0.09,0.02),M_STEEL));
 res=U(res,vec2(sdCylY(q-vec3(0.68,0.03,0.72),0.03,0.06,0.015),M_RED));
 return res;
}`},
};
