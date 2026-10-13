'use client';
import {ListChecks,PenLine,Headphones} from 'lucide-react';
import type {PracticeMode} from '@/lib/writing-practice';

export function PracticeModes({labels,onChoose,disabled=false,active,counts,compact=false,topicLabel}:{labels:{test:string;write:string;listen?:string;testDetail?:string;writeDetail?:string;listenDetail?:string};onChoose:(mode:PracticeMode)=>void;disabled?:boolean;active?:PracticeMode;counts?:{test:number;write:number;listen?:number};compact?:boolean;topicLabel?:string}){
 const modes:PracticeMode[]=labels.listen?['test','write','listen']:['test','write'];
 return <div className={'practice-modes '+(modes.length===3?'three-modes ':'')+(compact?'compact':'')}>
  {modes.map(mode=>{const Icon=mode==='test'?ListChecks:mode==='listen'?Headphones:PenLine;const detail=labels[mode==='test'?'testDetail':mode==='listen'?'listenDetail':'writeDetail'];return <button type="button" key={mode} className={'practice-mode-button '+mode+(active===mode?' active':'')} disabled={disabled||counts?.[mode]===0} aria-label={topicLabel?labels[mode]+' · '+topicLabel:undefined} aria-pressed={active?active===mode:undefined} onClick={()=>onChoose(mode)}><Icon size={19}/><span><strong>{labels[mode]}</strong>{!compact&&detail&&<small>{detail}</small>}</span>{counts&&<span className="practice-mode-count">{counts[mode]}</span>}</button>;})}
 </div>;
}
