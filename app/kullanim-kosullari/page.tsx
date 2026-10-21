import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {legalText} from '@/lib/legal-copy';
import {publicText} from '@/lib/public-copy';
import {getChatGPTUser} from '../chatgpt-auth';
import {pageLanguage} from '../page-language';
import {TermsView} from '../terms-view';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{
 const language=await pageLanguage();
 return {title:`${publicText(language,'termsLink')} · ${SITE_NAME}`,description:legalText(language,'termsDescription',{site:SITE_NAME})};
}

/** Kullanım koşulları, ziyaretçinin dilinde (lib/legal-copy.ts; Türkçe asıl metindir). */
export default async function TermsPage(){
 const signedIn=!!(await getChatGPTUser());
 return <TermsView language={await pageLanguage()} signedIn={signedIn}/>;
}
