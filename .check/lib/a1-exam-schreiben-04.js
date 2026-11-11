"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Schreiben 4: ordering a table online (form); the shower is broken — a message to the landlord. */
exports.exam = (0, a1_exam_build_1.buildSchreiben)(4, 'Bestellung im Möbelhaus · Nachricht an den Vermieter', {
    teil1: {
        text: 'Ihre Nachbarin Yasemin Arslan bestellt im Internet beim Möbelhaus „Wohnwelt“ einen Tisch für ihre Küche. Der Tisch kostet 89 Euro. Die Stühle sind zu teuer: 120 Euro. Yasemin wohnt in Berlin, im Rosenweg 8. Das Möbelhaus soll den Tisch am Freitag bringen, nicht am Samstag. Yasemin möchte mit Kreditkarte bezahlen.',
        form: 'Bestellung – Möbelhaus Wohnwelt',
        rows: [['Name', 'Yasemin Arslan'], ['Straße, Hausnummer', '{1}'], ['PLZ, Ort', '12047 Berlin'], ['Artikel', '{2}'], ['Preis', '{3}'], ['Lieferung am', '{4}'], ['Zahlungsweise', '{5}']],
        gaps: [
            [['Rosenweg 8', 'Rosenweg 89', 'Rosenstraße 8'], 'a', 'text', 'im Rosenweg 8'],
            [['Stühle', 'Tisch', 'Küche'], 'b', 'text', 'einen Tisch für ihre Küche'],
            [['120 Euro', '8 Euro', '89 Euro'], 'c', 'text', 'Der Tisch kostet 89 Euro'],
            [['Freitag', 'Samstag', 'Sonntag'], 'a', 'text', 'am Freitag bringen, nicht am Samstag'],
            [['bar', 'Kreditkarte', 'Rechnung'], 'b', 'text', 'mit Kreditkarte bezahlen'],
        ]
    },
    teil2: {
        task: 'In Ihrer Wohnung ist die Dusche kaputt. Schreiben Sie an Ihren Vermieter, Herrn Lang:',
        points: ['Was ist kaputt?', 'Seit wann?', 'Wann kann jemand kommen?'],
        lines: [
            '{6} Herr Lang,',
            '{7} Dusche {8} kaputt.',
            'Ich habe {9} drei Tagen kein warmes Wasser.',
            '{10}',
            'Ich {11} bis 15 Uhr. {12} 16 Uhr bin ich zu Hause.',
            'Bitte {13} Sie mich an. Vielen {14}!',
            '{15}',
            '(Ihr Name)'
        ],
        gaps: [
            [['Sehr geehrte', 'Liebe', 'Sehr geehrter'], 'c', 'anredeHerr', 'Sehr geehrter Herr Lang'],
            [['meine', 'mein', 'meinen'], 'a', 'poss', 'meine Dusche'],
            [['sind', 'ist', 'bin'], 'b', 'verb', 'meine Dusche ist'],
            [['um', 'am', 'seit'], 'c', 'prep', 'seit drei Tagen'],
            [['Was kostet die Wohnung?', 'Wo ist die Dusche?', 'Wann kann jemand kommen?'], 'c', 'content', 'Wann kann jemand kommen?', 3],
            [['arbeite', 'arbeitest', 'arbeiten'], 'a', 'verb', 'ich arbeite'],
            [['An', 'Ab', 'Auf'], 'b', 'prep', 'Ab 16 Uhr'],
            [['rufen', 'ruft', 'rufst'], 'a', 'register', 'rufen Sie mich an'],
            [['Danke', 'Dank', 'Danken'], 'b', 'wort', 'Vielen Dank'],
            [['Viele Küsse', 'Bis bald, tschüs', 'Mit freundlichen Grüßen'], 'c', 'grussFormal', 'Mit freundlichen Grüßen'],
        ]
    },
});
