// A1 sınavı (/a1-sinavi, the learner asked, 9 November 2026): ten practice exams built like the written Start Deutsch 1
// exam. Lesen from the learner's photos (Teil 1 Richtig / Falsch on two texts, Teil 2 two ads a / b, Teil 3 notices
// Richtig / Falsch); Hören after the telc and Goethe practice sets (Teil 1 short talks a / b / c, Teil 2 announcements
// Richtig / Falsch, Teil 3 phone messages a / b / c; the site's voices read the texts). Every answer is a tap.
// Schreiben (11 November 2026): a form with five gaps and a short message with ten, every gap a tap.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('a1-exam-course'),progress=load('a1-exam-progress'),copy=load('a1-exam-copy'),build=load('a1-exam-build'),sync=load('lesson-sync'),auth=load('member-auth'),visits=load('visits');
const listening=load('a1-exam-hoeren'),types=load('a1-exam-types');const hoerenExams=listening.hoerenExams;
const heard=exam=>course.hoerenItems(exam.hoeren);
const read=file=>fs.readFileSync(file,'utf8');
const two=n=>String(n).padStart(2,'0');
/** A text without case and punctuation, to find a quote in it. */
const plain=text=>text.toLowerCase().replace(/\*\*/g,'').replace(/[.,!?:;–—-]/g,' ').replace(/\s+/g,' ').trim();
const exams=Array.from({length:10},(_,i)=>load('a1-exam-lesen-'+two(i+1)).exam);
const languages=['en','ar','uk','de'];
const packs=Object.fromEntries(languages.map(id=>[id,JSON.parse(read(`lib/a1-exam-packs/${id}.json`))]));
const items=exam=>course.lesenItems(exam.lesen);
const storage=()=>{const data=new Map();return {getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>{data.set(key,String(value));},removeItem:key=>{data.delete(key);},data};};
/** Every German text of an exam (texts, statements, ads, notices), for the checks on names and numbers. */
function allText(exam){
 const {teil1,teil2,teil3}=exam.lesen;const out=[];
 for(const text of teil1){out.push(text.from??'',text.to??'',text.subject??'',...text.lines,text.example?.text??'',...text.items.map(item=>item.text));}
 for(const entry of [teil2.example,...teil2.items]){out.push(entry.situation);for(const ad of entry.ads)out.push(...ad.lines,ad.label);}
 for(const entry of [teil3.example,...teil3.items]){out.push(entry.place,entry.notice.title??'',...entry.notice.lines,entry.text);}
 return out.join('\n');
}

test('ten exams with a Hören, a Lesen and a Schreiben paper each',()=>{
 assert.equal(course.A1_EXAM_PATH,'/a1-sinavi');assert.equal(course.LESEN_EXAM_COUNT,10);assert.equal(exams.length,10);
 assert.deepEqual(course.examModules.map(module=>[module.number,module.id,module.name,module.ready]),[[1,'hoeren','Hören',true],[2,'lesen','Lesen',true],[3,'schreiben','Schreiben',true]]);
 assert.equal(hoerenExams.length,10);assert.equal(course.hoerenExamList.length,10);assert.equal(course.HOEREN_TOTAL,15);assert.equal(course.HOEREN_MINUTES,20);
 hoerenExams.forEach((exam,i)=>{const meta=course.hoerenExamList[i];assert.deepEqual([meta.number,meta.id,meta.topics],[i+1,'a1-hoeren-'+two(i+1),exam.topics]);assert.equal(exam.id,meta.id);assert.equal(exam.number,i+1);});
 assert.equal(new Set(course.hoerenExamList.map(exam=>exam.topics)).size,10);
 assert.equal(course.examList('hoeren'),course.hoerenExamList);assert.equal(course.examList('lesen'),course.lesenExamList);
 assert.ok(course.isReadyModule('hoeren')&&course.isReadyModule('lesen')&&course.isReadyModule('schreiben')&&!course.isReadyModule('sprechen'));
 assert.deepEqual(course.examModules.map(module=>module.minutes),[20,25,20]);
 exams.forEach((exam,i)=>{
  const meta=course.lesenExamList[i];
  assert.equal(exam.number,i+1);assert.equal(exam.id,'a1-lesen-'+two(i+1));assert.equal(exam.id,build.lesenExamId(i+1));
  assert.deepEqual([meta.number,meta.id,meta.topics],[exam.number,exam.id,exam.topics],'the list page shows the exam\'s own topics');
  assert.ok(exam.topics.split(' · ').length>=4,exam.id+': topics');
  assert.equal(exam.schreiben,null,'Schreiben is its own file per exam');
 });
 assert.equal(new Set(course.lesenExamList.map(exam=>exam.topics)).size,10,'ten different sets of topics');
});

test('every exam: Teil 1–3 with 15 scored items and the examples, ids that never change',()=>{
 for(const exam of exams){
  const {teil1,teil2,teil3}=exam.lesen;const list=items(exam);
  assert.equal(list.length,15,exam.id);assert.equal(course.LESEN_TOTAL,15);
  assert.deepEqual(list.map(entry=>entry.item.n),Array.from({length:15},(_,i)=>i+1),exam.id+': numbered 1–15');
  assert.deepEqual(list.map(entry=>entry.item.id),Array.from({length:15},(_,i)=>exam.id+'-'+two(i+1)),exam.id+': ids');
  assert.deepEqual(list.map(entry=>entry.teil).join(''),'111112222233333');
  // Teil 1: two texts, the example over the first one, 2 + 3 statements.
  assert.equal(teil1.length,2);assert.deepEqual(teil1.map(text=>text.items.length),[2,3]);
  assert.ok(teil1[0].example&&teil1[0].example.text.trim()&&['r','f'].includes(teil1[0].example.answer));
  for(const text of teil1){
   assert.ok(['mail','letter','note'].includes(text.kind));
   if(text.kind==='mail')assert.ok(text.from&&text.to&&text.subject,exam.id+': Von, An, Betreff');
   const words=text.lines.join(' ').split(/\s+/).length;assert.ok(words>=45&&words<=110,exam.id+': a short text ('+words+' words)');
  }
  // Teil 2: an example and five needs, each with two different ads and the line to mark under each.
  assert.ok(['ad','web'].includes(teil2.mode));assert.equal(teil2.items.length,5);
  for(const entry of [teil2.example,...teil2.items]){
   assert.ok(entry.situation.trim());assert.equal(entry.ads.length,2);assert.ok(['a','b'].includes(entry.answer));
   assert.notEqual(entry.ads[0].label,entry.ads[1].label);
   for(const ad of entry.ads){assert.ok(ad.lines.length>=2&&ad.lines.every(line=>line.trim()));assert.ok(ad.label.trim());}
   if(teil2.mode==='ad'){assert.notEqual(entry.ads[0].frame,entry.ads[1].frame,exam.id+': two different frames');for(const ad of entry.ads)assert.ok(ad.lines.at(-1).includes(ad.label),'the ad shows its phone number');}
  }
  // Teil 3: an example and five notices with where they hang.
  assert.equal(teil3.items.length,5);
  for(const entry of [teil3.example,...teil3.items]){assert.match(entry.place,/\*\*[^*]+\*\*/,exam.id+': the place in bold');assert.ok(entry.notice.lines.length&&entry.text.trim());assert.ok(['r','f'].includes(entry.answer));}
  // Every answer is one of two taps, and every item is explained.
  for(const {teil,item} of list){
   assert.ok((teil===2?['a','b']:['r','f']).includes(item.answer),item.id+': one right answer');
   assert.ok(item.why.trim().length>=20,item.id+': explained');assert.equal((item.why.match(/\*/g)??[]).length%2,0,item.id+': quotes closed');
  }
  // What an explanation quotes really stands in the exam's texts.
  const whole=plain(allText(exam));
  for(const {item} of list)for(const quote of item.why.match(/\*[^*]+\*/g)??[])for(const piece of quote.slice(1,-1).split('…').map(plain).filter(Boolean))assert.ok(whole.includes(piece),item.id+': '+quote+' is in the text');
 }
});

