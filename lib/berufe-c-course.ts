/**
 * Lektion 2 „Berufe“, Teil C – Wir brauchen Hilfe. (the learner's lesson page, an artifact of 2 November 2026), ported
 * like Teil A and B: the cover, nine short teaching steps (the numbers 0–20 with counting on the fingers, the words, a
 * quick check, how the numbers are built and the phone number, adding, asking for help, the form with mein / dein,
 * wir and ihr, word stress and the phrases), eight exercises, a 12-question test, Konuş (no AI) and Bitti. Texts for
 * the learner are Turkish; the German is read with the site voices, each person with their own voice. Numbers above 20
 * (a house number, a postcode) are only heard, never taught; a postcode or a phone number is read digit by digit.
 * Step ids never change: saved scores are keyed by them.
 */
import type {GapLine,SayItem,Step,StepGroup} from './willkommen-course';
import type {Line} from './willkommen-b-course';
import type {ChoiceGap,ChoiceLine} from './stadt-course';
import type {QuickCheck,PracticeItem} from './berufe-course';

/** Pictures of Teil C (public/toon/lektion2, from the learner's page). */
export const berufeCPictures={
 cover:{src:'/toon/lektion2/kapak-c.webp',width:960,height:540},
 hands05:{src:'/toon/lektion2/haende-0-5.webp',width:900,height:266},
 hands610:{src:'/toon/lektion2/haende-6-10.webp',width:800,height:300},
} as const;
/** The people of Teil C (portraits and voices of the site). */
export const castL2C=['yasemin','nikos','omar','mei','aisha','tomasz','rami','paul'] as const;

/* ---------- numbers ---------- */
/** 0–20, the numbers this part teaches (index = the number). */
export const numberWords=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn','zwanzig'] as const;
/** Digits read one by one, the groups with a pause: "0176 3345 621" → "null eins sieben sechs, drei drei vier fünf, sechs zwei eins". */
export const digitWords=(digits:string)=>digits.trim().split(/\s+/).map(group=>[...group].map(digit=>numberWords[Number(digit)]??digit).join(' ')).join(', ');
/** Every number one after the other ("▶ 0’dan 20’ye dinle"). */
export const countAll=numberWords.join(', ');
/** 13–19: the ones, then -zehn; 16 and 17 lose a part (shown struck through). [number, built, word, warning] */
export const teenRows:readonly [number:number,built:string,word:string,warn?:boolean][]=[
 [13,'drei + zehn','dreizehn'],[14,'vier + zehn','vierzehn'],[15,'fünf + zehn','fünfzehn'],[16,'sech~s~ + zehn','sechzehn',true],
 [17,'sieb~en~ + zehn','siebzehn',true],[18,'acht + zehn','achtzehn'],[19,'neun + zehn','neunzehn'],[20,'—','zwanzig'],
];
/** A phone number of the lesson (invented, like every number and address of Lektion 2). */
export type PhoneRow={who:string;name:string;number:string};
export const phones:PhoneRow[]=[{who:'omar',name:'Omar',number:'0176 3345 621'},{who:'nikos',name:'Nikos',number:'030 8831 749'},{who:'aisha',name:'Aisha',number:'0152 7612 390'}];
export const phoneSay=(number:string)=>'Meine Telefonnummer ist '+digitWords(number)+'.';
/** Konu 1 · asking for a phone number and saying one (the shown text, the meaning, what is read). Only du here: the
 * formal Ihr / Ihre belongs to the workplace dialogue of Teil D. */
export const phonePhrases:readonly [de:string,tr:string,say:string][]=[
 ['Wie ist deine Telefonnummer?','Telefon numaran ne? (sen)','Wie ist deine Telefonnummer?'],
 ['Meine Telefonnummer ist 0176 3345 621.','Telefon numaram 0176 3345 621. — okunuşu: null eins sieben sechs · drei drei vier fünf · sechs zwei eins',phoneSay('0176 3345 621')],
 ['Die Telefonnummer ist 030 8831 749.','Telefon numarası 030 8831 749. (030 = Berlin şehir kodu)','Die Telefonnummer ist '+digitWords('030 8831 749')+'.'],
];

