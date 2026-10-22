import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {verbText} from '@/lib/verb-copy';
import {publicText} from '@/lib/public-copy';
import VerbStudy from '../verb-study';
import {pageLanguage} from '../page-language';
import {getChatGPTUser} from '../chatgpt-auth';
export const dynamic='force-dynamic';
/** Yanlışlarım: a part of the site of its own (the learner asked, 22 October 2026; it used to be /fiiller?bolum=yanlislar). */
export async function generateMetadata():Promise<Metadata>{const language=await pageLanguage();return {title:`${verbText(language,'mistakesTitle')} · ${SITE_NAME}`,description:publicText(language,'verbsText')};}
export default async function MistakesPage(){return <VerbStudy guest={!(await getChatGPTUser())} part="mistakes"/>;}
