// Fiil Atölyesi by topic (lib/verb-themes.ts). On 3 November 2026 the topics came as "Fiil grupları" under the map; since
// 4 November 2026 they are the map itself (the learner asked: "categorise the verbs too, move the game in this part to
// Oyunlar"): six topic parts with their own rounds, the book parts only read for the rounds saved before, and the
// matching cards in Oyunlar with all verbs or one topic.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');
const themes=load('verb-themes'),course=load('verb-course'),games=load('verb-games'),logic=load('verb-logic'),families=load('verb-families'),workshop=load('verb-workshop');
const site=load('site-languages'),copy=load('verb-copy');

test('every workshop verb is in exactly one topic; the map is the six topics, the book parts stay for old rounds',()=>{
 const all=themes.verbThemes.flatMap(theme=>theme.verbs);
 assert.equal(new Set(all).size,all.length,'no verb twice');
 assert.deepEqual([...all].sort(),workshop.workshopVerbs.map(verb=>verb.id).sort(),'all 72 verbs');
 assert.equal(all.length,72);
 for(const theme of themes.verbThemes){
  assert.match(theme.id,/^theme-[a-z]+$/);assert.ok(theme.emoji&&theme.tone,theme.id);
  for(const id of theme.verbs)assert.ok(course.verbMap.has(id),id);
  assert.ok(theme.verbs.filter(id=>logic.verbPicture(course.verbMap.get(id))).length>=6,theme.id+': six pairs with pictures');
 }
 assert.deepEqual(families.verbFamilies.map(family=>family.id),themes.verbThemes.map(theme=>theme.id),'one part per topic');
 assert.deepEqual(families.verbFamilies.map(family=>family.number),[1,2,3,4,5,6]);
 families.verbFamilies.forEach((family,i)=>{const theme=themes.verbThemes[i];assert.deepEqual(family.verbs,theme.verbs);assert.equal(family.tone,theme.tone);assert.equal(family.german,theme.title[1]);assert.deepEqual(family.title,theme.title);});
 assert.deepEqual(families.bookParts.map(family=>family.id),['verbs-w1','verbs-w2','verbs-w3','verbs-w4'],'the book part ids stay (saved rounds)');
 assert.equal(load('guest-parts').GUEST_ALL_VERBS,true,'a visitor opens every topic');
});

test('the matching cards of a topic use only its verbs; Oyunlar offers all verbs and every topic',()=>{
 for(const theme of themes.verbThemes){
  assert.deepEqual(games.gameVerbs(theme.id).map(verb=>verb.id).sort(),[...theme.verbs].sort(),theme.id);
  assert.deepEqual(games.matchKinds(theme.id)[0],'picture',theme.id);
  const cards=games.matchRound(theme.id,'picture','tr');assert.equal(cards.length,12,theme.id);
  for(const card of cards)assert.ok(theme.verbs.includes(card.pair),theme.id+' '+card.pair);
 }
 assert.equal(games.gameVerbs('verbs-all').length,course.verbs.length);
 const verbGames=read('app/verb-games.tsx');
 assert.ok(verbGames.includes("const matchTopic=isVerbTheme(topic)?topic:'verbs-all';")&&verbGames.includes('<MatchGame key={matchTopic+seed} language={language} topic={matchTopic}'),'the matching cards take a topic');
 assert.ok(verbGames.includes(`{game==='match'&&<div className="verb-game-topics verb-match-topics" role="group" aria-label={t('chooseGroup')}>{['verbs-all',...verbThemes.map(theme=>theme.id)].map(`)&&verbGames.includes('data-verb-match-topic={id}'),'Oyunlar: a chip for all verbs and one per topic');
 assert.ok(verbGames.includes("{theme?<><span aria-hidden=\"true\">{theme.emoji}</span> {themeTitle(theme,language)}</>:t('allVerbs')}"),'each chip names its topic in the learner\'s language');
 assert.ok(!verbGames.includes('backLabel'),'the back button always goes back to Oyunlar');
 assert.deepEqual([...games.gameIds],['match','rain','catch','quick','search','rescue','plural'],'the matching cards stay in Oyunlar');
});

