/**
 * Lektion 1 „Willkommen!“, Teil B – Ich spreche ein bisschen Deutsch. (the learner's lesson page, 25 October 2026),
 * ported to the site like Teil A (lib/willkommen-course.ts): the cover, ten short teaching steps, eleven exercises,
 * a 12-question test and the end. Texts for the learner are Turkish; the German is read with the site voices, each
 * person with their own voice (`speakers` in lib/willkommen-course.ts). Step ids never change: saved scores are
 * keyed by them (their own store, lib/willkommen-progress.ts).
 */
import type {GapLine,Phrase,SayItem,Step,StepGroup} from './willkommen-course';

/** Pictures of Teil B (public/toon/lektion1, from the learner's page; cut-outs on white). */
export const willkommenBPictures={
 cover:{src:'/toon/lektion1/kapak-b.webp',width:960,height:540},
 alphabet:{src:'/toon/lektion1/paul-alfabe.webp',width:960,height:540},
 sie:{src:'/toon/lektion1/sie-sahne.webp',width:960,height:640},
 du:{src:'/toon/lektion1/du-sahne.webp',width:960,height:720},
} as const;

/* ---------- letters ---------- */
/** The alphabet: the letter, how it sounds for a Turkish speaker, and what the site voice reads — the German letter
 * name written so a voice reads the name, not a word (Jot, Vau, Zett, a long vowel as Ah, Eh …). */
export type Letter=readonly [letter:string,hint:string,say:string];
export const alphabet:Letter[]=[
 ['A','a','Ah'],['B','be','Beh'],['C','tse','Zeh'],['D','de','Deh'],['E','e','Eh'],['F','ef','Eff'],['G','ge','Geh'],['H','ha','Hah'],['I','i','Ih'],['J','yot','Jot'],
 ['K','ka','Kah'],['L','el','Ell'],['M','em','Emm'],['N','en','Enn'],['O','o','Oh'],['P','pe','Peh'],['Q','ku','Kuh'],['R','er','Err'],['S','es','Ess'],['T','te','Teh'],
 ['U','u','Uh'],['V','fau','Vau'],['W','ve','Weh'],['X','iks','Ix'],['Y','üpsilon','Ypsilon'],['Z','tset','Zett'],['Ä','a-umlaut (e)','Äh'],['Ö','o-umlaut','Öh'],['Ü','u-umlaut','Üh'],['ß','estset','Eszett'],
];
/** Letters that sound different from Turkish (a blue frame on the alphabet). */
export const hardLetters=['C','E','I','J','V','W','Y','Z','ß'];
const letterNames=new Map(alphabet.map(([letter,,say])=>[letter,say]));
/** The name the voice reads for one letter (ß stays ß; anything else is upper-cased). */
export const letterSay=(letter:string)=>letterNames.get(letter==='ß'?'ß':letter.toUpperCase())??'';
/** A word letter by letter, as one text for the site voices: "Enn, Ih, Kah, Oh, Ess". */
export const spelledText=(word:string)=>[...word.replace(/[^A-Za-zÄÖÜäöüß]/g,'')].map(letterSay).filter(Boolean).join(', ');
/** A word letter by letter, one clip per letter (for names the learner types). */
export const spellItems=(word:string):SayItem[]=>[...word.replace(/[^A-Za-zÄÖÜäöüß]/g,'')].map(letterSay).filter(Boolean).map(text=>({text,slow:true}));

