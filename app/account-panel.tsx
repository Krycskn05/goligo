'use client';
import {useState,type FormEvent,type ReactNode} from 'react';
import {Download,KeyRound,Loader2,LogOut,Trash2,UserRound} from 'lucide-react';

type Props={name:string;email:string;since:string};
type Result={ok?:boolean;error?:string;field?:string;name?:string};

async function send(body:Record<string,unknown>):Promise<{ok:boolean;result:Result}>{
 try{
  const response=await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),credentials:'same-origin'});
  const result=await response.json().catch(()=>({})) as Result;
  if(response.status===401&&result.field!=='current'){window.location.assign('/giris?return_to=%2Fhesabim');return {ok:false,result};}
  return {ok:response.ok&&!!result.ok,result};
 }catch{return {ok:false,result:{error:'Bağlantı kurulamadı. İnternetini kontrol edip yeniden dene.'}};}
}

function Status({error,done}:{error:string;done:string}){
 if(error)return <p className="lk-form-error" role="alert">{error}</p>;
 return done?<p className="lk-form-done" role="status">{done}</p>:null;
}

function Card({icon,title,children}:{icon:ReactNode;title:string;children:ReactNode}){
 return <section className="lk-account-card"><h2>{icon}{title}</h2>{children}</section>;
}

/** Hesabım: ad, şifre, verilerimi indir, çıkış ve hesabı silme. */
export default function AccountPanel({name:initialName,email,since}:Props){
 const [name,setName]=useState(initialName);
 const [busy,setBusy]=useState<string|null>(null);
 const [errors,setErrors]=useState<Record<string,string>>({});const [done,setDone]=useState<Record<string,string>>({});
 async function run(key:string,body:Record<string,unknown>,form:HTMLFormElement|null,success:string,after?:(result:Result)=>void){
  if(busy)return;setBusy(key);setErrors(e=>({...e,[key]:''}));setDone(d=>({...d,[key]:''}));
  const {ok,result}=await send(body);setBusy(null);
  if(!ok){setErrors(e=>({...e,[key]:result.error||'Bir sorun oluştu. Yeniden dene.'}));return;}
  form?.reset();setDone(d=>({...d,[key]:success}));after?.(result);
 }
 const value=(form:HTMLFormElement,field:string)=>String(new FormData(form).get(field)??'');
 function rename(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;void run('name',{action:'profile',name:value(form,'name')},null,'Adın kaydedildi.',result=>{if(result.name)setName(result.name);});}
 function password(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;void run('password',{action:'password',current:value(form,'current'),next:value(form,'next')},form,'Şifren değişti. Diğer cihazlarda yeniden giriş yapman gerekecek.');}
 function remove(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;void run('delete',{action:'delete',current:value(form,'current'),confirm:new FormData(form).get('confirm')==='on'},form,'Hesabın silindi.',()=>window.location.assign('/'));}
 async function logout(){if(busy)return;setBusy('logout');await send({action:'logout'});window.location.assign('/');}
 const spin=(key:string)=>busy===key?<Loader2 className="lk-spin" size={18} aria-hidden="true"/>:null;
 return <div className="lk-account" data-account>
  <header className="lk-account-head">
   <h1>Hesabım</h1>
   <p><strong data-account-name>{name}</strong><span data-account-email>{email}</span><small>{since} tarihinden beri üye</small></p>
   <div className="lk-account-actions"><a className="btn small" href="/">Derslere dön</a><button type="button" className="btn secondary small" onClick={()=>void logout()} disabled={!!busy} data-account-logout>{spin('logout')||<LogOut size={17} aria-hidden="true"/>}Çıkış yap</button></div>
  </header>

  <Card icon={<UserRound size={20} aria-hidden="true"/>} title="Adın">
   <form className="lk-auth-form" onSubmit={rename}>
    <label className="lk-field"><span>Görünen ad</span><input name="name" type="text" autoComplete="name" required maxLength={60} defaultValue={name}/></label>
    <Status error={errors.name??''} done={done.name??''}/>
    <button className="btn secondary small" type="submit" disabled={!!busy}>{spin('name')}Kaydet</button>
   </form>
  </Card>

  <Card icon={<KeyRound size={20} aria-hidden="true"/>} title="Şifreyi değiştir">
   <form className="lk-auth-form" onSubmit={password} data-account-password>
    <label className="lk-field"><span>Şu anki şifren</span><input name="current" type="password" autoComplete="current-password" required maxLength={128}/></label>
    <label className="lk-field"><span>Yeni şifre</span><input name="next" type="password" autoComplete="new-password" required minLength={8} maxLength={128}/><small>En az 8 karakter.</small></label>
    <Status error={errors.password??''} done={done.password??''}/>
    <button className="btn secondary small" type="submit" disabled={!!busy}>{spin('password')}Şifreyi değiştir</button>
   </form>
  </Card>

  <Card icon={<Download size={20} aria-hidden="true"/>} title="Verilerim">
   <p>Hesap bilgilerini ve bütün çalışma kayıtlarını (cevaplar, ilerleme, notlar) bir dosya olarak indirebilirsin.</p>
   <a className="btn secondary small" href="/api/auth?export=1" download="lernkoko-verilerim.json" data-account-export>Verilerimi indir</a>
  </Card>

  <Card icon={<Trash2 size={20} aria-hidden="true"/>} title="Hesabı sil">
   <details className="lk-danger">
    <summary>Hesabımı silmek istiyorum</summary>
    <p>Hesabın ve bütün çalışma kayıtların kalıcı olarak silinir. Bu işlem geri alınamaz.</p>
    <form className="lk-auth-form" onSubmit={remove} data-account-delete>
     <label className="lk-field"><span>Şifren</span><input name="current" type="password" autoComplete="current-password" required maxLength={128}/></label>
     <label className="lk-check"><input name="confirm" type="checkbox" required/><span>Hesabımın ve bütün kayıtlarımın silineceğini anlıyorum.</span></label>
     <Status error={errors.delete??''} done={done.delete??''}/>
     <button className="btn lk-danger-button small" type="submit" disabled={!!busy}>{spin('delete')}Hesabımı kalıcı olarak sil</button>
    </form>
   </details>
  </Card>
 </div>;
}
