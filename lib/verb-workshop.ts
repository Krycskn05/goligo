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
 * Perfekt → one test (choose the form), then write it. (No listening questions on the path.)
 * The path is one saved session (mode `workshop`); leaving and coming back continues it.
 */
export const WORKSHOP_TOPIC='verbs-all';
export const WORKSHOP_MODE='workshop';
export type LearnStage='meaning'|'praesens'|'perfekt';
export const pathStages:readonly LearnStage[]=['meaning','perfekt'];
export type WorkshopStep='meaning'|'write'|'perfekt'|'write-perfekt';
export const meaningSteps:readonly WorkshopStep[]=['meaning','write'];
export const perfektSteps:readonly WorkshopStep[]=['perfekt','write-perfekt'];
export const stageSteps=(stage:LearnStage):readonly WorkshopStep[]=>stage==='perfekt'?perfektSteps:meaningSteps;
/** The verbs in path order: part 1 first, then part 2. */
export const workshopVerbs:Verb[]=verbFamilies.flatMap(family=>family.verbs.map(id=>verbMap.get(id)!));
export const questionId=(step:WorkshopStep,verbId:string)=>'verb-'+step+'-'+verbId;
/** One stretch of the path: the questions of one stage of one part. */
export type PathSegment={family:VerbFamily;stage:LearnStage;start:number;count:number};
export function pathSegments():PathSegment[]{
 const out:PathSegment[]=[];let start=0;
 for(const family of verbFamilies)for(const stage of pathStages){const count=family.verbs.length*stageSteps(stage).length;out.push({family,stage,start,count});start+=count;}
 return out;
}
/** Every question of the path in order: part 1 meanings, part 1 Perfekt, part 2 meanings, part 2 Perfekt. */
export function workshopIds(){return pathSegments().flatMap(segment=>segment.family.verbs.flatMap(id=>stageSteps(segment.stage).map(step=>questionId(step,id))));}
export const WORKSHOP_TOTAL=workshopIds().length;
/** Which learning card a task belongs to: meaning or Perfekt. */
export function learnStage(task:VerbTask|undefined):LearnStage{
 return task==='perfekt'||task==='write-perfekt'||task==='hear-perfekt'?'perfekt':task==='praesens'||task==='write-praesens'||task==='hear-praesens'?'praesens':'meaning';
}
export function stepIndex(task:VerbTask|undefined){return stageSteps(learnStage(task)).indexOf(task as WorkshopStep);}
export type PathPlace={verb:Verb;family:VerbFamily;verbNumber:number;step:number;steps:readonly WorkshopStep[];chapterStart:boolean;stageStart:boolean;stage:LearnStage};
/** Where a question of the path sits: the verb, its part and stage, and whether a card comes first. */
export function pathPlace(questions:readonly {id:string}[],index:number,lookup:(id:string)=>Question|undefined):PathPlace|null{
 const q=lookup(questions[index]?.id??'');const verb=q?.verbId?verbMap.get(q.verbId):undefined;const family=verb?verbFamilyOf(verb.id):undefined;
 if(!q||!verb||!family)return null;
 const previous=index>0?lookup(questions[index-1].id):undefined;
 const stage=learnStage(q.verbTask);const previousStage=previous?learnStage(previous.verbTask):null;
 const stageStart=!previous||previous.verbId!==verb.id||previousStage!==stage;
 const chapterStart=!previous||!previous.verbId||verbFamilyOf(previous.verbId)?.id!==family.id||previousStage!==stage;
 return {verb,family,verbNumber:family.verbs.indexOf(verb.id)+1,step:stepIndex(q.verbTask),steps:stageSteps(stage),chapterStart,stageStart,stage};
}
/** Where the learner is on the path: the current part and stage, the verbs done in that stage and the next verb. */
export function workshopProgress(session:Pick<SessionSummary,'answered'|'total'>|null|undefined){
 const answered=session?.answered??0;const total=session?.total??WORKSHOP_TOTAL;
 const segments=pathSegments();const current=segments.find(segment=>answered<segment.start+segment.count)??segments[segments.length-1];
 const perVerb=stageSteps(current.stage).length;const within=Math.max(0,Math.min(answered,current.start+current.count)-current.start);
 const stageVerbsDone=Math.floor(within/perVerb);const stageVerbs=current.family.verbs.length;
 const nextVerbId=current.family.verbs[Math.min(stageVerbs-1,stageVerbsDone)];
 const finished=answered>=total&&total>0;
 return {answered,total,percent:Math.round(answered/Math.max(1,total)*100),finished,family:current.family,stage:current.stage,stageVerbsDone,stageVerbs,nextVerbId};
}
/** For every verb: whether its meanings and its Perfekt are done (for the sticker collection). */
export function verbStatus(answered:number){
 const status=new Map<string,{meaning:boolean;perfekt:boolean}>();
 for(const segment of pathSegments()){const perVerb=stageSteps(segment.stage).length;segment.family.verbs.forEach((id,i)=>{const entry=status.get(id)??{meaning:false,perfekt:false};if(segment.stage==='perfekt')entry.perfekt=answered>=segment.start+(i+1)*perVerb;else entry.meaning=answered>=segment.start+(i+1)*perVerb;status.set(id,entry);});}
 return status;
}
/** How far one part is: its questions done, and the verbs done in each of its stages. */
export function partProgress(family:VerbFamily,answered:number){
 const segments=pathSegments().filter(segment=>segment.family.id===family.id);
 const start=segments[0]?.start??0;const count=segments.reduce((n,segment)=>n+segment.count,0);
 const done=Math.max(0,Math.min(count,answered-start));
 const stageDone=(stage:LearnStage)=>{const segment=segments.find(item=>item.stage===stage);if(!segment)return 0;return Math.max(0,Math.min(family.verbs.length,Math.floor((answered-segment.start)/stageSteps(stage).length)));};
 return {done,count,percent:Math.round(done/Math.max(1,count)*100),state:done>=count?'done':answered>=start?'current':'locked',meaningDone:stageDone('meaning'),perfektDone:stageDone('perfekt')};
}
/** The saved path to continue: the newest unfinished workshop session, else the newest finished one. Rounds of an older path (another length) are left out. */
export function findWorkshop(sessions:readonly SessionSummary[]){
 const mine=sessions.filter(s=>s.mode===WORKSHOP_MODE&&s.topic.startsWith('verbs-')&&s.total===WORKSHOP_TOTAL);
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
