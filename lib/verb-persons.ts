import {verbs,praesensPersons,spokenSubject,type Verb} from './verb-course';
import {verbPrefix} from './verb-logic';
import examples from './verb-examples.json';

/**
 * Example sentences for every person (ich, du, er, sie, es, wir, ihr, sie, Sie), shown after an
 * answer: Präsens after the meaning questions, Perfekt after the Perfekt questions.
 * Every person has its own short A1 sentence (statements, questions, negations, time words first),
 * kept in verb-examples.json; the meanings in the helper languages are in verb-examples.<language>.json
 * and are loaded only for the language the learner reads (verb-example-meanings.ts).
 * gefallen and leid|tun are said with the person in the dative (Die Stadt gefällt mir …),
 * gelten with für + accusative (Das Ticket gilt für mich …).
 */
export type PersonKey='ich'|'du'|'er'|'sie'|'es'|'wir'|'ihr'|'sie-plural'|'Sie';
export const personKeys:readonly PersonKey[]=['ich','du','er','sie','es','wir','ihr','sie-plural','Sie'];
export type PersonTense='praesens'|'perfekt';
type ExampleSet=readonly [praesens:readonly string[],perfekt:readonly string[]];
const exampleSets=examples as unknown as Record<string,ExampleSet>;
/** The person as an object instead of the subject: gefallen, leid|tun (dative), gelten (für + accusative). */
const objectModes:Record<string,'dative'|'fuer'>={gefallen:'dative',leidtun:'dative',gelten:'fuer'};
const datives:Record<PersonKey,readonly string[]>={ich:['mir'],du:['dir'],er:['ihm'],sie:['ihr'],es:['ihm','dem'],wir:['uns'],ihr:['euch'],'sie-plural':['ihnen'],Sie:['Ihnen']};
const accusatives:Record<PersonKey,readonly string[]>={ich:['mich'],du:['dich'],er:['ihn'],sie:['sie'],es:['es','das'],wir:['uns'],ihr:['euch'],'sie-plural':['sie'],Sie:['Sie']};
/** Which form of the verb a person takes: er/sie/es share one, wir/sie/Sie share one. */
const formOf:Record<PersonKey,'ich'|'du'|'er'|'wir'|'ihr'>={ich:'ich',du:'du',er:'er',sie:'er',es:'er',wir:'wir',ihr:'ihr','sie-plural':'wir',Sie:'wir'};
const helpers={hat:{ich:'habe',du:'hast',er:'hat',wir:'haben',ihr:'habt'},ist:{ich:'bin',du:'bist',er:'ist',wir:'sind',ihr:'seid'}} as const;
/** The finite verb of the object verbs: it agrees with the thing (gefällt/gefallen), not with the person. */
const objectFinite:Record<string,readonly string[]>={gefallen:['gefällt','gefallen'],leidtun:['tut','tun'],gelten:['gilt','gelten']};
/** The label of the row: the pronoun as the learner says it (sie-plural shows as "sie"). */
export const personLabel=(key:PersonKey)=>key==='sie-plural'?'sie':key;
/** plain text, the finite verb or helper (verb), the prefix or Partizip at the end (end), or the person as an object (person). */
export type SentencePart={text:string;role:'plain'|'verb'|'end'|'person'};
/** One sentence: its words (joined with spaces, then the mark . ? !), the whole text, and its place in the meaning files. */
export type PersonSentence={person:PersonKey;parts:SentencePart[];mark:string;text:string;index:number};
/** Whether the person is the subject (most verbs) or an object (gefallen, leid|tun: dative; gelten: für + accusative). */
export function personMode(verb:Verb):'subject'|'dative'|'fuer'{return objectModes[verb.id]??'subject';}
const lower=(word:string)=>word.toLocaleLowerCase('de');
/** Marks the verb, the end (prefix or Partizip) and, for the object verbs, the person in a written sentence. */
function sentenceParts(verb:Verb,person:PersonKey,tense:PersonTense,sentence:string):{parts:SentencePart[];mark:string}{
 const mark=/[.?!]$/.test(sentence)?sentence.slice(-1):'';
 const words=sentence.slice(0,mark?-1:undefined).trim().split(/\s+/);
 const roles:SentencePart['role'][]=words.map(()=>'plain');
 const markFirst=(role:SentencePart['role'],matches:(word:string,i:number)=>boolean)=>{const at=words.findIndex((word,i)=>roles[i]==='plain'&&matches(word,i));if(at>=0)roles[at]=role;return at;};
 const last=words.length-1;
 const mode=personMode(verb);
 if(mode==='subject'){
  const form=formOf[person];
  if(tense==='praesens'){
   const [finite,prefix]=praesensPersons(verb)[form].split(' ');
   if(prefix&&lower(words[last])===lower(prefix))roles[last]='end';
   markFirst('verb',word=>lower(word)===lower(finite));
  }else{
   if(lower(words[last])===lower(verb.participle))roles[last]='end';
   const aux:readonly string[]=[helpers[verb.aux][form],...(verb.alsoIst?[helpers.ist[form]]:[])];
   markFirst('verb',word=>aux.includes(lower(word)));
  }
 }else{
  if(tense==='praesens'){const prefix=verbPrefix(verb);if(prefix&&lower(words[last])===prefix)roles[last]='end';markFirst('verb',word=>objectFinite[verb.id].includes(lower(word)));}
  else{if(lower(words[last])===lower(verb.participle))roles[last]='end';markFirst('verb',word=>['hat','haben'].includes(lower(word)));}
  const objects=(mode==='dative'?datives:accusatives)[person];
  const at=mode==='dative'?markFirst('person',word=>objects.includes(word)):markFirst('person',(word,i)=>i>0&&lower(words[i-1])==='für'&&objects.includes(word));
  // "dem Kind" / "für das Kind": the noun belongs to the person too.
  if(at>=0&&(words[at]==='dem'||words[at]==='das')&&roles[at+1]==='plain')roles[at+1]='person';
 }
 const parts:SentencePart[]=[];
 words.forEach((word,i)=>{const previous=parts[parts.length-1];if(previous&&previous.role===roles[i])previous.text+=' '+word;else parts.push({text:word,role:roles[i]});});
 return {parts,mark};
}
/** Nine sentences, one for each person, in the order ich, du, er, sie, es, wir, ihr, sie, Sie; each one says something different. */
export function personSentences(verb:Verb,tense:PersonTense):PersonSentence[]{
 const set=exampleSets[verb.id];if(!set)return [];
 const list=set[tense==='praesens'?0:1];
 return personKeys.map((person,index)=>{const text=list[index];return {person,index,text,...sentenceParts(verb,person,tense,text)};});
}
export const personSentenceVerbs=Object.keys(exampleSets);
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
