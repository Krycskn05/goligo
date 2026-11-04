// Fiil Atölyesi in every site language (the learner asked, 4 November 2026: "check that the verbs are translated well in
// all languages"): each of the 72 verbs has its meaning in all 31 languages, in the language's own script, never the same
// for two verbs (the meaning test would show two identical choices), and every example sentence shown after an answer
// has its meaning in every language that reads a translation.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const site=load('site-languages'),workshop=load('verb-workshop'),persons=load('verb-persons');
const packs={};const pack=id=>packs[id]??=JSON.parse(fs.readFileSync('lib/language-packs/'+id+'.json','utf8'));
const SCRIPT={ar:/[؀-ۿ]/,fa:/[؀-ۿ]/,prs:/[؀-ۿ]/,ps:/[؀-ۿ]/,ur:/[؀-ۿ]/,uk:/[Ѐ-ӿ]/,ru:/[Ѐ-ӿ]/,bg:/[Ѐ-ӿ]/,el:/[Ͱ-Ͽ]/,hi:/[ऀ-ॿ]/,ti:/[ሀ-፿]/,zh:/[一-鿿]/,ja:/[぀-ヿ一-鿿]/,ko:/[가-힯]/};
const verbs=workshop.workshopVerbs;
const meaningOf=(verb,id)=>{const index=site.siteLanguageIndex(id);return index<verb.meanings.length?verb.meanings[index]:pack(id)[verb.meanings[2]];};

test('every verb has its own meaning in all 31 languages, in the language\'s script',()=>{
 assert.equal(verbs.length,72);assert.equal(site.siteLanguages.length,31);
 for(const {id} of site.siteLanguages){
  const seen=new Map();
  for(const verb of verbs){
   const text=meaningOf(verb,id);
   assert.ok(text&&text.trim()===text&&!/\s{2,}/.test(text),id+' '+verb.id+': '+text);
   if(id!=='en'&&id!=='de')assert.ok(text!==verb.meanings[2]||!/^[\x20-\x7E]+$/.test(text),id+' '+verb.id+' left in English');
   if(SCRIPT[id])assert.match(text,SCRIPT[id],id+' '+verb.id+': '+text);
   const key=text.toLocaleLowerCase();assert.ok(!seen.has(key),id+': '+seen.get(key)+' and '+verb.id+' both "'+text+'"');seen.set(key,verb.id);
  }
 }
});

test('every example sentence after an answer has its meaning in every language that shows one',()=>{
 const loaders=fs.readFileSync('lib/verb-example-meanings.ts','utf8');
 const files=[...loaders.matchAll(/ (\w+):\(\)=>import\('\.\/verb-examples\.(\w+)\.json'\)/g)].map(m=>m[1]);
 assert.deepEqual(site.siteLanguages.map(l=>l.id).filter(id=>id!=='de'&&!files.includes(id)),[],'German alone needs no meaning line');
 for(const id of files){
  const data=JSON.parse(fs.readFileSync('lib/verb-examples.'+id+'.json','utf8'));
  for(const verb of verbs)for(const [t,tense] of [[0,'praesens'],[1,'perfekt']])for(const row of persons.personSentences(verb,tense)){
   const text=data[verb.id]?.[t]?.[row.index];assert.ok(text&&text.trim(),id+' '+verb.id+' '+tense+' #'+row.index);
   if(SCRIPT[id])assert.match(text,SCRIPT[id],id+' '+verb.id+' '+tense+' #'+row.index);
  }
 }
});
