"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectSolved = exports.isObjectMistake = void 0;
exports.pickObjectQuestions = pickObjectQuestions;
exports.objectReviewWords = objectReviewWords;
exports.isObjectPictureQuestion = isObjectPictureQuestion;
exports.isObjectListeningQuestion = isObjectListeningQuestion;
exports.objectListeningPool = objectListeningPool;
exports.pickObjectListeningQuiz = pickObjectListeningQuiz;
exports.pictureQuizReviews = pictureQuizReviews;
exports.pickPictureQuiz = pickPictureQuiz;
exports.isObjectWritingQuestion = isObjectWritingQuestion;
exports.objectWritingPool = objectWritingPool;
exports.pickObjectWritingQuiz = pickObjectWritingQuiz;
const object_course_1 = require("./object-course");
const course_1 = require("./course");
/** A round asks about each object once; incorrect answers get another retrieval opportunity. */
function pickObjectQuestions(mode, group, count, reviews, scene) {
    const byId = new Map(reviews.map(r => [r.question_id, r]));
    let pool = (0, object_course_1.objectQuestionPool)(mode, group, scene);
    if (mode === 'review')
        pool = pool.filter(q => { const r = byId.get(q.id); return r && r.wrong_count > 0 && r.streak < 3; });
    const rank = (q) => { const r = byId.get(q.id); return r?.wrong_count && r.streak < 3 ? 100 + r.wrong_count * 5 - r.streak : !r ? 50 : r.due_at <= Date.now() ? 25 : 5 - r.seen; };
    const family = (q) => q.sceneFind ? 'scene' : q.practice === 'dictation' ? 'dictation' : q.kind === 'read' ? 'read' : q.kind === 'listen' ? 'listen' : q.kind === 'write' ? 'write' : 'visual';
    const ordered = (0, course_1.shuffle)(pool).sort((a, b) => rank(b) - rank(a));
    const families = mode === 'mixed' ? (0, course_1.shuffle)([...new Set(ordered.map(family))]) : ['all'];
    const buckets = families.map(f => ordered.filter(q => f === 'all' || family(q) === f));
    const result = [];
    const used = new Set();
    for (const q of ordered) {
        const r = byId.get(q.id);
        if (r && r.wrong_count > 0 && r.streak < 3 && !used.has(q.objectId ?? q.id) && result.length < count) {
            used.add(q.objectId ?? q.id);
            result.push(q);
        }
    }
    for (let i = 0; i < pool.length && result.length < count; i++) {
        let found = false;
        for (const bucket of buckets) {
            const q = bucket[i];
            if (!q)
                continue;
            found = true;
            const word = q.objectId ?? q.id;
            if (!used.has(word) && result.length < count) {
                used.add(word);
                result.push(q);
            }
        }
        if (!found)
            break;
    }
    return result;
}
const isObjectMistake = (row) => !!row && row.wrong_count > 0 && row.streak < 3;
exports.isObjectMistake = isObjectMistake;
/**
 * Solved = answered right at least once: once every question here is solved, a normal round mixes them all again and
 * a new test must not be only the old mistakes again (the learner asked, 3 November 2026). A later wrong answer puts it
 * on the mistakes list (the review button), not back into the normal rounds.
 */
const isObjectSolved = (row) => !!row && (row.streak > 0 || row.seen > row.wrong_count);
exports.isObjectSolved = isObjectSolved;
function mix(items, random = Math.random) { const result = [...items]; for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
} return result; }
/** Review = open mistakes plus starred questions. A fresh round leaves out solved questions until none are left. */
function roundPool(pool, reviews, reviewOnly, options) {
    const byId = new Map(reviews.map(r => [r.question_id, r]));
    const starred = options.starred ?? new Set();
    if (reviewOnly)
        return pool.filter(q => (0, exports.isObjectMistake)(byId.get(q.id)) || starred.has(q.id));
    if (!options.fresh)
        return pool;
    const open = pool.filter(q => !(0, exports.isObjectSolved)(byId.get(q.id)));
    return open.length ? open : pool;
}
function objectReviewWords(reviews) {
    const byId = new Map(object_course_1.objectQuestions.map(q => [q.id, q]));
    return new Set(reviews.filter(r => byId.has(r.question_id) && r.wrong_count > 0 && r.streak < 3).map(r => byId.get(r.question_id).objectId));
}
/** Only the picture-to-word questions belong to the new four-choice section. */
function isObjectPictureQuestion(q) {
    return !!q && q.id.startsWith('obj-picture-') && q.kind === 'choice' && !!q.image && !!q.objectId && q.options?.length === 4 && new Set(q.options).size === 4 && q.options.includes(q.answer);
}
/** Hear one word, then identify its picture among four distinct objects. */
function isObjectListeningQuestion(q) {
    return !!q && q.id.startsWith('obj-hear-picture-') && q.kind === 'listen' && !!q.audio && !!q.objectId && q.options?.length === 4 && new Set(q.options).size === 4 && q.pictureOptions?.length === 4 && new Set(q.pictureOptions).size === 4 && q.pictureOptions.includes(q.objectId);
}
function objectListeningPool(group = 'all') {
    return object_course_1.objectQuestions.filter(q => isObjectListeningQuestion(q) && (group === 'all' || q.topic === group));
}
function pickObjectListeningQuiz(group, count, reviews, reviewOnly = false, onlyIds, options = {}) {
    const only = onlyIds ? new Set(onlyIds) : null;
    const pool = roundPool(objectListeningPool(group).filter(q => !only || only.has(q.id)), reviews, reviewOnly, options);
    return mix(pool, options.random).slice(0, count === 'all' ? pool.length : count);
}
function pictureQuizReviews(reviews) {
    const ids = new Set(object_course_1.objectQuestions.filter(isObjectPictureQuestion).map(q => q.id));
    return reviews.filter(r => ids.has(r.question_id));
}
function pickPictureQuiz(group, count, reviews, reviewOnly = false, onlyIds, options = {}) {
    const only = onlyIds ? new Set(onlyIds) : null;
    const pool = roundPool(object_course_1.objectQuestions.filter(q => isObjectPictureQuestion(q) && (group === 'all' || q.topic === group) && (!only || only.has(q.id))), pictureQuizReviews(reviews), reviewOnly, options);
    return mix(pool, options.random).slice(0, count === 'all' ? pool.length : count);
}
/** Written retrieval has its own pool and does not change picture tests. */
function isObjectWritingQuestion(q) {
    return !!q && !!q.objectId && q.kind === 'write' && !q.audio && !q.sceneFind;
}
function objectWritingPool(group = 'all') {
    return object_course_1.objectQuestions.filter(q => isObjectWritingQuestion(q) && (group === 'all' || q.topic === group));
}
function pickObjectWritingQuiz(group, count, reviews, reviewOnly = false, onlyIds, options = {}) {
    const only = onlyIds ? new Set(onlyIds) : null;
    const pool = roundPool(objectWritingPool(group).filter(q => !only || only.has(q.id)), reviews, reviewOnly, options);
    const ordered = mix(pool, options.random);
    // Word, gap and plural puzzles still take turns, each in a new random order.
    const families = mix([ordered.filter(q => !q.gap), ordered.filter(q => !!q.gap && !q.articlePuzzle), ordered.filter(q => q.articlePuzzle?.variant === 'plural')].filter(bucket => bucket.length), options.random);
    const result = [];
    const size = count === 'all' ? pool.length : Math.min(count, pool.length);
    for (let depth = 0; depth < pool.length && result.length < size; depth++)
        for (const bucket of families)
            if (bucket[depth] && result.length < size)
                result.push(bucket[depth]);
    return result;
}
