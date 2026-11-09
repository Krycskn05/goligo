"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Hören 2: in a café, on the way, at the doctor's; announcements; messages on the phone. */
exports.exam = (0, a1_exam_build_1.buildHoeren)(2, 'Im Café · Unterwegs in der Stadt · Durchsagen · Termine am Telefon', {
    teil1: {
        example: { q: 'Wie alt ist Aishas Tochter?', o: ['3 Jahre', '4 Jahre', '5 Jahre'], a: 'b', lines: [
                ['Mei', 'Aisha, wie alt ist deine Tochter jetzt? Drei?'],
                ['Aisha', 'Nein, Amani ist schon vier. Im Mai wird sie fünf.']
            ] },
        items: [
            { q: 'Was trinkt der Mann?', o: [['🍵', 'Einen Tee'], ['☕', 'Einen Kaffee'], ['🧃', 'Einen Saft']], a: 'a', lines: [
                    ['Mei', 'Guten Tag, was möchten Sie trinken? Einen Kaffee?'],
                    ['Gast:M3', 'Nein, danke, Kaffee trinke ich nur morgens. Haben Sie Orangensaft?'],
                    ['Mei', 'Leider nicht mehr. Aber wir haben Apfelsaft und Tee.'],
                    ['Gast:M3', 'Dann nehme ich einen Tee, bitte.']
                ],
                why: 'Kahve istemiyor, portakal suyu kalmamış; sonunda *Dann nehme ich einen Tee* diyor.' },
            { q: 'Welche Buslinie fährt zum Zoo?', o: ['Die Linie 14', 'Die Linie 40', 'Die Linie 44'], a: 'c', lines: [
                    ['Nikos', 'Entschuldigung, fährt die Linie 14 zum Zoo?'],
                    ['Frau:F4', 'Nein, die 14 fährt zum Bahnhof. Zum Zoo müssen Sie die 44 nehmen. Die fährt dort drüben ab.'],
                    ['Nikos', 'Die 44 – danke schön!']
                ],
                why: '14 numara gara gidiyor; hayvanat bahçesi için *die 44* (vierundvierzig). 14 ile 44 kulağa benzer gelir.' },
            { q: 'Wann hat Frau Arslan den Termin?', o: ['Am Montag', 'Am Mittwoch', 'Am Freitag'], a: 'b', lines: [
                    ['Yasemin', 'Guten Tag, ich brauche einen Termin bei Doktor Vogel. Geht es am Montag?'],
                    ['Arzthelferin:F1', 'Am Montag ist leider alles voll. Am Mittwoch um 10 Uhr ist noch ein Termin frei – oder am Freitag um 8.'],
                    ['Yasemin', 'Freitag um 8 ist zu früh für mich. Ich nehme den Mittwoch.']
                ],
                why: 'Pazartesi dolu, cuma sabah 8 ona erken: *Ich nehme den Mittwoch*.' },
            { q: 'Wo wohnt Nikos jetzt?', o: ['Im Erdgeschoss', 'Im zweiten Stock', 'Im vierten Stock'], a: 'b', lines: [
                    ['Rami', 'Nikos, wohnst du noch im vierten Stock, ohne Aufzug?'],
                    ['Nikos', 'Nein, zum Glück nicht mehr. Meine neue Wohnung ist im zweiten Stock. Und im Erdgeschoss gibt es eine Bäckerei!']
                ],
                why: 'Dördüncü kat eski evi; *Meine neue Wohnung ist im zweiten Stock*. Zemin katta fırın var.' },
            { q: 'Wie viel bezahlt der Mann?', o: ['2,99 Euro', '5 Euro', '2,50 Euro'], a: 'a', lines: [
                    ['Tomasz', 'Was kosten die Tomaten?'],
                    ['Verkäuferin:F5', 'Ein Kilo kostet 2 Euro 99. Aber nehmen Sie zwei Kilo, dann bezahlen Sie nur 5 Euro.'],
                    ['Tomasz', 'Zwei Kilo sind zu viel. Ein Kilo, bitte.'],
                    ['Verkäuferin:F5', 'Gern. 2 Euro 99, bitte.']
                ],
                why: 'İki kilo 5 Euro, ama o yalnızca bir kilo alıyor: *2 Euro 99*.' },
            { q: 'Was macht Sabine am Samstag?', o: ['Sie arbeitet', 'Sie geht schwimmen', 'Sie besucht ihre Schwester'], a: 'c', lines: [
                    ['Omar', 'Sabine, gehen wir am Samstag zusammen schwimmen?'],
                    ['Sabine', 'Am Samstag kann ich nicht, da besuche ich meine Schwester Katrin. Aber am Sonntag habe ich Zeit.'],
                    ['Omar', 'Am Sonntag muss ich im Kiosk arbeiten. Schade!']
                ],
                why: 'Cumartesi yüzmeye gidemiyor: *da besuche ich meine Schwester Katrin*. Çalışan Omar, o da pazar günü.' },
        ]
    },
    teil2: {
        example: { t: 'Alle Fahrgäste sollen in Hannover aussteigen.', a: 'r', lines: [
                ['Sprecher:M3', 'Sehr geehrte Fahrgäste, in wenigen Minuten sind wir in Hannover Hauptbahnhof. Der Zug endet dort. Bitte steigen Sie alle aus.']
            ] },
        items: [
            { t: 'Die U-Bahn fährt heute nicht bis zum Zoo.', a: 'r', lines: [
                    ['Sprecherin:F4', 'Liebe Fahrgäste, wegen Bauarbeiten fährt die U 2 heute nur bis Marktstraße. Bitte steigen Sie dort um: Der Bus 140 bringt Sie weiter zum Zoo.']
                ],
                why: 'Metro bugün *nur bis Marktstraße* gidiyor; hayvanat bahçesine oradan otobüs 140 götürüyor.' },
            { t: 'Der Supermarkt ist morgen geöffnet.', a: 'f', lines: [
                    ['Sprecher:M2', 'Liebe Kunden, an unserer Fleischtheke bekommen Sie heute ein Kilo Hähnchen für 4 Euro 99. Und nicht vergessen: Morgen, am Feiertag, bleibt unser Markt geschlossen.']
                ],
                why: 'Yarın bayram: *bleibt unser Markt geschlossen* — market kapalı.' },
            { t: 'Die Besucher treffen sich an der Kasse.', a: 'f', lines: [
                    ['Sprecherin:F5', 'Liebe Besucher, die Führung durch das Museum beginnt in fünf Minuten. Treffpunkt ist nicht an der Kasse, sondern im ersten Stock vor dem Café.']
                ],
                why: 'Buluşma yeri *nicht an der Kasse, sondern im ersten Stock vor dem Café*.' },
            { t: 'Morgen Nachmittag ist das Wetter schön.', a: 'r', lines: [
                    ['Sprecher:M4', 'Und nun das Wetter für morgen: Am Vormittag regnet es noch, aber am Nachmittag scheint die Sonne. Die Temperaturen liegen bei 18 Grad.']
                ],
                why: 'Sabah yağmurlu, ama *am Nachmittag scheint die Sonne*: öğleden sonra hava güzel.' },
        ]
    },
    teil3: { items: [
            { q: 'Wann ist der neue Termin beim Zahnarzt?', o: ['Am Dienstag um 9 Uhr', 'Am Donnerstag um 9 Uhr', 'Am Donnerstag um 14 Uhr'], a: 'c', lines: [
                    ['Praxis:F2', 'Guten Tag, Herr Nowak, hier ist die Zahnarztpraxis Doktor Klein. Ihr Termin am Dienstag um 9 Uhr geht leider nicht, der Doktor ist krank. Können Sie am Donnerstag kommen? Um 9 haben wir nichts frei, aber um 14 Uhr. Bitte rufen Sie uns zurück.']
                ],
                why: 'Salı günkü randevu iptal; perşembe saat 9 dolu, boş olan *um 14 Uhr*.' },
            { q: 'Warum kommt Rami später?', o: ['Der Bus hat Verspätung', 'Er muss noch arbeiten', 'Er ist krank'], a: 'a', lines: [
                    ['Rami', 'Hallo Hanan, ich bin’s. Ich stehe noch an der Haltestelle. Der Bus kommt heute nicht pünktlich, er hat zwanzig Minuten Verspätung. Fangt bitte schon mit dem Essen an! Bis gleich.']
                ],
                why: 'Durakta bekliyor: *Der Bus … hat zwanzig Minuten Verspätung*.' },
            { q: 'Was soll Can kaufen?', o: ['Brot', 'Eier', 'Milch'], a: 'c', lines: [
                    ['Yasemin', 'Hallo Can, ich bin noch im Kurs. Kannst du bitte einkaufen? Brot habe ich schon gekauft und Eier sind auch noch da. Aber wir haben keine Milch mehr. Danke dir!']
                ],
                why: 'Ekmek alınmış, yumurta var; eksik olan süt: *wir haben keine Milch mehr*.' },
            { q: 'Wo ist die Wohnung?', o: ['Gartenstraße 5', 'Gartenstraße 15', 'Gartenstraße 50'], a: 'b', lines: [
                    ['Vermieter:M3', 'Guten Tag, Frau Suwan, hier ist Krause. Sie möchten die Wohnung sehen? Das geht morgen um 17 Uhr. Die Adresse ist Gartenstraße 15 – nicht 50, da ist das Büro. Bitte klingeln Sie bei Krause.']
                ],
                why: 'Adres *Gartenstraße 15* (fünfzehn); 50 (fünfzig) numarada büro var.' },
            { q: 'Wann kann Herr Papadakis sein Fahrrad abholen?', o: ['Heute Abend', 'Morgen früh', 'Am Samstag'], a: 'b', lines: [
                    ['Werkstatt:M2', 'Guten Tag, Herr Papadakis, hier ist die Fahrradwerkstatt Rad und Tat. Ihr Fahrrad ist leider heute Abend noch nicht fertig, wir warten auf ein Teil. Sie können es morgen früh ab 8 Uhr abholen. Am Samstag haben wir geschlossen.']
                ],
                why: 'Bu akşam hazır değil, cumartesi kapalı: *Sie können es morgen früh ab 8 Uhr abholen*.' },
        ] },
});
