"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineText = exports.wordSay = exports.line = exports.listWord = exports.row = exports.check = exports.orteTurkish = void 0;
exports.T = T;
exports.choiceLine = choiceLine;
exports.exerciseTotal = exerciseTotal;
exports.partScored = partScored;
/** Every Turkish text of Lektion 3's data (filled while the parts load). */
exports.orteTurkish = new Set();
/** A Turkish text of Lektion 3: shown in the page's language through the unit packs. */
function T(text) { exports.orteTurkish.add(text); return text; }
/* ---------- small helpers for the parts ---------- */
const check = (q, options, say = options[0]) => ({ q, options, say });
exports.check = check;
/** A German sentence with its meaning (the meaning through `T`). */
const row = (de, tr) => [de, T(tr)];
exports.row = row;
/** A word of a list (meanings through `T`). */
const listWord = (de, tr, example, exampleTr) => [de, T(tr), example, T(exampleTr)];
exports.listWord = listWord;
/** A dialogue line (the meaning through `T`). */
const line = (who, de, tr, from) => ({ who, de, tr: T(tr), ...(from ? { from: T(from) } : {}) });
exports.line = line;
/** What a word card reads: "der Tisch, die Tische", or the word alone. */
const wordSay = (word) => word.say ?? (word.plural ? word.de + ', die ' + word.plural : word.de);
exports.wordSay = wordSay;
/** The sentence a choice line makes once every gap is right. */
const lineText = (line) => line.parts.map(part => typeof part === 'string' ? part : part.answer).join('');
exports.lineText = lineText;
/** A choice line whose finished sentence is read (by `who` when it has one). */
function choiceLine(key, parts, who, prompt) {
    const line = { key, parts, ...(who ? { who } : {}), ...(prompt ? { prompt } : {}) };
    return { ...line, say: who ? { text: (0, exports.lineText)(line), who } : (0, exports.lineText)(line) };
}
const gapsOf = (lines) => lines.reduce((n, item) => n + item.parts.filter(part => typeof part !== 'string').length, 0);
/** The points of an exercise: one per gap, item, row or required sentence. */
function exerciseTotal(exercise) {
    switch (exercise.type) {
        case 'quiz': return exercise.items.length;
        case 'choice': return gapsOf(exercise.lines);
        case 'gaps': return exercise.lines.reduce((n, item) => n + item.answers.length, 0);
        case 'write': return exercise.rows.length;
        case 'own': return exercise.prompts.filter(prompt => !prompt.optional).length;
    }
}
/** The scored steps of a part: the exercises and the test. */
function partScored(part) {
    return part.steps.flatMap(step => step.exercise ? [{ id: step.id, total: exerciseTotal(step.exercise) }] : step.test ? [{ id: step.id, total: step.test.length }] : []);
}
