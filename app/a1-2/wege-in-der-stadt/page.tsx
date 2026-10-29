import StadtStudy from '../../stadt-study';
import {SITE_NAME} from '@/lib/site-brand';
import {getChatGPTUser} from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export const metadata={title:'Wege in der Stadt · Lektion 15 · A1.2 · '+SITE_NAME,description:'Lektion 15 „Wege in der Stadt“, Teil A – Gehen Sie die Treppe hoch.: Stockwerke, zum/zur + müssen, Wegbeschreibung, es gibt + Akkusativ, Ach-Laut und Ich-Laut; 10 Schritte, 11 Übungen und ein Test.'};
/** Lektion 15A is the unit's first part: visitors without an account can work through all of it (a sign-up invitation stays on the page). */
export default async function StadtPage(){return <StadtStudy guest={!(await getChatGPTUser())}/>;}
