"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPointsD = exports.checkSectionsD = exports.berufeTestD = exports.examFormD = exports.tomaszExamSay = exports.tomaszExam = exports.talkAnswersD = exports.talkQuestionsD = exports.grammarSayD = exports.grammarSpeakersD = exports.grammarLinesD = exports.vocabLinesD = exports.vocabBoxD = exports.ownFieldOk = exports.ownFields = exports.L2D_FORM_KEY = exports.syllableMeanings = exports.syllableOrder = exports.mimeRows = exports.tableCells = exports.tableVerbs = exports.formFields = exports.formTalk = exports.firstDayRows = exports.firstDay = exports.mimePhrases = exports.noraRami = exports.pardonPhrases = exports.longWordSteps = exports.syllableSay = exports.syllableWords = exports.ramiSentences = exports.formNames = exports.regularFormsD = exports.conjugationSay = exports.personNames = exports.specialVerbsD = exports.regularVerbsD = exports.personRows = exports.longChecks = exports.formChecksD = exports.verbChecksD = exports.wordChecksD = exports.phrasesD = exports.wordSayD = exports.wordsD = exports.khalilSpelled = exports.ramiForm = exports.castL2D = exports.berufeDPictures = void 0;
exports.berufeWordCountD = exports.berufeGroupsD = exports.berufeScoredD = exports.berufeStepShortD = exports.berufeStepIndexD = exports.berufeStepsD = exports.examTalk = void 0;
exports.berufeDSpeechTexts = berufeDSpeechTexts;
const willkommen_b_course_1 = require("./willkommen-b-course");
const berufe_c_course_1 = require("./berufe-c-course");
/** Pictures of Teil D (public/toon/lektion2, from the learner's page). */
exports.berufeDPictures = {
    cover: { src: '/toon/lektion2/kapak-d.webp', width: 960, height: 540 },
    trophy: { src: '/toon/lektion2/pokal-2.webp', width: 640, height: 492 },
};
exports.castL2D = ['rami', 'nora', 'mei', 'tomasz', 'yasemin', 'sabine', 'nikos', 'omar', 'paul'];
/** Rami's form at the care service (invented, like every address and number of Lektion 2). */
exports.ramiForm = [
    ['Familienname', 'Khalil'], ['Vorname', 'Rami'], ['Wohnort', 'Berlin'], ['PLZ', '10435'], ['Straße und Hausnummer', 'Kastanienallee 25'], ['Beruf', 'Altenpfleger'], ['Telefonnummer', '0157 2345 678'],
];
exports.khalilSpelled = (0, willkommen_b_course_1.spelledText)('Khalil');
exports.wordsD = [
    ['der Altenpflege-Service', 'yaşlı bakım servisi', 'Rami ist neu beim Altenpflege-Service.', 'Rami yaşlı bakım servisinde yeni.'],
    ['der Krankenpfleger / die Krankenpflegerin', 'hemşire, hasta bakıcı', 'Nora ist Krankenpflegerin.', 'Nora hemşire.'],
    ['der Chef / die Chefin', 'patron, şef', 'Die Chefin spricht Deutsch und Englisch.', 'Patron Almanca ve İngilizce konuşuyor.'],
    ['neu', 'yeni', 'Ich bin neu hier.', 'Burada yeniyim.'],
    ['nur', 'sadece, yalnızca', 'Ich spreche nur ein bisschen Deutsch.', 'Sadece biraz Almanca konuşuyorum.'],
    ['das Personalformular', 'personel formu (işe giriş formu)', 'Hier ist das Personalformular.', 'İşte personel formu.'],
    ['der Familienname', 'soyadı (= Nachname)', 'Familienname: Khalil', 'Soyadı: Khalil', 'Familienname: Khalil.'],
    ['der Wohnort', 'oturduğu yer (= Ort)', 'Wohnort: Berlin', 'Oturduğu yer: Berlin', 'Wohnort: Berlin.'],
    ['buchstabieren', 'harf harf söylemek, hecelemek', 'Khalil – ich buchstabiere: K-H-A-L-I-L.', 'Khalil – harf harf söylüyorum.', 'Khalil – ich buchstabiere: ' + exports.khalilSpelled + '.'],
    ['Wie bitte?', 'Efendim? / Pardon?', 'Wie bitte? Noch einmal, bitte.', 'Efendim? Bir daha lütfen.'],
    ['Wie schreibt man das?', 'Bu nasıl yazılır?', 'Khalil? Wie schreibt man das?', 'Khalil mi? Nasıl yazılır?'],
    ['das Wort, die Wörter', 'kelime, kelimeler', 'Die Wörter sind lang und schwer.', 'Kelimeler uzun ve zor.'],
    ['lang', 'uzun', 'Das Wort ist lang.', 'Kelime uzun.'],
    ['die Silbe, die Silben', 'hece, heceler', 'Te-le-fon-num-mer: fünf Silben.', 'Te-le-fon-num-mer: beş hece.', 'Te, le, fon, num, mer: fünf Silben.'],
    ['leicht / schwer', 'kolay / zor', 'Das ist leicht. Das ist schwer.', 'Bu kolay. Bu zor.'],
    ['üben', 'alıştırma yapmak, çalışmak', 'Wir üben Deutsch.', 'Almanca çalışıyoruz.'],
    ['Alles klar?', 'Her şey anlaşıldı mı? / Tamam mı?', 'Alles klar? – Ja, alles klar!', 'Anlaşıldı mı? – Evet, tamam!'],
    ['schreiben', 'yazmak', 'Ihr schreibt.', 'Siz yazıyorsunuz.'],
    ['singen', 'şarkı söylemek', 'Ihr singt.', 'Siz şarkı söylüyorsunuz.'],
    ['studieren', 'üniversitede okumak', 'Ihr studiert.', 'Siz üniversitede okuyorsunuz.'],
    ['reparieren', 'tamir etmek', 'Ihr repariert.', 'Siz tamir ediyorsunuz.'],
    ['tanzen', 'dans etmek', 'Ihr tanzt.', 'Siz dans ediyorsunuz.'],
    ['trinken', 'içmek', 'Ihr trinkt.', 'Siz içiyorsunuz.'],
    ['sprechen', 'konuşmak', 'Ihr sprecht.', 'Siz konuşuyorsunuz.'],
];
const wordSayD = (row) => row[4] ?? row[2];
exports.wordSayD = wordSayD;
/** The phrases of the unit: German, meaning, what is read. */
exports.phrasesD = [
    ['Sie sind neu hier? – Ja, ich bin neu hier.', 'Burada yeni misiniz? – Evet, burada yeniyim.', 'Sie sind neu hier? – Ja, ich bin neu hier.'],
    ['Ich spreche nur ein bisschen Deutsch.', 'Sadece biraz Almanca konuşuyorum.', 'Ich spreche nur ein bisschen Deutsch.'],
    ['Personalformular – was bedeutet das?', 'Personel formu – bu ne demek?', 'Personalformular – was bedeutet das?'],
    ['Wie bitte? Wie schreibt man das?', 'Efendim? Nasıl yazılır?', 'Wie bitte? Wie schreibt man das?'],
    ['Ich buchstabiere: K-H-A-L-I-L.', 'Harf harf söylüyorum: K-H-A-L-I-L.', 'Ich buchstabiere: ' + exports.khalilSpelled + '.'],
    ['Familienname? – Khalil. Wohnort? – Berlin.', 'Soyadı? – Khalil. Oturduğu yer? – Berlin.', 'Familienname? – Khalil. Wohnort? – Berlin.'],
    ['Ihr sprecht. – Nein, ihr singt. – Richtig!', 'Siz konuşuyorsunuz. – Hayır, şarkı söylüyorsunuz. – Doğru!', 'Ihr sprecht. – Nein, ihr singt. – Richtig!'],
    ['Alles klar? – Ja, alles klar!', 'Anlaşıldı mı? – Evet, tamam!', 'Alles klar? – Ja, alles klar!'],
];
/* ---------- quick checks inside the teaching steps (not scored) ---------- */
const check = (q, options, say = options[0]) => ({ q, options, say });
exports.wordChecksD = [
    check('hemşire (kadın)', ['die Krankenpflegerin', 'die Altenpflegerin', 'die Chefin']),
    check('„Familienname“ = ?', ['Nachname', 'Vorname', 'Wohnort']),
    check('„Wie schreibt man das?“', ['Bu nasıl yazılır?', 'Bu ne demek?', 'Bu kim?'], ''),
    check('sadece', ['nur', 'neu', 'auch']),
    check('hece', ['die Silbe', 'das Wort', 'die Zahl']),
    check('„Ihr tanzt.“', ['Siz dans ediyorsunuz.', 'Biz dans ediyoruz.', 'Onlar dans ediyor.'], ''),
    check('harf harf söylemek', ['buchstabieren', 'studieren', 'reparieren']),
    check('„Wohnort“ = ?', ['Ort', 'Straße', 'Land']),
];
exports.verbChecksD = [
    check('Ihr ___ Deutsch. (lernen)', ['lernt', 'lernen', 'lernst'], 'Ihr lernt Deutsch.'),
    check('Wir ___ neu hier. (sein)', ['sind', 'seid', 'ist'], 'Wir sind neu hier.'),
    check('Du ___ als Kellner. (arbeiten)', ['arbeitest', 'arbeitst', 'arbeitet'], 'Du arbeitest als Kellner.'),
    check('Ihr ___ Arabisch. (sprechen)', ['sprecht', 'spricht', 'sprechen'], 'Ihr sprecht Arabisch.'),
];
exports.formChecksD = [
    check('„Familienname“ alanına ne yazılır?', ['Khalil', 'Rami', 'Berlin'], 'Familienname: Khalil.'),
    check('„Wohnort“ alanına ne yazılır?', ['Berlin', 'Kastanienallee 25', '10435'], 'Wohnort: Berlin.'),
];
exports.longChecks = [
    check('„Telefonnummer“ kaç hece?', ['5', '3', '4'], ''),
    check('Kran-ken-pfle-ge-rin → ?', ['Krankenpflegerin', 'Krankenpfleger', 'Altenpflegerin']),
];
/* ---------- teaching steps ---------- */
/** Konu 1 · the endings of a regular verb: person, meaning, ending, schreiben, lernen, wohnen (`|` before the ending). */
exports.personRows = [
    ['ich', 'ben', '-e', ['schreib|e', 'lern|e', 'wohn|e']],
    ['du', 'sen', '-st', ['schreib|st', 'lern|st', 'wohn|st']],
    ['er / sie', 'o', '-t', ['schreib|t', 'lern|t', 'wohn|t']],
    ['wir', 'biz', '-en', ['schreib|en', 'lern|en', 'wohn|en']],
    ['ihr', 'siz', '-t', ['schreib|t', 'lern|t', 'wohn|t']],
    ['sie / Sie', 'onlar / siz', '-en', ['schreib|en', 'lern|en', 'wohn|en']],
];
exports.regularVerbsD = ['schreiben', 'lernen', 'wohnen'];
/** The four verbs to watch: the forms of ich … sie / Sie (the special part after `|`). */
exports.specialVerbsD = [
    ['arbeiten', ['arbeite', 'arbeit|est', 'arbeit|et', 'arbeiten', 'arbeit|et', 'arbeiten']],
    ['sprechen', ['spreche', 'spr|i|chst', 'spr|i|cht', 'sprechen', 'sprecht', 'sprechen']],
    ['heißen', ['heiße', 'heiß|t', 'heißt', 'heißen', 'heißt', 'heißen']],
    ['sein', ['|bin', '|bist', '|ist', '|sind', '|seid', '|sind']],
];
exports.personNames = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
/** A verb read in all six persons ("ich schreibe, du schreibst, er schreibt, wir schreiben, ihr schreibt, sie schreiben."). */
const conjugationSay = (forms) => forms.map((form, i) => `${exports.personNames[i]} ${form.replace(/\|/g, '')}`).join(', ') + '.';
exports.conjugationSay = conjugationSay;
const regularFormsD = (verb) => exports.personRows.map(row => row[3][verb]);
exports.regularFormsD = regularFormsD;
/** Konu 2 · the form's names: on the form, the same in Teil C, the meaning. */
exports.formNames = [
    ['Familienname', 'Nachname', 'soyadı'], ['Wohnort', 'Ort', 'oturduğu şehir'], ['Vorname', 'Vorname', 'ad'], ['PLZ', 'Postleitzahl', 'posta kodu'],
    ['Straße und Hausnummer', 'Adresse', 'cadde ve kapı numarası'], ['Beruf · Telefonnummer', 'aynı', 'meslek · telefon numarası'],
];
/** The form passed on in sentences (er): shown, meaning, read. */
exports.ramiSentences = [
    ['Er heißt Rami Khalil. Er wohnt in Berlin, in der Kastanienallee 25.', 'Adı Rami Khalil. Berlin’de, Kastanienallee 25’te oturuyor.', 'Er heißt Rami Khalil. Er wohnt in Berlin, in der Kastanienallee fünfundzwanzig.'],
    ['Die Postleitzahl ist 10435. Er ist Altenpfleger von Beruf.', 'Posta kodu 10435. Yaşlı bakıcısı.', 'Die Postleitzahl ist ' + (0, berufe_c_course_1.digitWords)('10435') + '. Er ist Altenpfleger von Beruf.'],
    ['Die Telefonnummer ist 0157 2345 678.', 'Telefon numarası 0157 2345 678.', 'Die Telefonnummer ist ' + (0, berufe_c_course_1.digitWords)('0157 2345 678') + '.'],
];
/** Konu 3 · long words in syllables. */
exports.syllableWords = [
    [['Kran', 'ken', 'pfle', 'ge', 'rin'], 'Krankenpflegerin'], [['buch', 'sta', 'bie', 'ren'], 'buchstabieren'], [['Te', 'le', 'fon', 'num', 'mer'], 'Telefonnummer'],
    [['Post', 'leit', 'zahl'], 'Postleitzahl'], [['Fa', 'mi', 'li', 'en', 'na', 'me'], 'Familienname'], [['Wohn', 'ort'], 'Wohnort'], [['Haus', 'num', 'mer'], 'Hausnummer'],
];
const syllableSay = (row) => row[0].join(', ') + '. ' + row[1] + '.';
exports.syllableSay = syllableSay;
exports.longWordSteps = [
    ['Parçala:', 'Kelimenin içindeki tanıdık parçaları bul: Kranken (hasta) + Pflegerin (bakıcı).'],
    ['Hecele:', 'Kran-ken-pfle-ge-rin. Her hecede elini masaya vur.'],
    ['Yavaş, sonra hızlı:', 'Üç kez yavaş, üç kez normal hızda söyle.'],
    ['Yaz:', 'Bakmadan yaz, kontrol et. Kelimeyi dinle, tekrar et.'],
];
/** Konu 4 · when you do not understand. */
exports.pardonPhrases = [
    ['Wie bitte?', 'Efendim? / Pardon, bir daha?', 'Wie bitte?'],
    ['Noch einmal, bitte. Langsam.', 'Bir daha lütfen. Yavaş.', 'Noch einmal, bitte. Langsam.'],
    ['Wie schreibt man das?', 'Bu nasıl yazılır?', 'Wie schreibt man das?'],
    ['Ich buchstabiere: K-H-A-L-I-L.', 'Harf harf söylüyorum: Ka-Ha-A-El-İ-El.', 'Ich buchstabiere: ' + exports.khalilSpelled + '.'],
];
/** Nora and Rami at the care service (she says Sie: Ihr Nachname). */
exports.noraRami = [
    { who: 'nora', de: 'Familienname?', tr: 'Soyadı?' },
    { who: 'rami', de: 'Familienname? Ich verstehe das nicht.', tr: 'Familienname mi? Bunu anlamıyorum.' },
    { who: 'nora', de: 'Familienname bedeutet: Wie ist Ihr Nachname?', tr: 'Familienname şu demek: Soyadınız ne?' },
    { who: 'rami', de: 'Ah, Khalil.', tr: 'Ah, Khalil.' },
    { who: 'nora', de: 'Wie bitte? Wie schreibt man das?', tr: 'Efendim? Nasıl yazılır?' },
    { who: 'rami', de: 'K-H-A-L-I-L.', tr: 'Ka-Ha-A-El-İ-El.', say: exports.khalilSpelled + '.' },
    { who: 'nora', de: 'Danke. Alles klar!', tr: 'Teşekkürler. Tamam!' },
];
/** The mime game (the book's game: two people act, the others guess with ihr). */
exports.mimePhrases = [['Ihr sprecht.', 'Siz konuşuyorsunuz.'], ['Nein, ihr singt!', 'Hayır, siz şarkı söylüyorsunuz!'], ['Richtig!', 'Doğru!']];
/* ---------- exercises ---------- */
/** Exercise 1 · Rami's first day (heard; the text stays hidden until the learner shows it), then richtig or falsch. */
exports.firstDay = [
    { who: 'nora', de: 'Guten Tag! Sie sind neu beim Altenpflege-Service Sonnenblick?', tr: 'İyi günler! Sonnenblick yaşlı bakım servisinde yeni misiniz?' },
    { who: 'rami', de: 'Ja, guten Tag. Ich bin Rami Khalil. Ich bin Altenpfleger.', tr: 'Evet, iyi günler. Ben Rami Khalil. Yaşlı bakıcısıyım.' },
    { who: 'nora', de: 'Herzlich willkommen! Ich bin Nora Weiß. Ich bin Krankenpflegerin, ich arbeite auch hier.', tr: 'Hoş geldiniz! Ben Nora Weiß. Hemşireyim, ben de burada çalışıyorum.' },
    { who: 'rami', de: 'Danke. Ich spreche nur ein bisschen Deutsch.', tr: 'Teşekkürler. Sadece biraz Almanca konuşuyorum.' },
    { who: 'nora', de: 'Kein Problem. Hier ist das Personalformular. Ich helfe gern.', tr: 'Sorun değil. İşte personel formu. Seve seve yardım ederim.' },
    { who: 'rami', de: 'Personalformular – was bedeutet das?', tr: 'Personel formu – bu ne demek?' },
    { who: 'nora', de: 'Das Formular für die Arbeit: Name, Adresse, Telefonnummer.', tr: 'İş için form: ad, adres, telefon numarası.' },
];
/** [statement, right answer, what is read after the answer (the right answer), the explanation shown after it] */
exports.firstDayRows = [
    ['Rami ist neu beim Altenpflege-Service.', 'Richtig', 'Richtig!', 'Rami servise yeni başlıyor.'],
    ['Frau Weiß arbeitet auch als Altenpflegerin.', 'Falsch', 'Falsch. Sie ist Krankenpflegerin.', 'Nora Weiß hemşire (Krankenpflegerin).'],
    ['Herr Khalil spricht nur ein bisschen Deutsch.', 'Richtig', 'Richtig!', '„Ich spreche nur ein bisschen Deutsch.“'],
    ['Frau Weiß braucht Hilfe.', 'Falsch', 'Falsch. Rami braucht Hilfe.', 'Yardıma ihtiyacı olan Rami; Nora „Ich helfe gern.“ diyor.'],
];
/** Exercise 2 · Nora asks, Rami answers (heard), the learner fills in the form. */
exports.formTalk = [
    { text: 'Also, Familienname?', who: 'nora' }, { text: 'Khalil. ' + exports.khalilSpelled + '.', who: 'rami' },
    { text: 'Vorname?', who: 'nora' }, { text: 'Rami.', who: 'rami' },
    { text: 'Wohnort?', who: 'nora' }, { text: 'Berlin.', who: 'rami' },
    { text: 'Postleitzahl?', who: 'nora' }, { text: (0, berufe_c_course_1.digitWords)('10435') + '.', who: 'rami' },
    { text: 'Straße und Hausnummer?', who: 'nora' }, { text: 'Kastanienallee fünfundzwanzig.', who: 'rami' },
    { text: 'Beruf?', who: 'nora' }, { text: 'Altenpfleger.', who: 'rami' },
    { text: 'Und die Telefonnummer?', who: 'nora' }, { text: (0, berufe_c_course_1.digitWords)('0157 2345 678') + '.', who: 'rami' },
    { text: 'Danke, alles klar!', who: 'nora' },
];
exports.formFields = [
    { label: 'Familienname', answer: 'Khalil', options: ['Khalil', 'Kamau', 'Nowak'] },
    { label: 'Vorname', answer: 'Rami', options: ['Rami', 'Omar', 'Nikos'] },
    { label: 'Wohnort', answer: 'Berlin', options: ['Berlin', 'Hamburg', 'Beirut'] },
    { label: 'PLZ', answer: '10435', digits: true, say: 'Die Postleitzahl ist ' + (0, berufe_c_course_1.digitWords)('10435') + '.' },
    { label: 'Straße und Hausnummer', answer: 'Kastanienallee 25', say: 'Kastanienallee fünfundzwanzig.' },
    { label: 'Beruf', answer: 'Altenpfleger', options: ['Altenpfleger', 'Krankenpfleger', 'Kellner'] },
    { label: 'Telefonnummer', answer: '0157 2345 678', digits: true, say: 'Die Telefonnummer ist ' + (0, berufe_c_course_1.digitWords)('0157 2345 678') + '.' },
];
exports.tableVerbs = [
    { verb: 'schreiben', forms: ['schreibe', 'schreibst', 'schreibt', 'schreiben', 'schreibt', 'schreiben'], given: [] },
    { verb: 'sprechen', forms: ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'], given: [0, 3, 5] },
    { verb: 'sein', forms: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], given: [0, 2] },
];
/** The gaps in reading order (row by row: ich, du, er / sie …), each with what is read when it is right. */
exports.tableCells = exports.personNames.flatMap((person, row) => exports.tableVerbs.flatMap((verb, col) => verb.given.includes(row) ? [] : [{ row, col, answer: verb.forms[row], say: `${person} ${verb.forms[row]}` }]));
/** Exercise 4 · the mime game: what the two people do, the right guess and the options. */
exports.mimeRows = [
    ['💃🕺', 'Ihr tanzt.', ['Ihr tanzt.', 'Ihr singt.', 'Ihr trinkt.'], 'dans ediyorlar'],
    ['🎤🎶', 'Ihr singt.', ['Ihr singt.', 'Ihr sprecht.', 'Ihr schreibt.'], 'şarkı söylüyorlar'],
    ['☕🧋', 'Ihr trinkt.', ['Ihr trinkt.', 'Ihr tanzt.', 'Ihr studiert.'], 'bir şey içiyorlar'],
    ['✍️📝', 'Ihr schreibt.', ['Ihr schreibt.', 'Ihr repariert.', 'Ihr singt.'], 'yazıyorlar'],
    ['🔧🚗', 'Ihr repariert.', ['Ihr repariert.', 'Ihr trinkt.', 'Ihr sprecht.'], 'araba tamir ediyorlar'],
    ['📚🎓', 'Ihr studiert.', ['Ihr studiert.', 'Ihr schreibt.', 'Ihr tanzt.'], 'üniversitede okuyorlar'],
    ['🗣️💬', 'Ihr sprecht.', ['Ihr sprecht.', 'Ihr singt.', 'Ihr repariert.'], 'konuşuyorlar'],
];
/** Exercise 5 · build the long word from its syllables (the goal in Turkish). */
exports.syllableOrder = [['Kran', 'ken', 'pfle', 'ge', 'rin'], ['Te', 'le', 'fon', 'num', 'mer'], ['Post', 'leit', 'zahl'], ['Fa', 'mi', 'li', 'en', 'na', 'me'], ['buch', 'sta', 'bie', 'ren'], ['Haus', 'num', 'mer']];
exports.syllableMeanings = ['hemşire (kadın)', 'telefon numarası', 'posta kodu', 'soyadı', 'harf harf söylemek', 'kapı numarası'];
/** Exercise 6 · the learner's own Personalformular: stays on this device only (lib/lesson-sync.ts never sends it). */
exports.L2D_FORM_KEY = 'lernkoko-l2d-form';
exports.ownFields = [
    { key: 'vor', label: 'Vorname' }, { key: 'nach', label: 'Familienname' }, { key: 'str', label: 'Straße und Hausnummer' }, { key: 'plz', label: 'PLZ', numeric: true },
    { key: 'ort', label: 'Wohnort' }, { key: 'beruf', label: 'Beruf' }, { key: 'tel', label: 'Telefonnummer', numeric: true },
];
/** A field is filled in: PLZ five digits, a phone number at least eight digits, anything else two letters or more. */
const ownFieldOk = (field, value) => { const v = value.trim(); if (field.key === 'plz')
    return /^\d{5}$/.test(v); if (field.key === 'tel')
    return v.replace(/\D/g, '').length >= 8; return v.length >= 2; };
