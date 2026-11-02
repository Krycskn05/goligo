// Lektion 2 „Berufe“, Teil A – Ich bin Koch. (2 November 2026): the learner's lesson page on the site, linked from
// Üniteler (A1.1), with the look and the pieces of Lektion 1 and 15.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const lesson=load('berufe-course'),progress=load('berufe-progress'),l1=load('willkommen-course'),auth=load('member-auth'),goals=load('unit-goals'),sync=load('lesson-sync');
const read=file=>fs.readFileSync(file,'utf8');
const pageCode=()=>['app/berufe-study.tsx','app/berufe-a-steps.tsx'].map(read).join('\n');
const gaps=line=>line.parts.filter(part=>typeof part!=='string');
const lineText=line=>line.parts.map(part=>typeof part==='string'?part:part.answer).join('');

test('18 steps in the order of the learner\'s page: cover, 8 teaching steps, 7 exercises, test, summary',()=>{
 assert.equal(lesson.berufeSteps.length,18);
 assert.deepEqual(lesson.berufeSteps.map(step=>step.kind),['cover',...Array(8).fill('teach'),...Array(7).fill('exercise'),'test','end']);
 assert.equal(new Set(lesson.berufeSteps.map(step=>step.id)).size,18,'ids are unique');
 assert.deepEqual(lesson.berufeGroups.map(group=>group.ids.length),[8,7,1]);
 assert.equal(lesson.berufeStepIndex('test'),16);assert.equal(lesson.berufeStepIndex('yok'),-1);
 assert.equal(lesson.jobs.length,15);assert.equal(lesson.otherWords.length,20);assert.equal(lesson.phrases.length,11);assert.equal(lesson.berufeTest.length,12);
 assert.equal(lesson.berufeWordCount,35);
 // Every exercise is scored, every scored id is a step.
 assert.equal(lesson.berufeScored.length,8);
 for(const {id,total} of lesson.berufeScored){assert(lesson.berufeSteps.some(step=>step.id===id&&(step.kind==='exercise'||step.kind==='test')),id);assert(total>0,id);}
 const total=id=>lesson.berufeScored.find(e=>e.id===id).total;
 assert.deepEqual(['resim-sec','kurs-chat','diger-bicim','harfler','diyalog','sinav','und-du','test'].map(total),[8,6,8,9,6,4,2,12]);
 for(const id of lesson.berufeGroups[1].ids)assert(lesson.berufeStepShort[id],id);
});

test('the jobs: a picture for each, a man\'s and a woman\'s form with the article, the -in rule and its exceptions',()=>{
 for(const job of lesson.jobs){
  assert(fs.existsSync('public/toon/lektion2/'+job.key+'.webp'),job.key);
  assert(job.male.startsWith('der ')&&job.female.startsWith('die '),job.key);
  assert.equal(lesson.pairSay(job),job.male+', '+job.female);
 }
 assert(fs.existsSync('public/toon/lektion2/kapak-a.webp'));
 for(const key of lesson.inRule){const job=lesson.jobOf(key);assert.equal(job.female,'die '+job.male.slice(4)+'in',key);}
 for(const key of lesson.umlautRule){const job=lesson.jobOf(key);assert.notEqual(job.female,'die '+job.male.slice(4)+'in',key);assert(/[äöÄÖ]/.test(job.female),key);}
 assert.equal(lesson.jobOf('haus').female,'die Hausfrau');
 // Every picture of the quiz is a job; the right form is the first option and matches the hint (kadın → die).
 for(const item of lesson.pictureItems){const job=lesson.jobOf(item.job);assert.equal(job.key,item.job);assert.equal(new Set(item.options).size,3);
  assert.equal(item.options[0],item.hint.startsWith('kadın')?job.female:job.male,item.hint);}
});

