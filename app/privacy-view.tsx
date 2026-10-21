import type {SiteLanguage} from '@/lib/site-languages';
import {LANGUAGE_COOKIE} from '@/lib/device-language';
import {PublicPage} from './public-shell';
import {LegalDate,legalParts} from './legal-parts';

/** Gizlilik metni, ziyaretçinin dilinde (lib/legal-copy.ts; Türkçe asıl metindir). */
export function PrivacyView({language,signedIn}:{language:SiteLanguage;signedIn:boolean}){
 const {text,rich}=legalParts(language);
 return <PublicPage language={language} signedIn={signedIn} narrow>
  <article className="lk-legal">
   <h1>{text('privacyTitle')}</h1>
   <LegalDate language={language}/>
   <p>{text('privacyIntro')}</p>

   <h2>{text('whatTitle')}</h2>
   <ul>
    <li>{rich('whatAccount')}</li>
    <li>{rich('whatSignins')}</li>
    <li>{rich('whatPassword')}</li>
    <li>{rich('whatReset')}</li>
    <li>{rich('whatStudy')}</li>
    <li>{rich('whatCookie',{code:()=><code>lk_session</code>})}</li>
    <li>{rich('whatLanguageCookie',{code:()=><code>{LANGUAGE_COOKIE}</code>})}</li>
    <li>{rich('whatDeviceLanguage')}</li>
    <li>{rich('whatLimit')}</li>
    <li>{rich('whatBrowser')}</li>
   </ul>

   <h2>{text('whyTitle')}</h2>
   <p>{text('whyText')}</p>
   <p>{text('whyAdmin')}</p>

   <h2>{text('whereTitle')}</h2>
   <p>{rich('whereText')}</p>

   <h2>{text('howLongTitle')}</h2>
   <p>{text('howLongText')}</p>

   <h2>{text('rightsTitle')}</h2>
   <ul>
    <li>{rich('rightsSee')}</li>
    <li>{rich('rightsFix')}</li>
    <li>{rich('rightsDelete')}</li>
    <li>{rich('rightsOther')}</li>
   </ul>

   <h2>{text('childrenTitle')}</h2>
   <p>{text('childrenText')}</p>

   <h2>{text('changesTitle')}</h2>
   <p>{text('privacyChanges')}</p>
  </article>
 </PublicPage>;
}
