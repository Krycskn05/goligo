"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDictation = void 0;
exports.hasPractice = hasPractice;
exports.practicePool = practicePool;
exports.retryKey = retryKey;
const course_levels_1 = require("./course-levels");
const writing_practice_1 = require("./writing-practice");
const course_1 = require("./course");
const isDictation = (q) => q.practice === 'dictation' || (q.kind === 'write' && !!q.audio && !q.practice);
exports.isDictation = isDictation;
function hasPractice(mode, topic, reviews = []) {
    const reviewIds = new Set(reviews.filter(r => r.wrong_count > 0 && r.streak < 3).map(r => r.question_id));
    return course_1.questions.some(q => (topic === 'all' || (0, course_levels_1.inCourseUnit)(q.topic, topic) || (topic === 'objects-all' && q.topic.startsWith('objects-')) || (topic.startsWith('unit-') && (course_1.topics.find(t => t.id === q.topic)?.unit ?? 1) === Number(topic.slice(5)))) && (mode === 'mixed' ? true : mode === 'test' || mode === 'write' ? (0, writing_practice_1.matchesPracticeMode)(q, mode) : mode === 'review' ? reviewIds.has(q.id) : mode === 'listen' ? !!q.audio : mode === 'dictation' ? (0, exports.isDictation)(q) : mode === 'sentence' ? q.practice === 'sentence' : mode === 'visual' ? !!q.image : q.kind === mode));
}
function practicePool(mode, unit, topicId, scene) {
    return course_1.questions.filter(q => (topicId ? q.topic === topicId : (course_1.topics.find(t => t.id === q.topic)?.unit ?? 1) === unit) && (!scene || q.scene === scene) && (mode === 'sentence' ? q.practice === 'sentence' : mode === 'dictation' ? (0, exports.isDictation)(q) : mode === 'visual' ? !!q.image : mode === 'write' || mode === 'mixed' ? q.kind === 'write' : mode === 'listen' ? !!q.audio : mode === 'read' ? q.kind === 'read' : q.kind === 'choice'));
}
function retryKey(mode, topic, count, ids) { return JSON.stringify([mode, topic, count, ids ?? null]); }
