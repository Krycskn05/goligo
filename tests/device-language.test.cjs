// Which language a visitor sees: a language chosen on the site, otherwise the phone's or browser's language when the
// site has it (the learner asked, 22 October 2026), otherwise German; anybody can change the site language without signing
// up; the pages a visitor sees before signing in — the legal pages too — come in every site language (all 31).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const device=load('device-language');const site=load('site-languages');const pub=load('public-copy');const legal=load('legal-copy');
const read=file=>fs.readFileSync(file,'utf8');
const ids=site.siteLanguages.map(item=>item.id);

test('a chosen language wins; otherwise the phone or browser language when the site has it; otherwise German',()=>{
 // The learner asked (22 October 2026): on the first visit the site opens in the device's language.
 assert.equal(device.DEFAULT_SITE_LANGUAGE,'de');
 assert.equal(device.chooseSiteLanguage('uk'),'uk');assert.equal(device.chooseSiteLanguage('xx'),'de');assert.equal(device.chooseSiteLanguage(null),'de');assert.equal(device.chooseSiteLanguage('constructor'),'de');
 assert.equal(device.chooseSiteLanguage('uk','tr'),'uk','a choice made on the site beats the phone');assert.equal(device.chooseSiteLanguage(null,'tr'),'tr');assert.equal(device.chooseSiteLanguage('xx','ar'),'ar');
 // Phone and browser language tags.
 for(const [tag,language] of [['tr-TR','tr'],['tr','tr'],['de-AT','de'],['en_GB','en'],['pt-PT','pt'],['ar-SA','ar'],['uk-UA','uk'],['zh-Hans-CN','zh'],['zh-TW','zh'],['sr-Latn-RS','hbs'],['hr','hbs'],['bs-BA','hbs'],['fa-IR','fa'],['fa-AF','prs'],['prs','prs'],['kmr','ku'],['ku','ku'],['nl-BE','nl'],['cs-CZ','cs'],['so','so']])assert.equal(device.tagLanguage(tag),language,tag);
 for(const tag of ['sv-SE','ckb','*','','constructor','__proto__','x','toString',null])assert.equal(device.tagLanguage(tag),null,String(tag));
 assert.equal(device.deviceLanguage(['sv-SE','nb','tr-TR','en-US']),'tr','the first language the site has');assert.equal(device.deviceLanguage(['sv-SE']),null);assert.equal(device.deviceLanguage([]),null);
 assert.deepEqual(device.acceptedLanguages('sv-SE,sv;q=0.9,tr;q=0.8,en;q=0.7,*;q=0.5'),['sv-SE','sv','tr','en','*']);
 assert.deepEqual(device.acceptedLanguages('en;q=0.2, tr, de;q=0'),['tr','en'],'by weight; q=0 is left out');assert.deepEqual(device.acceptedLanguages(null),[]);
 // On the server: the cookie, then the browser's languages, then German.
 assert.equal(device.requestLanguage('a=1; goligo-dil=ar; b=2','tr-TR,tr;q=0.9'),'ar','the choice is kept in a cookie for the server pages');
 assert.equal(device.requestLanguage(null,'tr-TR,tr;q=0.9,en;q=0.8'),'tr');assert.equal(device.requestLanguage('lk_session=abc','sv-SE,uk;q=0.5'),'uk');
 assert.equal(device.requestLanguage('goligo-dil=xx','sv'),'de','a strange cookie and a language the site lacks give German');
 assert.equal(device.requestLanguage(null),'de');assert.equal(device.requestLanguage('lk_session=abc'),'de');
 assert.equal(device.languageCookie('uk'),'goligo-dil=uk; Path=/; Max-Age=31536000; SameSite=Lax');
 assert.ok(read('lib/device-language.ts').includes('deviceLanguage(navigator.languages?.length?navigator.languages:[navigator.language])'),'the browser pages read the device languages');
 assert.ok(read('app/page-language.ts').includes("requestLanguage(list.get('cookie'),list.get('accept-language'))"),'the server pages read Accept-Language');
 assert.ok(read('app/api/auth/route.ts').includes("requestLanguage(request.headers.get('cookie'),request.headers.get('accept-language'))"),'the reset email too');
});

test('every page starts in the saved language (German otherwise) and keeps a new choice for the server pages',()=>{
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
 const picker=read('app/public-language.tsx');assert.ok(picker.includes('rememberSiteLanguage(next);window.location.reload();')&&!picker.includes('localStorage'),'only a choice made here changes the page (no account needed)');
 for(const file of ['app/landing.tsx','app/giris/page.tsx','app/uye-ol/page.tsx'])assert.ok(read(file).includes('PublicHeader')||read(file).includes('PublicPage'),file+' has the language picker');
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
   // Only short names may stay the same as in English (for example "Goliqo", "E-Mail" …); every sentence is translated.
   if(tuple[2].length>40)for(const id of ids.filter(id=>id!=='en'))assert.notEqual(site.pickText(tuple,id),tuple[2],name+' '+key+' '+id+' is still English');
  }
  assert.equal(typeof text,'function');
 }
 assert.equal(pub.publicText('de','landingLead',{site:'Goliqo'}).startsWith('Bei Goliqo'),true);
 assert.equal(legal.legalText('tr','updated',{date:'21 Ekim 2026'}),'Son güncelleme: 21 Ekim 2026');
});

test('the legal pages: the Turkish original, a translation note elsewhere, the language cookie explained',()=>{
 const privacy=read('app/privacy-view.tsx'),terms=read('app/terms-view.tsx'),parts=read('app/legal-parts.tsx');
 assert.ok(parts.includes("{language!=='tr'&&<p className=\"lk-legal-note\" data-legal-translation>{text('translationNote')}</p>}"));
 assert.ok(privacy.includes("rich('whatLanguageCookie',{code:()=><code>{LANGUAGE_COOKIE}</code>})")&&privacy.includes('<LegalDate language={language}/>')&&terms.includes('<LegalDate language={language}/>'));
 assert.ok(read('lib/legal-copy.ts').includes("'{b}Dil çerezi:{/b} seçilen site dili {code} adlı bir çerezde saklanır"));
 assert.equal(read('app/legal.tsx').match(/LEGAL_UPDATED='([^']+)'/)[1],'2026-10-22');
 assert.ok(privacy.includes("<li>{rich('whatDeviceLanguage')}</li>"),'the privacy page says the device language is read and nothing is kept');
 // Every legal key is used on a page.
 const used=privacy+terms+parts+read('app/legal.tsx')+read('app/gizlilik/page.tsx')+read('app/kullanim-kosullari/page.tsx')+read('app/impressum/page.tsx');
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
