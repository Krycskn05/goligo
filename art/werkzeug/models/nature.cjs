// Shader models for the Nesne Kasası: plants and pots, bird, bird cage, feather, goldfish and fish bowl.
module.exports={
 "pflanze":{view:{"cam":[1.0,2.8,7.6],"target":[0.3,-0.1,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.2)*q.xz;q.y+=0.8;return q;}
float dot2(vec2 v){return dot(v,v);}
// heart shape: tip at (0,0), notch at (0,1)
float sdHeart(vec2 p){p.x=abs(p.x);
 if(p.y+p.x>1.0)return sqrt(dot2(p-vec2(0.25,0.75)))-0.3535534;
 return sqrt(min(dot2(p-vec2(0.0,1.0)),dot2(p-0.5*max(p.x+p.y,0.0))))*sign(p.x-p.y);}
// leaf colour: 100..100.9, the fraction is the vein strength
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m>=100.0&&m<101.0){float f=clamp((m-100.0)/0.9,0.0,1.0);
  t.alb=mix(srgb2lin(vec3(0.15,0.56,0.22)),srgb2lin(vec3(0.68,0.89,0.40)),f);t.rough=0.3;t.spec=0.55;t.sss=0.2;return true;}
 return false;}
// terracotta pot on a saucer, base at y=0, soil top near y=0.82
vec2 pot(vec3 q){
 float saucer=sdCylY(q-vec3(0,0.04,0),0.04,0.52,0.03);
 saucer=smax(saucer,-sdCylY(q-vec3(0,0.11,0),0.04,0.46,0.02),0.01);
 vec3 b=q-vec3(0,0.06,0);
 float body=sdCappedCone(b-vec3(0,0.33,0),0.33,0.31,0.45)-0.03;
 float rim=sdCylY(b-vec3(0,0.7,0),0.11,0.54,0.04);
 float d=smin(body,rim,0.02);
 d=smax(d,-sdCylY(b-vec3(0,0.9,0),0.2,0.46,0.03),0.015);
 vec2 res=vec2(min(d,saucer),M_TERRA);
 float soil=sdCylY(b-vec3(0,0.73,0),0.03,0.47,0.02)+0.01*fbm(q*14.0);
 res=U(res,vec2(soil,M_SOIL));
 return res;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 res=pot(q);
 vec3 B=vec3(0,0.8,0);
 for(int i=0;i<12;i++){
  float fi=float(i);
  float ring=i<3?0.0:(i<8?0.5:1.0);
  float yaw=fi*2.39996+0.4;
  float elev=mix(1.3,0.45,ring);
  float len=mix(0.5,0.5,ring);
  float pitch=mix(0.8,-0.25,ring);
  float S=mix(0.5,0.6,ring);
  vec3 dir=vec3(cos(elev)*cos(yaw),sin(elev),cos(elev)*sin(yaw));
  vec3 P=B+dir*len;
  vec3 Ud=vec3(cos(pitch)*cos(yaw),sin(pitch),cos(pitch)*sin(yaw));
  vec3 Vd=vec3(-sin(yaw),0.0,cos(yaw));
  vec3 Wd=cross(Vd,Ud);
  vec3 r=q-P;float u=dot(r,Ud),v=dot(r,Vd),w=dot(r,Wd);
  // droop towards the tip, edges a little up
  w+=0.5*u*u/S-0.35*v*v/S;
  float d2=sdHeart(vec2(v/(0.74*S),1.0-u/S))*0.74*S;
  float d=(length(vec2(max(d2,0.0),w))-0.022)*0.7;
  // veins: midrib and side veins
  float mid=(1.0-smoothstep(0.012,0.025,abs(v)))*step(0.0,u)*step(u,0.85*S);
  float c=(u-abs(v)*0.9)*4.5/S;
  float sv=(1.0-smoothstep(0.03,0.08,abs(fract(c)-0.5)))*smoothstep(0.02,0.05,abs(v))*(1.0-smoothstep(0.16*S,0.28*S,abs(v)))*step(0.08*S,u)*step(u,0.75*S);
  res=U(res,vec2(d,100.0+0.9*max(mid,sv*0.8)));
  res=U(res,vec2(sdCapsule(q,B,P+Ud*0.03,0.03),M_GREEN));
 }
 return res;
}`},
 "palme":{view:{"cam":[1.0,2.5,8.0],"target":[0.35,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.3)*q.xz;q.y+=1.25;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==101.0){t.alb=srgb2lin(vec3(0.66,0.45,0.25));t.rough=0.7;t.spec=0.2;return true;}
 if(m==102.0){t.alb=srgb2lin(vec3(0.40,0.25,0.13));t.rough=0.8;t.spec=0.15;return true;}
 return false;}
// terracotta pot, base at y=0, soil top near y=0.76
vec2 pot(vec3 q){
 float body=sdCappedCone(q-vec3(0,0.33,0),0.33,0.31,0.45)-0.03;
 float rim=sdCylY(q-vec3(0,0.7,0),0.11,0.54,0.04);
 float d=smin(body,rim,0.02);
 d=smax(d,-sdCylY(q-vec3(0,0.9,0),0.2,0.46,0.03),0.015);
 vec2 res=vec2(d,M_TERRA);
 float soil=sdCylY(q-vec3(0,0.73,0),0.03,0.47,0.02)+0.01*fbm(q*14.0);
 res=U(res,vec2(soil,M_SOIL));
 return res;}
// one feather frond: rib along a circular arc in the vertical plane of 'yaw', leaflets on both sides
vec2 frond(vec3 q,vec3 C,float yaw,float elev,float R,float L,float W){
 vec2 dir=vec2(cos(yaw),sin(yaw));
 vec3 r=q-C;
 float x=dot(r.xz,dir);
 float t=dot(r.xz,vec2(-dir.y,dir.x));
 vec2 cen=R*vec2(sin(elev),-cos(elev));
 vec2 rel=vec2(x,r.y)-cen;
 vec2 sv=vec2(-sin(elev),cos(elev));
 float s=R*atan(rel.x*sv.y-rel.y*sv.x,dot(rel,sv));
 float nn=length(rel)-R;
 float sl=clamp(s/L,0.0,1.0);
 float w=W*2.6*sqrt(sl)*(1.0-sl)+0.01;
 float at=abs(t);
 float f=9.0/L;
 float strip=(abs(fract(s*f-at*f*0.7)-0.5)-0.19)/f;
 strip=min(strip,at-0.045);
 float d2=max(max(at-w,strip),max(-s,s-L));
 float ns=nn+0.3*at;
 float blade=(length(vec2(max(d2,0.0),ns))-0.016)*0.6;
 float rib=(length(vec3(nn,t,max(max(-s,s-L),0.0)))-0.032*(1.0-0.6*sl))*0.8;
 return U(vec2(blade,M_GREEN),vec2(rib,M_LIME));}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 res=pot(q);
 // ringed trunk
 const float H=1.25;
 vec3 t=q-vec3(0,0.7,0);
 t.x-=0.05*t.y*t.y;
 float yy=clamp(t.y,0.0,H);
 float ph=fract(t.y*8.0);
 float rr=mix(0.18,0.12,yy/H)+0.035*smoothstep(0.0,0.8,ph)*(1.0-smoothstep(0.8,1.0,ph));
 float tr=(length(t.xz)-rr)*0.6;
 tr=max(tr,max(-t.y,t.y-H));
 res=U(res,vec2(tr,ph<0.22?102.0:101.0));
 // crown
 vec3 C=vec3(0.05*H*H,0.7+H+0.02,0.0);
 res=U(res,vec2(sdEllipsoid(q-C,vec3(0.17,0.14,0.17)),M_LEAF));
 for(int i=0;i<11;i++){
  float fi=float(i);
  float yaw=fi*0.6981+0.25+0.2*sin(fi*3.7);
  float elev=0.75+0.35*fract(fi*0.618);
  float R=0.72+0.2*fract(fi*0.37);
  float L=1.4+0.3*fract(fi*0.73);
  float W=0.4;
  if(i>=9){yaw=fi*2.1;elev=1.35;R=1.6;L=0.95;W=0.3;}
  res=U(res,frond(q,C,yaw,elev,R,L,W));
 }
 return res;
}`},
 "blumentopf":{view:{"cam":[0.6,3.6,7.0],"target":[0.3,-0.15,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.y+=0.8;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // tapered body with a thick rim band, open at the top
 float body=sdCappedCone(q-vec3(0,0.62,0),0.62,0.6,0.86)-0.04;
 float rim=sdCylY(q-vec3(0,1.38,0),0.16,1.0,0.05);
 float d=smin(body,rim,0.03);
 float inner=sdCappedCone(q-vec3(0,0.98,0),0.84,0.5,0.86)-0.03;
 d=smax(d,-inner,0.03);
 // drainage hole in the floor
 d=max(d,-sdCylY(q-vec3(0,0.1,0),0.2,0.09,0.0));
 // shadow rays: make the thin wall count as fully solid, so the light does not leak through the open top
 if(gNoGlass&&d<0.0)d*=8.0;
 return vec2(d,M_TERRA);
}`},
 "kaktus":{view:{"cam":[0.9,2.4,7.8],"target":[0.35,-0.05,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.25)*q.xz;q.y+=1.15;return q;}
vec2 pot(vec3 q){
 float body=sdCappedCone(q-vec3(0,0.33,0),0.33,0.33,0.47)-0.03;
 float rim=sdCylY(q-vec3(0,0.7,0),0.11,0.56,0.04);
 float d=smin(body,rim,0.02);
 d=smax(d,-sdCylY(q-vec3(0,0.9,0),0.2,0.48,0.03),0.015);
 vec2 res=vec2(d,M_TERRA);
 float soil=sdCylY(q-vec3(0,0.73,0),0.03,0.49,0.02)+0.01*fbm(q*14.0);
 res=U(res,vec2(soil,M_SOIL));
 return res;}
// ribbed column along local y from 0 to h, with spine dots on the ribs
vec2 column(vec3 l,float h,float R,float nr){
 float a=atan(l.z,l.x);
 float rib=0.5-0.5*cos(a*nr);
 float d=sdCapsule(l,vec3(0.0),vec3(0.0,h,0.0),R*(1.0-0.1*rib))*0.9;
 vec2 res=vec2(d,rib>0.75?M_LEAF:M_GREEN);
 float sec=6.2831853/nr;
 float ai=round(a/sec);float ang=ai*sec;
 float off=mod(ai,2.0)*0.5;
 float yi=clamp(round(l.y/0.17-off)+off,0.6,h/0.17);
 vec3 c=vec3(cos(ang)*R,yi*0.17,sin(ang)*R);
 res=U(res,vec2(length(l-c)-0.028,M_CREAM));
 return res;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 res=pot(q);
 vec2 cac=column(q-vec3(0,0.7,0),1.15,0.3,8.0);
 vec2 armL=column(q-vec3(-0.6,1.2,0),0.45,0.17,6.0);
 vec2 armR=column(q-vec3(0.56,1.5,0),0.36,0.16,6.0);
 float connL=sdCapsule(q,vec3(-0.15,1.12,0),vec3(-0.6,1.2,0),0.165);
 float connR=sdCapsule(q,vec3(0.15,1.42,0),vec3(0.56,1.5,0),0.155);
 float conn=min(connL,connR);
 float body=smin(smin(cac.x,conn,0.1),min(armL.x,armR.x),0.08);
 vec2 g=U(U(cac,armL),armR);
 res=U(res,vec2(body,g.x<conn+0.01?g.y:M_GREEN));
 // flower on top
 vec3 f=q-vec3(0,2.17,0);
 float petals=1e9;
 for(int i=0;i<6;i++){vec3 e=f;e.xz=rot(-float(i)*1.0472)*e.xz;e.xy=rot(0.45)*e.xy;
  petals=min(petals,sdEllipsoid(e-vec3(0.12,0.0,0.0),vec3(0.12,0.04,0.07)));}
 res=U(res,vec2(petals,M_PINK));
 res=U(res,vec2(length(f-vec3(0,0.03,0))-0.065,M_YELLOW));
 return res;
}`},
 "vogel":{view:{"cam":[1.0,2.0,7.2],"target":[0.25,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.25)*q.xz;q.y+=0.05;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.20,0.52,0.95));t.rough=0.35;t.spec=0.5;return true;}   // tit blue
 if(m==101.0){t.alb=srgb2lin(vec3(0.46,0.60,0.26));t.rough=0.4;t.spec=0.4;return true;}    // olive back
 if(m==102.0){t.alb=srgb2lin(vec3(1.0,0.84,0.22));t.rough=0.4;t.spec=0.45;t.sss=0.15;return true;} // belly
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec3 hc=vec3(0.42,0.52,0.0);
 vec3 bq=q;bq.xy=rot(0.25)*bq.xy;
 float body=sdEllipsoid(bq,vec3(0.62,0.5,0.46));
 float head=length(q-hc)-0.36;
 float bh=smin(body,head,0.18);
 // plumage regions
 vec3 h=q-hc;
 float m=102.0;
 if(length(h)<0.42&&h.y>-0.3){
  m=M_WHITE;
  if(dot(h,normalize(vec3(0.35,1.0,0.0)))>0.13)m=100.0;
  if(h.y<-0.17||h.x<-0.24)m=M_NAVY;
 }else if(q.y>0.3&&q.x<0.05)m=100.0;
 vec2 res=vec2(bh,m);
 // wings
 vec3 w=q-vec3(-0.14,0.1,0.0);w.z=abs(w.z)-0.37;
 w.xy=rot(0.35)*w.xy;
 float wing=sdEllipsoid(w,vec3(0.5,0.26,0.1));
 float wm=100.0;
 if(abs(w.x-0.08-w.y*0.3)<0.045)wm=M_WHITE;
 if(w.x<-0.25)wm=M_NAVY;
 res=U(res,vec2(wing,wm));
 // tail
 vec3 tq=q-vec3(-0.8,0.02,0.0);tq.xy=rot(0.35)*tq.xy;tq.yz=rot(-0.5)*tq.yz;
 tq.z/=1.0+0.5*clamp(-tq.x/0.35,0.0,1.0);
 tq.y+=0.15*tq.z*tq.z;
 res=U(res,vec2(sdRoundBox(tq,vec3(0.34,0.05,0.15),0.05)*0.75,M_NAVY));
 // beak and eyes
 res=U(res,vec2(sdRoundCone(q,vec3(0.72,0.5,0.0),vec3(0.9,0.48,0.0),0.07,0.015),M_CHARCOAL));
 vec3 e=q-vec3(0.618,0.628,0.0);e.z=abs(e.z)-0.281;
 res=U(res,vec2(length(e)-0.055,M_DARK));
 // legs and toes
 vec3 l=q;l.z=abs(l.z)-0.13;
 float legs=sdCapsule(l,vec3(0.02,-0.38,0.0),vec3(0.06,-0.84,0.0),0.03);
 legs=min(legs,sdCapsule(l,vec3(0.06,-0.85,0.0),vec3(0.26,-0.87,0.06),0.022));
 legs=min(legs,sdCapsule(l,vec3(0.06,-0.85,0.0),vec3(0.27,-0.87,-0.05),0.022));
 legs=min(legs,sdCapsule(l,vec3(0.06,-0.85,0.0),vec3(-0.12,-0.87,0.0),0.022));
 res=U(res,vec2(legs,M_CHARCOAL));
 return res;
}`},
 "vogelkaefig":{view:{"cam":[0.4,2.0,7.8],"target":[0.35,-0.05,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.15)*q.xz;q.y+=0.12;return q;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==101.0){t.alb=srgb2lin(vec3(0.86,0.66,0.12));t.rough=0.4;t.spec=0.45;return true;}
 return false;}
const float N=18.0;const float RC=0.82;const float Y0=-0.95;const float Y1=0.25;
float bars(vec3 q){
 float sec=6.2831853/N;
 float a=atan(q.z,q.x);
 float ang=round(a/sec)*sec;
 vec2 dir=vec2(cos(ang),sin(ang));
 float r=dot(q.xz,dir);float lat=dot(q.xz,vec2(-dir.y,dir.x));
 float dp;
 if(q.y<Y1)dp=length(vec2(r-RC,min(q.y-Y0,0.0)));
 else dp=abs(length(vec2(r,(q.y-Y1)*1.05))-RC);
 return length(vec2(dp,lat))-0.024;}
// small yellow bird, feet at the origin, facing +x
vec2 canary(vec3 c){
 vec3 bq=c-vec3(0.0,0.2,0.0);bq.xy=rot(0.5)*bq.xy;
 float body=sdEllipsoid(bq,vec3(0.22,0.15,0.15));
 float head=length(c-vec3(0.12,0.38,0.0))-0.12;
 vec2 res=vec2(smin(body,head,0.06),M_YELLOW);
 vec3 w=c-vec3(-0.04,0.22,0.0);w.z=abs(w.z)-0.12;w.xy=rot(0.6)*w.xy;
 res=U(res,vec2(sdEllipsoid(w,vec3(0.17,0.08,0.04)),101.0));
 vec3 tq=c-vec3(-0.2,0.06,0.0);tq.xy=rot(0.9)*tq.xy;
 res=U(res,vec2(sdRoundBox(tq,vec3(0.12,0.01,0.05),0.012),101.0));
 res=U(res,vec2(sdRoundCone(c,vec3(0.22,0.38,0.0),vec3(0.3,0.36,0.0),0.035,0.01),M_ORANGE));
 vec3 e=c-vec3(0.192,0.416,0.0);e.z=abs(e.z)-0.089;
 res=U(res,vec2(length(e)-0.022,M_DARK));
 vec3 l=c;l.z=abs(l.z)-0.05;
 res=U(res,vec2(sdCapsule(l,vec3(0.0,0.08,0.0),vec3(0.02,0.0,0.0),0.015),M_ORANGE));
 return res;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float d=bars(q);
 d=min(d,sdTorus(q-vec3(0,Y0+0.03,0),vec2(RC,0.04)));
 d=min(d,sdTorus(q-vec3(0,-0.35,0),vec2(RC,0.022)));
 d=min(d,sdTorus(q-vec3(0,Y1,0),vec2(RC,0.032)));
 d=min(d,sdTorus(q-vec3(0,Y1+0.55,0),vec2(0.585,0.022)));
 // base tray
 float base=sdCylY(q-vec3(0,-1.06,0),0.09,0.98,0.05);
 base=min(base,sdTorus(q-vec3(0,-0.97,0),vec2(0.9,0.05)));
 d=min(d,base);
 // knob and hanging ring
 d=min(d,length(q-vec3(0,1.06,0))-0.07);
 vec3 h=q-vec3(0,1.29,0);
 d=min(d,sdTorus(vec3(h.x,h.z,h.y),vec2(0.17,0.035)));
 vec2 res=vec2(d,M_BRASS);
 // perch and bird
 res=U(res,vec2(sdCapsule(q,vec3(-0.66,-0.3,0),vec3(0.66,-0.3,0),0.035),M_WOOD));
 vec3 c=q-vec3(0.0,-0.27,0.0);c.xz=rot(0.6)*c.xz;
 res=U(res,canary(c/1.25)*vec2(1.25,1.0));
 return res;
}`},
 "feder":{view:{"cam":[0,1.6,6.0],"target":[0,0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xy=rot(-0.8)*q.xy;q.yz=rot(-0.4)*q.yz;return q;}
// bend the feather: the shaft bows sideways and curls a little
vec3 fcoords(vec3 q){float s=q.y/1.2;return vec3(q.x-0.24*s*s+0.08,q.y,q.z+0.12*s*s);}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  vec3 f=fcoords(local(p));
  float g=f.y-0.75*abs(f.x);
  float brown=smoothstep(-0.55,-0.25,sin(g*17.0-2.2))*smoothstep(-0.05,0.08,g);
  brown=max(brown,smoothstep(0.7,0.78,g));
  vec3 c=mix(vec3(0.97,0.95,0.91),mix(vec3(0.50,0.31,0.17),vec3(0.36,0.22,0.12),smoothstep(0.5,1.0,g)),brown);
  c*=0.97+0.03*sin(g*150.0);
  t.alb=srgb2lin(c);t.rough=0.75;t.spec=0.15;t.sss=0.3;return true;}
 if(m==101.0){t.alb=srgb2lin(vec3(0.93,0.85,0.68));t.rough=0.4;t.spec=0.4;t.sss=0.2;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 f=fcoords(local(p));
 // vane: a flat ellipse, wider on the right side, pointed towards the tip
 float rx=(f.x>0.0?0.42:0.30)*mix(1.0,0.75,smoothstep(0.3,1.1,f.y));
 vec2 e=vec2(f.x/rx,(f.y-0.12)/1.02);
 float d2=(length(e)-1.0)*0.28;
 // splits in the vane
 float g=f.y-0.75*abs(f.x);
 float cut1=max(abs(g-0.32)-0.012,0.2-f.x);
 float cut2=max(abs(g-0.72)-0.012,0.12+f.x);
 float cut3=max(abs(g+0.22)-0.012,0.16+f.x);
 d2=max(d2,-min(cut1,min(cut2,cut3)));
 // fluffy down at the base
 d2+=0.025*sin(f.y*45.0+f.x*12.0)*smoothstep(-0.5,-0.9,f.y);
 float th=0.02+0.0005*sin(g*120.0);
 float vane=(length(vec2(max(d2,0.0),f.z))-th)*0.8;
 vec2 res=vec2(vane,100.0);
 float shaft=sdRoundCone(f,vec3(0.0,-1.28,0.01),vec3(0.0,1.08,0.01),0.042,0.012);
 res=U(res,vec2(shaft*0.9,101.0));
 return res;
}`},
 "fisch":{view:{"cam":[-0.6,1.0,6.2],"target":[0,0,0],"fov":28},glsl:`
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.35)*q.xz;q.x+=0.5;return q;}
vec3 fishLocal(vec3 p){return local(p);}
// fish colours: body 100..100.9 (fraction = belly), fins 101..101.9 (fraction = paleness)
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m>=100.0&&m<101.0){float f=clamp((m-100.0)/0.9,0.0,1.0);
  vec3 q=fishLocal(p);
  vec2 uv=vec2(q.x*7.0,q.y*7.0);float row=floor(uv.y);uv.x+=0.5*mod(row,2.0);
  vec2 cell=fract(uv)-0.5;float sc=smoothstep(0.36,0.48,length(cell+vec2(0.25,0.0)))*smoothstep(-0.35,-0.15,q.x);
  vec3 c=mix(vec3(1.0,0.36,0.03),vec3(1.0,0.74,0.36),f);
  c*=1.0-0.14*sc;
  t.alb=srgb2lin(c);t.rough=0.25;t.spec=0.7;t.sss=0.3;return true;}
 if(m>=101.0&&m<102.0){float f=clamp((m-101.0)/0.9,0.0,1.0);
  t.alb=srgb2lin(mix(vec3(1.0,0.42,0.05),vec3(1.0,0.8,0.55),f*f));t.rough=0.3;t.spec=0.5;t.sss=0.6;return true;}
 return false;}
