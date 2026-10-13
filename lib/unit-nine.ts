import type {Block, Topic, Word} from './lessons';
import type {Question} from './course';

// The completed 7 October lesson. Existing question IDs remain untouched.
type Noun = [meaning:string, singular:string, plural:string];
type Verb = [meaning:string, infinitive:string, first:string, second:string];
const example=(de:string,tr:string)=>({de,tr});
const clean=(s:string)=>s.replace(/\*/g,'');
const table=(heading:string,heads:string[],rows:string[][],tip?:string):Block=>({heading,table:{heads,rows},...(tip?{tip}:{})});
const nouns=(heading:string,rows:Noun[],tip?:string)=>table(heading,['Türkçe anlamı','Artikeliyle Almanca','Çoğulu'],rows,tip);
const verbs=(heading:string,rows:Verb[])=>table(heading,['Türkçe anlamı','Mastar','Önemli çekimler*'],rows.map(([tr,de,first,second])=>[tr,de,first+' / '+second]),'* Fotoğraftaki biçimlere eklenen tamamlayıcı çekimler de gösterildi.');
const phrases=(heading:string,rows:string[][],tip?:string)=>table(heading,['Almanca ifade','Türkçe karşılığı'],rows,tip);
const board=(file:string,alt:string)=>({src:'/unit-9/original/'+file,alt,caption:'Özgün tekrar çizimi · Ders notlarından hazırlanmıştır'});
const lesson=(id:string,title:string,de:string,section:string,lead:string,blocks:Block[]):Topic=>({id,title,de,unit:9,section:'9 · '+section,pages:'Ders 80–87 · Çalışma 100–109 · 7 Ekim notları',minutes:8,lead,blocks});

const appointmentNouns:Noun[]=[
 ['Randevu','der Termin','die Termine'],['Flört buluşması','das Date','die Dates*'],
 ['Buluşma','das Treffen','die Treffen*'],['Kararlaştırılmış buluşma','die Verabredung','die Verabredungen*'],
];
const institutionNouns:Noun[]=[
 ['Postane / posta kurumu','die Post','Bu anlamda tekil'],['İş bulma kurumu','die Agentur für Arbeit','Bu bağlamda tekil'],
 ['Yetişkin eğitim merkezi','die Volkshochschule (VHS)','die Volkshochschulen'],['Eczane','die Apotheke','die Apotheken'],
 ['Banka','die Bank','die Banken'],['Vatandaş hizmetleri bürosu','das Bürgerbüro','die Bürgerbüros'],
 ['Belediye binası','das Rathaus','die Rathäuser*'],['Yabancılar dairesi','die Ausländerbehörde','die Ausländerbehörden*'],
];
const extraInstitutions:Noun[]=[
 ['İş / sosyal yardım merkezi','das Jobcenter','die Jobcenter*'],
 ['Eyalet göç idaresi','das Landesamt für Migration','die Landesämter für Migration*'],
 ['Federal Göç ve Mülteciler Dairesi','das BAMF','Özel kurum adı'],
 ['Aile ödeneği kurumu','die Familienkasse','die Familienkassen*'],['Avukat','der Rechtsanwalt','die Rechtsanwälte*'],
 ['Sparkasse bankası','die Sparkasse','die Sparkassen*'],['Polis kurumu','die Polizei','Bu anlamda tekil'],
 ['Dersteki dil okulunun adı','die Hartnackschule','Özel okul adı'],
];
const shops:Noun[]=[
 ['Fırıncı / fırın','der Bäcker','die Bäcker'],['Büyük mağaza','das Kaufhaus','die Kaufhäuser'],
 ['Süpermarket','der Supermarkt','die Supermärkte*'],['Büfe','der Kiosk','die Kioske*'],
 ['Kuaför','der Friseur','die Friseure*'],['Doktor','der Arzt','die Ärzte*'],
 ['İş / çalışma','die Arbeit','Bu anlamda tekil'],['Metro istasyonu','die U-Bahn-Station*','die U-Bahn-Stationen*'],
];
const objects:Noun[]=[
 ['Anahtar','der Schlüssel','die Schlüssel*'],['Cep telefonu','das Handy','die Handys*'],
 ['Ayakkabı','der Schuh','die Schuhe'],['Çanta','die Tasche','die Taschen*'],
 ['Kalem','der Stift','die Stifte*'],['Kitap','das Buch','die Bücher*'],
 ['Alışveriş listesi','der Einkaufszettel','die Einkaufszettel'],['Paket','das Paket','die Pakete*'],
 ['Ev / daire','die Wohnung','die Wohnungen'],['İlaç','das Medikament','die Medikamente'],
 ['Pasaport','der Pass','die Pässe'],['Sırt çantası','der Rucksack','die Rucksäcke'],
 ['Gözlük','die Brille','die Brillen'],['Bilet','das Ticket','die Tickets'],
];
const planNouns:Noun[]=[
 ['Fikir','die Idee','die Ideen'],['Mesaj','die Nachricht','die Nachrichten'],
 ['Kart','die Karte','die Karten'],['Parti','die Party','die Partys'],
 ['Kurs','der Kurs','die Kurse*'],['Bilgisayar kursu','der Computerkurs','die Computerkurse*'],
 ['Sınav / test','der Test','die Tests'],['Piknik','das Picknick','die Picknicks*'],
 ['Davet','die Einladung','die Einladungen*'],['Randevu takvimi','der Terminkalender','die Terminkalender*'],
 ['Vakit','die Zeit','Bu anlamda tekil'],['İstek / heves','die Lust','Bu anlamda tekil'],['Para','das Geld','Bu anlamda tekil'],
];
const foodNouns:Noun[]=[['Ekmek','das Brot','die Brote*'],['Peynir','der Käse','die Käse* (çeşitler)'],['Döner','der Döner','die Döner*']];
const regularVerbs:Verb[]=[
 ['Yapmak','machen','ich mache','du machst'],['Çalışmak','arbeiten','ich arbeite','du arbeitest'],
 ['Gitmek','gehen','ich gehe','du gehst'],['Gelmek','kommen','ich komme','du kommst'],
 ['Öğrenmek / çalışmak','lernen','ich lerne','du lernst'],['Yemek pişirmek','kochen','ich koche','du kochst'],
 ['Temizlemek','putzen','ich putze','du putzt'],['Satın almak','kaufen','ich kaufe','du kaufst'],
 ['İhtiyaç duymak','brauchen','ich brauche','du brauchst'],['Sormak','fragen','ich frage','du fragst'],
 ['Yazmak','schreiben','ich schreibe','du schreibst'],['İçmek','trinken','ich trinke','du trinkst'],
 ['Kararlaştırmak / ayarlamak','vereinbaren','ich vereinbare','du vereinbarst'],
];
const irregularVerbs:Verb[]=[
 ['Görmek','sehen','ich sehe','du siehst'],['Buluşmak','treffen','ich treffe','du triffst'],
 ['Konuşmak','sprechen','ich spreche','du sprichst'],['Yemek yemek','essen','ich esse','du isst'],
 ['Unutmak','vergessen','ich vergesse','du vergisst'],['Yardım etmek','helfen','ich helfe','du hilfst'],
 ['Sevmek / hoşlanmak','mögen','ich mag','du magst'],['Bilmek','wissen','ich weiß','du weißt'],
 ['Araçla gitmek','fahren','ich fahre','du fährst'],
];
const separableRows:string[][]=[
 ['Telefonla aramak','anrufen','ich rufe ... an'],['Teslim almak; birini almak','abholen','ich hole ... ab'],
 ['Teslim etmek','abgeben','ich gebe ... ab'],['Kayıt yaptırmak','anmelden','ich melde ... an'],
 ['Birlikte gelmek','mitkommen','ich komme ... mit'],['Davet etmek','einladen','ich lade ... ein'],
 ['Alışveriş yapmak','einkaufen','ich kaufe ... ein'],['Kalkmak','aufstehen','ich stehe ... auf'],
];
const phonePhrases:string[][]=[
 ['Guten Tag. Mein Name ist ...','İyi günler. Benim adım ...'],
 ['Ich möchte mit Frau / Herrn ... sprechen.','Bayan / Bay ... ile konuşmak istiyorum.'],
 ['Ich möchte einen Termin vereinbaren.','Bir randevu ayarlamak istiyorum.'],
 ['Geht es am ... um ...?','... günü saat ... olur mu?'],
 ['Ist es am ... um ... möglich?','... günü saat ... mümkün mü?'],
 ['Haben Sie zwischen ... und ... Uhr einen Termin frei?','... ile ... arasında boş randevunuz var mı?'],
 ['Können Sie am ... um ... Uhr kommen?','... günü saat ... gelebilir misiniz?'],
 ['Ja, das geht.','Evet, olur.'],['Tut mir leid. Das geht leider nicht.','Üzgünüm. Maalesef olmaz.'],
 ['Am ... haben wir keinen Termin frei.','... günü boş randevumuz yok.'],
 ['Wir haben aber um ... Uhr einen Termin frei.','Ama saat ... için boş randevumuz var.'],
 ['Dann komme ich am ... um ... Uhr.','O zaman ... günü saat ... geliyorum.'],
 ['Auf Wiederhören!','Telefonda görüşmek üzere!'],
];
const invitations:string[][]=[
 ['Kommst du mit?','Sen de geliyor musun?'],['Hast du Lust und Zeit?','İsteğin ve vaktin var mı?'],
 ['Ja, gerne!','Evet, seve seve!'],['Die Idee ist schön.','Fikir güzel.'],
 ['Ich kann am ... leider nicht.','... günü maalesef yapamam / gelemem.'],
 ['Ich habe leider keine Zeit. Ich muss ...','Maalesef vaktim yok. ... yapmak zorundayım.'],
 ['Wir können nächste Woche etwas machen.','Gelecek hafta bir şey yapabiliriz.'],
 ['Liebe Grüße / Viele Grüße','Sevgiler / Selamlar'],
];
const activities:string[][]=[
 ['Sport machen','Spor yapmak'],['Deutsch lernen','Almanca çalışmak'],['die Küche putzen','Mutfağı temizlemek'],
 ['Kaffee trinken','Kahve içmek'],['Musik machen','Müzik yapmak'],['Freunde besuchen','Arkadaşları ziyaret etmek'],
 ['grillen','Izgara yapmak'],['eine Party feiern','Parti yapmak'],['Karten spielen','Kart oyunu oynamak'],
 ['ein Picknick machen','Piknik yapmak'],
];
const modalRows=[['ich','muss','möchte','kann'],['du','musst','möchtest','kannst'],['er / sie / es','muss','möchte','kann'],['wir','müssen','möchten','können'],['ihr','müsst','möchtet','könnt'],['sie / Sie','müssen','möchten','können']];
const caseRows=[['Nominativ','der / ein','die / eine','das / ein','die'],['Akkusativ','den / einen','die / eine','das / ein','die'],['Dativ','dem / einem','der / einer','dem / einem','den (+n)']];
const pronouns=[['ich','mich','beni'],['du','dich','seni'],['er','ihn','onu'],['sie','sie','onu (kadın)'],['es','es','onu (nötr)'],['wir','uns','bizi'],['ihr','euch','sizi'],['sie (çoğul)','sie','onları'],['Sie','Sie','resmî sizi']];

