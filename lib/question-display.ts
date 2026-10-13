import type {Question} from './course';
import {t,translate,type StudyLanguage,type Translations} from './study-languages';
import {c} from './category-copy';
export const visualPrompts:Record<string,Translations>={
 'market-start':['Pazartesi saat kaçtan itibaren alışveriş yapabilirsin?','Ab wann kannst du am Montag einkaufen?','From what time can you shop on Monday?','من أي ساعة يمكنك التسوق يوم الاثنين؟','З котрої години можна робити покупки в понеділок?','À partir de quelle heure peux-tu faire les courses lundi ?'],
 'market-end':['Market kaça kadar açık?','Bis wann hat der Markt geöffnet?','Until what time is the shop open?','حتى أي ساعة يفتح المتجر؟','До котрої години працює магазин?','Jusqu’à quelle heure le magasin est-il ouvert ?'],
 'salon-monday':['Kuaför pazartesi açık mı?','Hat der Friseur am Montag geöffnet?','Is the hairdresser open on Monday?','هل صالون الحلاقة مفتوح يوم الاثنين؟','Чи працює перукарня в понеділок?','Le salon est-il ouvert lundi ?'],
 'salon-end':['Kuaför salı kaça kadar açık?','Bis wann hat der Friseur am Dienstag geöffnet?','Until what time is the salon open on Tuesday?','حتى أي ساعة يفتح الصالون يوم الثلاثاء؟','До котрої працює перукарня у вівторок?','Jusqu’à quelle heure le salon est-il ouvert mardi ?'],
 'doctor-friday':['Cuma doktoru hangi saatler arasında arayabilirsin?','Wann kannst du am Freitag die Ärztin anrufen?','Between what times can you call the doctor on Friday?','بين أي ساعتين يمكنك الاتصال بالطبيبة يوم الجمعة؟','Між якими годинами можна зателефонувати лікарці у п’ятницю?','Entre quelles heures peux-tu appeler la médecin vendredi ?'],
 'post-saturday':['Postane cumartesi hangi saatler açık?','Wann hat die Post am Samstag geöffnet?','What are the post office’s Saturday opening hours?','ما ساعات عمل البريد يوم السبت؟','Які години роботи пошти в суботу?','Quels sont les horaires de la poste samedi ?'],
 'pharmacy-sunday':['Eczane pazar açık mı?','Hat die Apotheke am Sonntag geöffnet?','Is the pharmacy open on Sunday?','هل الصيدلية مفتوحة يوم الأحد؟','Чи працює аптека у неділю?','La pharmacie est-elle ouverte dimanche ?'],
 'office-saturday':['Bürgerbüro hafta sonu açık mı?','Hat das Bürgerbüro am Wochenende geöffnet?','Is the Bürgerbüro open at the weekend?','هل مكتب المواطنين مفتوح في نهاية الأسبوع؟','Чи працює Bürgerbüro у вихідні?','Le Bürgerbüro est-il ouvert le week-end ?'],
 kolja:['Kolja hasta. Ne yapması gerekiyor?','Kolja ist krank. Was muss er machen?','Kolja is ill. What must he do?','Kolja مريض. ماذا يجب أن يفعل؟','Kolja хворий. Що йому треба зробити?','Kolja est malade. Que doit-il faire ?'],
 suri:['Suri kalkmak istemiyor. Doğru cümleyi seç.','Suri möchte nicht aufstehen. Wähle den passenden Satz.','Suri does not want to get up. Choose the matching sentence.','Suri لا تريد النهوض. اختر الجملة المناسبة.','Suri не хоче вставати. Вибери відповідне речення.','Suri ne veut pas se lever. Choisis la phrase adaptée.'],
 germain:['Buzdolabı boş. Germain ne yapmalı?','Der Kühlschrank ist leer. Was muss Germain machen?','The fridge is empty. What must Germain do?','الثلاجة فارغة. ماذا يجب أن يفعل Germain؟','Холодильник порожній. Що має зробити Germain?','Le réfrigérateur est vide. Que doit faire Germain ?'],
};
export function questionInstruction(q:Question,language:StudyLanguage){
 if(q.writingTask==='gap')return c(language,'fillGap');
 if(q.writingTask==='word')return c(language,'writeWord');
 if(q.writingTask==='sentence')return c(language,'writeSentence');
 if(language==='tr')return q.prompt;
 if(q.image&&visualPrompts[q.id.replace('u9-visual-','')])return translate(visualPrompts[q.id.replace('u9-visual-','')],language);
 if(q.practice==='dictation'||(q.kind==='write'&&q.audio&&!q.practice))return t(language,'hearWrite');
 if(q.practice==='sentence')return t(language,'reply');
 const origin=q.prompt.match(/^(.+) hangi (ülkeden|şehirden) geliyor\?$/);
 if(origin){const who=origin[1];return translate(origin[2]==='ülkeden'?[q.prompt,`Aus welchem Land kommt ${who}?`,`Which country does ${who} come from?`,`من أي بلد يأتي ${who}؟`,`З якої країни ${who}?`,`De quel pays vient ${who} ?`]:[q.prompt,`Aus welcher Stadt kommt ${who}?`,`Which city does ${who} come from?`,`من أي مدينة يأتي ${who}؟`,`З якого міста ${who}?`,`De quelle ville vient ${who} ?`],language);}
 const langs=q.prompt.match(/^(.+) hangi dilleri konuşuyor\?$/);if(langs){const who=langs[1];return translate([q.prompt,`Welche Sprachen spricht ${who}?`,`Which languages does ${who} speak?`,`ما اللغات التي يتحدث بها ${who}؟`,`Якими мовами розмовляє ${who}?`,`Quelles langues parle ${who} ?`],language);}
 if(/ne demek|anlamını seç/.test(q.prompt))return c(language,'selectMeaning');
 if(q.options)return c(language,'chooseForm');
 return c(language,'writeForm');
}
export function questionContext(q:Question){
 if(q.gap)return q.gap;
 if(q.audio||q.passage)return null;
 const quote=q.prompt.match(/[“"]([^”"]+)[”"]/);if(quote&&/ne demek|artikeli/.test(q.prompt))return quote[1];
 const colon=q.prompt.indexOf(':');if(colon>=0){const clause=q.prompt.slice(colon+1).trim();if(!/[ıİşŞğĞ]/.test(clause))return clause;}
 if(!/[ıİşŞğĞ]/.test(q.prompt)&&/___|→|\+|\(/.test(q.prompt))return q.prompt;
 return null;
}
export function explanationText(q:Question,language:StudyLanguage){
 if(language==='tr')return q.explanation;
 if(q.practice==='sentence')return c(language,'whySentence');
 if(q.practice==='dictation'||(q.kind==='write'&&q.audio&&!q.practice))return c(language,'whyDictation');
 if(/ne demek|anlamını seç/.test(q.prompt))return c(language,'whyWord');
 if(q.passage)return c(language,'whyText');
 const grammaticalRules:{test:RegExp;copy:Translations}[]=[
 {test:/Satzklammer|mastarı? .*son|mastar .*son|Modal fiil|modal fiil|modal.*ayrılmaz/,copy:['','Das konjugierte Modalverb steht auf Position 2; der Infinitiv steht am Satzende.','The conjugated modal verb is in position 2; the infinitive goes at the end.','الفعل المساعد المُصرّف في الموضع الثاني، والمصدر في نهاية الجملة.','Відмінене модальне дієслово стоїть на другому місці, інфінітив — у кінці.','Le verbe modal conjugué est en deuxième position ; l’infinitif est à la fin.']},
 {test:/Akkusativ.*den|der.*den|eril.*Akkusativ/,copy:['','Beim maskulinen Akkusativ wird der → den und ein → einen.','In the masculine accusative, der becomes den and ein becomes einen.','في حالة النصب للمذكر تتحول der إلى den وein إلى einen.','У знахідному відмінку чоловічого роду der → den, ein → einen.','À l’accusatif masculin, der devient den et ein devient einen.']},
 {test:/zu.*Dativ|bei.*Dativ|Dativ.*zu|Dativ.*bei/,copy:['','zu und bei stehen mit Dativ: dem / der; zu dem → zum, zu der → zur, bei dem → beim.','zu and bei take the dative: dem / der; zu dem → zum, zu der → zur, bei dem → beim.','تأتي zu وbei مع حالة الداتيف: dem / der؛ zu dem → zum، zu der → zur، bei dem → beim.','zu та bei вимагають давального відмінка: dem / der; zu dem → zum, zu der → zur, bei dem → beim.','zu et bei demandent le datif : dem / der ; zu dem → zum, zu der → zur, bei dem → beim.']},
 {test:/ab.*başlangıç|bis.*bitiş|zwischen.*und/,copy:['','ab = Beginn, bis = Ende; zwischen verbindet zwei Zeiten mit und.','ab marks the start, bis the end; zwischen connects two times with und.','ab للبداية وbis للنهاية؛ تربط zwischen وقتين بواسطة und.','ab — початок, bis — кінець; zwischen поєднує два часи словом und.','ab indique le début, bis la fin ; zwischen relie deux horaires avec und.']},
 {test:/büyük.*harf|Büyük.*harf|büyük yaz|İsimler/,copy:['','Nomen und das höfliche Sie werden großgeschrieben.','Nouns and the formal Sie start with a capital letter.','تُكتب الأسماء وSie الرسمية بحرف كبير.','Іменники та ввічливе Sie пишуться з великої літери.','Les noms et le Sie de politesse commencent par une majuscule.']},
 ];
 const rule=grammaticalRules.find(r=>r.test.test(q.explanation));return rule?translate(rule.copy,language):c(language,'compare');
}
