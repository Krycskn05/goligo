// Shader models for the Nesne Kasası: kitchen things, tableware, fruit and household cleaning appliances.
module.exports={
 "herd":{view:{"cam":[3.0,3.9,7.0],"target":[0,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.12)*q.xz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // enamelled silver cabinet
 if(m==100.0){t.alb=srgb2lin(vec3(0.64,0.67,0.71));t.rough=0.22;t.spec=0.8;return true;}
 // dark oven window with a warm glow at the bottom
 if(m==101.0){vec3 q=local(p);float g=smoothstep(0.0,-0.45,q.y);
  t.alb=srgb2lin(mix(vec3(0.06,0.06,0.07),vec3(0.55,0.26,0.08),g*0.4));t.rough=0.05;t.spec=1.0;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // cabinet, top surface at y=0.8
 float body=sdRoundBox(q-vec3(0,0.03,-0.02),vec3(0.8,0.77,0.7),0.07);
 vec2 res=vec2(body,100.0);
 // dark plinth
 res=U(res,vec2(sdRoundBox(q-vec3(0,-0.8,-0.04),vec3(0.74,0.07,0.62),0.03),M_DARK));
 // oven door slab with a window
 float door=sdRoundBox(q-vec3(0,-0.17,0.71),vec3(0.75,0.5,0.05),0.04);
 float win=sdRoundBox(q-vec3(0,-0.24,0.8),vec3(0.52,0.26,0.09),0.07);
 door=max(door,-win);
 res=U(res,vec2(door,100.0));
 res=U(res,vec2(sdRoundBox(q-vec3(0,-0.24,0.7),vec3(0.53,0.27,0.03),0.07),101.0));
 // door handle bar
 float bar=sdCapsule(q,vec3(-0.6,0.2,0.88),vec3(0.6,0.2,0.88),0.045);
 bar=min(bar,sdCapsule(vec3(abs(q.x),q.y,q.z),vec3(0.52,0.2,0.74),vec3(0.52,0.2,0.88),0.032));
 res=U(res,vec2(bar,M_STEEL));
 // knobs on the control strip
 vec3 k=q-vec3(0,0.58,0.68);
 k.x-=clamp(round(k.x/0.29),-2.0,2.0)*0.29;
 float knob=sdCylY(vec3(k.x,k.z-0.05,k.y),0.06,0.085,0.025);
 knob=max(knob,-sdBox(k-vec3(0,0.045,0.12),vec3(0.014,0.055,0.03)));
 res=U(res,vec2(knob,M_DARK));
 // four gas burners on top
 vec3 b=vec3(abs(q.x)-0.38,q.y-0.8,abs(q.z+0.02)-0.33);
 float plate=sdCylY(b-vec3(0,0.01,0),0.015,0.25,0.01);
 float cap=sdCylY(b-vec3(0,0.06,0),0.03,0.1,0.02);
 float ring=sdTorus(b-vec3(0,0.1,0),vec2(0.22,0.022));
 float spokes=min(sdBox(b-vec3(0,0.1,0),vec3(0.26,0.02,0.02)),sdBox(b-vec3(0,0.1,0),vec3(0.02,0.02,0.26)));
 spokes=max(spokes,-(length(b.xz)-0.13));
 res=U(res,vec2(min(min(plate,cap),min(ring,spokes)),M_DARK));
 float crown=sdCylY(b-vec3(0,0.04,0),0.025,0.14,0.015);
 res=U(res,vec2(crown,M_CHARCOAL));
 return res;
}`},
 "kuehlschrank":{view:{"cam":[-2.3,2.0,6.0],"target":[0,0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.15)*q.xz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // retro cream enamel
 if(m==100.0){t.alb=srgb2lin(vec3(0.95,0.86,0.64));t.rough=0.25;t.spec=0.6;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float body=sdRoundBox(q-vec3(0,0.04,0),vec3(0.64,1.12,0.5),0.22);
 // seams: around the doors and between the two doors
 float seam=sdBox(q-vec3(0,0.04,0.34),vec3(0.9,1.4,0.012));
 seam=min(seam,sdBox(q-vec3(0,0.42,0.5),vec3(0.9,0.014,0.15)));
 seam=max(seam,-(body+0.03));
 body=max(body,-seam);
 vec2 res=vec2(body,100.0);
 // chrome handles
 float h1=sdCapsule(q,vec3(-0.4,0.6,0.6),vec3(-0.4,0.9,0.6),0.045);
 h1=min(h1,sdCapsule(q,vec3(-0.4,0.62,0.46),vec3(-0.4,0.62,0.6),0.035));
 float h2=sdCapsule(q,vec3(-0.4,-0.05,0.6),vec3(-0.4,0.28,0.6),0.045);
 h2=min(h2,sdCapsule(q,vec3(-0.4,0.26,0.46),vec3(-0.4,0.26,0.6),0.035));
 res=U(res,vec2(min(h1,h2),M_STEEL));
 // feet
 float feet=sdCylY(vec3(abs(q.x)-0.42,q.y+1.12,abs(q.z)-0.3),0.08,0.07,0.02);
 res=U(res,vec2(feet,M_DARK));
 return res;
}`},
 "tasse":{view:{"cam":[0.8,2.6,5.6],"target":[0,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // coffee
 if(m==100.0){t.alb=srgb2lin(vec3(0.24,0.12,0.05));t.rough=0.12;t.spec=0.8;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=p;
 // bowl: half ellipsoid, widest at the rim (y=0.42)
 float outer=sdEllipsoid(q-vec3(0,0.42,0),vec3(0.8,1.0,0.8));
 outer=max(outer,q.y-0.42);
 outer=smax(outer,-(q.y+0.5),0.05);
 float inner=sdEllipsoid(q-vec3(0,0.42,0),vec3(0.72,0.92,0.72));
 float cup=max(outer,-inner);
 cup=min(cup,sdTorus(q-vec3(0,0.42,0),vec2(0.76,0.04)));
 // foot ring
 cup=smin(cup,sdCylY(q-vec3(0,-0.52,0),0.04,0.36,0.02),0.04);
 // ear-shaped handle on the right
 vec3 h=q-vec3(0.8,0.02,0);h.y*=0.9;
 float handle=sdTorus(h.xzy,vec2(0.28,0.075));
 handle=max(handle,-outer);
 cup=smin(cup,handle,0.04);
 vec2 res=vec2(cup,M_WHITE);
 // a little coffee inside
 res=U(res,vec2(max(inner+0.005,q.y-0.22),100.0));
 return res;
}`},
 "teekanne":{view:{"cam":[0.6,2.5,7.6],"target":[0,0.05,0],"fov":28},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // glossy blue glaze
 if(m==100.0){t.alb=srgb2lin(vec3(0.18,0.42,0.88));t.rough=0.15;t.spec=0.85;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=p;
 float body=sdEllipsoid(q-vec3(0,-0.05,0),vec3(0.88,0.7,0.88));
 body=smax(body,-(q.y+0.66),0.06);
 body=smin(body,sdCylY(q-vec3(0,-0.66,0),0.04,0.5,0.03),0.05);
 // lid: rim, dome and knob
 float lid=sdEllipsoid(q-vec3(0,0.58,0),vec3(0.42,0.2,0.42));
 lid=max(lid,-(q.y-0.58));
 lid=min(lid,sdTorus(q-vec3(0,0.58,0),vec2(0.43,0.04)));
 lid=smin(lid,sdCylY(q-vec3(0,0.82,0),0.05,0.06,0.02),0.04);
 lid=smin(lid,length(q-vec3(0,0.93,0))-0.1,0.03);
 // curved spout on the left
 // tapered tube along a curve, sampled as a chain of round cones
 vec3 A=vec3(-0.55,-0.3,0),B=vec3(-1.3,-0.22,0),C=vec3(-1.4,0.52,0);
 float sp=1e9;vec3 prev=A;float rp=0.2;
 for(int i=1;i<=8;i++){float t=float(i)/8.0;float s=1.0-t;vec3 cur=s*s*A+2.0*s*t*B+t*t*C;float rc=mix(0.2,0.075,sqrt(t));
  sp=min(sp,sdRoundCone(q,prev,cur,rp,rc));prev=cur;rp=rc;}
 vec3 dir=normalize(C-B);
 sp=max(sp,dot(q-C,dir));
 sp=max(sp,-sdCapsule(q,C-dir*0.25,C+dir*0.2,0.045));
 body=smin(body,sp,0.08);
 // loop handle on the right
 vec3 h=q-vec3(0.82,0.02,0);h.y*=0.85;
 float handle=sdTorus(h.xzy,vec2(0.36,0.075));
 handle=max(handle,-(sdEllipsoid(q-vec3(0,-0.05,0),vec3(0.86,0.68,0.86))));
 body=smin(body,handle,0.05);
 vec2 res=vec2(body,100.0);
 res=U(res,vec2(lid,100.0));
 return res;
}`},
 "teller":{view:{"cam":[0.5,3.2,5.4],"target":[0,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // cool white porcelain, so it stands out from the cream background
 if(m==100.0){t.alb=srgb2lin(vec3(0.94,0.95,0.97));t.rough=0.2;t.spec=0.7;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec2 q=vec2(length(p.xz),p.y);
 // profile: flat well, short slope, wide rim
 float d=sdSeg2(q,vec2(0.0,0.0),vec2(0.7,0.0));
 d=min(d,sdSeg2(q,vec2(0.7,0.0),vec2(0.86,0.08)));
 d=min(d,sdSeg2(q,vec2(0.86,0.08),vec2(1.28,0.16)));
 d-=0.045;
 // foot ring
 d=smin(d,sdTorus(p-vec3(0,-0.045,0),vec2(0.55,0.03)),0.02);
 return vec2(d,100.0);
}`},
 "tischdecke":{view:{"cam":[1.6,3.2,5.2],"target":[0,-0.1,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.05)*q.xz;q.y+=0.15;return q;}
vec3 gingham(vec2 uv){
 float s=0.19;
 float a=smoothstep(-0.25,0.25,sin(uv.x*6.2832/s));
 float b=smoothstep(-0.25,0.25,sin(uv.y*6.2832/s));
 vec3 c=mix(vec3(0.98,0.96,0.93),vec3(0.95,0.56,0.54),max(a,b));
 return mix(c,vec3(0.84,0.12,0.13),a*b);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m!=100.0&&m!=101.0)return false;
 vec3 q=local(p);vec3 ln=n;ln.xz=rot(0.05)*ln.xz;vec3 an=abs(ln);
 vec2 uv=an.y>max(an.x,an.z)?q.xz:(an.x>an.z?vec2(q.z,q.y*1.6):vec2(q.x,q.y*1.6));
 if(m==101.0)uv=q.xy;
 t.alb=srgb2lin(gingham(uv));t.rough=0.8;t.spec=0.12;t.sss=0.2;return true;}
float sdTri(vec2 p,vec2 p0,vec2 p1,vec2 p2){
 vec2 e0=p1-p0,e1=p2-p1,e2=p0-p2;vec2 v0=p-p0,v1=p-p1,v2=p-p2;
 vec2 pq0=v0-e0*clamp(dot(v0,e0)/dot(e0,e0),0.0,1.0);
 vec2 pq1=v1-e1*clamp(dot(v1,e1)/dot(e1,e1),0.0,1.0);
 vec2 pq2=v2-e2*clamp(dot(v2,e2)/dot(e2,e2),0.0,1.0);
 float s=sign(e0.x*e2.y-e0.y*e2.x);
 vec2 d=min(min(vec2(dot(pq0,pq0),s*(v0.x*e0.y-v0.y*e0.x)),vec2(dot(pq1,pq1),s*(v1.x*e1.y-v1.y*e1.x))),vec2(dot(pq2,pq2),s*(v2.x*e2.y-v2.y*e2.x)));
 return -sqrt(d.x)*sign(d.y);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float d=1e9;
 // four folded layers
 for(int i=0;i<4;i++){
  float fi=float(i);
  vec3 l=q-vec3(0.025*sin(fi*2.1),fi*0.115,0.02*cos(fi*1.7));
  l.y-=0.012*sin(l.x*4.0+fi)*sin(l.z*3.0);
  d=min(d,sdRoundBox(l,vec3(0.9,0.055,0.66),0.055));
 }
 // fold bulges joining the layers at alternating edges
 float f1=sdCapsule(q,vec3(-0.88,0.0575,0.66),vec3(0.88,0.0575,0.66),0.11);
 float f2=sdCapsule(q,vec3(-0.88,0.1725,-0.66),vec3(0.88,0.1725,-0.66),0.11);
 float f3=sdCapsule(q,vec3(-0.88,0.2875,0.66),vec3(0.88,0.2875,0.66),0.11);
 d=smin(d,min(f1,min(f2,f3)),0.03);
 vec2 res=vec2(d,100.0);
 // a corner of the top layer hangs down over the front edge
 float zf=0.8+0.35*pow(max(0.38-q.y,0.0),2.0)+0.02*sin(q.x*9.0);
 float tri=sdTri(q.xy,vec2(-0.8,0.4),vec2(0.3,0.4),vec2(-0.38,-0.04))+0.02;
 vec2 w=vec2(tri,abs(q.z-zf)-0.012);
 float flap=(min(max(w.x,w.y),0.0)+length(max(w,0.0))-0.02)*0.85;
 res=U(res,vec2(smin(flap,f3+0.01,0.04),101.0));
 return res;
}`},
 "flasche":{view:{"cam":[0.6,1.6,6.6],"target":[0,0,0],"fov":28},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // glossy green glass
 if(m==100.0){float f=clamp(dot(n,normalize(vec3(0.6,1.6,6.6)-p)),0.0,1.0);
  vec3 c=mix(vec3(0.02,0.16,0.06),vec3(0.10,0.45,0.18),f*f);
  // tall soft reflection strip, like light on glass
  float a=atan(n.x,n.z);
  float strip=smoothstep(0.12,0.04,abs(a+0.45))*smoothstep(0.75,0.3,abs(n.y));
  c=mix(c,vec3(0.80,0.95,0.82),strip*0.75);
  t.alb=srgb2lin(c);t.rough=0.05;t.spec=1.0;t.sss=0.3;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=p;
 float body=sdCylY(q-vec3(0,-0.5,0),0.72,0.48,0.1);
 float neck=sdCylY(q-vec3(0,0.72,0),0.5,0.16,0.04);
 float d=smin(body,neck,0.32);
 d=smin(d,sdTorus(q-vec3(0,1.17,0),vec2(0.155,0.05)),0.02);
 d=min(d,sdTorus(q-vec3(0,1.03,0),vec2(0.16,0.03)));
 // opening
 d=max(d,-sdCylY(q-vec3(0,1.3,0),0.25,0.09,0.0));
 return vec2(d,100.0);
}`},
 "apfel":{view:{"cam":[0.3,1.8,6.2],"target":[0,0.1,0],"fov":28},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // shiny red skin with faint streaks
 if(m==100.0){float s=fbm(vec3(atan(p.z,p.x)*3.0,p.y*1.2,0.5));
  vec3 c=mix(vec3(0.86,0.09,0.10),vec3(0.96,0.30,0.14),smoothstep(0.35,0.75,s)*0.6);
  c=mix(c,vec3(0.90,0.55,0.20),smoothstep(0.35,0.1,length(p.xz))*smoothstep(0.4,0.8,p.y)*0.6);
  t.alb=srgb2lin(c);t.rough=0.16;t.spec=0.9;return true;}
 return false;}
float leaf(vec3 l){
 l.y-=0.5*l.x*l.x;
 float R=0.36,o=0.24;
 float d2=max(length(vec2(l.x,l.z+o))-R,length(vec2(l.x,l.z-o))-R);
 return max(d2,abs(l.y)-0.012)-0.012;}
vec2 objectMap(vec3 p){
 vec3 q=p;
 float r=length(q.xz);
 float k=1.0+0.13*smoothstep(0.3,-0.9,q.y);
 float d=(length(vec3(q.x*k,q.y*1.06,q.z*k))-0.9)/k;
 d+=0.22*exp(-r*r*14.0)*smoothstep(0.2,0.8,q.y);
 d+=0.10*exp(-r*r*20.0)*smoothstep(-0.2,-0.8,q.y);
 d*=0.85;
 vec2 res=vec2(d,100.0);
 // stem
 float stem=sdCapsule(q,vec3(0,0.6,0),vec3(0.02,0.9,0),0.04);
 stem=smin(stem,sdCapsule(q,vec3(0.02,0.9,0),vec3(0.09,1.05,0.02),0.035),0.02);
 res=U(res,vec2(stem,M_BROWN));
 // leaf
 vec3 l=q-vec3(0.33,0.98,0.1);
 l.xy=rot(-0.35)*l.xy;l.xz=rot(-0.35)*l.xz;l.yz=rot(0.5)*l.yz;
 res=U(res,vec2(leaf(l)*0.8,M_GREEN));
 return res;
}`},
 "besen":{view:{"cam":[0.6,1.7,8.6],"target":[0,0,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.35)*q.xz;q.xy=rot(-0.6)*q.xy;q.y-=0.15;return q;}
vec3 objectWoodSpace(vec3 p){return local(p);}
float headW(float y){float t=clamp((-0.45-y)/1.15,0.0,1.0);return mix(0.12,0.62,pow(t,0.7));}
float headT(float y){float t=clamp((-0.45-y)/1.15,0.0,1.0);return mix(0.13,0.09,t);}
float cross2(vec3 q,float grow){float w=headW(q.y),th=headT(q.y)+grow;vec2 e=abs(q.xz)-vec2(max(w-th,0.0)+grow,0.0);
 return length(max(e,0.0))+min(max(e.x,e.y),0.0)-th;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // straw with fibres along the broom
 if(m==100.0){vec3 q=local(p);float u=q.x/headW(q.y);
  float s=fbm(vec3(u*14.0,q.y*1.5,q.z*30.0));
  float f=0.5+0.5*sin(u*70.0+s*4.0);
  t.alb=srgb2lin(mix(vec3(0.97,0.80,0.40),vec3(0.80,0.57,0.22),f*0.55+s*0.45));t.rough=0.6;t.spec=0.25;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // fan-shaped straw head
 float head=cross2(q,0.0);
 float bottom=-1.6+0.035*sin(q.x*37.0)+0.025*sin(q.x*83.0+1.0);
 head=max(head,bottom-q.y);
 head=max(head,q.y+0.4);
 head+=0.005*sin(q.x/headW(q.y)*45.0);
 vec2 res=vec2(head*0.8,100.0);
 // bindings
 float b1=max(cross2(q,0.02),abs(q.y+0.62)-0.035);
 float b2=max(cross2(q,0.02),abs(q.y+0.8)-0.035);
 res=U(res,vec2(b1*0.8,M_RED));
 res=U(res,vec2(b2*0.8,M_LEAF));
 // long wooden handle
 res=U(res,vec2(sdCapsule(q,vec3(0,-0.5,0),vec3(0,1.85,0),0.065),M_WOOD));
 res=U(res,vec2(sdCapsule(q,vec3(0,1.82,0),vec3(0,1.95,0),0.08),M_RED));
 return res;
}`},
 "staubsauger":{view:{"cam":[1.9,2.5,7.8],"target":[0,0.2,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.25)*q.xz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 // glossy red shell
 if(m==100.0){t.alb=srgb2lin(vec3(0.90,0.12,0.12));t.rough=0.2;t.spec=0.8;return true;}
 return false;}
vec3 bez(vec3 a,vec3 b,vec3 c,vec3 d,float t){float s=1.0-t;return s*s*s*a+3.0*s*s*t*b+3.0*s*t*t*c+t*t*t*d;}
float hose(vec3 q){
 vec3 A=vec3(-0.04,-0.25,0.05),B=vec3(-0.75,-0.35,0.35),C=vec3(0.35,1.9,0.1),D=vec3(-0.18,1.32,0.0);
 float bb=sdBox(q-vec3(-0.2,0.78,0.17),vec3(0.6,1.2,0.25));
 if(bb>0.3)return bb;
 float best=1e9;float bt=0.0;vec3 prev=A;
 for(int i=1;i<=16;i++){float t=float(i)/16.0;vec3 cur=bez(A,B,C,D,t);
  vec3 pa=q-prev,ba=cur-prev;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
  float dd=length(pa-ba*h);if(dd<best){best=dd;bt=(float(i-1)+h)/16.0;}
  prev=cur;}
 return best-0.085-0.01*sin(bt*360.0);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // canister
 vec3 c=q-vec3(0.72,-0.32,0);
 float body=sdEllipsoid(c,vec3(0.72,0.48,0.55));
 body=smax(body,-(q.y+0.7),0.06);
 vec2 res=vec2(body,q.y<-0.56?M_CHARCOAL:100.0);
 // carry handle
 float ch=sdCappedTorus(c-vec3(0,0.3,0),vec2(sin(1.0),cos(1.0)),0.32,0.06);
 res=U(res,vec2(ch,100.0));
 // wheels
 vec3 w=q-vec3(1.0,-0.45,0);w.z=abs(w.z)-0.5;
 res=U(res,vec2(sdCylY(vec3(w.x,w.z,w.y),0.07,0.3,0.04),M_DARK));
 res=U(res,vec2(sdCylY(vec3(w.x,w.z-0.06,w.y),0.04,0.14,0.02),M_GREY));
 // hose inlet and hose
 vec3 i=q-vec3(0.02,-0.25,0.05);
 res=U(res,vec2(sdCylY(vec3(i.y,i.x,i.z),0.06,0.14,0.03),M_CHARCOAL));
 res=U(res,vec2(hose(q)*0.9,M_CHARCOAL));
 // grip and wand
 float grip=sdRoundCone(q,vec3(-0.18,1.32,0),vec3(-0.36,0.98,0.03),0.1,0.08);
 res=U(res,vec2(grip,M_CHARCOAL));
 res=U(res,vec2(sdCapsule(q,vec3(-0.34,1.0,0.03),vec3(-1.15,-0.5,0.2),0.055),M_STEEL));
 // floor nozzle
 res=U(res,vec2(length(q-vec3(-1.17,-0.53,0.2))-0.09,M_CHARCOAL));
 vec3 nz=q-vec3(-1.27,-0.66,0.24);nz.xz=rot(0.3)*nz.xz;
 res=U(res,vec2(sdRoundBox(nz,vec3(0.22,0.07,0.45),0.06),M_CHARCOAL));
 res=U(res,vec2(sdRoundBox(nz-vec3(0,-0.04,0),vec3(0.23,0.035,0.46),0.03),M_DARK));
 return res;
}`},
 "buegeleisen":{view:{"cam":[1.5,3.0,7.5],"target":[0,0,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.35)*q.xz;q.y+=0.45;return q;}
float foot(vec2 v){
 // pointed footprint: nose at x=-1.0, flat back at x=0.85
 float a=length(v-vec2(0.6,2.05))-2.6;
 float b=length(v-vec2(0.6,-2.05))-2.6;
 return max(max(a,b),v.x-0.85);}
float ext(float d2,float y,float h){vec2 w=vec2(d2,abs(y)-h);return min(max(w.x,w.y),0.0)+length(max(w,0.0));}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // steel sole plate
 float sole=ext(foot(q.xz)+0.025,q.y-0.045,0.02)-0.025;
 vec2 res=vec2(sole,M_STEEL);
 // body tapering upwards; top slopes up to the back
 float top=0.5+0.08*q.x;
 float d2=foot(q.xz)+0.04+0.35*max(q.y-0.09,0.0);
 float dy=max(0.1-q.y,q.y-top);
 vec2 w=vec2(d2+0.06,dy+0.06);
 float body=(min(max(w.x,w.y),0.0)+length(max(w,0.0))-0.06)*0.85;
  // handle: rear post, grip and front column
 float h=sdRoundCone(q,vec3(0.68,0.4,0),vec3(0.55,0.98,0),0.11,0.09);
 vec3 g=q;g.z*=1.25;
 h=smin(h,sdCapsule(g,vec3(0.55,0.98,0),vec3(-0.35,0.93,0),0.09),0.06);
 h=smin(h,sdRoundCone(q,vec3(-0.35,0.93,0),vec3(-0.62,0.38,0),0.1,0.15),0.06);
 float hb=smin(h,body,0.05);
 res=U(res,vec2(hb,q.y<0.3?M_WHITE:M_TEAL));
 // white steam buttons on the grip
 res=U(res,vec2(sdEllipsoid(q-vec3(-0.3,1.03,0),vec3(0.07,0.04,0.05)),M_WHITE));
 res=U(res,vec2(sdEllipsoid(q-vec3(-0.15,1.04,0),vec3(0.06,0.035,0.045)),M_WHITE));
 // cord guard and cord at the back
 float cg=sdRoundCone(q,vec3(0.7,0.55,0),vec3(1.0,0.78,-0.05),0.08,0.05);
 cg+=0.008*sin(length(q-vec3(0.7,0.55,0))*90.0);
 res=U(res,vec2(cg*0.9,M_WHITE));
 float cord=sdBox(q-vec3(1.44,0.5,-0.4),vec3(0.52,0.52,0.4));vec3 prev=vec3(0.98,0.77,-0.05);
 if(cord<0.2){cord=1e9;for(int i=1;i<=10;i++){float t=float(i)/10.0;float s=1.0-t;
  vec3 cur=s*s*s*vec3(0.98,0.77,-0.05)+3.0*s*s*t*vec3(1.35,0.98,-0.2)+3.0*s*t*t*vec3(1.6,0.05,-0.3)+t*t*t*vec3(1.9,0.03,-0.75);
  cord=min(cord,sdCapsule(q,prev,cur,0.03));prev=cur;}}
 res=U(res,vec2(cord,M_GREY));
 return res;
}`},
 "waschmaschine":{view:{"cam":[2.8,2.8,7.6],"target":[0,-0.05,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.1)*q.xz;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // cabinet with the drum opening
 float box=sdRoundBox(q,vec3(0.78,0.88,0.72),0.09);
 vec3 dc=q-vec3(0,-0.12,0);
 float hole=sdCylY(vec3(dc.x,dc.z-0.5,dc.y),0.3,0.38,0.0);
 box=max(box,-hole);
 // panel seam and kick plate seam
 float seam=min(sdBox(q-vec3(0,0.52,0.72),vec3(0.9,0.01,0.03)),sdBox(q-vec3(0,-0.72,0.72),vec3(0.9,0.01,0.03)));
 box=max(box,-seam);
 bool inDrum=length(dc.xy)<0.39&&q.z<0.69;
 vec2 res=vec2(box,inDrum?M_GREY:M_WHITE);
 // clothes in the drum
 float c1=length(dc-vec3(-0.12,-0.28,0.32))-0.15;
 float c2=length(dc-vec3(0.14,-0.27,0.3))-0.14;
 float c3=length(dc-vec3(0.02,-0.15,0.22))-0.13;
 res=U(res,vec2(c1,M_BLUE));res=U(res,vec2(c2,M_RED));res=U(res,vec2(c3,M_YELLOW));
 // door ring and rubber seal
 float ring=sdCylY(vec3(dc.x,dc.z-0.75,dc.y),0.05,0.52,0.04);
 ring=max(ring,-(length(dc.xy)-0.37));
 res=U(res,vec2(ring,M_STEEL));
 res=U(res,vec2(sdTorus(vec3(dc.x,dc.z-0.72,dc.y),vec2(0.385,0.035)),M_RUBBER));
 if(!gNoGlass){
  res=U(res,vec2(sdEllipsoid(dc-vec3(0,0,0.76),vec3(0.38,0.38,0.08)),M_CLEAR));
 }
 // control panel: drawer, display, buttons, knob
 res=U(res,vec2(sdRoundBox(q-vec3(-0.46,0.7,0.72),vec3(0.24,0.1,0.03),0.03),M_WHITE));
 res=U(res,vec2(sdBox(q-vec3(-0.46,0.65,0.76),vec3(0.12,0.012,0.02)),M_CHARCOAL));
 res=U(res,vec2(sdRoundBox(q-vec3(0.08,0.72,0.72),vec3(0.14,0.06,0.02),0.02),M_DARK));
 vec3 bt=q-vec3(0.08,0.62,0.72);bt.x-=clamp(round(bt.x/0.1),-1.0,1.0)*0.1;
 res=U(res,vec2(sdCylY(vec3(bt.x,bt.z,bt.y),0.02,0.03,0.01),M_TEAL));
 vec3 kn=q-vec3(0.5,0.69,0.72);
 float knob=sdCylY(vec3(kn.x,kn.z-0.03,kn.y),0.04,0.12,0.03);
 knob=max(knob,-sdBox(kn-vec3(0,0.06,0.08),vec3(0.012,0.05,0.02)));
 res=U(res,vec2(knob,M_GREY));
 // feet
 res=U(res,vec2(sdCylY(vec3(abs(q.x)-0.6,q.y+0.9,abs(q.z)-0.55),0.05,0.06,0.02),M_DARK));
 return res;
}`},
};
