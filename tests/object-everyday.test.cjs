// Yiyecekler, İçecekler ve sofra, Mutfak araçları, Okul ve sınıf, Doğa ve şehir: 152 new objects from the learner's
// eleven 3D picture sheets (22 October 2026). The 20 pictured things the vault already had keep their old cards.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const objects=load('object-course'),practice=load('object-practice'),translations=load('object-translations'),subgroups=load('object-subgroups'),articles=load('article-challenges'),logic=load('article-logic'),copy=load('object-vault-copy'),study=load('study'),english=load('english-objects'),englishCourse=load('english-course'),site=load('site-languages'),course=load('course');
const art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const groups={
 'objects-food':['essen-','groupFood','brezel',55],
 'objects-drinks':['getraenke-','groupDrinks','kaffee',32],
 'objects-cooking':['kueche-','groupCooking','pfanne',22],
 'objects-school':['schule-','groupSchool','tafel',28],
 'objects-outdoors':['draussen-','groupOutdoors','baum',14],
};
const languages=copy.vaultLanguages.map(item=>item.id);
const fresh=objects.objectVocabulary.filter(word=>groups[word.topic]);
// WebP size: lossy VP8 keeps 14-bit sizes at 26/28, extended VP8X keeps (size-1) as 24-bit at 24/27.
function webpSize(file){const b=fs.readFileSync(file);assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');const kind=b.slice(12,16).toString();
 if(kind==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];if(kind==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];throw Error(file+' '+kind);}

test('five new categories with 151 objects, plus der Zahn in Vücut; the pictured things the vault had stay where they were',()=>{
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 for(const [topic,[,key,picture,count]] of Object.entries(groups)){
  assert(objects.objectGroups.some(group=>group.id===topic),topic);
  assert.equal(objects.objectVocabulary.filter(word=>word.topic===topic).length,count,topic);
  for(const language of languages)assert(copy.vaultText(language,key).trim(),key+' '+language);
  assert(page.includes("'"+topic+"':'"+key+"'")&&page.includes("'"+topic+"':'"+picture+"'"),topic);
  assert(englishCourse.englishTopics.some(item=>item.id==='en-'+topic),topic+' in the English course');
 }
 assert.equal(fresh.length,151);assert.equal(objects.objectWordMap.get('zahn').de,'der Zahn');assert.equal(objects.objectWordMap.get('zahn').topic,'objects-body');
 assert.equal(new Set(objects.objectVocabulary.map(word=>word.id)).size,objects.objectVocabulary.length,'no duplicate object IDs');
 for(const [id,topic] of Object.entries({tasse:'objects-kitchen',teller:'objects-kitchen',teekanne:'objects-kitchen',flasche:'objects-kitchen',tischdecke:'objects-kitchen',apfel:'objects-kitchen',tisch:'objects-furniture',stuhl:'objects-furniture',lampe:'objects-furniture',bild:'objects-furniture',fenster:'objects-house',steckdose:'objects-house',fisch:'objects-nature',eimer:'objects-tools',schere:'objects-health',verband:'objects-health',hand:'objects-body',fuss:'objects-body'}))
  assert.equal(objects.objectWordMap.get(id).topic,topic,id+' keeps its category');
 const de=id=>objects.objectWordMap.get(id).de;
 // The learner's own list (22 October 2026) gives the German names and Turkish meanings; the IDs stay as they were.
 const tr=id=>objects.objectWordMap.get(id).tr;
 for(const [id,name] of Object.entries({decke:'die Decke',bank:'die Bank',nudeln:'die Nudeln',oel:'das Öl',weisswein:'der Weißwein',wuerfelzucker:'der Zuckerwürfel',bratwurst:'die Wurst',sardine:'die Fischkonserve',sosse:'die Sauce',pommes:'die Pommes frites',traube:'die Weintraube',apfelsaft:'der Saft',krug:'die Kanne',sossenschuessel:'die Sauciere',mixer:'das Handrührgerät',milchtuete:'die Packung',ecke:'die Wand',schwamm:'der Tafelschwamm',buntstift:'der Stiftebecher',papierkorb:'der Mülleimer'}))assert.equal(de(id),name,id);
 assert.equal(tr('brezel'),'Alman simidi / pretzel');assert.equal(tr('buntstift'),'kalemlik');assert.equal(tr('schuelerin'),'kız / kadın öğrenci');assert.equal(tr('ecke'),'duvar');
});

