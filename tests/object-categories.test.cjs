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
 'objects-outdoors':'baum blume gras schmetterling maus stadt turm zaun bank ball unfall kuss picknickdecke',
 // Kleidung (2 November 2026): 49 new cards, and der Rock moved here from Doğa, şehir ve diğerleri.
 'objects-clothes':'rock kleidung-hemd kleidung-bluse kleidung-tshirt kleidung-top kleidung-pullover kleidung-sweatshirt kleidung-kapuzenpullover kleidung-strickjacke kleidung-weste kleidung-jacke kleidung-lederjacke kleidung-regenjacke kleidung-winterjacke kleidung-mantel kleidung-pelzmantel kleidung-hose kleidung-jeans kleidung-kurze-hose kleidung-jogginghose kleidung-leggings kleidung-kleid kleidung-anzug kleidung-trainingsanzug kleidung-schlafanzug kleidung-nachthemd kleidung-bademantel kleidung-unterhemd kleidung-unterhose kleidung-slip kleidung-buestenhalter kleidung-badeanzug kleidung-badehose kleidung-bikini kleidung-socke kleidung-strumpf kleidung-strumpfhose kleidung-schuh kleidung-turnschuh kleidung-hausschuh kleidung-sandale kleidung-stiefel kleidung-damenhut kleidung-herrenhut kleidung-muetze kleidung-kappe kleidung-schal kleidung-handschuh kleidung-krawatte kleidung-guertel',
 // Meslekler and the Lektion 1 words (2 November 2026).
 'objects-jobs':'beruf-aerztin beruf-arzt beruf-zahnaerztin beruf-zahnarzt beruf-tieraerztin beruf-tierarzt beruf-krankenpflegerin beruf-krankenpfleger beruf-altenpflegerin beruf-altenpfleger beruf-apothekerin beruf-apotheker beruf-lehrerin beruf-lehrer beruf-erzieherin beruf-erzieher beruf-programmiererin beruf-programmierer beruf-verkaeuferin beruf-verkaeufer beruf-kassiererin beruf-kassierer beruf-baeckerin beruf-baecker beruf-kellnerin beruf-kellner beruf-koechin beruf-koch beruf-friseurin beruf-friseur beruf-busfahrerin beruf-busfahrer beruf-taxifahrerin beruf-taxifahrer beruf-polizistin beruf-polizist beruf-mechanikerin beruf-mechaniker beruf-elektrikerin beruf-elektriker beruf-malerin beruf-maler beruf-hausmeisterin beruf-hausmeister beruf-gaertnerin beruf-gaertner beruf-ingenieurin beruf-ingenieur',
 'objects-lektion1':'l1-guten-tag l1-willkommen l1-danke l1-wie l1-heissen l1-sie l1-ich l1-ich-bin l1-herr l1-frau l1-und l1-und-sie l1-woher l1-kommen l1-aus l1-sprache l1-sprechen l1-welche-sprachen l1-ein-bisschen l1-deutsch l1-du l1-hallo l1-name l1-mein-name l1-neu l1-hier l1-neu-hier l1-land l1-schreiben l1-buchstabieren l1-wie-bitte l1-wie-schreibt l1-bitte l1-ja l1-nein l1-richtig l1-interessant l1-guten-morgen l1-guten-abend l1-gute-nacht l1-auf-wiedersehen l1-tschues l1-bis-bald l1-wie-geht-es-ihnen l1-wie-geht-es-dir l1-wie-gehts l1-danke-gut l1-und-ihnen l1-sehr l1-nicht l1-schlecht l1-es-geht l1-sagen-wir-du l1-ja-gern l1-gute-reise l1-nachbarin l1-nachbar l1-wohnung l1-wichtig l1-satz l1-auswendig l1-aufnehmen l1-ueben l1-leicht l1-schwer l1-alles-klar',
 // Ders kelimeleri: Lektion 2–5 (9 November 2026), from each unit's picture cards.
 'objects-lektion2':'l2-koch l2-lehrer l2-arzt l2-friseur l2-verkaeufer l2-taxifahrer l2-mechatroniker l2-altenpfleger l2-polizist l2-ingenieur l2-saenger l2-kellner l2-busfahrer l2-haus l2-tierarzt l2-autorin l2-basketballer l2-regisseur l2-saengerin l2-tee-trinken l2-tanzen l2-formular',
 'objects-lektion3':'l3-tisch l3-stuhl l3-sofa l3-bett l3-schrank l3-regal l3-herd l3-bank l3-tasche l3-buch l3-heft l3-stift l3-bleistift l3-plakat l3-handy l3-foto l3-computer l3-laptop l3-kaffeemaschine l3-kasse l3-tafel l3-tuer l3-fenster l3-schluessel l3-kuehlschrank l3-kiosk l3-waschmaschine l3-spuelmaschine l3-kleid l3-naehmaschine l3-schere l3-topf l3-woerterbuch l3-wortkarte l3-arbeitsplatz',
 'objects-lektion4':'l4-familie l4-eltern l4-mutter l4-vater l4-kind l4-sohn l4-tochter l4-geschwister l4-bruder l4-schwester l4-grosseltern l4-oma l4-opa l4-tante l4-onkel l4-cousine l4-cousin l4-baby l4-ehemann l4-ehefrau l4-garten l4-auto l4-enkel l4-enkelin l4-chef l4-chefin l4-job l4-kiosk l4-laptop l4-nachbar l4-nachbarin l4-cafe l4-ex-frau l4-ex-mann l4-gespraech l4-woerterbuch l4-million l4-tafel l4-lampe l4-heizung l4-steckdose l4-lichtschalter l4-landkarte l4-kreide l4-lineal l4-radiergummi l4-papierkorb l4-kabel l4-tuerklinke l4-rund l4-oval l4-quadratisch l4-rechteckig l4-dreieckig l4-gemustert l4-gross-klein l4-jung-alt l4-neu-alt l4-lang-kurz l4-dick-duenn l4-schlank-dick',
 'objects-lektion5':'l5-duschen l5-fruehstuecken l5-kaffee-trinken l5-zur-arbeit-gehen l5-arbeiten l5-deutsch-lernen l5-lebensmittel-kaufen l5-kochen l5-putzen l5-telefonieren l5-im-internet-surfen l5-musik-hoeren l5-sport-machen l5-tischtennis-spielen l5-ins-bett-gehen l5-schlafen l5-morgen l5-vormittag l5-mittag l5-nachmittag l5-abend l5-nacht l5-film-sehen l5-fahrrad-fahren l5-laufen l5-essen l5-leute-treffen l5-buch-lesen l5-mit-freunden-sprechen l5-schwimmen l5-spaziergang l5-picknick l5-fussball-spielen l5-grillen l5-tanzen l5-stadt l5-park l5-zoo l5-kino l5-schwimmbad l5-bibliothek l5-cafe l5-restaurant l5-sprachcafe l5-boxen l5-trainieren l5-verein l5-kurs l5-jugendliche l5-hausaufgabe l5-anmeldung l5-preis l5-woche l5-wochenende l5-beruf l5-hobby l5-unterrichten l5-kochkurs l5-kellnerin l5-interview l5-trainer l5-schwimmkurs l5-pantomime l5-plakat l5-lange-schlafen',
};
const keys={'objects-house':'groupHouse','objects-furniture':'groupFurniture','objects-kitchen':'groupKitchen','objects-cleaning':'groupCleaning','objects-tools':'groupTools','objects-building':'groupBuilding','objects-nature':'groupNature','objects-moving':'groupMoving','objects-body':'groupBody','objects-health':'groupHealth','objects-food':'groupFood','objects-drinks':'groupDrinks','objects-cooking':'groupCooking','objects-school':'groupSchool','objects-outdoors':'groupOutdoors','objects-jobs':'groupJobs','objects-lektion1':'groupLektion1','objects-clothes':'groupClothes','objects-lektion2':'groupLektion2','objects-lektion3':'groupLektion3','objects-lektion4':'groupLektion4','objects-lektion5':'groupLektion5'};

