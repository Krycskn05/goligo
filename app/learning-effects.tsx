'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {Check,Mic,Play,RotateCcw,Smartphone,Sparkles,Square,Star,Trophy,Volume2,VolumeX,X} from 'lucide-react';
import {wrongSoundIds,nextTapSound,type SoundId} from '@/lib/effect-sounds';
import {chooseGermanVoice,germanSpeechPreview} from '@/lib/german-speech';
import {DEFAULT_SITE_VOICE,isSiteVoice,voiceGreeting} from '@/lib/site-voices';
import {useGermanSpeech} from './study-shared';
import {effectsText,type EffectsCopyKey} from '@/lib/effects-copy';
import {isVaultLanguage,type VaultLanguage} from '@/lib/object-vault-copy';
import {defaultEffects,EFFECTS_CHANGED,EFFECTS_KEY,LEARNING_REACTION,readEffects,saveEffects,motionAllowed,playLearningSound,canPlayEffects,stopAllEffects,warmEffects,type EffectsPreferences,type LearningReaction} from '@/lib/learning-effects';

// Buttons and links that open another view get a soft gust of wind instead of a tap.
const NAVIGATION='a[href],.housing-card-open,.housing-card-bottom,.housing-feature,.vault-category-open,.vault-back-categories,.object-exit,.progress-topic,.toon-level-switch button';
const SPEEDS=[['0.65','speedSlow'],['0.94','speedComfortable'],['1','speedNormal']] as const;