/* ---------- words ---------- */
/** The words: the word, its meaning, an example, the example's meaning and (when the example has digits) what is read. */
export type WordRow=readonly [de:string,tr:string,example:string,exampleTr:string,say?:string];
export const wordsC:WordRow[]=[
 ['Entschuldigung!','Affedersiniz! / Pardon!','Entschuldigung, ich brauche Hilfe.','Pardon, yardıma ihtiyacım var.'],
 ['die Hilfe · Hilfe brauchen','yardım · yardıma ihtiyacı olmak','Wir brauchen Hilfe.','Yardıma ihtiyacımız var.'],
 ['helfen','yardım etmek','Ich helfe gern.','Memnuniyetle yardım ederim.'],
 ['gern / gerne','memnuniyetle, seve seve','Bitte, ich helfe gerne.','Rica ederim, seve seve yardım ederim.'],
 ['verstehen','anlamak','Ich verstehe das nicht.','Bunu anlamıyorum.'],
 ['bedeuten','anlamına gelmek','Adresse bedeutet: Wo wohnst du?','Adresse şu demek: Nerede oturuyorsun?'],
 ['das Problem','sorun, problem','Was ist das Problem?','Sorun ne?'],
 ['das Formular','form','Das Formular ist schwer.','Form zor.'],
 ['der Vorname','ad, ön ad','Mein Vorname ist Omar.','Adım Omar.'],
 ['der Nachname','soyadı','Mein Nachname ist Nasser.','Soyadım Nasser.'],
 ['die Adresse','adres','Wie ist deine Adresse?','Adresin ne?'],
 ['die Straße','cadde, sokak','Ich wohne in der Siemensstraße.','Siemensstraße’de oturuyorum.'],
 ['die Hausnummer','kapı numarası','Meine Hausnummer ist 12.','Kapı numaram 12.','Meine Hausnummer ist zwölf.'],
 ['der Ort','yer, şehir (yerleşim yeri)','Ort: Berlin','Yer: Berlin','Ort: Berlin.'],
 ['die Postleitzahl (PLZ)','posta kodu','Meine Postleitzahl ist 13629.','Posta kodum 13629.','Meine Postleitzahl ist '+digitWords('13629')+'.'],
 ['die Telefonnummer','telefon numarası','Wie ist deine Telefonnummer?','Telefon numaran ne?'],
 ['die E-Mail-Adresse','e-posta adresi','Wie ist deine E-Mail-Adresse?','E-posta adresin ne?'],
 ['die E-Mail','e-posta','Ich schreibe eine E-Mail.','Bir e-posta yazıyorum.'],
 ['die Arbeit','iş','Die Arbeit ist schwer.','İş zor.'],
 ['wir','biz','Wir wohnen in Berlin.','Berlin’de oturuyoruz.'],
 ['ihr','siz (çoğul, samimi)','Woher kommt ihr?','Nereden geliyorsunuz? (siz, çoğul)'],
 ['mein / meine','benim','mein Name · meine Adresse','adım · adresim','mein Name, meine Adresse.'],
 ['dein / deine','senin','dein Beruf · deine Telefonnummer','mesleğin · telefon numaran','dein Beruf, deine Telefonnummer.'],
 ['plus','artı','Sechs plus fünf ist elf.','Altı artı beş on bir eder.'],
 ['Wie viel ist das?','Bu kaç eder?','Wie viel ist drei plus vier?','Üç artı dört kaç eder?'],
 ['die Zahl','sayı','Die Zahlen von null bis zwanzig.','Sıfırdan yirmiye sayılar.'],
];
export const wordSayC=(row:WordRow)=>row[4]??row[2];
/** The phrases of the unit (Konu 6, to learn by heart): German, meaning, what is read. */
export const phrasesC:readonly [de:string,tr:string,say:string][]=[
 ['Wie ist deine Telefonnummer?','Telefon numaran ne?','Wie ist deine Telefonnummer?'],
 ['Die Telefonnummer ist 0176 3345 621.','Telefon numarası 0176 3345 621.','Die Telefonnummer ist '+digitWords('0176 3345 621')+'.'],
 ['Wie viel ist das? – Sechs plus fünf ist elf.','Bu kaç eder? – Altı artı beş on bir.','Wie viel ist das? – Sechs plus fünf ist elf.'],
 ['Entschuldigung, ich brauche Hilfe.','Pardon, yardıma ihtiyacım var.','Entschuldigung, ich brauche Hilfe.'],
 ['Ja? Was ist das Problem?','Evet? Sorun ne?','Ja? Was ist das Problem?'],
 ['Adresse – ich verstehe das nicht.','Adresse – bunu anlamıyorum.','Adresse – ich verstehe das nicht.'],
 ['Adresse bedeutet: Wo wohnst du?','Adresse şu demek: Nerede oturuyorsun?','Adresse bedeutet: Wo wohnst du?'],
 ['Ah, danke. – Bitte, ich helfe gern.','Ah, teşekkürler. – Rica ederim, seve seve.','Ah, danke. – Bitte, ich helfe gern.'],
 ['Wie ist dein Nachname? – Mein Nachname ist Nasser.','Soyadın ne? – Soyadım Nasser.','Wie ist dein Nachname? – Mein Nachname ist Nasser.'],
 ['Wo wohnt ihr? – Wir wohnen in der Siemensstraße 12.','Nerede oturuyorsunuz? – Siemensstraße 12’de oturuyoruz.','Wo wohnt ihr? – Wir wohnen in der Siemensstraße zwölf.'],
];

