/**
 * The small, data-free part of the learning progress (3 November 2026): the progress type, stars and stages, and what a
 * lesson part counts. Lesson pages (Lektion 1, 2, 12, 15) take these from here, so they do not load the question bank
 * that lib/progress.ts needs for Ev ve Yaşam, Nesne Kasası and the verbs. lib/progress.ts re-exports all of it.
 */
export type TopicProgress={total:number;tried:number;learned:number;percent:number;triedPercent:number;stars:0|1|2|3;stage:ProgressStage};
export type ProgressStage='new'|'started'|'warming'|'half'|'almost'|'master';

/** What a lesson part's percentage counts (Lektion 1, 2, 15): every scored exercise with its answers, and every teaching
 * step and Konuş as one item each — a teaching step counts once it is opened, Konuş once the learner rated it (the learner
 * asked, 2 November 2026: reading a topic did not move the percentage). */
export function lessonItems(scored:readonly {id:string;total:number}[],steps:readonly {id:string;kind:string}[]){
 return [...scored,...steps.filter(step=>(step.kind==='teach'||step.kind==='speak')&&!scored.some(item=>item.id===step.id)).map(step=>({id:step.id,total:1}))];
}
export function starsFor(percent:number):0|1|2|3{return percent>=75?3:percent>=50?2:percent>=25?1:0;}
export function stageFor(percent:number,tried:number):ProgressStage{
 return percent>=100?'master':percent>=75?'almost':percent>=50?'half':percent>=25?'warming':tried>0||percent>0?'started':'new';
}
