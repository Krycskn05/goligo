import OrteStudy from '../../orte-study';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Orte und Dinge · Lektion 3 · A1.1 · '+SITE_NAME,description:'Lektion 3 „Orte und Dinge“, Teil A–D: Dinge benennen, ein / eine, kein / keine, der / das / die, er / es / sie, Zahlen bis 1000, Kleinanzeigen und Telefon, der Arbeitsplatz; Wörter, Themen, Übungen, Tests und „Alles klar?“.'};
/** Lektion 3 (members; the page asks a visitor to sign in like every unit after Lektion 1). */
export default async function OrtePage(){return <OrteStudy guest={!(await getChatGPTUser())}/>;}
