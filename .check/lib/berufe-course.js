"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.berufeScored = exports.berufeStepShort = exports.berufeStepIndex = exports.berufeSteps = exports.practiceItems = exports.isTurkishText = exports.berufeTest = exports.L2A_OWN_KEY = exports.ownPrompts = exports.examLines = exports.dialogueSay = exports.dialogueLines = exports.dialogueBox = exports.letterLines = exports.otherFormSay = exports.otherForms = exports.chatFill = exports.chatLines = exports.pictureItems = exports.orderRowSay = exports.orderRows = exports.duArbeitest = exports.verbEnding = exports.verbSay = exports.verbTable = exports.fourPeople = exports.workSections = exports.umlautRule = exports.inRule = exports.duDialogue = exports.sieDialogue = exports.sayBeruf = exports.askBeruflich = exports.askBeruf = exports.verbChecks = exports.workChecks = exports.formChecks = exports.askChecks = exports.wordChecks = exports.phrases = exports.otherWords = exports.pairSay = exports.jobOf = exports.jobs = exports.personName = exports.castL2A = exports.jobPicture = exports.berufePictures = exports.BERUFE_UNIT = exports.BERUFE_PATH = void 0;
exports.berufeGoals = exports.berufeParts = exports.berufeWordCount = exports.berufeGroups = void 0;
exports.berufeSpeechTexts = berufeSpeechTexts;
/**
 * Lektion 2 „Berufe“ (A1.1), Teil A – Ich bin Koch. (the learner's lesson page, an artifact of 2 November 2026), ported
 * to the site like Lektion 15 (lib/stadt-course.ts): the cover, nine short teaching steps (the jobs with their pictures,
 * other words, a quick word check, asking and saying a job, women's job names, Ich arbeite als / bei, the verbs and the
 * phrases), seven exercises, a 12-question test, Konuş (a speaking practice with the learner's own sentences, no AI)
 * and Bitti. Texts for the learner are
 * Turkish; the German is read with the site voices, each person with their own voice (`speakers` in
 * lib/willkommen-course.ts). Step ids never change: saved scores are keyed by them.
 */
