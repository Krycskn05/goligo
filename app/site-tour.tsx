'use client';
import {useCallback,useEffect,useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeft,ArrowRight,Check,Play,Square,Volume2,X} from 'lucide-react';
import {TOUR_STEPS,TOUR_KEY,TOUR_DONE,TOUR_PARAM,shouldStartTour,placeTip,type Box,type TipPlace,type TourStepId} from '@/lib/site-tour';
import {tourText,type TourCopyKey} from '@/lib/tour-copy';
import {effectsText} from '@/lib/effects-copy';
import {homeText} from '@/lib/home-copy';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {verbText} from '@/lib/verb-copy';
import {languageDirection,pickText} from '@/lib/site-languages';
import type {StudyLanguage} from '@/lib/study-languages';
import {EFFECTS_CHANGED,canPlayEffects,playLearningSound,readEffects,saveEffects,stopAllEffects,type EffectsPreferences} from '@/lib/learning-effects';
import {DEFAULT_SITE_VOICE,isSiteVoice,voiceGreeting} from '@/lib/site-voices';
import {useGermanSpeech} from './study-shared';
import {VOICE_SPEEDS} from './learning-effects';
import {PAUL_PICTURES,PAUL_STILL,usePaulMotion,type PaulPose} from './paul-hoca';
import {accountLabel,siteLanguageLabel} from './site-header';
import {TopIcon} from './top-icons';

type Step={id:TourStepId;target:string|null};
type Spot={step:TourStepId;hole:Box;radius:number;place:TipPlace};

/** Title and text of each step: the names come from the menu, the header and the sound settings themselves. */
function stepCopy(id:TourStepId,language:StudyLanguage):[string,string]{
 const t=(key:TourCopyKey)=>tourText(language,key);
 switch(id){
  case 'sounds':return [t('welcome'),t('soundsLead')];
  case 'clock':return [t('clockTitle'),t('clockText')];
  case 'language':return [pickText(siteLanguageLabel,language),t('languageText')];
  case 'effects':return [effectsText(language,'settings'),t('soundsText')];
  case 'account':return [pickText(accountLabel,language),t('accountText')];
  case 'units':return [c(language,'catalogTitle'),homeText(language,'unitsText')];
  case 'vault':return [vaultText(language,'vaultTitle'),homeText(language,'vaultText')];
  case 'verbs':return [verbText(language,'workshopTitle'),homeText(language,'verbsText')];
  case 'games':return [verbText(language,'gamesTitle'),homeText(language,'gamesText')];
  case 'mistakes':return [verbText(language,'mistakesTitle'),homeText(language,'mistakesText')];
  case 'install':return [homeText(language,'installButton'),homeText(language,'installLead')];
  case 'done':return [t('doneTitle'),t('doneText')];
 }
}
const shown=(element:Element|null)=>!!element&&element.getClientRects().length>0&&getComputedStyle(element).visibility!=='hidden';

function Paul({pose,className}:{pose:PaulPose;className:string}){
 const motion=usePaulMotion();
 return <img className={className} src={motion?PAUL_PICTURES[pose]:PAUL_STILL[pose]} alt="" width={224} height={224} decoding="async" draggable={false}/>;
}
function Dots({count,at}:{count:number;at:number}){
 return <span className="st-dots" aria-hidden="true">{Array.from({length:count},(_,i)=><b key={i} className={i===at?'on':i<at?'past':''}/>)}</span>;
}

/**
 * The first step: the learner is asked about the sounds (the learner asked: "herkese sesleri sor") — who reads the
 * German (the ten site voices; a tap lets the voice say hello), how fast, whether the sound effects play and how loud.
 * Every choice is saved at once, exactly like in "Sesler ve animasyonlar" (the speaker button in the header).
 */
