/**
 * Lektion 2 „Berufe“, Teil B – Wer ist das? (the learner's lesson page, an artifact of 2 November 2026), ported like
 * Teil A (lib/berufe-course.ts): the cover, eight short teaching steps (who does what, the words, a quick check,
 * er / sie / sie, the verbs, introducing someone, questions about someone, capital letters), seven exercises, a
 * 12-question test and the summary with a speaking practice. Texts for the learner are Turkish; the German is read with
 * the site voices, each person with their own voice. A `|` in a shown form marks the part in bold ("komm|t" → komm**t**);
 * it is never read. Step ids never change: saved scores are keyed by them.
 */
import type {SayItem,Step,StepGroup} from './willkommen-course';
import type {ChoiceLine} from './stadt-course';
import type {QuickCheck} from './berufe-course';

/** Pictures of Teil B (public/toon/lektion2/b-*.webp and kapak-b.webp, from the learner's page). */
export const berufeBPictures={cover:{src:'/toon/lektion2/kapak-b.webp',width:960,height:540}} as const;
/** The people of Teil B (portraits and voices of the site). Paul Hoca reads the texts about other people. */
export const castL2B=['nikos','aisha','yasemin','mei','rami','tomasz','omar','sabine','nora','paul'] as const;
export const NARRATOR='paul';
/** The text without the bold marks (what is read). */
export const plainText=(text:string)=>text.split('|').join('');

/* ---------- words ---------- */
/** Who does what: the picture, the person, the job (if any), the sentence and its meaning. */
export type Doing={key:string;who:string;job?:string;sentence:string;tr:string;alt:string};
export const doings:Doing[]=[
 {key:'b-basketballer',who:'tomasz',job:'der Basketballer',sentence:'Er macht Sport. Er trainiert.',tr:'Spor yapıyor. Antrenman yapıyor.',alt:'Tomasz basketbolcu: sahada elinde basketbol topu, forma ve şortla'},
 {key:'b-saengerin',who:'aisha',job:'die Sängerin',sentence:'Sie singt Lieder.',tr:'Şarkı söylüyor.',alt:'Aisha şarkıcı: sahnede tek başına, elinde mikrofon'},
 {key:'b-regisseur',who:'rami',job:'der Regisseur',sentence:'Er macht Filme.',tr:'Film yapıyor.',alt:'Rami yönetmen: film kamerasının yanında, elinde klaket ve megafon'},
 {key:'b-autorin',who:'nora',job:'die Autorin',sentence:'Sie schreibt Bücher.',tr:'Kitap yazıyor.',alt:'Nora yazar: masada dizüstü bilgisayar ve bir yığın kitapla'},
 {key:'b-tee',who:'mei',sentence:'Sie trinkt Tee.',tr:'Çay içiyor.',alt:'Mei çay içiyor: koltukta, elinde fincan, yanında küçük bir masa ve demlik'},
 {key:'b-tanzen',who:'rami',sentence:'Er tanzt.',tr:'Dans ediyor.',alt:'Rami dans ediyor: neşeli, kulaklıkla'},
];
/** The words: the word, its meaning, an example and the example's meaning; the row reads the example. */
export const wordsB:readonly [de:string,tr:string,example:string,exampleTr:string][]=[
 ['wer','kim','Wer ist das? – Das ist Nikos.','Bu kim? – Bu Nikos.'],
 ['er','o (erkek)','Er kommt aus Griechenland.','O Yunanistan’dan geliyor. (erkek)'],
 ['sie','o (kadın)','Sie wohnt in Berlin.','O Berlin’de oturuyor. (kadın)'],
 ['sie (Pl.)','onlar','Sie lernen Deutsch.','Onlar Almanca öğreniyor.'],
 ['wo','nerede','Wo wohnt er?','O nerede oturuyor?'],
 ['wohnen (in)','oturmak, yaşamak (-de)','Sie wohnt in Hamburg.','Hamburg’da oturuyor.'],
 ['das ist in …','orası …-de (şehir → ülke)','Thessaloniki – das ist in Griechenland.','Selanik – orası Yunanistan’da.'],
 ['schon lange','uzun zamandır','Er wohnt schon lange in Deutschland.','Uzun zamandır Almanya’da oturuyor.'],
 ['jetzt','şimdi','Sie wohnt jetzt in Berlin.','Şimdi Berlin’de oturuyor.'],
 ['bekannt','tanınmış, ünlü','Sie ist sehr bekannt.','O çok tanınmış.'],
 ['das Buch, die Bücher','kitap, kitaplar','Nora schreibt Bücher.','Nora kitap yazıyor.'],
 ['schreiben','yazmak','Er schreibt ein Buch.','Bir kitap yazıyor.'],
 ['der Film, die Filme','film: Filme machen = film yapmak','Rami macht Filme.','Rami film yapıyor.'],
 ['das Lied, die Lieder','şarkı: Lieder singen = şarkı söylemek','Aisha singt Lieder.','Aisha şarkı söylüyor.'],
 ['singen','şarkı söylemek','Sie singt sehr gut.','Çok güzel şarkı söylüyor.'],
 ['der Sport','spor: Sport machen = spor yapmak','Tomasz macht Sport.','Tomasz spor yapıyor.'],
 ['trainieren','antrenman yapmak','Er trainiert und macht Sport.','Antrenman yapıyor ve spor yapıyor.'],
 ['tanzen','dans etmek','Rami tanzt.','Rami dans ediyor.'],
 ['der Tee','çay','Mei trinkt Tee.','Mei çay içiyor.'],
 ['trinken','içmek','Was trinkst du? – Tee.','Ne içiyorsun? – Çay.'],
 ['der Basketballer / die Basketballerin','basketbolcu','Tomasz ist Basketballer.','Tomasz basketbolcu.'],
 ['der Regisseur / die Regisseurin','yönetmen','Rami ist Regisseur.','Rami yönetmen.'],
 ['der Autor / die Autorin','yazar','Nora ist Autorin.','Nora yazar.'],
 ['der Sänger / die Sängerin','şarkıcı','Aisha ist Sängerin.','Aisha şarkıcı.'],
];
/** The phrases of the unit (Konu 5, to learn by heart). */
export const phrasesB:readonly [de:string,tr:string][]=[
 ['Wer ist das?','Bu kim?'],
 ['Das ist Nikos. Er kommt aus Griechenland.','Bu Nikos. Yunanistan’dan geliyor.'],
 ['Das sind Yasemin und Mei. Sie wohnen in Berlin.','Bunlar Yasemin ve Mei. Berlin’de oturuyorlar.'],
 ['Woher kommt er? – Er kommt aus Thessaloniki. Das ist in Griechenland.','Nereden geliyor? – Selanik’ten. Orası Yunanistan’da.'],
 ['Wo wohnt sie? – Sie wohnt schon lange in Deutschland.','Nerede oturuyor? – Uzun zamandır Almanya’da oturuyor.'],
 ['Was ist er von Beruf? – Er ist Mechatroniker.','Mesleği ne? – Mekatronik teknisyeni.'],
 ['Welche Sprachen spricht sie? – Sie spricht Swahili, Englisch und Deutsch.','Hangi dilleri konuşuyor? – Swahili, İngilizce ve Almanca.'],
 ['Was macht er? – Er macht Sport. Er trainiert.','Ne yapıyor? – Spor yapıyor. Antrenman yapıyor.'],
 ['Was machen sie? – Sie lernen Deutsch.','Onlar ne yapıyor? – Almanca öğreniyorlar.'],
];

