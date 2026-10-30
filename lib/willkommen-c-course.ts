/**
 * Lektion 1 „Willkommen!“, Teil C – Guten Tag! (the learner's lesson page, 25 October 2026), ported to the site like
 * Teil A and B: the cover, eleven short teaching steps, twelve exercises, a 12-question test and the end. Texts for the
 * learner are Turkish; the German is read with the site voices, each person with their own voice (`speakers` in
 * lib/willkommen-course.ts). Step ids never change: saved scores are keyed by them (lib/willkommen-progress.ts).
 */
import type {GapLine,Phrase,SayItem,Step,StepGroup} from './willkommen-course';
import type {Line} from './willkommen-b-course';

/** Pictures of Teil C (public/toon/lektion1, from the learner's page; cut-outs on white). */
export const willkommenCPictures={
 cover:{src:'/toon/lektion1/kapak-c.webp',width:960,height:540},
 morning:{src:'/toon/lektion1/sie-sabah.webp',width:960,height:640},
 park:{src:'/toon/lektion1/du-park.webp',width:960,height:640},
 goodbye:{src:'/toon/lektion1/veda.webp',width:960,height:640},
 cards:{src:'/toon/lektion1/paul-kartlar.webp',width:960,height:540},
 world:{src:'/toon/lektion1/selam-dunya.webp',width:960,height:640},
} as const;

