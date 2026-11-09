"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoerenExams = void 0;
exports.hoerenBlocks = hoerenBlocks;
exports.a1ExamSpeechTexts = a1ExamSpeechTexts;
const a1_exam_hoeren_01_1 = require("./a1-exam-hoeren-01");
const a1_exam_hoeren_02_1 = require("./a1-exam-hoeren-02");
const a1_exam_hoeren_03_1 = require("./a1-exam-hoeren-03");
const a1_exam_hoeren_04_1 = require("./a1-exam-hoeren-04");
const a1_exam_hoeren_05_1 = require("./a1-exam-hoeren-05");
const a1_exam_hoeren_06_1 = require("./a1-exam-hoeren-06");
const a1_exam_hoeren_07_1 = require("./a1-exam-hoeren-07");
const a1_exam_hoeren_08_1 = require("./a1-exam-hoeren-08");
const a1_exam_hoeren_09_1 = require("./a1-exam-hoeren-09");
const a1_exam_hoeren_10_1 = require("./a1-exam-hoeren-10");
/**
 * All ten Hören exams of A1 sınavı at once — for the voices (scripts/voices/list-texts.cjs renders every spoken line
 * with the site's natural voices) and the tests. The pages never load this file: an exam is loaded alone when the
 * learner opens it (lib/a1-exam-course.ts `loadHoerenExam`).
 */
exports.hoerenExams = [a1_exam_hoeren_01_1.exam, a1_exam_hoeren_02_1.exam, a1_exam_hoeren_03_1.exam, a1_exam_hoeren_04_1.exam, a1_exam_hoeren_05_1.exam, a1_exam_hoeren_06_1.exam, a1_exam_hoeren_07_1.exam, a1_exam_hoeren_08_1.exam, a1_exam_hoeren_09_1.exam, a1_exam_hoeren_10_1.exam];
/** Every spoken text of a Hören exam: the examples and the 15 items. */
function hoerenBlocks(hoeren) {
    return [hoeren.teil1.example, ...hoeren.teil1.items, hoeren.teil2.example, ...hoeren.teil2.items, ...hoeren.teil3.items];
}
/** Every German line the Hören exams read aloud (for the natural site voices). */
function a1ExamSpeechTexts() {
    const texts = new Set();
    for (const exam of exports.hoerenExams)
        for (const block of hoerenBlocks(exam.hoeren))
            for (const line of block.lines)
                texts.add(line.text);
    return [...texts];
}
