"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.berufeTestC = exports.wirIhrLines = exports.possessiveLines = exports.fieldSay = exports.fieldQuestions = exports.helpSay = exports.helpLines = exports.helpBox = exports.diceLines = exports.diceSentence = exports.diceSum = exports.diceFaces = exports.dice = exports.phoneDigits = exports.numberRowSay = exports.numberRows = exports.listenNumbers = exports.stressRows = exports.allPersonsSay = exports.allPersons = exports.flatDialogue = exports.wirIhrRows = exports.wirIhrSay = exports.wirIhrVerbs = exports.possessivePhrases = exports.possessiveRows = exports.formRows = exports.meaningSay = exports.meaningRows = exports.helpDialogue = exports.helpPhrases = exports.plusPhrases = exports.wirChecks = exports.formChecksC = exports.helpChecks = exports.plusChecks = exports.numberChecks = exports.wordChecksC = exports.phrasesC = exports.wordSayC = exports.wordsC = exports.phonePhrases = exports.phoneSay = exports.phones = exports.teenRows = exports.countAll = exports.digitWords = exports.numberWords = exports.castL2C = exports.berufeCPictures = void 0;
exports.berufeWordCountC = exports.berufeGroupsC = exports.berufeScoredC = exports.berufeStepShortC = exports.berufeStepIndexC = exports.berufeStepsC = exports.practiceItemsC = void 0;
exports.berufeCSpeechTexts = berufeCSpeechTexts;
/** Pictures of Teil C (public/toon/lektion2, from the learner's page). */
exports.berufeCPictures = {
    cover: { src: '/toon/lektion2/kapak-c.webp', width: 960, height: 540 },
    hands05: { src: '/toon/lektion2/haende-0-5.webp', width: 900, height: 266 },
    hands610: { src: '/toon/lektion2/haende-6-10.webp', width: 800, height: 300 },
    form: { src: '/toon/lektion2/formular.webp', width: 640, height: 483 },
};
/** The people of Teil C (portraits and voices of the site). */
exports.castL2C = ['yasemin', 'nikos', 'omar', 'mei', 'aisha', 'tomasz', 'rami', 'paul'];
/* ---------- numbers ---------- */
/** 0–20, the numbers this part teaches (index = the number). */
exports.numberWords = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn', 'zwanzig'];
/** Digits read one by one, the groups with a pause: "0176 3345 621" → "null eins sieben sechs, drei drei vier fünf, sechs zwei eins". */
const digitWords = (digits) => digits.trim().split(/\s+/).map(group => [...group].map(digit => exports.numberWords[Number(digit)] ?? digit).join(' ')).join(', ');
exports.digitWords = digitWords;
/** Every number one after the other ("▶ 0’dan 20’ye dinle"). */
exports.countAll = exports.numberWords.join(', ');
/** 13–19: the ones, then -zehn; 16 and 17 lose a part (shown struck through). [number, built, word, warning] */
exports.teenRows = [
    [13, 'drei + zehn', 'dreizehn'], [14, 'vier + zehn', 'vierzehn'], [15, 'fünf + zehn', 'fünfzehn'], [16, 'sech~s~ + zehn', 'sechzehn', true],
    [17, 'sieb~en~ + zehn', 'siebzehn', true], [18, 'acht + zehn', 'achtzehn'], [19, 'neun + zehn', 'neunzehn'], [20, '—', 'zwanzig'],
];
exports.phones = [{ who: 'omar', name: 'Omar', number: '0176 3345 621' }, { who: 'nikos', name: 'Nikos', number: '030 8831 749' }, { who: 'aisha', name: 'Aisha', number: '0152 7612 390' }];
const phoneSay = (number) => 'Meine Telefonnummer ist ' + (0, exports.digitWords)(number) + '.';
exports.phoneSay = phoneSay;
/** Konu 1 · asking for a phone number and saying one (the shown text, the meaning, what is read). Only du here: the
 * formal Ihr / Ihre belongs to the workplace dialogue of Teil D. */
