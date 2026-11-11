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
            [['Nasser'], 'text', 'Omar Nasser'],
            [['männlich', 'm', 'Mann', 'männl.'], 'infer', 'Ihr Freund Omar Nasser'],
            [['Verkäufer'], 'text', 'Er arbeitet als Verkäufer'],
            [['Fußball'], 'text', 'Omar spielt gern Fußball'],
            [['Dienstag und Donnerstag', 'Dienstag, Donnerstag', 'Di und Do', 'Di, Do', 'Donnerstag und Dienstag', 'am Dienstag und am Donnerstag', 'Dienstag und am Donnerstag'], 'text', 'am Dienstag und am Donnerstag'],
        ]
    },
    teil2: {
        task: 'Sie möchten im Juli eine Woche in Hamburg Urlaub machen. Schreiben Sie an die Touristeninformation:',
        points: ['Warum schreiben Sie?', 'Informationen über den Hafen und Museen?', 'Hoteladressen?'],
        model: [
            'Sehr geehrte Damen und Herren,',
            'im Juli fahre ich eine Woche nach Hamburg.',
            'Können Sie mir Informationen über den Hafen und die Museen schicken?',
            'Ich suche auch ein Hotel. Haben Sie Adressen von Hotels?',
            'Ich habe nicht viel Geld. Das Hotel soll nicht teuer sein.',
            'Ich freue mich auf Ihre Antwort.',
            'Mit freundlichen Grüßen',
            '(Ihr Name)',
        ]
    },
});
