import {buildHoeren,spelled} from './a1-exam-build';

/** A1 sınavı · Hören 4: at the market, at the station, presents and colours; announcements; messages on the phone. */
export const exam=buildHoeren(4,'Auf dem Markt · Am Bahnhof · Durchsagen · Adressen und Preise am Telefon',{
 teil1:{
  example:{q:'Was sucht die Frau?',o:['Die Toilette','Den Aufzug','Die Kasse'],a:'a',lines:[
   ['Aisha','Entschuldigung, wo ist hier die Toilette?'],
   ['Mann:M5','Im ersten Stock, gleich neben der Kasse. Der Aufzug ist dort hinten.']]},
  items:[
   {q:'Wie viele Eier kauft der Mann?',o:['Sechs','Zehn','Zwölf'],a:'c',lines:[
     ['Omar','Guten Tag, ich möchte zehn Eier, bitte.'],
     ['Verkäuferin:F1','Wir haben Packungen mit sechs oder mit zwölf Eiern.'],
     ['Omar','Sechs sind zu wenig, ich backe einen Kuchen. Dann die Packung mit zwölf, bitte.']],
    why:'On tane istiyor ama paketler 6’lı ya da 12’li; altı az geliyor: *die Packung mit zwölf*.'},
   {q:'Wann kommt der Zug aus München heute an?',o:['Um 16.15 Uhr','Um 16.50 Uhr','Um 17.15 Uhr'],a:'b',lines:[
     ['Sabine','Entschuldigung, der Zug aus München kommt um 16 Uhr 15, oder?'],
     ['Mann:M3','Normal ja. Aber heute hat er Verspätung: Er kommt erst um 16 Uhr 50.'],
     ['Sabine','Oh, dann habe ich noch Zeit für einen Kaffee.']],
    why:'Normalde 16.15, ama bugün gecikmeli: *Er kommt erst um 16 Uhr 50*.'},
   {q:'Was soll Nikos für Sami kaufen?',o:[['📘','Ein Buch'],['⚽','Einen Ball'],['🚲','Ein Fahrrad']],a:'a',lines:[
     ['Nikos','Rami, Sami hat bald Geburtstag. Was möchte er? Einen Fußball?'],
     ['Rami','Einen Ball hat er schon. Er möchte ein Fahrrad – aber das ist zu teuer. Kauf ihm doch ein Buch, er liebt Bücher mit Tieren.']],
    why:'Topu var, bisiklet çok pahalı; Rami’nin önerisi: *Kauf ihm doch ein Buch*.'},
   {q:'Welche Farbe hat Sabines neues Sofa?',o:['Blau','Grau','Rot'],a:'b',lines:[
     ['Mei','Sabine, dein neues Sofa ist da! Ist es rot wie das alte?'],
     ['Sabine','Nein, rot mag ich nicht mehr. Blau war zu teuer. Jetzt habe ich ein graues Sofa – das passt gut zum Teppich.']],
    why:'Kırmızıyı artık sevmiyor, mavi pahalıydı: *Jetzt habe ich ein graues Sofa*.'},
   {q:'Wohin geht die Frau an der Ampel?',o:[['⬆️','Geradeaus'],['⬅️','Nach links'],['➡️','Nach rechts']],a:'c',lines:[
     ['Yasemin','Entschuldigung, wo ist die Stadtbibliothek?'],
     ['Mann:M2','Gehen Sie hier geradeaus bis zur Ampel. An der Ampel dann nicht links – da ist nur der Park –, sondern rechts. Die Bibliothek ist gleich da.']],
    why:'Işıklara kadar düz, ışıklarda ise *nicht links …, sondern rechts*: sağa.'},
   {q:'Wie buchstabiert man den Namen?',o:['Böttcher','Bötcher','Bottcher'],a:'a',cards:true,lines:[
     ['Frau:F1','Sprachschule Lingua, guten Morgen.'],
     ['Mann:M5','Guten Morgen. Ich möchte einen Kurs buchen. Mein Name ist Böttcher.'],
     ['Frau:F1','Wie bitte? Wie schreibt man das?'],
     spelled('Mann:M5','Ich buchstabiere: {S}.','Böttcher')],
    why:'Ad harf harf söyleniyor: *B – Ö – T – T – C – H – E – R*. İkinci harf Ö’dür (O değil) ve T iki kez söyleniyor.'},
  ]},
 teil2:{
  example:{t:'Die Fluggäste sollen sitzen bleiben.',a:'r',lines:[
   ['Sprecherin:F3','Meine Damen und Herren, wir landen in wenigen Minuten in Hamburg. Bitte bleiben Sie auf Ihren Plätzen und machen Sie Ihre Handys aus.']]},
  items:[
   {t:'Kinder müssen heute für das Essen nichts bezahlen.',a:'r',lines:[
     ['Sprecherin:F2','Liebe Kunden, in unserem Restaurant im zweiten Stock gibt es heute bis 14 Uhr ein Mittagessen für 5 Euro 90: Nudeln mit Tomatensoße und einen Salat. Kinder essen heute kostenlos.']],
    why:'*Kinder essen heute kostenlos*: çocuklar için yemek ücretsiz; 5,90 Euro yetişkin fiyatı.'},
   {t:'Die Badegäste müssen heute früher gehen.',a:'r',lines:[
     ['Sprecher:M4','Liebe Badegäste, das Schwimmbad schließt heute schon um 18 Uhr: Am Abend haben wir ein Schwimmfest der Schulen. Bitte gehen Sie bis 17 Uhr 45 aus dem Wasser. Danke!']],
    why:'Havuz bugün *schon um 18 Uhr* kapanıyor: herkes her zamankinden erken çıkmalı.'},
   {t:'Der Zug nach Leipzig fährt heute von Gleis 7.',a:'f',lines:[
     ['Sprecher:M3','Achtung auf Gleis 7: Der Regionalexpress nach Leipzig fährt heute nicht von Gleis 7, sondern von Gleis 9. Bitte gehen Sie zu Gleis 9.']],
    why:'Tren bugün *nicht von Gleis 7, sondern von Gleis 9* kalkıyor.'},
   {t:'Der A1-Kurs fällt heute aus.',a:'f',lines:[
     ['Sprecherin:F5','Liebe Kursteilnehmer, eine Information: Der Kurs A1 beginnt heute nicht um 9 Uhr, sondern erst um 10 Uhr. Bitte warten Sie in der Cafeteria.']],
    why:'Kurs iptal değil; yalnızca geç başlıyor: *erst um 10 Uhr*.'},
  ]},
 teil3:{items:[
  {q:'Wann beginnt der Schwimmkurs?',o:['Am Montag','Am Mittwoch','Am Samstag'],a:'c',lines:[
    ['Aisha','Guten Tag, Frau Nowak, hier ist Aisha Kamau vom Schwimmkurs. Der Kurs für Jan beginnt nicht am Montag, sondern erst am Samstag um 9 Uhr im Stadtbad. Am Mittwoch gibt es einen Elternabend. Jan braucht eine Badehose und ein Handtuch.']],
   why:'Kurs *nicht am Montag, sondern erst am Samstag* başlıyor; çarşamba veli toplantısı var.'},
  {q:'Welche Hausnummer hat Nikos?',o:['17','70','77'],a:'a',lines:[
    ['Nikos','Hallo Tomasz, Nikos hier. Meine neue Adresse ist Uferweg 17 – eins, sieben. Nicht 70, das ist das Haus gegenüber! Ich wohne im zweiten Stock. Komm doch am Sonntag vorbei!']],
   why:'*Uferweg 17 – eins, sieben*; 70 (siebzig) karşıdaki ev. 17 ile 70 kulağa benzer gelir.'},
  {q:'Was kostet die Fahrkarte am Samstag?',o:['39 Euro','59 Euro','95 Euro'],a:'a',lines:[
    ['Reisezentrum:F4','Guten Tag, Herr Nasser, hier ist das Reisezentrum am Hauptbahnhof. Sie möchten am Freitag nach Köln fahren. Die Fahrkarte kostet 59 Euro. Am Samstag ist es billiger: nur 39 Euro. Rufen Sie uns bitte an: Welchen Tag möchten Sie?']],
   why:'Cuma 59 Euro; *Am Samstag … nur 39 Euro*.'},
  {q:'Wo wartet Yasemin?',o:['Am Eingang','Im Café','An der Kasse'],a:'b',lines:[
    ['Yasemin','Hallo Elif, ich bin schon im Museum. Am Eingang sind so viele Leute, da finden wir uns nicht. Ich sitze im Café im ersten Stock und trinke einen Tee. Die Karten habe ich schon gekauft, du musst nicht zur Kasse. Bis gleich!']],
   why:'Giriş çok kalabalık, gişeye gerek yok: *Ich sitze im Café im ersten Stock*.'},
  {q:'Was sucht Paul?',o:['Sein Handy','Seinen Schlüssel','Seine Brille'],a:'c',lines:[
    ['Paul','Hallo Sabine, hier ist Paul. Ich war heute bei dir im Büro. Liegt meine Brille vielleicht noch auf deinem Schreibtisch? Mein Handy und den Schlüssel habe ich, aber ohne Brille kann ich nicht lesen! Ruf mich bitte an.']],
   why:'Telefonu ve anahtarı yanında; aradığı şey gözlüğü: *Liegt meine Brille … noch auf deinem Schreibtisch?*'},
 ]},
});