/* ---------- teaching steps ---------- */
/** Step 1 · greeting by the time of day: emoji, German, Turkish, when. */
export const timeGreetings:readonly [emoji:string,de:string,tr:string,when:string][]=[
 ['🌅','Guten Morgen!','Günaydın!','sabah, yaklaşık saat 10’a kadar'],
 ['☀️','Guten Tag!','İyi günler!','yaklaşık 10 – 18 arası'],
 ['🌇','Guten Abend!','İyi akşamlar!','saat 18’den sonra'],
 ['🌙','Gute Nacht!','İyi geceler!','yatmadan önce — sadece vedalaşırken'],
];
/** Step 2 · hello and goodbye: German, Turkish, Sie / du / beide. */
export type Register='Sie'|'du'|'beide';
export const hellos:readonly [de:string,tr:string,register:Register][]=[
 ['Hallo!','Merhaba!','du'],['Hi!','Selam!','du'],['Guten Tag!','İyi günler!','Sie'],['Guten Morgen!','Günaydın!','beide'],
];
export const goodbyes:readonly [de:string,tr:string,register:Register][]=[
 ['Auf Wiedersehen!','Hoşça kalın! (tekrar görüşmek üzere)','Sie'],['Tschüs!','Hoşça kal! / Bay bay!','du'],['Ciao!','Bay bay!','du'],['Bis bald!','Yakında görüşürüz!','beide'],['Gute Nacht!','İyi geceler!','beide'],
];
/** Step 3 · goodbye at the train (Rami and Mei). */
export const dialogueGoodbye:Line[]=[
 {who:'rami',de:'Tschüs, Mei! Gute Reise!',tr:'Hoşça kal Mei! İyi yolculuklar!'},
 {who:'mei',de:'Tschüs, Rami! Bis bald!',tr:'Hoşça kal Rami! Yakında görüşürüz!'},
];
/** Step 4 · how are you? The answers from super to schlecht. */
export const moods:readonly [emoji:string,de:string,tr:string][]=[
 ['😄','super','harika'],['😊','sehr gut','çok iyi'],['🙂','gut','iyi'],['😐','na ja, es geht','eh işte, idare eder'],['😕','nicht so gut','pek iyi değil'],['😞','schlecht','kötü'],
];
export const howAreYou={sie:'Wie geht es Ihnen?',du:'Wie geht es dir?',short:'Wie geht’s?'};
/** Step 5 · two dialogues: formal (Omar and Sabine, who then say du) and informal (Yasemin and Aisha). */
export const dialogueMorning:Line[]=[
 {who:'omar',de:'Guten Morgen, Frau Krüger! Wie geht es Ihnen?',tr:'Günaydın Bayan Krüger! Nasılsınız?'},
 {who:'sabine',de:'Guten Morgen, Herr Nasser! Danke, sehr gut. Und Ihnen?',tr:'Günaydın Bay Nasser! Teşekkürler, çok iyi. Ya siz?'},
 {who:'omar',de:'Auch gut, danke.',tr:'Ben de iyiyim, teşekkürler.'},
 {who:'sabine',de:'Sagen wir du?',tr:'Sen diyelim mi?'},
 {who:'omar',de:'Ja, gern! Ich bin Omar.',tr:'Evet, memnuniyetle! Ben Omar.'},
 {who:'sabine',de:'Und ich bin Sabine. Bis bald, Omar!',tr:'Ben de Sabine. Yakında görüşürüz Omar!'},
 {who:'omar',de:'Tschüs, Sabine!',tr:'Hoşça kal Sabine!'},
];
export const dialoguePark:Line[]=[
 {who:'yasemin',de:'Hi Aisha! Wie geht’s?',tr:'Selam Aisha! Nasılsın?'},
 {who:'aisha',de:'Hallo Yasemin! Na ja, es geht. Und dir?',tr:'Merhaba Yasemin! Eh işte, idare eder. Ya sen?'},
 {who:'yasemin',de:'Super, danke!',tr:'Harika, teşekkürler!'},
];
/** Step 6 · more answers you hear in everyday life (+ good, ± so-so). */
export const bonusAnswers:readonly [de:string,tr:string,mark:'+'|'±'][]=[
 ['Alles in Ordnung!','Her şey yolunda!','+'],['Alles paletti!','Her şey tıkırında! (günlük)','+'],['Alles in Butter!','Her şey yağ gibi! (günlük)','+'],
 ['Alles im grünen Bereich!','Her şey yeşil alanda = yolunda','+'],['Prima!','Harika!','+'],['Klasse!','Süper!','+'],['Wunderbar!','Muhteşem!','+'],
 ['Fantastisch!','Fantastik!','+'],['Nicht schlecht.','Fena değil.','+'],['So lala.','Şöyle böyle.','±'],
];
/** Step 7 · the verb is always in position 2. */
export const verbPositions:readonly [first:string,verb:string,rest:string][]=[
 ['Ich','komme','aus Spanien.'],['Woher','kommen','Sie?'],['Welche Sprachen','sprechen','Sie?'],['Wie','geht','es Ihnen?'],['Ich','heiße','Nora Weiß.'],['Ich','bin','neu hier.'],
];
export const positionSay=(row:readonly [string,string,string])=>row.join(' ');
/** Step 8 · introducing yourself with everything so far (Mei is new; Nikos welcomes her). */
export const dialogueNew:Line[]=[
 {who:'mei',de:'Hallo! Ich heiße Mei Suwan. Ich bin neu hier. Ich komme aus Thailand, aus Bangkok. Ich spreche Thai, Englisch und ein bisschen Deutsch.',tr:'Merhaba! Adım Mei Suwan. Burada yeniyim. Tayland’dan, Bangkok’tan geliyorum. Tayca, İngilizce ve biraz Almanca konuşuyorum.'},
 {who:'nikos',de:'Herzlich willkommen, Mei!',tr:'Hoş geldin Mei!'},
];
/** Step 9 · greeting around the world. */
export const worldGreetings:readonly [emoji:string,de:string,tr:string][]=[
 ['🤝','Handschlag','el sıkma — Almanya’da resmî selam'],['🤗','Umarmung','sarılma — arkadaşlar arasında'],['👋','Winken','el sallama — uzaktan, samimi'],
 ['😘','Wangenkuss','yanaktan öpme — Fransa, Türkiye, İtalya…'],['🙇','Verbeugung','eğilerek selam — Japonya, Kore'],
];
/** Step 11 · word list (the first form before " / " is read). */
export const wordsC:Phrase[]=[
 ['Guten Morgen!','Günaydın!'],['Guten Tag!','İyi günler!'],['Guten Abend!','İyi akşamlar!'],['Gute Nacht!','İyi geceler!'],['Hallo! / Hi!','Merhaba! / Selam!'],
 ['Auf Wiedersehen!','Hoşça kalın!'],['Tschüs!','Hoşça kal!'],['Bis bald!','Yakında görüşürüz!'],['Wie geht es Ihnen?','Nasılsınız? (siz)'],['Wie geht es dir?','Nasılsın? (sen)'],['Wie geht’s?','Nasıl gidiyor? (kısa)'],
 ['Danke, gut.','Teşekkürler, iyi.'],['Und Ihnen? / Und dir?','Ya siz? / Ya sen?'],['sehr','çok'],['nicht','değil'],['schlecht','kötü'],['es geht','idare eder'],['Sagen wir du?','Sen diyelim mi?'],['Ja, gern!','Evet, memnuniyetle!'],['Gute Reise!','İyi yolculuklar!'],
];
export const wordSayC=(de:string)=>de.split(' / ')[0];

