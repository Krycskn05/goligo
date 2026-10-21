import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {safeReturnTo} from '@/lib/member-auth';
import {publicText,type PublicCopyKey} from '@/lib/public-copy';
import AuthForm from '../auth-form';
import ForgotForm from '../forgot-form';
import {authFormTexts,forgotFormTexts} from '@/lib/auth-texts';
import {PublicPage} from '../public-shell';
import {BrandMascot} from '../site-logo';
import {pageLanguage} from '../page-language';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{
 const language=await pageLanguage();
 return {title:`${publicText(language,'signIn')} · ${SITE_NAME}`,description:publicText(language,'signInDescription',{site:SITE_NAME})};
}
type Search=Promise<Record<string,string|string[]|undefined>>;
export default async function SignInPage({searchParams}:{searchParams:Search}){
 const query=await searchParams;const returnTo=safeReturnTo(typeof query.return_to==='string'?query.return_to:'/');
 const language=await pageLanguage();const p=(key:PublicCopyKey)=>publicText(language,key);
 const registerHref=returnTo==='/'?'/uye-ol':`/uye-ol?return_to=${encodeURIComponent(returnTo)}`;
 return <PublicPage language={language} narrow>
  <section className="lk-auth-card" aria-labelledby="auth-title">
   <BrandMascot className="lk-auth-mascot"/>
   <h1 id="auth-title">{p('signIn')}</h1>
   <p className="lk-auth-lead">{returnTo==='/'?p('signInLead'):p('signInLeadPage')}</p>
   <AuthForm mode="login" returnTo={returnTo} texts={authFormTexts(language)}/>
   <p className="lk-auth-switch">{p('noAccount')} <a href={registerHref}>{p('registerFree')}</a></p>
   <details className="lk-forgot" data-forgot><summary>{p('forgot')}</summary><ForgotForm language={language} texts={forgotFormTexts(language)}/></details>
  </section>
 </PublicPage>;
}
