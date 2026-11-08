'use client';
import {paulMood} from './paul-hoca';
import {browserLanguage,rememberSiteLanguage} from '@/lib/device-language';
import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Check,Lock} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,translate,type StudyLanguage} from '@/lib/study-languages';
import {courseUnits} from '@/lib/textbook-curriculum';
import {languageDirection} from '@/lib/site-languages';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {turkishNote} from '@/lib/ausbildung-course';
import type {L1AScoreMap} from '@/lib/willkommen-progress';
import type {StepGroup} from '@/lib/willkommen-course';
import type {AlltagPart,AlltagStep,PartId} from '@/lib/alltag-types';
import {ALLTAG_PATH,ALLTAG_UNIT,alltagParts,alltagPartList,alltagPartOrder,alltagGoals,alltagGroups,alltagScored,alltagWordCount,isAlltagPart} from '@/lib/alltag-course';
import {L5_PART_KEY,l5PartKeys,readL5Scores,saveL5Score,partProgressL5} from '@/lib/alltag-progress';
import type {TopicProgress} from '@/lib/progress';
import {useLanguageSwitch} from './language-switch';
import {useAnswerSound} from './study-shared';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {SiteMenuAside} from './site-menu';
import {ProgressMeter} from './progress-meter';
import {GuestBanner} from './guest-taste';
import {LessonBook} from './lesson-book';
import {TopicArt} from './toon-art';
import {useLessonSpeech,Rich,Tx,StepStrip,exerciseLock,LockedStep} from './willkommen-ui';
import {hasUnitPack,loadUnitPack,setUnitLanguage,ut} from '@/lib/unit-i18n';
import {StepViewL5} from './alltag-steps';
import {useSyncVersion} from './lesson-sync';
import {saveLastPlace,lessonStepHref} from '@/lib/last-place';
import {OneScreenStep,oneScreenDesign} from './paged-step';

/**
 * Lektion 5 „Alltag und Freizeit“ (A1.1): the contents page is an open notebook like Lektion 1–4 and 15 (Teil A – Hast du
 * Zeit?, B – Das sind meine Tipps., C – Boxen macht Spaß!, D – Mein Hobby ist auch mein Beruf.; the learner asked,
 * 8 November 2026). A part opens on a wide spread, one step at a time: words first, then the topics, the exercises in
 * order, the test (Teil D: „Alles klar?“ over the whole unit), Konuş and Bitti. The steps are data (lib/alltag-*.ts)
 * drawn by app/alltag-steps.tsx; scores stay in the browser (lib/alltag-progress.ts) and travel with the account
 * (lesson `l5`; the learner's own sentences stay on the device).
 */
export default function AlltagStudy({guest=false}:{guest?:boolean}){
 const [language,setLanguage]=useState<StudyLanguage>('de');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage,loadUnitPack); // the lesson's own texts (lib/unit-i18n.ts) load with the language
 useEffect(()=>{switchLanguage(browserLanguage(),()=>setLoaded(true));},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title='Lektion 5 · Alltag und Freizeit · '+SITE_NAME;rememberSiteLanguage(language);},[language,loaded]);
 const synced=useSyncVersion('l5'); // progress from another device: read it again (app/lesson-sync.tsx)
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <AlltagLesson key={synced} language={language} onLanguage={switchLanguage} guest={guest}/>;
}

/** A part with what the page needs: its steps, tabs and counts. */
type PartConfig=AlltagPart&{groups:StepGroup[];scored:{id:string;total:number}[];testCount:number;wordCount:number};
const parts=Object.fromEntries(alltagPartList.map(part=>[part.id,{...part,groups:alltagGroups(part),scored:alltagScored[part.id],testCount:part.steps.find(step=>step.test)?.test?.length??0,wordCount:alltagWordCount[part.id]}])) as Record<PartId,PartConfig>;

/** Where the learner is: a part and a step (`?adim=<id>`; a later part with `teil`), or the contents page (index -1). */
type Place={part:PartId;index:number};
function readPlace():Place{
 const params=new URLSearchParams(window.location.search);const teil=params.get('teil')??'a';const part:PartId=isAlltagPart(teil)?teil:'a';
 return {part,index:parts[part].steps.findIndex(step=>step.id===(params.get('adim')??''))};
}

