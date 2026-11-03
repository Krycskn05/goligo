// Kelime Kasası without the "Tüm kelimeler" card, its categories under a few headings (lib/vault-sections.ts; the
// learner asked, 3 November 2026). Only the page's order changes: category ids, words and progress stay as they are.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');
const sections=load('vault-sections'),objects=load('object-course'),words=load('object-word-additions'),site=load('site-languages'),parts=load('guest-parts');

test('every category is under exactly one heading, in a sensible place',()=>{
 const placed=sections.vaultSections.flatMap(section=>section.groups);
 assert.equal(new Set(placed).size,placed.length,'no category twice');
 assert.deepEqual([...placed].sort(),objects.objectGroups.map(group=>group.id).sort(),'every category');
 const where=id=>sections.vaultSections.find(section=>section.groups.includes(id)).id;
 assert.equal(where('objects-clothes'),'people');assert.equal(where('objects-food'),'food');assert.equal(where('objects-jobs'),'work');
 // The guest's open category is the first card of the page.
 assert.equal(sections.vaultSections[0].groups[0],parts.GUEST_OBJECT_GROUP);
 // The English course has no lesson words: their heading is left out, nothing is lost.
 const english=objects.objectGroups.map(group=>group.id).filter(id=>!words.WORD_TOPICS.includes(id));
 const {list,rest}=sections.sectionsFor(english);
 assert.deepEqual(rest,[]);assert.ok(!list.some(item=>item.section.id==='lessons'));
 assert.deepEqual(list.flatMap(item=>item.groups).sort(),[...english].sort());
});

test('the page: no "Tüm kelimeler" card, a heading per section',()=>{
 const page=read('app/object-study.tsx');
 assert.ok(!page.includes("categoryCard('all'")&&!page.includes('vault-feature-grid'),'no all-words card');
 for(const piece of ['sectionsFor(shown)','data-vault-section={section.id}','{sectionTitle(section,language)}'])assert.ok(page.includes(piece),piece);
 assert.ok(read('app/globals.css').includes('.vault-section .vault-category-grid'));
});

test('the headings in every site language',()=>{
 for(const section of sections.vaultSections){
  assert.equal(section.title.length,12,section.id);
  for(const {id} of site.siteLanguages){
   const index=site.siteLanguageIndex(id);
   const text=index<section.title.length?section.title[index]:JSON.parse(read('lib/language-packs/'+id+'.json'))[section.title[2]];
   assert.ok(text?.trim(),section.id+' '+id);
  }
 }
});
