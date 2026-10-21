import type {Metadata} from 'next';
import {SITE_CONTACT_EMAIL,SITE_NAME} from '@/lib/site-brand';
import {safeReturnTo} from '@/lib/member-auth';
import AuthForm from '../auth-form';
import {PublicPage} from '../public-shell';
import {BrandMascot} from '../site-logo';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:`Giriş yap · ${SITE_NAME}`,description:`${SITE_NAME} hesabına e-posta adresin ve şifrenle giriş yap.`};
type Search=Promise<Record<string,string|string[]|undefined>>;
export default async function SignInPage({searchParams}:{searchParams:Search}){
 const query=await searchParams;const returnTo=safeReturnTo(typeof query.return_to==='string'?query.return_to:'/');
 const registerHref=returnTo==='/'?'/uye-ol':`/uye-ol?return_to=${encodeURIComponent(returnTo)}`;
 return <PublicPage narrow>
  <section className="lk-auth-card" aria-labelledby="auth-title">
   <BrandMascot className="lk-auth-mascot"/>
   <h1 id="auth-title">Giriş yap</h1>
   <p className="lk-auth-lead">{returnTo==='/'?'Kaldığın yerden devam etmek için giriş yap.':'Bu sayfayı açmak için giriş yap.'}</p>
   <AuthForm mode="login" returnTo={returnTo}/>
   <p className="lk-auth-switch">Hesabın yok mu? <a href={registerHref}>Ücretsiz üye ol</a></p>
   <details className="lk-forgot"><summary>Şifremi unuttum</summary><p>Şifre sıfırlama henüz yok.{SITE_CONTACT_EMAIL?<> Hesabına giremiyorsan <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a> adresine yaz.</>:' Şifreni güvenli bir yerde (örneğin şifre yöneticisinde) sakla.'}</p></details>
  </section>
 </PublicPage>;
}
