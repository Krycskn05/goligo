import AlltagStudy from '../../alltag-study';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Alltag und Freizeit · Lektion 5 · A1.1 · '+SITE_NAME,description:'Lektion 5 „Alltag und Freizeit“, Teil A–D: der Tag und die Tageszeiten, gern / nicht gern, Ja-/Nein-Fragen, Freizeit in der Stadt, unregelmäßige Verben (fahren, lesen, sprechen …), die Wochentage, einladen und antworten, ein Interview; Wörter, Themen, Übungen, Tests und „Alles klar?“.'};
/** Lektion 5 (members; the page asks a visitor to sign in like every unit after Lektion 1). */
export default async function AlltagPage(){return <AlltagStudy guest={!(await getChatGPTUser())}/>;}
