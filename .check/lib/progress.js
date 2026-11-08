"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseKey = exports.DAILY_GOAL = exports.XP_TRY = exports.XP_CORRECT = void 0;
exports.isLearned = isLearned;
exports.topicProgress = topicProgress;
exports.housingProgressIds = housingProgressIds;
exports.isVaultExercise = isVaultExercise;
exports.objectProgressIds = objectProgressIds;
exports.verbProgressIds = verbProgressIds;
exports.verbProgress = verbProgress;
exports.learnedVerbs = learnedVerbs;
exports.housingProgress = housingProgress;
exports.objectProgress = objectProgress;
exports.xpFor = xpFor;
exports.levelStart = levelStart;
exports.levelFromXp = levelFromXp;
exports.dayKey = dayKey;
exports.dayStreak = dayStreak;
exports.progressSummary = progressSummary;
exports.roundXp = roundXp;
exports.partMistakes = partMistakes;
exports.allMistakeIds = allMistakeIds;
const housing_course_1 = require("./housing-course");
const object_course_1 = require("./object-course");
const object_practice_1 = require("./object-practice");
const verb_course_1 = require("./verb-course");
const verb_practice_1 = require("./verb-practice");
const verb_workshop_1 = require("./verb-workshop");
const progress_core_1 = require("./progress-core");
__exportStar(require("./progress-core"), exports);
exports.XP_CORRECT = 10;
exports.XP_TRY = 2;
exports.DAILY_GOAL = 20;
const DAY = 86400000;
function ratio(part, total) {
    if (!total || part <= 0)
        return 0;
    if (part >= total)
        return 100;
    return Math.min(99, Math.max(1, Math.round(part * 100 / total)));
}
/** Answered right at least once (a row counts every answer in `seen` and every wrong one in `wrong_count`). */
function isLearned(row) { return !!row && row.seen > 0 && (row.streak >= 1 || row.seen > row.wrong_count); }
/** The exercise an id belongs to: a four-choice copy `<id>-test` belongs to its written exercise. */
const exerciseKey = (id) => id.replace(/-test$/, '');
exports.exerciseKey = exerciseKey;
function topicProgress(ids, reviews) {
    const groups = new Map();
    for (const id of new Set(ids)) {
        const key = (0, exports.exerciseKey)(id);
        groups.set(key, [...(groups.get(key) ?? []), id]);
    }
    const byId = new Map(reviews.map(row => [row.question_id, row]));
    let tried = 0, learned = 0;
    for (const members of groups.values()) {
        const rows = members.map(id => byId.get(id)).filter(row => !!row && row.seen > 0);
        if (!rows.length)
            continue;
        tried++;
        if (rows.some(isLearned))
            learned++;
    }
    const total = groups.size;
    const percent = ratio(learned, total);
    return { total, tried, learned, percent, triedPercent: Math.max(percent, ratio(tried, total)), stars: (0, progress_core_1.starsFor)(percent), stage: (0, progress_core_1.stageFor)(percent, tried) };
}
/** Exercises that can actually be practised on the Ev ve Yaşam page (write or four-choice). */
function housingProgressIds(section) {
    return housing_course_1.housingQuestions.filter(q => (section === 'all' || q.section === section) && (q.kind === 'write' || !!q.options)).map(q => q.id);
}
/** Picture test, writing and listening exercises of one Nesne Kasası category. */
function isVaultExercise(q) { return (0, object_practice_1.isObjectPictureQuestion)(q) || (0, object_practice_1.isObjectWritingQuestion)(q) || (0, object_practice_1.isObjectListeningQuestion)(q); }
function objectProgressIds(group) {
    return object_course_1.objectQuestions.filter(q => (group === 'all' || q.topic === group) && isVaultExercise(q)).map(q => q.id);
}
/** The Fiiller exercises that can be practised (the learner asked, 2 November 2026: the percentage stopped near 31%):
 * the steps of every verb in Fiil Atölyesi (meaning, writing, the past form, writing it, and since 9 November 2026 hat or
 * ist), not the older exercises that no page asks any more. */
const workshopTasks = new Set(verb_workshop_1.verbSteps);
function verbProgressIds(topic) {
    return verb_course_1.verbQuestions.filter(q => (0, verb_course_1.inVerbTopic)(q.topic, topic) && (0, verb_practice_1.isVerbExercise)(q) && !!q.verbTask && workshopTasks.has(q.verbTask)).map(q => q.id);
}
function verbProgress(topic, reviews) { return topicProgress(verbProgressIds(topic), reviews); }
/**
 * Verbs learned: a verb counts once every one of its exercises (verbProgressIds) counts as learned (as topicProgress).
 * Shown next to the exercise count so the two numbers are not mixed up ("72 fiil" next to "80/288" read like 80 verbs).
 */
