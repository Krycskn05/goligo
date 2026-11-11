"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Schreiben 8: looking for a flat (form); a message to a colleague who is ill. */
exports.exam = (0, a1_exam_build_1.buildSchreiben)(8, 'Wohnungssuche · Nachricht an einen kranken Kollegen', {
    teil1: {
        text: 'Ihre Freundin Sabine Krüger sucht eine neue Wohnung in Berlin. Sie wohnt allein. Die Wohnung soll zwei Zimmer und einen Balkon haben. Sabine kann 700 Euro Miete im Monat bezahlen, 800 Euro sind zu viel. Sie möchte am 1. April umziehen. Haustiere hat sie nicht.',
        form: 'Wohnungssuche – Büro Berger',
        rows: [['Name', 'Sabine Krüger'], ['Personen', '{1}'], ['Zimmer', '{2}'], ['Balkon', '{3}'], ['Miete bis', '{4}'], ['ab wann?', '{5}'], ['Haustiere', 'nein']],
        gaps: [
            [['1', 'eine', 'eins', '1 Person', 'eine Person'], 'infer', 'Sie wohnt allein'],
            [['2', 'zwei', '2 Zimmer', 'zwei Zimmer'], 'text', 'zwei Zimmer'],
            [['ja', 'mit Balkon', 'ja, mit Balkon'], 'text', 'einen Balkon haben'],
            [['700 Euro', '700', '700 EUR'], 'text', '700 Euro Miete im Monat bezahlen'],
            [['1. April', '01.04.', 'am 1. April', 'ab 1. April', 'ab dem 1. April', 'ersten April'], 'text', 'am 1. April umziehen'],
        ]
    },
    teil2: {
        task: 'Ihr Kollege Tarek ist krank und liegt im Bett. Schreiben Sie Tarek eine Nachricht:',
        points: ['Gute Besserung', 'Wie können Sie helfen?', 'Wann besuchen Sie Tarek?'],
        model: [
            'Lieber Tarek,',
            'du bist krank – das tut mir leid. Gute Besserung!',
            'Ich kann für dich einkaufen. Was brauchst du?',
            'Ich komme morgen nach der Arbeit.',
            'Ich bringe dir eine Suppe mit. Hast du Tee zu Hause?',
            'Schreib mir bitte!',
            'Liebe Grüße',
            '(Ihr Name)',
        ]
    },
});
