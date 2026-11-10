'use client';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Flag,Headphones,ListChecks,RotateCcw,SpellCheck} from 'lucide-react';
import type {StudyLanguage} from '@/lib/study-languages';
import type {ExamAnswer,ListenOption,SpellExample,SpellSheet,SpellTip} from '@/lib/a1-exam-types';
import {A1_EXAM_PATH,GUEST_EXAM,SPELL_MODULE,SPELL_SHEET_COUNT,SPELL_TOTAL,gradeItems,hasPassed,loadSpellSheet,spellSheetList,type ExamAnswers} from '@/lib/a1-exam-course';
import {clearExamRun,readExamRun,saveExamRun,saveExamScore,type ExamRun,type ExamScoreMap} from '@/lib/a1-exam-progress';
import {examText,type ExamCopyKey} from '@/lib/a1-exam-copy';
import {useAnswerSound} from './study-shared';
import {GuestLock,GuestMore} from './guest-taste';
import {HEAD,Hint,Paper} from './a1-exam-paper';
import {ChoiceItem} from './a1-exam-hoeren-paper';
import {useExamAudio} from './a1-exam-audio';

/**
 * A1 sınavı · Buchstabieren (the learner asked, 10 November 2026): a listening practice beside the ten exams for the
 * item "Wie buchstabiert man den Namen?" of Hören Teil 1 — a short talk in which a name is said letter by letter and
 * three name cards that differ in one spot. Three sheets of ten names (lib/a1-exam-spell.ts), opened with
 * `?sinav=<1–3>&bolum=buchstabieren`. A sheet works like a Hören paper: a start page, the sheet (every answer a tap,
 * each talk heard twice in the exam-like mode, nothing marked before the end), then the result with the spoken text
 * and the letters' German names. The exams and their questions are not touched; a sheet's result is kept like a
 * paper's (lib/a1-exam-progress.ts) but does not count in the section's progress.
 */
export const spellHref=(number:number)=>A1_EXAM_PATH+'?sinav='+number+'&bolum='+SPELL_MODULE;
const QUESTION='Wie buchstabiert man den Namen?';
const TIP:Record<SpellTip,ExamCopyKey>={double:'spellTipDouble',count:'spellTipCount',umlaut:'spellTipUmlaut'};
const cards=(item:SpellExample):readonly ListenOption[]=>item.names.map(text=>({text}));
/** The explanation of a name in the page's language: the letters that were said, the names of the letters to listen for, a tip. */
function explain(language:string,item:SpellExample){
 const parts=[examText(language,'spellWhy',{spelled:item.spelled})];
 if(item.focus.length)parts.push(examText(language,'spellLetters',{pairs:item.focus.map(pair=>'*'+pair+'*').join(', ')}));
 if(item.tip)parts.push(examText(language,TIP[item.tip]));
 return {text:parts.join(' '),lang:language};
}

