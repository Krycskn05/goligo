'use client';
import {SITE_NAME} from '@/lib/site-brand';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronRight,Headphones,House,Loader2,RotateCcw,Star,Volume2,X} from 'lucide-react';
import {gradeAnswer,questionMap,type Question} from '@/lib/course';
import {objectGroups,objectVocabulary,objectWordMap,type ObjectWord} from '@/lib/object-course';
import {objectSubgroups,subgroupName,inObjectSubgroup} from '@/lib/object-subgroups';
import {isObjectPictureQuestion,isObjectWritingQuestion,isObjectListeningQuestion,isObjectMistake,isObjectSolved,pickObjectListeningQuiz,pickObjectWritingQuiz,pickPictureQuiz,type ObjectPickOptions,type PictureQuizSize} from '@/lib/object-practice';
import {starNoteKey,starredQuestionIds,type Answer,type Session,type Snapshot} from '@/lib/study';
import {api,useGermanSpeech,useAnswerFeedback} from './study-shared';
import {ObjectArt,HeroArt} from './toon-art';
import {objectMeaning} from '@/lib/object-translations';
import {vaultLanguages,isVaultLanguage,vaultDirection,vaultText,type VaultLanguage,type VaultCopyKey} from '@/lib/object-vault-copy';
import {readVaultLanguage,saveVaultLanguage} from '@/lib/vault-language-preference';
import {useLanguageSwitch} from './language-switch';
import {PracticeModes} from './practice-modes';
import {LetterPuzzle} from './letter-puzzle';
import {ArticlePuzzle} from './article-puzzle';
import {isArticleChallenge,articleNoun,articleFullAnswer,articleChallengeKind} from '@/lib/article-challenges';
import type {PracticeMode} from '@/lib/writing-practice';
import {englishObjectName,isEnglishObjectPictureQuestion,isEnglishObjectWritingQuestion,isEnglishObjectListeningQuestion,pickEnglishObjectQuiz} from '@/lib/english-objects';
import {ENGLISH_COURSE_ENABLED,activeLearningLanguage,learningText,saveLearningLanguage,type LearningLanguage} from '@/lib/learning-language';
import {isStudyLanguage} from '@/lib/study-languages';
import {CourseSelector} from './course-selector';
import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';
import {objectProgress} from '@/lib/progress';
import {ProgressMeter,RoundReward} from './progress-ui';
import {articleRule,articleRuleText,puzzleText} from '@/lib/article-logic';

