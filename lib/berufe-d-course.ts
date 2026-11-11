/**
 * Lektion 2 „Berufe“, Teil D – Ich verstehe das nicht. (the learner's lesson page, an artifact of 2 November 2026),
 * ported like Teil A–C: the cover, six short teaching steps (the words, a quick check, the whole verb table, the
 * Personalformular, learning long words, Wie bitte? and the mime game), six exercises, then „Alles klar?“ like Lektion
 * 1D — four sections with points (Wortschatz 5, Grammatik 5, Kommunikation 5, Prüfung Schreiben 5) and the 12-question
 * test (32 points in all), the points page, Konuş (Sprechen Teil 1, no AI) and Bitti. Rami starts at the care service
 * Sonnenblick; Nora works there as a nurse and says Sie to him (the only place in Lektion 2 with Ihr / Ihre). The
 * learner's own form stays on this device only. Step ids never change: saved scores are keyed by them.
 */
import type {GapLine,SayItem,Step,StepGroup} from './willkommen-course';
import type {Line} from './willkommen-b-course';
import {spelledText} from './willkommen-b-course';
import type {ChoiceGap,ChoiceLine} from './stadt-course';
import type {QuickCheck} from './berufe-course';
import {digitWords} from './berufe-c-course';

/** Pictures of Teil D (public/toon/lektion2, from the learner's page). */
export const berufeDPictures={
 cover:{src:'/toon/lektion2/kapak-d.webp',width:960,height:540},
} as const;
export const castL2D=['rami','nora','mei','tomasz','yasemin','sabine','nikos','omar','paul'] as const;
/** Rami's form at the care service (invented, like every address and number of Lektion 2). */
export const ramiForm:readonly [label:string,value:string][]=[
 ['Familienname','Khalil'],['Vorname','Rami'],['Wohnort','Berlin'],['PLZ','10435'],['Straße und Hausnummer','Kastanienallee 25'],['Beruf','Altenpfleger'],['Telefonnummer','0157 2345 678'],
];
export const khalilSpelled=spelledText('Khalil');

/* ---------- words ---------- */
/** The words: the word, its meaning, an example, the example's meaning and (when it differs) what is read. */
export type WordRowD=readonly [de:string,tr:string,example:string,exampleTr:string,say?:string];
export const wordsD:WordRowD[]=[
 ['der Altenpflege-Service','yaşlı bakım servisi','Rami ist neu beim Altenpflege-Service.','Rami yaşlı bakım servisinde yeni.'],
 ['der Krankenpfleger / die Krankenpflegerin','hemşire, hasta bakıcı','Nora ist Krankenpflegerin.','Nora hemşire.'],
 ['der Chef / die Chefin','patron, şef','Die Chefin spricht Deutsch und Englisch.','Patron Almanca ve İngilizce konuşuyor.'],
 ['neu','yeni','Ich bin neu hier.','Burada yeniyim.'],
 ['nur','sadece, yalnızca','Ich spreche nur ein bisschen Deutsch.','Sadece biraz Almanca konuşuyorum.'],
 ['das Personalformular','personel formu (işe giriş formu)','Hier ist das Personalformular.','İşte personel formu.'],
 ['der Familienname','soyadı (= Nachname)','Familienname: Khalil','Soyadı: Khalil','Familienname: Khalil.'],
 ['der Wohnort','oturduğu yer (= Ort)','Wohnort: Berlin','Oturduğu yer: Berlin','Wohnort: Berlin.'],
 ['buchstabieren','harf harf söylemek, hecelemek','Khalil – ich buchstabiere: K-H-A-L-I-L.','Khalil – harf harf söylüyorum.','Khalil – ich buchstabiere: '+khalilSpelled+'.'],
 ['Wie bitte?','Efendim? / Pardon?','Wie bitte? Noch einmal, bitte.','Efendim? Bir daha lütfen.'],
 ['Wie schreibt man das?','Bu nasıl yazılır?','Khalil? Wie schreibt man das?','Khalil mi? Nasıl yazılır?'],
 ['das Wort, die Wörter','kelime, kelimeler','Die Wörter sind lang und schwer.','Kelimeler uzun ve zor.'],
 ['lang','uzun','Das Wort ist lang.','Kelime uzun.'],
 ['die Silbe, die Silben','hece, heceler','Te-le-fon-num-mer: fünf Silben.','Te-le-fon-num-mer: beş hece.','Te, le, fon, num, mer: fünf Silben.'],
 ['leicht / schwer','kolay / zor','Das ist leicht. Das ist schwer.','Bu kolay. Bu zor.'],
 ['üben','alıştırma yapmak, çalışmak','Wir üben Deutsch.','Almanca çalışıyoruz.'],
 ['Alles klar?','Her şey anlaşıldı mı? / Tamam mı?','Alles klar? – Ja, alles klar!','Anlaşıldı mı? – Evet, tamam!'],
 ['schreiben','yazmak','Ihr schreibt.','Siz yazıyorsunuz.'],
 ['singen','şarkı söylemek','Ihr singt.','Siz şarkı söylüyorsunuz.'],
 ['studieren','üniversitede okumak','Ihr studiert.','Siz üniversitede okuyorsunuz.'],
 ['reparieren','tamir etmek','Ihr repariert.','Siz tamir ediyorsunuz.'],
 ['tanzen','dans etmek','Ihr tanzt.','Siz dans ediyorsunuz.'],
 ['trinken','içmek','Ihr trinkt.','Siz içiyorsunuz.'],
 ['sprechen','konuşmak','Ihr sprecht.','Siz konuşuyorsunuz.'],
];
export const wordSayD=(row:WordRowD)=>row[4]??row[2];
/** The phrases of the unit: German, meaning, what is read. */
export const phrasesD:readonly [de:string,tr:string,say:string][]=[
 ['Sie sind neu hier? – Ja, ich bin neu hier.','Burada yeni misiniz? – Evet, burada yeniyim.','Sie sind neu hier? – Ja, ich bin neu hier.'],
 ['Ich spreche nur ein bisschen Deutsch.','Sadece biraz Almanca konuşuyorum.','Ich spreche nur ein bisschen Deutsch.'],
 ['Personalformular – was bedeutet das?','Personel formu – bu ne demek?','Personalformular – was bedeutet das?'],
 ['Wie bitte? Wie schreibt man das?','Efendim? Nasıl yazılır?','Wie bitte? Wie schreibt man das?'],
 ['Ich buchstabiere: K-H-A-L-I-L.','Harf harf söylüyorum: K-H-A-L-I-L.','Ich buchstabiere: '+khalilSpelled+'.'],
 ['Familienname? – Khalil. Wohnort? – Berlin.','Soyadı? – Khalil. Oturduğu yer? – Berlin.','Familienname? – Khalil. Wohnort? – Berlin.'],
 ['Ihr sprecht. – Nein, ihr singt. – Richtig!','Siz konuşuyorsunuz. – Hayır, şarkı söylüyorsunuz. – Doğru!','Ihr sprecht. – Nein, ihr singt. – Richtig!'],
 ['Alles klar? – Ja, alles klar!','Anlaşıldı mı? – Evet, tamam!','Alles klar? – Ja, alles klar!'],
];

