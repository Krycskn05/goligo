// Kelime Kasası, "Ders kelimeleri" (9 November 2026, the learner asked: "aynı burada olduğu gibi 2-3-4-5 ünitelerini de
// böyle yap yazarak pekiştiri kaldır hepsinden"): one card for each of Lektion 1–5, built from each unit's picture cards,
// and no "Yazarak Pekiştir" on any lesson card (only Gör ve Seç and Dinle ve Bul).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const objects=load('object-course'),additions=load('object-word-additions'),translations=load('object-translations'),subgroups=load('object-subgroups'),copy=load('object-vault-copy');
const practice=load('object-practice'),progress=load('progress'),sections=load('vault-sections'),site=load('site-languages'),games=load('object-games'),english=load('english-objects'),course=load('course');
const art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const lessons={'objects-lektion2':['groupLektion2','l2-koch',22],'objects-lektion3':['groupLektion3','l3-tisch',35],'objects-lektion4':['groupLektion4','l4-familie',61],'objects-lektion5':['groupLektion5','l5-fruehstuecken',65]};
const languages=copy.vaultLanguages.map(item=>item.id);
const fresh=objects.objectVocabulary.filter(word=>lessons[word.topic]);
function webpSize(file){const b=fs.readFileSync(file);assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');const kind=b.slice(12,16).toString();
 if(kind==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];if(kind==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];throw Error(file+' '+kind);}

test('Ders kelimeleri holds one card for each of Lektion 1–5, named in every site language, with a cover picture',()=>{
 const lessonSection=sections.vaultSections.find(section=>section.id==='lessons');
 assert.deepEqual(lessonSection.groups,['objects-lektion1','objects-lektion2','objects-lektion3','objects-lektion4','objects-lektion5']);
 assert.deepEqual([...additions.LESSON_TOPICS],lessonSection.groups);
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 for(const [topic,[key,picture,count]] of Object.entries(lessons)){
  assert.equal(objects.objectVocabulary.filter(word=>word.topic===topic).length,count,topic);
  for(const language of languages)assert(copy.vaultText(language,key).trim(),key+' '+language);
  assert(page.includes("'"+topic+"':'"+key+"'")&&page.includes("'"+topic+"':'"+picture+"'"),topic);
 }
 const unit=topic=>topic.slice(-1);
 assert(fresh.every(word=>word.id.startsWith('l'+unit(word.topic)+'-')),'prefixed IDs never meet older ones');
 assert.equal(new Set(objects.objectVocabulary.map(word=>word.id)).size,objects.objectVocabulary.length);
 // The words come from the units' own cards.
 assert.equal(objects.objectWordMap.get('l3-tisch').de,'der Tisch');assert.equal(objects.objectWordMap.get('l5-duschen').de,'duschen');
 assert.equal(objects.objectWordMap.get('l2-koch').de,'der Koch / die Köchin');assert.equal(objects.objectWordMap.get('l4-gross-klein').de,'groß ≠ klein');
 assert(!objects.objectWordMap.get('l4-haus'),'das Haus of Lektion 4 is left out (its picture shows housework)');
});

test('every lesson card has its own 512 px picture, meanings in all 31 languages, a description and one sub-topic',()=>{
 for(const word of fresh){
  // Five cards were made again without the teacher (11 November 2026) and have a new file name; the ids stay.
  assert.equal(word.image,'/objects/toon/'+(load('object-lesson-words').lessonPictureFiles[word.id]??word.id)+'.webp');
  assert.deepEqual(art[word.id],{src:word.image,width:512,height:512,crop:{x:0,y:0,width:512,height:512}},word.id);
  assert.deepEqual(webpSize(path.join('public',word.image)),[512,512],word.id);
  for(const language of languages)assert(translations.objectMeaning(word.id,language).trim(),word.id+' '+language);
  assert(word.description.length>20&&word.descriptionTr.length>15&&!word.description.includes('___'),word.id);
  if(!word.phrase){const noun=word.de.split(' ').slice(1).join(' ');assert(!new RegExp('(^|[^\\p{L}])'+noun+'($|[^\\p{L}])','iu').test(word.description),word.id);}
  const homes=subgroups.objectSubgroups.filter(group=>group.wordIds.includes(word.id));assert.equal(homes.length,1,word.id);assert.equal(homes[0].parent,word.topic,word.id);
 }
 const texts=[...fresh.map(word=>translations.objectMeanings[word.id][0]),...Object.values(lessons).map(([key])=>copy.vaultText('en',key)),
  ...subgroups.objectSubgroups.filter(group=>lessons[group.parent]).map(group=>subgroups.subgroupName(group,'en'))];
 for(const id of site.packLanguages){
  const pack=JSON.parse(fs.readFileSync(`lib/language-packs/${id}.json`,'utf8'));
  for(const text of texts)assert(typeof pack[text]==='string'&&pack[text].trim(),id+': '+text);
 }
});

