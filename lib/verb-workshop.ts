import type {Question} from './course';
import type {Review,Session,SessionSummary} from './study';
import {verbs,verbMap,verbQuestions,type Verb,type VerbTask} from './verb-course';
import {verbFamilies,verbFamilyOf,type VerbFamily} from './verb-families';
import {isVerbExercise} from './verb-practice';

/**
 * Fiil Atölyesi: one path through all 38 verbs, part by part, meanings first. For every
 * verb the same four steps after its learning card: choose the meaning → choose the verb
 * (picture and meaning) → spell it → hear it and choose the meaning. The path is one saved
 * session (mode `workshop`); leaving and coming back continues it.
 */
export const WORKSHOP_TOPIC='verbs-all';
export const WORKSHOP_MODE='workshop';
export type WorkshopStep='meaning'|'word'|'write'|'hear';
export const workshopSteps:readonly WorkshopStep[]=['meaning','word','write','hear'];
export type LearnStage='meaning'|'praesens'|'perfekt';
/** The verbs in path order: part 1 first, then 2 … 4. */
export const workshopVerbs:Verb[]=verbFamilies.flatMap(family=>family.verbs.map(id=>verbMap.get(id)!));
export const questionId=(step:WorkshopStep,verbId:string)=>'verb-'+step+'-'+verbId;
/** Every question of the path in order (4 per verb). */
export function workshopIds(){return workshopVerbs.flatMap(verb=>workshopSteps.map(step=>questionId(step,verb.id)));}
export const WORKSHOP_TOTAL=workshopVerbs.length*workshopSteps.length;
/** Which learning card a task belongs to: meaning, Präsens or Perfekt. */
export function learnStage(task:VerbTask|undefined):LearnStage{
 return task==='praesens'||task==='write-praesens'||task==='hear-praesens'?'praesens':task==='perfekt'||task==='write-perfekt'||task==='hear-perfekt'?'perfekt':'meaning';
}
export function stepIndex(task:VerbTask|undefined){return workshopSteps.indexOf(task as WorkshopStep);}
export type PathPlace={verb:Verb;family:VerbFamily;verbNumber:number;step:number;chapterStart:boolean;stageStart:boolean;stage:LearnStage};
/** Where a question of the path sits: the verb, its workshop and whether a card comes first. */
export function pathPlace(questions:readonly {id:string}[],index:number,lookup:(id:string)=>Question|undefined):PathPlace|null{
 const q=lookup(questions[index]?.id??'');const verb=q?.verbId?verbMap.get(q.verbId):undefined;const family=verb?verbFamilyOf(verb.id):undefined;
 if(!q||!verb||!family)return null;
 const previous=index>0?lookup(questions[index-1].id):undefined;
 const stage=learnStage(q.verbTask);
 const stageStart=!previous||previous.verbId!==verb.id||learnStage(previous.verbTask)!==stage;
 const chapterStart=stageStart&&stage==='meaning'&&(!previous||!previous.verbId||verbFamilyOf(previous.verbId)?.id!==family.id);
 const seen=new Set(questions.slice(0,index+1).map(item=>lookup(item.id)?.verbId).filter(Boolean));
 return {verb,family,verbNumber:seen.size,step:stepIndex(q.verbTask),chapterStart,stageStart,stage};
}
/** Verbs finished on the path = answered questions ÷ 4 (a verb counts once all its steps are done). */
export function workshopProgress(session:Pick<SessionSummary,'answered'|'total'>|null|undefined){
 const answered=session?.answered??0;const total=session?.total??WORKSHOP_TOTAL;
 const verbCount=Math.max(1,Math.round(total/workshopSteps.length));
 return {answered,total,verbsDone:Math.floor(answered/workshopSteps.length),verbCount,percent:Math.round(answered/Math.max(1,total)*100),finished:answered>=total&&total>0};
}
/** The saved path to continue: the newest unfinished workshop session, else the newest finished one. */
export function findWorkshop(sessions:readonly SessionSummary[]){
 const mine=sessions.filter(s=>s.mode===WORKSHOP_MODE&&s.topic.startsWith('verbs-'));
 return mine.find(s=>!s.finished_at)??mine.find(s=>!!s.finished_at)??null;
}
/** Only a saved workshop with the current path can be continued; anything else starts fresh. */
export function isCurrentPath(session:Pick<Session,'mode'|'questions'>){
 const ids=workshopIds();return session.mode===WORKSHOP_MODE&&session.questions.length===ids.length&&session.questions.every((item,index)=>item.id===ids[index]);
}
export function exerciseCount(){return verbQuestions.filter(isVerbExercise).length;}
export function workshopMistakes(session:Pick<Session,'answers'>,lookup:(id:string)=>Question|undefined){
 return session.answers.filter(answer=>!answer.correct).map(answer=>lookup(answer.question_id)).filter((q):q is Question=>!!q);
}
export function reviewRows(reviews:readonly Review[]){return new Map(reviews.map(row=>[row.question_id,row]));}
export {verbs};
