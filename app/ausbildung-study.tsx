'use client';
import {useCallback,useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Headphones,PenLine} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,translate,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {courseUnits} from '@/lib/textbook-curriculum';
import {housingText} from '@/lib/housing-copy';
import {AUSBILDUNG_PATH,lessonParts,lessonPartMap,lessonRoadmap,turkishNote,type L12Part,type L12PartId} from '@/lib/ausbildung-course';
import {useLanguageSwitch} from './language-switch';
import {useGermanSpeech} from './study-shared';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {TopicArt} from './toon-art';
import {ExerciseCard,LessonBlocks,Rich,readScores,type ScoreMap} from './ausbildung-ui';

const unit=courseUnits.find(item=>item.id==='book-12')!;
const partParam=(value:string|null):L12PartId|null=>value&&lessonPartMap.has(value as L12PartId)?value as L12PartId:null;

/** Lektion 12 „Ausbildung": overview of the parts and one part at a time (?bolum=a … magazin). */
export default function AusbildungStudy(){
 const [language,setLanguage]=useState<StudyLanguage>('tr');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem('german-study-language');}catch{}if(saved&&isStudyLanguage(saved))switchLanguage(saved,()=>setLoaded(true));else setLoaded(true);},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title='Lektion 12 · Ausbildung · '+SITE_NAME;try{localStorage.setItem('german-study-language',language);}catch{}},[language,loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <AusbildungLesson language={language} onLanguage={switchLanguage}/>;
}

export function AusbildungLesson({language,onLanguage}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void}){
 const [part,setPart]=useState<L12PartId|null>(null);
 const [scores,setScores]=useState<ScoreMap>({});
 const speech=useGermanSpeech('de');
 const refreshScores=useCallback(()=>setScores(readScores()),[]);
 useEffect(()=>{
  const read=()=>setPart(partParam(new URLSearchParams(window.location.search).get('bolum')));
  read();refreshScores();window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read);
 },[refreshScores]);
 function open(next:L12PartId|null){
  speech.stop();setPart(next);refreshScores();
  try{const url=new URL(window.location.href);if(next)url.searchParams.set('bolum',next);else url.searchParams.delete('bolum');url.hash='';window.history.pushState(null,'',url);}catch{}
  requestAnimationFrame(()=>{document.getElementById('l12-heading')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});
 }
 const current=part?lessonPartMap.get(part):undefined;
 const unitName=translate(unit.names,language);
 return <div className="category-app toon-app l12-app" lang={language} dir={languageDirection(language)}>
  <a className="skip-link" href="#l12-main">{housingText(language,'back')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value)){speech.stop();onLanguage(value);}}} homeHref="/?learn=de&level=A1.2" homeLabel={housingText(language,'back')}/>
  <main id="l12-main" className="object-page l12-page" lang="tr" dir="ltr">
   <div className="object-breadcrumb"><a href="/?learn=de&level=A1.2">A1.2</a><span aria-hidden="true">›</span>{current?<><a href={AUSBILDUNG_PATH} onClick={event=>{event.preventDefault();open(null);}}>Lektion 12 · Ausbildung</a><span aria-hidden="true">›</span><span>{current.de}</span></>:<span>Lektion 12 · Ausbildung</span>}</div>
   {language!=='tr'&&turkishNote[language]&&<p className="l12-language-note" lang={language} dir={languageDirection(language)}>{turkishNote[language]}</p>}
   {speech.warning&&<p className="object-alert" role="status">{speech.warning}</p>}
   {current?<PartView part={current} scores={scores} speech={{speak:text=>speech.speak(text),busy:speech.busy}} onScore={refreshScores} onOpen={open}/>:<Overview unitName={unitName} scores={scores} onOpen={open}/>}
  </main>
  <SiteFooter/>
 </div>;
}

function partProgress(part:L12Part,scores:ScoreMap){
 const checkable=part.exercises.filter(exercise=>exercise.items.some(item=>item.k!=='open'));
 const done=checkable.filter(exercise=>scores[exercise.id]).length;
 const perfect=checkable.filter(exercise=>{const score=scores[exercise.id];return score&&score.total>0&&score.right===score.total;}).length;
 return {done,perfect,total:checkable.length};
}

