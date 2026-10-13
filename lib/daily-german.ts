import type {Question} from './course';

export type DailyStep={id:string;cue:string;goal:string;answer:string;accepted?:string[]};
export type DailyScene={id:string;title:string;de:string;topic:string;steps:DailyStep[]};
export const dailyScenes:DailyScene[]=[
 {id:'telefon',title:'Telefonla randevu',de:'Einen Termin vereinbaren',topic:'u9-telefon',steps:[
  {id:'request',cue:'Guten Tag. Was möchten Sie?',goal:'Bir randevu ayarlamak istediğini söyle.',answer:'Ich möchte einen Termin vereinbaren.'},
  {id:'suggest',cue:'Wann möchten Sie kommen?',goal:'Perşembe saat 16.15’in mümkün olup olmadığını sor.',answer:'Ist es am Donnerstag um 16:15 Uhr möglich?',accepted:['Geht es am Donnerstag um 16:15 Uhr?','Ist es am Donnerstag um 16.15 Uhr möglich?']},
  {id:'confirm',cue:'Ja, wir haben um 16:15 Uhr einen Termin frei.',goal:'Perşembe saat 16.15’te geleceğini kesinleştir.',answer:'Dann komme ich am Donnerstag um 16:15 Uhr.',accepted:['Ich komme am Donnerstag um 16:15 Uhr.','Gut, dann komme ich am Donnerstag um 16:15 Uhr.']},
  {id:'goodbye',cue:'Bis Donnerstag!',goal:'Telefonda nazikçe vedalaş.',answer:'Auf Wiederhören!',accepted:['Danke. Auf Wiederhören!','Vielen Dank. Auf Wiederhören!']},
 ]},
 {id:'apotheke',title:'Eczanede',de:'In der Apotheke',topic:'u9-kurumlar',steps:[
  {id:'need',cue:'Guten Tag. Was brauchen Sie?',goal:'Bir ilaca ihtiyacın olduğunu söyle.',answer:'Ich brauche ein Medikament.'},
  {id:'hours',cue:'Wie kann ich Ihnen helfen?',goal:'Ne zaman açık olduklarını sor.',answer:'Wann haben Sie geöffnet?',accepted:['Wie sind Ihre Öffnungszeiten?']},
  {id:'pickup',cue:'Ihr Medikament ist da.',goal:'İlacını teslim almak istediğini söyle.',answer:'Ich möchte mein Medikament abholen.'},
 ]},
 {id:'buergerbuero',title:'Vatandaş hizmetleri',de:'Im Bürgerbüro',topic:'appointments',steps:[
  {id:'register',cue:'Was möchten Sie hier machen?',goal:'İkamet kaydı yaptırmak istediğini söyle.',answer:'Ich möchte meine Wohnung anmelden.',accepted:['Ich möchte eine Wohnung anmelden.']},
  {id:'appointment',cue:'Haben Sie einen Termin?',goal:'Saat 10’da randevun olduğunu söyle.',answer:'Ich habe um 10 Uhr einen Termin.',accepted:['Ich habe einen Termin um 10 Uhr.','Ich habe um zehn Uhr einen Termin.']},
  {id:'passport',cue:'Was müssen Sie noch machen?',goal:'Pasaportunu teslim almak zorunda olduğunu söyle.',answer:'Ich muss meinen Pass abholen.'},
 ]},
 {id:'bank',title:'Bankada',de:'Bei der Bank',topic:'appointments',steps:[
  {id:'transfer',cue:'Was möchten Sie machen?',goal:'Para havale etmek istediğini söyle.',answer:'Ich möchte Geld überweisen.'},
  {id:'place',cue:'Wo haben Sie einen Termin?',goal:'Bankada randevun olduğunu söyle.',answer:'Ich habe einen Termin bei der Bank.'},
  {id:'available',cue:'Wann haben Sie Zeit?',goal:'15 ile 17 arasında vaktin olduğunu söyle.',answer:'Ich habe zwischen 15 und 17 Uhr Zeit.'},
 ]},
 {id:'post',title:'Postanede',de:'Bei der Post',topic:'u9-ayrilan',steps:[
  {id:'parcel',cue:'Guten Tag. Was möchten Sie?',goal:'Bir paket teslim etmek istediğini söyle.',answer:'Ich möchte ein Paket abgeben.'},
  {id:'until',cue:'Was möchten Sie wissen?',goal:'Saat kaça kadar açık olduklarını sor.',answer:'Bis wann haben Sie geöffnet?',accepted:['Bis wie viel Uhr haben Sie geöffnet?']},
 ]},
 {id:'baecker',title:'Fırında ve yemek seçerken',de:'Beim Bäcker',topic:'u9-nehmen',steps:[
  {id:'bread',cue:'Was hätten Sie gern?',goal:'Nazikçe bir ekmek iste.',answer:'Ich hätte gern ein Brot.',accepted:['Ich möchte ein Brot.','Ein Brot, bitte.']},
  {id:'cheese',cue:'Was nimmst du?',goal:'Peyniri seçtiğini söyle.',answer:'Ich nehme den Käse.'},
  {id:'taste',cue:'Wie schmeckt der Käse?',goal:'Peynirin tadının çok güzel olduğunu söyle.',answer:'Der Käse schmeckt sehr gut.'},
 ]},
 {id:'friseur',title:'Kuaförde',de:'Beim Friseur',topic:'u9-telefon',steps:[
  {id:'slot',cue:'Wann möchten Sie kommen?',goal:'Cumartesi saat 10 için boş randevu sor.',answer:'Haben Sie am Samstag um 10 Uhr einen Termin frei?',accepted:['Ist es am Samstag um 10 Uhr möglich?','Geht es am Samstag um 10 Uhr?']},
  {id:'no',cue:'Geht es am Freitag?',goal:'Cuma vaktin olmadığını nazikçe söyle.',answer:'Tut mir leid. Ich habe am Freitag keine Zeit.',accepted:['Ich habe am Freitag leider keine Zeit.','Tut mir leid, ich habe am Freitag keine Zeit.']},
 ]},
 {id:'freunde',title:'Arkadaşla plan yapmak',de:'Mit Freunden planen',topic:'u9-planlar',steps:[
  {id:'invite',cue:'Was machen wir am Wochenende?',goal:'Cumartesi piknik yapmayı öner.',answer:'Möchtest du am Samstag ein Picknick machen?',accepted:['Wollen wir am Samstag ein Picknick machen?']},
  {id:'yes',cue:'Hast du Lust?',goal:'Daveti seve seve kabul et.',answer:'Ja, gerne!',accepted:['Ja, gern!','Sehr gerne!']},
  {id:'refuse',cue:'Kommst du am Samstag mit?',goal:'Maalesef gelemediğini söyle; ders çalışman gerekiyor.',answer:'Ich kann leider nicht mitkommen. Ich muss lernen.',accepted:['Ich muss lernen. Ich kann leider nicht mitkommen.']},
  {id:'tomorrow',cue:'Schade. Wann hast du Zeit?',goal:'Yarın bir şey yapmayı öner.',answer:'Wir können morgen etwas machen.',accepted:['Vielleicht morgen?']},
 ]},
 {id:'arbeit',title:'Günün işleri',de:'Mein Tagesplan',topic:'u9-modal',steps:[
  {id:'work',cue:'Was musst du heute machen?',goal:'Bugün saat 15’e kadar çalışmak zorunda olduğunu söyle.',answer:'Ich muss heute bis 15 Uhr arbeiten.',accepted:['Heute muss ich bis 15 Uhr arbeiten.']},
  {id:'cook',cue:'Was musst du heute Abend machen?',goal:'Bu akşam yemek pişirmek zorunda olduğunu söyle.',answer:'Ich muss heute Abend kochen.'},
  {id:'sport',cue:'Was möchtest du danach machen?',goal:'Sonra spor yapmak istediğini söyle.',answer:'Danach möchte ich Sport machen.',accepted:['Ich möchte danach Sport machen.']},
 ]},
 {id:'nachricht',title:'Kısa mesaj ve eşya',de:'Nachrichten und Dinge',topic:'u9-mesajlar',steps:[
  {id:'back',cue:'Wann bist du wieder da?',goal:'Saat 11’de geri döneceğini tam cümleyle söyle.',answer:'Ich bin um elf wieder da.',accepted:['Ich bin um 11 Uhr wieder da.']},
  {id:'call',cue:'Wie kann ich dir helfen?',goal:'Seni aramasını rica et.',answer:'Kannst du mich anrufen?',accepted:['Kannst du mich bitte anrufen?']},
  {id:'bag',cue:'Wo ist dein Rucksack?',goal:'Onu görmediğini söyle; Rucksack için doğru zamiri kullan.',answer:'Ich sehe ihn nicht.'},
  {id:'book',cue:'Brauchst du dein Buch?',goal:'Ona ihtiyacın olduğunu söyle; Buch için doğru zamiri kullan.',answer:'Ich brauche es.'},
 ]},
];

