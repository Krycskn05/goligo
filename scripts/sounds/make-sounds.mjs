// Goliqo sound effects: original, playful cartoon sounds synthesised from
// scratch (marimba, celesta, glockenspiel, bubbles, wind, slide whistle,
// spring, brass and retro chip tones). No recordings or samples are used.
// Several sounds for each moment: the learner chooses one in "Sesler ve animasyonlar".
// Usage: node scripts/sounds/make-sounds.mjs [output-folder]   (default public/sfx)
import {mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const SAMPLE_RATE=44100;
const SR=SAMPLE_RATE,TAU=Math.PI*2;

function random(seed){let state=seed>>>0;return()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296;};}
function track(seconds){return new Float32Array(Math.ceil(seconds*SR));}
const at=t=>Math.round(t*SR);
const note=semitones=>440*2**(semitones/12); // semitones from A4

/** Decaying sine partials: the core of mallet and bell sounds. */
function partials(out,t0,f,amp,list,attack=.002){
 for(const p of list){
  const freq=f*p.ratio;if(freq>SR*.45)continue;
  const start=at(t0),length=Math.min(out.length-start,Math.ceil(p.decay*9.3*SR));
  const phase=p.phase??0;const step=TAU*freq/SR;const rise=Math.max(1,attack*SR);
  for(let n=0;n<length;n++){const env=Math.min(1,n/rise)*Math.exp(-n/(p.decay*SR));out[start+n]+=amp*p.amp*env*Math.sin(phase+step*n);}
 }
}
function click(out,t0,amp,seconds=.006,seed=1){
 const rnd=random(seed),start=at(t0),length=at(seconds);let low=0;
 for(let n=0;n<length&&start+n<out.length;n++){low+=.2*((rnd()*2-1)-low);out[start+n]+=amp*low*(1-n/length)**2;}
}
export function marimba(out,t0,f,amp,decay=.42){
 partials(out,t0,f,amp,[{ratio:1,amp:1,decay},{ratio:3.93,amp:.22,decay:decay*.22},{ratio:9.2,amp:.05,decay:decay*.07}],.0015);
 click(out,t0,amp*.06,.004,Math.round(f));
}
export function glock(out,t0,f,amp,decay=1.1){
 partials(out,t0,f,amp,[{ratio:1,amp:1,decay},{ratio:2.76,amp:.32,decay:decay*.45},{ratio:5.4,amp:.12,decay:decay*.22},{ratio:8.93,amp:.05,decay:decay*.12}],.001);
}
export function celesta(out,t0,f,amp,decay=.85){
 partials(out,t0,f,amp,[{ratio:1,amp:1,decay},{ratio:1.003,amp:.35,decay,phase:1},{ratio:2,amp:.38,decay:decay*.5},{ratio:3,amp:.12,decay:decay*.3},{ratio:4.2,amp:.05,decay:decay*.2}],.003);
}
/** A rising "bloop": the pitch climbs quickly while the sound fades, like a bubble popping. */
export function bubble(out,t0,f0,seconds,amp,rise=1.8){
 const start=at(t0),length=Math.min(out.length-start,at(seconds));let phase=0;
 for(let n=0;n<length;n++){const x=n/length;const freq=f0*(1+(rise-1)*x**.55);phase+=TAU*freq/SR;const env=Math.min(1,n/(.003*SR))*Math.exp(-x*3.2)*(1-x);out[start+n]+=amp*env*(Math.sin(phase)+.12*Math.sin(2*phase));}
}
/** A slide whistle: a breathy tone gliding between two pitches with a little vibrato. */
export function slideWhistle(out,t0,seconds,f0,f1,amp,seed=3){
 const rnd=random(seed),start=at(t0),length=Math.min(out.length-start,at(seconds));let phase=0,breath=0;
 for(let n=0;n<length;n++){
  const x=n/length,glide=.5-.5*Math.cos(Math.PI*Math.min(1,x*1.08));
  const freq=f0*(f1/f0)**glide*(1+.012*x*Math.sin(TAU*7*n/SR));phase+=TAU*freq/SR;
  breath+=.08*((rnd()*2-1)-breath);
  const env=Math.min(1,n/(.025*SR))*Math.min(1,(length-n)/(.05*SR));
  out[start+n]+=amp*env*(Math.sin(phase)+.18*Math.sin(2*phase)+.1*breath);
 }
}
/** A cartoon spring: the pitch wobbles fast and settles, "doyoyoing". */
export function boing(out,t0,seconds,f,amp){
 const start=at(t0),length=Math.min(out.length-start,at(seconds));let phase=0;
 for(let n=0;n<length;n++){const t=n/SR,x=n/length;const freq=f*(1+.38*Math.exp(-5.5*t)*Math.sin(TAU*15*t))*(1+.35*(1-x));phase+=TAU*freq/SR;
  const env=Math.min(1,n/(.004*SR))*Math.exp(-x*3.4)*(1-x)**.5;out[start+n]+=amp*env*(Math.sin(phase)+.28*Math.sin(2.01*phase)+.1*Math.sin(3.02*phase));}
}
/** A muted brass note with a "wah" opening filter, used for the friendly sad trombone. */
export function brass(out,t0,seconds,f,amp,{bend=1,vibrato=0}={}){
 const start=at(t0),length=Math.min(out.length-start,at(seconds));const phases=new Float64Array(24);
 for(let n=0;n<length;n++){
  const x=n/length,t=n/SR;
  const wah=Math.sin(Math.PI*Math.min(1,x*1.4))**1.5;const cutoff=380+1500*wah;
  const freq=f*(1+(bend-1)*(x*x*(3-2*x)))*(1+vibrato*Math.min(1,Math.max(0,(x-.35)*3))*Math.sin(TAU*5.6*t));
  let sample=0;
  for(let h=1;h<=24;h++){const fh=freq*h;if(fh>6000)break;phases[h-1]+=TAU*fh/SR;const filter=1/(1+(fh/cutoff)**4);sample+=filter*Math.sin(phases[h-1])/h;}
  const env=Math.min(1,n/(.03*SR))*Math.min(1,(length-n)/(.07*SR));
  out[start+n]+=amp*env*sample;
 }
}
/** Band-limited square wave for the retro game sound. */
export function chip(out,t0,seconds,f,amp,f1=f){
 const start=at(t0),length=Math.min(out.length-start,at(seconds));const phases=new Float64Array(16);
 for(let n=0;n<length;n++){const x=n/length;const freq=f*(f1/f)**x;let sample=0;
  for(let h=1,i=0;h<32;h+=2,i++){const fh=freq*h;if(fh>9000)break;phases[i]+=TAU*fh/SR;sample+=Math.sin(phases[i])/h;}
  const env=Math.min(1,n/(.003*SR))*(1-.35*x)*Math.min(1,(length-n)/(.016*SR));out[start+n]+=amp*env*sample;}
}
/** Wind: filtered noise whose centre frequency sweeps, shaped like a gust. */
export function whoosh(out,t0,seconds,amp,f0,f1,seed=11){
 const rnd=random(seed),start=at(t0),length=Math.min(out.length-start,at(seconds));let low=0,band=0;
 for(let n=0;n<length;n++){const x=n/length;const centre=f0*(f1/f0)**x;const k=2*Math.sin(Math.PI*centre/SR),q=.55;
  const input=rnd()*2-1;const high=input-low-q*band;band+=k*high;low+=k*band;
  const env=Math.sin(Math.PI*x)**2*(x<.35?1:1-.25*(x-.35));out[start+n]+=amp*env*band;}
}
export function sparkle(out,t0,seconds,count,amp,seed=5){
 const rnd=random(seed);const notes=[note(39),note(41),note(43),note(46),note(48),note(51),note(53)];
 for(let i=0;i<count;i++)glock(out,t0+seconds*(i/count)+rnd()*seconds/count*.6,notes[Math.floor(rnd()*notes.length)],amp*(.45+.55*rnd()),.22+.12*rnd());
}
/** A hand clap: a short band-passed noise burst with a tiny "flam" before it, for Paul Hoca's applause. */
export function clap(out,t0,amp,seed=61){
 const rnd=random(seed),start=at(t0),length=Math.min(out.length-start,at(.11));let low=0,band=0;
 const centre=1000+900*rnd(),k=2*Math.sin(Math.PI*centre/SR),q=.42;
 for(let n=0;n<length;n++){const t=n/SR;const env=(t<.006?.55:0)+(t>=.004?Math.exp(-(t-.004)/.022):0);const input=rnd()*2-1;const high=input-low-q*band;band+=k*high;low+=k*band;out[start+n]+=amp*env*band;}
}
/** A knock on a wooden school desk: a low thud, the board's wooden ring and a little click. */
export function knock(out,t0,amp,f=120,seed=71){
 const start=at(t0),length=Math.min(out.length-start,at(.22));let phase=0;
 for(let n=0;n<length;n++){const t=n/SR;const freq=f*(1+.7*Math.exp(-t/.012));phase+=TAU*freq/SR;out[start+n]+=amp*Math.exp(-t/.055)*Math.sin(phase);}
 marimba(out,t0,f*3.1,amp*.35,.05);click(out,t0,amp*.5,.005,seed);
}
/**
 * Knuckles on a wooden desk, for Paul Hoca's "Harika!" (the learner chose it): the desk's hollow wooden ring in the
 * 200–2400 Hz range plus a short band-passed noise tap, so it is heard on phone and laptop speakers too.
 */
