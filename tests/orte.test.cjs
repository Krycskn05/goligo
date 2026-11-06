// Lektion 3 „Orte und Dinge“ (the learner asked, 5 November 2026): Teil A–D as data (lib/orte-*.ts) drawn by one step
// view (app/orte-steps.tsx): words first, then the topics, the exercises in order, a test (Teil D: Alles klar?), Konuş.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('orte-course'),types=load('orte-types'),progress=load('orte-progress'),sync=load('lesson-sync'),place=load('last-place'),words=load('willkommen-course');
const read=file=>fs.readFileSync(file,'utf8');
const languages=['en','ar','uk','de'];
const packs=Object.fromEntries(languages.map(id=>[id,JSON.parse(read(`lib/unit-packs/${id}.json`))]));

test('four parts in the order of the book, every step id once, words → topics → exercises → test → Konuş → end',()=>{
 assert.deepEqual(course.ortePartList.map(part=>part.id),['a','b','c','d']);
 assert.deepEqual(course.ortePartList.map(part=>part.title),['Ich lerne hier Deutsch.','Ich finde, das Regal ist schön.','Was kostet die Waschmaschine?','Ich arbeite hier.']);
 assert.equal(course.ORTE_UNIT,'book-03');assert.equal(course.ORTE_PATH,'/a1-1/orte-und-dinge');
 const order=['cover','teach','exercise','test','speak','end'];
 for(const part of course.ortePartList){
  const ids=part.steps.map(step=>step.id);assert.equal(new Set(ids).size,ids.length,part.id+': unique ids');
  const kinds=part.steps.map(step=>order.indexOf(step.kind));assert.ok(kinds.every((k,i)=>k>=0&&(i===0||k>=kinds[i-1])),part.id+': steps in order');
  assert.equal(part.steps[0].kind,'cover');assert.ok(part.steps[1].blocks.some(block=>block.t==='cards'),part.id+': the words come first');
  assert.ok(part.steps.filter(step=>step.kind==='exercise').length>=6,part.id+': at least six exercises');
  assert.ok((part.steps.find(step=>step.kind==='test').test??[]).length>=12,part.id+': a test');
  assert.ok(Object.keys(part.short).every(id=>ids.includes(id)),part.id+': short names of real steps');
 }
 assert.equal(course.orteParts.d.steps.find(step=>step.kind==='test').title,'Alles klar?','Teil D ends with Alles klar? over the whole unit');
});

test('every exercise can be solved: the right answer is among the options, every pattern takes its example',()=>{
 for(const part of course.ortePartList)for(const step of part.steps){
  const where=part.id+':'+step.id;const exercise=step.exercise;
  if(exercise?.type==='quiz')for(const item of exercise.items){assert.equal(new Set(item.options).size,item.options.length,where);assert.ok(item.options.length>=2,where);}
  if(exercise?.type==='choice')for(const line of exercise.lines)for(const part2 of line.parts)if(typeof part2!=='string')assert.ok(part2.options.includes(part2.answer),where+' '+line.key);
  if(exercise?.type==='gaps')for(const line of exercise.lines)assert.equal((line.text.match(/___/g)??[]).length,line.answers.length,where+' '+line.text);
  if(exercise?.type==='write')for(const row of exercise.rows)assert.ok(row.answers.length&&words.acceptsAnswer(row.answers[0],row.answers),where+' '+row.given);
  if(exercise?.type==='own'){assert.match(exercise.key,/^lernkoko-l3[a-d]-own$/);for(const prompt of exercise.prompts)assert.match(words.normalizeLoose(prompt.placeholder),prompt.pattern,where+' '+prompt.placeholder);}
  for(const question of step.test??[]){assert.ok(question[1].includes(question[2]),where+' '+question[0]);assert.equal(question[1][0],question[2],where+': the first option is right');}
  for(const row of step.speak??[])if(row.own)assert.match(words.normalizeLoose(row.answer),row.own.pattern,where+' '+row.answer);
 }
 for(const part of ['a','b','c','d'])assert.ok(course.orteScored[part].every(item=>item.total>0),part);
});

test('only the right answer is read after an answer: never a Turkish text, never the question',()=>{
 for(const part of course.ortePartList)for(const step of part.steps){
  for(const question of step.test??[])assert.ok(!course.isOrteTurkish(question[3]),part.id+':'+step.id+' '+question[3]);
  if(step.exercise?.type==='quiz')for(const item of step.exercise.items)assert.ok(!course.isOrteTurkish(item.say??item.options[0]),part.id+':'+step.id);
  for(const block of step.blocks??[])if(block.t==='checks')for(const item of block.items)assert.ok(item.say===''||!course.isOrteTurkish(item.say),part.id+':'+step.id+' '+item.q);
 }
 const voices=course.orteSpeechTexts();assert.ok(voices.length>400,voices.length);
 assert.ok(voices.every(text=>!course.isOrteTurkish(text)),'only German is spoken');
 assert.match(read('scripts/voices/list-texts.cjs'),/load\('orte-course'\)\.orteSpeechTexts\(\)/,'the site voices are made for Lektion 3');
});

