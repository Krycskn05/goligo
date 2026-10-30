// "Konuş" (30 October 2026, the learner asked: "I do the lessons but I can't speak"): after each lesson part a spoken
// role play with an AI partner (Cloudflare Workers AI), members only, a daily limit, the prompt written on the server.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const talk=load('talk-scenarios'),prompt=load('talk-prompt'),l1=load('willkommen-course');
const read=file=>fs.readFileSync(file,'utf8');

test('every lesson part has a talk: its partner is one of the lesson people, with a voice of their own kind',()=>{
 assert.deepEqual(Object.keys(talk.talkScenarios).sort(),['l15a','l1a','l1b','l1c','l1d']);
 for(const [id,scenario] of Object.entries(talk.talkScenarios)){
  assert.equal(scenario.id,id);const speaker=l1.speakers.find(s=>s.key===scenario.who);assert(speaker,id+' '+scenario.who);
  assert(scenario.opening.de&&scenario.opening.tr&&scenario.setting&&scenario.brief.length>100,id);
  assert(scenario.tryPhrases.length>=3,id);
  assert(fs.existsSync('public/toon/lektion1/'+scenario.who+'.webp'),'portrait '+scenario.who);
 }
 assert.equal(talk.talkFor('l15','a').id,'l15a');assert.equal(talk.talkFor('l1','c').id,'l1c');assert.equal(talk.talkFor('l1','x'),null);
 // The Bürgeramt partner keeps to the board of the lesson.
 const omar=talk.talkScenarios.l15a.brief;for(const piece of ['2nd floor: left Bürgerbüro','1st floor: left Kassenautomaten; right Führerscheinstelle','Ausländerbehörde'])assert(omar.includes(piece),piece);
 const texts=talk.talkSpeechTexts();assert(texts.includes('Guten Morgen! Kann ich Ihnen helfen?')&&!texts.some(text=>text.includes('…')));
 assert(read('scripts/voices/list-texts.cjs').includes("load('talk-scenarios').talkSpeechTexts()"));
});

test('the prompt: easy German, corrections in Turkish, the last turns only, and JSON back',()=>{
 const scenario=talk.talkScenarios.l15a;const system=prompt.talkSystemPrompt(scenario);
 for(const piece of ['level A1','Turkish','never correct punctuation','"correction"','"better"','"done"',scenario.brief])assert(system.includes(piece),piece);
 const long=Array.from({length:30},(_,i)=>({role:i%2?'learner':'partner',text:'x'.repeat(500)+i}));
 const messages=prompt.talkMessages(scenario,long);
 assert.equal(messages[0].role,'system');assert.equal(messages.length,1+prompt.TALK_HISTORY_MAX);
 assert(messages.slice(1).every(m=>m.content.length<=prompt.TALK_TEXT_MAX));
 const first=prompt.talkMessages(scenario,[{role:'learner',text:'  Hallo  '}]);
 assert.deepEqual(first.slice(1),[{role:'assistant',content:scenario.opening.de},{role:'user',content:'Hallo'}],'the opening line comes first');
 assert.equal(prompt.talkMessages(scenario,[{role:'hacker',text:'x'},{role:'learner',text:''}]).length,2,'only real turns');
 // Answers: an object, a JSON text with words around it, or plain text; empty → null.
 assert.deepEqual(prompt.parseTalkReply({response:{de:'Ja, genau!',tr:'Evet, aynen!',correction:null,better:null,done:false}}),{de:'Ja, genau!',tr:'Evet, aynen!',correction:null,better:null,done:false});
 assert.deepEqual(prompt.parseTalkReply({response:'Sure: {"de":"Im zweiten Stock.","tr":"İkinci katta.","correction":"Artikel: das Bürgerbüro","better":"Wo ist das Bürgerbüro?","done":true}'}),{de:'Im zweiten Stock.',tr:'İkinci katta.',correction:'Artikel: das Bürgerbüro',better:'Wo ist das Bürgerbüro?',done:true});
 assert.equal(prompt.parseTalkReply({response:'Guten Tag!'}).de,'Guten Tag!');
 assert.equal(prompt.parseTalkReply({response:''}),null);assert.equal(prompt.parseTalkReply({response:{tr:'x'}}),null);
 assert.equal(prompt.parseTalkReply({response:{de:'Ja.',tr:'',correction:'null',better:'',done:'yes'}}).correction,null);
 assert(prompt.TALK_DAILY_LIMIT>=50&&prompt.TALK_DAILY_LIMIT<=500);
});