export function woodKnock(out,t0,amp,variant=0,seed=71){
 const s=1+.04*variant;const start=at(t0);
 for(const [f,a,d] of [[205*s,.55,.045],[430*s,1,.03],[870*s,.6,.018],[1420*s,.35,.011],[2380*s,.22,.007]]){
  const length=Math.min(out.length-start,Math.ceil(d*9*SR));
  for(let n=0;n<length;n++)out[start+n]+=amp*a*Math.min(1,n/(.0004*SR))*Math.exp(-n/(d*SR))*Math.sin(TAU*f*n/SR);
 }
 const rnd=random(seed),length=Math.min(out.length-start,at(.018)),k=2*Math.sin(Math.PI*1800/SR);let low=0,band=0;
 for(let n=0;n<length;n++){const x=n/length;const high=(rnd()*2-1)-low-.5*band;band+=k*high;low+=k*band;out[start+n]+=amp*1.4*band*(1-x)**3;}
}
/** Small room reverb (Schroeder/Freeverb style) mixed into the dry signal. */
export function reverb(dry,wet,size=.78){
 const combs=[1116,1188,1277,1356,1422,1491,1557,1617].map(d=>({buf:new Float32Array(d),i:0,low:0}));
 const passes=[556,441,341,225].map(d=>({buf:new Float32Array(d),i:0}));const out=new Float32Array(dry.length);
 for(let n=0;n<dry.length;n++){
  const input=dry[n]*.015;let sum=0;
  for(const c of combs){const y=c.buf[c.i];c.low=y*.72+c.low*.28;c.buf[c.i]=input+c.low*size;c.i=(c.i+1)%c.buf.length;sum+=y;}
  for(const a of passes){const b=a.buf[a.i];const y=-sum+b;a.buf[a.i]=sum+b*.5;a.i=(a.i+1)%a.buf.length;sum=y;}
  out[n]=dry[n]+wet*sum*4;
 }
 return out;
}
/** Remove DC, normalise to the target peak and give soft edges. */
export function finish(buffer,peak){
 let mean=0;for(const v of buffer)mean+=v;mean/=buffer.length;
 let max=0;for(let n=0;n<buffer.length;n++){buffer[n]-=mean;max=Math.max(max,Math.abs(buffer[n]));}
 let end=buffer.length;while(end>1&&Math.abs(buffer[end-1])<max*.0015)end--;
 const out=buffer.slice(0,Math.min(buffer.length,end+at(.01)));const gain=max>0?peak/max:0;
 const fadeIn=at(.0015),fadeOut=Math.min(at(.06),Math.floor(out.length/3));
 for(let n=0;n<out.length;n++){let g=gain;if(n<fadeIn)g*=n/fadeIn;if(n>=out.length-fadeOut)g*=(out.length-n)/fadeOut;out[n]*=g;}
 return out;
}
export function wav(samples){
 const data=Buffer.alloc(44+samples.length*2);
 data.write('RIFF',0);data.writeUInt32LE(36+samples.length*2,4);data.write('WAVE',8);data.write('fmt ',12);
 data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(1,22);data.writeUInt32LE(SR,24);data.writeUInt32LE(SR*2,28);data.writeUInt16LE(2,32);data.writeUInt16LE(16,34);
 data.write('data',36);data.writeUInt32LE(samples.length*2,40);
 samples.forEach((v,i)=>data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));
 return data;
}

