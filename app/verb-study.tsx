'use client';
import {SITE_NAME} from '@/lib/site-brand';
import {SiteLogo} from './site-logo';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronRight,Headphones,House,Loader2,RotateCcw,Star,Volume2,X} from 'lucide-react';
import {gradeAnswer,questionMap,type Question} from '@/lib/course';
import {verbs,verbMap,verbGroups,verbMeaning,perfektLabel,verbRowSpeech,inVerbTopic,type Verb} from '@/lib/verb-course';
import {isVerbMistake,isVerbSolved,pickVerbRound,verbModePredicate,verbPool,verbPracticeMode,verbSessionMode} from '@/lib/verb-practice';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {starNoteKey,starredQuestionIds,type Answer,type Session,type Snapshot} from '@/lib/study';
import {api,useGermanSpeech,useAnswerFeedback} from './study-shared';
import {vaultLanguages,isVaultLanguage,vaultDirection,vaultText,type VaultLanguage,type VaultCopyKey} from '@/lib/object-vault-copy';
import {readVaultLanguage,saveVaultLanguage} from '@/lib/vault-language-preference';
import {PracticeModes} from './practice-modes';
import {LetterPuzzle} from './letter-puzzle';
import type {PracticeMode} from '@/lib/writing-practice';
import {SiteFooter} from './site-footer';
import {EffectsSettingsButton} from './learning-effects';
import {verbProgress} from '@/lib/progress';
import {ProgressMeter,RoundReward} from './progress-ui';

const blank:Snapshot={reviews:[],notes:{},sessions:[]};
const SESSION_MODES=['test','write','listen'];
type ErrorKey=VaultCopyKey|'verbLegacy';
// Answers that are verbs (not forms) are shown as their meaning in these tasks.
const meaningOptionTasks=new Set(['meaning','hear']);
const verbOptionTasks=new Set(['word','hear-praesens','hear-perfekt']);

