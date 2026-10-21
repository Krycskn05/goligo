'use client';
import {useState,type FormEvent} from 'react';
import {Loader2} from 'lucide-react';
import {authMessage} from '@/lib/copy-fill';
import type {ForgotFormTexts} from '@/lib/auth-texts';
import type {SiteLanguage} from '@/lib/site-languages';

/**
 * "Şifremi unuttum" on the sign in page: the learner writes the email address and gets a one-time link (1 hour) by
 * email, in the page's language (app/api/auth, action "forgot"). The answer is the same whether the address has an
 * account or not.
 */
export default function ForgotForm({language,texts}:{language:SiteLanguage;texts:ForgotFormTexts}){
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [sent,setSent]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;
  const email=String(new FormData(event.currentTarget).get('email')??'');
  setBusy(true);setError('');setSent(false);
  try{
   const response=await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'forgot',email,language}),credentials:'same-origin'});
   const result=await response.json().catch(()=>({})) as {ok?:boolean;code?:string;n?:number};
   if(response.ok&&result.ok)setSent(true);else setError(authMessage(texts,result,texts.genericError));
  }catch{setError(texts.offline);}
  setBusy(false);
 }
 return <form className="lk-auth-form lk-forgot-form" onSubmit={submit} noValidate data-forgot-form>
  <p className="lk-forgot-lead">{texts.forgotLead}</p>
  <label className="lk-field"><span>{texts.emailLabel}</span><input name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} aria-invalid={!!error||undefined} aria-describedby={error?'forgot-error':undefined}/></label>
  {error&&<p id="forgot-error" className="lk-form-error" role="alert">{error}</p>}
  {sent&&<p className="lk-form-done" role="status" data-forgot-sent>{texts.forgotSent}</p>}
  <button className="btn secondary lk-submit" type="submit" disabled={busy}>{busy&&<Loader2 className="lk-spin" size={18} aria-hidden="true"/>}{texts.sendLink}</button>
 </form>;
}
