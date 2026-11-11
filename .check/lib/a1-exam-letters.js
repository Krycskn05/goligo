"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spellDevice = exports.spellSay = exports.spellShown = exports.nameLetters = exports.LETTER_SAY = exports.LETTER_NAME = void 0;
/**
 * How a name is spelled aloud in A1 sınavı — in the spelling practice (lib/a1-exam-spell.ts, where the measuring of
 * the voices is written down) and in the Hören exams' question „Wie buchstabiert man den Namen?“. A spelled name has
 * three texts: on the paper "K – R – Ü – G – E – R", for the natural site voices "Kah, Err, Üh, Geh, E, Err", for the
 * device voice "K, R, Ü, G, E, R".
 */
/** The German name of every letter as it is shown with an answer ("W = Weh"): the names of the alphabet lesson
 * (lib/willkommen-b-course.ts), and "A-Umlaut" for Ä. */
exports.LETTER_NAME = {
    A: 'Ah', B: 'Beh', C: 'Zeh', D: 'Deh', E: 'Eh', F: 'Eff', G: 'Geh', H: 'Hah', I: 'Ih', J: 'Jot', K: 'Kah', L: 'Ell', M: 'Emm', N: 'Enn', O: 'Oh', P: 'Peh', Q: 'Kuh', R: 'Err', S: 'Ess', T: 'Teh',
    U: 'Uh', V: 'Vau', W: 'Weh', X: 'Ix', Y: 'Ypsilon', Z: 'Zett', 'Ä': 'A-Umlaut', 'Ö': 'Öh', 'Ü': 'Üh', 'ß': 'Eszett',
};
/** What the natural site voices read for a letter: its name, except E (the plain letter) and Ä ("Ah Umlaut") — see above. */
exports.LETTER_SAY = { ...exports.LETTER_NAME, E: 'E', 'Ä': 'Ah Umlaut' };
/** The letters of a name in capitals (ß stays ß). */
const nameLetters = (name) => [...name].filter(letter => /[A-Za-zÄÖÜäöüß]/.test(letter)).map(letter => letter === 'ß' ? 'ß' : letter.toUpperCase());
exports.nameLetters = nameLetters;
/** "Krüger" → "K – R – Ü – G – E – R" (shown after the practice). */
const spellShown = (name) => (0, exports.nameLetters)(name).join(' – ');
exports.spellShown = spellShown;
/** "Krüger" → "Kah, Err, Üh, Geh, E, Err" (read by the natural site voices). */
const spellSay = (name) => (0, exports.nameLetters)(name).map(letter => exports.LETTER_SAY[letter]).join(', ');
exports.spellSay = spellSay;
/** "Krüger" → "K, R, Ü, G, E, R" (read by the device voice). */
const spellDevice = (name) => (0, exports.nameLetters)(name).join(', ');
exports.spellDevice = spellDevice;
