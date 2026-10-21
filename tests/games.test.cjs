// The new games (the learner asked, October 2026): Artikel yağmuru, Duy ve yakala, 30 saniye: doğru mu?, Kelime avı,
// Koko'yu kurtar and Çoğul eşleştirme, next to the matching cards.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const g=load('object-games'),verbGames=load('verb-games'),copy=load('game-copy'),site=load('site-languages'),art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const read=file=>fs.readFileSync(file,'utf8');
const seeded=seed=>{let state=seed>>>0;return()=>(state=(Math.imul(state,1103515245)+12345)>>>0)/4294967296;};

test('every game word has a picture and "article + noun"',()=>{
 assert.ok(g.gameObjects.length>=100);
 for(const word of g.gameObjects){assert.ok(art[word.id],word.id);assert.ok(g.splitNoun(word.de),word.de);}
 assert.deepEqual(g.splitNoun('der Tisch'),{article:'der',noun:'Tisch'});assert.equal(g.splitNoun('Tisch'),null);
});

test('Artikel yağmuru: each picture once, faster with every right answer',()=>{
 const round=g.rainRound(20,seeded(1));assert.equal(round.length,20);assert.equal(new Set(round.map(item=>item.id)).size,20);
 for(const item of round){assert.ok(g.ARTICLES.includes(item.article));assert.equal(item.de,item.article+' '+item.noun);}
 assert.equal(g.rainSeconds(0),6);assert.ok(g.rainSeconds(5)<g.rainSeconds(0));assert.equal(g.rainSeconds(100),2.8);
 assert.notDeepEqual(round.map(item=>item.id),g.rainRound(20,seeded(2)).map(item=>item.id),'a new order every time');
});

test('Duy ve yakala: four different pictures, one of them right; streaks multiply the points',()=>{
 for(const item of g.catchRound(10,seeded(3))){assert.equal(item.options.length,4);assert.equal(new Set(item.options).size,4);assert.ok(item.options.includes(item.id));assert.equal(item.de,g.gameObject(item.id).de);}
 assert.deepEqual([0,1,2,3,5,6,9].map(g.catchPoints),[10,10,10,20,20,30,30]);
 assert.equal(g.catchMultiplier(0),1);assert.equal(g.catchMultiplier(3),2);assert.equal(g.catchMultiplier(12),3);
});

test('30 saniye: about half the cards are right, the wrong ones are near misses with the right form kept',()=>{
 const deck=g.quickDeck(80,seeded(4));assert.ok(deck.length>=60);
 const right=deck.filter(card=>card.right).length;assert.ok(right>deck.length*0.3&&right<deck.length*0.7,String(right));
 for(const card of deck){if(card.right)assert.equal(card.shown,card.correct,card.key);else assert.notEqual(card.shown,card.correct,card.key);}
 const object=deck.find(card=>card.kind==='object'&&!card.right);assert.equal(object.shown.split(' ')[1],object.correct.split(' ')[1],'the same noun with another article');
 assert.ok(deck.some(card=>card.kind==='verb'),'verbs with their pictures too');
});

test('Kelime avı: the hidden words are really in the grid, found from either end',()=>{
 for(let seed=1;seed<=20;seed++){
  const grid=g.searchGrid(8,6,seeded(seed));assert.equal(grid.cells.length,64);assert.equal(grid.words.length,6,'seed '+seed);
  for(const word of grid.words){
   const cells=g.searchCells(grid,word);assert.equal(cells.map(cell=>grid.cells[cell]).join(''),word.letters,word.de);
   assert.equal(g.searchFind(grid,cells[0],cells[cells.length-1]),word);assert.equal(g.searchFind(grid,cells[cells.length-1],cells[0]),word);
   assert.equal(word.letters,g.splitNoun(word.de).noun.toUpperCase());
  }
  assert.ok(grid.cells.every(letter=>/^[A-ZÄÖÜ]$/.test(letter)));
  assert.equal(g.searchFind(grid,0,9),null,'a diagonal is not a word');
 }
});

test('Koko\'yu kurtar: letters, blanks and balloons',()=>{
 const round=g.rescueRound(5,seeded(5));assert.equal(round.length,5);
 for(const item of round)for(const letter of item.noun.toUpperCase())assert.ok(g.RESCUE_KEYS.includes(letter),item.noun);
 const guessed=new Set(['T','I','X']);assert.deepEqual(g.rescueMask('Tisch',guessed),['T','i','_','_','_']);
 assert.equal(g.rescueMisses('Tisch',guessed),1);assert.equal(g.rescueSolved('Tisch',new Set(['T','I','S','C','H'])),true);
 assert.equal(g.RESCUE_BALLOONS,6);
});

test('Çoğul eşleştirme: six pairs, the word and its plural with die',()=>{
 const cards=g.pluralRound(6,seeded(6));assert.equal(cards.length,12);
 for(const pair of new Set(cards.map(card=>card.pair))){const two=cards.filter(card=>card.pair===pair);assert.deepEqual(two.map(card=>card.face).sort(),['plural','singular']);assert.ok(two.find(card=>card.face==='plural').text.startsWith('die '));}
});

test('the Oyunlar page offers every game, named in every site language',()=>{
 assert.deepEqual(verbGames.gameIds,['match','rain','catch','quick','search','rescue','plural']);
 const ids=site.siteLanguages.map(item=>item.id);
 for(const key of Object.keys(copy.gameCopy)){assert.equal(copy.gameCopy[key].length,12,key);}
 for(const id of ids.filter(id=>site.packLanguages.includes(id)&&site.siteLanguageIndex(id)>=12)){
  const pack=JSON.parse(read('lib/language-packs/'+id+'.json'));
  for(const [key,tuple] of Object.entries(copy.gameCopy))assert.ok(pack[tuple[2]]?.trim(),id+' '+key);
 }
 const ui=read('app/verb-games.tsx'),games=read('app/object-games.tsx'),page=read('app/verb-study.tsx');
 for(const name of ['RainGame','CatchGame','QuickGame','SearchGame','RescueGame','PluralGame'])assert.ok(ui.includes('<'+name+' ')&&games.includes('export function '+name+'('),name);
 assert.ok(page.includes('<GameIcon game={id}/>')&&page.includes('{gameName(id,language)}')&&page.includes('{gameDetail(id,language)}'));
 assert.ok(page.includes('speak:text=>speech.speak(text),prepare:()=>speech.prepare()'));
 // Answers: the right/wrong sound, then only the correct form; the word to hear in "Duy ve yakala" is the question itself.
 assert.ok(games.includes('feedback.answer(ok,item.de);')&&games.includes("feedback.speak(items[nextIndex].de);")&&games.includes('feedback.prepare();'));
 assert.ok(read('app/learning-effects.tsx').includes('[data-answer-tap]'),'no tap pop over the answer sound');
 assert.ok(read('app/layout.tsx').includes('import "./games.css";'));
});
