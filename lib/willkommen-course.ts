/**
 * Lektion 1 „Willkommen!“, Teil A – Ich heiße … (A1.1): the learner's own lesson page (an artifact, 24 October
 * 2026), ported to the site. Ten short teaching steps, nine exercises and a test, in the order of the learner's page.
 * Texts for the learner are Turkish (the site's main audience); the German is read aloud with the site voices.
 * Step and exercise ids never change (saved scores are keyed by them).
 */
export const WILLKOMMEN_PATH='/a1-1/willkommen';
export const WILLKOMMEN_UNIT='book-01';
/** Pictures of the lesson (public/toon/lektion1, from the learner's page). */
export const willkommenPictures={
 cover:{src:'/toon/lektion1/kapak.webp',width:960,height:540},
 map:{src:'/toon/lektion1/paul-harita.webp',width:960,height:540},
} as const;
export const portraitSrc=(key:string)=>'/toon/lektion1/'+key+'.webp';

export type Phrase=readonly [de:string,tr:string];
/** Step 1 · Selamlaşma */
export const greetings:Phrase[]=[['Guten Tag!','İyi günler! / Merhaba!'],['Herzlich willkommen!','Hoş geldiniz!'],['Danke!','Teşekkürler!']];
/** Step 2 · Adınız ne? */
export const namePhrases:Phrase[]=[['Wie heißen Sie?','Adınız ne?'],['Ich heiße Sabine Krüger.','Benim adım Sabine Krüger.'],['Ich bin Sabine Krüger.','Ben Sabine Krüger.'],['Und Sie?','Ya siz? (soruyu geri sormak için)']];
/** Step 3 · Nereden geliyorsunuz? */
export const originPhrases:Phrase[]=[['Woher kommen Sie?','Nereden geliyorsunuz?'],['Ich komme aus Deutschland.','Almanya’dan geliyorum.'],['Woher kommen Sie, Herr Nasser?','Nereden geliyorsunuz, Bay Nasser?'],['Ich komme aus Deutschland, aus Hamburg.','Almanya’dan, Hamburg’dan geliyorum.']];

