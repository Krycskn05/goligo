'use client';
import {useEffect,useState} from 'react';
import {EFFECTS_CHANGED,EFFECTS_KEY,motionAllowed} from '@/lib/learning-effects';

/**
 * Paul Hoca's small animations (public/paul: 180×180 animated WebP with a clear background, shown at about
 * 90 px, 70 px on phones): waving on the home page, the raised finger after a wrong answer (in the
 * "Tekrar dene" badge of learning-effects.tsx) and pointing at the board next to hints and rule boxes.
 * They are pictures only: no sound, no text read aloud.
 */
export const PAUL_PICTURES={hello:'/paul/paul-merhaba.webp',wrong:'/paul/paul-yanlis.webp',tip:'/paul/paul-ipucu.webp'} as const;
/** One still frame for learners who turned motion off (site setting or the device's "reduce motion"). */
export const PAUL_STILL={hello:'/paul/paul-merhaba-still.webp',tip:'/paul/paul-ipucu-still.webp'} as const;
export type PaulPose=keyof typeof PAUL_STILL;

function useMotion(){
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

export function PaulHoca({pose,className=''}:{pose:PaulPose;className?:string}){
 const motion=useMotion();
 return <picture className={('paul-hoca paul-'+pose+' '+className).trim()} aria-hidden="true">
  <source media="(prefers-reduced-motion: reduce)" srcSet={PAUL_STILL[pose]}/>
  <img src={motion?PAUL_PICTURES[pose]:PAUL_STILL[pose]} alt="" width={180} height={180} loading="lazy" decoding="async" draggable={false}/>
 </picture>;
}