function learnedVerbs(topic, reviews) {
    const byId = new Map(reviews.map(row => [row.question_id, row]));
    const verbsSeen = new Map();
    for (const q of verb_course_1.verbQuestions) {
        if (!q.verbId || !(0, verb_course_1.inVerbTopic)(q.topic, topic) || !(0, verb_practice_1.isVerbExercise)(q) || !q.verbTask || !workshopTasks.has(q.verbTask))
            continue;
        const done = isLearned(byId.get(q.id));
        verbsSeen.set(q.verbId, (verbsSeen.get(q.verbId) ?? true) && done);
    }
    return { learned: [...verbsSeen.values()].filter(Boolean).length, total: verbsSeen.size };
}
function housingProgress(section, reviews) { return topicProgress(housingProgressIds(section), reviews); }
function objectProgress(group, reviews) { return topicProgress(objectProgressIds(group), reviews); }
function xpFor(answers, correct) {
    const right = Math.max(0, Math.floor(correct));
    const all = Math.max(right, Math.floor(answers));
    return right * exports.XP_CORRECT + (all - right) * exports.XP_TRY;
}
/** Level L starts at 50·L·(L−1) XP: 0, 100, 300, 600, 1000 … */
function levelStart(level) { return 50 * level * (level - 1); }
function levelFromXp(xp) {
    const total = Math.max(0, Math.floor(xp));
    let level = 1;
    while (levelStart(level + 1) <= total)
        level++;
    const start = levelStart(level), next = levelStart(level + 1), span = next - start, intoLevel = total - start;
    return { level, xp: total, levelStart: start, nextLevel: next, intoLevel, span, toNext: next - total, percent: Math.floor(intoLevel * 100 / span) };
}
/** Local calendar day number for a timestamp; offset is Date#getTimezoneOffset() in minutes. */
function dayKey(ms, timezoneOffset = 0) { return Math.floor((ms - timezoneOffset * 60000) / DAY); }
/** Consecutive practice days ending today, or yesterday when today has no practice yet. */
function dayStreak(days, today) {
    const set = new Set(days);
    let cursor = set.has(today) ? today : set.has(today - 1) ? today - 1 : null;
    if (cursor === null)
        return 0;
    let streak = 0;
    while (set.has(cursor)) {
        streak++;
        cursor--;
    }
    return streak;
}
function progressSummary(stats, dailyGoal = exports.DAILY_GOAL) {
    const days = stats.days.filter(row => row.answers > 0);
    const todayAnswers = days.find(row => row.day === stats.today)?.answers ?? 0;
    const xp = xpFor(stats.answers, stats.correct);
    return { xp, level: levelFromXp(xp), streak: dayStreak(days.map(row => row.day), stats.today), practisedToday: todayAnswers > 0, todayAnswers, dailyGoal, goalPercent: Math.min(100, Math.floor(todayAnswers * 100 / dailyGoal)), correct: stats.correct, answers: stats.answers };
}
/** XP earned in one finished round. */
function roundXp(answers) {
    const correct = answers.filter(answer => !!answer.correct).length;
    return xpFor(answers.length, correct);
}
/**
 * Mistakes in the other parts, for Yanlışlarım (/yanlislarim, the learner asked for every mistake in one place,
 * 22 October 2026): Nesne Kasası (with the German words, each once) and Ev ve Yaşam. The same rule as in those parts:
 * a wrong answer that was not answered right three times since.
 */
function partMistakes(reviews) {
    const byId = new Map(reviews.map(row => [row.question_id, row]));
    const vault = object_course_1.objectQuestions.filter(q => isVaultExercise(q) && (0, object_practice_1.isObjectMistake)(byId.get(q.id)));
    const words = [...new Set(vault.map(q => q.objectId).filter((id) => !!id))].map(id => object_course_1.objectWordMap.get(id)?.de).filter((de) => !!de);
    const housing = housing_course_1.housingQuestions.filter(q => (0, housing_course_1.isHousingMistake)(byId.get(q.id)));
    return { vault: { count: vault.length, words }, housing: { count: housing.length } };
}
/**
 * Every open mistake of the site for Yanlışlarım's one round (the learner asked to practise them all together,
 * 22 October 2026): Fiil Atölyesi (as its own mistakes list), Nesne Kasası and Ev ve Yaşam.
 */
function allMistakeIds(reviews, verbIds) {
    const byId = new Map(reviews.map(row => [row.question_id, row]));
    const vault = object_course_1.objectQuestions.filter(q => isVaultExercise(q) && (0, object_practice_1.isObjectMistake)(byId.get(q.id))).map(q => q.id);
    const housing = housing_course_1.housingQuestions.filter(q => (0, housing_course_1.isHousingMistake)(byId.get(q.id))).map(q => q.id);
    return [...verbIds, ...vault, ...housing];
}
