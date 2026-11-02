"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.l15PartCounted = exports.l15PartScored = exports.l15PartKeys = exports.L15_PART_KEY = exports.L15A_STEP_KEY = exports.L15A_SCORES_KEY = void 0;
exports.readL15Scores = readL15Scores;
exports.saveL15Score = saveL15Score;
exports.partProgressL15 = partProgressL15;
exports.lessonFifteenProgress = lessonFifteenProgress;
exports.readLessonFifteenProgress = readLessonFifteenProgress;
const progress_1 = require("./progress");
const stadt_course_1 = require("./stadt-course");
exports.L15A_SCORES_KEY = 'lernkoko-l15a-scores';
exports.L15A_STEP_KEY = 'lernkoko-l15a-step';
/** The part the learner opened last. */
exports.L15_PART_KEY = 'lernkoko-l15-part';
exports.l15PartKeys = { a: { scores: exports.L15A_SCORES_KEY, step: exports.L15A_STEP_KEY } };
exports.l15PartScored = { a: stadt_course_1.scoredExercisesA };
/** What the percentages count: the scored exercises and the teaching steps (lib/progress.ts `lessonItems`). */
exports.l15PartCounted = { a: (0, progress_1.lessonItems)(stadt_course_1.scoredExercisesA, stadt_course_1.stepsA) };
function readL15Scores(part) {
    try {
        const value = JSON.parse(localStorage.getItem(exports.l15PartKeys[part].scores) ?? '{}');
        return value && typeof value === 'object' ? value : {};
    }
    catch {
        return {};
    }
}
/** Keeps the best result of an exercise. */
function saveL15Score(part, id, right, total) {
    const scores = readL15Scores(part);
    const old = scores[id];
    if (!old || right > old.right)
        scores[id] = { right, total };
    try {
        localStorage.setItem(exports.l15PartKeys[part].scores, JSON.stringify(scores));
    }
    catch { }
    return scores;
}
const ratio = (part, total) => total ? Math.round(part / total * 100) : 0;
function progressOf(list, scores) {
    let total = 0, tried = 0, learned = 0;
    for (const exercise of list) {
        total += exercise.total;
        const score = scores[exercise.id];
        if (!score)
            continue;
        tried += exercise.total;
        learned += Math.max(0, Math.min(exercise.total, score.right));
    }
    const percent = ratio(learned, total);
    return { total, tried, learned, percent, triedPercent: Math.max(percent, ratio(tried, total)), stars: (0, progress_1.starsFor)(percent), stage: (0, progress_1.stageFor)(percent, tried) };
}
/** One part's progress (its notebook page and its row on the contents page). */
function partProgressL15(part, scores) { return progressOf(exports.l15PartCounted[part], scores); }
/** Lektion 15 as a whole (the unit card on Üniteler): every scored exercise of every part that has a lesson. */
function lessonFifteenProgress(all) {
    const parts = Object.keys(exports.l15PartCounted);
    const list = parts.flatMap(part => exports.l15PartCounted[part].map(exercise => ({ id: part + ':' + exercise.id, total: exercise.total })));
    const scores = {};
    for (const part of parts)
        for (const [id, score] of Object.entries(all[part] ?? {}))
            scores[part + ':' + id] = score;
    return progressOf(list, scores);
}
function readLessonFifteenProgress() { return lessonFifteenProgress({ a: readL15Scores('a') }); }
