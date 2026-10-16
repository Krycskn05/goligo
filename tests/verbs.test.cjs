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
 const kinds=['meaning','word','fit','praesens','perfekt','meaning-perfekt','write','write-praesens','write-perfekt','hear','hear-praesens','hear-perfekt'];
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
 // Meaning → Perfekt: the right Perfekt among the Perfekt forms of other verbs (a same-stem verb first), all different.
 for(const verb of verbs.verbs){
  const q=course.questionMap.get('verb-meaning-perfekt-'+verb.id);assert.equal(q.kind,'choice');assert.equal(q.answer,verb.perfekt);assert.equal(q.options[0],verb.perfekt);
  assert.ok(q.prompt.includes(verb.meanings[0]),q.id);assert.ok(practice.isVerbTestQuestion(q),q.id);
  for(const option of q.options.slice(1))assert.ok(verbs.verbs.some(other=>other.id!==verb.id&&other.perfekt===option),q.id+' '+option);
 }
 assert.deepEqual(course.questionMap.get('verb-meaning-perfekt-abfahren').options[1],'ist gefahren');
 assert.deepEqual(course.questionMap.get('verb-meaning-perfekt-mitkommen').options.slice(1,3).sort(),['ist angekommen','ist gekommen']);
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
 assert.equal(practice.verbPool('test','verbs-1').length,60,'10 verbs × 6 test questions');assert.equal(practice.verbPool('write','verbs-4').length,24);
 const ids=practice.verbPool('test','verbs-1').map(q=>q.id);
 const reviews=[{question_id:ids[0],wrong_count:1,streak:0,seen:1,last_answer:'x',last_wrong:'x',last_at:1,due_at:1},{question_id:ids[1],wrong_count:0,streak:1,seen:1,last_answer:'y',last_wrong:null,last_at:1,due_at:1}];
 const fresh=practice.pickVerbRound('test','verbs-1',reviews,false,undefined,{fresh:true}).map(q=>q.id);
 assert.ok(fresh.includes(ids[0])&&!fresh.includes(ids[1]));assert.equal(fresh.length,59);
 const review=practice.pickVerbRound('test','verbs-1',reviews,true,undefined,{starred:new Set([ids[2]])}).map(q=>q.id).sort();
 assert.deepEqual(review,[ids[0],ids[2]].sort());
 assert.equal(study.selectQuestions('test','verbs-1',50,reviews,ids)[0].id,ids[0],'open mistakes come first');
 assert.equal(progress.verbProgressIds('verbs-all').length,38*12);
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
 // Everything the workshop cards read aloud (speaker button, Präsens table, sentences for every person) has a natural clip.
 const persons=load('verb-persons');const spoken=persons.workshopSpeechTexts();
 for(const text of spoken)assert.ok(texts.has(text),text);
 const fahren=verbs.verbMap.get('einladen');
 assert.deepEqual(persons.conjugationRows(fahren).map(row=>row.spoken),['ich lade ein','du lädst ein','er lädt ein','wir laden ein','ihr ladet ein','sie laden ein']);
 assert.equal(persons.learnSpeech(fahren,'meaning'),'einladen');assert.equal(persons.learnSpeech(fahren,'perfekt'),'er hat eingeladen');
 const cards=fs.readFileSync('app/verb-workshop.tsx','utf8');
 assert.ok(cards.includes('const rows=conjugationRows(verb);')&&cards.includes('onClick={()=>speech.speak(spoken)}')&&cards.includes('const spoken=learnSpeech(verb,stage);')&&cards.includes('onClick={()=>speech.speak(row.text)}'),'the cards speak exactly these texts');
 // Long voice runs stop in time and continue in a new run.
 assert.match(fs.readFileSync('scripts/voices/make-voices.py','utf8'),/VOICE_BUDGET_MIN/);
 assert.match(fs.readFileSync('scripts/voices/build.sh','utf8'),/gh workflow run sesler\.yml/);
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