// small fan-shaped fin in the local xy plane, pointing to +x from the origin
vec2 fanFin(vec3 l,float R,float spread){
 float rho=length(l.xy);float th=atan(l.y,l.x);
 float Rt=R*(1.0+0.1*sin(th*9.0));
 float d2=max(rho-Rt,(abs(th)-spread)*rho);
 float d=length(vec2(max(d2,0.0),l.z-0.04*sin(th*7.0)*rho/R))-(0.022-0.01*min(rho/R,1.0));
 d+=0.003*sin(th*30.0)*smoothstep(0.1,0.3,rho/R);
 return vec2(d*0.7,101.0+0.9*clamp(rho/R,0.0,1.0));}
// goldfish: head towards -x, body centre at the origin
vec2 goldfish(vec3 q){
 float body=sdEllipsoid(q-vec3(0.05,0.0,0.0),vec3(0.72,0.55,0.36));
 float head=sdEllipsoid(q-vec3(-0.4,0.0,0.0),vec3(0.42,0.43,0.33));
 float stalk=sdEllipsoid(q-vec3(0.62,0.0,0.0),vec3(0.36,0.2,0.12));
 float b=smin(smin(body,head,0.15),stalk,0.15);
 vec2 res=vec2(b,100.0+0.9*clamp(-0.1-q.y*1.6,0.0,1.0));
 // eyes: golden ring with a black pupil
 vec3 e=q-vec3(-0.62,0.12,0.0);e.z=abs(e.z);
 res=U(res,vec2(length(e-vec3(0.0,0.0,0.25))-0.085,M_YELLOW));
 res=U(res,vec2(length(e-vec3(-0.01,0.0,0.285))-0.062,M_DARK));
 // tail: wavy fan with a fork
 vec3 t=q-vec3(0.85,0.0,0.0);t.xy=rot(-0.12)*t.xy;
 float rho=length(t.xy);float th=atan(t.y,t.x);
 float Rt=1.05+0.07*sin(th*7.0)-0.42*exp(-th*th*14.0);
 float d2=max(rho-Rt,(abs(th)-1.0)*rho);
 float wz=t.z-0.12*sin(th*4.0+rho*2.5)*smoothstep(0.0,0.6,rho);
 float tail=length(vec2(max(d2,0.0),wz))-(0.035-0.02*min(rho,1.0));
 tail+=0.005*sin(th*30.0)*smoothstep(0.2,0.5,rho);
 res=U(res,vec2(tail*0.6,101.0+0.9*clamp((rho-0.3)/0.8,0.0,1.0)));
 // dorsal fin
 vec3 dq=q-vec3(0.05,0.42,0.0);
 dq.x-=0.5*max(dq.y,0.0);
 float dd=(length(dq.xy/vec2(0.36,0.42))-1.0)*0.36;
 dd=max(dd,-dq.y);
 dd+=0.012*sin(dq.x*30.0);
 float dors=length(vec2(max(dd,0.0),dq.z-0.03*sin(dq.x*12.0)))-0.024;
 res=U(res,vec2(dors*0.7,101.0+0.9*clamp(dq.y/0.4,0.0,1.0)));
 // pectoral, pelvic and anal fins
 vec3 pf=q-vec3(-0.3,-0.2,0.0);pf.z=abs(pf.z)-0.3;pf.xz=rot(0.6)*pf.xz;pf.xy=rot(-0.7)*pf.xy;
 res=U(res,fanFin(pf,0.36,0.45));
 vec3 vf=q-vec3(0.0,-0.4,0.0);vf.z=abs(vf.z)-0.17;vf.xz=rot(0.3)*vf.xz;vf.xy=rot(-1.0)*vf.xy;
 res=U(res,fanFin(vf,0.4,0.42));
 vec3 af=q-vec3(0.48,-0.3,0.0);af.xy=rot(-0.8)*af.xy;
 res=U(res,fanFin(af,0.48,0.45));
 return res;}
