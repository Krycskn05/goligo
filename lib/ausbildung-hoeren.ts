/**
 * Lektion 12 „Ausbildung" – Hören: 14 listening sections (Teil A–D, Richtig schreiben,
 * Prüfungstraining). The site reads every text aloud (natural site voices when their clips
 * exist, the device's German voice otherwise). `show` is the written form of a line whose
 * spoken form spells out the years.
 */
import {lessonSpeechTexts} from './ausbildung-course';

export type HoerenVoice='f'|'m'|'n';
export type HoerenLine={who:string;text:string;show?:string};
export type HoerenQuestion=
 |{type:'rf';text:string;answer:'richtig'|'falsch'}
 |{type:'mc';text:string;options:string[];answer:number;say?:string;label?:string}
 |{type:'select';text:string;options:string[];answer:string}
 |{type:'text';text:string;answer:string;numeric?:boolean;placeholder?:string}
 |{type:'dict';answer:string;say?:string;label?:string;numeric?:boolean;placeholder?:string};
export type HoerenTask={id:string;number:number;part?:string;title:string;hint:string;lines?:HoerenLine[];dictation?:boolean;questions:HoerenQuestion[]};

/** Who speaks with which kind of voice (female, male, neutral narrator). */
const speakers:Record<string,HoerenVoice>={Marisol:'f',Arun:'m',Amira:'f','Herr Berger':'m',Lehrerin:'f',Tom:'m',Mina:'f',Jonas:'m',Selin:'f',Samuel:'m',Beraterin:'f',Amina:'f',Reporterin:'f',Marco:'m',Sprecher:'n'};
export const speakerVoice=(who:string):HoerenVoice=>speakers[who]??'n';

const PLANS=['einen Online-Kurs machen','ein Praktikum machen','eine Ausbildung machen','einen Computerkurs machen'];
const TIMES=['vor – früher (geçmiş)','seit – jetzt (hâlâ devam ediyor)','in – später (gelecek)'];
const YEAR='z. B. 1991';
const PERFEKT='ich bin … / ich habe …';

