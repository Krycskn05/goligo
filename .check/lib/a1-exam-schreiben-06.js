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
            [['Jacke', 'Tasche', 'Handy'], 'b', 'text', 'ihre Tasche verloren'],
            [['groß', 'blau', 'schwarz'], 'c', 'text', 'Die Tasche ist schwarz'],
            [['im Bus 21', 'im Büro', 'im Zug'], 'a', 'text', 'mit dem Bus 21'],
            [['Sonntag', 'Mittwoch', 'Montag'], 'c', 'text', 'am Montag'],
            [['21 Uhr', '8 Uhr', '18 Uhr'], 'b', 'text', 'um 8 Uhr'],
        ]
    },
    teil2: {
        task: 'Sie kommen heute später zur Arbeit. Schreiben Sie an Ihren Chef, Herrn Winter:',
        points: ['Warum kommen Sie später?', 'Wann kommen Sie?', 'Entschuldigen Sie sich.'],
        lines: [
            '{6} Herr Winter,',
            'ich komme heute leider {7}.',
            'Mein Bus {8} nicht. Ich {9} ein Taxi nehmen.',
            'Ich bin {10} 9 Uhr im Büro.',
            '{11}',
            'Heute Abend {12} ich eine Stunde länger.',
            'Ist {13} in Ordnung? Bis {14}!',
            '{15}',
            '(Ihr Name)'
        ],
        gaps: [
            [['Sehr geehrter', 'Sehr geehrte', 'Liebe'], 'a', 'anredeHerr', 'Sehr geehrter Herr Winter'],
            [['früher', 'später', 'gestern'], 'b', 'wort', 'ich komme heute leider später'],
            [['fahre', 'fahren', 'fährt'], 'c', 'verb', 'mein Bus fährt'],
            [['muss', 'musst', 'müssen'], 'a', 'modal', 'Ich muss ein Taxi nehmen'],
            [['am', 'im', 'um'], 'c', 'zeit', 'um 9 Uhr'],
            [['Es geht mir gut.', 'Es tut mir leid.', 'Es ist sehr schön.'], 'b', 'content', 'Es tut mir leid.', 3],
            [['arbeite', 'arbeiten', 'arbeitest'], 'a', 'verb', 'arbeite ich'],
            [['das', 'der', 'den'], 'a', 'wort', 'Ist das in Ordnung?'],
            [['gestern', 'Jahr', 'gleich'], 'c', 'wort', 'Bis gleich!'],
            [['Viele Küsse', 'Mit freundlichen Grüßen', 'Guten Appetit'], 'b', 'grussFormal', 'Mit freundlichen Grüßen'],
        ]
    },
});