/** The practice on the section page: what it is and its three sheets. */
export function SpellPanel({language,guest,scores,marks,onOpen}:{language:StudyLanguage;guest:boolean;scores:ExamScoreMap;marks:Record<string,number>;onOpen:(number:number)=>void}){
 return <section className="panel x1-spell" aria-labelledby="x1-spell-heading" data-x1-spell-panel>
  <div className="x1-spell-head"><span className="x1-spell-icon" aria-hidden="true"><SpellCheck size={24}/></span>
   <div><h2 id="x1-spell-heading">{examText(language,'spellTitle')}</h2><p>{examText(language,'spellLead')}</p></div></div>
  <ul className="x1-papers x1-spell-list">{spellSheetList.map(sheet=>{const locked=guest&&sheet.number!==GUEST_EXAM;const score=scores[sheet.id];const half=marks[sheet.id];const good=score?hasPassed(score.right,score.total):false;
   return <li key={sheet.id} className={'x1-paper-row'+(score?good?' passed':' tried':'')} data-x1-sheet={sheet.id}>
    <span className="x1-paper-name"><Headphones size={18} aria-hidden="true"/><strong>{examText(language,'spellSheet',{n:sheet.number})}</strong>{score&&<span className={'x1-badge '+(good?'ok':'no')}>{score.right}/{score.total}</span>}</span>
    <span className="x1-card-topics" lang="de" dir="ltr">{sheet.topics}</span>
    <span className="x1-card-state">{score?examText(language,'best',{right:score.right,total:score.total}):half!==undefined?examText(language,'inProgress',{n:half,total:SPELL_TOTAL}):examText(language,'spellNames',{n:SPELL_TOTAL})}</span>
    {locked?<GuestLock language={language} back={spellHref(sheet.number)}/>
     :<a className={'btn small x1-open-sheet'+(score&&half===undefined?' secondary':'')} href={spellHref(sheet.number)} onClick={event=>{event.preventDefault();onOpen(sheet.number);}}>{examText(language,half!==undefined?'resume':score?'review':'open')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></a>}
   </li>;})}</ul>
 </section>;
}

type Phase='intro'|'paper'|'result';
const freshRun=(strict:boolean):ExamRun=>({answers:{},seconds:0,teil:1,timed:strict,done:false});

/** One sheet: start page → the sheet → result with every name explained. */
export function SpellView({number,language,guest,onHome,onSheet,onRunning}:{number:number;language:StudyLanguage;guest:boolean;onHome:()=>void;onSheet:(number:number)=>void;onRunning:(value:boolean)=>void}){
 const meta=spellSheetList[number-1];const locked=guest&&number!==GUEST_EXAM;const total=SPELL_TOTAL;
 const [sheet,setSheet]=useState<SpellSheet|null>(null);
 const [run,setRun]=useState<ExamRun|null>(null);const [phase,setPhase]=useState<Phase>('intro');
 const [strict,setStrict]=useState(true);const [ask,setAsk]=useState(false);
 const sound=useAnswerSound();const audio=useExamAudio();const latest=useRef({sound,audio});latest.current={sound,audio};
 useEffect(()=>{if(locked)return;let alive=true;loadSpellSheet(number).then(next=>{if(alive)setSheet(next);}).catch(()=>{});return()=>{alive=false;};},[number,locked]);
 // A member's saved run: a finished sheet opens on its result, a half-done one on the start page with "Devam et".
 useEffect(()=>{
  if(guest)return;
  try{const saved=readExamRun(localStorage,meta.id);if(saved){setRun(saved);setStrict(saved.timed);if(saved.done)setPhase('result');}}catch{}
 },[guest,meta.id]);
 useEffect(()=>{onRunning(phase==='paper');return()=>onRunning(false);},[phase,onRunning]);
 const keep=useCallback((next:ExamRun)=>{if(!guest)saveExamRun(localStorage,meta.id,next);},[guest,meta.id]);
 const toTop=()=>requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-heading')?.focus({preventScroll:true});});
 const toSheet=()=>requestAnimationFrame(()=>{const head=document.getElementById('x1-exam-top');if(head)head.scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});document.getElementById('x1-teil-heading')?.focus({preventScroll:true});});
 const start=(resume:boolean)=>{
  latest.current.sound.prepare();
  const next=resume&&run&&!run.done?{...run,timed:strict}:freshRun(strict);
  setRun(next);keep(next);setAsk(false);setPhase('paper');toSheet();
 };
 const mark=useCallback((id:string,value:ExamAnswer)=>{
  setRun(current=>{if(!current||current.done)return current;const answers:ExamAnswers={...current.answers};if(answers[id]===value)delete answers[id];else answers[id]=value;const next={...current,answers};keep(next);return next;});setAsk(false);
 },[keep]);
 /** A talk was started: counted for the two hearings (the review does not count). */
 const played=useCallback((key:string)=>{
  setRun(current=>{if(!current||current.done)return current;const next={...current,plays:{...current.plays,[key]:(current.plays?.[key]??0)+1}};keep(next);return next;});
 },[keep]);
 const items=useMemo(()=>sheet?sheet.items.map(item=>({teil:1 as const,item})):[],[sheet]);
 const result=useMemo(()=>sheet&&run?gradeItems(items,run.answers):null,[sheet,run,items]);
 const finish=()=>{
  if(!sheet||!run||!result)return;
  latest.current.audio.stop();
  const done={...run,done:true};setRun(done);keep(done);
  if(!guest)try{saveExamScore(localStorage,meta.id,result.right,result.total,0);}catch{}
  setAsk(false);setPhase('result');latest.current.sound.complete();toTop();
 };
 const again=()=>{latest.current.audio.stop();if(!guest)clearExamRun(localStorage,meta.id);setRun(null);setAsk(false);setPhase('intro');toTop();};
 const title=examText(language,'spellSheet',{n:number});const part=<span lang="de" dir="ltr">Buchstabieren</span>;
 const backLink=<a className="x1-back" href={A1_EXAM_PATH} onClick={event=>{event.preventDefault();latest.current.audio.stop();onHome();}}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{examText(language,'toExams')}</a>;
 if(locked)return <div className="x1-exam">{backLink}<h1 id="x1-heading" tabIndex={-1} className="x1-exam-title">{part} · {title}</h1><GuestMore language={language} back={spellHref(number)}/></div>;
 if(!sheet)return <div className="x1-exam">{backLink}<p className="course-loading" role="status">{examText(language,'loading')}</p></div>;
 const marked=run?Object.keys(run.answers).length:0;
 /** The sheet on the paper; `review` after it is finished. */
 const paper=(answers:ExamAnswers,review:boolean)=>{
  const listen={answers,onMark:review?undefined:mark,review,language,audio,plays:run?.plays??{},limit:!!run?.timed,onPlay:review?()=>{}:played};
  return <Paper minutes={0} module="spell"><section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="1" data-x1-spell={number}>
   {HEAD(1,'Hören: Buchstabieren '+number)}
   <p className="x1-task">Wie buchstabiert man den Namen? Markieren Sie: <span className="x1-letter inline">a</span>, <span className="x1-letter inline">b</span> oder <span className="x1-letter inline">c</span>.<br/>Sie hören jeden Text <b>zweimal</b>.</p>
   <Hint language={language} text={examText(language,'spellHint')}/>
   <ChoiceItem n={0} playKey={meta.id+'-b1'} question={QUESTION} options={cards(sheet.example)} answer={sheet.example.answer} lines={sheet.example.lines} example cards max={2} {...listen}/>
   {sheet.items.map(item=><ChoiceItem key={item.id} n={item.n} id={item.id} playKey={item.id} question={QUESTION} options={cards(item)} answer={item.answer} lines={item.lines} explained={explain(language,item)} cards max={2} {...listen}/>)}
  </section></Paper>;
 };
 const voiceNote=audio.voices==='unavailable'?<p className="x1-voice-note" role="status">{examText(language,'voiceNote')}</p>:null;

 if(phase==='intro'){const half=!!run&&!run.done&&marked>0;
  return <div className="x1-exam" data-x1-phase="intro" data-x1-part={SPELL_MODULE}>{backLink}
   <section className="panel x1-cover" aria-labelledby="x1-heading">
    <p className="eyebrow" lang="de" dir="ltr">A1 · Hören · Buchstabieren</p>
    <h1 id="x1-heading" tabIndex={-1} className="x1-exam-title">{title}</h1>
    <p className="x1-cover-topics" lang="de" dir="ltr">{meta.topics}</p>
    <p className="x1-cover-facts"><span><ListChecks size={17} aria-hidden="true"/>{examText(language,'spellNames',{n:total})}</span><span dir="ltr"><Headphones size={17} aria-hidden="true"/>2 ×</span></p>
    <h2 className="x1-rules-title">{examText(language,'rulesTitle')}</h2>
    <ul className="x1-rules">{(['spellRule1','spellRule2','rule3','hoerenRule4'] as const).map(key=><li key={key}>{examText(language,key)}</li>)}</ul>
    <details className="x1-tips" open><summary>{examText(language,'spellTipsTitle')}</summary><ol>{(['spellTip1','spellTip2','spellTip3'] as const).map(key=><li key={key}><Starred text={examText(language,key)}/></li>)}</ol></details>
    <div className="x1-timer-choice" role="radiogroup" aria-label={examText(language,'listenMode')}>
     <button type="button" role="radio" aria-checked={strict} className={strict?'on':''} onClick={()=>setStrict(true)}><Headphones size={17} aria-hidden="true"/>{examText(language,'listenStrict')}</button>
     <button type="button" role="radio" aria-checked={!strict} className={!strict?'on':''} onClick={()=>setStrict(false)}>{examText(language,'listenFree')}</button>
    </div>
    {half&&<p className="x1-half" role="status">{examText(language,'inProgress',{n:marked,total})}</p>}
    <div className="x1-cover-actions">
     {half&&<button type="button" className="btn" data-x1-resume onClick={()=>start(true)}>{examText(language,'resume')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>}
     <button type="button" className={'btn'+(half?' secondary':'')} data-x1-start onClick={()=>start(false)}>{half?<RotateCcw size={18} aria-hidden="true"/>:null}{examText(language,half?'again':'spellStart')}{!half&&<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/>}</button>
    </div>
    <p className="x1-note">{examText(language,guest?'guestNote':'saved')}</p>
   </section>
  </div>;
 }

 if(phase==='paper'&&run){
  return <div className="x1-exam" data-x1-phase="paper" data-x1-part={SPELL_MODULE}>
   <div className="x1-bar" id="x1-exam-top">
    <h1 id="x1-heading" tabIndex={-1} className="x1-bar-title">{part} · {title}</h1>
    <div className="x1-bar-tools"><span className="x1-marked" data-x1-marked={marked}><ListChecks size={16} aria-hidden="true"/>{examText(language,'marked',{n:marked,total})}</span></div>
   </div>
   {voiceNote}
   {paper(run.answers,false)}
   {ask&&result&&<div className="x1-ask" role="alertdialog" aria-labelledby="x1-ask-text" data-x1-ask>
    <p id="x1-ask-text">{examText(language,'openLeft',{n:result.open.length})}</p>
    <div className="x1-ask-actions"><button type="button" className="btn secondary" onClick={()=>setAsk(false)}>{examText(language,'keepSolving')}</button><button type="button" className="btn" data-x1-finish-anyway onClick={finish}>{examText(language,'finishAnyway')}</button></div>
   </div>}
   <nav className="x1-pager x1-pager-one" aria-label={title}>
    <button type="button" className="btn x1-finish" data-x1-finish onClick={()=>{if(result&&result.open.length&&!ask){setAsk(true);requestAnimationFrame(()=>document.querySelector('[data-x1-ask]')?.scrollIntoView({block:'center'}));}else finish();}}><Flag size={18} aria-hidden="true"/>{examText(language,'spellFinish')}</button>
   </nav>
   <p className="x1-note">{examText(language,guest?'guestNote':'saved')}</p>
  </div>;
 }

 // The result: how many names were right, then the whole sheet with the spoken texts and the letters' names.
 const shown=run??freshRun(true);const outcome=result??gradeItems(items,{});const good=hasPassed(outcome.right,outcome.total);
 const next=number<SPELL_SHEET_COUNT&&!(guest&&number+1!==GUEST_EXAM)?number+1:null;
 return <div className="x1-exam" data-x1-phase="result" data-x1-part={SPELL_MODULE}>{backLink}
  <section className={'panel x1-result '+(good?'ok':'no')} aria-labelledby="x1-heading" data-x1-result={outcome.right}>
   <p className="eyebrow">{part} · {title}</p>
   <h1 id="x1-heading" tabIndex={-1} className="x1-result-title">{examText(language,'resultTitle')}</h1>
   <p className="x1-score"><strong dir="ltr">{outcome.right} / {outcome.total}</strong></p>
   <div className="x1-scale" aria-hidden="true"><i style={{width:(outcome.right/outcome.total*100)+'%'}}/></div>
   <p className="x1-result-text">{examText(language,'spellResult',{right:outcome.right,total:outcome.total})}</p>
   <div className="x1-cover-actions">
    <button type="button" className="btn secondary" data-x1-again onClick={again}><RotateCcw size={18} aria-hidden="true"/>{examText(language,'again')}</button>
    {next&&<a className="btn" data-x1-next-paper href={spellHref(next)} onClick={event=>{event.preventDefault();latest.current.audio.stop();onSheet(next);}}>{examText(language,'spellNext')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></a>}
   </div>
   {guest&&<GuestMore language={language} back={spellHref(number)}/>}
  </section>
  <h2 className="x1-review-title" id="x1-review">{examText(language,'reviewTitle')}</h2>
  {voiceNote}
  {paper(shown.answers,true)}
  <div className="x1-cover-actions x1-end">{backLink}<button type="button" className="btn secondary" onClick={again}><RotateCcw size={18} aria-hidden="true"/>{examText(language,'again')}</button></div>
 </div>;
}
/** A site-language text with `*German words*`. */
function Starred({text}:{text:string}){const parts=text.split(/(\*[^*]+\*)/g);return <>{parts.map((part,i)=>part.length>2&&part.startsWith('*')&&part.endsWith('*')?<bdi key={i} className="x1-quote" lang="de" dir="ltr">{part.slice(1,-1)}</bdi>:part)}</>;}
