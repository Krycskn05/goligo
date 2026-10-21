import {isSiteLanguage,type SiteLanguage} from './site-languages';

/**
 * Which language a visitor sees (the learner asked, 21 October 2026: the site's main language is German — the
 * introduction, sign in and sign up pages open in German — and anybody can change the site language, without signing
 * up, with the site-language picker). A language the visitor chose on the site always wins; otherwise German. The
 * phone's language is not used.
 */
export const DEFAULT_SITE_LANGUAGE:SiteLanguage='de';
/** The saved choice in the browser (shared by every page) and, for the pages the server writes, a cookie copy of it. */
export const LANGUAGE_STORAGE_KEY='german-study-language';
export const LANGUAGE_COOKIE='goligo-dil';
const YEAR=365*24*60*60;

/** The saved choice if it is a site language, otherwise German. */
export function chooseSiteLanguage(saved:string|null|undefined):SiteLanguage{
 return saved&&isSiteLanguage(saved)?saved:DEFAULT_SITE_LANGUAGE;
}

/** The language cookie's value from a Cookie header. */
export function cookieLanguage(cookieHeader:string|null|undefined):string|null{
 for(const part of (cookieHeader??'').split(';')){
  const at=part.indexOf('=');if(at<0)continue;
  if(part.slice(0,at).trim()===LANGUAGE_COOKIE)return part.slice(at+1).trim()||null;
 }
 return null;
}

/** On the server: the visitor's choice (cookie), otherwise German. */
export function requestLanguage(cookieHeader:string|null|undefined):SiteLanguage{
 return chooseSiteLanguage(cookieLanguage(cookieHeader));
}

/** In the browser: the saved choice (this browser, then the cookie), otherwise German. */
export function browserLanguage():SiteLanguage{
 let saved:string|null=null;
 try{saved=localStorage.getItem(LANGUAGE_STORAGE_KEY);}catch{}
 if(!saved||!isSiteLanguage(saved))saved=cookieLanguage(typeof document==='undefined'?'':document.cookie);
 return chooseSiteLanguage(saved);
}

/** The Set-Cookie value that keeps the language for the pages the server writes (sign in, sign up, legal pages). */
export function languageCookie(language:SiteLanguage){return `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=${YEAR}; SameSite=Lax`;}

/** Keeps the shown language: in this browser and in the cookie. */
export function rememberSiteLanguage(language:SiteLanguage){
 try{localStorage.setItem(LANGUAGE_STORAGE_KEY,language);}catch{}
 try{if(typeof document!=='undefined'&&cookieLanguage(document.cookie)!==language)document.cookie=languageCookie(language)+(location.protocol==='https:'?'; Secure':'');}catch{}
}
