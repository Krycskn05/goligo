'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {EFFECTS_CHANGED,EFFECTS_KEY,motionAllowed,playLearningSound} from '@/lib/learning-effects';
import type {PaulSoundId} from '@/lib/effect-sounds';

/**
 * Paul Hoca in the learner's 20 animations (3 November 2026; public/paul/v2: 288 × 288 animated WebP with a clear
 * background, made from the 1024 px originals, 6 frames, a 1.08 s loop; `-still` is the learner's preview frame).
 * Every situation has a few animations that fit it (PAUL_POSES) and Paul goes through them in turn, so the same one
 * does not come again and again (the learner asked: "change them so it does not get boring, but always meaningful"):
 * - hello: waving or winking (his visits on the screen, the tour);
 * - correct / desk: thumbs up, wink, fists up, a happy "wow" in the answer badge;
 * - wrong: a gentle raised finger, "try again", "slow down";
 * - cheer: clapping, "we did it", the cup at the end of a round or a part;
 * - tip: "I've got an idea" or pointing at the hint (to the right, to the left in right-to-left languages);
 * - think (Yanlışlarım), listen (listening), speak (Konuş), ready (a test begins), read (the topic), write (writing),
 *   trophy (a lesson finished) and thanks (a conversation finished).
 * His sounds are effects, never speech: after an answer only the right answer is read aloud.
 */
export const PAUL_ANIMATIONS={welcome:'01-hos-geldin',correct:'02-dogru-cevap',applause:'03-alkis',wrong:'04-yanlis-cevap',retry:'05-tekrar-dene',think:'06-dusunuyor',idea:'07-fikir-buldum',wink:'08-goz-kirpiyor',listen:'09-dinliyor',speak:'10-konusma-sirasi',slow:'11-yavasla',ready:'12-hazir-misin',pointRight:'13-saga-goster',pointLeft:'14-sola-goster',read:'15-kitap-okuyor',write:'16-not-aliyor',trophy:'17-kupa-kazandi',success:'18-basardik',surprised:'19-sasirdi',thanks:'20-tesekkur'} as const;
export type PaulAnimation=keyof typeof PAUL_ANIMATIONS;
export const paulSrc=(id:PaulAnimation,still=false)=>'/paul/v2/'+PAUL_ANIMATIONS[id]+(still?'-still':'')+'.webp';
/** What Paul reacts to and the animations that fit it, in the order he goes through them ('point' looks at the text). */
export const PAUL_POSES={
 hello:['welcome','wink'],correct:['correct','wink','success','surprised'],desk:['correct','wink','success','surprised'],
 wrong:['wrong','retry','slow'],cheer:['applause','success','trophy'],tip:['idea','point'],think:['think'],
 listen:['listen'],speak:['speak'],ready:['ready'],read:['read'],write:['write'],trophy:['trophy'],thanks:['thanks'],
} as const satisfies Record<string,readonly (PaulAnimation|'point')[]>;
export type PaulPose=keyof typeof PAUL_POSES;
const resolve=(id:PaulAnimation|'point',dir:'ltr'|'rtl'):PaulAnimation=>id==='point'?(dir==='rtl'?'pointLeft':'pointRight'):id;
/** The first animation of each situation (the tour and other fixed places). */
export const PAUL_PICTURES:Record<PaulPose,string>=Object.fromEntries(Object.entries(PAUL_POSES).map(([pose,pool])=>[pose,paulSrc(resolve(pool[0],'ltr'))])) as Record<PaulPose,string>;
export const PAUL_STILL:Record<PaulPose,string>=Object.fromEntries(Object.entries(PAUL_POSES).map(([pose,pool])=>[pose,paulSrc(resolve(pool[0],'ltr'),true)])) as Record<PaulPose,string>;
export const PAUL_SOUNDS:Partial<Record<PaulPose,PaulSoundId>>={hello:'paulHello',tip:'paulTip',think:'paulHmm',cheer:'paulClap',trophy:'paulClap'};
const TURN_KEY='lernkoko-paul-turn-';
const turns=new Map<PaulPose,number>();
function turnOf(pose:PaulPose){
 let n=turns.get(pose);
 if(n===undefined){try{n=Number(sessionStorage.getItem(TURN_KEY+pose))||0;}catch{n=0;}turns.set(pose,n);}
 return n;
}
const pageDir=():'ltr'|'rtl'=>{try{return document.documentElement.dir==='rtl'||document.querySelector('[dir="rtl"]')?'rtl':'ltr';}catch{return 'ltr';}};
/** The animation Paul shows next for this situation, without using it up (to fetch it early). */
export function upcomingPaul(pose:PaulPose):PaulAnimation{const pool=PAUL_POSES[pose];return resolve(pool[turnOf(pose)%pool.length],pageDir());}
/** The next animation for this situation; the turn is kept for the browser session, so a new page goes on from there. */
export function nextPaul(pose:PaulPose):PaulAnimation{
 const id=upcomingPaul(pose);const n=turnOf(pose)+1;turns.set(pose,n);
 try{sessionStorage.setItem(TURN_KEY+pose,String(n));}catch{}
 return id;
}

