"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveL1AScore = exports.readL1AScores = exports.partCounted = exports.partScored = exports.partKeys = exports.L1_PART_KEY = exports.L1D_STEP_KEY = exports.L1D_SCORES_KEY = exports.L1C_STEP_KEY = exports.L1C_SCORES_KEY = exports.L1B_STEP_KEY = exports.L1B_SCORES_KEY = exports.L1A_STEP_KEY = exports.L1A_SCORES_KEY = void 0;
exports.readPartScores = readPartScores;
exports.savePartScore = savePartScore;
exports.willkommenProgress = willkommenProgress;
exports.partProgressL1 = partProgressL1;
exports.lessonOneProgress = lessonOneProgress;
exports.readLessonOneProgress = readLessonOneProgress;
const progress_core_1 = require("./progress-core");
const willkommen_course_1 = require("./willkommen-course");
const willkommen_b_course_1 = require("./willkommen-b-course");
const willkommen_c_course_1 = require("./willkommen-c-course");
const willkommen_d_course_1 = require("./willkommen-d-course");
exports.L1A_SCORES_KEY = 'lernkoko-l1a-scores';
exports.L1A_STEP_KEY = 'lernkoko-l1a-step';
exports.L1B_SCORES_KEY = 'lernkoko-l1b-scores';
exports.L1B_STEP_KEY = 'lernkoko-l1b-step';
exports.L1C_SCORES_KEY = 'lernkoko-l1c-scores';
exports.L1C_STEP_KEY = 'lernkoko-l1c-step';
exports.L1D_SCORES_KEY = 'lernkoko-l1d-scores';
exports.L1D_STEP_KEY = 'lernkoko-l1d-step';
/** The part the learner opened last ("Kaldığın yerden devam et" on the contents page). */
exports.L1_PART_KEY = 'lernkoko-l1-part';
exports.partKeys = { a: { scores: exports.L1A_SCORES_KEY, step: exports.L1A_STEP_KEY }, b: { scores: exports.L1B_SCORES_KEY, step: exports.L1B_STEP_KEY }, c: { scores: exports.L1C_SCORES_KEY, step: exports.L1C_STEP_KEY }, d: { scores: exports.L1D_SCORES_KEY, step: exports.L1D_STEP_KEY } };
exports.partScored = { a: willkommen_course_1.scoredExercises, b: willkommen_b_course_1.scoredExercisesB, c: willkommen_c_course_1.scoredExercisesC, d: willkommen_d_course_1.scoredExercisesD };
/** What the percentages count: the scored exercises and the teaching steps (lib/progress.ts `lessonItems`). */
exports.partCounted = { a: (0, progress_core_1.lessonItems)(willkommen_course_1.scoredExercises, willkommen_course_1.steps), b: (0, progress_core_1.lessonItems)(willkommen_b_course_1.scoredExercisesB, willkommen_b_course_1.stepsB), c: (0, progress_core_1.lessonItems)(willkommen_c_course_1.scoredExercisesC, willkommen_c_course_1.stepsC), d: (0, progress_core_1.lessonItems)(willkommen_d_course_1.scoredExercisesD, willkommen_d_course_1.stepsD) };
function readPartScores(part) {
    try {
        const value = JSON.parse(localStorage.getItem(exports.partKeys[part].scores) ?? '{}');
        return value && typeof value === 'object' ? value : {};
    }
    catch {
        return {};
    }
}
/** Keeps the best result of an exercise. */
function savePartScore(part, id, right, total) {
    const scores = readPartScores(part);
    const old = scores[id];
    if (!old || right > old.right)
        scores[id] = { right, total };
    try {
        localStorage.setItem(exports.partKeys[part].scores, JSON.stringify(scores));
    }
    catch { }
    return scores;
}
const readL1AScores = () => readPartScores('a');
exports.readL1AScores = readL1AScores;
const saveL1AScore = (id, right, total) => savePartScore('a', id, right, total);
exports.saveL1AScore = saveL1AScore;
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
/** Teil A's progress: answers given and answers right. */
function willkommenProgress(scores) { return progressOf(exports.partCounted.a, scores); }
/** One part's progress (its notebook page and its row on the contents page). */
function partProgressL1(part, scores) { return progressOf(exports.partCounted[part], scores); }
/** Lektion 1 as a whole (the unit card on Üniteler and the contents page): every scored exercise of every part. */
function lessonOneProgress(all) {
    const list = Object.keys(exports.partCounted).flatMap(part => exports.partCounted[part].map(exercise => ({ id: part + ':' + exercise.id, total: exercise.total })));
    const scores = {};
    for (const part of Object.keys(exports.partCounted))
        for (const [id, score] of Object.entries(all[part] ?? {}))
            scores[part + ':' + id] = score;
    return progressOf(list, scores);
}
function readLessonOneProgress() { return lessonOneProgress({ a: readPartScores('a'), b: readPartScores('b'), c: readPartScores('c'), d: readPartScores('d') }); }