export const dailyQuestions:Question[]=dailyScenes.flatMap(scene=>scene.steps.map(step=>({
 id:'u9-life-'+scene.id+'-'+step.id,topic:scene.topic,kind:'write' as const,practice:'sentence' as const,
 prompt:step.goal,answer:step.answer,accepted:step.accepted,audio:step.cue,
 explanation:'Örnek cevap: '+step.answer,scene:scene.id,
 wordBank:step.answer.split(' '),
})));

const visual=(id:string,file:string,prompt:string,answer:string,wrong:string[],explanation:string):Question=>({
 id:'u9-visual-'+id,topic:file==='kolja'||file==='suri'||file==='germain'?'u9-modal':'u9-acilis',
 kind:'choice',practice:'visual',prompt,answer,options:[answer,...wrong],explanation,
 image:{src:'/unit-9/original/'+file+(file==='kolja'||file==='suri'||file==='germain'?'.webp':'.svg'),alt:'Ünite 9 için özgün görsel: '+file,caption:'Ünite 9 · Özgün çizim ve örnek tabela'},
});
export const visualQuestions:Question[]=[
 visual('market-start','market','Pazartesi alışverişe saat kaçtan itibaren gidebilirsin?','Ab 7 Uhr.',['Ab 8 Uhr.','Ab 12 Uhr.','Ab 22 Uhr.'],'Örnek market: Mo.–Sa. 7–22 Uhr. ab başlangıcı belirtir.'),
 visual('market-end','market','Market saat kaça kadar açık?','Bis 22 Uhr.',['Bis 20 Uhr.','Bis 17 Uhr.','Bis 7 Uhr.'],'Örnek market: 7–22 Uhr. bis bitişi belirtir.'),
 visual('salon-monday','salon','Kuaför pazartesi açık mı?','Nein, am Montag ist er geschlossen.',['Ja, ab 8 Uhr.','Ja, bis 20 Uhr.','Ja, zwischen 8 und 20 Uhr.'],'Tabelada Montag geschlossen yazıyor.'),
 visual('salon-end','salon','Kuaför salı günü saat kaça kadar açık?','Bis 20 Uhr.',['Bis 8 Uhr.','Bis 22 Uhr.','Bis 18 Uhr.'],'Dienstag–Samstag: 8–20 Uhr.'),
 visual('doctor-friday','doctor','Cuma günü doktoru hangi saatler arasında arayabilirsin?','Zwischen 9 und 11 Uhr.',['Zwischen 9 und 12 Uhr.','Zwischen 8 und 20 Uhr.','Zwischen 11 und 19 Uhr.'],'Fr: 09:00–11:00 Uhr. zwischen ile und kullanılır.'),
 visual('post-saturday','post','Postane cumartesi hangi saatlerde açık?','Von 10 bis 12 Uhr.',['Von 7:30 bis 18 Uhr.','Von 9 bis 19 Uhr.','Von 8 bis 17 Uhr.'],'Örnek postane: Samstag 10:00–12:00. Başka tabelanın saatlerini kullanma.'),
 visual('pharmacy-sunday','pharmacy','Eczane pazar günü açık mı?','Nein, am Sonntag ist sie geschlossen.',['Ja, von 9 bis 19 Uhr.','Ja, von 9 bis 15 Uhr.','Ja, ab 15 Uhr.'],'Örnek eczane: Sonntag geschlossen.'),
 visual('office-saturday','office','Bürgerbüro hafta sonu açık mı?','Nein, am Samstag und Sonntag ist es geschlossen.',['Ja, von 9 bis 19 Uhr.','Ja, von 11 bis 18 Uhr.','Ja, ab 10 Uhr.'],'Bu örnek tabelada Sa, So geschlossen yazıyor. Her tabelanın saatlerini ayrı oku.'),
 visual('kolja','kolja','Kolja hasta. Hangi cümle bu zorunluluğu anlatır?','Kolja muss zum Arzt gehen.',['Kolja möchte Karten spielen.','Kolja muss ein Brot kaufen.','Kolja möchte eine Party feiern.'],'Zorunluluk: muss. Diğer fiil mastar hâlinde en sonda: gehen.'),
 visual('suri','suri','Suri kalkmak istemiyor. Hangi cümle uygun?','Suri möchte nicht aufstehen.',['Suri muss einkaufen.','Suri möchte arbeiten.','Suri kann Musik machen.'],'İstek: möchte. Ayrılan fiil modal fiille ayrılmaz: aufstehen.'),
 visual('germain','germain','Germain’ın buzdolabı boş. Bugün ne yapması gerekiyor?','Germain muss heute einkaufen.',['Germain muss einen Termin vereinbaren.','Germain möchte schlafen.','Germain kann Karten spielen.'],'Zorunluluk: muss; alışveriş: einkaufen.'),
];

