import type {VaultLanguage,VaultTranslations} from './object-vault-copy';

/**
 * Fiil Atölyesi: the 38 verbs in two parts, in the order of the textbook page, split at the
 * line the learner drew after "essen". Every verb belongs to exactly one part. Part IDs
 * `verbs-w1` and `verbs-w2` are separate from the textbook group topics, which stay untouched.
 */
export type VerbFamily={id:string;number:number;verbs:readonly string[];tone:string;title:VaultTranslations;rule:VaultTranslations};
const define=(number:number,verbs:readonly string[],tone:string,title:VaultTranslations,rule:VaultTranslations):VerbFamily=>({id:'verbs-w'+number,number,verbs,tone,title,rule});
const same=(text:string):VaultTranslations=>[text,text,text,text,text,text,text,text,text,text,text,text];

export const verbFamilies:readonly VerbFamily[]=[
 define(1,['abfahren','abgeben','anbieten','anfangen','ankommen','anrufen','anziehen','aufstehen','aussehen','aussteigen','ausziehen','beginnen','bekommen','bleiben','bringen','denken','einladen','empfehlen','essen'],'teal',
  same('ab|fahren → essen'),
  ['Kitaptaki ilk 19 fiil, çizgiye kadar. Önce anlamları, sonra Perfekt biçimleri (sie/er hat … / ist …).','Die ersten 19 Verben aus dem Buch, bis zum Strich. Erst die Bedeutungen, dann die Perfektformen (sie/er hat … / ist …).','The first 19 verbs of the book, down to the line. Meanings first, then the Perfekt forms (sie/er hat … / ist …).','أول 19 فعلًا في الكتاب حتى الخط. المعاني أولًا، ثم صيغ Perfekt (sie/er hat … / ist …).','Перші 19 дієслів із книги, до риски. Спочатку значення, потім форми Perfekt (sie/er hat … / ist …).','Les 19 premiers verbes du livre, jusqu’au trait. D’abord le sens, puis les formes du Perfekt (sie/er hat … / ist …).','Los primeros 19 verbos del libro, hasta la línea. Primero los significados, luego las formas del Perfekt (sie/er hat … / ist …).','Первые 19 глаголов из книги, до черты. Сначала значения, потом формы Perfekt (sie/er hat … / ist …).','۱۹ فعل اول کتاب تا خط. اول معناها، بعد شکل‌های Perfekt (sie/er hat … / ist …).','Pierwsze 19 czasowników z książki, do kreski. Najpierw znaczenia, potem formy Perfekt (sie/er hat … / ist …).','I primi 19 verbi del libro, fino alla riga. Prima i significati, poi le forme del Perfekt (sie/er hat … / ist …).','Os primeiros 19 verbos do livro, até à linha. Primeiro os significados, depois as formas do Perfekt (sie/er hat … / ist …).']),
 define(2,['fahren','finden','fliegen','geben','gefallen','gehen','gelten','heißen','herunterladen','helfen','kennen','kommen','laufen','leidtun','leihen','lesen','liegen','mitbringen','mitkommen'],'amber',
  same('fahren → mit|kommen'),
  ['Kitaptaki son 19 fiil, çizgiden sonra. Önce anlamları, sonra Perfekt biçimleri (sie/er hat … / ist …).','Die letzten 19 Verben aus dem Buch, nach dem Strich. Erst die Bedeutungen, dann die Perfektformen (sie/er hat … / ist …).','The last 19 verbs of the book, after the line. Meanings first, then the Perfekt forms (sie/er hat … / ist …).','آخر 19 فعلًا في الكتاب بعد الخط. المعاني أولًا، ثم صيغ Perfekt (sie/er hat … / ist …).','Останні 19 дієслів із книги, після риски. Спочатку значення, потім форми Perfekt (sie/er hat … / ist …).','Les 19 derniers verbes du livre, après le trait. D’abord le sens, puis les formes du Perfekt (sie/er hat … / ist …).','Los últimos 19 verbos del libro, después de la línea. Primero los significados, luego las formas del Perfekt (sie/er hat … / ist …).','Последние 19 глаголов из книги, после черты. Сначала значения, потом формы Perfekt (sie/er hat … / ist …).','۱۹ فعل آخر کتاب بعد از خط. اول معناها، بعد شکل‌های Perfekt (sie/er hat … / ist …).','Ostatnie 19 czasowników z książki, za kreską. Najpierw znaczenia, potem formy Perfekt (sie/er hat … / ist …).','Gli ultimi 19 verbi del libro, dopo la riga. Prima i significati, poi le forme del Perfekt (sie/er hat … / ist …).','Os últimos 19 verbos do livro, depois da linha. Primeiro os significados, depois as formas do Perfekt (sie/er hat … / ist …).']),
];
export const verbFamilyMap=new Map(verbFamilies.map(family=>[family.id,family]));
const familyOfVerb=new Map(verbFamilies.flatMap(family=>family.verbs.map(verb=>[verb,family] as const)));
export const isVerbFamilyTopic=(topic:string)=>verbFamilyMap.has(topic);
/** The part a verb belongs to (every verb has exactly one). */
export function verbFamilyOf(verbId:string){return familyOfVerb.get(verbId);}
const languageIndex:Record<VaultLanguage,number>={tr:0,de:1,en:2,ar:3,uk:4,fr:5,es:6,ru:7,fa:8,pl:9,it:10,pt:11};
export function familyTitle(family:VerbFamily,language:VaultLanguage){return family.title[languageIndex[language]];}
/** What the part is about, in the chosen language (shown on the part's opening card). */
export function familyRule(family:VerbFamily,language:VaultLanguage){return family.rule[languageIndex[language]];}
