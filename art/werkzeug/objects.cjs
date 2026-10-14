// Shader models for the Nesne Kasası tools (category objects-tools).
// Each entry: camera view + GLSL that defines objectMap(p) -> vec2(distance, material).
// render.cjs draws them into public/objects/toon/tools-<id>.webp.
module.exports={
 "bohrmaschine":{view:{"cam":[2.2,1.4,5.6],"target":[0.05,-0.15,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.15)*q.xz;return q;}
vec2 drillBit(vec3 q){
 vec3 b=q-vec3(1.02,0.18,0);
 float tw=b.x*28.0;vec3 r=b;r.yz=rot(tw)*r.yz;
 float core=sdCylY(vec3(b.y,b.x,b.z),0.3,0.045,0.01);
 float bit=max(core,-(length(r.yz-vec2(0.0,0.05))-0.022));
 bit=max(bit,-(length(r.yz-vec2(0.0,-0.05))-0.022));
 // pointed tip
 bit=max(bit,(b.x-0.26)+length(b.yz)*0.9);
 return vec2(bit,M_STEEL);
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // main housing
 float body=sdRoundBox(q-vec3(-0.12,0.18,0),vec3(0.42,0.2,0.17),0.15);
 body=smin(body,sdEllipsoid(q-vec3(-0.5,0.18,0),vec3(0.24,0.25,0.2)),0.08);
 vec2 res=vec2(body,M_TEAL);
 // vents on the motor
 vec3 v=q-vec3(-0.6,0.22,0.0);
 float vents=sdBox(vec3(mod(v.x+0.03,0.06)-0.03,v.y,v.z),vec3(0.012,0.06,0.3));
 vents=max(vents,sdBox(v,vec3(0.1,0.07,0.3)));
 res.x=max(res.x,-vents*0.5-0.0);
 // gear ring + chuck
 float ring=sdCylY(vec3(q.y-0.18,q.x-0.35,q.z),0.06,0.17,0.03);
 res=U(res,vec2(ring,M_ORANGE));
 float chuck=sdCappedCone(vec3(q.y-0.18,-(q.x-0.55),q.z),0.15,0.09,0.15);
 chuck+=0.006*smoothstep(0.5,1.0,cos(atan(q.z,q.y-0.18)*14.0));
 res=U(res,vec2(chuck,M_RUBBER));
 float jaw=sdCylY(vec3(q.y-0.18,q.x-0.73,q.z),0.04,0.06,0.01);
 res=U(res,vec2(jaw,M_STEEL));
 res=U(res,drillBit(q));
 // handle tilted back
 vec3 h=q-vec3(-0.18,-0.32,0);h.xy=rot(-0.28)*h.xy;
 float handle=sdRoundBox(h,vec3(0.12,0.36,0.13),0.1);
 res=U(res,vec2(smin(handle,body,0.08),M_TEAL));
 // grip insert
 float grip=sdRoundBox(h-vec3(0.0,0.0,0.0),vec3(0.13,0.24,0.138),0.1);
 res=U(res,vec2(grip,M_RUBBER));
 // trigger
 vec3 tr=q-vec3(0.0,-0.08,0);tr.xy=rot(-0.28)*tr.xy;
 res=U(res,vec2(sdRoundBox(tr-vec3(0.11,0.0,0),vec3(0.05,0.08,0.05),0.03),M_ORANGE));
 // battery
 float bat=sdRoundBox(q-vec3(-0.12,-0.86,0),vec3(0.33,0.13,0.2),0.07);
 res=U(res,vec2(bat,M_RUBBER));
 float stripe=sdRoundBox(q-vec3(-0.12,-0.86,0),vec3(0.335,0.035,0.205),0.03);
 res=U(res,vec2(stripe,M_ORANGE));
 return res;
}`},
 "buerste":{view:{"cam":[0.6,2,5.4],"target":[0,-0.35,0],"fov":27},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.45)*q.xz;return q;}
vec3 objectWoodSpace(vec3 p){vec3 q=local(p);return vec3(q.y*3.0,q.x,q.z*3.0);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // wooden block, slightly boat shaped
 vec3 b=q-vec3(0,-0.05,0);
 float w=0.27-0.08*pow(abs(b.x)/0.95,4.0);
 float block=sdRoundBox(b,vec3(0.95,0.13,w),0.1);
 block=smax(block,-(length(b.xy-vec2(0.0,0.42))-0.3),0.06);
 vec2 res=vec2(block,M_WOOD);
 // bristle tufts
 vec3 r=q-vec3(0,-0.36,0);
 float s=0.105;
 vec2 id=clamp(round(r.xz/s),vec2(-8.0,-2.0),vec2(8.0,2.0));
 vec2 c=r.xz-id*s;
 float jitter=hash31(vec3(id,1.0));
 float tuft=sdCylY(vec3(c.x,r.y+0.02*jitter,c.y),0.19,0.044,0.03);
 float fill=sdRoundBox(r-vec3(0,0.06,0),vec3(0.84,0.12,0.19),0.06);
 res=U(res,vec2(min(tuft,fill),M_BRISTLE));
 return res;
}`},
 "duebel":{view:{"cam":[0,1.5,6],"target":[0,-0.1,0],"fov":27},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.25)*q.xz;q.xy=rot(-1.05)*q.xy;return q;}
