/**
 * Lektion 3 „Orte und Dinge“ (A1.1): the shapes of its data. Unlike Lektion 2, whose every step is its own component,
 * Lektion 3 is described as data (lib/orte-a.ts … orte-d.ts) and drawn by one step view (app/orte-steps.tsx) from the
 * pieces of Lektion 1, 2 and 15. Texts for the learner are Turkish and go through `T()`, which notes them for the
 * translation packs (lib/unit-packs/*.json, tests/orte.test.cjs); German stays German. Written in our own words after
 * the topics of the learner's textbook (the learner asked, 5 November 2026: no names or texts of the book, the site's
 * people instead). Step ids never change: saved scores are keyed by them.
 */
import type {GapLine,SayItem,Step} from './willkommen-course';
import type {Line} from './willkommen-b-course';
import type {ChoiceLine} from './stadt-course';

/** Every Turkish text of Lektion 3's data (filled while the parts load). */
export const orteTurkish=new Set<string>();
/** A Turkish text of Lektion 3: shown in the page's language through the unit packs. */
export function T(text:string){orteTurkish.add(text);return text;}

/** A word card: the German (with its article), the plural, the meaning, a picture (or an emoji until one is made) and
 * what is read ("der Tisch, die Tische" unless `say` says otherwise). */
export type Word={de:string;plural?:string;tr:string;emoji:string;pic?:string;say?:string};
/** A word of a list: the word, its meaning, an example and the example's meaning (the row reads the example). */
export type ListWord=readonly [de:string,tr:string,example:string,exampleTr:string];
/** A quick check inside a teaching step (not scored): the first option is right; `say` is read after the answer ('' for
 * a Turkish answer: only the right answer is ever read, never the question). */
export type QuickCheck={q:string;options:string[];say:string};

/** A piece of a teaching step. Texts with `*German*`, `~German~`, `_German_`, `**bold**` and `[der]` (app/willkommen-ui.tsx `Tx`). */
export type Block=
 |{t:'p';text:string}
 |{t:'h';text:string}
 |{t:'note';text:string}
 |{t:'warn';text:string}
 |{t:'rows';rows:readonly (readonly [de:string,tr:string])[];who?:string;all?:boolean}
 |{t:'talk';lines:readonly (Line&{from?:string})[]}
 |{t:'table';head:readonly string[];rows:readonly (readonly string[])[];say?:readonly string[]}
 |{t:'checks';items:readonly QuickCheck[];title?:string}
 |{t:'cards';words:readonly Word[]}
 |{t:'list';words:readonly ListWord[]}
 |{t:'pic';src:string;width:number;height:number;alt:string}
 /** Small ads (Teil C): the thing, its price, its details and the city, all German; a tap reads `say`. */
 |{t:'ads';items:readonly {thing:string;price:string;details:string;city:string;say:string}[]};

/** One item of a quiz: a picture (or emoji), a prompt and/or something to listen to; the first option is right. */
export type QuizItem={prompt?:string;pic?:string;emoji?:string;listen?:SayItem;options:string[];say?:string};
/** One row to write: what is given (German, or a Turkish text through `T`), a picture or emoji, the accepted answers and what is read. */
export type WriteRow={given:string;pic?:string;emoji?:string;answers:string[];say:string};
/** The learner's own sentence: a question, the pattern it must fit (normalizeLoose text) and an example. */
export type OwnPrompt={question:string;pattern:RegExp;placeholder:string;optional?:boolean};
export type Exercise=
 |{type:'quiz';items:readonly QuizItem[]}
 |{type:'choice';lines:readonly ChoiceLine[];bankLead?:string;dialogue?:boolean;listen?:readonly SayItem[]}
 |{type:'gaps';lines:GapLine[];say:SayItem[];cells?:boolean;wide?:boolean;exact?:boolean;choices?:string[];bank?:boolean}
 |{type:'write';rows:readonly WriteRow[]}
 |{type:'own';key:string;prompts:readonly OwnPrompt[]};

/** A test question: question, options (the first is right), what is read after the answer ('' for none) and maybe a listen item. */
export type TestQuestion=readonly [question:string,options:string[],answer:string,say:string,listen?:SayItem];
/** A row of Konuş: someone asks, the learner answers (their own sentence when `own` points at one that fits). */
export type SpeakRow={who:string;question:string;answer:string;own?:{key:string;index:number;pattern:RegExp}};

/** A step of Lektion 3 with what it shows. */
export type OrteStep=Step&{
 kicker?:string;heading?:string;lead?:string;blocks?:readonly Block[];after?:readonly Block[];
 exercise?:Exercise;test?:readonly TestQuestion[];speak?:readonly SpeakRow[];
 cover?:{intro:string;learn:readonly string[];cast:readonly string[]};
 end?:{can:readonly string[];summary:string;next?:{part:PartId;title:string}};
};
export type PartId='a'|'b'|'c'|'d';
/** A part of Lektion 3: Teil A–D. */
export type OrtePart={id:PartId;badge:string;title:string;lead:string;cover:{src:string;width:number;height:number};coverAlt:string;steps:readonly OrteStep[];short:Record<string,string>;testNote?:string};

/* ---------- small helpers for the parts ---------- */
export const check=(q:string,options:string[],say=options[0]):QuickCheck=>({q,options,say});
/** A German sentence with its meaning (the meaning through `T`). */
export const row=(de:string,tr:string)=>[de,T(tr)] as const;
/** A word of a list (meanings through `T`). */
export const listWord=(de:string,tr:string,example:string,exampleTr:string):ListWord=>[de,T(tr),example,T(exampleTr)];
/** A dialogue line (the meaning through `T`). */
export const line=(who:string,de:string,tr:string,from?:string):Line&{from?:string}=>({who,de,tr:T(tr),...(from?{from:T(from)}:{})});
/** What a word card reads: "der Tisch, die Tische", or the word alone. */
export const wordSay=(word:Word)=>word.say??(word.plural?word.de+', die '+word.plural:word.de);
/** The sentence a choice line makes once every gap is right. */
export const lineText=(line:ChoiceLine)=>line.parts.map(part=>typeof part==='string'?part:part.answer).join('');
/** A choice line whose finished sentence is read (by `who` when it has one). */
export function choiceLine(key:string,parts:ChoiceLine['parts'],who?:string,prompt?:string):ChoiceLine{
 const line:ChoiceLine={key,parts,...(who?{who}:{}),...(prompt?{prompt}:{})};
 return {...line,say:who?{text:lineText(line),who}:lineText(line)};
}
const gapsOf=(lines:readonly ChoiceLine[])=>lines.reduce((n,item)=>n+item.parts.filter(part=>typeof part!=='string').length,0);
/** The points of an exercise: one per gap, item, row or required sentence. */
export function exerciseTotal(exercise:Exercise){
 switch(exercise.type){
  case 'quiz':return exercise.items.length;
  case 'choice':return gapsOf(exercise.lines);
  case 'gaps':return exercise.lines.reduce((n,item)=>n+item.answers.length,0);
  case 'write':return exercise.rows.length;
  case 'own':return exercise.prompts.filter(prompt=>!prompt.optional).length;
 }
}
/** The scored steps of a part: the exercises and the test. */
export function partScored(part:OrtePart):{id:string;total:number}[]{
 return part.steps.flatMap(step=>step.exercise?[{id:step.id,total:exerciseTotal(step.exercise)}]:step.test?[{id:step.id,total:step.test.length}]:[]);
}
