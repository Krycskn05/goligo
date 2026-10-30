// Lektion 15 „Wege in der Stadt“, Teil A – Gehen Sie die Treppe hoch. (30 October 2026): the learner's lesson page on
// the site, linked from Üniteler (A1.2), with the look and the pieces of Lektion 1.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const lesson=load('stadt-course'),progress=load('stadt-progress'),l1=load('willkommen-course'),auth=load('member-auth'),goals=load('unit-goals');
const read=file=>fs.readFileSync(file,'utf8');
const pageCode=()=>['app/stadt-study.tsx','app/stadt-a-steps.tsx'].map(read).join('\n');

test('25 steps in the order of the learner\'s page: cover, 10 teaching steps, 11 exercises, test, summary',()=>{
 assert.equal(lesson.stepsA.length,25);
 assert.deepEqual(lesson.stepsA.map(step=>step.kind),['cover',...Array(10).fill('teach'),...Array(11).fill('exercise'),'test','speak','end']);
 assert.equal(new Set(lesson.stepsA.map(step=>step.id)).size,25,'ids are unique');
 assert.deepEqual(lesson.stepGroupsA.map(group=>group.ids.length),[10,11,1,1]);
 assert.equal(lesson.stepIndexA('test'),22);assert.equal(lesson.stepIndexA('yok'),-1);
 assert.equal(lesson.buildingWords.length,13);assert.equal(lesson.officeWords.length,11);assert.equal(lesson.officeVerbs.length,10);assert.equal(lesson.directionWords.length,11);
 assert.equal(lesson.officeDialogue.length,15);assert.equal(lesson.schoolDialogue.length,9);assert.equal(lesson.summaryLines.length,10);
 assert.equal(lesson.testQuestionsA.length,14);assert.equal(lesson.houseFloors.length,7);
 // Every exercise is scored, every scored id is a step.
 assert.equal(lesson.scoredExercisesA.length,12);
 for(const {id,total} of lesson.scoredExercisesA){assert(lesson.stepsA.some(step=>step.id===id&&(step.kind==='exercise'||step.kind==='test')),id);assert(total>0,id);}
 assert.equal(lesson.scoredExercisesA.find(e=>e.id==='wohin').total,21);assert.equal(lesson.scoredExercisesA.find(e=>e.id==='pano').total,12);assert.equal(lesson.scoredExercisesA.find(e=>e.id==='rami').total,9);
});

test('the exercises have one right answer each, among their options',()=>{
 for(const line of [...lesson.wohinLines,...lesson.boardLines,...lesson.ramiLines])for(const gap of lesson.lineGaps(line))assert(gap.options.includes(gap.answer),line.key+': '+gap.answer);
 // A finished line is the sentence that is read.
 for(const line of [...lesson.wohinLines,...lesson.boardLines])assert.equal(lesson.lineText(line),line.say.text,line.key);
 assert.equal(lesson.lineText(lesson.ramiLines[1]),'Ich möchte mein Visum verlängern. Ich habe online einen Termin gemacht.');
 // The board exercise agrees with the board of the Bürgeramt.
 const board=lesson.officeBoard.rows;const floorOf={'im Erdgeschoss':'0','im ersten Stock':'1','im zweiten Stock':'2','im dritten Stock':'3'};
 for(const line of lesson.boardLines){const [floor,side]=lesson.lineGaps(line).map(gap=>gap.answer);const room=line.parts[0].replace(/^(Das|Die) /,'').replace(/ (ist|sind) $/,'');
  const row=board.find(r=>r[0]===floorOf[floor]);assert(row,line.key);assert((side==='links'?row[1]:row[2]).includes(room),line.key+' → '+room+' '+floor+' '+side);}
 // The role play agrees with the board of the school.
 assert.equal(lesson.roleQuestions.length,5);for(const item of lesson.roleQuestions)assert.equal(new Set(item.options).size,3,item.question);
 for(const [question,options,answer] of lesson.testQuestionsA)assert(options.includes(answer),question);
 for(const item of lesson.hearItems)assert.equal(item.options.length,3,item.text);
 for(const item of lesson.buildWords){assert.equal(lesson.joinParts(item.parts),item.word);assert(['der','die','das'].includes(item.article));}
 assert.equal(lesson.joinParts(['FÜHRER','SCHEIN']),'Führerschein');
 assert.equal(lesson.orderSentences.length,6);assert.equal(lesson.achIchRows.length,14);assert.equal(lesson.esGibtRows.length,9);
 for(const [,article,answer] of lesson.esGibtRows)assert.equal(answer,{der:'einen',die:'eine',das:'ein'}[article]);
 // Floors: every usual way of saying it is right; ü may be ue.
 const second=lesson.floorLines[2][1];assert(l1.acceptsAnswer('in der zweiten etage',second)&&l1.acceptsAnswer('im zweiten Stockwerk',second)&&!l1.acceptsAnswer('im zweite Stock',second));
 assert(l1.acceptsAnswer('im fuenften stock',lesson.floorLines[5][1]));
});

