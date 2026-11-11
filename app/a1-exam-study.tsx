'use client';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,Clock,Eye,EyeOff,FileText,Flag,Headphones,ListChecks,PenLine,RotateCcw,Timer} from 'lucide-react';
import {browserLanguage,rememberSiteLanguage} from '@/lib/device-language';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import type {A1Exam,A1HoerenExam,A1SchreibenExam,ExamAnswer,ExamModule} from '@/lib/a1-exam-types';
import {A1_EXAM_PATH,GUEST_EXAM,HOEREN_TOTAL,LESEN_EXAM_COUNT,LESEN_TOTAL,SCHREIBEN_CRITERIA,SCHREIBEN_STEPS,SCHREIBEN_TOTAL,SPELL_MODULE,countWords,criterionId,examList,examModules,examPoints,gradeItems,gradeSchreiben,hasPassed,hoerenItems,isExamNumber,isReadyModule,isSpellNumber,lesenItems,loadHoerenExam,loadLesenExam,loadSchreibenExam,moduleMinutes,moduleTeile,normalizeEntry,passMark,schreibenFilled,schreibenTextId,type ExamAnswers,type ExamResult,type ReadyModule} from '@/lib/a1-exam-course';
import {clearExamRun,clock,examPapers,examSectionProgress,examsSolved,readExamRun,readExamScores,saveExamRun,saveExamScore,spellPapers,type ExamRun,type ExamScoreMap} from '@/lib/a1-exam-progress';
import {examText,loadExamPack,type ExamCopyKey} from '@/lib/a1-exam-copy';
import {useLanguageSwitch} from './language-switch';
import {useAnswerSound} from './study-shared';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {SiteMenuAside} from './site-menu';
import {NavIcon} from './nav-icons';
import {ProgressMeter} from './progress-meter';
import {GuestBanner,GuestLock,GuestMore} from './guest-taste';
import {useSyncVersion} from './lesson-sync';
import {LesenTeil,Paper} from './a1-exam-paper';
import {HoerenTeil} from './a1-exam-hoeren-paper';
import {useExamAudio} from './a1-exam-audio';
import {SpellPanel,SpellView} from './a1-exam-spell';
import {SchreibenTeil} from './a1-exam-schreiben-paper';

/**
 * A1 sınavı (/a1-sinavi, the learner asked, 9 November 2026): practice exams like the written Start Deutsch 1 exam.
 * The section page lists the parts of the exam and the ten exams; every exam has a Hören, a Lesen and a Schreiben
 * paper (Schreiben since 11 November 2026). A paper opens with `?sinav=<number>&bolum=hoeren|lesen|schreiben` (no
 * `bolum` = Lesen): a start page (rules; Lesen and Schreiben with or without their minutes, Hören with the exam's number
 * of hearings or free), the paper
 * one Teil at a time (app/a1-exam-paper.tsx, app/a1-exam-hoeren-paper.tsx; every answer is a tap, nothing is marked right
 * or wrong before the end), then the result (points of 15, the 60 % pass mark, the certificate points × 1,66) and every
 * answer explained in the site language — in Hören with the spoken text. Results stay in the browser and travel with
 * the account (lib/a1-exam-progress.ts); a visitor without an account opens exam 1 and nothing is saved.
 * Beside the exams there is a spelling practice, „Buchstabieren“ (app/a1-exam-spell.tsx, `?sinav=<1–3>&bolum=buchstabieren`).
 */
export default function A1ExamStudy({guest=false}:{guest?:boolean}){
 const [language,setLanguage]=useState<StudyLanguage>('de');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage,loadExamPack); // the explanations (lib/a1-exam-packs) load with the language
 useEffect(()=>{switchLanguage(browserLanguage(),()=>setLoaded(true));},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title=examText(language,'title')+' · '+SITE_NAME;rememberSiteLanguage(language);},[language,loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <ExamSection language={language} onLanguage={switchLanguage} guest={guest}/>;
}

/** The paper in the address: ?sinav=3&bolum=hoeren (an address without `bolum` is the Lesen paper); `bolum=buchstabieren`
 * is a sheet of the spelling practice (1–3). */
