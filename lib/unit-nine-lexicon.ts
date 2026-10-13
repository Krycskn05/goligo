import type {StudyLanguage} from './study-languages';

// Each entry is German | English | Arabic | Ukrainian | French.
const rows=`
der Termin|appointment|موعد|запис на прийом|rendez-vous
das Date|romantic date|لقاء عاطفي|побачення|rendez-vous amoureux
das Treffen|meeting|لقاء|зустріч|rencontre
die Verabredung|arranged meeting|لقاء متفق عليه|домовлена зустріч|rencontre convenue
die Post|post office / postal service|البريد / مكتب البريد|пошта|poste
die Agentur für Arbeit|employment agency|وكالة العمل|агентство зайнятості|agence pour l’emploi
die Volkshochschule|adult education centre|مركز تعليم الكبار|центр освіти для дорослих|centre de formation pour adultes
die Apotheke|pharmacy|صيدلية|аптека|pharmacie
die Bank|bank|بنك|банк|banque
das Bürgerbüro|citizen services office|مكتب خدمات المواطنين|центр послуг для громадян|bureau des services aux citoyens
das Rathaus|town hall|مبنى البلدية|ратуша|mairie
die Ausländerbehörde|immigration office|دائرة شؤون الأجانب|відомство у справах іноземців|service des étrangers
das Jobcenter|employment and benefits centre|مركز العمل والإعانات|центр зайнятості й допомоги|centre pour l’emploi et les aides
das Landesamt für Migration|state migration office|هيئة الهجرة في الولاية|земельне відомство міграції|office régional de la migration
das BAMF|Federal Office for Migration and Refugees|المكتب الاتحادي للهجرة واللاجئين|Федеральне відомство міграції та біженців|Office fédéral de la migration et des réfugiés
die Familienkasse|family benefits office|مكتب إعانات الأسرة|каса сімейних виплат|caisse des allocations familiales
der Rechtsanwalt|lawyer|محامٍ|адвокат|avocat
die Sparkasse|savings bank|بنك الادخار|ощадний банк|caisse d’épargne
die Polizei|police|شرطة|поліція|police
die Hartnackschule|Hartnack language school|مدرسة هارتناك للغات|мовна школа Hartnack|école de langues Hartnack
der Bäcker|baker / bakery|خباز / مخبز|пекар / пекарня|boulanger / boulangerie
das Kaufhaus|department store|متجر متعدد الأقسام|універмаг|grand magasin
der Supermarkt|supermarket|سوبرماركت|супермаркет|supermarché
der Kiosk|kiosk / small shop|كشك|кіоск|kiosque
der Friseur|hairdresser|حلاق|перукар|coiffeur
der Arzt|doctor|طبيب|лікар|médecin
die Arbeit|work|عمل|робота|travail
die U-Bahn-Station|underground station|محطة المترو|станція метро|station de métro
der Schlüssel|key|مفتاح|ключ|clé
das Handy|mobile phone|هاتف محمول|мобільний телефон|téléphone portable
der Schuh|shoe|حذاء|взуття / черевик|chaussure
die Tasche|bag|حقيبة|сумка|sac
der Stift|pen|قلم|ручка|stylo
das Buch|book|كتاب|книга|livre
der Einkaufszettel|shopping list|قائمة مشتريات|список покупок|liste de courses
das Paket|parcel|طرد|посилка|colis
die Wohnung|flat / apartment|شقة|квартира|appartement
das Medikament|medicine|دواء|ліки|médicament
der Pass|passport|جواز سفر|паспорт|passeport
der Rucksack|backpack|حقيبة ظهر|рюкзак|sac à dos
die Brille|glasses|نظارة|окуляри|lunettes
das Ticket|ticket|تذكرة|квиток|billet
die Idee|idea|فكرة|ідея|idée
die Nachricht|message|رسالة|повідомлення|message
die Karte|card|بطاقة|картка|carte
die Party|party|حفلة|вечірка|fête
der Kurs|course|دورة|курс|cours
der Computerkurs|computer course|دورة حاسوب|комп’ютерний курс|cours d’informatique
der Test|test|اختبار|тест|test
das Picknick|picnic|نزهة مع طعام|пікнік|pique-nique
die Einladung|invitation|دعوة|запрошення|invitation
der Terminkalender|appointment diary|تقويم المواعيد|календар зустрічей|agenda
die Zeit|time|وقت|час|temps
die Lust|desire / inclination|رغبة|бажання|envie
das Geld|money|مال|гроші|argent
das Brot|bread|خبز|хліб|pain
der Käse|cheese|جبن|сир|fromage
der Döner|doner kebab|دونر|донер|kebab
die Milch|milk|حليب|молоко|lait
die Öffnungszeiten|opening hours|أوقات العمل|години роботи|horaires d’ouverture
machen|do / make|يفعل / يصنع|робити|faire
arbeiten|work|يعمل|працювати|travailler
gehen|go / walk|يذهب / يمشي|йти|aller
kommen|come|يأتي|приходити|venir
lernen|learn / study|يتعلم / يدرس|вчитися|apprendre / étudier
kochen|cook|يطبخ|готувати їжу|cuisiner
putzen|clean|ينظف|прибирати|nettoyer
kaufen|buy|يشتري|купувати|acheter
brauchen|need|يحتاج|потребувати|avoir besoin de
fragen|ask|يسأل|запитувати|demander
schreiben|write|يكتب|писати|écrire
trinken|drink|يشرب|пити|boire
vereinbaren|arrange / agree on|يتفق على|домовлятися|convenir de / fixer
sehen|see|يرى|бачити|voir
treffen|meet|يلتقي|зустрічати|rencontrer
sprechen|speak|يتحدث|говорити|parler
essen|eat|يأكل|їсти|manger
vergessen|forget|ينسى|забувати|oublier
helfen|help|يساعد|допомагати|aider
mögen|like|يحب|подобатися|aimer
wissen|know a fact|يعرف معلومة|знати факт|savoir
fahren|go by vehicle / drive|يذهب بوسيلة نقل / يقود|їхати|aller en véhicule / conduire
kennen|be familiar with|يعرف شخصاً أو شيئاً|бути знайомим із|connaître
anrufen|call by phone|يتصل هاتفياً|телефонувати|téléphoner
abholen|collect / pick up|يستلم / يأتي لأخذ|забирати|récupérer / aller chercher
abgeben|hand in / drop off|يسلّم|здавати / передавати|déposer / remettre
anmelden|register|يسجّل|реєструвати|inscrire / déclarer
mitkommen|come along|يأتي مع الآخرين|іти разом|venir avec
einladen|invite|يدعو|запрошувати|inviter
einkaufen|shop|يتسوق|робити покупки|faire les courses
aufstehen|get up|ينهض|вставати|se lever
müssen|have to / must|يجب عليه|мусити|devoir
möchten|would like|يرغب|хотіти ввічливо|souhaiter
können|can / be able to|يستطيع|могти|pouvoir
einen Termin vereinbaren|arrange an appointment|يحجز موعداً|домовитися про прийом|prendre rendez-vous
ein Paket abgeben|drop off a parcel|يسلّم طرداً|здати посилку|déposer un colis
einen Job finden|find a job|يجد عملاً|знайти роботу|trouver un emploi
einen Kurs machen|take a course|يلتحق بدورة|відвідувати курс|suivre un cours
Medikamente abholen|collect medicine|يستلم أدوية|забрати ліки|récupérer des médicaments
Geld überweisen|transfer money|يحوّل المال|переказати гроші|faire un virement
eine Wohnung anmelden|register your address|يسجّل السكن|зареєструвати адресу|déclarer son domicile
Sport machen|do sport|يمارس الرياضة|займатися спортом|faire du sport
Deutsch lernen|study German|يتعلم الألمانية|вчити німецьку|apprendre l’allemand
die Küche putzen|clean the kitchen|ينظف المطبخ|прибирати кухню|nettoyer la cuisine
Kaffee trinken|drink coffee|يشرب القهوة|пити каву|boire du café
Musik machen|make music|يعزف الموسيقى|грати музику|faire de la musique
Freunde besuchen|visit friends|يزور الأصدقاء|відвідувати друзів|rendre visite à des amis
grillen|barbecue|يشوي|готувати на грилі|faire un barbecue
eine Party feiern|have a party|يقيم حفلة|влаштувати вечірку|faire une fête
Karten spielen|play cards|يلعب الورق|грати в карти|jouer aux cartes
ein Picknick machen|have a picnic|يقيم نزهة مع طعام|влаштувати пікнік|faire un pique-nique
gleich|in a moment|بعد قليل|зараз / незабаром|tout de suite / bientôt
wieder|again / back|مرة أخرى / مجدداً|знову|à nouveau
fertig|ready / finished|جاهز / انتهى|готовий / завершений|prêt / terminé
möglich|possible|ممكن|можливий|possible
noch|still / more|ما زال / المزيد|ще|encore
schon|already|بالفعل|вже|déjà
leider|unfortunately|للأسف|на жаль|malheureusement
wichtig|important|مهم|важливий|important
pünktlich|on time|في الموعد|вчасно|ponctuel / à l’heure
früh|early|مبكراً|рано|tôt
höflich|polite|مهذب|ввічливий|poli
unhöflich|impolite|غير مهذب|неввічливий|impoli
geöffnet|open|مفتوح|відчинено|ouvert
geschlossen|closed|مغلق|зачинено|fermé
Guten Tag. Mein Name ist ...|Hello. My name is ...|مرحباً. اسمي ...|Добрий день. Мене звати ...|Bonjour. Je m’appelle ...
Ich möchte mit Frau / Herrn ... sprechen.|I would like to speak to Ms / Mr ...|أود التحدث مع السيدة / السيد ...|Я хочу поговорити з пані / паном ...|Je voudrais parler à Madame / Monsieur ...
Ich möchte einen Termin vereinbaren.|I would like to arrange an appointment.|أود حجز موعد.|Я хочу записатися на прийом.|Je voudrais prendre rendez-vous.
Geht es am ... um ...?|Would ... at ... work?|هل يناسب يوم ... الساعة ...؟|Чи підходить ... о ...?|Est-ce possible le ... à ... ?
Ist es am ... um ... möglich?|Is ... at ... possible?|هل يمكن يوم ... الساعة ...؟|Чи можливо ... о ...?|Est-ce possible le ... à ... ?
Haben Sie zwischen ... und ... Uhr einen Termin frei?|Do you have an appointment available between ... and ...?|هل لديكم موعد شاغر بين الساعة ... و...؟|Чи є у вас вільний час між ... та ...?|Avez-vous un créneau libre entre ... et ... ?
Können Sie am ... um ... Uhr kommen?|Can you come on ... at ...?|هل يمكنكم الحضور يوم ... الساعة ...؟|Чи можете ви прийти ... о ...?|Pouvez-vous venir le ... à ... ?
Ja, das geht.|Yes, that works.|نعم، هذا مناسب.|Так, підходить.|Oui, c’est possible.
Tut mir leid. Das geht leider nicht.|Sorry. Unfortunately that does not work.|آسف. للأسف هذا غير ممكن.|Вибачте. На жаль, це неможливо.|Désolé. Ce n’est malheureusement pas possible.
Am ... haben wir keinen Termin frei.|We have no appointment available on ...|ليس لدينا موعد شاغر يوم ...|На ... у нас немає вільного часу.|Nous n’avons aucun créneau libre le ...
Wir haben aber um ... Uhr einen Termin frei.|But we have an appointment available at ...|لكن لدينا موعد شاغر الساعة ...|Але о ... у нас є вільний час.|Mais nous avons un créneau libre à ...
Dann komme ich am ... um ... Uhr.|Then I will come on ... at ...|إذن سأحضر يوم ... الساعة ...|Тоді я прийду ... о ...|Alors je viendrai le ... à ...
Auf Wiederhören!|Goodbye on the phone!|إلى اللقاء عبر الهاتف!|До побачення телефоном!|Au revoir au téléphone !
Kommst du mit?|Are you coming along?|هل تأتي معنا؟|Ти йдеш із нами?|Tu viens avec nous ?
Hast du Lust und Zeit?|Do you want to and have time?|هل ترغب ولديك وقت؟|Маєш бажання й час?|Tu as envie et le temps ?
Ja, gerne!|Yes, gladly!|نعم، بكل سرور!|Так, залюбки!|Oui, avec plaisir !
Die Idee ist schön.|That is a nice idea.|الفكرة جميلة.|Гарна ідея.|C’est une bonne idée.
Ich kann am ... leider nicht.|Unfortunately I cannot on ...|للأسف لا أستطيع يوم ...|На жаль, я не можу ...|Malheureusement, je ne peux pas le ...
Ich habe leider keine Zeit. Ich muss ...|Unfortunately I have no time. I have to ...|للأسف ليس لدي وقت. يجب عليّ ...|На жаль, у мене немає часу. Я мушу ...|Je n’ai malheureusement pas le temps. Je dois ...
Wir können nächste Woche etwas machen.|We can do something next week.|يمكننا فعل شيء الأسبوع القادم.|Можемо щось зробити наступного тижня.|Nous pouvons faire quelque chose la semaine prochaine.
Liebe Grüße / Viele Grüße|Best wishes / regards|مع أطيب التحيات|З найкращими побажаннями / вітання|Amicalement / salutations
Nicht vergessen!|Do not forget!|لا تنسَ!|Не забудь!|N’oublie pas !
Bin um elf wieder da!|Back at eleven!|سأعود الساعة الحادية عشرة!|Повернуся об одинадцятій!|De retour à onze heures !
Komme später!|Coming later!|سآتي لاحقاً!|Прийду пізніше!|Je viens plus tard !
Kannst du mich anrufen?|Can you call me?|هل يمكنك الاتصال بي؟|Можеш мені зателефонувати?|Peux-tu m’appeler ?
Was nimmst du?|What are you having / choosing?|ماذا تختار؟|Що ти береш?|Que prends-tu ?
Was kann man noch nehmen?|What else can one have?|ماذا يمكن أن نأخذ أيضاً؟|Що ще можна взяти?|Que peut-on prendre d’autre ?
Ich hätte gern ...|I would like ...|أود ...|Я хотів би ...|Je voudrais ...
Wann haben Sie geöffnet?|When are you open?|متى تفتحون؟|Коли ви працюєте?|Quand êtes-vous ouverts ?
Wir haben von ... bis ... Uhr geöffnet.|We are open from ... to ...|نحن مفتوحون من الساعة ... إلى ...|Ми працюємо з ... до ...|Nous sommes ouverts de ... à ...
Montag|Monday|الاثنين|понеділок|lundi
Dienstag|Tuesday|الثلاثاء|вівторок|mardi
Mittwoch|Wednesday|الأربعاء|середа|mercredi
Donnerstag|Thursday|الخميس|четвер|jeudi
Freitag|Friday|الجمعة|п’ятниця|vendredi
Samstag|Saturday|السبت|субота|samedi
Sonntag|Sunday|الأحد|неділя|dimanche
am Wochenende / am Montagabend|at the weekend / on Monday evening|في عطلة نهاية الأسبوع / مساء الاثنين|на вихідних / у понеділок увечері|le week-end / le lundi soir
heute Abend / morgen Abend|this evening / tomorrow evening|هذا المساء / مساء الغد|сьогодні ввечері / завтра ввечері|ce soir / demain soir
ab Freitag / ab nächstem Monat|from Friday / from next month|ابتداءً من الجمعة / من الشهر القادم|з п’ятниці / з наступного місяця|à partir de vendredi / du mois prochain
in der Nacht|at night|في الليل|уночі|la nuit
zum Bäcker / zum Kaufhaus|to the bakery / department store|إلى المخبز / المتجر الكبير|до пекарні / універмагу|à la boulangerie / au grand magasin
zur Arbeit / zur Apotheke|to work / to the pharmacy|إلى العمل / الصيدلية|на роботу / до аптеки|au travail / à la pharmacie
beim BAMF / beim Rechtsanwalt|at BAMF / at the lawyer’s|في BAMF / عند المحامي|у BAMF / в адвоката|au BAMF / chez l’avocat
bei der Familienkasse / bei der Polizei|at the benefits office / police|في مكتب إعانات الأسرة / الشرطة|у касі сімейних виплат / у поліції|à la caisse des allocations / à la police
Lust haben / Zeit haben|feel like it / have time|لديه رغبة / لديه وقت|мати бажання / мати час|avoir envie / avoir du temps
gleich / wieder|in a moment / again|بعد قليل / مرة أخرى|незабаром / знову|bientôt / à nouveau
fertig / möglich|ready / possible|جاهز / ممكن|готовий / можливий|prêt / possible
noch / schon|still / already|ما زال / بالفعل|ще / вже|encore / déjà
leider / wichtig|unfortunately / important|للأسف / مهم|на жаль / важливий|malheureusement / important
pünktlich / früh|on time / early|في الموعد / مبكراً|вчасно / рано|à l’heure / tôt
höflich / unhöflich|polite / impolite|مهذب / غير مهذب|ввічливий / неввічливий|poli / impoli
`;
const normalize=(value:string)=>value.replace(/\*/g,'').replace(/\([^)]*\)/g,'').trim().replace(/\s+/g,' ').toLocaleLowerCase('de-DE');
const lexicon=new Map(rows.trim().split('\n').map(line=>{const [de,en,ar,uk,fr]=line.split('|');return [normalize(de),{de,en,ar,uk,fr}];}));
export function wordMeaning(german:string,language:StudyLanguage):string|undefined{
 if(language==='tr')return undefined;
 return lexicon.get(normalize(german))?.[language];
}
export function hasWordMeaning(german:string){return lexicon.has(normalize(german));}