/* ---------- quick checks inside the teaching steps (not scored) ---------- */
const check=(q:string,options:string[],say=options[0]):QuickCheck=>({q,options,say});
export const wordChecksD:QuickCheck[]=[
 check('hemşire (kadın)',['die Krankenpflegerin','die Altenpflegerin','die Chefin']),
 check('„Familienname“ = ?',['Nachname','Vorname','Wohnort']),
 check('„Wie schreibt man das?“',['Bu nasıl yazılır?','Bu ne demek?','Bu kim?'],''),
 check('sadece',['nur','neu','auch']),
 check('hece',['die Silbe','das Wort','die Zahl']),
 check('„Ihr tanzt.“',['Siz dans ediyorsunuz.','Biz dans ediyoruz.','Onlar dans ediyor.'],''),
 check('harf harf söylemek',['buchstabieren','studieren','reparieren']),
 check('„Wohnort“ = ?',['Ort','Straße','Land']),
];
export const verbChecksD:QuickCheck[]=[
 check('Ihr ___ Deutsch. (lernen)',['lernt','lernen','lernst'],'Ihr lernt Deutsch.'),
 check('Wir ___ neu hier. (sein)',['sind','seid','ist'],'Wir sind neu hier.'),
 check('Du ___ als Kellner. (arbeiten)',['arbeitest','arbeitst','arbeitet'],'Du arbeitest als Kellner.'),
 check('Ihr ___ Arabisch. (sprechen)',['sprecht','spricht','sprechen'],'Ihr sprecht Arabisch.'),
];
export const formChecksD:QuickCheck[]=[
 check('„Familienname“ alanına ne yazılır?',['Khalil','Rami','Berlin'],'Familienname: Khalil.'),
 check('„Wohnort“ alanına ne yazılır?',['Berlin','Kastanienallee 25','10435'],'Wohnort: Berlin.'),
];
export const longChecks:QuickCheck[]=[
 check('„Telefonnummer“ kaç hece?',['5','3','4'],''),
 check('Kran-ken-pfle-ge-rin → ?',['Krankenpflegerin','Krankenpfleger','Altenpflegerin']),
];

