import {starsFor,stageFor,type TopicProgress} from './progress';
import {berufeScored} from './berufe-course';
import {berufeScoredB} from './berufe-b-course';
import type {L1AScoreMap} from './willkommen-progress';

/**
 * Lektion 2 „Berufe“ keeps its scores in the browser, like Lektion 15 (lib/stadt-progress.ts): the best result of every
 * scored exercise of a part, by step id. Teil A and B since 2 November 2026; C–D come later. The keys travel with the account
 * (lib/lesson-sync.ts, lesson `l2`).
 */
export type L2PartId='a'|'b';
export const L2A_SCORES_KEY='lernkoko-l2a-scores';
export const L2A_STEP_KEY='lernkoko-l2a-step';
export const L2B_SCORES_KEY='lernkoko-l2b-scores';
export const L2B_STEP_KEY='lernkoko-l2b-step';
/** The part the learner opened last. */
export const L2_PART_KEY='lernkoko-l2-part';
export const l2PartKeys:Record<L2PartId,{scores:string;step:string}>={a:{scores:L2A_SCORES_KEY,step:L2A_STEP_KEY},b:{scores:L2B_SCORES_KEY,step:L2B_STEP_KEY}};
export const l2PartScored:Record<L2PartId,{id:string;total:number}[]>={a:berufeScored,b:berufeScoredB};

export function readL2Scores(part:L2PartId):L1AScoreMap{
 try{const value=JSON.parse(localStorage.getItem(l2PartKeys[part].scores)??'{}');return value&&typeof value==='object'?value as L1AScoreMap:{};}catch{return {};}
}
/** Keeps the best result of an exercise. */
export function saveL2Score(part:L2PartId,id:string,right:number,total:number){
 const scores=readL2Scores(part);const old=scores[id];
 if(!old||right>old.right)scores[id]={right,total};
 try{localStorage.setItem(l2PartKeys[part].scores,JSON.stringify(scores));}catch{}
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
export function partProgressL2(part:L2PartId,scores:L1AScoreMap):TopicProgress{return progressOf(l2PartScored[part],scores);}
/** Lektion 2 as a whole (the unit card on Üniteler): every scored exercise of every part that has a lesson. */
export function lessonTwoProgress(all:Partial<Record<L2PartId,L1AScoreMap>>):TopicProgress{
 const parts=Object.keys(l2PartScored) as L2PartId[];
 const list=parts.flatMap(part=>l2PartScored[part].map(exercise=>({id:part+':'+exercise.id,total:exercise.total})));
 const scores:L1AScoreMap={};
 for(const part of parts)for(const [id,score] of Object.entries(all[part]??{}))scores[part+':'+id]=score;
 return progressOf(list,scores);
}
export function readLessonTwoProgress():TopicProgress{return lessonTwoProgress({a:readL2Scores('a'),b:readL2Scores('b')});}
