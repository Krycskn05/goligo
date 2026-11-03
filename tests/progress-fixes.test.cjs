// Progress fixes (2 November 2026, the learner: "the percentage does not go up, the tick does not come, the place where I
// stopped is forgotten, my progress is not on the other device").
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {DatabaseSync}=require('node:sqlite');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const progress=load('progress'),sync=load('lesson-sync'),place=load('last-place'),workshop=load('verb-workshop'),families=load('verb-families');
const read=file=>fs.readFileSync(file,'utf8');
const row=(id,seen,wrong,streak)=>({question_id:id,wrong_count:wrong,streak,seen,last_answer:'',last_wrong:'',last_at:0,due_at:0});

test('an exercise answered right once stays learned; a written exercise and its choice copy are one exercise',()=>{
 assert(progress.isLearned(row('a',3,2,0)),'right once, wrong twice since');assert(!progress.isLearned(row('a',2,2,0)),'never right');
 assert.equal(progress.topicProgress(['a','b'],[row('a',3,2,0)]).learned,1);
 const pair=progress.topicProgress(['w','w-test','x'],[row('w-test',1,0,1)]);
 assert.deepEqual([pair.total,pair.learned,pair.tried],[2,1,1],'w and w-test are one exercise');
 const ids=progress.housingProgressIds('all');const items=new Set(ids.map(progress.exerciseKey)).size;
 assert.equal(progress.housingProgress('all',[]).total,items);assert(items<ids.length,'Ev ve Yaşam no longer stops at half');
 const all=progress.housingProgress('all',ids.filter(id=>!id.endsWith('-test')).map(id=>row(id,1,0,1)));
 assert(all.percent>=97,'writing every exercise is (almost) everything: '+all.percent);
});

test('Fiiller counts the steps Fiil Atölyesi asks, and a finished part keeps its tick when it is practised again',()=>{
 assert.equal(progress.verbProgressIds('verbs-all').length,workshop.WORKSHOP_TOTAL);
 assert.deepEqual(new Set(progress.verbProgressIds('verbs-all')),new Set(workshop.workshopIds()));
 const w1=families.verbFamilies[0];const ids=workshop.partIds(w1);
 const round=(id,answered,finished_at=null)=>({id,mode:'workshop',topic:'verbs-all',first:ids[0],total:ids.length,answered,finished_at,ids:finished_at?null:ids});
 const part=workshop.partsStatus([round('again',2),round('done',ids.length,9)])[0];
 assert.equal(part.session.id,'again','the new round goes on');assert(!part.finished);assert(part.completed,'but the part stays done');
 assert.equal(part.meaningDone,w1.verbs.length,'its stickers stay');assert.equal(part.done,2);
 assert(!workshop.partsStatus([round('open',5)])[0].completed);
 const page=read('app/verb-study.tsx');assert(page.includes("const state=part.completed?'done'")&&page.includes('const ring=part.completed?100:part.percent;'));
});

test('the study API keeps the newest rounds of each area, so 40 rounds elsewhere never hide Fiiller or Ev ve Yaşam',()=>{
 const route=read('app/api/study/route.ts');
 const query=/db\.prepare\("(SELECT s\.id,s\.mode[^"]+)"\)/.exec(route)[1];
 assert(query.includes('ROW_NUMBER() OVER (PARTITION BY')&&!query.includes('LIMIT 40'));
 const sql=new DatabaseSync(':memory:');sql.exec(read('drizzle/0000_heavy_brood.sql'));
 const add=sql.prepare('INSERT INTO study_sessions (id,user_id,mode,topic,questions,created_at,finished_at) VALUES (?,?,?,?,?,?,?)');
 for(let i=0;i<5;i++)add.run('w'+i,'u','workshop','verbs-all','[]',i,null);
 for(let i=0;i<3;i++)add.run('h'+i,'u','write','book-11-a','[]',10+i,null);
 for(let i=0;i<70;i++)add.run('o'+i,'u','visual','objects-kitchen','[]',100+i,null);
 add.run('x','someone-else','workshop','verbs-all','[]',500,null);
 const rows=sql.prepare(query).all('u',0,0);
 assert.equal(rows.filter(r=>r.mode==='workshop').length,5,'every Fiiller round');assert.equal(rows.filter(r=>r.id.startsWith('h')).length,3,'every Ev ve Yaşam round');
 assert.equal(rows.filter(r=>r.id.startsWith('o')).length,40,'the newest 40 of Nesne Kasası');assert(!rows.some(r=>r.id==='x'),'only the member\'s own rounds');
 assert.deepEqual(rows.map(r=>r.created_at),[...rows.map(r=>r.created_at)].sort((a,b)=>b-a),'newest first');
});

