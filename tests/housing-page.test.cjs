const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');

test('the Ev ve Yaşam page shows no intro sentence, page numbers or A1–D3 step lists',()=>{
 const source=fs.readFileSync('app/housing-study.tsx','utf8');
 assert(!source.includes("h('intro')"),'hero intro sentence removed');
 assert(!source.includes("h('pages'"),'textbook page numbers removed');
 assert(!source.includes('housing-step-list'),'step buttons removed from the section cards');
 assert(source.includes("{opener(item.id,'housing-card-open',<>")&&source.includes('className="housing-card-bottom" disabled={busy} onClick={()=>choose(item.id)}'),'each A–D card still opens its section');
});

test('practice setup pages show no sub-topic, length or back-to-notes controls and the home hero has no hint line',()=>{
 const housing=fs.readFileSync('app/housing-study.tsx','utf8');
 assert(!housing.includes('housing-return-lesson'),'Ders notlarına geri dön removed');
 assert(!housing.includes("h('steps')")&&!housing.includes("h('length')"),'sub-heading and length selects removed');
 assert(!housing.includes('className="object-controls"'));
 const vault=fs.readFileSync('app/object-study.tsx','utf8');
 assert(!vault.includes('vault-subtopics')&&!vault.includes('data-vault-subtopic'),'sub-topic buttons removed');
 assert(!vault.includes("'testLength'")&&!vault.includes('className="object-controls"'),'test length select removed');
 const home=fs.readFileSync('app/category-study.tsx','utf8');
 assert(!home.includes("c(language,'catalogHint')"),'hero hint line removed');
});
