"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curriculumTopicIds = curriculumTopicIds;
exports.courseUnitForTopic = courseUnitForTopic;
exports.inCourseUnit = inCourseUnit;
const level_course_1 = require("./level-course");
function curriculumTopicIds(id) {
    // These are independent A–D subtopics, not legacy aliases for the whole unit.
    if (/^book-11-[a-d]$/.test(id))
        return [id];
    const unit = level_course_1.courseUnits.find(u => u.id === id) ?? level_course_1.courseUnits.find(u => u.legacyTopics.includes(id));
    if (unit)
        return [unit.id, ...unit.legacyTopics];
    if (id === 'a11-all' || id === 'a12-all') {
        const level = id === 'a11-all' ? 'A1.1' : 'A1.2';
        return [...new Set(level_course_1.courseUnits.filter(u => u.level === level).flatMap(u => [u.id, ...u.legacyTopics]))];
    }
    return undefined;
}
function courseUnitForTopic(topic) { return level_course_1.courseUnits.find(u => u.id === topic) ?? level_course_1.courseUnits.find(u => u.legacyTopics.includes(topic)); }
function inCourseUnit(topic, id) { return curriculumTopicIds(id)?.includes(topic) ?? topic === id; }
