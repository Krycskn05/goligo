'use client';
import {useEffect,useRef,useState} from 'react';
import {EFFECTS_CHANGED,EFFECTS_KEY,motionAllowed,playLearningSound} from '@/lib/learning-effects';
import type {PaulSoundId} from '@/lib/effect-sounds';

/**
 * Paul Hoca, the learner's teacher, in the animations the learner made from his photos (public/paul: 224 × 224
 * animated WebP with a clear background, 31 frames, about 2.5 s, looping; `-still.webp` is the first frame).
 * Shown at a middle size (about 110–150 px on a computer, a little smaller on phones):
 * - hello: now and then he comes up from the bottom-right corner of the screen and waves (`PaulPeek`), with a
 *   cheerful "hello" sound the first time in a visit;
 * - desk / wrong: drumming on the desk for "Harika!" and a gentle raised finger in the answer badge (only the answer's
 *   own effect sound plays there);
 * - cheer: clapping at the end of a round, with applause;
 * - correct (thumbs up) is kept for later use;
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
export const PEEK_FIRST_MS=9000,PEEK_EVERY_MS=150000,PEEK_SHOW_MS=3600;
/** Something is going on (Paul's answer badge, a speaking voice, an open window): Paul waits for a quieter moment. */
function busyScreen(){
 if(document.hidden||document.querySelector('.lk-reaction-layer,dialog[open],.ig-backdrop'))return true;
 try{if(window.speechSynthesis?.speaking||window.speechSynthesis?.pending)return true;}catch{}
 return [...document.querySelectorAll('audio')].some(audio=>!audio.paused);
}
/**
 * Now and then (9 s after a page opens, then about every two and a half minutes) Paul comes up from the bottom-right
 * corner of the screen, waves for a moment and goes back down. He never blocks a tap (pointer-events: none), waits
 * while something else is happening, stays away when motion is off, and says hello with a sound only on his first
 * visit in a browser session.
 */
export function PaulPeek(){
 const motion=usePaulMotion();
 const [visit,setVisit]=useState(0);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>{
  if(!motion||QUIET_PAGES.test(window.location.pathname))return;
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms));};
  const peek=()=>{
   if(busyScreen()){later(peek,12000);return;}
   setVisit(n=>n+1);
   try{if(!sessionStorage.getItem('lernkoko-paul-hello')){sessionStorage.setItem('lernkoko-paul-hello','1');playPaulSound('hello');}}catch{}
   later(()=>setVisit(0),PEEK_SHOW_MS);later(peek,PEEK_EVERY_MS);
  };
  later(peek,PEEK_FIRST_MS);
  return()=>{timers.current.forEach(clearTimeout);timers.current=[];setVisit(0);};
 },[motion]);
 if(!visit)return null;
 return <div key={visit} className="paul-peek" aria-hidden="true"><img src={PAUL_PICTURES.hello} alt="" width={224} height={224} decoding="async" draggable={false}/></div>;
}
