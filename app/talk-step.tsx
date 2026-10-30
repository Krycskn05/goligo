'use client';
import {useEffect,useRef,useState} from 'react';
import {Eye,EyeOff,Mic,RotateCcw,Send,Square} from 'lucide-react';
import type {TalkScenario} from '@/lib/talk-scenarios';
import type {TalkReply,TalkTurn} from '@/lib/talk-prompt';
import {Heading,Portrait,Say,readRun,useRunSave,type StepProps} from './willkommen-ui';

/**
 * "Konuş" (the learner asked, 30 October 2026: "I do the lessons but I can't speak"): a short role play with an AI
 * partner after each lesson part. The learner taps the microphone and speaks German (the browser's speech recognition;
 * typing works everywhere), the partner answers in easy German with their own site voice (lib/talk-scenarios.ts,
 * app/api/konus). A mistake gets the better sentence and a short Turkish note. The conversation stays in the browser.
 */
type Line=TalkTurn&{tr?:string;better?:string|null;correction?:string|null};
type Recognizer={lang:string;interimResults:boolean;continuous:boolean;maxAlternatives:number;start():void;stop():void;abort():void;
 onresult:((event:{resultIndex:number;results:ArrayLike<ArrayLike<{transcript:string}>&{isFinal:boolean}>})=>void)|null;onend:(()=>void)|null;onerror:((event:{error:string})=>void)|null};
function recognizer():Recognizer|null{
 if(typeof window==='undefined')return null;
 const Maker=(window as unknown as {SpeechRecognition?:new()=>Recognizer;webkitSpeechRecognition?:new()=>Recognizer}).SpeechRecognition??(window as unknown as {webkitSpeechRecognition?:new()=>Recognizer}).webkitSpeechRecognition;
 return Maker?new Maker():null;
}

