"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.belongsToLearningLanguage = exports.learningLocale = exports.ENGLISH_COURSE_ENABLED = exports.isLearningLanguage = void 0;
exports.readLearningLanguage = readLearningLanguage;
exports.activeLearningLanguage = activeLearningLanguage;
exports.saveLearningLanguage = saveLearningLanguage;
exports.learningText = learningText;
const study_languages_1 = require("./study-languages");
const isLearningLanguage = (value) => value === 'de' || value === 'en';
exports.isLearningLanguage = isLearningLanguage;
function readLearningLanguage(storage, search = '') {
    const requested = new URLSearchParams(search).get('learn');
    if ((0, exports.isLearningLanguage)(requested))
        return requested;
    const saved = storage.getItem('lernkoko-learning-language');
    return (0, exports.isLearningLanguage)(saved) ? saved : 'de';
}
// İngilizce kurs şimdilik kapalı: dil seçici gösterilmez ve site her zaman
// Almanca açılır. İngilizce içerik ve kayıtlar silinmez; true yapınca geri gelir.
exports.ENGLISH_COURSE_ENABLED = false;
function activeLearningLanguage(storage, search = '') {
    return exports.ENGLISH_COURSE_ENABLED ? readLearningLanguage(storage, search) : 'de';
}
function saveLearningLanguage(storage, value) { storage.setItem('lernkoko-learning-language', value); }
const copy = {
    de: ['Almanca Eğitimi', 'Deutsch lernen', 'German Course', 'تعلّم الألمانية', 'Вивчення німецької', 'Apprendre l’allemand'],
    en: ['İngilizce Eğitimi', 'Englisch lernen', 'English Course', 'تعلّم الإنجليزية', 'Вивчення англійської', 'Apprendre l’anglais'],
    select: ['Öğrenmek istediğin dil', 'Sprache zum Lernen', 'Language to learn', 'اللغة التي تريد تعلّمها', 'Мова для вивчення', 'Langue à apprendre'],
    helper: ['Açıklama dili', 'Sprache der Erklärungen', 'Explanation language', 'لغة الشرح', 'Мова пояснень', 'Langue des explications'],
};
function learningText(language, key) { return (0, study_languages_1.translate)(copy[key], language); }
const learningLocale = (language) => language === 'de' ? 'de-DE' : 'en-GB';
exports.learningLocale = learningLocale;
const belongsToLearningLanguage = (id, language) => id.startsWith('en-') === (language === 'en');
exports.belongsToLearningLanguage = belongsToLearningLanguage;