/* ---------- quick checks inside the teaching steps (not scored) ---------- */
const check=(q:string,options:string[],say=options[0]):QuickCheck=>({q,options,say});
export const wordChecksC:QuickCheck[]=[
 check('12',['zwölf','zwanzig','zehn']),
 check('siebzehn',['17','7','70'],'siebzehn'),
 check('„Ich verstehe das nicht.“',['Bunu anlamıyorum.','Buna ihtiyacım yok.','Bunu bilmiyorum.'],''),
 check('soyadı',['der Nachname','der Vorname','der Ort']),
 check('posta kodu',['die Postleitzahl','die Hausnummer','die Telefonnummer']),
 check('„Ich helfe gern.“',['Seve seve yardım ederim.','Yardıma ihtiyacım var.','Anlamıyorum.'],''),
 check('siz (çoğul, arkadaşlara)',['ihr','wir','Sie']),
 check('Sechs plus fünf ist …',['elf','zwölf','neun'],'Sechs plus fünf ist elf.'),
];
export const numberChecks:QuickCheck[]=[
 check('16',['sechzehn','sechszehn','sechzig']),
 check('siebzehn',['17','7','27'],'siebzehn'),
 check('„Wie ist deine Telefonnummer?“',['Telefon numaran ne?','Telefonun nerede?','Telefon numaram bu.'],''),
];
export const plusChecks:QuickCheck[]=[
 check('Vier plus vier ist …',['acht','sechs','neun'],'Vier plus vier ist acht.'),
 check('Zehn plus neun ist …',['neunzehn','neun','zwanzig'],'Zehn plus neun ist neunzehn.'),
];
export const helpChecks:QuickCheck[]=[
 check('Formu anlamadın. Ne dersin?',['Entschuldigung, ich brauche Hilfe.','Ich helfe gern.','Was ist das Problem?']),
 check('„Vorname bedeutet: ___“',['Wie heißt du?','Wo wohnst du?','Was bist du von Beruf?'],'Vorname bedeutet: Wie heißt du?'),
];
export const formChecksC:QuickCheck[]=[
 check('Wie ist ___ Telefonnummer? (sen)',['deine','dein','meine'],'Wie ist deine Telefonnummer?'),
 check('___ Vorname ist Mei.',['Mein','Meine','Dein'],'Mein Vorname ist Mei.'),
 check('„13629 Berlin“ – 13629 nedir?',['die Postleitzahl','die Hausnummer','die Telefonnummer']),
];
export const wirChecks:QuickCheck[]=[
 check('Woher ___ ihr?',['kommt','kommen','kommst'],'Woher kommt ihr?'),
 check('Wir ___ neu im Kurs.',['sind','seid','ist'],'Wir sind neu im Kurs.'),
 check('Wo ___ ihr? – Wir ___ in Berlin.',['wohnt / wohnen','wohnen / wohnt','wohnst / wohne'],'Wo wohnt ihr? – Wir wohnen in Berlin.'),
];