function Overview({unitName,scores,onOpen}:{unitName:string;scores:ScoreMap;onOpen:(part:L12PartId)=>void}){
 const testScore=lessonPartMap.get('test')!.exercises.reduce((sum,exercise)=>sum+(scores[exercise.id]?.points??0),0);
 const testDone=lessonPartMap.get('test')!.exercises.some(exercise=>scores[exercise.id]);
 return <section aria-labelledby="l12-heading">
  <div className="toon-hero l12-hero"><div><span className="eyebrow">A1.2 · 12 · {unitName}</span><h1 id="l12-heading" tabIndex={-1}>Lektion 12 · Ausbildung</h1><p>Kitap sırasıyla: önce kelimeler, sonra gramer, sonra kitaptaki gibi alıştırmalar. Her bölümün sonunda cevap anahtarı var.</p></div><div className="toon-hero-art"><TopicArt id="book-12" title={unitName}/></div></div>
  <ol className="l12-roadmap">{lessonRoadmap.map((step,i)=><li key={i}><Rich text={step}/></li>)}</ol>
  <div className="l12-part-grid">{lessonParts.map(part=>{const progress=partProgress(part,scores);return <button type="button" key={part.id} className={'panel l12-part-card l12-tone-'+part.id} data-l12-part={part.id} onClick={()=>onOpen(part.id)}>
   <span className="l12-badge" aria-hidden="true">{part.badge}</span>
   <span className="l12-part-text"><small lang="de">{part.de}</small><strong lang="de">{part.title}</strong><span><Rich text={part.card??part.lead}/></span>
    <span className="l12-part-progress">{part.id==='test'&&testDone?`${String(testScore).replace('.',',')} / 25 Punkte`:progress.total?<>{progress.done===progress.total&&progress.total>0?<CheckCircle2 size={15} aria-hidden="true"/>:<PenLine size={15} aria-hidden="true"/>}{progress.done} / {progress.total} alıştırma</>:null}</span>
   </span>
   <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
  </button>;})}
   <a className="panel l12-part-card l12-tone-hoeren" href={AUSBILDUNG_PATH+'/hoeren'} data-l12-part="hoeren"><span className="l12-badge" aria-hidden="true"><Headphones size={22}/></span><span className="l12-part-text"><small lang="de">Hören</small><strong lang="de">Lektion 12 – Hören</strong><span>14 dinleme bölümü: Teil A–D, Richtig schreiben ve Prüfungstraining. Metinleri site sesi okur.</span></span><ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/></a>
  </div>
 </section>;
}

function PartView({part,scores,speech,onScore,onOpen}:{part:L12Part;scores:ScoreMap;speech:{speak:(text:string)=>void;busy:boolean};onScore:()=>void;onOpen:(part:L12PartId|null)=>void}){
 const index=lessonParts.findIndex(item=>item.id===part.id);const previous=lessonParts[index-1];const next=lessonParts[index+1];
 const progress=partProgress(part,scores);
 return <section className="l12-part" aria-labelledby="l12-heading">
  <button type="button" className="text-button verb-back" onClick={()=>onOpen(null)}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>Lektion 12</button>
  <header className={'panel l12-part-head l12-tone-'+part.id}><span className="l12-badge" aria-hidden="true">{part.badge}</span><div><span className="eyebrow" lang="de">Lektion 12 · {part.de}</span><h1 id="l12-heading" tabIndex={-1} lang="de">{part.title}</h1><p><Rich text={part.lead}/></p>{progress.total>0&&<p className="l12-part-progress">{progress.done} / {progress.total} alıştırma kontrol edildi</p>}</div></header>
  {(part.sections.length>0||part.exercises.length>0)&&<nav className="l12-jump" aria-label="Bölüm içinde git">{part.sections.map(section=><a key={section.id} href={'#sec-'+section.id}><BookOpen size={15} aria-hidden="true"/>{section.title.split(':')[0]}</a>)}<a href="#alistirmalar"><PenLine size={15} aria-hidden="true"/>{part.id==='test'?'Test':'Alıştırmalar'}</a>{part.listen&&<a href={AUSBILDUNG_PATH+'/hoeren#bolum-'+part.listen[0]}><Headphones size={15} aria-hidden="true"/>Dinleme</a>}</nav>}
  {part.sections.map(section=><article key={section.id} id={'sec-'+section.id} className="panel l12-section"><h2>{section.title}</h2><LessonBlocks blocks={section.blocks} speech={speech}/></article>)}
  <h2 id="alistirmalar" className="l12-exercises-title">{part.id==='test'?'Test':'Alıştırmalar – '+part.de}</h2>
  {part.id!=='test'&&part.id!=='magazin'&&part.id!=='pruefung'&&<p className="l12-exercise-tip">Cevabını yaz, „Kontrol et" de. Takılırsan „Cevap anahtarı" ile doğru cevabı görürsün. Cevapların bu cihazda saklanır.</p>}
  {part.exercises.map(exercise=><ExerciseCard key={exercise.id} exercise={exercise} onScore={onScore}/>)}
  {part.after&&<LessonBlocks blocks={part.after} speech={speech}/>}
  {part.id==='test'&&<TestTotal part={part} scores={scores}/>}
  {part.listen&&<a className="panel l12-listen-card" href={AUSBILDUNG_PATH+'/hoeren#bolum-'+part.listen[0]}><Headphones size={26} aria-hidden="true"/><span><strong>Hören · {part.listen.length>1?`bölüm ${part.listen[0]}–${part.listen[part.listen.length-1]}`:`bölüm ${part.listen[0]}`}</strong><span>Önce metni görmeden iki kez dinle, sonra cevapla.</span></span><ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/></a>}
  <nav className="l12-pager" aria-label="Bölümler">{previous?<button type="button" className="btn secondary" onClick={()=>onOpen(previous.id)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>{previous.de}</button>:<span/>}{next?<button type="button" className="btn" onClick={()=>onOpen(next.id)}>{next.de}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>:<a className="btn" href={AUSBILDUNG_PATH+'/hoeren'}>Hören<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></a>}</nav>
 </section>;
}

function TestTotal({part,scores}:{part:L12Part;scores:ScoreMap}){
 const checked=part.exercises.filter(exercise=>scores[exercise.id]);
 if(!checked.length)return null;
 const total=part.exercises.reduce((sum,exercise)=>sum+(scores[exercise.id]?.points??0),0);
 return <p className="panel l12-test-total" role="status"><strong>Toplam: {String(total).replace('.',',')} / 25 Punkte</strong>{checked.length<part.exercises.length?<span> · {part.exercises.length-checked.length} bölüm daha kontrol edilmedi</span>:null}</p>;
}
