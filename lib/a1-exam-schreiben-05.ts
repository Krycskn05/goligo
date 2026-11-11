import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 5: a new patient's form at the doctor's; thanking a friend for an invitation (message). */
export const exam=buildSchreiben(5,'Formular beim Arzt · Dank für eine Einladung',{
 teil1:{
  text:'Ihr Freund Rami Khalil geht zum ersten Mal zu Frau Doktor Engel. Rami ist am 12. März 1988 in Beirut geboren und wohnt jetzt in Berlin, in der Kastanienallee 25. Er ist verheiratet und hat zwei Kinder: Lina ist acht und Sami fünf Jahre alt. Seine Telefonnummer ist 030 / 23125 417.',
  form:'Praxis Dr. Engel – neue Patienten',
  rows:[['Familienname','Khalil'],['Vorname','Rami'],['Geburtsdatum','{1}'],['Geburtsort','{2}'],['Familienstand','{3}'],['Zahl der Kinder','{4}'],['Adresse','Kastanienallee 25, 10435 Berlin'],['Telefon','{5}']],
  gaps:[
   [['12.03.1988','12. März 1988','12.03.88','12. 3. 1988'],'text','am 12. März 1988'],
   [['Beirut'],'text','in Beirut geboren'],
   [['verheiratet','verh.'],'text','Er ist verheiratet'],
   [['2','zwei','2 Kinder','zwei Kinder'],'text','hat zwei Kinder'],
   [['030 / 23125 417'],'text','030 / 23125 417'],
  ]},
 teil2:{
  task:'Ihre Freundin Nora hat Sie für Sonntag zum Essen eingeladen. Schreiben Sie Nora:',
  points:['Danke für die Einladung','Was bringen Sie mit?','Um wie viel Uhr sollen Sie kommen?'],
  model:[
   'Liebe Nora,',
   'vielen Dank für die Einladung!',
   'Ich komme sehr gern am Sonntag.',
   'Ich bringe einen Kuchen mit.',
   'Um wie viel Uhr soll ich kommen?',
   'Ich freue mich! Bis bald!',
   'Liebe Grüße',
   '(Ihr Name)',
  ]},
});
