'use client';
import {useEffect,useState} from 'react';
import {EFFECTS_CHANGED,EFFECTS_KEY,motionAllowed} from '@/lib/learning-effects';

/** True while animations may move (the site's motion setting and the device's "reduce motion"). */
export function useMotion(){
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
