'use client';
import {browserLanguage,rememberSiteLanguage} from '@/lib/device-language';
import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Check,Play,Trash2,Trophy,Volume2} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,translate,type StudyLanguage} from '@/lib/study-languages';
import {courseUnits} from '@/lib/textbook-curriculum';
import {languageDirection} from '@/lib/site-languages';
import {c} from '@/lib/category-copy';
import {turkishNote} from '@/lib/ausbildung-course';
import {WILLKOMMEN_PATH,WILLKOMMEN_UNIT,lessonParts,unitGoals,stepGroups,groupOf,scoredExercises,steps,stepIndex,greetings,namePhrases,originPhrases,countries,articleCountries,articleGroups,noArticleSay,verbForms,dialogue,people,personSpeech,greetingsAround,words,lettersExercise,matchPairs,orderSentences,gluedText,gluedSentences,gluedSay,articleOptions,articleRows,articleRowSpeech,listenItems,questionLines,questionSay,wordBox,boxLines,boxSay,ownPrompts,testQuestions,testSpeech,normalizeLoose,willkommenPictures,dialogueSpeaker,exerciseSpeakers,matchSay,orderSay,type Step,type StepGroup} from '@/lib/willkommen-course';
import {stepsB,stepGroupsB,scoredExercisesB,testQuestionsB,wordsB,willkommenBPictures} from '@/lib/willkommen-b-course';
import {stepsC,stepGroupsC,scoredExercisesC,testQuestionsC,wordsC,willkommenCPictures} from '@/lib/willkommen-c-course';
import {L1_PART_KEY,partKeys,readPartScores,savePartScore,partProgressL1,lessonOneProgress,type L1AScoreMap,type L1PartId} from '@/lib/willkommen-progress';
import type {TopicProgress} from '@/lib/progress';
import {useLanguageSwitch} from './language-switch';
import {useAnswerSound} from './study-shared';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {SiteMenuAside} from './site-menu';
import {ProgressMeter} from './progress-ui';
import {PaulHoca} from './paul-hoca';
import {GuestBanner} from './guest-taste';
import {LessonBook} from './lesson-book';
import {useLessonSpeech,Say,Phrases,Note,Rich,Heading,Portrait,FeedbackLine,useFinish,GapExercise,MatchExercise,OrderExercise,TestStep,type Speech,type StepProps,type Feedback} from './willkommen-ui';
import {StepViewB} from './willkommen-b-steps';
import {StepViewC} from './willkommen-c-steps';

/**
 * Lektion 1 „Willkommen!“ (the learner's own lesson pages): the contents page is an open notebook like Lektion 11 and
 * 12 (Teil A–D); Teil A – Ich heiße … (24 October 2026, 22 steps), Teil B – Ich spreche ein bisschen Deutsch. (25 October 2026, 24 steps)
 * and Teil C – Guten Tag! (25 October 2026, 26 steps) open on a wide spread, one step at a time. German is read with the site voices, each
 * person with their own voice; answers get the site's sounds and Paul; scores stay in the browser
 * (lib/willkommen-progress.ts). Teil B's steps: app/willkommen-b-steps.tsx; shared pieces: app/willkommen-ui.tsx.
 */
export default function WillkommenStudy({guest=false}:{guest?:boolean}){
 const [language,setLanguage]=useState<StudyLanguage>('de');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{switchLanguage(browserLanguage(),()=>setLoaded(true));},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title='Lektion 1 · Willkommen! · '+SITE_NAME;rememberSiteLanguage(language);},[language,loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <WillkommenLesson language={language} onLanguage={switchLanguage} guest={guest}/>;
}

/** A part with a lesson: its steps, tabs, scored exercises, picture and step views. */
type PartConfig={id:L1PartId;badge:string;title:string;lead:string;steps:Step[];groups:StepGroup[];scored:{id:string;total:number}[];testCount:number;wordCount:number;cover:{src:string;width:number;height:number};coverAlt:string;View:(props:StepProps)=>ReactNode};
const parts:Record<L1PartId,PartConfig>={
 a:{id:'a',badge:'A',title:lessonParts[0].title??'',lead:lessonParts[0].lead??'',steps,groups:stepGroups,scored:scoredExercises,testCount:testQuestions.length,wordCount:words.length,cover:willkommenPictures.cover,coverAlt:'Süpermarket önünde tokalaşan iki kişi: Sabine ve Omar',View:StepViewA},
 b:{id:'b',badge:'B',title:lessonParts[1].title??'',lead:lessonParts[1].lead??'',steps:stepsB,groups:stepGroupsB,scored:scoredExercisesB,testCount:testQuestionsB.length,wordCount:wordsB.length,cover:willkommenBPictures.cover,coverAlt:'Dil kursu sınıfı: Paul Hoca tahtada, öğrenciler masalarında',View:StepViewB},
 c:{id:'c',badge:'C',title:lessonParts[2].title??'',lead:lessonParts[2].lead??'',steps:stepsC,groups:stepGroupsC,scored:scoredExercisesC,testCount:testQuestionsC.length,wordCount:wordsC.length,cover:willkommenCPictures.cover,coverAlt:'Kurs binasının önünde sabah selamlaşması',View:StepViewC},
};
const partOrder:L1PartId[]=['a','b','c'];
const isPart=(id:string):id is L1PartId=>id in parts;

