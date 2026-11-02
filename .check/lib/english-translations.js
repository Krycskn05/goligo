"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.englishMeaning = englishMeaning;
const english_course_1 = require("./english-course");
const english_objects_1 = require("./english-objects");
const object_course_1 = require("./object-course");
const object_translations_1 = require("./object-translations");
const normalize = (text) => text.normalize('NFC').replace(/[’‘]/g, "'").trim().replace(/[.!?]+$/, '').replace(/\s+/g, ' ').toLowerCase();
const meanings = new Map();
for (const question of english_course_1.englishQuestions) {
    if (question.answerTr)
        for (const value of [question.answer, ...question.accepted ?? []])
            meanings.set(normalize(value), question.answerTr);
    if (question.audio && question.audioTr)
        meanings.set(normalize(question.audio), question.audioTr);
    if (question.passage && question.passageTr)
        meanings.set(normalize(question.passage), question.passageTr);
}
meanings.set(normalize('Hello. How are you?'), 'Merhaba. Nasılsın?');
const objects = new Map(object_course_1.objectVocabulary.map(word => [normalize((0, english_objects_1.englishObjectName)(word.id)), word.id]));
function englishMeaning(text, language) {
    if (language === 'en')
        return text;
    const object = objects.get(normalize(text));
    if (object)
        return language === 'de' ? object_course_1.objectVocabulary.find(word => word.id === object)?.de : (0, object_translations_1.objectMeaning)(object, language) || undefined;
    return language === 'tr' ? meanings.get(normalize(text)) : undefined;
}