test('the 641 vault words are sorted into twenty-two categories by meaning',()=>{
 assert.deepEqual(objects.objectGroups.map(group=>group.id),Object.keys(categories));
 const expected=Object.entries(categories).flatMap(([topic,ids])=>ids.split(' ').map(id=>[id,topic]));
 assert.equal(expected.length,641);assert.equal(objects.objectVocabulary.length,641);
 for(const [id,topic] of expected){const word=objects.objectWordMap.get(id);assert(word,id);assert.equal(word.topic,topic,id);}
 for(const word of objects.objectVocabulary)for(const kind of ['picture','write','hear-picture']){const q=course.questionMap.get('obj-'+kind+'-'+word.id);assert(q,kind+' '+word.id);assert.equal(q.topic,word.topic);}
 for(const word of objects.objectVocabulary){const groups=subgroups.objectSubgroups.filter(group=>group.wordIds.includes(word.id));assert.equal(groups.length,1,word.id);assert.equal(groups[0].parent,word.topic,word.id);}
 for(const language of copy.vaultLanguages.map(item=>item.id))for(const key of Object.values(keys))assert(copy.vaultText(language,key).trim(),key+' '+language);
 const page=fs.readFileSync('app/object-study.tsx','utf8');
 for(const [topic,key] of Object.entries(keys)){assert(page.includes("'"+topic+"':'"+key+"'"),topic);assert(new RegExp("'"+topic+"':'[a-z0-9-]+'").test(page.slice(page.indexOf('const groupImages'))),topic+' picture');}
 for(const topic of Object.keys(categories))assert(progress.objectProgressIds(topic).length>0,topic);
});

test('every category has picture and listening rounds with four distinct choices, and writing rounds outside the lessons',()=>{
 for(const topic of Object.keys(categories)){
  const picture=practice.pickPictureQuiz(topic,'all',[]);const listening=practice.pickObjectListeningQuiz(topic,'all',[]);
  assert.equal(picture.length,categories[topic].split(' ').length,topic);assert.equal(listening.length,picture.length,topic);
  assert(picture.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)),topic);
  // The lesson cards (Ders kelimeleri) have no writing round since 9 November 2026 (tests/object-lessons.test.cjs).
  if(/^objects-lektion\d$/.test(topic))assert.equal(practice.pickObjectWritingQuiz(topic,'all',[]).length,0,topic);
  else assert(practice.pickObjectWritingQuiz(topic,'all',[]).length>=picture.length*2-objects.objectVocabulary.filter(word=>word.topic===topic&&word.phrase).length,topic);
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
