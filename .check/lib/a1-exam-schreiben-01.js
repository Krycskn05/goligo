"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exam = void 0;
const a1_exam_build_1 = require("./a1-exam-build");
/** A1 sınavı · Schreiben 1: a place in the kindergarten (form); inviting the neighbour to a party (message). */
exports.exam = (0, a1_exam_build_1.buildSchreiben)(1, 'Kindergarten-Anmeldung · Einladung an die Nachbarin', {
    teil1: {
        text: 'Ihr Kollege Tomasz Nowak sucht für seine Tochter Zofia einen Platz im Kindergarten „Sonnenschein“. Zofia ist drei Jahre alt, ihr Bruder Jan ist sechs. Die Familie wohnt in Hamburg, in der Gartenstraße 12. Tomasz arbeitet als Kellner. Zofia soll ab dem 1. Februar in den Kindergarten gehen, jeden Tag von 8 bis 14 Uhr.',
        form: 'Anmeldung – Kindergarten Sonnenschein',
        rows: [['Name des Kindes', 'Zofia Nowak'], ['Alter', '{1}'], ['Name des Vaters', 'Tomasz Nowak'], ['Beruf des Vaters', '{2}'], ['Straße, Hausnummer', '{3}'], ['PLZ, Wohnort', '20359 {4}'], ['Beginn', 'ab {5}'], ['Zeit', '8–14 Uhr']],
        gaps: [
            [['3 Jahre', '6 Jahre', '8 Jahre'], 'a', 'text', 'Zofia ist drei Jahre alt'],
            [['Koch', 'Lehrer', 'Kellner'], 'c', 'text', 'Tomasz arbeitet als Kellner'],
            [['Hamburger Straße 12', 'Gartenstraße 12', 'Gartenstraße 14'], 'b', 'text', 'in der Gartenstraße 12'],
            [['Hamburg', 'Krakau', 'Berlin'], 'a', 'text', 'Die Familie wohnt in Hamburg'],
            [['1. Januar', '8. Februar', '1. Februar'], 'c', 'text', 'ab dem 1. Februar'],
        ]
    },
    teil2: {
        task: 'Sie sind neu im Haus und machen am Samstag eine kleine Party. Schreiben Sie an Ihre Nachbarin, Frau Berger:',
        points: ['Wer sind Sie?', 'Wann ist die Party?', 'Laden Sie Frau Berger ein.'],
        lines: [
            '{6} Frau Berger,',
            'ich {7} neu im Haus und wohne {8} zweiten Stock.',
            '{9} Samstag mache ich eine kleine Party. Die Party beginnt {10} 19 Uhr.',
            '{11} Ich {12} Sie herzlich {13}.',
            '{14} Sie Zeit?',
            '{15}',
            '(Ihr Name)'
        ],
        gaps: [
            [['Lieber', 'Liebe', 'Liebes'], 'b', 'anredeFrau', 'Liebe Frau Berger'],
            [['bin', 'bist', 'ist'], 'a', 'verb', 'ich bin'],
            [['am', 'in', 'im'], 'c', 'prep', 'im zweiten Stock'],
            [['Um', 'Im', 'Am'], 'c', 'zeit', 'Am Samstag'],
            [['um', 'am', 'im'], 'a', 'zeit', 'um 19 Uhr'],
            [['Wo wohnen Sie?', 'Kommen Sie auch?', 'Wie heißen Sie?'], 'b', 'content', 'Kommen Sie auch?', 3],
            [['laden', 'lade', 'ladet'], 'b', 'verb', 'ich lade'],
            [['ein', 'an', 'auf'], 'a', 'trennbar', 'Ich lade Sie herzlich ein'],
            [['Hast', 'Habt', 'Haben'], 'c', 'register', 'Haben Sie Zeit?'],
            [['Viele Gruß', 'Viele Grüße', 'Viel Grüße'], 'b', 'gruss', 'Viele Grüße'],
        ]
    },
});
