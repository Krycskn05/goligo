import type {Question} from './course';
import type {Review,Session,SessionSummary} from './study';
import {verbs,verbMap,verbQuestions,type Verb,type VerbTask} from './verb-course';
import {verbFamilies,verbFamilyOf,type VerbFamily} from './verb-families';
import {isVerbExercise} from './verb-practice';

/**
 * Fiil Atölyesi: one path through all 38 verbs in two parts (the textbook order, split at
 * the learner's line). Each verb is finished in one go before the next one: its card with the
 * meaning, then the meaning test, then spelling it with letters, then its past form: the infinitive
 * is shown and the Partizip II is chosen (abfahren → abgefahren; no hat/ist, no other verbs), then spelled.
 * No part is locked: each part is its own saved round (mode `workshop`), so the learner can start
 * or continue any part; leaving and coming back continues it.
 * Rounds saved in an earlier order (all meanings first, Perfekt steps with hat/ist, or before a step was added) still count
 * from their own list of questions; they are not continued as they were: the part goes on in a new
 * round with the questions still left (`continuationIds`), and what that round leaves out counts as done.
 */
export const WORKSHOP_TOPIC='verbs-all';
export const WORKSHOP_MODE='workshop';
export type LearnStage='meaning'|'praesens'|'perfekt';
export type WorkshopStep='meaning'|'write'|'partizip'|'write-partizip';
export const meaningSteps:readonly WorkshopStep[]=['meaning','write'];
/** All steps of one verb: the meaning test, spelling, the past form, spelling the past form. */
export const verbSteps:readonly WorkshopStep[]=['meaning','write','partizip','write-partizip'];
/** Tasks that asked the past form, in this path or in older rounds. */
const pastTasks:readonly VerbTask[]=['partizip','write-partizip','perfekt','write-perfekt','meaning-perfekt'];
/** Every task a workshop round has ever held. */
const workshopTasks=new Set<string>([...verbSteps,...pastTasks]);
/** The verbs in path order: part 1 first, then part 2. */
export const workshopVerbs:Verb[]=verbFamilies.flatMap(family=>family.verbs.map(id=>verbMap.get(id)!));
export const questionId=(step:string,verbId:string)=>'verb-'+step+'-'+verbId;
const questionById=new Map(verbQuestions.map(q=>[q.id,q]));
/** One part's questions in order: verb by verb, each with its four steps. */
export function partIds(family:VerbFamily){return family.verbs.flatMap(id=>verbSteps.map(step=>questionId(step,id)));}
export function partTotal(family:VerbFamily){return partIds(family).length;}
/** Every question of the path in order: part 1, then part 2. */
export function workshopIds(){return verbFamilies.flatMap(family=>partIds(family));}
export const WORKSHOP_TOTAL=workshopIds().length;
/** The whole path as the first rounds saved it (152 questions): per part all meanings, then all Perfekt forms with hat/ist. */
export const legacyWorkshopIds=verbFamilies.flatMap(family=>[...family.verbs.flatMap(id=>['meaning','write'].map(step=>questionId(step,id))),...family.verbs.flatMap(id=>['perfekt','write-perfekt'].map(step=>questionId(step,id)))]);
export const LEGACY_WORKSHOP_TOTAL=legacyWorkshopIds.length;
/** Where that whole-path round stops: the end of part 1. */
const LEGACY_PART_END=verbFamilies[0].verbs.length*4;
/** Which learning card a task belongs to: the past form belongs to the verb's meaning card (no card of its own). */
export function learnStage(task:VerbTask|undefined):LearnStage{
 return task==='perfekt'||task==='write-perfekt'||task==='meaning-perfekt'||task==='hear-perfekt'?'perfekt':task==='praesens'||task==='write-praesens'||task==='hear-praesens'?'praesens':'meaning';
}
type RoundQuestions=readonly {id?:string}[];
const idsOf=(questions:RoundQuestions)=>questions.map(q=>q.id??'');
const sameIds=(a:readonly string[],b:readonly string[])=>a.length===b.length&&a.every((id,i)=>id===b[i]);
/** Whether a saved round was made in an earlier order: it holds Perfekt questions with hat/ist, all meanings come first,
 * or a verb in it stops before the last step (the round was made before that step was added). */
