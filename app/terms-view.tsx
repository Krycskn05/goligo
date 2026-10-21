import type {SiteLanguage} from '@/lib/site-languages';
import {publicText} from '@/lib/public-copy';
import {PublicPage} from './public-shell';
import {LegalDate,legalParts} from './legal-parts';

/** Kullanım koşulları, ziyaretçinin dilinde (lib/legal-copy.ts; Türkçe asıl metindir). */
export function TermsView({language,signedIn}:{language:SiteLanguage;signedIn:boolean}){
 const {text,rich}=legalParts(language);
 return <PublicPage language={language} signedIn={signedIn} narrow>
  <article className="lk-legal">
   <h1>{publicText(language,'termsLink')}</h1>
   <LegalDate language={language}/>
   <p>{rich('termsIntro')}</p>

   <h2>{text('serviceTitle')}</h2>
   <p>{text('serviceText')}</p>

   <h2>{text('yourAccountTitle')}</h2>
   <ul>
    <li>{text('accountEmail')}</li>
    <li>{text('accountPassword')}</li>
    <li>{rich('accountDelete')}</li>
   </ul>

   <h2>{text('dontTitle')}</h2>
   <ul>
    <li>{text('dontOthers')}</li>
    <li>{text('dontHarm')}</li>
    <li>{text('dontCopy')}</li>
   </ul>
   <p>{text('dontClose')}</p>

   <h2>{text('contentTitle')}</h2>
   <p>{rich('contentText')}</p>

   <h2>{text('changesTitle')}</h2>
   <p>{text('termsChanges')}</p>
  </article>
 </PublicPage>;
}
