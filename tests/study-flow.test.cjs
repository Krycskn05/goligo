const {test}=require('node:test');const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');const course=require(path.join(compiled,'course.js')),study=require(path.join(compiled,'study.js')),practice=require(path.join(compiled,'study-practice.js'));
test('visible practice choices match server selection, including empty and active review pools',()=>{
 const first=course.questions[0];const reviews=[{question_id:first.id,wrong_count:1,streak:0,seen:1,last_answer:'falsch',last_wrong:'falsch',last_at:1,due_at:1}];
 for(const mode of Object.keys(course.modeLabels))for(const topic of ['all','unit-1','unit-8','unit-9',...course.topics.map(t=>t.id)]){
  assert.equal(practice.hasPractice(mode,topic,reviews),study.selectQuestions(mode,topic,1,reviews).length>0,mode+' '+topic);
 }
 assert.equal(practice.hasPractice('review','all',[]),false);
 assert.equal(practice.hasPractice('visual','unit-1'),false);
});
function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));let user='student-a';
 const db={prepare(query){return{query,args:[],bind(...args){this.args=args;return this;},async first(column){const row=sql.prepare(this.query).get(...this.args);return column?row?.[column]??null:row??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(list){sql.exec('BEGIN');try{const result=[];for(const item of list)result.push(await item.run());sql.exec('COMMIT');return result;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};const context={module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return{getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return{getChatGPTUser:async()=>user?{userId:user}:null};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}};vm.runInNewContext(source,context);
 return {sql,api:module.exports,user(value){user=value;},async post(body){return module.exports.POST(new Request('https://study.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://study.test'},body:JSON.stringify(body)}));},get(query=''){return module.exports.GET(new Request('https://study.test/api/study'+query));}};
}
test('every ready topic has questions and supported mode pools are nonempty',()=>{for(const topic of course.topics)assert(study.selectQuestions('mixed',topic.id,10,[]).length>0,topic.id);for(const topic of course.topics.filter(x=>x.unit===9))assert(practice.practicePool('mixed',9,topic.id).length>0,topic.id);assert.equal(practice.practicePool('visual',1).length,0);assert(practice.practicePool('visual',9).every(q=>q.image));assert(practice.practicePool('dictation',9).every(q=>q.audio===q.answer));assert(practice.practicePool('sentence',9).every(q=>q.audio!==q.answer));});
test('start, wrong explanation, correct answer, finish, history and saved progress work end to end',async()=>{
 const a=app();const choice=course.questions.find(q=>q.kind==='choice'&&!q.audio),write=course.questions.find(q=>q.kind==='write'&&!q.audio);const id='test-session-first-1234';const started=await a.post({action:'start',id,mode:'mixed',topic:'all',count:2,onlyIds:[choice.id,write.id]});assert.equal(started.status,201);const {session}=await started.json();assert.equal(session.questions.length,2);
 const first=course.questionMap.get(session.questions[0].id);const wrong=first.options?.find(x=>x!==first.answer)??'falsch';const bad=await a.post({action:'answer',sessionId:id,questionId:first.id,answer:wrong});const result=await bad.json();assert.equal(result.result.correct,0);assert.equal(result.correctAnswer,first.answer);assert(result.explanation.trim());
 const repeated=await a.post({action:'answer',sessionId:id,questionId:first.id,answer:wrong});assert.equal(repeated.status,200);assert.equal(a.sql.prepare('SELECT seen FROM study_review WHERE question_id=?').get(first.id).seen,1);
 const second=course.questionMap.get(session.questions[1].id);const right=await a.post({action:'answer',sessionId:id,questionId:second.id,answer:second.answer});assert.equal((await right.json()).result.correct,1);
 const resume=await (await a.get('?session='+id)).json();assert.equal(resume.session.answers.length,2);assert(resume.session.finished_at);
 const snapshot=await (await a.get()).json();assert.equal(snapshot.sessions[0].answered,2);assert.equal(snapshot.sessions[0].correct,1);assert(snapshot.reviews.some(r=>r.question_id===first.id&&r.wrong_count===1));
 const note=await a.post({action:'note',key:'lesson:'+course.topics[0].id,value:'done'});assert.equal(note.status,200);assert.equal((await (await a.get()).json()).notes['lesson:'+course.topics[0].id],'done');
});
test('out-of-order answers, invalid options and answers from another account are rejected',async()=>{
 const a=app();const picks=course.questions.filter(q=>q.options).slice(0,2);const id='test-session-order-12345';const {session}=await (await a.post({action:'start',id,mode:'mixed',topic:'all',count:2,onlyIds:picks.map(q=>q.id)})).json();
 assert.equal((await a.post({action:'answer',sessionId:id,questionId:session.questions[1].id,answer:course.questionMap.get(session.questions[1].id).answer})).status,409);
 assert.equal((await a.post({action:'answer',sessionId:id,questionId:session.questions[0].id,answer:'invented option'})).status,400);
 a.user('student-b');assert.equal((await a.get('?session='+id)).status,404);assert.equal((await a.post({action:'answer',sessionId:id,questionId:session.questions[0].id,answer:picks[0].answer})).status,404);assert.equal((await (await a.get()).json()).sessions.length,0);a.user(null);assert.equal((await a.get()).status,401);
});
test('question IDs, canonical answers, supported variants, audio and images stay valid',()=>{
 assert.equal(new Set(course.questions.map(q=>q.id)).size,course.questions.length);
 for(const q of course.questions){assert(course.gradeAnswer(q,q.answer),q.id);for(const variant of q.accepted??[])assert(course.gradeAnswer(q,variant),q.id);if(q.options){assert.equal(new Set(q.options).size,4,q.id);assert(q.options.includes(q.answer),q.id);}if(q.image)assert(fs.existsSync(path.join('public',q.image.src)),q.id);}
 for(const topic of course.topics)for(const block of topic.blocks)if(block.image)assert(fs.existsSync(path.join('public',block.image.src)),block.image.src);
 assert(fs.existsSync('public/unit-9/Almanca_A1_Unite_9_Ozgun_Notlar.pdf'));assert.equal(fs.readdirSync('public/unit-9').some(x=>x.endsWith('.jpg')||x==='sources'||x==='visual'),false);
});
test('retry identifiers change with practice configuration instead of resuming a different test',()=>{assert.notEqual(practice.retryKey('write','unit-9',10,['a']),practice.retryKey('visual','unit-9',10,['a']));assert.notEqual(practice.retryKey('write','unit-9',10,['a']),practice.retryKey('write','unit-9',20,['a']));assert.equal(practice.retryKey('write','unit-9',10,['a']),practice.retryKey('write','unit-9',10,['a']));});

test('category rounds stay inside the chosen topic and automatically cover available activity types',()=>{
 const {groups,questionFamily}=require(path.join(compiled,'study-categories.js'));
 const grouped=groups.flatMap(g=>g.ids);assert.equal(new Set(grouped).size,course.topics.length);assert.deepEqual(new Set(grouped),new Set(course.topics.map(t=>t.id)));
 for(const topic of course.topics){const pool=course.questions.filter(q=>q.topic===topic.id);for(let trial=0;trial<8;trial++){const round=study.selectQuestions('mixed',topic.id,20,[]);assert.equal(round.length,Math.min(20,pool.length));assert(round.every(q=>q.topic===topic.id));assert.equal(new Set(round.map(q=>q.id)).size,round.length);assert.deepEqual(new Set(round.map(questionFamily)),new Set(pool.map(questionFamily)),topic.id);}}
});
test('saved vocabulary and all listening or reading texts have meanings in each helper language',()=>{
 const {lessonTranslation}=require(path.join(compiled,'lesson-translations.js'));
 const texts=[...new Set(course.questions.flatMap(q=>[q.audio,q.passage]).filter(Boolean))];
 for(const lang of ['tr','de','en','ar','uk','fr']){for(const text of texts)assert(lessonTranslation(text,lang),lang+': '+text);for(const word of course.words)assert(lessonTranslation(word.de,lang),lang+': '+word.de);const {answerSource}=require(path.join(compiled,'lesson-translations.js'));for(const q of course.questions.filter(q=>answerSource(q)==='de'))assert(lessonTranslation(q.answer,lang),lang+': '+q.answer);}
 assert.match(lessonTranslation('Ich habe zwischen drei und fünf Uhr Zeit.','en'),/between 3 and 5/);
 assert.match(lessonTranslation('Ich möchte nicht arbeiten.','tr'),/istemiyorum/);
 assert.match(lessonTranslation('Suri möchte nicht aufstehen.','en'),/does not want/);
 assert.equal(lessonTranslation('Ich muss morgen Pizza auf dem Mond fliegen.','tr'),null,'unknown free text must not be invented or substituted with the model answer');
});
test('feedback is specific to the question rather than an unrelated topic rule',()=>{
 const {explanationText}=require(path.join(compiled,'question-display.js'));
 for(const question of course.questions)assert.equal(explanationText(question,'tr'),question.explanation);
 const modal=course.questions.find(q=>/mastar.*son/.test(q.explanation));assert(modal);assert.match(explanationText(modal,'en'),/modal verb/);
 const source=fs.readFileSync('app/category-study.tsx','utf8');assert(!source.includes("'rememberRule'"));assert(source.includes('explanationText(question,language)'));assert(!source.includes("start('write'"));
});

test('A1.1 and A1.2 contain only their twenty catalogue headings',()=>{
 const {courseUnits,levelTopics,levelWords,levelQuestions}=require(path.join(compiled,'level-course.js'));
 assert.equal(courseUnits.length,20);assert.equal(levelWords.length,0);assert.equal(levelQuestions.length,0);
 for(const topic of levelTopics){assert.equal(topic.blocks.length,0);assert.equal(topic.lead,'');for(const mode of ['test','write','mixed'])assert.equal(study.selectQuestions(mode,topic.id,20,[]).length,0);}
 for(const level of ['a11-all','a12-all'])for(const mode of ['test','write','mixed'])assert.equal(study.selectQuestions(mode,level,20,[]).length,0);
});

test('written gap answers, incorrect answers, saved mode and continuation persist through the study API',async()=>{
 const a=app();const topic='objects-house';
 const ids=study.selectQuestions('write',topic,2000,[]).filter(q=>q.gap).slice(0,3).map(q=>q.id);
 assert.equal(ids.length,3);
 const id='test-written-session-123456';
 const response=await a.post({action:'start',id,mode:'write',topic,count:3,onlyIds:ids});assert.equal(response.status,201);
 const {session}=await response.json();assert.equal(session.mode,'write');assert(session.questions.every(q=>!q.options));
 const first=course.questionMap.get(session.questions[0].id);
 const wrong=await a.post({action:'answer',sessionId:id,questionId:first.id,answer:'falsch'});assert.equal((await wrong.json()).result.correct,0);
 const resumed=(await (await a.get('?session='+id)).json()).session;assert.equal(resumed.mode,'write');assert.equal(resumed.answers.length,1);assert.equal(resumed.questions[1].id,session.questions[1].id);
 for(const question of session.questions.slice(1)){const q=course.questionMap.get(question.id);const correct=await a.post({action:'answer',sessionId:id,questionId:q.id,answer:q.answer});assert.equal((await correct.json()).result.correct,1);}
 const snapshot=await (await a.get()).json();assert.equal(snapshot.sessions[0].mode,'write');assert(snapshot.sessions[0].finished_at);assert.equal(snapshot.sessions[0].correct,2);
 const review=study.selectQuestions('write',topic,20,snapshot.reviews,[first.id]);assert.equal(review.length,1);assert.equal(review[0].id,first.id);
 const tested=await a.post({action:'start',id:'test-choice-session-123456',mode:'test',topic,count:5});assert.equal(tested.status,201);assert((await tested.json()).session.questions.every(q=>q.options.length===4));
});

test('object picture tests retain four choices and writing includes both names and article gaps',()=>{
 const objects=require(path.join(compiled,'object-course.js'));const p=require(path.join(compiled,'object-practice.js'));
 for(const group of ['all',...objects.objectGroups.map(g=>g.id)]){
  const picture=p.pickPictureQuiz(group,'all',[]);assert(picture.every(q=>p.isObjectPictureQuestion(q)&&q.options.length===4));
  const writing=p.pickObjectWritingQuiz(group,'all',[]);assert.equal(writing.length,picture.length*2);
  assert(writing.every(q=>p.isObjectWritingQuestion(q)&&!q.options));assert(writing.some(q=>q.gap));assert(writing.some(q=>!q.gap));
  const short=p.pickObjectWritingQuiz(group,5,[]);assert.equal(short.length,Math.min(5,writing.length));assert(short.some(q=>q.gap));assert(short.some(q=>!q.gap));
  for(const q of writing){assert(course.gradeAnswer(q,q.answer),q.id);if(q.gap)assert(['der','die','das'].includes(q.answer));}
 }
 const {vaultLanguages,vaultText}=require(path.join(compiled,'object-vault-copy.js'));
 for(const language of vaultLanguages)for(const key of ['testPractice','writePractice','writeDetail','writePrompt','fillGap','checkAnswer','yourAnswer','writingDone'])assert(vaultText(language.id,key).trim(),language.id+' '+key);
});
