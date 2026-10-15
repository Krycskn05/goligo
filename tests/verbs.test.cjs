const {test}=require('node:test');const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const ts=require('typescript');const {execFileSync}=require('node:child_process');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('course'),study=load('study'),verbs=load('verb-course'),practice=load('verb-practice'),copy=load('verb-copy'),progress=load('progress'),workshop=load('verb-workshop'),families=load('verb-families');
const languages=['tr','de','en','ar','uk','fr','es','ru','fa','pl','it','pt'];

// The learner's textbook page: infinitive – sie/er (es) Präsens – Perfekt.
const page=`ab|fahren;fährt ab;ist abgefahren
ab|geben;gibt ab;hat abgegeben
an|bieten;bietet an;hat angeboten
an|fangen;fängt an;hat angefangen
an|kommen;kommt an;ist angekommen
an|rufen;ruft an;hat angerufen
an|ziehen;zieht an;hat angezogen
auf|stehen;steht auf;ist aufgestanden
aus|sehen;sieht aus;hat ausgesehen
aus|steigen;steigt aus;ist ausgestiegen
aus|ziehen;zieht aus;ist ausgezogen
beginnen;beginnt;hat begonnen
bekommen;bekommt;hat bekommen
bleiben;bleibt;ist geblieben
bringen;bringt;hat gebracht
denken;denkt;hat gedacht
ein|laden;lädt ein;hat eingeladen
empfehlen;empfiehlt;hat empfohlen
essen;isst;hat gegessen
fahren;fährt;ist gefahren
finden;findet;hat gefunden
fliegen;fliegt;ist geflogen
geben;gibt;hat gegeben
gefallen;gefällt;hat gefallen
gehen;geht;ist gegangen
gelten;gilt;hat gegolten
heißen;heißt;hat geheißen
herunter|laden;lädt herunter;hat heruntergeladen
helfen;hilft;hat geholfen
kennen;kennt;hat gekannt
kommen;kommt;ist gekommen
laufen;läuft;ist gelaufen
leid|tun;tut leid;hat leidgetan
leihen;leiht;hat geliehen
lesen;liest;hat gelesen
liegen;liegt;hat gelegen
mit|bringen;bringt mit;hat mitgebracht
mit|kommen;kommt mit;ist mitgekommen`.split('\n').map(line=>line.split(';'));

test('Fiiller keeps the 38 verbs of the page with Präsens, Perfekt and a meaning in every language',()=>{
 assert.equal(verbs.verbs.length,38);
 assert.deepEqual(verbs.verbs.map(v=>[v.display,v.praesens,v.perfekt]),page);
 assert.equal(new Set(verbs.verbs.map(v=>v.id)).size,38);
 for(const verb of verbs.verbs){
  assert.equal(verb.subject,['gefallen','leidtun'].includes(verb.id)?'es':'sie/er',verb.id);
  assert.equal(verb.aux+' '+verb.participle,verb.perfekt,verb.id);
  assert.equal(verb.meanings.length,12,verb.id);
  for(const language of languages)assert.ok(verbs.verbMeaning(verb,language).trim(),verb.id+':'+language);
  assert.equal(new Set([verb.praesens,...verb.praesensWrong]).size,4,verb.id);
  assert.equal(new Set([verb.perfekt,...verb.perfektWrong]).size,4,verb.id);
 }
 assert.equal(verbs.perfektLabel(verbs.verbMap.get('liegen')),'hat/ist gelegen');
 assert.deepEqual(verbs.verbGroups.map(g=>verbs.verbs.filter(v=>v.group===g.id).length),[10,10,10,8]);
});