test('the page: the topics are the map; no group cards and no game left in Fiil Atölyesi',()=>{
 const page=read('app/verb-study.tsx');
 assert.ok(!fs.existsSync('app/verb-themes.tsx'),'the group cards and the group view are gone');
 for(const piece of ['VerbThemeCards','VerbThemeView','playTheme','openTheme',"setGame('match')",'backLabel'])assert.ok(!page.includes(piece),piece);
 assert.ok(page.includes("verbFamilyMap.get(params.get('parca')??params.get('grup')??'')"),'an old group address opens its topic');
 assert.ok(page.includes("url.searchParams.delete('grup');"));
 assert.ok(page.includes(`<h3>{familyTitle(family,language)}{language!=='de'&&family.german&&<small lang="de" dir="ltr">{family.german}</small>}</h3>`),'the topic in the learner\'s language, its German name under it');
 assert.ok(page.includes('topic:PART_ROUND_TOPIC,count:ids.length,onlyIds:ids')&&page.includes('const ids=restart?partIds(family):remainingIds(family,stickers,snapshot.reviews);'),'a topic round holds only what is left');
 assert.ok(page.includes('partsStatus(snapshot.sessions,snapshot.reviews)')&&page.includes('currentPart(snapshot.sessions,snapshot.reviews)')&&page.includes('verbStatus(snapshot.sessions,snapshot.reviews)'));
 const card=read('app/verb-workshop.tsx');assert.ok(card.includes(`{language!=='de'&&family.german&&<p className="verb-part-german" lang="de" dir="ltr">{family.german}</p>}`));
 const css=read('app/verbs.css');
 assert.ok(!css.includes('.verb-theme-card')&&!css.includes('.verb-theme-view'),'no styles left for the removed cards');
 for(const tone of ['sky','orange','green','gold'])assert.ok(css.includes(':is(.verb-island,.verb-part-view).tone-'+tone+' {'),tone);
 for(const tone of ['violet','rose'])assert.ok(css.includes('.verb-island.tone-'+tone+' {')&&css.includes('.verb-part-view.tone-'+tone+' {'),tone);
 assert.ok(css.includes('.verb-match-topics { flex-wrap:nowrap; overflow-x:auto;'),'on a phone the topic chips are one sliding row');
 // The server takes a topic round of the workshop (and only of the workshop); a visitor may start topic 1.
 const route=read('app/api/study/route.ts');assert.ok(route.includes("...(mode==='workshop'?[VERB_TOPIC_ROUND]:[])"));
 assert.ok(read('lib/guest-taste.ts').includes('(topic===PART_ROUND_TOPIC||topic===WORKSHOP_TOPIC)&&mode===WORKSHOP_MODE')&&read('lib/guest-taste.ts').includes('const verbIds=new Set(workshopIds());'));
});

test('every topic name and the Oyunlar chips in every site language',()=>{
 const texts=[...['allVerbs','chooseGroup'].map(key=>[key,copy.verbCopy[key]]),...themes.verbThemes.map(theme=>[theme.id,theme.title])];
 for(const [label,tuple] of texts){
  assert.equal(tuple.length,12,label);
  for(const {id} of site.siteLanguages){
   const index=site.siteLanguageIndex(id);
   const text=index<tuple.length?tuple[index]:JSON.parse(read('lib/language-packs/'+id+'.json'))[tuple[2]];
   assert.ok(text?.trim(),label+' '+id);
  }
 }
});

