// Lektion 1 „Willkommen!“, Teil A (24 October 2026) and Teil B (25 October 2026): the learner's lesson pages on the site, linked from Üniteler.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const lesson=load('willkommen-course'),lessonB=load('willkommen-b-course'),lessonC=load('willkommen-c-course'),lessonD=load('willkommen-d-course'),progress=load('willkommen-progress'),auth=load('member-auth');
const read=file=>fs.readFileSync(file,'utf8');
/** The lesson's code: the page, the shared pieces and Teil B's steps. */
const pageCode=()=>['app/willkommen-study.tsx','app/willkommen-ui.tsx','app/willkommen-b-steps.tsx','app/willkommen-c-steps.tsx','app/willkommen-d-steps.tsx'].map(read).join('\n');

test('22 steps in the order of the learner\'s page: cover, 9 teaching steps, 9 exercises, test, talk, end ("Dikkat: aus + artikel" removed, 30 October 2026)',()=>{
 assert.equal(lesson.steps.length,22);
 assert.deepEqual(lesson.steps.map(step=>step.kind),['cover',...Array(9).fill('teach'),...Array(9).fill('exercise'),'test','speak','end']);
 assert.equal(new Set(lesson.steps.map(step=>step.id)).size,22,'ids are unique');
 assert.equal(lesson.stepIndex('artikel'),-1,'no aus + artikel rule page');
 assert.equal(lesson.stepIndex('test'),19);assert.equal(lesson.stepIndex('yok'),-1);
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
 const page=pageCode();
 for(const piece of ['who={dialogueSpeaker(who)}','who={p.key}','who={item.key}','speakerVoice(who,voices.current)','withSpeakers(props.say.map(','speakers)','speakers={exerciseSpeakers.kutu}','matchSay(matchPairs[i])','orderSay(sentence'])assert(page.includes(piece),piece);
 assert(!page.includes('tahtaya asar'),'the classroom note is gone');
});

test('the entry is a notebook like Lektion 11 and 12: contents with Teil A–D, Teil A on a wide spread with three tabs (25 October 2026)',()=>{
 assert.deepEqual(lesson.lessonParts.map(part=>part.badge),['A','B','C','D']);
 assert(lesson.lessonParts.every(part=>part.title&&part.lead),'Teil A–D are all ready');
 assert.deepEqual(lesson.stepGroups.map(group=>group.id),['konu','alistirmalar','test','konus']);
 assert.equal(lesson.stepGroups[0].ids.length,9);assert.equal(lesson.stepGroups[1].ids.length,9);
 assert.equal(lesson.groupOf('diyalog').id,'konu');assert.equal(lesson.groupOf('kutu').id,'alistirmalar');assert.equal(lesson.groupOf('kapak'),undefined);
 assert.equal(new Set(lesson.stepGroups.flatMap(group=>group.ids)).size,20,'every teaching step, exercise, the test and the talk is in exactly one tab');
 for(const [lang] of lesson.greetingsAround)assert(lesson.greetingVoices[lang]?.lang&&lesson.greetingVoices[lang].say,'greeting read in its own language: '+lang);
 // Exercises in order; Test and Konuş after all exercises (30 October 2026); the letters exercise uses letter cells.
 const ui=read('app/willkommen-ui.tsx');
 assert(ui.includes('export function exerciseLock(')&&ui.includes('export function LockedStep(')&&ui.includes('function LetterCells('));
 for(const file of ['app/willkommen-study.tsx','app/stadt-study.tsx']){const code=read(file);for(const piece of ['const lock=exerciseLock(config.groups,config.steps,scores[place.part]);','if(mustFinish&&step){setLockNote(step.id);return;}','{stepLocked?<LockedStep','tabLocked(item.id)'])assert(code.includes(piece),file+': '+piece);}
 assert(read('app/willkommen-study.tsx').includes('title="Eksik harfleri tamamla" cells lines={lettersExercise.lines}'));
 // Words from a box open under the gap in every lesson; no drop-down list is left (30 October 2026, option B).
 assert(ui.includes('export function WordChoice(')&&ui.includes('const input=choices?<WordChoice ')&&read('app/stadt-a-steps.tsx').includes('return <WordChoice '));
 for(const file of ['app/willkommen-ui.tsx','app/stadt-a-steps.tsx'])assert(!read(file).includes('<select'),file);
 assert(lesson.unitGoals.length>=4);
 const page=pageCode();
 for(const piece of ['<LessonBook className="l1a-book"','<LessonBook variant="wide" className="l1a-book lb-tabbed"','data-l1a-part={row.id}','id="l1a-tabs"','className="lb-toc"','className="lb-goals"','onGo(-1)'])assert(page.includes(piece),piece);
 assert(page.includes('<h2 id="l1a-heading"'),'a step heading is an h2 under the notebook title');
 // The "Kaldığın yerden devam et" and "Testler" notes were removed at the learner's request.
 for(const gone of ['l1a-resume','l1a-test-note','Kaldığın yerden devam et','readLast('])assert(!page.includes(gone),gone);
 // No A1.1 breadcrumb (the learner asked); the contents notebook fills the screen on a computer and never makes the page scroll.
 assert(!read('app/willkommen-study.tsx').includes('className="object-breadcrumb"'));
 assert(page.includes("element.style.setProperty('--l1a-fill'")&&page.includes('book.style.zoom=String(zoom)')&&read('app/willkommen.css').includes('.l1a-contents .lb-spread { min-height:var(--l1a-fill,0px); }'));
 assert(!/\.l1a-contents \.lb-page \{[^}]*overflow-y:auto/.test(read('app/willkommen.css')),'no scrolling inside the notebook');
 const css=read('app/willkommen.css');assert(css.includes('.lb.l1a-book .l1a-soon-photo')&&css.includes('.l1a-part .lb-left .lb-photo'));
});

