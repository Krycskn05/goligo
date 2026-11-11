"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schreibenItemId = exports.schreibenExamId = exports.hoerenItemId = exports.hoerenExamId = exports.CAST_VOICES = exports.lesenItemId = exports.lesenExamId = void 0;
exports.buildExam = buildExam;
exports.spelled = spelled;
exports.buildHoeren = buildHoeren;
exports.buildSchreiben = buildSchreiben;
const a1_exam_letters_1 = require("./a1-exam-letters");
const two = (n) => String(n).padStart(2, '0');
const lesenExamId = (number) => 'a1-lesen-' + two(number);
exports.lesenExamId = lesenExamId;
const lesenItemId = (exam, n) => (0, exports.lesenExamId)(exam) + '-' + two(n);
exports.lesenItemId = lesenItemId;
const ad = (spec) => ({ frame: spec[0], lines: spec[1], label: spec[2], ...(spec[3] ? { face: spec[3] } : {}) });
const notice = (spec) => ({ frame: spec[0], lines: spec[1], ...(spec[2] ? { title: spec[2] } : {}), ...(spec[3] ? { face: spec[3] } : {}) });
function buildExam(number, topics, spec) {
    let n = 0;
    const id = () => (0, exports.lesenItemId)(number, ++n);
    const text = (part) => {
        const { example, items, ...rest } = part;
        return { ...rest, ...(example ? { example: { text: example[0], answer: example[1] } } : {}), items: items.map(item => ({ id: id(), n, text: item[0], answer: item[1], why: item[2] })) };
    };
    const teil1 = [text(spec.teil1[0]), text(spec.teil1[1])];
    const teil2 = { mode: spec.teil2.mode,
        example: { situation: spec.teil2.example[0], ads: [ad(spec.teil2.example[1]), ad(spec.teil2.example[2])], answer: spec.teil2.example[3] },
        items: spec.teil2.items.map(item => ({ id: id(), n, situation: item[0], ads: [ad(item[1]), ad(item[2])], answer: item[3], why: item[4] })) };
    const teil3 = {
        example: { place: spec.teil3.example[0], notice: notice(spec.teil3.example[1]), text: spec.teil3.example[2], answer: spec.teil3.example[3] },
        items: spec.teil3.items.map(item => ({ id: id(), n, place: item[0], notice: notice(item[1]), text: item[2], answer: item[3], why: item[4] }))
    };
    return { id: (0, exports.lesenExamId)(number), number, topics, lesen: { teil1, teil2, teil3 }, schreiben: null };
}
/* ---------- Hören (lib/a1-exam-hoeren-NN.ts) ---------- */
/**
 * The people of the site keep their own voice in every exam (lib/site-voices.ts: the voice called Sabine reads Sabine).
 * Anyone else is written as "Name:Voice" ("Verkäuferin:F4") — a voice of the right kind that is not the other speaker's.
 */
exports.CAST_VOICES = { Sabine: 'F1', Yasemin: 'F2', Aisha: 'F3', Nora: 'F4', Mei: 'F5', Rami: 'M1', Omar: 'M2', Paul: 'M3', Nikos: 'M4', Tomasz: 'M5' };
/** A line in which a name is said letter by letter: `{S}` in the text is the spelling ("Ich buchstabiere: {S}.") — on the
 * paper "K – R – Ü – G – E – R", for the voices the letters' names (lib/a1-exam-letters.ts). */
function spelled(who, text, name) {
    return [who, text.replaceAll('{S}', (0, a1_exam_letters_1.spellShown)(name)), text.replaceAll('{S}', (0, a1_exam_letters_1.spellSay)(name)), text.replaceAll('{S}', (0, a1_exam_letters_1.spellDevice)(name))];
}
const hoerenExamId = (number) => 'a1-hoeren-' + two(number);
exports.hoerenExamId = hoerenExamId;
const hoerenItemId = (exam, n) => (0, exports.hoerenExamId)(exam) + '-' + two(n);
exports.hoerenItemId = hoerenItemId;
function audioLine(spec) {
    const [name, given] = spec[0].split(':');
    const voice = given ?? exports.CAST_VOICES[name];
    if (!voice || !/^[FM][1-5]$/.test(voice))
        throw new Error('No voice for ' + spec[0]);
    return { who: name, voice, text: spec[1], ...(spec[2] ? { say: spec[2], device: spec[3] ?? spec[1] } : {}) };
}
const option = (spec) => typeof spec === 'string' ? { text: spec } : { icon: spec[0], text: spec[1] };
const options = (o) => [option(o[0]), option(o[1]), option(o[2])];
/** Numbers a Hören exam like the paper: Teil 1: 1–6, Teil 2: 7–10, Teil 3: 11–15; ids `a1-hoeren-<exam>-<number>`. */
function buildHoeren(number, topics, spec) {
    let n = 0;
    const id = () => (0, exports.hoerenItemId)(number, ++n);
    const choice = (item) => ({ id: id(), n, question: item.q, options: options(item.o), answer: item.a, ...(item.cards ? { cards: true } : {}), lines: item.lines.map(audioLine), why: item.why });
    const teil1 = { example: { question: spec.teil1.example.q, options: options(spec.teil1.example.o), answer: spec.teil1.example.a, lines: spec.teil1.example.lines.map(audioLine) }, items: spec.teil1.items.map(choice) };
    const teil2 = { example: { text: spec.teil2.example.t, answer: spec.teil2.example.a, lines: spec.teil2.example.lines.map(audioLine) },
        items: spec.teil2.items.map(item => ({ id: id(), n, text: item.t, answer: item.a, lines: item.lines.map(audioLine), why: item.why })) };
    const teil3 = { items: spec.teil3.items.map(choice) };
    return { id: (0, exports.hoerenExamId)(number), number, topics, hoeren: { teil1, teil2, teil3 } };
}
const schreibenExamId = (number) => 'a1-schreiben-' + two(number);
exports.schreibenExamId = schreibenExamId;
const schreibenItemId = (exam, n) => (0, exports.schreibenExamId)(exam) + '-' + two(n);
exports.schreibenItemId = schreibenItemId;
/** Numbers the form's gaps 1–5; ids `a1-schreiben-<exam>-<number>` (06–09 are the four marks the learner gives the own
 * message, lib/a1-exam-course.ts `SCHREIBEN_CRITERIA`). */
function buildSchreiben(number, topics, spec) {
    const teil1 = { text: spec.teil1.text, form: spec.teil1.form, rows: spec.teil1.rows.map(row => ({ label: row[0], value: row[1] })),
        items: spec.teil1.gaps.map((item, i) => ({ id: (0, exports.schreibenItemId)(number, i + 1), n: i + 1, accept: item[0], why: { kind: item[1], quote: item[2] } })) };
    return { id: (0, exports.schreibenExamId)(number), number, topics, schreiben: { teil1, teil2: spec.teil2 } };
}
