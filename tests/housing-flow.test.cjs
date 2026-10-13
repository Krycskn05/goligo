const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const {DatabaseSync}=require('node:sqlite');const ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const course=require(path.join(compiled,'course.js'));const study=require(path.join(compiled,'study.js'));const housing=require(path.join(compiled,'housing-course.js'));const puzzle=require(path.join(compiled,'letter-puzzle.js'));
test('lesson notes render before practice controls, with sentence parts and translated explanations in every helper language',()=>{
 const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
 const source=ts.transpileModule(fs.readFileSync('app/housing-lesson.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const module={exports:{}};vm.runInNewContext(source,{module,exports:module.exports,require(name){if(name==='@/lib/housing-course')return housing;if(name.startsWith('@/lib/'))return require(path.join(compiled,name.slice('@/lib/'.length)+'.js'));return require(name);}});
 const notes=require(path.join(compiled,'housing-lessons.js'));const {translate}=require(path.join(compiled,'study-languages.js'));
 for(const section of housing.housingSections)for(const language of ['tr','de','en','ar','uk','fr']){
  const html=renderToStaticMarkup(React.createElement(module.exports.HousingLessonNotes,{section:section.id,language,onBack(){},onContinue(){},onSpeak(){}}));
  assert(html.includes('housing-sentence-frame'));assert(html.includes('data-lesson-step'));
  assert(!html.includes('letter-puzzle'));assert(!html.includes('object-options'));
  for(const step of notes.housingLessons[section.id].steps){assert(translate(step.title,language).trim());assert(translate(step.text,language).trim());}
 }
 const b=renderToStaticMarkup(React.createElement(module.exports.HousingLessonNotes,{section:'b',language:'tr',onBack(){},onContinue(){},onSpeak(){}}));
 assert(b.includes('Yardımcı fiil'));assert(b.includes('Partizip II'));assert(b.includes('gefunden'));assert(b.includes('Bir daire buldum.'));
});
function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));let user='housing-student';
 const db={prepare(query){return {query,args:[],bind(...args){this.args=args;return this;},async first(column){const row=sql.prepare(this.query).get(...this.args);return column?row?.[column]??null:row??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(items){sql.exec('BEGIN');try{const result=[];for(const item of items)result.push(await item.run());sql.exec('COMMIT');return result;}catch(error){sql.exec('ROLLBACK');throw error;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return {getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return {getChatGPTUser:async()=>user?{userId:user}:null};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}});
 return {sql,user(value){user=value;},post(body){return module.exports.POST(new Request('https://housing.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://housing.test'},body:JSON.stringify(body)}));},get(query=''){return module.exports.GET(new Request('https://housing.test/api/study'+query));}};
}
test('each A–D section is registered, scoped, complete and writable with the shared puzzle',()=>{
 assert.equal(new Set(course.questionMap.keys()).size,course.questionMap.size);
 for(const section of housing.housingSections){
  const writing=housing.housingPool(section.id,'write');assert(writing.length>10,section.id);
  assert.equal(study.selectQuestions('write',section.topic,2000,[]).length,writing.length);
  for(const step of section.steps.keys())assert(housing.housingPool(section.id,'write',step+1).length>0);
  for(const q of housing.housingPool(section.id,'test')){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.answer));}
  for(const q of writing){
   assert(course.questionMap.has(q.id));assert(course.gradeAnswer(q,q.answer));assert(!course.gradeAnswer(q,'xyz'));
   for(const language of ['tr','de','en','ar','uk','fr'])assert(housing.housingMeaning(q,language).trim(),q.id+' '+language);
   const model=puzzle.makeLetterPuzzle(q.answer,q.id);assert(model.editable.length>0);
   const letters=Object.fromEntries(model.parts.filter(part=>part.editable).map(part=>[part.index,part.character]));const solved=puzzle.completeLetterPuzzle(model,letters);
   assert(solved.complete);assert(course.gradeAnswer(q,solved.answer));
  }
 }
 assert.equal(study.selectQuestions('write','book-11',2000,[]).length,housing.housingPool('all','write').length);
});
test('new housing answers, mistakes, retries and continuation persist through the actual study API',async()=>{
 const a=app();const picks=[housing.housingQuestionMap.get('housing-11-a-possessive-unsere'),housing.housingQuestionMap.get('housing-11-b-cook')];const id='housing-session-persistence-1234';
 const started=await a.post({action:'start',course:'de',id,mode:'write',topic:'book-11',count:2,onlyIds:picks.map(q=>q.id)});assert.equal(started.status,201);
 const session=(await started.json()).session;assert.equal(session.questions.length,2);
 const first=course.questionMap.get(session.questions[0].id);const saved=await a.post({action:'answer',sessionId:id,questionId:first.id,answer:'xyz'});assert.equal(saved.status,200);assert.equal((await saved.json()).result.correct,0);
 await a.post({action:'answer',sessionId:id,questionId:first.id,answer:'xyz'});assert.equal(a.sql.prepare('SELECT seen FROM study_review WHERE question_id=?').get(first.id).seen,1);
 const resumed=(await (await a.get('?session='+id)).json()).session;assert.equal(resumed.answers.length,1);assert.equal(resumed.mode,'write');assert.equal(resumed.topic,'book-11');assert.equal(resumed.finished_at,null);
 const second=course.questionMap.get(resumed.questions[1].id);const correct=await a.post({action:'answer',sessionId:id,questionId:second.id,answer:second.answer});assert.equal((await correct.json()).result.correct,1);
 const finished=(await (await a.get('?session='+id)).json()).session;assert(finished.finished_at);assert.equal(finished.answers.length,2);
 const snapshot=await (await a.get()).json();assert(snapshot.reviews.some(row=>row.question_id===first.id&&row.wrong_count===1));
 a.user('another-student');assert.equal((await a.get('?session='+id)).status,404);
});
