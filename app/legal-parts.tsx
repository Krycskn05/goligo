import type {ReactNode} from 'react';
import {legalText,type LegalCopyKey} from '@/lib/legal-copy';
import {publicText} from '@/lib/public-copy';
import {SITE_NAME} from '@/lib/site-brand';
import type {SiteLanguage} from '@/lib/site-languages';
import {Contact,legalDate} from './legal';
import {richText} from './rich-text';

/** The parts the legal texts use: bold, the links to Hesabım and the privacy notice, the contact and the button names. */
export function legalParts(language:SiteLanguage){
 const parts:Record<string,(inner:string)=>ReactNode>={
  b:inner=><strong>{inner}</strong>,
  account:inner=><a href="/hesabim">{inner}</a>,
  privacy:inner=><a href="/gizlilik">{inner}</a>,
  contact:()=><Contact language={language}/>,
  download:()=>publicText(language,'dataDownload'),
  delete:()=>publicText(language,'deleteCard'),
 };
 const text=(key:LegalCopyKey)=>legalText(language,key,{site:SITE_NAME});
 const rich=(key:LegalCopyKey,extra:Record<string,(inner:string)=>ReactNode>={})=>richText(text(key),{...parts,...extra});
 return {text,rich};
}

/** Last update, and in every language but Turkish (the original) a line saying the text is a translation. */
export function LegalDate({language}:{language:SiteLanguage}){
 const {text}=legalParts(language);
 return <>
  <p className="lk-legal-date">{legalText(language,'updated',{date:legalDate(language)})}</p>
  {language!=='tr'&&<p className="lk-legal-note" data-legal-translation>{text('translationNote')}</p>}
 </>;
}
