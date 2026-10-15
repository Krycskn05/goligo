import {verbs,praesensPersons,spokenSubject,type Verb} from './verb-course';
import {verbPrefix} from './verb-logic';

/**
 * Example sentences for every person (ich, du, er, sie, es, wir, ihr, sie, Sie), shown after an
 * answer: Präsens after the meaning questions, Perfekt after the Perfekt questions.
 * Every verb has one short middle part that fits all persons (no sein/ihr, no mich/dich), so only the
 * subject and the verb change, and each sentence fits on one line of a phone. gefallen and leid|tun are said with the person in the dative
 * (Die Stadt gefällt mir …), gelten with für + accusative (Die Regel gilt für mich …).
 */
export type PersonKey='ich'|'du'|'er'|'sie'|'es'|'wir'|'ihr'|'sie-plural'|'Sie';
export const personKeys:readonly PersonKey[]=['ich','du','er','sie','es','wir','ihr','sie-plural','Sie'];
export type PersonTense='praesens'|'perfekt';
/** pr/pf: the part between the verb and the prefix (Präsens) or the Partizip (Perfekt). */
type Plain={pr:string;pf:string};
/** {X} is replaced by the person in the dative or with für + accusative; the subject stays the same. */
type WithObject={mode:'dative'|'fuer';pr:string;pf:string};
const middles:Record<string,Plain|WithObject>={
 abfahren:{pr:'um acht',pf:'um acht'},
 abgeben:{pr:'das Heft',pf:'das Heft'},
 anbieten:{pr:'Tee',pf:'Tee'},
 anfangen:{pr:'heute',pf:'gestern'},
 ankommen:{pr:'in Berlin',pf:'in Berlin'},
 anrufen:{pr:'Anna',pf:'Anna'},
 anziehen:{pr:'eine Jacke',pf:'eine Jacke'},
 aufstehen:{pr:'um sieben',pf:'um sieben'},
 aussehen:{pr:'müde',pf:'müde'},
 aussteigen:{pr:'hier',pf:'hier'},
 ausziehen:{pr:'bald',pf:'gestern'},
 beginnen:{pr:'um acht',pf:'um acht'},
 bekommen:{pr:'ein Paket',pf:'ein Paket'},
 bleiben:{pr:'zu Hause',pf:'zu Hause'},
 bringen:{pr:'den Kuchen',pf:'den Kuchen'},
 denken:{pr:'oft an Oma',pf:'oft an Oma'},
 einladen:{pr:'Freunde',pf:'Freunde'},
 empfehlen:{pr:'das Buch',pf:'das Buch'},
 essen:{pr:'gern Salat',pf:'Salat'},
 fahren:{pr:'mit dem Bus',pf:'mit dem Bus'},
 finden:{pr:'das Handy',pf:'das Handy'},
 fliegen:{pr:'nach Berlin',pf:'nach Berlin'},
 geben:{pr:'Jan das Buch',pf:'Jan das Buch'},
 gefallen:{mode:'dative',pr:'Die Stadt gefällt {X}',pf:'Die Stadt hat {X} gefallen'},
 gehen:{pr:'nach Hause',pf:'nach Hause'},
 gelten:{mode:'fuer',pr:'Die Regel gilt für {X}',pf:'Die Regel hat für {X} gegolten'},
 heißen:{pr:'Müller',pf:'früher Müller'},
 herunterladen:{pr:'Apps',pf:'Apps'},
 helfen:{pr:'Oma',pf:'Oma'},
 kennen:{pr:'die Stadt',pf:'die Stadt'},
 kommen:{pr:'zu spät',pf:'zu spät'},
 laufen:{pr:'im Park',pf:'im Park'},
 leidtun:{mode:'dative',pr:'Es tut {X} leid',pf:'Es hat {X} leidgetan'},
 leihen:{pr:'Max das Rad',pf:'Max das Rad'},
 lesen:{pr:'gern Bücher',pf:'ein Buch'},
 liegen:{pr:'im Bett',pf:'im Bett'},
 mitbringen:{pr:'Blumen',pf:'Blumen'},
 mitkommen:{pr:'heute',pf:'gestern'},
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
/** The Präsens table of the learning card: the label, the form, and what is read aloud (pronoun + form). */
export function conjugationRows(verb:Verb):{pronoun:string;form:string;spoken:string}[]{
 const f=praesensPersons(verb);const third=spokenSubject(verb);
 return [{pronoun:'ich',form:f.ich,spoken:'ich '+f.ich},{pronoun:'du',form:f.du,spoken:'du '+f.du},{pronoun:'er/sie/es',form:f.er,spoken:third+' '+f.er},
  {pronoun:'wir',form:f.wir,spoken:'wir '+f.wir},{pronoun:'ihr',form:f.ihr,spoken:'ihr '+f.ihr},{pronoun:'sie/Sie',form:f.wir,spoken:'sie '+f.wir}];
}
/** What the speaker button of a learning card reads: the infinitive, or er/es with the Präsens or Perfekt. */
export function learnSpeech(verb:Verb,stage:'meaning'|'praesens'|'perfekt'){
 const subject=spokenSubject(verb);
 return stage==='praesens'?subject+' '+verb.praesens:stage==='perfekt'?subject+' '+verb.perfekt:verb.infinitive;
}
/** Every German text the Fiil Atölyesi cards read aloud. The voice list renders a natural clip for each,
 * so they play on every phone (the device voice is only the fallback). */
export function workshopSpeechTexts():string[]{
 const texts=new Set<string>();
 for(const verb of verbs){
  for(const stage of ['meaning','praesens','perfekt'] as const)texts.add(learnSpeech(verb,stage));
  for(const row of conjugationRows(verb))texts.add(row.spoken);
  for(const tense of ['praesens','perfekt'] as const)for(const row of personSentences(verb,tense))texts.add(row.text);
 }
 return [...texts];
}
