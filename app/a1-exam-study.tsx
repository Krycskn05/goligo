'use client';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,Clock,Eye,EyeOff,FileText,Flag,Headphones,ListChecks,PenLine,RotateCcw,Timer} from 'lucide-react';
import {browserLanguage,rememberSiteLanguage} from '@/lib/device-language';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import type {A1Exam,ExamAnswer,ExamModule} from '@/lib/a1-exam-types';
import {A1_EXAM_PATH,GUEST_EXAM,LESEN_EXAM_COUNT,LESEN_MINUTES,LESEN_TOTAL,examModules,examPoints,gradeLesen,hasPassed,isExamNumber,lesenExamList,lesenItems,loadLesenExam,passMark,type ExamAnswers,type LesenResult} from '@/lib/a1-exam-course';
import {clearExamRun,clock,examSectionProgress,examsSolved,readExamRun,readExamScores,saveExamRun,saveExamScore,type ExamRun,type ExamScoreMap} from '@/lib/a1-exam-progress';
import {examText,loadExamPack} from '@/lib/a1-exam-copy';
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

/**
 * A1 sınavı (/a1-sinavi, the learner asked, 9 November 2026): practice exams like the written Start Deutsch 1 exam.
 * The section page lists the parts of the exam — Hören and Schreiben are shown as coming later, Lesen has ten exams —
 * and an exam opens with `?sinav=<number>`: a start page (rules, with or without the 25 minutes), the paper one Teil
 * at a time (app/a1-exam-paper.tsx; every answer is a tap, nothing is marked right or wrong before the end), then the
 * result (points of 15, the 60 % pass mark, the certificate points × 1,66) and every answer explained in the site
 * language. Results stay in the browser and travel with the account (lib/a1-exam-progress.ts); a visitor without an
 * account opens exam 1 and nothing is saved.
 */
export default function A1ExamStudy({guest=false}:{guest?:boolean}){
 const [language,setLanguage]=useState<StudyLanguage>('de');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage,loadExamPack); // the explanations (lib/a1-exam-packs) load with the language
 useEffect(()=>{switchLanguage(browserLanguage(),()=>setLoaded(true));},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title=examText(language,'title')+' · '+SITE_NAME;rememberSiteLanguage(language);},[language,loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <ExamSection language={language} onLanguage={switchLanguage} guest={guest}/>;
}

/** The exam in the address: ?sinav=3. */
function readNumber():number|null{const value=Number(new URLSearchParams(window.location.search).get('sinav'));return isExamNumber(value)?value:null;}
const examHref=(number:number)=>A1_EXAM_PATH+'?sinav='+number;
const MODULE_ICON:Record<ExamModule,typeof Headphones>={hoeren:Headphones,lesen:FileText,schreiben:PenLine};

function ExamSection({language,onLanguage,guest}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;guest:boolean}){
 const [number,setNumber]=useState<number|null>(null);const [running,setRunning]=useState(false);
 useEffect(()=>{const read=()=>setNumber(readNumber());read();window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read);},[]);
 const open=useCallback((next:number|null)=>{
  setNumber(next);setRunning(false);
  try{const url=new URL(window.location.href);if(next)url.searchParams.set('sinav',String(next));else url.searchParams.delete('sinav');window.history.pushState(null,'',url);}catch{}
  requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-heading')?.focus({preventScroll:true});});
 },[]);
 const dir=languageDirection(language);
 return <div className={'category-app toon-app x1-app'+(running?' x1-running':'')} lang={language} dir={dir}>
  <a className="skip-link" href="#x1-main">{vaultText(language,'skipContent')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value))onLanguage(value);}} homeHref="/konular" homeLabel={c(language,'catalogTitle')} guest={guest}/>
  <div className="work-layout site-layout"><SiteMenuAside language={language} current={'exam'}/>
  <main id="x1-main" className="object-page x1-page" lang={language} dir={dir}>
   {guest&&<GuestBanner language={language} back={number?examHref(number):A1_EXAM_PATH}/>}
   {number?<ExamView key={number} number={number} language={language} guest={guest} onOpen={open} onRunning={setRunning}/>:<ExamHome language={language} guest={guest} onOpen={open}/>}
  </main></div>
  <SiteFooter language={language}/>
 </div>;
}

