'use client';
import {useEffect} from 'react';

/**
 * Ziyaret sinyali (yönetici panelinin ziyaret bölümleri; site sahibi istedi, 4 Kasım 2026). Mounted once in
 * app/layout.tsx: when a page opens it tells app/api/ziyaret which page it is, where the visitor came from (the
 * referrer only on the first page of the visit), the device kind and the site language. Nothing is stored in the
 * browser (no cookie, no local storage); the server keeps no IP address (lib/visits.ts). Any failure is ignored.
 */
export function VisitBeacon(){
 useEffect(()=>{
  // Pages set their language right after they open; wait a moment so the visit has it.
  const timer=setTimeout(()=>{
   try{
    const coarse=window.matchMedia('(pointer: coarse)').matches;const short=Math.min(window.screen.width,window.screen.height);
    const device=coarse?(short>=600?'tablet':'phone'):'computer';
    let internal=false;
    try{internal=!!document.referrer&&new URL(document.referrer).origin===window.location.origin;}catch{}
    const body=JSON.stringify({path:window.location.pathname,referrer:internal?'':document.referrer,internal,device,language:document.documentElement.lang});
    if(navigator.sendBeacon&&navigator.sendBeacon('/api/ziyaret',new Blob([body],{type:'application/json'})))return;
    void fetch('/api/ziyaret',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true}).catch(()=>{});
   }catch{}
  },900);
  return()=>clearTimeout(timer);
 },[]);
 return null;
}
