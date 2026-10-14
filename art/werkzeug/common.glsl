#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec3 uCam;
uniform vec3 uTarget;
uniform float uFov;
uniform float uGround;
uniform float uProbe;
out vec4 outColor;

// ---------- helpers ----------
vec3 srgb2lin(vec3 c){return pow(c,vec3(2.2));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash31(vec3 p){p=fract(p*0.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise3(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(hash31(i+vec3(0,0,0)),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<4;i++){s+=a*noise3(p);p*=2.03;a*=0.5;}return s;}
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float sdRoundBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r;}
float sdCapsule(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return length(pa-ba*h)-r;}
float sdRoundCone(vec3 p,vec3 a,vec3 b,float r1,float r2){
 vec3 ba=b-a;float l2=dot(ba,ba);float rr=r1-r2;float a2=l2-rr*rr;float il2=1.0/l2;
 vec3 pa=p-a;float y=dot(pa,ba);float z=y-l2;vec3 xv=pa*l2-ba*y;float x2=dot(xv,xv);float y2=y*y*l2;float z2=z*z*l2;
 float k=sign(rr)*rr*rr*x2;
 if(sign(z)*a2*z2>k)return sqrt(x2+z2)*il2-r2;
 if(sign(y)*a2*y2<k)return sqrt(x2+y2)*il2-r1;
 return (sqrt(x2*a2*il2)+y*rr)*il2-r1;}
// cylinder along Y, half height h, radius r, rounded edge e
float sdCylY(vec3 p,float h,float r,float e){vec2 d=vec2(length(p.xz)-r+e,abs(p.y)-h+e);return min(max(d.x,d.y),0.0)+length(max(d,0.0))-e;}
float sdTorus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
float sdCappedTorus(vec3 p,vec2 sc,float ra,float rb){p.x=abs(p.x);float k=(sc.y*p.x>sc.x*p.y)?dot(p.xy,sc):length(p.xy);return sqrt(dot(p,p)+ra*ra-2.0*ra*k)-rb;}
float sdEllipsoid(vec3 p,vec3 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.0)/k1;}
float sdCone(vec3 p,vec2 c,float h){vec2 q=h*vec2(c.x/c.y,-1.0);vec2 w=vec2(length(p.xz),p.y);vec2 a=w-q*clamp(dot(w,q)/dot(q,q),0.0,1.0);vec2 b=w-q*vec2(clamp(w.x/q.x,0.0,1.0),1.0);float k=sign(q.y);float d=min(dot(a,a),dot(b,b));float s=max(k*(w.x*q.y-w.y*q.x),k*(w.y-q.y));return sqrt(d)*sign(s);}
float sdCappedCone(vec3 p,float h,float r1,float r2){vec2 q=vec2(length(p.xz),p.y);vec2 k1=vec2(r2,h);vec2 k2=vec2(r2-r1,2.0*h);vec2 ca=vec2(q.x-min(q.x,(q.y<0.0)?r1:r2),abs(q.y)-h);vec2 cb=q-k1+k2*clamp(dot(k1-q,k2)/dot(k2,k2),0.0,1.0);float s=(cb.x<0.0&&ca.y<0.0)?-1.0:1.0;return s*sqrt(min(dot(ca,ca),dot(cb,cb)));}
float sdSeg2(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return length(pa-ba*h);}
float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float smax(float a,float b,float k){return -smin(-a,-b,k);}
vec2 U(vec2 a,vec2 b){return a.x<b.x?a:b;}

// materials (ids)
#define M_WOOD 1.0
#define M_STEEL 2.0
#define M_TEAL 3.0
#define M_ORANGE 4.0
#define M_RUBBER 5.0
#define M_YELLOW 6.0
#define M_RED 7.0
#define M_WHITE 8.0
#define M_BRASS 9.0
#define M_BRISTLE 10.0
#define M_GREY 11.0
#define M_WATER 12.0
#define M_FOAM 13.0
#define M_PAPER 14.0
#define M_RATTAN 15.0
#define M_GLASS 16.0
#define M_BLUE 17.0
#define M_RULER 18.0
#define M_DARK 19.0
#define M_PINK 20.0
#define M_LIME 21.0
#define M_CLOTH 22.0

// object-specific code is injected here
//__OBJECT__
#ifndef HAS_WOOD
vec3 objectWoodSpace(vec3 p){return p;}
#endif
#ifndef HAS_PAPER
vec3 objectPaper(vec3 p,vec3 n){return vec3(0.9);}
#endif
#ifndef HAS_RATTAN
float objectRattanCoord(vec3 p){return p.x;}
#endif
#ifndef HAS_RULER
vec3 objectRuler(vec3 p){return vec3(0.9,0.8,0.3);}
#endif

vec2 map(vec3 p){return objectMap(p);}

vec3 calcNormal(vec3 p){const float h=0.0007;const vec2 k=vec2(1,-1);
 return normalize(k.xyy*map(p+k.xyy*h).x+k.yyx*map(p+k.yyx*h).x+k.yxy*map(p+k.yxy*h).x+k.xxx*map(p+k.xxx*h).x);}
float softshadow(vec3 ro,vec3 rd,float mint,float maxt,float w){
 float res=1.0,t=mint;
 for(int i=0;i<90&&t<maxt;i++){float h=map(ro+rd*t).x;res=min(res,h/(w*t));t+=clamp(h,0.006,0.25);if(res<-1.0)break;}
 res=max(res,-1.0);return 0.25*(1.0+res)*(1.0+res)*(2.0-res);}
float calcAO(vec3 p,vec3 n){float occ=0.0,sca=1.0;for(int i=0;i<6;i++){float h=0.01+0.09*float(i)/5.0;float d=map(p+h*n).x;occ+=(h-d)*sca;sca*=0.85;}return clamp(1.0-2.2*occ,0.0,1.0);}

vec3 env(vec3 r){ // simple studio
 float y=r.y;vec3 sky=mix(vec3(0.95,0.93,0.86),vec3(1.0,0.99,0.96),smoothstep(0.0,0.8,y));
 vec3 floorc=vec3(0.30,0.27,0.24);vec3 c=mix(floorc,sky,smoothstep(-0.2,0.25,y));
 // softbox highlights
 c+=vec3(2.2)*smoothstep(0.86,0.97,dot(r,normalize(vec3(-0.45,0.8,0.45))));
 c+=vec3(0.9)*smoothstep(0.90,0.99,dot(r,normalize(vec3(0.7,0.35,0.6))));
 return c;}

struct Mat{vec3 alb;float rough;float metal;float spec;float sss;};
Mat getMat(float m,vec3 p,vec3 n){
 Mat t;t.alb=vec3(0.8);t.rough=0.5;t.metal=0.0;t.spec=0.4;t.sss=0.0;
 if(m==M_WOOD){vec3 q=objectWoodSpace(p);float g=fbm(vec3(q.x*28.0,q.y*1.2,q.z*28.0));float ring=0.5+0.5*sin(q.x*70.0+q.z*35.0+g*7.0);
  t.alb=mix(srgb2lin(vec3(0.86,0.60,0.33)),srgb2lin(vec3(0.66,0.40,0.19)),smoothstep(0.25,0.95,ring*0.55+g*0.55));t.rough=0.45;t.spec=0.35;}
 else if(m==M_STEEL){t.alb=srgb2lin(vec3(0.86,0.89,0.94));t.metal=1.0;t.rough=0.22;}
 else if(m==M_TEAL){t.alb=srgb2lin(vec3(0.07,0.55,0.58));t.rough=0.3;t.spec=0.6;}
 else if(m==M_ORANGE){t.alb=srgb2lin(vec3(0.98,0.52,0.13));t.rough=0.32;t.spec=0.6;}
 else if(m==M_RUBBER){t.alb=srgb2lin(vec3(0.17,0.18,0.20));t.rough=0.7;t.spec=0.2;}
 else if(m==M_YELLOW){t.alb=srgb2lin(vec3(1.0,0.78,0.12));t.rough=0.3;t.spec=0.6;}
 else if(m==M_RED){t.alb=srgb2lin(vec3(0.88,0.16,0.14));t.rough=0.3;t.spec=0.6;}
 else if(m==M_WHITE){t.alb=srgb2lin(vec3(0.95,0.95,0.93));t.rough=0.35;t.spec=0.5;}
 else if(m==M_BRASS){t.alb=srgb2lin(vec3(0.92,0.72,0.35));t.metal=1.0;t.rough=0.3;}
 else if(m==M_BRISTLE){float s=fbm(p*vec3(60.0,6.0,60.0));t.alb=srgb2lin(mix(vec3(0.98,0.82,0.35),vec3(0.86,0.62,0.20),s));t.rough=0.6;t.spec=0.25;}
 else if(m==M_GREY){t.alb=srgb2lin(vec3(0.70,0.72,0.74));t.rough=0.45;t.spec=0.45;}
 else if(m==M_WATER){t.alb=srgb2lin(vec3(0.25,0.62,0.85));t.rough=0.1;t.spec=0.9;}
 else if(m==M_FOAM){t.alb=srgb2lin(vec3(0.97,0.98,1.0));t.rough=0.2;t.spec=0.8;t.sss=0.3;}
 else if(m==M_PAPER){t.alb=objectPaper(p,n);t.rough=0.65;t.spec=0.15;}
 else if(m==M_RATTAN){float s=0.5+0.5*sin(objectRattanCoord(p)*55.0);t.alb=srgb2lin(mix(vec3(0.86,0.66,0.38),vec3(0.70,0.48,0.24),s));t.rough=0.5;t.spec=0.3;}
 else if(m==M_GLASS){t.alb=srgb2lin(vec3(0.62,0.92,0.35));t.rough=0.08;t.spec=1.0;t.sss=0.6;}
 else if(m==M_BLUE){t.alb=srgb2lin(vec3(0.20,0.48,0.90));t.rough=0.3;t.spec=0.6;}
 else if(m==M_RULER){t.alb=objectRuler(p);t.rough=0.4;t.spec=0.4;}
 else if(m==M_DARK){t.alb=srgb2lin(vec3(0.10,0.11,0.12));t.rough=0.4;t.spec=0.4;}
 else if(m==M_PINK){t.alb=srgb2lin(vec3(0.98,0.55,0.65));t.rough=0.3;t.spec=0.6;}
 else if(m==M_LIME){t.alb=srgb2lin(vec3(0.55,0.82,0.20));t.rough=0.3;t.spec=0.6;}
 else if(m==M_CLOTH){float s=0.5+0.5*sin(p.x*90.0)*sin(p.z*90.0+p.y*90.0);t.alb=srgb2lin(mix(vec3(0.98,0.80,0.25),vec3(0.95,0.70,0.15),s));t.rough=0.85;t.spec=0.08;t.sss=0.2;}
 return t;}

vec3 shade(vec3 p,vec3 n,vec3 rd,float m){
 Mat mt=getMat(m,p,n);
 vec3 L=normalize(vec3(-0.55,0.95,0.55));
 vec3 F=normalize(vec3(0.75,0.35,0.55));
 float dif=clamp(dot(n,L),0.0,1.0);
 float sh=dif>0.0?softshadow(p+n*0.003,L,0.01,3.0,0.08):0.0;
 float ao=calcAO(p,n);
 vec3 h=normalize(L-rd);
 float shin=mix(220.0,12.0,mt.rough);
 float spe=pow(clamp(dot(n,h),0.0,1.0),shin)*dif*sh*(shin+8.0)/40.0;
 float fre=pow(clamp(1.0+dot(n,rd),0.0,1.0),4.0);
 float wrap=clamp((dot(n,L)+mt.sss)/(1.0+mt.sss),0.0,1.0);
 vec3 key=vec3(1.0,0.95,0.86)*2.4*mix(dif*sh,wrap*max(sh,0.35),mt.sss);
 vec3 sky=vec3(0.70,0.78,0.92)*0.75*(0.55+0.45*n.y)*ao;
 vec3 fill=vec3(1.0,0.90,0.78)*0.55*clamp(dot(n,F),0.0,1.0)*ao;
 vec3 bounce=vec3(0.95,0.85,0.65)*0.25*clamp(-n.y,0.0,1.0)*ao;
 vec3 col=mt.alb*(key+sky+fill+bounce);
 vec3 r=reflect(rd,n);
 vec3 envc=env(r)*mix(1.0,ao,0.6);
 if(mt.metal>0.5){
  vec3 f0=mt.alb;vec3 fr=f0+(1.0-f0)*fre;
  col=envc*fr*mix(0.85,0.5,mt.rough)*mix(0.6,1.0,sh*0.7+0.3)+mt.alb*0.12*(key+sky);
  col+=spe*mt.alb*1.4;
 }else{
  col+=mt.spec*spe*vec3(1.0,0.97,0.9);
  col+=mt.spec*fre*envc*0.35*(1.0-mt.rough*0.6);
 }
 // rim light
 col+=vec3(1.0,0.96,0.88)*0.28*pow(clamp(1.0+dot(n,rd),0.0,1.0),2.5)*ao*(0.4+0.6*clamp(n.y+0.5,0.0,1.0));
 return col;}

vec3 aces(vec3 x){const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);}

