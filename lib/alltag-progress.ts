import {starsFor,stageFor,lessonItems,type TopicProgress} from './progress-core';
import {alltagParts,alltagScored,alltagPartOrder} from './alltag-course';
import type {PartId} from './alltag-types';
import type {L1AScoreMap} from './willkommen-progress';

/**
 * Lektion 5 „Alltag und Freizeit“ keeps its scores in the browser, like Lektion 3 (lib/orte-progress.ts): the best result of every
 * scored exercise of a part, by step id. The keys travel with the account (lib/lesson-sync.ts, lesson `l5`); the
 * learner's own sentences (`lernkoko-l5a-own` …) stay on the device.
 */
export const l5PartKeys:Record<PartId,{scores:string;step:string}>={
 a:{scores:'lernkoko-l5a-scores',step:'lernkoko-l5a-step'},b:{scores:'lernkoko-l5b-scores',step:'lernkoko-l5b-step'},
 c:{scores:'lernkoko-l5c-scores',step:'lernkoko-l5c-step'},d:{scores:'lernkoko-l5d-scores',step:'lernkoko-l5d-step'},
};
/** The part the learner opened last. */
export const L5_PART_KEY='lernkoko-l5-part';
/** What the percentages count: the scored exercises, the teaching steps and Konuş (lib/progress-core.ts `lessonItems`). */
export const l5PartCounted:Record<PartId,{id:string;total:number}[]>={
 a:lessonItems(alltagScored.a,alltagParts.a.steps),b:lessonItems(alltagScored.b,alltagParts.b.steps),c:lessonItems(alltagScored.c,alltagParts.c.steps),d:lessonItems(alltagScored.d,alltagParts.d.steps),
};

export function readL5Scores(part:PartId):L1AScoreMap{
 try{const value=JSON.parse(localStorage.getItem(l5PartKeys[part].scores)??'{}');return value&&typeof value==='object'?value as L1AScoreMap:{};}catch{return {};}
}
/** Keeps the best result of an exercise. */
export function saveL5Score(part:PartId,id:string,right:number,total:number){
 const scores=readL5Scores(part);const old=scores[id];
 if(!old||right>old.right)scores[id]={right,total};
 try{localStorage.setItem(l5PartKeys[part].scores,JSON.stringify(scores));}catch{}
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
export function partProgressL5(part:PartId,scores:L1AScoreMap):TopicProgress{return progressOf(l5PartCounted[part],scores);}
/** Lektion 5 as a whole (the unit card on Üniteler). */
export function lessonFiveProgress(all:Partial<Record<PartId,L1AScoreMap>>):TopicProgress{
 const list=alltagPartOrder.flatMap(part=>l5PartCounted[part].map(exercise=>({id:part+':'+exercise.id,total:exercise.total})));
 const scores:L1AScoreMap={};
 for(const part of alltagPartOrder)for(const [id,score] of Object.entries(all[part]??{}))scores[part+':'+id]=score;
 return progressOf(list,scores);
}
export function readLessonFiveProgress():TopicProgress{return lessonFiveProgress({a:readL5Scores('a'),b:readL5Scores('b'),c:readL5Scores('c'),d:readL5Scores('d')});}
