import AusbildungStudy from '../../ausbildung-study';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Ausbildung · Lektion 12 · A1.2 · '+SITE_NAME,description:'Lektion 12 „Ausbildung": können/wollen, Perfekt mit sein, seit/vor/in, Bewerbung; Teil A–D, Richtig schreiben, Alles klar?, Prüfungstraining und Magazin.'};
/** Visitors without an account get the guest taste (Teil A). */
export default async function AusbildungPage(){return <AusbildungStudy guest={!(await getChatGPTUser())}/>;}
