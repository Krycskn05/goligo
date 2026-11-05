"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescueMisses = exports.rescueSolved = exports.RESCUE_KEYS = exports.RESCUE_BALLOONS = exports.QUICK_SECONDS = exports.CATCH_SECONDS = exports.RAIN_LIVES = exports.gameObject = exports.gameObjects = exports.ARTICLES = void 0;
exports.splitNoun = splitNoun;
exports.rainRound = rainRound;
exports.rainSeconds = rainSeconds;
exports.catchRound = catchRound;
exports.catchPoints = catchPoints;
exports.catchMultiplier = catchMultiplier;
exports.quickDeck = quickDeck;
exports.searchGrid = searchGrid;
exports.searchFind = searchFind;
exports.searchCells = searchCells;
exports.rescueRound = rescueRound;
exports.rescueMask = rescueMask;
exports.pluralRound = pluralRound;
const object_toon_art_json_1 = __importDefault(require("./object-toon-art.json"));
const object_course_1 = require("./object-course");
const article_challenges_1 = require("./article-challenges");
const verb_course_1 = require("./verb-course");
const verb_logic_1 = require("./verb-logic");
exports.ARTICLES = ['der', 'die', 'das'];
function mix(items, random = Math.random) { const result = [...items]; for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
} return result; }
/** "der Tisch" → {article:'der',noun:'Tisch'}; null for anything else. */
function splitNoun(de) {
    const match = /^(der|die|das) (\S+)$/.exec(de);
    return match ? { article: match[1], noun: match[2] } : null;
}
const hasArt = (word) => Object.prototype.hasOwnProperty.call(object_toon_art_json_1.default, word.id);
/** The vault words a game can show: with a picture and "article + one word". */
exports.gameObjects = object_course_1.objectVocabulary.filter(word => hasArt(word) && !!splitNoun(word.de));
const gameObject = (id) => exports.gameObjects.find(word => word.id === id);
exports.gameObject = gameObject;
/** The pictures that fall, each word once, in a new order every time. */
function rainRound(count = 20, random = Math.random) {
    return mix(exports.gameObjects, random).slice(0, count).map(word => { const { article, noun } = splitNoun(word.de); return { id: word.id, article, noun, de: word.de }; });
}
exports.RAIN_LIVES = 3;
/** Seconds for a picture to fall: slower at first, faster with every right answer (never under 2.8 s). */
function rainSeconds(correct) { return Math.max(2.8, 6 - correct * 0.25); }
/** A word to hear and four pictures (the other three from the same part of the vault when possible). */
function catchRound(count = 10, random = Math.random) {
    return mix(exports.gameObjects, random).slice(0, count).map(word => {
        const near = mix(exports.gameObjects.filter(other => other.id !== word.id && other.topic === word.topic), random);
        const far = mix(exports.gameObjects.filter(other => other.id !== word.id && other.topic !== word.topic), random);
        const others = [...near, ...far].slice(0, 3).map(other => other.id);
        return { id: word.id, de: word.de, options: mix([word.id, ...others], random) };
    });
}
exports.CATCH_SECONDS = 8;
/** Points for a right answer: 10, doubled after three right answers in a row, tripled after six. */
function catchPoints(streakBefore) { return 10 * Math.min(3, 1 + Math.floor(streakBefore / 3)); }
function catchMultiplier(streak) { return Math.min(3, 1 + Math.floor(streak / 3)); }
/**
 * Picture + word cards, about half of them right. Wrong ones are near misses: another article for the same noun, or
 * the other helping verb / a wrong Perfekt form for the verb. `correct` is the right form, shown after a mistake.
 */
function quickDeck(count = 60, random = Math.random) {
    const cards = [];
    const objects = mix(exports.gameObjects, random);
    const pictured = mix(verb_course_1.verbs.filter(verb => (0, verb_logic_1.verbPicture)(verb)), random);
    for (let i = 0; cards.length < count && (i < objects.length || i < pictured.length); i++) {
        const word = objects[i % objects.length];
        if (word) {
            const { article, noun } = splitNoun(word.de);
            const right = random() < 0.5;
            const wrongArticle = mix(exports.ARTICLES.filter(a => a !== article), random)[0];
            cards.push({ key: 'o' + i, kind: 'object', id: word.id, shown: right ? word.de : wrongArticle + ' ' + noun, correct: word.de, right });
        }
        const verb = pictured[i % pictured.length];
        if (verb && cards.length < count) {
            const right = random() < 0.5;
            const correct = verbPerfekt(verb);
            const wrong = mix(verb.perfektWrong.filter(form => form && form !== verb.perfekt), random)[0] ?? swapAux(verb);
            cards.push({ key: 'v' + i, kind: 'verb', id: verb.id, shown: right ? correct : wrong, correct, right: right || wrong === correct });
        }
    }
    return mix(cards, random).slice(0, count);
}
const verbPerfekt = (verb) => verb.alsoIst ? 'hat/ist ' + verb.participle : verb.perfekt;
const swapAux = (verb) => (verb.aux === 'hat' ? 'ist ' : 'hat ') + verb.participle;
exports.QUICK_SECONDS = 30;
const FILL = 'ABCDEFGHIJKLMNOPRSTUVWZÄÖÜ';
const searchable = (noun, size) => noun.length >= 3 && noun.length <= size && /^[A-Za-zÄÖÜäöü]+$/.test(noun);
/**
 * A square of letters with `count` hidden nouns (upper case), each left to right or top to bottom; crossing words share
 * a letter. Words come from one part of the vault when it has enough, so the grid has a theme.
 */
