import {buildHoeren} from './a1-exam-build';

/** A1 sınavı · Hören 1: at the bakery, in a shop, at the cinema; announcements; messages on the phone. */
export const exam=buildHoeren(1,'Einkaufen · Kino · Durchsagen im Bahnhof · Nachrichten am Telefon',{
 teil1:{
  example:{q:'Wann fährt der nächste Bus zum Bahnhof?',o:['Um 8.10 Uhr','Um 8.20 Uhr','Um 8.50 Uhr'],a:'b',lines:[
   ['Yasemin','Entschuldigung, wann fährt der nächste Bus zum Bahnhof?'],
   ['Mann:M2','Der Bus um 8 Uhr 10 ist leider schon weg. Der nächste kommt um 8 Uhr 20.'],
   ['Yasemin','Um 8 Uhr 20 – gut, dann warte ich hier. Danke!']]},
  items:[
   {q:'Was kauft die Frau?',o:[['🥖','Brötchen'],['🍰','Kuchen'],['🍞','Ein Brot']],a:'c',lines:[
     ['Verkäufer:M5','Guten Morgen! Was darf es sein?'],
     ['Sabine','Ich möchte sechs Brötchen, bitte.'],
     ['Verkäufer:M5','Tut mir leid, die Brötchen sind schon weg. Wir haben noch Brot und Apfelkuchen.'],
     ['Sabine','Hm, Kuchen esse ich nicht so gern. Dann nehme ich ein Brot.']],
    why:'Ekmekçikler bitmiş (*die Brötchen sind schon weg*), pastayı sevmiyor: *Dann nehme ich ein Brot*.'},
   {q:'Wie viel kostet die Jacke heute?',o:['15 Euro','45 Euro','60 Euro'],a:'b',lines:[
     ['Mei','Entschuldigung, was kostet diese Jacke?'],
     ['Verkäuferin:F4','Die Jacke kostet normal 60 Euro. Aber heute ist sie 15 Euro billiger.'],
     ['Mei','Also 45 Euro? Das ist gut. Ich nehme sie.']],
    why:'Normal fiyat 60 Euro, bugün *15 Euro billiger*: 60 − 15 = 45 Euro.'},
   {q:'Wann beginnt der Film für die zwei?',o:['Um 18.30 Uhr','Um 20 Uhr','Um 20.30 Uhr'],a:'c',lines:[
     ['Nikos','Zwei Karten für den Film heute Abend, bitte. Er beginnt um acht, oder?'],
     ['Kassiererin:F2','Um 20 Uhr ist schon alles voll. Aber um halb neun gibt es noch Plätze. Oder Sie kommen früher: um 18 Uhr 30.'],
     ['Nikos','Nein, das ist zu früh. Dann bitte zwei Karten für halb neun.']],
    why:'Saat 20 seansı dolu, 18.30 ona erken; biletleri *für halb neun* alıyor: 20.30.'},
   {q:'Was macht Tomasz am Wochenende?',o:['Er bleibt zu Hause','Er fährt nach Krakau','Er fährt nach Berlin'],a:'a',lines:[
     ['Aisha','Tomasz, fährst du am Wochenende wieder nach Krakau zu Agatas Eltern?'],
     ['Tomasz','Nein, dieses Mal nicht. Die Kinder sind krank. Wir bleiben in Hamburg, zu Hause.'],
     ['Aisha','Schade! Ich fahre am Samstag nach Berlin.']],
    why:'Bu sefer Krakau’ya gitmiyorlar: *Wir bleiben in Hamburg, zu Hause*. Berlin’e giden Aisha.'},
   {q:'Was soll der Mann machen?',o:['Im Bett bleiben','Viel trinken','Tabletten nehmen'],a:'b',lines:[
     ['Ärztin:F2','Herr Khalil, Sie haben eine Erkältung. Tabletten brauchen Sie nicht.'],
     ['Rami','Muss ich im Bett bleiben?'],
     ['Ärztin:F2','Nein, das müssen Sie nicht. Aber trinken Sie viel Tee und Wasser – das ist wichtig.']],
    why:'İlaç gerekmiyor, yatması da şart değil; önemli olan: *trinken Sie viel Tee und Wasser*.'},
   {q:'Wie kommt die Frau zum Museum?',o:[['🚶','Zu Fuß'],['🚌','Mit dem Bus'],['🚇','Mit der U-Bahn']],a:'a',lines:[
     ['Yasemin','Entschuldigung, wie komme ich zum Stadtmuseum? Fährt da ein Bus?'],
     ['Mann:M3','Der Bus fährt heute nicht. Sie können die U-Bahn nehmen, aber das Museum ist nicht weit: nur fünf Minuten zu Fuß.'],
     ['Yasemin','Oh, dann gehe ich zu Fuß. Danke!']],
    why:'Otobüs bugün yok, metro olur ama müze yakın: *dann gehe ich zu Fuß*.'},
  ]},
 teil2:{
  example:{t:'Die Äpfel sind heute billig.',a:'r',lines:[
   ['Sprecherin:F1','Liebe Kundinnen und Kunden, heute im Angebot: ein Kilo Äpfel für nur 1 Euro 99. Sie finden die Äpfel gleich am Eingang.']]},
  items:[
   {t:'Der Zug nach Köln fährt heute von einem anderen Gleis.',a:'f',lines:[
     ['Sprecher:M3','Achtung an Gleis 4: Der Intercity nach Köln, Abfahrt 10 Uhr 15, hat heute 20 Minuten Verspätung. Bitte warten Sie am Gleis 4.']],
    why:'Değişen peron değil, saat: tren *20 Minuten Verspätung* ile yine *Gleis 4*’ten kalkıyor.'},
   {t:'Die Kunden sollen jetzt bezahlen.',a:'r',lines:[
     ['Sprecherin:F4','Liebe Kunden, unser Kaufhaus schließt in zehn Minuten. Bitte gehen Sie jetzt zur Kasse. Morgen sind wir ab 9 Uhr wieder für Sie da.']],
    why:'Mağaza on dakika sonra kapanıyor: *Bitte gehen Sie jetzt zur Kasse* — yani şimdi ödeme yapılmalı.'},
   {t:'Der Fahrer soll sein Auto hinter dem Haus parken.',a:'r',lines:[
     ['Sprecher:M5','Eine Durchsage für den Fahrer des roten Autos vor dem Eingang: Ihr Auto kann hier nicht stehen. Bitte fahren Sie es sofort weg! Der Parkplatz ist hinter dem Haus.']],
    why:'Araba girişin önünde duramaz; *Der Parkplatz ist hinter dem Haus*: oraya park etmeli.'},
   {t:'Frau Arslan hat noch viel Zeit.',a:'f',lines:[
     ['Sprecherin:F3','Letzter Aufruf für Frau Arslan, gebucht auf den Flug nach Izmir. Bitte kommen Sie sofort zum Ausgang B 12. Das Flugzeug wartet nur noch fünf Minuten.']],
    why:'*Bitte kommen Sie sofort* ve uçak yalnızca beş dakika bekliyor: zamanı yok.'},
  ]},
 teil3:{items:[
  {q:'Wann ist die Praxis am Mittwoch geöffnet?',o:['Von 8 bis 12 Uhr','Von 8 bis 18 Uhr','Am Mittwoch ist geschlossen'],a:'a',lines:[
    ['Praxis:F4','Guten Tag, hier ist die Praxis Doktor Sommer. Im Moment ist niemand da. Unsere Sprechzeiten: Montag, Dienstag und Donnerstag von 8 bis 18 Uhr, Mittwoch und Freitag nur am Vormittag, von 8 bis 12 Uhr. Vielen Dank für Ihren Anruf.']],
   why:'Çarşamba ve cuma *nur am Vormittag, von 8 bis 12 Uhr*; 18’e kadar açık günler pazartesi, salı ve perşembe.'},
  {q:'Was soll Mei mitbringen?',o:['Einen Salat','Getränke','Einen Kuchen'],a:'c',lines:[
    ['Sabine','Hallo Mei, hier ist Sabine. Am Samstag ist meine Party, du kommst doch? Getränke habe ich schon, und Jonas macht einen Salat. Kannst du einen Kuchen backen? Das ist super! Tschüs!']],
   why:'İçecekler hazır, salatayı Jonas yapıyor; Mei’den istenen: *Kannst du einen Kuchen backen?*'},
  {q:'Wo treffen sich Omar und Rami?',o:['Am Kiosk','Vor dem Kino','Im Volkspark'],a:'b',lines:[
    ['Omar','Hallo Rami, Omar hier. Ich bin noch im Kiosk, aber um sieben mache ich zu. Der Film beginnt um acht. Treffen wir uns um Viertel vor acht vor dem Kino? Nicht im Volkspark wie letztes Mal – es regnet ja. Bis dann!']],
   why:'Buluşma *vor dem Kino*; park bu sefer yok (*Nicht im Volkspark*), büfe ise Omar’ın şu an bulunduğu yer.'},
  {q:'Wann kommt der Techniker?',o:['Am Dienstag','Am Mittwoch','Am Donnerstag'],a:'c',lines:[
    ['Hausverwaltung:M3','Guten Tag, Frau Krüger, hier ist die Hausverwaltung Berger. Der Techniker für Ihre Waschmaschine kann am Dienstag leider nicht kommen. Er kommt am Donnerstag, zwischen 9 und 11 Uhr. Am Mittwoch ist unser Büro geschlossen. Bitte rufen Sie uns heute noch an. Danke.']],
   why:'Salı gelemiyor, çarşamba büro kapalı; teknisyen *am Donnerstag* geliyor.'},
  {q:'Wie viel kostet der Kurs?',o:['18 Euro','120 Euro','138 Euro'],a:'b',lines:[
    ['Sprachschule:F2','Guten Tag, Herr Papadakis, hier ist die Sprachschule Lingua. Ihr Deutschkurs beginnt am Montag um 18 Uhr. Der Kurs kostet 120 Euro. Das Buch kostet extra: 18 Euro. Bitte bezahlen Sie am ersten Abend.']],
   why:'*Der Kurs kostet 120 Euro*; 18 Euro kitabın ayrı fiyatı.'},
 ]},
});
