"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.achIchRows = exports.hearItems = exports.esGibtSay = exports.esGibtRows = exports.ramiSay = exports.ramiLines = exports.ramiBox = exports.boardLines = exports.boardFloors = exports.floorLines = exports.wohinLines = exports.places = exports.buildSay = exports.joinParts = exports.buildWords = exports.matchPictures = exports.lineText = exports.lineGaps = exports.schoolDialogue = exports.officeDialogue = exports.schoolBoard = exports.officeBoard = exports.longWordSay = exports.longWords = exports.ichWords = exports.achWords = exports.askWhere = exports.esGibtDialogue = exports.esGibtRule = exports.checkDialogue = exports.upDown = exports.instructions = exports.tasks = exports.mustForms = exports.needDialogue = exports.floorSynonyms = exports.floorRule = exports.roofSay = exports.houseFloors = exports.articleOf = exports.directionSay = exports.directionWords = exports.officeVerbs = exports.officeWords = exports.buildingWords = exports.personName = exports.castA = exports.stadtPictures = exports.STADT_UNIT = exports.STADT_PATH = void 0;
exports.stadtGoals = exports.stadtParts = exports.wordCountA = exports.stepGroupsA = exports.scoredExercisesA = exports.stepShortA = exports.stepIndexA = exports.stepsA = exports.summaryLines = exports.isTurkishText = exports.testQuestionsA = exports.roleQuestions = exports.orderMeanings = exports.orderSay = exports.orderSentences = void 0;
exports.stadtSpeechTexts = stadtSpeechTexts;
/**
 * Lektion 15 „Wege in der Stadt“ (A1.2), Teil A – Gehen Sie die Treppe hoch. (the learner's lesson page, an artifact
 * of 30 October 2026), ported to the site like Lektion 1 (lib/willkommen-course.ts): the cover, ten short teaching
 * steps (words, floors, zum/zur, directions, es gibt, Ach-/Ich-Laut, two dialogues), eleven exercises, a 14-question
 * test and the summary. Texts for the learner are Turkish; the German is read with the site voices, each person with
 * their own voice (`speakers` in lib/willkommen-course.ts). Step ids never change: saved scores are keyed by them.
 */
const talk_switch_1 = require("./talk-switch");
const unit_goals_1 = require("./unit-goals");
exports.STADT_PATH = '/a1-2/wege-in-der-stadt';
exports.STADT_UNIT = 'book-15';
/** Pictures of Teil A (public/toon/lektion15, from the learner's page; transparent WebP, every scene its own picture).
 * The picture with Rami is mirrored on purpose: the lift stands on the left, as in the dialogue. */
