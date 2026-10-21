'use client';
import {useState,type FormEvent,type ReactNode} from 'react';
import {Compass,Download,KeyRound,Loader2,LogOut,Trash2} from 'lucide-react';
import {TopIcon} from './top-icons';
import {BrandMascot} from './site-logo';
import {authMessage,fillText} from '@/lib/copy-fill';
import type {AccountTexts} from '@/lib/auth-texts';

type Props={name:string;email:string;since:string;texts:AccountTexts};
type Result={ok?:boolean;error?:string;code?:string;n?:number;field?:string;name?:string};

async function send(body:Record<string,unknown>):Promise<{ok:boolean;result:Result;offline?:boolean}>{
 try{
  const response=await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),credentials:'same-origin'});
  const result=await response.json().catch(()=>({})) as Result;
  if(response.status===401&&result.field!=='current'){window.location.assign('/giris?return_to=%2Fhesabim');return {ok:false,result};}
  return {ok:response.ok&&!!result.ok,result};
 }catch{return {ok:false,result:{},offline:true};}
}

function Status({error,done}:{error:string;done:string}){
 if(error)return <p className="lk-form-error" role="alert">{error}</p>;
 return done?<p className="lk-form-done" role="status">{done}</p>:null;
}

function Card({icon,title,id,children}:{icon:ReactNode;title:string;id?:string;children:ReactNode}){
 return <section className="lk-account-card" id={id}><h2>{icon}{title}</h2>{children}</section>;
}

/** Hesabım: ad, şifre, site turu, verilerimi indir, çıkış ve hesabı silme; sayfanın dilinde (`texts` sunucudan gelir). */
export default function AccountPanel({name:initialName,email,since,texts}:Props){
 const [name,setName]=useState(initialName);
 const [busy,setBusy]=useState<string|null>(null);
 const [errors,setErrors]=useState<Record<string,string>>({});const [done,setDone]=useState<Record<string,string>>({});
 async function run(key:string,body:Record<string,unknown>,form:HTMLFormElement|null,success:string,after?:(result:Result)=>void){
  if(busy)return;setBusy(key);setErrors(e=>({...e,[key]:''}));setDone(d=>({...d,[key]:''}));
  const {ok,result,offline}=await send(body);setBusy(null);
  if(!ok){setErrors(e=>({...e,[key]:offline?texts.offline:authMessage(texts,result,texts.genericError)}));return;}
  form?.reset();setDone(d=>({...d,[key]:success}));after?.(result);
 }
 const value=(form:HTMLFormElement,field:string)=>String(new FormData(form).get(field)??'');
 function rename(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;void run('name',{action:'profile',name:value(form,'name')},null,texts.nameSaved,result=>{if(result.name)setName(result.name);});}
 function password(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;void run('password',{action:'password',current:value(form,'current'),next:value(form,'next')},form,texts.passwordChanged);}
 function remove(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;void run('delete',{action:'delete',current:value(form,'current'),confirm:new FormData(form).get('confirm')==='on'},form,texts.deleted,()=>window.location.assign('/'));}
 async function logout(){if(busy)return;setBusy('logout');await send({action:'logout'});window.location.assign('/');}
 const spin=(key:string)=>busy===key?<Loader2 className="lk-spin" size={18} aria-hidden="true"/>:null;
 return <div className="lk-account" data-account>
  <header className="lk-account-head">
   <BrandMascot className="lk-account-mascot"/>
   <h1>{texts.myAccount}</h1>
   <p><strong data-account-name>{name}</strong><span data-account-email>{email}</span><small>{fillText(texts.memberSince,{date:since})}</small></p>
   <div className="lk-account-actions"><a className="btn small" href="/">{texts.backToLessons}</a><button type="button" className="btn secondary small" onClick={()=>void logout()} disabled={!!busy} data-account-logout>{spin('logout')||<LogOut size={17} aria-hidden="true"/>}{texts.signOut}</button></div>
  </header>

  <Card icon={<TopIcon name="account" size={26}/>} title={texts.nameLabel}>
   <form className="lk-auth-form" onSubmit={rename}>
    <label className="lk-field"><span>{texts.displayName}</span><input name="name" type="text" autoComplete="name" required maxLength={60} defaultValue={name}/></label>
    <Status error={errors.name??''} done={done.name??''}/>
    <button className="btn secondary small" type="submit" disabled={!!busy}>{spin('name')}{texts.save}</button>
   </form>
  </Card>

  {/* The header's account menu links here (app/account-menu.tsx: /hesabim#sifre). */}
  <Card icon={<KeyRound size={20} aria-hidden="true"/>} title={texts.changePassword} id="sifre">
   <form className="lk-auth-form" onSubmit={password} data-account-password>
    <label className="lk-field"><span>{texts.currentPassword}</span><input name="current" type="password" autoComplete="current-password" required maxLength={128}/></label>
    <label className="lk-field"><span>{texts.newPassword}</span><input name="next" type="password" autoComplete="new-password" required minLength={8} maxLength={128}/><small>{texts.minChars}</small></label>
    <Status error={errors.password??''} done={done.password??''}/>
    <button className="btn secondary small" type="submit" disabled={!!busy}>{spin('password')}{texts.changePassword}</button>
   </form>
  </Card>

  {/* The welcome tour again: the sounds first, then the header and the menu (app/site-tour.tsx on the home page). */}
  <Card icon={<Compass size={20} aria-hidden="true"/>} title={texts.tourCard}>
   <p>{texts.tourText}</p>
   <a className="btn secondary small" href="/?tur=1" data-account-tour>{texts.tourStart}</a>
  </Card>

  <Card icon={<Download size={20} aria-hidden="true"/>} title={texts.dataCard}>
   <p>{texts.dataText}</p>
   <a className="btn secondary small" href="/api/auth?export=1" download="goliqo-verilerim.json" data-account-export>{texts.dataDownload}</a>
  </Card>

  <Card icon={<Trash2 size={20} aria-hidden="true"/>} title={texts.deleteCard}>
   <details className="lk-danger">
    <summary>{texts.deleteSummary}</summary>
    <p>{texts.deleteWarning}</p>
    <form className="lk-auth-form" onSubmit={remove} data-account-delete>
     <label className="lk-field"><span>{texts.yourPassword}</span><input name="current" type="password" autoComplete="current-password" required maxLength={128}/></label>
     <label className="lk-check"><input name="confirm" type="checkbox" required/><span>{texts.deleteConfirm}</span></label>
     <Status error={errors.delete??''} done={done.delete??''}/>
     <button className="btn lk-danger-button small" type="submit" disabled={!!busy}>{spin('delete')}{texts.deleteButton}</button>
    </form>
   </details>
  </Card>
 </div>;
}