test('every Turkish text of Lektion 3 is in the English, Arabic, Ukrainian and German packs (CLAUDE.md: five languages)',()=>{
 const texts=new Set(course.orteTurkishTexts());
 for(const file of ['app/orte-steps.tsx','app/orte-study.tsx']){
  const source=read(file);
  for(const m of source.matchAll(/\but\((['"])((?:\\.|(?!\1).)*)\1/g))texts.add(m[2]);
  for(const m of source.matchAll(/<Tx(?: key="[^"]*")? text="([^"]*)"/g))texts.add(m[1]);
 }
 assert.ok(texts.size>500,texts.size);
 for(const id of languages)for(const text of texts)assert.ok(typeof packs[id][text]==='string'&&packs[id][text].trim(),id+': '+text);
 const marks=text=>[...text.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort().join(' ');
 const german=text=>[...text.replace(/\*\*[^*]+\*\*/g,'').matchAll(/\*(?!\*)[^*\s][^*]*\*(?!\*)|~[^~]+~|\[(?:der|die|das)\]/g)].map(m=>m[0]).sort().join(' | ');
 for(const id of languages)for(const text of texts){assert.equal(marks(packs[id][text]),marks(text),id+' {marks}: '+text);assert.equal(german(packs[id][text]),german(text),id+' German parts: '+text);}
 // A word shown as a question must not give its German answer away in the German help (Kelime kontrolü, the test).
 for(const text of ['masa','çanta','anahtar','makas','elbise','buzdolabı'])assert.ok(!/Tisch|Tasche|Schlüssel|Schere|Kleid|Kühlschrank/.test(packs.de[text]),text);
});

test('our own names and texts: the site\'s people, no names of the book',()=>{
 const source=['a','b','c','d'].map(id=>read(`lib/orte-${id}.ts`)).join('\n');
 for(const name of ['Lin','Angela','Adam','Karim','Todor','Yangmei','Martina','Saman','Oumar','Keiko','Meier','Bauer','Sevinc','Münster','Friedensstraße','Stuttgart'])assert.ok(!new RegExp('\\b'+name+'\\b').test(source),name);
 const cast=new Set(course.ortePartList.flatMap(part=>part.steps.flatMap(step=>[...(step.cover?.cast??[]),...(step.blocks??[]).flatMap(block=>block.t==='talk'?block.lines.map(line=>line.who):[]),...(step.speak??[]).map(row=>row.who)])));
 for(const who of cast)assert.ok(fs.existsSync(`public/toon/lektion1/${who}.webp`),who+' has a portrait and a voice');
});

test('pictures: the learner\'s 3D pictures (6 November 2026) and the Kelime Kasası ones exist; every card and quiz item has one',()=>{
 const pictures=load('orte-pictures');
 const size=file=>{const b=fs.readFileSync(file);assert.equal(b.toString('ascii',0,4),'RIFF',file);assert.equal(b.toString('ascii',12,16),'VP8 ',file);return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];};
 for(const src of Object.values(pictures.objectPic)){assert.ok(fs.existsSync('public'+src),src);if(src.startsWith('/toon/lektion3/'))assert.deepEqual(size('public'+src),[640,480],src);}
 for(const part of course.ortePartList){assert.match(part.cover.src,/^\/toon\/lektion3\/kapak-[a-d]\.webp$/);assert.deepEqual(size('public'+part.cover.src),[960,540],part.cover.src);}
 assert.ok(!fs.readdirSync('public/toon/lektion3').some(file=>file.startsWith('gecici')),'the temporary covers are gone');
 for(const part of course.ortePartList)for(const step of part.steps){
  for(const block of step.blocks??[])if(block.t==='cards')for(const word of block.words)assert.ok(word.pic,part.id+': '+word.de);
  if(step.exercise?.type==='quiz')for(const item of step.exercise.items)assert.ok(item.pic||item.listen||!item.emoji,part.id+':'+step.id);
  if(step.exercise?.type==='write')for(const row of step.exercise.rows)assert.ok(row.pic||!row.emoji,part.id+':'+step.id+' '+row.given);
 }
});

test('progress: kept in the browser, travels with the account as lesson l3; the own sentences stay on the device',()=>{
 assert.ok(sync.SYNC_LESSONS.includes('l3'));
 for(const key of [progress.l3PartKeys.a.scores,progress.l3PartKeys.d.step,progress.L3_PART_KEY,'lernkoko-l3b-run'])assert.equal(sync.syncLessonOf(key),'l3',key);
 for(const key of ['lernkoko-l3a-own','lernkoko-l3d-own'])assert.equal(sync.syncLessonOf(key),null,key);
 assert.equal(sync.syncLessonOf('lernkoko-l2a-scores'),'l2','Lektion 2 stays l2');
 const empty=progress.lessonThreeProgress({});assert.equal(empty.percent,0);assert.ok(empty.total>100);
 assert.equal(place.placePath('orte'),'/a1-1/orte-und-dinge');assert.equal(place.placeUnit.orte,'book-03');
 assert.equal(place.lessonStepHref('orte','b','test'),'/a1-1/orte-und-dinge?teil=b&adim=test');
});

test('the unit card on Üniteler opens Lektion 3 and shows its progress; the page exists',()=>{
 const catalogue=read('app/category-study.tsx');
 assert.ok(catalogue.includes("unit.id==='book-03'?'/a1-1/orte-und-dinge'")&&catalogue.includes("unit.id==='book-03'?orte:")&&catalogue.includes("import('@/lib/orte-progress')"));
 assert.ok(read('app/a1-1/orte-und-dinge/page.tsx').includes('<OrteStudy guest={!(await getChatGPTUser())}/>'));
 assert.ok(read('app/layout.tsx').includes('import "./orte.css";'));
 assert.ok(read('lib/visits.ts').includes("'/a1-1/orte-und-dinge': 'Lektion 3 · Orte und Dinge'"));
});