/* ---------- teaching steps ---------- */
/** Step 1 · Welche Sprachen sprechen Sie? */
export const languagePhrases:Phrase[]=[
 ['Welche Sprachen sprechen Sie?','Hangi dilleri konuşuyorsunuz?'],
 ['Ich spreche Türkisch und ein bisschen Deutsch.','Türkçe ve biraz Almanca konuşuyorum.'],
 ['Ich spreche Arabisch, Englisch und ein bisschen Deutsch.','Arapça, İngilizce ve biraz Almanca konuşuyorum.'],
];
export const languageWords:Phrase[]=[['welche','hangi'],['die Sprache','dil'],['sprechen','konuşmak'],['ein bisschen','biraz']];
/** Step 2 · languages (tap to hear). */
export const languages:Phrase[]=[
 ['Deutsch','Almanca'],['Englisch','İngilizce'],['Türkisch','Türkçe'],['Arabisch','Arapça'],['Französisch','Fransızca'],['Spanisch','İspanyolca'],
 ['Italienisch','İtalyanca'],['Portugiesisch','Portekizce'],['Polnisch','Lehçe'],['Russisch','Rusça'],['Ukrainisch','Ukraynaca'],['Griechisch','Yunanca'],
 ['Bulgarisch','Bulgarca'],['Rumänisch','Romence'],['Serbisch','Sırpça'],['Kroatisch','Hırvatça'],['Niederländisch','Felemenkçe'],['Farsi (Persisch)','Farsça'],
 ['Dari','Darice'],['Paschtu','Peştuca'],['Kurdisch','Kürtçe'],['Urdu','Urduca'],['Hindi','Hintçe'],['Chinesisch','Çince'],
 ['Vietnamesisch','Vietnamca'],['Thai','Tayca'],['Japanisch','Japonca'],['Swahili','Svahili'],['Somali','Somalice'],['Tigrinya','Tigrinya'],['Amharisch','Amharca'],
];
export const languageSay=(de:string)=>de.replace(/ \(.*\)/,'');
/** Step 3 · Sie or du: the same question, formal and informal. */
export const sieDu:readonly [sie:string,du:string][]=[
 ['Wie heißen Sie?','Wie heißt du?'],['Woher kommen Sie?','Woher kommst du?'],['Welche Sprachen sprechen Sie?','Welche Sprachen sprichst du?'],['Und Sie?','Und du?'],
];
/** A dialogue line: who says it (a key of `speakers`), the German, the Turkish and, when it differs, what is read. */
export type Line={who:string;de:string;tr:string;say?:string};
export const lineSay=(line:Line):SayItem=>({text:line.say??line.de,who:line.who});
/** Step 4 · formal dialogue (Sabine and Omar at the till). */
export const dialogueSie:Line[]=[
 {who:'sabine',de:'Guten Tag, Herr Nasser. Welche Sprachen sprechen Sie?',tr:'İyi günler, Bay Nasser. Hangi dilleri konuşuyorsunuz?'},
 {who:'omar',de:'Ich spreche Arabisch, Englisch und ein bisschen Deutsch. Und Sie, Frau Krüger?',tr:'Arapça, İngilizce ve biraz Almanca konuşuyorum. Ya siz, Bayan Krüger?'},
 {who:'sabine',de:'Ich spreche Deutsch und ein bisschen Englisch.',tr:'Almanca ve biraz İngilizce konuşuyorum.'},
 {who:'omar',de:'Interessant!',tr:'İlginç!'},
];
/** Step 5 · informal dialogue (Tomasz and Aisha in the course break). */
export const dialogueDu:Line[]=[
 {who:'tomasz',de:'Hallo! Ich bin neu hier. Ich heiße Tomasz. Wie heißt du?',tr:'Merhaba! Burada yeniyim. Adım Tomasz. Senin adın ne?'},
 {who:'aisha',de:'Hallo, Tomasz! Ich bin Aisha. Woher kommst du?',tr:'Merhaba Tomasz! Ben Aisha. Nereden geliyorsun?'},
 {who:'tomasz',de:'Aus Polen. Und du?',tr:'Polonya’dan. Ya sen?'},
 {who:'aisha',de:'Ich komme aus Kenia. Welche Sprachen sprichst du?',tr:'Kenya’dan geliyorum. Hangi dilleri konuşuyorsun?'},
 {who:'tomasz',de:'Polnisch, Englisch und ein bisschen Deutsch. Und du?',tr:'Lehçe, İngilizce ve biraz Almanca. Ya sen?'},
 {who:'aisha',de:'Swahili, Englisch und ein bisschen Deutsch.',tr:'Svahili, İngilizce ve biraz Almanca.'},
 {who:'tomasz',de:'Interessant!',tr:'İlginç!'},
];
/** Step 6 · ich / du / Sie: the ending in ** (read as the whole row). */
export const verbTable:{verb:string;ich:string;du:string;sie:string;say:string}[]=[
 {verb:'kommen',ich:'komm**e**',du:'komm**st**',sie:'komm**en**',say:'ich komme, du kommst, Sie kommen'},
 {verb:'heißen',ich:'heiß**e**',du:'heiß**t**',sie:'heiß**en**',say:'ich heiße, du heißt, Sie heißen'},
 {verb:'sprechen',ich:'sprech**e**',du:'spr**i**ch**st**',sie:'sprech**en**',say:'ich spreche, du sprichst, Sie sprechen'},
 {verb:'sein',ich:'bin',du:'bist',sie:'sind',say:'ich bin, du bist, Sie sind'},
];
/** Step 8 · asking and spelling. */
export const spellPhrases:readonly [de:string,tr:string,say:string][]=[
 ['Wie bitte?','Efendim? / Pardon, tekrar eder misin?','Wie bitte?'],
 ['Wie schreibt man das?','Bu nasıl yazılır?','Wie schreibt man das?'],
 ['Ich buchstabiere: …','Harf harf söylüyorum: …','Ich buchstabiere'],
 ['Buchstabieren Sie bitte Ihren Namen.','Lütfen adınızı harf harf söyleyin.','Buchstabieren Sie bitte Ihren Namen.'],
 ['Danke! — Bitte!','Teşekkürler! — Rica ederim!','Danke! Bitte!'],
];
export const dialogueSpell:Line[]=[
 {who:'yasemin',de:'Wie heißt du?',tr:'Adın ne?'},
 {who:'nikos',de:'Ich heiße Nikos Papadakis.',tr:'Adım Nikos Papadakis.'},
 {who:'yasemin',de:'Wie bitte? Wie schreibt man das?',tr:'Efendim? Bu nasıl yazılır?'},
 {who:'nikos',de:'Ich buchstabiere: N-I-K-O-S, P-A-P-A-D-A-K-I-S.',tr:'Harf harf söylüyorum: N-I-K-O-S, P-A-P-A-D-A-K-I-S.',say:'Ich buchstabiere: '+spelledText('Nikos')+'. '+spelledText('Papadakis')+'.'},
 {who:'yasemin',de:'Danke! Woher kommst du?',tr:'Teşekkürler! Nereden geliyorsun?'},
 {who:'nikos',de:'Aus Griechenland. Ich spreche Griechisch, Englisch und ein bisschen Deutsch.',tr:'Yunanistan’dan. Yunanca, İngilizce ve biraz Almanca konuşuyorum.'},
];
/** Step 9 · a profile card and checking it. */
export type Profile={who:string;name:string;land:string;languages:string};
export const nikosCard:Profile={who:'nikos',name:'Nikos Papadakis',land:'Griechenland',languages:'Griechisch, Englisch, ein bisschen Deutsch'};
export const ramiCard:Profile={who:'rami',name:'Rami Khalil',land:'Libanon',languages:'Arabisch, Französisch, ein bisschen Deutsch'};
export const dialogueCheck:Line[]=[
 {who:'yasemin',de:'Du heißt Nikos. Du kommst aus Griechenland. Du sprichst Griechisch.',tr:'Adın Nikos. Yunanistan’dan geliyorsun. Yunanca konuşuyorsun.'},
 {who:'nikos',de:'Ja, richtig!',tr:'Evet, doğru!'},
 {who:'yasemin',de:'Und du sprichst Arabisch?',tr:'Ve Arapça konuşuyorsun?'},
 {who:'nikos',de:'Nein, ich spreche Englisch.',tr:'Hayır, İngilizce konuşuyorum.'},
];
export const yesNoWords:Phrase[]=[['ja','evet'],['nein','hayır'],['richtig','doğru']];
/** W-questions fall at the end. */
export const intonation=['Wie heißt du?','Woher kommst du?'];
/** Step 10 · word list. */
export const wordsB:Phrase[]=[
 ['die Sprache','dil'],['sprechen','konuşmak'],['Welche Sprachen …?','Hangi dilleri …?'],['ein bisschen','biraz'],['Deutsch','Almanca'],
 ['du','sen'],['Hallo!','Merhaba!'],['der Name','ad, isim'],['Mein Name ist …','Benim adım …'],['neu','yeni'],['hier','burada'],
 ['Ich bin neu hier.','Burada yeniyim.'],['das Land','ülke'],['schreiben','yazmak'],['buchstabieren','harf harf söylemek'],
 ['Wie bitte?','Efendim? / Pardon?'],['Wie schreibt man das?','Bu nasıl yazılır?'],['danke','teşekkürler'],['bitte','rica ederim / lütfen'],
 ['ja','evet'],['nein','hayır'],['richtig','doğru'],['interessant','ilginç'],
];
/** What is read for a word of the list ("Welche Sprachen …?" without the dots). */
export const wordSay=(de:string)=>de.replace(/\s*…\s*/g,' ').replace(/\s+([?!.])/g,'$1').trim();

