// Lektion 2 „Berufe“, Teil C – Wir brauchen Hilfe. (2 November 2026): the learner's third lesson page of Lektion 2, in the
// same notebook (app/berufe-study.tsx), with the site's rules (tap to hear, speaker in the bubble, only the right answer read,
// mixed word boxes, exercises in order, numbers above 20 only heard, no AI talk).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const lesson=load('berufe-c-course'),a=load('berufe-course'),progress=load('berufe-progress'),l1=load('willkommen-course'),sync=load('lesson-sync');
const read=file=>fs.readFileSync(file,'utf8');
const gaps=line=>line.parts.filter(part=>typeof part!=='string');
const lineText=line=>line.parts.map(part=>typeof part==='string'?part:part.answer).join('');

test('21 steps like the learner\'s page: cover, 9 teaching steps, 8 exercises, test, Konuş, Bitti; every exercise is scored',()=>{
 assert.equal(lesson.berufeStepsC.length,21);
 assert.deepEqual(lesson.berufeStepsC.map(step=>step.kind),['cover',...Array(9).fill('teach'),...Array(8).fill('exercise'),'test','speak','end']);
 assert.equal(new Set(lesson.berufeStepsC.map(step=>step.id)).size,21);
 assert.deepEqual(lesson.berufeGroupsC.map(group=>group.id+':'+group.ids.length),['konu:9','alistirmalar:8','test:1','konus:1']);
 const total=id=>lesson.berufeScoredC.find(e=>e.id===id).total;
 assert.deepEqual(['sayi-dinle','dizi','telefon','zar','yardim-diyalog','form-soru','mein-dein','wir-ihr-yaz','test'].map(total),[8,14,3,5,6,7,12,15,12]);
 for(const id of lesson.berufeGroupsC[1].ids)assert(lesson.berufeStepShortC[id],id);
 assert.equal(lesson.berufeWordCountC,lesson.wordsC.length+21);
 for(const file of ['kapak-c','haende-0-5','haende-6-10'])assert(fs.existsSync('public/toon/lektion2/'+file+'.webp'),file);
 for(const picture of Object.values(lesson.berufeCPictures))assert(fs.existsSync('public'+picture.src),picture.src);
});

test('the numbers: 0–20 are taught, 16 and 17 lose a part, phone numbers and postcodes are read digit by digit',()=>{
 assert.equal(lesson.numberWords.length,21);assert.equal(lesson.numberWords[20],'zwanzig');
 assert.equal(lesson.numberWords[16],'sechzehn');assert.equal(lesson.numberWords[17],'siebzehn');
 assert.equal(lesson.digitWords('0176 3345 621'),'null eins sieben sechs, drei drei vier fünf, sechs zwei eins');
 assert.equal(lesson.digitWords('13629'),'eins drei sechs zwei neun');
 for(const [n,,word] of lesson.teenRows)assert.equal(word,lesson.numberWords[n],String(n));
 // Alıştırma 1: three different numbers, the right one among them; Alıştırma 2: the rows count.
 for(const [n,options] of lesson.listenNumbers){assert.equal(new Set(options).size,3);assert(options.includes(String(n)),String(n));}
 assert.deepEqual(lesson.numberRowSay,['eins, zwei, drei, vier, fünf, sechs.','null, zwei, vier, sechs, acht, zehn.','zehn, neun, acht, sieben, sechs, fünf.','zwölf, dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn.','siebzehn, achtzehn, neunzehn, zwanzig.']);
 // Alıştırma 3: only the digits count; Alıştırma 4: the sum as a word or with digits, never above 20.
 assert.equal(lesson.phoneDigits('0176-3345 621'),'01763345621');
 for(const row of lesson.dice){const sum=lesson.diceSum(row);assert(sum<=20);assert(lesson.diceSentence(row).endsWith('ist '+lesson.numberWords[sum]+'.'));}
 lesson.diceLines.forEach((line,i)=>{const sum=lesson.diceSum(lesson.dice[i]);assert(l1.acceptsAnswer(String(sum),line.answers[0])&&l1.acceptsAnswer(lesson.numberWords[sum],line.answers[0]),line.text);});
 // Numbers above 20 are only heard: shown with digits, read as words; the taught words stop at zwanzig.
 const texts=lesson.berufeCSpeechTexts();
 assert(texts.includes('Meine Hausnummer ist einundzwanzig.'));
 assert(!lesson.possessiveLines.some(line=>lineText(line).includes('einundzwanzig')),'shown with digits');
 assert(!texts.some(text=>/\d/.test(text)),'no digits are given to the voices');
});

