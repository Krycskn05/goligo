"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Hören 9: entrance fees, the last bus, parcels and visits; announcements; messages on the phone. */
exports.exam = (0, a1_exam_build_1.buildHoeren)(9, 'Eintritt und Bus · Besuch und Pakete · Durchsagen · Einladung, Umzug, Kurs', {
    teil1: {
        example: { q: 'Wie kommt der Mann nach Hause?', o: ['Mit dem Taxi', 'Mit dem Bus', 'Zu Fuß'], a: 'c', lines: [
                ['Omar', 'Der letzte Bus ist schon weg. Und ein Taxi ist mir zu teuer.'],
                ['Nikos', 'Wohnst du weit von hier?'],
                ['Omar', 'Nein, nur 15 Minuten. Ich gehe zu Fuß.']
            ] },
        items: [
            { q: 'Was kostet der Eintritt für das Kind?', o: ['Nichts', '3 Euro', '6 Euro'], a: 'a', lines: [
                    ['Rami', 'Zwei Karten, bitte: ein Erwachsener und ein Kind.'],
                    ['Kassiererin:F5', 'Wie alt ist das Kind?'],
                    ['Rami', 'Fünf.'],
                    ['Kassiererin:F5', 'Kinder unter sechs Jahren bezahlen bei uns nichts. Erwachsene 6 Euro. Also 6 Euro, bitte.']
                ],
                why: 'Çocuk beş yaşında: *Kinder unter sechs Jahren bezahlen bei uns nichts*. 6 Euro yetişkin bileti.' },
            { q: 'Wann fährt heute der letzte Bus?', o: ['Um 22.15 Uhr', 'Um 23.15 Uhr', 'Um 0.15 Uhr'], a: 'b', lines: [
                    ['Sabine', 'Entschuldigung, wann fährt heute der letzte Bus in die Stadt?'],
                    ['Busfahrer:M5', 'Von Montag bis Freitag um 22 Uhr 15. Aber heute ist Samstag, da fährt der letzte erst um 23 Uhr 15.']
                ],
                why: 'Hafta içi 22.15; bugün cumartesi: *da fährt der letzte erst um 23 Uhr 15*.' },
            { q: 'Was ist in dem Paket?', o: [['📚', 'Bücher'], ['👗', 'Ein Kleid'], ['👢', 'Schuhe']], a: 'c', lines: [
                    ['Mei', 'Sabine, du hast ein Paket bekommen! Wieder Bücher?'],
                    ['Sabine', 'Nein, diesmal sind es Schuhe für den Winter. Das Kleid für die Hochzeit kommt erst nächste Woche.']
                ],
                why: 'Bu sefer kitap değil: *diesmal sind es Schuhe*. Elbise gelecek hafta geliyor.' },
            { q: 'Wie lange bleibt Aishas Mutter in Hamburg?', o: ['Eine Woche', 'Zwei Wochen', 'Einen Monat'], a: 'b', lines: [
                    ['Nora', 'Aisha, deine Mutter kommt aus Nairobi! Wie lange bleibt sie? Einen Monat?'],
                    ['Aisha', 'Nein, leider nur zwei Wochen. Dann fliegt sie noch für eine Woche nach London.']
                ],
                why: 'Hamburg’da *nur zwei Wochen* kalıyor; bir hafta, sonraki Londra yolculuğu.' },
            { q: 'Was macht Yasemin am Nachmittag?', o: ['Sie geht zum Friseur', 'Sie lernt Deutsch', 'Sie kocht'], a: 'a', lines: [
                    ['Mei', 'Yasemin, kommst du am Nachmittag mit in die Stadt?'],
                    ['Yasemin', 'Heute nicht. Um drei habe ich einen Termin beim Friseur. Deutsch lerne ich am Abend, und kochen muss ich heute nicht: Can kocht.']
                ],
                why: 'Saat üçte *einen Termin beim Friseur* var; Almancayı akşam çalışıyor, yemeği Can yapıyor.' },
            { q: 'In welchem Stock ist das Büro von Frau Krüger?', o: ['Im ersten Stock', 'Im zweiten Stock', 'Im fünften Stock'], a: 'c', lines: [
                    ['Tomasz', 'Entschuldigung, ich suche Frau Krüger. Ist ihr Büro im ersten Stock?'],
                    ['Mann:M3', 'Nein, dort ist die Kantine. Im zweiten Stock ist die Information. Frau Krüger sitzt im fünften Stock, Zimmer 512. Der Aufzug ist dort drüben.']
                ],
                why: 'Birinci katta kantin, ikinci katta danışma var; *Frau Krüger sitzt im fünften Stock*.' },
        ]
    },
    teil2: {
        example: { t: 'Auf der Autobahn kann man heute schnell fahren.', a: 'f', lines: [
                ['Sprecher:M4', 'Hier ist Radio Berlin mit dem Verkehr: Auf der Autobahn nach Hamburg gibt es zehn Kilometer Stau. Fahren Sie bitte langsam!']
            ] },
        items: [
            { t: 'Leere Flaschen kann man heute an der Information abgeben.', a: 'r', lines: [
                    ['Sprecherin:F3', 'Liebe Kunden, unser Automat für leere Flaschen ist heute kaputt. Bitte geben Sie Ihre Flaschen an der Information ab.']
                ],
                why: 'Otomat bozuk: *Bitte geben Sie Ihre Flaschen an der Information ab*.' },
            { t: 'Der Zug nach Dresden fährt gleich ab.', a: 'r', lines: [
                    ['Sprecher:M2', 'Am Gleis 5 steht der Zug nach Dresden. Der Zug fährt in zwei Minuten ab. Bitte einsteigen und die Türen schließen!']
                ],
                why: 'Tren *in zwei Minuten* kalkıyor: yani hemen (*gleich*).' },
            { t: 'Die Schüler können heute früher nach Hause gehen.', a: 'r', lines: [
                    ['Sprecherin:F2', 'Achtung, eine Durchsage für alle Schüler: Heute ist es sehr heiß. Der Unterricht endet heute schon um 12 Uhr. Die Busse fahren um 12 Uhr 15.']
                ],
                why: 'Hava çok sıcak: dersler *schon um 12 Uhr* bitiyor, öğrenciler erken çıkıyor.' },
            { t: 'Die Kinder müssen den Kakao bezahlen.', a: 'f', lines: [
                    ['Sprecher:M5', 'Liebe Besucher vom Weihnachtsmarkt: Um 17 Uhr singt der Kinderchor am großen Baum. Danach gibt es für alle Kinder heißen Kakao – kostenlos.']
                ],
                why: 'Kakao çocuklara *kostenlos*: ücretsiz.' },
        ]
    },
    teil3: { items: [
            { q: 'Bis wann ist das Fundbüro heute geöffnet?', o: ['Bis 16 Uhr', 'Bis 18 Uhr', 'Bis 20 Uhr'], a: 'a', lines: [
                    ['Fundbüro:F4', 'Guten Tag, Herr Nowak, hier ist das Fundbüro am Hauptbahnhof. Wir haben Ihre Tasche gefunden! Sie können sie bei uns abholen. Heute haben wir bis 16 Uhr geöffnet, morgen bis 18 Uhr. Bitte bringen Sie Ihren Ausweis mit.']
                ],
                why: '*Heute … bis 16 Uhr*; 18’e kadar açık olan yarın.' },
            { q: 'Wann ist das Essen bei Yasemin?', o: ['Am Freitag', 'Am Samstag', 'Am Sonntag'], a: 'c', lines: [
                    ['Yasemin', 'Hallo Sabine, hier ist Yasemin. Can und ich möchten euch zum Essen einladen. Am Freitag habe ich Kurs und am Samstag arbeitet Can. Habt ihr am Sonntag Zeit, so um 13 Uhr? Bring Jonas mit!']
                ],
                why: 'Cuma kursu var, cumartesi Can çalışıyor; davet *am Sonntag … um 13 Uhr*.' },
            { q: 'Was braucht Sabine noch?', o: ['Kartons', 'Einen Transporter', 'Werkzeug'], a: 'c', lines: [
                    ['Sabine', 'Hallo Nikos, Sabine hier. Am Samstag ist mein Umzug. Kartons habe ich genug, und Jonas holt den Transporter. Aber hast du vielleicht Werkzeug? Ich muss noch die Lampen abmachen. Ruf mich an!']
                ],
                why: 'Koliler yeterli, aracı Jonas getiriyor; eksik olan: *hast du vielleicht Werkzeug?* (alet).' },
            { q: 'Wann soll Herr Nasser in die Praxis kommen?', o: ['Heute', 'Morgen', 'Nächste Woche'], a: 'b', lines: [
                    ['Praxis:F2', 'Guten Tag, Herr Nasser, hier ist die Praxis Doktor Yıldız. Heute haben wir leider keinen Termin mehr für Sie. Kommen Sie bitte morgen um 8 Uhr 30. Nächste Woche ist die Praxis geschlossen.']
                ],
                why: 'Bugün randevu yok, gelecek hafta kapalı: *Kommen Sie bitte morgen um 8 Uhr 30*.' },
            { q: 'Was macht der Kurs morgen?', o: ['Er schreibt einen Test', 'Er sieht einen Film', 'Es gibt keinen Unterricht'], a: 'b', lines: [
                    ['Paul', 'Hallo, hier ist Paul. Eine Nachricht für den Kurs A1: Der Test ist nicht morgen, sondern erst nächste Woche. Morgen sehen wir zusammen einen Film – auf Deutsch natürlich! Der Unterricht beginnt wie immer um 9 Uhr.']
                ],
                why: 'Sınav gelecek haftaya kaldı; *Morgen sehen wir zusammen einen Film*. Ders yine 9’da başlıyor.' },
        ] },
});