function SoundChoices({language}:{language:StudyLanguage}){
 const speech=useGermanSpeech('de');
 const [preferences,setPreferences]=useState<EffectsPreferences>(()=>readEffects());
 const stopPreview=useRef<(()=>void)|null>(null);
 const [playing,setPlaying]=useState(false);
 const e=(key:Parameters<typeof effectsText>[1])=>effectsText(language,key);
 useEffect(()=>{const sync=()=>setPreferences(readEffects());window.addEventListener(EFFECTS_CHANGED,sync);return()=>{window.removeEventListener(EFFECTS_CHANGED,sync);stopPreview.current?.();};},[]);
 const current=isSiteVoice(speech.voiceName)?speech.voiceName:(speech.siteVoices.length?DEFAULT_SITE_VOICE:'');
 function update(change:Partial<EffectsPreferences>){const next={...readEffects(),...change};saveEffects(next);setPreferences(next);}
 function chooseVoice(id:string,sample:string){stopAllEffects();stopPreview.current?.();setPlaying(false);speech.setVoiceName(id);speech.speak(sample,false,id);}
 function preview(){
  stopPreview.current?.();speech.stop();
  if(!canPlayEffects())return;
  setPlaying(true);stopPreview.current=playLearningSound(readEffects().correct,()=>{setPlaying(false);stopPreview.current=null;},true);
 }
 return <div className="st-sounds" data-no-effects="">
  <section aria-labelledby="st-voice-title">
   <h3 id="st-voice-title"><TopIcon name="voice" size={24}/>{tourText(language,'voiceQuestion')}</h3>
   {speech.siteVoicesState==='loading'&&<p className="st-note">{e('voiceLoading')}</p>}
   {speech.siteVoicesState==='unavailable'&&<p className="st-note">{e('voiceFallback')}</p>}
   <div className="st-voices" role="radiogroup" aria-labelledby="st-voice-title">
    {speech.siteVoices.map(voice=><button type="button" key={voice.id} role="radio" aria-checked={current===voice.id} className={'st-voice '+voice.gender+(current===voice.id?' selected':'')} onClick={()=>chooseVoice(voice.id,voiceGreeting(voice))}>
     <span className="st-avatar" aria-hidden="true">{voice.name[0]}</span><strong>{voice.name}</strong><small>{e(voice.gender==='female'?'voiceFemale':'voiceMale')}</small>
    </button>)}
   </div>
  </section>
  <section className="st-row" aria-label={e('voiceSpeed')}>
   <h3>{e('voiceSpeed')}</h3>
   <div className="st-speeds" role="group" aria-label={e('voiceSpeed')}>{VOICE_SPEEDS.map(([value,key])=><button type="button" key={value} aria-pressed={speech.rate===value} className={speech.rate===value?'on':''} onClick={()=>speech.setRate(value)}>{e(key)}</button>)}</div>
   <button type="button" className="st-listen" onClick={()=>{if(speech.busy){speech.stop();return;}stopAllEffects();const voice=speech.siteVoices.find(item=>item.id===current);if(voice)speech.speak(voiceGreeting(voice));}} disabled={!speech.siteVoices.length}>{speech.busy?<Square size={14} aria-hidden="true"/>:<Play size={14} aria-hidden="true"/>}{e('listen')}</button>
  </section>
  <label className="st-switch">
   <span><TopIcon name={preferences.enabled?'sounds':'soundsOff'} size={28}/><span><strong>{e('enabled')}</strong><small>{tourText(language,'effectsNote')}</small></span></span>
   <input type="checkbox" role="switch" checked={preferences.enabled} onChange={event=>update({enabled:event.target.checked})}/>
  </label>
  <section className="st-row">
   <h3><label htmlFor="st-volume">{e('volume')}</label></h3>
   <input id="st-volume" className="st-volume" type="range" min="0" max="100" step="5" value={Math.round(preferences.volume*100)} disabled={!preferences.enabled} onChange={event=>update({volume:Number(event.target.value)/100})} style={{'--st-volume':Math.round(preferences.volume*100)+'%'} as CSSProperties}/>
   <output htmlFor="st-volume">{Math.round(preferences.volume*100)}%</output>
   <button type="button" className="st-listen" onClick={preview} disabled={!preferences.enabled||preferences.volume===0}>{playing?<Volume2 size={14} aria-hidden="true"/>:<Play size={14} aria-hidden="true"/>}{e('listen')}</button>
  </section>
 </div>;
}

