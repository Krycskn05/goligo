import type {Metadata} from 'next';
import A1ExamStudy from '../a1-exam-study';
import {SITE_NAME} from '@/lib/site-brand';
import {examText} from '@/lib/a1-exam-copy';
import {pageLanguage} from '../page-language';
import {getChatGPTUser} from '../chatgpt-auth';
export const dynamic='force-dynamic';
/** Title and description in the site language. */
export async function generateMetadata():Promise<Metadata>{const language=await pageLanguage();return {title:`${examText(language,'title')} · ${SITE_NAME}`,description:examText(language,'lead')};}
/** A1 sınavı: practice exams (Lesen; Hören and Schreiben later). A visitor without an account opens the first exam. */
export default async function A1ExamPage(){return <A1ExamStudy guest={!(await getChatGPTUser())}/>;}
