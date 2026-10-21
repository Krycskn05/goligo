'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {germanMoment,PART_NOUN,WEEKDAYS,MONTHS,isoWeek,type Phrase} from '@/lib/german-time';
import {greetingText,type GreetingCopyKey} from '@/lib/greeting-copy';
import type {VaultLanguage} from '@/lib/object-vault-copy';
import {languageDirection} from '@/lib/site-languages';
import {usePaulMotion} from './paul-hoca';

/** One short German line about now: the part of the day, weekday, date and KW (the time is the clock and the words). */
function facts(date:Date){
 const part=PART_NOUN[germanMoment(date).part];
 return `${part} · ${WEEKDAYS[date.getDay()]}, ${date.getDate()}. ${MONTHS[date.getMonth()]} · KW ${isoWeek(date)}`;
}

/** A small analog clock for the learner's own time (the learner asked for it instead of digits): turquoise rim, mango
 * hour marks, navy hands and, with motion on, a ticking second hand. */
export function AnalogClock({date,seconds=true,className=''}:{date:Date;seconds?:boolean;className?:string}){
 const h=date.getHours()%12,m=date.getMinutes(),sec=date.getSeconds();
 const hourAngle=(h+m/60)*30,minuteAngle=(m+sec/60)*6,secondAngle=sec*6;
 const hand=(angle:number,length:number,width:number,color:string,key:string)=><line key={key} className={'clock-'+key} x1="50" y1="50" x2="50" y2={50-length} stroke={color} strokeWidth={width} strokeLinecap="round" transform={`rotate(${angle} 50 50)`}/>;
 return <svg className={('analog-clock '+className).trim()} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
  <circle cx="50" cy="50" r="46" fill="#fff" stroke="#0d9fad" strokeWidth="7"/>
  {Array.from({length:12},(_,i)=><line key={i} x1="50" y1="11" x2="50" y2={i%3===0?20:16} stroke={i%3===0?'#f6bd47':'#9fd8de'} strokeWidth={i%3===0?5:3} strokeLinecap="round" transform={`rotate(${i*30} 50 50)`}/>)}
  {hand(hourAngle,22,7,'#1f3b5c','hour')}
  {hand(minuteAngle,32,5,'#1f3b5c','minute')}
  {seconds&&hand(secondAngle,34,2.2,'#e8742c','second')}
  <circle cx="50" cy="50" r="5" fill="#f6bd47" stroke="#1f3b5c" strokeWidth="2"/>
 </svg>;
}

/**
 * The header's speech bubble (the learner asked): an analog clock, a German greeting for the learner's own clock
 * (Guten Morgen, Guten Tag, Mahlzeit, Guten Nachmittag, Guten Abend, Hallo du Nachteule), the time in words, always up
 * to date (Es ist zwanzig nach vier.), one line with the part of the day, day, date and calendar week (no digital
 * time), and one more German sentence about now. Every line says it another correct way on each page load and
 * every minute. A tap
 * opens a window with all the ways to say it (greeting, time of day, day and date, week, time — official and
 * everyday), with short notes in the site language. Before the page knows the clock it says "Hallo!".
 */
export function SiteGreeting({language,line}:{language:VaultLanguage;line:string}){
 const motion=usePaulMotion();
 const [now,setNow]=useState<Date|null>(null);
 // A different start on every page load, so the bubble says it another way each time (the learner asked).
 const [seed]=useState(()=>Math.floor(Math.random()*997));
 const [open,setOpen]=useState(false);
 const button=useRef<HTMLButtonElement>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 // Every second with motion on (the clock's second hand), every 15 s without.
 useEffect(()=>{const tick=()=>setNow(new Date());tick();const timer=setInterval(tick,motion?1000:15000);return()=>clearInterval(timer);},[motion]);
 useEffect(()=>{
  if(!open)return;
  closeButton.current?.focus();
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};
  document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('keydown',key);button.current?.focus();};
 },[open]);
 const t=(key:GreetingCopyKey)=>greetingText(language,key);
 if(!now)return <p className="site-greeting"><b lang="de" dir="ltr">Hallo!</b><span lang={language}>{line}</span></p>;
 const moment=germanMoment(now);
 // Each line picks one of its correct alternatives: another one on every page load and every minute (the learner
 // asked) — the greeting (not the goodbye "Gute Nacht!"), the time in words (no digits: the clock shows them) and one
 // more sentence about the part of the day, the day, the date or the week.
 const minute=Math.floor(now.getTime()/60000);
 const pick=<T,>(list:readonly T[],salt:number)=>list[(seed*salt+minute)%list.length];
 const greeting=pick(moment.greetings.filter(item=>!item.note||item.note==='everyday'||item.note==='north'||item.note==='lunch'),1);
 const spoken=pick(moment.time.filter(item=>!/\d/.test(item.de)),7);
 const sayings:Phrase[]=[...moment.partPhrases,...moment.day,...moment.week];
 const saying=pick(sayings,13);
 const groups:[GreetingCopyKey,Phrase[]][]=[['greeting',moment.greetings],['partOfDay',moment.partPhrases],['day',moment.day],['week',moment.week],['time',moment.time]];
 return <>
  <button ref={button} type="button" className="site-greeting site-greeting-button" aria-haspopup="dialog" aria-expanded={open} title={t('open')} onClick={()=>setOpen(true)} data-site-greeting={moment.part}>
   <AnalogClock date={now} seconds={motion}/>
   <span className="site-greeting-words">
    <b lang="de" dir="ltr">{greeting.de}</b>
    <span className="site-greeting-time" lang="de" dir="ltr">{spoken.de}</span>
    <span className="site-greeting-facts" lang="de" dir="ltr">{facts(now)}</span>
    <span key={saying.de} className="site-greeting-say" lang="de" dir="ltr" aria-hidden="true">{saying.de}</span>
   </span>
  </button>
  {open&&createPortal(<div className="sg-backdrop" onPointerDown={event=>{if(event.target===event.currentTarget)setOpen(false);}}>
   <section className="sg-panel" role="dialog" aria-modal="true" aria-labelledby="sg-title" lang={language} dir={languageDirection(language)}>
    <button ref={closeButton} type="button" className="sg-close" aria-label={t('close')} onClick={()=>setOpen(false)}><X size={18} aria-hidden="true"/></button>
    <h2 id="sg-title">{t('panelTitle')}</h2>
    <p className="sg-now" lang="de" dir="ltr">{facts(now)}</p>
    {groups.map(([key,phrases])=><div key={key} className={'sg-group sg-'+key} data-greeting-group={key}>
     <h3>{t(key)}</h3>
     {key==='time'&&<AnalogClock date={now} seconds={motion} className="sg-clock"/>}
     <ul>{phrases.map(item=><li key={item.de}><span lang="de" dir="ltr">{item.de}</span>{item.note&&<small>{t(item.note)}</small>}</li>)}</ul>
     {key==='week'&&<p className="sg-hint">{t('kw')}</p>}
    </div>)}
    <p className="sg-line">{line}</p>
   </section>
  </div>,document.body)}
 </>;
}
