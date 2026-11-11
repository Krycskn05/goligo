// Paul Hoca'nın animasyonları ve resimleri kaldırıldı (öğrenci istedi, 11 Kasım 2026): figür hiçbir sayfada çıkmaz,
// portresi yerine baş harfi durur; sesi (M3) ve ders metinleri kalır. Cevap rozeti, alkış ve ipucu sesi devam eder.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=file=>fs.readFileSync(file,'utf8');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);

test('the teacher\'s figure is gone: no animation files, no component, no styles, no leftovers in the pages',()=>{
 for(const gone of ['app/paul-hoca.tsx','app/paul-hoca.css','public/paul','public/toon/lektion1/paul.webp','public/toon/lektion1/kupa.webp','public/toon/lektion2/pokal-2.webp'])assert.ok(!fs.existsSync(gone),gone);
 assert.ok(!read('app/layout.tsx').includes('paul-hoca'));
 assert.ok(!read('public/_headers').includes('/paul/'));
 const words=['PaulHoca','PaulPeek','paulMood','playPaulSound','usePaulMotion','paul-hoca','paul-peek','paul-box','data-paul','l1a-paul','st-paul','lk-reaction-paul','lk-picture-paul','/paul/','--paul'];
 for(const file of walk('app').filter(name=>/\.(tsx?|css)$/.test(name))){const source=read(file);for(const word of words)assert.ok(!source.includes(word),file+': '+word);}
 // Nothing counts his visits any more, and no step card says what he should do.
 for(const file of ['app/willkommen-study.tsx','app/berufe-study.tsx','app/stadt-study.tsx','app/orte-study.tsx','app/familie-study.tsx','app/alltag-study.tsx'])assert.ok(!read(file).includes('data-paul-mood'),file);
});

test('the answer badge stays, with an icon instead of the figure; a round ends with applause',()=>{
 const effects=read('app/learning-effects.tsx');
 assert.ok(effects.includes("const REACTION_MS={correct:1050,wrong:1050,complete:1500} as const;"));
 assert.ok(effects.includes("<div className=\"lk-reaction-badge\">{reaction.kind==='complete'?<Trophy size={26}/>:reaction.kind==='correct'?<Sparkles size={26}/>:<RotateCcw size={24}/>}<strong>{text(reaction.kind==='complete'?'done':reaction.kind==='correct'?'great':'retry')}</strong></div>"));
 assert.ok(effects.includes("{reaction&&<div key={reaction.id} className={'lk-reaction-layer '+(reaction.kind==='wrong'?'retry':'celebrate')} aria-hidden=\"true\">"),'one badge on every page');
 assert.ok(effects.includes("if(kind==='complete')playLearningSound('applause');"));
 assert.ok(!effects.includes('createPortal')&&!effects.includes('lk-picture-reaction'),'nothing is drawn into the question picture');
 const css=read('app/learning-effects.css');
 assert.ok(css.includes('.lk-reaction-badge{position:absolute;')&&css.includes('animation:lk-reaction-bounce 1.05s both'));
});

test('the ends of the parts and lessons keep their applause, hints and notes show the text alone',()=>{
 const shared=read('app/study-shared.tsx');
 assert.ok(shared.includes("export function Applause(){useEffect(()=>playLearningSound('applause'),[]);return null;}"),'a sound only, through the sound settings');
 for(const file of ['app/willkommen-study.tsx','app/willkommen-b-steps.tsx','app/willkommen-c-steps.tsx','app/willkommen-d-steps.tsx','app/berufe-a-steps.tsx','app/berufe-b-steps.tsx','app/berufe-c-steps.tsx','app/berufe-d-steps.tsx','app/stadt-a-steps.tsx','app/orte-steps.tsx','app/familie-steps.tsx','app/alltag-steps.tsx'])
  assert.equal((read(file).match(/<Applause\/>/g)||[]).length,1,file);
 assert.ok(read('app/willkommen-ui.tsx').includes('export const Note=({children}:{children:ReactNode})=><div className="l1a-note"><p>{children}</p></div>;'));
 assert.ok(read('app/verb-games.tsx').includes('<div className="verb-rules" lang={language} dir={vaultDirection(language)}><strong>{verbText(language,\'ruleTitle\')}</strong><ul>'));
 const vault=read('app/object-study.tsx');
 assert.ok(vault.includes("onClick={()=>setShowHint(value=>{if(!value)playLearningSound('hintPling');return !value;})}"),'a "pling" when the hint opens');
 assert.ok(vault.includes('{showHint&&<p className="vault-hint"><span lang="de" dir="ltr">{currentWord.description}</span>'));
 assert.ok(read('app/ausbildung-ui.tsx').includes('{exercise.hint&&<p className="housing-cue l12-hint"><Rich text={exercise.hint}/></p>}')&&read('app/ausbildung-listen.tsx').includes('<p className="housing-cue l12-hint">{task.hint}</p>'));
 const talk=read('app/talk-step.tsx');
 assert.ok(talk.includes('<p className="l1a-tr">{ut(scenario.setting)}</p>')&&talk.includes("<p className=\"l1a-feedback ok\" role=\"status\">{ut('Konuşma bitti 🎉')}</p>"));
 assert.ok(read('app/verb-study.tsx').includes("<div className=\"verb-mistakes-head\"><h1 id=\"verb-section-heading\" tabIndex={-1}>{t('mistakesTitle')}</h1></div>"));
});

