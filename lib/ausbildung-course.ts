/**
 * Lektion 12 „Ausbildung" (A1.2): the whole chapter in book order — Teil A–D, Richtig schreiben,
 * the „Alles klar?" test, Prüfungstraining and Magazin. Explanations are Turkish (the learner's
 * class notes); German material stays German. Listening tasks live in ausbildung-hoeren.ts.
 *
 * Inline markup in texts: *German* (italic, read as German) and **bold**.
 * Gap texts mark each blank with ___; `answers[i]` lists the accepted answers for blank i.
 */
/** The chapter's page; the listening page is AUSBILDUNG_PATH + '/hoeren'. */
export const AUSBILDUNG_PATH='/a1-2/ausbildung';
export type L12PartId='a'|'b'|'c'|'d'|'schreiben'|'test'|'pruefung'|'magazin';
/** One row of a word table: German, Turkish and, when it differs from the German column, what is read aloud. */
export type L12Word=readonly [de:string,tr:string,say?:string];
export type L12Block=
 |{t:'p';text:string}
 |{t:'h';text:string}
 |{t:'list';items:string[];ordered?:boolean}
 |{t:'note';text:string}
 |{t:'vocab';title?:string;lead?:string;words:L12Word[]}
 |{t:'table';head:string[];rows:string[][];frame?:boolean}
 |{t:'letter';lines:string[]}
 |{t:'listen';sections:number[];text?:string};
export type L12Item=
 |{k:'gap';text:string;answers:string[][]}
 |{k:'choice';text:string;options:string[];answer:number}
 |{k:'sentence';prompt:string;answers:string[]}
 |{k:'open';prompt:string;sample?:string}
 |{k:'pick';prompt:string;options:string[];accept:string[];need:number};
export type L12Exercise={
 id:string;title:string;hint?:string;
 /** A German reading text shown above the items (lines; a line may start with "**Name:**"). */
 reading?:{title?:string;lines:string[]};
 /** Word bank shown above the items. */
 bank?:string[];
 items:L12Item[];
 /** Extra solution text shown with the answer key (for open tasks). */
 key?:string;
 /** Points in the „Alles klar?" test. */
 points?:number;
};
export type L12Section={id:string;title:string;blocks:L12Block[]};
export type L12Part={id:L12PartId;badge:string;title:string;de:string;lead:string;
 /** A shorter line for the overview card (the lead is used when missing). */
 card?:string;sections:L12Section[];exercises:L12Exercise[];listen?:number[];after?:L12Block[]};

const RF=['richtig','falsch'];
const rf=(text:string,right:boolean):L12Item=>({k:'choice',text,options:RF,answer:right?0:1});

export const lessonRoadmap=[
 'Teil A – Was wollen Sie noch lernen? → *können / wollen* + eğitim-meslek kelimeleri',
 'Teil B – Sie ist nach Berlin gegangen. → Perfekt mit *sein* + yıllar',
 'Teil C – Ich mache ein Praktikum. → *seit / vor / in* + resmî e-posta (Bewerbung)',
 'Teil D – Ich bin nach Oldenburg gekommen … → Perfekt tekrarı (*haben* + *sein*)',
 'Richtig schreiben (f/v) + Alles klar? ünite testi',
 'Prüfungstraining (Lesen + Schreiben) + Magazin',
];

const teilA:L12Part={
 id:'a',badge:'A',title:'Was wollen Sie noch lernen?',de:'Teil A',
 lead:'*können / wollen* + eğitim ve meslek kelimeleri.',
 sections:[
  {id:'woerter',title:'Kelimeler (Wortschatz)',blocks:[
   {t:'p',text:'*Ausbildung* Almanya\'da çok önemli bir kavram: üniversite değil, 2–3 yıl süren meslek eğitimi. Hem şirkette çalışırsın hem Berufsschule\'ye gidersin, maaş da alırsın. *Praktikum* ise kısa staj (birkaç hafta/ay).'},
   {t:'vocab',title:'Eğitim yerleri',words:[
    ['die Ausbildung, -en','meslek eğitimi'],
    ['die Berufsschule, -n','meslek okulu'],
    ['die Sprachschule, -n','dil okulu'],
    ['die Universität, -en','üniversite'],
    ['die Firma, Firmen','şirket'],
    ['das Praktikum, Praktika','staj'],
    ['die VHS (Volkshochschule)','halk eğitim merkezi','die VHS, die Volkshochschule'],
    ['der Ausbildungsplatz, -plätze','eğitim / çıraklık yeri'],
   ]},
   {t:'vocab',title:'Kişiler',words:[
    ['der Praktikant / die Praktikantin','stajyer','der Praktikant, die Praktikantin'],
    ['der Gärtner / die Gärtnerin','bahçıvan','der Gärtner, die Gärtnerin'],
    ['der Kunde / die Kundin','müşteri','der Kunde, die Kundin'],
    ['der Tierarzt / die Tierärztin','veteriner','der Tierarzt, die Tierärztin'],
   ]},
   {t:'vocab',title:'Fiiller',lead:'*an|bieten* ve *mit|machen* ayrılabilir fiiller: ön ek (an, mit) cümlenin sonuna gider.',words:[
    ['fotografieren','fotoğraf çekmek'],
    ['nähen','dikiş dikmek'],
    ['reparieren','tamir etmek'],
    ['prüfen','kontrol etmek, test etmek'],
    ['korrigieren','düzeltmek'],
    ['recherchieren','araştırmak (internette)'],
    ['speichern','kaydetmek (bilgisayarda)'],
    ['drucken','yazdırmak'],
    ['an|bieten','sunmak → *Die VHS bietet einen Kurs an.*','anbieten'],
    ['mit|machen','katılmak → *Machst du mit?*','mitmachen'],
    ['studieren','üniversitede okumak'],
    ['backen','fırında pişirmek'],
   ]},
   {t:'vocab',title:'Diğer kelimeler',words:[
    ['die Bewerbung, -en','başvuru (iş / staj)'],
    ['die Anzeige, -n','ilan'],
    ['die Information, -en','bilgi'],
    ['die Reparatur, -en','tamir'],
    ['die Übung, -en','alıştırma'],
    ['der Text, -e','metin'],
    ['die Kamera, -s','kamera'],
    ['selbstständig','kendi başına, bağımsız / serbest'],
    ['leicht ≠ schwer','kolay ≠ zor','leicht, schwer'],
    ['bequem','rahat'],
    ['lieber','daha çok, tercihen'],
    ['wieder','tekrar'],
   ]},
   {t:'h',text:'Kalıplar'},
   {t:'list',items:['*Ich kann gut …* → … iyi yapabiliyorum.','*Ich kann noch nicht so gut …* → … henüz pek iyi yapamıyorum.','*Ich will einen Kurs / eine Ausbildung machen.* → Kurs / meslek eğitimi yapmak istiyorum.']},
  ]},
  {id:'gramer',title:'Gramer: können ve wollen',blocks:[
   {t:'p',text:'İki modal fiil de aynı kuralla çalışır: modal fiil 2. sırada, asıl fiil mastar halinde cümlenin sonunda.'},
   {t:'h',text:'können = yapabilmek (tekrar)'},
   {t:'table',head:['tekil','çoğul'],rows:[['ich kann','wir können'],['du kannst','ihr könnt'],['er/sie/es kann','sie/Sie können']]},
   {t:'p',text:'İki anlamı var:'},
   {t:'list',ordered:true,items:['Yetenek: *Ana kann gut Deutsch sprechen.* (öğrendi, yapabiliyor)','İmkân: *Ana kann einen Kurs machen.* (bu mümkün)']},
   {t:'h',text:'wollen = istemek (yeni)'},
   {t:'table',head:['tekil','çoğul'],rows:[['ich will','wir wollen'],['du willst','ihr wollt'],['er/sie/es will','sie/Sie wollen']]},
   {t:'note',text:'Dikkat: Tekilde sesli harf değişir: o → i. *ich* ve *er/sie/es* aynı: ikisi de **will**, sonuna -t gelmez. Arbeitsbuch 2.4\'te „Herr Berkane **wollen**" yazılmış → doğrusu „Herr Berkane **will**" (Herr Berkane = er). Almanca *will*, İngilizce *will* (gelecek zaman) değil. *Ich will* = istiyorum.'},
   {t:'h',text:'wollen mi, möchte mi?'},
   {t:'list',items:['*Ich will* → güçlü istek, niyet, plan.','*Ich möchte* → kibar istek. (Restoranda: *Ich möchte einen Kaffee.*)']},
   {t:'p',text:'Resmî yerde ve yazıda *möchte* daha nazik; arkadaşla *will* normal.'},
   {t:'h',text:'Cümle yapısı (Satzklammer)'},
   {t:'table',frame:true,head:['1','2 = Modalverb','…','Son = Infinitiv'],rows:[['Dunya','will','eine Ausbildung','machen.'],['Ich','kann','gut Deutsch','sprechen.'],['Was','willst','du','lernen?'],['–','Willst','du einen Kurs','machen?']]},
   {t:'p',text:'Evet/hayır sorusunda modal fiil 1. sıraya geçer. Ayrılabilir fiil sonda bitişik yazılır: *Ich will beim Kurs mitmachen.*'},
   {t:'h',text:'Olumsuz + lieber'},
   {t:'p',text:'*Anton will keine Hausaufgaben machen. Er will lieber schlafen.*'},
   {t:'list',items:['**kein/keine** → isimden önce (keine Hausaufgaben, kein Eis)','**nicht** → fiilin önünde (Er will nicht arbeiten.)','**lieber** → onun yerine daha çok …']},
   {t:'h',text:'Tavsiye verme (Tipps geben) – Kursbuch 3b'},
   {t:'list',items:['– *Ich will vegetarisch kochen.*','– *Du kannst einen Kochkurs machen. Der Kurs K-203 ist für dich interessant. Dort kannst du Curry kochen.*']},
  ]},
 ],
 exercises:[
  {id:'a1',title:'Ü1 · Was können die Personen gut?',hint:'Tam cümle yaz. Örnek: *Leyla kann gut Taschen nähen.*',items:[
   {k:'sentence',prompt:'Leyla – Taschen nähen',answers:['Leyla kann gut Taschen nähen.']},
   {k:'sentence',prompt:'Omar – Autos reparieren',answers:['Omar kann gut Autos reparieren.']},
   {k:'sentence',prompt:'Frau Weber – Kuchen backen',answers:['Frau Weber kann gut Kuchen backen.']},
   {k:'sentence',prompt:'Tim und Lea – tanzen',answers:['Tim und Lea können gut tanzen.']},
   {k:'open',prompt:'ich – …',sample:'Ich kann gut kochen.'},
  ]},
  {id:'a2',title:'Ü2 · Und Sie?',hint:'3 cümle: iki tane *Ich kann gut …*, bir tane *Ich kann noch nicht so gut …*. İstersen mesleğinle başla: *Ich bin Tierarzt/Tierärztin von Beruf. Ich kann gut …*',items:[
   {k:'open',prompt:'Ich kann gut …',sample:'Ich bin Tierarzt von Beruf. Ich kann gut Tiere untersuchen.'},
   {k:'open',prompt:'Ich kann gut …',sample:'Ich kann gut Englisch sprechen.'},
   {k:'open',prompt:'Ich kann noch nicht so gut …',sample:'Ich kann noch nicht so gut Deutsch schreiben.'},
  ]},
  {id:'a3',title:'Ü3 · Was passt zusammen?',hint:'Her isim için uyan 2 fiil seç. Örnek: *Informationen recherchieren, Informationen speichern*',items:[
   {k:'pick',prompt:'Informationen',options:['suchen','recherchieren','reparieren','korrigieren','machen','prüfen','schreiben','speichern','anbieten','finden'],accept:['suchen','recherchieren','speichern','finden','prüfen'],need:2},
   {k:'pick',prompt:'Texte',options:['suchen','recherchieren','reparieren','korrigieren','machen','prüfen','schreiben','speichern','anbieten','finden'],accept:['schreiben','korrigieren','speichern','prüfen'],need:2},
   {k:'pick',prompt:'Autos',options:['suchen','recherchieren','reparieren','korrigieren','machen','prüfen','schreiben','speichern','anbieten','finden'],accept:['reparieren','prüfen'],need:2},
   {k:'pick',prompt:'einen Ausbildungsplatz',options:['suchen','recherchieren','reparieren','korrigieren','machen','prüfen','schreiben','speichern','anbieten','finden'],accept:['suchen','finden','anbieten'],need:2},
   {k:'pick',prompt:'ein Praktikum',options:['suchen','recherchieren','reparieren','korrigieren','machen','prüfen','schreiben','speichern','anbieten','finden'],accept:['machen','suchen','finden','anbieten'],need:2},
  ]},
  {id:'a4',title:'Ü4 · wollen',hint:'Boşlukları doldur.',items:[
   {k:'gap',text:'Ich ___ einen Deutschkurs machen.',answers:[['will']]},
   {k:'gap',text:'___ du in Berlin bleiben?',answers:[['Willst']]},
   {k:'gap',text:'Meine Schwester ___ eine Ausbildung machen.',answers:[['will']]},
   {k:'gap',text:'Wir ___ zusammen üben.',answers:[['wollen']]},
   {k:'gap',text:'Was ___ ihr am Wochenende machen?',answers:[['wollt']]},
   {k:'gap',text:'Herr und Frau Kaya ___ ein Praktikum in einer Gärtnerei machen.',answers:[['wollen']]},
   {k:'gap',text:'Mein Freund ___ lieber in der Sprachschule lernen.',answers:[['will']]},
  ]},
  {id:'a5',title:'Ü5 · nicht / kein + lieber',hint:'Her kişi için iki cümle yaz. Örnek: *Sara will nicht arbeiten. Sie will lieber Urlaub machen.*',items:[
   {k:'sentence',prompt:'Sara: arbeiten ✗ → Urlaub machen ✓',answers:['Sara will nicht arbeiten. Sie will lieber Urlaub machen.']},
   {k:'sentence',prompt:'Ben: kochen ✗ → Essen bestellen ✓',answers:['Ben will nicht kochen. Er will lieber Essen bestellen.']},
   {k:'sentence',prompt:'wir: früh aufstehen ✗ → lange schlafen ✓',answers:['Wir wollen nicht früh aufstehen. Wir wollen lieber lange schlafen.']},
   {k:'sentence',prompt:'ihr: Hausaufgaben machen ✗ → Musik hören ✓',answers:['Ihr wollt keine Hausaufgaben machen. Ihr wollt lieber Musik hören.']},
  ]},
  {id:'a6',title:'Ü6 · Lesen: richtig oder falsch?',reading:{title:'Forum: Neu in Berlin',lines:[
   '**Deniz:** Hallo! Ich bin neu in Berlin und ich will einen Deutschkurs machen. Ich arbeite jeden Tag bis 18 Uhr in einer Tierklinik. Ich habe nur am Abend Zeit. Die VHS bietet am Abend einen Online-Kurs an. Ist ein Online-Kurs gut? Ich kann gut Deutsch verstehen, aber noch nicht so gut sprechen.',
   '**Lena:** Hi Deniz! Ich habe schon einen Online-Kurs gemacht. Der Kurs ist bequem, man lernt zu Hause. Aber man spricht nicht so viel. Ich will jetzt lieber in der Sprachschule lernen.',
   '**Paul:** Mein Bruder hat online Deutsch gelernt. Er findet, online ist praktisch und nicht so teuer. Er will jetzt einen A2-Kurs machen – wieder online.',
  ]},items:[
   rf('Deniz arbeitet in einer Tierklinik.',true),
   rf('Deniz hat am Vormittag Zeit.',false),
   rf('Deniz kann schon gut sprechen.',false),
   rf('Lena will wieder einen Online-Kurs machen.',false),
   rf('Pauls Bruder findet Online-Kurse praktisch.',true),
   rf('Pauls Bruder will einen A2-Kurs machen.',true),
  ]},
 ],
 listen:[1,2,3],
};

