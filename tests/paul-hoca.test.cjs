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
 for(const rule of ['.paul-peek { --peek-size:150px; position:fixed; z-index:55; width:var(--peek-size); height:var(--peek-size); pointer-events:none;','.paul-box>.paul-hoca { width:110px; height:110px;','.lk-reaction-paul { display:block; width:140px; height:140px;','.lk-reaction-paul { width:112px; height:112px; }','.paul-peek { --peek-size:110px; }'])assert.ok(css.includes(rule),rule);
 assert.ok(read('app/layout.tsx').includes('import "./paul-hoca.css";'));
 // Motion off (site setting or the device) → the still frame.
 assert.ok(tsx.includes('<source media="(prefers-reduced-motion: reduce)" srcSet={PAUL_STILL[pose]}/>')&&tsx.includes('src={motion?PAUL_PICTURES[pose]:PAUL_STILL[pose]}'));
});

test('Paul pops up all over the screen now and then (waving every other time, his other animations in between), and shows up in the answer badge, at hints and rules and on Yanlışlarım',()=>{
 // Not next to the welcome text any more (the learner asked): he comes up on every study page, each time from another place.
 assert.ok(!read('app/home-tour.tsx').includes('PaulHoca'));
 const tsx=read('app/paul-hoca.tsx');
 assert.ok(tsx.includes('export const PEEK_FIRST_MS=9000,PEEK_EVERY_MS=150000,PEEK_GAP_MS=PEEK_EVERY_MS/2,PEEK_SHOW_MS=3600;'),'a visit every 75 s, a wave every 2.5 min');
 // From any point of any edge, never the same edge twice in a row, head into the screen (the learner asked).
 assert.ok(tsx.includes("export const PEEK_EDGES=['bottom','top','left','right'] as const;"));
 assert.ok(tsx.includes("const edges=PEEK_EDGES.filter(edge=>edge!==lastEdge);")&&tsx.includes('at:Math.round(12+random()*76)'));
 assert.ok(tsx.includes("export const PEEK_OTHER_POSES:readonly PaulPose[]=['correct','cheer','think','tip','desk'];"),'all his other animations, the raised finger stays for wrong answers');
 assert.ok(tsx.includes("export function peekPose(n:number):PaulPose{return n%2===0?'hello':PEEK_OTHER_POSES[(n>>1)%PEEK_OTHER_POSES.length];}"));
 assert.ok(tsx.includes("<div key={visit.n} className={'paul-peek edge-'+visit.edge+' pose-'+visit.pose} style={{'--peek-at':visit.at+'%'} as CSSProperties} aria-hidden=\"true\"><img src={PAUL_PICTURES[visit.pose]}"));
 assert.ok(tsx.includes("later(()=>setVisit(null),PEEK_SHOW_MS);later(peek,PEEK_GAP_MS);"));
 const peekCss=read('app/paul-hoca.css');
 for(const edge of ['bottom','top','left','right'])assert.ok(peekCss.includes('.paul-peek.edge-'+edge+' {')&&peekCss.includes('@keyframes paul-peek-'+edge+' '),edge);
 // Head into the screen: upside down from the top, sideways from the left and the right.
 for(const rule of ['.paul-peek.edge-top img { transform:rotate(180deg)','.paul-peek.edge-left img { transform:rotate(90deg)','.paul-peek.edge-right img { transform:rotate(-90deg)'])assert.ok(peekCss.includes(rule),rule);
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
 // "Harika!": the chosen correct sound and Paul's desk drumming play together (the learner asked); the right answer is
 // read only after both have ended. A wrong answer keeps only its own sound.
 assert.ok(!tsx.includes('correct:\'paul')&&!tsx.includes('wrong:\'paul'));
 const answer=read('app/study-shared.tsx');
 assert.ok(answer.includes("const sounds=kind==='correct'?[chosen.correct,'paulDrum' as const]:[kind==='wrong'?chosen.wrong:chosen.complete];"));
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
