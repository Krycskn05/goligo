// The learner's review of the site (22 October 2026): a test that fits one screen, one menu on every page, no German
// interface labels, two clear counts, Ihre/eure, the games with the learner's drawings, the sound panel in tabs, and
// Lektion 12 in the other site languages.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');
const site=load('site-languages');
const marks=text=>(text.match(/\{\w+\}/g)??[]).sort().join();

// A text of a copy object in every site language: from the tuple, or the English line from the language pack.
function everyLanguage(tuple,label){
 for(const {id} of site.siteLanguages){
  const index=site.siteLanguageIndex(id);
  const text=index<tuple.length?tuple[index]:JSON.parse(read('lib/language-packs/'+id+'.json'))[tuple[2]];
  assert.ok(text?.trim(),label+' '+id);assert.equal(marks(text),marks(tuple[2]),label+' '+id);
 }
}

test('during a test the header is slim and the question and its answers fit on one phone screen',()=>{
 const css=read('app/koko-theme.css');
 for(const rule of ['.toon-app:has(.object-question) .site-header .site-greeting,','.toon-app:has(.object-question) .object-breadcrumb { display:none; }',
  '.toon-app:has(.object-question) .object-question .object-picture:not(.small)>.toon-art { max-height:clamp(120px,27vh,280px); }',
  '.toon-app:has(.object-question) .vault-listening-options .object-picture .toon-art { height:clamp(72px,14vh,136px); max-height:none; }',
  '.toon-app:has(.object-question) .work-layout>.work-sidebar,'])assert.ok(css.includes(rule),rule);
});

test('one menu on every part of the site, the part you are in marked',()=>{
 const menu=read('app/site-menu.tsx');
 for(const href of ['href="/"','href={unitsHref}',"href={'/ev-esyalar?learn='+course}",'href="/fiiller"','href="/oyunlar"','href="/yanlislarim"'])assert.ok(menu.includes(href),href);
 const pages={'app/object-study.tsx':"current={'vault'} course={course}",'app/verb-study.tsx':"current={section==='games'?'games':section==='mistakes'?'mistakes':'verbs'}",'app/housing-study.tsx':"current={'units'}",'app/ausbildung-study.tsx':"current={'units'}",'app/ausbildung-hoeren.tsx':"current={'units'}"};
 for(const [file,current] of Object.entries(pages)){const code=read(file);assert.ok(code.includes('<div className="work-layout site-layout"><SiteMenuAside language={language} '+current)&&code.includes('</main></div>'),file);}
 assert.ok(read('app/category-study.tsx').includes('<SiteMenu language={language}'));
});

test('no German interface labels; the counts are in the site language and say what they count',()=>{
 assert.ok(!read('app/verb-study.tsx').includes('Verben · ')&&read('app/verb-study.tsx').includes("{t('verbsCount',{n:workshopVerbs.length})} · {t('partsCount',{n:parts.length})}"));
 assert.ok(!read('app/housing-study.tsx').includes('>Inhalt<')&&read('app/housing-study.tsx').includes("{h('contents')}"));
 assert.ok(!read('app/ausbildung-study.tsx').includes('>Inhalt<')&&!read('app/ausbildung-hoeren.tsx').includes('>Hören<'));
 for(const file of ['app/landing.tsx','app/home-tour.tsx'])for(const word of ["' Gegenstände'","' Verben'","' Spiele'","'Spiele'","'Fehler'"])assert.ok(!read(file).includes(word),file+' '+word);
 const verbCopy=load('verb-copy').verbCopy,progress=load('progress-copy').progressCopy,housing=load('housing-copy').housingCopy,home=load('home-copy').homeCopy;
 for(const key of ['partsCount','gamesCount','verbsLearned','reviewShort'])everyLanguage(verbCopy[key],key);
 everyLanguage(progress.learned,'learned');everyLanguage(housing.contents,'contents');everyLanguage(home.gamesText,'gamesText');
 const effectsSource=read('lib/effects-copy.ts');
 for(const key of ['tabVoice','tabEffects','tabMotion'])everyLanguage(Function('return '+effectsSource.match(new RegExp('^ '+key+':(\\[.*\\]),$','m'))[1])(),key);
 assert.equal(verbCopy.verbsLearned[0],'Öğrenilen fiil: {n}/{total}');assert.equal(progress.learned[0],'Tamamlanan alıştırma: {n}/{total}');
});

