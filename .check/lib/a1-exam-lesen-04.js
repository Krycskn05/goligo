"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Lesen 4: Yasemin's note at home, Zofia's birthday in the garden, web pages, notices. */
exports.exam = (0, a1_exam_build_1.buildExam)(4, 'Zettel zu Hause · Geburtstag im Garten · Internetseiten · Schilder', {
    teil1: [
        { kind: 'note',
            lines: ['Lieber Can,', 'ich bin bis 13 Uhr im Deutschkurs und gehe dann noch mit Aisha einkaufen. Das Mittagessen steht im Kühlschrank – du musst es nur warm machen.', 'Kannst du bitte die Wäsche aus der Maschine holen? Sie ist um elf fertig. Heute Abend kommen Elif und Mert zum Essen, ich koche. Wir brauchen noch Brot, das kaufe ich.', 'Bis später!', 'Yasemin'],
            example: ['Yasemin ist am Vormittag nicht zu Hause.', 'r'],
            items: [
                ['Can muss heute Mittag kochen.', 'f', 'Yemek hazır, buzdolabında: *du musst es nur warm machen* (yalnızca ısıtacak).'],
                ['Yasemin kauft heute noch Brot.', 'r', '*Wir brauchen noch Brot, das kaufe ich*: ekmeği Yasemin alıyor.'],
            ] },
        { kind: 'mail', from: 'Tomasz Nowak', to: 'Freunde', subject: 'Zofia wird vier!',
            lines: ['Liebe Freunde,', 'am Samstag, dem 5. Juli, wird unsere Zofia vier Jahre alt! Wir feiern ab 15 Uhr im Garten hinter unserem Haus. Fleisch und Getränke kaufen wir. Könnt ihr bitte einen Salat oder einen Kuchen mitbringen?', 'Bei Regen feiern wir in der Wohnung, das ist kein Problem. Bitte schreibt uns bis Mittwoch: Wie viele Personen kommen?', 'Herzliche Grüße', 'Tomasz und Agata'],
            items: [
                ['Die Gäste sollen etwas zu essen mitbringen.', 'r', '*Könnt ihr bitte einen Salat oder einen Kuchen mitbringen?*: misafirlerden yiyecek isteniyor.'],
                ['Bei schlechtem Wetter gibt es kein Fest.', 'f', '*Bei Regen feiern wir in der Wohnung*: yağmurda kutlama evde yapılıyor.'],
                ['Tomasz und Agata möchten wissen, wie viele Gäste kommen.', 'r', '*Bitte schreibt uns bis Mittwoch: Wie viele Personen kommen?* Yani kaç kişinin geleceğini öğrenmek istiyorlar.'],
            ] },
    ],
    teil2: { mode: 'web',
        example: ['Sie möchten wissen: Wann fährt morgen früh ein Zug nach Leipzig?',
            ['solid', ['Fahrplan · Tickets · Verspätungen', 'Alle Züge in Deutschland'], 'www.zugzeiten-online.de'],
            ['solid', ['Leipzig für Touristen:', 'Hotels, Museen, Restaurants'], 'www.leipzig-erleben.de'], 'a'],
        items: [
            ['Sie möchten ein gebrauchtes Handy kaufen.',
                ['solid', ['**Handy-Doktor**', 'Ihr Handy ist kaputt?', 'Wir reparieren alle Handys in einer Stunde.'], 'www.handy-doktor-berlin.de'],
                ['solid', ['**Zweite Hand**', 'Gebraucht kaufen und verkaufen:', 'Handys, Computer, Fernseher'], 'www.zweite-hand-markt.de'],
                'b', '*Gebraucht kaufen* = ikinci el almak. Öbür sayfa telefon tamir ediyor, satmıyor.'],
            ['Sie suchen ein Hotel in Hamburg. Ihr Hund kommt mit.',
                ['solid', ['**Pension Elbe**', 'Kleine Pension, 10 Minuten zum Hafen.', 'Hunde willkommen (€ 5 pro Nacht).'], 'www.pension-elbe-hamburg.de'],
                ['solid', ['**Hotel Hafenblick**', 'Zimmer mit Blick auf den Hafen, Frühstück inklusive.', 'Haustiere leider nicht erlaubt.'], 'www.hotel-hafenblick-hh.de'],
                'a', '*Hunde willkommen*: köpek kabul ediliyor. Öbür otelde *Haustiere leider nicht erlaubt*.'],
            ['Sie möchten wissen: Wie lange hat das Bürgeramt heute geöffnet?',
                ['solid', ['**Ämter in Ihrer Stadt**', 'Adressen, Öffnungszeiten, Formulare'], 'www.stadt-service.de/aemter'],
                ['solid', ['**Freizeit in Ihrer Stadt**', 'Parks, Schwimmbäder, Kinos:', 'Tipps und Öffnungszeiten'], 'www.stadt-service.de/freizeit'],
                'a', '*Bürgeramt* bir resmî dairedir (*Amt*): açılış saatleri *Ämter* sayfasında.'],
            ['Sie möchten Ihrer Freundin Blumen nach Hause schicken.',
                ['solid', ['**Blumen-Express**', 'Wir bringen Blumen in 2 Stunden:', 'bestellen, bezahlen, fertig!'], 'www.blumen-express-24.de'],
                ['solid', ['**Gartenfreunde**', 'Alles für Ihren Garten: Blumen und Bäume.', 'Nur im Geschäft, wir schicken nichts.'], 'www.gartenfreunde-markt.de'],
                'a', 'Eve çiçek gönderen sayfa: *Wir bringen Blumen*. Öbüründe *wir schicken nichts*: göndermiyorlar.'],
            ['Sie möchten in einer Gruppe Volleyball spielen.',
                ['solid', ['**Sport live**', 'Fußball, Volleyball, Tennis:', 'alle Spiele live sehen'], 'www.sport-live-sehen.de'],
                ['solid', ['**TSV Kanal**', 'Volleyball für Erwachsene, dienstags 19 Uhr.', 'Neue Spieler willkommen!'], 'www.tsv-kanal.de'],
                'b', 'Oynamak için spor kulübü: *Neue Spieler willkommen*. Öbür sayfada maçlar yalnızca izleniyor (*sehen*).'],
        ] },
    teil3: {
        example: ['An einem **Kiosk**.', ['dashed', ['Bin gleich zurück!', 'In 10 Minuten bin ich wieder da.', 'Omar'], undefined, 'serif'], 'Der Kiosk ist heute den ganzen Tag geschlossen.', 'f'],
        items: [
            ['In einer **Schule**.', ['solid', ['Elternabend der Klasse 2a:', 'Donnerstag, 19 Uhr, Raum 104.', 'Bitte ohne Kinder kommen.']],
                'Die Eltern sollen ihre Kinder mitbringen.', 'f', '*Bitte ohne Kinder kommen*: veliler çocuksuz gelecek.'],
            ['Am Eingang eines **Cafés**.', ['round', ['Bei uns können Sie nur bar bezahlen.', 'Ein Geldautomat ist gleich gegenüber.']],
                'Im Café kann man nicht mit Karte bezahlen.', 'r', '*Nur bar bezahlen* = yalnızca nakit; kart geçmiyor.'],
            ['Im **Waschkeller**.', ['bold', ['Montag bis Samstag 7–20 Uhr.', 'Sonntags bitte nicht waschen!'], 'Waschzeiten'],
                'Am Samstagabend um 21 Uhr können Sie hier waschen.', 'f', 'Cumartesi günü de yalnızca 20’ye kadar; saat 21 geç.'],
            ['An einem **Spielplatz**.', ['shaded', ['Spielplatz für Kinder bis 12 Jahre.', 'Hunde müssen draußen bleiben.']],
                'Ihre Tochter ist 9. Sie darf hier spielen.', 'r', '*Für Kinder bis 12 Jahre*: dokuz yaşındaki çocuk oynayabilir.'],
            ['In einer **U-Bahn-Station**.', ['double', ['Die Linie U2 fährt am Wochenende nicht.', 'Bitte nehmen Sie den Bus 140.', 'Er fährt alle 10 Minuten.']],
                'Am Samstag fahren Sie hier mit der U2.', 'f', 'Hafta sonu U2 çalışmıyor; yerine *Bus 140* var.'],
        ]
    },
});
