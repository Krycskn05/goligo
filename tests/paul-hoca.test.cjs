// Paul Hoca: öğrencinin yaptığı 20 animasyon (3 Kasım 2026), orta boyda, duruma göre ve sırayla değişerek, kendi sesleriyle.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=file=>fs.readFileSync(file,'utf8');

/** Width, height and frame count of a WebP file (animated files have ANMF frames). */
function webp(file){
 const data=fs.readFileSync(file);
 assert.equal(data.toString('ascii',0,4),'RIFF',file);assert.equal(data.toString('ascii',8,12),'WEBP',file);
 let frames=0,size=null,alpha=false;
 for(let at=12;at+8<=data.length;){
  const tag=data.toString('ascii',at,at+4),length=data.readUInt32LE(at+4);
  if(tag==='VP8X'){alpha=!!(data[at+8]&0x10);size=[1+data.readUIntLE(at+12,3),1+data.readUIntLE(at+15,3)];}
  if(tag==='ANMF')frames++;
  at+=8+length+(length&1);
 }
 return {size,frames,alpha,bytes:data.length};
}
const tsxAnimations=()=>{const m=/export const PAUL_ANIMATIONS=\{([^}]*)\} as const;/.exec(read('app/paul-hoca.tsx'));assert.ok(m,'PAUL_ANIMATIONS');return Object.fromEntries([...m[1].matchAll(/(\w+):'([^']+)'/g)].map(x=>[x[1],x[2]]));};
/** app/paul-hoca.tsx run in node: React and the sound settings are stand-ins, sessionStorage and the page are fakes. */
function paulModule(store={},rtl=false){
 const ts=require('typescript'),vm=require('node:vm');
 const source=ts.transpileModule(read('app/paul-hoca.tsx'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const module={exports:{}};
 const sessionStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);}};
 const document={documentElement:{dir:rtl?'rtl':'ltr'},querySelector:()=>null};
 vm.runInNewContext(source,{module,exports:module.exports,sessionStorage,document,Math,Number,Object,String,require(name){if(name==='react')return {useEffect(){},useRef:v=>({current:v}),useState:v=>[typeof v==='function'?v():v,()=>{}]};if(name==='react/jsx-runtime')return {jsx(){},jsxs(){},Fragment:'f'};if(name==='@/lib/learning-effects')return {EFFECTS_CHANGED:'x',EFFECTS_KEY:'y',motionAllowed:()=>true,playLearningSound:()=>()=>{}};return {};}});
 return module.exports;
}

test('the learner\'s twenty animations: small, with a clear background and a still frame each',()=>{
 const tsx=read('app/paul-hoca.tsx');const animations=tsxAnimations();
 assert.equal(Object.keys(animations).length,20);
 for(const [id,stem] of Object.entries(animations)){
  const file=webp('public/paul/v2/'+stem+'.webp');
  assert.deepEqual(file.size,[288,288],stem);assert.equal(file.frames,6,stem+' is the 6-frame loop');assert.ok(file.alpha,stem+' has a clear background');
  assert.ok(file.bytes<110*1024,stem+' stays small: '+file.bytes);
  const still=webp('public/paul/v2/'+stem+'-still.webp');assert.equal(still.frames,0);assert.ok(still.bytes<20*1024,stem+' still');
  assert.ok(id.length>0);
 }
 // A middle size: about 110–150 px on a computer, smaller on phones.
 const css=read('app/paul-hoca.css');
 for(const rule of ['.paul-peek { --peek-size:150px; position:fixed; z-index:55; width:var(--peek-size); height:var(--peek-size); pointer-events:none;','.paul-box>.paul-hoca { width:110px; height:110px;','.lk-reaction-paul { display:block; width:140px; height:140px;','.lk-reaction-paul { width:112px; height:112px; }','.paul-peek { --peek-size:110px; }'])assert.ok(css.includes(rule),rule);
 assert.ok(read('app/layout.tsx').includes('import "./paul-hoca.css";'));
 // Motion off (site setting or the device) → the still frame.
 assert.ok(tsx.includes('{id&&<source media="(prefers-reduced-motion: reduce)" srcSet={paulSrc(id,true)}/>}')&&tsx.includes('<img src={id?paulSrc(id,!motion):undefined}'));
});

