import type {Question} from './course';
import type {Review} from './study';
import {housingQuestions,type HousingSection} from './housing-course';
import {objectQuestions} from './object-course';
import {isObjectPictureQuestion,isObjectWritingQuestion,isObjectListeningQuestion} from './object-practice';
import {verbQuestions,inVerbTopic} from './verb-course';
import {isVerbExercise} from './verb-practice';

/**
 * Learning progress shown in the interface. Everything here is derived from the
 * existing review rows and answer counts; no question, topic or session ID changes.
 * An exercise counts as learned while its most recent answer was correct (streak ≥ 1).
 */
export type TopicProgress={total:number;tried:number;learned:number;percent:number;triedPercent:number;stars:0|1|2|3;stage:ProgressStage};
export type ProgressStage='new'|'started'|'warming'|'half'|'almost'|'master';
export type DayCount={day:number;answers:number;correct:number};
export type StudyStats={answers:number;correct:number;days:DayCount[];today:number};
export type LevelInfo={level:number;xp:number;levelStart:number;nextLevel:number;intoLevel:number;span:number;toNext:number;percent:number};
export type ProgressSummary={xp:number;level:LevelInfo;streak:number;practisedToday:boolean;todayAnswers:number;dailyGoal:number;goalPercent:number;correct:number;answers:number};

export const XP_CORRECT=10;
export const XP_TRY=2;
export const DAILY_GOAL=20;
const DAY=86400000;

function ratio(part:number,total:number){
 if(!total||part<=0)return 0;
 if(part>=total)return 100;
 return Math.min(99,Math.max(1,Math.round(part*100/total)));
}
export function starsFor(percent:number):0|1|2|3{return percent>=75?3:percent>=50?2:percent>=25?1:0;}
export function stageFor(percent:number,tried:number):ProgressStage{
 return percent>=100?'master':percent>=75?'almost':percent>=50?'half':percent>=25?'warming':tried>0||percent>0?'started':'new';
}
export function topicProgress(ids:readonly string[],reviews:readonly Review[]):TopicProgress{
 const unique=[...new Set(ids)];const byId=new Map(reviews.map(row=>[row.question_id,row]));
 let tried=0,learned=0;
 for(const id of unique){const row=byId.get(id);if(!row||!(row.seen>0))continue;tried++;if(row.streak>=1)learned++;}
 const total=unique.length;const percent=ratio(learned,total);
 return {total,tried,learned,percent,triedPercent:Math.max(percent,ratio(tried,total)),stars:starsFor(percent),stage:stageFor(percent,tried)};
}

/** Exercises that can actually be practised on the Ev ve Yaşam page (write or four-choice). */
export function housingProgressIds(section:HousingSection|'all'){
 return housingQuestions.filter(q=>(section==='all'||q.section===section)&&(q.kind==='write'||!!q.options)).map(q=>q.id);
}
/** Picture test, writing and listening exercises of one Nesne Kasası category. */
export function isVaultExercise(q:Question){return isObjectPictureQuestion(q)||isObjectWritingQuestion(q)||isObjectListeningQuestion(q);}
export function objectProgressIds(group:string){
 return objectQuestions.filter(q=>(group==='all'||q.topic===group)&&isVaultExercise(q)).map(q=>q.id);
}
/** Choice, writing and listening exercises of one Fiiller group (verbs-all = every verb). */
export function verbProgressIds(topic:string){
 return verbQuestions.filter(q=>inVerbTopic(q.topic,topic)&&isVerbExercise(q)).map(q=>q.id);
}
export function verbProgress(topic:string,reviews:readonly Review[]){return topicProgress(verbProgressIds(topic),reviews);}
export function housingProgress(section:HousingSection|'all',reviews:readonly Review[]){return topicProgress(housingProgressIds(section),reviews);}
export function objectProgress(group:string,reviews:readonly Review[]){return topicProgress(objectProgressIds(group),reviews);}

export function xpFor(answers:number,correct:number){
 const right=Math.max(0,Math.floor(correct));const all=Math.max(right,Math.floor(answers));
 return right*XP_CORRECT+(all-right)*XP_TRY;
}
/** Level L starts at 50·L·(L−1) XP: 0, 100, 300, 600, 1000 … */
export function levelStart(level:number){return 50*level*(level-1);}
export function levelFromXp(xp:number):LevelInfo{
 const total=Math.max(0,Math.floor(xp));let level=1;
 while(levelStart(level+1)<=total)level++;
 const start=levelStart(level),next=levelStart(level+1),span=next-start,intoLevel=total-start;
 return {level,xp:total,levelStart:start,nextLevel:next,intoLevel,span,toNext:next-total,percent:Math.floor(intoLevel*100/span)};
}
/** Local calendar day number for a timestamp; offset is Date#getTimezoneOffset() in minutes. */
export function dayKey(ms:number,timezoneOffset=0){return Math.floor((ms-timezoneOffset*60000)/DAY);}
/** Consecutive practice days ending today, or yesterday when today has no practice yet. */
export function dayStreak(days:readonly number[],today:number){
 const set=new Set(days);let cursor=set.has(today)?today:set.has(today-1)?today-1:null;
 if(cursor===null)return 0;let streak=0;
 while(set.has(cursor)){streak++;cursor--;}
 return streak;
}
export function progressSummary(stats:StudyStats,dailyGoal=DAILY_GOAL):ProgressSummary{
 const days=stats.days.filter(row=>row.answers>0);const todayAnswers=days.find(row=>row.day===stats.today)?.answers??0;
 const xp=xpFor(stats.answers,stats.correct);
 return {xp,level:levelFromXp(xp),streak:dayStreak(days.map(row=>row.day),stats.today),practisedToday:todayAnswers>0,todayAnswers,dailyGoal,goalPercent:Math.min(100,Math.floor(todayAnswers*100/dailyGoal)),correct:stats.correct,answers:stats.answers};
}
/** XP earned in one finished round. */
export function roundXp(answers:readonly {correct:number|boolean}[]){
 const correct=answers.filter(answer=>!!answer.correct).length;
 return xpFor(answers.length,correct);
}
