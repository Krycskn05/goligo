"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.englishQuestions = exports.englishTopics = exports.englishCourseUnits = void 0;
exports.englishUnitContains = englishUnitContains;
const textbook_curriculum_1 = require("./textbook-curriculum");
const english_objects_1 = require("./english-objects");
// Match the current German catalogue: headings and art only.
exports.englishCourseUnits = textbook_curriculum_1.courseUnits.map(unit => ({ ...unit, id: 'en-' + unit.id, de: unit.names[2], legacyTopics: [] }));
exports.englishTopics = [...exports.englishCourseUnits.map(unit => ({ id: unit.id, title: unit.title, de: unit.de, unit: unit.number, section: unit.level, pages: '', minutes: 0, lead: '', blocks: [] })), ...['objects-house', 'objects-furniture', 'objects-building', 'objects-moving', 'objects-tools', 'objects-kitchen', 'objects-cleaning', 'objects-nature', 'objects-body', 'objects-health', 'objects-food', 'objects-drinks', 'objects-cooking', 'objects-school', 'objects-outdoors', 'objects-clothes', 'objects-all', 'a11-all', 'a12-all', 'all'].map(id => ({ id: 'en-' + id, title: id, de: id, unit: 0, section: '', pages: '', minutes: 0, lead: '', blocks: [] }))];
exports.englishQuestions = english_objects_1.englishObjectQuestions;
function englishUnitContains(topic, unit) {
    if (unit === 'en-all')
        return true;
    if (unit === 'en-a11-all' || unit === 'en-a12-all')
        return exports.englishCourseUnits.some(u => u.id === topic && u.level === (unit === 'en-a11-all' ? 'A1.1' : 'A1.2'));
    return unit === 'en-objects-all' ? topic.startsWith('en-objects-') : topic === unit;
}
