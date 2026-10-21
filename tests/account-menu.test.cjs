// The account button (the learner asked, 22 October 2026): the sound button's yellow instead of pink, and a tap opens its
// parts underneath, one after another — Hesabım, password, site tour, data, sign out; a visitor gets sign in and sign up.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');

test('the menu opens under the button with the member parts, or sign in and sign up for a visitor',()=>{
 const menu=read('app/account-menu.tsx'),header=read('app/site-header.tsx');
 assert.ok(header.includes('<AccountMenu language={language} guest={guest}/>')&&!header.includes('<a className="site-home site-account"'));
 assert.ok(menu.includes('className="site-home site-account"')&&menu.includes('aria-expanded={open}')&&menu.includes('aria-controls={listId}'),'a real button the tour can still light (.site-account)');
 for(const part of ["href:'/hesabim'","href:'/hesabim#sifre'","href:'/?tur=1'","href:'/api/auth?export=1',download:'goliqo-verilerim.json'","JSON.stringify({action:'logout'})","href:'/giris?return_to='+encodeURIComponent(back)","href:'/uye-ol?return_to='+encodeURIComponent(back)"])assert.ok(menu.includes(part),part);
 assert.ok(menu.includes("event.key==='Escape'")&&menu.includes("addEventListener('pointerdown',outside)"),'Escape and a tap outside close it');
 assert.ok(menu.includes('animationDelay:index*55'),'the parts come one after another');
 assert.ok(read('app/account-panel.tsx').includes('title={texts.changePassword} id="sifre"'),'the password card is the target of /hesabim#sifre');
});

test('the colours follow the sound button, the list is not cut off by the header, motion can be turned off',()=>{
 const css=read('app/koko-theme.css');
 assert.ok(css.includes('.site-header .site-account { background:#fff5d6; border:2px solid #ffd968; box-shadow:0 4px 0 #f5df9c; color:#b77800;'));
 assert.ok(css.includes('.site-header .lk-effects-button { background:#fff5d6; border:2px solid #ffd968; box-shadow:0 4px 0 #f5df9c; color:#b77800; }'),'same as the sound button');
 assert.ok(!/\.site-account \{[^}]*#ffeef3/.test(css),'no pink left');
 assert.ok(css.includes('.site-account-list { position:fixed;')&&css.includes('.site-account-list[hidden] { display:none; }'));
 assert.ok(css.includes('.work-header.logo-header.site-header { position:relative; overflow:hidden; backdrop-filter:none; background:'),'no blur on the header, or the fixed list stays inside it');
 // The minifier keeps only the last of backdrop-filter / -webkit-backdrop-filter in a rule; a prefixed "none" last was lost in Chrome.
 assert.ok(!/\.site-header \{[^}]*backdrop-filter:none;[^}]*-webkit-backdrop-filter/.test(css));
 assert.ok(css.includes('html[data-lernkoko-motion=reduced] .site-account-list li { animation:none; }')&&css.includes('@media (prefers-reduced-motion:reduce) { .site-account-list li { animation:none; } }'));
});

test('every text of the menu in every site language',()=>{
 const header=load('header-copy'),site=load('site-languages');
 for(const [key,tuple] of Object.entries(header.accountMenuCopy)){
  assert.equal(tuple.length,12,key);for(const text of tuple)assert.ok(text.trim(),key);
 }
 for(const language of site.packLanguages.filter(id=>site.siteLanguageIndex(id)>=12)){
  const pack=JSON.parse(read('lib/language-packs/'+language+'.json'));
  for(const [key,tuple] of Object.entries(header.accountMenuCopy))assert.ok(pack[tuple[2]]?.trim(),language+' '+key);
  assert.ok(pack[header.accountLabel[2]]?.trim(),language+' account');
 }
});