const unit_goals_1 = require("./unit-goals");
exports.BERUFE_PATH = '/a1-1/berufe';
exports.BERUFE_UNIT = 'book-02';
/** Pictures of Teil A (public/toon/lektion2, from the learner's page; every job shows a man and a woman). */
exports.berufePictures = {
    cover: { src: '/toon/lektion2/kapak-a.webp', width: 960, height: 540 },
};
const jobPicture = (key) => ({ src: '/toon/lektion2/' + key + '.webp', width: 640, height: 480 });
exports.jobPicture = jobPicture;
/** The people of Teil A (portraits and voices of the site: public/toon/lektion1/<key>.webp, `speakers`). */
exports.castL2A = ['omar', 'aisha', 'nikos', 'yasemin', 'rami', 'nora', 'mei', 'paul'];
const personName = (key) => key === 'paul' ? 'Paul Hoca' : key[0].toUpperCase() + key.slice(1);
exports.personName = personName;
exports.jobs = [
    { key: 'koch', male: 'der Koch', female: 'die Köchin', tr: 'aşçı', emoji: '👨‍🍳', alt: 'Nikos ve Sabine aşçı: mutfakta, beyaz aşçı kıyafeti ve şapkayla, tencere başında' },
    { key: 'lehrer', male: 'der Lehrer', female: 'die Lehrerin', tr: 'öğretmen', emoji: '👩‍🏫', alt: 'Paul ve Nora öğretmen: sınıfta tahtanın önünde' },
    { key: 'arzt', male: 'der Arzt', female: 'die Ärztin', tr: 'doktor', emoji: '🩺', alt: 'Rami ve Nora doktor: muayene odasında beyaz önlük ve stetoskopla' },
    { key: 'friseur', male: 'der Friseur', female: 'die Friseurin', tr: 'kuaför', emoji: '💇', alt: 'Omar ve Aisha kuaför: kuaför salonunda, ellerinde makas ve fön makinesi' },
    { key: 'verkaeufer', male: 'der Verkäufer', female: 'die Verkäuferin', tr: 'satış görevlisi, tezgâhtar', emoji: '🛒', alt: 'Omar ve Sabine satış görevlisi: süpermarkette kasada, mavi önlükle' },
    { key: 'taxifahrer', male: 'der Taxifahrer', female: 'die Taxifahrerin', tr: 'taksi şoförü', emoji: '🚕', alt: 'Tomasz ve Aisha taksi şoförü: bej taksinin yanında, biri direksiyonda' },
    { key: 'mechatroniker', male: 'der Mechatroniker', female: 'die Mechatronikerin', tr: 'mekatronik teknisyeni (oto tamircisi)', emoji: '🔧', alt: 'Nikos ve Mei oto tamircisi: açık motor kaputu başında, mavi tulumla' },
    { key: 'altenpfleger', male: 'der Altenpfleger', female: 'die Altenpflegerin', tr: 'yaşlı bakıcısı', emoji: '🧓', alt: 'Rami ve Mei yaşlı bakıcısı: tekerlekli sandalyedeki yaşlı bir hanıma yardım ediyorlar' },
    { key: 'polizist', male: 'der Polizist', female: 'die Polizistin', tr: 'polis', emoji: '👮', alt: 'Omar ve Nora polis: üniformayla, polis arabasının önünde' },
    { key: 'ingenieur', male: 'der Ingenieur', female: 'die Ingenieurin', tr: 'mühendis', emoji: '📐', alt: 'Tomasz ve Mei mühendis: baretle, ellerinde bir plan' },
    { key: 'saenger', male: 'der Sänger', female: 'die Sängerin', tr: 'şarkıcı', emoji: '🎤', alt: 'Nikos ve Aisha şarkıcı: sahnede mikrofonla, renkli ışıklar' },
    { key: 'kellner', male: 'der Kellner', female: 'die Kellnerin', tr: 'garson', emoji: '🍽️', alt: 'Tomasz ve Sabine garson: kafede siyah önlükle, ellerinde tepsi ve fincan' },
    { key: 'busfahrer', male: 'der Busfahrer', female: 'die Busfahrerin', tr: 'otobüs şoförü', emoji: '🚌', alt: 'Paul ve Yasemin otobüs şoförü: sarı otobüsün önünde, biri direksiyonda' },
    { key: 'haus', male: 'der Hausmann', female: 'die Hausfrau', tr: 'ev erkeği / ev hanımı', emoji: '🏠', alt: 'Rami ev erkeği ve Yasemin ev hanımı: biri yemek yapıyor, biri çamaşır katlıyor' },
    { key: 'tierarzt', male: 'der Tierarzt', female: 'die Tierärztin', tr: 'veteriner', emoji: '🐾', alt: 'Nikos ve Yasemin veteriner: muayene masasında bir köpeğe bakıyorlar' },
];
const jobOf = (key) => exports.jobs.find(job => job.key === key) ?? exports.jobs[0];
exports.jobOf = jobOf;
/** Both forms read one after the other ("der Koch, die Köchin"). */
const pairSay = (job) => job.male + ', ' + job.female;
exports.pairSay = pairSay;
/** Other words: the word, its meaning, an example and the example's meaning; the row reads the example. */
exports.otherWords = [
    ['der Beruf', 'meslek', 'Was bist du von Beruf?', 'Mesleğin ne?'],
    ['von Beruf sein', 'mesleği … olmak', 'Ich bin Köchin von Beruf.', 'Mesleğim aşçılık. / Ben aşçıyım.'],
    ['beruflich', 'iş olarak, mesleki', 'Was machst du beruflich?', 'İş olarak ne yapıyorsun?'],
    ['machen', 'yapmak', 'Was machst du?', 'Ne yapıyorsun?'],
    ['arbeiten (als)', '(… olarak) çalışmak', 'Ich arbeite als Verkäufer.', 'Satış görevlisi olarak çalışıyorum.'],
    ['arbeiten (bei)', '(… şirketinde) çalışmak', 'Ich arbeite bei Siemens.', 'Siemens’te çalışıyorum.'],
    ['jetzt', 'şimdi', 'Ich arbeite jetzt nicht.', 'Şimdi çalışmıyorum.'],
    ['nicht', 'değil; -me, -ma (olumsuzluk)', 'Ich arbeite nicht.', 'Çalışmıyorum.'],
    ['aber', 'ama', 'Ich bin Lehrerin, aber ich arbeite als Taxifahrerin.', 'Öğretmenim ama taksi şoförü olarak çalışıyorum.'],
    ['auch', 'de, da; ayrıca', 'Du arbeitest auch!', 'Sen de çalışıyorsun!'],
    ['lernen', 'öğrenmek', 'Ich lerne Deutsch.', 'Almanca öğreniyorum.'],
    ['studieren', 'üniversitede okumak', 'Ich studiere.', 'Üniversitede okuyorum.'],
    ['reparieren', 'tamir etmek', 'Ich repariere Autos.', 'Araba tamir ediyorum.'],
    ['das Auto, die Autos', 'araba, arabalar', 'Nikos repariert Autos.', 'Nikos araba tamir ediyor.'],
    ['das Heimatland', 'memleket, anavatan', 'Mein Heimatland ist die Türkei.', 'Memleketim Türkiye.'],
    ['in Deutschland', 'Almanya’da', 'Ich arbeite in Deutschland.', 'Almanya’da çalışıyorum.'],
    ['der Kurs', 'kurs', 'Ich bin neu im Kurs.', 'Kursta yeniyim.'],
    ['der Mann / die Frau', 'erkek, adam / kadın', 'Der Mann ist Lehrer. Die Frau ist Lehrerin.', 'Adam öğretmen. Kadın öğretmen.'],
    ['was', 'ne', 'Was bist du von Beruf?', 'Mesleğin ne?'],
    ['richtig / falsch', 'doğru / yanlış', 'Stimmt! Richtig!', 'Doğru! Evet, öyle!'],
];
/** The phrases of the unit (Konu 5, to learn by heart). */
exports.phrases = [
    ['Was bist du von Beruf?', 'Mesleğin ne? (sen)'],
    ['Was sind Sie von Beruf?', 'Mesleğiniz ne? (siz)'],
    ['Was machst du beruflich?', 'İş olarak ne yapıyorsun? (sen)'],
    ['Was machen Sie beruflich?', 'İş olarak ne yapıyorsunuz? (siz)'],
    ['Ich bin Koch von Beruf.', 'Ben aşçıyım. / Mesleğim aşçılık.'],
    ['Ich arbeite als Verkäufer bei Edeka.', 'Edeka’da satış görevlisi olarak çalışıyorum.'],
    ['Ich arbeite jetzt nicht.', 'Şimdi çalışmıyorum.'],
    ['Ich lerne Deutsch.', 'Almanca öğreniyorum.'],
    ['Ich studiere.', 'Üniversitede okuyorum.'],
    ['Stimmt! Richtig!', 'Doğru! Evet, öyle!'],
    ['Leider falsch!', 'Maalesef yanlış!'],
];
const check = (q, options, say = options[0]) => ({ q, options, say });
exports.wordChecks = [
    check('aşçı (kadın)', ['die Köchin', 'der Koch', 'die Kellnerin']),
    check('taksi şoförü (erkek)', ['der Taxifahrer', 'der Busfahrer', 'die Taxifahrerin']),
    check('„Ich arbeite jetzt nicht.“', ['Şimdi çalışmıyorum.', 'Şimdi çalışıyorum.', 'Şimdi öğreniyorum.'], ''),
    check('yaşlı bakıcısı (kadın)', ['die Altenpflegerin', 'die Ärztin', 'die Polizistin']),
    check('„aber“', ['ama', 'de, da', 'şimdi'], ''),
    check('tamir etmek', ['reparieren', 'studieren', 'lernen']),
    check('mühendis (erkek)', ['der Ingenieur', 'der Mechatroniker', 'der Verkäufer']),
    check('„Ich studiere.“', ['Üniversitede okuyorum.', 'Almanca öğreniyorum.', 'Çalışıyorum.'], ''),
];
exports.askChecks = [
    check('Mesleğini söylerken hangisi doğru?', ['Ich bin Koch.', 'Ich bin ein Koch.', 'Ich bin der Koch.']),
    check('„Siz“ ile soru hangisi?', ['Was sind Sie von Beruf?', 'Was bist du von Beruf?', 'Was machst du beruflich?']),
];
exports.formChecks = [
    check('die Köchin → erkek biçimi?', ['der Koch', 'der Köch', 'der Kochin']),
    check('der Hausmann → kadın biçimi?', ['die Hausfrau', 'die Hausmannin', 'die Hausmann']),
    check('der Arzt → kadın biçimi?', ['die Ärztin', 'die Arztin', 'die Ärzt']),
];
exports.workChecks = [
    check('„Şu an taksi şoförü olarak çalışıyorum.“', ['Ich arbeite als Taxifahrerin.', 'Ich bin als Taxifahrerin.', 'Ich arbeite bei Taxifahrerin.']),
    check('„Şimdi çalışmıyorum.“', ['Ich arbeite jetzt nicht.', 'Ich nicht arbeite jetzt.', 'Ich arbeite kein jetzt.']),
    check('„Siemens’te çalışıyorum.“', ['Ich arbeite bei Siemens.', 'Ich arbeite als Siemens.', 'Ich bin Siemens von Beruf.']),
];
exports.verbChecks = [
    check('Was ___ du beruflich?', ['machst', 'machen', 'mache'], 'Was machst du beruflich?'),
    check('Du ___ als Verkäufer?', ['arbeitest', 'arbeitst', 'arbeiten'], 'Du arbeitest als Verkäufer?'),
    check('Was ___ Sie von Beruf?', ['sind', 'bist', 'bin'], 'Was sind Sie von Beruf?'),
];
/* ---------- teaching steps ---------- */
/** Konu 1 · asking for a job: two questions (von Beruf, beruflich), each with du and Sie, and two answers. */
exports.askBeruf = [['Was bist du von Beruf?', 'Mesleğin ne? (sen) — kelimesi kelimesine: „Meslekten nesin?“'], ['Was sind Sie von Beruf?', 'Mesleğiniz ne? (siz)']];
exports.askBeruflich = [['Was machst du beruflich?', 'İş olarak ne yapıyorsun? (sen)'], ['Was machen Sie beruflich?', 'İş olarak ne yapıyorsunuz? (siz)']];
exports.sayBeruf = [['Ich bin Koch.', 'Ben aşçıyım.'], ['Ich bin Lehrerin von Beruf.', 'Mesleğim öğretmenlik. / Ben öğretmenim.']];
/** Yasemin and her neighbour Nora say Sie (Lektion 1); in the course everybody says du. */
exports.sieDialogue = [
    { who: 'nora', de: 'Was sind Sie von Beruf, Frau Arslan?', tr: 'Mesleğiniz ne, Bayan Arslan?' },
    { who: 'yasemin', de: 'Ich bin Tierärztin von Beruf. Und Sie?', tr: 'Ben veterinerim. Ya siz?' },
    // Nora is a nurse in all of Lektion 2 (the learner's pages, 2 November 2026; in Teil D she works at the care service with Rami).
    { who: 'nora', de: 'Ich bin Krankenpflegerin.', tr: 'Ben hemşireyim. (die Krankenpflegerin = hemşire; Nora yaşlı bakım servisinde çalışıyor)' },
];
exports.duDialogue = [
    { who: 'omar', de: 'Was machst du beruflich, Nikos?', tr: 'İş olarak ne yapıyorsun, Nikos?' },
    { who: 'nikos', de: 'Ich bin Mechatroniker. Und du?', tr: 'Ben mekatronik teknisyeniyim. Ya sen?' },
    { who: 'omar', de: 'Ich bin Friseur von Beruf.', tr: 'Ben kuaförüm.' },
];
/** Konu 2 · the woman's form: + in; with an Umlaut; Mann → Frau. */
exports.inRule = ['lehrer', 'taxifahrer', 'polizist', 'ingenieur', 'mechatroniker', 'friseur'];
exports.umlautRule = ['koch', 'arzt', 'tierarzt'];
/** Konu 3 · my job, my work now, where I work, aber, nicht, auch. */
exports.workSections = [
    { title: '1. Mesleğim: „Ich bin … von Beruf.“', rows: [['Ich bin Friseur von Beruf.', 'Mesleğim kuaförlük. (öğrendiğim iş)']] },
    { title: '2. Şu an yaptığım iş: „Ich arbeite als …“', lead: '**als** = „olarak“. Burada da artikel yok: als Verkäufer, als Taxifahrerin.', rows: [['Ich arbeite als Verkäufer.', 'Satış görevlisi olarak çalışıyorum.']] },
    { title: '3. Nerede çalışıyorum: „Ich arbeite bei …“', lead: '**bei** + şirket adı = „… şirketinde“.', rows: [['Ich arbeite bei Siemens.', 'Siemens’te çalışıyorum.'], ['Ich arbeite als Verkäufer bei Edeka.', 'Edeka’da satış görevlisi olarak çalışıyorum.']] },
    { title: '4. İkisini bağlamak: „aber“', lead: '**aber** = „ama“. Meslek ile şu anki işi birbirine bağlar. „aber“dan sonra cümle normal devam eder: aber **ich arbeite** …', rows: [['Ich bin Lehrerin von Beruf, aber ich arbeite als Taxifahrerin.', 'Öğretmenim, ama taksi şoförü olarak çalışıyorum.']] },
    { title: '5. Çalışmıyorsam: „nicht“', lead: '**nicht** cümleyi olumsuz yapar ve fiilden **sonra** gelir. **jetzt** (şimdi) eklersen „şu an“ anlamı güçlenir.', rows: [['Ich arbeite nicht.', 'Çalışmıyorum.'], ['Ich arbeite jetzt nicht.', 'Şimdi çalışmıyorum.']] },
    { title: 'Çalışmıyorsan ne yaptığını ekle', rows: [['Ich lerne Deutsch.', 'Almanca öğreniyorum.'], ['Ich studiere.', 'Üniversitede okuyorum.'], ['Ich bin Hausfrau.', 'Ev hanımıyım.'], ['Ich bin Hausmann.', 'Ev erkeğiyim.']] },
    { title: '6. „auch“ = de / da', rows: [['Du bist Hausfrau? Du arbeitest auch!', 'Ev hanımı mısın? Sen de çalışıyorsun!']] },
];
/** Four people, four lives (each read by their own voice). */
exports.fourPeople = [
    { who: 'omar', from: 'Sudan', de: 'Ich bin Friseur von Beruf. Aber ich arbeite jetzt als Verkäufer.', tr: 'Kuaförüm. Ama şimdi satış görevlisi olarak çalışıyorum.' },
    { who: 'aisha', from: 'Kenya', de: 'Ich bin Lehrerin von Beruf, aber ich arbeite als Taxifahrerin.', tr: 'Öğretmenim ama taksi şoförü olarak çalışıyorum.' },
    { who: 'yasemin', from: 'Türkiye', de: 'Ich bin Tierärztin von Beruf. Aber ich arbeite jetzt nicht. Ich lerne Deutsch.', tr: 'Veterinerim. Ama şimdi çalışmıyorum. Almanca öğreniyorum.' },
    { who: 'rami', from: 'Lübnan', de: 'Ich bin Altenpfleger. Aber ich arbeite nicht. Ich bin Hausmann.', tr: 'Yaşlı bakıcısıyım. Ama çalışmıyorum. Ev erkeğiyim.' },
];
/** Konu 4 · the verbs with ich, du and Sie (the row is read: "ich arbeite, du arbeitest, Sie arbeiten."). */
exports.verbTable = [
    ['arbeiten', 'arbeite', 'arbeitest', 'arbeiten'], ['machen', 'mache', 'machst', 'machen'], ['lernen', 'lerne', 'lernst', 'lernen'],
    ['studieren', 'studiere', 'studierst', 'studieren'], ['reparieren', 'repariere', 'reparierst', 'reparieren'], ['sein', 'bin', 'bist', 'sind'],
];
const verbSay = (row) => `ich ${row[1]}, du ${row[2]}, Sie ${row[3]}.`;
exports.verbSay = verbSay;
/** The ending of a form after the stem (arbeit|est); `sein` has none. */
const verbEnding = (verb, form) => { if (verb === 'sein')
    return ['', form]; const stem = verb.replace(/en$/, ''); return form.startsWith(stem) ? [stem, form.slice(stem.length)] : ['', form]; };