test('the exercises have one right answer each, among their options, and a finished line is the sentence that is read',()=>{
 for(const line of [...lesson.chatFill,...lesson.dialogueLines,...lesson.examLines]){for(const gap of gaps(line))assert(gap.options.includes(gap.answer),line.key+': '+gap.answer);}
 for(const line of [...lesson.dialogueLines,...lesson.examLines])assert.equal(lineText(line),typeof line.say==='string'?line.say:line.say.text,line.key);
 for(const line of lesson.chatFill){assert.equal(line.say.who,line.who);assert(lineText(line).endsWith(line.say.text.replace(/^Ich /,'')),line.key);}
 // The box of the dialogue: one shared list, every verb used once.
 const answers=lesson.dialogueLines.flatMap(line=>gaps(line).map(gap=>gap.answer)).sort();
 assert.deepEqual(answers,[...lesson.dialogueBox].sort());
 for(const line of lesson.dialogueLines)for(const gap of gaps(line))assert.equal(gap.options,lesson.dialogueBox,'one box for every gap');
 assert.equal(lineText(lesson.dialogueLines[1]),'Ich bin Friseur. Aber ich arbeite jetzt als Verkäufer. Was machst du beruflich, Aisha?');
 // Mann oder Frau: the other form, read with its article; ä may be ae.
 for(const row of lesson.otherForms){const job=lesson.jobs.find(j=>j.male===row[0]||j.female===row[0]);assert(job,row[0]);assert.equal(lesson.otherFormSay(row),row[0]===job.male?job.female:job.male,row[0]);}
 assert(l1.acceptsAnswer('Aerztin',['Ärztin'])&&l1.acceptsAnswer('die Köchin',['Köchin','die Köchin']));
 // Missing letters: the letters make the word that is read.
 for(const line of lesson.letterLines){const parts=line.text.split('___');let word='';parts.forEach((part,i)=>{word+=part+(i<line.answers.length?line.answers[i][0]:'');});assert.equal(word,line.say);}
 for(const [question,options,answer] of lesson.berufeTest)assert.equal(options[0],answer,question);
 for(const item of [...lesson.wordChecks,...lesson.askChecks,...lesson.formChecks,...lesson.workChecks,...lesson.verbChecks])assert.equal(new Set(item.options).size,item.options.length,item.q);
});

test('the learner\'s own sentences: the patterns of the textbook (no article), the first two are needed',()=>{
 const fits=(i,text)=>lesson.ownPrompts[i].pattern.test(l1.normalizeLoose(text));
 for(const text of ['Ich bin Tierarzt von Beruf.','Ich bin Köchin.','Ich bin Hausmann'])assert(fits(0,text),text);
 for(const text of ['Ich bin ein Koch.','Ich bin','Ich heiße Koray.'])assert(!fits(0,text),text);
 for(const text of ['Ich arbeite jetzt nicht.','Nein, ich arbeite nicht.','Ich arbeite als Verkäufer bei Edeka.','Ich arbeite bei Siemens.','Ja, ich arbeite jetzt als Tierarzt.'])assert(fits(1,text),text);
 assert(!fits(1,'Ich bin Tierarzt.'));assert(fits(2,'Ich lerne Deutsch.')&&fits(2,'Ich studiere.'));
 assert.deepEqual(lesson.ownPrompts.map(prompt=>!!prompt.optional),[false,false,true]);
 assert.equal(sync.syncLessonOf(lesson.L2A_OWN_KEY),'l2','the sentences travel with the account');
 // The speaking practice uses them (Alıştırma 7) and has an example for every answer.
 for(const item of lesson.practiceItems){assert(item.answer&&item.question,item.question);for(const i of item.own??[])assert(lesson.ownPrompts[i],item.question);}
});

test('after an answer only the right answer is read — in German, never a Turkish answer, never the question',()=>{
 for(const [question,,answer,say] of lesson.berufeTest){
  if(lesson.isTurkishText(answer))assert.equal(say,'',question);else assert(say.includes(answer.replace(/^die /,'')),question+' → '+say);
 }
 for(const item of [...lesson.wordChecks,...lesson.askChecks,...lesson.formChecks,...lesson.workChecks,...lesson.verbChecks]){
  if(item.say)assert(item.say.includes(item.options[0]),item.q);else assert(item.q.startsWith('„'),'a Turkish answer only for „what does it mean?“: '+item.q);
 }
 for(const text of ['der Arzt → kadın biçimi?','„Stimmt! Richtig!“ ne demek?','Bilmiyorum.','Doğru! Evet, öyle!','tamir etmek','mühendis (erkek)'])assert(lesson.isTurkishText(text),text);
 for(const text of ['die Ärztin','Ich arbeite jetzt nicht.','bist','Was ___ Sie beruflich?'])assert(!lesson.isTurkishText(text),text);
 const steps=read('app/berufe-a-steps.tsx');
 assert(steps.includes('const say=items[i].say;const after=say?()=>speech.speak(say):undefined;'),'a quick check reads only the right answer');
 assert(steps.includes("sayFor={i=>berufeTest[i][3]}"));
});

