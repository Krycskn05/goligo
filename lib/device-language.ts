import {isSiteLanguage,type SiteLanguage} from './site-languages';

/**
 * Which language a visitor sees. A language the visitor chose on the site (the site-language picker, no account needed)
 * always wins. Otherwise the language of the phone or computer, when it is one of the site languages (the learner asked,
 * 22 October 2026: on the first visit the site opens in the device's language; this replaced "always German first").
 * Otherwise German, the site's main language.
 */
export const DEFAULT_SITE_LANGUAGE:SiteLanguage='de';
/** The saved choice in the browser (shared by every page) and, for the pages the server writes, a cookie copy of it. */
export const LANGUAGE_STORAGE_KEY='german-study-language';
export const LANGUAGE_COOKIE='goligo-dil';
const YEAR=365*24*60*60;

/** The saved choice if it is a site language, otherwise the device's language, otherwise German. */
export function chooseSiteLanguage(saved:string|null|undefined,device:SiteLanguage|null=null):SiteLanguage{
 return saved&&isSiteLanguage(saved)?saved:device??DEFAULT_SITE_LANGUAGE;
}

/** Device language codes that differ from the site's ids: Serbian, Croatian, Bosnian and Montenegrin are the site's
 * Bosanski / Hrvatski / Srpski; Kurmanji is the site's Kurdish (Sorani has another script, so it is not matched). */
const TAG_ALIASES:Readonly<Record<string,SiteLanguage>>={sr:'hbs',hr:'hbs',bs:'hbs',sh:'hbs',cnr:'hbs',kmr:'ku'};

/** One language tag of a phone or browser (tr-TR, de, pt_BR, fa-AF) as a site language, or null. Persian of
 * Afghanistan (fa-AF) is Dari. */
export function tagLanguage(tag:string|null|undefined):SiteLanguage|null{
 const parts=String(tag??'').trim().toLowerCase().replace(/_/g,'-').split('-');
 const base=parts[0];if(!base||!/^[a-z]{2,3}$/.test(base))return null;
 if(base==='fa'&&parts.slice(1).includes('af'))return 'prs';
 const id=Object.prototype.hasOwnProperty.call(TAG_ALIASES,base)?TAG_ALIASES[base]:base;
 return isSiteLanguage(id)?id:null;
}

/** The first of the device's languages (in its order of preference) that the site has, or null. */
export function deviceLanguage(tags:readonly string[]|null|undefined):SiteLanguage|null{
 for(const tag of tags??[]){const language=tagLanguage(tag);if(language)return language;}
 return null;
}

/** The languages of an Accept-Language header, most wanted first (q=0 means "not this one"). */
export function acceptedLanguages(header:string|null|undefined):string[]{
 return String(header??'').split(',').slice(0,20).map((part,index)=>{
  const [tag,...params]=part.trim().split(';');
  const q=params.map(item=>item.trim()).find(item=>item.startsWith('q='));
  const weight=q?Number(q.slice(2)):1;
  return {tag:tag.trim(),weight:Number.isFinite(weight)?weight:0,index};
 }).filter(item=>item.tag&&item.weight>0).sort((a,b)=>b.weight-a.weight||a.index-b.index).map(item=>item.tag);
}

/** The language cookie's value from a Cookie header. */
export function cookieLanguage(cookieHeader:string|null|undefined):string|null{
 for(const part of (cookieHeader??'').split(';')){
  const at=part.indexOf('=');if(at<0)continue;
  if(part.slice(0,at).trim()===LANGUAGE_COOKIE)return part.slice(at+1).trim()||null;
 }
 return null;
}

/** On the server: the visitor's choice (cookie), otherwise the browser's languages (Accept-Language), otherwise German. */
export function requestLanguage(cookieHeader:string|null|undefined,acceptLanguage?:string|null):SiteLanguage{
 return chooseSiteLanguage(cookieLanguage(cookieHeader),deviceLanguage(acceptedLanguages(acceptLanguage)));
}

/** In the browser: the saved choice (this browser, then the cookie), otherwise the device's languages, otherwise German. */
export function browserLanguage():SiteLanguage{
 let saved:string|null=null;
 try{saved=localStorage.getItem(LANGUAGE_STORAGE_KEY);}catch{}
 if(!saved||!isSiteLanguage(saved))saved=cookieLanguage(typeof document==='undefined'?'':document.cookie);
 let device:SiteLanguage|null=null;
 try{if(typeof navigator!=='undefined')device=deviceLanguage(navigator.languages?.length?navigator.languages:[navigator.language]);}catch{}
 return chooseSiteLanguage(saved,device);
}

/** The Set-Cookie value that keeps the language for the pages the server writes (sign in, sign up, legal pages). */
export function languageCookie(language:SiteLanguage){return `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=${YEAR}; SameSite=Lax`;}

/** Keeps the shown language: in this browser and in the cookie. */
export function rememberSiteLanguage(language:SiteLanguage){
 try{localStorage.setItem(LANGUAGE_STORAGE_KEY,language);}catch{}
 try{if(typeof document!=='undefined'&&cookieLanguage(document.cookie)!==language)document.cookie=languageCookie(language)+(location.protocol==='https:'?'; Secure':'');}catch{}
}
