import type {VaultLanguage,VaultTranslations} from './object-vault-copy';
import {verbs,verbMap,type Verb} from './verb-course';
import {pickText} from './site-languages';

/**
 * The logic behind the 72 Fiiller verbs: example sentences (Präsens and Perfekt),
 * the pieces of each form, the hat/ist reason and short rules in twelve languages.
 * Games and the sentence gaps are built from this data; no question IDs live here.
 */
export type VerbTense='praesens'|'perfekt';
export type AuxReason='move'|'change'|'bleiben'|'hat';
type LogicSpec={pr:string;pf:string;pp:string;ppWrong:readonly string[];ps?:string;psWrong?:readonly string[];aux:AuxReason};
// Sentences: chunks split by '|'. {V}/{P} = Präsens verb and its prefix, {A}/{PP} = hat/ist and Partizip.
// pp = Partizip pieces split by '·'; ps = Präsens pieces for sie/er (only where the form changes or has a special ending).
const logic:Record<string,LogicSpec>={
 abfahren:{pr:'Der Zug|{V}|um acht Uhr|{P}',pf:'Der Zug|{A}|pünktlich|{PP}',pp:'ab·ge·fahr·en',ppWrong:['t','fähr'],ps:'fähr·t',psWrong:['fahr'],aux:'move'},
 abgeben:{pr:'Tim|{V}|sein Heft bei der Lehrerin|{P}',pf:'Tim|{A}|sein Heft bei der Lehrerin|{PP}',pp:'ab·ge·geb·en',ppWrong:['t','gib'],ps:'gib·t',psWrong:['geb'],aux:'hat'},
 anbieten:{pr:'Max|{V}|Anna einen Apfel|{P}',pf:'Max|{A}|Anna einen Apfel|{PP}',pp:'an·ge·bot·en',ppWrong:['biet','et'],ps:'biet·et',psWrong:['t'],aux:'hat'},
 anfangen:{pr:'Paul|{V}|mit dem Bild|{P}',pf:'Paul|{A}|mit dem Bild|{PP}',pp:'an·ge·fang·en',ppWrong:['t','fäng'],ps:'fäng·t',psWrong:['fang'],aux:'hat'},
 ankommen:{pr:'Mein Bruder|{V}|heute Abend|{P}',pf:'Mein Bruder|{A}|gestern Abend|{PP}',pp:'an·ge·komm·en',ppWrong:['t','kam'],aux:'move'},
 anrufen:{pr:'Jonas|{V}|seine Mutter|{P}',pf:'Jonas|{A}|seine Mutter|{PP}',pp:'an·ge·ruf·en',ppWrong:['t','rief'],aux:'hat'},
 anziehen:{pr:'Lisa|{V}|ihre gelbe Jacke|{P}',pf:'Lisa|{A}|ihre gelbe Jacke|{PP}',pp:'an·ge·zog·en',ppWrong:['zieh','t'],aux:'hat'},
 aufstehen:{pr:'Ben|{V}|jeden Tag um sieben Uhr|{P}',pf:'Ben|{A}|heute früh|{PP}',pp:'auf·ge·stand·en',ppWrong:['steh','t'],aux:'change'},
 aussehen:{pr:'Das Kleid|{V}|sehr schön|{P}',pf:'Das Kleid|{A}|sehr schön|{PP}',pp:'aus·ge·seh·en',ppWrong:['sieh','t'],ps:'sieh·t',psWrong:['seh'],aux:'hat'},
 aussteigen:{pr:'Leon|{V}|an der nächsten Haltestelle|{P}',pf:'Leon|{A}|am Bahnhof|{PP}',pp:'aus·ge·stieg·en',ppWrong:['steig','t'],aux:'move'},
 ausziehen:{pr:'Mein Bruder|{V}|nächsten Monat|{P}',pf:'Mein Bruder|{A}|letzte Woche|{PP}',pp:'aus·ge·zog·en',ppWrong:['zieh','t'],aux:'move'},
 beginnen:{pr:'Das Rennen|{V}|um zehn Uhr',pf:'Das Rennen|{A}|um zehn Uhr|{PP}',pp:'be·gonn·en',ppWrong:['ge','ginn'],aux:'hat'},
 bekommen:{pr:'Anna|{V}|ein Geschenk',pf:'Anna|{A}|ein Geschenk|{PP}',pp:'be·komm·en',ppWrong:['ge','t'],aux:'hat'},
 bleiben:{pr:'Tom|{V}|heute zu Hause',pf:'Tom|{A}|gestern zu Hause|{PP}',pp:'ge·blieb·en',ppWrong:['bleib','t'],aux:'bleiben'},
 bringen:{pr:'Der Postbote|{V}|ein Paket',pf:'Der Postbote|{A}|ein Paket|{PP}',pp:'ge·brach·t',ppWrong:['bring','en'],aux:'hat'},
 denken:{pr:'Max|{V}|an seine Prüfung',pf:'Max|{A}|lange|{PP}',pp:'ge·dach·t',ppWrong:['denk','en'],aux:'hat'},
 einladen:{pr:'Lena|{V}|ihre Freunde zur Party|{P}',pf:'Lena|{A}|ihre Freunde zur Party|{PP}',pp:'ein·ge·lad·en',ppWrong:['t','läd'],ps:'läd·t',psWrong:['lad','et'],aux:'hat'},
 empfehlen:{pr:'Paul|{V}|seinem Freund ein Buch',pf:'Paul|{A}|seinem Freund ein Buch|{PP}',pp:'emp·fohl·en',ppWrong:['ge','fehl'],ps:'empfiehl·t',psWrong:['empfehl'],aux:'hat'},
 essen:{pr:'Maria|{V}|gern Salat',pf:'Maria|{A}|einen Salat|{PP}',pp:'ge·gess·en',ppWrong:['t','ess'],ps:'iss·t',psWrong:['ess','st'],aux:'hat'},
 fahren:{pr:'Tim|{V}|mit dem Auto zur Arbeit',pf:'Tim|{A}|mit dem Auto zur Arbeit|{PP}',pp:'ge·fahr·en',ppWrong:['t','fuhr'],ps:'fähr·t',psWrong:['fahr','et'],aux:'move'},
 finden:{pr:'Leo|{V}|seinen Schlüssel unter dem Sofa',pf:'Leo|{A}|seinen Schlüssel unter dem Sofa|{PP}',pp:'ge·fund·en',ppWrong:['find','et'],ps:'find·et',psWrong:['t'],aux:'hat'},
 fliegen:{pr:'Das Flugzeug|{V}|nach Berlin',pf:'Meine Schwester|{A}|nach Berlin|{PP}',pp:'ge·flog·en',ppWrong:['flieg','t'],aux:'move'},
 geben:{pr:'Sara|{V}|Jan einen Apfel',pf:'Sara|{A}|Jan einen Apfel|{PP}',pp:'ge·geb·en',ppWrong:['gib','t'],ps:'gib·t',psWrong:['geb'],aux:'hat'},
 gefallen:{pr:'Der Blumenstrauß|{V}|ihr sehr',pf:'Der Blumenstrauß|{A}|ihr sehr|{PP}',pp:'ge·fall·en',ppWrong:['ge','t'],ps:'gefäll·t',psWrong:['gefall'],aux:'hat'},
 gehen:{pr:'Jan|{V}|zu Fuß zur Schule',pf:'Jan|{A}|zu Fuß zur Schule|{PP}',pp:'ge·gang·en',ppWrong:['geh','t'],aux:'move'},
 gelten:{pr:'Das Ticket|{V}|nur heute',pf:'Das Ticket|{A}|nur gestern|{PP}',pp:'ge·golt·en',ppWrong:['gelt','et'],ps:'gil·t',psWrong:['gelt','et'],aux:'hat'},
 heißen:{pr:'Mein Kollege|{V}|Tom',pf:'Der Film|{A}|„Sommer“|{PP}',pp:'ge·heiß·en',ppWrong:['t','hieß'],ps:'heiß·t',psWrong:['st'],aux:'hat'},
 herunterladen:{pr:'Lisa|{V}|eine App|{P}',pf:'Lisa|{A}|eine App|{PP}',pp:'herunter·ge·lad·en',ppWrong:['t','läd'],ps:'läd·t',psWrong:['lad','et'],aux:'hat'},
 helfen:{pr:'Tom|{V}|seiner Schwester',pf:'Tom|{A}|seiner Schwester|{PP}',pp:'ge·holf·en',ppWrong:['hilf','t'],ps:'hilf·t',psWrong:['helf'],aux:'hat'},
 kennen:{pr:'Ali|{V}|den Mann gut',pf:'Ali|{A}|den Mann gut|{PP}',pp:'ge·kann·t',ppWrong:['kenn','en'],aux:'hat'},
 kommen:{pr:'Mein Freund|{V}|heute zu mir',pf:'Mein Freund|{A}|gestern zu mir|{PP}',pp:'ge·komm·en',ppWrong:['kam','t'],aux:'move'},
 laufen:{pr:'Jonas|{V}|jeden Morgen im Park',pf:'Jonas|{A}|heute zehn Kilometer|{PP}',pp:'ge·lauf·en',ppWrong:['läuf','t'],ps:'läuf·t',psWrong:['lauf'],aux:'move'},
 leidtun:{pr:'Es|{V}|mir|{P}',pf:'Es|{A}|mir sehr|{PP}',pp:'leid·ge·tan',ppWrong:['tun','t'],aux:'hat'},
 leihen:{pr:'Paul|{V}|Max sein Buch',pf:'Paul|{A}|Max sein Buch|{PP}',pp:'ge·lieh·en',ppWrong:['leih','t'],aux:'hat'},
 lesen:{pr:'Anna|{V}|gern Romane',pf:'Anna|{A}|das Buch|{PP}',pp:'ge·les·en',ppWrong:['lies','t'],ps:'lies·t',psWrong:['les'],aux:'hat'},
 liegen:{pr:'Tom|{V}|auf dem Sofa',pf:'Tom|{A}|den ganzen Tag auf dem Sofa|{PP}',pp:'ge·leg·en',ppWrong:['lieg','t'],aux:'hat'},
 mitbringen:{pr:'Max|{V}|ein Geschenk|{P}',pf:'Max|{A}|ein Geschenk|{PP}',pp:'mit·ge·brach·t',ppWrong:['bring','en'],aux:'hat'},
 mitkommen:{pr:'Lena|{V}|ins Kino|{P}',pf:'Lena|{A}|ins Kino|{PP}',pp:'mit·ge·komm·en',ppWrong:['kam','t'],aux:'move'},
 // The second page (mit|nehmen → zurück|kommen).
 mitnehmen:{pr:'Lisa|{V}|einen Schirm|{P}',pf:'Lisa|{A}|einen Schirm|{PP}',pp:'mit·ge·nomm·en',ppWrong:['nehm','t'],ps:'nimm·t',psWrong:['nehm'],aux:'hat'},
 nehmen:{pr:'Ben|{V}|ein Buch aus dem Regal',pf:'Ben|{A}|ein Buch aus dem Regal|{PP}',pp:'ge·nomm·en',ppWrong:['nehm','t'],ps:'nimm·t',psWrong:['nehm'],aux:'hat'},
 rufen:{pr:'Anna|{V}|laut nach ihrem Freund',pf:'Anna|{A}|laut nach ihrem Freund|{PP}',pp:'ge·ruf·en',ppWrong:['t','rief'],aux:'hat'},
 scheinen:{pr:'Die Sonne|{V}|heute den ganzen Tag',pf:'Die Sonne|{A}|den ganzen Tag|{PP}',pp:'ge·schien·en',ppWrong:['schein','t'],aux:'hat'},
 schlafen:{pr:'Das Baby|{V}|im Kinderwagen',pf:'Das Baby|{A}|zwei Stunden|{PP}',pp:'ge·schlaf·en',ppWrong:['schläf','t'],ps:'schläf·t',psWrong:['schlaf'],aux:'hat'},
 schließen:{pr:'Lena|{V}|leise die Tür',pf:'Lena|{A}|leise die Tür|{PP}',pp:'ge·schloss·en',ppWrong:['schließ','t'],aux:'hat'},
 schneiden:{pr:'Paul|{V}|das Brot in Scheiben',pf:'Paul|{A}|das Brot in Scheiben|{PP}',pp:'ge·schnitt·en',ppWrong:['schneid','et'],ps:'schneid·et',psWrong:['t'],aux:'hat'},
 schreiben:{pr:'Mia|{V}|ihrer Oma einen Brief',pf:'Mia|{A}|ihrer Oma einen Brief|{PP}',pp:'ge·schrieb·en',ppWrong:['schreib','t'],aux:'hat'},
 schwimmen:{pr:'Tim|{V}|jeden Morgen im See',pf:'Tim|{A}|heute im See|{PP}',pp:'ge·schwomm·en',ppWrong:['schwimm','t'],aux:'move'},
 sehen:{pr:'Lisa|{V}|einen Vogel im Baum',pf:'Lisa|{A}|einen Vogel im Baum|{PP}',pp:'ge·seh·en',ppWrong:['sieh','t'],ps:'sieh·t',psWrong:['seh'],aux:'hat'},
 singen:{pr:'Jonas|{V}|ein Lied für seine Mutter',pf:'Jonas|{A}|ein Lied für seine Mutter|{PP}',pp:'ge·sung·en',ppWrong:['sing','t'],aux:'hat'},
 sitzen:{pr:'Oma|{V}|im Park auf einer Bank',pf:'Oma|{A}|lange auf der Bank|{PP}',pp:'ge·sess·en',ppWrong:['sitz','t'],aux:'hat'},
 sprechen:{pr:'Max|{V}|mit seiner Freundin',pf:'Max|{A}|lange mit seiner Freundin|{PP}',pp:'ge·sproch·en',ppWrong:['sprech','t'],ps:'sprich·t',psWrong:['sprech'],aux:'hat'},
 stehen:{pr:'Ali|{V}|an der Bushaltestelle',pf:'Ali|{A}|lange an der Haltestelle|{PP}',pp:'ge·stand·en',ppWrong:['steh','t'],aux:'hat'},
 stoßen:{pr:'Leo|{V}|mit dem Kopf an den Schrank',pf:'Leo|{A}|sich den Kopf am Schrank|{PP}',pp:'ge·stoß·en',ppWrong:['stöß','t'],ps:'stöß·t',psWrong:['stoß'],aux:'hat'},
 tragen:{pr:'Ben|{V}|eine schwere Kiste',pf:'Ben|{A}|eine schwere Kiste|{PP}',pp:'ge·trag·en',ppWrong:['träg','t'],ps:'träg·t',psWrong:['trag'],aux:'hat'},
 treffen:{pr:'Anna|{V}|ihren Freund im Café',pf:'Anna|{A}|ihren Freund im Café|{PP}',pp:'ge·troff·en',ppWrong:['treff','t'],ps:'triff·t',psWrong:['treff'],aux:'hat'},
 trinken:{pr:'Lea|{V}|ein Glas Wasser',pf:'Lea|{A}|ein Glas Wasser|{PP}',pp:'ge·trunk·en',ppWrong:['trink','t'],aux:'hat'},
 tun:{pr:'Tom|{V}|heute viel im Haushalt',pf:'Tom|{A}|heute viel im Haushalt|{PP}',pp:'ge·tan',ppWrong:['tu','t'],aux:'hat'},
 überweisen:{pr:'Mia|{V}|die Miete jeden Monat',pf:'Mia|{A}|die Miete schon|{PP}',pp:'über·wies·en',ppWrong:['ge','weis'],aux:'hat'},
 umsteigen:{pr:'Lena|{V}|in Köln in den ICE|{P}',pf:'Lena|{A}|in Köln|{PP}',pp:'um·ge·stieg·en',ppWrong:['steig','t'],aux:'move'},
 umziehen:{pr:'Familie Wolf|{V}|nach Berlin|{P}',pf:'Familie Wolf|{A}|nach Berlin|{PP}',pp:'um·ge·zog·en',ppWrong:['zieh','t'],aux:'move'},
 unterschreiben:{pr:'Herr Weber|{V}|den Vertrag',pf:'Herr Weber|{A}|den Vertrag|{PP}',pp:'unter·schrieb·en',ppWrong:['ge','schreib'],aux:'hat'},
 vergessen:{pr:'Lisa|{V}|oft ihren Schlüssel',pf:'Lisa|{A}|ihren Schlüssel zu Hause|{PP}',pp:'ver·gess·en',ppWrong:['ge','t'],ps:'vergiss·t',psWrong:['vergess'],aux:'hat'},
 verlieren:{pr:'Tom|{V}|oft seine Handschuhe',pf:'Tom|{A}|seine Geldbörse|{PP}',pp:'ver·lor·en',ppWrong:['ge','lier'],aux:'hat'},
 verstehen:{pr:'Sara|{V}|die Aufgabe jetzt',pf:'Sara|{A}|die Aufgabe sofort|{PP}',pp:'ver·stand·en',ppWrong:['ge','steh'],aux:'hat'},
 wehtun:{pr:'Der Zahn|{V}|ihm sehr|{P}',pf:'Der Zahn|{A}|ihm sehr|{PP}',pp:'weh·ge·tan',ppWrong:['tun','t'],aux:'hat'},
 werden:{pr:'Lisa|{V}|bald Tierärztin',pf:'Lisa|{A}|Tierärztin|{PP}',pp:'ge·word·en',ppWrong:['werd','t'],ps:'wir·d',psWrong:['werd','et'],aux:'change'},
 wissen:{pr:'Max|{V}|die Antwort genau',pf:'Max|{A}|die Antwort|{PP}',pp:'ge·wuss·t',ppWrong:['wiss','en'],ps:'wei·ß',psWrong:['wiss','t'],aux:'hat'},
 ziehen:{pr:'Familie Klein|{V}|nach Hamburg',pf:'Familie Klein|{A}|nach Hamburg|{PP}',pp:'ge·zog·en',ppWrong:['zieh','t'],aux:'move'},
 zurückgeben:{pr:'Paul|{V}|Anna das Buch|{P}',pf:'Paul|{A}|Anna das Buch|{PP}',pp:'zurück·ge·geb·en',ppWrong:['t','gib'],ps:'gib·t',psWrong:['geb'],aux:'hat'},
 zurückgehen:{pr:'Lena|{V}|schnell nach Hause|{P}',pf:'Lena|{A}|schnell nach Hause|{PP}',pp:'zurück·ge·gang·en',ppWrong:['geh','t'],aux:'move'},
 zurückfahren:{pr:'Herr Bauer|{V}|morgen nach Wien|{P}',pf:'Herr Bauer|{A}|gestern nach Wien|{PP}',pp:'zurück·ge·fahr·en',ppWrong:['t','fähr'],ps:'fähr·t',psWrong:['fahr'],aux:'move'},
 zurückkommen:{pr:'Opa|{V}|heute aus dem Urlaub|{P}',pf:'Opa|{A}|gestern aus dem Urlaub|{PP}',pp:'zurück·ge·komm·en',ppWrong:['kam','t'],aux:'move'},
};
export const verbLogic=logic;
export const separablePrefixes=['ab','an','auf','aus','ein','herunter','leid','mit','um','weh','zurück'] as const;
/** The separable prefix of a verb, e.g. "ab" for ab|fahren. */
export function verbPrefix(verb:Verb){return verb.display.includes('|')?verb.display.split('|')[0]:'';}
/** The Präsens verb form without the prefix that goes to the end ("fährt" of "fährt ab"). */
export function praesensStem(verb:Verb){const prefix=verbPrefix(verb);return prefix?verb.praesens.slice(0,-(prefix.length+1)):verb.praesens;}
/** The Präsens form as an answer option: "fährt", or "steht … auf" when the prefix goes to the end. */
export function praesensForm(verb:Verb){const prefix=verbPrefix(verb);return prefix?praesensStem(verb)+' … '+prefix:verb.praesens;}