test('the answers are balanced and no two exams have the same key',()=>{
 const keys=exams.map(exam=>course.lesenKey(exam.lesen));
 assert.equal(new Set(keys).size,10,'ten different keys');
 let right=0,first=0;
 for(const [i,key] of keys.entries()){
  assert.match(key,/^[rf]{5}[ab]{5}[rf]{5}$/,'exam '+(i+1));
  const tf=key.slice(0,5)+key.slice(10),ads=key.slice(5,10);
  const r=[...tf].filter(x=>x==='r').length,a=[...ads].filter(x=>x==='a').length;right+=r;first+=a;
  assert.ok(r>=4&&r<=6,'exam '+(i+1)+': '+r+' Richtig of 10');assert.ok(a>=2&&a<=3,'exam '+(i+1)+': '+a+' a of 5');
  for(const part of [key.slice(0,5),ads,key.slice(10)])assert.ok(!/(.)\1\1\1/.test(part),'exam '+(i+1)+': no four equal answers in a row');
  for(const part of [key.slice(0,5),key.slice(10)])assert.ok(part.includes('r')&&part.includes('f'),'exam '+(i+1)+': both answers in every Teil');
 }
 assert.ok(right>=45&&right<=55,right+' Richtig of 100');assert.ok(first>=22&&first<=28,first+' a of 50');
 // Teil 2 comes in both forms of the real exam: ads with phone numbers and web pages.
 const modes=exams.map(exam=>exam.lesen.teil2.mode);assert.ok(modes.filter(mode=>mode==='ad').length>=6&&modes.filter(mode=>mode==='web').length>=2);
});

test('our own texts: the site\'s people, nothing from the book, phone numbers from the ranges kept free for films',()=>{
 const whole=exams.map(allText).join('\n');
 for(const word of ['Nakayama','König','Schupp','Ergül','Kunze','Ulmenstraße','Alleestraße','Postplatz','Turmplatz','Heinestraße','Ludwigsburg','Sprachzentrum','540370','512663','490671','390472','895433','222333','5757609','4356790','542209','567008','516273'])
  assert.ok(!whole.includes(word),'from the book: '+word);
 for(const name of ['Sabine','Mei','Nikos','Omar','Rami','Lina','Tomasz','Agata','Zofia','Yasemin','Can','Aisha','Nora','Paul','Adam'])assert.ok(whole.includes(name),'the site\'s people: '+name);
 const phones=[],webs=[];
 for(const exam of exams){const {teil2}=exam.lesen;for(const entry of [teil2.example,...teil2.items])for(const ad of entry.ads)(teil2.mode==='ad'?phones:webs).push(ad.label);}
 for(const phone of phones)assert.match(phone,/^(030 \/ 23125 \d{3}|040 \/ 66969 \d{3}|0176 \/ 040690 \d{2})$/,phone);
 assert.equal(new Set(phones).size,phones.length,'every phone number once');
 for(const web of webs)assert.match(web,/^www\.[a-z0-9-]+\.de(\/[a-z]+)?$/,web);
 assert.equal(new Set(webs).size,webs.length,'every web address once');
 // No statement is used twice, in one exam or across exams.
 const statements=exams.flatMap(exam=>items(exam).map(entry=>entry.item.text??entry.item.situation));
 assert.equal(new Set(statements).size,150);
});

test('every Hören exam: Teil 1–3 with 15 scored items, the examples, a spoken text for each, ids that never change',()=>{
 assert.deepEqual(types.HOEREN_PLAYS,{1:2,2:1,3:2},'Teil 1 and 3 are heard twice, Teil 2 once');
 for(const exam of hoerenExams){
  const {teil1,teil2,teil3}=exam.hoeren;const list=heard(exam);
  assert.deepEqual([teil1.items.length,teil2.items.length,teil3.items.length],[6,4,5],exam.id);
  assert.deepEqual(list.map(entry=>entry.item.n),Array.from({length:15},(_,i)=>i+1));
  assert.deepEqual(list.map(entry=>entry.item.id),Array.from({length:15},(_,i)=>exam.id+'-'+two(i+1)));
  assert.equal(list.map(entry=>entry.teil).join(''),'111111222233333');
  const choices=[teil1.example,...teil1.items,...teil3.items];
  for(const item of choices){
   assert.ok(item.question.trim().endsWith('?'),exam.id+': a question');assert.ok(['a','b','c'].includes(item.answer));
   assert.equal(item.options.length,3);assert.equal(new Set(item.options.map(option=>option.text)).size,3,exam.id+': three different answers');
   for(const option of item.options)assert.ok(option.text.trim()&&option.text.length<=30,option.text);
  }
  for(const item of [teil2.example,...teil2.items]){assert.ok(item.text.trim().endsWith('.'));assert.ok(['r','f'].includes(item.answer));}
  // The spoken texts: every line has a site voice; two people of a text never share a voice; the site's people keep their own.
  for(const block of listening.hoerenBlocks(exam.hoeren)){
   assert.ok(block.lines.length>=1&&block.lines.length<=6);
   const voices=new Map();
   for(const line of block.lines){
    assert.match(line.voice,/^[FM][1-5]$/,line.who);assert.ok(line.text.trim().length>=3);
    if(voices.has(line.who))assert.equal(voices.get(line.who),line.voice,line.who+' keeps one voice');voices.set(line.who,line.voice);
    if(build.CAST_VOICES[line.who])assert.equal(line.voice,build.CAST_VOICES[line.who],line.who+' has their own voice');
    // Written for the voices: no signs or decimals a voice would read wrongly.
    assert.ok(!/[€%&/()]|\d[.,]\d|\bz\. B\.|\busw\b/.test(line.text),'voice-safe: '+line.text);
   }
   assert.equal(new Set(voices.values()).size,voices.size,exam.id+': different voices in one text');
  }
  for(const item of teil1.items)assert.ok(new Set(item.lines.map(line=>line.who)).size===2,item.id+': a talk of two');
  for(const item of [...teil2.items,...teil3.items])assert.equal(new Set(item.lines.map(line=>line.who)).size,1,item.id+': one speaker');
  for(const {item} of list){assert.ok(item.why.trim().length>=20,item.id+': explained');assert.equal((item.why.match(/\*/g)??[]).length%2,0);
   // What an explanation quotes was really said (or is a word of the question).
   const said=plain([...item.lines.map(line=>line.text),item.question??item.text].join(' '));
   for(const quote of item.why.match(/\*[^*]+\*/g)??[])for(const piece of quote.slice(1,-1).split('…').map(plain).filter(Boolean))assert.ok(said.includes(piece),item.id+': '+quote+' is in the text');}
 }
});

