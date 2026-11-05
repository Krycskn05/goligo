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
exports.l12PackLanguages = void 0;
exports.registerL12Pack = registerL12Pack;
exports.hasL12Pack = hasL12Pack;
exports.loadL12Pack = loadL12Pack;
exports.l12Ui = l12Ui;
exports.localizeL12Parts = localizeL12Parts;
exports.localizeL12Tasks = localizeL12Tasks;
exports.hasTurkish = hasTurkish;
exports.l12ContentTexts = l12ContentTexts;
const copy_fill_1 = require("./copy-fill");
// Still to come (shown in Turkish with a note until then): ku vi prs ps ti so hi ur.
const loaders = {
    de: () => Promise.resolve().then(() => __importStar(require('./l12-packs/de.json'))), en: () => Promise.resolve().then(() => __importStar(require('./l12-packs/en.json'))), ar: () => Promise.resolve().then(() => __importStar(require('./l12-packs/ar.json'))),
    uk: () => Promise.resolve().then(() => __importStar(require('./l12-packs/uk.json'))), fr: () => Promise.resolve().then(() => __importStar(require('./l12-packs/fr.json'))), es: () => Promise.resolve().then(() => __importStar(require('./l12-packs/es.json'))),
    ru: () => Promise.resolve().then(() => __importStar(require('./l12-packs/ru.json'))), fa: () => Promise.resolve().then(() => __importStar(require('./l12-packs/fa.json'))), pl: () => Promise.resolve().then(() => __importStar(require('./l12-packs/pl.json'))),
    it: () => Promise.resolve().then(() => __importStar(require('./l12-packs/it.json'))), pt: () => Promise.resolve().then(() => __importStar(require('./l12-packs/pt.json'))),
    sq: () => Promise.resolve().then(() => __importStar(require('./l12-packs/sq.json'))), ro: () => Promise.resolve().then(() => __importStar(require('./l12-packs/ro.json'))), bg: () => Promise.resolve().then(() => __importStar(require('./l12-packs/bg.json'))),
    hbs: () => Promise.resolve().then(() => __importStar(require('./l12-packs/hbs.json'))), el: () => Promise.resolve().then(() => __importStar(require('./l12-packs/el.json'))),
    zh: () => Promise.resolve().then(() => __importStar(require('./l12-packs/zh.json'))), ja: () => Promise.resolve().then(() => __importStar(require('./l12-packs/ja.json'))), ko: () => Promise.resolve().then(() => __importStar(require('./l12-packs/ko.json'))),
    nl: () => Promise.resolve().then(() => __importStar(require('./l12-packs/nl.json'))), hu: () => Promise.resolve().then(() => __importStar(require('./l12-packs/hu.json'))), cs: () => Promise.resolve().then(() => __importStar(require('./l12-packs/cs.json'))),
};
/** The languages with a Lektion 12 pack (Turkish is the original). */
exports.l12PackLanguages = Object.keys(loaders);
const packs = new Map();
const pending = new Map();
function registerL12Pack(language, pack) { packs.set(language, pack); cache.delete(language); }
function hasL12Pack(language) { return language === 'tr' || packs.has(language); }
/** Loads the language's pack once. Never rejects: on failure the Turkish texts are shown and a later call retries. */
function loadL12Pack(language) {
    const load = loaders[language];
    if (!load || packs.has(language))
        return Promise.resolve();
    let job = pending.get(language);
    if (!job) {
        job = load().then(module => { const data = (module.default ?? module); registerL12Pack(language, { ui: data?.ui ?? {}, content: data?.content ?? {} }); }).catch(() => { }).finally(() => { pending.delete(language); });
        pending.set(language, job);
    }
    return job;
}
/** A text of the lesson's pages (buttons, notes) in the language; {name} marks are filled in. */
function l12Ui(language, text, params) {
    const translated = language === 'tr' ? text : packs.get(language)?.ui[text] ?? text;
    return params ? (0, copy_fill_1.fillText)(translated, params) : translated;
}
const cache = new Map();
/** One text in the language: its translation when the pack has one, otherwise the text itself. */
function textIn(pack) {
    return (text) => (text !== undefined && pack && Object.prototype.hasOwnProperty.call(pack, text) ? pack[text] : text);
}
function localBlock(block, tr) {
    switch (block.t) {
        case 'p':
        case 'h':
        case 'note': return { ...block, text: tr(block.text) };
        case 'list': return { ...block, items: block.items.map(tr) };
        case 'vocab': return { ...block, title: tr(block.title), lead: tr(block.lead), words: block.words.map(word => [word[0], tr(word[1]), ...word.slice(2)]) };
        case 'table': return { ...block, head: block.head.map(tr), rows: block.frame ? block.rows : block.rows.map(row => row.map(tr)) };
        case 'listen': return { ...block, text: tr(block.text) };
        default: return block;
    }
}
function localItem(item, tr) {
    switch (item.k) {
        case 'gap': return { ...item, text: tr(item.text) };
        case 'choice': return { ...item, text: tr(item.text), options: item.options.map(tr) };
        // A picked word is checked against `accept`: both change the same way.
        case 'pick': return { ...item, prompt: tr(item.prompt), options: item.options.map(tr), accept: item.accept.map(tr) };
        case 'sentence': return { ...item, prompt: tr(item.prompt) };
        case 'open': return { ...item, prompt: tr(item.prompt), sample: tr(item.sample) };
    }
}
/**
 * The lesson's parts with their Turkish texts in the language — only the fields that hold explanations, meanings and
 * tasks (as l12ContentTexts lists them); ids, German material and the answers that are checked stay as they are.
 */
