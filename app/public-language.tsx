'use client';
import {useEffect} from 'react';
import {TopIcon} from './top-icons';
import {isSiteLanguage,languageDirection,siteLanguages,type SiteLanguage} from '@/lib/site-languages';
import {rememberSiteLanguage} from '@/lib/device-language';

/**
 * The site language in the header of the pages the server writes (German until the visitor picks another; no account
 * needed). A new choice is kept (browser + cookie) and the page is written again in it. `label` comes from the server,
 * so the browser needs no language pack for it.
 */
export function PublicLanguage({language,label}:{language:SiteLanguage;label:string}){
 useEffect(()=>{
  document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);
 },[language]);
 function change(next:string){if(!isSiteLanguage(next)||next===language)return;rememberSiteLanguage(next);window.location.reload();}
 return <label className="site-language" data-public-language><TopIcon name="language" size={26}/><span className="site-language-label">{label}</span><select value={language} aria-label={label} onChange={event=>change(event.target.value)}>{siteLanguages.map(item=><option key={item.id} value={item.id} lang={item.id}>{item.label}</option>)}</select></label>;
}