/* ---------- quick checks inside the teaching steps (not scored) ---------- */
const check=(q:string,options:string[],say=options[0]):QuickCheck=>({q,options,say});
export const wordChecksB:QuickCheck[]=[
 check('„Wer ist das?“',['Bu kim?','Bu ne?','Bu nerede?'],''),
 check('o (kadın)',['sie','er','wir']),
 check('„Er macht Filme.“ – Kim?',['der Regisseur','der Autor','der Sänger']),
 check('uzun zamandır',['schon lange','jetzt','auch']),
 check('„Sie schreibt Bücher.“',['Kitap yazıyor.','Kitap okuyor.','Şarkı söylüyor.'],''),
 check('çay içmek',['Tee trinken','Sport machen','Lieder singen']),
 check('„Wo wohnt er?“',['Nerede oturuyor?','Nereden geliyor?','Ne yapıyor?'],''),
 check('onlar',['sie (Pl.)','er','du'],'sie'),
];
export const pronounChecks:QuickCheck[]=[
 check('Das ist Rami. ___ kommt aus dem Libanon.',['Er','Sie','Ich'],'Das ist Rami. Er kommt aus dem Libanon.'),
 check('Das ist Mei. ___ kommt aus Thailand.',['Sie','Er','Du'],'Das ist Mei. Sie kommt aus Thailand.'),
 check('„Sie lernen Deutsch.“ – Burada „sie“ kim?',['onlar','o (kadın)','ben'],''),
];
export const verbChecksB:QuickCheck[]=[
 check('Rami ___ Arabisch und Französisch.',['spricht','sprechen','sprichst'],'Rami spricht Arabisch und Französisch.'),
 check('Sabine und Tomasz ___ in Hamburg.',['wohnen','wohnt','wohne'],'Sabine und Tomasz wohnen in Hamburg.'),
 check('Omar ___ Friseur von Beruf.',['ist','sind','bist'],'Omar ist Friseur von Beruf.'),
 check('Aisha ___ als Taxifahrerin.',['arbeitet','arbeiten','arbeitest'],'Aisha arbeitet als Taxifahrerin.'),
];
export const introChecks:QuickCheck[]=[
 check('„Selanik’ten geliyor. Orası Yunanistan’da.“',['Er kommt aus Thessaloniki. Das ist in Griechenland.','Er kommt aus Griechenland. Das ist in Thessaloniki.','Er wohnt in Thessaloniki. Das ist aus Griechenland.']),
 check('İki kişiyi tanıtıyorsun:',['Das sind Omar und Sabine.','Das ist Omar und Sabine.','Das bin Omar und Sabine.']),
];
export const questionChecks:QuickCheck[]=[
 check('___ kommt Tomasz? – Aus Polen.',['Woher','Wo','Wer'],'Woher kommt Tomasz? Aus Polen.'),
 check('___ wohnt Sabine? – In Hamburg.',['Wo','Woher','Was'],'Wo wohnt Sabine? In Hamburg.'),
 check('___ ist das? – Das ist Paul.',['Wer','Was','Wo'],'Wer ist das? Das ist Paul.'),
];

