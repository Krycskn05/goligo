import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {legalText} from '@/lib/legal-copy';
import {getChatGPTUser} from '../chatgpt-auth';
import {pageLanguage} from '../page-language';
import {PrivacyView} from '../privacy-view';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{
 const language=await pageLanguage();
 return {title:`${legalText(language,'privacyTitle')} · ${SITE_NAME}`,description:legalText(language,'privacyDescription',{site:SITE_NAME})};
}

/** Gizlilik metni, ziyaretçinin dilinde (lib/legal-copy.ts; Türkçe asıl metindir). */
export default async function PrivacyPage(){
 const signedIn=!!(await getChatGPTUser());
 return <PrivacyView language={await pageLanguage()} signedIn={signedIn}/>;
}