test('Hören: the answers are balanced, no two exams have the same key, every statement and question once',()=>{
 const keys=hoerenExams.map(exam=>course.hoerenKey(exam.hoeren));
 assert.equal(new Set(keys).size,10);let right=0;const letters={a:0,b:0,c:0};
 for(const [i,key] of keys.entries()){
  assert.match(key,/^[abc]{6}[rf]{4}[abc]{5}$/,'exam '+(i+1));
  const abc=key.slice(0,6)+key.slice(10),tf=key.slice(6,10);
  for(const letter of ['a','b','c']){const n=[...abc].filter(x=>x===letter).length;letters[letter]+=n;assert.ok(n>=3&&n<=5,'exam '+(i+1)+': '+n+' × '+letter+' of 11');}
  const r=[...tf].filter(x=>x==='r').length;right+=r;assert.ok(r>=1&&r<=3,'exam '+(i+1)+': '+r+' Richtig of 4');
  for(const part of [key.slice(0,6),key.slice(10)])assert.ok(!/(.)\1\1/.test(part),'exam '+(i+1)+': no three equal answers in a row');
 }
 assert.equal(right,20,'Richtig and Falsch half and half over the ten exams');
 for(const letter of ['a','b','c'])assert.ok(letters[letter]>=33&&letters[letter]<=40,letter+': '+letters[letter]+' of 110');
 assert.equal(new Set(keys.map(key=>key.slice(6,10))).size,10,'ten different Teil 2 keys');
 // Every statement and question once — but for „Wie buchstabiert man den Namen?“, the sixth question of Teil 1 in every exam.
 const asked=hoerenExams.flatMap(exam=>heard(exam).map(entry=>entry.item.question??entry.item.text));assert.equal(new Set(asked).size,141);
 assert.equal(asked.filter(question=>question==='Wie buchstabiert man den Namen?').length,10);
 // The voices get every spoken line (scripts/voices/list-texts.cjs).
 const spoken=listening.a1ExamSpeechTexts();assert.equal(new Set(spoken).size,spoken.length);assert.ok(spoken.length>=280,String(spoken.length));
 assert.ok(read('scripts/voices/list-texts.cjs').includes("load('a1-exam-hoeren').a1ExamSpeechTexts()"));
 // Nothing from the practice sets the format was taken from.
 const whole=hoerenExams.map(exam=>listening.hoerenBlocks(exam.hoeren).map(block=>block.lines.map(line=>line.text).join(' ')).join(' ')).join(' ');
 for(const word of ['Schneider','Gundlach','Heinze','Solms','Hegers','Albers','Betriebsrat','Budapest','Metropolis','Aladin','11833'])assert.ok(!whole.includes(word),'from a practice set: '+word);
});

test('marking like the exam: a point per answer, 15 points, 60 % to pass, × 1,66 for the certificate',()=>{
 assert.equal(course.LESEN_MINUTES,25);assert.equal(course.PASS_PERCENT,60);assert.equal(course.passMark(15),9);
 assert.equal(course.hasPassed(9,15),true);assert.equal(course.hasPassed(8,15),false);
 assert.equal(course.examPoints(15),25);assert.equal(course.examPoints(9),15);assert.equal(course.examPoints(0),0);
 const exam=exams[0];const all=Object.fromEntries(items(exam).map(entry=>[entry.item.id,entry.item.answer]));
 assert.deepEqual(course.gradeLesen(exam.lesen,all),{right:15,total:15,answered:15,byTeil:{1:{right:5,total:5},2:{right:5,total:5},3:{right:5,total:5}},wrong:[],open:[]});
 const none=course.gradeLesen(exam.lesen,{});assert.equal(none.right,0);assert.equal(none.open.length,15,'an open item is not right');
 const flip={r:'f',f:'r',a:'b',b:'a'};const some={...all};for(const id of [exam.id+'-01',exam.id+'-06',exam.id+'-15'])some[id]=flip[some[id]];delete some[exam.id+'-11'];
 const mixed=course.gradeLesen(exam.lesen,some);
 assert.deepEqual([mixed.right,mixed.answered,mixed.wrong,mixed.open],[11,14,[exam.id+'-01',exam.id+'-06',exam.id+'-15'],[exam.id+'-11']]);
 assert.deepEqual(mixed.byTeil,{1:{right:4,total:5},2:{right:4,total:5},3:{right:3,total:5}});
 assert.equal(course.isExamNumber(10),true);for(const value of [0,11,1.5,NaN])assert.equal(course.isExamNumber(value),false);
 // Hören is marked the same way.
 const hoeren=hoerenExams[0];const heardAll=Object.fromEntries(heard(hoeren).map(entry=>[entry.item.id,entry.item.answer]));
 assert.deepEqual(course.gradeHoeren(hoeren.hoeren,heardAll).byTeil,{1:{right:6,total:6},2:{right:4,total:4},3:{right:5,total:5}});
 assert.equal(course.gradeHoeren(hoeren.hoeren,{...heardAll,[hoeren.id+'-07']:heardAll[hoeren.id+'-07']==='r'?'f':'r'}).right,14);
});

test('results stay in the browser, travel with the account and go with a progress reset',()=>{
 const box=storage();const id='a1-lesen-03';
 assert.deepEqual(progress.readExamScores(box),{});
 progress.saveExamScore(box,id,10,15,900,1);progress.saveExamScore(box,id,8,15,700,2);
 assert.deepEqual(progress.readExamScores(box)[id],{right:10,total:15,tries:2,seconds:900,at:1},'the best result stays, the attempt is counted');
 progress.saveExamScore(box,id,12,15,1000,3);assert.equal(progress.readExamScores(box)[id].right,12);
 progress.saveExamScore(box,id,12,15,800,4);assert.equal(progress.readExamScores(box)[id].seconds,800,'a tie keeps the faster one');
 box.setItem(progress.A1_EXAM_SCORES_KEY,'{"x":{"right":"9"},"a1-lesen-01":{"right":20,"total":15}}');
 assert.deepEqual(progress.readExamScores(box),{'a1-lesen-01':{right:15,total:15}},'broken entries are dropped');
 // A run: only this exam's own items and real answers are read back.
 assert.equal(progress.readExamRun(box,id),null);
 progress.saveExamRun(box,id,{answers:{[id+'-01']:'r',[id+'-06']:'b'},seconds:61,teil:2,timed:false,done:false});
 assert.deepEqual(progress.readExamRun(box,id),{answers:{[id+'-01']:'r',[id+'-06']:'b'},seconds:61,teil:2,timed:false,done:false});
 box.setItem(progress.a1ExamRunKey(id),JSON.stringify({answers:{[id+'-01']:'x','a1-lesen-04-01':'r',[id+'-02']:'f'},seconds:-4,teil:9}));
 assert.deepEqual(progress.readExamRun(box,id),{answers:{[id+'-02']:'f'},seconds:0,teil:1,timed:true,done:false});
 // A Hören run also keeps the answer c and how often each text was heard.
 const heardId='a1-hoeren-02';progress.saveExamRun(box,heardId,{answers:{[heardId+'-01']:'c'},seconds:9,teil:3,timed:true,done:false,plays:{[heardId+'-01']:2,[heardId+'-b1']:1,'a1-hoeren-03-01':5,[heardId+'-02']:0}});
 assert.deepEqual(progress.readExamRun(box,heardId),{answers:{[heardId+'-01']:'c'},seconds:9,teil:3,timed:true,done:false,plays:{[heardId+'-01']:2,[heardId+'-b1']:1}});
 assert.equal(sync.syncLessonOf(progress.a1ExamRunKey(heardId)),'site');
 progress.clearExamRun(box,id);assert.equal(progress.readExamRun(box,id),null);
 // The keys are part of the account's `site` progress; two score lists are joined, the better result stays.
 for(const key of [progress.A1_EXAM_SCORES_KEY,progress.a1ExamRunKey(id)]){assert.equal(sync.syncLessonOf(key),'site',key);assert.equal(sync.isProgressKey(key),true,key);}
 assert.equal(sync.syncLessonOf('lernkoko-last-place'),'site');assert.equal(sync.syncLessonOf('lernkoko-a1-examx'),null);
 const merged=sync.mergeItems({[progress.A1_EXAM_SCORES_KEY]:{v:'{"a":{"right":9,"total":15}}',t:5}},{[progress.A1_EXAM_SCORES_KEY]:{v:'{"a":{"right":12,"total":15},"b":{"right":7,"total":15}}',t:3}},9);
 assert.deepEqual(JSON.parse(merged[progress.A1_EXAM_SCORES_KEY].v),{a:{right:12,total:15},b:{right:7,total:15}});
 // The section's progress: every exam's 15 points.
 const whole=progress.examSectionProgress({'a1-lesen-01':{right:15,total:15},'a1-hoeren-02':{right:9,total:15},'other':{right:15,total:15}});
 assert.deepEqual([whole.total,whole.tried,whole.learned,whole.percent],[450,30,24,5],'thirty papers of 15 points');
 assert.equal(progress.examPapers.length,30);assert.equal(progress.examsSolved({'a1-lesen-01':{right:1,total:15},'a1-hoeren-01':{right:1,total:15}}),2);assert.equal(progress.examSectionProgress({}).stage,'new');
 assert.equal(progress.clock(754),'12:34');assert.equal(progress.clock(5),'0:05');assert.equal(progress.clock(-3),'0:00');
});

