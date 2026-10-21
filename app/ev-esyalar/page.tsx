import type {Metadata} from 'next';
import {SITE_NAME} from '@/lib/site-brand';
import {vaultText} from '@/lib/object-vault-copy';
import {publicText} from '@/lib/public-copy';
import ObjectStudy from '../object-study';
import {pageLanguage} from '../page-language';
export const dynamic='force-dynamic';
/** Title and description in the site language (German unless the learner chose another). */
export async function generateMetadata():Promise<Metadata>{const language=await pageLanguage();return {title:`${vaultText(language,'vaultTitle')} · ${SITE_NAME}`,description:publicText(language,'vaultText')};}
export default function ObjectsPage(){return <ObjectStudy/>;}
