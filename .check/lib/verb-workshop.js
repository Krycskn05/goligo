"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verbs = exports.MISTAKES_MODE = exports.LEGACY_WORKSHOP_TOTAL = exports.legacyWorkshopIds = exports.WORKSHOP_TOTAL = exports.questionId = exports.workshopVerbs = exports.AUX_STEP = exports.verbSteps = exports.meaningSteps = exports.WORKSHOP_MODE = exports.PART_ROUND_TOPIC = exports.WORKSHOP_TOPIC = void 0;
exports.partIds = partIds;
exports.partTotal = partTotal;
exports.workshopIds = workshopIds;
exports.learnStage = learnStage;
exports.isOlderRound = isOlderRound;
exports.roundFamily = roundFamily;
exports.continuationIds = continuationIds;
exports.pathPlace = pathPlace;
exports.summaryIds = summaryIds;
exports.partProgress = partProgress;
exports.sessionPart = sessionPart;
exports.partAnswered = partAnswered;
exports.findPartSession = findPartSession;
exports.bookPartsStatus = bookPartsStatus;
exports.bookVerbStatus = bookVerbStatus;
exports.partsStatus = partsStatus;
exports.currentPart = currentPart;
exports.verbStatus = verbStatus;
exports.remainingIds = remainingIds;
exports.isPartRound = isPartRound;
exports.roundEnd = roundEnd;
exports.workshopMistakeIds = workshopMistakeIds;
exports.mistakeVerbs = mistakeVerbs;
exports.exerciseCount = exerciseCount;
exports.workshopMistakes = workshopMistakes;
exports.reviewRows = reviewRows;
const verb_course_1 = require("./verb-course");
Object.defineProperty(exports, "verbs", { enumerable: true, get: function () { return verb_course_1.verbs; } });
const verb_families_1 = require("./verb-families");
const verb_practice_1 = require("./verb-practice");
/**
 * Fiil Atölyesi: one path through all 72 verbs in six topics (lib/verb-themes.ts; until 4 November 2026 four book parts,
 * see lib/verb-families.ts). Each verb is finished in one go before the next one: its card with the
 * meaning, then the meaning test, then spelling it with letters, then its past form: the infinitive
 * is shown and the Partizip II is chosen (abfahren → abgefahren; no hat/ist, no other verbs), then spelled, and last
 * the Perfekt's helping verb is chosen, hat or ist (two choices; the learner asked, 9 November 2026).
 * No part is locked: each part is its own saved round (mode `workshop`), so the learner can start
 * or continue any part; leaving and coming back continues it.
 * Rounds saved in an earlier order (all meanings first, Perfekt steps with hat/ist, or before a step was added) still count
 * from their own list of questions; they are not continued as they were: the part goes on in a new
 * round with the questions still left (`continuationIds`), and what that round leaves out counts as done.
 */
/** Book part rounds saved before 4 November 2026, and the mistakes rounds of Yanlışlarım. */
exports.WORKSHOP_TOPIC = 'verbs-all';
/** A topic round of the map (since 4 November 2026): read by its topic, never as a book part. */
exports.PART_ROUND_TOPIC = verb_course_1.VERB_TOPIC_ROUND;
exports.WORKSHOP_MODE = 'workshop';
exports.meaningSteps = ['meaning', 'write'];
/** All steps of one verb: the meaning test, spelling, the past form, spelling the past form, hat or ist. */
exports.verbSteps = ['meaning', 'write', 'partizip', 'write-partizip', 'aux'];
/** The hat/ist step (added 9 November 2026). It never takes a tick away: a verb's past tick still comes from the past form
 * and its spelling, so what was done before the step came stays done; the step is asked until it was answered once. */
