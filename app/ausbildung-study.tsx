'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Check,Headphones,Layers,PenLine,Play,RotateCcw,Trophy} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,translate,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {courseUnits} from '@/lib/textbook-curriculum';
import {housingText} from '@/lib/housing-copy';
import {AUSBILDUNG_PATH,lessonParts,lessonPartMap,turkishNote,type L12Part,type L12PartId,type L12Word} from '@/lib/ausbildung-course';
import {hoerenTasks,type HoerenTask} from '@/lib/ausbildung-hoeren';
import {exerciseAnswerCount,isCheckable,isStep,isWordSection,lessonProgress,partProgress,partSteps,testPoints,type L12ScoreMap,type L12Step} from '@/lib/ausbildung-progress';
import {useLanguageSwitch} from './language-switch';
import {useAnswerSound,useGermanSpeech} from './study-shared';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {RasterArt,TopicArt} from './toon-art';
import {hoerenPicture,partPictures} from '@/lib/ausbildung-art';
import {ProgressMeter} from './progress-ui';
import {LessonBook} from './lesson-book';
import {ExerciseView,Flashcards,LessonBlocks,Rich,TeachingCard,readKnown,readScores,teachingCards,type Speech} from './ausbildung-ui';
import {LISTEN_CHANGED,ListenTask,listenResult,tasksByNumber,useListenPlayer} from './ausbildung-listen';

const unit=courseUnits.find(item=>item.id==='book-12')!;
const partParam=(value:string|null):L12PartId|null=>value&&lessonPartMap.has(value as L12PartId)?value as L12PartId:null;
export const KOKO_SRC='/branding/koko-mascot.png';
/** The picture of each part (public/toon/lektion12); the „Alles klar?" test shows Koko. */
function PartArt({part}:{part:L12Part}){
 const picture=partPictures[part.id];
 return picture?<RasterArt art={picture} title={part.de}/>:<img className="l12-koko" src={KOKO_SRC} alt="" width={400} height={329}/>;
}
const stepLabel:Record<L12Step,string>={kelimeler:'Kelimeler',konu:'Konu anlatımı',alistirmalar:'Alıştırmalar',dinleme:'Dinleme'};
const stepGo:Record<L12Step,string>={kelimeler:'Kelimelere geç',konu:'Konu anlatımına geç',alistirmalar:'Alıştırmalara geç',dinleme:'Dinlemeye geç'};
const StepIcon=({step,size=18}:{step:L12Step;size?:number})=>step==='kelimeler'?<Layers size={size} aria-hidden="true"/>:step==='konu'?<BookOpen size={size} aria-hidden="true"/>:step==='alistirmalar'?<PenLine size={size} aria-hidden="true"/>:<Headphones size={size} aria-hidden="true"/>;

/** Where the learner was last (part, step, exercise), so the overview can offer "continue". */
type Last={part:L12PartId;step:L12Step;ex?:number};
const LAST_KEY='lernkoko-l12-last';
function readLast():Last|null{try{const value=JSON.parse(localStorage.getItem(LAST_KEY)??'null') as Last|null;return value&&partParam(value.part)&&isStep(value.step)?value:null;}catch{return null;}}
function saveLast(value:Last){try{localStorage.setItem(LAST_KEY,JSON.stringify(value));}catch{}}
const SEEN_KEY='lernkoko-l12-seen';
function readSeen():Record<string,boolean>{try{const value=JSON.parse(localStorage.getItem(SEEN_KEY)??'{}');return value&&typeof value==='object'?value:{};}catch{return {};}}
function markSeen(id:string){try{localStorage.setItem(SEEN_KEY,JSON.stringify({...readSeen(),[id]:true}));}catch{}}
const exKey=(part:L12PartId)=>'lernkoko-l12-ex:'+part;

function partWords(part:L12Part):L12Word[]{
 return part.sections.filter(section=>isWordSection(section.id)).flatMap(section=>section.blocks.flatMap(block=>block.t==='vocab'?block.words:[]));
}

