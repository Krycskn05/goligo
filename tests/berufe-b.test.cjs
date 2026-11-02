// Lektion 2 „Berufe“, Teil B – Wer ist das? (2 November 2026): the learner's second lesson page of Lektion 2, in the same
// notebook as Teil A (app/berufe-study.tsx), with the site's rules (tap to hear, speaker in the bubble, only the right
// answer read, mixed word boxes, the goal and İpucu when building a sentence, no AI talk).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const lesson=load('berufe-b-course'),a=load('berufe-course'),progress=load('berufe-progress'),l1=load('willkommen-course'),sync=load('lesson-sync');
const read=file=>fs.readFileSync(file,'utf8');
const gaps=line=>line.parts.filter(part=>typeof part!=='string');
const lineText=line=>line.parts.map(part=>typeof part==='string'?part:part.answer).join('');

test('19 steps like the learner\'s page: cover, 8 teaching steps, 7 exercises, test, Konuş, Bitti; every exercise is scored',()=>{
 assert.equal(lesson.berufeStepsB.length,19);
 assert.deepEqual(lesson.berufeStepsB.map(step=>step.kind),['cover',...Array(8).fill('teach'),...Array(7).fill('exercise'),'test','speak','end']);
 assert.equal(new Set(lesson.berufeStepsB.map(step=>step.id)).size,19);
 assert.deepEqual(lesson.berufeGroupsB.map(group=>group.ids.length),[8,7,1,1]);
 const total=id=>lesson.berufeScoredB.find(e=>e.id===id).total;
 assert.deepEqual(['wer','fiil-tablo','wer-macht','hoeren','soru-kur','harf-yaz','omar','test'].map(total),[8,12,4,7,6,16,4,12]);
 for(const id of lesson.berufeGroupsB[1].ids)assert(lesson.berufeStepShortB[id],id);
 assert.equal(lesson.doings.length,6);assert.equal(lesson.wordsB.length,24);assert.equal(lesson.phrasesB.length,9);
 for(const doing of lesson.doings)assert(fs.existsSync('public/toon/lektion2/'+doing.key+'.webp'),doing.key);
 assert(fs.existsSync('public/toon/lektion2/kapak-b.webp'));
});

test('the exercises agree with the texts and have one right answer each',()=>{
 // Alıştırma 1: each "Wer …?" sentence is in the person's text.
 for(const [prompt,answer,say] of lesson.whoRows){assert(lesson.whoOptions.includes(answer),prompt);const text=lesson.readTexts.find(t=>t.name===answer);assert(text,answer);
  const rest=prompt.replace('… ','').replace(/\.$/,'');const verb=rest.split(' ')[0];assert(text.de.includes(rest.slice(verb.length).trim().split(' ')[0]),prompt);assert(say.startsWith(answer+' '),say);}
 // Alıştırma 2: -t for er / sie, -en for sie (Pl.), the irregular ones.
 assert.deepEqual(lesson.verbGaps.map(row=>row[1]),['wohnt','kommt','heißt','arbeitet','spricht','ist']);
 assert.deepEqual(lesson.verbGapCells.map(cell=>cell.say).slice(0,4),['sie wohnt','sie wohnen','er kommt','sie kommen']);
 assert(l1.acceptsAnswer('heisst',[lesson.verbGapCells[4].answer]),'ß may be ss');
 // Alıştırma 3 and 4: the answers are in their boxes; the finished line is what is read.
 for(const row of lesson.doRows)assert(lesson.doBox.includes(row[2]),row[1]);
 for(const line of lesson.hearLines){for(const gap of gaps(line))assert(gap.options.includes(gap.answer),line.key);assert.equal(lineText(line),line.say,line.key);}
 const heard=lesson.ramiTalk.join(' ');for(const line of lesson.hearLines)for(const gap of gaps(line))assert(heard.includes(gap.answer.replace(/t$/,'')),gap.answer);
 // Alıştırma 5: the goal for every question; Alıştırma 6: the 16 capitals of the text.
 assert.equal(lesson.questionMeanings.length,lesson.questionSentences.length);
 assert.equal(lesson.capsSolved,'Das ist Sabine Krüger. Sie kommt aus Hamburg. Das ist in Deutschland. Sie wohnt jetzt in Berlin. Sie arbeitet als Verkäuferin. Sie spricht Deutsch und Englisch. Sie trinkt Tee.');
 // Alıştırma 7: the patterns take the card's sentences (no article for the job, aus dem Sudan).
 const fits=(i,text)=>lesson.omarPrompts[i].pattern.test(l1.normalizeLoose(text));
 lesson.omarPrompts.forEach((prompt,i)=>assert(fits(i,prompt.say),prompt.say));
 assert(fits(1,'Omar kommt aus dem Sudan, aus Khartum.')&&!fits(1,'Er kommt aus Sudan.'));
 assert(!fits(2,'Er ist Friseur.'),'the second half is needed');assert(fits(3,'Er spricht Arabisch, Englisch und Deutsch.'));
 assert.equal(sync.syncLessonOf(lesson.L2B_OWN_KEY),null,'Omar\'s sentences stay on this device');
 for(const [question,options,answer] of lesson.berufeTestB)assert.equal(options[0],answer,question);
});

