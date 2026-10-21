import HousingStudy from '../../housing-study';
import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {housingText} from '@/lib/housing-copy';
import {pageLanguage} from '../../page-language';
export const dynamic='force-dynamic';
/** Title and description in the site language (German unless the learner chose another). */
export async function generateMetadata():Promise<Metadata>{const language=await pageLanguage();return {title:housingText(language,'title')+' · A1.2 · '+SITE_NAME,description:housingText(language,'intro')};}
export default function HousingPage(){return <HousingStudy/>;}