test('the sounds of fixed moments: applause and the hint "pling"; the figure\'s own sounds are gone',async()=>{
 const ids=read('lib/effect-sounds.ts');
 assert.ok(ids.includes("export type MomentSoundId = 'applause' | 'hintPling';")&&ids.includes('\n applause:[')&&ids.includes('\n hintPling:['));
 const script=read('scripts/sounds/make-sounds.mjs');
 for(const id of ['applause','hintPling'])assert.ok(script.includes(' '+id+':()=>'),id);
 for(const source of [ids,script])assert.ok(!/paul/i.test(source));
 const {soundDesigns}=await import(require('node:url').pathToFileURL(path.resolve('scripts/sounds/make-sounds.mjs')).href);
 assert.ok(soundDesigns.applause().length>44100&&soundDesigns.hintPling().length>0);
 // Each answer has one effect sound; the right answer is read as soon as it ends.
 const answer=read('app/study-shared.tsx');
 assert.ok(answer.includes("const sounds=[kind==='correct'?chosen.correct:kind==='wrong'?chosen.wrong:chosen.complete];"));
});

test('the teacher has no picture: his initial stands in the lessons and in the voice choice; his voice stays',()=>{
 const lesson=require(path.join(process.env.STUDY_CHECK_DIR,'willkommen-course.js'));
 assert.equal(lesson.hasPortrait('paul'),false);assert.equal(lesson.hasPortrait('mei'),true);
 assert.equal(lesson.speakers.find(person=>person.key==='paul').style,'M3','he still reads with his voice');
 const ui=read('app/willkommen-ui.tsx');
 assert.ok(ui.includes('if(!hasPortrait(who))return <span className="l1a-portrait letter" role="img" aria-label={name}>{name.charAt(0)}</span>;'));
 assert.ok(read('app/willkommen.css').includes('.l1a-portrait.letter { display:inline-grid; place-items:center;'));
 const voices=require(path.join(process.env.STUDY_CHECK_DIR,'site-voices.js'));
 const paul=voices.siteVoices.find(voice=>voice.name==='Paul');
 assert.equal(paul.id,'site:M3');assert.equal(paul.picture,undefined);
 for(const [file,cls] of [['app/learning-effects.tsx','lk-voice-photo letter'],['app/site-tour.tsx','st-photo letter']])assert.ok(read(file).includes('<span className="'+cls+'" aria-hidden="true">{voice.name.charAt(0)}</span>'),file);
});

test('the motion setting has its own hook; the tour shows its windows and cards without a figure',()=>{
 assert.ok(read('app/use-motion.ts').includes('export function useMotion(){'));
 for(const file of ['app/site-logo.tsx','app/site-greeting.tsx','app/site-tour.tsx'])assert.ok(read(file).includes("import {useMotion} from './use-motion';"),file);
 const tour=read('app/site-tour.tsx');
 assert.ok(tour.includes('<div className="st-tip-head"><div><span className="st-count">')&&!tour.includes('<img className={className}'));
 const copy=require(path.join(process.env.STUDY_CHECK_DIR,'tour-copy.js'));
 assert.equal(copy.tourText('tr','doneText'),'Her gün biraz çalış. İyi çalışmalar!');
 for(const text of copy.tourCopy.doneText)assert.ok(!/Paul|Пауль|بول|پاول/.test(text),text);
});
