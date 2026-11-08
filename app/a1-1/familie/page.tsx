import FamilieStudy from '../../familie-study';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Familie · Lektion 4 · A1.1 · '+SITE_NAME,description:'Lektion 4 „Familie“, Teil A–D: die Familie und der Plural, Familienstand, haben, Akkusativ (einen / keinen), Possessivartikel, Das ist privat, das Elfchen, der Kursraum, Verben; Wörter, Themen, Übungen, Tests und „Alles klar?“.'};
/** Lektion 4 (members; the page asks a visitor to sign in like every unit after Lektion 1). */
export default async function FamiliePage(){return <FamilieStudy guest={!(await getChatGPTUser())}/>;}
