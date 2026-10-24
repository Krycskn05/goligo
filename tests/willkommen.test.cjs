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

test('a man is read by a man, a woman by a woman, and two people in one step never share a voice (25 October 2026)',()=>{
 const siteVoices=load('site-voices').siteVoices;
 const women=new Set(['sabine','yasemin','aisha','nora','mei','mira','lena']),men=new Set(['omar','nikos','tomasz','rami','jonas','tarek','paul']);
 for(const speaker of lesson.speakers){
  assert.equal(speaker.gender,women.has(speaker.key)?'female':'male',speaker.key);
  const voice=siteVoices.find(voice=>voice.style===speaker.style);assert(voice,speaker.style);assert.equal(voice.gender,speaker.gender,speaker.key+' has a voice of their own kind');
 }
 for(const person of lesson.people)assert(lesson.speakers.some(s=>s.key===person.key&&s.name===person.name),person.key);
 // The site voices carry these people's names: the voice that reads Omar is called Omar in the settings.
 for(const voice of siteVoices){const speaker=lesson.speakers.find(s=>s.style===voice.style&&s.name.split(' ')[0]===voice.name);assert(speaker,voice.name+' is a person of the lesson with that voice');assert.equal(speaker.gender,voice.gender);}
 for(const item of lesson.listenItems)assert(lesson.speakers.some(s=>s.key===item.key&&s.name===item.name),item.key);
 // Every person's own voice is used when it is available; a missing voice is replaced by one of the same kind, never by nobody.
 assert.equal(lesson.speakerVoice('omar',siteVoices),'site:M2');assert.equal(lesson.speakerVoice('sabine',siteVoices),'site:F1');
 assert.equal(lesson.speakerVoice(undefined,siteVoices),undefined,'no speaker: the learner\'s chosen voice');
 assert.equal(lesson.speakerVoice('nora',siteVoices.filter(voice=>voice.style!=='F4')),'site:F5','another woman\'s voice when Sophie is missing');
 assert.equal(lesson.speakerVoice('rami',siteVoices.filter(voice=>voice.gender==='female')),undefined,'never a woman for a man');
 assert.equal(lesson.speakerOf('Guten Tag. Ich bin Sabine Krüger. Wie heißen Sie?'),'sabine');assert.equal(lesson.speakerOf('Ich heiße Tarek Salim.'),'tarek');assert.equal(lesson.speakerOf('Ich komme aus Polen.'),undefined);
 // Steps with several speakers: distinct voices within the step.
 const styleOf=key=>lesson.speakers.find(s=>s.key===key).style;
 const distinct=(keys,where)=>assert.equal(new Set(keys.map(styleOf)).size,keys.length,where+': '+keys.join(','));
 distinct(lesson.dialogue.map(([who])=>lesson.dialogueSpeaker(who)).filter((k,i,a)=>a.indexOf(k)===i),'diyalog');
 distinct(lesson.people.map(p=>p.key),'kisiler');distinct(lesson.listenItems.map(i=>i.key),'dinle');
 for(const [id,who] of Object.entries(lesson.exerciseSpeakers))distinct([who.a,who.b],id);
 const matchVoices=lesson.matchPairs.flatMap(pair=>lesson.matchSay(pair).map(item=>item.who).filter(Boolean));
 assert.deepEqual(matchVoices,['paul','jonas','paul','paul','mira','tarek']);distinct(['paul','jonas','mira','tarek'],'eslestir');
 assert.deepEqual(lesson.orderSentences.map(s=>lesson.orderSay(s.join(' ')).who),['paul',undefined,'paul','lena']);
 assert.deepEqual(lesson.withSpeakers(lesson.boxSay,lesson.exerciseSpeakers.kutu).map(item=>item.who),['nikos','yasemin','nikos','yasemin','nikos','yasemin']);
 const page=read('app/willkommen-study.tsx');
 for(const piece of ['who={dialogueSpeaker(who)}','who={p.key}','who={item.key}','speakerVoice(who,voices.current)','withSpeakers(props.say,exerciseSpeakers[id])','matchSay(matchPairs[i])','orderSay(sentence'])assert(page.includes(piece),piece);
 assert(!page.includes('tahtaya asar'),'the classroom note is gone');
});

test('the entry is a notebook like Lektion 11 and 12: contents with Teil A–D, Teil A on a wide spread with three tabs (25 October 2026)',()=>{
 assert.deepEqual(lesson.lessonParts.map(part=>part.badge),['A','B','C','D']);
 assert(lesson.lessonParts[0].title&&lesson.lessonParts.slice(1).every(part=>!part.title),'only Teil A is ready; B–D are shown as coming soon');
 assert.deepEqual(lesson.stepGroups.map(group=>group.id),['konu','alistirmalar','test']);
 assert.equal(lesson.stepGroups[0].ids.length,10);assert.equal(lesson.stepGroups[1].ids.length,9);
 assert.equal(lesson.groupOf('diyalog').id,'konu');assert.equal(lesson.groupOf('kutu').id,'alistirmalar');assert.equal(lesson.groupOf('kapak'),undefined);
 assert.equal(new Set(lesson.stepGroups.flatMap(group=>group.ids)).size,20,'every teaching step, exercise and the test is in exactly one tab');
 assert(lesson.unitGoals.length>=4);
 const page=read('app/willkommen-study.tsx');
 for(const piece of ['<LessonBook className="l1a-book"','<LessonBook variant="wide" className="l1a-book lb-tabbed"','data-l1a-part={part.id}','id="l1a-tabs"','className="lb-toc"','className="lb-goals"','readLastStep()','go(-1)'])assert(page.includes(piece),piece);
 assert(page.includes('<h2 id="l1a-heading"'),'a step heading is an h2 under the notebook title');
 const css=read('app/willkommen.css');assert(css.includes('.lb.l1a-book .l1a-soon-photo')&&css.includes('.l1a-part .lb-left .lb-photo'));
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
