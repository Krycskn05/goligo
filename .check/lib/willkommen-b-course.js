"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepGroupsB = exports.scoredExercisesB = exports.stepIndexB = exports.stepsB = exports.testQuestionsB = exports.ownPromptsB = exports.checkItems = exports.cardSay = exports.cardLines = exports.turnSay = exports.turnLines = exports.boxSayB = exports.boxLinesB = exports.boxWordsB = exports.letterQuestions = exports.spellNames = exports.hearItems = exports.endingSay = exports.endingLines = exports.sieOrDuSay = exports.sieOrDu = exports.landLanguage = exports.wordSay = exports.wordsB = exports.intonation = exports.yesNoWords = exports.dialogueCheck = exports.ramiCard = exports.nikosCard = exports.dialogueSpell = exports.spellPhrases = exports.verbTable = exports.dialogueDu = exports.dialogueSie = exports.lineSay = exports.sieDu = exports.languageSay = exports.languages = exports.languageWords = exports.languagePhrases = exports.spellItems = exports.spelledText = exports.letterSay = exports.hardLetters = exports.alphabet = exports.willkommenBPictures = void 0;
exports.willkommenBSpeechTexts = willkommenBSpeechTexts;
/**
 * Lektion 1 „Willkommen!“, Teil B – Ich spreche ein bisschen Deutsch. (the learner's lesson page, 25 October 2026),
 * ported to the site like Teil A (lib/willkommen-course.ts): the cover, ten short teaching steps, eleven exercises,
 * a 12-question test and the end. Texts for the learner are Turkish; the German is read with the site voices, each
 * person with their own voice (`speakers` in lib/willkommen-course.ts). Step ids never change: saved scores are
 * keyed by them (their own store, lib/willkommen-progress.ts).
 */
const talk_switch_1 = require("./talk-switch");
/**
 * Pictures of Teil B (public/toon/lektion1, from the learner's page; cut-outs on white). The cover and the alphabet
 * picture showed the teacher and are gone (11 November 2026): until the learner's new cover comes, the cover is the
 * du scene on a 960 × 540 canvas (kapak-b-2), and the alphabet step shows its letters alone.
 */
