import type {A1Exam,A1HoerenExam,A1SchreibenExam,AdItem,ExamAnswer,ExamModule,GapItem,HoerenExam,LesenExam,ListenChoiceItem,ListenTrueFalseItem,NoticeItem,SchreibenExam,SpellSheet,TrueFalseItem} from './a1-exam-types';
import {hoerenExamId,lesenExamId,schreibenExamId} from './a1-exam-build';

/**
 * A1 sınavı (/a1-sinavi): the list of practice exams and how an exam is marked. The exam texts themselves are one file
 * per exam and part (lib/a1-exam-lesen-01.ts … -10.ts, lib/a1-exam-hoeren-01.ts … -10.ts, lib/a1-exam-schreiben-01.ts …
 * -10.ts), loaded when the learner opens it. Marking follows the real exam: one point per answer, 15 points in Hören,
 * 15 in Lesen and 15 in Schreiben (5 for the form, 10 for the message), each part's points
 * × 1,66 for the certificate (so a part gives up to 25 of 100), and 60 % to pass (there the 60 % counts over all parts
 * together; here it is shown for the part the learner solved).
 */
export const A1_EXAM_PATH='/a1-sinavi';
/** The parts of the written exam in the order of the exam paper; `ready` parts have exams. */
export const examModules:readonly {id:ExamModule;number:number;name:string;minutes:number;ready:boolean}[]=[
 {id:'hoeren',number:1,name:'Hören',minutes:20,ready:true},
 {id:'lesen',number:2,name:'Lesen',minutes:25,ready:true},
 {id:'schreiben',number:3,name:'Schreiben',minutes:20,ready:true},
];
export const LESEN_MINUTES=25;
export const LESEN_TOTAL=15;
export const HOEREN_MINUTES=20;
export const HOEREN_TOTAL=15;
export const SCHREIBEN_MINUTES=20;
export const SCHREIBEN_TOTAL=15;
/** The parts that have exams (a part of the address: `?sinav=3&bolum=hoeren`); Lesen is the part of an address without one. */
export type ReadyModule='hoeren'|'lesen'|'schreiben';
export const isReadyModule=(value:unknown):value is ReadyModule=>value==='hoeren'||value==='lesen'||value==='schreiben';
export const moduleMinutes:Record<ReadyModule,number>={hoeren:HOEREN_MINUTES,lesen:LESEN_MINUTES,schreiben:SCHREIBEN_MINUTES};
/** The Teile of a part's paper: Hören and Lesen have three, Schreiben two (the form, the message). */
export const moduleTeile:Record<ReadyModule,readonly (1|2|3)[]>={hoeren:[1,2,3],lesen:[1,2,3],schreiben:[1,2]};
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
 {number:7,id:lesenExamId(7),topics:'Grüße aus dem Urlaub · Team-Treffen · Internetseiten · Unterwegs'},
 {number:8,id:lesenExamId(8),topics:'Kind ist krank · Brief von der Bibliothek · Anzeigen · Zeiten und Orte'},
 {number:9,id:lesenExamId(9),topics:'Mit dem Kurs ins Museum · Paket bei der Nachbarin · Wohnen und Feiern · Regeln'},
 {number:10,id:lesenExamId(10),topics:'Praktikum · Regeln im Haus · Internetseiten · Anmelden und Warten'},
];
export const LESEN_EXAM_COUNT=lesenExamList.length;
/** The ten Hören exams (9 November 2026): the same numbers as the Lesen exams — exam 3 is Hören 3 and Lesen 3. */
export const hoerenExamList:readonly {number:number;id:string;topics:string}[]=[
 {number:1,id:hoerenExamId(1),topics:'Einkaufen · Kino · Durchsagen im Bahnhof · Nachrichten am Telefon'},
 {number:2,id:hoerenExamId(2),topics:'Im Café · Unterwegs in der Stadt · Durchsagen · Termine am Telefon'},
 {number:3,id:hoerenExamId(3),topics:'Wohnung und Arbeit · Geburtstag · Durchsagen · Kino und Bibliothek'},
 {number:4,id:hoerenExamId(4),topics:'Auf dem Markt · Am Bahnhof · Durchsagen · Adressen und Preise am Telefon'},
 {number:5,id:hoerenExamId(5),topics:'Im Restaurant · Im Hotel · Durchsagen · Apotheke, Schule und Kochkurs'},
 {number:6,id:hoerenExamId(6),topics:'Im Taxi · Familie und Geschenke · Durchsagen · Kita, Sport und Arbeit'},
 {number:7,id:hoerenExamId(7),topics:'Am Kiosk · Beruf und Freizeit · Durchsagen · Fahrschule, Lieferung, Arbeit'},
 {number:8,id:hoerenExamId(8),topics:'Öffnungszeiten · Wohnen · Beim Arzt · Durchsagen · Arbeit, Training, Amt'},
 {number:9,id:hoerenExamId(9),topics:'Eintritt und Bus · Besuch und Pakete · Durchsagen · Einladung, Umzug, Kurs'},
 {number:10,id:hoerenExamId(10),topics:'Zimmer und Auto · Schule · Durchsagen · Geburtstag, Arbeit, Bahnhof'},
];
/** The ten Schreiben exams (11 November 2026): the same numbers again — exam 3 is Hören 3, Lesen 3 and Schreiben 3. */
export const schreibenExamList:readonly {number:number;id:string;topics:string}[]=[
 {number:1,id:schreibenExamId(1),topics:'Kindergarten-Anmeldung · Einladung an die Nachbarin'},
 {number:2,id:schreibenExamId(2),topics:'Hotel-Reservierung · Arzttermin absagen'},
 {number:3,id:schreibenExamId(3),topics:'Anmeldung im Sportverein · Brief an die Touristeninformation'},
 {number:4,id:schreibenExamId(4),topics:'Bestellung im Möbelhaus · Nachricht an den Vermieter'},
 {number:5,id:schreibenExamId(5),topics:'Formular beim Arzt · Dank für eine Einladung'},
 {number:6,id:schreibenExamId(6),topics:'Fundbüro · Nachricht an den Chef'},
 {number:7,id:schreibenExamId(7),topics:'Bibliotheksausweis · Problem mit einer Bestellung'},
 {number:8,id:schreibenExamId(8),topics:'Wohnungssuche · Nachricht an einen kranken Kollegen'},
 {number:9,id:schreibenExamId(9),topics:'Busfahrt buchen · Frage nach einem Kochkurs'},
 {number:10,id:schreibenExamId(10),topics:'Personalbogen · Etwas im Kurs vergessen'},
];
/** The exams of a part. */
export const examList=(module:ReadyModule)=>module==='hoeren'?hoerenExamList:module==='schreiben'?schreibenExamList:lesenExamList;
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
const hoerenLoaders:Record<number,()=>Promise<{exam:A1HoerenExam}>>={
 1:()=>import('./a1-exam-hoeren-01'),2:()=>import('./a1-exam-hoeren-02'),3:()=>import('./a1-exam-hoeren-03'),4:()=>import('./a1-exam-hoeren-04'),5:()=>import('./a1-exam-hoeren-05'),
 6:()=>import('./a1-exam-hoeren-06'),7:()=>import('./a1-exam-hoeren-07'),8:()=>import('./a1-exam-hoeren-08'),9:()=>import('./a1-exam-hoeren-09'),10:()=>import('./a1-exam-hoeren-10'),
};
/** Loads one Hören exam's questions and spoken texts. */
export function loadHoerenExam(number:number):Promise<A1HoerenExam>{
 const load=hoerenLoaders[number];if(!load)return Promise.reject(new Error('No exam '+number));
 return load().then(module=>module.exam);
}

