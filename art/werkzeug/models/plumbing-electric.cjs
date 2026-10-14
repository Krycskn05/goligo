// Shader models for the Nesne Kasası: bathroom plumbing, heating and electric things
// (shower, radiator, pipe, wall socket, plug, washbasin, tap, extension cable).
module.exports={
 "dusche":{view:{"cam":[4.2,3.2,6.6],"target":[0.1,-0.05,0],"fov":30},glsl:`
#define HAS_MAT
// pale aqua wall tiles with white grout on the two back walls
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){
  vec2 uv=abs(n.x)>0.5?vec2(p.z,p.y):vec2(p.x,p.y);
  vec2 g=fract(uv/0.3)-0.5;
  float grout=smoothstep(0.42,0.47,max(abs(g.x),abs(g.y)));
  t.alb=srgb2lin(mix(vec3(0.62,0.85,0.92),vec3(0.96,0.97,0.96),grout));t.rough=0.22;t.spec=0.7;return true;}
 return false;}
vec2 objectMap(vec3 p){
 vec3 q=p;q.y+=0.05;
 // shower tray with a shallow dish and a drain
 float tray=sdRoundBox(q-vec3(0,-1.2,0),vec3(0.86,0.1,0.86),0.06);
 float dish=sdRoundBox(q-vec3(0.05,-1.0,0.05),vec3(0.72,0.1,0.72),0.08);
 tray=smax(tray,-dish,0.03);
 vec2 res=vec2(tray,M_WHITE);
 res=U(res,vec2(sdCylY(q-vec3(0.1,-1.135,0.1),0.012,0.1,0.006),M_STEEL));
 // tiled back walls
 float wb=sdRoundBox(q-vec3(0,0.1,-0.8),vec3(0.86,1.2,0.05),0.02);
 float wl=sdRoundBox(q-vec3(-0.8,0.1,0),vec3(0.05,1.2,0.86),0.02);
 res=U(res,vec2(min(wb,wl),100.0));
 // chrome frame: corner posts and top/bottom rails
 float fr=sdCapsule(q,vec3(0.82,-1.1,0.82),vec3(0.82,1.3,0.82),0.04);
 fr=min(fr,sdCapsule(q,vec3(-0.82,-1.1,0.82),vec3(-0.82,1.3,0.82),0.04));
 fr=min(fr,sdCapsule(q,vec3(0.82,-1.1,-0.82),vec3(0.82,1.3,-0.82),0.04));
 fr=min(fr,sdCapsule(q,vec3(-0.82,1.3,0.82),vec3(0.82,1.3,0.82),0.04));
 fr=min(fr,sdCapsule(q,vec3(0.82,1.3,-0.82),vec3(0.82,1.3,0.82),0.04));
 fr=min(fr,sdCapsule(q,vec3(-0.82,-1.08,0.82),vec3(0.82,-1.08,0.82),0.03));
 fr=min(fr,sdCapsule(q,vec3(0.82,-1.08,-0.82),vec3(0.82,-1.08,0.82),0.03));
 // door handle on the front glass
 fr=min(fr,sdCapsule(q,vec3(0.3,-0.2,0.9),vec3(0.3,0.4,0.9),0.035));
 fr=min(fr,sdCapsule(q,vec3(0.3,-0.12,0.8),vec3(0.3,-0.12,0.9),0.025));
 fr=min(fr,sdCapsule(q,vec3(0.3,0.32,0.8),vec3(0.3,0.32,0.9),0.025));
 res=U(res,vec2(fr,M_STEEL));
 // shower rail on the back wall, mixer and a big round rain shower head
 float sh=sdCapsule(q,vec3(-0.15,-0.1,-0.68),vec3(-0.15,1.0,-0.68),0.035);
 sh=min(sh,sdRoundBox(q-vec3(-0.15,-0.1,-0.7),vec3(0.2,0.07,0.06),0.05));
 sh=min(sh,sdCylY(vec3(q.x+0.42,q.z+0.66,q.y+0.1),0.05,0.08,0.03));
 sh=min(sh,sdCylY(vec3(q.x-0.12,q.z+0.66,q.y+0.1),0.05,0.08,0.03));
 sh=min(sh,sdCapsule(q,vec3(-0.15,1.0,-0.68),vec3(-0.15,0.84,-0.15),0.035));
 sh=min(sh,sdCapsule(q,vec3(-0.15,-0.1,-0.75),vec3(-0.15,-0.1,-0.68),0.05));
 sh=min(sh,sdCapsule(q,vec3(-0.15,1.0,-0.75),vec3(-0.15,1.0,-0.68),0.04));
 float head=sdCylY(q-vec3(-0.15,0.8,-0.15),0.04,0.33,0.035);
 sh=smin(sh,head,0.03);
 res=U(res,vec2(sh,M_STEEL));
 // a few water drops falling from the head
 for(int i=0;i<7;i++){float fi=float(i);
  vec3 c=vec3(-0.15+0.2*sin(fi*2.4),0.62-0.2*fi-0.08*fract(fi*0.37),-0.15+0.2*cos(fi*2.4));
  res=U(res,vec2(sdRoundCone(q,c-vec3(0,0.04,0),c+vec3(0,0.04,0),0.035,0.015),M_WATER));}
 // clear glass panels at the front and on the right
 if(!gNoGlass){
  float g=min(sdBox(q-vec3(0,0.1,0.82),vec3(0.82,1.2,0.012)),sdBox(q-vec3(0.82,0.1,0),vec3(0.012,1.2,0.82)));
  res=U(res,vec2(g,M_CLEAR));
 }
 return res;
}`},
 "heizung":{view:{"cam":[-1.6,1.5,5.8],"target":[0.25,0,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.12)*q.xz;return q;}
// one column section centred at x=0
float section(vec3 q){
 float s=sdRoundBox(q,vec3(0.07,0.6,0.16),0.065);
 // groove that splits the section into two tubes
 s+=0.025*smoothstep(0.05,0.0,abs(q.z))*smoothstep(0.52,0.42,abs(q.y));
 return s;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float sp=0.19;
 vec3 r=q;r.x=q.x-sp*clamp(round(q.x/sp),-5.0,5.0);
 float rad=section(r);
 // top and bottom headers joining the sections
 float hdr=min(sdCapsule(q,vec3(-0.95,0.5,0),vec3(0.95,0.5,0),0.085),sdCapsule(q,vec3(-0.95,-0.5,0),vec3(0.95,-0.5,0),0.085));
 rad=smin(rad,hdr,0.03);
 // feet under the end sections
 float feet=min(sdRoundBox(q-vec3(-0.95,-0.7,0),vec3(0.065,0.16,0.15),0.05),sdRoundBox(q-vec3(0.95,-0.7,0),vec3(0.065,0.16,0.15),0.05));
 rad=smin(rad,feet,0.04);
 vec2 res=vec2(rad,M_WHITE);
 // valve with the thermostat knob on the top right
 float pipe=sdCapsule(q,vec3(0.98,0.5,0),vec3(1.2,0.5,0),0.055);
 pipe=min(pipe,sdCylY(vec3(q.y-0.5,q.x-1.2,q.z),0.06,0.085,0.025));
 // bottom valve and a short pipe going down
 pipe=min(pipe,sdCapsule(q,vec3(0.98,-0.5,0),vec3(1.15,-0.5,0),0.05));
 pipe=min(pipe,sdRoundBox(q-vec3(1.15,-0.5,0),vec3(0.07,0.07,0.07),0.03));
 pipe=min(pipe,sdCapsule(q,vec3(1.15,-0.5,0),vec3(1.15,-0.8,0),0.05));
 res=U(res,vec2(pipe,M_STEEL));
 res=U(res,vec2(sdCylY(vec3(q.y+0.5,q.x-1.15,q.z-0.08),0.04,0.05,0.02),M_BRASS));
 vec3 k=q-vec3(1.42,0.5,0);
 float knob=sdCylY(vec3(k.y,k.x,k.z),0.17,0.15,0.06);
 knob+=0.012*smoothstep(0.3,1.0,cos(atan(k.z,k.y)*14.0))*smoothstep(-0.12,-0.05,k.x);
 res=U(res,vec2(knob,M_WHITE));
 res=U(res,vec2(sdCylY(vec3(k.y,k.x+0.19,k.z),0.03,0.12,0.015),M_GREY));
 return res;
}`},
 "rohr":{view:{"cam":[3.8,2.0,6.8],"target":[0.65,-0.15,0],"fov":28},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.72,0.75,0.80));t.metal=1.0;t.rough=0.18;return true;}
 if(m==101.0){t.alb=srgb2lin(vec3(0.24,0.25,0.27));t.rough=0.6;t.spec=0.2;return true;}
 return false;}
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.6)*q.xz;return q;}
// hollow tube piece: dc = distance to the centre line, cut = end planes
vec2 tube(float dc,float ro,float ri,float cut){return vec2(max(max(dc-ro,ri-dc),cut),dc<0.5*(ro+ri)?101.0:100.0);}
// hexagon (flat sides) of inner radius r
float hex2(vec2 p,float r){p=abs(p);return max(dot(p,vec2(0.866,0.5)),p.y)-r;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float ro=0.28,ri=0.22;
 // vertical leg
 vec2 res=tube(length(q.xz-vec2(-0.45,0.0)),ro,ri,abs(q.y+0.425)-0.675);
 // 90 degree elbow, bend centre (0,0.25), bend radius 0.45
 float dcE=length(vec2(length(q.xy-vec2(0.0,0.25))-0.45,q.z));
 res=U(res,tube(dcE,ro,ri,max(q.x,0.25-q.y)));
 // horizontal leg
 res=U(res,tube(length(q.yz-vec2(0.7,0.0)),ro,ri,abs(q.x-0.375)-0.375));
 // socket at the open end and a coupling ring on the vertical leg
 res=U(res,tube(length(q.yz-vec2(0.7,0.0)),0.345,0.27,abs(q.x-0.72)-0.15));
 // bead ring at the open end
 vec3 e=q-vec3(0.87,0.7,0.0);
 res=U(res,vec2(max(sdTorus(vec3(e.y,e.x,e.z),vec2(0.31,0.045)),-(length(q.yz-vec2(0.7,0.0))-0.27)),100.0));
 // hexagonal nut on the vertical leg
 vec2 h=q.xz-vec2(-0.45,0.0);
 float nut=max(hex2(h,0.32),abs(q.y+0.65)-0.1)-0.02;
 res=U(res,vec2(max(nut,0.26-length(h)),100.0));
 return res;
}`},
 "steckdose":{view:{"cam":[1.4,1.8,7.4],"target":[0.25,-0.05,0],"fov":27},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.3)*q.xz;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // square frame with a groove around the insert
 float frame=sdRoundBox(q-vec3(0,0,-0.05),vec3(1.0,1.0,0.12),0.11);
 float slot=sdRoundBox(q-vec3(0,0,0.1),vec3(0.8,0.8,0.1),0.08);
 frame=max(frame,-slot);
 float insert=sdRoundBox(q,vec3(0.75,0.75,0.13),0.07);
 float body=min(frame,insert);
 // round recess
 float rec=sdCylY(vec3(q.x,q.z-0.15,q.y),0.2,0.5,0.0);
 body=smax(body,-rec,0.03);
 // two round holes
 float holes=min(length(q.xy-vec2(-0.22,0.0)),length(q.xy-vec2(0.22,0.0)))-0.085;
 body=max(body,-max(holes,abs(q.z+0.1)-0.2));
 vec2 res=vec2(body,M_WHITE);
 res=U(res,vec2(max(holes+0.01,abs(q.z+0.2)-0.03),M_DARK));
 // earth clips at the top and bottom of the recess
 vec3 c=q;c.y=abs(c.y);
 float clip=sdRoundBox(c-vec3(0,0.48,0.05),vec3(0.13,0.055,0.09),0.025);
 res=U(res,vec2(clip,M_STEEL));
 return res;
}`},
 "stecker":{view:{"cam":[1.2,2.6,6.4],"target":[-0.1,-0.2,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.5)*q.xz;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // round plug head, axis along x, front face at x=0.3
 float head=sdCylY(vec3(q.y,q.x+0.025,q.z),0.325,0.42,0.1);
 // tapered grip with rings
 float grip=sdRoundCone(q,vec3(-0.3,0,0),vec3(-0.85,0,0),0.34,0.14);
 grip+=0.012*smoothstep(0.2,1.0,sin(q.x*45.0))*step(q.x,-0.4);
 float body=smin(head,grip,0.06);
 // earth contact grooves on the top and bottom
 vec3 e=q;e.y=abs(e.y);
 body=max(body,-sdBox(e-vec3(0.16,0.43,0),vec3(0.17,0.08,0.1)));
 vec2 res=vec2(body,M_WHITE);
 res=U(res,vec2(sdBox(e-vec3(0.16,0.36,0),vec3(0.15,0.015,0.08)),M_STEEL));
 // two round pins
 vec3 n=q;n.z=abs(n.z);
 res=U(res,vec2(sdCapsule(n,vec3(0.3,0,0.2),vec3(0.82,0,0.2),0.065),M_STEEL));
 // short cable lying on the ground
 // short cable: down to the ground, a half loop behind the plug, then a short tail
 float cab=sdCapsule(q,vec3(-0.8,0,0),vec3(-1.25,-0.33,0.0),0.09);
 vec2 v=q.xz-vec2(-1.25,-0.35);
 cab=smin(cab,sdCappedTorus(vec3(v.y,-v.x,q.y+0.33),vec2(1.0,0.0),0.35,0.09),0.03);
 cab=smin(cab,sdCapsule(q,vec3(-1.25,-0.33,-0.7),vec3(-0.85,-0.33,-0.72),0.09),0.03);
 res=U(res,vec2(cab,M_WHITE));
 return res;
}`},
 "waschbecken":{view:{"cam":[1.4,4.8,5.8],"target":[0.2,-0.15,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.25)*q.xz;q.y+=0.1;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // oval basin with a flat rim and a wider back deck
 float outer=sdEllipsoid(q-vec3(0,0.85,0),vec3(1.0,0.56,0.72));
 outer=smax(outer,q.y-0.85,0.06);
 float inner=sdEllipsoid(q-vec3(0,0.9,0.08),vec3(0.8,0.46,0.5));
 float bowl=smax(outer,-inner,0.04);
 // pedestal: flared foot and a slim column
 float foot=sdCappedCone(q-vec3(0,-1.15,0),0.15,0.36,0.24)-0.02;
 float col=sdRoundCone(q,vec3(0,-1.0,0),vec3(0,0.4,0),0.2,0.28);
 float ped=smin(foot,col,0.12);
 // cut the bowl again so the pedestal top does not show inside
 vec2 res=vec2(smax(smin(bowl,ped,0.06),-inner,0.04),M_WHITE);
 // drain
 res=U(res,vec2(sdTorus(q-vec3(0,0.45,0.08),vec2(0.09,0.025)),M_STEEL));
 res=U(res,vec2(sdCylY(q-vec3(0,0.44,0.08),0.02,0.08,0.01),M_CHARCOAL));
 // small tap on the back deck
 float tap=sdCylY(q-vec3(0,0.88,-0.52),0.04,0.1,0.03);
 tap=smin(tap,sdCylY(q-vec3(0,1.0,-0.52),0.12,0.07,0.04),0.02);
 tap=min(tap,sdCapsule(q,vec3(0,1.05,-0.52),vec3(0,1.08,-0.26),0.04));
 tap=smin(tap,sdCapsule(q,vec3(0,1.08,-0.26),vec3(0,1.0,-0.2),0.04),0.02);
 tap=min(tap,sdCapsule(q,vec3(0,1.13,-0.52),vec3(0,1.2,-0.75),0.03));
 res=U(res,vec2(tap,M_STEEL));
 return res;
}`},
 "wasserhahn":{view:{"cam":[1.0,1.6,6.0],"target":[0.1,-0.2,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.35)*q.xz;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // round base and tall body
 float base=sdCylY(q-vec3(0,-1.0,0),0.05,0.4,0.04);
 float body=sdCylY(q-vec3(0,-0.3,0),0.68,0.21,0.05);
 float tap=smin(base,body,0.06);
 tap=smin(tap,sdCylY(q-vec3(0,0.45,0),0.1,0.2,0.08),0.03);
 // spout: straight, then bent down
 float sp=sdCapsule(q,vec3(0.0,0.18,0),vec3(0.55,0.2,0),0.085);
 vec3 a=q-vec3(0.55,-0.05,0);vec2 v=rot(-0.785)*a.xy;
 sp=min(sp,sdCappedTorus(vec3(v,a.z),vec2(sin(0.785),cos(0.785)),0.25,0.085));
 sp=min(sp,sdCylY(q-vec3(0.8,-0.1,0),0.06,0.095,0.02));
 tap=smin(tap,sp,0.04);
 // single lever on top
 tap=smin(tap,sdRoundCone(q,vec3(0,0.58,0),vec3(-0.6,0.74,0),0.09,0.055),0.03);
 vec2 res=vec2(tap,M_STEEL);
 // hot and cold dots
 res=U(res,vec2(length(q-vec3(0.06,0.5,0.19))-0.04,M_RED));
 res=U(res,vec2(length(q-vec3(0.06,0.5,-0.19))-0.04,M_BLUE));
 // water stream and a falling drop
 float w=sdRoundCone(q,vec3(0.8,-0.62,0),vec3(0.8,-0.15,0),0.04,0.06);
 w=min(w,sdRoundCone(q,vec3(0.8,-0.86,0),vec3(0.8,-0.75,0),0.06,0.015));
 res=U(res,vec2(w,M_WATER));
 return res;
}`},
 "kabel":{view:{"cam":[1.2,3.4,6.2],"target":[0.1,-0.2,0.4],"fov":28},glsl:`
#define HAS_MAT
bool objectMat(float m,vec3 p,vec3 n,inout Mat t){
 if(m==100.0){t.alb=srgb2lin(vec3(0.09,0.09,0.10));t.rough=0.35;t.spec=0.55;return true;}
 return false;}
vec3 local(vec3 p){vec3 q=p;q.y+=0.3;return q;}
// loose stack of cable loops lying flat
float coil(vec3 q){
 float d=1e9;
 for(int i=0;i<4;i++){float fi=float(i);
  vec3 c=q-vec3(0.04*sin(fi*2.3),-0.35+0.165*fi,0.05*cos(fi*1.7));
  c.xy=rot(0.06*sin(fi*1.9))*c.xy;c.yz=rot(0.05*cos(fi*2.7))*c.yz;
  d=min(d,sdTorus(c,vec2(0.8+0.04*sin(fi*3.1),0.085)));}
 return d;}
// plug in its own frame: axis along x, pins at +x
vec2 plug(vec3 l){
 float head=sdCylY(vec3(l.y,l.x,l.z),0.2,0.28,0.07);
 float grip=sdRoundCone(l,vec3(-0.2,0,0),vec3(-0.55,0,0),0.24,0.1);
 grip+=0.01*smoothstep(0.2,1.0,sin(l.x*55.0))*step(l.x,-0.25);
 vec2 res=vec2(smin(head,grip,0.04),100.0);
 vec3 n=l;n.z=abs(n.z);
 res=U(res,vec2(sdCapsule(n,vec3(0.2,0,0.13),vec3(0.55,0,0.13),0.045),M_STEEL));
 return res;}
// socket coupler in its own frame: face at +x
vec2 socket(vec3 l){
 float body=sdCylY(vec3(l.y,l.x+0.05,l.z),0.25,0.32,0.08);
 float grip=sdRoundCone(l,vec3(-0.25,0,0),vec3(-0.6,0,0),0.28,0.1);
 body=smin(body,grip,0.05);
 float rec=sdCylY(vec3(l.y,l.x-0.2,l.z),0.12,0.22,0.0);
 body=smax(body,-rec,0.02);
 float holes=min(length(l.yz-vec2(0,-0.1)),length(l.yz-vec2(0,0.1)))-0.042;
 body=max(body,-max(holes,abs(l.x-0.05)-0.08));
 vec2 res=vec2(body,(l.x>0.065&&length(l.yz)<0.235)?M_CHARCOAL:100.0);
 vec3 c=l;c.y=abs(c.y);
 res=U(res,vec2(sdRoundBox(c-vec3(0.1,0.21,0),vec3(0.06,0.03,0.06),0.015),M_STEEL));
 return res;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 res=vec2(coil(q),100.0);
 // cable to the plug (front left)
 float cab=sdCapsule(q,vec3(-0.72,-0.35,0.35),vec3(-1.1,-0.34,0.5),0.085);
 cab=smin(cab,sdCapsule(q,vec3(-1.1,-0.34,0.5),vec3(-1.2,-0.17,0.7),0.085),0.06);
 // cable to the socket (front right)
 cab=min(cab,sdCapsule(q,vec3(0.6,-0.35,0.53),vec3(0.8,-0.3,0.6),0.085));
 cab=smin(cab,sdCapsule(q,vec3(0.8,-0.3,0.6),vec3(0.84,-0.14,0.66),0.085),0.06);
 res=U(res,vec2(cab,100.0));
 vec3 l=q-vec3(-0.85,-0.15,1.15);l.xz=rot(0.927)*l.xz;
 res=U(res,plug(l));
 vec3 s=q-vec3(1.0,-0.12,1.2);s.xz=rot(1.265)*s.xz;
 res=U(res,socket(s));
 return res;
}`},
};
