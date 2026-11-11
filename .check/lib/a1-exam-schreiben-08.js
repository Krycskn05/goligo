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
            [['3', '2', '1'], 'c', 'infer', 'Sie wohnt allein'],
            [['2', '1', '4'], 'a', 'text', 'zwei Zimmer'],
            [['nein', 'egal', 'ja'], 'c', 'text', 'einen Balkon haben'],
            [['800 Euro', '700 Euro', '1 000 Euro'], 'b', 'text', '700 Euro Miete im Monat bezahlen'],
            [['1. April', '1. Mai', '4. Januar'], 'a', 'text', 'am 1. April umziehen'],
        ]
    },
    teil2: {
        task: 'Ihr Kollege Tarek ist krank und liegt im Bett. Schreiben Sie Tarek eine Nachricht:',
        points: ['Gute Besserung', 'Wie können Sie helfen?', 'Wann besuchen Sie Tarek?'],
        lines: [
            '{6} Tarek,',
            'du {7} krank – das tut mir leid. Gute {8}!',
            'Ich kann {9} dich einkaufen. {10} brauchst du?',
            '{11}',
            'Ich {12} dir eine Suppe mit. {13} du Tee zu Hause?',
            'Schreib {14} bitte!',
            '{15}',
            '(Ihr Name)'
        ],
        gaps: [
            [['Liebe', 'Sehr geehrte', 'Lieber'], 'c', 'anredeFreund', 'Lieber Tarek'],
            [['bist', 'bin', 'ist'], 'a', 'verb', 'du bist'],
            [['Besuch', 'Besserung', 'Reise'], 'b', 'wort', 'Gute Besserung!'],
            [['mit', 'für', 'von'], 'b', 'prep', 'für dich'],
            [['Wer', 'Wo', 'Was'], 'c', 'frage', 'Was brauchst du?'],
            [['Ich komme morgen nach der Arbeit.', 'Ich komme aus Berlin.', 'Ich komme mit dem Bus zur Arbeit.'], 'a', 'content', 'Ich komme morgen nach der Arbeit.', 3],
            [['bringen', 'bringe', 'bringst'], 'b', 'verb', 'ich bringe'],
            [['Hat', 'Habt', 'Hast'], 'c', 'verb', 'Hast du'],
            [['mir', 'mich', 'ich'], 'a', 'dat', 'Schreib mir'],
            [['Mit freundlichen Grüße', 'Liebe Grüße', 'Liebe Gruß'], 'b', 'gruss', 'Liebe Grüße'],
        ]
    },
});
