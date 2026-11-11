"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Schreiben 2: a hotel room for three nights (form); moving a doctor's appointment (message). */
exports.exam = (0, a1_exam_build_1.buildSchreiben)(2, 'Hotel-Reservierung · Arzttermin absagen', {
    teil1: {
        text: 'Ihre Freundin Mei Suwan fährt im Mai nach München. Sie fährt allein und bleibt drei Nächte. Sie kommt am 14. Mai an und fährt am 17. Mai zurück. Mei möchte im Hotel „Am Park“ ein Zimmer mit Frühstück reservieren. Ein Einzelzimmer kostet 65 Euro, ein Doppelzimmer 90 Euro. Mei hat keine Kreditkarte, sie bezahlt bar.',
        form: 'Reservierung – Hotel Am Park',
        rows: [['Familienname', 'Suwan'], ['Vorname', 'Mei'], ['Ankunft am', '{1}'], ['Anzahl der Nächte', '{2}'], ['Anzahl der Personen', '{3}'], ['Zimmer', '{4}'], ['Frühstück', 'ja'], ['Zahlungsweise', '{5}']],
        gaps: [
            [['14. Mai', '14.05.', 'am 14. Mai', '14. Mai 2027'], 'text', 'Sie kommt am 14. Mai an'],
            [['3', 'drei', '3 Nächte', 'drei Nächte'], 'text', 'bleibt drei Nächte'],
            [['1', 'eine', 'eins', '1 Person', 'eine Person'], 'infer', 'Sie fährt allein'],
            [['Einzelzimmer', 'ein Einzelzimmer', 'EZ'], 'infer', 'Sie fährt allein'],
            [['bar', 'in bar', 'Bargeld'], 'text', 'sie bezahlt bar'],
        ]
    },
    teil2: {
        task: 'Sie haben am Mittwoch um 10 Uhr einen Termin bei Doktor Engel. Sie können aber nicht kommen. Schreiben Sie an die Praxis:',
        points: ['Warum schreiben Sie?', 'Warum können Sie nicht kommen?', 'Neuer Termin: wann?'],
        model: [
            'Sehr geehrte Damen und Herren,',
            'ich habe am Mittwoch um 10 Uhr einen Termin bei Doktor Engel.',
            'Leider kann ich nicht kommen. Ich muss arbeiten.',
            'Kann ich am Freitag kommen? Ich habe am Vormittag Zeit.',
            'Bitte antworten Sie mir. Vielen Dank für Ihre Hilfe!',
            'Mit freundlichen Grüßen',
            '(Ihr Name)',
        ]
    },
});
