import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {c} from '@/lib/category-copy';
import {publicText} from '@/lib/public-copy';
import StudyApp from '../category-study';
import {pageLanguage} from '../page-language';
import {getChatGPTUser} from '../chatgpt-auth';
export const dynamic='force-dynamic';
/** Title and description in the site language (German unless the learner chose another). */
export async function generateMetadata():Promise<Metadata>{const language=await pageLanguage();return {title:`${c(language,'catalogTitle')} · ${SITE_NAME}`,description:publicText(language,'unitsText')};}
/** The units catalogue (the home page "/" shows Koko's tour of the site). Visitors without an account see it too (the guest taste). */
export default async function UnitsPage(){return <StudyApp page="units" guest={!(await getChatGPTUser())}/>;}