/**
 * The welcome tour on the home page (lib/site-tour.ts; design "Spot ışığı", the learner chose it): first the sound
 * window, then the page dims and each part of the header and the menu lights up in turn while Paul explains it in a
 * card beside it (Geri / İleri, the dots show where you are), and at the end "Hazırsın!". The page behind cannot be
 * tapped meanwhile. Escape or × ends it; once ended it does not come back in this browser (Hesabım can start it again).
 */
export function SiteTour({language}:{language:StudyLanguage}){
 const [steps,setSteps]=useState<Step[]|null>(null);
 const [index,setIndex]=useState(0);
 const [spot,setSpot]=useState<Spot|null>(null);
 const layer=useRef<HTMLDivElement>(null);
 const tip=useRef<HTMLElement>(null);
 const primary=useRef<HTMLButtonElement>(null);
 const motion=usePaulMotion();
 const step=steps?.[index]??null;
 const t=(key:TourCopyKey)=>tourText(language,key);

 useEffect(()=>{
  let saved:string|null=null;try{saved=localStorage.getItem(TOUR_KEY);}catch{}
  if(!shouldStartTour(saved,window.location.search))return;
  // A moment after the page is ready, so the header and the menu are in place.
  const timer=setTimeout(()=>{setSteps(TOUR_STEPS.filter(item=>!item.target||shown(document.querySelector(item.target))));setIndex(0);},700);
  return()=>clearTimeout(timer);
 },[]);
 const finish=useCallback(()=>{
  try{localStorage.setItem(TOUR_KEY,TOUR_DONE);}catch{}
  try{const url=new URL(window.location.href);if(url.searchParams.has(TOUR_PARAM)){url.searchParams.delete(TOUR_PARAM);window.history.replaceState(null,'',url);}}catch{}
  stopAllEffects();setSteps(null);setSpot(null);
 },[]);
 const go=useCallback((next:number)=>{if(!steps)return;if(next>=steps.length){finish();return;}setIndex(Math.max(0,next));},[steps,finish]);

 // While the tour is open the page behind it cannot be tapped or reached with the keyboard.
 useEffect(()=>{
  if(!steps)return;
  const others=[...document.body.children].filter(element=>element!==layer.current&&!element.hasAttribute('inert'));
  others.forEach(element=>element.setAttribute('inert',''));
  document.documentElement.classList.add('st-open');
  return()=>{others.forEach(element=>element.removeAttribute('inert'));document.documentElement.classList.remove('st-open');};
 },[steps]);
 useEffect(()=>{
  if(!steps)return;
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();finish();return;}
   if(event.target instanceof HTMLInputElement)return;
   const forward=languageDirection(language)==='rtl'?'ArrowLeft':'ArrowRight',backward=forward==='ArrowLeft'?'ArrowRight':'ArrowLeft';
   if(event.key===forward){event.preventDefault();go(index+1);}else if(event.key===backward&&index>0){event.preventDefault();go(index-1);}
  };
  document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
 },[steps,index,go,finish,language]);
 // The main button gets the focus once the step is on the screen (a card being measured cannot take it yet).
 const shownStep=step&&(!step.target||spot?.step===step.id)?step.id:null;
 useEffect(()=>{if(shownStep)primary.current?.focus({preventScroll:true});},[shownStep]);

 // The lit part: scrolled into the middle of the screen, then the hole and Paul's card follow it while the page moves.
 const measure=useCallback(()=>{
  if(!step?.target)return;
  const element=document.querySelector(step.target);if(!element)return;
  const rect=element.getBoundingClientRect(),pad=6;
  const hole={left:rect.left-pad,top:rect.top-pad,width:rect.width+pad*2,height:rect.height+pad*2};
  const size={width:tip.current?.offsetWidth??320,height:tip.current?.offsetHeight??220};
  const corner=parseFloat(getComputedStyle(element).borderTopLeftRadius)||12;
  setSpot({step:step.id,hole,radius:corner>=rect.height/2?999:corner+pad,place:placeTip(hole,size,{width:window.innerWidth,height:window.innerHeight})});
 },[step]);
 useLayoutEffect(()=>{
  if(!step?.target){setSpot(null);return;}
  const element=document.querySelector(step.target);
  element?.scrollIntoView({block:'center',inline:'nearest',behavior:motion?'smooth':'auto'});
  measure();
  let frame=0;const again=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  const timers=[setTimeout(again,350),setTimeout(again,800)];
  window.addEventListener('scroll',again,{passive:true,capture:true});window.addEventListener('resize',again);
  return()=>{cancelAnimationFrame(frame);timers.forEach(clearTimeout);window.removeEventListener('scroll',again,{capture:true});window.removeEventListener('resize',again);};
 },[step,measure,motion]);

 if(!steps||!step)return null;
 const [title,text]=stepCopy(step.id,language);
 const last=index===steps.length-1;
 const nav=<div className="st-foot">
  <Dots count={steps.length} at={index}/>
  <span className="st-buttons">
   {step.id==='sounds'
    ?<button type="button" className="st-ghost" onClick={finish}>{t('skip')}</button>
    :<button type="button" className="st-ghost" onClick={()=>go(index-1)}><ArrowLeft className="st-flip" size={16} aria-hidden="true"/>{t('back')}</button>}
   <button ref={primary} type="button" className="st-next" onClick={()=>go(index+1)}>
    {step.id==='sounds'?t('startTour'):last?t('finish'):t('next')}{last?<Check size={17} aria-hidden="true"/>:<ArrowRight className="st-flip" size={17} aria-hidden="true"/>}
   </button>
  </span>
 </div>;
 const ready=spot?.step===step.id;
 return createPortal(<div ref={layer} className={'st-layer'+(motion?' st-motion':'')} role="dialog" aria-modal="true" aria-label={t('tourLabel')} aria-describedby="st-text" lang={language} dir={languageDirection(language)} data-site-tour={step.id}>
  {step.target
   ?<>
    <div className="st-block"/>
    {ready&&<div className="st-hole" style={{left:spot.hole.left,top:spot.hole.top,width:spot.hole.width,height:spot.hole.height,borderRadius:spot.radius}}/>}
    <section ref={tip} key={step.id} className={'st-tip'+(ready?' side-'+spot.place.side:' measuring')} style={ready?{left:spot.place.left,top:spot.place.top,'--st-arrow':spot.place.arrow+'px'} as CSSProperties:undefined}>
     <button type="button" className="st-close" aria-label={t('skip')} title={t('skip')} onClick={finish}><X size={17} aria-hidden="true"/></button>
     <div className="st-tip-head"><Paul pose="tip" className="st-paul"/><div><span className="st-count"><bdi>{index+1} / {steps.length}</bdi></span><h2>{title}</h2></div></div>
     <p id="st-text">{text}</p>
     {nav}
    </section>
   </>
   :<>
    <div className="st-veil"/>
    <section key={step.id} className={'st-modal st-step-'+step.id}>
     <div className="st-modal-head">
      <Paul pose={step.id==='done'?'cheer':'hello'} className="st-paul big"/>
      <div><h2>{title}</h2><p id="st-text">{text}</p></div>
      {step.id==='sounds'&&<button type="button" className="st-close" aria-label={t('skip')} title={t('skip')} onClick={finish}><X size={17} aria-hidden="true"/></button>}
     </div>
     {step.id==='sounds'&&<div className="st-modal-body"><SoundChoices language={language}/></div>}
     {nav}
    </section>
   </>}
 </div>,document.body);
}
