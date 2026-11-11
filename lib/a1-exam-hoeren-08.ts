import {buildHoeren,spelled} from './a1-exam-build';

/** A1 sınavı · Hören 8: opening times, living, at the doctor's, paying; announcements; messages on the phone. */
export const exam=buildHoeren(8,'Öffnungszeiten · Wohnen · Beim Arzt · Durchsagen · Arbeit, Training, Amt',{
 teil1:{
  example:{q:'Was ist heute im Angebot?',o:['Äpfel','Bananen','Orangen'],a:'c',lines:[
   ['Sabine','Sind die Bananen heute im Angebot?'],
   ['Verkäufer:M5','Nein, die Bananen waren gestern billig. Heute sind es die Orangen: ein Kilo nur 1 Euro 50.']]},
  items:[
   {q:'Wann öffnet die Bäckerei am Samstag?',o:['Um 6 Uhr','Um 7 Uhr','Um 8 Uhr'],a:'b',lines:[
     ['Nora','Wann öffnen Sie am Samstag? Um 6 wie immer?'],
     ['Bäcker:M2','Nein, am Samstag eine Stunde später, um 7. Und am Sonntag erst um 8.']],
    why:'Cumartesi *eine Stunde später, um 7*; 6 hafta içi, 8 pazar günü.'},
   {q:'Mit wem wohnt Mei zusammen?',o:['Allein','Mit ihrem Bruder','Mit einer Freundin'],a:'c',lines:[
     ['Rami','Mei, wohnst du allein?'],
     ['Mei','Nein, das ist zu teuer. Ich wohne mit einer Freundin zusammen, sie heißt Lena. Mein Bruder lebt ja in Bangkok.']],
    why:'Tek başına oturmak pahalı: *Ich wohne mit einer Freundin zusammen*. Kardeşi Bangkok’ta.'},
   {q:'Wie groß ist das Zimmer?',o:['12 Quadratmeter','20 Quadratmeter','22 Quadratmeter'],a:'a',lines:[
     ['Nikos','Wie groß ist das Zimmer? In der Anzeige steht 22 Quadratmeter.'],
     ['Vermieterin:F3','Das ist die Küche. Das Zimmer ist nicht so groß: 12 Quadratmeter. Aber es ist hell und ruhig.']],
    why:'22 metrekare mutfak; oda *12 Quadratmeter* (zwölf).'},
   {q:'Was tut dem Mann weh?',o:['Der Kopf','Der Rücken','Ein Zahn'],a:'b',lines:[
     ['Ärztin:F2','Guten Tag, Herr Nasser. Was fehlt Ihnen? Haben Sie wieder Kopfschmerzen?'],
     ['Omar','Nein, heute ist es der Rücken. Ich stehe den ganzen Tag im Kiosk.'],
     ['Ärztin:F2','Dann sehen wir mal.']],
    why:'Baş ağrısı bu sefer yok: *heute ist es der Rücken* — sırtı ağrıyor.'},
   {q:'Wohin geht Rami heute mit den Kindern?',o:[['🛝','Auf den Spielplatz'],['🏊','Ins Schwimmbad'],['🦁','In den Zoo']],a:'c',lines:[
     ['Hanan:F2','Rami, gehst du heute mit den Kindern ins Schwimmbad?'],
     ['Rami','Das Schwimmbad ist montags geschlossen. Wir gehen in den Zoo. Zum Spielplatz können sie morgen gehen.']],
    why:'Havuz pazartesi kapalı, oyun parkı yarın: *Wir gehen in den Zoo*.'},
   {q:'Wie buchstabiert man den Namen?',o:['Vogt','Voigt','Fogt'],a:'a',cards:true,lines:[
     ['Mann:M5','Autowerkstatt Nordstern, guten Tag.'],
     ['Frau:F2','Guten Tag. Ist mein Auto fertig? Mein Name ist Vogt.'],
     ['Mann:M5','Wie schreibt man das?'],
     spelled('Frau:F2','Ich buchstabiere: {S}.','Vogt')],
    why:'Ad harf harf söyleniyor: *V – O – G – T*. İlk harf V’dir (F değil); O’dan sonra I yok.'},
  ]},
 teil2:{
  example:{t:'Man muss für das Probieren bezahlen.',a:'f',lines:[
   ['Sprecherin:F1','Liebe Kunden, an der Käsetheke können Sie heute Käse aus Frankreich probieren – kostenlos!']]},
  items:[
   {t:'Nach Potsdam fährt heute kein Regionalzug.',a:'r',lines:[
     ['Sprecher:M3','Der Regionalzug nach Potsdam fällt heute leider aus. Bitte nehmen Sie die S-Bahn auf Gleis 1.']],
    why:'Tren *fällt heute leider aus*: bugün yok; Potsdam’a banliyö treniyle (S-Bahn) gidiliyor.'},
   {t:'Die Besucher dürfen die Elefanten füttern.',a:'f',lines:[
     ['Sprecherin:F5','Liebe Kinder, liebe Eltern! Um 15 Uhr bekommen die Elefanten ihr Futter. Kommt alle zum Elefantenhaus – ihr könnt zusehen!']],
    why:'Ziyaretçiler yalnızca izliyor (*ihr könnt zusehen*); filleri onlar beslemiyor.'},
   {t:'In Istanbul regnet es.',a:'f',lines:[
     ['Kapitän:M4','Meine Damen und Herren, hier spricht Ihr Kapitän. Wir fliegen heute nach Istanbul und brauchen etwa drei Stunden. Das Wetter dort ist sonnig, 28 Grad.']],
    why:'İstanbul’da hava *sonnig, 28 Grad*: güneşli, yağmur yok.'},
   {t:'Kinderkleidung gibt es im ersten Stock.',a:'f',lines:[
     ['Sprecherin:F4','Eine Information für unsere Kunden: Die Kinderabteilung ist jetzt nicht mehr im ersten Stock, sondern im dritten. Im ersten Stock finden Sie jetzt Sportartikel.']],
    why:'Çocuk reyonu *nicht mehr im ersten Stock, sondern im dritten*; birinci katta artık spor ürünleri var.'},
  ]},
 teil3:{items:[
  {q:'Wann soll Frau Lange am Montag kommen?',o:['Um 7 Uhr','Um 8 Uhr','Um 9 Uhr'],a:'a',lines:[
    ['Chef:M3','Guten Tag, Frau Lange, hier ist das Restaurant am Kanal. Sie können am Montag bei uns anfangen. Kommen Sie bitte um 7 Uhr. Normal beginnt die Arbeit um 8, aber am ersten Tag zeige ich Ihnen alles.']],
   why:'İş normalde 8’de başlıyor, ama ilk gün *Kommen Sie bitte um 7 Uhr*.'},
  {q:'Wo ist das Training heute?',o:['In der Sporthalle','Im Park','Auf dem Sportplatz'],a:'c',lines:[
    ['Tomasz','Hallo, hier ist Tomasz Nowak vom TSV Hafen. Eine Information für die Eltern: Die Sporthalle ist heute geschlossen. Das Training ist auf dem Sportplatz hinter der Schule, nicht im Park. Die Kinder brauchen eine Jacke!']],
   why:'Salon kapalı; antrenman *auf dem Sportplatz hinter der Schule, nicht im Park*.'},
  {q:'Was kostet die Reparatur?',o:['60 Euro','100 Euro','160 Euro'],a:'a',lines:[
    ['Handy-Doktor:M4','Guten Tag, Frau Weiß, hier ist der Handy-Doktor. Ihr Handy ist fertig. Das neue Display kostet 60 Euro. Ein neues Handy kostet 100 Euro mehr – die Reparatur war also eine gute Idee! Sie können es bis 19 Uhr abholen.']],
   why:'Yeni ekran, yani tamir *60 Euro*; 100 Euro yeni telefonun fazladan tutarı.'},
  {q:'Warum ruft Omar an?',o:['Er ist krank','Er möchte ins Kino gehen','Er braucht Hilfe'],a:'c',lines:[
    ['Omar','Hallo Rami, hier ist Omar. Am Samstag bekomme ich neue Regale für den Kiosk. Sie sind sehr schwer. Kannst du mir helfen? Danach lade ich dich zum Essen ein. Ruf mich bitte an!']],
   why:'Raflar çok ağır: *Kannst du mir helfen?* — yardım istiyor.'},
  {q:'Was soll Herr Khalil mitbringen?',o:['Seinen Pass','Ein Foto','Den Mietvertrag'],a:'b',lines:[
    ['Bürgeramt:F2','Guten Tag, Herr Khalil, hier ist das Bürgeramt. Ihr Termin ist am Mittwoch um 10 Uhr 15. Ihren Pass haben wir schon gesehen, den brauchen wir nicht mehr. Den Mietvertrag können Sie später schicken. Aber bitte bringen Sie ein neues Foto mit.']],
   why:'Pasaporta gerek yok, kira sözleşmesi sonra gönderilebilir; getirilecek olan: *ein neues Foto*.'},
 ]},
});