/* ---------- exercises ---------- */
/** Exercise 1 · which greeting at this time? */
export const timeOptions=['Guten Morgen!','Guten Tag!','Guten Abend!','Gute Nacht!'];
export const timeQuestions:{time:string;answer:string}[]=[
 {time:'🌅 07:30',answer:'Guten Morgen!'},{time:'☀️ 14:00',answer:'Guten Tag!'},{time:'🌇 19:30',answer:'Guten Abend!'},{time:'🌙 23:00 — yatarken',answer:'Gute Nacht!'},
 {time:'🌅 09:15',answer:'Guten Morgen!'},{time:'☀️ 16:45',answer:'Guten Tag!'},{time:'🌃 21:00 — karşılaşınca',answer:'Guten Abend!'},
];
/** Exercise 2 · Sie, du or both? */
export const registerQuestions:{greeting:string;answer:Register}[]=[
 {greeting:'Hallo!',answer:'du'},{greeting:'Guten Tag!',answer:'Sie'},{greeting:'Tschüs!',answer:'du'},{greeting:'Auf Wiedersehen!',answer:'Sie'},
 {greeting:'Hi!',answer:'du'},{greeting:'Bis bald!',answer:'beide'},{greeting:'Guten Morgen!',answer:'beide'},{greeting:'Ciao!',answer:'du'},
];
/** Exercise 3 · separate the greetings of a glued text. */
export const gluedGreetings='GutenAbendHiBisbaldAufWiedersehenHalloTschüs';
export const gluedGreetingAnswers=['Guten Abend!','Hi!','Bis bald!','Auf Wiedersehen!','Hallo!','Tschüs!'];
/** Both spellings of tschüs are right (Tschüs and Tschüss). */
const withTschuess=(text:string)=>text.includes('Tschüs')?[text,text.replace('Tschüs','Tschüss')]:[text];
export const gluedGreetingLines:GapLine[]=gluedGreetingAnswers.map((answer,i)=>({text:(i+1)+'. ___',answers:[withTschuess(answer)]}));
/** Exercise 4 · face ↔ word (matching) and Exercise 5 · the memory game use `moods`. */
/** Exercise 6 · listen: how are they? */
export type MoodHear={key:string;name:string;text:string;options:string[];answer:number};
export const moodHearing:MoodHear[]=[
 {key:'nora',name:'Nora Weiß',text:'Hallo! Danke, mir geht es super!',options:['😄 super','🙂 gut','😞 schlecht'],answer:0},
 {key:'rami',name:'Rami Khalil',text:'Na ja, es geht. Und dir?',options:['😊 sehr gut','😐 es geht','😕 nicht so gut'],answer:1},
 {key:'tomasz',name:'Tomasz Nowak',text:'Hm, nicht so gut heute.',options:['🙂 gut','😞 schlecht','😕 nicht so gut'],answer:2},
 {key:'sabine',name:'Sabine Krüger',text:'Danke, sehr gut! Und Ihnen?',options:['😊 sehr gut','😐 es geht','😄 super'],answer:0},
];
/** Exercise 7 · the word box (a = Nikos, b = Nora). */
export const boxWordsC=['geht','Ihnen','Danke','Und','gern','dir'];
export const boxLinesC:GapLine[]=[
 {who:'a',text:'Guten Morgen, Frau Weiß! Wie ___ es ___?',answers:[['geht'],['Ihnen']]},
 {who:'b',text:'___, sehr gut! ___ Ihnen?',answers:[['Danke'],['Und']]},
 {who:'a',text:'Auch gut. Sagen wir du?',answers:[]},
 {who:'b',text:'Ja, ___! Ich bin Nora.',answers:[['gern']]},
 {who:'a',text:'Und ich bin Nikos. Wie geht es ___ heute, Nora?',answers:[['dir']]},
 {who:'b',text:'Super!',answers:[]},
];
export const boxSayC=['Guten Morgen, Frau Weiß! Wie geht es Ihnen?','Danke, sehr gut! Und Ihnen?','Auch gut. Sagen wir du?','Ja, gern! Ich bin Nora.','Und ich bin Nikos. Wie geht es dir heute, Nora?','Super!'];
/** Exercise 8 · build the sentence: the verb in position 2 (a chip may hold two words). */
export const orderVerbSentences:{words:string[];verb:string}[]=[
 {words:['Woher','kommen','Sie?'],verb:'kommen'},{words:['Ich','komme','aus','Spanien.'],verb:'komme'},{words:['Welche Sprachen','sprechen','Sie?'],verb:'sprechen'},
 {words:['Wie','geht','es','dir?'],verb:'geht'},{words:['Ich','bin','neu','hier.'],verb:'bin'},{words:['Ich','spreche','Polnisch','und','Deutsch.'],verb:'spreche'},
];
/** Exercise 9 · full stop or question mark? */
export const punctuationQuestions:{sentence:string;answer:'.'|'?'}[]=[
 {sentence:'Guten Tag, ich bin Mei Suwan',answer:'.'},{sentence:'Wie heißen Sie',answer:'?'},{sentence:'Ich komme aus Thailand',answer:'.'},{sentence:'Woher kommen Sie, Frau Weiß',answer:'?'},
 {sentence:'Und Sie',answer:'?'},{sentence:'Ich spreche Thai und ein bisschen Deutsch',answer:'.'},{sentence:'Wie geht es dir',answer:'?'},{sentence:'Danke, gut',answer:'.'},
];
/** Exercise 10 · capital letters (checked with case). */
export const lowercaseText='hallo! ich heiße nora weiß. ich komme aus österreich. ich spreche deutsch und englisch. und sie?';
export const capitalLines:GapLine[]=[
 {text:'1. ___',answers:[['Hallo! Ich heiße Nora Weiß.']]},{text:'2. ___',answers:[['Ich komme aus Österreich.']]},
 {text:'3. ___',answers:[['Ich spreche Deutsch und Englisch.']]},{text:'4. ___',answers:[['Und Sie?']]},
];
export const capitalSay='Hallo! Ich heiße Nora Weiß. Ich komme aus Österreich. Ich spreche Deutsch und Englisch. Und Sie?';
/** Exercise 11 · dictation (Rami's sentences, then the rest with the learner's voice). */
export const dictation:{text:string;who?:string}[]=[
 {text:'Guten Abend! Ich bin Rami Khalil.',who:'rami'},{text:'Ich komme aus dem Libanon.',who:'rami'},{text:'Ich spreche Arabisch, Französisch und ein bisschen Deutsch.',who:'rami'},
 {text:'Wie geht es Ihnen?'},{text:'Danke, gut. Und dir?'},{text:'Tschüs! Bis bald!'},
];
export const dictationLines:GapLine[]=dictation.map(item=>({text:'___',answers:[withTschuess(item.text)],say:{text:item.text,who:item.who}}));
/** Exercise 12 · Das bin ich! (not scored). */
export const ownPromptsC:{pattern:RegExp;placeholder:string}[]=[
 {pattern:/^(hallo|guten tag|guten morgen|guten abend|hi)\b/,placeholder:'Selam: Hallo! / Guten Tag!'},
 {pattern:/^(ich heisse|ich bin|mein name ist) \S+/,placeholder:'Ich heiße … / Ich bin …'},
 {pattern:/^ich komme aus \S+/,placeholder:'Ich komme aus …'},
 {pattern:/^ich spreche \S+/,placeholder:'Ich spreche … und ein bisschen Deutsch.'},
];
/** The test: question, options, right answer, and what is read after the answer (nothing for a Turkish answer). */
export type TestQuestionC=readonly [question:string,options:string[],answer:string,say:string];
export const testQuestionsC:TestQuestionC[]=[
 ['Saat 08:00, karşılaşıyorsun:',['Guten Morgen!','Guten Abend!','Gute Nacht!'],'Guten Morgen!','Guten Morgen!'],
 ['Saat 20:00, karşılaşıyorsun:',['Guten Tag!','Guten Abend!','Gute Nacht!'],'Guten Abend!','Guten Abend!'],
 ['Yatmaya gidiyorsun:',['Guten Abend!','Gute Nacht!','Bis bald!'],'Gute Nacht!','Gute Nacht!'],
 ['Resmî vedalaşma:',['Auf Wiedersehen!','Tschüs!','Hi!'],'Auf Wiedersehen!','Auf Wiedersehen!'],
 ['Samimi vedalaşma:',['Auf Wiedersehen!','Tschüs!','Guten Tag!'],'Tschüs!','Tschüs!'],
 ['Wie geht es ___? (Sie)',['Ihnen','dir','du'],'Ihnen','Wie geht es Ihnen?'],
 ['Wie geht es ___? (du)',['Ihnen','dir','Sie'],'dir','Wie geht es dir?'],
 ['😐 → ?',['Super!','Na ja, es geht.','Schlecht.'],'Na ja, es geht.','Na ja, es geht.'],
 ['„Sagen wir du?“ ne demek?',['Sen diyelim mi?','Nasılsın?','Hoşça kal!'],'Sen diyelim mi?',''],
 ['Fiil 2. pozisyonda olan cümle:',['Ich komme aus Polen.','Komme ich aus Polen.','Ich aus Polen komme.'],'Ich komme aus Polen.','Ich komme aus Polen.'],
 ['Doğru yazılmış olan:',['Ich spreche Polnisch.','ich spreche polnisch.','Ich Spreche polnisch.'],'Ich spreche Polnisch.','Ich spreche Polnisch.'],
 ['„Woher kommen Sie“ sonuna ne gelir?',['?','.','!'],'?','Woher kommen Sie?'],
];

