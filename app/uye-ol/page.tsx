import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {safeReturnTo} from '@/lib/member-auth';
import {publicText,type PublicCopyKey} from '@/lib/public-copy';
import AuthForm from '../auth-form';
import {authFormTexts} from '@/lib/auth-texts';
import {PublicPage} from '../public-shell';
import {BrandMascot} from '../site-logo';
import {pageLanguage} from '../page-language';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{
 const language=await pageLanguage();
 return {title:`${publicText(language,'register')} · ${SITE_NAME}`,description:publicText(language,'registerDescription',{site:SITE_NAME})};
}
type Search=Promise<Record<string,string|string[]|undefined>>;
export default async function RegisterPage({searchParams}:{searchParams:Search}){
 const query=await searchParams;const returnTo=safeReturnTo(typeof query.return_to==='string'?query.return_to:'/');
 const language=await pageLanguage();const p=(key:PublicCopyKey)=>publicText(language,key);
 const signInHref=returnTo==='/'?'/giris':`/giris?return_to=${encodeURIComponent(returnTo)}`;
 return <PublicPage language={language} narrow>
  <section className="lk-auth-card" aria-labelledby="auth-title">
   <BrandMascot className="lk-auth-mascot"/>
   <h1 id="auth-title">{p('registerFree')}</h1>
   <p className="lk-auth-lead">{p('registerLead')}</p>
   <AuthForm mode="register" returnTo={returnTo} texts={authFormTexts(language)}/>
   <p className="lk-auth-switch">{p('alreadyMemberQ')} <a href={signInHref}>{p('signIn')}</a></p>
  </section>
 </PublicPage>;
}
