/** The ids of the questions a round got wrong, in the round's order (the repeat at the end of a round, app/mistake-repeat.tsx). */
export function roundMistakeIds(round:{questions:readonly {id:string}[];answers:readonly {question_id:string;correct:number|boolean}[]}){
 const wrong=new Set(round.answers.filter(answer=>!answer.correct).map(answer=>answer.question_id));
 return round.questions.map(item=>item.id).filter(id=>wrong.has(id));
}
