import type {StudyLanguage,Translations} from './study-languages';
import {translate} from './study-languages';
export type LearningLanguage='de'|'en';
export const isLearningLanguage=(value:unknown):value is LearningLanguage=>value==='de'||value==='en';
export function readLearningLanguage(storage:Pick<Storage,'getItem'>,search=''):LearningLanguage{
 const requested=new URLSearchParams(search).get('learn');
 if(isLearningLanguage(requested))return requested;
 const saved=storage.getItem('lernkoko-learning-language');return isLearningLanguage(saved)?saved:'de';
}
// İngilizce kurs şimdilik kapalı: dil seçici gösterilmez ve site her zaman
// Almanca açılır. İngilizce içerik ve kayıtlar silinmez; true yapınca geri gelir.
export const ENGLISH_COURSE_ENABLED=false;
export function activeLearningLanguage(storage:Pick<Storage,'getItem'>,search=''):LearningLanguage{
 return ENGLISH_COURSE_ENABLED?readLearningLanguage(storage,search):'de';
}
export function saveLearningLanguage(storage:Pick<Storage,'setItem'>,value:LearningLanguage){storage.setItem('lernkoko-learning-language',value);}
const copy={
 de:['Almanca Eğitimi','Deutsch lernen','German Course','تعلّم الألمانية','Вивчення німецької','Apprendre l’allemand'],
 en:['İngilizce Eğitimi','Englisch lernen','English Course','تعلّم الإنجليزية','Вивчення англійської','Apprendre l’anglais'],
 select:['Öğrenmek istediğin dil','Sprache zum Lernen','Language to learn','اللغة التي تريد تعلّمها','Мова для вивчення','Langue à apprendre'],
 helper:['Açıklama dili','Sprache der Erklärungen','Explanation language','لغة الشرح','Мова пояснень','Langue des explications'],
} satisfies Record<string,Translations>;
export function learningText(language:StudyLanguage,key:keyof typeof copy){return translate(copy[key],language);}
export const learningLocale=(language:LearningLanguage)=>language==='de'?'de-DE':'en-GB';
export const belongsToLearningLanguage=(id:string,language:LearningLanguage)=>id.startsWith('en-')===(language==='en');
