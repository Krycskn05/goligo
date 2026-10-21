'use client';
import {useRef,useState,type FormEvent} from 'react';
import {Eye,EyeOff,Loader2} from 'lucide-react';
import {TOUR_KEY} from '@/lib/site-tour';
import {authMessage} from '@/lib/copy-fill';
import type {AuthFormTexts} from '@/lib/auth-texts';
import {richText} from './rich-text';

type Mode='login'|'register';
type Field='name'|'email'|'password'|'accept';
type Props={mode:Mode;returnTo:string;texts:AuthFormTexts};

/** Üye ol ve giriş yap formu, sayfanın dilinde (`texts` sunucudan gelir). Şifre yalnızca bu siteye (POST /api/auth) gönderilir. */
export default function AuthForm({mode,returnTo,texts}:Props){
 const register=mode==='register';
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [field,setField]=useState<Field|null>(null);const [show,setShow]=useState(false);
 const form=useRef<HTMLFormElement>(null);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;
  const data=new FormData(event.currentTarget);
  const body=register
   ?{action:'register',name:String(data.get('name')??''),email:String(data.get('email')??''),password:String(data.get('password')??''),accept:data.get('accept')==='on',returnTo}
   :{action:'login',email:String(data.get('email')??''),password:String(data.get('password')??''),returnTo};
  setBusy(true);setError('');setField(null);
  try{
   const response=await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),credentials:'same-origin'});
   const result=await response.json().catch(()=>({})) as {ok?:boolean;error?:string;code?:string;n?:number;field?:Field;returnTo?:string};
   // A new member always gets the welcome tour (sounds first), even on a browser that has seen it before.
   if(response.ok&&result.ok){if(register){try{localStorage.removeItem(TOUR_KEY);}catch{}}window.location.assign(result.returnTo||'/');return;}
   setError(authMessage(texts,result,texts.genericError));setField(result.field??null);
   const target=result.field?form.current?.querySelector<HTMLInputElement>(`[name="${result.field}"]`):null;target?.focus();
  }catch{setError(texts.offline);}
  setBusy(false);
 }
 const invalid=(name:Field)=>({'aria-invalid':field===name||undefined,'aria-describedby':field===name?'auth-error':undefined});
 return <form ref={form} className="lk-auth-form" onSubmit={submit} noValidate data-auth-form={mode}>
  {register&&<label className="lk-field"><span>{texts.nameLabel}</span><input name="name" type="text" autoComplete="name" required maxLength={60} {...invalid('name')}/></label>}
  <label className="lk-field"><span>{texts.emailLabel}</span><input name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} {...invalid('email')}/></label>
  <div className="lk-field">
   <label htmlFor="auth-password">{texts.passwordLabel}</label>
   <div className="lk-password">
    <input id="auth-password" name="password" type={show?'text':'password'} autoComplete={register?'new-password':'current-password'} required minLength={register?8:undefined} maxLength={128} aria-invalid={field==='password'||undefined} aria-describedby={[field==='password'?'auth-error':'',register?'password-help':''].filter(Boolean).join(' ')||undefined}/>
    <button type="button" className="lk-password-toggle" onClick={()=>setShow(value=>!value)} aria-label={show?texts.hidePassword:texts.showPassword} aria-pressed={show}>{show?<EyeOff size={19} aria-hidden="true"/>:<Eye size={19} aria-hidden="true"/>}</button>
   </div>
   {register&&<small id="password-help">{texts.passwordHelp}</small>}
  </div>
  {register&&<label className="lk-check"><input name="accept" type="checkbox" required {...invalid('accept')}/><span>{richText(texts.acceptText,{terms:inner=><a href="/kullanim-kosullari" target="_blank" rel="noopener">{inner}</a>,privacy:inner=><a href="/gizlilik" target="_blank" rel="noopener">{inner}</a>})}</span></label>}
  {error&&<p id="auth-error" className="lk-form-error" role="alert">{error}</p>}
  <button className="btn lk-submit" type="submit" disabled={busy}>{busy&&<Loader2 className="lk-spin" size={18} aria-hidden="true"/>}{register?texts.register:texts.signIn}</button>
 </form>;
}
