import {topics,words,questions,alphabet,type Question} from './course';
import {extraWords,extraSentences,extraParagraphs,unitEightTexts,extraPatterns,grammarWords,lastAudioText,finalAnswerTexts,finalVocabulary} from './extra-lesson-translations';
import {wordMeaning} from './unit-nine-lexicon';
import {translate,type StudyLanguage,type Translations,languageIndex} from './study-languages';
const norm=(s:string)=>s.normalize('NFC').replace(/[.!?]+$/,'').replace(/[“”„"*]/g,'').trim().replace(/\s+/g,' ').toLocaleLowerCase('de-DE');
const exact=new Map<string,Translations>();
const rows=`
Guten Tag|İyi günler|Guten Tag|Good afternoon|طاب يومك|Добрий день|Bonjour
Guten Morgen|Günaydın|Guten Morgen|Good morning|صباح الخير|Добрий ранок|Bonjour
Guten Abend|İyi akşamlar|Guten Abend|Good evening|مساء الخير|Добрий вечір|Bonsoir
Gute Nacht|İyi geceler|Gute Nacht|Good night|تصبح على خير|На добраніч|Bonne nuit
Hallo|Merhaba|Hallo|Hello|مرحباً|Привіт|Salut
Hi|Selam|Hi|Hi|أهلاً|Привіт|Salut
Auf Wiedersehen|Görüşmek üzere|Auf Wiedersehen|Goodbye|إلى اللقاء|До побачення|Au revoir
Auf Wiederhören|Telefonda görüşmek üzere|Auf Wiederhören|Goodbye, on the phone|إلى اللقاء، عبر الهاتف|До побачення, телефоном|Au revoir, au téléphone
Bis bald|Yakında görüşürüz|Bis bald|See you soon|أراك قريباً|До скорої зустрічі|À bientôt
Bis dann|O zamana kadar, görüşürüz|Bis dann|See you then|أراك حينها|До зустрічі|À plus tard
Tschüss|Hoşça kal|Tschüss|Bye|وداعاً|Бувай|Salut
Herzlich willkommen|Hoş geldiniz|Herzlich willkommen|Welcome|أهلاً وسهلاً|Ласкаво просимо|Bienvenue
Danke|Teşekkürler|Danke|Thank you|شكراً|Дякую|Merci
Bitte|Lütfen / rica ederim|Bitte|Please / you are welcome|من فضلك / عفواً|Будь ласка|S’il te plaît / de rien
Ja|Evet|Ja|Yes|نعم|Так|Oui
Nein|Hayır|Nein|No|لا|Ні|Non
Ja, gerne|Evet, seve seve|Ja, gerne|Yes, gladly|نعم، بكل سرور|Так, залюбки|Oui, avec plaisir
Ja, richtig|Evet, doğru|Ja, richtig|Yes, correct|نعم، صحيح|Так, правильно|Oui, c’est exact
Richtig|Doğru|Richtig|Correct|صحيح|Правильно|Correct
Interessant|İlginç|Interessant|Interesting|مثير للاهتمام|Цікаво|Intéressant
Gut|İyi|Gut|Good|جيد|Добре|Bien
Sehr gut|Çok iyi|Sehr gut|Very good|جيد جداً|Дуже добре|Très bien
Super|Harika|Super|Great|رائع|Чудово|Super
Nicht so gut|Pek iyi değil|Nicht so gut|Not so good|ليس جيداً جداً|Не дуже добре|Pas très bien
Schlecht|Kötü|Schlecht|Bad|سيئ|Погано|Mal
Na ja, es geht|Eh, idare eder|Na ja, es geht|Well, not too bad|لا بأس|Так собі|Ça peut aller
Es geht|İdare eder / olur|Es geht|It is okay / it works|لا بأس / يمكن ذلك|Нормально / підходить|Ça va / c’est possible
Wie bitte|Efendim? Tekrar eder misiniz?|Wie bitte|Pardon? Could you repeat?|عفواً؟ هل يمكنك التكرار؟|Перепрошую? Повтори, будь ласка|Pardon ? Peux-tu répéter ?
Wie schreibt man das|Bu nasıl yazılır?|Wie schreibt man das|How do you spell that?|كيف تُكتب هذه الكلمة؟|Як це пишеться?|Comment ça s’écrit ?
Ich buchstabiere|Harf harf söylüyorum|Ich buchstabiere|I am spelling it|أنا أتهجّاها|Я називаю по літерах|J’épelle
Wie heißt du|Adın ne?|Wie heißt du|What is your name?|ما اسمك؟|Як тебе звати?|Comment t’appelles-tu ?
Wie heißen Sie|Adınız nedir?|Wie heißen Sie|What is your name? (formal)|ما اسم حضرتك؟|Як Вас звати?|Comment vous appelez-vous ?
Woher kommst du|Nerelisin?|Woher kommst du|Where are you from?|من أين أنت؟|Звідки ти?|D’où viens-tu ?
Woher kommen Sie|Nerelisiniz?|Woher kommen Sie|Where are you from? (formal)|من أين حضرتك؟|Звідки Ви?|D’où venez-vous ?
Welche Sprachen sprichst du|Hangi dilleri konuşuyorsun?|Welche Sprachen sprichst du|Which languages do you speak?|ما اللغات التي تتحدثها؟|Якими мовами ти розмовляєш?|Quelles langues parles-tu ?
Welche Sprachen sprechen Sie|Hangi dilleri konuşuyorsunuz?|Welche Sprachen sprechen Sie|Which languages do you speak? (formal)|ما اللغات التي تتحدثونها؟|Якими мовами Ви розмовляєте?|Quelles langues parlez-vous ?
Wie geht es dir|Nasılsın?|Wie geht es dir|How are you?|كيف حالك؟|Як справи?|Comment vas-tu ?
Wie geht es Ihnen|Nasılsınız?|Wie geht es Ihnen|How are you? (formal)|كيف حال حضرتك؟|Як Ваші справи?|Comment allez-vous ?
Und du|Ya sen?|Und du|And you?|وأنت؟|А ти?|Et toi ?
Und Sie|Ya siz?|Und Sie|And you? (formal)|وحضرتك؟|А Ви?|Et vous ?
Und dir|Ya sen, nasılsın?|Und dir|And how are you?|وأنت، كيف حالك؟|А в тебе як справи?|Et toi, comment vas-tu ?
Und Ihnen|Ya siz, nasılsınız?|Und Ihnen|And how are you? (formal)|وحضرتك، كيف حالك؟|А у Вас як справи?|Et vous, comment allez-vous ?
Sagen wir du|Birbirimize sen diyelim mi?|Sagen wir du|Shall we use informal you?|هل نتخاطب بصيغة غير رسمية؟|Перейдемо на ти?|On se tutoie ?
Ich bin neu hier|Ben burada yeniyim|Ich bin neu hier|I am new here|أنا جديد هنا|Я тут новенький|Je suis nouveau ici
Ich möchte einen Termin vereinbaren|Bir randevu ayarlamak istiyorum|Ich möchte einen Termin vereinbaren|I would like to make an appointment|أود حجز موعد|Я хочу записатися на прийом|Je voudrais prendre rendez-vous
Ich habe einen Termin|Bir randevum var|Ich habe einen Termin|I have an appointment|لدي موعد|У мене призначена зустріч|J’ai un rendez-vous
Haben Sie einen Termin frei|Boş randevunuz var mı?|Haben Sie einen Termin frei|Do you have an appointment available?|هل لديكم موعد متاح؟|Чи є у Вас вільний час для прийому?|Avez-vous un rendez-vous disponible ?
Ja, das geht|Evet, olur|Ja, das geht|Yes, that works|نعم، هذا ممكن|Так, це підходить|Oui, c’est possible
Das geht nicht|Bu olmaz / mümkün değil|Das geht nicht|That does not work|هذا غير ممكن|Це не підходить|Ce n’est pas possible
Tut mir leid|Üzgünüm|Tut mir leid|I am sorry|أنا آسف|Мені шкода|Je suis désolé
Tut mir leid. Das geht leider nicht|Üzgünüm. Maalesef olmaz|Tut mir leid. Das geht leider nicht|Sorry. Unfortunately that does not work|آسف. للأسف هذا غير ممكن|Мені шкода. На жаль, це не підходить|Désolé. Malheureusement, ce n’est pas possible
Ich habe leider keine Zeit|Maalesef vaktim yok|Ich habe leider keine Zeit|Unfortunately I do not have time|للأسف ليس لدي وقت|На жаль, у мене немає часу|Malheureusement, je n’ai pas le temps
Wann haben Sie Zeit|Ne zaman vaktiniz var?|Wann haben Sie Zeit|When are you available?|متى يكون لديكم وقت؟|Коли у Вас є час?|Quand êtes-vous disponible ?
Wann haben Sie geöffnet|Ne zaman açıksınız?|Wann haben Sie geöffnet|When are you open?|ما أوقات عملكم؟|Коли Ви працюєте?|Quand êtes-vous ouvert ?
Wie sind Ihre Öffnungszeiten|Çalışma saatleriniz nasıl?|Wie sind Ihre Öffnungszeiten|What are your opening hours?|ما أوقات العمل لديكم؟|Які у Вас години роботи?|Quels sont vos horaires d’ouverture ?
Wo haben Sie einen Termin|Randevunuz nerede?|Wo haben Sie einen Termin|Where is your appointment?|أين موعدكم؟|Де у Вас призначена зустріч?|Où avez-vous rendez-vous ?
Wie kann ich Ihnen helfen|Size nasıl yardımcı olabilirim?|Wie kann ich Ihnen helfen|How can I help you?|كيف يمكنني مساعدتكم؟|Чим можу Вам допомогти?|Comment puis-je vous aider ?
Wohin gehst du|Nereye gidiyorsun?|Wohin gehst du|Where are you going?|إلى أين تذهب؟|Куди ти йдеш?|Où vas-tu ?
Was musst du machen|Ne yapmak zorundasın?|Was musst du machen|What do you have to do?|ماذا يجب عليك أن تفعل؟|Що ти мусиш зробити?|Que dois-tu faire ?
Was nimmst du|Ne alıyorsun?|Was nimmst du|What are you taking?|ماذا تختار؟|Що ти береш?|Qu’est-ce que tu prends ?
Ich rufe dich an|Seni arıyorum|Ich rufe dich an|I am calling you|أتصل بك|Я телефоную тобі|Je t’appelle
Ich kann dich anrufen|Seni arayabilirim|Ich kann dich anrufen|I can call you|يمكنني الاتصال بك|Я можу зателефонувати тобі|Je peux t’appeler
Kannst du mich anrufen|Beni arayabilir misin?|Kannst du mich anrufen|Can you call me?|هل يمكنك الاتصال بي؟|Можеш зателефонувати мені?|Peux-tu m’appeler ?
Kannst du mich bitte anrufen|Lütfen beni arayabilir misin?|Kannst du mich bitte anrufen|Could you please call me?|هل يمكنك الاتصال بي من فضلك؟|Можеш, будь ласка, зателефонувати мені?|Peux-tu m’appeler, s’il te plaît ?
Ruf mich bitte an|Lütfen beni ara|Ruf mich bitte an|Please call me|اتصل بي من فضلك|Зателефонуй мені, будь ласка|Appelle-moi, s’il te plaît
Ich sehe ihn nicht|Onu görmüyorum|Ich sehe ihn nicht|I do not see him / it|لا أراه|Я його не бачу|Je ne le vois pas
Die Idee ist schön|Fikir güzel|Die Idee ist schön|It is a nice idea|الفكرة جميلة|Гарна ідея|C’est une belle idée
Super Idee|Harika fikir|Super Idee|Great idea|فكرة رائعة|Чудова ідея|Super idée
Kommst du mit|Sen de geliyor musun?|Kommst du mit|Are you coming along?|هل تأتي معنا؟|Ти йдеш з нами?|Tu viens avec nous ?
Hast du Lust|İster misin? Hevesin var mı?|Hast du Lust|Do you feel like it?|هل ترغب في ذلك؟|Маєш бажання?|Tu en as envie ?
Ich bin gleich da|Birazdan oradayım|Ich bin gleich da|I will be there in a moment|سأكون هناك بعد قليل|Я зараз буду|J’arrive tout de suite
Guten Appetit|Afiyet olsun|Guten Appetit|Enjoy your meal|بالهنا والشفا|Смачного|Bon appétit
Das schmeckt sehr gut|Tadı çok güzel|Das schmeckt sehr gut|That tastes very good|طعمه لذيذ جداً|Це дуже смачно|C’est très bon
Das schmeckt super|Tadı harika|Das schmeckt super|That tastes great|طعمه رائع|Це дуже смачно|C’est délicieux
Danke für die Einladung|Davet için teşekkürler|Danke für die Einladung|Thank you for the invitation|شكراً على الدعوة|Дякую за запрошення|Merci pour l’invitation
Ich möchte bestellen|Sipariş vermek istiyorum|Ich möchte bestellen|I would like to order|أود أن أطلب|Я хочу замовити|Je voudrais commander
Ich hätte gern einen Döner|Bir döner rica ediyorum|Ich hätte gern einen Döner|I would like a döner|أود شطيرة دونر|Я хотів би донер|Je voudrais un döner
Ich nehme den Käse|Peyniri alıyorum|Ich nehme den Käse|I will take the cheese|آخذ الجبن|Я беру сир|Je prends le fromage
Der Käse schmeckt sehr gut|Peynirin tadı çok güzel|Der Käse schmeckt sehr gut|The cheese tastes very good|طعم الجبن لذيذ جداً|Сир дуже смачний|Le fromage est très bon
Bin um elf wieder da|Saat on birde tekrar buradayım|Bin um elf wieder da|I will be back at eleven|سأعود في الحادية عشرة|Повернуся об одинадцятій|Je reviens à onze heures
Nicht vergessen|Unutma|Nicht vergessen|Do not forget|لا تنسَ|Не забудь|N’oublie pas
Liebe Grüße|Sevgiler|Liebe Grüße|Best wishes|أطيب التحيات|З найкращими побажаннями|Amitiés
Viele Grüße|Selamlar|Viele Grüße|Best regards|مع التحية|З вітаннями|Bien cordialement
geöffnet|açık|geöffnet|open|مفتوح|відчинено|ouvert
geschlossen|kapalı|geschlossen|closed|مغلق|зачинено|fermé
am Montag|pazartesi günü|am Montag|on Monday|يوم الاثنين|у понеділок|lundi
am Dienstag|salı günü|am Dienstag|on Tuesday|يوم الثلاثاء|у вівторок|mardi
am Mittwoch|çarşamba günü|am Mittwoch|on Wednesday|يوم الأربعاء|у середу|mercredi
am Donnerstag|perşembe günü|am Donnerstag|on Thursday|يوم الخميس|у четвер|jeudi
am Freitag|cuma günü|am Freitag|on Friday|يوم الجمعة|у п’ятницю|vendredi
am Samstag|cumartesi günü|am Samstag|on Saturday|يوم السبت|у суботу|samedi
am Sonntag|pazar günü|am Sonntag|on Sunday|يوم الأحد|у неділю|dimanche
heute|bugün|heute|today|اليوم|сьогодні|aujourd’hui
morgen|yarın|morgen|tomorrow|غداً|завтра|demain
heute Abend|bu akşam|heute Abend|this evening|هذا المساء|сьогодні ввечері|ce soir
morgen Abend|yarın akşam|morgen Abend|tomorrow evening|مساء الغد|завтра ввечері|demain soir
am Abend|akşam|am Abend|in the evening|في المساء|увечері|le soir
am Morgen|sabah|am Morgen|in the morning|في الصباح|уранці|le matin
am Nachmittag|öğleden sonra|am Nachmittag|in the afternoon|بعد الظهر|після обіду|l’après-midi
am Wochenende|hafta sonu|am Wochenende|at the weekend|في نهاية الأسبوع|на вихідних|le week-end
nächste Woche|gelecek hafta|nächste Woche|next week|الأسبوع القادم|наступного тижня|la semaine prochaine
`;
for(const row of rows.trim().split('\n')){const [de,...values]=row.split('|');exact.set(norm(de),values as unknown as Translations);}
const trOnly=new Map<string,string>();
for(const word of words)trOnly.set(norm(word.de),word.tr);
for(const topic of topics)for(const block of topic.blocks)for(const e of block.examples??[])trOnly.set(norm(e.de),e.tr);
for(const q of questions){const quote=q.prompt.match(/^“([^”]+)”(?: cümlesini)? Almanca/);if(quote&&!q.options)trOnly.set(norm(q.answer),quote[1]);}
for(const row of extraWords.trim().split('\n')){const[de,en,ar,uk,fr]=row.split('|');const tr=trOnly.get(norm(de))??de;exact.set(norm(de),[tr,de,en,ar,uk,fr]);}
for(const row of (extraSentences+'\n'+extraParagraphs+'\n'+unitEightTexts+'\n'+extraPatterns+'\n'+grammarWords+'\n'+lastAudioText+'\n'+finalAnswerTexts+'\n'+finalVocabulary).trim().split('\n').filter(Boolean)){const[de,tr,en,ar,uk,fr]=row.split('|');exact.set(norm(de),[tr,de,en,ar,uk,fr]);}
const informalDialog=exact.get(norm('Hi, Elif! Wie geht es dir? — Nicht so gut. Und dir? — Gut, danke.'))!;
exact.set(norm('Hi, Elif! Wie geht es dir? Nicht so gut. Und dir? Gut, danke.'),informalDialog);
const plurals=new Map<string,string>();
for(const topic of topics)for(const block of topic.blocks){if(!block.table)continue;const heads=block.table.heads;const plural=heads.findIndex(h=>/Çoğul/.test(h));const german=heads.findIndex(h=>/Artikeliyle|Almanca|Kurum|Yer/.test(h));if(plural<0||german<0)continue;for(const row of block.table.rows)if(/^die /.test(row[plural])&&row[german])plurals.set(norm(row[plural].replace(/\([^)]*\)/g,'').replace(/\*/g,'')),row[german]);}
const forms=new Map(`komme|kommen|ich
kommst|kommen|du
heiße|heißen|ich
heißt|heißen|du / er
spreche|sprechen|ich
sprichst|sprechen|du
bin|sein|ich
bist|sein|du
sind|sein|wir / sie / Sie
ist|sein|er / sie / es
geht|gehen|er / sie / es
kann|können|ich / er / sie / es
kannst|können|du
könnt|können|ihr
nehme|nehmen|ich
nimmst|nehmen|du
nimmt|nehmen|er / sie / es
nehmt|nehmen|ihr
feiere|feiern|ich
feierst|feiern|du
feiert|feiern|ihr / er / sie / es
muss|müssen|ich / er / sie / es
musst|müssen|du
müsst|müssen|ihr
möchte|möchten|ich / er / sie / es
möchtest|möchten|du
möchtet|möchten|ihr
sehe|sehen|ich
siehst|sehen|du
treffe|treffen|ich
triffst|treffen|du
esse|essen|ich
isst|essen|du / er / sie / es
vergesse|vergessen|ich
vergisst|vergessen|du / er / sie / es
helfe|helfen|ich
hilfst|helfen|du
mag|mögen|ich / er / sie / es
magst|mögen|du
weiß|wissen|ich / er / sie / es
weißt|wissen|du
fahre|fahren|ich
fährst|fahren|du
kenne|kennen|ich
`.trim().split('\n').map(r=>{const[f,v,p]=r.split('|');return[f,{verb:v,person:p}];}));
for(const verb of ['machen','arbeiten','gehen','lernen','kochen','putzen','kaufen','brauchen','fragen','schreiben','trinken','vereinbaren']){const stem=verb.slice(0,-2);forms.set(stem+'e',{verb,person:'ich'});forms.set(stem+(/[td]$/.test(stem)?'est':/[sßxz]$/.test(stem)?'t':'st'),{verb,person:'du'});}
forms.set('schmeckt',{verb:'schmecken',person:'er / sie / es'});
for(const[letter,sound]of alphabet){const values:Translations=[`${letter} harfinin okunuşu`,sound,`Pronunciation of ${letter}`,`نطق الحرف ${letter}`,`Вимова літери ${letter}`,`Prononciation de ${letter}`];if(!exact.has(norm(sound)))exact.set(norm(sound),values);}
const actionRows=`
arbeiten|çalışmak|work|العمل|працювати|travailler
kochen|yemek pişirmek|cook|الطبخ|готувати|cuisiner
lernen|ders çalışmak|study|الدراسة|вчитися|étudier
einkaufen|alışveriş yapmak|shop|التسوق|робити покупки|faire les courses
aufstehen|kalkmak|get up|النهوض|вставати|se lever
schlafen|uyumak|sleep|النوم|спати|dormir
Sport machen|spor yapmak|exercise|ممارسة الرياضة|займатися спортом|faire du sport
Musik machen|müzik yapmak|make music|عزف الموسيقى|займатися музикою|faire de la musique
Karten spielen|kart oynamak|play cards|لعب الورق|грати в карти|jouer aux cartes
Hausaufgaben machen|ödev yapmak|do homework|أداء الواجبات|робити домашнє завдання|faire les devoirs
einen Termin vereinbaren|randevu ayarlamak|make an appointment|حجز موعد|записатися на прийом|prendre rendez-vous
Geld überweisen|para havale etmek|transfer money|تحويل المال|переказати гроші|virer de l’argent
ein Paket abgeben|bir paket teslim etmek|hand in a parcel|تسليم طرد|здати посилку|déposer un colis
meinen Pass abholen|pasaportumu teslim almak|pick up my passport|استلام جواز سفري|забрати мій паспорт|récupérer mon passeport
seinen Pass abholen|pasaportunu teslim almak|pick up his passport|استلام جواز سفره|забрати його паспорт|récupérer son passeport
Medikamente abholen|ilaçları teslim almak|pick up medication|استلام الأدوية|забрати ліки|récupérer des médicaments
mein Medikament abholen|ilacımı teslim almak|pick up my medication|استلام دوائي|забрати мої ліки|récupérer mon médicament
eine Wohnung anmelden|ev adresini kaydettirmek|register an address|تسجيل عنوان السكن|зареєструвати адресу|déclarer une adresse
die Wohnung anmelden|ev adresini kaydettirmek|register the address|تسجيل عنوان السكن|зареєструвати адресу|déclarer l’adresse
einen Kurs machen|bir kursa gitmek|take a course|الالتحاق بدورة|відвідувати курс|suivre un cours
einen Computerkurs machen|bilgisayar kursuna gitmek|take a computer course|الالتحاق بدورة حاسوب|відвідувати комп’ютерний курс|suivre un cours d’informatique
einen Job finden|iş bulmak|find a job|العثور على عمل|знайти роботу|trouver un emploi
Deutsch lernen|Almanca çalışmak|study German|دراسة الألمانية|вчити німецьку|étudier l’allemand
Kaffee trinken|kahve içmek|drink coffee|شرب القهوة|пити каву|boire du café
einen Kaffee trinken|bir kahve içmek|have a coffee|شرب القهوة|випити каву|boire un café
die Küche putzen|mutfağı temizlemek|clean the kitchen|تنظيف المطبخ|прибрати кухню|nettoyer la cuisine
meine Eltern anrufen|anne babamı aramak|call my parents|الاتصال بوالديّ|зателефонувати батькам|appeler mes parents
eine Freundin treffen|bir kız arkadaşımla buluşmak|meet a female friend|لقاء صديقة|зустрітися з подругою|retrouver une amie
ein Picknick machen|piknik yapmak|have a picnic|القيام بنزهة|влаштувати пікнік|faire un pique-nique
eine Party machen|parti yapmak|have a party|إقامة حفلة|влаштувати вечірку|faire une fête
mitkommen|birlikte gelmek|come along|المجيء معنا|піти з нами|venir avec nous
Musik hören|müzik dinlemek|listen to music|الاستماع إلى الموسيقى|слухати музику|écouter de la musique
einen Salat mitbringen|salata getirmek|bring a salad|إحضار سلطة|принести салат|apporter une salade
zum Arzt gehen|doktora gitmek|go to the doctor|الذهاب إلى الطبيب|піти до лікаря|aller chez le médecin
nach Hause gehen|eve gitmek|go home|الذهاب إلى البيت|піти додому|rentrer à la maison
`;
const actions=new Map(actionRows.trim().split('\n').map(r=>{const [de,tr,en,ar,uk,fr]=r.split('|');return[norm(de),[tr,de,en,ar,uk,fr] as Translations];}));
const countries=`Deutschland|Almanya|Germany|ألمانيا|Німеччина|Allemagne
Polen|Polonya|Poland|بولندا|Польща|Pologne
Griechenland|Yunanistan|Greece|اليونان|Греція|Grèce
Bulgarien|Bulgaristan|Bulgaria|بلغاريا|Болгарія|Bulgarie
Syrien|Suriye|Syria|سوريا|Сирія|Syrie
Türkei|Türkiye|Turkey|تركيا|Туреччина|Turquie
Irak|Irak|Iraq|العراق|Ірак|Irak
Iran|İran|Iran|إيران|Іран|Iran
Jemen|Yemen|Yemen|اليمن|Ємен|Yémen
Sudan|Sudan|Sudan|السودان|Судан|Soudan
Kenia|Kenya|Kenya|كينيا|Кенія|Kenya
Thailand|Tayland|Thailand|تايلاند|Таїланд|Thaïlande
Luxemburg|Lüksemburg|Luxembourg|لوكسمبورغ|Люксембург|Luxembourg
Indonesien|Endonezya|Indonesia|إندونيسيا|Індонезія|Indonésie
China|Çin|China|الصين|Китай|Chine
Tunesien|Tunus|Tunisia|تونس|Туніс|Tunisie`;
const languages=`Deutsch|Almanca|German|الألمانية|німецька|allemand
Türkisch|Türkçe|Turkish|التركية|турецька|turc
Englisch|İngilizce|English|الإنجليزية|англійська|anglais
Französisch|Fransızca|French|الفرنسية|французька|français
Arabisch|Arapça|Arabic|العربية|арабська|arabe
Ukrainisch|Ukraynaca|Ukrainian|الأوكرانية|українська|ukrainien
Spanisch|İspanyolca|Spanish|الإسبانية|іспанська|espagnol
Polnisch|Lehçe|Polish|البولندية|польська|polonais
Griechisch|Yunanca|Greek|اليونانية|грецька|grec
Bulgarisch|Bulgarca|Bulgarian|البلغارية|болгарська|bulgare
Chinesisch|Çince|Chinese|الصينية|китайська|chinois
Farsi|Farsça|Farsi|الفارسية|перська|persan
Thai|Tayca|Thai|التايلاندية|тайська|thaï
Swahili|Svahili|Swahili|السواحيلية|суахілі|swahili
Luxemburgisch|Lüksemburgca|Luxembourgish|اللوكسمبورغية|люксембурзька|luxembourgeois
Indonesisch|Endonezce|Indonesian|الإندونيسية|індонезійська|indonésien`;
for(const row of (countries+'\n'+languages).split('\n')){const[de,tr,en,ar,uk,fr]=row.split('|');exact.set(norm(de),[tr,de,en,ar,uk,fr]);}
const label=(values:Translations,language:StudyLanguage)=>translate(values,language);
function bare(text:string){return text.replace(/^(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/i,'');}
export function wordTranslation(text:string,language:StudyLanguage):string|null{
 const hit=exact.get(norm(text))??exact.get(norm(bare(text)));if(hit)return label(hit,language);
 if(language==='de')return text;
 if(language==='tr'&&trOnly.has(norm(text)))return trOnly.get(norm(text))!;
 const form=forms.get(norm(text));if(form){const meaning=wordTranslation(form.verb,language);if(meaning)return label([`${meaning} — ${form.person} çekimi`,text,`${meaning} — ${form.person} form`,`${meaning} — تصريف ${form.person}`,`${meaning} — форма ${form.person}`,`${meaning} — forme ${form.person}`],language);}
 const lemma=plurals.get(norm(text));if(lemma){const meaning=wordTranslation(lemma,language);if(meaning)return label([`${meaning} (çoğul)`,text,`${meaning} (plural)`,`${meaning} (جمع)`,`${meaning} (множина)`,`${meaning} (pluriel)`],language);}
 const candidates=[text,...['der','die','das'].map(a=>a+' '+bare(text))];
 for(const candidate of candidates){const tuple=exact.get(norm(candidate));if(tuple)return label(tuple,language);if(language==='tr'&&trOnly.has(norm(candidate)))return trOnly.get(norm(candidate))!;const meaning=wordMeaning(candidate,language);if(meaning)return meaning;}
 const action=actions.get(norm(text));return action?label(action,language):null;
}
const hourNames=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn','zwanzig','einundzwanzig','zweiundzwanzig','dreiundzwanzig','vierundzwanzig'];
function hourValue(text:string):string|null{const raw=norm(text.replace(/ Uhr$/i,''));if(/^\d{1,2}([:.]\d{2})?$/.test(raw))return raw;const n=hourNames.indexOf(raw==='ein'?'eins':raw);if(n>=0)return String(n);const half=raw.match(/^halb (.+)$/);if(half){const h=hourNames.indexOf(half[1]);if(h>0)return (h-1)+':30';}return null;}
for(const day of ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag']){const tuple=exact.get(norm('am '+day))!;exact.set(norm(day),[tuple[0].replace(' günü',''),day,tuple[2].replace(/^on /,''),tuple[3].replace(/^يوم /,''),tuple[4].replace(/^у /,''),tuple[5]]);for(const[end,moment]of [['abend','am Abend'],['morgen','am Morgen'],['nachmittag','am Nachmittag']]){const part=exact.get(norm(moment))!;exact.set(norm('am '+day+end),[tuple[0]+' '+part[0],'am '+day+end,tuple[2]+' '+part[2],tuple[3]+' '+part[3],tuple[4]+' '+part[4],tuple[5]+' '+part[5]]);}}
function timeTranslation(text:string,language:StudyLanguage):string|null{
 const key=norm(text);const hit=exact.get(key);if(hit)return label(hit,language);
 let m=text.match(/^um (.+?)(?: Uhr)?$/i);if(m){const h=hourValue(m[1]);if(h===null)return null;return label([`saat ${h}`,text,`at ${h}`,`الساعة ${h}`,`о ${h}`,`à ${h} heures`],language);}
 m=text.match(/^von (.+?)(?: Uhr)? bis (.+?)(?: Uhr)?$/i);if(m){const a=hourValue(m[1])??wordTranslation(m[1],language),b=hourValue(m[2])??wordTranslation(m[2],language);if(!a||!b)return null;return label([`${a} ile ${b} arasında`,text,`from ${a} to ${b}`,`من ${a} إلى ${b}`,`з ${a} до ${b}`,`de ${a} à ${b}`],language);}
 m=text.match(/^zwischen (.+?) und (.+?)(?: Uhr)?$/i);if(m){const a=hourValue(m[1]),b=hourValue(m[2]);if(a===null||b===null)return null;return label([`${a} ile ${b} arasında`,text,`between ${a} and ${b}`,`بين ${a} و${b}`,`між ${a} та ${b}`,`entre ${a} et ${b}`],language);}
 m=text.match(/^(ab|bis) (.+)$/i);if(m){const part=hourValue(m[2])??wordTranslation(m[2],language);if(!part)return null;return label(m[1].toLowerCase()==='ab'?[`${part} itibarıyla`,text,`from ${part}`,`ابتداءً من ${part}`,`від ${part}`,`à partir de ${part}`]:[`saat ${part}’${Number.isFinite(Number(part))?(['a','e','ye','e','e','e','ya','ye','e','a'][Number(part)%10]):'e'} kadar`,text,`until ${part}`,`حتى ${part}`,`до ${part}`,`jusqu’à ${part}`],language);}

 return null;
}
function timeParts(text:string,language:StudyLanguage):string|null{
 const bits=text.match(/(?:am [A-ZÄÖÜa-zäöüß]+(?:abend|nachmittag|morgen)?|heute Abend|morgen Abend|heute|morgen|nächste Woche|um [\w:]+(?: Uhr)?|von .+? bis .+? Uhr|zwischen .+? und .+? Uhr|ab .+|bis .+)/g);
 if(!bits||norm(bits.join(' '))!==norm(text))return timeTranslation(text,language);
 const values=bits.map(b=>timeTranslation(b,language));return values.every(Boolean)?values.join(' · '):null;
}
function phrase(text:string,language:StudyLanguage):string|null{
 const base=text.trim().replace(/[.!?]+$/,'');const known=wordTranslation(base,language);if(known)return known;
 const sounds=base.split(', ').map(s=>alphabet.find(([letter,sound])=>norm(sound)===norm(s))?.[0]);if(sounds.length>1&&sounds.every(Boolean)){const spelled=sounds.join(' – ');return label([`Harfle okunuş: ${spelled}`,base,`Spelled letters: ${spelled}`,`الحروف: ${spelled}`,`По літерах: ${spelled}`,`Lettres épelées : ${spelled}`],language);}
 if(/^[0-9:.,€–\s-]+$/.test(base))return text;
 if(['Berlin','Warschau','Istanbul','Bagdad','Sofia','Shanghai','Athen','Krakau','Madrid','Emre','MILA','KORAY','ANNA','MÜLLER','GÖTZ'].some(n=>norm(n)===norm(base)))return base;
 const letter=alphabet.find(([letter])=>norm(letter)===norm(base));if(letter)return label([`${base} harfi`,base,`Letter ${base}`,`الحرف ${base}`,`Літера ${base}`,`Lettre ${base}`],language);
 let m=base.match(/^(?:Ich heiße|Mein Name ist|Ich bin) ([A-ZÄÖÜ][\wÄÖÜäöüß-]+)$/);if(m)return label([`Benim adım ${m[1]}`,base,`My name is ${m[1]}`,`اسمي ${m[1]}`,`Мене звати ${m[1]}`,`Je m’appelle ${m[1]}`],language);
 m=base.match(/^Ich komme aus (?:der |dem )?(.+)$/);if(m){const place=wordTranslation(m[1],language)??m[1];return label([`${place}’den geliyorum`,base,`I come from ${place}`,`أنا من ${place}`,`Я з ${place}`,`Je viens de ${place}`],language);}
 m=base.match(/^Ich spreche (.+)$/);if(m){const pieces=m[1].split(/, | und /);const values=pieces.map(p=>{const small=p.startsWith('ein bisschen ');const v=wordTranslation(p.replace(/^ein bisschen /,''),language);return v?(small?label([`biraz ${v}`,p,`a little ${v}`,`قليلاً من ${v}`,`трохи ${v}`,`un peu de ${v}`],language):v):null;});if(values.every(Boolean))return label([`${values.join(' ve ')} konuşuyorum`,base,`I speak ${values.join(' and ')}`,`أتحدث ${values.join(' و')}`,`Я розмовляю: ${values.join(', ')}`,`Je parle ${values.join(' et ')}`],language);}
 m=base.match(/^Ich habe einen Termin (beim |bei der |im )(.+)$/);if(m){const place=wordTranslation(m[2],language)??m[2];return label([`${place} için randevum var`,base,`I have an appointment at / with ${place}`,`لدي موعد في / عند ${place}`,`У мене прийом у ${place}`,`J’ai rendez-vous à / chez ${place}`],language);}
 m=base.match(/^Ich gehe (zum |zur |in die |ins )(.+)$/);if(m){const place=wordTranslation(m[2],language)??m[2];return label([`${place} yönüne gidiyorum`,base,`I am going to ${place}`,`أذهب إلى ${place}`,`Я йду до ${place}`,`Je vais à / chez ${place}`],language);}
 m=base.match(/^Ich habe (.+) Zeit$/);if(m){const time=timeParts(m[1],language);if(time)return label([`${time} vaktim var`,base,`I am available ${time}`,`لدي وقت ${time}`,`У мене є час ${time}`,`Je suis disponible ${time}`],language);}
 m=base.match(/^(Ich|Du|Er|Sie|Wir|Ihr|Kolja|Suri|Germain) (muss|musst|müssen|müsst|möchte|möchtest|möchten|möchtet|kann|kannst|können|könnt) (.+)$/);
 if(m){const subject=m[1],modal=m[2];let rest=m[3];const negative=rest.startsWith('nicht ');if(negative)rest=rest.slice(6);const action=[...actions].filter(([key])=>norm(rest).endsWith(key)).sort((a,b)=>b[0].length-a[0].length)[0];if(action){const rawTime=rest.slice(0,rest.length-action[0].length).trim();const time=rawTime?timeParts(rawTime,language):'';if(time!==null){const act=label(action[1],language);const formal=subject==='Sie'&&['müssen','möchten','können'].includes(modal);const person=subject==='Ich'?0:subject==='Du'?1:subject==='Wir'?3:subject==='Ihr'||formal?4:2;const subjectText=subject==='Ich'?label(['ben',subject,'I','أنا','я','je'],language):subject==='Du'?label(['sen',subject,'you','أنت','ти','tu'],language):subject==='Wir'?label(['biz',subject,'we','نحن','ми','nous'],language):subject==='Ihr'?label(['siz',subject,'you','أنتم','ви','vous'],language):subject==='Er'?label(['o',subject,'he','هو','він','il'],language):subject==='Sie'?label(formal?['siz',subject,'you','حضرتك','Ви','vous']:['o',subject,'she','هي','вона','elle'],language):subject;
 const type=modal.startsWith('muss')||modal==='müssen'||modal==='müsst'?'must':modal.startsWith('möcht')?'wish':'can';
 if(language==='tr'){const ending=type==='must'?(negative?['zorunda değilim','zorunda değilsin','zorunda değil','zorunda değiliz','zorunda değilsiniz']:['zorundayım','zorundasın','zorunda','zorundayız','zorundasınız'])[person]:type==='wish'?(negative?['istemiyorum','istemiyorsun','istemiyor','istemiyoruz','istemiyorsunuz']:['istiyorum','istiyorsun','istiyor','istiyoruz','istiyorsunuz'])[person]:(negative?['imkânım yok','imkânın yok','imkânı yok','imkânımız yok','imkânınız yok']:['imkânım var','imkânın var','imkânı var','imkânımız var','imkânınız var'])[person];const action=act;return `${time?time+' · ':''}${subject==='Ich'?'':subjectText+': '}${action} ${ending}`;}
 if(language==='en')return `${subjectText} ${negative?(type==='wish'?(person===2?'does not want to':'do not want to'):type==='can'?'cannot':(person===2?'does not have to':'do not have to')):(type==='must'?'must':type==='wish'?'would like to':'can')} ${act}${time?' · '+time:''}`;
 if(language==='ar'){const feminine=subject==='Suri'||subject==='Sie'&&!formal;const aux=type==='must'?(negative?['ليس عليّ','ليس عليك','ليس عليه','ليس علينا','ليس عليكم']:['يجب عليّ','يجب عليك',feminine?'يجب عليها':'يجب عليه','يجب علينا','يجب عليكم'])[person]:type==='wish'?['أودّ','تودّ',feminine?'تودّ':'يودّ','نودّ','تودّون'][person]:['يمكنني','يمكنك',feminine?'يمكنها':'يمكنه','يمكننا','يمكنكم'][person];return `${/^[A-Z]/.test(subject)&&!['Ich','Du','Er','Sie','Wir','Ihr'].includes(subject)?subject+': ':''}${negative&&type!=='must'?'لا ':''}${aux} ${act}${time?' · '+time:''}`;}
 if(language==='uk'){const aux=type==='must'?(negative?['мені не потрібно','тобі не потрібно','не потрібно','нам не потрібно','вам не потрібно']:['маю','маєш','має','маємо','маєте'])[person]:type==='wish'?['хочу','хочеш','хоче','хочемо','хочете'][person]:['можу','можеш','може','можемо','можете'][person];return `${type==='must'&&negative?'':subjectText+' '}${negative&&type!=='must'?'не ':''}${aux} ${act}${time?' · '+time:''}`;}
 if(language==='fr'){const reflexive=act==='se lever'?['me lever','te lever','se lever','nous lever','vous lever'][person]:act;const aux=type==='must'?['dois','dois','doit','devons','devez'][person]:type==='wish'?['voudrais','voudrais','voudrait','voudrions','voudriez'][person]:['peux','peux','peut','pouvons','pouvez'][person];return `${subjectText} ${negative?'ne ':''}${aux}${negative?' pas':''} ${reflexive}${time?' · '+time:''}`;}
 }}}
 m=base.match(/^(?:Ich komme|Dann komme ich|Gut, dann komme ich|Ich bin wieder da|Bin wieder da) (.+)$/);if(m){const time=timeParts(m[1],language);if(time)return label([`${time} geliyorum`,base,`I will come ${time}`,`سآتي ${time}`,`Я прийду ${time}`,`Je viendrai ${time}`],language);}
 m=base.match(/^(?:Geht es|Ist es) (.+?)(?: möglich)?$/);if(m){const time=timeParts(m[1],language);if(time)return label([`${time} olur mu?`,base,`Is ${time} possible?`,`هل ${time} ممكن؟`,`Чи підходить ${time}?`,`Est-ce possible ${time} ?`],language);}
 const listed=base.split(/, | und /);if(listed.length>1){const vals=listed.map(p=>p.startsWith('ein bisschen ')?wordTranslation(p.slice(13),language):wordTranslation(p,language));if(vals.every(Boolean))return vals.join(label([' ve ',base,' and ',' و',' і ',' et '],language));}
 const timeOnly=hourValue(base);if(timeOnly!==null&&/Uhr/.test(base))return label([`saat ${timeOnly}`,base,`${timeOnly} o’clock`,`الساعة ${timeOnly}`,`${timeOnly} година`,`${timeOnly} heures`],language);
 return timeTranslation(base,language);
}
export function lessonTranslation(text:string,language:StudyLanguage,source:'de'|'tr'='de'):string|null{
 if(!text.trim())return null;if(language===source)return text;
 if(text.trim()==='?')return label(['soru işareti','?', 'question mark','علامة استفهام','знак питання','point d’interrogation'],language);
 if(text.trim()==='.')return label(['nokta','.', 'full stop','نقطة','крапка','point'],language);
 if(source==='tr'){for(const [de,values]of exact)if(norm(values[0])===norm(text))return label(values,language);for(const word of words)if(norm(word.tr)===norm(text)){const translated=wordTranslation(word.de,language);if(translated)return translated;}return null;}
 const result=phrase(text,language);if(result)return result;
 const parts=text.split(/(?<=[.!?])\s+|\s+—\s+/).filter(Boolean);if(parts.length>1){const translated=parts.map(p=>phrase(p,language));if(translated.every(Boolean))return translated.join(' ');}
 return null;
}
const turkishWords=new Set(words.map(w=>norm(w.tr)));
export function answerSource(q:Question):'de'|'tr'{if(!q.options)return 'de';if(/ne demek|anlamını seç/.test(q.prompt)||turkishWords.has(norm(q.answer))||/[ıİğĞşŞçÇ]/.test(q.answer)||/diyerek|nesnedir|Zorunluluk|İstek|başlangıç|bitiş|artikele|şimdiki|olduğunu/.test(q.answer))return 'tr';return 'de';}
export function germanCue(q:Question):string|null{
 if(q.audio||q.passage)return q.audio??q.passage!;
 const quote=q.prompt.match(/[“"]([^”"]+)[”"]/);if(quote&&/ne demek|artikeli/.test(q.prompt))return quote[1];
 const clause=q.prompt.split(':').slice(1).join(':').trim();if(clause&&/___|→|\//.test(clause))return clause;
 return null;
}
export const preparedTranslationCount=exact.size;
