// Paul Hoca'nın küçük animasyonları: ana sayfada el sallar, yanlış cevapta parmağını kaldırır, ipucu ve kural kutularında tahtayı gösterir.
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

test('the three animations are small WebP files with a clear background',()=>{
 const tsx=read('app/paul-hoca.tsx');
 const pictures={hello:'/paul/paul-merhaba.webp',wrong:'/paul/paul-yanlis.webp',tip:'/paul/paul-ipucu.webp'};
 for(const [pose,src] of Object.entries(pictures)){
  assert.ok(tsx.includes(pose+":'"+src+"'"),pose);
  const file=webp('public'+src);
  assert.deepEqual(file.size,[180,180],src);assert.ok(file.frames>=10,src+' is animated');assert.ok(file.alpha,src+' has a clear background');
  assert.ok(file.bytes<160*1024,src+' stays small: '+file.bytes);
 }
 for(const src of ['/paul/paul-merhaba-still.webp','/paul/paul-ipucu-still.webp']){const file=webp('public'+src);assert.equal(file.frames,0,src);assert.ok(file.bytes<20*1024,src);}
 const total=fs.readdirSync('public/paul').reduce((sum,name)=>sum+fs.statSync(path.join('public/paul',name)).size,0);
 assert.ok(total<400*1024,'all of Paul together: '+total);
 // Shown at about 90 px (70 px on phones) and only after the page, never blocking it.
 const css=read('app/paul-hoca.css');
 assert.ok(css.includes('.paul-hoca { display:block; flex-shrink:0; width:90px; height:90px;')&&css.includes('.paul-hoca,.lk-reaction-paul { width:70px; height:70px; }'));
 assert.ok(tsx.includes('loading="lazy" decoding="async"')&&tsx.includes('alt=""')&&read('app/layout.tsx').includes('import "./paul-hoca.css";'));
 // Motion off (site setting or the device) → one still picture.
 assert.ok(tsx.includes('<source media="(prefers-reduced-motion: reduce)" srcSet={PAUL_STILL[pose]}/>')&&tsx.includes('src={motion?PAUL_PICTURES[pose]:PAUL_STILL[pose]}'));
 // Pictures only: Paul never plays a sound or reads anything aloud.
 for(const word of ['speak(','Audio','playLearningSound','speechSynthesis'])assert.ok(!tsx.includes(word),word);
});

test('Paul waves on the home page, raises his finger after a wrong answer and points at hints and rules',()=>{
 assert.ok(read('app/home-tour.tsx').includes('<div className="ht-hosts"><img className="ht-koko" src={KOKO_PICTURE} alt="" width={400} height={319}/><PaulHoca pose="hello" className="ht-paul"/></div>'));
 // Wrong answer: in the "Tekrar dene" badge, which stays 2.6 s; the picture is fetched after the first tap.
 const effects=read('app/learning-effects.tsx');
 assert.ok(effects.includes('<img className="lk-reaction-paul" src={PAUL_PICTURES.wrong} alt="" width={180} height={180} decoding="async"/>'));
 assert.ok(effects.includes("kind==='wrong'?WRONG_MS:1050")&&effects.includes('const WRONG_MS=2600;')&&effects.includes('paul.src=PAUL_PICTURES.wrong;'));
 assert.ok(read('app/paul-hoca.css').includes('animation:lk-paul-retry 2.6s both;'));
 // Hints and rule boxes.
 assert.ok(read('app/verb-games.tsx').includes('<div className="verb-rules paul-box" lang={language} dir={vaultDirection(language)}><div className="paul-box-text">')&&read('app/verb-games.tsx').includes('</ul></div><PaulHoca pose="tip"/></div>'));
 const vault=read('app/object-study.tsx');
 assert.ok(vault.includes('{showHint&&<div className="vault-hint paul-box">')&&vault.includes('<div className="verb-rules paul-box"><div className="paul-box-text"><strong>{puzzleText(language,\'ruleTitle\')}</strong>'));
 assert.equal((vault.match(/<PaulHoca pose="tip"\/>/g)||[]).length,2);
 assert.ok(read('app/ausbildung-ui.tsx').includes('{exercise.hint&&<div className="housing-cue l12-hint paul-box"><p className="paul-box-text"><Rich text={exercise.hint}/></p><PaulHoca pose="tip"/></div>}'));
 assert.ok(read('app/ausbildung-listen.tsx').includes('<div className="housing-cue l12-hint paul-box"><p className="paul-box-text">{task.hint}</p><PaulHoca pose="tip"/></div>'));
 // The verb learning card still fits one phone screen: no Paul in its small rule box there.
 assert.ok(read('app/paul-hoca.css').includes('.verb-learn .paul-box>.paul-hoca { display:none; }'));
 // The site gate lets the pictures through like other files.
 const compiled=process.env.STUDY_CHECK_DIR;
 if(compiled){const auth=require(path.join(compiled,'member-auth.js'));for(const src of ['/paul/paul-merhaba.webp','/paul/paul-yanlis.webp','/paul/paul-ipucu-still.webp'])assert.ok(auth.isPublicPath(src),src);}
});
