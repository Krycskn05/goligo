'use client';
import {useEffect,useState} from 'react';
import {SYNC_EVENT,SYNC_LESSONS,SYNC_META_KEY,cleanItems,fingerprint,localItems,scanLocal,syncLessonOf,toWrite,type SyncLesson,type SyncMeta} from '@/lib/lesson-sync';

/**
 * Lesson progress on every device (lib/lesson-sync.ts; the learner asked, 30 October 2026: "my progress on the tablet
 * does not show on the computer"). Mounted once in app/layout.tsx. For a signed-in member it sends this browser's
 * Lektion 1 / 12 / 15 keys to app/api/ilerleme when a page opens, when the learner comes back to the tab, when the tab
 * is left and every 15 seconds while something changed; the merged keys from the account are written back and open
 * lesson pages read them again (`useSyncVersion`). Visitors without an account get one 401 and nothing more.
 */
const PUBLIC=new Set(['/giris','/uye-ol','/sifre-yenile','/gizlilik','/impressum','/kullanim-kosullari']);
const OFF_KEY='lernkoko-sync-off';

function readLocal():Record<string,string>{
 const out:Record<string,string>={};
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&syncLessonOf(key)){const value=localStorage.getItem(key);if(value!==null)out[key]=value;}}
 return out;
}
function readMeta():SyncMeta{try{const value=JSON.parse(localStorage.getItem(SYNC_META_KEY)??'{}') as unknown;return value&&typeof value==='object'?value as SyncMeta:{};}catch{return {};}}
function writeMeta(meta:SyncMeta){try{localStorage.setItem(SYNC_META_KEY,JSON.stringify(meta));}catch{}}
const itemsOf=(local:Record<string,string>,meta:SyncMeta)=>Object.fromEntries(SYNC_LESSONS.map(lesson=>[lesson,localItems(lesson,local,meta)])) as Record<SyncLesson,ReturnType<typeof localItems>>;

export function LessonSync(){
 useEffect(()=>{
  if(PUBLIC.has(window.location.pathname)){try{sessionStorage.removeItem(OFF_KEY);}catch{}return;}
  try{const off=Number(sessionStorage.getItem(OFF_KEY));if(off&&Date.now()-off<10*60000)return;}catch{}
  let stopped=false,busy=false,again=false,sent='';
  async function sync(force:boolean,leaving=false){
   if(stopped)return;if(busy){again=true;return;}
   let meta:SyncMeta;let lessons:ReturnType<typeof itemsOf>;
   try{meta=scanLocal(readLocal(),readMeta(),Date.now());writeMeta(meta);lessons=itemsOf(readLocal(),meta);}catch{return;}
   const body=JSON.stringify({lessons});
   if(!force&&body===sent)return;
   busy=true;
   try{
    const response=await fetch('/api/ilerleme',{method:'POST',headers:{'content-type':'application/json'},body,credentials:'same-origin',keepalive:leaving&&body.length<60000});
    if(response.status===401){stopped=true;try{sessionStorage.setItem(OFF_KEY,String(Date.now()));}catch{}return;}
    if(!response.ok)return;
    const data=await response.json() as {lessons?:Record<string,unknown>};
    // Keys the learner changed while the answer was on its way stay as they are (they go with the next sync).
    const local=readLocal();const now=scanLocal(local,readMeta(),Date.now());const changed:SyncLesson[]=[];
    for(const lesson of SYNC_LESSONS){
     const merged=cleanItems(lesson,data.lessons?.[lesson]);
     for(const [key,value] of Object.entries(toWrite(merged,local))){
      if((now[key]?.h??'-')!==(meta[key]?.h??'-'))continue;
      try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch{continue;}
      now[key]={h:fingerprint(value),t:merged[key].t};if(!changed.includes(lesson))changed.push(lesson);
     }
     for(const [key,item] of Object.entries(merged)){const info=now[key];if(info&&info.h===fingerprint(item.v)&&info.t<item.t)now[key]={h:info.h,t:item.t};}
    }
    writeMeta(now);sent=JSON.stringify({lessons:itemsOf(readLocal(),now)});
    if(changed.length)window.dispatchEvent(new CustomEvent(SYNC_EVENT,{detail:{lessons:changed}}));
   }catch{}finally{busy=false;if(again&&!stopped){again=false;void sync(false);}}
  }
  void sync(true);
  const timer=window.setInterval(()=>{if(document.visibilityState==='visible')void sync(false);},15000);
  const onVisible=()=>{if(document.visibilityState==='visible')void sync(true);else void sync(false,true);};
  const onLeave=()=>{void sync(false,true);};
  document.addEventListener('visibilitychange',onVisible);window.addEventListener('pagehide',onLeave);
  return ()=>{stopped=true;window.clearInterval(timer);document.removeEventListener('visibilitychange',onVisible);window.removeEventListener('pagehide',onLeave);};
 },[]);
 return null;
}

/** A number that grows when progress of `lesson` (or of any lesson) came from another device: use it as a React key. */
export function useSyncVersion(lesson?:SyncLesson){
 const [version,setVersion]=useState(0);
 useEffect(()=>{
  const on=(event:Event)=>{const lessons=(event as CustomEvent<{lessons?:SyncLesson[]}>).detail?.lessons;if(!lesson||!lessons||lessons.includes(lesson))setVersion(value=>value+1);};
  window.addEventListener(SYNC_EVENT,on);return ()=>window.removeEventListener(SYNC_EVENT,on);
 },[lesson]);
 return version;
}
