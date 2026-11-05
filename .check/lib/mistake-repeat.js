"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundMistakeIds = roundMistakeIds;
/** The ids of the questions a round got wrong, in the round's order (the repeat at the end of a round, app/mistake-repeat.tsx). */
function roundMistakeIds(round) {
    const wrong = new Set(round.answers.filter(answer => !answer.correct).map(answer => answer.question_id));
    return round.questions.map(item => item.id).filter(id => wrong.has(id));
}