const teilB:L12Part={
 id:'b',badge:'B',title:'Sie ist nach Berlin gegangen.',de:'Teil B',
 lead:'Geçmişi anlatmak (Perfekt mit *sein*), yıllar, eğitim hayatı ve hedefler.',
 sections:[
  {id:'woerter',title:'Kelimeler',blocks:[
   {t:'vocab',words:[
    ['das Abitur (Sg.)','lise bitirme sınavı / diploması','das Abitur'],
    ['die Abendschule, -n','akşam okulu'],
    ['das Ziel, -e','hedef'],
    ['die Chance, -n','şans, fırsat → *bessere Chancen haben*'],
    ['der Laden, Läden','dükkân → *einen Laden haben*'],
    ['der Job, -s','iş → *einen Job finden*'],
    ['früher','eskiden'],
    ['jetzt / später','şimdi / daha sonra','jetzt, später'],
    ['mehr','daha fazla → *noch mehr lernen*'],
    ['bleiben','kalmak'],
    ['geboren sein','doğmuş olmak → *Ich bin 1993 geboren.*'],
    ['fliegen','uçmak, uçakla gitmek'],
    ['ziehen: nach Berlin ziehen','taşınmak','nach Berlin ziehen'],
    ['schicken','göndermek → *Geld an die Familie schicken*'],
    ['verdienen: Geld verdienen','para kazanmak','Geld verdienen'],
    ['der Friseur / die Friseurin','kuaför','der Friseur, die Friseurin'],
    ['der Verkäufer / die Verkäuferin','satış elemanı','der Verkäufer, die Verkäuferin'],
    ['der Koch / die Köchin','aşçı','der Koch, die Köchin'],
    ['der Ingenieur / die Ingenieurin','mühendis','der Ingenieur, die Ingenieurin'],
    ['der Mechatroniker / die Mechatronikerin','mekatronik teknisyeni','der Mechatroniker, die Mechatronikerin'],
    ['als … arbeiten','… olarak çalışmak → *Ich arbeite als Tierarzt/Tierärztin.*','als Tierarzt arbeiten'],
   ]},
   {t:'h',text:'Kalıplar'},
   {t:'list',items:['*Ich bin … geboren.*','*Ich bin von … bis … zur Schule gegangen.*','*Ich habe von … bis … eine Ausbildung gemacht / studiert.*','*Ich habe als … gearbeitet.*','*… bin ich nach Deutschland gekommen.*']},
  ]},
  {id:'gramer',title:'Gramer: Perfekt mit sein',blocks:[
   {t:'p',text:'**Perfekt (tekrar):** konuşma dilinin geçmiş zamanı. İki parça: **haben/sein** 2. sırada + **Partizip II** cümlenin sonunda.'},
   {t:'table',head:['Partizip II kuralı','Örnek'],rows:[
    ['Düzenli: ge + kök + t','*machen → gemacht, lernen → gelernt, arbeiten → gearbeitet*'],
    ['Düzensiz: ge + (değişen kök) + en','*gehen → gegangen, kommen → gekommen, fahren → gefahren, fliegen → geflogen, bleiben → geblieben, ziehen → gezogen, sehen → gesehen*'],
    ['-ieren ile bitenler: ge yok','*studieren → studiert, reparieren → repariert*'],
    ['be-, ver-, er- ile başlayanlar: ge yok','*besuchen → besucht, verdienen → verdient*'],
    ['Ayrılabilir fiil: ge ortaya','*aufstehen → aufgestanden, einkaufen → eingekauft*'],
   ]},
   {t:'p',text:'**Perfekt mit sein – hangi fiiller?** (1) Bir yerden bir yere hareket: *gehen, kommen, fahren, fliegen, ziehen, laufen*. (2) Durum değişikliği: *aufstehen, einschlafen*. (3) Ayrıca: *bleiben, sein (→ gewesen), passieren*. Gerisi hep *haben*.'},
   {t:'note',text:'Kısa test: „A\'dan B\'ye gidiyor mu?" → *sein*.'},
   {t:'table',head:['Infinitiv','Partizip II','Örnek'],rows:[
    ['gehen','gegangen','*Ich bin zur Schule gegangen.*'],
    ['kommen','gekommen','*2019 bin ich nach Deutschland gekommen.*'],
    ['fahren','gefahren','*Wir sind nach Hamburg gefahren.*'],
    ['fliegen','geflogen','*Sie ist nach Berlin geflogen.*'],
    ['ziehen','gezogen','*Ich bin 2020 nach Berlin gezogen.*'],
    ['bleiben','geblieben','*Er ist ein Jahr in Köln geblieben.*'],
    ['aufstehen','aufgestanden','*Ich bin um 7 Uhr aufgestanden.*'],
   ]},
   {t:'p',text:'**sein çekimi:** *ich bin · du bist · er/sie/es ist · wir sind · ihr* **seid** *· sie/Sie sind*. Dikkat: *ihr seid* (d ile); *seit* = -den beri.'},
   {t:'h',text:'Cümle yapısı'},
   {t:'table',frame:true,head:['1','2 = sein/haben','…','Son = Partizip II'],rows:[
    ['Karim','ist','von 1998 bis 2008 zur Schule','gegangen.'],
    ['2021','bin','ich nach Deutschland','gekommen.'],
    ['Wann','bist','du nach Berlin','gezogen?'],
    ['Ich','habe','als Friseur','gearbeitet.'],
   ]},
   {t:'p',text:'Yıl başa gelince özne fiilin arkasına geçer: *2021 bin ich …*'},
   {t:'h',text:'Yıllar'},
   {t:'list',items:['1991 → *neunzehnhunderteinundneunzig*','1987 → *neunzehnhundertsiebenundachtzig*','2008 → *zweitausendacht*','2019 → *zweitausendneunzehn*']},
   {t:'p',text:'Kural: 1100–1999 → „…hundert + sayı"; 2000\'den sonra → „zweitausend + sayı". Yılın önüne **in** gelmez: *Ich bin 2019 gekommen.* (istersen *im Jahr 2019*).'},
   {t:'p',text:'**geboren:** *Ich bin 1988 geboren.* · *Wann bist du geboren?* · *Wo bist du geboren? – In Izmir.*'},
   {t:'p',text:'**Zeitstrahl (früher – jetzt – Ziel):** *Früher habe ich als Verkäufer gearbeitet. Jetzt mache ich eine Ausbildung. Später will ich einen Laden haben.* Neden Ausbildung? → *schnell Geld verdienen · noch mehr lernen · bessere Chancen haben · Geld an die Familie schicken*'},
   {t:'note',text:'**Arbeitsbuch s. 138 düzeltmeleri:** 2.2: geflogen → fliegen · 2.3: „Iván ist …": geblieben, gefahren, gegangen, gekommen, gezogen; „Iván hat …": gearbeitet, gemacht · sein tablosu: ihr seid · 2.4: 1 gegangen, 2 gekommen, 3 geblieben, 4 gezogen (sein/haben\'dan sonra hep Partizip II gelir, mastar değil).'},
  ]},
 ],
 exercises:[
  {id:'b1',title:'Ü1 · Partizip II',hint:'Fiilin Partizip II biçimini yaz.',items:[
   {k:'gap',text:'gehen → ___',answers:[['gegangen']]},
   {k:'gap',text:'kommen → ___',answers:[['gekommen']]},
   {k:'gap',text:'fahren → ___',answers:[['gefahren']]},
   {k:'gap',text:'fliegen → ___',answers:[['geflogen']]},
   {k:'gap',text:'bleiben → ___',answers:[['geblieben']]},
   {k:'gap',text:'ziehen → ___',answers:[['gezogen']]},
   {k:'gap',text:'machen → ___',answers:[['gemacht']]},
   {k:'gap',text:'arbeiten → ___',answers:[['gearbeitet']]},
   {k:'gap',text:'studieren → ___',answers:[['studiert']]},
   {k:'gap',text:'aufstehen → ___',answers:[['aufgestanden']]},
  ]},
  {id:'b2',title:'Ü2 · haben oder sein?',hint:'Her biçim için *ich habe …* mi, *ich bin …* mi?',items:['gearbeitet','gegangen','gelernt','geblieben','gemacht','gekommen','studiert','gezogen','gefahren','gekauft','aufgestanden','geflogen'].map(word=>({k:'choice' as const,text:word,options:['ich habe','ich bin'],answer:['gegangen','geblieben','gekommen','gezogen','gefahren','aufgestanden','geflogen'].includes(word)?1:0}))},
  {id:'b3',title:'Ü3 · Was passt?',hint:'Kelimeleri metne yerleştir.',bank:['gearbeitet','geblieben','gefahren','gegangen','gekommen','gemacht','gezogen'],items:[
   {k:'gap',text:'Ich bin Lina. Ich bin in Lissabon, in Portugal, geboren und ich bin dort bis 2014 zur Schule ___ (1). Dann habe ich zwei Jahre in einem Café ___ (2). 2016 bin ich nach Porto ___ (3) und ich habe dort eine Ausbildung zur Köchin ___ (4). 2021 bin ich nach Deutschland ___ (5). Zuerst bin ich drei Monate in München ___ (6). Dann bin ich mit dem Zug nach Berlin ___ (7). Und hier bin ich bis heute!',answers:[['gegangen'],['gearbeitet'],['gezogen'],['gemacht'],['gekommen'],['geblieben'],['gefahren']]},
  ]},
  {id:'b4',title:'Ü4 · Sätze schreiben',hint:'Perfekt cümlesi kur.',items:[
   {k:'sentence',prompt:'Sie / 1993 / in Beirut / geboren sein',answers:['Sie ist 1993 in Beirut geboren.']},
   {k:'sentence',prompt:'Er / von 2005 bis 2017 / zur Schule gehen',answers:['Er ist von 2005 bis 2017 zur Schule gegangen.']},
   {k:'sentence',prompt:'Wir / 2021 / nach Köln kommen',answers:['Wir sind 2021 nach Köln gekommen.']},
   {k:'sentence',prompt:'Ich / ein Jahr / in Hamburg bleiben',answers:['Ich bin ein Jahr in Hamburg geblieben.']},
   {k:'sentence',prompt:'Meine Eltern / 2010 / nach Berlin ziehen',answers:['Meine Eltern sind 2010 nach Berlin gezogen.']},
   {k:'sentence',prompt:'Wann / du / nach Deutschland kommen? (Frage)',answers:['Wann bist du nach Deutschland gekommen?']},
  ]},
  {id:'b5',title:'Ü5 · Jahreszahlen',hint:'Yılı yazıyla yaz (bitişik).',items:[
   {k:'gap',text:'1988 → ___',answers:[['neunzehnhundertachtundachtzig']]},
   {k:'gap',text:'2004 → ___',answers:[['zweitausendvier']]},
   {k:'gap',text:'2015 → ___',answers:[['zweitausendfünfzehn']]},
   {k:'gap',text:'1976 → ___',answers:[['neunzehnhundertsechsundsiebzig']]},
   {k:'gap',text:'2021 → ___',answers:[['zweitausendeinundzwanzig']]},
  ]},
  {id:'b6',title:'Ü6 · haben oder sein?',hint:'Yardımcı fiili ve Partizip II\'yi yaz.',items:[
   {k:'gap',text:'**Lara:** Hi Ben! Was ___ du gestern ___ ? (machen)',answers:[['hast'],['gemacht']]},
   {k:'gap',text:'**Ben:** Ich ___ um 7 Uhr ___ (aufstehen).',answers:[['bin'],['aufgestanden']]},
   {k:'gap',text:'Dann ___ ich zur Arbeit ___ (fahren).',answers:[['bin'],['gefahren']]},
   {k:'gap',text:'Ich ___ bis 17 Uhr ___ (arbeiten) und dann ___ ich noch ___ (einkaufen).',answers:[['habe'],['gearbeitet'],['habe'],['eingekauft']]},
   {k:'gap',text:'Am Abend ___ ich zu Hause ___ (bleiben) und ich ___ einen Film ___ (sehen). Und du?',answers:[['bin'],['geblieben'],['habe'],['gesehen']]},
   {k:'gap',text:'**Lara:** Ich ___ nach Potsdam ___ (fahren).',answers:[['bin'],['gefahren']]},
   {k:'gap',text:'Ich ___ dort meine Tante ___ (besuchen).',answers:[['habe'],['besucht']]},
   {k:'gap',text:'Wir ___ zusammen ___ (kochen) und ich ___ erst um 23 Uhr nach Hause ___ (kommen).',answers:[['haben'],['gekocht'],['bin'],['gekommen']]},
  ]},
  {id:'b7',title:'Ü7 · Schreiben: Mein Zeitstrahl',hint:'Kendin hakkında 6 cümle yaz.',items:[
   {k:'open',prompt:'Mein Zeitstrahl (6 Sätze)',sample:'Ich bin 1988 in Izmir geboren. Ich bin von 1994 bis 2006 zur Schule gegangen. Ich habe von 2006 bis 2011 Tiermedizin studiert. Ich habe zehn Jahre als Tierarzt gearbeitet. 2024 bin ich nach Berlin gekommen. Jetzt lerne ich Deutsch. Mein Ziel: Ich will wieder als Tierarzt arbeiten.'},
  ],key:'Kalıp: *Ich bin … in … geboren. Ich bin von … bis … zur Schule gegangen. Ich habe von … bis … Tiermedizin studiert. Ich habe … Jahre als Tierarzt/Tierärztin gearbeitet. 20… bin ich nach Berlin gekommen. Jetzt lerne ich Deutsch. Mein Ziel: Ich will …*'},
 ],
 listen:[4,5,6],
};

