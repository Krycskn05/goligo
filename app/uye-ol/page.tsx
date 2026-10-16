import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {safeReturnTo} from '@/lib/member-auth';
import AuthForm from '../auth-form';
import {PublicPage} from '../public-shell';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Üye ol · ${SITE_NAME}`,description:`${SITE_NAME}'ya ücretsiz üye ol: Almanca ve İngilizce kelimeleri, fiilleri ve konuları çalış, ilerlemen kaydedilsin.`};
type Search=Promise<Record<string,string|string[]|undefined>>;
export default async function RegisterPage({searchParams}:{searchParams:Search}){
 const query=await searchParams;const returnTo=safeReturnTo(typeof query.return_to==='string'?query.return_to:'/');
 const signInHref=returnTo==='/'?'/giris':`/giris?return_to=${encodeURIComponent(returnTo)}`;
 return <PublicPage narrow>
  <section className="lk-auth-card" aria-labelledby="auth-title">
   <h1 id="auth-title">Ücretsiz üye ol</h1>
   <p className="lk-auth-lead">Bütün dersler üyelere açık. İlerlemen hesabına kaydedilir.</p>
   <AuthForm mode="register" returnTo={returnTo}/>
   <p className="lk-auth-switch">Zaten üye misin? <a href={signInHref}>Giriş yap</a></p>
  </section>
 </PublicPage>;
}
