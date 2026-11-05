/**
 * Lektion 3 „Orte und Dinge“ (A1.1), Teil A–D (the learner asked, 5 November 2026: words first, then the topics, then
 * the exercises and a test, like Lektion 1 and 2, after the learner's book but in our own words and with the site's
 * people). The parts are data (lib/orte-a.ts … orte-d.ts, shapes in lib/orte-types.ts) drawn by app/orte-steps.tsx.
 */
import {unitGoalsFor} from './unit-goals';
import {sayText,type SayItem} from './willkommen-course';
import type {ChoiceLine} from './stadt-course';
import {T,orteTurkish,wordSay,lineText,partScored,type Block,type OrtePart,type OrteStep,type PartId} from './orte-types';
import {partA,wordsA} from './orte-a';
import {partB,wordsB} from './orte-b';
import {partC,wordsC} from './orte-c';
import {partD,wordsD} from './orte-d';

export const ORTE_PATH='/a1-1/orte-und-dinge';
export const ORTE_UNIT='book-03';
export const ortePartOrder:PartId[]=['a','b','c','d'];
export const ortePartList:OrtePart[]=[partA,partB,partC,partD];
// The exercises' kickers ("Alıştırma 1 · Was ist das?") are Turkish too: noted for the packs like the rest.
for(const part of ortePartList)for(const step of part.steps)if(step.kicker&&/Alıştırma|Konu/.test(step.kicker))T(step.kicker);
export const orteParts:Record<PartId,OrtePart>={a:partA,b:partB,c:partC,d:partD};
export const isOrtePart=(id:string):id is PartId=>id in orteParts;
/** What Lektion 3 teaches (the contents page's left page): lib/unit-goals.ts. */
export const orteGoals=unitGoalsFor(ORTE_UNIT);
/** The scored steps of every part (exercises and the test). */
export const orteScored:Record<PartId,{id:string;total:number}[]>={a:partScored(partA),b:partScored(partB),c:partScored(partC),d:partScored(partD)};
const listCount=(part:OrtePart)=>part.steps.flatMap(step=>step.blocks??[]).reduce((n,block)=>n+(block.t==='list'?block.words.length:0),0);
/** The words a part teaches (its cards and word lists), for the contents page. */
export const orteWordCount:Record<PartId,number>={a:wordsA.length+listCount(partA),b:wordsB.length+listCount(partB),c:wordsC.length+listCount(partC),d:wordsD.length+listCount(partD)};
/** The step groups of a part: the teaching steps, the exercises, the test and Konuş (cover and end belong to none). */
export function orteGroups(part:OrtePart){
 const ids=(kind:string)=>part.steps.filter(step=>step.kind===kind).map(step=>step.id);
 return [
  {id:'konu' as const,label:'Konu anlatımı',ids:ids('teach')},
  {id:'alistirmalar' as const,label:'Alıştırmalar',ids:ids('exercise')},
  {id:'test' as const,label:'Test',ids:ids('test')},
  {id:'konus' as const,label:'Konuş',ids:ids('speak')},
 ];
}
export const orteStepIndex=(part:PartId,id:string)=>orteParts[part].steps.findIndex(step=>step.id===id);
/** Every Turkish text of Lektion 3's data, for tests/orte.test.cjs (each must be in every unit pack). */
export const orteTurkishTexts=()=>[...orteTurkish];
/** Is this one of Lektion 3's Turkish texts? (a question or option in the test: its language on the page). */
export const isOrteTurkish=(text:string)=>orteTurkish.has(text);

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
function stepTexts(step:OrteStep,add:(item:SayItem|undefined)=>void){
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
/** Every German text Lektion 3 speaks (rendered as site voices by scripts/voices). */
export function orteSpeechTexts():string[]{
 const out=new Set<string>();
 const add=(item:SayItem|undefined)=>{if(!item)return;const text=sayText(item).trim();if(text)out.add(text);};
 for(const part of ortePartList)part.steps.forEach(step=>stepTexts(step,add));
 // The ratings of Konuş (app/berufe-a-steps.tsx `speakRatings`).
 ['sehr gut','gut','nicht so gut'].forEach(add);
 return [...out];
}