test('the page, its pictures, the units link, guest access and the menu',()=>{
 assert(fs.existsSync('app/a1-1/willkommen/page.tsx'));
 const page=pageCode();
 for(const piece of ['useGermanSpeech','useAnswerSound','<SiteMenuAside language={language} current="units"/>','<GuestBanner','data-l1a-step={step.id}','partKeys[place.part].step','savePartScore(part,id,right,total)'])assert(page.includes(piece),piece);
 assert(auth.GUEST_PAGES.has('/a1-1/willkommen'),'visitors without an account open the lesson');
 const units=read('app/category-study.tsx');assert(units.includes("unit.id==='book-01'?'/a1-1/willkommen'")&&units.includes('readLessonOneProgress'));
 assert(read('app/layout.tsx').includes('import "./willkommen.css";'));
 for(const file of ['kapak','paul-harita','sabine','omar','yasemin','nikos','aisha','tomasz','nora','rami','mei'])assert(fs.existsSync('public/toon/lektion1/'+file+'.webp'),file);
 for(const key of lesson.people.map(p=>p.key).concat(lesson.listenItems.map(i=>i.key)))assert(fs.existsSync('public/toon/lektion1/'+key+'.webp'),key);
 const smoke=read('ci/smoke.cjs');assert(smoke.includes('"/a1-1/willkommen"')&&smoke.includes("data-l1a-step='kapak'"));
});

