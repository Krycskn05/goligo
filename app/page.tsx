import StudyApp from './category-study';
import Landing from './landing';
import {getChatGPTUser} from './chatgpt-auth';
import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {publicText} from '@/lib/public-copy';
import {pageLanguage} from './page-language';
export const dynamic = 'force-dynamic';
/** The description in the site language (German unless the visitor chose another). */
export async function generateMetadata():Promise<Metadata>{return {description:publicText(await pageLanguage(),'landingLead',{site:SITE_NAME})};}
/** Giriş yapan üye önce Koko'nun site turunu (karşılama sayfası), giriş yapmamış ziyaretçi tanıtım sayfasını görür. Üniteler /konular adresinde. */
export default async function Home() { return (await getChatGPTUser()) ? <StudyApp page="home" /> : <Landing />; }
