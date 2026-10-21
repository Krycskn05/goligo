'use client';
import {useState,type FormEvent} from 'react';
import {Eye,EyeOff,Loader2} from 'lucide-react';
import {authMessage} from '@/lib/copy-fill';
import type {ResetFormTexts} from '@/lib/auth-texts';

/** The new password, on the page of the emailed link (app/sifre-yenile). After saving the learner is signed in. */
export default function ResetForm({token,texts}:{token:string;texts:ResetFormTexts}){
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [show,setShow]=useState(false);const [dead,setDead]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;
  const password=String(new FormData(event.currentTarget).get('password')??'');
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'reset',token,password}),credentials:'same-origin'});
   const result=await response.json().catch(()=>({})) as {ok?:boolean;code?:string;n?:number;returnTo?:string};
   if(response.ok&&result.ok){window.location.assign(result.returnTo||'/');return;}
   setError(authMessage(texts,result,texts.genericError));setDead(result.code==='errResetLink');
  }catch{setError(texts.offline);}
  setBusy(false);
 }
 return <form className="lk-auth-form" onSubmit={submit} noValidate data-reset-form>
  <div className="lk-field">
   <label htmlFor="reset-password">{texts.newPassword}</label>
   <div className="lk-password">
    <input id="reset-password" name="password" type={show?'text':'password'} autoComplete="new-password" required minLength={8} maxLength={128} disabled={dead} aria-invalid={!!error||undefined} aria-describedby={[error?'reset-error':'','reset-help'].filter(Boolean).join(' ')}/>
    <button type="button" className="lk-password-toggle" onClick={()=>setShow(value=>!value)} aria-label={show?texts.hidePassword:texts.showPassword} aria-pressed={show}>{show?<EyeOff size={19} aria-hidden="true"/>:<Eye size={19} aria-hidden="true"/>}</button>
   </div>
   <small id="reset-help">{texts.passwordHelp}</small>
  </div>
  {error&&<p id="reset-error" className="lk-form-error" role="alert">{error}</p>}
  <button className="btn lk-submit" type="submit" disabled={busy||dead}>{busy&&<Loader2 className="lk-spin" size={18} aria-hidden="true"/>}{texts.resetSave}</button>
 </form>;
}
