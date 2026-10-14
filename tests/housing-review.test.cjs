const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const {DatabaseSync}=require('node:sqlite');const ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const course=require(path.join(compiled,'course.js'));const study=require(path.join(compiled,'study.js'));const housing=require(path.join(compiled,'housing-course.js'));const copy=require(path.join(compiled,'housing-copy.js'));
const seeded=seed=>{let state=seed>>>0;return()=>(state=(Math.imul(state,1103515245)+12345)>>>0)/4294967296;};
const row=(question_id,wrong_count,streak)=>({question_id,wrong_count,streak,seen:1,last_answer:'',last_wrong:'',last_at:0,due_at:0});

test('every round is shuffled anew and skips questions that are already solved',()=>{
 const pool=housing.housingPool('a','write');
 const one=housing.pickHousingQuestions('a','write',10,[],0,false,undefined,new Set(),seeded(1)).map(q=>q.id);
 const two=housing.pickHousingQuestions('a','write',10,[],0,false,undefined,new Set(),seeded(2)).map(q=>q.id);
 assert.equal(one.length,10);assert.notDeepEqual(one,two,'a new random order each time');
 const solved=pool.slice(0,pool.length-4).map(q=>row(q.id,0,1));const wrong=row(pool[0].id,2,0);
 const reviews=[...solved.slice(1),wrong];
 for(let seed=1;seed<6;seed++){
  const round=housing.pickHousingQuestions('a','write',10,reviews,0,false,undefined,new Set(),seeded(seed));
  assert.equal(round.length,5,'only the four unsolved questions and the open mistake are left');
  assert(round.every(q=>!housing.isHousingSolved(reviews.find(r=>r.question_id===q.id))));
 }
 const allSolved=pool.map(q=>row(q.id,0,1));
 assert.equal(housing.pickHousingQuestions('a','write',10,allSolved,0,false,undefined,new Set(),seeded(3)).length,10,'when everything is solved the round mixes all of them again');
 assert(housing.isHousingSolved(row('x',1,3)),'three correct answers in a row clear a mistake');assert(!housing.isHousingSolved(row('x',1,1)));
});

test('the review button covers mistakes and starred questions in both test and writing',()=>{
 const write=housing.housingPool('b','write');const tests=housing.housingPool('b','test');
 const mistake=row(write[2].id,1,0);const solvedWrong=row(write[3].id,1,3);
 const starredWrite=write[5].id;const starredChoiceOnly=tests.find(q=>!housing.housingQuestionMap.has(housing.housingBaseId(q.id)));assert(starredChoiceOnly);
 const starred=study.starredQuestionIds({[study.starNoteKey(starredWrite)]:'1',[study.starNoteKey(housing.housingBaseId(starredChoiceOnly.id))]:'1',[study.starNoteKey(write[7].id)]:'','profile':'x'});
 assert.deepEqual([...starred].sort(),[starredWrite,housing.housingBaseId(starredChoiceOnly.id)].sort());
 const writeReview=housing.pickHousingQuestions('b','write','all',[mistake,solvedWrong],0,true,undefined,starred,seeded(4)).map(q=>q.id).sort();
 assert.deepEqual(writeReview,[mistake.question_id,starredWrite].sort());
 const testReview=housing.pickHousingQuestions('b','test','all',[mistake],0,true,undefined,starred,seeded(5)).map(q=>q.id);
 assert(testReview.includes(starredWrite+'-test'),'a star on the writing version also marks its test version');
 assert(testReview.includes(starredChoiceOnly.id));
 assert.equal(housing.pickHousingQuestions('c','write','all',[],0,true,undefined,new Set()).length,0);
 for(const language of ['tr','de','en','ar','uk','fr'])for(const key of ['star','unstar','reviewMarked','allSolved'])assert(copy.housingText(language,key).trim(),key+' '+language);
 assert.match(copy.housingText('tr','remaining',{n:7}),/7/);
});

function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));
 const db={prepare(query){return {query,args:[],bind(...args){this.args=args;return this;},async first(column){const r=sql.prepare(this.query).get(...this.args);return column?r?.[column]??null:r??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(items){sql.exec('BEGIN');try{const result=[];for(const item of items)result.push(await item.run());sql.exec('COMMIT');return result;}catch(error){sql.exec('ROLLBACK');throw error;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return {getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return {getChatGPTUser:async()=>({userId:'star-student'})};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}});
 return {post(body){return module.exports.POST(new Request('https://housing.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://housing.test'},body:JSON.stringify(body)}));},get(query=''){return module.exports.GET(new Request('https://housing.test/api/study'+query));}};
}

test('stars are saved for the signed-in learner and come back on every device',async()=>{
 const a=app();const id='housing-11-a-trap-formal-ihr';const choiceOnly='housing-11-b-trap-gefunden';
 assert.equal((await a.post({action:'note',key:study.starNoteKey(id),value:'1'})).status,200);
 assert.equal((await a.post({action:'note',key:study.starNoteKey(choiceOnly),value:'1'})).status,200,'a choice-only exercise can be starred by its base id');
 assert.equal((await a.post({action:'note',key:study.starNoteKey('housing-11-a-nope'),value:'1'})).status,400);
 assert.equal((await a.post({action:'note',key:study.starNoteKey(id),value:'yes'})).status,400);
 let snapshot=await (await a.get()).json();assert.deepEqual([...study.starredQuestionIds(snapshot.notes)].sort(),[choiceOnly,id].sort());
 assert.equal((await a.post({action:'note',key:study.starNoteKey(id),value:''})).status,200);
 snapshot=await (await a.get()).json();assert.deepEqual([...study.starredQuestionIds(snapshot.notes)],[choiceOnly]);
});

test('the Wohnen page offers a star on each question and one review button for mistakes and stars',()=>{
 const page=fs.readFileSync('app/housing-study.tsx','utf8');
 assert(page.includes('toggleStar(q.id)')&&page.includes("h('reviewMarked')")&&page.includes('starredQuestionIds(snapshot.notes)'));
 assert(page.includes('pickHousingQuestions(section,mode,count,snapshot.reviews,step,reviewOnly,onlyIds,starred)'));
 assert(page.includes('disabled={busy||!ready||!marked.length}'),'the review button is active whenever there are mistakes or stars');
});