float plug(vec3 q){
 // along y: collar at top (y=1.0), tip at bottom (y=-1.0)
 float y=q.y;
 float saw=fract(y*5.0);
 float r=0.2+0.05*saw*smoothstep(0.75,0.6,y);
 r*=mix(0.78,1.0,smoothstep(-1.0,-0.4,y));
 float d=(length(q.xz)-r)*0.8;
 d=max(d,abs(y)-0.95);
 float collar=sdCylY(q-vec3(0,0.92,0),0.06,0.3,0.03);
 d=smin(d,collar,0.02);
 // fins
 float fin=sdRoundBox(q-vec3(0,0.62,0),vec3(0.34,0.12,0.03),0.02);
 fin=max(fin,abs(q.y-0.62)-0.12+abs(q.x)*0.2);
 d=min(d,fin);
 // centre hole and slits
 d=max(d,-(length(q.xz)-0.085));
 float slit=sdBox(q-vec3(0,-0.3,0),vec3(0.035,0.72,0.5));
 d=max(d,-slit);
 return d;
}
vec2 objectMap(vec3 p){return vec2(plug(local(p)),M_GREY);}`},
 "haken":{view:{"cam":[0,1.2,6],"target":[0,0,0],"fov":26},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.5)*q.xz;q.xy=rot(-0.3)*q.xy;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // threaded screw part, tip at y=-1.05
 float ang=atan(q.z,q.x);
 float ph=fract(q.y*6.0+ang/6.2831853);
 float thread=0.03*(1.0-abs(ph-0.5)*2.0)*smoothstep(-0.05,-0.12,q.y);
 float rr=(0.075+thread)*smoothstep(-1.08,-0.72,q.y);
 float screw=(length(q.xz)-rr)*0.7;
 screw=max(screw,max(q.y,-1.08-q.y));
 // collar disc
 float collar=sdCylY(q-vec3(0,0.02,0),0.035,0.15,0.02);
 // straight stem
 float stem=sdCapsule(q,vec3(0,0.0,0),vec3(0,0.45,0),0.075);
 // hook arc, centre (0.3,0.45)
 vec3 h=q-vec3(0.3,0.45,0);h.xy=rot(0.55)*h.xy;
 float arc=sdCappedTorus(h,vec2(sin(2.1),cos(2.1)),0.3,0.075);
 float d=smin(min(screw,collar),min(stem,arc),0.03);
 return vec2(d,M_BRASS);
}`},
 "hammer":{view:{"cam":[0,1.3,6],"target":[0,-0.1,0],"fov":28},glsl:`
#define HAS_WOOD
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.5)*q.xz;q.xy=rot(0.55)*q.xy;return q;}
vec3 objectWoodSpace(vec3 p){return local(p);}
vec2 hammer(vec3 q){
 float handle=sdRoundCone(q,vec3(0,-1.05,0),vec3(0,0.6,0),0.115,0.085);
 vec2 res=vec2(handle,M_WOOD);
 float grip=sdRoundCone(q,vec3(0,-1.1,0),vec3(0,-0.3,0),0.15,0.13);
 grip+=0.012*smoothstep(-0.3,0.9,sin(q.y*60.0));
 res=U(res,vec2(grip,M_ORANGE));
 vec3 h=q-vec3(0,0.8,0);
 float block=sdRoundBox(h-vec3(0.02,0,0),vec3(0.24,0.16,0.15),0.06);
 float face=sdCylY(vec3(h.y,h.x-0.3,h.z),0.12,0.18,0.04);
 vec3 c=h;c.z*=0.85;
 float claw=sdRoundCone(c,vec3(-0.18,0.03,0),vec3(-0.42,-0.03,0),0.12,0.095);
 claw=smin(claw,sdRoundCone(c,vec3(-0.42,-0.03,0),vec3(-0.6,-0.17,0),0.095,0.07),0.03);
 claw=smin(claw,sdRoundCone(c,vec3(-0.6,-0.17,0),vec3(-0.68,-0.33,0),0.07,0.035),0.03);
 float slot=sdBox(h-vec3(-0.55,-0.15,0),vec3(0.2,0.3,0.03));
 claw=smax(claw,-slot,0.01);
 float head=smin(min(block,face),claw,0.05);
 res=U(res,vec2(head,M_STEEL));
 return res;
}
vec2 objectMap(vec3 p){return hammer(local(p));}`},
 "kehrblech":{view:{"cam":[1.2,3.4,4.6],"target":[0,-0.35,0],"fov":30},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(3.14159-0.4)*q.xz;q.y+=0.48;q.z+=0.45;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // pan: front lip at z=0, back wall at z=0.75
 float outer=sdRoundBox(q-vec3(0,0.16,0.37),vec3(0.62,0.16,0.38),0.05);
 float slope=q.y-(0.03+0.32*clamp(q.z/0.75,0.0,1.0));
 outer=smax(outer,slope,0.03);
 float inner=sdRoundBox(q-vec3(0,0.22,0.3),vec3(0.57,0.19,0.42),0.04);
 float pan=max(outer,-inner);
 vec2 res=vec2(pan,M_TEAL);
 // rubber lip
 float lip=sdCapsule(q,vec3(-0.6,0.025,0.0),vec3(0.6,0.025,0.0),0.025);
 res=U(res,vec2(lip,M_RUBBER));
 // handle
 float handle=sdRoundCone(q,vec3(0,0.22,0.76),vec3(0,0.36,1.45),0.085,0.07);
 res=U(res,vec2(smin(handle,pan,0.05),M_TEAL));
 float hole=length(q.xz-vec2(0.0,1.36))-0.035;
 res.x=max(res.x,-max(hole,abs(q.y-0.36)-0.2));
 // dust crumbs
 for(int i=0;i<7;i++){float fi=float(i);vec3 c=vec3(-0.35+0.11*fi+0.05*sin(fi*3.1),0.06,0.25+0.18*sin(fi*1.7));
  res=U(res,vec2(sdEllipsoid(q-c,vec3(0.045,0.03,0.04)*(0.8+0.4*fract(fi*0.37))),i%3==0?M_GREY:M_RATTAN));}
 return res;
}`},
 "kleber":{view:{"cam":[0.3,1.7,5.6],"target":[0,-0.2,0],"fov":27},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.3)*q.xz;q.xy=rot(-0.18)*q.xy;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // tube body along x: round at x=-0.55, flat crimp at x=0.85
 float t=clamp((q.x+0.55)/1.4,0.0,1.0);
 float a=mix(0.27,0.36,t*t);float b=mix(0.27,0.03,pow(t,1.6));
 float e=(length(vec2(q.y/a,q.z/b))-1.0)*min(a,b);
 float body=max(e,abs(q.x-0.15)-0.7);
 float mat=abs(q.x-0.1)<0.13?M_RED:M_YELLOW;
 if(q.x>0.55)mat=M_WHITE;
 vec2 res=vec2(body,mat);
 // crimp
 float crimp=sdRoundBox(q-vec3(0.92,0,0),vec3(0.09,0.37,0.03),0.015);
 crimp+=0.006*smoothstep(0.3,1.0,sin(q.x*120.0));
 res=U(res,vec2(crimp,M_WHITE));
 // shoulder, nozzle and cap
 float sh=sdRoundCone(vec3(q.y,-q.x,q.z),vec3(0,0.5,0),vec3(0,0.7,0),0.26,0.1);
 res=U(res,vec2(sh,M_YELLOW));
 float cap=sdCappedCone(vec3(q.y,-(q.x+0.93),q.z),0.2,0.12,0.065);
 cap+=0.006*smoothstep(0.4,1.0,cos(atan(q.z,q.y)*16.0))*step(q.x,-0.8);
 res=U(res,vec2(cap,M_RED));
 return res;
}`},
 "putzeimer":{view:{"cam":[0,2.7,5.2],"target":[0,-0.15,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.3)*q.xz;q.y+=0.25;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float outer=sdCappedCone(q,0.68,0.5,0.68);
 float inner=sdCappedCone(q-vec3(0,0.06,0),0.68,0.45,0.63);
 float bucket=max(outer,-inner);
 float rim=sdTorus(q-vec3(0,0.67,0),vec2(0.66,0.04));
 bucket=smin(bucket,rim,0.02);
 // ribs
 float ribs=sdTorus(q-vec3(0,0.2,0),vec2(0.6,0.025));
 bucket=min(bucket,ribs);
 vec2 res=vec2(bucket,M_BLUE);
 // water
 float water=max(inner-0.0,q.y-0.38);water=max(water,-(q.y-0.36));
 water=sdCylY(q-vec3(0,0.37,0),0.01,0.6,0.005);
 res=U(res,vec2(water,M_WATER));
 // foam
 float foam=1e9;
 for(int i=0;i<14;i++){float fi=float(i);float ang=fi*2.39996;float rad=0.12+0.4*fract(fi*0.618);
  vec3 c=vec3(cos(ang)*rad,0.45+0.18*fract(fi*0.31)+0.12*(1.0-rad),sin(ang)*rad);
  foam=smin(foam,length(q-c)-(0.13+0.06*fract(fi*0.77)),0.04);}
 res=U(res,vec2(foam,M_FOAM));
 // cloth hanging over the rim (front-left)
 vec3 c=q;c.xz=rot(-0.9)*c.xz;
 float cl=sdRoundBox(c-vec3(0.0,0.62,0.66),vec3(0.24,0.06,0.07),0.04);
 float hang=sdRoundBox(c-vec3(0.0,0.38,0.73),vec3(0.22,0.26,0.025),0.02);
 hang+=0.015*sin(c.x*18.0+c.y*6.0);
 res=U(res,vec2(smin(cl,hang,0.05),M_CLOTH));
 // handle
 vec3 h=q-vec3(0,0.67,0);
 float arc=sdCappedTorus(vec3(h.x,h.y,h.z),vec2(sin(1.25),cos(1.25)),0.66,0.025);
 res=U(res,vec2(arc,M_STEEL));
 float grip=sdCapsule(h,vec3(-0.18,0.64,0),vec3(0.18,0.64,0),0.06);
 res=U(res,vec2(grip,M_ORANGE));
 return res;
}`},
 "schraube":{view:{"cam":[0,1.6,6],"target":[0,-0.1,0],"fov":26},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.35)*q.xz;q.xy=rot(-1.12)*q.xy;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // head at top (y=0.95..1.1), countersunk to y=0.78
 float head=sdCappedCone(q-vec3(0,0.87,0),0.09,0.1,0.3);
 head=smin(head,sdCylY(q-vec3(0,1.0,0),0.035,0.3,0.02),0.02);
 float cross1=sdBox(q-vec3(0,1.04,0),vec3(0.2,0.08,0.035));
 float cross2=sdBox(q-vec3(0,1.04,0),vec3(0.035,0.08,0.2));
 head=max(head,-max(min(cross1,cross2),-(1.04-0.13-q.y)+0.0));
 // shank with thread
 float ang=atan(q.z,q.x);
 float ph=fract(q.y*5.0+ang/6.2831853);
 float th=0.06*(1.0-abs(ph-0.5)*2.0)*smoothstep(0.42,0.32,q.y);
 float rr=(0.095+th)*smoothstep(-1.12,-0.55,q.y);
 float shank=(length(q.xz)-rr)*0.6;
 shank=max(shank,max(q.y-0.82,-1.12-q.y));
 return vec2(smin(head,shank,0.03),M_STEEL);
}`},
 "schraubenzieher":{view:{"cam":[0,1.6,6],"target":[0,-0.15,0],"fov":27},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.35)*q.xz;q.xy=rot(-0.5)*q.xy;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // handle along x from -1.05 to -0.2
 float a=atan(q.z,q.y);
 float handle=sdRoundCone(vec3(q.y,q.x,q.z),vec3(0,-1.02,0),vec3(0,-0.25,0),0.2,0.17);
 float flute=smoothstep(0.55,1.0,cos(a*6.0))*smoothstep(-0.95,-0.85,q.x)*smoothstep(-0.25,-0.38,q.x);
 vec2 res=vec2(handle+0.03*flute,flute>0.3?M_RUBBER:M_ORANGE);
 float cap=sdRoundCone(vec3(q.y,q.x,q.z),vec3(0,-1.12,0),vec3(0,-0.98,0),0.15,0.19);
 res=U(res,vec2(cap,M_TEAL));
 float ferrule=sdCylY(vec3(q.y,q.x+0.17,q.z),0.08,0.1,0.02);
 res=U(res,vec2(ferrule,M_STEEL));
 float shaft=sdCylY(vec3(q.y,q.x-0.4,q.z),0.6,0.055,0.01);
 // flat blade tip
 float t=clamp((q.x-0.92)/0.2,0.0,1.0);
 vec3 b=q-vec3(1.03,0,0);
 float blade=sdRoundBox(b,vec3(0.11,0.075,mix(0.05,0.012,t)),0.008);
 float tip=smin(shaft,blade,0.04);
 res=U(res,vec2(tip,M_STEEL));
 return res;
}`},
 "tapete":{view:{"cam":[1,2.3,5.3],"target":[0,-0.35,0.2],"fov":28},glsl:`
