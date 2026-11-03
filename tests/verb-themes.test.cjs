// Fiil grupları (lib/verb-themes.ts, app/verb-themes.tsx; the learner asked, 3 November 2026: "group the verb workshop,
// make a fun part"): the 72 verbs by topic under the adventure map, each group with its verbs and the matching cards with
// just those verbs. The four parts in book order stay as they are.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');
const themes=load('verb-themes'),course=load('verb-course'),games=load('verb-games'),logic=load('verb-logic'),families=load('verb-families'),workshop=load('verb-workshop');
const site=load('site-languages'),copy=load('verb-copy');

test('every workshop verb is in exactly one group; a group has enough pictures for the matching cards',()=>{
 const all=themes.verbThemes.flatMap(theme=>theme.verbs);
 assert.equal(new Set(all).size,all.length,'no verb twice');
 assert.deepEqual([...all].sort(),workshop.workshopVerbs.map(verb=>verb.id).sort(),'all 72 verbs');
 assert.equal(all.length,72);
 for(const theme of themes.verbThemes){
  assert.match(theme.id,/^theme-[a-z]+$/);assert.ok(theme.emoji&&theme.tone,theme.id);
  for(const id of theme.verbs)assert.ok(course.verbMap.has(id),id);
  assert.ok(theme.verbs.filter(id=>logic.verbPicture(course.verbMap.get(id))).length>=6,theme.id+': six pairs with pictures');
 }
 // The book parts and their ids stay (saved rounds and the guest part use them).
 assert.deepEqual(families.verbFamilies.map(family=>family.id),['verbs-w1','verbs-w2','verbs-w3','verbs-w4']);
});

test('the matching cards of a group use only its verbs; Oyunlar keeps all verbs',()=>{
 for(const theme of themes.verbThemes){
  assert.deepEqual(games.gameVerbs(theme.id).map(verb=>verb.id).sort(),[...theme.verbs].sort(),theme.id);
  assert.deepEqual(games.matchKinds(theme.id)[0],'picture',theme.id);
  const cards=games.matchRound(theme.id,'picture','tr');assert.equal(cards.length,12,theme.id);
  for(const card of cards)assert.ok(theme.verbs.includes(card.pair),theme.id+' '+card.pair);
 }
 assert.equal(games.gameVerbs('verbs-all').length,course.verbs.length);
 const verbGames=read('app/verb-games.tsx');
 assert.ok(verbGames.includes("topic={isVerbTheme(topic)?topic:'verbs-all'}"),'the matching cards take a group');
 assert.ok(verbGames.includes("{backLabel??t('backGames')}"),'the back button names the group');
});

test('the page: the group cards under the map, a group view, the game, and the group in the address',()=>{
 const page=read('app/verb-study.tsx');
 for(const piece of ['<VerbThemeCards language={language} marks={stickers} onOpen={openTheme}/>','theme?<VerbThemeView theme={theme}',"setGameTopic(value.id);setGame('match');","if(isVerbTheme(gameTopic))setGameTopic('verbs-all');","url.searchParams.set('grup',theme.id)"])assert.ok(page.includes(piece),piece);
 assert.ok(page.indexOf('<VerbThemeCards')>page.indexOf('className="verb-map"')&&page.indexOf('<VerbThemeCards')<page.indexOf('className="panel verb-collection"'),'between the map and the collection');
 const view=read('app/verb-themes.tsx');
 for(const piece of ['onClick={()=>speech.speak(verbRowSpeech(verb))}','data-verb-theme-play={theme.id}','data-verb-theme={theme.id}'])assert.ok(view.includes(piece),piece);
 const css=read('app/verbs.css');for(const cls of ['.verb-theme-grid','.verb-theme-card','.verb-theme-view','.verb-theme-tiles','prefers-reduced-motion:reduce) { .verb-theme-card'])assert.ok(css.includes(cls),cls);
});

test('every text of the groups in every site language',()=>{
 const texts=[...['themesTitle','themesLead','themeOpen','themeTap','themeMatch','themeMatchLead','themeDone','backThemes'].map(key=>[key,copy.verbCopy[key]]),...themes.verbThemes.map(theme=>[theme.id,theme.title])];
 for(const [label,tuple] of texts){
  assert.equal(tuple.length,12,label);
  for(const {id} of site.siteLanguages){
   const index=site.siteLanguageIndex(id);
   const text=index<tuple.length?tuple[index]:JSON.parse(read('lib/language-packs/'+id+'.json'))[tuple[2]];
   assert.ok(text?.trim(),label+' '+id);
  }
 }
});
