import {buildSchreiben} from './a1-exam-build';

/** A1 sınavı · Schreiben 1: a place in the kindergarten (form); inviting the neighbour to a party (message). */
export const exam=buildSchreiben(1,'Kindergarten-Anmeldung · Einladung an die Nachbarin',{
 teil1:{
  text:'Ihr Kollege Tomasz Nowak sucht für seine Tochter Zofia einen Platz im Kindergarten „Sonnenschein“. Zofia ist drei Jahre alt, ihr Bruder Jan ist sechs. Die Familie wohnt in Hamburg, in der Gartenstraße 12. Tomasz arbeitet als Kellner. Zofia soll ab dem 1. Februar in den Kindergarten gehen, jeden Tag von 8 bis 14 Uhr.',
  form:'Anmeldung – Kindergarten Sonnenschein',
  rows:[['Name des Kindes','Zofia Nowak'],['Alter','{1}'],['Name des Vaters','Tomasz Nowak'],['Beruf des Vaters','{2}'],['Straße, Hausnummer','{3}'],['PLZ, Wohnort','20359 {4}'],['Beginn','ab {5}'],['Zeit','8–14 Uhr']],
  gaps:[
   [['3 Jahre','3','drei','drei Jahre','3 Jahre alt','drei Jahre alt','3 J.'],'text','Zofia ist drei Jahre alt'],
   [['Kellner'],'text','Tomasz arbeitet als Kellner'],
   [['Gartenstraße 12','Gartenstr. 12'],'text','in der Gartenstraße 12'],
   [['Hamburg'],'text','Die Familie wohnt in Hamburg'],
   [['1. Februar','01.02.','1. Feb.','dem 1. Februar','ersten Februar','dem ersten Februar'],'text','ab dem 1. Februar'],
  ]},
 teil2:{
  task:'Sie sind neu im Haus und machen am Samstag eine kleine Party. Schreiben Sie an Ihre Nachbarin, Frau Berger:',
  points:['Wer sind Sie?','Wann ist die Party?','Laden Sie Frau Berger ein.'],
  model:[
   'Liebe Frau Berger,',
   'ich bin neu im Haus und wohne im zweiten Stock.',
   'Am Samstag mache ich eine kleine Party. Die Party beginnt um 19 Uhr.',
   'Kommen Sie auch? Ich lade Sie herzlich ein.',
   'Haben Sie Zeit?',
   'Viele Grüße',
   '(Ihr Name)',
  ]},
});
