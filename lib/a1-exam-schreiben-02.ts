import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 2: a hotel room for three nights (form); moving a doctor's appointment (message). */
export const exam=buildSchreiben(2,'Hotel-Reservierung · Arzttermin absagen',{
 teil1:{
  text:'Ihre Freundin Mei Suwan fährt im Mai nach München. Sie fährt allein und bleibt drei Nächte. Sie kommt am 14. Mai an und fährt am 17. Mai zurück. Mei möchte im Hotel „Am Park“ ein Zimmer mit Frühstück reservieren. Ein Einzelzimmer kostet 65 Euro, ein Doppelzimmer 90 Euro. Mei hat keine Kreditkarte, sie bezahlt bar.',
  form:'Reservierung – Hotel Am Park',
  rows:[['Familienname','Suwan'],['Vorname','Mei'],['Ankunft am','{1}'],['Anzahl der Nächte','{2}'],['Anzahl der Personen','{3}'],['Zimmer','{4}'],['Frühstück','ja'],['Zahlungsweise','{5}']],
  gaps:[
   [['17. Mai','14. Mai','3. Mai'],'b','text','Sie kommt am 14. Mai an'],
   [['3','14','17'],'a','text','bleibt drei Nächte'],
   [['3','2','1'],'c','infer','Sie fährt allein'],
   [['Doppelzimmer','Einzelzimmer','Dreibettzimmer'],'b','infer','Sie fährt allein'],
   [['bar','Kreditkarte','Rechnung'],'a','text','sie bezahlt bar'],
  ]},
 teil2:{
  task:'Sie haben am Mittwoch um 10 Uhr einen Termin bei Doktor Engel. Sie können aber nicht kommen. Schreiben Sie an die Praxis:',
  points:['Warum schreiben Sie?','Warum können Sie nicht kommen?','Neuer Termin: wann?'],
  lines:[
   '{6},',
   'ich habe am Mittwoch {7} 10 Uhr {8} Termin bei Doktor Engel.',
   'Leider {9} ich nicht kommen. {10}',
   '{11} ich am Freitag kommen? Ich habe {12} Vormittag Zeit.',
   'Bitte {13} Sie mir. Vielen Dank {14} Ihre Hilfe!',
   '{15}',
   '(Ihr Name)'],
  gaps:[
   [['Liebe Praxis','Hallo Doktor','Sehr geehrte Damen und Herren'],'c','anredeFormal','Sehr geehrte Damen und Herren'],
   [['am','um','im'],'b','zeit','um 10 Uhr'],
   [['einen','ein','eine'],'a','akk','einen Termin'],
   [['kann','kannst','können'],'a','verb','ich kann'],
   [['Ich komme gern.','Ich habe Zeit.','Ich muss arbeiten.'],'c','content','Ich muss arbeiten.',2],
   [['Kannst','Kann','Könnt'],'b','verb','Kann ich'],
   [['um','im','am'],'c','zeit','am Vormittag'],
   [['antworten','antwortest','antwortet'],'a','register','antworten Sie mir'],
   [['von','für','mit'],'b','prep','Vielen Dank für Ihre Hilfe'],
   [['Tschüs','Viele Küsse','Mit freundlichen Grüßen'],'c','grussFormal','Mit freundlichen Grüßen'],
  ]},
});
