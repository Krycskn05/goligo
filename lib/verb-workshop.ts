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
 * or continue any part; leaving and coming back continues it. Older rounds keep their own layout
 * and their progress counts as it stands: `stage` rounds (95 questions) did all meanings of a part
 * first and then all its Perfekt forms; `legacy` rounds did the same with two Perfekt steps per verb
 * (a part of 76 questions, or the whole path of 152, which counts for part 1 and stops at its end).
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
/** The layout of a saved round, read from its questions: the older sizes, else the third question (the first verb's Perfekt test when verbs run whole). */
export function roundLayout(questions:readonly {id?:string}[]):RoundLayout{
 const n=questions.length;
 if(n===LEGACY_WORKSHOP_TOTAL||verbFamilies.some(family=>n===partTotal(family,'legacy')&&n!==partTotal(family)))return 'legacy';
 const third=questions[verbSteps.indexOf('perfekt')]?.id??'';
 return third.startsWith('verb-perfekt-')?'verb':'stage';
}
/** Whether a saved round has the oldest layout (two Perfekt steps per verb). */
export function isLegacyRound(questions:readonly {id?:string}[]){return roundLayout(questions)==='legacy';}
export type PathPlace={verb:Verb;family:VerbFamily;verbNumber:number;step:number;steps:readonly WorkshopStep[];chapterStart:boolean;stageStart:boolean;stage:LearnStage;layout:RoundLayout};
/** Where a question of the path sits: the verb, its part and stage, and whether a card comes first.
 * The part card opens a part (in staged rounds, each stage of it); the learning card opens each verb's stage. */
export function pathPlace(questions:readonly {id:string}[],index:number,lookup:(id:string)=>Question|undefined):PathPlace|null{
 const q=lookup(questions[index]?.id??'');const verb=q?.verbId?verbMap.get(q.verbId):undefined;const family=verb?verbFamilyOf(verb.id):undefined;
 if(!q||!verb||!family)return null;
 const layout=roundLayout(questions);
 const previous=index>0?lookup(questions[index-1].id):undefined;
 const stage=learnStage(q.verbTask);const previousStage=previous?learnStage(previous.verbTask):null;
 const stageStart=!previous||previous.verbId!==verb.id||previousStage!==stage;
 const chapterStart=!previous||!previous.verbId||verbFamilyOf(previous.verbId)?.id!==family.id||(layout!=='verb'&&previousStage!==stage);
 return {verb,family,verbNumber:family.verbs.indexOf(verb.id)+1,step:stepIndex(q.verbTask),steps:stepsFor(stage,layout),chapterStart,stageStart,stage,layout};
}
export type VerbMarks={meaning:boolean;perfekt:boolean};
/** How far one part is from the questions answered in its round: what is done for every verb, the stage and the next verb. */
export function partProgress(family:VerbFamily,answered:number,layout:RoundLayout='verb'){
 const count=partTotal(family,layout);const done=Math.max(0,Math.min(count,answered));const stageVerbs=family.verbs.length;
 let meaningDone:number,perfektDone:number,stage:LearnStage,nextIndex:number;
 if(layout==='verb'){
  const perVerb=verbSteps.length;const full=Math.floor(done/perVerb);const within=done-full*perVerb;
  perfektDone=Math.min(stageVerbs,full);meaningDone=Math.min(stageVerbs,full+(within>=meaningSteps.length?1:0));
  stage=within>=meaningSteps.length?'perfekt':'meaning';nextIndex=full;
 }else{
  const [meaning,perfekt]=partSegments(family,layout);
  meaningDone=Math.min(stageVerbs,Math.floor(done/meaningSteps.length));
  perfektDone=done<=perfekt.start?0:Math.min(stageVerbs,Math.floor((done-perfekt.start)/stepsFor('perfekt',layout).length));
  stage=done<meaning.count?'meaning':'perfekt';nextIndex=stage==='meaning'?meaningDone:perfektDone;
 }
 const marks:VerbMarks[]=family.verbs.map((_,i)=>({meaning:i<meaningDone,perfekt:i<perfektDone}));
 const finished=done>=count;
 // The verbs counted on the map: whole verbs when verbs run whole; in staged rounds the verbs of the current stage.
 const stageVerbsDone=layout==='verb'?perfektDone:stage==='meaning'?meaningDone:perfektDone;
 return {done,count,percent:Math.round(done/Math.max(1,count)*100),finished,started:done>0,stage,stageVerbsDone,stageVerbs,nextVerbId:family.verbs[Math.min(stageVerbs-1,nextIndex)],meaningDone,perfektDone,marks,layout};
}
/** third: the round's third question (tells the layout of a part round of 95: a Perfekt test when verbs run whole). */
type RoundSummary=Pick<SessionSummary,'id'|'mode'|'topic'|'total'|'answered'|'finished_at'>&{first?:string|null;third?:string|null};
/** The layout of a saved round from its summary: the older sizes, else its third question. */
export function summaryLayout(session:Pick<RoundSummary,'total'|'third'>):RoundLayout{
 if(session.total===LEGACY_WORKSHOP_TOTAL||verbFamilies.some(family=>session.total===partTotal(family,'legacy')&&session.total!==partTotal(family)))return 'legacy';
 return session.third==null||session.third.startsWith('verb-perfekt-')?'verb':'stage';
}
/** The part a saved workshop round belongs to: a part round (by its first question), or an older round of the whole path (part 1). */
export function sessionPart(session:RoundSummary):VerbFamily|undefined{
 if(session.mode!==WORKSHOP_MODE||!session.topic.startsWith('verbs-'))return undefined;
 if(session.total===LEGACY_WORKSHOP_TOTAL||session.total===WORKSHOP_TOTAL)return verbFamilies[0];
 return verbFamilies.find(family=>(session.total===partTotal(family)||session.total===partTotal(family,'legacy'))&&session.first===partIds(family)[0]);
}
/** Questions answered in a part, in the round's own layout; the whole-path round only up to part 1's end. */
export function partAnswered(session:RoundSummary|null|undefined,family:VerbFamily){
 if(!session)return 0;
 return Math.min(session.answered,partTotal(family,summaryLayout(session)));
}
/** The saved round of a part: the newest one still open, else the newest one. */
export function findPartSession<T extends RoundSummary>(sessions:readonly T[],family:VerbFamily):T|null{
 const mine=sessions.filter(session=>sessionPart(session)?.id===family.id);
 return mine.find(session=>!session.finished_at&&partAnswered(session,family)<partTotal(family,summaryLayout(session)))??mine[0]??null;
}
/** Every part with its saved round and progress. */
export function partsStatus<T extends RoundSummary>(sessions:readonly T[]){
 return verbFamilies.map(family=>{const session=findPartSession(sessions,family);return {family,session,...partProgress(family,partAnswered(session,family),session?summaryLayout(session):'verb')};});
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
/** Only a saved round of this part can be continued: any of its layouts, or (part 1) the older whole path. */
export function isPartRound(session:Pick<Session,'mode'|'questions'>,family:VerbFamily){
 if(session.mode!==WORKSHOP_MODE)return false;
 const n=session.questions.length;const layout=roundLayout(session.questions);
 const ids=n===LEGACY_WORKSHOP_TOTAL&&family.id===verbFamilies[0].id?workshopIds('legacy'):partIds(family,layout);
 return n===ids.length&&session.questions.every((item,index)=>item.id===ids[index]);
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
