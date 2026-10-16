import type {Question} from './course';
import type {Review,Session,SessionSummary} from './study';
import {verbs,verbMap,verbQuestions,type Verb,type VerbTask} from './verb-course';
import {verbFamilies,verbFamilyOf,type VerbFamily} from './verb-families';
import {isVerbExercise} from './verb-practice';

/**
 * Fiil Atölyesi: one path through all 38 verbs in two parts (the textbook order, split at
 * the learner's line). Each part has two stages: first the meanings of all its verbs, then
 * their Perfekt forms. Every verb gets a learning card before its steps of a stage, and each
 * step comes once: meanings → one test (choose the meaning), then spell it;
 * Perfekt → one test (choose the form), write it, then one step further: the meaning is shown and the
 * Perfekt is chosen among the Perfekt forms of other verbs. (No listening questions on the path.)
 * No part is locked: each part is its own saved round (mode `workshop`), so the learner can start
 * or continue any part; leaving and coming back continues it. Older rounds keep their own layout
 * (the whole path of 152 questions counts for part 1 and stops at its end; a part round of 76
 * questions, without the last Perfekt step, runs to its end) and their progress counts as it stands.
 */
export const WORKSHOP_TOPIC='verbs-all';
export const WORKSHOP_MODE='workshop';
export type LearnStage='meaning'|'praesens'|'perfekt';
export const pathStages:readonly LearnStage[]=['meaning','perfekt'];
export type WorkshopStep='meaning'|'write'|'perfekt'|'write-perfekt'|'meaning-perfekt';
export const meaningSteps:readonly WorkshopStep[]=['meaning','write'];
export const perfektSteps:readonly WorkshopStep[]=['perfekt','write-perfekt','meaning-perfekt'];
/** Rounds saved before the last Perfekt step was added have two Perfekt steps per verb. */
export const legacyPerfektSteps:readonly WorkshopStep[]=['perfekt','write-perfekt'];
const stepsFor=(stage:LearnStage,legacy=false):readonly WorkshopStep[]=>stage==='perfekt'?(legacy?legacyPerfektSteps:perfektSteps):meaningSteps;
export const stageSteps=(stage:LearnStage):readonly WorkshopStep[]=>stepsFor(stage);
/** The verbs in path order: part 1 first, then part 2. */
export const workshopVerbs:Verb[]=verbFamilies.flatMap(family=>family.verbs.map(id=>verbMap.get(id)!));
export const questionId=(step:WorkshopStep,verbId:string)=>'verb-'+step+'-'+verbId;
/** One stretch of the path: the questions of one stage of one part. */
export type PathSegment={family:VerbFamily;stage:LearnStage;start:number;count:number};
export function pathSegments(legacy=false):PathSegment[]{
 const out:PathSegment[]=[];let start=0;
 for(const family of verbFamilies)for(const stage of pathStages){const count=family.verbs.length*stepsFor(stage,legacy).length;out.push({family,stage,start,count});start+=count;}
 return out;
}
/** Every question of the path in order: part 1 meanings, part 1 Perfekt, part 2 meanings, part 2 Perfekt. */
export function workshopIds(legacy=false){return pathSegments(legacy).flatMap(segment=>segment.family.verbs.flatMap(id=>stepsFor(segment.stage,legacy).map(step=>questionId(step,id))));}
export const WORKSHOP_TOTAL=workshopIds().length;
/** The whole path as the first rounds saved it (152 questions, two Perfekt steps per verb). */
export const LEGACY_WORKSHOP_TOTAL=workshopIds(true).length;
/** Which learning card a task belongs to: meaning or Perfekt. */
export function learnStage(task:VerbTask|undefined):LearnStage{
 return task==='perfekt'||task==='write-perfekt'||task==='meaning-perfekt'||task==='hear-perfekt'?'perfekt':task==='praesens'||task==='write-praesens'||task==='hear-praesens'?'praesens':'meaning';
}
export function stepIndex(task:VerbTask|undefined){return stageSteps(learnStage(task)).indexOf(task as WorkshopStep);}
export type PathPlace={verb:Verb;family:VerbFamily;verbNumber:number;step:number;steps:readonly WorkshopStep[];chapterStart:boolean;stageStart:boolean;stage:LearnStage};
/** Whether a saved round has the older layout (two Perfekt steps per verb): the whole path of 152, or a part of 76. */
export function isLegacyRound(questions:readonly unknown[]){return questions.length===LEGACY_WORKSHOP_TOTAL||verbFamilies.some(family=>questions.length===partTotal(family,true)&&questions.length!==partTotal(family));}
/** Where a question of the path sits: the verb, its part and stage, and whether a card comes first. */
export function pathPlace(questions:readonly {id:string}[],index:number,lookup:(id:string)=>Question|undefined):PathPlace|null{
 const q=lookup(questions[index]?.id??'');const verb=q?.verbId?verbMap.get(q.verbId):undefined;const family=verb?verbFamilyOf(verb.id):undefined;
 if(!q||!verb||!family)return null;
 const previous=index>0?lookup(questions[index-1].id):undefined;
 const stage=learnStage(q.verbTask);const previousStage=previous?learnStage(previous.verbTask):null;
 const stageStart=!previous||previous.verbId!==verb.id||previousStage!==stage;
 const chapterStart=!previous||!previous.verbId||verbFamilyOf(previous.verbId)?.id!==family.id||previousStage!==stage;
 return {verb,family,verbNumber:family.verbs.indexOf(verb.id)+1,step:stepIndex(q.verbTask),steps:stepsFor(stage,isLegacyRound(questions)),chapterStart,stageStart,stage};
}
/** One part's questions in order: its meanings, then its Perfekt; segment starts count from the part's first question. */
export function partSegments(family:VerbFamily,legacy=false):PathSegment[]{
 let start=0;return pathStages.map(stage=>{const count=family.verbs.length*stepsFor(stage,legacy).length;const segment={family,stage,start,count};start+=count;return segment;});
}
export function partIds(family:VerbFamily,legacy=false){return partSegments(family,legacy).flatMap(segment=>family.verbs.flatMap(id=>stepsFor(segment.stage,legacy).map(step=>questionId(step,id))));}
export function partTotal(family:VerbFamily,legacy=false){return partSegments(family,legacy).reduce((n,segment)=>n+segment.count,0);}
/** How far one part is from the questions answered in it: the stage, the verbs done in it and the next verb. */
export function partProgress(family:VerbFamily,answered:number){
 const segments=partSegments(family);const count=partTotal(family);const done=Math.max(0,Math.min(count,answered));
 const current=segments.find(segment=>done<segment.start+segment.count)??segments[segments.length-1];
 const perVerb=stageSteps(current.stage).length;const within=Math.max(0,Math.min(done,current.start+current.count)-current.start);
 const stageVerbs=family.verbs.length;const stageVerbsDone=Math.min(stageVerbs,Math.floor(within/perVerb));
 const stageDone=(stage:LearnStage)=>{const segment=segments.find(item=>item.stage===stage);if(!segment)return 0;return Math.max(0,Math.min(stageVerbs,Math.floor((done-segment.start)/stageSteps(stage).length)));};
 return {done,count,percent:Math.round(done/Math.max(1,count)*100),finished:done>=count,started:done>0,stage:current.stage,stageVerbsDone,stageVerbs,nextVerbId:family.verbs[Math.min(stageVerbs-1,stageVerbsDone)],meaningDone:stageDone('meaning'),perfektDone:stageDone('perfekt')};
}
type RoundSummary=Pick<SessionSummary,'id'|'mode'|'topic'|'total'|'answered'|'finished_at'>&{first?:string|null};
/** The part a saved workshop round belongs to: a part round (by its first question), or an older round of the whole path (part 1). */
export function sessionPart(session:RoundSummary):VerbFamily|undefined{
 if(session.mode!==WORKSHOP_MODE||!session.topic.startsWith('verbs-'))return undefined;
 if(session.total===LEGACY_WORKSHOP_TOTAL||session.total===WORKSHOP_TOTAL)return verbFamilies[0];
 return verbFamilies.find(family=>(session.total===partTotal(family)||session.total===partTotal(family,true))&&session.first===partIds(family)[0]);
}
/** Questions answered in a part, counted in the current layout: an older round (two Perfekt steps per verb)
 * counts each finished verb as three steps, and the whole-path round only up to part 1's end. */
