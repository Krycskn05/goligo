'use client';
import {useCallback,useRef} from 'react';
import {loadLanguagePack,type SiteLanguage} from '@/lib/site-languages';

/**
 * Changes the site language only after its language pack has loaded, so every text on the page
 * (memoised texts too) switches at once instead of showing English first. The latest choice wins.
 */
export function useLanguageSwitch(apply:(language:SiteLanguage)=>void){
 const latest=useRef(0);
 return useCallback((language:SiteLanguage,then?:()=>void)=>{
  const id=++latest.current;
  void loadLanguagePack(language).then(()=>{if(latest.current!==id)return;apply(language);then?.();});
 },[apply]);
}
