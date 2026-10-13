const {test}=require('node:test');const assert=require('node:assert/strict'),path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;assert(compiled,'Set STUDY_CHECK_DIR to the compiled libraries.');
const course=require(path.join(compiled,'course.js')),puzzle=require(path.join(compiled,'letter-puzzle.js')),objects=require(path.join(compiled,'object-practice.js')),vocabulary=require(path.join(compiled,'object-course.js')),articles=require(path.join(compiled,'article-challenges.js')),english=require(path.join(compiled,'english-objects.js'));
test('letter banks contain exactly the required copies, stable token IDs and complete German articles',()=>{
 for(const [lang,pool]of [['de',objects.objectWritingPool().filter(q=>!q.gap)],['en',english.englishObjectWritingPool()]])for(const q of pool){
  const model=puzzle.makeLetterPuzzle(q.answer,q.id,lang),bank=puzzle.makeLetterBank(model,q.id,lang);
  assert.deepEqual(bank,puzzle.makeLetterBank(model,q.id,lang));assert.equal(new Set(bank.map(tile=>tile.id)).size,bank.length);assert.equal(bank.length,model.editable.length,q.id);
  assert.deepEqual(bank.map(tile=>tile.letter).sort(),model.editable.map(index=>model.parts[index].character).sort(),q.id);
  for(const [index,slot]of model.editable.entries())assert.equal(bank.find(tile=>tile.id==='tile-'+index).letter,model.parts[slot].character,'required token identity stays stable: '+q.id);
  const used=new Set(),placements={};for(const index of model.editable){const token=bank.find(tile=>tile.letter===model.parts[index].character&&!used.has(tile.id));assert(token,q.id);used.add(token.id);placements[index]=token.id;}
  const completed=puzzle.completeLetterPuzzle(model,puzzle.placedLetters(placements,bank));assert(completed.complete);assert(course.gradeAnswer(q,completed.answer),q.id);
  assert.equal(puzzle.remainingLetterChoices(bank,placements).length,0);
  const article=q.answer.match(/^(der|die|das)\s/);if(lang==='de'&&article)assert(model.parts.slice(0,article[1].length).every(part=>!part.editable),q.id);
  if(lang==='en')assert(!bank.filter(tile=>!used.has(tile.id)).some(tile=>/[äöüß]/.test(tile.letter)),q.id);
 }
});
test('repeated letters use one remaining choice and removing a placed token restores its count',()=>{
 const model=puzzle.makeLetterPuzzle('Entschuldigung, wo ist die Toilette?','compact-sentence');
 const bank=puzzle.makeLetterBank(model,'compact-sentence'),initial=puzzle.remainingLetterChoices(bank,{});
 assert.equal(new Set(initial.map(choice=>choice.letter)).size,initial.length);
 assert.equal(initial.reduce((count,choice)=>count+choice.count,0),model.editable.length);
 const repeated=initial.find(choice=>choice.count>1);assert(repeated);
 const slot=model.editable.find(index=>model.parts[index].character===repeated.letter);
 const placed={[slot]:repeated.id};const next=puzzle.remainingLetterChoices(bank,placed);
 assert.equal(next.find(choice=>choice.letter===repeated.letter)?.count??0,repeated.count-1);
 assert(next.every(choice=>choice.id!==repeated.id));assert.equal(next.reduce((count,choice)=>count+choice.count,0),model.editable.length-1);
 delete placed[slot];assert.deepEqual(puzzle.remainingLetterChoices(bank,placed),initial);
});
test('the screenshot answer has letters out of order while the correctly spelled Toilette is accepted',()=>{
 const {housingQuestionMap}=require(path.join(compiled,'housing-course.js'));
 const question=housingQuestionMap.get('housing-11-a-toilet');assert(question);
 assert(course.gradeAnswer(question,'Entschuldigung, wo ist die Toilette?'));
 assert(!course.gradeAnswer(question,'Entschuldigung, wo ist die Toileett?'));
});
test('whole-article, plural and compound challenges use correct complete answers and mix with spelling',()=>{
 const plural=objects.objectWritingPool().filter(q=>q.articlePuzzle);assert(plural.length>=20);
 for(const q of plural){assert.equal(q.answer,'die');assert.equal(articles.articleFullAnswer(q),'die '+articles.pluralNouns[q.objectId]);assert(articles.isArticleChallenge(q));assert.equal(articles.articleChallengeKind(q),'plural');assert(!q.options);assert(course.gradeAnswer(q,'die'));assert(!course.gradeAnswer(q,'der'));}
 for(const [id,head]of Object.entries(articles.compoundHeads)){const word=vocabulary.objectWordMap.get(id);if(word){assert.equal(word.de.split(' ')[0],head.split(' ')[0],id);const q=course.questionMap.get('obj-gap-'+id);assert.equal(articles.articleChallengeKind(q),'compound');}}
 for(const group of ['all',...vocabulary.objectGroups.map(group=>group.id)]){const pool=objects.objectWritingPool(group),round=objects.pickObjectWritingQuiz(group,5,[]);assert.equal(round.length,5);assert.equal(new Set(round.map(q=>q.id)).size,5);assert(round.some(q=>!q.gap));assert(round.some(q=>q.gap&&!q.articlePuzzle));if(pool.some(q=>q.articlePuzzle))assert(round.some(q=>q.articlePuzzle),group);}
});
test('letter-bank and article instructions are available in every helper language',()=>{
 const {vaultLanguages,vaultText}=require(path.join(compiled,'object-vault-copy.js'));for(const lang of vaultLanguages)for(const key of ['letterBank','letterBankHint','removeLetter','extraLetters','articleBank','articleTrap','pluralTrap','compoundTrap','articleTask','pluralTask','questionImage'])assert(vaultText(lang.id,key,{head:'der Boden',noun:'der Dachboden'}).trim(),lang.id+' '+key);
});