test('every situation has fitting animations and Paul goes through them in turn, for the whole visit of the site',()=>{
 const store={};const paul=paulModule(store);
 assert.deepEqual([...paul.PAUL_POSES.wrong],['wrong','retry','slow']);assert.deepEqual([...paul.PAUL_POSES.cheer],['applause','success','trophy']);
 for(const pose of ['correct','wrong','cheer','hello']){
  const pool=paul.PAUL_POSES[pose];const seen=Array.from({length:pool.length*2},()=>paul.nextPaul(pose));
  assert.deepEqual(seen,[...pool,...pool],pose+': in turn, never the same one twice in a row');
 }
 assert.equal(store['lernkoko-paul-turn-wrong'],'6','the turn is kept for the next page');
 assert.equal(paulModule(store).nextPaul('wrong'),'wrong','a new page goes on from there');
 // Pointing at a hint: to the right, to the left in right-to-left languages.
 const rtl=paulModule({},true);rtl.nextPaul('tip');assert.equal(rtl.nextPaul('tip'),'pointLeft');
 const ltr=paulModule({});ltr.nextPaul('tip');assert.equal(ltr.upcomingPaul('tip'),'pointRight');
 // The lesson step tells his visits what the learner is doing.
 assert.equal(paul.paulMood({id:'kapak',kind:'cover'}),'read');assert.equal(paul.paulMood({id:'test',kind:'test'}),'ready');
 assert.equal(paul.paulMood({id:'dinle',kind:'exercise'}),'listen');assert.equal(paul.paulMood({id:'harf-yaz',kind:'exercise'}),'write');
 assert.equal(paul.paulMood({id:'eslestir',kind:'exercise'}),undefined);
 for(const n of [0,2,4,6])assert.ok(['welcome','wink'].includes(paul.peekPose(n)),'even visits greet');
 for(const n of [1,3,5,7,9,11,13,15,17,19,21,23])assert.ok(!['wrong','retry','slow','trophy'].includes(paul.peekPose(n)),'never a wrong-answer animation on a visit');
 for(const [file,attr] of [['app/willkommen-study.tsx','data-l1a-teil={config.id} data-paul-mood={paulMood(step)}'],['app/berufe-study.tsx','data-l2-teil={config.id} data-paul-mood={paulMood(step)}'],['app/stadt-study.tsx','data-l15-teil={config.id} data-paul-mood={paulMood(step)}']])assert.ok(read(file).includes(attr),file);
 const talk=read('app/talk-step.tsx');assert.ok(talk.includes('<PaulHoca pose="speak"/>')&&talk.includes('<PaulHoca pose="thanks"/>'));
 for(const file of ['app/willkommen-d-steps.tsx','app/berufe-d-steps.tsx'])assert.ok(read(file).includes('<PaulHoca pose="trophy" className="l1a-paul-big" sound="appear"/>'),file+': the cup when a lesson is finished');
});

test('Paul pops up all over the screen now and then (waving every other time, his other animations in between), and shows up in the answer badge, at hints and rules and on Yanlışlarım',()=>{
 // Not next to the welcome text any more (the learner asked): he comes up on every study page, each time from another place.
 assert.ok(!read('app/home-tour.tsx').includes('PaulHoca'));
 const tsx=read('app/paul-hoca.tsx');
 assert.ok(tsx.includes('export const PEEK_FIRST_MS=9000,PEEK_EVERY_MS=150000,PEEK_GAP_MS=PEEK_EVERY_MS/2,PEEK_SHOW_MS=3600;'),'a visit every 75 s, a wave every 2.5 min');
 // Only from the bottom of the screen, at any point along it, each time somewhere else (the learner asked).
 assert.ok(tsx.includes('const at=Math.round(10+random()*80);if(last===null||Math.abs(at-last)>=25)return at;')&&!tsx.includes('PEEK_EDGES'));
 assert.ok(tsx.includes("const pose=n%2===1&&isPose(mood)?nextPaul(mood):peekPose(n);"),'in between greetings he does what the learner is doing');
 assert.ok(tsx.includes("<div key={visit.n} className={'paul-peek edge-bottom pose-'+visit.pose} style={{'--peek-at':visit.at+'%'} as CSSProperties} aria-hidden=\"true\"><img src={paulSrc(visit.pose)}"));
 assert.ok(tsx.includes("later(()=>setVisit(null),PEEK_SHOW_MS);later(peek,PEEK_GAP_MS);"));
 const peekCss=read('app/paul-hoca.css');
 assert.ok(peekCss.includes('bottom:0; animation-name:paul-peek-bottom; }')&&peekCss.includes('@keyframes paul-peek-bottom '));
 for(const edge of ['top','left','right'])assert.ok(!peekCss.includes('edge-'+edge)&&!peekCss.includes('paul-peek-'+edge),'not from the '+edge);
 assert.ok(tsx.includes("if(busyScreen()){later(peek,12000);return;}")&&tsx.includes("if(!motion||QUIET_PAGES.test(window.location.pathname))return;"));
 assert.ok(tsx.includes("if(!sessionStorage.getItem('lernkoko-paul-hello')){sessionStorage.setItem('lernkoko-paul-hello','1');playPaulSound('hello');}")&&tsx.includes("if(pose==='welcome')try{"),'hello sound once per visit');
 assert.ok(read('app/paul-hoca.css').includes('@keyframes paul-peek'));
 const effects=read('app/learning-effects.tsx');
 assert.ok(effects.includes('<img className="lk-reaction-paul" src={paulSrc(reaction.anim)}'));
 // The answer badge: a different fitting animation each time; the next one is fetched at once.
 assert.ok(effects.includes("const REACTION_POSE:Record<LearningReaction,PaulPose>={correct:'desk',wrong:'wrong',complete:'cheer'};")&&effects.includes("if(kind==='complete')playPaulSound(pose);"));
 assert.ok(effects.includes('setReaction({kind,id:++sequence.current,pose,anim:nextPaul(pose),host});')&&effects.includes('picture.src=paulSrc(upcomingPaul(pose));'));
 assert.ok(effects.includes('const REACTION_MS={correct:2000,wrong:2100,complete:2600} as const;')&&effects.includes('<PaulPeek/>'));
 const css=read('app/paul-hoca.css');
 for(const [kind,ms] of [['correct','2s'],['wrong','2.1s'],['complete','2.6s']])assert.ok(css.includes('.kind-'+kind+' .lk-reaction-badge:has(.lk-reaction-paul) { animation:lk-paul-badge '+ms+' both; }'),kind);
 assert.ok(read('app/verb-games.tsx').includes('</ul></div><PaulHoca pose="tip"/></div>'));
 const vault=read('app/object-study.tsx');
 assert.equal((vault.match(/<PaulHoca pose="tip"\/>/g)||[]).length,1,'Paul only with the writing hint; the rule box after an answer is gone (24 October 2026)');
 assert.ok(!vault.includes("puzzleText(language,'ruleTitle')")&&!vault.includes('articleRuleText('),'no Kural box in the vault');
 assert.ok(vault.includes("onClick={()=>setShowHint(value=>{if(!value)playPaulSound('tip');return !value;})}"),'a "pling" when the hint opens');
 assert.ok(read('app/ausbildung-ui.tsx').includes('<PaulHoca pose="tip"/>')&&read('app/ausbildung-listen.tsx').includes('<PaulHoca pose="tip"/>'));
 assert.ok(read('app/verb-study.tsx').includes('<PaulHoca pose="think" sound="appear"/>'));
});