/** Lektion 12 „Ausbildung": the overview and one part at a time (?bolum=a … magazin, &adim=kelimeler … dinleme). */
export default function AusbildungStudy(){
 const [language,setLanguage]=useState<StudyLanguage>('tr');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem('german-study-language');}catch{}if(saved&&isStudyLanguage(saved))switchLanguage(saved,()=>setLoaded(true));else setLoaded(true);},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title='Lektion 12 · Ausbildung · '+SITE_NAME;try{localStorage.setItem('german-study-language',language);}catch{}},[language,loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <AusbildungLesson language={language} onLanguage={switchLanguage}/>;
}

type Route={part:L12PartId|null;step:L12Step|null};
function readRoute():Route{const params=new URLSearchParams(window.location.search);const step=params.get('adim');return {part:partParam(params.get('bolum')),step:isStep(step)?step:null};}

export function AusbildungLesson({language,onLanguage}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void}){
 const [route,setRoute]=useState<Route>({part:null,step:null});
 const [scores,setScores]=useState<L12ScoreMap>({});const [tick,setTick]=useState(0);
 const german=useGermanSpeech('de');
 const {speak,busy,activeText}=german;
 const speech:Speech=useMemo(()=>({speak:text=>speak(text),busy,activeText}),[speak,busy,activeText]);
 const refresh=useCallback(()=>{setScores(readScores());setTick(value=>value+1);},[]);
 useEffect(()=>{
  const read=()=>setRoute(readRoute());
  read();refresh();window.addEventListener('popstate',read);window.addEventListener(LISTEN_CHANGED,refresh);
  return()=>{window.removeEventListener('popstate',read);window.removeEventListener(LISTEN_CHANGED,refresh);};
 },[refresh]);
 const open=useCallback((part:L12PartId|null,step?:L12Step|null)=>{
  german.stop();const target=part?lessonPartMap.get(part)!:null;
  const nextStep=target?(step&&partSteps(target).includes(step)?step:partSteps(target)[0]):null;
  setRoute({part,step:nextStep});refresh();
  if(part&&nextStep)saveLast({part,step:nextStep});
  try{const url=new URL(window.location.href);url.searchParams.delete('bolum');url.searchParams.delete('adim');if(part){url.searchParams.set('bolum',part);if(nextStep)url.searchParams.set('adim',nextStep);}url.hash='';window.history.pushState(null,'',url);}catch{}
  requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('l12-heading')?.focus({preventScroll:true});});
 },[german,refresh]);
 const current=route.part?lessonPartMap.get(route.part):undefined;
 const step=current?(route.step&&partSteps(current).includes(route.step)?route.step:partSteps(current)[0]):null;
 const unitName=translate(unit.names,language);
 return <div className="category-app toon-app housing-app l12-app" lang={language} dir={languageDirection(language)}>
  <a className="skip-link" href="#l12-main">{housingText(language,'back')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value)){german.stop();onLanguage(value);}}} homeHref="/konular?level=A1.2" homeLabel={housingText(language,'back')}/>
  <main id="l12-main" className="object-page housing-page l12-page" lang="tr" dir="ltr">
   <div className="object-breadcrumb"><a href="/konular?level=A1.2">A1.2</a><span aria-hidden="true">›</span>{current?<><a href={AUSBILDUNG_PATH} onClick={event=>{event.preventDefault();open(null);}}>Lektion 12 · Ausbildung</a><span aria-hidden="true">›</span><span>{current.de}</span></>:<span>Lektion 12 · Ausbildung</span>}</div>
   {language!=='tr'&&turkishNote[language]&&<p className="object-alert l12-language-note" lang={language} dir={languageDirection(language)}>{turkishNote[language]}</p>}
   {german.warning&&<p className="object-alert" role="status">{german.warning}</p>}
   {current&&step?<PartPage key={current.id} part={current} step={step} scores={scores} tick={tick} speech={speech} onScore={refresh} onOpen={open} language={language}/>:<Overview unitName={unitName} scores={scores} tick={tick} onOpen={open} language={language}/>}
  </main>
  <SiteFooter/>
 </div>;
}