vec2 objectMap(vec3 p){return goldfish(local(p));}
`},
 "aquarium":{view:{"cam":[0.3,2.8,7.4],"target":[0.3,-0.15,0],"fov":28},glsl:`
#define HAS_MAT
const vec3 FP=vec3(0.15,0.0,0.2);const float FS=0.42;
vec3 fishLocal(vec3 p){vec3 q=p-FP;q.xz=rot(-0.4)*q.xz;return q/FS;}
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m>=100.0&&m<101.0){float f=clamp((m-100.0)/0.9,0.0,1.0);
  vec3 q=fishLocal(p);
  vec2 uv=vec2(q.x*7.0,q.y*7.0);float row=floor(uv.y);uv.x+=0.5*mod(row,2.0);
  vec2 cell=fract(uv)-0.5;float sc=smoothstep(0.36,0.48,length(cell+vec2(0.25,0.0)))*smoothstep(-0.35,-0.15,q.x);
  vec3 c=mix(vec3(1.0,0.36,0.03),vec3(1.0,0.74,0.36),f);
  c*=1.0-0.14*sc;
  t.alb=srgb2lin(c);t.rough=0.25;t.spec=0.7;t.sss=0.3;return true;}
 if(m>=101.0&&m<102.0){float f=clamp((m-101.0)/0.9,0.0,1.0);
  t.alb=srgb2lin(mix(vec3(1.0,0.42,0.05),vec3(1.0,0.8,0.55),f*f));t.rough=0.3;t.spec=0.5;t.sss=0.6;return true;}
 return false;}
