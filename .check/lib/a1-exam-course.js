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
exports.gradeLesen = exports.gradeHoeren = exports.hoerenKey = exports.lesenKey = exports.isSpellNumber = exports.SPELL_SHEET_COUNT = exports.spellSheetList = exports.SPELL_TOTAL = exports.SPELL_MODULE = exports.isExamNumber = exports.GUEST_EXAM = exports.examList = exports.hoerenExamList = exports.LESEN_EXAM_COUNT = exports.lesenExamList = exports.hasPassed = exports.examPoints = exports.passMark = exports.POINT_FACTOR = exports.PASS_PERCENT = exports.moduleMinutes = exports.isReadyModule = exports.HOEREN_TOTAL = exports.HOEREN_MINUTES = exports.LESEN_TOTAL = exports.LESEN_MINUTES = exports.examModules = exports.A1_EXAM_PATH = void 0;
exports.loadLesenExam = loadLesenExam;
exports.loadHoerenExam = loadHoerenExam;
exports.loadSpellSheet = loadSpellSheet;
exports.lesenItems = lesenItems;
exports.hoerenItems = hoerenItems;
exports.gradeItems = gradeItems;
const a1_exam_build_1 = require("./a1-exam-build");
/**
 * A1 sınavı (/a1-sinavi): the list of practice exams and how an exam is marked. The exam texts themselves are one file
 * per exam and part (lib/a1-exam-lesen-01.ts … -10.ts, lib/a1-exam-hoeren-01.ts … -10.ts), loaded when the learner
 * opens it. Marking follows the real exam: one point per answer, 15 points in Hören and 15 in Lesen, each part's points
 * × 1,66 for the certificate (so a part gives up to 25 of 100), and 60 % to pass (there the 60 % counts over all parts
 * together; here it is shown for the part the learner solved).
 */
