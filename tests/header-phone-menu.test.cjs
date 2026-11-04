// The phone header (the learner asked, 4 November 2026): the site language and the sounds go into the menu of the
// right-hand button so the header has room; the calendar, the day and the clock stand in the middle. Only on phones.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');
test('on phones the language and the sounds are lines of the account menu; the clock stands in the middle',()=>{
 const menu=read('app/account-menu.tsx');const header=read('app/site-header.tsx');const css=read('app/koko-theme.css');
 assert.ok(header.includes('<AccountMenu language={language} guest={guest} languages={languages} onLanguage={onLanguage} languageLabel={label}/>'));
 assert.ok(menu.includes('<li className="site-account-phone" data-account-item="language">')&&menu.includes('onChange={event=>{setOpen(false);onLanguage(event.target.value);}}'),'the language line');
 assert.ok(menu.includes('<li className="site-account-phone" data-account-item="sounds">')&&menu.includes('window.dispatchEvent(new Event(OPEN_EFFECTS))'),'the sounds line opens the same window as the header button');
 assert.ok(read('app/learning-effects.tsx').includes("export const OPEN_EFFECTS='lernkoko-open-effects';"));
 const phone=css.slice(css.lastIndexOf('/* Phones (the learner asked, 4 November 2026): the site language and the sounds'));
 assert.ok(phone.startsWith('/* Phones')&&phone.includes('.site-account-list .site-account-phone { display:none; }'),'hidden on bigger screens');
 for(const rule of ['.site-account-list .site-account-phone { display:block; }','.site-header:not(.lk-public-header) .lk-effects-button { display:none; }','grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);','.site-header:not(.lk-public-header) .site-greeting { justify-self:center; margin-inline:0; }'])assert.ok(phone.includes(rule),rule);
 assert.ok(phone.includes('@media (max-width:380px) { .site-header:not(.lk-public-header) .site-greeting-button .analog-clock { display:block;'),'the clock face on narrow phones too');
});
