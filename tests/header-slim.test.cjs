// The thin header "Tek satır şerit" (the learner chose option B of three drafts, 29 October 2026): one row on every
// width, about 57 px on a computer (was 113 px) and 46 px on phones. The visitor pages keep their own header.
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

test('computers and tablets: one thin row with the day in a small capsule',()=>{
 const css=read('app/koko-theme.css');
 const wide=block(css,'@media (min-width:761px) {\n .toon-app .work-header.site-header:not(.lk-public-header)');
 assert.ok(wide.includes('{ display:flex; flex-wrap:nowrap; align-items:center; gap:14px; padding:5px 12px 5px 18px; border-radius:999px; }'),'one row, no second row on tablets');
 assert.ok(wide.includes('.site-header:not(.lk-public-header) .site-logo-brand { flex:none; width:122px; min-width:0; }'));
 assert.ok(wide.includes('.site-greeting { margin-inline:auto; padding:3px 16px 3px 3px; background:rgba(255,255,255,.62);'),'the clock and the day in a white capsule');
 assert.ok(wide.includes('.site-greeting-words { display:flex; align-items:center; gap:8px; white-space:nowrap; }'),'the day and the part of the day in one line');
 assert.ok(wide.includes('.site-greeting-button .analog-clock { width:32px; height:32px; filter:none; }'));
 assert.ok(wide.includes('.site-language-label { display:none; }'),'no "Site dili" label, the globe says it');
 assert.ok(wide.includes('.lk-effects-button { width:36px; height:36px; min-height:36px;'));
 // The test header (logo and buttons only) still wins during a question: it comes later in the file.
 assert.ok(css.indexOf('Header "Tek satır şerit"')<css.indexOf('.toon-app:has(.object-question) .work-header.site-header { display:flex;'));
});

test('small tablets show the language as the round TR button so long names still fit',()=>{
 const css=read('app/koko-theme.css');
 const small=block(css,'@media (min-width:761px) and (max-width:959px) {\n .site-header:not(.lk-public-header) .site-language {');
 assert.ok(/\.site-language select \{[^}]*position:absolute; inset:0;[^}]*opacity:0;/.test(small),'the native list still opens');
 assert.ok(small.includes('.site-language:focus-within { outline:3px solid'),'keyboard focus stays visible');
 assert.ok(small.includes('.site-language-code { display:block;'));
});

test('phones: the same row, a little thinner',()=>{
 const css=read('app/koko-theme.css');
 const phone=block(css,'@media (max-width:760px) {\n .toon-app .work-header.site-header:not(.lk-public-header),.work-header.logo-header.site-header:not(.lk-public-header) { padding:5px 8px 5px 10px; }');
 assert.ok(phone.includes('.site-greeting-button .analog-clock { width:24px; height:24px; filter:none; }'));
 assert.ok(phone.includes('.site-language { width:34px; height:34px; min-height:34px; border-width:1.5px; }'));
 assert.ok(!/\.lk-public-header(?!\))/.test(phone),'the visitor header is left alone');
});