test('Teil B „Ich spreche ein bisschen Deutsch.“ (25 October 2026): 24 steps, letters read by their German names, a voice per person',()=>{
 assert.equal(lessonB.stepsB.length,25);
 assert.deepEqual(lessonB.stepsB.map(step=>step.kind),['cover',...Array(10).fill('teach'),...Array(11).fill('exercise'),'test','speak','end']);
 assert.equal(new Set(lessonB.stepsB.map(step=>step.id)).size,25,'ids are unique');
 assert.deepEqual(lessonB.stepGroupsB.map(group=>group.ids.length),[10,11,1,1]);
 assert.equal(lessonB.languages.length,31);assert.equal(lessonB.alphabet.length,30);assert.equal(lessonB.wordsB.length,23);assert.equal(lessonB.testQuestionsB.length,12);
 for(const [question,options,answer] of lessonB.testQuestionsB)assert(options.includes(answer),question);
 // After a test answer only the right answer is read — in German, never a Turkish answer.
 for(const [question,,answer,say] of lessonB.testQuestionsB){if(/^(Efendim|biraz)/.test(answer))assert.equal(say,'',question);else assert(say,question);}
 assert.equal(lessonB.testQuestionsB.find(q=>q[2]==='yot')[3],'Jot','the letter J is read by its German name');
 // Letters: every letter has a name the voices read (not a single character).
 for(const [letter,,say] of lessonB.alphabet)assert(say.length>=2,letter);
 assert.equal(lessonB.letterSay('j'),'Jot');assert.equal(lessonB.letterSay('ß'),'Eszett');
 assert.equal(lessonB.spelledText('Nikos'),'Enn, Ih, Kah, Oh, Ess');
 assert.deepEqual(lessonB.spellItems('Vogt').map(item=>item.text),['Vau','Oh','Geh','Teh']);assert(lessonB.spellItems('Vogt').every(item=>item.slow),'spelling is read slowly');
 for(const item of lessonB.letterQuestions)assert(item.options.includes(item.answer));
 for(const item of lessonB.hearItems)assert(item.answers.every(j=>item.options[j]),item.name);
 // Typed names: ß/umlauts may be written as ss/ue.
 assert(lesson.acceptsAnswer('weiss',['Weiß']));assert(lesson.acceptsAnswer('Ich komme aus dem Libanon',lessonB.cardLines[1].answers[0]));
 // Each dialogue: two people of different voices, and every person is one of the lesson's speakers.
 const styleOf=key=>lesson.speakers.find(s=>s.key===key).style;
 for(const lines of [lessonB.dialogueSie,lessonB.dialogueDu,lessonB.dialogueSpell,lessonB.dialogueCheck]){const who=[...new Set(lines.map(line=>line.who))];assert.equal(who.length,2);assert.notEqual(styleOf(who[0]),styleOf(who[1]));}
 assert.equal(new Set(lessonB.hearItems.map(item=>styleOf(item.key))).size,3,'three listening voices');
 // Every German text is listed for the site voices (spelling uses the letter names).
 const texts=lessonB.willkommenBSpeechTexts();
 for(const text of ['Welche Sprachen sprechen Sie?','Farsi','Jot','Ypsilon','Eszett','ich spreche, du sprichst, Sie sprechen','Ich buchstabiere: Kah, Ah, Emm, Ah, Uh.','Nein, ich komme aus Griechenland.','Welche Sprachen sprichst du?'])assert(texts.includes(text),text);
 assert(!texts.includes(''));for(const item of lessonB.spellItems('Yasemin Fuchs Weiß Jonas Vogt Nikos Papadakis'))assert(texts.includes(item.text),item.text);
 assert(read('scripts/voices/list-texts.cjs').includes("load('willkommen-b-course').willkommenBSpeechTexts()"));
 for(const file of ['kapak-b','paul-alfabe','sie-sahne','du-sahne'])assert(fs.existsSync('public/toon/lektion1/'+file+'.webp'),file);
 // Scores: their own store; the unit card adds the parts.
 assert.equal(progress.partKeys.b.scores,'lernkoko-l1b-scores');assert.notEqual(progress.partKeys.a.scores,progress.partKeys.b.scores);
 const both=progress.lessonOneProgress({a:{test:{right:10,total:10}},b:{test:{right:12,total:12}}});
 assert.equal(both.total,[lesson.scoredExercises,lessonB.scoredExercisesB,lessonC.scoredExercisesC,lessonD.scoredExercisesD].flat().reduce((n,e)=>n+e.total,0),'every part counts, also one not started');assert.equal(both.learned,22);
 const page=pageCode();
 for(const piece of ["params.get('teil')","url.searchParams.set('teil',part)",'StepViewB','onPart(\'b\',0)','speech.speakAll(spellItems(word))','who="yasemin"',"who:'nikos'"])assert(page.includes(piece),piece);
});

