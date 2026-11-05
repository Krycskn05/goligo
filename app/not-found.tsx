import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {publicText,type PublicCopyKey} from '@/lib/public-copy';
import {PublicPage} from './public-shell';
import {BrandMascot} from './site-logo';
import {pageLanguage} from './page-language';
import {getChatGPTUser} from './chatgpt-auth';

export async function generateMetadata():Promise<Metadata>{
 const language=await pageLanguage();
 return {title:`${publicText(language,'notFoundTitle')} · ${SITE_NAME}`,robots:{index:false,follow:false}};
}

/**
 * An address with no page behind it, in the visitor's language with the way home (site check, 5 November 2026: a member
 * who opened a wrong link saw "This page could not be found." in English, in every language). Visitors without an
 * account are sent to sign in first by the gate (lib/site-gate.ts), so they meet it after signing in.
 */
export default async function NotFound(){
 const language=await pageLanguage();const p=(key:PublicCopyKey)=>publicText(language,key);
 const signedIn=!!(await getChatGPTUser());
 return <PublicPage language={language} signedIn={signedIn} narrow>
  <section className="lk-auth-card" aria-labelledby="not-found-title" data-not-found>
   <BrandMascot className="lk-auth-mascot"/>
   <h1 id="not-found-title">{p('notFoundTitle')}</h1>
   <p className="lk-auth-lead">{p('notFoundText')}</p>
   <a className="btn lk-submit" href="/">{p('notFoundHome')}</a>
  </section>
 </PublicPage>;
}
