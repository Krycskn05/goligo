"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStep = exports.isWordSection = exports.lessonProgress = exports.partProgress = exports.isCheckable = void 0;
exports.exerciseAnswerCount = exerciseAnswerCount;
exports.exercisesProgress = exercisesProgress;
exports.partSteps = partSteps;
exports.testPoints = testPoints;
exports.wordArticle = wordArticle;
/**
 * Lektion 12 progress, kept in the learner's browser: which exercises were checked and how many
 * answers were right. Shown with the site's usual percentage bars and stars.
 */
const progress_1 = require("./progress");
const ausbildung_course_1 = require("./ausbildung-course");
/** How many answers an exercise checks (blanks, choices, sentences); free writing has none. */
function exerciseAnswerCount(exercise) {
    return exercise.items.reduce((sum, item) => sum + (item.k === 'gap' ? item.answers.length : item.k === 'open' ? 0 : 1), 0);
}
const isCheckable = (exercise) => exerciseAnswerCount(exercise) > 0;
exports.isCheckable = isCheckable;
function ratio(part, total) {
    if (!total || part <= 0)
        return 0;
    if (part >= total)
        return 100;
    return Math.min(99, Math.max(1, Math.round(part * 100 / total)));
}
/** Progress over some exercises: learned = right answers of the last check, tried = answers of checked exercises. */
function exercisesProgress(exercises, scores) {
    let total = 0, tried = 0, learned = 0;
    for (const exercise of exercises) {
        const count = exerciseAnswerCount(exercise);
        if (!count)
            continue;
        total += count;
        const score = scores[exercise.id];
        if (!score)
            continue;
        tried += count;
        learned += Math.max(0, Math.min(count, score.right));
    }
    const percent = ratio(learned, total);
    return { total, tried, learned, percent, triedPercent: Math.max(percent, ratio(tried, total)), stars: (0, progress_1.starsFor)(percent), stage: (0, progress_1.stageFor)(percent, tried) };
}
const partProgress = (part, scores) => exercisesProgress(part.exercises, scores);
exports.partProgress = partProgress;
const lessonProgress = (scores) => exercisesProgress(ausbildung_course_1.lessonParts.flatMap(part => part.exercises), scores);
exports.lessonProgress = lessonProgress;
/** Sections that teach words (shown in the "Kelimeler" step); the others are the topic. */
const isWordSection = (id) => id === 'woerter';
exports.isWordSection = isWordSection;
function partSteps(part) {
    const steps = [];
    if (part.sections.some(section => (0, exports.isWordSection)(section.id)))
        steps.push('kelimeler');
    if (part.sections.some(section => !(0, exports.isWordSection)(section.id)))
        steps.push('konu');
    if (part.exercises.length)
        steps.push('alistirmalar');
    if (part.listen?.length)
        steps.push('dinleme');
    return steps;
}
const isStep = (value) => value === 'kelimeler' || value === 'konu' || value === 'alistirmalar' || value === 'dinleme';
exports.isStep = isStep;
/** Test points of the „Alles klar?" part (rounded to halves), and whether anything was checked. */
function testPoints(part, scores) {
    const checked = part.exercises.filter(exercise => scores[exercise.id]);
    const points = part.exercises.reduce((sum, exercise) => sum + (scores[exercise.id]?.points ?? 0), 0);
    const max = part.exercises.reduce((sum, exercise) => sum + (exercise.points ?? 0), 0);
    return { points: Math.round(points * 2) / 2, max, checked: checked.length, total: part.exercises.length };
}
/** A German article at the start of a word ("die Ausbildung, -en") for its colour; '' for verbs and others. */
function wordArticle(de) {
    const match = /^(der|die|das)\s/.exec(de);
    return match ? match[1] : '';
}