test('the server: members only, same origin, a daily limit, the prompt from the scenario id, Workers AI only when published',()=>{
 const route=read('app/api/konus/route.ts');
 for(const piece of ["if(!user)return json({error:'Konuşmak için giriş yap.',signIn:true},401);","origin!==new URL(request.url).origin","talkScenarios[body.scenario]","isLimited(db,key,TALK_DAILY_LIMIT,DAY)","countAttempt(db,key,DAY)","talkMessages(scenario,history)","response_format:{type:'json_schema',json_schema:talkReplySchema}","(env as unknown as {AI?:Ai}).AI","503"])assert(route.includes(piece),piece);
 assert(!/body\.(prompt|system|messages)/.test(route),'the browser never writes the prompt');
 const vite=read('vite.config.ts');assert(vite.includes('...(productionDatabaseId ? { ai: { binding: "AI" } } : {}),'));
});

test('the page: a Konuş tab and step after the test in every lesson part, the microphone or typing',()=>{
 const parts=[[l1.steps,l1.stepGroups],[load('willkommen-b-course').stepsB,load('willkommen-b-course').stepGroupsB],[load('willkommen-c-course').stepsC,load('willkommen-c-course').stepGroupsC],[load('willkommen-d-course').stepsD,load('willkommen-d-course').stepGroupsD],[load('stadt-course').stepsA,load('stadt-course').stepGroupsA]];
 for(const [steps,groups] of parts){
  const at=steps.findIndex(step=>step.id==='konus');assert(at>0,'konus step');assert.equal(steps[at].kind,'speak');assert.equal(steps[steps.length-1].kind,'end');assert(steps.findIndex(step=>step.id==='test')<at);
  assert.deepEqual(groups[groups.length-1],{id:'konus',label:'Konuş',ids:['konus']});
 }
 const views=['app/willkommen-study.tsx','app/willkommen-b-steps.tsx','app/willkommen-c-steps.tsx','app/willkommen-d-steps.tsx','app/stadt-a-steps.tsx'].map(read).join('\n');
 for(const id of ['l1a','l1b','l1c','l1d','l15a'])assert(views.includes("case 'konus':return <TalkStep scenario={talkScenarios."+id+"} {...props}/>"),id);
 const step=read('app/talk-step.tsx');
 for(const piece of ["r.lang='de-DE'","fetch('/api/konus'","speech.speak({text:reply.de,who:scenario.who})","useRunSave(runKey,step.id,","l1a-talk-mic","l1a-talk-input","signIn"])assert(step.includes(piece),piece);
 const css=read('app/willkommen.css');assert(css.includes('.l1a-talk-mic')&&css.includes('.lb.l1a-book .l12-steps ol:has(> li:nth-child(4))'));
 const smoke=read('ci/smoke.cjs');assert(smoke.includes('?adim=konus')&&smoke.includes('dort sekme'));
});

test('Konuş waits and stays on the lesson (30 October 2026): at least eight answers, the lesson topic only, the microphone listens until tapped',()=>{
 const scenario=talk.talkScenarios.l1b;
 const system=prompt.talkSystemPrompt(scenario,2);
 for(const piece of ['Talk ONLY about the topic of this lesson','Never start another topic','Use only the German of this lesson',"This is the learner's turn 3 of 8",'Do NOT say goodbye yet','"tr" is the Turkish translation of your WHOLE German reply'])assert(system.includes(piece),piece);
 assert(prompt.talkSystemPrompt(scenario,7).includes('Now thank the learner, say goodbye'));
 const turns=n=>Array.from({length:n},(_,i)=>[{role:'partner',text:'Frage '+i},{role:'learner',text:'Antwort '+i}]).flat();
 assert(prompt.talkMessages(scenario,turns(3))[0].content.includes("turn 3 of 8"));
 assert.equal(prompt.talkDone(turns(3),true),false,'the model cannot end after three answers');
 assert.equal(prompt.talkDone(turns(8),true),true);assert.equal(prompt.talkDone(turns(9),false),false);
 assert(read('app/api/konus/route.ts').includes('done:talkDone(history,reply.done)'));
 const step=read('app/talk-step.tsx');
 for(const piece of ['r.continuous=true','if(want.current){window.setTimeout(()=>{if(want.current)session(kept);},150);return;}','sendOnStop.current=true;want.current=false;rec.current?.stop();','},30000);',"'Bitir ve gönder'"])assert(step.includes(piece),piece);
});