function searchGrid(size = 8, count = 6, random = Math.random) {
    const fits = exports.gameObjects.filter(word => searchable(splitNoun(word.de).noun, size));
    const topics = mix([...new Set(fits.map(word => word.topic))], random);
    const topic = topics.find(id => fits.filter(word => word.topic === id).length >= count + 2);
    const pool = mix(topic ? fits.filter(word => word.topic === topic) : fits, random);
    for (let attempt = 0; attempt < 40; attempt++) {
        const cells = Array(size * size).fill('');
        const words = [];
        const used = new Set();
        for (const word of pool) {
            if (words.length >= count)
                break;
            const letters = splitNoun(word.de).noun.toUpperCase();
            if (used.has(letters))
                continue;
            const spots = [];
            for (let row = 0; row < size; row++)
                for (let col = 0; col < size; col++)
                    for (const across of [true, false]) {
                        if ((across ? col : row) + letters.length > size)
                            continue;
                        let ok = true;
                        for (let k = 0; k < letters.length && ok; k++) {
                            const cell = cells[(row + (across ? 0 : k)) * size + col + (across ? k : 0)];
                            if (cell && cell !== letters[k])
                                ok = false;
                        }
                        if (ok)
                            spots.push({ row, col, across });
                    }
            if (!spots.length)
                continue;
            const spot = spots[Math.floor(random() * spots.length)];
            for (let k = 0; k < letters.length; k++)
                cells[(spot.row + (spot.across ? 0 : k)) * size + spot.col + (spot.across ? k : 0)] = letters[k];
            words.push({ id: word.id, de: word.de, letters, ...spot });
            used.add(letters);
        }
        if (words.length < Math.min(count, pool.length))
            continue;
        return { size, cells: cells.map(cell => cell || FILL[Math.floor(random() * FILL.length)]), words };
    }
    return { size, cells: Array(size * size).fill('A'), words: [] };
}
/** The word a straight line from one cell to another spells (left to right or top to bottom), if it is hidden there. */
function searchFind(grid, from, to) {
    const a = { row: Math.floor(from / grid.size), col: from % grid.size }, b = { row: Math.floor(to / grid.size), col: to % grid.size };
    const start = a.row < b.row || (a.row === b.row && a.col < b.col) ? a : b, end = start === a ? b : a;
    const across = start.row === end.row;
    if (!across && start.col !== end.col)
        return null;
    return grid.words.find(word => word.across === across && word.row === start.row && word.col === start.col && word.letters.length === (across ? end.col - start.col : end.row - start.row) + 1) ?? null;
}
/** The cells a hidden word covers. */
function searchCells(grid, word) { return Array.from(word.letters, (_, k) => (word.row + (word.across ? 0 : k)) * grid.size + word.col + (word.across ? k : 0)); }
exports.RESCUE_BALLOONS = 6;
/** Letters of the on-screen keyboard. */
exports.RESCUE_KEYS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'Ä', 'Ö', 'Ü'];
function rescueRound(count = 5, random = Math.random) {
    return mix(exports.gameObjects.filter(word => { const noun = splitNoun(word.de).noun; return noun.length >= 4 && noun.length <= 11 && /^[A-Za-zÄÖÜäöü]+$/.test(noun); }), random).slice(0, count).map(word => { const { article, noun } = splitNoun(word.de); return { id: word.id, article, noun, de: word.de }; });
}
/** The noun with the guessed letters shown and the rest as blanks (case does not matter when guessing). */
function rescueMask(noun, guessed) { return Array.from(noun, letter => guessed.has(letter.toUpperCase()) ? letter : '_'); }
const rescueSolved = (noun, guessed) => Array.from(noun).every(letter => guessed.has(letter.toUpperCase()));
exports.rescueSolved = rescueSolved;
const rescueMisses = (noun, guessed) => [...guessed].filter(letter => !noun.toUpperCase().includes(letter)).length;
exports.rescueMisses = rescueMisses;
/** Six pairs: "der Tisch" ↔ "die Tische" (every plural takes die). */
function pluralRound(pairs = 6, random = Math.random) {
    const pool = exports.gameObjects.filter(word => Object.prototype.hasOwnProperty.call(article_challenges_1.pluralNouns, word.id));
    const cards = [];
    for (const word of mix(pool, random).slice(0, pairs)) {
        cards.push({ id: word.id + ':singular', pair: word.id, face: 'singular', text: word.de });
        cards.push({ id: word.id + ':plural', pair: word.id, face: 'plural', text: 'die ' + article_challenges_1.pluralNouns[word.id] });
    }
    return mix(cards, random);
}