exports.AUX_STEP = 'aux';
/** Tasks that asked the past form, in this path or in older rounds. */
const pastTasks = ['partizip', 'write-partizip', 'aux', 'perfekt', 'write-perfekt', 'meaning-perfekt'];
/** Every task a workshop round has ever held. */
const workshopTasks = new Set([...exports.verbSteps, ...pastTasks]);
/** The verbs in path order: topic 1 first, then topic 2 … 6. */
exports.workshopVerbs = verb_families_1.verbFamilies.flatMap(family => family.verbs.map(id => verb_course_1.verbMap.get(id)));
const questionId = (step, verbId) => 'verb-' + step + '-' + verbId;
exports.questionId = questionId;
const questionById = new Map(verb_course_1.verbQuestions.map(q => [q.id, q]));
/** One part's questions in order: verb by verb, each with its four steps. */
function partIds(family) { return family.verbs.flatMap(id => exports.verbSteps.map(step => (0, exports.questionId)(step, id))); }
function partTotal(family) { return partIds(family).length; }
/** Every question of the path in order: topic 1, then topic 2 … 6. */
function workshopIds() { return verb_families_1.verbFamilies.flatMap(family => partIds(family)); }
exports.WORKSHOP_TOTAL = workshopIds().length;
/** The whole path as the first rounds saved it (152 questions, the two parts of the first page): per part all meanings,
 * then all Perfekt forms with hat/ist. The parts of the second page came later and were never part of it. */
const firstPageFamilies = verb_families_1.bookParts.slice(0, 2);
exports.legacyWorkshopIds = firstPageFamilies.flatMap(family => [...family.verbs.flatMap(id => ['meaning', 'write'].map(step => (0, exports.questionId)(step, id))), ...family.verbs.flatMap(id => ['perfekt', 'write-perfekt'].map(step => (0, exports.questionId)(step, id)))]);
exports.LEGACY_WORKSHOP_TOTAL = exports.legacyWorkshopIds.length;
/** Where that whole-path round stops: the end of part 1. */
const LEGACY_PART_END = verb_families_1.bookParts[0].verbs.length * 4;
/** Which learning card a task belongs to: the past form belongs to the verb's meaning card (no card of its own). */
function learnStage(task) {
    return task === 'perfekt' || task === 'write-perfekt' || task === 'meaning-perfekt' || task === 'hear-perfekt' ? 'perfekt' : task === 'praesens' || task === 'write-praesens' || task === 'hear-praesens' ? 'praesens' : 'meaning';
}
const idsOf = (questions) => questions.map(q => q.id ?? '');
const sameIds = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);
/** Whether a saved round was made in an earlier order: it holds Perfekt questions with hat/ist, all meanings come first,
 * or a verb in it stops before the last step (the round was made before that step was added). */
function isOlderRound(questions, partOf = verb_families_1.verbFamilyOf) {
    const ids = idsOf(questions);
    if (ids.some(id => !exports.verbSteps.includes(questionById.get(id)?.verbTask)))
        return true;
    const family = roundFamily(questions, partOf);
    if (!family)
        return true;
    const order = new Map(partIds(family).map((id, i) => [id, i]));
    if (ids.some((id, i) => i > 0 && (order.get(id) ?? -1) < (order.get(ids[i - 1]) ?? -1)))
        return true;
    const held = new Set(ids);
    const last = exports.verbSteps[exports.verbSteps.length - 1];
    return [...new Set(ids.map(id => questionById.get(id)?.verbId ?? ''))].some(verbId => !held.has((0, exports.questionId)(last, verbId)));
}
/** The part of a round: the topic of its first verb, or with `partOf` = bookPartOf its book part (the older whole path
 * starts with book part 1). */
function roundFamily(questions, partOf = verb_families_1.verbFamilyOf) {
    const first = questionById.get(questions[0]?.id ?? '');
    return first?.verbId ? partOf(first.verbId) : undefined;
}
/** The questions of a part still to do after an older round: the part in the current order, without what that round answered. */
function continuationIds(family, session) {
    const done = new Set(session.answers.map(answer => answer.question_id));
    const left = partIds(family).filter(id => !done.has(id));
    return left.length ? left : partIds(family);
}
/** Where a question of the path sits: the verb, its part, and whether a card comes first:
 * the part card at the start of a part, the verb's card at the start of each verb.
 * The steps shown are the steps of that verb the round holds. */
