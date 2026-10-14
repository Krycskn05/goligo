const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');

test('the Ev ve Yaşam page shows no intro sentence, page numbers or A1–D3 step lists',()=>{
 const source=fs.readFileSync('app/housing-study.tsx','utf8');
 assert(!source.includes("h('intro')"),'hero intro sentence removed');
 assert(!source.includes("h('pages'"),'textbook page numbers removed');
 assert(!source.includes('housing-step-list'),'step buttons removed from the section cards');
 assert(source.includes('className="housing-card-open"')&&source.includes('className="housing-card-bottom"'),'each A–D card still opens its section');
});