test('after a test answer only the right answer is read — in German, never a Turkish answer, never the question',()=>{
 for(const [question,,answer,say,hear] of lesson.testQuestionsA){
  if(lesson.isTurkishText(answer))assert.equal(say,'',question);else assert(say.includes(answer),question+' → '+say);
  if(hear)assert(lesson.isTurkishText(question)&&hear.who==='omar',question);
 }
 assert.equal(lesson.testQuestionsA.filter(q=>q[4]).length,1,'one listening question');
 for(const [question] of lesson.testQuestionsA.filter(q=>/ne demek|Hangi kelimede|dinle/.test(q[0])))assert(lesson.isTurkishText(question),question);
 for(const option of ['zur Führerscheinstelle','dritten','einen','im Erdgeschoss','das Buch','rechts','die','Im zweiten Stock gehen Sie nach links.'])assert(!lesson.isTurkishText(option),option);
});

test('a man is read by a man, a woman by a woman: every person of the lesson is one of the site\'s people',()=>{
 const known=new Map(l1.speakers.map(s=>[s.key,s]));
 const people=new Set([...lesson.castA,...[lesson.needDialogue,lesson.checkDialogue,lesson.esGibtDialogue,lesson.officeDialogue,lesson.schoolDialogue,lesson.summaryLines].flat().map(line=>line.who),...lesson.wohinLines.map(line=>line.promptWho),...lesson.ramiLines.map(line=>line.who),...lesson.hearItems.map(item=>item.who)]);
 for(const who of people)assert(known.has(who),who);
 const siteVoices=load('site-voices').siteVoices;
 for(const who of people){const voice=l1.speakerVoice(who,siteVoices);assert(voice,who);assert.equal(siteVoices.find(v=>v.id===voice).gender,known.get(who).gender,who+' has a voice of their own kind');}
 // Each dialogue has two people with different voices; the listening exercise has six different voices.
 const styleOf=key=>known.get(key).style;
 for(const lines of [lesson.officeDialogue,lesson.schoolDialogue,lesson.needDialogue,lesson.esGibtDialogue]){const who=[...new Set(lines.map(line=>line.who))];assert.equal(who.length,2);assert.notEqual(styleOf(who[0]),styleOf(who[1]));}
 assert.equal(new Set(lesson.hearItems.map(item=>styleOf(item.who))).size,6);
 assert.deepEqual([...new Set(lesson.ramiSay.map(item=>item.who))],['omar','rami']);
 for(const key of lesson.castA)assert(fs.existsSync('public/toon/lektion1/'+key+'.webp'),key+' has the site portrait');
 assert.equal(lesson.personName('paul'),'Paul Hoca');assert.equal(lesson.personName('mei'),'Mei');
 const page=pageCode();for(const piece of ['who={line.who}','who={item.who}','who="mei"',"who:'sabine'",'who="omar"','promptWho'])assert(page.includes(piece),piece);
});

test('every German text the lesson speaks is listed for the site voices',()=>{
 const texts=lesson.stadtSpeechTexts();
 for(const text of ['die Treppe','im Erdgeschoss','auf dem Dach','Gehen Sie die Treppe hoch.','Dann müssen Sie zum Bürgerbüro gehen.','Sie muss zum Bürgerbüro gehen.','Das Bürgerbüro ist im zweiten Stock links.','in der ersten Etage','Gibt es hier einen Aufzug?','die Führerscheinstelle','das Buch','manchmal','Die Kantine ist im fünften Stock links.','Ja, genau!','Das Wartezimmer ist im ersten Stock rechts.','die Aufenthaltserlaubnis','Wo gibt es hier einen Kaffee?'])assert(texts.includes(text),text);
 for(const item of lesson.ramiSay)assert(texts.includes(item.text),item.text);
 assert(!texts.includes(''));assert(texts.every(text=>text===text.trim()));
 assert(read('scripts/voices/list-texts.cjs').includes("load('stadt-course').stadtSpeechTexts()"));
});

