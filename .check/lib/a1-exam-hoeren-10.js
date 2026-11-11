"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Hören 10: a room to rent, school, a used car, a party; announcements; messages on the phone. */
exports.exam = (0, a1_exam_build_1.buildHoeren)(10, 'Zimmer und Auto · Schule · Durchsagen · Geburtstag, Arbeit, Bahnhof', {
    teil1: {
        example: { q: 'Welches Eis nimmt die Frau?', o: [['🍫', 'Schokolade'], ['🍦', 'Vanille'], ['🍓', 'Erdbeere']], a: 'b', lines: [
                ['Mei', 'Ein Eis, bitte. Haben Sie Erdbeere?'],
                ['Verkäufer:M2', 'Erdbeere ist leider aus. Es gibt noch Vanille und Schokolade.'],
                ['Mei', 'Dann Vanille, bitte.']
            ] },
        items: [
            { q: 'Wie viel kostet das Zimmer mit Strom und Heizung?', o: ['350 Euro', '380 Euro', '530 Euro'], a: 'b', lines: [
                    ['Nikos', 'Was kostet das Zimmer im Monat? 350 Euro?'],
                    ['Vermieterin:F4', '350 kostet es ohne Strom und Heizung. Mit allem sind es 380 Euro im Monat.']
                ],
                why: '350 Euro elektrik ve ısınma hariç; *Mit allem sind es 380 Euro*.' },
            { q: 'Wann ist der Elternabend?', o: ['Am Dienstag', 'Am Mittwoch', 'Am Donnerstag'], a: 'c', lines: [
                    ['Hanan:F2', 'Rami, der Elternabend ist am Dienstag, oder?'],
                    ['Rami', 'Nein, am Dienstag ist das Schulfest. Der Elternabend ist am Donnerstag um 19 Uhr. Am Mittwoch habe ich Zeit zum Einkaufen.']
                ],
                why: 'Salı günü okul şenliği var; *Der Elternabend ist am Donnerstag*.' },
            { q: 'Wie alt ist das Auto?', o: ['Drei Jahre', 'Acht Jahre', 'Dreizehn Jahre'], a: 'b', lines: [
                    ['Tomasz', 'Wie alt ist das Auto? Drei Jahre?'],
                    ['Verkäufer:M3', 'Nein, die Reifen sind drei Jahre alt. Das Auto ist acht Jahre alt, aber es fährt sehr gut.']
                ],
                why: 'Üç yaşında olan lastikler; *Das Auto ist acht Jahre alt*.' },
            { q: 'Wann arbeitet Nora diese Woche?', o: ['Von 6 bis 14 Uhr', 'Von 14 bis 22 Uhr', 'In der Nacht'], a: 'a', lines: [
                    ['Sabine', 'Nora, hast du diese Woche wieder Nachtdienst?'],
                    ['Nora', 'Nein, zum Glück nicht. Diese Woche arbeite ich von 6 bis 14 Uhr. Am Nachmittag habe ich frei!']
                ],
                why: 'Gece nöbeti yok: *Diese Woche arbeite ich von 6 bis 14 Uhr*; öğleden sonra boş.' },
            { q: 'Was bringt Tomasz zur Party mit?', o: ['Musik', 'Getränke', 'Stühle'], a: 'c', lines: [
                    ['Sabine', 'Tomasz, kannst du am Samstag Getränke mitbringen?'],
                    ['Tomasz', 'Getränke bringt doch schon Nikos mit. Ich habe aber sechs Stühle im Keller – brauchst du die?'],
                    ['Sabine', 'Ja, super! Musik haben wir schon.']
                ],
                why: 'İçecekleri Nikos getiriyor, müzik hazır; Tomasz *sechs Stühle* getiriyor.' },
            { q: 'Wie buchstabiert man den Namen?', o: ['Kaya', 'Kaja', 'Gaya'], a: 'a', cards: true, lines: [
                    ['Mann:M3', 'Wie heißt Ihr Mann, bitte?'],
                    ['Frau:F2', 'Er heißt Emre Kaya.'],
                    ['Mann:M3', 'Wie schreibt man den Familiennamen?'],
                    (0, a1_exam_build_1.spelled)('Frau:F2', 'Ich buchstabiere: {S}.', 'Kaya')
                ],
                why: 'Ad harf harf söyleniyor: *K – A – Y – A*. İlk harf K’dir (G değil), üçüncü harf Y’dir („Ypsilon“; J değil).' },
        ]
    },
    teil2: {
        example: { t: 'Der Bus fährt heute bis zum Zoo.', a: 'f', lines: [
                ['Sprecher:M5', 'Nächste Haltestelle: Rathaus. Dieser Bus fährt heute nicht weiter zum Zoo. Bitte steigen Sie am Rathaus alle aus.']
            ] },
        items: [
            { t: 'Fahrräder sind die ganze Woche billiger.', a: 'f', lines: [
                    ['Sprecherin:F3', 'Liebe Kunden, nur heute: Alle Fahrräder sind 100 Euro billiger! Unsere Mitarbeiter im Erdgeschoss helfen Ihnen gern.']
                ],
                why: 'İndirim *nur heute*: yalnızca bugün, bütün hafta değil.' },
            { t: 'In Wagen 9 gibt es keine freien Plätze.', a: 'f', lines: [
                    ['Sprecher:M3', 'Liebe Fahrgäste, dieser Zug hat heute keinen Wagen 7. Fahrgäste mit Plätzen in Wagen 7 gehen bitte in Wagen 9. Dort sind Plätze für Sie frei.']
                ],
                why: '7 numaralı vagon yok; 9 numarada *sind Plätze für Sie frei*.' },
            { t: 'Frau Krüger soll in Zimmer 2 gehen.', a: 'f', lines: [
                    ['Arzthelferin:F1', 'Herr Khalil, bitte in Zimmer 2. Frau Krüger, bitte gehen Sie noch einmal zur Anmeldung.']
                ],
                why: '2 numaralı odaya Herr Khalil çağrılıyor; Frau Krüger *zur Anmeldung* gidecek.' },
            { t: 'Getränke dürfen nicht mit in den Saal.', a: 'r', lines: [
                    ['Sprecherin:F5', 'Liebe Gäste, das Konzert beginnt in zehn Minuten. Getränke dürfen Sie leider nicht mit in den Saal nehmen. Bitte trinken Sie draußen aus.']
                ],
                why: '*Getränke dürfen Sie leider nicht mit in den Saal nehmen*: içecekle salona girilmiyor.' },
        ]
    },
    teil3: { items: [
            { q: 'Was soll Ben zum Geburtstag mitbringen?', o: ['Sportsachen', 'Ein Geschenk', 'Etwas zu essen'], a: 'a', lines: [
                    ['Hanan:F2', 'Hallo Frau Sommer, hier ist Hanan Khalil. Sami feiert am Samstag Geburtstag, im Sportpark. Ihr Sohn Ben ist herzlich eingeladen! Ein Geschenk braucht er nicht, und Essen gibt es genug. Aber bitte geben Sie ihm Sportsachen mit: Die Kinder spielen Fußball.']
                ],
                why: 'Hediyeye gerek yok, yemek de var; istenen: *geben Sie ihm Sportsachen mit*.' },
            { q: 'Wohin geht der Kurs am Samstag?', o: ['An den See', 'Ins Kino', 'In den Zoo'], a: 'b', lines: [
                    ['Paul', 'Hallo, hier ist Paul mit einer Nachricht für den Kurs. Am Samstag regnet es leider. Wir fahren also nicht an den See. Wir gehen zusammen ins Kino am Kanal. Treffpunkt ist um 15 Uhr am Eingang.']
                ],
                why: 'Yağmur yüzünden göl iptal: *Wir gehen zusammen ins Kino am Kanal*.' },
            { q: 'Bis wann arbeitet Tomasz am Samstag?', o: ['Bis 15 Uhr', 'Bis 20 Uhr', 'Bis 23 Uhr'], a: 'c', lines: [
                    ['Carla:F4', 'Hallo Tomasz, hier ist Carla. Am Samstag haben wir eine Hochzeit im Restaurant, mit 80 Gästen. Kannst du länger bleiben? Nicht bis 20 Uhr wie immer, sondern bis 23 Uhr. Am Sonntag hast du dann frei.']
                ],
                why: 'Her zamanki gibi 20’ye kadar değil: *sondern bis 23 Uhr*.' },
            { q: 'Von welchem Gleis fährt Aishas Zug?', o: ['Von Gleis 12', 'Von Gleis 2', 'Von Gleis 20'], a: 'a', lines: [
                    ['Aisha', 'Hallo David, ich bin am Bahnhof. Mein Zug fährt nicht von Gleis 2, wie auf der Fahrkarte steht. Er fährt heute von Gleis 12. Ich bin um 20 Uhr in Hamburg. Holst du mich ab?']
                ],
                why: 'Bilette 2 yazıyor, ama tren bugün *von Gleis 12* (zwölf) kalkıyor; 20 ise varış saati.' },
            { q: 'Was soll Frau Arslan mitbringen?', o: ['Ein Rezept', 'Ihren Pass', 'Die alte Brille'], a: 'c', lines: [
                    ['Optiker:M4', 'Guten Tag, Frau Arslan, hier ist Optik Blick. Ihre neue Brille ist fertig. Sie können sie heute bis 18 Uhr 30 abholen. Bitte bringen Sie die alte Brille mit.']
                ],
                why: 'Yeni gözlük hazır; *Bitte bringen Sie die alte Brille mit*.' },
        ] },
});
