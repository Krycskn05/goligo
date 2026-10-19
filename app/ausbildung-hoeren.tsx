'use client';
import {Fragment,useEffect,useRef,useState} from 'react';
import {ArrowLeft,Check,Eye,EyeOff,Play,RotateCcw,Square,Volume2} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {housingText} from '@/lib/housing-copy';
import {AUSBILDUNG_PATH,normalizeAnswer,turkishNote} from '@/lib/ausbildung-course';
import {hoerenTasks,questionSpeech,speakerVoice,type HoerenQuestion,type HoerenTask} from '@/lib/ausbildung-hoeren';
import {useLanguageSwitch} from './language-switch';
import {useAnswerSound,useGermanSpeech} from './study-shared';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';

/** Lektion 12 – Hören: the 14 listening sections as a page of the site. */
export default function AusbildungHoeren(){
 const [language,setLanguage]=useState<StudyLanguage>('tr');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem('german-study-language');}catch{}if(saved&&isStudyLanguage(saved))switchLanguage(saved,()=>setLoaded(true));else setLoaded(true);},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title='Lektion 12 – Hören · '+SITE_NAME;try{localStorage.setItem('german-study-language',language);}catch{}},[language,loaded]);
 useEffect(()=>{if(!loaded)return;const id=window.location.hash.slice(1);if(id)requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));},[loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <HoerenPage language={language} onLanguage={switchLanguage}/>;
}

type Item={text:string;voice?:string};
export function HoerenPage({language,onLanguage}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void}){
 const speech=useGermanSpeech('de');
 const [slow,setSlow]=useState(false);
 const [playing,setPlaying]=useState<string|null>(null);
 // Lines are read one after another; each speaker keeps one site voice (women and men differ).
 const queue=useRef<{key:string;items:Item[];index:number}|null>(null);const started=useRef(false);
 const speakNext=()=>{const current=queue.current;if(!current)return;if(current.index>=current.items.length){queue.current=null;setPlaying(null);return;}const item=current.items[current.index++];started.current=false;speech.speak(item.text,slow,item.voice);};
 useEffect(()=>{if(speech.busy){started.current=true;return;}if(started.current&&queue.current){started.current=false;speakNext();}
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[speech.busy]);
 useEffect(()=>()=>{queue.current=null;},[]);
 function voiceFor(who:string,speakers:string[]){
  const kind=speakerVoice(who);if(kind==='n')return undefined;
  const pool=speech.siteVoices.filter(voice=>voice.gender===(kind==='f'?'female':'male'));if(!pool.length)return undefined;
  const same=speakers.filter(name=>speakerVoice(name)===kind);return pool[Math.max(0,same.indexOf(who))%pool.length].id;
 }
 function play(key:string,lines:{who:string;text:string}[]){
  speech.stop();const speakers=[...new Set(lines.map(line=>line.who))];
  queue.current={key,items:lines.map(line=>({text:line.text,voice:voiceFor(line.who,speakers)})),index:0};setPlaying(key);speakNext();
 }
 function stop(){queue.current=null;started.current=false;setPlaying(null);speech.stop();}
 let lastPart='';
 return <div className="category-app toon-app l12-app" lang={language} dir={languageDirection(language)}>
  <a className="skip-link" href="#l12-main">{housingText(language,'back')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value)){stop();onLanguage(value);}}} homeHref="/?learn=de&level=A1.2" homeLabel={housingText(language,'back')}/>
  <main id="l12-main" className="object-page l12-page" lang="tr" dir="ltr">
   <div className="object-breadcrumb"><a href="/?learn=de&level=A1.2">A1.2</a><span aria-hidden="true">›</span><a href={AUSBILDUNG_PATH}>Lektion 12 · Ausbildung</a><span aria-hidden="true">›</span><span>Hören</span></div>
   {language!=='tr'&&turkishNote[language]&&<p className="l12-language-note" lang={language} dir={languageDirection(language)}>{turkishNote[language]}</p>}
   <a className="text-button verb-back" href={AUSBILDUNG_PATH}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>Lektion 12</a>
   <header className="panel l12-part-head l12-tone-hoeren"><span className="l12-badge" aria-hidden="true"><Volume2 size={22}/></span><div><span className="eyebrow" lang="de">Lektion 12 · Ausbildung</span><h1 id="l12-heading" tabIndex={-1} lang="de">Lektion 12 – Hören</h1><p>Kitaptaki gibi: önce metni görmeden iki kez dinle, soruları cevapla, „Kontrol et" de. En son „Metni göster" ile oku.</p>
    <div className="l12-speed" role="group" aria-label="Okuma hızı"><span>Okuma hızı</span><button type="button" aria-pressed={!slow} className={!slow?'active':''} onClick={()=>setSlow(false)}>Normal</button><button type="button" aria-pressed={slow} className={slow?'active':''} onClick={()=>setSlow(true)}>Yavaş</button></div>
   </div></header>
   {speech.warning&&<p className="object-alert" role="status">{speech.warning}</p>}
   <nav className="l12-jump" aria-label="Dinleme bölümleri">{hoerenTasks.map(task=><a key={task.id} href={'#bolum-'+task.number}>{task.number}</a>)}</nav>
   {hoerenTasks.map(task=>{const heading=task.part&&task.part!==lastPart?task.part:null;if(task.part)lastPart=task.part;return <Fragment key={task.id}>
    {heading&&<h2 className="l12-exercises-title">{heading}</h2>}
    <TaskCard task={task} playing={playing} busy={speech.busy} onPlay={play} onStop={stop}/>
   </Fragment>;})}
   <p className="l12-exercise-tip">Ses çıkmıyorsa telefonun sessiz modda olmadığına bak ve „Dinle"ye bir daha bas. Almanca ses hiç yoksa metni açıp kendin sesli oku; bu da iyi bir alıştırmadır.</p>
  </main>
  <SiteFooter/>
 </div>;
}