export function isOlderRound(questions:RoundQuestions){
 const ids=idsOf(questions);
 if(ids.some(id=>!verbSteps.includes(questionById.get(id)?.verbTask as WorkshopStep)))return true;
 const family=roundFamily(questions);if(!family)return true;
 const order=new Map(partIds(family).map((id,i)=>[id,i]));
 if(ids.some((id,i)=>i>0&&(order.get(id)??-1)<(order.get(ids[i-1])??-1)))return true;
 const held=new Set(ids);const last=verbSteps[verbSteps.length-1];
 return [...new Set(ids.map(id=>questionById.get(id)?.verbId??''))].some(verbId=>!held.has(questionId(last,verbId)));
}
/** The part of a round: the part of its first verb (the older whole path starts with part 1). */
export function roundFamily(questions:RoundQuestions):VerbFamily|undefined{
 const first=questionById.get(questions[0]?.id??'');return first?.verbId?verbFamilyOf(first.verbId):undefined;
}
/** The questions of a part still to do after an older round: the part in the current order, without what that round answered. */
export function continuationIds(family:VerbFamily,session:Pick<Session,'questions'|'answers'>){
 const done=new Set(session.answers.map(answer=>answer.question_id));
 const left=partIds(family).filter(id=>!done.has(id));
 return left.length?left:partIds(family);
}
export type PathPlace={verb:Verb;family:VerbFamily;verbNumber:number;step:number;steps:readonly WorkshopStep[];chapterStart:boolean;stageStart:boolean;stage:LearnStage};
/** Where a question of the path sits: the verb, its part, and whether a card comes first:
 * the part card at the start of a part, the verb's card at the start of each verb.
 * The steps shown are the steps of that verb the round holds. */
export function pathPlace(questions:readonly {id:string}[],index:number,lookup:(id:string)=>Question|undefined):PathPlace|null{
 const q=lookup(questions[index]?.id??'');const verb=q?.verbId?verbMap.get(q.verbId):undefined;const family=verb?verbFamilyOf(verb.id):undefined;
 if(!q||!verb||!family)return null;
 const previous=index>0?lookup(questions[index-1].id):undefined;
 const stage=learnStage(q.verbTask);const previousStage=previous?learnStage(previous.verbTask):null;
 const stageStart=!previous||previous.verbId!==verb.id||previousStage!==stage;
 const chapterStart=!previous||!previous.verbId||verbFamilyOf(previous.verbId)?.id!==family.id;
 const held=new Set(questions.map(item=>item.id));
 const steps=verbSteps.filter(step=>held.has(questionId(step,verb.id)));
 const step=steps.indexOf(q.verbTask as WorkshopStep);
 return {verb,family,verbNumber:family.verbs.indexOf(verb.id)+1,step:Math.max(0,step),steps:steps.length?steps:verbSteps,chapterStart,stageStart,stage};
}
export type VerbMarks={meaning:boolean;perfekt:boolean};
/** A workshop round as the study API lists it: `ids` are the questions of an open round in order; a finished round carries only its first. */
type RoundSummary=Pick<SessionSummary,'id'|'mode'|'topic'|'total'|'answered'|'finished_at'>&{first?:string|null;ids?:readonly string[]|null};
/** The questions of a summarised round, in order: its list; without one (a finished round) its part, or the older whole path. */
export function summaryIds(session:RoundSummary):string[]{
 if(session.ids?.length)return [...session.ids];
 if(session.total===LEGACY_WORKSHOP_TOTAL)return [...legacyWorkshopIds];
 const family=roundFamily([{id:session.first??''}]);
 return family?partIds(family):[];
}
/** A finished round counts whole. */
const summaryAnswered=(session:RoundSummary)=>session.finished_at?Number.MAX_SAFE_INTEGER:session.answered;
/** How far one part is from the questions of its round and the count answered: what is done for every verb
 * (a question the round does not hold counts as done), and the verb of the next question. */
