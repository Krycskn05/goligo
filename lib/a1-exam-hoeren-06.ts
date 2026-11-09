import {buildHoeren} from './a1-exam-build';

/** A1 sınavı · Hören 6: in a taxi, at the hotel, family and presents; announcements; messages on the phone. */
export const exam=buildHoeren(6,'Im Taxi · Familie und Geschenke · Durchsagen · Kita, Sport und Arbeit',{
 teil1:{
  example:{q:'Wohin möchte der Mann fahren?',o:['Zum Flughafen','Zum Hauptbahnhof','Zum Hafen'],a:'b',lines:[
   ['Fahrgast:M3','Guten Tag! Zum Bahnhof, bitte.'],
   ['Aisha','Zum Hauptbahnhof oder zum Bahnhof am Flughafen?'],
   ['Fahrgast:M3','Zum Hauptbahnhof. Mein Zug fährt in zwanzig Minuten.']]},
  items:[
   {q:'Was kostet die Fahrt?',o:['12 Euro','22 Euro','32 Euro'],a:'b',lines:[
     ['Aisha','So, da sind wir. Das macht 22 Euro.'],
     ['Fahrgast:M4','22? Vom Bahnhof bis hier bezahle ich sonst immer 12.'],
     ['Aisha','Am Tag, ja. Aber in der Nacht kostet es 22.'],
     ['Fahrgast:M4','Na gut. Hier, bitte.']],
    why:'Gündüz 12 Euro, ama *in der Nacht kostet es 22*: adam 22 Euro ödüyor.'},
   {q:'Was ist das Problem im Hotelzimmer?',o:['Es gibt kein Handtuch','Der Fernseher ist kaputt','Das Zimmer ist kalt'],a:'a',lines:[
     ['Nora','Guten Abend, hier ist Zimmer 12. Es gibt ein Problem.'],
     ['Rezeption:M2','Ist der Fernseher wieder kaputt? Oder ist es zu kalt?'],
     ['Nora','Nein, nein, das ist alles in Ordnung. Aber im Bad ist kein Handtuch.'],
     ['Rezeption:M2','Oh, Entschuldigung! Ich bringe sofort eins.']],
    why:'Televizyon ve ısı *alles in Ordnung*; sorun: *im Bad ist kein Handtuch*.'},
   {q:'Wie viele Geschwister hat Nikos?',o:['Zwei','Drei','Fünf'],a:'c',lines:[
     ['Sabine','Nikos, hast du Geschwister?'],
     ['Nikos','Ja, viele! Ich habe drei Brüder und zwei Schwestern.'],
     ['Sabine','Fünf Geschwister! Ich habe nur eine Schwester.']],
    why:'Üç erkek, iki kız kardeş: toplam beş (*Fünf Geschwister!*).'},
   {q:'Wann fängt Yasemins Kurs heute an?',o:['Um 9 Uhr','Um 9.30 Uhr','Um 10 Uhr'],a:'b',lines:[
     ['Can:M5','Yasemin, es ist schon halb neun! Dein Kurs beginnt doch um neun.'],
     ['Yasemin','Heute nicht. Paul hat einen Termin, wir fangen erst um halb zehn an.']],
    why:'Normalde 9, ama bugün *erst um halb zehn*: 9.30.'},
   {q:'Was kauft Rami für seine Frau?',o:[['💐','Blumen'],['🍫','Schokolade'],['🧴','Ein Parfüm']],a:'a',lines:[
     ['Rami','Ich suche ein Geschenk für meine Frau. Vielleicht ein Parfüm?'],
     ['Verkäuferin:F5','Dieses hier ist sehr schön. Es kostet 70 Euro.'],
     ['Rami','Oh, das ist zu teuer. Dann kaufe ich Blumen. Schokolade isst sie nicht.']],
    why:'Parfüm çok pahalı, çikolatayı eşi yemiyor: *Dann kaufe ich Blumen*.'},
   {q:'Wo ist Yasemins Handy?',o:['Auf dem Tisch','In der Tasche','Im Auto'],a:'c',lines:[
     ['Yasemin','Can, wo ist mein Handy? Auf dem Tisch liegt es nicht.'],
     ['Can:M5','Ist es in deiner Tasche?'],
     ['Yasemin','Nein, da ist es auch nicht … Ach, ich weiß: Es liegt noch im Auto!']],
    why:'Masada yok, çantada da yok: *Es liegt noch im Auto*.'},
  ]},
 teil2:{
  example:{t:'Der Zug nach München kommt jetzt.',a:'r',lines:[
   ['Sprecher:M3','Am Gleis 3 fährt jetzt ein: der ICE nach München. Bitte Vorsicht am Gleis!']]},
  items:[
   {t:'Kaffee kostet im Zug heute weniger.',a:'r',lines:[
     ['Sprecherin:F4','Liebe Fahrgäste, unser Zug hat leider 30 Minuten Verspätung. Im Restaurant in Wagen 5 bekommen Sie deshalb heute Kaffee und Tee zum halben Preis. Wir bitten um Entschuldigung.']],
    why:'Gecikme yüzünden kahve ve çay *zum halben Preis*: yarı fiyatına.'},
   {t:'Der Supermarkt schließt heute um 20 Uhr.',a:'f',lines:[
     ['Sprecher:M2','Liebe Kunden, heute ist unser Markt nur bis 14 Uhr geöffnet. Morgen sind wir wie immer von 8 bis 20 Uhr für Sie da.']],
    why:'Bugün *nur bis 14 Uhr* açık; 20’ye kadar olan yarın.'},
   {t:'Das Programm für Kinder ist im Park.',a:'r',lines:[
     ['Sprecherin:F1','Willkommen auf dem Stadtfest! Um 15 Uhr spielt am Rathaus eine Band aus Köln. Für Kinder gibt es im Park Spiele und ein Puppentheater.']],
    why:'*Für Kinder gibt es im Park Spiele und ein Puppentheater*; belediye binasının önünde müzik var.'},
   {t:'Man kann jetzt keine Bücher mehr ausleihen.',a:'f',lines:[
     ['Sprecher:M5','Liebe Besucher, die Bibliothek schließt in 15 Minuten. Bücher können Sie noch an den Automaten im Erdgeschoss ausleihen. Die Information ist schon geschlossen.']],
    why:'Danışma kapalı, ama *an den Automaten im Erdgeschoss* hâlâ kitap ödünç alınabiliyor.'},
  ]},
 teil3:{items:[
  {q:'Bis wann ist die Kita am Freitag geöffnet?',o:['Bis 12 Uhr','Bis 14 Uhr','Bis 16 Uhr'],a:'b',lines:[
    ['Kita:F1','Guten Tag, Frau Kamau, hier ist die Kita Sonnenschein. Am Freitag haben wir ein Fest für die Kinder. Wir schließen also schon um 14 Uhr, nicht um 16 Uhr. Bitte holen Sie Amani pünktlich ab.']],
   why:'Cuma günü şenlik var: *schon um 14 Uhr, nicht um 16 Uhr* kapanıyor.'},
  {q:'Was möchte Jonas am Samstag machen?',o:['Wandern','Schwimmen','Tennis spielen'],a:'a',lines:[
    ['Jonas:M1','Hallo Nikos, hier ist Jonas. Hast du am Samstag Zeit? Das Wetter ist gut, ich möchte wandern gehen. Schwimmen ist mir noch zu kalt, und Tennis spielst du ja nicht. Wir fahren um 9 Uhr los. Ruf mich an!']],
   why:'*Ich möchte wandern gehen*; yüzmek için hava soğuk, tenis de olmuyor.'},
  {q:'Welche Telefonnummer hat das Autohaus?',o:['45 76 20','54 67 20','45 67 20'],a:'c',lines:[
    ['Autohaus:F4','Guten Tag, Herr Papadakis, hier ist das Autohaus Berger. Wir haben eine Frage zu Ihrer Bewerbung. Bitte rufen Sie uns zurück. Unsere Nummer ist: vier, fünf, sechs, sieben, zwei, null. Ich wiederhole: vier, fünf, sechs, sieben, zwei, null. Vielen Dank!']],
   why:'Numara tek tek söyleniyor: *vier, fünf, sechs, sieben, zwei, null* = 45 67 20.'},
  {q:'Wo ist Rami gerade?',o:['Beim Arzt','Im Supermarkt','Zu Hause'],a:'a',lines:[
    ['Rami','Hallo Hanan, ich bin’s. Ich bin mit Sami noch beim Arzt, hier sind heute viele Leute. Ich kann also nicht einkaufen gehen. Gehst du bitte in den Supermarkt? Wir brauchen Milch und Brot. Bis später!']],
   why:'*Ich bin mit Sami noch beim Arzt*; markete Hanan’ın gitmesini istiyor.'},
  {q:'Was kostet der Yogakurs im Monat?',o:['15 Euro','25 Euro','35 Euro'],a:'c',lines:[
    ['Sportstudio:M3','Guten Tag, Frau Weiß, hier ist das Sportstudio Aktiv. Der Yogakurs ist montags um 19 Uhr und kostet 35 Euro im Monat. Für Studenten 25 Euro. Die erste Stunde ist kostenlos.']],
   why:'Kurs *35 Euro im Monat*; 25 Euro yalnızca öğrenciler için.'},
 ]},
});
