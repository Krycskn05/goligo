'use client';
import {useCallback,useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,Headphones} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {housingText} from '@/lib/housing-copy';
import {AUSBILDUNG_PATH,turkishNote} from '@/lib/ausbildung-course';
import {hoerenTasks,type HoerenTask} from '@/lib/ausbildung-hoeren';
import {useLanguageSwitch} from './language-switch';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {RasterArt} from './toon-art';
import {LessonBook} from './lesson-book';
import {hoerenPicture} from '@/lib/ausbildung-art';
import {LISTEN_CHANGED,ListenTask,listenPart,listenResult,tasksByNumber,useListenPlayer} from './ausbildung-listen';

/** Lektion 12 – Hören: the 14 listening sections; one section at a time (?bolum=1 … 14). */
export default function AusbildungHoeren(){
 const [language,setLanguage]=useState<StudyLanguage>('tr');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem('german-study-language');}catch{}if(saved&&isStudyLanguage(saved))switchLanguage(saved,()=>setLoaded(true));else setLoaded(true);},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title='Lektion 12 – Hören · '+SITE_NAME;try{localStorage.setItem('german-study-language',language);}catch{}},[language,loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <HoerenPage language={language} onLanguage={switchLanguage}/>;
}

/** The section in the address: ?bolum=4, or the older #bolum-4 links. */
function readNumber():number|null{
 const params=new URLSearchParams(window.location.search);const hash=/^#bolum-(\d+)$/.exec(window.location.hash);
 const value=Number(params.get('bolum')??hash?.[1]);return tasksByNumber.has(value)?value:null;
}
type Result={right:number;total:number}|null;

