'use client';
import {useState} from 'react';
import {ArrowRight,Play} from 'lucide-react';

/**
 * "Kaldığın yerden devam et" on a lesson's contents page (Lektion 1, 2 and 15; the learner asked, 2 November 2026: "the
 * place where I stopped is forgotten"). The lesson pages already save the part and the step the learner opened last (and
 * they travel with the account, lib/lesson-sync.ts); this reads them back for the row of that part.
 */
export type ResumePart={badge:string;steps:readonly {id:string;title:string}[]};
export function useResume<P extends string>(partKey:string,stepKeys:Record<P,{step:string}>,parts:Record<P,ResumePart>):{part:P;index:number}|null{
 const [resume]=useState(()=>{
  try{
   const part=localStorage.getItem(partKey);if(!part||!(part in parts))return null;
   const id=localStorage.getItem(stepKeys[part as P].step);const index=parts[part as P].steps.findIndex(step=>step.id===id);
   return index>0?{part:part as P,index}:null; // the cover is the start anyway
  }catch{return null;}
 });
 return resume;
}
/** The link in the contents row of the part the learner opened last (a small line, not a note on the left page: those notes
 * were removed at the learner's request on 25 October 2026). */
export function ResumeLink<P extends string>({resume,parts,part,onOpen}:{resume:{part:P;index:number}|null;parts:Record<P,ResumePart>;part:P;onOpen:(part:P,index:number)=>void}){
 if(!resume||resume.part!==part)return null;
 const step=parts[part].steps[resume.index];
 return <button type="button" className="text-button lb-toc-resume" data-lesson-resume={part} onClick={()=>onOpen(part,resume.index)}><Play size={14} aria-hidden="true"/>Kaldığın yerden devam et · {step.title}<ArrowRight size={14} className="vault-direction-icon" aria-hidden="true"/></button>;
}
