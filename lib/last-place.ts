/**
 * The last part of the site the learner worked in, so the units page can offer "Kaldığın yerden devam et" (wired on
 * 2 November 2026; the learner: "the place where I stopped is forgotten"). Each study page saves itself when it opens,
 * a lesson page (Lektion 1, 2, 12, 15) with its part and step. The key travels with the account (lib/lesson-sync.ts,
 * `site`). Only known site paths are accepted when it is read back.
 */
export type PlaceId='housing'|'ausbildung'|'hoeren'|'vault'|'verbs'|'willkommen'|'berufe'|'orte'|'familie'|'stadt';
export type LastPlace={id:PlaceId;href:string;detail?:string;at:number};
export const LAST_PLACE_KEY='lernkoko-last-place';
const paths:Record<PlaceId,string>={housing:'/a1-2/ev-ve-yasam',ausbildung:'/a1-2/ausbildung',hoeren:'/a1-2/ausbildung/hoeren',vault:'/ev-esyalar',verbs:'/fiiller',willkommen:'/a1-1/willkommen',berufe:'/a1-1/berufe',orte:'/a1-1/orte-und-dinge',familie:'/a1-1/familie',stadt:'/a1-2/wege-in-der-stadt'};
/** The textbook unit of a lesson place (its name on the units page); the other places have their own titles. */
export const placeUnit:Partial<Record<PlaceId,string>>={ausbildung:'book-12',hoeren:'book-12',willkommen:'book-01',berufe:'book-02',orte:'book-03',familie:'book-04',stadt:'book-15'};
/** A lesson step's address: Teil A without `teil`, the other parts with it. */
export const lessonStepHref=(id:'willkommen'|'berufe'|'orte'|'familie'|'stadt',part:string,step:string)=>paths[id]+'?'+(part==='a'?'':'teil='+part+'&')+'adim='+step;
const isPlaceId=(value:unknown):value is PlaceId=>typeof value==='string'&&Object.hasOwn(paths,value);
/** The page path itself, optionally with a plain query (letters, digits, = & . _ -). */
export function isPlaceHref(id:PlaceId,href:unknown):href is string{
 if(typeof href!=='string'||href.length>160)return false;
 const base=paths[id];if(href===base)return true;
 return href.startsWith(base+'?')&&/^[\w=&.-]*$/.test(href.slice(base.length+1));
}
export function placePath(id:PlaceId){return paths[id];}
export function saveLastPlace(storage:Pick<Storage,'setItem'>,place:{id:PlaceId;href?:string;detail?:string},now=Date.now()){
 const href=place.href&&isPlaceHref(place.id,place.href)?place.href:paths[place.id];
 const detail=typeof place.detail==='string'&&place.detail.trim()?place.detail.trim().slice(0,60):undefined;
 try{storage.setItem(LAST_PLACE_KEY,JSON.stringify({id:place.id,href,...(detail?{detail}:{}),at:now}));}catch{}
}
export function readLastPlace(storage:Pick<Storage,'getItem'>):LastPlace|null{
 let data:unknown=null;
 try{data=JSON.parse(storage.getItem(LAST_PLACE_KEY)??'null');}catch{return null;}
 if(!data||typeof data!=='object')return null;
 const {id,href,detail,at}=data as Record<string,unknown>;
 if(!isPlaceId(id)||!isPlaceHref(id,href))return null;
 return {id,href,at:typeof at==='number'&&Number.isFinite(at)?at:0,...(typeof detail==='string'&&detail.trim()?{detail:detail.trim().slice(0,60)}:{})};
}
/** The verb of the day: the same verb all day long in the learner's time zone, then the next one. */
export function dayNumber(now=Date.now(),timezoneOffset=new Date(now).getTimezoneOffset()){return Math.floor((now-timezoneOffset*60000)/86400000);}
export function dailyIndex(length:number,now=Date.now(),timezoneOffset?:number){
 if(length<=0)return 0;const day=dayNumber(now,timezoneOffset);return ((day%length)+length)%length;
}