export type Country=readonly [flag:string,de:string,tr:string,aus:string];
/** Step 4 · countries without an article (aus + country). */
export const countries:Country[]=[
 ['🇩🇪','Deutschland','Almanya','aus Deutschland'],['🇦🇹','Österreich','Avusturya','aus Österreich'],['🇵🇱','Polen','Polonya','aus Polen'],
 ['🇫🇷','Frankreich','Fransa','aus Frankreich'],['🇮🇹','Italien','İtalya','aus Italien'],['🇪🇸','Spanien','İspanya','aus Spanien'],
 ['🏴󠁧󠁢󠁥󠁮󠁧󠁿','England','İngiltere','aus England'],['🇬🇷','Griechenland','Yunanistan','aus Griechenland'],['🇧🇬','Bulgarien','Bulgaristan','aus Bulgarien'],
 ['🇷🇴','Rumänien','Romanya','aus Rumänien'],['🇷🇸','Serbien','Sırbistan','aus Serbien'],['🇭🇷','Kroatien','Hırvatistan','aus Kroatien'],
 ['🇷🇺','Russland','Rusya','aus Russland'],['🇸🇾','Syrien','Suriye','aus Syrien'],['🇦🇫','Afghanistan','Afganistan','aus Afghanistan'],
 ['🇪🇬','Ägypten','Mısır','aus Ägypten'],['🇲🇦','Marokko','Fas','aus Marokko'],['🇹🇳','Tunesien','Tunus','aus Tunesien'],
 ['🇳🇬','Nigeria','Nijerya','aus Nigeria'],['🇪🇷','Eritrea','Eritre','aus Eritrea'],['🇸🇴','Somalia','Somali','aus Somalia'],
 ['🇰🇪','Kenia','Kenya','aus Kenia'],['🇮🇳','Indien','Hindistan','aus Indien'],['🇵🇰','Pakistan','Pakistan','aus Pakistan'],
 ['🇨🇳','China','Çin','aus China'],['🇻🇳','Vietnam','Vietnam','aus Vietnam'],['🇹🇭','Thailand','Tayland','aus Thailand'],['🇧🇷','Brasilien','Brezilya','aus Brasilien'],
];
/** Countries with an article (aus der / dem / den …). */
export const articleCountries:Country[]=[
 ['🇹🇷','die Türkei','Türkiye','aus der Türkei'],['🇨🇭','die Schweiz','İsviçre','aus der Schweiz'],['🇺🇦','die Ukraine','Ukrayna','aus der Ukraine'],
 ['🇮🇶','der Irak','Irak','aus dem Irak'],['🇮🇷','der Iran','İran','aus dem Iran'],['🇱🇧','der Libanon','Lübnan','aus dem Libanon'],
 ['🇾🇪','der Jemen','Yemen','aus dem Jemen'],['🇸🇩','der Sudan','Sudan','aus dem Sudan'],['🇺🇸','die USA','ABD','aus den USA'],['🇳🇱','die Niederlande','Hollanda','aus den Niederlanden'],
];
/** Step 5 · aus + article, read aloud as groups. */
export const articleGroups:{rule:string;examples:string;say:string}[]=[
 {rule:'die → der',examples:'die Türkei → **aus der Türkei** · die Schweiz → **aus der Schweiz** · die Ukraine → **aus der Ukraine**',say:'aus der Türkei, aus der Schweiz, aus der Ukraine'},
 {rule:'der → dem',examples:'der Irak → **aus dem Irak** · der Sudan → **aus dem Sudan** · der Jemen → **aus dem Jemen** · der Iran → **aus dem Iran** · der Libanon → **aus dem Libanon**',say:'aus dem Irak, aus dem Sudan, aus dem Jemen, aus dem Iran, aus dem Libanon'},
 {rule:'die (çoğul) → den',examples:'die USA → **aus den USA** · die Niederlande → **aus den Niederlanden**',say:'aus den USA, aus den Niederlanden'},
];
export const noArticleSay='aus Deutschland, aus Polen, aus Syrien';
/** Step 6 · three verbs: ich / Sie. */
export const verbForms:{verb:string;tr:string;ich:string;sie:string}[]=[
 {verb:'heißen',tr:'adı … olmak',ich:'ich heiße',sie:'Sie heißen'},
 {verb:'kommen',tr:'gelmek',ich:'ich komme',sie:'Sie kommen'},
 {verb:'sein',tr:'olmak',ich:'ich bin',sie:'Sie sind'},
];
/** Step 7 · the dialogue (S = Sabine, O = Omar). */
export type DialogueLine=readonly [who:'S'|'O',de:string,tr:string];
export const dialogue:DialogueLine[]=[
 ['S','Guten Tag. Ich bin Sabine Krüger. Wie heißen Sie?','İyi günler. Ben Sabine Krüger. Adınız ne?'],
 ['O','Guten Tag. Ich heiße Omar Nasser.','İyi günler. Benim adım Omar Nasser.'],
 ['S','Woher kommen Sie, Herr Nasser?','Nereden geliyorsunuz, Bay Nasser?'],
 ['O','Ich komme aus dem Sudan. Und Sie, Frau Krüger?','Sudan’dan geliyorum. Ya siz, Bayan Krüger?'],
 ['S','Ich komme aus Deutschland. Herzlich willkommen!','Almanya’dan geliyorum. Hoş geldiniz!'],
 ['O','Danke!','Teşekkürler!'],
];
/** Step 8 · people and where they come from. */
export type Person={key:string;name:string;land:string;city:string;flag:string};
export const people:Person[]=[
 {key:'sabine',name:'Sabine Krüger',land:'Deutschland',city:'Hamburg',flag:'🇩🇪'},
 {key:'omar',name:'Omar Nasser',land:'dem Sudan',city:'Khartum',flag:'🇸🇩'},
 {key:'yasemin',name:'Yasemin Arslan',land:'der Türkei',city:'Izmir',flag:'🇹🇷'},
 {key:'nikos',name:'Nikos Papadakis',land:'Griechenland',city:'Thessaloniki',flag:'🇬🇷'},
 {key:'aisha',name:'Aisha Kamau',land:'Kenia',city:'Nairobi',flag:'🇰🇪'},
 {key:'tomasz',name:'Tomasz Nowak',land:'Polen',city:'Krakau',flag:'🇵🇱'},
];
export const personSpeech=(p:Person)=>`Ich heiße ${p.name}. Ich komme aus ${p.land}, aus ${p.city}.`;
/** Step 9 · "Guten Tag" in other languages. */
export const greetingsAround:readonly [language:string,greeting:string][]=[
 ['Türkçe','Merhaba! / İyi günler!'],['İngilizce','Hello! / Good day!'],['Fransızca','Bonjour!'],['Arapça','As-salamu alaikum! / Marhaba!'],
 ['İspanyolca','Hola! / Buenos días!'],['Lehçe','Dzień dobry!'],['Yunanca','Kaliméra!'],['Bulgarca','Dobar den!'],['Tayca','Sawatdi!'],
];
/** Step 10 · word list. */
export const words:Phrase[]=[
 ['Guten Tag!','İyi günler! / Merhaba!'],['Herzlich willkommen!','Hoş geldiniz!'],['Danke!','Teşekkürler!'],
 ['wie','nasıl'],['heißen','adı … olmak'],['Sie','siz (resmî)'],['ich','ben'],['ich bin','ben … -im (sein = olmak)'],
 ['Herr','Bay'],['Frau','Bayan'],['und','ve'],['Und Sie?','Ya siz?'],['woher','nereden'],['kommen','gelmek'],['aus','-den / -dan'],
];

