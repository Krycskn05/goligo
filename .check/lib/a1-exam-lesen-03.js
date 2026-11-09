"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Lesen 3: Nora swaps a shift, the exam day at the language school, ads, notices. */
exports.exam = (0, a1_exam_build_1.buildExam)(3, 'Dienst tauschen · Prüfungstag · Anzeigen · Ämter und Geschäfte', {
    teil1: [
        { kind: 'mail', from: 'Nora Weiß', to: 'Lena', subject: 'Dienst am Freitag',
            lines: ['Hallo Lena,', 'ich habe eine Bitte. Am Freitag habe ich Frühdienst, aber um 10 Uhr muss ich zum Zahnarzt. Kannst du am Freitag für mich arbeiten? Dann komme ich am Sonntag für dich ins Krankenhaus. Da hast du doch Spätdienst, oder?', 'Ruf mich bitte heute Abend an. Am Tag kann ich nicht telefonieren.', 'Danke und liebe Grüße', 'Nora'],
            example: ['Nora arbeitet im Krankenhaus.', 'r'],
            items: [
                ['Nora hat am Freitag einen Termin beim Arzt.', 'r', '*Um 10 Uhr muss ich zum Zahnarzt*: diş hekimi de bir doktordur.'],
                ['Lena soll am Sonntag für Nora arbeiten.', 'f', 'Tam tersi: Lena cuma günü Nora’nın yerine çalışacak, pazar günü Nora Lena’nın yerine.'],
            ] },
        { kind: 'letter',
            lines: ['Liebe Kursteilnehmerinnen und Kursteilnehmer,', 'die Prüfung „Start Deutsch 1“ ist am Samstag, dem 22. November. Sie beginnt um 9 Uhr, bitte kommen Sie schon um 8.30 Uhr. Die Prüfung ist nicht in unserer Schule, sondern in der Volkshochschule, Raum 12.', 'Bringen Sie bitte Ihren Pass oder Ausweis mit. Handys und Wörterbücher sind nicht erlaubt. Die Ergebnisse bekommen Sie nach zwei Wochen mit der Post.', 'Viel Erfolg!', 'Ihr Team der Sprachschule'],
            items: [
                ['Die Teilnehmer sollen eine halbe Stunde vor der Prüfung da sein.', 'r', 'Sınav 9’da başlıyor, 8.30’da gelinmesi isteniyor: yarım saat önce.'],
                ['Die Prüfung ist in der Sprachschule.', 'f', '*Nicht in unserer Schule, sondern in der Volkshochschule*: sınav başka binada.'],
                ['Die Teilnehmer müssen die Ergebnisse nicht in der Schule abholen.', 'r', 'Sonuçlar iki hafta sonra *mit der Post* geliyor; okula gitmek gerekmiyor.'],
            ] },
    ],
    teil2: { mode: 'ad',
        example: ['Sie suchen einen Kindergartenplatz für Ihren Sohn (3 Jahre).',
            ['solid', ['**Kita Sonnenschein**', 'Freie Plätze für Kinder', 'von 3 bis 6 Jahren.', 'Tel.: 030 / 23125 190'], '030 / 23125 190'],
            ['dashed', ['**Babygruppe Mäuse**', 'Wir nehmen Babys und', 'Kinder bis 2 Jahre.', 'Tel.: 030 / 23125 635'], '030 / 23125 635', 'serif'], 'a'],
        items: [
            ['Sie suchen einen Schreibtisch. In Ihrem Zimmer ist nur 1,20 m Platz.',
                ['solid', ['**Schreibtisch**, Holz,', '1,60 m breit, dunkel,', '€ 70.', 'Tel.: 0176 / 040690 25'], '0176 / 040690 25', 'serif'],
                ['dotted', ['**Schreibtisch**, weiß,', '1,10 m breit, wie neu,', '€ 55.', 'Tel.: 030 / 23125 472'], '030 / 23125 472'],
                'b', '1,20 m yere 1,10 m genişliğindeki masa sığar; 1,60 m olan sığmaz.'],
            ['Sie möchten am Sonntag frühstücken gehen.',
                ['dashed', ['**Café Morgenrot**', 'Frühstück Montag bis Samstag', '7–11 Uhr. Sonntag Ruhetag.', 'Tel.: 030 / 23125 058'], '030 / 23125 058'],
                ['shaded', ['**Café Kanal**', 'Am Wochenende großes', 'Frühstücksbuffet bis 14 Uhr.', 'Tel.: 030 / 23125 741'], '030 / 23125 741'],
                'b', '*Sonntag Ruhetag* = pazar kapalı. Café Kanal hafta sonu kahvaltı veriyor.'],
            ['Sie sind Mechatroniker und möchten jeden Tag arbeiten.',
                ['solid', ['**Autohaus Lang** sucht', 'Mechatroniker/in,', '40 Stunden pro Woche, ab sofort.', 'Tel.: 030 / 23125 826'], '030 / 23125 826'],
                ['dotted', ['**Werkstatt** sucht Hilfe', 'für 2 Wochen im August', '(Reifen wechseln).', 'Tel.: 030 / 23125 309'], '030 / 23125 309', 'serif'],
                'a', 'Her gün çalışmak için haftada 40 saatlik iş uyar; öbür iş yalnızca ağustosta iki hafta.'],
            ['Sie möchten Ihren Kleinwagen verkaufen.',
                ['shaded', ['**Suche Kleinwagen**', 'bis € 3.000, auch mit', 'vielen Kilometern. Bitte anrufen!', 'Tel.: 0176 / 040690 63'], '0176 / 040690 63'],
                ['solid', ['**Verkaufe Kleinwagen**,', '12 Jahre alt, rot,', '€ 2.800.', 'Tel.: 0176 / 040690 09'], '0176 / 040690 09', 'serif'],
                'a', 'Arabanızı, araba arayan kişiye satarsınız: *Suche Kleinwagen*. Öbür ilanın sahibi de arabasını satıyor.'],
            ['Ihr Kind (10 Jahre) braucht Hilfe in Mathematik.',
                ['dashed', ['**Mathe-Nachhilfe**', 'für Schüler der Klassen 3–6,', 'bei Ihnen zu Hause.', 'Tel.: 030 / 23125 517'], '030 / 23125 517'],
                ['solid', ['**Studentin sucht Hilfe**', 'in Mathematik für die Universität,', 'bezahle € 15 pro Stunde.', 'Tel.: 030 / 23125 964'], '030 / 23125 964', 'serif'],
                'a', '*Nachhilfe für Schüler* = öğrencilere özel ders. Öbür ilanda öğrenci kendisi yardım arıyor.'],
        ] },
    teil3: {
        example: ['Am Eingang eines **Kinos**.', ['bold', ['Heute: Kinderfilm um 15 Uhr –', 'Eintritt für alle nur 4 Euro!'], 'Kino am Kanal'], 'Heute Nachmittag gibt es einen Film für Kinder.', 'r'],
        items: [
            ['Am Eingang eines **Museums**.', ['solid', ['Di–So 10–18 Uhr · Montag geschlossen', 'Jeden ersten Sonntag im Monat:', 'Eintritt frei'], 'Stadtmuseum'],
                'Jeden Sonntag kostet das Museum nichts.', 'f', 'Ücretsiz olan yalnızca *jeden ersten Sonntag im Monat*: ayda bir pazar.'],
            ['An einem **Parkplatz**.', ['bold', ['Parkplatz nur für Kunden', 'vom Supermarkt.', 'Maximal 2 Stunden!']],
                'Sie arbeiten in der Nähe. Sie können hier den ganzen Tag parken.', 'f', 'Yalnızca market müşterileri ve en çok iki saat: *maximal 2 Stunden*.'],
            ['An der Tür vom **Bürgeramt**.', ['shaded', ['Ab 1. Februar nur noch mit Termin!', 'Termine bekommen Sie online', 'oder am Telefon.'], 'Bürgeramt'],
                'Ab Februar brauchen Sie hier einen Termin.', 'r', '*Ab 1. Februar nur noch mit Termin*: randevusuz olmuyor.'],
            ['Im **Treppenhaus**.', ['dashed', ['Am Donnerstag von 9 bis 11 Uhr kommt der Techniker für die Heizung. Bitte seien Sie zu Hause', 'oder geben Sie den Schlüssel einem Nachbarn.'], undefined, 'serif'],
                'Am Donnerstagvormittag müssen alle Mieter zu Hause sein.', 'f', 'Şart değil: anahtarı bir komşuya bırakmak da olur (*oder geben Sie den Schlüssel einem Nachbarn*).'],
            ['Im Fenster von einem **Schuhgeschäft**.', ['double', ['Alles muss raus!', 'Wir schließen am 31. März.', 'Alle Schuhe 50 % billiger.']],
                'Im April kann man hier keine Schuhe mehr kaufen.', 'r', 'Dükkân 31 Mart’ta kapanıyor (*wir schließen*); nisanda artık yok.'],
        ]
    },
});
