// Lektion 1, 2 and 15 in English, Arabic and Ukrainian (lib/unit-i18n.ts, lib/unit-packs/*.json; the learner asked,
// 2 November 2026): every Turkish text of the pages and of the lessons' data has a translation in each pack, the German
// parts and the {marks} stay as they are, and the speaking practice gets its notes in the lesson's language.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const i18n=load('unit-i18n'),prompt=load('talk-prompt'),talk=load('talk-scenarios');
// German since 3 November 2026: every unit comes in tr, en, ar, uk and de (CLAUDE.md).
const languages=['en','ar','uk','de'];
const packs=Object.fromEntries(languages.map(id=>[id,JSON.parse(fs.readFileSync(`lib/unit-packs/${id}.json`,'utf8'))]));
const pages=['app/willkommen-ui.tsx','app/willkommen-study.tsx','app/willkommen-b-steps.tsx','app/willkommen-c-steps.tsx','app/willkommen-d-steps.tsx',
 'app/berufe-study.tsx','app/berufe-a-steps.tsx','app/berufe-b-steps.tsx','app/berufe-c-steps.tsx','app/berufe-d-steps.tsx',
 'app/stadt-study.tsx','app/stadt-a-steps.tsx','app/talk-step.tsx'];
/** The Turkish texts a page shows: ut('…') and <Tx text="…"/>. */
function pageTexts(){
 const out=new Set();
 for(const file of pages){
  const source=fs.readFileSync(file,'utf8');
  for(const m of source.matchAll(/\but\((['"])((?:\\.|(?!\1).)*)\1/g))out.add(m[2].replace(/\\(['"])/g,'$1'));
  for(const m of source.matchAll(/<Tx(?: key="[^"]*")? text="([^"]*)"/g))out.add(m[1]);
 }
 return [...out];
}
const marks=text=>[...text.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort().join(' ');
const german=text=>[...text.replace(/\*\*[^*]+\*\*/g,'').matchAll(/\*(?!\*)[^*\s][^*]*\*(?!\*)|~[^~]+~|\[(?:der|die|das)\]/g)].map(m=>m[0]).sort().join(' | ');

test('every text a lesson page shows has an English, Arabic, Ukrainian and German translation',()=>{
 const texts=pageTexts();assert(texts.length>500,texts.length);
 for(const id of languages)for(const text of texts)assert(typeof packs[id][text]==='string'&&packs[id][text].trim(),id+': '+text);
});

// Texts that reach ut() without a literal ut('…') call stayed Turkish in every language (the learner saw it in German,
// 3 November 2026): exercise titles, leads, box labels and picture texts given as props, the summary's said('…'), feedback
// text:'…' and the strings of ut(a ? '…' : '…'). Each has a translation unless it is German on purpose.
const germanOnly=text=>/^Alles klar\? · /.test(text)||['___','wir','Ich buchstabiere','mein / meine · dein / deine','An der Information','Am Eingang','Dialog · In der Sprachschule'].includes(text);
test('titles, leads, box labels, picture texts, feedback and ut(a ? b : c) texts are translated too (3 November 2026)',()=>{
 const texts=new Set();
 for(const file of pages){
  const source=fs.readFileSync(file,'utf8');
  for(const m of source.matchAll(/\b(?:title|lead|bankLead|kicker|alt)="([^"]+)"/g))texts.add(m[1]);
  for(const m of source.matchAll(/\bsaid\('([^']*)'\)/g))texts.add(m[1]);
  for(const m of source.matchAll(/\btext:'((?:\\.|[^'\\])*)'/g))texts.add(m[1].replace(/\\(.)/g,'$1'));
  for(const m of source.matchAll(/\but\(([^()]*\?[^()]*)\)/g))for(const q of m[1].matchAll(/'((?:\\.|[^'\\])*)'/g))texts.add(q[1]);
 }
 assert(texts.size>250,texts.size);
 for(const text of texts)if(!germanOnly(text))for(const id of languages)assert.ok(packs[id][text]?.trim(),id+': '+text);
 // The greeting-time rows and the „no German voice“ notice are shown in the language too.
 assert.match(fs.readFileSync('app/willkommen-c-steps.tsx','utf8'),/\{ut\(item\.time\)\}/);
 for(const file of ['app/willkommen-study.tsx','app/berufe-study.tsx','app/stadt-study.tsx','app/ausbildung-study.tsx'])assert.match(fs.readFileSync(file,'utf8'),/vaultText\(language,'audioWarning'\)/,file);
 for(const text of ['Eksik harfleri tamamla','Resmî diyalog (Sie)','Kutu:','Dinliyorum… bitince ■ dokun','ad sorma'])assert.ok(texts.has(text),text);
});

test('the Turkish texts of the lessons’ data are in every pack',()=>{
 const strong=/[çğışİŞĞ]/;let count=0;
 for(const name of ['willkommen-course','willkommen-b-course','willkommen-c-course','willkommen-d-course','berufe-course','berufe-b-course','berufe-c-course','berufe-d-course','stadt-course','unit-goals']){
  const data=load(name);const seen=new WeakSet();
  const walk=value=>{
   if(typeof value==='string'){if(strong.test(value)){count++;for(const id of languages)assert(Object.prototype.hasOwnProperty.call(packs[id],value),id+' ('+name+'): '+value);}return;}
   if(value&&typeof value==='object'&&!(value instanceof RegExp)&&!seen.has(value)){seen.add(value);Object.values(value).forEach(walk);}
  };
  Object.values(data).forEach(walk);
 }
 assert(count>800,count);
});

test('Turkish words without ç/ğ/ı/ş (Almanya, evet, merdiven …) are in every pack too (3 November 2026)',()=>{
 const tables=[['willkommen-course','countries',2],['willkommen-course','articleCountries',2],['willkommen-b-course','languages',1],['willkommen-b-course','wordsB',1],['willkommen-c-course','moods',2],['willkommen-d-course','wordsD',1],
  ['berufe-course','otherWords',1],['berufe-b-course','wordsB',1],['berufe-c-course','wordsC',1],['berufe-d-course','wordsD',1],['stadt-course','officeVerbs',1],['stadt-course','directionWords',2]];
 for(const [name,key,column] of tables){
  const rows=load(name)[key];assert.ok(rows?.length,name+'.'+key);
  for(const row of rows)for(const id of languages)assert.ok(Object.prototype.hasOwnProperty.call(packs[id],row[column]),id+' '+name+'.'+key+': '+row[column]);
 }
 // The short names of Lektion 1's exercise strip (a map in the page, read through ut()).
 const shortMap=fs.readFileSync('app/willkommen-study.tsx','utf8').split('const shortNames')[1].split('};')[0];
 for(const [,text] of shortMap.matchAll(/[a-z0-9-]+'?:'([^']*)'/g))for(const id of languages)assert.ok(Object.prototype.hasOwnProperty.call(packs[id],text),id+' short name: '+text);
 for(const text of ['Dillerini söyle: **Ich spreche … und ein bisschen Deutsch.**','Bürgeramt’ta','Türkiye’den geliyorum.','Diyalog: Bürgeramt','Diyalog: Sie','Kapak','Katlar','Alfabe','olmak','doktor','merdiven','asansör (= der Lift, der Fahrstuhl)'])
  for(const id of languages)assert.ok(packs[id][text]?.trim(),id+': '+text);
});

test('translations keep the {marks}, the German parts and the coloured articles',()=>{
 for(const id of languages)for(const [key,value] of Object.entries(packs[id])){
  assert.equal(marks(value),marks(key),id+' marks: '+key);
  // „13–19 = birler + zehn“ has Turkish inside its German span: the only text whose span is translated.
  if(!/birler/.test(key))assert.equal(german(value),german(key),id+' German: '+key);
 }
});

test('a text without a pack or a translation stays Turkish; {marks} are filled',()=>{
 i18n.registerUnitPack('en',{'Soru {n}':'Question {n}'});
 assert.equal(i18n.unitText('en','Soru {n}',{n:3}),'Question 3');
 assert.equal(i18n.unitText('en','Bilinmeyen metin'),'Bilinmeyen metin');
 assert.equal(i18n.unitText('tr','Soru {n}',{n:3}),'Soru 3');
 assert.equal(i18n.unitText('fr','Soru {n}',{n:3}),'Soru 3');
 i18n.setUnitLanguage('en');assert.equal(i18n.ut('Soru {n}',{n:1}),'Question 1');assert.equal(i18n.utLang('Soru {n}'),'en');assert.equal(i18n.utLang('Yok'),'tr');
 i18n.setUnitLanguage('tr');
 assert.deepEqual(i18n.unitPackLanguages.sort(),['ar','de','en','uk']);
 // A meaning beside German that only repeats it is left out (German help: „Italien – Italien“, a sentence prompt that gives the answer).
 i18n.registerUnitPack('de',{'İtalya':'Italien','Ülkeler':'Länder'});i18n.setUnitLanguage('de');
 assert.equal(i18n.utBeside('Italien','İtalya'),'');assert.equal(i18n.utBeside('die Schweiz','İtalya'),'Italien');assert.equal(i18n.utBeside('Länder?','Ülkeler'),'');
 i18n.setUnitLanguage('tr');assert.equal(i18n.utBeside('Italien','İtalya'),'İtalya');
});

test('the lesson pages load the pack with the language and drop the “only in Turkish” note when it is there',()=>{
 for(const file of ['app/willkommen-study.tsx','app/berufe-study.tsx','app/stadt-study.tsx']){
  const source=fs.readFileSync(file,'utf8');
  assert(source.includes('useLanguageSwitch(setLanguage,loadUnitPack)'),file);
  assert(source.includes('setUnitLanguage(language);'),file);
  assert(source.includes("language!=='tr'&&!hasUnitPack(language)&&turkishNote[language]"),file);
 }
});

test('Konuş: the translation and the notes come in the lesson’s language; Turkish stays the default',()=>{
 const scenario=talk.talkScenarios.l15a;
 assert.equal(prompt.talkSystemPrompt(scenario),prompt.talkSystemPrompt(scenario,0,'tr'));
 assert(prompt.talkSystemPrompt(scenario).includes('"tr" is the Turkish translation of your WHOLE German reply'));
 const arabic=prompt.talkSystemPrompt(scenario,0,'ar');
 for(const piece of ['Arabic-speaking adult','explanation in Arabic','"tr" is the Arabic translation of your WHOLE German reply'])assert(arabic.includes(piece),piece);
 assert.equal(prompt.talkHelpLanguage('uk'),'uk');assert.equal(prompt.talkHelpLanguage('fr'),'tr');assert.equal(prompt.talkHelpLanguage(undefined),'tr');
 assert(prompt.talkMessages(scenario,[{role:'learner',text:'Hallo'}],'en')[0].content.includes('English-speaking adult'));
 assert(fs.readFileSync('app/api/konus/route.ts','utf8').includes('talkMessages(scenario,history,talkHelpLanguage(body.language))'));
 assert(fs.readFileSync('app/talk-step.tsx','utf8').includes('language:props.language'));
 // German help: explanations in simple German, „tr“ a simpler German paraphrase (no translation into the same language).
 const german=prompt.talkSystemPrompt(scenario,0,'de');
 assert(german.includes('wants every explanation in simple German')&&german.includes('even simpler German words')&&!german.includes('German-speaking adult'));
 assert.equal(prompt.talkHelpLanguage('de'),'de');
});
