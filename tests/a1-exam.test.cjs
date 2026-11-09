// A1 sınavı (/a1-sinavi, the learner asked, 9 November 2026): ten Lesen practice exams built like the written
// Start Deutsch 1 exam from the learner's photos (Teil 1 Richtig / Falsch on two texts, Teil 2 two ads a / b, Teil 3
// notices Richtig / Falsch); every answer is a tap. Hören and Schreiben come later and already have their place.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('a1-exam-course'),progress=load('a1-exam-progress'),copy=load('a1-exam-copy'),build=load('a1-exam-build'),sync=load('lesson-sync'),auth=load('member-auth'),visits=load('visits');
const read=file=>fs.readFileSync(file,'utf8');
const two=n=>String(n).padStart(2,'0');
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

test('ten Lesen exams; Hören and Schreiben have their place and are not ready yet',()=>{
 assert.equal(course.A1_EXAM_PATH,'/a1-sinavi');assert.equal(course.LESEN_EXAM_COUNT,10);assert.equal(exams.length,10);
 assert.deepEqual(course.examModules.map(module=>[module.number,module.id,module.name,module.ready]),[[1,'hoeren','Hören',false],[2,'lesen','Lesen',true],[3,'schreiben','Schreiben',false]]);
 assert.deepEqual(course.examModules.map(module=>module.minutes),[20,25,20]);
 exams.forEach((exam,i)=>{
  const meta=course.lesenExamList[i];
  assert.equal(exam.number,i+1);assert.equal(exam.id,'a1-lesen-'+two(i+1));assert.equal(exam.id,build.lesenExamId(i+1));
  assert.deepEqual([meta.number,meta.id,meta.topics],[exam.number,exam.id,exam.topics],'the list page shows the exam\'s own topics');
  assert.ok(exam.topics.split(' · ').length>=4,exam.id+': topics');
  assert.equal(exam.hoeren,null,'room for Hören');assert.equal(exam.schreiben,null,'room for Schreiben');
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
 progress.clearExamRun(box,id);assert.equal(progress.readExamRun(box,id),null);
 // The keys are part of the account's `site` progress; two score lists are joined, the better result stays.
 for(const key of [progress.A1_EXAM_SCORES_KEY,progress.a1ExamRunKey(id)]){assert.equal(sync.syncLessonOf(key),'site',key);assert.equal(sync.isProgressKey(key),true,key);}
 assert.equal(sync.syncLessonOf('lernkoko-last-place'),'site');assert.equal(sync.syncLessonOf('lernkoko-a1-examx'),null);
 const merged=sync.mergeItems({[progress.A1_EXAM_SCORES_KEY]:{v:'{"a":{"right":9,"total":15}}',t:5}},{[progress.A1_EXAM_SCORES_KEY]:{v:'{"a":{"right":12,"total":15},"b":{"right":7,"total":15}}',t:3}},9);
 assert.deepEqual(JSON.parse(merged[progress.A1_EXAM_SCORES_KEY].v),{a:{right:12,total:15},b:{right:7,total:15}});
 // The section's progress: every exam's 15 points.
 const whole=progress.examSectionProgress({'a1-lesen-01':{right:15,total:15},'a1-lesen-02':{right:9,total:15},'other':{right:15,total:15}});
 assert.deepEqual([whole.total,whole.tried,whole.learned,whole.percent],[150,30,24,16]);
 assert.equal(progress.examsSolved({'a1-lesen-01':{right:1,total:15}}),1);assert.equal(progress.examSectionProgress({}).stage,'new');
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
 const turkish=Object.fromEntries(exams.flatMap(exam=>items(exam).map(entry=>[entry.item.id,entry.item.why])));
 assert.equal(Object.keys(turkish).length,150);
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
 // Hören and Schreiben are shown as coming later.
 assert.ok(ui.includes("data-ready={module.ready?'1':'0'}")&&ui.includes("examText(language,'soon')")&&ui.includes("examText(language,'hoerenSoon')")&&ui.includes("examText(language,'schreibenSoon')"));
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
 assert.ok(ui.includes("examText(language,'timeUp')")&&ui.includes("examText(language,'untimed')")&&!/over\)\s*finish\(/.test(ui));
});
