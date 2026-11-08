/**
 * Lektion 5 „Alltag und Freizeit“ (A1.1), Teil A–D (the learner asked, 8 November 2026: "the same rules, don't skip
 * topics"): words first, then the topics, the exercises and a test, like Lektion 3 and 4, after the learner's book
 * (Kursbuch and Arbeitsbuch) but in our own words and with the site's people. The parts are data (lib/alltag-a.ts …
 * alltag-d.ts, shapes in lib/alltag-types.ts) drawn by app/alltag-steps.tsx.
 */
import {unitGoalsFor} from './unit-goals';
import {sayText,type SayItem} from './willkommen-course';
import type {ChoiceLine} from './stadt-course';
import {T,alltagTurkish,wordSay,lineText,partScored,type Block,type AlltagPart,type AlltagStep,type PartId} from './alltag-types';
import {partA} from './alltag-a';
import {partB} from './alltag-b';
import {partC} from './alltag-c';
import {partD} from './alltag-d';

export const ALLTAG_PATH='/a1-1/alltag-und-freizeit';
export const ALLTAG_UNIT='book-05';
export const alltagPartOrder:PartId[]=['a','b','c','d'];
export const alltagPartList:AlltagPart[]=[partA,partB,partC,partD];
// The exercises' kickers ("Alıştırma 1 · Wer ist das?") are Turkish too: noted for the packs like the rest.
for(const part of alltagPartList)for(const step of part.steps)if(step.kicker&&/Alıştırma|Konu/.test(step.kicker))T(step.kicker);
export const alltagParts:Record<PartId,AlltagPart>={a:partA,b:partB,c:partC,d:partD};
export const isAlltagPart=(id:string):id is PartId=>id in alltagParts;
/** What Lektion 5 teaches (the contents page's left page): lib/unit-goals.ts. */
export const alltagGoals=unitGoalsFor(ALLTAG_UNIT);
/** The scored steps of every part (exercises and the test). */
export const alltagScored:Record<PartId,{id:string;total:number}[]>={a:partScored(partA),b:partScored(partB),c:partScored(partC),d:partScored(partD)};
// Every word card and word list of the teaching steps (Teil A has two card sets: the day and the times of the day).
const wordCount=(part:AlltagPart)=>part.steps.filter(step=>step.kind==='teach').flatMap(step=>step.blocks??[]).reduce((n,block)=>n+(block.t==='list'||block.t==='cards'?block.words.length:0),0);
/** The words a part teaches (its cards and word lists), for the contents page. */
export const alltagWordCount:Record<PartId,number>={a:wordCount(partA),b:wordCount(partB),c:wordCount(partC),d:wordCount(partD)};
/** The step groups of a part: the teaching steps, the exercises, the test and Konuş (cover and end belong to none). */
export function alltagGroups(part:AlltagPart){
 const ids=(kind:string)=>part.steps.filter(step=>step.kind===kind).map(step=>step.id);
 return [
  {id:'konu' as const,label:'Konu anlatımı',ids:ids('teach')},
  {id:'alistirmalar' as const,label:'Alıştırmalar',ids:ids('exercise')},
  {id:'test' as const,label:'Test',ids:ids('test')},
  {id:'konus' as const,label:'Konuş',ids:ids('speak')},
 ];
}
export const alltagStepIndex=(part:PartId,id:string)=>alltagParts[part].steps.findIndex(step=>step.id===id);
/** Every Turkish text of Lektion 5's data, for tests/alltag.test.cjs (each must be in every unit pack). */
export const alltagTurkishTexts=()=>[...alltagTurkish];
/** Is this one of Lektion 5's Turkish texts? (a question or option in the test: its language on the page). */
export const isAlltagTurkish=(text:string)=>alltagTurkish.has(text);

/* ---------- what the voices read ---------- */
function blockTexts(block:Block,add:(item:SayItem|undefined)=>void){
 switch(block.t){
  case 'rows':block.rows.forEach(([de])=>add(block.who?{text:de,who:block.who}:de));break;
  case 'talk':block.lines.forEach(line=>add({text:line.say??line.de,who:line.who}));break;
  case 'table':block.say?.forEach(add);break;
  case 'checks':block.items.forEach(item=>add(item.say));break;
  case 'cards':block.words.forEach(word=>add(wordSay(word)));break;
  case 'list':block.words.forEach(([,,example])=>add(example));break;
  case 'ads':block.items.forEach(item=>add(item.say));break;
 }
}
const choiceSay=(line:ChoiceLine):SayItem=>line.say??lineText(line);
function stepTexts(step:AlltagStep,add:(item:SayItem|undefined)=>void){
 [...(step.blocks??[]),...(step.after??[])].forEach(block=>blockTexts(block,add));
 const exercise=step.exercise;
 if(exercise)switch(exercise.type){
  case 'quiz':exercise.items.forEach(item=>{add(item.listen);add(item.say??item.options[0]);});break;
  case 'choice':exercise.lines.forEach(line=>add(choiceSay(line)));exercise.listen?.forEach(add);break;
  case 'gaps':exercise.say.forEach(add);exercise.lines.forEach(line=>add(line.say));break;
  case 'write':exercise.rows.forEach(row=>add(row.say));break;
  case 'own':exercise.prompts.forEach(prompt=>add(prompt.question));break;
 }
 step.test?.forEach(question=>{add(question[3]);add(question[4]);});
 step.speak?.forEach(row=>{add({text:row.question,who:row.who});add(row.answer);});
}
/** Every German text Lektion 5 speaks (rendered as site voices by scripts/voices). */
export function alltagSpeechTexts():string[]{
 const out=new Set<string>();
 const add=(item:SayItem|undefined)=>{if(!item)return;const text=sayText(item).trim();if(text)out.add(text);};
 for(const part of alltagPartList)part.steps.forEach(step=>stepTexts(step,add));
 // The ratings of Konuş (app/berufe-a-steps.tsx `speakRatings`).
 ['sehr gut','gut','nicht so gut'].forEach(add);
 return [...out];
}
