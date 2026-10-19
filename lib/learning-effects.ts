import {soundRecipes,soundDuration,wrongSoundIds,tapChoiceIds,pageSoundIds,correctSoundIds,completeSoundIds,type SoundId,type WrongSoundId,type TapChoiceId,type PageSoundId,type CorrectSoundId,type CompleteSoundId} from './effect-sounds';

/** Generated at build time by scripts/sounds/make-sounds.mjs. */
export const SOUND_FOLDER='/sfx/';
export function soundUrl(id:SoundId){return SOUND_FOLDER+id+'.wav';}
let warmed=false;
/** Fetch every effect once (after the first tap) so later sounds start instantly. */
export function warmEffects(){
 if(warmed||typeof window==='undefined'||typeof fetch!=='function')return;warmed=true;
 for(const id of Object.keys(soundRecipes) as SoundId[])void fetch(soundUrl(id)).catch(()=>{});
}
import {configureAudioSession} from './audio-session';

export const EFFECTS_KEY = 'lernkoko-effects-v1';
export const EFFECTS_CHANGED = 'lernkoko-effects-changed';
export const LEARNING_REACTION = 'lernkoko-learning-reaction';
/** One chosen sound for each moment: tap (buttons), page (moving to another page or card), correct, complete (end of a round) and wrong. */
export type EffectsPreferences = {enabled:boolean;motion:boolean;volume:number;wrong:WrongSoundId;tap:TapChoiceId;page:PageSoundId;correct:CorrectSoundId;complete:CompleteSoundId};
export type LearningReaction = 'correct'|'wrong'|'complete';
export const defaultEffects:EffectsPreferences = {enabled:true,motion:true,volume:.65,wrong:'cartoon',tap:'tap',page:'whoosh',correct:'correct',complete:'complete'};
const pick=<T extends string>(list:readonly T[],value:unknown,fallback:T):T=>list.includes(value as T)?value as T:fallback;

