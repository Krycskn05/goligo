// Lektion 5 „Alltag und Freizeit“ (the learner asked, 8 November 2026): Teil A–D as data (lib/alltag-*.ts) drawn by one
// step view (app/alltag-steps.tsx) like Lektion 3 and 4: words first, then the topics, the exercises in order, a test
// (Teil D: Alles klar?), Konuş.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('alltag-course'),progress=load('alltag-progress'),sync=load('lesson-sync'),place=load('last-place'),words=load('willkommen-course'),goals=load('unit-goals');
const read=file=>fs.readFileSync(file,'utf8');
const languages=['en','ar','uk','de'];
const packs=Object.fromEntries(languages.map(id=>[id,JSON.parse(read(`lib/unit-packs/${id}.json`))]));

test('four parts in the order of the book, every step id once, words → topics → exercises → test → Konuş → end',()=>{
 assert.deepEqual(course.alltagPartList.map(part=>part.id),['a','b','c','d']);
 assert.deepEqual(course.alltagPartList.map(part=>part.title),['Hast du Zeit?','Das sind meine Tipps.','Boxen macht Spaß!','Mein Hobby ist auch mein Beruf.']);
 assert.equal(course.ALLTAG_UNIT,'book-05');assert.equal(course.ALLTAG_PATH,'/a1-1/alltag-und-freizeit');
 const order=['cover','teach','exercise','test','speak','end'];
 for(const part of course.alltagPartList){
  const ids=part.steps.map(step=>step.id);assert.equal(new Set(ids).size,ids.length,part.id+': unique ids');
  const kinds=part.steps.map(step=>order.indexOf(step.kind));assert.ok(kinds.every((k,i)=>k>=0&&(i===0||k>=kinds[i-1])),part.id+': steps in order');
  assert.equal(part.steps[0].kind,'cover');assert.ok(part.steps[1].blocks.some(block=>block.t==='cards'),part.id+': the words come first');
  assert.ok(part.steps.some(step=>(step.blocks??[]).some(block=>block.t==='list')),part.id+': a word list');
  assert.ok(part.steps.some(step=>(step.blocks??[]).some(block=>block.t==='checks'&&block.title)),part.id+': a word check');
  assert.ok(part.steps.filter(step=>step.kind==='exercise').length>=8,part.id+': eight exercises');
  assert.ok((part.steps.find(step=>step.kind==='test').test??[]).length>=12,part.id+': a test');
  assert.ok(Object.keys(part.short).every(id=>ids.includes(id)),part.id+': short names of real steps');
  for(const block of part.steps.flatMap(step=>step.blocks??[]))if(block.t==='table'){
   if(block.say)assert.equal(block.say.length,block.rows.length,part.id+': a table reads every row');
   for(const cells of block.rows)assert.equal(cells.length,block.head.length,part.id+': a row has a cell under every heading');
  }
  // The exercises' kickers are numbered in order: Alıştırma 1, 2, 3 …
  part.steps.filter(step=>step.kind==='exercise').forEach((step,i)=>assert.ok(step.kicker.startsWith('Alıştırma '+(i+1)+' · '),part.id+':'+step.id));
 }
 const test=course.alltagParts.d.steps.find(step=>step.kind==='test');
 assert.equal(test.title,'Alles klar?','Teil D ends with Alles klar? over the whole unit');assert.ok(test.test.length>=15);
 assert.ok(goals.unitGoalsFor('book-05').length>=8);assert.deepEqual(course.alltagGoals,goals.unitGoalsFor('book-05'));
});

test('the topics of the learner\'s pages are all there (nothing skipped)',()=>{
 const all=JSON.stringify(course.alltagPartList);
 for(const piece of [
  // A: the day, the times of the day, morgen, gern, Ja-/Nein-Fragen, inviting
  'duschen','frühstücken','zur Arbeit gehen','ins Bett gehen','im Internet surfen','Lebensmittel kaufen','Musik hören','putzen','telefonieren','Tischtennis spielen',
  'am Vormittag','am Nachmittag','in der Nacht','Morgen habe ich frei.','Ich putze nicht gern.','Kochen Sie gern','Ja, ich komme gern.','Oh, schade!','Bis morgen!',
  // B: free time, the city, tips, the irregular verbs, the sounds
  'einen Film sehen','Fahrrad fahren','ein Picknick machen','einen Spaziergang machen','das Schwimmbad','die Bibliothek','der Eintritt','Hast du einen Tipp für mich?','Viel Spaß!',
  'sprichst','triffst','isst','hilfst','siehst','liest','fährst','schläfst','läufst','a – ä',
  // C: the week, the club, am Dienstagabend, reactions, ihr, ll / tt / mm / ff
  'der Montag','der Sonntag','das Wochenende','am Dienstagabend','Hausaufgabenhilfe','Das macht Spaß!','Das ist langweilig.','Ich weiß nicht.','Ich komme auch!','Habt ihr','ll, tt, mm',
  // D: the interview, beruflich / Freizeit, the four posters, the pantomime
  'Was unterrichten Sie?','Wann sind Ihre Kurse?','Haben Sie noch einen Beruf?','Was machen Sie in Ihrer Freizeit?','beruflich','regelmäßig','au → äu','Nein, leider falsch.',
 ])assert.ok(all.includes(piece),piece);
});

