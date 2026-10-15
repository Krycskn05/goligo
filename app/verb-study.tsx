'use client';
import {SITE_NAME} from '@/lib/site-brand';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowRight,CheckCircle2,ChevronRight,Compass,Headphones,Loader2,Lock,Play,RotateCcw,Sparkles,Star,Trophy,Volume2,X,Zap} from 'lucide-react';
import {gradeAnswer,questionMap,type Question} from '@/lib/course';
import {verbs,verbMap,verbMeaning,perfektLabel,verbRowSpeech,seededOptions,type Verb} from '@/lib/verb-course';
import {verbFamilies,verbFamilyOf,familyTitle} from '@/lib/verb-families';
import {verbModePredicate} from '@/lib/verb-practice';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {sentenceChunks,sentenceText,verbRules,verbPrefix,praesensStem,praesensForm,separablePrefixes,verbPicture,verbsHeroPicture,type VerbTense} from '@/lib/verb-logic';
import {gameIds,type GameId} from '@/lib/verb-games';
import {VerbGame,VerbPicture,RuleBox} from './verb-games';
import {LearnCard,ChapterCard,PathStepper} from './verb-workshop';
import {WORKSHOP_TOPIC,WORKSHOP_MODE,KARMA_MODE,KARMA_COUNT,WORKSHOP_TOTAL,workshopVerbs,workshopIds,pathPlace,workshopProgress,findWorkshop,lastKarma,isCurrentPath,karmaHidesPicture} from '@/lib/verb-workshop';
import {starNoteKey,starredQuestionIds,type Answer,type Session,type Snapshot} from '@/lib/study';
import {api,useGermanSpeech,useAnswerFeedback} from './study-shared';
import {vaultLanguages,isVaultLanguage,vaultDirection,vaultText,type VaultLanguage,type VaultCopyKey} from '@/lib/object-vault-copy';
import {readVaultLanguage,saveVaultLanguage} from '@/lib/vault-language-preference';
import {LetterPuzzle} from './letter-puzzle';
import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';
import {verbProgress} from '@/lib/progress';
import {RoundReward} from './progress-ui';
import {progressText} from '@/lib/progress-copy';

const blank:Snapshot={reviews:[],notes:{},sessions:[]};
type ErrorKey=VaultCopyKey|'verbLegacy';
// Answers that are verbs (not forms) are shown as their meaning in these tasks.
const meaningOptionTasks=new Set(['meaning','hear']);
const verbOptionTasks=new Set(['word','fit','hear-praesens','hear-perfekt']);
const gameKeys:Record<GameId,VerbCopyKey>={sentence:'gameSentence',aux:'gameAux',build:'gameBuild',match:'gameMatch'};
const lookup=(id:string)=>questionMap.get(id);