exports.A1_EXAM_PATH = '/a1-sinavi';
/** The parts of the written exam in the order of the exam paper; `ready` parts have exams. */
exports.examModules = [
    { id: 'hoeren', number: 1, name: 'Hören', minutes: 20, ready: true },
    { id: 'lesen', number: 2, name: 'Lesen', minutes: 25, ready: true },
    { id: 'schreiben', number: 3, name: 'Schreiben', minutes: 20, ready: false },
];
exports.LESEN_MINUTES = 25;
exports.LESEN_TOTAL = 15;
exports.HOEREN_MINUTES = 20;
exports.HOEREN_TOTAL = 15;
const isReadyModule = (value) => value === 'hoeren' || value === 'lesen';
exports.isReadyModule = isReadyModule;
exports.moduleMinutes = { hoeren: exports.HOEREN_MINUTES, lesen: exports.LESEN_MINUTES };
exports.PASS_PERCENT = 60;
/** The exam's factor: points of a part × 1,66 (four parts of 15 points make 100). */
exports.POINT_FACTOR = 1.66;
const passMark = (total) => Math.ceil(total * exports.PASS_PERCENT / 100);
exports.passMark = passMark;
const examPoints = (right) => Math.round(right * exports.POINT_FACTOR);
exports.examPoints = examPoints;
const hasPassed = (right, total) => right >= (0, exports.passMark)(total);
exports.hasPassed = hasPassed;
/** The ten Lesen exams: number, id and what their texts are about (kept here so the list page loads no exam text). */
exports.lesenExamList = [
    { number: 1, id: (0, a1_exam_build_1.lesenExamId)(1), topics: 'Umzug · Ausflug in den Zoo · Möbel und Jobs · Schilder in der Stadt' },
    { number: 2, id: (0, a1_exam_build_1.lesenExamId)(2), topics: 'Besuch in Köln · Kein Wasser im Haus · Arbeit und Kurse · Hinweise' },
    { number: 3, id: (0, a1_exam_build_1.lesenExamId)(3), topics: 'Dienst tauschen · Prüfungstag · Anzeigen · Ämter und Geschäfte' },
    { number: 4, id: (0, a1_exam_build_1.lesenExamId)(4), topics: 'Zettel zu Hause · Geburtstag im Garten · Internetseiten · Schilder' },
    { number: 5, id: (0, a1_exam_build_1.lesenExamId)(5), topics: 'Heizung kaputt · Basketball-Training · Wohnen und Service · Zeiten lesen' },
    { number: 6, id: (0, a1_exam_build_1.lesenExamId)(6), topics: 'Taxi zum Flughafen · Praxis im Urlaub · Reisen und Kochen · Hinweise' },
    { number: 7, id: (0, a1_exam_build_1.lesenExamId)(7), topics: 'Grüße aus dem Urlaub · Team-Treffen · Internetseiten · Unterwegs' },
    { number: 8, id: (0, a1_exam_build_1.lesenExamId)(8), topics: 'Kind ist krank · Brief von der Bibliothek · Anzeigen · Zeiten und Orte' },
    { number: 9, id: (0, a1_exam_build_1.lesenExamId)(9), topics: 'Mit dem Kurs ins Museum · Paket bei der Nachbarin · Wohnen und Feiern · Regeln' },
    { number: 10, id: (0, a1_exam_build_1.lesenExamId)(10), topics: 'Praktikum · Regeln im Haus · Internetseiten · Anmelden und Warten' },
];
exports.LESEN_EXAM_COUNT = exports.lesenExamList.length;
/** The ten Hören exams (9 November 2026): the same numbers as the Lesen exams — exam 3 is Hören 3 and Lesen 3. */
exports.hoerenExamList = [
    { number: 1, id: (0, a1_exam_build_1.hoerenExamId)(1), topics: 'Einkaufen · Kino · Durchsagen im Bahnhof · Nachrichten am Telefon' },
    { number: 2, id: (0, a1_exam_build_1.hoerenExamId)(2), topics: 'Im Café · Unterwegs in der Stadt · Durchsagen · Termine am Telefon' },
    { number: 3, id: (0, a1_exam_build_1.hoerenExamId)(3), topics: 'Wohnung und Arbeit · Geburtstag · Durchsagen · Kino und Bibliothek' },
    { number: 4, id: (0, a1_exam_build_1.hoerenExamId)(4), topics: 'Auf dem Markt · Am Bahnhof · Durchsagen · Adressen und Preise am Telefon' },
    { number: 5, id: (0, a1_exam_build_1.hoerenExamId)(5), topics: 'Im Restaurant · Im Hotel · Durchsagen · Apotheke, Schule und Kochkurs' },
    { number: 6, id: (0, a1_exam_build_1.hoerenExamId)(6), topics: 'Im Taxi · Familie und Geschenke · Durchsagen · Kita, Sport und Arbeit' },
    { number: 7, id: (0, a1_exam_build_1.hoerenExamId)(7), topics: 'Am Kiosk · Beruf und Freizeit · Durchsagen · Fahrschule, Lieferung, Arbeit' },
    { number: 8, id: (0, a1_exam_build_1.hoerenExamId)(8), topics: 'Öffnungszeiten · Wohnen · Beim Arzt · Durchsagen · Arbeit, Training, Amt' },
    { number: 9, id: (0, a1_exam_build_1.hoerenExamId)(9), topics: 'Eintritt und Bus · Besuch und Pakete · Durchsagen · Einladung, Umzug, Kurs' },
    { number: 10, id: (0, a1_exam_build_1.hoerenExamId)(10), topics: 'Zimmer und Auto · Schule · Durchsagen · Geburtstag, Arbeit, Bahnhof' },
];
/** The exams of a part. */
const examList = (module) => module === 'hoeren' ? exports.hoerenExamList : exports.lesenExamList;
exports.examList = examList;
/** The exam a visitor without an account may open (the guest taste: the first part of every section). */
exports.GUEST_EXAM = 1;
const isExamNumber = (value) => Number.isInteger(value) && value >= 1 && value <= exports.LESEN_EXAM_COUNT;
exports.isExamNumber = isExamNumber;
const loaders = {
    1: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-01'))), 2: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-02'))), 3: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-03'))), 4: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-04'))), 5: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-05'))),
    6: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-06'))), 7: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-07'))), 8: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-08'))), 9: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-09'))), 10: () => Promise.resolve().then(() => __importStar(require('./a1-exam-lesen-10'))),
};
/** Loads one exam's texts. */
function loadLesenExam(number) {
    const load = loaders[number];
    if (!load)
        return Promise.reject(new Error('No exam ' + number));
    return load().then(module => module.exam);
}
const hoerenLoaders = {
    1: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-01'))), 2: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-02'))), 3: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-03'))), 4: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-04'))), 5: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-05'))),
    6: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-06'))), 7: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-07'))), 8: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-08'))), 9: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-09'))), 10: () => Promise.resolve().then(() => __importStar(require('./a1-exam-hoeren-10'))),
};
/** Loads one Hören exam's questions and spoken texts. */
function loadHoerenExam(number) {
    const load = hoerenLoaders[number];
    if (!load)
        return Promise.reject(new Error('No exam ' + number));
    return load().then(module => module.exam);
}
/* ---------- Buchstabieren: a listening practice beside the exams (lib/a1-exam-spell.ts) ---------- */
/** Its part of the address: `?sinav=2&bolum=buchstabieren` (sheet 2). */
exports.SPELL_MODULE = 'buchstabieren';
exports.SPELL_TOTAL = 10;
/** The three sheets: number, id and the letters they train (kept here so the list page loads no sheet). The ids are
 * kept in the learner's saved answers, never change them. */