export function partProgress(family:VerbFamily,ids:readonly string[],answered:number){
 const count=sameIds(ids,legacyWorkshopIds)?LEGACY_PART_END:ids.length;const done=Math.max(0,Math.min(count,answered));
 const held=new Set(ids.slice(0,count));const finishedIds=new Set(ids.slice(0,done));
 const isDone=(id:string)=>!held.has(id)||finishedIds.has(id);
 const marks:VerbMarks[]=family.verbs.map(id=>({meaning:meaningSteps.every(step=>isDone(questionId(step,id))),perfekt:pastTasks.every(task=>isDone(questionId(task,id)))}));
 const meaningDone=marks.filter(mark=>mark.meaning).length;const perfektDone=marks.filter(mark=>mark.perfekt).length;
 const verbsDone=marks.filter(mark=>mark.meaning&&mark.perfekt).length;
 const finished=done>=count;
 const next=finished?undefined:questionById.get(ids[done]);
 const nextVerbId=next?.verbId&&family.verbs.includes(next.verbId)?next.verbId:family.verbs[Math.min(family.verbs.length-1,verbsDone)];
 return {done,count,percent:Math.round(done/Math.max(1,count)*100),finished,started:done>0,verbsDone,verbCount:family.verbs.length,nextVerbId,meaningDone,perfektDone,marks};
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
 * newer one — restarted, or carried on — no longer counts. */
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
/** For every verb: whether its meaning and its past form are done (for the sticker collection). */
export function verbStatus<T extends RoundSummary>(sessions:readonly T[]){
 const status=new Map<string,VerbMarks>();
 for(const part of partsStatus(sessions))part.family.verbs.forEach((id,i)=>status.set(id,part.marks[i]));
 return status;
}
/** A saved round of this part: its questions are workshop questions of the part's verbs (the older whole path counts for part 1). */
export function isPartRound(session:Pick<Session,'mode'|'questions'>,family:VerbFamily){
 if(session.mode!==WORKSHOP_MODE||!session.questions.length)return false;
 if(session.questions.length===LEGACY_WORKSHOP_TOTAL&&sameIds(idsOf(session.questions),legacyWorkshopIds))return family.id===verbFamilies[0].id;
 const members=new Set(family.verbs);
 return session.questions.every(item=>{const q=questionById.get(item.id);return !!q?.verbId&&members.has(q.verbId)&&workshopTasks.has(q.verbTask??'');});
}
/** Where a round ends: an older whole-path round stops after part 1; other rounds at their last question. */
export function roundEnd(session:Pick<Session,'mode'|'questions'>){
 return session.mode===WORKSHOP_MODE&&session.questions.length===LEGACY_WORKSHOP_TOTAL&&sameIds(idsOf(session.questions),legacyWorkshopIds)?LEGACY_PART_END:session.questions.length;
}
/** Yanlışlarım: a round of the learner's own mistakes on the workshop path (stored with the review mode, so it is never taken for a part). */
export const MISTAKES_MODE='review';
/** Workshop questions whose last answer was wrong, in path order: one right answer takes a question off the list. */
export function workshopMistakeIds(reviews:readonly Review[]){
 const byId=reviewRows(reviews);
 return workshopIds().filter(id=>{const row=byId.get(id);return !!row&&row.wrong_count>0&&row.streak===0;});
}
/** The verbs behind those mistakes, in path order. */
export function mistakeVerbs(ids:readonly string[]){
 const seen=new Set<string>();const out:Verb[]=[];
 for(const id of ids){const verbId=questionById.get(id)?.verbId;if(verbId&&!seen.has(verbId)){seen.add(verbId);out.push(verbMap.get(verbId)!);}}
 return out;
}
export function exerciseCount(){return verbQuestions.filter(isVerbExercise).length;}
export function workshopMistakes(session:Pick<Session,'answers'>,lookup:(id:string)=>Question|undefined){
 return session.answers.filter(answer=>!answer.correct).map(answer=>lookup(answer.question_id)).filter((q):q is Question=>!!q);
}
export function reviewRows(reviews:readonly Review[]){return new Map(reviews.map(row=>[row.question_id,row]));}
export {verbs};