/** True while animations may move (the site's motion setting and the device's "reduce motion"). */
export function usePaulMotion(){
 const [motion,setMotion]=useState(true);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>setMotion(motionAllowed());
  const storage=(event:StorageEvent)=>{if(event.key===EFFECTS_KEY)sync();};
  sync();window.addEventListener(EFFECTS_CHANGED,sync);window.addEventListener('storage',storage);media.addEventListener('change',sync);
  return()=>{window.removeEventListener(EFFECTS_CHANGED,sync);window.removeEventListener('storage',storage);media.removeEventListener('change',sync);};
 },[]);
 return motion;
}

/** Plays Paul's sound for a pose (respects the sound settings; a browser that blocks sound before the first tap just stays quiet). */
export function playPaulSound(pose:PaulPose){const id=PAUL_SOUNDS[pose];return id?playLearningSound(id):()=>{};}

/**
 * One Paul animation. `sound="appear"` plays his sound when he appears (`once` keeps it to one time per visit of the
 * site, e.g. the home page greeting).
 */
export function PaulHoca({pose,className='',sound,once}:{pose:PaulPose;className?:string;sound?:'appear';once?:string}){
 const motion=usePaulMotion();
 const [id,setId]=useState<PaulAnimation|null>(null);
 useEffect(()=>{setId(nextPaul(pose));},[pose]);
 useEffect(()=>{
  if(sound!=='appear')return;
  if(once){try{if(sessionStorage.getItem(once))return;sessionStorage.setItem(once,'1');}catch{}}
  const stop=playPaulSound(pose);return stop;
 },[pose,sound,once]);
 return <picture className={('paul-hoca paul-'+pose+' '+className).trim()} aria-hidden="true">
  {id&&<source media="(prefers-reduced-motion: reduce)" srcSet={paulSrc(id,true)}/>}
  <img src={id?paulSrc(id,!motion):undefined} alt="" width={288} height={288} loading="lazy" decoding="async" draggable={false} data-paul={id??undefined}/>
 </picture>;
}

/**
 * What the learner is doing in a lesson step, for Paul's visits (`data-paul-mood` on the step card): reading the topic,
 * listening, writing, a test or speaking. Other exercises have no mood (his visits then go through his other animations).
 */
export function paulMood(step:{id:string;kind:string;title?:string}):PaulPose|undefined{
 if(step.kind==='cover'||step.kind==='teach')return 'read';
 if(step.kind==='test')return 'ready';
 if(step.kind==='speak')return 'speak';
 if(step.kind==='end')return 'cheer';
 const text=(step.id+' '+(step.title??'')).toLowerCase();
 if(/dinle|hoeren|hören|diktat|telaffuz|phonetik|ach-ich/.test(text))return 'listen';
 if(/yaz|schreib|buchstab|harf|formular|form-/.test(text))return 'write';
 return undefined;
}
const isPose=(value:string|null|undefined):value is PaulPose=>!!value&&Object.prototype.hasOwnProperty.call(PAUL_POSES,value);

