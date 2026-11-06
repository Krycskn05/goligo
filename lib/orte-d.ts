/**
 * Lektion 3 „Orte und Dinge“, Teil D – Ich arbeite hier. Describing a workplace (Aisha's chat with Yasemin), finding the
 * article in a dictionary (m · n · f), word cards, capital letters for nouns, a summary of the unit and „Alles klar?“
 * over the whole unit. Our own texts after the topics of the learner's book (5 November 2026); the people are the site's.
 */
import type {ChoiceGap} from './stadt-course';
import {T,check,row,listWord,line,choiceLine,type OrtePart,type Word} from './orte-types';
import {orteCovers,objectPic} from './orte-pictures';

const gap=(options:readonly string[],answer:string):ChoiceGap=>({options,answer});
const ein=['ein','eine'] as const;

export const wordsD:Word[]=[
 {de:'das Kleid',plural:'Kleider',tr:T('elbise'),emoji:'👗',pic:objectPic.kleid},
 {de:'die Nähmaschine',plural:'Nähmaschinen',tr:T('dikiş makinesi'),emoji:'🧵',pic:objectPic.naehmaschine},
 {de:'die Schere',plural:'Scheren',tr:T('makas'),emoji:'✂️',pic:objectPic.schere},
 {de:'der Topf',plural:'Töpfe',tr:T('tencere'),emoji:'🍲',pic:objectPic.topf},
 {de:'das Wörterbuch',plural:'Wörterbücher',tr:T('sözlük'),emoji:'📖',pic:objectPic.woerterbuch},
 {de:'die Wortkarte',plural:'Wortkarten',tr:T('kelime kartı'),emoji:'🗂️',pic:objectPic.wortkarte},
 {de:'der Arbeitsplatz',plural:'Arbeitsplätze',tr:T('iş yeri, çalışma yeri'),emoji:'🧑‍🏭',pic:objectPic.arbeitsplatz},
];
/** Aisha's chat with Yasemin (Konu 1 and Alıştırma 3). */
const chat=[
 line('yasemin','Hallo, Aisha! Arbeitest du jetzt?','Merhaba Aisha! Şimdi çalışıyor musun?'),
 line('aisha','Ja! Ich bin jetzt Näherin. Ich arbeite in Hamburg.','Evet! Artık terziyim. Hamburg’da çalışıyorum.'),
 line('yasemin','Toll! Wie ist dein Arbeitsplatz?','Harika! İş yerin nasıl?'),
 line('aisha','Er ist klein, aber schön. Hier ist ein Fenster. Es ist groß. Und hier ist meine Nähmaschine. Sie ist neu und sehr praktisch.','Küçük ama güzel. Burada bir pencere var. Büyük. Burada da dikiş makinem var. Yeni ve çok kullanışlı.'),
 line('yasemin','Was ist wichtig für dich?','Senin için ne önemli?'),
 line('aisha','Die Nähmaschine und die Schere. Die Schere ist alt, aber sie ist sehr gut. Und schau: Hier ist ein Kleid. Es ist für Nora!','Dikiş makinesi ve makas. Makas eski ama çok iyi. Bir de bak: Burada bir elbise var. Nora için!'),
 line('yasemin','Oh, das Kleid ist sehr schön!','Aa, elbise çok güzel!'),
];

