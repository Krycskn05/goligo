import type {SiteLanguage} from './site-languages';
import {fillText} from './copy-fill';
import type {L12Block,L12Item,L12Part} from './ausbildung-course';
import type {HoerenTask} from './ausbildung-hoeren';

/**
 * Lektion 12 in every site language (the learner asked, 22 October 2026). The lesson is written in Turkish (the
 * learner's class notes, lib/ausbildung-course.ts, lib/ausbildung-hoeren.ts, the Turkish texts of app/ausbildung-*.tsx);
 * each other site language has a pack `lib/l12-packs/<id>.json` = {ui:{Turkish: translation}, content:{Turkish:
 * translation}}, loaded when the page needs it. German material (*…* in the texts, examples, dialogues, answers)
 * stays as it is; a text with no translation is shown in Turkish.
 */
export type L12Pack={ui:Record<string,string>;content:Record<string,string>};

// Still to come (shown in Turkish with a note until then): ku vi prs ps ti so hi ur.
const loaders:Partial<Record<SiteLanguage,()=>Promise<unknown>>>={
 de:()=>import('./l12-packs/de.json'),en:()=>import('./l12-packs/en.json'),ar:()=>import('./l12-packs/ar.json'),
 uk:()=>import('./l12-packs/uk.json'),fr:()=>import('./l12-packs/fr.json'),es:()=>import('./l12-packs/es.json'),
 ru:()=>import('./l12-packs/ru.json'),fa:()=>import('./l12-packs/fa.json'),pl:()=>import('./l12-packs/pl.json'),
 it:()=>import('./l12-packs/it.json'),pt:()=>import('./l12-packs/pt.json'),
 sq:()=>import('./l12-packs/sq.json'),ro:()=>import('./l12-packs/ro.json'),bg:()=>import('./l12-packs/bg.json'),
 hbs:()=>import('./l12-packs/hbs.json'),el:()=>import('./l12-packs/el.json'),
 zh:()=>import('./l12-packs/zh.json'),ja:()=>import('./l12-packs/ja.json'),ko:()=>import('./l12-packs/ko.json'),
 nl:()=>import('./l12-packs/nl.json'),hu:()=>import('./l12-packs/hu.json'),cs:()=>import('./l12-packs/cs.json'),
};
/** The languages with a Lektion 12 pack (Turkish is the original). */
export const l12PackLanguages=Object.keys(loaders) as SiteLanguage[];

const packs=new Map<string,L12Pack>();
const pending=new Map<string,Promise<void>>();
export function registerL12Pack(language:string,pack:L12Pack){packs.set(language,pack);cache.delete(language);}
export function hasL12Pack(language:string){return language==='tr'||packs.has(language);}
/** Loads the language's pack once. Never rejects: on failure the Turkish texts are shown and a later call retries. */
export function loadL12Pack(language:string):Promise<void>{
 const load=loaders[language as SiteLanguage];
 if(!load||packs.has(language))return Promise.resolve();
 let job=pending.get(language);
 if(!job){
  job=load().then(module=>{const data=((module as {default?:unknown}).default??module) as Partial<L12Pack>;registerL12Pack(language,{ui:data?.ui??{},content:data?.content??{}});}).catch(()=>{}).finally(()=>{pending.delete(language);});
  pending.set(language,job);
 }
 return job;
}

/** A text of the lesson's pages (buttons, notes) in the language; {name} marks are filled in. */
export function l12Ui(language:string,text:string,params?:Record<string,string|number>){
 const translated=language==='tr'?text:packs.get(language)?.ui[text]??text;
 return params?fillText(translated,params):translated;
}

const cache=new Map<string,{parts?:L12Part[];tasks?:HoerenTask[]}>();
/** One text in the language: its translation when the pack has one, otherwise the text itself. */
function textIn(pack:Record<string,string>|undefined){
 return <T extends string|undefined>(text:T):T=>(text!==undefined&&pack&&Object.prototype.hasOwnProperty.call(pack,text)?pack[text] as T:text);
}
function localBlock(block:L12Block,tr:<T extends string|undefined>(text:T)=>T):L12Block{
 switch(block.t){
  case 'p':case 'h':case 'note':return {...block,text:tr(block.text)};
  case 'list':return {...block,items:block.items.map(tr)};
  case 'vocab':return {...block,title:tr(block.title),lead:tr(block.lead),words:block.words.map(word=>[word[0],tr(word[1]),...word.slice(2)] as unknown as typeof word)};
  case 'table':return {...block,head:block.head.map(tr),rows:block.frame?block.rows:block.rows.map(row=>row.map(tr))};
  case 'listen':return {...block,text:tr(block.text)};
  default:return block;
 }
}
function localItem(item:L12Item,tr:<T extends string|undefined>(text:T)=>T):L12Item{
 switch(item.k){
  case 'gap':return {...item,text:tr(item.text)};
  case 'choice':return {...item,text:tr(item.text),options:item.options.map(tr)};
  // A picked word is checked against `accept`: both change the same way.
  case 'pick':return {...item,prompt:tr(item.prompt),options:item.options.map(tr),accept:item.accept.map(tr)};
  case 'sentence':return {...item,prompt:tr(item.prompt)};
  case 'open':return {...item,prompt:tr(item.prompt),sample:tr(item.sample)};
 }
}
/**
 * The lesson's parts with their Turkish texts in the language — only the fields that hold explanations, meanings and
 * tasks (as l12ContentTexts lists them); ids, German material and the answers that are checked stay as they are.
 */