test('every new object has its own 512 px picture, meanings in all 31 site languages, a description and one sub-topic',()=>{
 for(const word of [...fresh,objects.objectWordMap.get('zahn')]){
  const prefix=word.id==='zahn'?'koerper-':groups[word.topic][0];
  assert.equal(word.image,'/objects/toon/'+prefix+word.id+'.webp');
  assert.deepEqual(art[word.id],{src:word.image,width:512,height:512,crop:{x:0,y:0,width:512,height:512}},word.id);
  assert.deepEqual(webpSize(path.join('public',word.image)),[512,512],word.id);
  for(const language of languages)assert(translations.objectMeaning(word.id,language).trim(),word.id+' '+language);
  assert(word.description.length>20&&word.descriptionTr.length>15,word.id);
  // A description never names its own word (it is a quiz: "which object does this text describe?").
  const noun=word.de.split(' ').slice(1).join(' ');assert(!new RegExp('(^|[^\\p{L}])'+noun+(noun.length>=4?'':'($|[^\\p{L}])'),'iu').test(word.description),word.id);
  const homes=subgroups.objectSubgroups.filter(group=>group.wordIds.includes(word.id));assert.equal(homes.length,1,word.id);assert.equal(homes[0].parent,word.topic,word.id);
  assert(english.englishObjectName(word.id),word.id+' English name');
 }
 // The other 19 site languages read meanings and names from their language pack, by the English text.
 const texts=[...fresh.map(word=>translations.objectMeanings[word.id][0]),...Object.values(groups).map(([,key])=>copy.vaultText('en',key)),
  ...subgroups.objectSubgroups.filter(group=>groups[group.parent]).map(group=>subgroups.subgroupName(group,'en')),logic.puzzleCopy.diminutive[2]];
 for(const id of site.packLanguages){
  const pack=JSON.parse(fs.readFileSync(`lib/language-packs/${id}.json`,'utf8'));
  for(const text of texts)assert(typeof pack[text]==='string'&&pack[text].trim(),id+': '+text);
 }
 // English names are all different, so four English choices never repeat a word.
 const names=objects.objectVocabulary.map(word=>english.englishObjectName(word.id));assert.equal(new Set(names).size,names.length);
});

test('the new objects work in Gör ve Seç, Yazarak Pekiştir and Dinle ve Bul, with choices from their own category',()=>{
 for(const topic of Object.keys(groups)){
  const ids=fresh.filter(word=>word.topic===topic).map(word=>word.id);
  const picture=practice.pickPictureQuiz(topic,'all',[]);const listening=practice.pickObjectListeningQuiz(topic,'all',[]);
  assert.equal(picture.length,ids.length,topic);assert.equal(listening.length,ids.length,topic);
  assert(picture.every(q=>ids.includes(q.objectId)&&q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)),topic);
  assert(listening.every(q=>new Set(q.pictureOptions).size===4&&q.pictureOptions.every(id=>ids.includes(id))),topic+' pictures from the same category');
  assert(practice.pickObjectWritingQuiz(topic,'all',[]).length>=ids.length*2,topic);
  const round=picture.map(q=>q.id);
  assert.deepEqual(new Set(study.selectQuestions('visual',topic,round.length,[],round).map(q=>q.id)),new Set(round),topic+' server round');
 }
 // Pictures that look alike are never offered together: red wine, white wine and wine; a spoon and a teaspoon.
 const choices=id=>course.questionMap.get('obj-picture-'+id).options;
 for(const [id,others] of Object.entries({wein:['der Rotwein','der Weißwein'],rotwein:['der Wein','der Weißwein'],loeffel:['der Teelöffel'],nudeln:['die Spaghetti'],buch:['das Heft','das Wörterbuch'],gemuese:['die Karotte','die Gurke','die Erbse'],schueler:['die Schülerin']}))
  for(const other of others)assert(!choices(id).includes(other),id+' / '+other);
});

test('articles: plurals, compound words, -chen words and the plural-only words',()=>{
 assert.equal(articles.pluralNouns.glas,'Gläser');assert.equal(articles.pluralNouns.nuss,'Nüsse');assert.equal(articles.pluralNouns.baum,'Bäume');assert.equal(articles.pluralNouns.zahn,'Zähne');
 for(const id of ['butter','milch','reis','nudeln','pommes','gras','kaffee'])assert.equal(articles.pluralNouns[id],undefined,id);
 assert.equal(articles.compoundHeads.weinglas,'das Glas');assert.equal(articles.compoundHeads.teeloeffel,'der Löffel');assert.equal(articles.compoundHeads.kronkorken,'der Korken');
 for(const [id,head] of Object.entries(articles.compoundHeads)){const word=objects.objectWordMap.get(id);if(word)assert.equal(word.de.split(' ')[0],head.split(' ')[0],id);}
 const rule=id=>logic.articleRule(id,objects.objectWordMap.get(id).de);
 for(const id of ['broetchen','wuerstchen','haehnchen'])assert.equal(rule(id).key,'diminutive',id);
 assert.equal(rule('milchkaennchen').key,'compound');
 assert.equal(rule('mixer').key,'compound');assert.equal(rule('milchtuete').key,'suffix');
 for(const id of ['nudeln','spaghetti','pommes']){const r=rule(id);assert.equal(r.key,'plural',id);assert.equal(r.x,objects.objectWordMap.get(id).de);assert(!course.questionMap.get('obj-puzzle-plural-'+id),id+' has no plural puzzle');}
 assert.equal(rule('essig').key,'masculineEnding');assert.equal(rule('schmetterling').key,'masculineEnding');assert.equal(rule('kotelett').key,'neuterEnding');
 for(const language of languages)assert(logic.articleRuleText(language,rule('broetchen')).includes('das Brötchen'),language);
});

test('English course: plural pictures say "These are", food and drinks without a/an',()=>{
 const gap=id=>english.englishObjectQuestions.find(q=>q.id==='en-obj-gap-'+id).gap;
 assert.equal(gap('kirsche'),'These are ___.');assert.equal(gap('traube'),'These are ___.');assert.equal(gap('pommes'),'These are ___.');
 assert.equal(gap('milch'),'This is ___.');assert.equal(gap('brot'),'This is ___.');
 assert.equal(gap('ei'),'This is an ___.');assert.equal(gap('tafel'),'This is a ___.');
 assert.equal(english.englishObjectName('decke'),'ceiling');assert.equal(english.englishObjectName('bank'),'bench');assert.equal(english.englishObjectName('kirsche'),'cherries');
});
