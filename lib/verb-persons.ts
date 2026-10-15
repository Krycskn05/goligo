import {praesensPersons,type Verb} from './verb-course';
import {verbPrefix} from './verb-logic';

/**
 * Example sentences for every person (ich, du, er, sie, es, wir, ihr, sie, Sie), shown after an
 * answer: Präsens after the meaning questions, Perfekt after the Perfekt questions.
 * Every verb has one middle part that fits all persons (no sein/ihr, no mich/dich), so only the
 * subject and the verb change. gefallen and leid|tun are said with the person in the dative
 * (Die Stadt gefällt mir …), gelten with für + accusative (Die Regel gilt auch für mich …).
 */
export type PersonKey='ich'|'du'|'er'|'sie'|'es'|'wir'|'ihr'|'sie-plural'|'Sie';
export const personKeys:readonly PersonKey[]=['ich','du','er','sie','es','wir','ihr','sie-plural','Sie'];
export type PersonTense='praesens'|'perfekt';
/** pr/pf: the part between the verb and the prefix (Präsens) or the Partizip (Perfekt). */
type Plain={pr:string;pf:string};
/** {X} is replaced by the person in the dative or with für + accusative; the subject stays the same. */
type WithObject={mode:'dative'|'fuer';pr:string;pf:string};
const middles:Record<string,Plain|WithObject>={
 abfahren:{pr:'um acht Uhr',pf:'um acht Uhr'},
 abgeben:{pr:'das Heft bei der Lehrerin',pf:'das Heft bei der Lehrerin'},
 anbieten:{pr:'Anna einen Apfel',pf:'Anna einen Apfel'},
 anfangen:{pr:'heute mit dem Deutschkurs',pf:'gestern mit dem Deutschkurs'},
 ankommen:{pr:'heute Abend in Berlin',pf:'gestern Abend in Berlin'},
 anrufen:{pr:'heute Abend Anna',pf:'gestern Abend Anna'},
 anziehen:{pr:'heute eine warme Jacke',pf:'gestern eine warme Jacke'},
 aufstehen:{pr:'jeden Tag um sieben Uhr',pf:'heute um sieben Uhr'},
 aussehen:{pr:'heute sehr müde',pf:'gestern sehr müde'},
 aussteigen:{pr:'an der nächsten Haltestelle',pf:'am Bahnhof'},
 ausziehen:{pr:'nächsten Monat',pf:'letzte Woche'},
 beginnen:{pr:'um acht Uhr mit der Arbeit',pf:'um acht Uhr mit der Arbeit'},
 bekommen:{pr:'heute ein Paket',pf:'gestern ein Paket'},
 bleiben:{pr:'heute zu Hause',pf:'gestern zu Hause'},
 bringen:{pr:'den Kuchen zur Party',pf:'den Kuchen zur Party'},
 denken:{pr:'an die Prüfung',pf:'an die Prüfung'},
 einladen:{pr:'Freunde zur Party',pf:'Freunde zur Party'},
 empfehlen:{pr:'Anna das Buch',pf:'Anna das Buch'},
 essen:{pr:'gern Salat',pf:'gestern Salat'},
 fahren:{pr:'mit dem Bus zur Arbeit',pf:'mit dem Bus zur Arbeit'},
 finden:{pr:'den Schlüssel unter dem Sofa',pf:'den Schlüssel unter dem Sofa'},
 fliegen:{pr:'morgen nach Berlin',pf:'letzte Woche nach Berlin'},
 geben:{pr:'Jan einen Apfel',pf:'Jan einen Apfel'},
 gefallen:{mode:'dative',pr:'Die Stadt gefällt {X}',pf:'Die Stadt hat {X} gefallen'},
 gehen:{pr:'zu Fuß nach Hause',pf:'zu Fuß nach Hause'},
 gelten:{mode:'fuer',pr:'Die Regel gilt auch für {X}',pf:'Die Regel hat auch für {X} gegolten'},
 heißen:{pr:'Müller',pf:'früher Müller'},
 herunterladen:{pr:'eine App',pf:'eine App'},
 helfen:{pr:'der Nachbarin',pf:'der Nachbarin'},
 kennen:{pr:'die Stadt gut',pf:'die Stadt gut'},
 kommen:{pr:'heute zu spät',pf:'gestern zu spät'},
 laufen:{pr:'jeden Morgen im Park',pf:'heute im Park'},
 leidtun:{mode:'dative',pr:'Es tut {X} leid',pf:'Es hat {X} leidgetan'},
 leihen:{pr:'Max das Fahrrad',pf:'Max das Fahrrad'},
 lesen:{pr:'gern Bücher',pf:'gestern ein Buch'},
 liegen:{pr:'auf dem Sofa',pf:'den ganzen Tag auf dem Sofa'},
 mitbringen:{pr:'Blumen',pf:'Blumen'},
 mitkommen:{pr:'heute Abend',pf:'gestern Abend'},
};
const subjects:Record<PersonKey,string>={ich:'Ich',du:'Du',er:'Er',sie:'Sie',es:'Es',wir:'Wir',ihr:'Ihr','sie-plural':'Sie',Sie:'Sie'};
const datives:Record<PersonKey,string>={ich:'mir',du:'dir',er:'ihm',sie:'ihr',es:'ihm',wir:'uns',ihr:'euch','sie-plural':'ihnen',Sie:'Ihnen'};
const accusatives:Record<PersonKey,string>={ich:'mich',du:'dich',er:'ihn',sie:'sie',es:'es',wir:'uns',ihr:'euch','sie-plural':'sie',Sie:'Sie'};
/** Which form of the verb a person takes: er/sie/es share one, wir/sie/Sie share one. */
const formOf:Record<PersonKey,'ich'|'du'|'er'|'wir'|'ihr'>={ich:'ich',du:'du',er:'er',sie:'er',es:'er',wir:'wir',ihr:'ihr','sie-plural':'wir',Sie:'wir'};
const helpers={hat:{ich:'habe',du:'hast',er:'hat',wir:'haben',ihr:'habt'},ist:{ich:'bin',du:'bist',er:'ist',wir:'sind',ihr:'seid'}} as const;
/** The label of the row: the pronoun as the learner says it (sie-plural shows as "sie"). */
export const personLabel=(key:PersonKey)=>key==='sie-plural'?'sie':key;
/** plain text, the finite verb or helper (verb), the prefix or Partizip at the end (end), or the person as an object (person). */
export type SentencePart={text:string;role:'plain'|'verb'|'end'|'person'};
export type PersonSentence={person:PersonKey;parts:SentencePart[];text:string};
/** Whether the person is the subject (most verbs) or an object (gefallen, leid|tun: dative; gelten: für + accusative). */
export function personMode(verb:Verb):'subject'|'dative'|'fuer'{const spec=middles[verb.id];return spec&&'mode' in spec?spec.mode:'subject';}
function sentence(verb:Verb,person:PersonKey,tense:PersonTense):SentencePart[]{
 const spec=middles[verb.id];
 if('mode' in spec){
  const word=(spec.mode==='dative'?datives:accusatives)[person];const [before,after]=(tense==='praesens'?spec.pr:spec.pf).split('{X}');
  return [{text:before.trimEnd(),role:'plain'},{text:word,role:'person'},...(after.trim()?[{text:after.trim(),role:'plain'} as SentencePart]:[])];
 }
 const form=formOf[person];const middle=tense==='praesens'?spec.pr:spec.pf;
 if(tense==='perfekt')return [{text:subjects[person],role:'plain'},{text:helpers[verb.aux][form],role:'verb'},{text:middle,role:'plain'},{text:verb.participle,role:'end'}];
 const prefix=verbPrefix(verb);const finite=praesensPersons(verb)[form].slice(0,prefix?-(prefix.length+1):undefined);
 return [{text:subjects[person],role:'plain'},{text:finite,role:'verb'},{text:middle,role:'plain'},...(prefix?[{text:prefix,role:'end'} as SentencePart]:[])];
}
/** Nine sentences, one for each person, in the order ich, du, er, sie, es, wir, ihr, sie, Sie. */
export function personSentences(verb:Verb,tense:PersonTense):PersonSentence[]{
 if(!middles[verb.id])return [];
 return personKeys.map(person=>{const parts=sentence(verb,person,tense);return {person,parts,text:parts.map(part=>part.text).join(' ')+'.'};});
}
export const personSentenceVerbs=Object.keys(middles);
