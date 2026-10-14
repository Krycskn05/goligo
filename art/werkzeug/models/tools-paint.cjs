// Shader models for the Nesne Kasası: more tools and painting things (saw, nail, brush, roller, bucket, plank, ladder, spade).
module.exports={
 "saege":{view:{"cam":[0.6,1.6,6.2],"target":[0,0,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.4)*q.xz;q.xy=rot(0.42)*q.xy;q.x+=0.1;return q;}
float ext(float d2,float z,float h,float r){vec2 w=vec2(d2+r,abs(z)-h+r);return min(max(w.x,w.y),0.0)+length(max(w,0.0))-r;}
float rbox2(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // blade along x: tip at x=-1.25, big teeth along the bottom edge
 float tri=1.0-abs(2.0*fract(q.x/0.11)-1.0);
 float yb=-0.22-0.075*tri;
 float top=(q.y-(0.02+(q.x+1.25)*0.165))/1.0135;
 float bot=(yb-q.y)*0.6;
 float d2=max(max(top,bot),max(-1.25-q.x,q.x-0.5));
 float zb=q.z+0.05*(q.y*q.y)/0.09;
 float blade=ext(d2,zb,0.022,0.01)*0.95;
 vec2 res=vec2(blade,M_STEEL);
 // closed orange handle with a hand hole
 vec2 h=q.xy-vec2(0.72,0.04);h=rot(0.25)*h;
 float outer=rbox2(h,vec2(0.36,0.43),0.2);
 float hole=rbox2(h-vec2(0.06,-0.02),vec2(0.15,0.25),0.12);
 float handle=ext(max(outer,-hole),q.z,0.11,0.07);
 res=U(res,vec2(handle,M_ORANGE));
 // brass rivets
 vec3 r1=q-vec3(0.46,0.2,0.0);vec3 r2=q-vec3(0.46,-0.12,0.0);
 float riv=min(sdCylY(r1.xzy,0.125,0.045,0.015),sdCylY(r2.xzy,0.125,0.045,0.015));
 res=U(res,vec2(riv,M_BRASS));
 return res;
}`},
 "nagel":{view:{"cam":[0.4,2.2,7.0],"target":[0,-0.05,0],"fov":27},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.3)*q.xz;q.xy=rot(-0.28)*q.xy;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // smooth round shank from the head down to the point
 float shank=sdCylY(q-vec3(0,0.18,0),0.84,0.125,0.0);
 float tip=sdRoundCone(q,vec3(0,-0.66,0),vec3(0,-1.24,0),0.125,0.006);
 float d=min(shank,tip);
 // flat round head
 float head=sdCylY(q-vec3(0,1.0,0),0.055,0.36,0.035);
 d=smin(d,head,0.05);
 return vec2(d,M_STEEL);
}`},
 "pinsel":{view:{"cam":[0.4,1.9,7.0],"target":[0,-0.05,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.5)*q.xz;q.xy=rot(-0.6)*q.xy;return q;}
vec3 objectWoodSpace(vec3 p){return local(p);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 vec3 q=local(p);
 if(m==100.0){float s=fbm(vec3(q.x*70.0,q.y*3.0,q.z*70.0));t.alb=srgb2lin(mix(vec3(0.98,0.82,0.38),vec3(0.84,0.60,0.22),s));t.rough=0.6;t.spec=0.25;return true;}
 if(m==101.0){t.alb=srgb2lin(vec3(0.12,0.42,0.95));t.rough=0.12;t.spec=0.9;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // flat bristle block, tips at y=-1.2
 float t=clamp((-0.45-q.y)/0.75,0.0,1.0);
 vec3 b=q-vec3(0,-0.83,0);
 b.y-=0.08*(q.x/0.42)*(q.x/0.42);
 float br=sdRoundBox(b,vec3(0.42-0.03*t,0.38,0.13-0.05*t),0.06);
 br+=0.004*sin(q.x*140.0+3.0*noise3(q*vec3(20.0,2.0,20.0)))*smoothstep(-0.5,-0.6,q.y);
 // blue paint on the tips
 float paintLine=-0.88+0.05*sin(q.x*13.0)+0.04*sin(q.x*29.0+1.0);
 br-=0.012*smoothstep(paintLine+0.02,paintLine-0.03,q.y);
 vec2 res=vec2(br,q.y<paintLine?101.0:100.0);
 // drop of paint at the tip
 float drop=sdRoundCone(q,vec3(-0.12,-1.22,0.0),vec3(-0.12,-1.06,0.0),0.055,0.03);
 res=U(res,vec2(drop,101.0));
 // metal ferrule with crimp lines
 float f=clamp((q.y+0.5)/0.38,0.0,1.0);
 float fe=sdRoundBox(q-vec3(0,-0.31,0),vec3(0.46-0.1*f,0.19,0.16-0.03*f),0.07);
 fe+=0.01*(1.0-smoothstep(0.0,0.018,abs(q.y+0.2)));
 fe+=0.01*(1.0-smoothstep(0.0,0.018,abs(q.y+0.27)));
 res=U(res,vec2(fe,M_STEEL));
 // wooden handle: narrow neck, wide paddle with a hole
 vec3 hq=vec3(q.x,q.y,q.z*1.45);
 float hd=smin(sdRoundCone(hq,vec3(0,-0.15,0),vec3(0,0.25,0),0.17,0.1),sdRoundCone(hq,vec3(0,0.25,0),vec3(0,1.05,0),0.1,0.17),0.2)/1.45;
 float hole=length(q.xy-vec2(0.0,1.0))-0.055;
 hd=max(hd,-hole);
 res=U(res,vec2(hd,M_WOOD));
 return res;
}`},
 "farbrolle":{view:{"cam":[1.0,1.8,6.0],"target":[0,-0.1,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.5)*q.xz;q.xy=rot(0.25)*q.xy;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  vec3 q=local(p);vec3 c=q-vec3(-0.3,0.45,0.0);
  float a=atan(c.z,c.y);
  float s=0.5+0.5*sin(a*1.0+c.x*14.0+2.0*fbm(c*6.0));
  float fz=fbm(c*55.0);
  vec3 col=mix(vec3(0.06,0.50,0.54),vec3(0.16,0.66,0.68),s*0.7+fz*0.5);
  t.alb=srgb2lin(col);t.rough=0.9;t.spec=0.08;t.sss=0.25;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // fluffy roller along x
 vec3 c=q-vec3(-0.3,0.45,0.0);
 float roll=sdCylY(vec3(c.y,c.x,c.z),0.62,0.3,0.09);
 roll-=0.012*noise3(c*40.0);
 vec2 res=vec2(roll,100.0);
 // end caps
 float caps=sdCylY(vec3(c.y,abs(c.x)-0.62,c.z),0.025,0.12,0.015);
 res=U(res,vec2(caps,M_GREY));
 // bent wire frame: axle, round bend down, then a kink into the handle
 vec2 a=q.xy;
 float wa=sdSeg2(a,vec2(0.3,0.45),vec2(0.56,0.45));
 vec2 ac=a-vec2(0.56,0.29);
 float warc=(ac.x>0.0&&ac.y>0.0)?abs(length(ac)-0.16):1e9;
 float wb=sdSeg2(a,vec2(0.72,0.29),vec2(0.72,0.02));
 float wc=sdSeg2(a,vec2(0.72,0.02),vec2(0.52,-0.3));
 float w2=min(min(wa,warc),min(wb,wc));
 float w=length(vec2(w2,q.z))-0.04;
 res=U(res,vec2(w,M_STEEL));
 // handle
 float ferr=sdRoundCone(q,vec3(0.52,-0.3,0.0),vec3(0.53,-0.44,0.0),0.07,0.09);
 res=U(res,vec2(ferr,M_STEEL));
 float hd=sdRoundCone(q,vec3(0.53,-0.5,0.0),vec3(0.6,-1.2,0.0),0.115,0.14);
 hd+=0.008*smoothstep(0.4,1.0,sin(q.y*40.0))*step(q.y,-0.6)*step(-1.1,q.y);
 res=U(res,vec2(hd,M_ORANGE));
 return res;
}`},
 "eimer":{view:{"cam":[0,2.9,5.0],"target":[0,-0.1,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.45)*q.xz;q.y+=0.05;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // empty bucket
 float outer=sdCappedCone(q,0.62,0.5,0.66);
 float inner=sdCappedCone(q-vec3(0,0.07,0),0.62,0.45,0.61);
 float bucket=smax(outer,-inner,0.02);
 float rim=sdTorus(q-vec3(0,0.62,0),vec2(0.645,0.05));
 bucket=smin(bucket,rim,0.02);
 float band=sdTorus(q-vec3(0,0.42,0),vec2(0.625,0.022));
 bucket=min(bucket,band);
 float foot=sdTorus(q-vec3(0,-0.58,0),vec2(0.5,0.03));
 bucket=min(bucket,foot);
 // ears for the handle
 float ears=sdRoundBox(vec3(abs(q.x)-0.66,q.y-0.48,q.z),vec3(0.05,0.1,0.09),0.04);
 bucket=smin(bucket,ears,0.03);
 vec2 res=vec2(bucket,M_TEAL);
 // wire handle folded down to the front
 vec3 h=q-vec3(0,0.48,0);
 h.yz=rot(1.92)*h.yz;
 float arc=max(sdTorus(h.xzy,vec2(0.73,0.025)),-h.y);
 res=U(res,vec2(arc,M_STEEL));
 float pins=sdCylY(vec3(q.y-0.48,abs(q.x)-0.72,q.z),0.03,0.045,0.015);
 res=U(res,vec2(pins,M_STEEL));
 float grip=sdCapsule(h,vec3(-0.17,0.73,0),vec3(0.17,0.73,0),0.06);
 res=U(res,vec2(grip,M_CHARCOAL));
 return res;
}`},
 "brett":{view:{"cam":[-1.4,2.9,5.6],"target":[0,-0.1,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.62)*q.xz;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m!=100.0)return false;
 vec3 q=local(p);vec3 ln=n;ln.xz=rot(-0.62)*ln.xz;
 // growth rings around a pith below the board, slightly tilted for cathedral grain
 vec2 c=vec2(-0.6+0.05*q.x,0.08+0.04*sin(q.x*1.3));
 float rr=length(vec2(q.y,q.z)-c);
 rr+=0.012*fbm(vec3(q.x*2.0,q.y*12.0,q.z*12.0));
 // knot on the top face
 float kd=length(vec2((q.x-0.35)*0.55,q.z+0.06));
 rr+=0.05*exp(-kd*kd*120.0);
 float ring=0.5+0.5*sin(rr*150.0);
 ring=smoothstep(0.35,0.9,ring);
 float fine=fbm(vec3(q.x*1.5,q.y*60.0,q.z*60.0));
 vec3 col=mix(vec3(0.85,0.57,0.30),vec3(0.63,0.36,0.16),ring*0.85+fine*0.25);
 col=mix(col,vec3(0.45,0.25,0.11),smoothstep(0.035,0.02,kd));
 if(abs(ln.x)>0.6)col*=0.86;
 t.alb=srgb2lin(col);t.rough=0.5;t.spec=0.3;return true;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float d=sdRoundBox(q,vec3(1.5,0.12,0.3),0.035);
 return vec2(d,100.0);
}`},
 "leiter":{view:{"cam":[0.4,1.4,6.4],"target":[0,0,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.45)*q.xz;q.yz=rot(0.15)*q.yz;return q;}
float railX(float y){return 0.37-0.05*(y/1.25);}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);if(abs(abs(q.x)-railX(q.y))<0.08)return q;return vec3(q.y,q.x,q.z);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // two rails, a bit wider at the bottom
 float rx=abs(q.x)-railX(q.y);
 float rails=sdRoundBox(vec3(rx,q.y,q.z),vec3(0.07,1.25,0.09),0.03);
 // flat rungs
 float id=clamp(round(q.y/0.3-0.5),-4.0,3.0);
 float yr=(id+0.5)*0.3;
 float rungs=sdRoundBox(vec3(q.x,q.y-yr,q.z),vec3(railX(yr)+0.06,0.045,0.065),0.025);
 vec2 res=vec2(min(rails,rungs),M_WOOD);
 // bolt heads on the outside of the rails
 float bolts=sdCylY(vec3(q.y-yr,abs(q.x)-railX(yr)-0.075,q.z),0.012,0.036,0.008);
 res=U(res,vec2(bolts,M_STEEL));
 // rubber feet
 float feet=sdRoundBox(vec3(abs(q.x)-railX(-1.22),q.y+1.22,q.z),vec3(0.09,0.07,0.105),0.03);
 res=U(res,vec2(feet,M_RUBBER));
 return res;
}`},
 "schaufel":{view:{"cam":[0.6,1.6,6.4],"target":[0,0,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.55)*q.xz;q.xy=rot(-0.32)*q.xy;q.y+=0.12;return q;}
vec3 objectWoodSpace(vec3 p){return local(p);}
float ext(float d2,float z,float h,float r){vec2 w=vec2(d2+r,abs(z)-h+r);return min(max(w.x,w.y),0.0)+length(max(w,0.0))-r;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // pointed, dished steel blade (tip at y=-1.3, top edge at y=-0.35)
 const float W=0.42,R=0.95,YC=-0.62,YT=-0.3;
 vec2 b=q.xy;
 float ogive=max(length(b-vec2(W-R,YC))-R,length(b-vec2(R-W,YC))-R);
 vec2 bb=abs(b-vec2(0.0,(YC+YT)*0.5))-vec2(W,(YT-YC)*0.5);
 float box=length(max(bb,0.0))+min(max(bb.x,bb.y),0.0);
 float d2=max(min(ogive,box),b.y-YT);
 float zz=q.z-0.6*q.x*q.x;
 float blade=ext(d2,zz,0.025,0.02)*0.9;
 // rolled top edge (treads)
 float tread=sdCapsule(vec3(q.x,q.y,zz),vec3(-W+0.02,YT,0.0),vec3(W-0.02,YT,0.0),0.04);
 blade=smin(blade,tread,0.02);
 // socket on the back running up to the shaft
 float frog=sdRoundCone(q,vec3(0.0,-0.85,-0.045),vec3(0.0,-0.36,-0.03),0.02,0.08);
 float sock=sdRoundCone(q,vec3(0.0,-0.36,-0.03),vec3(0.0,0.12,0.0),0.1,0.088);
 blade=smin(blade,smin(frog,sock,0.05),0.03);
 vec2 res=vec2(blade,M_STEEL);
 // wooden shaft
 float shaft=sdCapsule(q,vec3(0.0,0.0,0.0),vec3(0.0,1.22,0.0),0.075);
 res=U(res,vec2(shaft,M_WOOD));
 float collar=sdCylY(q-vec3(0.0,1.2,0.0),0.06,0.092,0.02);
 res=U(res,vec2(collar,M_STEEL));
 // D-grip
 float arms=min(sdCapsule(q,vec3(0.0,1.24,0.0),vec3(-0.2,1.52,0.0),0.05),sdCapsule(q,vec3(0.0,1.24,0.0),vec3(0.2,1.52,0.0),0.05));
 float bar=sdCapsule(q,vec3(-0.22,1.54,0.0),vec3(0.22,1.54,0.0),0.07);
 res=U(res,vec2(smin(arms,bar,0.05),M_RED));
 return res;
}`},
};
