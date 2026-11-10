import {fillText} from './copy-fill';

/**
 * The texts of A1 sınavı (/a1-sinavi) in the five lesson languages — Turkish, German, English, Arabic, Ukrainian
 * (CLAUDE.md: every new part in these five). Another site language reads English. The exam papers themselves are
 * German and are not here; the explanations of the answers are Turkish in the exam files and translated in
 * lib/a1-exam-packs/<language>.json by item id (`loadExamPack`, `examWhy`).
 */
export const EXAM_LANGUAGES=['tr','de','en','ar','uk'] as const;
export type ExamLanguage=typeof EXAM_LANGUAGES[number];
type Texts=readonly [tr:string,de:string,en:string,ar:string,uk:string];

export const examCopy={
 title:['A1 sınavı','A1-Prüfung','A1 exam','امتحان A1','Іспит A1'],
 lead:['Start Deutsch 1 tarzında deneme sınavları: kâğıt, süre ve puan gerçek sınavdaki gibi.','Übungsprüfungen wie „Start Deutsch 1“: Aufgabenblatt, Zeit und Punkte wie in der echten Prüfung.','Practice exams in the style of “Start Deutsch 1”: paper, time and points like the real exam.','امتحانات تدريبية على طريقة «Start Deutsch 1»: الورقة والوقت والنقاط كما في الامتحان الحقيقي.','Тренувальні іспити у форматі «Start Deutsch 1»: аркуш, час і бали як на справжньому іспиті.'],
 aboutTitle:['Sınav nasıl?','So ist die Prüfung','How the exam works','كيف يكون الامتحان؟','Як проходить іспит'],
 about:['Yazılı sınav üç bölümdür: Hören (yaklaşık 20 dakika), Lesen (25 dakika) ve Schreiben (20 dakika). Sonra sözlü sınav gelir. Her bölüm 15 puandır; geçmek için toplamda %60 gerekir. Sözlük kullanılmaz. Her sınavın Hören ve Lesen kâğıdı ayrı çözülür.','Die schriftliche Prüfung hat drei Teile: Hören (circa 20 Minuten), Lesen (25 Minuten) und Schreiben (20 Minuten). Danach kommt die mündliche Prüfung. Jeder Teil hat 15 Punkte; zum Bestehen braucht man insgesamt 60 %. Wörterbücher sind nicht erlaubt. Hören und Lesen löst du hier einzeln.','The written exam has three parts: Hören (about 20 minutes), Lesen (25 minutes) and Schreiben (20 minutes). The speaking exam follows. Each part has 15 points; you need 60% overall to pass. Dictionaries are not allowed. Here you solve Hören and Lesen one at a time.','الامتحان الكتابي ثلاثة أقسام: Hören (نحو 20 دقيقة)، Lesen (25 دقيقة) و Schreiben (20 دقيقة). بعده يأتي الامتحان الشفهي. لكل قسم 15 نقطة، وللنجاح تحتاج إلى 60٪ من المجموع. القواميس غير مسموحة. هنا تحلّ Hören و Lesen كلًّا على حدة.','Письмовий іспит має три частини: Hören (близько 20 хвилин), Lesen (25 хвилин) і Schreiben (20 хвилин). Потім — усний іспит. Кожна частина дає 15 балів; щоб скласти, потрібно 60 % загалом. Словники заборонені. Тут Hören і Lesen розв’язують окремо.'],
 modules:['Sınav bölümleri','Prüfungsteile','Parts of the exam','أقسام الامتحان','Частини іспиту'],
 soon:['Yakında','Kommt bald','Coming soon','قريبًا','Незабаром'],
 schreibenSoon:['Yazma bölümü yakında eklenecek.','Der Teil Schreiben kommt bald dazu.','The writing part will be added soon.','سيُضاف قسم الكتابة قريبًا.','Частину з письма буде додано незабаром.'],
 examCount:['{n} sınav','{n} Prüfungen','{n} exams','{n} امتحانات','{n} іспитів'],
 minutes:['{n} dakika','{n} Minuten','{n} minutes','{n} دقيقة','{n} хвилин'],
 questions:['{n} soru','{n} Aufgaben','{n} questions','{n} سؤالًا','{n} завдань'],
 examN:['Sınav {n}','Prüfung {n}','Exam {n}','الامتحان {n}','Іспит {n}'],
 examsTitle:['Sınavlar','Die Prüfungen','The exams','الامتحانات','Іспити'],
 solved:['Çözülen sınav: {n}/{total}','Gelöste Prüfungen: {n}/{total}','Exams solved: {n}/{total}','الامتحانات المحلولة: {n}/{total}','Розв’язано іспитів: {n}/{total}'],
 start:['Sınavı başlat','Prüfung starten','Start the exam','ابدأ الامتحان','Почати іспит'],
 open:['Aç','Öffnen','Open','افتح','Відкрити'],
 resume:['Devam et','Weitermachen','Continue','تابع','Продовжити'],
 again:['Tekrar çöz','Noch einmal lösen','Solve again','حُلَّه مرة أخرى','Розв’язати ще раз'],
 review:['Cevapları gör','Lösungen ansehen','See the answers','اعرض الإجابات','Переглянути відповіді'],
 notStarted:['Henüz çözülmedi','Noch nicht gelöst','Not solved yet','لم يُحَلّ بعد','Ще не розв’язано'],
 inProgress:['Yarıda: {n}/{total} işaretli','Angefangen: {n}/{total} markiert','In progress: {n}/{total} marked','قيد الحل: {n}/{total}','Розпочато: позначено {n}/{total}'],
 best:['En iyi sonuç: {right}/{total}','Bestes Ergebnis: {right}/{total}','Best result: {right}/{total}','أفضل نتيجة: {right}/{total}','Найкращий результат: {right}/{total}'],
 passed:['Geçti','Bestanden','Passed','ناجح','Складено'],
 failed:['Sınırın altında','Unter der Grenze','Below the pass mark','دون حدّ النجاح','Нижче прохідного бала'],
 rulesTitle:['Başlamadan önce','Vor dem Start','Before you start','قبل البدء','Перед початком'],
 rule1:['Lesen üç parçadır (Teil 1–3), toplam 15 soru. Her soru tek dokunuştur: Richtig / Falsch ya da a / b.','Lesen hat drei Teile (Teil 1–3) mit 15 Aufgaben. Jede Aufgabe ist ein Tipp: Richtig / Falsch oder a / b.','Lesen has three parts (Teil 1–3) with 15 questions. Every question is one tap: Richtig / Falsch or a / b.','قسم Lesen ثلاثة أجزاء (Teil 1–3) فيها 15 سؤالًا. كل سؤال بلمسة واحدة: Richtig / Falsch أو a / b.','Lesen має три частини (Teil 1–3), усього 15 завдань. Кожне завдання — один дотик: Richtig / Falsch або a / b.'],
 rule2:['Süre 25 dakikadır. Süre dolunca sınav kapanmaz; istersen süresiz de çözebilirsin.','Die Zeit ist 25 Minuten. Am Ende der Zeit schließt die Prüfung nicht; du kannst auch ohne Zeit lösen.','The time is 25 minutes. The exam does not close when the time is up; you can also solve it without a timer.','الوقت 25 دقيقة. لا يُغلق الامتحان عند انتهاء الوقت، ويمكنك أيضًا الحل من دون مؤقّت.','Час — 25 хвилин. Коли час спливе, іспит не закриється; можна розв’язувати й без таймера.'],
 rule3:['Doğru cevaplar ve açıklamalar sınavı bitirince gösterilir. O zamana kadar işaretini değiştirebilirsin.','Die Lösungen und Erklärungen siehst du nach der Abgabe. Bis dahin kannst du deine Markierung ändern.','You see the answers and explanations after you hand in the exam. Until then you can change your marks.','تظهر الإجابات الصحيحة والشروح بعد تسليم الامتحان. حتى ذلك الحين يمكنك تغيير علاماتك.','Правильні відповіді й пояснення з’являться після здачі. До того можна змінювати свої позначки.'],
 rule4:['Gerçek sınavda sözlük yoktur. Burada da sözlüksüz dene.','In der echten Prüfung gibt es kein Wörterbuch. Versuch es auch hier ohne.','There is no dictionary in the real exam. Try without one here, too.','لا قاموس في الامتحان الحقيقي. جرّب هنا أيضًا من دونه.','На справжньому іспиті словника немає. Спробуй і тут без нього.'],
 timed:['Süreli (25 dakika)','Mit Zeit (25 Minuten)','Timed (25 minutes)','بمؤقّت (25 دقيقة)','З таймером (25 хвилин)'],
 untimed:['Süresiz','Ohne Zeit','No timer','من دون مؤقّت','Без таймера'],
 timeLeft:['Kalan süre','Restzeit','Time left','الوقت المتبقي','Залишилось часу'],
 hideTimer:['Süreyi gizle','Zeit ausblenden','Hide the time','أخفِ الوقت','Сховати час'],
 showTimer:['Süreyi göster','Zeit zeigen','Show the time','أظهر الوقت','Показати час'],
 timeUp:['Süre doldu. Gerçek sınavda kâğıtlar şimdi toplanır; burada devam edebilirsin.','Die Zeit ist um. In der echten Prüfung ist jetzt Schluss; hier kannst du weitermachen.','Time is up. In the real exam the papers are collected now; here you can carry on.','انتهى الوقت. في الامتحان الحقيقي تُجمع الأوراق الآن؛ هنا يمكنك المتابعة.','Час вийшов. На справжньому іспиті аркуші зараз збирають; тут можна продовжити.'],
 marked:['{n}/{total} işaretli','{n}/{total} markiert','{n}/{total} marked','{n}/{total} مُعلَّمة','позначено {n}/{total}'],
 next:['İleri','Weiter','Next','التالي','Далі'],
 back:['Geri','Zurück','Back','السابق','Назад'],
 finish:['Sınavı bitir','Prüfung abgeben','Hand in the exam','سلِّم الامتحان','Здати іспит'],
 openLeft:['Boş soru: {n}. Boş sorular yanlış sayılır.','Offene Aufgaben: {n}. Offene Aufgaben zählen als falsch.','Open questions: {n}. Open questions count as wrong.','أسئلة بلا إجابة: {n}. السؤال المتروك يُحسب خطأً.','Завдань без відповіді: {n}. Вони рахуються як помилки.'],
 finishAnyway:['Yine de bitir','Trotzdem abgeben','Hand in anyway','سلِّم على أي حال','Усе одно здати'],
 keepSolving:['Çözmeye devam et','Weiter lösen','Keep solving','تابع الحل','Розв’язувати далі'],
 saved:['İşaretlerin saklanır; sınava sonra devam edebilirsin.','Deine Markierungen bleiben gespeichert; du kannst später weitermachen.','Your marks are saved; you can continue later.','علاماتك محفوظة؛ يمكنك المتابعة لاحقًا.','Твої позначки зберігаються; можна продовжити пізніше.'],
 guestNote:['Üye olmadan deniyorsun: bu sınav açık, sonucun kaydedilmez.','Du probierst ohne Konto: Diese Prüfung ist offen, dein Ergebnis wird nicht gespeichert.','You are trying without an account: this exam is open, and your result is not saved.','أنت تجرّب من دون حساب: هذا الامتحان مفتوح، ولا تُحفظ نتيجتك.','Ти пробуєш без облікового запису: цей іспит відкритий, результат не зберігається.'],
 resultTitle:['Sonuç','Ergebnis','Result','النتيجة','Результат'],
 points:['{right} / {total} puan','{right} / {total} Punkte','{right} / {total} points','{right} / {total} نقطة','{right} / {total} балів'],
 resultPass:['Geçme sınırının üstündesin: sınır {mark}/{total} (%60).','Du bist über der Bestehensgrenze: {mark}/{total} (60 %).','You are above the pass mark: {mark}/{total} (60%).','أنت فوق حدّ النجاح: {mark}/{total} (60٪).','Ти вище прохідного бала: {mark}/{total} (60 %).'],
 resultFail:['Geçme sınırı {mark}/{total} (%60). Yanlışlarını incele ve tekrar dene.','Die Bestehensgrenze ist {mark}/{total} (60 %). Sieh dir deine Fehler an und versuch es noch einmal.','The pass mark is {mark}/{total} (60%). Look at your mistakes and try again.','حدّ النجاح {mark}/{total} (60٪). راجع أخطاءك وحاول مرة أخرى.','Прохідний бал — {mark}/{total} (60 %). Переглянь помилки і спробуй ще раз.'],
 resultCert:['Gerçek sınavda bu bölüm {points}/25 puan eder (puan × 1,66). %60, bütün bölümlerin toplamında aranır.','In der echten Prüfung sind das {points} von 25 Punkten (Punkte × 1,66). Die 60 % zählen für alle Teile zusammen.','In the real exam this is {points} of 25 points (points × 1.66). The 60% counts over all parts together.','في الامتحان الحقيقي يساوي هذا {points} من 25 نقطة (النقاط × 1,66). نسبة 60٪ تُحسب على مجموع الأقسام كلها.','На справжньому іспиті це {points} із 25 балів (бали × 1,66). 60 % рахують за всі частини разом.'],
 timeUsed:['Süre: {time}','Zeit: {time}','Time: {time}','الوقت: {time}','Час: {time}'],
 reviewTitle:['Cevaplar ve açıklamalar','Lösungen und Erklärungen','Answers and explanations','الإجابات والشروح','Відповіді та пояснення'],
 yourAnswer:['Senin cevabın','Deine Antwort','Your answer','إجابتك','Твоя відповідь'],
 rightAnswer:['Doğru cevap','Richtige Lösung','Right answer','الإجابة الصحيحة','Правильна відповідь'],
 noAnswer:['Boş bıraktın','Nicht markiert','Left open','تركته فارغًا','Не позначено'],
 correct:['Doğru','Richtig gelöst','Correct','صحيح','Правильно'],
 wrong:['Yanlış','Falsch gelöst','Wrong','خطأ','Неправильно'],
 toExams:['Sınavlara dön','Zu den Prüfungen','Back to the exams','عُد إلى الامتحانات','До іспитів'],
 nextExam:['Sonraki sınav','Nächste Prüfung','Next exam','الامتحان التالي','Наступний іспит'],
 loading:['Sınav yükleniyor…','Die Prüfung wird geladen …','Loading the exam…','جارٍ تحميل الامتحان…','Іспит завантажується…'],
 hint1:['1–5. cümleler doğru mu (+), yanlış mı (–)? İşaretle.','Sind die Sätze 1–5 richtig (+) oder falsch (–)? Markiere.','Are statements 1–5 right (+) or wrong (–)? Mark them.','هل الجمل 1–5 صحيحة (+) أم خاطئة (–)؟ ضع العلامة.','Твердження 1–5 правильні (+) чи неправильні (–)? Познач.'],
 hint2ad:['Metinleri ve 6–10. görevleri oku. Hangi ilan uyuyor? a ya da b’yi işaretle.','Lies die Texte und die Aufgaben 6–10. Welche Anzeige passt? Markiere a oder b.','Read the texts and tasks 6–10. Which ad fits? Mark a or b.','اقرأ النصوص والمهام 6–10. أيّ إعلان يناسب؟ اختر a أو b.','Прочитай тексти й завдання 6–10. Яке оголошення підходить? Познач a або b.'],
 hint2web:['Metinleri ve 6–10. görevleri oku. Bilgiyi hangi sayfada bulursun? a ya da b’yi işaretle.','Lies die Texte und die Aufgaben 6–10. Auf welcher Seite findest du die Information? Markiere a oder b.','Read the texts and tasks 6–10. On which page do you find the information? Mark a or b.','اقرأ النصوص والمهام 6–10. في أيّ صفحة تجد المعلومة؟ اختر a أو b.','Прочитай тексти й завдання 6–10. На якій сторінці є потрібна інформація? Познач a або b.'],
 hint3:['Metinleri ve 11–15. görevleri oku. Doğru mu (+), yanlış mı (–)? İşaretle.','Lies die Texte und die Aufgaben 11–15. Richtig (+) oder falsch (–)? Markiere.','Read the texts and tasks 11–15. Right (+) or wrong (–)? Mark them.','اقرأ النصوص والمهام 11–15. صحيح (+) أم خطأ (–)؟ ضع العلامة.','Прочитай тексти й завдання 11–15. Правильно (+) чи неправильно (–)? Познач.'],
 continueWith:['{part} ile devam et','Weiter mit {part}','Continue with {part}','تابع مع {part}','Далі — {part}'],
 hoerenRule1:['Hören üç parçadır (Teil 1–3), toplam 15 soru: kısa konuşmalar, anonslar ve telefon mesajları. Önce soruyu oku, sonra dinle.','Hören hat drei Teile (Teil 1–3) mit 15 Aufgaben: kurze Gespräche, Durchsagen und Nachrichten am Telefon. Lies zuerst die Aufgabe, dann hör den Text.','Hören has three parts (Teil 1–3) with 15 questions: short talks, announcements and phone messages. Read the question first, then listen.','قسم Hören ثلاثة أجزاء (Teil 1–3) فيها 15 سؤالًا: محادثات قصيرة وإعلانات ورسائل هاتفية. اقرأ السؤال أولًا ثم استمع.','Hören має три частини (Teil 1–3), усього 15 завдань: короткі розмови, оголошення й телефонні повідомлення. Спочатку прочитай завдання, потім слухай.'],
 hoerenRule2:['Sınavda Teil 1 ve Teil 3 metinleri iki kez, Teil 2 metinleri bir kez dinlenir. İstersen serbest dinlemeyi seç: o zaman sınır yoktur.','In der Prüfung hörst du die Texte von Teil 1 und Teil 3 zweimal, die von Teil 2 einmal. Du kannst auch frei hören: Dann gibt es keine Grenze.','In the exam you hear the texts of Teil 1 and Teil 3 twice and those of Teil 2 once. You can also choose free listening: then there is no limit.','في الامتحان تسمع نصوص Teil 1 و Teil 3 مرتين ونصوص Teil 2 مرة واحدة. يمكنك أيضًا اختيار الاستماع الحر: عندها لا حدّ للمرات.','На іспиті тексти Teil 1 і Teil 3 звучать двічі, тексти Teil 2 — один раз. Можна також обрати вільне слухання: тоді обмежень немає.'],
 hoerenRule4:['Metinleri sitenin sesleri okur. Sesi aç; kulaklık iyi olur.','Die Stimmen der Seite lesen die Texte. Mach den Ton an; Kopfhörer sind gut.','The site’s voices read the texts. Turn the sound on; headphones help.','أصوات الموقع تقرأ النصوص. شغّل الصوت؛ السماعات أفضل.','Тексти читають голоси сайту. Увімкни звук; найкраще — навушники.'],
 listenMode:['Dinleme şekli','Hörmodus','Listening mode','طريقة الاستماع','Режим слухання'],
 listenStrict:['Sınavdaki gibi','Wie in der Prüfung','Like the exam','كما في الامتحان','Як на іспиті'],
 listenFree:['Serbest dinleme','Frei hören','Free listening','استماع حر','Вільне слухання'],
 play:['Dinle','Anhören','Listen','استمع','Слухати'],
 playAgain:['Tekrar dinle','Noch einmal hören','Listen again','استمع مرة أخرى','Послухати ще раз'],
 stopAudio:['Durdur','Stopp','Stop','أوقف','Зупинити'],
 playsLeft:['Kalan dinleme: {n}','Hören übrig: {n}','Listens left: {n}','مرات الاستماع المتبقية: {n}','Залишилось прослуховувань: {n}'],
 noPlays:['Dinleme hakkın bitti','Schon gehört','No listens left','انتهت مرات الاستماع','Прослуховувань не залишилось'],
 transcript:['Okunan metin','Der Hörtext','The spoken text','النص المسموع','Прослуханий текст'],
 voiceNote:['Doğal sesler şu an yüklenemedi; metni cihazının sesi okuyor.','Die natürlichen Stimmen sind gerade nicht da; die Stimme deines Geräts liest.','The natural voices are not available right now; your device’s voice is reading.','الأصوات الطبيعية غير متاحة الآن؛ صوت جهازك يقرأ النص.','Природні голоси зараз недоступні; текст читає голос твого пристрою.'],
 hhint13:['Doğru olan hangisi? a, b ya da c’yi işaretle. Her metni iki kez dinlersin.','Was ist richtig? Markiere a, b oder c. Du hörst jeden Text zweimal.','Which is right? Mark a, b or c. You hear each text twice.','ما الصحيح؟ اختر a أو b أو c. تسمع كل نص مرتين.','Що правильно? Познач a, b або c. Кожен текст звучить двічі.'],
 hhint2:['Doğru mu (+), yanlış mı (–)? İşaretle. Her metni bir kez dinlersin.','Richtig (+) oder falsch (–)? Markiere. Du hörst jeden Text einmal.','Right (+) or wrong (–)? Mark it. You hear each text once.','صحيح (+) أم خطأ (–)؟ ضع العلامة. تسمع كل نص مرة واحدة.','Правильно (+) чи неправильно (–)? Познач. Кожен текст звучить один раз.'],
 htipsTitle:['Hören için üç ipucu','Drei Tipps für Hören','Three tips for Hören','ثلاث نصائح لقسم Hören','Три поради для Hören'],
 htip1:['Dinlemeden önce soruyu ve üç cevabı oku: neyi dinleyeceğini bilirsin.','Lies vor dem Hören die Aufgabe und die drei Antworten: Dann weißt du, was du hören musst.','Before you listen, read the question and the three answers: then you know what to listen for.','قبل الاستماع اقرأ السؤال والإجابات الثلاث: هكذا تعرف ما الذي تنتظره.','Перед прослуховуванням прочитай запитання й три відповіді: так знатимеш, що саме слухати.'],
 htip2:['Üç cevap da metinde geçebilir. Son söylenene ve şu kelimelere kulak ver: *nein*, *aber*, *sondern*, *erst*.','Alle drei Antworten können im Text vorkommen. Achte auf das Ende und auf diese Wörter: *nein*, *aber*, *sondern*, *erst*.','All three answers can come up in the text. Listen for the end and for these words: *nein*, *aber*, *sondern*, *erst*.','قد ترد الإجابات الثلاث كلها في النص. انتبه إلى آخر ما يقال وإلى هذه الكلمات: *nein*, *aber*, *sondern*, *erst*.','Усі три відповіді можуть прозвучати в тексті. Слухай кінець і ці слова: *nein*, *aber*, *sondern*, *erst*.'],
 htip3:['Sayılar birbirine benzer: *vierzehn* (14) – *vierzig* (40); *halb neun* = 8.30. İkinci dinlemede yalnızca sayıya kulak ver.','Zahlen klingen ähnlich: *vierzehn* (14) – *vierzig* (40); *halb neun* = 8.30 Uhr. Hör beim zweiten Mal nur auf die Zahl.','Numbers sound alike: *vierzehn* (14) – *vierzig* (40); *halb neun* = 8.30. On the second listen, listen only for the number.','الأرقام متشابهة في النطق: *vierzehn* (14) – *vierzig* (40)؛ *halb neun* = 8.30. في المرة الثانية استمع إلى الرقم فقط.','Числа звучать схоже: *vierzehn* (14) – *vierzig* (40); *halb neun* = 8.30. Удруге слухай лише число.'],
 tipsTitle:['Lesen için üç ipucu','Drei Tipps für Lesen','Three tips for Lesen','ثلاث نصائح لقسم Lesen','Три поради для Lesen'],
 tip1:['Önce cümleyi oku, sonra metinde yerini ara. Her kelimeyi anlaman gerekmez.','Lies zuerst die Aufgabe, dann such die Stelle im Text. Du musst nicht jedes Wort verstehen.','Read the task first, then look for the place in the text. You do not need to understand every word.','اقرأ المهمة أولًا ثم ابحث عن موضعها في النص. لا يلزم أن تفهم كل كلمة.','Спочатку прочитай завдання, потім шукай місце в тексті. Не обов’язково розуміти кожне слово.'],
 tip2:['Gün, saat, tarih ve sayılara dikkat et; tuzak çoğu zaman oradadır: *nur*, *erst*, *ab*, *bis*, *außer*.','Achte auf Tage, Uhrzeiten, Daten und Zahlen; dort ist oft die Falle: *nur*, *erst*, *ab*, *bis*, *außer*.','Watch the days, times, dates and numbers; the trap is often there: *nur*, *erst*, *ab*, *bis*, *außer*.','انتبه إلى الأيام والساعات والتواريخ والأرقام؛ فهناك الفخّ غالبًا: *nur*, *erst*, *ab*, *bis*, *außer*.','Зважай на дні, час, дати й числа; пастка часто саме там: *nur*, *erst*, *ab*, *bis*, *außer*.'],
 tip3:['Aynı kelime iki ilanda da geçebilir. İhtiyaca uyan ayrıntıyı ara: kim, ne zaman, kaç kişi, satılık mı kiralık mı?','Dasselbe Wort kann in beiden Anzeigen stehen. Such das Detail, das passt: wer, wann, wie viele, kaufen oder mieten?','The same word can be in both ads. Look for the detail that fits: who, when, how many, buy or rent?','قد ترد الكلمة نفسها في الإعلانين. ابحث عن التفصيل المناسب: من، متى، كم شخصًا، شراء أم إيجار؟','Те саме слово може бути в обох оголошеннях. Шукай деталь, яка підходить: хто, коли, скільки, купити чи орендувати?'],
 // Buchstabieren: the spelling practice beside the exams (app/a1-exam-spell.tsx, 10 November 2026).
 spellTitle:['Buchstabieren: adı harf harf dinle','Buchstabieren: Namen hören','Spelling: hear the name letter by letter','التهجئة: استمع إلى الاسم حرفًا حرفًا','Назви літер: слухай ім’я літера за літерою'],
 spellLead:['Hören sınavında bir ad harf harf söylenir ve üç yazılıştan doğrusu sorulur. Bunu burada ayrıca çalışırsın: 3 kâğıt, 30 ad.','In der Hörprüfung wird ein Name buchstabiert, und du wählst eine von drei Schreibweisen. Das übst du hier extra: 3 Blätter, 30 Namen.','In the listening exam a name is spelled out and you choose one of three spellings. Here you practise just that: 3 sheets, 30 names.','في امتحان الاستماع يُتهجّى اسم حرفًا حرفًا وتختار كتابته الصحيحة من ثلاث. هنا تتدرّب على ذلك خاصة: 3 أوراق و30 اسمًا.','На аудіюванні ім’я називають по літерах, а ти обираєш одне з трьох написань. Тут це можна потренувати окремо: 3 аркуші, 30 імен.'],
 spellSheet:['Kâğıt {n}','Blatt {n}','Sheet {n}','الورقة {n}','Аркуш {n}'],
 spellNames:['{n} ad','{n} Namen','{n} names','{n} أسماء','{n} імен'],
 spellRule1:['Kısa bir konuşma dinlersin: biri bir adı harf harf söyler. Üç yazılıştan doğru olana dokun.','Du hörst ein kurzes Gespräch: Jemand buchstabiert einen Namen. Tippe auf die richtige Schreibweise.','You hear a short talk: someone spells a name. Tap the right spelling.','تسمع محادثة قصيرة: شخص يتهجّى اسمًا. المس الكتابة الصحيحة.','Ти чуєш коротку розмову: хтось називає ім’я по літерах. Торкнися правильного написання.'],
 spellRule2:['Sınavdaki gibi her konuşmayı iki kez dinlersin. İstersen serbest dinlemeyi seç: o zaman sınır yoktur.','Wie in der Prüfung hörst du jedes Gespräch zweimal. Du kannst auch frei hören: Dann gibt es keine Grenze.','As in the exam, you hear each talk twice. You can also choose free listening: then there is no limit.','كما في الامتحان تسمع كل محادثة مرتين. يمكنك أيضًا اختيار الاستماع الحر: عندها لا حدّ للمرات.','Як на іспиті, кожна розмова звучить двічі. Можна також обрати вільне слухання: тоді обмежень немає.'],
 spellTipsTitle:['Buchstabieren için üç ipucu','Drei Tipps zum Buchstabieren','Three tips for spelling','ثلاث نصائح للتهجئة','Три поради до назв літер'],
 spellTip1:['Harfin adı, kelimedeki sesinden farklıdır: *Vau* = V, *Weh* = W, *Jot* = J, *Ypsilon* = Y, *Zeh* = C, *Zett* = Z.','Der Name eines Buchstabens klingt anders als sein Laut im Wort: *Vau* = V, *Weh* = W, *Jot* = J, *Ypsilon* = Y, *Zeh* = C, *Zett* = Z.','A letter’s name is not its sound in a word: *Vau* = V, *Weh* = W, *Jot* = J, *Ypsilon* = Y, *Zeh* = C, *Zett* = Z.','اسم الحرف يختلف عن صوته في الكلمة: *Vau* = V، *Weh* = W، *Jot* = J، *Ypsilon* = Y، *Zeh* = C، *Zett* = Z.','Назва літери звучить інакше, ніж її звук у слові: *Vau* = V, *Weh* = W, *Jot* = J, *Ypsilon* = Y, *Zeh* = C, *Zett* = Z.'],
 spellTip2:['Dinlemeden önce üç adı karşılaştır: hangi harf farklı? Dinlerken yalnızca o yere kulak ver.','Vergleiche vor dem Hören die drei Namen: Welcher Buchstabe ist anders? Achte beim Hören nur auf diese Stelle.','Before you listen, compare the three names: which letter is different? Listen only for that spot.','قبل الاستماع قارن الأسماء الثلاثة: أيّ حرف يختلف؟ عند الاستماع ركّز على ذلك الموضع فقط.','Перед прослуховуванням порівняй три імені: яка літера відрізняється? Слухай саме це місце.'],
 spellTip3:['Ö ve Ü ayrı harflerdir. Ä için çoğu zaman *A-Umlaut* denir, ß harfinin adı *Eszett*. Çift harf iki kez söylenir.','Ö und Ü sind eigene Buchstaben. Für Ä sagt man oft *A-Umlaut*, das ß heißt *Eszett*. Ein doppelter Buchstabe wird zweimal gesagt.','Ö and Ü are letters of their own. Ä is often called *A-Umlaut*, and ß is *Eszett*. A double letter is said twice.','الحرفان Ö و Ü حرفان مستقلان. يُقال للحرف Ä غالبًا *A-Umlaut*، واسم ß هو *Eszett*. الحرف المضاعف يُقال مرتين.','Ö та Ü — окремі літери. Ä часто називають *A-Umlaut*, а ß — *Eszett*. Подвоєну літеру називають двічі.'],
 spellHint:['Ad nasıl yazılıyor? a, b ya da c’yi işaretle. Her konuşmayı iki kez dinlersin.','Wie schreibt man den Namen? Markiere a, b oder c. Du hörst jedes Gespräch zweimal.','How is the name spelled? Mark a, b or c. You hear each talk twice.','كيف يُكتب الاسم؟ اختر a أو b أو c. تسمع كل محادثة مرتين.','Як пишеться ім’я? Познач a, b або c. Кожна розмова звучить двічі.'],
 spellStart:['Alıştırmayı başlat','Übung starten','Start the practice','ابدأ التمرين','Почати вправу'],
 spellFinish:['Bitir ve cevapları gör','Fertig: Lösungen ansehen','Finish and see the answers','أنهِ واعرض الإجابات','Завершити й побачити відповіді'],
 spellResult:['{total} addan {right} tanesini doğru seçtin.','Du hast {right} von {total} Namen richtig.','You got {right} of {total} names right.','اخترت {right} من {total} أسماء بشكل صحيح.','Правильно вибрано {right} з {total} імен.'],
 spellNext:['Sonraki kâğıt','Nächstes Blatt','Next sheet','الورقة التالية','Наступний аркуш'],
 spellWhy:['Söylenen harfler: *{spelled}*.','Buchstabiert wird: *{spelled}*.','The letters you hear: *{spelled}*.','الحروف التي تسمعها: *{spelled}*.','Прозвучали літери: *{spelled}*.'],
 spellLetters:['Harf adları: {pairs}.','Die Namen der Buchstaben: {pairs}.','Letter names: {pairs}.','أسماء الحروف: {pairs}.','Назви літер: {pairs}.'],
 spellTipDouble:['Çift harf iki kez söylenir. Harfleri say.','Ein doppelter Buchstabe wird zweimal gesagt. Zähl die Buchstaben.','A double letter is said twice. Count the letters.','الحرف المضاعف يُقال مرتين. عُدَّ الحروف.','Подвоєну літеру називають двічі. Рахуй літери.'],
 spellTipCount:['Harfleri say: kelimede duyulmayan harf de söylenir.','Zähl die Buchstaben: Auch ein Buchstabe, den man im Wort nicht hört, wird gesagt.','Count the letters: a letter you do not hear in the word is said too.','عُدَّ الحروف: الحرف الذي لا يُسمع في الكلمة يُقال أيضًا.','Рахуй літери: літеру, якої не чути в слові, теж називають.'],
 spellTipUmlaut:['Noktalı harf ayrı bir harftir; noktasız hâliyle karıştırma.','Ein Umlaut ist ein eigener Buchstabe; verwechsle ihn nicht mit dem Buchstaben ohne Punkte.','An umlaut is a letter of its own; do not mix it up with the letter without dots.','الحرف ذو النقطتين حرف مستقل؛ لا تخلطه بالحرف من دون النقطتين.','Умлаут — окрема літера; не плутай її з літерою без крапок.'],
} as const satisfies Record<string,Texts>;
export type ExamCopyKey=keyof typeof examCopy;

