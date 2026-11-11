'use client';
import {saveLastPlace} from '@/lib/last-place';
import {browserLanguage} from '@/lib/device-language';
import {SITE_NAME} from '@/lib/site-brand';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,CheckCircle2,Headphones,House,Loader2,RotateCcw,Star,Volume2,X} from 'lucide-react';
import {gradeAnswer,questionMap,type Question} from '@/lib/course';
import {objectGroups,objectVocabulary,objectWordMap,type ObjectWord} from '@/lib/object-course';
import {sectionsFor,sectionTitle} from '@/lib/vault-sections';
import {WORD_TOPICS,isLessonTopic} from '@/lib/object-word-additions';
import {objectSubgroups,subgroupName,inObjectSubgroup} from '@/lib/object-subgroups';
import {isObjectPictureQuestion,isObjectWritingQuestion,isObjectListeningQuestion,isOpenObjectMistake,isObjectSolved,pickObjectListeningQuiz,pickObjectWritingQuiz,pickPictureQuiz,type ObjectPickOptions,type PictureQuizSize} from '@/lib/object-practice';
import {starNoteKey,starredQuestionIds,type Answer,type Session,type Snapshot} from '@/lib/study';
import {api,useGermanSpeech,useAnswerFeedback} from './study-shared';
import {playLearningSound} from '@/lib/learning-effects';
import {ObjectArt,HeroArt} from './toon-art';
import {objectMeaning} from '@/lib/object-translations';
import {vaultLanguages,isVaultLanguage,vaultDirection,vaultText,type VaultLanguage,type VaultCopyKey} from '@/lib/object-vault-copy';
import {readVaultLanguage,saveVaultLanguage} from '@/lib/vault-language-preference';
import {useLanguageSwitch} from './language-switch';
import {PracticeModes} from './practice-modes';
import {LetterPuzzle} from './letter-puzzle';
import {PUZZLE_HINTS,PUZZLE_TRIES} from '@/lib/letter-puzzle';
import {ArticlePuzzle} from './article-puzzle';
import {isArticleChallenge,articleNoun,articleFullAnswer,articleChallengeKind} from '@/lib/article-challenges';
import type {PracticeMode} from '@/lib/writing-practice';
import {englishObjectName,isEnglishObjectPictureQuestion,isEnglishObjectWritingQuestion,isEnglishObjectListeningQuestion,pickEnglishObjectQuiz} from '@/lib/english-objects';
import {ENGLISH_COURSE_ENABLED,activeLearningLanguage,learningText,saveLearningLanguage,type LearningLanguage} from '@/lib/learning-language';
import {isStudyLanguage} from '@/lib/study-languages';
import {CourseSelector} from './course-selector';
import {SiteFooter} from './site-footer';
import {SiteMenuAside} from './site-menu';
import {StartWait} from './start-wait';
import {SiteHeader} from './site-header';
import {OptionText} from './option-fit';
import {objectProgress} from '@/lib/progress';
import {ProgressMeter,RoundReward} from './progress-ui';
import {GUEST_OBJECT_GROUP} from '@/lib/guest-parts';
import {GuestBanner,GuestLock,GuestMore,guestSignUp} from './guest-taste';
import {puzzleText} from '@/lib/article-logic';
import {MistakeRepeatCard,roundMistakeIds} from './mistake-repeat';

const blank:Snapshot={reviews:[],notes:{},sessions:[]};
/** The next question opens 3 seconds after an answer (the learner asked for 3 instead of 4, 4 November 2026); reading the
 * right answer may hold it up to 6 seconds more. */
