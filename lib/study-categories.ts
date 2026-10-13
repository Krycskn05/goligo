import {topics,questions,type Question} from './course';
import {courseUnits} from './textbook-curriculum';
import {translate,topicNames,type Translations,type StudyLanguage} from './study-languages';
export const groups:{unit:number;title:Translations;ids:string[]}[]=[
 {unit:1,title:['Tanışma ve konuşma','Kennenlernen und Sprechen','Introductions and conversation','التعارف والمحادثة','Знайомство й розмова','Présentation et conversation'],ids:['names','origin','languages','greetings','wellbeing','address','intro']},
 {unit:1,title:['Dil bilgisi','Grammatik','Grammar','القواعد','Граматика','Grammaire'],ids:['verbs','order']},
 {unit:1,title:['Okuma, yazma ve sesler','Lesen, Schreiben und Laute','Reading, writing and sounds','القراءة والكتابة والأصوات','Читання, письмо й звуки','Lecture, écriture et sons'],ids:['alphabet','writing','reading']},
 {unit:8,title:['Yemekler ve günlük konuşma','Essen und Alltagsgespräche','Food and everyday conversation','الطعام والمحادثة اليومية','Їжа й щоденна розмова','Repas et conversation quotidienne'],ids:['meals','invitations','ordering','compliments']},
 {unit:8,title:['Artikeller, fiiller ve cümleler','Artikel, Verben und Sätze','Articles, verbs and sentences','الأدوات والأفعال والجمل','Артиклі, дієслова й речення','Articles, verbes et phrases'],ids:['compounds','can','food-acc','nehmen']},
 {unit:9,title:['Randevu ve zaman','Termine und Zeit','Appointments and time','المواعيد والوقت','Зустрічі й час','Rendez-vous et horaires'],ids:['appointments','u9-telefon','u9-zaman','u9-acilis']},
 {unit:9,title:['Fiiller ve cümle kurma','Verben und Satzbau','Verbs and sentence building','الأفعال وتكوين الجمل','Дієслова й побудова речень','Verbes et construction des phrases'],ids:['u9-modal','u9-ayrilan','u9-fiiller']},
 {unit:9,title:['Artikeller ve zamirler','Artikel und Pronomen','Articles and pronouns','الأدوات والضمائر','Артиклі й займенники','Articles et pronoms'],ids:['u9-artikel','u9-yer','u9-zamir','u9-nehmen']},
 {unit:9,title:['Kurumlar ve eşyalar','Orte und Gegenstände','Places and objects','الأماكن والأشياء','Місця й речі','Lieux et objets'],ids:['u9-kurumlar','u9-esyalar']},
 {unit:9,title:['Planlar ve mesajlar','Pläne und Nachrichten','Plans and messages','الخطط والرسائل','Плани й повідомлення','Projets et messages'],ids:['u9-planlar','u9-mesajlar']},
 {unit:9,title:['Sesler ve yazım','Laute und Schreibung','Sounds and spelling','الأصوات والإملاء','Звуки й правопис','Sons et orthographe'],ids:['u9-sesler']},
];
export const titleOf=(id:string,language:StudyLanguage)=>{const unit=courseUnits.find(u=>u.id===id);return unit?translate(unit.names,language):language==='tr'?topics.find(t=>t.id===id)?.title??id:topicNames[id]?translate(topicNames[id],language):topics.find(t=>t.id===id)?.de??id;};
export const topicPool=(id:string)=>questions.filter(q=>q.topic===id);
export function questionFamily(q:Question){return q.image?'visual':q.practice==='sentence'?'sentence':q.practice==='dictation'||(q.kind==='write'&&q.audio)?'dictation':q.kind==='read'?'read':q.audio?'listen':q.options?'choice':'write';}