exports.verbEnding = verbEnding;
exports.duArbeitest = 'Du arbeitest als Kellner, richtig?';
/** The verb in position 2: [1, verb, 3]. */
exports.orderRows = [['Was', 'bist', 'du von Beruf?'], ['Was', 'machst', 'du beruflich?'], ['Was', 'machen', 'Sie beruflich?'], ['Ich', 'arbeite', 'als Verkäufer.']];
const orderRowSay = (row) => row.join(' ');
exports.orderRowSay = orderRowSay;
exports.pictureItems = [
    { job: 'koch', hint: 'kadın · aşçı', options: ['die Köchin', 'der Koch', 'die Kellnerin'] },
    { job: 'mechatroniker', hint: 'erkek · oto tamircisi', options: ['der Mechatroniker', 'die Mechatronikerin', 'der Ingenieur'] },
    { job: 'polizist', hint: 'kadın · polis', options: ['die Polizistin', 'der Polizist', 'die Ärztin'] },
    { job: 'taxifahrer', hint: 'erkek · taksi şoförü', options: ['der Taxifahrer', 'der Busfahrer', 'die Taxifahrerin'] },
    { job: 'arzt', hint: 'kadın · doktor', options: ['die Ärztin', 'der Arzt', 'die Altenpflegerin'] },
    { job: 'friseur', hint: 'erkek · kuaför', options: ['der Friseur', 'die Friseurin', 'der Verkäufer'] },
    { job: 'lehrer', hint: 'kadın · öğretmen', options: ['die Lehrerin', 'der Lehrer', 'die Sängerin'] },
    { job: 'verkaeufer', hint: 'erkek · satış görevlisi', options: ['der Verkäufer', 'der Kellner', 'die Verkäuferin'] },
];
/** Exercise 2 · the A1 course chat (three people write about their jobs). */
exports.chatLines = [
    { who: 'nikos', de: 'Hallo, ich bin Nikos. Ich bin neu im Kurs. Ich komme aus Griechenland. Und ihr?', tr: 'Merhaba, ben Nikos. Kursta yeniyim. Yunanistan’dan geliyorum. Ya siz?' },
    { who: 'aisha', de: 'Hallo, Nikos. Ich bin Aisha und ich komme aus Kenia. Ich bin Lehrerin von Beruf, aber ich arbeite als Taxifahrerin. Und du? Was machst du beruflich?', tr: 'Merhaba Nikos. Ben Aisha, Kenya’dan geliyorum. Öğretmenim ama taksi şoförü olarak çalışıyorum. Ya sen? İş olarak ne yapıyorsun?' },
    { who: 'nikos', de: 'Ich bin Mechatroniker. Ich repariere Autos. Aber nicht in Deutschland. Ich lerne jetzt Deutsch.', tr: 'Mekatronik teknisyeniyim. Araba tamir ediyorum. Ama Almanya’da değil. Şimdi Almanca öğreniyorum.' },
    { who: 'rami', de: 'Hi, ich bin Rami. Ich bin Altenpfleger. Aber ich arbeite nicht. Ich bin Hausmann.', tr: 'Selam, ben Rami. Yaşlı bakıcısıyım. Ama çalışmıyorum. Ev erkeğiyim.' },
    { who: 'aisha', de: 'Oh, du bist Hausmann? Du arbeitest auch!', tr: 'Oo, ev erkeği misin? Sen de çalışıyorsun!' },
    { who: 'rami', de: 'Ja, stimmt!', tr: 'Evet, doğru!' },
];
/** Heimatland – Deutschland: each person's two sentences, the words from their own box; the finished line is read by them. */
const fill = (key, who, before, answer, after, box, say) => ({ key, who, parts: [before, { options: box, answer }, after], say: { text: say, who } });
const nikosBox = ['Mechatroniker', 'lerne Deutsch', 'Lehrer', 'bin Koch'], aishaBox = ['Lehrerin', 'Taxifahrerin', 'Hausfrau', 'Verkäuferin'], ramiBox = ['Altenpfleger', 'Hausmann', 'Taxifahrer', 'Koch'];
exports.chatFill = [
    fill('n1', 'nikos', 'Heimatland: Ich bin ', 'Mechatroniker', '.', nikosBox, 'Ich bin Mechatroniker.'),
    fill('n2', 'nikos', 'Deutschland: Ich ', 'lerne Deutsch', '.', nikosBox, 'Ich lerne Deutsch.'),
    fill('a1', 'aisha', 'Heimatland: Ich bin ', 'Lehrerin', ' von Beruf.', aishaBox, 'Ich bin Lehrerin von Beruf.'),
    fill('a2', 'aisha', 'Deutschland: Ich arbeite als ', 'Taxifahrerin', '.', aishaBox, 'Ich arbeite als Taxifahrerin.'),
    fill('r1', 'rami', 'Heimatland: Ich bin ', 'Altenpfleger', '.', ramiBox, 'Ich bin Altenpfleger.'),
    fill('r2', 'rami', 'Deutschland: Ich bin ', 'Hausmann', '.', ramiBox, 'Ich bin Hausmann.'),
];
/** Exercise 3 · Mann oder Frau? Write the other form (the right one is read with its article). */
exports.otherForms = [
    ['der Lehrer', 'die', 'Lehrerin'], ['der Taxifahrer', 'die', 'Taxifahrerin'], ['der Koch', 'die', 'Köchin'], ['der Arzt', 'die', 'Ärztin'],
    ['der Hausmann', 'die', 'Hausfrau'], ['die Mechatronikerin', 'der', 'Mechatroniker'], ['die Verkäuferin', 'der', 'Verkäufer'], ['die Sängerin', 'der', 'Sänger'],
];
const otherFormSay = (row) => row[1] + ' ' + row[2];
exports.otherFormSay = otherFormSay;
/** Exercise 4 · Richtig schreiben: missing letters inside the word (one cell per letter); the word is read. */
exports.letterLines = [
    { text: 'der Fris___r', answers: [['eu']], say: 'der Friseur' },
    { text: 'die Verk___ferin', answers: [['äu']], say: 'die Verkäuferin' },
    { text: 'der Me___atroniker', answers: [['ch']], say: 'der Mechatroniker' },
    { text: 'die Poli___i___tin', answers: [['z'], ['s']], say: 'die Polizistin' },
    { text: 'die ___r___tin', answers: [['Ä'], ['z']], say: 'die Ärztin' },
    { text: 'die K___c___in', answers: [['ö'], ['h']], say: 'die Köchin' },
];
/** Exercise 5 · Was passt? The verbs of the box into the dialogue (one box for every gap; each line by its person). */
exports.dialogueBox = ['arbeite', 'bin', 'bist', 'lerne', 'machst', 'studiere'];
const verbGap = (answer) => ({ options: exports.dialogueBox, answer });
const said = (line) => line.parts.map(part => typeof part === 'string' ? part : part.answer).join('');
const withSay = (line) => ({ ...line, say: { text: said(line), who: line.who } });
exports.dialogueLines = [
    { key: 'd1', who: 'aisha', parts: ['Was ', verbGap('bist'), ' du von Beruf, Omar?'] },
    { key: 'd2', who: 'omar', parts: ['Ich bin Friseur. Aber ich ', verbGap('arbeite'), ' jetzt als Verkäufer. Was ', verbGap('machst'), ' du beruflich, Aisha?'] },
    { key: 'd3', who: 'aisha', parts: ['Ich ', verbGap('bin'), ' Lehrerin von Beruf. Aber ich arbeite als Taxifahrerin. Und du, Yasemin?'] },
    { key: 'd4', who: 'yasemin', parts: ['Ich bin Tierärztin. Aber ich arbeite jetzt nicht. Ich ', verbGap('lerne'), ' Deutsch.'] },
    { key: 'd5', who: 'mei', parts: ['Ich bin Ingenieurin von Beruf. Aber ich ', verbGap('studiere'), ' jetzt in Berlin.'] },
].map(withSay);
/** The finished dialogue, each line by its person ("Tamamlanan diyaloğu dinle"). */
exports.dialogueSay = exports.dialogueLines.map(line => line.say);
/** Exercise 6 · Prüfung: Sprachbausteine (two words for every gap, like Start Deutsch A1). */
const exam = (key, before, options, answer, after) => { const line = { key, parts: [before, { options, answer }, after] }; return { ...line, say: said(line) }; };
exports.examLines = [
    exam('p1', 'Hallo! Ich heiße Leyla Demir und ich komme ', ['in', 'aus'], 'aus', ' der Türkei.'),
    exam('p2', 'Ich bin Altenpflegerin ', ['von', 'bei'], 'von', ' Beruf.'),
    exam('p3', 'Aber ich arbeite ', ['in', 'als'], 'als', ' Verkäuferin.'),
    exam('p4', 'Ich wohne jetzt ', ['in', 'aus'], 'in', ' der Schweiz.'),
];
/** Exercise 7 · Und du? The learner's own sentences (the first two are needed; normalizeLoose text). */
exports.ownPrompts = [
    { question: 'Was bist du von Beruf?', pattern: /^ich bin [a-z]+( von beruf)?$/, placeholder: 'Ich bin … (von Beruf).' },
    { question: 'Arbeitest du jetzt?', pattern: /^((ja|nein) )?ich arbeite (jetzt )?(als [a-z]+( bei [a-z0-9 ]+)?|bei [a-z0-9 ]+|nicht)( jetzt)?$/, placeholder: 'Ich arbeite als … / Ich arbeite bei … / Ich arbeite jetzt nicht.' },
    { question: 'Was machst du noch?', pattern: /^ich (lerne|studiere|bin|repariere|mache|arbeite)( .+)?$/, placeholder: 'Ich lerne Deutsch. / Ich studiere.', optional: true },
];
/** The learner's own sentences stay on this device only (the learner asked, 2 November 2026): lib/lesson-sync.ts never
 * sends a `-own` or `-form` key of Lektion 2 to the account. */
