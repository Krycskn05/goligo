/**
 * Lektion 12 progress, kept in the learner's browser: which exercises were checked and how many
 * answers were right. Shown with the site's usual percentage bars and stars.
 */
import {starsFor,stageFor,type TopicProgress} from './progress';
import {lessonParts,type L12Exercise,type L12Part} from './ausbildung-course';

export type L12Score={right:number;total:number;points?:number};
export type L12ScoreMap=Record<string,L12Score>;
/** The steps of one part, in book order: words, the topic, exercises, listening. */
export type L12Step='kelimeler'|'konu'|'alistirmalar'|'dinleme';

/** How many answers an exercise checks (blanks, choices, sentences); free writing has none. */
export function exerciseAnswerCount(exercise:L12Exercise){
 return exercise.items.reduce((sum,item)=>sum+(item.k==='gap'?item.answers.length:item.k==='open'?0:1),0);
}
export const isCheckable=(exercise:L12Exercise)=>exerciseAnswerCount(exercise)>0;

function ratio(part:number,total:number){
 if(!total||part<=0)return 0;
 if(part>=total)return 100;
 return Math.min(99,Math.max(1,Math.round(part*100/total)));
}
/** Progress over some exercises: learned = right answers of the last check, tried = answers of checked exercises. */
export function exercisesProgress(exercises:readonly L12Exercise[],scores:L12ScoreMap):TopicProgress{
 let total=0,tried=0,learned=0;
 for(const exercise of exercises){
  const count=exerciseAnswerCount(exercise);if(!count)continue;total+=count;
  const score=scores[exercise.id];if(!score)continue;tried+=count;learned+=Math.max(0,Math.min(count,score.right));
 }
 const percent=ratio(learned,total);
 return {total,tried,learned,percent,triedPercent:Math.max(percent,ratio(tried,total)),stars:starsFor(percent),stage:stageFor(percent,tried)};
}
export const partProgress=(part:L12Part,scores:L12ScoreMap)=>exercisesProgress(part.exercises,scores);
export const lessonProgress=(scores:L12ScoreMap)=>exercisesProgress(lessonParts.flatMap(part=>part.exercises),scores);

/** Sections that teach words (shown in the "Kelimeler" step); the others are the topic. */
export const isWordSection=(id:string)=>id==='woerter';
export function partSteps(part:L12Part):L12Step[]{
 const steps:L12Step[]=[];
 if(part.sections.some(section=>isWordSection(section.id)))steps.push('kelimeler');
 if(part.sections.some(section=>!isWordSection(section.id)))steps.push('konu');
 if(part.exercises.length)steps.push('alistirmalar');
 if(part.listen?.length)steps.push('dinleme');
 return steps;
}
export const isStep=(value:string|null):value is L12Step=>value==='kelimeler'||value==='konu'||value==='alistirmalar'||value==='dinleme';
/** Test points of the „Alles klar?" part (rounded to halves), and whether anything was checked. */
export function testPoints(part:L12Part,scores:L12ScoreMap){
 const checked=part.exercises.filter(exercise=>scores[exercise.id]);
 const points=part.exercises.reduce((sum,exercise)=>sum+(scores[exercise.id]?.points??0),0);
 const max=part.exercises.reduce((sum,exercise)=>sum+(exercise.points??0),0);
 return {points:Math.round(points*2)/2,max,checked:checked.length,total:part.exercises.length};
}
/** A German article at the start of a word ("die Ausbildung, -en") for its colour; '' for verbs and others. */
export function wordArticle(de:string):'der'|'die'|'das'|''{
 const match=/^(der|die|das)\s/.exec(de);return match?match[1] as 'der'|'die'|'das':'';
}