const AUTO_NEXT_MS=3000,AUTO_NEXT_GRACE_MS=6000;
const groupKeys:Record<string,VaultCopyKey>={'objects-house':'groupHouse','objects-furniture':'groupFurniture','objects-kitchen':'groupKitchen','objects-cleaning':'groupCleaning','objects-tools':'groupTools','objects-building':'groupBuilding','objects-nature':'groupNature','objects-moving':'groupMoving','objects-body':'groupBody','objects-health':'groupHealth','objects-food':'groupFood','objects-drinks':'groupDrinks','objects-cooking':'groupCooking','objects-school':'groupSchool','objects-outdoors':'groupOutdoors','objects-jobs':'groupJobs','objects-lektion1':'groupLektion1','objects-clothes':'groupClothes','objects-lektion2':'groupLektion2','objects-lektion3':'groupLektion3','objects-lektion4':'groupLektion4','objects-lektion5':'groupLektion5'};
const groupImages:Record<string,string>={'objects-house':'dach','objects-furniture':'sessel','objects-kitchen':'teekanne','objects-cleaning':'putzeimer','objects-tools':'bohrmaschine','objects-building':'schubkarre','objects-nature':'kaktus','objects-moving':'karton','objects-body':'hand','objects-health':'verbandskasten','objects-food':'brezel','objects-drinks':'kaffee','objects-cooking':'pfanne','objects-school':'tafel','objects-outdoors':'baum','objects-jobs':'beruf-aerztin','objects-lektion1':'l1-hallo','objects-clothes':'kleidung-tshirt','objects-lektion2':'l2-koch','objects-lektion3':'l3-tisch','objects-lektion4':'l4-familie','objects-lektion5':'l5-fruehstuecken'};
function categoryName(group:string,language:VaultLanguage){return group==='all'?vaultText(language,'allObjects'):groupKeys[group]?vaultText(language,groupKeys[group]):objectGroups.find(item=>item.id===group)?.title??group;}
function CategoryArt({group,title}:{group:string;title:string}){
 if(group==='all')return <HeroArt variant="objects" alt={title}/>;
 const id=groupImages[group]??objectVocabulary.find(word=>word.topic===group)?.id;
 return id?<ObjectArt id={id} title={title}/>:null;
}
function ObjectPicture({word,language,small=false,concealed=false}:{word:ObjectWord;language:VaultLanguage;small?:boolean;concealed?:boolean}){
 return <div className={'object-picture '+(small?'small':'')}><ObjectArt id={word.id} title={concealed?vaultText(language,'questionImage'):objectMeaning(word.id,language)}/></div>;
}
export function ObjectAnswerMeaning({word,language,course='de'}:{word:ObjectWord;language:VaultLanguage;course?:LearningLanguage}){
 return <span className="object-answer-meaning"><strong lang={course} dir="ltr">{course==='en'?englishObjectName(word.id):word.de}</strong><span className="object-meaning-divider" aria-hidden="true">—</span><span className="object-answer-translation" lang={language} dir={vaultDirection(language)}>{course==='en'&&language==='de'?word.de:objectMeaning(word.id,language)}</span></span>;
}
/** `guest`: a visitor without an account (app/ev-esyalar/page.tsx) — the first group is open, nothing is saved. */
export default function ObjectStudy({guest=false}:{guest?:boolean}){
 const [language,setLanguage]=useState<VaultLanguage>('de');const [course,setCourse]=useState<LearningLanguage>('de');const [languageReady,setLanguageReady]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{let saved:VaultLanguage=browserLanguage();try{saved=readVaultLanguage(localStorage,saved);setCourse(activeLearningLanguage(localStorage,window.location.search));}catch{}switchLanguage(saved,()=>setLanguageReady(true));},[switchLanguage]);
 useEffect(()=>{if(!languageReady)return;try{saveVaultLanguage(localStorage,language);saveLearningLanguage(localStorage,course);}catch{}},[language,course,languageReady]);
 function changeCourse(value:LearningLanguage){window.speechSynthesis?.cancel();setCourse(value);const url=new URL(window.location.href);url.searchParams.set('learn',value);url.searchParams.delete('session');window.history.replaceState(null,'',url);}
 return languageReady?<ObjectWorkshop key={course} language={language} onLanguage={switchLanguage} course={course} onCourse={ENGLISH_COURSE_ENABLED?changeCourse:undefined} guest={guest}/>:<div className="course-loading" role="status">{SITE_NAME}…</div>;
}
export function ObjectWorkshop({language,onLanguage,course='de',onCourse,guest=false}:{language:VaultLanguage;onLanguage:(value:VaultLanguage)=>void;course?:LearningLanguage;onCourse?:(value:LearningLanguage)=>void;guest?:boolean}){
 const back='/ev-esyalar';
 const text=(key:VaultCopyKey,params?:Record<string,string|number>)=>vaultText(language,key,params,course);
 const isPicture=course==='en'?isEnglishObjectPictureQuestion:isObjectPictureQuestion;
 const isWriting=course==='en'?isEnglishObjectWritingQuestion:isObjectWritingQuestion;
 const isListening=course==='en'?isEnglishObjectListeningQuestion:isObjectListeningQuestion;
 const modePredicate=(mode:string)=>mode==='write'?isWriting:mode==='listen'?isListening:isPicture;
 const pickPicture=course==='en'?(group:string,count:number|'all',reviews:Snapshot['reviews'],reviewOnly=false,onlyIds?:string[],_options?:ObjectPickOptions)=>pickEnglishObjectQuiz(group,count,reviews,reviewOnly,onlyIds):pickPictureQuiz;
 const pickWriting=course==='en'?(group:string,count:number|'all',reviews:Snapshot['reviews'],reviewOnly=false,onlyIds?:string[],_options?:ObjectPickOptions)=>pickEnglishObjectQuiz(group,count,reviews,reviewOnly,onlyIds,true):pickObjectWritingQuiz;
 const pickListening=course==='en'?(group:string,count:number|'all',reviews:Snapshot['reviews'],reviewOnly=false,onlyIds?:string[],_options?:ObjectPickOptions)=>pickEnglishObjectQuiz(group,count,reviews,reviewOnly,onlyIds,false,true):pickObjectListeningQuiz;
 const [snapshot,setSnapshot]=useState<Snapshot>(blank);
 const [ready,setReady]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState<VaultCopyKey|null>(null);const [signIn,setSignIn]=useState(false);
 const [practiceMode,setPracticeMode]=useState<PracticeMode>('test');
 const [view,setView]=useState<'categories'|'configure'>('categories');const [group,setGroup]=useState('all');const [subgroup,setSubgroup]=useState('all');const [count]=useState<PictureQuizSize>('all');
 const [session,setSession]=useState<Session|null>(null);const [index,setIndex]=useState(0);
 const [feedback,setFeedback]=useState<Answer|null>(null);const [selected,setSelected]=useState('');
 const [heardQuestionId,setHeardQuestionId]=useState<string|null>(null);const [starBusy,setStarBusy]=useState(false);
 // The picture strip (the learner asked, 4 November 2026): questions solved in earlier rounds stay in it as done, and
 // any done question can be opened again to look at (it is not answered again).
 const [earlier,setEarlier]=useState<string[]>([]);const [viewId,setViewId]=useState<string|null>(null);
 // The end of a round with mistakes (the learner asked, 5 November 2026: the same as in Fiil Atölyesi): the wrong questions
 // come once more by themselves (app/mistake-repeat.tsx), then the round's results. Only after a normal round (not after
 // a review of mistakes); `firstRound`: that round while its repeat runs and on the results after it.
 const [repeatable,setRepeatable]=useState(false);const [firstRound,setFirstRound]=useState<Session|null>(null);const [skipRepeat,setSkipRepeat]=useState(false);
 const [replays,setReplays]=useState(0); // "Tekrar dinle" taps on the answer card: each one gives 3 seconds again
 const [nounArticle,setNounArticle]=useState('');const [articleWarning,setArticleWarning]=useState(false);const [showHint,setShowHint]=useState(false);
 const speech=useGermanSpeech(course);const answerAudio=useAnswerFeedback(speech);const cueBusy=answerAudio.busy;
 const mutation=useRef(false);const mounted=useRef(true);
 // From Yanlışlarım (/yanlislarim): ?tekrar=1 opens all objects, where the mistakes can be practised (once).
 const reviewLink=useRef(false);
 useEffect(()=>{if(!ready||reviewLink.current)return;reviewLink.current=true;if(new URLSearchParams(window.location.search).get('tekrar')==='1')chooseCategory('all');},[ready]);// eslint-disable-line react-hooks/exhaustive-deps
 const pendingStart=useRef<{key:string;id:string;ids:string[];topic:string;earlier:string[]}|null>(null);
 const pendingAnswer=useRef<{questionId:string;answer:string}|null>(null);
 const reviews=snapshot.reviews.filter(r=>modePredicate(practiceMode)(questionMap.get(r.question_id)));
 const candidate=session?.questions[index]?questionMap.get(session.questions[index].id):undefined;
 const q=modePredicate(session?.mode??'visual')(candidate)?candidate:undefined;
 const currentWord=q?.objectId?objectWordMap.get(q.objectId):undefined;
 const articleQuestion=course==='de'&&q&&isArticleChallenge(q)?q:undefined;
 const pronunciation=articleQuestion?articleFullAnswer(articleQuestion):currentWord?(course==='en'?englishObjectName(currentWord.id):currentWord.de):q?.answer??'';
 const finished=!!session&&index>=session.questions.length;
 const roundMistakes=session?roundMistakeIds(session):[];
 const repeatDue=!!session&&repeatable&&!firstRound&&!skipRepeat&&roundMistakes.length>0;
 const resultRound=firstRound??session;
 const scopeFor=(mode:string)=>Array.from(questionMap.values()).filter(item=>modePredicate(mode)(item)&&(group==='all'||item.topic===(course==='en'?'en-':'')+group)&&inObjectSubgroup(item,subgroup));
 const scopedQuestions=scopeFor(practiceMode);
 const availableCount=scopedQuestions.length;
 const selectedSubgroup=objectSubgroups.find(item=>item.id===subgroup);
 // Review = mistakes plus starred questions; a normal round skips what is already solved.
 const starred=course==='de'?starredQuestionIds(snapshot.notes):new Set<string>();const reviewRows=new Map(reviews.map(r=>[r.question_id,r]));
 const marked=scopedQuestions.filter(item=>isOpenObjectMistake(reviewRows.get(item.id))||starred.has(item.id));
 const unsolved=scopedQuestions.filter(item=>!isObjectSolved(reviewRows.get(item.id))).length;
 // "Hepsini baştan çöz" (the learner asked): a round from every question here, the solved ones too, while unsolved ones are left.
 function fail(e:unknown,fallback:VaultCopyKey){if(!mounted.current)return;const auth=!!(e as {signIn?:boolean})?.signIn;setSignIn(auth);setError(auth?'signInError':fallback);}
 async function refresh(){
  try{const next=await api(undefined,'stats=1&tz='+new Date().getTimezoneOffset(),course);if(mounted.current){setSnapshot(next);setReady(true);setSignIn(false);}return next;}
  catch(e){if(mounted.current)setReady(false);fail(e,'loadError');}
 }
 useEffect(()=>{
  mounted.current=true;
  void refresh();
  return()=>{mounted.current=false;};
 },[]);
 useEffect(()=>{if(course==='de')saveLastPlace(localStorage,{id:'vault'});},[course]); // "Kaldığın yerden devam et" (lib/last-place.ts)
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=vaultDirection(language);document.title=vaultText(language,'vaultTitle')+' · '+SITE_NAME;stopFeedback();},[language]);
 function stopFeedback(){answerAudio.stop();}
 function focus(id='object-question-heading'){requestAnimationFrame(()=>{document.getElementById(id)?.focus();window.scrollTo({top:0,behavior:'instant'});});}
 function clearAnswer(){setViewId(null);setFeedback(null);setSelected('');setHeardQuestionId(null);setNounArticle('');setArticleWarning(false);setShowHint(false);pendingAnswer.current=null;}
 function overview(){if(mutation.current)return;stopFeedback();setSession(null);setFirstRound(null);setSkipRepeat(false);clearAnswer();setView('categories');setError(null);void refresh();focus('vault-heading');}
 // The end of a round (the learner asked, 29 October 2026): back to the same category's screen (Gör ve Seç / Yazarak Pekiştir /
 // Dinle ve Bul), not to the list of all categories; the mode just played stays chosen.
 function backToCategory(){if(mutation.current)return;stopFeedback();setSession(null);setFirstRound(null);setSkipRepeat(false);clearAnswer();setView('configure');setError(null);pendingStart.current=null;void refresh();focus('vault-config-heading');}
 function chooseCategory(id:string,mode:PracticeMode=practiceMode){if(mutation.current)return;stopFeedback();setGroup(id);setSubgroup('all');setPracticeMode(mode==='write'&&isLessonTopic(id)?'test':mode);setView('configure');setError(null);pendingStart.current=null;focus('vault-config-heading');}
 // A mode card starts its round at once (the learner asked, 4 November 2026: no "Teste başla" button), so the mode is passed in.
 async function start(reviewOnly=false,onlyIds?:string[],all=false,mode:PracticeMode=practiceMode){
  if(mutation.current)return;mutation.current=true;setBusy(true);setError(null);stopFeedback();
  // Dinle ve Bul: the first word is heard as soon as the round opens (the learner asked: no tap); the tap that starts
  // the round prepares the sound so phones allow it.
  if(mode==='listen')speech.prepare();
  const eligibleIds=subgroup==='all'?onlyIds:scopedQuestions.filter(item=>!onlyIds||onlyIds.includes(item.id)).map(item=>item.id);
  const key=JSON.stringify([course,mode,group,subgroup,count,reviewOnly,all,eligibleIds??null]);const topic=(course==='en'?'en-':'')+(group==='all'?'objects-all':group);
  if(pendingStart.current?.key!==key){
   const history=mode===practiceMode?reviews:snapshot.reviews.filter(r=>modePredicate(mode)(questionMap.get(r.question_id)));const fresh=!reviewOnly&&!onlyIds&&!all;
   const picked=(mode==='write'?pickWriting:mode==='listen'?pickListening:pickPicture)(group,count,history,reviewOnly,eligibleIds,{starred,fresh});const ids=picked.map(x=>x.id);
   // A normal round asks the unsolved ones; the solved ones stay in its strip as done (not asked again).
   const rows=new Map(history.map(r=>[r.question_id,r]));const earlierIds=fresh?scopeFor(mode).filter(item=>!ids.includes(item.id)&&isObjectSolved(rows.get(item.id))).map(item=>item.id):[];
   pendingStart.current={key,id:crypto.randomUUID(),ids,topic,earlier:earlierIds};
  }
  const request=pendingStart.current;
  if(!request.ids.length){setError(reviewOnly?'emptyReview':'emptyQuestions');mutation.current=false;setBusy(false);return;}
  try{
   const data=await api<{session:Session}>({action:'start',id:request.id,mode:mode==='write'?'write':mode==='listen'?'listen':'visual',topic:request.topic,count:request.ids.length,onlyIds:request.ids},'',course);
   if(!mounted.current)return;setEarlier(request.earlier);setSession(data.session);setFirstRound(null);setSkipRepeat(false);setRepeatable(!reviewOnly&&!onlyIds);setIndex(data.session.answers.length);clearAnswer();pendingStart.current=null;focus();
   const first=data.session.mode==='listen'?questionMap.get(data.session.questions[data.session.answers.length]?.id??''):undefined;
   if(first?.audio){setHeardQuestionId(first.id);speech.speak(first.audio);}
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
 // "Sonraki dinleme" (listening round): the next word is heard at once, as the learner asked; it is started in this tap
 // so phones allow the sound, and the picture choices open after it as with the listen button.
 function next(){if(mutation.current||!session||!feedback)return;stopFeedback();const following=session.mode==='listen'?questionMap.get(session.questions[index+1]?.id??''):undefined;setIndex(i=>i+1);clearAnswer();focus();if(following?.audio){setHeardQuestionId(following.id);speech.speak(following.audio);}if(index+1>=session.questions.length){if(!repeatDue)answerAudio.complete();void refresh();}}
 // After an answer the next question comes by itself after 3 seconds (the learner asked, 4 November 2026: no "Sonraki"
 // button). It waits while the right answer is still being read (a few seconds at most) and while the page is hidden.
 const nextRef=useRef(next);nextRef.current=next;
 useEffect(()=>{
  if(!feedback||viewId)return; // paused while a done question is open; 3 seconds again after coming back
  let due=Date.now()+AUTO_NEXT_MS;let timer:ReturnType<typeof setTimeout>;
  const tick=()=>{
   const now=Date.now();if(document.hidden)due=Math.max(due,now+AUTO_NEXT_MS);
   const reading=(speech.isActive()||answerAudio.isWaiting())&&now<due+AUTO_NEXT_GRACE_MS;
   if(now<due||reading||mutation.current){timer=setTimeout(tick,Math.max(100,Math.min(250,due-now)));return;}
   nextRef.current();
  };
  timer=setTimeout(tick,AUTO_NEXT_MS);
  return()=>clearTimeout(timer);
 },[feedback,replays,viewId]);// eslint-disable-line react-hooks/exhaustive-deps
 /** The round's wrong questions once more, as a round of the same kind; the end sound comes after it. */
 async function startRepeat(){
  if(mutation.current||!session||!repeatDue)return;const first=session;const ids=roundMistakes;
  mutation.current=true;setBusy(true);setError(null);stopFeedback();if(first.mode==='listen')speech.prepare();
  try{
   const data=await api<{session:Session}>({action:'start',id:crypto.randomUUID(),mode:first.mode,topic:first.topic,count:ids.length,onlyIds:ids},'',course);
   if(!mounted.current)return;setEarlier([]);setSession(data.session);setFirstRound(first);setIndex(data.session.answers.length);clearAnswer();focus();
   const opening=data.session.mode==='listen'?questionMap.get(data.session.questions[data.session.answers.length]?.id??''):undefined;
   if(opening?.audio){setHeardQuestionId(opening.id);speech.speak(opening.audio);}
  }catch(e){fail(e,'startError');setSkipRepeat(true);}
  finally{mutation.current=false;if(mounted.current)setBusy(false);}
 }
 // Open a done question from the strip, or come back to the current one.
 function showQuestion(id:string|null){if(mutation.current)return;stopFeedback();setViewId(id&&id!==q?.id?id:null);focus();}
 function sayFor(item:Question){const word=item.objectId?objectWordMap.get(item.objectId):undefined;const article=course==='de'&&isArticleChallenge(item)?item:undefined;return article?articleFullAnswer(article):word?(course==='en'?englishObjectName(word.id):word.de):item.answer;}
 // Keep the current (or opened) tile in sight in the strip.
 useEffect(()=>{document.querySelector('.vault-strip [aria-current]')?.scrollIntoView({block:'nearest',inline:'center'});},[index,viewId,session?.id]);
 const options=q?(session?.questions[index]?.options??q.options??[]):[];
 // Word puzzles: the learner chooses der/die/das and spells the noun (the article is no longer given away).
 const articleSplit=course==='de'&&session?.mode==='write'&&q&&!articleQuestion?/^(der|die|das) (.+)$/.exec(q.answer):null;
 const actionDisabled=busy||cueBusy||speech.busy;
 function answerMeaning(question:Question,word:ObjectWord){return question.articlePuzzle?<span className="object-answer-meaning"><strong lang="de" dir="ltr">{articleFullAnswer(question)}</strong><span className="object-answer-translation" lang={language}>{objectMeaning(word.id,language)} · {text('pluralLabel')}</span></span>:<ObjectAnswerMeaning word={word} language={language} course={course}/>;}
 function hearQuestion(slow=false){if(!q?.audio||busy||cueBusy)return;setHeardQuestionId(q.id);speech.speak(q.audio,slow);}
 const modeLabels={test:text('testPractice'),write:text('writePractice'),listen:text('listenPractice'),testDetail:text('testDetail'),writeDetail:text('writeDetail'),listenDetail:text('listenDetail')};
 // The strip: done earlier (category order), then this round's questions; only done ones open.
 const strip=session?[...earlier.map(id=>({id,result:'done' as 'done'|'right'|'wrong'|undefined,current:false})),...session.questions.map((item,i)=>{const a=session.answers.find(x=>x.question_id===item.id);return {id:item.id,result:a?(a.correct?'right':'wrong') as 'right'|'wrong':undefined,current:i===index};})].map(item=>{const question=questionMap.get(item.id);return {...item,word:question?.objectId?objectWordMap.get(question.objectId):undefined};}):[];
 const viewQ=viewId?questionMap.get(viewId):undefined;const viewWord=viewQ?.objectId?objectWordMap.get(viewQ.objectId):undefined;
 const viewAnswer=viewId?session?.answers.find(a=>a.question_id===viewId):undefined;
 const shownId=viewQ?viewQ.id:q?.id??'';const stripShown=Math.max(0,strip.findIndex(item=>item.id===shownId));
 const showProgress=ready&&course==='de';
 function categoryCard(id:string,title:string,featured=false){const total=id==='all'?objectVocabulary.length:objectVocabulary.filter(word=>word.topic===id).length;
  // The guest taste: only the first group opens; the others lead to the free sign-up.
  if(guest&&id!==GUEST_OBJECT_GROUP)return <article key={id} className={'vault-category-card vault-mode-card guest-locked '+(featured?'featured':'')} data-vault-category={id}><a className="vault-category-open" href={guestSignUp(back)} data-guest-locked><div className="vault-category-art"><CategoryArt group={id} title={title}/></div><div className="vault-category-label"><h3>{title}</h3><p>{text('objectsCount',{n:total})}</p></div></a><GuestLock language={language} back={back}/></article>;
  return <article key={id} className={'vault-category-card vault-mode-card '+(featured?'featured':'')} data-vault-category={id}><button type="button" className="vault-category-open" disabled={busy} onClick={()=>chooseCategory(id)}><div className="vault-category-art"><CategoryArt group={id} title={title}/></div><div className="vault-category-label"><h3>{title}</h3><p>{text('objectsCount',{n:total})}</p>{showProgress&&<ProgressMeter progress={objectProgress(id,snapshot.reviews)} language={language} label={title} compact/>}<ArrowRight size={19} className="vault-direction-icon"/></div></button><PracticeModes labels={modeLabels} topicLabel={title} compact disabled={busy} noWrite={isLessonTopic(id)} onChoose={mode=>chooseCategory(id,mode)}/></article>;}

 return <div className="category-app object-app toon-app picture-quiz-app vault-app" lang={language} dir={vaultDirection(language)}>
  <a className="skip-link" href="#object-main">{text('skipContent')}</a>
  <SiteHeader language={language} languages={vaultLanguages} onLanguage={value=>{if(isVaultLanguage(value)){stopFeedback();onLanguage(value);}}} homeHref={'/?learn='+course} homeLabel={text('home')} stats={snapshot.stats} guest={guest}/>
  <div className="work-layout site-layout"><SiteMenuAside language={language} current={'vault'} course={course}/>
  <main id="object-main" className="object-page">
   {onCourse&&<CourseSelector course={course} language={isStudyLanguage(language)?language:'en'} disabled={busy} onChange={onCourse}/>}
   {/* The "Ana sayfa › …" breadcrumb was removed at the learner's request (30 October 2026); the menu above leads home. */}
   {guest&&<GuestBanner language={language} back={back}/>}
   {error&&<div className="object-alert" role="alert"><p>{text(error)}</p>{signIn?<a href="/auth/login" className="btn">{text('signIn')}</a>:pendingAnswer.current?<button type="button" className="btn secondary small" disabled={busy} onClick={()=>void submit(pendingAnswer.current!.answer)}>{text('saveRetry')}</button>:<button type="button" className="btn secondary small" disabled={busy} onClick={()=>{setError(null);void refresh();}}>{text('retry')}</button>}</div>}
   {speech.warning&&<p className="object-alert" role="status">{language==='tr'?speech.warning:text('audioWarning')}</p>}
   {session?finished?repeatDue?<MistakeRepeatCard title={text('repeatTitle')} lead={text('repeatLead',{n:roundMistakes.length})} startLabel={text('repeatStart')} skipLabel={text('repeatSkip')} busy={busy} onStart={()=>void startRepeat()} onSkip={()=>{stopFeedback();answerAudio.complete();setSkipRepeat(true);focus();}}/>:resultRound&&<section className="object-results panel">
    <h1 id="object-question-heading" tabIndex={-1}>{text(resultRound.mode==='write'?'puzzlesDone':'resultsTitle')}</h1><p className="vault-result-score">{text('resultScore',{correct:resultRound.answers.filter(a=>a.correct).length,total:resultRound.questions.length})}</p>
    {firstRound&&<p className="mistake-repeat-score" data-mistake-repeat-score="">{text('repeatScore',{correct:session.answers.filter(a=>a.correct).length,total:session.questions.length})}</p>}
    <RoundReward answers={resultRound.answers} progress={showProgress?objectProgress(group,snapshot.reviews):null} language={language} label={categoryName(group,language)}/>
    {guest&&<GuestMore language={language} back={back}/>}
    <div className="object-actions"><button type="button" className="btn" disabled={busy||!ready||!session.answers.some(a=>!a.correct)} onClick={()=>void start(false,session.answers.filter(a=>!a.correct).map(a=>a.question_id))}><RotateCcw size={18}/>{text(session.mode==='write'?'reviewPuzzleMistakes':'reviewRoundMistakes')}</button><button type="button" className="btn secondary" disabled={busy} onClick={backToCategory} data-vault-back-category><ArrowLeft size={18} className="vault-direction-icon"/>{categoryName(group,language)}</button></div>
    {resultRound.answers.filter(a=>!a.correct).map(a=>{const item=questionMap.get(a.question_id);const word=item?.objectId?objectWordMap.get(item.objectId):undefined;return word?<div className="object-result-row" key={a.id}><ObjectPicture word={word} language={language} small/><div>{item&&answerMeaning(item,word)}<small>{text(session.mode==='write'?'yourAnswer':'yourChoice')}: <span lang={course} dir="ltr">{a.answer}</span></small></div></div>:null;})}
   </section>:q&&currentWord?<section className="object-practice picture-quiz-practice">
    <div className="object-practice-top"><span className="object-pill">{firstRound?text('repeatPill'):text(session.mode==='write'?'writePractice':session.mode==='listen'?'listenPractice':'testPractice')}</span>
     {/* The picture strip instead of the progress bar (the learner chose "Resimli şerit", 4 November 2026): in the top row
         on wider screens, a row of its own on phones. */}
     <nav className="vault-strip" aria-label={text('navQuestions')}><ol>{strip.map((item,i)=>{const word=item.word;const shown=item.id===shownId;const result=item.result;
     return <li key={item.id} className={'vault-strip-item '+(result??'later')+(item.current?' current':'')+(shown?' shown':'')}><button type="button" disabled={busy||(!result&&!item.current)} aria-current={shown?'step':undefined} aria-label={(i+1)+' · '+text(item.current&&!result?'navCurrent':result==='wrong'?'wrong':result?'navDone':'navLater')} onClick={()=>showQuestion(item.current?null:item.id)}>
      {result&&word?<ObjectArt id={word.id} title={objectMeaning(word.id,language)}/>:<span className="vault-strip-number">{i+1}</span>}
      {result&&<span className="vault-strip-badge" aria-hidden="true">{result==='wrong'?<X size={11} strokeWidth={3.4}/>:<Check size={11} strokeWidth={3.4}/>}</span>}
     </button></li>;})}</ol></nav>
     <span>{text(session.mode==='write'?'puzzleRoundProgress':'progress',{n:stripShown+1,total:strip.length})}</span>{course==='de'&&!guest&&<button type="button" className={'housing-star'+(starred.has(shownId)?' active':'')} aria-pressed={starred.has(shownId)} aria-label={text(starred.has(shownId)?'unstar':'star')} title={text(starred.has(shownId)?'unstar':'star')} disabled={starBusy} onClick={()=>void toggleStar(shownId)}><Star size={20} fill={starred.has(shownId)?'currentColor':'none'}/></button>}<button type="button" className="object-exit" disabled={busy} onClick={overview} aria-label={text('exitTest')}><X size={20}/></button></div>
    {viewQ&&viewWord?<article className={'object-question panel vault-answered vault-viewing'}>
     <h1 id="object-question-heading" tabIndex={-1}>{text(session.mode==='write'?(course==='de'&&isArticleChallenge(viewQ)?'articleTask':'puzzlePrompt'):session.mode==='listen'?'listenPrompt':'questionPrompt')}</h1>
     <ObjectPicture word={viewWord} language={language}/>
     <div id="object-feedback" tabIndex={-1} className={'object-feedback '+(viewAnswer&&!viewAnswer.correct?'retry':'success')}>
      <h2>{viewAnswer&&!viewAnswer.correct?<X size={23}/>:<CheckCircle2 size={23}/>} {text(!viewAnswer?'navDone':viewAnswer.correct?'correct':session.mode==='write'?'wrongAnswer':'wrong')}</h2>
      {!viewAnswer&&<p>{text('doneEarlier')}</p>}<p>{text('correctAnswer')}: {answerMeaning(viewQ,viewWord)}</p>
      {session.mode==='write'&&viewAnswer&&<p>{text('yourAnswer')}: <span lang={course} dir="ltr">{viewAnswer.answer}</span></p>}
      <button type="button" className="btn secondary small" disabled={cueBusy} onClick={()=>speech.speak(sayFor(viewQ))}><Volume2 size={18}/>{text('repeatAudio')}</button>
      <button type="button" className="btn vault-back-current" onClick={()=>showQuestion(null)}>{text('backToCurrent')}<ArrowRight size={18} className="vault-direction-icon"/></button>
     </div>
    </article>:    <article className={'object-question panel'+(feedback?' vault-answered':'')+(session.mode==='listen'?' vault-listen':'')}>
     <h1 id="object-question-heading" tabIndex={-1}>{text(session.mode==='write'?(articleQuestion?'articleTask':'puzzlePrompt'):session.mode==='listen'?'listenPrompt':'questionPrompt')}</h1>{session.mode!=='listen'&&<ObjectPicture word={currentWord} language={language} concealed={!feedback}/>}
     {course==='de'&&session.mode==='write'&&!feedback&&<div className="vault-hint-wrap"><button type="button" className="text-button" aria-expanded={showHint} onClick={()=>setShowHint(value=>{if(!value)playLearningSound('hintPling');return !value;})}>{puzzleText(language,showHint?'hideHint':'showHint')}</button>{showHint&&<p className="vault-hint"><span lang="de" dir="ltr">{currentWord.description}</span>{language==='tr'&&<span>{currentWord.descriptionTr}</span>}</p>}</div>}
     {session.mode==='listen'&&<div className="vault-listen-player"><Headphones size={32} aria-hidden="true"/><div className="vault-listen-buttons"><button type="button" className="btn" disabled={actionDisabled} onClick={()=>hearQuestion()}><Volume2 size={20}/>{text(heardQuestionId===q.id?'repeatAudio':'listenAudio')}</button><button type="button" className="btn secondary" disabled={actionDisabled} onClick={()=>hearQuestion(true)}>{text('speechSlow')}</button></div><p role="status">{text(speech.busy?'listenPlaying':heardQuestionId===q.id?'listenChoose':'listenFirst')}</p></div>}
     {session.mode==='listen'?<div className="object-options pictures vault-listening-options" role="group" aria-labelledby="object-question-heading">{options.map((option,i)=>{const id=q.pictureOptions?.find(id=>(course==='en'?englishObjectName(id):objectWordMap.get(id)?.de)===option)??objectVocabulary.find(item=>(course==='en'?englishObjectName(item.id):item.de)===option)?.id;const word=id?objectWordMap.get(id):undefined;return word?<button type="button" key={option} className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')+(!feedback&&selected===option?'selected':'')} disabled={!!feedback||actionDisabled||!!pendingAnswer.current||heardQuestionId!==q.id} onClick={()=>void submit(option)} aria-label={String.fromCharCode(65+i)+' · '+text('questionImage')}><span className="object-option-number">{String.fromCharCode(65+i)}</span><ObjectPicture word={word} language={language} small concealed={!feedback}/>{feedback&&option===q.answer&&<CheckCircle2 size={20} className="vault-listening-correct" aria-hidden="true"/>}</button>:null;})}</div>:(session.mode==='write'?articleQuestion?<ArticlePuzzle key={session.id+':'+q.id} noun={articleNoun(articleQuestion)} variant={articleChallengeKind(articleQuestion)} storageKey={'lernkoko-puzzle:'+session.id+':'+q.id} language={language} onChange={setSelected} onSubmit={answer=>void submit(answer)} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined}/>:<>{q.gap&&<p className="vault-gap-sentence" lang={course} dir="ltr">{q.gap}</p>}
      {articleSplit&&<div className="vault-article-choice"><span className="verb-aux-label">{puzzleText(language,'chooseArticle')}</span><div className="article-bank" role="group" aria-label={text('articleBank')} dir="ltr" lang="de">{(['der','die','das'] as const).map(value=>{const right=value===articleSplit[1];return <button type="button" key={value} className={'article-choice '+(nounArticle===value?'selected ':'')+(feedback?(right&&(nounArticle===value||!feedback.correct)?'right':nounArticle===value?'wrong':''):'')} aria-pressed={nounArticle===value} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>{setNounArticle(value);setArticleWarning(false);if(articleWarning&&selected&&!feedback)void submit(value+' '+selected);}}>{value}</button>;})}</div>{articleWarning&&!nounArticle&&<p className="verb-aux-warning" role="alert">{puzzleText(language,'articleMissing')}</p>}</div>}
      <LetterPuzzle key={session.id+':'+q.id} answer={articleSplit?articleSplit[2]:q.answer} storageKey={'lernkoko-puzzle:'+session.id+':'+q.id+(articleSplit?':noun':'')} language={language} course={course} onChange={setSelected} onSubmit={(answer,out)=>{if(articleSplit){if(!nounArticle&&!out){setArticleWarning(true);return;}void submit((nounArticle?nounArticle+' ':'')+answer);}else void submit(answer);}} busy={actionDisabled} locked={!!feedback||!!pendingAnswer.current} result={feedback?!!feedback.correct:undefined} strictCase={q.strictCase} tries={PUZZLE_TRIES} hintCount={PUZZLE_HINTS}/></>:<div className="object-options picture-word-options" role="group" aria-labelledby="object-question-heading">{options.map((option,i)=><button key={option} type="button" className={'object-option '+(feedback&&option===q.answer?'right ':'')+(feedback&&!feedback.correct&&feedback.answer===option?'wrong ':'')+(!feedback&&selected===option?'selected':'')} disabled={!!feedback||actionDisabled||!!pendingAnswer.current} onClick={()=>void submit(option)}><span className="object-option-number">{String.fromCharCode(65+i)}</span><OptionText text={option} lang={course}/>{feedback&&option===q.answer&&<CheckCircle2 size={20}/>}</button>)}</div>)}
     {busy&&!feedback&&<p className="picture-quiz-saving" role="status"><Loader2 size={16} className="spinner"/>{text('savingAnswer')}</p>}
     {feedback&&<div id="object-feedback" tabIndex={-1} className={'object-feedback '+(feedback.correct?'success':'retry')} role="status" aria-live="polite">
      <h2>{feedback.correct?<CheckCircle2 size={23}/>:<X size={23}/>} {text(feedback.correct?'correct':session.mode==='write'?'wrongAnswer':'wrong')}</h2><p>{text('correctAnswer')}: {answerMeaning(q,currentWord)}</p>
      {session.mode==='write'&&<p>{text('yourAnswer')}: <span lang={course} dir="ltr">{feedback.answer}</span></p>}
      {/* No "Kural" (article rule) box after an answer: the learner asked for it to go (24 October 2026). */}
      <button type="button" className="btn secondary small" disabled={busy||cueBusy} onClick={()=>{speech.speak(pronunciation);setReplays(n=>n+1);}}><Volume2 size={18}/>{text('repeatAudio')}</button>
      {/* No "Sonraki" button: the bar empties in 3 seconds and the next question opens (AUTO_NEXT_MS). */}
      <span key={replays} className="vault-auto-next" aria-hidden="true"/>
     </div>}
    </article>}
   </section>:<p role="alert">{text('missingQuestion')} <button type="button" className="text-button" onClick={overview}>{text('categories')}</button></p>:
   view==='configure'?<section className="vault-config panel">
    <button type="button" className="text-button vault-back-categories" disabled={busy} onClick={overview}><ArrowLeft size={18} className="vault-direction-icon"/>{text('backCategories')}</button>
    <div className="vault-config-heading"><div className="vault-config-art"><CategoryArt group={group} title={categoryName(group,language)}/></div><div><h1 id="vault-config-heading" tabIndex={-1}>{categoryName(group,language)}</h1>{selectedSubgroup&&<p className="vault-selected-subtopic">{subgroupName(selectedSubgroup,language)}</p>}<p>{text(practiceMode==='write'?'puzzleCount':'objectsCount',{n:availableCount})}</p></div></div>
    {/* Tapping Gör ve Seç, Yazarak Pekiştir or Dinle ve Bul opens that round at once; no "Teste başla" button and no
        "… çözülmemiş soru kaldı" line (the learner asked, 4 November 2026). */}
    <PracticeModes labels={modeLabels} topicLabel={categoryName(group,language)} active={practiceMode} starts noWrite={isLessonTopic(group)} disabled={busy||!ready} onChoose={mode=>{stopFeedback();setPracticeMode(mode);pendingStart.current=null;void start(false,undefined,false,mode);}}/>
    {/* Only while there is something to practise; the round asks exactly what the button counts. */}
    {!guest&&marked.length>0&&<div className="object-actions"><button type="button" className="btn secondary" disabled={busy||!ready} onClick={()=>void start(true,marked.map(item=>item.id))}><RotateCcw size={18}/>{text(course==='de'?'reviewMarked':'reviewMistakes')}{marked.length>0&&<span className="object-count">{marked.length}</span>}</button></div>}
    {ready&&unsolved>0&&unsolved<availableCount&&<button type="button" className="text-button vault-restart-all" disabled={busy} onClick={()=>void start(false,undefined,true)} data-vault-restart-all><RotateCcw size={15} aria-hidden="true"/>{text('restartAll')}</button>}
   </section>:<section className="vault-categories" aria-labelledby="vault-heading">
    <h1 id="vault-heading" tabIndex={-1}>{text('vaultTitle')}</h1>
    {/* No "Tüm kelimeler" card; the categories under a few headings (the learner asked, 3 November 2026; lib/vault-sections.ts). */}
    {(()=>{const shown=objectGroups.filter(item=>course==='de'||!(WORD_TOPICS as readonly string[]).includes(item.id)).map(item=>item.id);const {list,rest}=sectionsFor(shown);
     return <>{list.map(({section,groups})=><section key={section.id} className="vault-section" aria-labelledby={'vault-section-'+section.id} data-vault-section={section.id}>
      <h2 id={'vault-section-'+section.id} className="vault-category-section-title"><span className="vault-section-emoji" aria-hidden="true">{section.emoji}</span>{sectionTitle(section,language)}</h2>
      <div className="vault-category-grid">{groups.map(id=>categoryCard(id,categoryName(id,language)))}</div>
     </section>)}
     {rest.length>0&&<section className="vault-section"><h2 className="vault-category-section-title">{text('categories')}</h2><div className="vault-category-grid">{rest.map(id=>categoryCard(id,categoryName(id,language)))}</div></section>}</>;})()}
   </section>}
  </main></div><StartWait show={busy&&!session} text={text('preparing')}/><SiteFooter language={language}/>
 </div>;
}