type Answers=Record<number,string>;
const storage=(id:string)=>'lernkoko-l12-hoeren:'+id;
function isRight(q:HoerenQuestion,given:string|undefined){
 if(given===undefined||given==='')return false;
 if(q.type==='rf'||q.type==='select')return given===q.answer;
 if(q.type==='mc')return given===String(q.answer);
 return normalizeAnswer(given)===normalizeAnswer(q.answer);
}
const answerText=(q:HoerenQuestion)=>q.type==='mc'?q.options[q.answer]:q.answer;

function TaskCard({task,playing,busy,onPlay,onStop}:{task:HoerenTask;playing:string|null;busy:boolean;onPlay:(key:string,lines:{who:string;text:string}[])=>void;onStop:()=>void}){
 const [answers,setAnswers]=useState<Answers>({});const [checked,setChecked]=useState(false);const [transcript,setTranscript]=useState(false);const [ready,setReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(storage(task.id))??'null') as {a?:Answers;c?:boolean}|null;if(saved){setAnswers(saved.a??{});setChecked(!!saved.c);}}catch{}setReady(true);},[task.id]);
 useEffect(()=>{if(!ready)return;try{localStorage.setItem(storage(task.id),JSON.stringify({a:answers,c:checked}));}catch{}},[answers,checked,ready,task.id]);
 const set=(i:number,value:string)=>{setAnswers(previous=>({...previous,[i]:value}));if(checked)setChecked(false);};
 const right=task.questions.filter((q,i)=>isRight(q,answers[i])).length;const sound=useAnswerSound();
 const key=task.id;const active=playing===key;
 return <article className="panel l12-exercise l12-hoeren" id={'bolum-'+task.number} data-l12-hoeren={task.number}>
  <header className="l12-exercise-head"><span className="l12-number">{task.number}</span><h3 lang="de">{task.title}</h3></header>
  <p className="l12-hint">{task.hint}</p>
  {task.lines&&<div className="l12-actions">{active?<button type="button" className="btn secondary" onClick={onStop}><Square size={16} aria-hidden="true"/>Dur</button>:<button type="button" className="btn" disabled={busy&&!!playing} onClick={()=>onPlay(key,task.lines!)}><Play size={18} aria-hidden="true"/>Dinle</button>}{active&&<span className="l12-playing" role="status">Okunuyor…</span>}</div>}
  <ol className="l12-items">{task.questions.map((q,i)=>{const given=answers[i]??'';const ok=checked&&isRight(q,given);const bad=checked&&!ok;const say=questionSpeech(q);const sayKey=key+':'+i;
   return <li key={i} className={'l12-item'+(ok?' ok':bad?' bad':'')}>
    {say&&<div className="l12-actions">{playing===sayKey?<button type="button" className="btn secondary small" onClick={onStop}><Square size={15} aria-hidden="true"/>Dur</button>:<button type="button" className="btn secondary small" disabled={busy&&!!playing} onClick={()=>onPlay(sayKey,[{who:'Sprecher',text:say}])}><Play size={16} aria-hidden="true"/>{q.type==='dict'||q.type==='mc'?(q.label??'Cümle '+(i+1)):'Dinle'}</button>}</div>}
    {q.type==='rf'&&<div className="l12-choice-row"><p className="l12-prompt" lang="de">{i+1}. {q.text}</p><div className="l12-options" role="radiogroup" aria-label={q.text}>{['richtig','falsch'].map(option=><button type="button" key={option} role="radio" aria-checked={given===option} className={'l12-option'+(given===option?' selected':'')+(checked&&option===q.answer?' right':'')+(checked&&given===option&&option!==q.answer?' wrong':'')} onClick={()=>set(i,option)}>{option}</button>)}</div></div>}
    {q.type==='mc'&&<div className="l12-choice-row"><p className="l12-prompt" lang="de">{i+1}. {q.text}</p><div className="l12-options l12-options-stack" role="radiogroup" aria-label={q.text}>{q.options.map((option,j)=><button type="button" key={option} role="radio" aria-checked={given===String(j)} className={'l12-option'+(given===String(j)?' selected':'')+(checked&&j===q.answer?' right':'')+(checked&&given===String(j)&&j!==q.answer?' wrong':'')} onClick={()=>set(i,String(j))} lang="de">{String.fromCharCode(97+j)}) {option}</button>)}</div></div>}
    {q.type==='select'&&<label className="l12-select-row"><span className="l12-prompt" lang="de">{q.text}</span><select value={given} onChange={event=>set(i,event.target.value)} lang="de"><option value="">– seç –</option>{q.options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>}
    {(q.type==='text'||q.type==='dict')&&<>{q.type==='text'&&<p className="l12-prompt" lang="de">{q.text}</p>}<input type="text" className={'l12-line'+(ok?' ok':bad?' bad':'')} lang="de" dir="ltr" inputMode={q.numeric?'numeric':'text'} value={given} placeholder={q.placeholder??(q.type==='dict'?'Duyduğunu buraya yaz':'Cevabını yaz')} aria-label={q.type==='dict'?(q.label??'Cümle '+(i+1)):q.text} autoComplete="off" autoCapitalize="sentences" spellCheck={false} onChange={event=>set(i,event.target.value)}/></>}
    {bad&&<p className="l12-solution"><span>{given?'Doğrusu:':'Boş bıraktın. Doğrusu:'}</span> <strong lang="de" dir="ltr">{answerText(q)}</strong></p>}
   </li>;})}</ol>
  <div className="l12-actions">
   <button type="button" className="btn" onClick={()=>{sound.prepare();if(right===task.questions.length)sound.correct();else sound.wrong();setChecked(true);}}><Check size={18} aria-hidden="true"/>Kontrol et</button>
   <button type="button" className="btn secondary" aria-pressed={transcript} onClick={()=>setTranscript(value=>!value)}>{transcript?<EyeOff size={18} aria-hidden="true"/>:<Eye size={18} aria-hidden="true"/>}{transcript?'Metni gizle':'Metni göster'}</button>
   <button type="button" className="text-button l12-reset" onClick={()=>{setAnswers({});setChecked(false);}}><RotateCcw size={16} aria-hidden="true"/>Baştan</button>
  </div>
  {checked&&<p className="l12-score" role="status">Sonuç: {right} / {task.questions.length}</p>}
  {transcript&&<div className="l12-transcript" lang="de" dir="ltr">{task.lines?task.lines.map((line,i)=><p key={i} className={'l12-bubble'+(line.who===task.lines![0].who?'':' alt')}><b>{line.who}</b>{line.show??line.text}</p>):<ol>{task.questions.map((q,i)=><li key={i}>{q.type==='mc'?q.say:q.type==='dict'?q.answer+(q.say&&q.say!==q.answer?' – '+q.say:''):answerText(q)}</li>)}</ol>}</div>}
 </article>;
}
