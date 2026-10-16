import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {getRawDb} from '@/db';
import {SITE_NAME} from '@/lib/site-brand';
import {SESSION_COOKIE,readCookie,signInPath} from '@/lib/member-auth';
import {memberById,memberForToken,type Db,type Member} from '@/lib/member-store';
import {getChatGPTUser} from '../chatgpt-auth';
import AccountPanel from '../account-panel';
import {PublicPage} from '../public-shell';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Hesabım · ${SITE_NAME}`,robots:{index:false}};

export default async function AccountPage(){
 const user=await getChatGPTUser();
 if(!user)redirect(signInPath('/hesabim'));
 let member:Member|null=null;let linked=false;let failed=false;
 try{
  const db=getRawDb() as unknown as Db;
  member=await memberForToken(db,readCookie((await headers()).get('cookie'),SESSION_COOKIE));
  if(!member)linked=!!(await memberById(db,user.userId));
 }catch(error){console.error('Hesap bilgisi okunamadı',error);failed=true;}
 if(member){
  const since=new Date(member.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
  return <PublicPage signedIn narrow><AccountPanel name={member.name} email={member.email} since={since}/></PublicPage>;
 }
 // Üyelik oturumu yok ama eski yöntemle (Cloudflare Access ya da yerel deneme girişi) girilmiş.
 return <PublicPage signedIn narrow>
  <section className="lk-auth-card" data-account-legacy>
   <h1>Hesabım</h1>
   {failed?<p className="lk-form-error" role="alert">Hesap bilgilerine şu anda ulaşılamıyor. Biraz sonra yeniden dene.</p>
   :linked?<><p className="lk-auth-lead">Bu kayıtların bir üyelik hesabına bağlı. Hesap ayarları için e-posta adresin ve şifrenle giriş yap.</p><a className="btn" href="/giris?return_to=%2Fhesabim">Giriş yap</a></>
   :<><p className="lk-auth-lead">Siteye eski giriş yöntemiyle girdin. E-posta ve şifreyle üye ol: şimdiye kadarki ilerlemen yeni hesabına geçer.</p><a className="btn" href="/uye-ol?return_to=%2Fhesabim">Üye ol</a></>}
  </section>
 </PublicPage>;
}
