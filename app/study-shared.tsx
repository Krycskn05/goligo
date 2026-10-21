'use client';
import {useState,useEffect,useRef,useCallback} from 'react';
import {Mic,Square} from 'lucide-react';
import {t,type StudyLanguage} from '@/lib/study-languages';
import type {Snapshot} from '@/lib/study';
import {createGermanSpeechPlayer,studyVoices,idlePlayback,defaultSpeechRate,type SpeechPlayback} from '@/lib/german-speech';
import {availableSiteVoices,createClipPlayer,loadVoiceManifest,onVoiceManifest,savedVoiceName,siteClipUrls,VOICE_PREFERENCE_VERSION,type SiteVoice,type VoiceManifest} from '@/lib/site-voices';
import {createAnswerFeedbackPlayer} from '@/lib/answer-feedback';
import type {LearningLanguage} from '@/lib/learning-language';
import {prepareEffects,readEffects,playLearningSound,learningReaction} from '@/lib/learning-effects';
/** Shared cartoon feedback, with an optional callback after the effect ends. */
export function useAnswerSound(){
 const cancel=useRef<(()=>void)|null>(null);const generation=useRef(0);
 const prepare=useCallback(()=>{prepareEffects();},[]);
 const stop=useCallback(()=>{generation.current++;cancel.current?.();cancel.current=null;},[]);
 const play=useCallback((kind:'correct'|'wrong'|'complete',after?:()=>void)=>{
  stop();const token=++generation.current;learningReaction(kind);
  const chosen=readEffects();
  // "Harika!": the chosen correct sound and Paul Hoca drumming on the desk play together; the right answer is read
  // only after both have ended (no sound under the voice).
  const sounds=kind==='correct'?[chosen.correct,'paulDrum' as const]:[kind==='wrong'?chosen.wrong:chosen.complete];
  let left=sounds.length;const done=()=>{if(--left>0||generation.current!==token)return;cancel.current=null;after?.();};
  const stops=sounds.map(id=>playLearningSound(id,done));cancel.current=()=>stops.forEach(item=>item());
 },[stop]);
 const wrong=useCallback((after?:()=>void)=>play('wrong',after),[play]);
 const correct=useCallback((after?:()=>void)=>play('correct',after),[play]);
 const complete=useCallback(()=>play('complete'),[play]);
 useEffect(()=>stop,[stop]);
 return {prepare,wrong,correct,complete,stop};
}
export function useAnswerFeedback(speech:ReturnType<typeof useGermanSpeech>){
 const sound=useAnswerSound();const [cueBusy,setCueBusy]=useState(false);
 const latest=useRef({sound,speech});latest.current={sound,speech};
 const mounted=useRef(false);const player=useRef<ReturnType<typeof createAnswerFeedbackPlayer>|null>(null);
 if(!player.current)player.current=createAnswerFeedbackPlayer({
  prepare:()=>latest.current.sound.prepare(),correct:after=>latest.current.sound.correct(after),
  wrong:after=>latest.current.sound.wrong(after),complete:()=>latest.current.sound.complete(),stop:()=>latest.current.sound.stop(),
 },{prepare:()=>{if(!document.hidden)latest.current.speech.prepare();},speak:text=>{if(!document.hidden)latest.current.speech.speak(text);},stop:()=>latest.current.speech.stop()},waiting=>{if(mounted.current)setCueBusy(waiting);});
 useEffect(()=>{
  mounted.current=true;const visibility=()=>{if(document.hidden)player.current?.stop();};
  document.addEventListener('visibilitychange',visibility);
  return()=>{mounted.current=false;document.removeEventListener('visibilitychange',visibility);player.current?.stop();};
 },[]);
 return {answer:player.current.answer,stop:player.current.stop,complete:player.current.complete,
  busy:cueBusy,isWaiting:player.current.isWaiting};
}
export async function api<T=Snapshot>(body?:Record<string,unknown>,query='',course:LearningLanguage='de'):Promise<T>{
 const params=new URLSearchParams(query);params.set('learn',course);
 const res=await fetch('/api/study?'+params,{method:body?'POST':'GET',cache:'no-store',keepalive:body?.action==='answer',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify({...body,course}):undefined});
 let data:T&{error?:string;signIn?:boolean};try{data=await res.json() as T&{error?:string;signIn?:boolean};}catch{throw new Error('Bağlantı kurulamadı. Biraz sonra yeniden dene.');}
 if(!res.ok){const e=new Error(data.error??'Kayıt başarısız. Yeniden dene.') as Error&{signIn?:boolean};e.signIn=!!data.signIn;throw e;}return data;
}
export const SPEECH_CHANGED='lernkoko-speech-changed';
function readSpeechPreference(course:LearningLanguage){
 let voiceName='',rate=String(defaultSpeechRate(course));
 try{const saved=JSON.parse(localStorage.getItem('lernkoko-speech:'+course)??'null');voiceName=savedVoiceName(saved,course);const savedRate=Number(saved?.rate);if(Number.isFinite(savedRate)&&savedRate>=0.5&&savedRate<=1.2)rate=String(savedRate);}catch{}
 return {voiceName,rate};
}
function saveSpeechPreference(course:LearningLanguage,value:{voiceName:string;rate:string}){
 try{localStorage.setItem('lernkoko-speech:'+course,JSON.stringify({...value,voices:VOICE_PREFERENCE_VERSION}));}catch{}
 window.dispatchEvent(new CustomEvent(SPEECH_CHANGED,{detail:course}));
}
export function useGermanSpeech(course:LearningLanguage='de'){
 const [playback,setPlayback]=useState<SpeechPlayback>(idlePlayback);const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);const [voiceName,setVoiceName]=useState('');const [rate,setRate]=useState(String(defaultSpeechRate(course)));const player=useRef<ReturnType<typeof createGermanSpeechPlayer>|null>(null);
 const [siteVoices,setSiteVoices]=useState<SiteVoice[]>([]);
 const [siteVoicesState,setSiteVoicesState]=useState<'loading'|'ready'|'unavailable'>('loading');
 const preferenceCourse=useRef<LearningLanguage|null>(null);
 useEffect(()=>{
  const load=()=>{const next=readSpeechPreference(course);setVoiceName(next.voiceName);setRate(next.rate);preferenceCourse.current=course;};
  load();
  const changed=(event:Event)=>{if((event as CustomEvent<LearningLanguage>).detail===course)load();};
  const storage=(event:StorageEvent)=>{if(event.key==='lernkoko-speech:'+course)load();};
  window.addEventListener(SPEECH_CHANGED,changed);window.addEventListener('storage',storage);
  return()=>{window.removeEventListener(SPEECH_CHANGED,changed);window.removeEventListener('storage',storage);};
 },[course]);
 // Natural site voices are pre-rendered clips; without them the device voice is used.
 useEffect(()=>{
  if(course!=='de'){setSiteVoices([]);setSiteVoicesState('unavailable');return;}
  let alive=true;
  const apply=(value:VoiceManifest|null)=>{if(!alive)return;const list=availableSiteVoices(value);setSiteVoices(list);setSiteVoicesState(list.length?'ready':'unavailable');};
  const off=onVoiceManifest(apply);void loadVoiceManifest().then(apply);
  return()=>{alive=false;off();};
 },[course]);
 const changeVoice=useCallback((value:string)=>{player.current?.stop();setVoiceName(value);saveSpeechPreference(course,{voiceName:value,rate});},[course,rate]);
 const changeRate=useCallback((value:string)=>{const number=Number(value);if(!Number.isFinite(number)||number<0.5||number>1.2)return;player.current?.stop();setRate(value);saveSpeechPreference(course,{voiceName,rate:value});},[course,voiceName]);
 useEffect(()=>{
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){setPlayback({...idlePlayback,warning:'Bu tarayıcı sesli okumayı desteklemiyor. Safari, Chrome veya Edge ile açabilirsin.'});return;}
  const synth=window.speechSynthesis;let mounted=true;
  const clips=course==='de'&&typeof window.Audio==='function'?{player:createClipPlayer(),resolve:(text:string,name:string)=>siteClipUrls(name,text)}:undefined;
  const controller=createGermanSpeechPlayer(synth,text=>new SpeechSynthesisUtterance(text),next=>{if(mounted)setPlayback(next);},course,{cancelDelayMs:100},clips);player.current=controller;
  const update=()=>setVoices(studyVoices(synth.getVoices(),course));const visibility=()=>{if(document.hidden){controller.stop();controller.resetPreparation();}};
  update();synth.addEventListener('voiceschanged',update);document.addEventListener('visibilitychange',visibility);
  return()=>{mounted=false;synth.removeEventListener('voiceschanged',update);document.removeEventListener('visibilitychange',visibility);controller.stop();player.current=null;};
 },[course]);
 const stop=useCallback(()=>player.current?.stop(),[]);
 const prepare=useCallback(()=>player.current?.prepare(),[]);
 const isActive=useCallback(()=>player.current?.isActive()??false,[]);
 const speak=useCallback((text:string,slow=false,voiceOverride?:string,speed?:number)=>{if(!player.current){setPlayback({...idlePlayback,warning:'Ses desteği bulunamadı. Güncel Safari veya Chrome ile aç.'});return;}player.current.speak(text,{voiceName:voiceOverride??(preferenceCourse.current===course?voiceName:''),rate:slow?0.65:preferenceCourse.current===course?Number(rate):defaultSpeechRate(course),speed});},[voiceName,rate,course]);
 return {speaking:playback.status==='speaking',loading:playback.status==='loading',busy:playback.status!=='idle',activeText:playback.text,warning:playback.warning,voices,siteVoices,siteVoicesState,voiceName,setVoiceName:changeVoice,rate,setRate:changeRate,prepare,speak,stop,isActive};
}export function Recorder({language="tr"}:{language?:StudyLanguage}){
 const [recording,setRecording]=useState(false);const [starting,setStarting]=useState(false);const [url,setUrl]=useState('');const [error,setError]=useState('');
 const recorder=useRef<MediaRecorder|null>(null);const stream=useRef<MediaStream|null>(null);const blobUrl=useRef('');const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const mounted=useRef(true);const requesting=useRef(false);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);if(timer.current)clearTimeout(timer.current);};},[]);
 async function start(){
  if(requesting.current||recording)return;requesting.current=true;setStarting(true);setError('');
  try{
   if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error('Bu tarayıcı ses kaydını desteklemiyor.');
   const audio=await navigator.mediaDevices.getUserMedia({audio:true});if(!mounted.current){audio.getTracks().forEach(t=>t.stop());return;}stream.current=audio;
   const rec=new MediaRecorder(audio);recorder.current=rec;const chunks:BlobPart[]=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
   rec.onstop=()=>{audio.getTracks().forEach(t=>t.stop());if(timer.current)clearTimeout(timer.current);if(!mounted.current)return;if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);const next=URL.createObjectURL(new Blob(chunks,{type:rec.mimeType}));blobUrl.current=next;setUrl(next);setRecording(false);};
   rec.start();setRecording(true);timer.current=setTimeout(()=>{if(rec.state==='recording')rec.stop();},120000);
  }catch(e){stream.current?.getTracks().forEach(t=>t.stop());if(mounted.current)setError(language==='tr'?(e instanceof Error?e.message:'Mikrofon iznini kontrol et.'):t(language,'error'));}
  finally{requesting.current=false;if(mounted.current)setStarting(false);}
 }
 return <div className="stack mt-4"><div className="row"><button className="btn secondary small" disabled={starting} onClick={()=>recording?recorder.current?.stop():void start()}>{recording?<><Square size={16}/>{t(language,'finishRecord')}</>:<><Mic size={16}/>{t(language,'record')}</>}</button><small className="muted">{t(language,'recordNote')}</small></div>{url&&<audio aria-label={t(language,'record')} controls src={url} style={{width:'100%'}}/>}{error&&<p role="alert" className="audio-warning">{error}</p>}</div>;
}
