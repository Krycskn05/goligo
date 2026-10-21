import {headers} from 'next/headers';
import {requestLanguage} from '@/lib/device-language';
import {loadLanguagePack,type SiteLanguage} from '@/lib/site-languages';

/**
 * The language of a page the server writes (introduction, sign in, sign up, Hesabım, the legal pages): the language the
 * visitor chose on the site (cookie), otherwise German (lib/device-language.ts). Its language pack is loaded before the
 * page is written.
 */
export async function pageLanguage():Promise<SiteLanguage>{
 const list=await headers();
 const language=requestLanguage(list.get('cookie'));
 await loadLanguagePack(language);
 return language;
}
