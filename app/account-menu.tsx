'use client';
import {useEffect,useId,useRef,useState,type ReactNode} from 'react';
import {Compass,Download,KeyRound,Loader2,LogIn,LogOut,UserPlus,UserRound} from 'lucide-react';
import {accountLabel,accountMenuCopy,type AccountMenuKey} from '@/lib/header-copy';
import {guestText} from '@/lib/guest-copy';
import type {VaultLanguage} from '@/lib/object-vault-copy';
import {pickText} from '@/lib/site-languages';
import {effectsText} from '@/lib/effects-copy';
import {TopIcon} from './top-icons';
import {OPEN_EFFECTS} from './learning-effects';

type Item={key:string;icon:ReactNode;label:string;href?:string;download?:string;onClick?:()=>void};

/**
 * The account button in the header (the learner asked, 22 October 2026: not pink but the colour of the sound button, and
 * a tap opens the parts underneath, one after another). A member gets Hesabım, the password, the site tour, the data
 * download and signing out; a visitor without an account (the guest taste) gets sign in and the free sign-up, both coming
 * back to this page. A tap outside or Escape closes it. On phones the menu starts with the site language and the sounds
 * and animations (the learner asked, 4 November 2026: out of the header, so the clock and the day have room in the
 * middle); on bigger screens those two keep their own header buttons and these lines stay hidden (koko-theme.css).
 */
export function AccountMenu({language,guest=false,languages,onLanguage,languageLabel=''}:{language:VaultLanguage;guest?:boolean;languages?:readonly {id:string;label:string}[];onLanguage?:(id:string)=>void;languageLabel?:string}){
 const [open,setOpen]=useState(false);const [busy,setBusy]=useState(false);const [back,setBack]=useState('/');
 // The list is placed on the screen under the button (fixed), because the header cuts off what reaches outside it.
 const [place,setPlace]=useState<{top:number;side:number;rtl:boolean}|null>(null);
 const root=useRef<HTMLDivElement>(null);const button=useRef<HTMLButtonElement>(null);const listId=useId();
 const account=pickText(accountLabel,language);
 const t=(key:AccountMenuKey)=>pickText(accountMenuCopy[key],language);
 function measure(){
  const box=button.current?.getBoundingClientRect();if(!box)return;
  const rtl=getComputedStyle(button.current as Element).direction==='rtl';
  setPlace({top:Math.round(box.bottom+10),side:Math.max(8,Math.round(rtl?box.left:document.documentElement.clientWidth-box.right)),rtl});
 }
 function toggle(){if(!open)measure();setOpen(value=>!value);}
 useEffect(()=>{
  if(!open)return;
  setBack(window.location.pathname+window.location.search);
  const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);button.current?.focus();}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);
  window.addEventListener('resize',measure);window.addEventListener('scroll',measure,{passive:true,capture:true});
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,{capture:true});};
 },[open]);
 async function signOut(){
  if(busy)return;setBusy(true);
  try{await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'logout'}),credentials:'same-origin'});}catch{}
  window.location.assign('/');
 }
 const items:Item[]=guest?[
  {key:'sign-in',icon:<LogIn size={19} aria-hidden="true"/>,label:guestText(language,'guestSignIn'),href:'/giris?return_to='+encodeURIComponent(back)},
  {key:'sign-up',icon:<UserPlus size={19} aria-hidden="true"/>,label:guestText(language,'guestSignUp'),href:'/uye-ol?return_to='+encodeURIComponent(back)},
 ]:[
  {key:'account',icon:<UserRound size={19} aria-hidden="true"/>,label:account,href:'/hesabim'},
  {key:'password',icon:<KeyRound size={19} aria-hidden="true"/>,label:t('changePassword'),href:'/hesabim#sifre'},
  {key:'tour',icon:<Compass size={19} aria-hidden="true"/>,label:t('tour'),href:'/?tur=1'},
  {key:'data',icon:<Download size={19} aria-hidden="true"/>,label:t('data'),href:'/api/auth?export=1',download:'goliqo-verilerim.json'},
  {key:'sign-out',icon:busy?<Loader2 className="lk-spin" size={19} aria-hidden="true"/>:<LogOut size={19} aria-hidden="true"/>,label:t('signOut'),onClick:()=>void signOut()},
 ];
 return <div className={'site-account-menu'+(open?' open':'')} ref={root} data-account-menu>
  <button ref={button} type="button" className="site-home site-account" aria-label={account} title={account} aria-expanded={open} aria-controls={listId} onClick={toggle} data-guest-account={guest||undefined}><TopIcon name="account" size={30}/></button>
  <ul id={listId} className="site-account-list" hidden={!open||!place} style={place?{top:place.top,[place.rtl?'left':'right']:place.side}:undefined} aria-label={account} data-account-list>
   {languages&&onLanguage&&<li className="site-account-phone" data-account-item="language"><label className="site-account-language"><span className="site-account-icon"><TopIcon name="language" size={24}/></span><span>{languageLabel}: <b>{languages.find(item=>item.id===language)?.label??language.toUpperCase()}</b></span><select value={language} aria-label={languageLabel} onChange={event=>{setOpen(false);onLanguage(event.target.value);}}>{languages.map(item=><option key={item.id} value={item.id} lang={item.id}>{item.label}</option>)}</select></label></li>}
   <li className="site-account-phone" data-account-item="sounds"><button type="button" onClick={()=>{setOpen(false);window.dispatchEvent(new Event(OPEN_EFFECTS));}}><span className="site-account-icon"><TopIcon name="sounds" size={24}/></span><span>{effectsText(language,'settings')}</span></button></li>
   {items.map((item,index)=><li key={item.key} style={{animationDelay:index*55+'ms'}} data-account-item={item.key}>
    {item.href
     ?<a href={item.href} download={item.download} onClick={()=>setOpen(false)}><span className="site-account-icon">{item.icon}</span><span>{item.label}</span></a>
     :<button type="button" onClick={item.onClick} disabled={busy}><span className="site-account-icon">{item.icon}</span><span>{item.label}</span></button>}
   </li>)}
  </ul>
 </div>;
}