test('the lesson page does not draw itself again and again (no effect that depends on the new-every-render sound object)',()=>{
 const page=read('app/willkommen-study.tsx');
 assert(!/\},\[speech,sound\]\)/.test(page),'no effect or callback keyed on speech and sound');
 assert(page.includes('latest.current.speech.stop()')&&page.includes("useEffect(()=>{setScores({a:readPartScores('a'),b:readPartScores('b'),c:readPartScores('c'),d:readPartScores('d')});},[]);"));
 const smoke=read('ci/smoke.cjs');assert(smoke.includes('sayfa bostayken kendini yeniden cizmiyor')&&smoke.includes("teil=b&adim=alfabe"));
});

test('"Bu ünitede": what units 1–3 teach, in our own words (no sentences, names or titles copied from the book)',()=>{
 const goals=load('unit-goals');
 for(const id of ['book-01','book-02','book-03'])assert(goals.unitGoalsFor(id).length>=8,id);
 assert.deepEqual(lesson.unitGoals,goals.unitGoalsFor('book-01'),'Lektion 1 shows its list');
 assert.deepEqual(goals.unitGoalsFor('book-99'),[]);
 const all=Object.values(goals.unitGoalsById).flat().join(' ');
 for(const copied of ['Karim','Hadid','Ich bin Koch','Wer ist das','Wir brauchen Hilfe','Ich verstehe das nicht','Ich lerne hier Deutsch','das Regal ist schön','Waschmaschine','Ich arbeite hier','Lernziele','Plurikulturalität'])assert(!all.includes(copied),copied);
 assert(read('app/willkommen-study.tsx').includes('unitGoals.map(goal=>'));
});