type PaperModule=ReadyModule|typeof SPELL_MODULE;
type Place={number:number;module:PaperModule}|null;
function readPlace():Place{
 const params=new URLSearchParams(window.location.search);const value=Number(params.get('sinav'));if(!isExamNumber(value))return null;
 const part=params.get('bolum');if(part===SPELL_MODULE)return isSpellNumber(value)?{number:value,module:SPELL_MODULE}:null;
 return {number:value,module:isReadyModule(part)?part:'lesen'};
}
const examHref=(number:number,module:PaperModule)=>A1_EXAM_PATH+'?sinav='+number+'&bolum='+module;
const MODULE_ICON:Record<ExamModule,typeof Headphones>={hoeren:Headphones,lesen:FileText,schreiben:PenLine};
const MODULE_NAME:Record<ReadyModule,string>={hoeren:'Hören',lesen:'Lesen',schreiben:'Schreiben'};
const MODULE_TOTAL:Record<ReadyModule,number>={hoeren:HOEREN_TOTAL,lesen:LESEN_TOTAL,schreiben:SCHREIBEN_TOTAL};
const READY:readonly ReadyModule[]=['hoeren','lesen','schreiben'];
/** What there is to do in a paper before handing in: 15 questions; in Schreiben the form's five entries and the message. */
const MODULE_STEPS:Record<ReadyModule,number>={hoeren:HOEREN_TOTAL,lesen:LESEN_TOTAL,schreiben:SCHREIBEN_STEPS};
type Open=(number:number|null,module?:PaperModule)=>void;

function ExamSection({language,onLanguage,guest}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;guest:boolean}){
 const [place,setPlace]=useState<Place>(null);const [running,setRunning]=useState(false);
 useEffect(()=>{const read=()=>setPlace(readPlace());read();window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read);},[]);
 const open=useCallback<Open>((next,module='lesen')=>{
  setPlace(next?{number:next,module}:null);setRunning(false);
  try{const url=new URL(window.location.href);if(next){url.searchParams.set('sinav',String(next));url.searchParams.set('bolum',module);}else{url.searchParams.delete('sinav');url.searchParams.delete('bolum');}window.history.pushState(null,'',url);}catch{}
  requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-heading')?.focus({preventScroll:true});});
 },[]);
 const dir=languageDirection(language);
 return <div className={'category-app toon-app x1-app'+(running?' x1-running':'')} lang={language} dir={dir}>
  <a className="skip-link" href="#x1-main">{vaultText(language,'skipContent')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value))onLanguage(value);}} homeHref="/konular" homeLabel={c(language,'catalogTitle')} guest={guest}/>
  <div className="work-layout site-layout"><SiteMenuAside language={language} current={'exam'}/>
  <main id="x1-main" className="object-page x1-page" lang={language} dir={dir}>
   {guest&&<GuestBanner language={language} back={place?examHref(place.number,place.module):A1_EXAM_PATH}/>}
   {!place?<ExamHome language={language} guest={guest} onOpen={open}/>
    :place.module===SPELL_MODULE?<SpellView key={place.module+place.number} number={place.number} language={language} guest={guest} onHome={()=>open(null)} onSheet={next=>open(next,SPELL_MODULE)} onRunning={setRunning}/>
    :<ExamView key={place.module+place.number} number={place.number} module={place.module} language={language} guest={guest} onOpen={open} onRunning={setRunning}/>}
  </main></div>
  <SiteFooter language={language}/>
 </div>;
}

/** The three parts of the written exam, each with its papers (a part without papers would show „yakında“). Inside an exam (`number`) the
 * ready parts are links to that exam's other paper. */
function Modules({language,current,number,onOpen}:{language:StudyLanguage;current?:ExamModule;number?:number;onOpen?:Open}){
 return <ul className="x1-modules" aria-label={examText(language,'modules')}>{examModules.map(module=>{const Icon=MODULE_ICON[module.id];const link=number&&onOpen&&isReadyModule(module.id)&&current!==module.id?module.id:null;
  const body=<><span className="x1-module-num" aria-hidden="true">{module.number}</span><Icon size={20} aria-hidden="true"/>
   <span className="x1-module-words"><strong lang="de" dir="ltr">{module.name}</strong>
    <small>{module.ready?<>{examText(language,'examCount',{n:LESEN_EXAM_COUNT})} · {examText(language,'minutes',{n:module.minutes})}</>:<><Clock size={13} aria-hidden="true"/>{examText(language,'soon')}</>}</small></span></>;
  return <li key={module.id} className={'x1-module'+(module.ready?' ready':' soon')+(current===module.id?' current':'')} data-x1-module={module.id} data-ready={module.ready?'1':'0'} aria-current={current===module.id?'step':undefined}>
   {link&&number?<a className="x1-module-link" href={examHref(number,link)} onClick={event=>{event.preventDefault();onOpen?.(number,link);}}>{body}</a>:body}
  </li>;})}</ul>;
}

