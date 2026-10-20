'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Download,X} from 'lucide-react';
import {NavIcon} from './nav-icons';
import {homeText,type HomeCopyKey} from '@/lib/home-copy';
import {effectsText} from '@/lib/effects-copy';
import {languageDirection} from '@/lib/site-languages';
import type {StudyLanguage} from '@/lib/study-languages';

type Platform='ios'|'android'|'other';
type InstallPrompt=Event&{prompt:()=>Promise<void>;userChoice?:Promise<unknown>};
function platformOf(agent:string,touchPoints:number):Platform{
 if(/iPhone|iPad|iPod/i.test(agent)||(/Macintosh/i.test(agent)&&touchPoints>1))return 'ios';
 return /Android/i.test(agent)?'android':'other';
}
const standalone=()=>{try{return window.matchMedia('(display-mode: standalone)').matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;}catch{return false;}};

/**
 * "Uygulama olarak indir": a button in the left menu that opens a small window explaining how to put
 * LernKoko on the phone's home screen like an app (iPhone: Safari → Paylaş → Ana Ekrana Ekle; Android:
 * Chrome → ⋮ → Ana ekrana ekle). The phone's own steps come first; when the browser offers its install
 * window (Chrome, Edge), "Şimdi yükle" opens it. Hidden when the site already runs as the installed app.
 */
export function InstallGuide({language}:{language:StudyLanguage}){
 const h=(key:HomeCopyKey)=>homeText(language,key);
 const titleId=useId();
 const [open,setOpen]=useState(false);
 const [platform,setPlatform]=useState<Platform>('other');
 const [installed,setInstalled]=useState(false);
 const [prompt,setPrompt]=useState<InstallPrompt|null>(null);
 const trigger=useRef<HTMLButtonElement>(null);const close=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  setPlatform(platformOf(navigator.userAgent,navigator.maxTouchPoints||0));setInstalled(standalone());
  const offer=(event:Event)=>{event.preventDefault();setPrompt(event as InstallPrompt);};
  const done=()=>{setInstalled(true);setPrompt(null);setOpen(false);};
  window.addEventListener('beforeinstallprompt',offer);window.addEventListener('appinstalled',done);
  return()=>{window.removeEventListener('beforeinstallprompt',offer);window.removeEventListener('appinstalled',done);};
 },[]);
 // The window takes the focus while open and gives it back to the menu button when it closes.
 useEffect(()=>{
  if(!open)return;close.current?.focus();
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};window.addEventListener('keydown',key);
  const opener=trigger.current;
  return()=>{window.removeEventListener('keydown',key);opener?.focus();};
 },[open]);
 if(installed)return null;
 async function install(){if(!prompt)return;try{await prompt.prompt();await prompt.userChoice;}catch{}setPrompt(null);}
 const ios=<section className="ig-os" data-install-os="ios"><h3>iPhone · Safari</h3><ol><li>{h('iosStep1')}</li><li>{h('iosStep2')}</li><li>{h('iosStep3')}</li></ol></section>;
 const android=<section className="ig-os" data-install-os="android"><h3>Android · Chrome</h3><ol><li>{h('androidStep1')}</li><li>{h('androidStep2')}</li><li>{h('androidStep3')}</li></ol></section>;
 return <div className="ig" data-install-guide="">
  <button ref={trigger} type="button" className="work-nav object-nav-link ig-trigger" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}><NavIcon name="app"/>{h('installButton')}</button>
  {/* The window is drawn on the page body, above every card and picture of the page. */}
  {open&&createPortal(<div className="ig ig-backdrop" onClick={event=>{if(event.target===event.currentTarget)setOpen(false);}}>
   <div className="ig-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} dir={languageDirection(language)}>
    <button ref={close} type="button" className="ig-close" aria-label={effectsText(language,'close')} title={effectsText(language,'close')} onClick={()=>setOpen(false)}><X size={18} aria-hidden="true"/></button>
    <img className="ig-icon" src="/icons/icon-192.png" alt="" width={192} height={192}/>
    <h2 id={titleId}>{h('installTitle')}</h2>
    <p className="ig-lead">{h('installLead')}</p>
    {prompt&&<button type="button" className="btn small ig-now" onClick={install}><Download size={16} aria-hidden="true"/>{h('installNow')}</button>}
    {platform==='android'?android:platform==='ios'?ios:<>{ios}{android}</>}
    <p className="ig-note">{h('installNote')}</p>
   </div>
  </div>,document.body)}
 </div>;
}
