"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Schreiben 10: a staff form for a new job (form); a jacket left in the classroom (message). */
exports.exam = (0, a1_exam_build_1.buildSchreiben)(10, 'Personalbogen · Etwas im Kurs vergessen', {
    teil1: {
        text: 'Ihr Freund Nikos Papadakis beginnt am 1. September eine neue Arbeit in der Autowerkstatt „Nordstern“. Er kommt aus Griechenland und ist neu in Berlin. Nikos ist Mechatroniker von Beruf. Er ist ledig und hat keine Kinder. Er spricht Griechisch, Englisch und ein bisschen Deutsch.',
        form: 'Autowerkstatt Nordstern – Personalbogen',
        rows: [['Familienname', 'Papadakis'], ['Vorname', 'Nikos'], ['Heimatland', '{1}'], ['Wohnort', 'Berlin'], ['Beruf', '{2}'], ['Kinder', '{3}'], ['Sprachen', '{4}'], ['Arbeitsbeginn', '{5}']],
        gaps: [
            [['Berlin', 'Griechisch', 'Griechenland'], 'c', 'text', 'Er kommt aus Griechenland'],
            [['Verkäufer', 'Mechatroniker', 'Autowerkstatt'], 'b', 'text', 'Nikos ist Mechatroniker von Beruf'],
            [['keine', '1', '2'], 'a', 'text', 'hat keine Kinder'],
            [['Griechisch, Englisch, Deutsch', 'Griechisch, Deutsch', 'Englisch, Deutsch'], 'a', 'text', 'Er spricht Griechisch, Englisch und ein bisschen Deutsch'],
            [['1. März', '9. September', '1. September'], 'c', 'text', 'am 1. September'],
        ]
    },
    teil2: {
        task: 'Sie haben gestern Ihre Jacke im Kursraum vergessen. Schreiben Sie an die Sprachschule Lingua:',
        points: ['Was haben Sie vergessen?', 'Wo?', 'Wann können Sie kommen?'],
        lines: [
            '{6},',
            'ich {7} gestern meine Jacke vergessen.',
            'Die Jacke ist blau und {8} im Raum 12.',
            '{9} Sie die Jacke gefunden?',
            '{10}',
            'Ist das Büro {11} 17 Uhr {12} offen?',
            'Ich brauche {13} Jacke. Es ist {14} kalt.',
            '{15}',
            '(Ihr Name)'
        ],
        gaps: [
            [['Liebe Schule', 'Sehr geehrte Damen und Herren', 'Hallo Lingua'], 'b', 'anredeFormal', 'Sehr geehrte Damen und Herren'],
            [['habe', 'bin', 'hat'], 'a', 'perfekt', 'ich habe … vergessen'],
            [['liegen', 'liegst', 'liegt'], 'c', 'verb', 'die Jacke liegt'],
            [['Hast', 'Haben', 'Habt'], 'b', 'register', 'Haben Sie'],
            [['Ich kann morgen um 17 Uhr kommen.', 'Ich komme aus der Türkei.', 'Ich kann gut Deutsch sprechen.'], 'a', 'content', 'Ich kann morgen um 17 Uhr kommen.', 3],
            [['am', 'um', 'im'], 'b', 'zeit', 'um 17 Uhr'],
            [['kein', 'nichts', 'noch'], 'c', 'wort', 'noch offen'],
            [['mein', 'meinen', 'meine'], 'c', 'poss', 'meine Jacke'],
            [['sehr', 'viele', 'gern'], 'a', 'wort', 'sehr kalt'],
            [['Bis bald, dein Freund', 'Mit freundlichen Grüßen', 'Viele Küsse'], 'b', 'grussFormal', 'Mit freundlichen Grüßen'],
        ]
    },
});
