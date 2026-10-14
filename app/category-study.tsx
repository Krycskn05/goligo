'use client';
import {useEffect,useState} from 'react';
import {BookOpen,Image as ImageIcon} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {SiteLogo} from './site-logo';
import {courseUnits,type CourseLevel} from '@/lib/textbook-curriculum';
import {englishCourseUnits} from '@/lib/english-course';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {t,translate,studyLanguages,isStudyLanguage,type StudyLanguage} from '@/lib/study-languages';
import {ENGLISH_COURSE_ENABLED,activeLearningLanguage,learningText,saveLearningLanguage,type LearningLanguage} from '@/lib/learning-language';
import {TopicArt,HeroArt} from './toon-art';
import {CourseSelector} from './course-selector';
import {SiteFooter} from './site-footer';
import {EffectsSettingsButton} from './learning-effects';
import {housingText} from '@/lib/housing-copy';

export default function CategoryStudy(){
 const [language,setLanguage]=useState<StudyLanguage>('tr');
 const [course,setCourse]=useState<LearningLanguage>('de');
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem('german-study-language');if(saved&&isStudyLanguage(saved))setLanguage(saved);setCourse(activeLearningLanguage(localStorage,window.location.search));}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';try{localStorage.setItem('german-study-language',language);saveLearningLanguage(localStorage,course);}catch{}},[language,course,loaded]);
 function changeCourse(value:LearningLanguage){window.speechSynthesis?.cancel();setCourse(value);const url=new URL(window.location.href);url.searchParams.set('learn',value);window.history.replaceState(null,'',url);}
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <Workshop language={language} onLanguage={setLanguage} course={course} onCourse={ENGLISH_COURSE_ENABLED?changeCourse:undefined}/>;
}
export function Workshop({language,onLanguage,course='de',onCourse}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;course?:LearningLanguage;onCourse?:(value:LearningLanguage)=>void}){
 const [level,setLevel]=useState<CourseLevel>('A1.1');
 useEffect(()=>{if(new URLSearchParams(window.location.search).get('level')==='A1.2')setLevel('A1.2');},[]);
 const allUnits=course==='en'?englishCourseUnits:courseUnits;
 const units=allUnits.filter(unit=>unit.level===level);
 return <div className="category-app toon-app" dir={language==='ar'?'rtl':'ltr'} lang={language}>
  <a className="skip-link" href="#main">{t(language,'skip')}</a>
  <header className="work-header logo-header"><a className="work-brand site-logo-brand" href={'/?learn='+course} aria-label={SITE_NAME+' · '+t(language,'home')}><SiteLogo/></a><label className="language-picker">{learningText(language,'helper')}<select value={language} onChange={event=>{if(isStudyLanguage(event.target.value))onLanguage(event.target.value);}}>{studyLanguages.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label><EffectsSettingsButton language={language}/></header>
  <div className="work-layout"><aside className="work-sidebar"><nav aria-label={t(language,'home')}><a className="work-nav active" href="#curriculum" aria-current="page"><BookOpen size={18}/>{c(language,'catalogTitle')}</a><a className="work-nav object-nav-link" href={'/ev-esyalar?learn='+course}><ImageIcon size={18}/>{vaultText(language,'vaultTitle')}</a></nav></aside>
   <main id="main" className="work-main" tabIndex={-1}>
    {onCourse&&<CourseSelector course={course} language={language} onChange={onCourse}/>}
    <section className="toon-hero"><div><span className="eyebrow">{learningText(language,course)}</span><h1 id="work-heading" tabIndex={-1}>{c(language,'catalogTitle')}</h1><p>{c(language,'catalogHint')}</p></div><div className="toon-hero-art"><HeroArt/></div></section>
    <div className="toon-level-switch" role="group" aria-label={c(language,'levelLabel')}>{(['A1.1','A1.2'] as const).map(value=><button type="button" key={value} className={level===value?'active':''} aria-pressed={level===value} onClick={()=>setLevel(value)}><strong>{value}</strong><span>{c(language,'categories')}</span></button>)}</div>
    <section id="curriculum" aria-labelledby="curriculum-heading"><div className="toon-curriculum-head"><h2 id="curriculum-heading">{level} · {c(language,'categories')}</h2></div><div className="category-grid toon-topic-grid">{units.map(unit=>{const title=translate(unit.names,language);return <article className="category-card toon-topic-card catalog-topic-card" key={unit.id} data-unit={unit.id}><div className="catalog-topic-content"><div className="toon-topic-art"><TopicArt id={unit.id.replace(/^en-/,'')} title={title}/><span className="toon-card-number">{String(unit.number).padStart(2,'0')}</span></div><h3>{title}</h3>{language!==course&&<p lang={course} dir="ltr">{unit.de}</p>}{course==='de'&&unit.id==='book-11'&&<a className="btn small housing-open" href="/a1-2/ev-ve-yasam">{housingText(language,'open')}</a>}</div></article>;})}</div></section>
   </main>
  </div><SiteFooter/>
 </div>;
}