test('scores stay in the browser and make the progress of the unit card',()=>{
 assert.equal(progress.L15A_SCORES_KEY,'lernkoko-l15a-scores');assert.equal(progress.L15A_STEP_KEY,'lernkoko-l15a-step');
 const total=lesson.scoredExercisesA.reduce((n,e)=>n+e.total,0);
 const empty=progress.partProgressL15('a',{});assert.equal(empty.total,total);assert.equal(empty.percent,0);assert.equal(empty.stage,'new');
 const some=progress.lessonFifteenProgress({a:{test:{right:14,total:14},wohin:{right:20,total:21}}});assert.equal(some.learned,34);assert(some.percent>0&&some.percent<100);
 const full=progress.partProgressL15('a',Object.fromEntries(lesson.scoredExercisesA.map(e=>[e.id,{right:e.total,total:e.total}])));
 assert.equal(full.percent,100);assert.equal(full.stars,3);
 const units=read('app/category-study.tsx');assert(units.includes("unit.id==='book-15'?'/a1-2/wege-in-der-stadt'")&&units.includes('readLessonFifteenProgress')&&units.includes("unit.id==='book-15'?stadt"));
});

test('the page: a notebook like Lektion 1 (Teil A open, B–D coming), its pictures, guest access and the menu',()=>{
 assert(fs.existsSync('app/a1-2/wege-in-der-stadt/page.tsx'));assert.equal(lesson.STADT_PATH,'/a1-2/wege-in-der-stadt');assert.equal(lesson.STADT_UNIT,'book-15');
 assert(auth.GUEST_PAGES.has('/a1-2/wege-in-der-stadt')&&auth.isPublicPath('/a1-2/wege-in-der-stadt'),'visitors without an account open Teil A');
 assert.deepEqual(lesson.stadtParts.map(part=>part.badge),['A','B','C','D']);
 assert(lesson.stadtParts[0].title&&lesson.stadtParts[0].lead);assert(lesson.stadtParts.slice(1).every(part=>!part.title),'B–D are coming soon');
 assert(lesson.stadtGoals.length>=8);assert.deepEqual(lesson.stadtGoals,goals.unitGoalsFor('book-15'));
 const page=pageCode();
 for(const piece of ['<LessonBook className="l1a-book l15-book"','<LessonBook variant="wide" className="l1a-book l15-book lb-tabbed"','data-l15-part={row.id}','id="l1a-tabs"','className="lb-toc"','className="lb-goals"','<TopicArt id={STADT_UNIT}','data-l15-step={step.id}','<SiteMenuAside language={language} current="units"/>','<GuestBanner','useLessonSpeech','useAnswerSound','saveL15Score(part,id,right,total)',"element.style.setProperty('--l1a-fill'",'<h2 id="l1a-heading"'])assert(page.includes(piece)||read('app/willkommen-ui.tsx').includes(piece),piece);
 // No effect or callback keyed on the new-every-render sound object (Lektion 1's endless update loop).
 assert(!/\},\[speech,sound\]\)/.test(read('app/stadt-study.tsx')));assert(read('app/stadt-study.tsx').includes('latest.current.speech.stop()'));
 // Every scene has its own picture; the portraits are the site's.
 const pictures=Object.values(lesson.stadtPictures);assert.equal(new Set(pictures.map(p=>p.src)).size,pictures.length);
 for(const picture of pictures)assert(fs.existsSync('public'+picture.src),picture.src);
 for(const name of fs.readdirSync('public/toon/lektion15'))assert(pictures.some(p=>p.src.endsWith('/'+name)),name+' is used');
 assert(read('app/layout.tsx').includes('import "./stadt.css";'));
 const css=read('app/stadt.css');for(const cls of ['.l15-board','.l15-house','.l15-rule','.l15-hide-tr','.l15-select','.l15-der','.l15-die','.l15-das'])assert(css.includes(cls),cls);
 const smoke=read('ci/smoke.cjs');assert(smoke.includes('"/a1-2/wege-in-der-stadt"')&&smoke.includes("data-l15-step='diyalog-amt'"));
});

test('"Bu ünitede" for Lektion 15 is in our own words, and the test listens with Omar',()=>{
 const text=goals.unitGoalsFor('book-15').join(' ');
 for(const copied of ['Gehen Sie die Treppe hoch','Lernziele'])assert(!text.includes(copied),copied);
 const ui=read('app/willkommen-ui.tsx');assert(ui.includes('listen?:(index:number)=>SayItem|undefined')&&ui.includes('langOf?:(text:string)=>'));
 assert(read('app/stadt-a-steps.tsx').includes('listen={i=>testQuestionsA[i][4]}'));
});

