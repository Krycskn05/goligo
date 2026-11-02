"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepGroups = exports.unitGoals = exports.lessonParts = exports.scoredExercises = exports.stepIndex = exports.steps = exports.testQuestions = exports.orderSay = exports.matchSay = exports.dialogueSpeaker = exports.withSpeakers = exports.exerciseSpeakers = exports.ownPrompts = exports.boxSay = exports.boxLines = exports.wordBox = exports.questionSay = exports.questionLines = exports.listenItems = exports.articleRowSpeech = exports.articleRows = exports.articleOptions = exports.gluedSay = exports.gluedSentences = exports.gluedText = exports.orderMeanings = exports.orderSentences = exports.matchPairs = exports.lettersExercise = exports.words = exports.greetingVoices = exports.greetingsAround = exports.personSpeech = exports.people = exports.dialogue = exports.verbForms = exports.noArticleSay = exports.articleGroups = exports.articleCountries = exports.countries = exports.originPhrases = exports.namePhrases = exports.greetings = exports.voiceOwner = exports.sayText = exports.speakers = exports.portraitSrc = exports.willkommenPictures = exports.WILLKOMMEN_UNIT = exports.WILLKOMMEN_PATH = void 0;
exports.groupOf = void 0;
exports.speakerVoice = speakerVoice;
exports.speakerOf = speakerOf;
exports.testSpeech = testSpeech;
exports.normalizeLoose = normalizeLoose;
exports.acceptsAnswer = acceptsAnswer;
exports.normalizeCase = normalizeCase;
exports.acceptsExact = acceptsExact;
exports.willkommenSpeechTexts = willkommenSpeechTexts;
/**
 * Lektion 1 „Willkommen!“, Teil A – Ich heiße … (A1.1): the learner's own lesson page (an artifact, 24 October
 * 2026), ported to the site. Ten short teaching steps, nine exercises and a test, in the order of the learner's page.
 * Texts for the learner are Turkish (the site's main audience); the German is read aloud with the site voices.
 * Step and exercise ids never change (saved scores are keyed by them).
 */
const talk_switch_1 = require("./talk-switch");
const unit_goals_1 = require("./unit-goals");
exports.WILLKOMMEN_PATH = '/a1-1/willkommen';
exports.WILLKOMMEN_UNIT = 'book-01';
/** Pictures of the lesson (public/toon/lektion1, from the learner's page). */
exports.willkommenPictures = {
    cover: { src: '/toon/lektion1/kapak.webp', width: 960, height: 540 },
    map: { src: '/toon/lektion1/paul-harita.webp', width: 960, height: 540 },
};
const portraitSrc = (key) => '/toon/lektion1/' + key + '.webp';
exports.portraitSrc = portraitSrc;
exports.speakers = [
    { key: 'sabine', name: 'Sabine Krüger', gender: 'female', style: 'F1' },
    { key: 'yasemin', name: 'Yasemin Arslan', gender: 'female', style: 'F2' },
    { key: 'aisha', name: 'Aisha Kamau', gender: 'female', style: 'F3' },
    { key: 'nora', name: 'Nora Weiß', gender: 'female', style: 'F4' },
    { key: 'mei', name: 'Mei Suwan', gender: 'female', style: 'F5' },
    { key: 'mira', name: 'Mira Fuchs', gender: 'female', style: 'F3' },
    { key: 'lena', name: 'Lena Vogt', gender: 'female', style: 'F1' },
    { key: 'omar', name: 'Omar Nasser', gender: 'male', style: 'M2' },
    { key: 'nikos', name: 'Nikos Papadakis', gender: 'male', style: 'M4' },
    { key: 'tomasz', name: 'Tomasz Nowak', gender: 'male', style: 'M5' },
    { key: 'rami', name: 'Rami Khalil', gender: 'male', style: 'M1' },
    { key: 'jonas', name: 'Jonas Berg', gender: 'male', style: 'M1' },
    { key: 'tarek', name: 'Tarek Salim', gender: 'male', style: 'M4' },
    { key: 'paul', name: 'Paul', gender: 'male', style: 'M3' },
];
const sayText = (item) => typeof item === 'string' ? item : item.text;
exports.sayText = sayText;
/** The site voice for a speaker among the voices that are available: their own voice, else another voice of their
 * kind (never a man for a woman); nobody → undefined, the learner's chosen voice. */
