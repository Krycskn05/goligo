// The phone header in one thin row (the learner chose draft 1 of five, 29 October 2026): logo, the clock with the day
// and the part of the day, the site language as a round button with its short code, and the round buttons.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

/** The body of the first @media block that starts with the given text. */
function block(css,start){
 const at=css.indexOf(start);assert.ok(at>=0,start);
 let depth=0;for(let i=css.indexOf('{',at);i<css.length;i++){if(css[i]==='{')depth++;else if(css[i]==='}'&&--depth===0)return css.slice(at,i+1);}
 throw new Error('unclosed '+start);
}

test('the site language shows its short code (hidden on wide screens)',()=>{
 const header=read('app/site-header.tsx'),css=read('app/koko-theme.css');
 assert.ok(header.includes('<span className="site-language-code" aria-hidden="true">{language.toUpperCase()}</span>'));
 assert.ok(header.includes('<select value={language} aria-label={label}'),'the select keeps its name for screen readers');
 assert.ok(css.includes('.site-language-code { display:none; }'));
});

test('phones: one row, the select lies over the round language button',()=>{
 const css=read('app/koko-theme.css');
 const phone=block(css,'@media (max-width:760px) {\n /* Phones: one thin row');
 assert.ok(phone.includes('.toon-app .work-header.site-header,.work-header.logo-header.site-header { display:flex; flex-wrap:nowrap;'));
 assert.ok(!phone.includes('"bubble bubble"'),'no clock row of its own any more');
 assert.ok(/\.site-header:not\(\.lk-public-header\) \.site-language \{[^}]*width:40px; height:40px;[^}]*border-radius:50%/.test(phone));
 assert.ok(/\.site-header:not\(\.lk-public-header\) \.site-language select \{[^}]*position:absolute; inset:0;[^}]*opacity:0;/.test(phone));
 assert.ok(phone.includes('.site-header:not(.lk-public-header) .site-language:focus-within { outline:3px solid'),'keyboard focus stays visible');
 assert.ok(phone.includes('.site-header .site-greeting { flex:none; margin-inline:auto;'),'the clock sits in the middle');
 assert.ok(phone.includes('.site-header .site-greeting-day .sg-day-icon { display:none; }'));
 // The visitor pages keep their own two rows.
 assert.ok(phone.includes('.work-header.logo-header.site-header.lk-public-header { display:grid; grid-template-columns:auto minmax(0,1fr); grid-template-areas:"logo lang" "buttons buttons";'));
});

test('narrow phones: smaller, the home button and then the clock face step aside',()=>{
 const css=read('app/koko-theme.css');
 assert.ok(block(css,'@media (max-width:480px) {').includes('.site-header:not(.lk-public-header) .site-header-buttons > .object-back { display:none; }'));
 assert.ok(block(css,'@media (max-width:480px) {').includes('.toon-app:has(.object-question) .site-header .site-header-buttons > .object-back { display:inline-flex; }'),'during a test there is room');
 assert.ok(block(css,'@media (max-width:440px) {\n .site-header .site-greeting-button { gap:6px; }').includes('.analog-clock { width:30px; height:30px; }'));
 assert.ok(block(css,'@media (max-width:380px) {\n .site-header .site-greeting-button .analog-clock { display:none; }').includes('.site-greeting-waiting { width:76px; }'));
});
