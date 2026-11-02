"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelQuestions = exports.levelWords = exports.levelTopics = exports.courseUnits = void 0;
const textbook_curriculum_1 = require("./textbook-curriculum");
var textbook_curriculum_2 = require("./textbook-curriculum");
Object.defineProperty(exports, "courseUnits", { enumerable: true, get: function () { return textbook_curriculum_2.courseUnits; } });
exports.levelTopics = textbook_curriculum_1.courseUnits.map(u => ({ id: u.id, title: u.title, de: u.de, unit: u.number, section: u.level, pages: '', minutes: 0, lead: '', blocks: [] }));
exports.levelWords = [];
exports.levelQuestions = [];
