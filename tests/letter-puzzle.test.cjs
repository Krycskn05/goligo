const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to the compiled lib directory.');
const puzzle=require(path.join(compiled,'letter-puzzle.js')),course=require(path.join(compiled,'course.js')),objects=require(path.join(compiled,'object-practice.js'));
test('every object writing question has stable letter clues and at least one editable gap',()=>{
 for(const q of objects.objectWritingPool()){
  const seed='saved-session:'+q.id;const model=puzzle.makeLetterPuzzle(q.answer,seed);assert.deepEqual(model,puzzle.makeLetterPuzzle(q.answer,seed));assert(model.editable.length>0,q.id);
  assert(model.parts.some(p=>!p.editable&&/[\p{L}\p{N}]/u.test(p.character)),q.id);
  for(const part of model.parts)if(!/[\p{L}\p{N}]/u.test(part.character))assert(!part.editable,q.id);
  assert(!puzzle.completeLetterPuzzle(model,{}).complete,q.id);
 }
});
test('completed letters reconstruct the full scored answer; incomplete or incorrect letters do not pass',()=>{
 for(const q of objects.objectWritingPool()){
  const model=puzzle.makeLetterPuzzle(q.answer,q.id);const letters=Object.fromEntries(model.editable.map(i=>[i,model.parts[i].character]));
  const full=puzzle.completeLetterPuzzle(model,letters);assert(full.complete);assert.equal(full.answer,q.answer.normalize('NFC'));assert(course.gradeAnswer(q,full.answer));
  const bad={...letters,[model.editable[0]]:letters[model.editable[0]]==='x'?'z':'x'};assert(!course.gradeAnswer(q,puzzle.completeLetterPuzzle(model,bad).answer));
  delete letters[model.editable[0]];assert(!puzzle.completeLetterPuzzle(model,letters).complete);
 }
 assert.deepEqual(puzzle.puzzleCharacter('a\u0308 ö ß!'),['ä','ö','ß']);
});
test('puzzle counts and accessible letter instructions are translated in every vault language',()=>{
 const {vaultLanguages,vaultText}=require(path.join(compiled,'object-vault-copy.js'));
 for(const language of vaultLanguages)for(const key of ['puzzlePrompt','puzzleArticlePrompt','puzzleHint','puzzleLetter','puzzleGiven','puzzleFilled','puzzleLength','fivePuzzles','tenPuzzles','twentyPuzzles','allPuzzles','puzzleCount','startPuzzles','puzzleRoundProgress','nextPuzzle','puzzlesDone','reviewPuzzleMistakes'])assert(vaultText(language.id,key,{n:5,total:10,letter:'ä'}).trim(),language.id+' '+key);
 assert.equal(vaultText('tr','fivePuzzles'),'5 bulmaca');assert.equal(vaultText('tr','tenPuzzles'),'10 bulmaca');assert.equal(vaultText('tr','twentyPuzzles'),'20 bulmaca');assert.equal(vaultText('tr','allPuzzles',{n:40}),'Tüm bulmacalar (40)');
});
