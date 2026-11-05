"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modeLabels = exports.questionMap = exports.learningTopics = exports.questions = exports.alphabet = exports.words = exports.topics = void 0;
exports.normalizeAnswer = normalizeAnswer;
exports.gradeAnswer = gradeAnswer;
exports.shuffle = shuffle;
const object_course_1 = require("./object-course");
const level_course_1 = require("./level-course");
const english_course_1 = require("./english-course");
const housing_course_1 = require("./housing-course");
const verb_course_1 = require("./verb-course");
// Only the requested Wohnen chapter adds textbook exercises; other units stay catalogue-only.
exports.topics = [...object_course_1.objectTopics, ...level_course_1.levelTopics, ...housing_course_1.housingTopics];
exports.words = object_course_1.objectWords;
exports.alphabet = [['A', 'a'], ['B', 'be'], ['C', 'tse'], ['D', 'de'], ['E', 'e'], ['F', 'ef'], ['G', 'ge'], ['H', 'ha'], ['I', 'i'], ['J', 'jot'], ['K', 'ka'], ['L', 'el'], ['M', 'em'], ['N', 'en'], ['O', 'o'], ['P', 'pe'], ['Q', 'ku'], ['R', 'er'], ['S', 'es'], ['T', 'te'], ['U', 'u'], ['V', 'fau'], ['W', 'we'], ['X', 'iks'], ['Y', 'Ypsilon'], ['Z', 'zett'], ['Ä', 'a-Umlaut'], ['Ö', 'o-Umlaut'], ['Ü', 'u-Umlaut'], ['ß', 'Eszett']];
exports.questions = [...object_course_1.objectQuestions, ...housing_course_1.housingQuestions];
// Fiiller (verbs-*) has its own page; it stays out of the A1 catalogue topics.
exports.learningTopics = [...exports.topics, ...english_course_1.englishTopics, ...verb_course_1.verbTopics];
exports.questionMap = new Map([...exports.questions, ...english_course_1.englishQuestions, ...verb_course_1.verbQuestions].map(q => [q.id, q]));
exports.modeLabels = { mixed: 'Karma tekrar', workshop: 'Fiil Atölyesi', test: 'Test', choice: 'Test', listen: 'Hören · Dinleme', read: 'Lesen · Okuma', write: 'Yazarak Pekiştir · Schreiben', dictation: 'Diktat', sentence: 'Günlük cümle kurma', visual: 'Görselli test', review: 'Yanlışları tekrar et' };
function normalizeAnswer(value, strictCase = false) {
    let s = value.normalize('NFC').replace(/[’‘]/g, "'").trim().replace(/[.!?]+$/, '').replace(/\s+/g, ' ');
    if (!strictCase)
        s = s.toLocaleLowerCase('de-DE');
    return s;
}
function gradeAnswer(q, answer) {
    // Single punctuation choices must stay exact; stripping punctuation would merge ? and . .
    if (q.options)
        return answer === q.answer;
    return [q.answer, ...(q.accepted ?? [])].some(a => normalizeAnswer(a, !!q.strictCase) === normalizeAnswer(answer, !!q.strictCase));
}
function shuffle(items) { const result = [...items]; for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
} return result; }