export function normalizeEffects(value:unknown):EffectsPreferences {
 const data=value && typeof value==='object'?value as Partial<EffectsPreferences>:{};
 return {enabled:typeof data.enabled==='boolean'?data.enabled:defaultEffects.enabled,motion:typeof data.motion==='boolean'?data.motion:defaultEffects.motion,volume:typeof data.volume==='number'&&Number.isFinite(data.volume)?Math.min(1,Math.max(0,data.volume)):defaultEffects.volume,wrong:pick(wrongSoundIds,data.wrong,defaultEffects.wrong),tap:pick(tapChoiceIds,data.tap,defaultEffects.tap),page:pick(pageSoundIds,data.page,defaultEffects.page),correct:pick(correctSoundIds,data.correct,defaultEffects.correct),complete:pick(completeSoundIds,data.complete,defaultEffects.complete)};
}
let memory={...defaultEffects};
export function readEffects():EffectsPreferences {
 if(typeof window==='undefined')return {...defaultEffects};
 try {const saved=window.localStorage.getItem(EFFECTS_KEY);if(saved)memory=normalizeEffects(JSON.parse(saved));}catch{}
 return {...memory};
}
export function saveEffects(value:EffectsPreferences) {
 memory=normalizeEffects(value);
 try {window.localStorage.setItem(EFFECTS_KEY,JSON.stringify(memory));}catch{}
 if(!memory.enabled||memory.volume===0)stopAllEffects();
 window.dispatchEvent(new CustomEvent(EFFECTS_CHANGED));
}
export function motionAllowed() {
 return typeof window!=='undefined'&&readEffects().motion&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function learningReaction(kind:LearningReaction) {
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent(LEARNING_REACTION,{detail:kind}));
}
let audio:AudioContext|null=null;
const active=new Set<()=>void>();
export function prepareEffects() {
 if(typeof window==='undefined')return null;
 configureAudioSession();
 const Constructor=window.AudioContext??(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
 if(!Constructor)return null;
 try {
  if(audio&&String(audio.state)==='interrupted'){void audio.close().catch(()=>{});audio=null;}
  if(!audio||audio.state==='closed')audio=new Constructor();
  if(audio.state==='suspended')void audio.resume().catch(()=>{});
  return audio;
 }catch{return null;}
}
export function canPlayEffects(){return typeof window!=='undefined'&&!!(window.Audio||window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext);}
export function stopAllEffects(){[...active].forEach(stop=>stop());}
/** Audio starts only from a user gesture. Cancellation never invokes an answer callback. */
export function playLearningSound(id:SoundId,after?:()=>void,preview=false):()=>void {
 const preferences=readEffects();
 if(typeof window==='undefined'||(!preferences.enabled&&!preview)||preferences.volume===0||document.hidden){after?.();return ()=>{};}
 configureAudioSession();
 let finished=false;
 let media:HTMLAudioElement|null=null;let toneStarted=false;
 let timer:ReturnType<typeof setTimeout>|undefined;
 const nodes:{oscillator:OscillatorNode;gain:GainNode}[]=[];
 const finish=(notify:boolean)=>{
  if(finished)return;finished=true;if(timer!==undefined)clearTimeout(timer);active.delete(end);
  if(media){media.onended=null;media.onerror=null;media.onplaying=null;try{media.pause();}catch{}media=null;}
  nodes.forEach(({oscillator,gain})=>{oscillator.onended=null;try{oscillator.stop();}catch{}try{oscillator.disconnect();gain.disconnect();}catch{}});
  if(notify)after?.();
 };
 const stop=()=>finish(false);
 const end=()=>finish(true);
 active.add(end);
 const fallback=()=>{
  if(finished)return;
  if(toneStarted)return;toneStarted=true;
  if(timer!==undefined)clearTimeout(timer);
  if(media){media.onended=null;media.onerror=null;media.onplaying=null;try{media.pause();}catch{}media=null;}
  const context=prepareEffects();if(!context){finish(true);return;}
  const schedule=()=>{
  if(finished)return;
  if(context.state!=='running'){finish(true);return;}
  try {
   const base=context.currentTime+.012;
   for(const note of soundRecipes[id]){
    const oscillator=context.createOscillator(),gain=context.createGain();const start=base+note.start,end=start+note.duration;
    oscillator.type=note.type;oscillator.frequency.setValueAtTime(note.f,start);if(note.end)oscillator.frequency.exponentialRampToValueAtTime(note.end,end);
    gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,note.gain*preferences.volume),start+.012);gain.gain.exponentialRampToValueAtTime(.0001,end);
    oscillator.connect(gain);gain.connect(context.destination);nodes.push({oscillator,gain});oscillator.start(start);oscillator.stop(end+.008);
   }
   const last=nodes[soundRecipes[id].reduce((index,note,i,notes)=>note.start+note.duration>notes[index].start+notes[index].duration?i:index,0)];
   last.oscillator.onended=()=>finish(true);
   if(timer!==undefined)clearTimeout(timer);timer=setTimeout(()=>finish(true),soundDuration(id)*1000+200);
  }catch{finish(true);}
  };
  timer=setTimeout(()=>finish(true),1200);
  if(context.state==='running')schedule();else void context.resume().then(schedule,()=>finish(true));
 };
 // Start the real uploaded clip directly in the tap. This remains independent
 // of a Web Audio context suspended by the app, silent mode or tab switching.
 if(typeof window.Audio==='function'){
  try{
   media=new window.Audio(soundUrl(id));media.preload='auto';media.volume=preferences.volume;
   const playing=()=>{if(finished||toneStarted)return;if(timer!==undefined)clearTimeout(timer);timer=setTimeout(()=>finish(true),soundDuration(id)*1000+1200);};
   media.onplaying=playing;media.onended=()=>finish(true);media.onerror=fallback;
   timer=setTimeout(fallback,1800);
   const started=media.play();if(started)void started.then(playing,fallback);
  }catch{fallback();}
 }else fallback();
 return stop;
}
