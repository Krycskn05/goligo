const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {execFileSync}=require('node:child_process');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const housing=load('housing-course'),traps=load('housing-traps'),course=load('course'),study=load('study'),puzzle=load('letter-puzzle'),copy=load('housing-copy'),{translate}=load('study-languages');
const languages=['tr','de','en','ar','uk','fr'];
const trapQuestions=housing.housingQuestions.filter(q=>q.trap);

test('every section gets a solid set of trick questions with an explanation in each language',()=>{
 for(const section of ['a','b','c','d']){
  const own=trapQuestions.filter(q=>q.section===section);
  assert(own.filter(q=>q.options).length>=15,section+' choice');assert(own.filter(q=>q.kind==='write').length>=12,section+' write');
 }
 const used=new Set(traps.housingTraps.map(t=>t.why));
 for(const [key,text] of Object.entries(traps.trapReasons)){
  assert(used.has(key),'unused reason '+key);
  for(const language of languages)assert(translate(text,language)?.trim(),key+' '+language);
 }
 for(const passage of Object.values(traps.trapPassages)){assert(passage.de.length>100);for(const language of languages.filter(l=>l!=='de'))assert(translate(passage.meaning,language).trim());}
 for(const language of languages)assert(copy.housingText(language,'trapWhy').trim(),'trapWhy '+language);
});

test('existing exercise IDs stay untouched and the new ones only add to the catalogue',()=>{
 const old=housing.housingQuestions.filter(q=>!q.trap);
 assert.equal(old.length,233,'the earlier 233 housing exercises keep their IDs');
 for(const id of ['housing-11-a-possessive-unsere','housing-11-b-cook','housing-11-a-toilet','housing-11-c-notice-bike-test','housing-11-d-card-finden'])assert(housing.housingQuestionMap.has(id),id);
 assert(trapQuestions.every(q=>/^housing-11-[a-d]-trap-[a-z0-9-]+$/.test(q.id)));
 assert.equal(new Set(course.questions.map(q=>q.id)).size,course.questions.length);
 assert.equal(housing.housingTrapIds.size,trapQuestions.length);
});

test('choice traps: four distinct options, one right answer, distractors that look plausible',()=>{
 for(const q of trapQuestions.filter(q=>q.options)){
  assert.equal(q.options.length,4,q.id);assert.equal(new Set(q.options).size,4,q.id);assert.equal(q.options[0],q.answer,q.id);
  assert(course.gradeAnswer(q,q.answer),q.id);
  for(const wrong of q.options.slice(1)){
   assert(!course.gradeAnswer(q,wrong),q.id+' '+wrong);
   const source=traps.housingTraps.find(t=>q.id.endsWith('-trap-'+t.id+'-test'));assert(source,q.id);
   // Case-only distractors are only fair when the trap is about capital letters.
   if(wrong.toLocaleLowerCase('de')===q.answer.toLocaleLowerCase('de'))assert(['formal','capitalNouns','letterComma','questionCapital'].includes(source.why),q.id+' '+wrong);
  }
  assert(!q.resultDe.includes('___')&&!/\)$/.test(q.resultDe),q.id);
  for(const language of languages)assert(housing.housingMeaning(q,language).trim(),q.id+' '+language);
 }
});

test('writing traps can be solved with the letter puzzle and respect capital letters where it matters',()=>{
 for(const q of trapQuestions.filter(q=>q.kind==='write')){
  assert(!q.options,q.id);assert(course.gradeAnswer(q,q.answer),q.id);assert(!course.gradeAnswer(q,'xyz'),q.id);
  for(const variant of q.accepted??[])assert(course.gradeAnswer(q,variant),q.id+' '+variant);
  const model=puzzle.makeLetterPuzzle(q.answer,q.id);const letters=Object.fromEntries(model.parts.filter(p=>p.editable).map(p=>[p.index,p.character]));
  assert(course.gradeAnswer(q,puzzle.completeLetterPuzzle(model,letters).answer),q.id);
  if(q.strictCase&&q.answer!==q.answer.toLocaleLowerCase('de'))assert(!course.gradeAnswer(q,q.answer.toLocaleLowerCase('de')),q.id+' must reject lower case');
  if(!q.gap){assert(q.wordBank?.length>2,q.id);assert.deepEqual([...q.wordBank].map(w=>w.toLocaleLowerCase('de')).sort(),q.answer.replace(/[.!?]/g,'').split(' ').map(w=>w.toLocaleLowerCase('de')).sort(),q.id);}
 }
 const formal=housing.housingQuestionMap.get('housing-11-a-trap-formal-ihr');assert(course.gradeAnswer(formal,'Ihr'));assert(!course.gradeAnswer(formal,'ihr'));
 const letter=housing.housingQuestionMap.get('housing-11-b-trap-letter-comma');assert(course.gradeAnswer(letter,'Liebe Mila, wir haben eine Wohnung gefunden'));assert(!course.gradeAnswer(letter,'Liebe Mila, Wir haben eine Wohnung gefunden.'));
 assert(letter.wordBank.every(word=>word===word.toLocaleLowerCase('de')),'the learner restores the capitals');
});

test('trick questions are mixed into the normal test and writing rounds, not a separate set',()=>{
 for(const section of housing.housingSections){
  const ids=[...housing.housingTrapIds].filter(id=>id.startsWith('housing-11-'+section.id+'-'));
  for(const mode of ['test','write']){
   const picked=study.selectQuestions(mode,section.topic,2000,[],ids);assert(picked.length>0);assert(picked.every(q=>housing.housingTrapIds.has(q.id)),section.id+' '+mode);
   const round=housing.pickHousingQuestions(section.id,mode,10,[]);assert.equal(round.length,10);
   const traps=round.filter(q=>q.trap).length;assert(traps>=2&&traps<=8,section.id+' '+mode+' mixes '+traps+' trick questions into a fresh round');
  }
 }
 const page=fs.readFileSync('app/housing-study.tsx','utf8');
 assert(page.includes("h('trapWhy')")&&page.includes('trapReasons[q.trap]'));
 assert(!page.includes('questionSet')&&!page.includes('housing-set'),'no separate trick-question category');
});

test('new answers are queued for the natural site voices and lesson notes show the new pitfalls',()=>{
 const texts=new Set(JSON.parse(execFileSync(process.execPath,['scripts/voices/list-texts.cjs'],{encoding:'utf8',env:{...process.env,STUDY_CHECK_DIR:compiled}})));
 for(const answer of ['Gestern haben wir die Küche geputzt.','Können Sie bitte mein Paket annehmen?','abgegeben','seine Kollegin'])assert(texts.has(answer),answer);
 assert(texts.has(traps.trapPassages.deniz.de)&&texts.has(traps.trapPassages.notice.de));
 const lessons=load('housing-lessons').housingLessons;
 assert(lessons.a.mistakes.some(m=>m.correct==='Die Schlafzimmerlampe ist neu.'));assert(lessons.d.mistakes.some(m=>m.wrong.includes('getelefoniert')));
 for(const section of Object.values(lessons))for(const item of section.mistakes)for(const language of languages)assert(translate(item.meaning,language).trim());
});