const OPEN_EFFECTS='lernkoko-open-effects';
export function EffectsSettingsButton({language}:{language:VaultLanguage}) {
 return <button type="button" className="lk-effects-button" data-no-effects aria-label={effectsText(language,'settings')} title={effectsText(language,'settings')} aria-haspopup="dialog" onClick={()=>window.dispatchEvent(new Event(OPEN_EFFECTS))}><Volume2 size={19}/><Sparkles size={15}/></button>;
}
export default function LearningEffects() {
 const [preferences,setPreferences]=useState<EffectsPreferences>(defaultEffects);
 const [language,setLanguage]=useState<VaultLanguage>('tr');
 const [systemReduced,setSystemReduced]=useState(false);
 const [playing,setPlaying]=useState<SoundId|null>(null);
 const [message,setMessage]=useState<EffectsCopyKey|null>(null);
 const [reaction,setReaction]=useState<{kind:LearningReaction;id:number}|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const previewStop=useRef<(()=>void)|null>(null);
 const reactionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const sequence=useRef(0);
 const text=(key:EffectsCopyKey)=>effectsText(language,key);
 const speech=useGermanSpeech('de');
 // A device voice the learner picked earlier stays visible as the device choice.
 const savedDevice=speech.voiceName&&!isSiteVoice(speech.voiceName)?speech.voices.find(voice=>voice.name===speech.voiceName):undefined;
 const deviceVoice=savedDevice??chooseGermanVoice(speech.voices);
 const currentVoice=speech.voiceName||(speech.siteVoices.length?DEFAULT_SITE_VOICE:'');
 function chooseVoice(id:string,sample:string){stopAllEffects();previewStop.current?.();setPlaying(null);speech.setVoiceName(id);speech.speak(sample,false,id);setMessage('saved');}
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{
   const next=readEffects();setPreferences(next);setSystemReduced(media.matches);
   document.documentElement.dataset.lernkokoMotion=next.motion&&!media.matches?'full':'reduced';
   if(!next.motion||media.matches)setReaction(null);
  };
  const locale=()=>{const code=document.documentElement.lang.split('-')[0];if(isVaultLanguage(code))setLanguage(code);};
  sync();locale();
  const observer=new MutationObserver(locale);observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  const storage=(event:StorageEvent)=>{if(event.key===EFFECTS_KEY){stopAllEffects();sync();}};
  const open=()=>{locale();setMessage(null);if(!dialog.current?.open)dialog.current?.showModal();};
  const feedback=(event:Event)=>{
   const kind=(event as CustomEvent<LearningReaction>).detail;
   if(!['correct','wrong','complete'].includes(kind)||document.hidden||!motionAllowed())return;
   if(reactionTimer.current)clearTimeout(reactionTimer.current);
   setReaction({kind,id:++sequence.current});reactionTimer.current=setTimeout(()=>setReaction(null),kind==='complete'?1500:1050);
  };
  const tap=(event:MouseEvent)=>{
   if(!(event.target instanceof Element))return;
   const target=event.target.closest<HTMLElement>('button,a[href],summary,[role="tab"]');
   if(!target||target.closest('[data-no-effects],.lk-effects-dialog')||target.matches(':disabled,[aria-disabled="true"]'))return;
   // Answer and speech buttons have their own feedback; never cover pronunciation with a pop.
   const silent=target.matches('.object-option,.check-button,[type="submit"]')||target.closest('.vault-listen-player,.vault-speech-settings,.sound-settings,.audio-actions')||target.querySelector('[class*="lucide-volume"],[class*="lucide-headphone"],[class*="lucide-mic"],[class*="lucide-square"]');
   if(!silent&&!window.speechSynthesis?.speaking&&!window.speechSynthesis?.pending){playLearningSound(target.matches(NAVIGATION)?'whoosh':nextTapSound());}
   if(!motionAllowed())return;
   const mark=++sequence.current;target.dataset.lkTap=String(mark);
   target.classList.remove('lk-tap-pop');void target.offsetWidth;target.classList.add('lk-tap-pop');
   setTimeout(()=>{if(target.dataset.lkTap===String(mark)){target.classList.remove('lk-tap-pop');delete target.dataset.lkTap;}},440);
  };
  const warm=()=>warmEffects();
  const visibility=()=>{if(document.hidden){stopAllEffects();previewStop.current?.();setPlaying(null);setReaction(null);}};
  window.addEventListener(EFFECTS_CHANGED,sync);window.addEventListener('storage',storage);window.addEventListener(OPEN_EFFECTS,open);window.addEventListener(LEARNING_REACTION,feedback);
  document.addEventListener('click',tap,true);document.addEventListener('pointerdown',warm,{once:true,capture:true});document.addEventListener('visibilitychange',visibility);media.addEventListener('change',sync);
  return()=>{observer.disconnect();window.removeEventListener(EFFECTS_CHANGED,sync);window.removeEventListener('storage',storage);window.removeEventListener(OPEN_EFFECTS,open);window.removeEventListener(LEARNING_REACTION,feedback);document.removeEventListener('click',tap,true);document.removeEventListener('pointerdown',warm,{capture:true});document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',sync);previewStop.current?.();stopAllEffects();if(reactionTimer.current)clearTimeout(reactionTimer.current);delete document.documentElement.dataset.lernkokoMotion;};
 },[]);
 function update(change:Partial<EffectsPreferences>){saveEffects({...readEffects(),...change});setMessage('saved');}
 function preview(id:SoundId){
  previewStop.current?.();speech.stop();setMessage(null);
  if(!canPlayEffects()){setMessage('soundUnavailable');setPlaying(null);return;}
  setPlaying(id);previewStop.current=playLearningSound(id,()=>{setPlaying(null);previewStop.current=null;},true);
 }
 function close(){previewStop.current?.();previewStop.current=null;setPlaying(null);speech.stop();dialog.current?.close();}
 const confetti=reaction&&reaction.kind!=='wrong';
 return <>
  {reaction&&<div key={reaction.id} className={'lk-reaction-layer '+(reaction.kind==='wrong'?'retry':'celebrate')} aria-hidden="true">
   <div className="lk-reaction-badge">{reaction.kind==='complete'?<Trophy size={26}/>:reaction.kind==='correct'?<Sparkles size={26}/>:<RotateCcw size={24}/>}<strong>{text(reaction.kind==='complete'?'done':reaction.kind==='correct'?'great':'retry')}</strong></div>
   {confetti&&Array.from({length:reaction.kind==='complete'?24:14},(_,i)=><span key={i} className={'lk-confetti piece-'+i%4} style={{'--lk-x':`${(i*83%430)-215}px`,'--lk-y':`${85+i*43%175}px`,'--lk-rotate':`${i*71}deg`,'--lk-delay':`${i%5*24}ms`} as CSSProperties}>{i%3===0?<Star size={14} fill="currentColor"/>:null}</span>)}
  </div>}
  <dialog ref={dialog} className="lk-effects-dialog" aria-labelledby="lk-effects-title" lang={language} dir={language==='ar'||language==='fa'?'rtl':'ltr'} data-no-effects onClose={()=>{previewStop.current?.();setPlaying(null);speech.stop();}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();}}}>
   <div className="lk-effects-head"><div><Sparkles size={22}/><h2 id="lk-effects-title">{text('settings')}</h2></div><button type="button" className="lk-effects-close" aria-label={text('close')} onClick={close}><X size={21}/></button></div>
   <section className="lk-voice-section" aria-labelledby="lk-voice-title">
    <h3 id="lk-voice-title"><Mic size={18}/>{text('voiceTitle')}</h3>
    <p className="lk-effects-note">{text('voiceHint')}</p>
    {speech.siteVoicesState==='loading'&&<p className="lk-effects-note">{text('voiceLoading')}</p>}
    {speech.siteVoicesState==='unavailable'&&<p className="lk-effects-note">{text('voiceFallback')}</p>}
    <div className="lk-voice-grid" role="radiogroup" aria-labelledby="lk-voice-title">
     {speech.siteVoices.map(voice=><button type="button" key={voice.id} role="radio" aria-checked={currentVoice===voice.id} className={'lk-voice-chip '+voice.gender+(currentVoice===voice.id?' selected':'')} onClick={()=>chooseVoice(voice.id,voiceGreeting(voice))}><span className="lk-voice-avatar" aria-hidden="true">{voice.name[0]}</span><span><strong>{voice.name}</strong><small>{text(voice.gender==='female'?'voiceFemale':'voiceMale')}</small></span></button>)}
     {deviceVoice&&<button type="button" role="radio" aria-checked={currentVoice===deviceVoice.name} className={'lk-voice-chip device'+(currentVoice===deviceVoice.name?' selected':'')} onClick={()=>chooseVoice(deviceVoice.name,germanSpeechPreview)}><span className="lk-voice-avatar" aria-hidden="true"><Smartphone size={16}/></span><span><strong>{text('voiceDevice')}</strong><small>{deviceVoice.name}</small></span></button>}
    </div>
    <div className="lk-voice-speed" role="group" aria-label={text('voiceSpeed')}><span>{text('voiceSpeed')}</span>{SPEEDS.map(([value,key])=><button type="button" key={value} aria-pressed={speech.rate===value} className={speech.rate===value?'active':''} onClick={()=>{speech.setRate(value);setMessage('saved');}}>{text(key)}</button>)}</div>
    <button type="button" className="lk-preview-button lk-voice-preview" onClick={()=>{if(speech.busy){speech.stop();return;}stopAllEffects();previewStop.current?.();setPlaying(null);const voice=speech.siteVoices.find(item=>item.id===currentVoice);speech.speak(voice?voiceGreeting(voice):germanSpeechPreview);}}>{speech.busy?<Square size={15}/>:<Play size={15}/>} {text(speech.busy?'voiceStop':'voicePreview')}</button>
   </section>
   <h3 className="lk-effects-subtitle"><Sparkles size={17}/>{text('effectsTitle')}</h3>
   <div className="lk-effects-switches"><label><span>{preferences.enabled?<Volume2 size={18}/>:<VolumeX size={18}/>} {text('enabled')}</span><input type="checkbox" checked={preferences.enabled} onChange={event=>update({enabled:event.target.checked})}/></label><label><span><Sparkles size={18}/> {text('motion')}</span><input type="checkbox" checked={preferences.motion} onChange={event=>update({motion:event.target.checked})}/></label></div>
   <label className="lk-volume-label" htmlFor="lk-volume"><span>{text('volume')}</span><output>{Math.round(preferences.volume*100)}%</output></label><input id="lk-volume" className="lk-volume" type="range" min="0" max="100" step="5" value={Math.round(preferences.volume*100)} onChange={event=>update({volume:Number(event.target.value)/100})}/>
   <div className="lk-fixed-sounds">{(['tap','whoosh','correct','complete'] as const).map(id=><div className="lk-sound-row" key={id}><span>{text(id)}</span><button type="button" className="lk-preview-button" disabled={preferences.volume===0} aria-label={text('listen')+' · '+text(id)} onClick={()=>preview(id)}>{playing===id?<Volume2 size={16}/>:<Play size={15}/>} {text('listen')}</button></div>)}</div>
   <fieldset className="lk-wrong-sounds"><legend>{text('wrong')}</legend>{wrongSoundIds.map(id=><div className={'lk-sound-row '+(preferences.wrong===id?'selected':'')} key={id}><button type="button" className="lk-choose-sound" aria-pressed={preferences.wrong===id} aria-label={text('choose')+' · '+text(id)} onClick={()=>{update({wrong:id});preview(id);setMessage('saved');}}><span className="lk-radio" aria-hidden="true">{preferences.wrong===id&&<Check size={14}/>}</span><span>{text(id)}</span>{preferences.wrong===id&&<small>{text('chosen')}</small>}</button><button type="button" className="lk-preview-button" disabled={preferences.volume===0} aria-label={text('listen')+' · '+text(id)} onClick={()=>preview(id)}>{playing===id?<Volume2 size={16}/>:<Play size={15}/>} {text('listen')}</button></div>)}</fieldset>
   {systemReduced&&<p className="lk-effects-note">{text('reduced')}</p>}
   <p className="lk-effects-note lk-effects-message" role="status" aria-live="polite">{message?text(message):'\u00a0'}</p>
   <button type="button" className="lk-effects-done" onClick={close}>{text('close')}<Check size={17}/></button>
  </dialog>
 </>;
}