test('progress by topic: what was done in the book parts, in topic rounds and by answers counts once',()=>{
 const unterwegs=families.verbFamilies[0];const book1=families.bookParts[0];
 const doneIn=family=>family.verbs.filter(id=>book1.verbs.includes(id)).length;
 // A finished round of book part 1 (saved before 4 November 2026): its verbs are done in their topics.
 const bookIds=workshop.partIds(book1);
 const old={id:'old',mode:'workshop',topic:'verbs-all',first:bookIds[0],total:bookIds.length,answered:bookIds.length,finished_at:5,ids:null};
 const status=workshop.verbStatus([old]);
 for(const id of book1.verbs)assert.deepEqual(status.get(id),{meaning:true,perfekt:true},id);
 assert.deepEqual(status.get('fahren'),{meaning:false,perfekt:false});
 const parts=workshop.partsStatus([old]);
 for(const part of parts){assert.equal(part.verbsDone,doneIn(part.family),part.family.id);assert.equal(part.done,doneIn(part.family)*4,part.family.id);}
 assert.equal(doneIn(unterwegs),3,'abfahren, ankommen and aussteigen');assert.ok(!parts[0].finished&&parts[0].started);
 assert.equal(parts[0].nextVerbId,'umsteigen','the first verb not done yet');
 // The next topic round asks only the verbs not done yet, each with all its steps.
 const left=workshop.remainingIds(unterwegs,status);
 assert.ok(!left.some(id=>/-(abfahren|ankommen|aussteigen)$/.test(id)),'nothing done is asked again');
 assert.equal(left.length,(unterwegs.verbs.length-3)*workshop.verbSteps.length);
 // Answers count: a verb whose meaning was answered goes on with its past form only.
 const row=id=>({question_id:id,seen:1});
 const reviews=[row('verb-meaning-fahren'),row('verb-write-fahren')];
 assert.equal(workshop.partsStatus([old],reviews)[0].marks[unterwegs.verbs.indexOf('fahren')].meaning,true);
 const next=workshop.remainingIds(unterwegs,workshop.verbStatus([old],reviews),reviews);
 assert.deepEqual(next.filter(id=>id.endsWith('-fahren')),['verb-partizip-fahren','verb-write-partizip-fahren','verb-aux-fahren']);
 // The past form done but not the meaning (older Perfekt rows): the verb is asked whole, so the round keeps its order.
 const pastOnly=[row('verb-perfekt-gehen'),row('verb-write-perfekt-gehen')];
 assert.deepEqual(workshop.verbStatus([],pastOnly).get('gehen'),{meaning:false,perfekt:true});
 assert.deepEqual(workshop.remainingIds(unterwegs,workshop.verbStatus([],pastOnly),pastOnly).filter(id=>id.endsWith('-gehen')),['meaning','write','partizip','write-partizip','aux'].map(step=>'verb-'+step+'-gehen'));
 for(const list of [left,next])assert.ok(!workshop.isOlderRound(list.map(id=>({id}))),'a new topic round is in the current order');
 // A topic round is read by its topic, never as a book part, even when it starts with the same verb (abfahren).
 const topicIds=workshop.partIds(unterwegs);
 const topicRound={id:'t',mode:'workshop',topic:workshop.PART_ROUND_TOPIC,first:topicIds[0],total:topicIds.length,answered:5,finished_at:null,ids:topicIds};
 assert.equal(workshop.sessionPart(topicRound).id,unterwegs.id);assert.equal(workshop.sessionPart(old).id,'verbs-w1');
 assert.equal(workshop.bookPartsStatus([topicRound])[0].done,0,'book part 1 does not take the topic round');
 const fresh=workshop.partsStatus([topicRound])[0];assert.equal(fresh.done,4);assert.equal(fresh.verbsDone,1);assert.equal(fresh.nextVerbId,'ankommen');assert.equal(fresh.session.id,'t');
 assert.equal(workshop.currentPart([topicRound]).family.id,unterwegs.id,'the topic practised last');
 assert.equal(workshop.currentPart([]).family.id,unterwegs.id);
 // Everything done: the whole topic again; a finished topic round keeps the tick.
 const every=topicIds.map(row);assert.ok(workshop.partsStatus([],every)[0].finished);
 assert.deepEqual(workshop.remainingIds(unterwegs,workshop.verbStatus([],every),every),topicIds);
 const done={...topicRound,id:'d',answered:topicIds.length,finished_at:9,ids:null};
 assert.ok(workshop.partsStatus([done])[0].completed&&workshop.partsStatus([done])[0].finished);
 assert.equal(workshop.currentPart([done]).family.id,families.verbFamilies[1].id,'a finished topic moves on to the next one');
});
