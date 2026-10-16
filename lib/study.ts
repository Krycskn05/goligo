import {matchesPracticeMode,writingFamily} from './writing-practice';
import {curriculumTopicIds,courseUnitForTopic} from './course-levels';
import {questions,topics,shuffle,type Question} from './course';
import {englishQuestions,englishTopics,englishUnitContains} from './english-course';
import {verbQuestions,isVerbTopic,inVerbTopic,spreadVerbRound} from './verb-course';
import {type LearningLanguage} from './learning-language';
import type {StudyStats} from './progress';
/** Stars the learner puts on questions are kept as study notes: star:<question id> = '1'. */
export const STAR_NOTE_PREFIX='star:';
export const starNoteKey=(questionId:string)=>STAR_NOTE_PREFIX+questionId;
export function starredQuestionIds(notes:Record<string,string>):Set<string>{
 return new Set(Object.entries(notes).filter(([key,value])=>key.startsWith(STAR_NOTE_PREFIX)&&value==='1').map(([key])=>key.slice(STAR_NOTE_PREFIX.length)));
}
export type Review={question_id:string;wrong_count:number;streak:number;seen:number;last_answer:string;last_wrong:string;last_at:number;due_at:number};
export type Answer={id:string;question_id:string;answer:string;correct:number;created_at:number};
export type SessionQuestion={id:string;options?:string[]};
export type Session={id:string;mode:string;topic:string;questions:SessionQuestion[];created_at:number;finished_at:number|null;answers:Answer[]};
/** first: the round's first question (tells which Fiil Atölyesi part a round belongs to); ids: the questions of an open Fiil Atölyesi round in order (how far each verb is). */
export type SessionSummary={id:string;mode:string;topic:string;created_at:number;finished_at:number|null;total:number;answered:number;correct:number;first?:string|null;ids?:string[]|null};
export type Snapshot={reviews:Review[];notes:Record<string,string>;sessions:SessionSummary[];activePictureSessionId?:string|null;activeVerbSessionId?:string|null;stats?:StudyStats};
export function selectQuestions(mode:string,topic:string,count:number,reviews:Review[],onlyIds?:string[],course:LearningLanguage=topic.startsWith('en-')?'en':'de'):Question[]{
 const byId=new Map(reviews.map(r=>[r.question_id,r]));const only=onlyIds?new Set(onlyIds):null;const curriculum=curriculumTopicIds(topic);
 const source=course==='en'?englishQuestions:questions;const sourceTopics=course==='en'?englishTopics:topics;
 const rank=(q:Question)=>{const r=byId.get(q.id);if(!r)return 100;if(r.wrong_count&&r.streak<3)return 200+r.wrong_count*5-r.streak*5;if(r.due_at<=Date.now())return 80;return 20-r.seen;};
 // Fiiller rounds: open mistakes first, then new and due questions; never the same verb twice in a row.
 if(isVerbTopic(topic)){
  let verbPool=verbQuestions.filter(q=>inVerbTopic(q.topic,topic)&&(!only||only.has(q.id)));
  // Fiil Atölyesi: the learner walks the verbs in a fixed order, so the requested order is kept as it is.
  if(mode==='workshop'&&onlyIds){const byQuestion=new Map(verbPool.map(q=>[q.id,q]));return onlyIds.map(id=>byQuestion.get(id)).filter((q):q is Question=>!!q).slice(0,count);}
  if(mode==='review')verbPool=verbPool.filter(q=>{const r=byId.get(q.id);return r&&r.wrong_count>0&&r.streak<3;});
  else if(mode==='test'||mode==='write')verbPool=verbPool.filter(q=>matchesPracticeMode(q,mode));
  else if(mode==='listen')verbPool=verbPool.filter(q=>!!q.audio);
  else if(mode!=='mixed')verbPool=verbPool.filter(q=>q.kind===mode);
  return spreadVerbRound(shuffle(verbPool).sort((a,b)=>rank(b)-rank(a))).slice(0,count);
 }
 let pool=source.filter(q=>(topic==='all'||q.topic===topic||(course==='en'?englishUnitContains(q.topic,topic):!!curriculum?.includes(q.topic)||(topic==='objects-all'&&q.topic.startsWith('objects-'))||(topic.startsWith('unit-')&&(topics.find(t=>t.id===q.topic)?.unit??1)===Number(topic.slice(5)))))&&(!only||only.has(q.id)));
 if(mode==='review')pool=pool.filter(q=>{const r=byId.get(q.id);return r&&r.wrong_count>0&&r.streak<3;});
 else if(mode==='test'||mode==='write')pool=pool.filter(q=>matchesPracticeMode(q,mode));
 else if(mode==='listen')pool=pool.filter(q=>!!q.audio);
 else if(mode==='dictation')pool=pool.filter(q=>q.practice==='dictation'||(q.kind==='write'&&!!q.audio&&!q.practice));
 else if(mode==='sentence')pool=pool.filter(q=>q.practice==='sentence');
 else if(mode==='visual')pool=pool.filter(q=>!!q.image);
 else if(mode!=='mixed')pool=pool.filter(q=>q.kind===mode);
 pool=shuffle(pool).sort((a,b)=>rank(b)-rank(a));
 const result:Question[]=[];const used=new Set<string>();
 const take=(q:Question)=>{if(!used.has(q.id)&&result.length<count){result.push(q);used.add(q.id);}};
 if(mode==='mixed'||mode==='test'||mode==='write'){
  const family=(q:Question)=>mode==='write'?writingFamily(q):q.image?'visual':q.practice==='sentence'?'sentence':q.practice==='dictation'||(q.kind==='write'&&q.audio)?'dictation':q.kind==='read'?'read':q.audio?'listen':q.options?'choice':'write';
  // Whole-level practice visits each textbook chapter before revisiting one.
  // Legacy subtopics are grouped with their chapter, so a large old unit cannot
  // crowd the smaller chapters out of a twenty-question mixed session.
  if(['a11-all','a12-all','en-a11-all','en-a12-all'].includes(topic)){
   const chapterIds=shuffle([...new Set(pool.map(q=>courseUnitForTopic(q.topic)?.id??q.topic))]);
   const chapterBuckets=chapterIds.map(id=>pool.filter(q=>(courseUnitForTopic(q.topic)?.id??q.topic)===id));
   const kinds=shuffle([...new Set(pool.map(family))]);
   for(let depth=0;depth<pool.length&&result.length<count;depth++){
    let available=false;
    for(let i=0;i<chapterBuckets.length;i++){
     const candidates=chapterBuckets[i].filter(q=>!used.has(q.id));
     const item=candidates.find(q=>family(q)===kinds[(i+depth)%kinds.length])??candidates[0];
     if(item){take(item);available=true;}
    }
    if(!available)break;
   }
   return result;
  }
  const families=shuffle([...new Set(pool.map(family))]);
  const queues=families.map(f=>{
   const topicBuckets=shuffle(sourceTopics.map(t=>pool.filter(q=>q.topic===t.id&&family(q)===f)).filter(b=>b.length));
   const queue:Question[]=[];for(let depth=0;depth<pool.length;depth++){let found=false;for(const bucket of topicBuckets){if(bucket[depth]){queue.push(bucket[depth]);found=true;}}if(!found)break;}return queue;
  });
  for(let depth=0;depth<pool.length&&result.length<count;depth++){let found=false;for(const queue of queues){if(queue[depth]){take(queue[depth]);found=true;}}if(!found)break;}
  return result;
 }
 const buckets=shuffle(sourceTopics.map(t=>pool.filter(q=>q.topic===t.id)));
 for(let index=0;index<source.length&&result.length<count;index++){
  let available=false;for(const bucket of buckets){if(bucket[index]){available=true;take(bucket[index]);}}
  if(!available)break;
 }
 return shuffle(result);
}
export function getTopicTitle(id:string){return id==='unit-1'?'1. ünite · Willkommen!':id==='unit-8'?'8. ünite · Eine Party':id==='unit-9'?'9. ünite · Termine':topics.find(t=>t.id===id)?.title??'Tüm konular';}