test('İleri at the bottom goes on inside an exercise that shows one item at a time (the learner asked, 30 October 2026)',()=>{
 const ui=read('app/willkommen-ui.tsx'),steps=read('app/stadt-a-steps.tsx'),page=read('app/stadt-study.tsx');
 assert(ui.includes('export function useInnerNext(')&&ui.includes('setInnerNext?:(next:(()=>boolean)|null)=>void'));
 // Kelimeyi kur (next word), Cümleyi kur (next sentence) and the role play (next question) take İleri first.
 assert.equal((steps.match(/useInnerNext\(props\.setInnerNext,/g)||[]).length,2);assert(ui.includes('useInnerNext(props.setInnerNext,()=>{'));
 assert(page.includes('setInnerNext={setInnerNext}')&&page.includes('if(innerNext.current?.())')&&page.includes('onClick={()=>forward('));
 // Every lesson (30 October 2026): Lektion 1 passes it too, and the test goes to its next question.
 const l1=read('app/willkommen-study.tsx');assert(l1.includes('setInnerNext={setInnerNext}')&&l1.includes('if(innerNext.current?.())')&&l1.includes('onClick={()=>forward('));
 assert(ui.includes("useInnerNext(props.setInnerNext,()=>{if(over)return false;if(picked===null){setWait(true);return true;}advance(i,score);return true;});"));
 // A tap on İleri by mistake loses nothing: an unanswered question, an unbuilt word or sentence stays (a short note shows).
 for(const note of ["'Önce cümleyi kur.'",'Önce bir cevap seç.'])assert(ui.includes(note),note);assert(steps.includes("'Önce kelimeyi kur.'")&&steps.includes("'Önce bir cevap seç.'"));
 assert(!/if\(round<(buildWords|roleQuestions|orderSentences)\.length-1\)\{(open\(round\+1\)|next\(\));return true;\}/.test(ui+steps),'nothing is skipped');
});

test('a test or a one-at-a-time exercise left in the middle goes on where it was (30 October 2026)',()=>{
 const ui=read('app/willkommen-ui.tsx'),steps=read('app/stadt-a-steps.tsx');
 for(const piece of ['export function readRun<T>(','export function saveRun(','export function useRunSave(','runKey?:string'])assert(ui.includes(piece),piece);
 // TestStep and OrderExercise (every lesson), Kelimeyi kur and the role play (Lektion 15A) keep their run.
 assert.equal((ui.match(/useRunSave\(runKey,step\.id,/g)||[]).length,2);assert.equal((steps.match(/useRunSave\(runKey,step\.id,/g)||[]).length,2);
 assert(read('app/willkommen-study.tsx').includes("runKey={'lernkoko-l1'+place.part+'-run'}")&&read('app/stadt-study.tsx').includes("runKey={'lernkoko-l15'+place.part+'-run'}"));
 // Leaving right after the last test answer still saves the result.
 assert(ui.includes('pending.current?.()')&&ui.includes('pending.current=()=>onScore(step.id,total,questions.length)'));
});

test('the steps of the open tab are a strip to scroll under the tabs, in every lesson (the learner chose it, 30 October 2026)',()=>{
 const ui=read('app/willkommen-ui.tsx'),l1=read('app/willkommen-study.tsx'),l15=read('app/stadt-study.tsx'),css=read('app/willkommen.css');
 assert(ui.includes('export function StepStrip(')&&ui.includes("element.addEventListener('wheel',wheel,{passive:false})"),'a finger or the mouse wheel scrolls it');
 for(const page of [l1,l15])assert(page.includes('{group&&group.ids.length>1&&<StepStrip label={group.label}'));
 for(const cls of ['.l1a-strip {','.l1a-strip-pill.on','.l1a-strip-pill.done b'])assert(css.includes(cls),cls);
 // Every exercise of Lektion 15A and of Lektion 1 has a short name for its pill.
 for(const id of lesson.stepGroupsA[1].ids)assert(lesson.stepShortA[id],id);
 const l1course=load('willkommen-course'),b=load('willkommen-b-course'),c=load('willkommen-c-course'),d=load('willkommen-d-course');
 const groups={a:l1course.stepGroups,b:b.stepGroupsB,c:c.stepGroupsC,d:d.stepGroupsD};
 for(const [part,list] of Object.entries(groups))for(const group of list.slice(1).filter(group=>group.ids.length>1))for(const id of group.ids)assert(new RegExp("(^|[,{ ])'?"+id+"'?:'").test(l1.slice(l1.indexOf('const shortNames'),l1.indexOf('const parts'))),part+': '+id);
});
