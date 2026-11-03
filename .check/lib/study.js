"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starNoteKey = exports.STAR_NOTE_PREFIX = exports.guestRound = exports.guestQuestion = void 0;
exports.starredQuestionIds = starredQuestionIds;
exports.selectQuestions = selectQuestions;
exports.getTopicTitle = getTopicTitle;
const writing_practice_1 = require("./writing-practice");
const course_levels_1 = require("./course-levels");
const course_1 = require("./course");
const english_course_1 = require("./english-course");
const verb_course_1 = require("./verb-course");
/** The guest taste (a visitor without an account): which questions and rounds app/api/study serves without saving. */
var guest_taste_1 = require("./guest-taste");
Object.defineProperty(exports, "guestQuestion", { enumerable: true, get: function () { return guest_taste_1.guestQuestion; } });
Object.defineProperty(exports, "guestRound", { enumerable: true, get: function () { return guest_taste_1.guestRound; } });
/** Stars the learner puts on questions are kept as study notes: star:<question id> = '1'. */
exports.STAR_NOTE_PREFIX = 'star:';
const starNoteKey = (questionId) => exports.STAR_NOTE_PREFIX + questionId;
exports.starNoteKey = starNoteKey;
function starredQuestionIds(notes) {
    return new Set(Object.entries(notes).filter(([key, value]) => key.startsWith(exports.STAR_NOTE_PREFIX) && value === '1').map(([key]) => key.slice(exports.STAR_NOTE_PREFIX.length)));
}
function selectQuestions(mode, topic, count, reviews, onlyIds, course = topic.startsWith('en-') ? 'en' : 'de') {
    const byId = new Map(reviews.map(r => [r.question_id, r]));
    const only = onlyIds ? new Set(onlyIds) : null;
    const curriculum = (0, course_levels_1.curriculumTopicIds)(topic);
    // Yanlışlarım's one round of every mistake (review of the whole site with the chosen ids) also takes the verbs.
    const everyPart = course === 'de' && mode === 'review' && topic === 'all' && !!onlyIds;
    const source = course === 'en' ? english_course_1.englishQuestions : everyPart ? [...course_1.questions, ...verb_course_1.verbQuestions] : course_1.questions;
    const sourceTopics = course === 'en' ? english_course_1.englishTopics : course_1.topics;
    // New and never solved questions first (shuffled together), then right answers due again. Open mistakes go first only in
    // a review round: a normal test is not filled with old mistakes (the learner asked, 3 November 2026).
    const rank = (q) => {
        const r = byId.get(q.id);
        if (!r)
            return 100;
        if (mode === 'review' && r.wrong_count && r.streak < 3)
            return 200 + r.wrong_count * 5 - r.streak * 5;
        if (!(r.streak > 0 || r.seen > r.wrong_count))
            return 100;
        if (r.streak > 0 && r.due_at <= Date.now())
            return 80;
        return 20 - r.seen;
    };
    // Fiiller rounds: new and unsolved questions first (open mistakes first only in a review round); never the same verb twice in a row.
    if ((0, verb_course_1.isVerbTopic)(topic)) {
        let verbPool = verb_course_1.verbQuestions.filter(q => (0, verb_course_1.inVerbTopic)(q.topic, topic) && (!only || only.has(q.id)));
        // Fiil Atölyesi: the learner walks the verbs in a fixed order, so the requested order is kept as it is.
        if (mode === 'workshop' && onlyIds) {
            const byQuestion = new Map(verbPool.map(q => [q.id, q]));
            return onlyIds.map(id => byQuestion.get(id)).filter((q) => !!q).slice(0, count);
        }
        if (mode === 'review')
            verbPool = verbPool.filter(q => { const r = byId.get(q.id); return r && r.wrong_count > 0 && r.streak < 3; });
        else if (mode === 'test' || mode === 'write')
            verbPool = verbPool.filter(q => (0, writing_practice_1.matchesPracticeMode)(q, mode));
        else if (mode === 'listen')
            verbPool = verbPool.filter(q => !!q.audio);
        else if (mode !== 'mixed')
            verbPool = verbPool.filter(q => q.kind === mode);
        return (0, verb_course_1.spreadVerbRound)((0, course_1.shuffle)(verbPool).sort((a, b) => rank(b) - rank(a))).slice(0, count);
    }
    let pool = source.filter(q => (topic === 'all' || q.topic === topic || (course === 'en' ? (0, english_course_1.englishUnitContains)(q.topic, topic) : !!curriculum?.includes(q.topic) || (topic === 'objects-all' && q.topic.startsWith('objects-')) || (topic.startsWith('unit-') && (course_1.topics.find(t => t.id === q.topic)?.unit ?? 1) === Number(topic.slice(5))))) && (!only || only.has(q.id)));
    if (mode === 'review')
        pool = pool.filter(q => { const r = byId.get(q.id); return r && r.wrong_count > 0 && r.streak < 3; });
    else if (mode === 'test' || mode === 'write')
        pool = pool.filter(q => (0, writing_practice_1.matchesPracticeMode)(q, mode));
    else if (mode === 'listen')
        pool = pool.filter(q => !!q.audio);
    else if (mode === 'dictation')
        pool = pool.filter(q => q.practice === 'dictation' || (q.kind === 'write' && !!q.audio && !q.practice));
    else if (mode === 'sentence')
        pool = pool.filter(q => q.practice === 'sentence');
    else if (mode === 'visual')
        pool = pool.filter(q => !!q.image);
    else if (mode !== 'mixed')
        pool = pool.filter(q => q.kind === mode);
    if (everyPart)
        return (0, course_1.shuffle)(pool).slice(0, count);
    pool = (0, course_1.shuffle)(pool).sort((a, b) => rank(b) - rank(a));
    const result = [];
    const used = new Set();
    const take = (q) => { if (!used.has(q.id) && result.length < count) {
        result.push(q);
        used.add(q.id);
    } };
    if (mode === 'mixed' || mode === 'test' || mode === 'write') {
        const family = (q) => mode === 'write' ? (0, writing_practice_1.writingFamily)(q) : q.image ? 'visual' : q.practice === 'sentence' ? 'sentence' : q.practice === 'dictation' || (q.kind === 'write' && q.audio) ? 'dictation' : q.kind === 'read' ? 'read' : q.audio ? 'listen' : q.options ? 'choice' : 'write';
        // Whole-level practice visits each textbook chapter before revisiting one.
        // Legacy subtopics are grouped with their chapter, so a large old unit cannot
        // crowd the smaller chapters out of a twenty-question mixed session.
        if (['a11-all', 'a12-all', 'en-a11-all', 'en-a12-all'].includes(topic)) {
            const chapterIds = (0, course_1.shuffle)([...new Set(pool.map(q => (0, course_levels_1.courseUnitForTopic)(q.topic)?.id ?? q.topic))]);
            const chapterBuckets = chapterIds.map(id => pool.filter(q => ((0, course_levels_1.courseUnitForTopic)(q.topic)?.id ?? q.topic) === id));
            const kinds = (0, course_1.shuffle)([...new Set(pool.map(family))]);
            for (let depth = 0; depth < pool.length && result.length < count; depth++) {
                let available = false;
                for (let i = 0; i < chapterBuckets.length; i++) {
                    const candidates = chapterBuckets[i].filter(q => !used.has(q.id));
                    const item = candidates.find(q => family(q) === kinds[(i + depth) % kinds.length]) ?? candidates[0];
                    if (item) {
                        take(item);
                        available = true;
                    }
                }
                if (!available)
                    break;
            }
            return result;
        }
        const families = (0, course_1.shuffle)([...new Set(pool.map(family))]);
        const queues = families.map(f => {
            const topicBuckets = (0, course_1.shuffle)(sourceTopics.map(t => pool.filter(q => q.topic === t.id && family(q) === f)).filter(b => b.length));
            const queue = [];
            for (let depth = 0; depth < pool.length; depth++) {
                let found = false;
                for (const bucket of topicBuckets) {
                    if (bucket[depth]) {
                        queue.push(bucket[depth]);
                        found = true;
                    }
                }
                if (!found)
                    break;
            }
            return queue;
        });
        for (let depth = 0; depth < pool.length && result.length < count; depth++) {
            let found = false;
            for (const queue of queues) {
                if (queue[depth]) {
                    take(queue[depth]);
                    found = true;
                }
            }
            if (!found)
                break;
        }
        return result;
    }
    const buckets = (0, course_1.shuffle)(sourceTopics.map(t => pool.filter(q => q.topic === t.id)));
    for (let index = 0; index < source.length && result.length < count; index++) {
        let available = false;
        for (const bucket of buckets) {
            if (bucket[index]) {
                available = true;
                take(bucket[index]);
            }
        }
        if (!available)
            break;
    }
    return (0, course_1.shuffle)(result);
}
function getTopicTitle(id) { return id === 'unit-1' ? '1. ünite · Willkommen!' : id === 'unit-8' ? '8. ünite · Eine Party' : id === 'unit-9' ? '9. ünite · Termine' : course_1.topics.find(t => t.id === id)?.title ?? 'Tüm konular'; }