test('two devices: score lists are joined even when both changed; the continue place travels with the account',()=>{
 const phone={'lernkoko-l2a-scores':{v:JSON.stringify({'resim-sec':{right:8,total:8},test:{right:6,total:12}}),t:100}};
 const computer={'lernkoko-l2a-scores':{v:JSON.stringify({'kurs-chat':{right:6,total:6},test:{right:9,total:12}}),t:200}};
 const merged=sync.mergeItems(phone,computer,300)['lernkoko-l2a-scores'];
 assert.deepEqual(JSON.parse(merged.v),{'resim-sec':{right:8,total:8},test:{right:9,total:12},'kurs-chat':{right:6,total:6}});assert.equal(merged.t,300);
 assert.deepEqual(sync.mergeItems(phone,{'lernkoko-l2a-scores':{v:null,t:400}},500)['lernkoko-l2a-scores'],{v:null,t:400},'a reset still travels');
 assert.deepEqual(sync.mergeItems({'lernkoko-l2a-step':{v:'test',t:100}},{'lernkoko-l2a-step':{v:'kapak',t:200}},300)['lernkoko-l2a-step'],{v:'kapak',t:200},'other keys: the newer wins');
 assert(sync.SYNC_LESSONS.includes('site'));
 for(const key of ['lernkoko-last-place','lernkoko-verb-game:speed'])assert.equal(sync.syncLessonOf(key),'site',key);
 assert.equal(sync.syncLessonOf('lernkoko-last-placex'),null);
});

test('every page saves its place; no "Kaldığın yerden devam et" button anywhere (the learner asked, 3 November 2026)',()=>{
 assert.equal(place.lessonStepHref('berufe','b','fiil-tablo'),'/a1-1/berufe?teil=b&adim=fiil-tablo');
 assert.equal(place.lessonStepHref('willkommen','a','kapak'),'/a1-1/willkommen?adim=kapak');
 const store={};const storage={setItem:(k,v)=>{store[k]=v;},getItem:k=>store[k]??null};
 place.saveLastPlace(storage,{id:'berufe',href:place.lessonStepHref('berufe','c','zar'),detail:'Lektion 2 · Teil C · Alıştırma 4'},5);
 assert.deepEqual(place.readLastPlace(storage),{id:'berufe',href:'/a1-1/berufe?teil=c&adim=zar',at:5,detail:'Lektion 2 · Teil C · Alıştırma 4'});
 place.saveLastPlace(storage,{id:'stadt',href:'/evil?x'});assert.equal(place.readLastPlace(storage).href,'/a1-2/wege-in-der-stadt','only the page\'s own address');
 for(const [file,piece] of [['app/housing-study.tsx',"saveLastPlace(localStorage,{id:'housing'})"],['app/object-study.tsx',"saveLastPlace(localStorage,{id:'vault'})"],['app/verb-study.tsx',"saveLastPlace(localStorage,{id:'verbs'})"],['app/ausbildung-study.tsx',"saveLastPlace(localStorage,{id:'ausbildung'"],['app/ausbildung-hoeren.tsx',"saveLastPlace(localStorage,{id:'hoeren'"],['app/willkommen-study.tsx',"saveLastPlace(localStorage,{id:'willkommen'"],['app/berufe-study.tsx',"saveLastPlace(localStorage,{id:'berufe'"],['app/stadt-study.tsx',"saveLastPlace(localStorage,{id:'stadt'"]])assert(read(file).includes(piece),file);
 const units=read('app/category-study.tsx');assert(!units.includes('readLastPlace(')&&!units.includes('nb-continue'),'no card on the units page');
 for(const file of ['app/willkommen-study.tsx','app/berufe-study.tsx','app/stadt-study.tsx'])assert(!read(file).includes('ResumeLink'),file+': no link in the contents');
 assert(!fs.existsSync('app/lesson-resume.tsx'));
 const l12=read('app/ausbildung-study.tsx');assert(!l12.includes("t('Kaldığın yerden devam et')")&&l12.includes("onClick={()=>onOpen('a','kelimeler')}"),'Lektion 12 starts at Teil A');
});

test('Lektion 12: the topic tick comes when the topic is opened, however the learner got there',()=>{
 const page=read('app/ausbildung-study.tsx');
 assert(page.includes("useEffect(()=>{if(step==='konu'&&!readSeen()[part.id]){markSeen(part.id);setSeen(readSeen());}},[part.id,step]);"));
});