test('only the right answer is read — German, never a Turkish answer, never the question; texts about others by Paul Hoca',()=>{
 for(const [question,,answer,say] of lesson.berufeTestB){if(a.isTurkishText(answer))assert.equal(say,'',question);else assert(say.includes(answer),question);}
 for(const item of [...lesson.wordChecksB,...lesson.pronounChecks,...lesson.verbChecksB,...lesson.introChecks,...lesson.questionChecks]){
  if(item.say)assert(item.say.includes(item.options[0].replace(' (Pl.)','')),item.q);else assert(item.q.includes('„'),item.q);
 }
 assert.equal(lesson.NARRATOR,'paul');
 const steps=read('app/berufe-b-steps.tsx');
 assert(steps.includes('<Say text={text.de} who={NARRATOR} speech={speech}/>'));assert(steps.includes("speech.speakAll(ramiTalk.map(text=>({text,who:'rami'})))"),'Rami speaks with his own voice');
 assert(steps.includes("sayFor={i=>berufeTestB[i][3]}"));
 // Site rules: the goal and İpucu for building a question (OrderExercise), mixed boxes, no select, no AI talk.
 assert(steps.split('\n').some(line=>line.includes('<OrderExercise')&&line.includes('meanings=')));
 assert(steps.includes('mixedOrder(doBox,doRows.map(row=>row[2]))'));
 assert(!steps.includes('<select')&&!steps.includes('TalkStep'));
 assert(steps.includes('<ul className="l1a-say-list l2-forms">'),'the rows read themselves on a tap');
});

test('a man is read by a man, a woman by a woman, and every German text is a site voice',()=>{
 const known=new Set(l1.speakers.map(s=>s.key));
 for(const who of [...lesson.castL2B,...lesson.doings.map(d=>d.who),...lesson.practiceItemsB.map(i=>i.who),...lesson.readTexts.flatMap(t=>t.people)])assert(known.has(who),who);
 const texts=lesson.berufeBSpeechTexts();assert.equal(new Set(texts).size,texts.length);assert(texts.length>100,String(texts.length));
 assert(!texts.some(text=>/\||___|…/.test(text)),'no marks or gaps are read');
 for(const text of ['der Basketballer','Er macht Sport. Er trainiert.','ich komme, du kommst, er kommt, sie kommen.','ich bin, du bist, er ist, sie sind.','Hallo, ich heiße Rami Khalil.',lesson.ramiAbout,lesson.capsSolved,lesson.omarAll,'sie wohnen'])assert(texts.includes(text),text);
 assert(read('scripts/voices/list-texts.cjs').includes("load('berufe-b-course').berufeBSpeechTexts()"));
});

test('Teil B lives in the Lektion 2 notebook: part b, its own scores, the unit card counts every part',()=>{
 const shell=read('app/berufe-study.tsx');
 for(const piece of ["const partOrder:L2PartId[]=['a','b','c','d'];","b:{id:'b',badge:'B'","View:StepViewL2B","label:config.short[id]??","useState<Record<L2PartId,L1AScoreMap>>({a:{},b:{},c:{},d:{}})"])assert(shell.includes(piece),piece);
 assert.equal(a.berufeParts[1].title,'Wer ist das?');
 assert.equal(sync.syncLessonOf(progress.L2B_SCORES_KEY),'l2');assert.equal(sync.syncLessonOf('lernkoko-l2b-run'),'l2');
 const fullA={},fullB={};for(const {id,total} of progress.l2PartCounted.a)fullA[id]={right:total,total};for(const {id,total} of progress.l2PartCounted.b)fullB[id]={right:total,total};
 assert.equal(progress.partProgressL2('b',fullB).percent,100);
 assert.equal(progress.lessonTwoProgress({a:fullA}).percent<100,true,'Teil B counts too');
 assert(progress.lessonTwoProgress({a:fullA,b:fullB}).percent<100,'Teil C and D count too (tests/berufe-c.test.cjs, berufe-d.test.cjs)');
 const steps=read('app/berufe-b-steps.tsx');for(const step of lesson.berufeStepsB)assert(steps.includes(`case '${step.id}':`),step.id);
 assert(read('app/berufe-a-steps.tsx').includes("onClick={()=>onPart('b',0)}"),'the end of Teil A opens Teil B');
 assert(steps.includes("onClick={()=>onPart('c',0)}"),'the end of Teil B opens Teil C');
 assert(steps.includes("case 'konus':return <KonusL2B {...props}/>;"),'Konuş before Bitti');
});
