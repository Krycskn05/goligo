"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Lesen 8: Lina is ill, the library's letter, ads, notices. */
exports.exam = (0, a1_exam_build_1.buildExam)(8, 'Kind ist krank · Brief von der Bibliothek · Anzeigen · Zeiten und Orte', {
    teil1: [
        { kind: 'mail', from: 'Rami Khalil', to: 'Frau Brandt', subject: 'Lina ist krank',
            lines: ['Sehr geehrte Frau Brandt,', 'meine Tochter Lina hat seit gestern Abend Fieber und kann heute nicht in die Schule kommen. Der Arzt sagt, sie soll bis Mittwoch im Bett bleiben. Am Donnerstag ist sie wieder da.', 'Können Sie mir bitte die Hausaufgaben schicken? Am Freitag schreibt die Klasse den Mathetest – Lina möchte gern mitschreiben.', 'Mit freundlichen Grüßen', 'Rami Khalil'],
            example: ['Lina geht heute nicht in die Schule.', 'r'],
            items: [
                ['Lina bleibt die ganze Woche zu Hause.', 'f', 'Yalnızca çarşambaya kadar yatacak; *am Donnerstag ist sie wieder da*.'],
                ['Lina kann am Freitag in der Schule sein.', 'r', 'Perşembe okula dönüyor, yani cuma günü de okulda; testi yazmak istiyor.'],
            ] },
        { kind: 'letter',
            lines: ['Sehr geehrte Frau Arslan,', 'Sie haben seit dem 2. Mai drei Bücher von uns. Die Leihzeit ist vier Wochen – sie war am 30. Mai zu Ende. Bitte bringen Sie die Bücher bis Samstag zurück. Sie können sie auch in die Box vor der Tür legen, die ist Tag und Nacht offen.', 'Für jede Woche Verspätung bezahlen Sie 1 Euro pro Buch. Brauchen Sie die Bücher noch? Dann können Sie die Zeit einmal online verlängern.', 'Ihre Stadtbibliothek'],
            items: [
                ['Die Bücher kann man nur am Tag zurückbringen.', 'f', 'Kapının önündeki kutu *Tag und Nacht offen*: gece de bırakılabilir.'],
                ['Für drei Bücher bezahlt Frau Arslan 1 Euro pro Woche.', 'f', '*1 Euro pro Buch*: üç kitap için haftada 3 Euro.'],
                ['Frau Arslan kann die Bücher noch länger haben.', 'r', '*können Sie die Zeit einmal online verlängern*: süre bir kez uzatılabiliyor.'],
            ] },
    ],
    teil2: { mode: 'ad',
        example: ['Sie möchten tanzen lernen.',
            ['dashed', ['**Tanzschule Schritt**', 'Kurse für Anfänger,', 'Start jeden Monat.', 'Tel.: 030 / 23125 271'], '030 / 23125 271'],
            ['solid', ['**Disco „Mondschein“**', 'Freitag und Samstag Tanzen', 'bis 5 Uhr früh. Eintritt € 8.', 'Tel.: 030 / 23125 603'], '030 / 23125 603', 'serif'], 'a'],
        items: [
            ['Sie suchen ein Sofa. Bei Ihnen schlafen oft Gäste.',
                ['solid', ['**Ledersofa**, schwarz,', '2 Sitze, sehr elegant,', '€ 250.', 'Tel.: 0176 / 040690 47'], '0176 / 040690 47', 'serif'],
                ['dotted', ['**Schlafsofa**, grau, 2 Jahre alt,', 'Bett 1,40 × 2,00 m,', '€ 180.', 'Tel.: 0176 / 040690 92'], '0176 / 040690 92'],
                'b', 'Misafirler için *Schlafsofa*: açılınca 1,40 × 2,00 m yatak oluyor. Deri kanepe iki kişilik, yatak değil.'],
            ['Sie brauchen heute noch Passfotos.',
                ['shaded', ['**Foto Blitz**', 'Passfotos in 10 Minuten,', 'ohne Termin, Mo–Sa 9–19 Uhr.', 'Tel.: 030 / 23125 338'], '030 / 23125 338'],
                ['solid', ['**Fotostudio Lichtblick**', 'Familien- und Hochzeitsfotos.', 'Termine in 2–3 Wochen.', 'Tel.: 030 / 23125 775'], '030 / 23125 775', 'serif'],
                'a', 'Bugün için: *in 10 Minuten, ohne Termin*. Öbür stüdyo iki–üç hafta sonraya randevu veriyor.'],
            ['Sie suchen einen Kindersitz für Ihr Auto. Ihr Kind ist 4 Jahre alt.',
                ['dashed', ['**Babyschale** für das Auto,', 'für Kinder bis 12 Monate,', '€ 30.', 'Tel.: 0176 / 040690 05'], '0176 / 040690 05', 'serif'],
                ['solid', ['**Autositz** für Kinder', 'von 3 bis 7 Jahren,', '€ 45.', 'Tel.: 0176 / 040690 68'], '0176 / 040690 68'],
                'b', 'Dört yaş, *von 3 bis 7 Jahren* aralığında. *Babyschale* yalnızca 12 aya kadar.'],
            ['Sie suchen einen Job für die Sommerferien.',
                ['solid', ['**Eiscafé Venezia** sucht Hilfe', 'für Juli und August,', 'auch Schüler ab 16.', 'Tel.: 030 / 23125 441'], '030 / 23125 441'],
                ['dotted', ['**Supermarkt** sucht', 'Kassierer/in ab Oktober,', '20 Stunden pro Woche.', 'Tel.: 030 / 23125 986'], '030 / 23125 986', 'serif'],
                'a', 'Yaz tatili = *Juli und August*. Market ekimden itibaren eleman arıyor.'],
            ['Ihr Schlüssel ist weg. Sie können nicht in Ihre Wohnung. Es ist 23 Uhr.',
                ['bold', ['**Schlüsseldienst Schnell**', 'Tag und Nacht,', 'in 20 Minuten bei Ihnen.', 'Tel.: 030 / 23125 524'], '030 / 23125 524'],
                ['solid', ['**Schlüssel kopieren** ab € 5', 'in unserem Geschäft im Bahnhof,', 'Mo–Sa 8–18 Uhr.', 'Tel.: 030 / 23125 859'], '030 / 23125 859', 'serif'],
                'a', 'Gece 23’te yalnızca *Tag und Nacht* çalışan çilingir gelir. Öbür dükkân 18’de kapanıyor ve yalnızca anahtar kopyalıyor.'],
        ] },
    teil3: {
        example: ['In einer **Buchhandlung**.', ['round', ['Am Samstag um 16 Uhr:', 'Lesestunde für Kinder.', 'Eintritt frei!']], 'Die Lesestunde für Kinder kostet nichts.', 'r'],
        items: [
            ['Auf dem **Bahnsteig**.', ['bold', ['Der ICE nach München hat heute', '25 Minuten Verspätung.', 'Abfahrt jetzt: 10.40 Uhr.']],
                'An anderen Tagen fährt dieser Zug um 10.15 Uhr ab.', 'r', '10.40’tan 25 dakika gecikmeyi çıkarın: normal kalkış 10.15.'],
            ['An einem **Getränkeautomaten**.', ['dashed', ['Automat kaputt!', 'Kaffee und Tee bekommen Sie', 'in der Cafeteria im 1. Stock.']],
                'Im ganzen Haus gibt es heute keinen Kaffee.', 'f', 'Yalnızca otomat bozuk; kahve *in der Cafeteria im 1. Stock* var.'],
            ['An der **Kasse** im Theater.', ['solid', ['Für heute Abend gibt es leider', 'keine Karten mehr.', 'Für morgen haben wir noch Plätze.']],
                'Sie können heute eine Karte für morgen kaufen.', 'r', 'Bu akşam için bilet kalmadı, ama *für morgen haben wir noch Plätze*.'],
            ['In einer **Musikschule**.', ['shaded', ['Gitarrenunterricht: Montag und Mittwoch, 18–19.30 Uhr.', 'Anmeldung im Büro: Dienstag und Donnerstag, 10–17 Uhr.']],
                'Am Montagabend können Sie sich im Büro anmelden.', 'f', 'Pazartesi akşamı ders var; kayıt bürosu yalnızca salı ve perşembe 10–17 açık.'],
            ['Auf dem **Marktplatz**.', ['double', ['Der Wochenmarkt ist ab Mai nicht mehr am Dienstag,', 'sondern am Mittwoch und am Samstag, 8–13 Uhr.'], undefined, 'serif'],
                'Im Juni gibt es den Markt zweimal pro Woche.', 'r', 'Mayıstan itibaren çarşamba ve cumartesi: haftada iki gün.'],
        ]
    },
});