exports.ownFieldOk = ownFieldOk;
/* ---------- Alles klar? (the points test of Lektion 2) ---------- */
/** 1 Wortschatz: the five words of the box into Mei and Tomasz's dialogue. */
exports.vocabBoxD = ['Formular', 'Problem', 'Nachname', 'Hilfe', 'Beruf'];
const vocabGap = (answer) => ({ options: exports.vocabBoxD, answer });
const said = (line) => line.parts.map(part => typeof part === 'string' ? part : part.answer).join('');
const withSay = (line) => ({ ...line, say: { text: said(line), who: line.who } });
exports.vocabLinesD = [
    { key: 'w1', who: 'mei', parts: ['Entschuldigung, ich brauche ', vocabGap('Hilfe'), '.'] },
    { key: 'w2', who: 'tomasz', parts: ['Ja? Was ist das ', vocabGap('Problem'), '?'] },
    { key: 'w3', who: 'mei', parts: ['Das ', vocabGap('Formular'), '. Ich verstehe das nicht.'] },
    { key: 'w4', who: 'tomasz', parts: ['Ich helfe gerne. Wie ist dein ', vocabGap('Nachname'), '?'] },
    { key: 'w5', who: 'mei', parts: ['Suwan. Mei Suwan.'] },
    { key: 'w6', who: 'tomasz', parts: ['Und was bist du von ', vocabGap('Beruf'), '?'] },
    { key: 'w7', who: 'mei', parts: ['Ich bin Ingenieurin.'] },
].map(withSay);
/** 2 Grammatik: Yasemin (a) and Sabine (b); the verb in brackets. Ten gaps, half a point each. */
exports.grammarLinesD = [
    { who: 'a', text: 'Ich ___ Yasemin. (sein)', answers: [['bin']] },
    { who: 'b', text: 'Hallo, Yasemin. Wie ___ dein Nachname? (sein)', answers: [['ist']] },
    { who: 'a', text: 'Was ___ du beruflich? (machen)', answers: [['machst']] },
    { who: 'b', text: 'Ich ___ als Verkäuferin. (arbeiten)', answers: [['arbeite']] },
    { who: 'a', text: 'Entschuldigung, ich ___ das nicht. (verstehen)', answers: [['verstehe']] },
    { who: 'b', text: 'Ich ___ gern. (helfen)', answers: [['helfe']] },
    { who: 'a', text: 'Wir ___ in Berlin. Und du? (wohnen)', answers: [['wohnen']] },
    { who: 'b', text: 'Ich ___ auch in Berlin! (wohnen)', answers: [['wohne']] },
    { who: 'a', text: 'Woher ___ ihr, Omar und du? (kommen)', answers: [['kommt']] },
    { who: 'b', text: 'Wir ___ aus dem Sudan und aus Hamburg. (kommen)', answers: [['kommen']] },
];
exports.grammarSpeakersD = { a: 'yasemin', b: 'sabine' };
exports.grammarSayD = exports.grammarLinesD.map(line => line.text.replace(/ \([^)]*\)$/, '').replace('___', line.answers[0][0]));
/** 3 Kommunikation: the answer is given; build the question with ihr. */
exports.talkQuestionsD = [['Wer', 'seid', 'ihr?'], ['Woher', 'kommt', 'ihr?'], ['Wo', 'wohnt', 'ihr?'], ['Welche', 'Sprachen', 'sprecht', 'ihr?'], ['Was', 'seid', 'ihr', 'von', 'Beruf?']];
exports.talkAnswersD = ['Ich bin Nikos und das ist Omar.', 'Wir kommen aus Griechenland und aus dem Sudan.', 'Wir wohnen in Berlin.', 'Wir sprechen Griechisch, Arabisch und Deutsch.', 'Nikos ist Mechatroniker. Ich bin Friseur.'];
/** Prüfung: Schreiben Teil 1 — a text about Tomasz and a form (Start Deutsch A1 / telc A1). */
exports.tomaszExam = 'Das ist Tomasz Nowak. Er kommt aus Polen. Tomasz ist Kellner von Beruf. Er spricht Polnisch und Deutsch und er lernt jetzt auch Englisch. Tomasz ist schon lange in Deutschland. Er wohnt in der Finowstraße 21, in 22765 Hamburg.';
exports.tomaszExamSay = 'Das ist Tomasz Nowak. Er kommt aus Polen. Tomasz ist Kellner von Beruf. Er spricht Polnisch und Deutsch und er lernt jetzt auch Englisch. Tomasz ist schon lange in Deutschland. Er wohnt in der Finowstraße einundzwanzig, in ' + (0, berufe_c_course_1.digitWords)('22765') + ' Hamburg.';
exports.examFormD = [
    { text: 'Heimatland: ___', answers: [['Polen']] },
    { text: 'Straße, Hausnummer: ___', answers: [['Finowstraße 21']] },
    { text: 'PLZ, Ort: ___', answers: [['22765 Hamburg']] },
    { text: 'Beruf: ___', answers: [['Kellner']] },
    { text: 'Sprachen: ___', answers: [['Polnisch, Deutsch', 'Polnisch und Deutsch', 'Polnisch, Deutsch, Englisch', 'Polnisch, Deutsch und Englisch', 'Polnisch, Deutsch und ein bisschen Englisch', 'Deutsch, Polnisch', 'Deutsch und Polnisch', 'Deutsch, Polnisch, Englisch', 'Deutsch, Polnisch und Englisch']] },
];
const q = (question, options, say) => [question, options, options[0], say];
exports.berufeTestD = [
    q('Ihr ___ Deutsch. (lernen)', ['lernt', 'lernen', 'lernst'], 'Ihr lernt Deutsch.'),
    q('Wir ___ neu hier. (sein)', ['sind', 'seid', 'bin'], 'Wir sind neu hier.'),
    q('Ihr ___ Arabisch? (sprechen)', ['sprecht', 'spricht', 'sprechen'], 'Ihr sprecht Arabisch?'),
    q('Du ___ als Kellner. (arbeiten)', ['arbeitest', 'arbeitet', 'arbeiten'], 'Du arbeitest als Kellner.'),
    q('„Familienname“ = ?', ['Nachname', 'Vorname', 'Wohnort'], 'Nachname'),
    q('„Wohnort“ = ?', ['Ort', 'Straße', 'Land'], 'Ort'),
    q('Adını duyamadın. Ne dersin?', ['Wie bitte?', 'Alles klar!', 'Richtig!'], 'Wie bitte?'),
    q('„Wie schreibt man das?“', ['Bu nasıl yazılır?', 'Bu ne demek?', 'Bu nerede?'], ''),
    q('Ich spreche ___ ein bisschen Deutsch.', ['nur', 'neu', 'nicht'], 'Ich spreche nur ein bisschen Deutsch.'),
    q('Kran-ken-pfle-ge-rin: kaç hece?', ['5', '4', '6'], ''),
    q('Pantomim: iki kişi dans ediyor. Tahmin:', ['Ihr tanzt!', 'Ihr singt!', 'Wir tanzen!'], 'Ihr tanzt!'),
    q('„Alles klar?“ – cevap:', ['Ja, alles klar!', 'Nein, ich bin Koch.', 'Wie bitte, danke.'], 'Ja, alles klar!'),
];
/** The sections of "Alles klar?" with their points (like the book: under half the points → "Bitte noch üben!"). */
exports.checkSectionsD = [
    { id: 'wortschatz', label: '1 Wortschatz', points: 5 }, { id: 'grammatik', label: '2 Grammatik', points: 5 }, { id: 'kommunikation', label: '3 Kommunikation', points: 5 },
    { id: 'schreiben', label: '4 Prüfung: Schreiben', points: 5 }, { id: 'test', label: '5 Test', points: 12 },
];
exports.checkPointsD = exports.checkSectionsD.reduce((n, section) => n + section.points, 0);
exports.examTalk = [
    { key: 'name', question: 'Name?', rami: 'Ich heiße Rami Khalil.' },
    { key: 'land', question: 'Land?', rami: 'Ich komme aus dem Libanon, aus Beirut.' },
    { key: 'wohnort', question: 'Wohnort?', rami: 'Ich wohne in Berlin.' },
    { key: 'sprachen', question: 'Sprachen?', rami: 'Ich spreche Arabisch, Französisch und ein bisschen Deutsch.' },
    { key: 'beruf', question: 'Beruf?', rami: 'Ich bin Altenpfleger von Beruf.' },
];
/* ---------- steps ---------- */
exports.berufeStepsD = [
    { id: 'kapak', title: 'Kapak', kind: 'cover' },
    { id: 'kelimeler', title: 'Kelimeler: liste', kind: 'teach' },
    { id: 'kontrol', title: 'Kelime kontrolü', kind: 'teach' },
    { id: 'fiil-tablo', title: 'Bütün fiil tablosu', kind: 'teach' },
    { id: 'personalformular', title: 'Personalformular', kind: 'teach' },
    { id: 'uzun-kelimeler', title: 'Uzun kelimeler', kind: 'teach' },
    { id: 'wie-bitte', title: 'Wie bitte? ve oyun', kind: 'teach' },
    { id: 'hoeren', title: 'Alıştırma 1', kind: 'exercise' },
    { id: 'form-dinle', title: 'Alıştırma 2', kind: 'exercise' },
    { id: 'fiil-yaz', title: 'Alıştırma 3', kind: 'exercise' },
    { id: 'pantomim', title: 'Alıştırma 4', kind: 'exercise' },
    { id: 'heceler', title: 'Alıştırma 5', kind: 'exercise' },
    { id: 'dein-formular', title: 'Alıştırma 6', kind: 'exercise' },
    { id: 'wortschatz', title: 'Alles klar? 1', kind: 'exercise' },
    { id: 'grammatik', title: 'Alles klar? 2', kind: 'exercise' },
    { id: 'kommunikation', title: 'Alles klar? 3', kind: 'exercise' },
    { id: 'schreiben', title: 'Alles klar? 4', kind: 'exercise' },
    { id: 'test', title: 'Alles klar? 5', kind: 'test' },
    { id: 'puanlar', title: 'Puanların', kind: 'end' },
    { id: 'konus', title: 'Konuş', kind: 'speak' },
    { id: 'bitti', title: 'Bitti', kind: 'end' },
];
const berufeStepIndexD = (id) => exports.berufeStepsD.findIndex(step => step.id === id);
exports.berufeStepIndexD = berufeStepIndexD;
exports.berufeStepShortD = { 'hoeren': 'Hören', 'form-dinle': 'Formu doldur', 'fiil-yaz': 'Fiil tablosu', 'pantomim': 'Pantomim', 'heceler': 'Heceler', 'dein-formular': 'Senin formun', 'wortschatz': 'Wortschatz', 'grammatik': 'Grammatik', 'kommunikation': 'Kommunikation', 'schreiben': 'Schreiben', 'test': 'Test', 'puanlar': 'Puanların' };
const choiceCount = (lines) => lines.reduce((n, line) => n + line.parts.filter(part => typeof part !== 'string').length, 0);
/** Every exercise is scored; the "Alles klar?" sections by their points. */
exports.berufeScoredD = [
    { id: 'hoeren', total: exports.firstDayRows.length },
    { id: 'form-dinle', total: exports.formFields.length },
    { id: 'fiil-yaz', total: exports.tableCells.length },
    { id: 'pantomim', total: exports.mimeRows.length },
    { id: 'heceler', total: exports.syllableOrder.length },
    { id: 'dein-formular', total: exports.ownFields.length },
    { id: 'wortschatz', total: choiceCount(exports.vocabLinesD) },
    { id: 'grammatik', total: 5 },
    { id: 'kommunikation', total: exports.talkQuestionsD.length },
    { id: 'schreiben', total: exports.examFormD.length },
    { id: 'test', total: exports.berufeTestD.length },
];
exports.berufeGroupsD = [
    { id: 'konu', label: 'Konu anlatımı', ids: exports.berufeStepsD.filter(step => step.kind === 'teach').map(step => step.id) },
    { id: 'alistirmalar', label: 'Alıştırmalar', ids: ['hoeren', 'form-dinle', 'fiil-yaz', 'pantomim', 'heceler', 'dein-formular'] },
    { id: 'test', label: 'Alles klar?', ids: ['wortschatz', 'grammatik', 'kommunikation', 'schreiben', 'test', 'puanlar'] },
    { id: 'konus', label: 'Konuş', ids: ['konus'] },
];
exports.berufeWordCountD = exports.wordsD.length;
/** Every German text Teil D speaks (rendered as site voices by scripts/voices). */
function berufeDSpeechTexts() {
    const out = new Set();
    const add = (text) => { const clean = (text ?? '').trim(); if (clean)
        out.add(clean); };
    const say = (item) => { if (item)
        add(typeof item === 'string' ? item : item.text); };
    exports.wordsD.forEach(row => add((0, exports.wordSayD)(row)));
    exports.phrasesD.forEach(([, , text]) => add(text));
    for (const item of [...exports.wordChecksD, ...exports.verbChecksD, ...exports.formChecksD, ...exports.longChecks])
        add(item.say);
    exports.regularVerbsD.forEach((_, i) => add((0, exports.conjugationSay)((0, exports.regularFormsD)(i))));
    exports.specialVerbsD.forEach(([, forms]) => add((0, exports.conjugationSay)(forms)));
    exports.ramiSentences.forEach(([, , text]) => add(text));
    exports.syllableWords.forEach(row => add((0, exports.syllableSay)(row)));
    exports.pardonPhrases.forEach(([, , text]) => add(text));
    exports.mimePhrases.forEach(([de]) => add(de));
    for (const line of [...exports.noraRami, ...exports.firstDay])
        add(line.say ?? line.de);
    exports.firstDayRows.forEach(([, , text]) => add(text));
    exports.formTalk.forEach(say);
    exports.formFields.forEach(field => add(field.say));
    exports.tableCells.forEach(cell => add(cell.say));
    exports.mimeRows.forEach(([, answer]) => add(answer));
    exports.syllableOrder.forEach(parts => add(parts.join('')));
    exports.vocabLinesD.forEach(line => say(line.say));
    exports.grammarSayD.forEach(add);
    exports.talkQuestionsD.forEach(words => add(words.join(' ')));
    add(exports.tomaszExamSay);
    exports.berufeTestD.forEach(question => add(question[3]));
    exports.examTalk.forEach(item => { add(item.question); add(item.rami); });
    ['sehr gut', 'gut', 'nicht so gut', 'Ich buchstabiere'].forEach(add);
    return [...out];
}