void main(){
 vec2 uv=(2.0*gl_FragCoord.xy-uRes)/uRes.y;
 vec3 ww=normalize(uTarget-uCam);vec3 uu=normalize(cross(ww,vec3(0,1,0)));vec3 vv=cross(uu,ww);
 float fl=1.0/tan(radians(uFov)*0.5);
 vec3 rd=normalize(uv.x*uu+uv.y*vv+fl*ww);vec3 ro=uCam;
 if(uProbe>0.5){ro=vec3(uv*2.5,12.0);rd=vec3(0,0,-1);float tt=0.0;bool hh=false;for(int i=0;i<300;i++){float d=map(ro+rd*tt).x;if(d<0.0005){hh=true;break;}tt+=d*0.9;if(tt>30.0)break;}outColor=vec4(hh?1.0:0.0,0,0,1);return;}
 // background: warm cream like the vault art, very soft vignette
 vec3 bg=vec3(0.988,0.980,0.929);

 float t=0.0;float m=-1.0;bool hit=false;float tmax=30.0;
 for(int i=0;i<220;i++){vec2 h=map(ro+rd*t);if(h.x<0.0004*t){m=h.y;hit=true;break;}t+=h.x*0.85;if(t>tmax)break;}
 vec3 col;
 // ground shadow (shadow catcher on plane y=uGround)
 float tg=(uGround-ro.y)/rd.y;
 bool groundFirst=rd.y<0.0&&tg>0.0&&(!hit||tg<t);
 if(hit&&!groundFirst){
  vec3 p=ro+rd*t;vec3 n=calcNormal(p);
  col=shade(p,n,rd,m);
  col=aces(col*0.62);
  col=pow(col,vec3(1.0/2.2));
 }else{
  col=bg;
  if(rd.y<0.0&&tg>0.0){
   vec3 g=ro+rd*tg;
   vec3 L=normalize(vec3(-0.55,0.95,0.55));
   float sh=softshadow(g+vec3(0,0.001,0),L,0.02,3.0,0.12);
   float d=map(g).x;
   float contact=1.0-clamp(d/0.18,0.0,1.0);
   float ao=1.0-0.45*contact*contact;
   float shade=mix(0.80,1.0,sh)*ao;
   // fade the shadow catcher towards the edges
   col=bg*mix(1.0,shade,smoothstep(3.5,1.2,length(g.xz-uTarget.xz)));
  }
 }
 outColor=vec4(col,1.0);
}