test('every exercise can be solved: the right answer is among the options, every pattern takes its example',()=>{
 for(const part of course.alltagPartList)for(const step of part.steps){
  const where=part.id+':'+step.id;const exercise=step.exercise;
  if(exercise?.type==='quiz')for(const item of exercise.items){assert.equal(new Set(item.options).size,item.options.length,where);assert.ok(item.options.length>=2,where);}
  if(exercise?.type==='choice')for(const line of exercise.lines)for(const part2 of line.parts)if(typeof part2!=='string'){assert.ok(part2.options.includes(part2.answer),where+' '+line.key);assert.equal(new Set(part2.options).size,part2.options.length,where+' '+line.key);}
  if(exercise?.type==='gaps')for(const line of exercise.lines)assert.equal((line.text.match(/___/g)??[]).length,line.answers.length,where+' '+line.text);
  if(exercise?.type==='gaps')assert.equal(exercise.say.length,exercise.lines.length,where);
  if(exercise?.type==='write')for(const row of exercise.rows)assert.ok(row.answers.length&&row.answers.every(answer=>words.acceptsAnswer(answer,row.answers)),where+' '+row.given);
  if(exercise?.type==='own'){assert.match(exercise.key,/^lernkoko-l5[a-d]-own$/);for(const prompt of exercise.prompts)assert.match(words.normalizeLoose(prompt.placeholder),prompt.pattern,where+' '+prompt.placeholder);}
  for(const question of step.test??[]){assert.ok(question[1].includes(question[2]),where+' '+question[0]);assert.equal(question[1][0],question[2],where+': the first option is right');assert.equal(new Set(question[1]).size,question[1].length,where+' '+question[0]);}
  for(const row of step.speak??[])if(row.own){assert.match(words.normalizeLoose(row.answer),row.own.pattern,where+' '+row.answer);
   const own=part.steps.find(item=>item.exercise?.type==='own'&&item.exercise.key===row.own.key);assert.ok(own,where+': Konuş reads the own sentences of its part');
   assert.equal(String(own.exercise.prompts[row.own.index].pattern),String(row.own.pattern),where+': the same pattern as the exercise');}
 }
 for(const part of ['a','b','c','d'])assert.ok(course.alltagScored[part].every(item=>item.total>0),part);
 // The double letters (Teil C, Alıştırma 7) are double letters.
 for(const line of course.alltagParts.c.steps.find(step=>step.id==='doppel').exercise.lines)assert.match(line.answers[0][0],/^(ll|tt|mm|ff)$/,line.text);
 // The learner's mistakes in the book come back in the exercises: du / er of the irregular verbs, er spielt, Sie + -en, morgen ≠ Morgen.
 const all=JSON.stringify(course.alltagPartList);
 for(const piece of ['fährst','läuft','sieht','isst','spielt','Kochen','Hast du morgen Zeit?','Am Morgen'])assert.ok(all.includes(piece),piece);
});

test('only the right answer is read after an answer: never a Turkish text, never the question',()=>{
 for(const part of course.alltagPartList)for(const step of part.steps){
  for(const question of step.test??[])assert.ok(!course.isAlltagTurkish(question[3]),part.id+':'+step.id+' '+question[3]);
  if(step.exercise?.type==='quiz')for(const item of step.exercise.items)assert.ok(!course.isAlltagTurkish(item.say??item.options[0]),part.id+':'+step.id);
  if(step.exercise?.type==='own')for(const prompt of step.exercise.prompts)assert.ok(!course.isAlltagTurkish(prompt.question),part.id+':'+step.id+' '+prompt.question);
  for(const block of step.blocks??[])if(block.t==='checks')for(const item of block.items)assert.ok(item.say===''||!course.isAlltagTurkish(item.say),part.id+':'+step.id+' '+item.q);
 }
 const voices=course.alltagSpeechTexts();assert.ok(voices.length>400,voices.length);
 assert.ok(voices.every(text=>!course.isAlltagTurkish(text)),'only German is spoken');
 assert.match(read('scripts/voices/list-texts.cjs'),/load\('alltag-course'\)\.alltagSpeechTexts\(\)/,'the site voices are made for Lektion 5');
});