exports.stadtPictures = {
    cover: { src: '/toon/lektion15/kapak-a.webp', width: 960, height: 540 },
    building: { src: '/toon/lektion15/bina.webp', width: 960, height: 640 },
    office: { src: '/toon/lektion15/buergeramt.webp', width: 960, height: 640 },
    school: { src: '/toon/lektion15/dil-okulu.webp', width: 960, height: 640 },
    rami: { src: '/toon/lektion15/rami-asansor.webp', width: 960, height: 640 },
};
/** The people of Teil A (portraits and voices of the site: public/toon/lektion1/<key>.webp, `speakers`). */
exports.castA = ['yasemin', 'omar', 'mei', 'sabine', 'rami', 'paul'];
const personName = (key) => key === 'paul' ? 'Paul Hoca' : key[0].toUpperCase() + key.slice(1);
exports.personName = personName;
/** Step 1 · Im Gebäude */
exports.buildingWords = [
    { emoji: '🪜', de: 'die Treppe', plural: 'die Treppen', tr: 'merdiven', example: 'Gehen Sie die Treppe hoch.' },
    { emoji: '🛗', de: 'der Aufzug', plural: 'die Aufzüge', tr: 'asansör (= der Lift, der Fahrstuhl)', example: 'Benutzen Sie den Aufzug.' },
    { emoji: '🚪', de: 'der Eingang', plural: 'die Eingänge', tr: 'giriş', example: 'Ich bin am Eingang.' },
    { emoji: '🧑‍💼', de: 'der Schalter', plural: 'die Schalter', tr: 'gişe' },
    { emoji: 'ℹ️', de: 'die Information', plural: 'die Informationen', tr: 'danışma, bilgi masası' },
    { emoji: '📝', de: 'die Anmeldung', plural: 'die Anmeldungen', tr: 'kayıt; kayıt masası' },
    { emoji: '🪑', de: 'das Wartezimmer', plural: 'die Wartezimmer', tr: 'bekleme odası', example: 'Da ist das Wartezimmer.' },
    { emoji: '🚻', de: 'die Toilette', plural: 'die Toiletten', tr: 'tuvalet' },
    { emoji: '🗂️', de: 'das Sekretariat', plural: 'die Sekretariate', tr: 'sekreterlik' },
    { emoji: '🏫', de: 'der Kursraum', plural: 'die Kursräume', tr: 'derslik, kurs sınıfı' },
    { emoji: '🍽️', de: 'die Kantine', plural: 'die Kantinen', tr: 'yemekhane' },
    { emoji: '📅', de: 'der Termin', plural: 'die Termine', tr: 'randevu', example: 'Haben Sie einen Termin?' },
    { emoji: '🔢', de: 'die Nummer', plural: 'die Nummern', tr: 'numara', example: 'Wie ist die Nummer?' },
];
/** Step 2 · Im Amt */
exports.officeWords = [
    { emoji: '🏛️', de: 'das Bürgerbüro', plural: 'die Bürgerbüros', tr: 'vatandaşlık hizmetleri bürosu (kimlik, ikamet kaydı)' },
    { emoji: '🌍', de: 'die Ausländerbehörde', tr: 'yabancılar dairesi (vize, oturma izni)' },
    { emoji: '🚗', de: 'die Führerscheinstelle', plural: 'die Führerscheinstellen', tr: 'ehliyet dairesi' },
    { emoji: '💳', de: 'der Kassenautomat', plural: 'die Kassenautomaten', tr: 'ödeme otomatı' },
    { emoji: '📸', de: 'der Fotoautomat', plural: 'die Fotoautomaten', tr: 'fotoğraf otomatı' },
    { emoji: '🪪', de: 'der Ausweis', plural: 'die Ausweise', tr: 'kimlik kartı' },
    { emoji: '🚘', de: 'der Führerschein', plural: 'die Führerscheine', tr: 'ehliyet' },
    { emoji: '📄', de: 'die Aufenthaltserlaubnis', tr: 'oturma izni' },
    { emoji: '🛂', de: 'das Visum', plural: 'die Visa', tr: 'vize' },
    { emoji: '📋', de: 'das Formular', plural: 'die Formulare', tr: 'form, başvuru kâğıdı' },
    { emoji: '🏠', de: 'die Wohnung', plural: 'die Wohnungen', tr: 'daire, ev' },
];
/** Step 2 · verbs for the offices (the example is read). */
exports.officeVerbs = [
    ['abholen', '(gidip) teslim almak', 'Ich hole meinen Ausweis ab.'],
    ['anmelden', 'kaydını yaptırmak', 'Ich möchte meine Wohnung anmelden.'],
    ['abmelden', 'kaydını sildirmek', 'Tomasz meldet seine Wohnung ab.'],
    ['beantragen', 'başvurmak', 'Ich möchte ein Visum beantragen.'],
    ['bezahlen', 'ödemek', 'Hier können Sie bezahlen.'],
    ['verlängern', 'süresini uzatmak', 'Rami möchte sein Visum verlängern.'],
    ['benutzen', 'kullanmak', 'Benutzen Sie den Aufzug.'],
    ['hochgehen', 'yukarı çıkmak', 'Gehen Sie die Treppe hoch.'],
    ['warten', 'beklemek', 'Warten Sie bitte im Wartezimmer.'],
    ['ein Foto machen', 'fotoğraf çektirmek', 'Wo kann ich ein Foto machen?'],
];
/** Step 3 · Wo? Wohin? (the example is read, or the word when there is none). */
exports.directionWords = [
    ['⬆️', 'oben', 'yukarıda', 'Das Bürgerbüro ist oben.'],
    ['⬇️', 'unten', 'aşağıda', 'Die Toiletten sind unten.'],
    ['⬅️', 'links / nach links', 'solda / sola', 'Gehen Sie nach links.'],
    ['➡️', 'rechts / nach rechts', 'sağda / sağa', 'Die Treppe ist hier rechts.'],
    ['📍', 'hier', 'burada', 'Gibt es hier eine Toilette?'],
    ['👉', 'da / dort', 'orada', 'Da ist das Wartezimmer.'],
    ['🎯', 'bis zum dritten Stock', 'üçüncü kata kadar', 'Die Treppe hoch bis zum dritten Stock.'],
    ['✔️', 'genau', 'aynen, tam öyle', 'Ja, genau!'],
    ['🔁', 'also', 'yani, demek ki', 'Also, im zweiten Stock nach rechts.'],
    ['🙋', 'Entschuldigung!', 'Affedersiniz!', 'Entschuldigung, können Sie mir bitte helfen?'],
    ['🔜', 'Der Nächste, bitte!', 'Sıradaki, lütfen!', ''],
];
const directionSay = (row) => row[3] || row[1];
exports.directionSay = directionSay;
/** The article of a word ("der Aufzug" → der), for its colour. */
const articleOf = (de) => { const first = de.split(' ')[0]; return first === 'der' || first === 'die' || first === 'das' ? first : undefined; };
exports.articleOf = articleOf;
/* ---------- teaching steps ---------- */
/** Step 4 · the floors of a house, top to bottom (tap one to hear it). */
exports.houseFloors = [
    ['5. OG', 'im fünften Stock'], ['4. OG', 'im vierten Stock'], ['3. OG', 'im dritten Stock'], ['2. OG', 'im zweiten Stock'],
    ['1. OG', 'im ersten Stock'], ['EG', 'im Erdgeschoss'], ['UG', 'im Keller'],
];
exports.roofSay = 'auf dem Dach';
exports.floorRule = [
    ['1.', 'im ersten Stock', true], ['2.', 'im zweiten Stock', false], ['3.', 'im dritten Stock', true], ['4.', 'im vierten Stock', false], ['5.', 'im fünften Stock', false],
];
exports.floorSynonyms = ['im ersten Stock', 'im ersten Stockwerk', 'im ersten Obergeschoss (1. OG)', 'in der ersten Etage'];
/** Step 5 · zum / zur: a small dialogue, müssen, zu + article and which office for which task. */
exports.needDialogue = [
    { who: 'yasemin', de: 'Ich möchte meine Wohnung anmelden.', tr: 'Evimin kaydını yaptırmak istiyorum.' },
    { who: 'omar', de: 'Dann müssen Sie zum Bürgerbüro gehen.', tr: 'O zaman Bürgerbüro’ya gitmeniz gerekiyor.' },
];
exports.mustForms = [['ich', 'muss'], ['du', 'musst'], ['er / sie', 'muss'], ['wir / Sie', 'müssen']];
exports.tasks = [
    ['einen Ausweis abholen', 'kimlik almak', 'zum Bürgerbüro'],
    ['eine Wohnung anmelden / abmelden', 'ev kaydı yaptırmak / sildirmek', 'zum Bürgerbüro'],
    ['eine Aufenthaltserlaubnis beantragen', 'oturma izni başvurusu', 'zur Ausländerbehörde'],
    ['ein Visum verlängern', 'vize uzatmak', 'zur Ausländerbehörde'],
    ['einen EU-Führerschein beantragen', 'AB ehliyetine başvurmak', 'zur Führerscheinstelle'],
    ['ein Formular abholen', 'form almak', 'zur Information'],
    ['bezahlen', 'ödemek', 'zu den Kassenautomaten'],
    ['ein Foto machen', 'fotoğraf çektirmek', 'zu den Fotoautomaten'],
];
/** Step 6 · polite instructions (read by Omar, who works at the information desk). */
exports.instructions = [
    ['Gehen Sie die Treppe hoch.', 'Merdivenden yukarı çıkın.'],
    ['Benutzen Sie den Aufzug.', 'Asansörü kullanın.'],
    ['Im dritten Stock gehen Sie nach rechts.', 'Üçüncü katta sağa gidin.'],
    ['Warten Sie bitte im Wartezimmer.', 'Lütfen bekleme odasında bekleyin.'],
];
exports.upDown = [
    ['Das Bürgerbüro ist oben im zweiten Stock.', 'Bürgerbüro yukarıda, ikinci katta.'],
    ['Die Toiletten sind unten im Erdgeschoss.', 'Tuvaletler aşağıda, zemin katta.'],
];
exports.checkDialogue = [
    { who: 'yasemin', de: 'Also: die Treppe hoch bis zum zweiten Stock und dann nach links?', tr: 'Yani: ikinci kata kadar merdivenden yukarı, sonra sola mı?' },
    { who: 'omar', de: 'Ja, genau!', tr: 'Evet, aynen!' },
];
/** Step 7 · es gibt + Akkusativ */
exports.esGibtRule = [
    ['der', 'einen', 'Gibt es hier einen Aufzug?'], ['die', 'eine', 'Gibt es hier eine Toilette?'], ['das', 'ein', 'Gibt es hier ein Café?'], ['', 'artikel yok', 'Es gibt hier Toiletten.'],
];
exports.esGibtDialogue = [
    { who: 'mei', de: 'Gibt es hier einen Aufzug?', tr: 'Burada asansör var mı?' },
    { who: 'sabine', de: 'Ja, es gibt einen Aufzug, hier links.', tr: 'Evet, asansör var, burada solda.' },
];
exports.askWhere = [
    ['Wo ist die Toilette?', 'Tuvalet olduğunu biliyorsun, yerini soruyorsun.'],
    ['Gibt es hier eine Toilette?', 'Tuvalet var mı, bilmiyorsun.'],
    ['Wo gibt es hier einen Kaffee?', 'Burada nerede … var? (kahve nerede bulunur?)'],
];
/** Step 8 · Ach-Laut and Ich-Laut (side by side), and long words: the stress on the first part. */
exports.achWords = ['nach', 'noch', 'auch', 'das Buch', 'kochen', 'acht', 'machen', 'die Sprache'];
exports.ichWords = ['ich', 'nicht', 'rechts', 'die Bücher', 'sprechen', 'möchte', 'gleich', 'manchmal'];
exports.longWords = [
    ['die', 'Auf', 'enthaltserlaubnis', 'die Erlaubnis'], ['die', 'Aus', 'länderbehörde', 'die Behörde'], ['das', 'Bür', 'gerbüro', 'das Büro'], ['die', 'Füh', 'rerscheinstelle', 'die Stelle'],
];
const longWordSay = (row) => row[0] + ' ' + row[1] + row[2];
exports.longWordSay = longWordSay;
exports.officeBoard = { title: 'Bürgeramt Lindenplatz', rows: [
        ['3', ['Kantine'], ['Ausländerbehörde', 'Wartezimmer'], 'OG'], ['2', ['Bürgerbüro'], ['Wartezimmer'], 'OG'], ['1', ['Kassenautomaten'], ['Führerscheinstelle'], 'OG'], ['0', ['Information', 'Aufzug'], ['Toiletten', 'Fotoautomaten'], 'EG'],
    ] };