function pathPlace(questions, index, lookup) {
    const q = lookup(questions[index]?.id ?? '');
    const verb = q?.verbId ? verb_course_1.verbMap.get(q.verbId) : undefined;
    const family = verb ? (0, verb_families_1.verbFamilyOf)(verb.id) : undefined;
    if (!q || !verb || !family)
        return null;
    const previous = index > 0 ? lookup(questions[index - 1].id) : undefined;
    const stage = learnStage(q.verbTask);
    const previousStage = previous ? learnStage(previous.verbTask) : null;
    const stageStart = !previous || previous.verbId !== verb.id || previousStage !== stage;
    const chapterStart = !previous || !previous.verbId || (0, verb_families_1.verbFamilyOf)(previous.verbId)?.id !== family.id;
    const held = new Set(questions.map(item => item.id));
    const steps = exports.verbSteps.filter(step => held.has((0, exports.questionId)(step, verb.id)));
    const step = steps.indexOf(q.verbTask);
    return { verb, family, verbNumber: family.verbs.indexOf(verb.id) + 1, step: Math.max(0, step), steps: steps.length ? steps : exports.verbSteps, chapterStart, stageStart, stage };
}
/** Topic rounds are read by topic, every other workshop round (saved before 4 November 2026) by book part. */
const partFinder = (session) => session.topic === exports.PART_ROUND_TOPIC ? verb_families_1.verbFamilyOf : verb_families_1.bookPartOf;
/** The questions of a summarised round, in order: its list; without one (a finished round) its part, or the older whole path. */
function summaryIds(session) {
    if (session.ids?.length)
        return [...session.ids];
    if (session.topic !== exports.PART_ROUND_TOPIC && session.total === exports.LEGACY_WORKSHOP_TOTAL)
        return [...exports.legacyWorkshopIds];
    const family = roundFamily([{ id: session.first ?? '' }], partFinder(session));
    return family ? partIds(family) : [];
}
/** A finished round counts whole. */
const summaryAnswered = (session) => session.finished_at ? Number.MAX_SAFE_INTEGER : session.answered;
/** How far one part is from the questions of its round and the count answered: what is done for every verb
 * (a question the round does not hold counts as done), and the verb of the next question. */
function partProgress(family, ids, answered) {
    const count = sameIds(ids, exports.legacyWorkshopIds) ? LEGACY_PART_END : ids.length;
    const done = Math.max(0, Math.min(count, answered));
    const held = new Set(ids.slice(0, count));
    const finishedIds = new Set(ids.slice(0, done));
    const isDone = (id) => !held.has(id) || finishedIds.has(id);
    const marks = family.verbs.map(id => ({ meaning: exports.meaningSteps.every(step => isDone((0, exports.questionId)(step, id))), perfekt: pastTasks.every(task => isDone((0, exports.questionId)(task, id))) }));
    const meaningDone = marks.filter(mark => mark.meaning).length;
    const perfektDone = marks.filter(mark => mark.perfekt).length;
    const verbsDone = marks.filter(mark => mark.meaning && mark.perfekt).length;
    const finished = done >= count;
    const next = finished ? undefined : questionById.get(ids[done]);
    const nextVerbId = next?.verbId && family.verbs.includes(next.verbId) ? next.verbId : family.verbs[Math.min(family.verbs.length - 1, verbsDone)];
    return { done, count, percent: Math.round(done / Math.max(1, count) * 100), finished, started: done > 0, verbsDone, verbCount: family.verbs.length, nextVerbId, meaningDone, perfektDone, marks };
}
/** The part a saved workshop round belongs to: a topic round its topic; an older round the book part of its first verb
 * (an older round of the whole path: book part 1). */
function sessionPart(session) {
    if (session.mode !== exports.WORKSHOP_MODE || !session.topic.startsWith('verbs-'))
        return undefined;
    const ids = summaryIds(session);
    return ids.length ? roundFamily(ids.map(id => ({ id })), partFinder(session)) : undefined;
}
/** Questions answered in a round as its part counts them; the whole-path round only up to part 1's end. */
function partAnswered(session, family) {
    if (!session)
        return 0;
    return partProgress(family, summaryIds(session), summaryAnswered(session)).done;
}
/** The saved round of a part: its newest one (the rounds come newest first). An older round left open behind a
 * newer one — restarted, or carried on — no longer counts. */
function findPartSession(sessions, family) {
    return sessions.find(session => sessionPart(session)?.id === family.id) ?? null;
}
/** Every book part with its saved round and progress (rounds saved before 4 November 2026). `completed`: some round of
 * the part was finished — practising a finished part again kept its tick, its full ring and its stickers (the learner
 * asked, 2 November 2026: "the tick disappears"). */
