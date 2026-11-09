"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Hören 5: in a restaurant, at the hotel, plans with friends; announcements; messages on the phone. */
exports.exam = (0, a1_exam_build_1.buildHoeren)(5, 'Im Restaurant · Im Hotel · Durchsagen · Apotheke, Schule und Kochkurs', {
    teil1: {
        example: { q: 'Was bestellt der Mann?', o: ['Eine Suppe', 'Eine Pizza', 'Einen Salat'], a: 'b', lines: [
                ['Tomasz', 'Guten Abend! Was darf es sein?'],
                ['Gast:M4', 'Ist die Tomatensuppe gut?'],
                ['Tomasz', 'Sehr gut, aber heute haben wir keine mehr. Pizza und Salat gibt es noch.'],
                ['Gast:M4', 'Dann eine Pizza, bitte.']
            ] },
        items: [
            { q: 'Wie viel kostet das Essen?', o: ['6,50 Euro', '13,50 Euro', '20 Euro'], a: 'b', lines: [
                    ['Tomasz', 'So, ein Salat und ein Wasser: Das macht 13 Euro 50, bitte.'],
                    ['Gast:F4', 'Hier sind 20 Euro.'],
                    ['Tomasz', 'Danke schön. Und 6 Euro 50 zurück.']
                ],
                why: 'Yemek *13 Euro 50* tutuyor; 20 Euro verilen para, 6,50 Euro ise para üstü.' },
            { q: 'Für wann reserviert der Mann einen Tisch?', o: ['Für 18 Uhr', 'Für 19 Uhr', 'Für 20 Uhr'], a: 'c', lines: [
                    ['Gast:M2', 'Guten Tag, ich möchte für heute Abend einen Tisch reservieren, für 19 Uhr.'],
                    ['Mei', 'Um 19 Uhr ist leider alles voll. Um 18 Uhr oder um 20 Uhr geht es.'],
                    ['Gast:M2', '18 Uhr ist zu früh, da arbeite ich noch. Dann um 20 Uhr, bitte.']
                ],
                why: '19’da yer yok, 18 ona erken: *Dann um 20 Uhr, bitte*.' },
            { q: 'Wer holt heute die Kinder ab?', o: ['Der Vater', 'Die Mutter', 'Die Oma'], a: 'a', lines: [
                    ['Tomasz', 'Agata, holst du heute die Kinder vom Kindergarten ab?'],
                    ['Agata:F2', 'Ich kann nicht, ich arbeite bis sechs. Und meine Mutter ist doch in Krakau.'],
                    ['Tomasz', 'Stimmt. Gut, dann hole ich sie ab.']
                ],
                why: 'Anne altıya kadar çalışıyor, anneanne Krakau’da; baba *dann hole ich sie ab* diyor.' },
            { q: 'Was sucht der Mann?', o: ['Zucker', 'Salz', 'Mehl'], a: 'c', lines: [
                    ['Nikos', 'Entschuldigung, wo finde ich Mehl?'],
                    ['Verkäuferin:F3', 'Mehl? Gleich hier links, neben dem Zucker.'],
                    ['Nikos', 'Ah, danke. Und Salz brauche ich nicht, das habe ich noch.']
                ],
                why: 'Sorduğu şey *Mehl* (un); şeker yalnızca yanındaki raf, tuza ihtiyacı yok.' },
            { q: 'Welche Zimmernummer hat Herr Nasser?', o: ['113', '130', '133'], a: 'b', lines: [
                    ['Rezeption:F4', 'Guten Abend, Herr Nasser. Sie haben Zimmer 130, im ersten Stock.'],
                    ['Omar', 'Entschuldigung, 113?'],
                    ['Rezeption:F4', 'Nein, 130 – eins, drei, null. Hier ist Ihr Schlüssel.']
                ],
                why: 'Oda *130 – eins, drei, null*; Omar’ın yanlış duyduğu 113.' },
            { q: 'Was machen die Freunde am Sonntag?', o: [['🎬', 'Sie gehen ins Kino'], ['⚽', 'Sie spielen Fußball'], ['🚲', 'Sie fahren Fahrrad']], a: 'a', lines: [
                    ['Rami', 'Omar, spielen wir am Sonntag wieder Fußball?'],
                    ['Omar', 'Am Sonntag regnet es. Gehen wir lieber ins Kino?'],
                    ['Rami', 'Gute Idee! Fahrrad fahren können wir nächste Woche.']
                ],
                why: 'Pazar yağmurlu, futbol olmuyor: *Gehen wir lieber ins Kino?* — *Gute Idee!* Bisiklet gelecek hafta.' },
        ]
    },
    teil2: {
        example: { t: 'Das Café ist im dritten Stock.', a: 'r', lines: [
                ['Sprecherin:F1', 'Liebe Kunden, besuchen Sie unser Café im dritten Stock! Heute gibt es dort ein Stück Kuchen und eine Tasse Kaffee für nur 3 Euro.']
            ] },
        items: [
            { t: 'Im Zug kann man heute etwas zu essen kaufen.', a: 'f', lines: [
                    ['Sprecher:M3', 'Information zum ICE nach Hamburg: Der Zug fährt heute ohne Restaurant. Bitte kaufen Sie Essen und Getränke hier im Bahnhof.']
                ],
                why: 'Tren bugün *ohne Restaurant*: yiyecek garda alınmalı.' },
            { t: 'Die Gäste sollen ihre Handys ausmachen.', a: 'r', lines: [
                    ['Sprecherin:F5', 'Liebe Gäste, der Film in Kino 2 beginnt in fünf Minuten. Bitte gehen Sie jetzt zu Ihren Plätzen und machen Sie Ihre Handys aus.']
                ],
                why: '*Machen Sie Ihre Handys aus*: telefonlar kapatılmalı.' },
            { t: 'Das Flugzeug nach Wien fliegt pünktlich.', a: 'f', lines: [
                    ['Sprecherin:F2', 'Achtung, eine Information für alle Fluggäste nach Wien: Ihr Flug hat eine Stunde Verspätung. Der neue Abflug ist um 15 Uhr 20 von Ausgang A 4.']
                ],
                why: 'Uçuş *eine Stunde Verspätung* ile kalkıyor: dakik değil.' },
            { t: 'Kasse 3 ist jetzt geöffnet.', a: 'r', lines: [
                    ['Sprecher:M5', 'Liebe Kunden, bitte kommen Sie jetzt auch zur Kasse 3. Wir öffnen eine neue Kasse für Sie.']
                ],
                why: '*Wir öffnen eine neue Kasse*: 3 numaralı kasa şimdi açılıyor.' },
        ]
    },
    teil3: { items: [
            { q: 'Wann kann Frau Arslan das Medikament abholen?', o: ['Morgen ab 8 Uhr', 'Heute ab 16 Uhr', 'Morgen ab 16 Uhr'], a: 'a', lines: [
                    ['Apotheker:M4', 'Guten Tag, Frau Arslan, hier ist die Rosen-Apotheke. Ihr Medikament ist heute leider noch nicht da. Es kommt morgen früh. Sie können es morgen ab 8 Uhr abholen. Wir haben bis 18 Uhr 30 geöffnet.']
                ],
                why: 'İlaç bugün gelmedi; *Sie können es morgen ab 8 Uhr abholen*.' },
            { q: 'Wo feiert Mei ihren Geburtstag?', o: ['Im Volkspark', 'Im Restaurant', 'Zu Hause'], a: 'a', lines: [
                    ['Mei', 'Hallo Nora, hier ist Mei. Am Freitag feiere ich Geburtstag – aber nicht im Restaurant, da arbeite ich ja jeden Tag! Meine Wohnung ist zu klein, also feiern wir im Volkspark, am See. Um 17 Uhr geht es los. Kommst du?']
                ],
                why: 'Restoran olmaz, evi küçük: *also feiern wir im Volkspark, am See*.' },
            { q: 'Was braucht Lina morgen?', o: ['Sportschuhe', 'Ihren Bibliotheksausweis', 'Ein Buch'], a: 'b', lines: [
                    ['Lehrerin:F2', 'Guten Tag, Herr Khalil, hier ist Brandt, die Lehrerin von Lina. Morgen haben wir keinen Sport, die Halle ist geschlossen. Wir gehen in die Bibliothek. Lina braucht also keine Sportschuhe, aber bitte ihren Bibliotheksausweis. Danke!']
                ],
                why: 'Yarın spor yok, kütüphaneye gidiliyor: spor ayakkabısı değil, *ihren Bibliotheksausweis* gerekiyor.' },
            { q: 'Was kostet das Zimmer mit Frühstück?', o: ['65 Euro', '75 Euro', '85 Euro'], a: 'c', lines: [
                    ['Hotel:F1', 'Guten Tag, Herr Papadakis, hier ist das Hotel am Hafen. Für das Wochenende haben wir noch ein Einzelzimmer: 75 Euro pro Nacht, mit Frühstück 85 Euro. Bitte rufen Sie bis heute Abend zurück.']
                ],
                why: 'Oda 75 Euro, *mit Frühstück 85 Euro*.' },
            { q: 'Wann ist der Kochkurs diese Woche?', o: ['Am Dienstag', 'Am Mittwoch', 'Am Donnerstag'], a: 'c', lines: [
                    ['Mei', 'Hallo, hier ist Mei Suwan vom Thai-Kochkurs. Eine Information für alle: Am Dienstag ist diese Woche kein Kurs, ich muss im Restaurant arbeiten. Am Mittwoch geht es auch nicht. Wir kochen am Donnerstag um 18 Uhr. Bis dann!']
                ],
                why: 'Salı kurs yok, çarşamba da olmuyor: *Wir kochen am Donnerstag um 18 Uhr*.' },
        ] },
});
