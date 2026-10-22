'use client';
import {browserLanguage} from '@/lib/device-language';
import {SITE_NAME} from '@/lib/site-brand';
import {OptionText} from './option-fit';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronDown,ChevronRight,Compass,Headphones,Loader2,Lock,Play,RotateCcw,Star,Volume2,X} from 'lucide-react';
import {gradeAnswer,questionMap,type Question} from '@/lib/course';
import {housingMeaning,type HousingExercise} from '@/lib/housing-course';
import {housingIllustration} from '@/lib/housing-illustrations';
import {objectMeaning} from '@/lib/object-translations';
import {ObjectArt,RasterArt} from './toon-art';
import {verbs,verbMap,verbMeaning,perfektLabel,verbRowSpeech,seededOptions,type Verb,type VerbTask} from '@/lib/verb-course';
import {verbFamilies,verbFamilyOf,familyTitle,type VerbFamily} from '@/lib/verb-families';
import {verbModePredicate} from '@/lib/verb-practice';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {sentenceChunks,verbRules,verbPrefix,praesensStem,praesensForm,separablePrefixes,verbPicture,type VerbTense} from '@/lib/verb-logic';
import {gameIds,type GameId} from '@/lib/verb-games';
import {VerbGame,VerbPicture,RuleBox,gameName,gameDetail} from './verb-games';
import {GameIcon} from './game-icons';
import {GAME_LEVEL,gameLength} from '@/lib/game-names';
import {LearnCard,PathStepper,AnswerResult,PartVerbs,VerbDetail,kindClass} from './verb-workshop';
import {loadExampleMeanings} from '@/lib/verb-example-meanings';
import {learnSpeech} from '@/lib/verb-persons';
import {WORKSHOP_TOPIC,WORKSHOP_MODE,workshopVerbs,pathPlace,partIds,partsStatus,currentPart,verbStatus,findPartSession,isPartRound,isOlderRound,continuationIds,roundEnd,learnStage,MISTAKES_MODE,workshopMistakeIds,mistakeVerbs} from '@/lib/verb-workshop';
import {starNoteKey,starredQuestionIds,type Answer,type Session,type Snapshot} from '@/lib/study';
import {api,useGermanSpeech,useAnswerFeedback} from './study-shared';
import {vaultLanguages,isVaultLanguage,vaultDirection,vaultText,type VaultLanguage,type VaultCopyKey} from '@/lib/object-vault-copy';
import {readVaultLanguage,saveVaultLanguage} from '@/lib/vault-language-preference';
import {useLanguageSwitch} from './language-switch';
import {LetterPuzzle} from './letter-puzzle';
import {SiteFooter} from './site-footer';
import {SiteMenuAside} from './site-menu';
import {StartWait} from './start-wait';
import {SiteHeader} from './site-header';
import {NavIcon} from './nav-icons';
import {housingText} from '@/lib/housing-copy';
import {PaulHoca} from './paul-hoca';
import {verbProgress,learnedVerbs,partMistakes,allMistakeIds} from '@/lib/progress';
import {RoundReward} from './progress-ui';
import {progressText} from '@/lib/progress-copy';
import {GUEST_GAMES,GUEST_VERB_PART} from '@/lib/guest-parts';
import {guestText} from '@/lib/guest-copy';
import {GuestBanner,GuestLock,GuestMore,guestSignUp} from './guest-taste';

const blank:Snapshot={reviews:[],notes:{},sessions:[]};
type VerbSection='games'|'mistakes';
type ErrorKey=VaultCopyKey|'verbLegacy';
// Answers that are verbs (not forms) are shown as their meaning in these tasks.
const meaningOptionTasks=new Set(['meaning','hear']);
const verbOptionTasks=new Set(['word','fit','hear-praesens','hear-perfekt']);
const lookup=(id:string)=>questionMap.get(id);