const teilC:L12Part={
 id:'c',badge:'C',title:'Ich mache ein Praktikum.',de:'Teil C',
 lead:'Zaman edatları *seit / vor / in* + resmî e-posta (staj başvurusu). Bu e-posta formatı sınavda (Schreiben) aynen çıkıyor.',card:'*seit / vor / in* + resmî e-posta (Bewerbung).',
 sections:[
  {id:'woerter',title:'Kelimeler',blocks:[
   {t:'vocab',words:[
    ['das Hotel, -s','otel'],
    ['der Monat, -e · die Woche, -n','ay · hafta','der Monat, die Woche'],
    ['die Stunde, -n · die Minute, -n','saat (süre) · dakika','die Stunde, die Minute'],
    ['die Prüfung, -en','sınav'],
    ['das Team, -s: im Team arbeiten','ekip: ekip içinde çalışmak','das Team. Im Team arbeiten.'],
    ['das Pflegeheim, -e','bakımevi, huzurevi'],
    ['das Autohaus, -häuser','oto galeri / servis'],
    ['die Bäckerei, -en','fırın'],
    ['der Blumenladen, -läden','çiçekçi'],
    ['der Computerladen · der Fahrradladen','bilgisayar · bisiklet dükkânı','der Computerladen, der Fahrradladen'],
    ['die Tierklinik, -en · die Tierarztpraxis, -praxen','hayvan hastanesi · veteriner kliniği','die Tierklinik, die Tierarztpraxis'],
    ['die Rezeption','resepsiyon'],
    ['die Agentur für Arbeit','iş kurumu (İŞKUR gibi)'],
    ['dauern','sürmek → *Die Ausbildung dauert drei Jahre.*'],
    ['anfangen / beginnen','başlamak → *Wann können Sie anfangen?*','anfangen, beginnen'],
    ['fertig','bitmiş → *Ich mache die Ausbildung fertig.*'],
    ['seit · vor · in','-den beri · önce · sonra','seit, vor, in'],
    ['Seit wann? · Wie lange?','Ne zamandan beri? · Ne kadar süredir?','Seit wann? Wie lange?'],
    ['sich freuen auf','sabırsızlıkla beklemek → *Ich freue mich auf Ihre Antwort.*'],
    ['die Antwort, -en','cevap'],
    ['die Anrede · der Gruß','hitap · selam (mektupta)','die Anrede, der Gruß'],
   ]},
  ]},
  {id:'gramer',title:'Gramer: seit, vor, in',blocks:[
   {t:'table',head:['','Soru','Türkçe','Zaman','Örnek'],rows:[
    ['**vor**','Wann?','… önce','geçmiş → Perfekt','*Vor zwei Jahren habe ich in einem Hotel gearbeitet.*'],
    ['**seit**','Seit wann?','… -den beri','başladı, hâlâ sürüyor → Präsens','*Ich lerne seit zehn Monaten Deutsch.*'],
    ['**in**','Wann?','… sonra','gelecek → Präsens / möchte','*In drei Monaten mache ich die Prüfung.*'],
   ]},
   {t:'h',text:'Üç ipucu'},
   {t:'list',items:[
    'Türkçede „iki yıl **önce**" sona gelir, Almancada „**vor** zwei Jahren" başa gelir.',
    '*seit* + şimdiki zaman, Türkçe gibi: „10 aydır öğren**iyorum**" → *Ich lerne seit zehn Monaten Deutsch.* (*Ich habe seit … gelernt* ✗)',
    '*in* burada „içinde" değil, „sonra": *in drei Monaten* = üç ay sonra.',
   ]},
   {t:'h',text:'Dativ formu – üçü de Dativ ister'},
   {t:'table',head:['','der / das (Monat, Tag, Jahr)','die (Woche, Stunde, Minute)'],rows:[
    ['tekil (1)','seit / vor / in **einem** Monat, **einem** Jahr','seit / vor / in **einer** Woche, **einer** Stunde'],
    ['çoğul (2+)','zwei Monat**en**, drei Jahr**en**, fünf Tag**en**','vier Wochen, fünf Stunden, zehn Minuten'],
   ]},
   {t:'p',text:'Kural: tekilde *einem* (der/das) ya da *einer* (die); çoğulda ismin sonuna **-n** gelir (Jahren, Monaten, Tagen; Wochen, Stunden, Minuten zaten -n ile biter).'},
   {t:'h',text:'Soru – cevap'},
   {t:'list',items:['*Wann bist du nach Köln gekommen? – Vor drei Jahren.*','*Seit wann machst du die Ausbildung? – Seit einem Monat.*','*Wie lange lernst du schon Deutsch? – Schon seit zehn Monaten.*','*Wann möchtest du eine Firma haben? – In zehn Jahren.*']},
   {t:'p',text:'Zaman ifadesi başa gelince özne fiilin arkasına geçer: *Vor zwei Jahren habe ich …* · *Seit sechs Monaten lerne ich …* · *In drei Monaten mache ich …*'},
  ]},
  {id:'email',title:'Resmî e-posta: Bewerbung für ein Praktikum',blocks:[
   {t:'list',ordered:true,items:[
    '**Betreff:** *Bewerbung als Praktikant / Praktikantin*',
    '**Anrede:** *Sehr geehrte Frau Kurz,* / *Sehr geehrter Herr Lang,* / isim bilinmiyorsa *Sehr geehrte Damen und Herren,* → virgülden sonra **küçük harfle** devam',
    '**Was möchte ich?** – *Ich möchte gern ein Praktikum in Ihrem Hotel machen.*',
    '**Wer bin ich?** – *Ich komme aus … Ich wohne seit … in … Seit … lerne ich Deutsch.*',
    '**Warum bin ich gut?** – *Vor … habe ich als … gearbeitet. Ich arbeite gern mit … Ich kann gut …*',
    '**Schluss:** *Ich freue mich auf Ihre Antwort.*',
    '**Gruß:** *Mit freundlichen Grüßen* + ad soyad (virgül yok)',
   ]},
   {t:'table',head:['resmî (Sie)','özel (du)'],rows:[
    ['*Sehr geehrte Frau …, / Sehr geehrter Herr …,*','*Liebe Anna, / Lieber Tom, / Hallo Tom,*'],
    ['*Sie, Ihr, Ihre, Ihnen*','*du, dein, dich*'],
    ['*Mit freundlichen Grüßen*','*Viele Grüße / Liebe Grüße / Bis bald*'],
   ]},
   {t:'p',text:'*Ihrem / Ihrer:* in **Ihrem** Hotel (das), in **Ihrem** Blumenladen (der), in **Ihrer** Bäckerei (die), in **Ihrer** Tierklinik (die).'},
   {t:'h',text:'Örnek e-posta'},
   {t:'letter',lines:['Betreff: Bewerbung als Praktikantin','Sehr geehrte Frau Berger,','ich möchte gern ein Praktikum in Ihrer Bäckerei machen. Später möchte ich eine Ausbildung zur Bäckerin machen.','Ich komme aus Syrien und ich wohne seit zwei Jahren in Berlin. Seit einem Jahr lerne ich Deutsch und in zwei Monaten mache ich die Prüfung A2.','Vor drei Jahren habe ich in Damaskus in einer Bäckerei gearbeitet. Die Arbeit hat mir viel Spaß gemacht. Ich arbeite gern im Team und ich kann gut Brot backen.','Ich freue mich auf Ihre Antwort.','Mit freundlichen Grüßen','Rana Haddad']},
  ]},
 ],
 exercises:[
  {id:'c1',title:'Ü1 · seit, vor oder in?',items:[
   {k:'gap',text:'Wann kommt der Bus? – ___ fünf Minuten.',answers:[['In']]},
   {k:'gap',text:'Seit wann wohnst du in Berlin? – ___ einem Jahr.',answers:[['Seit']]},
   {k:'gap',text:'Wann hast du die Prüfung A1 gemacht? – ___ zwei Monaten.',answers:[['Vor']]},
   {k:'gap',text:'Seit wann lernt Ali Deutsch? – Schon ___ acht Monaten.',answers:[['seit']]},
   {k:'gap',text:'Wann bist du mit der Ausbildung fertig? – ___ zwei Jahren.',answers:[['In']]},
   {k:'gap',text:'Wann bist du nach Deutschland gekommen? – ___ drei Jahren.',answers:[['Vor']]},
  ]},
  {id:'c2',title:'Ü2 · einem oder einer?',items:[
   {k:'gap',text:'Vor ___ Woche habe ich eine Bewerbung geschrieben.',answers:[['einer']]},
   {k:'gap',text:'In ___ Monat beginnt der Kurs.',answers:[['einem']]},
   {k:'gap',text:'Seit ___ Jahr arbeite ich im Pflegeheim.',answers:[['einem']]},
   {k:'gap',text:'Der Film beginnt in ___ Stunde.',answers:[['einer']]},
   {k:'gap',text:'Seit ___ Woche lernt sie Arabisch.',answers:[['einer']]},
   {k:'gap',text:'Vor ___ Tag bin ich nach Berlin gekommen.',answers:[['einem']]},
  ]},
  {id:'c3',title:'Ü3 · Tekil mi, çoğul mu?',hint:'Örnek: seit / 2 / Jahr → *seit zwei Jahren*',items:[
   {k:'sentence',prompt:'vor / 1 / Monat',answers:['vor einem Monat']},
   {k:'sentence',prompt:'in / 3 / Woche',answers:['in drei Wochen','in 3 Wochen']},
   {k:'sentence',prompt:'seit / 1 / Stunde',answers:['seit einer Stunde']},
   {k:'sentence',prompt:'vor / 5 / Tag',answers:['vor fünf Tagen','vor 5 Tagen']},
   {k:'sentence',prompt:'in / 10 / Minute',answers:['in zehn Minuten','in 10 Minuten']},
  ]},
  {id:'c4',title:'Ü4 · Cümle tamamla',hint:'Kendinle ilgili yaz; *vor* → Perfekt, *seit* ve *in* → Präsens.',items:[
   {k:'open',prompt:'Vor fünf Jahren …',sample:'Vor fünf Jahren habe ich in Ankara gearbeitet.'},
   {k:'open',prompt:'Vor drei Stunden …',sample:'Vor drei Stunden habe ich gefrühstückt.'},
   {k:'open',prompt:'Seit zwei Monaten …',sample:'Seit zwei Monaten mache ich einen Deutschkurs.'},
   {k:'open',prompt:'Seit gestern …',sample:'Seit gestern bin ich krank.'},
   {k:'open',prompt:'In fünf Minuten …',sample:'In fünf Minuten trinke ich Kaffee.'},
   {k:'open',prompt:'In einem Jahr …',sample:'In einem Jahr mache ich die Prüfung B1.'},
  ]},
  {id:'c5',title:'Ü5 · Lesen: richtig oder falsch?',reading:{title:'„Ich arbeite gern mit Tieren!"',lines:[
   '*Herr Aydın, Sie machen ein Praktikum in einer Tierklinik. Warum?*','Ich bin Tierarzt von Beruf. In der Türkei habe ich sieben Jahre in einer Tierklinik gearbeitet. Vor einem Jahr bin ich nach Berlin gekommen. Jetzt muss ich zuerst gut Deutsch lernen.',
   '*Seit wann lernen Sie Deutsch?*','Seit zehn Monaten. In zwei Monaten mache ich die Prüfung B1.',
   '*Wie haben Sie das Praktikum gefunden?*','Ich habe eine Bewerbung an die Tierklinik Mitte geschrieben. Seit drei Wochen arbeite ich dort. Die Arbeit im Team macht Spaß.',
   '*Welche Ziele haben Sie?*','In einem Jahr möchte ich wieder als Tierarzt arbeiten. Und in fünf Jahren möchte ich vielleicht eine Praxis haben.',
  ]},items:[
   rf('Herr Aydın hat in der Türkei als Tierarzt gearbeitet.',true),
   rf('Er ist vor zehn Monaten nach Berlin gekommen.',false),
   rf('Er lernt seit zehn Monaten Deutsch.',true),
   rf('Er macht die Prüfung B1 in drei Monaten.',false),
   rf('Er arbeitet seit drei Wochen in der Tierklinik.',true),
   rf('In fünf Jahren möchte er wieder als Tierarzt arbeiten.',false),
   {k:'choice',text:'Verbinden: Wann ist Herr Aydın nach Berlin gekommen?',options:['Seit zehn Monaten.','In fünf Jahren.','Vor einem Jahr.'],answer:2},
   {k:'choice',text:'Verbinden: Seit wann lernt er Deutsch?',options:['Seit zehn Monaten.','In fünf Jahren.','Vor einem Jahr.'],answer:0},
   {k:'choice',text:'Verbinden: Wann möchte er eine Praxis haben?',options:['Seit zehn Monaten.','In fünf Jahren.','Vor einem Jahr.'],answer:1},
  ]},
  {id:'c6',title:'Ü6 · Prüfung: Sprachbausteine',hint:'Doğru olanı seç.',reading:{lines:['Sehr (1) Frau Weber,','ich möchte (2) ein Praktikum in Ihrem Blumenladen machen. Ich komme aus Polen und ich wohne (3) zwei Jahren in Berlin. Seit einem Jahr lerne ich Deutsch. (4) drei Jahren habe ich in Krakau in einem Blumenladen gearbeitet. Die Arbeit (5) Spaß gemacht.','Ich freue mich auf Ihre Antwort.','Mit freundlichen Grüßen','Ola Nowak']},items:[
   {k:'choice',text:'(1)',options:['geehrter','geehrte'],answer:1},
   {k:'choice',text:'(2)',options:['gern','lieber'],answer:0},
   {k:'choice',text:'(3)',options:['vor','seit'],answer:1},
   {k:'choice',text:'(4)',options:['Vor','In'],answer:0},
   {k:'choice',text:'(5)',options:['hat','ist'],answer:0},
  ]},
  {id:'c7',title:'Ü7 · Schreiben: Bewerbung',hint:'Bir ilan seç, 6–8 cümlelik başvuru yaz (7 adımı sırayla kullan).',reading:{lines:['**A** Bäckerei Blüning sucht Praktikant/in (4 Wochen). Bewerbung an Herrn Blüning.','**B** Tierklinik Mitte sucht Praktikant/in: Sie arbeiten gern mit Tieren, Sie sprechen Deutsch, Sie arbeiten gern im Team. Bewerbung an Frau Dr. Keller.']},items:[
   {k:'open',prompt:'Meine Bewerbung',sample:'Betreff: Bewerbung als Praktikant\nSehr geehrte Frau Dr. Keller,\nich möchte gern ein Praktikum in Ihrer Tierklinik machen. Ich komme aus der Türkei und ich wohne seit einem Jahr in Berlin. Seit zehn Monaten lerne ich Deutsch. Vor zwei Jahren habe ich in Izmir als Tierarzt gearbeitet. Ich arbeite gern mit Tieren und ich arbeite gern im Team.\nIch freue mich auf Ihre Antwort.\nMit freundlichen Grüßen\nKoray Coşkun'},
  ],key:'En sık hata: Anrede\'den sonra küçük harf, *seit* + Präsens, *Ihrem/Ihrer*. Bäckerei Blüning için Anrede: *Sehr geehrter Herr Blüning,*'},
 ],
 listen:[7,8,9],
};