function bookPartsStatus(sessions) {
    return verb_families_1.bookParts.map(family => {
        const session = findPartSession(sessions, family);
        const progress = partProgress(family, session ? summaryIds(session) : partIds(family), session ? summaryAnswered(session) : 0);
        const completed = progress.finished || sessions.some(item => sessionPart(item)?.id === family.id && partProgress(family, summaryIds(item), summaryAnswered(item)).finished);
        if (!completed || progress.finished)
            return { family, session, ...progress, completed };
        const full = family.verbs.map(() => ({ meaning: true, perfekt: true }));
        return { family, session, ...progress, completed, marks: full, meaningDone: family.verbs.length, perfektDone: family.verbs.length };
    });
}
/** For every verb: what the book part rounds saved before 4 November 2026 finished (the same rules as then). */
function bookVerbStatus(sessions) {
    const status = new Map();
    for (const part of bookPartsStatus(sessions))
        part.family.verbs.forEach((id, i) => status.set(id, part.marks[i]));
    return status;
}
/** The questions answered at least once, right or wrong (a review row is written with every answer). */
function answeredIds(reviews) { return new Set(reviews.filter(row => row.seen > 0).map(row => row.question_id)); }
/** A verb's ticks from its answers: the meaning after the meaning test and spelling, the past form after the past form
 * and its spelling (or, in older rounds, the Perfekt with hat/ist and its spelling). */
function answeredMarks(verbId, answered) {
    const has = (step) => answered.has((0, exports.questionId)(step, verbId));
    return { meaning: exports.meaningSteps.every(has), perfekt: (has('partizip') && has('write-partizip')) || (has('perfekt') && has('write-perfekt')) };
}
const pastSteps = ['partizip', 'write-partizip'];
/**
 * Every topic of the map with its progress. A verb is done in a topic as soon as it was done anywhere on the path: in a
 * book part round saved before 4 November 2026, in a topic round, or by its answers — so nothing done before the topics
 * came is lost, and a verb is never counted twice. `session`: the topic's newest round; `completed`: every verb of the
 * topic has both ticks, which stays so when the topic is practised again (its tick, full ring and stickers);
 * `finished`: completed with no open round left and the hat/ist step answered for every verb (a topic done before that
 * step came goes on with only its hat/ist questions; its tick, ring and stickers stay).
 */
function partsStatus(sessions, reviews = []) {
    const book = bookVerbStatus(sessions);
    const answered = answeredIds(reviews);
    const auxDone = (verbId) => answered.has((0, exports.questionId)(exports.AUX_STEP, verbId));
    return verb_families_1.verbFamilies.map(family => {
        const session = findPartSession(sessions, family);
        const rounds = sessions.filter(item => item.topic === exports.PART_ROUND_TOPIC && sessionPart(item)?.id === family.id).map(item => partProgress(family, summaryIds(item), summaryAnswered(item)).marks);
        const marks = family.verbs.map((id, i) => {
            const own = answeredMarks(id, answered);
            const old = book.get(id);
            return { meaning: own.meaning || !!old?.meaning || rounds.some(list => list[i].meaning), perfekt: own.perfekt || !!old?.perfekt || rounds.some(list => list[i].perfekt) };
        });
        const done = family.verbs.reduce((sum, id, i) => sum + (marks[i].meaning ? exports.meaningSteps.length : exports.meaningSteps.filter(step => answered.has((0, exports.questionId)(step, id))).length) + (marks[i].perfekt ? pastSteps.length : pastSteps.filter(step => answered.has((0, exports.questionId)(step, id))).length) + (auxDone(id) ? 1 : 0), 0);
        const count = family.verbs.length * exports.verbSteps.length;
        const meaningDone = marks.filter(mark => mark.meaning).length;
        const perfektDone = marks.filter(mark => mark.perfekt).length;
        const verbsDone = marks.filter(mark => mark.meaning && mark.perfekt).length;
        const completed = verbsDone === family.verbs.length;
        const auxLeft = family.verbs.some(id => !auxDone(id));
        // An open round of the topic (also one practising a done topic again) is continued, never thrown away: the topic counts
        // as finished only when every verb is done and no round of it is open.
        const openRound = !!session && !session.finished_at && session.answered < (session.ids?.length || session.total);
        const open = openRound && session?.ids?.length ? questionById.get(session.ids[session.answered]) : undefined;
        const nextVerbId = open?.verbId && family.verbs.includes(open.verbId) ? open.verbId : family.verbs[Math.max(0, marks.findIndex((mark, i) => !(mark.meaning && mark.perfekt) || !auxDone(family.verbs[i])))];
        return { family, session, done, count, percent: Math.round(done / count * 100), finished: completed && !openRound && !auxLeft, completed, started: done > 0 || openRound, verbsDone, verbCount: family.verbs.length, nextVerbId, meaningDone, perfektDone, marks };
    });
}
/** The topic to continue: the open topic practised last, else the first topic not finished, else topic 1. */
function currentPart(sessions, reviews = []) {
    const parts = partsStatus(sessions, reviews);
    for (const session of sessions) {
        const part = parts.find(item => item.session?.id === session.id);
        if (part && !part.finished)
            return part;
    }
    return parts.find(part => !part.finished) ?? parts[0];
}
/** For every verb: whether its meaning and its past form are done (for the sticker collection). */
function verbStatus(sessions, reviews = []) {
    const status = new Map();
    for (const part of partsStatus(sessions, reviews))
        part.family.verbs.forEach((id, i) => status.set(id, part.marks[i]));
    return status;
}
/**
 * The questions of a new topic round: the verbs not done yet, each with the steps still to do (the steps answered before
 * are not asked again). A verb always ends with its last step; when its steps would not, it is asked whole. A verb done
 * before the hat/ist step came is asked only that step. Nothing left (or `restart`): the whole topic.
 */
