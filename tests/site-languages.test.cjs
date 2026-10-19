const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const site=load('site-languages');
const ids=site.siteLanguages.map(item=>item.id);

test('every page offers the same 31 site languages in one fixed order',()=>{
 assert.equal(ids.length,31);assert.equal(new Set(ids).size,31);
 // Text tuples in the code are written in this order: never reorder the first twelve.
 assert.deepEqual(ids.slice(0,12),['tr','de','en','ar','uk','fr','es','ru','fa','pl','it','pt']);
 assert.deepEqual(ids.filter(id=>site.languageDirection(id)==='rtl').sort(),['ar','fa','prs','ps','ur']);
 for(const item of site.siteLanguages){assert.ok(item.label.trim()&&item.locale.trim(),item.id);assert.doesNotThrow(()=>new Intl.NumberFormat(item.locale),item.id);}
 assert.deepEqual(load('study-languages').studyLanguages.map(item=>item.id),ids);
 assert.deepEqual(load('object-vault-copy').vaultLanguages.map(item=>item.id),ids);
 assert.ok(load('study-languages').isStudyLanguage('ti')&&load('object-vault-copy').isVaultLanguage('hbs')&&!site.isSiteLanguage('xx'));
});

test('texts come from the tuple first, then from the language pack, then in English',()=>{
 const six=['TR','DE','EN','AR','UK','FR'];const twelve=[...six,'ES','RU','FA','PL','IT','PT'];
 assert.equal(site.pickText(six,'ar'),'AR');assert.equal(site.pickText(twelve,'pt'),'PT');
 assert.equal(site.pickText(['tr','','en','ar','uk','fr'],'de'),'','an empty tuple entry stays empty');
 assert.equal(site.pickText(six,'es'),'EN','without a pack the English text is shown');
 site.registerLanguagePack('cs',{EN:'CS'});
 assert.equal(site.pickText(six,'cs'),'CS');assert.equal(site.pickText(twelve,'cs'),'CS');assert.equal(site.packText('cs','missing'),'missing');
 assert.equal(site.pickText(twelve,'es'),'ES','a twelve-language tuple keeps its own Spanish');
});

test('every language that needs a pack has one, and packs keep the placeholders',async()=>{
 const builtIn=['tr','de','en','ar','uk','fr'];
 assert.deepEqual([...site.packLanguages].sort(),ids.filter(id=>!builtIn.includes(id)).sort());
 const loader=fs.readFileSync('lib/site-languages.ts','utf8');
 for(const id of site.packLanguages){
  assert.ok(loader.includes(`${id}:()=>import('./language-packs/${id}.json')`),id);
  const pack=JSON.parse(fs.readFileSync(`lib/language-packs/${id}.json`,'utf8'));
  assert.equal(typeof pack,'object',id);
  for(const [english,text] of Object.entries(pack)){
   assert.ok(typeof text==='string'&&text.trim(),id+': '+english);
   const holes=value=>(value.match(/\{[^{}]+\}/g)??[]).sort().join();
   assert.equal(holes(text),holes(english),id+': '+english);
  }
  await site.loadLanguagePack(id);assert.ok(site.hasLanguagePack(id),id+' loads');
 }
 for(const id of builtIn)assert.ok(site.hasLanguagePack(id));
});

test('pages switch the language only after its pack is loaded and use the language direction',()=>{
 for(const file of ['app/category-study.tsx','app/housing-study.tsx','app/object-study.tsx','app/verb-study.tsx']){
  const page=fs.readFileSync(file,'utf8');
  assert.ok(page.includes('useLanguageSwitch(setLanguage)'),file);
 }
 assert.ok(fs.readFileSync('app/learning-effects.tsx','utf8').includes('loadLanguagePack(code)'));
 for(const file of ['app/category-study.tsx','app/housing-study.tsx','app/housing-lesson.tsx','app/learning-effects.tsx','app/site-header.tsx'])
  assert.ok(!/language==='ar'\?'rtl'|language==='fa'\?'rtl'|'ar'\|\|language==='fa'/.test(fs.readFileSync(file,'utf8')),file);
 // Header texts come from tuples, so every language gets them.
 const header=fs.readFileSync('app/site-header.tsx','utf8');
 assert.ok(header.includes('pickText(siteLanguageLabel,language)')&&header.includes('pickText(greetingLine,language)'));
});

test('object meanings and verb example sentences exist for every site language',()=>{
 const {objectMeaning}=load('object-translations');const {objectVocabulary}=load('object-course');
 for(const word of objectVocabulary)for(const id of ids)assert.ok(objectMeaning(word.id,id).trim(),id+' '+word.id);
 const meanings=load('verb-example-meanings');
 assert.deepEqual([...meanings.exampleMeaningLanguages].sort(),ids.filter(id=>id!=='de').sort());
 for(const id of meanings.exampleMeaningLanguages)assert.ok(fs.existsSync(`lib/verb-examples.${id}.json`),id);
});
