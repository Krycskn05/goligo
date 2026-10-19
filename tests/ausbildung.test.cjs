// Lektion 12 „Ausbildung": content, answer keys, listening page and page wiring.
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {execFileSync}=require('node:child_process');
const compiled=process.env.STUDY_CHECK_DIR||path.join(__dirname,'..','.check','lib');
const load=name=>require(path.join(compiled,name+'.js'));

test('Lektion 12 has every part in book order with consistent exercises',()=>{
 const course=load('ausbildung-course');
 assert.deepEqual(course.lessonParts.map(part=>part.id),['a','b','c','d','schreiben','test','pruefung','magazin']);
 const ids=new Set();
 for(const {exercise} of course.lessonExercises){
  assert(!ids.has(exercise.id),exercise.id);ids.add(exercise.id);assert(exercise.items.length,exercise.id);
  for(const item of exercise.items){
   if(item.k==='gap'){assert.equal(course.gapCount(item.text),item.answers.length,exercise.id+' '+item.text);assert(item.answers.every(list=>list.length&&list.every(answer=>answer.trim())),exercise.id);}
   if(item.k==='choice')assert(Number.isInteger(item.answer)&&item.answer>=0&&item.answer<item.options.length,exercise.id+' '+item.text);
   if(item.k==='pick')assert(item.accept.length>=item.need&&item.accept.every(word=>item.options.includes(word)),exercise.id);
   if(item.k==='sentence')assert(item.answers.length,exercise.id);
  }
 }
 // The „Alles klar?" test is worth 25 points, as in the book.
 assert.equal(course.lessonPartMap.get('test').exercises.reduce((sum,exercise)=>sum+exercise.points,0),25);
 for(const part of course.lessonParts.slice(0,4))assert(part.sections.some(section=>section.blocks.some(block=>block.t==='vocab')),part.id+' has words');
});

test('answer keys follow the class notes',()=>{
 const course=load('ausbildung-course');const exercise=id=>course.lessonExercises.find(entry=>entry.exercise.id===id).exercise;
 assert.deepEqual(exercise('b3').items[0].answers.map(list=>list[0]),['gegangen','gearbeitet','gezogen','gemacht','gekommen','geblieben','gefahren']);
 assert.deepEqual(exercise('c1').items.map(item=>item.answers[0][0]),['In','Seit','Vor','seit','In','Vor']);
 assert.deepEqual(exercise('c2').items.map(item=>item.answers[0][0]),['einer','einem','einem','einer','einer','einem']);
 assert.deepEqual(exercise('c6').items.map(item=>item.options[item.answer]),['geehrte','gern','seit','Vor','hat']);
 assert.deepEqual(exercise('d3').items[0].answers.map(list=>list[0]),['bin','habe','habe','bin','habe','hat','bin','habe']);
 assert.equal(exercise('s2').items[0].answers.map(list=>list[0]).join(''),'FVfvfVvFvffFffFF');
 assert.deepEqual(exercise('t2').items[0].answers.map(list=>list[0]),['vor','seit','In','vor','Seit']);
 assert.deepEqual(exercise('a4').items.map(item=>item.answers[0][0]),['will','Willst','will','wollen','wollt','wollen','will']);
 // Checking ignores case, spacing and end punctuation; a wrong verb stays wrong.
 const gap={k:'gap',text:'Ich ___ gut.',answers:[['kann']]};
 assert.deepEqual(course.gradeItem(gap,[' Kann ']),{right:1,total:1});
 assert.deepEqual(course.gradeItem(gap,['will']),{right:0,total:1});
 assert.equal(course.matchesAnswer('leyla kann gut taschen nähen',['Leyla kann gut Taschen nähen.']),true);
 assert.equal(course.gradeExercise(exercise('t5'),{0:['kann','kann'],1:['Willst'],2:['wollen'],3:['will'],4:['Könnt']}).points,5);
 assert.deepEqual(course.gradeItem({k:'pick',prompt:'Autos',options:['reparieren','prüfen','machen'],accept:['reparieren','prüfen'],need:2},['prüfen','reparieren']),{right:1,total:1});
});

test('the listening page has 14 sections with valid answers and every text is read by the site voices',()=>{
 const hoeren=load('ausbildung-hoeren');const course=load('ausbildung-course');
 assert.deepEqual(hoeren.hoerenTasks.map(task=>task.number),[1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
 for(const task of hoeren.hoerenTasks){
  assert(task.questions.length,task.id);
  for(const q of task.questions){
   if(q.type==='mc')assert(q.answer>=0&&q.answer<q.options.length,task.id+' '+q.text);
   if(q.type==='select')assert(q.options.includes(q.answer),task.id+' '+q.text);
   if(q.type==='dict'||q.type==='mc'&&task.dictation)assert(hoeren.questionSpeech(q),task.id);
  }
  for(const line of task.lines??[])assert.notEqual(hoeren.speakerVoice(line.who),'n',line.who);
 }
 for(const part of course.lessonParts)for(const number of part.listen??[])assert(hoeren.hoerenTasks.some(task=>task.number===number),part.id+' '+number);
 const texts=hoeren.ausbildungSpeechTexts();assert(texts.length>150);
 const listed=JSON.parse(execFileSync(process.execPath,[path.join(__dirname,'..','scripts','voices','list-texts.cjs')],{env:{...process.env,STUDY_CHECK_DIR:compiled},maxBuffer:64*1024*1024}).toString());
 for(const text of ['die Ausbildung','Ich kann gut schwimmen.','neunzehnhunderteinundneunzig',hoeren.hoerenTasks[0].lines[0].text])assert(listed.includes(text),text);
});

test('the chapter page, the listening page and the catalogue link are wired up',()=>{
 for(const file of ['app/a1-2/ausbildung/page.tsx','app/a1-2/ausbildung/hoeren/page.tsx','app/ausbildung-study.tsx','app/ausbildung-hoeren.tsx','app/ausbildung.css'])assert(fs.existsSync(file),file);
 assert(fs.readFileSync('app/layout.tsx','utf8').includes('import "./ausbildung.css";'));
 const home=fs.readFileSync('app/category-study.tsx','utf8');assert(home.includes("unit.id==='book-12'")&&home.includes('href="/a1-2/ausbildung"'));
 const {siteLanguages}=load('site-languages');const {turkishNote}=load('ausbildung-course');
 for(const language of siteLanguages)if(language.id!=='tr')assert(turkishNote[language.id],language.id);
});