export type SentenceChunk={text:string;role:'subject'|'middle'|'verb'|'prefix'|'aux'|'participle'};
/** The example sentence as ordered chunks; the verb chunks carry their role. */
export function sentenceChunks(verb:Verb,tense:VerbTense):SentenceChunk[]{
 const spec=logic[verb.id];const template=tense==='praesens'?spec.pr:spec.pf;
 return template.split('|').map((part,index)=>{
  if(part==='{V}')return {text:praesensStem(verb),role:'verb'};
  if(part==='{P}')return {text:verbPrefix(verb),role:'prefix'};
  if(part==='{A}')return {text:verb.aux,role:'aux'};
  if(part==='{PP}')return {text:verb.participle,role:'participle'};
  return {text:part,role:index===0?'subject':'middle'};
 });
}
export function sentenceText(verb:Verb,tense:VerbTense){return sentenceChunks(verb,tense).map(chunk=>chunk.text).join(' ')+'.';}
/** A tempting wrong chunk for the sentence game: the unseparated or wrong Präsens form, or the other helping verb. */
export function sentenceDistractor(verb:Verb,tense:VerbTense){
 if(tense==='perfekt')return verb.alsoIst?verb.perfektWrong[0].split(' ').slice(1).join(' '):verb.aux==='hat'?'ist':'hat';
 const prefix=verbPrefix(verb);return prefix?prefix+praesensStem(verb):verb.praesensWrong[0];
}
export function participlePieces(verb:Verb){return logic[verb.id].pp.split('·');}
export function participleWrongPieces(verb:Verb){return [...logic[verb.id].ppWrong];}
export function praesensPieces(verb:Verb){return logic[verb.id].ps?.split('·')??null;}
export function praesensWrongPieces(verb:Verb){return [...(logic[verb.id].psWrong??[])];}
export function auxReason(verb:Verb){return logic[verb.id].aux;}