exports.L2A_OWN_KEY = 'lernkoko-l2a-own';
const q = (question, options, say) => [question, options, options[0], say];
exports.berufeTest = [
    q('Was ___ du von Beruf?', ['bist', 'bin', 'sind'], 'Was bist du von Beruf?'),
    q('Ich bin ___ von Beruf. (kadın, aşçı)', ['Köchin', 'Koch', 'Kochin'], 'Ich bin Köchin von Beruf.'),
    q('der Arzt → kadın biçimi?', ['die Ärztin', 'die Arztin', 'die Ärzt'], 'die Ärztin'),
    q('Ich bin Lehrerin, ___ ich arbeite als Taxifahrerin.', ['aber', 'auch', 'nicht'], 'Ich bin Lehrerin, aber ich arbeite als Taxifahrerin.'),
    q('Ich arbeite ___ Verkäufer.', ['als', 'bei', 'von'], 'Ich arbeite als Verkäufer.'),
    q('Ich arbeite ___ Siemens.', ['bei', 'als', 'in'], 'Ich arbeite bei Siemens.'),
    q('„Şu an çalışmıyorum.“', ['Ich arbeite jetzt nicht.', 'Ich nicht arbeite jetzt.', 'Ich arbeite kein.'], 'Ich arbeite jetzt nicht.'),
    q('Was ___ Sie beruflich?', ['machen', 'machst', 'macht'], 'Was machen Sie beruflich?'),
    q('Du ___ als Kellner, richtig?', ['arbeitest', 'arbeitst', 'arbeiten'], 'Du arbeitest als Kellner, richtig?'),
    q('der Hausmann → kadın biçimi?', ['die Hausfrau', 'die Hausmannin', 'die Hausmann'], 'die Hausfrau'),
    q('Doğru yazılmış olan:', ['Ich bin Ingenieur.', 'Ich bin ein Ingenieur.', 'Ich bin der Ingenieur.'], 'Ich bin Ingenieur.'),
    q('„Stimmt! Richtig!“ ne demek?', ['Doğru! Evet, öyle!', 'Maalesef yanlış!', 'Bilmiyorum.'], ''),
];
/** Turkish questions and options of the test and the quick checks (for their language on the page). */
const isTurkishText = (text) => /[çğışİÇĞŞ]|\b(ne demek|erkek|etmek|onlar|ben|cevap)\b|Bilmiyorum|Selanik/.test(text);
exports.isTurkishText = isTurkishText;
exports.practiceItems = [
    { who: 'paul', question: 'Was bist du von Beruf?', answer: 'Ich bin Tierärztin von Beruf.', own: [0] },
    { who: 'paul', question: 'Arbeitest du jetzt?', answer: 'Ich arbeite jetzt nicht. Ich lerne Deutsch.', own: [1] },
    { who: 'omar', question: 'Was machst du beruflich?', answer: 'Ich arbeite als Verkäufer bei Edeka.', own: [2, 1] },
    { who: 'nora', question: 'Was sind Sie von Beruf, Frau Arslan?', answer: 'Ich bin Tierärztin von Beruf. Und Sie?' },
    { who: 'nikos', question: 'Ich repariere Autos. Was bin ich von Beruf?', answer: 'Du bist Mechatroniker!' },
];
/* ---------- steps ---------- */
/** The steps in order (ids are stable; the title is shown in the top bar). */
exports.berufeSteps = [
    { id: 'kapak', title: 'Kapak', kind: 'cover' },
    { id: 'meslekler', title: 'Kelimeler: meslekler', kind: 'teach' },
    { id: 'kelimeler', title: 'Kelimeler: diğerleri', kind: 'teach' },
    { id: 'kontrol', title: 'Kelime kontrolü', kind: 'teach' },
    { id: 'meslek-sor', title: 'Meslek sorma', kind: 'teach' },
    { id: 'kadin-erkek', title: 'Kadın ve erkek', kind: 'teach' },
    { id: 'als-bei', title: 'Ich arbeite als …', kind: 'teach' },
    { id: 'fiiller', title: 'Fiiller', kind: 'teach' },
    { id: 'kaliplar', title: 'Kalıplar', kind: 'teach' },
    { id: 'resim-sec', title: 'Alıştırma 1', kind: 'exercise' },
    { id: 'kurs-chat', title: 'Alıştırma 2', kind: 'exercise' },
    { id: 'diger-bicim', title: 'Alıştırma 3', kind: 'exercise' },
    { id: 'harfler', title: 'Alıştırma 4', kind: 'exercise' },
    { id: 'diyalog', title: 'Alıştırma 5', kind: 'exercise' },
    { id: 'sinav', title: 'Alıştırma 6', kind: 'exercise' },
    { id: 'und-du', title: 'Alıştırma 7', kind: 'exercise' },
    { id: 'test', title: 'Test', kind: 'test' },
    { id: 'konus', title: 'Konuş', kind: 'speak' },
    { id: 'ozet', title: 'Bitti', kind: 'end' },
];
const berufeStepIndex = (id) => exports.berufeSteps.findIndex(step => step.id === id);
exports.berufeStepIndex = berufeStepIndex;
/** Short names of the exercises for the strip under the tabs (a teaching step shows its own title). */
exports.berufeStepShort = { 'resim-sec': 'Resim – meslek', 'kurs-chat': 'Kurs sohbeti', 'diger-bicim': 'Diğer biçim', 'harfler': 'Eksik harfler', 'diyalog': 'Diyalog', 'sinav': 'Sınav tipi', 'und-du': 'Şimdi sen' };
const gapCount = (lines) => lines.reduce((n, line) => n + line.parts.filter(part => typeof part !== 'string').length, 0);
/** Every exercise is scored (gaps one by one, right at the first try). */
exports.berufeScored = [
    { id: 'resim-sec', total: exports.pictureItems.length },
    { id: 'kurs-chat', total: gapCount(exports.chatFill) },
    { id: 'diger-bicim', total: exports.otherForms.length },
    { id: 'harfler', total: exports.letterLines.reduce((n, line) => n + line.answers.length, 0) },
    { id: 'diyalog', total: gapCount(exports.dialogueLines) },
    { id: 'sinav', total: gapCount(exports.examLines) },
    { id: 'und-du', total: exports.ownPrompts.filter(prompt => !prompt.optional).length },
    { id: 'test', total: exports.berufeTest.length },
];
exports.berufeGroups = [
    { id: 'konu', label: 'Konu anlatımı', ids: exports.berufeSteps.filter(step => step.kind === 'teach').map(step => step.id) },
    { id: 'alistirmalar', label: 'Alıştırmalar', ids: exports.berufeSteps.filter(step => step.kind === 'exercise').map(step => step.id) },
    { id: 'test', label: 'Test', ids: ['test'] },
    { id: 'konus', label: 'Konuş', ids: ['konus'] },
];
/** Every word Teil A teaches (the jobs and the other words), for the count on the contents page. */
exports.berufeWordCount = exports.jobs.length + exports.otherWords.length;
exports.berufeParts = [
    { id: 'a', badge: 'A', title: 'Ich bin Koch.', lead: 'Meslek sorma ve söyleme: **Was bist du von Beruf?**, kadın meslek adları **-in**, **Ich arbeite als … / bei …** ve **nicht**.' },
    { id: 'b', badge: 'B', title: 'Wer ist das?', lead: 'Birini tanıtmak: **Das ist … Er / Sie kommt aus …**, **er · sie · sie** ile fiiller, **Woher? Wo? Wer?** ve büyük harf.' },
    { id: 'c', badge: 'C', title: 'Wir brauchen Hilfe.', lead: 'Sayılar **0–20** ve telefon numarası, toplama, yardım isteme: **Ich verstehe das nicht.**, form alanları, **mein / dein** ve **wir · ihr**.' },
    { id: 'd', badge: 'D', title: 'Ich verstehe das nicht.', lead: 'Bütün fiil tablosu, **Personalformular**, uzun kelimeler, **Wie bitte? Wie schreibt man das?** ve puanlı **Alles klar?** sınavı.' },
];
/** What Lektion 2 teaches ("Bu ünitede" on the left page of the contents): lib/unit-goals.ts. */
exports.berufeGoals = (0, unit_goals_1.unitGoalsFor)(exports.BERUFE_UNIT);
/** Every German text Teil A speaks (rendered as site voices by scripts/voices). */
function berufeSpeechTexts() {
    const out = new Set();
    const add = (text) => { if (text.trim())
        out.add(text.trim()); };
    const say = (item) => { if (item)
        add(typeof item === 'string' ? item : item.text); };
    for (const job of exports.jobs) {
        add(job.male);
        add(job.female);
        add((0, exports.pairSay)(job));
    }
    exports.otherWords.forEach(([, , example]) => add(example));
    exports.phrases.forEach(([de]) => add(de));
    for (const item of [...exports.wordChecks, ...exports.askChecks, ...exports.formChecks, ...exports.workChecks, ...exports.verbChecks])
        add(item.say);
    [...exports.askBeruf, ...exports.askBeruflich, ...exports.sayBeruf].forEach(([de]) => add(de));
    for (const line of [...exports.sieDialogue, ...exports.duDialogue, ...exports.fourPeople, ...exports.chatLines])
        add(line.say ?? line.de);
    exports.workSections.forEach(section => section.rows.forEach(([de]) => add(de)));
    exports.verbTable.forEach(row => add((0, exports.verbSay)(row)));
    add(exports.duArbeitest);
    exports.orderRows.forEach(row => add((0, exports.orderRowSay)(row)));
    exports.pictureItems.forEach(item => add(item.options[0]));
    exports.chatFill.forEach(line => say(line.say));
    exports.otherForms.forEach(row => add((0, exports.otherFormSay)(row)));
    exports.letterLines.forEach(line => add(line.say));
    exports.dialogueSay.forEach(say);
    exports.examLines.forEach(line => say(line.say));
    exports.ownPrompts.forEach(prompt => add(prompt.question));
    exports.berufeTest.forEach(question => add(question[3]));
    exports.practiceItems.forEach(item => { add(item.question); add(item.answer); });
    return [...out];
}
