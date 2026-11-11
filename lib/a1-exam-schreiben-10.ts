import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 10: a staff form for a new job (form); a jacket left in the classroom (message). */
export const exam=buildSchreiben(10,'Personalbogen · Etwas im Kurs vergessen',{
 teil1:{
  text:'Ihr Freund Nikos Papadakis beginnt am 1. September eine neue Arbeit in der Autowerkstatt „Nordstern“. Er kommt aus Griechenland und ist neu in Berlin. Nikos ist Mechatroniker von Beruf. Er ist ledig und hat keine Kinder. Er spricht Griechisch, Englisch und ein bisschen Deutsch.',
  form:'Autowerkstatt Nordstern – Personalbogen',
  rows:[['Familienname','Papadakis'],['Vorname','Nikos'],['Heimatland','{1}'],['Wohnort','Berlin'],['Beruf','{2}'],['Kinder','{3}'],['Sprachen','{4}'],['Arbeitsbeginn','{5}']],
  gaps:[
   [['Griechenland'],'text','Er kommt aus Griechenland'],
   [['Mechatroniker'],'text','Nikos ist Mechatroniker von Beruf'],
   [['keine','0','null','kein','keine Kinder','nein'],'text','hat keine Kinder'],
   [['Griechisch, Englisch, Deutsch','Griechisch, Englisch und Deutsch','Griechisch, Englisch und ein bisschen Deutsch','Griechisch, Englisch, ein bisschen Deutsch','Griechisch, Deutsch, Englisch','Englisch, Griechisch, Deutsch','Deutsch, Englisch, Griechisch','Deutsch, Griechisch, Englisch','Englisch, Deutsch, Griechisch','Griechisch, Deutsch und Englisch','Griechisch und Englisch und Deutsch'],'text','Er spricht Griechisch, Englisch und ein bisschen Deutsch'],
   [['1. September','01.09.','am 1. September','ab 1. September','ab dem 1. September','ersten September'],'text','am 1. September'],
  ]},
 teil2:{
  task:'Sie haben gestern Ihre Jacke im Kursraum vergessen. Schreiben Sie an die Sprachschule Lingua:',
  points:['Was haben Sie vergessen?','Wo?','Wann können Sie kommen?'],
  model:[
   'Sehr geehrte Damen und Herren,',
   'ich habe gestern meine Jacke vergessen.',
   'Die Jacke ist blau und liegt im Raum 12.',
   'Haben Sie die Jacke gefunden?',
   'Ich kann morgen um 17 Uhr kommen.',
   'Ist das Büro um 17 Uhr noch offen?',
   'Ich brauche meine Jacke. Es ist sehr kalt.',
   'Mit freundlichen Grüßen',
   '(Ihr Name)',
  ]},
});
