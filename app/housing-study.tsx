'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,House,Loader2,RotateCcw,Volume2,X} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {housingSections,housingRules,housingQuestionMap,housingPool,housingMeaning,pickHousingQuestions,type HousingSection} from '@/lib/housing-course';
import {housingText,type HousingCopyKey} from '@/lib/housing-copy';
import {gradeAnswer} from '@/lib/course';
import {studyLanguages,isStudyLanguage,translate,type StudyLanguage} from '@/lib/study-languages';
import {vaultText,type VaultCopyKey} from '@/lib/object-vault-copy';
import type {Session,Snapshot,Answer} from '@/lib/study';
import {api,useGermanSpeech,useAnswerFeedback} from './study-shared';
import {LetterPuzzle} from './letter-puzzle';
import {TopicArt,RasterArt} from './toon-art';
import {housingIllustration,housingSceneArt,housingSectionScene} from '@/lib/housing-illustrations';
import {PracticeModes} from './practice-modes';
import {SiteLogo} from './site-logo';
import {SiteFooter} from './site-footer';
import {EffectsSettingsButton} from './learning-effects';
import {HousingLessonNotes} from './housing-lesson';
import {lessonCopy} from '@/lib/housing-lessons';

const blank:Snapshot={reviews:[],notes:{},sessions:[]};
export default function HousingStudy(){
 const [language,setLanguage]=useState<StudyLanguage>('tr');const [loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem('german-study-language');if(saved&&isStudyLanguage(saved))setLanguage(saved);}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';document.title=housingText(language,'title')+' · '+SITE_NAME;try{localStorage.setItem('german-study-language',language);}catch{}},[language,loaded]);
 return <HousingWorkshop language={language} onLanguage={setLanguage}/>;
}
export function HousingWorkshop({language,onLanguage}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void}){
 const h=(key:HousingCopyKey,params?:Record<string,string|number>)=>housingText(language,key,params);
 const v=(key:VaultCopyKey,params?:Record<string,string|number>)=>vaultText(language,key,params);
 const [snapshot,setSnapshot]=useState<Snapshot>(blank);const [ready,setReady]=useState(false);const [busy,setBusy]=useState(false);
 const [error,setError]=useState<'error'|'empty'|'invalid'|null>(null);const [signIn,setSignIn]=useState(false);
 const [view,setView]=useState<'categories'|'lesson'|'configure'>('categories');const [section,setSection]=useState<HousingSection|'all'>('a');const [lessonSection,setLessonSection]=useState<HousingSection>('a');const [step,setStep]=useState(0);
 const [mode,setMode]=useState<'write'|'test'>('write');const [count,setCount]=useState<number|'all'>(10);const [format,setFormat]=useState<'clue'|'free'>('clue');
 const [session,setSession]=useState<Session|null>(null);const [index,setIndex]=useState(0);const [feedback,setFeedback]=useState<Answer|null>(null);
 const [selected,setSelected]=useState('');const [freeText,setFreeText]=useState('');const [requestedResume,setRequestedResume]=useState<string|null>(null);
 const mounted=useRef(true);const mutation=useRef(false);
 const pendingStart=useRef<{key:string;id:string;ids:string[];topic:string;reviewOnly:boolean;onlyIds?:string[]}|null>(null);
 const pendingAnswer=useRef<{questionId:string;answer:string}|null>(null);
 const speech=useGermanSpeech('de');const answerAudio=useAnswerFeedback(speech);const cueBusy=answerAudio.busy;
 const q=session?.questions[index]?housingQuestionMap.get(session.questions[index].id):undefined;
 const finished=!!session&&index>=session.questions.length;
 const info=housingSections.find(item=>item.id===section);
 const name=info?info.id.toUpperCase()+' · '+translate(info.title,language):h('all');
 const available=housingPool(section,mode,step).length;
 const relevantIds=new Set(housingPool(section,mode,step).map(item=>item.id));
 const mistakes=snapshot.reviews.filter(row=>relevantIds.has(row.question_id)&&row.wrong_count>0&&row.streak<3);
 const saved=snapshot.sessions.find(item=>(item.topic==='book-11'||housingSections.some(s=>s.topic===item.topic))&&(item.mode==='write'||item.mode==='test')&&!item.finished_at);
 const resumeId=requestedResume??saved?.id;
 const draftKey=session&&q?'lernkoko-housing-free:'+session.id+':'+q.id:'';
 function stop(){answerAudio.stop();}
 function focus(id='housing-heading'){requestAnimationFrame(()=>{document.getElementById(id)?.focus();window.scrollTo({top:0,behavior:'instant'});});}
 function fail(reason:unknown){if(!mounted.current)return;setError('error');setSignIn(!!(reason as {signIn?:boolean})?.signIn);}
 async function refresh(){try{const next=await api();if(mounted.current){setSnapshot(next);setReady(true);setSignIn(false);}return next;}catch(reason){if(mounted.current)setReady(false);fail(reason);}}
 useEffect(()=>{mounted.current=true;setRequestedResume(new URLSearchParams(window.location.search).get('session'));void refresh();return()=>{mounted.current=false;};},[]);
 useEffect(()=>{stop();},[language]);
 useEffect(()=>{try{setFreeText(draftKey?localStorage.getItem(draftKey)??'':'');}catch{setFreeText('');}},[draftKey]);
 function overview(){if(mutation.current)return;stop();setSession(null);setFeedback(null);setSelected('');pendingAnswer.current=null;setView('categories');setError(null);setRequestedResume(null);void refresh();focus();}
 function choose(value:HousingSection|'all',initialStep=0){if(mutation.current)return;stop();setSection(value);setLessonSection(value==='all'?'a':value);setStep(initialStep);setMode('write');setView('lesson');setError(null);pendingStart.current=null;focus();}
 function afterLesson(){stop();const at=housingSections.findIndex(item=>item.id===lessonSection);if(section==='all'&&at<housingSections.length-1)setLessonSection(housingSections[at+1].id);else setView('configure');focus();}
 async function start(reviewOnly=false,onlyIds?:string[]){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stop();
  const key=JSON.stringify([section,step,mode,count,reviewOnly,onlyIds??null]);
  if(pendingStart.current?.key!==key){const picked=pickHousingQuestions(section,mode,count,snapshot.reviews,step,reviewOnly,onlyIds);pendingStart.current={key,id:crypto.randomUUID(),ids:picked.map(item=>item.id),topic:info?.topic??'book-11',reviewOnly,onlyIds};}
  const request=pendingStart.current;
  if(!request.ids.length){setError('empty');mutation.current=false;setBusy(false);return;}
  try{const data=await api<{session:Session}>({action:'start',course:'de',id:request.id,mode,topic:request.topic,count:request.ids.length,onlyIds:request.ids});if(!mounted.current)return;setSession(data.session);setIndex(data.session.answers.length);setFeedback(null);setSelected('');pendingAnswer.current=null;pendingStart.current=null;setRequestedResume(null);focus();}
  catch(reason){fail(reason);}finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 async function resume(id:string){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stop();
  try{const {session:next}=await api<{session:Session}>(undefined,'?session='+encodeURIComponent(id));
   if(!next.questions.length||!next.questions.every(item=>housingQuestionMap.has(item.id))||!['test','write'].includes(next.mode)){setError('invalid');return;}
   if(!mounted.current)return;setSession(next);setIndex(next.answers.length);setMode(next.mode as 'test'|'write');setSection(housingSections.find(item=>item.topic===next.topic)?.id??'all');setStep(0);setFeedback(null);setSelected('');pendingAnswer.current=null;pendingStart.current=null;focus();
  }catch(reason){fail(reason);}finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 async function submit(answer:string){
  if(!session||!q||feedback||mutation.current||!answer.trim()||answerAudio.isWaiting()||speech.isActive())return;
  if(pendingAnswer.current&&pendingAnswer.current.answer!==answer)return;
  mutation.current=true;setBusy(true);setError(null);setSelected(answer);
  if(!pendingAnswer.current){pendingAnswer.current={questionId:q.id,answer};
   answerAudio.answer(gradeAnswer(q,answer),q.answer);}
  try{const data=await api<{result:Answer}>({action:'answer',sessionId:session.id,questionId:q.id,answer});if(!mounted.current)return;
   setFeedback(data.result);setSession(previous=>previous?{...previous,answers:[...previous.answers.filter(a=>a.question_id!==q.id),data.result]}:previous);pendingAnswer.current=null;
   try{localStorage.removeItem(draftKey);}catch{}requestAnimationFrame(()=>document.getElementById('housing-feedback')?.focus());
  }catch(reason){fail(reason);}finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 function next(){if(!feedback||busy)return;stop();setIndex(value=>value+1);setFeedback(null);setSelected('');pendingAnswer.current=null;focus();if(session&&index+1>=session.questions.length)answerAudio.complete();}
 const actionDisabled=busy||cueBusy||speech.busy;
 const modeLabels={test:v('testPractice'),write:v('writePractice'),testDetail:v('testDetail'),writeDetail:v('puzzleHint')};
 return <div className="category-app toon-app housing-app" lang={language} dir={language==='ar'?'rtl':'ltr'}>
  <a className="skip-link" href="#housing-main">{v('home')}</a>
  <header className="work-header logo-header"><a className="work-brand site-logo-brand" href="/?learn=de" aria-label={SITE_NAME+' · '+v('home')}><SiteLogo/></a><label className="language-picker">{v('language')}<select value={language} onChange={event=>{if(isStudyLanguage(event.target.value))onLanguage(event.target.value);}}>{studyLanguages.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label><a className="object-back" href="/?learn=de&level=A1.2"><House size={18}/>{h('back')}</a><EffectsSettingsButton language={language}/></header>
  <main id="housing-main" className="object-page housing-page">
   <div className="object-breadcrumb"><a href="/?learn=de&level=A1.2">A1.2</a><span aria-hidden="true">›</span><span>{h('title')}</span></div>
   {error&&<div className="object-alert" role="alert"><p>{signIn?v('signInError'):h(error)}</p>{signIn?<a href="/auth/login" className="btn">{v('signIn')}</a>:<button type="button" className="btn secondary small" disabled={busy} onClick={()=>{if(pendingAnswer.current)void submit(pendingAnswer.current.answer);else if(pendingStart.current)void start(pendingStart.current.reviewOnly,pendingStart.current.onlyIds);else void refresh();}}>{v('retry')}</button>}</div>}
   {speech.warning&&<p className="object-alert" role="status">{language==='tr'?speech.warning:v('audioWarning')}</p>}
   {session?finished?<section className="object-results panel"><h1 id="housing-heading" tabIndex={-1}>{h('completed')}</h1><p className="vault-result-score">{v('resultScore',{correct:session.answers.filter(a=>a.correct).length,total:session.questions.length})}</p><div className="object-actions"><button type="button" className="btn" disabled={busy||!session.answers.some(a=>!a.correct)} onClick={()=>void start(false,session.answers.filter(a=>!a.correct).map(a=>a.question_id))}><RotateCcw size={18}/>{v('reviewRoundMistakes')}</button><button type="button" className="btn secondary" onClick={overview}>{v('categories')}</button></div>{session.answers.filter(a=>!a.correct).map(answer=>{const item=housingQuestionMap.get(answer.question_id);return item?<article className="housing-result" key={answer.id}><p lang="de" dir="ltr"><strong>{item.resultDe}</strong></p><p>{housingMeaning(item,language)}</p><p><small>{v('yourAnswer')}: <span lang="de" dir="ltr">{answer.answer}</span></small></p></article>:null;})}</section>:q?<section className="object-practice housing-practice">
    <div className="object-practice-top"><span className="object-pill">{q.section.toUpperCase()} · {v(session.mode==='write'?'writePractice':'testPractice')}</span><span>{h('progress',{n:index+1,total:session.questions.length})}</span><button type="button" className="object-exit" aria-label={v('exitTest')} disabled={busy} onClick={overview}><X size={20}/></button></div>
    <progress max={session.questions.length} value={index} aria-label={h('progress',{n:index+1,total:session.questions.length})}/>
    <article className="object-question panel">
     <h1 id="housing-heading" tabIndex={-1}>{session.mode==='test'?v('testDetail'):h(q.gap?'gap':q.writingTask==='word'?'word':'sentence')}</h1>
     {q.passage&&<div className="housing-reading"><h2>{h('reading')}</h2><p lang="de" dir="ltr">{q.passage}</p>{language!=='de'&&q.passageMeaning&&<details><summary>{h('meaning')}</summary><p>{translate(q.passageMeaning,language)}</p></details>}<button className="btn secondary small" disabled={actionDisabled||!!feedback} onClick={()=>speech.speak(q.passage!)}><Volume2 size={18}/>{v('repeatAudio')}</button></div>}
     <div className="housing-question-art"><RasterArt art={housingIllustration(q)} title={v('questionImage')}/></div>
     <p className="housing-cue">{language==='de'?q.cueDe:translate(q.meaning,language)}</p>
     {q.gap&&<p className="vault-gap-sentence" lang="de" dir="ltr">{q.gap}</p>}
     {q.wordBank&&(format==='clue'||language==='de')&&session.mode==='write'&&<div className="housing-word-bank"><small>{h('wordBank')}</small><p lang="de" dir="ltr">{q.wordBank.join(' · ')}</p></div>}
     {session.mode==='write'?<><div className="housing-format" role="group" aria-label={v('writePractice')}>{(['clue','free'] as const).map(item=><button type="button" key={item} className={format===item?'active':''} aria-pressed={format===item} disabled={!!feedback||!!pendingAnswer.current||actionDisabled} onClick={()=>{setFormat(item);setSelected('');}}>{h(item)}</button>)}</div>
      {format==='clue'?<LetterPuzzle key={session.id+':'+q.id} course="de" answer={q.answer} storageKey={'lernkoko-housing-puzzle:'+session.id+':'+q.id} language={language} onChange={setSelected} onSubmit={answer=>void submit(answer)} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined}/>:<form className="vault-writing-form" onSubmit={event=>{event.preventDefault();void submit(freeText);}}><p className="writing-help">{h('freeHelp')}</p><label className="field-label" htmlFor="housing-written-answer">{v('yourAnswer')}</label><textarea id="housing-written-answer" className="writing-input" rows={q.gap?2:3} lang="de" dir="ltr" value={freeText} readOnly={!!feedback||!!pendingAnswer.current} disabled={actionDisabled} autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} maxLength={1500} onChange={event=>{setFreeText(event.target.value);try{localStorage.setItem(draftKey,event.target.value);}catch{}}}/><div className="umlaut-row" dir="ltr">{['ä','ö','ü','ß'].map(letter=><button type="button" key={letter} disabled={actionDisabled||!!feedback||!!pendingAnswer.current} onClick={()=>{const value=freeText+letter;setFreeText(value);try{localStorage.setItem(draftKey,value);}catch{}}}>{letter}</button>)}</div>{!feedback&&<button type="submit" className="btn check-button" disabled={!freeText.trim()||actionDisabled||!!pendingAnswer.current}>{v('checkAnswer')}</button>}</form>}
     </>:<div className="object-options picture-word-options">{(session.questions[index].options??q.options??[]).map((option,i)=><button type="button" key={option} className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')} disabled={!!feedback||!!pendingAnswer.current||actionDisabled} onClick={()=>void submit(option)}><span className="object-option-number">{String.fromCharCode(65+i)}</span><span lang="de" dir="ltr">{option}</span></button>)}</div>}
     {busy&&!feedback&&<p className="picture-quiz-saving" role="status"><Loader2 size={16} className="spinner"/>{v('savingAnswer')}</p>}
     {feedback&&<div id="housing-feedback" tabIndex={-1} className={'object-feedback '+(feedback.correct?'success':'retry')} role="status" aria-live="polite"><h2>{feedback.correct?<CheckCircle2 size={23}/>:<X size={23}/>} {v(feedback.correct?'correct':'wrongAnswer')}</h2><p>{v('correctAnswer')}: <strong lang="de" dir="ltr">{q.answer}</strong></p>{q.resultDe!==q.answer&&<p lang="de" dir="ltr"><strong>{q.resultDe}</strong></p>}<p className="housing-translation">{housingMeaning(q,language)}</p>{!feedback.correct&&<p>{v('yourAnswer')}: <span lang="de" dir="ltr">{feedback.answer}</span></p>}<div className="object-actions"><button type="button" className="btn secondary small" disabled={busy||cueBusy} onClick={()=>speech.speak(q.answer)}><Volume2 size={18}/>{v('repeatAudio')}</button><button type="button" className="btn" disabled={busy} onClick={next}>{v(index+1===session.questions.length?'viewResults':'nextQuestion')}<ArrowRight size={18}/></button></div></div>}
    </article>
   </section>:<p role="alert">{h('invalid')} <button className="text-button" onClick={overview}>{v('categories')}</button></p>:view==='lesson'?<HousingLessonNotes section={lessonSection} language={language} onBack={overview} onContinue={afterLesson} onSpeak={text=>speech.speak(text)} speaking={speech.busy} hasNext={section==='all'&&lessonSection!=='d'}/>:view==='configure'?<section className="vault-config panel">
    <button type="button" className="text-button vault-back-categories" onClick={overview}><ArrowLeft size={18}/>{v('backCategories')}</button><div className="housing-config-heading"><div><span className="eyebrow">A1.2 · 11</span><h1 id="housing-heading" tabIndex={-1}>{name}</h1>{info&&<p lang="de" dir="ltr">{info.de}</p>}<p>{h('exercises',{n:available})}</p></div>{info&&<div className="housing-config-art"><RasterArt art={housingSceneArt[housingSectionScene[info.id]]} title={translate(info.title,language)}/></div>}</div>
    <button type="button" className="text-button housing-return-lesson" onClick={()=>{stop();setView('lesson');focus();}}>{translate(lessonCopy.backLesson,language)}</button>
    <PracticeModes labels={modeLabels} active={mode} counts={{test:housingPool(section,'test',step).length,write:housingPool(section,'write',step).length}} disabled={busy} onChoose={value=>{if(value==='listen')return;stop();setMode(value);pendingStart.current=null;}}/>
    <div className="object-controls">{info&&<label>{h('steps')}<select value={step} onChange={event=>{stop();setStep(Number(event.target.value));setMode('write');pendingStart.current=null;}}><option value={0}>{h('allSteps')}</option>{info.steps.map((label,i)=><option key={label} value={i+1}>{info.id.toUpperCase()}{i+1} · {label}</option>)}</select></label>}<label>{h('length')}<select value={count} onChange={event=>{setCount(event.target.value==='all'?'all':Number(event.target.value));pendingStart.current=null;}}>{[5,10,20].map(size=><option key={size} value={size}>{h('exercises',{n:size})}</option>)}<option value="all">{h('whole',{n:available})}</option></select></label></div><div className="object-actions"><button type="button" className="btn" disabled={busy||!ready||!available} onClick={()=>void start()}>{h('start')}<ArrowRight size={18}/></button><button type="button" className="btn secondary" disabled={busy||!ready||!mistakes.length} onClick={()=>void start(true)}><RotateCcw size={18}/>{v('reviewMistakes')} {mistakes.length||''}</button></div><p className="housing-tip">{h('tip')}</p>
   </section>:<section aria-labelledby="housing-heading">
    <div className="toon-hero housing-hero"><div><span className="eyebrow">A1.2 · 11 · Wohnen</span><h1 id="housing-heading" tabIndex={-1}>{h('title')}</h1></div><div className="toon-hero-art"><TopicArt id="book-11" title={h('title')}/></div></div>
    <div className="housing-feature-grid"><button type="button" className="housing-feature panel" disabled={busy} onClick={()=>choose('all')}><span className="housing-letter">A–D</span><div><h2>{h('all')}</h2><p>{h('exercises',{n:housingPool('all','write').length})}</p></div><ArrowRight size={20}/></button><button type="button" className="housing-feature panel" disabled={busy||!ready||!resumeId} onClick={()=>{if(resumeId)void resume(resumeId);}}><RotateCcw size={24}/><div><h2>{v('resume')}</h2><p>{saved?h('progress',{n:saved.answered,total:saved.total}):!ready?v('loading'):v('noSavedTest')}</p></div><ArrowRight size={20}/></button></div>
    <div className="housing-section-grid">{housingSections.map(item=><article className="housing-card panel" data-housing-section={item.id} key={item.id}><button type="button" className="housing-card-open" disabled={busy} onClick={()=>choose(item.id)}><div className="housing-card-top"><span className="housing-letter">{item.id.toUpperCase()}</span><div className="housing-card-art"><RasterArt art={housingSceneArt[housingSectionScene[item.id]]} title={translate(item.title,language)}/></div></div><h2 lang="de" dir="ltr">{item.de}</h2><p>{translate(item.title,language)}</p></button><button type="button" className="housing-card-bottom" disabled={busy} onClick={()=>choose(item.id)}><span>{h('exercises',{n:housingPool(item.id,'write').length})}</span><ArrowRight size={21}/></button></article>)}</div>
   </section>}
  </main><SiteFooter/>
 </div>;
}