/* ---------- exercises ---------- */
/** A text with gaps: `___` marks a gap; `answers[i]` lists what is accepted for gap i. */
export type GapLine={who?:'a'|'b';text:string;answers:string[][]};
/** Exercise 1 · missing letters (the gap is part of a word: no space before it). */
export const lettersExercise:{lines:GapLine[];say:string[]}={
 lines:[
  {who:'a',text:'Guten T___. Ich h___ Mira Fuchs. Und S___?',answers:[['ag'],['eiße'],['ie']]},
  {who:'b',text:'Ich h___ Tarek Salim.',answers:[['eiße']]},
  {who:'a',text:'W___ k___ Sie, Herr Salim?',answers:[['oher'],['ommen']]},
  {who:'b',text:'Ich k___ a___ Syrien.',answers:[['omme'],['us']]},
 ],
 say:['Guten Tag. Ich heiße Mira Fuchs. Und Sie?','Ich heiße Tarek Salim.','Woher kommen Sie, Herr Salim?','Ich komme aus Syrien.'],
};
/** Exercise 2 · match question and answer. */
export const matchPairs:Phrase[]=[['Wie heißen Sie?','Ich heiße Jonas Berg.'],['Woher kommen Sie?','Ich komme aus Polen.'],['Herzlich willkommen!','Danke!'],['Ich bin Mira Fuchs. Und Sie?','Ich bin Tarek Salim.']];
/** Exercise 3 · put the words in order. */
export const orderSentences:string[][]=[['Woher','kommen','Sie,','Herr','Salim?'],['Ich','komme','aus','der','Türkei.'],['Guten','Tag.','Wie','heißen','Sie?'],['Ich','bin','Lena','Vogt.','Und','Sie?']];
/** Exercise 4 · separate the words of a glued text. */
export const gluedText='GutenTagWieheißenSieIchbinLenaVogtWoherkommenSieFrauVogtIchkommeausKenia';
export const gluedSentences:{who:'a'|'b';answers:string[]}[]=[
 {who:'a',answers:['Guten Tag.']},{who:'a',answers:['Wie heißen Sie?']},{who:'b',answers:['Ich bin Lena Vogt.']},
 {who:'a',answers:['Woher kommen Sie, Frau Vogt?','Woher kommen Sie Frau Vogt?']},{who:'b',answers:['Ich komme aus Kenia.']},
];
export const gluedSay=['Guten Tag. Wie heißen Sie?','Ich bin Lena Vogt.','Woher kommen Sie, Frau Vogt?','Ich komme aus Kenia.'];
/** Exercise 5 · aus + article ('–' = no article). */
export const articleOptions=['–','der','dem','den'] as const;
export const articleRows:readonly [land:string,article:'–'|'der'|'dem'|'den'][]=[['Türkei','der'],['Irak','dem'],['Deutschland','–'],['USA','den'],['Sudan','dem'],['Schweiz','der'],['Polen','–'],['Jemen','dem'],['Ukraine','der'],['Iran','dem']];
export const articleRowSpeech=([land,article]:readonly [string,string])=>'aus '+(article==='–'?'':article+' ')+land;
/** Exercise 6 · listen and tick. */
export type ListenItem={key:string;name:string;text:string;options:string[];answer:number};
export const listenItems:ListenItem[]=[
 {key:'nora',name:'Nora Weiß',text:'Guten Tag. Ich bin Nora Weiß. Ich komme aus Österreich, aus Wien.',options:['aus Österreich','aus Deutschland','aus der Schweiz'],answer:0},
 {key:'rami',name:'Rami Khalil',text:'Hallo. Ich heiße Rami Khalil. Ich komme aus dem Libanon, aus Beirut.',options:['aus Syrien','aus dem Libanon','aus dem Irak'],answer:1},
 {key:'mei',name:'Mei Suwan',text:'Guten Tag. Ich bin Mei Suwan. Ich komme aus Thailand, aus Bangkok.',options:['aus Kenia','aus Polen','aus Thailand'],answer:2},
];
/** Exercise 7 · write the question to the answer. */
export const questionLines:{answers:string[];reply:string}[]=[
 {answers:['Wie heißen Sie?','Wie heißen Sie, Frau Kamau?'],reply:'Ich heiße Aisha Kamau.'},
 {answers:['Woher kommen Sie?','Woher kommen Sie, Frau Kamau?'],reply:'Ich komme aus Kenia.'},
 {answers:['Wie heißen Sie?','Wie heißen Sie, Herr Nowak?'],reply:'Ich bin Tomasz Nowak.'},
 {answers:['Woher kommen Sie?','Woher kommen Sie, Herr Nowak?'],reply:'Ich komme aus Polen.'},
];
export const questionSay=['Wie heißen Sie?','Ich heiße Aisha Kamau.','Woher kommen Sie?','Ich komme aus Kenia.'];
/** Exercise 8 · choose from the box. */
export const wordBox=['Tag','heiße','Woher','aus','willkommen','Danke'];
export const boxLines:GapLine[]=[
 {who:'a',text:'Guten ___. Ich bin Nikos Papadakis. Wie heißen Sie?',answers:[['Tag']]},
 {who:'b',text:'Ich ___ Yasemin Arslan.',answers:[['heiße']]},
 {who:'a',text:'___ kommen Sie, Frau Arslan?',answers:[['Woher']]},
 {who:'b',text:'Ich komme ___ der Türkei. Und Sie?',answers:[['aus']]},
 {who:'a',text:'Aus Griechenland. Herzlich ___!',answers:[['willkommen']]},
 {who:'b',text:'___!',answers:[['Danke']]},
];
export const boxSay=['Guten Tag. Ich bin Nikos Papadakis. Wie heißen Sie?','Ich heiße Yasemin Arslan.','Woher kommen Sie, Frau Arslan?','Ich komme aus der Türkei. Und Sie?','Aus Griechenland. Herzlich willkommen!','Danke!'];
/** Exercise 9 · the learner answers with their own name and country. */
export const ownPrompts:{question:string;pattern:RegExp;placeholder:string}[]=[
 {question:'Wie heißen Sie?',pattern:/^(ich heisse|ich bin) \S+/,placeholder:'Ich heiße … / Ich bin …'},
 {question:'Woher kommen Sie?',pattern:/^ich komme aus \S+/,placeholder:'Ich komme aus …'},
];
/** The test: question, options, right answer. */
export type TestQuestion=readonly [question:string,options:string[],answer:string];
export const testQuestions:TestQuestion[]=[
 ['___ heißen Sie?',['Wie','Woher','Was'],'Wie'],
 ['Ich ___ aus Polen.',['komme','heiße','bin'],'komme'],
 ['„Woher kommen Sie?“ – doğru cevap hangisi?',['Ich komme aus Kenia.','Ich heiße Aisha.','Danke!'],'Ich komme aus Kenia.'],
 ['Ich komme aus ___ Türkei.',['der','dem','den'],'der'],
 ['Ich komme aus ___ Irak.',['der','dem','den'],'dem'],
 ['„Herzlich willkommen!“ – doğru cevap hangisi?',['Guten Tag.','Danke!','Und Sie?'],'Danke!'],
 ['Ich komme aus ___ Deutschland.',['dem','der','– (artikel yok)'],'– (artikel yok)'],
 ['„Siz“ (resmî) Almanca nasıl denir?',['ich','Sie','Herr'],'Sie'],
 ['Ich ___ Omar Nasser.',['bin','heißen','kommen'],'bin'],
 ['„Guten Tag“ Türkçesi nedir?',['Hoş geldiniz','İyi günler','Teşekkürler'],'İyi günler'],
];
/** What is read aloud after a test answer: the whole sentence, or the German answer (nothing for a Turkish answer). */
export function testSpeech([question,,answer]:TestQuestion):string{
 if(question.includes('___'))return question.replace('___',answer.replace(/ \(.*\)/,'').replace('–','')).replace(/\s+/g,' ').trim();
 return /[A-Za-zÄÖÜäöüß]/.test(answer)&&!/^(Hoş|İyi|Teşekkürler)/.test(answer)?answer:'';
}