const blank:Snapshot={reviews:[],notes:{},sessions:[]};
const groupKeys:Record<string,VaultCopyKey>={'objects-house':'groupHouse','objects-furniture':'groupFurniture','objects-kitchen':'groupKitchen','objects-cleaning':'groupCleaning','objects-tools':'groupTools','objects-building':'groupBuilding','objects-nature':'groupNature','objects-moving':'groupMoving'};
const groupImages:Record<string,string>={'objects-house':'dach','objects-furniture':'sessel','objects-kitchen':'teekanne','objects-cleaning':'putzeimer','objects-tools':'bohrmaschine','objects-building':'schubkarre','objects-nature':'kaktus','objects-moving':'karton'};
function categoryName(group:string,language:VaultLanguage){return group==='all'?vaultText(language,'allObjects'):groupKeys[group]?vaultText(language,groupKeys[group]):objectGroups.find(item=>item.id===group)?.title??group;}
function CategoryArt({group,title}:{group:string;title:string}){
 if(group==='all'||group==='resume')return <HeroArt variant={group==='all'?'objects':'course'} alt={title}/>;
 const id=groupImages[group]??objectVocabulary.find(word=>word.topic===group)?.id;
 return id?<ObjectArt id={id} title={title}/>:null;
}
function ObjectPicture({word,language,small=false,concealed=false}:{word:ObjectWord;language:VaultLanguage;small?:boolean;concealed?:boolean}){
 return <div className={'object-picture '+(small?'small':'')}><ObjectArt id={word.id} title={concealed?vaultText(language,'questionImage'):objectMeaning(word.id,language)}/></div>;
}
export function ObjectAnswerMeaning({word,language,course='de'}:{word:ObjectWord;language:VaultLanguage;course?:LearningLanguage}){
 return <span className="object-answer-meaning"><strong lang={course} dir="ltr">{course==='en'?englishObjectName(word.id):word.de}</strong><span className="object-meaning-divider" aria-hidden="true">—</span><span className="object-answer-translation" lang={language} dir={vaultDirection(language)}>{course==='en'&&language==='de'?word.de:objectMeaning(word.id,language)}</span></span>;
}
export default function ObjectStudy(){
 const [language,setLanguage]=useState<VaultLanguage>('tr');const [course,setCourse]=useState<LearningLanguage>('de');const [languageReady,setLanguageReady]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{let saved:VaultLanguage|null=null;try{saved=readVaultLanguage(localStorage);setCourse(activeLearningLanguage(localStorage,window.location.search));}catch{}if(saved)switchLanguage(saved,()=>setLanguageReady(true));else setLanguageReady(true);},[switchLanguage]);
 useEffect(()=>{if(!languageReady)return;try{saveVaultLanguage(localStorage,language);saveLearningLanguage(localStorage,course);}catch{}},[language,course,languageReady]);
 function changeCourse(value:LearningLanguage){window.speechSynthesis?.cancel();setCourse(value);const url=new URL(window.location.href);url.searchParams.set('learn',value);url.searchParams.delete('session');window.history.replaceState(null,'',url);}
 return languageReady?<ObjectWorkshop key={course} language={language} onLanguage={switchLanguage} course={course} onCourse={ENGLISH_COURSE_ENABLED?changeCourse:undefined}/>:<div className="course-loading" role="status">{SITE_NAME}…</div>;
}
export function ObjectWorkshop({language,onLanguage,course='de',onCourse}:{language:VaultLanguage;onLanguage:(value:VaultLanguage)=>void;course?:LearningLanguage;onCourse?:(value:LearningLanguage)=>void}){
 const text=(key:VaultCopyKey,params?:Record<string,string|number>)=>vaultText(language,key,params,course);
 const isPicture=course==='en'?isEnglishObjectPictureQuestion:isObjectPictureQuestion;
 const isWriting=course==='en'?isEnglishObjectWritingQuestion:isObjectWritingQuestion;
 const isListening=course==='en'?isEnglishObjectListeningQuestion:isObjectListeningQuestion;
 const modePredicate=(mode:string)=>mode==='write'?isWriting:mode==='listen'?isListening:isPicture;
 const pickPicture=course==='en'?(group:string,count:number|'all',reviews:Snapshot['reviews'],reviewOnly=false,onlyIds?:string[],_options?:ObjectPickOptions)=>pickEnglishObjectQuiz(group,count,reviews,reviewOnly,onlyIds):pickPictureQuiz;
 const pickWriting=course==='en'?(group:string,count:number|'all',reviews:Snapshot['reviews'],reviewOnly=false,onlyIds?:string[],_options?:ObjectPickOptions)=>pickEnglishObjectQuiz(group,count,reviews,reviewOnly,onlyIds,true):pickObjectWritingQuiz;
 const pickListening=course==='en'?(group:string,count:number|'all',reviews:Snapshot['reviews'],reviewOnly=false,onlyIds?:string[],_options?:ObjectPickOptions)=>pickEnglishObjectQuiz(group,count,reviews,reviewOnly,onlyIds,false,true):pickObjectListeningQuiz;
 const topicPrefix=course==='en'?'en-objects-':'objects-';
 const [snapshot,setSnapshot]=useState<Snapshot>(blank);
 const [ready,setReady]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState<VaultCopyKey|null>(null);const [signIn,setSignIn]=useState(false);
 const [initializing,setInitializing]=useState(true);
 const [practiceMode,setPracticeMode]=useState<PracticeMode>('test');
 const [view,setView]=useState<'categories'|'configure'>('categories');const [group,setGroup]=useState('all');const [subgroup,setSubgroup]=useState('all');const [count]=useState<PictureQuizSize>('all');
 const [requestedResume,setRequestedResume]=useState<string|null>(null);
 const [session,setSession]=useState<Session|null>(null);const [index,setIndex]=useState(0);
 const [feedback,setFeedback]=useState<Answer|null>(null);const [selected,setSelected]=useState('');
 const [heardQuestionId,setHeardQuestionId]=useState<string|null>(null);const [starBusy,setStarBusy]=useState(false);
 const [nounArticle,setNounArticle]=useState('');const [articleWarning,setArticleWarning]=useState(false);const [showHint,setShowHint]=useState(false);
 const speech=useGermanSpeech(course);const answerAudio=useAnswerFeedback(speech);const cueBusy=answerAudio.busy;
 const mutation=useRef(false);const mounted=useRef(true);
 const pendingStart=useRef<{key:string;id:string;ids:string[];topic:string}|null>(null);
 const pendingAnswer=useRef<{questionId:string;answer:string}|null>(null);
 const reviews=snapshot.reviews.filter(r=>modePredicate(practiceMode)(questionMap.get(r.question_id)));
 const candidate=session?.questions[index]?questionMap.get(session.questions[index].id):undefined;
 const q=modePredicate(session?.mode??'visual')(candidate)?candidate:undefined;
 const currentWord=q?.objectId?objectWordMap.get(q.objectId):undefined;
 const articleQuestion=course==='de'&&q&&isArticleChallenge(q)?q:undefined;
 const pronunciation=articleQuestion?articleFullAnswer(articleQuestion):currentWord?(course==='en'?englishObjectName(currentWord.id):currentWord.de):q?.answer??'';
 const finished=!!session&&index>=session.questions.length;
 const latest=snapshot.sessions.find(s=>s.topic.startsWith(topicPrefix)&&['visual','write','listen'].includes(s.mode)&&!s.finished_at);
 const resumeId=requestedResume??latest?.id??snapshot.activePictureSessionId;
 const resumeSummary=snapshot.sessions.find(s=>s.id===resumeId);
 const scopedQuestions=Array.from(questionMap.values()).filter(item=>modePredicate(practiceMode)(item)&&(group==='all'||item.topic===(course==='en'?'en-':'')+group)&&inObjectSubgroup(item,subgroup));
 const availableCount=scopedQuestions.length;
 const selectedSubgroup=objectSubgroups.find(item=>item.id===subgroup);
 // Review = mistakes plus starred questions; a normal round skips what is already solved.
 const starred=course==='de'?starredQuestionIds(snapshot.notes):new Set<string>();const reviewRows=new Map(reviews.map(r=>[r.question_id,r]));
 const marked=scopedQuestions.filter(item=>isObjectMistake(reviewRows.get(item.id))||starred.has(item.id));
 const unsolved=scopedQuestions.filter(item=>!isObjectSolved(reviewRows.get(item.id))).length;
 function fail(e:unknown,fallback:VaultCopyKey){if(!mounted.current)return;const auth=!!(e as {signIn?:boolean})?.signIn;setSignIn(auth);setError(auth?'signInError':fallback);}
 async function refresh(){
  try{const next=await api(undefined,'stats=1&tz='+new Date().getTimezoneOffset(),course);if(mounted.current){setSnapshot(next);setReady(true);setSignIn(false);}return next;}
  catch(e){if(mounted.current)setReady(false);fail(e,'loadError');}
 }
 useEffect(()=>{
  mounted.current=true;setRequestedResume(new URLSearchParams(window.location.search).get('session'));
  void refresh().finally(()=>{if(mounted.current)setInitializing(false);});
  return()=>{mounted.current=false;};
 },[]);
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=vaultDirection(language);document.title=vaultText(language,'vaultTitle')+' · '+SITE_NAME;stopFeedback();},[language]);
 function stopFeedback(){answerAudio.stop();}
 function focus(id='object-question-heading'){requestAnimationFrame(()=>{document.getElementById(id)?.focus();window.scrollTo({top:0,behavior:'instant'});});}
 function clearAnswer(){setFeedback(null);setSelected('');setHeardQuestionId(null);setNounArticle('');setArticleWarning(false);setShowHint(false);pendingAnswer.current=null;}
 function overview(){if(mutation.current)return;stopFeedback();setSession(null);clearAnswer();setView('categories');setError(null);setRequestedResume(null);void refresh();focus('vault-heading');}
 function chooseCategory(id:string,mode:PracticeMode=practiceMode){if(mutation.current)return;stopFeedback();setGroup(id);setSubgroup('all');setPracticeMode(mode);setView('configure');setError(null);pendingStart.current=null;focus('vault-config-heading');}
 async function start(reviewOnly=false,onlyIds?:string[]){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();
  const eligibleIds=subgroup==='all'?onlyIds:scopedQuestions.filter(item=>!onlyIds||onlyIds.includes(item.id)).map(item=>item.id);
  const key=JSON.stringify([course,practiceMode,group,subgroup,count,reviewOnly,eligibleIds??null]);const topic=(course==='en'?'en-':'')+(group==='all'?'objects-all':group);
  if(pendingStart.current?.key!==key){const picked=(practiceMode==='write'?pickWriting:practiceMode==='listen'?pickListening:pickPicture)(group,count,reviews,reviewOnly,eligibleIds,{starred,fresh:!reviewOnly&&!onlyIds});pendingStart.current={key,id:crypto.randomUUID(),ids:picked.map(x=>x.id),topic};}
  const request=pendingStart.current;
  if(!request.ids.length){setError(reviewOnly?'emptyReview':'emptyQuestions');mutation.current=false;setBusy(false);return;}
  try{
   const data=await api<{session:Session}>({action:'start',id:request.id,mode:practiceMode==='write'?'write':practiceMode==='listen'?'listen':'visual',topic:request.topic,count:request.ids.length,onlyIds:request.ids},'',course);
   if(!mounted.current)return;setSession(data.session);setIndex(data.session.answers.length);clearAnswer();pendingStart.current=null;setRequestedResume(null);focus();
  }catch(e){fail(e,'startError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 async function toggleStar(id:string){
  if(starBusy)return;const key=starNoteKey(id);const value=snapshot.notes[key]==='1'?'':'1';
  setStarBusy(true);setSnapshot(previous=>({...previous,notes:{...previous.notes,[key]:value}}));
  try{await api({action:'note',key,value},'',course);}
  catch(e){if(mounted.current){setSnapshot(previous=>({...previous,notes:{...previous.notes,[key]:value?'':'1'}}));fail(e,'starError');}}
  finally{if(mounted.current)setStarBusy(false);}
 }
 async function resume(id:string){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();
  try{
   const data=await api<{session:Session}>(undefined,'?session='+encodeURIComponent(id),course);
   if(!data.session.topic.startsWith(topicPrefix)||!['visual','write','listen'].includes(data.session.mode)||!data.session.questions.every(item=>modePredicate(data.session.mode)(questionMap.get(item.id)))){setError('legacyError');return;}
   if(!mounted.current)return;const restored=data.session.topic.replace(/^en-/,'');setPracticeMode(data.session.mode==='write'?'write':data.session.mode==='listen'?'listen':'test');setGroup(restored==='objects-all'?'all':restored);setSubgroup('all');setSession(data.session);setIndex(data.session.answers.length);clearAnswer();focus();
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
   const data=await api<{result:Answer}>({action:'answer',sessionId:session.id,questionId:q.id,answer},'',course);
   if(!mounted.current)return;setFeedback(data.result);pendingAnswer.current=null;
   setSession(s=>s?{...s,answers:[...s.answers.filter(a=>a.question_id!==q.id),data.result]}:s);
   requestAnimationFrame(()=>document.getElementById('object-feedback')?.focus());
  }catch(e){fail(e,'saveError');}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 function next(){if(mutation.current||!session||!feedback)return;stopFeedback();setIndex(i=>i+1);clearAnswer();focus();if(index+1>=session.questions.length){answerAudio.complete();setRequestedResume(null);void refresh();}}
 const options=q?(session?.questions[index]?.options??q.options??[]):[];
 // Word puzzles: the learner chooses der/die/das and spells the noun (the article is no longer given away).
 const articleSplit=course==='de'&&session?.mode==='write'&&q&&!articleQuestion?/^(der|die|das) (.+)$/.exec(q.answer):null;
 function articleLogic(question:Question,word:ObjectWord){const plural=question.articlePuzzle?.variant==='plural';return articleRuleText(language,articleRule(word.id,plural?articleFullAnswer(question):word.de,plural));}
 const actionDisabled=busy||cueBusy||speech.busy;
 function answerMeaning(question:Question,word:ObjectWord){return question.articlePuzzle?<span className="object-answer-meaning"><strong lang="de" dir="ltr">{articleFullAnswer(question)}</strong><span className="object-answer-translation" lang={language}>{objectMeaning(word.id,language)} · {text('pluralLabel')}</span></span>:<ObjectAnswerMeaning word={word} language={language} course={course}/>;}
 function hearQuestion(slow=false){if(!q?.audio||busy||cueBusy)return;setHeardQuestionId(q.id);speech.speak(q.audio,slow);}
 const modeLabels={test:text('testPractice'),write:text('writePractice'),listen:text('listenPractice'),testDetail:text('testDetail'),writeDetail:text('writeDetail'),listenDetail:text('listenDetail')};
 const showProgress=ready&&course==='de';
 function categoryCard(id:string,title:string,featured=false){const total=id==='all'?objectVocabulary.length:objectVocabulary.filter(word=>word.topic===id).length;return <article key={id} className={'vault-category-card vault-mode-card '+(featured?'featured':'')} data-vault-category={id}><button type="button" className="vault-category-open" disabled={busy} onClick={()=>chooseCategory(id)}><div className="vault-category-art"><CategoryArt group={id} title={title}/></div><div className="vault-category-label"><h3>{title}</h3><p>{text('objectsCount',{n:total})}</p>{showProgress&&<ProgressMeter progress={objectProgress(id,snapshot.reviews)} language={language} label={title} compact/>}<ArrowRight size={19} className="vault-direction-icon"/></div></button><PracticeModes labels={modeLabels} topicLabel={title} compact disabled={busy} onChoose={mode=>chooseCategory(id,mode)}/></article>;}

 return <div className="category-app object-app toon-app picture-quiz-app vault-app" lang={language} dir={vaultDirection(language)}>
  <a className="skip-link" href="#object-main">{text('skipContent')}</a>
  <SiteHeader language={language} languages={vaultLanguages} onLanguage={value=>{if(isVaultLanguage(value)){stopFeedback();onLanguage(value);}}} homeHref={'/?learn='+course} homeLabel={text('home')} stats={snapshot.stats}/>
  <main id="object-main" className="object-page">
   {onCourse&&<CourseSelector course={course} language={isStudyLanguage(language)?language:'en'} disabled={busy} onChange={onCourse}/>}
   <div className="object-breadcrumb"><a href={'/?learn='+course}>{text('home')}</a><ChevronRight size={14} className="vault-direction-icon"/><span>{text('vaultTitle')}</span></div>
   {error&&<div className="object-alert" role="alert"><p>{text(error)}</p>{signIn?<a href="/auth/login" className="btn">{text('signIn')}</a>:pendingAnswer.current?<button type="button" className="btn secondary small" disabled={busy} onClick={()=>void submit(pendingAnswer.current!.answer)}>{text('saveRetry')}</button>:<button type="button" className="btn secondary small" disabled={busy} onClick={()=>{setError(null);void refresh();}}>{text('retry')}</button>}</div>}
   {speech.warning&&<p className="object-alert" role="status">{language==='tr'?speech.warning:text('audioWarning')}</p>}
   {session?finished?<section className="object-results panel">
    <h1 id="object-question-heading" tabIndex={-1}>{text(session.mode==='write'?'puzzlesDone':'resultsTitle')}</h1><p className="vault-result-score">{text('resultScore',{correct:session.answers.filter(a=>a.correct).length,total:session.questions.length})}</p>
    <RoundReward answers={session.answers} progress={showProgress?objectProgress(group,snapshot.reviews):null} language={language} label={categoryName(group,language)}/>
    <div className="object-actions"><button type="button" className="btn" disabled={busy||!ready||!session.answers.some(a=>!a.correct)} onClick={()=>void start(false,session.answers.filter(a=>!a.correct).map(a=>a.question_id))}><RotateCcw size={18}/>{text(session.mode==='write'?'reviewPuzzleMistakes':'reviewRoundMistakes')}</button><button type="button" className="btn secondary" disabled={busy} onClick={overview}>{text('categories')}</button></div>
    {session.answers.filter(a=>!a.correct).map(a=>{const item=questionMap.get(a.question_id);const word=item?.objectId?objectWordMap.get(item.objectId):undefined;return word?<div className="object-result-row" key={a.id}><ObjectPicture word={word} language={language} small/><div>{item&&answerMeaning(item,word)}<small>{text(session.mode==='write'?'yourAnswer':'yourChoice')}: <span lang={course} dir="ltr">{a.answer}</span></small></div></div>:null;})}
   </section>:q&&currentWord?<section className="object-practice picture-quiz-practice">
    <div className="object-practice-top"><span className="object-pill">{text(session.mode==='write'?'writePractice':session.mode==='listen'?'listenPractice':'testPractice')}</span><span>{text(session.mode==='write'?'puzzleRoundProgress':'progress',{n:index+1,total:session.questions.length})}</span>{course==='de'&&<button type="button" className={'housing-star'+(starred.has(q.id)?' active':'')} aria-pressed={starred.has(q.id)} aria-label={text(starred.has(q.id)?'unstar':'star')} title={text(starred.has(q.id)?'unstar':'star')} disabled={starBusy} onClick={()=>void toggleStar(q.id)}><Star size={20} fill={starred.has(q.id)?'currentColor':'none'}/></button>}<button type="button" className="object-exit" disabled={busy} onClick={overview} aria-label={text('exitTest')}><X size={20}/></button></div>
    <progress max={session.questions.length} value={index} aria-label={text(session.mode==='write'?'puzzleRoundProgress':'progress',{n:index+1,total:session.questions.length})}/>
    <article className="object-question panel">
     <h1 id="object-question-heading" tabIndex={-1}>{text(session.mode==='write'?(articleQuestion?'articleTask':'puzzlePrompt'):session.mode==='listen'?'listenPrompt':'questionPrompt')}</h1>{session.mode!=='listen'&&<ObjectPicture word={currentWord} language={language} concealed={!feedback}/>}
     {course==='de'&&session.mode==='write'&&!feedback&&<div className="vault-hint-wrap"><button type="button" className="text-button" aria-expanded={showHint} onClick={()=>setShowHint(value=>!value)}>{puzzleText(language,showHint?'hideHint':'showHint')}</button>{showHint&&<p className="vault-hint"><span lang="de" dir="ltr">{currentWord.description}</span>{language==='tr'&&<span>{currentWord.descriptionTr}</span>}</p>}</div>}
     {session.mode==='listen'&&<div className="vault-listen-player"><Headphones size={32} aria-hidden="true"/><div className="vault-listen-buttons"><button type="button" className="btn" disabled={actionDisabled} onClick={()=>hearQuestion()}><Volume2 size={20}/>{text(heardQuestionId===q.id?'repeatAudio':'listenAudio')}</button><button type="button" className="btn secondary" disabled={actionDisabled} onClick={()=>hearQuestion(true)}>{text('speechSlow')}</button></div><p role="status">{text(speech.busy?'listenPlaying':heardQuestionId===q.id?'listenChoose':'listenFirst')}</p></div>}
     {session.mode==='listen'?<div className="object-options pictures vault-listening-options" role="group" aria-labelledby="object-question-heading">{options.map((option,i)=>{const id=q.pictureOptions?.find(id=>(course==='en'?englishObjectName(id):objectWordMap.get(id)?.de)===option)??objectVocabulary.find(item=>(course==='en'?englishObjectName(item.id):item.de)===option)?.id;const word=id?objectWordMap.get(id):undefined;return word?<button type="button" key={option} className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')+(!feedback&&selected===option?'selected':'')} disabled={!!feedback||actionDisabled||!!pendingAnswer.current||heardQuestionId!==q.id} onClick={()=>void submit(option)} aria-label={String.fromCharCode(65+i)+' · '+text('questionImage')}><span className="object-option-number">{String.fromCharCode(65+i)}</span><ObjectPicture word={word} language={language} small concealed={!feedback}/>{feedback&&option===q.answer&&<CheckCircle2 size={20} className="vault-listening-correct" aria-hidden="true"/>}</button>:null;})}</div>:(session.mode==='write'?articleQuestion?<ArticlePuzzle key={session.id+':'+q.id} noun={articleNoun(articleQuestion)} variant={articleChallengeKind(articleQuestion)} storageKey={'lernkoko-puzzle:'+session.id+':'+q.id} language={language} onChange={setSelected} onSubmit={answer=>void submit(answer)} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined}/>:<>{q.gap&&<p className="vault-gap-sentence" lang={course} dir="ltr">{q.gap}</p>}
      {articleSplit&&<div className="vault-article-choice"><span className="verb-aux-label">{puzzleText(language,'chooseArticle')}</span><div className="article-bank" role="group" aria-label={text('articleBank')} dir="ltr" lang="de">{(['der','die','das'] as const).map(value=>{const right=value===articleSplit[1];return <button type="button" key={value} className={'article-choice '+(nounArticle===value?'selected ':'')+(feedback?(right&&(nounArticle===value||!feedback.correct)?'right':nounArticle===value?'wrong':''):'')} aria-pressed={nounArticle===value} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>{setNounArticle(value);setArticleWarning(false);if(articleWarning&&selected&&!feedback)void submit(value+' '+selected);}}>{value}</button>;})}</div>{articleWarning&&!nounArticle&&<p className="verb-aux-warning" role="alert">{puzzleText(language,'articleMissing')}</p>}</div>}
      <LetterPuzzle key={session.id+':'+q.id} answer={articleSplit?articleSplit[2]:q.answer} storageKey={'lernkoko-puzzle:'+session.id+':'+q.id+(articleSplit?':noun':'')} language={language} course={course} onChange={setSelected} onSubmit={answer=>{if(articleSplit){if(!nounArticle){setArticleWarning(true);return;}void submit(nounArticle+' '+answer);}else void submit(answer);}} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined} strictCase={q.strictCase}/></>:<div className="object-options picture-word-options" role="group" aria-labelledby="object-question-heading">{options.map((option,i)=><button key={option} type="button" className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')+(!feedback&&selected===option?'selected':'')} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>void submit(option)}><span className="object-option-number">{String.fromCharCode(65+i)}</span><span className="picture-option-word" lang={course} dir="ltr">{option}</span>{feedback&&option===q.answer&&<CheckCircle2 size={20}/>}</button>)}</div>)}
     {busy&&!feedback&&<p className="picture-quiz-saving" role="status"><Loader2 size={16} className="spinner"/>{text('savingAnswer')}</p>}
     {feedback&&<div id="object-feedback" tabIndex={-1} className={'object-feedback '+(feedback.correct?'success':'retry')} role="status" aria-live="polite">
      <h2>{feedback.correct?<CheckCircle2 size={23}/>:<X size={23}/>} {text(feedback.correct?'correct':session.mode==='write'?'wrongAnswer':'wrong')}</h2><p>{text('correctAnswer')}: {answerMeaning(q,currentWord)}</p>
      {session.mode==='write'&&<p>{text('yourAnswer')}: <span lang={course} dir="ltr">{feedback.answer}</span></p>}
      {course==='de'&&<div className="verb-rules"><strong>{puzzleText(language,'ruleTitle')}</strong><p>{articleLogic(q,currentWord)}</p></div>}<button type="button" className="btn secondary small" disabled={busy||cueBusy} onClick={()=>speech.speak(pronunciation)}><Volume2 size={18}/>{text('repeatAudio')}</button>
      <button type="button" className="btn object-next" disabled={busy} onClick={next}>{text(index+1===session.questions.length?'viewResults':session.mode==='write'?'nextPuzzle':session.mode==='listen'?'nextListening':'nextImage')}<ArrowRight size={18} className="vault-direction-icon"/></button>
     </div>}
    </article>
   </section>:<p role="alert">{text('missingQuestion')} <button type="button" className="text-button" onClick={overview}>{text('categories')}</button></p>:
   view==='configure'?<section className="vault-config panel">
    <button type="button" className="text-button vault-back-categories" disabled={busy} onClick={overview}><ArrowLeft size={18} className="vault-direction-icon"/>{text('backCategories')}</button>
    <div className="vault-config-heading"><div className="vault-config-art"><CategoryArt group={group} title={categoryName(group,language)}/></div><div><h1 id="vault-config-heading" tabIndex={-1}>{categoryName(group,language)}</h1>{selectedSubgroup&&<p className="vault-selected-subtopic">{subgroupName(selectedSubgroup,language)}</p>}<p>{text(practiceMode==='write'?'puzzleCount':'objectsCount',{n:availableCount})}</p></div></div>
    <PracticeModes labels={modeLabels} topicLabel={categoryName(group,language)} active={practiceMode} disabled={busy} onChoose={mode=>{stopFeedback();setPracticeMode(mode);pendingStart.current=null;}}/>
    <div className="object-actions"><button type="button" className="btn" disabled={busy||!ready} onClick={()=>void start()}>{text(practiceMode==='write'?'startPuzzles':practiceMode==='listen'?'startListening':'startTest')}<ArrowRight size={18} className="vault-direction-icon"/></button><button type="button" className="btn secondary" disabled={busy||!ready||!marked.length} onClick={()=>void start(true)}><RotateCcw size={18}/>{text(course==='de'?'reviewMarked':'reviewMistakes')}{marked.length>0&&<span className="object-count">{marked.length}</span>}</button></div>
    {ready&&<p className="housing-remaining">{unsolved?text('remaining',{n:unsolved}):text('allSolved')}</p>}{course==='de'&&<p className="housing-tip">{text('starTip')}</p>}
   </section>:<section className="vault-categories" aria-labelledby="vault-heading">
    <h1 id="vault-heading" tabIndex={-1}>{text('vaultTitle')}</h1>
    <div className="vault-feature-grid">
     {categoryCard('all',text('allObjects'),true)}
     <article className={'vault-category-card vault-mode-card featured resume '+(busy||!ready||!resumeId?'unavailable':'')} data-vault-category="resume"><button type="button" className="vault-category-open" disabled={busy||!ready||!resumeId} onClick={()=>{if(resumeId)void resume(resumeId);}}><div className="vault-category-art"><CategoryArt group="resume" title={text('resume')}/></div><div className="vault-category-label"><h3>{text('resume')}</h3>{initializing?<p>{text('loading')}</p>:resumeSummary?<p>{text('progress',{n:resumeSummary.answered,total:resumeSummary.total})}</p>:<p>{text('noSavedTest')}</p>}<ArrowRight size={22} className="vault-direction-icon"/></div></button><div className="vault-resume-controls"><button type="button" className="btn secondary vault-resume-action" disabled={busy||!ready||!resumeId} onClick={()=>{if(resumeId)void resume(resumeId);}}><RotateCcw size={18}/>{text('resume')}<ArrowRight size={18} className="vault-direction-icon"/></button></div></article>
    </div>
    <h2 className="vault-category-section-title">{text('categories')}</h2><div className="vault-category-grid">{objectGroups.map(item=>categoryCard(item.id,categoryName(item.id,language)))}</div>
   </section>}
  </main><SiteFooter/>
 </div>;
}