/** Where the learner is: a part and a step (`?teil=b&adim=<id>`; Teil A without `teil`), or the contents page (index -1). */
type Place={part:L1PartId;index:number};
function readPlace():Place{
 const params=new URLSearchParams(window.location.search);const teil=params.get('teil')??'a';const part:L1PartId=isPart(teil)?teil:'a';
 return {part,index:parts[part].steps.findIndex(step=>step.id===(params.get('adim')??''))};
}
/** The last step the learner opened (for "Kaldığın yerden devam et"), or null. */
function readLast():Place|null{
 try{const saved=localStorage.getItem(L1_PART_KEY)??'a';const part:L1PartId=isPart(saved)?saved:'a';const index=parts[part].steps.findIndex(step=>step.id===(localStorage.getItem(partKeys[part].step)??''));return index>=0?{part,index}:null;}catch{return null;}
}

function WillkommenLesson({language,onLanguage,guest}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;guest:boolean}){
 // This component only mounts in the browser (the parent shows a loading line first), so the address can be read at once.
 const [place,setPlace]=useState<Place>(()=>typeof window==='undefined'?{part:'a',index:-1}:readPlace());
 const [scores,setScores]=useState<Record<L1PartId,L1AScoreMap>>({a:{},b:{},c:{}});
 const speech=useLessonSpeech();const sound=useAnswerSound();
 // useAnswerSound gives a new object on every render: keep the latest speech and sound in a ref, so the effects and
 // callbacks below do not run again on every render (that would be an endless update loop).
 const latest=useRef({speech,sound});latest.current={speech,sound};
 useEffect(()=>{setScores({a:readPartScores('a'),b:readPartScores('b'),c:readPartScores('c')});},[]);
 useEffect(()=>{const pop=()=>{latest.current.speech.stop();latest.current.sound.stop();setPlace(readPlace());};window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 /** Opens a step of a part; a negative number opens the contents page. */
 const open=useCallback((part:L1PartId,next:number)=>{
  const target=next<0?-1:Math.min(parts[part].steps.length-1,next);latest.current.speech.stop();latest.current.sound.stop();setPlace({part,index:target});
  try{
   const url=new URL(window.location.href);
   if(target<0){url.searchParams.delete('adim');url.searchParams.delete('teil');}
   else{if(part==='a')url.searchParams.delete('teil');else url.searchParams.set('teil',part);url.searchParams.set('adim',parts[part].steps[target].id);}
   window.history.pushState(null,'',url);
  }catch{}
  requestAnimationFrame(()=>{
   // A step: bring the tabs and the step into view (on a phone the notebook's left page and the menu sit above them).
   const tabs=target>=0?document.getElementById('l1a-tabs'):null;
   if(!tabs)window.scrollTo({top:0,behavior:'instant'});
   else{const top=tabs.getBoundingClientRect().top;if(top<0||top>window.innerHeight*0.45)tabs.scrollIntoView({block:'start',behavior:'instant'});}
   document.getElementById('l1a-heading')?.focus({preventScroll:true});
  });
 },[]);
 const go=useCallback((next:number)=>open(place.part,next),[open,place.part]);
 // The step the learner is on (also when opened from its address), for "Kaldığın yerden devam et".
 useEffect(()=>{if(place.index>=0)try{localStorage.setItem(partKeys[place.part].step,parts[place.part].steps[place.index].id);localStorage.setItem(L1_PART_KEY,place.part);}catch{}},[place]);
 const score=useCallback((id:string,right:number,total:number)=>{const part=place.part;setScores(previous=>({...previous,[part]:savePartScore(part,id,right,total)}));},[place.part]);
 const config=parts[place.part];const index=place.index;const step=index>=0?config.steps[index]:null;
 const progress=partProgressL1(place.part,scores[place.part]);
 const dir=languageDirection(language);const View=config.View;
 return <div className="category-app toon-app housing-app l12-app l1a-app" lang={language} dir={dir}>
  <a className="skip-link" href="#l1a-main">{c(language,'catalogTitle')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value)){speech.stop();onLanguage(value);}}} homeHref="/konular?level=A1.1" homeLabel={c(language,'catalogTitle')} guest={guest}/>
  <div className="work-layout site-layout"><SiteMenuAside language={language} current="units"/>
  <main id="l1a-main" className="object-page housing-page l1a-page" lang={language} dir={dir}>
   <div className="object-breadcrumb"><a href="/konular?level=A1.1">A1.1</a><span aria-hidden="true">›</span>{step?<><a href={WILLKOMMEN_PATH} lang="de" onClick={event=>{event.preventDefault();go(-1);}}>Lektion 1 · Willkommen!</a><span aria-hidden="true">›</span><span lang="de">Teil {config.badge}</span></>:<span lang="de">Lektion 1 · Willkommen!</span>}</div>
   {guest&&<GuestBanner language={language} back={WILLKOMMEN_PATH}/>}
   {language!=='tr'&&turkishNote[language]&&<p className="object-alert l12-language-note" lang={language} dir={dir}>{turkishNote[language]}</p>}
   {speech.warning&&<p className="object-alert" role="status">{speech.warning}</p>}
   {!step?<Contents language={language} scores={scores} onOpen={open}/>:<PartBook config={config} step={step} scores={scores[place.part]} progress={progress} language={language} onGo={go} onPart={open}>
    <section className="panel l1a-card" aria-labelledby="l1a-heading" data-l1a-step={step.id} data-l1a-teil={config.id}>
     <header className="l1a-top">
      <div className="l1a-top-row"><span className="eyebrow">{config.groups.find(group=>group.ids.includes(step.id))?.label??'Teil '+config.badge}</span><span className="l1a-where">{step.title} · {index+1}/{config.steps.length}</span></div>
      <div className="l1a-bar" role="progressbar" aria-valuemin={0} aria-valuemax={config.steps.length} aria-valuenow={index+1} aria-label={step.title}><i style={{width:((index+1)/config.steps.length*100)+'%'}}/></div>
     </header>
     <View key={config.id+':'+step.id} step={step} speech={speech} sound={sound} scores={scores[place.part]} progress={progress} onScore={score} onGo={go} onPart={open} language={language}/>
     <nav className="l1a-pager" aria-label="Adımlar">
      <button type="button" className="btn secondary" onClick={()=>go(index-1)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>{index===0?'İçindekiler':'Geri'}</button>
      <button type="button" className="btn" onClick={()=>go(index===config.steps.length-1?-1:index+1)}>{index===config.steps.length-1?<><BookOpen size={18} aria-hidden="true"/>İçindekiler</>:<>İleri<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></>}</button>
     </nav>
    </section>
   </PartBook>}
  </main></div>
  <SiteFooter language={language}/>
 </div>;
}

