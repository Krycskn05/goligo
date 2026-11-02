// Kelime Kasası: Kıyafetler (Kleidung), from the learner's 50 transparent clothing pictures (2 November 2026).
// 49 cards are new (kleidung- IDs); der Rock was already in the vault and only moved into this group.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const objects=load('object-course'),translations=load('object-translations'),subgroups=load('object-subgroups'),logic=load('article-logic'),copy=load('object-vault-copy'),english=load('english-objects'),englishCourse=load('english-course'),site=load('site-languages'),course=load('course'),articles=load('article-challenges');
const art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const languages=copy.vaultLanguages.map(item=>item.id);
const clothes=objects.objectVocabulary.filter(word=>word.topic==='objects-clothes');
const fresh=clothes.filter(word=>word.id!=='rock');
function webpSize(file){const b=fs.readFileSync(file);assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');const kind=b.slice(12,16).toString();
 if(kind==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];if(kind==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];throw Error(file+' '+kind);}

test('Kıyafetler has 50 cards: 49 new ones and der Rock with its old card, named in every site language, with a cover picture',()=>{
 assert.equal(clothes.length,50);assert.equal(fresh.length,49);
 assert(fresh.every(word=>word.id.startsWith('kleidung-')),'prefixed IDs never meet older ones');
 assert.equal(objects.objectWordMap.get('rock').image,'/objects/toon/draussen-rock.webp');
 assert(course.questionMap.get('obj-picture-rock'),'der Rock keeps its question IDs');
 assert.equal(objects.objectWordMap.get('kleidung-kurze-hose').de,'die kurze Hose');assert.equal(objects.objectWordMap.get('kleidung-tshirt').de,'das T-Shirt');
 for(const language of languages)assert(copy.vaultText(language,'groupClothes').trim(),language);
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 assert(page.includes("'objects-clothes':'groupClothes'")&&page.includes("'objects-clothes':'kleidung-tshirt'"));
 assert.equal(new Set(objects.objectVocabulary.map(word=>word.id)).size,objects.objectVocabulary.length);
});

test('every new card has its own 512 px picture, meanings in all languages, a description without its own name and one sub-topic',()=>{
 for(const word of fresh){
  assert.equal(word.image,'/objects/toon/'+word.id+'.webp');
  assert.deepEqual(art[word.id],{src:word.image,width:512,height:512,crop:{x:0,y:0,width:512,height:512}},word.id);
  assert.deepEqual(webpSize(path.join('public',word.image)),[512,512],word.id);
  for(const language of languages)assert(translations.objectMeaning(word.id,language).trim(),word.id+' '+language);
  assert(word.description.length>20&&word.descriptionTr.length>15&&!word.description.includes('___'),word.id);
  const noun=word.de.split(' ').slice(1).join(' ');assert(!new RegExp('(^|[^\\p{L}])'+noun+'($|[^\\p{L}])','iu').test(word.description),word.id);
 }
 for(const word of clothes){const homes=subgroups.objectSubgroups.filter(group=>group.wordIds.includes(word.id));assert.equal(homes.length,1,word.id);assert.equal(homes[0].parent,'objects-clothes',word.id);}
 const texts=[...fresh.map(word=>translations.objectMeanings[word.id][0]),copy.vaultText('en','groupClothes'),
  ...subgroups.objectSubgroups.filter(group=>group.parent==='objects-clothes').map(group=>subgroups.subgroupName(group,'en'))];
 for(const id of site.packLanguages){
  const pack=JSON.parse(fs.readFileSync(`lib/language-packs/${id}.json`,'utf8'));
  for(const text of texts)assert(typeof pack[text]==='string'&&pack[text].trim(),id+': '+text);
 }
});

test('clothes that look alike are never offered together, and wrong choices come from the clothes',()=>{
 const options=id=>course.questionMap.get('obj-picture-'+id).options;
 const de=id=>objects.objectWordMap.get(id).de;
 for(const [id,others] of [['kleidung-schuh',['kleidung-turnschuh','kleidung-hausschuh','kleidung-stiefel']],['kleidung-socke',['kleidung-strumpf']],['kleidung-hose',['kleidung-jeans','kleidung-jogginghose']],
  ['kleidung-unterhose',['kleidung-slip']],['kleidung-damenhut',['kleidung-herrenhut']],['kleidung-jacke',['kleidung-winterjacke','kleidung-lederjacke']]])
  for(const other of others){assert(!options(id).includes(de(other)),id+' / '+other);assert(!options(other).includes(de(id)),other+' / '+id);}
 const names=new Set(clothes.map(word=>word.de));
 for(const word of clothes)assert(options(word.id).every(option=>names.has(option)),word.id);
});

test('plurals and article rules: compounds take the last part, die Leggings is plural only',()=>{
 assert.equal(articles.pluralNouns['kleidung-mantel'],'Mäntel');assert.equal(articles.pluralNouns['kleidung-kurze-hose'],'kurzen Hosen');assert.equal(articles.pluralNouns.rock,'Röcke');
 assert(!articles.pluralNouns['kleidung-jeans']&&!articles.pluralNouns['kleidung-leggings']);
 const rule=id=>logic.articleRule(id,objects.objectWordMap.get(id).de);
 assert.deepEqual(rule('kleidung-lederjacke'),{key:'compound',x:'die Jacke → die Lederjacke'});
 assert.deepEqual(rule('kleidung-handschuh'),{key:'compound',x:'der Schuh → der Handschuh'});
 assert.deepEqual(rule('kleidung-nachthemd'),{key:'compound',x:'das Hemd → das Nachthemd'});
 assert.deepEqual(rule('kleidung-leggings'),{key:'plural',x:'die Leggings'});
});

test('the English course has the clothes too, with plural names in "These are ___."',()=>{
 assert(englishCourse.englishTopics.some(item=>item.id==='en-objects-clothes'));
 assert.equal(english.englishObjectListeningPool('objects-clothes').length,50);
 const gap=id=>english.englishObjectQuestions.find(q=>q.id==='en-obj-gap-'+id).gap;
 assert.equal(gap('kleidung-hose'),'These are ___.');assert.equal(gap('kleidung-jeans'),'These are ___.');
 assert.equal(gap('kleidung-schal'),'This is a ___.');assert.equal(gap('kleidung-anzug'),'This is a ___.');
 assert.equal(english.englishObjectName('kleidung-hose'),'trousers');
});
