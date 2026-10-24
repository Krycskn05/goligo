import {starsFor,stageFor,type TopicProgress} from './progress';
import {scoredExercises} from './willkommen-course';

/** Scores of Lektion 1A, kept in the browser (right answers of every scored exercise, by step id). */
export type L1AScoreMap=Record<string,{right:number;total:number}>;
export const L1A_SCORES_KEY='lernkoko-l1a-scores';
export const L1A_STEP_KEY='lernkoko-l1a-step';
export function readL1AScores():L1AScoreMap{
 try{const value=JSON.parse(localStorage.getItem(L1A_SCORES_KEY)??'{}');return value&&typeof value==='object'?value as L1AScoreMap:{};}catch{return {};}
}
/** Keeps the best result of an exercise. */
export function saveL1AScore(id:string,right:number,total:number){
 const scores=readL1AScores();const old=scores[id];
 if(!old||right>old.right)scores[id]={right,total};
 try{localStorage.setItem(L1A_SCORES_KEY,JSON.stringify(scores));}catch{}
 return scores;
}
const ratio=(part:number,total:number)=>total?Math.round(part/total*100):0;
/** The lesson's progress for the units page and the lesson's own bar: answers given and answers right. */
export function willkommenProgress(scores:L1AScoreMap):TopicProgress{
 let total=0,tried=0,learned=0;
 for(const exercise of scoredExercises){
  total+=exercise.total;const score=scores[exercise.id];if(!score)continue;
  tried+=exercise.total;learned+=Math.max(0,Math.min(exercise.total,score.right));
 }
 const percent=ratio(learned,total);
 return {total,tried,learned,percent,triedPercent:Math.max(percent,ratio(tried,total)),stars:starsFor(percent),stage:stageFor(percent,tried)};
}
