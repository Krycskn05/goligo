import type {Question} from './course';
import type {Review} from './study';
import type {PracticeMode} from './writing-practice';
import {verbQuestions,inVerbTopic,type VerbTask} from './verb-course';

/** Fiiller has three practice modes, like Nesne Kasası: choose, write (letter puzzles), listen. */
// meaning-perfekt (the Perfekt among other verbs' forms) is no longer asked: it mixed the verbs up. Its questions stay in the bank for old rounds.
const testTasks:readonly VerbTask[]=['meaning','word','fit','praesens','perfekt','partizip'];
const writeTasks:readonly VerbTask[]=['write','write-praesens','write-perfekt'];
const listenTasks:readonly VerbTask[]=['hear','hear-praesens','hear-perfekt'];
const fourChoices=(q:Question)=>q.options?.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer);

export function isVerbTestQuestion(q:Question|undefined):q is Question{
 return !!q&&q.id.startsWith('verb-')&&!!q.verbId&&q.kind==='choice'&&!!q.verbTask&&testTasks.includes(q.verbTask)&&!q.audio&&fourChoices(q);
}
export function isVerbWritingQuestion(q:Question|undefined):q is Question{
 return !!q&&q.id.startsWith('verb-')&&!!q.verbId&&q.kind==='write'&&!!q.verbTask&&writeTasks.includes(q.verbTask)&&!q.options&&!q.audio;
}
export function isVerbListeningQuestion(q:Question|undefined):q is Question{
 return !!q&&q.id.startsWith('verb-')&&!!q.verbId&&q.kind==='listen'&&!!q.verbTask&&listenTasks.includes(q.verbTask)&&!!q.audio&&fourChoices(q);
}
export function isVerbExercise(q:Question|undefined):q is Question{return isVerbTestQuestion(q)||isVerbWritingQuestion(q)||isVerbListeningQuestion(q);}
/** Fiil Atölyesi (workshop) and Karma sınav (mixed) rounds use every kind of exercise. */
export function verbModePredicate(mode:string){return mode==='write'?isVerbWritingQuestion:mode==='listen'?isVerbListeningQuestion:mode==='workshop'||mode==='mixed'?isVerbExercise:isVerbTestQuestion;}
/** Session mode stored on the server for each practice mode. */
export function verbSessionMode(mode:PracticeMode){return mode==='write'?'write':mode==='listen'?'listen':'test';}
export function verbPracticeMode(sessionMode:string):PracticeMode{return sessionMode==='write'?'write':sessionMode==='listen'?'listen':'test';}

export function verbPool(mode:string,topic:string){return verbQuestions.filter(q=>verbModePredicate(mode)(q)&&inVerbTopic(q.topic,topic));}
export const isVerbMistake=(row:Review|undefined)=>!!row&&row.wrong_count>0&&row.streak<3;
export const isVerbSolved=(row:Review|undefined)=>!!row&&!isVerbMistake(row);
export type VerbPickOptions={starred?:ReadonlySet<string>;fresh?:boolean};
/**
 * Questions for one round. Review = open mistakes plus starred questions.
 * A normal round leaves out solved questions until none are left, then repeats them all.
 */
export function pickVerbRound(mode:string,topic:string,reviews:readonly Review[],reviewOnly=false,onlyIds?:readonly string[],options:VerbPickOptions={}):Question[]{
 const byId=new Map(reviews.map(row=>[row.question_id,row]));const only=onlyIds?new Set(onlyIds):null;const starred=options.starred??new Set<string>();
 const pool=verbPool(mode,topic).filter(q=>!only||only.has(q.id));
 if(reviewOnly)return pool.filter(q=>isVerbMistake(byId.get(q.id))||starred.has(q.id));
 if(!options.fresh)return pool;
 const open=pool.filter(q=>!isVerbSolved(byId.get(q.id)));return open.length?open:pool;
}
