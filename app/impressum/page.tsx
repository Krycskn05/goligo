import type {Metadata} from 'next';
import {IMPRESSUM,SITE_NAME} from '@/lib/site-brand';
import {legalText} from '@/lib/legal-copy';
import {getChatGPTUser} from '../chatgpt-auth';
import {pageLanguage} from '../page-language';
import {PublicPage} from '../public-shell';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{return {title:`Impressum · ${SITE_NAME}`};}

/**
 * The legal notice (§ 5 DDG; the learner asked, 22 October 2026). It is in German in every site language, with a
 * short note in the page's language; the details are in lib/site-brand.ts (IMPRESSUM).
 */
export default async function ImpressumPage(){
 const language=await pageLanguage();const signedIn=!!(await getChatGPTUser());
 return <PublicPage language={language} signedIn={signedIn} narrow>
  <article className="lk-legal" data-impressum>
   {language!=='de'&&<p className="lk-legal-note" lang={language}>{legalText(language,'impressumNote')}</p>}
   <div lang="de" dir="ltr">
    <h1>Impressum</h1>
    <h2>Angaben gemäß § 5 DDG</h2>
    <p>{IMPRESSUM.name}{IMPRESSUM.address.map(line=><span key={line}><br/>{line}</span>)}</p>
    <h2>Kontakt</h2>
    <p>E-Mail: <a href={`mailto:${IMPRESSUM.email}`}>{IMPRESSUM.email}</a></p>
    <h2>Verantwortlich für den Inhalt</h2>
    <p>{IMPRESSUM.name}</p>
   </div>
  </article>
 </PublicPage>;
}