/* ---------- teaching steps ---------- */
/** Konu 1 · er, sie, sie (Pl.): the word, its meaning and an example (the row reads the example). */
export type Pronoun='er'|'sie'|'pl';
export const pronounRows:readonly [kind:Pronoun,de:string,tr:string,example:string][]=[
 ['er','er','o (erkek)','Das ist Nikos. |Er| kommt aus Griechenland.'],
 ['sie','sie','o (kadın)','Das ist Aisha. |Sie| kommt aus Kenia.'],
 ['pl','sie','onlar','Das sind Yasemin und Mei. |Sie| wohnen in Berlin.'],
];
export const sieTwo:readonly [de:string,tr:string][]=[['Sie wohn|t| in Berlin.','O Berlin’de oturuyor. (bir kadın → fiil -t)'],['Sie wohn|en| in Berlin.','Onlar Berlin’de oturuyor. (birden çok kişi → fiil -en)']];
export const sieThree:readonly [kind:Pronoun|'Sie',de:string,tr:string,verb:string][]=[['sie','sie','o (kadın)','sie komm|t'],['pl','sie','onlar','sie komm|en'],['Sie','Sie','siz (resmî)','Sie komm|en']];
export const dasIst:readonly [de:string,tr:string][]=[['Das ist Omar.','Bu Omar.'],['Das sind Omar und Sabine.','Bunlar Omar ve Sabine.']];
/** Konu 2 · the verbs: ich, du, er / sie, sie (Pl.) / Sie (the row is read: "ich komme, du kommst, er kommt, sie kommen."). */
export type VerbRow=readonly [verb:string,ich:string,du:string,er:string,sie:string];
export const regularVerbs:VerbRow[]=[
 ['kommen','komm|e','komm|st','komm|t','komm|en'],['wohnen','wohn|e','wohn|st','wohn|t','wohn|en'],['machen','mach|e','mach|st','mach|t','mach|en'],
 ['lernen','lern|e','lern|st','lern|t','lern|en'],['schreiben','schreib|e','schreib|st','schreib|t','schreib|en'],
];
export const specialVerbs:VerbRow[]=[
 ['sprechen','spreche','spr|i|chst','spr|i|cht','sprechen'],['arbeiten','arbeite','arbeit|est','arbeit|et','arbeiten'],['heißen','heiße','heißt','heißt','heißen'],['sein','bin','bist','|ist|','|sind|'],
];
export const verbRowSay=(row:VerbRow)=>`ich ${plainText(row[1])}, du ${plainText(row[2])}, er ${plainText(row[3])}, sie ${plainText(row[4])}.`;
export const verbExamples:readonly [de:string,tr:string][]=[
 ['Nikos spricht Griechisch und ein bisschen Deutsch.','Nikos Yunanca ve biraz Almanca konuşuyor.'],
 ['Aisha arbeitet als Taxifahrerin.','Aisha taksi şoförü olarak çalışıyor.'],
 ['Yasemin und Mei sind neu in Berlin. Sie lernen Deutsch.','Yasemin ve Mei Berlin’de yeni. Almanca öğreniyorlar.'],
];
/** Konu 3 · introducing someone: ich (Lektion 1) → er / sie (now); the row reads the new sentence. */
export const introRows:readonly [ich:string,er:string,say:string][]=[
 ['Ich heiße Nikos.','Das ist Nikos. / Er heißt Nikos.','Das ist Nikos.'],
 ['Ich komme aus Griechenland.','Er komm|t| aus Griechenland.','Er kommt aus Griechenland.'],
 ['Ich wohne in Berlin.','Er wohn|t| in Berlin.','Er wohnt in Berlin.'],
 ['Ich bin Mechatroniker.','Er |ist| Mechatroniker.','Er ist Mechatroniker.'],
 ['Ich spreche Griechisch.','Er spr|icht| Griechisch.','Er spricht Griechisch.'],
 ['Ich repariere Autos.','Er reparier|t| Autos.','Er repariert Autos.'],
];
export const cityPhrase:readonly [de:string,tr:string]=['Sie kommt aus Nairobi. Das ist in Kenia.','Nairobi’den geliyor. Orası Kenya’da.'];
export const timePhrases:readonly [de:string,tr:string][]=[['Er wohnt |schon lange| in Deutschland.','Uzun zamandır Almanya’da oturuyor.'],['Sie wohnt |jetzt| in Berlin.','Şimdi Berlin’de oturuyor.']];
/** A text about someone (read by Paul Hoca): the people in it, the name, German and Turkish. */
export type PersonText={people:string[];name:string;de:string;tr:string};
export const tomaszText:PersonText={people:['tomasz'],name:'Tomasz Nowak',de:'Das ist Tomasz Nowak. Er kommt aus Krakau. Das ist in Polen. Er wohnt schon lange in Deutschland, in Hamburg. Er ist Kellner von Beruf. Er spricht Polnisch, Deutsch und ein bisschen Englisch. Er macht Sport: Er ist Basketballer.',tr:'Bu Tomasz Nowak. Krakow’dan geliyor. Orası Polonya’da. Uzun zamandır Almanya’da, Hamburg’da oturuyor. Garson. Lehçe, Almanca ve biraz İngilizce konuşuyor. Spor yapıyor: basketbolcu.'};
export const twoText:PersonText={people:['yasemin','mei'],name:'Yasemin und Mei',de:'Das sind Yasemin und Mei. Yasemin kommt aus der Türkei, Mei kommt aus Thailand. Sie wohnen jetzt in Berlin. Sie sind neu im Kurs und sie lernen Deutsch. Sie sprechen Englisch und ein bisschen Deutsch.',tr:'Bunlar Yasemin ve Mei. Yasemin Türkiye’den, Mei Tayland’dan geliyor. Şimdi Berlin’de oturuyorlar. Kursta yeniler ve Almanca öğreniyorlar. İngilizce ve biraz Almanca konuşuyorlar.'};
/** Konu 4 · questions about someone: the question, its meaning and an answer (the row reads both). */
export const questionRows:readonly [q:string,tr:string,answer:string][]=[
 ['|Wer| ist das?','Bu kim?','Das ist Aisha.'],
 ['|Woher| kommt sie?','Nereden geliyor?','Sie kommt aus Kenia.'],
 ['|Wo| wohnt sie?','Nerede oturuyor?','Sie wohnt in Berlin.'],
 ['|Was| ist sie von Beruf?','Mesleği ne?','Sie ist Lehrerin.'],
 ['|Was| macht sie?','Ne yapıyor?','Sie arbeitet als Taxifahrerin.'],
 ['|Welche Sprachen| spricht sie?','Hangi dilleri konuşuyor?','Sie spricht Swahili, Englisch und Deutsch.'],
];
export const questionRowSay=(row:readonly [string,string,string])=>plainText(row[0])+' '+row[2];
export const pluralQuestions:readonly [de:string,tr:string][]=[['Woher kommen Yasemin und Mei? – Yasemin kommt aus der Türkei, Mei aus Thailand.','Yasemin ve Mei nereden geliyor? – Yasemin Türkiye’den, Mei Tayland’dan.'],['Was machen sie? – Sie lernen Deutsch.','Onlar ne yapıyor? – Almanca öğreniyorlar.']];
/** The verb in position 2: [1, verb, 3, the rest]. */
export const orderRowsB:readonly [first:string,verb:string,third:string,rest:string][]=[['Woher','kommt','er?',''],['Wo','wohnt','sie','jetzt?'],['Was','macht','Rami','beruflich?'],['Welche Sprachen','sprechen','sie?','']];
export const orderRowSayB=(row:readonly [string,string,string,string])=>row.filter(Boolean).join(' ');
/** Konu 5 · capital letters: the example, wrong and right. */
export const capsWrong='das ist sabine krüger. sie kommt aus hamburg. sie arbeitet als verkäuferin. sie trinkt tee.';
export const capsRight='|D|as ist |S|abine |K|rüger. |S|ie kommt aus |H|amburg. |S|ie arbeitet als |V|erkäuferin. |S|ie trinkt |T|ee.';