const teilD:L12Part={
 id:'d',badge:'D',title:'Ich bin nach Oldenburg gekommen …',de:'Teil D',
 lead:'Bir röportajı anlamak, not almak (Notizen machen), başkası hakkında bilgi vermek. Gramer: Perfekt\'in tamamı – *haben* ve *sein* bir arada.',card:'Röportaj, not alma; Perfekt: *haben* ve *sein* bir arada.',
 sections:[
  {id:'woerter',title:'Kelimeler',blocks:[
   {t:'vocab',words:[
    ['der Florist / die Floristin','çiçek tasarımcısı, çiçekçi','der Florist, die Floristin'],
    ['die Gärtnerei, -en','fidanlık, bahçe işletmesi'],
    ['die Berufserfahrung','iş deneyimi'],
    ['von Beruf','mesleği → *Was ist sie von Beruf? – Floristin.*'],
    ['das Interview, -s','röportaj'],
    ['die Notiz, -en: Notizen machen','not: not almak','die Notiz. Notizen machen.'],
    ['die Region, -en','bölge'],
    ['am Anfang','başlangıçta'],
    ['zuerst – dann – später – jetzt','önce – sonra – daha sonra – şimdi','zuerst, dann, später, jetzt'],
    ['ein Jahr später','bir yıl sonra'],
    ['ein paar','birkaç → *ein paar Monate*'],
    ['dauern','sürmek → *Das hat zwei Jahre gedauert.*'],
    ['allein','yalnız, tek başına'],
    ['organisieren','organize etmek'],
    ['besser','daha iyi'],
    ['müde','yorgun'],
    ['einkaufen · verkaufen','alışveriş yapmak · satmak','einkaufen, verkaufen'],
    ['gefallen → Was hat Ihnen gefallen?','hoşa gitmek → Neyi beğendiniz?','gefallen. Was hat Ihnen gefallen?'],
    ['Viel Erfolg! · Herzlichen Dank!','Başarılar! · Çok teşekkürler!','Viel Erfolg! Herzlichen Dank!'],
    ['Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember','aylar (die Monate)','Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember'],
   ]},
  ]},
  {id:'gramer',title:'Gramer: Perfekt – büyük resim',blocks:[
   {t:'p',text:'**Hangi yardımcı fiil?** **sein** → A\'dan B\'ye hareket (*gehen, kommen, fahren, fliegen, ziehen*) + *bleiben* + *aufstehen* · **haben** → geri kalan her şey (*arbeiten, machen, lernen, suchen, finden, dauern, kaufen, verkaufen, organisieren …*)'},
   {t:'h',text:'Verb-Karten'},
   {t:'p',text:'Kartlara yaz, yürüyerek tekrar et; *sein*\'li fiilde ayağa kalk.'},
   {t:'table',head:['Infinitiv','Perfekt','Türkçe'],rows:[
    ['arbeiten','*ich habe gearbeitet*','çalıştım'],['machen','*ich habe gemacht*','yaptım'],['lernen','*ich habe gelernt*','öğrendim'],['suchen','*ich habe gesucht*','aradım'],['finden','*ich habe gefunden*','buldum'],['dauern','*es hat gedauert*','sürdü'],['kaufen','*ich habe gekauft*','satın aldım'],['verdienen','*ich habe verdient*','kazandım'],['studieren','*ich habe studiert*','üniversitede okudum'],
    ['kommen','*ich bin gekommen*','geldim'],['gehen','*ich bin gegangen*','gittim'],['bleiben','*ich bin geblieben*','kaldım'],['fahren','*ich bin gefahren*','(araçla) gittim'],['fliegen','*ich bin geflogen*','uçtum'],['ziehen','*ich bin gezogen*','taşındım'],
   ]},
   {t:'h',text:'Hikâye anlatma sırası'},
   {t:'p',text:'*Zuerst … Dann … Ein Jahr später … Jetzt … Seit …* – bu kelimeler başa gelince özne fiilin arkasına geçer: *Zuerst bin ich zur Sprachschule gegangen. Dann habe ich ein Praktikum gemacht. Ein Jahr später habe ich eine Ausbildung gemacht. Jetzt habe ich einen Laden.*'},
   {t:'p',text:'**von … bis …** → *von 2007 bis 2009* · *von Januar bis Mai 2021*'},
   {t:'h',text:'Notizen machen'},
   {t:'p',text:'Cümleyi kısalt, sadece yıl + ne + nerede: *„2010 habe ich ein Praktikum in einem Blumenladen gemacht."* → **2010: Praktikum, Blumenladen, Oldenburg** · *„Die Ausbildung hat zwei Jahre gedauert."* → **von 2011 bis 2013: Ausbildung zur Floristin**'},
   {t:'h',text:'Informationen weitergeben'},
   {t:'p',text:'*ich → er/sie, bin → ist, habe → hat, mein → sein/ihr:* *Ich bin 2006 nach Oldenburg gekommen.* → *Sie ist 2006 nach Oldenburg gekommen.*'},
  ]},
 ],
 exercises:[
  {id:'d1',title:'Ü1 · Lesen + Notizen',hint:'Oku, yılları işaretle, notları tamamla. Yılları rakamla yaz.',reading:{title:'Menschen aus unserer Region: Gekommen nach Bremen und geblieben in Bremen',lines:[
   'Nadia Haddad kommt aus Marokko und lebt seit 14 Jahren in Deutschland. Seit 2022 hat sie eine Bäckerei in Bremen.',
   '*Frau Haddad, wann sind Sie nach Deutschland gekommen?*','Ich bin 2011 nach Deutschland gekommen, nach Bremen. Und ich bin in Bremen geblieben. Die Stadt gefällt mir.',
   '*Was haben Sie am Anfang gemacht?*','Zuerst – von 2011 bis 2013 – bin ich zur Sprachschule gegangen. 2014 habe ich ein Praktikum in einer Bäckerei gemacht. Ein Jahr später habe ich dort eine Ausbildung zur Bäckerin gemacht. Die Ausbildung hat drei Jahre gedauert. Dann habe ich dort bis 2021 gearbeitet. 2022 habe ich eine Bäckerei gefunden.',
   '*Haben Sie in Marokko auch gearbeitet?*','Ja. In Marokko habe ich von 2005 bis 2010 in einem Hotel gearbeitet, in der Küche.',
   '*Wie ist die Arbeit in Ihrer Bäckerei?*','Ich stehe jeden Tag um 4 Uhr auf. Das ist nicht leicht! Von Januar bis Juni 2022 habe ich allein gearbeitet. Seit Juli arbeitet mein Mann auch hier. Er verkauft und ich backe.',
   '*Was wollen Sie noch lernen?*','Ich mache jetzt einen Online-Kurs: Wie organisiert man einen Laden? Später will ich eine zweite Bäckerei haben.',
  ]},items:[
   {k:'gap',text:'Name: ___',answers:[['Nadia Haddad']]},
   {k:'gap',text:'Beruf: ___',answers:[['Bäckerin']]},
   {k:'gap',text:'Ausbildung: von ___ bis ___: Deutschkurs, Bremen',answers:[['2011'],['2013']]},
   {k:'gap',text:'___: Praktikum, Bäckerei',answers:[['2014']]},
   {k:'gap',text:'von ___ bis ___: Ausbildung zur Bäckerin',answers:[['2015'],['2018']]},
   {k:'gap',text:'Berufserfahrung: von ___ bis ___: Hotel (Küche), Marokko',answers:[['2005'],['2010']]},
   {k:'gap',text:'von ___ bis ___: Bäckerin, Bremen',answers:[['2018'],['2021']]},
   {k:'gap',text:'seit ___: eigene Bäckerei',answers:[['2022']]},
  ],key:'„Ein Jahr später" = 2015, „drei Jahre gedauert" = 2018.'},
  {id:'d2',title:'Ü2 · Verb-Karten',hint:'„ich habe / ich bin + Partizip II" yaz (dauern → *es hat …*).',items:[
   {k:'sentence',prompt:'kommen',answers:['ich bin gekommen']},
   {k:'sentence',prompt:'bleiben',answers:['ich bin geblieben']},
   {k:'sentence',prompt:'arbeiten',answers:['ich habe gearbeitet']},
   {k:'sentence',prompt:'machen',answers:['ich habe gemacht']},
   {k:'sentence',prompt:'gehen',answers:['ich bin gegangen']},
   {k:'sentence',prompt:'lernen',answers:['ich habe gelernt']},
   {k:'sentence',prompt:'finden',answers:['ich habe gefunden']},
   {k:'sentence',prompt:'dauern (es)',answers:['es hat gedauert']},
   {k:'sentence',prompt:'ziehen',answers:['ich bin gezogen']},
   {k:'sentence',prompt:'suchen',answers:['ich habe gesucht']},
   {k:'sentence',prompt:'fahren',answers:['ich bin gefahren']},
   {k:'sentence',prompt:'verkaufen',answers:['ich habe verkauft']},
  ]},
  {id:'d3',title:'Ü3 · haben oder sein?',hint:'Sadece yardımcı fiili yaz.',items:[
   {k:'gap',text:'Ich ___ 2015 nach Hamburg gekommen. Zuerst ___ ich einen Deutschkurs gemacht. Dann ___ ich ein Jahr in einem Café gearbeitet. 2017 ___ ich nach Berlin gezogen. Dort ___ ich eine Ausbildung zum Verkäufer gemacht. Die Ausbildung ___ drei Jahre gedauert. Ich ___ in Berlin geblieben und ich ___ 2021 einen Job gefunden.',answers:[['bin'],['habe'],['habe'],['bin'],['habe'],['hat'],['bin'],['habe']]},
  ]},
  {id:'d4',title:'Ü4 · Informationen weitergeben',hint:'Nadia\'nın cümlelerini *sie* ile yaz.',items:[
   {k:'sentence',prompt:'Ich bin 2011 nach Bremen gekommen.',answers:['Sie ist 2011 nach Bremen gekommen.']},
   {k:'sentence',prompt:'Ich habe ein Praktikum in einer Bäckerei gemacht.',answers:['Sie hat ein Praktikum in einer Bäckerei gemacht.']},
   {k:'sentence',prompt:'Ich bin in Bremen geblieben.',answers:['Sie ist in Bremen geblieben.']},
   {k:'sentence',prompt:'Ich habe von 2005 bis 2010 in einem Hotel gearbeitet.',answers:['Sie hat von 2005 bis 2010 in einem Hotel gearbeitet.']},
   {k:'sentence',prompt:'Ich stehe jeden Tag um 4 Uhr auf.',answers:['Sie steht jeden Tag um 4 Uhr auf.']},
   {k:'sentence',prompt:'Ich will eine zweite Bäckerei haben.',answers:['Sie will eine zweite Bäckerei haben.']},
  ]},
  {id:'d5',title:'Ü5 · Fragen schreiben',hint:'Soru kelimeleri: *Wann? Wo? Wie lange? Seit wann? Was?*',items:[
   {k:'sentence',prompt:'___? – Sie ist 2011 nach Deutschland gekommen.',answers:['Wann ist sie nach Deutschland gekommen?']},
   {k:'sentence',prompt:'___? – Sie hat in einem Hotel gearbeitet.',answers:['Wo hat sie gearbeitet?']},
   {k:'sentence',prompt:'___? – Die Ausbildung hat drei Jahre gedauert.',answers:['Wie lange hat die Ausbildung gedauert?']},
   {k:'sentence',prompt:'___? – Seit 2022 hat sie eine Bäckerei.',answers:['Seit wann hat sie eine Bäckerei?']},
   {k:'sentence',prompt:'___? – Sie ist Bäckerin von Beruf.',answers:['Was ist sie von Beruf?']},
   {k:'sentence',prompt:'___? – Sie will eine zweite Bäckerei haben.',answers:['Was will sie später haben?','Was will sie haben?']},
  ]},
  {id:'d6',title:'Ü6 · Zuerst – dann – später – jetzt',hint:'Sırala ve *ich* ile kısa bir paragraf yaz.',reading:{lines:['a) 2020 – einen Job im Hotel finden','b) 2016 – nach Deutschland kommen','c) jetzt – einen Managementkurs machen','d) 2017–2019 – eine Ausbildung machen','e) 2016–2017 – Deutsch lernen']},items:[
   {k:'gap',text:'Reihenfolge (Harfleri sırayla yaz): ___ → ___ → ___ → ___ → ___',answers:[['b'],['e'],['d'],['a'],['c']]},
   {k:'open',prompt:'Mein Text',sample:'2016 bin ich nach Deutschland gekommen. Zuerst habe ich von 2016 bis 2017 Deutsch gelernt. Dann habe ich von 2017 bis 2019 eine Ausbildung gemacht. Später, 2020, habe ich einen Job im Hotel gefunden. Jetzt mache ich einen Managementkurs.'},
  ]},
  {id:'d7',title:'Ü7 · Schreiben: Mein Weg',hint:'Kendi yolunu 8 cümleyle anlat: *zuerst / dann / später / jetzt* + Perfekt (*haben* ve *sein*) + *seit*.',items:[
   {k:'open',prompt:'Mein Weg (8 Sätze)',sample:'Ich bin 1988 in Izmir geboren. Zuerst bin ich in Izmir zur Schule gegangen. Dann habe ich Tiermedizin studiert. Später habe ich zehn Jahre als Tierarzt gearbeitet. 2024 bin ich nach Berlin gekommen. Seit einem Jahr lerne ich Deutsch. Jetzt mache ich einen Deutschkurs. Mein Ziel: Ich will wieder als Tierarzt arbeiten.'},
  ]},
 ],
 listen:[10,11,12],
};

