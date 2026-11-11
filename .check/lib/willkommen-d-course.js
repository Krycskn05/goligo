"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineSayD = exports.stepGroupsD = exports.scoredExercisesD = exports.stepIndexD = exports.stepsD = exports.checkPoints = exports.checkSections = exports.testQuestionsD = exports.profileLines = exports.talkSay = exports.talkLines = exports.grammarSay = exports.grammarLines = exports.grammarItems = exports.vocabSay = exports.vocabLines = exports.vocabBox = exports.selfRatings = exports.ownPromptsD = exports.ichSentences = exports.comicGapSay = exports.comicGapLines = exports.comicBox = exports.wordSayD = exports.wordsD = exports.summaryRules = exports.summaryVerbSay = exports.summaryVerbs = exports.summaryQuestions = exports.summaryGoodbyes = exports.summaryHellos = exports.strategySteps = exports.meiExample = exports.importantSay = exports.importantSentences = exports.comicLines = exports.comicPanels = exports.willkommenDPictures = void 0;
exports.filledLine = filledLine;
exports.willkommenDSpeechTexts = willkommenDSpeechTexts;
/**
 * Lektion 1 „Willkommen!“, Teil D – Ich bin neu hier. (the learner's lesson page, 25 October 2026), ported to the site like
 * Teil A–C: the cover, five teaching steps (a comic, the important sentences, a learning strategy, the summary of
 * Lektion 1, words), three exercises, "Alles klar?" — four scored sections and a 15-question test, then the points —
 * and the end of Lektion 1. Texts for the learner are Turkish; the German is read with the site voices, each person
 * with their own voice (`speakers` in lib/willkommen-course.ts). Step ids never change: saved scores are keyed by them.
 */
