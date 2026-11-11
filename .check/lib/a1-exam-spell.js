"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spellSheets = exports.spellItemId = exports.spellSheetId = exports.spellShown = exports.spellSay = exports.spellDevice = exports.nameLetters = exports.LETTER_SAY = exports.LETTER_NAME = exports.SPELL_QUESTION = void 0;
exports.spellSpeechTexts = spellSpeechTexts;
const a1_exam_build_1 = require("./a1-exam-build");
const a1_exam_letters_1 = require("./a1-exam-letters");
/**
 * A1 sınavı · Buchstabieren (the learner asked, 10 November 2026): the teacher's Hören paper has an item the ten exams
 * do not have — "Wie buchstabiert man den Namen?" with three name cards that differ in one letter. This is a practice of
 * its own beside the exams (nothing of the exams changes): three sheets of ten names, each a short talk in which a name
 * is said letter by letter, and three spellings to choose from. Our own names and the site's people.
 *
 * A line is written once with `{S}` where the name is spelled and `{N}` for the name. The paper shows
 * "K – R – Ü – G – E – R"; the natural site voices read the letters' names, "Kah, Err, Üh, Geh, E, Err" (`say`); the
 * device voice, which reads a line the natural voices have no clip for yet, reads plain capitals, "K, R, Ü, G, E, R"
 * (`device`). Pace (checked on the clips of the live site, 11 November 2026): the voices rush a list of letter names —
 * a line that was only the letters took about a second for four letters, and letters were swallowed. So every spelled
 * line starts with words ("Ich buchstabiere: …", which gives the letters more room), and the player plays a spelled
 * line slower (app/a1-exam-audio.tsx). A full stop after each letter was tried and dropped: it slows the letters down,
 * but more of them get lost.
 *
 * How the letters are read was measured on 10 November 2026 (every text rendered locally with the ten site voices,
 * written down again by a speech recogniser, the vowels' formants measured; the Mac's German voices for the device):
 * - the names of lib/willkommen-b-course.ts are right for the consonants in all ten voices (Beh / Peh, Deh / Teh,
 *   Geh / Kah, Emm / Enn, Vau / Weh / Eff, Ess / Zett / Eszett, Jot / Ypsilon, Zeh, Kuh, Ix) and for Ah, Ih, Oh, Uh, Öh, Üh;
 * - "Eh" for E comes out open, like "är" (heard as R in most voices): E is written as the plain letter "E", which the
 *   voices read with the vowel of "Tee";
 * - "Äh" and "Ä" do not give a long ä that differs from E or A: Ä is said "Ah Umlaut", as people do on the phone;
 * - three pairs are closer in these voices than in real speech — E and I (the vowel of "Tee" lies next to "Ih"),
 *   U and O, Ü and Ö: no name here is decided by one of them (so no ei against ie either); the vowel that decides is
 *   an A, an O against A / E, an umlaut against its plain letter, or U against I;
 * - the recogniser is no judge of single vowel names (it writes R for "Ah", E for "Ih", U or Ö for "Üh", also with
 *   the device voices, which say them right): vowels were judged by their formants, consonants by the recogniser;
 * - the render is not the same twice: the clips the workflow makes are new samples, so the check is a statistical one;
 * - the device voices read plain capitals best (a newer one garbles "Enn", "Vau", "Geh").
 * When names are added, keep to these limits and check the new lines the same way.
 */
