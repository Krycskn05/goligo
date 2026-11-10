import {starsFor,stageFor,type TopicProgress} from './progress-core';
import {HOEREN_TOTAL,LESEN_TOTAL,SPELL_TOTAL,hoerenExamList,lesenExamList,spellSheetList,type ExamAnswers} from './a1-exam-course';
import type {ExamAnswer} from './a1-exam-types';

/**
 * A1 sınavı keeps its results in the browser like the lessons: the best result of every exam
 * (`lernkoko-a1-exam-scores`, by exam id) and the answers of the exam the learner is solving or solved last
 * (`lernkoko-a1-exam-run:<exam id>`). Both travel with the account (lib/lesson-sync.ts, `site`: two score lists are
 * joined, the better result stays) and go away with Hesabım → „İlerlememi sıfırla“. A visitor's answers are not kept.
 */
export const A1_EXAM_SCORES_KEY='lernkoko-a1-exam-scores';
export const a1ExamRunKey=(examId:string)=>'lernkoko-a1-exam-run:'+examId;
/** `seconds`: how long the best attempt took; `tries`: how often the exam was handed in on this device. */
export type ExamScore={right:number;total:number;tries?:number;seconds?:number;at?:number};
export type ExamScoreMap=Record<string,ExamScore>;
/** A run: the marks so far, the seconds on the clock, the Teil on the screen; `done` once it is handed in. `timed`: Lesen with
 * the 25 minutes, Hören with the exam's number of hearings; `plays`: how often each Hören text was heard (by item id, the
 * examples as `<exam>-b1` / `-b2`). */
export type ExamRun={answers:ExamAnswers;seconds:number;teil:1|2|3;timed:boolean;done:boolean;plays?:Record<string,number>};
type Read=Pick<Storage,'getItem'>;type Write=Pick<Storage,'setItem'>;

const isAnswer=(value:unknown):value is ExamAnswer=>value==='r'||value==='f'||value==='a'||value==='b'||value==='c';
const whole=(value:unknown,max:number)=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(max,Math.floor(value))):0;

export function readExamScores(storage:Read):ExamScoreMap{
 let data:unknown=null;try{data=JSON.parse(storage.getItem(A1_EXAM_SCORES_KEY)??'{}');}catch{return {};}
 if(!data||typeof data!=='object'||Array.isArray(data))return {};
 const out:ExamScoreMap={};
 for(const [id,value] of Object.entries(data as Record<string,unknown>)){
  if(!value||typeof value!=='object')continue;const score=value as Record<string,unknown>;
  if(typeof score.right!=='number'||typeof score.total!=='number'||score.total<=0)continue;
  out[id]={right:whole(score.right,score.total),total:whole(score.total,999),...(typeof score.tries==='number'?{tries:whole(score.tries,9999)}:{}),...(typeof score.seconds==='number'?{seconds:whole(score.seconds,86400)}:{}),...(typeof score.at==='number'?{at:score.at}:{})};
 }
 return out;
}
/** Keeps the best result of an exam (a tie keeps the faster one) and counts the attempt. */
export function saveExamScore(storage:Read&Write,examId:string,right:number,total:number,seconds:number,now=Date.now()):ExamScoreMap{
 const scores=readExamScores(storage);const old=scores[examId];const tries=(old?.tries??0)+1;
 const better=!old||right>old.right||(right===old.right&&seconds>0&&(!old.seconds||seconds<old.seconds));
 scores[examId]=better?{right,total,tries,seconds,at:now}:{...old,tries};
 try{storage.setItem(A1_EXAM_SCORES_KEY,JSON.stringify(scores));}catch{}
 return scores;
}
/** The saved run of an exam; only marks for that exam's own items are read back. */
export function readExamRun(storage:Read,examId:string):ExamRun|null{
 let data:unknown=null;try{data=JSON.parse(storage.getItem(a1ExamRunKey(examId))??'null');}catch{return null;}
 if(!data||typeof data!=='object')return null;
 const run=data as Record<string,unknown>;const answers:ExamAnswers={};
 if(run.answers&&typeof run.answers==='object')for(const [id,value] of Object.entries(run.answers as Record<string,unknown>))if(id.startsWith(examId+'-')&&isAnswer(value))answers[id]=value;
 const teil=run.teil===2||run.teil===3?run.teil:1;const plays:Record<string,number>={};
 if(run.plays&&typeof run.plays==='object')for(const [id,value] of Object.entries(run.plays as Record<string,unknown>))if(id.startsWith(examId+'-')&&typeof value==='number'&&value>0)plays[id]=whole(value,99);
 return {answers,seconds:whole(run.seconds,86400),teil,timed:run.timed!==false,done:run.done===true,...(Object.keys(plays).length?{plays}:{})};
}
export function saveExamRun(storage:Write,examId:string,run:ExamRun){try{storage.setItem(a1ExamRunKey(examId),JSON.stringify(run));}catch{}}
export function clearExamRun(storage:Pick<Storage,'removeItem'>,examId:string){try{storage.removeItem(a1ExamRunKey(examId));}catch{}}

const ratio=(part:number,total:number)=>total?Math.round(part/total*100):0;
/** Every exam paper of the section (Hören 1–10, Lesen 1–10) with its points. */
export const examPapers:readonly {id:string;total:number}[]=[...hoerenExamList.map(exam=>({id:exam.id,total:HOEREN_TOTAL})),...lesenExamList.map(exam=>({id:exam.id,total:LESEN_TOTAL}))];
/** The sheets of the spelling practice (Buchstabieren 1–3): their results are kept like a paper's, but they are a practice
 * and do not count in the section's progress. */
export const spellPapers:readonly {id:string;total:number}[]=spellSheetList.map(sheet=>({id:sheet.id,total:SPELL_TOTAL}));
/** The section as a whole: every paper's 15 points; a paper counts as tried once it was handed in. */
export function examSectionProgress(scores:ExamScoreMap):TopicProgress{
 let total=0,tried=0,learned=0;
 for(const exam of examPapers){
  total+=exam.total;const score=scores[exam.id];if(!score)continue;
  tried+=exam.total;learned+=Math.max(0,Math.min(exam.total,score.right));
 }
 const percent=ratio(learned,total);
 return {total,tried,learned,percent,triedPercent:Math.max(percent,ratio(tried,total)),stars:starsFor(percent),stage:stageFor(percent,tried)};
}
/** How many papers were handed in. */
export const examsSolved=(scores:ExamScoreMap)=>examPapers.filter(exam=>scores[exam.id]).length;
/** 754 seconds → "12:34". */
export function clock(seconds:number){const s=Math.max(0,Math.floor(seconds));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
