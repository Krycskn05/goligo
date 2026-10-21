'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {EFFECTS_CHANGED,EFFECTS_KEY,motionAllowed,playLearningSound} from '@/lib/learning-effects';
import type {PaulSoundId} from '@/lib/effect-sounds';

/**
 * Paul Hoca, the learner's teacher, in the animations the learner made from his photos (public/paul: 224 × 224
 * animated WebP with a clear background, 31 frames, about 2.5 s, looping; `-still.webp` is the first frame).
 * Shown at a middle size (about 110–150 px on a computer, a little smaller on phones):
 * - hello: now and then he pops up somewhere on the screen and waves (`PaulPeek`), with a cheerful "hello" sound
 *   the first time in a visit; between two waves he shows his other animations there in turn;
 * - desk / wrong: drumming on the desk for "Harika!" (with a knocking sound next to the chosen correct sound) and a
 *   gentle raised finger in the answer badge (only the wrong sound there);
 * - cheer: clapping at the end of a round, with applause;
 * - correct: thumbs up, among his visits on the screen;
 * - tip: pointing at his little board next to hints and rules ("pling" when the learner opens a hint);
 * - think: hand on the chin with a question mark on the Yanlışlarım page ("hm-hm?").
 * His sounds are effects, never speech: after an answer only the right answer is read aloud.
 */
export const PAUL_PICTURES={hello:'/paul/paul-merhaba.webp',correct:'/paul/paul-dogru.webp',wrong:'/paul/paul-yanlis.webp',tip:'/paul/paul-ipucu.webp',think:'/paul/paul-dusunuyor.webp',cheer:'/paul/paul-tebrik.webp',desk:'/paul/paul-sira.webp'} as const;
export type PaulPose=keyof typeof PAUL_PICTURES;
export const PAUL_STILL:Record<PaulPose,string>=Object.fromEntries(Object.entries(PAUL_PICTURES).map(([pose,src])=>[pose,src.replace('.webp','-still.webp')])) as Record<PaulPose,string>;
export const PAUL_SOUNDS:Partial<Record<PaulPose,PaulSoundId>>={hello:'paulHello',tip:'paulTip',think:'paulHmm',cheer:'paulClap',desk:'paulDrum'};

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
 useEffect(()=>{
  if(sound!=='appear')return;
  if(once){try{if(sessionStorage.getItem(once))return;sessionStorage.setItem(once,'1');}catch{}}
  const stop=playPaulSound(pose);return stop;
 },[pose,sound,once]);
 return <picture className={('paul-hoca paul-'+pose+' '+className).trim()} aria-hidden="true">
  <source media="(prefers-reduced-motion: reduce)" srcSet={PAUL_STILL[pose]}/>
  <img src={motion?PAUL_PICTURES[pose]:PAUL_STILL[pose]} alt="" width={224} height={224} loading="lazy" decoding="async" draggable={false}/>
 </picture>;
}

/** Pages without Paul's visits: the admin panel, the sign-in pages and the legal pages. */
const QUIET_PAGES=/^\/(yonetim|giris|uye-ol|gizlilik|kullanim-kosullari)(\/|$)/;
/** First visit 9 s after a page opens, then one every 75 s: every other visit he waves (so a wave every 2.5 min). */
export const PEEK_FIRST_MS=9000,PEEK_EVERY_MS=150000,PEEK_GAP_MS=PEEK_EVERY_MS/2,PEEK_SHOW_MS=3600;
/** The four edges of the screen he comes from: from the top he hangs upside down, from a side he leans in sideways,
 * always with his head towards the middle of the screen (the learner asked). */
export const PEEK_EDGES=['bottom','top','left','right'] as const;
export type PeekEdge=typeof PEEK_EDGES[number];
/** Between two waves he shows one of his other animations, in turn (the raised finger stays for wrong answers). */
export const PEEK_OTHER_POSES:readonly PaulPose[]=['correct','cheer','think','tip','desk'];
const VISIT_KEY='lernkoko-paul-visit',EDGE_KEY='lernkoko-paul-edge';
/** The n-th visit in this browser session: even visits wave, odd ones bring the next other animation. */
export function peekPose(n:number):PaulPose{return n%2===0?'hello':PEEK_OTHER_POSES[(n>>1)%PEEK_OTHER_POSES.length];}
/** Any point of any edge (12–88 % along it), never the same edge twice in a row. `random` is Math.random in the page. */
export function peekPlace(lastEdge:string|null,random:()=>number=Math.random):{edge:PeekEdge;at:number}{
 const edges=PEEK_EDGES.filter(edge=>edge!==lastEdge);
 return {edge:edges[Math.floor(random()*edges.length)%edges.length],at:Math.round(12+random()*76)};
}
/** Something is going on (Paul's answer badge, a speaking voice, an open window): Paul waits for a quieter moment. */
function busyScreen(){
 if(document.hidden||document.querySelector('.lk-reaction-layer,dialog[open],.ig-backdrop,.sg-backdrop,.st-layer'))return true;
 try{if(window.speechSynthesis?.speaking||window.speechSynthesis?.pending)return true;}catch{}
 return [...document.querySelectorAll('audio')].some(audio=>!audio.paused);
}
/**
 * Now and then Paul pops up somewhere on the screen (9 s after a page opens, then every 75 s): from any point of any
 * edge — bottom, top, left or right, never the same edge twice in a row — turned so that his head points into the
 * screen (upside down from the top). Every other visit he waves; in between he shows his other animations in turn
 * (thumbs up, clapping, thinking, pointing at his board, drumming on the desk). He never blocks a tap
 * (pointer-events: none), waits while something else is happening, stays away when motion is off, and says hello with
 * a sound only on his first visit in a browser session; the other visits are silent.
 */
export function PaulPeek(){
 const motion=usePaulMotion();
 const [visit,setVisit]=useState<{n:number;pose:PaulPose;edge:PeekEdge;at:number}|null>(null);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>{
  if(!motion||QUIET_PAGES.test(window.location.pathname))return;
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms));};
  const count=()=>{try{return Number(sessionStorage.getItem(VISIT_KEY))||0;}catch{return 0;}};
  const peek=()=>{
   if(busyScreen()){later(peek,12000);return;}
   const n=count();const pose=peekPose(n);
   let last:string|null=null;try{last=sessionStorage.getItem(EDGE_KEY);}catch{}
   const place=peekPlace(last);
   try{sessionStorage.setItem(VISIT_KEY,String(n+1));sessionStorage.setItem(EDGE_KEY,place.edge);}catch{}
   setVisit({n,pose,...place});
   if(pose==='hello')try{if(!sessionStorage.getItem('lernkoko-paul-hello')){sessionStorage.setItem('lernkoko-paul-hello','1');playPaulSound('hello');}}catch{}
   // Fetch the next animation early, so it is ready when he comes again.
   try{const image=new Image();image.src=PAUL_PICTURES[peekPose(n+1)];}catch{}
   later(()=>setVisit(null),PEEK_SHOW_MS);later(peek,PEEK_GAP_MS);
  };
  later(peek,PEEK_FIRST_MS);
  return()=>{timers.current.forEach(clearTimeout);timers.current=[];setVisit(null);};
 },[motion]);
 if(!visit)return null;
 return <div key={visit.n} className={'paul-peek edge-'+visit.edge+' pose-'+visit.pose} style={{'--peek-at':visit.at+'%'} as CSSProperties} aria-hidden="true"><img src={PAUL_PICTURES[visit.pose]} alt="" width={224} height={224} decoding="async" draggable={false}/></div>;
}