exports.schoolBoard = { title: 'Goliqo Sprachschule', rows: [
        ['3', ['Computerraum'], ['Bibliothek']], ['2', ['Lehrerzimmer'], ['Kursräume 201–204']], ['1', ['Kursräume 105–108'], ['Kursräume 101–104']], ['0', ['Sprachcafé', 'Aufzug'], ['Sekretariat', 'Toiletten']],
    ], foot: '↓ Ein- und Ausgang (giriş ve çıkış)' };
/** Step 9 · at the information desk of the Bürgeramt (Omar works there, Yasemin is new in Berlin). */
exports.officeDialogue = [
    { who: 'omar', de: 'Guten Morgen! Kann ich Ihnen helfen?', tr: 'Günaydın! Size yardımcı olabilir miyim?' },
    { who: 'yasemin', de: 'Guten Morgen! Ja, bitte. Ich bin neu in Berlin und ich möchte meine Wohnung anmelden.', tr: 'Günaydın! Evet, lütfen. Berlin’de yeniyim ve evimin kaydını yaptırmak istiyorum.' },
    { who: 'omar', de: 'Dann müssen Sie zum Bürgerbüro gehen. Das ist oben im zweiten Stock.', tr: 'O zaman Bürgerbüro’ya gitmeniz gerekiyor. Yukarıda, ikinci katta.' },
    { who: 'yasemin', de: 'Im zweiten Stock? Gibt es hier einen Aufzug?', tr: 'İkinci katta mı? Burada asansör var mı?' },
    { who: 'omar', de: 'Ja, es gibt einen Aufzug, hier links. Oder gehen Sie die Treppe hoch. Die Treppe ist hier rechts.', tr: 'Evet, asansör var, burada solda. Ya da merdivenden çıkın. Merdiven burada sağda.' },
    { who: 'yasemin', de: 'Und im zweiten Stock?', tr: 'Peki ikinci katta?' },
    { who: 'omar', de: 'Links ist das Bürgerbüro und rechts ist das Wartezimmer. Haben Sie einen Termin?', tr: 'Solda Bürgerbüro, sağda bekleme odası var. Randevunuz var mı?' },
    { who: 'yasemin', de: 'Ja, ich habe online einen Termin gemacht. Meine Nummer ist B 207.', tr: 'Evet, internetten randevu aldım. Numaram B 207.' },
    { who: 'omar', de: 'Gut. Dann warten Sie bitte im Wartezimmer.', tr: 'İyi. O zaman lütfen bekleme odasında bekleyin.' },
    { who: 'yasemin', de: 'Also: die Treppe hoch bis zum zweiten Stock und dann nach rechts.', tr: 'Yani: ikinci kata kadar merdivenden yukarı, sonra sağa.' },
    { who: 'omar', de: 'Ja, genau!', tr: 'Evet, aynen!' },
    { who: 'yasemin', de: 'Ich brauche auch ein Foto für meinen Ausweis. Wo kann ich hier ein Foto machen?', tr: 'Kimliğim için bir de fotoğraf lazım. Burada nerede fotoğraf çektirebilirim?' },
    { who: 'omar', de: 'Hier unten im Erdgeschoss, rechts. Da sind die Fotoautomaten.', tr: 'Burada aşağıda, zemin katta, sağda. Fotoğraf otomatları orada.' },
    { who: 'yasemin', de: 'Vielen Dank! Schönen Tag noch!', tr: 'Çok teşekkürler! İyi günler!' },
    { who: 'omar', de: 'Danke, gleichfalls!', tr: 'Teşekkürler, size de!' },
];
/** Step 10 · at the entrance of the language school (Mei's first day; Sabine runs the Sprachcafé). */
exports.schoolDialogue = [
    { who: 'mei', de: 'Entschuldigung, können Sie mir bitte helfen?', tr: 'Affedersiniz, bana yardım edebilir misiniz?' },
    { who: 'sabine', de: 'Ja, gern! Was suchen Sie?', tr: 'Evet, memnuniyetle! Ne arıyorsunuz?' },
    { who: 'mei', de: 'Ich bin neu hier. Wo ist Kursraum 203?', tr: 'Burada yeniyim. 203 numaralı derslik nerede?' },
    { who: 'sabine', de: 'Kursraum 203 ist oben im zweiten Stock. Gehen Sie hier die Treppe hoch oder benutzen Sie den Aufzug. Im zweiten Stock gehen Sie nach rechts.', tr: '203 numaralı derslik yukarıda, ikinci katta. Buradan merdivenden çıkın ya da asansörü kullanın. İkinci katta sağa gidin.' },
    { who: 'mei', de: 'Also: im zweiten Stock nach rechts. Gibt es hier auch eine Bibliothek?', tr: 'Yani: ikinci katta sağa. Burada kütüphane de var mı?' },
    { who: 'sabine', de: 'Ja, es gibt eine Bibliothek. Sie ist im dritten Stock, auch rechts.', tr: 'Evet, kütüphane var. Üçüncü katta, o da sağda.' },
    { who: 'mei', de: 'Super! Und wo gibt es hier einen Kaffee?', tr: 'Süper! Peki burada nerede kahve var?' },
    { who: 'sabine', de: 'Hier unten links. Da ist das Sprachcafé – mein Café!', tr: 'Burada aşağıda, solda. Orada Sprachcafé var – benim kafem!' },
    { who: 'mei', de: 'Toll, vielen Dank! Bis später!', tr: 'Harika, çok teşekkürler! Sonra görüşürüz!' },
];
const lineGaps = (line) => line.parts.filter((part) => typeof part !== 'string');
exports.lineGaps = lineGaps;
/** The finished line: every gap filled with its answer. */
const lineText = (line) => line.parts.map(part => typeof part === 'string' ? part : part.answer).join('');
exports.lineText = lineText;
/** Exercise 1 · Was ist was? (the picture, then the word). */
exports.matchPictures = [['🛗', 'der Aufzug'], ['🚻', 'die Toilette'], ['🚪', 'der Eingang'], ['🪑', 'das Wartezimmer'], ['📸', 'der Fotoautomat'], ['💳', 'der Kassenautomat'], ['🪪', 'der Ausweis'], ['ℹ️', 'die Information']];
exports.buildWords = [
    { parts: ['FÜHRER', 'SCHEIN', 'STELLE'], word: 'Führerscheinstelle', article: 'die', tr: 'ehliyet dairesi' },
    { parts: ['BÜRGER', 'BÜRO'], word: 'Bürgerbüro', article: 'das', tr: 'vatandaşlık hizmetleri bürosu' },
    { parts: ['AUSLÄNDER', 'BEHÖRDE'], word: 'Ausländerbehörde', article: 'die', tr: 'yabancılar dairesi' },
    { parts: ['WARTE', 'ZIMMER'], word: 'Wartezimmer', article: 'das', tr: 'bekleme odası' },
    { parts: ['KURS', 'RAUM'], word: 'Kursraum', article: 'der', tr: 'derslik' },
    { parts: ['ERD', 'GESCHOSS'], word: 'Erdgeschoss', article: 'das', tr: 'zemin kat' },
];
/** The word the chosen parts make ("FÜHRER" + "SCHEIN" → "Führerschein"). */
const joinParts = (parts) => { const word = parts.join('').toLowerCase(); return word.charAt(0).toUpperCase() + word.slice(1); };
exports.joinParts = joinParts;
const buildSay = (item) => item.article + ' ' + item.word;
exports.buildSay = buildSay;
/** Exercise 3 · Wohin müssen die Personen gehen? (Er/Sie, zum/zur and the place; the person reads the line). */
exports.places = ['Bürgerbüro', 'Ausländerbehörde', 'Führerscheinstelle', 'Information'];
const wohin = (who, sentence, pronoun, prep, place) => ({ key: who, prompt: sentence, promptWho: who, parts: [{ options: ['Er', 'Sie'], answer: pronoun }, ' muss ', { options: ['zum', 'zur'], answer: prep }, ' ', { options: exports.places, answer: place }, ' gehen.'], say: { text: `${pronoun} muss ${prep} ${place} gehen.`, who } });
exports.wohinLines = [
    wohin('mei', 'Mei möchte ihren Ausweis abholen.', 'Sie', 'zum', 'Bürgerbüro'),
    wohin('rami', 'Rami möchte sein Visum verlängern.', 'Er', 'zur', 'Ausländerbehörde'),
    wohin('nora', 'Nora möchte einen EU-Führerschein beantragen.', 'Sie', 'zur', 'Führerscheinstelle'),
    wohin('tomasz', 'Tomasz möchte seine Wohnung abmelden.', 'Er', 'zum', 'Bürgerbüro'),
    wohin('aisha', 'Aisha möchte eine Aufenthaltserlaubnis beantragen.', 'Sie', 'zur', 'Ausländerbehörde'),
    wohin('omar', 'Omar möchte ein Formular abholen.', 'Er', 'zur', 'Information'),
    wohin('nikos', 'Nikos möchte seinen Führerschein abholen.', 'Er', 'zur', 'Führerscheinstelle'),
];
/** Exercise 4 · write the floor (every usual way of saying it is right; ü may be ue). */
exports.floorLines = [
    ['EG', ['im Erdgeschoss']],
    ['1. OG', ['im ersten Stock', 'im ersten Stockwerk', 'im ersten Obergeschoss', 'in der ersten Etage']],
    ['2. OG', ['im zweiten Stock', 'im zweiten Stockwerk', 'im zweiten Obergeschoss', 'in der zweiten Etage']],
    ['3. OG', ['im dritten Stock', 'im dritten Stockwerk', 'im dritten Obergeschoss', 'in der dritten Etage']],
    ['4. OG', ['im vierten Stock', 'im vierten Stockwerk', 'im vierten Obergeschoss', 'in der vierten Etage']],
    ['5. OG', ['im fünften Stock', 'im fünften Stockwerk', 'im fünften Obergeschoss', 'in der fünften Etage']],
    ['UG', ['im Keller', 'im Untergeschoss']],
];
/** Exercise 5 · read the board of the Bürgeramt: Yasemin asks, Omar's answer is read once the line is right. */
exports.boardFloors = ['im Erdgeschoss', 'im ersten Stock', 'im zweiten Stock', 'im dritten Stock'];
const board = (question, start, floor, side) => ({ key: question, prompt: question, promptWho: 'yasemin', parts: [start + ' ', { options: exports.boardFloors, answer: floor }, ' ', { options: ['links', 'rechts'], answer: side }, '.'], say: { text: `${start} ${floor} ${side}.`, who: 'omar' } });
exports.boardLines = [
    board('Wo ist das Bürgerbüro?', 'Das Bürgerbüro ist', 'im zweiten Stock', 'links'),
    board('Wo ist die Führerscheinstelle?', 'Die Führerscheinstelle ist', 'im ersten Stock', 'rechts'),
    board('Wo ist die Ausländerbehörde?', 'Die Ausländerbehörde ist', 'im dritten Stock', 'rechts'),
    board('Wo ist die Kantine?', 'Die Kantine ist', 'im dritten Stock', 'links'),
    board('Wo ist die Information?', 'Die Information ist', 'im Erdgeschoss', 'links'),
    board('Wo sind die Kassenautomaten?', 'Die Kassenautomaten sind', 'im ersten Stock', 'links'),
];
/** Exercise 6 · Rami at the Bürgeramt: the words from the box go into the dialogue (one box for every gap). */
exports.ramiBox = ['online', 'Stock', 'Benutzen', 'links', 'rechts', 'Wartezimmer', 'genau', 'gibt es', 'unten'];
const gap = (answer) => ({ options: exports.ramiBox, answer });
exports.ramiLines = [
    { key: 'r1', who: 'omar', parts: ['Guten Tag! Wie kann ich Ihnen helfen?'] },
    { key: 'r2', who: 'rami', parts: ['Ich möchte mein Visum verlängern. Ich habe ', gap('online'), ' einen Termin gemacht.'] },
    { key: 'r3', who: 'omar', parts: ['Dann müssen Sie zur Ausländerbehörde gehen. Die Ausländerbehörde ist oben im dritten ', gap('Stock'), '.'] },
    { key: 'r4', who: 'rami', parts: ['Im dritten Stock? Puh!'] },
    { key: 'r5', who: 'omar', parts: ['Kein Problem. ', gap('Benutzen'), ' Sie den Aufzug. Der Aufzug ist hier ', gap('links'), '.'] },
    { key: 'r6', who: 'rami', parts: ['Und im dritten Stock?'] },
    { key: 'r7', who: 'omar', parts: ['Da gehen Sie nach ', gap('rechts'), '. Dort ist das ', gap('Wartezimmer'), '.'] },
    { key: 'r8', who: 'rami', parts: ['Also: mit dem Aufzug bis zum dritten Stock, dann nach rechts.'] },
    { key: 'r9', who: 'omar', parts: ['Ja, ', gap('genau'), '!'] },
    { key: 'r10', who: 'rami', parts: ['Entschuldigung, ', gap('gibt es'), ' hier eine Kantine?'] },
    { key: 'r11', who: 'omar', parts: ['Ja, aber nicht hier ', gap('unten'), '. Die Kantine ist auch oben im dritten Stock, links.'] },
    { key: 'r12', who: 'rami', parts: ['Super, danke schön!'] },
];
/** The finished dialogue, each line by its person ("Tamamlanan diyaloğu dinle"). */
exports.ramiSay = exports.ramiLines.map(line => ({ text: (0, exports.lineText)(line), who: line.who }));
/** Exercise 7 · es gibt: einen, eine or ein? (Mei asks the finished question). */
exports.esGibtRows = [
    ['Aufzug', 'der', 'einen'], ['Toilette', 'die', 'eine'], ['Wartezimmer', 'das', 'ein'], ['Schalter', 'der', 'einen'], ['Information', 'die', 'eine'],
    ['Sekretariat', 'das', 'ein'], ['Kursraum', 'der', 'einen'], ['Kantine', 'die', 'eine'], ['Café', 'das', 'ein'],
];
const esGibtSay = (row) => ({ text: `Gibt es hier ${row[2]} ${row[0]}?`, who: 'mei' });
exports.esGibtSay = esGibtSay;
exports.hearItems = [
    { who: 'sabine', text: 'Die Bibliothek ist im dritten Stock rechts.', options: ['3. kat · sağ', '3. kat · sol', '2. kat · sağ'] },
    { who: 'omar', text: 'Das Sekretariat ist im Erdgeschoss links.', options: ['Zemin kat · sol', 'Zemin kat · sağ', '1. kat · sol'] },
    { who: 'nora', text: 'Kursraum 104 ist im ersten Stock. Gehen Sie nach links.', options: ['1. kat · sol', '1. kat · sağ', '4. kat · sol'] },
    { who: 'rami', text: 'Die Toiletten sind unten im Keller.', options: ['Bodrum kat', 'Zemin kat', 'Çatı'] },
    { who: 'paul', text: 'Das Wartezimmer ist oben im zweiten Stock rechts.', options: ['2. kat · sağ', '2. kat · sol', '3. kat · sağ'] },
    { who: 'tomasz', text: 'Die Kantine ist im fünften Stock links.', options: ['5. kat · sol', '4. kat · sol', '5. kat · sağ'] },
];
/** Exercise 9 · Ach-Laut or Ich-Laut? */
exports.achIchRows = [
    ['nach', 'Ach'], ['die Bücher', 'Ich'], ['auch', 'Ach'], ['rechts', 'Ich'], ['kochen', 'Ach'], ['sprechen', 'Ich'], ['acht', 'Ach'],
    ['nicht', 'Ich'], ['brauchen', 'Ach'], ['ein bisschen', 'Ich'], ['das Buch', 'Ach'], ['gleich', 'Ich'], ['die Sprache', 'Ach'], ['manchmal', 'Ich'],
];
/** Exercise 10 · build the sentence (read by Omar). */
exports.orderSentences = [
    ['Gehen', 'Sie', 'die', 'Treppe', 'hoch.'],
    ['Benutzen', 'Sie', 'den', 'Aufzug.'],
    ['Im', 'dritten', 'Stock', 'gehen', 'Sie', 'nach', 'rechts.'],
    ['Gibt', 'es', 'hier', 'einen', 'Aufzug?'],
    ['Ich', 'möchte', 'meinen', 'Ausweis', 'abholen.'],
    ['Dann', 'müssen', 'Sie', 'zur', 'Ausländerbehörde', 'gehen.'],
];
const orderSay = (sentence) => ({ text: sentence, who: 'omar' });
exports.orderSay = orderSay;
/** What each sentence means, shown above the words so the learner knows what to build (the learner asked, 2 November 2026). */
exports.orderMeanings = ['Merdivenden yukarı çıkın.', 'Asansörü kullanın.', 'Üçüncü katta sağa gidin.', 'Burada asansör var mı?', 'Kimliğimi almak istiyorum.', 'O zaman Yabancılar Dairesi’ne gitmeniz gerekiyor.'];
/** Exercise 11 · role play: the learner is Sabine; Mei asks, the board of the school has the answer (the first option). */
exports.roleQuestions = [
    { question: 'Entschuldigung, wo ist Kursraum 204?', options: ['Kursraum 204 ist im zweiten Stock. Gehen Sie die Treppe hoch und dann nach rechts.', 'Kursraum 204 ist im zweiten Stock. Gehen Sie dann nach links.', 'Kursraum 204 ist im dritten Stock rechts.'] },
    { question: 'Wo ist das Sekretariat?', options: ['Hier unten im Erdgeschoss, nach rechts.', 'Im ersten Stock, nach rechts.', 'Hier unten im Erdgeschoss, nach links.'] },
    { question: 'Gibt es hier eine Bibliothek?', options: ['Ja, es gibt eine Bibliothek. Sie ist im dritten Stock rechts.', 'Ja, es gibt eine Bibliothek. Sie ist im ersten Stock links.', 'Ja, es gibt einen Bibliothek. Sie ist im dritten Stock rechts.'] },
    { question: 'Und wo ist Kursraum 107?', options: ['Im ersten Stock. Gehen Sie dann nach links.', 'Im ersten Stock. Gehen Sie dann nach rechts.', 'Im Erdgeschoss links.'] },
    { question: 'Gibt es hier einen Aufzug?', options: ['Ja, es gibt einen Aufzug, hier links.', 'Ja, es gibt einen Aufzug, hier rechts.', 'Ja, es gibt eine Aufzug, hier links.'] },
];
exports.testQuestionsA = [
    ['„Ich möchte meinen Führerschein abholen.“ — Wohin muss ich gehen?', ['zur Führerscheinstelle', 'zur Toilette', 'zum Sekretariat'], 'zur Führerscheinstelle', 'Dann müssen Sie zur Führerscheinstelle gehen.'],
    ['3. OG: Das Bürgerbüro ist im ___ Stock.', ['dritten', 'dreiten', 'drei'], 'dritten', 'Das Bürgerbüro ist im dritten Stock.'],
    ['Gibt es hier ___ Aufzug?', ['einen', 'eine', 'ein'], 'einen', 'Gibt es hier einen Aufzug?'],
    ['(das Bürgerbüro) Er muss ___ Bürgerbüro gehen.', ['zum', 'zur', 'zu den'], 'zum', 'Er muss zum Bürgerbüro gehen.'],
    ['EG = ?', ['im Erdgeschoss', 'im Keller', 'im ersten Stock'], 'im Erdgeschoss', 'im Erdgeschoss'],
    ['„Gehen Sie die Treppe hoch.“ ne demek?', ['Merdivenden yukarı çıkın.', 'Asansörü kullanın.', 'Aşağıda sola gidin.'], 'Merdivenden yukarı çıkın.', ''],
    ['Hangi kelimede Ach-Laut var?', ['das Buch', 'die Bücher', 'nicht'], 'das Buch', 'das Buch'],
    ['Hangi kelimede Ich-Laut var?', ['rechts', 'acht', 'auch'], 'rechts', 'rechts'],
    ['„unten“ ne demek?', ['aşağıda', 'yukarıda', 'sağda'], 'aşağıda', ''],
    ['Hangi cümle doğru?', ['Im zweiten Stock gehen Sie nach links.', 'Im zweiten Stock Sie gehen nach links.', 'Gehen im zweiten Stock Sie nach links.'], 'Im zweiten Stock gehen Sie nach links.', 'Im zweiten Stock gehen Sie nach links.'],
    ['Eine Aufenthaltserlaubnis beantragen: Wohin?', ['zur Ausländerbehörde', 'zum Fotoautomaten', 'zur Kantine'], 'zur Ausländerbehörde', 'Dann müssen Sie zur Ausländerbehörde gehen.'],
    ['Omar’ı dinle: Wartezimmer nerede?', ['1. kat · sağ', '1. kat · sol', '3. kat · sağ'], '1. kat · sağ', '', { text: 'Das Wartezimmer ist im ersten Stock rechts.', who: 'omar' }],
    ['___ Führerscheinstelle (Hangi artikel?)', ['die', 'der', 'das'], 'die', 'die Führerscheinstelle'],
    ['„Der Nächste, bitte!“ ne demek?', ['Sıradaki, lütfen!', 'Bir sonraki kat, lütfen!', 'Yakında görüşürüz!'], 'Sıradaki, lütfen!', ''],
];
/** Turkish options and questions of the test (for their language on the page). */
const isTurkishText = (text) => /[çğışİÇĞŞ]|\bne demek\b|\bkat\b|\bnerede\b|\bHangi\b|lütfen|görüşürüz|aşağıda|yukarıda|sağda/.test(text);
exports.isTurkishText = isTurkishText;
/** The summary: the important sentences, each by its person. */
exports.summaryLines = [
    { who: 'yasemin', de: 'Entschuldigung, können Sie mir bitte helfen?', tr: 'Affedersiniz, bana yardım edebilir misiniz?' },
    { who: 'yasemin', de: 'Ich möchte meinen Ausweis abholen.', tr: 'Kimliğimi almak istiyorum.' },
    { who: 'omar', de: 'Dann müssen Sie zum Bürgerbüro gehen.', tr: 'O zaman Bürgerbüro’ya gitmeniz gerekiyor.' },
    { who: 'mei', de: 'Wo ist die Ausländerbehörde?', tr: 'Yabancılar dairesi nerede?' },
    { who: 'sabine', de: 'Sie ist oben im dritten Stock.', tr: 'Yukarıda, üçüncü katta.' },
    { who: 'mei', de: 'Gibt es hier einen Aufzug?', tr: 'Burada asansör var mı?' },
    { who: 'sabine', de: 'Ja, hier links. Oder gehen Sie die Treppe hoch.', tr: 'Evet, burada solda. Ya da merdivenden çıkın.' },
    { who: 'omar', de: 'Im zweiten Stock gehen Sie nach rechts.', tr: 'İkinci katta sağa gidin.' },
    { who: 'rami', de: 'Also: bis zum zweiten Stock, dann nach rechts?', tr: 'Yani: ikinci kata kadar, sonra sağa mı?' },
    { who: 'omar', de: 'Ja, genau!', tr: 'Evet, aynen!' },
];
/* ---------- steps ---------- */
/** The steps in order (ids are stable; the title is shown in the top bar). */
exports.stepsA = [
    { id: 'kapak', title: 'Kapak', kind: 'cover' },
    { id: 'kelimeler-bina', title: 'Kelimeler: binada', kind: 'teach' },
    { id: 'kelimeler-amt', title: 'Kelimeler: resmî işler', kind: 'teach' },
    { id: 'kelimeler-yon', title: 'Kelimeler: yön', kind: 'teach' },
    { id: 'katlar', title: 'Katlar', kind: 'teach' },
    { id: 'zum-zur', title: 'zum / zur', kind: 'teach' },
    { id: 'yol-tarifi', title: 'Yol tarifi', kind: 'teach' },
    { id: 'es-gibt', title: 'es gibt', kind: 'teach' },
    { id: 'telaffuz', title: 'Telaffuz', kind: 'teach' },
    { id: 'diyalog-amt', title: 'Diyalog: Bürgeramt', kind: 'teach' },
    { id: 'diyalog-okul', title: 'Diyalog: dil okulu', kind: 'teach' },
    { id: 'eslestir', title: 'Alıştırma 1', kind: 'exercise' },
    { id: 'kelime-kur', title: 'Alıştırma 2', kind: 'exercise' },
    { id: 'wohin', title: 'Alıştırma 3', kind: 'exercise' },
    { id: 'katlar-yaz', title: 'Alıştırma 4', kind: 'exercise' },
    { id: 'pano', title: 'Alıştırma 5', kind: 'exercise' },
    { id: 'rami', title: 'Alıştırma 6', kind: 'exercise' },
    { id: 'einen-eine', title: 'Alıştırma 7', kind: 'exercise' },
    { id: 'dinle', title: 'Alıştırma 8', kind: 'exercise' },
    { id: 'ach-ich', title: 'Alıştırma 9', kind: 'exercise' },
    { id: 'sirala', title: 'Alıştırma 10', kind: 'exercise' },
    { id: 'rollenspiel', title: 'Alıştırma 11', kind: 'exercise' },
    { id: 'test', title: 'Test', kind: 'test' },
    ...(0, talk_switch_1.talkStep)(),
    { id: 'ozet', title: 'Özet', kind: 'end' },
];
const stepIndexA = (id) => exports.stepsA.findIndex(step => step.id === id);
exports.stepIndexA = stepIndexA;
/** Short names of the exercises for the strip under the tabs (a teaching step shows its own title). */
exports.stepShortA = { 'eslestir': 'Resim – kelime', 'kelime-kur': 'Kelime kur', 'wohin': 'Kim nereye?', 'katlar-yaz': 'Katları yaz', 'pano': 'Panoyu oku', 'rami': 'Rami’nin diyaloğu', 'einen-eine': 'einen / eine', 'dinle': 'Dinle', 'ach-ich': 'Ach / Ich', 'sirala': 'Cümle kur', 'rollenspiel': 'Rol oyunu' };
const gapCount = (lines) => lines.reduce((n, line) => n + (0, exports.lineGaps)(line).length, 0);
/** Every exercise is scored (the gaps of the sentence exercises one by one, right at the first choice). */
exports.scoredExercisesA = [
    { id: 'eslestir', total: exports.matchPictures.length },
    { id: 'kelime-kur', total: exports.buildWords.length },
    { id: 'wohin', total: gapCount(exports.wohinLines) },
    { id: 'katlar-yaz', total: exports.floorLines.length },
    { id: 'pano', total: gapCount(exports.boardLines) },
    { id: 'rami', total: gapCount(exports.ramiLines) },
    { id: 'einen-eine', total: exports.esGibtRows.length },
    { id: 'dinle', total: exports.hearItems.length },
    { id: 'ach-ich', total: exports.achIchRows.length },
    { id: 'sirala', total: exports.orderSentences.length },
    { id: 'rollenspiel', total: exports.roleQuestions.length },
    { id: 'test', total: exports.testQuestionsA.length },
];
exports.stepGroupsA = [
    { id: 'konu', label: 'Konu anlatımı', ids: exports.stepsA.filter(step => step.kind === 'teach').map(step => step.id) },
    { id: 'alistirmalar', label: 'Alıştırmalar', ids: exports.stepsA.filter(step => step.kind === 'exercise').map(step => step.id) },
    { id: 'test', label: 'Test', ids: ['test'] },
    ...(0, talk_switch_1.talkGroup)(),
];
/** Every word Teil A teaches, for the count on the contents page. */
exports.wordCountA = exports.buildingWords.length + exports.officeWords.length + exports.officeVerbs.length + exports.directionWords.length;
exports.stadtParts = [
    { id: 'a', badge: 'A', title: 'Gehen Sie die Treppe hoch.', lead: 'Bir binada yol sorma ve tarif etme: katlar, **zum / zur** + müssen, **Gehen Sie …!**, **es gibt** ve Ach-/Ich-Laut.' },
    { id: 'b', badge: 'B' }, { id: 'c', badge: 'C' }, { id: 'd', badge: 'D' },
];
/** What Lektion 15 teaches ("Bu ünitede" on the left page of the contents): lib/unit-goals.ts, in our own words. */
exports.stadtGoals = (0, unit_goals_1.unitGoalsFor)(exports.STADT_UNIT);
/** Every German text Teil A speaks (rendered as site voices by scripts/voices). */
function stadtSpeechTexts() {
    const out = new Set();
    const add = (text) => { if (text.trim())
        out.add(text.trim()); };
    const say = (item) => { if (item)
        add(typeof item === 'string' ? item : item.text); };
    for (const word of [...exports.buildingWords, ...exports.officeWords])
        add(word.de);
    exports.officeVerbs.forEach(([, , example]) => add(example));
    exports.directionWords.forEach(row => add((0, exports.directionSay)(row)));
    exports.houseFloors.forEach(([, label]) => add(label));
    add(exports.roofSay);
    exports.floorRule.forEach(([, de]) => add(de));
    for (const line of [...exports.needDialogue, ...exports.checkDialogue, ...exports.esGibtDialogue, ...exports.officeDialogue, ...exports.schoolDialogue, ...exports.summaryLines])
        add(line.say ?? line.de);
    exports.instructions.forEach(([de]) => add(de));
    exports.upDown.forEach(([de]) => add(de));
    exports.esGibtRule.forEach(([, , example]) => add(example));
    exports.askWhere.forEach(([de]) => add(de));
    [...exports.achWords, ...exports.ichWords].forEach(add);
    exports.longWords.forEach(row => add((0, exports.longWordSay)(row)));
    exports.matchPictures.forEach(([, de]) => add(de));
    exports.buildWords.forEach(item => add((0, exports.buildSay)(item)));
    for (const line of [...exports.wohinLines, ...exports.boardLines]) {
        if (line.prompt)
            add(line.prompt);
        say(line.say);
    }
    exports.floorLines.forEach(([, answers]) => answers.forEach(add));
    exports.ramiSay.forEach(say);
    exports.esGibtRows.forEach(row => say((0, exports.esGibtSay)(row)));
    exports.hearItems.forEach(item => add(item.text));
    exports.achIchRows.forEach(([word]) => add(word));
    exports.orderSentences.forEach(sentence => add(sentence.join(' ')));
    exports.roleQuestions.forEach(item => { add(item.question); add(item.options[0]); });
    exports.testQuestionsA.forEach(question => { add(question[3]); if (question[4])
        add(question[4].text); });
    return [...out];
}
