const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file,extra={}){
 const exports={};const context={exports,console,...extra};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText,context);
 return exports;
}
const recipes=load('lib/effect-sounds.ts');
function setup(t,{audio=true,suspended=false,media=false,rejectMedia=false}={}){
 t.mock.timers.enable({apis:['setTimeout']});
 const data=new Map();const contexts=[];const clips=[];
 class AudioContext {
  state=suspended?'suspended':'running';currentTime=0;destination={};nodes=[];
  constructor(){contexts.push(this);}
  resume(){this.state='running';return Promise.resolve();}
  close(){this.state='closed';return Promise.resolve();}
  createOscillator(){const node={frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){},stop(){},onended:null};this.nodes.push(node);return node;}
  createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
 }
 class Audio {
  constructor(src){this.src=src;this.paused=false;clips.push(this);}
  play(){this.played=true;return rejectMedia?Promise.reject(new Error('blocked')):Promise.resolve();}
  pause(){this.paused=true;}
 }
 const window={...(media?{Audio}:{}),localStorage:{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)},matchMedia:()=>({matches:false}),dispatchEvent(){},...(audio?{AudioContext}:{})};
 const effects=load('lib/learning-effects.ts',{require:id=>{if(id==='./audio-session')return {configureAudioSession(){}};assert.equal(id,'./effect-sounds');return recipes;},window,document:{hidden:false},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail;}},setTimeout,clearTimeout});
 return {effects,contexts,data,clips};
}
test('muted or unavailable audio completes the quiz callback without locking the next answer',t=>{
 const {effects}=setup(t,{audio:false});let done=0;
 effects.playLearningSound('cartoon',()=>done++);assert.equal(done,1);
 effects.saveEffects({...effects.defaultEffects,enabled:false});effects.playLearningSound('cartoon',()=>done++);assert.equal(done,2);
});
test('cancelling an old question cannot invoke its callback in the next question',t=>{
 const {effects,contexts}=setup(t);let done=0;
 const stop=effects.playLearningSound('cartoon',()=>done++);assert(contexts[0].nodes.length>0);stop();t.mock.timers.tick(3000);assert.equal(done,0);
 effects.playLearningSound('correct',()=>done++);t.mock.timers.tick(3000);assert.equal(done,1);
});
test('muting or hiding a page during a cue releases the waiting answer exactly once',t=>{
 const {effects}=setup(t);let done=0;
 effects.playLearningSound('retro',()=>done++);effects.saveEffects({...effects.defaultEffects,enabled:false});assert.equal(done,1);t.mock.timers.tick(3000);assert.equal(done,1);
});
test('suspended audio is resumed and the fallback completes once',async t=>{
 const {effects,contexts}=setup(t,{suspended:true});let done=0;
 effects.playLearningSound('soft',()=>done++);await Promise.resolve();assert.equal(contexts[0].state,'running');t.mock.timers.tick(3000);assert.equal(done,1);
});
test('saved choices survive re-reading and malformed preferences use safe defaults',t=>{
 const {effects,data}=setup(t);effects.saveEffects({...effects.defaultEffects,wrong:'retro',volume:.4,motion:false});assert.equal(effects.readEffects().wrong,'retro');assert.equal(effects.readEffects().volume,.4);assert.equal(effects.readEffects().motion,false);
 data.set(effects.EFFECTS_KEY,'broken json');assert.equal(effects.readEffects().wrong,'retro');
 assert.equal(effects.normalizeEffects({wrong:'unknown',volume:400}).wrong,'cartoon');assert.equal(effects.normalizeEffects({volume:400}).volume,1);assert.equal(effects.normalizeEffects({volume:NaN}).volume,.65);
});


test('uploaded audio clips start directly on the tap and finish pronunciation exactly once',async t=>{
 const {effects,contexts,clips}=setup(t,{media:true});let done=0;
 effects.playLearningSound('correct',()=>done++);assert.equal(clips[0].src,'/sounds/correct.wav');assert(clips[0].played);assert.equal(contexts.length,0);
 await Promise.resolve();const end=clips[0].onended;end();end();t.mock.timers.tick(4000);assert.equal(done,1);assert(clips[0].paused);
});

test('rejected media falls back to a tone without losing the waiting answer',async t=>{
 const {effects,contexts,clips}=setup(t,{media:true,rejectMedia:true});let done=0;
 effects.playLearningSound('cartoon',()=>done++);await Promise.resolve();assert(clips[0].paused);assert(contexts[0].nodes.length>0);
 t.mock.timers.tick(4000);assert.equal(done,1);
});

test('late media rejection cannot resurrect feedback after the learner moves on',async t=>{
 const {effects,contexts}=setup(t,{media:true,rejectMedia:true});let done=0;
 const stop=effects.playLearningSound('correct',()=>done++);stop();await Promise.resolve();t.mock.timers.tick(4000);
 assert.equal(done,0);assert.equal(contexts.length,0);
});

test('a clip that never starts or ends releases its callback instead of blocking the quiz',async t=>{
 const {effects,clips}=setup(t,{audio:false,media:true});let done=0;
 effects.playLearningSound('correct',()=>done++);await Promise.resolve();t.mock.timers.tick(4000);assert.equal(done,1);assert(clips[0].paused);
});

test('an iOS interrupted Web Audio context is replaced before tone fallback',t=>{
 const {effects,contexts}=setup(t);effects.prepareEffects();contexts[0].state='interrupted';
 let done=0;effects.playLearningSound('correct',()=>done++);assert.equal(contexts[0].state,'closed');assert.equal(contexts.length,2);
 assert(contexts[1].nodes.length>0);t.mock.timers.tick(3000);assert.equal(done,1);
});