export const unitNineTopics:Topic[]=[
 lesson('appointments','Randevu, kurumlar ve işlemler','Ich möchte einen Termin vereinbaren.','A','Resmî randevuyu özel buluşmadan ayır; kurumda yapmak istediğin işi söyle.',[
  {heading:'Termin mi, Treffen mi?',text:'Termin resmî randevudur. Date, Treffen ve Verabredung özel buluşmalar için kullanılır.',image:board('termin.svg','Ein Termin ist offiziell; Treffen, Date und Verabredung sind privat.')},
  nouns('Randevu ve buluşma kelimeleri',appointmentNouns),
  {heading:'Randevular var',examples:[example('Wir haben Termine.','Randevularımız var.'),example('Es gibt Termine.','Randevular var.')]},
  nouns('Temel kurumlar',institutionNouns),
  table('Nerede, ne yapılır?',['Yer','Mastar / fiil grubu','Önemli çekim*'],[
   ['Post','ein Paket abgeben','ich gebe ... ab'],['Agentur für Arbeit','einen Job finden','ich finde'],
   ['Volkshochschule','einen Kurs machen','ich mache'],['Apotheke','Medikamente abholen / kaufen','ich hole ... ab / ich kaufe'],
   ['Bank','Geld überweisen','ich überweise'],['Bürgerbüro','eine Wohnung anmelden','ich melde ... an'],
  ],'möchten ile asıl fiil sona gider: Ich möchte ein Paket abgeben. * = ek tamamlama.'),
  {heading:'Randevu söylemek',examples:[example('Ich habe einen Termin beim Arzt.','Doktorda randevum var.'),example('Ich möchte einen Termin vereinbaren.','Bir randevu ayarlamak istiyorum.')]},
 ]),
 lesson('u9-telefon','Telefonla randevu almak','Haben Sie einen Termin frei?','A','Randevuyu iste, gün ve saat öner, kabul veya başka saatle kesinleştir.',[
  {heading:'Konuşmanın sırası',text:'Kendini tanıt → randevu iste → gün ve saat öner → cevabı dinle → kesinleştir.',tip:'Resmî konuşmada Sie; arkadaşınla du kullan.'},
  phrases('Kendini tanıt ve randevu iste',phonePhrases.slice(0,3)),
  phrases('Gün, saat ve uygunluk sor',phonePhrases.slice(3,7)),
  phrases('Cevap ve kesinleştirme',phonePhrases.slice(7),'einen Termin frei haben = boş randevusu olmak. mümkün = möglich.'),
  {heading:'İki kısa örnek',examples:[example('Ist es am Donnerstag um 16:15 Uhr möglich?','Perşembe saat 16.15 mümkün mü?'),example('Gut, dann komme ich um 16:15 Uhr.','Tamam, o zaman saat 16.15’te geliyorum.')],tip:'Son cevabında gün ve saati yeniden söyle. Telefonda vedalaşırken Auf Wiederhören! kullan.'},
 ]),
 lesson('u9-zaman','Gün, saat, başlangıç ve bitiş','am · um · ab · bis · zwischen','A','Bir saat ile zaman aralığını ayır; doğru edatı kullan.',[
  {heading:'Zaman ifadelerinin kısa çizimi',image:board('zaman.svg','Zeitangaben: am Montag, um 10 Uhr, von 8 bis 17 Uhr, ab, bis und zwischen.')},
  table('Altı temel ifade',['Kural','Ne için?','Örnek'],[
   ['am','Gün / günün bölümü','am Montag / am Abend'],['um','Saat','um 10 Uhr'],
   ['von ... bis ...','Başlangıç ve bitiş','von 8 bis 17 Uhr'],['ab','...den itibaren','ab 14 Uhr / ab jetzt'],
   ['bis','...e kadar','bis 14 Uhr'],['zwischen ... und ...','... ile ... arasında','zwischen 12 und 14 Uhr'],
  ],'zwischen ile und; von ile bis. ab yalnız başlangıç, bis yalnız bitiş belirtir.'),
  phrases('Diğer zaman ifadeleri',[
   ['am Wochenende / am Montagabend','Hafta sonunda / pazartesi akşamı'],['heute Abend / morgen Abend','Bu akşam / yarın akşam'],
   ['ab Freitag / ab nächstem Monat','Cumadan itibaren / gelecek aydan itibaren'],['in der Nacht','Gece'],
  ],'heute Abend ve morgen Abend önüne am gelmez.'),
  {heading:'Vaktini söyle',examples:[example('Ich habe am Donnerstag zwischen 15 und 17 Uhr Zeit.','Perşembe 15 ile 17 arasında vaktim var.'),example('Ich arbeite von 8 bis 17 Uhr.','8’den 17’ye kadar çalışıyorum.')]},
 ]),
 lesson('u9-acilis','Açılış saatleri ve takvim','Wann haben Sie geöffnet?','A','Açık-kapalı bilgisini ve gün kısaltmalarını okuyarak uygun zamanı bul.',[
  phrases('Açılış saatlerini sor',[
   ['Wann haben Sie geöffnet?','Ne zaman açıksınız?'],['Wir haben von ... bis ... Uhr geöffnet.','Saat ...den ...e kadar açığız.'],
   ['hat / ist geöffnet','açık'],['hat / ist geschlossen','kapalı'],
  ]),
  table('Haftanın günleri',['Kısaltma','Almanca','Türkçe'],[
   ['Mo','Montag','Pazartesi'],['Di','Dienstag','Salı'],['Mi','Mittwoch','Çarşamba'],['Do','Donnerstag','Perşembe'],
   ['Fr','Freitag','Cuma'],['Sa','Samstag','Cumartesi'],['So','Sonntag','Pazar'],
  ]),
  table('Ders kitabındaki örnek tabelalar',['Kurum','Gün','Açık olduğu saatler'],[
   ['Bürgerbüro','Mo, Mi, Fr','09:00–19:00'],['Bürgerbüro','Di, Do','11:00–18:00'],['Bürgerbüro','Sa, So','geschlossen'],
   ['Post','Mo–Fr','07:30–18:00'],['Post','Sa','10:00–12:00'],['Post','So','geschlossen'],
   ['Flora Apotheke','Mo–Fr','09:00–19:00'],['Flora Apotheke','Sa','09:00–15:00'],['Flora Apotheke','So','geschlossen'],
   ['Agentur für Arbeit','Mo–Mi','08:00–18:00'],['Agentur für Arbeit','Do, Fr','11:00–17:00'],
  ],'Bu saatler ders kitabı 80. sayfadaki örnektir. Çalışma kitabındaki başka tabelalarla karıştırma. Defterdeki Bürgerbüro hafta sonu açık notu tabelayla uyuşmuyor; tabelada hafta sonu kapalı.'),
  {heading:'Saat okuma hatırlatması',text:'Ek: halb acht = 7.30; Viertel vor zehn = 9.45. halb bir sonraki saatin yarımını söyler.',examples:[example('Das Bürgerbüro hat am Montag von 9 bis 19 Uhr geöffnet.','Kitaptaki büro pazartesi 9–19 arasında açık.'),example('Die Post hat von halb acht bis sechs geöffnet.','Postane yedi buçuktan akşam altıya kadar açık.')]},
 ]),
 lesson('u9-modal','Zorunluluk, istek ve yapabilmek','müssen · möchten · können','B','Üç fiili anlamına ve özneye göre seç; asıl fiili sona koy.',[
  table('Üç anlam',['Fiil','Türkçe','Hatırlatma'],[['müssen','zorunda olmak','Pflicht: zorunluluk'],['möchten','nazikçe istemek','Wunsch: istek'],['können','yapabilmek / mümkün olmak','Beceri, imkân veya uygun zaman']]),
  {heading:'müssen çekim kartı',image:board('muessen.svg','müssen: ich muss, du musst, er / sie / es muss, wir müssen, ihr müsst, sie / Sie müssen.')},
  table('Kısa çekim tablosu',['Kişi','müssen','möchten*','können*'],modalRows,'ich ve er/sie/es: muss, möchte, kann. müssen tekilde ü almaz. * = tamamlayıcı çekim.'),
  {heading:'Satzklammer: iki fiilin yeri',text:'Çekimli modal fiil düz cümlede ikinci ögede; asıl fiil mastar hâlinde en sonda.',image:board('satzklammer.svg','Ich muss heute Abend kochen. Das Modalverb steht an Position 2, der Infinitiv am Ende.'),tip:'Ek: İkinci öge, her zaman ikinci kelime değildir.'},
  {heading:'Düz cümle ve soru',examples:[example('Ich muss heute Abend für meine Familie kochen.','Bu akşam ailem için yemek pişirmek zorundayım.'),example('Was musst du heute Abend machen?','Bu akşam ne yapmak zorundasın?')]},
  {heading:'İmkân bildirmek',examples:[example('Ich kann am Sonntag leider nicht kommen.','Pazar günü maalesef gelemem.')],tip:'können yalnız bir beceri anlatmaz; uygun vaktin olup olmadığını da anlatır.'},
 ]),
 lesson('u9-artikel','Nominativ, Akkusativ ve Dativ','der → den → dem','B','İsmin cümledeki görevini ve değişen artikelleri hatırla.',[
  {heading:'Artikel hatırlatma kartı',image:board('artikel.svg','Artikeltabelle: Nominativ, Akkusativ und Dativ für Maskulinum, Femininum, Neutrum und Plural.')},
  table('Üç hâl',['Hâl','Eril','Dişil','Nötr','Çoğul'],caseRows),
  {heading:'Hangi görev?',text:'Nominativ: özne. Akkusativ: kimi / neyi? Dativ: kime / neye? Artikel, kullanılan fiile veya edata göre değişebilir.',tip:'Akkusativde yalnız eril artikel değişir: der → den; ein → einen. Dativde der/das → dem; die → der.'},
  {heading:'Çoğul Dativ',text:'Ek: Dativ çoğulda çoğu isme -n gelir. Zaten -n/-en veya -s ile biten çoğula ayrıca -n eklenmez.'},
  {heading:'Randevu örneği',examples:[example('Ich habe einen Termin.','Bir randevum var.'),example('Der Termin ist am Montag.','Randevu pazartesi günü.')],tip:'der Termin, habe ile Akkusativ nesne olur: einen Termin.'},
 ]),
 lesson('u9-yer','Nereye? Nerede? zu, bei ve im','zum · zur · beim · bei der','B','Gitmek ile randevunun bulunduğu yeri doğru kalıpla söyle.',[
  table('Gitmek ve bulunmak',['Kullanım','Birleşme','Dersteki örnek'],[
   ['zu + Dativ','zu dem → zum / zu der → zur','zum Kiosk / zum Bürgerbüro; zur Post / zur Hartnackschule'],
   ['bei + Dativ','bei dem → beim / bei der → bei der','beim Arzt / beim Jobcenter; bei der Bank / bei der Ausländerbehörde'],
   ['Binanın içinde*','in dem → im','im Rathaus'],
  ],'Wohin? nereye? sorusudur. Burada hâli zu belirler: zu + Dativ. Her Wohin? sorusunda Akkusativ kullanma.'),
  {heading:'zum nasıl oluşur?',image:board('zum-kiosk.svg','zu dem wird zum, zu der wird zur. Ich gehe zum Kiosk.')},
  {heading:'İki yer örneği',examples:[example('Ich gehe zur Hartnackschule.','Hartnackschule’ye gidiyorum.'),example('Ich habe einen Termin bei der Ausländerbehörde.','Yabancılar dairesinde randevum var.')]},
  phrases('Diğer yer kalıpları',[
   ['zum Bäcker / zum Kaufhaus','Fırına / büyük mağazaya'],['zur Arbeit / zur Apotheke','İşe / eczaneye'],
   ['beim BAMF / beim Rechtsanwalt','BAMF’ta / avukatta'],['bei der Familienkasse / bei der Polizei','Aile ödeneği kurumunda / poliste'],
  ]),
 ]),
 lesson('u9-zamir','Akkusativ kişi zamirleri','mich · dich · ihn · sie · es','C','Bir ismi tekrarlamak yerine doğru zamiri kullan.',[
  table('Kişi zamirleri',['Nominativ','Akkusativ','Türkçe'],pronouns),
  table('Eşyalar için artikel belirler',['Artikel','Akkusativ zamir','Örnek'],[['der','ihn','der Rucksack → ihn'],['die','sie','die Brille → sie'],['das','es','das Buch → es']]),
  {heading:'Zamirle cevap',examples:[example('Wo ist mein Rucksack? Ich sehe ihn nicht.','Sırt çantam nerede? Onu görmüyorum.'),example('Kannst du mich anrufen?','Beni arayabilir misin?')]},
  {heading:'sie ile Sie farkı',text:'sie = o kadın veya onlar. Sie = resmî siz; Akkusativde de Sie yazılır.',tip:'Resmî hitapta büyük S kullan. Eşyanın zamirini Türkçe anlamından değil, Almanca artikelinden seç.'},
 ]),
 lesson('u9-ayrilan','Ayrılan fiiller ve modal fiil','Ich rufe dich an.','B–C','Ön eki normal cümlede sona koy; modal fiille mastarı ayırma.',[
  table('Dersteki ayrılan fiiller',['Türkçe anlamı','Mastar','Önemli çekim*'],separableRows,'* = kısa çekim tamamlama.'),
  {heading:'İki yapı',text:'Normal cümlede ön ek sona gider. Modal fiille mastar tek parça olarak en sonda kalır.',examples:[example('Ich rufe dich an.','Seni arıyorum.'),example('Ich kann dich anrufen.','Seni arayabilirim.')],tip:'Ich kann dich rufe an. yazma. kann çekilir; anrufen mastar kalır.'},
  {heading:'Pasaport ve ikamet kaydı',examples:[example('Ich muss meinen Pass abholen.','Pasaportumu teslim almak zorundayım.'),example('Wir müssen die Wohnung anmelden.','İkamet kaydı yaptırmak zorundayız.')]},
 ]),
 lesson('u9-kurumlar','Diğer kurumlar ve dükkânlar','beim Jobcenter · zum Bäcker','A–B','Öğretmenin eklediği tüm randevu yerlerini ve günlük dükkân adlarını öğren.',[
  {heading:'Kurumlar için kısa hatırlatma',image:board('kurumlar.svg','Ortsangaben: beim Arzt, beim Friseur, beim Jobcenter, bei der Bank, bei der Polizei, bei der Familienkasse und im Rathaus.')},
  nouns('Ek randevu yerleri',extraInstitutions,'Yıldızlı çoğullar, fotoğraftaki listeyi tamamlamak için eklendi.'),
  nouns('Dükkânlar ve günlük yerler',shops,'Ek: Bäcker günlük konuşmada fırını da anlatır. Artikeliyle öğren: zum Bäcker, zum Kaufhaus, zur Arbeit.'),
  {heading:'Randevu ve alışveriş',examples:[example('Ich habe einen Termin beim Jobcenter.','Jobcenter’da randevum var.'),example('Ich gehe zum Bäcker.','Fırına gidiyorum.')]},
 ]),
 lesson('u9-fiiller','Günlük fiiller ve önemli çekimler','du siehst · du triffst · du sprichst','B–C','Günlük işleri söyle; özellikle değişen du biçimlerini hatırla.',[
  verbs('Günlük işler ve iletişim',regularVerbs),verbs('Biçimi değişen fiiller',irregularVerbs),
  {heading:'kennen ile wissen',text:'Ek: kennen = birini / bir şeyi tanımak: ich kenne. wissen = bir bilgiyi bilmek: ich weiß.',tip:'du arbeitest; du siehst; du triffst; du sprichst; du isst; du vergisst; du hilfst; du fährst.'},
  {heading:'İki örnek',examples:[example('Ich muss heute arbeiten.','Bugün çalışmak zorundayım.'),example('Siehst du meine Brille?','Gözlüğümü görüyor musun?')]},
 ]),
 lesson('u9-nehmen','nehmen ve schmecken: der mi, den mi?','Ich nehme den Käse.','B','Nesne ile özneyi ayır; yiyecek seçerken doğru artikeli kullan.',[
  table('İki fiil',['Türkçe anlamı','Mastar','Önemli çekim'],[['Almak / seçmek','nehmen','ich nehme / du nimmst'],['Tadı olmak','schmecken','er / es schmeckt']]),
  {heading:'Nesne ve özne farkı',examples:[example('Ich nehme den Käse.','Peyniri alıyorum.'),example('Der Käse schmeckt sehr gut.','Peynirin tadı çok güzel.')],tip:'nehmen ile den Käse nesne; schmeckt cümlesinde der Käse özne.'},
  phrases('Seçim ve rica',[
   ['Was nimmst du?','Ne alıyorsun?'],['Was kann man noch nehmen?','Başka ne alınabilir?'],['Ich hätte gern ...','... rica ediyorum.'],
  ]),nouns('Dersteki yiyecekler',foodNouns,'Yıldızlı çoğullar ek bilgidir; Käse çoğulu peynir çeşitlerini anlatır.'),
 ]),
 lesson('u9-esyalar','Eşyalar, artikeller ve çoğullar','der Schlüssel · das Buch · die Brille','B–C','İsimleri artikeli ve çoğuluyla öğren; ardından ihn, sie veya es kullan.',[
  nouns('Eşyalar',objects.slice(0,8)),nouns('Dersin diğer isimleri',objects.slice(8),'* = fotoğrafta yazmayan çoğul tamamlama.'),
  {heading:'Eşya yerine zamir',examples:[example('Wo ist mein Buch? Ich brauche es.','Kitabım nerede? Ona ihtiyacım var.'),example('Wo ist der Schlüssel? Siehst du ihn?','Anahtar nerede? Onu görüyor musun?')]},
 ]),
 lesson('u9-planlar','Davet, boş zaman ve nazik ret','Möchtest du ...? Hast du Lust?','C','Bir plan öner; kabul et veya kısa gerekçeyle başka zaman öner.',[
  nouns('Kurs ve plan kelimeleri',planNouns,'Zeit, Lust ve Geld burada tekil anlamda kullanılıyor. * = çoğul tamamlama.'),
  phrases('Ne yapmak istersin?',activities),phrases('Davet ve cevap',invitations),
  {heading:'Nazik cevap',text:'Olumlu söz / teşekkür + ret + kısa gerekçe + başka zaman önerisi.',examples:[example('Möchtest du am Samstag ein Picknick machen?','Cumartesi piknik yapmak ister misin?'),example('Die Idee ist schön, aber ich habe leider keine Zeit. Vielleicht morgen?','Fikir güzel ama maalesef vaktim yok. Belki yarın?')]},
 ]),
 lesson('u9-mesajlar','Kısa mesajlar ve günün planı','Bin um elf wieder da!','B–D','Mesajında ne zaman, nerede ve ne yapacağını açıkça söyle.',[
  {heading:'Üç plan bilgisi',text:'Wann? = gün / saat; Wo / Wohin? = yer; Was? = yapılacak iş.'},
  phrases('Kısa notlar',[
   ['Bin um elf wieder da!','Saat on birde geri döneceğim!'],['Komme später!','Daha sonra geleceğim!'],
   ['Nicht vergessen!','Unutma!'],['Kannst du mich anrufen?','Beni arayabilir misin?'],
  ],'Ek: Bin / Komme kısa not dilidir. Tam cümlede Ich bin ... / Ich komme ... yaz.'),
  phrases('Küçük ama önemli kelimeler',[
   ['gleich / wieder','Az sonra / tekrar'],['fertig / möglich','Hazır / mümkün'],['noch / schon','Hâlâ, daha / çoktan'],
   ['leider / wichtig','Maalesef / önemli'],['pünktlich / früh','Dakik / erken'],['höflich / unhöflich','Nazik / kaba'],
   ['Lust haben / Zeit haben','İsteği olmak / vakti olmak'],
  ]),
  {heading:'Bugünün önemli noktaları',text:'Termin: iste, gün ve saat öner, uygunluğu sor, kesinleştir. am gün; um saat. zwischen ... und ...; von ... bis ... . Modal fiil çekimlenir, mastar sona gider. der → den; zu + Dativ → zum / zur. der → ihn. rufe ... an; modal fiille anrufen.'},
  {heading:'Net olmayan kaynak notu',text:'Defterde können yanındaki son sözcük ve Ich möchte am ... devamı tam okunmuyor; tamamlanmadı. Yıldızlı çekimler / çoğullar ve Ek etiketiyle verilen açıklamalar çalışma için eklenmiştir.'},
 ]),
 lesson('u9-sesler','Ses ve yazım: i, ü, ie, ih','wir · müssen · sie · ihr','B–C','Benzer görünen harfleri ayır; özel harfleri ve resmî Sie yazımını koru.',[
  table('Sesleri karşılaştır',['Yazım','Dersteki örnek','Kısa not'],[
   ['i','wir / trinken / die Milch','i kısa veya uzun olabilir.'],['ü','früh / müssen / pünktlich','Dudaklar yuvarlanır.'],
   ['ie','sie / spielen','Uzun i sesi.'],['ih','ihr / ihn','Bu örneklerde uzun i sesi.'],
  ],'Ek: i söylerken dudaklar yana, ü söylerken yuvarlanır. Harfi ve kelimeyi birlikte dinle.'),
  {heading:'Doğru yazım',examples:[example('Ich habe am Dienstag einen Termin.','Salı günü randevum var.'),example('Ich lade Sie ein.','Sizi davet ediyorum. (resmî)')],tip:'İsimleri ve günleri büyük yaz: Termin, Dienstag. Resmî hitapta Sie büyük S ile yazılır.'},
  {heading:'Ses kayıtları hakkında',text:'Bu sitedeki dinlemeler üniteye uygun yeni çalışma metinleridir; cihazının Almanca sesiyle okunur. Kitabın orijinal dinleme kaydının cevabı olarak değerlendirilmez.'},
 ]),
];

