"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFamilieTurkish = exports.familieTurkishTexts = exports.familieStepIndex = exports.familieWordCount = exports.familieScored = exports.familieGoals = exports.isFamiliePart = exports.familieParts = exports.familiePartList = exports.familiePartOrder = exports.FAMILIE_UNIT = exports.FAMILIE_PATH = void 0;
exports.familieGroups = familieGroups;
exports.familieSpeechTexts = familieSpeechTexts;
/**
 * Lektion 4 „Familie“ (A1.1), Teil A–D (the learner asked, 8 November 2026): words first, then the topics, the exercises
 * and a test, like Lektion 3, after the learner's book and the handouts of the course but in our own words and with the
 * site's people. The parts are data (lib/familie-a.ts … familie-d.ts, shapes in lib/familie-types.ts) drawn by
 * app/familie-steps.tsx.
 */
const unit_goals_1 = require("./unit-goals");
const willkommen_course_1 = require("./willkommen-course");
const familie_types_1 = require("./familie-types");
const familie_a_1 = require("./familie-a");
const familie_b_1 = require("./familie-b");
const familie_c_1 = require("./familie-c");
const familie_d_1 = require("./familie-d");
exports.FAMILIE_PATH = '/a1-1/familie';
exports.FAMILIE_UNIT = 'book-04';
exports.familiePartOrder = ['a', 'b', 'c', 'd'];
exports.familiePartList = [familie_a_1.partA, familie_b_1.partB, familie_c_1.partC, familie_d_1.partD];
// The exercises' kickers ("Alıştırma 1 · Wer ist das?") are Turkish too: noted for the packs like the rest.
for (const part of exports.familiePartList)
    for (const step of part.steps)
        if (step.kicker && /Alıştırma|Konu/.test(step.kicker))
            (0, familie_types_1.T)(step.kicker);
exports.familieParts = { a: familie_a_1.partA, b: familie_b_1.partB, c: familie_c_1.partC, d: familie_d_1.partD };
const isFamiliePart = (id) => id in exports.familieParts;
exports.isFamiliePart = isFamiliePart;
/** What Lektion 4 teaches (the contents page's left page): lib/unit-goals.ts. */
exports.familieGoals = (0, unit_goals_1.unitGoalsFor)(exports.FAMILIE_UNIT);
/** The scored steps of every part (exercises and the test). */
exports.familieScored = { a: (0, familie_types_1.partScored)(familie_a_1.partA), b: (0, familie_types_1.partScored)(familie_b_1.partB), c: (0, familie_types_1.partScored)(familie_c_1.partC), d: (0, familie_types_1.partScored)(familie_d_1.partD) };
const listCount = (part) => part.steps.flatMap(step => step.blocks ?? []).reduce((n, block) => n + (block.t === 'list' ? block.words.length : 0), 0);
/** The words a part teaches (its cards and word lists), for the contents page. */
exports.familieWordCount = { a: familie_a_1.wordsA.length + listCount(familie_a_1.partA), b: familie_b_1.wordsB.length + listCount(familie_b_1.partB), c: familie_c_1.wordsC.length + listCount(familie_c_1.partC), d: familie_d_1.wordsD.length + listCount(familie_d_1.partD) };
/** The step groups of a part: the teaching steps, the exercises, the test and Konuş (cover and end belong to none). */
function familieGroups(part) {
    const ids = (kind) => part.steps.filter(step => step.kind === kind).map(step => step.id);
    return [
        { id: 'konu', label: 'Konu anlatımı', ids: ids('teach') },
        { id: 'alistirmalar', label: 'Alıştırmalar', ids: ids('exercise') },
        { id: 'test', label: 'Test', ids: ids('test') },
        { id: 'konus', label: 'Konuş', ids: ids('speak') },
    ];
}
const familieStepIndex = (part, id) => exports.familieParts[part].steps.findIndex(step => step.id === id);
exports.familieStepIndex = familieStepIndex;
/** Every Turkish text of Lektion 4's data, for tests/familie.test.cjs (each must be in every unit pack). */
const familieTurkishTexts = () => [...familie_types_1.familieTurkish];
exports.familieTurkishTexts = familieTurkishTexts;
/** Is this one of Lektion 4's Turkish texts? (a question or option in the test: its language on the page). */
const isFamilieTurkish = (text) => familie_types_1.familieTurkish.has(text);
exports.isFamilieTurkish = isFamilieTurkish;
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
            block.words.forEach(word => add((0, familie_types_1.wordSay)(word)));
            break;
        case 'list':
            block.words.forEach(([, , example]) => add(example));
            break;
        case 'ads':
            block.items.forEach(item => add(item.say));
            break;
    }
}
const choiceSay = (line) => line.say ?? (0, familie_types_1.lineText)(line);
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
/** Every German text Lektion 4 speaks (rendered as site voices by scripts/voices). */
function familieSpeechTexts() {
    const out = new Set();
    const add = (item) => { if (!item)
        return; const text = (0, willkommen_course_1.sayText)(item).trim(); if (text)
        out.add(text); };
    for (const part of exports.familiePartList)
        part.steps.forEach(step => stepTexts(step, add));
    // The ratings of Konuş (app/berufe-a-steps.tsx `speakRatings`).
    ['sehr gut', 'gut', 'nicht so gut'].forEach(add);
    return [...out];
}