function AlltagLesson({language,onLanguage,guest}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;guest:boolean}){
 setUnitLanguage(language); // every step below shows its Turkish texts in this language (lib/unit-i18n.ts)
 const [place,setPlace]=useState<Place>(()=>typeof window==='undefined'?{part:'a',index:-1}:readPlace());
 const [scores,setScores]=useState<Record<PartId,L1AScoreMap>>({a:{},b:{},c:{},d:{}});
 const speech=useLessonSpeech();const sound=useAnswerSound();
 // useAnswerSound gives a new object on every render: keep the latest speech and sound in a ref (see Lektion 1 and 2).
 const latest=useRef({speech,sound});latest.current={speech,sound};
 useEffect(()=>{setScores({a:readL5Scores('a'),b:readL5Scores('b'),c:readL5Scores('c'),d:readL5Scores('d')});},[]);
 useEffect(()=>{const pop=()=>{latest.current.speech.stop();latest.current.sound.stop();setPlace(readPlace());};window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 /** Opens a step of a part; a negative number opens the contents page. */
 const open=useCallback((part:PartId,next:number)=>{
  const target=next<0?-1:Math.min(parts[part].steps.length-1,next);latest.current.speech.stop();latest.current.sound.stop();setPlace({part,index:target});
  try{
   const url=new URL(window.location.href);
   if(target<0){url.searchParams.delete('adim');url.searchParams.delete('teil');}
   else{if(part==='a')url.searchParams.delete('teil');else url.searchParams.set('teil',part);url.searchParams.set('adim',parts[part].steps[target].id);}
   window.history.pushState(null,'',url);
  }catch{}
  requestAnimationFrame(()=>{
   const tabs=target>=0?document.getElementById('l1a-tabs'):null;
   if(!tabs)window.scrollTo({top:0,behavior:'instant'});
   else{const top=tabs.getBoundingClientRect().top;if(top<0||top>window.innerHeight*0.45)tabs.scrollIntoView({block:'start',behavior:'instant'});}
   document.getElementById('l1a-heading')?.focus({preventScroll:true});
  });
 },[]);
 const go=useCallback((next:number)=>open(place.part,next),[open,place.part]);
 const toPart=useCallback((part:string,next:number)=>{if(isAlltagPart(part))open(part,next);},[open]);
 // The step the learner is on stays saved for "Kaldığın yerden devam et" (lib/last-place.ts).
 useEffect(()=>{if(place.index>=0)try{const step=parts[place.part].steps[place.index];localStorage.setItem(l5PartKeys[place.part].step,step.id);localStorage.setItem(L5_PART_KEY,place.part);
  saveLastPlace(localStorage,{id:'alltag',href:lessonStepHref('alltag',place.part,step.id),detail:'Lektion 5 · Teil '+parts[place.part].badge+' · '+step.title});}catch{}},[place]);
 // An exercise that shows one item at a time takes the page's İleri for its next item first (app/willkommen-ui.tsx `useInnerNext`).
 const innerNext=useRef<(()=>boolean)|null>(null);
 // The one-screen design proposal (app/paged-step.tsx, ?tasarim=tek): the whole step on one screen.
 const [design]=useState(oneScreenDesign);
 const setInnerNext=useCallback((next:(()=>boolean)|null)=>{innerNext.current=next;},[]);
 const [lockNote,setLockNote]=useState<string|null>(null);
 const forward=(next:number)=>{
  if(innerNext.current?.()){requestAnimationFrame(()=>{const heading=document.getElementById('l1a-heading');if(heading&&heading.getBoundingClientRect().top<0)heading.scrollIntoView({block:'start',behavior:'smooth'});});return;}
  if(mustFinish&&step){setLockNote(step.id);return;}
  go(next);
 };
 const score=useCallback((id:string,right:number,total:number)=>{const part=place.part;setScores(previous=>({...previous,[part]:saveL5Score(part,id,right,total)}));},[place.part]);
 // A teaching step counts as done once it is opened (like Lektion 2 and 3).
 useEffect(()=>{if(place.index<0)return;const step=parts[place.part].steps[place.index];if(step.kind!=='teach')return;const part=place.part;if(!readL5Scores(part)[step.id])setScores(previous=>({...previous,[part]:saveL5Score(part,step.id,1,1)}));},[place]);
 const config=parts[place.part];const index=place.index;const step:AlltagStep|null=index>=0?config.steps[index]:null;
 const stepGroup=step?config.groups.find(item=>item.ids.includes(step.id)):undefined;
 const trackGroup=stepGroup&&stepGroup.ids.length>1?stepGroup:undefined;
 // Exercises in order; the test and Konuş after all of them.
 const lock=exerciseLock(config.groups,config.steps,scores[place.part]);
 const stepLocked=!!step&&lock.locked.has(step.id);
 const mustFinish=!!step&&lock.isExercise(step.id)&&!scores[place.part][step.id];
 const openLabel=lock.open?(config.short[lock.open]??config.steps[lock.openIndex]?.title??''):'';
 const progress=partProgressL5(place.part,scores[place.part]);
 const dir=languageDirection(language);
 return <div className={"category-app toon-app housing-app l12-app l1a-app l15-app l2-app l5-app"+(design&&step?" l5-onescreen":"")} lang={language} dir={dir}>
  <a className="skip-link" href="#l5-main">{vaultText(language,'skipContent')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value)){speech.stop();onLanguage(value);}}} homeHref="/konular?level=A1.1" homeLabel={c(language,'catalogTitle')} guest={guest}/>
  <div className="work-layout site-layout">{!(design&&step)&&<SiteMenuAside language={language} current="units"/>}
  <main id="l5-main" className="object-page housing-page l1a-page l15-page l2-page l5-page" lang={language} dir={dir}>
   {guest&&<GuestBanner language={language} back={ALLTAG_PATH}/>}
   {language!=='tr'&&!hasUnitPack(language)&&turkishNote[language]&&<p className="object-alert l12-language-note" lang={language} dir={dir}>{turkishNote[language]}</p>}
   {speech.warning&&<p className="object-alert" role="status">{language==='tr'?speech.warning:vaultText(language,'audioWarning')}</p>}
   {!step?<Contents language={language} scores={scores} onOpen={open}/>:<PartBook config={config} step={step} progress={progress} scores={scores[place.part]} language={language} onGo={go} onPart={open}>
    <section className="panel l1a-card" aria-labelledby="l1a-heading" data-l5-step={step.id} data-l5-teil={config.id} data-paul-mood={paulMood(step)}>
     <header className="l1a-top">
      <div className="l1a-top-row"><span className="eyebrow">{ut(stepGroup?.label)??'Teil '+config.badge}</span><span className="l1a-where">{trackGroup?`${trackGroup.ids.indexOf(step.id)+1} / ${trackGroup.ids.length}`:<>{ut(step.title)} · {index+1}/{config.steps.length}</>}</span></div>
      {trackGroup?<StepStrip track label={trackGroup.label} current={step.id} scores={scores[place.part]} onOpen={go} items={trackGroup.ids.map((id,i)=>({id,index:config.steps.findIndex(entry=>entry.id===id),number:i+1,label:config.short[id]??config.steps.find(entry=>entry.id===id)?.title??id,locked:lock.locked.has(id)})).map(item=>item.locked?{...item,index:lock.openIndex}:item)}/>
      :<div className="l1a-bar" role="progressbar" aria-valuemin={0} aria-valuemax={config.steps.length} aria-valuenow={index+1} aria-label={ut(step.title)}><i style={{width:((index+1)/config.steps.length*100)+'%'}}/></div>}
     </header>
     {(()=>{const view=stepLocked?<LockedStep openLabel={openLabel} onOpen={()=>go(lock.openIndex)}/>:<StepViewL5 key={config.id+':'+step.id} alltagStep={step} part={config.id} badge={config.badge} partTitle={config.title} step={step} speech={speech} sound={sound} scores={scores[place.part]} progress={progress} onScore={score} onGo={go} onPart={toPart} language={language} setInnerNext={setInnerNext} runKey={'lernkoko-l5'+place.part+'-run'}/>;
      return design?<OneScreenStep key={config.id+':'+step.id}>{view}</OneScreenStep>:view;})()}
     <nav className="l1a-pager" aria-label={ut('Adımlar')}>
      <button type="button" className="btn secondary" onClick={()=>go(index-1)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>{ut(index===0?'İçindekiler':'Geri')}</button>
      <button type="button" className={'btn'+(mustFinish?' l1a-next-locked':'')} aria-describedby={mustFinish&&lockNote===step.id?'l1a-lock-note':undefined} onClick={()=>forward(index===config.steps.length-1?-1:index+1)}>{index===config.steps.length-1?<><BookOpen size={18} aria-hidden="true"/>{ut('İçindekiler')}</>:<>{ut('İleri')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></>}</button>
     </nav>
     {mustFinish&&lockNote===step.id&&<p className="l1a-lock-note" id="l1a-lock-note" role="status"><Lock size={15} aria-hidden="true"/>{ut('Önce bu alıştırmayı bitir, sonra sıradakine geçebilirsin.')}</p>}
    </section>
   </PartBook>}
  </main></div>
  <SiteFooter language={language}/>
 </div>;
}

/* ---------- the notebook: contents page and a part's spread (like Lektion 1, 2, 3 and 15) ---------- */
/** Left page: the unit, its picture and what Lektion 5 teaches. Right page: Teil A–D. */
function Contents({language,scores,onOpen}:{language:StudyLanguage;scores:Record<PartId,L1AScoreMap>;onOpen:(part:PartId,index:number)=>void}){
 const unit=courseUnits.find(item=>item.id===ALLTAG_UNIT);const unitName=unit?translate(unit.names,language):'Alltag und Freizeit';
 // On a computer the notebook fits the screen below the header (see Lektion 2): a shorter notebook stretches, a taller one is drawn smaller.
 const box=useRef<HTMLElement>(null);
 useEffect(()=>{
  const element=box.current;const book=element?.querySelector<HTMLElement>('.lb');if(!element||!book)return;
  let frame=0;
  const fit=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   book.style.removeProperty('zoom');element.style.removeProperty('--l1a-fill');
   if(window.innerWidth<1180)return; // the pages stack (app/lesson-book.css): a normal page that scrolls
   const available=window.innerHeight-(element.getBoundingClientRect().top+window.scrollY)-22;
   let height=book.getBoundingClientRect().height;
   if(height<=available){element.style.setProperty('--l1a-fill',Math.floor(available)+'px');return;}
   let zoom=1;
   for(let i=0;i<4&&height>available+1;i++){zoom=Math.max(.55,zoom*available/height);book.style.zoom=String(zoom);height=book.getBoundingClientRect().height;}
  });};
  fit();window.addEventListener('resize',fit);void document.fonts?.ready.then(fit);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',fit);};
 },[language]);
 return <section className="l1a-contents l15-contents l2-contents l5-contents" aria-labelledby="l1a-heading" ref={box}>
  <LessonBook className="l1a-book l15-book l2-book l5-book" left={<>
   <div className="l1a-intro">
    <div className="l1a-intro-text">
     <span className="eyebrow" lang="de">A1.1 · Lektion 5 · Alltag und Freizeit</span>
     <h1 id="l1a-heading" tabIndex={-1} className="lb-title">{unitName}</h1>
     <p className="lb-sub" lang="de">Hast du heute Zeit?</p>
     <p className="lb-lead"><Tx text="Günlük işler ve günün bölümleri, **gern / nicht gern**, Ja-/Nein-soruları, şehirde boş zaman önerileri, düzensiz fiiller (**du fährst, er liest**), haftanın günleri, davet edip cevap vermek: ~Hast du am Samstag Zeit? – Ja, ich komme gern!~"/></p>
    </div>
    <figure className="lb-photo"><TopicArt id={ALLTAG_UNIT} title={unitName}/></figure>
   </div>
   <section className="lb-goals" aria-labelledby="l5-goals"><h2 id="l5-goals">{ut('Bu ünitede')}</h2><ul>{alltagGoals.map(goal=><li key={goal}><span><Rich text={goal}/></span></li>)}</ul></section>
  </>} right={<>
   <h2 className="lb-heading">{ut('İçindekiler')}</h2>
   <ol className="lb-toc">{alltagPartOrder.map(id=>{const config=parts[id];return <li className="lb-toc-row" data-l5-part={id} key={id}>
    <button type="button" className="lb-toc-open" onClick={()=>onOpen(id,0)}>
     <span className="lb-toc-badge" aria-hidden="true">{config.badge}</span>
     <span className="lb-toc-photo" aria-hidden="true"><img src={config.cover.src} alt="" width={config.cover.width} height={config.cover.height} decoding="async"/></span>
     <span className="lb-toc-text"><strong lang="de" dir="ltr">{config.title}</strong><small><Rich text={config.lead}/></small><span className="lb-toc-meta">{ut('{words} kelime · {exercises} alıştırma · {questions} soruluk test',{words:config.wordCount,exercises:config.groups[1].ids.length,questions:config.testCount})}</span></span>
     <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
    </button>
    <ProgressMeter progress={partProgressL5(id,scores[id])} language={language} label={'Teil '+config.badge} compact/>
   </li>;})}</ol>
  </>}/>
 </section>;
}
/** A part on the notebook: the left page (title, picture, progress, the other parts) folds away after the cover; the right page has the index tabs and the step. */
function PartBook({config,step,scores,progress,language,onGo,onPart,children}:{config:PartConfig;step:AlltagStep;scores:L1AScoreMap;progress:TopicProgress;language:StudyLanguage;onGo:(index:number)=>void;onPart:(part:PartId,index:number)=>void;children:ReactNode}){
 const group=config.groups.find(item=>item.ids.includes(step.id));
 const exerciseIds=config.scored.filter(exercise=>config.groups[1].ids.includes(exercise.id)).map(exercise=>exercise.id);
 const testIds=config.scored.filter(exercise=>config.groups[2].ids.includes(exercise.id)).map(exercise=>exercise.id);
 const exercisesDone=exerciseIds.filter(id=>scores[id]).length;
 const done:Record<StepGroup['id'],boolean>={konu:config.groups[0].ids.every(id=>scores[id]),alistirmalar:exercisesDone>=exerciseIds.length,test:testIds.length>0&&testIds.every(id=>scores[id]),konus:!!scores.konus};
 const lock=exerciseLock(config.groups,config.steps,scores);
 const tabLocked=(id:StepGroup['id'])=>!!lock.open&&(id==='test'||id==='konus');
 const detail:Record<StepGroup['id'],string>={
  konu:ut('{n} kısa adım',{n:config.groups[0].ids.length}),
  alistirmalar:exercisesDone?ut('{done} / {total} yapıldı',{done:exercisesDone,total:exerciseIds.length}):ut('{n} alıştırma',{n:config.groups[1].ids.length}),
  test:scores.test?ut('En iyi: {right} / {total}',{right:scores.test.right,total:scores.test.total}):config.testNote?ut(config.testNote,{n:config.testCount}):ut('{n} soru',{n:config.testCount}),
  konus:ut('Sesli pratik'),
 };
 const at=alltagPartOrder.indexOf(config.id);const previous=alltagPartOrder[at-1];const next=alltagPartOrder[at+1];
 const folded=step.kind!=='cover';
 return <section className={'l1a-part l15-part l2-part l5-part'+(folded?' l1a-folded':'')} aria-labelledby="l5-part-title">
  <LessonBook variant="wide" className="l1a-book l15-book l2-book l5-book lb-tabbed" left={<div className="lb-sticky">
   <button type="button" className="text-button vault-back-categories" onClick={()=>onGo(-1)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>Lektion 5</button>
   <span className="eyebrow" lang="de">A1.1 · 4 · Teil {config.badge}</span>
   <h1 id="l5-part-title" lang="de" className="lb-title">{config.title}</h1>
   <p className="lb-lead"><Rich text={config.lead}/></p>
   <figure className="lb-photo"><img src={config.cover.src} alt={ut(config.coverAlt)} width={config.cover.width} height={config.cover.height} decoding="async"/></figure>
   <ProgressMeter progress={progress} language={language} label={'Teil '+config.badge} compact/>
   <nav className="lb-pager" aria-label={ut('Bölümler')}>
    {previous?<button type="button" className="text-button" onClick={()=>onPart(previous,0)}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>Teil {parts[previous].badge}</button>:<span/>}
    {next?<button type="button" className="text-button" onClick={()=>onPart(next,0)}>Teil {parts[next].badge}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>:null}
   </nav>
  </div>} right={<>
   <nav className="l12-steps" id="l1a-tabs" aria-label={ut('Teil {badge} bölümleri',{badge:config.badge})}><ol>{config.groups.map((item,i)=><li key={item.id}><button type="button" className={'l12-step'+(group?.id===item.id?' active':'')+(done[item.id]?' done':'')+(tabLocked(item.id)?' locked':'')} aria-current={group?.id===item.id?'step':undefined} data-l5-tab={item.id} title={tabLocked(item.id)?ut('Önce alıştırmaları bitir'):undefined} onClick={()=>onGo(tabLocked(item.id)?lock.openIndex:config.steps.findIndex(entry=>entry.id===item.ids[0]))}>
    <span className="l12-step-number" aria-hidden="true">{tabLocked(item.id)?<Lock size={15}/>:done[item.id]?<Check size={16}/>:i+1}</span>
    <span className="l12-step-text"><strong>{ut(item.label)}</strong><small>{tabLocked(item.id)?ut('Önce alıştırmalar'):detail[item.id]}</small></span>
   </button></li>)}</ol></nav>
   <div className="l1a-mini-head" aria-hidden={!folded}><button type="button" className="text-button" tabIndex={folded?undefined:-1} onClick={()=>onGo(-1)}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>Lektion 5</button><span aria-hidden="true">·</span><b lang="de">Teil {config.badge}</b><span aria-hidden="true">·</span><span className="l1a-mini-title" lang="de">{config.title}</span></div>
   {children}
  </>}/>
 </section>;
}
