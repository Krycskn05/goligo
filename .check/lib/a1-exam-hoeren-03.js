"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Hören 3: a flat, languages, the way to work; announcements; messages on the phone. */
exports.exam = (0, a1_exam_build_1.buildHoeren)(3, 'Wohnung und Arbeit · Geburtstag · Durchsagen · Kino und Bibliothek', {
    teil1: {
        example: { q: 'In welchem Raum ist der Deutschkurs?', o: ['Raum 12', 'Raum 20', 'Raum 22'], a: 'c', lines: [
                ['Nikos', 'Entschuldigung, ist der Deutschkurs A1 in Raum 12?'],
                ['Frau:F1', 'Nein, in Raum 12 ist der Computerkurs. Der Deutschkurs ist heute in Raum 22, im zweiten Stock.']
            ] },
        items: [
            { q: 'Wie viele Zimmer hat die Wohnung?', o: ['Zwei', 'Drei', 'Vier'], a: 'b', lines: [
                    ['Sabine', 'Guten Tag, ist die Wohnung noch frei? Wie groß ist sie denn?'],
                    ['Vermieter:M2', 'Sie hat 80 Quadratmeter: drei Zimmer, eine Küche und ein Bad.'],
                    ['Sabine', 'Nur drei? In der Anzeige steht: vier Zimmer.'],
                    ['Vermieter:M2', 'Nein, nein, das ist ein Fehler. Es sind drei.']
                ],
                why: 'İlanda dört yazıyor ama bu bir hata: *Es sind drei* — üç oda.' },
            { q: 'Welche Sprache lernt Tomasz?', o: ['Spanisch', 'Türkisch', 'Englisch'], a: 'a', lines: [
                    ['Yasemin', 'Tomasz, du lernst jetzt auch Türkisch, oder?'],
                    ['Tomasz', 'Nein, das ist Agata – sie lernt Türkisch. Ich lerne Spanisch, zweimal pro Woche. Englisch kann ich schon.']
                ],
                why: 'Türkçe öğrenen Agata; Tomasz *Ich lerne Spanisch* diyor. İngilizceyi zaten biliyor.' },
            { q: 'Wie fährt Nora zur Arbeit?', o: [['🚗', 'Mit dem Auto'], ['🚲', 'Mit dem Fahrrad'], ['🚋', 'Mit der Straßenbahn']], a: 'c', lines: [
                    ['Rami', 'Nora, fährst du immer noch mit dem Auto ins Krankenhaus?'],
                    ['Nora', 'Nein, das Auto ist kaputt. Und mit dem Fahrrad ist es zu weit. Ich nehme jetzt die Straßenbahn – das geht gut.']
                ],
                why: 'Araba bozuk, bisikletle çok uzak: *Ich nehme jetzt die Straßenbahn*.' },
            { q: 'Wann hat Mei Geburtstag?', o: ['Im Mai', 'Im Juni', 'Im Juli'], a: 'c', lines: [
                    ['Sabine', 'Mei, du hast doch im Mai Geburtstag, oder? Wie dein Name!'],
                    ['Mei', 'Nein, das denken alle. Ich habe im Juli Geburtstag, am zwölften. Mein Bruder hat im Juni.']
                ],
                why: 'Mayıs yalnızca adına benziyor; *Ich habe im Juli Geburtstag*. Haziranda doğan kardeşi.' },
            { q: 'Wo ist die Post jetzt?', o: ['Im Bahnhof', 'In der Marktstraße', 'In der Bahnhofstraße'], a: 'a', lines: [
                    ['Aisha', 'Entschuldigung, ich suche die Post. Ist sie in der Marktstraße?'],
                    ['Mann:M3', 'Die Post in der Marktstraße gibt es nicht mehr. Jetzt ist die Post im Bahnhof, gleich am Eingang. Gehen Sie die Bahnhofstraße immer geradeaus, das sind nur fünf Minuten.']
                ],
                why: 'Marktstraße’deki postane kapanmış; *Jetzt ist die Post im Bahnhof*. Bahnhofstraße yalnızca oraya giden yol.' },
            { q: 'Wie buchstabiert man den Namen?', o: ['Franke', 'Frank', 'Franze'], a: 'b', cards: true, lines: [
                    ['Mann:M2', 'Für wen ist das Paket?'],
                    (0, a1_exam_build_1.spelled)('Frau:F5', 'Für Herrn Frank. Ich buchstabiere: {S}.', 'Frank'),
                    ['Mann:M2', 'Danke. Einen Moment, bitte.']
                ],
                why: 'Ad harf harf söyleniyor: *F – R – A – N – K*. Son harf K’dir; arkasından E gelmiyor.' },
        ]
    },
    teil2: {
        example: { t: 'Die Besucher sollen jetzt zum Ausgang gehen.', a: 'r', lines: [
                ['Sprecherin:F5', 'Liebe Besucher, unser Zoo schließt in dreißig Minuten. Bitte gehen Sie langsam zum Ausgang. Der Kiosk am Ausgang ist noch bis 19 Uhr geöffnet.']
            ] },
        items: [
            { t: 'Die Eltern der Klasse 3b treffen sich in Raum 104.', a: 'f', lines: [
                    ['Sprecherin:F2', 'Liebe Eltern, herzlich willkommen zum Elternabend. Die Eltern der Klasse 3b gehen bitte nicht in Raum 104, sondern in die Bibliothek im Erdgeschoss. Raum 104 ist heute besetzt.']
                ],
                why: '3b velileri *nicht in Raum 104, sondern in die Bibliothek im Erdgeschoss* gidiyor.' },
            { t: 'Auf dem Schiff darf man rauchen.', a: 'f', lines: [
                    ['Sprecher:M5', 'Willkommen an Bord! Unsere Fahrt dauert etwa zwei Stunden. Im Restaurant auf Deck 2 bekommen Sie Kaffee und Kuchen. Rauchen ist auf dem ganzen Schiff verboten.']
                ],
                why: '*Rauchen ist auf dem ganzen Schiff verboten*: gemide sigara yasak.' },
            { t: 'Das Spiel fängt später an.', a: 'r', lines: [
                    ['Sprecher:M4', 'Liebe Fußballfreunde, das Spiel beginnt heute nicht um 15 Uhr 30, sondern erst um 16 Uhr. Die Mannschaft aus Bremen steht noch im Stau.']
                ],
                why: 'Maç *nicht um 15 Uhr 30, sondern erst um 16 Uhr* başlıyor: yarım saat geç.' },
            { t: 'Die Koffer aus Istanbul kommen an Band 5.', a: 'r', lines: [
                    ['Sprecherin:F1', 'Liebe Fluggäste aus Istanbul: Ihr Gepäck kommt heute nicht an Band 3, sondern an Band 5. Wir bitten um Entschuldigung.']
                ],
                why: 'Bagajlar *nicht an Band 3, sondern an Band 5* geliyor.' },
        ]
    },
    teil3: { items: [
            { q: 'Wann läuft der Kinderfilm?', o: ['Um 20 Uhr', 'Um 17.30 Uhr', 'Um 15 Uhr'], a: 'c', lines: [
                    ['Kino:F5', 'Kino am Kanal, guten Tag. Unser Programm heute: Um 15 Uhr sehen Sie den Kinderfilm Der kleine Bär. Um 17 Uhr 30 und um 20 Uhr läuft die Komödie Sommer in Berlin. Karten bekommen Sie an der Kasse ab 14 Uhr.']
                ],
                why: 'Çocuk filmi *um 15 Uhr*; 17.30 ve 20’de komedi var, 14 ise gişenin açılış saati.' },
            { q: 'Bis wann kann Nora das Buch abholen?', o: ['Bis Freitag', 'Bis Samstag', 'Bis Montag'], a: 'b', lines: [
                    ['Bibliothek:M3', 'Guten Tag, Frau Weiß, hier ist die Stadtbibliothek. Ihr Buch ist jetzt da. Sie können es bis Samstag abholen. Am Montag geben wir es sonst weiter. Wir haben heute, am Freitag, bis 18 Uhr geöffnet.']
                ],
                why: 'Kitap *bis Samstag* bekliyor; pazartesi başkasına veriliyor. Cuma yalnızca bugünün günü.' },
            { q: 'Für wie viele Personen reserviert Herr Khalil?', o: ['Für vier', 'Für acht', 'Für sechs'], a: 'c', lines: [
                    ['Rami', 'Guten Tag, hier ist Khalil. Ich möchte für Samstagabend einen Tisch reservieren, um 19 Uhr. Wir sind vier Erwachsene und zwei Kinder, also sechs Personen. Bitte rufen Sie mich zurück. Danke!']
                ],
                why: 'Dört yetişkin ve iki çocuk: *also sechs Personen*.' },
            { q: 'Wann fliegt Frau Kamau nach Nairobi?', o: ['Am 3. August', 'Am 13. August', 'Am 30. August'], a: 'b', lines: [
                    ['Reisebüro:F2', 'Guten Tag, Frau Kamau, hier ist das Reisebüro Weltweit. Ihre Tickets nach Nairobi sind da. Sie fliegen am dreizehnten August um 21 Uhr 40. Der Flug am dritten August war leider schon voll. Bitte holen Sie die Tickets diese Woche ab.']
                ],
                why: 'Uçuş *am dreizehnten August* (13’ü); *am dritten August* (3’ü) doluydu.' },
            { q: 'Was soll Frau Krüger machen?', o: ['Zurückrufen', 'Am Dienstag kommen', 'Eine E-Mail schreiben'], a: 'a', lines: [
                    ['Friseurin:F3', 'Hallo Frau Krüger, hier ist der Salon Schnittpunkt. Ihr Termin am Dienstag um 16 Uhr geht leider nicht. Wir haben am Mittwoch und am Freitag noch Termine frei. Bitte rufen Sie uns an, dann finden wir eine Zeit.']
                ],
                why: 'Salı randevusu iptal; yeni saat için *Bitte rufen Sie uns an* — geri aramalı.' },
        ] },
});
