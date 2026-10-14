const {test}=require('node:test');
const assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;
assert.ok(compiled,'Set STUDY_CHECK_DIR to compiled libraries.');
const course=require(path.join(compiled,'course.js'));
const study=require(path.join(compiled,'study.js'));
const english=require(path.join(compiled,'english-course.js'));
const objects=require(path.join(compiled,'english-objects.js'));
const preference=require(path.join(compiled,'learning-language.js'));
const speech=require(path.join(compiled,'german-speech.js'));
function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));
 let user='learner-a';
 const db={prepare(query){return {query,args:[],bind(...args){this.args=args;return this;},async first(){return sql.prepare(this.query).get(...this.args)??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(items){sql.exec('BEGIN');try{for(const item of items)await item.run();sql.exec('COMMIT');}catch(error){sql.exec('ROLLBACK');throw error;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,Date,console,require(name){if(name==='@/db')return {getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return {getChatGPTUser:async()=>user?{userId:user}:null};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw new Error(name);}});
 return {sql,setUser(value){user=value;},async post(body){return module.exports.POST(new Request('https://learn.test/api/study',{method:'POST',headers:{origin:'https://learn.test','Content-Type':'application/json'},body:JSON.stringify(body)}));},get(query=''){return module.exports.GET(new Request('https://learn.test/api/study'+query));}};
}
test('both catalogues keep twenty units; only the requested German housing chapter adds exercises',()=>{
 assert.equal(english.englishCourseUnits.length,20);
 for(const unit of english.englishCourseUnits){
  assert.equal(study.selectQuestions('test',unit.id,20,[]).length,0);
  assert.equal(study.selectQuestions('write',unit.id,20,[]).length,0);
  const german=study.selectQuestions('test',unit.id.replace(/^en-/,''),20,[]);
  if(unit.id==='en-book-11'){assert(german.length>0);assert(german.every(q=>q.id.startsWith('housing-11-')));}
  else assert.equal(german.length,0);
 }
 assert.equal(new Set(course.questionMap.keys()).size,course.questions.length+english.englishQuestions.length);
 assert.equal(course.questions.some(q=>q.id.startsWith('en-')),false);
 for(const q of english.englishQuestions){
  assert(course.gradeAnswer(q,q.answer),q.id);
  if(q.options){assert.equal(new Set(q.options).size,4,q.id);assert(q.options.includes(q.answer));}
  if(q.image)assert(fs.existsSync(path.join('public',q.image.src)),q.id);
 }
});
test('English picture and writing pools preserve categories and four test lengths',()=>{
 const all=objects.pickEnglishObjectQuiz('all','all',[]);
 const count=course.questions.filter(q=>q.id.startsWith('obj-picture-')).length;assert.equal(all.length,count);assert.equal(objects.englishObjectWritingPool().length,count*2);
 const houseCount=course.questions.filter(q=>q.id.startsWith('obj-picture-')&&q.topic==='objects-house').length;assert.equal(houseCount,23);
 for(const count of [5,10,20,'all']){const q=objects.pickEnglishObjectQuiz('objects-house',count,[]);assert.equal(q.length,count==='all'?houseCount:count);assert(q.every(item=>item.topic==='en-objects-house'));}
 assert(all.every(q=>q.id.startsWith('en-obj-picture-')&&q.options.length===4));
 const first=all[0];const reviews=[{question_id:first.id,wrong_count:1,streak:0,seen:1,due_at:0}];
 assert.deepEqual(objects.pickEnglishObjectQuiz('all','all',reviews,true).map(q=>q.id),[first.id]);
 assert.equal(objects.pickEnglishObjectQuiz('all','all',reviews,true,undefined,true).length,0);
});
test('saved progress, wrong answers and continuation stay separate for the two courses',async()=>{
 const a=app();const deId='saved-german-session-1234',enId='saved-english-session-1234';
 const de=course.questions.find(q=>q.options&&!q.audio);
 const en=english.englishQuestions.find(q=>q.options&&!q.audio);
 const deStart=await a.post({action:'start',id:deId,mode:'test',topic:de.topic,count:1,onlyIds:[de.id]});
 const enStart=await a.post({action:'start',id:enId,course:'en',mode:'test',topic:en.topic,count:2});
 assert.equal(deStart.status,201);assert.equal(enStart.status,201);
 const {session}=await enStart.json();const first=course.questionMap.get(session.questions[0].id);
 const wrong=first.options.find(value=>value!==first.answer);
 assert.equal((await a.post({action:'answer',course:'en',sessionId:enId,questionId:first.id,answer:wrong})).status,200);
 await a.post({action:'answer',course:'en',sessionId:enId,questionId:first.id,answer:wrong});
 assert.equal(a.sql.prepare('SELECT seen FROM study_review WHERE question_id=?').get(first.id).seen,1);
 const deSnapshot=await (await a.get()).json();const enSnapshot=await (await a.get('?learn=en')).json();
 assert.deepEqual(deSnapshot.sessions.map(s=>s.id),[deId]);assert.equal(deSnapshot.reviews.length,0);
 assert.deepEqual(enSnapshot.sessions.map(s=>s.id),[enId]);assert.equal(enSnapshot.reviews[0].wrong_count,1);
 const resumed=await (await a.get('?learn=en&session='+enId)).json();assert.equal(resumed.session.answers.length,1);assert.equal(resumed.session.finished_at,null);
 assert.equal((await a.get('?session='+enId)).status,404);
 assert.equal((await a.post({action:'start',id:'mismatched-course-1234',course:'en',mode:'test',topic:de.topic,count:1})).status,400);
 const second=course.questionMap.get(session.questions[1].id);await a.post({action:'answer',course:'en',sessionId:enId,questionId:second.id,answer:second.answer});
 assert((await (await a.get('?learn=en&session='+enId)).json()).session.finished_at);
 a.setUser('learner-b');assert.equal((await a.get('?learn=en&session='+enId)).status,404);assert.equal((await (await a.get('?learn=en')).json()).sessions.length,0);
});
test('English object sessions can resume and all-course sessions retain English scope',async()=>{
 const a=app();const id='english-picture-session-1234';const items=objects.pickEnglishObjectQuiz('objects-house',5,[]);
 const started=await a.post({action:'start',course:'en',id,mode:'visual',topic:'en-objects-house',count:5,onlyIds:items.map(q=>q.id)});
 assert.equal(started.status,201);const {session}=await started.json();assert(session.questions.every(q=>q.id.startsWith('en-obj-picture-')));
 const snapshot=await (await a.get('?learn=en')).json();assert.equal(snapshot.activePictureSessionId,id);
 assert.equal((await (await a.get()).json()).activePictureSessionId,null);
 const all=await (await a.post({action:'start',course:'en',id:'english-all-session-1234',mode:'test',topic:'all',count:5})).json();
 assert.equal(all.session.topic,'en-all');assert(all.session.questions.every(q=>q.id.startsWith('en-')));
});
test('speech uses the selected learning language and never chooses a German voice for English',()=>{
 const de={name:'German',lang:'de-DE',localService:true},en={name:'English',lang:'en-GB',localService:true};
 assert.equal(speech.chooseStudyVoice([de,en],'en'),en);
 assert.equal(speech.chooseStudyVoice([de,en],'de'),de);
 assert.equal(speech.chooseStudyVoice([de],'en'),undefined);
 const utterances=[];const engine={paused:false,pending:false,speaking:false,getVoices:()=>[de,en],speak(u){utterances.push(u);},cancel(){}};
 const player=speech.createGermanSpeechPlayer(engine,text=>({text}),()=>{},'en');player.speak('Hello.');assert.equal(utterances[0].lang,'en-GB');assert.equal(utterances[0].voice,en);player.stop();
});
test('learning language is independent of the explanation language and explicit links take priority',()=>{
 const values=new Map([['german-study-language','en'],['lernkoko-learning-language','de']]);const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 assert.equal(preference.readLearningLanguage(storage),'de');
 assert.equal(preference.readLearningLanguage(storage,'?learn=en'),'en');
 preference.saveLearningLanguage(storage,'en');assert.equal(values.get('german-study-language'),'en');
 values.set('german-study-language','tr');assert.equal(preference.readLearningLanguage(storage),'en');
});


test('listening rounds persist wrong picture selections and resume in both learning languages',async()=>{
 for(const language of ['de','en']){
  const a=app(),id='saved-listening-'+language+'-123456';
  const practice=require(path.join(compiled,'object-practice.js'));
  const items=language==='en'?objects.pickEnglishObjectQuiz('objects-house',5,[],false,undefined,false,true):practice.pickObjectListeningQuiz('objects-house',5,[]);
  const topic=(language==='en'?'en-':'')+'objects-house';
  const started=await a.post({action:'start',id,course:language,mode:'listen',topic,count:5,onlyIds:items.map(q=>q.id)});
  assert.equal(started.status,201);const {session}=await started.json();assert.equal(session.mode,'listen');assert.equal(session.questions.length,5);
  const first=course.questionMap.get(session.questions[0].id);assert.equal(first.kind,'listen');assert.equal(first.pictureOptions.length,4);
  const wrong=first.options.find(answer=>answer!==first.answer);
  const feedback=await (await a.post({action:'answer',course:language,sessionId:id,questionId:first.id,answer:wrong})).json();
  assert.equal(feedback.result.correct,0);assert.equal(feedback.correctAnswer,first.audio);
  const query=language==='en'?'?learn=en':'',join=query?'&':'?';
  const snapshot=await (await a.get(query)).json();assert.equal(snapshot.activePictureSessionId,id);assert.equal(snapshot.reviews[0].wrong_count,1);
  const resumed=await (await a.get(query+join+'session='+id)).json();assert.equal(resumed.session.mode,'listen');assert.equal(resumed.session.answers.length,1);
  assert.deepEqual(resumed.session.questions[1].options,session.questions[1].options);
  const second=course.questionMap.get(session.questions[1].id);
  const right=await (await a.post({action:'answer',course:language,sessionId:id,questionId:second.id,answer:second.answer})).json();assert.equal(right.result.correct,1);
  const retry=await (await a.post({action:'answer',course:language,sessionId:id,questionId:second.id,answer:second.answer})).json();assert.equal(retry.result.id,right.result.id);
 }
});

test('new plural puzzles preserve IDs, grade complete articles and resume without changing course',async()=>{
 const a=app();const plural=course.questions.find(q=>q.articlePuzzle?.variant==='plural');assert(plural);
 const singular=course.questionMap.get('obj-gap-'+plural.objectId);const id='article-puzzle-session-123456';
 const started=await a.post({action:'start',id,mode:'write',course:'de',topic:plural.topic,count:2,onlyIds:[singular.id,plural.id]});assert.equal(started.status,201);
 const {session}=await started.json();assert(session.questions.every(item=>!item.options));
 for(const item of session.questions){const q=course.questionMap.get(item.id);const answer=q.articlePuzzle?'der':q.answer;const graded=await a.post({action:'answer',sessionId:id,questionId:q.id,answer});assert.equal((await graded.json()).result.correct,q.articlePuzzle?0:1);}
 const resumed=await (await a.get('?session='+id)).json();assert.equal(resumed.session.mode,'write');assert.equal(resumed.session.answers.length,2);assert(resumed.session.finished_at);assert.deepEqual(resumed.session.questions.map(q=>q.id),session.questions.map(q=>q.id));
 assert.equal((await a.get('?session='+id+'&learn=en')).status,404);
});
