import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 9: booking a coach trip to Potsdam (form); asking a cooking school about a course (message). */
export const exam=buildSchreiben(9,'Busfahrt buchen · Frage nach einem Kochkurs',{
 teil1:{
  text:'Ihre Freundin Yasemin Arslan und ihr Mann Can möchten am Samstag, 12. Juli, eine Busfahrt nach Potsdam machen. Sie haben keine Kinder. Der Bus fährt um 9 Uhr in Berlin ab und ist um 18 Uhr wieder da. Die Fahrt kostet 25 Euro pro Person. Yasemin bezahlt bar im Reisebüro.',
  form:'Reisebüro Weltweit – Busfahrt',
  rows:[['Name','Yasemin Arslan'],['Reiseziel','{1}'],['Reisetag','{2}'],['Abfahrt','{3}'],['Erwachsene','{4}'],['Kinder','{5}'],['Zahlungsweise','bar']],
  gaps:[
   [['Berlin','Potsdam','Hamburg'],'b','text','eine Busfahrt nach Potsdam'],
   [['12. Juli','12. Juni','25. Juli'],'a','text','am Samstag, 12. Juli'],
   [['18 Uhr','9 Uhr','12 Uhr'],'b','text','Der Bus fährt um 9 Uhr in Berlin ab'],
   [['1','3','2'],'c','infer','Yasemin Arslan und ihr Mann Can'],
   [['0','1','2'],'a','infer','Sie haben keine Kinder'],
  ]},
 teil2:{
  task:'Sie möchten einen Kochkurs machen. Schreiben Sie an die Kochschule „Olive“:',
  points:['Warum schreiben Sie?','Wann ist der Kurs?','Was kostet der Kurs?'],
  lines:[
   '{6} Damen und Herren,',
   'ich {7} gern kochen lernen. {8} Sie einen Kurs für Anfänger?',
   '{9} beginnt der Kurs? Ich habe nur {10} Abend Zeit.',
   '{11}',
   'Kann ich {12} Karte bezahlen?',
   'Bitte {13} Sie mir eine E-Mail. Ich warte {14} Ihre Antwort.',
   '{15}',
   '(Ihr Name)'],
  gaps:[
   [['Sehr geehrte','Sehr geehrten','Liebe geehrte'],'a','anredeFormal','Sehr geehrte Damen und Herren'],
   [['möchtest','möchten','möchte'],'c','modal','ich möchte gern kochen lernen'],
   [['Hast','Haben','Habt'],'b','register','Haben Sie'],
   [['Was','Wer','Wann'],'c','frage','Wann beginnt der Kurs?'],
   [['am','um','im'],'a','zeit','am Abend'],
   [['Wie alt ist der Lehrer?','Wie viel kostet der Kurs?','Wie heißt die Straße?'],'b','content','Wie viel kostet der Kurs?',3],
   [['für','bei','mit'],'c','prep','mit Karte'],
   [['schreiben','schreibst','schreibt'],'a','register','schreiben Sie mir'],
   [['für','zu','auf'],'c','prep','Ich warte auf Ihre Antwort'],
   [['Tschüs und bis bald','Mit freundlichen Grüßen','Mit freundlichem Grüße'],'b','grussFormal','Mit freundlichen Grüßen'],
  ]},
});