export const unitNineWords:Word[]=[];
const word=(topic:string,de:string,tr:string)=>{de=clean(de);if(!unitNineWords.some(w=>w.topic===topic&&w.de===de))unitNineWords.push({topic,de,tr});};
const nounGroups:[string,Noun[]][]=[['appointments',[...appointmentNouns,...institutionNouns]],['u9-kurumlar',[...extraInstitutions,...shops]],['u9-esyalar',objects],['u9-planlar',planNouns],['u9-nehmen',foodNouns]];
for(const [topic,rows] of nounGroups)for(const [tr,de] of rows)word(topic,de,tr);
for(const [tr,de] of [...regularVerbs,...irregularVerbs])word('u9-fiiller',de,tr);
word('u9-fiiller','kennen','Tanımak');
for(const [tr,de]of separableRows)word('u9-ayrilan',de,tr);
for(const [de,tr]of phonePhrases)word('u9-telefon',de,tr);
for(const [de,tr]of [...invitations,...activities])word('u9-planlar',de,tr);
for(const [de,tr]of [['gleich','az sonra'],['wieder','tekrar'],['fertig','hazır'],['möglich','mümkün'],['noch','hâlâ / daha'],['schon','çoktan'],['leider','maalesef'],['wichtig','önemli'],['pünktlich','dakik'],['früh','erken'],['höflich','nazik'],['unhöflich','kaba'],['Nicht vergessen!','Unutma!']])word('u9-mesajlar',de,tr);
word('u9-modal','müssen','Zorunda olmak');word('u9-modal','möchten','Nazikçe istemek');word('u9-modal','können','Yapabilmek / mümkün olmak');
word('u9-sesler','die Milch','Süt');

