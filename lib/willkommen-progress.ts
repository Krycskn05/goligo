import {starsFor,stageFor,type TopicProgress} from './progress';
import {scoredExercises} from './willkommen-course';
import {scoredExercisesB} from './willkommen-b-course';
import {scoredExercisesC} from './willkommen-c-course';
import {scoredExercisesD} from './willkommen-d-course';

/** Lektion 1's parts (Teil A since 24 October, Teil B, C and D since 25 October 2026). */
export type L1PartId='a'|'b'|'c'|'d';
/** Scores of a part, kept in the browser (right answers of every scored exercise, by step id). */
export type L1AScoreMap=Record<string,{right:number;total:number}>;
export const L1A_SCORES_KEY='lernkoko-l1a-scores';
export const L1A_STEP_KEY='lernkoko-l1a-step';
export const L1B_SCORES_KEY='lernkoko-l1b-scores';
export const L1B_STEP_KEY='lernkoko-l1b-step';
export const L1C_SCORES_KEY='lernkoko-l1c-scores';
export const L1C_STEP_KEY='lernkoko-l1c-step';
export const L1D_SCORES_KEY='lernkoko-l1d-scores';
export const L1D_STEP_KEY='lernkoko-l1d-step';
/** The part the learner opened last ("Kaldığın yerden devam et" on the contents page). */
export const L1_PART_KEY='lernkoko-l1-part';
export const partKeys:Record<L1PartId,{scores:string;step:string}>={a:{scores:L1A_SCORES_KEY,step:L1A_STEP_KEY},b:{scores:L1B_SCORES_KEY,step:L1B_STEP_KEY},c:{scores:L1C_SCORES_KEY,step:L1C_STEP_KEY},d:{scores:L1D_SCORES_KEY,step:L1D_STEP_KEY}};
export const partScored:Record<L1PartId,{id:string;total:number}[]>={a:scoredExercises,b:scoredExercisesB,c:scoredExercisesC,d:scoredExercisesD};

export function readPartScores(part:L1PartId):L1AScoreMap{
 try{const value=JSON.parse(localStorage.getItem(partKeys[part].scores)??'{}');return value&&typeof value==='object'?value as L1AScoreMap:{};}catch{return {};}
}
/** Keeps the best result of an exercise. */
export function savePartScore(part:L1PartId,id:string,right:number,total:number){
 const scores=readPartScores(part);const old=scores[id];
 if(!old||right>old.right)scores[id]={right,total};
 try{localStorage.setItem(partKeys[part].scores,JSON.stringify(scores));}catch{}
 return scores;
}
export const readL1AScores=()=>readPartScores('a');
export const saveL1AScore=(id:string,right:number,total:number)=>savePartScore('a',id,right,total);

const ratio=(part:number,total:number)=>total?Math.round(part/total*100):0;
function progressOf(list:readonly {id:string;total:number}[],scores:L1AScoreMap):TopicProgress{
 let total=0,tried=0,learned=0;
 for(const exercise of list){
  total+=exercise.total;const score=scores[exercise.id];if(!score)continue;
  tried+=exercise.total;learned+=Math.max(0,Math.min(exercise.total,score.right));
 }
 const percent=ratio(learned,total);
 return {total,tried,learned,percent,triedPercent:Math.max(percent,ratio(tried,total)),stars:starsFor(percent),stage:stageFor(percent,tried)};
}
/** Teil A's progress: answers given and answers right. */
export function willkommenProgress(scores:L1AScoreMap):TopicProgress{return progressOf(scoredExercises,scores);}
/** One part's progress (its notebook page and its row on the contents page). */
export function partProgressL1(part:L1PartId,scores:L1AScoreMap):TopicProgress{return progressOf(partScored[part],scores);}
/** Lektion 1 as a whole (the unit card on Üniteler and the contents page): every scored exercise of every part. */
export function lessonOneProgress(all:Partial<Record<L1PartId,L1AScoreMap>>):TopicProgress{
 const list=(Object.keys(partScored) as L1PartId[]).flatMap(part=>partScored[part].map(exercise=>({id:part+':'+exercise.id,total:exercise.total})));
 const scores:L1AScoreMap={};
 for(const part of Object.keys(partScored) as L1PartId[])for(const [id,score] of Object.entries(all[part]??{}))scores[part+':'+id]=score;
 return progressOf(list,scores);
}
export function readLessonOneProgress():TopicProgress{return lessonOneProgress({a:readPartScores('a'),b:readPartScores('b'),c:readPartScores('c'),d:readPartScores('d')});}
