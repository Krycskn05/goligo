"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.l4PartCounted = exports.L4_PART_KEY = exports.l4PartKeys = void 0;
exports.readL4Scores = readL4Scores;
exports.saveL4Score = saveL4Score;
exports.partProgressL4 = partProgressL4;
exports.lessonFourProgress = lessonFourProgress;
exports.readLessonFourProgress = readLessonFourProgress;
const progress_core_1 = require("./progress-core");
const familie_course_1 = require("./familie-course");
/**
 * Lektion 4 „Familie“ keeps its scores in the browser, like Lektion 3 (lib/orte-progress.ts): the best result of every
 * scored exercise of a part, by step id. The keys travel with the account (lib/lesson-sync.ts, lesson `l4`); the
 * learner's own sentences and the Elfchen (`lernkoko-l4a-own` …) stay on the device.
 */
exports.l4PartKeys = {
    a: { scores: 'lernkoko-l4a-scores', step: 'lernkoko-l4a-step' }, b: { scores: 'lernkoko-l4b-scores', step: 'lernkoko-l4b-step' },
    c: { scores: 'lernkoko-l4c-scores', step: 'lernkoko-l4c-step' }, d: { scores: 'lernkoko-l4d-scores', step: 'lernkoko-l4d-step' },
};
/** The part the learner opened last. */
exports.L4_PART_KEY = 'lernkoko-l4-part';
/** What the percentages count: the scored exercises, the teaching steps and Konuş (lib/progress-core.ts `lessonItems`). */
exports.l4PartCounted = {
    a: (0, progress_core_1.lessonItems)(familie_course_1.familieScored.a, familie_course_1.familieParts.a.steps), b: (0, progress_core_1.lessonItems)(familie_course_1.familieScored.b, familie_course_1.familieParts.b.steps), c: (0, progress_core_1.lessonItems)(familie_course_1.familieScored.c, familie_course_1.familieParts.c.steps), d: (0, progress_core_1.lessonItems)(familie_course_1.familieScored.d, familie_course_1.familieParts.d.steps),
};
function readL4Scores(part) {
    try {
        const value = JSON.parse(localStorage.getItem(exports.l4PartKeys[part].scores) ?? '{}');
        return value && typeof value === 'object' ? value : {};
    }
    catch {
        return {};
    }
}
/** Keeps the best result of an exercise. */
function saveL4Score(part, id, right, total) {
    const scores = readL4Scores(part);
    const old = scores[id];
    if (!old || right > old.right)
        scores[id] = { right, total };
    try {
        localStorage.setItem(exports.l4PartKeys[part].scores, JSON.stringify(scores));
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
function partProgressL4(part, scores) { return progressOf(exports.l4PartCounted[part], scores); }
/** Lektion 4 as a whole (the unit card on Üniteler). */
function lessonFourProgress(all) {
    const list = familie_course_1.familiePartOrder.flatMap(part => exports.l4PartCounted[part].map(exercise => ({ id: part + ':' + exercise.id, total: exercise.total })));
    const scores = {};
    for (const part of familie_course_1.familiePartOrder)
        for (const [id, score] of Object.entries(all[part] ?? {}))
            scores[part + ':' + id] = score;
    return progressOf(list, scores);
}
function readLessonFourProgress() { return lessonFourProgress({ a: readL4Scores('a'), b: readL4Scores('b'), c: readL4Scores('c'), d: readL4Scores('d') }); }
