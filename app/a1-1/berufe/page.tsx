import BerufeStudy from '../../berufe-study';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Berufe · Lektion 2A · A1.1 · '+SITE_NAME,description:'Lektion 2 „Berufe“, Teil A – Ich bin Koch.: Was sind Sie von Beruf?, Berufe für Männer und Frauen (-in), Ich arbeite als / bei …, nicht; 8 Schritte, 7 Übungen und ein Test.'};
/** Lektion 2A, like Lektion 1A and 15A: visitors without an account can work through all of it (a sign-up invitation stays on the page). */
export default async function BerufePage(){return <BerufeStudy guest={!(await getChatGPTUser())}/>;}
