// Lektion 4 „Familie“ (the learner asked, 8 November 2026): Teil A–D as data (lib/familie-*.ts) drawn by one step view
// (app/familie-steps.tsx) like Lektion 3: words first, then the topics, the exercises in order, a test (Teil D: Alles klar?), Konuş.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('familie-course'),progress=load('familie-progress'),sync=load('lesson-sync'),place=load('last-place'),words=load('willkommen-course'),goals=load('unit-goals');
const read=file=>fs.readFileSync(file,'utf8');
const languages=['en','ar','uk','de'];
const packs=Object.fromEntries(languages.map(id=>[id,JSON.parse(read(`lib/unit-packs/${id}.json`))]));

test('four parts in the order of the book, every step id once, words → topics → exercises → test → Konuş → end',()=>{
 assert.deepEqual(course.familiePartList.map(part=>part.id),['a','b','c','d']);
 assert.deepEqual(course.familiePartList.map(part=>part.title),['Das ist meine Familie.','Ich habe später ein Haus und zwei Kinder.','Das ist meine Privatsache.','Das Elfchen ist schön!']);
 assert.equal(course.FAMILIE_UNIT,'book-04');assert.equal(course.FAMILIE_PATH,'/a1-1/familie');
 const order=['cover','teach','exercise','test','speak','end'];
 for(const part of course.familiePartList){
  const ids=part.steps.map(step=>step.id);assert.equal(new Set(ids).size,ids.length,part.id+': unique ids');
  const kinds=part.steps.map(step=>order.indexOf(step.kind));assert.ok(kinds.every((k,i)=>k>=0&&(i===0||k>=kinds[i-1])),part.id+': steps in order');
  assert.equal(part.steps[0].kind,'cover');assert.ok(part.steps[1].blocks.some(block=>block.t==='cards'),part.id+': the words come first');
  assert.ok(part.steps.filter(step=>step.kind==='exercise').length>=6,part.id+': at least six exercises');
  assert.ok((part.steps.find(step=>step.kind==='test').test??[]).length>=12,part.id+': a test');
  assert.ok(Object.keys(part.short).every(id=>ids.includes(id)),part.id+': short names of real steps');
  for(const block of part.steps.flatMap(step=>step.blocks??[]))if(block.t==='table'&&block.say)assert.equal(block.say.length,block.rows.length,part.id+': a table reads every row');
 }
 assert.equal(course.familieParts.d.steps.find(step=>step.kind==='test').title,'Alles klar?','Teil D ends with Alles klar? over the whole unit');
 assert.ok(goals.unitGoalsFor('book-04').length>=8);assert.deepEqual(course.familieGoals,goals.unitGoalsFor('book-04'));
});

test('every exercise can be solved: the right answer is among the options, every pattern takes its example',()=>{
 for(const part of course.familiePartList)for(const step of part.steps){
  const where=part.id+':'+step.id;const exercise=step.exercise;
  if(exercise?.type==='quiz')for(const item of exercise.items){assert.equal(new Set(item.options).size,item.options.length,where);assert.ok(item.options.length>=2,where);}
  if(exercise?.type==='choice')for(const line of exercise.lines)for(const part2 of line.parts)if(typeof part2!=='string')assert.ok(part2.options.includes(part2.answer),where+' '+line.key);
  if(exercise?.type==='gaps')for(const line of exercise.lines)assert.equal((line.text.match(/___/g)??[]).length,line.answers.length,where+' '+line.text);
  if(exercise?.type==='write')for(const row of exercise.rows)assert.ok(row.answers.length&&words.acceptsAnswer(row.answers[0],row.answers),where+' '+row.given);
  if(exercise?.type==='own'){assert.match(exercise.key,/^lernkoko-l4[a-d]-own$/);for(const prompt of exercise.prompts)assert.match(words.normalizeLoose(prompt.placeholder),prompt.pattern,where+' '+prompt.placeholder);}
  for(const question of step.test??[]){assert.ok(question[1].includes(question[2]),where+' '+question[0]);assert.equal(question[1][0],question[2],where+': the first option is right');}
  for(const row of step.speak??[])if(row.own)assert.match(words.normalizeLoose(row.answer),row.own.pattern,where+' '+row.answer);
 }
 for(const part of ['a','b','c','d'])assert.ok(course.familieScored[part].every(item=>item.total>0),part);
 // The Elfchen (Teil D, Alıştırma 7): five lines of 1, 2, 3, 4 and 1 words.
 const elfchen=course.familieParts.d.steps.find(step=>step.id==='elfchen').exercise;
 assert.deepEqual(elfchen.prompts.map(prompt=>words.normalizeLoose(prompt.placeholder).split(' ').length),[1,2,3,4,1]);
 assert.ok(!elfchen.prompts[3].pattern.test('ich habe ein bruder zwei'),'five words do not fit line four');
 assert.ok(elfchen.prompts[0].pattern.test(words.normalizeLoose('Glück.')),'an umlaut is fine');
});