test('every verb has choice, writing and listening exercises with new IDs only',()=>{
 const kinds=['meaning','word','fit','praesens','perfekt','write','write-praesens','write-perfekt','hear','hear-praesens','hear-perfekt'];
 assert.equal(verbs.verbQuestions.length,38*kinds.length);
 assert.equal(new Set(verbs.verbQuestions.map(q=>q.id)).size,verbs.verbQuestions.length);
 for(const verb of verbs.verbs)for(const task of kinds){
  const q=course.questionMap.get('verb-'+task+'-'+verb.id);assert.ok(q,task+' '+verb.id);
  assert.equal(q.verbTask,task);assert.equal(q.verbId,verb.id);assert.equal(q.topic,verb.group);
  assert.ok(practice.isVerbExercise(q),q.id);assert.ok(course.gradeAnswer(q,q.answer),q.id);
  if(q.options){
   assert.equal(new Set(q.options).size,4,q.id);assert.ok(q.options.includes(q.answer),q.id);
   if(['meaning','hear','word'].includes(task))for(const language of languages){
    const shown=q.options.map(option=>verbs.verbMeaning(verbs.verbMap.get(option),language));
    assert.equal(new Set(shown).size,4,q.id+' meanings '+language);
   }
  }
 }
 // Verb questions stay on their own page: not in the A1 catalogue topics or question list.
 assert.ok(!course.questions.some(q=>q.id.startsWith('verb-')));
 assert.ok(!course.topics.some(t=>t.id.startsWith('verbs-')));
 for(const topic of [...verbs.verbGroups.map(g=>g.id),'verbs-all'])assert.ok(course.learningTopics.some(t=>t.id===topic),topic);
 assert.ok(practice.isVerbTestQuestion(course.questionMap.get('verb-perfekt-abfahren')));
 assert.ok(!practice.isVerbTestQuestion(course.questionMap.get('verb-hear-abfahren')));
 assert.ok(practice.isVerbListeningQuestion(course.questionMap.get('verb-hear-perfekt-abfahren')));
 assert.equal(course.questionMap.get('verb-hear-perfekt-abfahren').audio,'er ist abgefahren');
 assert.equal(course.questionMap.get('verb-hear-praesens-gefallen').audio,'es gefällt');
});

test('grading checks hat or ist, the umlaut and the separable prefix',()=>{
 const perfekt=course.questionMap.get('verb-write-perfekt-abfahren');
 assert.ok(course.gradeAnswer(perfekt,'ist abgefahren'));assert.ok(!course.gradeAnswer(perfekt,'hat abgefahren'));
 const liegen=course.questionMap.get('verb-write-perfekt-liegen');
 assert.ok(course.gradeAnswer(liegen,'hat gelegen'));assert.ok(course.gradeAnswer(liegen,'ist gelegen'));assert.ok(!course.gradeAnswer(liegen,'hat geliegen'));
 const praesens=course.questionMap.get('verb-write-praesens-abfahren');
 assert.ok(course.gradeAnswer(praesens,'fährt ab'));assert.ok(!course.gradeAnswer(praesens,'fahrt ab'));assert.ok(!course.gradeAnswer(praesens,'abfährt'));
 const choice=course.questionMap.get('verb-praesens-essen');
 assert.ok(course.gradeAnswer(choice,'isst'));assert.ok(!course.gradeAnswer(choice,'esst'));
});

test('rounds follow the chosen group and mode, solved questions wait and the same verb never comes twice in a row',()=>{
 for(const mode of ['test','write','listen'])for(const topic of ['verbs-all','verbs-2']){
  const pool=practice.verbPool(mode,topic);assert.ok(pool.length>0,mode+topic);
  const ids=pool.map(q=>q.id);const picked=study.selectQuestions(mode,topic,ids.length,[],ids);
  assert.deepEqual(new Set(picked.map(q=>q.id)),new Set(ids),mode+topic);
  assert.ok(picked.every(q=>practice.verbModePredicate(mode)(q)&&(topic==='verbs-all'||q.topic===topic)));
  for(let i=1;i<picked.length;i++)assert.notEqual(picked[i].verbId,picked[i-1].verbId,mode+topic+' '+i);
 }
 assert.equal(practice.verbPool('test','verbs-1').length,50);assert.equal(practice.verbPool('write','verbs-4').length,24);
 const ids=practice.verbPool('test','verbs-1').map(q=>q.id);
 const reviews=[{question_id:ids[0],wrong_count:1,streak:0,seen:1,last_answer:'x',last_wrong:'x',last_at:1,due_at:1},{question_id:ids[1],wrong_count:0,streak:1,seen:1,last_answer:'y',last_wrong:null,last_at:1,due_at:1}];
 const fresh=practice.pickVerbRound('test','verbs-1',reviews,false,undefined,{fresh:true}).map(q=>q.id);
 assert.ok(fresh.includes(ids[0])&&!fresh.includes(ids[1]));assert.equal(fresh.length,49);
 const review=practice.pickVerbRound('test','verbs-1',reviews,true,undefined,{starred:new Set([ids[2]])}).map(q=>q.id).sort();
 assert.deepEqual(review,[ids[0],ids[2]].sort());
 assert.equal(study.selectQuestions('test','verbs-1',50,reviews,ids)[0].id,ids[0],'open mistakes come first');
 assert.equal(progress.verbProgressIds('verbs-all').length,418);
 assert.ok(progress.verbProgressIds('verbs-3').every(id=>course.questionMap.get(id).topic==='verbs-3'));
 assert.equal(progress.verbProgress('verbs-1',reviews).learned,1);
});