/** Wrong prefixes offered next to the right one when a separable verb is written in a sentence. */
function prefixOptions(verb:Verb){
 const own=verbPrefix(verb);let hash=0;for(const c of verb.id)hash=(hash*31+c.charCodeAt(0))>>>0;
 const others=separablePrefixes.filter(item=>item!==own);const turned=[...others.slice(hash%others.length),...others.slice(0,hash%others.length)].slice(0,3);
 return [...turned.slice(0,hash%4),own,...turned.slice(hash%4)];
}
/** `guest`: a visitor without an account (app/fiiller/page.tsx) — part 1 and the first game are open, nothing is saved. */
export default function VerbStudy({guest=false,part}:{guest?:boolean;part?:VerbSection}){
 const [language,setLanguage]=useState<VaultLanguage>('de');const [ready,setReady]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{let saved:VaultLanguage=browserLanguage();try{saved=readVaultLanguage(localStorage,saved);}catch{}switchLanguage(saved,()=>setReady(true));},[switchLanguage]);
 useEffect(()=>{if(!ready)return;try{saveVaultLanguage(localStorage,language);}catch{}},[language,ready]);
 return ready?<VerbWorkshop language={language} onLanguage={switchLanguage} guest={guest} part={part}/>:<div className="course-loading" role="status">{SITE_NAME}…</div>;
}
export function VerbWorkshop({language,onLanguage,guest=false,part}:{language:VaultLanguage;onLanguage:(value:VaultLanguage)=>void;guest?:boolean;part?:VerbSection}){
 const v=(key:VaultCopyKey,params?:Record<string,string|number>)=>vaultText(language,key,params,'de');
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const dir=vaultDirection(language);
 const [snapshot,setSnapshot]=useState<Snapshot>(blank);
 const [ready,setReady]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState<ErrorKey|null>(null);const [signIn,setSignIn]=useState(false);
 const [,setInitializing]=useState(true);
 const [session,setSession]=useState<Session|null>(null);const [index,setIndex]=useState(0);
 const [feedback,setFeedback]=useState<Answer|null>(null);const [selected,setSelected]=useState('');
 const [heardQuestionId,setHeardQuestionId]=useState<string|null>(null);const [starBusy,setStarBusy]=useState(false);
 const [aux,setAux]=useState<''|'hat'|'ist'>('');const [auxWarning,setAuxWarning]=useState(false);
 const [prefix,setPrefix]=useState('');const [prefixWarning,setPrefixWarning]=useState(false);
 const [dismissed,setDismissed]=useState<Set<string>>(new Set());
 const [game,setGame]=useState<GameId|null>(null);const [gameTopic,setGameTopic]=useState('verbs-all');
 // A part opened from the map (its verb list), and optionally one verb's card inside it.
 const [view,setView]=useState<{family:VerbFamily;verbId?:string}|null>(null);
 // Oyunlar (/oyunlar) and Yanlışlarım (/yanlislarim) are parts of the site of their own (the learner asked, 22 October
 // 2026): this component draws them with `part`; the old addresses /fiiller?bolum=oyunlar|yanlislar move there.
 const [section,setSection]=useState<VerbSection|null>(part??null);
 useEffect(()=>{if(part)return;const value=new URLSearchParams(window.location.search).get('bolum');if(value==='oyunlar'||value==='yanlislar')window.location.replace(value==='oyunlar'?'/oyunlar':'/yanlislarim');},[part]);
 // Where sign up / sign in come back to (the guest taste).
 const back=section==='games'?'/oyunlar':section==='mistakes'?'/yanlislarim':'/fiiller';
 const speech=useGermanSpeech('de');const answerAudio=useAnswerFeedback(speech);const cueBusy=answerAudio.busy;
 const mutation=useRef(false);const mounted=useRef(true);
 const pendingAnswer=useRef<{questionId:string;answer:string}|null>(null);
 const candidate=session?.questions[index]?lookup(session.questions[index].id):undefined;
 // Yanlışlarım's one round of every mistake (topic 'all') also has Nesne Kasası and Ev ve Yaşam questions.
 const everyMistake=session?.mode===MISTAKES_MODE&&session.topic==='all';
 const q=everyMistake||verbModePredicate(session?.mode??WORKSHOP_MODE)(candidate)?candidate:undefined;
 const verb=q?.verbId?verbMap.get(q.verbId):undefined;
 const task=q?.verbTask;
 // Only the correct answer is spoken after the effect, never the question. The sentence task answers with the Präsens form.
 const pronunciation=task==='fit'&&verb?verb.praesens:q?.articlePuzzle?q.articlePuzzle.fullAnswer:q?.answer??'';
 // An older round of the whole path ends after part 1; every other round at its last question.
 const end=session?roundEnd(session):0;
 const finished=!!session&&index>=end;
 const workshop=session?.mode===WORKSHOP_MODE;
 const place=workshop&&session?pathPlace(session.questions,index,lookup):null;
 // No part card: a part opens straight on its first verb's card (the learner asked to drop the part introduction).
 const overlay=place&&place.stageStart&&!dismissed.has('l:'+index)?'learn':null;
 // A new verb: its card says the verb aloud once by itself (only the German verb — never the question, the meaning or an explanation).
 const spokenCard=useRef('');
 useEffect(()=>{
  if(overlay!=='learn'||!place||!session)return;
  const key=session.id+':'+index;if(spokenCard.current===key)return;spokenCard.current=key;
  speech.speak(learnSpeech(place.verb,place.stage==='perfekt'?'perfekt':place.stage==='praesens'?'praesens':'meaning'));
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[overlay,index,session?.id]);
 const starred=starredQuestionIds(snapshot.notes);
 // No part is locked: every part has its own round; the hero continues the part practised last.
 const parts=partsStatus(snapshot.sessions);const path=currentPart(snapshot.sessions);
 const stickers=verbStatus(snapshot.sessions);
 // Yanlışlarım: workshop questions whose last answer was wrong; one right answer takes a question off the list.
 const otherMistakes=ready&&section==='mistakes'?partMistakes(snapshot.reviews):null;
 const allMistakes=ready&&section==='mistakes'?allMistakeIds(snapshot.reviews,workshopMistakeIds(snapshot.reviews)):[];
 const mistakeIds=ready?workshopMistakeIds(snapshot.reviews):[];const mistakeVerbList=mistakeVerbs(mistakeIds);
 const mistakesRound=session?.mode===MISTAKES_MODE;
 const roundFamily:VerbFamily=(session&&verbFamilyOf(lookup(session.questions[0]?.id??'')?.verbId??''))||verbFamilies[0];
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
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=dir;// The tab title names the part that is open (Oyunlar, Yanlışlarım), as the page's own metadata does.
 document.title=verbText(language,part==='games'?'gamesTitle':part==='mistakes'?'mistakesTitle':'workshopTitle')+' · '+SITE_NAME;stopFeedback();},[language,part]);
 // The meanings of the example sentences come in a small file per language; load it before the first answer.
 useEffect(()=>{void loadExampleMeanings(language);},[language]);
 function stopFeedback(){answerAudio.stop();}
 function focus(id='object-question-heading'){requestAnimationFrame(()=>{document.getElementById(id)?.focus();window.scrollTo({top:0,behavior:'instant'});});}
 function clearAnswer(){setFeedback(null);setSelected('');setHeardQuestionId(null);setAux('');setAuxWarning(false);setPrefix('');setPrefixWarning(false);pendingAnswer.current=null;}
 function overview(){if(mutation.current)return;stopFeedback();setSession(null);setGame(null);clearAnswer();setError(null);void refresh();focus(view?view.verbId?'verb-detail-heading':'verb-part-heading':section?'verb-section-heading':'vault-heading');}
 /** Opens a part from the map: its verbs with what is done, and the button to start or continue it. */
 function openPart(family:VerbFamily){stopFeedback();setView({family});focus('verb-part-heading');}
 function openVerb(family:VerbFamily,id:string){stopFeedback();setView({family,verbId:id});focus('verb-detail-heading');}
 function closeView(){stopFeedback();setView(null);focus('vault-heading');}
 function closeSection(){stopFeedback();setSection(null);setGame(null);try{const url=new URL(window.location.href);url.searchParams.delete('bolum');window.history.replaceState(null,'',url);}catch{}focus('vault-heading');}
 /** Moves focus to whichever card is on screen: the part card, the learning card or the question. */
 function focusCurrent(){requestAnimationFrame(()=>{(document.getElementById('verb-chapter-heading')??document.getElementById('verb-learn-heading')??document.getElementById('object-question-heading'))?.focus({preventScroll:true});toPractice();});}
 /** Phones: every step fills the screen from the top of the practice area (the site header scrolls away), so nothing needs dragging. */
 function toPractice(){const box=document.querySelector('.verb-practice');if(box&&window.matchMedia('(max-width: 760px)').matches)box.scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});}
 function openSession(restored:Session){setSession(restored);setIndex(restored.answers.length);setDismissed(new Set());clearAnswer();focusCurrent();}
 /** Enter a part (none is locked): continue its saved round, or start a new one. A round saved in the older order
  * (all meanings first, or Perfekt with hat/ist) is not continued as it was: the part goes on verb by verb with the questions still left. */
 async function enterPart(family:VerbFamily,restart=false){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();speech.prepare();
  try{
   let ids=partIds(family);
   const saved=!restart?findPartSession(snapshot.sessions,family):null;
   if(saved&&!saved.finished_at){
    const data=await api<{session:Session}>(undefined,'session='+encodeURIComponent(saved.id),'de');
    if(!mounted.current)return;
    if(isPartRound(data.session,family)&&data.session.answers.length<roundEnd(data.session)){
     if(!isOlderRound(data.session.questions)){openSession(data.session);return;}
     ids=continuationIds(family,data.session);
    }
   }
   const data=await api<{session:Session}>({action:'start',id:crypto.randomUUID(),mode:WORKSHOP_MODE,topic:WORKSHOP_TOPIC,count:ids.length,onlyIds:ids},'','de');
   if(!mounted.current)return;openSession(data.session);
  }catch(e){fail(e,'startError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 /** Every open mistake of the site in one round (Fiil Atölyesi, Nesne Kasası, Ev ve Yaşam; the learner asked). */
 async function startAllMistakes(){
  if(mutation.current||!allMistakes.length)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();speech.prepare();
  try{
   const data=await api<{session:Session}>({action:'start',id:crypto.randomUUID(),mode:MISTAKES_MODE,topic:'all',count:allMistakes.length,onlyIds:allMistakes},'','de');
   if(!mounted.current)return;setView(null);openSession(data.session);
  }catch(e){fail(e,'startError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 /** A round of the open mistakes (mixed so the same verb never comes twice in a row); answered wrong again, a question stays on the list. */
 async function startMistakes(){
  if(mutation.current||!mistakeIds.length)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();speech.prepare();
  try{
   const data=await api<{session:Session}>({action:'start',id:crypto.randomUUID(),mode:MISTAKES_MODE,topic:WORKSHOP_TOPIC,count:mistakeIds.length,onlyIds:mistakeIds},'','de');
   if(!mounted.current)return;setView(null);openSession(data.session);
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
   requestAnimationFrame(()=>{document.getElementById('object-feedback')?.focus({preventScroll:true});toPractice();});
  }catch(e){fail(e,'saveError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 function next(){
  if(mutation.current||!session||!feedback)return;stopFeedback();speech.prepare();const upcoming=index+1;setIndex(upcoming);clearAnswer();focusCurrent();
  if(upcoming>=end){answerAudio.complete();void refresh();}
 }
 // Leaving a verb's card stops its voice, so the question can start at once; the part card's button readies the voice for the verb's card.
 function dismiss(kind:'c'|'l'){if(kind==='l')speech.stop();else speech.prepare();setDismissed(previous=>new Set(previous).add(kind+':'+index));focusCurrent();}
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
  return <OptionText text={label.text} className={className+(label.german?'':' verb-option-meaning')} lang={label.german?'de':language} dir={label.german?'ltr':dir}/>;
 }
 function correctLabel(question:Question,item:Verb){
  const kind=question.verbTask??'';
  return kind==='praesens'||kind==='write-praesens'||kind==='perfekt'||kind==='write-perfekt'?item.subject+' '+question.answer:kind==='fit'?praesensForm(item):kind==='write-partizip'?question.answer:item.display;
 }
 // The round of every mistake (Yanlışlarım): Nesne Kasası and Ev ve Yaşam questions, drawn here in a simple way —
 // picture or word, the four choices, der/die/das, or a line to write; then the right answer and its meaning.
 const isHousingQuestion=(question:Question)=>question.topic.startsWith('book-11');
 function otherAnswer(question:Question){return isHousingQuestion(question)?(question as HousingExercise).resultDe:question.articlePuzzle?question.articlePuzzle.fullAnswer:question.answer;}
 function otherMeaning(question:Question){return isHousingQuestion(question)?housingMeaning(question as HousingExercise,language):question.objectId?objectMeaning(question.objectId,language):'';}
 function otherQuestion(question:Question){
  const housing=isHousingQuestion(question);const hq=question as HousingExercise;
  const listen=question.kind==='listen';const write=question.kind==='write';const articles=!!question.articlePuzzle;
  const title=housing?(write?housingText(language,question.gap?'gap':question.writingTask==='word'?'word':'sentence'):v('testDetail')):listen?v('listenPrompt'):articles?v('puzzleArticlePrompt'):write?v('writePrompt'):v('questionPrompt');
  const pictureOf=new Map((question.options??[]).map((option,i)=>[option,question.pictureOptions?.[i]]));
  const locked=!!feedback||actionDisabled||!!pendingAnswer.current;
  return <article className={'object-question panel mixed-question'+(feedback?' answered':'')}>
   <h1 id="object-question-heading" tabIndex={-1}>{title}</h1>
   {housing?<div className="housing-question-art"><RasterArt art={housingIllustration(hq)} title={v('questionImage')}/></div>:question.objectId&&!listen?<div className="object-picture"><ObjectArt id={question.objectId} title={otherMeaning(question)}/></div>:null}
   {housing&&<p className="housing-cue">{language==='de'?hq.cueDe:otherMeaning(question)}</p>}
   {question.gap&&<p className="vault-gap-sentence" lang="de" dir="ltr">{question.gap}</p>}
   {housing&&write&&question.wordBank&&<div className="housing-word-bank"><small>{housingText(language,'wordBank')}</small><p lang="de" dir="ltr">{question.wordBank.join(' · ')}</p></div>}
   {listen&&<div className="vault-listen-player"><div className="vault-listen-buttons"><button type="button" className="btn" disabled={actionDisabled} onClick={()=>hearQuestion()}><Volume2 size={20}/>{heardQuestionId===question.id?v('repeatAudio'):t('listenButton')}</button><button type="button" className="btn secondary" disabled={actionDisabled} onClick={()=>hearQuestion(true)}>{v('speechSlow')}</button></div></div>}
   {articles?<div className="article-bank" role="group" aria-label={v('puzzleArticlePrompt')} dir="ltr" lang="de">{['der','die','das'].map(value=><button type="button" key={value} className={'article-choice '+(feedback?(value===question.answer?'right':feedback.answer===value?'wrong':''):'')} disabled={locked} onClick={()=>void submit(value)}>{value}</button>)}</div>
   :write?<form className="vault-writing-form" onSubmit={event=>{event.preventDefault();void submit(String(new FormData(event.currentTarget).get('answer')??''));}}><label className="field-label" htmlFor="mixed-answer">{v('yourAnswer')}</label><input key={question.id} id="mixed-answer" name="answer" className="writing-input" lang="de" dir="ltr" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} maxLength={300} readOnly={!!feedback||!!pendingAnswer.current} disabled={actionDisabled}/>{!feedback&&<button type="submit" className="btn check-button" disabled={actionDisabled}>{v('checkAnswer')}</button>}</form>
   :<div className={'object-options picture-word-options'+(listen&&question.pictureOptions?' pictures vault-listening-options':'')} role="group" aria-labelledby="object-question-heading">{options.map((option,i)=>{const picture=listen?pictureOf.get(option):undefined;return <button key={option} type="button" className={'object-option '+(feedback&&option===question.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')} disabled={locked||(listen&&heardQuestionId!==question.id)} onClick={()=>void submit(option)}><span className="object-option-number">{String.fromCharCode(65+i)}</span>{picture?<div className="object-picture small"><ObjectArt id={picture} title={objectMeaning(picture,language)}/></div>:<OptionText text={option}/>}{feedback&&option===question.answer&&<CheckCircle2 size={20}/>}</button>;})}</div>}
   {busy&&!feedback&&<p className="picture-quiz-saving" role="status"><Loader2 size={16} className="spinner"/>{v('savingAnswer')}</p>}
   {feedback&&<div id="object-feedback" tabIndex={-1} className={'object-feedback '+(feedback.correct?'success':'retry')} role="status" aria-live="polite">
    <h2>{feedback.correct?<CheckCircle2 size={23}/>:<X size={23}/>} {v(feedback.correct?'correct':write?'wrongAnswer':'wrong')}</h2>
    <p>{v('correctAnswer')}: <strong lang="de" dir="ltr">{otherAnswer(question)}</strong></p>
    {otherMeaning(question)&&<p className="housing-translation">{otherMeaning(question)}</p>}
    {!feedback.correct&&<p>{v('yourAnswer')}: <span lang="de" dir="ltr">{feedback.answer}</span></p>}
    <div className="object-actions"><button type="button" className="btn secondary small" disabled={busy||cueBusy} onClick={()=>speech.speak(pronunciation)}><Volume2 size={18}/>{v('repeatAudio')}</button><button type="button" className="btn object-next" disabled={busy} onClick={next}>{v(index+1===end?'viewResults':'nextQuestion')}<ArrowRight size={18} className="vault-direction-icon"/></button></div>
   </div>}
  </article>;
 }
 /** The forms shown after an answer: only what the stage teaches (meaning: the verb; Perfekt: sie/er hat/ist …). */
 function verbForms(item:Verb,task?:VerbTask){
  const stage=learnStage(task);
  return <span className="verb-forms"><span className="verb-forms-german" lang="de" dir="ltr"><strong>{item.display}</strong>{(task==='partizip'||task==='write-partizip')&&<> → {item.participle}</>}{stage==='perfekt'&&<> — {item.subject} {perfektLabel(item)}</>}{stage==='praesens'&&<> — {item.subject} {item.praesens}</>}</span><span className="verb-forms-meaning" lang={language} dir={dir}>{verbMeaning(item,language)}</span></span>;
 }
 function heading(question:Question){
  const kind=question.verbTask;
  return kind==='meaning'?t('promptMeaning'):kind==='word'?t('promptWord'):kind==='partizip'?t('promptPartizip'):kind==='fit'?t('promptFit'):kind==='praesens'?t('promptPraesens'):kind==='perfekt'?t('promptPerfekt'):kind==='write-partizip'?t('writePartizip'):kind==='write'?t('writeInfinitive'):kind==='write-praesens'?t('gapPraesens'):kind==='write-perfekt'?t('gapPerfekt'):kind==='hear'?t('listenMeaning'):t('listenVerb');
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
  // Pictures give the answer away: hidden until the answer for the meaning and listening questions.
  const showPicture=(kind!=='meaning'&&kind!=='hear'&&kind!=='hear-perfekt')||!!feedback;
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
  // Meaning questions: no conjugated example sentences, only the word and its meaning.
  return [];
 }
 const errorText=(key:ErrorKey)=>key==='verbLegacy'?t('legacyError'):v(key);
 const writing=q?.kind==='write';const listening=q?.kind==='listen';
 // A test answer opens the result card in place of the question; a spelling answer keeps the puzzle with a short note.
 const answered=!!feedback&&!writing;
 const overall=ready?verbProgress('verbs-all',snapshot.reviews):null;
 const verbsDone=ready?learnedVerbs('verbs-all',snapshot.reviews):null;
 // "Fiil Atölyesi" → first word plain, the rest in the accent colour.
 const titleWords=(()=>{const words=t('workshopTitle').split(' ');return {head:words[0],tail:words.slice(1).join(' ')};})();

 return <div className="category-app object-app toon-app picture-quiz-app vault-app verb-app" lang={language} dir={dir}>
  <a className="skip-link" href="#object-main">{v('skipContent')}</a>
  <SiteHeader language={language} languages={vaultLanguages} onLanguage={value=>{if(isVaultLanguage(value)){stopFeedback();onLanguage(value);}}} homeHref="/?learn=de" homeLabel={v('home')} stats={snapshot.stats} guest={guest}/>
  <div className="work-layout site-layout"><SiteMenuAside language={language} current={section==='games'?'games':section==='mistakes'?'mistakes':'verbs'}/>
  <main id="object-main" className="object-page">
   <div className="object-breadcrumb"><a href="/?learn=de">{v('home')}</a><ChevronRight size={14} className="vault-direction-icon"/>{part?<span>{t(part==='games'?'gamesTitle':'mistakesTitle')}</span>:section?<><a href="/fiiller" onClick={event=>{event.preventDefault();closeSection();}}>{t('workshopTitle')}</a><ChevronRight size={14} className="vault-direction-icon"/><span>{t(section==='games'?'gamesTitle':'mistakesTitle')}</span></>:<span>{t('workshopTitle')}</span>}</div>
   {guest&&<GuestBanner language={language} back={back}/>}
   {error&&<div className="object-alert" role="alert"><p>{errorText(error)}</p>{signIn?<a href="/auth/login" className="btn">{v('signIn')}</a>:pendingAnswer.current?<button type="button" className="btn secondary small" disabled={busy} onClick={()=>void submit(pendingAnswer.current!.answer)}>{v('saveRetry')}</button>:<button type="button" className="btn secondary small" disabled={busy} onClick={()=>{setError(null);void refresh();}}>{v('retry')}</button>}</div>}
   {speech.warning&&<p className="object-alert" role="status">{language==='tr'?speech.warning:v('audioWarning')}</p>}
   {session?finished?<section className="object-results panel verb-results">
    <h1 id="object-question-heading" tabIndex={-1}>{workshop?t('partDone',{n:roundFamily.number,total:roundFamily.verbs.length}):mistakesRound?t('mistakesTitle'):v('resultsTitle')}</h1><p className="vault-result-score">{v('resultScore',{correct:session.answers.filter(a=>a.correct).length,total:end})}</p>
    <RoundReward answers={session.answers} progress={ready?verbProgress('verbs-all',snapshot.reviews):null} language={language} label={t('workshopTitle')}/>
    {guest&&<GuestMore language={language} back={back}/>}
    {mistakesRound&&!(everyMistake?allMistakes:mistakeIds).length&&<p className="verb-mistakes-done" role="status"><CheckCircle2 size={18}/>{t('mistakesAllDone')}</p>}
    <div className="object-actions">{everyMistake?allMistakes.length>0&&<button type="button" className="btn" disabled={busy} onClick={()=>void startAllMistakes()}><RotateCcw size={18}/>{t('mistakesAllStart',{n:allMistakes.length})}</button>:mistakesRound?mistakeIds.length>0&&<button type="button" className="btn" disabled={busy} onClick={()=>void startMistakes()}><RotateCcw size={18}/>{t('mistakesLeft',{n:mistakeIds.length})}</button>:<button type="button" className="btn" disabled={busy} onClick={()=>void enterPart(roundFamily,true)}><RotateCcw size={18}/>{t('workshopRestart')}</button>}<button type="button" className="btn secondary" disabled={busy} onClick={overview}>{t('backWorkshop')}</button></div>
    {session.answers.filter(a=>!a.correct).map(a=>{const item=lookup(a.question_id);const target=item?.verbId?verbMap.get(item.verbId):undefined;return item&&target?<div className="object-result-row verb-result-row" key={a.id}><div>{verbForms(target,item.verbTask)}<small>{v(item.kind==='write'?'yourAnswer':'yourChoice')}: {optionLabel(item,a.answer,'verb-result-answer')}</small></div></div>:item?<div className="object-result-row verb-result-row" key={a.id}><div><strong lang="de" dir="ltr">{otherAnswer(item)}</strong> <span className="verb-forms-meaning">{otherMeaning(item)}</span><small>{v(item.kind==='write'?'yourAnswer':'yourChoice')}: <span lang="de" dir="ltr">{a.answer}</span></small></div></div>:null;})}
   </section>:q&&verb?<section className="object-practice picture-quiz-practice verb-practice">
    <div className="object-practice-top"><span className="object-pill">{t('workshopTitle')}</span><span>{v('progress',{n:index+1,total:end})}</span>{!guest&&<button type="button" className={'housing-star'+(starred.has(q.id)?' active':'')} aria-pressed={starred.has(q.id)} aria-label={v(starred.has(q.id)?'unstar':'star')} title={v(starred.has(q.id)?'unstar':'star')} disabled={starBusy} onClick={()=>void toggleStar(q.id)}><Star size={20} fill={starred.has(q.id)?'currentColor':'none'}/></button>}<button type="button" className="object-exit" disabled={busy} onClick={overview} aria-label={v('exitTest')}><X size={20}/></button></div>
    <progress max={end} value={index} aria-label={v('progress',{n:index+1,total:end})}/>
    {place&&<PathStepper place={place} language={language}/>}
    {overlay==='learn'&&place?<LearnCard verb={verb} stage={place.stage} language={language} speech={{speak:text=>speech.speak(text),busy:speech.busy||cueBusy}} onContinue={()=>dismiss('l')}/>:
    <article className={'object-question panel verb-question'+(answered?' answered':'')}>
     <h1 id="object-question-heading" tabIndex={-1} className={answered?'verb-hidden-heading':undefined}>{heading(q)}</h1>
     {answered&&feedback?<AnswerResult verb={verb} stage={learnStage(q.verbTask)} language={language} speech={{speak:text=>speech.speak(text),busy:speech.busy||cueBusy}} correct={!!feedback.correct} status={v(feedback.correct?'correct':'wrong')} chosen={feedback.correct?undefined:<>{v('yourChoice')}: {optionLabel(q,feedback.answer,'verb-result-answer')}</>} spoken={pronunciation} nextLabel={v(index+1===end?'viewResults':listening?'nextListening':'nextQuestion')} onNext={next} busy={busy} past={q.verbTask==='partizip'}/>:<>
     {!listening&&promptCard(q,verb)}
     {listening&&<div className="vault-listen-player"><Headphones size={32} aria-hidden="true"/><div className="vault-listen-buttons"><button type="button" className="btn" disabled={actionDisabled} onClick={()=>hearQuestion()}><Volume2 size={20}/>{heardQuestionId===q.id?v('repeatAudio'):t('listenButton')}</button><button type="button" className="btn secondary" disabled={actionDisabled} onClick={()=>hearQuestion(true)}>{v('speechSlow')}</button></div><p role="status">{speech.busy?v('listenPlaying'):heardQuestionId===q.id?t('listenChoose'):t('listenFirst')}</p></div>}
     {writing?<>
      {task==='write-perfekt'&&<div className="verb-aux"><span className="verb-aux-label">{t('helperVerb')}</span><div className="article-bank" role="group" aria-label={t('helperVerb')} dir="ltr" lang="de">{(['hat','ist'] as const).map(value=>{const right=value===verb.aux||(verb.alsoIst&&value==='ist');return <button type="button" key={value} className={'article-choice verb-aux-choice '+(aux===value?'selected ':'')+(feedback?(right&&(aux===value||!feedback.correct)?'right':aux===value?'wrong':''):'')} aria-pressed={aux===value} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>{setAux(value);setAuxWarning(false);if(selected&&!feedback)void submit(value+' '+selected);}}>{value}</button>;})}</div>{auxWarning&&!aux&&<p className="verb-aux-warning" role="alert">{t('helperMissing')}</p>}</div>}
      {task==='write-praesens'&&verbPrefix(verb)&&<div className="verb-aux"><span className="verb-aux-label">{t('prefixChoice')}</span><div className="article-bank" role="group" aria-label={t('prefixChoice')} dir="ltr" lang="de">{prefixOptions(verb).map(value=>{const right=value===verbPrefix(verb);return <button type="button" key={value} className={'article-choice verb-aux-choice '+(prefix===value?'selected ':'')+(feedback?(right&&(prefix===value||!feedback.correct)?'right':prefix===value?'wrong':''):'')} aria-pressed={prefix===value} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>{setPrefix(value);setPrefixWarning(false);if(selected&&!feedback)void submit(selected+' '+value);}}>{value}</button>;})}</div>{prefixWarning&&!prefix&&<p className="verb-aux-warning" role="alert">{t('prefixMissing')}</p>}</div>}
      <LetterPuzzle key={session.id+':'+q.id} answer={task==='write-perfekt'?verb.participle:task==='write-praesens'?praesensStem(verb):task==='write'?verb.display:q.answer} storageKey={'lernkoko-puzzle:'+session.id+':'+q.id} language={language} course="de" onChange={setSelected} onSubmit={answer=>{
       if(task==='write-perfekt'){if(!aux){setAuxWarning(true);return;}void submit(aux+' '+answer);}
       else if(task==='write-praesens'&&verbPrefix(verb)){if(!prefix){setPrefixWarning(true);return;}void submit(answer+' '+prefix);}
       else void submit(answer.replace('|',''));
      }} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined} strictCase={q.strictCase}/>
     </>:<div className={'object-options picture-word-options verb-options'+(listening?' verb-listen-options':'')} role="group" aria-labelledby="object-question-heading">{options.map((option,i)=><button key={option} type="button" className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')+(!feedback&&selected===option?'selected':'')} disabled={!!feedback||actionDisabled||!!pendingAnswer.current||(listening&&heardQuestionId!==q.id)} onClick={()=>void submit(option)}><span className="object-option-number">{String.fromCharCode(65+i)}</span>{optionLabel(q,option)}{feedback&&option===q.answer&&<CheckCircle2 size={20}/>}</button>)}</div>}
     {busy&&!feedback&&<p className="picture-quiz-saving" role="status"><Loader2 size={16} className="spinner"/>{v('savingAnswer')}</p>}
     {feedback&&writing&&<div id="object-feedback" tabIndex={-1} className={'object-feedback verb-write-feedback '+(feedback.correct?'success':'retry')} role="status" aria-live="polite">
      <h2>{feedback.correct?<CheckCircle2 size={23}/>:<X size={23}/>} {v(feedback.correct?'correct':writing?'wrongAnswer':'wrong')}</h2>
      <p className="verb-write-answer">{v('correctAnswer')}: <strong lang="de" dir="ltr">{correctLabel(q,verb)}</strong><button type="button" className="verb-result-speak" disabled={busy||cueBusy} aria-label={v('repeatAudio')} title={v('repeatAudio')} onClick={()=>speech.speak(pronunciation)}><Volume2 size={18}/></button></p>
      {!feedback.correct&&<p>{v('yourAnswer')}: <span lang="de" dir="ltr">{feedback.answer}</span></p>}
      {!feedback.correct&&<RuleBox lines={feedbackRules(q,verb)} language={language}/>}
      {verb.alsoIst&&learnStage(q.verbTask)==='perfekt'&&<p className="verb-note">{t('liegenNote',{verb:'ist '+verb.participle})}</p>}
      <button type="button" className="btn object-next" disabled={busy} onClick={next}>{v(index+1===end?'viewResults':'nextPuzzle')}<ArrowRight size={18} className="vault-direction-icon"/></button>
     </div>}
     </>}
    </article>}
   </section>:q&&everyMistake?<section className="object-practice picture-quiz-practice verb-practice mixed-practice">
    <div className="object-practice-top"><span className="object-pill">{isHousingQuestion(q)?housingText(language,'title'):v('vaultTitle')}</span><span>{v('progress',{n:index+1,total:end})}</span><button type="button" className="object-exit" disabled={busy} onClick={overview} aria-label={v('exitTest')}><X size={20}/></button></div>
    <progress max={end} value={index} aria-label={v('progress',{n:index+1,total:end})}/>
    {otherQuestion(q)}
   </section>:<p role="alert">{v('missingQuestion')} <button type="button" className="text-button" onClick={overview}>{t('backWorkshop')}</button></p>:
   game?<VerbGame game={game} language={language} topic={gameTopic} onTopic={setGameTopic} onExit={()=>{setGame(null);focus(section?'verb-section-heading':'vault-heading');}} feedback={{answer:answerAudio.answer,stop:answerAudio.stop,complete:answerAudio.complete,busy:cueBusy||speech.busy,speak:text=>speech.speak(text),prepare:()=>speech.prepare()}}/>:
   section==='games'?<section className="verb-section" aria-labelledby="verb-section-heading" data-verb-section="games">
    <div className="verb-section-head">{!part&&<button type="button" className="text-button verb-back" onClick={closeSection}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{t('backWorkshop')}</button>}<h1 id="verb-section-heading" tabIndex={-1}>{t('gamesTitle')}</h1></div>
    <div className="game-cards verb-section-games">{gameIds.map(id=>guest&&!GUEST_GAMES.includes(id)?<a key={id} className={'game-card game-'+id+' guest-locked'} href={guestSignUp(back)} data-verb-game-card={id} data-guest-locked><GameIcon game={id}/><span className="game-card-text"><strong>{gameName(id,language)}</strong><small>{guestText(language,'guestLocked')}</small></span><span className="game-card-meta">{GAME_LEVEL} · {gameLength(id,language)}</span><span className="game-card-play"><Lock size={16} aria-hidden="true"/>{t('play')}</span></a>:<button type="button" key={id} className={'game-card game-'+id} data-verb-game-card={id} disabled={busy} onClick={()=>{stopFeedback();setGame(id);focus('verb-game-heading');}}><GameIcon game={id}/><span className="game-card-text"><strong>{gameName(id,language)}</strong><small>{gameDetail(id,language)}</small></span><span className="game-card-meta">{GAME_LEVEL} · {gameLength(id,language)}</span><span className="game-card-play"><Play size={16} aria-hidden="true"/>{t('play')}</span></button>)}</div>
   </section>:
   section==='mistakes'&&guest?<section className="verb-section" data-verb-section="mistakes">
    <div className="verb-section-head">{!part&&<button type="button" className="text-button verb-back" onClick={closeSection}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{t('backWorkshop')}</button>}<h1 id="verb-section-heading" tabIndex={-1}>{t('mistakesTitle')}</h1></div>
    <GuestMore language={language} back={back}/>
   </section>:
   section==='mistakes'?<section className="verb-section" data-verb-section="mistakes">
    <div className="verb-section-head">{!part&&<button type="button" className="text-button verb-back" onClick={closeSection}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{t('backWorkshop')}</button>}</div>
     <article className="panel verb-mistakes" aria-labelledby="verb-section-heading" data-verb-mistakes={mistakeIds.length}>
     <div className="verb-mistakes-head"><h1 id="verb-section-heading" tabIndex={-1}>{t('mistakesTitle')}</h1><PaulHoca pose="think" sound="appear"/></div>
     {/* Every part's mistakes on one page (the learner asked): Fiil Atölyesi here, then Nesne Kasası and Ev ve Yaşam. */}
     <p className="verb-mistakes-all">{t('mistakesAllLead')}</p>
     {allMistakes.length>0&&<button type="button" className="btn mistakes-all-start" disabled={busy||!ready} onClick={()=>void startAllMistakes()} data-mistakes-all-start={allMistakes.length}><RotateCcw size={20}/>{t('mistakesAllStart',{n:allMistakes.length})}</button>}
     <h2 className="mistake-part-title"><NavIcon name="verbs"/>{t('workshopTitle')}{mistakeIds.length>0&&<span className="verb-mistakes-count">{mistakeIds.length}</span>}</h2>
     {mistakeIds.length>0?<>
      <p className="verb-mistakes-lead">{t('mistakesLead',{n:mistakeIds.length})}</p>
      <ul className="verb-mistakes-verbs">{mistakeVerbList.slice(0,10).map(item=><li key={item.id}><img src={verbPicture(item)??''} alt="" width={40} height={40} loading="lazy" decoding="async"/><span lang="de" dir="ltr" className={kindClass(item)}>{item.display}</span></li>)}{mistakeVerbList.length>10&&<li className="more">+{mistakeVerbList.length-10}</li>}</ul>
      <button type="button" className="btn verb-mistakes-start" disabled={busy||!ready} onClick={()=>void startMistakes()} data-verb-mistakes-start=""><RotateCcw size={18}/>{t('mistakesStart')}</button>
     </>:<p className="verb-mistakes-none"><CheckCircle2 size={18} aria-hidden="true"/>{ready?t('mistakesNone'):v('loading')}</p>}
    </article>
    {ready&&otherMistakes&&<div className="mistake-parts">
     <article className="panel mistake-part" data-mistake-part="vault" data-mistakes={otherMistakes.vault.count}>
      <h2 className="mistake-part-title"><NavIcon name="vault"/>{v('vaultTitle')}{otherMistakes.vault.count>0&&<span className="verb-mistakes-count">{otherMistakes.vault.count}</span>}</h2>
      {otherMistakes.vault.count>0?<>
       <ul className="mistake-words" lang="de" dir="ltr">{otherMistakes.vault.words.slice(0,12).map(word=><li key={word}>{word}</li>)}{otherMistakes.vault.words.length>12&&<li className="more">+{otherMistakes.vault.words.length-12}</li>}</ul>
       <a className="btn secondary" href="/ev-esyalar?learn=de&tekrar=1" data-mistake-open="vault"><RotateCcw size={18}/>{t('mistakesOpen')}</a>
      </>:<p className="verb-mistakes-none"><CheckCircle2 size={18} aria-hidden="true"/>{t('mistakesNoneHere')}</p>}
     </article>
     <article className="panel mistake-part" data-mistake-part="housing" data-mistakes={otherMistakes.housing.count}>
      <h2 className="mistake-part-title"><NavIcon name="units"/>{housingText(language,'title')}{otherMistakes.housing.count>0&&<span className="verb-mistakes-count">{otherMistakes.housing.count}</span>}</h2>
      {otherMistakes.housing.count>0?<>
       <p className="verb-mistakes-lead">{t('mistakesCount',{n:otherMistakes.housing.count})}</p>
       <a className="btn secondary" href="/a1-2/ev-ve-yasam?tekrar=1" data-mistake-open="housing"><RotateCcw size={18}/>{t('mistakesOpen')}</a>
      </>:<p className="verb-mistakes-none"><CheckCircle2 size={18} aria-hidden="true"/>{t('mistakesNoneHere')}</p>}
     </article>
    </div>}
   </section>:
   view?(()=>{
    const part=parts.find(item=>item.family.id===view.family.id)??parts[0];const members=part.family.verbs.map(id=>verbMap.get(id)!);
    const at=view.verbId?members.findIndex(item=>item.id===view.verbId):-1;
    if(at>=0){const item=members[at];return <VerbDetail verb={item} family={part.family} position={at+1} total={members.length} marks={stickers.get(item.id)} language={language} speech={{speak:text=>speech.speak(text),busy:speech.busy||cueBusy}} onBack={()=>openPart(part.family)} onPrev={at>0?()=>openVerb(part.family,members[at-1].id):undefined} onNext={at<members.length-1?()=>openVerb(part.family,members[at+1].id):undefined}/>;}
    return <PartVerbs family={part.family} part={part} verbs={members} marks={stickers} language={language} disabled={busy||!ready} onStart={restart=>void enterPart(part.family,restart)} onOpen={item=>openVerb(part.family,item.id)} onBack={closeView}/>;
   })():
   <section className="verb-home" aria-labelledby="vault-heading" data-verb-workshop="">
    {/* Only the title on top (the learner removed the "0 / 19 fiil" card): the pencil badge of the menu, the title in
        the site's navy with a gold wavy line under "Atölyesi", and the count of verbs and parts. The map below shows
        where the learner is ("Buradasın!"). */}
    <div className="verb-hero only-title">
     <span className="verb-hero-badge" aria-hidden="true"><NavIcon name="verbs"/></span>
     <div className="verb-hero-words">
      <h1 id="vault-heading" tabIndex={-1} className="verb-hero-title">{titleWords.head}{titleWords.tail&&<> <span className="k">{titleWords.tail}</span></>}</h1>
      <p className="verb-hero-sub">{t('verbsCount',{n:workshopVerbs.length})} · {t('partsCount',{n:parts.length})}</p>
     </div>
    </div>
    <section className="verb-map" aria-labelledby="verb-map-heading">
     <h2 id="verb-map-heading" className="verb-map-title">{t('mapTitle')}</h2>
     <svg className="verb-map-path" viewBox="0 0 1130 1180" preserveAspectRatio="none" aria-hidden="true"><path d="M200 120 C 500 160, 700 180, 820 300 S 300 520, 310 640 S 900 820, 830 960 S 420 1100, 300 1140" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeDasharray="2 30" opacity=".9"/></svg>
     {parts.map(part=>{
      const family=part.family;
      // Every part is open: the one in progress is marked, finished parts get a check, none has a lock.
      const state=part.finished?'done':family.id===path.family.id&&!path.finished?'current':'';
      const members=family.verbs.map(id=>verbMap.get(id)!);
      const locked=guest&&family.id!==GUEST_VERB_PART;
      return <article key={family.id} className={'verb-island tone-'+family.tone+' '+state+(locked?' guest-locked':'')} style={{'--p':part.percent} as CSSProperties} data-verb-island={family.id}>
       {state==='current'&&<span className="verb-here"><Compass size={15} aria-hidden="true"/>{t('hereBadge')}</span>}
       {state==='done'&&<span className="verb-lock done" aria-hidden="true"><CheckCircle2 size={20}/></span>}
       <span className="verb-island-number">{family.number}</span>
       <div className="verb-island-text">
        <h3 lang="de" dir="ltr">{familyTitle(family,language)}</h3>
        <p>{t('verbsCount',{n:family.verbs.length})} · {t('stageMeanings')} {part.meaningDone}/{family.verbs.length} · {t('stepPerfekt')} {part.perfektDone}/{family.verbs.length}</p>
        <div className="verb-island-pics">{members.slice(0,4).map(item=><img key={item.id} src={verbPicture(item)??''} alt="" width={96} height={96} loading="lazy" decoding="async"/>)}</div>
        {locked?<GuestLock language={language} back={back} className="verb-island-go"/>:<button type="button" className="verb-island-go" onClick={()=>openPart(family)} data-verb-island-go={family.id}>{t('partOpen',{n:family.number})}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
       </div>
       <span className="verb-ring" data-v={part.percent+'%'}/>
      </article>;
     })}
    </section>
    <article className="panel verb-collection">
     <h2>{t('collectionTitle')}</h2><p className="verb-collection-lead">{t('collectionLead')}</p>
     {/* Two counts, each with its own name: whole verbs learned and single exercises done (the learner asked). */}
     {overall&&verbsDone&&<p className="verb-collection-counts"><span>{t('verbsLearned',{n:verbsDone.learned,total:verbsDone.total})}</span><span>{progressText(language,'learned',{n:overall.learned,total:overall.total})}</span></p>}
     <div className="verb-stickers">{workshopVerbs.map(item=>{const done=stickers.get(item.id);return <img key={item.id} className={done?.perfekt?'got full':done?.meaning?'got':'missing'} src={verbPicture(item)??''} alt={item.display} title={item.display+(done?.perfekt?' · '+perfektLabel(item):'')} width={96} height={96} loading="lazy" decoding="async"/>;})}</div>
    </article>
    <details className="verb-list verb-fold"><summary><span>{t('verbList')} · {verbs.length}</span><ChevronDown className="verb-fold-icon" size={20} aria-hidden="true"/></summary>
     <ol className="verb-list-rows">{verbs.map(item=><li key={item.id}><span className="verb-list-number">{item.number}</span><VerbPicture verb={item} language={language} small/><button type="button" className="verb-speak" disabled={speech.busy} aria-label={t('listenRow',{verb:item.display})} title={t('listenRow',{verb:item.display})} onClick={()=>speech.speak(verbRowSpeech(item))}><Volume2 size={17}/></button><span className="verb-list-word"><strong lang="de" dir="ltr" className={kindClass(item)}>{item.display}</strong><span lang={language} dir={dir}>{verbMeaning(item,language)}</span></span><span className="verb-list-forms" lang="de" dir="ltr"><span>{item.subject} {item.praesens}</span><span>{item.subject} {perfektLabel(item)}</span></span></li>)}</ol>
    </details>
   </section>}
  </main></div><StartWait show={busy&&!session} text={v('preparing')}/><SiteFooter language={language}/>
 </div>;
}
