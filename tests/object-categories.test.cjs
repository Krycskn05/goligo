const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const {DatabaseSync}=require('node:sqlite');const ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('course'),study=load('study'),objects=load('object-course'),subgroups=load('object-subgroups'),copy=load('object-vault-copy'),practice=load('object-practice'),progress=load('progress');
// The Nesne Kasası is sorted by meaning. IDs stay the same; only the category changes.
const categories={
 'objects-house':'bad dachboden keller kueche dach fenster haustuer kamin mauer treppe ziegelstein dachfenster dachziegel regenrinne fallrohr antenne dusche heizung rohr steckdose stecker waschbecken wasserhahn',
 'objects-furniture':'bett hocker matratze regal schrank sessel sofa stuhl tisch truhe bild bilderrahmen kissen lampe spiegel teppich vorhang fernseher kofferradio plattenspieler',
 'objects-kitchen':'herd kuehlschrank tasse teekanne teller tischdecke flasche apfel',
 'objects-cleaning':'besen buerste kehrblech putzeimer staubsauger teppichklopfer buegeleisen waschmaschine',
 'objects-tools':'bohrmaschine hammer schraubenzieher zange saege wasserwaage zollstock nagel schraube duebel haken kleber pinsel farbrolle eimer tapete',
 'objects-building':'geruest zementmischer zementsack schubkarre schlauch kabel schild brett leiter schaufel maurerkelle',
 'objects-nature':'pflanze palme blumentopf kaktus vogel vogelkaefig feder fisch aquarium',
 'objects-moving':'karton umzugswagen lastwagen seil kette rad regenschirm schirmstaender brille zeitschrift bogen pfeil',
 'objects-body':'arm auge bauch bein brust daumen finger fuss ellbogen haar hals hand knie kopf mund nase ohr schulter zeh koerper zahn',
 'objects-health':'verband pflaster verbandskasten waermflasche salbe hustensaft tablette kapsel schere fieberthermometer spritze stethoskop rollstuhl trage kruecke gips',
 'objects-food':'ei spiegelei brot brotscheibe broetchen baguette brezel butter marmelade zucker wuerfelzucker salz pfeffer essig oel kaese bratwurst wuerstchen salami schinken fleisch kotelett braten schnitzel haehnchen sardine nudeln spaghetti reis sosse suppe pudding pommes pizza wurstbrot kaesebrot kuchen torte nuss gemuese salat kartoffel erbse tomate gurke zwiebel blumenkohl karotte birne banane traube zitrone orange kirsche erdbeere',
 'objects-drinks':'kaffee tee milch wasser apfelsaft orangensaft wein rotwein weisswein bier untertasse schuessel glas weinglas bierglas krug kaffeekanne milchkaennchen eierbecher salzstreuer pfeffermuehle zuckerdose zuckerzange butterdose sossenschuessel serviette brotkorb speisekarte gabel messer loeffel teeloeffel',
 'objects-cooking':'pfanne topf deckel sieb schneebesen zitronenpresse schneidebrett fleischwolf kaffeemaschine mixer brotschneidemaschine korkenzieher dosenoeffner flaschenoeffner dose einmachglas milchtuete tube korken kronkorken eierschale strohhalm',
 'objects-school':'tafel kreide schwamm tuer tuerklinke ecke decke fussboden lichtschalter papierkorb landkarte buch heft woerterbuch bleistift buntstift kugelschreiber fueller radiergummi lineal tasche rucksack lehrer schueler schuelerin foto radio kassettenrekorder',
 'objects-outdoors':'baum blume gras schmetterling maus stadt turm zaun bank ball unfall kuss picknickdecke rock',
};
const keys={'objects-house':'groupHouse','objects-furniture':'groupFurniture','objects-kitchen':'groupKitchen','objects-cleaning':'groupCleaning','objects-tools':'groupTools','objects-building':'groupBuilding','objects-nature':'groupNature','objects-moving':'groupMoving','objects-body':'groupBody','objects-health':'groupHealth','objects-food':'groupFood','objects-drinks':'groupDrinks','objects-cooking':'groupCooking','objects-school':'groupSchool','objects-outdoors':'groupOutdoors'};

