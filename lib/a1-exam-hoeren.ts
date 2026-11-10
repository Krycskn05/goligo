import type {A1HoerenExam,AudioLine,HoerenExam} from './a1-exam-types';
import {exam as h01} from './a1-exam-hoeren-01';
import {exam as h02} from './a1-exam-hoeren-02';
import {exam as h03} from './a1-exam-hoeren-03';
import {exam as h04} from './a1-exam-hoeren-04';
import {exam as h05} from './a1-exam-hoeren-05';
import {exam as h06} from './a1-exam-hoeren-06';
import {exam as h07} from './a1-exam-hoeren-07';
import {exam as h08} from './a1-exam-hoeren-08';
import {exam as h09} from './a1-exam-hoeren-09';
import {exam as h10} from './a1-exam-hoeren-10';
import {spellSpeechTexts} from './a1-exam-spell';

/**
 * All ten Hören exams of A1 sınavı at once — for the voices (scripts/voices/list-texts.cjs renders every spoken line
 * with the site's natural voices) and the tests. The pages never load this file: an exam is loaded alone when the
 * learner opens it (lib/a1-exam-course.ts `loadHoerenExam`).
 */
export const hoerenExams:readonly A1HoerenExam[]=[h01,h02,h03,h04,h05,h06,h07,h08,h09,h10];
/** Every spoken text of a Hören exam: the examples and the 15 items. */
export function hoerenBlocks(hoeren:HoerenExam):readonly {lines:readonly AudioLine[]}[]{
 return [hoeren.teil1.example,...hoeren.teil1.items,hoeren.teil2.example,...hoeren.teil2.items,...hoeren.teil3.items];
}
/** Every German line the Hören exams and the spelling practice (lib/a1-exam-spell.ts) read aloud, as the voice reads
 * it (for the natural site voices). */
export function a1ExamSpeechTexts():string[]{
 const texts=new Set<string>();
 for(const exam of hoerenExams)for(const block of hoerenBlocks(exam.hoeren))for(const line of block.lines)texts.add(line.say??line.text);
 for(const text of spellSpeechTexts())texts.add(text);
 return [...texts];
}
