"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerbSolved = exports.isVerbMistake = void 0;
exports.isVerbTestQuestion = isVerbTestQuestion;
exports.isVerbWritingQuestion = isVerbWritingQuestion;
exports.isVerbListeningQuestion = isVerbListeningQuestion;
exports.isVerbAuxQuestion = isVerbAuxQuestion;
exports.isVerbExercise = isVerbExercise;
exports.verbModePredicate = verbModePredicate;
exports.verbSessionMode = verbSessionMode;
exports.verbPracticeMode = verbPracticeMode;
exports.verbPool = verbPool;
exports.pickVerbRound = pickVerbRound;
const verb_course_1 = require("./verb-course");
/** Fiiller has three practice modes, like Nesne Kasası: choose, write (letter puzzles), listen. */
// meaning-perfekt (the Perfekt among other verbs' forms) is no longer asked: it mixed the verbs up. Its questions stay in the bank for old rounds.
const testTasks = ['meaning', 'word', 'fit', 'praesens', 'perfekt', 'partizip'];
const writeTasks = ['write', 'write-praesens', 'write-perfekt', 'write-partizip'];
const listenTasks = ['hear', 'hear-praesens', 'hear-perfekt'];
const fourChoices = (q) => q.options?.length === 4 && new Set(q.options).size === 4 && q.options.includes(q.answer);
function isVerbTestQuestion(q) {
    return !!q && q.id.startsWith('verb-') && !!q.verbId && q.kind === 'choice' && !!q.verbTask && testTasks.includes(q.verbTask) && !q.audio && fourChoices(q);
}
function isVerbWritingQuestion(q) {
    return !!q && q.id.startsWith('verb-') && !!q.verbId && q.kind === 'write' && !!q.verbTask && writeTasks.includes(q.verbTask) && !q.options && !q.audio;
}
function isVerbListeningQuestion(q) {
    return !!q && q.id.startsWith('verb-') && !!q.verbId && q.kind === 'listen' && !!q.verbTask && listenTasks.includes(q.verbTask) && !!q.audio && fourChoices(q);
}
/** Fiil Atölyesi's last step of a verb: the Perfekt's helping verb, hat or ist (two choices, 9 November 2026). */
function isVerbAuxQuestion(q) {
    return !!q && q.id.startsWith('verb-') && !!q.verbId && q.kind === 'choice' && q.verbTask === 'aux' && !q.audio && q.options?.length === 2 && q.options.includes('hat') && q.options.includes('ist') && q.options.includes(q.answer);
}
function isVerbExercise(q) { return isVerbTestQuestion(q) || isVerbWritingQuestion(q) || isVerbListeningQuestion(q) || isVerbAuxQuestion(q); }
/** Fiil Atölyesi (workshop), its mistakes round (review) and Karma sınav (mixed) use every kind of exercise. */
function verbModePredicate(mode) { return mode === 'write' ? isVerbWritingQuestion : mode === 'listen' ? isVerbListeningQuestion : mode === 'workshop' || mode === 'mixed' || mode === 'review' ? isVerbExercise : isVerbTestQuestion; }
/** Session mode stored on the server for each practice mode. */
function verbSessionMode(mode) { return mode === 'write' ? 'write' : mode === 'listen' ? 'listen' : 'test'; }
function verbPracticeMode(sessionMode) { return sessionMode === 'write' ? 'write' : sessionMode === 'listen' ? 'listen' : 'test'; }
function verbPool(mode, topic) { return verb_course_1.verbQuestions.filter(q => verbModePredicate(mode)(q) && (0, verb_course_1.inVerbTopic)(q.topic, topic)); }
const isVerbMistake = (row) => !!row && row.wrong_count > 0 && row.streak < 3;
exports.isVerbMistake = isVerbMistake;
/** Answered right at least once (3 November 2026, as in Nesne Kasası): a later wrong answer goes to the review button only. */
const isVerbSolved = (row) => !!row && (row.streak > 0 || row.seen > row.wrong_count);
exports.isVerbSolved = isVerbSolved;
/**
 * Questions for one round. Review = open mistakes plus starred questions.
 * A normal round leaves out solved questions until none are left, then repeats them all.
 */
function pickVerbRound(mode, topic, reviews, reviewOnly = false, onlyIds, options = {}) {
    const byId = new Map(reviews.map(row => [row.question_id, row]));
    const only = onlyIds ? new Set(onlyIds) : null;
    const starred = options.starred ?? new Set();
    const pool = verbPool(mode, topic).filter(q => !only || only.has(q.id));
    if (reviewOnly)
        return pool.filter(q => (0, exports.isVerbMistake)(byId.get(q.id)) || starred.has(q.id));
    if (!options.fresh)
        return pool;
    const open = pool.filter(q => !(0, exports.isVerbSolved)(byId.get(q.id)));
    return open.length ? open : pool;
}