export const partD:OrtePart={
 id:'d',badge:'D',title:'Ich arbeite hier.',
 lead:T('Bir iş yerini anlatmak, sözlükte artikeli bulmak (**m · n · f**), kelime kartları, isimler büyük harfle ve bütün ünitenin **Alles klar?** testi.'),
 cover:orteCovers.d,coverAlt:T('Aisha terzi atölyesinde dikiş makinesinin başında; büyük bir pencere, eski bir makas ve askıda bir elbise'),
 testNote:'Alles klar? · {n} puan',
 short:{'sozluk':T('Sözlük'),'kartlar':T('Kelime kartları'),'chat-ex':T('Aisha’nın mesajı'),'buyuk-harf':T('Büyük harf'),'mei':T('Mei’nin ofisi'),'und-du':T('Şimdi sen')},
 steps:[
  {id:'kapak',title:T('Kapak'),kind:'cover',cover:{
   intro:T('Aisha’nın yeni bir işi var: Hamburg’da bir terzi atölyesinde çalışıyor. Yasemin’e iş yerini anlatıyor. Bu bölümde bir iş yerini anlatacak, sözlükle çalışacak ve bütün üniteyi „Alles klar?“ ile tekrar edeceksin.'),
   learn:[T('Bir iş yerini anlatmak: *Hier ist ein Fenster. Es ist groß.*'),T('Sözlükte artikeli bulmak: *m · n · f*'),T('Kelime kartlarıyla çalışmak'),T('Büyük harf: bütün isimler büyük harfle başlar'),T('**Alles klar?** Bütün ünitenin testi')],
   cast:['aisha','yasemin','nikos','mei','paul'],
  }},
  {id:'esyalar',title:T('Kelimeler'),kind:'teach',kicker:'Wortschatz',heading:T('Atölyede ve sözlükte'),
   lead:T('Önce eşyalar (karta dokun), sonra diğer kelimeler (satıra dokun).'),
   blocks:[
    {t:'cards',words:wordsD},
    {t:'list',words:[
     listWord('die Näherin, der Näher','terzi (dikiş diken)','Aisha ist Näherin.','Aisha terzi.'),
     listWord('Toll!','Harika!','Toll! Wie ist dein Arbeitsplatz?','Harika! İş yerin nasıl?'),
     listWord('Schau!','Bak!','Schau, hier ist ein Kleid.','Bak, burada bir elbise var.'),
     listWord('für','için','Das Kleid ist für Nora.','Elbise Nora için.'),
     listWord('leider','maalesef','Die Schere ist leider kaputt.','Makas maalesef bozuk.'),
     listWord('das Nomen, die Nomen','isim','Kleid ist ein Nomen.','Kleid bir isimdir.'),
     listWord('maskulin · neutral · feminin','eril · nötr · dişil','Topf ist maskulin: der Topf.','Topf eril: der Topf.'),
    ]},
   ]},
  {id:'kontrol',title:T('Kelime kontrolü'),kind:'teach',kicker:'Wortschatz · Kontrolle',heading:T('Kelimeleri hatırlıyor musun?'),
   lead:T('Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.'),
   blocks:[{t:'checks',title:T('6 kısa soru'),items:[
    check(T('makas'),['die Schere','der Schere','das Schere']),
    check(T('elbise'),['das Kleid','der Kleid','die Kleid']),
    check(T('tencere'),['der Topf','die Topf','das Topf']),
    check(T('sözlük'),['das Wörterbuch','die Wortkarte','das Nomen']),
    check('„leider“',[T('maalesef'),T('harika'),T('bak')],''),
    check(T('dikiş makinesi'),['die Nähmaschine','die Waschmaschine','die Kaffeemaschine']),
   ]}]},
  {id:'chat',title:'Hallo, Aisha!',kind:'teach',kicker:T('Konu 1 · Hallo, Aisha!'),heading:T('Aisha’nın yeni iş yeri'),
   blocks:[
    {t:'p',text:T('Yasemin, Aisha’ya mesaj yazıyor. Oku ve dinle; her kişi kendi sesiyle.')},
    {t:'talk',lines:chat},
    {t:'note',text:T('Aisha önce *ein / eine* der (yeni bir şey), sonra *er / es / sie* (aynı şey): ~ein Fenster … Es ist groß.~ Teil B’deki kural!')},
    {t:'checks',items:[
     check(T('Aisha nerede çalışıyor?'),['in Hamburg','in Köln','in Bremen'],'Ich arbeite in Hamburg.'),
     check(T('Dikiş makinesi nasıl?'),['neu','alt','kaputt'],'Sie ist neu und sehr praktisch.'),
     check(T('Elbise kimin için?'),['für Nora','für Yasemin','für Aisha'],'Es ist für Nora!'),
    ]},
   ]},
  {id:'sozluk-konu',title:T('Sözlükle çalışmak'),kind:'teach',kicker:T('Konu 2 · Mit dem Wörterbuch'),heading:T('Artikeli sözlükte bul'),
   blocks:[
    {t:'p',text:T('Yeni bir kelime öğrendin ama artikeli ne? Sözlüğe bak. Sözlükler cinsiyeti çoğu zaman bir harfle gösterir:')},
    {t:'table',head:[T('sözlükte'),'',T('artikel')],rows:[['m','maskulin','der'],['n','neutral','das'],['f','feminin','die']],say:['maskulin: der.','neutral: das.','feminin: die.']},
    {t:'rows',rows:[row('Kleid, n – das Kleid','elbise'),row('Schere, f – die Schere','makas'),row('Topf, m – der Topf','tencere')]},
    {t:'note',text:T('Bazı sözlükler harf yerine artikeli yazar: ~Kleid, das~. Bazıları da *r, s, e* yazar, artikelin son harfi: *r* = der, *s* = das, *e* = die.')},
    {t:'h',text:T('Kelime kartları')},
    {t:'p',text:T('Kartın önüne Almanca kelimeyi artikeliyle yaz, artikelin rengiyle: [der] mavi, [das] yeşil, [die] kırmızı. Arkasına Türkçesini yaz. Her gün birkaç kartla kendini sına: önce Almanca → Türkçe, sonra Türkçe → Almanca.')},
    {t:'rows',rows:[row('das Kleid','elbise'),row('die Nähmaschine','dikiş makinesi'),row('der Topf','tencere')]},
    {t:'checks',items:[
     check('Topf, m',['der Topf','das Topf','die Topf']),
     check('Schere, f',['die Schere','der Schere','das Schere']),
     check('Wörterbuch, s',['das Wörterbuch','der Wörterbuch','die Wörterbuch']),
    ]},
   ]},
  {id:'is-yerim',title:T('İş yerini anlatmak'),kind:'teach',kicker:T('Konu 3 · Mein Arbeitsplatz'),heading:T('Bir iş yerini dört adımda anlat'),
   blocks:[
    {t:'p',text:T('Bir iş yerini anlatmak için şu dört kalıp yeter:')},
    {t:'rows',rows:[row('Ich arbeite als Koch.','Aşçı olarak çalışıyorum. (1. işin)'),row('Hier ist ein Herd.','Burada bir ocak var. (2. ne var?)'),row('Er ist groß und neu.','Büyük ve yeni. (3. nasıl?)'),row('Der Herd ist wichtig für mich.','Ocak benim için önemli. (4. ne önemli?)')]},
    {t:'h',text:T('İki örnek')},
    {t:'talk',lines:[
     line('nikos','Ich arbeite als Koch. Hier ist mein Arbeitsplatz: die Küche. Hier steht ein Herd. Er ist groß und neu. Hier ist ein Topf. Er ist alt, aber gut. Der Herd ist sehr wichtig für mich.','Aşçı olarak çalışıyorum. Burası benim iş yerim: mutfak. Burada bir ocak var. Büyük ve yeni. Burada bir tencere var. Eski ama iyi. Ocak benim için çok önemli.'),
     line('paul','Ich bin Lehrer. Hier ist eine Tafel. Sie ist groß. Hier ist ein Laptop. Er ist klein, aber sehr praktisch. Die Tafel ist wichtig für mich.','Ben öğretmenim. Burada bir yazı tahtası var. Büyük. Burada bir dizüstü bilgisayar var. Küçük ama çok kullanışlı. Tahta benim için önemli.'),
    ]},
    {t:'note',text:T('Bilmediğin bir kelime mi var? Sözlüğe bak ve yeni bir kelime kartı yaz!')},
   ]},
  {id:'buyuk-harf-konu',title:T('Büyük harf'),kind:'teach',kicker:T('Konu 4 · Richtig schreiben'),heading:T('İsimler büyük harfle'),
   blocks:[
    {t:'p',text:T('Almancada **bütün isimler** büyük harfle başlar, cümlenin ortasında da: ~der Tisch~, ~das Handy~, ~die Schere~. Cümlenin ilk kelimesi de büyük harfle başlar. *ich* ise küçük yazılır (cümle başında değilse).')},
    {t:'rows',rows:[row('Das ist mein Handy.','Bu benim cep telefonum.'),row('Es ist alt, aber es funktioniert.','Eski ama çalışıyor.'),row('Ich finde, die Schere ist gut.','Bence makas iyi.')]},
    {t:'warn',text:T('Türkçede „masa“ küçük harfle yazılır; Almancada *Tisch* hep büyük! Bu yüzden büyük harf, bir kelimenin isim olduğunu gösterir.')},
   ]},
  {id:'ozet-konu',title:T('Ünite özeti'),kind:'teach',kicker:T('Konu 5 · Zusammenfassung'),heading:T('Lektion 3 tek tabloda'),
   blocks:[
    {t:'p',text:T('Bütün ünitenin grameri bu tabloda. Satıra dokun, dinle:')},
    {t:'table',head:['','der / das / die','ein / eine','kein / keine','er / es / sie'],rows:[[T('eril'),'der Tisch','ein Tisch','kein Tisch','er'],[T('nötr'),'das Bett','ein Bett','kein Bett','es'],[T('dişil'),'die Tasche','eine Tasche','keine Tasche','sie']],
     say:['der Tisch, ein Tisch, kein Tisch, er.','das Bett, ein Bett, kein Bett, es.','die Tasche, eine Tasche, keine Tasche, sie.']},
    {t:'rows',all:true,rows:[row('Was ist das? Wie heißt das auf Deutsch?','Bu ne? Bunun Almancası ne?'),row('Hier ist ein Tisch, aber kein Stuhl.','Burada bir masa var ama sandalye yok.'),row('Ich finde, das Regal ist schön.','Bence raf güzel.'),row('Was kostet der Herd? – Er kostet 40 Euro.','Ocak ne kadar? – 40 avro.')]},
    {t:'p',text:T('Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.')},
   ]},
  {id:'sozluk',title:T('Alıştırma 1'),kind:'exercise',kicker:'Alıştırma 1 · m, n oder f?',heading:T('Sözlükteki harften artikeli bul'),lead:T('*m* → der, *n* → das, *f* → die. Doğrusunu seç.'),
   exercise:{type:'quiz',items:[
    ['Kleid, n','das Kleid',objectPic.kleid,'👗'],['Schere, f','die Schere',objectPic.schere,'✂️'],['Topf, m','der Topf',objectPic.topf,'🍲'],
    ['Nähmaschine, f','die Nähmaschine',objectPic.naehmaschine,'🧵'],['Arbeitsplatz, m','der Arbeitsplatz',objectPic.arbeitsplatz,'🧑‍🏭'],['Wörterbuch, n','das Wörterbuch',objectPic.woerterbuch,'📖'],
    ['Fenster, n','das Fenster',objectPic.fenster,'🪟'],['Kasse, f','die Kasse',objectPic.kasse,'🧾'],
   ].map(([prompt,answer,pic,emoji])=>{const noun=(answer as string).split(' ')[1];return {prompt:prompt as string,pic:pic as string|undefined,emoji:emoji as string,options:[answer as string,...['der','das','die'].filter(a=>!(answer as string).startsWith(a+' ')).map(a=>a+' '+noun)]};})}},
  {id:'kartlar',title:T('Alıştırma 2'),kind:'exercise',kicker:'Alıştırma 2 · Wortkarten',heading:T('Kartın öbür yüzü: Almancası'),lead:T('Türkçe kelimenin Almancasını **artikeliyle** yaz: ~das Kleid~. Doğru yazınca kutu yeşil olur ve okunur.'),
   exercise:{type:'write',rows:[
    {given:T('elbise'),pic:objectPic.kleid,emoji:'👗',answers:['das Kleid'],say:'das Kleid'},
    {given:T('makas'),pic:objectPic.schere,emoji:'✂️',answers:['die Schere'],say:'die Schere'},
    {given:T('tencere'),pic:objectPic.topf,emoji:'🍲',answers:['der Topf'],say:'der Topf'},
    {given:T('dikiş makinesi'),pic:objectPic.naehmaschine,emoji:'🧵',answers:['die Nähmaschine'],say:'die Nähmaschine'},
    {given:T('sözlük'),pic:objectPic.woerterbuch,emoji:'📖',answers:['das Wörterbuch'],say:'das Wörterbuch'},
    {given:T('iş yeri, çalışma yeri'),pic:objectPic.arbeitsplatz,emoji:'🧑‍🏭',answers:['der Arbeitsplatz'],say:'der Arbeitsplatz'},
   ]}},
  {id:'chat-ex',title:T('Alıştırma 3'),kind:'exercise',kicker:'Alıştırma 3 · Hallo, Aisha!',heading:T('Aisha’nın mesajını tamamla'),lead:T('Boşluğa dokun ve seç. Cümle doğru olunca kişi onu okur.'),
   exercise:{type:'choice',dialogue:true,lines:[
    choiceLine('c1',['Ich bin jetzt ',gap(['Näherin','Nähmaschine','Kleid'],'Näherin'),'. Ich arbeite in Hamburg.'],'aisha'),
    choiceLine('c2',['Hier ist ',gap(ein,'ein'),' Fenster. ',gap(['Es','Er','Sie'],'Es'),' ist groß.'],'aisha'),
    choiceLine('c3',['Und hier ist meine Nähmaschine. ',gap(['Sie','Er','Es'],'Sie'),' ist neu und sehr praktisch.'],'aisha'),
    choiceLine('c4',['Die Schere ist alt, ',gap(['aber','und','kein'],'aber'),' sie ist sehr gut.'],'aisha'),
    choiceLine('c5',['Oh, ',gap(['das','der','die'],'das'),' Kleid ist sehr schön!'],'yasemin'),
   ]}},
  {id:'buyuk-harf',title:T('Alıştırma 4'),kind:'exercise',kicker:'Alıştırma 4 · Groß oder klein?',heading:T('Cümleyi doğru yaz'),lead:T('Cümleyi büyük harflere dikkat ederek yeniden yaz: cümle başı ve bütün isimler büyük.'),
   exercise:{type:'gaps',wide:true,exact:true,lines:[
    {text:'hier ist ein tisch. → ___',answers:[['Hier ist ein Tisch.']]},
    {text:'das ist mein handy. → ___',answers:[['Das ist mein Handy.']]},
    {text:'die schere ist alt. → ___',answers:[['Die Schere ist alt.']]},
    {text:'ich finde, das kleid ist schön. → ___',answers:[['Ich finde, das Kleid ist schön.']]},
   ],say:['Hier ist ein Tisch.','Das ist mein Handy.','Die Schere ist alt.','Ich finde, das Kleid ist schön.']}},
  {id:'mei',title:T('Alıştırma 5'),kind:'exercise',kicker:'Alıştırma 5 · Mein Arbeitsplatz',heading:T('Mei iş yerini anlatıyor'),lead:T('Mei programcı (Teil B). Boşluğa dokun ve seç: *ein*, *der* mi, *er / es / sie* mi?'),
   exercise:{type:'choice',dialogue:true,lines:[
    choiceLine('m1',['Hier ist ',gap(ein,'ein'),' Laptop. ',gap(['Der','Das','Die'],'Der'),' Laptop ist neu.'],'mei'),
    choiceLine('m2',[gap(['Er','Es','Sie'],'Er'),' ist sehr wichtig für mich.'],'mei'),
    choiceLine('m3',['Hier steht ',gap(ein,'ein'),' Regal. ',gap(['Es','Er','Sie'],'Es'),' ist alt, aber praktisch.'],'mei'),
    choiceLine('m4',['Hier ist ',gap(ein,'eine'),' Kaffeemaschine. Sie ist leider ',gap(['kaputt','wichtig','groß'],'kaputt'),'.'],'mei'),
    choiceLine('m5',['Hier ist ',gap(['kein','keine'],'kein'),' Fenster. Das ist nicht schön.'],'mei'),
   ]}},
  {id:'und-du',title:T('Alıştırma 6'),kind:'exercise',kicker:'Alıştırma 6 · Und du?',heading:T('Şimdi sen: senin iş yerin ya da öğrendiğin yer'),lead:T('Kendi cevaplarını yaz. Kalıba uyan cümle yeşil olur. İlk üç cümle bitince alıştırma tamam; sonra dinle, gizle ve ezberden söyle.'),
   exercise:{type:'own',key:'lernkoko-l3d-own',prompts:[
    {question:'Was ist hier?',pattern:/^hier (ist|steht) (ein|eine) [a-z]+( und (ein|eine) [a-z]+)*$/,placeholder:'Hier ist ein Tisch.'},
    {question:'Wie ist er / es / sie?',pattern:/^(er|es|sie) ist [a-z ,]+$/,placeholder:'Er ist alt, aber gut.'},
    {question:'Was ist wichtig für dich?',pattern:/^(der|das|die) [a-z]+ ist (sehr )?wichtig fuer mich$/,placeholder:'Der Laptop ist wichtig für mich.'},
    {question:'Arbeitest du?',pattern:/^((ja|nein) )?ich arbeite (als [a-z]+|jetzt nicht|nicht|hier|in [a-z]+)( .+)?$/,placeholder:'Ich arbeite als Verkäufer.',optional:true},
   ]},
   after:[{t:'note',text:T('Bilmediğin bir eşya mı var? Sözlüğe bak ve artikelini bul: *m* → der, *n* → das, *f* → die.')}]},
  {id:'test',title:'Alles klar?',kind:'test',test:[
   ['Was ist das? Wie heißt das ___ Deutsch?',['auf','in','aus'],'auf','Wie heißt das auf Deutsch?'],
   ['Keine ___. Ich weiß nicht.',['Ahnung','Frage','Problem'],'Ahnung','Keine Ahnung. Ich weiß nicht.'],
   ['Der Schrank ist 180 cm ___.',['hoch','alt','Euro'],'hoch','Der Schrank ist hundertachtzig Zentimeter hoch.'],
   [T('„Was kostet …?“ neyi sorar?'),[T('fiyatı'),T('yaşı'),T('boyu')],T('fiyatı'),''],
   [T('makas'),['die Schere','der Schere','das Schere'],'die Schere','die Schere'],
   ['Das ist ___ Heft.',['ein','eine','einer'],'ein','Das ist ein Heft.'],
   ['Oh, ___ Heft ist sehr alt.',['das','der','die'],'das','Oh, das Heft ist sehr alt.'],
   ['Ja, stimmt, ___ ist alt.',['es','er','sie'],'es','Ja, stimmt, es ist alt.'],
   ['Das ist eine Kasse. ___ ist nicht schön.',['Sie','Er','Es'],'Sie','Das ist eine Kasse. Sie ist nicht schön.'],
   ['Hier ist ein Sofa, aber ___ Stuhl.',['kein','keine','nicht'],'kein','Hier ist ein Sofa, aber kein Stuhl.'],
   ['___ alt ist die Spülmaschine? – Sie ist neu.',['Wie','Was','Wo'],'Wie','Wie alt ist die Spülmaschine?'],
   ['___ kostet die Spülmaschine? – 230 Euro.',['Was','Wie','Wer'],'Was','Was kostet die Spülmaschine?'],
   ['99',['neunundneunzig','neunzigneun','neunzehnneun'],'neunundneunzig','neunundneunzig'],
   [T('Telefonda kendini tanıt:'),['Guten Tag, hier ist Arslan.','Guten Tag, das ist Telefon.','Hallo, ich komme Arslan.'],'Guten Tag, hier ist Arslan.','Guten Tag, hier ist Arslan.'],
   [T('Doğru yazılmış olan:'),['Das Kleid ist schön.','das kleid ist schön.','Das kleid ist Schön.'],'Das Kleid ist schön.','Das Kleid ist schön.'],
  ]},
  {id:'konus',title:T('Konuş'),kind:'speak',lead:T('Yasemin senin iş yerini (ya da öğrendiğin yeri) soruyor. Soruyu dinle, cevabı dinle, sonra sen yüksek sesle söyle. Üç cevapta senin cümlelerin var (Alıştırma 6).'),speak:[
   {who:'yasemin',question:'Wie ist dein Arbeitsplatz? Was ist hier?',answer:'Hier ist ein Tisch.',own:{key:'lernkoko-l3d-own',index:0,pattern:/^hier (ist|steht) (ein|eine) [a-z]+( und (ein|eine) [a-z]+)*$/}},
   {who:'yasemin',question:'Und wie ist er?',answer:'Er ist alt, aber gut.',own:{key:'lernkoko-l3d-own',index:1,pattern:/^(er|es|sie) ist [a-z ,]+$/}},
   {who:'yasemin',question:'Was ist wichtig für dich?',answer:'Der Laptop ist wichtig für mich.',own:{key:'lernkoko-l3d-own',index:2,pattern:/^(der|das|die) [a-z]+ ist (sehr )?wichtig fuer mich$/}},
   {who:'paul',question:'Wie heißt das auf Deutsch?',answer:'Das ist eine Schere.'},
   {who:'paul',question:'Was kostet die Schere?',answer:'Sie kostet zwölf Euro.'},
  ]},
  {id:'ozet',title:T('Bitti'),kind:'end',end:{
   can:[T('Bir iş yerini anlatmak: *Hier ist ein Fenster. Es ist groß. Die Schere ist wichtig für mich.*'),T('Sözlükte artikeli bulmak: *m* → der, *n* → das, *f* → die'),T('Kelime kartlarıyla çalışmak'),T('İsimleri büyük harfle yazmak: *der Tisch, das Handy*')],
   summary:T('**Lektion 3 bitti!** _der / das / die_ · _ein / eine_ · _kein / keine_ · _er / es / sie_ · _Ich finde, …_ · sayılar _21–1000_ · _Was kostet …?_'),
  }},
 ],
};
