import StudyApp from './category-study';
import Landing from './landing';
import {getChatGPTUser} from './chatgpt-auth';
export const dynamic = 'force-dynamic';
/** Giriş yapan üye önce Koko'nun site turunu (karşılama sayfası), giriş yapmamış ziyaretçi tanıtım sayfasını görür. Üniteler /konular adresinde. */
export default async function Home() { return (await getChatGPTUser()) ? <StudyApp page="home" /> : <Landing />; }