// small fan-shaped fin in the local xy plane, pointing to +x from the origin
vec2 fanFin(vec3 l,float R,float spread){
 float rho=length(l.xy);float th=atan(l.y,l.x);
 float Rt=R*(1.0+0.1*sin(th*9.0));
 float d2=max(rho-Rt,(abs(th)-spread)*rho);
 float d=length(vec2(max(d2,0.0),l.z-0.04*sin(th*7.0)*rho/R))-(0.022-0.01*min(rho/R,1.0));
 d+=0.003*sin(th*30.0)*smoothstep(0.1,0.3,rho/R);
 return vec2(d*0.7,101.0+0.9*clamp(rho/R,0.0,1.0));}
// goldfish: head towards -x, body centre at the origin
vec2 goldfish(vec3 q){
 float body=sdEllipsoid(q-vec3(0.05,0.0,0.0),vec3(0.72,0.55,0.36));
 float head=sdEllipsoid(q-vec3(-0.4,0.0,0.0),vec3(0.42,0.43,0.33));
 float stalk=sdEllipsoid(q-vec3(0.62,0.0,0.0),vec3(0.36,0.2,0.12));
 float b=smin(smin(body,head,0.15),stalk,0.15);
 vec2 res=vec2(b,100.0+0.9*clamp(-0.1-q.y*1.6,0.0,1.0));
 vec3 e=q-vec3(-0.62,0.12,0.0);e.z=abs(e.z);
 res=U(res,vec2(length(e-vec3(0.0,0.0,0.25))-0.085,M_YELLOW));
 res=U(res,vec2(length(e-vec3(-0.01,0.0,0.285))-0.062,M_DARK));
 vec3 t=q-vec3(0.85,0.0,0.0);t.xy=rot(-0.12)*t.xy;
 float rho=length(t.xy);float th=atan(t.y,t.x);
 float Rt=1.05+0.07*sin(th*7.0)-0.42*exp(-th*th*14.0);
 float d2=max(rho-Rt,(abs(th)-1.0)*rho);
 float wz=t.z-0.12*sin(th*4.0+rho*2.5)*smoothstep(0.0,0.6,rho);
 float tail=length(vec2(max(d2,0.0),wz))-(0.035-0.02*min(rho,1.0));
 tail+=0.005*sin(th*30.0)*smoothstep(0.2,0.5,rho);
 res=U(res,vec2(tail*0.6,101.0+0.9*clamp((rho-0.3)/0.8,0.0,1.0)));
 vec3 dq=q-vec3(0.05,0.42,0.0);
 dq.x-=0.5*max(dq.y,0.0);
 float dd=(length(dq.xy/vec2(0.36,0.42))-1.0)*0.36;
 dd=max(dd,-dq.y);
 dd+=0.012*sin(dq.x*30.0);
 float dors=length(vec2(max(dd,0.0),dq.z-0.03*sin(dq.x*12.0)))-0.024;
 res=U(res,vec2(dors*0.7,101.0+0.9*clamp(dq.y/0.4,0.0,1.0)));
 vec3 pf=q-vec3(-0.3,-0.2,0.0);pf.z=abs(pf.z)-0.3;pf.xz=rot(0.6)*pf.xz;pf.xy=rot(-0.7)*pf.xy;
 res=U(res,fanFin(pf,0.36,0.45));
 vec3 vf=q-vec3(0.0,-0.4,0.0);vf.z=abs(vf.z)-0.17;vf.xz=rot(0.3)*vf.xz;vf.xy=rot(-1.0)*vf.xy;
 res=U(res,fanFin(vf,0.4,0.42));
 vec3 af=q-vec3(0.48,-0.3,0.0);af.xy=rot(-0.8)*af.xy;
 res=U(res,fanFin(af,0.48,0.45));
 return res;}