export function TalkStep(props:StepProps&{scenario:TalkScenario}){
 const {scenario,speech,sound,step,runKey}=props;
 const opening:Line={role:'partner',text:scenario.opening.de,tr:scenario.opening.tr};
 const [saved]=useState(()=>readRun<{lines:Line[];done:boolean}>(runKey,step.id,value=>{
  const lines=Array.isArray(value.lines)?(value.lines as Line[]).filter(line=>line&&(line.role==='partner'||line.role==='learner')&&typeof line.text==='string').slice(-40):[];
  return lines.length>1?{lines,done:value.done===true}:null;
 }));
 const [lines,setLines]=useState<Line[]>(saved?.lines??[opening]);const [done,setDone]=useState(saved?.done??false);
 const [input,setInput]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState<{text:string;signIn?:boolean}|null>(null);
 const [listening,setListening]=useState(false);const [hideTr,setHideTr]=useState(false);
 const [canListen,setCanListen]=useState(false);
 useEffect(()=>{setCanListen(!!recognizer());},[]);
 useRunSave(runKey,step.id,lines.length>1?{lines,done}:null);
 const rec=useRef<Recognizer|null>(null);const end=useRef<HTMLDivElement>(null);
 useEffect(()=>()=>{rec.current?.abort();},[]);
 useEffect(()=>{end.current?.scrollIntoView({block:'nearest',behavior:'smooth'});},[lines.length,busy]);
 const send=async(text:string)=>{
  const said=text.trim();if(!said||busy||done)return;
  sound.prepare();speech.prepare();speech.stop();setError(null);setInput('');
  const next:Line[]=[...lines,{role:'learner',text:said}];setLines(next);setBusy(true);
  try{
   const response=await fetch('/api/konus',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({scenario:scenario.id,history:next.map(line=>({role:line.role,text:line.text}))})});
   const data=await response.json().catch(()=>({})) as {reply?:TalkReply;error?:string;signIn?:boolean};
   if(!response.ok||!data.reply){setError({text:data.error??'Şu anda cevap gelmedi. Biraz sonra yeniden dene.',signIn:data.signIn});setLines(lines);setInput(said);return;}
   const reply=data.reply;
   setLines([...next.slice(0,-1),{role:'learner',text:said,better:reply.better,correction:reply.correction},{role:'partner',text:reply.de,tr:reply.tr}]);
   if(reply.done)setDone(true);
   speech.speak({text:reply.de,who:scenario.who});
  }catch{setError({text:'İnternet bağlantısını kontrol et ve yeniden dene.'});setLines(lines);setInput(said);}
  finally{setBusy(false);}
 };
 const listen=()=>{
  if(listening){rec.current?.stop();return;}
  const r=recognizer();if(!r)return;speech.stop();setError(null);
  r.lang='de-DE';r.interimResults=true;r.continuous=false;r.maxAlternatives=1;let heard='';let final=false;
  r.onresult=event=>{let text='';for(let i=0;i<event.results.length;i++){text+=event.results[i][0].transcript;if(event.results[i].isFinal)final=true;}heard=text;setInput(text);};
  r.onerror=event=>{setListening(false);if(event.error==='not-allowed'||event.error==='service-not-allowed')setError({text:'Mikrofon izni gerekiyor. Tarayıcıda mikrofona izin ver ya da yaz.'});else if(event.error==='no-speech')setError({text:'Ses duyulmadı. Yeniden dene.'});};
  r.onend=()=>{setListening(false);rec.current=null;if(final&&heard.trim())void send(heard);};
  rec.current=r;setListening(true);
  try{r.start();}catch{setListening(false);}
 };
 const restart=()=>{rec.current?.abort();speech.stop();setLines([opening]);setDone(false);setInput('');setError(null);};
 const partner=scenario.name;
 return <>
  <p className="kicker" lang="de">Sprechen · {scenario.title}</p><Heading>Konuş: {scenario.title}</Heading>
  <p className="l1a-tr">{scenario.setting}</p>
  <div className="l1a-talk-try" lang="de">{scenario.tryPhrases.map(([de,tr])=><span className="l1a-talk-chip" key={de} title={tr}>{de}{!de.includes('…')&&<Say text={de} speech={speech}/>}</span>)}</div>
  <div className={'l1a-dialogue l1a-talk'+(hideTr?' l1a-talk-hide':'')} aria-live="polite">
   {lines.map((line,i)=>line.role==='partner'?<div className="l1a-line a" key={i}>
    <Portrait who={scenario.who} name={partner}/>
    <div className="l1a-bubble"><span className="l1a-de" lang="de" dir="ltr">{line.text}</span>{line.tr&&<span className="l1a-tr">{line.tr}</span>}</div>
    <Say text={line.text} who={scenario.who} speech={speech}/>
   </div>:<div className="l1a-line b l1a-talk-me" key={i}>
    <div className="l1a-bubble"><span className="l1a-de" lang="de" dir="ltr">{line.text}</span>
     {line.better&&<span className="l1a-talk-fix"><span lang="de" dir="ltr">✏️ {line.better}</span>{line.correction&&<small>{line.correction}</small>}</span>}
     {!line.better&&line.correction&&<span className="l1a-talk-fix"><small>{line.correction}</small></span>}
    </div>
    {line.better&&<Say text={line.better} speech={speech}/>}
   </div>)}
   {busy&&<div className="l1a-line a"><Portrait who={scenario.who} name={partner}/><div className="l1a-bubble l1a-talk-wait" aria-label="Yazıyor"><span/><span/><span/></div></div>}
   <div ref={end}/>
  </div>
  {error&&<p className="l1a-feedback bad" role="status">{error.text}{error.signIn&&<> <a href={'/giris?return_to='+encodeURIComponent(typeof window==='undefined'?'/':window.location.pathname+window.location.search)}>Giriş yap</a></>}</p>}
  {done?<p className="l1a-feedback ok" role="status">Konuşma bitti 🎉</p>:<form className="l1a-talk-box" onSubmit={event=>{event.preventDefault();void send(input);}}>
   {canListen&&<button type="button" className={'l1a-talk-mic'+(listening?' on':'')} aria-pressed={listening} aria-label={listening?'Dinlemeyi durdur':'Bas ve Almanca konuş'} disabled={busy} onClick={listen}>{listening?<Square size={22} aria-hidden="true"/>:<Mic size={24} aria-hidden="true"/>}</button>}
   <input className="l1a-gap wide l1a-talk-input" value={input} lang="de" dir="ltr" autoComplete="off" spellCheck={false} placeholder={listening?'Dinliyorum…':canListen?'Konuş ya da yaz…':'Almanca yaz…'} aria-label="Cevabın" maxLength={300} disabled={busy} onChange={event=>setInput(event.target.value)}/>
   <button type="submit" className="btn small l1a-talk-send" disabled={busy||!input.trim()} aria-label="Gönder"><Send size={18} aria-hidden="true"/></button>
  </form>}
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" aria-pressed={hideTr} onClick={()=>setHideTr(!hideTr)}>{hideTr?<Eye size={16} aria-hidden="true"/>:<EyeOff size={16} aria-hidden="true"/>}{hideTr?'Çeviriyi göster':'Çeviriyi gizle'}</button>
   {lines.length>1&&<button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button>}
  </div>
 </>;
}
