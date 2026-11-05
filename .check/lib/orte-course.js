"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrteTurkish = exports.orteTurkishTexts = exports.orteStepIndex = exports.orteWordCount = exports.orteScored = exports.orteGoals = exports.isOrtePart = exports.orteParts = exports.ortePartList = exports.ortePartOrder = exports.ORTE_UNIT = exports.ORTE_PATH = void 0;
exports.orteGroups = orteGroups;
exports.orteSpeechTexts = orteSpeechTexts;
/**
 * Lektion 3 „Orte und Dinge“ (A1.1), Teil A–D (the learner asked, 5 November 2026: words first, then the topics, then
 * the exercises and a test, like Lektion 1 and 2, after the learner's book but in our own words and with the site's
 * people). The parts are data (lib/orte-a.ts … orte-d.ts, shapes in lib/orte-types.ts) drawn by app/orte-steps.tsx.
 */
const unit_goals_1 = require("./unit-goals");
const willkommen_course_1 = require("./willkommen-course");
const orte_types_1 = require("./orte-types");
const orte_a_1 = require("./orte-a");
const orte_b_1 = require("./orte-b");
const orte_c_1 = require("./orte-c");
const orte_d_1 = require("./orte-d");
exports.ORTE_PATH = '/a1-1/orte-und-dinge';
exports.ORTE_UNIT = 'book-03';
exports.ortePartOrder = ['a', 'b', 'c', 'd'];
exports.ortePartList = [orte_a_1.partA, orte_b_1.partB, orte_c_1.partC, orte_d_1.partD];
// The exercises' kickers ("Alıştırma 1 · Was ist das?") are Turkish too: noted for the packs like the rest.
for (const part of exports.ortePartList)
    for (const step of part.steps)
        if (step.kicker && /Alıştırma|Konu/.test(step.kicker))
            (0, orte_types_1.T)(step.kicker);
exports.orteParts = { a: orte_a_1.partA, b: orte_b_1.partB, c: orte_c_1.partC, d: orte_d_1.partD };
const isOrtePart = (id) => id in exports.orteParts;
exports.isOrtePart = isOrtePart;
/** What Lektion 3 teaches (the contents page's left page): lib/unit-goals.ts. */
exports.orteGoals = (0, unit_goals_1.unitGoalsFor)(exports.ORTE_UNIT);
/** The scored steps of every part (exercises and the test). */
exports.orteScored = { a: (0, orte_types_1.partScored)(orte_a_1.partA), b: (0, orte_types_1.partScored)(orte_b_1.partB), c: (0, orte_types_1.partScored)(orte_c_1.partC), d: (0, orte_types_1.partScored)(orte_d_1.partD) };
const listCount = (part) => part.steps.flatMap(step => step.blocks ?? []).reduce((n, block) => n + (block.t === 'list' ? block.words.length : 0), 0);
/** The words a part teaches (its cards and word lists), for the contents page. */
exports.orteWordCount = { a: orte_a_1.wordsA.length + listCount(orte_a_1.partA), b: orte_b_1.wordsB.length + listCount(orte_b_1.partB), c: orte_c_1.wordsC.length + listCount(orte_c_1.partC), d: orte_d_1.wordsD.length + listCount(orte_d_1.partD) };
/** The step groups of a part: the teaching steps, the exercises, the test and Konuş (cover and end belong to none). */
function orteGroups(part) {
    const ids = (kind) => part.steps.filter(step => step.kind === kind).map(step => step.id);
    return [
        { id: 'konu', label: 'Konu anlatımı', ids: ids('teach') },
        { id: 'alistirmalar', label: 'Alıştırmalar', ids: ids('exercise') },
        { id: 'test', label: 'Test', ids: ids('test') },
        { id: 'konus', label: 'Konuş', ids: ids('speak') },
    ];
}
const orteStepIndex = (part, id) => exports.orteParts[part].steps.findIndex(step => step.id === id);
exports.orteStepIndex = orteStepIndex;
/** Every Turkish text of Lektion 3's data, for tests/orte.test.cjs (each must be in every unit pack). */
const orteTurkishTexts = () => [...orte_types_1.orteTurkish];
exports.orteTurkishTexts = orteTurkishTexts;
/** Is this one of Lektion 3's Turkish texts? (a question or option in the test: its language on the page). */
const isOrteTurkish = (text) => orte_types_1.orteTurkish.has(text);
exports.isOrteTurkish = isOrteTurkish;
/* ---------- what the voices read ---------- */
function blockTexts(block, add) {
    switch (block.t) {
        case 'rows':
            block.rows.forEach(([de]) => add(block.who ? { text: de, who: block.who } : de));
            break;
        case 'talk':
            block.lines.forEach(line => add({ text: line.say ?? line.de, who: line.who }));
            break;
        case 'table':
            block.say?.forEach(add);
            break;
        case 'checks':
            block.items.forEach(item => add(item.say));
            break;
        case 'cards':
            block.words.forEach(word => add((0, orte_types_1.wordSay)(word)));
            break;
        case 'list':
            block.words.forEach(([, , example]) => add(example));
            break;
        case 'ads':
            block.items.forEach(item => add(item.say));
            break;
    }
}
const choiceSay = (line) => line.say ?? (0, orte_types_1.lineText)(line);
function stepTexts(step, add) {
    [...(step.blocks ?? []), ...(step.after ?? [])].forEach(block => blockTexts(block, add));
    const exercise = step.exercise;
    if (exercise)
        switch (exercise.type) {
            case 'quiz':
                exercise.items.forEach(item => { add(item.listen); add(item.say ?? item.options[0]); });
                break;
            case 'choice':
                exercise.lines.forEach(line => add(choiceSay(line)));
                exercise.listen?.forEach(add);
                break;
            case 'gaps':
                exercise.say.forEach(add);
                exercise.lines.forEach(line => add(line.say));
                break;
            case 'write':
                exercise.rows.forEach(row => add(row.say));
                break;
            case 'own':
                exercise.prompts.forEach(prompt => add(prompt.question));
                break;
        }
    step.test?.forEach(question => { add(question[3]); add(question[4]); });
    step.speak?.forEach(row => { add({ text: row.question, who: row.who }); add(row.answer); });
}
/** Every German text Lektion 3 speaks (rendered as site voices by scripts/voices). */
function orteSpeechTexts() {
    const out = new Set();
    const add = (item) => { if (!item)
        return; const text = (0, willkommen_course_1.sayText)(item).trim(); if (text)
        out.add(text); };
    for (const part of exports.ortePartList)
        part.steps.forEach(step => stepTexts(step, add));
    // The ratings of Konuş (app/berufe-a-steps.tsx `speakRatings`).
    ['sehr gut', 'gut', 'nicht so gut'].forEach(add);
    return [...out];
}