#define HAS_PAPER
vec3 local(vec3 p){vec3 q=p;q.xz=rot(-0.4)*q.xz;q.y+=0.3;return q;}
vec3 flowers(vec2 uv){
 vec2 g=uv*1.9;vec2 id=floor(g);vec2 f=fract(g)-0.5;
 if(mod(id.x+id.y,2.0)>0.5)f=fract(g+0.5)-0.5;
 float a=atan(f.y,f.x);float r=length(f);
 float petal=r-(0.22+0.1*cos(5.0*a));
 vec3 bg=vec3(0.80,0.93,0.86);
 vec3 c=mix(vec3(0.97,0.55,0.66),bg,smoothstep(-0.01,0.02,petal));
 c=mix(vec3(1.0,0.82,0.25),c,smoothstep(0.07,0.09,r));
 float dot2=length(fract(g+vec2(0.5,0.0))-0.5)-0.05;
 c=mix(vec3(0.35,0.70,0.62),c,smoothstep(0.0,0.02,dot2)*step(0.12,r));
 return srgb2lin(c);}
vec3 objectPaper(vec3 p,vec3 n){
 vec3 q=local(p);
 vec3 rn=n;rn.xz=rot(-0.4)*rn.xz;
 if(abs(rn.x)>0.8&&q.y>0.05){float rr=length(q.yz-vec2(0.32,-0.25));return srgb2lin(mix(vec3(0.97,0.96,0.92),vec3(0.75,0.85,0.80),0.5+0.5*sin(rr*160.0)));}
 if(q.z>-0.1&&q.y<0.07)return flowers(vec2(q.x,q.z));
 float ang=atan(q.y-0.32,q.z+0.25);
 return flowers(vec2(q.x,ang*0.33));}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // roll lying along x
 float roll=sdCylY(vec3(q.z+0.25,q.x,q.y-0.32),0.78,0.32,0.03);
 // unrolled sheet on the floor
 float sheet=sdRoundBox(q-vec3(0,0.012,0.45),vec3(0.76,0.01,0.7),0.008);
 // curl at the end
 vec3 c=q-vec3(0,0.09,1.15);
 float curl=sdCappedTorus(vec3(c.z,c.y,c.x)*vec3(1,1,1),vec2(sin(1.6),cos(1.6)),0.08,0.01);
 curl=max(sdCappedTorus(vec3(c.z,-c.y,0.0)+vec3(0,0,0),vec2(sin(1.9),cos(1.9)),0.08,0.01),abs(c.x)-0.76);
 float d=min(roll,min(sheet,curl));
 return vec2(d,M_PAPER);
}`},
 "teppichklopfer":{view:{"cam":[0,1.2,6],"target":[0,0.05,0],"fov":27},glsl:`
