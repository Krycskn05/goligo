"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partC = exports.wordsC = void 0;
const orte_types_1 = require("./orte-types");
const orte_pictures_1 = require("./orte-pictures");
const gap = (options, answer) => ({ options, answer });
exports.wordsC = [
    { de: 'die Waschmaschine', plural: 'Waschmaschinen', tr: (0, orte_types_1.T)('çamaşır makinesi'), emoji: '🧺', pic: orte_pictures_1.objectPic.waschmaschine },
    { de: 'die Spülmaschine', plural: 'Spülmaschinen', tr: (0, orte_types_1.T)('bulaşık makinesi'), emoji: '🍽️', pic: orte_pictures_1.objectPic.spuelmaschine },
    { de: 'der Kühlschrank', plural: 'Kühlschränke', tr: (0, orte_types_1.T)('buzdolabı'), emoji: '🧊', pic: orte_pictures_1.objectPic.kuehlschrank },
    { de: 'der Herd', plural: 'Herde', tr: (0, orte_types_1.T)('ocak (fırınlı)'), emoji: '🍳', pic: orte_pictures_1.objectPic.herd },
    { de: 'der Schrank', plural: 'Schränke', tr: (0, orte_types_1.T)('dolap'), emoji: '🚪', pic: orte_pictures_1.objectPic.schrank },
];
/** The tens (Konu 1): the digits, the word and what is read. */
const tens = [['20', 'zwanzig'], ['30', 'dreißig'], ['40', 'vierzig'], ['50', 'fünfzig'], ['60', 'sechzig'], ['70', 'siebzig'], ['80', 'achtzig'], ['90', 'neunzig'], ['100', '(ein)hundert']];
const twoDigits = [['21', 'einundzwanzig'], ['22', 'zweiundzwanzig'], ['34', 'vierunddreißig'], ['45', 'fünfundvierzig'], ['56', 'sechsundfünfzig'], ['67', 'siebenundsechzig'], ['78', 'achtundsiebzig'], ['89', 'neunundachtzig'], ['99', 'neunundneunzig']];
const hundreds = [['100', '(ein)hundert'], ['101', 'hunderteins'], ['150', 'hundertfünfzig'], ['200', 'zweihundert'], ['256', 'zweihundertsechsundfünfzig'], ['300', 'dreihundert'], ['512', 'fünfhundertzwölf'], ['921', 'neunhunderteinundzwanzig'], ['1000', '(ein)tausend']];
const spoken = (word) => word.replace('(ein)', 'ein');
exports.partC = {
    id: 'c', badge: 'C', title: 'Was kostet die Waschmaschine?',
    lead: (0, orte_types_1.T)('Sayılar **21–1000**, küçük ilanlar, **Wie alt / hoch / breit ist …? Was kostet …?** ve telefonda kendini tanıtmak.'),
    cover: orte_pictures_1.orteCovers.c, coverAlt: (0, orte_types_1.T)('Yasemin telefonla konuşuyor; önünde laptopta ilanlar: çamaşır makinesi, buzdolabı ve ocak, fiyatlarıyla'),
    short: { 'sayi-dinle': (0, orte_types_1.T)('Sayıyı dinle'), 'sayi-yaz': (0, orte_types_1.T)('Sayıyı yaz'), 'sayi-sec': (0, orte_types_1.T)('Uzun sayılar'), 'sorular': (0, orte_types_1.T)('Soru sor'), 'telefon-ex': (0, orte_types_1.T)('Telefonda'), 'pruefung': (0, orte_types_1.T)('Sınav tipi') },
    steps: [
        { id: 'kapak', title: (0, orte_types_1.T)('Kapak'), kind: 'cover', cover: {
                intro: (0, orte_types_1.T)('Yasemin’in yeni evinde birkaç eşya eksik. İnternette küçük ilanlara bakıyor: bir çamaşır makinesi, bir buzdolabı, bir ocak … Ne kadar? Kaç yaşında? Ne kadar büyük? Telefonda soruyor.'),
                learn: [(0, orte_types_1.T)('Sayılar *21–1000*'), (0, orte_types_1.T)('İlanları anlamak: *55 cm breit, 4 Jahre alt, 95 Euro*'), (0, orte_types_1.T)('Sormak: *Wie alt ist …? Wie hoch ist …? Was kostet …?*'), (0, orte_types_1.T)('Cevap vermek: *Er kostet 95 Euro. Sie ist 3 Jahre alt.*'), (0, orte_types_1.T)('Telefonda: *Krüger. – Guten Tag, hier ist Arslan.*'), (0, orte_types_1.T)('*Ist der Kühlschrank noch da?*')],
                cast: ['yasemin', 'sabine', 'nikos', 'nora', 'paul'],
            } },
        { id: 'esyalar', title: (0, orte_types_1.T)('Kelimeler'), kind: 'teach', kicker: 'Wortschatz', heading: (0, orte_types_1.T)('Ev eşyaları ve ilan kelimeleri'),
            lead: (0, orte_types_1.T)('Önce eşyalar (karta dokun), sonra ilanlarda geçen kelimeler (satıra dokun).'),
            blocks: [
                { t: 'cards', words: exports.wordsC },
                { t: 'list', words: [
                        (0, orte_types_1.listWord)('hoch', 'yüksek; boyu …', 'Der Schrank ist 180 cm hoch.', 'Dolabın boyu 180 cm.'),
                        (0, orte_types_1.listWord)('breit', 'geniş; eni …', 'Der Herd ist 50 cm breit.', 'Ocağın eni 50 cm.'),
                        (0, orte_types_1.listWord)('der Zentimeter (cm)', 'santimetre', 'Er ist 84 Zentimeter hoch.', 'Boyu 84 santimetre.'),
                        (0, orte_types_1.listWord)('der Meter (m)', 'metre', 'Er ist zwei Meter hoch.', 'Boyu iki metre.'),
                        (0, orte_types_1.listWord)('der Euro (€)', 'avro', 'Er kostet 40 Euro.', '40 avro.'),
                        (0, orte_types_1.listWord)('der Preis', 'fiyat', 'Der Preis ist gut.', 'Fiyatı iyi.'),
                        (0, orte_types_1.listWord)('das Alter', 'yaş', 'Alter: 4 Jahre', 'Yaşı: 4 yıl'),
                        (0, orte_types_1.listWord)('kosten', '(fiyatı) … olmak', 'Was kostet der Herd?', 'Ocak ne kadar?'),
                        (0, orte_types_1.listWord)('noch', 'hâlâ, daha', 'Ist der Herd noch da?', 'Ocak hâlâ duruyor mu? (satılmadı mı?)'),
                        (0, orte_types_1.listWord)('kommen', 'gelmek', 'Danke, ich komme!', 'Teşekkürler, geliyorum!'),
                        (0, orte_types_1.listWord)('die Frage, die Fragen', 'soru, sorular', 'Ich habe eine Frage.', 'Bir sorum var.'),
                        (0, orte_types_1.listWord)('die Adresse', 'adres', 'Wie ist die Adresse?', 'Adres ne?'),
                        (0, orte_types_1.listWord)('die Straße (Str.)', 'sokak, cadde', 'Lindenstraße 18', 'Linden Sokağı 18'),
                    ] },
            ] },
        { id: 'sayilar', title: (0, orte_types_1.T)('Sayılar 20–100'), kind: 'teach', kicker: (0, orte_types_1.T)('Konu 1 · Zahlen 20–100'), heading: (0, orte_types_1.T)('Sayılar 20–100'),
            blocks: [
                { t: 'p', text: (0, orte_types_1.T)('Lektion 2’de 0–20’yi öğrendin. Önce onlar. Satıra dokun, dinle ve tekrar et:') },
                { t: 'table', head: ['', ''], rows: tens.map(([n, w]) => [n, w]), say: tens.map(([, w]) => spoken(w)) },
                { t: 'warn', text: (0, orte_types_1.T)('Dikkat: *dreißig* (ß ile, „-zig“ değil), *sechzig* (sechs değil, s düşer), *siebzig* (sieben değil, en düşer).') },
                { t: 'h', text: (0, orte_types_1.T)('Türkçenin tersi: önce birler!') },
                { t: 'p', text: (0, orte_types_1.T)('21 = *einundzwanzig* = „bir-ve-yirmi“. Almanca önce **birler** basamağını, sonra *und*, sonra **onlar** basamağını söyler; hepsi tek kelime. *eins* burada *ein* olur.') },
                { t: 'table', head: ['', ''], rows: twoDigits.map(([n, w]) => [n, w]), say: twoDigits.map(([, w]) => w) },
                { t: 'note', text: (0, orte_types_1.T)('İpucu: sayıyı söylerken sondan başla: 56 → önce 6 (*sechs*), sonra *und*, sonra 50 (*fünfzig*): ~sechsundfünfzig~. Telefon numarası ve fiyatlarda çok lazım olacak!') },
                { t: 'checks', items: [
                        (0, orte_types_1.check)('47', ['siebenundvierzig', 'vierundsiebzig', 'siebzigvier']),
                        (0, orte_types_1.check)('„dreiundsechzig“', ['63', '36', '603'], 'dreiundsechzig'),
                        (0, orte_types_1.check)('30', ['dreißig', 'dreizig', 'dreizehn']),
                    ] },
            ] },
        { id: 'yuzler', title: (0, orte_types_1.T)('Sayılar 1000’e kadar'), kind: 'teach', kicker: (0, orte_types_1.T)('Konu 2 · Zahlen bis 1000'), heading: (0, orte_types_1.T)('Yüzler ve bin'),
            blocks: [
                { t: 'p', text: (0, orte_types_1.T)('Önce yüzler gelir, sonra iki basamaklı kısım aynı kuralla: 256 = *zweihundert* + *sechsundfünfzig*. Hepsi **tek kelime** yazılır.') },
                { t: 'table', head: ['', ''], rows: hundreds.map(([n, w]) => [n, w]), say: hundreds.map(([, w]) => spoken(w)) },
                { t: 'note', text: (0, orte_types_1.T)('*hundert* ve *tausend* önüne *ein* koymak isteğe bağlı: ~hundert~ = ~einhundert~.') },
                { t: 'h', text: (0, orte_types_1.T)('Fiyatlar') },
                { t: 'rows', rows: [(0, orte_types_1.row)('Der Herd kostet 40 Euro.', 'Ocak 40 avro.'), (0, orte_types_1.row)('Die Waschmaschine kostet 175 Euro.', 'Çamaşır makinesi 175 avro.'), (0, orte_types_1.row)('Die Spülmaschine kostet 230 Euro.', 'Bulaşık makinesi 230 avro.')] },
                { t: 'checks', items: [
                        (0, orte_types_1.check)('300', ['dreihundert', 'dreißighundert', 'dreizehnhundert']),
                        (0, orte_types_1.check)('„hundertfünfzig“', ['150', '115', '105'], 'hundertfünfzig'),
                        (0, orte_types_1.check)('212', ['zweihundertzwölf', 'zwölfhundertzwei', 'zweihundertzwanzig']),
                    ] },
            ] },
        { id: 'ilanlar', title: (0, orte_types_1.T)('Küçük ilanlar'), kind: 'teach', kicker: (0, orte_types_1.T)('Konu 3 · Kleinanzeigen'), heading: (0, orte_types_1.T)('İlanları okumak ve soru sormak'),
            blocks: [
                { t: 'p', text: (0, orte_types_1.T)('Yasemin dört ilan buldu. Satıra dokununca ilan okunur:') },
                { t: 'ads', items: [
                        { thing: 'Kühlschrank', price: '95 €', details: '4 Jahre alt · 120 cm hoch, 55 cm breit', city: 'Köln', say: 'Der Kühlschrank kostet fünfundneunzig Euro. Er ist vier Jahre alt.' },
                        { thing: 'Waschmaschine', price: '175 €', details: '3 Jahre alt · 84 cm hoch, 59 cm breit', city: 'Bremen', say: 'Die Waschmaschine kostet hundertfünfundsiebzig Euro. Sie ist drei Jahre alt.' },
                        { thing: 'Herd', price: '40 €', details: '6 Jahre alt · 50 cm breit', city: 'Leipzig', say: 'Der Herd kostet vierzig Euro. Er ist sechs Jahre alt.' },
                        { thing: 'Spülmaschine', price: '230 €', details: 'neu · 82 cm hoch', city: 'Mainz', say: 'Die Spülmaschine kostet zweihundertdreißig Euro. Sie ist neu.' },
                    ] },
                { t: 'h', text: (0, orte_types_1.T)('Sormak ve cevap vermek') },
                { t: 'rows', rows: [(0, orte_types_1.row)('Wie alt ist der Kühlschrank?', 'Buzdolabı kaç yaşında?'), (0, orte_types_1.row)('Er ist vier Jahre alt.', 'Dört yaşında.'), (0, orte_types_1.row)('Was kostet die Waschmaschine?', 'Çamaşır makinesi ne kadar?'), (0, orte_types_1.row)('Sie kostet 175 Euro.', '175 avro.'), (0, orte_types_1.row)('Wie breit ist der Herd?', 'Ocağın eni ne kadar?'), (0, orte_types_1.row)('Er ist 50 cm breit.', 'Eni 50 cm.'), (0, orte_types_1.row)('Wie hoch ist die Spülmaschine?', 'Bulaşık makinesinin boyu ne kadar?'), (0, orte_types_1.row)('Sie ist 82 cm hoch.', 'Boyu 82 cm.')] },
                { t: 'warn', text: (0, orte_types_1.T)('Cevapta yine *er / es / sie*: ~der Herd → Er kostet 40 Euro.~ ~die Waschmaschine → Sie ist 3 Jahre alt.~') },
                { t: 'note', text: (0, orte_types_1.T)('Kısaltmalar: *cm* = Zentimeter, *m* = Meter, *€* = Euro, *Str.* = Straße, *Tel.* = Telefonnummer.') },
                { t: 'checks', items: [
                        (0, orte_types_1.check)('___ kostet der Herd?', ['Was', 'Wie', 'Wo'], 'Was kostet der Herd?'),
                        (0, orte_types_1.check)('___ alt ist der Kühlschrank?', ['Wie', 'Was', 'Wer'], 'Wie alt ist der Kühlschrank?'),
                        (0, orte_types_1.check)('Die Waschmaschine? ___ ist 3 Jahre alt.', ['Sie', 'Er', 'Es'], 'Sie ist drei Jahre alt.'),
                    ] },
            ] },
        { id: 'telefon', title: (0, orte_types_1.T)('Telefonda'), kind: 'teach', kicker: (0, orte_types_1.T)('Konu 4 · Am Telefon'), heading: (0, orte_types_1.T)('İlan için telefon etmek'),
            blocks: [
                { t: 'p', text: (0, orte_types_1.T)('Almanya’da telefonu açan çoğu zaman sadece **soyadını** söyler: ~Krüger.~ ya da ~Krüger, guten Tag.~ Arayan da kendini tanıtır: ~Guten Tag, hier ist Arslan.~') },
                { t: 'talk', lines: [
                        (0, orte_types_1.line)('sabine', 'Krüger, guten Tag.', 'Krüger, iyi günler.'),
                        (0, orte_types_1.line)('yasemin', 'Guten Tag, hier ist Yasemin Arslan. Ich habe eine Frage: Ist der Kühlschrank noch da?', 'İyi günler, ben Yasemin Arslan. Bir sorum var: Buzdolabı hâlâ duruyor mu?'),
                        (0, orte_types_1.line)('sabine', 'Ja, er ist noch da.', 'Evet, duruyor.'),
                        (0, orte_types_1.line)('yasemin', 'Wie hoch ist er?', 'Boyu ne kadar?'),
                        (0, orte_types_1.line)('sabine', 'Er ist 120 Zentimeter hoch und 55 Zentimeter breit.', 'Boyu 120, eni 55 santimetre.'),
                        (0, orte_types_1.line)('yasemin', 'Und wie alt ist er?', 'Peki kaç yaşında?'),
                        (0, orte_types_1.line)('sabine', 'Vier Jahre.', 'Dört yıllık.'),
                        (0, orte_types_1.line)('yasemin', 'Was kostet der Kühlschrank?', 'Buzdolabı ne kadar?'),
                        (0, orte_types_1.line)('sabine', 'Fünfundneunzig Euro.', 'Doksan beş avro.'),
                        (0, orte_types_1.line)('yasemin', 'Gut. Und die Adresse?', 'İyi. Ya adres?'),
                        (0, orte_types_1.line)('sabine', 'Lindenstraße 18 in Köln.', 'Köln’de Linden Sokağı 18.'),
                        (0, orte_types_1.line)('yasemin', 'Super, danke! Bis morgen!', 'Süper, teşekkürler! Yarın görüşürüz!'),
                        (0, orte_types_1.line)('sabine', 'Bis morgen, Frau Arslan!', 'Yarın görüşürüz, Bayan Arslan!'),
                    ] },
                { t: 'note', text: (0, orte_types_1.T)('*noch da* = hâlâ orada, yani henüz satılmadı: ~Ist der Herd noch da?~ – ~Ja, er ist noch da.~') },
                { t: 'checks', items: [
                        (0, orte_types_1.check)((0, orte_types_1.T)('Telefonu açınca:'), ['Krüger, guten Tag.', 'Ich bin Telefon.', 'Hallo, wer bist du?']),
                        (0, orte_types_1.check)((0, orte_types_1.T)('Buzdolabı kaç para?'), ['95 Euro', '59 Euro', '120 Euro'], 'Fünfundneunzig Euro.'),
                    ] },
            ] },
        { id: 'kaliplar', title: (0, orte_types_1.T)('Kalıplar'), kind: 'teach', kicker: (0, orte_types_1.T)('Konu 5 · Redemittel'), heading: (0, orte_types_1.T)('Bu bölümün kalıpları'),
            lead: (0, orte_types_1.T)('Bunları ezbere bil: dinle → söyle → kaydet → bakmadan söyle.'),
            blocks: [
                { t: 'rows', all: true, rows: [(0, orte_types_1.row)('Guten Tag, hier ist Arslan.', 'İyi günler, ben Arslan.'), (0, orte_types_1.row)('Ist der Kühlschrank noch da?', 'Buzdolabı hâlâ duruyor mu?'), (0, orte_types_1.row)('Ich habe eine Frage.', 'Bir sorum var.'), (0, orte_types_1.row)('Wie alt ist er?', 'Kaç yaşında?'), (0, orte_types_1.row)('Wie hoch ist er? Wie breit ist er?', 'Boyu ne kadar? Eni ne kadar?'), (0, orte_types_1.row)('Was kostet der Kühlschrank?', 'Buzdolabı ne kadar?'), (0, orte_types_1.row)('Er kostet 95 Euro.', '95 avro.'), (0, orte_types_1.row)('Danke, ich komme!', 'Teşekkürler, geliyorum!')] },
                { t: 'p', text: (0, orte_types_1.T)('Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.') },
            ] },
        { id: 'sayi-dinle', title: (0, orte_types_1.T)('Alıştırma 1'), kind: 'exercise', kicker: 'Alıştırma 1 · Welche Zahl hören Sie?', heading: (0, orte_types_1.T)('Hangi sayıyı duyuyorsun?'), lead: (0, orte_types_1.T)('Dinle düğmesine dokun, sonra duyduğun sayıyı seç.'),
            exercise: { type: 'quiz', items: [
                    { listen: 'dreiundzwanzig', options: ['23', '32', '13'] }, { listen: 'achtundfünfzig', options: ['58', '85', '48'] },
                    { listen: 'sechsundsiebzig', options: ['76', '67', '66'] }, { listen: 'neunzig', options: ['90', '19', '9'] },
                    { listen: 'vierundachtzig', options: ['84', '48', '14'] }, { listen: 'siebzehn', options: ['17', '70', '71'] },
                    { listen: 'hundertfünfzig', options: ['150', '115', '105'] }, { listen: 'zweihundertzwölf', options: ['212', '221', '202'] },
                ].map(item => ({ ...item, prompt: (0, orte_types_1.T)('Hangi sayıyı duyuyorsun?'), say: item.listen })) } },
        { id: 'sayi-yaz', title: (0, orte_types_1.T)('Alıştırma 2'), kind: 'exercise', kicker: 'Alıştırma 2 · Schreiben Sie.', heading: (0, orte_types_1.T)('Sayıyı kelimeyle yaz'), lead: (0, orte_types_1.T)('Tek kelime yaz: ~51~ → ~einundfünfzig~. (ß yerine ss, ü yerine ue de yazabilirsin.)'),
            exercise: { type: 'write', rows: [
                    ['51', 'einundfünfzig'], ['43', 'dreiundvierzig'], ['84', 'vierundachtzig'], ['92', 'zweiundneunzig'], ['25', 'fünfundzwanzig'], ['37', 'siebenunddreißig'], ['68', 'achtundsechzig'], ['19', 'neunzehn'],
                ].map(([given, word]) => ({ given, answers: [word], say: word })) } },
        { id: 'sayi-sec', title: (0, orte_types_1.T)('Alıştırma 3'), kind: 'exercise', kicker: 'Alıştırma 3 · Welche Zahl ist das?', heading: (0, orte_types_1.T)('Uzun sayılar: hangisi?'), lead: (0, orte_types_1.T)('Kelimeyi oku, doğru sayıyı seç. Doğru olunca sayı okunur.'),
            exercise: { type: 'choice', lines: [
                    ['z1', 'zweihundertsechsundfünfzig', ['256', '265', '526'], '256'], ['z2', 'einhundertachtundzwanzig', ['128', '182', '812'], '128'],
                    ['z3', 'fünfhundertzwölf', ['512', '521', '502'], '512'], ['z4', 'einhundertzweiundachtzig', ['182', '128', '281'], '182'],
                    ['z5', 'zweihundertfünfundsechzig', ['265', '256', '652'], '265'], ['z6', 'neunhunderteinundzwanzig', ['921', '912', '129'], '921'],
                ].map(([key, word, options, answer]) => ({ key: key, parts: [word, ' = ', gap(options, answer)], say: word })) } },
        { id: 'sorular', title: (0, orte_types_1.T)('Alıştırma 4'), kind: 'exercise', kicker: 'Alıştırma 4 · Wie fragt man?', heading: (0, orte_types_1.T)('Cevaba uyan soruyu seç'), lead: (0, orte_types_1.T)('Cevabı oku. Hangi soru buna uyar?'),
            exercise: { type: 'choice', bankLead: (0, orte_types_1.T)('Kutudaki sorular:'), lines: (() => {
                    const box = ['Wie breit', 'Wie hoch', 'Wie alt', 'Was kostet'];
                    const ask = (key, before, answer, after, reply) => (0, orte_types_1.choiceLine)(key, [before, gap(box, answer), after + ' – ' + reply]);
                    return [
                        ask('s1', '', 'Wie breit', ' ist der Schrank?', 'Er ist 70 cm breit.'),
                        ask('s2', '', 'Wie hoch', ' ist der Schrank?', 'Er ist 180 cm hoch.'),
                        ask('s3', '', 'Wie alt', ' ist der Schrank?', 'Er ist 12 Jahre alt.'),
                        ask('s4', '', 'Was kostet', ' der Schrank?', 'Er kostet 85 Euro.'),
                        ask('s5', '', 'Was kostet', ' die Spülmaschine?', 'Sie kostet 230 Euro.'),
                        ask('s6', '', 'Wie hoch', ' ist die Waschmaschine?', 'Sie ist 84 cm hoch.'),
                    ];
                })() } },
        { id: 'telefon-ex', title: (0, orte_types_1.T)('Alıştırma 5'), kind: 'exercise', kicker: 'Alıştırma 5 · Ist der Herd noch da?', heading: (0, orte_types_1.T)('Telefon konuşmasını tamamla'), lead: (0, orte_types_1.T)('Nikos bir ocak ilanı için Nora’yı arıyor. Nora telefonu açıyor: ~Weiß.~ Boşluğa dokun ve seç.'),
            exercise: { type: 'choice', dialogue: true, lines: [
                    (0, orte_types_1.choiceLine)('t1', ['Guten Tag, ', gap(['hier', 'da', 'wo'], 'hier'), ' ist Papadakis. Ist der Herd noch da?'], 'nikos'),
                    (0, orte_types_1.choiceLine)('t2', ['Ja, ', gap(['er', 'sie', 'es'], 'er'), ' ist noch da.'], 'nora'),
                    (0, orte_types_1.choiceLine)('t3', ['Ich habe eine Frage: Wie ', gap(['alt', 'hoch', 'kostet'], 'alt'), ' ist der Herd?'], 'nikos'),
                    (0, orte_types_1.choiceLine)('t4', ['Er ist sechs ', gap(['Jahre', 'Euro', 'Meter'], 'Jahre'), ' alt, aber er funktioniert.'], 'nora'),
                    (0, orte_types_1.choiceLine)('t5', ['Und was ', gap(['kostet', 'ist', 'hat'], 'kostet'), ' er?'], 'nikos'),
                    (0, orte_types_1.choiceLine)('t6', ['Er kostet vierzig ', gap(['Euro', 'Jahre', 'Zentimeter'], 'Euro'), '.'], 'nora'),
                    (0, orte_types_1.choiceLine)('t7', ['Gut! Danke, ich ', gap(['komme', 'koste', 'bin'], 'komme'), '.'], 'nikos'),
                ] } },
        { id: 'pruefung', title: (0, orte_types_1.T)('Alıştırma 6'), kind: 'exercise', kicker: 'Alıştırma 6 · Prüfung: Hören und antworten', heading: (0, orte_types_1.T)('Sınav tipi: soruyu dinle, cevabı seç'), lead: (0, orte_types_1.T)('Start Deutsch A1 sınavında böyle sorular var. Dinle düğmesine dokun, sonra uyan cevabı seç.'),
            exercise: { type: 'quiz', items: [
                    { listen: { text: 'Ist der Kühlschrank noch da?', who: 'yasemin' }, options: ['Ja, er ist noch da.', 'Ja, sie ist noch da.', 'Er kostet 95 Euro.'] },
                    { listen: { text: 'Was kostet die Spülmaschine?', who: 'nikos' }, options: ['Sie kostet 230 Euro.', 'Sie ist drei Jahre alt.', 'Er kostet 230 Euro.'] },
                    { listen: { text: 'Wie alt ist das Sofa?', who: 'yasemin' }, options: ['Es ist fünf Jahre alt.', 'Er ist fünf Jahre alt.', 'Es kostet fünf Euro.'] },
                    { listen: { text: 'Oh, der Tisch ist schön!', who: 'nora' }, options: ['Stimmt! Er ist sehr schön.', 'Ja, sie ist schön.', 'Er kostet 50 Euro.'] },
                    { listen: { text: 'Wie ist die Adresse?', who: 'nikos' }, options: ['Lindenstraße 18.', 'Fünfundneunzig Euro.', 'Vier Jahre alt.'] },
                    { listen: { text: 'Wie breit ist der Schrank?', who: 'yasemin' }, options: ['Er ist 70 cm breit.', 'Er ist 180 cm hoch.', 'Er ist 12 Jahre alt.'] },
                ].map(item => ({ ...item, prompt: (0, orte_types_1.T)('Hangi cevap uyar?'), say: item.options[0] })) } },
        { id: 'test', title: 'Test', kind: 'test', test: [
                ['35', ['fünfunddreißig', 'dreiundfünfzig', 'dreißigfünf'], 'fünfunddreißig', 'fünfunddreißig'],
                ['„achtundsechzig“', ['68', '86', '608'], '68', 'achtundsechzig'],
                ['30', ['dreißig', 'dreizig', 'dreizehn'], 'dreißig', 'dreißig'],
                ['70', ['siebzig', 'siebenzig', 'siebzehn'], 'siebzig', 'siebzig'],
                ['200', ['zweihundert', 'zwanzighundert', 'zweitausend'], 'zweihundert', 'zweihundert'],
                ['___ kostet der Herd?', ['Was', 'Wie', 'Wo'], 'Was', 'Was kostet der Herd?'],
                ['___ alt ist die Waschmaschine?', ['Wie', 'Was', 'Wer'], 'Wie', 'Wie alt ist die Waschmaschine?'],
                ['Die Spülmaschine? ___ kostet 230 Euro.', ['Sie', 'Er', 'Es'], 'Sie', 'Sie kostet zweihundertdreißig Euro.'],
                ['Der Schrank ist 180 cm ___.', ['hoch', 'Euro', 'Jahre'], 'hoch', 'Der Schrank ist hundertachtzig Zentimeter hoch.'],
                [(0, orte_types_1.T)('Telefonu açan kişi Almanya’da çoğu zaman ne der?'), ['Krüger.', 'Hier ist Telefon.', 'Ich bin hier.'], 'Krüger.', 'Krüger.'],
                ['Ist der Kühlschrank noch ___?', ['da', 'kommen', 'kostet'], 'da', 'Ist der Kühlschrank noch da?'],
                [(0, orte_types_1.T)('„cm“ ne demek?'), ['Zentimeter', 'Meter', 'Euro'], 'Zentimeter', 'Zentimeter'],
            ] },
        { id: 'konus', title: (0, orte_types_1.T)('Konuş'), kind: 'speak', lead: (0, orte_types_1.T)('Şimdi ilanı sen verdin, Yasemin seni arıyor. Soruyu dinle, cevabı dinle, sonra sen yüksek sesle söyle.'), speak: [
                { who: 'yasemin', question: 'Guten Tag, hier ist Arslan. Ist die Waschmaschine noch da?', answer: 'Ja, sie ist noch da.' },
                { who: 'yasemin', question: 'Wie alt ist die Waschmaschine?', answer: 'Sie ist drei Jahre alt.' },
                { who: 'yasemin', question: 'Und was kostet sie?', answer: 'Sie kostet hundertfünfundsiebzig Euro.' },
                { who: 'yasemin', question: 'Wie ist die Adresse?', answer: 'Lindenstraße 18, hier in Bremen.' },
                { who: 'yasemin', question: 'Danke, ich komme!', answer: 'Gut! Auf Wiedersehen!' },
            ] },
        { id: 'ozet', title: (0, orte_types_1.T)('Bitti'), kind: 'end', end: {
                can: [(0, orte_types_1.T)('Sayıları 1000’e kadar söylemek: *einundzwanzig, dreißig, hundertfünfzig* …'), (0, orte_types_1.T)('İlanları anlamak: *cm, m, €, Jahre alt*'), (0, orte_types_1.T)('Sormak: *Wie alt / hoch / breit ist …? Was kostet …?*'), (0, orte_types_1.T)('Telefonda: *Guten Tag, hier ist … · Ist … noch da? · Danke, ich komme!*')],
                summary: (0, orte_types_1.T)('**Kısa özet:** _21 = einundzwanzig_ (önce birler) · _dreißig, sechzig, siebzig_ · _Was kostet der Herd? – Er kostet 40 Euro._ · _Wie alt ist sie? – Sie ist 3 Jahre alt._'),
                next: { part: 'd', title: 'Ich arbeite hier.' },
            } },
    ],
};
