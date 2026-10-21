// The site looks like the visitor's phone language, German is the main language (the learner asked), and the pages a
// visitor sees before signing in — the legal pages too — come in every site language (the learner asked: all 31).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const device=load('device-language');const site=load('site-languages');const pub=load('public-copy');const legal=load('legal-copy');
const read=file=>fs.readFileSync(file,'utf8');
const ids=site.siteLanguages.map(item=>item.id);

test('the first of the phone languages the site has, otherwise German',()=>{
 assert.equal(device.DEFAULT_SITE_LANGUAGE,'de');
 const cases=[[['tr-TR','en-US'],'tr'],[['sw-KE','en-US','en'],'en'],[['sw'],'de'],[[],'de'],[null,'de'],[['de-AT'],'de'],
  [['sr-Latn-RS'],'hbs'],[['bs'],'hbs'],[['hr-HR'],'hbs'],[['fa-AF'],'prs'],[['fa-IR'],'fa'],[['fa'],'fa'],[['prs'],'prs'],[['kmr'],'ku'],[['ku-TR'],'ku'],
  [['zh-TW'],'zh'],[['pt-PT'],'pt'],[['uk_UA'],'uk'],[['AR'],'ar'],[['ti-ER'],'ti'],[['*'],'de'],[['constructor','__proto__'],'de'],[['','  ','ja-JP'],'ja']];
 for(const [list,want] of cases)assert.equal(device.deviceLanguage(list),want,JSON.stringify(list));
 // A language chosen on the site wins over the phone.
 assert.equal(device.chooseSiteLanguage('uk',['tr-TR']),'uk');assert.equal(device.chooseSiteLanguage('xx',['tr-TR']),'tr');assert.equal(device.chooseSiteLanguage(null,['sw']),'de');
});

test('on the server: the cookie, then the browser\'s Accept-Language, then German',()=>{
 assert.deepEqual(device.acceptLanguages('tr-TR,tr;q=0.9,en;q=0.8,*;q=0.1'),['tr-TR','tr','en','*']);
 assert.deepEqual(device.acceptLanguages('en;q=0.5, ar, fr;q=0'),['ar','en'],'most wanted first; q=0 means not wanted');
 assert.deepEqual(device.acceptLanguages(''),[]);assert.deepEqual(device.acceptLanguages(null),[]);
 assert.equal(device.requestLanguage('a=1; goligo-dil=ar; b=2','tr-TR'),'ar');
 assert.equal(device.requestLanguage('goligo-dil=xx','tr-TR,tr;q=0.9'),'tr','a strange cookie is ignored');
 assert.equal(device.requestLanguage(null,'sw,fr;q=0.5'),'fr');assert.equal(device.requestLanguage(null,null),'de');assert.equal(device.requestLanguage('lk_session=abc','sw'),'de');
 assert.equal(device.languageCookie('uk'),'goligo-dil=uk; Path=/; Max-Age=31536000; SameSite=Lax');
});

test('every page starts in the saved or the phone language and keeps it for the server pages',()=>{
 for(const file of ['app/category-study.tsx','app/housing-study.tsx','app/ausbildung-study.tsx','app/ausbildung-hoeren.tsx']){
  const page=read(file);
  assert.ok(page.includes('switchLanguage(browserLanguage(),')&&page.includes('rememberSiteLanguage(language)'),file);
  assert.ok(!page.includes("useState<StudyLanguage>('tr')"),file);
 }
 for(const file of ['app/object-study.tsx','app/verb-study.tsx']){
  const page=read(file);assert.ok(page.includes('let saved:VaultLanguage=browserLanguage();try{saved=readVaultLanguage(localStorage,saved);'),file);
 }
 assert.ok(read('lib/vault-language-preference.ts').includes('rememberSiteLanguage(language);'),'a choice in Nesne Kasası or Fiil Atölyesi is kept too');
 assert.ok(read('app/layout.tsx').includes('<html lang="de">'));
 // The server pages: language from app/page-language.ts, the header lets the visitor change it.
 for(const file of ['app/landing.tsx','app/giris/page.tsx','app/uye-ol/page.tsx','app/hesabim/page.tsx','app/gizlilik/page.tsx','app/kullanim-kosullari/page.tsx'])assert.ok(read(file).includes('await pageLanguage()'),file);
 const shell=read('app/public-shell.tsx');assert.ok(shell.includes('<PublicLanguage language={language} label={pickText(siteLanguageLabel,language)}/>')&&shell.includes('lang={language} dir={languageDirection(language)}'));
 const picker=read('app/public-language.tsx');assert.ok(picker.includes('rememberSiteLanguage(next);window.location.reload();')&&picker.includes('if(cookieLanguage(document.cookie)===saved)window.location.reload();'),'reloads once, never in a loop');
 assert.ok(!read('app/auth-form.tsx').match(/'[A-ZÇŞİÖÜ][a-zçğıöşü ]+[.!]'/),'no Turkish messages left in the form');
});

