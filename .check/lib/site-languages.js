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
exports.packLanguages = exports.languageLocale = exports.languageDirection = exports.siteLanguageIndex = exports.isSiteLanguage = exports.siteLanguages = void 0;
exports.setPackListener = setPackListener;
exports.registerLanguagePack = registerLanguagePack;
exports.hasLanguagePack = hasLanguagePack;
exports.loadLanguagePack = loadLanguagePack;
exports.packText = packText;
exports.pickText = pickText;
/**
 * The site languages: one list for every page (lessons, Ev ve Yaşam, Nesne Kasası, Fiil Atölyesi).
 * The order matters: text tuples in the code are written in this order (tr de en ar uk fr, the vault
 * copy also es ru fa pl it pt). A language that a tuple does not contain reads its text from a
 * language pack (lib/language-packs/<id>.json, English text → translation) that is loaded on demand.
 */
exports.siteLanguages = [
    { id: 'tr', label: 'Türkçe', dir: 'ltr', locale: 'tr-TR' },
    { id: 'de', label: 'Deutsch', dir: 'ltr', locale: 'de-DE' },
    { id: 'en', label: 'English', dir: 'ltr', locale: 'en-GB' },
    { id: 'ar', label: 'العربية', dir: 'rtl', locale: 'ar' },
    { id: 'uk', label: 'Українська', dir: 'ltr', locale: 'uk-UA' },
    { id: 'fr', label: 'Français', dir: 'ltr', locale: 'fr-FR' },
    { id: 'es', label: 'Español', dir: 'ltr', locale: 'es-ES' },
    { id: 'ru', label: 'Русский', dir: 'ltr', locale: 'ru-RU' },
    { id: 'fa', label: 'فارسی', dir: 'rtl', locale: 'fa-IR' },
    { id: 'pl', label: 'Polski', dir: 'ltr', locale: 'pl-PL' },
    { id: 'it', label: 'Italiano', dir: 'ltr', locale: 'it-IT' },
    { id: 'pt', label: 'Português', dir: 'ltr', locale: 'pt-BR' },
    { id: 'ku', label: 'Kurdî (Kurmancî)', dir: 'ltr', locale: 'ku' },
    { id: 'sq', label: 'Shqip', dir: 'ltr', locale: 'sq-AL' },
    { id: 'ro', label: 'Română', dir: 'ltr', locale: 'ro-RO' },
    { id: 'bg', label: 'Български', dir: 'ltr', locale: 'bg-BG' },
    { id: 'hbs', label: 'Bosanski / Hrvatski / Srpski', dir: 'ltr', locale: 'hr-HR' },
    { id: 'el', label: 'Ελληνικά', dir: 'ltr', locale: 'el-GR' },
    { id: 'vi', label: 'Tiếng Việt', dir: 'ltr', locale: 'vi-VN' },
    { id: 'prs', label: 'دری', dir: 'rtl', locale: 'fa-AF' },
    { id: 'ps', label: 'پښتو', dir: 'rtl', locale: 'ps-AF' },
    { id: 'ti', label: 'ትግርኛ', dir: 'ltr', locale: 'ti-ER' },
    { id: 'so', label: 'Soomaali', dir: 'ltr', locale: 'so-SO' },
    { id: 'zh', label: '中文（简体）', dir: 'ltr', locale: 'zh-CN' },
    { id: 'hi', label: 'हिन्दी', dir: 'ltr', locale: 'hi-IN' },
    { id: 'ur', label: 'اردو', dir: 'rtl', locale: 'ur-PK' },
    { id: 'ja', label: '日本語', dir: 'ltr', locale: 'ja-JP' },
    { id: 'ko', label: '한국어', dir: 'ltr', locale: 'ko-KR' },
    { id: 'nl', label: 'Nederlands', dir: 'ltr', locale: 'nl-NL' },
    { id: 'hu', label: 'Magyar', dir: 'ltr', locale: 'hu-HU' },
    { id: 'cs', label: 'Čeština', dir: 'ltr', locale: 'cs-CZ' },
];
const positions = new Map(exports.siteLanguages.map((item, index) => [item.id, index]));
const isSiteLanguage = (value) => typeof value === 'string' && positions.has(value);
exports.isSiteLanguage = isSiteLanguage;
/** The language's place in the master order (= its index in the text tuples); 0 (Turkish) for unknown values. */
const siteLanguageIndex = (language) => positions.get(language) ?? 0;
exports.siteLanguageIndex = siteLanguageIndex;
const languageDirection = (language) => exports.siteLanguages[(0, exports.siteLanguageIndex)(language)].dir;
exports.languageDirection = languageDirection;
const languageLocale = (language) => exports.siteLanguages[(0, exports.siteLanguageIndex)(language)].locale;
exports.languageLocale = languageLocale;
/** Languages whose texts are written in the code tuples themselves (every tuple has at least these six). */
const builtIn = new Set(['tr', 'de', 'en', 'ar', 'uk', 'fr']);
const loaders = {
    es: () => Promise.resolve().then(() => __importStar(require('./language-packs/es.json'))),
    ru: () => Promise.resolve().then(() => __importStar(require('./language-packs/ru.json'))),
    fa: () => Promise.resolve().then(() => __importStar(require('./language-packs/fa.json'))),
    pl: () => Promise.resolve().then(() => __importStar(require('./language-packs/pl.json'))),
    it: () => Promise.resolve().then(() => __importStar(require('./language-packs/it.json'))),
    pt: () => Promise.resolve().then(() => __importStar(require('./language-packs/pt.json'))),
    ku: () => Promise.resolve().then(() => __importStar(require('./language-packs/ku.json'))),
    sq: () => Promise.resolve().then(() => __importStar(require('./language-packs/sq.json'))),
    ro: () => Promise.resolve().then(() => __importStar(require('./language-packs/ro.json'))),
    bg: () => Promise.resolve().then(() => __importStar(require('./language-packs/bg.json'))),
    hbs: () => Promise.resolve().then(() => __importStar(require('./language-packs/hbs.json'))),
    el: () => Promise.resolve().then(() => __importStar(require('./language-packs/el.json'))),
    vi: () => Promise.resolve().then(() => __importStar(require('./language-packs/vi.json'))),
    prs: () => Promise.resolve().then(() => __importStar(require('./language-packs/prs.json'))),
    ps: () => Promise.resolve().then(() => __importStar(require('./language-packs/ps.json'))),
    ti: () => Promise.resolve().then(() => __importStar(require('./language-packs/ti.json'))),
    so: () => Promise.resolve().then(() => __importStar(require('./language-packs/so.json'))),
    zh: () => Promise.resolve().then(() => __importStar(require('./language-packs/zh.json'))),
    hi: () => Promise.resolve().then(() => __importStar(require('./language-packs/hi.json'))),
    ur: () => Promise.resolve().then(() => __importStar(require('./language-packs/ur.json'))),
    ja: () => Promise.resolve().then(() => __importStar(require('./language-packs/ja.json'))),
    ko: () => Promise.resolve().then(() => __importStar(require('./language-packs/ko.json'))),
    nl: () => Promise.resolve().then(() => __importStar(require('./language-packs/nl.json'))),
    hu: () => Promise.resolve().then(() => __importStar(require('./language-packs/hu.json'))),
    cs: () => Promise.resolve().then(() => __importStar(require('./language-packs/cs.json'))),
};
/** Languages that read (part of) their texts from a language pack. */
exports.packLanguages = Object.keys(loaders);
const packs = new Map();
const pending = new Map();
let listener = null;
/** Test/coverage hook: called with every English text that is looked up in a pack. */
function setPackListener(next) { listener = next; }
function registerLanguagePack(language, pack) { packs.set(language, pack); }
function hasLanguagePack(language) { return builtIn.has(language) || !loaders[language] || packs.has(language); }
/** Loads the language's pack once. Never rejects: on failure the English texts are shown and a later call retries. */
function loadLanguagePack(language) {
    const load = loaders[language];
    if (!load || packs.has(language))
        return Promise.resolve();
    let job = pending.get(language);
    if (!job) {
        job = load().then(module => { const data = (module.default ?? module); packs.set(language, data && typeof data === 'object' ? data : {}); }).catch(() => { }).finally(() => { pending.delete(language); });
        pending.set(language, job);
    }
    return job;
}
/** A text from the language pack, by its English original (the English text itself when missing). */
function packText(language, english) {
    // An English "one||other" text (lib/copy-fill.ts pluralPick) is found in the packs by its plural, the text they were made from.
    const key = english.includes('||') ? english.slice(english.lastIndexOf('||') + 2) : english;
    listener?.(language, key);
    if (!key)
        return key;
    return packs.get(language)?.[key] || english;
}
/** Picks the language's text from a tuple ordered like siteLanguages; later languages use the pack. */
function pickText(tuple, language) {
    const index = (0, exports.siteLanguageIndex)(language);
    return index < tuple.length ? tuple[index] : packText(language, tuple[2] ?? '');
}