const richtigSchreiben:L12Part={
 id:'schreiben',badge:'f/v',title:'Richtig schreiben: f oder v?',de:'Richtig schreiben',
 lead:'Almancada **f** ve **v** çoğu kelimede aynı okunur: ikisi de Türkçe „f" gibi. Yazılışı ezberlemek gerekir.',card:'*f* ve *v* aynı okunur: hangisi ne zaman yazılır?',
 sections:[
  {id:'regel',title:'Kural',blocks:[
   {t:'table',head:['Yazılış','Okunuş','Örnekler'],rows:[
    ['f','[f]','*fünf, Firma, finden, Freund, Familie, Beruf*'],
    ['v (Almanca kökenli)','[f]','*vier, von, vor, viel, Vater, Vogel, verdienen, verkaufen, Verkäufer, Volkshochschule*'],
    ['v (yabancı kökenli)','[v]','*Video, Universität, November, vegetarisch, Interview, Klavier*'],
    ['w','[v]','*wie, wo, wann, Woche, wollen, wohnen*'],
   ]},
   {t:'note',text:'İpuçları: *ver-* ile başlayan fiiller hep **v** (*verdienen, verkaufen, verstehen, vergessen*) · küçük sayılar ve edatlar **v** (*vier, viel, von, vor*) · Türkçe „v" sesi Almancada genelde **w** yazılır (*wie* = „vii").'},
  ]},
 ],
 exercises:[
  {id:'s1',title:'Ü1 · f mi, v mi?',hint:'Metindeki kelimeleri iki listeye ayır: f ile mi yazılıyor, v ile mi?',reading:{lines:['Ich bin Frau Vogel und ich bin Verkäuferin von Beruf. Vor fünf Jahren habe ich in einer Firma angefangen. Ich finde, die Arbeit ist toll! Ich fahre jeden Tag mit dem Fahrrad zur Firma und ich verdiene gut. Mein Vater findet das auch gut.']},items:
   [['Frau',0],['Vogel',1],['Verkäuferin',1],['von',1],['Beruf',0],['Vor',1],['fünf',0],['Firma',0],['finde',0],['fahre',0],['Fahrrad',0],['verdiene',1],['Vater',1],['findet',0]].map(([word,v])=>({k:'choice' as const,text:String(word),options:['f-Liste','v-Liste'],answer:Number(v)}))},
  {id:'s2',title:'Ü2 · f oder v?',hint:'Eksik harfi yaz (f, F, v ya da V).',items:[
   {k:'gap',text:'Ich heiße ___atma und ich bin ___erkäu___erin ___on Beru___. ___or ___ier Jahren habe ich in einer ___irma gearbeitet. Jetzt möchte ich mehr ___erdienen. In ___ünf Wochen ___ange ich eine Ausbildung an. Meine ___amilie ___indet das gut. Am Wochenende ___ahre ich mit ___reunden nach ___rankfurt.',answers:[['F'],['V'],['f'],['v'],['f'],['V'],['v'],['F'],['v'],['f'],['f'],['F'],['f'],['f'],['F'],['F']]},
  ],key:'Fatma · Verkäuferin · von · Beruf · Vor · vier · Firma · verdienen · fünf · fange · Familie · findet · fahre · Freunden · Frankfurt'},
 ],
 listen:[13],
};