exports.phonePhrases = [
    ['Wie ist deine Telefonnummer?', 'Telefon numaran ne? (sen)', 'Wie ist deine Telefonnummer?'],
    ['Meine Telefonnummer ist 0176 3345 621.', 'Telefon numaram 0176 3345 621. — okunuşu: null eins sieben sechs · drei drei vier fünf · sechs zwei eins', (0, exports.phoneSay)('0176 3345 621')],
    ['Die Telefonnummer ist 030 8831 749.', 'Telefon numarası 030 8831 749. (030 = Berlin şehir kodu)', 'Die Telefonnummer ist ' + (0, exports.digitWords)('030 8831 749') + '.'],
];
exports.wordsC = [
    ['Entschuldigung!', 'Affedersiniz! / Pardon!', 'Entschuldigung, ich brauche Hilfe.', 'Pardon, yardıma ihtiyacım var.'],
    ['die Hilfe · Hilfe brauchen', 'yardım · yardıma ihtiyacı olmak', 'Wir brauchen Hilfe.', 'Yardıma ihtiyacımız var.'],
    ['helfen', 'yardım etmek', 'Ich helfe gern.', 'Memnuniyetle yardım ederim.'],
    ['gern / gerne', 'memnuniyetle, seve seve', 'Bitte, ich helfe gerne.', 'Rica ederim, seve seve yardım ederim.'],
    ['verstehen', 'anlamak', 'Ich verstehe das nicht.', 'Bunu anlamıyorum.'],
    ['bedeuten', 'anlamına gelmek', 'Adresse bedeutet: Wo wohnst du?', 'Adresse şu demek: Nerede oturuyorsun?'],
    ['das Problem', 'sorun, problem', 'Was ist das Problem?', 'Sorun ne?'],
    ['das Formular', 'form', 'Das Formular ist schwer.', 'Form zor.'],
    ['der Vorname', 'ad, ön ad', 'Mein Vorname ist Omar.', 'Adım Omar.'],
    ['der Nachname', 'soyadı', 'Mein Nachname ist Nasser.', 'Soyadım Nasser.'],
    ['die Adresse', 'adres', 'Wie ist deine Adresse?', 'Adresin ne?'],
    ['die Straße', 'cadde, sokak', 'Ich wohne in der Siemensstraße.', 'Siemensstraße’de oturuyorum.'],
    ['die Hausnummer', 'kapı numarası', 'Meine Hausnummer ist 12.', 'Kapı numaram 12.', 'Meine Hausnummer ist zwölf.'],
    ['der Ort', 'yer, şehir (yerleşim yeri)', 'Ort: Berlin', 'Yer: Berlin', 'Ort: Berlin.'],
    ['die Postleitzahl (PLZ)', 'posta kodu', 'Meine Postleitzahl ist 13629.', 'Posta kodum 13629.', 'Meine Postleitzahl ist ' + (0, exports.digitWords)('13629') + '.'],
    ['die Telefonnummer', 'telefon numarası', 'Wie ist deine Telefonnummer?', 'Telefon numaran ne?'],
    ['die E-Mail-Adresse', 'e-posta adresi', 'Wie ist deine E-Mail-Adresse?', 'E-posta adresin ne?'],
    ['die E-Mail', 'e-posta', 'Ich schreibe eine E-Mail.', 'Bir e-posta yazıyorum.'],
    ['die Arbeit', 'iş', 'Die Arbeit ist schwer.', 'İş zor.'],
    ['wir', 'biz', 'Wir wohnen in Berlin.', 'Berlin’de oturuyoruz.'],
    ['ihr', 'siz (çoğul, samimi)', 'Woher kommt ihr?', 'Nereden geliyorsunuz? (siz, çoğul)'],
    ['mein / meine', 'benim', 'mein Name · meine Adresse', 'adım · adresim', 'mein Name, meine Adresse.'],
    ['dein / deine', 'senin', 'dein Beruf · deine Telefonnummer', 'mesleğin · telefon numaran', 'dein Beruf, deine Telefonnummer.'],
    ['plus', 'artı', 'Sechs plus fünf ist elf.', 'Altı artı beş on bir eder.'],
    ['Wie viel ist das?', 'Bu kaç eder?', 'Wie viel ist drei plus vier?', 'Üç artı dört kaç eder?'],
    ['die Zahl', 'sayı', 'Die Zahlen von null bis zwanzig.', 'Sıfırdan yirmiye sayılar.'],
];
const wordSayC = (row) => row[4] ?? row[2];
exports.wordSayC = wordSayC;
/** The phrases of the unit (Konu 6, to learn by heart): German, meaning, what is read. */
exports.phrasesC = [
    ['Wie ist deine Telefonnummer?', 'Telefon numaran ne?', 'Wie ist deine Telefonnummer?'],
    ['Die Telefonnummer ist 0176 3345 621.', 'Telefon numarası 0176 3345 621.', 'Die Telefonnummer ist ' + (0, exports.digitWords)('0176 3345 621') + '.'],
    ['Wie viel ist das? – Sechs plus fünf ist elf.', 'Bu kaç eder? – Altı artı beş on bir.', 'Wie viel ist das? – Sechs plus fünf ist elf.'],
    ['Entschuldigung, ich brauche Hilfe.', 'Pardon, yardıma ihtiyacım var.', 'Entschuldigung, ich brauche Hilfe.'],
    ['Ja? Was ist das Problem?', 'Evet? Sorun ne?', 'Ja? Was ist das Problem?'],
    ['Adresse – ich verstehe das nicht.', 'Adresse – bunu anlamıyorum.', 'Adresse – ich verstehe das nicht.'],
    ['Adresse bedeutet: Wo wohnst du?', 'Adresse şu demek: Nerede oturuyorsun?', 'Adresse bedeutet: Wo wohnst du?'],
    ['Ah, danke. – Bitte, ich helfe gern.', 'Ah, teşekkürler. – Rica ederim, seve seve.', 'Ah, danke. – Bitte, ich helfe gern.'],
    ['Wie ist dein Nachname? – Mein Nachname ist Nasser.', 'Soyadın ne? – Soyadım Nasser.', 'Wie ist dein Nachname? – Mein Nachname ist Nasser.'],
    ['Wo wohnt ihr? – Wir wohnen in der Siemensstraße 12.', 'Nerede oturuyorsunuz? – Siemensstraße 12’de oturuyoruz.', 'Wo wohnt ihr? – Wir wohnen in der Siemensstraße zwölf.'],
];
/* ---------- quick checks inside the teaching steps (not scored) ---------- */
const check = (q, options, say = options[0]) => ({ q, options, say });
exports.wordChecksC = [
    check('12', ['zwölf', 'zwanzig', 'zehn']),
    check('siebzehn', ['17', '7', '70'], 'siebzehn'),
    check('„Ich verstehe das nicht.“', ['Bunu anlamıyorum.', 'Buna ihtiyacım yok.', 'Bunu bilmiyorum.'], ''),
    check('soyadı', ['der Nachname', 'der Vorname', 'der Ort']),
    check('posta kodu', ['die Postleitzahl', 'die Hausnummer', 'die Telefonnummer']),
    check('„Ich helfe gern.“', ['Seve seve yardım ederim.', 'Yardıma ihtiyacım var.', 'Anlamıyorum.'], ''),
    check('siz (çoğul, arkadaşlara)', ['ihr', 'wir', 'Sie']),
    check('Sechs plus fünf ist …', ['elf', 'zwölf', 'neun'], 'Sechs plus fünf ist elf.'),
];
exports.numberChecks = [
    check('16', ['sechzehn', 'sechszehn', 'sechzig']),
    check('siebzehn', ['17', '7', '27'], 'siebzehn'),
    check('„Wie ist deine Telefonnummer?“', ['Telefon numaran ne?', 'Telefonun nerede?', 'Telefon numaram bu.'], ''),
];
exports.plusChecks = [
    check('Vier plus vier ist …', ['acht', 'sechs', 'neun'], 'Vier plus vier ist acht.'),
    check('Zehn plus neun ist …', ['neunzehn', 'neun', 'zwanzig'], 'Zehn plus neun ist neunzehn.'),
];
exports.helpChecks = [
    check('Formu anlamadın. Ne dersin?', ['Entschuldigung, ich brauche Hilfe.', 'Ich helfe gern.', 'Was ist das Problem?']),
    check('„Vorname bedeutet: ___“', ['Wie heißt du?', 'Wo wohnst du?', 'Was bist du von Beruf?'], 'Vorname bedeutet: Wie heißt du?'),
];
exports.formChecksC = [
    check('Wie ist ___ Telefonnummer? (sen)', ['deine', 'dein', 'meine'], 'Wie ist deine Telefonnummer?'),
    check('___ Vorname ist Mei.', ['Mein', 'Meine', 'Dein'], 'Mein Vorname ist Mei.'),
    check('„13629 Berlin“ – 13629 nedir?', ['die Postleitzahl', 'die Hausnummer', 'die Telefonnummer']),
];
exports.wirChecks = [
    check('Woher ___ ihr?', ['kommt', 'kommen', 'kommst'], 'Woher kommt ihr?'),
    check('Wir ___ neu im Kurs.', ['sind', 'seid', 'ist'], 'Wir sind neu im Kurs.'),
    check('Wo ___ ihr? – Wir ___ in Berlin.', ['wohnt / wohnen', 'wohnen / wohnt', 'wohnst / wohne'], 'Wo wohnt ihr? – Wir wohnen in Berlin.'),
];
/* ---------- teaching steps ---------- */
/** Konu 2 · adding: German, meaning. */
exports.plusPhrases = [
    ['Wie viel ist drei plus vier?', 'Üç artı dört kaç eder?'], ['Drei plus vier ist sieben.', 'Üç artı dört yedi eder.'],
    ['Sechs plus fünf plus eins ist zwölf.', 'Altı artı beş artı bir on iki eder.'], ['Zwölf!', 'On iki! (yarışmada cevap böyle bağırılır)'],
];
/** Konu 3 · asking for help. */
exports.helpPhrases = [
    ['Entschuldigung, ich brauche Hilfe.', 'Pardon, yardıma ihtiyacım var.', 'Entschuldigung, ich brauche Hilfe.'],
    ['Ich verstehe das nicht.', 'Bunu anlamıyorum.', 'Ich verstehe das nicht.'],
    ['Was bedeutet „Adresse“?', '„Adresse“ ne demek?', 'Was bedeutet Adresse?'],
    ['Ich helfe gern.', 'Seve seve yardım ederim.', 'Ich helfe gern.'],
];
/** Yasemin does not understand the form; Nikos helps. */
exports.helpDialogue = [
    { who: 'yasemin', de: 'Entschuldigung, ich brauche Hilfe.', tr: 'Pardon, yardıma ihtiyacım var.' },
    { who: 'nikos', de: 'Ja? Was ist das Problem?', tr: 'Evet? Sorun ne?' },
    { who: 'yasemin', de: 'Adresse – ich verstehe das nicht.', tr: 'Adresse – bunu anlamıyorum.' },
    { who: 'nikos', de: 'Adresse bedeutet: Wo wohnst du?', tr: 'Adresse şu demek: Nerede oturuyorsun?' },
    { who: 'yasemin', de: 'Ah, danke.', tr: 'Ah, teşekkürler.' },
    { who: 'nikos', de: 'Bitte, ich helfe gern.', tr: 'Rica ederim, seve seve.' },
];
/** "… bedeutet: …": a word explained with a question. */
exports.meaningRows = [['Nachname', 'Wie heißt du?'], ['Land', 'Woher kommst du?'], ['Beruf', 'Was bist du von Beruf?']];
const meaningSay = (row) => row[0] + ' bedeutet: ' + row[1];
exports.meaningSay = meaningSay;
/** Konu 4 · the form: field, question, Omar's answer, what is read (the question and his answer). */
exports.formRows = [
    ['Vorname', 'Wie ist dein Vorname? / Wie heißt du?', 'Omar', 'Wie ist dein Vorname? Omar.'],
    ['Nachname', 'Wie ist dein Nachname?', 'Nasser', 'Wie ist dein Nachname? Nasser.'],
    ['Heimatort', 'Woher kommst du?', 'Khartum, Sudan', 'Woher kommst du? Aus Khartum, aus dem Sudan.'],
    ['Straße, Hausnummer', 'Wie ist deine Adresse?', 'Siemensstraße 12', 'Wie ist deine Adresse? Siemensstraße zwölf.'],
    ['PLZ, Ort', 'Wie ist deine Postleitzahl? / Wo wohnst du?', '13629 Berlin', 'Wie ist deine Postleitzahl? ' + (0, exports.digitWords)('13629') + '. Wo wohnst du? In Berlin.'],
    ['Beruf', 'Was bist du von Beruf?', 'Friseur', 'Was bist du von Beruf? Friseur.'],
    ['Telefonnummer', 'Wie ist deine Telefonnummer?', '0176 3345 621', 'Wie ist deine Telefonnummer? ' + (0, exports.digitWords)('0176 3345 621') + '.'],
    ['E-Mail-Adresse', 'Wie ist deine E-Mail-Adresse?', 'omar@example.org', 'Wie ist deine E-Mail-Adresse?'],
];
/** mein / dein: the words with der / das and with die. */
exports.possessiveRows = [
    ['der / das', 'mein', 'dein', 'Name, Vorname, Nachname, Beruf, Ort'],
    ['die', 'meine', 'deine', 'Adresse, Straße, Hausnummer, Postleitzahl, Telefonnummer, E-Mail-Adresse'],
];
exports.possessivePhrases = [
    ['Wie ist dein Nachname? – Mein Nachname ist Nasser.', 'der Nachname → dein / mein', 'Wie ist dein Nachname? – Mein Nachname ist Nasser.'],
    ['Wie ist deine Adresse? – Meine Adresse ist Siemensstraße 12.', 'die Adresse → deine / meine', 'Wie ist deine Adresse? – Meine Adresse ist Siemensstraße zwölf.'],
];
/** Konu 5 · wir and ihr: verb, wir form, ihr form (the ending after `|`). */
exports.wirIhrVerbs = [
    ['wohnen', 'wohn|en', 'wohn|t'], ['kommen', 'komm|en', 'komm|t'], ['verstehen', 'versteh|en', 'versteh|t'], ['arbeiten', 'arbeit|en', 'arbeit|et'], ['sein', '|sind', '|seid'],
];
exports.wirIhrSay = exports.wirIhrVerbs.map(([, wir, ihr]) => `wir ${wir.replace('|', '')}, ihr ${ihr.replace('|', '')}.`).join(' ');
/** Questions with ihr, answers with wir: question, answer, what is read. */
exports.wirIhrRows = [
    ['Wie heißt ihr?', 'Wir heißen Omar und Nikos.', 'Wie heißt ihr? – Wir heißen Omar und Nikos.'],
    ['Woher kommt ihr?', 'Wir kommen aus dem Sudan und aus Griechenland.', 'Woher kommt ihr? – Wir kommen aus dem Sudan und aus Griechenland.'],
    ['Wo wohnt ihr?', 'Wir wohnen in der Siemensstraße 12.', 'Wo wohnt ihr? – Wir wohnen in der Siemensstraße zwölf.'],
    ['Was seid ihr von Beruf?', 'Wir sind Friseur und Mechatroniker.', 'Was seid ihr von Beruf? – Wir sind Friseur und Mechatroniker.'],
    ['Was macht ihr?', 'Wir lernen Deutsch.', 'Was macht ihr? – Wir lernen Deutsch.'],
];
/** Two flat shares: Omar and Nikos, Yasemin and Mei; Paul Hoca asks. */
exports.flatDialogue = [
    { who: 'yasemin', de: 'Adresse? Wir verstehen das nicht.', tr: 'Adresse mi? Anlamıyoruz.' },
    { who: 'paul', de: 'Adresse bedeutet: Wo wohnt ihr?', tr: 'Adresse şu demek: Nerede oturuyorsunuz?' },
    { who: 'mei', de: 'Wir wohnen in der Lindenstraße 7.', tr: 'Lindenstraße 7’de oturuyoruz.', say: 'Wir wohnen in der Lindenstraße sieben.' },
    { who: 'paul', de: 'Und ihr, Omar und Nikos? Wo wohnt ihr?', tr: 'Ya siz, Omar ve Nikos? Nerede oturuyorsunuz?' },
    { who: 'omar', de: 'Wir wohnen in der Siemensstraße 12. Wir sind auch neu in Berlin.', tr: 'Siemensstraße 12’de oturuyoruz. Biz de Berlin’de yeniyiz.', say: 'Wir wohnen in der Siemensstraße zwölf. Wir sind auch neu in Berlin.' },
];
/** The whole table of Lektion 1 and 2: person, kommen, sein (the new rows marked). */
exports.allPersons = [
    ['ich', 'komm|e', 'bin'], ['du', 'komm|st', 'bist'], ['er / sie', 'komm|t', 'ist'], ['wir', 'komm|en', 'sind', true], ['ihr', 'komm|t', 'seid', true], ['sie / Sie', 'komm|en', 'sind'],
];
exports.allPersonsSay = 'ich komme, du kommst, er kommt, wir kommen, ihr kommt, sie kommen. ich bin, du bist, er ist, wir sind, ihr seid, sie sind.';
/** Konu 6 · word stress: the syllables with the stressed one in capitals, the word that is read. */
exports.stressRows = [
    ['VOR·na·me', 'Vorname'], ['NACH·na·me', 'Nachname'], ['be·RUF', 'Beruf'], ['HAUS·num·mer', 'Hausnummer'],
    ['POST·leit·zahl', 'Postleitzahl'], ['a·DRES·se', 'Adresse'], ['te·le·FON·num·mer', 'Telefonnummer'], ['E·Mail·a·dres·se', 'E-Mail-Adresse'],
];
/* ---------- exercises ---------- */
/** Exercise 1 · Welche Zahl? The number heard (read at once, again on a tap) and three numbers to choose from. */
exports.listenNumbers = [
    [3, ['3', '13', '8']], [7, ['7', '17', '11']], [11, ['11', '1', '12']], [12, ['12', '2', '20']], [15, ['15', '5', '14']], [16, ['16', '6', '19']], [17, ['17', '7', '18']], [19, ['19', '9', '20']],
];
/** Exercise 2 · number rows: the missing numbers written as words. */
exports.numberRows = [
    { text: 'eins – ___ – drei – ___ – fünf – ___', answers: [['zwei'], ['vier'], ['sechs']] },
    { text: 'null – ___ – vier – ___ – acht – ___', answers: [['zwei'], ['sechs'], ['zehn']] },
    { text: 'zehn – ___ – acht – ___ – sechs – ___', answers: [['neun'], ['sieben'], ['fünf']] },
    { text: 'zwölf – ___ – vierzehn – ___ – ___ – siebzehn', answers: [['dreizehn'], ['fünfzehn'], ['sechzehn']] },
    { text: 'siebzehn – achtzehn – ___ – ___', answers: [['neunzehn'], ['zwanzig']] },
];
/** The rows read whole once all are right. */
exports.numberRowSay = exports.numberRows.map(line => { let g = 0; return line.text.split(' – ').map(part => part === '___' ? line.answers.flat()[g++] : part).join(', ') + '.'; });
/** Exercise 3 · the phone numbers: only the digits count (spaces, dashes do not). */
const phoneDigits = (text) => text.replace(/\D/g, '');
exports.phoneDigits = phoneDigits;
/** Exercise 4 · three dice: the numbers and the sum (written as a word or with digits). */
exports.dice = [[4, 6, 1], [6, 5, 3], [2, 4, 6], [6, 6, 5], [6, 6, 6]];
exports.diceFaces = '⚀⚁⚂⚃⚄⚅';
const diceSum = (row) => row[0] + row[1] + row[2];
exports.diceSum = diceSum;
const diceSentence = (row) => `${exports.numberWords[row[0]]} plus ${exports.numberWords[row[1]]} plus ${exports.numberWords[row[2]]} ist ${exports.numberWords[(0, exports.diceSum)(row)]}.`;
exports.diceSentence = diceSentence;
exports.diceLines = exports.dice.map(row => ({ text: `${exports.diceFaces[row[0] - 1]} ${exports.diceFaces[row[1] - 1]} ${exports.diceFaces[row[2] - 1]} · ${exports.numberWords[row[0]]} plus ${exports.numberWords[row[1]]} plus ${exports.numberWords[row[2]]} ist ___`, answers: [[exports.numberWords[(0, exports.diceSum)(row)], String((0, exports.diceSum)(row))]] }));
/** Exercise 5 · the help dialogue: the verbs of the box (one box for every gap); each line by its person. */
exports.helpBox = ['brauche', 'ist', 'verstehe', 'bedeutet', 'heißt', 'helfe'];
const helpGap = (answer) => ({ options: exports.helpBox, answer });
const said = (line) => line.parts.map(part => typeof part === 'string' ? part : part.answer).join('');
const withSay = (line) => ({ ...line, say: { text: said(line), who: line.who } });
exports.helpLines = [
    { key: 'm1', who: 'mei', parts: ['Entschuldigung, ich ', helpGap('brauche'), ' Hilfe.'] },
    { key: 'o1', who: 'omar', parts: ['Ja? Was ', helpGap('ist'), ' das Problem?'] },
    { key: 'm2', who: 'mei', parts: ['Nachname – ich ', helpGap('verstehe'), ' das nicht.'] },
    { key: 'o2', who: 'omar', parts: ['Nachname ', helpGap('bedeutet'), ': Wie ', helpGap('heißt'), ' du?'] },
    { key: 'm3', who: 'mei', parts: ['Ah, danke. Mein Nachname ist Suwan.'] },
    { key: 'o3', who: 'omar', parts: ['Bitte, ich ', helpGap('helfe'), ' gern.'] },
].map(withSay);
exports.helpSay = exports.helpLines.map(line => line.say);
/** Exercise 6 · which question does the field ask? [field, the right question, the options] */
exports.fieldQuestions = [
    ['Vorname', 'Wie heißt du?', ['Wie heißt du?', 'Wo wohnst du?', 'Woher kommst du?']],
    ['Telefonnummer', 'Wie ist deine Telefonnummer?', ['Wie ist deine Telefonnummer?', 'Wie ist deine Adresse?', 'Wie ist deine Postleitzahl?']],
    ['Adresse', 'Wo wohnst du?', ['Wo wohnst du?', 'Woher kommst du?', 'Was bist du von Beruf?']],
    ['Beruf', 'Was bist du von Beruf?', ['Was bist du von Beruf?', 'Wie heißt du?', 'Wo wohnst du?']],
    ['Heimatort', 'Woher kommst du?', ['Woher kommst du?', 'Wo wohnst du?', 'Wie ist dein Nachname?']],
    ['Postleitzahl', 'Wie ist deine Postleitzahl?', ['Wie ist deine Postleitzahl?', 'Wie ist deine Hausnummer?', 'Wie ist deine Telefonnummer?']],
    ['E-Mail-Adresse', 'Wie ist deine E-Mail-Adresse?', ['Wie ist deine E-Mail-Adresse?', 'Wie ist deine Adresse?', 'Wie ist dein Vorname?']],
];
const fieldSay = (row) => row[0] + ' bedeutet: ' + row[1];
exports.fieldSay = fieldSay;
/** Exercise 7 · mein / dein: Paul Hoca asks, the person answers (two words per gap; a capital at the start). */
const duBox = ['dein', 'deine'], meinBox = ['mein', 'meine'], capBox = ['Mein', 'Meine'];
const pick = (options, answer) => ({ options, answer });
exports.possessiveLines = [
    { key: 'p1', who: 'paul', parts: ['Omar, ', pick(duBox, 'dein'), ' Nachname ist Nasser, richtig?'] },
    { key: 'a1', who: 'omar', parts: ['Ja, ', pick(meinBox, 'mein'), ' Nachname ist Nasser.'] },
    { key: 'p2', who: 'paul', parts: ['Mei, wie ist ', pick(duBox, 'deine'), ' Adresse?'] },
    { key: 'a2', who: 'mei', parts: [pick(capBox, 'Meine'), ' Adresse ist Lindenstraße 7.'], say: { text: 'Meine Adresse ist Lindenstraße sieben.', who: 'mei' } },
    { key: 'p3', who: 'paul', parts: ['Tomasz, wie ist ', pick(duBox, 'deine'), ' Hausnummer?'] },
    { key: 'a3', who: 'tomasz', parts: [pick(capBox, 'Meine'), ' Hausnummer ist 21.'], say: { text: 'Meine Hausnummer ist einundzwanzig.', who: 'tomasz' } },
    { key: 'p4', who: 'paul', parts: ['Aisha, wie ist ', pick(duBox, 'deine'), ' Postleitzahl?'] },
    { key: 'a4', who: 'aisha', parts: [pick(capBox, 'Meine'), ' Postleitzahl ist 12049.'], say: { text: 'Meine Postleitzahl ist ' + (0, exports.digitWords)('12049') + '.', who: 'aisha' } },
    { key: 'p5', who: 'paul', parts: ['Nikos, wie ist ', pick(duBox, 'dein'), ' Vorname?'] },
    { key: 'a5', who: 'nikos', parts: [pick(capBox, 'Mein'), ' Vorname ist Nikos.'] },
    { key: 'p6', who: 'paul', parts: ['Rami, was ist ', pick(duBox, 'dein'), ' Beruf?'] },
    { key: 'a6', who: 'rami', parts: [pick(capBox, 'Mein'), ' Beruf ist Altenpfleger.'] },
].map(line => line.say ? line : withSay(line));
exports.wirIhrLines = [
    { who: 'yasemin', text: 'Hallo, wir ___ (sein) Yasemin und Mei. Wir ___ (sein) neu im Kurs. Und ihr? Wie ___ (heißen) ihr?', answers: [['sind'], ['sind'], ['heißt']], say: 'Hallo, wir sind Yasemin und Mei. Wir sind neu im Kurs. Und ihr? Wie heißt ihr?' },
    { who: 'omar', text: 'Wir ___ (heißen) Omar und Nikos. Woher ___ (kommen) ihr?', answers: [['heißen'], ['kommt']], say: 'Wir heißen Omar und Nikos. Woher kommt ihr?' },
    { who: 'mei', text: 'Ich komme aus Thailand und Yasemin ___ (kommen) aus der Türkei. Wir ___ (wohnen) in der Lindenstraße 7. Und wo ___ (wohnen) ihr?', answers: [['kommt'], ['wohnen'], ['wohnt']], say: 'Ich komme aus Thailand und Yasemin kommt aus der Türkei. Wir wohnen in der Lindenstraße sieben. Und wo wohnt ihr?' },
    { who: 'nikos', text: 'Wir ___ (wohnen) in der Siemensstraße 12. Was ___ (machen) ihr beruflich?', answers: [['wohnen'], ['macht']], say: 'Wir wohnen in der Siemensstraße zwölf. Was macht ihr beruflich?' },
    { who: 'yasemin', text: 'Ich ___ (sein) Tierärztin, Mei ___ (sein) Ingenieurin. Aber wir ___ (arbeiten) jetzt nicht. Wir ___ (lernen) Deutsch.', answers: [['bin'], ['ist'], ['arbeiten'], ['lernen']], say: 'Ich bin Tierärztin, Mei ist Ingenieurin. Aber wir arbeiten jetzt nicht. Wir lernen Deutsch.' },
    { who: 'omar', text: 'Wir ___ (arbeiten): Ich arbeite als Verkäufer und Nikos repariert Autos. Und wir lernen auch Deutsch!', answers: [['arbeiten']], say: 'Wir arbeiten: Ich arbeite als Verkäufer und Nikos repariert Autos. Und wir lernen auch Deutsch!' },
];
const q = (question, options, say) => [question, options, options[0], say];
exports.berufeTestC = [
    q('7', ['sieben', 'sechs', 'siebzehn'], 'sieben'),
    q('16', ['sechzehn', 'sechszehn', 'sechzig'], 'sechzehn'),
    q('17', ['siebzehn', 'siebenzehn', 'siebzig'], 'siebzehn'),
    q('Sechs plus fünf ist ___.', ['elf', 'zwölf', 'zehn'], 'Sechs plus fünf ist elf.'),
    q('Entschuldigung, ich ___ Hilfe.', ['brauche', 'bedeute', 'verstehe'], 'Entschuldigung, ich brauche Hilfe.'),
    q('Nachname – ich ___ das nicht.', ['verstehe', 'helfe', 'brauche'], 'Nachname – ich verstehe das nicht.'),
    q('„Adresse bedeutet: ___“', ['Wo wohnst du?', 'Woher kommst du?', 'Wie heißt du?'], 'Adresse bedeutet: Wo wohnst du?'),
    q('Wie ist ___ Telefonnummer? (du)', ['deine', 'dein', 'meine'], 'Wie ist deine Telefonnummer?'),
    q('Das ist ___ Vorname.', ['mein', 'meine', 'deine'], 'Das ist mein Vorname.'),
    q('Wo ___ ihr? – Wir ___ in Berlin.', ['wohnt / wohnen', 'wohnen / wohnt', 'wohnst / wohne'], 'Wo wohnt ihr? – Wir wohnen in Berlin.'),
    q('Woher ___ ihr?', ['kommt', 'kommen', 'kommst'], 'Woher kommt ihr?'),
    q('Wir ___ neu im Kurs.', ['sind', 'seid', 'ist'], 'Wir sind neu im Kurs.'),
];
/** Konuş: a person asks, the learner answers aloud (the shown answer, digits read as words). */
exports.practiceItemsC = [
    { who: 'paul', question: 'Wie ist deine Telefonnummer?', answer: 'Meine Telefonnummer ist 0176 3345 621.', answerSay: (0, exports.phoneSay)('0176 3345 621') },
    { who: 'nikos', question: 'Wie viel ist drei plus vier?', answer: 'Sieben! Drei plus vier ist sieben.' },
    { who: 'mei', question: 'Postleitzahl – ich verstehe das nicht.', answer: 'Ich helfe gern. Meine Postleitzahl ist 13629.', answerSay: 'Ich helfe gern. Meine Postleitzahl ist ' + (0, exports.digitWords)('13629') + '.' },
    { who: 'paul', question: 'Woher kommt ihr?', answer: 'Wir kommen aus der Türkei und aus Thailand.' },
    { who: 'omar', question: 'Wo wohnt ihr?', answer: 'Wir wohnen in der Lindenstraße 7.', answerSay: 'Wir wohnen in der Lindenstraße sieben.' },
];
/* ---------- steps ---------- */
exports.berufeStepsC = [
    { id: 'kapak', title: 'Kapak', kind: 'cover' },
    { id: 'sayilar', title: 'Kelimeler: sayılar 0–20', kind: 'teach' },
    { id: 'kelimeler', title: 'Kelimeler: liste', kind: 'teach' },
    { id: 'kontrol', title: 'Kelime kontrolü', kind: 'teach' },
    { id: 'sayi-kurali', title: 'Sayılar ve telefon', kind: 'teach' },
    { id: 'toplama', title: 'Wie viel ist das?', kind: 'teach' },
    { id: 'yardim', title: 'Yardım isteme', kind: 'teach' },
    { id: 'form', title: 'Form ve mein / dein', kind: 'teach' },
    { id: 'wir-ihr', title: 'wir ve ihr', kind: 'teach' },
    { id: 'vurgu', title: 'Vurgu ve kalıplar', kind: 'teach' },
    { id: 'sayi-dinle', title: 'Alıştırma 1', kind: 'exercise' },
    { id: 'dizi', title: 'Alıştırma 2', kind: 'exercise' },
    { id: 'telefon', title: 'Alıştırma 3', kind: 'exercise' },
    { id: 'zar', title: 'Alıştırma 4', kind: 'exercise' },
    { id: 'yardim-diyalog', title: 'Alıştırma 5', kind: 'exercise' },
    { id: 'form-soru', title: 'Alıştırma 6', kind: 'exercise' },
    { id: 'mein-dein', title: 'Alıştırma 7', kind: 'exercise' },
    { id: 'wir-ihr-yaz', title: 'Alıştırma 8', kind: 'exercise' },
    { id: 'test', title: 'Test', kind: 'test' },
    { id: 'konus', title: 'Konuş', kind: 'speak' },
    { id: 'bitti', title: 'Bitti', kind: 'end' },
];
const berufeStepIndexC = (id) => exports.berufeStepsC.findIndex(step => step.id === id);
exports.berufeStepIndexC = berufeStepIndexC;
exports.berufeStepShortC = { 'sayi-dinle': 'Sayıyı duy', 'dizi': 'Sayı dizileri', 'telefon': 'Telefon numarası', 'zar': 'Zar oyunu', 'yardim-diyalog': 'Yardım diyaloğu', 'form-soru': 'Form ve soru', 'mein-dein': 'mein / dein', 'wir-ihr-yaz': 'wir / ihr' };
const gapCount = (lines) => lines.reduce((n, line) => n + line.answers.length, 0);
const choiceCount = (lines) => lines.reduce((n, line) => n + line.parts.filter(part => typeof part !== 'string').length, 0);
exports.berufeScoredC = [
    { id: 'sayi-dinle', total: exports.listenNumbers.length },
    { id: 'dizi', total: gapCount(exports.numberRows) },
    { id: 'telefon', total: exports.phones.length },
    { id: 'zar', total: exports.diceLines.length },
    { id: 'yardim-diyalog', total: choiceCount(exports.helpLines) },
    { id: 'form-soru', total: exports.fieldQuestions.length },
    { id: 'mein-dein', total: choiceCount(exports.possessiveLines) },
    { id: 'wir-ihr-yaz', total: gapCount(exports.wirIhrLines) },
    { id: 'test', total: exports.berufeTestC.length },
];
exports.berufeGroupsC = [
    { id: 'konu', label: 'Konu anlatımı', ids: exports.berufeStepsC.filter(step => step.kind === 'teach').map(step => step.id) },
    { id: 'alistirmalar', label: 'Alıştırmalar', ids: exports.berufeStepsC.filter(step => step.kind === 'exercise').map(step => step.id) },
    { id: 'test', label: 'Test', ids: ['test'] },
    { id: 'konus', label: 'Konuş', ids: ['konus'] },
];
/** The words of Teil C and the numbers 0–20. */
exports.berufeWordCountC = exports.wordsC.length + exports.numberWords.length;
/** Every German text Teil C speaks (rendered as site voices by scripts/voices). */
function berufeCSpeechTexts() {
    const out = new Set();
    const add = (text) => { const clean = (text ?? '').trim(); if (clean)
        out.add(clean); };
    const say = (item) => { if (item)
        add(typeof item === 'string' ? item : item.text); };
    exports.numberWords.forEach(add);
    add(exports.countAll);
    exports.wordsC.forEach(row => add((0, exports.wordSayC)(row)));
    exports.phrasesC.forEach(([, , text]) => add(text));
    for (const item of [...exports.wordChecksC, ...exports.numberChecks, ...exports.plusChecks, ...exports.helpChecks, ...exports.formChecksC, ...exports.wirChecks])
        add(item.say);
    exports.teenRows.forEach(([, , word]) => add(word));
    exports.phonePhrases.forEach(([, , text]) => add(text));
    exports.plusPhrases.forEach(([de]) => add(de));
    exports.helpPhrases.forEach(([, , text]) => add(text));
    for (const line of [...exports.helpDialogue, ...exports.flatDialogue])
        add(line.say ?? line.de);
    exports.meaningRows.forEach(row => add((0, exports.meaningSay)(row)));
    exports.formRows.forEach(([, , , text]) => add(text));
    exports.possessivePhrases.forEach(([, , text]) => add(text));
    add(exports.wirIhrSay);
    exports.wirIhrRows.forEach(([, , text]) => add(text));
    add(exports.allPersonsSay);
    exports.stressRows.forEach(([, word]) => add(word));
    exports.numberRowSay.forEach(add);
    exports.phones.forEach(phone => add((0, exports.phoneSay)(phone.number)));
    exports.dice.forEach(row => add((0, exports.diceSentence)(row)));
    exports.helpSay.forEach(say);
    exports.fieldQuestions.forEach(row => add((0, exports.fieldSay)(row)));
    exports.possessiveLines.forEach(line => say(line.say));
    exports.wirIhrLines.forEach(line => add(line.say));
    exports.berufeTestC.forEach(question => add(question[3]));
    exports.practiceItemsC.forEach(item => { add(item.question); add(item.answerSay ?? item.answer); });
    return [...out];
}