const C4=note(-9),E4=note(-5),G4=note(-2),C5=note(3),D5=note(5),E5=note(7),G5=note(10),A5=note(12),C6=note(15),E6=note(19),G6=note(22),C7=note(27),E7=note(31);
const B5=note(14),D6=note(17),A6=note(24);
function tap(f){const b=track(.24);bubble(b,0,f,.075,.9,1.9);marimba(b,.004,f*2,.22,.05);return finish(reverb(b,.06),.3);}
export const soundDesigns={
 // Short wooden "plip" for buttons; three pitches so repeated taps feel alive.
 tap:()=>tap(560),
 tap2:()=>tap(640),
 tap3:()=>tap(720),
 // Page and card changes: a soft gust of wind with a tiny chime.
 whoosh:()=>{const b=track(.55);whoosh(b,0,.36,.9,320,2600);glock(b,.24,G6,.12,.28);return finish(reverb(b,.16),.34);},
 // Correct: a magic little celesta run over a warm marimba note.
 correct:()=>{const b=track(.95);marimba(b,0,C5,.5,.5);[E6,G6,C7,E7].forEach((f,i)=>celesta(b,i*.072,f,.62-.06*i,.55));sparkle(b,.22,.32,6,.14,9);return finish(reverb(b,.22),.72);},
 // End of a round: a marimba run, a bright bell chord and a shower of sparkles.
 complete:()=>{const b=track(1.65);[C5,E5,G5,C6].forEach((f,i)=>marimba(b,i*.065,f,.55,.32));marimba(b,.27,C4,.55,.7);[C6,E6,G6].forEach(f=>celesta(b,.27,f,.42,.9));glock(b,.27,C7,.42,1);sparkle(b,.36,.85,12,.17,21);return finish(reverb(b,.26),.74);},
 // Wrong answers: friendly, never harsh.
 soft:()=>{const b=track(.8);marimba(b,0,G4,.75,.42);marimba(b,.17,E4,.8,.5);return finish(reverb(b,.14),.62);},
 beep:()=>{const b=track(.7);[[920,0],[720,.1],[540,.2],[400,.31]].forEach(([f,t])=>bubble(b,t,f,.09,.85,1.45));return finish(reverb(b,.1),.62);},
 retro:()=>{const b=track(.65);chip(b,0,.085,G5,.4);chip(b,.1,.085,E5,.4);chip(b,.2,.085,C5,.4);chip(b,.3,.24,G4,.4,note(-3));return finish(b,.3);},
 low:()=>{const b=track(.95);brass(b,0,.29,note(-6),.7,{bend:.985});brass(b,.31,.55,note(-7),.75,{bend:.965,vibrato:.022});return finish(reverb(b,.12),.48);},
 cartoon:()=>{const b=track(.85);slideWhistle(b,0,.38,1450,390,.55);boing(b,.39,.36,175,.75);return finish(reverb(b,.08),.58);},
 // The learner chooses one sound for each moment. Taps: short and light.
 tapWood:()=>{const b=track(.22);marimba(b,0,C6,.9,.07);click(b,0,.15,.003,7);return finish(reverb(b,.06),.3);},
 tapPop:()=>{const b=track(.22);bubble(b,0,380,.1,.9,2.8);return finish(reverb(b,.05),.3);},
 tapDrop:()=>{const b=track(.26);bubble(b,0,1250,.035,.6,.55);bubble(b,.03,650,.09,.9,2.3);return finish(reverb(b,.08),.3);},
 tapBell:()=>{const b=track(.4);glock(b,0,E7,.6,.09);return finish(reverb(b,.08),.24);},
 tapChip:()=>{const b=track(.2);chip(b,0,.05,C6,.4,G6);chip(b,.06,.05,G6,.3);return finish(b,.2);},
 // Page changes.
 pageFlip:()=>{const b=track(.32);whoosh(b,0,.17,.9,1800,5200,23);click(b,0,.2,.004,5);click(b,.13,.12,.004,9);return finish(b,.3);},
 pageSlide:()=>{const b=track(.48);slideWhistle(b,0,.34,520,1300,.55,7);return finish(reverb(b,.1),.32);},
 pageHarp:()=>{const b=track(.75);[C5,E5,G5,C6,E6].forEach((f,i)=>celesta(b,i*.035,f,.5,.35));return finish(reverb(b,.18),.34);},
 pageBubbles:()=>{const b=track(.42);[[520,0],[680,.06],[860,.12],[1080,.18]].forEach(([f,t])=>bubble(b,t,f,.07,.8,1.8));return finish(reverb(b,.1),.32);},
 pageChip:()=>{const b=track(.26);[C5,E5,G5,C6].forEach((f,i)=>chip(b,i*.04,.04,f,.4));return finish(b,.22);},
 // Correct answers: always happy.
 correctMarimba:()=>{const b=track(.95);[C5,E5,G5].forEach((f,i)=>marimba(b,i*.08,f,.6,.3));marimba(b,.24,C6,.7,.6);marimba(b,.24,C5,.35,.6);return finish(reverb(b,.2),.7);},
 correctCoin:()=>{const b=track(.62);chip(b,0,.07,B5,.4);chip(b,.075,.38,E6,.4);return finish(reverb(b,.08),.32);},
 correctDing:()=>{const b=track(1.2);glock(b,0,C6,.7,.6);glock(b,.16,G6,.7,.7);return finish(reverb(b,.22),.65);},
 correctFanfare:()=>{const b=track(.95);brass(b,0,.1,C5,.5);brass(b,.1,.1,E5,.5);brass(b,.2,.1,G5,.5);brass(b,.3,.5,C6,.55,{vibrato:.012});glock(b,.3,C7,.18,.5);return finish(reverb(b,.18),.6);},
 correctBubbles:()=>{const b=track(.95);[[500,0],[630,.08],[790,.16],[1000,.24]].forEach(([f,t])=>bubble(b,t,f,.08,.85,1.8));celesta(b,.32,C7,.35,.45);sparkle(b,.34,.3,5,.12,31);return finish(reverb(b,.18),.65);},
 // End of a round: a bigger celebration.
 completeFanfare:()=>{const b=track(1.6);brass(b,0,.12,C5,.5);brass(b,.14,.12,C5,.5);brass(b,.28,.12,C5,.5);brass(b,.42,.85,G5,.6,{vibrato:.015});[C6,E6,G6].forEach(f=>glock(b,.42,f,.22,.8));sparkle(b,.5,.7,10,.12,41);return finish(reverb(b,.22),.72);},
 completeLevel:()=>{const b=track(1.1);[C5,E5,G5,C6,E6,G6].forEach((f,i)=>chip(b,i*.055,.05,f,.35));chip(b,.33,.55,C7,.35);return finish(b,.32);},
 completeChimes:()=>{const b=track(1.65);sparkle(b,0,1.05,18,.22,51);[C6,E6,G6].forEach(f=>celesta(b,.05,f,.3,1));return finish(reverb(b,.3),.7);},
 completeHarp:()=>{const b=track(1.6);[C5,D5,E5,G5,A5,C6,D6,E6,G6,A6,C7].forEach((f,i)=>celesta(b,i*.04,f,.42,.5));[C6,E6,G6].forEach(f=>glock(b,.48,f,.3,.9));return finish(reverb(b,.26),.72);},
 // Paul Hoca's own sounds, played with his animations: a cheerful hello when he waves, a "pling" for a tip,
 // a thinking "hm-hm?", applause when he claps and drumming on the desk when he cheers at the end of a round.
 paulHello:()=>{const b=track(.85);bubble(b,0,520,.08,.45,1.9);marimba(b,.03,G5,.6,.3);marimba(b,.15,C6,.7,.42);celesta(b,.15,E6,.32,.5);sparkle(b,.24,.25,4,.1,81);return finish(reverb(b,.18),.6);},
 paulTip:()=>{const b=track(.75);glock(b,0,C7,.6,.3);glock(b,.09,G6,.45,.36);bubble(b,.02,900,.06,.3,1.6);return finish(reverb(b,.2),.5);},
 paulHmm:()=>{const b=track(.95);slideWhistle(b,0,.3,430,470,.5,13);slideWhistle(b,.36,.36,470,760,.55,17);return finish(reverb(b,.12),.48);},
 paulClap:()=>{const b=track(1.55);const r=random(91);for(let i=0;i<14;i++){const t=i*.095+r()*.02;clap(b,t,.8+.2*r(),91+i);if(i%3===1)clap(b,t+.03+r()*.02,.5,191+i);}sparkle(b,.9,.5,6,.1,93);return finish(reverb(b,.24),.62);},
 // "Harika!": a quick roll of knuckles on the wooden desk and two firm knocks (option A, the learner chose it after
 // listening: the old low thud was hardly heard on phone speakers), short enough that the right answer is read soon after.
 paulDrum:()=>{const b=track(1.05);[[0,.8],[.09,.65],[.18,.8],[.27,.65],[.36,.8],[.45,.7],[.62,1.15],[.76,1.3]].forEach(([t,a],i)=>woodKnock(b,t,a,i%2,71+i));return finish(reverb(b,.1),.78);},
 completeMarimba:()=>{const b=track(1.6);marimba(b,0,C4,.7,.25);marimba(b,.16,C4,.7,.25);marimba(b,.32,G4,.7,.25);[C5,E5,G5,C6].forEach(f=>marimba(b,.48,f,.45,.8));glock(b,.48,C7,.25,.8);return finish(reverb(b,.2),.72);},
};
export const soundIds=Object.keys(soundDesigns);

export function renderSounds(folder){
 mkdirSync(folder,{recursive:true});const result={};
 for(const [id,design] of Object.entries(soundDesigns)){const samples=design();writeFileSync(join(folder,id+'.wav'),wav(samples));result[id]=Math.round(samples.length/SR*1000)/1000;}
 writeFileSync(join(folder,'manifest.json'),JSON.stringify({sampleRate:SR,format:'PCM WAV, mono, 16-bit',durations:result},null,1)+'\n');
 return result;
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 const folder=process.argv[2]??'public/sfx';
 const durations=renderSounds(folder);
 console.log('Goliqo sesleri hazır:',Object.entries(durations).map(([id,s])=>id+' '+s+'s').join(', '));
}
