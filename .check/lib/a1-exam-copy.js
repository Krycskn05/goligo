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
exports.examPackLanguage = exports.examPackLanguages = exports.isExamLanguage = exports.examCopy = exports.EXAM_LANGUAGES = void 0;
exports.examText = examText;
exports.registerExamPack = registerExamPack;
exports.loadExamPack = loadExamPack;
exports.examWhy = examWhy;
const copy_fill_1 = require("./copy-fill");
/**
 * The texts of A1 sınavı (/a1-sinavi) in the five lesson languages — Turkish, German, English, Arabic, Ukrainian
 * (CLAUDE.md: every new part in these five). Another site language reads English. The exam papers themselves are
 * German and are not here; the explanations of the answers are Turkish in the exam files and translated in
 * lib/a1-exam-packs/<language>.json by item id (`loadExamPack`, `examWhy`).
 */
exports.EXAM_LANGUAGES = ['tr', 'de', 'en', 'ar', 'uk'];
exports.examCopy = {
    title: ['A1 sınavı', 'A1-Prüfung', 'A1 exam', 'امتحان A1', 'Іспит A1'],
    lead: ['Start Deutsch 1 tarzında deneme sınavları: kâğıt, süre ve puan gerçek sınavdaki gibi.', 'Übungsprüfungen wie „Start Deutsch 1“: Aufgabenblatt, Zeit und Punkte wie in der echten Prüfung.', 'Practice exams in the style of “Start Deutsch 1”: paper, time and points like the real exam.', 'امتحانات تدريبية على طريقة «Start Deutsch 1»: الورقة والوقت والنقاط كما في الامتحان الحقيقي.', 'Тренувальні іспити у форматі «Start Deutsch 1»: аркуш, час і бали як на справжньому іспиті.'],
    aboutTitle: ['Sınav nasıl?', 'So ist die Prüfung', 'How the exam works', 'كيف يكون الامتحان؟', 'Як проходить іспит'],
    about: ['Yazılı sınav üç bölümdür: Hören (yaklaşık 20 dakika), Lesen (25 dakika) ve Schreiben (20 dakika). Sonra sözlü sınav gelir. Her bölüm 15 puandır; geçmek için toplamda %60 gerekir. Sözlük kullanılmaz.', 'Die schriftliche Prüfung hat drei Teile: Hören (circa 20 Minuten), Lesen (25 Minuten) und Schreiben (20 Minuten). Danach kommt die mündliche Prüfung. Jeder Teil hat 15 Punkte; zum Bestehen braucht man insgesamt 60 %. Wörterbücher sind nicht erlaubt.', 'The written exam has three parts: Hören (about 20 minutes), Lesen (25 minutes) and Schreiben (20 minutes). The speaking exam follows. Each part has 15 points; you need 60% overall to pass. Dictionaries are not allowed.', 'الامتحان الكتابي ثلاثة أقسام: Hören (نحو 20 دقيقة)، Lesen (25 دقيقة) و Schreiben (20 دقيقة). بعده يأتي الامتحان الشفهي. لكل قسم 15 نقطة، وللنجاح تحتاج إلى 60٪ من المجموع. القواميس غير مسموحة.', 'Письмовий іспит має три частини: Hören (близько 20 хвилин), Lesen (25 хвилин) і Schreiben (20 хвилин). Потім — усний іспит. Кожна частина дає 15 балів; щоб скласти, потрібно 60 % загалом. Словники заборонені.'],
    modules: ['Sınav bölümleri', 'Prüfungsteile', 'Parts of the exam', 'أقسام الامتحان', 'Частини іспиту'],
    soon: ['Yakında', 'Kommt bald', 'Coming soon', 'قريبًا', 'Незабаром'],
    hoerenSoon: ['Dinleme bölümü yakında eklenecek.', 'Der Teil Hören kommt bald dazu.', 'The listening part will be added soon.', 'سيُضاف قسم الاستماع قريبًا.', 'Частину з аудіювання буде додано незабаром.'],
    schreibenSoon: ['Yazma bölümü yakında eklenecek.', 'Der Teil Schreiben kommt bald dazu.', 'The writing part will be added soon.', 'سيُضاف قسم الكتابة قريبًا.', 'Частину з письма буде додано незабаром.'],
    examCount: ['{n} sınav', '{n} Prüfungen', '{n} exams', '{n} امتحانات', '{n} іспитів'],
    minutes: ['{n} dakika', '{n} Minuten', '{n} minutes', '{n} دقيقة', '{n} хвилин'],
    questions: ['{n} soru', '{n} Aufgaben', '{n} questions', '{n} سؤالًا', '{n} завдань'],
    examN: ['Sınav {n}', 'Prüfung {n}', 'Exam {n}', 'الامتحان {n}', 'Іспит {n}'],
    examsTitle: ['Lesen sınavları', 'Lesen: die Prüfungen', 'Lesen exams', 'امتحانات Lesen', 'Іспити Lesen'],
    solved: ['Çözülen sınav: {n}/{total}', 'Gelöste Prüfungen: {n}/{total}', 'Exams solved: {n}/{total}', 'الامتحانات المحلولة: {n}/{total}', 'Розв’язано іспитів: {n}/{total}'],
    start: ['Sınavı başlat', 'Prüfung starten', 'Start the exam', 'ابدأ الامتحان', 'Почати іспит'],
    open: ['Aç', 'Öffnen', 'Open', 'افتح', 'Відкрити'],
    resume: ['Devam et', 'Weitermachen', 'Continue', 'تابع', 'Продовжити'],
    again: ['Tekrar çöz', 'Noch einmal lösen', 'Solve again', 'حُلَّه مرة أخرى', 'Розв’язати ще раз'],
    review: ['Cevapları gör', 'Lösungen ansehen', 'See the answers', 'اعرض الإجابات', 'Переглянути відповіді'],
    notStarted: ['Henüz çözülmedi', 'Noch nicht gelöst', 'Not solved yet', 'لم يُحَلّ بعد', 'Ще не розв’язано'],
    inProgress: ['Yarıda: {n}/{total} işaretli', 'Angefangen: {n}/{total} markiert', 'In progress: {n}/{total} marked', 'قيد الحل: {n}/{total}', 'Розпочато: позначено {n}/{total}'],
    best: ['En iyi sonuç: {right}/{total}', 'Bestes Ergebnis: {right}/{total}', 'Best result: {right}/{total}', 'أفضل نتيجة: {right}/{total}', 'Найкращий результат: {right}/{total}'],
    passed: ['Geçti', 'Bestanden', 'Passed', 'ناجح', 'Складено'],
    failed: ['Sınırın altında', 'Unter der Grenze', 'Below the pass mark', 'دون حدّ النجاح', 'Нижче прохідного бала'],
    rulesTitle: ['Başlamadan önce', 'Vor dem Start', 'Before you start', 'قبل البدء', 'Перед початком'],
    rule1: ['Lesen üç parçadır (Teil 1–3), toplam 15 soru. Her soru tek dokunuştur: Richtig / Falsch ya da a / b.', 'Lesen hat drei Teile (Teil 1–3) mit 15 Aufgaben. Jede Aufgabe ist ein Tipp: Richtig / Falsch oder a / b.', 'Lesen has three parts (Teil 1–3) with 15 questions. Every question is one tap: Richtig / Falsch or a / b.', 'قسم Lesen ثلاثة أجزاء (Teil 1–3) فيها 15 سؤالًا. كل سؤال بلمسة واحدة: Richtig / Falsch أو a / b.', 'Lesen має три частини (Teil 1–3), усього 15 завдань. Кожне завдання — один дотик: Richtig / Falsch або a / b.'],
    rule2: ['Süre 25 dakikadır. Süre dolunca sınav kapanmaz; istersen süresiz de çözebilirsin.', 'Die Zeit ist 25 Minuten. Am Ende der Zeit schließt die Prüfung nicht; du kannst auch ohne Zeit lösen.', 'The time is 25 minutes. The exam does not close when the time is up; you can also solve it without a timer.', 'الوقت 25 دقيقة. لا يُغلق الامتحان عند انتهاء الوقت، ويمكنك أيضًا الحل من دون مؤقّت.', 'Час — 25 хвилин. Коли час спливе, іспит не закриється; можна розв’язувати й без таймера.'],
    rule3: ['Doğru cevaplar ve açıklamalar sınavı bitirince gösterilir. O zamana kadar işaretini değiştirebilirsin.', 'Die Lösungen und Erklärungen siehst du nach der Abgabe. Bis dahin kannst du deine Markierung ändern.', 'You see the answers and explanations after you hand in the exam. Until then you can change your marks.', 'تظهر الإجابات الصحيحة والشروح بعد تسليم الامتحان. حتى ذلك الحين يمكنك تغيير علاماتك.', 'Правильні відповіді й пояснення з’являться після здачі. До того можна змінювати свої позначки.'],
    rule4: ['Gerçek sınavda sözlük yoktur. Burada da sözlüksüz dene.', 'In der echten Prüfung gibt es kein Wörterbuch. Versuch es auch hier ohne.', 'There is no dictionary in the real exam. Try without one here, too.', 'لا قاموس في الامتحان الحقيقي. جرّب هنا أيضًا من دونه.', 'На справжньому іспиті словника немає. Спробуй і тут без нього.'],
    timed: ['Süreli (25 dakika)', 'Mit Zeit (25 Minuten)', 'Timed (25 minutes)', 'بمؤقّت (25 دقيقة)', 'З таймером (25 хвилин)'],
    untimed: ['Süresiz', 'Ohne Zeit', 'No timer', 'من دون مؤقّت', 'Без таймера'],
    timeLeft: ['Kalan süre', 'Restzeit', 'Time left', 'الوقت المتبقي', 'Залишилось часу'],
    hideTimer: ['Süreyi gizle', 'Zeit ausblenden', 'Hide the time', 'أخفِ الوقت', 'Сховати час'],
    showTimer: ['Süreyi göster', 'Zeit zeigen', 'Show the time', 'أظهر الوقت', 'Показати час'],
    timeUp: ['Süre doldu. Gerçek sınavda kâğıtlar şimdi toplanır; burada devam edebilirsin.', 'Die Zeit ist um. In der echten Prüfung ist jetzt Schluss; hier kannst du weitermachen.', 'Time is up. In the real exam the papers are collected now; here you can carry on.', 'انتهى الوقت. في الامتحان الحقيقي تُجمع الأوراق الآن؛ هنا يمكنك المتابعة.', 'Час вийшов. На справжньому іспиті аркуші зараз збирають; тут можна продовжити.'],
    marked: ['{n}/{total} işaretli', '{n}/{total} markiert', '{n}/{total} marked', '{n}/{total} مُعلَّمة', 'позначено {n}/{total}'],
    next: ['İleri', 'Weiter', 'Next', 'التالي', 'Далі'],
    back: ['Geri', 'Zurück', 'Back', 'السابق', 'Назад'],
    finish: ['Sınavı bitir', 'Prüfung abgeben', 'Hand in the exam', 'سلِّم الامتحان', 'Здати іспит'],
    openLeft: ['Boş soru: {n}. Boş sorular yanlış sayılır.', 'Offene Aufgaben: {n}. Offene Aufgaben zählen als falsch.', 'Open questions: {n}. Open questions count as wrong.', 'أسئلة بلا إجابة: {n}. السؤال المتروك يُحسب خطأً.', 'Завдань без відповіді: {n}. Вони рахуються як помилки.'],
    finishAnyway: ['Yine de bitir', 'Trotzdem abgeben', 'Hand in anyway', 'سلِّم على أي حال', 'Усе одно здати'],
    keepSolving: ['Çözmeye devam et', 'Weiter lösen', 'Keep solving', 'تابع الحل', 'Розв’язувати далі'],
    saved: ['İşaretlerin saklanır; sınava sonra devam edebilirsin.', 'Deine Markierungen bleiben gespeichert; du kannst später weitermachen.', 'Your marks are saved; you can continue later.', 'علاماتك محفوظة؛ يمكنك المتابعة لاحقًا.', 'Твої позначки зберігаються; можна продовжити пізніше.'],
    guestNote: ['Üye olmadan deniyorsun: bu sınav açık, sonucun kaydedilmez.', 'Du probierst ohne Konto: Diese Prüfung ist offen, dein Ergebnis wird nicht gespeichert.', 'You are trying without an account: this exam is open, and your result is not saved.', 'أنت تجرّب من دون حساب: هذا الامتحان مفتوح، ولا تُحفظ نتيجتك.', 'Ти пробуєш без облікового запису: цей іспит відкритий, результат не зберігається.'],
    resultTitle: ['Sonuç', 'Ergebnis', 'Result', 'النتيجة', 'Результат'],
    points: ['{right} / {total} puan', '{right} / {total} Punkte', '{right} / {total} points', '{right} / {total} نقطة', '{right} / {total} балів'],
    resultPass: ['Geçme sınırının üstündesin: sınır {mark}/{total} (%60).', 'Du bist über der Bestehensgrenze: {mark}/{total} (60 %).', 'You are above the pass mark: {mark}/{total} (60%).', 'أنت فوق حدّ النجاح: {mark}/{total} (60٪).', 'Ти вище прохідного бала: {mark}/{total} (60 %).'],
    resultFail: ['Geçme sınırı {mark}/{total} (%60). Yanlışlarını incele ve tekrar dene.', 'Die Bestehensgrenze ist {mark}/{total} (60 %). Sieh dir deine Fehler an und versuch es noch einmal.', 'The pass mark is {mark}/{total} (60%). Look at your mistakes and try again.', 'حدّ النجاح {mark}/{total} (60٪). راجع أخطاءك وحاول مرة أخرى.', 'Прохідний бал — {mark}/{total} (60 %). Переглянь помилки і спробуй ще раз.'],
    resultCert: ['Gerçek sınavda bu bölüm {points}/25 puan eder (puan × 1,66). %60, bütün bölümlerin toplamında aranır.', 'In der echten Prüfung sind das {points} von 25 Punkten (Punkte × 1,66). Die 60 % zählen für alle Teile zusammen.', 'In the real exam this is {points} of 25 points (points × 1.66). The 60% counts over all parts together.', 'في الامتحان الحقيقي يساوي هذا {points} من 25 نقطة (النقاط × 1,66). نسبة 60٪ تُحسب على مجموع الأقسام كلها.', 'На справжньому іспиті це {points} із 25 балів (бали × 1,66). 60 % рахують за всі частини разом.'],
    timeUsed: ['Süre: {time}', 'Zeit: {time}', 'Time: {time}', 'الوقت: {time}', 'Час: {time}'],
    reviewTitle: ['Cevaplar ve açıklamalar', 'Lösungen und Erklärungen', 'Answers and explanations', 'الإجابات والشروح', 'Відповіді та пояснення'],
    yourAnswer: ['Senin cevabın', 'Deine Antwort', 'Your answer', 'إجابتك', 'Твоя відповідь'],
    rightAnswer: ['Doğru cevap', 'Richtige Lösung', 'Right answer', 'الإجابة الصحيحة', 'Правильна відповідь'],
    noAnswer: ['Boş bıraktın', 'Nicht markiert', 'Left open', 'تركته فارغًا', 'Не позначено'],
    correct: ['Doğru', 'Richtig gelöst', 'Correct', 'صحيح', 'Правильно'],
    wrong: ['Yanlış', 'Falsch gelöst', 'Wrong', 'خطأ', 'Неправильно'],
    toExams: ['Sınavlara dön', 'Zu den Prüfungen', 'Back to the exams', 'عُد إلى الامتحانات', 'До іспитів'],
    nextExam: ['Sonraki sınav', 'Nächste Prüfung', 'Next exam', 'الامتحان التالي', 'Наступний іспит'],
    loading: ['Sınav yükleniyor…', 'Die Prüfung wird geladen …', 'Loading the exam…', 'جارٍ تحميل الامتحان…', 'Іспит завантажується…'],
    hint1: ['1–5. cümleler doğru mu (+), yanlış mı (–)? İşaretle.', 'Sind die Sätze 1–5 richtig (+) oder falsch (–)? Markiere.', 'Are statements 1–5 right (+) or wrong (–)? Mark them.', 'هل الجمل 1–5 صحيحة (+) أم خاطئة (–)؟ ضع العلامة.', 'Твердження 1–5 правильні (+) чи неправильні (–)? Познач.'],
    hint2ad: ['Metinleri ve 6–10. görevleri oku. Hangi ilan uyuyor? a ya da b’yi işaretle.', 'Lies die Texte und die Aufgaben 6–10. Welche Anzeige passt? Markiere a oder b.', 'Read the texts and tasks 6–10. Which ad fits? Mark a or b.', 'اقرأ النصوص والمهام 6–10. أيّ إعلان يناسب؟ اختر a أو b.', 'Прочитай тексти й завдання 6–10. Яке оголошення підходить? Познач a або b.'],
    hint2web: ['Metinleri ve 6–10. görevleri oku. Bilgiyi hangi sayfada bulursun? a ya da b’yi işaretle.', 'Lies die Texte und die Aufgaben 6–10. Auf welcher Seite findest du die Information? Markiere a oder b.', 'Read the texts and tasks 6–10. On which page do you find the information? Mark a or b.', 'اقرأ النصوص والمهام 6–10. في أيّ صفحة تجد المعلومة؟ اختر a أو b.', 'Прочитай тексти й завдання 6–10. На якій сторінці є потрібна інформація? Познач a або b.'],
    hint3: ['Metinleri ve 11–15. görevleri oku. Doğru mu (+), yanlış mı (–)? İşaretle.', 'Lies die Texte und die Aufgaben 11–15. Richtig (+) oder falsch (–)? Markiere.', 'Read the texts and tasks 11–15. Right (+) or wrong (–)? Mark them.', 'اقرأ النصوص والمهام 11–15. صحيح (+) أم خطأ (–)؟ ضع العلامة.', 'Прочитай тексти й завдання 11–15. Правильно (+) чи неправильно (–)? Познач.'],
    tipsTitle: ['Lesen için üç ipucu', 'Drei Tipps für Lesen', 'Three tips for Lesen', 'ثلاث نصائح لقسم Lesen', 'Три поради для Lesen'],
    tip1: ['Önce cümleyi oku, sonra metinde yerini ara. Her kelimeyi anlaman gerekmez.', 'Lies zuerst die Aufgabe, dann such die Stelle im Text. Du musst nicht jedes Wort verstehen.', 'Read the task first, then look for the place in the text. You do not need to understand every word.', 'اقرأ المهمة أولًا ثم ابحث عن موضعها في النص. لا يلزم أن تفهم كل كلمة.', 'Спочатку прочитай завдання, потім шукай місце в тексті. Не обов’язково розуміти кожне слово.'],
    tip2: ['Gün, saat, tarih ve sayılara dikkat et; tuzak çoğu zaman oradadır: *nur*, *erst*, *ab*, *bis*, *außer*.', 'Achte auf Tage, Uhrzeiten, Daten und Zahlen; dort ist oft die Falle: *nur*, *erst*, *ab*, *bis*, *außer*.', 'Watch the days, times, dates and numbers; the trap is often there: *nur*, *erst*, *ab*, *bis*, *außer*.', 'انتبه إلى الأيام والساعات والتواريخ والأرقام؛ فهناك الفخّ غالبًا: *nur*, *erst*, *ab*, *bis*, *außer*.', 'Зважай на дні, час, дати й числа; пастка часто саме там: *nur*, *erst*, *ab*, *bis*, *außer*.'],
    tip3: ['Aynı kelime iki ilanda da geçebilir. İhtiyaca uyan ayrıntıyı ara: kim, ne zaman, kaç kişi, satılık mı kiralık mı?', 'Dasselbe Wort kann in beiden Anzeigen stehen. Such das Detail, das passt: wer, wann, wie viele, kaufen oder mieten?', 'The same word can be in both ads. Look for the detail that fits: who, when, how many, buy or rent?', 'قد ترد الكلمة نفسها في الإعلانين. ابحث عن التفصيل المناسب: من، متى، كم شخصًا، شراء أم إيجار؟', 'Те саме слово може бути в обох оголошеннях. Шукай деталь, яка підходить: хто, коли, скільки, купити чи орендувати?'],
};
const index = (language) => { const at = exports.EXAM_LANGUAGES.indexOf(language); return at < 0 ? 2 : at; };
/** A text of the exam section in the page's language ({name} filled in); English for a language without one. */
function examText(language, key, params) {
    const text = exports.examCopy[key][index(language)];
    return params ? (0, copy_fill_1.fillText)(text, params) : text;
}
/** Whether the page's language has its own exam texts (Turkish, German, English, Arabic, Ukrainian). */
const isExamLanguage = (language) => exports.EXAM_LANGUAGES.includes(language);
exports.isExamLanguage = isExamLanguage;
const loaders = {
    en: () => Promise.resolve().then(() => __importStar(require('./a1-exam-packs/en.json'))), ar: () => Promise.resolve().then(() => __importStar(require('./a1-exam-packs/ar.json'))), uk: () => Promise.resolve().then(() => __importStar(require('./a1-exam-packs/uk.json'))), de: () => Promise.resolve().then(() => __importStar(require('./a1-exam-packs/de.json'))),
};
exports.examPackLanguages = Object.keys(loaders);
const packs = new Map();
const pending = new Map();
function registerExamPack(language, pack) { packs.set(language, pack); }
/** The language whose explanations a page shows: its own, Turkish as written, or English for the other site languages. */
const examPackLanguage = (language) => language === 'tr' || language in loaders ? language : 'en';
exports.examPackLanguage = examPackLanguage;
/** Loads the explanations of a language once. Never rejects: on failure the Turkish explanations are shown. */
function loadExamPack(language) {
    const id = (0, exports.examPackLanguage)(language);
    const load = loaders[id];
    if (!load || packs.has(id))
        return Promise.resolve();
    let job = pending.get(id);
    if (!job) {
        job = load().then(module => { const data = (module.default ?? module); registerExamPack(id, data && typeof data === 'object' ? data : {}); }).catch(() => { }).finally(() => { pending.delete(id); });
        pending.set(id, job);
    }
    return job;
}
/** The explanation of an item in the page's language (the Turkish one when the pack has none). */
function examWhy(language, id, turkish) {
    const pack = (0, exports.examPackLanguage)(language);
    const text = pack === 'tr' ? undefined : packs.get(pack)?.[id];
    return text ? { text, lang: pack } : { text: turkish, lang: 'tr' };
}
