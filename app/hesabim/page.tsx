import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {getRawDb} from '@/db';
import {SITE_NAME} from '@/lib/site-brand';
import {SESSION_COOKIE,readCookie,signInPath} from '@/lib/member-auth';
import {memberById,memberForToken,type Db,type Member} from '@/lib/member-store';
import {isAdminEmail} from '@/lib/admin-access';
import {publicText,type PublicCopyKey} from '@/lib/public-copy';
import {accountTexts} from '@/lib/auth-texts';
import {pageLanguage} from '../page-language';
import {longDate} from '../legal';
import {getChatGPTUser} from '../chatgpt-auth';
import AccountPanel from '../account-panel';
import {PublicPage} from '../public-shell';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{return {title:`${publicText(await pageLanguage(),'myAccount')} · ${SITE_NAME}`,robots:{index:false}};}

export default async function AccountPage(){
 const user=await getChatGPTUser();
 if(!user)redirect(signInPath('/hesabim'));
 const language=await pageLanguage();const p=(key:PublicCopyKey)=>publicText(language,key);
 let member:Member|null=null;let linked=false;let failed=false;
 try{
  const db=getRawDb() as unknown as Db;
  member=await memberForToken(db,readCookie((await headers()).get('cookie'),SESSION_COOKIE));
  if(!member)linked=!!(await memberById(db,user.userId));
 }catch(error){console.error('Hesap bilgisi okunamadı',error);failed=true;}
 if(member){
  const since=longDate(new Date(member.created_at),language);
  // Only the site owner (lib/admin-access.ts ADMIN_EMAILS) sees the way to the admin panel.
  return <PublicPage language={language} signedIn narrow><AccountPanel name={member.name} email={member.email} since={since} texts={accountTexts(language)}/>{isAdminEmail(member.email)&&<p className="adm-entry"><a className="btn" href="/yonetim">{p('adminPanel')}</a></p>}</PublicPage>;
 }
 // Üyelik oturumu yok ama eski yöntemle (Cloudflare Access ya da yerel deneme girişi) girilmiş.
 return <PublicPage language={language} signedIn narrow>
  <section className="lk-auth-card" data-account-legacy>
   <h1>{p('myAccount')}</h1>
   {failed?<p className="lk-form-error" role="alert">{p('accountUnavailable')}</p>
   :linked?<><p className="lk-auth-lead">{p('legacyLinked')}</p><a className="btn" href="/giris?return_to=%2Fhesabim">{p('signIn')}</a></>
   :<><p className="lk-auth-lead">{p('legacyOld')}</p><a className="btn" href="/uye-ol?return_to=%2Fhesabim">{p('register')}</a></>}
  </section>
 </PublicPage>;
}