/* ---------- teaching steps ---------- */
/** Konu 1 · the endings of a regular verb: person, meaning, ending, schreiben, lernen, wohnen (`|` before the ending). */
export const personRows:readonly [person:string,tr:string,ending:string,forms:readonly [string,string,string]][]=[
 ['ich','ben','-e',['schreib|e','lern|e','wohn|e']],
 ['du','sen','-st',['schreib|st','lern|st','wohn|st']],
 ['er / sie','o','-t',['schreib|t','lern|t','wohn|t']],
 ['wir','biz','-en',['schreib|en','lern|en','wohn|en']],
 ['ihr','siz','-t',['schreib|t','lern|t','wohn|t']],
 ['sie / Sie','onlar / siz','-en',['schreib|en','lern|en','wohn|en']],
];
export const regularVerbsD=['schreiben','lernen','wohnen'] as const;
/** The four verbs to watch: the forms of ich … sie / Sie (the special part after `|`). */
export const specialVerbsD:readonly [verb:string,forms:readonly string[]][]=[
 ['arbeiten',['arbeite','arbeit|est','arbeit|et','arbeiten','arbeit|et','arbeiten']],
 ['sprechen',['spreche','spr|i|chst','spr|i|cht','sprechen','sprecht','sprechen']],
 ['heißen',['heiße','heiß|t','heißt','heißen','heißt','heißen']],
 ['sein',['|bin','|bist','|ist','|sind','|seid','|sind']],
];
export const personNames=['ich','du','er','wir','ihr','sie'] as const;
/** A verb read in all six persons ("ich schreibe, du schreibst, er schreibt, wir schreiben, ihr schreibt, sie schreiben."). */
export const conjugationSay=(forms:readonly string[])=>forms.map((form,i)=>`${personNames[i]} ${form.replace(/\|/g,'')}`).join(', ')+'.';
export const regularFormsD=(verb:number)=>personRows.map(row=>row[3][verb]);
/** Konu 2 · the form's names: on the form, the same in Teil C, the meaning. */
export const formNames:readonly [form:string,inC:string,tr:string][]=[
 ['Familienname','Nachname','soyadı'],['Wohnort','Ort','oturduğu şehir'],['Vorname','Vorname','ad'],['PLZ','Postleitzahl','posta kodu'],
 ['Straße und Hausnummer','Adresse','cadde ve kapı numarası'],['Beruf · Telefonnummer','aynı','meslek · telefon numarası'],
];
/** The form passed on in sentences (er): shown, meaning, read. */
export const ramiSentences:readonly [de:string,tr:string,say:string][]=[
 ['Er heißt Rami Khalil. Er wohnt in Berlin, in der Kastanienallee 25.','Adı Rami Khalil. Berlin’de, Kastanienallee 25’te oturuyor.','Er heißt Rami Khalil. Er wohnt in Berlin, in der Kastanienallee fünfundzwanzig.'],
 ['Die Postleitzahl ist 10435. Er ist Altenpfleger von Beruf.','Posta kodu 10435. Yaşlı bakıcısı.','Die Postleitzahl ist '+digitWords('10435')+'. Er ist Altenpfleger von Beruf.'],
 ['Die Telefonnummer ist 0157 2345 678.','Telefon numarası 0157 2345 678.','Die Telefonnummer ist '+digitWords('0157 2345 678')+'.'],
];
/** Konu 3 · long words in syllables. */
export const syllableWords:readonly [parts:readonly string[],word:string][]=[
 [['Kran','ken','pfle','ge','rin'],'Krankenpflegerin'],[['buch','sta','bie','ren'],'buchstabieren'],[['Te','le','fon','num','mer'],'Telefonnummer'],
 [['Post','leit','zahl'],'Postleitzahl'],[['Fa','mi','li','en','na','me'],'Familienname'],[['Wohn','ort'],'Wohnort'],[['Haus','num','mer'],'Hausnummer'],
];
export const syllableSay=(row:readonly [readonly string[],string])=>row[0].join(', ')+'. '+row[1]+'.';
export const longWordSteps:readonly [title:string,text:string][]=[
 ['Parçala:','Kelimenin içindeki tanıdık parçaları bul: Kranken (hasta) + Pflegerin (bakıcı).'],
 ['Hecele:','Kran-ken-pfle-ge-rin. Her hecede elini masaya vur.'],
 ['Yavaş, sonra hızlı:','Üç kez yavaş, üç kez normal hızda söyle.'],
 ['Yaz:','Bakmadan yaz, kontrol et. Kelimeyi dinle, tekrar et.'],
];
/** Konu 4 · when you do not understand. */
export const pardonPhrases:readonly [de:string,tr:string,say:string][]=[
 ['Wie bitte?','Efendim? / Pardon, bir daha?','Wie bitte?'],
 ['Noch einmal, bitte. Langsam.','Bir daha lütfen. Yavaş.','Noch einmal, bitte. Langsam.'],
 ['Wie schreibt man das?','Bu nasıl yazılır?','Wie schreibt man das?'],
 ['Ich buchstabiere: K-H-A-L-I-L.','Harf harf söylüyorum: Ka-Ha-A-El-İ-El.','Ich buchstabiere: '+khalilSpelled+'.'],
];
/** Nora and Rami at the care service (she says Sie: Ihr Nachname). */
export const noraRami:Line[]=[
 {who:'nora',de:'Familienname?',tr:'Soyadı?'},
 {who:'rami',de:'Familienname? Ich verstehe das nicht.',tr:'Familienname mi? Bunu anlamıyorum.'},
 {who:'nora',de:'Familienname bedeutet: Wie ist Ihr Nachname?',tr:'Familienname şu demek: Soyadınız ne?'},
 {who:'rami',de:'Ah, Khalil.',tr:'Ah, Khalil.'},
 {who:'nora',de:'Wie bitte? Wie schreibt man das?',tr:'Efendim? Nasıl yazılır?'},
 {who:'rami',de:'K-H-A-L-I-L.',tr:'Ka-Ha-A-El-İ-El.',say:khalilSpelled+'.'},
 {who:'nora',de:'Danke. Alles klar!',tr:'Teşekkürler. Tamam!'},
];
/** The mime game (the book's game: two people act, the others guess with ihr). */
export const mimePhrases:readonly [de:string,tr:string][]=[['Ihr sprecht.','Siz konuşuyorsunuz.'],['Nein, ihr singt!','Hayır, siz şarkı söylüyorsunuz!'],['Richtig!','Doğru!']];