const allesKlar:L12Part={
 id:'test',badge:'✓',title:'Alles klar? – Lektion 12 Testi',de:'Alles klar?',
 lead:'Kitaptaki format: Wortschatz, Grammatik, Kommunikation + Teil A için ek bölüm. Toplam 25 puan. Sözlüğe bakmadan, tek seferde yap.',card:'25 puanlık ünite testi: Wortschatz, Grammatik, Kommunikation, Zusatz.',
 sections:[],
 exercises:[
  {id:'t1',title:'1 Wortschatz (5 Punkte)',hint:'Kelimeyi tamamla (eksik kısmı ya da kelimenin tamamını yazabilirsin).',points:5,items:[
   {k:'gap',text:'Samir hat in einer Sp___ (1) Deutsch gelernt.',answers:[['rachschule','Sprachschule']]},
   {k:'gap',text:'Jetzt macht er ein Pr___ (2) in einem Autohaus.',answers:[['aktikum','Praktikum']]},
   {k:'gap',text:'Er kann gut Autos re___ (3).',answers:[['parieren','reparieren']]},
   {k:'gap',text:'In drei Mo___ (4) möchte er eine Au___ (5) zum Mechatroniker anfangen.',answers:[['naten','Monaten'],['sbildung','Ausbildung']]},
  ]},
  {id:'t2',title:'2.1 seit, vor oder in? (2,5 Punkte)',points:2.5,items:[
   {k:'gap',text:'Herr Okafor ist ___ (1) sechs Jahren nach Deutschland gekommen. Er wohnt ___ (2) vier Monaten in Leipzig und er will dort bleiben. ___ (3) zwei Wochen beginnt sein neuer Job. Er hat ___ (4) einem Jahr die Prüfung B1 gemacht. ___ (5) drei Jahren lernt er schon Deutsch.',answers:[['vor'],['seit'],['In'],['vor'],['Seit']]},
  ]},
  {id:'t3',title:'2.2 Perfekt (2,5 Punkte)',points:2.5,items:[
   {k:'gap',text:'Früher ___ ich oft mit dem Bus zur Arbeit ___. (fahren)',answers:[['bin'],['gefahren']]},
   {k:'gap',text:'Meine Schwester ___ vor zwei Jahren nach Hamburg ___. (ziehen)',answers:[['ist'],['gezogen']]},
   {k:'gap',text:'Wir ___ gestern lange zu Hause ___. (bleiben)',answers:[['sind'],['geblieben']]},
   {k:'gap',text:'Frau Lang ___ noch nie nach Istanbul ___. (fliegen)',answers:[['ist'],['geflogen']]},
   {k:'gap',text:'___ ihr am Montag nicht zur Schule ___? (gehen)',answers:[['Seid'],['gegangen']]},
  ]},
  {id:'t4',title:'3 Kommunikation (10 Punkte)',hint:'Resmî e-postayı tamamla.',points:10,items:[
   {k:'gap',text:'___ (1) Herr Falke, ___ (2) ein Praktikum in Ihrem Autohaus machen. Ich komme aus Syrien und ___ (3) drei Jahren in Berlin. Vor vier Jahren habe ich schon als Mechaniker in einer Firma gearbeitet. Die Arbeit hat ___ (4). Ich repariere gern Autos und ich arbeite gern im Team. ___ (5) auf Ihre Antwort. Mit freundlichen Grüßen Karim Haddad',answers:[['Sehr geehrter'],['ich möchte gern','ich möchte'],['ich wohne seit','wohne ich seit'],['Spaß gemacht','viel Spaß gemacht','mir Spaß gemacht','mir viel Spaß gemacht'],['Ich freue mich']]},
  ]},
  {id:'t5',title:'4 Zusatz: können / wollen (5 Punkte)',points:5,items:[
   {k:'gap',text:'Ich ___ gut Fahrrad fahren, aber ich ___ nicht so gut schwimmen. (können)',answers:[['kann'],['kann']]},
   {k:'gap',text:'___ du einen Online-Kurs machen? (wollen)',answers:[['Willst']]},
   {k:'gap',text:'Wir ___ lieber in der Sprachschule lernen. (wollen)',answers:[['wollen']]},
   {k:'gap',text:'Ayşe ___ eine Ausbildung machen. (wollen)',answers:[['will']]},
   {k:'gap',text:'___ ihr gut Deutsch sprechen? (können)',answers:[['Könnt']]},
  ]},
 ],
 after:[{t:'note',text:'Değerlendirme: her bölümde puanın yarısından azsa (Wortschatz 0–2, Grammatik 0–2, Kommunikation 0–5, Zusatz 0–2) o bölümün Teil\'ini tekrar et.'}],
};