// water plant blade: flat ribbon facing the camera, swaying
float blade(vec3 p,vec3 b,float h,float ph,float w0){
 vec3 l=p-b;
 float y=clamp(l.y,0.0,h);
 l.x-=0.13*sin(y*4.0+ph)*(y/h);
 l.z-=0.06*sin(y*2.5+ph*1.7)*(y/h);
 float k=y/h;
 float w=w0*(1.0-k*k)*(0.7+0.6*sqrt(k))+0.008;
 float d=length(vec2(max(abs(l.x)-w,0.0),l.z))-0.02;
 d=max(d,abs(l.y-h*0.5)-h*0.5);
 return d*0.7;}
const float R=1.25;const float WL=0.42;const float GY=-0.62;
vec2 objectMap(vec3 p){
 float ri=length(p)-(R-0.05);
 // gravel: pebbles in a clamped grid on a sandy bed
 const vec3 GS=vec3(0.2,0.13,0.18);
 float iy=clamp(round(p.y/GS.y),-8.0,round(GY/GS.y));
 float iz=clamp(round(p.z/GS.z),-7.0,7.0);
 float ox=0.5*mod(iz+iy,2.0);
 float ix=clamp(round(p.x/GS.x-ox),-7.0,7.0)+ox;
 vec3 cell=vec3(ix,iy,iz);
 float hh=hash31(cell*1.7+3.0);
 vec3 pc=p-cell*GS-vec3(hh-0.5,0.0,fract(hh*7.0)-0.5)*0.025;
 pc.xz=rot(hh*6.0)*pc.xz;
 float peb=sdEllipsoid(pc,vec3(0.088,0.06,0.07)*(0.85+0.2*hh))*0.85;
 float bed=p.y-(GY-0.02);
 float grav=max(max(min(peb,bed),ri),-0.96-p.y);
 float hc=fract(hh*13.0);
 float gm=hc<0.2?M_SAND:(hc<0.4?M_CREAM:(hc<0.55?M_GREY:(hc<0.7?M_TERRA:(hc<0.85?M_BROWN:M_CHARCOAL))));
 if(peb>bed)gm=M_SAND;
 vec2 res=vec2(grav,gm);
 // rock
 vec3 rq=p-vec3(-0.3,GY,0.3);
 res=U(res,vec2(sdEllipsoid(rq,vec3(0.24,0.17,0.2))+0.02*noise3(p*9.0),M_CHARCOAL));
 // water plants on both sides
 float pl=1e9;
 pl=min(pl,blade(p,vec3(-0.62,GY,-0.2),0.98,0.0,0.1));
 pl=min(pl,blade(p,vec3(-0.45,GY,-0.05),0.72,2.0,0.09));
 pl=min(pl,blade(p,vec3(-0.78,GY,0.0),0.62,4.0,0.085));
 pl=min(pl,blade(p,vec3(-0.35,GY,-0.4),0.88,1.0,0.09));
 res=U(res,vec2(pl,M_GREEN));
 float pr=1e9;
 pr=min(pr,blade(p,vec3(0.62,GY,-0.3),0.92,3.0,0.1));
 pr=min(pr,blade(p,vec3(0.45,GY,-0.5),0.75,5.0,0.09));
 pr=min(pr,blade(p,vec3(0.78,GY,-0.08),0.6,1.5,0.085));
 res=U(res,vec2(pr,M_LEAF));
 // goldfish
 vec2 f=goldfish(fishLocal(p));
 res=U(res,vec2(f.x*FS,f.y));
 if(!gNoGlass){
  float sp=length(p);
  float shell=abs(sp-(R-0.02))-0.02;
  shell=max(shell,p.y-0.85);
  float glass=max(shell,WL-p.y);
  float lip=sdTorus(p-vec3(0,0.86,0),vec2(0.9,0.045));
  float water=max(max(sp-R,p.y-WL),-1.0-p.y);
  res=U(res,vec2(min(glass,lip),M_CLEAR));
  res=U(res,vec2(water,M_CLEARWATER));
 }
 return res;
}`},
};
