import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 7: a library card (form); the pullover that came is too small — a message to the shop. */
export const exam=buildSchreiben(7,'Bibliotheksausweis · Problem mit einer Bestellung',{
 teil1:{
  text:'Ihre Nachbarin Lena Brandt möchte einen Ausweis für die Stadtbibliothek. Sie ist am 5. Mai 1990 geboren und arbeitet als Lehrerin. Lena wohnt in Berlin, im Uferweg 3. Ein Ausweis für Erwachsene kostet 10 Euro im Jahr, für Studenten 5 Euro. Kinder bezahlen nichts.',
  form:'Stadtbibliothek – Anmeldung',
  rows:[['Familienname','{1}'],['Vorname','Lena'],['Geburtsdatum','{2}'],['Beruf','{3}'],['Straße, Hausnummer','Uferweg 3'],['Ort','Berlin'],['Ausweis für','{4}'],['Preis im Jahr','{5}']],
  gaps:[
   [['Brandt','Lena','Berlin'],'a','text','Lena Brandt'],
   [['05.03.1990','05.05.1990','10.05.1990'],'b','text','am 5. Mai 1990'],
   [['Lehrerin','Studentin','Kellnerin'],'a','text','arbeitet als Lehrerin'],
   [['Kinder','Studenten','Erwachsene'],'c','infer','arbeitet als Lehrerin'],
   [['5 Euro','nichts','10 Euro'],'c','text','Ein Ausweis für Erwachsene kostet 10 Euro im Jahr'],
  ]},
 teil2:{
  task:'Sie haben im Internet einen Pullover bestellt. Der Pullover ist zu klein. Schreiben Sie an die Firma „Modehaus Kanal“:',
  points:['Was haben Sie bestellt?','Was ist das Problem?','Was möchten Sie?'],
  lines:[
   '{6},',
   'ich {7} bei Ihnen einen Pullover bestellt.',
   'Der Pullover ist heute {8}. Aber er ist {9} klein.',
   'Ich brauche {10} Pullover {11} Größe L.',
   '{12}',
   'Ich {13} den kleinen Pullover zurück.',
   'Vielen Dank für {14} Hilfe!',
   '{15}',
   '(Ihr Name)'],
  gaps:[
   [['Hallo Firma','Sehr geehrte Damen und Herren','Liebe Leute'],'b','anredeFormal','Sehr geehrte Damen und Herren'],
   [['bin','hat','habe'],'c','perfekt','ich habe … bestellt'],
   [['gekommen','kommen','kommt'],'a','perfekt','ist heute gekommen'],
   [['zum','zu','zur'],'b','wort','zu klein'],
   [['einen','ein','eine'],'a','akk','einen Pullover'],
   [['an','auf','in'],'c','prep','in Größe L'],
   [['Wo ist Ihr Geschäft?','Können Sie mir einen neuen Pullover schicken?','Können Sie mir ein Taxi rufen?'],'b','content','Können Sie mir einen neuen Pullover schicken?',3],
   [['schickst','schicken','schicke'],'c','verb','ich schicke'],
   [['Ihre','Ihr','deine'],'a','register','Ihre Hilfe'],
   [['Bis morgen','Mit freundlichen Grüßen','Liebe Küsse'],'b','grussFormal','Mit freundlichen Grüßen'],
  ]},
});
