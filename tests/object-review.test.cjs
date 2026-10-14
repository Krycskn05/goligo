const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const {DatabaseSync}=require('node:sqlite');const ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('course'),study=load('study'),practice=load('object-practice'),copy=load('object-vault-copy'),subgroups=load('object-subgroups');
const seeded=seed=>{let state=seed>>>0;return()=>(state=(Math.imul(state,1103515245)+12345)>>>0)/4294967296;};
const row=(question_id,wrong_count,streak)=>({question_id,wrong_count,streak,seen:1,last_answer:'',last_wrong:'',last_at:0,due_at:0});
const modes={test:[practice.pickPictureQuiz,q=>practice.isObjectPictureQuestion(q)],write:[practice.pickObjectWritingQuiz,q=>practice.isObjectWritingQuestion(q)],listen:[practice.pickObjectListeningQuiz,q=>practice.isObjectListeningQuestion(q)]};
const poolOf=(mode,group)=>course.questions.filter(q=>modes[mode][1](q)&&(group==='all'||q.topic===group));

test('Nesne Kasası rounds are shuffled anew and skip solved questions in every mode',()=>{
 for(const [mode,[pick]] of Object.entries(modes)){
  const pool=poolOf(mode,'objects-house');assert(pool.length>12,mode);
  const one=pick('objects-house',10,[],false,undefined,{fresh:true,random:seeded(1)}).map(q=>q.id);
  const two=pick('objects-house',10,[],false,undefined,{fresh:true,random:seeded(2)}).map(q=>q.id);
  assert.equal(one.length,10);assert.notDeepEqual(one,two,mode+' a new random order each time');
  const solved=pool.slice(4).map(q=>row(q.id,0,1));const wrong=row(pool[0].id,2,0);const cleared=row(pool[1].id,1,3);
  const reviews=[...solved,wrong,cleared];
  for(let seed=1;seed<6;seed++){
   const round=pick('objects-house',10,reviews,false,undefined,{fresh:true,random:seeded(seed)}).map(q=>q.id).sort();
   assert.deepEqual(round,[pool[0].id,pool[2].id,pool[3].id].sort(),mode+' only the unsolved questions and the open mistake are left');
  }
  const allSolved=pool.map(q=>row(q.id,0,1));
  assert.equal(pick('objects-house',10,allSolved,false,undefined,{fresh:true,random:seeded(3)}).length,10,mode+' when everything is solved the round mixes all of them again');
  const roundMistakes=pool.slice(4,7).map(q=>q.id);
  assert.deepEqual(pick('objects-house','all',reviews,false,roundMistakes).map(q=>q.id).sort(),[...roundMistakes].sort(),mode+' reviewing one round keeps the chosen questions');
 }
});

test('a sub-topic round also leaves out what is already solved',()=>{
 const group=subgroups.objectSubgroups[0];const ids=poolOf('test',group.parent).filter(q=>subgroups.inObjectSubgroup(q,group.id)).map(q=>q.id);assert(ids.length>2);
 const reviews=ids.slice(1).map(id=>row(id,0,2));
 assert.deepEqual(practice.pickPictureQuiz(group.parent,10,reviews,false,ids,{fresh:true}).map(q=>q.id),[ids[0]]);
});

test('the review button covers open mistakes and starred questions',()=>{
 for(const [mode,[pick]] of Object.entries(modes)){
  const pool=poolOf(mode,'objects-furniture');
  const mistake=row(pool[2].id,1,0),cleared=row(pool[3].id,2,3),starredSolved=row(pool[5].id,0,4);
  const starred=study.starredQuestionIds({[study.starNoteKey(pool[5].id)]:'1',[study.starNoteKey(pool[6].id)]:'1',[study.starNoteKey(pool[7].id)]:'','profile':'x'});
  const review=pick('objects-furniture','all',[mistake,cleared,starredSolved],true,undefined,{starred,random:seeded(4)}).map(q=>q.id).sort();
  assert.deepEqual(review,[pool[2].id,pool[5].id,pool[6].id].sort(),mode);
  assert.equal(pick('objects-furniture','all',[cleared],true,undefined,{starred:new Set()}).length,0,mode+' nothing to review');
  assert(practice.isObjectSolved(cleared)&&!practice.isObjectSolved(mistake)&&!practice.isObjectSolved(undefined));
 }
});

test('stars on Nesne Kasası questions are saved for the signed-in learner',async()=>{
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));
 const db={prepare(query){return {query,args:[],bind(...args){this.args=args;return this;},async first(column){const r=sql.prepare(this.query).get(...this.args);return column?r?.[column]??null:r??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(items){const result=[];for(const item of items)result.push(await item.run());return result;}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return {getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return {getChatGPTUser:async()=>({userId:'vault-student'})};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}});
 const post=body=>module.exports.POST(new Request('https://vault.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://vault.test'},body:JSON.stringify(body)}));
 const picture=poolOf('test','all')[0].id,listen=poolOf('listen','all')[0].id,write=poolOf('write','all')[0].id;
 for(const id of [picture,listen,write])assert.equal((await post({action:'note',key:study.starNoteKey(id),value:'1'})).status,200,id);
 assert.equal((await post({action:'note',key:study.starNoteKey(listen),value:''})).status,200);
 const snapshot=await (await module.exports.GET(new Request('https://vault.test/api/study'))).json();
 assert.deepEqual([...study.starredQuestionIds(snapshot.notes)].sort(),[picture,write].sort());
});

test('the Nesne Kasası page shows the star, the combined review button and the unsolved counter',()=>{
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 assert(page.includes('toggleStar(q.id)')&&page.includes('starredQuestionIds(snapshot.notes)'));
 assert(page.includes("{starred,fresh:!reviewOnly&&!onlyIds}"),'normal rounds skip solved questions, reviews add stars');
 assert(page.includes('disabled={busy||!ready||!marked.length}'),'the review button is active whenever there are mistakes or stars');
 assert(page.includes("text(course==='de'?'reviewMarked':'reviewMistakes')")&&page.includes("text('remaining',{n:unsolved})"));
 for(const {id} of copy.vaultLanguages)for(const key of ['star','unstar','reviewMarked','remaining','allSolved','starTip','starError']){
  const value=copy.vaultText(id,key,{n:7});assert(value&&value.trim()&&value!==key,id+' '+key);assert(!value.includes('{n}'),id+' '+key);
 }
 assert.match(copy.vaultText('tr','remaining',{n:7}),/^7 /);
 assert.equal(copy.vaultText('tr','reviewMarked'),'Yanlışları ve yıldızlıları tekrar et');
});

test('Nesne Kasası has no separate voice panel; voice and speed live in the top settings button on every page',()=>{
 const vault=fs.readFileSync('app/object-study.tsx','utf8');
 assert(!vault.includes('GermanSpeechSettings')&&!vault.includes('vault-speech-settings'),'the in-page Ses ve dinleme panel is gone');
 assert(!fs.existsSync('app/german-speech-settings.tsx'));
 for(const file of ['app/object-study.tsx','app/housing-study.tsx','app/category-study.tsx'])assert(fs.readFileSync(file,'utf8').includes('<EffectsSettingsButton'),file);
 const dialog=fs.readFileSync('app/learning-effects.tsx','utf8');
 assert(dialog.includes('speech.setVoiceName(id)')&&dialog.includes('speech.setRate(value)')&&dialog.includes('germanSpeechPreview'),'the top dialog chooses the voice, the speed and plays a sample');
});
