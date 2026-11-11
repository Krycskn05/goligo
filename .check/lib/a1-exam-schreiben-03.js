"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Schreiben 3: joining a sports club (form); asking the tourist office about Hamburg (message). */
exports.exam = (0, a1_exam_build_1.buildSchreiben)(3, 'Anmeldung im Sportverein · Brief an die Touristeninformation', {
    teil1: {
        text: 'Ihr Freund Omar Nasser möchte im Sportverein „TSV Nord“ Sport machen. Der Verein hat Tennis, Basketball und Fußball. Omar spielt gern Fußball. Er arbeitet als Verkäufer und wohnt in Berlin. Er hat nur am Dienstag und am Donnerstag Zeit. Der Verein kostet 15 Euro im Monat.',
        form: 'Anmeldung – TSV Nord',
        rows: [['Familienname', '{1}'], ['Vorname', 'Omar'], ['Geschlecht', '{2}'], ['Beruf', '{3}'], ['Wohnort', 'Berlin'], ['Sportart', '{4}'], ['Trainingstage', '{5}'], ['Beitrag', '15 Euro im Monat']],
        gaps: [
            [['Omar', 'Nord', 'Nasser'], 'c', 'text', 'Omar Nasser'],
            [['weiblich', 'männlich', 'divers'], 'b', 'infer', 'Ihr Freund Omar Nasser'],
            [['Verkäufer', 'Kellner', 'Lehrer'], 'a', 'text', 'Er arbeitet als Verkäufer'],
            [['Tennis', 'Basketball', 'Fußball'], 'c', 'text', 'Omar spielt gern Fußball'],
            [['Montag und Mittwoch', 'Dienstag und Donnerstag', 'Dienstag und Samstag'], 'b', 'text', 'am Dienstag und am Donnerstag'],
        ]
    },
    teil2: {
        task: 'Sie möchten im Juli eine Woche in Hamburg Urlaub machen. Schreiben Sie an die Touristeninformation:',
        points: ['Warum schreiben Sie?', 'Informationen über den Hafen und Museen?', 'Hoteladressen?'],
        lines: [
            '{6} Damen und Herren,',
            'im Juli {7} ich eine Woche nach Hamburg.',
            '{8} Sie mir Informationen {9} den Hafen und die Museen schicken?',
            'Ich {10} auch ein Hotel. {11}',
            'Ich habe nicht viel Geld. Das Hotel soll nicht {12} sein.',
            'Ich {13} mich {14} Ihre Antwort.',
            '{15}',
            '(Ihr Name)'
        ],
        gaps: [
            [['Sehr geehrte', 'Sehr geehrter', 'Lieber'], 'a', 'anredeFormal', 'Sehr geehrte Damen und Herren'],
            [['fährt', 'fahren', 'fahre'], 'c', 'verb', 'fahre ich'],
            [['Kannst', 'Können', 'Könnt'], 'b', 'register', 'Können Sie'],
            [['über', 'auf', 'mit'], 'a', 'prep', 'Informationen über den Hafen'],
            [['sucht', 'suche', 'suchen'], 'b', 'verb', 'ich suche'],
            [['Haben Sie Kinder?', 'Haben Sie ein Auto?', 'Haben Sie Adressen von Hotels?'], 'c', 'content', 'Haben Sie Adressen von Hotels?', 3],
            [['teuer', 'billig', 'klein'], 'a', 'wort', 'nicht teuer'],
            [['freut', 'freust', 'freue'], 'c', 'verb', 'ich freue mich'],
            [['für', 'auf', 'mit'], 'b', 'prep', 'Ich freue mich auf Ihre Antwort'],
            [['Mit freundlichen Grüßen', 'Mit freundlichen Gruß', 'Mit freundliche Grüße'], 'a', 'grussFormal', 'Mit freundlichen Grüßen'],
        ]
    },
});
