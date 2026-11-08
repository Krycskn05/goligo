/**
 * Lektion 5 „Alltag und Freizeit“ (A1.1): the same data shapes as Lektion 3 and 4 (lib/orte-types.ts — words, blocks,
 * exercises, tests, Konuş), drawn by app/alltag-steps.tsx, with Lektion 5's own set of Turkish texts so the packs
 * (lib/unit-packs/*.json, tests/alltag.test.cjs) can be checked apart. Written in our own words after the topics of the
 * learner's Kursbuch and Arbeitsbuch (the learner asked, 8 November 2026: the same rules as before — the site's people,
 * no names or texts of the book, no topic skipped). Step ids never change: saved scores are keyed by them.
 */
import type {Line} from './willkommen-b-course';
import type {ChoiceGap} from './stadt-course';
import type {ListWord} from './orte-types';
export type {Word,ListWord,QuickCheck,Block,QuizItem,WriteRow,OwnPrompt,Exercise,TestQuestion,SpeakRow,PartId} from './orte-types';
export type {OrteStep as AlltagStep,OrtePart as AlltagPart} from './orte-types';
export {check,choiceLine,wordSay,lineText,exerciseTotal,partScored} from './orte-types';

/** Every Turkish text of Lektion 5's data (filled while the parts load). */
export const alltagTurkish=new Set<string>();
/** A Turkish text of Lektion 5: shown in the page's language through the unit packs. */
export function T(text:string){alltagTurkish.add(text);return text;}
/** A German sentence with its meaning (the meaning through `T`). */
export const row=(de:string,tr:string)=>[de,T(tr)] as const;
/** A word of a list (meanings through `T`). */
export const listWord=(de:string,tr:string,example:string,exampleTr:string):ListWord=>[de,T(tr),example,T(exampleTr)];
/** A dialogue line (the meaning through `T`). */
export const line=(who:string,de:string,tr:string,from?:string):Line&{from?:string}=>({who,de,tr:T(tr),...(from?{from:T(from)}:{})});
/** A choice inside a sentence: the options and the right one. */
export const gap=(options:readonly string[],answer:string):ChoiceGap=>({options,answer});