/* ---------- the section page: what the exam is, its parts, the ten exams with their papers ---------- */
function ExamHome({language,guest,onOpen}:{language:StudyLanguage;guest:boolean;onOpen:Open}){
 const [scores,setScores]=useState<ExamScoreMap>({});const [marks,setMarks]=useState<Record<string,number>>({});
 const synced=useSyncVersion('site'); // results from another device: read them again (app/lesson-sync.tsx)
 const [back,setBack]=useState(0);
 useEffect(()=>{const visible=()=>{if(document.visibilityState==='visible')setBack(n=>n+1);};document.addEventListener('visibilitychange',visible);return()=>document.removeEventListener('visibilitychange',visible);},[]);
 useEffect(()=>{
  if(guest)return;
  try{setScores(readExamScores(localStorage));const open:Record<string,number>={};for(const exam of [...examPapers,...spellPapers]){const run=readExamRun(localStorage,exam.id);const count=run&&!run.done?Object.keys(run.texts??{}).length+Object.keys(run.answers).length:0;if(count>0)open[exam.id]=count;}setMarks(open);}catch{}
 },[guest,synced,back]);
 const progress=useMemo(()=>examSectionProgress(scores),[scores]);const solved=examsSolved(scores);
 return <>
  <div className="x1-hero">
   <span className="x1-hero-badge" aria-hidden="true"><NavIcon name="exam"/></span>
   <div><h1 id="x1-heading" tabIndex={-1} className="x1-hero-title">{examText(language,'title')}</h1><p className="x1-hero-sub">{examText(language,'lead')}</p></div>
  </div>
  <Modules language={language}/>
  <section className="panel x1-about" aria-labelledby="x1-about-heading"><h2 id="x1-about-heading">{examText(language,'aboutTitle')}</h2><p>{examText(language,'about')}</p></section>
  <SpellPanel language={language} guest={guest} scores={scores} marks={marks} onOpen={number=>onOpen(number,SPELL_MODULE)}/>
  <section className="x1-exams" aria-labelledby="x1-exams-heading">
   <div className="x1-exams-head"><h2 id="x1-exams-heading">{examText(language,'examsTitle')}</h2>
    {!guest&&<div className="x1-exams-progress"><ProgressMeter progress={progress} language={language} label={examText(language,'examsTitle')} compact/><small data-x1-solved={solved}>{examText(language,'solved',{n:solved,total:examPapers.length})}</small></div>}</div>
   <ul className="x1-grid">{Array.from({length:LESEN_EXAM_COUNT},(_,i)=>i+1).map(number=>{const locked=guest&&number!==GUEST_EXAM;
    const papers=READY.map(module=>{const exam=examList(module)[number-1];const score=scores[exam.id];return {module,exam,score,half:marks[exam.id],pass:score?hasPassed(score.right,score.total):false};});
    const all=papers.every(paper=>paper.pass);
    return <li key={number} className={'panel x1-card'+(all?' passed':'')+(locked?' guest-locked':'')} data-x1-exam={number}>
     <div className="x1-card-top"><span className="x1-card-num" aria-hidden="true">{number}</span><h3>{examText(language,'examN',{n:number})}</h3>{all&&<span className="x1-badge ok"><Check size={14} aria-hidden="true"/>{examText(language,'passed')}</span>}</div>
     <ul className="x1-papers">
      {papers.map(({module,exam,score,half,pass})=>{const Icon=MODULE_ICON[module];
       return <li key={module} className={'x1-paper-row'+(score?pass?' passed':' tried':'')} data-x1-paper={exam.id}>
        <span className="x1-paper-name"><Icon size={18} aria-hidden="true"/><strong lang="de" dir="ltr">{MODULE_NAME[module]}</strong>{score&&<span className={'x1-badge '+(pass?'ok':'no')}>{score.right}/{score.total}</span>}</span>
        <span className="x1-card-topics" lang="de" dir="ltr">{exam.topics}</span>
        <span className="x1-card-state">{score?examText(language,'best',{right:score.right,total:score.total}):half!==undefined?examText(language,module==='schreiben'?'filled':'inProgress',{n:Math.min(half,MODULE_STEPS[module]),total:MODULE_STEPS[module]}):examText(language,'notStarted')}</span>
        {locked?<GuestLock language={language} back={examHref(number,module)}/>
         :<a className={'btn small x1-open'+(score&&half===undefined?' secondary':'')} href={examHref(number,module)} onClick={event=>{event.preventDefault();onOpen(number,module);}}>{examText(language,half!==undefined?'resume':score?'review':'open')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></a>}
       </li>;})}
     </ul>
    </li>;})}</ul>
  </section>
 </>;
}
/** A site-language text with `*German words*`. */
function Starred({text}:{text:string}){const parts=text.split(/(\*[^*]+\*)/g);return <>{parts.map((part,i)=>part.length>2&&part.startsWith('*')&&part.endsWith('*')?<bdi key={i} className="x1-quote" lang="de" dir="ltr">{part.slice(1,-1)}</bdi>:part)}</>;}

/* ---------- one paper: start page → paper → result with every answer explained ---------- */
type Phase='intro'|'paper'|'result';
type Loaded={module:'lesen';exam:A1Exam}|{module:'hoeren';exam:A1HoerenExam}|{module:'schreiben';exam:A1SchreibenExam};
const freshRun=(timed:boolean):ExamRun=>({answers:{},seconds:0,teil:1,timed,done:false});
const itemsOf=(loaded:Loaded):{teil:1|2|3;item:{id:string;answer:ExamAnswer}}[]=>loaded.module==='lesen'?lesenItems(loaded.exam.lesen):loaded.module==='hoeren'?hoerenItems(loaded.exam.hoeren):[];
/** Marks a paper: Hören and Lesen by their answers; Schreiben by what was typed into the form and the marks the learner gave the own message. */
const gradeOf=(loaded:Loaded,run:Pick<ExamRun,'answers'|'texts'>)=>loaded.module==='schreiben'?gradeSchreiben(loaded.exam,run.answers,run.texts??{}):gradeItems(itemsOf(loaded),run.answers);
/** A number of points as it is written here: 12,5. */
const pointsText=(value:number)=>String(value).replace('.',',');
/** What a start page says for its part: the rules, the choice (the clock or the number of hearings), three tips. */
const INTRO:Record<ReadyModule,{rules:readonly ExamCopyKey[];on:ExamCopyKey;off:ExamCopyKey;choice:ExamCopyKey;tips:ExamCopyKey;tipList:readonly ExamCopyKey[]}>={
 lesen:{rules:['rule1','rule2','rule3','rule4'],on:'timed',off:'untimed',choice:'timeLeft',tips:'tipsTitle',tipList:['tip1','tip2','tip3']},
 hoeren:{rules:['hoerenRule1','hoerenRule2','rule3','hoerenRule4'],on:'listenStrict',off:'listenFree',choice:'listenMode',tips:'htipsTitle',tipList:['htip1','htip2','htip3']},
 schreiben:{rules:['schreibenRule1','schreibenRule2','rule3','schreibenRule4'],on:'timed20',off:'untimed',choice:'timeLeft',tips:'stipsTitle',tipList:['stip1','stip2','stip3']},
};

function ExamView({number,module,language,guest,onOpen,onRunning}:{number:number;module:ReadyModule;language:StudyLanguage;guest:boolean;onOpen:Open;onRunning:(value:boolean)=>void}){
 const meta=examList(module)[number-1];const locked=guest&&number!==GUEST_EXAM;const total=MODULE_TOTAL[module];const minutes=moduleMinutes[module];const hoeren=module==='hoeren';
 const [loaded,setLoaded]=useState<Loaded|null>(null);
 const [run,setRun]=useState<ExamRun|null>(null);const [phase,setPhase]=useState<Phase>('intro');
 const [seconds,setSeconds]=useState(0);const [timed,setTimed]=useState(true);const [showClock,setShowClock]=useState(true);const [ask,setAsk]=useState(false);
 const sound=useAnswerSound();const audio=useExamAudio();const latest=useRef({sound,run,seconds,audio,loaded});latest.current={sound,run,seconds,audio,loaded};
 useEffect(()=>{
  if(locked)return;let alive=true;
  const done=(next:Loaded)=>{if(alive)setLoaded(next);};
  if(module==='hoeren')loadHoerenExam(number).then(exam=>done({module:'hoeren',exam})).catch(()=>{});
  else if(module==='schreiben')loadSchreibenExam(number).then(exam=>done({module:'schreiben',exam})).catch(()=>{});
  else loadLesenExam(number).then(exam=>done({module:'lesen',exam})).catch(()=>{});
  return()=>{alive=false;};
 },[number,module,locked]);
 // A member's saved run: a handed-in paper opens on its result, a half-done one on the start page with "Devam et".
 useEffect(()=>{
  if(guest)return;
  try{const saved=readExamRun(localStorage,meta.id);if(saved){setRun(saved);setSeconds(saved.seconds);setTimed(saved.timed);if(saved.done)setPhase('result');}}catch{}
 },[guest,meta.id]);
 useEffect(()=>{onRunning(phase==='paper');return()=>onRunning(false);},[phase,onRunning]);
 /** Keeps the run in the browser (members only), with the clock as it stands. */
 const keep=useCallback((next:ExamRun)=>{if(!guest)saveExamRun(localStorage,meta.id,{...next,seconds:latest.current.seconds});},[guest,meta.id]);
 // The clock runs while the paper is on the screen and the tab is visible; it is saved now and then and when the learner leaves.
 useEffect(()=>{
  if(phase!=='paper')return;
  const tick=window.setInterval(()=>{if(document.visibilityState==='visible')setSeconds(value=>value+1);},1000);
  const save=()=>{const current=latest.current.run;if(current&&!current.done)keep(current);};
  const later=window.setInterval(save,15000);
  document.addEventListener('visibilitychange',save);window.addEventListener('pagehide',save);
  return()=>{window.clearInterval(tick);window.clearInterval(later);document.removeEventListener('visibilitychange',save);window.removeEventListener('pagehide',save);save();};
 },[phase,keep]);
 const top=useCallback(()=>requestAnimationFrame(()=>{const head=document.getElementById('x1-exam-top');if(head)head.scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-teil-heading')?.focus({preventScroll:true});}),[]);
 const toTop=()=>requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-heading')?.focus({preventScroll:true});});
 const start=(resume:boolean)=>{
  latest.current.sound.prepare();
  const next=resume&&run&&!run.done?{...run,timed}:freshRun(timed);
  if(!resume||!run||run.done){setSeconds(0);latest.current.seconds=0;}
  setRun(next);keep(next);setAsk(false);setPhase('paper');top();
 };
 const mark=useCallback((id:string,value:ExamAnswer)=>{
  setRun(current=>{if(!current||current.done)return current;const answers:ExamAnswers={...current.answers};if(answers[id]===value)delete answers[id];else answers[id]=value;const next={...current,answers};keep(next);return next;});setAsk(false);
 },[keep]);
 /** A Hören text was started: counted for the number of hearings (the review does not count). */
 const played=useCallback((key:string)=>{
  setRun(current=>{if(!current||current.done)return current;const next={...current,plays:{...current.plays,[key]:(current.plays?.[key]??0)+1}};keep(next);return next;});
 },[keep]);
 const toTeil=(teil:1|2|3)=>{latest.current.audio.stop();setRun(current=>{if(!current)return current;const next={...current,teil};keep(next);return next;});setAsk(false);top();};
 /** Schreiben: what is typed into the form or written as the message. */
 const write=useCallback((id:string,value:string)=>{
  setRun(current=>{if(!current||current.done)return current;const texts={...current.texts};if(value)texts[id]=value;else delete texts[id];const next={...current,texts};keep(next);return next;});setAsk(false);
 },[keep]);
 /** Schreiben, after handing in: the learner marks the own message; the result on this page and the saved best result follow. */
 const selfMark=useCallback((id:string,value:ExamAnswer)=>{
  setRun(current=>{
   if(!current||!current.done)return current;const next={...current,answers:{...current.answers,[id]:value}};keep(next);
   const paper=latest.current.loaded;
   if(!guest&&paper?.module==='schreiben')try{const graded=gradeSchreiben(paper.exam,next.answers,next.texts??{});saveExamScore(localStorage,meta.id,graded.right,graded.total,next.timed?next.seconds:0,Date.now(),false);}catch{}
   return next;});
 },[keep,guest,meta.id]);
 const result:ExamResult|null=useMemo(()=>loaded&&run?gradeOf(loaded,run):null,[loaded,run]);
 const finish=()=>{
  if(!loaded||!run||!result)return;
  latest.current.audio.stop();
  const done={...run,done:true,seconds:latest.current.seconds};setRun(done);keep(done);
  if(!guest)try{saveExamScore(localStorage,meta.id,result.right,result.total,!hoeren&&run.timed?latest.current.seconds:0);}catch{}
  setAsk(false);setPhase('result');latest.current.sound.complete();toTop();
 };
 const again=()=>{latest.current.audio.stop();if(!guest)clearExamRun(localStorage,meta.id);setRun(null);setSeconds(0);setAsk(false);setPhase('intro');toTop();};
 const title=examText(language,'examN',{n:number});const part=<span lang="de" dir="ltr">{MODULE_NAME[module]}</span>;
 const backLink=<a className="x1-back" href={A1_EXAM_PATH} onClick={event=>{event.preventDefault();latest.current.audio.stop();onOpen(null);}}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{examText(language,'toExams')}</a>;
 if(locked)return <div className="x1-exam">{backLink}<h1 id="x1-heading" tabIndex={-1} className="x1-exam-title">{part} · {title}</h1><GuestMore language={language} back={examHref(number,module)}/></div>;
 if(!loaded)return <div className="x1-exam">{backLink}<p className="course-loading" role="status">{examText(language,'loading')}</p></div>;
 const items=itemsOf(loaded);const teile=moduleTeile[module];const last=teile[teile.length-1];const writing=loaded.module==='schreiben';
 const texts=run?.texts??{};const steps=MODULE_STEPS[module];
 // What is done so far: marked questions; in Schreiben the form's entries that are filled in and the message once it has words.
 const marked=!run?0:loaded.module==='schreiben'?schreibenFilled(loaded.exam,texts):Object.keys(run.answers).length;
 const teilCount=(teil:1|2|3)=>loaded.module==='schreiben'
  ?teil===1?{done:loaded.exam.schreiben.teil1.items.filter(item=>normalizeEntry(texts[item.id]??'')).length,total:5}:{done:countWords(texts[schreibenTextId(loaded.exam.id)]??'')?1:0,total:1}
  :{done:items.filter(entry=>entry.teil===teil&&run?.answers[entry.item.id]!==undefined).length,total:items.filter(entry=>entry.teil===teil).length};
 const openLeft=steps-marked;
 /** The paper of a Teil: Lesen or Hören; `review` after handing in. */
 const sheet=(teil:1|2|3,answers:ExamAnswers,review:boolean)=>loaded.module==='lesen'
  ?<LesenTeil key={teil} lesen={loaded.exam.lesen} teil={teil} answers={answers} onMark={review?undefined:mark} review={review} language={language}/>
  :loaded.module==='schreiben'?<SchreibenTeil key={teil} schreiben={loaded.exam.schreiben} examId={loaded.exam.id} teil={teil===2?2:1} answers={answers} texts={texts} onText={review?undefined:write} onSelf={review?selfMark:undefined} review={review} language={language}/>
  :<HoerenTeil key={teil} hoeren={loaded.exam.hoeren} examId={meta.id} teil={teil} answers={answers} onMark={review?undefined:mark} review={review} language={language} audio={audio} plays={run?.plays??{}} limit={!!run?.timed} onPlay={review?()=>{}:played}/>;
 const voiceNote=hoeren&&audio.voices==='unavailable'?<p className="x1-voice-note" role="status">{examText(language,'voiceNote')}</p>:null;

 if(phase==='intro'){const half=!!run&&!run.done&&marked>0;const intro=INTRO[module];
  return <div className="x1-exam" data-x1-phase="intro" data-x1-part={module}>{backLink}
   <Modules language={language} current={module} number={number} onOpen={onOpen}/>
   <section className="panel x1-cover" aria-labelledby="x1-heading">
    <p className="eyebrow" lang="de" dir="ltr">A1 · {MODULE_NAME[module]}</p>
    <h1 id="x1-heading" tabIndex={-1} className="x1-exam-title">{title}</h1>
    <p className="x1-cover-topics" lang="de" dir="ltr">{meta.topics}</p>
    <p className="x1-cover-facts"><span><ListChecks size={17} aria-hidden="true"/>{examText(language,module==='schreiben'?'pointsTotal':'questions',{n:total})}</span><span><Timer size={17} aria-hidden="true"/>{examText(language,'minutes',{n:minutes})}</span><span><Flag size={17} aria-hidden="true"/>{passMark(total)}/{total} = 60 %</span></p>
    <h2 className="x1-rules-title">{examText(language,'rulesTitle')}</h2>
    <ul className="x1-rules">{intro.rules.map(key=><li key={key}>{examText(language,key)}</li>)}</ul>
    <details className="x1-tips"><summary>{examText(language,intro.tips)}</summary><ol>{intro.tipList.map(key=><li key={key}><Starred text={examText(language,key)}/></li>)}</ol></details>
    <div className="x1-timer-choice" role="radiogroup" aria-label={examText(language,intro.choice)}>
     <button type="button" role="radio" aria-checked={timed} className={timed?'on':''} onClick={()=>setTimed(true)}>{hoeren?<Headphones size={17} aria-hidden="true"/>:<Timer size={17} aria-hidden="true"/>}{examText(language,intro.on)}</button>
     <button type="button" role="radio" aria-checked={!timed} className={!timed?'on':''} onClick={()=>setTimed(false)}>{examText(language,intro.off)}</button>
    </div>
    {half&&<p className="x1-half" role="status">{examText(language,writing?'filled':'inProgress',{n:marked,total:steps})}</p>}
    <div className="x1-cover-actions">
     {half&&<button type="button" className="btn" data-x1-resume onClick={()=>start(true)}>{examText(language,'resume')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>}
     <button type="button" className={'btn'+(half?' secondary':'')} data-x1-start onClick={()=>start(false)}>{half?<RotateCcw size={18} aria-hidden="true"/>:null}{examText(language,half?'again':'start')}{!half&&<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/>}</button>
    </div>
    <p className="x1-note">{examText(language,guest?'guestNote':'saved')}</p>
   </section>
  </div>;
 }

 if(phase==='paper'&&run){const teil=teile.includes(run.teil)?run.teil:1;const left=minutes*60-seconds;const clocked=!hoeren&&run.timed;const over=clocked&&left<=0;
  return <div className="x1-exam" data-x1-phase="paper" data-x1-part={module}>
   <div className="x1-bar" id="x1-exam-top">
    <h1 id="x1-heading" tabIndex={-1} className="x1-bar-title">{part} · {title}</h1>
    <div className="x1-bar-tools">
     <span className="x1-marked" data-x1-marked={marked}><ListChecks size={16} aria-hidden="true"/>{examText(language,writing?'filled':'marked',{n:marked,total:steps})}</span>
     {clocked&&<span className={'x1-clock'+(over?' over':left<=300?' low':'')} role="timer" aria-label={examText(language,'timeLeft')} data-x1-clock>
      <Timer size={16} aria-hidden="true"/>{showClock?<b dir="ltr">{over?'0:00':clock(left)}</b>:<b aria-hidden="true">··:··</b>}
      <button type="button" className="x1-clock-eye" onClick={()=>setShowClock(value=>!value)} aria-label={examText(language,showClock?'hideTimer':'showTimer')} title={examText(language,showClock?'hideTimer':'showTimer')}>{showClock?<EyeOff size={16} aria-hidden="true"/>:<Eye size={16} aria-hidden="true"/>}</button>
     </span>}
    </div>
    <div className={'x1-tabs'+(teile.length===2?' two':'')} role="tablist" aria-label={MODULE_NAME[module]}>{teile.map(value=>{const count=teilCount(value);
     return <button type="button" key={value} role="tab" aria-selected={teil===value} className={'x1-tab'+(teil===value?' on':'')+(count.done===count.total?' full':'')} onClick={()=>toTeil(value)} data-x1-tab={value}><span lang="de" dir="ltr">Teil {value}</span><small dir="ltr">{count.done}/{count.total}</small></button>;})}</div>
   </div>
   {over&&<p className="x1-timeup" role="status"><Clock size={18} aria-hidden="true"/>{examText(language,'timeUp')}</p>}
   {voiceNote}
   <Paper minutes={minutes} module={module}>{sheet(teil,run.answers,false)}</Paper>
   {ask&&result&&<div className="x1-ask" role="alertdialog" aria-labelledby="x1-ask-text" data-x1-ask>
    <p id="x1-ask-text">{examText(language,'openLeft',{n:openLeft})}</p>
    <div className="x1-ask-actions"><button type="button" className="btn secondary" onClick={()=>setAsk(false)}>{examText(language,'keepSolving')}</button><button type="button" className="btn" data-x1-finish-anyway onClick={finish}>{examText(language,'finishAnyway')}</button></div>
   </div>}
   <nav className="x1-pager" aria-label={'Teil 1–'+last}>
    <button type="button" className="btn secondary" disabled={teil===1} onClick={()=>toTeil((teil-1) as 1|2)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>{examText(language,'back')}</button>
    {teil<last?<button type="button" className="btn" data-x1-next onClick={()=>toTeil((teil+1) as 2|3)}>{examText(language,'next')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>
     :<button type="button" className="btn x1-finish" data-x1-finish onClick={()=>{if(result&&openLeft>0&&!ask){setAsk(true);requestAnimationFrame(()=>document.querySelector('[data-x1-ask]')?.scrollIntoView({block:'center'}));}else finish();}}><Flag size={18} aria-hidden="true"/>{examText(language,'finish')}</button>}
   </nav>
   <p className="x1-note">{examText(language,guest?'guestNote':'saved')}</p>
  </div>;
 }

 // The result: points, the pass mark, each Teil, then the whole paper with every answer explained.
 const shown=run??freshRun(true);const outcome=result??gradeOf(loaded,{answers:{}});const pass=hasPassed(outcome.right,outcome.total);const mark60=passMark(outcome.total);
 // Schreiben: the message waits for the learner's own marks (below the sample answer).
 const selfOpen=loaded.module==='schreiben'&&SCHREIBEN_CRITERIA.some(criterion=>shown.answers[criterionId(loaded.exam.id,criterion.n)]===undefined);
 // After Hören comes the same exam's Lesen, after Lesen its Schreiben; after Schreiben the next exam starts with its Hören.
 const next:{number:number;module:ReadyModule}|null=hoeren?{number,module:'lesen'}:module==='lesen'?{number,module:'schreiben'}:number<LESEN_EXAM_COUNT?{number:number+1,module:'hoeren'}:null;
 return <div className="x1-exam" data-x1-phase="result" data-x1-part={module}>{backLink}
  <section className={'panel x1-result '+(pass?'ok':'no')} aria-labelledby="x1-heading" data-x1-result={outcome.right}>
   <p className="eyebrow">{part} · {title}</p>
   <h1 id="x1-heading" tabIndex={-1} className="x1-result-title">{examText(language,'resultTitle')}</h1>
   <p className="x1-score"><strong dir="ltr">{pointsText(outcome.right)} / {outcome.total}</strong><span className={'x1-badge big '+(pass?'ok':'no')}>{pass&&<Check size={16} aria-hidden="true"/>}{examText(language,pass?'passed':'failed')}</span></p>
   <div className="x1-scale" aria-hidden="true"><i style={{width:(outcome.right/outcome.total*100)+'%'}}/><span style={{insetInlineStart:(mark60/outcome.total*100)+'%'}}/></div>
   <p className="x1-result-text">{examText(language,pass?'resultPass':'resultFail',{mark:mark60,total:outcome.total})}</p>
   {selfOpen&&<p className="x1-self-todo" role="status" data-x1-self-todo>{examText(language,'selfTodo')}</p>}
   <p className="x1-result-note">{examText(language,'resultCert',{points:examPoints(outcome.right)})}</p>
   <ul className="x1-teile">{teile.map(teil=><li key={teil}><span lang="de" dir="ltr">Teil {teil}</span><b dir="ltr">{pointsText(outcome.byTeil[teil].right)}/{outcome.byTeil[teil].total}</b></li>)}
    {!hoeren&&shown.timed&&shown.seconds>0&&<li className="x1-time"><Timer size={15} aria-hidden="true"/>{examText(language,'timeUsed',{time:clock(shown.seconds)})}</li>}</ul>
   <div className="x1-cover-actions">
    <button type="button" className="btn secondary" data-x1-again onClick={again}><RotateCcw size={18} aria-hidden="true"/>{examText(language,'again')}</button>
    {next&&!(guest&&next.number!==GUEST_EXAM)&&<a className="btn" data-x1-next-paper href={examHref(next.number,next.module)} onClick={event=>{event.preventDefault();latest.current.audio.stop();onOpen(next.number,next.module);}}>{next.number===number?examText(language,'continueWith',{part:MODULE_NAME[next.module]}):examText(language,'nextExam')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></a>}
   </div>
   {guest&&<GuestMore language={language} back={examHref(number,module)}/>}
  </section>
  <h2 className="x1-review-title" id="x1-review">{examText(language,'reviewTitle')}</h2>
  {voiceNote}
  <Paper minutes={minutes} module={module}>{teile.map(teil=>sheet(teil,shown.answers,true))}</Paper>
  <div className="x1-cover-actions x1-end">{backLink}<button type="button" className="btn secondary" onClick={again}><RotateCcw size={18} aria-hidden="true"/>{examText(language,'again')}</button></div>
 </div>;
}
