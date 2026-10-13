import type {Question} from './course';
import {objectVocabulary} from './object-course';
import {objectMeanings} from './object-translations';
import type {Review} from './study';
const preferred:Record<string,string>={heizung:'radiator',herd:'stove',regal:'shelf',schrank:'wardrobe',waschbecken:'washbasin',treppe:'stairs',bild:'painting',kissen:'pillow',umzugswagen:'moving truck'};
export function englishObjectName(id:string){return preferred[id]??objectMeanings[id]?.[0].split(' / ')[0]??'';}
export const englishObjectQuestions:Question[]=objectVocabulary.flatMap((word,index)=>{
 const answer=englishObjectName(word.id);if(!answer)throw new Error('Missing English object name: '+word.id);
 const synonyms=[...new Set([answer,...(objectMeanings[word.id]?.[0].split(' / ')??[])])];
 const other=objectVocabulary.filter(w=>w.id!==word.id&&w.topic===word.topic);
 const wrong=[...new Set([...other.slice(index%Math.max(1,other.length-3)),...other,...objectVocabulary.filter(w=>w.id!==word.id)].map(w=>englishObjectName(w.id)))].filter(value=>value&&value!==answer).slice(0,3);
 const base={topic:'en-'+word.topic,objectId:word.id,answer,accepted:synonyms,answerTr:word.tr,explanation:answer+' = '+word.tr+'.',explanationEn:'The object in the picture is '+answer+'.',image:{src:word.image,alt:word.tr,caption:'Original object illustration',...(word.crop?{crop:word.crop}:{})}};
 const plural=['treppe','brille'].includes(word.id);const uncountable=['geruest'].includes(word.id);
 const prefix=plural?'These are ':uncountable?'This is ':'This is '+(/^[aeiou]/i.test(answer)?'an ':'a ');
 const excluded=new Set([word.id,...(word.id==='lastwagen'?['umzugswagen']:word.id==='umzugswagen'?['lastwagen']:[])]);
 const pictures=objectVocabulary.filter(w=>!excluded.has(w.id));
 const pictureCandidates=[...pictures.filter(w=>w.topic===word.topic),...pictures.filter(w=>w.topic!==word.topic)];
 const offset=index%Math.max(1,pictureCandidates.length-2);
 const pictureOptions=[word.id,...pictureCandidates.slice(offset,offset+3).map(w=>w.id)];
 return [
  {...base,id:'en-obj-picture-'+word.id,kind:'choice',practice:'visual',prompt:'Resimdeki nesnenin İngilizce adını seç.',promptEn:'Choose the English word for the picture.',options:[answer,...wrong]},
  {...base,id:'en-obj-write-'+word.id,kind:'write',practice:'visual',writingTask:'word',prompt:'Resimdeki nesnenin İngilizce adını yaz.',promptEn:'Write the English word for the picture.'},
  {...base,id:'en-obj-gap-'+word.id,kind:'write',writingTask:'gap',gap:prefix+'___.',prompt:'Boşluğa nesnenin İngilizce adını yaz.',promptEn:'Fill the gap with the English name of the object.'},
  {...base,id:'en-obj-hear-picture-'+word.id,kind:'listen',image:undefined,prompt:'Dinlediğin kelimeye uygun resmi seç.',promptEn:'Listen to the word and choose its picture.',audio:answer,audioTr:word.tr,options:pictureOptions.map(englishObjectName),pictureOptions},
 ] as Question[];
});
export const isEnglishObjectPictureQuestion=(q:Question|undefined):q is Question=>!!q&&q.id.startsWith('en-obj-picture-')&&!!q.image&&q.options?.length===4;
export const isEnglishObjectWritingQuestion=(q:Question|undefined):q is Question=>!!q&&q.id.startsWith('en-obj-')&&q.kind==='write';
export const isEnglishObjectListeningQuestion=(q:Question|undefined):q is Question=>!!q&&q.id.startsWith('en-obj-hear-picture-')&&q.kind==='listen'&&!!q.audio&&q.options?.length===4&&new Set(q.options).size===4&&q.pictureOptions?.length===4&&new Set(q.pictureOptions).size===4;
export function englishObjectListeningPool(group='all'){return englishObjectQuestions.filter(q=>isEnglishObjectListeningQuestion(q)&&(group==='all'||q.topic==='en-'+group));}
export function englishObjectWritingPool(group='all'){return englishObjectQuestions.filter(q=>isEnglishObjectWritingQuestion(q)&&(group==='all'||q.topic==='en-'+group));}
export function pickEnglishObjectQuiz(group:string,count:number|'all',reviews:Review[],reviewOnly=false,onlyIds?:string[],writing=false,listening=false){
 const byId=new Map(reviews.map(r=>[r.question_id,r]));const allowed=onlyIds?new Set(onlyIds):null;
 const pool=englishObjectQuestions.filter(q=>(writing?isEnglishObjectWritingQuestion(q):listening?isEnglishObjectListeningQuestion(q):isEnglishObjectPictureQuestion(q))&&(group==='all'||q.topic==='en-'+group)&&(!allowed||allowed.has(q.id))&&(!reviewOnly||!!byId.get(q.id)?.wrong_count&&byId.get(q.id)!.streak<3));
 const rank=(q:Question)=>{const r=byId.get(q.id);return r?.wrong_count&&r.streak<3?100+r.wrong_count*5-r.streak:!r?50:r.due_at<=Date.now()?25:5-r.seen;};
 const ordered=pool.map(q=>({q,tie:Math.random()})).sort((a,b)=>rank(b.q)-rank(a.q)||a.tie-b.tie).map(item=>item.q);
 const limit=count==='all'?pool.length:Math.min(count,pool.length);
 if(!writing)return ordered.slice(0,limit);
 const buckets=[ordered.filter(q=>!q.gap),ordered.filter(q=>!!q.gap)];const result:Question[]=[];
 for(let i=0;i<pool.length&&result.length<limit;i++)for(const bucket of buckets)if(bucket[i]&&result.length<limit)result.push(bucket[i]);
 return result;
}
