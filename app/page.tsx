import StudyApp from './category-study';
import Landing from './landing';
import {getChatGPTUser} from './chatgpt-auth';
export const dynamic = 'force-dynamic';
/** Giriş yapan üye dersleri, giriş yapmamış ziyaretçi tanıtım sayfasını görür. */
export default async function Home() { return (await getChatGPTUser()) ? <StudyApp /> : <Landing />; }