/* ---------- teaching steps ---------- */
/** Konu 2 · adding: German, meaning. */
export const plusPhrases:readonly [de:string,tr:string][]=[
 ['Wie viel ist drei plus vier?','Üç artı dört kaç eder?'],['Drei plus vier ist sieben.','Üç artı dört yedi eder.'],
 ['Sechs plus fünf plus eins ist zwölf.','Altı artı beş artı bir on iki eder.'],['Zwölf!','On iki! (yarışmada cevap böyle bağırılır)'],
];
/** Konu 3 · asking for help. */
export const helpPhrases:readonly [de:string,tr:string,say:string][]=[
 ['Entschuldigung, ich brauche Hilfe.','Pardon, yardıma ihtiyacım var.','Entschuldigung, ich brauche Hilfe.'],
 ['Ich verstehe das nicht.','Bunu anlamıyorum.','Ich verstehe das nicht.'],
 ['Was bedeutet „Adresse“?','„Adresse“ ne demek?','Was bedeutet Adresse?'],
 ['Ich helfe gern.','Seve seve yardım ederim.','Ich helfe gern.'],
];
/** Yasemin does not understand the form; Nikos helps. */
export const helpDialogue:Line[]=[
 {who:'yasemin',de:'Entschuldigung, ich brauche Hilfe.',tr:'Pardon, yardıma ihtiyacım var.'},
 {who:'nikos',de:'Ja? Was ist das Problem?',tr:'Evet? Sorun ne?'},
 {who:'yasemin',de:'Adresse – ich verstehe das nicht.',tr:'Adresse – bunu anlamıyorum.'},
 {who:'nikos',de:'Adresse bedeutet: Wo wohnst du?',tr:'Adresse şu demek: Nerede oturuyorsun?'},
 {who:'yasemin',de:'Ah, danke.',tr:'Ah, teşekkürler.'},
 {who:'nikos',de:'Bitte, ich helfe gern.',tr:'Rica ederim, seve seve.'},
];
/** "… bedeutet: …": a word explained with a question. */
export const meaningRows:readonly [word:string,question:string][]=[['Nachname','Wie heißt du?'],['Land','Woher kommst du?'],['Beruf','Was bist du von Beruf?']];
export const meaningSay=(row:readonly [string,string])=>row[0]+' bedeutet: '+row[1];
/** Konu 4 · the form: field, question, Omar's answer, what is read (the question and his answer). */
export const formRows:readonly [field:string,question:string,omar:string,say:string][]=[
 ['Vorname','Wie ist dein Vorname? / Wie heißt du?','Omar','Wie ist dein Vorname? Omar.'],
 ['Nachname','Wie ist dein Nachname?','Nasser','Wie ist dein Nachname? Nasser.'],
 ['Heimatort','Woher kommst du?','Khartum, Sudan','Woher kommst du? Aus Khartum, aus dem Sudan.'],
 ['Straße, Hausnummer','Wie ist deine Adresse?','Siemensstraße 12','Wie ist deine Adresse? Siemensstraße zwölf.'],
 ['PLZ, Ort','Wie ist deine Postleitzahl? / Wo wohnst du?','13629 Berlin','Wie ist deine Postleitzahl? '+digitWords('13629')+'. Wo wohnst du? In Berlin.'],
 ['Beruf','Was bist du von Beruf?','Friseur','Was bist du von Beruf? Friseur.'],
 ['Telefonnummer','Wie ist deine Telefonnummer?','0176 3345 621','Wie ist deine Telefonnummer? '+digitWords('0176 3345 621')+'.'],
 ['E-Mail-Adresse','Wie ist deine E-Mail-Adresse?','omar@example.org','Wie ist deine E-Mail-Adresse?'],
];
/** mein / dein: the words with der / das and with die. */
export const possessiveRows:readonly [article:string,mine:string,yours:string,words:string][]=[
 ['der / das','mein','dein','Name, Vorname, Nachname, Beruf, Ort'],
 ['die','meine','deine','Adresse, Straße, Hausnummer, Postleitzahl, Telefonnummer, E-Mail-Adresse'],
];
export const possessivePhrases:readonly [de:string,tr:string,say:string][]=[
 ['Wie ist dein Nachname? – Mein Nachname ist Nasser.','der Nachname → dein / mein','Wie ist dein Nachname? – Mein Nachname ist Nasser.'],
 ['Wie ist deine Adresse? – Meine Adresse ist Siemensstraße 12.','die Adresse → deine / meine','Wie ist deine Adresse? – Meine Adresse ist Siemensstraße zwölf.'],
];
/** Konu 5 · wir and ihr: verb, wir form, ihr form (the ending after `|`). */
export const wirIhrVerbs:readonly [verb:string,wir:string,ihr:string][]=[
 ['wohnen','wohn|en','wohn|t'],['kommen','komm|en','komm|t'],['verstehen','versteh|en','versteh|t'],['arbeiten','arbeit|en','arbeit|et'],['sein','|sind','|seid'],
];
export const wirIhrSay=wirIhrVerbs.map(([,wir,ihr])=>`wir ${wir.replace('|','')}, ihr ${ihr.replace('|','')}.`).join(' ');
/** Questions with ihr, answers with wir: question, answer, what is read. */
export const wirIhrRows:readonly [question:string,answer:string,say:string][]=[
 ['Wie heißt ihr?','Wir heißen Omar und Nikos.','Wie heißt ihr? – Wir heißen Omar und Nikos.'],
 ['Woher kommt ihr?','Wir kommen aus dem Sudan und aus Griechenland.','Woher kommt ihr? – Wir kommen aus dem Sudan und aus Griechenland.'],
 ['Wo wohnt ihr?','Wir wohnen in der Siemensstraße 12.','Wo wohnt ihr? – Wir wohnen in der Siemensstraße zwölf.'],
 ['Was seid ihr von Beruf?','Wir sind Friseur und Mechatroniker.','Was seid ihr von Beruf? – Wir sind Friseur und Mechatroniker.'],
 ['Was macht ihr?','Wir lernen Deutsch.','Was macht ihr? – Wir lernen Deutsch.'],
];
/** Two flat shares: Omar and Nikos, Yasemin and Mei; Paul Hoca asks. */
export const flatDialogue:Line[]=[
 {who:'yasemin',de:'Adresse? Wir verstehen das nicht.',tr:'Adresse mi? Anlamıyoruz.'},
 {who:'paul',de:'Adresse bedeutet: Wo wohnt ihr?',tr:'Adresse şu demek: Nerede oturuyorsunuz?'},
 {who:'mei',de:'Wir wohnen in der Lindenstraße 7.',tr:'Lindenstraße 7’de oturuyoruz.',say:'Wir wohnen in der Lindenstraße sieben.'},
 {who:'paul',de:'Und ihr, Omar und Nikos? Wo wohnt ihr?',tr:'Ya siz, Omar ve Nikos? Nerede oturuyorsunuz?'},
 {who:'omar',de:'Wir wohnen in der Siemensstraße 12. Wir sind auch neu in Berlin.',tr:'Siemensstraße 12’de oturuyoruz. Biz de Berlin’de yeniyiz.',say:'Wir wohnen in der Siemensstraße zwölf. Wir sind auch neu in Berlin.'},
];
/** The whole table of Lektion 1 and 2: person, kommen, sein (the new rows marked). */
export const allPersons:readonly [person:string,kommen:string,sein:string,isNew?:boolean][]=[
 ['ich','komm|e','bin'],['du','komm|st','bist'],['er / sie','komm|t','ist'],['wir','komm|en','sind',true],['ihr','komm|t','seid',true],['sie / Sie','komm|en','sind'],
];
export const allPersonsSay='ich komme, du kommst, er kommt, wir kommen, ihr kommt, sie kommen. ich bin, du bist, er ist, wir sind, ihr seid, sie sind.';
/** Konu 6 · word stress: the syllables with the stressed one in capitals, the word that is read. */
export const stressRows:readonly [shown:string,word:string][]=[
 ['VOR·na·me','Vorname'],['NACH·na·me','Nachname'],['be·RUF','Beruf'],['HAUS·num·mer','Hausnummer'],
 ['POST·leit·zahl','Postleitzahl'],['a·DRES·se','Adresse'],['te·le·FON·num·mer','Telefonnummer'],['E·Mail·a·dres·se','E-Mail-Adresse'],
];

