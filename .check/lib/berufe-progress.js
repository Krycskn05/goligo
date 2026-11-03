"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.l2PartCounted = exports.l2PartScored = exports.l2PartKeys = exports.L2_PART_KEY = exports.L2D_STEP_KEY = exports.L2D_SCORES_KEY = exports.L2C_STEP_KEY = exports.L2C_SCORES_KEY = exports.L2B_STEP_KEY = exports.L2B_SCORES_KEY = exports.L2A_STEP_KEY = exports.L2A_SCORES_KEY = void 0;
exports.readL2Scores = readL2Scores;
exports.saveL2Score = saveL2Score;
exports.partProgressL2 = partProgressL2;
exports.lessonTwoProgress = lessonTwoProgress;
exports.readLessonTwoProgress = readLessonTwoProgress;
const progress_core_1 = require("./progress-core");
const berufe_course_1 = require("./berufe-course");
const berufe_b_course_1 = require("./berufe-b-course");
const berufe_c_course_1 = require("./berufe-c-course");
const berufe_d_course_1 = require("./berufe-d-course");
exports.L2A_SCORES_KEY = 'lernkoko-l2a-scores';
exports.L2A_STEP_KEY = 'lernkoko-l2a-step';
exports.L2B_SCORES_KEY = 'lernkoko-l2b-scores';
exports.L2B_STEP_KEY = 'lernkoko-l2b-step';
exports.L2C_SCORES_KEY = 'lernkoko-l2c-scores';
exports.L2C_STEP_KEY = 'lernkoko-l2c-step';
exports.L2D_SCORES_KEY = 'lernkoko-l2d-scores';
exports.L2D_STEP_KEY = 'lernkoko-l2d-step';
/** The part the learner opened last. */
exports.L2_PART_KEY = 'lernkoko-l2-part';
exports.l2PartKeys = { a: { scores: exports.L2A_SCORES_KEY, step: exports.L2A_STEP_KEY }, b: { scores: exports.L2B_SCORES_KEY, step: exports.L2B_STEP_KEY }, c: { scores: exports.L2C_SCORES_KEY, step: exports.L2C_STEP_KEY }, d: { scores: exports.L2D_SCORES_KEY, step: exports.L2D_STEP_KEY } };
exports.l2PartScored = { a: berufe_course_1.berufeScored, b: berufe_b_course_1.berufeScoredB, c: berufe_c_course_1.berufeScoredC, d: berufe_d_course_1.berufeScoredD };
/** What the percentages count: the scored exercises, the teaching steps and Konuş (lib/progress.ts `lessonItems`). */
exports.l2PartCounted = { a: (0, progress_core_1.lessonItems)(berufe_course_1.berufeScored, berufe_course_1.berufeSteps), b: (0, progress_core_1.lessonItems)(berufe_b_course_1.berufeScoredB, berufe_b_course_1.berufeStepsB), c: (0, progress_core_1.lessonItems)(berufe_c_course_1.berufeScoredC, berufe_c_course_1.berufeStepsC), d: (0, progress_core_1.lessonItems)(berufe_d_course_1.berufeScoredD, berufe_d_course_1.berufeStepsD) };
function readL2Scores(part) {
    try {
        const value = JSON.parse(localStorage.getItem(exports.l2PartKeys[part].scores) ?? '{}');
        return value && typeof value === 'object' ? value : {};
    }
    catch {
        return {};
    }
}
/** Keeps the best result of an exercise. */
function saveL2Score(part, id, right, total) {
    const scores = readL2Scores(part);
    const old = scores[id];
    if (!old || right > old.right)
        scores[id] = { right, total };
    try {
        localStorage.setItem(exports.l2PartKeys[part].scores, JSON.stringify(scores));
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
    return { total, tried, learned, percent, triedPercent: Math.max(percent, ratio(tried, total)), stars: (0, progress_core_1.starsFor)(percent), stage: (0, progress_core_1.stageFor)(percent, tried) };
}
/** One part's progress (its notebook page and its row on the contents page). */
function partProgressL2(part, scores) { return progressOf(exports.l2PartCounted[part], scores); }
/** Lektion 2 as a whole (the unit card on Üniteler): every scored exercise of every part that has a lesson. */
function lessonTwoProgress(all) {
    const parts = Object.keys(exports.l2PartCounted);
    const list = parts.flatMap(part => exports.l2PartCounted[part].map(exercise => ({ id: part + ':' + exercise.id, total: exercise.total })));
    const scores = {};
    for (const part of parts)
        for (const [id, score] of Object.entries(all[part] ?? {}))
            scores[part + ':' + id] = score;
    return progressOf(list, scores);
}
function readLessonTwoProgress() { return lessonTwoProgress({ a: readL2Scores('a'), b: readL2Scores('b'), c: readL2Scores('c'), d: readL2Scores('d') }); }