/** Pages without Paul's visits: the admin panel, the sign-in pages and the legal pages. */
const QUIET_PAGES=/^\/(yonetim|giris|uye-ol|gizlilik|kullanim-kosullari)(\/|$)/;
/** First visit 9 s after a page opens, then one every 75 s: every other visit he waves (so a wave every 2.5 min). */
export const PEEK_FIRST_MS=9000,PEEK_EVERY_MS=150000,PEEK_GAP_MS=PEEK_EVERY_MS/2,PEEK_SHOW_MS=3600;
/** Between two greetings he shows one of his friendly animations, in turn (the wrong-answer ones stay for wrong answers). */
export const PEEK_OTHER:readonly PaulAnimation[]=['idea','read','listen','write','ready','applause','think','surprised','correct','success','speak','thanks'];
const VISIT_KEY='lernkoko-paul-visit',SPOT_KEY='lernkoko-paul-spot';
/** The n-th visit in this browser session: even visits greet (waving, then winking), odd ones bring the next other animation. */
export function peekPose(n:number):PaulAnimation{return n%2===0?(n%4===0?'welcome':'wink'):PEEK_OTHER[(n>>1)%PEEK_OTHER.length];}
/** He comes up only from the bottom edge of the screen (the learner asked: not from the top, the left or the right),
 * at any point along it (10–90 %), at least a quarter of the screen away from his last visit. `random` is Math.random
 * in the page. */
export function peekSpot(last:number|null,random:()=>number=Math.random):number{
 for(let tries=0;tries<12;tries++){const at=Math.round(10+random()*80);if(last===null||Math.abs(at-last)>=25)return at;}
 return last!==null&&last<50?Math.min(90,last+40):Math.max(10,(last??50)-40);
}
/** Something is going on (Paul's answer badge, a speaking voice, an open window): Paul waits for a quieter moment. */
function busyScreen(){
 if(document.hidden||document.querySelector('.lk-reaction-layer,dialog[open],.ig-backdrop,.sg-backdrop,.st-layer'))return true;
 try{if(window.speechSynthesis?.speaking||window.speechSynthesis?.pending)return true;}catch{}
 return [...document.querySelectorAll('audio')].some(audio=>!audio.paused);
}
/**
 * Now and then Paul pops up from the bottom of the screen (9 s after a page opens, then every 75 s), each time at
 * another point along the bottom edge (never from the top or the sides, the learner asked). Every other visit he waves; in between he shows his other animations in turn
 * (thumbs up, clapping, thinking, pointing at his board, drumming on the desk). He never blocks a tap
 * (pointer-events: none), waits while something else is happening, stays away when motion is off, and says hello with
 * a sound only on his first visit in a browser session; the other visits are silent.
 */
export function PaulPeek(){
 const motion=usePaulMotion();
 const [visit,setVisit]=useState<{n:number;pose:PaulAnimation;at:number}|null>(null);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>{
  if(!motion||QUIET_PAGES.test(window.location.pathname))return;
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms));};
  const count=()=>{try{return Number(sessionStorage.getItem(VISIT_KEY))||0;}catch{return 0;}};
  const peek=()=>{
   if(busyScreen()){later(peek,12000);return;}
   // Every other visit he greets; in between he does what the learner is doing (data-paul-mood), or his next other animation.
   const n=count();const mood=document.querySelector('[data-paul-mood]')?.getAttribute('data-paul-mood');
   const pose=n%2===1&&isPose(mood)?nextPaul(mood):peekPose(n);
   let last:number|null=null;try{const saved=sessionStorage.getItem(SPOT_KEY);last=saved===null?null:Number(saved);}catch{}
   const at=peekSpot(Number.isFinite(last)?last:null);
   try{sessionStorage.setItem(VISIT_KEY,String(n+1));sessionStorage.setItem(SPOT_KEY,String(at));}catch{}
   setVisit({n,pose,at});
   if(pose==='welcome')try{if(!sessionStorage.getItem('lernkoko-paul-hello')){sessionStorage.setItem('lernkoko-paul-hello','1');playPaulSound('hello');}}catch{}
   // Fetch the next animation early, so it is ready when he comes again.
   try{const image=new Image();image.src=paulSrc(peekPose(n+1));}catch{}
   later(()=>setVisit(null),PEEK_SHOW_MS);later(peek,PEEK_GAP_MS);
  };
  later(peek,PEEK_FIRST_MS);
  return()=>{timers.current.forEach(clearTimeout);timers.current=[];setVisit(null);};
 },[motion]);
 if(!visit)return null;
 return <div key={visit.n} className={'paul-peek edge-bottom pose-'+visit.pose} style={{'--peek-at':visit.at+'%'} as CSSProperties} aria-hidden="true"><img src={paulSrc(visit.pose)} alt="" width={224} height={224} decoding="async" draggable={false}/></div>;
}
