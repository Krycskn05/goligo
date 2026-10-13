import {objectTopics,objectWords,objectQuestions,type ObjectCrop,type SceneKey} from './object-course';
import {levelTopics} from './level-course';
import {englishQuestions,englishTopics} from './english-course';
import {housingQuestions,housingTopics} from './housing-course';

// Only the requested Wohnen chapter adds textbook exercises; other units stay catalogue-only.
export const topics=[...objectTopics,...levelTopics,...housingTopics];
export const words=objectWords;
export const alphabet=[['A','a'],['B','be'],['C','tse'],['D','de'],['E','e'],['F','ef'],['G','ge'],['H','ha'],['I','i'],['J','jot'],['K','ka'],['L','el'],['M','em'],['N','en'],['O','o'],['P','pe'],['Q','ku'],['R','er'],['S','es'],['T','te'],['U','u'],['V','fau'],['W','we'],['X','iks'],['Y','Ypsilon'],['Z','zett'],['Ä','a-Umlaut'],['Ö','o-Umlaut'],['Ü','u-Umlaut'],['ß','Eszett']];
export type Question={id:string;topic:string;kind:'choice'|'listen'|'read'|'write';prompt:string;promptEn?:string;gap?:string;articlePuzzle?:{variant:'plural';noun:string;fullAnswer:string};writingTask?:'word'|'gap'|'sentence';answer:string;options?:string[];explanation:string;explanationEn?:string;audio?:string;passage?:string;accepted?:string[];strictCase?:boolean;practice?:'dictation'|'sentence'|'visual';scene?:string;wordBank?:string[];answerTr?:string;optionTranslations?:Record<string,string>;objectId?:string;pictureOptions?:string[];passageTr?:string;audioTr?:string;sceneFind?:{key:SceneKey;target:string};image?:{src:string;alt:string;caption:string;crop?:ObjectCrop}};
export const questions:Question[]=[...objectQuestions,...housingQuestions];
export const learningTopics=[...topics,...englishTopics];
export const questionMap=new Map([...questions,...englishQuestions].map(q=>[q.id,q]));
export const modeLabels:Record<string,string>={mixed:'Karma tekrar',test:'Test',choice:'Test',listen:'Hören · Dinleme',read:'Lesen · Okuma',write:'Yazarak Pekiştir · Schreiben',dictation:'Diktat',sentence:'Günlük cümle kurma',visual:'Görselli test',review:'Yanlışları tekrar et'};
export function normalizeAnswer(value:string,strictCase=false){
 let s=value.normalize('NFC').replace(/[’‘]/g,"'").trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
 if(!strictCase)s=s.toLocaleLowerCase('de-DE');
 return s;
}
export function gradeAnswer(q:Question,answer:string){
 // Single punctuation choices must stay exact; stripping punctuation would merge ? and . .
 if(q.options)return answer===q.answer;
 return [q.answer,...(q.accepted??[])].some(a=>normalizeAnswer(a,!!q.strictCase)===normalizeAnswer(answer,!!q.strictCase));
}
export function shuffle<T>(items:T[]):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
