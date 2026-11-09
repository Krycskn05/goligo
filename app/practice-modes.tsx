'use client';
import {ListChecks,PenLine,Headphones} from 'lucide-react';
import type {PracticeMode} from '@/lib/writing-practice';

/** starts: each card opens its round at once (Nesne Kasası), so the last played mode is only marked, not a toggle.
 * noWrite: no "Yazarak Pekiştir" (the lesson cards of Kelime Kasası, 9 November 2026). */
export function PracticeModes({labels,onChoose,disabled=false,active,counts,compact=false,topicLabel,starts=false,noWrite=false}:{labels:{test:string;write:string;listen?:string;testDetail?:string;writeDetail?:string;listenDetail?:string};onChoose:(mode:PracticeMode)=>void;disabled?:boolean;active?:PracticeMode;counts?:{test:number;write:number;listen?:number};compact?:boolean;topicLabel?:string;starts?:boolean;noWrite?:boolean}){
 const modes:PracticeMode[]=(labels.listen?['test','write','listen'] as PracticeMode[]:['test','write'] as PracticeMode[]).filter(mode=>!noWrite||mode!=='write');
 return <div className={'practice-modes '+(modes.length===3?'three-modes ':'')+(compact?'compact':'')}>
  {modes.map(mode=>{const Icon=mode==='test'?ListChecks:mode==='listen'?Headphones:PenLine;const detail=labels[mode==='test'?'testDetail':mode==='listen'?'listenDetail':'writeDetail'];return <button type="button" key={mode} className={'practice-mode-button '+mode+(active===mode?' active':'')} disabled={disabled||counts?.[mode]===0} aria-label={topicLabel?labels[mode]+' · '+topicLabel:undefined} aria-pressed={active&&!starts?active===mode:undefined} onClick={()=>onChoose(mode)}><Icon size={19}/><span><strong>{labels[mode]}</strong>{!compact&&detail&&<small>{detail}</small>}</span>{counts&&<span className="practice-mode-count">{counts[mode]}</span>}</button>;})}
 </div>;
}