test('Teil C „Guten Tag!“ (25 October 2026): 26 steps, greetings by the time of day, Wie geht’s?, the verb in position 2, writing right',()=>{
 assert.equal(lessonC.stepsC.length,27);
 assert.deepEqual(lessonC.stepsC.map(step=>step.kind),['cover',...Array(11).fill('teach'),...Array(12).fill('exercise'),'test','speak','end']);
 assert.equal(new Set(lessonC.stepsC.map(step=>step.id)).size,27,'ids are unique');
 assert.deepEqual(lessonC.stepGroupsC.map(group=>group.ids.length),[11,12,1,1]);
 assert.equal(lessonC.stepIndexC('befinden'),4);assert.equal(lessonC.moods.length,6);assert.equal(lessonC.testQuestionsC.length,12);
 // The memory game and the learner's own sentences have no score; every other exercise and the test do.
 const scored=lessonC.scoredExercisesC.map(e=>e.id);
 assert(!scored.includes('memory')&&!scored.includes('sen'));assert.equal(scored.length,11);
 for(const id of scored)assert(lessonC.stepsC.some(step=>step.id===id&&(step.kind==='exercise'||step.kind==='test')),id);
 assert.equal(lessonC.scoredExercisesC.find(e=>e.id==='kutu').total,6);
 for(const [question,options,answer] of lessonC.testQuestionsC)assert(options.includes(answer),question);
 // After a test answer only the right answer is read — in German, never a Turkish answer.
 const turkish=new Set(['Sen diyelim mi?']);
 for(const [question,,answer,say] of lessonC.testQuestionsC){if(turkish.has(answer))assert.equal(say,'',question);else assert(say,question);}
 for(const item of lessonC.timeQuestions)assert(lessonC.timeOptions.includes(item.answer));
 for(const item of lessonC.moodHearing)assert(item.options[item.answer],item.name);
 for(const item of lessonC.orderVerbSentences)assert.equal(item.words[1],item.verb,'the verb is in position 2: '+item.words.join(' '));
 for(const row of lessonC.verbPositions)assert(row[1]&&!row[1].includes(' '),row.join(' '));
 // Writing right: the capitals exercise counts upper and lower case, ß may be ss; the dictation is loose.
 assert(lesson.acceptsExact('Hallo! Ich heisse Nora Weiss',lessonC.capitalLines[0].answers[0]));
 assert(!lesson.acceptsExact('hallo! ich heiße nora weiß.',lessonC.capitalLines[0].answers[0]));
 assert(lesson.acceptsAnswer('wie geht es ihnen',lessonC.dictationLines[3].answers[0]));
 assert(lesson.acceptsAnswer('Tschüss! Bis bald!',lessonC.dictationLines[5].answers[0])&&lesson.acceptsAnswer('tschüs',lessonC.gluedGreetingLines[5].answers[0])&&lesson.acceptsAnswer('Tschüss',lessonC.gluedGreetingLines[5].answers[0]),'both spellings of tschüs');
 assert.equal(lessonC.capitalLines.map(line=>line.answers[0][0]).join(' '),lessonC.capitalSay);
 assert.equal(lessonC.lowercaseText,lessonC.capitalSay.toLowerCase());
 assert.equal(lessonC.gluedGreetings.toLowerCase(),lessonC.gluedGreetingAnswers.join('').replace(/[!\s]/g,'').toLowerCase());
 // Each dialogue: two people with different voices; the listening and the word box use other people again.
 const styleOf=key=>lesson.speakers.find(s=>s.key===key).style;
 for(const lines of [lessonC.dialogueGoodbye,lessonC.dialogueMorning,lessonC.dialoguePark,lessonC.dialogueNew]){const who=[...new Set(lines.map(line=>line.who))];assert.equal(who.length,2);assert.notEqual(styleOf(who[0]),styleOf(who[1]));}
 assert.equal(new Set(lessonC.moodHearing.map(item=>styleOf(item.key))).size,4,'four listening voices');
 for(const item of lessonC.moodHearing)assert(lesson.speakers.some(s=>s.key===item.key&&s.name===item.name),item.key);
 for(const item of lessonC.dictation.filter(item=>item.who))assert.equal(item.who,'rami');
 // Every German text is listed for the site voices.
 const texts=lessonC.willkommenCSpeechTexts();
 for(const text of ['Guten Morgen!','Gute Nacht!','Wie geht es Ihnen?','Wie geht’s?','na ja, es geht','Alles paletti!','Welche Sprachen sprechen Sie?','Handschlag','Hm, nicht so gut heute.','Wie heißen Sie?','Und Sie?',lessonC.capitalSay,'Ich spreche Arabisch, Französisch und ein bisschen Deutsch.','Auf Wiedersehen!'])assert(texts.includes(text),text);
 for(const line of lessonC.boxSayC)assert(texts.includes(line),line);
 assert(!texts.includes(''));assert(texts.every(text=>text===text.trim()));
 assert(read('scripts/voices/list-texts.cjs').includes("load('willkommen-c-course').willkommenCSpeechTexts()"));
 for(const picture of Object.values(lessonC.willkommenCPictures))assert(fs.existsSync('public'+picture.src),picture.src);
 // Scores: their own store; the unit card adds all three parts.
 assert.equal(progress.partKeys.c.scores,'lernkoko-l1c-scores');assert.equal(progress.partKeys.c.step,'lernkoko-l1c-step');
 const all=progress.lessonOneProgress({a:{test:{right:10,total:10}},b:{test:{right:12,total:12}},c:{test:{right:12,total:12}}});
 assert.equal(all.total,[lesson.scoredExercises,lessonB.scoredExercisesB,lessonC.scoredExercisesC,lessonD.scoredExercisesD].flat().reduce((n,e)=>n+e.total,0));assert.equal(all.learned,34);
 const page=pageCode();
 for(const piece of ['StepViewC','onPart(\'c\',0)','stepsC','stepGroupsC','scoredExercisesC','exact','className="l1a-memory"','className="l1a-moods"','label="Lektion 1C · Test"'])assert(page.includes(piece),piece);
 // Listening exercises: the button's name does not give the answer away.
 assert(page.includes("aria-label={secret?(label==='Dinle'?label:'Dinle '+label):label+': '+text}"));
 assert.equal((page.match(/wide secret\/>/g)||[]).length,5,'A, B (two), C and the dictation rows');
 const css=read('app/willkommen.css');for(const cls of ['.l1a-moods','.l1a-mood-emoji','.l1a-pos-row','.l1a-pos-verb','.l1a-memory','.l1a-mcard.done','.l1a-row-say','.l1a-emoji-cell','.l1a-badge'])assert(css.includes(cls),cls);
 const smoke=read('ci/smoke.cjs');assert(smoke.includes("teil=c&adim=befinden")&&smoke.includes('.lb-toc-row button.lb-toc-open").count()) === 4'));
});

