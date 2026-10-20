/**
 * The last part of the site the learner worked in, kept in this browser, so the home page can offer
 * "Kaldığın yerden devam et". Each study page saves itself when it opens (and Lektion 12 when a part
 * or a listening task opens). Only known site paths are accepted when it is read back.
 */
export type PlaceId='housing'|'ausbildung'|'hoeren'|'vault'|'verbs';
export type LastPlace={id:PlaceId;href:string;detail?:string;at:number};
export const LAST_PLACE_KEY='lernkoko-last-place';
const paths:Record<PlaceId,string>={housing:'/a1-2/ev-ve-yasam',ausbildung:'/a1-2/ausbildung',hoeren:'/a1-2/ausbildung/hoeren',vault:'/ev-esyalar',verbs:'/fiiller'};
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
