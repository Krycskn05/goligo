"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonItems = lessonItems;
exports.starsFor = starsFor;
exports.stageFor = stageFor;
/** What a lesson part's percentage counts (Lektion 1, 2, 15): every scored exercise with its answers, and every teaching
 * step and Konuş as one item each — a teaching step counts once it is opened, Konuş once the learner rated it (the learner
 * asked, 2 November 2026: reading a topic did not move the percentage). */
function lessonItems(scored, steps) {
    return [...scored, ...steps.filter(step => (step.kind === 'teach' || step.kind === 'speak') && !scored.some(item => item.id === step.id)).map(step => ({ id: step.id, total: 1 }))];
}
function starsFor(percent) { return percent >= 75 ? 3 : percent >= 50 ? 2 : percent >= 25 ? 1 : 0; }
function stageFor(percent, tried) {
    return percent >= 100 ? 'master' : percent >= 75 ? 'almost' : percent >= 50 ? 'half' : percent >= 25 ? 'warming' : tried > 0 || percent > 0 ? 'started' : 'new';
}
