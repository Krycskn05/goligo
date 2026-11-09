"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lesenItemId = exports.lesenExamId = void 0;
exports.buildExam = buildExam;
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
    return { id: (0, exports.lesenExamId)(number), number, topics, lesen: { teil1, teil2, teil3 }, hoeren: null, schreiben: null };
}