test('the 295 vault objects are sorted into fifteen categories by meaning',()=>{
 assert.deepEqual(objects.objectGroups.map(group=>group.id),Object.keys(categories));
 const expected=Object.entries(categories).flatMap(([topic,ids])=>ids.split(' ').map(id=>[id,topic]));
 assert.equal(expected.length,295);assert.equal(objects.objectVocabulary.length,295);
 for(const [id,topic] of expected){const word=objects.objectWordMap.get(id);assert(word,id);assert.equal(word.topic,topic,id);}
 for(const word of objects.objectVocabulary)for(const kind of ['picture','write','hear-picture']){const q=course.questionMap.get('obj-'+kind+'-'+word.id);assert(q,kind+' '+word.id);assert.equal(q.topic,word.topic);}
 for(const word of objects.objectVocabulary){const groups=subgroups.objectSubgroups.filter(group=>group.wordIds.includes(word.id));assert.equal(groups.length,1,word.id);assert.equal(groups[0].parent,word.topic,word.id);}
 for(const language of copy.vaultLanguages.map(item=>item.id))for(const key of Object.values(keys))assert(copy.vaultText(language,key).trim(),key+' '+language);
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 for(const [topic,key] of Object.entries(keys)){assert(page.includes("'"+topic+"':'"+key+"'"),topic);assert(new RegExp("'"+topic+"':'[a-z]+'").test(page.slice(page.indexOf('const groupImages'))),topic+' picture');}
 for(const topic of Object.keys(categories))assert(progress.objectProgressIds(topic).length>0,topic);
});

test('every category has picture, writing and listening rounds with four distinct choices',()=>{
 for(const topic of Object.keys(categories)){
  const picture=practice.pickPictureQuiz(topic,'all',[]);const listening=practice.pickObjectListeningQuiz(topic,'all',[]);
  assert.equal(picture.length,categories[topic].split(' ').length,topic);assert.equal(listening.length,picture.length,topic);
  assert(picture.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)),topic);
  assert(practice.pickObjectWritingQuiz(topic,'all',[]).length>=picture.length*2,topic);
  const ids=picture.map(q=>q.id);
  assert.deepEqual(new Set(study.selectQuestions('visual',topic,ids.length,[],ids).map(q=>q.id)),new Set(ids),topic+' server round');
 }
});

test('an unfinished round keeps working with the answer choices it was started with',async()=>{
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));
 const db={prepare(query){return {query,args:[],bind(...args){this.args=args;return this;},async first(column){const r=sql.prepare(this.query).get(...this.args);return column?r?.[column]??null:r??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(items){sql.exec('BEGIN');try{const result=[];for(const item of items)result.push(await item.run());sql.exec('COMMIT');return result;}catch(error){sql.exec('ROLLBACK');throw error;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return {getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return {getChatGPTUser:async()=>({userId:'old-round'})};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}});
 const post=body=>module.exports.POST(new Request('https://vault.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://vault.test'},body:JSON.stringify(body)}));
 const q=course.questionMap.get('obj-picture-tasse');const id='old-round-session-000001';
 assert.equal((await post({action:'start',id,mode:'visual',topic:'objects-kitchen',count:1,onlyIds:[q.id]})).status,201);
 // Simulate a round saved before the categories changed: it showed another distractor.
 const old=[q.answer,'der Besen','das Kissen','die Palme'].filter((value,i,list)=>list.indexOf(value)===i);assert.equal(old.length,4);
 const outdated=old.find(option=>!q.options.includes(option));assert(outdated,'one choice is no longer in the current list');
 sql.prepare('UPDATE study_sessions SET questions=? WHERE id=?').run(JSON.stringify([{id:q.id,options:old}]),id);
 assert.equal((await post({action:'answer',sessionId:id,questionId:q.id,answer:'der Hammer'})).status,400,'a choice the round never showed is refused');
 const answered=await post({action:'answer',sessionId:id,questionId:q.id,answer:outdated});assert.equal(answered.status,200);
 assert.equal((await answered.json()).result.correct,0);
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 assert(page.includes('(options.length>0&&!options.includes(answer))'),'the page checks the choices it shows');
 assert(page.includes('??objectVocabulary.find(item=>'),'listening choices from an older round still show their pictures');
});