test('every text of these pages exists in all 31 languages, with its marks',async()=>{
 const holes=text=>(text.match(/\{[^{}]+\}/g)??[]).sort().join();
 for(const id of ids)await site.loadLanguagePack(id);
 for(const [name,copy,text] of [['public',pub.publicCopy,pub.publicText],['legal',legal.legalCopy,legal.legalText]]){
  for(const [key,tuple] of Object.entries(copy)){
   assert.equal(tuple.length,6,key);
   for(const id of ids){
    const value=site.pickText(tuple,id);
    assert.ok(value.trim(),name+' '+key+' '+id);
    assert.equal(holes(value),holes(tuple[2]),name+' '+key+' '+id);
    if(!['tr','de','en','ar','uk','fr'].includes(id))assert.notEqual(value,'',key);
   }
   // Only short names may stay the same as in English (for example "Goligo", "E-Mail" …); every sentence is translated.
   if(tuple[2].length>40)for(const id of ids.filter(id=>id!=='en'))assert.notEqual(site.pickText(tuple,id),tuple[2],name+' '+key+' '+id+' is still English');
  }
  assert.equal(typeof text,'function');
 }
 assert.equal(pub.publicText('de','landingLead',{site:'Goligo'}).startsWith('Bei Goligo'),true);
 assert.equal(legal.legalText('tr','updated',{date:'21 Ekim 2026'}),'Son güncelleme: 21 Ekim 2026');
});

test('the legal pages: the Turkish original, a translation note elsewhere, the language cookie explained',()=>{
 const privacy=read('app/privacy-view.tsx'),terms=read('app/terms-view.tsx'),parts=read('app/legal-parts.tsx');
 assert.ok(parts.includes("{language!=='tr'&&<p className=\"lk-legal-note\" data-legal-translation>{text('translationNote')}</p>}"));
 assert.ok(privacy.includes("rich('whatLanguageCookie',{code:()=><code>{LANGUAGE_COOKIE}</code>})")&&privacy.includes('<LegalDate language={language}/>')&&terms.includes('<LegalDate language={language}/>'));
 assert.ok(read('lib/legal-copy.ts').includes("'{b}Dil çerezi:{/b} seçilen site dili {code} adlı bir çerezde saklanır"));
 assert.equal(read('app/legal.tsx').match(/LEGAL_UPDATED='([^']+)'/)[1],'2026-10-21');
 // Every legal key is used on a page.
 const used=privacy+terms+parts+read('app/legal.tsx')+read('app/gizlilik/page.tsx')+read('app/kullanim-kosullari/page.tsx');
 for(const key of Object.keys(legal.legalCopy))assert.ok(used.includes(`'${key}'`),key);
});

test('the footer and the forms in the browser carry only their own texts',()=>{
 const foot=load('footer-copy');
 for(const key of Object.keys(foot.footerCopy))assert.deepEqual(foot.footerCopy[key],pub.publicCopy[key],key);
 assert.ok(read('app/site-footer.tsx').includes('footerText(language,key)'));
 // The server picks the texts for the forms; the browser gets no big text table and no language pack for them.
 for(const file of ['app/auth-form.tsx','app/account-panel.tsx','app/public-language.tsx','app/site-footer.tsx'])assert.ok(!read(file).includes("from '@/lib/public-copy'"),file);
 assert.ok(read('app/giris/page.tsx').includes('texts={authFormTexts(language)}')&&read('app/uye-ol/page.tsx').includes('texts={authFormTexts(language)}')&&read('app/hesabim/page.tsx').includes('texts={accountTexts(language)}'));
 const fill=load('copy-fill');
 assert.equal(fill.authMessage({pwShort:'At least {n}.'},{code:'pwShort',n:8},'x'),'At least 8.');
 assert.equal(fill.authMessage({},{code:'nope'},'fallback'),'fallback');assert.equal(fill.authMessage({},{error:'Türkçe'},'fallback'),'fallback','never the Turkish text in another language');
 assert.equal(fill.fillText('{a} {b} {a}',{a:1}),'1 {b} 1');assert.equal(fill.fillText('{constructor}',{}),'{constructor}');
});
