'use client';
import {useEffect,useRef} from 'react';
import {ArrowRight,RotateCcw} from 'lucide-react';
export {roundMistakeIds} from '@/lib/mistake-repeat';

/** How long the card waits before the wrong questions come again by themselves (the same 3 seconds as after an answer). */
export const REPEAT_START_MS=3000;

/**
 * The end of a round with mistakes (the learner asked, 5 November 2026: "when I get something wrong, let me repeat my
 * mistakes at the end of the part — the same in Nesne Kasası"): this card says so, and after 3 seconds (or a tap) the
 * wrong questions come once more; the results of the round follow that repeat. Nothing is read aloud here.
 */
export function MistakeRepeatCard({title,lead,startLabel,skipLabel,busy,onStart,onSkip}:{title:string;lead:string;startLabel:string;skipLabel:string;busy:boolean;onStart:()=>void;onSkip:()=>void}){
 const start=useRef(onStart);start.current=onStart;
 useEffect(()=>{
  if(busy)return;
  let timer:ReturnType<typeof setTimeout>;
  // A hidden page waits; the repeat starts when the learner is back.
  const tick=()=>{if(document.hidden){timer=setTimeout(tick,500);return;}start.current();};
  timer=setTimeout(tick,REPEAT_START_MS);
  return()=>clearTimeout(timer);
 },[busy]);
 return <section className="object-results panel mistake-repeat" aria-labelledby="object-question-heading" data-mistake-repeat="">
  <h1 id="object-question-heading" tabIndex={-1}><RotateCcw size={22} aria-hidden="true"/>{title}</h1>
  <p className="mistake-repeat-lead">{lead}</p>
  <div className="object-actions"><button type="button" className="btn" disabled={busy} onClick={onStart} data-mistake-repeat-start=""><ArrowRight size={18} className="vault-direction-icon"/>{startLabel}</button><button type="button" className="btn secondary" disabled={busy} onClick={onSkip}>{skipLabel}</button></div>
  <span className="vault-auto-next" aria-hidden="true"/>
 </section>;
}
