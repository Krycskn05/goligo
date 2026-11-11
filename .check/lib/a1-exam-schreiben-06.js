"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Schreiben 6: a lost bag at the lost-property office (form); telling the boss you will be late (message). */
exports.exam = (0, a1_exam_build_1.buildSchreiben)(6, 'Fundbüro · Nachricht an den Chef', {
    teil1: {
        text: 'Ihre Freundin Aisha Kamau hat am Montag im Bus ihre Tasche verloren. Sie ist um 8 Uhr mit dem Bus 21 zur Arbeit gefahren. Die Tasche ist schwarz und nicht sehr groß. Ihre Jacke hat sie noch. Jetzt geht Aisha zum Fundbüro.',
        form: 'Fundbüro – Was haben Sie verloren?',
        rows: [['Name', 'Aisha Kamau'], ['Was?', '{1}'], ['Farbe', '{2}'], ['Wo?', '{3}'], ['Tag', '{4}'], ['Uhrzeit', '{5}'], ['Telefon', '0176 / 040690 16']],
        gaps: [
            [['Tasche', 'eine Tasche', 'die Tasche', 'ihre Tasche', 'meine Tasche'], 'text', 'ihre Tasche verloren'],
            [['schwarz'], 'text', 'Die Tasche ist schwarz'],
            [['im Bus 21', 'Bus 21', 'im Bus', 'Bus', 'im Bus Nr. 21', 'im Bus Nummer 21', 'Bus Nr. 21'], 'text', 'mit dem Bus 21'],
            [['Montag', 'am Montag', 'Mo'], 'text', 'am Montag'],
            [['8 Uhr', '8', '8.00 Uhr', '8:00 Uhr', '8:00', 'um 8 Uhr', 'acht Uhr', '8.00'], 'text', 'um 8 Uhr'],
        ]
    },
    teil2: {
        task: 'Sie kommen heute später zur Arbeit. Schreiben Sie an Ihren Chef, Herrn Winter:',
        points: ['Warum kommen Sie später?', 'Wann kommen Sie?', 'Entschuldigen Sie sich.'],
        model: [
            'Sehr geehrter Herr Winter,',
            'ich komme heute leider später.',
            'Mein Bus fährt nicht. Ich muss ein Taxi nehmen.',
            'Ich bin um 9 Uhr im Büro.',
            'Es tut mir leid.',
            'Heute Abend arbeite ich eine Stunde länger.',
            'Ist das in Ordnung? Bis gleich!',
            'Mit freundlichen Grüßen',
            '(Ihr Name)',
        ]
    },
});