/* ---------- Buchstabieren: a listening practice beside the exams (lib/a1-exam-spell.ts) ---------- */
/** Its part of the address: `?sinav=2&bolum=buchstabieren` (sheet 2). */
export const SPELL_MODULE='buchstabieren';
export const SPELL_TOTAL=10;
/** The three sheets: number, id and the letters they train (kept here so the list page loads no sheet). The ids are
 * kept in the learner's saved answers, never change them. */
export const spellSheetList:readonly {number:number;id:string;topics:string}[]=[
 {number:1,id:'a1-spell-01',topics:'Vokale und Umlaute: a · o · ä · ö · ü · ai · au · eu'},
 {number:2,id:'a1-spell-02',topics:'Konsonanten: b · p · d · t · v · w · f · s · z · ß · j · y'},
 {number:3,id:'a1-spell-03',topics:'Doppelte und stumme Buchstaben · lange Namen'},
];
export const SPELL_SHEET_COUNT=spellSheetList.length;
export const isSpellNumber=(value:number)=>Number.isInteger(value)&&value>=1&&value<=SPELL_SHEET_COUNT;
/** Loads one sheet of the spelling practice. */
export function loadSpellSheet(number:number):Promise<SpellSheet>{
 if(!isSpellNumber(number))return Promise.reject(new Error('No sheet '+number));
 return import('./a1-exam-spell').then(module=>module.spellSheets[number-1]);
}