/* ---------- exercises ---------- */
/** Exercise 1 · Welche Zahl? The number heard (read at once, again on a tap) and three numbers to choose from. */
export const listenNumbers:readonly [number:number,options:string[]][]=[
 [3,['3','13','8']],[7,['7','17','11']],[11,['11','1','12']],[12,['12','2','20']],[15,['15','5','14']],[16,['16','6','19']],[17,['17','7','18']],[19,['19','9','20']],
];
/** Exercise 2 · number rows: the missing numbers written as words. */
export const numberRows:GapLine[]=[
 {text:'eins – ___ – drei – ___ – fünf – ___',answers:[['zwei'],['vier'],['sechs']]},
 {text:'null – ___ – vier – ___ – acht – ___',answers:[['zwei'],['sechs'],['zehn']]},
 {text:'zehn – ___ – acht – ___ – sechs – ___',answers:[['neun'],['sieben'],['fünf']]},
 {text:'zwölf – ___ – vierzehn – ___ – ___ – siebzehn',answers:[['dreizehn'],['fünfzehn'],['sechzehn']]},
 {text:'siebzehn – achtzehn – ___ – ___',answers:[['neunzehn'],['zwanzig']]},
];
/** The rows read whole once all are right. */
export const numberRowSay=numberRows.map(line=>{let g=0;return line.text.split(' – ').map(part=>part==='___'?line.answers.flat()[g++]:part).join(', ')+'.';});
/** Exercise 3 · the phone numbers: only the digits count (spaces, dashes do not). */
export const phoneDigits=(text:string)=>text.replace(/\D/g,'');
/** Exercise 4 · three dice: the numbers and the sum (written as a word or with digits). */
export const dice:readonly [a:number,b:number,c:number][]=[[4,6,1],[6,5,3],[2,4,6],[6,6,5],[6,6,6]];
export const diceFaces='⚀⚁⚂⚃⚄⚅';
export const diceSum=(row:readonly [number,number,number])=>row[0]+row[1]+row[2];
export const diceSentence=(row:readonly [number,number,number])=>`${numberWords[row[0]]} plus ${numberWords[row[1]]} plus ${numberWords[row[2]]} ist ${numberWords[diceSum(row)]}.`;
export const diceLines:GapLine[]=dice.map(row=>({text:`${diceFaces[row[0]-1]} ${diceFaces[row[1]-1]} ${diceFaces[row[2]-1]} · ${numberWords[row[0]]} plus ${numberWords[row[1]]} plus ${numberWords[row[2]]} ist ___`,answers:[[numberWords[diceSum(row)],String(diceSum(row))]]}));
/** Exercise 5 · the help dialogue: the verbs of the box (one box for every gap); each line by its person. */
export const helpBox=['brauche','ist','verstehe','bedeutet','heißt','helfe'];
const helpGap=(answer:string):ChoiceGap=>({options:helpBox,answer});
const said=(line:ChoiceLine)=>line.parts.map(part=>typeof part==='string'?part:part.answer).join('');
const withSay=(line:ChoiceLine):ChoiceLine=>({...line,say:{text:said(line),who:line.who}});
export const helpLines:ChoiceLine[]=[
 {key:'m1',who:'mei',parts:['Entschuldigung, ich ',helpGap('brauche'),' Hilfe.']},
 {key:'o1',who:'omar',parts:['Ja? Was ',helpGap('ist'),' das Problem?']},
 {key:'m2',who:'mei',parts:['Nachname – ich ',helpGap('verstehe'),' das nicht.']},
 {key:'o2',who:'omar',parts:['Nachname ',helpGap('bedeutet'),': Wie ',helpGap('heißt'),' du?']},
 {key:'m3',who:'mei',parts:['Ah, danke. Mein Nachname ist Suwan.']},
 {key:'o3',who:'omar',parts:['Bitte, ich ',helpGap('helfe'),' gern.']},
].map(withSay);
export const helpSay:SayItem[]=helpLines.map(line=>line.say as SayItem);
/** Exercise 6 · which question does the field ask? [field, the right question, the options] */
export const fieldQuestions:readonly [field:string,answer:string,options:string[]][]=[
 ['Vorname','Wie heißt du?',['Wie heißt du?','Wo wohnst du?','Woher kommst du?']],
 ['Telefonnummer','Wie ist deine Telefonnummer?',['Wie ist deine Telefonnummer?','Wie ist deine Adresse?','Wie ist deine Postleitzahl?']],
 ['Adresse','Wo wohnst du?',['Wo wohnst du?','Woher kommst du?','Was bist du von Beruf?']],
 ['Beruf','Was bist du von Beruf?',['Was bist du von Beruf?','Wie heißt du?','Wo wohnst du?']],
 ['Heimatort','Woher kommst du?',['Woher kommst du?','Wo wohnst du?','Wie ist dein Nachname?']],
 ['Postleitzahl','Wie ist deine Postleitzahl?',['Wie ist deine Postleitzahl?','Wie ist deine Hausnummer?','Wie ist deine Telefonnummer?']],
 ['E-Mail-Adresse','Wie ist deine E-Mail-Adresse?',['Wie ist deine E-Mail-Adresse?','Wie ist deine Adresse?','Wie ist dein Vorname?']],
];
export const fieldSay=(row:readonly [string,string,string[]])=>row[0]+' bedeutet: '+row[1];
/** Exercise 7 · mein / dein: Paul Hoca asks, the person answers (two words per gap; a capital at the start). */
const duBox=['dein','deine'],meinBox=['mein','meine'],capBox=['Mein','Meine'];
const pick=(options:readonly string[],answer:string):ChoiceGap=>({options,answer});
export const possessiveLines:ChoiceLine[]=[
 {key:'p1',who:'paul',parts:['Omar, ',pick(duBox,'dein'),' Nachname ist Nasser, richtig?']},
 {key:'a1',who:'omar',parts:['Ja, ',pick(meinBox,'mein'),' Nachname ist Nasser.']},
 {key:'p2',who:'paul',parts:['Mei, wie ist ',pick(duBox,'deine'),' Adresse?']},
 {key:'a2',who:'mei',parts:[pick(capBox,'Meine'),' Adresse ist Lindenstraße 7.'],say:{text:'Meine Adresse ist Lindenstraße sieben.',who:'mei'}},
 {key:'p3',who:'paul',parts:['Tomasz, wie ist ',pick(duBox,'deine'),' Hausnummer?']},
 {key:'a3',who:'tomasz',parts:[pick(capBox,'Meine'),' Hausnummer ist 21.'],say:{text:'Meine Hausnummer ist einundzwanzig.',who:'tomasz'}},
 {key:'p4',who:'paul',parts:['Aisha, wie ist ',pick(duBox,'deine'),' Postleitzahl?']},
 {key:'a4',who:'aisha',parts:[pick(capBox,'Meine'),' Postleitzahl ist 12049.'],say:{text:'Meine Postleitzahl ist '+digitWords('12049')+'.',who:'aisha'}},
 {key:'p5',who:'paul',parts:['Nikos, wie ist ',pick(duBox,'dein'),' Vorname?']},
 {key:'a5',who:'nikos',parts:[pick(capBox,'Mein'),' Vorname ist Nikos.']},
 {key:'p6',who:'paul',parts:['Rami, was ist ',pick(duBox,'dein'),' Beruf?']},
 {key:'a6',who:'rami',parts:[pick(capBox,'Mein'),' Beruf ist Altenpfleger.']},
].map(line=>line.say?line:withSay(line));
/** Exercise 8 · wir and ihr in a conversation: every line by its person; the verb in brackets after the gap. */
export type PersonGapLine={who:string;text:string;answers:string[][];say:string};
export const wirIhrLines:PersonGapLine[]=[
 {who:'yasemin',text:'Hallo, wir ___ (sein) Yasemin und Mei. Wir ___ (sein) neu im Kurs. Und ihr? Wie ___ (heißen) ihr?',answers:[['sind'],['sind'],['heißt']],say:'Hallo, wir sind Yasemin und Mei. Wir sind neu im Kurs. Und ihr? Wie heißt ihr?'},
 {who:'omar',text:'Wir ___ (heißen) Omar und Nikos. Woher ___ (kommen) ihr?',answers:[['heißen'],['kommt']],say:'Wir heißen Omar und Nikos. Woher kommt ihr?'},
 {who:'mei',text:'Ich komme aus Thailand und Yasemin ___ (kommen) aus der Türkei. Wir ___ (wohnen) in der Lindenstraße 7. Und wo ___ (wohnen) ihr?',answers:[['kommt'],['wohnen'],['wohnt']],say:'Ich komme aus Thailand und Yasemin kommt aus der Türkei. Wir wohnen in der Lindenstraße sieben. Und wo wohnt ihr?'},
 {who:'nikos',text:'Wir ___ (wohnen) in der Siemensstraße 12. Was ___ (machen) ihr beruflich?',answers:[['wohnen'],['macht']],say:'Wir wohnen in der Siemensstraße zwölf. Was macht ihr beruflich?'},
 {who:'yasemin',text:'Ich ___ (sein) Tierärztin, Mei ___ (sein) Ingenieurin. Aber wir ___ (arbeiten) jetzt nicht. Wir ___ (lernen) Deutsch.',answers:[['bin'],['ist'],['arbeiten'],['lernen']],say:'Ich bin Tierärztin, Mei ist Ingenieurin. Aber wir arbeiten jetzt nicht. Wir lernen Deutsch.'},
 {who:'omar',text:'Wir ___ (arbeiten): Ich arbeite als Verkäufer und Nikos repariert Autos. Und wir lernen auch Deutsch!',answers:[['arbeiten']],say:'Wir arbeiten: Ich arbeite als Verkäufer und Nikos repariert Autos. Und wir lernen auch Deutsch!'},
];
/** The test: question, options, the right answer and what is read after the answer. */
export type BerufeCTestQuestion=readonly [question:string,options:string[],answer:string,say:string];
const q=(question:string,options:string[],say:string):BerufeCTestQuestion=>[question,options,options[0],say];
export const berufeTestC:BerufeCTestQuestion[]=[
 q('7',['sieben','sechs','siebzehn'],'sieben'),
 q('16',['sechzehn','sechszehn','sechzig'],'sechzehn'),
 q('17',['siebzehn','siebenzehn','siebzig'],'siebzehn'),
 q('Sechs plus fünf ist ___.',['elf','zwölf','zehn'],'Sechs plus fünf ist elf.'),
 q('Entschuldigung, ich ___ Hilfe.',['brauche','bedeute','verstehe'],'Entschuldigung, ich brauche Hilfe.'),
 q('Nachname – ich ___ das nicht.',['verstehe','helfe','brauche'],'Nachname – ich verstehe das nicht.'),
 q('„Adresse bedeutet: ___“',['Wo wohnst du?','Woher kommst du?','Wie heißt du?'],'Adresse bedeutet: Wo wohnst du?'),
 q('Wie ist ___ Telefonnummer? (du)',['deine','dein','meine'],'Wie ist deine Telefonnummer?'),
 q('Das ist ___ Vorname.',['mein','meine','deine'],'Das ist mein Vorname.'),
 q('Wo ___ ihr? – Wir ___ in Berlin.',['wohnt / wohnen','wohnen / wohnt','wohnst / wohne'],'Wo wohnt ihr? – Wir wohnen in Berlin.'),
 q('Woher ___ ihr?',['kommt','kommen','kommst'],'Woher kommt ihr?'),
 q('Wir ___ neu im Kurs.',['sind','seid','ist'],'Wir sind neu im Kurs.'),
];
/** Konuş: a person asks, the learner answers aloud (the shown answer, digits read as words). */
export const practiceItemsC:PracticeItem[]=[
 {who:'paul',question:'Wie ist deine Telefonnummer?',answer:'Meine Telefonnummer ist 0176 3345 621.',answerSay:phoneSay('0176 3345 621')},
 {who:'nikos',question:'Wie viel ist drei plus vier?',answer:'Sieben! Drei plus vier ist sieben.'},
 {who:'mei',question:'Postleitzahl – ich verstehe das nicht.',answer:'Ich helfe gern. Meine Postleitzahl ist 13629.',answerSay:'Ich helfe gern. Meine Postleitzahl ist '+digitWords('13629')+'.'},
 {who:'paul',question:'Woher kommt ihr?',answer:'Wir kommen aus der Türkei und aus Thailand.'},
 {who:'omar',question:'Wo wohnt ihr?',answer:'Wir wohnen in der Lindenstraße 7.',answerSay:'Wir wohnen in der Lindenstraße sieben.'},
];