test('a man is read by a man, a woman by a woman: every person is one of the site\'s people, and every German text is a site voice',()=>{
 const known=new Map(l1.speakers.map(s=>[s.key,s]));
 const people=new Set([...lesson.castL2A,...[lesson.sieDialogue,lesson.duDialogue,lesson.fourPeople,lesson.chatLines].flat().map(line=>line.who),...lesson.chatFill.map(line=>line.who),...lesson.dialogueLines.map(line=>line.who),...lesson.practiceItems.map(item=>item.who)]);
 for(const who of people)assert(known.has(who),who);
 const texts=lesson.berufeSpeechTexts();
 assert.equal(new Set(texts).size,texts.length);assert(texts.length>100,'many texts ('+texts.length+')');
 for(const text of ['der Koch','die Köchin','der Koch, die Köchin','Was bist du von Beruf?','ich arbeite, du arbeitest, Sie arbeiten.','Ich bin Mechatroniker.','die Ärztin','Du bist Mechatroniker!'])assert(texts.includes(text),text);
 assert(!texts.some(text=>/___|…/.test(text)),'no gaps are read');
 assert(read('scripts/voices/list-texts.cjs').includes("load('berufe-course').berufeSpeechTexts()"));
});

test('the page: route, guest access, unit card, progress and sync like Lektion 15',()=>{
 assert(fs.existsSync('app/a1-1/berufe/page.tsx'));assert.equal(lesson.BERUFE_PATH,'/a1-1/berufe');
 assert(auth.GUEST_PAGES.has('/a1-1/berufe'),'visitors without an account open the lesson');
 const units=read('app/category-study.tsx');
 assert(units.includes("unit.id==='book-02'?'/a1-1/berufe'")&&units.includes('readLessonTwoProgress')&&units.includes("unit.id==='book-02'?berufe:"));
 assert(goals.unitGoalsFor('book-02').length>=8);assert.deepEqual(lesson.berufeGoals,goals.unitGoalsFor('book-02'));
 assert.equal(lesson.berufeParts.length,4);assert.equal(lesson.berufeParts.filter(part=>part.title).length,2,'Teil A and B now, C–D later');
 assert(sync.SYNC_LESSONS.includes('l2'));for(const key of [progress.L2A_SCORES_KEY,progress.L2A_STEP_KEY,progress.L2_PART_KEY,'lernkoko-l2a-run'])assert.equal(sync.syncLessonOf(key),'l2',key);
 assert(read('app/api/ilerleme/route.ts').includes("SYNC_LESSONS.map(()=>'?').join(',')"),'the server reads every lesson of the list');
 const code=pageCode();
 for(const piece of ["useSyncVersion('l2')","runKey={'lernkoko-l2'+place.part+'-run'}",'const lock=exerciseLock(config.groups,config.steps,scores[place.part]);',"const folded=step.kind!=='cover';",'data-l2-step={step.id}','useLessonSpeech()','export function StepViewL2A(props:StepProps){'])assert(code.includes(piece),piece);
 for(const step of lesson.berufeSteps)assert(code.includes(`case '${step.id}':`),step.id);
 assert(read('app/layout.tsx').includes('import "./berufe.css";'));
 assert(read('app/stadt-a-steps.tsx').includes('export function ChoiceExercise('),'the sentence choices are shared');
 // Scores: the best result stays; the unit's progress counts every scored exercise.
 const full={};for(const {id,total} of lesson.berufeScored)full[id]={right:total,total};
 assert.equal(progress.partProgressL2('a',full).percent,100);assert.equal(progress.partProgressL2('a',{}).percent,0);
 assert(progress.lessonTwoProgress({a:full}).percent>0,'Teil A counts for the unit card (Teil B too, tests/berufe-b.test.cjs)');
});

test('the job rows read themselves on a tap (the speaker icon stays), the picture reads both forms',()=>{
 const steps=read('app/berufe-a-steps.tsx');
 assert(steps.includes('<ul className="l1a-say-list l2-forms">'),'the forms are word rows of app/tap-to-say.tsx');
 assert(read('app/tap-to-say.tsx').includes('.l1a-say-list li'));
 assert(steps.includes("onClick={()=>speech.speak(pairSay(job))}"));
 assert(!steps.includes('<select'));
});