export const unitNineQuestions:Question[]=[];
const hash=(s:string)=>{let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return(n>>>0).toString(36);};
function mc(id:string,topic:string,prompt:string,answer:string,wrong:string[],explanation:string,extra:Partial<Question>={}){
 const options=[answer,...new Set(wrong.filter(w=>w!==answer))].slice(0,4);
 if(options.length!==4)throw new Error('Ünite 9: dört farklı şık gerekli: '+id);
 unitNineQuestions.push({id:'u9-complete-'+id,topic,kind:'choice',prompt,answer,options,explanation,...extra});
}
function wr(id:string,topic:string,prompt:string,answer:string,explanation:string,extra:Partial<Question>={}){unitNineQuestions.push({id:'u9-complete-'+id,topic,kind:'write',prompt,answer,explanation,...extra});}

// Vocabulary questions share the lesson tables, with stable IDs based on the word.
for(const w of unitNineWords){
 const rest=[...unitNineWords.filter(x=>x.topic===w.topic&&x.tr!==w.tr),...unitNineWords.filter(x=>x.tr!==w.tr)];
 const wrong=[...new Set(rest.map(x=>x.tr))].slice(0,3);const id='word-'+w.topic+'-'+hash(w.de);
 mc(id,w.topic,'“'+w.de+'” ne demek?',w.tr,wrong,w.de+' = '+w.tr+'.');
 if(!w.de.includes('...'))mc(id+'-listen',w.topic,'Dinlediğin kelime veya ifadenin anlamını seç.',w.tr,wrong,w.de+' = '+w.tr+'.',{kind:'listen',audio:w.de});
}
for(const [topic,rows]of nounGroups)for(const [tr,raw,rawPlural]of rows){
 const de=clean(raw),plural=clean(rawPlural),id='noun-'+topic+'-'+hash(de);
 const [article,...parts]=de.split(' ');const noun=parts.join(' ');
 mc(id+'-article',topic,'“'+noun+'” kelimesinin artikeli nedir?',article,['der','die','das','den'].filter(a=>a!==article),de+' = '+tr+'.',{});
 if(plural.startsWith('die ')&&!plural.includes('('))wr(id+'-plural',topic,'Artikeliyle çoğulunu yaz: '+de,plural,plural+'. * ile gösterilen çoğullar ek tamamlama olabilir.');
}
for(const [tr,de,first,second]of [...regularVerbs,...irregularVerbs]){
 for(const line of [first,second]){const [person,form]=line.split(' ');wr('verb-'+de+'-'+person,'u9-fiiller','Sadece fiili yaz: '+person+' ___ ('+de+')',form,line+'. '+de+' = '+tr+'.');}
}
const modals=['müssen','möchten','können'];
for(const row of modalRows)for(let col=1;col<4;col++){
 const person=row[0],answer=row[col],verb=modals[col-1];
 const forms=[...new Set(modalRows.map(r=>r[col]))].filter(x=>x!==answer);
 mc('modal-'+verb+'-'+hash(person),'u9-modal',person+' + '+verb+' → ?',answer,forms,person+' '+answer+'. Diğer fiil mastar hâlinde sona gider.');
 wr('modal-write-'+verb+'-'+hash(person),'u9-modal','Sadece modal fiili yaz: '+person+' ___ ('+verb+')',answer,person+' '+answer+'.');
}
const timeCases=[
 ['Ich habe ___ Montag Zeit.','am',['um','ab','zwischen'],'Gün ile am kullan.'],
 ['Ich komme ___ 10 Uhr.','um',['am','zwischen','von'],'Tek bir saat ile um kullan.'],
 ['Ich arbeite von 8 ___ 17 Uhr.','bis',['und','ab','um'],'von ... bis ... başlangıç ve bitişi belirtir.'],
 ['Ich habe zwischen 12 ___ 14 Uhr Zeit.','und',['bis','ab','am'],'zwischen ile und kullan.'],
 ['14.00’te başlayıp devam ediyor: ___ 14 Uhr.','ab',['bis','am','zwischen'],'ab = ...den itibaren.'],
 ['14.00’te bitiyor: ___ 14 Uhr.','bis',['ab','um','von'],'bis = ...e kadar.'],
 ['Ich habe ___ Wochenende Zeit.','am',['um','von','bis'],'am Wochenende = hafta sonunda.'],
 ['“Bu akşam” için doğru ifade?','heute Abend',['am heute Abend','um heute Abend','heute am Abend'],'heute Abend önüne am gelmez.'],
 ['“Cumadan itibaren” için doğru ifade?','ab Freitag',['um Freitag','zwischen Freitag','bis Freitag'],'ab Freitag başlangıcı söyler.'],
 ['“Gece” için dersteki ifade?','in der Nacht',['am der Nacht','um Nacht','in die Nacht'],'in der Nacht = gece.'],
];
timeCases.forEach(([p,a,w,e],i)=>mc('time-'+i,'u9-zaman',p as string,a as string,w as string[],e as string));
for(const [nom,acc,tr]of pronouns){
 const options=['mich','dich','ihn','sie','es','uns','euch','Sie'].filter(s=>s!==acc).slice(0,3);
 mc('pronoun-'+hash(nom),'u9-zamir',nom+' → Akkusativ?',acc,options,nom+' → '+acc+' = '+tr+'.');
 wr('pronoun-write-'+hash(nom),'u9-zamir','Sadece Akkusativ zamiri yaz: '+nom,acc,nom+' → '+acc+'.',{strictCase:nom==='Sie'});
}
const grammar:[string,string,string,string,string[],string][]=[
 ['case-termin','u9-artikel','Ich habe ___ Termin.','einen',['ein','eine','einem'],'der Termin → Akkusativ einen Termin.'],
 ['case-kaese','u9-nehmen','Ich nehme ___ Käse.','den',['der','dem','das'],'nehmen ile peynir nesne: den Käse.'],
 ['subject-kaese','u9-nehmen','___ Käse schmeckt sehr gut.','Der',['Den','Dem','Das'],'Käse özne: der Käse.'],
 ['dativ-m','u9-artikel','Eril Dativ belirli artikel hangisi?','dem',['der','den','des'],'der → dem.'],
 ['dativ-f','u9-artikel','Dişil Dativ belirli artikel hangisi?','der',['die','den','dem'],'die → der.'],
 ['dativ-n','u9-artikel','Nötr Dativ belirli artikel hangisi?','dem',['das','den','der'],'das → dem.'],
 ['acc-f','u9-artikel','Dişil Akkusativ belirli artikel hangisi?','die',['der','den','dem'],'Dişil artikel Akkusativde değişmez: die.'],
 ['acc-n','u9-artikel','Nötr Akkusativ belirli artikel hangisi?','das',['dem','den','der'],'Nötr artikel Akkusativde değişmez: das.'],
 ['dat-pl','u9-artikel','Dativ çoğul belirli artikel hangisi?','den',['die','der','dem'],'den; uygun çoğul isme -n eklenir.'],
 ['zu-dem','u9-yer','zu dem → ?','zum',['zur','beim','im'],'zu dem kısaltması zum.'],
 ['zu-der','u9-yer','zu der → ?','zur',['zum','beim','im'],'zu der kısaltması zur.'],
 ['bei-dem','u9-yer','bei dem → ?','beim',['zum','zur','im'],'bei dem kısaltması beim.'],
 ['in-dem','u9-yer','in dem → ?','im',['zum','beim','zur'],'in dem kısaltması im.'],
 ['zu-post','u9-yer','Ich gehe ___ Post.','zur',['zum','beim','im'],'die Post → zu der Post → zur Post.'],
 ['zu-kiosk','u9-yer','Ich gehe ___ Kiosk.','zum',['zur','bei der','in der'],'der Kiosk → zu dem Kiosk → zum Kiosk.'],
 ['bei-bank','u9-yer','Ich habe einen Termin ___ Bank.','bei der',['beim','bei dem','zum'],'die Bank → bei der Bank.'],
 ['bei-arzt','u9-yer','Ich habe einen Termin ___ Arzt.','beim',['bei der','zur','in der'],'der Arzt → bei dem Arzt → beim Arzt.'],
 ['zu-case','u9-yer','zu hangi hâli ister?','Dativ',['Akkusativ','Nominativ','Hiç artikel kullanılmaz'],'Burada Wohin? sorusu olsa da zu + Dativ.'],
 ['pronoun-book','u9-zamir','Wo ist mein Buch? Ich sehe ___ nicht.','es',['ihn','sie','mich'],'das Buch → es.'],
 ['pronoun-bag','u9-zamir','Wo ist mein Rucksack? Ich sehe ___ nicht.','ihn',['sie','es','dich'],'der Rucksack → ihn.'],
 ['pronoun-glasses','u9-zamir','Wo ist meine Brille? Ich sehe ___ nicht.','sie',['ihn','es','mich'],'die Brille → sie.'],
 ['nehmen-du','u9-nehmen','Was ___ du? (nehmen)','nimmst',['nehmst','nehme','nehmen'],'du nimmst; e → i.'],
 ['schmecken','u9-nehmen','Der Käse ___ sehr gut.','schmeckt',['schmecken','schmeckst','schmecke'],'der Käse = tekil özne; schmeckt.'],
 ['phone-end','u9-telefon','Telefonda nasıl vedalaşırsın?','Auf Wiederhören!',['Guten Morgen!','Herzlich willkommen!','Wie bitte?'],'Auf Wiederhören = telefonda görüşmek üzere.'],
 ['official','appointments','Doktordaki resmî randevu için hangi kelime?','der Termin',['das Date','das Treffen','die Party'],'Resmî randevu = der Termin.'],
 ['opening','u9-acilis','geschlossen ne demek?','Kapalı',['Açık','Hazır','Mümkün'],'geschlossen = kapalı; geöffnet = açık.'],
 ['halb','u9-acilis','halb acht saat kaçtır?','07:30',['08:30','07:15','08:15'],'halb acht = sekize yarım saat var; 7.30.'],
 ['viertel','u9-acilis','Viertel vor zehn saat kaçtır?','09:45',['10:15','09:15','10:45'],'Ona çeyrek var: 9.45.'],
 ['invite','u9-planlar','Hast du Lust? ne sorar?','İster misin?',['Nerelisin?','Saat kaç?','Kaç yaşındasın?'],'Lust = istek / heves.'],
 ['polite-refusal','u9-planlar','Nazik ret için uygun cevap hangisi?','Die Idee ist schön, aber ich habe leider keine Zeit.',['Du musst mitkommen.','Ich habe einen Pass.','Wann hat die Bank geöffnet?'],'Olumlu söz + ret; gerekçe ve başka zaman da ekleyebilirsin.'],
 ['note-ich','u9-mesajlar','Bin um elf wieder da! tam cümlesinin başına ne eklenir?','Ich',['Du','Wir','Sie'],'Bin öznesi ich; kısa notta özne atlanmış.'],
 ['sound-ie','u9-sesler','Hangisinde uzun i için ie yazımı var?','spielen',['müssen','früh','pünktlich'],'spielen içinde ie uzun i sesidir.'],
 ['sound-ih','u9-sesler','Hangisinde uzun i için ih yazımı var?','ihr',['wir','trinken','Milch'],'ihr ve ihn örneklerinde ih uzun i sesidir.'],
];
for(const [id,t,p,a,w,e]of grammar)mc(id,t,p,a,w,e);