test('Fiil Atölyesi: two parts in book order, each verb whole (meaning, then at once its Perfekt), cards open the part and every stage',()=>{
 const all=families.verbFamilies.flatMap(f=>f.verbs);assert.equal(all.length,38);assert.equal(new Set(all).size,38);
 for(const verb of verbs.verbs)assert.ok(families.verbFamilyOf(verb.id),verb.id);
 for(const family of families.verbFamilies)for(const language of languages){assert.ok(families.familyTitle(family,language).trim());assert.ok(families.familyRule(family,language).length>20);}
 // Part 1 runs from ab|fahren to essen (the learner's line), part 2 from fahren to mit|kommen, both in the book's order.
 const byId=id=>verbs.verbMap.get(id);const logic=load('verb-logic');
 assert.equal(families.verbFamilies.length,2);assert.deepEqual(families.verbFamilies.map(f=>f.id),['verbs-w1','verbs-w2']);
 assert.deepEqual(families.verbFamilies.map(f=>f.verbs.length),[19,19]);
 assert.deepEqual(families.verbFamilies[0].verbs,verbs.verbs.slice(0,19).map(v=>v.id));assert.deepEqual(families.verbFamilies[1].verbs,verbs.verbs.slice(19).map(v=>v.id));
 assert.equal(families.verbFamilies[0].verbs[18],'essen');assert.equal(families.verbFamilies[1].verbs[0],'fahren');
 const ids=workshop.workshopIds();assert.equal(ids.length,38*5,'every verb: one test and one spelling for its meaning; one test, one spelling and meaning → Perfekt for its Perfekt');assert.equal(new Set(ids).size,ids.length);
 for(const id of ids)assert.ok(practice.isVerbExercise(course.questionMap.get(id)),id);
 // A verb is finished in one go: its meaning steps, then straight away its Perfekt steps; only then the next verb.
 assert.deepEqual(workshop.verbSteps,['meaning','write','perfekt','write-perfekt','meaning-perfekt']);
 assert.deepEqual(ids.slice(0,5).map(id=>course.questionMap.get(id).verbTask),['meaning','write','perfekt','write-perfekt','meaning-perfekt']);
 assert.ok(ids.slice(0,5).every(id=>course.questionMap.get(id).verbId==='abfahren'));assert.equal(course.questionMap.get(ids[5]).verbId,'abgeben');assert.equal(course.questionMap.get(ids[5]).verbTask,'meaning');
 assert.ok(!ids.some(id=>course.questionMap.get(id).verbTask==='word'),'one test per verb: no second choice question');
 assert.ok(!ids.some(id=>course.questionMap.get(id).kind==='listen'),'no listening questions on the path');
 assert.equal(course.questionMap.get(ids[95]).verbId,'fahren');
 const questions=ids.map(id=>({id}));const lookup=id=>course.questionMap.get(id);
 const first=workshop.pathPlace(questions,0,lookup);assert.equal(first.verb.id,'abfahren');assert.ok(first.chapterStart&&first.stageStart);assert.equal(first.stage,'meaning');assert.equal(first.verbNumber,1);assert.equal(first.steps.length,2);assert.equal(first.layout,'verb');
 for(const i of [1]){const later=workshop.pathPlace(questions,i,lookup);assert.ok(!later.stageStart&&!later.chapterStart);assert.equal(later.step,i);}
 const perfekt=workshop.pathPlace(questions,2,lookup);assert.equal(perfekt.verb.id,'abfahren');assert.equal(perfekt.stage,'perfekt');assert.ok(perfekt.stageStart&&!perfekt.chapterStart,'the Perfekt of a verb opens its learning card, not a part card');assert.equal(perfekt.steps.length,3);assert.equal(perfekt.step,0);assert.equal(perfekt.verbNumber,1);
 assert.equal(workshop.pathPlace(questions,4,lookup).step,2);
 const second=workshop.pathPlace(questions,5,lookup);assert.equal(second.verb.id,'abgeben');assert.equal(second.stage,'meaning');assert.ok(second.stageStart&&!second.chapterStart);assert.equal(second.verbNumber,2);
 const part2=workshop.pathPlace(questions,95,lookup);assert.equal(part2.family.number,2);assert.equal(part2.stage,'meaning');assert.ok(part2.chapterStart);assert.equal(part2.verb.id,'fahren');
 assert.deepEqual(study.selectQuestions('workshop','verbs-all',ids.length,[],ids).map(q=>q.id),ids,'the path keeps its order');
 assert.ok(practice.verbModePredicate('workshop')(course.questionMap.get('verb-hear-essen'))&&practice.verbModePredicate('workshop')(course.questionMap.get('verb-write-perfekt-essen')));
 // No part is locked: each part is its own round of 95 questions for 19 verbs. Older rounds: `stage` (95: all meanings, then all Perfekt), `legacy` (76: the same with two Perfekt steps).
 const [w1,w2]=families.verbFamilies;const P=workshop.partTotal(w1);assert.equal(P,95);assert.equal(workshop.partTotal(w2),95);assert.equal(workshop.partTotal(w1,'stage'),95);assert.equal(workshop.partTotal(w1,'legacy'),76);
 assert.deepEqual(workshop.partIds(w1),ids.slice(0,95));assert.deepEqual(workshop.partIds(w2),ids.slice(95));
 const stagedIds=workshop.partIds(w1,'stage');assert.equal(stagedIds.length,95);assert.deepEqual(new Set(stagedIds),new Set(workshop.partIds(w1)),'the same questions in another order');
 assert.ok(stagedIds.slice(0,38).every(id=>/^verb-(meaning|write)-/.test(id)));assert.equal(stagedIds[38],'verb-perfekt-abfahren');assert.deepEqual(stagedIds.slice(38,41),['verb-perfekt-abfahren','verb-write-perfekt-abfahren','verb-meaning-perfekt-abfahren']);
 const oldIds=workshop.workshopIds('legacy');assert.equal(oldIds.length,152);assert.deepEqual(workshop.partIds(w2,'legacy'),oldIds.slice(76));assert.ok(!oldIds.some(id=>id.startsWith('verb-meaning-perfekt-')));
 // Progress in the current layout: 5 steps per verb; the meaning tick after two, the Perfekt tick after five.
 const p6=workshop.partProgress(w1,6);assert.equal(p6.stage,'meaning');assert.equal(p6.meaningDone,1);assert.equal(p6.perfektDone,1);assert.equal(p6.stageVerbsDone,1);assert.equal(p6.nextVerbId,'abgeben');assert.ok(p6.started&&!p6.finished);assert.equal(p6.layout,'verb');
 const p7=workshop.partProgress(w1,7);assert.equal(p7.stage,'perfekt');assert.equal(p7.meaningDone,2);assert.equal(p7.perfektDone,1);assert.equal(p7.nextVerbId,'abgeben');
 const p10=workshop.partProgress(w1,10);assert.equal(p10.meaningDone,2);assert.equal(p10.perfektDone,2);assert.equal(p10.stage,'meaning');assert.equal(p10.nextVerbId,'anbieten');
 assert.deepEqual(p7.marks.slice(0,3),[{meaning:true,perfekt:true},{meaning:true,perfekt:false},{meaning:false,perfekt:false}]);
 const fresh2=workshop.partProgress(w2,0);assert.equal(fresh2.nextVerbId,'fahren');assert.ok(!fresh2.started);
 assert.ok(workshop.partProgress(w1,95).finished);assert.ok(!workshop.partProgress(w1,94).finished);assert.equal(workshop.partProgress(w1,94).perfektDone,18);assert.equal(workshop.partProgress(w1,94).meaningDone,19);
 // Progress of the older layouts, as they stand: staged (two, then three steps) and legacy (two, then two).
 const s38=workshop.partProgress(w1,38,'stage');assert.equal(s38.stage,'perfekt');assert.equal(s38.stageVerbsDone,0);assert.equal(s38.nextVerbId,'abfahren');assert.equal(s38.meaningDone,19);assert.equal(s38.count,95);
 assert.equal(workshop.partProgress(w1,6,'stage').meaningDone,3);assert.equal(workshop.partProgress(w1,6,'stage').perfektDone,0);assert.equal(workshop.partProgress(w1,6,'stage').nextVerbId,'anfangen');
 assert.equal(workshop.partProgress(w1,40,'stage').perfektDone,0);assert.equal(workshop.partProgress(w1,41,'stage').perfektDone,1);
 const l40=workshop.partProgress(w1,40,'legacy');assert.equal(l40.perfektDone,1);assert.equal(l40.count,76);assert.ok(!l40.finished);assert.ok(workshop.partProgress(w1,76,'legacy').finished);
 // Rounds: a part round is known by its first question; its layout by its size or its third question; an older whole-path round (152) counts for part 1 and ends after it.
 const round=(id,first,total,answered,finished_at=null,third=undefined)=>({id,mode:'workshop',topic:'verbs-all',first,total,answered,finished_at,third});
 assert.equal(workshop.summaryLayout({total:95,third:'verb-perfekt-abfahren'}),'verb');assert.equal(workshop.summaryLayout({total:95,third:'verb-meaning-abgeben'}),'stage');
 assert.equal(workshop.summaryLayout({total:95}),'verb');assert.equal(workshop.summaryLayout({total:76,third:'verb-meaning-abgeben'}),'legacy');assert.equal(workshop.summaryLayout({total:152}),'legacy');
 const legacy=round('old',ids[0],152,33);const round2=round('p2',workshop.partIds(w2)[0],76,10);
 assert.equal(workshop.sessionPart(round('n',workshop.partIds(w2)[0],95,50)).id,'verbs-w2');assert.equal(workshop.partAnswered(round('n',ids[0],95,50),w1),50);
 assert.equal(workshop.partAnswered(round('o',ids[0],76,40),w1),40);assert.equal(workshop.partAnswered(round('o',ids[0],76,76),w1),76);assert.equal(workshop.partAnswered(legacy,w1),33);assert.equal(workshop.partAnswered(round('old',ids[0],152,90),w1),76);const other={id:'x',mode:'mixed',topic:'verbs-all',total:30,answered:3,finished_at:null};
 assert.equal(workshop.sessionPart(legacy).id,'verbs-w1');assert.equal(workshop.sessionPart(round2).id,'verbs-w2');assert.equal(workshop.sessionPart(other),undefined);
 const sessions=[round2,legacy,other];
 assert.equal(workshop.findPartSession(sessions,w1).id,'old');assert.equal(workshop.findPartSession(sessions,w2).id,'p2');
 const parts=workshop.partsStatus(sessions);assert.deepEqual(parts.map(p=>p.done),[33,10]);assert.deepEqual(parts.map(p=>p.layout),['legacy','legacy']);
 assert.equal(workshop.currentPart(sessions).family.id,'verbs-w2','the part practised last is continued');
 assert.equal(workshop.currentPart([]).family.id,'verbs-w1');
 assert.equal(workshop.currentPart([round('a',ids[0],76,76,5)]).family.id,'verbs-w2','a finished part moves on to the next one');
 const past=workshop.partsStatus([round('old',ids[0],152,90)])[0];assert.equal(past.done,76);assert.ok(past.finished,'an old round past part 1 counts as part 1 done');
 const status=workshop.verbStatus([round('a',ids[0],76,40),round('b',workshop.partIds(w2)[0],76,2)]);
 assert.deepEqual(status.get('abfahren'),{meaning:true,perfekt:true});assert.deepEqual(status.get('abgeben'),{meaning:true,perfekt:false});assert.deepEqual(status.get('fahren'),{meaning:true,perfekt:false});assert.deepEqual(status.get('finden'),{meaning:false,perfekt:false});
 const whole=workshop.verbStatus([round('v',ids[0],95,7,null,'verb-perfekt-abfahren')]);
 assert.deepEqual(whole.get('abfahren'),{meaning:true,perfekt:true});assert.deepEqual(whole.get('abgeben'),{meaning:true,perfekt:false});assert.deepEqual(whole.get('anbieten'),{meaning:false,perfekt:false});
 const staged=workshop.verbStatus([round('s',ids[0],95,7,null,'verb-meaning-abgeben')]);
 assert.deepEqual(staged.get('abfahren'),{meaning:true,perfekt:false});assert.deepEqual(staged.get('anbieten'),{meaning:true,perfekt:false});assert.deepEqual(staged.get('anfangen'),{meaning:false,perfekt:false});
 assert.equal(workshop.WORKSHOP_TOTAL,190);assert.equal(workshop.LEGACY_WORKSHOP_TOTAL,152);
 const oldQuestions=oldIds.map(id=>({id}));const stagedQuestions=stagedIds.map(id=>({id}));
 assert.ok(workshop.isPartRound({mode:'workshop',questions:oldQuestions},w1),'an old whole-path round continues as part 1');
 assert.ok(!workshop.isPartRound({mode:'workshop',questions},w1),'the whole path is no round of its own any more');
 assert.ok(workshop.isPartRound({mode:'workshop',questions:workshop.partIds(w2).map(id=>({id}))},w2));assert.ok(!workshop.isPartRound({mode:'workshop',questions:workshop.partIds(w2).map(id=>({id}))},w1));
 assert.ok(workshop.isPartRound({mode:'workshop',questions:workshop.partIds(w2,'legacy').map(id=>({id}))},w2),'an older part round continues');
 assert.ok(workshop.isPartRound({mode:'workshop',questions:stagedQuestions},w1),'a staged part round continues');assert.ok(!workshop.isPartRound({mode:'workshop',questions:stagedQuestions},w2));
 assert.equal(workshop.roundEnd({mode:'workshop',questions:oldQuestions}),76);assert.equal(workshop.roundEnd({mode:'workshop',questions:oldQuestions.slice(0,76)}),76);assert.equal(workshop.roundEnd({mode:'workshop',questions:questions.slice(0,95)}),95);
 // Each round keeps its own layout: the stepper of a legacy round shows two Perfekt steps; a staged round opens a part card at its Perfekt stage; the current one does not.
 assert.equal(workshop.roundLayout(oldQuestions.slice(0,76)),'legacy');assert.equal(workshop.roundLayout(questions.slice(0,95)),'verb');assert.equal(workshop.roundLayout(stagedQuestions),'stage');assert.equal(workshop.roundLayout(oldQuestions),'legacy');
 assert.equal(workshop.pathPlace(oldQuestions,38,lookup).steps.length,2);assert.ok(workshop.isLegacyRound(oldQuestions.slice(0,76))&&!workshop.isLegacyRound(questions.slice(0,95)));
 const stagedPerfekt=workshop.pathPlace(stagedQuestions,38,lookup);assert.equal(stagedPerfekt.layout,'stage');assert.ok(stagedPerfekt.chapterStart&&stagedPerfekt.stageStart);assert.equal(stagedPerfekt.steps.length,3);assert.equal(stagedPerfekt.verb.id,'abfahren');
 // The page: after spelling, one step further asks the Perfekt from the meaning; its result card shows no example sentences again.
 const pageText=fs.readFileSync('app/verb-study.tsx','utf8');
 assert.ok(pageText.includes("kind==='meaning-perfekt'?t('promptMeaningPerfekt')")&&pageText.includes("examples={q.verbTask!=='meaning-perfekt'}")&&pageText.includes("kind!=='meaning-perfekt'&&kind!=='hear'"),'meaning → Perfekt on the page');
 for(const language of languages)assert.ok(copy.verbText(language,'promptMeaningPerfekt').includes('Perfekt')&&copy.verbText(language,'stepMeaningPerfekt').includes('Perfekt'),language);
 // The page: the part card says meaning and Perfekt come together; the study API tells a round's third question so the map reads older rounds right.
 assert.ok(pageText.includes("both={place.layout==='verb'}"),'the part card knows the verb-by-verb flow');
 const cardSrc=fs.readFileSync('app/verb-workshop.tsx','utf8');assert.ok(cardSrc.includes("{both?t('stageBoth'):perfekt?t('stepPerfekt'):t('stageMeanings')}")&&cardSrc.includes("{both&&<p className=\"verb-chapter-rule verb-chapter-flow\">{t('verbFlow')}</p>}"));
 for(const language of languages){assert.ok(copy.verbText(language,'stageBoth').includes('Perfekt'),language);assert.ok(copy.verbText(language,'verbFlow').includes('Perfekt'),language);}
 assert.ok(fs.readFileSync('app/api/study/route.ts','utf8').includes("first:list[0]?.id??null,third:list[2]?.id??null"),'the summary carries the first and the third question');
 // The page: islands start or continue their part; no lock is shown.
 const pageSrc=fs.readFileSync('app/verb-study.tsx','utf8');
 assert.ok(pageSrc.includes('onClick={()=>openPart(family)}')&&!pageSrc.includes('<Lock')&&!pageSrc.includes("'locked'"),'every part opens from the map');
 for(const language of languages)for(const key of ['chapterContinue','chapterAgain'])assert.ok(copy.verbText(language,key).trim(),key);
 for(const language of languages)assert.ok(copy.verbText(language,'partDone',{n:2,total:19}).includes('19'),language);
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
 for(const key of ['workshopTitle','workshopLead','workshopEnter','stepPick','stepListen','stageMeanings','perfektChapter','gotIt','promptFit','pathDone'])assert.ok(copy.verbCopy[key]);
 assert.ok(!page.includes('startKarma')&&!page.includes('data-verb-karma'),'no Karma sınav on the page');
 // No single example sentence on the learning cards (the meaning card shows the conjugation table); after an answer: one sentence per person (next test).
 const cards=fs.readFileSync('app/verb-workshop.tsx','utf8');const learnCard=cards.slice(cards.indexOf('export function LearnCard'),cards.indexOf('export function ChapterCard'));
 assert.ok(!learnCard.includes('<ExampleSentence'),'learning cards show no example sentence');
 // The meaning card shows the Präsens forms for ich, du, er/sie/es, wir, ihr, sie/Sie instead.
 assert.ok(learnCard.includes("stage==='meaning'?<ConjugationTable")&&cards.includes('const rows=conjugationRows(verb);'));
 const persons=id=>{const f=verbs.praesensPersons(byId(id));return [f.ich,f.du,f.er,f.wir,f.ihr];};
 assert.deepEqual(persons('fahren'),['fahre','fährst','fährt','fahren','fahrt']);
 assert.deepEqual(persons('abfahren'),['fahre ab','fährst ab','fährt ab','fahren ab','fahrt ab']);
 assert.deepEqual(persons('essen'),['esse','isst','isst','essen','esst']);
 assert.deepEqual(persons('lesen'),['lese','liest','liest','lesen','lest']);
 assert.deepEqual(persons('heißen'),['heiße','heißt','heißt','heißen','heißt']);
 assert.deepEqual(persons('finden'),['finde','findest','findet','finden','findet']);
 assert.deepEqual(persons('anbieten'),['biete an','bietest an','bietet an','bieten an','bietet an']);
 assert.deepEqual(persons('gelten'),['gelte','giltst','gilt','gelten','geltet']);
 assert.deepEqual(persons('einladen'),['lade ein','lädst ein','lädt ein','laden ein','ladet ein']);
 assert.deepEqual(persons('empfehlen'),['empfehle','empfiehlst','empfiehlt','empfehlen','empfehlt']);
 assert.deepEqual(persons('gefallen'),['gefalle','gefällst','gefällt','gefallen','gefallt']);
 assert.deepEqual(persons('leidtun'),['tue leid','tust leid','tut leid','tun leid','tut leid']);
 for(const verb of verbs.verbs){const f=verbs.praesensPersons(verb);assert.equal(f.er,verb.praesens,verb.id);assert.equal(new Set([f.ich,f.wir]).size,2,verb.id);}
 for(const language of languages)assert.ok(copy.verbText(language,'conjugationTitle').includes('Präsens'));
 assert.ok(!page.includes("sentenceText(item,'praesens')"),'meaning feedback shows no single sie/er sentence');
 assert.ok(page.includes("(kind!=='meaning'&&kind!=='meaning-perfekt'&&kind!=='hear'&&kind!=='hear-perfekt')||!!feedback"),'pictures hidden for meaning and listening questions');
});
test('after an answer every person gets an example sentence: Präsens after meanings, Perfekt after Perfekt',()=>{
 const persons=load('verb-persons');const byId=id=>verbs.verbMap.get(id);
 assert.deepEqual([...persons.personKeys],['ich','du','er','sie','es','wir','ihr','sie-plural','Sie']);
 assert.deepEqual([...persons.personSentenceVerbs].sort(),verbs.verbs.map(v=>v.id).sort());
 const helper={hat:['habe','hast','hat','hat','hat','haben','habt','haben','haben'],ist:['bin','bist','ist','ist','ist','sind','seid','sind','sind']};
 const subjects={ich:['ich'],du:['du'],er:['er'],sie:['sie'],es:['es','das'],wir:['wir'],ihr:['ihr'],'sie-plural':['sie'],Sie:['Sie']};
 const objects={dative:['mir','dir','ihm','ihr',['ihm','dem'],'uns','euch','ihnen','Ihnen'],fuer:['mich','dich','ihn','sie',['es','das'],'uns','euch','sie','Sie']};
 for(const verb of verbs.verbs)for(const tense of ['praesens','perfekt']){
  const rows=persons.personSentences(verb,tense);assert.equal(rows.length,9,verb.id+' '+tense);
  // Nine different A1 sentences: short, one line, statements mixed with questions and negations.
  assert.equal(new Set(rows.map(r=>r.text)).size,9,verb.id+' '+tense+' all different');
  assert.ok(rows.filter(r=>r.text.endsWith('?')).length>=2,verb.id+' '+tense+' questions');
  if(verb.id!=='leidtun')assert.ok(rows.some(r=>/\b(nicht|kein\w*)\b/i.test(r.text)),verb.id+' '+tense+' a negation');
  rows.forEach((row,i)=>{
   assert.match(row.text,/^[A-ZÄÖÜ].*[.?!]$/,row.text);assert.ok(row.text.length<=40,row.text);assert.equal(row.index,i);
   assert.equal(row.parts.map(p=>p.text).join(' ')+row.mark,row.text,'the marked parts rebuild the sentence');
   const role=name=>row.parts.filter(p=>p.role===name).map(p=>p.text.toLowerCase());
   const words=row.text.replace(/[.?!,]/g,'').split(' ');const last=words[words.length-1];
   if(tense==='perfekt'){assert.equal(last,verb.participle,row.text);assert.deepEqual(role('end'),[verb.participle.toLowerCase()],row.text);}
   if(persons.personMode(verb)==='subject'){
    const key=persons.personKeys[i];assert.ok(words.some(w=>subjects[key].includes(key==='Sie'?w:w.toLowerCase())),row.text+' has its subject');
    const f=verbs.praesensPersons(verb);const forms=[f.ich,f.du,f.er,f.er,f.er,f.wir,f.ihr,f.wir,f.wir];const prefix=verb.display.includes('|')?verb.display.split('|')[0]:'';
    if(tense==='praesens'){const finite=forms[i].split(' ')[0];assert.deepEqual(role('verb'),[finite.toLowerCase()],row.text);if(prefix){assert.equal(last,prefix,row.text);assert.deepEqual(role('end'),[prefix],row.text);}}
    else assert.ok(role('verb')[0]===helper[verb.aux][i]||(verb.alsoIst&&role('verb')[0]===helper.ist[i]),row.text);
   }else{
    const wanted=[objects[persons.personMode(verb)][i]].flat();assert.ok(wanted.includes(row.parts.find(p=>p.role==='person')?.text.split(' ')[0]),row.text+' marks the person');
    assert.equal(role('verb').length,1,row.text);
   }
  });
 }
 const text=(id,tense)=>persons.personSentences(byId(id),tense).map(row=>row.text);
 assert.deepEqual(text('abfahren','praesens').slice(0,3),['Ich fahre um acht Uhr ab.','Wann fährst du morgen ab?','Er fährt heute nicht ab.']);
 assert.deepEqual(persons.personSentences(byId('abfahren'),'praesens')[1].parts,[{text:'Wann',role:'plain'},{text:'fährst',role:'verb'},{text:'du morgen',role:'plain'},{text:'ab',role:'end'}]);
 assert.deepEqual(persons.personSentences(byId('gefallen'),'praesens')[4].parts.filter(p=>p.role==='person'),[{text:'dem Kind',role:'person'}]);
 assert.equal(text('leidtun','praesens')[0],'Es tut mir leid.');
 assert.deepEqual(['gefallen','leidtun','gelten'].map(id=>persons.personMode(byId(id))),['dative','dative','fuer']);
 // The meaning of every sentence in each helper language, in the same order; German needs none.
 const meaningsModule=load('verb-example-meanings');
 assert.deepEqual([...meaningsModule.exampleMeaningLanguages].sort(),languages.filter(l=>l!=='de').sort());
 const german=JSON.parse(fs.readFileSync('lib/verb-examples.json','utf8'));
 assert.deepEqual(Object.keys(german).sort(),verbs.verbs.map(v=>v.id).sort());
 for(const language of meaningsModule.exampleMeaningLanguages){
  const meanings=JSON.parse(fs.readFileSync('lib/verb-examples.'+language+'.json','utf8'));
  assert.deepEqual(Object.keys(meanings),Object.keys(german),language);
  for(const [id,[pr,pf]] of Object.entries(meanings)){assert.equal(pr.length,9,language+' '+id);assert.equal(pf.length,9,language+' '+id);for(const line of [...pr,...pf])assert.ok(line.trim()&&line.length<70,language+' '+id+' '+line);}
  assert.equal(meaningsModule.exampleMeaning(meanings,'abfahren','perfekt',0),meanings.abfahren[1][0]);
 }
 assert.equal(meaningsModule.exampleMeaning(null,'abfahren','praesens',0),'');
 const examplesCard=fs.readFileSync('app/verb-workshop.tsx','utf8');
 assert.ok(examplesCard.includes('const meaning=exampleMeaning(meanings,verb.id,tense,row.index);')&&examplesCard.includes('className="verb-person-meaning" lang={language} dir={dir}'),'each sentence shows its meaning below it');
 for(const language of languages){
  assert.ok(copy.verbText(language,'examplesTitle',{t:'Präsens'}).includes('Präsens'),language);
  for(const key of ['pronounPlural','pronounFormal'])assert.ok(copy.verbText(language,key).trim(),language+' '+key);
  assert.ok(copy.verbText(language,'personDative').length<60,language);assert.ok(copy.verbText(language,'personFuer').includes('für mich')&&copy.verbText(language,'personFuer').length<70,language);
 }
 // After a test answer the result card shows them: Präsens after the meaning test, Perfekt after the Perfekt test; tapping a row reads it.
 const page=fs.readFileSync('app/verb-study.tsx','utf8');const cards=fs.readFileSync('app/verb-workshop.tsx','utf8');
 const result=cards.slice(cards.indexOf('export function AnswerResult'),cards.indexOf('export function ChapterCard'));
 assert.ok(result.includes("<PersonSentences verb={verb} tense={stage==='perfekt'?'perfekt':'praesens'}")&&result.includes('<VerbPicture verb={verb}'),'picture on top, examples below');
 assert.ok(page.includes("const answered=!!feedback&&!writing;")&&page.includes('{answered&&feedback?<AnswerResult verb={verb} stage={learnStage(q.verbTask)}'),'a test answer opens the result card');
 assert.ok(page.includes('spoken={pronunciation}')&&page.includes('answerAudio.answer(gradeAnswer(q,answer),pronunciation)'),'after the effect only the correct answer is spoken');
 assert.ok(!page.includes('<PersonSentences'),'no example sentences after spelling');
 // Phones: each step starts at the top of the practice area, so the card fits without dragging.
 assert.ok(page.includes("box.scrollIntoView({block:'start',behavior:'instant'})")&&page.includes("focus({preventScroll:true});toPractice();"));
 assert.ok(cards.includes('onClick={()=>speech.speak(row.text)}'),'a sentence is read only when tapped');
});