/* ---------- steps ---------- */
export const berufeStepsC:Step[]=[
 {id:'kapak',title:'Kapak',kind:'cover'},
 {id:'sayilar',title:'Kelimeler: sayılar 0–20',kind:'teach'},
 {id:'kelimeler',title:'Kelimeler: liste',kind:'teach'},
 {id:'kontrol',title:'Kelime kontrolü',kind:'teach'},
 {id:'sayi-kurali',title:'Sayılar ve telefon',kind:'teach'},
 {id:'toplama',title:'Wie viel ist das?',kind:'teach'},
 {id:'yardim',title:'Yardım isteme',kind:'teach'},
 {id:'form',title:'Form ve mein / dein',kind:'teach'},
 {id:'wir-ihr',title:'wir ve ihr',kind:'teach'},
 {id:'vurgu',title:'Vurgu ve kalıplar',kind:'teach'},
 {id:'sayi-dinle',title:'Alıştırma 1',kind:'exercise'},
 {id:'dizi',title:'Alıştırma 2',kind:'exercise'},
 {id:'telefon',title:'Alıştırma 3',kind:'exercise'},
 {id:'zar',title:'Alıştırma 4',kind:'exercise'},
 {id:'yardim-diyalog',title:'Alıştırma 5',kind:'exercise'},
 {id:'form-soru',title:'Alıştırma 6',kind:'exercise'},
 {id:'mein-dein',title:'Alıştırma 7',kind:'exercise'},
 {id:'wir-ihr-yaz',title:'Alıştırma 8',kind:'exercise'},
 {id:'test',title:'Test',kind:'test'},
 {id:'konus',title:'Konuş',kind:'speak'},
 {id:'bitti',title:'Bitti',kind:'end'},
];
export const berufeStepIndexC=(id:string)=>berufeStepsC.findIndex(step=>step.id===id);
export const berufeStepShortC:Record<string,string>={'sayi-dinle':'Sayıyı duy','dizi':'Sayı dizileri','telefon':'Telefon numarası','zar':'Zar oyunu','yardim-diyalog':'Yardım diyaloğu','form-soru':'Form ve soru','mein-dein':'mein / dein','wir-ihr-yaz':'wir / ihr'};
const gapCount=(lines:readonly {answers:string[][]}[])=>lines.reduce((n,line)=>n+line.answers.length,0);
const choiceCount=(lines:readonly ChoiceLine[])=>lines.reduce((n,line)=>n+line.parts.filter(part=>typeof part!=='string').length,0);
export const berufeScoredC:{id:string;total:number}[]=[
 {id:'sayi-dinle',total:listenNumbers.length},
 {id:'dizi',total:gapCount(numberRows)},
 {id:'telefon',total:phones.length},
 {id:'zar',total:diceLines.length},
 {id:'yardim-diyalog',total:choiceCount(helpLines)},
 {id:'form-soru',total:fieldQuestions.length},
 {id:'mein-dein',total:choiceCount(possessiveLines)},
 {id:'wir-ihr-yaz',total:gapCount(wirIhrLines)},
 {id:'test',total:berufeTestC.length},
];
export const berufeGroupsC:StepGroup[]=[
 {id:'konu',label:'Konu anlatımı',ids:berufeStepsC.filter(step=>step.kind==='teach').map(step=>step.id)},
 {id:'alistirmalar',label:'Alıştırmalar',ids:berufeStepsC.filter(step=>step.kind==='exercise').map(step=>step.id)},
 {id:'test',label:'Test',ids:['test']},
 {id:'konus',label:'Konuş',ids:['konus']},
];
/** The words of Teil C and the numbers 0–20. */
export const berufeWordCountC=wordsC.length+numberWords.length;

