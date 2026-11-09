import {starsFor,stageFor,type TopicProgress} from './progress-core';
import {LESEN_TOTAL,lesenExamList,type ExamAnswers} from './a1-exam-course';
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
/** A run: the marks so far, the seconds on the clock, the Teil on the screen; `done` once it is handed in. */
export type ExamRun={answers:ExamAnswers;seconds:number;teil:1|2|3;timed:boolean;done:boolean};
type Read=Pick<Storage,'getItem'>;type Write=Pick<Storage,'setItem'>;

const isAnswer=(value:unknown):value is ExamAnswer=>value==='r'||value==='f'||value==='a'||value==='b';
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
 const teil=run.teil===2||run.teil===3?run.teil:1;
 return {answers,seconds:whole(run.seconds,86400),teil,timed:run.timed!==false,done:run.done===true};
}
export function saveExamRun(storage:Write,examId:string,run:ExamRun){try{storage.setItem(a1ExamRunKey(examId),JSON.stringify(run));}catch{}}
export function clearExamRun(storage:Pick<Storage,'removeItem'>,examId:string){try{storage.removeItem(a1ExamRunKey(examId));}catch{}}

const ratio=(part:number,total:number)=>total?Math.round(part/total*100):0;
/** The section as a whole: every exam's 15 points; an exam counts as tried once it was handed in. */
export function examSectionProgress(scores:ExamScoreMap):TopicProgress{
 let total=0,tried=0,learned=0;
 for(const exam of lesenExamList){
  total+=LESEN_TOTAL;const score=scores[exam.id];if(!score)continue;
  tried+=LESEN_TOTAL;learned+=Math.max(0,Math.min(LESEN_TOTAL,score.right));
 }
 const percent=ratio(learned,total);
 return {total,tried,learned,percent,triedPercent:Math.max(percent,ratio(tried,total)),stars:starsFor(percent),stage:stageFor(percent,tried)};
}
/** How many exams were handed in. */
export const examsSolved=(scores:ExamScoreMap)=>lesenExamList.filter(exam=>scores[exam.id]).length;
/** 754 seconds → "12:34". */
export function clock(seconds:number){const s=Math.max(0,Math.floor(seconds));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