/* ---------- exercises ---------- */
/** Exercise 1 · Rami's first day (heard; the text stays hidden until the learner shows it), then richtig or falsch. */
export const firstDay:Line[]=[
 {who:'nora',de:'Guten Tag! Sie sind neu beim Altenpflege-Service Sonnenblick?',tr:'İyi günler! Sonnenblick yaşlı bakım servisinde yeni misiniz?'},
 {who:'rami',de:'Ja, guten Tag. Ich bin Rami Khalil. Ich bin Altenpfleger.',tr:'Evet, iyi günler. Ben Rami Khalil. Yaşlı bakıcısıyım.'},
 {who:'nora',de:'Herzlich willkommen! Ich bin Nora Weiß. Ich bin Krankenpflegerin, ich arbeite auch hier.',tr:'Hoş geldiniz! Ben Nora Weiß. Hemşireyim, ben de burada çalışıyorum.'},
 {who:'rami',de:'Danke. Ich spreche nur ein bisschen Deutsch.',tr:'Teşekkürler. Sadece biraz Almanca konuşuyorum.'},
 {who:'nora',de:'Kein Problem. Hier ist das Personalformular. Ich helfe gern.',tr:'Sorun değil. İşte personel formu. Seve seve yardım ederim.'},
 {who:'rami',de:'Personalformular – was bedeutet das?',tr:'Personel formu – bu ne demek?'},
 {who:'nora',de:'Das Formular für die Arbeit: Name, Adresse, Telefonnummer.',tr:'İş için form: ad, adres, telefon numarası.'},
];
/** [statement, right answer, what is read after the answer (the right answer), the explanation shown after it] */
export const firstDayRows:readonly [statement:string,answer:'Richtig'|'Falsch',say:string,note:string][]=[
 ['Rami ist neu beim Altenpflege-Service.','Richtig','Richtig!','Rami servise yeni başlıyor.'],
 ['Frau Weiß arbeitet auch als Altenpflegerin.','Falsch','Falsch. Sie ist Krankenpflegerin.','Nora Weiß hemşire (Krankenpflegerin).'],
 ['Herr Khalil spricht nur ein bisschen Deutsch.','Richtig','Richtig!','„Ich spreche nur ein bisschen Deutsch.“'],
 ['Frau Weiß braucht Hilfe.','Falsch','Falsch. Rami braucht Hilfe.','Yardıma ihtiyacı olan Rami; Nora „Ich helfe gern.“ diyor.'],
];
/** Exercise 2 · Nora asks, Rami answers (heard), the learner fills in the form. */
export const formTalk:SayItem[]=[
 {text:'Also, Familienname?',who:'nora'},{text:'Khalil. '+khalilSpelled+'.',who:'rami'},
 {text:'Vorname?',who:'nora'},{text:'Rami.',who:'rami'},
 {text:'Wohnort?',who:'nora'},{text:'Berlin.',who:'rami'},
 {text:'Postleitzahl?',who:'nora'},{text:digitWords('10435')+'.',who:'rami'},
 {text:'Straße und Hausnummer?',who:'nora'},{text:'Kastanienallee fünfundzwanzig.',who:'rami'},
 {text:'Beruf?',who:'nora'},{text:'Altenpfleger.',who:'rami'},
 {text:'Und die Telefonnummer?',who:'nora'},{text:digitWords('0157 2345 678')+'.',who:'rami'},
 {text:'Danke, alles klar!',who:'nora'},
];
/** A field of Rami's form: chosen from three words, or typed (`digits`: only the digits count). `say` is read when right. */
export type FormField={label:string;answer:string;options?:string[];digits?:boolean;say?:string};
export const formFields:FormField[]=[
 {label:'Familienname',answer:'Khalil',options:['Khalil','Kamau','Nowak']},
 {label:'Vorname',answer:'Rami',options:['Rami','Omar','Nikos']},
 {label:'Wohnort',answer:'Berlin',options:['Berlin','Hamburg','Beirut']},
 {label:'PLZ',answer:'10435',digits:true,say:'Die Postleitzahl ist '+digitWords('10435')+'.'},
 {label:'Straße und Hausnummer',answer:'Kastanienallee 25',say:'Kastanienallee fünfundzwanzig.'},
 {label:'Beruf',answer:'Altenpfleger',options:['Altenpfleger','Krankenpfleger','Kellner']},
 {label:'Telefonnummer',answer:'0157 2345 678',digits:true,say:'Die Telefonnummer ist '+digitWords('0157 2345 678')+'.'},
];
/** Exercise 3 · the verb table: [verb, the six forms]; a gap is a form to write (`given` are shown). */
export type TableVerb={verb:string;forms:readonly string[];given:readonly number[]};
export const tableVerbs:TableVerb[]=[
 {verb:'schreiben',forms:['schreibe','schreibst','schreibt','schreiben','schreibt','schreiben'],given:[]},
 {verb:'sprechen',forms:['spreche','sprichst','spricht','sprechen','sprecht','sprechen'],given:[0,3,5]},
 {verb:'sein',forms:['bin','bist','ist','sind','seid','sind'],given:[0,2]},
];
/** The gaps in reading order (row by row: ich, du, er / sie …), each with what is read when it is right. */
export const tableCells=personNames.flatMap((person,row)=>tableVerbs.flatMap((verb,col)=>verb.given.includes(row)?[]:[{row,col,answer:verb.forms[row],say:`${person} ${verb.forms[row]}`}]));
/** Exercise 4 · the mime game: what the two people do, the right guess and the options. */
export const mimeRows:readonly [emoji:string,answer:string,options:string[],tr:string][]=[
 ['💃🕺','Ihr tanzt.',['Ihr tanzt.','Ihr singt.','Ihr trinkt.'],'dans ediyorlar'],
 ['🎤🎶','Ihr singt.',['Ihr singt.','Ihr sprecht.','Ihr schreibt.'],'şarkı söylüyorlar'],
 ['☕🧋','Ihr trinkt.',['Ihr trinkt.','Ihr tanzt.','Ihr studiert.'],'bir şey içiyorlar'],
 ['✍️📝','Ihr schreibt.',['Ihr schreibt.','Ihr repariert.','Ihr singt.'],'yazıyorlar'],
 ['🔧🚗','Ihr repariert.',['Ihr repariert.','Ihr trinkt.','Ihr sprecht.'],'araba tamir ediyorlar'],
 ['📚🎓','Ihr studiert.',['Ihr studiert.','Ihr schreibt.','Ihr tanzt.'],'üniversitede okuyorlar'],
 ['🗣️💬','Ihr sprecht.',['Ihr sprecht.','Ihr singt.','Ihr repariert.'],'konuşuyorlar'],
];
/** Exercise 5 · build the long word from its syllables (the goal in Turkish). */
export const syllableOrder:string[][]=[['Kran','ken','pfle','ge','rin'],['Te','le','fon','num','mer'],['Post','leit','zahl'],['Fa','mi','li','en','na','me'],['buch','sta','bie','ren'],['Haus','num','mer']];
export const syllableMeanings=['hemşire (kadın)','telefon numarası','posta kodu','soyadı','harf harf söylemek','kapı numarası'];
/** Exercise 6 · the learner's own Personalformular: stays on this device only (lib/lesson-sync.ts never sends it). */
export const L2D_FORM_KEY='lernkoko-l2d-form';
export type OwnField={key:'vor'|'nach'|'str'|'plz'|'ort'|'beruf'|'tel';label:string;numeric?:boolean};
export const ownFields:OwnField[]=[
 {key:'vor',label:'Vorname'},{key:'nach',label:'Familienname'},{key:'str',label:'Straße und Hausnummer'},{key:'plz',label:'PLZ',numeric:true},
 {key:'ort',label:'Wohnort'},{key:'beruf',label:'Beruf'},{key:'tel',label:'Telefonnummer',numeric:true},
];
/** A field is filled in: PLZ five digits, a phone number at least eight digits, anything else two letters or more. */
export const ownFieldOk=(field:OwnField,value:string)=>{const v=value.trim();if(field.key==='plz')return /^\d{5}$/.test(v);if(field.key==='tel')return v.replace(/\D/g,'').length>=8;return v.length>=2;};