const sentences:[string,string,string,string,string[]?][]=[
 ['phone-request','u9-telefon','“Bir randevu ayarlamak istiyorum.” Almanca yaz.','Ich möchte einen Termin vereinbaren.'],
 ['phone-confirm','u9-telefon','“Perşembe saat 16.15’te geliyorum.” Almanca yaz.','Ich komme am Donnerstag um 16:15 Uhr.'],
 ['time-write','u9-zaman','“Perşembe 15 ile 17 arasında vaktim var.” Almanca yaz.','Ich habe am Donnerstag zwischen 15 und 17 Uhr Zeit.'],
 ['modal-order','u9-modal','Sırala: muss / ich / heute Abend / kochen','Ich muss heute Abend kochen.'],
 ['modal-question','u9-modal','Sırala: was / du / musst / machen','Was musst du machen?'],
 ['gehen','u9-yer','“Eczaneye gidiyorum.” Almanca yaz.','Ich gehe zur Apotheke.'],
 ['rathaus','u9-yer','Sadece birleşmiş edatı yaz: in dem Rathaus → ___ Rathaus','im'],
 ['rufen','u9-ayrilan','“Seni arıyorum.” Almanca yaz.','Ich rufe dich an.'],
 ['rufen-modal','u9-ayrilan','“Seni arayabilirim.” Almanca yaz.','Ich kann dich anrufen.'],
 ['holen','u9-ayrilan','Sırala: muss / meinen Pass / ich / abholen','Ich muss meinen Pass abholen.'],
 ['nehmen','u9-nehmen','“Peyniri alıyorum.” Almanca yaz.','Ich nehme den Käse.'],
 ['schmecken-write','u9-nehmen','“Peynirin tadı çok güzel.” Almanca yaz.','Der Käse schmeckt sehr gut.'],
 ['nachricht','u9-mesajlar','“Beni arayabilir misin?” Almanca yaz.','Kannst du mich anrufen?'],
 ['refusal-write','u9-planlar','“Maalesef vaktim yok.” Almanca yaz.','Ich habe leider keine Zeit.'],
 ['kennen','u9-fiiller','Sadece fiili yaz: Ich ___ Paul. (kennen)','kenne'],
 ['wissen','u9-fiiller','Sadece fiili yaz: Ich ___ nicht. (wissen)','weiß'],
 ['opened','u9-acilis','Sadece sıfatı yaz: açık = ___','geöffnet'],
 ['closed','u9-acilis','Sadece sıfatı yaz: kapalı = ___','geschlossen'],
 ['jobcenter','u9-kurumlar','“Jobcenter’da randevum var.” Almanca yaz.','Ich habe einen Termin beim Jobcenter.'],
 ['baker','u9-kurumlar','“Fırına gidiyorum.” Almanca yaz.','Ich gehe zum Bäcker.'],
 ['termin-object','appointments','“Bir randevum var.” Almanca yaz.','Ich habe einen Termin.'],
 ['book-object','u9-esyalar','Sadece zamiri yaz: das Buch → Ich brauche ___.','es'],
 ['formal-case','u9-sesler','Resmî sizi yaz: Ich lade ___ ein.','Sie'],
];
for(const [id,topic,prompt,answer,accepted]of sentences){wr(id,topic,prompt,answer,'Doğru biçim: '+answer,{...(accepted?{accepted}:{}),...(id==='formal-case'?{strictCase:true}:{})});}
for(const [tr,verb,conj]of separableRows){
 const prefix=conj.split(' ').at(-1)!;
 wr('prefix-'+verb,'u9-ayrilan','Sadece eksik ön eki yaz: '+conj.replace(prefix,'___'),prefix,verb+' = '+tr+'. Normal cümlede ön ek sona gider.');
}