/* ---------- exercises ---------- */
/** Exercise 1 · country → language (matching; the pair is read as two sentences). */
export const landLanguage:readonly [land:string,language:string,say:string][]=[
 ['Türkei','Türkisch','Ich komme aus der Türkei. Ich spreche Türkisch.'],
 ['Polen','Polnisch','Ich komme aus Polen. Ich spreche Polnisch.'],
 ['Griechenland','Griechisch','Ich komme aus Griechenland. Ich spreche Griechisch.'],
 ['Frankreich','Französisch','Ich komme aus Frankreich. Ich spreche Französisch.'],
 ['Deutschland','Deutsch','Ich komme aus Deutschland. Ich spreche Deutsch.'],
 ['Iran','Farsi','Ich komme aus dem Iran. Ich spreche Farsi.'],
];
/** Exercise 2 · Sie or du? (the verb shows it: -st → du, -en → Sie). */
export const sieOrDu:{before:string;after:string;answer:'du'|'Sie'}[]=[
 {before:'Wie heißt',after:'?',answer:'du'},{before:'Woher kommen',after:'?',answer:'Sie'},{before:'Welche Sprachen sprichst',after:'?',answer:'du'},
 {before:'Wie heißen',after:', Frau Krüger?',answer:'Sie'},{before:'Woher kommst',after:', Tomasz?',answer:'du'},{before:'Welche Sprachen sprechen',after:', Herr Nasser?',answer:'Sie'},
 {before:'Und',after:'? Ich bin Aisha.',answer:'du'},{before:'Und',after:'? Ich komme aus Deutschland, Frau Weiß.',answer:'Sie'},
];
export const sieOrDuSay=(item:{before:string;after:string;answer:string})=>item.before+' '+item.answer+item.after;
/** Exercise 3 · verb endings (the gap is part of a word). */
export const endingLines:GapLine[]=[
 {text:'Wie heiß___ du?',answers:[['t']]},{text:'Ich komm___ aus Polen.',answers:[['e']]},{text:'Welche Sprachen sprich___ du?',answers:[['st']]},
 {text:'Woher komm___ Sie?',answers:[['en']]},{text:'Ich ___ neu hier.',answers:[['bin']]},{text:'Du ___ Aisha, richtig?',answers:[['bist']]},
 {text:'Ich sprech___ Türkisch.',answers:[['e']]},{text:'Sie heiß___ Frau Krüger.',answers:[['en']]},{text:'Woher komm___ du, Nikos?',answers:[['st']]},
 {text:'Wie heiß___ Sie?',answers:[['en']]},
];
export const endingSay=endingLines.map(line=>line.text.replace('___',line.answers[0][0][0]));
/** Exercise 4 · listen: which languages? (every right box must be ticked). */
export type HearItem={key:string;name:string;text:string;options:string[];answers:number[]};
export const hearItems:HearItem[]=[
 {key:'yasemin',name:'Yasemin Arslan',text:'Hallo, ich bin Yasemin. Ich spreche Türkisch, Englisch und ein bisschen Deutsch.',options:['Türkisch','Englisch','Arabisch','ein bisschen Deutsch'],answers:[0,1,3]},
 {key:'omar',name:'Omar Nasser',text:'Ich heiße Omar Nasser. Ich spreche Arabisch und ein bisschen Deutsch.',options:['Arabisch','Französisch','ein bisschen Deutsch'],answers:[0,2]},
 {key:'mei',name:'Mei Suwan',text:'Guten Tag, ich bin Mei. Ich spreche Thai, Englisch und ein bisschen Deutsch.',options:['Chinesisch','Thai','Englisch','ein bisschen Deutsch'],answers:[1,2,3]},
];
/** Exercise 5 · hear the letters, write the name. */
export const spellNames=['Fuchs','Jonas','Weiß','Yasemin','Vogt'];
/** Exercise 6 · which letter? */
export const letterQuestions:{answer:string;options:string[]}[]=[
 {answer:'J',options:['J','Y','I']},{answer:'V',options:['V','W','F']},{answer:'Z',options:['Z','C','S']},{answer:'E',options:['E','I','A']},
 {answer:'Y',options:['Y','J','Ü']},{answer:'G',options:['G','K','C']},{answer:'W',options:['W','V','U']},{answer:'Ä',options:['Ä','A','E']},
];
/** Exercise 7 · the word box (a = Aisha, b = Tomasz). */
export const boxWordsB=['neu','Name','bitte','schreibt','buchstabiere','Danke'];
export const boxLinesB:GapLine[]=[
 {who:'a',text:'Hallo! Ich bin ___ hier. Mein ___ ist Aisha Kamau.',answers:[['neu'],['Name']]},
 {who:'b',text:'Wie ___? Wie ___ man das?',answers:[['bitte'],['schreibt']]},
 {who:'a',text:'Ich ___: K-A-M-A-U.',answers:[['buchstabiere']]},
 {who:'b',text:'___!',answers:[['Danke']]},
 {who:'a',text:'Bitte!',answers:[]},
];
export const boxSayB=['Hallo! Ich bin neu hier. Mein Name ist Aisha Kamau.','Wie bitte? Wie schreibt man das?','Ich buchstabiere: '+spelledText('Kamau')+'.','Danke!','Bitte!'];
/** Exercise 8 · Sie ↔ du: turn the question round. */
export const turnLines:GapLine[]=[
 {text:'Wie heißen Sie? → du: ___',answers:[['Wie heißt du?']]},
 {text:'Woher kommen Sie? → du: ___',answers:[['Woher kommst du?']]},
 {text:'Welche Sprachen sprechen Sie? → du: ___',answers:[['Welche Sprachen sprichst du?']]},
 {text:'Wie heißt du? → Sie: ___',answers:[['Wie heißen Sie?']]},
 {text:'Woher kommst du? → Sie: ___',answers:[['Woher kommen Sie?']]},
];
export const turnSay=turnLines.map(line=>line.answers[0][0]);
/** Exercise 9 · from the card to sentences (Rami). */
export const cardLines:GapLine[]=[
 {text:'1. ___',answers:[['Ich heiße Rami Khalil.','Ich bin Rami Khalil.','Mein Name ist Rami Khalil.']]},
 {text:'2. ___',answers:[['Ich komme aus dem Libanon.']]},
 {text:'3. ___',answers:[['Ich spreche Arabisch, Französisch und ein bisschen Deutsch.','Ich spreche Arabisch, Französisch und ein bisschen Deutsch']]},
];
export const cardSay=['Ich heiße Rami Khalil.','Ich komme aus dem Libanon.','Ich spreche Arabisch, Französisch und ein bisschen Deutsch.'];
/** Exercise 10 · right or not? Yasemin says it, Nikos answers. */
export const checkItems:{statement:string;answer:'ja'|'nein';reply:string}[]=[
 {statement:'Du heißt Nikos Papadakis.',answer:'ja',reply:'Ja, richtig!'},
 {statement:'Du kommst aus Bulgarien.',answer:'nein',reply:'Nein, ich komme aus Griechenland.'},
 {statement:'Du sprichst Griechisch.',answer:'ja',reply:'Ja, richtig!'},
 {statement:'Du sprichst Arabisch.',answer:'nein',reply:'Nein, ich spreche Englisch.'},
 {statement:'Du sprichst ein bisschen Deutsch.',answer:'ja',reply:'Ja, richtig!'},
];
/** Exercise 11 · now you (not scored). */
export const ownPromptsB:{question:string;pattern:RegExp;placeholder:string}[]=[
 {question:'Welche Sprachen sprichst du?',pattern:/^ich spreche \S+/,placeholder:'Ich spreche … und ein bisschen Deutsch.'},
 {question:'Wie bitte? Wie schreibt man deinen Namen?',pattern:/^ich buchstabiere \S/,placeholder:'Ich buchstabiere: A-B-C …'},
];
/** The test: question, options, right answer, and what is read after the answer (nothing for a Turkish answer). */
export type TestQuestionB=readonly [question:string,options:string[],answer:string,say:string];
export const testQuestionsB:TestQuestionB[]=[
 ['Welche Sprachen ___ Sie?',['sprechen','sprichst','spreche'],'sprechen','Welche Sprachen sprechen Sie?'],
 ['Woher ___ du?',['kommst','kommen','komme'],'kommst','Woher kommst du?'],
 ['Ich ___ neu hier.',['bin','bist','sind'],'bin','Ich bin neu hier.'],
 ['Wie ___ du?',['heißt','heißen','heiße'],'heißt','Wie heißt du?'],
 ['Polen → dil adı?',['Polnisch','Polisch','Polen'],'Polnisch','Polnisch'],
 ['„Wie bitte?“ ne demek?',['Efendim? / Pardon?','Nasıl yazılır?','Teşekkürler'],'Efendim? / Pardon?',''],
 ['„Du sprichst Türkisch.“ — doğruysa cevap:',['Ja, richtig!','Nein, danke.','Wie bitte?'],'Ja, richtig!','Ja, richtig!'],
 ['„Danke!“ — cevap:',['Bitte!','Hallo!','Interessant!'],'Bitte!','Bitte!'],
 ['„J“ harfi Almanca nasıl okunur?',['yot','ce','ji'],'yot','Jot'],
 ['„ein bisschen“ ne demek?',['biraz','çok','hiç'],'biraz',''],
 ['Resmî (siz) hangisi?',['Welche Sprachen sprechen Sie?','Welche Sprachen sprichst du?','Und du?'],'Welche Sprachen sprechen Sie?','Welche Sprachen sprechen Sie?'],
 ['„Wie schreibt man das?“ cevabı:',['Ich buchstabiere: …','Ich komme aus …','Ich spreche …'],'Ich buchstabiere: …','Ich buchstabiere'],
];

