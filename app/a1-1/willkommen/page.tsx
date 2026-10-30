import WillkommenStudy from '../../willkommen-study';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Willkommen! · Lektion 1A · A1.1 · '+SITE_NAME,description:'Lektion 1 „Willkommen!“, Teil A – Ich heiße …: Guten Tag, Wie heißen Sie?, Woher kommen Sie?, Länder und „aus“; 9 Schritte, 9 Übungen und ein Test.'};
/** Lektion 1A is the first lesson: visitors without an account can work through all of it (a sign-up invitation stays on the page). */
export default async function WillkommenPage(){return <WillkommenStudy guest={!(await getChatGPTUser())}/>;}