exports.willkommenBPictures = {
    cover: { src: '/toon/lektion1/kapak-b-2.webp', width: 960, height: 540 },
    sie: { src: '/toon/lektion1/sie-sahne.webp', width: 960, height: 640 },
    du: { src: '/toon/lektion1/du-sahne.webp', width: 960, height: 720 },
};
// Ä is read with the text "Eh" (30 October 2026): the site voices read "Äh" like the filler "äh", close to "a" (measured: the
// vowel of their "Äh" lies next to their "Ah"); the learner expects a long "e". So the listening question for Ä offers A and O, not E.
exports.alphabet = [
    ['A', 'a', 'Ah'], ['B', 'be', 'Beh'], ['C', 'tse', 'Zeh'], ['D', 'de', 'Deh'], ['E', 'e', 'Eh'], ['F', 'ef', 'Eff'], ['G', 'ge', 'Geh'], ['H', 'ha', 'Hah'], ['I', 'i', 'Ih'], ['J', 'yot', 'Jot'],
    ['K', 'ka', 'Kah'], ['L', 'el', 'Ell'], ['M', 'em', 'Emm'], ['N', 'en', 'Enn'], ['O', 'o', 'Oh'], ['P', 'pe', 'Peh'], ['Q', 'ku', 'Kuh'], ['R', 'er', 'Err'], ['S', 'es', 'Ess'], ['T', 'te', 'Teh'],
    ['U', 'u', 'Uh'], ['V', 'fau', 'Vau'], ['W', 've', 'Weh'], ['X', 'iks', 'Ix'], ['Y', 'üpsilon', 'Ypsilon'], ['Z', 'tset', 'Zett'], ['Ä', 'a-umlaut (e)', 'Eh'], ['Ö', 'o-umlaut', 'Öh'], ['Ü', 'u-umlaut', 'Üh'], ['ß', 'estset', 'Eszett'],
];
/** Letters that sound different from Turkish (a blue frame on the alphabet). */
exports.hardLetters = ['C', 'E', 'I', 'J', 'V', 'W', 'Y', 'Z', 'ß'];
const letterNames = new Map(exports.alphabet.map(([letter, , say]) => [letter, say]));
/** The name the voice reads for one letter (ß stays ß; anything else is upper-cased). */
const letterSay = (letter) => letterNames.get(letter === 'ß' ? 'ß' : letter.toUpperCase()) ?? '';
exports.letterSay = letterSay;
/** A word letter by letter, as one text for the site voices: "Enn, Ih, Kah, Oh, Ess". */
const spelledText = (word) => [...word.replace(/[^A-Za-zÄÖÜäöüß]/g, '')].map(exports.letterSay).filter(Boolean).join(', ');
exports.spelledText = spelledText;
/** A word letter by letter, one clip per letter (for names the learner types). */
const spellItems = (word) => [...word.replace(/[^A-Za-zÄÖÜäöüß]/g, '')].map(exports.letterSay).filter(Boolean).map(text => ({ text, slow: true }));
exports.spellItems = spellItems;
/* ---------- teaching steps ---------- */
/** Step 1 · Welche Sprachen sprechen Sie? */
exports.languagePhrases = [
    ['Welche Sprachen sprechen Sie?', 'Hangi dilleri konuşuyorsunuz?'],
    ['Ich spreche Türkisch und ein bisschen Deutsch.', 'Türkçe ve biraz Almanca konuşuyorum.'],
    ['Ich spreche Arabisch, Englisch und ein bisschen Deutsch.', 'Arapça, İngilizce ve biraz Almanca konuşuyorum.'],
];
exports.languageWords = [['welche', 'hangi'], ['die Sprache', 'dil'], ['sprechen', 'konuşmak'], ['ein bisschen', 'biraz']];
/** Step 2 · languages (tap to hear). */
exports.languages = [
    ['Deutsch', 'Almanca'], ['Englisch', 'İngilizce'], ['Türkisch', 'Türkçe'], ['Arabisch', 'Arapça'], ['Französisch', 'Fransızca'], ['Spanisch', 'İspanyolca'],
    ['Italienisch', 'İtalyanca'], ['Portugiesisch', 'Portekizce'], ['Polnisch', 'Lehçe'], ['Russisch', 'Rusça'], ['Ukrainisch', 'Ukraynaca'], ['Griechisch', 'Yunanca'],
    ['Bulgarisch', 'Bulgarca'], ['Rumänisch', 'Romence'], ['Serbisch', 'Sırpça'], ['Kroatisch', 'Hırvatça'], ['Niederländisch', 'Felemenkçe'], ['Farsi (Persisch)', 'Farsça'],
    ['Dari', 'Darice'], ['Paschtu', 'Peştuca'], ['Kurdisch', 'Kürtçe'], ['Urdu', 'Urduca'], ['Hindi', 'Hintçe'], ['Chinesisch', 'Çince'],
    ['Vietnamesisch', 'Vietnamca'], ['Thai', 'Tayca'], ['Japanisch', 'Japonca'], ['Swahili', 'Svahili'], ['Somali', 'Somalice'], ['Tigrinya', 'Tigrinya'], ['Amharisch', 'Amharca'],
];
const languageSay = (de) => de.replace(/ \(.*\)/, '');
exports.languageSay = languageSay;
/** Step 3 · Sie or du: the same question, formal and informal. */
exports.sieDu = [
    ['Wie heißen Sie?', 'Wie heißt du?'], ['Woher kommen Sie?', 'Woher kommst du?'], ['Welche Sprachen sprechen Sie?', 'Welche Sprachen sprichst du?'], ['Und Sie?', 'Und du?'],
];
const lineSay = (line) => ({ text: line.say ?? line.de, who: line.who });
exports.lineSay = lineSay;
/** Step 4 · formal dialogue (Sabine and Omar at the till). */
exports.dialogueSie = [
    { who: 'sabine', de: 'Guten Tag, Herr Nasser. Welche Sprachen sprechen Sie?', tr: 'İyi günler, Bay Nasser. Hangi dilleri konuşuyorsunuz?' },
    { who: 'omar', de: 'Ich spreche Arabisch, Englisch und ein bisschen Deutsch. Und Sie, Frau Krüger?', tr: 'Arapça, İngilizce ve biraz Almanca konuşuyorum. Ya siz, Bayan Krüger?' },
    { who: 'sabine', de: 'Ich spreche Deutsch und ein bisschen Englisch.', tr: 'Almanca ve biraz İngilizce konuşuyorum.' },
    { who: 'omar', de: 'Interessant!', tr: 'İlginç!' },
];
/** Step 5 · informal dialogue (Tomasz and Aisha in the course break). */
exports.dialogueDu = [
    { who: 'tomasz', de: 'Hallo! Ich bin neu hier. Ich heiße Tomasz. Wie heißt du?', tr: 'Merhaba! Burada yeniyim. Adım Tomasz. Senin adın ne?' },
    { who: 'aisha', de: 'Hallo, Tomasz! Ich bin Aisha. Woher kommst du?', tr: 'Merhaba Tomasz! Ben Aisha. Nereden geliyorsun?' },
    { who: 'tomasz', de: 'Aus Polen. Und du?', tr: 'Polonya’dan. Ya sen?' },
    { who: 'aisha', de: 'Ich komme aus Kenia. Welche Sprachen sprichst du?', tr: 'Kenya’dan geliyorum. Hangi dilleri konuşuyorsun?' },
    { who: 'tomasz', de: 'Polnisch, Englisch und ein bisschen Deutsch. Und du?', tr: 'Lehçe, İngilizce ve biraz Almanca. Ya sen?' },
    { who: 'aisha', de: 'Swahili, Englisch und ein bisschen Deutsch.', tr: 'Svahili, İngilizce ve biraz Almanca.' },
    { who: 'tomasz', de: 'Interessant!', tr: 'İlginç!' },
];
/** Step 6 · ich / du / Sie: the ending in ** (read as the whole row). */
exports.verbTable = [
    { verb: 'kommen', ich: 'komm**e**', du: 'komm**st**', sie: 'komm**en**', say: 'ich komme, du kommst, Sie kommen' },
    { verb: 'heißen', ich: 'heiß**e**', du: 'heiß**t**', sie: 'heiß**en**', say: 'ich heiße, du heißt, Sie heißen' },
    { verb: 'sprechen', ich: 'sprech**e**', du: 'spr**i**ch**st**', sie: 'sprech**en**', say: 'ich spreche, du sprichst, Sie sprechen' },
    { verb: 'sein', ich: 'bin', du: 'bist', sie: 'sind', say: 'ich bin, du bist, Sie sind' },
];
/** Step 8 · asking and spelling. */
exports.spellPhrases = [
    ['Wie bitte?', 'Efendim? / Pardon, tekrar eder misin?', 'Wie bitte?'],
    ['Wie schreibt man das?', 'Bu nasıl yazılır?', 'Wie schreibt man das?'],
    ['Ich buchstabiere: …', 'Harf harf söylüyorum: …', 'Ich buchstabiere'],
    ['Buchstabieren Sie bitte Ihren Namen.', 'Lütfen adınızı harf harf söyleyin.', 'Buchstabieren Sie bitte Ihren Namen.'],
    ['Danke! — Bitte!', 'Teşekkürler! — Rica ederim!', 'Danke! Bitte!'],
];
exports.dialogueSpell = [
    { who: 'yasemin', de: 'Wie heißt du?', tr: 'Adın ne?' },
    { who: 'nikos', de: 'Ich heiße Nikos Papadakis.', tr: 'Adım Nikos Papadakis.' },
    { who: 'yasemin', de: 'Wie bitte? Wie schreibt man das?', tr: 'Efendim? Bu nasıl yazılır?' },
    { who: 'nikos', de: 'Ich buchstabiere: N-I-K-O-S, P-A-P-A-D-A-K-I-S.', tr: 'Harf harf söylüyorum: N-I-K-O-S, P-A-P-A-D-A-K-I-S.', say: 'Ich buchstabiere: ' + (0, exports.spelledText)('Nikos') + '. ' + (0, exports.spelledText)('Papadakis') + '.' },
    { who: 'yasemin', de: 'Danke! Woher kommst du?', tr: 'Teşekkürler! Nereden geliyorsun?' },
    { who: 'nikos', de: 'Aus Griechenland. Ich spreche Griechisch, Englisch und ein bisschen Deutsch.', tr: 'Yunanistan’dan. Yunanca, İngilizce ve biraz Almanca konuşuyorum.' },
];
exports.nikosCard = { who: 'nikos', name: 'Nikos Papadakis', land: 'Griechenland', languages: 'Griechisch, Englisch, ein bisschen Deutsch' };
exports.ramiCard = { who: 'rami', name: 'Rami Khalil', land: 'Libanon', languages: 'Arabisch, Französisch, ein bisschen Deutsch' };
exports.dialogueCheck = [
    { who: 'yasemin', de: 'Du heißt Nikos. Du kommst aus Griechenland. Du sprichst Griechisch.', tr: 'Adın Nikos. Yunanistan’dan geliyorsun. Yunanca konuşuyorsun.' },
    { who: 'nikos', de: 'Ja, richtig!', tr: 'Evet, doğru!' },
    { who: 'yasemin', de: 'Und du sprichst Arabisch?', tr: 'Ve Arapça konuşuyorsun?' },
    { who: 'nikos', de: 'Nein, ich spreche Englisch.', tr: 'Hayır, İngilizce konuşuyorum.' },
];
exports.yesNoWords = [['ja', 'evet'], ['nein', 'hayır'], ['richtig', 'doğru']];
/** W-questions fall at the end. */
exports.intonation = ['Wie heißt du?', 'Woher kommst du?'];
/** Step 10 · word list. */
exports.wordsB = [
    ['die Sprache', 'dil'], ['sprechen', 'konuşmak'], ['Welche Sprachen …?', 'Hangi dilleri …?'], ['ein bisschen', 'biraz'], ['Deutsch', 'Almanca'],
    ['du', 'sen'], ['Hallo!', 'Merhaba!'], ['der Name', 'ad, isim'], ['Mein Name ist …', 'Benim adım …'], ['neu', 'yeni'], ['hier', 'burada'],
    ['Ich bin neu hier.', 'Burada yeniyim.'], ['das Land', 'ülke'], ['schreiben', 'yazmak'], ['buchstabieren', 'harf harf söylemek'],
    ['Wie bitte?', 'Efendim? / Pardon?'], ['Wie schreibt man das?', 'Bu nasıl yazılır?'], ['danke', 'teşekkürler'], ['bitte', 'rica ederim / lütfen'],
    ['ja', 'evet'], ['nein', 'hayır'], ['richtig', 'doğru'], ['interessant', 'ilginç'],
];
/** What is read for a word of the list ("Welche Sprachen …?" without the dots). */
const wordSay = (de) => de.replace(/\s*…\s*/g, ' ').replace(/\s+([?!.])/g, '$1').trim();
exports.wordSay = wordSay;
/* ---------- exercises ---------- */
/** Exercise 1 · country → language (matching; the pair is read as two sentences). */
exports.landLanguage = [
    ['Türkei', 'Türkisch', 'Ich komme aus der Türkei. Ich spreche Türkisch.'],
    ['Polen', 'Polnisch', 'Ich komme aus Polen. Ich spreche Polnisch.'],
    ['Griechenland', 'Griechisch', 'Ich komme aus Griechenland. Ich spreche Griechisch.'],
    ['Frankreich', 'Französisch', 'Ich komme aus Frankreich. Ich spreche Französisch.'],
    ['Deutschland', 'Deutsch', 'Ich komme aus Deutschland. Ich spreche Deutsch.'],
    ['Iran', 'Farsi', 'Ich komme aus dem Iran. Ich spreche Farsi.'],
];
/** Exercise 2 · Sie or du? (the verb shows it: -st → du, -en → Sie). */
exports.sieOrDu = [
    { before: 'Wie heißt', after: '?', answer: 'du' }, { before: 'Woher kommen', after: '?', answer: 'Sie' }, { before: 'Welche Sprachen sprichst', after: '?', answer: 'du' },
    { before: 'Wie heißen', after: ', Frau Krüger?', answer: 'Sie' }, { before: 'Woher kommst', after: ', Tomasz?', answer: 'du' }, { before: 'Welche Sprachen sprechen', after: ', Herr Nasser?', answer: 'Sie' },
    // No verb in the last two rows: the name decides (first name → du, Frau/Herr → Sie). Until 30 October 2026 the first one was
    // "Und ___? Ich bin Aisha.", where Sie fitted as well (the learner chose Sie and it counted as wrong).
    { before: 'Ich heiße Aisha. Und', after: ', Nikos?', answer: 'du' }, { before: 'Ich komme aus Deutschland. Und', after: ', Frau Weiß?', answer: 'Sie' },
];
const sieOrDuSay = (item) => item.before + ' ' + item.answer + item.after;
exports.sieOrDuSay = sieOrDuSay;
/** Exercise 3 · verb endings (the gap is part of a word). */
exports.endingLines = [
    { text: 'Wie heiß___ du?', answers: [['t']] }, { text: 'Ich komm___ aus Polen.', answers: [['e']] }, { text: 'Welche Sprachen sprich___ du?', answers: [['st']] },
    { text: 'Woher komm___ Sie?', answers: [['en']] }, { text: 'Ich ___ neu hier.', answers: [['bin']] }, { text: 'Du ___ Aisha, richtig?', answers: [['bist']] },
    { text: 'Ich sprech___ Türkisch.', answers: [['e']] }, { text: 'Sie heiß___ Frau Krüger.', answers: [['en']] }, { text: 'Woher komm___ du, Nikos?', answers: [['st']] },
    { text: 'Wie heiß___ Sie?', answers: [['en']] },
];
/** The whole solved sentence (31 October 2026: only the first letter of the ending was put in — "Ich b neu hier."). */
exports.endingSay = exports.endingLines.map(line => line.text.replace('___', line.answers[0][0]));
exports.hearItems = [
    { key: 'yasemin', name: 'Yasemin Arslan', text: 'Hallo, ich bin Yasemin. Ich spreche Türkisch, Englisch und ein bisschen Deutsch.', options: ['Türkisch', 'Englisch', 'Arabisch', 'ein bisschen Deutsch'], answers: [0, 1, 3] },
    { key: 'omar', name: 'Omar Nasser', text: 'Ich heiße Omar Nasser. Ich spreche Arabisch und ein bisschen Deutsch.', options: ['Arabisch', 'Französisch', 'ein bisschen Deutsch'], answers: [0, 2] },
    { key: 'mei', name: 'Mei Suwan', text: 'Guten Tag, ich bin Mei. Ich spreche Thai, Englisch und ein bisschen Deutsch.', options: ['Chinesisch', 'Thai', 'Englisch', 'ein bisschen Deutsch'], answers: [1, 2, 3] },
];
/** Exercise 5 · hear the letters, write the name. */
exports.spellNames = ['Fuchs', 'Jonas', 'Weiß', 'Yasemin', 'Vogt'];
/** Exercise 6 · which letter? */
exports.letterQuestions = [
    { answer: 'J', options: ['J', 'Y', 'I'] }, { answer: 'V', options: ['V', 'W', 'F'] }, { answer: 'Z', options: ['Z', 'C', 'S'] }, { answer: 'E', options: ['E', 'I', 'A'] },
    { answer: 'Y', options: ['Y', 'J', 'Ü'] }, { answer: 'G', options: ['G', 'K', 'C'] }, { answer: 'W', options: ['W', 'V', 'U'] }, { answer: 'Ä', options: ['Ä', 'A', 'O'] },
];
/** Exercise 7 · the word box (a = Aisha, b = Tomasz). */
exports.boxWordsB = ['neu', 'Name', 'bitte', 'schreibt', 'buchstabiere', 'Danke'];
exports.boxLinesB = [
    { who: 'a', text: 'Hallo! Ich bin ___ hier. Mein ___ ist Aisha Kamau.', answers: [['neu'], ['Name']] },
    { who: 'b', text: 'Wie ___? Wie ___ man das?', answers: [['bitte'], ['schreibt']] },
    { who: 'a', text: 'Ich ___: K-A-M-A-U.', answers: [['buchstabiere']] },
    { who: 'b', text: '___!', answers: [['Danke']] },
    { who: 'a', text: 'Bitte!', answers: [] },
];
exports.boxSayB = ['Hallo! Ich bin neu hier. Mein Name ist Aisha Kamau.', 'Wie bitte? Wie schreibt man das?', 'Ich buchstabiere: ' + (0, exports.spelledText)('Kamau') + '.', 'Danke!', 'Bitte!'];
/** Exercise 8 · Sie ↔ du: turn the question round. */
exports.turnLines = [
    { text: 'Wie heißen Sie? → du: ___', answers: [['Wie heißt du?']] },
    { text: 'Woher kommen Sie? → du: ___', answers: [['Woher kommst du?']] },
    { text: 'Welche Sprachen sprechen Sie? → du: ___', answers: [['Welche Sprachen sprichst du?']] },
    { text: 'Wie heißt du? → Sie: ___', answers: [['Wie heißen Sie?']] },
    { text: 'Woher kommst du? → Sie: ___', answers: [['Woher kommen Sie?']] },
];
exports.turnSay = exports.turnLines.map(line => line.answers[0][0]);
/** Exercise 9 · from the card to sentences (Rami). */
// Rami speaks about himself (ich), but every right sentence about him counts too (the learner asked, 30 October 2026, after
// writing "Sie heißen Rami Khalil."): er (about him), Sie (to him, formal) and du (to him, informal).
const cardLanguages = ['Arabisch, Französisch und ein bisschen Deutsch', 'Arabisch, Französisch, ein bisschen Deutsch'];
exports.cardLines = [
    { text: '1. ___', answers: [['Ich heiße Rami Khalil.', 'Ich bin Rami Khalil.', 'Mein Name ist Rami Khalil.', 'Er heißt Rami Khalil.', 'Er ist Rami Khalil.', 'Sein Name ist Rami Khalil.', 'Sie heißen Rami Khalil.', 'Sie sind Rami Khalil.', 'Du heißt Rami Khalil.', 'Du bist Rami Khalil.']] },
    { text: '2. ___', answers: [['Ich komme aus dem Libanon.', 'Er kommt aus dem Libanon.', 'Sie kommen aus dem Libanon.', 'Du kommst aus dem Libanon.']] },
    { text: '3. ___', answers: [['Ich spreche', 'Er spricht', 'Sie sprechen', 'Du sprichst'].flatMap(start => cardLanguages.map(list => start + ' ' + list + '.'))] },
];
exports.cardSay = ['Ich heiße Rami Khalil.', 'Ich komme aus dem Libanon.', 'Ich spreche Arabisch, Französisch und ein bisschen Deutsch.'];
/** Exercise 10 · right or not? Yasemin says it, Nikos answers. */
exports.checkItems = [
    { statement: 'Du heißt Nikos Papadakis.', answer: 'ja', reply: 'Ja, richtig!' },
    { statement: 'Du kommst aus Bulgarien.', answer: 'nein', reply: 'Nein, ich komme aus Griechenland.' },
    { statement: 'Du sprichst Griechisch.', answer: 'ja', reply: 'Ja, richtig!' },
    { statement: 'Du sprichst Arabisch.', answer: 'nein', reply: 'Nein, ich spreche Englisch.' },
    { statement: 'Du sprichst ein bisschen Deutsch.', answer: 'ja', reply: 'Ja, richtig!' },
];
/** Exercise 11 · now you (not scored). */
exports.ownPromptsB = [
    { question: 'Welche Sprachen sprichst du?', pattern: /^ich spreche \S+/, placeholder: 'Ich spreche … und ein bisschen Deutsch.' },
    { question: 'Wie bitte? Wie schreibt man deinen Namen?', pattern: /^ich buchstabiere \S/, placeholder: 'Ich buchstabiere: A-B-C …' },
];
exports.testQuestionsB = [
    ['Welche Sprachen ___ Sie?', ['sprechen', 'sprichst', 'spreche'], 'sprechen', 'Welche Sprachen sprechen Sie?'],
    ['Woher ___ du?', ['kommst', 'kommen', 'komme'], 'kommst', 'Woher kommst du?'],
    ['Ich ___ neu hier.', ['bin', 'bist', 'sind'], 'bin', 'Ich bin neu hier.'],
    ['Wie ___ du?', ['heißt', 'heißen', 'heiße'], 'heißt', 'Wie heißt du?'],
    ['Polen → dil adı?', ['Polnisch', 'Polisch', 'Polen'], 'Polnisch', 'Polnisch'],
    ['„Wie bitte?“ ne demek?', ['Efendim? / Pardon?', 'Nasıl yazılır?', 'Teşekkürler'], 'Efendim? / Pardon?', ''],
    ['„Du sprichst Türkisch.“ — doğruysa cevap:', ['Ja, richtig!', 'Nein, danke.', 'Wie bitte?'], 'Ja, richtig!', 'Ja, richtig!'],
    ['„Danke!“ — cevap:', ['Bitte!', 'Hallo!', 'Interessant!'], 'Bitte!', 'Bitte!'],
    ['„J“ harfi Almanca nasıl okunur?', ['yot', 'ce', 'ji'], 'yot', 'Jot'],
    ['„ein bisschen“ ne demek?', ['biraz', 'çok', 'hiç'], 'biraz', ''],
    ['Resmî (siz) hangisi?', ['Welche Sprachen sprechen Sie?', 'Welche Sprachen sprichst du?', 'Und du?'], 'Welche Sprachen sprechen Sie?', 'Welche Sprachen sprechen Sie?'],
    ['„Wie schreibt man das?“ cevabı:', ['Ich buchstabiere: …', 'Ich komme aus …', 'Ich spreche …'], 'Ich buchstabiere: …', 'Ich buchstabiere'],
];
/** The steps in order (ids are stable; the title is shown in the top bar). */
exports.stepsB = [
    { id: 'kapak', title: 'Kapak', kind: 'cover' },
    { id: 'sprachen', title: 'Hangi dilleri?', kind: 'teach' },
    { id: 'diller', title: 'Diller', kind: 'teach' },
    { id: 'sie-du', title: 'Sie mi, du mu?', kind: 'teach' },
    { id: 'diyalog-sie', title: 'Diyalog: Sie', kind: 'teach' },
    { id: 'diyalog-du', title: 'Diyalog: du', kind: 'teach' },
    { id: 'fiiller', title: 'Fiil çekimi', kind: 'teach' },
    { id: 'alfabe', title: 'Alfabe', kind: 'teach' },
    { id: 'buchstabieren', title: 'Harf harf söyleme', kind: 'teach' },
    { id: 'steckbrief', title: 'Kimlik kartı', kind: 'teach' },
    { id: 'kelimeler', title: 'Kelime listesi', kind: 'teach' },
    { id: 'land-sprache', title: 'Alıştırma 1', kind: 'exercise' },
    { id: 'sie-oder-du', title: 'Alıştırma 2', kind: 'exercise' },
    { id: 'endungen', title: 'Alıştırma 3', kind: 'exercise' },
    { id: 'hoeren', title: 'Alıştırma 4', kind: 'exercise' },
    { id: 'namen', title: 'Alıştırma 5', kind: 'exercise' },
    { id: 'buchstabe', title: 'Alıştırma 6', kind: 'exercise' },
    { id: 'kutu', title: 'Alıştırma 7', kind: 'exercise' },
    { id: 'umformen', title: 'Alıştırma 8', kind: 'exercise' },
    { id: 'karte', title: 'Alıştırma 9', kind: 'exercise' },
    { id: 'richtig', title: 'Alıştırma 10', kind: 'exercise' },
    { id: 'sen', title: 'Alıştırma 11', kind: 'exercise' },
    { id: 'test', title: 'Test', kind: 'test' },
    ...(0, talk_switch_1.talkStep)(),
    { id: 'bitti', title: 'Bitti', kind: 'end' },
];
const stepIndexB = (id) => exports.stepsB.findIndex(step => step.id === id);
exports.stepIndexB = stepIndexB;
/** Exercises that are scored (Alıştırma 11 is the learner's own sentences: no score). */
exports.scoredExercisesB = [
    { id: 'land-sprache', total: exports.landLanguage.length },
    { id: 'sie-oder-du', total: exports.sieOrDu.length },
    { id: 'endungen', total: exports.endingLines.length },
    { id: 'hoeren', total: exports.hearItems.length },
    { id: 'namen', total: exports.spellNames.length },
    { id: 'buchstabe', total: exports.letterQuestions.length },
    { id: 'kutu', total: exports.boxLinesB.reduce((n, line) => n + line.answers.length, 0) },
    { id: 'umformen', total: exports.turnLines.length },
    { id: 'karte', total: exports.cardLines.length },
    { id: 'richtig', total: exports.checkItems.length },
    { id: 'test', total: exports.testQuestionsB.length },
];
exports.stepGroupsB = [
    { id: 'konu', label: 'Konu anlatımı', ids: exports.stepsB.filter(step => step.kind === 'teach').map(step => step.id) },
    { id: 'alistirmalar', label: 'Alıştırmalar', ids: exports.stepsB.filter(step => step.kind === 'exercise').map(step => step.id) },
    { id: 'test', label: 'Test', ids: ['test'] },
    ...(0, talk_switch_1.talkGroup)(),
];
/** Every German text Teil B speaks (rendered as site voices by scripts/voices). */
function willkommenBSpeechTexts() {
    const out = new Set();
    const add = (text) => { if (text.trim())
        out.add(text.trim()); };
    for (const [de] of [...exports.languagePhrases, ...exports.languageWords, ...exports.yesNoWords])
        add(de);
    for (const [de] of exports.languages)
        add((0, exports.languageSay)(de));
    for (const [sie, du] of exports.sieDu) {
        add(sie);
        add(du);
    }
    for (const line of [...exports.dialogueSie, ...exports.dialogueDu, ...exports.dialogueSpell, ...exports.dialogueCheck])
        add(line.say ?? line.de);
    exports.verbTable.forEach(row => add(row.say));
    exports.alphabet.forEach(([, , say]) => add(say));
    exports.spellPhrases.forEach(([, , say]) => add(say));
    exports.intonation.forEach(add);
    exports.wordsB.forEach(([de]) => add((0, exports.wordSay)(de)));
    exports.landLanguage.forEach(([, , say]) => add(say));
    exports.sieOrDu.forEach(item => add((0, exports.sieOrDuSay)(item)));
    exports.endingSay.forEach(add);
    exports.hearItems.forEach(item => add(item.text));
    exports.boxSayB.forEach(add);
    exports.turnSay.forEach(add);
    exports.cardSay.forEach(add);
    exports.checkItems.forEach(item => { add(item.statement); add(item.reply); });
    exports.ownPromptsB.forEach(prompt => add(prompt.question));
    exports.testQuestionsB.forEach(question => add(question[3]));
    return [...out];
}
