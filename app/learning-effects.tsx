'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {Check,ChevronDown,Play,Square,Star,Volume2,X} from 'lucide-react';
import {wrongSoundIds,tapChoiceIds,pageSoundIds,correctSoundIds,completeSoundIds,nextTapSound,type SoundId} from '@/lib/effect-sounds';
import {germanSpeechPreview} from '@/lib/german-speech';
import {DEFAULT_SITE_VOICE,isSiteVoice,voiceSample} from '@/lib/site-voices';
import {useGermanSpeech} from './study-shared';
import {effectsText,type EffectsCopyKey} from '@/lib/effects-copy';
import {isVaultLanguage,type VaultLanguage} from '@/lib/object-vault-copy';
import {defaultEffects,EFFECTS_CHANGED,EFFECTS_KEY,LEARNING_REACTION,readEffects,saveEffects,motionAllowed,playLearningSound,canPlayEffects,stopAllEffects,warmEffects,type EffectsPreferences,type LearningReaction} from '@/lib/learning-effects';
import {languageDirection,loadLanguagePack} from '@/lib/site-languages';
import {PAUL_PICTURES,PaulPeek,playPaulSound,type PaulPose} from './paul-hoca';
import {TopIcon} from './top-icons';

// Buttons and links that open another view get a soft gust of wind instead of a tap.
const NAVIGATION='a[href],.housing-card-open,.housing-card-bottom,.housing-feature,.vault-category-open,.vault-back-categories,.object-exit,.progress-topic,.toon-level-switch button,.nb-tabs button';
/** The three speaking speeds of the site voices (also offered in the welcome tour, app/site-tour.tsx). */
export const VOICE_SPEEDS=[['0.65','speedSlow'],['0.94','speedComfortable'],['1','speedNormal']] as const;

const OPEN_EFFECTS='lernkoko-open-effects';
/** Paul Hoca reacts in the answer badge: "Harika!" — he drums on the desk (the learner chose it), "Bir daha
 * deneyelim" — a gentle raised finger, end of a round — he claps, with applause. Right and wrong answers keep only
 * their own effect sound (then the right answer is read). The badge stays long enough to see his animation. */
const REACTION_MS={correct:2000,wrong:2100,complete:2600} as const;
const REACTION_POSE:Record<LearningReaction,PaulPose>={correct:'desk',wrong:'wrong',complete:'cheer'};
/** The sound groups of the dialog: the moment, its title and the sounds to choose from (the first is the default). */
const soundGroups=[
 {key:'tap',title:'chooseTap',ids:tapChoiceIds},
 {key:'page',title:'choosePage',ids:pageSoundIds},
 {key:'correct',title:'chooseCorrect',ids:correctSoundIds},
 {key:'complete',title:'chooseComplete',ids:completeSoundIds},
 {key:'wrong',title:'wrong',ids:wrongSoundIds},
] as const satisfies readonly {key:'tap'|'page'|'correct'|'complete'|'wrong';title:EffectsCopyKey;ids:readonly SoundId[]}[];
/** The four first sounds keep their old copy keys ("Tıklama · Baloncuk"); in the list only the sound's own name is shown. */
const defaultNames:Partial<Record<SoundId,EffectsCopyKey>>={tap:'nameBubble',whoosh:'nameWind',correct:'nameChimes',complete:'nameCelebration'};
const soundName=(id:SoundId):EffectsCopyKey=>defaultNames[id]??(id as EffectsCopyKey);

