import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {c} from '@/lib/category-copy';
import {publicText} from '@/lib/public-copy';
import StudyApp from '../category-study';
import {pageLanguage} from '../page-language';
export const dynamic='force-dynamic';
/** Title and description in the site language (German unless the learner chose another). */
export async function generateMetadata():Promise<Metadata>{const language=await pageLanguage();return {title:`${c(language,'catalogTitle')} · ${SITE_NAME}`,description:publicText(language,'unitsText')};}
/** The units catalogue (the home page "/" shows Koko's tour of the site). Members only: the site gate sends visitors to /giris. */
export default function UnitsPage(){return <StudyApp page="units"/>;}