const extraDictations:[string,string][]=[
 ['u9-telefon','Haben Sie einen Termin frei?'],['u9-telefon','Geht es am Dienstag um elf Uhr?'],
 ['u9-zaman','Ich habe zwischen drei und fünf Uhr Zeit.'],['u9-zaman','Ab Freitag habe ich Zeit.'],
 ['u9-kurumlar','Ich möchte Medikamente abholen.'],['appointments','Ich möchte Geld überweisen.'],
 ['u9-ayrilan','Wir müssen die Wohnung anmelden.'],['u9-ayrilan','Ich möchte ein Paket abgeben.'],
 ['u9-planlar','Möchtest du am Samstag ein Picknick machen?'],['u9-planlar','Wir können morgen etwas machen.'],
 ['u9-modal','Ich muss heute bis fünfzehn Uhr arbeiten.'],['u9-nehmen','Ich hätte gern ein Brot.'],
 ['u9-zamir','Kannst du mich bitte anrufen?'],['u9-esyalar','Siehst du meine Brille?'],
 ['u9-sesler','Ich lade Sie ein, Frau Schön.'],['u9-acilis','Bis wann haben Sie geöffnet?'],
];
export const dailyDictations:Question[]=extraDictations.map(([topic,answer],i)=>({id:'u9-life-diktat-'+i,topic,kind:'write',practice:'dictation',prompt:'Dinle ve duyduğun cümleyi Almanca yaz.',answer,audio:answer,explanation:'Diktat: '+answer,...(i===14?{strictCase:true}:{})}));