/** The steps in order (ids are stable; the title is shown in the top bar). */
export const stepsC:Step[]=[
 {id:'kapak',title:'Kapak',kind:'cover'},
 {id:'tageszeit',title:'Günün saatine göre selam',kind:'teach'},
 {id:'gruesse',title:'Merhaba ve hoşça kal',kind:'teach'},
 {id:'abschied',title:'Vedalaşma',kind:'teach'},
 {id:'befinden',title:'Nasılsın?',kind:'teach'},
 {id:'dialoge',title:'Diyaloglar',kind:'teach'},
 {id:'bonus',title:'Bonus ifadeler',kind:'teach'},
 {id:'verbposition',title:'Fiil 2. pozisyonda',kind:'teach'},
 {id:'neu-hier',title:'Ben yeniyim',kind:'teach'},
 {id:'welt',title:'Dünyada selamlaşma',kind:'teach'},
 {id:'schreiben',title:'Doğru yazma',kind:'teach'},
 {id:'kelimeler',title:'Kelime listesi',kind:'teach'},
 {id:'tageszeit-uebung',title:'Alıştırma 1',kind:'exercise'},
 {id:'sie-du-beide',title:'Alıştırma 2',kind:'exercise'},
 {id:'ayir',title:'Alıştırma 3',kind:'exercise'},
 {id:'gesichter',title:'Alıştırma 4',kind:'exercise'},
 {id:'memory',title:'Alıştırma 5',kind:'exercise'},
 {id:'hoeren',title:'Alıştırma 6',kind:'exercise'},
 {id:'kutu',title:'Alıştırma 7',kind:'exercise'},
 {id:'sirala',title:'Alıştırma 8',kind:'exercise'},
 {id:'punkt',title:'Alıştırma 9',kind:'exercise'},
 {id:'gross-klein',title:'Alıştırma 10',kind:'exercise'},
 {id:'diktat',title:'Alıştırma 11',kind:'exercise'},
 {id:'sen',title:'Alıştırma 12',kind:'exercise'},
 {id:'test',title:'Test',kind:'test'},
 {id:'konus',title:'Konuşma',kind:'speak'},
 {id:'bitti',title:'Bitti',kind:'end'},
];
export const stepIndexC=(id:string)=>stepsC.findIndex(step=>step.id===id);
/** Exercises that are scored (the memory game and Alıştırma 12, the learner's own sentences, have no score). */
export const scoredExercisesC:{id:string;total:number}[]=[
 {id:'tageszeit-uebung',total:timeQuestions.length},
 {id:'sie-du-beide',total:registerQuestions.length},
 {id:'ayir',total:gluedGreetingAnswers.length},
 {id:'gesichter',total:moods.length},
 {id:'hoeren',total:moodHearing.length},
 {id:'kutu',total:boxLinesC.reduce((n,line)=>n+line.answers.length,0)},
 {id:'sirala',total:orderVerbSentences.length},
 {id:'punkt',total:punctuationQuestions.length},
 {id:'gross-klein',total:capitalLines.length},
 {id:'diktat',total:dictation.length},
 {id:'test',total:testQuestionsC.length},
];
export const stepGroupsC:StepGroup[]=[
 {id:'konu',label:'Konu anlatımı',ids:stepsC.filter(step=>step.kind==='teach').map(step=>step.id)},
 {id:'alistirmalar',label:'Alıştırmalar',ids:stepsC.filter(step=>step.kind==='exercise').map(step=>step.id)},
 {id:'test',label:'Test',ids:['test']},
 {id:'konus',label:'Konuş',ids:['konus']},
];

