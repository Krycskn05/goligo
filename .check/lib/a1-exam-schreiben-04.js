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
            [['Rosenweg 8'], 'text', 'im Rosenweg 8'],
            [['Tisch', 'ein Tisch', 'einen Tisch', '1 Tisch', 'Küchentisch'], 'text', 'einen Tisch für ihre Küche'],
            [['89 Euro', '89', '89 EUR', '89,00 Euro'], 'text', 'Der Tisch kostet 89 Euro'],
            [['Freitag', 'am Freitag', 'Fr'], 'text', 'am Freitag bringen, nicht am Samstag'],
            [['Kreditkarte', 'mit Kreditkarte', 'Karte', 'mit Karte'], 'text', 'mit Kreditkarte bezahlen'],
        ]
    },
    teil2: {
        task: 'In Ihrer Wohnung ist die Dusche kaputt. Schreiben Sie an Ihren Vermieter, Herrn Lang:',
        points: ['Was ist kaputt?', 'Seit wann?', 'Wann kann jemand kommen?'],
        model: [
            'Sehr geehrter Herr Lang,',
            'meine Dusche ist kaputt.',
            'Ich habe seit drei Tagen kein warmes Wasser.',
            'Wann kann jemand kommen?',
            'Ich arbeite bis 15 Uhr. Ab 16 Uhr bin ich zu Hause.',
            'Bitte rufen Sie mich an. Vielen Dank!',
            'Mit freundlichen Grüßen',
            '(Ihr Name)',
        ]
    },
});