/* ---------- Alles klar? (the points test of Lektion 2) ---------- */
/** 1 Wortschatz: the five words of the box into Mei and Tomasz's dialogue. */
export const vocabBoxD=['Formular','Problem','Nachname','Hilfe','Beruf'];
const vocabGap=(answer:string):ChoiceGap=>({options:vocabBoxD,answer});
const said=(line:ChoiceLine)=>line.parts.map(part=>typeof part==='string'?part:part.answer).join('');
const withSay=(line:ChoiceLine):ChoiceLine=>({...line,say:{text:said(line),who:line.who}});
export const vocabLinesD:ChoiceLine[]=[
 {key:'w1',who:'mei',parts:['Entschuldigung, ich brauche ',vocabGap('Hilfe'),'.']},
 {key:'w2',who:'tomasz',parts:['Ja? Was ist das ',vocabGap('Problem'),'?']},
 {key:'w3',who:'mei',parts:['Das ',vocabGap('Formular'),'. Ich verstehe das nicht.']},
 {key:'w4',who:'tomasz',parts:['Ich helfe gerne. Wie ist dein ',vocabGap('Nachname'),'?']},
 {key:'w5',who:'mei',parts:['Suwan. Mei Suwan.']},
 {key:'w6',who:'tomasz',parts:['Und was bist du von ',vocabGap('Beruf'),'?']},
 {key:'w7',who:'mei',parts:['Ich bin Ingenieurin.']},
].map(withSay);
/** 2 Grammatik: Yasemin (a) and Sabine (b); the verb in brackets. Ten gaps, half a point each. */
export const grammarLinesD:GapLine[]=[
 {who:'a',text:'Ich ___ Yasemin. (sein)',answers:[['bin']]},
 {who:'b',text:'Hallo, Yasemin. Wie ___ dein Nachname? (sein)',answers:[['ist']]},
 {who:'a',text:'Was ___ du beruflich? (machen)',answers:[['machst']]},
 {who:'b',text:'Ich ___ als Verkäuferin. (arbeiten)',answers:[['arbeite']]},
 {who:'a',text:'Entschuldigung, ich ___ das nicht. (verstehen)',answers:[['verstehe']]},
 {who:'b',text:'Ich ___ gern. (helfen)',answers:[['helfe']]},
 {who:'a',text:'Wir ___ in Berlin. Und du? (wohnen)',answers:[['wohnen']]},
 {who:'b',text:'Ich ___ auch in Berlin! (wohnen)',answers:[['wohne']]},
 {who:'a',text:'Woher ___ ihr, Omar und du? (kommen)',answers:[['kommt']]},
 {who:'b',text:'Wir ___ aus dem Sudan und aus Hamburg. (kommen)',answers:[['kommen']]},
];
export const grammarSpeakersD={a:'yasemin',b:'sabine'} as const;
export const grammarSayD=grammarLinesD.map(line=>line.text.replace(/ \([^)]*\)$/,'').replace('___',line.answers[0][0]));
/** 3 Kommunikation: the answer is given; build the question with ihr. */
export const talkQuestionsD:string[][]=[['Wer','seid','ihr?'],['Woher','kommt','ihr?'],['Wo','wohnt','ihr?'],['Welche','Sprachen','sprecht','ihr?'],['Was','seid','ihr','von','Beruf?']];
export const talkAnswersD=['Ich bin Nikos und das ist Omar.','Wir kommen aus Griechenland und aus dem Sudan.','Wir wohnen in Berlin.','Wir sprechen Griechisch, Arabisch und Deutsch.','Nikos ist Mechatroniker. Ich bin Friseur.'];
/** Prüfung: Schreiben Teil 1 — a text about Tomasz and a form (Start Deutsch A1 / telc A1). */
export const tomaszExam='Das ist Tomasz Nowak. Er kommt aus Polen. Tomasz ist Kellner von Beruf. Er spricht Polnisch und Deutsch und er lernt jetzt auch Englisch. Tomasz ist schon lange in Deutschland. Er wohnt in der Finowstraße 21, in 22765 Hamburg.';
export const tomaszExamSay='Das ist Tomasz Nowak. Er kommt aus Polen. Tomasz ist Kellner von Beruf. Er spricht Polnisch und Deutsch und er lernt jetzt auch Englisch. Tomasz ist schon lange in Deutschland. Er wohnt in der Finowstraße einundzwanzig, in '+digitWords('22765')+' Hamburg.';
export const examFormD:GapLine[]=[
 {text:'Heimatland: ___',answers:[['Polen']]},
 {text:'Straße, Hausnummer: ___',answers:[['Finowstraße 21']]},
 {text:'PLZ, Ort: ___',answers:[['22765 Hamburg']]},
 {text:'Beruf: ___',answers:[['Kellner']]},
 {text:'Sprachen: ___',answers:[['Polnisch, Deutsch','Polnisch und Deutsch','Polnisch, Deutsch, Englisch','Polnisch, Deutsch und Englisch','Polnisch, Deutsch und ein bisschen Englisch','Deutsch, Polnisch','Deutsch und Polnisch','Deutsch, Polnisch, Englisch','Deutsch, Polnisch und Englisch']]},
];
/** The test: question, options, the right answer and what is read after the answer ('' for an answer that is not German). */
export type BerufeDTestQuestion=readonly [question:string,options:string[],answer:string,say:string];
const q=(question:string,options:string[],say:string):BerufeDTestQuestion=>[question,options,options[0],say];
export const berufeTestD:BerufeDTestQuestion[]=[
 q('Ihr ___ Deutsch. (lernen)',['lernt','lernen','lernst'],'Ihr lernt Deutsch.'),
 q('Wir ___ neu hier. (sein)',['sind','seid','bin'],'Wir sind neu hier.'),
 q('Ihr ___ Arabisch? (sprechen)',['sprecht','spricht','sprechen'],'Ihr sprecht Arabisch?'),
 q('Du ___ als Kellner. (arbeiten)',['arbeitest','arbeitet','arbeiten'],'Du arbeitest als Kellner.'),
 q('„Familienname“ = ?',['Nachname','Vorname','Wohnort'],'Nachname'),
 q('„Wohnort“ = ?',['Ort','Straße','Land'],'Ort'),
 q('Adını duyamadın. Ne dersin?',['Wie bitte?','Alles klar!','Richtig!'],'Wie bitte?'),
 q('„Wie schreibt man das?“',['Bu nasıl yazılır?','Bu ne demek?','Bu nerede?'],''),
 q('Ich spreche ___ ein bisschen Deutsch.',['nur','neu','nicht'],'Ich spreche nur ein bisschen Deutsch.'),
 q('Kran-ken-pfle-ge-rin: kaç hece?',['5','4','6'],''),
 q('Pantomim: iki kişi dans ediyor. Tahmin:',['Ihr tanzt!','Ihr singt!','Wir tanzen!'],'Ihr tanzt!'),
 q('„Alles klar?“ – cevap:',['Ja, alles klar!','Nein, ich bin Koch.','Wie bitte, danke.'],'Ja, alles klar!'),
];
/** The sections of "Alles klar?" with their points (like the book: under half the points → "Bitte noch üben!"). */
export const checkSectionsD:{id:string;label:string;points:number}[]=[
 {id:'wortschatz',label:'1 Wortschatz',points:5},{id:'grammatik',label:'2 Grammatik',points:5},{id:'kommunikation',label:'3 Kommunikation',points:5},
 {id:'schreiben',label:'4 Prüfung: Schreiben',points:5},{id:'test',label:'5 Test',points:12},
];
export const checkPointsD=checkSectionsD.reduce((n,section)=>n+section.points,0);
/** Konuş · Sprechen Teil 1: Paul Hoca asks, Rami answers first, then the learner (from their own form when it is there). */
export type ExamTalk={key:'name'|'land'|'wohnort'|'sprachen'|'beruf';question:string;rami:string};
export const examTalk:ExamTalk[]=[
 {key:'name',question:'Name?',rami:'Ich heiße Rami Khalil.'},
 {key:'land',question:'Land?',rami:'Ich komme aus dem Libanon, aus Beirut.'},
 {key:'wohnort',question:'Wohnort?',rami:'Ich wohne in Berlin.'},
 {key:'sprachen',question:'Sprachen?',rami:'Ich spreche Arabisch, Französisch und ein bisschen Deutsch.'},
 {key:'beruf',question:'Beruf?',rami:'Ich bin Altenpfleger von Beruf.'},
];

