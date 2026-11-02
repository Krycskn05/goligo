// Lektion 2 „Berufe“, Teil D – Ich verstehe das nicht. (2 November 2026): the learner's fourth lesson page of Lektion 2 with
// „Alles klar?“ (32 points, like Lektion 1D), the points page and Sprechen Teil 1; the learner's own form stays on the device.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const lesson=load('berufe-d-course'),a=load('berufe-course'),b=load('berufe-b-course'),c=load('berufe-c-course'),progress=load('berufe-progress'),l1=load('willkommen-course'),sync=load('lesson-sync');
const read=file=>fs.readFileSync(file,'utf8');
const gaps=line=>line.parts.filter(part=>typeof part!=='string');

test('21 steps like the learner\'s page: cover, 6 teaching steps, 6 exercises, Alles klar? (4 sections, test, points), Konuş, Bitti',()=>{
 assert.equal(lesson.berufeStepsD.length,21);
 assert.deepEqual(lesson.berufeStepsD.map(step=>step.kind),['cover',...Array(6).fill('teach'),...Array(10).fill('exercise'),'test','end','speak','end']);
 assert.equal(new Set(lesson.berufeStepsD.map(step=>step.id)).size,21);
 assert.deepEqual(lesson.berufeGroupsD.map(group=>group.label+':'+group.ids.length),['Konu anlatımı:6','Alıştırmalar:6','Alles klar?:6','Konuş:1']);
 const total=id=>lesson.berufeScoredD.find(e=>e.id===id).total;
 assert.deepEqual(['hoeren','form-dinle','fiil-yaz','pantomim','heceler','dein-formular'].map(total),[4,7,13,7,6,7]);
 // Alles klar?: every section's total is its points; 5 + 5 + 5 + 5 + 12 = 32 (the learner's page).
 assert.equal(lesson.checkPointsD,32);
 for(const section of lesson.checkSectionsD){assert.equal(total(section.id),section.points,section.id);assert(lesson.berufeGroupsD[2].ids.includes(section.id),section.id);}
 for(const id of [...lesson.berufeGroupsD[1].ids,...lesson.berufeGroupsD[2].ids])assert(lesson.berufeStepShortD[id],id);
 for(const file of ['kapak-d','pokal-2'])assert(fs.existsSync('public/toon/lektion2/'+file+'.webp'),file);
});

