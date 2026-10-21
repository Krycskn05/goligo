'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {germanMoment,PART_NOUN,WEEKDAYS,MONTHS,isoWeek,type GreetingNote,type PartOfDay} from '@/lib/german-time';
import {greetingText,type GreetingCopyKey} from '@/lib/greeting-copy';
import type {VaultLanguage} from '@/lib/object-vault-copy';
import {languageDirection} from '@/lib/site-languages';
import {usePaulMotion} from './paul-hoca';
import {TopIcon,type TopIconName} from './top-icons';

/** A small coloured picture for the part of the day: the sun rising, high, with a cloud in the afternoon, setting, and
 * the moon at night. */
export function PartOfDayIcon({part}:{part:PartOfDay}){
 const sun=(cx:number,cy:number,r:number)=><g><circle cx={cx} cy={cy} r={r} fill="#f6bd47" stroke="#e8962c" strokeWidth="1.6"/>{Array.from({length:8},(_,i)=><line key={i} x1={cx} y1={cy-r-2.2} x2={cx} y2={cy-r-4.4} stroke="#e8962c" strokeWidth="1.8" strokeLinecap="round" transform={`rotate(${i*45} ${cx} ${cy})`}/>)}</g>;
 const horizon=(color:string)=><g><path d="M6 16a6 6 0 0 1 12 0z" fill={color} stroke="#e8742c" strokeWidth="1.6" strokeLinejoin="round"/>{[-60,-30,0,30,60].map(angle=><line key={angle} x1="12" y1="7.6" x2="12" y2="5.2" stroke="#e8742c" strokeWidth="1.8" strokeLinecap="round" transform={`rotate(${angle} 12 16)`}/>)}<line x1="3" y1="16.5" x2="21" y2="16.5" stroke="#d9822b" strokeWidth="1.8" strokeLinecap="round"/><line x1="7" y1="20" x2="17" y2="20" stroke="#e9b26a" strokeWidth="1.6" strokeLinecap="round"/></g>;
 return <svg className={'sg-part-icon part-'+part} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  {part==='morgen'&&horizon('#ffd36b')}
  {(part==='vormittag'||part==='mittag')&&sun(12,12,5)}
  {part==='nachmittag'&&<>{sun(9.5,9.5,4.2)}<path d="M9 19.5h9.2a3.3 3.3 0 0 0 .2-6.6 4.4 4.4 0 0 0-8.3 1.3A2.7 2.7 0 0 0 9 19.5z" fill="#fff" stroke="#8fb3d9" strokeWidth="1.6" strokeLinejoin="round"/></>}
  {part==='abend'&&horizon('#ff9f5a')}
  {part==='nacht'&&<><path d="M15.5 3.8a8.3 8.3 0 1 0 4.9 13.9A7 7 0 0 1 15.5 3.8z" fill="#ffe08a" stroke="#d9a520" strokeWidth="1.6" strokeLinejoin="round"/><path d="M18.6 4.2l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="#8fb3d9"/></>}
 </svg>;
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

/** The learner's top-menu icons for the groups of the window (the part of the day has its own small picture). */
const GROUP_ICONS:Partial<Record<GreetingCopyKey,TopIconName>>={greeting:'voice',day:'calendar',week:'calendar',time:'clock'};

/** The date line of the window: part of the day, weekday, date and KW. */
function facts(date:Date){
 const part=PART_NOUN[germanMoment(date).part];
 return `${part} · ${WEEKDAYS[date.getDay()]}, ${date.getDate()}. ${MONTHS[date.getMonth()]} · KW ${isoWeek(date)}`;
}

/**
 * The header's clock (the learner asked: no frame, only the clock, the day and the part of the day, placed neatly):
 * an analog clock for the learner's own time (ticking second hand with motion on; no digits), the weekday in German
 * (Mittwoch) and the part of the day with a small picture (Morgen, Vormittag, Mittag, Nachmittag, Abend, Nacht). A
 * tap opens a window with all the ways to say it (greeting, time of day, day and date, week, time — official and
 * everyday), with short notes in the site language. Before the page knows the learner's clock it keeps the place empty.
 */
export function SiteGreeting({language,line}:{language:VaultLanguage;line:string}){
 const motion=usePaulMotion();
 const [now,setNow]=useState<Date|null>(null);
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
 if(!now)return <span className="site-greeting site-greeting-waiting" aria-hidden="true"/>;
 const moment=germanMoment(now);
 const groups:[GreetingCopyKey,{de:string;note?:GreetingNote}[]][]=[['greeting',moment.greetings],['partOfDay',moment.partPhrases],['day',moment.day],['week',moment.week],['time',moment.time]];
 const time=`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
 return <>
  <button ref={button} type="button" className="site-greeting site-greeting-button" aria-haspopup="dialog" aria-expanded={open} title={t('open')} onClick={()=>setOpen(true)} data-site-greeting={moment.part}>
   <AnalogClock date={now} seconds={motion}/>
   <span className="site-greeting-words" lang="de" dir="ltr">
    <strong className="site-greeting-day"><TopIcon name="calendar" size={24} className="sg-day-icon"/>{WEEKDAYS[now.getDay()]}</strong>
    <span className={'site-greeting-part part-'+moment.part}><PartOfDayIcon part={moment.part}/>{PART_NOUN[moment.part]}</span>
    <span className="lk-visually-hidden">{time}</span>
   </span>
  </button>
  {open&&createPortal(<div className="sg-backdrop" onPointerDown={event=>{if(event.target===event.currentTarget)setOpen(false);}}>
   <section className="sg-panel" role="dialog" aria-modal="true" aria-labelledby="sg-title" lang={language} dir={languageDirection(language)}>
    <button ref={closeButton} type="button" className="sg-close" aria-label={t('close')} onClick={()=>setOpen(false)}><X size={18} aria-hidden="true"/></button>
    <h2 id="sg-title"><TopIcon name="clock" size={30}/>{t('panelTitle')}</h2>
    <p className="sg-now" lang="de" dir="ltr">{facts(now)}</p>
    {groups.map(([key,phrases])=><div key={key} className={'sg-group sg-'+key} data-greeting-group={key}>
     <h3>{key==='partOfDay'?<PartOfDayIcon part={moment.part}/>:<TopIcon name={GROUP_ICONS[key]??'clock'} size={22}/>}{t(key)}</h3>
     {key==='time'&&<AnalogClock date={now} seconds={motion} className="sg-clock"/>}
     <ul>{phrases.map(item=><li key={item.de}><span lang="de" dir="ltr">{item.de}</span>{item.note&&<small>{t(item.note)}</small>}</li>)}</ul>
     {key==='week'&&<p className="sg-hint">{t('kw')}</p>}
    </div>)}
    <p className="sg-line">{line}</p>
   </section>
  </div>,document.body)}
 </>;
}
