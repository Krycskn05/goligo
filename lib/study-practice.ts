import {inCourseUnit} from './course-levels';
import {matchesPracticeMode} from './writing-practice';
import {questions,topics,type Question} from './course';
import type {Review} from './study';
export const isDictation=(q:Question)=>q.practice==='dictation'||(q.kind==='write'&&!!q.audio&&!q.practice);
export function hasPractice(mode:string,topic:string,reviews:Review[]=[]){
 const reviewIds=new Set(reviews.filter(r=>r.wrong_count>0&&r.streak<3).map(r=>r.question_id));
 return questions.some(q=>(topic==='all'||inCourseUnit(q.topic,topic)||(topic==='objects-all'&&q.topic.startsWith('objects-'))||(topic.startsWith('unit-')&&(topics.find(t=>t.id===q.topic)?.unit??1)===Number(topic.slice(5))))&&(mode==='mixed'?true:mode==='test'||mode==='write'?matchesPracticeMode(q,mode):mode==='review'?reviewIds.has(q.id):mode==='listen'?!!q.audio:mode==='dictation'?isDictation(q):mode==='sentence'?q.practice==='sentence':mode==='visual'?!!q.image:q.kind===mode));
}
export function practicePool(mode:string,unit:number,topicId?:string,scene?:string){
 return questions.filter(q=>(topicId?q.topic===topicId:(topics.find(t=>t.id===q.topic)?.unit??1)===unit)&&(!scene||q.scene===scene)&&(mode==='sentence'?q.practice==='sentence':mode==='dictation'?isDictation(q):mode==='visual'?!!q.image:mode==='write'||mode==='mixed'?q.kind==='write':mode==='listen'?!!q.audio:mode==='read'?q.kind==='read':q.kind==='choice'));
}
export function retryKey(mode:string,topic:string,count:number,ids?:string[]){return JSON.stringify([mode,topic,count,ids??null]);}
