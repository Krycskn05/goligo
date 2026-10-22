// Vücut ve Sağlık: öğrencinin gönderdiği iki resim sayfasından 36 yeni nesne, Nesne Kasası'nda iki yeni kategori.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const objects=load('object-course'),practice=load('object-practice'),translations=load('object-translations'),subgroups=load('object-subgroups'),articles=load('article-challenges'),copy=load('object-vault-copy'),study=load('study'),english=load('english-objects'),site=load('site-languages');
const art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const body={arm:'der Arm',auge:'das Auge',bauch:'der Bauch',bein:'das Bein',brust:'die Brust',daumen:'der Daumen',finger:'der Finger',fuss:'der Fuß',ellbogen:'der Ellbogen',haar:'das Haar',hals:'der Hals',hand:'die Hand',knie:'das Knie',kopf:'der Kopf',mund:'der Mund',nase:'die Nase',ohr:'das Ohr',schulter:'die Schulter',zeh:'der Zeh',koerper:'der Körper',zahn:'der Zahn'};
const health={verband:'der Verband',pflaster:'das Pflaster',verbandskasten:'der Verbandskasten',waermflasche:'die Wärmflasche',salbe:'die Salbe',hustensaft:'der Hustensaft',tablette:'die Tablette',kapsel:'die Kapsel',schere:'die Schere',fieberthermometer:'das Fieberthermometer',spritze:'die Spritze',stethoskop:'das Stethoskop',rollstuhl:'der Rollstuhl',trage:'die Trage',kruecke:'die Krücke',gips:'der Gips'};
const groups={'objects-body':[body,'koerper-','groupBody','hand'],'objects-health':[health,'gesundheit-','groupHealth','verbandskasten']};
const languages=copy.vaultLanguages.map(item=>item.id);
// WebP size: lossy VP8 keeps 14-bit sizes at 26/28, extended VP8X keeps (size-1) as 24-bit at 24/27.
function webpSize(file){const b=fs.readFileSync(file);assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');const kind=b.slice(12,16).toString();
 if(kind==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];if(kind==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];throw Error(file+' '+kind);}

test('two new categories: 21 body parts (Vücut, with der Zahn from the 3D sheets) and 16 health things (Sağlık ve ilk yardım)',()=>{
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 for(const [topic,[words,,key,picture]] of Object.entries(groups)){
  assert(objects.objectGroups.some(group=>group.id===topic),topic);
  for(const [id,de] of Object.entries(words)){const word=objects.objectWordMap.get(id);assert.equal(word.de,de,id);assert.equal(word.topic,topic,id);}
  assert.equal(objects.objectVocabulary.filter(word=>word.topic===topic).length,Object.keys(words).length,topic);
  for(const language of languages)assert(copy.vaultText(language,key).trim(),key+' '+language);
  assert(page.includes("'"+topic+"':'"+key+"'")&&page.includes("'"+topic+"':'"+picture+"'"),topic);
 }
 assert.equal(new Set(objects.objectVocabulary.map(word=>word.id)).size,objects.objectVocabulary.length,'no duplicate object IDs');
});

test('every new object has its own 512 px picture, meanings in all 31 site languages, a description and a sub-topic',async()=>{
 for(const [topic,[words,prefix]] of Object.entries(groups))for(const id of Object.keys(words)){
  const word=objects.objectWordMap.get(id);assert.equal(word.image,'/objects/toon/'+prefix+id+'.webp');
  assert.deepEqual(art[id],{src:word.image,width:512,height:512,crop:{x:0,y:0,width:512,height:512}},id);
  assert.deepEqual(webpSize(path.join('public',word.image)),[512,512],id);
  for(const language of languages)assert(translations.objectMeaning(id,language).trim(),id+' '+language);
  assert(word.description.length>20&&word.descriptionTr.length>15,id);
  const homes=subgroups.objectSubgroups.filter(group=>group.wordIds.includes(id));assert.equal(homes.length,1,id);assert.equal(homes[0].parent,topic,id);
  assert(english.englishObjectName(id),id+' English name');
 }
 // The other 19 site languages read the meanings and the category names from their language pack.
 const english12=[...Object.keys(body),...Object.keys(health)].map(id=>translations.objectMeanings[id][0]);
 const names=[copy.vaultText('en','groupBody'),copy.vaultText('en','groupHealth'),...subgroups.objectSubgroups.filter(group=>groups[group.parent]).map(group=>subgroups.subgroupName(group,'en'))];
 for(const id of site.packLanguages){
  const pack=JSON.parse(fs.readFileSync(`lib/language-packs/${id}.json`,'utf8'));
  for(const text of [...english12,...names])assert(typeof pack[text]==='string'&&pack[text].trim(),id+': '+text);
 }
});

test('the new objects work in Gör ve Seç, Yazarak Pekiştir and Dinle ve Bul, with plural puzzles',()=>{
 for(const [topic,[words]] of Object.entries(groups)){
  const ids=Object.keys(words);const mine=q=>ids.includes(q.objectId);
  const picture=practice.pickPictureQuiz(topic,'all',[]);const listening=practice.pickObjectListeningQuiz(topic,'all',[]);
  assert.equal(picture.length,ids.length,topic);assert.equal(listening.length,ids.length,topic);
  assert(picture.every(q=>mine(q)&&q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)),topic);
  assert(listening.every(q=>new Set(q.pictureOptions).size===4&&q.pictureOptions.includes(q.objectId)),topic);
  assert(practice.pickObjectWritingQuiz(topic,'all',[]).length>=ids.length*2,topic);
  const round=picture.map(q=>q.id);
  assert.deepEqual(new Set(study.selectQuestions('visual',topic,round.length,[],round).map(q=>q.id)),new Set(round),topic+' server round');
 }
 assert.equal(articles.pluralNouns.hand,'Hände');assert.equal(articles.pluralNouns.fuss,'Füße');assert.equal(articles.pluralNouns.kopf,'Köpfe');assert.equal(articles.pluralNouns.rollstuhl,'Rollstühle');
 assert.equal(articles.compoundHeads.waermflasche,'die Flasche');assert.equal(articles.compoundHeads.rollstuhl,'der Stuhl');
 // English course: scissors are plural, hair and ointment have no "a".
 const gap=id=>english.englishObjectQuestions.find(q=>q.id==='en-obj-gap-'+id).gap;
 assert.equal(gap('schere'),'These are ___.');assert.equal(gap('haar'),'This is ___.');assert.equal(gap('hand'),'This is a ___.');
});
