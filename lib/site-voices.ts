/**
 * Natural "site voices": every German text the site speaks is pre-rendered by
 * scripts/voices (Supertonic 3 preset voices) and served from /voices.
 * When a clip or the manifest is missing, speech falls back to the device voice.
 */
export const SITE_VOICE_PREFIX='site:';
export type SiteVoice={id:string;style:string;name:string;gender:'female'|'male';picture?:string};
/** The voices carry the names of the people of Lektion 1A (the learner asked, 25 October 2026): the voice that
 * reads Sabine in the lesson is called Sabine in the settings too (lib/willkommen-course.ts `speakers`), and shows
 * her picture; the teacher's voice (Paul) has no picture and shows its initial. Ids and styles never change, so a saved choice (for example site:F4) keeps working. */
const portrait=(name:string)=>'/toon/lektion1/'+name.toLowerCase()+'.webp';
export const siteVoices:readonly SiteVoice[]=[
 {id:'site:F1',style:'F1',name:'Sabine',gender:'female',picture:portrait('Sabine')},
 {id:'site:F2',style:'F2',name:'Yasemin',gender:'female',picture:portrait('Yasemin')},
 {id:'site:F3',style:'F3',name:'Aisha',gender:'female',picture:portrait('Aisha')},
 {id:'site:F4',style:'F4',name:'Nora',gender:'female',picture:portrait('Nora')},
 {id:'site:F5',style:'F5',name:'Mei',gender:'female',picture:portrait('Mei')},
 {id:'site:M1',style:'M1',name:'Rami',gender:'male',picture:portrait('Rami')},
 {id:'site:M2',style:'M2',name:'Omar',gender:'male',picture:portrait('Omar')},
 {id:'site:M3',style:'M3',name:'Paul',gender:'male'},
 {id:'site:M4',style:'M4',name:'Nikos',gender:'male',picture:portrait('Nikos')},
 {id:'site:M5',style:'M5',name:'Tomasz',gender:'male',picture:portrait('Tomasz')},
];
/** The voice choice shows women and men apart (the learner asked, 25 October 2026): women first, then men. */
export function voiceGroups<T extends Pick<SiteVoice,'gender'>>(list:readonly T[]):{gender:'female'|'male';voices:T[]}[]{
 return (['female','male'] as const).map(gender=>({gender,voices:list.filter(voice=>voice.gender===gender)})).filter(group=>group.voices.length>0);
}
export const DEFAULT_SITE_VOICE='site:F1';
/** Each site voice introduces itself when it is chosen in the settings. */
export function voiceGreeting(voice:Pick<SiteVoice,'name'>){return `Hallo, ich bin ${voice.name}. Lass uns zusammen Deutsch lernen!`;}
/** Clips are rendered at a calm pace; the "comfortable" speed plays them unchanged. */
export const SITE_CLIP_BASE_RATE=0.94;

/** `times`: the voices whose folder has a times.json with measured word starts (read-along by word, `clipWordTimes`);
 * an older manifest has none. */
export type VoiceManifest={version:number;settings?:string;voices:string[];clips:Record<string,string>;times?:string[]};

export function isSiteVoice(name:string|undefined|null):boolean{return typeof name==='string'&&name.startsWith(SITE_VOICE_PREFIX);}
export function siteVoiceById(id:string){return siteVoices.find(voice=>voice.id===id);}
/** Preferences saved since the natural site voices arrived carry this version. German offers only
 * the natural site voices now (the learner asked to drop the "Cihaz sesi" choice): a saved German
 * device-voice choice (for example "Helena") is dropped, so the learner hears the default site voice.
 * The device voice stays only as the silent fallback when a natural clip cannot play. */
export const VOICE_PREFERENCE_VERSION=2;
export function savedVoiceName(saved:unknown,course:string):string{
 if(!saved||typeof saved!=='object')return '';
 const {voiceName,voices}=saved as {voiceName?:unknown;voices?:unknown};
 if(typeof voiceName!=='string')return '';
 void voices;
 return course!=='de'||isSiteVoice(voiceName)?voiceName:'';
}
/** The same normalisation is used when the clips are rendered and when they are looked up. */
export function normalizeSpeechText(text:string){return text.replace(/\s+/g,' ').trim();}