/* ---------- the notebook: contents page and a part's spread (like Lektion 11 and 12) ---------- */
const worldMap=willkommenPictures.map;
/** Left page: the unit, where to go on, the tests and what Lektion 1 teaches. Right page: Teil A–D. */
function Contents({language,scores,onOpen}:{language:StudyLanguage;scores:Record<L1PartId,L1AScoreMap>;onOpen:(part:L1PartId,index:number)=>void}){
 const [last,setLast]=useState<Place|null>(null);useEffect(()=>{setLast(readLast());},[]);
 const unit=courseUnits.find(item=>item.id===WILLKOMMEN_UNIT);const unitName=unit?translate(unit.names,language):'Willkommen!';
 const total=lessonOneProgress(scores);
 // The test note opens the first test not taken yet (else the last part's test).
 const testPart=partOrder.find(part=>!scores[part].test)??partOrder[partOrder.length-1];
 const testIndex=(part:L1PartId)=>parts[part].steps.findIndex(step=>step.id==='test');
 return <section className="l1a-contents" aria-labelledby="l1a-heading">
  <LessonBook className="l1a-book" left={<>
   <span className="eyebrow" lang="de">A1.1 · Lektion 1 · Willkommen!</span>
   <h1 id="l1a-heading" tabIndex={-1} className="lb-title">{unitName}</h1>
   <p className="lb-sub" lang="de">Guten Tag! Wie heißen Sie?</p>
   <p className="lb-lead">Selamlaşmak, kendini tanıtmak, nereden geldiğini ve hangi dilleri konuştuğunu söylemek: <b lang="de">heißen · kommen · sprechen · sein</b>, <b lang="de">Sie / du</b> ve alfabe.</p>
   <figure className="lb-photo"><img src={worldMap.src} alt="Paul Hoca dünya haritasında farklı dillerde selamları gösteriyor" width={worldMap.width} height={worldMap.height} decoding="async"/></figure>
   <div className="lb-notes">
    <button type="button" className="housing-feature lb-note l1a-resume" onClick={()=>last?onOpen(last.part,last.index):onOpen('a',0)}>
     <span className="housing-letter l12-letter" aria-hidden="true"><Play size={24}/></span>
     <div><h2>{last&&(last.index>0||last.part!=='a')?'Kaldığın yerden devam et':'Derse başla'}</h2><p lang="de">Teil {parts[last?.part??'a'].badge} · {last?parts[last.part].steps[last.index].title:'Kapak'}</p><ProgressMeter progress={total} language={language} label="Lektion 1" compact/></div>
     <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
    </button>
    <button type="button" className="housing-feature lb-note l1a-test-note" onClick={()=>onOpen(testPart,testIndex(testPart))}>
     <span className="housing-letter l12-letter" aria-hidden="true"><Trophy size={24}/></span>
     <div><h2>Testler</h2><p>{partOrder.map(part=>{const result=scores[part].test;return `Teil ${parts[part].badge}: ${result?result.right+' / '+result.total:parts[part].testCount+' soru'}`;}).join(' · ')}</p></div>
     <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
    </button>
   </div>
   <section className="lb-goals" aria-labelledby="l1a-goals"><h2 id="l1a-goals">Bu ünitede</h2><ul>{unitGoals.map(goal=><li key={goal}><span><Rich text={goal}/></span></li>)}</ul></section>
  </>} right={<>
   <h2 className="lb-heading">İçindekiler</h2>
   <ol className="lb-toc">{lessonParts.map(row=>{const config=isPart(row.id)?parts[row.id]:null;return config?<li className="lb-toc-row" data-l1a-part={row.id} key={row.id}>
    <button type="button" className="lb-toc-open" onClick={()=>onOpen(config.id,0)}>
     <span className="lb-toc-badge" aria-hidden="true">{row.badge}</span>
     <span className="lb-toc-photo" aria-hidden="true"><img src={config.cover.src} alt="" width={config.cover.width} height={config.cover.height} decoding="async"/></span>
     <span className="lb-toc-text"><strong lang="de" dir="ltr">{config.title}</strong><small><Rich text={config.lead}/></small><span className="lb-toc-meta">{config.wordCount} kelime · {config.groups[1].ids.length} alıştırma · {config.testCount} soruluk test</span></span>
     <ArrowRight size={20} className="vault-direction-icon" aria-hidden="true"/>
    </button>
    <ProgressMeter progress={partProgressL1(config.id,scores[config.id])} language={language} label={'Teil '+row.badge} compact/>
   </li>:<li className="lb-toc-row l1a-soon" data-l1a-part={row.id} key={row.id} aria-disabled="true">
    <div className="lb-toc-open">
     <span className="lb-toc-badge" aria-hidden="true">{row.badge}</span>
     <span className="lb-toc-photo l1a-soon-photo" aria-hidden="true">{row.badge}</span>
     <span className="lb-toc-text"><strong lang="de">Teil {row.badge}</strong><small>Bu bölüm yakında eklenecek.</small><span className="lb-toc-meta l1a-soon-tag">Yakında</span></span>
    </div>
   </li>;})}</ol>
  </>}/>
 </section>;
}
/** A part on the notebook: the left page stays (title, picture, progress, the other parts); the right page has three index tabs and the step. */
function PartBook({config,step,scores,progress,language,onGo,onPart,children}:{config:PartConfig;step:Step;scores:L1AScoreMap;progress:TopicProgress;language:StudyLanguage;onGo:(index:number)=>void;onPart:(part:L1PartId,index:number)=>void;children:ReactNode}){
 const group=config.groups.find(item=>item.ids.includes(step.id));
 const exerciseIds=config.scored.filter(exercise=>exercise.id!=='test').map(exercise=>exercise.id);
 const exercisesDone=exerciseIds.filter(id=>scores[id]).length;
 const done:Record<StepGroup['id'],boolean>={konu:false,alistirmalar:exercisesDone>=exerciseIds.length,test:!!scores.test};
 const detail:Record<StepGroup['id'],string>={
  konu:`${config.groups[0].ids.length} kısa adım`,
  alistirmalar:exercisesDone?`${exercisesDone} / ${exerciseIds.length} yapıldı`:`${config.groups[1].ids.length} alıştırma`,
  test:scores.test?`En iyi: ${scores.test.right} / ${scores.test.total}`:`${config.testCount} soru`,
 };
 const at=partOrder.indexOf(config.id);const previous=partOrder[at-1];const next=partOrder[at+1];
 const nextSoon=!next?lessonParts[lessonParts.findIndex(row=>row.id===config.id)+1]:undefined;
 return <section className="l1a-part" aria-labelledby="l1a-part-title">
  <LessonBook variant="wide" className="l1a-book lb-tabbed" left={<div className="lb-sticky">
   <button type="button" className="text-button vault-back-categories" onClick={()=>onGo(-1)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>Lektion 1</button>
   <span className="eyebrow" lang="de">A1.1 · 1 · Teil {config.badge}</span>
   <h1 id="l1a-part-title" lang="de" className="lb-title">{config.title}</h1>
   <p className="lb-lead"><Rich text={config.lead}/></p>
   <figure className="lb-photo"><img src={config.cover.src} alt={config.coverAlt} width={config.cover.width} height={config.cover.height} decoding="async"/></figure>
   <ProgressMeter progress={progress} language={language} label={'Teil '+config.badge} compact/>
   <nav className="lb-pager" aria-label="Bölümler">
    {previous?<button type="button" className="text-button" onClick={()=>onPart(previous,0)}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>Teil {parts[previous].badge}</button>:<span/>}
    {next?<button type="button" className="text-button" onClick={()=>onPart(next,0)}>Teil {parts[next].badge}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>:nextSoon?<span className="l1a-next-soon" lang="de">Teil {nextSoon.badge} · <span lang="tr">yakında</span></span>:null}
   </nav>
  </div>} right={<>
   <nav className="l12-steps" id="l1a-tabs" aria-label={'Teil '+config.badge+' bölümleri'}><ol>{config.groups.map((item,i)=><li key={item.id}><button type="button" className={'l12-step'+(group?.id===item.id?' active':'')+(done[item.id]?' done':'')} aria-current={group?.id===item.id?'step':undefined} data-l1a-tab={item.id} onClick={()=>onGo(config.steps.findIndex(entry=>entry.id===item.ids[0]))}>
    <span className="l12-step-number" aria-hidden="true">{done[item.id]?<Check size={16}/>:i+1}</span>
    <span className="l12-step-text"><strong>{item.label}</strong><small>{detail[item.id]}</small></span>
   </button></li>)}</ol></nav>
   {children}
  </>}/>
 </section>;
}

/* ---------- Teil A's steps ---------- */
function StepViewA(props:StepProps){
 const {step}=props;
 switch(step.id){
  case 'kapak':return <Cover {...props}/>;
  case 'selam':return <Teach title="Selamlaşma" speech={props.speech} phrases={greetings} note={<><b lang="de">Guten Tag</b> resmî selamdır, gün boyu kullanılır. Arkadaşlar arasında <b lang="de">Hallo!</b> denir. Biri sana <b lang="de">Herzlich willkommen!</b> derse cevabın: <b lang="de">Danke!</b></>}/>;
  case 'ad':return <Names speech={props.speech}/>;
  case 'nereden':return <Origin speech={props.speech}/>;
  case 'ulkeler':return <Countries speech={props.speech}/>;
  case 'artikel':return <ArticleRule speech={props.speech}/>;
  case 'fiiller':return <Verbs speech={props.speech}/>;
  case 'diyalog':return <Dialogue speech={props.speech}/>;
  case 'kisiler':return <People speech={props.speech}/>;
  case 'diller':return <Languages/>;
  case 'kelimeler':return <WordList speech={props.speech}/>;
  case 'harfler':return <GapExercise kicker="Alıştırma 1 · Ergänzen Sie" title="Eksik harfleri tamamla" lines={lettersExercise.lines} say={lettersExercise.say} speakers={exerciseSpeakers.harfler} {...props}/>;
  case 'eslestir':return <MatchExercise kicker="Alıştırma 2 · Verbinden Sie" title="Soruyu cevapla eşleştir" pairs={matchPairs} sayFor={i=>matchSay(matchPairs[i])} {...props}/>;
  case 'sirala':return <OrderExercise kicker="Alıştırma 3 · Ordnen Sie" title="Kelimeleri sıraya koy" sentences={orderSentences} sayFor={orderSay} {...props}/>;
  case 'ayir':return <GapExercise kicker="Alıştırma 4 · Markieren Sie" title="Kelimeleri ayır, cümleleri yaz" lead="Bu metinde boşluk yok. 5 cümleyi ayırıp aşağıya yaz." before={<div className="l1a-glued" lang="de" dir="ltr">{gluedText}</div>} lines={gluedSentences.map(line=>({who:line.who,text:'___',answers:[line.answers]}))} wide say={gluedSay} speakers={exerciseSpeakers.ayir} {...props}/>;
  case 'aus':return <ArticleExercise {...props}/>;
  case 'dinle':return <ListenExercise {...props}/>;
  case 'soru':return <GapExercise kicker="Alıştırma 7 · Schreiben Sie Fragen" title="Cevap var, soruyu yaz" lead="Cevaba bakıp soruyu yaz. (İpucu: Herr / Frau + soyadı ekleyebilirsin.)" lines={questionLines.flatMap(line=>[{who:'a' as const,text:'___',answers:[line.answers]},{who:'b' as const,text:line.reply,answers:[]}])} wide say={questionSay} speakers={exerciseSpeakers.soru} {...props}/>;
  case 'kutu':return <GapExercise kicker="Alıştırma 8 · Was passt?" title="Kutudan doğru kelimeyi seç" lead={'Kelimeler: '+wordBox.join(' · ')} lines={boxLines} choices={wordBox} say={boxSay} speakers={exerciseSpeakers.kutu} {...props}/>;
  case 'sen':return <OwnExercise {...props}/>;
  case 'test':return <TestStep label="Lektion 1A · Test" questions={testQuestions} sayFor={i=>testSpeech(testQuestions[i])} {...props}/>;
  case 'bitti':return <End {...props}/>;
 }
 return null;
}

function Cover({progress,onGo,scores}:StepProps){
 const started=Object.keys(scores).length>0;
 return <>
  <p className="kicker" lang="de">Lektion 1 · Willkommen!</p>
  <Heading><span lang="de">A — Ich heiße …</span></Heading>
  {/* The cover picture is on the notebook's left page now. */}
  <p>Bu derste öğreneceklerin:</p>
  <ul className="l1a-list"><li>Selamlaşma: <b lang="de">Guten Tag!</b></li><li>Adını söylemek ve sormak</li><li>Nereden geldiğini söylemek</li><li>Ülke adları ve <b lang="de">aus</b></li></ul>
  <p className="l1a-tr">Önce konuyu öğren (10 kısa adım), sonra alıştırmaları yap (9 alıştırma + test). Alttaki “İleri” ile ilerle.</p>
  {started&&<ProgressMeter progress={progress} language={'tr'} label="Lektion 1A"/>}
  <div className="l1a-jump">
   <button type="button" className="btn small" onClick={()=>onGo(1)}><Play size={16} aria-hidden="true"/>Konuyu öğren</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(stepIndex('harfler'))}>Alıştırmalara geç</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(stepIndex('test'))}>Teste geç</button>
  </div>
 </>;
}
function Teach({title,phrases,note,speech}:{title:string;phrases:readonly (readonly [string,string])[];note?:ReactNode;speech:Speech}){
 return <><Heading>{title}</Heading><Phrases items={phrases} speech={speech}/>{note&&<Note>{note}</Note>}</>;
}
function Names({speech}:{speech:Speech}){
 return <><Heading>Adınız ne?</Heading>
  <Phrases items={[namePhrases[0]]} speech={speech}/>
  <p className="l1a-tr">İki cevap da doğru:</p>
  <Phrases items={namePhrases.slice(1)} speech={speech}/>
  <table className="l1a-table"><tbody><tr><td><b lang="de">wie</b></td><td>nasıl</td><td><b lang="de">Sie</b></td><td>siz</td></tr><tr><td><b lang="de">heißen</b></td><td>adı … olmak</td><td><b lang="de">ich bin</b></td><td>ben … -im</td></tr></tbody></table>
  <Note><b lang="de">Herr</b> = Bay, <b lang="de">Frau</b> = Bayan. Soyadıyla birlikte kullanılır: <b lang="de">Herr Nasser</b>, <b lang="de">Frau Krüger</b>.</Note></>;
}
function Origin({speech}:{speech:Speech}){
 return <><Heading>Nereden geliyorsunuz?</Heading>
  <Phrases items={originPhrases.slice(0,2)} speech={speech}/>
  <p className="l1a-tr">Soyadıyla sorabilirsin:</p><Phrases items={[originPhrases[2]]} speech={speech}/>
  <p className="l1a-tr">Ülkeden sonra şehri de söyleyebilirsin:</p><Phrases items={[originPhrases[3]]} speech={speech}/>
  <table className="l1a-table"><tbody><tr><td><b lang="de">woher</b></td><td>nereden</td><td><b lang="de">kommen</b></td><td>gelmek</td><td><b lang="de">aus</b></td><td>-den / -dan</td></tr></tbody></table></>;
}
function Countries({speech}:{speech:Speech}){
 const flag=(c:readonly [string,string,string,string],art:boolean)=><button type="button" key={c[1]} className={'l1a-flag'+(art?' art':'')+(speech.busy&&speech.activeText===c[3]?' playing':'')} onClick={()=>speech.speak(c[3])} aria-label={'Dinle: '+c[3]}><span className="l1a-flag-emoji" aria-hidden="true">{c[0]}</span><b lang="de">{c[1]}</b><small>{c[2]}</small></button>;
 return <><Heading>Ülkeler</Heading><p className="l1a-tr">Dokun, dinle: “aus …” biçimiyle okunur.</p>
  <h2 className="l1a-h2">Artikel yok: <span lang="de">aus</span> + ülke</h2><div className="l1a-flags">{countries.map(c=>flag(c,false))}</div>
  <h2 className="l1a-h2">Artikel var: <span lang="de">aus der / dem / den …</span></h2><p className="l1a-mini">Mavi yazılı ülkeler artikel alır. Kuralı bir sonraki adımda göreceksin.</p><div className="l1a-flags">{articleCountries.map(c=>flag(c,true))}</div></>;
}
function ArticleRule({speech}:{speech:Speech}){
 return <><Heading>Dikkat: <span lang="de">aus</span> + artikel</Heading>
  <p>Çoğu ülke artikel almaz:</p>
  <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-de" lang="de">aus Deutschland · aus Polen · aus Syrien</span></div><Say text={noArticleSay} speech={speech}/></div>
  <p>Bazı ülkeler artikel alır. <b lang="de">aus</b>’tan sonra artikel değişir:</p>
  {articleGroups.map(group=><div className="l1a-phrase" key={group.rule}><div className="l1a-phrase-text"><span className="l1a-de" lang="de">{group.rule}</span><span className="l1a-tr" lang="de"><Rich text={group.examples}/></span></div><Say text={group.say} speech={speech}/></div>)}
  <Note>Neden değişiyor? <b lang="de">aus</b> kelimesinden sonra Dativ gelir. A1’de bunu sadece ezberle: <b lang="de">der Türkei, dem Irak, den USA</b>.</Note></>;
}
function Verbs({speech}:{speech:Speech}){
 const cell=(text:string)=><td><span lang="de">{text}</span> <Say text={text} speech={speech}/></td>;
 return <><Heading>Üç fiil: <span lang="de">ich / Sie</span></Heading>
  <table className="l1a-table l1a-verbs"><thead><tr><th></th><th><span lang="de">ich</span> (ben)</th><th><span lang="de">Sie</span> (siz)</th></tr></thead>
  <tbody>{verbForms.map(form=><tr key={form.verb}><td><b lang="de">{form.verb}</b><br/><span className="l1a-mini">{form.tr}</span></td>{cell(form.ich)}{cell(form.sie)}</tr>)}</tbody></table>
  <Note>Kural: <b lang="de">ich</b> → fiil <b>-e</b> ile biter (<span lang="de">heiß<b>e</b>, komm<b>e</b></span>). <b lang="de">Sie</b> → fiil <b>-en</b> ile biter (<span lang="de">heiß<b>en</b>, komm<b>en</b></span>). <b lang="de">sein</b> düzensizdir: <span lang="de">bin / sind</span>.</Note></>;
}
function Dialogue({speech}:{speech:Speech}){
 return <><Heading>Diyalog: Sabine ve Omar</Heading><p className="l1a-tr">Sabine Krüger bir süpermarket işletiyor. Omar Nasser yeni geldi.</p>
  <div className="l1a-dialogue">{dialogue.map(([who,de,tr],i)=><div className={'l1a-line '+(who==='S'?'a':'b')} key={i}><Portrait who={dialogueSpeaker(who)} name={who==='S'?'Sabine':'Omar'}/><div className="l1a-bubble"><span className="l1a-de" lang="de" dir="ltr">{de}</span><span className="l1a-tr">{tr}</span></div><Say text={de} who={dialogueSpeaker(who)} speech={speech}/></div>)}</div>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(dialogue.map(([who,de])=>({text:de,who:dialogueSpeaker(who)})))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div></>;
}
function People({speech}:{speech:Speech}){
 return <><Heading>Kişiler nereden geliyor?</Heading><p className="l1a-tr">Önce ülke, sonra şehir: <b lang="de">aus Kenia, aus Nairobi</b>.</p>
  {people.map(p=><div className="l1a-person" key={p.key}><Portrait who={p.key} name={p.name.split(' ')[0]}/><div className="l1a-phrase-text"><span className="l1a-de"><span aria-hidden="true">{p.flag} </span><span lang="de">{p.name}</span></span><span className="l1a-tr" lang="de" dir="ltr">Ich komme aus {p.land}, aus {p.city}.</span></div><Say text={personSpeech(p)} who={p.key} speech={speech}/></div>)}</>;
}
function Languages(){
 return <><Heading>Farklı dillerde “Guten Tag”</Heading>
  <img className="l1a-cover" src={willkommenPictures.map.src} alt="Paul Hoca dünya haritasını gösteriyor" width={willkommenPictures.map.width} height={willkommenPictures.map.height} loading="lazy" decoding="async"/>
  <table className="l1a-table"><tbody>{greetingsAround.map(([lang,greeting])=><tr key={lang}><td><b>{lang}</b></td><td>{greeting}</td></tr>)}</tbody></table>
  {/* The classroom note ("everyone writes Guten Tag in their language …") was removed at the learner's request (24 October 2026). */}</>;
}
function WordList({speech}:{speech:Speech}){
 return <><Heading>Kelime listesi</Heading>
  <table className="l1a-table l1a-words"><tbody>{words.map(([de,tr])=><tr key={de}><td><span className="l1a-de" lang="de">{de}</span></td><td>{tr}</td><td><Say text={de} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr">Konu bitti. Şimdi alıştırmalar başlıyor.</p></>;
}

/* ---------- Teil A's own exercises ---------- */
function ArticleExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [answers,setAnswers]=useState<Record<number,string>>({});const [feedback,setFeedback]=useState<Feedback>(null);
 const answer=(i:number,value:string)=>{if(answers[i]!==undefined)return;sound.prepare();speech.prepare();
  const next={...answers,[i]:value};setAnswers(next);const ok=value===articleRows[i][1];
  const done=Object.keys(next).length;const right=articleRows.filter((row,j)=>next[j]===row[1]).length;
  if(done===articleRows.length){setFeedback({ok:right===articleRows.length,text:`${right} / ${articleRows.length} doğru`});finish(right,articleRows.length);}
  else if(ok)sound.correct(()=>speech.speak(articleRowSpeech(articleRows[i])));else sound.wrong(()=>speech.speak(articleRowSpeech(articleRows[i])));};
 return <>
  <p className="kicker" lang="de">Alıştırma 5 · Artikel</p><Heading><span lang="de">aus</span> + ?</Heading><p className="l1a-tr">Doğru olanı seç. “–” = artikel yok.</p>
  {articleRows.map(([land,right],i)=><div className="l1a-arow" key={land} data-done={answers[i]!==undefined?'':undefined}><span className="l1a-land" lang="de">aus</span><div className="l1a-opts" role="group" aria-label={'aus … '+land}>{articleOptions.map(option=><button type="button" key={option} className={'l1a-opt'+(answers[i]!==undefined&&option===right?' ok':answers[i]===option?' bad':'')} disabled={answers[i]!==undefined} lang="de" onClick={()=>answer(i,option)}>{option}</button>)}</div><span className="l1a-land" lang="de">{land}</span></div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
function ListenExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [answers,setAnswers]=useState<Record<number,number>>({});const [feedback,setFeedback]=useState<Feedback>(null);
 const answer=(i:number,j:number)=>{if(answers[i]!==undefined)return;sound.prepare();const next={...answers,[i]:j};setAnswers(next);
  const ok=j===listenItems[i].answer;const done=Object.keys(next).length;const right=listenItems.filter((item,k)=>next[k]===item.answer).length;
  if(done===listenItems.length){setFeedback({ok:right===listenItems.length,text:`${right} / ${listenItems.length} doğru`});finish(right,listenItems.length);}else if(ok)sound.correct();else sound.wrong();};
 return <>
  <p className="kicker" lang="de">Alıştırma 6 · Hören Sie</p><Heading>Dinle ve işaretle</Heading><p className="l1a-tr">Kişiler nereden geliyor? Önce dinle, sonra seç.</p>
  {listenItems.map((item,i)=><div className="l1a-listen" key={item.key}>
   <div className="l1a-person"><Portrait who={item.key} name={item.name.split(' ')[0]}/><div className="l1a-phrase-text"><span className="l1a-de">{i+1}. <span lang="de">{item.name}</span></span><span className="l1a-tr" lang="de">Ich komme …</span></div><Say text={item.text} who={item.key} speech={speech} wide secret/></div>
   <div className="l1a-opts wrap" role="group" aria-label={item.name}>{item.options.map((option,j)=><button type="button" key={option} className={'l1a-opt'+(answers[i]!==undefined&&j===item.answer?' ok':answers[i]===j?' bad':'')} disabled={answers[i]!==undefined} lang="de" onClick={()=>answer(i,j)}>{option}</button>)}</div>
   {answers[i]!==undefined&&<p className="l1a-mini">Metin: <span lang="de" dir="ltr">{item.text}</span></p>}
  </div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
function OwnExercise({speech}:StepProps){
 const [values,setValues]=useState(['','']);const [state,setState]=useState<(boolean|null)[]>([null,null]);
 const change=(i:number,value:string)=>{const next=values.slice();next[i]=value;setValues(next);const s=state.slice();s[i]=value.trim()?ownPrompts[i].pattern.test(normalizeLoose(value)):null;setState(s);};
 return <>
  <p className="kicker" lang="de">Alıştırma 9 · Sprechen Sie</p><Heading>Şimdi sen cevap ver</Heading><p className="l1a-tr">Kendi adınla ve ülkenle yaz, sonra dinle.</p>
  <div className="l1a-dialogue">{ownPrompts.map((prompt,i)=><div key={prompt.question}>
   <div className="l1a-line a"><div className="l1a-bubble"><span className="l1a-de" lang="de">{prompt.question}</span></div><Say text={prompt.question} speech={speech}/></div>
   <div className="l1a-line b"><div className="l1a-bubble"><input className={'l1a-gap wide'+(state[i]===true?' ok':state[i]===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" placeholder={prompt.placeholder} aria-label={prompt.question} onChange={event=>change(i,event.target.value)}/>{state[i]===false&&<span className="l1a-mini">Kalıp: <span lang="de">{prompt.placeholder}</span></span>}</div></div>
  </div>)}</div>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy||!values.some(v=>v.trim())} onClick={()=>speech.speakAll(values.map(v=>v.trim()).filter(Boolean))}><Volume2 size={16} aria-hidden="true"/>Cümlelerimi dinle</button></div>
  <Note>Hatırla: Türkiye → <b lang="de">aus der Türkei</b>, Irak → <b lang="de">aus dem Irak</b>, Almanya → <b lang="de">aus Deutschland</b>.</Note>
 </>;
}
function End({progress,onGo,onPart}:StepProps){
 return <>
  <Heading>Lektion 1A tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>Artık şunları söyleyebilirsin:</p>
  <ul className="l1a-list" lang="de"><li><b>Guten Tag!</b> <span lang="tr">– selamlaşma</span></li><li><b>Ich heiße … / Ich bin …</b> <span lang="tr">– adını söyleme</span></li><li><b>Wie heißen Sie?</b> <span lang="tr">– ad sorma</span></li><li><b>Ich komme aus …</b> <span lang="tr">– nereden geldiğini söyleme</span></li><li><b>Woher kommen Sie?</b> <span lang="tr">– nereden sorma</span></li><li><b>aus der Türkei, aus dem Irak, aus den USA</b> <span lang="tr">– artikelli ülkeler</span></li></ul>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 1A"/>
  <p className="l1a-tr">Sıradaki bölüm: <b lang="de">Teil B – Ich spreche ein bisschen Deutsch.</b></p>
  <div className="l1a-actions"><button type="button" className="btn small" onClick={()=>onPart('b',0)}>Teil B'ye geç<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button><button type="button" className="btn secondary small" onClick={()=>onGo(stepIndex('harfler'))}>Alıştırmaları tekrar yap</button><button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>Lektion 1 içindekiler</button></div>
 </>;
}