test('the exercises have one right answer each, among their options; the boxes are shared and mixed; mein / dein follows the article',()=>{
 for(const line of [...lesson.helpLines,...lesson.possessiveLines])for(const gap of gaps(line))assert(gap.options.includes(gap.answer),line.key);
 const helpAnswers=lesson.helpLines.flatMap(line=>gaps(line).map(gap=>gap.answer)).sort();assert.deepEqual(helpAnswers,[...lesson.helpBox].sort(),'every word of the box once');
 for(const line of lesson.helpLines)for(const gap of gaps(line))assert.equal(gap.options,lesson.helpBox,'one box for every gap');
 for(const line of lesson.helpLines)assert.equal(lineText(line),line.say.text,line.key);
 // die words take meine / deine, der / das words mein / dein.
 const dieWords=lesson.possessiveRows[1][3].split(', ');
 for(const line of lesson.possessiveLines){const text=lineText(line);const match=/\b([Mm]eine?|[Dd]eine?) ([A-ZÄÖÜ][\w-]*)/.exec(text);assert(match,text);
  assert.equal(match[1].toLowerCase().endsWith('e'),dieWords.includes(match[2]),text);}
 for(const [field,answer,options] of lesson.fieldQuestions){assert.equal(options[0],answer,field);assert.equal(new Set(options).size,3,field);}
 // wir / ihr: -en for wir, -t for ihr, sein: sind / seid.
 for(const line of lesson.wirIhrLines){let g=0;const said=line.text.replace(/ \([^)]*\)/g,'').replace(/___/g,()=>line.answers[g++][0]).replace('Lindenstraße 7','Lindenstraße sieben').replace('Siemensstraße 12','Siemensstraße zwölf');assert.equal(said,line.say,line.text);}
 for(const [question,options,answer] of lesson.berufeTestC)assert.equal(options[0],answer,question);
 for(const item of [...lesson.wordChecksC,...lesson.numberChecks,...lesson.plusChecks,...lesson.helpChecks,...lesson.formChecksC,...lesson.wirChecks])assert.equal(new Set(item.options).size,item.options.length,item.q);
});

test('only the right answer is read — German, never a Turkish answer, never the question; Ihr / Ihre is not used in Teil C',()=>{
 for(const [question,,answer,say] of lesson.berufeTestC)assert(say.includes(answer.split(' / ')[0]),question);
 for(const item of [...lesson.wordChecksC,...lesson.numberChecks,...lesson.plusChecks,...lesson.helpChecks,...lesson.formChecksC,...lesson.wirChecks]){
  const right=item.options[0];
  if(!item.say)assert(item.q.includes('„'),'a Turkish answer only for „what does it mean?“: '+item.q);
  else if(/^\d+$/.test(right))assert.equal(item.say,lesson.numberWords[Number(right)],item.q);
  else assert(item.say.includes(right.split(' / ')[0]),item.q);
 }
 const texts=lesson.berufeCSpeechTexts();
 assert(!texts.some(text=>/\bIhre?\s+[A-ZÄÖÜ]/.test(text)),'the formal Ihr / Ihre only in Teil D (Nora and Rami)');
 const steps=read('app/berufe-c-steps.tsx');
 assert(steps.includes("sayFor={i=>berufeTestC[i][3]}"));
 assert(steps.includes('useEffect(()=>{latest.current.speak(heard);},[heard,round]);'),'the number of a listening question is read when it opens');
 assert(!steps.includes('<select')&&!steps.includes('TalkStep'),'no drop-down, no AI talk');
});

test('every person is one of the site\'s people, read with their own voice; every German text is a site voice',()=>{
 const known=new Set(l1.speakers.map(s=>s.key));
 for(const who of [...lesson.castL2C,...lesson.phones.map(p=>p.who),...lesson.helpDialogue.map(l=>l.who),...lesson.flatDialogue.map(l=>l.who),...lesson.helpLines.map(l=>l.who),...lesson.possessiveLines.map(l=>l.who),...lesson.wirIhrLines.map(l=>l.who),...lesson.practiceItemsC.map(i=>i.who)])assert(known.has(who),who);
 const texts=lesson.berufeCSpeechTexts();assert.equal(new Set(texts).size,texts.length);assert(texts.length>100,String(texts.length));
 assert(!texts.some(text=>/___|…|~|\|/.test(text)),'no gaps or marks are read');
 for(const text of ['null','zwanzig',lesson.countAll,'Meine Telefonnummer ist null eins sieben sechs, drei drei vier fünf, sechs zwei eins.','vier plus sechs plus eins ist elf.','Nachname bedeutet: Wie heißt du?','Wir heißen Omar und Nikos. Woher kommt ihr?'])assert(texts.includes(text),text);
 assert(read('scripts/voices/list-texts.cjs').includes("load('berufe-c-course').berufeCSpeechTexts()"));
});

test('Teil C lives in the Lektion 2 notebook: part c, its own scores, Konuş, the end opens Teil D',()=>{
 const shell=read('app/berufe-study.tsx');
 for(const piece of ["c:{id:'c',badge:'C'","View:StepViewL2C","import {StepViewL2C} from './berufe-c-steps';"])assert(shell.includes(piece),piece);
 assert.equal(a.berufeParts[2].title,'Wir brauchen Hilfe.');
 assert.equal(sync.syncLessonOf(progress.L2C_SCORES_KEY),'l2');assert.equal(sync.syncLessonOf('lernkoko-l2c-run'),'l2');
 const full={};for(const {id,total} of progress.l2PartCounted.c)full[id]={right:total,total};
 assert.equal(progress.partProgressL2('c',full).percent,100);
 const steps=read('app/berufe-c-steps.tsx');for(const step of lesson.berufeStepsC)assert(steps.includes(`case '${step.id}':`),step.id);
 assert(steps.includes("onClick={()=>onPart('d',0)}"),'the end of Teil C opens Teil D');
 assert(steps.includes("case 'konus':return <SpeakStep "),'Konuş is the shared speaking practice');
 for(const piece of ['.l2-numgrid','.l2-hands','.l2-formcard','.l2-phone-gap'])assert(read('app/berufe.css').includes(piece),piece);
});