/** Wrong prefixes offered next to the right one when a separable verb is written in a sentence. */
function prefixOptions(verb:Verb){
 const own=verbPrefix(verb);let hash=0;for(const c of verb.id)hash=(hash*31+c.charCodeAt(0))>>>0;
 const others=separablePrefixes.filter(item=>item!==own);const turned=[...others.slice(hash%others.length),...others.slice(0,hash%others.length)].slice(0,3);
 return [...turned.slice(0,hash%4),own,...turned.slice(hash%4)];
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
 const [session,setSession]=useState<Session|null>(null);const [index,setIndex]=useState(0);
 const [feedback,setFeedback]=useState<Answer|null>(null);const [selected,setSelected]=useState('');
 const [heardQuestionId,setHeardQuestionId]=useState<string|null>(null);const [starBusy,setStarBusy]=useState(false);
 const [aux,setAux]=useState<''|'hat'|'ist'>('');const [auxWarning,setAuxWarning]=useState(false);
 const [prefix,setPrefix]=useState('');const [prefixWarning,setPrefixWarning]=useState(false);
 const [dismissed,setDismissed]=useState<Set<string>>(new Set());
 const [game,setGame]=useState<GameId|null>(null);const [gameTopic,setGameTopic]=useState('verbs-all');
 const speech=useGermanSpeech('de');const answerAudio=useAnswerFeedback(speech);const cueBusy=answerAudio.busy;
 const mutation=useRef(false);const mounted=useRef(true);
 const pendingAnswer=useRef<{questionId:string;answer:string}|null>(null);
 const candidate=session?.questions[index]?lookup(session.questions[index].id):undefined;
 const q=verbModePredicate(session?.mode??WORKSHOP_MODE)(candidate)?candidate:undefined;
 const verb=q?.verbId?verbMap.get(q.verbId):undefined;
 const task=q?.verbTask;
 // Only the correct answer is spoken after the effect, never the question. The sentence task answers with the Präsens form.
 const pronunciation=task==='fit'&&verb?verb.praesens:q?.answer??'';
 const finished=!!session&&index>=session.questions.length;
 const workshop=session?.mode===WORKSHOP_MODE;const karma=session?.mode===KARMA_MODE;
 const place=workshop&&session?pathPlace(session.questions,index,lookup):null;
 const overlay=place&&place.chapterStart&&!dismissed.has('c:'+index)?'chapter':place&&place.stageStart&&!dismissed.has('l:'+index)?'learn':null;
 const starred=starredQuestionIds(snapshot.notes);
 const savedWorkshop=findWorkshop(snapshot.sessions);const path=workshopProgress(savedWorkshop);
 const karmaDone=lastKarma(snapshot.sessions);
 const nextVerb=workshopVerbs[Math.min(path.verbsDone,workshopVerbs.length-1)];
 function fail(e:unknown,fallback:ErrorKey){if(!mounted.current)return;const auth=!!(e as {signIn?:boolean})?.signIn;setSignIn(auth);setError(auth?'signInError':fallback);}
 async function refresh(){
  try{const next=await api(undefined,'stats=1&tz='+new Date().getTimezoneOffset(),'de');if(mounted.current){setSnapshot(next);setReady(true);setSignIn(false);}return next;}
  catch(e){if(mounted.current)setReady(false);fail(e,'loadError');}
 }
 useEffect(()=>{
  mounted.current=true;
  void refresh().finally(()=>{if(mounted.current)setInitializing(false);});
  return()=>{mounted.current=false;};
 },[]);
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=dir;document.title=verbText(language,'workshopTitle')+' · '+SITE_NAME;stopFeedback();},[language]);
 function stopFeedback(){answerAudio.stop();}
 function focus(id='object-question-heading'){requestAnimationFrame(()=>{document.getElementById(id)?.focus();window.scrollTo({top:0,behavior:'instant'});});}
 function clearAnswer(){setFeedback(null);setSelected('');setHeardQuestionId(null);setAux('');setAuxWarning(false);setPrefix('');setPrefixWarning(false);pendingAnswer.current=null;}
 function overview(){if(mutation.current)return;stopFeedback();setSession(null);setGame(null);clearAnswer();setError(null);void refresh();focus('vault-heading');}
 /** Moves focus to whichever card is on screen: the part card, the learning card or the question. */
 function focusCurrent(){requestAnimationFrame(()=>{(document.getElementById('verb-chapter-heading')??document.getElementById('verb-learn-heading')??document.getElementById('object-question-heading'))?.focus();window.scrollTo({top:0,behavior:'instant'});});}
 function openSession(restored:Session){setSession(restored);setIndex(restored.answers.length);setDismissed(new Set());clearAnswer();focusCurrent();}
 /** Enter the workshop: continue the saved path, or start a new one. */
 async function enterWorkshop(restart=false){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();
  try{
   const saved=!restart&&savedWorkshop&&!savedWorkshop.finished_at?savedWorkshop.id:null;
   if(saved){
    const data=await api<{session:Session}>(undefined,'session='+encodeURIComponent(saved),'de');
    if(!mounted.current)return;
    if(isCurrentPath(data.session)&&data.session.answers.length<data.session.questions.length){openSession(data.session);return;}
   }
   const ids=workshopIds();
   const data=await api<{session:Session}>({action:'start',id:crypto.randomUUID(),mode:WORKSHOP_MODE,topic:WORKSHOP_TOPIC,count:ids.length,onlyIds:ids},'','de');
   if(!mounted.current)return;openSession(data.session);
  }catch(e){fail(e,'startError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 /** Karma sınav: a new hard round every time; mistakes rank first on the server. */
 async function startKarma(){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();
  try{
   const data=await api<{session:Session}>({action:'start',id:crypto.randomUUID(),mode:KARMA_MODE,topic:WORKSHOP_TOPIC,count:KARMA_COUNT},'','de');
   if(!mounted.current)return;openSession(data.session);
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
 async function submit(answer:string){
  if(mutation.current||feedback||!session||!q||!answer.trim()||(options.length>0&&!options.includes(answer))||speech.isActive()||(q.kind==='listen'&&heardQuestionId!==q.id))return;
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
 function next(){
  if(mutation.current||!session||!feedback)return;stopFeedback();const upcoming=index+1;setIndex(upcoming);clearAnswer();focusCurrent();
  if(upcoming>=session.questions.length){answerAudio.complete();void refresh();}
 }
 function dismiss(kind:'c'|'l'){setDismissed(previous=>new Set(previous).add(kind+':'+index));focusCurrent();}
 // A saved round keeps the choices it was shown; if the catalogue changed since (the sentence task once offered verbs, now forms), the fresh choices are used in a fixed order.
 const stored=session?.questions[index]?.options;
 const options=q?(stored&&stored.includes(q.answer)?stored:q.options?seededOptions(q.options,(session?.id??'')+':'+q.id):[]):[];
 const actionDisabled=busy||cueBusy||speech.busy;
 function hearQuestion(slow=false){if(!q?.audio||busy||cueBusy)return;setHeardQuestionId(q.id);speech.speak(q.audio,slow);}
 /** "fährt ab" → "fährt … ab": the prefix of a separable verb stands at the end of the sentence. */
 function formWithGap(form:string,question:Question){
  const item=question.verbId?verbMap.get(question.verbId):undefined;const prefix=item?verbPrefix(item):'';
  return prefix&&form.endsWith(' '+prefix)?form.slice(0,-(prefix.length+1))+' … '+prefix:form;
 }
 /** How an answer option is shown: a meaning in the chosen language, a verb, or a German form. */
 function optionText(question:Question,option:string):{text:string;german:boolean}{
  const target=verbMap.get(option);const kind=question.verbTask??'';
  if(target&&meaningOptionTasks.has(kind))return {text:verbMeaning(target,language),german:false};
  // The sentence task offers forms of the verb ("fährt", "fährst", "fahre" …); a prefix is shown where it goes, at the end.
  if(kind==='fit')return {text:formWithGap(option,question),german:true};
  if(target&&verbOptionTasks.has(kind))return {text:target.display,german:true};
  return {text:option,german:true};
 }
 function optionLabel(question:Question,option:string,className='picture-option-word'){
  const label=optionText(question,option);
  return <span className={className+(label.german?'':' verb-option-meaning')} lang={label.german?'de':language} dir={label.german?'ltr':dir}>{label.text}</span>;
 }
 function correctLabel(question:Question,item:Verb){
  const kind=question.verbTask??'';
  return kind==='praesens'||kind==='write-praesens'||kind==='perfekt'||kind==='write-perfekt'?item.subject+' '+question.answer:kind==='fit'?praesensForm(item):item.display;
 }
 function verbForms(item:Verb){
  return <span className="verb-forms"><span className="verb-forms-german" lang="de" dir="ltr"><strong>{item.display}</strong> — {item.subject} {item.praesens} — {item.subject} {perfektLabel(item)}</span><span className="verb-forms-meaning" lang={language} dir={dir}>{verbMeaning(item,language)}</span></span>;
 }
 function heading(question:Question){
  const kind=question.verbTask;
  return kind==='meaning'?t('promptMeaning'):kind==='word'?t('promptWord'):kind==='fit'?t('promptFit'):kind==='praesens'?t('promptPraesens'):kind==='perfekt'?t('promptPerfekt'):kind==='write'?t('writeInfinitive'):kind==='write-praesens'?t('gapPraesens'):kind==='write-perfekt'?t('gapPerfekt'):kind==='hear'?t('listenMeaning'):t('listenVerb');
 }
 /** The example sentence with gaps where the verb goes; filled in after the answer. */
 function sentenceLine(question:Question,item:Verb){
  const kind=question.verbTask;const tense:VerbTense=kind==='perfekt'||kind==='write-perfekt'?'perfekt':'praesens';
  const live=kind==='write-praesens'?{verb:selected||'',prefix}:kind==='write-perfekt'?{aux,participle:selected||''}:{};
  return <p className="verb-sentence" lang="de" dir="ltr">{sentenceChunks(item,tense).map((chunk,i)=>{
   if(chunk.role==='subject'||chunk.role==='middle')return <span key={i} className="verb-chunk">{chunk.text}</span>;
   const value=feedback?chunk.text:(live as Record<string,string|undefined>)[chunk.role]||'';
   return <span key={i} className={'verb-chunk gap '+chunk.role+(value?' filled':'')}>{value||'___'}</span>;
  })}.</p>;
 }
 function promptCard(question:Question,item:Verb){
  const kind=question.verbTask;
  // Pictures give the meaning away: hidden for meaning questions, and in Karma sınav for everything but the sentence task.
  const showPicture=(kind!=='meaning'&&!(karma&&karmaHidesPicture(kind)))||!!feedback;
  if(kind==='word'||kind==='write')return <div className="verb-card with-picture">{showPicture&&<VerbPicture verb={item} language={language}/>}<p className="verb-card-main verb-card-meaning-main" lang={language} dir={dir}>{verbMeaning(item,language)}</p></div>;
  if(kind==='fit')return <div className="verb-card with-picture">{showPicture&&<VerbPicture verb={item} language={language}/>}<p className="verb-card-main" lang="de" dir="ltr">{item.display}</p>{sentenceLine(question,item)}{feedback&&<p className="verb-card-meaning" lang={language} dir={dir}>{verbMeaning(item,language)}</p>}</div>;
  const sentence=kind==='praesens'||kind==='perfekt'||kind==='write-praesens'||kind==='write-perfekt';
  return <div className="verb-card with-picture">{showPicture&&<VerbPicture verb={item} language={language}/>}<p className="verb-card-main" lang="de" dir="ltr">{item.display}</p>{kind!=='meaning'&&<p className="verb-card-meaning" lang={language} dir={dir}>{verbMeaning(item,language)}</p>}{sentence&&sentenceLine(question,item)}</div>;
 }
 /** Rule lines for the feedback: the tense the question was about, or two example sentences. */
 function feedbackRules(question:Question,item:Verb){
  const kind=question.verbTask??'';
  if(kind==='praesens'||kind==='write-praesens'||kind==='hear-praesens')return verbRules(item,'praesens',language);
  if(kind==='perfekt'||kind==='write-perfekt'||kind==='hear-perfekt')return verbRules(item,'perfekt',language);
  return [sentenceText(item,'praesens'),sentenceText(item,'perfekt')];
 }
 const errorText=(key:ErrorKey)=>key==='verbLegacy'?t('legacyError'):v(key);
 const writing=q?.kind==='write';const listening=q?.kind==='listen';
 const chapterVerbs=place?workshopVerbs.filter(item=>verbFamilyOf(item.id)?.id===place.family.id):[];
 const overall=ready?verbProgress('verbs-all',snapshot.reviews):null;
 const nextFamily=verbFamilyOf(nextVerb.id)!;
 const nextLabel=t('nextUp',{verb:'\u2063'}).split('\u2063');
 // "Fiil Atölyesi" → first word plain, the rest in the accent colour.
 const titleWords=(()=>{const words=t('workshopTitle').split(' ');return {head:words[0],tail:words.slice(1).join(' ')};})();

 return <div className="category-app object-app toon-app picture-quiz-app vault-app verb-app" lang={language} dir={dir}>
  <a className="skip-link" href="#object-main">{v('skipContent')}</a>
  <SiteHeader language={language} languages={vaultLanguages} onLanguage={value=>{if(isVaultLanguage(value)){stopFeedback();onLanguage(value);}}} homeHref="/?learn=de" homeLabel={v('home')} stats={snapshot.stats}/>
  <main id="object-main" className="object-page">
   <div className="object-breadcrumb"><a href="/?learn=de">{v('home')}</a><ChevronRight size={14} className="vault-direction-icon"/><span>{t('workshopTitle')}</span></div>
   {error&&<div className="object-alert" role="alert"><p>{errorText(error)}</p>{signIn?<a href="/auth/login" className="btn">{v('signIn')}</a>:pendingAnswer.current?<button type="button" className="btn secondary small" disabled={busy} onClick={()=>void submit(pendingAnswer.current!.answer)}>{v('saveRetry')}</button>:<button type="button" className="btn secondary small" disabled={busy} onClick={()=>{setError(null);void refresh();}}>{v('retry')}</button>}</div>}
   {speech.warning&&<p className="object-alert" role="status">{language==='tr'?speech.warning:v('audioWarning')}</p>}
   {session?finished?<section className="object-results panel verb-results">
    <h1 id="object-question-heading" tabIndex={-1}>{workshop?t('pathDone'):v('resultsTitle')}</h1><p className="vault-result-score">{v('resultScore',{correct:session.answers.filter(a=>a.correct).length,total:session.questions.length})}</p>
    <RoundReward answers={session.answers} progress={ready?verbProgress('verbs-all',snapshot.reviews):null} language={language} label={t('workshopTitle')}/>
    <div className="object-actions">{workshop?<button type="button" className="btn" disabled={busy} onClick={()=>void startKarma()}><Sparkles size={18}/>{t('toKarma')}</button>:<button type="button" className="btn" disabled={busy} onClick={()=>void startKarma()}><RotateCcw size={18}/>{t('playAgain')}</button>}<button type="button" className="btn secondary" disabled={busy} onClick={overview}>{t('backWorkshop')}</button></div>
    {session.answers.filter(a=>!a.correct).map(a=>{const item=lookup(a.question_id);const target=item?.verbId?verbMap.get(item.verbId):undefined;return item&&target?<div className="object-result-row verb-result-row" key={a.id}><div>{verbForms(target)}<small>{v(item.kind==='write'?'yourAnswer':'yourChoice')}: {optionLabel(item,a.answer,'verb-result-answer')}</small></div></div>:null;})}
   </section>:q&&verb?<section className="object-practice picture-quiz-practice verb-practice">
    <div className="object-practice-top"><span className="object-pill">{karma?t('karmaPill'):t('workshopTitle')}</span><span>{v('progress',{n:index+1,total:session.questions.length})}</span><button type="button" className={'housing-star'+(starred.has(q.id)?' active':'')} aria-pressed={starred.has(q.id)} aria-label={v(starred.has(q.id)?'unstar':'star')} title={v(starred.has(q.id)?'unstar':'star')} disabled={starBusy} onClick={()=>void toggleStar(q.id)}><Star size={20} fill={starred.has(q.id)?'currentColor':'none'}/></button><button type="button" className="object-exit" disabled={busy} onClick={overview} aria-label={v('exitTest')}><X size={20}/></button></div>
    <progress max={session.questions.length} value={index} aria-label={v('progress',{n:index+1,total:session.questions.length})}/>
    {place&&<PathStepper place={place} total={workshopVerbs.length} language={language}/>}
    {overlay==='chapter'&&place?<ChapterCard family={place.family} verbs={chapterVerbs} language={language} onContinue={()=>dismiss('c')}/>:
    overlay==='learn'&&place?<LearnCard verb={verb} stage={place.stage} language={language} speech={{speak:text=>speech.speak(text),busy:speech.busy||cueBusy}} onContinue={()=>dismiss('l')}/>:
    <article className="object-question panel verb-question">
     <h1 id="object-question-heading" tabIndex={-1}>{heading(q)}</h1>
     {!listening&&promptCard(q,verb)}
     {listening&&<div className="vault-listen-player"><Headphones size={32} aria-hidden="true"/><div className="vault-listen-buttons"><button type="button" className="btn" disabled={actionDisabled} onClick={()=>hearQuestion()}><Volume2 size={20}/>{heardQuestionId===q.id?v('repeatAudio'):t('listenButton')}</button><button type="button" className="btn secondary" disabled={actionDisabled} onClick={()=>hearQuestion(true)}>{v('speechSlow')}</button></div><p role="status">{speech.busy?v('listenPlaying'):heardQuestionId===q.id?t('listenChoose'):t('listenFirst')}</p></div>}
     {writing?<>
      {task==='write-perfekt'&&<div className="verb-aux"><span className="verb-aux-label">{t('helperVerb')}</span><div className="article-bank" role="group" aria-label={t('helperVerb')} dir="ltr" lang="de">{(['hat','ist'] as const).map(value=>{const right=value===verb.aux||(verb.alsoIst&&value==='ist');return <button type="button" key={value} className={'article-choice verb-aux-choice '+(aux===value?'selected ':'')+(feedback?(right&&(aux===value||!feedback.correct)?'right':aux===value?'wrong':''):'')} aria-pressed={aux===value} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>{setAux(value);setAuxWarning(false);}}>{value}</button>;})}</div>{auxWarning&&!aux&&<p className="verb-aux-warning" role="alert">{t('helperMissing')}</p>}</div>}
      {task==='write-praesens'&&verbPrefix(verb)&&<div className="verb-aux"><span className="verb-aux-label">{t('prefixChoice')}</span><div className="article-bank" role="group" aria-label={t('prefixChoice')} dir="ltr" lang="de">{prefixOptions(verb).map(value=>{const right=value===verbPrefix(verb);return <button type="button" key={value} className={'article-choice verb-aux-choice '+(prefix===value?'selected ':'')+(feedback?(right&&(prefix===value||!feedback.correct)?'right':prefix===value?'wrong':''):'')} aria-pressed={prefix===value} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>{setPrefix(value);setPrefixWarning(false);}}>{value}</button>;})}</div>{prefixWarning&&!prefix&&<p className="verb-aux-warning" role="alert">{t('prefixMissing')}</p>}</div>}
      <LetterPuzzle key={session.id+':'+q.id} answer={task==='write-perfekt'?verb.participle:task==='write-praesens'?praesensStem(verb):task==='write'?verb.display:q.answer} storageKey={'lernkoko-puzzle:'+session.id+':'+q.id} language={language} course="de" onChange={setSelected} onSubmit={answer=>{
       if(task==='write-perfekt'){if(!aux){setAuxWarning(true);return;}void submit(aux+' '+answer);}
       else if(task==='write-praesens'&&verbPrefix(verb)){if(!prefix){setPrefixWarning(true);return;}void submit(answer+' '+prefix);}
       else void submit(answer.replace('|',''));
      }} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined} strictCase={q.strictCase}/>
     </>:<div className={'object-options picture-word-options verb-options'+(listening?' verb-listen-options':'')} role="group" aria-labelledby="object-question-heading">{options.map((option,i)=><button key={option} type="button" className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')+(!feedback&&selected===option?'selected':'')} disabled={!!feedback||actionDisabled||!!pendingAnswer.current||(listening&&heardQuestionId!==q.id)} onClick={()=>void submit(option)}><span className="object-option-number">{String.fromCharCode(65+i)}</span>{optionLabel(q,option)}{feedback&&option===q.answer&&<CheckCircle2 size={20}/>}</button>)}</div>}
     {busy&&!feedback&&<p className="picture-quiz-saving" role="status"><Loader2 size={16} className="spinner"/>{v('savingAnswer')}</p>}
     {feedback&&<div id="object-feedback" tabIndex={-1} className={'object-feedback '+(feedback.correct?'success':'retry')} role="status" aria-live="polite">
      <h2>{feedback.correct?<CheckCircle2 size={23}/>:<X size={23}/>} {v(feedback.correct?'correct':writing?'wrongAnswer':'wrong')}</h2>
      <p>{v('correctAnswer')}: <strong lang="de" dir="ltr">{correctLabel(q,verb)}</strong></p>
      {writing&&<p>{v('yourAnswer')}: <span lang="de" dir="ltr">{feedback.answer}</span></p>}
      <div className="verb-feedback-main">{(listening||karma)&&<VerbPicture verb={verb} language={language} small/>}<p className="verb-feedback-forms"><small>{t('verbForms')}</small>{verbForms(verb)}</p></div>
      <RuleBox lines={feedbackRules(q,verb)} language={language}/>
      {verb.alsoIst&&<p className="verb-note">{t('liegenNote')}</p>}
      <button type="button" className="btn secondary small" disabled={busy||cueBusy} onClick={()=>speech.speak(pronunciation)}><Volume2 size={18}/>{v('repeatAudio')}</button>
      <button type="button" className="btn object-next" disabled={busy} onClick={next}>{v(index+1===session.questions.length?'viewResults':writing?'nextPuzzle':listening?'nextListening':'nextQuestion')}<ArrowRight size={18} className="vault-direction-icon"/></button>
     </div>}
    </article>}
   </section>:<p role="alert">{v('missingQuestion')} <button type="button" className="text-button" onClick={overview}>{t('backWorkshop')}</button></p>:
   game?<VerbGame game={game} language={language} topic={gameTopic} onTopic={setGameTopic} onExit={()=>{setGame(null);focus('vault-heading');}} feedback={{answer:answerAudio.answer,stop:answerAudio.stop,complete:answerAudio.complete,busy:cueBusy||speech.busy}}/>:
   <section className="verb-home" aria-labelledby="vault-heading">
    <div className="verb-hero">
     <div className="verb-hero-text">
      <h1 id="vault-heading" tabIndex={-1} className="verb-hero-title">{titleWords.head}{titleWords.tail&&<> <span className="k">{titleWords.tail}</span></>}</h1>
      <p className="verb-hero-lead">{t('workshopLead')}</p>
      <div className="verb-hero-cta">
       <button type="button" className="btn verb-path-enter" disabled={busy||!ready} onClick={()=>void enterWorkshop()}><Play size={20} fill="currentColor" aria-hidden="true"/>{path.finished||!savedWorkshop?t(path.finished?'workshopRestart':'workshopStart'):t('workshopEnter')}</button>
       <button type="button" className="btn orange small" disabled={busy||!ready} onClick={()=>void startKarma()}><Zap size={17} fill="currentColor" aria-hidden="true"/>{t('karmaTitle')}</button>
      </div>
     </div>
     <div className="verb-polaroid">
      <img className="verb-polaroid-photo" src={verbsHeroPicture} alt="" width={1200} height={800} decoding="async"/>
      <div className="verb-polaroid-sticker" aria-hidden="true"><b>{verbs.length}</b>{t('verbsWord')}</div>
      <span className="verb-koko" aria-hidden="true"/>
     </div>
    </div>
    <article className="panel verb-path-panel" data-verb-workshop="">
     <div className="verb-avatar"><VerbPicture verb={nextVerb} language={language} small/></div>
     <div className="verb-path-status">
      <p className="verb-path-title"><span className="n">{path.verbsDone}</span> / {workshopVerbs.length} {t('verbsWord')}</p>
      <div className="verb-energy" role="progressbar" aria-label={t('workshopTitle')} aria-valuemin={0} aria-valuemax={WORKSHOP_TOTAL} aria-valuenow={path.answered} aria-valuetext={t('verbsDone',{n:path.verbsDone,total:workshopVerbs.length})}><span className="verb-energy-fill" style={{width:Math.max(3,path.percent)+'%'}}/><span className="verb-energy-ticks"/></div>
      {initializing?<p className="verb-path-note">{v('loading')}</p>:path.finished?<p className="verb-path-note verb-path-done"><CheckCircle2 size={16} aria-hidden="true"/>{t('workshopDone')}</p>:<p className="verb-path-note">{t('chapterOf',{n:nextFamily.number})} · {familyTitle(nextFamily,language)}</p>}
      {savedWorkshop&&!path.finished&&path.answered>0&&<button type="button" className="text-button verb-path-restart" disabled={busy||!ready} onClick={()=>void enterWorkshop(true)}><RotateCcw size={15}/>{t('workshopRestart')}</button>}
     </div>
     {!path.finished&&<div className="verb-bubble">{nextLabel[0]}<strong lang="de" dir="ltr">{nextVerb.display}</strong>{nextLabel[1]}</div>}
    </article>
    <section className="verb-map" aria-labelledby="verb-map-heading">
     <h2 id="verb-map-heading" className="verb-map-title">{t('mapTitle')}</h2>
     <svg className="verb-map-path" viewBox="0 0 1130 1180" preserveAspectRatio="none" aria-hidden="true"><path d="M200 120 C 500 160, 700 180, 820 300 S 300 520, 310 640 S 900 820, 830 960 S 420 1100, 300 1140" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeDasharray="2 30" opacity=".9"/></svg>
     {verbFamilies.map(family=>{
      const verbsBefore=workshopVerbs.findIndex(item=>verbFamilyOf(item.id)?.id===family.id);
      const done=Math.max(0,Math.min(family.verbs.length,path.verbsDone-verbsBefore));
      const inside=path.verbsDone>=verbsBefore&&path.verbsDone<verbsBefore+family.verbs.length;
      const state=done>=family.verbs.length?'done':inside&&!path.finished?'current':path.verbsDone<verbsBefore?'locked':'';
      const members=family.verbs.map(id=>verbMap.get(id)!);
      return <article key={family.id} className={'verb-island tone-'+family.tone+' '+state} style={{'--p':Math.round(done/family.verbs.length*100)} as CSSProperties} data-verb-island={family.id}>
       {state==='current'&&<span className="verb-here"><Compass size={15} aria-hidden="true"/>{t('hereBadge')}</span>}
       {state==='locked'&&<span className="verb-lock" aria-hidden="true"><Lock size={18}/></span>}
       {state==='done'&&<span className="verb-lock done" aria-hidden="true"><CheckCircle2 size={20}/></span>}
       <span className="verb-island-number">{family.number}</span>
       <div className="verb-island-text">
        <h3>{familyTitle(family,language)}</h3>
        <p><span lang="de" dir="ltr">{members.slice(0,3).map(item=>item.display).join(', ')}…</span> · {t('verbsCount',{n:family.verbs.length})}</p>
        <div className="verb-island-pics">{members.slice(0,4).map(item=><img key={item.id} src={verbPicture(item)??''} alt="" width={96} height={96} loading="lazy" decoding="async"/>)}</div>
       </div>
       <span className="verb-ring" data-v={done+'/'+family.verbs.length}/>
      </article>;
     })}
    </section>
    <article className="verb-karma" data-verb-karma="">
     <span className="verb-karma-chest" aria-hidden="true"><Trophy size={54}/></span>
     <div className="verb-karma-text"><h2>{t('karmaTitle')} <span className="verb-hard-tag">{t('hardTag')}</span></h2><p>{t('karmaLead')}</p><small>{karmaDone?t('karmaLast',{n:karmaDone.correct,total:karmaDone.total}):t('karmaTreasure')}</small></div>
     <button type="button" className="btn orange" disabled={busy||!ready} onClick={()=>void startKarma()}><Zap size={18} fill="currentColor" aria-hidden="true"/>{t('karmaStart')}</button>
    </article>
    <article className="panel verb-collection">
     <h2>{t('collectionTitle')}</h2><p className="verb-collection-lead">{t('collectionLead')}{overall&&<> · {progressText(language,'learned',{n:overall.learned,total:overall.total})}</>}</p>
     <div className="verb-stickers">{workshopVerbs.map((item,i)=><img key={item.id} className={i<path.verbsDone?'got':'missing'} src={verbPicture(item)??''} alt={item.display} title={item.display} width={96} height={96} loading="lazy" decoding="async"/>)}</div>
    </article>
    <details className="verb-list"><summary>{t('verbList')} · {verbs.length}</summary>
     <ol className="verb-list-rows">{verbs.map(item=><li key={item.id}><span className="verb-list-number">{item.number}</span><VerbPicture verb={item} language={language} small/><button type="button" className="verb-speak" disabled={speech.busy} aria-label={t('listenRow',{verb:item.display})} title={t('listenRow',{verb:item.display})} onClick={()=>speech.speak(verbRowSpeech(item))}><Volume2 size={17}/></button><span className="verb-list-word"><strong lang="de" dir="ltr">{item.display}</strong><span lang={language} dir={dir}>{verbMeaning(item,language)}</span></span><span className="verb-list-forms" lang="de" dir="ltr"><span>{item.subject} {item.praesens}</span><span>{item.subject} {perfektLabel(item)}</span></span></li>)}</ol>
    </details>
    <details className="verb-list verb-games-row"><summary>{t('gamesTitle')}</summary>
     <div className="verb-game-chips">{gameIds.map(id=><button type="button" key={id} className="btn secondary small" data-verb-game-card={id} disabled={busy} onClick={()=>{stopFeedback();setGame(id);focus('verb-game-heading');}}>{t(gameKeys[id])}</button>)}</div>
    </details>
   </section>}
  </main><SiteFooter/>
 </div>;
}
