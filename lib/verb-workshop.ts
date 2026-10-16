import type {Question} from './course';
import type {Review,Session,SessionSummary} from './study';
import {verbs,verbMap,verbQuestions,type Verb,type VerbTask} from './verb-course';
import {verbFamilies,verbFamilyOf,type VerbFamily} from './verb-families';
import {isVerbExercise} from './verb-practice';

/**
 * Fiil Atölyesi: one path through all 38 verbs in two parts (the textbook order, split at
 * the learner's line). Each verb is finished in one go: its meaning steps, then at once its
 * Perfekt steps, then the next verb. Every verb gets a learning card before its steps of a
 * stage, and each step comes once: meaning → one test (choose the meaning), then spell it;
 * Perfekt → one test (choose the form), write it, then one step further: the meaning is shown and the
 * Perfekt is chosen among the Perfekt forms of other verbs. (No listening questions on the path.)
 * No part is locked: each part is its own saved round (mode `workshop`), so the learner can start
 * or continue any part; leaving and coming back continues it.
 * Every round is read from its own list of questions, so older rounds still count: `stage` rounds
 * (95 questions) did all meanings of a part first and then all its Perfekt forms; `legacy` rounds did
 * the same with two Perfekt steps per verb (a part of 76 questions, or the whole path of 152, which
 * counts for part 1 and stops at its end). Such a round is not continued in its old order: the part
 * goes on in a new round with the questions still left, verb by verb (`continuationIds`), and the
 * questions missing from that round count as done.
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
/** How a round orders its questions: `verb` (each verb whole: meaning, then Perfekt), `stage` (all meanings, then all Perfekt), `legacy` (stages, two Perfekt steps). */
export type RoundLayout='verb'|'stage'|'legacy';
const stepsFor=(stage:LearnStage,layout:RoundLayout='verb'):readonly WorkshopStep[]=>stage==='perfekt'?(layout==='legacy'?legacyPerfektSteps:perfektSteps):meaningSteps;
export const stageSteps=(stage:LearnStage):readonly WorkshopStep[]=>stepsFor(stage);
/** All steps of one verb in the current layout: its meaning steps, then its Perfekt steps. */
export const verbSteps:readonly WorkshopStep[]=[...meaningSteps,...perfektSteps];
/** The verbs in path order: part 1 first, then part 2. */
export const workshopVerbs:Verb[]=verbFamilies.flatMap(family=>family.verbs.map(id=>verbMap.get(id)!));
export const questionId=(step:WorkshopStep,verbId:string)=>'verb-'+step+'-'+verbId;
const questionById=new Map(verbQuestions.map(q=>[q.id,q]));
/** One stretch of a staged round: the questions of one stage of one part; starts count from the part's first question. */
export type PathSegment={family:VerbFamily;stage:LearnStage;start:number;count:number};
export function partSegments(family:VerbFamily,layout:RoundLayout='stage'):PathSegment[]{
 let start=0;return pathStages.map(stage=>{const count=family.verbs.length*stepsFor(stage,layout).length;const segment={family,stage,start,count};start+=count;return segment;});
}
/** One part's questions in order: verb by verb (meaning, then Perfekt); staged layouts: its meanings, then its Perfekt. */
export function partIds(family:VerbFamily,layout:RoundLayout='verb'){
 if(layout==='verb')return family.verbs.flatMap(id=>verbSteps.map(step=>questionId(step,id)));
 return partSegments(family,layout).flatMap(segment=>family.verbs.flatMap(id=>stepsFor(segment.stage,layout).map(step=>questionId(step,id))));
}
export function partTotal(family:VerbFamily,layout:RoundLayout='verb'){return partIds(family,layout).length;}
/** Every question of the path in order: part 1, then part 2. */
export function workshopIds(layout:RoundLayout='verb'){return verbFamilies.flatMap(family=>partIds(family,layout));}
export const WORKSHOP_TOTAL=workshopIds().length;
/** The whole path as the first rounds saved it (152 questions, two Perfekt steps per verb). */
export const LEGACY_WORKSHOP_TOTAL=workshopIds('legacy').length;
/** Which learning card a task belongs to: meaning or Perfekt. */
export function learnStage(task:VerbTask|undefined):LearnStage{
 return task==='perfekt'||task==='write-perfekt'||task==='meaning-perfekt'||task==='hear-perfekt'?'perfekt':task==='praesens'||task==='write-praesens'||task==='hear-praesens'?'praesens':'meaning';
}
export function stepIndex(task:VerbTask|undefined){return stageSteps(learnStage(task)).indexOf(task as WorkshopStep);}
type RoundQuestions=readonly {id?:string}[];
const idsOf=(questions:RoundQuestions)=>questions.map(q=>q.id??'');
const sameIds=(a:readonly string[],b:readonly string[])=>a.length===b.length&&a.every((id,i)=>id===b[i]);
/** The layout of a saved round, read from its questions: an older staged order (all meanings first), else verb by verb. */
export function roundLayout(questions:RoundQuestions):RoundLayout{
 const ids=idsOf(questions);
 if(sameIds(ids,workshopIds('legacy')))return 'legacy';
 for(const family of verbFamilies){if(sameIds(ids,partIds(family,'legacy')))return 'legacy';if(sameIds(ids,partIds(family,'stage')))return 'stage';}
 return 'verb';
}
/** Whether a saved round still has an older order: all meanings of the part first, then its Perfekt forms. */
export function isStagedRound(questions:RoundQuestions){return roundLayout(questions)!=='verb';}
/** Whether a saved round has the oldest layout (two Perfekt steps per verb). */
export function isLegacyRound(questions:RoundQuestions){return roundLayout(questions)==='legacy';}
/** The family of a round: the part of its first verb (the older whole path starts with part 1). */
export function roundFamily(questions:RoundQuestions):VerbFamily|undefined{
 const first=questionById.get(questions[0]?.id??'');return first?.verbId?verbFamilyOf(first.verbId):undefined;
}
/** The questions of a part still to do after an older round: the part verb by verb, without what that round answered. */
export function continuationIds(family:VerbFamily,session:Pick<Session,'questions'|'answers'>){
 const done=new Set(session.answers.map(answer=>answer.question_id));
 const left=partIds(family).filter(id=>!done.has(id));
 return left.length?left:partIds(family);
}
export type PathPlace={verb:Verb;family:VerbFamily;verbNumber:number;step:number;steps:readonly WorkshopStep[];chapterStart:boolean;stageStart:boolean;stage:LearnStage;layout:RoundLayout};
/** Where a question of the path sits: the verb, its part and stage, and whether a card comes first.
 * The part card opens a part (in staged rounds, each stage of it); the learning card opens each verb's stage.
 * The steps shown are the steps of that stage the round still holds. */
