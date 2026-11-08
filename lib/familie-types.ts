/**
 * Lektion 4 „Familie“ (A1.1): the same data shapes as Lektion 3 (lib/orte-types.ts — words, blocks, exercises, tests,
 * Konuş), drawn by app/familie-steps.tsx, with Lektion 4's own set of Turkish texts so the packs (lib/unit-packs/*.json,
 * tests/familie.test.cjs) can be checked apart. Written in our own words after the topics of the learner's textbook and
 * the handouts and board of the course (the learner asked, 8 November 2026: the site's people, no names or texts of the
 * book). Step ids never change: saved scores are keyed by them.
 */
import type {Line} from './willkommen-b-course';
import type {ChoiceGap} from './stadt-course';
import type {ListWord} from './orte-types';
export type {Word,ListWord,QuickCheck,Block,QuizItem,WriteRow,OwnPrompt,Exercise,TestQuestion,SpeakRow,PartId} from './orte-types';
export type {OrteStep as FamilieStep,OrtePart as FamiliePart} from './orte-types';
export {check,choiceLine,wordSay,lineText,exerciseTotal,partScored} from './orte-types';

/** Every Turkish text of Lektion 4's data (filled while the parts load). */
export const familieTurkish=new Set<string>();
/** A Turkish text of Lektion 4: shown in the page's language through the unit packs. */
export function T(text:string){familieTurkish.add(text);return text;}
/** A German sentence with its meaning (the meaning through `T`). */
export const row=(de:string,tr:string)=>[de,T(tr)] as const;
/** A word of a list (meanings through `T`). */
export const listWord=(de:string,tr:string,example:string,exampleTr:string):ListWord=>[de,T(tr),example,T(exampleTr)];
/** A dialogue line (the meaning through `T`). */
export const line=(who:string,de:string,tr:string,from?:string):Line&{from?:string}=>({who,de,tr:T(tr),...(from?{from:T(from)}:{})});
/** A choice inside a sentence: the options and the right one. */
export const gap=(options:readonly string[],answer:string):ChoiceGap=>({options,answer});
