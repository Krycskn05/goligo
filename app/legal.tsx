import {SITE_CONTACT_EMAIL} from '@/lib/site-brand';
import {legalText} from '@/lib/legal-copy';
import {languageLocale,type SiteLanguage} from '@/lib/site-languages';
/** Gizlilik metni ve kullanım koşullarının son güncelleme tarihi (dil çerezi eklendi). */
export const LEGAL_UPDATED='2026-10-22';
/** A date with its month name in the page's language ("21 Ekim 2026", "21. Oktober 2026" …); 21.10.2026 where the
 * browser or server has no month names for the language. */
export function longDate(date:Date,language:SiteLanguage){
 const locale=languageLocale(language);
 try{if(Intl.DateTimeFormat.supportedLocalesOf([locale]).length)return date.toLocaleDateString(locale,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});}catch{}
 return date.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'});
}
export const legalDate=(language:SiteLanguage)=>longDate(new Date(LEGAL_UPDATED+'T12:00:00Z'),language);
/** İletişim adresi (lib/site-brand.ts); henüz yoksa bunu açıkça söyler. */
export function Contact({language}:{language:SiteLanguage}){
 return SITE_CONTACT_EMAIL?<a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>:<>{legalText(language,'contactSoon')}</>;
}
