import type {A1Exam,Ad,AdChoice,AdMode,Face,Frame,Notice,ReadingText,TrueFalse} from './a1-exam-types';

/**
 * The short way an exam is written down (lib/a1-exam-lesen-NN.ts): statements, ads and notices as small tuples in the
 * order of the paper. `buildExam` numbers them like the exam (Teil 1: 1–5, Teil 2: 6–10, Teil 3: 11–15) and gives every
 * item its id `a1-lesen-<exam>-<number>` — these ids are kept in the learner's saved answers, never change them.
 */
/** [statement, answer, why] */
export type TfSpec=readonly [text:string,answer:TrueFalse,why:string];
/** [frame, lines, phone number or web address, face?] */
export type AdSpec=readonly [frame:Frame,lines:readonly string[],label:string,face?:Face];
/** [frame, lines, title?, face?] */
export type NoticeSpec=readonly [frame:Frame,lines:readonly string[],title?:string,face?:Face];
export type TextSpec=Omit<ReadingText,'items'|'example'>&{example?:readonly [text:string,answer:TrueFalse];items:readonly TfSpec[]};
export type ExamSpec={
 teil1:readonly [TextSpec,TextSpec];
 teil2:{mode:AdMode;example:readonly [situation:string,a:AdSpec,b:AdSpec,answer:AdChoice];items:readonly (readonly [situation:string,a:AdSpec,b:AdSpec,answer:AdChoice,why:string])[]};
 teil3:{example:readonly [place:string,notice:NoticeSpec,text:string,answer:TrueFalse];items:readonly (readonly [place:string,notice:NoticeSpec,text:string,answer:TrueFalse,why:string])[]};
};

const two=(n:number)=>String(n).padStart(2,'0');
export const lesenExamId=(number:number)=>'a1-lesen-'+two(number);
export const lesenItemId=(exam:number,n:number)=>lesenExamId(exam)+'-'+two(n);
const ad=(spec:AdSpec):Ad=>({frame:spec[0],lines:spec[1],label:spec[2],...(spec[3]?{face:spec[3]}:{})});
const notice=(spec:NoticeSpec):Notice=>({frame:spec[0],lines:spec[1],...(spec[2]?{title:spec[2]}:{}),...(spec[3]?{face:spec[3]}:{})});

export function buildExam(number:number,topics:string,spec:ExamSpec):A1Exam{
 let n=0;const id=()=>lesenItemId(number,++n);
 const text=(part:TextSpec):ReadingText=>{
  const {example,items,...rest}=part;
  return {...rest,...(example?{example:{text:example[0],answer:example[1]}}:{}),items:items.map(item=>({id:id(),n,text:item[0],answer:item[1],why:item[2]}))};
 };
 const teil1=[text(spec.teil1[0]),text(spec.teil1[1])] as const;
 const teil2={mode:spec.teil2.mode,
  example:{situation:spec.teil2.example[0],ads:[ad(spec.teil2.example[1]),ad(spec.teil2.example[2])] as const,answer:spec.teil2.example[3]},
  items:spec.teil2.items.map(item=>({id:id(),n,situation:item[0],ads:[ad(item[1]),ad(item[2])] as const,answer:item[3],why:item[4]}))};
 const teil3={
  example:{place:spec.teil3.example[0],notice:notice(spec.teil3.example[1]),text:spec.teil3.example[2],answer:spec.teil3.example[3]},
  items:spec.teil3.items.map(item=>({id:id(),n,place:item[0],notice:notice(item[1]),text:item[2],answer:item[3],why:item[4]}))};
 return {id:lesenExamId(number),number,topics,lesen:{teil1,teil2,teil3},hoeren:null,schreiben:null};
}