function localizeL12Parts(parts, language) {
    const pack = language === 'tr' ? undefined : packs.get(language)?.content;
    if (!pack)
        return parts;
    const kept = cache.get(language);
    if (kept?.parts)
        return kept.parts;
    const tr = textIn(pack);
    const out = parts.map(part => ({ ...part, lead: tr(part.lead), card: tr(part.card),
        sections: part.sections.map(section => ({ ...section, title: tr(section.title), blocks: section.blocks.map(block => localBlock(block, tr)) })),
        exercises: part.exercises.map(exercise => ({ ...exercise, title: tr(exercise.title), hint: tr(exercise.hint), key: tr(exercise.key),
            reading: exercise.reading && { ...exercise.reading, title: tr(exercise.reading.title), lines: exercise.reading.lines.map(tr) },
            items: exercise.items.map(item => localItem(item, tr)) })),
        after: part.after?.map(block => localBlock(block, tr)) }));
    cache.set(language, { ...kept, parts: out });
    return out;
}
/** The listening tasks with their Turkish texts in the language (a chosen option and its answer change together). */
function localizeL12Tasks(tasks, language) {
    const pack = language === 'tr' ? undefined : packs.get(language)?.content;
    if (!pack)
        return tasks;
    const kept = cache.get(language);
    if (kept?.tasks)
        return kept.tasks;
    const tr = textIn(pack);
    const out = tasks.map(task => ({ ...task, title: tr(task.title), hint: tr(task.hint), questions: task.questions.map(question => {
            switch (question.type) {
                case 'rf': return { ...question, text: tr(question.text) };
                case 'mc': return { ...question, text: tr(question.text), options: question.options.map(tr), label: tr(question.label) };
                case 'select': return { ...question, text: tr(question.text), options: question.options.map(tr), answer: tr(question.answer) };
                case 'text': return { ...question, text: tr(question.text), placeholder: tr(question.placeholder) };
                case 'dict': return { ...question, label: tr(question.label), placeholder: tr(question.placeholder) };
            }
        }) }));
    cache.set(language, { ...kept, tasks: out });
    return out;
}
// ---- Which texts are Turkish (the source list for the packs; tested against every pack) ----
const TURKISH_LETTERS = /[çğışİÇĞŞ]/;
const TURKISH_WORDS = /(^|[^\p{L}])(ve|bir|ile|için|bu|şu|ne|hangi|kim|kelime|kelimeler|cümle|soru|cevap|doğru|yanlış|dinle|yaz|oku|seç|örnek|örnekler|fiil|geçmiş|gelecek|kural|dikkat|olarak|olur|gibi|yani|sonra|önce|değil|var|yok|tekil|çoğul|düzenli|düzensiz|resmî|özel|zaman|son|yazılış|okunuş|türkçe|almanca|kişi|isim|ek|kök|eğitim|meslek|staj|okul|okulu|etmek|yapmak|olmak|kazanmak|almak|vermek|bulmak|başlamak|bitirmek|anlatmak|istemek|göre|kadar|her|hiç|da|de|mı|mi|mu|mü)(?=$|[^\p{L}])/iu;
/** True when a text has Turkish in it, outside its German parts (*…*, „…“). */
function hasTurkish(text) {
    if (typeof text !== 'string')
        return false;
    const outside = text.replace(/\*\*([^*]+)\*\*/g, ' $1 ').replace(/\*[^*]+\*/g, ' ').replace(/„[^“]*“/g, ' ');
    return TURKISH_LETTERS.test(outside) || TURKISH_WORDS.test(outside);
}
function blockTexts(block, add) {
    switch (block.t) {
        case 'p':
        case 'h':
        case 'note':
            add(block.text);
            break;
        case 'list':
            block.items.forEach(item => add(item));
            break;
        case 'vocab':
            add(block.title, true);
            add(block.lead, true);
            block.words.forEach(word => add(word[1], true));
            break;
        case 'table':
            block.head.forEach(cell => add(cell, true));
            if (!block.frame)
                block.rows.forEach(row => row.forEach(cell => add(cell, !/^\*[^*]+\*$/.test(cell.trim()))));
            break;
        case 'listen':
            add(block.text);
            break;
        case 'letter': break;
    }
}
function itemTexts(item, add) {
    if (item.k === 'gap' || item.k === 'choice')
        add(item.text);
    if (item.k === 'choice' || item.k === 'pick')
        item.options.forEach(option => add(option));
    if (item.k === 'sentence' || item.k === 'open' || item.k === 'pick')
        add(item.prompt);
    if (item.k === 'open')
        add(item.sample);
}
/** Every Turkish text of the lesson's data, once each, in book order. */
function l12ContentTexts(parts, tasks, roadmap = []) {
    const out = new Set();
    const add = (text, always = false) => { if (typeof text === 'string' && /\p{L}/u.test(text) && (always || hasTurkish(text)))
        out.add(text); };
    roadmap.forEach(text => add(text, true));
    for (const part of parts) {
        add(part.lead, true);
        add(part.card, true);
        for (const section of part.sections) {
            add(section.title);
            section.blocks.forEach(block => blockTexts(block, add));
        }
        for (const exercise of part.exercises) {
            add(exercise.title);
            add(exercise.hint, true);
            add(exercise.key, true);
            exercise.reading?.lines.forEach(line => add(line));
            add(exercise.reading?.title);
            exercise.items.forEach(item => itemTexts(item, add));
        }
        part.after?.forEach(block => blockTexts(block, add));
    }
    for (const task of tasks) {
        add(task.title);
        add(task.hint, true);
        for (const question of task.questions) {
            if ('text' in question)
                add(question.text);
            if ('options' in question)
                question.options.forEach(option => add(option));
            if ('label' in question)
                add(question.label);
            if ('placeholder' in question)
                add(question.placeholder);
        }
    }
    return [...out];
}
