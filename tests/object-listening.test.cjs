const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;
if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const {objectVocabulary,objectGroups,objectWordMap}=require(path.join(compiled,'object-course.js'));
const de=require(path.join(compiled,'object-practice.js'));
const en=require(path.join(compiled,'english-objects.js'));
const {selectQuestions}=require(path.join(compiled,'study.js'));
const {gradeAnswer}=require(path.join(compiled,'course.js'));
const {vaultLanguages,vaultText}=require(path.join(compiled,'object-vault-copy.js'));
const artwork=require(path.join(compiled,'object-toon-art.json'));

test('every object has one listening question with four unambiguous picture choices in each course',()=>{
 for(const language of ['de','en']){
  const pool=language==='de'?de.objectListeningPool():en.englishObjectListeningPool();
  assert.equal(pool.length,objectVocabulary.length);
  assert.equal(new Set(pool.map(q=>q.objectId)).size,objectVocabulary.length);
  for(const q of pool){
   assert.equal(q.audio,q.answer,q.id);assert.equal(q.image,undefined,'do not reveal the target image: '+q.id);
   assert.equal(new Set(q.pictureOptions).size,4);assert.equal(new Set(q.options).size,4);
   assert(q.pictureOptions.includes(q.objectId));
   if(q.objectId==='lastwagen')assert(!q.pictureOptions.includes('umzugswagen'));
   if(q.objectId==='umzugswagen')assert(!q.pictureOptions.includes('lastwagen'));
   const reversed=[...q.options].reverse();
   const mapped=reversed.map(answer=>q.pictureOptions.find(id=>(language==='de'?objectWordMap.get(id).de:en.englishObjectName(id))===answer));
   assert.equal(mapped.filter(Boolean).length,4,'saved shuffled choices must map to their own pictures: '+q.id);
   assert(gradeAnswer(q,q.answer));assert(!gradeAnswer(q,q.options.find(answer=>answer!==q.answer)));
   for(const id of mapped)assert(fs.existsSync(path.join('public',artwork[id].src)),id);
  }
 }
});

test('listening lengths, category scope, server pools and mistake review match',()=>{
 for(const language of ['de','en'])for(const group of ['all',...objectGroups.map(g=>g.id)]){
  const pool=language==='de'?de.objectListeningPool(group):en.englishObjectListeningPool(group);
  const pick=(size,reviews=[],review=false,ids)=>language==='de'?de.pickObjectListeningQuiz(group,size,reviews,review,ids):en.pickEnglishObjectQuiz(group,size,reviews,review,ids,false,true);
  for(const size of [5,10,20,'all']){
   const round=pick(size);assert.equal(round.length,size==='all'?pool.length:Math.min(size,pool.length));
   assert(round.every(q=>pool.some(item=>item.id===q.id)));
   const topic=(language==='en'?'en-':'')+(group==='all'?'objects-all':group);
   const saved=selectQuestions('listen',topic,round.length,[],round.map(q=>q.id),language);
   assert.deepEqual(new Set(saved.map(q=>q.id)),new Set(round.map(q=>q.id)));
  }
  const first=pool[0],reviews=[{question_id:first.id,wrong_count:1,streak:0,seen:1,due_at:0}];
  assert.deepEqual(pick('all',reviews,true).map(q=>q.id),[first.id]);
  assert.equal(pick('all',[],true).length,0);
 }
});

test('all three study modes and listening instructions have copy in every helper language',()=>{
 for(const {id} of vaultLanguages)for(const key of ['testPractice','writePractice','listenPractice','listenDetail','listenPrompt','listenAudio','listenFirst','listenChoose','listenPlaying','listenLength','listeningCount','allListening','startListening','nextListening']){
  const value=vaultText(id,key,{n:5});assert(value&&value!==key,id+' '+key);assert(!value.includes('{n}'));
 }
 assert.equal(vaultText('tr','testPractice'),'Gör ve Seç');
 assert.equal(vaultText('tr','listenPractice'),'Dinle ve Bul');
});