/** The steps in order (ids are stable; the title is shown in the top bar). */
export const stepsB:Step[]=[
 {id:'kapak',title:'Kapak',kind:'cover'},
 {id:'sprachen',title:'Hangi dilleri?',kind:'teach'},
 {id:'diller',title:'Diller',kind:'teach'},
 {id:'sie-du',title:'Sie mi, du mu?',kind:'teach'},
 {id:'diyalog-sie',title:'Diyalog: Sie',kind:'teach'},
 {id:'diyalog-du',title:'Diyalog: du',kind:'teach'},
 {id:'fiiller',title:'Fiil çekimi',kind:'teach'},
 {id:'alfabe',title:'Alfabe',kind:'teach'},
 {id:'buchstabieren',title:'Harf harf söyleme',kind:'teach'},
 {id:'steckbrief',title:'Kimlik kartı',kind:'teach'},
 {id:'kelimeler',title:'Kelime listesi',kind:'teach'},
 {id:'land-sprache',title:'Alıştırma 1',kind:'exercise'},
 {id:'sie-oder-du',title:'Alıştırma 2',kind:'exercise'},
 {id:'endungen',title:'Alıştırma 3',kind:'exercise'},
 {id:'hoeren',title:'Alıştırma 4',kind:'exercise'},
 {id:'namen',title:'Alıştırma 5',kind:'exercise'},
 {id:'buchstabe',title:'Alıştırma 6',kind:'exercise'},
 {id:'kutu',title:'Alıştırma 7',kind:'exercise'},
 {id:'umformen',title:'Alıştırma 8',kind:'exercise'},
 {id:'karte',title:'Alıştırma 9',kind:'exercise'},
 {id:'richtig',title:'Alıştırma 10',kind:'exercise'},
 {id:'sen',title:'Alıştırma 11',kind:'exercise'},
 {id:'test',title:'Test',kind:'test'},
 {id:'bitti',title:'Bitti',kind:'end'},
];
export const stepIndexB=(id:string)=>stepsB.findIndex(step=>step.id===id);
/** Exercises that are scored (Alıştırma 11 is the learner's own sentences: no score). */
export const scoredExercisesB:{id:string;total:number}[]=[
 {id:'land-sprache',total:landLanguage.length},
 {id:'sie-oder-du',total:sieOrDu.length},
 {id:'endungen',total:endingLines.length},
 {id:'hoeren',total:hearItems.length},
 {id:'namen',total:spellNames.length},
 {id:'buchstabe',total:letterQuestions.length},
 {id:'kutu',total:boxLinesB.reduce((n,line)=>n+line.answers.length,0)},
 {id:'umformen',total:turnLines.length},
 {id:'karte',total:cardLines.length},
 {id:'richtig',total:checkItems.length},
 {id:'test',total:testQuestionsB.length},
];
export const stepGroupsB:StepGroup[]=[
 {id:'konu',label:'Konu anlatımı',ids:stepsB.filter(step=>step.kind==='teach').map(step=>step.id)},
 {id:'alistirmalar',label:'Alıştırmalar',ids:stepsB.filter(step=>step.kind==='exercise').map(step=>step.id)},
 {id:'test',label:'Test',ids:['test']},
];

