const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const logic=require(path.join(compiled,'article-logic.js'));const objects=require(path.join(compiled,'object-course.js'));const articles=require(path.join(compiled,'article-challenges.js'));
const languages=['tr','de','en','ar','uk','fr','es','ru','fa','pl','it','pt'];

test('every vault noun gets an honest article rule in every language',()=>{
 for(const word of objects.objectVocabulary){
  const rule=logic.articleRule(word.id,word.de);
  if(rule.key==='compound'){const head=rule.x.split(' → ')[0];assert.equal(head.split(' ')[0],word.de.split(' ')[0],word.id+' head has the same article');}
  if(rule.key==='ending')assert.ok(word.de.startsWith('die ')&&word.de.endsWith('e'),word.id);
  for(const language of languages){const text=logic.articleRuleText(language,rule);assert.ok(text.includes(word.de)&&!/\{[a-z]+\}/.test(text),word.id+' '+language);}
 }
 assert.equal(logic.articleRule('bohrmaschine','die Bohrmaschine').key,'compound');
 assert.equal(logic.articleRule('lampe','die Lampe').key,'ending');
 assert.equal(logic.articleRule('heizung','die Heizung').key,'suffix');
 assert.equal(logic.articleRule('brett','das Brett',true).key,'plural');
 assert.equal(logic.articleRule('brett','das Brett',true).x,'die '+articles.pluralNouns.brett);
 for(const key of Object.keys(logic.puzzleCopy))for(const language of languages)assert.ok(logic.puzzleText(language,key,{x:'x',a:'der'}).trim(),key+language);
});

test('word puzzles ask for the article and letter puzzles accept the keyboard',()=>{
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 assert.ok(page.includes("/^(der|die|das) (.+)$/.exec(q.answer)"),'the article is chosen, not given');
 assert.ok(page.includes("void submit(nounArticle+' '+answer)"));
 assert.ok(page.includes("puzzleText(language,showHint?'hideHint':'showHint')"));
 const puzzle=fs.readFileSync('app/letter-puzzle.tsx','utf8');
 assert.ok(puzzle.includes("window.addEventListener('keydown',listener)")&&puzzle.includes('typeLetter(event.key)'));
});
