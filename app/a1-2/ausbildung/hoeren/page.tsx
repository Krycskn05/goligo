import AusbildungHoeren from '../../../ausbildung-hoeren';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Hören · Lektion 12 · A1.2 · '+SITE_NAME,description:'Lektion 12 „Ausbildung": Hörübungen in 14 Teilen, mit den Stimmen der Seite vorgelesen.'};
/** Visitors without an account get the guest taste (the sections of Teil A). */
export default async function AusbildungHoerenPage(){return <AusbildungHoeren guest={!(await getChatGPTUser())}/>;}
