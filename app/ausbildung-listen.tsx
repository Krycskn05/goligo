'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {Check,CheckCircle2,Eye,EyeOff,Headphones,Play,RotateCcw,Square,X} from 'lucide-react';
import {lessonParts,normalizeAnswer} from '@/lib/ausbildung-course';
import {hoerenTasks,questionSpeech,speakerVoice,type HoerenQuestion,type HoerenTask} from '@/lib/ausbildung-hoeren';
import {speakerPicture} from '@/lib/ausbildung-art';
import {useAnswerSound,useGermanSpeech} from './study-shared';

type Item={text:string;voice?:string};
type Line={who:string;text:string};
/**
 * Plays listening texts line by line. Each speaker keeps one site voice (women and men differ);
 * without the site's natural voices the device's German voice reads.
 */
export function useListenPlayer(){
 const speech=useGermanSpeech('de');
 const [slow,setSlow]=useState(false);const [playing,setPlaying]=useState<string|null>(null);
 const queue=useRef<{key:string;items:Item[];index:number}|null>(null);const started=useRef(false);
 const latest=useRef({speech,slow});latest.current={speech,slow};
 const speakNext=useCallback(()=>{const current=queue.current;if(!current)return;if(current.index>=current.items.length){queue.current=null;setPlaying(null);return;}const item=current.items[current.index++];started.current=false;latest.current.speech.speak(item.text,latest.current.slow,item.voice);},[]);
 useEffect(()=>{if(speech.busy){started.current=true;return;}if(started.current&&queue.current){started.current=false;speakNext();}},[speech.busy,speakNext]);
 useEffect(()=>()=>{queue.current=null;},[]);
 const voiceFor=useCallback((who:string,speakers:string[])=>{
  const kind=speakerVoice(who);if(kind==='n')return undefined;
  const pool=latest.current.speech.siteVoices.filter(voice=>voice.gender===(kind==='f'?'female':'male'));if(!pool.length)return undefined;
  const same=speakers.filter(name=>speakerVoice(name)===kind);return pool[Math.max(0,same.indexOf(who))%pool.length].id;
 },[]);
 const play=useCallback((key:string,lines:Line[])=>{
  latest.current.speech.stop();const speakers=[...new Set(lines.map(line=>line.who))];
  queue.current={key,items:lines.map(line=>({text:line.text,voice:voiceFor(line.who,speakers)})),index:0};setPlaying(key);speakNext();
 },[speakNext,voiceFor]);
 const stop=useCallback(()=>{queue.current=null;started.current=false;setPlaying(null);latest.current.speech.stop();},[]);
 return {play,stop,playing,busy:speech.busy,slow,setSlow,warning:speech.warning};
}
export type ListenPlayer=ReturnType<typeof useListenPlayer>;

export function SpeedToggle({player}:{player:ListenPlayer}){
 return <div className="l12-speed" role="group" aria-label="Okuma hızı"><span>Okuma hızı</span><button type="button" aria-pressed={!player.slow} className={!player.slow?'active':''} onClick={()=>player.setSlow(false)}>Normal</button><button type="button" aria-pressed={player.slow} className={player.slow?'active':''} onClick={()=>player.setSlow(true)}>Yavaş</button></div>;
}

type Answers=Record<number,string>;
type Saved={a?:Answers;c?:boolean};
const storage=(id:string)=>'lernkoko-l12-hoeren:'+id;
function isRight(q:HoerenQuestion,given:string|undefined){
 if(given===undefined||given==='')return false;
 if(q.type==='rf'||q.type==='select')return given===q.answer;
 if(q.type==='mc')return given===String(q.answer);
 return normalizeAnswer(given)===normalizeAnswer(q.answer);
}
const answerText=(q:HoerenQuestion)=>q.type==='mc'?q.options[q.answer]:q.answer;
/** Question text without its own leading number (the card numbers the questions). */
const plain=(text:string)=>text.replace(/^\d+\.\s+/,'');
/** The saved result of a listening task in this browser: null when it was never checked. */
export function listenResult(task:HoerenTask):{right:number;total:number}|null{
 try{const saved=JSON.parse(localStorage.getItem(storage(task.id))??'null') as Saved|null;if(!saved?.c)return null;const answers=saved.a??{};return {right:task.questions.filter((q,i)=>isRight(q,answers[i])).length,total:task.questions.length};}catch{return null;}
}
export const LISTEN_CHANGED='lernkoko-l12-listen';