/* ---------- Overview ---------- */

function partSummary(part:L12Part){
 const words=partWords(part).length;const exercises=part.exercises.length;const listen=part.listen?.length??0;
 return [words?words+' kelime':'',exercises?exercises+' alıştırma':'',listen?listen+' dinleme':''].filter(Boolean).join(' · ');
}
/** What Lektion 12 teaches, ticked off on the overview's left page. */
const GOALS=['Ne yapabildiğini anlat: *Ich kann gut kochen.*','Planını söyle: *Ich will eine Ausbildung machen.*','Geçmişi anlat: *Ich bin nach Berlin gekommen.*','Zamanı söyle: *seit 2019 · vor zwei Jahren · in einem Jahr*','Resmî e-posta yaz: *Sehr geehrte Damen und Herren, …*'];
function Overview({unitName,scores,tick,onOpen,language}:{unitName:string;scores:L12ScoreMap;tick:number;onOpen:(part:L12PartId,step?:L12Step)=>void;language:StudyLanguage}){
 const [last,setLast]=useState<Last|null>(null);const [listened,setListened]=useState(0);
 useEffect(()=>{setLast(readLast());setListened(hoerenTasks.filter(task=>listenResult(task)).length);},[tick]);
 const lastPart=last?lessonPartMap.get(last.part):undefined;
 const total=lessonProgress(scores);
 // One line of the contents page: badge, taped picture, title, what is inside, progress.
 const row=(part:L12Part)=><li className="lb-toc-row" data-l12-part={part.id} key={part.id}>
  <button type="button" className="lb-toc-open" onClick={()=>onOpen(part.id)}>
   <span className="lb-toc-badge" aria-hidden="true">{part.badge}</span>
   <span className="lb-toc-photo" aria-hidden="true"><PartArt part={part}/></span>
   <span className="lb-toc-text"><strong lang="de" dir="ltr">{part.title}</strong><small><Rich text={part.card??part.lead}/></small><span className="lb-toc-meta">{partSummary(part)}</span></span>
   <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
  </button>
  {part.id==='test'?<TestBadge part={part} scores={scores}/>:<ProgressMeter progress={partProgress(part,scores)} language={language} label={part.de} compact/>}
 </li>;
 return <section aria-labelledby="l12-heading">
  <LessonBook left={<>
   <span className="eyebrow" lang="de">A1.2 · Lektion 12 · Ausbildung</span>
   <h1 id="l12-heading" tabIndex={-1} className="lb-title">{unitName}</h1>
   <p className="lb-sub" lang="de">Was wollen Sie noch lernen?</p>
   <p className="lb-lead">Meslek eğitimi, staj ve hayat hikâyeni anlatmak: <Rich text="*können / wollen*, Perfekt mit *sein*, *seit / vor / in* ve resmî e-posta."/></p>
   <figure className="lb-photo"><TopicArt id="book-12" title={unitName}/></figure>
   <div className="lb-notes">
    <button type="button" className="housing-feature lb-note l12-resume" onClick={()=>last?onOpen(last.part,last.step):onOpen('a','kelimeler')}>
     <span className="housing-letter l12-letter" aria-hidden="true"><Play size={24}/></span>
     <div><h2>{last?'Kaldığın yerden devam et':'Derse başla'}</h2><p>{lastPart&&last?lastPart.de+' · '+stepLabel[last.step]:'Teil A · Kelimeler'}</p><ProgressMeter progress={total} language={language} label="Lektion 12" compact/></div>
     <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
    </button>
    <a className="housing-feature lb-note l12-listen-feature" href={AUSBILDUNG_PATH+'/hoeren'}>
     <span className="l12-feature-art" aria-hidden="true"><RasterArt art={hoerenPicture} title="Hören"/></span>
     <div><h2>Hören · 14 dinleme</h2><p>{listened?`${listened} / ${hoerenTasks.length} bölüm yapıldı`:'Diyalogları dinle, soruları cevapla.'}</p></div>
     <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
    </a>
   </div>
   <section className="lb-goals" aria-labelledby="l12-goals"><h2 id="l12-goals">Bu ünitede</h2><ul>{GOALS.map(goal=><li key={goal}><span><Rich text={goal}/></span></li>)}</ul></section>
  </>} right={<>
   <h2 className="lb-heading"><span lang="de">Inhalt</span><small>İçindekiler</small></h2>
   <ol className="lb-toc">{lessonParts.slice(0,4).map(row)}</ol>
   <h3 className="lb-subheading">Ünite sonu</h3>
   <ol className="lb-toc">{lessonParts.slice(4).map(row)}</ol>
  </>}/>
 </section>;
}
function TestBadge({part,scores}:{part:L12Part;scores:L12ScoreMap}){
 const result=testPoints(part,scores);
 return <p className="l12-test-badge">{result.checked?<><Trophy size={17} aria-hidden="true"/><strong>{String(result.points).replace('.',',')} / {result.max} Punkte</strong>{result.checked<result.total?<small> · {result.total-result.checked} bölüm kaldı</small>:null}</>:<><Trophy size={17} aria-hidden="true"/>Henüz yapılmadı · {result.max} Punkte</>}</p>;
}

