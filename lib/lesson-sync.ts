/**
 * Lesson progress on every device (the learner asked, 30 October 2026: "my progress on the tablet does not show on
 * the computer"). Lektion 1, 12 and 15 keep their scores, the last step and half-done exercises in the browser
 * (localStorage keys `lernkoko-l1…`, `lernkoko-l12…`, `lernkoko-l15…`). For a member these keys also live in the
 * account: app/lesson-sync.tsx sends this browser's keys to app/api/ilerleme, the server merges them with what other
 * devices sent (`mergeItems`) and answers with the merged keys, which the browser writes back. Pure functions, checked
 * by tests/lesson-sync.test.cjs.
 *
 * Each key carries the time it last changed on a device (`t`, ms). The newer one wins; a removed key is kept as
 * `v:null` so a removal travels too. A key this browser had before syncing existed has `t:0` ("age unknown"): it never
 * beats a known change, and two score lists of unknown age are joined (exercises done on one device and others done on
 * the other device both stay).
 */
export const SYNC_LESSONS=['l1','l12','l15'] as const;
export type SyncLesson=typeof SYNC_LESSONS[number];
export type SyncItem={v:string|null;t:number};
export type SyncItems=Record<string,SyncItem>;
/** Remembered per key in this browser: a fingerprint of the value and when it changed. */
export type SyncMeta=Record<string,{h:string;t:number}>;
export const SYNC_META_KEY='lernkoko-sync-meta';
/** Fired on window after keys from another device were written, so open lesson pages read them again. */
export const SYNC_EVENT='lernkoko-sync';
/** Limits the server keeps to (one value, all keys of a lesson, the request). */
export const SYNC_VALUE_MAX=20000;
export const SYNC_LESSON_MAX=150000;
export const SYNC_REQUEST_MAX=480000;
/** Settings of one device, not progress. */
const DEVICE_ONLY=new Set(['lernkoko-l12-speed']);

/** The lesson a browser key belongs to, or null for keys that are not synced. */
export function syncLessonOf(key:string):SyncLesson|null{
 if(DEVICE_ONLY.has(key))return null;
 const match=/^lernkoko-l(1[a-d]?|12|15[a-d]?)[-:]/.exec(key);
 if(!match)return null;
 return match[1].startsWith('12')?'l12':match[1].startsWith('15')?'l15':'l1';
}
/** A short fingerprint of a value (FNV-1a and the length); '-' for a missing key. */
export function fingerprint(value:string|null){
 if(value===null)return '-';
 let hash=0x811c9dc5;for(let i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,0x01000193)>>>0;}
 return hash.toString(36)+'.'+value.length;
}
/** Notes what changed in the browser since the last look: changed keys get `now`, keys seen for the first time get 0. */
export function scanLocal(local:Record<string,string>,meta:SyncMeta,now:number):SyncMeta{
 const next:SyncMeta={};
 for(const [key,value] of Object.entries(local)){
  if(!syncLessonOf(key))continue;
  const before=meta[key];const h=fingerprint(value);
  next[key]=!before?{h,t:0}:before.h===h?before:{h,t:now};
 }
 for(const [key,before] of Object.entries(meta)){
  if(key in next||!syncLessonOf(key))continue;
  next[key]=before.h==='-'?before:{h:'-',t:now};
 }
 return next;
}
/** This browser's keys of one lesson, with their times. */
export function localItems(lesson:SyncLesson,local:Record<string,string>,meta:SyncMeta):SyncItems{
 const items:SyncItems={};
 for(const [key,info] of Object.entries(meta)){
  if(syncLessonOf(key)!==lesson)continue;
  const value=key in local?local[key]:null;
  if(value===null&&info.t===0)continue;
  items[key]={v:value,t:info.t};
 }
 return items;
}
function asObject(value:string|null):Record<string,unknown>|null{
 if(value===null)return null;
 try{const parsed=JSON.parse(value) as unknown;return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed as Record<string,unknown>:null;}catch{return null;}
}
/**
 * Merges what a device sends (`incoming`) into what is kept (`kept`). The newer change of a key wins; a key of
 * unknown age (t 0) loses to a known change, and two JSON objects of which one has unknown age are joined (the
 * kept side wins where both have the same entry). `now` stamps a joined value so it reaches every device.
 */
export function mergeItems(kept:SyncItems,incoming:SyncItems,now:number):SyncItems{
 const out:SyncItems={...kept};
 for(const [key,mine] of Object.entries(incoming)){
  const theirs=kept[key];
  if(!theirs){out[key]=mine;continue;}
  if(theirs.v===mine.v){out[key]={v:mine.v,t:Math.max(theirs.t,mine.t)};continue;}
  if(mine.t===0||theirs.t===0){
   const a=asObject(theirs.v),b=asObject(mine.v);
   if(a&&b){out[key]={v:JSON.stringify({...b,...a}),t:now};continue;}
   out[key]=mine.t===0?theirs:mine;continue;
  }
  out[key]=mine.t>theirs.t?mine:theirs;
 }
 return out;
}
/** Reads a stored or sent list of keys of one lesson; anything wrong is left out. */
export function cleanItems(lesson:SyncLesson,value:unknown):SyncItems{
 const items:SyncItems={};
 if(!value||typeof value!=='object'||Array.isArray(value))return items;
 for(const [key,item] of Object.entries(value as Record<string,unknown>)){
  if(syncLessonOf(key)!==lesson||!item||typeof item!=='object')continue;
  const {v,t}=item as {v?:unknown;t?:unknown};
  if(!(v===null||typeof v==='string')||typeof v==='string'&&v.length>SYNC_VALUE_MAX)continue;
  if(typeof t!=='number'||!Number.isFinite(t)||t<0)continue;
  items[key]={v,t:Math.floor(t)};
 }
 return items;
}
export function parseStored(lesson:SyncLesson,text:string|null|undefined):SyncItems{
 if(!text)return {};
 try{return cleanItems(lesson,(JSON.parse(text) as {items?:unknown}).items);}catch{return {};}
}
/** What the browser should write after the server answered: merged keys that differ from the browser (null = remove). */
export function toWrite(merged:SyncItems,local:Record<string,string>):Record<string,string|null>{
 const out:Record<string,string|null>={};
 for(const [key,item] of Object.entries(merged)){
  const now=key in local?local[key]:null;
  if(item.v!==now)out[key]=item.v;
 }
 return out;
}
