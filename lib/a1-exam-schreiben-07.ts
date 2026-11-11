import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 7: a library card (form); the pullover that came is too small — a message to the shop. */
export const exam=buildSchreiben(7,'Bibliotheksausweis · Problem mit einer Bestellung',{
 teil1:{
  text:'Ihre Nachbarin Lena Brandt möchte einen Ausweis für die Stadtbibliothek. Sie ist am 5. Mai 1990 geboren und arbeitet als Lehrerin. Lena wohnt in Berlin, im Uferweg 3. Ein Ausweis für Erwachsene kostet 10 Euro im Jahr, für Studenten 5 Euro. Kinder bezahlen nichts.',
  form:'Stadtbibliothek – Anmeldung',
  rows:[['Familienname','{1}'],['Vorname','Lena'],['Geburtsdatum','{2}'],['Beruf','{3}'],['Straße, Hausnummer','Uferweg 3'],['Ort','Berlin'],['Ausweis für','{4}'],['Preis im Jahr','{5}']],
  gaps:[
   [['Brandt'],'text','Lena Brandt'],
   [['05.05.1990','5. Mai 1990','05.05.90','5. 5. 1990'],'text','am 5. Mai 1990'],
   [['Lehrerin'],'text','arbeitet als Lehrerin'],
   [['Erwachsene','Erwachsener','Erwachsenen','eine Erwachsene'],'infer','arbeitet als Lehrerin'],
   [['10 Euro','10','10 €','zehn Euro','10 EUR','10,00 Euro'],'text','Ein Ausweis für Erwachsene kostet 10 Euro im Jahr'],
  ]},
 teil2:{
  task:'Sie haben im Internet einen Pullover bestellt. Der Pullover ist zu klein. Schreiben Sie an die Firma „Modehaus Kanal“:',
  points:['Was haben Sie bestellt?','Was ist das Problem?','Was möchten Sie?'],
  model:[
   'Sehr geehrte Damen und Herren,',
   'ich habe bei Ihnen einen Pullover bestellt.',
   'Der Pullover ist heute gekommen. Aber er ist zu klein.',
   'Ich brauche einen Pullover in Größe L.',
   'Können Sie mir einen neuen Pullover schicken?',
   'Ich schicke den kleinen Pullover zurück.',
   'Vielen Dank für Ihre Hilfe!',
   'Mit freundlichen Grüßen',
   '(Ihr Name)',
  ]},
});
