// Üye olmadan tadımlık (the learner asked, 21 October 2026): a visitor without an account can open the first part of
// every section; nothing is saved, the rest asks for a free sign-up.
const {test}=require('node:test');const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('course'),study=load('study'),guest=load('guest-taste'),parts=load('guest-parts'),auth=load('member-auth');
const read=file=>fs.readFileSync(file,'utf8');

function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));let user=null;
 const db={prepare(query){return{query,args:[],bind(...args){this.args=args;return this;},async first(){const row=sql.prepare(this.query).get(...this.args);return row??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(list){for(const item of list)await item.run();}};
 const source=ts.transpileModule(read('app/api/study/route.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return{getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return{getChatGPTUser:async()=>user?{userId:user}:null};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}});
 const rows=()=>['study_sessions','study_answers','study_review','study_notes'].reduce((n,table)=>n+Number(sql.prepare('SELECT COUNT(*) AS n FROM '+table).get().n),0);
 return {rows,user(value){user=value;},post:body=>module.exports.POST(new Request('https://study.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://study.test'},body:JSON.stringify(body)})),get:(query='')=>module.exports.GET(new Request('https://study.test/api/study'+query))};
}
const id=n=>'guest-round-000000000'+n;

test('the open part of each section is its first one',()=>{
 assert.equal(parts.GUEST_VERB_PART,load('verb-families').verbFamilies[0].id);
 assert.equal(parts.GUEST_OBJECT_GROUP,load('object-course').objectGroups[0].id);
 const housing=load('housing-course').housingSections[0];assert.equal(parts.GUEST_HOUSING_SECTION,housing.id);assert.equal(parts.GUEST_HOUSING_TOPIC,housing.topic);
 assert.equal(parts.GUEST_L12_PART,load('ausbildung-course').lessonParts[0].id);
 assert.deepEqual(parts.GUEST_GAMES,[load('verb-games').gameIds[0]]);
 // Pages that open for visitors; Hesabım and the admin page stay for members.
 for(const page of ['/konular','/ev-esyalar','/fiiller','/a1-2/ev-ve-yasam','/a1-2/ausbildung','/a1-2/ausbildung/hoeren'])assert.ok(auth.isPublicPath(page),page);
 for(const page of ['/hesabim','/yonetim'])assert.ok(!auth.isPublicPath(page),page);
});

test('only questions of the open parts count for a visitor',()=>{
 const verbIds=load('verb-workshop').partIds(load('verb-families').verbFamilies[0]);
 for(const q of verbIds)assert.ok(guest.guestQuestion(q),q);
 for(const q of load('verb-workshop').partIds(load('verb-families').verbFamilies[1]))assert.ok(!guest.guestQuestion(q),q);
 const house=course.questions.filter(q=>q.topic==='objects-house');assert.ok(house.length>20);for(const q of house)assert.ok(guest.guestQuestion(q.id),q.id);
 assert.ok(!guest.guestQuestion(course.questions.find(q=>q.topic==='objects-kitchen').id));
 assert.ok(guest.guestQuestion(course.questions.find(q=>q.topic==='book-11-a').id));assert.ok(!guest.guestQuestion(course.questions.find(q=>q.topic==='book-11-b').id));
 assert.ok(!guest.guestQuestion('nope'));
 assert.ok(guest.guestRound('workshop','verbs-all',verbIds));assert.ok(!guest.guestRound('review','verbs-all',verbIds),'no review rounds');
 assert.ok(!guest.guestRound('workshop','verbs-all',[]),'never the whole bank');assert.ok(!guest.guestRound('mixed','all',[house[0].id]));
});

test('API: a visitor starts and answers the open parts, and nothing is written',async()=>{
 const a=app();
 const snap=await (await a.get('?stats=1&tz=0')).json();assert.equal(snap.guest,true);assert.deepEqual([snap.reviews,snap.sessions,snap.notes],[[],[],{}]);
 const verbIds=load('verb-workshop').partIds(load('verb-families').verbFamilies[0]);
 const started=await a.post({action:'start',id:id(1),mode:'workshop',topic:'verbs-all',count:verbIds.length,onlyIds:verbIds});assert.equal(started.status,201);
 const {session}=await started.json();assert.equal(session.questions.length,verbIds.length);assert.equal(session.questions[0].id,verbIds[0],'the part keeps its order');
 const q=course.questionMap.get(session.questions[0].id);
 const right=await (await a.post({action:'answer',sessionId:id(1),questionId:q.id,answer:q.answer})).json();assert.equal(right.result.correct,1);assert.equal(right.correctAnswer,q.answer);
 const wrong=await (await a.post({action:'answer',sessionId:id(1),questionId:q.id,answer:'falsch'})).json();assert.equal(wrong.result.correct,0);
 const house=course.questions.filter(item=>item.topic==='objects-house'&&item.id.startsWith('obj-picture-')).slice(0,5).map(item=>item.id);
 assert.equal((await a.post({action:'start',id:id(2),mode:'visual',topic:'objects-house',count:5,onlyIds:house})).status,201);
 const housing=course.questions.filter(item=>item.topic==='book-11-a'&&item.kind==='write').slice(0,4).map(item=>item.id);
 assert.equal((await a.post({action:'start',id:id(3),mode:'write',topic:'book-11-a',count:4,onlyIds:housing})).status,201);
 assert.equal(a.rows(),0,'nothing saved for a visitor');
 // The rest asks for an account.
 const locked=await a.post({action:'start',id:id(4),mode:'workshop',topic:'verbs-all',count:4,onlyIds:load('verb-workshop').partIds(load('verb-families').verbFamilies[1]).slice(0,4)});
 assert.equal(locked.status,401);assert.equal((await locked.json()).guest,true);
 const kitchen=course.questions.find(item=>item.topic==='objects-kitchen');
 assert.equal((await a.post({action:'answer',sessionId:id(2),questionId:kitchen.id,answer:kitchen.answer})).status,401);
 assert.equal((await a.post({action:'note',key:'star:'+q.id,value:'1'})).status,401,'stars need an account');
 assert.equal((await a.get('?session='+id(1))).status,404);
 assert.equal(a.rows(),0);
 // A member is not touched by any of this.
 a.user('member-1');assert.equal((await a.post({action:'start',id:id(5),mode:'workshop',topic:'verbs-all',count:verbIds.length,onlyIds:verbIds})).status,201);assert.ok(a.rows()>0);
});

test('pages: the first part opens, the rest carries a lock and the sign-up, every text in every site language',()=>{
 for(const [file,component] of [['app/konular/page.tsx','StudyApp page="units"'],['app/fiiller/page.tsx','VerbStudy'],['app/ev-esyalar/page.tsx','ObjectStudy'],['app/a1-2/ev-ve-yasam/page.tsx','HousingStudy'],['app/a1-2/ausbildung/page.tsx','AusbildungStudy'],['app/a1-2/ausbildung/hoeren/page.tsx','AusbildungHoeren']]){
  const page=read(file);assert.ok(page.includes('<'+component+' guest={!(await getChatGPTUser())}/>'),file);
 }
 for(const file of ['app/category-study.tsx','app/verb-study.tsx','app/object-study.tsx','app/housing-study.tsx','app/ausbildung-study.tsx','app/ausbildung-hoeren.tsx']){
  const code=read(file);assert.ok(code.includes('{guest&&<GuestBanner language={language} back=')&&code.includes('guest={guest}/>'),file);
 }
 for(const file of ['app/verb-study.tsx','app/object-study.tsx','app/housing-study.tsx'])assert.ok(read(file).includes('{guest&&<GuestMore language={language} back={back}/>}'),file+': a sign-up card at the end of a round');
 const verb=read('app/verb-study.tsx');assert.ok(verb.includes("guest&&!GUEST_GAMES.includes(id)?<a key={id} className={'game-card game-'+id+' guest-locked'} href={guestSignUp(back)}")&&verb.includes("section==='mistakes'&&guest?"));
 assert.ok(read('app/object-study.tsx').includes('if(guest&&id!==GUEST_OBJECT_GROUP)return <article'));
 assert.ok(read('app/housing-study.tsx').includes('const lockedSection=(id:HousingSection|\'all\')=>guest&&id!==GUEST_HOUSING_SECTION;'));
 assert.ok(read('app/ausbildung-study.tsx').includes('{current&&step&&guest&&current.id!==GUEST_L12_PART?'));
 assert.ok(read('app/site-header.tsx').includes("href={guest?'/giris':'/hesabim'}"));
 const shared=read('app/guest-taste.tsx');assert.ok(shared.includes("'/uye-ol?return_to='+encodeURIComponent(back)"));
 // The landing page offers the try-out on every part but Yanlışlarım.
 const landing=read('app/landing.tsx');for(const href of ['/konular','/ev-esyalar','/fiiller',"/fiiller?bolum=oyunlar"])assert.ok(landing.includes("href:'"+href+"'"),href);
 assert.ok(landing.includes('data-landing-try={item.part}')&&landing.includes('data-landing-try-top'));
 // Texts.
 const copy=load('guest-copy'),site=load('site-languages');
 for(const [key,tuple] of Object.entries(copy.guestCopy))assert.equal(tuple.length,12,key);
 for(const language of site.packLanguages.filter(id=>site.siteLanguageIndex(id)>=12)){
  const pack=JSON.parse(read('lib/language-packs/'+language+'.json'));
  for(const [key,tuple] of Object.entries(copy.guestCopy))assert.ok(pack[tuple[2]]?.trim(),language+' '+key);
 }
});