test('words without der/die/das have no article questions; the games and the English course keep their own words',()=>{
 for(const word of fresh){
  const noun=/^(der|die|das) [^ ]+$/.test(word.de);assert.equal(!word.phrase,noun,word.id); // „der Koch / die Köchin“ is a pair card
  if(word.phrase)assert(!course.questionMap.get('obj-article-'+word.id)&&!course.questionMap.get('obj-gap-'+word.id),word.id);
  assert(!games.gameObject(word.id),word.id+' not in the games (der Tisch is already there)');
 }
 assert(!english.englishObjectQuestions.some(q=>/^en-obj-[a-z-]+-l[2-5]-/.test(q.id)));
 assert(['objects-lektion2','objects-lektion3','objects-lektion4','objects-lektion5'].every(topic=>additions.WORD_TOPICS.includes(topic)));
});

test('no lesson card offers Yazarak Pekiştir: only Gör ve Seç and Dinle ve Bul, and the progress counts only those',()=>{
 for(const topic of additions.LESSON_TOPICS){
  const picture=practice.pickPictureQuiz(topic,'all',[]);const listening=practice.pickObjectListeningQuiz(topic,'all',[]);
  const words=objects.objectVocabulary.filter(word=>word.topic===topic).length;
  assert.equal(picture.length,words,topic);assert.equal(listening.length,words,topic);
  assert(picture.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)),topic);
  assert(listening.every(q=>new Set(q.pictureOptions).size===4),topic);
  assert.equal(practice.objectWritingPool(topic).length,0,topic);assert.equal(practice.pickObjectWritingQuiz(topic,'all',[]).length,0,topic);
  const ids=progress.objectProgressIds(topic);assert.equal(ids.length,words*2,topic);
  assert(ids.every(id=>/^obj-(picture|hear-picture)-/.test(id)),topic);
 }
 // The other categories keep their writing rounds.
 assert(practice.objectWritingPool('objects-house').length>0&&practice.objectWritingPool('objects-jobs').length>0);
 const page=fs.readFileSync('app/object-study.tsx','utf8'),modes=fs.readFileSync('app/practice-modes.tsx','utf8');
 assert.equal((page.match(/noWrite=\{isLessonTopic\(/g)??[]).length,2,'the card and the category screen');
 assert(modes.includes("filter(mode=>!noWrite||mode!=='write')"));
 assert(page.includes("mode==='write'&&isLessonTopic(id)?'test':mode"),'a remembered writing mode falls back to Gör ve Seç');
});

test('the older categories keep exactly their choices (the lesson words never become their wrong choices)',()=>{
 const later=new Set(['objects-lektion2','objects-lektion3','objects-lektion4','objects-lektion5']);
 for(const q of objects.objectQuestions){
  if(later.has(q.topic)||!q.options)continue;
  const others=(q.pictureOptions??[]).filter(id=>id!==q.objectId);
  assert(others.every(id=>!later.has(objects.objectWordMap.get(id)?.topic)),q.id);
 }
 for(const q of objects.objectQuestions.filter(item=>later.has(item.topic)&&item.pictureOptions))
  assert(q.pictureOptions.every(id=>objects.objectWordMap.get(id).topic===q.topic),q.id);
});