function speakerVoice(who, available) {
    const speaker = who ? exports.speakers.find(item => item.key === who) : undefined;
    if (!speaker)
        return undefined;
    const own = available.find(voice => voice.style === speaker.style);
    if (own)
        return own.id;
    const pool = available.filter(voice => voice.gender === speaker.gender);
    if (!pool.length)
        return undefined;
    const sameKind = exports.speakers.filter(item => item.gender === speaker.gender);
    return pool[sameKind.indexOf(speaker) % pool.length].id;
}
/** The speaker of a sentence that names its speaker: "Ich bin Lena Vogt. Und Sie?", "Und ich bin Sabine.", "Hallo! Ich bin neu
 * hier. Ich heiße Tomasz.", "Mein Name ist Aisha Kamau.", "Ich bin Frau Krüger." — the full name, the first name or Frau/Herr with
 * the surname right after ich bin / ich heiße / mein Name ist / hier ist / hier spricht (anywhere in the text). */
const namesOf = (speaker) => {
    const parts = speaker.name.split(' ');
    const surname = parts.length > 1 ? parts[parts.length - 1] : '';
    return [speaker.name, ...(surname ? [(speaker.gender === 'female' ? 'Frau ' : 'Herr ') + surname] : []), parts[0]];
};
const startsWithName = (rest, name) => rest.toLowerCase().startsWith(name.toLowerCase()) && !/[\p{L}\p{N}]/u.test(rest.charAt(name.length));
function speakerOf(text) {
    for (const match of text.matchAll(/(?<![\p{L}])(?:ich bin|ich heiße|ich heisse|mein name ist|hier ist|hier spricht)\s+/giu)) {
        const rest = text.slice((match.index ?? 0) + match[0].length);
        const found = exports.speakers.find(speaker => namesOf(speaker).some(name => startsWithName(rest, name)));
        if (found)
            return found.key;
    }
    return undefined;
}
/** Whose voice reads a text (the learner asked, 31 October 2026: "the lessons go by the name — the voices of the Sesler list
 * are the voices in the texts"): the person who names themselves in it, in every lesson and every exercise, else the speaker
 * given with it (`who`); nobody → the learner's chosen voice. So "Ich heiße Sabine Krüger." is always Sabine's voice, also in a
 * phrase list, a word box or a test answer. */