const talk_switch_1 = require("./talk-switch");
/** Pictures of Teil D (public/toon/lektion1, from the learner's page; cut-outs on white). */
exports.willkommenDPictures = {
    cover: { src: '/toon/lektion1/kapak-d.webp', width: 960, height: 540 },
    comic: [
        { src: '/toon/lektion1/komsu-1.webp', width: 960, height: 720 },
        { src: '/toon/lektion1/komsu-2.webp', width: 960, height: 720 },
        { src: '/toon/lektion1/komsu-3.webp', width: 960, height: 720 },
        { src: '/toon/lektion1/komsu-4.webp', width: 960, height: 720 },
    ],
    strategy: { src: '/toon/lektion1/ezber.webp', width: 960, height: 640 },
};
/* ---------- teaching steps ---------- */
/** Step 1 · the comic: Yasemin moves in, her neighbour Nora meets her on the stairs (four panels). */
exports.comicPanels = [
    { alt: 'Merdiven boşluğu: Yasemin elinde kutuyla, Nora alışveriş filesiyle', lines: [
            { who: 'nora', de: 'Guten Tag!', tr: 'İyi günler!' },
            { who: 'yasemin', de: 'Guten Tag! Ich bin neu hier.', tr: 'İyi günler! Burada yeniyim.' },
        ] },
    { alt: 'Tanışma: Yasemin ve Nora el sıkışıyor', lines: [
            { who: 'nora', de: 'Herzlich willkommen! Ich bin Nora Weiß. Wie heißen Sie?', tr: 'Hoş geldiniz! Ben Nora Weiß. Adınız ne?' },
            { who: 'yasemin', de: 'Ich heiße Yasemin Arslan.', tr: 'Adım Yasemin Arslan.' },
            { who: 'nora', de: 'Wie geht es Ihnen, Frau Arslan?', tr: 'Nasılsınız, Bayan Arslan?' },
            { who: 'yasemin', de: 'Danke, gut. Und Ihnen?', tr: 'Teşekkürler, iyi. Ya siz?' },
            { who: 'nora', de: 'Sehr gut, danke.', tr: 'Çok iyi, teşekkürler.' },
        ] },
    { alt: 'Sohbet: kutu yerde, Nora dinliyor', lines: [
            { who: 'nora', de: 'Woher kommen Sie, Frau Arslan?', tr: 'Nereden geliyorsunuz, Bayan Arslan?' },
            { who: 'yasemin', de: 'Aus der Türkei, aus Izmir. Und Sie?', tr: 'Türkiye’den, İzmir’den. Ya siz?' },
            { who: 'nora', de: 'Ich komme aus Österreich. Welche Sprachen sprechen Sie?', tr: 'Avusturya’dan geliyorum. Hangi dilleri konuşuyorsunuz?' },
            { who: 'yasemin', de: 'Türkisch, Englisch und ein bisschen Deutsch.', tr: 'Türkçe, İngilizce ve biraz Almanca.' },
        ] },
    { alt: 'Vedalaşma: Yasemin ve Nora el sallıyor', lines: [
            { who: 'nora', de: 'Ich spreche ein bisschen Türkisch: Hoş geldiniz!', tr: 'Biraz Türkçe konuşuyorum: Hoş geldiniz!', say: 'Ich spreche ein bisschen Türkisch.' },
            { who: 'yasemin', de: 'Oh, super! Teşekkürler! Bis bald, Frau Weiß!', tr: 'Oo, süper! Teşekkürler! Yakında görüşürüz Bayan Weiß!', say: 'Oh, super! Bis bald, Frau Weiß!' },
            { who: 'nora', de: 'Bis bald!', tr: 'Yakında görüşürüz!' },
        ] },
];
exports.comicLines = exports.comicPanels.flatMap(panel => panel.lines);
/** Step 2 · the important sentences (with "…" for the learner's own words) and Mei's example. */
exports.importantSentences = ['Ich bin neu hier.', 'Ich heiße …', 'Ich komme aus …', 'Ich spreche … und ein bisschen Deutsch.'];
const importantSay = (sentence) => sentence.replace(/\s*…\s*/g, ' ').replace(/\s+([.!?])/g, '$1').replace(/\s+/g, ' ').trim();
exports.importantSay = importantSay;
exports.meiExample = { who: 'mei', de: 'Ich heiße Mei Suwan. Ich komme aus Thailand. Ich spreche Thai und ein bisschen Deutsch.', tr: 'Adım Mei Suwan. Tayland’dan geliyorum. Tayca ve biraz Almanca konuşuyorum.' };
/** Step 3 · learning by heart with the phone (Nikos records himself). */
exports.strategySteps = [
    ['Yüksek sesle oku.', 'Önce dinle, sonra sen söyle.'],
    ['Telefonuna kaydet.', 'Ses kayıt uygulamasıyla üç cümleni kaydet.'],
    ['İki kez dinle.', 'Kendi sesini duymak ezberi güçlendirir.'],
    ['Bakmadan söyle.', 'Sayfayı kapat, üç cümleyi ezberden söyle.'],
    ['Kendini değerlendir:', '👍 sehr gut · 👊 gut · 👎 nicht so gut. “Nicht so gut” ise 1. adıma dön.'],
];
/** Step 4 · the summary of Lektion 1. */
exports.summaryHellos = ['Guten Morgen!', 'Guten Tag!', 'Guten Abend!', 'Gute Nacht!', 'Hallo!', 'Hi!'];
exports.summaryGoodbyes = ['Auf Wiedersehen!', 'Tschüs!', 'Bis bald!'];
exports.summaryQuestions = [
    ['Wie heißen Sie?', 'Wie heißt du?'], ['Woher kommen Sie?', 'Woher kommst du?'], ['Welche Sprachen sprechen Sie?', 'Welche Sprachen sprichst du?'], ['Wie geht es Ihnen?', 'Wie geht es dir?'],
];
exports.summaryVerbs = [
    { verb: 'kommen', ich: 'komme', du: 'kommst', sie: 'kommen' }, { verb: 'heißen', ich: 'heiße', du: 'heißt', sie: 'heißen' },
    { verb: 'sprechen', ich: 'spreche', du: 'sprichst', sie: 'sprechen' }, { verb: 'sein', ich: 'bin', du: 'bist', sie: 'sind' },
];
const summaryVerbSay = (row) => `ich ${row.ich}, du ${row.du}, Sie ${row.sie}`;
exports.summaryVerbSay = summaryVerbSay;
exports.summaryRules = [
    '**aus + artikel:** aus der Türkei · aus dem Irak · aus den USA · çoğu ülke artikelsiz: aus Polen',
    '**Fiil 2. pozisyonda:** Ich **komme** aus Polen. · Woher **kommen** Sie?',
    '**Büyük harf:** cümle başı, isimler, ülkeler, diller ve **Sie**; Almancada bütün isimler büyük yazılır.',
    '**Alfabe:** J = yot, V = fau, W = ve, Y = üpsilon, Z = tset, ß = estset',
];
/** Step 5 · words (the first form before " / " is read). */
exports.wordsD = [
    ['neu', 'yeni'], ['hier', 'burada'], ['Ich bin neu hier.', 'Burada yeniyim.'], ['die Nachbarin / der Nachbar', 'komşu (kadın / erkek)'], ['die Wohnung', 'daire, ev'],
    ['wichtig', 'önemli'], ['der Satz', 'cümle'], ['auswendig lernen', 'ezberlemek'], ['aufnehmen', 'kaydetmek (ses)'], ['üben', 'alıştırma yapmak'], ['leicht', 'kolay'], ['schwer', 'zor'], ['Alles klar?', 'Her şey anlaşıldı mı?'],
];
const wordSayD = (de) => de.split(' / ')[0];
exports.wordSayD = wordSayD;
/* ---------- exercises ---------- */
/** Exercise 1 · complete the comic with sentences from the box (a = Nora, b = Yasemin). */
exports.comicBox = ['Guten Tag!', 'Wie heißen Sie?', 'Wie geht es Ihnen', 'Sehr gut, danke.', 'Woher kommen Sie', 'Aus der Türkei.', 'Welche Sprachen sprechen Sie?', 'Bis bald!'];
exports.comicGapLines = [
    { who: 'a', text: '___', answers: [['Guten Tag!']] },
    { who: 'b', text: 'Guten Tag! Ich bin neu hier.', answers: [] },
    { who: 'a', text: 'Ich bin Nora Weiß. ___', answers: [['Wie heißen Sie?']] },
    { who: 'b', text: 'Ich heiße Yasemin Arslan.', answers: [] },
    { who: 'a', text: '___, Frau Arslan?', answers: [['Wie geht es Ihnen']] },
    { who: 'b', text: 'Danke, gut. Und Ihnen?', answers: [] },
    { who: 'a', text: '___ ___, Frau Arslan?', answers: [['Sehr gut, danke.'], ['Woher kommen Sie']] },
    { who: 'b', text: '___ Und Sie?', answers: [['Aus der Türkei.']] },
    { who: 'a', text: 'Ich komme aus Österreich. ___', answers: [['Welche Sprachen sprechen Sie?']] },
    { who: 'b', text: 'Türkisch, Englisch und ein bisschen Deutsch. ___', answers: [['Bis bald!']] },
];
/** A gap line with its first answers filled in (what is read after a full score). */
function filledLine(line) { let gap = 0; return line.text.replace(/___/g, () => line.answers[gap++]?.[0] ?? '').replace(/\s+/g, ' ').replace(/ ([,.?!])/g, '$1').trim(); }
exports.comicGapSay = exports.comicGapLines.map(filledLine);
/** Exercise 2 · which sentences say something about "ich"? */
exports.ichSentences = [
    { text: 'Ich bin neu hier.', ich: true, who: 'yasemin' }, { text: 'Wie heißen Sie?', ich: false, who: 'nora' }, { text: 'Ich heiße Yasemin Arslan.', ich: true, who: 'yasemin' },
    { text: 'Danke, gut. Und Ihnen?', ich: false, who: 'yasemin' }, { text: 'Ich komme aus Österreich.', ich: true, who: 'nora' }, { text: 'Aus der Türkei, aus Izmir.', ich: false, who: 'yasemin' },
    { text: 'Welche Sprachen sprechen Sie?', ich: false, who: 'nora' }, { text: 'Ich spreche ein bisschen Türkisch.', ich: true, who: 'nora' }, { text: 'Bis bald, Frau Weiß!', ich: false, who: 'yasemin' },
    { text: 'Türkisch, Englisch und ein bisschen Deutsch.', ich: false, who: 'yasemin' },
];
/** Exercise 3 · Und Sie? Three sentences of your own (not scored): write, listen, hide, say them by heart, rate yourself. */
exports.ownPromptsD = [
    { pattern: /^(ich heisse|ich bin|mein name ist) \S+/, placeholder: 'Ich heiße …' },
    { pattern: /^ich komme aus \S+/, placeholder: 'Ich komme aus …' },
    { pattern: /^ich spreche \S+/, placeholder: 'Ich spreche … und ein bisschen Deutsch.' },
];
exports.selfRatings = [
    ['👍', 'sehr gut', 'Süper! Bu cümleler artık senin.'], ['👊', 'gut', 'İyi. Bir kez daha kaydet ve dinle.'], ['👎', 'nicht so gut', 'Sorun değil — stratejinin 1. adımına dön, yarın tekrar dene.'],
];
/* ---------- Alles klar? (the points test of Lektion 1) ---------- */
/** 1 Wortschatz · the word box (a = Tomasz, who is new; b = Sabine). */
exports.vocabBox = ['heiße', 'Woher', 'komme', 'Sprachen', 'spreche'];
exports.vocabLines = [
    { who: 'a', text: 'Ich ___ Tomasz Nowak. Ich bin neu hier.', answers: [['heiße']] },
    { who: 'b', text: 'Herzlich willkommen! ___ kommen Sie, Herr Nowak?', answers: [['Woher']] },
    { who: 'a', text: 'Ich ___ aus Polen, aus Krakau.', answers: [['komme']] },
    { who: 'b', text: 'Und welche ___ sprechen Sie?', answers: [['Sprachen']] },
    { who: 'a', text: 'Ich ___ Polnisch, Englisch und ein bisschen Deutsch.', answers: [['spreche']] },
];
exports.vocabSay = exports.vocabLines.map(filledLine);
/** 2 Grammatik · the verb in the right form (the infinitive in brackets). */
exports.grammarItems = [
    { text: 'Wie ___ du?', verb: 'heißen', answer: 'heißt' }, { text: '___ Sie Herr Khalil? Richtig?', verb: 'sein', answer: 'Sind' },
    { text: 'Welche Sprachen ___ du?', verb: 'sprechen', answer: 'sprichst' }, { text: 'Frau Suwan, woher ___ Sie?', verb: 'kommen', answer: 'kommen' },
    { text: 'Ich ___ Griechisch und Deutsch.', verb: 'sprechen', answer: 'spreche' }, { text: 'Ich ___ aus Thailand.', verb: 'kommen', answer: 'komme' },
    { text: 'Du ___ neu hier, richtig?', verb: 'sein', answer: 'bist' }, { text: 'Wie ___ Sie?', verb: 'heißen', answer: 'heißen' },
];
exports.grammarLines = exports.grammarItems.map((item, i) => ({ text: `${i + 1}. ${item.text} (${item.verb})`, answers: [[item.answer]] }));
exports.grammarSay = exports.grammarItems.map(item => item.text.replace('___', item.answer));
/** 3 Kommunikation · complete the dialogue (a = Nora, b = Rami). */
exports.talkLines = [
    { who: 'a', text: 'Guten Tag. Ich bin Nora Weiß. ___', answers: [['Ich bin neu hier.']] },
    { who: 'b', text: '___ Rami Khalil. Ich komme aus dem Libanon. ___', answers: [['Ich bin', 'Ich heiße'], ['Und Sie?']] },
    { who: 'a', text: '___ aus Österreich. ___', answers: [['Ich komme'], ['Welche Sprachen sprechen Sie?']] },
    { who: 'b', text: '___ Arabisch, Französisch und ein bisschen Deutsch. Und Sie?', answers: [['Ich spreche']] },
    { who: 'a', text: 'Deutsch und Englisch.', answers: [] },
];
exports.talkSay = exports.talkLines.map(filledLine);
/** 4 Steckbrief · the two profile cards from the dialogue. */
exports.profileLines = [
    { text: 'Rami Khalil · Land: ___', answers: [['Libanon', 'der Libanon', 'aus dem Libanon']] },
    { text: 'Rami Khalil · Sprachen: ___', answers: [['Arabisch, Französisch, ein bisschen Deutsch', 'Arabisch, Französisch und ein bisschen Deutsch', 'Arabisch, Französisch, Deutsch', 'Arabisch, Französisch und Deutsch']] },
    { text: 'Nora Weiß · Land: ___', answers: [['Österreich', 'aus Österreich']] },
    { text: 'Nora Weiß · Sprachen: ___', answers: [['Deutsch, Englisch', 'Deutsch und Englisch', 'Englisch, Deutsch', 'Englisch und Deutsch']] },
];
exports.testQuestionsD = [
    ['Wie ___ Sie?', ['heißen', 'heißt', 'heiße'], 'heißen', 'Wie heißen Sie?'],
    ['Ich komme aus ___ Türkei.', ['der', 'dem', 'den'], 'der', 'Ich komme aus der Türkei.'],
    ['Ich komme aus ___ Irak.', ['der', 'dem', 'den'], 'dem', 'Ich komme aus dem Irak.'],
    ['Polen → dil adı?', ['Polnisch', 'Polen', 'Polisch'], 'Polnisch', 'Polnisch'],
    ['Welche Sprachen ___ du?', ['sprichst', 'sprechen', 'spreche'], 'sprichst', 'Welche Sprachen sprichst du?'],
    ['Ich ___ neu hier.', ['bin', 'bist', 'sind'], 'bin', 'Ich bin neu hier.'],
    ['Saat 19:00, karşılaşıyorsun:', ['Guten Abend!', 'Guten Morgen!', 'Gute Nacht!'], 'Guten Abend!', 'Guten Abend!'],
    ['Resmî vedalaşma:', ['Auf Wiedersehen!', 'Tschüs!', 'Hi!'], 'Auf Wiedersehen!', 'Auf Wiedersehen!'],
    ['Wie geht es ___? (du)', ['dir', 'Ihnen', 'Sie'], 'dir', 'Wie geht es dir?'],
    ['😐 → ?', ['Na ja, es geht.', 'Super!', 'Schlecht.'], 'Na ja, es geht.', 'Na ja, es geht.'],
    ['„Wie bitte?“ ne demek?', ['Efendim? / Pardon?', 'Nasılsın?', 'Hoşça kal!'], 'Efendim? / Pardon?', ''],
    ['„J“ harfi Almanca nasıl okunur?', ['yot', 'ce', 'ji'], 'yot', 'Jot'],
    ['Fiil 2. pozisyonda olan cümle:', ['Ich spreche Deutsch.', 'Spreche ich Deutsch.', 'Ich Deutsch spreche.'], 'Ich spreche Deutsch.', 'Ich spreche Deutsch.'],
    ['Doğru yazılmış olan:', ['Ich komme aus Polen.', 'ich komme aus polen.', 'Ich Komme aus polen.'], 'Ich komme aus Polen.', 'Ich komme aus Polen.'],
    ['„Ich bin neu hier.“ ne demek?', ['Burada yeniyim.', 'Burada değilim.', 'Burası yeni.'], 'Burada yeniyim.', ''],
];
/** The sections of "Alles klar?" with their points (like the book: under half the points → "Bitte noch üben!"). */
exports.checkSections = [
    { id: 'wortschatz', label: '1 Wortschatz', points: 5 }, { id: 'grammatik', label: '2 Grammatik', points: 8 }, { id: 'kommunikation', label: '3 Kommunikation', points: 6 },
    { id: 'steckbrief', label: '4 Steckbrief', points: 4 }, { id: 'test', label: '5 Test', points: 15 },
];
exports.checkPoints = exports.checkSections.reduce((n, section) => n + section.points, 0);
/** The steps in order (ids are stable; the title is shown in the top bar). */
exports.stepsD = [
    { id: 'kapak', title: 'Kapak', kind: 'cover' },
    { id: 'cizgi-roman', title: 'Çizgi roman', kind: 'teach' },
    { id: 'onemli', title: 'Önemli cümleler', kind: 'teach' },
    { id: 'strateji', title: 'Ezber stratejisi', kind: 'teach' },
    { id: 'ozet', title: 'Lektion 1 özeti', kind: 'teach' },
    { id: 'kelimeler', title: 'Kelime listesi', kind: 'teach' },
    { id: 'tamamla', title: 'Alıştırma 1', kind: 'exercise' },
    { id: 'ich', title: 'Alıştırma 2', kind: 'exercise' },
    { id: 'sen', title: 'Alıştırma 3', kind: 'exercise' },
    { id: 'wortschatz', title: 'Alles klar? 1', kind: 'exercise' },
    { id: 'grammatik', title: 'Alles klar? 2', kind: 'exercise' },
    { id: 'kommunikation', title: 'Alles klar? 3', kind: 'exercise' },
    { id: 'steckbrief', title: 'Alles klar? 4', kind: 'exercise' },
    { id: 'test', title: 'Alles klar? 5', kind: 'test' },
    { id: 'puanlar', title: 'Puanların', kind: 'end' },
    ...(0, talk_switch_1.talkStep)(),
    { id: 'bitti', title: 'Bitti', kind: 'end' },
];
const stepIndexD = (id) => exports.stepsD.findIndex(step => step.id === id);
exports.stepIndexD = stepIndexD;
/** Scored exercises (Alıştırma 3, the learner's own sentences, has no score). */
exports.scoredExercisesD = [
    { id: 'tamamla', total: exports.comicGapLines.reduce((n, line) => n + line.answers.length, 0) },
    { id: 'ich', total: exports.ichSentences.length },
    { id: 'wortschatz', total: exports.vocabLines.length },
    { id: 'grammatik', total: exports.grammarLines.length },
    { id: 'kommunikation', total: exports.talkLines.reduce((n, line) => n + line.answers.length, 0) },
    { id: 'steckbrief', total: exports.profileLines.length },
    { id: 'test', total: exports.testQuestionsD.length },
];
exports.stepGroupsD = [
    { id: 'konu', label: 'Konu anlatımı', ids: ['cizgi-roman', 'onemli', 'strateji', 'ozet', 'kelimeler'] },
    { id: 'alistirmalar', label: 'Alıştırmalar', ids: ['tamamla', 'ich', 'sen'] },
    { id: 'test', label: 'Alles klar?', ids: ['wortschatz', 'grammatik', 'kommunikation', 'steckbrief', 'test', 'puanlar'] },
    ...(0, talk_switch_1.talkGroup)(),
];
/** Every German text Teil D speaks (rendered as site voices by scripts/voices). */
function willkommenDSpeechTexts() {
    const out = new Set();
    const add = (text) => { if (text.trim())
        out.add(text.trim()); };
    for (const line of exports.comicLines)
        add(line.say ?? line.de);
    exports.importantSentences.forEach(sentence => add((0, exports.importantSay)(sentence)));
    add(exports.meiExample.de);
    [...exports.summaryHellos, ...exports.summaryGoodbyes].forEach(add);
    exports.summaryQuestions.flat().forEach(add);
    exports.summaryVerbs.forEach(row => add((0, exports.summaryVerbSay)(row)));
    exports.wordsD.forEach(([de]) => add((0, exports.wordSayD)(de)));
    exports.comicBox.forEach(add);
    exports.comicGapSay.forEach(add);
    exports.ichSentences.forEach(item => add(item.text));
    exports.selfRatings.forEach(([, de]) => add(de));
    exports.vocabSay.forEach(add);
    exports.grammarSay.forEach(add);
    exports.talkSay.forEach(add);
    exports.testQuestionsD.forEach(question => add(question[3]));
    return [...out];
}
/** A dialogue line as a speech item (the person's own voice). */
const lineSayD = (line) => ({ text: line.say ?? line.de, who: line.who });
exports.lineSayD = lineSayD;