const pruefung:L12Part={
 id:'pruefung',badge:'P',title:'Prüfungstraining',de:'Prüfungstraining',
 card:'Sınav hazırlığı: Lesen Teil 1, Schreiben Teil 2 ve Hören.',lead:'Sınav (Start Deutsch 1 / telc A1) kısa özet: **Lesen Teil 1:** 2 kısa metin (e-posta, not) + toplam 5 cümle → richtig / falsch. **Schreiben Teil 2:** 3 maddeli bir e-posta, yaklaşık 30 kelime; puan: her maddeye cevap var mı + dil. Anrede ve Gruß yoksa puan gider.',
 sections:[
  {id:'lesen',title:'Lesen Teil 1 – Strateji',blocks:[
   {t:'list',ordered:true,items:['E-postayı bir kez hızlı oku: Kim yazıyor, kime, ne istiyor?','Cümleleri oku, anahtar kelimeyi işaretle.','Bu bilgiyi metinde ara.','Karşılaştır: aynı mı, farklı mı? Sınav cümlesi genelde metindeki bir kelimeyi değiştirir (Internet → Zeitung, Abend → Vormittag).']},
  ]},
  {id:'schreiben',title:'Schreiben Teil 2 – Strateji',blocks:[
   {t:'list',ordered:true,items:['Görevi oku: ne yazacaksın, kime (du mu Sie mi)?','Her maddeye 1–2 cümle.','Anrede + Gruß (du: *Liebe/Lieber …, … Viele Grüße* · Sie: *Sehr geehrte/r …, … Mit freundlichen Grüßen*).','Kontrol: 3 madde var mı? Fiil 2. sırada mı? İsimler büyük harfle mi?']},
  ]},
 ],
 exercises:[
  {id:'p1',title:'1.1 · Lesen: Alıştırma',reading:{lines:['Sehr geehrte Frau Albrecht,','ich habe Ihre Anzeige für den Deutschkurs A2 im Internet gelesen. Ich lerne seit einem Jahr Deutsch und ich habe die Prüfung A1 schon gemacht. Ich arbeite bis 17 Uhr. Ich kann nur am Abend kommen. Beginnt der Kurs am Montag um 18 Uhr? Was kostet der Kurs?','Mit freundlichen Grüßen','Ana Ribeiro']},items:[
   rf('Ana Ribeiro hat die Anzeige in der Zeitung gelesen.',false),
   rf('Sie hat die Prüfung A1 schon gemacht.',true),
   rf('Sie kann am Vormittag zum Kurs kommen.',false),
  ],key:'1 F (Internet) · 2 R · 3 F (am Abend)'},
  {id:'p2',title:'1.2 · Und jetzt wie in der Prüfung!',reading:{lines:['Sehr geehrter Herr Krüger,','ich möchte gern ein Praktikum in Ihrem Pflegeheim machen. Ich komme aus Peru und ich wohne seit drei Jahren in Deutschland. Vor sechs Monaten habe ich die Prüfung A1 gemacht und in zwei Monaten möchte ich die Prüfung A2 machen. In Peru habe ich als Krankenpflegerin in einem Krankenhaus gearbeitet. Die Arbeit hat Spaß gemacht. Ich arbeite gern mit alten Menschen.','Ich freue mich auf Ihre Antwort.','Mit freundlichen Grüßen','Lucía Flores']},items:[
   rf('Lucía Flores möchte ein Praktikum in einem Krankenhaus machen.',false),
   rf('Sie hat vor sechs Monaten die Prüfung A2 gemacht.',false),
   rf('Sie hat in Peru als Krankenpflegerin gearbeitet.',true),
   rf('Sie arbeitet gern mit Kindern.',false),
   rf('Sie wohnt seit drei Jahren in Deutschland.',true),
  ],key:'1 F (Pflegeheim) · 2 F (A1) · 3 R · 4 F (alte Menschen) · 5 R'},
  {id:'p3',title:'2.1 · Hangi cümle hangi maddeye?',hint:'Ihr Freund Ali hat Ihnen beim Umzug (taşınma) geholfen. Sie möchten ihn zum Essen einladen. Schreiben Sie: (1) Danke für … (2) Wann Sie Zeit haben (3) Wo Sie essen können',items:[
   ['Wollen wir am Samstagabend essen? Ich bin ab 18 Uhr zu Hause.',1],
   ['Ich koche gern für dich – in meiner neuen Küche!',2],
   ['Vielen Dank für deine Hilfe! Der Umzug war nicht leicht.',0],
   ['Hast du am Sonntag Zeit?',1],
   ['Oder wollen wir in die Pizzeria „Roma" gehen?',2],
   ['Danke, du hast mir sehr geholfen!',0],
  ].map(([text,answer],i)=>({k:'choice' as const,text:String.fromCharCode(97+i)+') '+text,options:['(1) Danke','(2) Wann','(3) Wo'],answer:Number(answer)}))},
  {id:'p4',title:'2.2 · E-posta yaz',hint:'Her maddeden bir cümle seç, Anrede ve Gruß ekle, e-postayı yaz.',items:[
   {k:'open',prompt:'E-Mail an Ali',sample:'Lieber Ali,\nvielen Dank für deine Hilfe! Der Umzug war nicht leicht. Hast du am Sonntag Zeit? Ich koche gern für dich – in meiner neuen Küche!\nViele Grüße\nKoray'},
  ]},
  {id:'p5',title:'2.3 · Und jetzt wie in der Prüfung!',hint:'Sie suchen einen Praktikumsplatz. Ihre Freundin Lena arbeitet in einem Hotel und möchte Ihnen helfen. Schreiben Sie Lena eine E-Mail: – Danke für … – Was Sie gut können – Wann Sie anfangen können. Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.',reading:{lines:['Beispiele: … Danke! · Ich kann gut … · Ich kann am … anfangen. · Kannst du …?']},items:[
   {k:'open',prompt:'E-Mail an Lena',sample:'Liebe Lena,\nvielen Dank für deine Hilfe! Ich kann gut mit Menschen arbeiten und ich spreche Englisch und Türkisch. Ich kann am Montag anfangen. Kannst du mit dem Hotel sprechen?\nViele Grüße\nMehmet'},
  ],key:'Kontrol: Anrede ✓ 3 madde ✓ Gruß ✓ · *Liebe Lena* (kadın) / *Lieber Tom* (erkek) · Anrede\'den sonra küçük harf.'},
 ],
 listen:[14],
};