/* ---------- exercises ---------- */
/** Exercise 1 · Lesen: three texts (read by Paul Hoca), then who is it? (the first option is right). */
export const readTexts:PersonText[]=[
 {people:['nikos'],name:'Nikos',de:'Das ist Nikos Papadakis. Er kommt aus Thessaloniki. Das ist in Griechenland. Er wohnt jetzt in Berlin. Er ist Mechatroniker von Beruf und er repariert Autos. Er spricht Griechisch, Englisch und ein bisschen Deutsch.',tr:'Bu Nikos Papadakis. Selanik’ten geliyor. Orası Yunanistan’da. Şimdi Berlin’de oturuyor. Mekatronik teknisyeni ve araba tamir ediyor. Yunanca, İngilizce ve biraz Almanca konuşuyor.'},
 {people:['aisha'],name:'Aisha',de:'Das ist Aisha Kamau. Sie kommt aus Nairobi. Das ist in Kenia. Sie wohnt schon lange in Deutschland. Sie ist Lehrerin von Beruf, aber sie arbeitet als Taxifahrerin. Sie spricht Swahili, Englisch und Deutsch. Sie singt Lieder.',tr:'Bu Aisha Kamau. Nairobi’den geliyor. Orası Kenya’da. Uzun zamandır Almanya’da oturuyor. Öğretmen ama taksi şoförü olarak çalışıyor. Swahili, İngilizce ve Almanca konuşuyor. Şarkı söylüyor.'},
 {people:['yasemin','mei'],name:'Yasemin und Mei',de:'Das sind Yasemin Arslan und Mei Suwan. Yasemin kommt aus der Türkei, Mei kommt aus Thailand. Sie wohnen jetzt in Berlin. Sie sind neu im Kurs und sie lernen Deutsch. Yasemin ist Tierärztin, Mei ist Ingenieurin. Sie trinken Tee.',tr:'Bunlar Yasemin Arslan ve Mei Suwan. Yasemin Türkiye’den, Mei Tayland’dan geliyor. Şimdi Berlin’de oturuyorlar. Kursta yeniler ve Almanca öğreniyorlar. Yasemin veteriner, Mei mühendis. Çay içiyorlar.'},
];
export const whoOptions=['Nikos','Aisha','Yasemin und Mei'];
export const whoRows:readonly [prompt:string,answer:string,say:string][]=[
 ['… repariert Autos.','Nikos','Nikos repariert Autos.'],['… arbeitet als Taxifahrerin.','Aisha','Aisha arbeitet als Taxifahrerin.'],
 ['… lernen Deutsch.','Yasemin und Mei','Yasemin und Mei lernen Deutsch.'],['… wohnt schon lange in Deutschland.','Aisha','Aisha wohnt schon lange in Deutschland.'],
 ['… kommt aus Thessaloniki.','Nikos','Nikos kommt aus Thessaloniki.'],['… sind neu im Kurs.','Yasemin und Mei','Yasemin und Mei sind neu im Kurs.'],
 ['… singt Lieder.','Aisha','Aisha singt Lieder.'],['… spricht Griechisch.','Nikos','Nikos spricht Griechisch.'],
];
/** Exercise 2 · the verb table: er / sie and sie (Pl.); each right form is read with its person. */
export const verbGaps:readonly [verb:string,singular:string,plural:string,person:'er'|'sie'][]=[
 ['wohnen','wohnt','wohnen','sie'],['kommen','kommt','kommen','er'],['heißen','heißt','heißen','er'],
 ['arbeiten','arbeitet','arbeiten','sie'],['sprechen','spricht','sprechen','er'],['sein','ist','sind','sie'],
];
/** The gaps one by one: [verb row, 0 = er / sie, 1 = sie (Pl.)], the answer and what is read. */
export const verbGapCells=verbGaps.flatMap(([verb,singular,plural,person],row)=>[{row,col:0,verb,answer:singular,say:person+' '+singular},{row,col:1,verb,answer:plural,say:'sie '+plural}]);
/** Exercise 3 · Wer macht was? A picture, the person's job and what they do (one box for every row). */
export const doBox=['macht Sport','singt Lieder','macht Filme','schreibt Bücher'];
export const doRows:readonly [picture:string,subject:string,answer:string][]=[['b-basketballer','Der Basketballer','macht Sport'],['b-saengerin','Die Sängerin','singt Lieder'],['b-regisseur','Der Regisseur','macht Filme'],['b-autorin','Die Autorin','schreibt Bücher']];
export const doSay=(row:readonly [string,string,string])=>row[1]+' '+row[2]+'.';
/** Exercise 4 · Hören: Rami talks about himself (ich); the learner writes about him (er). */
export const ramiTalk:string[]=['Hallo, ich heiße Rami Khalil.','Ich komme aus dem Libanon, aus Beirut.','Ich spreche Arabisch, Französisch und ein bisschen Deutsch.','Ich bin Altenpfleger von Beruf.','Aber ich arbeite nicht. Ich bin Hausmann.','Ich tanze und ich trinke Tee.'];
export const ramiAbout='Das ist Rami Khalil. Er kommt aus dem Libanon, aus Beirut. Er spricht Arabisch, Französisch und ein bisschen Deutsch. Er ist Altenpfleger von Beruf. Aber er arbeitet nicht. Er ist Hausmann. Er tanzt und er trinkt Tee.';
const langs=['Arabisch','Französisch','Türkisch','Griechisch'],doVerbs=['tanzt','trinkt','singt','schreibt'];
const said=(line:ChoiceLine)=>line.parts.map(part=>typeof part==='string'?part:part.answer).join('');
const withSay=(line:ChoiceLine):ChoiceLine=>({...line,say:said(line)});
export const hearLines:ChoiceLine[]=[
 {key:'h1',parts:['Rami kommt aus dem ',{options:['Libanon','Sudan','Iran'],answer:'Libanon'},'.']},
 {key:'h2',parts:['Er spricht ',{options:langs,answer:'Arabisch'},', ',{options:langs,answer:'Französisch'},' und ein bisschen Deutsch.']},
 {key:'h3',parts:['Er ist ',{options:['Altenpfleger','Arzt','Kellner'],answer:'Altenpfleger'},' von Beruf.']},
 {key:'h4',parts:['Er arbeitet nicht. Er ist ',{options:['Hausmann','Koch','Lehrer'],answer:'Hausmann'},'.']},
 {key:'h5',parts:['Er ',{options:doVerbs,answer:'tanzt'},' und er ',{options:doVerbs,answer:'trinkt'},' Tee.']},
].map(withSay);
/** Exercise 5 · build the question (the goal in Turkish above the words; read by Paul Hoca). */
export const questionSentences:string[][]=[['Woher','kommt','Tomasz?'],['Wo','wohnt','sie?'],['Wer','ist','das?'],['Was','ist','er','von','Beruf?'],['Welche','Sprachen','spricht','sie?'],['Was','machen','sie?']];
export const questionMeanings:string[]=['Nereden geliyor? (Tomasz)','Nerede oturuyor? (o, kadın)','Bu kim?','Mesleği ne? (o, erkek)','Hangi dilleri konuşuyor? (o, kadın)','Onlar ne yapıyor?'];
export const questionSay=(sentence:string):SayItem=>({text:sentence,who:NARRATOR});
/** Exercise 6 · capital letters: tap the words that are written with a capital (their places in the text). */
export const capsText='das ist sabine krüger. sie kommt aus hamburg. das ist in deutschland. sie wohnt jetzt in berlin. sie arbeitet als verkäuferin. sie spricht deutsch und englisch. sie trinkt tee.';
export const capsNeed=[0,2,3,4,7,8,11,12,16,17,20,21,23,25,26,28];
export const capsWords=capsText.split(' ');
export const capitalized=(word:string)=>word.charAt(0).toUpperCase()+word.slice(1);
export const capsSolved=capsWords.map((word,i)=>capsNeed.includes(i)?capitalized(word):word).join(' ');
/** Exercise 7 · Schreiben: introduce Omar from his card (normalizeLoose text; `say` is the sentence read once it fits). */
export const omarCard:readonly [label:string,value:string][]=[['Name','Omar Nasser'],['Land','der Sudan (Khartum)'],['Beruf','Friseur'],['in Deutschland','Verkäufer'],['Sprachen','Arabisch, Englisch, Deutsch']];
export const omarPrompts:{prompt:string;pattern:RegExp;placeholder:string;say:string}[]=[
 {prompt:'1. Bu Omar Nasser.',pattern:/^das ist omar( nasser)?$/,placeholder:'Das ist …',say:'Das ist Omar Nasser.'},
 {prompt:'2. Sudan’dan geliyor. (ipucu: aus dem Sudan)',pattern:/^(er|omar) kommt aus dem sudan( aus khartum)?$/,placeholder:'Er kommt aus …',say:'Er kommt aus dem Sudan.'},
 {prompt:'3. Kuaför, ama satış görevlisi olarak çalışıyor.',pattern:/^(er|omar) ist friseur( von beruf)? aber er arbeitet (jetzt )?als verkaeufer$/,placeholder:'Er ist … von Beruf, aber er arbeitet als …',say:'Er ist Friseur von Beruf, aber er arbeitet als Verkäufer.'},
 {prompt:'4. Arapça, İngilizce ve Almanca konuşuyor.',pattern:/^(er|omar) spricht arabisch (und )?englisch und deutsch$/,placeholder:'Er spricht …, … und …',say:'Er spricht Arabisch, Englisch und Deutsch.'},
];
export const L2B_OWN_KEY='lernkoko-l2b-own';
/** Omar introduced in full (the speaking practice, once all four sentences fit). */
export const omarAll=omarPrompts.map(prompt=>prompt.say).join(' ');
/** The test: question, options, the right answer and what is read after the answer ('' for a Turkish answer). */
export type BerufeBTestQuestion=readonly [question:string,options:string[],answer:string,say:string];
const q=(question:string,options:string[],say:string):BerufeBTestQuestion=>[question,options,options[0],say];
export const berufeTestB:BerufeBTestQuestion[]=[
 q('Das ist Nikos. ___ kommt aus Griechenland.',['Er','Sie','Es'],'Das ist Nikos. Er kommt aus Griechenland.'),
 q('Das ist Aisha. ___ wohnt in Berlin.',['Sie','Er','Ihr'],'Das ist Aisha. Sie wohnt in Berlin.'),
 q('Yasemin und Mei ___ Deutsch.',['lernen','lernt','lerne'],'Yasemin und Mei lernen Deutsch.'),
 q('Rami ___ Arabisch und Französisch.',['spricht','sprecht','sprichst'],'Rami spricht Arabisch und Französisch.'),
 q('___ kommt Tomasz? – Aus Polen.',['Woher','Wo','Wer'],'Woher kommt Tomasz? Aus Polen.'),
 q('___ wohnt sie? – In Hamburg.',['Wo','Woher','Was'],'Wo wohnt sie? In Hamburg.'),
 q('___ ist das? – Das ist Paul.',['Wer','Was','Wo'],'Wer ist das? Das ist Paul.'),
 q('Omar ___ Friseur von Beruf.',['ist','sind','bist'],'Omar ist Friseur von Beruf.'),
 q('Sabine und Tomasz ___ in Hamburg.',['wohnen','wohnt','wohne'],'Sabine und Tomasz wohnen in Hamburg.'),
 q('„Thessaloniki – das ist in Griechenland.“ ne demek?',['Selanik Yunanistan’da.','Selanik Yunanistan’dan geliyor.','Selanik’te Yunanlar var.'],''),
 q('Doğru yazılmış olan:',['Sie spricht Deutsch und Englisch.','sie spricht deutsch und englisch.','Sie Spricht Deutsch Und Englisch.'],'Sie spricht Deutsch und Englisch.'),
 q('„schon lange“ ne demek?',['uzun zamandır','şimdi','yakında'],''),
];
/** The summary: speaking practice. A person asks, the learner answers (Omar from Exercise 7 once it is done). */
export type PracticeItemB={who:string;question:string;answer:string;omar?:boolean};
export const practiceItemsB:PracticeItemB[]=[
 {who:'paul',question:'Wer ist das?',answer:'Das ist Nikos. Er kommt aus Griechenland, aus Thessaloniki.'},
 {who:'paul',question:'Was macht Nikos?',answer:'Er ist Mechatroniker. Er repariert Autos.'},
 {who:'nora',question:'Woher kommt Aisha?',answer:'Sie kommt aus Kenia. Sie wohnt schon lange in Deutschland.'},
 {who:'paul',question:'Was machen Yasemin und Mei?',answer:'Sie lernen Deutsch. Sie wohnen in Berlin.'},
 {who:'sabine',question:'Und wer ist das?',answer:'Das ist Omar Nasser. Er kommt aus dem Sudan. Er ist Friseur, aber er arbeitet als Verkäufer.',omar:true},
];