export function pathPlace(questions:readonly {id:string}[],index:number,lookup:(id:string)=>Question|undefined):PathPlace|null{
 const q=lookup(questions[index]?.id??'');const verb=q?.verbId?verbMap.get(q.verbId):undefined;const family=verb?verbFamilyOf(verb.id):undefined;
 if(!q||!verb||!family)return null;
 const layout=roundLayout(questions);
 const previous=index>0?lookup(questions[index-1].id):undefined;
 const stage=learnStage(q.verbTask);const previousStage=previous?learnStage(previous.verbTask):null;
 const stageStart=!previous||previous.verbId!==verb.id||previousStage!==stage;
 const chapterStart=!previous||!previous.verbId||verbFamilyOf(previous.verbId)?.id!==family.id||(layout!=='verb'&&previousStage!==stage);
 const held=new Set(questions.map(item=>item.id));
 const steps=stepsFor(stage,layout).filter(step=>held.has(questionId(step,verb.id)));
 return {verb,family,verbNumber:family.verbs.indexOf(verb.id)+1,step:Math.max(0,steps.indexOf(q.verbTask as WorkshopStep)),steps:steps.length?steps:stepsFor(stage,layout),chapterStart,stageStart,stage,layout};
}
export type VerbMarks={meaning:boolean;perfekt:boolean};
/** A workshop round as the study API lists it: `ids` are the questions of an open round in order; a finished round carries only its first. */
type RoundSummary=Pick<SessionSummary,'id'|'mode'|'topic'|'total'|'answered'|'finished_at'>&{first?:string|null;ids?:readonly string[]|null};
/** The questions of a summarised round, in order: its list, or (without one) the layout its size and first question tell. */
export function summaryIds(session:RoundSummary):string[]{
 if(session.ids?.length)return [...session.ids];
 if(session.total===LEGACY_WORKSHOP_TOTAL)return workshopIds('legacy');
 const family=roundFamily([{id:session.first??''}]);
 if(!family)return [];
 return session.total===partTotal(family,'legacy')&&session.first===partIds(family,'legacy')[0]?partIds(family,'legacy'):partIds(family);
}
/** Questions answered in a round as its part counts them: a finished round counts whole; the whole-path round only up to part 1's end. */
const summaryAnswered=(session:RoundSummary)=>session.finished_at?Number.MAX_SAFE_INTEGER:session.answered;
/** How far one part is from the questions of its round and the count answered: what is done for every verb
 * (a question the round does not hold counts as done), the stage and the verb of the next question. */