exports.spellSheetList = [
    { number: 1, id: 'a1-spell-01', topics: 'Vokale und Umlaute: a · o · ä · ö · ü · ai · au · eu' },
    { number: 2, id: 'a1-spell-02', topics: 'Konsonanten: b · p · d · t · v · w · f · s · z · ß · j · y' },
    { number: 3, id: 'a1-spell-03', topics: 'Doppelte und stumme Buchstaben · lange Namen' },
];
exports.SPELL_SHEET_COUNT = exports.spellSheetList.length;
const isSpellNumber = (value) => Number.isInteger(value) && value >= 1 && value <= exports.SPELL_SHEET_COUNT;
exports.isSpellNumber = isSpellNumber;
/** Loads one sheet of the spelling practice. */
function loadSpellSheet(number) {
    if (!(0, exports.isSpellNumber)(number))
        return Promise.reject(new Error('No sheet ' + number));
    return Promise.resolve().then(() => __importStar(require('./a1-exam-spell'))).then(module => module.spellSheets[number - 1]);
}
/** The 15 scored items of a Lesen exam in the order of the paper, with the Teil they belong to. */
function lesenItems(lesen) {
    return [
        ...lesen.teil1.flatMap(text => text.items.map(item => ({ teil: 1, item }))),
        ...lesen.teil2.items.map(item => ({ teil: 2, item })),
        ...lesen.teil3.items.map(item => ({ teil: 3, item })),
    ];
}
/** The right answers as one string in the order of the paper ("frfrfabaab…"). */
const lesenKey = (lesen) => lesenItems(lesen).map(entry => entry.item.answer).join('');
exports.lesenKey = lesenKey;
/** The 15 scored items of a Hören exam in the order of the paper (Teil 1: 1–6, Teil 2: 7–10, Teil 3: 11–15). */
function hoerenItems(hoeren) {
    return [
        ...hoeren.teil1.items.map(item => ({ teil: 1, item })),
        ...hoeren.teil2.items.map(item => ({ teil: 2, item })),
        ...hoeren.teil3.items.map(item => ({ teil: 3, item })),
    ];
}
const hoerenKey = (hoeren) => hoerenItems(hoeren).map(entry => entry.item.answer).join('');
exports.hoerenKey = hoerenKey;
/** Marks a Hören exam like a Lesen exam. */
const gradeHoeren = (hoeren, answers) => gradeItems(hoerenItems(hoeren), answers);
exports.gradeHoeren = gradeHoeren;
/** Marks a Lesen exam: one point per right answer; an item left open counts as wrong. */
const gradeLesen = (lesen, answers) => gradeItems(lesenItems(lesen), answers);
exports.gradeLesen = gradeLesen;
function gradeItems(items, answers) {
    const result = { right: 0, total: 0, answered: 0, byTeil: { 1: { right: 0, total: 0 }, 2: { right: 0, total: 0 }, 3: { right: 0, total: 0 } }, wrong: [], open: [] };
    for (const { teil, item } of items) {
        result.total++;
        result.byTeil[teil].total++;
        const given = answers[item.id];
        if (given === undefined) {
            result.open.push(item.id);
            continue;
        }
        result.answered++;
        if (given === item.answer) {
            result.right++;
            result.byTeil[teil].right++;
        }
        else
            result.wrong.push(item.id);
    }
    return result;
}
