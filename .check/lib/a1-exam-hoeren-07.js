"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Hören 7: at the kiosk, jobs and free time; announcements; messages on the phone. */
exports.exam = (0, a1_exam_build_1.buildHoeren)(7, 'Am Kiosk · Beruf und Freizeit · Durchsagen · Fahrschule, Lieferung, Arbeit', {
    teil1: {
        example: { q: 'Was kauft die Frau am Kiosk?', o: ['Eine Zeitung', 'Eine Fahrkarte', 'Briefmarken'], a: 'b', lines: [
                ['Kundin:F4', 'Guten Tag, haben Sie Briefmarken?'],
                ['Omar', 'Nein, Briefmarken gibt es bei der Post. Hier bekommen Sie Zeitungen und Fahrkarten.'],
                ['Kundin:F4', 'Dann eine Fahrkarte für den Bus, bitte.']
            ] },
        items: [
            { q: 'Wie oft trainiert Tomasz die Kinder?', o: ['Einmal pro Woche', 'Zweimal pro Woche', 'Jeden Tag'], a: 'b', lines: [
                    ['Nikos', 'Tomasz, du trainierst die Kinder jeden Tag, oder?'],
                    ['Tomasz', 'Nein, nein! Nur zweimal pro Woche, am Montag und am Mittwoch. Und einmal im Monat haben wir ein Spiel.']
                ],
                why: 'Her gün değil: *Nur zweimal pro Woche*. Ayda bir olan şey maç: *einmal im Monat*.' },
            { q: 'Was ist Nikos von Beruf?', o: ['Mechatroniker', 'Koch', 'Taxifahrer'], a: 'a', lines: [
                    ['Aisha', 'Nikos, arbeitest du auch als Taxifahrer?'],
                    ['Nikos', 'Nein, ich bin Mechatroniker. Ich repariere Autos – auch dein Taxi! Kochen ist nur mein Hobby.']
                ],
                why: '*Ich bin Mechatroniker*; taksi şoförü Aisha, yemek yapmak ise yalnızca hobisi.' },
            { q: 'Was nimmt Sabine mit?', o: [['☂️', 'Einen Regenschirm'], ['🕶️', 'Eine Sonnenbrille'], ['🧥', 'Eine Jacke']], a: 'c', lines: [
                    ['Jonas:M1', 'Sabine, nimmst du keinen Regenschirm mit?'],
                    ['Sabine', 'Nein, heute regnet es nicht mehr. Aber es ist kalt – ich nehme meine Jacke. Die Sonnenbrille brauche ich leider nicht.']
                ],
                why: 'Yağmur yok, güneş de yok; hava soğuk: *ich nehme meine Jacke*.' },
            { q: 'Wie viele Gäste kommen am Samstag?', o: ['Vier', 'Fünf', 'Sechs'], a: 'a', lines: [
                    ['Hanan:F2', 'Rami, wie viele Gäste kommen am Samstag? Sechs?'],
                    ['Rami', 'Nein. Omar kann nicht und Aisha arbeitet. Es kommen Nikos, Sabine, Jonas und Mei – das sind vier.'],
                    ['Hanan:F2', 'Gut, vier Gäste. Dann koche ich nicht so viel.']
                ],
                why: 'Omar gelemiyor, Aisha çalışıyor; gelenler Nikos, Sabine, Jonas ve Mei: *das sind vier*.' },
            { q: 'Seit wann wohnt Mei in Deutschland?', o: ['Seit einem Jahr', 'Seit zwei Jahren', 'Seit drei Jahren'], a: 'b', lines: [
                    ['Paul', 'Mei, dein Deutsch ist sehr gut! Bist du schon drei Jahre hier?'],
                    ['Mei', 'Nein, erst zwei. Aber ich lerne schon seit drei Jahren Deutsch: ein Jahr in Bangkok und zwei Jahre hier.']
                ],
                why: 'Almanya’da *erst zwei* yıldır; üç yıl, Almanca öğrendiği toplam süre.' },
            { q: 'An welchem Tag hat Nora diese Woche frei?', o: ['Am Montag', 'Am Sonntag', 'Am Mittwoch'], a: 'c', lines: [
                    ['Mei', 'Nora, hast du am Sonntag frei? Dann gehen wir zusammen frühstücken!'],
                    ['Nora', 'Am Sonntag arbeite ich im Krankenhaus, leider. Diese Woche habe ich nur am Mittwoch frei. Am Montag fängt mein Dienst wieder an.']
                ],
                why: 'Pazar çalışıyor; *Diese Woche habe ich nur am Mittwoch frei*.' },
        ]
    },
    teil2: {
        example: { t: 'Der Museumsladen ist schon geschlossen.', a: 'f', lines: [
                ['Sprecherin:F5', 'Liebe Besucher, unser Museum schließt in zehn Minuten. Den Museumsladen können Sie noch bis 18 Uhr 30 besuchen.']
            ] },
        items: [
            { t: 'Man soll bei seinem Gepäck bleiben.', a: 'r', lines: [
                    ['Sprecher:M3', 'Achtung, bitte lassen Sie Ihr Gepäck nicht allein! Koffer und Taschen ohne Besitzer bringen wir sofort weg.']
                ],
                why: '*Lassen Sie Ihr Gepäck nicht allein*: bagajın yanından ayrılmamak gerekiyor.' },
            { t: 'In den zweiten Stock kommt man heute nur mit dem Aufzug.', a: 'f', lines: [
                    ['Sprecherin:F1', 'Liebe Kunden, die Rolltreppe in den zweiten Stock ist heute kaputt. Bitte nehmen Sie den Aufzug oder die Treppe neben dem Café.']
                ],
                why: 'Yürüyen merdiven bozuk, ama iki yol var: *den Aufzug oder die Treppe*.' },
            { t: 'Fahrgäste nach Bonn sollen in Köln aussteigen.', a: 'r', lines: [
                    ['Sprecher:M4', 'Nächster Halt: Köln Hauptbahnhof. Fahrgäste nach Bonn steigen bitte hier um. Der Zug nach Bonn wartet auf Gleis 6.']
                ],
                why: '*Steigen bitte hier um*: Bonn yolcuları Köln’de inip 6. perondaki trene geçiyor.' },
            { t: 'Die Badegäste sollen aus dem Wasser gehen.', a: 'r', lines: [
                    ['Sprecherin:F2', 'Liebe Badegäste, ein Gewitter kommt. Bitte gehen Sie sofort aus dem Wasser. Sie können in der Cafeteria warten.']
                ],
                why: 'Fırtına geliyor: *Bitte gehen Sie sofort aus dem Wasser*.' },
        ]
    },
    teil3: { items: [
            { q: 'Wann ist Frau Arslans erste Fahrstunde?', o: ['Am Dienstag um 16 Uhr', 'Am Montag um 16 Uhr', 'Am Montag um 18 Uhr'], a: 'a', lines: [
                    ['Fahrschule:M2', 'Guten Tag, Frau Arslan, hier ist die Fahrschule Ziel. Ihre erste Fahrstunde ist am Dienstag um 16 Uhr. Am Montag um 18 Uhr ist der Theoriekurs – bitte kommen Sie auch da. Bringen Sie Ihren Pass mit.']
                ],
                why: 'İlk direksiyon dersi *am Dienstag um 16 Uhr*; pazartesi 18’deki teori dersi.' },
            { q: 'Was soll Sabine mitbringen?', o: ['Fotos', 'Kuchen', 'Ein Buch'], a: 'a', lines: [
                    ['Mutter:F4', 'Hallo Sabine, hier ist Mama. Du kommst doch am Sonntag nach Bremen? Bring bitte die Fotos von deiner neuen Wohnung mit! Kuchen backe ich selbst, und ein Buch habe ich noch. Papa freut sich schon. Tschüs!']
                ],
                why: '*Bring bitte die Fotos … mit*; pastayı annesi kendi yapıyor, kitabı da var.' },
            { q: 'Wann kommt das Sofa am Donnerstag?', o: ['Am Vormittag', 'Am Nachmittag', 'Am Abend'], a: 'b', lines: [
                    ['Möbelhaus:M3', 'Guten Tag, Frau Krüger, hier ist das Möbelhaus Nordstern. Wir bringen Ihr Sofa am Donnerstag. Am Vormittag können wir leider nicht, der Wagen kommt zwischen 14 und 17 Uhr. Bitte seien Sie zu Hause.']
                ],
                why: 'Öğleden önce olmuyor; araç *zwischen 14 und 17 Uhr* geliyor: öğleden sonra.' },
            { q: 'Wo arbeitet Nikos morgen?', o: ['In der Werkstatt', 'Im Büro', 'Im Autohaus am Hafen'], a: 'c', lines: [
                    ['Chef:M2', 'Hallo Herr Papadakis, hier ist Berger. Morgen kommen Sie bitte nicht in die Werkstatt hier. Wir brauchen Sie im Autohaus am Hafen, dort sind zwei Kollegen krank. Fangen Sie um 8 Uhr an. Die Adresse schicke ich Ihnen.']
                ],
                why: 'Yarın buradaki atölyeye gelmiyor: *Wir brauchen Sie im Autohaus am Hafen*.' },
            { q: 'Wann treffen sich Nora und Aisha?', o: ['Um 18 Uhr', 'Um 18.30 Uhr', 'Um 19 Uhr'], a: 'b', lines: [
                    ['Nora', 'Hallo Aisha, hier ist Nora. Ich komme heute erst um 18 Uhr aus dem Krankenhaus. Der Film beginnt um 19 Uhr. Treffen wir uns um halb sieben vor dem Kino? Dann haben wir noch Zeit für einen Kaffee.']
                ],
                why: '18’de işten çıkıyor, film 19’da; buluşma *um halb sieben*: 18.30.' },
        ] },
});