// Each unit topic also has a short, original reading and listening task.
const passages:[string,string,string,string,string,string[]][]=[
 ['appointments','Koray hat einen Termin bei der Bank. Er möchte Geld überweisen.','Koray ne yapmak istiyor?','Geld überweisen','Banka için Geld überweisen = havale yapmak.',['ein Paket abgeben','die Küche putzen','Sport machen']],
 ['u9-telefon','Guten Tag. Ich möchte einen Termin vereinbaren. Geht es am Montag um zehn Uhr? Am Montag haben wir keinen Termin frei. Am Dienstag um elf Uhr geht es. Gut, dann komme ich am Dienstag um elf Uhr.','Kesinleşen randevu ne zaman?','Dienstag, 11 Uhr','Son cevap randevuyu kesinleştiriyor: Dienstag um elf Uhr.',['Montag, 10 Uhr','Dienstag, 10 Uhr','Montag, 11 Uhr']],
 ['u9-zaman','Ich arbeite von acht bis fünfzehn Uhr. Ab sechzehn Uhr habe ich Zeit.','Vakti saat kaçtan itibaren var?','16 Uhr','ab sechzehn Uhr = 16’dan itibaren.',['8 Uhr','15 Uhr','14 Uhr']],
 ['u9-acilis','Das Bürgerbüro hat am Montag von neun bis neunzehn Uhr geöffnet. Am Samstag und Sonntag ist es geschlossen.','Büro cumartesi açık mı?','Nein, es ist geschlossen.','Metinde Samstag ve Sonntag kapalı.',['Ja, von 9 bis 19 Uhr.','Ja, ab 19 Uhr.','Ja, bis 9 Uhr.']],
 ['u9-modal','Ich möchte heute Sport machen. Aber ich muss bis fünfzehn Uhr arbeiten. Danach kann ich zum Sport gehen.','15.00’e kadar ne yapmak zorunda?','arbeiten','muss arbeiten = çalışmak zorunda.',['kochen','schlafen','einkaufen']],
 ['u9-artikel','Der Termin ist am Dienstag. Ich habe einen Termin beim Arzt.','İkinci cümlede neden einen var?','Termin eril Akkusativ nesnedir.','haben ile einen Termin; ilk cümlede der Termin özne.',['Termin dişil bir isimdir.','Termin çoğuldur.','Her isim her yerde einen alır.']],
 ['u9-yer','Ich gehe zur Apotheke. Danach habe ich einen Termin beim Arzt.','Önce nereye gidiyor?','zur Apotheke','Önce eczaneye; sonra doktorda randevu.',['zum Arzt','zur Bank','zum Kiosk']],
 ['u9-zamir','Wo ist mein Rucksack? Ich sehe ihn nicht. Meine Brille ist hier. Ich brauche sie.','ihn hangi kelimenin yerine geçiyor?','der Rucksack','Eril der Rucksack → ihn.',['die Brille','das Buch','die Tasche']],
 ['u9-ayrilan','Ich muss meinen Pass abholen. Danach rufe ich dich an.','Önce ne yapmak zorunda?','seinen Pass abholen','Önce pasaportunu teslim almak zorunda.',['eine Wohnung anmelden','Karten spielen','einen Kaffee trinken']],
 ['u9-kurumlar','Ich gehe zum Bäcker. Dann gehe ich zur Sparkasse. Dort habe ich einen Termin.','Randevusu nerede?','bei der Sparkasse','Randevu Sparkasse’de.',['beim Bäcker','beim Jobcenter','bei der Polizei']],
 ['u9-fiiller','Anna trifft Paul am Abend. Sie sprechen Deutsch und trinken Kaffee.','Anna ile Paul ne içiyor?','Kaffee','trinken Kaffee = kahve içiyorlar.',['Tee','Milch','Wasser']],
 ['u9-nehmen','Was nimmst du? Ich nehme den Käse. Der Käse schmeckt sehr gut.','Kişi neyi seçiyor?','den Käse','Ich nehme den Käse.',['das Brot','den Döner','den Salat']],
 ['u9-esyalar','Wo ist mein Buch? Es ist in meiner Tasche. Mein Schlüssel ist auf dem Tisch.','Kitap nerede?','in der Tasche','das Buch çantada.',['auf dem Tisch','im Bürgerbüro','in der Apotheke']],
 ['u9-planlar','Möchtest du am Samstag ein Picknick machen? Die Idee ist schön, aber ich muss lernen. Vielleicht am Sonntag?','Neden cumartesi gelemiyor?','Er muss lernen.','Öğrenmek / ders çalışmak zorunda.',['Er muss kochen.','Er hat einen Termin beim Arzt.','Er möchte Kaffee trinken.']],
 ['u9-mesajlar','Bin um elf wieder da! Nicht vergessen: Wir haben um zwölf einen Termin. Ruf mich bitte an.','Kişi saat kaçta geri dönüyor?','11 Uhr','um elf wieder da = saat 11’de geri dönecek.',['12 Uhr','10 Uhr','13 Uhr']],
 ['u9-sesler','Wir spielen am Dienstag Karten. Ihr habt Zeit. Ich lade Sie ein, Frau Schön.','Frau Schön’a neden Sie yazılıyor?','Resmî hitap olduğu için.','Resmî siz büyük S ile Sie yazılır.',['Her zamir büyük yazıldığı için.','Birden fazla Frau Schön olduğu için.','Cümlede fiil olmadığı için.']],
];
for(const [topic,text,prompt,answer,explanation,wrong]of passages){
 mc('read-'+topic,topic,prompt,answer,wrong,explanation,{kind:'read',passage:text});
 mc('listen-'+topic,topic,prompt,answer,wrong,explanation,{kind:'listen',audio:text});
}
const dictations:[string,string][]=[
 ['u9-telefon','Ich möchte einen Termin vereinbaren.'],['u9-zaman','Ich komme am Donnerstag um zehn Uhr.'],
 ['u9-acilis','Am Sonntag ist die Post geschlossen.'],['u9-modal','Ich muss heute Abend kochen.'],
 ['u9-artikel','Ich habe einen Termin.'],['u9-yer','Ich gehe zur Apotheke.'],
 ['u9-zamir','Ich sehe ihn nicht.'],['u9-ayrilan','Ich rufe dich an.'],
 ['u9-kurumlar','Ich gehe zum Bäcker.'],['u9-fiiller','Du sprichst Deutsch.'],
 ['u9-nehmen','Der Käse schmeckt sehr gut.'],['u9-esyalar','Mein Buch ist hier.'],
 ['u9-planlar','Ich habe leider keine Zeit.'],['u9-mesajlar','Ich bin um elf wieder da.'],
 ['u9-sesler','Wir müssen pünktlich sein.'],['appointments','Ich habe einen Termin beim Arzt.'],
];
for(const [topic,text]of dictations)wr('dictation-'+topic,topic,'Dinle ve duyduğun cümleyi yaz.',text,'Dikte: '+text,{audio:text});

export const unitNinePdf='/unit-9/Almanca_A1_Unite_9_Ozgun_Notlar.pdf';
