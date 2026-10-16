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
  ['Kitaptaki ilk 19 fiil, çizgiye kadar. Her fiilde önce anlamı, sonra geçmiş hali (fahren → gefahren).','Die ersten 19 Verben aus dem Buch, bis zum Strich. Bei jedem Verb erst die Bedeutung, dann das Partizip II (fahren → gefahren).','The first 19 verbs of the book, down to the line. For each verb its meaning first, then its past form (fahren → gefahren).','أول 19 فعلًا في الكتاب حتى الخط. لكل فعل معناه أولًا، ثم صيغة الماضي (fahren → gefahren).','Перші 19 дієслів із книги, до риски. Для кожного дієслова спочатку значення, потім минула форма (fahren → gefahren).','Les 19 premiers verbes du livre, jusqu’au trait. Pour chaque verbe, d’abord le sens, puis le participe passé (fahren → gefahren).','Los primeros 19 verbos del libro, hasta la línea. En cada verbo, primero el significado y luego el participio (fahren → gefahren).','Первые 19 глаголов из книги, до черты. У каждого глагола сначала значение, потом прошедшая форма (fahren → gefahren).','۱۹ فعل اول کتاب تا خط. در هر فعل اول معنا، بعد شکل گذشته (fahren → gefahren).','Pierwsze 19 czasowników z książki, do kreski. Przy każdym czasowniku najpierw znaczenie, potem forma przeszła (fahren → gefahren).','I primi 19 verbi del libro, fino alla riga. Per ogni verbo prima il significato, poi il participio (fahren → gefahren).','Os primeiros 19 verbos do livro, até à linha. Em cada verbo, primeiro o significado e depois o particípio (fahren → gefahren).']),
 define(2,['fahren','finden','fliegen','geben','gefallen','gehen','gelten','heißen','herunterladen','helfen','kennen','kommen','laufen','leidtun','leihen','lesen','liegen','mitbringen','mitkommen'],'amber',
  same('fahren → mit|kommen'),
  ['Kitaptaki son 19 fiil, çizgiden sonra. Her fiilde önce anlamı, sonra geçmiş hali (fahren → gefahren).','Die letzten 19 Verben aus dem Buch, nach dem Strich. Bei jedem Verb erst die Bedeutung, dann das Partizip II (fahren → gefahren).','The last 19 verbs of the book, after the line. For each verb its meaning first, then its past form (fahren → gefahren).','آخر 19 فعلًا في الكتاب بعد الخط. لكل فعل معناه أولًا، ثم صيغة الماضي (fahren → gefahren).','Останні 19 дієслів із книги, після риски. Для кожного дієслова спочатку значення, потім минула форма (fahren → gefahren).','Les 19 derniers verbes du livre, après le trait. Pour chaque verbe, d’abord le sens, puis le participe passé (fahren → gefahren).','Los últimos 19 verbos del libro, después de la línea. En cada verbo, primero el significado y luego el participio (fahren → gefahren).','Последние 19 глаголов из книги, после черты. У каждого глагола сначала значение, потом прошедшая форма (fahren → gefahren).','۱۹ فعل آخر کتاب بعد از خط. در هر فعل اول معنا، بعد شکل گذشته (fahren → gefahren).','Ostatnie 19 czasowników z książki, za kreską. Przy każdym czasowniku najpierw znaczenie, potem forma przeszła (fahren → gefahren).','Gli ultimi 19 verbi del libro, dopo la riga. Per ogni verbo prima il significato, poi il participio (fahren → gefahren).','Os últimos 19 verbos do livro, depois da linha. Em cada verbo, primeiro o significado e depois o particípio (fahren → gefahren).']),
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
