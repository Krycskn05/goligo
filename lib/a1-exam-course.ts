import type {A1Exam,AdItem,ExamAnswer,ExamModule,LesenExam,NoticeItem,TrueFalseItem} from './a1-exam-types';
import {lesenExamId} from './a1-exam-build';

/**
 * A1 sınavı (/a1-sinavi): the list of practice exams and how an exam is marked. The exam texts themselves are one file
 * per exam (lib/a1-exam-lesen-01.ts … -10.ts), loaded when the learner opens it. Marking follows the real exam: one
 * point per answer, 15 points in Lesen, each part's points × 1,66 for the certificate (so Lesen gives up to 25 of 100),
 * and 60 % to pass (there the 60 % counts over all parts together; here it is shown for the part the learner solved).
 */
export const A1_EXAM_PATH='/a1-sinavi';
/** The parts of the written exam in the order of the exam paper; `ready` parts have exams. */
export const examModules:readonly {id:ExamModule;number:number;name:string;minutes:number;ready:boolean}[]=[
 {id:'hoeren',number:1,name:'Hören',minutes:20,ready:false},
 {id:'lesen',number:2,name:'Lesen',minutes:25,ready:true},
 {id:'schreiben',number:3,name:'Schreiben',minutes:20,ready:false},
];
export const LESEN_MINUTES=25;
export const LESEN_TOTAL=15;
export const PASS_PERCENT=60;
/** The exam's factor: points of a part × 1,66 (four parts of 15 points make 100). */
export const POINT_FACTOR=1.66;
export const passMark=(total:number)=>Math.ceil(total*PASS_PERCENT/100);
export const examPoints=(right:number)=>Math.round(right*POINT_FACTOR);
export const hasPassed=(right:number,total:number)=>right>=passMark(total);

/** The ten Lesen exams: number, id and what their texts are about (kept here so the list page loads no exam text). */
export const lesenExamList:readonly {number:number;id:string;topics:string}[]=[
 {number:1,id:lesenExamId(1),topics:'Umzug · Ausflug in den Zoo · Möbel und Jobs · Schilder in der Stadt'},
 {number:2,id:lesenExamId(2),topics:'Besuch in Köln · Kein Wasser im Haus · Arbeit und Kurse · Hinweise'},
 {number:3,id:lesenExamId(3),topics:'Dienst tauschen · Prüfungstag · Anzeigen · Ämter und Geschäfte'},
 {number:4,id:lesenExamId(4),topics:'Zettel zu Hause · Geburtstag im Garten · Internetseiten · Schilder'},
 {number:5,id:lesenExamId(5),topics:'Heizung kaputt · Basketball-Training · Wohnen und Service · Zeiten lesen'},
 {number:6,id:lesenExamId(6),topics:'Taxi zum Flughafen · Praxis im Urlaub · Reisen und Kochen · Hinweise'},
 {number:7,id:lesenExamId(7),topics:'Grüße aus dem Urlaub · Teamsitzung · Internetseiten · Unterwegs'},
 {number:8,id:lesenExamId(8),topics:'Kind ist krank · Brief von der Bibliothek · Anzeigen · Zeiten und Orte'},
 {number:9,id:lesenExamId(9),topics:'Mit dem Kurs ins Museum · Paket bei der Nachbarin · Wohnen und Feiern · Regeln'},
 {number:10,id:lesenExamId(10),topics:'Praktikum · Regeln im Haus · Internetseiten · Anmelden und Warten'},
];
export const LESEN_EXAM_COUNT=lesenExamList.length;
/** The exam a visitor without an account may open (the guest taste: the first part of every section). */
export const GUEST_EXAM=1;
export const isExamNumber=(value:number)=>Number.isInteger(value)&&value>=1&&value<=LESEN_EXAM_COUNT;

const loaders:Record<number,()=>Promise<{exam:A1Exam}>>={
 1:()=>import('./a1-exam-lesen-01'),2:()=>import('./a1-exam-lesen-02'),3:()=>import('./a1-exam-lesen-03'),4:()=>import('./a1-exam-lesen-04'),5:()=>import('./a1-exam-lesen-05'),
 6:()=>import('./a1-exam-lesen-06'),7:()=>import('./a1-exam-lesen-07'),8:()=>import('./a1-exam-lesen-08'),9:()=>import('./a1-exam-lesen-09'),10:()=>import('./a1-exam-lesen-10'),
};
/** Loads one exam's texts. */
export function loadLesenExam(number:number):Promise<A1Exam>{
 const load=loaders[number];if(!load)return Promise.reject(new Error('No exam '+number));
 return load().then(module=>module.exam);
}

export type LesenItem=TrueFalseItem|AdItem|NoticeItem;
/** The 15 scored items of a Lesen exam in the order of the paper, with the Teil they belong to. */
export function lesenItems(lesen:LesenExam):{teil:1|2|3;item:LesenItem}[]{
 return [
  ...lesen.teil1.flatMap(text=>text.items.map(item=>({teil:1 as const,item}))),
  ...lesen.teil2.items.map(item=>({teil:2 as const,item})),
  ...lesen.teil3.items.map(item=>({teil:3 as const,item})),
 ];
}
/** The right answers as one string in the order of the paper ("frfrfabaab…"). */
export const lesenKey=(lesen:LesenExam)=>lesenItems(lesen).map(entry=>entry.item.answer).join('');

export type ExamAnswers=Record<string,ExamAnswer>;
export type LesenResult={right:number;total:number;answered:number;byTeil:Record<1|2|3,{right:number;total:number}>;wrong:string[];open:string[]};
/** Marks a Lesen exam: one point per right answer; an item left open counts as wrong. */
export function gradeLesen(lesen:LesenExam,answers:ExamAnswers):LesenResult{
 const result:LesenResult={right:0,total:0,answered:0,byTeil:{1:{right:0,total:0},2:{right:0,total:0},3:{right:0,total:0}},wrong:[],open:[]};
 for(const {teil,item} of lesenItems(lesen)){
  result.total++;result.byTeil[teil].total++;
  const given=answers[item.id];
  if(given===undefined){result.open.push(item.id);continue;}
  result.answered++;
  if(given===item.answer){result.right++;result.byTeil[teil].right++;}else result.wrong.push(item.id);
 }
 return result;
}