function remainingIds(family, marks, reviews = []) {
    const answered = answeredIds(reviews);
    const last = exports.verbSteps[exports.verbSteps.length - 1];
    const ids = family.verbs.flatMap(verbId => {
        const mark = marks.get(verbId);
        if (mark?.meaning && mark.perfekt && answered.has((0, exports.questionId)(exports.AUX_STEP, verbId)))
            return [];
        const steps = exports.verbSteps.filter(step => !(step !== exports.AUX_STEP && (exports.meaningSteps.includes(step) ? mark?.meaning : mark?.perfekt)) && !answered.has((0, exports.questionId)(step, verbId)));
        return (steps.includes(last) ? steps : exports.verbSteps).map(step => (0, exports.questionId)(step, verbId));
    });
    return ids.length ? ids : partIds(family);
}
/** A saved round of this part: its questions are workshop questions of the part's verbs (the older whole path counts for book part 1). */
function isPartRound(session, family) {
    if (session.mode !== exports.WORKSHOP_MODE || !session.questions.length)
        return false;
    if (session.questions.length === exports.LEGACY_WORKSHOP_TOTAL && sameIds(idsOf(session.questions), exports.legacyWorkshopIds))
        return family.id === verb_families_1.bookParts[0].id;
    const members = new Set(family.verbs);
    return session.questions.every(item => { const q = questionById.get(item.id); return !!q?.verbId && members.has(q.verbId) && workshopTasks.has(q.verbTask ?? ''); });
}
/** Where a round ends: an older whole-path round stops after part 1; other rounds at their last question. */
function roundEnd(session) {
    return session.mode === exports.WORKSHOP_MODE && session.questions.length === exports.LEGACY_WORKSHOP_TOTAL && sameIds(idsOf(session.questions), exports.legacyWorkshopIds) ? LEGACY_PART_END : session.questions.length;
}
/** Yanlışlarım: a round of the learner's own mistakes on the workshop path (stored with the review mode, so it is never taken for a part). */
exports.MISTAKES_MODE = 'review';
/** Workshop questions whose last answer was wrong, in path order: one right answer takes a question off the list. */
function workshopMistakeIds(reviews) {
    const byId = reviewRows(reviews);
    return workshopIds().filter(id => { const row = byId.get(id); return !!row && row.wrong_count > 0 && row.streak === 0; });
}
/** The verbs behind those mistakes, in path order. */
function mistakeVerbs(ids) {
    const seen = new Set();
    const out = [];
    for (const id of ids) {
        const verbId = questionById.get(id)?.verbId;
        if (verbId && !seen.has(verbId)) {
            seen.add(verbId);
            out.push(verb_course_1.verbMap.get(verbId));
        }
    }
    return out;
}
function exerciseCount() { return verb_course_1.verbQuestions.filter(verb_practice_1.isVerbExercise).length; }
function workshopMistakes(session, lookup) {
    return session.answers.filter(answer => !answer.correct).map(answer => lookup(answer.question_id)).filter((q) => !!q);
}
function reviewRows(reviews) { return new Map(reviews.map(row => [row.question_id, row])); }