export const hoerenTasks:HoerenTask[]=[
 {id:'t1',number:1,part:'Teil A',title:'Vier Personen: Was können sie gut? Was wollen sie machen?',hint:'Dört kişi konuşuyor. Dinle, sonra richtig/falsch işaretle ve kim ne yapmak istiyor eşleştir.',
  lines:[
   {who:'Marisol',text:'Hallo, ich heiße Marisol. Ich komme aus Mexiko und ich wohne jetzt in Berlin. Ich kann schon gut Deutsch sprechen, aber ich kann noch nicht so gut schreiben. Ich arbeite jeden Tag bis 18 Uhr. Ich habe nur am Abend Zeit. Ich will einen Online-Kurs machen.'},
   {who:'Arun',text:'Ich bin Arun. Ich kann sehr gut Fahrräder reparieren. Das habe ich in Indien gelernt. In Deutschland habe ich noch keine Arbeit. Ich will ein Praktikum in einem Fahrradladen machen.'},
   {who:'Amira',text:'Ich heiße Amira. Ich kann gut nähen. Ich nähe Taschen und Kleider. Das ist nicht leicht, aber es macht Spaß. Ich will eine Ausbildung machen. Dann kann ich später einen Laden haben.'},
   {who:'Herr Berger',text:'Mein Name ist Herbert Berger. Ich bin 68 Jahre alt. Ich kann nicht so gut mit dem Handy arbeiten. Fahrkarten mit dem Handy kaufen? Das kann ich nicht! Ich will einen Computerkurs an der Volkshochschule machen.'},
  ],
  questions:[
   {type:'rf',text:'Marisol kann schon gut Deutsch schreiben.',answer:'falsch'},
   {type:'rf',text:'Marisol hat nur am Abend Zeit.',answer:'richtig'},
   {type:'rf',text:'Arun kann sehr gut Fahrräder reparieren.',answer:'richtig'},
   {type:'rf',text:'Amira findet Nähen leicht.',answer:'falsch'},
   {type:'rf',text:'Herr Berger kann Fahrkarten mit dem Handy kaufen.',answer:'falsch'},
   {type:'select',text:'Wer will was machen? – Marisol',options:PLANS,answer:'einen Online-Kurs machen'},
   {type:'select',text:'Arun',options:PLANS,answer:'ein Praktikum machen'},
   {type:'select',text:'Amira',options:PLANS,answer:'eine Ausbildung machen'},
   {type:'select',text:'Herr Berger',options:PLANS,answer:'einen Computerkurs machen'},
  ]},
 {id:'t2',number:2,title:'Im Deutschkurs: Was wollt ihr lernen?',hint:'Bir öğretmen üç öğrenciyle konuşuyor. Dinle ve doğru şıkkı seç.',
  lines:[
   {who:'Lehrerin',text:'Was wollt ihr noch lernen? Tom, was willst du lernen?'},
   {who:'Tom',text:'Ich will Texte am Computer schreiben. Das kann ich noch nicht so gut.'},
   {who:'Lehrerin',text:'Okay, der Computer-Grundkurs ist gut für dich. Und du, Mina?'},
   {who:'Mina',text:'Ich will nicht am Computer arbeiten. Ich will lieber kochen lernen. Vegetarisch!'},
   {who:'Lehrerin',text:'Dann kannst du den Kochkurs machen. Und Jonas?'},
   {who:'Jonas',text:'Ich suche einen Ausbildungsplatz. Ich will eine Bewerbung schreiben, aber das ist schwer.'},
   {who:'Lehrerin',text:'Die Sprachakademie bietet einen Online-Kurs an. Dort gibt es Tipps zu E-Mails und Bewerbungen.'},
  ],
  questions:[
   {type:'mc',text:'Tom will …',options:['kochen lernen','Texte am Computer schreiben','eine Bewerbung schreiben'],answer:1},
   {type:'mc',text:'Mina will lieber …',options:['am Computer arbeiten','vegetarisch kochen lernen','einen Ausbildungsplatz suchen'],answer:1},
   {type:'mc',text:'Jonas sucht …',options:['eine Wohnung','einen Kochkurs','einen Ausbildungsplatz'],answer:2},
   {type:'mc',text:'Welcher Kurs passt zu Jonas?',options:['der Computer-Grundkurs','der Online-Kurs von der Sprachakademie','der Kochkurs'],answer:1},
  ]},
 {id:'t3',number:3,title:'Diktat',hint:'Her cümleyi istediğin kadar dinle ve duyduğunu yaz. Büyük/küçük harf ve noktalama önemli değil; ä, ö, ü, ß yazmaya dikkat et.',dictation:true,
  questions:[
   {type:'dict',answer:'Ich kann gut schwimmen.'},
   {type:'dict',answer:'Was willst du lernen?'},
   {type:'dict',answer:'Wir wollen einen Online-Kurs machen.'},
   {type:'dict',answer:'Er will lieber in der Sprachschule lernen.'},
  ]},
 {id:'t4',number:4,part:'Teil B',title:'Selin und Samuel: Wer hat was gemacht? Wann war das?',hint:'İki kişi hayatını anlatıyor. Dinle; önce kim olduğunu seç, sonra yılları rakamla yaz.',
  lines:[
   {who:'Selin',text:'Ich heiße Selin. Ich bin neunzehnhundertfünfundneunzig in Izmir geboren. Ich bin von zweitausendeins bis zweitausenddreizehn zur Schule gegangen. Dann habe ich von zweitausenddreizehn bis zweitausendsechzehn eine Ausbildung zur Friseurin gemacht. Zweitausendneunzehn bin ich nach Berlin gekommen. Hier habe ich zuerst ein Praktikum gemacht. Jetzt arbeite ich als Friseurin. Später will ich einen Laden haben.',show:'Ich heiße Selin. Ich bin 1995 in Izmir geboren. Ich bin von 2001 bis 2013 zur Schule gegangen. Dann habe ich von 2013 bis 2016 eine Ausbildung zur Friseurin gemacht. 2019 bin ich nach Berlin gekommen. Hier habe ich zuerst ein Praktikum gemacht. Jetzt arbeite ich als Friseurin. Später will ich einen Laden haben.'},
   {who:'Samuel',text:'Mein Name ist Samuel. Ich bin neunzehnhundertneunzig in Accra, in Ghana, geboren. Ich bin von neunzehnhundertsechsundneunzig bis zweitausendacht zur Schule gegangen. Von zweitausendacht bis zweitausendzwölf habe ich in Accra studiert. Dann habe ich als Ingenieur gearbeitet. Zweitausendachtzehn bin ich nach Hamburg geflogen und ich bin zwei Jahre dort geblieben. Zweitausendzwanzig bin ich nach Berlin gezogen. Jetzt lerne ich Deutsch. Mein Ziel: Ich will wieder als Ingenieur arbeiten.',show:'Mein Name ist Samuel. Ich bin 1990 in Accra, in Ghana, geboren. Ich bin von 1996 bis 2008 zur Schule gegangen. Von 2008 bis 2012 habe ich in Accra studiert. Dann habe ich als Ingenieur gearbeitet. 2018 bin ich nach Hamburg geflogen und ich bin zwei Jahre dort geblieben. 2020 bin ich nach Berlin gezogen. Jetzt lerne ich Deutsch. Mein Ziel: Ich will wieder als Ingenieur arbeiten.'},
  ],
  questions:[
   {type:'select',text:'1. … ist in Izmir geboren.',options:['Selin','Samuel'],answer:'Selin'},
   {type:'select',text:'2. … hat studiert.',options:['Selin','Samuel'],answer:'Samuel'},
   {type:'select',text:'3. … hat eine Ausbildung zur Friseurin gemacht.',options:['Selin','Samuel'],answer:'Selin'},
   {type:'select',text:'4. … ist zwei Jahre in Hamburg geblieben.',options:['Selin','Samuel'],answer:'Samuel'},
   {type:'select',text:'5. … will einen Laden haben.',options:['Selin','Samuel'],answer:'Selin'},
   {type:'select',text:'6. … ist 2020 nach Berlin gezogen.',options:['Selin','Samuel'],answer:'Samuel'},
   {type:'text',numeric:true,text:'7. Wann ist Selin geboren? (Jahr)',answer:'1995',placeholder:YEAR},
   {type:'text',numeric:true,text:'8. Samuel ist von … bis 2008 zur Schule gegangen. (Jahr)',answer:'1996',placeholder:YEAR},
   {type:'text',numeric:true,text:'9. Selin hat von 2013 bis … eine Ausbildung gemacht. (Jahr)',answer:'2016',placeholder:YEAR},
   {type:'text',numeric:true,text:'10. Wann ist Samuel nach Hamburg geflogen? (Jahr)',answer:'2018',placeholder:YEAR},
  ]},
 {id:'t5',number:5,title:'Jahreszahlen',hint:'Yılı dinle ve rakamla yaz (örnek: 1991). İstediğin kadar tekrar dinle.',dictation:true,
  questions:[
   {type:'dict',numeric:true,label:'Jahr 1',say:'neunzehnhunderteinundneunzig',answer:'1991'},
   {type:'dict',numeric:true,label:'Jahr 2',say:'zweitausendacht',answer:'2008'},
   {type:'dict',numeric:true,label:'Jahr 3',say:'neunzehnhundertsiebenundachtzig',answer:'1987'},
   {type:'dict',numeric:true,label:'Jahr 4',say:'zweitausendfünfzehn',answer:'2015'},
   {type:'dict',numeric:true,label:'Jahr 5',say:'neunzehnhundertneunundneunzig',answer:'1999'},
   {type:'dict',numeric:true,label:'Jahr 6',say:'zweitausendeinundzwanzig',answer:'2021'},
  ]},
 {id:'t6',number:6,title:'Diktat: Perfekt mit sein',hint:'Her cümleyi dinle ve yaz. Büyük/küçük harf ve noktalama önemli değil.',dictation:true,
  questions:[
   {type:'dict',answer:'Ich bin gestern nach Berlin gekommen.'},
   {type:'dict',answer:'Wann bist du geboren?'},
   {type:'dict',answer:'Wir sind zusammen zur Schule gegangen.'},
   {type:'dict',answer:'Sie ist ein Jahr in Hamburg geblieben.'},
   {type:'dict',answer:'Ich habe eine Ausbildung gemacht.'},
  ]},
 {id:'t7',number:7,part:'Teil C',title:'Beratungsgespräch: Amina will eine Ausbildung im Hotel machen',hint:'Amina bir danışmanla konuşuyor. Dinle ve doğru şıkkı seç.',
  lines:[
   {who:'Beraterin',text:'Guten Tag, Frau Diallo. Was kann ich für Sie tun?'},
   {who:'Amina',text:'Guten Tag. Ich wohne seit einem Jahr in Berlin und ich lerne seit acht Monaten Deutsch. Ich möchte eine Ausbildung im Hotel machen.'},
   {who:'Beraterin',text:'Sehr gut. Haben Sie schon in einem Hotel gearbeitet?'},
   {who:'Amina',text:'Ja, vor zwei Jahren habe ich in Dakar in einem Hotel gearbeitet, an der Rezeption.'},
   {who:'Beraterin',text:'Prima. Die Ausbildung dauert drei Jahre. Sie arbeiten im Hotel und Sie gehen zwei Tage pro Woche zur Berufsschule.'},
   {who:'Amina',text:'Und was verdient man?'},
   {who:'Beraterin',text:'Im ersten Jahr zwischen 900 und 1000 Euro. Aber Sie brauchen Deutsch B1.'},
   {who:'Amina',text:'Ich mache in drei Monaten die Prüfung B1.'},
   {who:'Beraterin',text:'Gut. Dann machen Sie zuerst ein Praktikum. Das Hotel Lindenhof sucht eine Praktikantin. Schreiben Sie eine Bewerbung!'},
   {who:'Amina',text:'Vielen Dank! Das mache ich.'},
  ],
  questions:[
   {type:'mc',text:'Seit wann wohnt Amina in Berlin?',options:['seit einem Jahr','seit acht Monaten','seit zwei Jahren'],answer:0},
   {type:'mc',text:'Wann hat sie in einem Hotel gearbeitet?',options:['vor drei Monaten','vor einem Jahr','vor zwei Jahren'],answer:2},
   {type:'mc',text:'Die Ausbildung dauert …',options:['zwei Jahre','drei Jahre','ein Jahr'],answer:1},
   {type:'mc',text:'Man verdient im ersten Jahr …',options:['zwischen 900 und 1000 Euro','zwischen 800 und 900 Euro','1200 Euro'],answer:0},
   {type:'mc',text:'Wann macht Amina die Prüfung B1?',options:['in einem Jahr','in drei Wochen','in drei Monaten'],answer:2},
   {type:'mc',text:'Was macht Amina zuerst?',options:['einen Deutschkurs','ein Praktikum','die Ausbildung'],answer:1},
  ]},
 {id:'t8',number:8,title:'Vor, seit oder in?',hint:'Cümleyi dinle: geçmiş mi (vor), hâlâ süren bir şey mi (seit), gelecek mi (in)?',dictation:true,
  questions:[
   {type:'mc',label:'Satz 1',say:'Ich habe vor drei Jahren in Ankara studiert.',text:'Welche Zeit hörst du?',options:TIMES,answer:0},
   {type:'mc',label:'Satz 2',say:'Ich lerne seit zehn Monaten Deutsch.',text:'Welche Zeit hörst du?',options:TIMES,answer:1},
   {type:'mc',label:'Satz 3',say:'In zwei Wochen mache ich die Prüfung.',text:'Welche Zeit hörst du?',options:TIMES,answer:2},
   {type:'mc',label:'Satz 4',say:'Seit einer Woche arbeite ich im Hotel.',text:'Welche Zeit hörst du?',options:TIMES,answer:1},
   {type:'mc',label:'Satz 5',say:'Vor einem Monat bin ich nach Berlin gezogen.',text:'Welche Zeit hörst du?',options:TIMES,answer:0},
   {type:'mc',label:'Satz 6',say:'In einem Jahr will ich eine Ausbildung machen.',text:'Welche Zeit hörst du?',options:TIMES,answer:2},
  ]},
 {id:'t9',number:9,title:'Diktat: seit, vor, in',hint:'Her cümleyi dinle ve yaz. Büyük/küçük harf ve noktalama önemli değil.',dictation:true,
  questions:[
   {type:'dict',answer:'Ich wohne seit einem Jahr in Berlin.'},
   {type:'dict',answer:'Vor zwei Jahren habe ich in einem Hotel gearbeitet.'},
   {type:'dict',answer:'In drei Monaten mache ich die Prüfung.'},
   {type:'dict',answer:'Seit wann lernst du Deutsch?'},
   {type:'dict',answer:'Ich freue mich auf Ihre Antwort.'},
  ]},
 {id:'t10',number:10,part:'Teil D',title:'Interview: Gekommen nach Leipzig und geblieben in Leipzig',hint:'Bir muhabir Marco Esposito ile konuşuyor. Dinle, not al; sonra şıkları seç ve yılları rakamla yaz.',
  lines:[
   {who:'Reporterin',text:'Herr Esposito, wann sind Sie nach Deutschland gekommen?'},
   {who:'Marco',text:'Ich bin zweitausendzwölf nach Deutschland gekommen, nach Leipzig. Und ich bin in Leipzig geblieben.',show:'Ich bin 2012 nach Deutschland gekommen, nach Leipzig. Und ich bin in Leipzig geblieben.'},
   {who:'Reporterin',text:'Was haben Sie am Anfang gemacht?'},
   {who:'Marco',text:'Zuerst bin ich zwei Jahre zur Sprachschule gegangen. Dann habe ich zweitausendvierzehn ein Praktikum in einem Restaurant gemacht. Ein Jahr später habe ich dort eine Ausbildung zum Koch gemacht. Die Ausbildung hat drei Jahre gedauert.',show:'Zuerst bin ich zwei Jahre zur Sprachschule gegangen. Dann habe ich 2014 ein Praktikum in einem Restaurant gemacht. Ein Jahr später habe ich dort eine Ausbildung zum Koch gemacht. Die Ausbildung hat drei Jahre gedauert.'},
   {who:'Reporterin',text:'Und dann?'},
   {who:'Marco',text:'Dann habe ich von zweitausendachtzehn bis zweitausendzweiundzwanzig in einem Hotel gearbeitet. Zweitausenddreiundzwanzig habe ich ein kleines Restaurant gefunden. Seit April zweitausenddreiundzwanzig habe ich ein Restaurant.',show:'Dann habe ich von 2018 bis 2022 in einem Hotel gearbeitet. 2023 habe ich ein kleines Restaurant gefunden. Seit April 2023 habe ich ein Restaurant.'},
   {who:'Reporterin',text:'Haben Sie in Italien auch schon gearbeitet?'},
   {who:'Marco',text:'Ja. In Neapel habe ich von zweitausendsechs bis zweitausendelf im Restaurant von meinem Onkel gearbeitet.',show:'Ja. In Neapel habe ich von 2006 bis 2011 im Restaurant von meinem Onkel gearbeitet.'},
   {who:'Reporterin',text:'Was wollen Sie noch lernen?'},
   {who:'Marco',text:'Ich mache jetzt einen Kurs: Wie organisiert man ein Restaurant? Ich arbeite sehr viel und ich will am Abend nicht so müde sein.'},
  ],
  questions:[
   {type:'mc',text:'Wo wohnt Herr Esposito?',options:['in Leipzig','in Neapel','in Berlin'],answer:0},
   {type:'text',numeric:true,text:'2. Wann ist er nach Deutschland gekommen? (Jahr)',answer:'2012',placeholder:YEAR},
   {type:'mc',text:'Was hat er zuerst gemacht?',options:['ein Praktikum','einen Sprachkurs','eine Ausbildung'],answer:1},
   {type:'text',numeric:true,text:'4. Wann hat er das Praktikum gemacht? (Jahr)',answer:'2014',placeholder:YEAR},
   {type:'mc',text:'Die Ausbildung hat … gedauert.',options:['zwei Jahre','drei Jahre','ein Jahr'],answer:1},
   {type:'text',numeric:true,text:'6. Er hat von 2018 bis … in einem Hotel gearbeitet. (Jahr)',answer:'2022',placeholder:YEAR},
   {type:'mc',text:'Seit wann hat er ein Restaurant?',options:['seit 2012','seit April 2023','seit 2018'],answer:1},
   {type:'text',numeric:true,text:'8. In Neapel hat er von 2006 bis … gearbeitet. (Jahr)',answer:'2011',placeholder:YEAR},
   {type:'mc',text:'Was macht er jetzt?',options:['einen Sprachkurs','einen Kurs: ein Restaurant organisieren','ein Praktikum'],answer:1},
  ]},
 {id:'t11',number:11,title:'Verb-Karten: haben oder sein?',hint:'Mastarı dinle ve Perfekt formunu „ich" ile yaz: ich bin gekommen / ich habe gemacht.',dictation:true,
  questions:[
   {type:'dict',label:'Verb 1',say:'kommen',answer:'ich bin gekommen',placeholder:PERFEKT},
   {type:'dict',label:'Verb 2',say:'arbeiten',answer:'ich habe gearbeitet',placeholder:PERFEKT},
   {type:'dict',label:'Verb 3',say:'bleiben',answer:'ich bin geblieben',placeholder:PERFEKT},
   {type:'dict',label:'Verb 4',say:'machen',answer:'ich habe gemacht',placeholder:PERFEKT},
   {type:'dict',label:'Verb 5',say:'gehen',answer:'ich bin gegangen',placeholder:PERFEKT},
   {type:'dict',label:'Verb 6',say:'finden',answer:'ich habe gefunden',placeholder:PERFEKT},
   {type:'dict',label:'Verb 7',say:'ziehen',answer:'ich bin gezogen',placeholder:PERFEKT},
   {type:'dict',label:'Verb 8',say:'lernen',answer:'ich habe gelernt',placeholder:PERFEKT},
  ]},
 {id:'t12',number:12,title:'Diktat: Perfekt mit haben und sein',hint:'Her cümleyi dinle ve yaz. Yılları rakamla yaz.',dictation:true,
  questions:[
   {type:'dict',say:'Ich bin zweitausendsechs nach Deutschland gekommen.',answer:'Ich bin 2006 nach Deutschland gekommen.'},
   {type:'dict',answer:'Zuerst habe ich Deutsch gelernt.'},
   {type:'dict',answer:'Die Ausbildung hat zwei Jahre gedauert.'},
   {type:'dict',answer:'Dann habe ich einen Laden gefunden.'},
   {type:'dict',answer:'Ich bin in Oldenburg geblieben.'},
  ]},
 {id:'t13',number:13,part:'Richtig schreiben',title:'f oder v? Wörter-Diktat',hint:'Kelimeyi dinle ve yaz. f ve v aynı okunur; doğru harfi hatırlamaya çalış.',dictation:true,
  questions:['vier','Familie','verdienen','Freund','Vater','finden','Verkäufer','fünf','von','Firma'].map((answer,i)=>({type:'dict' as const,label:'Wort '+(i+1),answer}))},
 {id:'t14',number:14,part:'Prüfungstraining',title:'Hören wie in der Prüfung',hint:'Her parçayı iki kez dinle (sınavda da iki kez çalınır). Sonra cevapla.',dictation:true,
  questions:[
   {type:'mc',label:'Durchsage',say:'Achtung, eine Durchsage: Der Deutschkurs A1 beginnt heute nicht um 18 Uhr. Der Kurs beginnt heute erst um 19 Uhr, in Raum 2.04. Vielen Dank.',text:'Der Deutschkurs beginnt heute um 18 Uhr.',options:['richtig','falsch'],answer:1},
   {type:'mc',label:'Anruf',say:'Hallo, hier ist Frau Berger vom Hotel Lindenhof. Sie können am Montag um 9 Uhr mit dem Praktikum anfangen. Bitte bringen Sie Ihren Pass mit. Bis Montag!',text:'Wann beginnt das Praktikum?',options:['am Montag um 8 Uhr','am Montag um 9 Uhr','am Dienstag um 9 Uhr'],answer:1},
   {type:'mc',label:'Anruf',say:'Hallo, hier ist Frau Berger vom Hotel Lindenhof. Sie können am Montag um 9 Uhr mit dem Praktikum anfangen. Bitte bringen Sie Ihren Pass mit. Bis Montag!',text:'Was muss man mitbringen?',options:['ein Foto','die Bewerbung','den Pass'],answer:2},
   {type:'mc',label:'Dialog',say:'Entschuldigung, wo ist die Berufsschule? Die Berufsschule? Gehen Sie hier geradeaus und dann links. Sie ist neben der Post. Vielen Dank!',text:'Wo ist die Berufsschule?',options:['neben dem Bahnhof','neben der Post','neben der Bank'],answer:1},
   {type:'mc',label:'Dialog 2',say:'Guten Tag, ich möchte einen Termin bei Frau Doktor Keller. Geht es am Freitag? Am Freitag ist leider alles voll. Am Donnerstag um 15 Uhr ist frei. Ja, Donnerstag ist gut. Danke!',text:'Wann ist der Termin?',options:['am Freitag um 15 Uhr','am Donnerstag um 15 Uhr','am Donnerstag um 5 Uhr'],answer:1},
  ]},
];

/** What a dictation or listening question reads aloud. */
export const questionSpeech=(q:HoerenQuestion)=>q.type==='dict'?q.say??q.answer:q.type==='mc'?q.say:undefined;

/** Every German text the Lektion 12 pages read aloud (for the natural site voices). */
export function ausbildungSpeechTexts(){
 const texts:string[]=[...lessonSpeechTexts()];
 for(const task of hoerenTasks){
  for(const line of task.lines??[])texts.push(line.text);
  for(const q of task.questions){const text=questionSpeech(q);if(text)texts.push(text);}
 }
 return [...new Set(texts)];
}