/** One listening task as a practice card: listen, answer, check, then read the text. */
/** A speaker's round picture; speakers without one show their first letter. */
export function SpeakerFace({who}:{who:string}){
 const src=speakerPicture(who);
 return <span className={'l12-face'+(src?'':' letter')} aria-hidden="true">{src?<img src={src} alt="" width={320} height={320} loading="lazy" decoding="async"/>:(who.replace(/^Herr /,'')[0]??'?')}</span>;
}

export function ListenTask({task,player,onNext,nextLabel}:{task:HoerenTask;player:ListenPlayer;onNext?:()=>void;nextLabel?:string}){
 const [answers,setAnswers]=useState<Answers>({});const [checked,setChecked]=useState(false);const [transcript,setTranscript]=useState(false);const [loadedFor,setLoadedFor]=useState<string|null>(null);
 useEffect(()=>{let saved:Saved|null=null;try{saved=JSON.parse(localStorage.getItem(storage(task.id))??'null') as Saved|null;}catch{}setAnswers(saved?.a??{});setChecked(!!saved?.c);setTranscript(false);setLoadedFor(task.id);},[task.id]);
 useEffect(()=>{if(loadedFor!==task.id)return;try{localStorage.setItem(storage(task.id),JSON.stringify({a:answers,c:checked}));}catch{}window.dispatchEvent(new Event(LISTEN_CHANGED));},[answers,checked,loadedFor,task.id]);
 const set=(i:number,value:string)=>{setAnswers(previous=>({...previous,[i]:value}));if(checked)setChecked(false);};
 const right=task.questions.filter((q,i)=>isRight(q,answers[i])).length;const total=task.questions.length;const perfect=right===total;
 const sound=useAnswerSound();const key=task.id;const active=player.playing===key;
 const answered=Object.values(answers).some(value=>value!=='');
 return <article className="panel object-question l12-exercise l12-hoeren" id={'bolum-'+task.number} data-l12-hoeren={task.number} aria-labelledby={'l12-h-'+task.id}>
  <div className="l12-exercise-head"><span className="object-pill" lang="de"><Headphones size={14} aria-hidden="true"/>Hören {task.number} · {listenPart(task.number)}</span></div>
  <h2 id={'l12-h-'+task.id} className="l12-exercise-title" lang="de" tabIndex={-1}>{task.title}</h2>
  <p className="housing-cue l12-hint">{task.hint}</p>
  {task.lines&&<div className="vault-listen-player l12-player">
   <span className="l12-player-icon" aria-hidden="true"><Headphones size={26}/></span>
   <div className="l12-player-text"><strong>{active?'Dinliyorsun…':'Önce metni görmeden dinle'}</strong><span className="l12-faces" lang="de">{[...new Set(task.lines.map(line=>line.who))].map(who=><span key={who} className="l12-face-chip"><SpeakerFace who={who}/>{who}</span>)}</span></div>
   {active?<button type="button" className="btn secondary" onClick={player.stop}><Square size={16} aria-hidden="true"/>Durdur</button>:<button type="button" className="btn" disabled={player.busy&&!!player.playing} onClick={()=>player.play(key,task.lines!)}><Play size={18} aria-hidden="true"/>Dinle</button>}
  </div>}
  <ol className="l12-items">{task.questions.map((q,i)=>{const given=answers[i]??'';const ok=checked&&isRight(q,given);const bad=checked&&!ok;const say=questionSpeech(q);const sayKey=key+':'+i;
   return <li key={i} className={'l12-item'+(ok?' ok':bad?' bad':'')}>
    <span className="l12-item-number" aria-hidden="true">{ok?<Check size={15}/>:bad?<X size={15}/>:i+1}</span>
    <div className="l12-item-body">
     {say&&<div className="l12-item-listen">{player.playing===sayKey?<button type="button" className="btn secondary small" onClick={player.stop}><Square size={15} aria-hidden="true"/>Durdur</button>:<button type="button" className="btn secondary small" disabled={player.busy&&!!player.playing} onClick={()=>player.play(sayKey,[{who:'Sprecher',text:say}])}><Play size={16} aria-hidden="true"/>{q.type==='dict'||q.type==='mc'?(q.label??'Cümle '+(i+1)):'Dinle'}</button>}</div>}
     {q.type==='rf'&&<div className="l12-choice-row two"><p className="l12-prompt" lang="de">{plain(q.text)}</p><div className="l12-options" role="radiogroup" aria-label={q.text}>{['richtig','falsch'].map(option=><button type="button" key={option} role="radio" aria-checked={given===option} lang="de" className={'l12-option'+(given===option?' selected':'')+(checked&&option===q.answer?' right':'')+(checked&&given===option&&option!==q.answer?' wrong':'')} onClick={()=>set(i,option)}>{option}</button>)}</div></div>}
     {q.type==='mc'&&<div className="l12-choice-row"><p className="l12-prompt" lang="de">{plain(q.text)}</p><div className="l12-options l12-options-stack" role="radiogroup" aria-label={q.text}>{q.options.map((option,j)=><button type="button" key={option} role="radio" aria-checked={given===String(j)} className={'l12-option'+(given===String(j)?' selected':'')+(checked&&j===q.answer?' right':'')+(checked&&given===String(j)&&j!==q.answer?' wrong':'')} onClick={()=>set(i,String(j))} lang="de"><span className="object-option-number">{String.fromCharCode(97+j)}</span>{option}</button>)}</div></div>}
     {q.type==='select'&&<div className="l12-choice-row"><p className="l12-prompt" lang="de">{plain(q.text)}</p><div className="l12-options" role="radiogroup" aria-label={q.text}>{q.options.map(option=><button type="button" key={option} role="radio" aria-checked={given===option} lang="de" className={'l12-option'+(given===option?' selected':'')+(checked&&option===q.answer?' right':'')+(checked&&given===option&&option!==q.answer?' wrong':'')} onClick={()=>set(i,option)}>{option}</button>)}</div></div>}
     {(q.type==='text'||q.type==='dict')&&<>{q.type==='text'&&<p className="l12-prompt" lang="de">{plain(q.text)}</p>}<input type="text" className={'writing-input l12-line'+(ok?' ok':bad?' bad':'')} lang="de" dir="ltr" inputMode={q.numeric?'numeric':'text'} value={given} placeholder={q.placeholder??(q.type==='dict'?'Duyduğunu buraya yaz':'Cevabını yaz')} aria-label={q.type==='dict'?(q.label??'Cümle '+(i+1)):q.text} autoComplete="off" autoCapitalize="sentences" spellCheck={false} onChange={event=>set(i,event.target.value)}/></>}
     {bad&&<p className="l12-solution"><span>{given?'Doğrusu:':'Boş kaldı. Doğrusu:'}</span> <strong lang="de" dir="ltr">{answerText(q)}</strong></p>}
    </div>
   </li>;})}</ol>
  {checked?<div className={'object-feedback l12-feedback '+(perfect?'success':'retry')} role="status" aria-live="polite">
   <h2>{perfect?<CheckCircle2 size={23} aria-hidden="true"/>:<RotateCcw size={22} aria-hidden="true"/>} {perfect?'Harika, hepsi doğru!':`${right} / ${total} doğru`}</h2>
   <p>Şimdi metni aç ve dinlerken oku.</p>
   <div className="object-actions"><button type="button" className="btn secondary" aria-pressed={transcript} onClick={()=>setTranscript(value=>!value)}>{transcript?<EyeOff size={18} aria-hidden="true"/>:<Eye size={18} aria-hidden="true"/>}{transcript?'Metni gizle':'Metni göster'}</button>{onNext&&<button type="button" className="btn" onClick={onNext}>{nextLabel??'Devam'}</button>}</div>
  </div>:<div className="object-actions l12-actions">
   <button type="button" className="btn check-button" disabled={!answered} onClick={()=>{sound.prepare();if(perfect)sound.correct();else sound.wrong();setChecked(true);}}><Check size={18} aria-hidden="true"/>Kontrol et</button>
   <button type="button" className="btn secondary small" aria-pressed={transcript} onClick={()=>setTranscript(value=>!value)}>{transcript?<EyeOff size={17} aria-hidden="true"/>:<Eye size={17} aria-hidden="true"/>}{transcript?'Metni gizle':'Metni göster'}</button>
  </div>}
  {transcript&&<div className="l12-transcript" lang="de" dir="ltr">{task.lines?task.lines.map((line,i)=><div key={i} className={'l12-line'+(line.who===task.lines![0].who?'':' alt')}><SpeakerFace who={line.who}/><p className="l12-bubble"><b>{line.who}</b>{line.show??line.text}</p></div>):<ol>{task.questions.map((q,i)=><li key={i}>{q.type==='mc'?q.say:q.type==='dict'?q.answer+(q.say&&q.say!==q.answer?' – '+q.say:''):answerText(q)}</li>)}</ol>}</div>}
  {(answered||checked)&&<button type="button" className="text-button l12-reset" onClick={()=>{setAnswers({});setChecked(false);setTranscript(false);}}><RotateCcw size={15} aria-hidden="true"/>Bu bölümü sıfırla</button>}
 </article>;
}

export const tasksByNumber=new Map(hoerenTasks.map(task=>[task.number,task]));
/** The part of the lesson a listening section belongs to (Teil A … Prüfungstraining). */
export const listenPart=(number:number)=>lessonParts.find(part=>part.listen?.includes(number))?.de??'Lektion 12';
