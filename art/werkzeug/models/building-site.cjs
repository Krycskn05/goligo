// Shader models for the Nesne Kasası: building site things (scaffold, concrete mixer, cement sack,
// wheelbarrow, garden hose, warning sign, bricklayer's trowel).
module.exports={
 "geruest":{view:{"cam":[4.6,3.3,8.4],"target":[0.3,0.05,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){return p;}
// planks run along x
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.z*1.5,q.x,q.y*1.5);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // posts: 3 along x (spacing 1.2) and 2 along z
 vec3 sx=q;sx.x-=1.2*clamp(round(q.x/1.2),-1.0,1.0);
 vec3 s=sx;s.z=abs(q.z)-0.45;
 float post=sdCapsule(s,vec3(0,-1.1,0),vec3(0,1.38,0),0.055);
 vec2 res=vec2(post,M_STEEL);
 // base plates
 float base=sdRoundBox(s-vec3(0,-1.16,0),vec3(0.13,0.028,0.13),0.02);
 res=U(res,vec2(base,M_CHARCOAL));
 // ledgers (along x) and transoms (along z) at four heights, couplers at the joints
 vec3 l=q;l.z=abs(q.z)-0.45;
 float bars=1e9;float cpl=1e9;
 for(int i=0;i<4;i++){
  float h=i==0?-0.95:(i==1?-0.2:(i==2?0.85:1.3));
  bars=min(bars,sdCapsule(l,vec3(-1.28,h,0),vec3(1.28,h,0),0.042));
  bars=min(bars,sdCapsule(sx,vec3(0,h,-0.5),vec3(0,h,0.5),0.042));
  cpl=min(cpl,sdRoundBox(s-vec3(0,h,0),vec3(0.075,0.075,0.075),0.035));
 }
 // diagonal braces: an X in each bay on the back, one diagonal on each side
 vec3 bq=q;bq.x=abs(q.x);bq.z=q.z+0.51;
 float br=min(sdCapsule(bq,vec3(0.0,-0.95,0),vec3(1.2,0.85,0),0.035),sdCapsule(bq,vec3(1.2,-0.95,0),vec3(0.0,0.85,0),0.035));
 vec3 sq=q;sq.x=abs(q.x)-1.26;
 br=min(br,sdCapsule(sq,vec3(0,-0.95,-0.45),vec3(0,0.85,0.45),0.035));
 res=U(res,vec2(min(bars,br),M_STEEL));
 res=U(res,vec2(cpl,M_ORANGE));
 // wooden planks on two decks (3 boards each)
 vec3 b=q;b.z-=0.29*clamp(round(q.z/0.29),-1.0,1.0);
 float dk=q.y<0.325?-0.1:0.95;
 float plank=sdRoundBox(b-vec3(0,dk,0),vec3(1.33,0.05,0.13),0.03);
 res=U(res,vec2(plank,M_WOOD));
 return res;
}`},
 "zementmischer":{view:{"cam":[3.2,2.9,8.6],"target":[0.25,0.1,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.2)*q.xz;return q;}
// cylinder along an arbitrary axis
float cylAx(vec3 p,vec3 a,vec3 dir,float h,float r,float e){vec3 w=p-a;float y=dot(w,dir);float x=length(w-y*dir);return sdCylY(vec3(x,y,0.0),h,r,e);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // drum: axis from its base B0 up and to the right, open mouth at the top
 vec3 B0=vec3(-0.3,0.15,0.0);
 vec3 d=normalize(vec3(0.62,0.72,0.3));
 vec3 r=q-B0;float u=dot(r,d);float rad=length(r-u*d);
 vec3 dq=vec3(rad,u,0.0);
 float body=smin(sdRoundCone(dq,vec3(0,0.15,0),vec3(0,0.62,0),0.42,0.6),sdRoundCone(dq,vec3(0,0.62,0),vec3(0,1.25,0),0.6,0.34),0.06);
 float outer=max(body,u-1.3);
 float cav=body+0.06;
 float shell=max(outer,-cav);
 float lip=length(vec2(rad-0.32,u-1.29))-0.055;
 float ribs=min(smax(body-0.04,abs(u-0.45)-0.045,0.02),smax(body-0.04,abs(u-0.86)-0.045,0.02));
 float drum=min(smin(shell,lip,0.02),ribs);
 vec2 res=vec2(drum,(-cav>outer-0.001)?M_CHARCOAL:M_ORANGE);
 // wet concrete inside
 float conc=max(cav+0.01,q.y-0.62);
 res=U(res,vec2(conc,M_CONCRETE));
 // ring gear at the bottom of the drum
 float gear=smax(body-0.05,abs(u-0.1)-0.06,0.02);
 gear+=0.008*smoothstep(0.2,0.9,cos(atan(dot(r,vec3(0,0,1)),dot(r,normalize(cross(d,vec3(0,0,1)))))*28.0));
 res=U(res,vec2(gear,M_TEAL));
 // cradle under the drum and pivot shaft to the post
 float cradle=sdCylY(vec3(rad,u+0.3,0.0),0.08,0.28,0.03);
 vec3 pc=B0-0.3*d;
 float shaft=sdCapsule(q,vec3(-0.95,pc.y,0.0),pc,0.065);
 float bear=sdRoundBox(q-vec3(-0.95,pc.y,0.0),vec3(0.1,0.12,0.12),0.04);
 // left post with a foot
 float post=sdCapsule(q,vec3(-0.95,-1.05,0.0),vec3(-0.95,pc.y,0.0),0.065);
 // A-frame to the wheels and a brace
 vec3 c=q;c.z=abs(q.z);
 float beams=sdCapsule(c,vec3(-0.95,-0.55,0.0),vec3(0.75,-0.77,0.42),0.055);
 beams=min(beams,sdCapsule(q,vec3(-0.95,-0.18,0.0),vec3(0.75,-0.77,0.0),0.05));
 float frame=min(min(cradle,shaft),min(min(bear,post),beams));
 res=U(res,vec2(frame,M_TEAL));
 float foot=sdRoundBox(q-vec3(-0.95,-1.07,0.0),vec3(0.16,0.03,0.22),0.02);
 res=U(res,vec2(foot,M_RUBBER));
 // axle and wheels
 float axle=sdCapsule(q,vec3(0.75,-0.77,-0.55),vec3(0.75,-0.77,0.55),0.04);
 res=U(res,vec2(axle,M_STEEL));
 vec3 w=q-vec3(0.75,-0.77,0.0);w.z=abs(w.z)-0.55;
 float tire=sdTorus(vec3(w.x,w.z,w.y),vec2(0.235,0.095));
 tire+=0.008*smoothstep(0.3,0.9,cos(atan(w.y,w.x)*20.0));
 res=U(res,vec2(tire,M_RUBBER));
 float hub=sdCylY(vec3(w.x,w.z,w.y),0.075,0.17,0.03);
 res=U(res,vec2(hub,M_ORANGE));
 // hand wheel on the side of the post (spokes, rim, knob)
 vec3 hw=normalize(vec3(-0.6,0.0,0.8));
 vec3 H=vec3(-0.95,pc.y,0.0)+0.32*hw;
 vec3 e1=vec3(0,1,0);vec3 e2=cross(hw,e1);
 vec3 hr=q-H;float wa=dot(hr,hw);float wx=dot(hr,e1);float wy=dot(hr,e2);
 float rim=sdTorus(vec3(wx,wa,wy),vec2(0.3,0.04));
 float ang=atan(wy,wx);float rr=length(vec2(wx,wy));
 float sa=mod(ang+0.6283,1.2566)-0.6283;
 vec2 pp=rr*vec2(cos(sa),sin(sa));
 float spokes=length(vec3(pp.x-clamp(pp.x,0.0,0.3),pp.y,wa))-0.026;
 float hub2=sdCylY(vec3(wx,wa,wy),0.06,0.075,0.025);
 float hwheel=min(min(rim,spokes),hub2);
 hwheel=min(hwheel,sdCapsule(q,vec3(-0.95,pc.y,0.0),H,0.035));
 res=U(res,vec2(hwheel,M_TEAL));
 vec3 kp=H+0.3*(e1*cos(0.9)+e2*sin(0.9));
 float knob=sdRoundCone(q,kp,kp+0.16*hw,0.035,0.045);
 res=U(res,vec2(knob,M_RUBBER));
 return res;
}`},
 "zementsack":{view:{"cam":[1.6,2.4,8.0],"target":[0.3,-0.1,0],"fov":28},glsl:`
#define HAS_PAPER
#define HAS_MAT
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.3)*q.xz;return q;}
// grey cement powder
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){float s=fbm(p*30.0);t.alb=srgb2lin(mix(vec3(0.50,0.50,0.52),vec3(0.40,0.40,0.42),s));t.rough=0.95;t.spec=0.08;return true;}
 return false;}
// the sack slumps a little: the top leans to the side
vec3 sackSpace(vec3 q){q.x-=0.07*smoothstep(-0.3,1.0,q.y);return q;}
float sackBody(vec3 q){
 float y=q.y;
 float hw=0.72+0.06*(1.0-smoothstep(-1.0,-0.5,y))-0.08*smoothstep(0.2,0.95,y)+0.03*sin(y*3.0+0.5);
 float hd=mix(0.46,0.09,smoothstep(0.05,0.95,y));
 hd*=1.0+0.08*(1.0-smoothstep(-1.0,-0.6,y));
 float d=sdRoundBox(q-vec3(0.0,-0.05,0.0),vec3(hw,1.0,hd),min(0.22,hd-0.01));
 d+=0.012*sin(q.x*7.0+q.y*4.0)*sin(q.y*9.0-q.x*3.0);
 return max(d*0.7,-1.04-q.y);}
// 2D trowel icon: blade from the tip t along direction ax
float iconBlade(vec2 uv,vec2 t,vec2 ax,float len,float hw){vec2 w=uv-t;float a=dot(w,ax);float b=dot(w,vec2(-ax.y,ax.x));return max(max(-a,a-len),abs(b)-hw*clamp(a/len,0.0,1.0));}
vec3 objectPaper(vec3 p,vec3 n){
 vec3 q=sackSpace(local(p));
 vec3 nl=n;nl.xz=rot(0.3)*nl.xz;
 float f=fbm(q*vec3(14.0,30.0,14.0));
 vec3 c=mix(vec3(0.80,0.66,0.48),vec3(0.71,0.57,0.40),f);
 if(q.y>0.75)c*=0.92;
 // stitching on the folded top band
 float st=step(0.5,fract(q.x*9.0))*step(abs(q.y-0.83),0.013);
 c=mix(c,vec3(0.96,0.93,0.86),st);
 // print on the front: a grey cement pile with a trowel in it
 if(nl.z>0.2&&q.y<0.7){
  vec2 uv=q.xy;
  float hp=0.36*pow(max(1.0-pow((uv.x+0.1)/0.56,2.0),0.0),1.3);
  float pileIn=step(uv.y,-0.62+hp)*step(-0.62,uv.y);
  float lit=step(uv.x,-0.1+(-0.26-uv.y)*0.7);
  vec3 grey=mix(vec3(0.47,0.47,0.49),vec3(0.64,0.64,0.65),lit);
  grey*=0.92+0.16*noise3(vec3(uv*40.0,1.0));
  c=mix(c,grey,pileIn);
  vec2 ax=normalize(vec2(0.62,0.78));
  vec2 tip=vec2(-0.04,-0.32);
  float blade=iconBlade(uv,tip,ax,0.46,0.19);
  c=mix(c,vec3(0.70,0.72,0.75),step(blade,0.0));
  vec2 hc=tip+ax*0.46;
  float neck=sdSeg2(uv,hc,hc+ax*0.14)-0.022;
  c=mix(c,vec3(0.30,0.30,0.32),step(neck,0.0));
  float handle=sdSeg2(uv,hc+ax*0.16,hc+ax*0.42)-0.055;
  c=mix(c,vec3(0.55,0.30,0.14),step(handle,0.0));
 }
 return srgb2lin(c);}
vec2 objectMap(vec3 p){
 vec3 q=sackSpace(local(p));
 float body=sackBody(q);
 // folded top band
 float band=sdRoundBox(q-vec3(0.0,0.86,0.01),vec3(0.66,0.1,0.12),0.06);
 vec2 res=vec2(smin(body,band,0.03),M_PAPER);
 // a little grey cement powder spilled at the foot of the sack
 vec3 g=local(p);
 float spill=sdEllipsoid(g-vec3(0.8,-1.04,0.5),vec3(0.3,0.2,0.26));
 spill=smin(spill,sdEllipsoid(g-vec3(0.62,-1.04,0.62),vec3(0.42,0.06,0.34)),0.08);
 spill=min(spill,sdEllipsoid(g-vec3(1.18,-1.03,0.78),vec3(0.06,0.045,0.05)));
 spill=min(spill,sdEllipsoid(g-vec3(1.02,-1.03,0.95),vec3(0.05,0.035,0.045)));
 spill=max(spill,-1.04-g.y);
 res=U(res,vec2(spill,100.0));
 return res;
}`},
 "schubkarre":{view:{"cam":[1.3,3.5,8.0],"target":[0.3,-0.2,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.55)*q.xz;return q;}
// convex tub from planes: front, back, two sides, bottom
float trayHull(vec3 q){
 float fr=dot(q.xy-vec2(-0.95,0.42),vec2(-0.80,-0.60));
 float bk=dot(q.xy-vec2(0.75,0.42),vec2(0.937,-0.35));
 float sd=dot(vec2(abs(q.z),q.y)-vec2(0.6,0.42),vec2(0.95,-0.31));
 float bt=-0.25-q.y;
 return smax(smax(fr,bk,0.1),smax(sd,bt,0.1),0.1);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // tray (open tub with a rolled rim)
 float hull=trayHull(q);
 float tray=max(max(hull,q.y-0.42),-(hull+0.05));
 float rim=length(vec2(hull+0.01,q.y-0.42))-0.05;
 vec2 res=vec2(smin(tray,rim,0.02),M_YELLOW);
 // frame tubes: from the axle, under the tray, out to the handles
 vec3 f=q;f.z=abs(q.z);
 vec3 P0=vec3(-1.25,-0.57,0.16),P1=vec3(-0.62,-0.31,0.34),P2=vec3(0.55,-0.31,0.36),P3=vec3(1.6,0.08,0.44);
 float fr=smin(smin(sdCapsule(f,P0,P1,0.045),sdCapsule(f,P1,P2,0.045),0.03),sdCapsule(f,P2,P3,0.045),0.03);
 // legs with feet, cross bars
 fr=min(fr,sdCapsule(f,vec3(0.4,-0.31,0.36),vec3(0.46,-0.905,0.38),0.045));
 fr=min(fr,sdCapsule(f,vec3(0.3,-0.905,0.38),vec3(0.62,-0.905,0.38),0.045));
 fr=min(fr,sdCapsule(q,vec3(0.4,-0.31,-0.36),vec3(0.4,-0.31,0.36),0.04));
 fr=min(fr,sdCapsule(q,vec3(-0.62,-0.31,-0.34),vec3(-0.62,-0.31,0.34),0.04));
 res=U(res,vec2(fr,M_GREEN));
 // rubber grips
 vec3 g0=P2+0.72*(P3-P2);
 float grip=sdCapsule(f,g0,P3+0.04*normalize(P3-P2),0.07);
 res=U(res,vec2(grip,M_DARK));
 // front wheel
 vec3 w=q-vec3(-1.25,-0.57,0.0);
 float tire=sdTorus(vec3(w.x,w.z,w.y),vec2(0.28,0.1));
 tire+=0.012*smoothstep(0.2,0.9,cos(atan(w.y,w.x)*22.0));
 res=U(res,vec2(tire,M_RUBBER));
 float hub=sdCylY(vec3(w.x,w.z,w.y),0.075,0.2,0.03);
 res=U(res,vec2(hub,M_YELLOW));
 float axle=sdCapsule(w,vec3(0,0,-0.19),vec3(0,0,0.19),0.035);
 res=U(res,vec2(axle,M_STEEL));
 return res;
}`},
 "schlauch":{view:{"cam":[1.6,4.4,8.8],"target":[0.6,0.7,0],"fov":28},glsl:`
// quadratic bezier distance (x) and parameter (y)
vec2 sdBez(vec3 pos,vec3 A,vec3 B,vec3 C){
 vec3 a=B-A;vec3 b=A-2.0*B+C;vec3 c=a*2.0;vec3 d=A-pos;
 float kk=1.0/dot(b,b);float kx=kk*dot(a,b);float ky=kk*(2.0*dot(a,a)+dot(d,b))/3.0;float kz=kk*dot(d,a);
 vec2 res;float p=ky-kx*kx;float p3=p*p*p;float q=kx*(2.0*kx*kx-3.0*ky)+kz;float h=q*q+4.0*p3;
 if(h>=0.0){h=sqrt(h);vec2 x=(vec2(h,-h)-q)/2.0;vec2 uv=sign(x)*pow(abs(x),vec2(1.0/3.0));float t=clamp(uv.x+uv.y-kx,0.0,1.0);vec3 e=d+(c+b*t)*t;res=vec2(dot(e,e),t);}
 else{float z=sqrt(-p);float v=acos(q/(p*z*2.0))/3.0;float m=cos(v);float n=sin(v)*1.732050808;vec3 t=clamp(vec3(m+m,-n-m,n-m)*z-kx,0.0,1.0);
  vec3 e=d+(c+b*t.x)*t.x;res=vec2(dot(e,e),t.x);e=d+(c+b*t.y)*t.y;float dis=dot(e,e);if(dis<res.x)res=vec2(dis,t.y);}
 res.x=sqrt(res.x);return res;}
float cylAx(vec3 p,vec3 a,vec3 dir,float h,float r,float e){vec3 w=p-a;float y=dot(w,dir);float x=length(w-y*dir);return sdCylY(vec3(x,y,0.0),h,r,e);}
const float PITCH=0.16;const float RT=0.08;const float NT=4.0;
float coilR(float s){return 0.82+0.05*sin(s*2.7+0.6);}
// loops are not perfectly stacked: shift each turn a little (zero at both ends)
vec2 coilOff(float s){return 0.07*sin(s*0.7854)*vec2(sin(s*2.1+0.3),cos(s*1.7+0.5));}
// pistol spray nozzle, origin at the hose connector, grip along gd, barrel along bd
vec2 nozzle(vec3 x,vec3 gd,vec3 bd){
 vec2 res=vec2(cylAx(x,vec3(0.0),gd,0.05,0.1,0.02),M_BRASS);
 vec3 G1=0.36*gd;
 float grip=sdRoundCone(x,0.05*gd,G1,0.085,0.08);
 grip+=0.006*smoothstep(0.3,1.0,sin(dot(x,gd)*60.0));
 res=U(res,vec2(grip,M_CHARCOAL));
 float barrel=sdRoundCone(x,G1-0.08*bd,G1+0.42*bd,0.095,0.085);
 res=U(res,vec2(barrel,M_YELLOW));
 vec3 DC=G1+0.5*bd;
 float dial=cylAx(x,DC,bd,0.06,0.16,0.03);
 dial+=0.006*smoothstep(0.4,1.0,cos(atan(dot(x-DC,gd),dot(x-DC,cross(gd,bd)))*14.0));
 res=U(res,vec2(dial,M_YELLOW));
 float face=cylAx(x,DC+0.06*bd,bd,0.015,0.1,0.01);
 res=U(res,vec2(face,M_CHARCOAL));
 float trig=sdCapsule(x,G1+0.14*bd-0.08*gd,G1+0.17*bd-0.3*gd,0.035);
 res=U(res,vec2(trig,M_CHARCOAL));
 float guard=sdCapsule(x,G1+0.3*bd-0.04*gd,0.18*gd+0.06*bd,0.025);
 res=U(res,vec2(guard,M_YELLOW));
 return res;}
vec2 objectMap(vec3 p){
 vec3 q=p;
 // coil: a loose helix lying on the ground, both ends at the seam direction e
 vec2 e=normalize(vec2(0.95,-0.3));
 float u=-(e.x*q.x+e.y*q.z);float v=e.y*q.x-e.x*q.z;
 float fa=(atan(v,u)+3.14159265)/6.2831853;
 float k0=round((q.y-RT)/PITCH-fa);
 float coil=1e9;float mat=M_GREEN;
 for(int j=-1;j<=1;j++){
  float k=clamp(k0+float(j),0.0,NT-1.0);float s=k+fa;
  vec2 dd=vec2(length(q.xz-coilOff(s))-coilR(s),q.y-(RT+PITCH*s));
  float dc=length(dd)-RT;
  if(dc<coil){coil=dc;float ta=atan(dd.y,dd.x);mat=abs(ta-0.35)<0.2?M_YELLOW:M_GREEN;}
 }
 vec2 res=vec2(coil,mat);
 // hose end leaving the top of the coil, bending up to the spray nozzle
 vec3 T=normalize(vec3(-e.y,0.0,e.x));
 float RE=coilR(NT);
 vec3 E=vec3(e.x*RE,RT+PITCH*NT,e.y*RE);
 vec3 C=E+0.4*T+vec3(0,0.02,0);
 vec3 N0=E+0.5*T+vec3(0.0,0.28,0);
 vec2 bz=sdBez(q,E,C,N0);
 // keep the yellow stripe going along the bent part
 vec3 P=mix(mix(E,C,bz.y),mix(C,N0,bz.y),bz.y);vec3 tg=normalize(mix(C-E,N0-C,bz.y));
 vec3 so=vec3(e.x,0.0,e.y);vec3 uo=normalize(cross(tg,so));vec3 nn=q-P;
 float sa2=atan(dot(nn,uo),dot(nn,so));
 res=U(res,vec2(bz.x-RT,abs(sa2-0.35)<0.2?M_YELLOW:M_GREEN));
 // other hose end with a brass coupling
 float R0=coilR(0.0);
 vec3 S=vec3(e.x*R0,RT,e.y*R0);
 res=U(res,vec2(cylAx(q,S-0.06*T,-T,0.07,0.095,0.02),M_BRASS));
 // spray nozzle, drawn a bit larger than life
 vec3 gd=normalize(N0-C);
 vec3 bd=normalize(vec3(0.9,0.25,0.15));
 const float NZ=1.35;
 vec2 nz=nozzle((q-N0)/NZ,gd,bd);
 res=U(res,vec2(nz.x*NZ,nz.y));
 return res;
}`},
 "schild":{view:{"cam":[0.4,1.4,6.4],"target":[0,0.2,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.35)*q.xz;return q;}
float sdEqTri(vec2 p,float r){const float k=1.7320508;p.x=abs(p.x)-r;p.y=p.y+r/k;if(p.x+k*p.y>0.0)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;p.x-=clamp(p.x,-2.0*r,0.0);return -length(p)*sign(p.y);}
// extrude a 2D distance along z with rounded edges
float slab(float d2,float z,float h,float e){vec2 w=vec2(d2+e,abs(z)-h+e);return min(max(w.x,w.y),0.0)+length(max(w,0.0))-e;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 s=q.xy-vec2(0.0,0.2);
 float tri=sdEqTri(s,0.9)-0.16;
 float plate=slab(tri,q.z,0.06,0.035);
 vec2 res=vec2(plate,M_YELLOW);
 // black border band, slightly raised on the front
 float band=abs(tri+0.2)-0.075;
 float border=slab(band,q.z-0.065,0.022,0.015);
 res=U(res,vec2(border,M_DARK));
 // exclamation mark, puffy
 vec3 eq=vec3(s.x,s.y,(q.z-0.06)*1.8);
 float bar=sdRoundCone(eq,vec3(0,0.0,0),vec3(0,0.38,0),0.06,0.095)/1.8;
 float dot1=sdEllipsoid(vec3(s.x,s.y+0.22,q.z-0.06),vec3(0.085,0.085,0.05));
 res=U(res,vec2(min(bar,dot1),M_DARK));
 // stand: front legs, rear legs, rubber feet
 vec3 f=q;f.x=abs(q.x);
 float legs=sdCapsule(f,vec3(0.62,-0.35,-0.11),vec3(0.64,-0.97,-0.11),0.045);
 legs=min(legs,sdCapsule(f,vec3(0.55,0.3,-0.11),vec3(0.62,-0.97,-0.62),0.045));
 legs=min(legs,sdCapsule(q,vec3(-0.6,-0.45,-0.35),vec3(0.6,-0.45,-0.35),0.035));
 res=U(res,vec2(legs,M_STEEL));
 float foot=sdRoundBox(f-vec3(0.63,-1.0,-0.3),vec3(0.08,0.045,0.42),0.04);
 res=U(res,vec2(foot,M_RUBBER));
 return res;
}`},
 "maurerkelle":{view:{"cam":[1.3,2.5,8.3],"target":[0.35,0.35,0],"fov":28},glsl:`
#define HAS_WOOD
#define HAS_MAT
// yaw so the tip points front-left, tilt so the handle end rises, roll the blade face towards the camera
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.5)*q.xz;q.xy=rot(0.3)*q.xy;q.yz=rot(0.5)*q.yz;return q;}
const vec3 N3=vec3(0.62,0.42,0.0);
vec3 hax(){return normalize(vec3(1.0,0.12,0.0));}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p)-N3;vec3 ax=hax();float a=dot(q,ax);vec3 r=q-a*ax;return vec3(r.z*1.5,a,r.y*1.5);}
// polished steel for the blade, with faint brushing
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){vec3 q=local(p);vec3 nl=local(n);float s=noise3(vec3(q.x*3.0,q.y*3.0,q.z*90.0));
  // darker towards the tip, a bright polished streak across the top face
  float g=mix(0.62,1.0,smoothstep(-1.1,0.4,q.x));
  float sk=q.x*0.55+q.z;
  float streak=exp(-pow((sk+0.05)/0.13,2.0))+0.7*exp(-pow((sk-0.3)/0.045,2.0));
  streak*=smoothstep(0.6,0.9,nl.y);
  t.alb=srgb2lin(vec3(0.84,0.86,0.9)*(0.94+0.08*s))*g+vec3(1.4)*streak;
  t.metal=1.0;t.rough=0.12;t.spec=0.8;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // diamond (kite) blade: tip at x=-1.15, widest at x=0.05, short pointed heel at x=0.6
 vec2 b=vec2(q.x,abs(q.z));
 float e1=dot(b-vec2(-1.15,0.0),normalize(vec2(-0.55,1.2)));
 float e2=dot(b-vec2(0.6,0.0),normalize(vec2(0.7,0.6)));
 float d2=smax(e1,e2,0.05);
 // shallow dish, thick toy blade with a wide bevel along the top edge
 float yb=q.y-0.08*b.y*b.y;
 float core=max(d2,abs(yb)-0.045);
 float bev=0.5*d2+0.866*(yb-0.045)+0.06;
 float blade=smax(core,bev,0.015);
 vec2 res=vec2(blade,100.0);
 // bent neck rising from the blade to the handle
 float neck=smin(sdCapsule(q,vec3(0.22,0.04,0.0),vec3(0.36,0.3,0.0),0.045),sdCapsule(q,vec3(0.36,0.3,0.0),N3,0.045),0.06);
 neck=smin(neck,sdEllipsoid(q-vec3(0.2,0.05,0.0),vec3(0.14,0.035,0.07)),0.03);
 vec3 ax=hax();
 vec3 w=q-N3;float y=dot(w,ax);float x=length(w-y*ax);
 float ferrule=sdCylY(vec3(x,y-0.07,0.0),0.07,0.085,0.02);
 res=U(res,vec2(min(neck,ferrule),M_STEEL));
 // wooden handle with a bulb at the end
 vec3 h0=N3+0.12*ax,h1=N3+0.6*ax,h2=N3+0.86*ax;
 float handle=smin(sdRoundCone(q,h0,h1,0.085,0.125),sdRoundCone(q,h1,h2,0.125,0.105),0.05);
 res=U(res,vec2(handle,M_WOOD));
 return res;
}`},
};
