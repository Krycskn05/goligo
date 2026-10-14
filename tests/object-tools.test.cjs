const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const objects=load('object-course'),practice=load('object-practice'),translations=load('object-translations'),subgroups=load('object-subgroups'),articles=load('article-challenges'),copy=load('object-vault-copy'),study=load('study'),english=load('english-objects');
const art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const tools={bohrmaschine:'die Bohrmaschine',buerste:'die Bürste',duebel:'der Dübel',haken:'der Haken',hammer:'der Hammer',kehrblech:'das Kehrblech',kleber:'der Kleber',putzeimer:'der Putzeimer',schraube:'die Schraube',schraubenzieher:'der Schraubenzieher',tapete:'die Tapete',teppichklopfer:'der Teppichklopfer',wasserwaage:'die Wasserwaage',zange:'die Zange',zollstock:'der Zollstock'};
const languages=copy.vaultLanguages.map(item=>item.id);
// WebP size: lossy VP8 keeps 14-bit sizes at 26/28, extended VP8X keeps (size-1) as 24-bit at 24/27.
function webpSize(file){const b=fs.readFileSync(file);assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');const kind=b.slice(12,16).toString();
 if(kind==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];if(kind==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];throw Error(file+' '+kind);}

test('the textbook tools page adds 15 new objects in their own Nesne Kasası category',()=>{
 const group=objects.objectGroups.find(item=>item.id==='objects-tools');assert(group,'objects-tools group');
 for(const [id,de] of Object.entries(tools))assert.equal(objects.objectWordMap.get(id).de,de,id);
 // Cleaning things from the page live in the cleaning category, the rest with the tools.
 for(const id of Object.keys(tools))assert.equal(objects.objectWordMap.get(id).topic,['buerste','kehrblech','putzeimer','teppichklopfer'].includes(id)?'objects-cleaning':'objects-tools',id);
 assert.equal(new Set(objects.objectVocabulary.map(word=>word.id)).size,objects.objectVocabulary.length,'no duplicate object IDs');
 for(const language of languages)assert(copy.vaultText(language,'groupTools').trim(),'groupTools '+language);
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 assert(page.includes("'objects-tools':'groupTools'")&&page.includes("'objects-tools':'bohrmaschine'"));
});

test('every new tool has its own 512 px picture, meanings in all languages and a sub-topic',()=>{
 for(const id of Object.keys(tools)){
  const word=objects.objectWordMap.get(id);assert.equal(word.image,'/objects/toon/werkzeug-'+id+'.webp');
  assert.equal(art[id].src,word.image);assert.deepEqual(art[id].crop,{x:0,y:0,width:512,height:512});
  assert.deepEqual(webpSize(path.join('public',word.image)),[512,512],id);
  for(const language of languages)assert(translations.objectMeaning(id,language).trim(),id+' '+language);
  assert(word.description.length>20&&word.descriptionTr.length>20,id);
  assert.equal(subgroups.objectSubgroups.filter(group=>group.wordIds.includes(id)).length,1,id);
  assert(english.englishObjectName(id),id+' English name');
 }
 const parents=new Set(subgroups.subgroupsFor('objects-tools').map(group=>group.parent));assert.deepEqual([...parents],['objects-tools']);
 for(const group of subgroups.subgroupsFor('objects-tools'))for(const language of languages)assert(subgroups.subgroupName(group,language).trim(),group.id+' '+language);
});

test('the tools can be practised in Gör ve Seç, Yazarak Pekiştir and Dinle ve Bul, with plural puzzles',()=>{
 const ids15=Object.keys(tools);const mine=q=>ids15.includes(q.objectId);
 const picture=practice.pickPictureQuiz('all','all',[]).filter(mine);const writing=practice.pickObjectWritingQuiz('all','all',[]).filter(mine);const listening=practice.pickObjectListeningQuiz('all','all',[]).filter(mine);
 assert.equal(picture.length,15);assert.equal(listening.length,15);
 assert(picture.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)));
 assert(listening.every(q=>new Set(q.pictureOptions).size===4&&q.pictureOptions.includes(q.objectId)));
 const plurals=writing.filter(q=>q.articlePuzzle);assert.equal(plurals.length,14);
 assert.equal(articles.pluralNouns.schraube,'Schrauben');assert.equal(articles.pluralNouns.zollstock,'Zollstöcke');assert.equal(articles.pluralNouns.hammer,'Hämmer');
 assert.equal(articles.compoundHeads.wasserwaage,'die Waage');assert.equal(articles.compoundHeads.kehrblech,'das Blech');
 const ids=practice.pickPictureQuiz('objects-tools','all',[]).map(q=>q.id);
 assert.deepEqual(new Set(study.selectQuestions('visual','objects-tools',ids.length,[],ids).map(q=>q.id)),new Set(ids),'the server keeps a full tools round');
});

test('the pictures are drawn from shader models kept in the repository',()=>{
 const models=require(path.resolve('art/werkzeug/objects.cjs'));
 assert.deepEqual(Object.keys(models).sort(),Object.keys(tools).sort());
 for(const [id,model] of Object.entries(models)){assert(model.glsl.includes('vec2 objectMap(vec3 p)'),id);assert.equal(model.view.cam.length,3,id);}
 const glsl=fs.readFileSync('art/werkzeug/common.glsl','utf8');assert(glsl.includes('//__OBJECT__'));
 const workflow=fs.readFileSync('.github/workflows/resimler.yml','utf8');
 assert(workflow.includes('workflow_dispatch')&&workflow.includes('art/werkzeug/render.cjs public/objects/toon'));
});
