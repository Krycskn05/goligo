import {englishQuestions} from './english-course';
import {englishObjectName} from './english-objects';
import {objectVocabulary} from './object-course';
import {objectMeaning} from './object-translations';
import type {StudyLanguage} from './study-languages';
const normalize=(text:string)=>text.normalize('NFC').replace(/[’‘]/g,"'").trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ').toLowerCase();
const meanings=new Map<string,string>();
for(const question of englishQuestions){
 if(question.answerTr)for(const value of [question.answer,...question.accepted??[]])meanings.set(normalize(value),question.answerTr);
 if(question.audio&&question.audioTr)meanings.set(normalize(question.audio),question.audioTr);
 if(question.passage&&question.passageTr)meanings.set(normalize(question.passage),question.passageTr);
}
meanings.set(normalize('Hello. How are you?'),'Merhaba. Nasılsın?');
const objects=new Map(objectVocabulary.map(word=>[normalize(englishObjectName(word.id)),word.id]));
export function englishMeaning(text:string,language:StudyLanguage):string|undefined{
 if(language==='en')return text;
 const object=objects.get(normalize(text));if(object)return language==='de'?objectVocabulary.find(word=>word.id===object)?.de:objectMeaning(object,language)||undefined;
 return language==='tr'?meanings.get(normalize(text)):undefined;
}
