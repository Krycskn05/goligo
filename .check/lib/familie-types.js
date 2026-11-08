"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gap = exports.line = exports.listWord = exports.row = exports.familieTurkish = exports.partScored = exports.exerciseTotal = exports.lineText = exports.wordSay = exports.choiceLine = exports.check = void 0;
exports.T = T;
var orte_types_1 = require("./orte-types");
Object.defineProperty(exports, "check", { enumerable: true, get: function () { return orte_types_1.check; } });
Object.defineProperty(exports, "choiceLine", { enumerable: true, get: function () { return orte_types_1.choiceLine; } });
Object.defineProperty(exports, "wordSay", { enumerable: true, get: function () { return orte_types_1.wordSay; } });
Object.defineProperty(exports, "lineText", { enumerable: true, get: function () { return orte_types_1.lineText; } });
Object.defineProperty(exports, "exerciseTotal", { enumerable: true, get: function () { return orte_types_1.exerciseTotal; } });
Object.defineProperty(exports, "partScored", { enumerable: true, get: function () { return orte_types_1.partScored; } });
/** Every Turkish text of Lektion 4's data (filled while the parts load). */
exports.familieTurkish = new Set();
/** A Turkish text of Lektion 4: shown in the page's language through the unit packs. */
function T(text) { exports.familieTurkish.add(text); return text; }
/** A German sentence with its meaning (the meaning through `T`). */
const row = (de, tr) => [de, T(tr)];
exports.row = row;
/** A word of a list (meanings through `T`). */
const listWord = (de, tr, example, exampleTr) => [de, T(tr), example, T(exampleTr)];
exports.listWord = listWord;
/** A dialogue line (the meaning through `T`). */
const line = (who, de, tr, from) => ({ who, de, tr: T(tr), ...(from ? { from: T(from) } : {}) });
exports.line = line;
/** A choice inside a sentence: the options and the right one. */
const gap = (options, answer) => ({ options, answer });
exports.gap = gap;