/* ---------- steps ---------- */
export const berufeStepsD:Step[]=[
 {id:'kapak',title:'Kapak',kind:'cover'},
 {id:'kelimeler',title:'Kelimeler: liste',kind:'teach'},
 {id:'kontrol',title:'Kelime kontrolü',kind:'teach'},
 {id:'fiil-tablo',title:'Bütün fiil tablosu',kind:'teach'},
 {id:'personalformular',title:'Personalformular',kind:'teach'},
 {id:'uzun-kelimeler',title:'Uzun kelimeler',kind:'teach'},
 {id:'wie-bitte',title:'Wie bitte? ve oyun',kind:'teach'},
 {id:'hoeren',title:'Alıştırma 1',kind:'exercise'},
 {id:'form-dinle',title:'Alıştırma 2',kind:'exercise'},
 {id:'fiil-yaz',title:'Alıştırma 3',kind:'exercise'},
 {id:'pantomim',title:'Alıştırma 4',kind:'exercise'},
 {id:'heceler',title:'Alıştırma 5',kind:'exercise'},
 {id:'dein-formular',title:'Alıştırma 6',kind:'exercise'},
 {id:'wortschatz',title:'Alles klar? 1',kind:'exercise'},
 {id:'grammatik',title:'Alles klar? 2',kind:'exercise'},
 {id:'kommunikation',title:'Alles klar? 3',kind:'exercise'},
 {id:'schreiben',title:'Alles klar? 4',kind:'exercise'},
 {id:'test',title:'Alles klar? 5',kind:'test'},
 {id:'puanlar',title:'Puanların',kind:'end'},
 {id:'konus',title:'Konuş',kind:'speak'},
 {id:'bitti',title:'Bitti',kind:'end'},
];
export const berufeStepIndexD=(id:string)=>berufeStepsD.findIndex(step=>step.id===id);
export const berufeStepShortD:Record<string,string>={'hoeren':'Hören','form-dinle':'Formu doldur','fiil-yaz':'Fiil tablosu','pantomim':'Pantomim','heceler':'Heceler','dein-formular':'Senin formun','wortschatz':'Wortschatz','grammatik':'Grammatik','kommunikation':'Kommunikation','schreiben':'Schreiben','test':'Test','puanlar':'Puanların'};
const choiceCount=(lines:readonly ChoiceLine[])=>lines.reduce((n,line)=>n+line.parts.filter(part=>typeof part!=='string').length,0);
/** Every exercise is scored; the "Alles klar?" sections by their points. */
export const berufeScoredD:{id:string;total:number}[]=[
 {id:'hoeren',total:firstDayRows.length},
 {id:'form-dinle',total:formFields.length},
 {id:'fiil-yaz',total:tableCells.length},
 {id:'pantomim',total:mimeRows.length},
 {id:'heceler',total:syllableOrder.length},
 {id:'dein-formular',total:ownFields.length},
 {id:'wortschatz',total:choiceCount(vocabLinesD)},
 {id:'grammatik',total:5},
 {id:'kommunikation',total:talkQuestionsD.length},
 {id:'schreiben',total:examFormD.length},
 {id:'test',total:berufeTestD.length},
];
export const berufeGroupsD:StepGroup[]=[
 {id:'konu',label:'Konu anlatımı',ids:berufeStepsD.filter(step=>step.kind==='teach').map(step=>step.id)},
 {id:'alistirmalar',label:'Alıştırmalar',ids:['hoeren','form-dinle','fiil-yaz','pantomim','heceler','dein-formular']},
 {id:'test',label:'Alles klar?',ids:['wortschatz','grammatik','kommunikation','schreiben','test','puanlar']},
 {id:'konus',label:'Konuş',ids:['konus']},
];
export const berufeWordCountD=wordsD.length;