const voiceOwner = (item) => speakerOf((0, exports.sayText)(item)) ?? (typeof item === 'string' ? undefined : item.who);
exports.voiceOwner = voiceOwner;
/** Step 1 · Selamlaşma */
exports.greetings = [['Guten Tag!', 'İyi günler! / Merhaba!'], ['Herzlich willkommen!', 'Hoş geldiniz!'], ['Danke!', 'Teşekkürler!']];
/** Step 2 · Adınız ne? */
exports.namePhrases = [['Wie heißen Sie?', 'Adınız ne?'], ['Ich heiße Sabine Krüger.', 'Benim adım Sabine Krüger.'], ['Ich bin Sabine Krüger.', 'Ben Sabine Krüger.'], ['Und Sie?', 'Ya siz? (soruyu geri sormak için)']];
/** Step 3 · Nereden geliyorsunuz? */
exports.originPhrases = [['Woher kommen Sie?', 'Nereden geliyorsunuz?'], ['Ich komme aus Deutschland.', 'Almanya’dan geliyorum.'], ['Woher kommen Sie, Herr Nasser?', 'Nereden geliyorsunuz, Bay Nasser?'], ['Ich komme aus Deutschland, aus Hamburg.', 'Almanya’dan, Hamburg’dan geliyorum.']];
/** Step 4 · countries without an article (aus + country). */
exports.countries = [
    ['🇩🇪', 'Deutschland', 'Almanya', 'aus Deutschland'], ['🇦🇹', 'Österreich', 'Avusturya', 'aus Österreich'], ['🇵🇱', 'Polen', 'Polonya', 'aus Polen'],
    ['🇫🇷', 'Frankreich', 'Fransa', 'aus Frankreich'], ['🇮🇹', 'Italien', 'İtalya', 'aus Italien'], ['🇪🇸', 'Spanien', 'İspanya', 'aus Spanien'],
    ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England', 'İngiltere', 'aus England'], ['🇬🇷', 'Griechenland', 'Yunanistan', 'aus Griechenland'], ['🇧🇬', 'Bulgarien', 'Bulgaristan', 'aus Bulgarien'],
    ['🇷🇴', 'Rumänien', 'Romanya', 'aus Rumänien'], ['🇷🇸', 'Serbien', 'Sırbistan', 'aus Serbien'], ['🇭🇷', 'Kroatien', 'Hırvatistan', 'aus Kroatien'],
    ['🇷🇺', 'Russland', 'Rusya', 'aus Russland'], ['🇸🇾', 'Syrien', 'Suriye', 'aus Syrien'], ['🇦🇫', 'Afghanistan', 'Afganistan', 'aus Afghanistan'],
    ['🇪🇬', 'Ägypten', 'Mısır', 'aus Ägypten'], ['🇲🇦', 'Marokko', 'Fas', 'aus Marokko'], ['🇹🇳', 'Tunesien', 'Tunus', 'aus Tunesien'],
    ['🇳🇬', 'Nigeria', 'Nijerya', 'aus Nigeria'], ['🇪🇷', 'Eritrea', 'Eritre', 'aus Eritrea'], ['🇸🇴', 'Somalia', 'Somali', 'aus Somalia'],
    ['🇰🇪', 'Kenia', 'Kenya', 'aus Kenia'], ['🇮🇳', 'Indien', 'Hindistan', 'aus Indien'], ['🇵🇰', 'Pakistan', 'Pakistan', 'aus Pakistan'],
    ['🇨🇳', 'China', 'Çin', 'aus China'], ['🇻🇳', 'Vietnam', 'Vietnam', 'aus Vietnam'], ['🇹🇭', 'Thailand', 'Tayland', 'aus Thailand'], ['🇧🇷', 'Brasilien', 'Brezilya', 'aus Brasilien'],
];
/** Countries with an article (aus der / dem / den …). */
exports.articleCountries = [
    ['🇹🇷', 'die Türkei', 'Türkiye', 'aus der Türkei'], ['🇨🇭', 'die Schweiz', 'İsviçre', 'aus der Schweiz'], ['🇺🇦', 'die Ukraine', 'Ukrayna', 'aus der Ukraine'],
    ['🇮🇶', 'der Irak', 'Irak', 'aus dem Irak'], ['🇮🇷', 'der Iran', 'İran', 'aus dem Iran'], ['🇱🇧', 'der Libanon', 'Lübnan', 'aus dem Libanon'],
    ['🇾🇪', 'der Jemen', 'Yemen', 'aus dem Jemen'], ['🇸🇩', 'der Sudan', 'Sudan', 'aus dem Sudan'], ['🇺🇸', 'die USA', 'ABD', 'aus den USA'], ['🇳🇱', 'die Niederlande', 'Hollanda', 'aus den Niederlanden'],
];
/** aus + article, read aloud as groups (its topic page was removed at the learner's request, 30 October 2026). */
exports.articleGroups = [
    { rule: 'die → der', examples: 'die Türkei → **aus der Türkei** · die Schweiz → **aus der Schweiz** · die Ukraine → **aus der Ukraine**', say: 'aus der Türkei, aus der Schweiz, aus der Ukraine' },
    { rule: 'der → dem', examples: 'der Irak → **aus dem Irak** · der Sudan → **aus dem Sudan** · der Jemen → **aus dem Jemen** · der Iran → **aus dem Iran** · der Libanon → **aus dem Libanon**', say: 'aus dem Irak, aus dem Sudan, aus dem Jemen, aus dem Iran, aus dem Libanon' },
    { rule: 'die (çoğul) → den', examples: 'die USA → **aus den USA** · die Niederlande → **aus den Niederlanden**', say: 'aus den USA, aus den Niederlanden' },
];
exports.noArticleSay = 'aus Deutschland, aus Polen, aus Syrien';
/** Step 6 · three verbs: ich / Sie. */
exports.verbForms = [
    { verb: 'heißen', tr: 'adı … olmak', ich: 'ich heiße', sie: 'Sie heißen' },
    { verb: 'kommen', tr: 'gelmek', ich: 'ich komme', sie: 'Sie kommen' },
    { verb: 'sein', tr: 'olmak', ich: 'ich bin', sie: 'Sie sind' },
];
exports.dialogue = [
    ['S', 'Guten Tag. Ich bin Sabine Krüger. Wie heißen Sie?', 'İyi günler. Ben Sabine Krüger. Adınız ne?'],
    ['O', 'Guten Tag. Ich heiße Omar Nasser.', 'İyi günler. Benim adım Omar Nasser.'],
    ['S', 'Woher kommen Sie, Herr Nasser?', 'Nereden geliyorsunuz, Bay Nasser?'],
    ['O', 'Ich komme aus dem Sudan. Und Sie, Frau Krüger?', 'Sudan’dan geliyorum. Ya siz, Bayan Krüger?'],
    ['S', 'Ich komme aus Deutschland. Herzlich willkommen!', 'Almanya’dan geliyorum. Hoş geldiniz!'],
    ['O', 'Danke!', 'Teşekkürler!'],
];
exports.people = [
    { key: 'sabine', name: 'Sabine Krüger', land: 'Deutschland', city: 'Hamburg', flag: '🇩🇪' },
    { key: 'omar', name: 'Omar Nasser', land: 'dem Sudan', city: 'Khartum', flag: '🇸🇩' },
    { key: 'yasemin', name: 'Yasemin Arslan', land: 'der Türkei', city: 'Izmir', flag: '🇹🇷' },
    { key: 'nikos', name: 'Nikos Papadakis', land: 'Griechenland', city: 'Thessaloniki', flag: '🇬🇷' },
    { key: 'aisha', name: 'Aisha Kamau', land: 'Kenia', city: 'Nairobi', flag: '🇰🇪' },
    { key: 'tomasz', name: 'Tomasz Nowak', land: 'Polen', city: 'Krakau', flag: '🇵🇱' },
];
const personSpeech = (p) => `Ich heiße ${p.name}. Ich komme aus ${p.land}, aus ${p.city}.`;
exports.personSpeech = personSpeech;
/** Step 8 · "Guten Tag" in other languages. */
exports.greetingsAround = [
    ['Türkçe', 'Merhaba! / İyi günler!'], ['İngilizce', 'Hello! / Good day!'], ['Fransızca', 'Bonjour!'], ['Arapça', 'As-salamu alaikum! / Marhaba!'],
    ['İspanyolca', 'Hola! / Buenos días!'], ['Lehçe', 'Dzień dobry!'], ['Yunanca', 'Kaliméra!'], ['Bulgarca', 'Dobar den!'], ['Tayca', 'Sawatdi!'],
];
/** Each greeting is read in its own language and script by the device's voice for that language (the learner asked,
 * 30 October 2026); the site's natural voices speak only German. */