const index=(language:string)=>{const at=(EXAM_LANGUAGES as readonly string[]).indexOf(language);return at<0?2:at;};
/** A text of the exam section in the page's language ({name} filled in); English for a language without one. */
export function examText(language:string,key:ExamCopyKey,params?:Record<string,string|number>):string{
 const text=examCopy[key][index(language)];return params?fillText(text,params):text;
}
/** Whether the page's language has its own exam texts (Turkish, German, English, Arabic, Ukrainian). */
export const isExamLanguage=(language:string):language is ExamLanguage=>(EXAM_LANGUAGES as readonly string[]).includes(language);

/* ---------- the explanations of the answers (lib/a1-exam-packs/<language>.json, by item id) ---------- */
export type ExamPack=Record<string,string>;
const loaders:Record<string,()=>Promise<unknown>>={
 en:()=>import('./a1-exam-packs/en.json'),ar:()=>import('./a1-exam-packs/ar.json'),uk:()=>import('./a1-exam-packs/uk.json'),de:()=>import('./a1-exam-packs/de.json'),
};
export const examPackLanguages=Object.keys(loaders);
const packs=new Map<string,ExamPack>();const pending=new Map<string,Promise<void>>();
export function registerExamPack(language:string,pack:ExamPack){packs.set(language,pack);}
/** The language whose explanations a page shows: its own, Turkish as written, or English for the other site languages. */
export const examPackLanguage=(language:string)=>language==='tr'||language in loaders?language:'en';
/** Loads the explanations of a language once. Never rejects: on failure the Turkish explanations are shown. */
export function loadExamPack(language:string):Promise<void>{
 const id=examPackLanguage(language);const load=loaders[id];
 if(!load||packs.has(id))return Promise.resolve();
 let job=pending.get(id);
 if(!job){
  job=load().then(module=>{const data=((module as {default?:unknown}).default??module) as ExamPack;registerExamPack(id,data&&typeof data==='object'?data:{});}).catch(()=>{}).finally(()=>{pending.delete(id);});
  pending.set(id,job);
 }
 return job;
}
/** The explanation of an item in the page's language (the Turkish one when the pack has none). */
export function examWhy(language:string,id:string,turkish:string):{text:string;lang:string}{
 const pack=examPackLanguage(language);const text=pack==='tr'?undefined:packs.get(pack)?.[id];
 return text?{text,lang:pack}:{text:turkish,lang:'tr'};
}
