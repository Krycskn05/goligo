import {isSiteLanguage,type SiteLanguage} from './site-languages';

/**
 * Which language a visitor sees first (the learner asked: the site looks like the phone's language, and German is the
 * main language). A language the visitor chose on the site always wins; otherwise the first of the device's languages
 * that the site has (navigator.languages in the browser, the Accept-Language header on the server); otherwise German.
 */
export const DEFAULT_SITE_LANGUAGE:SiteLanguage='de';
/** The saved choice in the browser (shared by every page) and, for the pages the server writes, a cookie copy of it. */
export const LANGUAGE_STORAGE_KEY='german-study-language';
export const LANGUAGE_COOKIE='goligo-dil';
const YEAR=365*24*60*60;

/** Language tags that mean one of the site languages under another code. */
const ALIASES=new Map<string,SiteLanguage>([['bs','hbs'],['hr','hbs'],['sr','hbs'],['sh','hbs'],['cnr','hbs'],['kmr','ku'],['pes','fa'],['pbu','ps'],['pbt','ps'],['tir','ti'],['som','so']]);

/** One language tag ("tr-TR", "fa_AF", "sr-Latn-RS") → a site language, or null. */
export function siteLanguageForTag(tag:string):SiteLanguage|null{
 const parts=tag.trim().toLowerCase().replace(/_/g,'-').split('-').filter(Boolean);
 const base=parts[0];if(!base||base==='*')return null;
 // Persian as spoken in Afghanistan is Dari.
 if(base==='fa'&&parts.includes('af'))return 'prs';
 const alias=ALIASES.get(base);if(alias)return alias;
 return isSiteLanguage(base)?base:null;
}

/** The first of the device's languages that the site has; German when none. */
export function deviceLanguage(list:readonly (string|null|undefined)[]|null|undefined):SiteLanguage{
 for(const tag of list??[]){if(!tag)continue;const language=siteLanguageForTag(tag);if(language)return language;}
 return DEFAULT_SITE_LANGUAGE;
}

/** The saved choice if it is a site language, otherwise the device language. */
export function chooseSiteLanguage(saved:string|null|undefined,list:readonly (string|null|undefined)[]|null|undefined):SiteLanguage{
 return saved&&isSiteLanguage(saved)?saved:deviceLanguage(list);
}

/** The languages of an Accept-Language header, most wanted first ("tr-TR,tr;q=0.9,en;q=0.8"). */
export function acceptLanguages(header:string|null|undefined):string[]{
 if(!header)return [];
 return header.split(',').map((item,index)=>{
  const [tag,...params]=item.trim().split(';');
  const q=params.map(param=>param.trim()).find(param=>param.startsWith('q='));
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

/** On the server: the cookie (the visitor's choice), then the browser's languages, then German. */
export function requestLanguage(cookieHeader:string|null|undefined,acceptLanguage:string|null|undefined):SiteLanguage{
 return chooseSiteLanguage(cookieLanguage(cookieHeader),acceptLanguages(acceptLanguage));
}

/** In the browser: the saved choice, then the device's languages, then German. */
export function browserLanguage():SiteLanguage{
 let saved:string|null=null;
 try{saved=localStorage.getItem(LANGUAGE_STORAGE_KEY);}catch{}
 if(!saved)saved=cookieLanguage(typeof document==='undefined'?'':document.cookie);
 const list=typeof navigator==='undefined'?[]:navigator.languages?.length?navigator.languages:[navigator.language];
 return chooseSiteLanguage(saved,list);
}

/** The Set-Cookie value that keeps the language for the pages the server writes (sign in, sign up, legal pages). */
export function languageCookie(language:SiteLanguage){return `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=${YEAR}; SameSite=Lax`;}

/** Keeps the shown language: in this browser and in the cookie. */
export function rememberSiteLanguage(language:SiteLanguage){
 try{localStorage.setItem(LANGUAGE_STORAGE_KEY,language);}catch{}
 try{if(typeof document!=='undefined'&&cookieLanguage(document.cookie)!==language)document.cookie=languageCookie(language)+(location.protocol==='https:'?'; Secure':'');}catch{}
}