export function partAnswered(session:RoundSummary|null|undefined,family:VerbFamily){
 if(!session)return 0;
 if(session.total===partTotal(family))return Math.min(session.answered,partTotal(family));
 const answered=Math.min(session.answered,partTotal(family,true));const [meaning]=partSegments(family,true);
 if(answered<=meaning.count)return answered;
 const rest=answered-meaning.count;const oldPerVerb=legacyPerfektSteps.length;
 return meaning.count+Math.floor(rest/oldPerVerb)*perfektSteps.length+rest%oldPerVerb;
}
/** The saved round of a part: the newest one still open, else the newest one. */
export function findPartSession<T extends RoundSummary>(sessions:readonly T[],family:VerbFamily):T|null{
 const mine=sessions.filter(session=>sessionPart(session)?.id===family.id);
 return mine.find(session=>!session.finished_at&&partAnswered(session,family)<partTotal(family))??mine[0]??null;
}
/** Every part with its saved round and progress. */
export function partsStatus<T extends RoundSummary>(sessions:readonly T[]){
 return verbFamilies.map(family=>{const session=findPartSession(sessions,family);return {family,session,...partProgress(family,partAnswered(session,family))};});
}
/** The part to continue: the open part practised last, else the first part not finished, else part 1. */
export function currentPart<T extends RoundSummary>(sessions:readonly T[]){
 const parts=partsStatus(sessions);
 for(const session of sessions){const part=parts.find(item=>item.session?.id===session.id);if(part&&!part.finished)return part;}
 return parts.find(part=>!part.finished)??parts[0];
}
/** For every verb: whether its meanings and its Perfekt are done (for the sticker collection). */
export function verbStatus<T extends RoundSummary>(sessions:readonly T[]){
 const status=new Map<string,{meaning:boolean;perfekt:boolean}>();
 for(const part of partsStatus(sessions)){
  const [meaning,perfekt]=partSegments(part.family);
  part.family.verbs.forEach((id,i)=>status.set(id,{meaning:part.done>=meaning.start+(i+1)*meaningSteps.length,perfekt:part.done>=perfekt.start+(i+1)*perfektSteps.length}));
 }
 return status;
}
/** Only a saved round of this part can be continued: the current layout, the older part layout, or (part 1) the older whole path. */
export function isPartRound(session:Pick<Session,'mode'|'questions'>,family:VerbFamily){
 if(session.mode!==WORKSHOP_MODE)return false;
 const n=session.questions.length;
 const ids=n===LEGACY_WORKSHOP_TOTAL&&family.id===verbFamilies[0].id?workshopIds(true):n===partTotal(family,true)?partIds(family,true):partIds(family);
 return n===ids.length&&session.questions.every((item,index)=>item.id===ids[index]);
}
/** Where a round ends: an older whole-path round stops after part 1; other rounds at their last question. */
export function roundEnd(session:Pick<Session,'mode'|'questions'>){
 return session.mode===WORKSHOP_MODE&&session.questions.length===LEGACY_WORKSHOP_TOTAL?partTotal(verbFamilies[0],true):session.questions.length;
}
export function exerciseCount(){return verbQuestions.filter(isVerbExercise).length;}
export function workshopMistakes(session:Pick<Session,'answers'>,lookup:(id:string)=>Question|undefined){
 return session.answers.filter(answer=>!answer.correct).map(answer=>lookup(answer.question_id)).filter((q):q is Question=>!!q);
}
export function reviewRows(reviews:readonly Review[]){return new Map(reviews.map(row=>[row.question_id,row]));}
export {verbs};
