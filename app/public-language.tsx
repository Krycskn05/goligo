'use client';
import {useEffect} from 'react';
import {TopIcon} from './top-icons';
import {isSiteLanguage,languageDirection,siteLanguages,type SiteLanguage} from '@/lib/site-languages';
import {LANGUAGE_STORAGE_KEY,cookieLanguage,rememberSiteLanguage} from '@/lib/device-language';

/**
 * The site language in the header of the pages the server writes. A new choice is kept (browser + cookie) and the
 * page is written again in it. `label` comes from the server, so the browser needs no language pack for it.
 */
export function PublicLanguage({language,label}:{language:SiteLanguage;label:string}){
 useEffect(()=>{
  document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);
  // A language chosen in this browser before the site kept it in a cookie: show the page in it (once; never when
  // cookies are blocked).
  let saved:string|null=null;try{saved=localStorage.getItem(LANGUAGE_STORAGE_KEY);}catch{}
  if(saved&&isSiteLanguage(saved)&&saved!==language&&!cookieLanguage(document.cookie)){rememberSiteLanguage(saved);if(cookieLanguage(document.cookie)===saved)window.location.reload();}
 },[language]);
 function change(next:string){if(!isSiteLanguage(next)||next===language)return;rememberSiteLanguage(next);window.location.reload();}
 return <label className="site-language" data-public-language><TopIcon name="language" size={26}/><span className="site-language-label">{label}</span><select value={language} aria-label={label} onChange={event=>change(event.target.value)}>{siteLanguages.map(item=><option key={item.id} value={item.id} lang={item.id}>{item.label}</option>)}</select></label>;
}