test('verbs learned: a verb counts once all its exercises are learned',()=>{
 const progress=load('progress'),course=load('verb-course');
 const ids=progress.verbProgressIds('verbs-all');const byVerb=new Map();
 for(const q of course.verbQuestions)if(ids.includes(q.id)){byVerb.set(q.verbId,[...(byVerb.get(q.verbId)??[]),q.id]);}
 const [first,second]=[...byVerb.keys()];
 const row=(id,streak)=>({question_id:id,seen:1,streak});
 const reviews=[...byVerb.get(first).map(id=>row(id,1)),...byVerb.get(second).map((id,i)=>row(id,i?1:0))];
 const result=progress.learnedVerbs('verbs-all',reviews);
 assert.equal(result.total,byVerb.size);assert.equal(result.learned,1,'the second verb has one wrong exercise');
 assert.equal(progress.verbProgress('verbs-all',reviews).learned,byVerb.get(first).length+byVerb.get(second).length-1);
 assert.ok(read('app/verb-study.tsx').includes("{t('verbsLearned',{n:verbsDone.learned,total:verbsDone.total})}"));
});

test('"Sizin": both ihr (eure) and the polite Sie (Ihre) are right; the IDs stay',()=>{
 const housing=load('housing-course'),course=load('course');
 const q=id=>housing.housingQuestions.find(item=>item.id===id&&item.kind==='write');
 const eure=q('housing-11-a-possessive-eure');assert.equal(eure.gap,'Ist ___ Wohnung teuer?');
 for(const answer of ['eure','Ihre'])assert.ok(course.gradeAnswer(eure,answer),answer);
 assert.ok(!course.gradeAnswer(eure,'unsere'));
 assert.ok(course.gradeAnswer(q('housing-11-a-possessive-euer'),'Ihr')&&course.gradeAnswer(q('housing-11-a-possessive-eure-stuehle'),'Ihre')&&course.gradeAnswer(q('housing-11-a-possessive-euer-zimmer'),'Ihr'));
 assert.ok(!q('housing-11-a-possessive-unser').accepted,'"Bizim" has one answer');
 // The four-option copy is right only with its own answer (tests/study-flow.test.cjs checks every variant of every question).
 const choice=housing.housingQuestions.find(item=>item.id==='housing-11-a-possessive-eure-test');assert.ok(choice.options&&!choice.accepted);
 for(const item of course.questions??[])for(const variant of item.accepted??[])assert.ok(course.gradeAnswer(item,variant),item.id+' '+variant);
});

test('the games: the learner\'s drawings, level and length on every card, a play button',()=>{
 const games=load('verb-games'),names=load('game-names');
 for(const id of games.gameIds){assert.ok(fs.existsSync('public'+names.gamePicture(id)),id);assert.ok(names.GAME_SECONDS[id]>0,id);}
 assert.equal(names.gameLength('quick','tr'),'30 sn');assert.equal(names.gameLength('search','tr'),'≈ 3 dk');
 assert.ok(read('app/game-icons.tsx').includes('<img src={gamePicture(game)}'));
 const page=read('app/verb-study.tsx');
 assert.ok(page.includes('<span className="game-card-meta">{GAME_LEVEL} · {gameLength(id,language)}</span><span className="game-card-play"><Play size={16} aria-hidden="true"/>{t(\'play\')}</span>'));
 // The home page tells about all seven games, by name.
 assert.ok(read('app/home-tour.tsx').includes("fillText(h('gamesText'),{n:gameIds.length,names:gameNameList(language)})")&&read('app/site-tour.tsx').includes('names:gameNameList(language)'));
 assert.equal(names.gameNameList('tr').split(', ').length,games.gameIds.length);
});

test('the sound panel: three tabs, the top with ✕ and the bottom with Kapat stay in view',()=>{
 const code=read('app/learning-effects.tsx'),css=read('app/learning-effects.css');
 assert.ok(code.includes("[['voice','tabVoice','voice'],['effects','tabEffects','sounds'],['motion','tabMotion','animations']]")&&code.includes('role="tab"'));
 for(const id of ['voice','effects','motion'])assert.ok(code.includes(`id="lk-panel-${id}" role="tabpanel"`),id);
 assert.ok(css.includes('.lk-effects-top{position:sticky;top:0;')&&css.includes('.lk-effects-foot{position:sticky;bottom:0;'));
});

