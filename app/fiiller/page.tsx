import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {verbText} from '@/lib/verb-copy';
import {publicText} from '@/lib/public-copy';
import VerbStudy from '../verb-study';
import {pageLanguage} from '../page-language';
export const dynamic='force-dynamic';
/** Title and description in the site language (German unless the learner chose another). */
export async function generateMetadata():Promise<Metadata>{const language=await pageLanguage();return {title:`${verbText(language,'workshopTitle')} · ${SITE_NAME}`,description:publicText(language,'verbsText')};}
export default function VerbsPage(){return <VerbStudy/>;}