/* ---------- steps ---------- */
export const berufeStepsB:Step[]=[
 {id:'kapak',title:'Kapak',kind:'cover'},
 {id:'ne-yapiyor',title:'Kelimeler: kim ne yapıyor',kind:'teach'},
 {id:'kelimeler',title:'Kelimeler: liste',kind:'teach'},
 {id:'kontrol',title:'Kelime kontrolü',kind:'teach'},
 {id:'er-sie',title:'er · sie · sie',kind:'teach'},
 {id:'fiiller',title:'Fiiller',kind:'teach'},
 {id:'tanitma',title:'Birini tanıtma',kind:'teach'},
 {id:'sorular',title:'Soru kelimeleri',kind:'teach'},
 {id:'buyuk-harf',title:'Büyük harf',kind:'teach'},
 {id:'wer',title:'Alıştırma 1',kind:'exercise'},
 {id:'fiil-tablo',title:'Alıştırma 2',kind:'exercise'},
 {id:'wer-macht',title:'Alıştırma 3',kind:'exercise'},
 {id:'hoeren',title:'Alıştırma 4',kind:'exercise'},
 {id:'soru-kur',title:'Alıştırma 5',kind:'exercise'},
 {id:'harf-yaz',title:'Alıştırma 6',kind:'exercise'},
 {id:'omar',title:'Alıştırma 7',kind:'exercise'},
 {id:'test',title:'Test',kind:'test'},
 {id:'ozet',title:'Özet',kind:'end'},
];
export const berufeStepIndexB=(id:string)=>berufeStepsB.findIndex(step=>step.id===id);
export const berufeStepShortB:Record<string,string>={'wer':'Wer ist das?','fiil-tablo':'Fiil tablosu','wer-macht':'Kim ne yapıyor?','hoeren':'Dinle','soru-kur':'Soruyu kur','harf-yaz':'Büyük harf','omar':'Omar’ı tanıt'};
const gapCount=(lines:readonly ChoiceLine[])=>lines.reduce((n,line)=>n+line.parts.filter(part=>typeof part!=='string').length,0);
export const berufeScoredB:{id:string;total:number}[]=[
 {id:'wer',total:whoRows.length},
 {id:'fiil-tablo',total:verbGapCells.length},
 {id:'wer-macht',total:doRows.length},
 {id:'hoeren',total:gapCount(hearLines)},
 {id:'soru-kur',total:questionSentences.length},
 {id:'harf-yaz',total:capsNeed.length},
 {id:'omar',total:omarPrompts.length},
 {id:'test',total:berufeTestB.length},
];
export const berufeGroupsB:StepGroup[]=[
 {id:'konu',label:'Konu anlatımı',ids:berufeStepsB.filter(step=>step.kind==='teach').map(step=>step.id)},
 {id:'alistirmalar',label:'Alıştırmalar',ids:berufeStepsB.filter(step=>step.kind==='exercise').map(step=>step.id)},
 {id:'test',label:'Test',ids:['test']},
];
export const berufeWordCountB=wordsB.length;