test('the labels come in Turkish, German, English, Arabic and Ukrainian',()=>{
 assert.deepEqual([...copy.EXAM_LANGUAGES],['tr','de','en','ar','uk']);
 const marks=text=>[...text.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort().join(' ');
 const stars=text=>[...text.matchAll(/\*([^*]+)\*/g)].map(m=>m[1]).join(' | ');
 const keys=Object.keys(copy.examCopy);assert.ok(keys.length>=60,keys.length);
 for(const [key,texts] of Object.entries(copy.examCopy)){
  assert.equal(texts.length,5,key);
  for(const text of texts){assert.ok(text.trim(),key);assert.equal(marks(text),marks(texts[0]),key+': the same {marks}');assert.equal(stars(text),stars(texts[0]),key+': the German words stay');}
  assert.match(texts[3],/[؀-ۿ]/,key+': Arabic');assert.match(texts[4],/[Ѐ-ӿ]/,key+': Ukrainian');
  assert.equal(new Set(texts).size,5,key+': five different texts');
 }
 assert.equal(copy.examText('tr','title'),'A1 sınavı');assert.equal(copy.examText('de','title'),'A1-Prüfung');
 assert.equal(copy.examText('uk','examN',{n:7}),'Іспит 7');assert.equal(copy.examText('ar','best',{right:9,total:15}),'أفضل نتيجة: 9/15');
 assert.equal(copy.examText('fr','title'),'A1 exam','another site language reads English');assert.equal(copy.examPackLanguage('fr'),'en');
});

test('every answer is explained in all five languages, the German quotes kept as they are',()=>{
 const stars=text=>[...text.matchAll(/\*([^*]+)\*/g)].map(m=>m[1]);
 const turkish=Object.fromEntries([...exams.flatMap(exam=>items(exam).map(entry=>[entry.item.id,entry.item.why])),...hoerenExams.flatMap(exam=>heard(exam).map(entry=>[entry.item.id,entry.item.why]))]);
 assert.equal(Object.keys(turkish).length,300,'150 Lesen and 150 Hören answers');
 assert.deepEqual([...copy.examPackLanguages].sort(),[...languages].sort());
 const script={ar:/[؀-ۿ]/,uk:/[Ѐ-ӿ]/,en:/[a-z]{3}/,de:/[a-zäöüß]{3}/};
 for(const [id,pack] of Object.entries(packs)){
  assert.deepEqual(Object.keys(pack).sort(),Object.keys(turkish).sort(),id+': the same ids');
  for(const [item,text] of Object.entries(pack)){
   assert.ok(typeof text==='string'&&text.trim().length>=12,id+': '+item);
   assert.deepEqual(stars(text),stars(turkish[item]),id+': the quotes of '+item);
   assert.ok(!/[ğşıİĞŞ]/.test(text.replace(/\*[^*]+\*/g,'')),id+': no Turkish left in '+item);
   assert.match(text.replace(/\*[^*]+\*/g,''),script[id],id+': '+item+' is in its language');
  }
 }
 // Shown by id; Turkish as written; a language without a pack reads English.
 copy.registerExamPack('en',packs.en);copy.registerExamPack('ar',packs.ar);
 const first=exams[0].lesen.teil1[0].items[0];
 assert.deepEqual(copy.examWhy('tr',first.id,first.why),{text:first.why,lang:'tr'});
 assert.deepEqual(copy.examWhy('en',first.id,first.why),{text:packs.en[first.id],lang:'en'});
 assert.deepEqual(copy.examWhy('fr',first.id,first.why),{text:packs.en[first.id],lang:'en'});
 assert.deepEqual(copy.examWhy('uk',first.id,first.why),{text:first.why,lang:'tr'},'Turkish until the pack has loaded');
});

test('the section is on the site: menu, page, guest taste, visits, styles',()=>{
 const menu=read('app/site-menu.tsx');
 assert.ok(menu.includes("href={A1_EXAM_PATH}")&&menu.includes('<NavIcon name="exam"/>')&&menu.includes("examText(language,'title')")&&menu.includes("|'exam'"));
 assert.ok(menu.indexOf('href={unitsHref}')<menu.indexOf('href={A1_EXAM_PATH}')&&menu.indexOf('href={A1_EXAM_PATH}')<menu.indexOf("'/ev-esyalar?learn='"),'after Üniteler');
 assert.ok(read('app/nav-icons.tsx').includes(' exam:<>')&&read('app/koko-theme.css').includes('.nav-icon-exam {'));
 const page=read('app/a1-sinavi/page.tsx');assert.ok(page.includes("import A1ExamStudy from '../a1-exam-study'")&&page.includes('guest={!(await getChatGPTUser())}'));
 assert.ok(read('app/layout.tsx').includes('import "./a1-exam.css";'));
 const ui=read('app/a1-exam-study.tsx'),paper=read('app/a1-exam-paper.tsx');
 assert.ok(ui.includes('<div className="work-layout site-layout"><SiteMenuAside language={language} current={\'exam\'}/>')&&ui.includes('</main></div>'),'the site menu');
 // Every exam has a Hören, a Lesen and a Schreiben paper (`?sinav=3&bolum=hoeren`, no `bolum` = Lesen); a part without papers would show „yakında“.
 assert.ok(ui.includes("data-ready={module.ready?'1':'0'}")&&ui.includes("examText(language,'soon')")&&!ui.includes('schreibenSoon')&&!ui.includes('hoerenSoon')&&!ui.includes('data-x1-paper="schreiben"'));
 assert.ok(ui.includes("const READY:readonly ReadyModule[]=['hoeren','lesen','schreiben'];"));
 assert.ok(ui.includes("A1_EXAM_PATH+'?sinav='+number+'&bolum='+module")&&ui.includes("module:isReadyModule(part)?part:'lesen'")&&ui.includes('data-x1-paper={exam.id}'));
 // After Hören the same exam's Lesen, after Lesen its Schreiben; after Schreiben the next exam's Hören.
 assert.ok(ui.includes("hoeren?{number,module:'lesen'}:module==='lesen'?{number,module:'schreiben'}:number<LESEN_EXAM_COUNT?{number:number+1,module:'hoeren'}:null"));
 // Hören: a text is played with its button, in the exam-like mode only as often as in the exam; the spoken text shows after handing in.
 const heardPaper=read('app/a1-exam-hoeren-paper.tsx'),player=read('app/a1-exam-audio.tsx');
 assert.ok(heardPaper.includes('const max=HOEREN_PLAYS[teil];')&&heardPaper.includes('disabled={!on&&left<=0}')&&heardPaper.includes('{review&&<Script lines={lines} language={language}/>}')&&heardPaper.includes('{review&&id&&why&&<Why '));
 assert.ok(player.includes('item.style===line.voice')&&player.includes('const natural=line.say??line.text;')&&player.includes('latest.current.speak(line.device&&!clip?line.device:natural,false,voice?.id,line.say?clip?SPELL_SPEED:SPELL_DEVICE_SPEED:1);'),'each line with its speaker\'s site voice');
 assert.ok(ui.includes('limit={!!run?.timed}')&&ui.includes("onPlay={review?()=>{}:played}")&&ui.includes('latest.current.audio.stop()'));
 // A visitor opens exam 1; nothing of a visitor is saved.
 assert.equal(course.GUEST_EXAM,1);assert.ok(auth.GUEST_PAGES.has('/a1-sinavi')&&auth.isPublicPath('/a1-sinavi'));
 assert.ok(ui.includes('const locked=guest&&number!==GUEST_EXAM;')&&ui.includes('if(!guest)saveExamRun(')&&ui.includes('if(!guest)try{saveExamScore('));
 assert.equal(visits.PAGE_NAMES['/a1-sinavi'],'A1 sınavı');
 // Nothing is marked right or wrong before the exam is handed in; no text is read aloud.
 assert.ok(paper.includes('{review&&id&&why&&<Why ')&&paper.includes("(review&&right?' is-right':'')"));
 for(const file of [ui,paper])for(const word of ['speak(','useGermanSpeech','useLessonSpeech','sound.correct','sound.wrong'])assert.ok(!file.includes(word),word);
 assert.ok(ui.includes('latest.current.sound.complete()'),'one sound when the exam is handed in');
 // Paul stays away while a paper is on the screen.
 assert.ok(read('app/paul-hoca.tsx').includes("if(document.querySelector('.x1-running'))return true;")&&ui.includes("(running?' x1-running':'')"));
 // The 25 minutes can be ignored: the clock only shows, it never hands in.
 assert.ok(ui.includes("examText(language,'timeUp')")&&ui.includes("off:'untimed'")&&ui.includes("off:'listenFree'")&&!/over\)\s*finish\(/.test(ui));
});

// Buchstabieren (the learner asked, 10 November 2026): the teacher's Hören paper has "Wie buchstabiert man den Namen?"
// with three name cards; the ten exams have no such item and must stay as they are, so it is a practice of its own.
test('Buchstabieren: a spelling practice beside the exams — three sheets of ten names, the exams untouched',()=>{
 const spell=load('a1-exam-spell'),letters=load('willkommen-b-course');
 assert.equal(course.SPELL_MODULE,'buchstabieren');assert.equal(course.SPELL_TOTAL,10);assert.equal(course.SPELL_SHEET_COUNT,3);
 assert.deepEqual(course.spellSheetList.map(sheet=>sheet.id),['a1-spell-01','a1-spell-02','a1-spell-03']);
 assert.ok(course.isSpellNumber(3)&&!course.isSpellNumber(4)&&!course.isSpellNumber(0));
 const sheets=spell.spellSheets;assert.equal(sheets.length,3);
 // The letters' names are the ones of the alphabet lesson; the natural voices read E and Ä another way (measured, see the file).
 for(const [letter,name] of Object.entries(spell.LETTER_NAME)){assert.equal(name,letter==='Ä'?'A-Umlaut':letters.letterSay(letter),letter);assert.equal(spell.LETTER_SAY[letter],letter==='E'?'E':letter==='Ä'?'Ah Umlaut':name,letter);}
 assert.equal(Object.keys(spell.LETTER_NAME).length,30);assert.equal(new Set(Object.values(spell.LETTER_NAME)).size,30,'every letter has its own name');assert.equal(new Set(Object.values(spell.LETTER_SAY)).size,30);
 assert.equal(spell.spellSay('Bäcker'),'Beh, Ah Umlaut, Zeh, Kah, E, Err');assert.equal(spell.spellDevice('Weiß'),'W, E, I, ß');
 assert.equal(spell.spellShown('Weiß'),'W – E – I – ß');assert.equal(spell.spellShown('Krüger'),'K – R – Ü – G – E – R');
 const right=[],keys=[],ids=new Set(),triples=new Set();
 sheets.forEach((sheet,s)=>{
  assert.equal(sheet.id,course.spellSheetList[s].id);assert.equal(sheet.number,s+1);assert.equal(sheet.topics,course.spellSheetList[s].topics);
  assert.equal(sheet.items.length,10);
  sheet.items.forEach((item,i)=>{assert.equal(item.id,'a1-spell-'+two(s+1)+'-'+two(i+1));assert.equal(item.n,i+1);ids.add(item.id);});
  keys.push(sheet.items.map(item=>item.answer).join(''));
  for(const item of [sheet.example,...sheet.items]){
   const where=sheet.id+' '+item.names.join('/');
   assert.equal(new Set(item.names).size,3,where);assert.match(item.answer,/^[abc]$/);
   const name=item.names['abc'.indexOf(item.answer)];right.push(name);triples.add([...item.names].sort().join('|'));
   for(const option of item.names){assert.match(option,/^[A-ZÄÖÜ][a-zäöüß]+$/,where);for(const letter of spell.nameLetters(option))assert.ok(spell.LETTER_SAY[letter],where+': '+letter);
    assert.ok(Math.abs(option.length-name.length)<=1,where+': the spellings differ in one spot');}
   // The name is said letter by letter once: the paper shows the letters, the voice reads their names.
   assert.equal(item.spelled,spell.spellShown(name),where);
   const spelled=item.lines.filter(line=>line.text.includes(item.spelled));assert.equal(spelled.length,1,where+': spelled once');
   assert.ok(spelled[0].say.includes(spell.spellSay(name))&&!spelled[0].say.includes(' – '),where);
   // The voices rush a bare list of letters: a spelled line starts with words (and is played slower).
   assert.ok(/[a-zäöüß]{3,}[.:!?]? /.test(spelled[0].say.split(spell.spellSay(name))[0]),where+': words before the letters');
   assert.ok(spelled[0].device.includes(spell.spellDevice(name))&&!spelled[0].device.includes(' – '),where+': plain capitals for the device voice');
   // What the measuring showed (lib/a1-exam-spell.ts): E / I, U / O and Ü / Ö are too close in the site voices — no
   // wrong spelling differs from the right one only by such a pair (so no ei against ie either).
   for(const option of item.names){if(option===name)continue;
    const a=spell.nameLetters(name),b=spell.nameLetters(option);
    if(a.length===b.length){const diff=a.map((letter,i)=>letter===b[i]?'':[letter,b[i]].sort().join('')).filter(Boolean);
     assert.ok(!diff.length||!diff.every(pair=>['EI','OU','ÖÜ'].includes(pair)),where+': '+option+' differs only by '+diff.join(' '));}
    for(const [from,to] of [['ie','i'],['ie','e'],['ei','i'],['ei','e']])assert.ok(option!==name.replace(from,to),where+': '+option+' ('+from+' against '+to+')');}
   for(const line of item.lines){
    assert.match(line.voice,/^[FM][1-5]$/,where);assert.ok(line.text.trim()&&!/[{}]/.test(line.text+(line.say??'')+(line.device??'')),where);
    assert.equal(line.say===undefined,line.device===undefined,where+': a line read another way has both texts');
    if(build.CAST_VOICES[line.who])assert.equal(line.voice,build.CAST_VOICES[line.who],where+': '+line.who+' keeps the own voice');
    // A wrong spelling is never said or shown before the end.
    for(const option of item.names)if(option!==name)assert.ok(!new RegExp('(^|[^A-Za-zÄÖÜäöüß])'+option+'($|[^A-Za-zÄÖÜäöüß])').test(line.text),where+': '+option);
   }
   const voices=new Map();for(const line of item.lines){if(voices.has(line.who))assert.equal(voices.get(line.who),line.voice,where);voices.set(line.who,line.voice);}
   assert.equal(voices.size,2,where+': two speakers');assert.equal(new Set(voices.values()).size,2,where+': two different voices');
   assert.ok(item.lines.length>=3&&item.lines.length<=4,where);
   // The letters to listen for: each with its name, each a letter of one of the three spellings.
   assert.ok(item.focus.length>=2&&item.focus.length<=4,where);
   for(const pair of item.focus){const [letter,say]=pair.split(' = ');assert.equal(say,spell.LETTER_NAME[letter],where+': '+pair);assert.ok(item.names.some(option=>spell.nameLetters(option).includes(letter)),where+': '+letter);}
   if(item.tip)assert.ok(['double','count','umlaut'].includes(item.tip),where);
  }
 });
 assert.equal(ids.size,30);assert.equal(new Set(right).size,33,'33 different names');assert.equal(triples.size,33);
 // The right card is spread evenly over a, b and c; no three equal answers in a row.
 const all=keys.join('');for(const letter of ['a','b','c'])assert.equal([...all].filter(x=>x===letter).length,10,letter);
 for(const key of keys){assert.ok(!/(.)\1\1/.test(key),key);for(const letter of ['a','b','c']){const n=[...key].filter(x=>x===letter).length;assert.ok(n>=3&&n<=4,key);}}
 assert.deepEqual(sheets.map(sheet=>sheet.example.answer).sort(),['a','b','c']);
 // Our own names, not the names of the teacher's paper.
 for(const name of ['Böhme','Behme','Bohme'])assert.ok(!sheets.some(sheet=>[sheet.example,...sheet.items].some(item=>item.names.includes(name))),name);
 // The voices get every line as it is read (letter names, not letters).
 const spoken=new Set(listening.a1ExamSpeechTexts());
 for(const sheet of sheets)for(const item of [sheet.example,...sheet.items])for(const line of item.lines)assert.ok(spoken.has(line.say??line.text),line.text);
 assert.ok(spell.spellSpeechTexts().length>=90);
 // A sheet's result is kept like a paper's, but the practice does not count in the section's progress.
 assert.deepEqual(progress.spellPapers,[{id:'a1-spell-01',total:10},{id:'a1-spell-02',total:10},{id:'a1-spell-03',total:10}]);
 assert.equal(progress.examPapers.length,30);assert.equal(progress.examSectionProgress({'a1-spell-01':{right:10,total:10}}).tried,0);assert.equal(progress.examsSolved({'a1-spell-01':{right:10,total:10}}),0);
 const box=storage();progress.saveExamRun(box,'a1-spell-02',{answers:{'a1-spell-02-03':'c','a1-spell-01-03':'a','a1-hoeren-02-03':'b'},seconds:0,teil:1,timed:true,done:false,plays:{'a1-spell-02-03':2,'a1-spell-02-b1':1}});
 const run=progress.readExamRun(box,'a1-spell-02');assert.deepEqual(run.answers,{'a1-spell-02-03':'c'});assert.deepEqual(run.plays,{'a1-spell-02-03':2,'a1-spell-02-b1':1});
 assert.equal(sync.syncLessonOf(progress.a1ExamRunKey('a1-spell-02')),'site');
 const marked=course.gradeItems(sheets[0].items.map(item=>({teil:1,item})),Object.fromEntries(sheets[0].items.map((item,i)=>[item.id,i<7?item.answer:item.answer==='a'?'b':'a'])));
 assert.deepEqual([marked.right,marked.total,marked.wrong.length],[7,10,3]);
 // The page: its own address, its own view; the exams' cards and papers are as before.
 const ui=read('app/a1-exam-study.tsx'),view=read('app/a1-exam-spell.tsx'),heardPaper=read('app/a1-exam-hoeren-paper.tsx');
 assert.ok(ui.includes("if(part===SPELL_MODULE)return isSpellNumber(value)?{number:value,module:SPELL_MODULE}:null;")&&ui.includes('place.module===SPELL_MODULE?<SpellView ')&&ui.includes('<SpellPanel language={language} guest={guest} scores={scores} marks={marks}'));
 assert.ok(view.includes("A1_EXAM_PATH+'?sinav='+number+'&bolum='+SPELL_MODULE")&&view.includes('data-x1-sheet={sheet.id}')&&!view.includes('x1-open\''),'the sheets have their own links (the exams keep theirs)');
 assert.ok(view.includes('cards max={2}')&&view.includes('limit:!!run?.timed')&&view.includes('explained={explain(language,item)}')&&view.includes("const locked=guest&&number!==GUEST_EXAM;"));
 assert.ok(view.includes('if(!guest)saveExamRun(')&&view.includes('if(!guest)try{saveExamScore(')&&view.includes('latest.current.audio.stop()'));
 for(const word of ['speak(','useGermanSpeech','sound.correct','sound.wrong'])assert.ok(!view.includes(word),word);
 assert.ok(heardPaper.includes('export function ChoiceItem(')&&heardPaper.includes("(cards?' x1-names':'')")&&heardPaper.includes('{review&&id&&!why&&explained&&<Why '));
 assert.ok(read('app/a1-exam-paper.tsx').includes('const shown=explained??examWhy(language,id,why);')&&read('app/a1-exam.css').includes('.x1-names .x1-opt {'));
 for(const key of ['spellTitle','spellLead','spellSheet','spellHint','spellWhy','spellLetters','spellTipDouble','spellTipCount','spellTipUmlaut','spellResult','spellFinish'])assert.ok(copy.examCopy[key],key);
 assert.equal(copy.examText('tr','spellSheet',{n:2}),'Kâğıt 2');assert.equal(copy.examText('de','spellWhy',{spelled:'W – E – I – ß'}),'Buchstabiert wird: *W – E – I – ß*.');
});

// Schreiben (the learner asked, 11 November 2026: "at the difficulty of the example, but not the same; telc and Goethe as
// models"; then: "the form is not a choice … I must write, in my own way, you must not interfere"): Teil 1 a form with
// five entries to type, Teil 2 a short message the learner writes freely and marks with the exam's scale.
test('Schreiben: ten papers — a form to fill in by typing, a message to write; nothing is a choice',()=>{
 const papers=Array.from({length:10},(_,i)=>load('a1-exam-schreiben-'+two(i+1)).exam);
 assert.equal(course.SCHREIBEN_TOTAL,15);assert.equal(course.SCHREIBEN_MINUTES,20);assert.equal(course.moduleMinutes.schreiben,20);assert.equal(course.SCHREIBEN_STEPS,6);
 assert.deepEqual(course.moduleTeile,{hoeren:[1,2,3],lesen:[1,2,3],schreiben:[1,2]});
 assert.equal(course.examList('schreiben'),course.schreibenExamList);assert.equal(new Set(course.schreibenExamList.map(exam=>exam.topics)).size,10);
 const all=[];const lesenPhones=new Set(exams.flatMap(exam=>[exam.lesen.teil2.example,...exam.lesen.teil2.items].flatMap(entry=>entry.ads.map(ad=>ad.label))));
 papers.forEach((exam,i)=>{
  const meta=course.schreibenExamList[i];assert.deepEqual([meta.number,meta.id,meta.topics],[i+1,'a1-schreiben-'+two(i+1),exam.topics]);
  assert.equal(exam.id,meta.id);assert.equal(exam.id,build.schreibenExamId(i+1));assert.equal(exam.number,i+1);assert.equal(exam.topics.split(' · ').length,2,exam.id+': the form and the message');
  const {teil1,teil2}=exam.schreiben;
  // Teil 1: a text about someone, a form of seven or eight rows, the gaps 1–5 in the order of the form.
  const count=teil1.text.split(/\s+/).length;assert.ok(count>=35&&count<=65,exam.id+': '+count+' words');assert.ok(teil1.form.includes(' – '),exam.id);
  assert.ok(teil1.rows.length>=7&&teil1.rows.length<=8,exam.id);assert.equal(new Set(teil1.rows.map(row=>row.label)).size,teil1.rows.length);
  const form=teil1.rows.map(row=>row.value).join(' | ');
  assert.deepEqual([...form.matchAll(/\{(\d+)\}/g)].map(mark=>Number(mark[1])),[1,2,3,4,5],exam.id+': gaps 1–5 in the order of the form');
  for(const row of teil1.rows)assert.ok(row.label.trim()&&row.value.trim());
  assert.equal(teil1.items.length,5);
  teil1.items.forEach((item,k)=>{
   assert.equal(item.id,exam.id+'-'+two(k+1));assert.equal(item.n,k+1);assert.equal(item.options,undefined,item.id+': not a choice');
   // The entries that count: the model entry first, no entry twice, each of them accepted, an empty field is open.
   assert.ok(item.accept.length>=1&&item.accept.every(entry=>entry.trim()===entry&&entry),item.id);
   assert.equal(new Set(item.accept.map(course.normalizeEntry)).size,item.accept.length,item.id+': no entry twice');
   for(const entry of item.accept)assert.equal(course.checkEntry(entry,item.accept),'right',item.id+': '+entry);
   assert.equal(course.checkEntry('',item.accept),'open');assert.equal(course.checkEntry('   ',item.accept),'open');assert.equal(course.checkEntry('xyz 99',item.accept),'wrong',item.id);
   // How it is explained: the line of the text.
   assert.ok(['text','infer'].includes(item.why.kind),item.id);assert.ok(teil1.text.includes(item.why.quote),item.id+': the quote stands in the text');assert.ok(copy.examCopy['sw_'+item.why.kind]);
  });
  assert.ok(teil1.items.filter(item=>item.why.kind==='text').length>=3,exam.id+': most entries stand in the text');
  // An entry of another gap of the same form is never accepted (the traps of the text stay traps).
  for(const item of teil1.items)for(const other of teil1.items)if(other!==item)assert.notEqual(course.checkEntry(other.accept[0],item.accept),'right',item.id+' takes the entry of '+other.id);
  // Teil 2: the task, three points, and a sample answer — a greeting, 28 to 55 words, an ending.
  assert.ok(teil2.task.endsWith(':')&&teil2.task.includes('Schreiben Sie'),exam.id);assert.equal(teil2.points.length,3);assert.equal(new Set(teil2.points).size,3);
  assert.equal(teil2.gaps,undefined);assert.equal(teil2.lines,undefined);
  assert.ok(teil2.model.length>=5&&teil2.model.every(line=>line.trim()===line&&line&&!/[{}*]/.test(line)),exam.id);
  assert.match(teil2.model[0],/^(Liebe|Lieber|Sehr geehrte|Sehr geehrter) .+,$/,exam.id+': a greeting');assert.match(teil2.model[1],/^[a-zäöü]/,exam.id+': small letters after the greeting');
  assert.match(teil2.model.at(-2),/^(Viele Grüße|Liebe Grüße|Mit freundlichen Grüßen)$/,exam.id+': an ending');assert.equal(teil2.model.at(-1),'(Ihr Name)');
  const words=course.countWords(teil2.model.slice(0,-1).join(' '));assert.ok(words>=28&&words<=55,exam.id+': a sample of '+words+' words');
  // Our own numbers: from the ranges kept free for films, none of the Lesen ads' numbers.
  const text=[teil1.text,form,...teil2.model,...teil1.items.flatMap(item=>item.accept)].join('\n');all.push(text,teil2.task,...teil2.points);
  for(const phone of text.match(/\b0\d{2,3} \/ \d+ \d+/g)??[]){assert.match(phone,/^(030 \/ 23125 \d{3}|040 \/ 66969 \d{3}|0176 \/ 040690 \d{2})$/,phone);assert.ok(!lesenPhones.has(phone),phone);}
 });
 // Nothing from the practice sets the form was taken from; only the two kinds of explanation have a label.
 const whole=all.join('\n');for(const word of ['Kadavy','Seeheim','Bodensee','Dresden','Schneider','Gundlach'])assert.ok(!whole.includes(word),word);
 assert.deepEqual(Object.keys(copy.examCopy).filter(key=>key.startsWith('sw_')).sort(),['sw_infer','sw_text']);
 // A typed entry is marked like in the exam: the information has to be right, the way of writing may differ, a small slip counts.
 assert.equal(course.normalizeEntry(' Gartenstraße 12 '),'gartenstrasse12');assert.equal(course.normalizeEntry('01.02.'),'1.2');assert.equal(course.normalizeEntry('12. März 1988'),'12maerz1988');
 assert.equal(course.normalizeEntry('030 / 23125 417'),course.normalizeEntry('03023125417'));
 const first=papers[0].schreiben.teil1.items;
 assert.equal(course.checkEntry('kellner',first[1].accept),'right');assert.equal(course.checkEntry('Kelner',first[1].accept),'near','one letter left out still counts');
 assert.equal(course.checkEntry('Koch',first[1].accept),'wrong');assert.equal(course.checkEntry('gartenstrasse 12',first[2].accept),'right');assert.equal(course.checkEntry('Gartenstraße 14',first[2].accept),'wrong','a number is exact');
 assert.equal(course.checkEntry('1.2.',first[4].accept),'right');assert.equal(course.checkEntry('1. März',first[4].accept),'wrong');assert.equal(course.checkEntry('6 Jahre',first[0].accept),'wrong','the brother’s age is the trap');
 // Marking: the form by the page, the message by the learner — 3 points a point (1,5 for a half), 1 for greeting and ending.
 assert.deepEqual(course.SCHREIBEN_CRITERIA.map(item=>[item.n,item.points,item.point]),[[6,3,1],[7,3,2],[8,3,3],[9,1,0]]);
 assert.equal(course.criterionId('a1-schreiben-01',6),'a1-schreiben-01-06');assert.equal(course.schreibenTextId('a1-schreiben-01'),'a1-schreiben-01-text');
 assert.deepEqual([course.selfPoints(3,'a'),course.selfPoints(3,'b'),course.selfPoints(3,'c'),course.selfPoints(1,'a'),course.selfPoints(1,'b'),course.selfPoints(3,undefined)],[3,1.5,0,1,0,0]);
 const exam=papers[0];const texts={[exam.id+'-01']:'3',[exam.id+'-02']:'Kellner',[exam.id+'-03']:'Gartenstr. 12',[exam.id+'-04']:'Berlin',[exam.id+'-text']:'Liebe Frau Berger, ich bin neu im Haus.'};
 const before=course.gradeSchreiben(exam,{},texts);
 assert.deepEqual([before.right,before.total,before.byTeil[1].right,before.byTeil[1].total,before.byTeil[2].right,before.byTeil[2].total,before.byTeil[3].total],[3,15,3,5,0,10,0]);
 assert.deepEqual(before.wrong,[exam.id+'-04']);assert.deepEqual(before.open,[exam.id+'-05',exam.id+'-06',exam.id+'-07',exam.id+'-08',exam.id+'-09']);
 const after=course.gradeSchreiben(exam,{[exam.id+'-06']:'a',[exam.id+'-07']:'b',[exam.id+'-08']:'c',[exam.id+'-09']:'a'},texts);
 assert.deepEqual([after.right,after.byTeil[2].right,after.open],[8.5,5.5,[exam.id+'-05']]);
 assert.equal(course.schreibenFilled(exam,texts),5,'four entries and the message');assert.equal(course.schreibenFilled(exam,{}),0);assert.equal(course.countWords('  Liebe Nora,\n vielen  Dank! '),4);
 assert.ok(progress.examPapers.some(paper=>paper.id==='a1-schreiben-10'&&paper.total===15));
 // What was typed is kept with the run (only this paper's own texts; a message may be long, an entry not), and the
 // learner's marks after handing in do not count as a new attempt.
 const box=storage();progress.saveExamRun(box,exam.id,{answers:{[exam.id+'-06']:'b','a1-schreiben-02-06':'a'},seconds:5,teil:2,timed:true,done:true,texts:{...texts,'a1-schreiben-02-01':'x',[exam.id+'-02']:'K'.repeat(200)}});
 const run=progress.readExamRun(box,exam.id);assert.deepEqual(run.answers,{[exam.id+'-06']:'b'});assert.equal(run.texts[exam.id+'-text'],texts[exam.id+'-text']);assert.equal(run.texts[exam.id+'-02'].length,80);assert.equal(run.texts['a1-schreiben-02-01'],undefined);
 progress.saveExamScore(box,exam.id,3,15,60,1);progress.saveExamScore(box,exam.id,8.5,15,60,2,false);
 assert.deepEqual(progress.readExamScores(box)[exam.id],{right:8,total:15,tries:1,seconds:60,at:2},'one attempt; a half point is not kept in the list');
 // The explanation of a gap is a label filled with German words.
 assert.equal(copy.examText('tr','sw_text',{quote:'Zofia ist drei Jahre alt'}),'Metinde yazıyor: *Zofia ist drei Jahre alt*.');
 assert.equal(copy.examText('de','sw_infer',{quote:'Sie fährt allein',right:'1'}),'Das zeigt der Text: *Sie fährt allein* → *1*.');
 // The page: fields to type in, a sheet to write on — no options anywhere; two Teile; the 20 minutes; nothing is read aloud.
 const ui=read('app/a1-exam-study.tsx'),sheet=read('app/a1-exam-schreiben-paper.tsx'),css=read('app/a1-exam.css');
 assert.ok(ui.includes("schreiben:{rules:['schreibenRule1','schreibenRule2','schreibenRule3','schreibenRule4'],on:'timed20',off:'untimed'")&&ui.includes('const left=minutes*60-seconds;')&&ui.includes('{teil<last?<button')&&ui.includes('teile.map(teil=>sheet(teil,shown.answers,true))'));
 assert.ok(ui.includes("loadSchreibenExam(number).then(exam=>done({module:'schreiben',exam}))")&&ui.includes('texts={texts} onText={review?undefined:write} onSelf={review?selfMark:undefined}'));
 assert.ok(ui.includes('gradeSchreiben(loaded.exam,run.answers,run.texts??{})')&&ui.includes('saveExamScore(localStorage,meta.id,graded.right,graded.total,next.timed?next.seconds:0,Date.now(),false)')&&ui.includes("examText(language,'selfTodo')"));
 assert.ok(sheet.includes('<input className="x1-entry"')&&sheet.includes('<textarea className="x1-write"')&&sheet.includes('data-x1-form')&&sheet.includes('data-x1-model')&&sheet.includes('data-x1-self'));
 assert.ok(!sheet.includes('x1-opt')&&!sheet.includes('options')&&!sheet.includes("role=\"radio\" aria-checked={value===choice} disabled={fixed}"),'no options in Schreiben');
 assert.ok(sheet.includes('{review&&items.map(item=><EntryWhy ')&&sheet.includes('{review&&<>'),'nothing is marked or shown before the end');
 for(const word of ['speak(','useGermanSpeech','useExamAudio','sound.correct','sound.wrong'])assert.ok(!sheet.includes(word),word);
 assert.ok(css.includes('.x1-form {')&&css.includes('.x1-entry {')&&css.includes('.x1-write {')&&css.includes('.x1-self {')&&css.includes('.x1-tabs.two {'));
 assert.ok(read('app/a1-exam-paper.tsx').includes("module==='schreiben'?'Schreiben':'Lesen'"));
 for(const key of ['schreibenRule1','schreibenRule2','schreibenRule3','schreibenRule4','timed20','stipsTitle','stip1','stip2','stip3','hintS1','hintS2','filled','pointsTotal','writeHere','wordCount','yourText','emptyText','modelTitle','modelNote','selfTitle','selfLead','selfPoint','selfForm','selfFull','selfHalf','selfNone','selfYes','selfNo','selfTodo','entryNear'])assert.ok(copy.examCopy[key],key);
 assert.ok(!copy.examCopy.schreibenSoon);assert.ok(copy.examText('tr','about').includes('Hören, Lesen ve Schreiben'));assert.ok(copy.examText('tr','schreibenRule1').includes('seçenek yoktur'));
});

// The learner, 11 November 2026: "in the exam spelling is not a part of its own, it is just one question" — so the sixth
// question of Hören Teil 1 is the name-spelling question in every exam (as on the teacher's paper); ids and keys stay.
test('Hören: the sixth question of Teil 1 is „Wie buchstabiert man den Namen?“ — three name cards, the name said letter by letter',()=>{
 const letters=load('a1-exam-letters'),spell=load('a1-exam-spell');const names=[];const spoken=new Set(listening.a1ExamSpeechTexts());
 assert.equal(spell.LETTER_SAY,letters.LETTER_SAY,'one set of letter names for the exams and the practice');
 for(const exam of hoerenExams){
  const item=exam.hoeren.teil1.items[5];assert.equal(item.id,exam.id+'-06');assert.equal(item.question,'Wie buchstabiert man den Namen?');assert.equal(item.cards,true,exam.id);
  for(const other of [...exam.hoeren.teil1.items.slice(0,5),...exam.hoeren.teil3.items])assert.ok(!other.cards&&other.question!==item.question,other.id);
  const right=item.options['abc'.indexOf(item.answer)].text;names.push(right);
  for(const option of item.options){assert.match(option.text,/^[A-ZÄÖÜ][a-zäöüß]+$/,exam.id);assert.ok(!option.icon);assert.ok(Math.abs(option.text.length-right.length)<=1,exam.id+': the spellings differ in one spot');
   if(option.text===right)continue;
   // The voices' E / I, U / O and Ü / Ö are too close: no wrong spelling differs only by such a pair.
   const a=letters.nameLetters(right),b=letters.nameLetters(option.text);
   if(a.length===b.length){const diff=a.map((letter,i)=>letter===b[i]?'':[letter,b[i]].sort().join('')).filter(Boolean);assert.ok(!diff.every(pair=>['EI','OU','ÖÜ'].includes(pair)),exam.id+': '+option.text);}
   for(const line of item.lines)assert.ok(!new RegExp('(^|[^A-Za-zÄÖÜäöüß])'+option.text+'($|[^A-Za-zÄÖÜäöüß])').test(line.text),exam.id+': '+option.text+' is never said');
  }
  // The name is spelled once: the paper shows the letters, the natural voices read their names, the device voice plain capitals.
  const spelled=item.lines.filter(line=>line.say);assert.equal(spelled.length,1,exam.id);
  assert.ok(spelled[0].text.includes(letters.spellShown(right))&&spelled[0].say.includes(letters.spellSay(right))&&spelled[0].device.includes(letters.spellDevice(right)),exam.id);
  assert.ok(/[a-zäöüß]{3,}[.:!?]? /.test(spelled[0].say.split(letters.spellSay(right))[0]),exam.id+': words before the letters');
  assert.ok(spoken.has(spelled[0].say),exam.id+': the voices get the line as it is read');
  assert.ok(item.why.includes('*'+letters.spellShown(right)+'*'),exam.id+': the explanation shows the letters');
  for(const id of ['en','ar','uk','de'])assert.ok(packs[id][item.id].includes('*'+letters.spellShown(right)+'*'),id+': '+item.id);
 }
 assert.equal(new Set(names).size,10,'ten different names');
 const practice=new Set(spell.spellSheets.flatMap(sheet=>[sheet.example,...sheet.items].flatMap(entry=>entry.names)));
 for(const name of names){assert.ok(!practice.has(name),name+' is not a name of the practice');assert.ok(!['Böhme','Behme','Bohme'].includes(name));}
 // The paper shows the three spellings as name cards; a line of an exam is read like a line of the practice.
 assert.ok(read('app/a1-exam-hoeren-paper.tsx').includes('cards={!!item.cards}'));
 assert.deepEqual(build.spelled('Mann:M5','Ich buchstabiere: {S}.','Weiß'),['Mann:M5','Ich buchstabiere: W – E – I – ß.','Ich buchstabiere: Weh, E, Ih, Eszett.','Ich buchstabiere: W, E, I, ß.']);
});
