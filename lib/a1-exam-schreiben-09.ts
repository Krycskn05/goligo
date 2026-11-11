import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 9: booking a coach trip to Potsdam (form); asking a cooking school about a course (message). */
export const exam=buildSchreiben(9,'Busfahrt buchen · Frage nach einem Kochkurs',{
 teil1:{
  text:'Ihre Freundin Yasemin Arslan und ihr Mann Can möchten am Samstag, 12. Juli, eine Busfahrt nach Potsdam machen. Sie haben keine Kinder. Der Bus fährt um 9 Uhr in Berlin ab und ist um 18 Uhr wieder da. Die Fahrt kostet 25 Euro pro Person. Yasemin bezahlt bar im Reisebüro.',
  form:'Reisebüro Weltweit – Busfahrt',
  rows:[['Name','Yasemin Arslan'],['Reiseziel','{1}'],['Reisetag','{2}'],['Abfahrt','{3}'],['Erwachsene','{4}'],['Kinder','{5}'],['Zahlungsweise','bar']],
  gaps:[
   [['Potsdam','nach Potsdam'],'text','eine Busfahrt nach Potsdam'],
   [['12. Juli','12.07.','Samstag, 12. Juli','Sa., 12. Juli','am 12. Juli','am Samstag, 12. Juli'],'text','am Samstag, 12. Juli'],
   [['9 Uhr','9','9.00 Uhr','9:00 Uhr','9:00','um 9 Uhr','neun Uhr','9.00'],'text','Der Bus fährt um 9 Uhr in Berlin ab'],
   [['2','zwei','2 Erwachsene','zwei Erwachsene'],'infer','Yasemin Arslan und ihr Mann Can'],
   [['0','keine','null','kein','keine Kinder','nein'],'infer','Sie haben keine Kinder'],
  ]},
 teil2:{
  task:'Sie möchten einen Kochkurs machen. Schreiben Sie an die Kochschule „Olive“:',
  points:['Warum schreiben Sie?','Wann ist der Kurs?','Was kostet der Kurs?'],
  model:[
   'Sehr geehrte Damen und Herren,',
   'ich möchte gern kochen lernen. Haben Sie einen Kurs für Anfänger?',
   'Wann beginnt der Kurs? Ich habe nur am Abend Zeit.',
   'Wie viel kostet der Kurs?',
   'Kann ich mit Karte bezahlen?',
   'Bitte schreiben Sie mir eine E-Mail. Ich warte auf Ihre Antwort.',
   'Mit freundlichen Grüßen',
   '(Ihr Name)',
  ]},
});