export function partProgress(family:VerbFamily,ids:readonly string[],answered:number){
 const end=ids.length===LEGACY_WORKSHOP_TOTAL?partTotal(family,'legacy'):ids.length;
 const count=end;const done=Math.max(0,Math.min(count,answered));
 const held=new Set(ids.slice(0,end));const finishedIds=new Set(ids.slice(0,done));
 const isDone=(id:string)=>!held.has(id)||finishedIds.has(id);
 const marks:VerbMarks[]=family.verbs.map(id=>({meaning:meaningSteps.every(step=>isDone(questionId(step,id))),perfekt:perfektSteps.every(step=>isDone(questionId(step,id)))}));
 const meaningDone=marks.filter(mark=>mark.meaning).length;const perfektDone=marks.filter(mark=>mark.perfekt).length;
 const finished=done>=count;
 const next=finished?undefined:questionById.get(ids[done]);
 const stage=next?learnStage(next.verbTask):'perfekt';
 const nextVerbId=next?.verbId&&family.verbs.includes(next.verbId)?next.verbId:family.verbs[Math.min(family.verbs.length-1,perfektDone)];
 const stageVerbs=family.verbs.length;
 return {done,count,percent:Math.round(done/Math.max(1,count)*100),finished,started:done>0,stage,stageVerbsDone:stage==='perfekt'?perfektDone:meaningDone,stageVerbs,nextVerbId,meaningDone,perfektDone,marks,layout:roundLayout(ids.map(id=>({id})))};
}
/** The part a saved workshop round belongs to: the part of its first verb (an older round of the whole path: part 1). */
export function sessionPart(session:RoundSummary):VerbFamily|undefined{
 if(session.mode!==WORKSHOP_MODE||!session.topic.startsWith('verbs-'))return undefined;
 const ids=summaryIds(session);
 return ids.length?roundFamily(ids.map(id=>({id}))):undefined;
}
/** Questions answered in a round as its part counts them; the whole-path round only up to part 1's end. */
export function partAnswered(session:RoundSummary|null|undefined,family:VerbFamily){
 if(!session)return 0;
 return partProgress(family,summaryIds(session),summaryAnswered(session)).done;
}
/** The saved round of a part: its newest one (the rounds come newest first). An older round left open behind a
 * newer one — restarted, or carried on in the new order — no longer counts. */
export function findPartSession<T extends RoundSummary>(sessions:readonly T[],family:VerbFamily):T|null{
 return sessions.find(session=>sessionPart(session)?.id===family.id)??null;
}
/** Every part with its saved round and progress. */
export function partsStatus<T extends RoundSummary>(sessions:readonly T[]){
 return verbFamilies.map(family=>{const session=findPartSession(sessions,family);return {family,session,...partProgress(family,session?summaryIds(session):partIds(family),session?summaryAnswered(session):0)};});
}
/** The part to continue: the open part practised last, else the first part not finished, else part 1. */
export function currentPart<T extends RoundSummary>(sessions:readonly T[]){
 const parts=partsStatus(sessions);
 for(const session of sessions){const part=parts.find(item=>item.session?.id===session.id);if(part&&!part.finished)return part;}
 return parts.find(part=>!part.finished)??parts[0];
}
/** For every verb: whether its meanings and its Perfekt are done (for the sticker collection). */
export function verbStatus<T extends RoundSummary>(sessions:readonly T[]){
 const status=new Map<string,VerbMarks>();
 for(const part of partsStatus(sessions))part.family.verbs.forEach((id,i)=>status.set(id,part.marks[i]));
 return status;
}
/** Only a saved round of this part can be continued: its questions are the part's verbs (the older whole path counts for part 1). */
export function isPartRound(session:Pick<Session,'mode'|'questions'>,family:VerbFamily){
 if(session.mode!==WORKSHOP_MODE||!session.questions.length)return false;
 const n=session.questions.length;
 if(n===LEGACY_WORKSHOP_TOTAL)return family.id===verbFamilies[0].id&&sameIds(idsOf(session.questions),workshopIds('legacy'));
 const allowed=new Set(partIds(family));
 return session.questions.every(item=>allowed.has(item.id));
}
/** Where a round ends: an older whole-path round stops after part 1; other rounds at their last question. */
export function roundEnd(session:Pick<Session,'mode'|'questions'>){
 return session.mode===WORKSHOP_MODE&&session.questions.length===LEGACY_WORKSHOP_TOTAL?partTotal(verbFamilies[0],'legacy'):session.questions.length;
}
export function exerciseCount(){return verbQuestions.filter(isVerbExercise).length;}
export function workshopMistakes(session:Pick<Session,'answers'>,lookup:(id:string)=>Question|undefined){
 return session.answers.filter(answer=>!answer.correct).map(answer=>lookup(answer.question_id)).filter((q):q is Question=>!!q);
}
export function reviewRows(reviews:readonly Review[]){return new Map(reviews.map(row=>[row.question_id,row]));}
export {verbs};