exports.SPELL_QUESTION = 'Wie buchstabiert man den Namen?';
var a1_exam_letters_2 = require("./a1-exam-letters");
Object.defineProperty(exports, "LETTER_NAME", { enumerable: true, get: function () { return a1_exam_letters_2.LETTER_NAME; } });
Object.defineProperty(exports, "LETTER_SAY", { enumerable: true, get: function () { return a1_exam_letters_2.LETTER_SAY; } });
Object.defineProperty(exports, "nameLetters", { enumerable: true, get: function () { return a1_exam_letters_2.nameLetters; } });
Object.defineProperty(exports, "spellDevice", { enumerable: true, get: function () { return a1_exam_letters_2.spellDevice; } });
Object.defineProperty(exports, "spellSay", { enumerable: true, get: function () { return a1_exam_letters_2.spellSay; } });
Object.defineProperty(exports, "spellShown", { enumerable: true, get: function () { return a1_exam_letters_2.spellShown; } });
const two = (n) => String(n).padStart(2, '0');
const spellSheetId = (number) => 'a1-spell-' + two(number);
exports.spellSheetId = spellSheetId;
const spellItemId = (sheet, n) => (0, exports.spellSheetId)(sheet) + '-' + two(n);
exports.spellItemId = spellItemId;
const AT = { a: 0, b: 1, c: 2 };
function line(spec, name) {
    const [who, given] = spec[0].split(':');
    const voice = given ?? a1_exam_build_1.CAST_VOICES[who];
    if (!voice || !/^[FM][1-5]$/.test(voice))
        throw new Error('No voice for ' + spec[0]);
    const fill = (text, spelled) => text.replaceAll('{N}', name).replaceAll('{S}', spelled);
    const text = fill(spec[1], (0, a1_exam_letters_1.spellShown)(name)), say = fill(spec[2] ?? spec[1], (0, a1_exam_letters_1.spellSay)(name));
    return say === text ? { who, voice, text } : { who, voice, text, say, device: fill(spec[1], (0, a1_exam_letters_1.spellDevice)(name)) };
}
function entry(spec) {
    const name = spec.n[AT[spec.a]];
    return { names: spec.n, answer: spec.a, lines: spec.lines.map(item => line(item, name)), spelled: (0, a1_exam_letters_1.spellShown)(name), focus: [...spec.focus].map(letter => letter + ' = ' + a1_exam_letters_1.LETTER_NAME[letter]), ...(spec.tip ? { tip: spec.tip } : {}) };
}
function sheet(number, topics, example, items) {
    return { id: (0, exports.spellSheetId)(number), number, topics, example: entry(example), items: items.map((item, i) => ({ id: (0, exports.spellItemId)(number, i + 1), n: i + 1, ...entry(item) })) };
}
/** Blatt 1 — vowels and umlauts: ö / o / e, ü / u / i, ä / e / a, a / o / e, ai / ei / ay, au / eu / ei. */
const sheet1 = sheet(1, 'Vokale und Umlaute: a · o · ä · ö · ü · ai · au · eu', { n: ['Röder', 'Reder', 'Roder'], a: 'a', focus: 'ÖEO', tip: 'umlaut', lines: [
        ['Rezeption:F4', 'Guten Tag! Wie ist Ihr Name, bitte?'],
        ['Mann:M5', 'Mein Name ist {N}. Ich buchstabiere: {S}.'],
        ['Rezeption:F4', 'Danke, Herr {N}.']
    ] }, [
    { n: ['Kohler', 'Köhler', 'Kehler'], a: 'b', focus: 'ÖOE', tip: 'umlaut', lines: [
            ['Praxis:F2', 'Praxis Doktor Sommer, guten Tag. Wie heißen Sie, bitte?'],
            ['Frau:F5', '{N}. Ich buchstabiere: {S}.'],
            ['Praxis:F2', 'Danke, Frau {N}.']
        ] },
    { n: ['Hübner', 'Hubner', 'Hibner'], a: 'a', focus: 'ÜUI', tip: 'umlaut', lines: [
            ['Mann:M2', 'Fitnessstudio Aktiv, guten Tag.'],
            ['Frau:F4', 'Guten Tag. Ich möchte mich anmelden.'],
            ['Mann:M2', 'Gern. Wie schreibt man Ihren Familiennamen?'],
            ['Frau:F4', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Schefer', 'Schafer', 'Schäfer'], a: 'c', focus: 'ÄEA', tip: 'umlaut', lines: [
            ['Frau:F4', 'Und Ihr Familienname, bitte?'],
            ['Mann:M4', 'Ich buchstabiere: {S}.'],
            ['Frau:F4', 'Vielen Dank.']
        ] },
    { n: ['Mohr', 'Mahr', 'Mehr'], a: 'a', focus: 'OAE', lines: [
            ['Mann:M5', 'Hotel am Hafen, guten Abend.'],
            ['Frau:F2', 'Guten Abend. Ich habe ein Zimmer reserviert.'],
            ['Mann:M5', 'Wie ist Ihr Name?'],
            ['Frau:F2', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Meier', 'Mayer', 'Maier'], a: 'c', focus: 'AEIY', lines: [
            ['Frau:F3', 'Wie heißen Sie?'],
            ['Mann:M3', '{N}.'],
            ['Frau:F3', 'Wie schreibt man das?'],
            ['Mann:M3', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Lena', 'Lana', 'Lina'], a: 'b', focus: 'AEI', lines: [
            ['Sekretärin:F5', 'Wie heißt Ihre Tochter?'],
            ['Mann:M5', 'Sie heißt {N}.'],
            ['Sekretärin:F5', 'Wie schreibt man das?'],
            ['Mann:M5', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Rath', 'Roth', 'Ruth'], a: 'a', focus: 'AOU', lines: [
            ['Mann:M2', 'Sie möchten ein Paket abholen? Wie ist der Name?'],
            ['Frau:F2', 'Ich buchstabiere: {S}.'],
            ['Mann:M2', 'Einen Moment, bitte.']
        ] },
    { n: ['Neumann', 'Neimann', 'Naumann'], a: 'c', focus: 'AEUI', lines: [
            ['Frau:F2', 'Stadtbibliothek, guten Tag.'],
            ['Mann:M4', 'Guten Tag, mein Name ist {N}. Ich möchte einen Ausweis.'],
            ['Frau:F2', 'Gern. Wie schreibt man Ihren Namen?'],
            ['Mann:M4', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Bäcker', 'Becker', 'Backer'], a: 'b', focus: 'EÄA', tip: 'umlaut', lines: [
            ['Mann:M5', 'Wie ist Ihr Name?'],
            ['Frau:F3', '{N}.'],
            ['Mann:M5', 'Wie schreibt man das?'],
            ['Frau:F3', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Reuter', 'Rauter', 'Reiter'], a: 'a', focus: 'EAUI', lines: [
            ['Frau:F4', 'Restaurant Olive, guten Tag.'],
            ['Mann:M2', 'Guten Tag. Ich möchte einen Tisch für heute Abend reservieren.'],
            ['Frau:F4', 'Gern. Auf welchen Namen?'],
            ['Mann:M2', 'Ich buchstabiere: {S}.']
        ] },
]);
/** Blatt 2 — consonants whose names sound alike: b / p, d / t, g / j / k, m / n, v / w / f, s / z / ß, j / y, c / k / z, a / h / k, q. */
const sheet2 = sheet(2, 'Konsonanten: b · p · d · t · v · w · f · s · z · ß · j · y', { n: ['Fogel', 'Vogel', 'Wogel'], a: 'b', focus: 'VFW', lines: [
        ['Frau:F1', 'Guten Morgen! Ihr Name, bitte?'],
        ['Mann:M4', '{N}. Ich buchstabiere: {S}.'],
        ['Frau:F1', 'Danke, Herr {N}.']
    ] }, [
    { n: ['Bohl', 'Kohl', 'Pohl'], a: 'c', focus: 'PBK', lines: [
            ['Mann:M3', 'Autowerkstatt Nordstern, guten Tag.'],
            ['Frau:F5', 'Guten Tag. Ist mein Auto fertig?'],
            ['Mann:M3', 'Wie ist Ihr Name?'],
            ['Frau:F5', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Brand', 'Brandt', 'Brant'], a: 'b', focus: 'DT', tip: 'count', lines: [
            ['Frau:F2', 'Wie heißen Sie?'],
            ['Mann:M5', '{N}.'],
            ['Frau:F2', 'Wie schreibt man das?'],
            ['Mann:M5', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Gerber', 'Jerber', 'Kerber'], a: 'a', focus: 'GJK', lines: [
            ['Mann:M2', 'Für wen ist das Paket?'],
            ['Frau:F3', 'Für Frau {N}. Ich buchstabiere: {S}.'],
            ['Mann:M2', 'Danke schön.']
        ] },
    { n: ['Hamm', 'Hahn', 'Hann'], a: 'c', focus: 'NMH', tip: 'double', lines: [
            ['Frau:F4', 'Und Ihr Familienname?'],
            ['Mann:M1', 'Ich buchstabiere: {S}.'],
            ['Frau:F4', 'Danke. Bitte warten Sie einen Moment.']
        ] },
    { n: ['Walter', 'Valter', 'Falter'], a: 'a', focus: 'WVF', lines: [
            ['Mann:M4', 'Sprachschule Lingua, guten Tag.'],
            ['Frau:F1', 'Guten Tag. Ich möchte meinen Mann für den Deutschkurs anmelden.'],
            ['Mann:M4', 'Gern. Wie ist der Familienname?'],
            ['Frau:F1', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Weiss', 'Weiß', 'Weiz'], a: 'b', focus: 'ßSZ', lines: [
            ['Mann:M5', 'Wie ist Ihr Name, bitte?'],
            ['Nora', 'Nora {N}.'],
            ['Mann:M5', 'Wie schreibt man den Familiennamen?'],
            ['Nora', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Jasemin', 'Yasmin', 'Yasemin'], a: 'c', focus: 'YJ', tip: 'count', lines: [
            ['Mann:M3', 'Wie ist Ihr Vorname, Frau Arslan?'],
            ['Yasemin', '{N}.'],
            ['Mann:M3', 'Wie schreibt man das?'],
            ['Yasemin', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Marc', 'Mark', 'Marz'], a: 'a', focus: 'CKZ', lines: [
            ['Frau:F5', 'Wie heißt Ihr Sohn?'],
            ['Mann:M2', 'Er heißt {N}.'],
            ['Frau:F5', 'Mit K?', 'Mit Kah?'],
            ['Mann:M2', 'Nein. Ich buchstabiere: {S}.']
        ] },
    { n: ['Anke', 'Hanke', 'Kanke'], a: 'b', focus: 'HKA', tip: 'count', lines: [
            ['Frau:F2', 'Guten Tag. Wie ist Ihr Name?'],
            ['Mann:M4', 'Ich buchstabiere: {S}.'],
            ['Frau:F2', 'Danke, Herr {N}.']
        ] },
    { n: ['Kuast', 'Kwast', 'Quast'], a: 'c', focus: 'QKUW', lines: [
            ['Mann:M5', 'Wie ist Ihr Familienname?'],
            ['Frau:F4', '{N}.'],
            ['Mann:M5', 'Wie bitte? Wie schreibt man das?'],
            ['Frau:F4', 'Ich buchstabiere: {S}.']
        ] },
]);
/** Blatt 3 — double letters, letters you do not hear in the word (th, ph, h) and the names of the site's people. */
const sheet3 = sheet(3, 'Doppelte und stumme Buchstaben · lange Namen', { n: ['Hoffmann', 'Hoffman', 'Hofmann'], a: 'c', focus: 'FN', tip: 'double', lines: [
        ['Frau:F3', 'Wie ist Ihr Name, bitte?'],
        ['Mann:M5', '{N}. Ich buchstabiere: {S}.'],
        ['Frau:F3', 'Mit einem F. Danke, Herr {N}.', 'Mit einem Eff. Danke, Herr {N}.']
    ] }, [
    { n: ['Schmidt', 'Schmitt', 'Schmid'], a: 'a', focus: 'DT', tip: 'count', lines: [
            ['Mann:M3', 'Wie heißen Sie?'],
            ['Frau:F2', '{N}.'],
            ['Mann:M3', 'Wie schreibt man das?'],
            ['Frau:F2', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Keler', 'Kehler', 'Keller'], a: 'c', focus: 'LH', tip: 'double', lines: [
            ['Frau:F5', 'Für wen ist der Termin?'],
            ['Mann:M4', 'Für Herrn {N}. Ich buchstabiere: {S}.'],
            ['Frau:F5', 'Danke.']
        ] },
    { n: ['Günther', 'Günter', 'Gunter'], a: 'b', focus: 'ÜUTH', tip: 'count', lines: [
            ['Beamter:M2', 'Wie heißt Ihr Mann?'],
            ['Frau:F4', 'Er heißt {N}.'],
            ['Beamter:M2', 'Mit T-H?', 'Mit Teh, Hah?'],
            ['Frau:F4', 'Nein. Ich buchstabiere: {S}.']
        ] },
    { n: ['Stefan', 'Stephan', 'Steffan'], a: 'b', focus: 'PHF', tip: 'count', lines: [
            ['Beamtin:F5', 'Wie heißt Ihr Bruder?'],
            ['Frau:F1', 'Er heißt {N}.'],
            ['Beamtin:F5', 'Wie schreibt man das?'],
            ['Frau:F1', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Nowak', 'Novak', 'Nowack'], a: 'a', focus: 'WVCK', lines: [
            ['Frau:F2', 'Hotel am Hafen, guten Tag.'],
            ['Tomasz', 'Guten Tag. Ich möchte ein Zimmer reservieren. Mein Name ist Tomasz {N}.'],
            ['Frau:F2', 'Wie schreibt man den Familiennamen?'],
            ['Tomasz', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Kalil', 'Chalil', 'Khalil'], a: 'c', focus: 'KHC', tip: 'count', lines: [
            ['Frau:F3', 'Wie ist Ihr Familienname?'],
            ['Rami', '{N}.'],
            ['Frau:F3', 'Wie bitte?'],
            ['Rami', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Suwan', 'Suvan', 'Zuwan'], a: 'a', focus: 'SZWV', lines: [
            ['Mann:M3', 'Wie ist Ihr Name, bitte?'],
            ['Mei', 'Mei {N}.'],
            ['Mann:M3', 'Wie schreibt man den Familiennamen?'],
            ['Mei', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Camau', 'Kamau', 'Kamai'], a: 'b', focus: 'KCUI', lines: [
            ['Mann:M4', 'Taxi-Zentrale, guten Morgen. Wer spricht da?'],
            ['Aisha', 'Hier ist Aisha {N}.'],
            ['Mann:M4', 'Wie schreibt man das?'],
            ['Aisha', 'Ich buchstabiere: {S}.']
        ] },
    { n: ['Naser', 'Nassar', 'Nasser'], a: 'c', focus: 'SEA', tip: 'double', lines: [
            ['Frau:F5', 'Auf welchen Namen ist die Reservierung?'],
            ['Omar', 'Auf {N}. Ich buchstabiere: {S}.'],
            ['Frau:F5', 'Danke, Herr {N}.']
        ] },
    { n: ['Papadakos', 'Papadakis', 'Babadakis'], a: 'b', focus: 'PBIO', lines: [
            ['Frau:F1', 'Wie ist Ihr Familienname?'],
            ['Nikos', '{N}.'],
            ['Frau:F1', 'Das ist ein langer Name! Wie schreibt man das?'],
            ['Nikos', 'Ich buchstabiere: {S}.']
        ] },
]);
/** The three sheets (30 names and three examples). The page loads this file when a sheet is opened. */
exports.spellSheets = [sheet1, sheet2, sheet3];
/** Every line of the practice as the voice reads it (for the natural site voices, with lib/a1-exam-hoeren.ts). */
function spellSpeechTexts() {
    const texts = new Set();
    for (const item of exports.spellSheets.flatMap(part => [part.example, ...part.items]))
        for (const spoken of item.lines)
            texts.add(spoken.say ?? spoken.text);
    return [...texts];
}
