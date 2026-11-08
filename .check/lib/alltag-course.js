"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlltagTurkish = exports.alltagTurkishTexts = exports.alltagStepIndex = exports.alltagWordCount = exports.alltagScored = exports.alltagGoals = exports.isAlltagPart = exports.alltagParts = exports.alltagPartList = exports.alltagPartOrder = exports.ALLTAG_UNIT = exports.ALLTAG_PATH = void 0;
exports.alltagGroups = alltagGroups;
exports.alltagSpeechTexts = alltagSpeechTexts;
/**
 * Lektion 5 „Alltag und Freizeit“ (A1.1), Teil A–D (the learner asked, 8 November 2026: "the same rules, don't skip
 * topics"): words first, then the topics, the exercises and a test, like Lektion 3 and 4, after the learner's book
 * (Kursbuch and Arbeitsbuch) but in our own words and with the site's people. The parts are data (lib/alltag-a.ts …
 * alltag-d.ts, shapes in lib/alltag-types.ts) drawn by app/alltag-steps.tsx.
 */
const unit_goals_1 = require("./unit-goals");
const willkommen_course_1 = require("./willkommen-course");
const alltag_types_1 = require("./alltag-types");
const alltag_a_1 = require("./alltag-a");
const alltag_b_1 = require("./alltag-b");
const alltag_c_1 = require("./alltag-c");
const alltag_d_1 = require("./alltag-d");
exports.ALLTAG_PATH = '/a1-1/alltag-und-freizeit';
exports.ALLTAG_UNIT = 'book-05';
exports.alltagPartOrder = ['a', 'b', 'c', 'd'];
exports.alltagPartList = [alltag_a_1.partA, alltag_b_1.partB, alltag_c_1.partC, alltag_d_1.partD];
// The exercises' kickers ("Alıştırma 1 · Wer ist das?") are Turkish too: noted for the packs like the rest.
for (const part of exports.alltagPartList)
    for (const step of part.steps)
        if (step.kicker && /Alıştırma|Konu/.test(step.kicker))
            (0, alltag_types_1.T)(step.kicker);
exports.alltagParts = { a: alltag_a_1.partA, b: alltag_b_1.partB, c: alltag_c_1.partC, d: alltag_d_1.partD };
const isAlltagPart = (id) => id in exports.alltagParts;
exports.isAlltagPart = isAlltagPart;
/** What Lektion 5 teaches (the contents page's left page): lib/unit-goals.ts. */
exports.alltagGoals = (0, unit_goals_1.unitGoalsFor)(exports.ALLTAG_UNIT);
/** The scored steps of every part (exercises and the test). */
exports.alltagScored = { a: (0, alltag_types_1.partScored)(alltag_a_1.partA), b: (0, alltag_types_1.partScored)(alltag_b_1.partB), c: (0, alltag_types_1.partScored)(alltag_c_1.partC), d: (0, alltag_types_1.partScored)(alltag_d_1.partD) };
// Every word card and word list of the teaching steps (Teil A has two card sets: the day and the times of the day).
const wordCount = (part) => part.steps.filter(step => step.kind === 'teach').flatMap(step => step.blocks ?? []).reduce((n, block) => n + (block.t === 'list' || block.t === 'cards' ? block.words.length : 0), 0);
/** The words a part teaches (its cards and word lists), for the contents page. */
exports.alltagWordCount = { a: wordCount(alltag_a_1.partA), b: wordCount(alltag_b_1.partB), c: wordCount(alltag_c_1.partC), d: wordCount(alltag_d_1.partD) };
/** The step groups of a part: the teaching steps, the exercises, the test and Konuş (cover and end belong to none). */
function alltagGroups(part) {
    const ids = (kind) => part.steps.filter(step => step.kind === kind).map(step => step.id);
    return [
        { id: 'konu', label: 'Konu anlatımı', ids: ids('teach') },
        { id: 'alistirmalar', label: 'Alıştırmalar', ids: ids('exercise') },
        { id: 'test', label: 'Test', ids: ids('test') },
        { id: 'konus', label: 'Konuş', ids: ids('speak') },
    ];
}
const alltagStepIndex = (part, id) => exports.alltagParts[part].steps.findIndex(step => step.id === id);
exports.alltagStepIndex = alltagStepIndex;
/** Every Turkish text of Lektion 5's data, for tests/alltag.test.cjs (each must be in every unit pack). */
const alltagTurkishTexts = () => [...alltag_types_1.alltagTurkish];
exports.alltagTurkishTexts = alltagTurkishTexts;
/** Is this one of Lektion 5's Turkish texts? (a question or option in the test: its language on the page). */
const isAlltagTurkish = (text) => alltag_types_1.alltagTurkish.has(text);
exports.isAlltagTurkish = isAlltagTurkish;
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
            block.words.forEach(word => add((0, alltag_types_1.wordSay)(word)));
            break;
        case 'list':
            block.words.forEach(([, , example]) => add(example));
            break;
        case 'ads':
            block.items.forEach(item => add(item.say));
            break;
    }
}
const choiceSay = (line) => line.say ?? (0, alltag_types_1.lineText)(line);
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
/** Every German text Lektion 5 speaks (rendered as site voices by scripts/voices). */
function alltagSpeechTexts() {
    const out = new Set();
    const add = (item) => { if (!item)
        return; const text = (0, willkommen_course_1.sayText)(item).trim(); if (text)
        out.add(text); };
    for (const part of exports.alltagPartList)
        part.steps.forEach(step => stepTexts(step, add));
    // The ratings of Konuş (app/berufe-a-steps.tsx `speakRatings`).
    ['sehr gut', 'gut', 'nicht so gut'].forEach(add);
    return [...out];
}
