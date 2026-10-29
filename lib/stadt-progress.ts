import {starsFor,stageFor,type TopicProgress} from './progress';
import {scoredExercisesA} from './stadt-course';
import type {L1AScoreMap} from './willkommen-progress';

/**
 * Lektion 15 „Wege in der Stadt“ keeps its scores in the browser, like Lektion 1 (lib/willkommen-progress.ts):
 * the best result of every scored exercise of a part, by step id. Teil A since 30 October 2026; B–D come later.
 */
export type L15PartId='a';
export const L15A_SCORES_KEY='lernkoko-l15a-scores';
export const L15A_STEP_KEY='lernkoko-l15a-step';
/** The part the learner opened last. */
export const L15_PART_KEY='lernkoko-l15-part';
export const l15PartKeys:Record<L15PartId,{scores:string;step:string}>={a:{scores:L15A_SCORES_KEY,step:L15A_STEP_KEY}};
export const l15PartScored:Record<L15PartId,{id:string;total:number}[]>={a:scoredExercisesA};

export function readL15Scores(part:L15PartId):L1AScoreMap{
 try{const value=JSON.parse(localStorage.getItem(l15PartKeys[part].scores)??'{}');return value&&typeof value==='object'?value as L1AScoreMap:{};}catch{return {};}
}
/** Keeps the best result of an exercise. */
export function saveL15Score(part:L15PartId,id:string,right:number,total:number){
 const scores=readL15Scores(part);const old=scores[id];
 if(!old||right>old.right)scores[id]={right,total};
 try{localStorage.setItem(l15PartKeys[part].scores,JSON.stringify(scores));}catch{}
 return scores;
}

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
/** One part's progress (its notebook page and its row on the contents page). */
export function partProgressL15(part:L15PartId,scores:L1AScoreMap):TopicProgress{return progressOf(l15PartScored[part],scores);}
/** Lektion 15 as a whole (the unit card on Üniteler): every scored exercise of every part that has a lesson. */
export function lessonFifteenProgress(all:Partial<Record<L15PartId,L1AScoreMap>>):TopicProgress{
 const parts=Object.keys(l15PartScored) as L15PartId[];
 const list=parts.flatMap(part=>l15PartScored[part].map(exercise=>({id:part+':'+exercise.id,total:exercise.total})));
 const scores:L1AScoreMap={};
 for(const part of parts)for(const [id,score] of Object.entries(all[part]??{}))scores[part+':'+id]=score;
 return progressOf(list,scores);
}
export function readLessonFifteenProgress():TopicProgress{return lessonFifteenProgress({a:readL15Scores('a')});}