/** Every German text Teil C speaks (rendered as site voices by scripts/voices). */
export function willkommenCSpeechTexts():string[]{
 const out=new Set<string>();const add=(text:string)=>{if(text.trim())out.add(text.trim());};
 timeGreetings.forEach(([,de])=>add(de));
 [...hellos,...goodbyes].forEach(([de])=>add(de));
 for(const line of [...dialogueGoodbye,...dialogueMorning,...dialoguePark,...dialogueNew])add(line.say??line.de);
 moods.forEach(([,de])=>add(de));
 Object.values(howAreYou).forEach(add);
 bonusAnswers.forEach(([de])=>add(de));
 verbPositions.forEach(row=>add(positionSay(row)));
 worldGreetings.forEach(([,de])=>add(de));
 wordsC.forEach(([de])=>add(wordSayC(de)));
 timeQuestions.forEach(item=>add(item.answer));
 registerQuestions.forEach(item=>add(item.greeting));
 gluedGreetingAnswers.forEach(add);
 moodHearing.forEach(item=>add(item.text));
 boxSayC.forEach(add);
 orderVerbSentences.forEach(item=>add(item.words.join(' ')));
 punctuationQuestions.forEach(item=>add(item.sentence+item.answer));
 add(capitalSay);
 dictation.forEach(item=>add(item.text));
 testQuestionsC.forEach(question=>add(question[3]));
 return [...out];
}
/** A dictation line's speech (for the say button before the gap). */
export const dictationSay=(item:{text:string;who?:string}):SayItem=>({text:item.text,who:item.who});
