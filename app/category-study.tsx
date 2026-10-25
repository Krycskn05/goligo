'use client';
import {browserLanguage,rememberSiteLanguage} from '@/lib/device-language';
import {useEffect,useState} from 'react';
import {Clock} from 'lucide-react';
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
import {housingProgress,type TopicProgress} from '@/lib/progress';
import {ProgressMeter,SidebarProgress} from './progress-ui';
import {HomeTour} from './home-tour';
import {InstallGuide} from './install-guide';
import {SiteMenu} from './site-menu';
import {SiteTour} from './site-tour';
import {GuestBanner} from './guest-taste';

/** home = the welcome page at "/" (Koko's tour of the site); units = the units catalogue at /konular. */
export type HomePage='home'|'units';

/** `guest`: a visitor without an account on /konular (the guest taste: the first part of every section is open). */
export default function CategoryStudy({page='home',guest=false}:{page?:HomePage;guest?:boolean}){
 const [language,setLanguage]=useState<StudyLanguage>('de');
 const [course,setCourse]=useState<LearningLanguage>('de');
 const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 // Old links to the catalogue ("/?level=A1.2") now open it at /konular.
 useEffect(()=>{if(page!=='home')return;const level=new URLSearchParams(window.location.search).get('level');if(level==='A1.1'||level==='A1.2')window.location.replace('/konular?level='+level);},[page]);
 // The saved language is applied once its language pack has loaded (Turkish meanwhile shows the loading line).
 useEffect(()=>{try{setCourse(activeLearningLanguage(localStorage,window.location.search));}catch{}switchLanguage(browserLanguage(),()=>setLoaded(true));},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);rememberSiteLanguage(language);try{saveLearningLanguage(localStorage,course);}catch{}},[language,course,loaded]);
 function changeCourse(value:LearningLanguage){window.speechSynthesis?.cancel();setCourse(value);const url=new URL(window.location.href);url.searchParams.set('learn',value);window.history.replaceState(null,'',url);}
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <Workshop page={page} language={language} onLanguage={switchLanguage} course={course} onCourse={ENGLISH_COURSE_ENABLED?changeCourse:undefined} guest={guest}/>;
}
export function Workshop({page='units',language,onLanguage,course='de',onCourse,guest=false}:{page?:HomePage;language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;course?:LearningLanguage;onCourse?:(value:LearningLanguage)=>void;guest?:boolean}){
 const home=page==='home'&&course==='de';
 const [level,setLevel]=useState<CourseLevel>('A1.1');
 useEffect(()=>{if(new URLSearchParams(window.location.search).get('level')==='A1.2')setLevel('A1.2');},[]);
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
 // Progress is read from the signed-in learner's saved answers; it stays hidden if they cannot be loaded.
 // The home page only introduces the site, so it loads no progress.
 useEffect(()=>{if(course!=='de'||home){setSnapshot(null);return;}let alive=true;api(undefined,'stats=1&tz='+new Date().getTimezoneOffset(),'de').then(next=>{if(alive)setSnapshot(next);}).catch(()=>{if(alive)setSnapshot(null);});return()=>{alive=false;};},[course,home]);
 // Lektion 12 keeps its progress in this browser; its helpers load only when the catalogue needs them.
 const [ausbildung,setAusbildung]=useState<TopicProgress|null>(null);
 // Lektion 1 (Teil A and B) keeps its scores in the browser (lib/willkommen-progress.ts): read them here for the unit card.
 const [willkommen,setWillkommen]=useState<TopicProgress|null>(null);
 useEffect(()=>{if(course!=='de'||home){setWillkommen(null);return;}let alive=true;import('@/lib/willkommen-progress').then(({readLessonOneProgress})=>{if(alive)setWillkommen(readLessonOneProgress());}).catch(()=>{});return()=>{alive=false;};},[course,home]);
 useEffect(()=>{if(course!=='de'||home){setAusbildung(null);return;}let alive=true;import('@/lib/ausbildung-progress').then(({lessonProgress})=>{let scores={};try{scores=JSON.parse(localStorage.getItem('lernkoko-l12-scores')??'{}')??{};}catch{}if(alive)setAusbildung(lessonProgress(scores));}).catch(()=>{});return()=>{alive=false;};},[course,home]);
 const allUnits=course==='en'?englishCourseUnits:courseUnits;
 const units=allUnits.filter(unit=>unit.level===level);
 return <div className="category-app toon-app" dir={languageDirection(language)} lang={language}>
  <a className="skip-link" href="#main">{t(language,'skip')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value))onLanguage(value);}} homeHref={'/?learn='+course} homeLabel={t(language,'home')} showHome={false} guest={guest}/>
  <div className="work-layout"><aside className="work-sidebar"><SiteMenu language={language} current={home?'home':'units'} course={course} unitsHref={home?'/konular':'#curriculum'}/><InstallGuide language={language}/>{course==='de'&&!home&&snapshot?.stats&&<SidebarProgress stats={snapshot.stats} reviews={snapshot.reviews} language={language} housingLabel={housingText(language,'title')} vaultLabel={vaultText(language,'vaultTitle')} verbsLabel={verbText(language,'verbsTitle')}/>}</aside>
   <main id="main" className="work-main" tabIndex={-1}>
    {guest&&<GuestBanner language={language} back="/konular"/>}
    {onCourse&&<CourseSelector course={course} language={language} onChange={onCourse}/>}
    {home?<><HomeTour language={language}/><SiteTour language={language}/></>:<>
    <section className="toon-hero"><div><span className="eyebrow">{learningText(language,course)}</span><h1 id="work-heading" tabIndex={-1}>{c(language,'catalogTitle')}</h1></div><div className="toon-hero-art"><HeroArt/></div></section>
    {/* The catalogue as a spiral notebook: level tabs, ruled paper, unit photos taped onto the page. */}
    <section id="curriculum" className="nb" aria-labelledby="curriculum-heading">
     <div className="nb-tabs" role="group" aria-label={c(language,'levelLabel')}>{(['A1.1','A1.2'] as const).map(value=><button type="button" key={value} className={level===value?'active':''} aria-pressed={level===value} onClick={()=>setLevel(value)}><strong>{value}</strong><span>{c(language,'categories')}</span></button>)}</div>
     <div className="nb-book">
      <div className="nb-spiral" aria-hidden="true">{Array.from({length:30},(_,i)=><span key={i}/>)}</div>
      <div className="nb-page">
       <h2 id="curriculum-heading" className="nb-title">{level} · {c(language,'categories')}</h2>
       <ul className="nb-grid">{units.map((unit,i)=>{const title=translate(unit.names,language);const lesson=course==='de'?unit.id==='book-01'?'/a1-1/willkommen':unit.id==='book-11'?'/a1-2/ev-ve-yasam':unit.id==='book-12'?'/a1-2/ausbildung':null:null;const progress=course!=='de'?null:unit.id==='book-01'?willkommen:unit.id==='book-11'&&snapshot?housingProgress('all',snapshot.reviews):unit.id==='book-12'?ausbildung:null;
        return <li className={'nb-card tape-'+(i%4)+(lesson?' has-lesson':'')} key={unit.id} data-unit={unit.id}>
         <span className="nb-tape" aria-hidden="true"/>
         <div className="nb-photo"><TopicArt id={unit.id.replace(/^en-/,'')} title={title}/></div>
         <span className="nb-num" lang={course} dir="ltr">{course==='de'?'Lektion':'Unit'} {unit.number}</span>
         <h3>{title}</h3>{language!==course&&<p lang={course} dir="ltr">{unit.de}</p>}
         {progress&&<ProgressMeter progress={progress} language={language} label={title} compact/>}
         {lesson?<a className="btn small housing-open" href={lesson} data-l12-open={unit.id==='book-12'?'':undefined}>{housingText(language,'open')}</a>:<span className="nb-soon"><Clock size={15} aria-hidden="true"/>{c(language,'comingSoon')}</span>}
        </li>;})}</ul>
      </div>
     </div>
    </section>
    </>}
   </main>
  </div><SiteFooter language={language}/>
 </div>;
}
