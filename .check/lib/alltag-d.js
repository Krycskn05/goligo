"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partD = exports.wordsD = void 0;
/**
 * Lektion 5 „Alltag und Freizeit“, Teil D – Mein Hobby ist auch mein Beruf. Nora's interview with Mei for the course
 * newspaper (Mei teaches cooking courses and works as a waitress), notes „beruflich / in der Freizeit“, the questions
 * of an interview with Sie and du (Ihr / Ihre, a reminder of Lektion 4: mein, dein, sein, ihr …), two more people whose
 * hobby is a job (Tomasz trains young basketball players, Aisha teaches children to swim), regular or irregular verbs
 * (the four posters e → i, e → ie, a → ä, au → äu), the pantomime game, the summary and „Alles klar?“ over the whole
 * unit. Our own texts after the topics of the learner's books (8 November 2026); the people are the site's.
 */
const alltag_types_1 = require("./alltag-types");
const alltag_pictures_1 = require("./alltag-pictures");
/** A hobby and a job. */
exports.wordsD = [
    { de: 'der Beruf', plural: 'Berufe', tr: (0, alltag_types_1.T)('meslek'), emoji: '💼', pic: alltag_pictures_1.alltagPic.beruf },
    { de: 'das Hobby', plural: 'Hobbys', tr: (0, alltag_types_1.T)('hobi'), emoji: '🎨', pic: alltag_pictures_1.alltagPic.hobby },
    { de: 'unterrichten', tr: (0, alltag_types_1.T)('ders vermek, öğretmek'), emoji: '🧑‍🏫', pic: alltag_pictures_1.alltagPic.unterrichten },
    { de: 'der Kochkurs', plural: 'Kochkurse', tr: (0, alltag_types_1.T)('yemek kursu'), emoji: '🍲', pic: alltag_pictures_1.alltagPic.kochkurs },
    { de: 'die Kellnerin', plural: 'Kellnerinnen', tr: (0, alltag_types_1.T)('garson (kadın); der Kellner: garson (erkek)'), emoji: '🍽️', pic: alltag_pictures_1.alltagPic.kellnerin },
    { de: 'das Interview', plural: 'Interviews', tr: (0, alltag_types_1.T)('röportaj'), emoji: '🎤', pic: alltag_pictures_1.alltagPic.interview },
    { de: 'der Trainer', plural: 'Trainer', tr: (0, alltag_types_1.T)('antrenör'), emoji: '🏀', pic: alltag_pictures_1.alltagPic.trainer },
    { de: 'der Schwimmkurs', plural: 'Schwimmkurse', tr: (0, alltag_types_1.T)('yüzme kursu'), emoji: '🏊‍♂️', pic: alltag_pictures_1.alltagPic.schwimmkurs },
    { de: 'die Pantomime', plural: 'Pantomimen', tr: (0, alltag_types_1.T)('pandomim (sessiz oyun)'), emoji: '🤐', pic: alltag_pictures_1.alltagPic.pantomime },
    { de: 'das Plakat', plural: 'Plakate', tr: (0, alltag_types_1.T)('afiş, poster'), emoji: '🪧', pic: alltag_pictures_1.alltagPic.plakate },
    { de: 'lange schlafen', tr: (0, alltag_types_1.T)('uzun uyumak, geç kalkmak'), emoji: '😴', pic: alltag_pictures_1.alltagPic.langeSchlafen },
];
/** Nora's interview with Mei (Konu 1). */
const interview = [
    (0, alltag_types_1.line)('nora', 'Hallo, Frau Suwan! Kochen ist für Sie ein Hobby, oder?', 'Merhaba Bayan Suwan! Yemek pişirmek sizin için bir hobi, değil mi?'),
    (0, alltag_types_1.line)('mei', 'Ja, aber nicht nur. Kochen ist auch mein Beruf. Ich unterrichte Kochkurse.', 'Evet ama sadece hobi değil. Yemek pişirmek aynı zamanda mesleğim. Yemek kursları veriyorum.'),
    (0, alltag_types_1.line)('nora', 'Was unterrichten Sie?', 'Ne öğretiyorsunuz?'),
    (0, alltag_types_1.line)('mei', 'Ich unterrichte Thai-Küche: Essen aus Thailand. Ich komme aus Bangkok. Meine Mutter und mein Bruder kochen auch sehr gern.', 'Tay mutfağını öğretiyorum: Tayland yemeklerini. Bangkok’tanım. Annem ve erkek kardeşim de yemek yapmayı çok sever.'),
    (0, alltag_types_1.line)('nora', 'Wann sind Ihre Kurse?', 'Kurslarınız ne zaman?'),
    (0, alltag_types_1.line)('mei', 'Am Dienstagabend und am Samstagvormittag.', 'Salı akşamı ve cumartesi öğleden önce.'),
    (0, alltag_types_1.line)('nora', 'Haben Sie noch einen Beruf?', 'Başka bir mesleğiniz de var mı?'),
    (0, alltag_types_1.line)('mei', 'Ja, ich arbeite auch als Kellnerin. Das macht Spaß, aber ich arbeite viel. Im Restaurant treffe ich jeden Tag Leute.', 'Evet, garson olarak da çalışıyorum. Eğlenceli ama çok çalışıyorum. Restoranda her gün insanlarla karşılaşıyorum.'),
    (0, alltag_types_1.line)('nora', 'Was machen Sie in Ihrer Freizeit?', 'Boş zamanınızda ne yapıyorsunuz?'),
    (0, alltag_types_1.line)('mei', 'Ich habe viele Hobbys: Ich schwimme gern und ich lese viel. Ich spiele auch gern Tischtennis mit Nikos. Am Sonntag schlafe ich lange. Und ich koche natürlich gern!', 'Birçok hobim var: yüzmeyi severim, çok okurum. Nikos’la masa tenisi oynamayı da severim. Pazar günü uzun uyurum. Ve tabii ki yemek yapmayı severim!'),
    (0, alltag_types_1.line)('nora', 'Vielen Dank, Frau Suwan!', 'Çok teşekkürler, Bayan Suwan!'),
];
/** Tomasz and Aisha tell about themselves (Konu 4; Alıştırma 3 tells it again with er / sie). */
const tomasz = [
    (0, alltag_types_1.row)('Ich bin Tomasz. Ich trainiere Basketball mit Jugendlichen, am Montagabend und am Mittwochabend.', 'Ben Tomasz. Gençlerle basketbol antrenmanı yapıyorum, pazartesi ve çarşamba akşamları.'),
    (0, alltag_types_1.row)('Basketball ist mein Hobby. Von Beruf bin ich Kellner.', 'Basketbol benim hobim. Mesleğim garsonluk.'),
    (0, alltag_types_1.row)('In meiner Freizeit fahre ich gern Fahrrad und ich spiele mit Jan und Zofia.', 'Boş zamanımda bisiklete binmeyi severim ve Jan’la Zofia ile oynarım.'),
];
const aisha = [
    (0, alltag_types_1.row)('Ich bin Aisha. Am Samstagvormittag unterrichte ich Schwimmen für Kinder.', 'Ben Aisha. Cumartesi öğleden önce çocuklara yüzme öğretiyorum.'),
    (0, alltag_types_1.row)('Das ist nicht mein Beruf. Ich bin Lehrerin, aber ich arbeite als Taxifahrerin.', 'Bu benim mesleğim değil. Öğretmenim ama taksi şoförü olarak çalışıyorum.'),
    (0, alltag_types_1.row)('In meiner Freizeit schwimme ich, ich lese und ich tanze gern mit Amani.', 'Boş zamanımda yüzerim, okurum ve Amani ile dans etmeyi severim.'),
];
const groups = ['e → i', 'e → ie', 'a → ä', 'au → äu'];
const group = (verb, right) => ({ prompt: verb, options: [right, ...groups.filter(item => item !== right)] });
exports.partD = {
    id: 'd', badge: 'D', title: 'Mein Hobby ist auch mein Beruf.',
    lead: (0, alltag_types_1.T)('Bir röportaj: **Was unterrichten Sie? Wann sind Ihre Kurse?** · iş ve boş zaman · düzenli mi düzensiz mi? · pandomim · **Alles klar?**'),
    cover: alltag_pictures_1.alltagCovers.d, coverAlt: (0, alltag_types_1.T)('Nora bir defterle Mei ile röportaj yapıyor; Mei bir yemek kursunda önlüğüyle tencerenin başında gülümsüyor'),
    short: { 'interview-fragen': (0, alltag_types_1.T)('Hangi soru?'), 'notizen': (0, alltag_types_1.T)('İş mi boş zaman mı?'), 'profile': (0, alltag_types_1.T)('Tomasz ve Aisha'), 'plakate': (0, alltag_types_1.T)('Fiil afişleri'), 'regelmaessig': (0, alltag_types_1.T)('Düzenli mi?'), 'pantomime': (0, alltag_types_1.T)('Pandomim'), 'antwort': (0, alltag_types_1.T)('Hangi cevap?'), 'und-du': (0, alltag_types_1.T)('Şimdi sen') },
    steps: [
        { id: 'kapak', title: (0, alltag_types_1.T)('Kapak'), kind: 'cover', cover: {
                intro: (0, alltag_types_1.T)('Nora kurs gazetesi için Mei ile konuşuyor. Mei’nin hobisi yemek pişirmek ama bu aynı zamanda onun işi: yemek kursları veriyor! Tomasz ve Aisha’nın da böyle hobileri var. Bu bölümde bir röportajı anlayacak, düzensiz fiilleri toplayacak ve bütün üniteyi „Alles klar?“ ile bitireceksin.'),
                learn: [(0, alltag_types_1.T)('Bir röportaj: *Was unterrichten Sie? Wann sind Ihre Kurse?*'), (0, alltag_types_1.T)('İş ve boş zaman: *beruflich · in der Freizeit*'), (0, alltag_types_1.T)('*Sie* ve *du* ile soru: *Haben Sie …? / Hast du …?*'), (0, alltag_types_1.T)('Düzenli mi düzensiz mi? Fiil afişleri: *e → i, e → ie, a → ä, au → äu*'), (0, alltag_types_1.T)('Pandomim oyunu: *Du liest ein Buch! – Ja, richtig!*'), (0, alltag_types_1.T)('**Alles klar?** Bütün ünitenin testi')],
                cast: ['nora', 'mei', 'tomasz', 'aisha', 'rami', 'nikos', 'paul'],
            } },
        { id: 'beruf-hobby', title: (0, alltag_types_1.T)('Kelimeler: iş ve hobi'), kind: 'teach', kicker: 'Wortschatz · Hobby und Beruf', heading: (0, alltag_types_1.T)('Hobi ve meslek'),
            lead: (0, alltag_types_1.T)('Her kelime artikeliyle. Karta dokun: tekili ve çoğulu okunur.'),
            blocks: [{ t: 'cards', words: exports.wordsD }] },
        { id: 'kelimeler', title: (0, alltag_types_1.T)('Kelimeler: diğerleri'), kind: 'teach', kicker: 'Wortschatz · Wörter', heading: (0, alltag_types_1.T)('Röportaj ve fiil kelimeleri'),
            lead: (0, alltag_types_1.T)('Her satırda kelime, anlamı ve bir örnek cümle var. Satıra dokununca örnek cümle okunur.'),
            blocks: [{ t: 'list', words: [
                        (0, alltag_types_1.listWord)('beruflich', 'iş olarak, meslek olarak', 'Was machen Sie beruflich?', 'Ne iş yapıyorsunuz?'),
                        (0, alltag_types_1.listWord)('in der Freizeit', 'boş zamanda', 'In der Freizeit lese ich.', 'Boş zamanımda okurum.'),
                        (0, alltag_types_1.listWord)('noch', 'daha, başka; hâlâ', 'Haben Sie noch einen Beruf?', 'Başka bir mesleğiniz de var mı?'),
                        (0, alltag_types_1.listWord)('viel', 'çok', 'Ich arbeite viel.', 'Çok çalışıyorum.'),
                        (0, alltag_types_1.listWord)('jeden Tag', 'her gün', 'Ich laufe jeden Tag.', 'Her gün koşarım.'),
                        (0, alltag_types_1.listWord)('lange', 'uzun süre', 'Am Sonntag schlafe ich lange.', 'Pazar günü uzun uyurum.'),
                        (0, alltag_types_1.listWord)('natürlich', 'tabii ki', 'Ich koche natürlich gern!', 'Tabii ki yemek yapmayı severim!'),
                        (0, alltag_types_1.listWord)('regelmäßig', 'düzenli', '„kochen“ ist regelmäßig: du kochst.', '„kochen“ düzenlidir: du kochst.'),
                        (0, alltag_types_1.listWord)('unregelmäßig', 'düzensiz', '„fahren“ ist unregelmäßig: du fährst.', '„fahren“ düzensizdir: du fährst.'),
                        (0, alltag_types_1.listWord)('die Verbliste, die Verblisten', 'fiil listesi', 'Die Verbliste hilft.', 'Fiil listesi yardımcı olur.'),
                        (0, alltag_types_1.listWord)('raten', 'tahmin etmek', 'Was mache ich? Rate mal!', 'Ne yapıyorum? Tahmin et!'),
                        (0, alltag_types_1.listWord)('richtig', 'doğru', 'Ja, richtig!', 'Evet, doğru!'),
                        (0, alltag_types_1.listWord)('falsch', 'yanlış', 'Nein, leider falsch.', 'Hayır, maalesef yanlış.'),
                        (0, alltag_types_1.listWord)('Vielen Dank!', 'Çok teşekkürler!', 'Vielen Dank, Frau Suwan!', 'Çok teşekkürler, Bayan Suwan!'),
                    ] }] },
        { id: 'kontrol', title: (0, alltag_types_1.T)('Kelime kontrolü'), kind: 'teach', kicker: 'Wortschatz · Kontrolle', heading: (0, alltag_types_1.T)('Kelimeleri hatırlıyor musun?'),
            lead: (0, alltag_types_1.T)('Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.'),
            blocks: [{ t: 'checks', title: (0, alltag_types_1.T)('6 kısa soru'), items: [
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('ders vermek, öğretmek'), ['unterrichten', 'trainieren', 'lernen']),
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('yaptığın iş, meslek'), ['der Beruf', 'das Hobby', 'der Kurs']),
                        (0, alltag_types_1.check)('„beruflich“', [(0, alltag_types_1.T)('iş olarak'), (0, alltag_types_1.T)('boş zamanda'), (0, alltag_types_1.T)('her gün')], ''),
                        (0, alltag_types_1.check)('„Rate mal!“', [(0, alltag_types_1.T)('Tahmin et!'), (0, alltag_types_1.T)('Oku!'), (0, alltag_types_1.T)('Çalış!')], ''),
                        (0, alltag_types_1.check)('„unregelmäßig“', [(0, alltag_types_1.T)('düzensiz'), (0, alltag_types_1.T)('düzenli'), (0, alltag_types_1.T)('her gün')], ''),
                        (0, alltag_types_1.check)('„Haben Sie noch einen Beruf?“', [(0, alltag_types_1.T)('Başka bir mesleğiniz de var mı?'), (0, alltag_types_1.T)('Mesleğiniz ne?'), (0, alltag_types_1.T)('Hâlâ çalışıyor musunuz?')], ''),
                    ] }] },
        { id: 'interview-konu', title: (0, alltag_types_1.T)('Röportaj'), kind: 'teach', kicker: (0, alltag_types_1.T)('Konu 1 · Ein Interview mit Mei'), heading: (0, alltag_types_1.T)('Hobim aynı zamanda mesleğim'),
            blocks: [
                { t: 'p', text: (0, alltag_types_1.T)('Nora kurs gazetesi için Mei ile konuşuyor. Röportajda *Sie* kullanılıyor. Dinle: her kişi kendi sesiyle.') },
                { t: 'talk', lines: interview },
                { t: 'checks', items: [
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('Mei ne öğretiyor?'), ['Thai-Küche', 'Tischtennis', 'Deutsch'], 'Sie unterrichtet Thai-Küche.'),
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('Kursları ne zaman?'), ['am Dienstagabend und am Samstagvormittag', 'am Montagabend', 'am Sonntag'], 'Ihre Kurse sind am Dienstagabend und am Samstagvormittag.'),
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('Mei’nin başka işi ne?'), ['Sie ist Kellnerin.', 'Sie ist Lehrerin.', 'Sie ist Ärztin.'], 'Sie arbeitet auch als Kellnerin.'),
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('Pazar günü ne yapıyor?'), ['Sie schläft lange.', 'Sie arbeitet.', 'Sie boxt.'], 'Am Sonntag schläft sie lange.'),
                    ] },
            ] },
        { id: 'notizen-konu', title: (0, alltag_types_1.T)('İş ve boş zaman'), kind: 'teach', kicker: (0, alltag_types_1.T)('Konu 2 · beruflich – in der Freizeit'), heading: (0, alltag_types_1.T)('Mei: iş ve boş zaman'),
            blocks: [
                { t: 'p', text: (0, alltag_types_1.T)('Nora notlarını iki sütuna yazıyor: işle ilgili olanlar (*beruflich*) ve boş zaman (*in der Freizeit*). Şimdi Mei’yi anlatıyoruz: fiil *-t* alır.') },
                { t: 'table', head: ['beruflich', 'in der Freizeit'], rows: [['Sie unterrichtet Kochkurse.', 'Sie schwimmt gern.'], ['Ihre Kurse sind am Dienstagabend und am Samstagvormittag.', 'Sie liest viel.'], ['Sie arbeitet auch als Kellnerin.', 'Sie spielt Tischtennis mit Nikos.'], ['Sie trifft jeden Tag Leute.', 'Am Sonntag schläft sie lange.']],
                    say: ['Sie unterrichtet Kochkurse. Sie schwimmt gern.', 'Ihre Kurse sind am Dienstagabend und am Samstagvormittag. Sie liest viel.', 'Sie arbeitet auch als Kellnerin. Sie spielt Tischtennis mit Nikos.', 'Sie trifft jeden Tag Leute. Am Sonntag schläft sie lange.'] },
                { t: 'warn', text: (0, alltag_types_1.T)('Düzensiz fiillere dikkat: ~sie liest~, ~sie trifft~, ~sie schläft~ (Teil B).') },
                { t: 'rows', rows: [(0, alltag_types_1.row)('Was macht Mei beruflich? – Sie unterrichtet Kochkurse.', 'Mei ne iş yapıyor? – Yemek kursları veriyor.'), (0, alltag_types_1.row)('Was macht Mei gern? – Sie kocht gern und sie schwimmt gern.', 'Mei neyi sever? – Yemek pişirmeyi ve yüzmeyi sever.')] },
            ] },
        { id: 'fragen-konu', title: (0, alltag_types_1.T)('Röportaj soruları'), kind: 'teach', kicker: (0, alltag_types_1.T)('Konu 3 · Fragen: Sie und du'), heading: (0, alltag_types_1.T)('Siz mi, sen mi? Röportaj soruları'),
            blocks: [
                { t: 'p', text: (0, alltag_types_1.T)('Bir röportajda tanımadığın biriyle *Sie* ile konuşursun; bir arkadaşınla *du* ile. Fiil ve iyelik (*Ihr / dein*) de değişir. Satıra dokun ve dinle.') },
                { t: 'table', head: ['Sie', 'du'], rows: [['Was unterrichten Sie?', 'Was unterrichtest du?'], ['Wann sind Ihre Kurse?', 'Wann sind deine Kurse?'], ['Haben Sie noch einen Beruf?', 'Hast du noch einen Beruf?'], ['Was machen Sie beruflich?', 'Was machst du beruflich?'], ['Was machen Sie in Ihrer Freizeit?', 'Was machst du in deiner Freizeit?']],
                    say: ['Was unterrichten Sie? Was unterrichtest du?', 'Wann sind Ihre Kurse? Wann sind deine Kurse?', 'Haben Sie noch einen Beruf? Hast du noch einen Beruf?', 'Was machen Sie beruflich? Was machst du beruflich?', 'Was machen Sie in Ihrer Freizeit? Was machst du in deiner Freizeit?'] },
                { t: 'h', text: (0, alltag_types_1.T)('Hatırla: iyelik (Lektion 4)') },
                { t: 'table', head: ['', '', (0, alltag_types_1.T)('örnek')], rows: [['ich', 'mein / meine', 'Mein Hobby ist Kochen.'], ['du', 'dein / deine', 'Wann sind deine Kurse?'], ['er', 'sein / seine', 'Sein Beruf ist Kellner.'], ['sie', 'ihr / ihre', 'Ihre Kurse sind am Dienstag.'], ['wir', 'unser / unsere', 'Unser Kurs ist am Montag.'], ['ihr', 'euer / eure', 'Wann ist euer Kurs?'], ['Sie', 'Ihr / Ihre', 'Wann sind Ihre Kurse, Frau Suwan?']],
                    say: ['ich, mein, meine. Mein Hobby ist Kochen.', 'du, dein, deine. Wann sind deine Kurse?', 'er, sein, seine. Sein Beruf ist Kellner.', 'sie, ihr, ihre. Ihre Kurse sind am Dienstag.', 'wir, unser, unsere. Unser Kurs ist am Montag.', 'ihr, euer, eure. Wann ist euer Kurs?', 'Sie, Ihr, Ihre. Wann sind Ihre Kurse, Frau Suwan?'] },
                { t: 'note', text: (0, alltag_types_1.T)('*in Ihrer Freizeit / in deiner Freizeit / in meiner Freizeit* hazır bir kalıp: olduğu gibi öğren. (*-er* eki sonraki ünitelerde.)') },
                { t: 'checks', items: [
                        (0, alltag_types_1.check)('Frau Suwan, wann sind ___ Kurse?', ['Ihre', 'deine', 'eure'], 'Frau Suwan, wann sind Ihre Kurse?'),
                        (0, alltag_types_1.check)('Mei, ___ du noch einen Beruf?', ['hast', 'haben', 'hat'], 'Mei, hast du noch einen Beruf?'),
                        (0, alltag_types_1.check)('Was machen Sie in ___ Freizeit?', ['Ihrer', 'deiner', 'meiner'], 'Was machen Sie in Ihrer Freizeit?'),
                    ] },
            ] },
        { id: 'zwei-konu', title: (0, alltag_types_1.T)('Tomasz ve Aisha'), kind: 'teach', kicker: (0, alltag_types_1.T)('Konu 4 · Wer unterrichtet was?'), heading: (0, alltag_types_1.T)('İki kişi daha: hobi mi meslek mi?'),
            blocks: [
                { t: 'p', text: (0, alltag_types_1.T)('Tomasz ve Aisha da bir şey öğretiyor. Ama bu onların mesleği mi? Satıra dokun: kendi sesleriyle okurlar.') },
                { t: 'rows', who: 'tomasz', rows: tomasz },
                { t: 'rows', who: 'aisha', rows: aisha },
                { t: 'table', head: ['', 'Tomasz', 'Aisha'], rows: [['Was?', 'Basketball', 'Schwimmen'], ['Wann?', 'am Montagabend und am Mittwochabend', 'am Samstagvormittag'], ['Beruf?', 'Kellner', 'Lehrerin; sie arbeitet als Taxifahrerin'], ['Freizeit?', 'Fahrrad fahren, mit Jan und Zofia spielen', 'schwimmen, lesen, mit Amani tanzen']],
                    say: ['Tomasz trainiert Basketball. Aisha unterrichtet Schwimmen.', 'Tomasz: am Montagabend und am Mittwochabend. Aisha: am Samstagvormittag.', 'Tomasz ist Kellner. Aisha ist Lehrerin, aber sie arbeitet als Taxifahrerin.', 'Tomasz fährt gern Fahrrad. Aisha schwimmt, liest und tanzt gern.'] },
                { t: 'rows', rows: [(0, alltag_types_1.row)('Was unterrichtet Aisha? – Sie unterrichtet Schwimmen.', 'Aisha ne öğretiyor? – Yüzme öğretiyor.'), (0, alltag_types_1.row)('Ist das ihr Beruf? – Nein, sie ist Taxifahrerin.', 'Bu onun mesleği mi? – Hayır, taksi şoförü.'), (0, alltag_types_1.row)('Was macht Tomasz in der Freizeit? – Er fährt gern Fahrrad.', 'Tomasz boş zamanında ne yapıyor? – Bisiklete binmeyi seviyor.')] },
                { t: 'checks', items: [
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('Tomasz’ın mesleği ne?'), ['Kellner', 'Trainer', 'Taxifahrer'], 'Von Beruf ist Tomasz Kellner.'),
                        (0, alltag_types_1.check)((0, alltag_types_1.T)('Aisha ne zaman yüzme öğretiyor?'), ['am Samstagvormittag', 'am Montagabend', 'am Sonntag'], 'Am Samstagvormittag unterrichtet Aisha Schwimmen.'),
                        (0, alltag_types_1.check)('Tomasz ___ gern Fahrrad.', ['fährt', 'fahrt', 'fährst'], 'Tomasz fährt gern Fahrrad.'),
                    ] },
            ] },
        { id: 'verben-konu', title: (0, alltag_types_1.T)('Düzenli mi düzensiz mi?'), kind: 'teach', kicker: (0, alltag_types_1.T)('Konu 5 · regelmäßig oder unregelmäßig?'), heading: (0, alltag_types_1.T)('Dört fiil afişi'),
            blocks: [
                { t: 'p', text: (0, alltag_types_1.T)('Çoğu fiil düzenlidir: *kochen → du kochst, er kocht*. Düzensiz fiillerde *du* ve *er / es / sie* değişir. Sınıfta dört afiş yaptık: her afişte bir değişim türü.') },
                { t: 'table', head: ['e → i', 'e → ie', 'a → ä', 'au → äu'], rows: [['sprechen: du sprichst', 'sehen: du siehst', 'fahren: du fährst', 'laufen: du läufst'], ['treffen: du triffst', 'lesen: du liest', 'schlafen: du schläfst', '–'], ['essen: du isst', '–', '–', '–'], ['helfen: du hilfst', '–', '–', '–']],
                    say: ['sprechen, du sprichst. sehen, du siehst. fahren, du fährst. laufen, du läufst.', 'treffen, du triffst. lesen, du liest. schlafen, du schläfst.', 'essen, du isst.', 'helfen, du hilfst.'] },
                { t: 'table', head: ['regelmäßig', 'unregelmäßig'], rows: [['kochen, spielen, wohnen, lernen', 'fahren, schlafen, laufen'], ['tanzen, schwimmen, hören, kaufen', 'sehen, lesen'], ['arbeiten, unterrichten, trainieren', 'sprechen, treffen, essen, helfen']],
                    say: ['kochen, spielen, wohnen, lernen. fahren, schlafen, laufen.', 'tanzen, schwimmen, hören, kaufen. sehen, lesen.', 'arbeiten, unterrichten, trainieren. sprechen, treffen, essen, helfen.'] },
                { t: 'note', text: (0, alltag_types_1.T)('Strateji: yeni bir fiili sözlükte ya da fiil listesinde (Verbliste) üç biçimiyle bul ve öyle öğren: ~lesen – du liest – er liest~. Sitedeki Fiil Atölyesi’nde de çalışabilirsin.') },
                { t: 'warn', text: (0, alltag_types_1.T)('*haben* ve *sein* de özeldir: ~du hast, er hat~ · ~du bist, er ist~.') },
            ] },
        { id: 'pantomime-konu', title: (0, alltag_types_1.T)('Pandomim'), kind: 'teach', kicker: (0, alltag_types_1.T)('Konu 6 · Pantomime'), heading: (0, alltag_types_1.T)('Ne yapıyorum? Tahmin et!'),
            blocks: [
                { t: 'p', text: (0, alltag_types_1.T)('Pandomimde konuşmadan bir şey yaparsın, öteki tahmin eder. Rami oynuyor, Nikos ve Mei tahmin ediyor. Tahminlerde *du* biçimine dikkat: *du liest, du siehst*.') },
                { t: 'talk', lines: [
                        (0, alltag_types_1.line)('rami', 'Was mache ich? Rate mal!', 'Ne yapıyorum? Tahmin et!'),
                        (0, alltag_types_1.line)('nikos', 'Du liest ein Buch!', 'Kitap okuyorsun!'),
                        (0, alltag_types_1.line)('rami', 'Nein, leider falsch.', 'Hayır, maalesef yanlış.'),
                        (0, alltag_types_1.line)('mei', 'Du siehst einen Film.', 'Film izliyorsun.'),
                        (0, alltag_types_1.line)('rami', 'Ja, richtig! Und jetzt? Was mache ich?', 'Evet, doğru! Peki şimdi? Ne yapıyorum?'),
                        (0, alltag_types_1.line)('mei', 'Du fährst Fahrrad!', 'Bisiklete biniyorsun!'),
                        (0, alltag_types_1.line)('rami', 'Nein! Ich laufe!', 'Hayır! Koşuyorum!'),
                    ] },
                { t: 'rows', rows: [(0, alltag_types_1.row)('Was mache ich? Rate mal!', 'Ne yapıyorum? Tahmin et!'), (0, alltag_types_1.row)('Du liest ein Buch!', 'Kitap okuyorsun!'), (0, alltag_types_1.row)('Ja, richtig!', 'Evet, doğru!'), (0, alltag_types_1.row)('Nein, leider falsch.', 'Hayır, maalesef yanlış.')] },
                { t: 'note', text: (0, alltag_types_1.T)('Oyun: bir arkadaşınla oyna. Afişlerdeki fiilleri kullan: ~Du schläfst! Du isst! Du sprichst!~') },
            ] },
        { id: 'ozet-konu', title: (0, alltag_types_1.T)('Özet'), kind: 'teach', kicker: (0, alltag_types_1.T)('Konu 7 · Zusammenfassung'), heading: (0, alltag_types_1.T)('Bütün ünite bir bakışta'),
            blocks: [
                { t: 'p', text: (0, alltag_types_1.T)('„Alles klar?“ testinden önce bütün üniteyi tekrar et. Satıra dokun ve dinle.') },
                { t: 'table', head: [(0, alltag_types_1.T)('konu'), (0, alltag_types_1.T)('örnek')], rows: [[(0, alltag_types_1.T)('günün bölümleri'), 'am Morgen, am Mittag, am Abend, in der Nacht'], [(0, alltag_types_1.T)('morgen = yarın'), 'Morgen habe ich frei.'], ['gern / nicht gern', 'Ich koche gern. Ich putze nicht gern.'], [(0, alltag_types_1.T)('Ja-/Nein-sorusu'), 'Hast du heute Zeit?'], [(0, alltag_types_1.T)('davet'), 'Kommst du auch? – Ja, gern! / Oh, schade.'], [(0, alltag_types_1.T)('düzensiz fiiller'), 'du fährst, er liest, sie isst, er läuft'], [(0, alltag_types_1.T)('günler'), 'am Montag, am Wochenende, am Dienstagabend'], ['ihr', 'Habt ihr Zeit? Kommt ihr?'], [(0, alltag_types_1.T)('fikir'), 'Das macht Spaß! Das ist langweilig.'], [(0, alltag_types_1.T)('röportaj'), 'Was machen Sie in Ihrer Freizeit?']],
                    say: ['am Morgen, am Mittag, am Abend, in der Nacht', 'Morgen habe ich frei.', 'Ich koche gern. Ich putze nicht gern.', 'Hast du heute Zeit?', 'Kommst du auch? Ja, gern! Oh, schade.', 'du fährst, er liest, sie isst, er läuft', 'am Montag, am Wochenende, am Dienstagabend', 'Habt ihr Zeit? Kommt ihr?', 'Das macht Spaß! Das ist langweilig.', 'Was machen Sie in Ihrer Freizeit?'] },
                { t: 'rows', all: true, rows: [(0, alltag_types_1.row)('Was machen Sie beruflich?', 'Ne iş yapıyorsunuz?'), (0, alltag_types_1.row)('Was machen Sie in Ihrer Freizeit?', 'Boş zamanınızda ne yapıyorsunuz?'), (0, alltag_types_1.row)('Mein Hobby ist auch mein Beruf.', 'Hobim aynı zamanda mesleğim.'), (0, alltag_types_1.row)('Was mache ich? Rate mal!', 'Ne yapıyorum? Tahmin et!'), (0, alltag_types_1.row)('Ja, richtig! / Nein, leider falsch.', 'Evet, doğru! / Hayır, maalesef yanlış.')] },
                { t: 'p', text: (0, alltag_types_1.T)('Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.') },
            ] },
        { id: 'interview-fragen', title: (0, alltag_types_1.T)('Alıştırma 1'), kind: 'exercise', kicker: 'Alıştırma 1 · Welche Frage passt?', heading: (0, alltag_types_1.T)('Cevaba uyan soruyu seç'), lead: (0, alltag_types_1.T)('Mei’nin cevabını oku. Nora ne sormuştu?'),
            exercise: { type: 'quiz', items: [
                    { prompt: 'Kochen! Ich unterrichte Kochkurse.', options: ['Was unterrichten Sie?', 'Wann sind Ihre Kurse?', 'Haben Sie noch einen Beruf?'] },
                    { prompt: 'Am Dienstagabend und am Samstagvormittag.', options: ['Wann sind Ihre Kurse?', 'Was unterrichten Sie?', 'Woher kommen Sie?'] },
                    { prompt: 'Ja, ich arbeite auch als Kellnerin.', options: ['Haben Sie noch einen Beruf?', 'Was machen Sie in Ihrer Freizeit?', 'Wann sind Ihre Kurse?'] },
                    { prompt: 'Ich schwimme gern und ich lese viel.', options: ['Was machen Sie in Ihrer Freizeit?', 'Was unterrichten Sie?', 'Haben Sie noch einen Beruf?'] },
                    { prompt: 'Ich komme aus Bangkok.', options: ['Woher kommen Sie?', 'Wann sind Ihre Kurse?', 'Was machen Sie beruflich?'] },
                    { prompt: 'Ja, sehr gern!', options: ['Kochen Sie gern?', 'Wann kochen Sie?', 'Was kochen Sie?'] },
                ].map(item => ({ ...item, say: item.options[0] })) } },
        { id: 'notizen', title: (0, alltag_types_1.T)('Alıştırma 2'), kind: 'exercise', kicker: 'Alıştırma 2 · beruflich oder in der Freizeit?', heading: (0, alltag_types_1.T)('İş mi, boş zaman mı?'), lead: (0, alltag_types_1.T)('Mei hakkındaki cümle işle mi ilgili, boş zamanla mı?'),
            exercise: { type: 'quiz', items: [
                    ['Sie unterrichtet Kochkurse.', 'beruflich'], ['Sie schwimmt gern.', 'in der Freizeit'], ['Sie arbeitet als Kellnerin.', 'beruflich'], ['Sie liest viel.', 'in der Freizeit'],
                    ['Am Sonntag schläft sie lange.', 'in der Freizeit'], ['Ihre Kurse sind am Dienstagabend.', 'beruflich'], ['Sie spielt Tischtennis mit Nikos.', 'in der Freizeit'], ['Im Restaurant trifft sie jeden Tag Leute.', 'beruflich'],
                ].map(([prompt, answer]) => ({ prompt, options: [answer, answer === 'beruflich' ? 'in der Freizeit' : 'beruflich'], say: prompt })) } },
        { id: 'profile', title: (0, alltag_types_1.T)('Alıştırma 3'), kind: 'exercise', kicker: 'Alıştırma 3 · Tomasz und Aisha', heading: (0, alltag_types_1.T)('Tomasz ve Aisha’yı anlat'), lead: (0, alltag_types_1.T)('Konu 4’ü hatırla. Boşluğa dokun ve seç: *er / sie* biçimi ve *sein / ihr*.'),
            exercise: { type: 'choice', lines: [
                    (0, alltag_types_1.choiceLine)('p1', ['Tomasz ', (0, alltag_types_1.gap)(['trainiert', 'trainierst', 'trainiere'], 'trainiert'), ' Basketball mit Jugendlichen.']),
                    (0, alltag_types_1.choiceLine)('p2', ['Seine Kurse ', (0, alltag_types_1.gap)(['sind', 'ist', 'seid'], 'sind'), ' am Montagabend und am Mittwochabend.']),
                    (0, alltag_types_1.choiceLine)('p3', ['Basketball ist ', (0, alltag_types_1.gap)(['sein', 'ihr', 'mein'], 'sein'), ' Hobby. Er ist Kellner von Beruf.']),
                    (0, alltag_types_1.choiceLine)('p4', ['In der Freizeit ', (0, alltag_types_1.gap)(['fährt', 'fahrt', 'fährst'], 'fährt'), ' er gern Fahrrad.']),
                    (0, alltag_types_1.choiceLine)('p5', ['Aisha ', (0, alltag_types_1.gap)(['unterrichtet', 'unterrichtest', 'unterrichten'], 'unterrichtet'), ' Schwimmen für Kinder.']),
                    (0, alltag_types_1.choiceLine)('p6', ['Das ist nicht ', (0, alltag_types_1.gap)(['ihr', 'sein', 'dein'], 'ihr'), ' Beruf: Sie ', (0, alltag_types_1.gap)(['arbeitet', 'arbeitest', 'arbeiten'], 'arbeitet'), ' als Taxifahrerin.']),
                    (0, alltag_types_1.choiceLine)('p7', ['In der Freizeit ', (0, alltag_types_1.gap)(['liest', 'lest', 'lesen'], 'liest'), ' sie und sie ', (0, alltag_types_1.gap)(['tanzt', 'tanzen', 'tanzest'], 'tanzt'), ' mit Amani.']),
                ] } },
        { id: 'plakate', title: (0, alltag_types_1.T)('Alıştırma 4'), kind: 'exercise', kicker: 'Alıştırma 4 · Vier Plakate', heading: (0, alltag_types_1.T)('Fiil hangi afişe gider?'), lead: (0, alltag_types_1.T)('Fiil *du* ile nasıl değişiyor? Doğru afişi seç. Doğrusu okunur.'),
            exercise: { type: 'quiz', items: [
                    { ...group('fahren', 'a → ä'), say: 'fahren, du fährst, er fährt' },
                    { ...group('helfen', 'e → i'), say: 'helfen, du hilfst, er hilft' },
                    { ...group('sehen', 'e → ie'), say: 'sehen, du siehst, er sieht' },
                    { ...group('laufen', 'au → äu'), say: 'laufen, du läufst, er läuft' },
                    { ...group('sprechen', 'e → i'), say: 'sprechen, du sprichst, er spricht' },
                    { ...group('lesen', 'e → ie'), say: 'lesen, du liest, er liest' },
                    { ...group('schlafen', 'a → ä'), say: 'schlafen, du schläfst, er schläft' },
                    { ...group('treffen', 'e → i'), say: 'treffen, du triffst, er trifft' },
                ] } },
        { id: 'regelmaessig', title: (0, alltag_types_1.T)('Alıştırma 5'), kind: 'exercise', kicker: 'Alıştırma 5 · regelmäßig oder unregelmäßig?', heading: (0, alltag_types_1.T)('Düzenli mi düzensiz mi?'), lead: (0, alltag_types_1.T)('*du* biçimini düşün: fiil değişiyor mu?'),
            exercise: { type: 'quiz', items: [
                    ['kochen', 'regelmäßig', 'kochen, du kochst'], ['essen', 'unregelmäßig', 'essen, du isst'], ['wohnen', 'regelmäßig', 'wohnen, du wohnst'], ['fahren', 'unregelmäßig', 'fahren, du fährst'],
                    ['spielen', 'regelmäßig', 'spielen, du spielst'], ['lesen', 'unregelmäßig', 'lesen, du liest'], ['tanzen', 'regelmäßig', 'tanzen, du tanzt'], ['laufen', 'unregelmäßig', 'laufen, du läufst'],
                ].map(([prompt, answer, say]) => ({ prompt, options: [answer, answer === 'regelmäßig' ? 'unregelmäßig' : 'regelmäßig'], say })) } },
        { id: 'pantomime', title: (0, alltag_types_1.T)('Alıştırma 6'), kind: 'exercise', kicker: 'Alıştırma 6 · Pantomime', heading: (0, alltag_types_1.T)('Tahmin doğru mu?'), lead: (0, alltag_types_1.T)('Resimde Rami’nin gerçekten ne yaptığını gör. Tahmini dinle: doğru mu, yanlış mı?'),
            exercise: { type: 'quiz', items: [
                    { pic: alltag_pictures_1.alltagPic.lesen, emoji: '📖', listen: { text: 'Du liest ein Buch!', who: 'nikos' }, options: ['Ja, richtig!', 'Nein, leider falsch.'], say: 'Ja, richtig! Du liest ein Buch.' },
                    { pic: alltag_pictures_1.alltagPic.schwimmen, emoji: '🏊', listen: { text: 'Du fährst Fahrrad!', who: 'mei' }, options: ['Nein, leider falsch.', 'Ja, richtig!'], say: 'Nein, leider falsch. Du schwimmst.' },
                    { pic: alltag_pictures_1.alltagPic.schlafen, emoji: '😴', listen: { text: 'Du schläfst!', who: 'nikos' }, options: ['Ja, richtig!', 'Nein, leider falsch.'], say: 'Ja, richtig! Du schläfst.' },
                    { pic: alltag_pictures_1.alltagPic.essen, emoji: '🍝', listen: { text: 'Du siehst einen Film.', who: 'mei' }, options: ['Nein, leider falsch.', 'Ja, richtig!'], say: 'Nein, leider falsch. Du isst.' },
                    { pic: alltag_pictures_1.alltagPic.laufen, emoji: '🏃', listen: { text: 'Du läufst!', who: 'nikos' }, options: ['Ja, richtig!', 'Nein, leider falsch.'], say: 'Ja, richtig! Du läufst.' },
                    { pic: alltag_pictures_1.alltagPic.sprechen, emoji: '💬', listen: { text: 'Du isst!', who: 'mei' }, options: ['Nein, leider falsch.', 'Ja, richtig!'], say: 'Nein, leider falsch. Du sprichst mit Freunden.' },
                ].map(item => ({ ...item, prompt: (0, alltag_types_1.T)('Rami ne yapıyor? Tahmini dinle: doğru mu?') })) } },
        { id: 'antwort', title: (0, alltag_types_1.T)('Alıştırma 7'), kind: 'exercise', kicker: 'Alıştırma 7 · Welche Antwort passt?', heading: (0, alltag_types_1.T)('Dinle: hangi cevap uyuyor?'), lead: (0, alltag_types_1.T)('Dinle düğmesine dokun ve uyan cevabı seç. Bütün ünitenin kalıpları burada.'),
            exercise: { type: 'quiz', items: [
                    { listen: { text: 'Schwimmst du gern?', who: 'mei' }, options: ['Ja, ich schwimme gern.', 'Ach, schade!', 'Am Mittwoch.'] },
                    { listen: { text: 'Ich spiele heute Fußball. Kommst du auch?', who: 'omar' }, options: ['Ja, ich komme auch!', 'Ja, ich schwimme gern.', 'Ach, schade!'] },
                    { listen: { text: 'Ich habe heute leider keine Zeit.', who: 'nikos' }, options: ['Oh, schade!', 'Das macht Spaß!', 'Ja, ich habe Zeit.'] },
                    { listen: { text: 'Findest du Boxen interessant?', who: 'yasemin' }, options: ['Nein, ich finde Boxen langweilig.', 'Ja, ich habe Zeit.', 'Am Samstag.'] },
                    { listen: { text: 'Hast du am Sonntag Zeit?', who: 'sabine' }, options: ['Ja, am Sonntag habe ich frei.', 'Nein, nicht so gern.', 'Das ist interessant!'] },
                    { listen: { text: 'Wann sind deine Kurse?', who: 'nora' }, options: ['Am Dienstagabend.', 'Ja, gern.', 'Ich unterrichte Kochkurse.'] },
                ].map(item => ({ ...item, prompt: (0, alltag_types_1.T)('Dinle. Hangi cevap uyuyor?') })) } },
        { id: 'und-du', title: (0, alltag_types_1.T)('Alıştırma 8'), kind: 'exercise', kicker: 'Alıştırma 8 · Und Sie?', heading: (0, alltag_types_1.T)('Şimdi sen: röportaj senle'), lead: (0, alltag_types_1.T)('Nora seninle konuşuyor (*Sie*). Kendi cevaplarını yaz. Kalıba uyan cümle yeşil olur. Üç cümle bitince alıştırma tamam.'),
            exercise: { type: 'own', key: 'lernkoko-l5d-own', prompts: [
                    { question: 'Was machen Sie beruflich?', pattern: /^(ich bin [a-z]+( von beruf)?|ich arbeite als [a-z]+|ich arbeite( jetzt)? nicht|ich lerne deutsch)( [a-z]+)*$/, placeholder: 'Ich arbeite als Verkäuferin.' },
                    { question: 'Was machen Sie in Ihrer Freizeit?', pattern: /^(in meiner freizeit [a-z]+ ich|ich [a-z]+ gern)( [a-z]+)*$/, placeholder: 'In meiner Freizeit lese ich gern.' },
                    { question: 'Wann haben Sie Zeit?', pattern: /^(am [a-z]+|heute [a-z]+|morgen( [a-z]+)?) (habe ich (zeit|frei)|[a-z]+ ich)( [a-z]+)*$/, placeholder: 'Am Samstagnachmittag habe ich Zeit.' },
                    { question: 'Ist Ihr Hobby auch Ihr Beruf?', pattern: /^(ja|nein)( [a-z]+)*$/, placeholder: 'Nein, mein Hobby ist Fußball.', optional: true },
                ] },
            after: [{ t: 'note', text: (0, alltag_types_1.T)('Hatırla: *Sie* ile soruda fiil *-en*: ~Was machen Sie?~ Cevapta *ich*: ~Ich mache …~') }] },
        { id: 'test', title: 'Alles klar?', kind: 'test', test: [
                ['Am ___ frühstücke ich.', ['Morgen', 'morgen', 'Nacht'], 'Morgen', 'Am Morgen frühstücke ich.'],
                ['Hast du ___ Zeit? – Ja, morgen habe ich frei.', ['morgen', 'Morgen', 'am morgen'], 'morgen', 'Hast du morgen Zeit? Ja, morgen habe ich frei.'],
                ['Ich ___ gern Tischtennis.', ['spiele', 'spielt', 'spielst'], 'spiele', 'Ich spiele gern Tischtennis.'],
                ['___ Sie gern Sport, Herr Nowak?', ['Machen', 'Machst', 'Macht'], 'Machen', 'Machen Sie gern Sport, Herr Nowak?'],
                [(0, alltag_types_1.T)('Hangisi W-sorusu?'), ['Wann hast du Zeit?', 'Hast du Zeit?', 'Kommst du auch?'], 'Wann hast du Zeit?', 'Wann hast du Zeit?'],
                ['Rami ___ gern libanesisch.', ['isst', 'esst', 'ist'], 'isst', 'Rami isst gern libanesisch.'],
                ['___ du gern Fahrrad?', ['Fährst', 'Fahrst', 'Fährt'], 'Fährst', 'Fährst du gern Fahrrad?'],
                ['Tomasz ___ gern Bücher.', ['liest', 'lest', 'lesst'], 'liest', 'Tomasz liest gern Bücher.'],
                ['Aisha ___ jeden Morgen im Park.', ['läuft', 'lauft', 'läufst'], 'läuft', 'Aisha läuft jeden Morgen im Park.'],
                [(0, alltag_types_1.T)('„cumartesi“'), ['der Samstag', 'der Sonntag', 'der Freitag'], 'der Samstag', 'der Samstag'],
                ['am Freitag + am Abend = ___', ['am Freitagabend', 'am Abendfreitag', 'im Freitagabend'], 'am Freitagabend', 'am Freitagabend'],
                ['___ ihr am Wochenende Zeit?', ['Habt', 'Hast', 'Hat'], 'Habt', 'Habt ihr am Wochenende Zeit?'],
                [(0, alltag_types_1.T)('Arkadaşın gelemiyor. Ne dersin?'), ['Oh, schade!', 'Super!', 'Viel Spaß!'], 'Oh, schade!', 'Oh, schade!'],
                ['Was machen Sie in ___ Freizeit, Frau Suwan?', ['Ihrer', 'deiner', 'ihr'], 'Ihrer', 'Was machen Sie in Ihrer Freizeit, Frau Suwan?'],
                [(0, alltag_types_1.T)('Hangi fiil düzensiz?'), ['sehen', 'spielen', 'kochen'], 'sehen', 'sehen, du siehst, er sieht'],
            ] },
        { id: 'konus', title: (0, alltag_types_1.T)('Konuş'), kind: 'speak', lead: (0, alltag_types_1.T)('Nora seninle röportaj yapıyor. Soruyu dinle, cevabı dinle, sonra sen yüksek sesle söyle. Üç cevapta senin cümlelerin var (Alıştırma 8).'), speak: [
                { who: 'nora', question: 'Was machen Sie beruflich?', answer: 'Ich arbeite als Verkäuferin.', own: { key: 'lernkoko-l5d-own', index: 0, pattern: /^(ich bin [a-z]+( von beruf)?|ich arbeite als [a-z]+|ich arbeite( jetzt)? nicht|ich lerne deutsch)( [a-z]+)*$/ } },
                { who: 'nora', question: 'Was machen Sie in Ihrer Freizeit?', answer: 'In meiner Freizeit lese ich gern.', own: { key: 'lernkoko-l5d-own', index: 1, pattern: /^(in meiner freizeit [a-z]+ ich|ich [a-z]+ gern)( [a-z]+)*$/ } },
                { who: 'nora', question: 'Wann haben Sie Zeit?', answer: 'Am Samstagnachmittag habe ich Zeit.', own: { key: 'lernkoko-l5d-own', index: 2, pattern: /^(am [a-z]+|heute [a-z]+|morgen( [a-z]+)?) (habe ich (zeit|frei)|[a-z]+ ich)( [a-z]+)*$/ } },
                { who: 'rami', question: 'Was mache ich? Rate mal!', answer: 'Du liest ein Buch!' },
                { who: 'mei', question: 'Am Samstag koche ich. Kommst du auch?', answer: 'Ja, ich komme gern! Das macht Spaß!' },
            ] },
        { id: 'ozet', title: (0, alltag_types_1.T)('Bitti'), kind: 'end', end: {
                can: [(0, alltag_types_1.T)('Bir röportajı anlamak ve soru sormak: *Was unterrichten Sie? Wann sind Ihre Kurse?*'), (0, alltag_types_1.T)('İş ve boş zamanı ayırmak: *beruflich · in der Freizeit*'), (0, alltag_types_1.T)('Düzenli ve düzensiz fiilleri ayırmak: *du kochst · du fährst*'), (0, alltag_types_1.T)('Bütün ünite: günün bölümleri, *gern*, Ja-/Nein-soruları, günler, davetler')],
                summary: (0, alltag_types_1.T)('**Lektion 5 bitti!** _Was machen Sie beruflich?_ · _in der Freizeit_ · _e → i, e → ie, a → ä, au → äu_ · _Rate mal! – Ja, richtig! / Nein, leider falsch._'),
            } },
    ],
};
