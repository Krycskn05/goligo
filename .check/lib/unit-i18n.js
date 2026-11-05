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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitT = exports.unitPackLanguages = void 0;
exports.registerUnitPack = registerUnitPack;
exports.hasUnitPack = hasUnitPack;
exports.loadUnitPack = loadUnitPack;
exports.unitText = unitText;
exports.setUnitLanguage = setUnitLanguage;
exports.ut = ut;
exports.utBeside = utBeside;
exports.utLang = utLang;
const copy_fill_1 = require("./copy-fill");
const loaders = {
    en: () => Promise.resolve().then(() => __importStar(require('./unit-packs/en.json'))), ar: () => Promise.resolve().then(() => __importStar(require('./unit-packs/ar.json'))), uk: () => Promise.resolve().then(() => __importStar(require('./unit-packs/uk.json'))),
    // German explanations (the learner asked, 3 November 2026: every unit in tr, en, ar, uk and de).
    de: () => Promise.resolve().then(() => __importStar(require('./unit-packs/de.json'))),
};
/** The languages with a pack for these lessons (Turkish is the original). */
exports.unitPackLanguages = Object.keys(loaders);
const packs = new Map();
const pending = new Map();
function registerUnitPack(language, pack) { packs.set(language, pack); }
function hasUnitPack(language) { return language === 'tr' || packs.has(language); }
/** Loads the language's pack once. Never rejects: on failure the Turkish texts are shown and a later call retries. */
function loadUnitPack(language) {
    const load = loaders[language];
    if (!load || packs.has(language))
        return Promise.resolve();
    let job = pending.get(language);
    if (!job) {
        job = load().then(module => { const data = (module.default ?? module); registerUnitPack(language, data && typeof data === 'object' ? data : {}); }).catch(() => { }).finally(() => { pending.delete(language); });
        pending.set(language, job);
    }
    return job;
}
/** One Turkish text of these lessons in the language (the text itself when the pack has none). */
function unitText(language, text, params) {
    if (text === undefined)
        return text;
    const pack = language === 'tr' ? undefined : packs.get(language);
    const out = pack && Object.prototype.hasOwnProperty.call(pack, text) ? pack[text] : text;
    return (params ? (0, copy_fill_1.fillText)(out, params) : out);
}
/** The translator of a page or a step: `const u=unitT(language)`, then `u('Türkçe metin')` or `u(item.tr)`. */
const unitT = (language) => (text, params) => unitText(language, text, params);
exports.unitT = unitT;
/*
 * The language of the lesson page on the screen. A lesson page only mounts in the browser, one at a time, and holds the
 * language in its own state, so it sets it here while it renders (`setUnitLanguage`) and every step, exercise and helper
 * below it shows its texts with `ut('Türkçe metin')` without passing the language down. Texts kept in state (the line
 * under an exercise) stay Turkish with their {marks} and are translated where they are shown.
 */
let current = 'tr';
function setUnitLanguage(language) { current = language; }
function ut(text, params) { return unitText(current, text, params); }
/** Loose comparison: case, a leading article, markup and punctuation do not count. */
const loose = (text) => text.toLowerCase().replace(/[*~_|·]/g, ' ').replace(/^\s*(der|die|das)\s+/, '').replace(/[.!?,;:„“"()…–—-]+/g, ' ').replace(/\s+/g, ' ').trim();
/**
 * A meaning shown beside German, or a prompt whose answer is German: nothing when, in the help language, it would only
 * repeat that German (with German help „Italien – Italien“, or a „build this sentence“ prompt that gives the answer away).
 */
function utBeside(german, text, params) {
    const shown = unitText(current, text, params);
    return current !== 'tr' && loose(shown) === loose(german) ? '' : shown;
}
/** The lang of a Turkish text where it is shown: 'tr' while it is still Turkish, otherwise the page's language. */
function utLang(text) { return unitText(current, text) === text ? 'tr' : current; }