#define HAS_RATTAN
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.35)*q.xz;q.xy=rot(0.42)*q.xy;return q;}
float objectRattanCoord(vec3 p){vec3 q=local(p);return q.y*1.3+q.x*0.9+atan(q.z,q.x)*0.05;}
float loopRing(vec3 q,vec2 c,float r){vec3 h=q-vec3(c,0.0);return sdTorus(h.xzy,vec2(r,0.038));}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 // handle
 float handle=sdRoundCone(q,vec3(0,-1.2,0),vec3(0,-0.15,0),0.075,0.06);
 vec2 res=vec2(handle,M_RATTAN);
 float grip=sdRoundCone(q,vec3(0,-1.24,0),vec3(0,-0.62,0),0.095,0.085);
 grip+=0.008*smoothstep(0.0,1.0,sin(q.y*70.0+atan(q.z,q.x)));
 res=U(res,vec2(grip,M_RED));
 // stems into the loops
 float stems=min(sdCapsule(q,vec3(-0.03,-0.2,0),vec3(-0.12,0.18,0),0.04),sdCapsule(q,vec3(0.03,-0.2,0),vec3(0.12,0.18,0),0.04));
 float loops=min(loopRing(q,vec2(0.0,0.82),0.3),min(loopRing(q,vec2(-0.26,0.38),0.24),loopRing(q,vec2(0.26,0.38),0.24)));
 loops=min(loops,loopRing(q,vec2(0.0,0.52),0.14));
 res=U(res,vec2(smin(stems,loops,0.03),M_RATTAN));
 return res;
}`},
 "wasserwaage":{view:{"cam":[0,1.8,5.8],"target":[0,-0.25,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.62)*q.xz;q.xy=rot(-0.1)*q.xy;q.y+=0.38;return q;}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 float body=sdRoundBox(q,vec3(1.15,0.17,0.08),0.035);
 // windows
 float w1=sdRoundBox(q-vec3(0.0,0.0,0.0),vec3(0.2,0.09,0.2),0.06);
 float w2=sdRoundBox(q-vec3(0.78,0.0,0.0),vec3(0.09,0.09,0.2),0.06);
 body=max(body,-min(w1,w2));
 vec2 res=vec2(body,M_ORANGE);
 // end caps
 float caps=max(sdRoundBox(q,vec3(1.17,0.18,0.09),0.04),abs(q.x)-1.03<0.0?-1.0:1.0);
 caps=max(sdRoundBox(q,vec3(1.17,0.18,0.09),0.04),-(abs(q.x)-1.02));
 res=U(res,vec2(caps,M_RUBBER));
 // vials
 float v1=sdCapsule(q,vec3(-0.15,0,0),vec3(0.15,0,0),0.06);
 float v2=sdCapsule(q,vec3(0.78,-0.07,0),vec3(0.78,0.07,0),0.06);
 res=U(res,vec2(min(v1,v2),M_GLASS));
 float b1=sdEllipsoid(q-vec3(0.0,0.03,0.0),vec3(0.05,0.035,0.045));
 float b2=sdEllipsoid(q-vec3(0.79,0.0,0.0),vec3(0.035,0.05,0.045));
 res=U(res,vec2(min(b1,b2)-0.012,M_WHITE));
 // vial marks
 float marks=min(sdBox(vec3(abs(q.x)-0.075,q.y,q.z),vec3(0.006,0.075,0.075)),1e9);
 res=U(res,vec2(marks,M_DARK));
 return res;
}`},
 "zange":{view:{"cam":[0,2.4,5.6],"target":[0,-0.2,0],"fov":28},glsl:`
vec3 local(vec3 p){vec3 q=p;q.yz=rot(0.28)*q.yz;q.xz=rot(0.35)*q.xz;q.xy=rot(0.7)*q.xy;return q;}
vec2 half_(vec3 q,float s){
 // the jaw on side s belongs to the handle on side -s; open a little around the rivet
 vec3 h=q;h.xy=rot(s*0.06)*h.xy;h.z+=s*0.025;
 vec3 z=h;z.z*=1.7;
 float jaw=sdRoundCone(z,vec3(s*0.075,0.0,0),vec3(s*0.02,0.8,0),0.12,0.035);
 jaw=max(jaw,-s*h.x-0.004);
 jaw+=0.008*smoothstep(0.3,1.0,sin(h.y*80.0))*step(abs(h.x),0.04)*step(0.35,h.y);
 float neck=sdRoundCone(z,vec3(s*0.02,0.05,0),vec3(-s*0.12,-0.35,0),0.15,0.1);
 vec2 res=vec2(smin(jaw,neck,0.06),M_STEEL);
 float handle=sdRoundCone(h,vec3(-s*0.12,-0.33,0),vec3(-s*0.25,-0.85,0),0.085,0.105);
 handle=smin(handle,sdRoundCone(h,vec3(-s*0.25,-0.85,0),vec3(-s*0.28,-1.35,0),0.105,0.085),0.06);
 handle+=0.006*smoothstep(0.3,1.0,sin(h.y*40.0))*step(h.y,-0.5);
 res=U(res,vec2(handle,M_RED));
 float guard=sdEllipsoid(h-vec3(-s*0.15,-0.45,0),vec3(0.13,0.05,0.13));
 res=U(res,vec2(guard,M_RED));
 return res;
}
vec2 objectMap(vec3 p){
 vec3 q=local(p);
 vec2 res=U(half_(q,1.0),half_(q,-1.0));
 float rivet=sdCylY(vec3(q.x,q.z,q.y-0.0),0.1,0.075,0.03);
 res=U(res,vec2(rivet,M_STEEL));
 return res;
}`},
 "zollstock":{view:{"cam":[0,3.4,4],"target":[0,-0.35,0],"fov":32},glsl:`
#define HAS_RULER
vec3 local(vec3 p){vec3 q=p;q.xz=rot(0.18)*q.xz;q.y+=0.6;return q;}
const int NS=5;
const float SL=0.62;
vec2 pts(int i){float x=-0.8+float(i)*0.36;float z=(i%2==0)?-0.42:0.42;if(i==NS)z=0.75;return vec2(x,z);}
float segD(vec3 q,int i,out float s,out float across){
 vec2 a=pts(i),b=pts(i+1);vec2 d=normalize(b-a);vec2 nrm=vec2(-d.y,d.x);
 vec2 rel=q.xz-a;float L=length(b-a);s=dot(rel,d);across=dot(rel,nrm);
 vec3 l=vec3(s-L*0.5,q.y-0.035-0.05*float(i%2),across);
 return sdRoundBox(l,vec3(L*0.5+0.08,0.025,0.11),0.015);}
vec3 objectRuler(vec3 p){
 vec3 q=local(p);float best=1e9;float sb=0.0;float ab=0.0;int ib=0;
 for(int i=0;i<NS;i++){float s,a;float d=segD(q,i,s,a);if(d<best){best=d;sb=s;ab=a;ib=i;}}
 float cm=(sb+0.08+float(ib)*0.55)/0.028;
 float edge=0.11-abs(ab);
 float tlen=mod(floor(cm+0.5),5.0)<0.5?0.06:0.035;
 float tick=step(abs(fract(cm+0.5)-0.5),0.09)*step(edge,tlen);
 vec3 c=vec3(1.0,0.83,0.2);
 c=mix(c,vec3(0.1,0.1,0.1),tick);
 float num=step(abs(fract(cm/10.0)-0.5),0.045)*step(abs(ab),0.03);
 c=mix(c,vec3(0.86,0.12,0.12),num);
 return srgb2lin(c);}
vec2 objectMap(vec3 p){
 vec3 q=local(p);float d=1e9;
 for(int i=0;i<NS;i++){float s,a;d=min(d,segD(q,i,s,a));}
 vec2 res=vec2(d,M_RULER);
 for(int i=1;i<NS;i++){vec2 c=pts(i);res=U(res,vec2(sdCylY(q-vec3(c.x,0.09,c.y),0.08,0.045,0.015),M_STEEL));}
 return res;
}`},
};
