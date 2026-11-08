import {starsFor,stageFor,lessonItems,type TopicProgress} from './progress-core';
import {familieParts,familieScored,familiePartOrder} from './familie-course';
import type {PartId} from './familie-types';
import type {L1AScoreMap} from './willkommen-progress';

/**
 * Lektion 4 „Familie“ keeps its scores in the browser, like Lektion 3 (lib/orte-progress.ts): the best result of every
 * scored exercise of a part, by step id. The keys travel with the account (lib/lesson-sync.ts, lesson `l4`); the
 * learner's own sentences and the Elfchen (`lernkoko-l4a-own` …) stay on the device.
 */
export const l4PartKeys:Record<PartId,{scores:string;step:string}>={
 a:{scores:'lernkoko-l4a-scores',step:'lernkoko-l4a-step'},b:{scores:'lernkoko-l4b-scores',step:'lernkoko-l4b-step'},
 c:{scores:'lernkoko-l4c-scores',step:'lernkoko-l4c-step'},d:{scores:'lernkoko-l4d-scores',step:'lernkoko-l4d-step'},
};
/** The part the learner opened last. */
export const L4_PART_KEY='lernkoko-l4-part';
/** What the percentages count: the scored exercises, the teaching steps and Konuş (lib/progress-core.ts `lessonItems`). */
export const l4PartCounted:Record<PartId,{id:string;total:number}[]>={
 a:lessonItems(familieScored.a,familieParts.a.steps),b:lessonItems(familieScored.b,familieParts.b.steps),c:lessonItems(familieScored.c,familieParts.c.steps),d:lessonItems(familieScored.d,familieParts.d.steps),
};

export function readL4Scores(part:PartId):L1AScoreMap{
 try{const value=JSON.parse(localStorage.getItem(l4PartKeys[part].scores)??'{}');return value&&typeof value==='object'?value as L1AScoreMap:{};}catch{return {};}
}
/** Keeps the best result of an exercise. */
export function saveL4Score(part:PartId,id:string,right:number,total:number){
 const scores=readL4Scores(part);const old=scores[id];
 if(!old||right>old.right)scores[id]={right,total};
 try{localStorage.setItem(l4PartKeys[part].scores,JSON.stringify(scores));}catch{}
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
export function partProgressL4(part:PartId,scores:L1AScoreMap):TopicProgress{return progressOf(l4PartCounted[part],scores);}
/** Lektion 4 as a whole (the unit card on Üniteler). */
export function lessonFourProgress(all:Partial<Record<PartId,L1AScoreMap>>):TopicProgress{
 const list=familiePartOrder.flatMap(part=>l4PartCounted[part].map(exercise=>({id:part+':'+exercise.id,total:exercise.total})));
 const scores:L1AScoreMap={};
 for(const part of familiePartOrder)for(const [id,score] of Object.entries(all[part]??{}))scores[part+':'+id]=score;
 return progressOf(list,scores);
}
export function readLessonFourProgress():TopicProgress{return lessonFourProgress({a:readL4Scores('a'),b:readL4Scores('b'),c:readL4Scores('c'),d:readL4Scores('d')});}