/** The three parts of the written exam: Lesen is ready, Hören and Schreiben come later. */
function Modules({language,current}:{language:StudyLanguage;current?:ExamModule}){
 return <ul className="x1-modules" aria-label={examText(language,'modules')}>{examModules.map(module=>{const Icon=MODULE_ICON[module.id];
  return <li key={module.id} className={'x1-module'+(module.ready?' ready':' soon')+(current===module.id?' current':'')} data-x1-module={module.id} data-ready={module.ready?'1':'0'} aria-current={current===module.id?'step':undefined}>
   <span className="x1-module-num" aria-hidden="true">{module.number}</span><Icon size={20} aria-hidden="true"/>
   <span className="x1-module-words"><strong lang="de" dir="ltr">{module.name}</strong>
    <small>{module.ready?<>{examText(language,'examCount',{n:LESEN_EXAM_COUNT})} · {examText(language,'minutes',{n:module.minutes})}</>:<><Clock size={13} aria-hidden="true"/>{examText(language,'soon')}</>}</small></span>
  </li>;})}</ul>;
}

/* ---------- the section page: what the exam is, its parts, the ten Lesen exams ---------- */
function ExamHome({language,guest,onOpen}:{language:StudyLanguage;guest:boolean;onOpen:(number:number|null)=>void}){
 const [scores,setScores]=useState<ExamScoreMap>({});const [marks,setMarks]=useState<Record<string,number>>({});
 const synced=useSyncVersion('site'); // results from another device: read them again (app/lesson-sync.tsx)
 const [back,setBack]=useState(0);
 useEffect(()=>{const visible=()=>{if(document.visibilityState==='visible')setBack(n=>n+1);};document.addEventListener('visibilitychange',visible);return()=>document.removeEventListener('visibilitychange',visible);},[]);
 useEffect(()=>{
  if(guest)return;
  try{setScores(readExamScores(localStorage));const open:Record<string,number>={};for(const exam of lesenExamList){const run=readExamRun(localStorage,exam.id);const count=run&&!run.done?Object.keys(run.answers).length:0;if(count>0)open[exam.id]=count;}setMarks(open);}catch{}
 },[guest,synced,back]);
 const progress=useMemo(()=>examSectionProgress(scores),[scores]);const solved=examsSolved(scores);
 const go=(event:{preventDefault():void},n:number)=>{event.preventDefault();onOpen(n);};
 return <>
  <div className="x1-hero">
   <span className="x1-hero-badge" aria-hidden="true"><NavIcon name="exam"/></span>
   <div><h1 id="x1-heading" tabIndex={-1} className="x1-hero-title">{examText(language,'title')}</h1><p className="x1-hero-sub">{examText(language,'lead')}</p></div>
  </div>
  <Modules language={language} current="lesen"/>
  <div className="x1-info">
   <section className="panel x1-about" aria-labelledby="x1-about-heading"><h2 id="x1-about-heading">{examText(language,'aboutTitle')}</h2><p>{examText(language,'about')}</p>
    <p className="x1-soon-line"><Headphones size={16} aria-hidden="true"/>{examText(language,'hoerenSoon')}</p><p className="x1-soon-line"><PenLine size={16} aria-hidden="true"/>{examText(language,'schreibenSoon')}</p></section>
   <section className="panel x1-tips" aria-labelledby="x1-tips-heading"><h2 id="x1-tips-heading">{examText(language,'tipsTitle')}</h2>
    <ol>{(['tip1','tip2','tip3'] as const).map(key=><li key={key}><Starred text={examText(language,key)}/></li>)}</ol></section>
  </div>
  <section className="x1-exams" aria-labelledby="x1-exams-heading">
   <div className="x1-exams-head"><h2 id="x1-exams-heading">{examText(language,'examsTitle')}</h2>
    {!guest&&<div className="x1-exams-progress"><ProgressMeter progress={progress} language={language} label={examText(language,'examsTitle')} compact/><small data-x1-solved={solved}>{examText(language,'solved',{n:solved,total:LESEN_EXAM_COUNT})}</small></div>}</div>
   <ul className="x1-grid">{lesenExamList.map(exam=>{const score=scores[exam.id];const half=marks[exam.id];const locked=guest&&exam.number!==GUEST_EXAM;const pass=score?hasPassed(score.right,score.total):false;
    return <li key={exam.id} className={'panel x1-card'+(score?pass?' passed':' tried':'')+(locked?' guest-locked':'')} data-x1-exam={exam.id}>
     <div className="x1-card-top"><span className="x1-card-num" aria-hidden="true">{exam.number}</span><h3>{examText(language,'examN',{n:exam.number})}</h3>
      {score&&<span className={'x1-badge '+(pass?'ok':'no')}>{pass&&<Check size={14} aria-hidden="true"/>}{examText(language,pass?'passed':'failed')}</span>}</div>
     <p className="x1-card-topics" lang="de" dir="ltr">{exam.topics}</p>
     <p className="x1-card-meta">{examText(language,'questions',{n:LESEN_TOTAL})} · {examText(language,'minutes',{n:LESEN_MINUTES})}</p>
     <p className="x1-card-state">{score?examText(language,'best',{right:score.right,total:score.total}):half!==undefined?examText(language,'inProgress',{n:half,total:LESEN_TOTAL}):examText(language,'notStarted')}</p>
     {locked?<GuestLock language={language} back={examHref(exam.number)}/>
      :<a className={'btn small x1-open'+(score&&half===undefined?' secondary':'')} href={examHref(exam.number)} onClick={event=>go(event,exam.number)}>{examText(language,half!==undefined?'resume':score?'review':'open')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></a>}
    </li>;})}</ul>
  </section>
 </>;
}
/** A site-language text with `*German words*`. */
function Starred({text}:{text:string}){const parts=text.split(/(\*[^*]+\*)/g);return <>{parts.map((part,i)=>part.length>2&&part.startsWith('*')&&part.endsWith('*')?<bdi key={i} className="x1-quote" lang="de" dir="ltr">{part.slice(1,-1)}</bdi>:part)}</>;}

/* ---------- one exam: start page → paper → result with every answer explained ---------- */
type Phase='intro'|'paper'|'result';
const freshRun=(timed:boolean):ExamRun=>({answers:{},seconds:0,teil:1,timed,done:false});

function ExamView({number,language,guest,onOpen,onRunning}:{number:number;language:StudyLanguage;guest:boolean;onOpen:(number:number|null)=>void;onRunning:(value:boolean)=>void}){
 const meta=lesenExamList[number-1];const locked=guest&&number!==GUEST_EXAM;
 const [exam,setExam]=useState<A1Exam|null>(null);
 const [run,setRun]=useState<ExamRun|null>(null);const [phase,setPhase]=useState<Phase>('intro');
 const [seconds,setSeconds]=useState(0);const [timed,setTimed]=useState(true);const [showClock,setShowClock]=useState(true);const [ask,setAsk]=useState(false);
 const sound=useAnswerSound();const latest=useRef({sound,run,seconds});latest.current={sound,run,seconds};
 useEffect(()=>{if(locked)return;let alive=true;loadLesenExam(number).then(next=>{if(alive)setExam(next);}).catch(()=>{});return()=>{alive=false;};},[number,locked]);
 // A member's saved run: a handed-in exam opens on its result, a half-done one on the start page with "Devam et".
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
 const start=(resume:boolean)=>{
  latest.current.sound.prepare();
  const next=resume&&run&&!run.done?{...run,timed}:freshRun(timed);
  if(!resume||!run||run.done){setSeconds(0);latest.current.seconds=0;}
  setRun(next);keep(next);setAsk(false);setPhase('paper');top();
 };
 const mark=useCallback((id:string,value:ExamAnswer)=>{
  setRun(current=>{if(!current||current.done)return current;const answers:ExamAnswers={...current.answers};if(answers[id]===value)delete answers[id];else answers[id]=value;const next={...current,answers};keep(next);return next;});setAsk(false);
 },[keep]);
 const toTeil=(teil:1|2|3)=>{setRun(current=>{if(!current)return current;const next={...current,teil};keep(next);return next;});setAsk(false);top();};
 const result:LesenResult|null=useMemo(()=>exam&&run?gradeLesen(exam.lesen,run.answers):null,[exam,run]);
 const finish=()=>{
  if(!exam||!run||!result)return;
  const done={...run,done:true,seconds:latest.current.seconds};setRun(done);keep(done);
  if(!guest)try{saveExamScore(localStorage,meta.id,result.right,result.total,run.timed?latest.current.seconds:0);}catch{}
  setAsk(false);setPhase('result');latest.current.sound.complete();
  requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-heading')?.focus({preventScroll:true});});
 };
 const again=()=>{if(!guest)clearExamRun(localStorage,meta.id);setRun(null);setSeconds(0);setAsk(false);setPhase('intro');requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-heading')?.focus({preventScroll:true});});};
 const title=examText(language,'examN',{n:number});
 const backLink=<a className="x1-back" href={A1_EXAM_PATH} onClick={event=>{event.preventDefault();onOpen(null);}}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{examText(language,'toExams')}</a>;
 if(locked)return <div className="x1-exam">{backLink}<h1 id="x1-heading" tabIndex={-1} className="x1-exam-title"><span lang="de" dir="ltr">Lesen</span> · {title}</h1><GuestMore language={language} back={examHref(number)}/></div>;
 if(!exam)return <div className="x1-exam">{backLink}<p className="course-loading" role="status">{examText(language,'loading')}</p></div>;
 const marked=run?Object.keys(run.answers).length:0;const items=lesenItems(exam.lesen);
 const teilCount=(teil:1|2|3)=>({done:items.filter(entry=>entry.teil===teil&&run?.answers[entry.item.id]!==undefined).length,total:items.filter(entry=>entry.teil===teil).length});

 if(phase==='intro'){const half=!!run&&!run.done&&marked>0;
  return <div className="x1-exam" data-x1-phase="intro">{backLink}
   <Modules language={language} current="lesen"/>
   <section className="panel x1-cover" aria-labelledby="x1-heading">
    <p className="eyebrow" lang="de" dir="ltr">A1 · Lesen</p>
    <h1 id="x1-heading" tabIndex={-1} className="x1-exam-title">{title}</h1>
    <p className="x1-cover-topics" lang="de" dir="ltr">{exam.topics}</p>
    <p className="x1-cover-facts"><span><ListChecks size={17} aria-hidden="true"/>{examText(language,'questions',{n:LESEN_TOTAL})}</span><span><Timer size={17} aria-hidden="true"/>{examText(language,'minutes',{n:LESEN_MINUTES})}</span><span><Flag size={17} aria-hidden="true"/>{passMark(LESEN_TOTAL)}/{LESEN_TOTAL} = 60 %</span></p>
    <h2 className="x1-rules-title">{examText(language,'rulesTitle')}</h2>
    <ul className="x1-rules">{(['rule1','rule2','rule3','rule4'] as const).map(key=><li key={key}>{examText(language,key)}</li>)}</ul>
    <div className="x1-timer-choice" role="radiogroup" aria-label={examText(language,'timeLeft')}>
     <button type="button" role="radio" aria-checked={timed} className={timed?'on':''} onClick={()=>setTimed(true)}><Timer size={17} aria-hidden="true"/>{examText(language,'timed')}</button>
     <button type="button" role="radio" aria-checked={!timed} className={!timed?'on':''} onClick={()=>setTimed(false)}>{examText(language,'untimed')}</button>
    </div>
    {half&&<p className="x1-half" role="status">{examText(language,'inProgress',{n:marked,total:LESEN_TOTAL})}</p>}
    <div className="x1-cover-actions">
     {half&&<button type="button" className="btn" data-x1-resume onClick={()=>start(true)}>{examText(language,'resume')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>}
     <button type="button" className={'btn'+(half?' secondary':'')} data-x1-start onClick={()=>start(false)}>{half?<RotateCcw size={18} aria-hidden="true"/>:null}{examText(language,half?'again':'start')}{!half&&<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/>}</button>
    </div>
    <p className="x1-note">{examText(language,guest?'guestNote':'saved')}</p>
   </section>
  </div>;
 }

 if(phase==='paper'&&run){const teil=run.teil;const left=LESEN_MINUTES*60-seconds;const over=run.timed&&left<=0;
  return <div className="x1-exam" data-x1-phase="paper">
   <div className="x1-bar" id="x1-exam-top">
    <h1 id="x1-heading" tabIndex={-1} className="x1-bar-title"><span lang="de" dir="ltr">Lesen</span> · {title}</h1>
    <div className="x1-bar-tools">
     <span className="x1-marked" data-x1-marked={marked}><ListChecks size={16} aria-hidden="true"/>{examText(language,'marked',{n:marked,total:LESEN_TOTAL})}</span>
     {run.timed&&<span className={'x1-clock'+(over?' over':left<=300?' low':'')} role="timer" aria-label={examText(language,'timeLeft')} data-x1-clock>
      <Timer size={16} aria-hidden="true"/>{showClock?<b dir="ltr">{over?'0:00':clock(left)}</b>:<b aria-hidden="true">··:··</b>}
      <button type="button" className="x1-clock-eye" onClick={()=>setShowClock(value=>!value)} aria-label={examText(language,showClock?'hideTimer':'showTimer')} title={examText(language,showClock?'hideTimer':'showTimer')}>{showClock?<EyeOff size={16} aria-hidden="true"/>:<Eye size={16} aria-hidden="true"/>}</button>
     </span>}
    </div>
    <div className="x1-tabs" role="tablist" aria-label="Lesen">{([1,2,3] as const).map(value=>{const count=teilCount(value);
     return <button type="button" key={value} role="tab" aria-selected={teil===value} className={'x1-tab'+(teil===value?' on':'')+(count.done===count.total?' full':'')} onClick={()=>toTeil(value)} data-x1-tab={value}><span lang="de" dir="ltr">Teil {value}</span><small dir="ltr">{count.done}/{count.total}</small></button>;})}</div>
   </div>
   {over&&<p className="x1-timeup" role="status"><Clock size={18} aria-hidden="true"/>{examText(language,'timeUp')}</p>}
   <Paper minutes={LESEN_MINUTES}><LesenTeil lesen={exam.lesen} teil={teil} answers={run.answers} onMark={mark} language={language}/></Paper>
   {ask&&result&&<div className="x1-ask" role="alertdialog" aria-labelledby="x1-ask-text" data-x1-ask>
    <p id="x1-ask-text">{examText(language,'openLeft',{n:result.open.length})}</p>
    <div className="x1-ask-actions"><button type="button" className="btn secondary" onClick={()=>setAsk(false)}>{examText(language,'keepSolving')}</button><button type="button" className="btn" data-x1-finish-anyway onClick={finish}>{examText(language,'finishAnyway')}</button></div>
   </div>}
   <nav className="x1-pager" aria-label="Teil 1–3">
    <button type="button" className="btn secondary" disabled={teil===1} onClick={()=>toTeil((teil-1) as 1|2)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>{examText(language,'back')}</button>
    {teil<3?<button type="button" className="btn" data-x1-next onClick={()=>toTeil((teil+1) as 2|3)}>{examText(language,'next')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>
     :<button type="button" className="btn x1-finish" data-x1-finish onClick={()=>{if(result&&result.open.length&&!ask){setAsk(true);requestAnimationFrame(()=>document.querySelector('[data-x1-ask]')?.scrollIntoView({block:'center'}));}else finish();}}><Flag size={18} aria-hidden="true"/>{examText(language,'finish')}</button>}
   </nav>
   <p className="x1-note">{examText(language,guest?'guestNote':'saved')}</p>
  </div>;
 }

 // The result: points, the pass mark, each Teil, then the whole paper with every answer explained.
 const shown=run??freshRun(true);const outcome=result??gradeLesen(exam.lesen,{});const pass=hasPassed(outcome.right,outcome.total);const mark60=passMark(outcome.total);
 return <div className="x1-exam" data-x1-phase="result">{backLink}
  <section className={'panel x1-result '+(pass?'ok':'no')} aria-labelledby="x1-heading" data-x1-result={outcome.right}>
   <p className="eyebrow"><span lang="de" dir="ltr">Lesen</span> · {title}</p>
   <h1 id="x1-heading" tabIndex={-1} className="x1-result-title">{examText(language,'resultTitle')}</h1>
   <p className="x1-score"><strong dir="ltr">{outcome.right} / {outcome.total}</strong><span className={'x1-badge big '+(pass?'ok':'no')}>{pass&&<Check size={16} aria-hidden="true"/>}{examText(language,pass?'passed':'failed')}</span></p>
   <div className="x1-scale" aria-hidden="true"><i style={{width:(outcome.right/outcome.total*100)+'%'}}/><span style={{insetInlineStart:(mark60/outcome.total*100)+'%'}}/></div>
   <p className="x1-result-text">{examText(language,pass?'resultPass':'resultFail',{mark:mark60,total:outcome.total})}</p>
   <p className="x1-result-note">{examText(language,'resultCert',{points:examPoints(outcome.right)})}</p>
   <ul className="x1-teile">{([1,2,3] as const).map(teil=><li key={teil}><span lang="de" dir="ltr">Teil {teil}</span><b dir="ltr">{outcome.byTeil[teil].right}/{outcome.byTeil[teil].total}</b></li>)}
    {shown.timed&&shown.seconds>0&&<li className="x1-time"><Timer size={15} aria-hidden="true"/>{examText(language,'timeUsed',{time:clock(shown.seconds)})}</li>}</ul>
   <div className="x1-cover-actions">
    <button type="button" className="btn secondary" data-x1-again onClick={again}><RotateCcw size={18} aria-hidden="true"/>{examText(language,'again')}</button>
    {number<LESEN_EXAM_COUNT&&!(guest&&number+1!==GUEST_EXAM)&&<a className="btn" href={examHref(number+1)} onClick={event=>{event.preventDefault();onOpen(number+1);}}>{examText(language,'nextExam')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></a>}
   </div>
   {guest&&<GuestMore language={language} back={examHref(number)}/>}
  </section>
  <h2 className="x1-review-title" id="x1-review">{examText(language,'reviewTitle')}</h2>
  <Paper minutes={LESEN_MINUTES}>{([1,2,3] as const).map(teil=><LesenTeil key={teil} lesen={exam.lesen} teil={teil} answers={shown.answers} review language={language}/>)}</Paper>
  <div className="x1-cover-actions x1-end">{backLink}<button type="button" className="btn secondary" onClick={again}><RotateCcw size={18} aria-hidden="true"/>{examText(language,'again')}</button></div>
 </div>;
}