test('every text of the page exists in all twelve languages',()=>{
 for(const key of Object.keys(copy.verbCopy))for(const language of languages){
  const text=copy.verbText(language,key,{n:7,verb:'ab|fahren',total:9,t:'Präsens',p:'ab'});assert.ok(text.trim(),key+':'+language);assert.ok(!/\{[a-z]+\}/.test(text),key+':'+language);
 }
 assert.equal(copy.verbText('tr','groupTitle',{n:2}),'2. grup');
});

function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));let user='student-a';
 const db={prepare(query){return{query,args:[],bind(...args){this.args=args;return this;},async first(column){const row=sql.prepare(this.query).get(...this.args);return column?row?.[column]??null:row??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(list){sql.exec('BEGIN');try{const result=[];for(const item of list)result.push(await item.run());sql.exec('COMMIT');return result;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};const context={module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return{getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return{getChatGPTUser:async()=>user?{userId:user}:null};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}};vm.runInNewContext(source,context);
 return {async post(body){return module.exports.POST(new Request('https://study.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://study.test'},body:JSON.stringify(body)}));},get(query=''){return module.exports.GET(new Request('https://study.test/api/study'+query));}};
}
test('a Fiiller round starts, saves answers and stars, resumes and finishes through the study API',async()=>{
 const a=app();const ids=practice.pickVerbRound('write','verbs-4',[],false,undefined,{fresh:true}).map(q=>q.id);const id='verb-round-session-0001';
 const started=await a.post({action:'start',id,mode:'write',topic:'verbs-4',count:ids.length,onlyIds:ids});assert.equal(started.status,201);
 const {session}=await started.json();assert.equal(session.topic,'verbs-4');assert.equal(session.questions.length,24);
 const first=course.questionMap.get(session.questions[0].id);
 const wrong=await (await a.post({action:'answer',sessionId:id,questionId:first.id,answer:'falsch'})).json();assert.equal(wrong.result.correct,0);
 let open=await (await a.get()).json();assert.equal(open.activeVerbSessionId,null,'only the workshop path is picked up again');assert.equal(open.activePictureSessionId,null);
 assert.equal((await a.post({action:'note',key:'star:'+first.id,value:'1'})).status,200);
 open=await (await a.get()).json();assert.equal(open.notes['star:'+first.id],'1');
 const resumed=(await (await a.get('?session='+id)).json()).session;assert.equal(resumed.answers.length,1);
 for(const item of resumed.questions.slice(1)){const q=course.questionMap.get(item.id);const saved=await (await a.post({action:'answer',sessionId:id,questionId:q.id,answer:q.answer})).json();assert.equal(saved.result.correct,1,q.id);}
 open=await (await a.get()).json();assert.equal(open.activeVerbSessionId,null);
 const reviews=open.reviews;assert.ok(practice.isVerbMistake(reviews.find(r=>r.question_id===first.id)));
 const listen=practice.verbPool('listen','verbs-1').map(q=>q.id);
 const choice=await a.post({action:'start',id:'verb-listen-session-01',mode:'listen',topic:'verbs-1',count:listen.length,onlyIds:listen});assert.equal(choice.status,201);
 const listenSession=(await choice.json()).session;const q=course.questionMap.get(listenSession.questions[0].id);assert.ok(q.audio);
 assert.deepEqual([...listenSession.questions[0].options].sort(),[...q.options].sort());
 assert.equal((await a.post({action:'start',id:'verb-bad-topic-000001',mode:'test',topic:'verbs-9',count:1})).status,400);
 // Fiil Atölyesi: the whole path is one session in the requested order; it is the session to continue.
 const path=workshop.workshopIds();const started2=await a.post({action:'start',id:'verb-workshop-session-01',mode:'workshop',topic:'verbs-all',count:path.length,onlyIds:path});assert.equal(started2.status,201);
 const ws=(await started2.json()).session;assert.deepEqual(ws.questions.map(item=>item.id),path);assert.equal(ws.mode,'workshop');
 open=await (await a.get()).json();assert.equal(open.activeVerbSessionId,'verb-workshop-session-01');
 const other=await a.post({action:'start',id:'verb-other-session-00001',mode:'test',topic:'verbs-1',count:5});assert.equal(other.status,201);
 open=await (await a.get()).json();assert.equal(open.activeVerbSessionId,'verb-workshop-session-01','another open round never replaces the path');
});

test('the page is linked from home, only the correct answer is spoken, and verb audio is in the voice list',()=>{
 assert.match(fs.readFileSync('app/fiiller/page.tsx','utf8'),/VerbStudy/);
 assert.match(fs.readFileSync('app/category-study.tsx','utf8'),/href="\/fiiller"/);
 assert.match(fs.readFileSync('app/progress-ui.tsx','utf8'),/href="\/fiiller"/);
 assert.match(fs.readFileSync('app/layout.tsx','utf8'),/verbs\.css/);
 const page=fs.readFileSync('app/verb-study.tsx','utf8');
 assert.ok(page.includes("const pronunciation=task==='fit'&&verb?verb.praesens:q?.answer??'';"));
 assert.ok(page.includes('answerAudio.answer(gradeAnswer(q,answer),pronunciation)'));
 // The question audio is played only from the listen buttons.
 assert.equal((page.match(/speech\.speak\(q\.audio/g)||[]).length,1);
 assert.ok(/function hearQuestion\(slow=false\)\{if\(!q\?\.audio\|\|busy\|\|cueBusy\)return;setHeardQuestionId\(q\.id\);speech\.speak\(q\.audio,slow\);\}/.test(page));
 const texts=new Set(JSON.parse(execFileSync(process.execPath,['scripts/voices/list-texts.cjs'],{encoding:'utf8',env:{...process.env,STUDY_CHECK_DIR:compiled}})));
 for(const q of verbs.verbQuestions){assert.ok(texts.has(q.answer),q.id);if(q.audio)assert.ok(texts.has(q.audio),q.id);}
 for(const verb of verbs.verbs)assert.ok(texts.has(verbs.verbRowSpeech(verb)),verb.id);
});

test('sentences, form pieces and rules explain every verb',()=>{
 const logic=load('verb-logic');const games=load('verb-games');
 for(const verb of verbs.verbs){
  assert.equal(logic.participlePieces(verb).join(''),verb.participle,verb.id);
  const ps=logic.praesensPieces(verb);if(ps)assert.equal(ps.join(''),logic.praesensStem(verb),verb.id);
  for(const piece of [...logic.participleWrongPieces(verb),...logic.praesensWrongPieces(verb)])assert.ok(piece.length>0,verb.id);
  for(const tense of ['praesens','perfekt']){
   const chunks=logic.sentenceChunks(verb,tense);const text=logic.sentenceText(verb,tense);
   assert.ok(/^[A-ZÄÖÜ„]/.test(text)&&text.endsWith('.'),verb.id+' '+text);
   if(tense==='praesens'){assert.ok(text.includes(' '+logic.praesensStem(verb)+' '),text);assert.equal(chunks[1].role,'verb',text);if(logic.verbPrefix(verb))assert.equal(chunks.at(-1).text,logic.verbPrefix(verb),text);}
   else{assert.equal(chunks[1].text,verb.aux,text);assert.equal(chunks.at(-1).text,verb.participle,text);}
   // the tempting wrong part is never part of the right sentence
   assert.ok(!chunks.some(chunk=>chunk.text===logic.sentenceDistractor(verb,tense)),verb.id+' '+tense);
   for(const language of languages)for(const line of logic.verbRules(verb,tense,language))assert.ok(line.trim()&&!/\{[a-z]+\}/.test(line),verb.id+' '+language+' '+line);
  }
 }
 assert.equal(logic.sentenceText(verbs.verbMap.get('abfahren'),'praesens'),'Der Zug fährt um acht Uhr ab.');
 assert.equal(logic.sentenceText(verbs.verbMap.get('abfahren'),'perfekt'),'Der Zug ist pünktlich abgefahren.');
 assert.equal(logic.sentenceText(verbs.verbMap.get('leidtun'),'praesens'),'Es tut mir leid.');
 assert.equal(logic.auxReason(verbs.verbMap.get('bleiben')),'bleiben');
 assert.equal(logic.verbPicture(verbs.verbMap.get('ausziehen')),'/verbs/ausziehen.webp');
 for(const verb of verbs.verbs)assert.ok(logic.verbPicture(verb),verb.id);
 for(const verb of verbs.verbs){const src=logic.verbPicture(verb);if(src)assert.ok(fs.existsSync(path.join('public',src)),src);}
 assert.ok(fs.existsSync(path.join('public',logic.verbsHeroPicture)));
 let seed=1;const random=()=>((seed=(seed*16807)%2147483647)/2147483647);
 for(const topic of ['verbs-all','verbs-4']){
  const s=games.sentenceRound(topic,10,random);assert.equal(s.length,topic==='verbs-all'?10:8);
  for(const task of s){assert.equal(task.tiles.length,task.chunks.length+1);assert.ok(games.sentenceCorrect(task,task.chunks.map(c=>c.text)));assert.ok(!games.sentenceCorrect(task,[...task.chunks.map(c=>c.text)].reverse()));}
  const b=games.buildRound(topic,10,random);assert.equal(b.length,10);
  for(const task of b){assert.ok(games.buildCorrect(task,task.pieces));assert.ok(task.tiles.length>task.pieces.length);}
  for(const kind of games.matchKinds(topic)){const cards=games.matchRound(topic,kind,'tr',6,random);assert.equal(cards.length,12);assert.equal(new Set(cards.map(c=>c.pair)).size,6);}
 }
 const liegen=verbs.verbMap.get('liegen');assert.ok(games.auxCorrect(liegen,'hat')&&games.auxCorrect(liegen,'ist'));
 assert.ok(!games.auxCorrect(verbs.verbMap.get('fahren'),'hat'));
});

test('the writing puzzles use sentences, the prefix choice and the | mark of separable verbs',()=>{
 const page=fs.readFileSync('app/verb-study.tsx','utf8');
 assert.ok(page.includes("task==='write'?verb.display"),'separable verbs are written with the | mark');
 assert.ok(page.includes("answer.replace('|','')"),'the | mark is not part of the saved answer');
 assert.ok(page.includes('prefixOptions(verb)')&&page.includes("void submit(answer+' '+prefix)"));
 assert.ok(page.includes('<VerbGame ')&&page.includes('gameIds.map'));
 const copy=load('verb-copy');for(const key of ['gamesTitle','gameSentence','gameAux','gameBuild','gameMatch','gapPraesens','gapPerfekt'])assert.ok(copy.verbCopy[key]);
});

test('Fiil Atölyesi: four parts cover every verb once, the path has four meaning steps per verb and a card opens each verb',()=>{
 const all=families.verbFamilies.flatMap(f=>f.verbs);assert.equal(all.length,38);assert.equal(new Set(all).size,38);
 for(const verb of verbs.verbs)assert.ok(families.verbFamilyOf(verb.id),verb.id);
 for(const family of families.verbFamilies)for(const language of languages){assert.ok(families.familyTitle(family,language).trim());assert.ok(families.familyRule(family,language).length>20);}
 // Four parts by meaning: movement first, every part named and described in every language.
 const byId=id=>verbs.verbMap.get(id);const logic=load('verb-logic');
 assert.equal(families.verbFamilies.length,4);assert.deepEqual(families.verbFamilies.map(f=>f.id),['verbs-w1','verbs-w2','verbs-w3','verbs-w4']);
 assert.ok(families.verbFamilies[0].verbs.includes('gehen')&&families.verbFamilies[0].verbs.includes('kommen')&&families.verbFamilies[0].verbs.includes('fahren'));
 assert.equal(families.familyTitle(families.verbFamilies[0],'tr'),'Hareket');
 const ids=workshop.workshopIds();assert.equal(ids.length,38*4);assert.equal(new Set(ids).size,ids.length);
 for(const id of ids)assert.ok(practice.isVerbExercise(course.questionMap.get(id)),id);
 assert.deepEqual(ids.slice(0,4).map(id=>course.questionMap.get(id).verbTask),['meaning','word','write','hear']);
 const questions=ids.map(id=>({id}));const lookup=id=>course.questionMap.get(id);
 const first=workshop.pathPlace(questions,0,lookup);assert.equal(first.verb.id,'gehen');assert.ok(first.chapterStart&&first.stageStart);assert.equal(first.stage,'meaning');assert.equal(first.verbNumber,1);
 for(const i of [1,2,3]){const later=workshop.pathPlace(questions,i,lookup);assert.ok(!later.stageStart&&!later.chapterStart);assert.equal(later.step,i);assert.equal(later.stage,'meaning');}
 const second=workshop.pathPlace(questions,4,lookup);assert.equal(second.verb.id,'kommen');assert.ok(second.stageStart&&!second.chapterStart);assert.equal(second.verbNumber,2);
 const part2=workshop.pathPlace(questions,11*4,lookup);assert.equal(part2.family.number,2);assert.ok(part2.chapterStart);assert.equal(part2.verb.id,'essen');
 assert.deepEqual(study.selectQuestions('workshop','verbs-all',ids.length,[],ids).map(q=>q.id),ids,'the path keeps its order');
 assert.ok(practice.verbModePredicate('workshop')(course.questionMap.get('verb-hear-essen'))&&practice.verbModePredicate('workshop')(course.questionMap.get('verb-write-essen')));
 const progress1=workshop.workshopProgress({answered:9,total:152});assert.equal(progress1.verbsDone,2);assert.ok(!progress1.finished);
 assert.ok(workshop.workshopProgress({answered:152,total:152}).finished);
 assert.equal(workshop.findWorkshop([{id:'a',mode:'mixed',topic:'verbs-all',finished_at:1},{id:'b',mode:'workshop',topic:'verbs-all',finished_at:null},{id:'c',mode:'workshop',topic:'verbs-all',finished_at:2}]).id,'b');
 assert.ok(workshop.isCurrentPath({mode:'workshop',questions}));assert.ok(!workshop.isCurrentPath({mode:'workshop',questions:questions.slice(1)}));
 // Sentence task: the verb is shown, the answer is its form for the subject, the wrong options are the other persons (du, ich, wir, ihr), the prefix at the end.
 for(const verb of verbs.verbs){
  const fit=course.questionMap.get('verb-fit-'+verb.id);assert.equal(fit.kind,'choice');assert.equal(fit.options.length,4);assert.equal(new Set(fit.options).size,4);
  assert.equal(fit.answer,verb.praesens);assert.equal(fit.options[0],verb.praesens);assert.ok(fit.prompt.startsWith(verb.display+' · '));
  const prefix=verb.display.includes('|')?verb.display.split('|')[0]:'';
  for(const option of fit.options)assert.ok(prefix?option.endsWith(' '+prefix):!option.includes(' '),verb.id+' '+option);
 }
 const fitOptions=id=>course.questionMap.get('verb-fit-'+id).options;
 assert.deepEqual(fitOptions('fahren'),['fährt','fährst','fahre','fahren']);
 assert.deepEqual(fitOptions('essen'),['isst','esse','essen','esst']);
 assert.deepEqual(fitOptions('finden'),['findet','findest','finde','finden']);
 assert.deepEqual(fitOptions('gelten'),['gilt','giltst','gelte','gelten']);
 assert.deepEqual(fitOptions('einladen'),['lädt ein','lädst ein','lade ein','laden ein']);
 assert.deepEqual(fitOptions('aufstehen'),['steht auf','stehst auf','stehe auf','stehen auf']);
 assert.deepEqual(fitOptions('leidtun'),['tut leid','tust leid','tue leid','tun leid']);
 assert.deepEqual(verbs.seededOptions(['a','b','c','d'],'x'),verbs.seededOptions(['a','b','c','d'],'x'));
 assert.equal(logic.praesensForm(byId('fahren')),'fährt');assert.equal(logic.praesensForm(byId('aufstehen')),'steht … auf');assert.equal(logic.praesensForm(byId('leidtun')),'tut … leid');
 const page=fs.readFileSync('app/verb-study.tsx','utf8');
 assert.ok(!page.includes("v('resume')"),'no resume card on the page');
 assert.ok(page.includes('<SiteHeader ')&&page.includes('<ChapterCard ')&&page.includes('<LearnCard ')&&page.includes('<PathStepper '));
 assert.ok(page.includes("kind==='fit')return {text:formWithGap(option,question)")&&page.includes("task==='fit'&&verb?verb.praesens")&&page.includes("stored.includes(q.answer)?stored:"),'sentence options show the forms, the spoken answer is the form, old rounds fall back to fresh choices');
 for(const key of ['workshopTitle','workshopLead','workshopEnter','stepPick','stepListen','gotIt','promptFit','pathDone'])assert.ok(copy.verbCopy[key]);
 assert.ok(!page.includes('startKarma')&&!page.includes('data-verb-karma'),'no Karma sınav on the page');
 assert.ok(page.includes("(kind!=='meaning'&&kind!=='hear')||!!feedback"),'pictures hidden for meaning and listening questions');
});