/** Every German text Teil B speaks (rendered as site voices by scripts/voices). */
export function willkommenBSpeechTexts():string[]{
 const out=new Set<string>();const add=(text:string)=>{if(text.trim())out.add(text.trim());};
 for(const [de] of [...languagePhrases,...languageWords,...yesNoWords])add(de);
 for(const [de] of languages)add(languageSay(de));
 for(const [sie,du] of sieDu){add(sie);add(du);}
 for(const line of [...dialogueSie,...dialogueDu,...dialogueSpell,...dialogueCheck])add(line.say??line.de);
 verbTable.forEach(row=>add(row.say));
 alphabet.forEach(([,,say])=>add(say));
 spellPhrases.forEach(([,,say])=>add(say));
 intonation.forEach(add);
 wordsB.forEach(([de])=>add(wordSay(de)));
 landLanguage.forEach(([,,say])=>add(say));
 sieOrDu.forEach(item=>add(sieOrDuSay(item)));
 endingSay.forEach(add);hearItems.forEach(item=>add(item.text));
 boxSayB.forEach(add);turnSay.forEach(add);cardSay.forEach(add);
 checkItems.forEach(item=>{add(item.statement);add(item.reply);});
 ownPromptsB.forEach(prompt=>add(prompt.question));
 testQuestionsB.forEach(question=>add(question[3]));
 return [...out];
}
