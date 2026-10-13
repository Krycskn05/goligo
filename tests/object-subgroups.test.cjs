const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const {objectVocabulary,objectGroups}=require(path.join(compiled,'object-course.js'));
const {questions,questionMap}=require(path.join(compiled,'course.js'));
const {objectSubgroups,inObjectSubgroup,subgroupName}=require(path.join(compiled,'object-subgroups.js'));
const {vaultLanguages}=require(path.join(compiled,'object-vault-copy.js'));
const de=require(path.join(compiled,'object-practice.js'));const en=require(path.join(compiled,'english-objects.js'));
test('every vault object belongs to exactly one translated subtopic within its existing parent',()=>{
 const occurrences=new Map();
 for(const group of objectSubgroups){
  assert(objectGroups.some(parent=>parent.id===group.parent));assert(group.wordIds.length);assert(group.wordIds.includes(group.art));
  for(const language of vaultLanguages)assert(subgroupName(group,language.id).trim(),group.id+' '+language.id);
  for(const id of group.wordIds){assert.equal(objectVocabulary.find(word=>word.id===id)?.topic,group.parent,id);occurrences.set(id,(occurrences.get(id)||0)+1);}
 }
 assert.equal(occurrences.size,objectVocabulary.length);for(const word of objectVocabulary)assert.equal(occurrences.get(word.id),1,word.id);
});
test('subtopic rounds, lengths and mistake reviews remain scoped in German and English for every mode',()=>{
 for(const group of objectSubgroups)for(const language of ['de','en'])for(const mode of ['test','write','listen']){
  const isQuestion=language==='de'?(mode==='test'?de.isObjectPictureQuestion:mode==='write'?de.isObjectWritingQuestion:de.isObjectListeningQuestion):(mode==='test'?en.isEnglishObjectPictureQuestion:mode==='write'?en.isEnglishObjectWritingQuestion:en.isEnglishObjectListeningQuestion);
  const pool=Array.from(questionMap.values()).filter(q=>isQuestion(q)&&q.topic===(language==='en'?'en-':'')+group.parent);
  const ids=pool.filter(q=>inObjectSubgroup(q,group.id)).map(q=>q.id);assert(ids.length,group.id+' '+language+' '+mode);
  const pick=language==='de'?(mode==='test'?de.pickPictureQuiz:mode==='write'?de.pickObjectWritingQuiz:de.pickObjectListeningQuiz):(parent,count,reviews,only,ids)=>en.pickEnglishObjectQuiz(parent,count,reviews,only,ids,mode==='write',mode==='listen');
  for(const size of [5,10,20,'all']){
   const round=pick(group.parent,size,[],false,ids);assert.equal(round.length,size==='all'?ids.length:Math.min(size,ids.length));
   assert(round.every(q=>inObjectSubgroup(q,group.id)));assert.equal(new Set(round.map(q=>q.id)).size,round.length);
  }
  const outside=pool.find(q=>!inObjectSubgroup(q,group.id));
  const reviews=[{question_id:ids[0],wrong_count:1,streak:0,due_at:0,seen:1},...(outside?[{question_id:outside.id,wrong_count:5,streak:0,due_at:0,seen:1}]:[])];
  const review=pick(group.parent,'all',reviews,true,ids);assert.deepEqual(review.map(q=>q.id),[ids[0]]);
  assert.equal(pick(group.parent,'all',[],false,[]).length,0);
  assert(inObjectSubgroup(questionMap.get(ids[0]),group.id));
 }
});
