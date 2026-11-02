// Voices go by the name (the learner asked, 31 October 2026: "Sabine Krüger had one voice in one A1 lesson and another voice in
// another — whatever you add to the site, the lessons go by the name; the voices of the Sesler list are the voices in the texts").
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const l1=load('willkommen-course'),l1b=load('willkommen-b-course'),l1c=load('willkommen-c-course'),l1d=load('willkommen-d-course'),stadt=load('stadt-course'),berufe=load('berufe-course'),berufeB=load('berufe-b-course'),berufeC=load('berufe-c-course'),berufeD=load('berufe-d-course');
const hoeren=load('ausbildung-hoeren'),{siteVoices}=load('site-voices');
const read=file=>fs.readFileSync(file,'utf8');
const styleOf=key=>l1.speakers.find(s=>s.key===key)?.style;
const asSay=line=>({text:line.say??line.text??line.de,who:line.who});

test('a person who names themselves is found: full name, first name, Frau/Herr + surname, anywhere in the text',()=>{
 const cases={
  'Ich heiße Sabine Krüger.':'sabine','Und ich bin Sabine. Bis bald, Omar!':'sabine','Ich bin Frau Krüger.':'sabine',
  'Hallo! Ich bin neu hier. Ich heiße Tomasz. Wie heißt du?':'tomasz','Hallo! Ich bin neu hier. Mein Name ist Aisha Kamau.':'aisha',
  'Ja, gern! Ich bin Nora.':'nora','Guten Tag, ich bin Mei Suwan':'mei','hallo! ich heiße nora weiß. ich komme aus österreich.':'nora',
  'Ich bin Tomasz Nowak und ich komme aus Polen.':'tomasz','Ich heiße Tarek Salim.':'tarek','Ich bin Lena Vogt. Und Sie?':'lena',
 };
 for(const [text,key] of Object.entries(cases))assert.equal(l1.speakerOf(text),key,text);
 for(const text of ['Ich bin neu hier.','Ich komme aus Polen.','Ich bin Tierarzt von Beruf.','Ich bin Meier.','Woher kommen Sie, Frau Krüger?','Sind Sie Herr Khalil? Richtig?','Ich heiße …'])
  assert.equal(l1.speakerOf(text),undefined,text);
});

test('the voice of a text: the person it names wins over the given speaker; otherwise the given speaker, else the chosen voice',()=>{
 assert.equal(l1.voiceOwner('Ich heiße Sabine Krüger.'),'sabine','a phrase list line without a speaker');
 assert.equal(l1.voiceOwner({text:'Ich bin Sabine Krüger.',who:'yasemin'}),'sabine');
 assert.equal(l1.voiceOwner({text:'Woher kommen Sie, Herr Nasser?',who:'sabine'}),'sabine');
 assert.equal(l1.voiceOwner('Guten Tag!'),undefined);
 // Every name of the Sesler list is read by the voice of that name.
 for(const voice of siteVoices)assert.equal(l1.speakerVoice(l1.voiceOwner(`Hallo! Ich heiße ${voice.name}.`),siteVoices),voice.id,voice.name);
});

