import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {validToken} from '@/lib/member-auth';
import {publicText,type PublicCopyKey} from '@/lib/public-copy';
import {resetFormTexts} from '@/lib/auth-texts';
import ResetForm from '../reset-form';
import {PublicPage} from '../public-shell';
import {BrandMascot} from '../site-logo';
import {pageLanguage} from '../page-language';
export const dynamic='force-dynamic';
/** The page of the "Şifremi unuttum" email link: not indexed, and the key in its address goes to no other site. */
export async function generateMetadata():Promise<Metadata>{
 const language=await pageLanguage();
 return {title:`${publicText(language,'resetTitle')} · ${SITE_NAME}`,robots:{index:false,follow:false},referrer:'no-referrer'};
}
type Search=Promise<Record<string,string|string[]|undefined>>;
export default async function ResetPasswordPage({searchParams}:{searchParams:Search}){
 const query=await searchParams;const token=typeof query.anahtar==='string'?query.anahtar:'';
 const language=await pageLanguage();const p=(key:PublicCopyKey)=>publicText(language,key);
 return <PublicPage language={language} narrow>
  <section className="lk-auth-card" aria-labelledby="auth-title" data-reset-page>
   <BrandMascot className="lk-auth-mascot"/>
   <h1 id="auth-title">{p('resetTitle')}</h1>
   {validToken(token)
    ?<><p className="lk-auth-lead">{p('resetLead')}</p><ResetForm token={token} texts={resetFormTexts(language)}/></>
    :<p className="lk-form-error" role="alert">{p('errResetLink')}</p>}
   <p className="lk-auth-switch"><a href="/giris">{p('backToSignIn')}</a></p>
  </section>
 </PublicPage>;
}
