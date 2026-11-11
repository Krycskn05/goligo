import type {A1Exam,A1HoerenExam,A1SchreibenExam,AbcChoice,Ad,AdChoice,AdMode,AudioLine,Face,Frame,FormGap,GapWhyKind,ListenOption,Notice,ReadingText,TrueFalse} from './a1-exam-types';
import {spellDevice,spellSay,spellShown} from './a1-exam-letters';

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
 return {id:lesenExamId(number),number,topics,lesen:{teil1,teil2,teil3},schreiben:null};
}

/* ---------- Hören (lib/a1-exam-hoeren-NN.ts) ---------- */
/**
 * The people of the site keep their own voice in every exam (lib/site-voices.ts: the voice called Sabine reads Sabine).
 * Anyone else is written as "Name:Voice" ("Verkäuferin:F4") — a voice of the right kind that is not the other speaker's.
 */
export const CAST_VOICES:Record<string,string>={Sabine:'F1',Yasemin:'F2',Aisha:'F3',Nora:'F4',Mei:'F5',Rami:'M1',Omar:'M2',Paul:'M3',Nikos:'M4',Tomasz:'M5'};
/** [speaker or "speaker:voice", text, what the natural voices read when it is not the text, what the device voice reads] */
export type LineSpec=readonly [who:string,text:string,say?:string,device?:string];
/** A line in which a name is said letter by letter: `{S}` in the text is the spelling ("Ich buchstabiere: {S}.") — on the
 * paper "K – R – Ü – G – E – R", for the voices the letters' names (lib/a1-exam-letters.ts). */
export function spelled(who:string,text:string,name:string):LineSpec{
 return [who,text.replaceAll('{S}',spellShown(name)),text.replaceAll('{S}',spellSay(name)),text.replaceAll('{S}',spellDevice(name))];
}
/** An answer: its words, or [emoji, words]. */
export type OptionSpec=string|readonly [icon:string,text:string];
/** `cards`: the answers are name cards (the question „Wie buchstabiert man den Namen?“). */
export type ChoiceSpec={q:string;o:readonly [OptionSpec,OptionSpec,OptionSpec];a:AbcChoice;cards?:true;lines:readonly LineSpec[];why:string};
export type TrueFalseSpec={t:string;a:TrueFalse;lines:readonly LineSpec[];why:string};
export type HoerenSpec={
 teil1:{example:Omit<ChoiceSpec,'why'>;items:readonly ChoiceSpec[]};
 teil2:{example:Omit<TrueFalseSpec,'why'>;items:readonly TrueFalseSpec[]};
 teil3:{items:readonly ChoiceSpec[]};
};
export const hoerenExamId=(number:number)=>'a1-hoeren-'+two(number);
export const hoerenItemId=(exam:number,n:number)=>hoerenExamId(exam)+'-'+two(n);
function audioLine(spec:LineSpec):AudioLine{
 const [name,given]=spec[0].split(':');const voice=given??CAST_VOICES[name];
 if(!voice||!/^[FM][1-5]$/.test(voice))throw new Error('No voice for '+spec[0]);
 return {who:name,voice,text:spec[1],...(spec[2]?{say:spec[2],device:spec[3]??spec[1]}:{})};
}
const option=(spec:OptionSpec):ListenOption=>typeof spec==='string'?{text:spec}:{icon:spec[0],text:spec[1]};
const options=(o:ChoiceSpec['o'])=>[option(o[0]),option(o[1]),option(o[2])] as const;

/** Numbers a Hören exam like the paper: Teil 1: 1–6, Teil 2: 7–10, Teil 3: 11–15; ids `a1-hoeren-<exam>-<number>`. */
export function buildHoeren(number:number,topics:string,spec:HoerenSpec):A1HoerenExam{
 let n=0;const id=()=>hoerenItemId(number,++n);
 const choice=(item:ChoiceSpec)=>({id:id(),n,question:item.q,options:options(item.o),answer:item.a,...(item.cards?{cards:true as const}:{}),lines:item.lines.map(audioLine),why:item.why});
 const teil1={example:{question:spec.teil1.example.q,options:options(spec.teil1.example.o),answer:spec.teil1.example.a,lines:spec.teil1.example.lines.map(audioLine)},items:spec.teil1.items.map(choice)};
 const teil2={example:{text:spec.teil2.example.t,answer:spec.teil2.example.a,lines:spec.teil2.example.lines.map(audioLine)},
  items:spec.teil2.items.map(item=>({id:id(),n,text:item.t,answer:item.a,lines:item.lines.map(audioLine),why:item.why}))};
 const teil3={items:spec.teil3.items.map(choice)};
 return {id:hoerenExamId(number),number,topics,hoeren:{teil1,teil2,teil3}};
}

/* ---------- Schreiben (lib/a1-exam-schreiben-NN.ts) ---------- */
/** A gap of the form: [the entries that count — the model entry first —, how it is explained, the line of the text]. */
export type FormGapSpec=readonly [accept:readonly string[],kind:GapWhyKind,quote:string];
export type SchreibenSpec={
 teil1:{text:string;form:string;rows:readonly (readonly [label:string,value:string])[];gaps:readonly [FormGapSpec,FormGapSpec,FormGapSpec,FormGapSpec,FormGapSpec]};
 teil2:{task:string;points:readonly [string,string,string];model:readonly string[]};
};
export const schreibenExamId=(number:number)=>'a1-schreiben-'+two(number);
export const schreibenItemId=(exam:number,n:number)=>schreibenExamId(exam)+'-'+two(n);
/** Numbers the form's gaps 1–5; ids `a1-schreiben-<exam>-<number>` (06–09 are the four marks the learner gives the own
 * message, lib/a1-exam-course.ts `SCHREIBEN_CRITERIA`). */
export function buildSchreiben(number:number,topics:string,spec:SchreibenSpec):A1SchreibenExam{
 const teil1={text:spec.teil1.text,form:spec.teil1.form,rows:spec.teil1.rows.map(row=>({label:row[0],value:row[1]})),
  items:spec.teil1.gaps.map((item,i):FormGap=>({id:schreibenItemId(number,i+1),n:i+1,accept:item[0],why:{kind:item[1],quote:item[2]}}))};
 return {id:schreibenExamId(number),number,topics,schreiben:{teil1,teil2:spec.teil2}};
}