test('Lektion 12 packs: every Turkish text, with its marks, and German answers are never translated',()=>{
 const i18n=read('lib/l12-i18n.ts');
 const loaded=[...i18n.matchAll(/(\w+):\(\)=>import\('\.\/l12-packs\/(\w+)\.json'\)/g)];
 assert.ok(loaded.length>=22);
 const l12=load('l12-i18n'),courseL12=load('ausbildung-course'),hoeren=load('ausbildung-hoeren');
 const uiSource=new Set();for(const file of ['app/ausbildung-ui.tsx','app/ausbildung-listen.tsx','app/ausbildung-hoeren.tsx','app/ausbildung-study.tsx'])for(const m of read(file).matchAll(/\b(?:t|ui)\((['"])((?:(?!\1).)*)\1/g))uiSource.add(m[2]);
 const content=l12.l12ContentTexts(courseL12.lessonParts,hoeren.hoerenTasks,courseL12.lessonRoadmap);
 const italics=text=>(text.replace(/\*\*[^*]+\*\*/g,' ').match(/\*[^*]+\*/g)??[]).join('|');
 for(const [,language,file] of loaded){
  assert.equal(language,file);const pack=JSON.parse(read('lib/l12-packs/'+file+'.json'));
  for(const text of uiSource){assert.ok(pack.ui[text]?.trim(),language+' ui: '+text);assert.equal(marks(pack.ui[text]),marks(text),language+' '+text);}
  for(const text of content){const out=pack.content[text];assert.ok(out?.trim(),language+' content: '+text.slice(0,40));assert.equal(italics(out),italics(text),language+' German parts: '+text.slice(0,40));}
 }
 // Checked answers stay German: gap and sentence answers are not in the localizer.
 assert.ok(!i18n.includes('answers:')&&i18n.includes("case 'sentence':return {...item,prompt:tr(item.prompt)};"));
});

test('phones: the speed choices in one even row under their title; der / die / das about 48 px high',()=>{
 const css=read('app/learning-effects.css'),theme=read('app/koko-theme.css');
 assert.ok(css.includes('.lk-voice-speed{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}')&&css.includes('.lk-voice-speed>span{grid-column:1/-1;'));
 assert.ok(theme.includes('.article-choice { min-height:48px;')&&theme.includes('.verb-aux-choice { min-height:48px; }'));
 assert.ok(read('app/learning-effects.tsx').includes("{message?text(message):''}")&&css.includes('.lk-effects-message:empty{display:none}'),'no empty line above Kapat');
 assert.ok(read('app/learning-effects.tsx').includes('<div className="lk-volume-row"><label className="lk-volume-label"')&&css.includes('.lk-effects-panel .lk-sound-group{margin:0;border-radius:0;border-top-width:0}'),'small phones: the Efektler tab fits');
});

test('Oyunlar and Yanlışlarım are parts of their own; Yanlışlarım shows the mistakes of every part',()=>{
 for(const [file,part] of [['app/oyunlar/page.tsx','games'],['app/yanlislarim/page.tsx','mistakes']])assert.ok(read(file).includes(`<VerbStudy guest={!(await getChatGPTUser())} part="${part}"/>`),file);
 const auth=load('member-auth');for(const page of ['/oyunlar','/yanlislarim'])assert.ok(auth.GUEST_PAGES.has(page),page);
 const page=read('app/verb-study.tsx');
 assert.ok(page.includes("if(value==='oyunlar'||value==='yanlislar')window.location.replace(value==='oyunlar'?'/oyunlar':'/yanlislarim');"),'old addresses move');
 assert.ok(page.includes("{part?<span>{t(part==='games'?'gamesTitle':'mistakesTitle')}</span>:section?<>"),'Ana sayfa › Oyunlar, not under Fiil Atölyesi');
 assert.ok(!page.includes("{t('backWorkshop')}</button>}</div>")||page.split("{!part&&<button type=\"button\" className=\"text-button verb-back\"").length===4,'no "back to the workshop" on the own pages');
 for(const piece of ['data-mistake-part="vault"','data-mistake-part="housing"','href="/ev-esyalar?learn=de&tekrar=1"','href="/a1-2/ev-ve-yasam?tekrar=1"'])assert.ok(page.includes(piece),piece);
 assert.ok(read('app/object-study.tsx').includes("get('tekrar')==='1')chooseCategory('all');")&&read('app/housing-study.tsx').includes("get('tekrar')==='1')choose('all');"));
 const progress=load('progress'),objects=load('object-course'),housing=load('housing-course');
 const vaultQ=objects.objectQuestions.find(q=>progress.objectProgressIds('all').includes(q.id));const housingQ=housing.housingQuestions[0];
 const row=(id,wrong,streak)=>({question_id:id,seen:2,wrong_count:wrong,streak});
 const result=progress.partMistakes([row(vaultQ.id,1,0),row(housingQ.id,2,1)]);
 assert.equal(result.vault.count,1);assert.deepEqual(result.vault.words,[objects.objectWordMap.get(vaultQ.objectId).de]);assert.equal(result.housing.count,1);
 assert.equal(progress.partMistakes([row(vaultQ.id,1,3)]).vault.count,0,'three right answers since: no longer a mistake');
 const verbCopy=load('verb-copy').verbCopy;for(const key of ['mistakesAllLead','mistakesCount','mistakesOpen','mistakesNoneHere'])everyLanguage(verbCopy[key],key);
});

test('Paul keeps off the answers on phones; pages wait for the chosen language; "Alıştırma hazırlanıyor…" while a round starts',()=>{
 const css=read('app/learning-effects.css');
 assert.ok(css.includes('.toon-app:has(.object-question) .work-header.site-header,.toon-app:has(.verb-game) .work-header.site-header{position:sticky;top:0;z-index:30}'),'the slim header is the badge\'s place');
 assert.ok(css.includes('body:has(.object-question) .lk-reaction-badge,body:has(.verb-game) .lk-reaction-badge{top:calc(env(safe-area-inset-top,0px) + 8px);flex-direction:row;')&&css.includes('body:has(.object-question) .paul-peek,body:has(.verb-game) .paul-peek{display:none}'));
 for(const file of ['app/housing-study.tsx','app/category-study.tsx','app/ausbildung-study.tsx','app/ausbildung-hoeren.tsx'])assert.ok(read(file).includes('if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;'),file+': nothing in German before the chosen language');
 for(const file of ['app/object-study.tsx','app/verb-study.tsx','app/housing-study.tsx'])assert.ok(/<StartWait show=\{busy&&!session\} text=\{\w+\(/.test(read(file)),file);
 everyLanguage(load('object-vault-copy').vaultCopy?.preparing??Function('return '+read('lib/object-vault-copy.ts').match(/^  preparing:(\[.*\]),$/m)[1])(),'preparing');
});

test('Yanlışlarım: every mistake of the site in one round',()=>{
 const study=load('study'),progress=load('progress'),housing=load('housing-course');
 const verb=progress.verbProgressIds('verbs-all')[0],object=progress.objectProgressIds('all')[3],home=housing.housingQuestions[2].id;
 const reviews=[verb,object,home].map(id=>({question_id:id,seen:2,wrong_count:1,streak:0,due_at:0}));
 const ids=progress.allMistakeIds(reviews,[verb]);assert.deepEqual([...ids].sort(),[verb,object,home].sort());
 assert.deepEqual(study.selectQuestions('review','all',ids.length,reviews,ids,'de').map(q=>q.id).sort(),[verb,object,home].sort(),'the server round takes every part');
 assert.ok(!study.selectQuestions('review','all',20,reviews,undefined,'de').some(q=>q.id===verb),'other review rounds stay as they were');
 const page=read('app/verb-study.tsx');
 assert.ok(page.includes("api<{session:Session}>({action:'start',id:crypto.randomUUID(),mode:MISTAKES_MODE,topic:'all',count:allMistakes.length,onlyIds:allMistakes}"));
 assert.ok(page.includes("const q=everyMistake||verbModePredicate(")&&page.includes('</section>:q&&everyMistake?<section className="object-practice picture-quiz-practice verb-practice mixed-practice">'));
 assert.ok(page.includes('data-mistakes-all-start={allMistakes.length}')&&page.includes("{t('mistakesAllStart',{n:allMistakes.length})}"));
 everyLanguage(load('verb-copy').verbCopy.mistakesAllStart,'mistakesAllStart');
});