/** The steps in order (ids are stable; the title is shown in the top bar). */
export type StepKind='cover'|'teach'|'exercise'|'test'|'end';
export type Step={id:string;title:string;kind:StepKind};
export const steps:Step[]=[
 {id:'kapak',title:'Kapak',kind:'cover'},
 {id:'selam',title:'Selamlaşma',kind:'teach'},
 {id:'ad',title:'Adınız ne?',kind:'teach'},
 {id:'nereden',title:'Nereden geliyorsunuz?',kind:'teach'},
 {id:'ulkeler',title:'Ülkeler',kind:'teach'},
 {id:'artikel',title:'Dikkat: aus + artikel',kind:'teach'},
 {id:'fiiller',title:'Üç fiil',kind:'teach'},
 {id:'diyalog',title:'Diyalog',kind:'teach'},
 {id:'kisiler',title:'Kişiler nereden?',kind:'teach'},
 {id:'diller',title:'Farklı dillerde Guten Tag',kind:'teach'},
 {id:'kelimeler',title:'Kelime listesi',kind:'teach'},
 {id:'harfler',title:'Alıştırma 1',kind:'exercise'},
 {id:'eslestir',title:'Alıştırma 2',kind:'exercise'},
 {id:'sirala',title:'Alıştırma 3',kind:'exercise'},
 {id:'ayir',title:'Alıştırma 4',kind:'exercise'},
 {id:'aus',title:'Alıştırma 5',kind:'exercise'},
 {id:'dinle',title:'Alıştırma 6',kind:'exercise'},
 {id:'soru',title:'Alıştırma 7',kind:'exercise'},
 {id:'kutu',title:'Alıştırma 8',kind:'exercise'},
 {id:'sen',title:'Alıştırma 9',kind:'exercise'},
 {id:'test',title:'Test',kind:'test'},
 {id:'bitti',title:'Bitti',kind:'end'},
];
export const stepIndex=(id:string)=>steps.findIndex(step=>step.id===id);
/** Exercises that are scored (Alıştırma 9 is the learner's own sentences: no score). */
export const scoredExercises:{id:string;total:number}[]=[
 {id:'harfler',total:lettersExercise.lines.reduce((n,line)=>n+line.answers.length,0)},
 {id:'eslestir',total:matchPairs.length},
 {id:'sirala',total:orderSentences.length},
 {id:'ayir',total:gluedSentences.length},
 {id:'aus',total:articleRows.length},
 {id:'dinle',total:listenItems.length},
 {id:'soru',total:questionLines.length},
 {id:'kutu',total:boxLines.length},
 {id:'test',total:testQuestions.length},
];