export function HoerenPage({language,onLanguage}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void}){
 const player=useListenPlayer();
 const [number,setNumber]=useState<number|null>(null);const [results,setResults]=useState<Record<string,Result>>({});
 const refresh=useCallback(()=>setResults(Object.fromEntries(hoerenTasks.map(task=>[task.id,listenResult(task)]))),[]);
 useEffect(()=>{
  const read=()=>setNumber(readNumber());
  read();refresh();window.addEventListener('popstate',read);window.addEventListener(LISTEN_CHANGED,refresh);
  return()=>{window.removeEventListener('popstate',read);window.removeEventListener(LISTEN_CHANGED,refresh);};
 },[refresh]);
 const {stop}=player;
 const open=useCallback((next:number|null)=>{
  stop();setNumber(next);
  try{const url=new URL(window.location.href);url.hash='';if(next)url.searchParams.set('bolum',String(next));else url.searchParams.delete('bolum');window.history.pushState(null,'',url);}catch{}
  requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('l12-heading')?.focus({preventScroll:true});});
 },[stop]);
 const task=number?tasksByNumber.get(number):undefined;
 const done=hoerenTasks.filter(item=>results[item.id]).length;
 return <div className="category-app toon-app housing-app l12-app" lang={language} dir={languageDirection(language)}>
  <a className="skip-link" href="#l12-main">{housingText(language,'back')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value)){stop();onLanguage(value);}}} homeHref="/konular?level=A1.2" homeLabel={housingText(language,'back')}/>
  <main id="l12-main" className="object-page housing-page l12-page" lang="tr" dir="ltr">
   <div className="object-breadcrumb"><a href="/konular?level=A1.2">A1.2</a><span aria-hidden="true">›</span><a href={AUSBILDUNG_PATH}>Lektion 12 · Ausbildung</a><span aria-hidden="true">›</span>{task?<><a href={AUSBILDUNG_PATH+'/hoeren'} onClick={event=>{event.preventDefault();open(null);}}>Hören</a><span aria-hidden="true">›</span><span>{task.number}</span></>:<span>Hören</span>}</div>
   {language!=='tr'&&turkishNote[language]&&<p className="object-alert l12-language-note" lang={language} dir={languageDirection(language)}>{turkishNote[language]}</p>}
   {player.warning&&<p className="object-alert" role="status">{player.warning}</p>}
   {/* An open notebook: the 14 sections as an index on the left page, the open section on the right. */}
   <LessonBook variant="wide" className={'lb-hoeren'+(task?' has-task':'')} left={<>
    <span className="eyebrow" lang="de">Lektion 12 · Ausbildung</span>
    {task?<p className="lb-title" lang="de">Hören</p>:<h1 id="l12-heading" tabIndex={-1} className="lb-title" lang="de">Hören</h1>}
    <p className="lb-lead">14 dinleme bölümü · {done} / {hoerenTasks.length} yapıldı</p>
    <ol className="lb-index" aria-label="Dinleme bölümleri">{hoerenTasks.map(item=>{const result=results[item.id];const perfect=!!result&&result.right===result.total;const current=item.number===task?.number;return <li key={item.id}><button type="button" className={'lb-index-item'+(current?' active':'')+(result?(perfect?' perfect':' partial'):'')} data-l12-hoeren-card={item.number} aria-current={current?'page':undefined} onClick={()=>open(item.number)}>
     <span className="lb-index-number" aria-hidden="true">{result&&perfect?<Check size={16}/>:item.number}</span>
     <span className="lb-index-text"><small lang="de">{listenPart(item.number)}</small><strong lang="de">{item.title}</strong>{result&&<em>{result.right} / {result.total} doğru</em>}</span>
    </button></li>;})}</ol>
    <nav className="lb-pager" aria-label="Lektion 12"><a className="text-button" href={AUSBILDUNG_PATH}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>Lektion 12'ye dön</a></nav>
   </>} right={task?<TaskView task={task} player={player} onOpen={open}/>:<div className="lb-start-page">
    <h2 className="lb-heading">Nasıl çalışırım?</h2>
    <ol className="lb-howto"><li>Önce metni görmeden iki kez dinle.</li><li>Soruları cevapla, sonra „Kontrol et"e bas.</li><li>En son metni aç ve dinlerken oku.</li><li>Kaçırdığın cümleye geri düğmesiyle dön; hızı 0,5x ile 2x arasında seç.</li></ol>
    <figure className="lb-photo"><RasterArt art={hoerenPicture} title="Hören"/></figure>
    <div className="lb-start"><button type="button" className="btn l12-resume" onClick={()=>open((hoerenTasks.find(item=>!results[item.id])??hoerenTasks[0]).number)}><Headphones size={20} aria-hidden="true"/>{done?'Sıradaki bölümü dinle':'İlk bölümle başla'}</button><small>{done} / {hoerenTasks.length} bölüm yapıldı</small></div>
   </div>}/>
  </main>
  <SiteFooter/>
 </div>;
}

function TaskView({task,player,onOpen}:{task:HoerenTask;player:ReturnType<typeof useListenPlayer>;onOpen:(number:number|null)=>void}){
 const index=hoerenTasks.findIndex(item=>item.id===task.id);const previous=hoerenTasks[index-1];const next=hoerenTasks[index+1];
 return <section className="l12-part l12-task-page" aria-labelledby="l12-heading">
  <div className="l12-task-top"><button type="button" className="text-button vault-back-categories" onClick={()=>onOpen(null)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>Tüm bölümler</button></div>
  <h1 id="l12-heading" tabIndex={-1} className="l12-sr">Hören {task.number}</h1>
  <ListenTask key={task.id} task={task} player={player} onNext={next?()=>onOpen(next.number):undefined} nextLabel={next?'Sonraki bölüm ('+next.number+')':undefined}/>
  <nav className="l12-pager" aria-label="Dinleme bölümleri">{previous?<button type="button" className="btn secondary" onClick={()=>onOpen(previous.number)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>Bölüm {previous.number}</button>:<span/>}{next?<button type="button" className="btn" onClick={()=>onOpen(next.number)}>Bölüm {next.number}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>:<a className="btn" href={AUSBILDUNG_PATH}>Lektion 12<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></a>}</nav>
  <p className="housing-tip">Ses çıkmıyorsa telefonun sessiz modda olmadığına bak ve „Dinle"ye bir daha bas. Almanca ses hiç yoksa metni açıp kendin sesli oku; bu da iyi bir alıştırmadır.</p>
 </section>;
}