test('Paul\'s sounds are effects, never speech, and follow the sound settings',async()=>{
 const tsx=read('app/paul-hoca.tsx');
 assert.ok(tsx.includes("export const PAUL_SOUNDS:Partial<Record<PaulPose,PaulSoundId>>={hello:'paulHello',tip:'paulTip',think:'paulHmm',cheer:'paulClap',trophy:'paulClap'};"));
 assert.ok(tsx.includes('playLearningSound(id)'),'through the sound settings (on/off, volume)');
 // He only checks whether a voice is speaking (to wait for a quiet moment); he never speaks himself.
 for(const word of ['speak(','SpeechSynthesisUtterance','useGermanSpeech'])assert.ok(!tsx.includes(word),word);
 // Each answer has one effect sound (the desk drum went with the old desk animation, 3 November 2026); the right
 // answer is read as soon as it ends.
 assert.ok(!tsx.includes('correct:\'paul')&&!tsx.includes('wrong:\'paul'));
 const answer=read('app/study-shared.tsx');
 assert.ok(answer.includes("const sounds=[kind==='correct'?chosen.correct:kind==='wrong'?chosen.wrong:chosen.complete];")&&!answer.includes('paulDrum'));
 assert.ok(answer.includes("let left=sounds.length;const done=()=>{if(--left>0||generation.current!==token)return;cancel.current=null;after?.();};"));
 const drum=require('node:fs').readFileSync('lib/effect-sounds.ts','utf8');
 assert.ok(/paulDrum:\[[^\]]*start:\.76,duration:\.14/.test(drum),'a short drum: the answer is read about one second later');
 const sounds=read('scripts/sounds/make-sounds.mjs');
 for(const id of ['paulHello','paulTip','paulHmm','paulClap','paulDrum'])assert.ok(sounds.includes(' '+id+':()=>'),id);
 // The desk knock is a wooden knock heard on phone speakers (the learner chose option A), not the old low thud.
 assert.ok(sounds.includes("forEach(([t,a],i)=>woodKnock(b,t,a,i%2,71+i));return finish(reverb(b,.1),.78);}"),'paulDrum uses woodKnock');
 const {soundDesigns}=await import(require('node:url').pathToFileURL(require('node:path').resolve('scripts/sounds/make-sounds.mjs')).href);
 const knocks=soundDesigns.paulDrum();let low=0,all=0;
 // energy through a gentle 300 Hz low-pass against all energy: the new knock 0.37, the old low thud 0.77
 let lp=0;const k=1-Math.exp(-2*Math.PI*300/44100);for(const v of knocks){lp+=k*(v-lp);low+=lp*lp;all+=v*v;}
 assert.ok(low/all<0.5,'most of the knock is above 300 Hz (the old thud had 0.77): '+(low/all).toFixed(2));
});