/** The sound button of the header: the learner's speaker icon, crossed out while the sound effects are off. */
export function EffectsSettingsButton({language}:{language:VaultLanguage}) {
 const [enabled,setEnabled]=useState(true);
 useEffect(()=>{const sync=()=>setEnabled(readEffects().enabled);sync();window.addEventListener(EFFECTS_CHANGED,sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener(EFFECTS_CHANGED,sync);window.removeEventListener('storage',sync);};},[]);
 return <button type="button" className="lk-effects-button" data-no-effects data-effects-on={enabled?'':undefined} aria-label={effectsText(language,'settings')} title={effectsText(language,'settings')} aria-haspopup="dialog" onClick={()=>window.dispatchEvent(new Event(OPEN_EFFECTS))}><TopIcon name={enabled?'sounds':'soundsOff'} size={30}/></button>;
}
export default function LearningEffects() {
 const [preferences,setPreferences]=useState<EffectsPreferences>(defaultEffects);
 const [language,setLanguage]=useState<VaultLanguage>('de');
 const [systemReduced,setSystemReduced]=useState(false);
 const [playing,setPlaying]=useState<SoundId|null>(null);
 const [message,setMessage]=useState<EffectsCopyKey|null>(null);
 // Three tabs instead of one long panel (the learner asked, 22 October 2026): Telaffuz, Efektler, Animasyonlar.
 const [tab,setTab]=useState<'voice'|'effects'|'motion'>('voice');
 const [reaction,setReaction]=useState<{kind:LearningReaction;id:number;pose:PaulPose}|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const previewStop=useRef<(()=>void)|null>(null);
 const reactionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const sequence=useRef(0);
 const text=(key:EffectsCopyKey)=>effectsText(language,key);
 const speech=useGermanSpeech('de');
 // Only the natural site voices are offered (no "Cihaz sesi" choice); anything else shows the default voice as chosen.
 const currentVoice=isSiteVoice(speech.voiceName)?speech.voiceName:(speech.siteVoices.length?DEFAULT_SITE_VOICE:'');
 function chooseVoice(id:string,sample:string){stopAllEffects();previewStop.current?.();setPlaying(null);speech.setVoiceName(id);speech.speak(sample,false,id);setMessage('saved');}
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{
   const next=readEffects();setPreferences(next);setSystemReduced(media.matches);
   document.documentElement.dataset.lernkokoMotion=next.motion&&!media.matches?'full':'reduced';
   if(!next.motion||media.matches)setReaction(null);
  };
  // The page sets <html lang> after the language pack is loaded; load it here too before switching (it is cached).
  let localeRequest=0;
  const locale=()=>{const code=document.documentElement.lang.split('-')[0];if(!isVaultLanguage(code))return;const id=++localeRequest;void loadLanguagePack(code).then(()=>{if(id===localeRequest)setLanguage(code);});};
  sync();locale();
  const observer=new MutationObserver(locale);observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  const storage=(event:StorageEvent)=>{if(event.key===EFFECTS_KEY){stopAllEffects();sync();}};
  const open=()=>{locale();setMessage(null);if(!dialog.current?.open)dialog.current?.showModal();};
  const feedback=(event:Event)=>{
   const kind=(event as CustomEvent<LearningReaction>).detail;
   if(!['correct','wrong','complete'].includes(kind)||document.hidden||!motionAllowed())return;
   if(reactionTimer.current)clearTimeout(reactionTimer.current);
   const pose=REACTION_POSE[kind];
   setReaction({kind,id:++sequence.current,pose});reactionTimer.current=setTimeout(()=>setReaction(null),REACTION_MS[kind]);
   if(kind==='complete')playPaulSound(pose);
  };
  const tap=(event:MouseEvent)=>{
   if(!(event.target instanceof Element))return;
   const target=event.target.closest<HTMLElement>('button,a[href],summary,[role="tab"]');
   if(!target||target.closest('[data-no-effects],.lk-effects-dialog')||target.matches(':disabled,[aria-disabled="true"]'))return;
   // Answer and speech buttons have their own feedback; never cover pronunciation with a pop.
   const silent=target.matches('.object-option,.check-button,[type="submit"],[data-article-answer],[data-answer-tap]')||target.closest('.vault-listen-player,.vault-speech-settings,.sound-settings,.audio-actions')||target.querySelector('[class*="lucide-volume"],[class*="lucide-headphone"],[class*="lucide-mic"],[class*="lucide-square"]');
   if(!silent&&!window.speechSynthesis?.speaking&&!window.speechSynthesis?.pending){const chosen=readEffects();playLearningSound(target.matches(NAVIGATION)?chosen.page:nextTapSound(chosen.tap));}
   if(!motionAllowed())return;
   const mark=++sequence.current;target.dataset.lkTap=String(mark);
   target.classList.remove('lk-tap-pop');void target.offsetWidth;target.classList.add('lk-tap-pop');
   setTimeout(()=>{if(target.dataset.lkTap===String(mark)){target.classList.remove('lk-tap-pop');delete target.dataset.lkTap;}},440);
  };
  // After the first tap: fetch the sounds and Paul's answer pictures, so his first reaction shows at once.
  const warm=()=>{warmEffects();for(const pose of ['desk','wrong','cheer','hello'] as const){const picture=new Image();picture.decoding='async';picture.src=PAUL_PICTURES[pose];}};
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
  <PaulPeek/>
  {reaction&&<div key={reaction.id} className={'lk-reaction-layer '+(reaction.kind==='wrong'?'retry':'celebrate')+' kind-'+reaction.kind} aria-hidden="true">
   <div className="lk-reaction-badge"><img className="lk-reaction-paul" src={PAUL_PICTURES[reaction.pose]} alt="" width={224} height={224} decoding="async"/><strong>{text(reaction.kind==='complete'?'done':reaction.kind==='correct'?'great':'retry')}</strong></div>
   {confetti&&Array.from({length:reaction.kind==='complete'?24:14},(_,i)=><span key={i} className={'lk-confetti piece-'+i%4} style={{'--lk-x':`${(i*83%430)-215}px`,'--lk-y':`${85+i*43%175}px`,'--lk-rotate':`${i*71}deg`,'--lk-delay':`${i%5*24}ms`} as CSSProperties}>{i%3===0?<Star size={14} fill="currentColor"/>:null}</span>)}
  </div>}
  <dialog ref={dialog} className="lk-effects-dialog" aria-labelledby="lk-effects-title" lang={language} dir={languageDirection(language)} data-no-effects onClose={()=>{previewStop.current?.();setPlaying(null);speech.stop();}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();}}}>
   <div className="lk-effects-top">
   <div className="lk-effects-head"><div><TopIcon name="sounds" size={32}/><h2 id="lk-effects-title">{text('settings')}</h2></div><button type="button" className="lk-effects-close" aria-label={text('close')} onClick={close}><X size={21}/></button></div>
   <div className="lk-effects-tabs" role="tablist" aria-label={text('settings')}>{([['voice','tabVoice','voice'],['effects','tabEffects','sounds'],['motion','tabMotion','animations']] as const).map(([id,key,icon])=><button type="button" role="tab" key={id} id={'lk-tab-'+id} aria-selected={tab===id} aria-controls={'lk-panel-'+id} className={tab===id?'active':''} onClick={()=>setTab(id)}><TopIcon name={icon} size={22}/>{text(key)}</button>)}</div>
   </div>
   <section className="lk-voice-section" id="lk-panel-voice" role="tabpanel" aria-labelledby="lk-tab-voice" hidden={tab!=='voice'}>
    <h3 id="lk-voice-title"><TopIcon name="voice" size={26}/>{text('voiceTitle')}</h3>
    <p className="lk-effects-note">{text('voiceHint')}</p>
    {speech.siteVoicesState==='loading'&&<p className="lk-effects-note">{text('voiceLoading')}</p>}
    {speech.siteVoicesState==='unavailable'&&<p className="lk-effects-note">{text('voiceFallback')}</p>}
    <div className="lk-voice-grid" role="radiogroup" aria-labelledby="lk-voice-title">
     {speech.siteVoices.map(voice=><button type="button" key={voice.id} role="radio" aria-checked={currentVoice===voice.id} className={'lk-voice-chip '+voice.gender+(currentVoice===voice.id?' selected':'')} onClick={()=>chooseVoice(voice.id,voiceSample(voice,germanSpeechPreview))}><span className="lk-voice-avatar" aria-hidden="true">{voice.name[0]}</span><span><strong>{voice.name}</strong><small>{text(voice.gender==='female'?'voiceFemale':'voiceMale')}</small></span></button>)}
    </div>
    <div className="lk-voice-speed" role="group" aria-label={text('voiceSpeed')}><span>{text('voiceSpeed')}</span>{VOICE_SPEEDS.map(([value,key])=><button type="button" key={value} aria-pressed={speech.rate===value} className={speech.rate===value?'active':''} onClick={()=>{speech.setRate(value);setMessage('saved');}}>{text(key)}</button>)}</div>
    <button type="button" className="lk-preview-button lk-voice-preview" onClick={()=>{if(speech.busy){speech.stop();return;}stopAllEffects();previewStop.current?.();setPlaying(null);const voice=speech.siteVoices.find(item=>item.id===currentVoice);speech.speak(voice?voiceSample(voice,germanSpeechPreview):germanSpeechPreview);}}>{speech.busy?<Square size={15}/>:<Play size={15}/>} {text(speech.busy?'voiceStop':'voicePreview')}</button>
   </section>
   <section className="lk-effects-panel" id="lk-panel-effects" role="tabpanel" aria-labelledby="lk-tab-effects" hidden={tab!=='effects'}>
    <div className="lk-effects-switches"><label><span><TopIcon name={preferences.enabled?'sounds':'soundsOff'} size={26}/> {text('enabled')}</span><input type="checkbox" checked={preferences.enabled} onChange={event=>update({enabled:event.target.checked})}/></label></div>
    <div className="lk-volume-row"><label className="lk-volume-label" htmlFor="lk-volume"><span>{text('volume')}</span><output>{Math.round(preferences.volume*100)}%</output></label><input id="lk-volume" className="lk-volume" type="range" min="0" max="100" step="5" value={Math.round(preferences.volume*100)} onChange={event=>update({volume:Number(event.target.value)/100})}/></div>
    {/* One group for each moment (tap, page change, correct, end of a round, wrong); each sound can be heard and chosen. */}
    {soundGroups.map(group=>{const chosen=preferences[group.key];return <details className="lk-sound-group" key={group.key} data-sound-group={group.key}><summary><span>{text(group.title)}</span><small>{text(soundName(chosen))}</small><ChevronDown size={17} aria-hidden="true"/></summary><fieldset className="lk-wrong-sounds"><legend className="lk-visually-hidden">{text(group.title)}</legend>{group.ids.map(id=><div className={'lk-sound-row '+(chosen===id?'selected':'')} key={id}><button type="button" className="lk-choose-sound" aria-pressed={chosen===id} aria-label={text('choose')+' · '+text(soundName(id))} onClick={()=>{update({[group.key]:id} as Partial<EffectsPreferences>);preview(id);setMessage('saved');}}><span className="lk-radio" aria-hidden="true">{chosen===id&&<Check size={14}/>}</span><span>{text(soundName(id))}</span>{chosen===id&&<small>{text('chosen')}</small>}</button><button type="button" className="lk-preview-button" disabled={preferences.volume===0} aria-label={text('listen')+' · '+text(soundName(id))} onClick={()=>preview(id)}>{playing===id?<Volume2 size={16}/>:<Play size={15}/>} {text('listen')}</button></div>)}</fieldset></details>;})}
   </section>
   <section className="lk-effects-panel" id="lk-panel-motion" role="tabpanel" aria-labelledby="lk-tab-motion" hidden={tab!=='motion'}>
    <div className="lk-effects-switches"><label><span><TopIcon name="animations" size={26}/> {text('motion')}</span><input type="checkbox" checked={preferences.motion} onChange={event=>update({motion:event.target.checked})}/></label></div>
    {systemReduced&&<p className="lk-effects-note">{text('reduced')}</p>}
   </section>
   <div className="lk-effects-foot"><p className="lk-effects-note lk-effects-message" role="status" aria-live="polite">{message?text(message):''}</p>
   <button type="button" className="lk-effects-done" onClick={close}>{text('close')}<Check size={17}/></button></div>
  </dialog>
 </>;
}