test('the cards say regular, irregular or modal; irregular names and forms get their own colour',()=>{
 const kinds=load('verb-kind');
 // The 38 verbs of the book page are all irregular (strong or mixed).
 for(const verb of verbs.verbs)assert.equal(kinds.verbKind(verb),'irregular',verb.id);
 const byId=id=>verbs.verbMap.get(id);
 assert.deepEqual(kinds.verbKindInfo(byId('fahren')).changedPersons,['du','er']);assert.ok(kinds.verbKindInfo(byId('fahren')).irregularPartizip);
 assert.deepEqual(kinds.verbKindInfo(byId('anrufen')).changedPersons,[]);assert.ok(kinds.verbKindInfo(byId('anrufen')).irregularPartizip);
 assert.deepEqual(kinds.verbKindInfo(byId('kennen')).changedPersons,[]);assert.ok(kinds.verbKindInfo(byId('kennen')).irregularPartizip,'gekannt is irregular');
 const make=(display,praesens,participle)=>({...byId('kennen'),id:display.replace('|',''),display,infinitive:display.replace('|',''),praesens,participle});
 assert.equal(kinds.verbKind(make('machen','macht','gemacht')),'regular');assert.equal(kinds.verbKind(make('ab|holen','holt ab','abgeholt')),'regular');
 assert.equal(kinds.verbKind(make('arbeiten','arbeitet','gearbeitet')),'regular');assert.equal(kinds.verbKind(make('besuchen','besucht','besucht')),'regular');
 assert.equal(kinds.verbKind(make('können','kann','gekonnt')),'modal');
 for(const language of languages)for(const key of ['kindIrregular','kindRegular','kindModal','kindModalNote','partVerbsTitle','partVerbsLead','backToPart','prevVerb','nextVerb','verbDoneMeaning','verbDonePerfekt','verbNotDone'])assert.ok(copy.verbText(language,key).trim(),language+' '+key);
 for(const language of languages){assert.ok(copy.verbText(language,'kindStem',{verb:'du fährst'}).includes('du fährst'));assert.ok(copy.verbText(language,'kindPartizip',{verb:'gefahren'}).includes('gefahren'));assert.ok(copy.verbText(language,'partOpen',{n:2}).includes('2'));}
 const cards=fs.readFileSync('app/verb-workshop.tsx','utf8');const css=fs.readFileSync('app/verbs.css','utf8');
 assert.ok(cards.includes('<VerbKindBadge verb={verb} language={language} note/>')&&cards.includes("className={'verb-conj-cell'+(irregular(pronoun)?' irregular':'')}"),'the card shows the badge and the changed forms');
 assert.match(css,/\.verb-irregular-form \{ color:#7a2fc0; \}/);
});
test('a part opens its verb list with what is done; a verb opens its own card',()=>{
 const page=fs.readFileSync('app/verb-study.tsx','utf8');const cards=fs.readFileSync('app/verb-workshop.tsx','utf8');
 assert.ok(page.includes('onClick={()=>openPart(family)}'),'the island opens the part');
 assert.ok(page.includes('<PartVerbs family={part.family} part={part} verbs={members} marks={stickers}')&&page.includes('onStart={restart=>void enterPart(part.family,restart)}'),'the list starts or continues the part');
 assert.ok(page.includes('<VerbDetail verb={item}')&&page.includes('onOpen={item=>openVerb(part.family,item.id)}'),'a verb opens its card');
 assert.ok(cards.includes("className={'verb-part-row'+(mark?.perfekt?' full':mark?.meaning?' half':'')}")&&cards.includes('<DoneMarks marks={mark} language={language}/>'),'done verbs are marked');
 assert.ok(cards.includes('<PersonSentences verb={verb} tense={tense} language={language} speech={speech}/>')&&cards.includes('<ConjugationTable verb={verb} language={language} speech={speech}/>'),'the card has the table and the sentences');
});
test('letter puzzles: a wrong letter goes back and counts, hints help, a full word is checked by itself',()=>{
 const puzzle=load('letter-puzzle');
 const model=puzzle.makeLetterPuzzle('fahren','seed-1');const gaps=model.editable;assert.ok(gaps.length>=2);
 const first=gaps[0];const right=model.parts[first].character;
 assert.ok(puzzle.letterFits(model,first,right));assert.ok(puzzle.letterFits(model,first,right.toUpperCase()));assert.ok(!puzzle.letterFits(model,first,right.toUpperCase(),true));
 const wrong=right==='x'?'y':'x';assert.ok(!puzzle.letterFits(model,first,wrong));
 const letters=Object.fromEntries(gaps.map(i=>[i,model.parts[i].character]));
 assert.equal(puzzle.scoredLetterAnswer(model,letters,puzzle.noMistakes),'fahren');
 const scored=puzzle.scoredLetterAnswer(model,letters,{count:1,first:{index:first,letter:wrong},boxes:[first]});
 assert.notEqual(scored,'fahren');assert.equal(scored.length,6);
 const q={id:'t',topic:'t',kind:'write',prompt:'',answer:'fahren',explanation:''};
 assert.equal(course.gradeAnswer(q,scored),false,'a wrong letter makes the question a mistake');assert.equal(course.gradeAnswer(q,'fahren'),true);
 assert.equal(puzzle.hintLimit(puzzle.makeLetterPuzzle('ab','s')),1);assert.equal(puzzle.hintLimit({parts:[],editable:[1,2,3,4,5,6,7]}),2);
 const choices=[{id:'a',letter:'A',count:1},{id:'b',letter:'b',count:1}];
 assert.equal(puzzle.tileForLetter(choices,'a').id,'a');assert.equal(puzzle.tileForLetter(choices,'b').id,'b');assert.equal(puzzle.tileForLetter(choices,'c'),undefined);
 const ui=fs.readFileSync('app/letter-puzzle.tsx','utf8');
 assert.ok(ui.includes("window.addEventListener('keydown',listener)")&&ui.includes('typeLetter(event.key)'));
 assert.ok(ui.includes('onClick={()=>giveBack(part.index)}'),'a filled box sends its letter back');
 assert.ok(ui.includes('const timer=setTimeout(()=>{sent.current=true;submitLatest.current();},520);'),'a full word is checked by itself');
 assert.ok(ui.includes("if(letterFits(puzzle,index,token.letter,strictCase,course))place(index,tokenId);else miss(index,token.letter);"),'right letters go in, wrong ones shake');
 assert.ok(ui.includes('onClick={hint}'),'hint button');
 for(const language of languages)for(const key of ['puzzleHintButton','puzzleHintAria','puzzleMistakes','puzzleMistakeNote','letterBankHint'])assert.ok(load('object-vault-copy').vaultText(language,key,{n:2}).trim(),language+' '+key);
});
