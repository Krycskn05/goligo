import {objectQuestions,objectQuestionPool,type ObjectMode,type SceneKey} from './object-course';
import {shuffle,type Question} from './course';
import type {Review} from './study';

/** A round asks about each object once; incorrect answers get another retrieval opportunity. */
export function pickObjectQuestions(mode:ObjectMode,group:string,count:number,reviews:Review[],scene?:SceneKey):Question[]{
 const byId=new Map(reviews.map(r=>[r.question_id,r]));
 let pool=objectQuestionPool(mode,group,scene);
 if(mode==='review')pool=pool.filter(q=>{const r=byId.get(q.id);return r&&r.wrong_count>0&&r.streak<3;});
 const rank=(q:Question)=>{const r=byId.get(q.id);return r?.wrong_count&&r.streak<3?100+r.wrong_count*5-r.streak:!r?50:r.due_at<=Date.now()?25:5-r.seen;};
 const family=(q:Question)=>q.sceneFind?'scene':q.practice==='dictation'?'dictation':q.kind==='read'?'read':q.kind==='listen'?'listen':q.kind==='write'?'write':'visual';
 const ordered=shuffle(pool).sort((a,b)=>rank(b)-rank(a));
 const families=mode==='mixed'?shuffle([...new Set(ordered.map(family))]):['all'];
 const buckets=families.map(f=>ordered.filter(q=>f==='all'||family(q)===f));
 const result:Question[]=[];const used=new Set<string>();
 for(const q of ordered){const r=byId.get(q.id);if(r&&r.wrong_count>0&&r.streak<3&&!used.has(q.objectId??q.id)&&result.length<count){used.add(q.objectId??q.id);result.push(q);}}
 for(let i=0;i<pool.length&&result.length<count;i++){let found=false;for(const bucket of buckets){const q=bucket[i];if(!q)continue;found=true;const word=q.objectId??q.id;if(!used.has(word)&&result.length<count){used.add(word);result.push(q);}}if(!found)break;}
 return result;
}
export function objectReviewWords(reviews:Review[]){
 const byId=new Map(objectQuestions.map(q=>[q.id,q]));
 return new Set(reviews.filter(r=>byId.has(r.question_id)&&r.wrong_count>0&&r.streak<3).map(r=>byId.get(r.question_id)!.objectId!));
}

/** Only the picture-to-word questions belong to the new four-choice section. */
export function isObjectPictureQuestion(q:Question|undefined):q is Question{
 return !!q&&q.id.startsWith('obj-picture-')&&q.kind==='choice'&&!!q.image&&!!q.objectId&&q.options?.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer);
}

/** Hear one word, then identify its picture among four distinct objects. */
export function isObjectListeningQuestion(q:Question|undefined):q is Question{
 return !!q&&q.id.startsWith('obj-hear-picture-')&&q.kind==='listen'&&!!q.audio&&!!q.objectId&&q.options?.length===4&&new Set(q.options).size===4&&q.pictureOptions?.length===4&&new Set(q.pictureOptions).size===4&&q.pictureOptions.includes(q.objectId);
}
export function objectListeningPool(group='all'){
 return objectQuestions.filter(q=>isObjectListeningQuestion(q)&&(group==='all'||q.topic===group));
}
export function pickObjectListeningQuiz(group:string,count:number|'all',reviews:Review[],reviewOnly=false,onlyIds?:string[]):Question[]{
 const byId=new Map(reviews.map(r=>[r.question_id,r]));const only=onlyIds?new Set(onlyIds):null;
 const pool=objectListeningPool(group).filter(q=>(!only||only.has(q.id))&&(!reviewOnly||!!byId.get(q.id)?.wrong_count&&byId.get(q.id)!.streak<3));
 const rank=(q:Question)=>{const r=byId.get(q.id);return r?.wrong_count&&r.streak<3?100+r.wrong_count*5-r.streak:!r?50:r.due_at<=Date.now()?25:5-r.seen;};
 return shuffle(pool).sort((a,b)=>rank(b)-rank(a)).slice(0,count==='all'?pool.length:count);
}
export function pictureQuizReviews(reviews:Review[]){
 const ids=new Set(objectQuestions.filter(isObjectPictureQuestion).map(q=>q.id));
 return reviews.filter(r=>ids.has(r.question_id));
}
export type PictureQuizSize=5|10|20|'all';
export function pickPictureQuiz(group:string,count:number|'all',reviews:Review[],reviewOnly=false,onlyIds?:string[]):Question[]{
 const byId=new Map(pictureQuizReviews(reviews).map(r=>[r.question_id,r]));
 const only=onlyIds?new Set(onlyIds):null;
 const pool=objectQuestions.filter(q=>isObjectPictureQuestion(q)&&(group==='all'||q.topic===group)&&(!only||only.has(q.id))&&(!reviewOnly||!!byId.get(q.id)?.wrong_count&&byId.get(q.id)!.streak<3));
 const rank=(q:Question)=>{const r=byId.get(q.id);return r?.wrong_count&&r.streak<3?100+r.wrong_count*5-r.streak:!r?50:r.due_at<=Date.now()?25:5-r.seen;};
 return shuffle(pool).sort((a,b)=>rank(b)-rank(a)).slice(0,count==='all'?pool.length:count);
}

/** Written retrieval has its own pool and does not change picture tests. */
export function isObjectWritingQuestion(q:Question|undefined):q is Question{
 return !!q&&!!q.objectId&&q.kind==='write'&&!q.audio&&!q.sceneFind;
}
export function objectWritingPool(group='all'){
 return objectQuestions.filter(q=>isObjectWritingQuestion(q)&&(group==='all'||q.topic===group));
}
export function pickObjectWritingQuiz(group:string,count:number|'all',reviews:Review[],reviewOnly=false,onlyIds?:string[]):Question[]{
 const byId=new Map(reviews.map(r=>[r.question_id,r]));const only=onlyIds?new Set(onlyIds):null;
 const pool=objectWritingPool(group).filter(q=>(!only||only.has(q.id))&&(!reviewOnly||!!byId.get(q.id)?.wrong_count&&byId.get(q.id)!.streak<3));
 const rank=(q:Question)=>{const r=byId.get(q.id);return r?.wrong_count&&r.streak<3?100+r.wrong_count*5-r.streak:!r?50:r.due_at<=Date.now()?25:5-r.seen;};
 const ordered=shuffle(pool).sort((a,b)=>rank(b)-rank(a));
 const families=shuffle([ordered.filter(q=>!q.gap),ordered.filter(q=>!!q.gap&&!q.articlePuzzle),ordered.filter(q=>q.articlePuzzle?.variant==='plural')].filter(bucket=>bucket.length));
 const result:Question[]=[];const size=count==='all'?pool.length:Math.min(count,pool.length);
 for(let depth=0;depth<pool.length&&result.length<size;depth++)for(const bucket of families)if(bucket[depth]&&result.length<size)result.push(bucket[depth]);
 return result;
}