/** Every German text Teil C speaks (rendered as site voices by scripts/voices). */
export function berufeCSpeechTexts():string[]{
 const out=new Set<string>();const add=(text:string|undefined)=>{const clean=(text??'').trim();if(clean)out.add(clean);};
 const say=(item:SayItem|undefined)=>{if(item)add(typeof item==='string'?item:item.text);};
 numberWords.forEach(add);add(countAll);
 wordsC.forEach(row=>add(wordSayC(row)));phrasesC.forEach(([,,text])=>add(text));
 for(const item of [...wordChecksC,...numberChecks,...plusChecks,...helpChecks,...formChecksC,...wirChecks])add(item.say);
 teenRows.forEach(([,,word])=>add(word));phonePhrases.forEach(([,,text])=>add(text));
 plusPhrases.forEach(([de])=>add(de));helpPhrases.forEach(([,,text])=>add(text));
 for(const line of [...helpDialogue,...flatDialogue])add(line.say??line.de);
 meaningRows.forEach(row=>add(meaningSay(row)));formRows.forEach(([,,,text])=>add(text));possessivePhrases.forEach(([,,text])=>add(text));
 add(wirIhrSay);wirIhrRows.forEach(([,,text])=>add(text));add(allPersonsSay);stressRows.forEach(([,word])=>add(word));
 numberRowSay.forEach(add);phones.forEach(phone=>add(phoneSay(phone.number)));dice.forEach(row=>add(diceSentence(row)));
 helpSay.forEach(say);fieldQuestions.forEach(row=>add(fieldSay(row)));possessiveLines.forEach(line=>say(line.say));
 wirIhrLines.forEach(line=>add(line.say));
 berufeTestC.forEach(question=>add(question[3]));
 practiceItemsC.forEach(item=>{add(item.question);add(item.answerSay??item.answer);});
 return [...out];
}