test('the exercises agree with the texts: Nora is a nurse, Rami\'s form, the verb table, the mime game, the syllables',()=>{
 const day=lesson.firstDay.map(line=>line.de).join(' ');
 assert(day.includes('Ich bin Krankenpflegerin')&&day.includes('Ich spreche nur ein bisschen Deutsch'));
 assert.deepEqual(lesson.firstDayRows.map(row=>row[1]),['Richtig','Falsch','Richtig','Falsch']);
 for(const [,answer,say] of lesson.firstDayRows)assert(say.startsWith(answer),say);
 // The form of the heard dialogue is Rami's card; the choices hold the answer.
 const card=Object.fromEntries(lesson.ramiForm);
 for(const field of lesson.formFields){assert.equal(field.answer,card[field.label],field.label);if(field.options)assert(field.options.includes(field.answer),field.label);}
 assert.equal(card.Telefonnummer,'0157 2345 678');assert.equal(card.PLZ,'10435');assert.equal(card['Straße und Hausnummer'],'Kastanienallee 25');
 // The verb table: 13 gaps; -t for er and ihr, sprichst / spricht, sind / seid.
 assert.equal(lesson.tableCells.length,13);
 assert.deepEqual(lesson.tableCells.filter(cell=>cell.col===1).map(cell=>cell.answer),['sprichst','spricht','sprecht']);
 assert.deepEqual(lesson.tableCells.filter(cell=>cell.col===2).map(cell=>cell.answer),['bist','sind','seid','sind']);
 for(const [,answer,options] of lesson.mimeRows){assert.equal(options[0],answer);assert.equal(new Set(options).size,3);assert(/^Ihr \w+t\.$/.test(answer),answer);}
 for(const parts of lesson.syllableOrder)assert(lesson.syllableWords.some(([syllables,word])=>syllables.join('')===parts.join('')&&word===parts.join('')),parts.join(''));
 assert.equal(lesson.syllableMeanings.length,lesson.syllableOrder.length);
 // Alles klar?: the box words once each; Grammatik sentences without marks; the questions fit their answers (ihr).
 const vocab=lesson.vocabLinesD.flatMap(line=>gaps(line).map(gap=>gap.answer)).sort();assert.deepEqual(vocab,[...lesson.vocabBoxD].sort());
 assert.equal(lesson.grammarLinesD.length,10);assert(lesson.grammarSayD.every(text=>!/___|\(/.test(text)));
 assert.equal(lesson.grammarSayD[3],'Ich arbeite als Verkäuferin.','Sabine is a Verkäuferin');
 assert.equal(lesson.talkQuestionsD.length,lesson.talkAnswersD.length);for(const words of lesson.talkQuestionsD)assert(words.includes('ihr?')||words.includes('ihr'),words.join(' '));
 const accepts=(i,text)=>l1.acceptsAnswer(text,lesson.examFormD[i].answers[0]);
 assert(accepts(1,'Finowstrasse 21')&&accepts(2,'22765 Hamburg')&&accepts(4,'Polnisch und Deutsch')&&accepts(4,'Polnisch, Deutsch, Englisch')&&!accepts(4,'Englisch'));
 for(const [question,options,answer] of lesson.berufeTestD)assert.equal(options[0],answer,question);
});

test('only the right answer is read — German, never a Turkish answer, never the question',()=>{
 for(const [question,,answer,say] of lesson.berufeTestD){if(a.isTurkishText(answer)||/^\d+$/.test(answer))assert.equal(say,'',question);else assert(say.includes(answer.replace(/!$/,'')),question);}
 for(const item of [...lesson.wordChecksD,...lesson.verbChecksD,...lesson.formChecksD,...lesson.longChecks]){
  if(item.say)assert(item.say.includes(item.options[0]),item.q);else assert(item.q.includes('„'),item.q);
 }
 assert(a.isTurkishText('„Alles klar?“ – cevap:'),'a Turkish question is shown as Turkish');
 const steps=read('app/berufe-d-steps.tsx');
 assert(steps.includes("sayFor={i=>berufeTestD[i][3]}"));
 assert(!steps.includes('<select')&&!steps.includes('TalkStep'));
});

test('Ihr / Ihre only in the workplace dialogue of Nora and Rami; numbers above 20 only heard; no digits for the voices',()=>{
 const all=[...a.berufeSpeechTexts(),...b.berufeBSpeechTexts(),...c.berufeCSpeechTexts(),...lesson.berufeDSpeechTexts()];
 const formal=all.filter(text=>/\bIhre?\s+[A-ZÄÖÜ]/.test(text));
 assert.deepEqual(formal,['Familienname bedeutet: Wie ist Ihr Nachname?']);
 assert(lesson.noraRami.some(line=>line.de==='Familienname bedeutet: Wie ist Ihr Nachname?'&&line.who==='nora'));
 const texts=lesson.berufeDSpeechTexts();
 assert(!texts.some(text=>/\d/.test(text)),'digits are read as words');
 assert(texts.includes('Kastanienallee fünfundzwanzig.')&&texts.some(text=>text.includes('einundzwanzig')));
 assert(!texts.some(text=>/___|…|\|/.test(text)));
});

test('the learner\'s own form stays on this device; Konuş (Sprechen Teil 1) shows it next to Rami',()=>{
 assert.equal(sync.syncLessonOf(lesson.L2D_FORM_KEY),null,'never sent to the account');
 const ok=(key,value)=>lesson.ownFieldOk(lesson.ownFields.find(field=>field.key===key),value);
 assert(ok('plz','10435')&&!ok('plz','1043')&&ok('tel','0157 2345 678')&&!ok('tel','0157')&&ok('vor','Ali')&&!ok('vor','A'));
 const steps=read('app/berufe-d-steps.tsx');
 for(const piece of ['localStorage.setItem(L2D_FORM_KEY,JSON.stringify(next))','ownJobSentence()','<SpeakStep kicker="Konuş · Prüfungstraining: Sprechen Teil 1"'])assert(steps.includes(piece),piece);
 assert(!/fetch\(|lesson-sync/.test(steps),'the form is not sent anywhere');
 assert.deepEqual(lesson.examTalk.map(item=>item.question),['Name?','Land?','Wohnort?','Sprachen?','Beruf?']);
 assert.equal(lesson.examTalk[0].rami,'Ich heiße Rami Khalil.');assert.equal(l1.speakerOf(lesson.examTalk[0].rami),'rami');
});

test('Alles klar?: the points page like Lektion 1D, half a point per Grammatik gap, a wrong order or İpucu costs a point',()=>{
 const steps=read('app/berufe-d-steps.tsx');
 for(const piece of ["onScore={(id,right,total)=>props.onScore(id,Math.floor(right*5/total),5)}",'goalLabel="Cevap:" strict','Bitte noch üben!','{total} / {checkPointsD}',"case 'puanlar':return <PointsD {...props}/>;"])assert(steps.includes(piece),piece);
 const ui=read('app/willkommen-ui.tsx');
 assert(ui.includes('const total=right+(strict&&miss?0:1);')&&ui.includes('if(strict)setMiss(true);'));
 assert(ui.includes("finish(total,orderSentences.length,[orderSay(sentence.join(' '))],true)"),'the end sound goes by the last answer');
});

test('Teil D lives in the Lektion 2 notebook: part d, its own scores; all four parts make the unit card',()=>{
 const shell=read('app/berufe-study.tsx');
 for(const piece of ["d:{id:'d',badge:'D'","View:StepViewL2D","testNote:`Alles klar? · ${checkPointsD} puan`","konus:'Sesli pratik'"])assert(shell.includes(piece),piece);
 assert.equal(a.berufeParts[3].title,'Ich verstehe das nicht.');
 assert.equal(sync.syncLessonOf(progress.L2D_SCORES_KEY),'l2');
 const full=list=>Object.fromEntries(list.map(({id,total})=>[id,{right:total,total}]));
 const all={a:full(a.berufeScored),b:full(b.berufeScoredB),c:full(c.berufeScoredC),d:full(lesson.berufeScoredD)};
 assert.equal(progress.partProgressL2('d',all.d).percent,100);
 assert.equal(progress.lessonTwoProgress(all).percent,100);assert(progress.lessonTwoProgress({...all,d:{}}).percent<100);
 const steps=read('app/berufe-d-steps.tsx');for(const step of lesson.berufeStepsD)assert(steps.includes(`case '${step.id}':`),step.id);
 assert(read('scripts/voices/list-texts.cjs').includes("load('berufe-d-course').berufeDSpeechTexts()"));
 const known=new Set(l1.speakers.map(s=>s.key));
 for(const who of [...lesson.castL2D,...lesson.firstDay.map(l=>l.who),...lesson.noraRami.map(l=>l.who),...lesson.vocabLinesD.map(l=>l.who),...Object.values(lesson.grammarSpeakersD)])assert(known.has(who),who);
});
