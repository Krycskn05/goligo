"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.l3PartCounted = exports.L3_PART_KEY = exports.l3PartKeys = void 0;
exports.readL3Scores = readL3Scores;
exports.saveL3Score = saveL3Score;
exports.partProgressL3 = partProgressL3;
exports.lessonThreeProgress = lessonThreeProgress;
exports.readLessonThreeProgress = readLessonThreeProgress;
const progress_core_1 = require("./progress-core");
const orte_course_1 = require("./orte-course");
/**
 * Lektion 3 „Orte und Dinge“ keeps its scores in the browser, like Lektion 2 (lib/berufe-progress.ts): the best result of
 * every scored exercise of a part, by step id. The keys travel with the account (lib/lesson-sync.ts, lesson `l3`); the
 * learner's own sentences (`lernkoko-l3a-own` …) stay on the device.
 */
exports.l3PartKeys = {
    a: { scores: 'lernkoko-l3a-scores', step: 'lernkoko-l3a-step' }, b: { scores: 'lernkoko-l3b-scores', step: 'lernkoko-l3b-step' },
    c: { scores: 'lernkoko-l3c-scores', step: 'lernkoko-l3c-step' }, d: { scores: 'lernkoko-l3d-scores', step: 'lernkoko-l3d-step' },
};
/** The part the learner opened last. */
exports.L3_PART_KEY = 'lernkoko-l3-part';
/** What the percentages count: the scored exercises, the teaching steps and Konuş (lib/progress-core.ts `lessonItems`). */
exports.l3PartCounted = {
    a: (0, progress_core_1.lessonItems)(orte_course_1.orteScored.a, orte_course_1.orteParts.a.steps), b: (0, progress_core_1.lessonItems)(orte_course_1.orteScored.b, orte_course_1.orteParts.b.steps), c: (0, progress_core_1.lessonItems)(orte_course_1.orteScored.c, orte_course_1.orteParts.c.steps), d: (0, progress_core_1.lessonItems)(orte_course_1.orteScored.d, orte_course_1.orteParts.d.steps),
};
function readL3Scores(part) {
    try {
        const value = JSON.parse(localStorage.getItem(exports.l3PartKeys[part].scores) ?? '{}');
        return value && typeof value === 'object' ? value : {};
    }
    catch {
        return {};
    }
}
/** Keeps the best result of an exercise. */
function saveL3Score(part, id, right, total) {
    const scores = readL3Scores(part);
    const old = scores[id];
    if (!old || right > old.right)
        scores[id] = { right, total };
    try {
        localStorage.setItem(exports.l3PartKeys[part].scores, JSON.stringify(scores));
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
function partProgressL3(part, scores) { return progressOf(exports.l3PartCounted[part], scores); }
/** Lektion 3 as a whole (the unit card on Üniteler). */
function lessonThreeProgress(all) {
    const list = orte_course_1.ortePartOrder.flatMap(part => exports.l3PartCounted[part].map(exercise => ({ id: part + ':' + exercise.id, total: exercise.total })));
    const scores = {};
    for (const part of orte_course_1.ortePartOrder)
        for (const [id, score] of Object.entries(all[part] ?? {}))
            scores[part + ':' + id] = score;
    return progressOf(list, scores);
}
function readLessonThreeProgress() { return lessonThreeProgress({ a: readL3Scores('a'), b: readL3Scores('b'), c: readL3Scores('c'), d: readL3Scores('d') }); }