/** Every German text Teil B speaks (rendered as site voices by scripts/voices). */
export function berufeBSpeechTexts():string[]{
 const out=new Set<string>();const add=(text:string)=>{const clean=plainText(text).trim();if(clean)out.add(clean);};
 const say=(item:SayItem|undefined)=>{if(item)add(typeof item==='string'?item:item.text);};
 for(const doing of doings){if(doing.job)add(doing.job);add(doing.sentence);}
 wordsB.forEach(([,,example])=>add(example));phrasesB.forEach(([de])=>add(de));
 for(const item of [...wordChecksB,...pronounChecks,...verbChecksB,...introChecks,...questionChecks])add(item.say);
 pronounRows.forEach(([,,,example])=>add(example));sieTwo.forEach(([de])=>add(de));dasIst.forEach(([de])=>add(de));
 [...regularVerbs,...specialVerbs].forEach(row=>add(verbRowSay(row)));verbExamples.forEach(([de])=>add(de));
 introRows.forEach(([,,text])=>add(text));add(cityPhrase[0]);timePhrases.forEach(([de])=>add(de));
 for(const text of [tomaszText,twoText,...readTexts])add(text.de);
 questionRows.forEach(row=>add(questionRowSay(row)));pluralQuestions.forEach(([de])=>add(de));orderRowsB.forEach(row=>add(orderRowSayB(row)));
 add(capsRight);
 whoRows.forEach(([,,text])=>add(text));verbGapCells.forEach(cell=>add(cell.say));doRows.forEach(row=>add(doSay(row)));
 ramiTalk.forEach(add);add(ramiAbout);hearLines.forEach(line=>say(line.say));
 questionSentences.forEach(sentence=>add(sentence.join(' ')));add(capsSolved);
 omarPrompts.forEach(prompt=>add(prompt.say));
 berufeTestB.forEach(question=>add(question[3]));
 practiceItemsB.forEach(item=>{add(item.question);add(item.answer);});add(omarAll);
 return [...out];
}