test('Teil D „Ich bin neu hier.“ (25 October 2026): the comic, the summary, Alles klar? with points, and the end of Lektion 1',()=>{
 assert.equal(lessonD.stepsD.length,17);assert.equal(new Set(lessonD.stepsD.map(step=>step.id)).size,17,'ids are unique');
 assert.deepEqual(lessonD.stepGroupsD.map(group=>group.ids.length),[5,3,6,1]);
 for(const group of lessonD.stepGroupsD)for(const id of group.ids)assert(lessonD.stepIndexD(id)>0,id);
 assert.deepEqual(lessonD.scoredExercisesD.map(e=>[e.id,e.total]),[['tamamla',8],['ich',10],['wortschatz',5],['grammatik',8],['kommunikation',6],['steckbrief',4],['test',15]]);
 // Alles klar?: the points of each section are the number of its answers (38 in all, like the book's page).
 for(const section of lessonD.checkSections)assert.equal(lessonD.scoredExercisesD.find(e=>e.id===section.id).total,section.points,section.id);
 assert.equal(lessonD.checkPoints,38);
 for(const [question,options,answer] of lessonD.testQuestionsD)assert(options.includes(answer),question);
 // After a test answer only the right answer is read — in German, never a Turkish answer; the letter J by its German name.
 for(const [question,,answer,say] of lessonD.testQuestionsD){if(['Efendim? / Pardon?','Burada yeniyim.'].includes(answer))assert.equal(say,'',question);else assert(say&&!/[ıİşŞğĞçÇ]/.test(say),question);}
 assert.equal(lessonD.testQuestionsD.find(q=>q[2]==='yot')[3],'Jot');
 // The exercises: the filled lines are what is read; the box answers are in the box.
 assert.equal(lessonD.filledLine({text:'___ ___, Frau Arslan?',answers:[['Sehr gut, danke.'],['Woher kommen Sie']]}),'Sehr gut, danke. Woher kommen Sie, Frau Arslan?');
 for(const line of lessonD.comicGapLines)for(const answers of line.answers)assert(lessonD.comicBox.includes(answers[0]),answers[0]);
 for(const line of lessonD.vocabLines)for(const answers of line.answers)assert(lessonD.vocabBox.includes(answers[0]),answers[0]);
 assert.equal(lessonD.ichSentences.filter(item=>item.ich).length,4);for(const item of lessonD.ichSentences)assert.equal(item.ich,/^Ich\b/.test(item.text),item.text);
 assert(lesson.acceptsAnswer('ich heisse',lessonD.talkLines[1].answers[0])&&lesson.acceptsAnswer('arabisch französisch und ein bisschen deutsch',lessonD.profileLines[1].answers[0])&&lesson.acceptsAnswer('Deutsch und Englisch',lessonD.profileLines[3].answers[0]));
 assert.equal(lessonD.importantSay('Ich spreche … und ein bisschen Deutsch.'),'Ich spreche und ein bisschen Deutsch.');
 // Voices: the comic is Nora and Yasemin, each with her own voice; no Turkish words go to the German voices.
 const styleOf=key=>lesson.speakers.find(s=>s.key===key).style;
 const who=[...new Set(lessonD.comicLines.map(line=>line.who))];assert.deepEqual(who,['nora','yasemin']);assert.notEqual(styleOf('nora'),styleOf('yasemin'));
 const texts=lessonD.willkommenDSpeechTexts();
 for(const text of ['Guten Tag! Ich bin neu hier.','Herzlich willkommen! Ich bin Nora Weiß. Wie heißen Sie?','Ich spreche ein bisschen Türkisch.','Oh, super! Bis bald, Frau Weiß!','ich komme, du kommst, Sie kommen','ich bin, du bist, Sie sind','Ich bin Rami Khalil. Ich komme aus dem Libanon. Und Sie?','Sind Sie Herr Khalil? Richtig?','Jot','auswendig lernen','die Nachbarin'])assert(texts.includes(text),text);
 assert(!texts.includes('')&&texts.every(text=>!/(Hoş|Teşekkür)/.test(text)),'no Turkish in the German voice list');
 assert(read('scripts/voices/list-texts.cjs').includes("load('willkommen-d-course').willkommenDSpeechTexts()"));
 const pics=lessonD.willkommenDPictures;for(const picture of [pics.cover,...pics.comic,pics.strategy,pics.trophy])assert(fs.existsSync('public'+picture.src),picture.src);
 assert.equal(progress.partKeys.d.scores,'lernkoko-l1d-scores');assert.deepEqual(Object.keys(progress.partScored),['a','b','c','d']);
 const page=pageCode();
 for(const piece of ['StepViewD','onPart(\'d\',0)',"partOrder:L1PartId[]=['a','b','c','d']",'testDetail:scores=>','config.groups[2].ids.includes(exercise.id)','speakers={{a:\'nora\',b:\'yasemin\'}}','speakers={{a:\'nora\',b:\'rami\'}}','className="l1a-panel"','Bitte noch üben!'])assert(page.includes(piece),piece);
 const css=read('app/willkommen.css');for(const cls of ['.l1a-panel-num','.l1a-say-list','.l1a-points'])assert(css.includes(cls),cls);
 const smoke=read('ci/smoke.cjs');assert(smoke.includes("teil=d&adim=cizgi-roman"));
});