/** Loose comparison for typed answers: case, ß/umlauts, punctuation and spacing do not matter. */
export function normalizeLoose(text:string){
 return text.toLowerCase().replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/[.,!?;:„“”"’'\-]/g,' ').replace(/\s+/g,' ').trim();
}
export function acceptsAnswer(given:string,answers:readonly string[]){const value=normalizeLoose(given);return !!value&&answers.some(answer=>normalizeLoose(answer)===value);}

/** Every German text the lesson speaks (rendered as site voices by scripts/voices). */
export function willkommenSpeechTexts():string[]{
 const out=new Set<string>();const add=(text:string)=>{if(text.trim())out.add(text.trim());};
 for(const [de] of [...greetings,...namePhrases,...originPhrases,...words])add(de);
 for(const [,,,aus] of [...countries,...articleCountries])add(aus);
 add(noArticleSay);articleGroups.forEach(group=>add(group.say));
 verbForms.forEach(form=>{add(form.ich);add(form.sie);});
 dialogue.forEach(line=>add(line[1]));
 people.forEach(person=>add(personSpeech(person)));
 lettersExercise.say.forEach(add);matchPairs.forEach(pair=>{add(pair[0]);add(pair[1]);});
 orderSentences.forEach(sentence=>add(sentence.join(' ')));gluedSay.forEach(add);
 articleRows.forEach(row=>add(articleRowSpeech(row)));listenItems.forEach(item=>add(item.text));
 questionSay.forEach(add);boxSay.forEach(add);ownPrompts.forEach(prompt=>add(prompt.question));
 testQuestions.forEach(question=>add(testSpeech(question)));
 return [...out];
}