exports.greetingVoices = {
    'Türkçe': { lang: 'tr-TR', say: 'Merhaba! İyi günler!' }, 'İngilizce': { lang: 'en-GB', say: 'Hello! Good day!' }, 'Fransızca': { lang: 'fr-FR', say: 'Bonjour !' },
    'Arapça': { lang: 'ar-SA', say: 'السلام عليكم! مرحبا!' }, 'İspanyolca': { lang: 'es-ES', say: '¡Hola! ¡Buenos días!' }, 'Lehçe': { lang: 'pl-PL', say: 'Dzień dobry!' },
    'Yunanca': { lang: 'el-GR', say: 'Καλημέρα!' }, 'Bulgarca': { lang: 'bg-BG', say: 'Добър ден!' }, 'Tayca': { lang: 'th-TH', say: 'สวัสดี' },
};
/** Step 10 · word list. */
exports.words = [
    ['Guten Tag!', 'İyi günler! / Merhaba!'], ['Herzlich willkommen!', 'Hoş geldiniz!'], ['Danke!', 'Teşekkürler!'],
    ['wie', 'nasıl'], ['heißen', 'adı … olmak'], ['Sie', 'siz (resmî)'], ['ich', 'ben'], ['ich bin', 'ben … -im (sein = olmak)'],
    ['Herr', 'Bay'], ['Frau', 'Bayan'], ['und', 've'], ['Und Sie?', 'Ya siz?'], ['woher', 'nereden'], ['kommen', 'gelmek'], ['aus', '-den / -dan'],
];
/** Exercise 1 · missing letters (the gap is part of a word: no space before it). */
exports.lettersExercise = {
    lines: [
        { who: 'a', text: 'Guten T___. Ich h___ Mira Fuchs. Und S___?', answers: [['ag'], ['eiße'], ['ie']] },
        { who: 'b', text: 'Ich h___ Tarek Salim.', answers: [['eiße']] },
        { who: 'a', text: 'W___ k___ Sie, Herr Salim?', answers: [['oher'], ['ommen']] },
        { who: 'b', text: 'Ich k___ a___ Syrien.', answers: [['omme'], ['us']] },
    ],
    say: ['Guten Tag. Ich heiße Mira Fuchs. Und Sie?', 'Ich heiße Tarek Salim.', 'Woher kommen Sie, Herr Salim?', 'Ich komme aus Syrien.'],
};
/** Exercise 2 · match question and answer. */
exports.matchPairs = [['Wie heißen Sie?', 'Ich heiße Jonas Berg.'], ['Woher kommen Sie?', 'Ich komme aus Polen.'], ['Herzlich willkommen!', 'Danke!'], ['Ich bin Mira Fuchs. Und Sie?', 'Ich bin Tarek Salim.']];
/** Exercise 3 · put the words in order. */
exports.orderSentences = [['Woher', 'kommen', 'Sie,', 'Herr', 'Salim?'], ['Ich', 'komme', 'aus', 'der', 'Türkei.'], ['Guten', 'Tag.', 'Wie', 'heißen', 'Sie?'], ['Ich', 'bin', 'Lena', 'Vogt.', 'Und', 'Sie?']];
/** What each sentence means, shown above the words (the learner asked, 2 November 2026). */
exports.orderMeanings = ['Nerelisiniz, Bay Salim?', 'Türkiye’denim.', 'İyi günler. Adınız ne?', 'Ben Lena Vogt. Ya siz?'];
/** Exercise 4 · separate the words of a glued text. */
exports.gluedText = 'GutenTagWieheißenSieIchbinLenaVogtWoherkommenSieFrauVogtIchkommeausKenia';
exports.gluedSentences = [
    { who: 'a', answers: ['Guten Tag.'] }, { who: 'a', answers: ['Wie heißen Sie?'] }, { who: 'b', answers: ['Ich bin Lena Vogt.'] },
    { who: 'a', answers: ['Woher kommen Sie, Frau Vogt?', 'Woher kommen Sie Frau Vogt?'] }, { who: 'b', answers: ['Ich komme aus Kenia.'] },
];
exports.gluedSay = ['Guten Tag. Wie heißen Sie?', 'Ich bin Lena Vogt.', 'Woher kommen Sie, Frau Vogt?', 'Ich komme aus Kenia.'];
/** Exercise 5 · aus + article ('–' = no article). */
exports.articleOptions = ['–', 'der', 'dem', 'den'];
exports.articleRows = [['Türkei', 'der'], ['Irak', 'dem'], ['Deutschland', '–'], ['USA', 'den'], ['Sudan', 'dem'], ['Schweiz', 'der'], ['Polen', '–'], ['Jemen', 'dem'], ['Ukraine', 'der'], ['Iran', 'dem']];
const articleRowSpeech = ([land, article]) => 'aus ' + (article === '–' ? '' : article + ' ') + land;
exports.articleRowSpeech = articleRowSpeech;
exports.listenItems = [
    { key: 'nora', name: 'Nora Weiß', text: 'Guten Tag. Ich bin Nora Weiß. Ich komme aus Österreich, aus Wien.', options: ['aus Österreich', 'aus Deutschland', 'aus der Schweiz'], answer: 0 },
    { key: 'rami', name: 'Rami Khalil', text: 'Hallo. Ich heiße Rami Khalil. Ich komme aus dem Libanon, aus Beirut.', options: ['aus Syrien', 'aus dem Libanon', 'aus dem Irak'], answer: 1 },
    { key: 'mei', name: 'Mei Suwan', text: 'Guten Tag. Ich bin Mei Suwan. Ich komme aus Thailand, aus Bangkok.', options: ['aus Kenia', 'aus Polen', 'aus Thailand'], answer: 2 },
];
/** Exercise 7 · write the question to the answer. */
exports.questionLines = [
    { answers: ['Wie heißen Sie?', 'Wie heißen Sie, Frau Kamau?'], reply: 'Ich heiße Aisha Kamau.' },
    { answers: ['Woher kommen Sie?', 'Woher kommen Sie, Frau Kamau?'], reply: 'Ich komme aus Kenia.' },
    { answers: ['Wie heißen Sie?', 'Wie heißen Sie, Herr Nowak?'], reply: 'Ich bin Tomasz Nowak.' },
    { answers: ['Woher kommen Sie?', 'Woher kommen Sie, Herr Nowak?'], reply: 'Ich komme aus Polen.' },
];
exports.questionSay = ['Wie heißen Sie?', 'Ich heiße Aisha Kamau.', 'Woher kommen Sie?', 'Ich komme aus Kenia.'];
/** Exercise 8 · choose from the box. */
exports.wordBox = ['Tag', 'heiße', 'Woher', 'aus', 'willkommen', 'Danke'];
exports.boxLines = [
    { who: 'a', text: 'Guten ___. Ich bin Nikos Papadakis. Wie heißen Sie?', answers: [['Tag']] },
    { who: 'b', text: 'Ich ___ Yasemin Arslan.', answers: [['heiße']] },
    { who: 'a', text: '___ kommen Sie, Frau Arslan?', answers: [['Woher']] },
    { who: 'b', text: 'Ich komme ___ der Türkei. Und Sie?', answers: [['aus']] },
    { who: 'a', text: 'Aus Griechenland. Herzlich ___!', answers: [['willkommen']] },
    { who: 'b', text: '___!', answers: [['Danke']] },
];
exports.boxSay = ['Guten Tag. Ich bin Nikos Papadakis. Wie heißen Sie?', 'Ich heiße Yasemin Arslan.', 'Woher kommen Sie, Frau Arslan?', 'Ich komme aus der Türkei. Und Sie?', 'Aus Griechenland. Herzlich willkommen!', 'Danke!'];
/** Exercise 9 · the learner answers with their own name and country. */
exports.ownPrompts = [
    { question: 'Wie heißen Sie?', pattern: /^(ich heisse|ich bin) \S+/, placeholder: 'Ich heiße … / Ich bin …' },
    { question: 'Woher kommen Sie?', pattern: /^ich komme aus \S+/, placeholder: 'Ich komme aus …' },
];
/** Who reads what in the exercises (see `speakers`): the solution lines of the gap exercises alternate a, b. */
exports.exerciseSpeakers = { harfler: { a: 'mira', b: 'tarek' }, ayir: { a: 'paul', b: 'lena' }, soru: { a: 'paul', b: 'aisha' }, kutu: { a: 'nikos', b: 'yasemin' } };
const withSpeakers = (say, who) => say.map((text, i) => ({ text, who: i % 2 ? who.b : who.a }));
exports.withSpeakers = withSpeakers;
const dialogueSpeaker = (who) => who === 'S' ? 'sabine' : 'omar';
exports.dialogueSpeaker = dialogueSpeaker;
/** Matching: the person who introduces themselves, else the teacher asks; a named person answers. */
const matchSay = (pair) => [{ text: pair[0], who: speakerOf(pair[0]) ?? 'paul' }, { text: pair[1], who: speakerOf(pair[1]) }];
exports.matchSay = matchSay;
/** Word order: the named person, the teacher for a question, else the learner's chosen voice. */
const orderSay = (sentence) => ({ text: sentence, who: speakerOf(sentence) ?? (sentence.endsWith('?') ? 'paul' : undefined) });
exports.orderSay = orderSay;
exports.testQuestions = [
    ['___ heißen Sie?', ['Wie', 'Woher', 'Was'], 'Wie'],
    ['Ich ___ aus Polen.', ['komme', 'heiße', 'bin'], 'komme'],
    ['„Woher kommen Sie?“ – doğru cevap hangisi?', ['Ich komme aus Kenia.', 'Ich heiße Aisha.', 'Danke!'], 'Ich komme aus Kenia.'],
    ['Ich komme aus ___ Türkei.', ['der', 'dem', 'den'], 'der'],
    ['Ich komme aus ___ Irak.', ['der', 'dem', 'den'], 'dem'],
    ['„Herzlich willkommen!“ – doğru cevap hangisi?', ['Guten Tag.', 'Danke!', 'Und Sie?'], 'Danke!'],
    ['Ich komme aus ___ Deutschland.', ['dem', 'der', '– (artikel yok)'], '– (artikel yok)'],
    ['„Siz“ (resmî) Almanca nasıl denir?', ['ich', 'Sie', 'Herr'], 'Sie'],
    ['Ich ___ Omar Nasser.', ['bin', 'heißen', 'kommen'], 'bin'],
    ['„Guten Tag“ Türkçesi nedir?', ['Hoş geldiniz', 'İyi günler', 'Teşekkürler'], 'İyi günler'],
];
/** What is read aloud after a test answer: the whole sentence, or the German answer (nothing for a Turkish answer). */
function testSpeech([question, , answer]) {
    if (question.includes('___'))
        return question.replace('___', answer.replace(/ \(.*\)/, '').replace('–', '')).replace(/\s+/g, ' ').trim();
    return /[A-Za-zÄÖÜäöüß]/.test(answer) && !/^(Hoş|İyi|Teşekkürler)/.test(answer) ? answer : '';
}
exports.steps = [
    { id: 'kapak', title: 'Kapak', kind: 'cover' },
    { id: 'selam', title: 'Selamlaşma', kind: 'teach' },
    { id: 'ad', title: 'Adınız ne?', kind: 'teach' },
    { id: 'nereden', title: 'Nereden geliyorsunuz?', kind: 'teach' },
    { id: 'ulkeler', title: 'Ülkeler', kind: 'teach' },
    { id: 'fiiller', title: 'Üç fiil', kind: 'teach' },
    { id: 'diyalog', title: 'Diyalog', kind: 'teach' },
    { id: 'kisiler', title: 'Kişiler nereden?', kind: 'teach' },
    { id: 'diller', title: 'Farklı dillerde Guten Tag', kind: 'teach' },
    { id: 'kelimeler', title: 'Kelime listesi', kind: 'teach' },
    { id: 'harfler', title: 'Alıştırma 1', kind: 'exercise' },
    { id: 'eslestir', title: 'Alıştırma 2', kind: 'exercise' },
    { id: 'sirala', title: 'Alıştırma 3', kind: 'exercise' },
    { id: 'ayir', title: 'Alıştırma 4', kind: 'exercise' },
    { id: 'aus', title: 'Alıştırma 5', kind: 'exercise' },
    { id: 'dinle', title: 'Alıştırma 6', kind: 'exercise' },
    { id: 'soru', title: 'Alıştırma 7', kind: 'exercise' },
    { id: 'kutu', title: 'Alıştırma 8', kind: 'exercise' },
    { id: 'sen', title: 'Alıştırma 9', kind: 'exercise' },
    { id: 'test', title: 'Test', kind: 'test' },
    ...(0, talk_switch_1.talkStep)(),
    { id: 'bitti', title: 'Bitti', kind: 'end' },
];
const stepIndex = (id) => exports.steps.findIndex(step => step.id === id);
exports.stepIndex = stepIndex;
/** Exercises that are scored (Alıştırma 9 is the learner's own sentences: no score). */
exports.scoredExercises = [
    { id: 'harfler', total: exports.lettersExercise.lines.reduce((n, line) => n + line.answers.length, 0) },
    { id: 'eslestir', total: exports.matchPairs.length },
    { id: 'sirala', total: exports.orderSentences.length },
    { id: 'ayir', total: exports.gluedSentences.length },
    { id: 'aus', total: exports.articleRows.length },
    { id: 'dinle', total: exports.listenItems.length },
    { id: 'soru', total: exports.questionLines.length },
    { id: 'kutu', total: exports.boxLines.length },
    { id: 'test', total: exports.testQuestions.length },
];
/** Loose comparison for typed answers: case, ß/umlauts, punctuation and spacing do not matter. */
function normalizeLoose(text) {
    return text.toLowerCase().replace(/ß/g, 'ss').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[.,!?;:„“”"’'\-]/g, ' ').replace(/\s+/g, ' ').trim();
}
function acceptsAnswer(given, answers) { const value = normalizeLoose(given); return !!value && answers.some(answer => normalizeLoose(answer) === value); }
/** Capital letters count (Teil C, „Groß oder klein?“): only punctuation, spacing and ß/ss do not matter. */
function normalizeCase(text) { return text.replace(/ß/g, 'ss').replace(/[.,!?;:„“”"’'\-]/g, ' ').replace(/\s+/g, ' ').trim(); }
function acceptsExact(given, answers) { const value = normalizeCase(given); return !!value && answers.some(answer => normalizeCase(answer) === value); }
/** Every German text the lesson speaks (rendered as site voices by scripts/voices). */
function willkommenSpeechTexts() {
    const out = new Set();
    const add = (text) => { if (text.trim())
        out.add(text.trim()); };
    for (const [de] of [...exports.greetings, ...exports.namePhrases, ...exports.originPhrases, ...exports.words])
        add(de);
    for (const [, , , aus] of [...exports.countries, ...exports.articleCountries])
        add(aus);
    add(exports.noArticleSay);
    exports.articleGroups.forEach(group => add(group.say));
    exports.verbForms.forEach(form => { add(form.ich); add(form.sie); });
    exports.dialogue.forEach(line => add(line[1]));
    exports.people.forEach(person => add((0, exports.personSpeech)(person)));
    exports.lettersExercise.say.forEach(add);
    exports.matchPairs.forEach(pair => { add(pair[0]); add(pair[1]); });
    exports.orderSentences.forEach(sentence => add(sentence.join(' ')));
    exports.gluedSay.forEach(add);
    exports.articleRows.forEach(row => add((0, exports.articleRowSpeech)(row)));
    exports.listenItems.forEach(item => add(item.text));
    exports.questionSay.forEach(add);
    exports.boxSay.forEach(add);
    exports.ownPrompts.forEach(prompt => add(prompt.question));
    exports.testQuestions.forEach(question => add(testSpeech(question)));
    return [...out];
}
exports.lessonParts = [
    { id: 'a', badge: 'A', title: 'Guten Tag! Ich heiße …', lead: 'Selamlaşma, adını söyleme ve sorma, nereden geldiğini söyleme: **aus + artikel**.' },
    { id: 'b', badge: 'B', title: 'Ich spreche ein bisschen Deutsch.', lead: 'Diller, **Sie** mi **du** mu, ich / du / Sie çekimi, alfabe ve **Ich buchstabiere: …**' },
    { id: 'c', badge: 'C', title: 'Guten Tag!', lead: 'Günün saatine göre selam, vedalaşma, **Wie geht’s?**, fiil 2. pozisyonda ve doğru yazma.' },
    { id: 'd', badge: 'D', title: 'Ich bin neu hier.', lead: 'Çizgi roman: yeni komşuyla tanışma, en önemli cümleler, ezber stratejisi, Lektion 1 özeti ve **Alles klar?**' },
];
/** What Lektion 1 teaches ("Bu ünitede" on the left page of the contents): lib/unit-goals.ts, in our own words. */
exports.unitGoals = (0, unit_goals_1.unitGoalsFor)(exports.WILLKOMMEN_UNIT);
exports.stepGroups = [
    { id: 'konu', label: 'Konu anlatımı', ids: exports.steps.filter(step => step.kind === 'teach').map(step => step.id) },
    { id: 'alistirmalar', label: 'Alıştırmalar', ids: exports.steps.filter(step => step.kind === 'exercise').map(step => step.id) },
    { id: 'test', label: 'Test', ids: ['test'] },
    ...(0, talk_switch_1.talkGroup)(),
];
const groupOf = (id) => exports.stepGroups.find(group => group.ids.includes(id));
exports.groupOf = groupOf;
