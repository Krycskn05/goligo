import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 5: a new patient's form at the doctor's; thanking a friend for an invitation (message). */
export const exam=buildSchreiben(5,'Formular beim Arzt · Dank für eine Einladung',{
 teil1:{
  text:'Ihr Freund Rami Khalil geht zum ersten Mal zu Frau Doktor Engel. Rami ist am 12. März 1988 in Beirut geboren und wohnt jetzt in Berlin, in der Kastanienallee 25. Er ist verheiratet und hat zwei Kinder: Lina ist acht und Sami fünf Jahre alt. Seine Telefonnummer ist 030 / 23125 417.',
  form:'Praxis Dr. Engel – neue Patienten',
  rows:[['Familienname','Khalil'],['Vorname','Rami'],['Geburtsdatum','{1}'],['Geburtsort','{2}'],['Familienstand','{3}'],['Zahl der Kinder','{4}'],['Adresse','Kastanienallee 25, 10435 Berlin'],['Telefon','{5}']],
  gaps:[
   [['03.12.1988','12.05.1988','12.03.1988'],'c','text','am 12. März 1988'],
   [['Beirut','Berlin','Libanon'],'a','text','in Beirut geboren'],
   [['ledig','verheiratet','geschieden'],'b','text','Er ist verheiratet'],
   [['5','2','8'],'b','text','hat zwei Kinder'],
   [['030 / 23125 417','030 / 23125 471','030 / 23125 714'],'a','text','030 / 23125 417'],
  ]},
 teil2:{
  task:'Ihre Freundin Nora hat Sie für Sonntag zum Essen eingeladen. Schreiben Sie Nora:',
  points:['Danke für die Einladung','Was bringen Sie mit?','Um wie viel Uhr sollen Sie kommen?'],
  lines:[
   '{6} Nora,',
   'vielen Dank {7} die Einladung!',
   'Ich {8} sehr gern {9} Sonntag.',
   'Ich {10} einen Kuchen {11}.',
   '{12}',
   'Ich freue {13}! {14} bald!',
   '{15}',
   '(Ihr Name)'],
  gaps:[
   [['Lieber','Liebe','Sehr geehrte'],'b','anredeFreund','Liebe Nora'],
   [['von','auf','für'],'c','prep','vielen Dank für die Einladung'],
   [['komme','kommst','kommen'],'a','verb','ich komme'],
   [['um','am','im'],'b','zeit','am Sonntag'],
   [['bringst','bringen','bringe'],'c','verb','ich bringe'],
   [['mit','an','ein'],'a','trennbar','Ich bringe einen Kuchen mit'],
   [['Wie alt bist du?','Was kostet das Essen?','Um wie viel Uhr soll ich kommen?'],'c','content','Um wie viel Uhr soll ich kommen?',3],
   [['mir','mich','dich'],'b','wort','Ich freue mich'],
   [['Bis','Am','Zu'],'a','wort','Bis bald'],
   [['Liebe Gruß','Guten Appetit','Liebe Grüße'],'c','gruss','Liebe Grüße'],
  ]},
});
