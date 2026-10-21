// Paul Hoca: öğrencinin Paul Hoca'nın fotoğraflarından yaptırdığı 7 animasyon, orta boyda ve kendi sesleriyle.
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
const poses={hello:'merhaba',correct:'dogru',wrong:'yanlis',tip:'ipucu',think:'dusunuyor',cheer:'tebrik',desk:'sira'};

test('seven small animated pictures of Paul Hoca with a clear background and a still frame each',()=>{
 const tsx=read('app/paul-hoca.tsx');
 for(const [pose,name] of Object.entries(poses)){
  const src='/paul/paul-'+name+'.webp';assert.ok(tsx.includes(pose+":'"+src+"'"),pose);
  const file=webp('public'+src);
  assert.deepEqual(file.size,[224,224],src);assert.ok(file.frames>=20,src+' is animated');assert.ok(file.alpha,src+' has a clear background');
  assert.ok(file.bytes<260*1024,src+' stays small: '+file.bytes);
  const still=webp('public/paul/paul-'+name+'-still.webp');assert.equal(still.frames,0);assert.ok(still.bytes<20*1024);
 }
 // A middle size: about 110–150 px on a computer, smaller on phones.
 const css=read('app/paul-hoca.css');
 for(const rule of ['.paul-peek { position:fixed; right:max(14px,env(safe-area-inset-right)); bottom:0; z-index:55; width:150px; height:150px; pointer-events:none;','.paul-box>.paul-hoca { width:110px; height:110px;','.lk-reaction-paul { display:block; width:140px; height:140px;','.lk-reaction-paul { width:112px; height:112px; }','.paul-peek { width:110px; height:110px; right:8px; }'])assert.ok(css.includes(rule),rule);
 assert.ok(read('app/layout.tsx').includes('import "./paul-hoca.css";'));
 // Motion off (site setting or the device) → the still frame.
 assert.ok(tsx.includes('<source media="(prefers-reduced-motion: reduce)" srcSet={PAUL_STILL[pose]}/>')&&tsx.includes('src={motion?PAUL_PICTURES[pose]:PAUL_STILL[pose]}'));
});

test('Paul waves from the bottom-right corner now and then, and shows up in the answer badge, at hints and rules and on Yanlışlarım',()=>{
 // Not next to the welcome text any more (the learner asked): he comes up from the corner on every study page.
 assert.ok(!read('app/home-tour.tsx').includes('PaulHoca'));
 const tsx=read('app/paul-hoca.tsx');
 assert.ok(tsx.includes('export const PEEK_FIRST_MS=9000,PEEK_EVERY_MS=150000,PEEK_SHOW_MS=3600;')&&tsx.includes('<div key={visit} className="paul-peek" aria-hidden="true"><img src={PAUL_PICTURES.hello}'));
 assert.ok(tsx.includes("if(busyScreen()){later(peek,12000);return;}")&&tsx.includes("if(!motion||QUIET_PAGES.test(window.location.pathname))return;"));
 assert.ok(tsx.includes("if(!sessionStorage.getItem('lernkoko-paul-hello')){sessionStorage.setItem('lernkoko-paul-hello','1');playPaulSound('hello');}"),'hello sound once per visit');
 assert.ok(read('app/paul-hoca.css').includes('@keyframes paul-peek'));
 const effects=read('app/learning-effects.tsx');
 assert.ok(effects.includes('<img className="lk-reaction-paul" src={PAUL_PICTURES[reaction.pose]}'));
 // "Harika!": Paul drums on the desk (the learner chose it); wrong: raised finger; end of a round: clapping with applause.
 assert.ok(effects.includes("const REACTION_POSE:Record<LearningReaction,PaulPose>={correct:'desk',wrong:'wrong',complete:'cheer'};")&&effects.includes("if(kind==='complete')playPaulSound(pose);"));
 assert.ok(effects.includes('const REACTION_MS={correct:2000,wrong:2100,complete:2600} as const;')&&effects.includes('<PaulPeek/>'));
 const css=read('app/paul-hoca.css');
 for(const [kind,ms] of [['correct','2s'],['wrong','2.1s'],['complete','2.6s']])assert.ok(css.includes('.kind-'+kind+' .lk-reaction-badge:has(.lk-reaction-paul) { animation:lk-paul-badge '+ms+' both; }'),kind);
 assert.ok(read('app/verb-games.tsx').includes('</ul></div><PaulHoca pose="tip"/></div>'));
 const vault=read('app/object-study.tsx');
 assert.equal((vault.match(/<PaulHoca pose="tip"\/>/g)||[]).length,2);
 assert.ok(vault.includes("onClick={()=>setShowHint(value=>{if(!value)playPaulSound('tip');return !value;})}"),'a "pling" when the hint opens');
 assert.ok(read('app/ausbildung-ui.tsx').includes('<PaulHoca pose="tip"/>')&&read('app/ausbildung-listen.tsx').includes('<PaulHoca pose="tip"/>'));
 assert.ok(read('app/verb-study.tsx').includes('<PaulHoca pose="think" sound="appear"/>'));
});

test('Paul\'s sounds are effects, never speech, and follow the sound settings',async()=>{
 const tsx=read('app/paul-hoca.tsx');
 assert.ok(tsx.includes("export const PAUL_SOUNDS:Partial<Record<PaulPose,PaulSoundId>>={hello:'paulHello',tip:'paulTip',think:'paulHmm',cheer:'paulClap',desk:'paulDrum'};"));
 assert.ok(tsx.includes('playLearningSound(id)'),'through the sound settings (on/off, volume)');
 // He only checks whether a voice is speaking (to wait for a quiet moment); he never speaks himself.
 for(const word of ['speak(','SpeechSynthesisUtterance','useGermanSpeech'])assert.ok(!tsx.includes(word),word);
 // Correct and wrong answers keep only their own effect sound (then the right answer is read): Paul adds none there.
 assert.ok(!tsx.includes('correct:\'paul')&&!tsx.includes('wrong:\'paul'));
 const sounds=read('scripts/sounds/make-sounds.mjs');
 for(const id of ['paulHello','paulTip','paulHmm','paulClap','paulDrum'])assert.ok(sounds.includes(' '+id+':()=>'),id);
});