export function parseVoiceManifest(value:unknown):VoiceManifest|null{
 if(!value||typeof value!=='object')return null;
 const data=value as Partial<VoiceManifest>;
 if(!Array.isArray(data.voices)||!data.clips||typeof data.clips!=='object')return null;
 const voices=data.voices.filter((style):style is string=>typeof style==='string'&&/^[A-Z][0-9]$/.test(style));
 const clips:Record<string,string>={};
 for(const [text,id] of Object.entries(data.clips))if(typeof id==='string'&&/^[a-f0-9]{8,40}$/.test(id))clips[normalizeSpeechText(text)]=id;
 const times=Array.isArray(data.times)?data.times.filter((style):style is string=>typeof style==='string'&&/^[A-Z][0-9]$/.test(style)):[];
 return {version:Number(data.version)||0,settings:typeof data.settings==='string'?data.settings:undefined,voices,clips,times};
}

/** Word times of a voice's clips (scripts/voices/word_times.py; <voice>/times.json): clip id → each word's start as a share
 * (0–1) of the clip, one per word of the text. Only well-formed entries are kept. */
export type WordTimes=Record<string,number[]>;
export function parseWordTimes(value:unknown):WordTimes{
 const table:WordTimes={};
 if(!value||typeof value!=='object')return table;
 for(const [id,starts] of Object.entries(value as Record<string,unknown>)){
  if(!/^[a-f0-9]{8,40}$/.test(id)||!Array.isArray(starts)||!starts.length)continue;
  if(starts.every(start=>typeof start==='number'&&Number.isFinite(start)&&start>=0&&start<=1))table[id]=starts as number[];
 }
 return table;
}
const timesTables=new Map<string,WordTimes>();const timesLoading=new Map<string,Promise<WordTimes>>();

let manifest:VoiceManifest|null=null;
let loading:Promise<VoiceManifest|null>|null=null;
const listeners=new Set<(value:VoiceManifest|null)=>void>();
export function currentVoiceManifest(){return manifest;}
export function setVoiceManifest(value:VoiceManifest|null){manifest=value;timesTables.clear();timesLoading.clear();listeners.forEach(listener=>listener(value));}
export function onVoiceManifest(listener:(value:VoiceManifest|null)=>void){listeners.add(listener);return()=>{listeners.delete(listener);};}
export function loadVoiceManifest(fetcher:typeof fetch=fetch):Promise<VoiceManifest|null>{
 if(manifest)return Promise.resolve(manifest);
 if(!loading)loading=fetcher('/voices/manifest.json',{cache:'no-cache'})
  .then(response=>response.ok?response.json():null)
  .then(data=>{const parsed=parseVoiceManifest(data);setVoiceManifest(parsed);if(!parsed)loading=null;return parsed;})
  .catch(()=>{loading=null;return null;});
 return loading;
}
/** Site voices whose clips are actually available. */
export function availableSiteVoices(value:VoiceManifest|null=manifest){return value?siteVoices.filter(voice=>value.voices.includes(voice.style)):[];}
/** The site voice to use for a stored preference: an explicit site voice, or the default when "automatic". */
export function resolveSiteVoice(preference:string,value:VoiceManifest|null=manifest):SiteVoice|undefined{
 const available=availableSiteVoices(value);
 if(isSiteVoice(preference))return available.find(voice=>voice.id===preference);
 if(preference==='')return available.find(voice=>voice.id===DEFAULT_SITE_VOICE)??available[0];
 return undefined;
}
export function siteClipUrl(voice:SiteVoice,text:string,value:VoiceManifest|null=manifest):string|null{
 const id=value?.clips[normalizeSpeechText(text)];
 return id&&value?.voices.includes(voice.style)?`/voices/${voice.style}/${id}.mp3`:null;
}
/** The clips to try for a text, in order: the chosen voice, then another voice of the same kind (a man stays a
 * man, a woman a woman), then the default voice. New texts are rendered voice by voice, so while one voice is
 * still missing a clip another natural voice plays it; the device voice (silent on some phones) is the very last fallback. */
