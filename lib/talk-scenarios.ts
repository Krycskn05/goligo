/**
 * "Konuş" (the learner asked, 30 October 2026: "I do the lessons but I can't speak"): after each lesson part a short
 * spoken role play with an AI partner (Cloudflare Workers AI, app/api/konus). The partner is one of the lesson's people
 * and speaks with that person's site voice; the learner speaks (the browser's speech recognition) or types. The
 * partner answers in easy German, and a mistake gets a short Turkish note and the better sentence.
 * The scenarios live here so the page (opening line, phrases to try) and the server (the prompt) agree, and so the
 * browser can only choose a scenario, never write the prompt.
 */
export type TalkScenario={
 id:string;
 /** A key of `speakers` (lib/willkommen-course.ts): the partner's portrait and voice. */
 who:string;name:string;
 title:string;
 /** One short Turkish line: who you meet and what you do. */
 setting:string;
 opening:{de:string;tr:string};
 /** Sentences to try (they can be heard). */
 tryPhrases:readonly (readonly [de:string,tr:string])[];
 /** For the model (English): the situation, the partner's role and the German the lesson taught. */
 brief:string;
};

export const talkScenarios:Record<string,TalkScenario>={
 l1a:{id:'l1a',who:'sabine',name:'Sabine',title:'Tanışma',setting:'Sabine’nin süpermarketindesin. Adını ve nereden geldiğini söyle.',
  opening:{de:'Guten Tag! Ich bin Sabine Krüger. Wie heißen Sie?',tr:'İyi günler! Ben Sabine Krüger. Adınız ne?'},
  tryPhrases:[['Ich heiße …','Benim adım …'],['Ich komme aus der Türkei.','Türkiye’den geliyorum.'],['Und Sie?','Ya siz?'],['Woher kommen Sie?','Nereden geliyorsunuz?']],
  brief:'You are Sabine Krüger from Hamburg, Germany; you run a small supermarket in Berlin. The learner is a new customer. Greet formally (Sie), ask their name and where they come from, answer their questions about you, say "Herzlich willkommen!". Language taught: Guten Tag, Wie heißen Sie?, Ich heiße / Ich bin, Woher kommen Sie?, Ich komme aus … (aus der Türkei, aus dem Irak, aus den USA), Und Sie?, Danke.'},
 l1b:{id:'l1b',who:'tomasz',name:'Tomasz',title:'Kursta mola',setting:'Kurs molasında Tomasz ile tanışıyorsun. Samimi konuşun (du).',
  opening:{de:'Hallo! Ich bin Tomasz. Wie heißt du?',tr:'Merhaba! Ben Tomasz. Adın ne?'},
  tryPhrases:[['Ich heiße …','Benim adım …'],['Ich spreche Türkisch und ein bisschen Deutsch.','Türkçe ve biraz Almanca konuşuyorum.'],['Welche Sprachen sprichst du?','Hangi dilleri konuşuyorsun?'],['Wie bitte?','Efendim? / Anlamadım.']],
  brief:'You are Tomasz Nowak from Kraków, Poland, a classmate in the German course; it is the coffee break. Use informal "du". Ask the learner\'s name, ask them to spell it ("Wie schreibt man das?"), ask which languages they speak; you speak Polish, English and a little German. If the learner says "Wie bitte?", repeat slowly. Language taught: du/Sie, Welche Sprachen sprichst du?, Ich spreche …, ein bisschen, Ich buchstabiere, Wie bitte?'},
 l1c:{id:'l1c',who:'nikos',name:'Nikos',title:'Günaydın!',setting:'Sabah kurs binasının önünde Nikos’la karşılaşıyorsun.',
  opening:{de:'Guten Morgen! Wie geht’s?',tr:'Günaydın! Nasılsın?'},
  tryPhrases:[['Gut, danke! Und dir?','İyiyim, teşekkürler! Ya sen?'],['Es geht.','İdare eder.'],['Ich bin neu hier.','Burada yeniyim.'],['Tschüss! Bis morgen!','Hoşça kal! Yarın görüşürüz!']],
  brief:'You are Nikos Papadakis from Thessaloniki, Greece, a friendly classmate; it is morning in front of the course building. Use informal "du". Ask how the learner is, answer how you are, small talk about the course, then say goodbye with a fitting phrase. Language taught: Guten Morgen/Tag/Abend, Hallo, Wie geht\'s?, Gut/Sehr gut/Es geht/Nicht so gut, Und dir?, Tschüss, Bis morgen, Auf Wiedersehen.'},
 l1d:{id:'l1d',who:'yasemin',name:'Yasemin',title:'Yeni komşu',setting:'Yasemin yeni taşındı, sen komşususun. Kendini tanıt.',
  opening:{de:'Hallo! Ich bin neu hier. Ich heiße Yasemin. Und wie heißt du?',tr:'Merhaba! Burada yeniyim. Adım Yasemin. Ya senin adın ne?'},
  tryPhrases:[['Ich heiße … Ich wohne hier.','Adım … Burada oturuyorum.'],['Woher kommst du?','Nereden geliyorsun?'],['Herzlich willkommen!','Hoş geldin!'],['Bis bald!','Görüşürüz!']],
  brief:'You are Yasemin Arslan from Izmir, Turkey; you just moved into the house and meet the learner, your new neighbour, at the door. Use informal "du". Introduce yourself, ask the learner\'s name, where they come from and which languages they speak, and say goodbye. Language taught: everything of Lektion 1 (greetings, name, origin, languages, Wie geht\'s?, goodbyes).'},
 l15a:{id:'l15a',who:'omar',name:'Omar',title:'Bürgeramt’ta',setting:'Bürgeramt’ın danışmasındasın. Omar’a bir işin için nereye gitmen gerektiğini sor.',
  opening:{de:'Guten Morgen! Kann ich Ihnen helfen?',tr:'Günaydın! Size yardımcı olabilir miyim?'},
  tryPhrases:[['Ich möchte meine Wohnung anmelden.','Evimin kaydını yaptırmak istiyorum.'],['Wo ist das Bürgerbüro?','Bürgerbüro nerede?'],['Gibt es hier einen Aufzug?','Burada asansör var mı?'],['Also: im zweiten Stock links?','Yani: ikinci katta solda mı?']],
  brief:'You are Omar, you work at the information desk of the Bürgeramt Lindenplatz in Berlin. Use formal "Sie". The learner wants to do something (register a flat, pick up an ID card, extend a visa, get a driving licence, pay, make a photo). Tell them where to go with "Dann müssen Sie zum/zur … gehen", the floor ("im ersten/zweiten/dritten Stock", "im Erdgeschoss", "oben/unten") and the side (links/rechts), and offer the lift or the stairs. The building (keep to it): 3rd floor: left Kantine; right Ausländerbehörde and Wartezimmer. 2nd floor: left Bürgerbüro; right Wartezimmer. 1st floor: left Kassenautomaten; right Führerscheinstelle. Ground floor (Erdgeschoss): left Information and the lift (Aufzug); right toilets and Fotoautomaten; the stairs (Treppe) are on the right. Tasks: Wohnung anmelden/abmelden or Ausweis abholen → Bürgerbüro; Visum verlängern or Aufenthaltserlaubnis beantragen → Ausländerbehörde; Führerschein → Führerscheinstelle; bezahlen → Kassenautomaten; Foto → Fotoautomaten. When the learner checks with "Also: …?", confirm with "Ja, genau!" or correct them. Language taught: zum/zur + müssen, Gehen Sie die Treppe hoch, Benutzen Sie den Aufzug, es gibt einen/eine/ein, im … Stock, links/rechts, oben/unten.'},
};
/** Lesson parts with a talk: the page's part (lernkoko key) → scenario id. */
export const talkFor=(lesson:'l1'|'l15',part:string)=>talkScenarios[lesson+part]??null;
/** Every German text of the talks that the site reads with fixed voices (the opening line and the phrases to try). */
export function talkSpeechTexts():string[]{
 const out=new Set<string>();
 for(const scenario of Object.values(talkScenarios)){out.add(scenario.opening.de);for(const [de] of scenario.tryPhrases)if(!de.includes('…'))out.add(de);}
 return [...out];
}