export function localizeL12Parts(parts:readonly L12Part[],language:string):readonly L12Part[]{
 const pack=language==='tr'?undefined:packs.get(language)?.content;if(!pack)return parts;
 const kept=cache.get(language);if(kept?.parts)return kept.parts;
 const tr=textIn(pack);
 const out=parts.map(part=>({...part,lead:tr(part.lead),card:tr(part.card),
  sections:part.sections.map(section=>({...section,title:tr(section.title),blocks:section.blocks.map(block=>localBlock(block,tr))})),
  exercises:part.exercises.map(exercise=>({...exercise,title:tr(exercise.title),hint:tr(exercise.hint),key:tr(exercise.key),
   reading:exercise.reading&&{...exercise.reading,title:tr(exercise.reading.title),lines:exercise.reading.lines.map(tr)},
   items:exercise.items.map(item=>localItem(item,tr))})),
  after:part.after?.map(block=>localBlock(block,tr))}));
 cache.set(language,{...kept,parts:out});return out;
}
/** The listening tasks with their Turkish texts in the language (a chosen option and its answer change together). */
export function localizeL12Tasks(tasks:readonly HoerenTask[],language:string):readonly HoerenTask[]{
 const pack=language==='tr'?undefined:packs.get(language)?.content;if(!pack)return tasks;
 const kept=cache.get(language);if(kept?.tasks)return kept.tasks;
 const tr=textIn(pack);
 const out=tasks.map(task=>({...task,title:tr(task.title),hint:tr(task.hint),questions:task.questions.map(question=>{
  switch(question.type){
   case 'rf':return {...question,text:tr(question.text)};
   case 'mc':return {...question,text:tr(question.text),options:question.options.map(tr),label:tr(question.label)};
   case 'select':return {...question,text:tr(question.text),options:question.options.map(tr),answer:tr(question.answer)};
   case 'text':return {...question,text:tr(question.text),placeholder:tr(question.placeholder)};
   case 'dict':return {...question,label:tr(question.label),placeholder:tr(question.placeholder)};
  }
 })}));
 cache.set(language,{...kept,tasks:out});return out;
}

// ---- Which texts are Turkish (the source list for the packs; tested against every pack) ----
const TURKISH_LETTERS=/[çğışİÇĞŞ]/;
const TURKISH_WORDS=/(^|[^\p{L}])(ve|bir|ile|için|bu|şu|ne|hangi|kim|kelime|kelimeler|cümle|soru|cevap|doğru|yanlış|dinle|yaz|oku|seç|örnek|örnekler|fiil|geçmiş|gelecek|kural|dikkat|olarak|olur|gibi|yani|sonra|önce|değil|var|yok|tekil|çoğul|düzenli|düzensiz|resmî|özel|zaman|son|yazılış|okunuş|türkçe|almanca|kişi|isim|ek|kök|eğitim|meslek|staj|okul|okulu|etmek|yapmak|olmak|kazanmak|almak|vermek|bulmak|başlamak|bitirmek|anlatmak|istemek|göre|kadar|her|hiç|da|de|mı|mi|mu|mü)(?=$|[^\p{L}])/iu;
/** True when a text has Turkish in it, outside its German parts (*…*, „…“). */
export function hasTurkish(text:unknown):text is string{
 if(typeof text!=='string')return false;
 const outside=text.replace(/\*\*([^*]+)\*\*/g,' $1 ').replace(/\*[^*]+\*/g,' ').replace(/„[^“]*“/g,' ');
 return TURKISH_LETTERS.test(outside)||TURKISH_WORDS.test(outside);
}
function blockTexts(block:L12Block,add:(text:unknown,always?:boolean)=>void){
 switch(block.t){
  case 'p':case 'h':case 'note':add(block.text);break;
  case 'list':block.items.forEach(item=>add(item));break;
  case 'vocab':add(block.title,true);add(block.lead,true);block.words.forEach(word=>add(word[1],true));break;
  case 'table':block.head.forEach(cell=>add(cell,true));if(!block.frame)block.rows.forEach(row=>row.forEach(cell=>add(cell,!/^\*[^*]+\*$/.test(cell.trim()))));break;
  case 'listen':add(block.text);break;
  case 'letter':break;
 }
}
function itemTexts(item:L12Item,add:(text:unknown,always?:boolean)=>void){
 if(item.k==='gap'||item.k==='choice')add(item.text);
 if(item.k==='choice'||item.k==='pick')item.options.forEach(option=>add(option));
 if(item.k==='sentence'||item.k==='open'||item.k==='pick')add(item.prompt);
 if(item.k==='open')add(item.sample);
}
/** Every Turkish text of the lesson's data, once each, in book order. */
export function l12ContentTexts(parts:readonly L12Part[],tasks:readonly HoerenTask[],roadmap:readonly string[]=[]):string[]{
 const out=new Set<string>();
 const add=(text:unknown,always=false)=>{if(typeof text==='string'&&/\p{L}/u.test(text)&&(always||hasTurkish(text)))out.add(text);};
 roadmap.forEach(text=>add(text,true));
 for(const part of parts){
  add(part.lead,true);add(part.card,true);
  for(const section of part.sections){add(section.title);section.blocks.forEach(block=>blockTexts(block,add));}
  for(const exercise of part.exercises){
   add(exercise.title);add(exercise.hint,true);add(exercise.key,true);
   exercise.reading?.lines.forEach(line=>add(line));add(exercise.reading?.title);
   exercise.items.forEach(item=>itemTexts(item,add));
  }
  part.after?.forEach(block=>blockTexts(block,add));
 }
 for(const task of tasks){
  add(task.title);add(task.hint,true);
  for(const question of task.questions){
   if('text' in question)add(question.text);
   if('options' in question)question.options.forEach(option=>add(option));
   if('label' in question)add(question.label);if('placeholder' in question)add(question.placeholder);
  }
 }
 return [...out];
}
