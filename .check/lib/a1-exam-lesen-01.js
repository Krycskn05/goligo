"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Lesen 1: Sabine's move, the class trip to the zoo, small ads, notices in town. */
exports.exam = (0, a1_exam_build_1.buildExam)(1, 'Umzug · Ausflug in den Zoo · Möbel und Jobs · Schilder in der Stadt', {
    teil1: [
        { kind: 'mail', from: 'Sabine Krüger', to: 'Mei Suwan', subject: 'Umzug am Samstag',
            lines: ['Liebe Mei,', 'am Samstag ziehe ich um. Die neue Wohnung ist in der Marktstraße, im dritten Stock – leider ohne Aufzug. Jonas holt um 9 Uhr den Transporter. Kannst du auch helfen? Nikos und Omar kommen erst am Nachmittag, sie müssen bis 13 Uhr arbeiten. Am Abend koche ich für alle.', 'Bitte schreib mir bis Donnerstag.', 'Viele Grüße', 'Sabine'],
            example: ['Sabine hat eine neue Wohnung.', 'r'],
            items: [
                ['Nikos und Omar helfen schon am Vormittag.', 'f', 'Metinde *erst am Nachmittag* yazıyor: ikisi 13’e kadar çalışıyor, öğleden sonra geliyor.'],
                ['Am Samstagabend gibt es bei Sabine Essen.', 'r', '*Am Abend koche ich für alle*: Sabine akşam herkese yemek yapıyor.'],
            ] },
        { kind: 'letter',
            lines: ['Liebe Eltern,', 'am Freitag, dem 14. Juni, macht die Klasse 3b einen Ausflug in den Zoo. Wir treffen uns um 8.15 Uhr vor der Schule und fahren zusammen mit dem Bus. Um 15 Uhr sind wir wieder da.', 'Der Eintritt kostet 6 Euro, die Busfahrt ist frei. Bitte geben Sie Ihrem Kind das Geld bis Mittwoch mit. Die Kinder brauchen Essen und Trinken für den Tag und bequeme Schuhe.', 'Mit freundlichen Grüßen', 'Lena Brandt, Klassenlehrerin'],
            items: [
                ['Die Klasse trifft sich am Freitag im Zoo.', 'f', 'Buluşma yeri *vor der Schule*; hayvanat bahçesine oradan otobüsle gidiliyor.'],
                ['Die Eltern bezahlen 6 Euro für den Ausflug.', 'r', 'Giriş 6 Euro, *die Busfahrt ist frei*: toplam 6 Euro.'],
                ['Die Kinder bekommen im Zoo ein Mittagessen.', 'f', '*Die Kinder brauchen Essen und Trinken*: yiyeceği çocuklar kendileri getiriyor.'],
            ] },
    ],
    teil2: { mode: 'ad',
        example: ['Sie möchten Gitarre lernen.',
            ['solid', ['**Gitarre** zu verkaufen,', 'fast neu, mit Tasche, € 80.', 'Tel.: 030 / 23125 104'], '030 / 23125 104', 'serif'],
            ['dotted', ['**Gitarrenunterricht** für Anfänger,', 'auch am Abend.', 'Erste Stunde gratis!', 'Tel.: 030 / 23125 377'], '030 / 23125 377'], 'b'],
        items: [
            ['Sie brauchen ein Bett für Ihre Tochter (4 Jahre).',
                ['dashed', ['**Kinderbett**, 70 × 140 cm, weiß,', 'mit Matratze, 4 Jahre alt,', 'guter Zustand, € 45.', 'Tel.: 030 / 23125 612'], '030 / 23125 612', 'serif'],
                ['solid', ['**Doppelbett**, 1,80 × 2,00 m, Holz,', 'wie neu, nur 4 Monate alt,', '€ 220.', 'Tel.: 0176 / 040690 31'], '0176 / 040690 31'],
                'a', 'Dört yaşındaki bir çocuğa *Kinderbett* gerekir; *Doppelbett* iki yetişkin için. İki ilandaki 4 sayısı yatağın yaşını söylüyor.'],
            ['Sie suchen eine Arbeit nur für das Wochenende.',
                ['solid', ['**Café am Kanal** sucht Kellner/in,', 'Montag bis Freitag,', '8–14 Uhr.', 'Tel.: 030 / 23125 245'], '030 / 23125 245'],
                ['dotted', ['**Bäckerei** sucht Verkäufer/in', 'für Samstag und Sonntag,', '6–12 Uhr.', 'Tel.: 030 / 23125 890'], '030 / 23125 890'],
                'b', 'Hafta sonu = *Samstag und Sonntag*. Kafe yalnızca pazartesiden cumaya eleman arıyor.'],
            ['Ihr Fahrrad ist kaputt. Sie brauchen Hilfe.',
                ['shaded', ['**Fahrradwerkstatt Rad & Tat**', 'Reparaturen in 24 Stunden,', 'auch ohne Termin.', 'Tel.: 030 / 23125 433'], '030 / 23125 433'],
                ['solid', ['Verkaufe **Herrenfahrrad**,', '28 Zoll, neue Reifen,', 'Licht kaputt, € 60.', 'Tel.: 0176 / 040690 58'], '0176 / 040690 58', 'serif'],
                'a', 'Tamir için *Fahrradwerkstatt* gerekir. Öbür ilan bisiklet satıyor; *kaputt* kelimesi orada sadece ışık için.'],
            ['Sie brauchen für eine Woche ein großes Auto.',
                ['dotted', ['**Autovermietung Kanal**', 'Kleinwagen ab € 29 pro Tag,', 'Bus mit 9 Plätzen ab € 79 pro Tag.', 'Tel.: 030 / 23125 760'], '030 / 23125 760'],
                ['dashed', ['Verkaufe **Familienauto**,', '7 Sitze, 8 Jahre alt,', '€ 4.500.', 'Tel.: 030 / 23125 921'], '030 / 23125 921', 'serif'],
                'a', 'Bir haftalığına araba kiralanır: *Autovermietung*. Öbür ilan arabayı satıyor (*Verkaufe*).'],
            ['Sie möchten Deutsch lernen. Am Tag arbeiten Sie.',
                ['solid', ['**Sprachschule Lingua**', 'Intensivkurse Deutsch A1–B1,', 'Montag bis Freitag, 9–13 Uhr.', 'Tel.: 030 / 23125 318'], '030 / 23125 318'],
                ['shaded', ['**Deutsch nach der Arbeit**', 'Dienstag und Donnerstag,', '18.30–20 Uhr, kleine Gruppen.', 'Tel.: 030 / 23125 556'], '030 / 23125 556'],
                'b', 'Gündüz çalışan biri 9–13 kursuna gidemez; akşam kursu *18.30–20 Uhr* uyar.'],
        ] },
    teil3: {
        example: ['An der Tür der **Sprachschule**.', ['round', ['Heute kein Unterricht im Kurs A1:', 'Die Lehrerin ist krank.', 'Morgen ist wieder normal Unterricht.']], 'Der A1-Kurs fällt heute aus.', 'r'],
        items: [
            ['Im Fenster einer **Apotheke**.', ['solid', ['Heute Nacht geschlossen.', '**Notdienst:** Rosen-Apotheke, Uferweg 12,', 'die ganze Nacht geöffnet.']],
                'Sie brauchen heute Nacht ein Medikament. Sie können in den Uferweg gehen.', 'r', 'Bu eczane kapalı, ama nöbetçi *Rosen-Apotheke, Uferweg 12* bütün gece açık.'],
            ['Am Eingang eines **Schwimmbads**.', ['bold', ['Kinder unter 6 Jahren: Eintritt frei –', 'nur zusammen mit einem Erwachsenen.'], 'Stadtbad'],
                'Ihr Sohn (5) kann allein ins Schwimmbad gehen.', 'f', 'Altı yaşından küçükler *nur zusammen mit einem Erwachsenen* girebilir; tek başına olmaz.'],
            ['An einem **Geldautomaten**.', ['dashed', ['Dieser Automat ist leider kaputt.', 'Den nächsten Geldautomaten', 'finden Sie im Bahnhof.']],
                'Hier bekommen Sie heute kein Geld.', 'r', '*Dieser Automat ist leider kaputt*: buradan para çekilmez, en yakını garda.'],
            ['An einer **Tankstelle**.', ['double', ['Frische Brötchen!', 'Täglich ab 7 Uhr.', 'Sonntags ab 8 Uhr.'], undefined, 'serif'],
                'Am Sonntag um halb neun gibt es hier schon frische Brötchen.', 'r', 'Pazar günü *ab 8 Uhr* var; *halb neun* = 8.30, yani o saatte taze ekmek var.'],
            ['Am **Aufzug** im Bahnhof.', ['shaded', ['Aufzug kaputt! Reparatur bis Freitag.', 'Bitte benutzen Sie die Treppe', 'oder den Aufzug an Gleis 5.']],
                'Im Bahnhof gibt es bis Freitag keinen Aufzug.', 'f', 'Yalnızca bu asansör bozuk; *der Aufzug an Gleis 5* çalışıyor.'],
        ]
    },
});