/** Every German text Teil D speaks (rendered as site voices by scripts/voices). */
export function berufeDSpeechTexts():string[]{
 const out=new Set<string>();const add=(text:string|undefined)=>{const clean=(text??'').trim();if(clean)out.add(clean);};
 const say=(item:SayItem|undefined)=>{if(item)add(typeof item==='string'?item:item.text);};
 wordsD.forEach(row=>add(wordSayD(row)));phrasesD.forEach(([,,text])=>add(text));
 for(const item of [...wordChecksD,...verbChecksD,...formChecksD,...longChecks])add(item.say);
 regularVerbsD.forEach((_,i)=>add(conjugationSay(regularFormsD(i))));specialVerbsD.forEach(([,forms])=>add(conjugationSay(forms)));
 ramiSentences.forEach(([,,text])=>add(text));syllableWords.forEach(row=>add(syllableSay(row)));
 pardonPhrases.forEach(([,,text])=>add(text));mimePhrases.forEach(([de])=>add(de));
 for(const line of [...noraRami,...firstDay])add(line.say??line.de);
 firstDayRows.forEach(([,,text])=>add(text));formTalk.forEach(say);formFields.forEach(field=>add(field.say));
 tableCells.forEach(cell=>add(cell.say));mimeRows.forEach(([,answer])=>add(answer));syllableOrder.forEach(parts=>add(parts.join('')));
 vocabLinesD.forEach(line=>say(line.say));grammarSayD.forEach(add);talkQuestionsD.forEach(words=>add(words.join(' ')));add(tomaszExamSay);
 berufeTestD.forEach(question=>add(question[3]));
 examTalk.forEach(item=>{add(item.question);add(item.rami);});
 ['sehr gut','gut','nicht so gut','Ich buchstabiere'].forEach(add);
 return [...out];
}