test('only the right answer is read after an answer: never a Turkish text, never the question',()=>{
 for(const part of course.familiePartList)for(const step of part.steps){
  for(const question of step.test??[])assert.ok(!course.isFamilieTurkish(question[3]),part.id+':'+step.id+' '+question[3]);
  if(step.exercise?.type==='quiz')for(const item of step.exercise.items)assert.ok(!course.isFamilieTurkish(item.say??item.options[0]),part.id+':'+step.id);
  if(step.exercise?.type==='own')for(const prompt of step.exercise.prompts)assert.ok(!course.isFamilieTurkish(prompt.question),part.id+':'+step.id+' '+prompt.question);
  for(const block of step.blocks??[])if(block.t==='checks')for(const item of block.items)assert.ok(item.say===''||!course.isFamilieTurkish(item.say),part.id+':'+step.id+' '+item.q);
 }
 const voices=course.familieSpeechTexts();assert.ok(voices.length>400,voices.length);
 assert.ok(voices.every(text=>!course.isFamilieTurkish(text)),'only German is spoken');
 assert.match(read('scripts/voices/list-texts.cjs'),/load\('familie-course'\)\.familieSpeechTexts\(\)/,'the site voices are made for Lektion 4');
});

test('every Turkish text of Lektion 4 is in the English, Arabic, Ukrainian and German packs (CLAUDE.md: five languages)',()=>{
 const texts=new Set([...course.familieTurkishTexts(),...goals.unitGoalsFor('book-04')]);
 for(const file of ['app/familie-steps.tsx','app/familie-study.tsx']){
  const source=read(file);
  for(const m of source.matchAll(/\but\((['"])((?:\\.|(?!\1).)*)\1/g))texts.add(m[2]);
  for(const m of source.matchAll(/<Tx(?: key="[^"]*")? text="([^"]*)"/g))texts.add(m[1]);
 }
 assert.ok(texts.size>500,texts.size);
 for(const id of languages)for(const text of texts)assert.ok(typeof packs[id][text]==='string'&&packs[id][text].trim(),id+': '+text);
 const marks=text=>[...text.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort().join(' ');
 const german=text=>[...text.replace(/\*\*[^*]+\*\*/g,'').matchAll(/\*(?!\*)[^*\s][^*]*\*(?!\*)|~[^~]+~|\[(?:der|die|das)\]/g)].map(m=>m[0]).sort().join(' | ');
 for(const id of languages)for(const text of texts){assert.equal(marks(packs[id][text]),marks(text),id+' {marks}: '+text);assert.equal(german(packs[id][text]),german(text),id+' German parts: '+text);}
 // A word shown as a question must not give its German answer away in the German help (Kelime kontrolü, the quizzes, the tests).
 for(const [text,answer] of [['anne',/Mutter/],['baba',/Vater/],['kız kardeş',/Schwester/],['erkek kardeş',/Bruder/],['bebek',/Baby/],['evli',/verheiratet/],['boşanmış',/geschieden/],['bahçe',/Garten/],['priz',/Steckdose/],['silgi',/Radiergummi/],['ziyaret etmek',/besuchen/],['„anne“',/Mutter/],['„erkek kardeş“',/Bruder/],['„evli“',/verheiratet/],['„ziyaret etmek“',/besuchen/]])assert.ok(!answer.test(packs.de[text]),'de gives the answer away: '+text);
});

test('our own names and texts: the site\'s people, no names of the book',()=>{
 const source=['a','b','c','d'].map(id=>read(`lib/familie-${id}.ts`)).join('\n');
 for(const name of ['Karim','Felix','Martina','Helen','Samira','Timur','Sunil','Sascha','Marina','Nour','Engert','Jannis','Naima','Hannah','Adrian','Aliya','Nathan','Ishan','Calvin','Pjotr','Mirjam','Dawoud','Hamad','Irina','Konstantinos','Pierre','Keiko','Susumu','Gehrken','Katha','Phillip','Albert','Konrad','Elke','Emma','Sofie','Julian','Sonja','Laith','Ashtar','Gabrielle'])assert.ok(!new RegExp('\\b'+name+'\\b').test(source),name);
 const cast=new Set(course.familiePartList.flatMap(part=>part.steps.flatMap(step=>[...(step.cover?.cast??[]),...(step.blocks??[]).flatMap(block=>block.t==='talk'?block.lines.map(line=>line.who):[]),...(step.speak??[]).map(row=>row.who)])));
 assert.ok(cast.size>=8,'the site\'s people');
 for(const who of cast)assert.ok(fs.existsSync(`public/toon/lektion1/${who}.webp`),who+' has a portrait and a voice');
});

test('pictures: the covers, the pictures that arrived and the Kelime Kasası ones exist; every card has a picture or its emoji',()=>{
 const pictures=load('familie-pictures');
 const size=file=>{const b=fs.readFileSync(file);assert.equal(b.toString('ascii',0,4),'RIFF',file);assert.equal(b.toString('ascii',12,16),'VP8 ',file);return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];};
 for(const src of Object.values(pictures.familiePic)){if(!src)continue;assert.ok(fs.existsSync('public'+src),src);if(src.startsWith('/toon/lektion4/'))assert.deepEqual(size('public'+src),[640,480],src);}
 for(const part of course.familiePartList){assert.match(part.cover.src,/^\/toon\/lektion4\/(gecici-)?kapak-[a-d]\.webp$/);assert.deepEqual(size('public'+part.cover.src),[960,540],part.cover.src);}
 for(const part of course.familiePartList)for(const step of part.steps){
  for(const block of step.blocks??[])if(block.t==='cards')for(const word of block.words)assert.ok(word.pic||word.emoji,part.id+': '+word.de);
  if(step.exercise?.type==='quiz')for(const item of step.exercise.items)assert.ok(item.pic||item.emoji||item.listen||item.prompt,part.id+':'+step.id);
 }
 // The course-room words of Teil D come from the Kelime Kasası already.
 for(const word of course.familieParts.d.steps[1].blocks[0].words)assert.ok(word.pic,'Teil D: '+word.de);
});

test('progress: kept in the browser, travels with the account as lesson l4; the own sentences stay on the device',()=>{
 assert.ok(sync.SYNC_LESSONS.includes('l4'));
 for(const key of [progress.l4PartKeys.a.scores,progress.l4PartKeys.d.step,progress.L4_PART_KEY,'lernkoko-l4b-run'])assert.equal(sync.syncLessonOf(key),'l4',key);
 for(const key of ['lernkoko-l4a-own','lernkoko-l4d-own'])assert.equal(sync.syncLessonOf(key),null,key);
 assert.equal(sync.syncLessonOf('lernkoko-l3a-scores'),'l3','Lektion 3 stays l3');
 const empty=progress.lessonFourProgress({});assert.equal(empty.percent,0);assert.ok(empty.total>100);
 assert.equal(place.placePath('familie'),'/a1-1/familie');assert.equal(place.placeUnit.familie,'book-04');
 assert.equal(place.lessonStepHref('familie','c','test'),'/a1-1/familie?teil=c&adim=test');
});

test('the unit card on Üniteler opens Lektion 4 and shows its progress; the page exists',()=>{
 const catalogue=read('app/category-study.tsx');
 assert.ok(catalogue.includes("unit.id==='book-04'?'/a1-1/familie'")&&catalogue.includes("unit.id==='book-04'?familie:")&&catalogue.includes("import('@/lib/familie-progress')"));
 assert.ok(read('app/a1-1/familie/page.tsx').includes('<FamilieStudy guest={!(await getChatGPTUser())}/>'));
 assert.ok(read('app/layout.tsx').includes('import "./familie.css";'));
 assert.ok(read('lib/visits.ts').includes("'/a1-1/familie': 'Lektion 4 · Familie'"));
});