test('phone check (30 October 2026): words wrap between words, dialogue bubbles get the line, Lektion 15 card opens Teil A',()=>{
 const css=read('app/willkommen.css');
 assert(css.includes('.l1a-table td,.l1a-table th,.l1a-table b,.l1a-table .l1a-de { overflow-wrap:break-word; }'),'lesson tables do not split words (the global td rule says anywhere)');
 assert(/@media \(max-width:520px\) \{\n \.l1a-line:has\(> \.l1a-portrait\) \{ display:grid; grid-template-columns:44px minmax\(0,1fr\)/.test(css),'phone dialogue line: portrait column, bubble takes the rest');
 assert(css.includes('.l1a-line.b:has(> .l1a-portrait) { grid-template-columns:minmax(0,1fr) 44px; }'),'the other speaker is mirrored');
 assert(css.includes('.l1a-person:has(> .l1a-say-wide) { flex-wrap:wrap;'),'a wide Dinle button goes under the name');
 assert(/@media \(max-width:360px\) \{[^}]*\n \.l1a-table \{ font-size:14px; \}\n \.l1a-words,\.l1a-words tbody \{ display:block; \}/.test(css),'narrowest phones stack the word lists');
 assert(!/\.l1a-pos-row \{ display:grid;[^}]*overflow-wrap:anywhere/.test(css),'verb-position rows wrap between words');
 assert(read('app/ausbildung.css').includes('.l12-app { hyphenate-limit-chars:10 4 4;'),'only long words are hyphenated');
 const origin=read('app/willkommen-study.tsx').match(/function Origin[\s\S]*?<\/table>/)[0];
 assert.equal((origin.match(/<tr>/g)||[]).length,3,'woher / kommen / aus: one pair per row');
 assert.equal(load('housing-copy').housingCopy.openA.length,6);
 assert(read('app/category-study.tsx').includes("housingText(language,unit.id==='book-15'?'openA':'open')"));
});

test('exercise fixes (30 October 2026): mixed word boxes, clear Sie/du rows, every right card sentence, Ä read as a long e, every finished step shows done',()=>{
 const {mixedOrder}=load('mixed-order');
 const box=['Tag','heiße','Woher','aus','willkommen','Danke'];
 for(let i=0;i<300;i++){const order=mixedOrder(box,box);assert.deepEqual([...order].sort(),[...box].sort());assert.notEqual(order.join(),box.join(),'never the order of the gaps');}
 const page=pageCode();
 assert.equal((page.match(/ bank lines=\{/g)||[]).length,3,'Lektion 1 A–C word boxes list the mixed box');
 assert(page.includes('const [box]=useState(()=>choices?mixedOrder(choices,gaps.map(gap=>gap.answers[0])):undefined);')&&page.includes('{(box??choices).map(word=>'));
 assert(page.includes('return rows.map(row=>fixed?row.options:shuffle(row.options));'),'rows with their own choices are mixed');
 const stadt=read('app/stadt-a-steps.tsx');assert(!stadt.includes('shuffleOptions'));assert(stadt.includes('bankLead="Kutudaki kelimeleri yerleştir:"')&&stadt.includes('const [orders,setOrders]=useState(mix);'));
 // Sie oder du: no row without a clue any more.
 const rows=lessonB.sieOrDu.slice(-2);assert.deepEqual(rows.map(row=>[row.after,row.answer]),[[', Nikos?','du'],[', Frau Weiß?','Sie']]);
 // The card: ich, er, Sie and du all count.
 const card=lessonB.cardLines;
 for(const [i,text] of [[0,'Sie heißen Rami Khalil.'],[0,'Er heißt Rami Khalil'],[0,'Ich heiße Rami Khalil.'],[1,'Sie kommen aus dem Libanon.'],[1,'Er kommt aus dem Libanon'],[2,'Sie sprechen Arabisch, Französisch und ein bisschen Deutsch.'],[2,'Er spricht Arabisch, Französisch, ein bisschen Deutsch']])assert(lesson.acceptsAnswer(text,card[i].answers[0]),text);
 for(const [i,text] of [[0,'Sie heißt Rami Khalil.'],[1,'Sie kommen aus Libanon.'],[2,'Sie Sprache sprechen Arabisch, Französisch und ein bisschen Deutsch']])assert(!lesson.acceptsAnswer(text,card[i].answers[0]),text);
 // Ä: the site voices read "Äh" like "a"; it is read as "Eh", and its listening question offers no E.
 assert.deepEqual(lessonB.alphabet.find(letter=>letter[0]==='Ä'),['Ä','a-umlaut (e)','Eh']);
 assert.deepEqual(lessonB.letterQuestions.find(item=>item.answer==='Ä').options,['Ä','A','O']);
 // Done marks for steps without a score: topic pages when opened, Şimdi sen / memory / Konuş when finished; tabs too.
 for(const file of ['app/willkommen-study.tsx','app/stadt-study.tsx']){const code=read(file);assert(code.includes("if(step.kind!=='teach'"),file);assert(code.includes("konu:config.groups[0].ids.every(id=>scores[id])")&&code.includes('konus:!!scores.konus'),file);}
 for(const file of ['app/willkommen-study.tsx','app/willkommen-b-steps.tsx','app/willkommen-c-steps.tsx'])assert(read(file).includes('if(s.every(value=>value===true))onScore(step.id,s.length,s.length);'),file);
 assert(read('app/willkommen-d-steps.tsx').includes('useEffect(()=>{if(allRight)onScore(step.id,values.length,values.length);},[allRight]);'));
 assert(read('app/willkommen-c-steps.tsx').includes('if(done.length===moods.length){props.onScore(props.step.id,1,1);'));
 assert(read('app/talk-step.tsx').includes('if(reply.done){setDone(true);props.onScore(step.id,1,1);}'));
 // Scores of unscored steps never change the percentage.
 assert.equal(load('willkommen-progress').partProgressL1('b',{sen:{right:2,total:2},sprachen:{right:1,total:1}}).learned,0);
});
