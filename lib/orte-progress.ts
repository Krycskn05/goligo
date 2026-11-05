import {starsFor,stageFor,lessonItems,type TopicProgress} from './progress-core';
import {orteParts,orteScored,ortePartOrder} from './orte-course';
import type {PartId} from './orte-types';
import type {L1AScoreMap} from './willkommen-progress';

/**
 * Lektion 3 „Orte und Dinge“ keeps its scores in the browser, like Lektion 2 (lib/berufe-progress.ts): the best result of
 * every scored exercise of a part, by step id. The keys travel with the account (lib/lesson-sync.ts, lesson `l3`); the
 * learner's own sentences (`lernkoko-l3a-own` …) stay on the device.
 */
export const l3PartKeys:Record<PartId,{scores:string;step:string}>={
 a:{scores:'lernkoko-l3a-scores',step:'lernkoko-l3a-step'},b:{scores:'lernkoko-l3b-scores',step:'lernkoko-l3b-step'},
 c:{scores:'lernkoko-l3c-scores',step:'lernkoko-l3c-step'},d:{scores:'lernkoko-l3d-scores',step:'lernkoko-l3d-step'},
};
/** The part the learner opened last. */
export const L3_PART_KEY='lernkoko-l3-part';
/** What the percentages count: the scored exercises, the teaching steps and Konuş (lib/progress-core.ts `lessonItems`). */
export const l3PartCounted:Record<PartId,{id:string;total:number}[]>={
 a:lessonItems(orteScored.a,orteParts.a.steps),b:lessonItems(orteScored.b,orteParts.b.steps),c:lessonItems(orteScored.c,orteParts.c.steps),d:lessonItems(orteScored.d,orteParts.d.steps),
};

export function readL3Scores(part:PartId):L1AScoreMap{
 try{const value=JSON.parse(localStorage.getItem(l3PartKeys[part].scores)??'{}');return value&&typeof value==='object'?value as L1AScoreMap:{};}catch{return {};}
}
/** Keeps the best result of an exercise. */
export function saveL3Score(part:PartId,id:string,right:number,total:number){
 const scores=readL3Scores(part);const old=scores[id];
 if(!old||right>old.right)scores[id]={right,total};
 try{localStorage.setItem(l3PartKeys[part].scores,JSON.stringify(scores));}catch{}
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
export function partProgressL3(part:PartId,scores:L1AScoreMap):TopicProgress{return progressOf(l3PartCounted[part],scores);}
/** Lektion 3 as a whole (the unit card on Üniteler). */
export function lessonThreeProgress(all:Partial<Record<PartId,L1AScoreMap>>):TopicProgress{
 const list=ortePartOrder.flatMap(part=>l3PartCounted[part].map(exercise=>({id:part+':'+exercise.id,total:exercise.total})));
 const scores:L1AScoreMap={};
 for(const part of ortePartOrder)for(const [id,score] of Object.entries(all[part]??{}))scores[part+':'+id]=score;
 return progressOf(list,scores);
}
export function readLessonThreeProgress():TopicProgress{return lessonThreeProgress({a:readL3Scores('a'),b:readL3Scores('b'),c:readL3Scores('c'),d:readL3Scores('d')});}