const magazin:L12Part={
 id:'magazin',badge:'M',title:'Magazin 6',de:'Magazin',
 lead:'Treffpunkt: Menschen aus Firmen in unserer Region · Was verdient man in Deutschland?',
 sections:[],
 exercises:[
  {id:'m1',title:'1 · Treffpunkt: Emre Kaya von Fahrrad Berger',reading:{lines:[
   '**Ich bin geboren:** 1992','**Ich bin bei der Firma seit:** 2017','**Ich arbeite als:** Fahrrad-Mechatroniker. Ich repariere Fahrräder und ich spreche mit Kunden.',
   '**Meine Ausbildung:** Ich bin von 1998 bis 2010 zur Schule gegangen. Dann habe ich in Ankara Maschinenbau (makine mühendisliği) studiert – aber nur zwei Jahre. 2014 bin ich nach Leipzig gekommen. Bei Fahrrad Berger habe ich zuerst ein Praktikum gemacht. Dann habe ich von 2017 bis 2020 eine Ausbildung gemacht. Seit 2020 arbeite ich hier als Mechatroniker.',
   '**Ich will noch:** … einen eigenen (kendi) Laden haben. Und ich will besser Englisch sprechen – viele Kunden sind Touristen.',
   '**Kaffee oder Tee?** Tee, mit viel Zucker!','**In der Freizeit:** … fahre ich Rennrad. Am Wochenende fahre ich 100 Kilometer.',
  ]},items:[
   {k:'choice',text:'a) Als was arbeitet Emre Kaya?',options:['Fahrrad-Mechatroniker','Verkäufer','Student'],answer:0},
   rf('b1) Er hat in Ankara studiert.',true),
   rf('b2) Er hat die Ausbildung 2014 angefangen.',false),
   rf('b3) Er arbeitet seit 2020 als Mechatroniker.',true),
   rf('b4) Er will einen Laden haben.',true),
   {k:'open',prompt:'c) Mein Steckbrief',sample:'Ich bin geboren: 1988\nIch bin in Deutschland seit: 2024\nIch bin Tierarzt von Beruf.\nMeine Ausbildung: Ich bin von 1994 bis 2006 zur Schule gegangen. Dann habe ich in Izmir Tiermedizin studiert. 2024 bin ich nach Berlin gekommen. Seit einem Jahr lerne ich Deutsch.\nIch will noch: … wieder als Tierarzt arbeiten.\nKaffee oder Tee? Kaffee!\nIn der Freizeit: … gehe ich spazieren.'},
  ],key:'b2: F (2017). c) Kendi Steckbrief\'ini aynı başlıklarla yaz (*Ich bin geboren · Ich bin in Deutschland seit · Ich arbeite als / Ich bin … von Beruf · Meine Ausbildung · Ich will noch · Kaffee oder Tee? · In der Freizeit*). Ünitenin tüm gramerini (Perfekt, seit/vor/in, wollen) burada kullan.'},
  {id:'m2',title:'2 · Was verdient man in Deutschland?',hint:'Tahmin et: her meslek ne kadar kazanıyor? (aylık, kitaptaki Entgeltatlas verileri)',items:[
   ['die Friseurin','1.666 €'],['die Verkäuferin','2.279 €'],['die Lageristin (depo görevlisi)','2.445 €'],['die Krankenschwester','3.645 €'],['die Lehrerin','4.444 €'],['die Ingenieurin','5.858 €'],
  ].map(([job,amount])=>({k:'choice' as const,text:job,options:['1.666 €','2.279 €','2.445 €','3.645 €','4.444 €','5.858 €'],answer:['1.666 €','2.279 €','2.445 €','3.645 €','4.444 €','5.858 €'].indexOf(amount)}))},
 ],
 after:[{t:'note',text:'Magazin\'in „Vom Bauernhaus bis zum Tiny-House" kısmı Wohnen konusu; Lektion 13\'te.'}],
};

export const lessonParts:L12Part[]=[teilA,teilB,teilC,teilD,richtigSchreiben,allesKlar,pruefung,magazin];
export const lessonPartMap=new Map(lessonParts.map(part=>[part.id,part]));
export const lessonExercises=lessonParts.flatMap(part=>part.exercises.map(exercise=>({part:part.id,exercise})));

/** The text read aloud for a word row: the explicit `say`, otherwise the German column without plural endings and markup. */
export function wordSpeech([de,,say]:L12Word):string{
 if(say)return say;
 return de.split(' · ').map(piece=>piece.replace(/\s*\(.*?\)/g,'').replace(/,\s*[-\w]*[\wäöüÄÖÜß-]*$/u,'').replace(/\|/g,'').trim()).join(', ');
}

/** Answer checking: case, spacing, end punctuation and ß/ss do not matter. */
export function normalizeAnswer(text:string){
 return text.normalize('NFC').toLowerCase().replace(/ß/g,'ss').replace(/[„“”"'’.,!?;:()]/g,' ').replace(/[–—-]/g,'-').replace(/\s+/g,' ').trim();
}
export function matchesAnswer(given:string,accepted:readonly string[]){const value=normalizeAnswer(given);return !!value&&accepted.some(answer=>normalizeAnswer(answer)===value);}
/** Number of blanks in a gap text. */
export const gapCount=(text:string)=>text.split('___').length-1;

/** Every German text the lesson page reads aloud (word tables). */
export function lessonSpeechTexts(){
 const texts:string[]=[];
 for(const part of lessonParts)for(const section of part.sections)for(const block of section.blocks)if(block.t==='vocab')for(const word of block.words)texts.push(wordSpeech(word));
 return texts;
}

/** A learner's answer for one item: blanks, a chosen option, a sentence, a free text or the picked words. */
export type L12Value=string[]|number|string|null|undefined;
/** How many answer points one item has and how many are right (free writing has none). */
export function gradeItem(item:L12Item,value:L12Value):{right:number;total:number}{
 if(item.k==='gap'){const given=Array.isArray(value)?value:[];return {right:item.answers.filter((accepted,i)=>matchesAnswer(given[i]??'',accepted)).length,total:item.answers.length};}
 if(item.k==='choice')return {right:value===item.answer?1:0,total:1};
 if(item.k==='sentence')return {right:typeof value==='string'&&matchesAnswer(value,item.answers)?1:0,total:1};
 if(item.k==='pick'){const picked=Array.isArray(value)?value:[];return {right:picked.length===item.need&&picked.every(word=>item.accept.includes(word))?1:0,total:1};}
 return {right:0,total:0};
}
/** The score of an exercise: right/total answer points, and test points when the exercise has them (rounded to halves). */
export function gradeExercise(exercise:L12Exercise,values:Record<number,L12Value>){
 let right=0,total=0,share=0;
 exercise.items.forEach((item,i)=>{const result=gradeItem(item,values[i]);right+=result.right;total+=result.total;if(result.total)share+=result.right/result.total;});
 const scored=exercise.items.filter(item=>item.k!=='open').length;
 const points=exercise.points===undefined?undefined:Math.round((scored?share/scored:0)*exercise.points*2)/2;
 return {right,total,points};
}
/** Lektion 12 is written in Turkish; other site languages see this note in their own language. */
export const turkishNote:Record<string,string>={
 de:'Die Erklärungen in dieser Lektion sind vorerst auf Türkisch.',en:'The explanations in this lesson are in Turkish for now.',ar:'الشروح في هذا الدرس باللغة التركية حاليًا.',uk:'Пояснення в цьому уроці поки що турецькою мовою.',fr:'Les explications de cette leçon sont pour l’instant en turc.',
 es:'Las explicaciones de esta lección están, por ahora, en turco.',ru:'Объяснения в этом уроке пока на турецком языке.',fa:'توضیحات این درس فعلاً به زبان ترکی است.',pl:'Objaśnienia w tej lekcji są na razie po turecku.',it:'Le spiegazioni di questa lezione per ora sono in turco.',pt:'As explicações desta lição estão em turco por enquanto.',
 ku:'Ravekirinên vê dersê niha bi tirkî ne.',sq:'Shpjegimet në këtë mësim për momentin janë në turqisht.',ro:'Explicațiile din această lecție sunt deocamdată în limba turcă.',bg:'Обясненията в този урок засега са на турски език.',hbs:'Objašnjenja u ovoj lekciji su za sada na turskom jeziku.',el:'Οι εξηγήσεις σε αυτό το μάθημα είναι προς το παρόν στα τουρκικά.',vi:'Phần giải thích trong bài học này hiện đang bằng tiếng Thổ Nhĩ Kỳ.',
 prs:'توضیحات این درس فعلاً به زبان ترکی است.',ps:'د دې لوست تشریحات اوس مهال په ترکي ژبه دي.',ti:'መብርሂታት ናይዚ ትምህርቲ ሕጂ ብቋንቋ ቱርኪ እዮም።',so:'Sharraxaadda casharkan hadda waxay ku qoran tahay luqadda Turkiga.',zh:'本课的讲解目前为土耳其语。',hi:'इस पाठ की व्याख्याएँ अभी तुर्की भाषा में हैं।',ur:'اس سبق کی وضاحتیں فی الحال ترکی زبان میں ہیں۔',ja:'このレッスンの説明は、現在トルコ語のみです。',ko:'이 단원의 설명은 현재 터키어로만 되어 있어요.',
 nl:'De uitleg in deze les is voorlopig in het Turks.',hu:'A lecke magyarázatai egyelőre törökül vannak.',cs:'Vysvětlení v této lekci jsou zatím v turečtině.',
};
