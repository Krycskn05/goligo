'use client';
import {useEffect,useState} from 'react';
import {BookOpen,Image as ImageIcon,PenLine,RotateCcw,Trophy} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {courseUnits,type CourseLevel} from '@/lib/textbook-curriculum';
import {englishCourseUnits} from '@/lib/english-course';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {verbText} from '@/lib/verb-copy';
import {t,translate,studyLanguages,isStudyLanguage,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {useLanguageSwitch} from './language-switch';
import {ENGLISH_COURSE_ENABLED,activeLearningLanguage,learningText,saveLearningLanguage,type LearningLanguage} from '@/lib/learning-language';
import {TopicArt,HeroArt} from './toon-art';
import {CourseSelector} from './course-selector';
import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';
import {housingText} from '@/lib/housing-copy';
import type {Snapshot} from '@/lib/study';
import {api} from './study-shared';
import {housingProgress} from '@/lib/progress';
import {ProgressMeter,SidebarProgress} from './progress-ui';

export default function CategoryStudy(){
 const [language,setLanguage]=useState<StudyLanguage>('tr');
 const [course,setCourse]=useState<LearningLanguage>('de');
 const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 // The saved language is applied once its language pack has loaded (Turkish meanwhile shows the loading line).
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem('german-study-language');setCourse(activeLearningLanguage(localStorage,window.location.search));}catch{}if(saved&&isStudyLanguage(saved))switchLanguage(saved,()=>setLoaded(true));else setLoaded(true);},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);try{localStorage.setItem('german-study-language',language);saveLearningLanguage(localStorage,course);}catch{}},[language,course,loaded]);
 function changeCourse(value:LearningLanguage){window.speechSynthesis?.cancel();setCourse(value);const url=new URL(window.location.href);url.searchParams.set('learn',value);window.history.replaceState(null,'',url);}
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <Workshop language={language} onLanguage={switchLanguage} course={course} onCourse={ENGLISH_COURSE_ENABLED?changeCourse:undefined}/>;
}
export function Workshop({language,onLanguage,course='de',onCourse}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;course?:LearningLanguage;onCourse?:(value:LearningLanguage)=>void}){
 const [level,setLevel]=useState<CourseLevel>('A1.1');
 useEffect(()=>{if(new URLSearchParams(window.location.search).get('level')==='A1.2')setLevel('A1.2');},[]);
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
 // Progress is read from the signed-in learner's saved answers; it stays hidden if they cannot be loaded.
 useEffect(()=>{if(course!=='de'){setSnapshot(null);return;}let alive=true;api(undefined,'stats=1&tz='+new Date().getTimezoneOffset(),'de').then(next=>{if(alive)setSnapshot(next);}).catch(()=>{if(alive)setSnapshot(null);});return()=>{alive=false;};},[course]);
 const allUnits=course==='en'?englishCourseUnits:courseUnits;
 const units=allUnits.filter(unit=>unit.level===level);
 return <div className="category-app toon-app" dir={languageDirection(language)} lang={language}>
  <a className="skip-link" href="#main">{t(language,'skip')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value))onLanguage(value);}} homeHref={'/?learn='+course} homeLabel={t(language,'home')} showHome={false}/>
  <div className="work-layout"><aside className="work-sidebar"><nav aria-label={t(language,'home')}><a className="work-nav active" href="#curriculum" aria-current="page"><BookOpen size={18}/>{c(language,'catalogTitle')}</a><a className="work-nav object-nav-link" href={'/ev-esyalar?learn='+course}><ImageIcon size={18}/>{vaultText(language,'vaultTitle')}</a>{course==='de'&&<><a className="work-nav object-nav-link verb-nav-link" href="/fiiller"><PenLine size={18}/>{verbText(language,'workshopTitle')}</a><div className="work-subnav"><a className="work-nav work-subnav-link" href="/fiiller?bolum=oyunlar" data-verb-section-link="games"><Trophy size={16} aria-hidden="true"/>{verbText(language,'gamesTitle')}</a><a className="work-nav work-subnav-link" href="/fiiller?bolum=yanlislar" data-verb-section-link="mistakes"><RotateCcw size={16} aria-hidden="true"/>{verbText(language,'mistakesTitle')}</a></div></>}</nav>{course==='de'&&snapshot?.stats&&<SidebarProgress stats={snapshot.stats} reviews={snapshot.reviews} language={language} housingLabel={housingText(language,'title')} vaultLabel={vaultText(language,'vaultTitle')} verbsLabel={verbText(language,'verbsTitle')}/>}</aside>
   <main id="main" className="work-main" tabIndex={-1}>
    {onCourse&&<CourseSelector course={course} language={language} onChange={onCourse}/>}
    <section className="toon-hero"><div><span className="eyebrow">{learningText(language,course)}</span><h1 id="work-heading" tabIndex={-1}>{c(language,'catalogTitle')}</h1></div><div className="toon-hero-art"><HeroArt/></div></section>
    <div className="toon-level-switch" role="group" aria-label={c(language,'levelLabel')}>{(['A1.1','A1.2'] as const).map(value=><button type="button" key={value} className={level===value?'active':''} aria-pressed={level===value} onClick={()=>setLevel(value)}><strong>{value}</strong><span>{c(language,'categories')}</span></button>)}</div>
    <section id="curriculum" aria-labelledby="curriculum-heading"><div className="toon-curriculum-head"><h2 id="curriculum-heading">{level} · {c(language,'categories')}</h2></div><div className="category-grid toon-topic-grid">{units.map(unit=>{const title=translate(unit.names,language);return <article className="category-card toon-topic-card catalog-topic-card" key={unit.id} data-unit={unit.id}><div className="catalog-topic-content"><div className="toon-topic-art"><TopicArt id={unit.id.replace(/^en-/,'')} title={title}/><span className="toon-card-number">{String(unit.number).padStart(2,'0')}</span></div><h3>{title}</h3>{language!==course&&<p lang={course} dir="ltr">{unit.de}</p>}{course==='de'&&unit.id==='book-11'&&snapshot&&<ProgressMeter progress={housingProgress('all',snapshot.reviews)} language={language} label={title} compact/>}{course==='de'&&unit.id==='book-11'&&<a className="btn small housing-open" href="/a1-2/ev-ve-yasam">{housingText(language,'open')}</a>}{course==='de'&&unit.id==='book-12'&&<a className="btn small housing-open" href="/a1-2/ausbildung" data-l12-open="">{housingText(language,'open')}</a>}</div></article>;})}</div></section>
   </main>
  </div><SiteFooter/>
 </div>;
}