export function siteClipUrls(preference:string,text:string,value:VoiceManifest|null=manifest):string[]{
 const voice=resolveSiteVoice(preference,value);const id=value?.clips[normalizeSpeechText(text)];
 if(!voice||!id||!value)return [];
 const others=availableSiteVoices(value).filter(other=>other.id!==voice.id);
 const backups=[others.find(other=>other.gender===voice.gender),others.find(other=>other.id===DEFAULT_SITE_VOICE)];
 const chain=[voice,...backups.filter((item):item is SiteVoice=>!!item)].filter((item,index,list)=>list.indexOf(item)===index);
 return chain.map(item=>`/voices/${item.style}/${id}.mp3`);
}
/** What a voice says when it is chosen or previewed: its greeting when that clip exists (or while the clip list is
 * still unknown), otherwise `fallback` — a sentence that has a clip — so a renamed voice is never read by the device voice. */
export function voiceSample(voice:SiteVoice,fallback:string,value:VoiceManifest|null=manifest):string{
 const greeting=voiceGreeting(voice);
 return !value||siteClipUrls(voice.id,greeting,value).length?greeting:fallback;
}
export function clipPlaybackRate(rate:number){
 const value=rate/SITE_CLIP_BASE_RATE;
 return Number.isFinite(value)?Math.max(0.5,Math.min(1.3,value)):1;
}

const clipAddress=/^\/voices\/([A-Z][0-9])\/([a-f0-9]{8,40})\.mp3$/;
/** Read-along by word (lib/read-along.ts `measuredTimeline`): the measured word starts of a clip, when its voice is in the
 * manifest's `times`. A voice's times.json is fetched once, when its first clip is asked for, and kept for the page (the
 * manifest's version in the address, so a new deploy is not read from the cache); a voice without one costs no request.
 * A known table answers at once (the starts, or null), a table still loading answers with a promise. */
export function clipWordTimes(url:string,value:VoiceManifest|null=manifest,fetcher:typeof fetch=fetch):readonly number[]|null|Promise<readonly number[]|null>{
 const found=clipAddress.exec(url);
 if(!found||!value||!value.times?.includes(found[1])||typeof fetcher!=='function')return null;
 const [,style,id]=found;
 const table=timesTables.get(style);
 if(table)return table[id]??null;
 let pending=timesLoading.get(style);
 if(!pending){
  pending=fetcher(`/voices/${style}/times.json?v=${value.version}`).then(response=>response.ok?response.json():null).then(parseWordTimes).catch(()=>({}))
   .then(parsed=>{timesTables.set(style,parsed);timesLoading.delete(style);return parsed;});
  timesLoading.set(style,pending);
 }
 return pending.then(parsed=>parsed[id]??null);
}

/** Clips that are on the page are loaded before the tap (the learner heard late voices, 30 October 2026): a few at a
 * time, each once, kept in memory; the player then plays the loaded copy instead of downloading first. */
const loadedClips=new Map<string,string>();const wantedClips=new Set<string>();const clipQueue:string[]=[];let clipsLoading=0;
export function warmClip(url:string){
 if(!url||wantedClips.has(url)||typeof fetch!=='function'||typeof URL==='undefined'||typeof URL.createObjectURL!=='function')return;
 wantedClips.add(url);clipQueue.push(url);pumpClips();
 void clipWordTimes(url); // the voice's word times come along with its first clip, before the tap
}
function pumpClips(){
 while(clipsLoading<3&&clipQueue.length){
  const url=clipQueue.shift() as string;clipsLoading++;
  void fetch(url).then(response=>response.ok?response.blob():null).then(blob=>{
   if(!blob||!blob.size)return;
   if(loadedClips.size>=200){const oldest=loadedClips.keys().next().value as string;const copy=loadedClips.get(oldest);loadedClips.delete(oldest);wantedClips.delete(oldest);if(copy)setTimeout(()=>URL.revokeObjectURL(copy),60000);}
   loadedClips.set(url,URL.createObjectURL(blob));
  }).catch(()=>{wantedClips.delete(url);}).finally(()=>{clipsLoading--;pumpClips();});
 }
}
/** The loaded copy of a clip, or the clip's own address. */
export function clipSource(url:string){return loadedClips.get(url)??url;}

