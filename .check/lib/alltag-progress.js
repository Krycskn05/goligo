"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.l5PartCounted = exports.L5_PART_KEY = exports.l5PartKeys = void 0;
exports.readL5Scores = readL5Scores;
exports.saveL5Score = saveL5Score;
exports.partProgressL5 = partProgressL5;
exports.lessonFiveProgress = lessonFiveProgress;
exports.readLessonFiveProgress = readLessonFiveProgress;
const progress_core_1 = require("./progress-core");
const alltag_course_1 = require("./alltag-course");
/**
 * Lektion 5 „Alltag und Freizeit“ keeps its scores in the browser, like Lektion 3 (lib/orte-progress.ts): the best result of every
 * scored exercise of a part, by step id. The keys travel with the account (lib/lesson-sync.ts, lesson `l5`); the
 * learner's own sentences (`lernkoko-l5a-own` …) stay on the device.
 */
exports.l5PartKeys = {
    a: { scores: 'lernkoko-l5a-scores', step: 'lernkoko-l5a-step' }, b: { scores: 'lernkoko-l5b-scores', step: 'lernkoko-l5b-step' },
    c: { scores: 'lernkoko-l5c-scores', step: 'lernkoko-l5c-step' }, d: { scores: 'lernkoko-l5d-scores', step: 'lernkoko-l5d-step' },
};
/** The part the learner opened last. */
exports.L5_PART_KEY = 'lernkoko-l5-part';
/** What the percentages count: the scored exercises, the teaching steps and Konuş (lib/progress-core.ts `lessonItems`). */
exports.l5PartCounted = {
    a: (0, progress_core_1.lessonItems)(alltag_course_1.alltagScored.a, alltag_course_1.alltagParts.a.steps), b: (0, progress_core_1.lessonItems)(alltag_course_1.alltagScored.b, alltag_course_1.alltagParts.b.steps), c: (0, progress_core_1.lessonItems)(alltag_course_1.alltagScored.c, alltag_course_1.alltagParts.c.steps), d: (0, progress_core_1.lessonItems)(alltag_course_1.alltagScored.d, alltag_course_1.alltagParts.d.steps),
};
function readL5Scores(part) {
    try {
        const value = JSON.parse(localStorage.getItem(exports.l5PartKeys[part].scores) ?? '{}');
        return value && typeof value === 'object' ? value : {};
    }
    catch {
        return {};
    }
}
/** Keeps the best result of an exercise. */
function saveL5Score(part, id, right, total) {
    const scores = readL5Scores(part);
    const old = scores[id];
    if (!old || right > old.right)
        scores[id] = { right, total };
    try {
        localStorage.setItem(exports.l5PartKeys[part].scores, JSON.stringify(scores));
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
function partProgressL5(part, scores) { return progressOf(exports.l5PartCounted[part], scores); }
/** Lektion 5 as a whole (the unit card on Üniteler). */
function lessonFiveProgress(all) {
    const list = alltag_course_1.alltagPartOrder.flatMap(part => exports.l5PartCounted[part].map(exercise => ({ id: part + ':' + exercise.id, total: exercise.total })));
    const scores = {};
    for (const part of alltag_course_1.alltagPartOrder)
        for (const [id, score] of Object.entries(all[part] ?? {}))
            scores[part + ':' + id] = score;
    return progressOf(list, scores);
}
function readLessonFiveProgress() { return lessonFiveProgress({ a: readL5Scores('a'), b: readL5Scores('b'), c: readL5Scores('c'), d: readL5Scores('d') }); }