function groupVerbs(topic:string){return verbs.filter(verb=>inVerbTopic(verb.group,topic));}
function VerbChips({topic}:{topic:string}){
 const list=groupVerbs(topic);const sample=topic==='verbs-all'?list.filter((_,i)=>i%9===0):list.slice(0,4);
 return <div className="verb-chips" aria-hidden="true">{sample.map((verb,i)=><span key={verb.id} className={'verb-chip tone-'+(i%4)} lang="de" dir="ltr">{verb.display}</span>)}</div>;
}
export default function VerbStudy(){
 const [language,setLanguage]=useState<VaultLanguage>('tr');const [ready,setReady]=useState(false);
 useEffect(()=>{try{setLanguage(readVaultLanguage(localStorage));}catch{}setReady(true);},[]);
 useEffect(()=>{if(!ready)return;try{saveVaultLanguage(localStorage,language);}catch{}},[language,ready]);
 return ready?<VerbWorkshop language={language} onLanguage={setLanguage}/>:<div className="course-loading" role="status">{SITE_NAME}…</div>;
}
export function VerbWorkshop({language,onLanguage}:{language:VaultLanguage;onLanguage:(value:VaultLanguage)=>void}){
 const v=(key:VaultCopyKey,params?:Record<string,string|number>)=>vaultText(language,key,params,'de');
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const dir=vaultDirection(language);
 const [snapshot,setSnapshot]=useState<Snapshot>(blank);
 const [ready,setReady]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState<ErrorKey|null>(null);const [signIn,setSignIn]=useState(false);
 const [initializing,setInitializing]=useState(true);
 const [practiceMode,setPracticeMode]=useState<PracticeMode>('test');
 const [view,setView]=useState<'categories'|'configure'>('categories');const [group,setGroup]=useState('verbs-all');
 const [requestedResume,setRequestedResume]=useState<string|null>(null);
 const [session,setSession]=useState<Session|null>(null);const [index,setIndex]=useState(0);
 const [feedback,setFeedback]=useState<Answer|null>(null);const [selected,setSelected]=useState('');
 const [heardQuestionId,setHeardQuestionId]=useState<string|null>(null);const [starBusy,setStarBusy]=useState(false);
 const [aux,setAux]=useState<''|'hat'|'ist'>('');const [auxWarning,setAuxWarning]=useState(false);
 const speech=useGermanSpeech('de');const answerAudio=useAnswerFeedback(speech);const cueBusy=answerAudio.busy;
 const mutation=useRef(false);const mounted=useRef(true);
 const pendingStart=useRef<{key:string;id:string;ids:string[]}|null>(null);
 const pendingAnswer=useRef<{questionId:string;answer:string}|null>(null);
 const candidate=session?.questions[index]?questionMap.get(session.questions[index].id):undefined;
 const q=verbModePredicate(session?.mode??'test')(candidate)?candidate:undefined;
 const verb=q?.verbId?verbMap.get(q.verbId):undefined;
 const task=q?.verbTask;
 // Only the correct answer is spoken after the effect, never the question.
 const pronunciation=q?.answer??'';
 const finished=!!session&&index>=session.questions.length;
 const latest=snapshot.sessions.find(s=>s.topic.startsWith('verbs-')&&SESSION_MODES.includes(s.mode)&&!s.finished_at);
 const resumeId=requestedResume??latest?.id??snapshot.activeVerbSessionId??null;
 const resumeSummary=snapshot.sessions.find(s=>s.id===resumeId);
 const scopedQuestions=verbPool(practiceMode,group);
 const starred=starredQuestionIds(snapshot.notes);const reviewRows=new Map(snapshot.reviews.map(r=>[r.question_id,r]));
 const marked=scopedQuestions.filter(item=>isVerbMistake(reviewRows.get(item.id))||starred.has(item.id));
 const unsolved=scopedQuestions.filter(item=>!isVerbSolved(reviewRows.get(item.id))).length;
 const groupNumber=(topic:string)=>verbGroups.findIndex(item=>item.id===topic)+1;
 const categoryName=(topic:string)=>topic==='verbs-all'?t('allVerbs'):t('groupTitle',{n:groupNumber(topic)});
 const rangeLabel=(topic:string)=>{const list=groupVerbs(topic);return list[0].display+' – '+list[list.length-1].display;};
 function fail(e:unknown,fallback:ErrorKey){if(!mounted.current)return;const auth=!!(e as {signIn?:boolean})?.signIn;setSignIn(auth);setError(auth?'signInError':fallback);}
 async function refresh(){
  try{const next=await api(undefined,'','de');if(mounted.current){setSnapshot(next);setReady(true);setSignIn(false);}return next;}
  catch(e){if(mounted.current)setReady(false);fail(e,'loadError');}
 }
 useEffect(()=>{
  mounted.current=true;setRequestedResume(new URLSearchParams(window.location.search).get('session'));
  void refresh().finally(()=>{if(mounted.current)setInitializing(false);});
  return()=>{mounted.current=false;};
 },[]);
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=dir;document.title=verbText(language,'verbsTitle')+' · '+SITE_NAME;stopFeedback();},[language]);
 function stopFeedback(){answerAudio.stop();}
 function focus(id='object-question-heading'){requestAnimationFrame(()=>{document.getElementById(id)?.focus();window.scrollTo({top:0,behavior:'instant'});});}
 function clearAnswer(){setFeedback(null);setSelected('');setHeardQuestionId(null);setAux('');setAuxWarning(false);pendingAnswer.current=null;}
 function overview(){if(mutation.current)return;stopFeedback();setSession(null);clearAnswer();setView('categories');setError(null);setRequestedResume(null);void refresh();focus('vault-heading');}
 function chooseCategory(id:string,mode:PracticeMode=practiceMode){if(mutation.current)return;stopFeedback();setGroup(id);setPracticeMode(mode);setView('configure');setError(null);pendingStart.current=null;focus('vault-config-heading');}
 async function start(reviewOnly=false,onlyIds?:string[]){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();
  const key=JSON.stringify([practiceMode,group,reviewOnly,onlyIds??null]);
  if(pendingStart.current?.key!==key){const picked=pickVerbRound(practiceMode,group,snapshot.reviews,reviewOnly,onlyIds,{starred,fresh:!reviewOnly&&!onlyIds});pendingStart.current={key,id:crypto.randomUUID(),ids:picked.map(item=>item.id)};}
  const request=pendingStart.current;
  if(!request.ids.length){setError(reviewOnly?'emptyReview':'emptyQuestions');mutation.current=false;setBusy(false);return;}
  try{
   const data=await api<{session:Session}>({action:'start',id:request.id,mode:verbSessionMode(practiceMode),topic:group,count:request.ids.length,onlyIds:request.ids},'','de');
   if(!mounted.current)return;setSession(data.session);setIndex(data.session.answers.length);clearAnswer();pendingStart.current=null;setRequestedResume(null);focus();
  }catch(e){fail(e,'startError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 async function toggleStar(id:string){
  if(starBusy)return;const key=starNoteKey(id);const value=snapshot.notes[key]==='1'?'':'1';
  setStarBusy(true);setSnapshot(previous=>({...previous,notes:{...previous.notes,[key]:value}}));
  try{await api({action:'note',key,value},'','de');}
  catch(e){if(mounted.current){setSnapshot(previous=>({...previous,notes:{...previous.notes,[key]:value?'':'1'}}));fail(e,'starError');}}
  finally{if(mounted.current)setStarBusy(false);}
 }
 async function resume(id:string){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();
  try{
   const data=await api<{session:Session}>(undefined,'?session='+encodeURIComponent(id),'de');
   const restored=data.session;
   if(!restored.topic.startsWith('verbs-')||!SESSION_MODES.includes(restored.mode)||!restored.questions.every(item=>verbModePredicate(restored.mode)(questionMap.get(item.id)))){setError('verbLegacy');return;}
   if(!mounted.current)return;setPracticeMode(verbPracticeMode(restored.mode));setGroup(restored.topic);setSession(restored);setIndex(restored.answers.length);clearAnswer();focus();
  }catch(e){fail(e,'sessionError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 async function submit(answer:string){
  if(mutation.current||feedback||!session||!q||!answer.trim()||(options.length>0&&!options.includes(answer))||speech.isActive()||(session.mode==='listen'&&heardQuestionId!==q.id))return;
  if(pendingAnswer.current&&pendingAnswer.current.answer!==answer)return;
  mutation.current=true;setBusy(true);setError(null);setSelected(answer);
  if(!pendingAnswer.current){
   pendingAnswer.current={questionId:q.id,answer};
   answerAudio.answer(gradeAnswer(q,answer),pronunciation);
  }
  try{
   const data=await api<{result:Answer}>({action:'answer',sessionId:session.id,questionId:q.id,answer},'','de');
   if(!mounted.current)return;setFeedback(data.result);pendingAnswer.current=null;
   setSession(s=>s?{...s,answers:[...s.answers.filter(a=>a.question_id!==q.id),data.result]}:s);
   requestAnimationFrame(()=>document.getElementById('object-feedback')?.focus());
  }catch(e){fail(e,'saveError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 function next(){if(mutation.current||!session||!feedback)return;stopFeedback();setIndex(i=>i+1);clearAnswer();focus();if(index+1>=session.questions.length){answerAudio.complete();setRequestedResume(null);void refresh();}}
 const options=q?(session?.questions[index]?.options??q.options??[]):[];
 const actionDisabled=busy||cueBusy||speech.busy;
 function hearQuestion(slow=false){if(!q?.audio||busy||cueBusy)return;setHeardQuestionId(q.id);speech.speak(q.audio,slow);}
 /** How an answer option is shown: a meaning in the chosen language, a verb, or a German form. */
 function optionText(question:Question,option:string):{text:string;german:boolean}{
  const target=verbMap.get(option);const task=question.verbTask??'';
  if(target&&meaningOptionTasks.has(task))return {text:verbMeaning(target,language),german:false};
  if(target&&verbOptionTasks.has(task))return {text:target.display,german:true};
  return {text:option,german:true};
 }
 function optionLabel(question:Question,option:string,className='picture-option-word'){
  const label=optionText(question,option);
  return <span className={className+(label.german?'':' verb-option-meaning')} lang={label.german?'de':language} dir={label.german?'ltr':dir}>{label.text}</span>;
 }
 function correctLabel(question:Question,item:Verb){
  const task=question.verbTask??'';
  return task==='praesens'||task==='write-praesens'||task==='perfekt'||task==='write-perfekt'?item.subject+' '+question.answer:item.display;
 }
 function verbForms(item:Verb){
  return <span className="verb-forms"><span className="verb-forms-german" lang="de" dir="ltr"><strong>{item.display}</strong> — {item.subject} {item.praesens} — {item.subject} {perfektLabel(item)}</span><span className="verb-forms-meaning" lang={language} dir={dir}>{verbMeaning(item,language)}</span></span>;
 }
 function heading(question:Question){
  const task=question.verbTask;
  return task==='meaning'?t('promptMeaning'):task==='word'?t('promptWord'):task==='praesens'?t('promptPraesens'):task==='perfekt'?t('promptPerfekt'):task==='write'?t('writeInfinitive'):task==='write-praesens'?t('writePraesens'):task==='write-perfekt'?t('writePerfekt'):task==='hear'?t('listenMeaning'):t('listenVerb');
 }
 function promptCard(question:Question,item:Verb){
  const task=question.verbTask;
  if(task==='word'||task==='write')return <div className="verb-card"><p className="verb-card-main verb-card-meaning-main" lang={language} dir={dir}>{verbMeaning(item,language)}</p></div>;
  const frame=task==='praesens'||task==='write-praesens'?item.subject+' ___':task==='perfekt'||task==='write-perfekt'?item.subject+' ___ ___':'';
  return <div className="verb-card"><p className="verb-card-main" lang="de" dir="ltr">{item.display}</p>{task!=='meaning'&&<p className="verb-card-meaning" lang={language} dir={dir}>{verbMeaning(item,language)}</p>}{frame&&<p className="verb-frame" lang="de" dir="ltr">{frame}</p>}</div>;
 }
 const modeLabels={test:v('testPractice'),write:v('writePractice'),listen:v('listenPractice'),testDetail:t('testDetail'),writeDetail:t('writeDetail'),listenDetail:t('listenDetail')};
 const counts=(topic:string)=>({test:verbPool('test',topic).length,write:verbPool('write',topic).length,listen:verbPool('listen',topic).length});
 const errorText=(key:ErrorKey)=>key==='verbLegacy'?t('legacyError'):v(key);
 function categoryCard(id:string,featured=false){const title=categoryName(id);return <article key={id} className={'vault-category-card vault-mode-card verb-category-card '+(featured?'featured':'')} data-verb-category={id}><button type="button" className="vault-category-open" disabled={busy} onClick={()=>chooseCategory(id)}><div className="vault-category-art verb-category-art"><VerbChips topic={id}/></div><div className="vault-category-label"><h3>{title}</h3><p><span lang="de" dir="ltr">{rangeLabel(id)}</span> · {t('verbsCount',{n:groupVerbs(id).length})}</p>{ready&&<ProgressMeter progress={verbProgress(id,snapshot.reviews)} language={language} label={title} compact/>}<ArrowRight size={19} className="vault-direction-icon"/></div></button><PracticeModes labels={modeLabels} topicLabel={title} compact disabled={busy} onChoose={mode=>chooseCategory(id,mode)}/></article>;}
 const writing=session?.mode==='write';

 return <div className="category-app object-app toon-app picture-quiz-app vault-app verb-app" lang={language} dir={dir}>
  <a className="skip-link" href="#object-main">{v('skipContent')}</a>
  <header className="work-header logo-header"><a className="work-brand site-logo-brand" href="/?learn=de" aria-label={SITE_NAME+' · '+v('home')}><SiteLogo/></a><label className="language-picker picture-vault-language-picker">{v('language')}<select value={language} aria-label={v('language')} onChange={e=>{if(isVaultLanguage(e.target.value)){stopFeedback();onLanguage(e.target.value);}}}>{vaultLanguages.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label><a className="object-back" href="/?learn=de"><House size={17}/>{v('home')}</a><EffectsSettingsButton language={language}/></header>
  <main id="object-main" className="object-page">
   <div className="object-breadcrumb"><a href="/?learn=de">{v('home')}</a><ChevronRight size={14} className="vault-direction-icon"/><span>{t('verbsTitle')}</span></div>
   {error&&<div className="object-alert" role="alert"><p>{errorText(error)}</p>{signIn?<a href="/auth/login" className="btn">{v('signIn')}</a>:pendingAnswer.current?<button type="button" className="btn secondary small" disabled={busy} onClick={()=>void submit(pendingAnswer.current!.answer)}>{v('saveRetry')}</button>:<button type="button" className="btn secondary small" disabled={busy} onClick={()=>{setError(null);void refresh();}}>{v('retry')}</button>}</div>}
   {speech.warning&&<p className="object-alert" role="status">{language==='tr'?speech.warning:v('audioWarning')}</p>}
   {session?finished?<section className="object-results panel">
    <h1 id="object-question-heading" tabIndex={-1}>{v(writing?'puzzlesDone':'resultsTitle')}</h1><p className="vault-result-score">{v('resultScore',{correct:session.answers.filter(a=>a.correct).length,total:session.questions.length})}</p>
    <RoundReward answers={session.answers} progress={ready?verbProgress(group,snapshot.reviews):null} language={language} label={categoryName(group)}/>
    <div className="object-actions"><button type="button" className="btn" disabled={busy||!ready||!session.answers.some(a=>!a.correct)} onClick={()=>void start(false,session.answers.filter(a=>!a.correct).map(a=>a.question_id))}><RotateCcw size={18}/>{v(writing?'reviewPuzzleMistakes':'reviewRoundMistakes')}</button><button type="button" className="btn secondary" disabled={busy} onClick={overview}>{v('categories')}</button></div>
    {session.answers.filter(a=>!a.correct).map(a=>{const item=questionMap.get(a.question_id);const target=item?.verbId?verbMap.get(item.verbId):undefined;return item&&target?<div className="object-result-row verb-result-row" key={a.id}><div>{verbForms(target)}<small>{v(writing?'yourAnswer':'yourChoice')}: {optionLabel(item,a.answer,'verb-result-answer')}</small></div></div>:null;})}
   </section>:q&&verb?<section className="object-practice picture-quiz-practice verb-practice">
    <div className="object-practice-top"><span className="object-pill">{v(writing?'writePractice':session.mode==='listen'?'listenPractice':'testPractice')}</span><span>{v(writing?'puzzleRoundProgress':'progress',{n:index+1,total:session.questions.length})}</span><button type="button" className={'housing-star'+(starred.has(q.id)?' active':'')} aria-pressed={starred.has(q.id)} aria-label={v(starred.has(q.id)?'unstar':'star')} title={v(starred.has(q.id)?'unstar':'star')} disabled={starBusy} onClick={()=>void toggleStar(q.id)}><Star size={20} fill={starred.has(q.id)?'currentColor':'none'}/></button><button type="button" className="object-exit" disabled={busy} onClick={overview} aria-label={v('exitTest')}><X size={20}/></button></div>
    <progress max={session.questions.length} value={index} aria-label={v(writing?'puzzleRoundProgress':'progress',{n:index+1,total:session.questions.length})}/>
    <article className="object-question panel verb-question">
     <h1 id="object-question-heading" tabIndex={-1}>{heading(q)}</h1>
     {session.mode!=='listen'&&promptCard(q,verb)}
     {session.mode==='listen'&&<div className="vault-listen-player"><Headphones size={32} aria-hidden="true"/><div className="vault-listen-buttons"><button type="button" className="btn" disabled={actionDisabled} onClick={()=>hearQuestion()}><Volume2 size={20}/>{heardQuestionId===q.id?v('repeatAudio'):t('listenButton')}</button><button type="button" className="btn secondary" disabled={actionDisabled} onClick={()=>hearQuestion(true)}>{v('speechSlow')}</button></div><p role="status">{speech.busy?v('listenPlaying'):heardQuestionId===q.id?t('listenChoose'):t('listenFirst')}</p></div>}
     {writing?<>
      {task==='write-perfekt'&&<div className="verb-aux"><span className="verb-aux-label">{t('helperVerb')}</span><div className="article-bank" role="group" aria-label={t('helperVerb')} dir="ltr" lang="de">{(['hat','ist'] as const).map(value=>{const right=value===verb.aux||(verb.alsoIst&&value==='ist');return <button type="button" key={value} className={'article-choice verb-aux-choice '+(aux===value?'selected ':'')+(feedback?(right&&(aux===value||!feedback.correct)?'right':aux===value?'wrong':''):'')} aria-pressed={aux===value} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>{setAux(value);setAuxWarning(false);}}>{value}</button>;})}</div>{auxWarning&&!aux&&<p className="verb-aux-warning" role="alert">{t('helperMissing')}</p>}</div>}
      <LetterPuzzle key={session.id+':'+q.id} answer={task==='write-perfekt'?verb.participle:q.answer} storageKey={'lernkoko-puzzle:'+session.id+':'+q.id} language={language} course="de" onChange={setSelected} onSubmit={answer=>{if(task==='write-perfekt'){if(!aux){setAuxWarning(true);return;}void submit(aux+' '+answer);}else void submit(answer);}} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined} strictCase={q.strictCase}/>
     </>:<div className={'object-options picture-word-options verb-options'+(session.mode==='listen'?' verb-listen-options':'')} role="group" aria-labelledby="object-question-heading">{options.map((option,i)=><button key={option} type="button" className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')+(!feedback&&selected===option?'selected':'')} disabled={!!feedback||actionDisabled||!!pendingAnswer.current||(session.mode==='listen'&&heardQuestionId!==q.id)} onClick={()=>void submit(option)}><span className="object-option-number">{String.fromCharCode(65+i)}</span>{optionLabel(q,option)}{feedback&&option===q.answer&&<CheckCircle2 size={20}/>}</button>)}</div>}
     {busy&&!feedback&&<p className="picture-quiz-saving" role="status"><Loader2 size={16} className="spinner"/>{v('savingAnswer')}</p>}
     {feedback&&<div id="object-feedback" tabIndex={-1} className={'object-feedback '+(feedback.correct?'success':'retry')} role="status" aria-live="polite">
      <h2>{feedback.correct?<CheckCircle2 size={23}/>:<X size={23}/>} {v(feedback.correct?'correct':writing?'wrongAnswer':'wrong')}</h2>
      <p>{v('correctAnswer')}: <strong lang="de" dir="ltr">{correctLabel(q,verb)}</strong></p>
      {writing&&<p>{v('yourAnswer')}: <span lang="de" dir="ltr">{feedback.answer}</span></p>}
      <p className="verb-feedback-forms"><small>{t('verbForms')}</small>{verbForms(verb)}</p>
      {verb.alsoIst&&<p className="verb-note">{t('liegenNote')}</p>}
      <button type="button" className="btn secondary small" disabled={busy||cueBusy} onClick={()=>speech.speak(pronunciation)}><Volume2 size={18}/>{v('repeatAudio')}</button>
      <button type="button" className="btn object-next" disabled={busy} onClick={next}>{v(index+1===session.questions.length?'viewResults':writing?'nextPuzzle':session.mode==='listen'?'nextListening':'nextQuestion')}<ArrowRight size={18} className="vault-direction-icon"/></button>
     </div>}
    </article>
   </section>:<p role="alert">{v('missingQuestion')} <button type="button" className="text-button" onClick={overview}>{v('categories')}</button></p>:
   view==='configure'?<section className="vault-config panel verb-config">
    <button type="button" className="text-button vault-back-categories" disabled={busy} onClick={overview}><ArrowLeft size={18} className="vault-direction-icon"/>{v('backCategories')}</button>
    <div className="vault-config-heading"><div className="vault-config-art verb-category-art"><VerbChips topic={group}/></div><div><h1 id="vault-config-heading" tabIndex={-1}>{categoryName(group)}</h1><p><span lang="de" dir="ltr">{rangeLabel(group)}</span> · {t('verbsCount',{n:groupVerbs(group).length})}</p><p>{v('practiceCount',{n:scopedQuestions.length})}</p></div></div>
    <PracticeModes labels={modeLabels} topicLabel={categoryName(group)} active={practiceMode} counts={counts(group)} disabled={busy} onChoose={mode=>{stopFeedback();setPracticeMode(mode);pendingStart.current=null;}}/>
    <div className="object-actions"><button type="button" className="btn" disabled={busy||!ready} onClick={()=>void start()}>{v(practiceMode==='write'?'startPuzzles':practiceMode==='listen'?'startListening':'startTest')}<ArrowRight size={18} className="vault-direction-icon"/></button><button type="button" className="btn secondary" disabled={busy||!ready||!marked.length} onClick={()=>void start(true)}><RotateCcw size={18}/>{v('reviewMarked')}{marked.length>0&&<span className="object-count">{marked.length}</span>}</button></div>
    {ready&&<p className="housing-remaining">{unsolved?v('remaining',{n:unsolved}):v('allSolved')}</p>}<p className="housing-tip">{v('starTip')}</p>
    <details className="verb-list" open><summary>{t('verbList')} · {groupVerbs(group).length}</summary>
     <ol className="verb-list-rows">{groupVerbs(group).map(item=><li key={item.id}><span className="verb-list-number">{item.number}</span><button type="button" className="verb-speak" disabled={speech.busy} aria-label={t('listenRow',{verb:item.display})} title={t('listenRow',{verb:item.display})} onClick={()=>speech.speak(verbRowSpeech(item))}><Volume2 size={17}/></button><span className="verb-list-word"><strong lang="de" dir="ltr">{item.display}</strong><span lang={language} dir={dir}>{verbMeaning(item,language)}</span></span><span className="verb-list-forms" lang="de" dir="ltr"><span>{item.subject} {item.praesens}</span><span>{item.subject} {perfektLabel(item)}</span></span></li>)}</ol>
    </details>
   </section>:<section className="vault-categories verb-categories" aria-labelledby="vault-heading">
    <h1 id="vault-heading" tabIndex={-1}>{t('verbsTitle')}</h1>
    <p className="verbs-lead">{t('verbsLead',{n:verbs.length})}</p>
    <div className="vault-feature-grid">
     {categoryCard('verbs-all',true)}
     <article className={'vault-category-card vault-mode-card featured resume '+(busy||!ready||!resumeId?'unavailable':'')} data-verb-category="resume"><button type="button" className="vault-category-open" disabled={busy||!ready||!resumeId} onClick={()=>{if(resumeId)void resume(resumeId);}}><div className="vault-category-art verb-resume-art"><RotateCcw size={58} aria-hidden="true"/></div><div className="vault-category-label"><h3>{v('resume')}</h3>{initializing?<p>{v('loading')}</p>:resumeSummary?<p>{v('progress',{n:resumeSummary.answered,total:resumeSummary.total})}</p>:<p>{v('noSavedTest')}</p>}<ArrowRight size={22} className="vault-direction-icon"/></div></button><div className="vault-resume-controls"><button type="button" className="btn secondary vault-resume-action" disabled={busy||!ready||!resumeId} onClick={()=>{if(resumeId)void resume(resumeId);}}><RotateCcw size={18}/>{v('resume')}<ArrowRight size={18} className="vault-direction-icon"/></button></div></article>
    </div>
    <h2 className="vault-category-section-title">{v('categories')}</h2><div className="vault-category-grid">{verbGroups.map(item=>categoryCard(item.id))}</div>
   </section>}
  </main><SiteFooter/>
 </div>;
}