// Pictures made for the learner (ChatGPT sheets). File names use ss/ae/oe/ue for ß/ä/ö/ü (stoßen → stossen, überweisen → ueberweisen).
const pictureless=new Set<string>();
const fileName=(id:string)=>id.replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue');
export function verbPicture(verb:Verb){return pictureless.has(verb.id)?null:'/verbs/'+fileName(verb.id)+'.webp';}
export const verbsHeroPicture='/verbs/fiiller-genel.webp';

const ruleCopy={
 separable:["Ayrılabilen fiil: Präsens'te ön ek ({p}) cümlenin sonuna gider.","Trennbares Verb: Im Präsens steht die Vorsilbe ({p}) am Satzende.","Separable verb: in the Präsens the prefix ({p}) goes to the end of the sentence.","فعل منفصل: في Präsens تذهب البادئة ({p}) إلى نهاية الجملة.","Відокремлюване дієслово: у Präsens префікс ({p}) стоїть у кінці речення.","Verbe séparable : au Präsens, la particule ({p}) va à la fin de la phrase.","Verbo separable: en Präsens el prefijo ({p}) va al final de la frase.","Отделяемый глагол: в Präsens приставка ({p}) стоит в конце предложения.","فعل جداشدنی: در Präsens پیشوند ({p}) به آخر جمله می‌رود.","Czasownik rozdzielnie złożony: w Präsens przedrostek ({p}) idzie na koniec zdania.","Verbo separabile: al Präsens il prefisso ({p}) va alla fine della frase.","Verbo separável: no Präsens o prefixo ({p}) vai para o fim da frase."],
 sepGe:["Perfekt'te ge- ön ek ile kökün arasına girer ({x}).","Im Perfekt steht ge- zwischen Vorsilbe und Stamm ({x}).","In the Perfekt, ge- goes between the prefix and the stem ({x}).","في Perfekt تأتي ge- بين البادئة والجذر ({x}).","У Perfekt ge- стоїть між префіксом і основою ({x}).","Au Perfekt, ge- se place entre la particule et le radical ({x}).","En Perfekt, ge- va entre el prefijo y la raíz ({x}).","В Perfekt ge- стоит между приставкой и основой ({x}).","در Perfekt، ge- بین پیشوند و ریشه می‌آید ({x}).","W Perfekt ge- stoi między przedrostkiem a rdzeniem ({x}).","Nel Perfekt ge- va tra il prefisso e la radice ({x}).","No Perfekt, ge- fica entre o prefixo e o radical ({x})."],
 noGe:["be-, emp-, ge-, ver-, über-, unter- gibi ayrılmayan ön ekli fiiller Perfekt'te ayrıca ge- almaz ({x}).","Verben mit untrennbarer Vorsilbe (be-, emp-, ge-, ver-, über-, unter-) bekommen im Perfekt kein zusätzliches ge- ({x}).","Verbs with an inseparable prefix (be-, emp-, ge-, ver-, über-, unter-) take no extra ge- in the Perfekt ({x}).","الأفعال ذات البادئة غير المنفصلة (be- وemp- وge- وver- وüber- وunter-) لا تأخذ ge- إضافية في Perfekt ({x}).","Дієслова з невідокремлюваним префіксом (be-, emp-, ge-, ver-, über-, unter-) у Perfekt не отримують додаткового ge- ({x}).","Les verbes à préfixe inséparable (be-, emp-, ge-, ver-, über-, unter-) ne prennent pas de ge- en plus au Perfekt ({x}).","Los verbos con prefijo inseparable (be-, emp-, ge-, ver-, über-, unter-) no llevan otro ge- en Perfekt ({x}).","Глаголы с неотделяемой приставкой (be-, emp-, ge-, ver-, über-, unter-) не получают дополнительного ge- в Perfekt ({x}).","فعل‌های با پیشوند جدانشدنی (be-، emp-، ge-، ver-، über-، unter-) در Perfekt پیشوند ge- اضافه نمی‌گیرند ({x}).","Czasowniki z nierozdzielnym przedrostkiem (be-, emp-, ge-, ver-, über-, unter-) nie dostają w Perfekt dodatkowego ge- ({x}).","I verbi con prefisso inseparabile (be-, emp-, ge-, ver-, über-, unter-) non prendono un altro ge- nel Perfekt ({x}).","Verbos com prefixo inseparável (be-, emp-, ge-, ver-, über-, unter-) não levam outro ge- no Perfekt ({x})."],
 strong:["Düzensiz fiil: Partizip -en ile biter, kökteki ünlü değişebilir ({x}).","Unregelmäßiges Verb: Das Partizip endet auf -en, der Vokal kann sich ändern ({x}).","Irregular verb: the participle ends in -en and the vowel may change ({x}).","فعل شاذ: ينتهي اسم المفعول بـ -en وقد يتغير الحرف الصوتي ({x}).","Неправильне дієслово: дієприкметник закінчується на -en, голосна може змінюватися ({x}).","Verbe irrégulier : le participe se termine par -en, la voyelle peut changer ({x}).","Verbo irregular: el participio termina en -en y la vocal puede cambiar ({x}).","Неправильный глагол: причастие оканчивается на -en, гласная может меняться ({x}).","فعل بی‌قاعده: Partizip با -en تمام می‌شود و واکه ممکن است عوض شود ({x}).","Czasownik nieregularny: imiesłów kończy się na -en, samogłoska może się zmienić ({x}).","Verbo irregolare: il participio finisce in -en e la vocale può cambiare ({x}).","Verbo irregular: o particípio termina em -en e a vogal pode mudar ({x})."],
 mixed:["Karışık fiil: kök değişir ama Partizip -t ile biter ({x}).","Gemischtes Verb: Der Stamm ändert sich, aber das Partizip endet auf -t ({x}).","Mixed verb: the stem changes, but the participle ends in -t ({x}).","فعل مختلط: يتغير الجذر لكن اسم المفعول ينتهي بـ -t ({x}).","Змішане дієслово: основа змінюється, але дієприкметник закінчується на -t ({x}).","Verbe mixte : le radical change, mais le participe se termine par -t ({x}).","Verbo mixto: la raíz cambia, pero el participio termina en -t ({x}).","Смешанный глагол: основа меняется, но причастие оканчивается на -t ({x}).","فعل مختلط: ریشه عوض می‌شود ولی Partizip با -t تمام می‌شود ({x}).","Czasownik mieszany: rdzeń się zmienia, ale imiesłów kończy się na -t ({x}).","Verbo misto: la radice cambia, ma il participio finisce in -t ({x}).","Verbo misto: o radical muda, mas o particípio termina em -t ({x})."],
 vowelA:["Präsens'te sie/er için a → ä olur ({x}).","Im Präsens wird bei sie/er a → ä ({x}).","In the Präsens, a becomes ä for sie/er ({x}).","في Präsens يتحول a إلى ä مع sie/er ({x}).","У Präsens для sie/er a → ä ({x}).","Au Präsens, a devient ä avec sie/er ({x}).","En Präsens, a pasa a ä con sie/er ({x}).","В Präsens у sie/er a → ä ({x}).","در Präsens برای sie/er، a به ä تبدیل می‌شود ({x}).","W Präsens dla sie/er a → ä ({x}).","Al Präsens con sie/er a diventa ä ({x}).","No Präsens, com sie/er o a vira ä ({x})."],
 vowelE:["Präsens'te sie/er için e → i veya ie olur ({x}).","Im Präsens wird bei sie/er e → i oder ie ({x}).","In the Präsens, e becomes i or ie for sie/er ({x}).","في Präsens يتحول e إلى i أو ie مع sie/er ({x}).","У Präsens для sie/er e → i або ie ({x}).","Au Präsens, e devient i ou ie avec sie/er ({x}).","En Präsens, e pasa a i o ie con sie/er ({x}).","В Präsens у sie/er e → i или ie ({x}).","در Präsens برای sie/er، e به i یا ie تبدیل می‌شود ({x}).","W Präsens dla sie/er e → i lub ie ({x}).","Al Präsens con sie/er e diventa i o ie ({x}).","No Präsens, com sie/er o e vira i ou ie ({x})."],
 extraE:["Kök t veya d ile bitiyorsa araya e girer: -et ({x}).","Endet der Stamm auf t oder d, kommt ein e dazu: -et ({x}).","If the stem ends in t or d, an e is added: -et ({x}).","إذا انتهى الجذر بـ t أو d تُضاف e: -et ({x}).","Якщо основа закінчується на t або d, додається e: -et ({x}).","Si le radical se termine par t ou d, on ajoute un e : -et ({x}).","Si la raíz termina en t o d, se añade una e: -et ({x}).","Если основа оканчивается на t или d, добавляется e: -et ({x}).","اگر ریشه با t یا d تمام شود، یک e اضافه می‌شود: -et ({x}).","Gdy rdzeń kończy się na t lub d, dochodzi e: -et ({x}).","Se la radice finisce in t o d, si aggiunge una e: -et ({x}).","Se o radical termina em t ou d, acrescenta-se um e: -et ({x})."],
 sOnly:["Kök s, ss veya ß ile bitiyorsa yalnızca -t eklenir ({x}).","Endet der Stamm auf s, ss oder ß, kommt nur -t dazu ({x}).","If the stem ends in s, ss or ß, only -t is added ({x}).","إذا انتهى الجذر بـ s أو ss أو ß تُضاف -t فقط ({x}).","Якщо основа закінчується на s, ss або ß, додається лише -t ({x}).","Si le radical se termine par s, ss ou ß, on ajoute seulement -t ({x}).","Si la raíz termina en s, ss o ß, solo se añade -t ({x}).","Если основа оканчивается на s, ss или ß, добавляется только -t ({x}).","اگر ریشه با s، ss یا ß تمام شود، فقط -t اضافه می‌شود ({x}).","Gdy rdzeń kończy się na s, ss lub ß, dochodzi tylko -t ({x}).","Se la radice finisce in s, ss o ß, si aggiunge solo -t ({x}).","Se o radical termina em s, ss ou ß, acrescenta-se só -t ({x})."],
 regular:["Düzenli Präsens: kök + -t ({x}).","Regelmäßiges Präsens: Stamm + -t ({x}).","Regular Präsens: stem + -t ({x}).","Präsens منتظم: الجذر + -t ({x}).","Звичайний Präsens: основа + -t ({x}).","Präsens régulier : radical + -t ({x}).","Präsens regular: raíz + -t ({x}).","Обычный Präsens: основа + -t ({x}).","Präsens باقاعده: ریشه + -t ({x}).","Regularny Präsens: rdzeń + -t ({x}).","Präsens regolare: radice + -t ({x}).","Präsens regular: radical + -t ({x})."],
 verbSecond:["Präsens: çekimli fiil cümlede 2. sırada.","Präsens: Das konjugierte Verb steht an Position 2.","Präsens: the conjugated verb is in position 2.","Präsens: يأتي الفعل المصرَّف في الموضع الثاني.","Präsens: відмінюване дієслово стоїть на 2-му місці.","Präsens : le verbe conjugué est en 2e position.","Präsens: el verbo conjugado va en la posición 2.","Präsens: спрягаемый глагол стоит на 2-м месте.","Präsens: فعل صرف‌شده در جایگاه دوم جمله است.","Präsens: odmieniony czasownik stoi na 2. miejscu.","Präsens: il verbo coniugato è in 2ª posizione.","Präsens: o verbo conjugado fica na 2.ª posição."],
 perfektFrame:["Perfekt: hat/ist cümlede 2. sırada, Partizip en sonda.","Perfekt: hat/ist steht an Position 2, das Partizip am Satzende.","Perfekt: hat/ist is in position 2, the participle at the end.","Perfekt: يأتي hat/ist في الموضع الثاني واسم المفعول في نهاية الجملة.","Perfekt: hat/ist на 2-му місці, дієприкметник у кінці.","Perfekt : hat/ist en 2e position, le participe à la fin.","Perfekt: hat/ist va en la posición 2 y el participio al final.","Perfekt: hat/ist на 2-м месте, причастие в конце.","Perfekt: hat/ist در جایگاه دوم و Partizip در آخر جمله.","Perfekt: hat/ist na 2. miejscu, imiesłów na końcu.","Perfekt: hat/ist in 2ª posizione, il participio alla fine.","Perfekt: hat/ist na 2.ª posição, o particípio no fim."],
 move:["ist: fiil bir yerden başka bir yere hareketi anlatıyor ({x}).","ist: Das Verb beschreibt eine Bewegung von einem Ort zu einem anderen ({x}).","ist: the verb describes moving from one place to another ({x}).","ist: الفعل يصف الانتقال من مكان إلى آخر ({x}).","ist: дієслово описує рух з одного місця в інше ({x}).","ist : le verbe décrit un déplacement d’un lieu à un autre ({x}).","ist: el verbo describe un movimiento de un lugar a otro ({x}).","ist: глагол описывает перемещение из одного места в другое ({x}).","ist: فعل حرکت از جایی به جای دیگر را نشان می‌دهد ({x}).","ist: czasownik opisuje ruch z miejsca na miejsce ({x}).","ist: il verbo descrive un movimento da un luogo a un altro ({x}).","ist: o verbo descreve um movimento de um lugar para outro ({x})."],
 change:["ist: fiil bir durum değişimini anlatıyor ({x}).","ist: Das Verb beschreibt eine Zustandsänderung ({x}).","ist: the verb describes a change of state ({x}).","ist: الفعل يصف تغيّرًا في الحالة ({x}).","ist: дієслово описує зміну стану ({x}).","ist : le verbe décrit un changement d’état ({x}).","ist: el verbo describe un cambio de estado ({x}).","ist: глагол описывает изменение состояния ({x}).","ist: فعل تغییر حالت را نشان می‌دهد ({x}).","ist: czasownik opisuje zmianę stanu ({x}).","ist: il verbo descrive un cambiamento di stato ({x}).","ist: o verbo descreve uma mudança de estado ({x})."],
 bleiben:["İstisna: bleiben hareket anlatmaz ama Perfekt'i ist ile yapılır ({x}).","Ausnahme: bleiben ist keine Bewegung, bildet das Perfekt aber mit ist ({x}).","Exception: bleiben is not movement, but its Perfekt uses ist ({x}).","استثناء: bleiben لا يدل على حركة لكن Perfekt يُصاغ مع ist ({x}).","Виняток: bleiben не означає руху, але Perfekt утворює з ist ({x}).","Exception : bleiben n’exprime pas de mouvement, mais son Perfekt se fait avec ist ({x}).","Excepción: bleiben no es movimiento, pero su Perfekt lleva ist ({x}).","Исключение: bleiben не означает движения, но Perfekt образует с ist ({x}).","استثنا: bleiben حرکت نیست، اما Perfekt آن با ist ساخته می‌شود ({x}).","Wyjątek: bleiben nie oznacza ruchu, ale Perfekt tworzy z ist ({x}).","Eccezione: bleiben non è movimento, ma il Perfekt si forma con ist ({x}).","Exceção: bleiben não é movimento, mas o Perfekt usa ist ({x})."],
 hat:["hat: hareket ya da durum değişimi yok; çoğu fiil hat alır ({x}).","hat: keine Bewegung und keine Zustandsänderung – die meisten Verben nehmen hat ({x}).","hat: no movement or change of state – most verbs take hat ({x}).","hat: لا حركة ولا تغيّر حالة – معظم الأفعال تأخذ hat ({x}).","hat: немає руху чи зміни стану – більшість дієслів мають hat ({x}).","hat : ni déplacement ni changement d’état – la plupart des verbes prennent hat ({x}).","hat: no hay movimiento ni cambio de estado; la mayoría de los verbos llevan hat ({x}).","hat: нет движения и изменения состояния – большинство глаголов берут hat ({x}).","hat: نه حرکتی هست نه تغییر حالتی – بیشتر فعل‌ها hat می‌گیرند ({x}).","hat: brak ruchu i zmiany stanu – większość czasowników bierze hat ({x}).","hat: niente movimento né cambiamento di stato – la maggior parte dei verbi prende hat ({x}).","hat: sem movimento nem mudança de estado – a maioria dos verbos usa hat ({x})."],
 vowelO:["Präsens'te sie/er için o → ö olur ({x}).","Im Präsens wird bei sie/er o → ö ({x}).","In the Präsens, o becomes ö for sie/er ({x}).","في Präsens يتحول o إلى ö مع sie/er ({x}).","У Präsens для sie/er o → ö ({x}).","Au Präsens, o devient ö avec sie/er ({x}).","En Präsens, o pasa a ö con sie/er ({x}).","В Präsens у sie/er o → ö ({x}).","در Präsens برای sie/er، o به ö تبدیل می‌شود ({x}).","W Präsens dla sie/er o → ö ({x}).","Al Präsens con sie/er o diventa ö ({x}).","No Präsens, com sie/er o o vira ö ({x})."],
 wissen:["Özel Präsens: ich ve sie/er aynıdır, sonuna -t gelmez ({x}; ich weiß, du weißt).","Besonderes Präsens: ich und sie/er sind gleich, ohne -t ({x}; ich weiß, du weißt).","Special Präsens: ich and sie/er are the same, with no -t ({x}; ich weiß, du weißt).","Präsens خاص: ich وsie/er متطابقان وبدون -t ({x}؛ ich weiß، du weißt).","Особливий Präsens: ich і sie/er однакові, без -t ({x}; ich weiß, du weißt).","Präsens particulier : ich et sie/er sont identiques, sans -t ({x} ; ich weiß, du weißt).","Präsens especial: ich y sie/er son iguales, sin -t ({x}; ich weiß, du weißt).","Особый Präsens: ich и sie/er совпадают, без -t ({x}; ich weiß, du weißt).","Präsens ویژه: ich و sie/er یکسان‌اند و -t نمی‌گیرند ({x}؛ ich weiß، du weißt).","Szczególny Präsens: ich i sie/er są takie same, bez -t ({x}; ich weiß, du weißt).","Präsens particolare: ich e sie/er sono uguali, senza -t ({x}; ich weiß, du weißt).","Präsens especial: ich e sie/er são iguais, sem -t ({x}; ich weiß, du weißt)."],
 pull:["Dikkat: 'çekmek' anlamında hat gezogen denir (Sie hat am Seil gezogen).","Achtung: Im Sinn von „an etwas ziehen“ sagt man hat gezogen (Sie hat am Seil gezogen).","Note: in the sense of “to pull” you say hat gezogen (Sie hat am Seil gezogen).","انتبه: بمعنى «يسحب» يُقال hat gezogen (Sie hat am Seil gezogen).","Увага: у значенні «тягнути» кажуть hat gezogen (Sie hat am Seil gezogen).","Attention : au sens de « tirer », on dit hat gezogen (Sie hat am Seil gezogen).","Ojo: en el sentido de «tirar» se dice hat gezogen (Sie hat am Seil gezogen).","Внимание: в значении «тянуть» говорят hat gezogen (Sie hat am Seil gezogen).","توجه: به معنای «کشیدن» می‌گویند hat gezogen (Sie hat am Seil gezogen).","Uwaga: w znaczeniu „ciągnąć” mówi się hat gezogen (Sie hat am Seil gezogen).","Attenzione: nel senso di «tirare» si dice hat gezogen (Sie hat am Seil gezogen).","Atenção: no sentido de «puxar» diz-se hat gezogen (Sie hat am Seil gezogen)."],
 clothes:["Dikkat: Giysi çıkarmak anlamında hat ausgezogen denir.","Achtung: Bei Kleidung sagt man hat ausgezogen (Er hat die Jacke ausgezogen).","Note: for taking off clothes you say hat ausgezogen.","انتبه: عند خلع الملابس يُقال hat ausgezogen.","Увага: коли знімають одяг, кажуть hat ausgezogen.","Attention : pour enlever un vêtement, on dit hat ausgezogen.","Ojo: para quitarse la ropa se dice hat ausgezogen.","Внимание: когда снимают одежду, говорят hat ausgezogen.","توجه: برای درآوردن لباس می‌گویند hat ausgezogen.","Uwaga: przy zdejmowaniu ubrania mówi się hat ausgezogen.","Attenzione: per togliersi un vestito si dice hat ausgezogen.","Atenção: para tirar a roupa diz-se hat ausgezogen."],
} as const satisfies Record<string,VaultTranslations>;
export type RuleKey=keyof typeof ruleCopy;
export const verbRuleCopy=ruleCopy;
export function ruleText(language:VaultLanguage,key:RuleKey,params:Record<string,string>={}){
 return pickText(ruleCopy[key],language).replace(/\{([a-z]+)\}/g,(token,name:string)=>params[name]??token);
}
const noGe=new Set(['beginnen','bekommen','empfehlen','gefallen','überweisen','unterschreiben','vergessen','verlieren','verstehen']);
const vowelA=new Set(['abfahren','fahren','anfangen','einladen','herunterladen','gefallen','laufen','schlafen','tragen','zurückfahren']);
const vowelE=new Set(['abgeben','geben','essen','gelten','helfen','lesen','aussehen','empfehlen','mitnehmen','nehmen','sehen','sprechen','treffen','vergessen','werden','zurückgeben']);
const vowelO=new Set(['stoßen']);
const extraE=new Set(['anbieten','finden','schneiden']);
const sOnly=new Set(['heißen','essen','schließen','stoßen','vergessen']);
/** Which rules explain this verb's Präsens or Perfekt (rule key + example). */
export function verbRuleKeys(verb:Verb,tense:VerbTense):{key:RuleKey;params:Record<string,string>}[]{
 const prefix=verbPrefix(verb);const result:{key:RuleKey;params:Record<string,string>}[]=[];
 if(tense==='praesens'){
  const x=verb.infinitive+' → '+verb.praesens;
  if(vowelA.has(verb.id))result.push({key:'vowelA',params:{x}});
  else if(vowelE.has(verb.id))result.push({key:'vowelE',params:{x}});
  else if(vowelO.has(verb.id))result.push({key:'vowelO',params:{x}});
  else if(verb.id==='wissen')result.push({key:'wissen',params:{x}});
  if(extraE.has(verb.id))result.push({key:'extraE',params:{x}});
  if(sOnly.has(verb.id))result.push({key:'sOnly',params:{x}});
  if(!result.length)result.push({key:'regular',params:{x}});
  result.push(prefix?{key:'separable',params:{p:prefix}}:{key:'verbSecond',params:{}});
  return result;
 }
 const pieces=participlePieces(verb).join('·');
 if(prefix)result.push({key:'sepGe',params:{x:pieces}});
 if(noGe.has(verb.id))result.push({key:'noGe',params:{x:verb.infinitive+' → '+verb.participle}});
 // tun → getan follows neither pattern, so no -en/-t rule is shown for leid|tun.
 if(!verb.participle.endsWith('getan'))result.push({key:verb.participle.endsWith('t')?'mixed':'strong',params:{x:verb.infinitive+' → '+verb.participle}});
 const reason=auxReason(verb);result.push({key:reason,params:{x:verb.aux+' '+verb.participle}});
 if(verb.id==='ausziehen')result.push({key:'clothes',params:{}});
 if(verb.id==='ziehen')result.push({key:'pull',params:{}});
 return result;
}
export function verbRules(verb:Verb,tense:VerbTense,language:VaultLanguage){return verbRuleKeys(verb,tense).map(rule=>ruleText(language,rule.key,rule.params));}
export function logicVerbs(topic:string){return verbs.filter(verb=>topic==='verbs-all'?true:verb.group===topic);}
export {verbMap};