/* ---------- One part ---------- */

function PartPage({part,step,scores,tick,speech,onScore,onOpen,language}:{part:L12Part;step:L12Step;scores:L12ScoreMap;tick:number;speech:Speech;onScore:()=>void;onOpen:(part:L12PartId|null,step?:L12Step)=>void;language:StudyLanguage}){
 const steps=partSteps(part);const at=steps.indexOf(step);const nextStep=steps[at+1];
 const index=lessonParts.findIndex(item=>item.id===part.id);const nextPart=lessonParts[index+1];
 const words=useMemo(()=>partWords(part),[part]);
 const [known,setKnown]=useState<Set<string>>(new Set());const [seen,setSeen]=useState<Record<string,boolean>>({});const [listened,setListened]=useState(0);
 useEffect(()=>{setKnown(readKnown(part.id));setSeen(readSeen());setListened((part.listen??[]).filter(number=>{const task=tasksByNumber.get(number);return task&&listenResult(task);}).length);},[part,tick]);
 const checkable=part.exercises.filter(isCheckable);const checked=checkable.filter(exercise=>scores[exercise.id]).length;
 const detail:Record<L12Step,string>={
  kelimeler:`${known.size} / ${words.length} biliyorum`,
  konu:seen[part.id]?'Okundu':`${teachingCards(part.sections.filter(section=>!isWordSection(section.id))).length} kart`,
  alistirmalar:checkable.length?`${checked} / ${checkable.length} yapıldı`:`${part.exercises.length} yazma görevi`,
  dinleme:`${listened} / ${part.listen?.length??0} yapıldı`,
 };
 const done:Record<L12Step,boolean>={kelimeler:words.length>0&&known.size>=words.length,konu:!!seen[part.id],alistirmalar:checkable.length>0&&checked>=checkable.length,dinleme:!!part.listen&&listened>=part.listen.length};
 const goNext=()=>{if(step==='konu')markSeen(part.id);if(nextStep)onOpen(part.id,nextStep);else if(nextPart)onOpen(nextPart.id);else onOpen(null);};
 const nextText=nextStep?stepGo[nextStep]:nextPart?'Sonraki bölüm: '+nextPart.de:'Lektion 12\'ye dön';
 const previousPart=lessonParts[index-1];
 return <section className="l12-part" aria-labelledby="l12-heading">
  <LessonBook variant="wide" className={steps.length>1?'lb-tabbed':''} left={<div className="lb-sticky">
   <button type="button" className="text-button vault-back-categories" onClick={()=>onOpen(null)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>Lektion 12</button>
   <span className="eyebrow" lang="de">A1.2 · 12 · {part.de}</span>
   <h1 id="l12-heading" tabIndex={-1} lang="de" className="lb-title">{part.title}</h1>
   <p className="lb-lead"><Rich text={part.lead}/></p>
   <figure className="lb-photo"><PartArt part={part}/></figure>
   {part.id==='test'?<TestBadge part={part} scores={scores}/>:<ProgressMeter progress={partProgress(part,scores)} language={language} label={part.de} compact/>}
   <nav className="lb-pager" aria-label="Bölümler">{previousPart?<button type="button" className="text-button" onClick={()=>onOpen(previousPart.id)}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{previousPart.de}</button>:<span/>}{nextPart?<button type="button" className="text-button" onClick={()=>onOpen(nextPart.id)}>{nextPart.de}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>:null}</nav>
  </div>} right={<>
   {steps.length>1&&<nav className="l12-steps" aria-label="Bölümün adımları"><ol>{steps.map((item,i)=><li key={item}><button type="button" className={'l12-step'+(item===step?' active':'')+(done[item]?' done':'')} aria-current={item===step?'step':undefined} onClick={()=>onOpen(part.id,item)}>
    <span className="l12-step-number" aria-hidden="true">{done[item]?<Check size={16}/>:i+1}</span>
    <span className="l12-step-text"><strong><StepIcon step={item} size={15}/>{stepLabel[item]}</strong><small>{detail[item]}</small></span>
   </button></li>)}</ol></nav>}
   <div className="l12-step-page">
    {step==='kelimeler'&&<WordsStep part={part} words={words} known={known} speech={speech} onKnown={setKnown}/>}
    {step==='konu'&&<TopicStep part={part} speech={speech}/>}
    {step==='alistirmalar'&&<ExerciseRunner part={part} scores={scores} onScore={onScore} onOpen={onOpen} language={language}/>}
    {step==='dinleme'&&<ListenStep part={part}/>}
    {step!=='alistirmalar'&&<div className="panel housing-lesson-next l12-next"><p>{step==='kelimeler'?'Kelimeleri dinledin, kartlarla denedin mi? Şimdi konuyu öğrenelim.':step==='konu'?'Konuyu okudun. Şimdi alıştırmalarla pekiştir.':'Dinleme bitti.'+(nextPart?' Sıradaki bölüme geçebilirsin.':'')}</p><button type="button" className="btn" onClick={goNext}>{nextText}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button></div>}
   </div>
  </>}/>
 </section>;
}

function WordsStep({part,words,known,speech,onKnown}:{part:L12Part;words:L12Word[];known:Set<string>;speech:Speech;onKnown:(known:Set<string>)=>void}){
 const [cards,setCards]=useState(false);
 const sections=part.sections.filter(section=>isWordSection(section.id));
 const intro=sections.flatMap(section=>{const first=section.blocks.findIndex(block=>block.t!=='p');return section.blocks.slice(0,first<0?section.blocks.length:first);});
 const rest=sections.map(section=>{const first=section.blocks.findIndex(block=>block.t!=='p');return {...section,blocks:first<0?[]:section.blocks.slice(first)};});
 const list=teachingCards(rest);
 return <div className="l12-step-body">
  <div className="panel l12-words-head">
   <div><h2><Layers size={22} aria-hidden="true"/>Kelimeler</h2>{intro.length?<LessonBlocks blocks={intro} speech={speech}/>:<p className="l12-p">Her kelimeyi dinle ve sesli tekrar et.</p>}</div>
   <div className="l12-words-cta"><button type="button" className="btn orange" onClick={()=>setCards(value=>!value)} aria-pressed={cards}><Layers size={18} aria-hidden="true"/>{cards?'Listeye dön':'Kartlarla çalış'}</button><small>{known.size} / {words.length} kelimeyi biliyorsun</small></div>
  </div>
  {cards?<Flashcards id={part.id} words={words} speech={speech} onClose={()=>setCards(false)} onChange={onKnown}/>:list.map((card,i)=><TeachingCard key={i} card={card} speech={speech} known={known}/>)}
 </div>;
}

function TopicStep({part,speech}:{part:L12Part;speech:Speech}){
 const cards=teachingCards(part.sections.filter(section=>!isWordSection(section.id)));
 let n=0;
 return <div className="l12-step-body housing-lesson-stack">{cards.map((card,i)=><TeachingCard key={i} card={card} number={card.intro?undefined:++n} speech={speech}/>)}</div>;
}

function ExerciseRunner({part,scores,onScore,onOpen,language}:{part:L12Part;scores:L12ScoreMap;onScore:()=>void;onOpen:(part:L12PartId|null,step?:L12Step)=>void;language:StudyLanguage}){
 const exercises=part.exercises;const total=exercises.length;
 const [index,setIndex]=useState(0);const [results,setResults]=useState(false);const sound=useAnswerSound();
 useEffect(()=>{let saved=NaN;try{saved=Number(localStorage.getItem(exKey(part.id)));}catch{}if(Number.isInteger(saved)&&saved>=0&&saved<total)setIndex(saved);else{const first=exercises.findIndex(exercise=>!scores[exercise.id]&&isCheckable(exercise));setIndex(first<0?0:first);}
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[part.id]);
 function go(next:number){setResults(false);setIndex(next);try{localStorage.setItem(exKey(part.id),String(next));}catch{}saveLast({part:part.id,step:'alistirmalar',ex:next});requestAnimationFrame(()=>{document.querySelector('.l12-runner')?.scrollIntoView({block:'start',behavior:'smooth'});document.getElementById('l12-ex-'+exercises[next].id)?.focus({preventScroll:true});});}
 function finish(){setResults(true);if(exercises.every(item=>!isCheckable(item)||readScores()[item.id])){sound.prepare();sound.complete();}requestAnimationFrame(()=>{document.querySelector('.l12-runner')?.scrollIntoView({block:'start',behavior:'smooth'});document.getElementById('l12-results')?.focus({preventScroll:true});});}
 const exercise=exercises[index];const checkedCount=exercises.filter(item=>scores[item.id]).length;
 return <div className="l12-runner">
  <div className="object-practice l12-practice">
   <div className="object-practice-top"><span className="object-pill"><PenLine size={14} aria-hidden="true"/>{part.de} · Alıştırmalar</span><span>{results?'Sonuç':`${index+1} / ${total}`}</span></div>
   <progress max={total} value={checkedCount} aria-label={`${checkedCount} / ${total} alıştırma yapıldı`}/>
   <nav className="l12-dots" aria-label="Alıştırmalar">{exercises.map((item,i)=>{const score=scores[item.id];const state=!score?'':score.total>0&&score.right===score.total?' perfect':isCheckable(item)?' partial':' perfect';return <button type="button" key={item.id} className={'l12-dot'+state+(i===index&&!results?' current':'')} aria-current={i===index&&!results?'step':undefined} aria-label={`Alıştırma ${i+1}: ${item.title}`} title={item.title} onClick={()=>go(i)}>{i+1}</button>;})}<button type="button" className={'l12-dot l12-dot-finish'+(results?' current':'')} aria-label="Sonuç" title="Sonuç" onClick={finish}><Trophy size={15} aria-hidden="true"/></button></nav>
  </div>
  {results?<Results part={part} scores={scores} onJump={go} onOpen={onOpen} language={language}/>:<ExerciseView key={exercise.id} exercise={exercise} number={index+1} total={total} onScore={onScore} onNext={()=>index<total-1?go(index+1):finish()} nextLabel={index<total-1?'Sonraki alıştırma':'Sonucu gör'}/>}
 </div>;
}

function Results({part,scores,onJump,onOpen,language}:{part:L12Part;scores:L12ScoreMap;onJump:(index:number)=>void;onOpen:(part:L12PartId|null,step?:L12Step)=>void;language:StudyLanguage}){
 const progress=partProgress(part,scores);const index=lessonParts.findIndex(item=>item.id===part.id);const nextPart=lessonParts[index+1];
 const firstOpen=part.exercises.findIndex(exercise=>{const score=scores[exercise.id];return isCheckable(exercise)&&(!score||score.right<score.total);});
 const test=part.id==='test'?testPoints(part,scores):null;
 const left=part.exercises.filter(exercise=>isCheckable(exercise)&&!scores[exercise.id]).length;
 const percent=test?Math.round(test.points*100/test.max):progress.percent;
 const praise=!progress.tried?'Alıştırmaları yaptıkça sonuçların burada görünür.':left?`Güzel gidiyor! ${left} alıştırma daha var.`:percent>=90?'Harika iş çıkardın!':percent>=60?'Çok iyi, biraz daha tekrar!':'Yanlışlara bir daha bak, sonra tekrar dene.';
 return <section className="panel object-results l12-results" aria-labelledby="l12-results">
  <div className="l12-results-head"><img className="l12-koko" src={KOKO_SRC} alt="" width={400} height={329}/><div><span className="eyebrow" lang="de">{part.de}</span><h2 id="l12-results" tabIndex={-1}>{praise}</h2>
   {test?<p className="vault-result-score">{String(test.points).replace('.',',')} / {test.max} Punkte</p>:<p className="vault-result-score">{progress.learned} / {progress.total} doğru</p>}</div></div>
  {!test&&<ProgressMeter progress={progress} language={language} label={part.de}/>}
  <ol className="l12-result-list">{part.exercises.map((exercise,i)=>{const score=scores[exercise.id];const count=exerciseAnswerCount(exercise);const perfect=!!score&&score.right>=score.total;return <li key={exercise.id}><button type="button" onClick={()=>onJump(i)}>
   <span className={'l12-result-mark'+(score?(perfect||!count?' perfect':' partial'):'')} aria-hidden="true">{score&&(perfect||!count)?<Check size={15}/>:i+1}</span>
   <span className="l12-result-title" lang="de">{exercise.title}</span>
   <span className="l12-result-score">{!count?'Yazma':score?(exercise.points!==undefined&&score.points!==undefined?`${String(score.points).replace('.',',')} / ${String(exercise.points).replace('.',',')} P.`:`${score.right} / ${score.total}`):'—'}</span>
  </button></li>;})}</ol>
  {part.after&&<LessonBlocks blocks={part.after} speech={{speak:()=>{},busy:false}}/>}
  <div className="object-actions">
   {firstOpen>=0&&<button type="button" className="btn secondary" onClick={()=>onJump(firstOpen)}><RotateCcw size={18} aria-hidden="true"/>Eksikleri tamamla</button>}
   {part.listen?<button type="button" className="btn" onClick={()=>onOpen(part.id,'dinleme')}><Headphones size={18} aria-hidden="true"/>Dinlemeye geç</button>:nextPart?<button type="button" className="btn" onClick={()=>onOpen(nextPart.id)}>Sonraki bölüm: {nextPart.de}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>:<button type="button" className="btn" onClick={()=>onOpen(null)}>Lektion 12'ye dön</button>}
  </div>
 </section>;
}

function ListenStep({part}:{part:L12Part}){
 const player=useListenPlayer();
 const tasks=(part.listen??[]).map(number=>tasksByNumber.get(number)).filter((task):task is HoerenTask=>!!task);
 return <div className="l12-step-body">
  <div className="panel l12-listen-head"><div><h2><Headphones size={22} aria-hidden="true"/>Dinleme</h2><p className="l12-p">Kitaptaki gibi: önce metni görmeden iki kez dinle, soruları cevapla, „Kontrol et" de. En son metni açıp dinlerken oku. Dinlerken cümle cümle geri ve ileri gidebilir, hızı 0,5x ile 2x arasında seçebilirsin.</p></div></div>
  {player.warning&&<p className="object-alert" role="status">{player.warning}</p>}
  {tasks.map(task=><ListenTask key={task.id} task={task} player={player}/>)}
 </div>;
}
