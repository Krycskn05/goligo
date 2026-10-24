// Lektion 1 „Willkommen!“, Teil A (24 October 2026): the learner's lesson page on the site, linked from Üniteler.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const lesson=load('willkommen-course'),progress=load('willkommen-progress'),auth=load('member-auth');
const read=file=>fs.readFileSync(file,'utf8');

test('22 steps in the order of the learner\'s page: cover, 10 teaching steps, 9 exercises, test, end',()=>{
 assert.equal(lesson.steps.length,22);
 assert.deepEqual(lesson.steps.map(step=>step.kind),['cover',...Array(10).fill('teach'),...Array(9).fill('exercise'),'test','end']);
 assert.equal(new Set(lesson.steps.map(step=>step.id)).size,22,'ids are unique');
 assert.equal(lesson.stepIndex('test'),20);assert.equal(lesson.stepIndex('yok'),-1);
 assert.equal(lesson.countries.length,28);assert.equal(lesson.articleCountries.length,10);assert.equal(lesson.dialogue.length,6);assert.equal(lesson.people.length,6);assert.equal(lesson.words.length,15);
 assert.equal(lesson.testQuestions.length,10);assert.equal(lesson.articleRows.length,10);assert.equal(lesson.listenItems.length,3);
 for(const [question,options,answer] of lesson.testQuestions)assert(options.includes(answer),question);
 for(const item of lesson.listenItems)assert(item.options[item.answer],item.name);
});

test('typed answers are compared loosely; the right answer is read after a test question',()=>{
 assert(lesson.acceptsAnswer('ich heisse tarek salim.',['Ich heiße Tarek Salim.']));
 assert(lesson.acceptsAnswer('Woher kommen Sie Frau Vogt?',['Woher kommen Sie, Frau Vogt?']));
 assert(!lesson.acceptsAnswer('Ich komme aus Polen.',['Ich komme aus Kenia.']));
 assert(!lesson.acceptsAnswer('',['Danke!']));
 assert.equal(lesson.testSpeech(['Ich komme aus ___ Türkei.',['der','dem','den'],'der']),'Ich komme aus der Türkei.');
 assert.equal(lesson.testSpeech(['Ich komme aus ___ Deutschland.',['dem','der','– (artikel yok)'],'– (artikel yok)']),'Ich komme aus Deutschland.');
 assert.equal(lesson.testSpeech(['„Guten Tag“ Türkçesi nedir?',['Hoş geldiniz','İyi günler','Teşekkürler'],'İyi günler']),'','a Turkish answer is not read in German');
 assert.equal(lesson.articleRowSpeech(['Deutschland','–']),'aus Deutschland');assert.equal(lesson.articleRowSpeech(['USA','den']),'aus den USA');
});

test('every German text the lesson speaks is listed for the site voices',()=>{
 const texts=lesson.willkommenSpeechTexts();
 for(const text of ['Guten Tag!','Wie heißen Sie?','aus der Türkei','aus den Niederlanden','Ich heiße Omar Nasser. Ich komme aus dem Sudan, aus Khartum.','Guten Tag. Ich bin Nora Weiß. Ich komme aus Österreich, aus Wien.','Woher kommen Sie, Herr Salim?','Ich bin Omar Nasser.'])assert(texts.includes(text),text);
 assert(!texts.includes(''));assert(texts.every(text=>text===text.trim()));
 assert(read('scripts/voices/list-texts.cjs').includes("load('willkommen-course').willkommenSpeechTexts()"));
});

test('scores stay in the browser and make the progress of the unit card',()=>{
 const empty=progress.willkommenProgress({});assert.equal(empty.total,lesson.scoredExercises.reduce((n,e)=>n+e.total,0));assert.equal(empty.percent,0);assert.equal(empty.stage,'new');
 const half=progress.willkommenProgress({test:{right:10,total:10},aus:{right:5,total:10}});
 assert.equal(half.learned,15);assert.equal(half.tried,20);assert(half.percent>0&&half.percent<100);
 const full=progress.willkommenProgress(Object.fromEntries(lesson.scoredExercises.map(e=>[e.id,{right:e.total,total:e.total}])));
 assert.equal(full.percent,100);assert.equal(full.stage,'master');assert.equal(full.stars,3);
 assert.deepEqual(lesson.scoredExercises.map(e=>e.id),['harfler','eslestir','sirala','ayir','aus','dinle','soru','kutu','test']);
});

test('the page, its pictures, the units link, guest access and the menu',()=>{
 assert(fs.existsSync('app/a1-1/willkommen/page.tsx'));
 const page=read('app/willkommen-study.tsx');
 for(const piece of ['useGermanSpeech','useAnswerSound','<SiteMenuAside language={language} current="units"/>','<GuestBanner','data-l1a-step={step.id}','L1A_STEP_KEY','saveL1AScore'])assert(page.includes(piece),piece);
 assert(auth.GUEST_PAGES.has('/a1-1/willkommen'),'visitors without an account open the lesson');
 const units=read('app/category-study.tsx');assert(units.includes("unit.id==='book-01'?'/a1-1/willkommen'")&&units.includes('willkommen-progress'));
 assert(read('app/layout.tsx').includes('import "./willkommen.css";'));
 for(const file of ['kapak','paul-harita','sabine','omar','yasemin','nikos','aisha','tomasz','nora','rami','mei'])assert(fs.existsSync('public/toon/lektion1/'+file+'.webp'),file);
 for(const key of lesson.people.map(p=>p.key).concat(lesson.listenItems.map(i=>i.key)))assert(fs.existsSync('public/toon/lektion1/'+key+'.webp'),key);
 const smoke=read('ci/smoke.cjs');assert(smoke.includes('"/a1-1/willkommen"')&&smoke.includes("data-l1a-step='kapak'"));
});
