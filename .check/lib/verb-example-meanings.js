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
exports.exampleMeaningLanguages = void 0;
exports.loadExampleMeanings = loadExampleMeanings;
exports.exampleMeaning = exampleMeaning;
const loaders = {
    tr: () => Promise.resolve().then(() => __importStar(require('./verb-examples.tr.json'))),
    en: () => Promise.resolve().then(() => __importStar(require('./verb-examples.en.json'))),
    ar: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ar.json'))),
    uk: () => Promise.resolve().then(() => __importStar(require('./verb-examples.uk.json'))),
    fr: () => Promise.resolve().then(() => __importStar(require('./verb-examples.fr.json'))),
    es: () => Promise.resolve().then(() => __importStar(require('./verb-examples.es.json'))),
    ru: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ru.json'))),
    fa: () => Promise.resolve().then(() => __importStar(require('./verb-examples.fa.json'))),
    pl: () => Promise.resolve().then(() => __importStar(require('./verb-examples.pl.json'))),
    it: () => Promise.resolve().then(() => __importStar(require('./verb-examples.it.json'))),
    pt: () => Promise.resolve().then(() => __importStar(require('./verb-examples.pt.json'))),
    ku: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ku.json'))),
    sq: () => Promise.resolve().then(() => __importStar(require('./verb-examples.sq.json'))),
    ro: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ro.json'))),
    bg: () => Promise.resolve().then(() => __importStar(require('./verb-examples.bg.json'))),
    hbs: () => Promise.resolve().then(() => __importStar(require('./verb-examples.hbs.json'))),
    el: () => Promise.resolve().then(() => __importStar(require('./verb-examples.el.json'))),
    vi: () => Promise.resolve().then(() => __importStar(require('./verb-examples.vi.json'))),
    prs: () => Promise.resolve().then(() => __importStar(require('./verb-examples.prs.json'))),
    ps: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ps.json'))),
    ti: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ti.json'))),
    so: () => Promise.resolve().then(() => __importStar(require('./verb-examples.so.json'))),
    zh: () => Promise.resolve().then(() => __importStar(require('./verb-examples.zh.json'))),
    hi: () => Promise.resolve().then(() => __importStar(require('./verb-examples.hi.json'))),
    ur: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ur.json'))),
    ja: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ja.json'))),
    ko: () => Promise.resolve().then(() => __importStar(require('./verb-examples.ko.json'))),
    nl: () => Promise.resolve().then(() => __importStar(require('./verb-examples.nl.json'))),
    hu: () => Promise.resolve().then(() => __importStar(require('./verb-examples.hu.json'))),
    cs: () => Promise.resolve().then(() => __importStar(require('./verb-examples.cs.json'))),
};
exports.exampleMeaningLanguages = Object.keys(loaders);
const cache = new Map();
/** The meanings in one language (null for German or when the file cannot be loaded). */
function loadExampleMeanings(language) {
    const load = loaders[language];
    if (!load)
        return Promise.resolve(null);
    let pending = cache.get(language);
    if (!pending) {
        pending = load().then(module => module.default).catch(() => { cache.delete(language); return null; });
        cache.set(language, pending);
    }
    return pending;
}
/** The meaning of one sentence: verb, tense and the person's place (0 = ich … 8 = Sie). */
function exampleMeaning(meanings, verbId, tense, index) {
    return meanings?.[verbId]?.[tense === 'praesens' ? 0 : 1]?.[index] ?? '';
}
