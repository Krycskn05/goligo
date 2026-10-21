const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const logic=require(path.join(compiled,'article-logic.js'));const objects=require(path.join(compiled,'object-course.js'));const articles=require(path.join(compiled,'article-challenges.js'));
const languages=require(path.join(compiled,'site-languages.js')).siteLanguages.map(item=>item.id);

test('every vault noun gets an honest article rule in every language',()=>{
 const packs=['bg','zh','ti'].map(id=>JSON.parse(fs.readFileSync('lib/language-packs/'+id+'.json','utf8')));
 for(const key of ['neuterEnding','gePrefix','masculineEnding','verbNoun','derEnding','derEndingException','oneSyllable','oneSyllableGroup','group'])for(const pack of packs)assert.ok(pack[logic.puzzleCopy[key][2]],key+' in the language packs');
 for(const word of objects.objectVocabulary){
  const rule=logic.articleRule(word.id,word.de);
  if(rule.key==='compound'){const head=rule.x.split(' → ')[0];assert.equal(head.split(' ')[0],word.de.split(' ')[0],word.id+' head has the same article');}
  if(rule.key==='ending')assert.ok(word.de.startsWith('die ')&&word.de.endsWith('e'),word.id);
  for(const language of languages){const text=logic.articleRuleText(language,rule);assert.ok(text.includes(word.de)&&!/\{[a-z]+\}/.test(text),word.id+' '+language);}
 }
 // Real rules instead of "no rule, learn it with the picture" (the learner asked for more sensible rules).
 const keys=objects.objectVocabulary.map(word=>logic.articleRule(word.id,word.de).key);
 assert.equal(keys.filter(key=>key==='memorize').length,0,'every noun gets a rule or a group to learn with');
 const rule=(id)=>{const word=objects.objectVocabulary.find(item=>item.id===id);return logic.articleRule(id,word.de);};
 assert.deepEqual(rule('keller'),{key:'derEnding',x:'der Keller',e:'er'});
 assert.deepEqual(rule('fenster'),{key:'derEndingException',x:'das Fenster',e:'er',a:'das'});
 assert.deepEqual(rule('kissen'),{key:'derEndingException',x:'das Kissen',e:'en',a:'das'});
 assert.equal(rule('sessel').key,'derEnding');assert.equal(rule('schaufel').key,'derEndingException');
 for(const id of ['bett','brett','aquarium','stethoskop'])assert.equal(rule(id).key,'neuterEnding',id);
 assert.equal(rule('geruest').key,'gePrefix');
 for(const id of ['teppich','kaktus'])assert.equal(rule(id).key,'masculineEnding',id);
 assert.deepEqual(rule('verband'),{key:'verbNoun',x:'der Verband',v:'verbinden'});
 for(const id of ['tisch','stuhl','kopf','schlauch','zeh'])assert.equal(rule(id).key,'oneSyllable',id);
 const hand=rule('hand');assert.equal(hand.key,'oneSyllableGroup');assert.equal(hand.list,'die Brust · die Nase · die Schulter');
 assert.equal(rule('knie').key,'oneSyllableGroup','Knie is one syllable, not an -e noun');
 assert.equal(rule('sofa').key,'group');assert.ok(rule('sofa').list.split(' · ').every(item=>item.startsWith('das ')));
 assert.equal(logic.syllables('Schlauch'),1);assert.equal(logic.syllables('Haar'),1);assert.equal(logic.syllables('Kamin'),2);
 // A rule never contradicts the article: der-rules only for der nouns, das-rules only for das nouns.
 for(const word of objects.objectVocabulary){const r=logic.articleRule(word.id,word.de);const article=word.de.split(' ')[0];
  if(['derEnding','masculineEnding','verbNoun','oneSyllable'].includes(r.key))assert.equal(article,'der',word.id);
  if(['neuterEnding','gePrefix'].includes(r.key))assert.equal(article,'das',word.id);
  if(r.list)assert.ok(r.list.split(' · ').every(item=>item.split(' ')[0]===article&&item!==word.de),word.id);}
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