/** `onProgress`: how far the clip is (0–1), a few times a second while it plays — the read-along by word (lib/read-along.ts). */
type ClipEvents={onStart:()=>void;onEnd:()=>void;onError:()=>void;onProgress?:(ratio:number)=>void};
/** `loading` says whether the current clip is still being downloaded (a slow connection), so the chosen voice is kept a little longer. */
export type ClipPlayer={unlock:()=>void;play:(url:string,rate:number,events:ClipEvents,speed?:number)=>void;stop:()=>void;loading?:()=>boolean};
// 50 ms of silence: playing it inside a tap lets the same element play the
// answer later, after the sound effect (needed on iPhone and iPad).
const SILENCE='data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACA'+'gICA'.repeat(133);
export function createClipPlayer(createAudio:()=>HTMLAudioElement=()=>new Audio()):ClipPlayer{
 let element:HTMLAudioElement|null=null;let token=0;
 const media=()=>{
  if(!element){element=createAudio();element.preload='auto';try{element.setAttribute('playsinline','');}catch{}}
  return element;
 };
 let ticker:ReturnType<typeof setInterval>|null=null;
 const stopTicking=()=>{if(ticker!==null){clearInterval(ticker);ticker=null;}};
 const detach=(audio:HTMLAudioElement)=>{stopTicking();audio.onplaying=null;audio.onended=null;audio.onerror=null;};
 return {
  unlock(){
   const audio=media();if(!audio.paused)return;
   try{detach(audio);audio.muted=true;audio.src=SILENCE;const started=audio.play();if(started)void started.then(()=>{if(audio.src===SILENCE){audio.pause();audio.muted=false;}},()=>{audio.muted=false;});}catch{audio.muted=false;}
  },
  play(url,rate,events,speed=1){
   const audio=media();const mine=++token;
   detach(audio);try{audio.pause();}catch{}
   audio.muted=false;audio.src=clipSource(url);
   const pitch=audio as HTMLAudioElement&{webkitPreservesPitch?:boolean;mozPreservesPitch?:boolean};
   try{pitch.preservesPitch=true;pitch.webkitPreservesPitch=true;pitch.mozPreservesPitch=true;}catch{}
   // speed: a listening player's 0.5×–2× on top of the reading rate.
   audio.playbackRate=clipPlaybackRate(rate)*(Number.isFinite(speed)?Math.max(0.5,Math.min(2,speed)):1);audio.defaultPlaybackRate=audio.playbackRate;
   audio.onplaying=()=>{
    if(mine!==token)return;events.onStart();
    // Read-along by word: how far the clip is, a few times a second, while it plays.
    const progress=events.onProgress;if(!progress)return;stopTicking();
    ticker=setInterval(()=>{if(mine!==token){stopTicking();return;}const {currentTime,duration}=audio;if(Number.isFinite(duration)&&duration>0)progress(currentTime/duration);},70);
    (ticker as unknown as {unref?:()=>void}).unref?.();
   };
   audio.onended=()=>{if(mine===token){detach(audio);events.onEnd();}};
   audio.onerror=()=>{if(mine===token){detach(audio);events.onError();}};
   try{const started=audio.play();if(started)void started.catch(()=>{if(mine===token){detach(audio);events.onError();}});}
   catch{if(mine===token){detach(audio);events.onError();}}
  },
  stop(){token++;if(element){detach(element);try{element.pause();}catch{}}},
  // Still downloading the clip (a slow connection), not yet able to play: the chosen voice gets a little more time.
  loading(){const audio=element;return !!audio&&!!audio.src&&audio.src!==SILENCE&&audio.networkState===2&&audio.readyState<3;},
 };
}