test('the lessons read every self-introduction with the person\'s own voice, and nobody borrows a voice next to its owner',()=>{
 const texts=[...l1.willkommenSpeechTexts(),...l1b.willkommenBSpeechTexts(),...l1c.willkommenCSpeechTexts(),...l1d.willkommenDSpeechTexts(),...stadt.stadtSpeechTexts(),...berufe.berufeSpeechTexts(),...berufeB.berufeBSpeechTexts(),...berufeC.berufeCSpeechTexts(),...berufeD.berufeDSpeechTexts()];
 let named=0;
 for(const text of texts){const key=l1.speakerOf(text);if(!key)continue;named++;
  const speaker=l1.speakers.find(s=>s.key===key);assert(text.toLowerCase().includes(speaker.name.split(' ')[0].toLowerCase()),text);}
 assert(named>=30,'the lessons have many self-introductions ('+named+')');
 // Each exercise with several people: after the names are applied, no two people share a voice (Lena, Mira, Jonas and Tarek
 // borrow Sabine's, Aisha's, Rami's and Nikos' voices, so they are never in one step with them).
 const owners=items=>[...new Set(items.map(l1.voiceOwner).filter(Boolean))];
 const steps={
  harfler:l1.withSpeakers(l1.lettersExercise.say,l1.exerciseSpeakers.harfler),eslestir:l1.matchPairs.flatMap(l1.matchSay),
  sirala:l1.orderSentences.map(s=>l1.orderSay(s.join(' '))),ayir:l1.withSpeakers(l1.gluedSay,l1.exerciseSpeakers.ayir),
  soru:l1.withSpeakers(l1.questionSay,l1.exerciseSpeakers.soru),kutu:l1.withSpeakers(l1.boxSay,l1.exerciseSpeakers.kutu),
  kisiler:l1.people.map(p=>({text:l1.personSpeech(p),who:p.key})),dinle:l1.listenItems.map(i=>({text:i.text,who:i.key})),
  diyalog:l1.dialogue.map(([who,de])=>({text:de,who:l1.dialogueSpeaker(who)})),
  'B kutu':l1.withSpeakers(l1b.boxSayB,{a:'aisha',b:'tomasz'}),'C kutu':l1.withSpeakers(l1c.boxSayC,{a:'nikos',b:'nora'}),
  'D comic':l1.withSpeakers(l1d.comicGapSay,{a:'nora',b:'yasemin'}),'D vocab':l1.withSpeakers(l1d.vocabSay,{a:'tomasz',b:'sabine'}),
  'D talk':l1.withSpeakers(l1d.talkSay,{a:'nora',b:'rami'}),'15 Amt':stadt.officeDialogue.map(asSay),'15 Schule':stadt.schoolDialogue.map(asSay),
  '2A sohbet':berufe.chatLines.map(asSay),'2A dört kişi':berufe.fourPeople.map(asSay),'2A diyalog':berufe.dialogueSay,'2A pratik':berufe.practiceItems.map(item=>({text:item.question,who:item.who})),
  '2B Rami':berufeB.ramiTalk.map(text=>({text,who:'rami'})),'2B pratik':berufeB.practiceItemsB.map(item=>({text:item.question,who:item.who})),
  '2C yardım':berufeC.helpDialogue.map(asSay),'2C ev':berufeC.flatDialogue.map(asSay),'2C telefon':berufeC.phones.map(p=>({text:berufeC.phoneSay(p.number),who:p.who})),
  '2C diyalog':berufeC.helpSay,'2C mein-dein':berufeC.possessiveLines.map(line=>line.say),'2C wir-ihr':berufeC.wirIhrLines.map(asSay),'2C pratik':berufeC.practiceItemsC.map(item=>({text:item.question,who:item.who})),
  '2D ilk gün':berufeD.firstDay.map(asSay),'2D Nora':berufeD.noraRami.map(asSay),'2D form':berufeD.formTalk,'2D Wortschatz':berufeD.vocabLinesD.map(line=>line.say),
  '2D Grammatik':l1.withSpeakers(berufeD.grammarSayD,berufeD.grammarSpeakersD),'2D Sprechen':berufeD.examTalk.flatMap(item=>[{text:item.question,who:'paul'},{text:item.rami,who:'rami'}]),
 };
 for(const [id,items] of Object.entries(steps)){const keys=owners(items);assert(keys.length,id);
  assert.equal(new Set(keys.map(styleOf)).size,keys.length,id+': '+keys.join(','));}
 assert.deepEqual(owners(steps.harfler),['mira','tarek']);assert.deepEqual(owners(steps.ayir),['paul','lena']);
});

test('Lektion 12: every person of the listening texts keeps one voice in every task, of their own kind, never shared in a task',()=>{
 const styles=hoeren.hoerenVoiceStyles;
 for(const task of hoeren.hoerenTasks){
  const people=[...new Set((task.lines??[]).map(line=>line.who).filter(who=>hoeren.speakerVoice(who)!=='n'))];
  for(const who of people){const style=styles[who];assert(style,task.id+' '+who);
   const voice=siteVoices.find(v=>v.style===style);assert.equal(voice.gender,hoeren.speakerVoice(who)==='f'?'female':'male',who);
   assert(!['F1','M3'].includes(style),who+' does not take Sabine\'s or Paul\'s voice');}
  assert.equal(new Set(people.map(who=>styles[who])).size,people.length,task.id+': '+people.join(','));
 }
 assert.equal(styles.Jonas,styleOf('jonas'),'Jonas has the same voice as in Lektion 1');
 assert(read('app/ausbildung-listen.tsx').includes('hoerenVoiceStyles[who]'));
});

test('the speech of every lesson uses the name rule, and Teil B reads the whole solved ending sentences',()=>{
 const ui=read('app/willkommen-ui.tsx');
 assert(ui.includes('const say=useCallback((item:SayItem)=>{const who=voiceOwner(item);'),'reading');
 assert(ui.includes('const who=voiceOwner(item);const url=siteClipUrls('),'loading the clips early');
 for(const page of ['app/willkommen-study.tsx','app/stadt-study.tsx','app/berufe-study.tsx'])assert(read(page).includes('useLessonSpeech()'),page);
 assert(l1b.endingSay.includes('Ich bin neu hier.')&&l1b.endingSay.includes('Welche Sprachen sprichst du?')&&l1b.endingSay.includes('Sie heißen Frau Krüger.'));
 assert(l1b.endingSay.every(text=>!text.includes('___')));
});