test('every Turkish text of Lektion 5 is in the English, Arabic, Ukrainian and German packs (CLAUDE.md: five languages)',()=>{
 const texts=new Set([...course.alltagTurkishTexts(),...goals.unitGoalsFor('book-05')]);
 for(const file of ['app/alltag-steps.tsx','app/alltag-study.tsx']){
  const source=read(file);
  for(const m of source.matchAll(/\but\((['"])((?:\\.|(?!\1).)*)\1/g))texts.add(m[2]);
  for(const m of source.matchAll(/<Tx(?: key="[^"]*")? text="([^"]*)"/g))texts.add(m[1]);
 }
 assert.ok(texts.size>500,texts.size);
 for(const id of languages)for(const text of texts)assert.ok(typeof packs[id][text]==='string'&&packs[id][text].trim(),id+': '+text);
 const marks=text=>[...text.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort().join(' ');
 const german=text=>[...text.replace(/\*\*[^*]+\*\*/g,'').matchAll(/\*(?!\*)[^*\s][^*]*\*(?!\*)|~[^~]+~|\[(?:der|die|das)\]/g)].map(m=>m[0]).sort().join(' | ');
 for(const id of languages)for(const text of texts){assert.equal(marks(packs[id][text]),marks(text),id+' {marks}: '+text);assert.equal(german(packs[id][text]),german(text),id+' German parts: '+text);}
 // A word shown as a question must not give its German answer away in the German help (Kelime kontrolü, the tests).
 for(const [text,answer] of [['sabah',/Morgen/],['yarın',/morgen/i],['akşam',/Abend/],['yemek pişirmek',/koch/i],['temizlik yapmak, silmek',/putz/i],['gıda alışverişi yapmak',/Lebensmittel/],
  ['kütüphane',/Bibliothek/],['yüzme havuzu',/Schwimmbad/],['bisiklete binmek',/Fahrrad/],['futbol oynamak',/Fußball/],['öneri, tavsiye',/Tipp/],
  ['cuma',/Freitag/],['çarşamba',/Mittwoch/],['hafta sonu',/Wochenende/],['kulüp, dernek',/Verein/],['ev ödevi',/Hausaufgabe/],['ders vermek, öğretmek',/unterricht/i],['yaptığın iş, meslek',/Beruf/],
  ['„yarın“',/morgen/i],['„çarşamba“',/Mittwoch/],['„cumartesi“',/Samstag/],['„sıkıcı“',/langweilig/],['„bu akşam“',/heute Abend/i],['„Maalesef gelemiyorum.“',/leider/],['„Bana bir önerin var mı?“',/Tipp/],
  ['„Yarın vaktin var mı?“',/morgen/i],['„Müzik dinlemeyi severim.“',/höre gern/i],['„Öğleden sonra boşum.“',/Nachmittag/]])assert.ok(!answer.test(packs.de[text]),'de gives the answer away: '+text+' → '+packs.de[text]);
});

test('our own names, places and texts: the site\'s people, nothing of the book',()=>{
 const source=['a','b','c','d'].map(id=>read(`lib/alltag-${id}.ts`)).join('\n');
 for(const name of ['Helen','Todor','Karim','Martina','Tamara','Eric','Svoboda','Enisa','Mascha','Safaa','Ahmed','Dario','Tatjana','Mohamed','Yola','Elena','Petridis','Eleni','Arif','Schöneberg','Alexa','Makeeva',
  'Selma','André','Fethi','Natalie','Ian','Yusuf','Liao','Marouf','Tine','Schumacher','Hamadi','Ella','Mannheim','Wuppertal','Luisenpark','Herschelbad','Waldpark','Little Istanbul','Cineplex','Kreuzberg','Ringstraße','Fortuna','Reutlingen','Sirtaki','Tsamikos'])
  assert.ok(!new RegExp('\\b'+name+'\\b').test(source),name);
 const cast=new Set(course.alltagPartList.flatMap(part=>part.steps.flatMap(step=>[...(step.cover?.cast??[]),...(step.blocks??[]).flatMap(block=>block.t==='talk'?block.lines.map(line=>line.who):block.t==='rows'&&block.who?[block.who]:[]),...(step.speak??[]).map(row=>row.who)])));
 assert.ok(cast.size>=9,'the site\'s people');
 // The teacher has no picture (his initial stands there, tests/teacher-figure.test.cjs).
 for(const who of cast)if(who!=='paul')assert.ok(fs.existsSync(`public/toon/lektion1/${who}.webp`),who+' has a portrait and a voice');
});

test('pictures: the learner\'s 3D pictures (9 November 2026) and the site\'s verb pictures exist; every card and picture quiz has one',()=>{
 const pictures=load('alltag-pictures');
 const size=file=>{const b=fs.readFileSync(file);assert.equal(b.toString('ascii',0,4),'RIFF',file);assert.equal(b.toString('ascii',12,16),'VP8 ',file);return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];};
 for(const [key,src] of Object.entries(pictures.alltagPic)){assert.ok(typeof src==='string'&&fs.existsSync('public'+src),key+' '+src);if(src.startsWith('/toon/lektion5/'))assert.deepEqual(size('public'+src),[640,480],src);}
 for(const part of course.alltagPartList){assert.match(part.cover.src,/^\/toon\/lektion5\/kapak-[a-d]\.webp$/);assert.deepEqual(size('public'+part.cover.src),[960,540],part.cover.src);}
 const files=fs.readdirSync('public/toon/lektion5');
 assert.ok(!files.some(file=>file.startsWith('gecici')),'the temporary covers are gone');
 assert.equal(files.filter(file=>file.endsWith('.webp')).length,66,'the 62 things and 4 covers');
 // Two word pictures showed the teacher: they were made again without him under new names (11 November 2026).
 for(const key of ['spaziergang','unterrichten'])assert.equal(pictures.alltagPic[key],'/toon/lektion5/'+key+'-2.webp',key);
 // every picture of the list for ChatGPT arrived and is used
 const list=read('Claude outputs/lektion5-resim-listesi.txt');const used=new Set(Object.values(pictures.alltagPic));
 for(const file of files.filter(file=>!file.startsWith('kapak-'))){assert.ok(list.includes(file.replace('.webp','').replace(/-2$/,'')),file+' is in the list');assert.ok(used.has('/toon/lektion5/'+file),file+' is used');}
 for(const part of course.alltagPartList)for(const step of part.steps){
  for(const block of step.blocks??[])if(block.t==='cards')for(const word of block.words)assert.ok(word.pic,part.id+': '+word.de);
  if(step.exercise?.type==='quiz')for(const item of step.exercise.items)assert.ok(item.pic||item.listen||!item.emoji,part.id+':'+step.id);
 }
});

test('progress: kept in the browser, travels with the account as lesson l5; the own sentences stay on the device',()=>{
 assert.ok(sync.SYNC_LESSONS.includes('l5'));
 for(const key of [progress.l5PartKeys.a.scores,progress.l5PartKeys.d.step,progress.L5_PART_KEY,'lernkoko-l5b-run'])assert.equal(sync.syncLessonOf(key),'l5',key);
 for(const key of ['lernkoko-l5a-own','lernkoko-l5b-own','lernkoko-l5c-own','lernkoko-l5d-own'])assert.equal(sync.syncLessonOf(key),null,key);
 assert.equal(sync.syncLessonOf('lernkoko-l15a-scores'),'l15','Lektion 15 stays l15');assert.equal(sync.syncLessonOf('lernkoko-l4a-scores'),'l4','Lektion 4 stays l4');
 const empty=progress.lessonFiveProgress({});assert.equal(empty.percent,0);assert.ok(empty.total>100);
 assert.equal(place.placePath('alltag'),'/a1-1/alltag-und-freizeit');assert.equal(place.placeUnit.alltag,'book-05');
 assert.equal(place.lessonStepHref('alltag','c','test'),'/a1-1/alltag-und-freizeit?teil=c&adim=test');
});

test('the unit card on Üniteler opens Lektion 5 and shows its progress; the page exists',()=>{
 const catalogue=read('app/category-study.tsx');
 assert.ok(catalogue.includes("unit.id==='book-05'?'/a1-1/alltag-und-freizeit'")&&catalogue.includes("unit.id==='book-05'?alltag:")&&catalogue.includes("import('@/lib/alltag-progress')"));
 assert.ok(read('app/a1-1/alltag-und-freizeit/page.tsx').includes('<AlltagStudy guest={!(await getChatGPTUser())}/>'));
 assert.ok(read('app/layout.tsx').includes('import "./alltag.css";'));
 assert.ok(read('lib/visits.ts').includes("'/a1-1/alltag-und-freizeit': 'Lektion 5 · Alltag und Freizeit'"));
 assert.ok(read('ci/smoke.cjs').includes('/a1-1/alltag-und-freizeit'));
});
