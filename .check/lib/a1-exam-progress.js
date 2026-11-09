"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examsSolved = exports.a1ExamRunKey = exports.A1_EXAM_SCORES_KEY = void 0;
exports.readExamScores = readExamScores;
exports.saveExamScore = saveExamScore;
exports.readExamRun = readExamRun;
exports.saveExamRun = saveExamRun;
exports.clearExamRun = clearExamRun;
exports.examSectionProgress = examSectionProgress;
exports.clock = clock;
const progress_core_1 = require("./progress-core");
const a1_exam_course_1 = require("./a1-exam-course");
/**
 * A1 sınavı keeps its results in the browser like the lessons: the best result of every exam
 * (`lernkoko-a1-exam-scores`, by exam id) and the answers of the exam the learner is solving or solved last
 * (`lernkoko-a1-exam-run:<exam id>`). Both travel with the account (lib/lesson-sync.ts, `site`: two score lists are
 * joined, the better result stays) and go away with Hesabım → „İlerlememi sıfırla“. A visitor's answers are not kept.
 */
exports.A1_EXAM_SCORES_KEY = 'lernkoko-a1-exam-scores';
const a1ExamRunKey = (examId) => 'lernkoko-a1-exam-run:' + examId;
exports.a1ExamRunKey = a1ExamRunKey;
const isAnswer = (value) => value === 'r' || value === 'f' || value === 'a' || value === 'b';
const whole = (value, max) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(max, Math.floor(value))) : 0;
function readExamScores(storage) {
    let data = null;
    try {
        data = JSON.parse(storage.getItem(exports.A1_EXAM_SCORES_KEY) ?? '{}');
    }
    catch {
        return {};
    }
    if (!data || typeof data !== 'object' || Array.isArray(data))
        return {};
    const out = {};
    for (const [id, value] of Object.entries(data)) {
        if (!value || typeof value !== 'object')
            continue;
        const score = value;
        if (typeof score.right !== 'number' || typeof score.total !== 'number' || score.total <= 0)
            continue;
        out[id] = { right: whole(score.right, score.total), total: whole(score.total, 999), ...(typeof score.tries === 'number' ? { tries: whole(score.tries, 9999) } : {}), ...(typeof score.seconds === 'number' ? { seconds: whole(score.seconds, 86400) } : {}), ...(typeof score.at === 'number' ? { at: score.at } : {}) };
    }
    return out;
}
/** Keeps the best result of an exam (a tie keeps the faster one) and counts the attempt. */
function saveExamScore(storage, examId, right, total, seconds, now = Date.now()) {
    const scores = readExamScores(storage);
    const old = scores[examId];
    const tries = (old?.tries ?? 0) + 1;
    const better = !old || right > old.right || (right === old.right && seconds > 0 && (!old.seconds || seconds < old.seconds));
    scores[examId] = better ? { right, total, tries, seconds, at: now } : { ...old, tries };
    try {
        storage.setItem(exports.A1_EXAM_SCORES_KEY, JSON.stringify(scores));
    }
    catch { }
    return scores;
}
/** The saved run of an exam; only marks for that exam's own items are read back. */
function readExamRun(storage, examId) {
    let data = null;
    try {
        data = JSON.parse(storage.getItem((0, exports.a1ExamRunKey)(examId)) ?? 'null');
    }
    catch {
        return null;
    }
    if (!data || typeof data !== 'object')
        return null;
    const run = data;
    const answers = {};
    if (run.answers && typeof run.answers === 'object')
        for (const [id, value] of Object.entries(run.answers))
            if (id.startsWith(examId + '-') && isAnswer(value))
                answers[id] = value;
    const teil = run.teil === 2 || run.teil === 3 ? run.teil : 1;
    return { answers, seconds: whole(run.seconds, 86400), teil, timed: run.timed !== false, done: run.done === true };
}
function saveExamRun(storage, examId, run) { try {
    storage.setItem((0, exports.a1ExamRunKey)(examId), JSON.stringify(run));
}
catch { } }
function clearExamRun(storage, examId) { try {
    storage.removeItem((0, exports.a1ExamRunKey)(examId));
}
catch { } }
const ratio = (part, total) => total ? Math.round(part / total * 100) : 0;
/** The section as a whole: every exam's 15 points; an exam counts as tried once it was handed in. */
function examSectionProgress(scores) {
    let total = 0, tried = 0, learned = 0;
    for (const exam of a1_exam_course_1.lesenExamList) {
        total += a1_exam_course_1.LESEN_TOTAL;
        const score = scores[exam.id];
        if (!score)
            continue;
        tried += a1_exam_course_1.LESEN_TOTAL;
        learned += Math.max(0, Math.min(a1_exam_course_1.LESEN_TOTAL, score.right));
    }
    const percent = ratio(learned, total);
    return { total, tried, learned, percent, triedPercent: Math.max(percent, ratio(tried, total)), stars: (0, progress_core_1.starsFor)(percent), stage: (0, progress_core_1.stageFor)(percent, tried) };
}
/** How many exams were handed in. */
const examsSolved = (scores) => a1_exam_course_1.lesenExamList.filter(exam => scores[exam.id]).length;
exports.examsSolved = examsSolved;
/** 754 seconds → "12:34". */
function clock(seconds) { const s = Math.max(0, Math.floor(seconds)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
