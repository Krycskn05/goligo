// Kelime Kasası: Meslekler (24 jobs, woman and man on separate cards) and the words of Lektion 1, from the learner's
// 19 picture sheets (2 November 2026). Lektion 1 phrases have no article: no article questions and no article games.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const objects=load('object-course'),translations=load('object-translations'),subgroups=load('object-subgroups'),logic=load('article-logic'),copy=load('object-vault-copy'),english=load('english-objects'),site=load('site-languages'),course=load('course'),games=load('object-games'),articles=load('article-challenges');
const art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const groups={'objects-jobs':['groupJobs','beruf-aerztin',48],'objects-lektion1':['groupLektion1','l1-hallo',66]};
const languages=copy.vaultLanguages.map(item=>item.id);
const fresh=objects.objectVocabulary.filter(word=>groups[word.topic]);
function webpSize(file){const b=fs.readFileSync(file);assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');const kind=b.slice(12,16).toString();
 if(kind==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];if(kind==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];throw Error(file+' '+kind);}

test('two new groups: 48 job cards and 66 Lektion 1 cards, named in every site language, with a cover picture',()=>{
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 for(const [topic,[key,picture,count]] of Object.entries(groups)){
  assert.equal(objects.objectVocabulary.filter(word=>word.topic===topic).length,count,topic);
  for(const language of languages)assert(copy.vaultText(language,key).trim(),key+' '+language);
  assert(page.includes("'"+topic+"':'"+key+"'")&&page.includes("'"+topic+"':'"+picture+"'"),topic);
 }
 assert.equal(objects.objectWordMap.get('beruf-aerztin').de,'die Ärztin');assert.equal(objects.objectWordMap.get('beruf-arzt').de,'der Arzt');
 assert.equal(objects.objectWordMap.get('l1-guten-tag').de,'Guten Tag!');
 assert(fresh.every(word=>/^(beruf|l1)-/.test(word.id)),'prefixed IDs never meet older ones');
 assert.equal(new Set(objects.objectVocabulary.map(word=>word.id)).size,objects.objectVocabulary.length);
});

test('every new card has its own 512 px picture, meanings in all 31 languages, a description and one sub-topic',()=>{
 for(const word of fresh){
  assert.equal(word.image,'/objects/toon/'+word.id+'.webp');
  assert.deepEqual(art[word.id],{src:word.image,width:512,height:512,crop:{x:0,y:0,width:512,height:512}},word.id);
  assert.deepEqual(webpSize(path.join('public',word.image)),[512,512],word.id);
  for(const language of languages)assert(translations.objectMeaning(word.id,language).trim(),word.id+' '+language);
  assert(word.description.length>20&&word.descriptionTr.length>15&&!word.description.includes('___'),word.id);
  if(!word.phrase){const noun=word.de.split(' ').slice(1).join(' ');assert(!new RegExp('(^|[^\\p{L}])'+noun+'($|[^\\p{L}])','iu').test(word.description),word.id);}
  const homes=subgroups.objectSubgroups.filter(group=>group.wordIds.includes(word.id));assert.equal(homes.length,1,word.id);assert.equal(homes[0].parent,word.topic,word.id);
 }
 const texts=[...fresh.map(word=>translations.objectMeanings[word.id][0]),...Object.values(groups).map(([key])=>copy.vaultText('en',key)),
  ...subgroups.objectSubgroups.filter(group=>groups[group.parent]).map(group=>subgroups.subgroupName(group,'en')),logic.puzzleCopy.personIn[2],logic.puzzleCopy.personMale[2]];
 for(const id of site.packLanguages){
  const pack=JSON.parse(fs.readFileSync(`lib/language-packs/${id}.json`,'utf8'));
  for(const text of texts)assert(typeof pack[text]==='string'&&pack[text].trim(),id+': '+text);
 }
});

test('Lektion 1 phrases have no article questions and stay out of the article games; nouns and jobs are in',()=>{
 const phrases=fresh.filter(word=>word.phrase);assert.equal(phrases.length,59);
 for(const word of phrases){
  assert(!/^(der|die|das) /.test(word.de),word.id);
  assert(!course.questionMap.get('obj-article-'+word.id)&&!course.questionMap.get('obj-gap-'+word.id),word.id+' no article question');
  for(const kind of ['picture','write','hear-picture','dictation'])assert(course.questionMap.get('obj-'+kind+'-'+word.id),kind+' '+word.id);
  assert(!games.gameObject(word.id),word.id+' not in the games');
 }
 for(const id of ['l1-sprache','l1-name','l1-land','l1-wohnung','beruf-aerztin','beruf-arzt'])assert(games.gameObject(id),id+' in the games');
 assert.equal(articles.pluralNouns['beruf-aerztin'],'Ärztinnen');assert.equal(articles.pluralNouns['l1-sprache'],'Sprachen');
 // Pictures that tell nearly the same thing are never offered together.
 const options=id=>course.questionMap.get('obj-picture-'+id).options;
 assert(!options('l1-ich').includes('ich bin')&&!options('l1-ja').includes('richtig')&&!options('l1-nein').includes('nicht'));
});

test('jobs get the -in rule: the woman takes die, the man takes der with the woman\'s form next to it',()=>{
 const rule=id=>logic.articleRule(id,objects.objectWordMap.get(id).de);
 assert.deepEqual(rule('beruf-aerztin'),{key:'personIn',x:'die Ärztin'});
 assert.deepEqual(rule('beruf-arzt'),{key:'personMale',x:'der Arzt · die Ärztin'});
 assert.equal(rule('beruf-zahnaerztin').key,'personIn');assert.equal(rule('beruf-busfahrer').key,'personMale');
 for(const language of languages)assert(logic.articleRuleText(language,rule('beruf-arzt')).includes('der Arzt · die Ärztin'),language);
});

test('the English course keeps its own objects (the new groups are German only)',()=>{
 assert(!english.englishObjectQuestions.some(q=>/^en-obj-[a-z-]+-(beruf|l1)-/.test(q.id)));
 assert(fs.readFileSync('app/object-study.tsx','utf8').includes("course==='de'||!(WORD_TOPICS as readonly string[]).includes(item.id)"));
});