const schreibenLoaders:Record<number,()=>Promise<{exam:A1SchreibenExam}>>={
 1:()=>import('./a1-exam-schreiben-01'),2:()=>import('./a1-exam-schreiben-02'),3:()=>import('./a1-exam-schreiben-03'),4:()=>import('./a1-exam-schreiben-04'),5:()=>import('./a1-exam-schreiben-05'),
 6:()=>import('./a1-exam-schreiben-06'),7:()=>import('./a1-exam-schreiben-07'),8:()=>import('./a1-exam-schreiben-08'),9:()=>import('./a1-exam-schreiben-09'),10:()=>import('./a1-exam-schreiben-10'),
};
/** Loads one Schreiben exam: the form and the message with their gaps. */
export function loadSchreibenExam(number:number):Promise<A1SchreibenExam>{
 const load=schreibenLoaders[number];if(!load)return Promise.reject(new Error('No exam '+number));
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

export type HoerenItem=ListenChoiceItem|ListenTrueFalseItem;
/** The 15 scored items of a Hören exam in the order of the paper (Teil 1: 1–6, Teil 2: 7–10, Teil 3: 11–15). */
export function hoerenItems(hoeren:HoerenExam):{teil:1|2|3;item:HoerenItem}[]{
 return [
  ...hoeren.teil1.items.map(item=>({teil:1 as const,item})),
  ...hoeren.teil2.items.map(item=>({teil:2 as const,item})),
  ...hoeren.teil3.items.map(item=>({teil:3 as const,item})),
 ];
}
export const hoerenKey=(hoeren:HoerenExam)=>hoerenItems(hoeren).map(entry=>entry.item.answer).join('');

/** The 15 scored gaps of a Schreiben exam in the order of the paper (Teil 1, the form: 1–5; Teil 2, the message: 6–15). */
export function schreibenItems(schreiben:SchreibenExam):{teil:1|2;item:GapItem}[]{
 return [...schreiben.teil1.items.map(item=>({teil:1 as const,item})),...schreiben.teil2.items.map(item=>({teil:2 as const,item}))];
}
export const schreibenKey=(schreiben:SchreibenExam)=>schreibenItems(schreiben).map(entry=>entry.item.answer).join('');

export type ExamAnswers=Record<string,ExamAnswer>;
export type ExamResult={right:number;total:number;answered:number;byTeil:Record<1|2|3,{right:number;total:number}>;wrong:string[];open:string[]};
export type LesenResult=ExamResult;
/** Marks a Schreiben exam: one point per gap that is filled right. */
export const gradeSchreiben=(schreiben:SchreibenExam,answers:ExamAnswers)=>gradeItems(schreibenItems(schreiben),answers);
/** Marks a Hören exam like a Lesen exam. */
export const gradeHoeren=(hoeren:HoerenExam,answers:ExamAnswers)=>gradeItems(hoerenItems(hoeren),answers);
/** Marks a Lesen exam: one point per right answer; an item left open counts as wrong. */
export const gradeLesen=(lesen:LesenExam,answers:ExamAnswers)=>gradeItems(lesenItems(lesen),answers);
export function gradeItems(items:readonly {teil:1|2|3;item:{id:string;answer:ExamAnswer}}[],answers:ExamAnswers):ExamResult{
 const result:ExamResult={right:0,total:0,answered:0,byTeil:{1:{right:0,total:0},2:{right:0,total:0},3:{right:0,total:0}},wrong:[],open:[]};
 for(const {teil,item} of items){
  result.total++;result.byTeil[teil].total++;
  const given=answers[item.id];
  if(given===undefined){result.open.push(item.id);continue;}
  result.answered++;
  if(given===item.answer){result.right++;result.byTeil[teil].right++;}else result.wrong.push(item.id);
 }
 return result;
}
