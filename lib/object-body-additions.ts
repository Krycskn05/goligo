import type {ObjectWord} from './object-course';

type Meanings=readonly [en:string,ar:string,uk:string,fr:string,es:string,ru:string,fa:string,pl:string,it:string,pt:string];
type BodySpec=readonly [id:string,de:string,tr:string,description:string,descriptionTr:string,meanings:Meanings,note?:string];

// Two picture sheets the learner sent (21 October 2026): parts of the body ("Der Körper") and things for
// health and first aid ("Gesundheit und Erste Hilfe"). Every picture is cut from the sheet onto the vault's
// cream background (public/objects/toon/koerper-*.webp and gesundheit-*.webp, 512 × 512).
const body:BodySpec[]=[
 ['arm','der Arm','kol','Du hast zwei davon. Er geht von der Schulter bis zur Hand.','İki tane vardır. Omuzdan ele kadar uzanır.',
  ['arm','ذراع','рука','bras','brazo','рука','بازو','ręka','braccio','braço']],
 ['auge','das Auge','göz','Damit siehst du. Du hast zwei davon im Gesicht.','Onunla görürsün. Yüzünde iki tane vardır.',
  ['eye','عين','око','œil','ojo','глаз','چشم','oko','occhio','olho']],
 ['bauch','der Bauch','karın','Er ist vorne in der Mitte vom Körper. Nach dem Essen ist er voll.','Vücudun önünde, ortadadır. Yemekten sonra doludur.',
  ['belly / stomach','بطن','живіт','ventre','barriga','живот','شکم','brzuch','pancia','barriga']],
 ['bein','das Bein','bacak','Du hast zwei davon. Damit gehst und läufst du.','İki tane vardır. Onlarla yürür ve koşarsın.',
  ['leg','ساق','нога','jambe','pierna','нога','پا','noga','gamba','perna']],
 ['brust','die Brust','göğüs','Sie ist vorne am Oberkörper, zwischen dem Hals und dem Bauch.','Gövdenin önündedir, boyun ile karın arasında.',
  ['chest','صدر','груди','poitrine','pecho','грудь','سینه','klatka piersiowa','petto','peito']],
 ['daumen','der Daumen','başparmak','Er ist der kurze, dicke Finger an der Hand. Mit ihm zeigst du: Super!','Eldeki kısa ve kalın parmaktır. Onunla "Süper!" diye gösterirsin.',
  ['thumb','إبهام','великий палець','pouce','pulgar','большой палец','شست','kciuk','pollice','polegar']],
 ['finger','der Finger','parmak','Eine Hand hat fünf davon. Damit zeigst du auf etwas.','Bir elde beş tane vardır. Onunla bir şeyi gösterirsin.',
  ['finger','إصبع','палець','doigt','dedo','палец','انگشت','palec','dito','dedo']],
 ['fuss','der Fuß','ayak','Er ist unten am Bein. Du stehst darauf und trägst einen Schuh daran.','Bacağın altındadır. Üzerinde durursun ve ona ayakkabı giyersin.',
  ['foot','قدم','стопа','pied','pie','стопа','کف پا','stopa','piede','pé']],
 ['ellbogen','der Ellbogen','dirsek','Er ist in der Mitte vom Arm. Hier kannst du den Arm beugen.','Kolun ortasındadır. Kolunu burada bükebilirsin.',
  ['elbow','مرفق','лікоть','coude','codo','локоть','آرنج','łokieć','gomito','cotovelo'],'Ellbogen ile Ellenbogen aynı kelimedir: dirsek.'],
 ['haar','das Haar','saç','Es wächst auf dem Kopf. Du kämmst es und gehst damit zum Friseur.','Başta çıkar. Onu tararsın ve onun için kuaföre gidersin.',
  ['hair','شعر','волосся','cheveux','pelo / cabello','волосы','مو','włosy','capelli','cabelo'],'Saç için genellikle çoğul kullanılır: die Haare.'],
 ['hals','der Hals','boyun','Er ist zwischen dem Kopf und den Schultern. Im Winter trägst du dort einen Schal.','Baş ile omuzlar arasındadır. Kışın oraya atkı takarsın.',
  ['neck / throat','رقبة / حلق','шия / горло','cou / gorge','cuello / garganta','шея / горло','گردن / گلو','szyja / gardło','collo / gola','pescoço / garganta'],'Hals hem boyun hem boğaz demektir: Ich habe Halsschmerzen = Boğazım ağrıyor.'],
 ['hand','die Hand','el','Sie ist am Ende vom Arm und hat fünf Finger. Damit schreibst du.','Kolun ucundadır ve beş parmağı vardır. Onunla yazarsın.',
  ['hand','يد','долоня','main','mano','кисть руки','دست','dłoń','mano','mão'],'Arm: kol; Hand: el.'],
 ['knie','das Knie','diz','Es ist in der Mitte vom Bein. Hier kannst du das Bein beugen.','Bacağın ortasındadır. Bacağını burada bükebilirsin.',
  ['knee','ركبة','коліно','genou','rodilla','колено','زانو','kolano','ginocchio','joelho']],
 ['kopf','der Kopf','baş / kafa','Er ist ganz oben am Körper. Dort sind die Augen, die Nase und der Mund.','Vücudun en üstündedir. Gözler, burun ve ağız oradadır.',
  ['head','رأس','голова','tête','cabeza','голова','سر','głowa','testa','cabeça']],
 ['mund','der Mund','ağız','Damit isst, trinkst und sprichst du. Er hat zwei Lippen.','Onunla yer, içer ve konuşursun. İki dudağı vardır.',
  ['mouth','فم','рот','bouche','boca','рот','دهان','usta','bocca','boca']],
 ['nase','die Nase','burun','Sie ist mitten im Gesicht. Damit riechst du.','Yüzün ortasındadır. Onunla koku alırsın.',
  ['nose','أنف','ніс','nez','nariz','нос','بینی','nos','naso','nariz']],
 ['ohr','das Ohr','kulak','Damit hörst du. Du hast zwei davon, links und rechts am Kopf.','Onunla duyarsın. Başın sağında ve solunda iki tane vardır.',
  ['ear','أذن','вухо','oreille','oreja','ухо','گوش','ucho','orecchio','orelha']],
 ['schulter','die Schulter','omuz','Sie ist oben zwischen dem Hals und dem Arm. Du trägst dort eine Tasche.','Üstte, boyun ile kol arasındadır. Oraya çanta takarsın.',
  ['shoulder','كتف','плече','épaule','hombro','плечо','شانه','bark / ramię','spalla','ombro']],
 ['zeh','der Zeh','ayak parmağı','Ein Fuß hat fünf davon. Sie sind vorne am Fuß.','Bir ayakta beş tane vardır. Ayağın önündedirler.',
  ['toe','إصبع القدم','палець ноги','orteil','dedo del pie','палец ноги','انگشت پا','palec u nogi','dito del piede','dedo do pé'],'Der Zeh ve die Zehe ikisi de doğrudur; çoğulu: die Zehen.'],
 ['koerper','der Körper','vücut','Das ist der ganze Mensch: der Kopf, die Arme, der Bauch und die Beine.','Bu, insanın tamamıdır: baş, kollar, karın ve bacaklar.',
  ['body','جسم','тіло','corps','cuerpo','тело','بدن','ciało','corpo','corpo']],
];
const health:BodySpec[]=[
 ['verband','der Verband','sargı / bandaj','Er ist aus weißem Stoff. Du wickelst ihn um eine verletzte Hand.','Beyaz kumaştandır. Onu yaralı bir elin etrafına sararsın.',
  ['bandage','ضمادة','бинт','bandage','venda','бинт','باند','bandaż','benda','atadura']],
 ['pflaster','das Pflaster','yara bandı','Du klebst es auf eine kleine Wunde am Finger.','Onu parmaktaki küçük bir yaraya yapıştırırsın.',
  ['sticking plaster / band-aid','لاصقة جروح','пластир','pansement adhésif','tirita','пластырь','چسب زخم','plaster','cerotto','curativo / band-aid']],
 ['verbandskasten','der Verbandskasten','ilk yardım çantası','Er ist eine Box mit einem weißen Kreuz. Darin sind Pflaster und Verbände.','Üzerinde beyaz bir haç olan bir kutudur. İçinde yara bantları ve sargılar vardır.',
  ['first-aid kit','حقيبة إسعافات أولية','аптечка','trousse de secours','botiquín','аптечка','جعبه کمک‌های اولیه','apteczka','cassetta del pronto soccorso','kit de primeiros socorros'],'Der Erste-Hilfe-Kasten de denir.'],
 ['waermflasche','die Wärmflasche','sıcak su torbası','Du füllst heißes Wasser hinein. Sie macht den Bauch oder das Bett warm.','İçine sıcak su doldurursun. Karnı veya yatağı ısıtır.',
  ['hot-water bottle','قربة ماء ساخن','грілка','bouillotte','bolsa de agua caliente','грелка','کیسه آب گرم','termofor','borsa dell’acqua calda','bolsa de água quente']],
 ['salbe','die Salbe','merhem','Sie ist in einer Tube. Du reibst sie auf die Haut.','Bir tüpün içindedir. Onu cilde sürersin.',
  ['ointment / cream','مرهم','мазь','pommade','pomada','мазь','پماد','maść','pomata','pomada']],
 ['hustensaft','der Hustensaft','öksürük şurubu','Du nimmst ihn mit einem Löffel, wenn du Husten hast.','Öksürüğün olduğunda onu bir kaşıkla içersin.',
  ['cough syrup','شراب السعال','сироп від кашлю','sirop contre la toux','jarabe para la tos','сироп от кашля','شربت سرفه','syrop na kaszel','sciroppo per la tosse','xarope para tosse']],
 ['tablette','die Tablette','tablet / hap','Sie ist klein, rund und weiß. Du schluckst sie mit Wasser.','Küçük, yuvarlak ve beyazdır. Onu suyla yutarsın.',
  ['tablet / pill','قرص','таблетка','comprimé','pastilla','таблетка','قرص','tabletka','compressa','comprimido']],
 ['kapsel','die Kapsel','kapsül','Sie ist klein und länglich und hat oft zwei Farben. Du schluckst sie.','Küçük ve uzunlamasınadır, genellikle iki renklidir. Onu yutarsın.',
  ['capsule','كبسولة','капсула','gélule','cápsula','капсула','کپسول','kapsułka','capsula','cápsula']],
 ['schere','die Schere','makas','Sie hat zwei Klingen. Damit schneidest du Papier oder einen Verband.','İki ağzı vardır. Onunla kâğıt veya sargı kesersin.',
  ['scissors','مقص','ножиці','ciseaux','tijeras','ножницы','قیچی','nożyczki','forbici','tesoura']],
 ['fieberthermometer','das Fieberthermometer','derece / ateş ölçer','Damit misst du, ob du Fieber hast.','Onunla ateşinin olup olmadığını ölçersin.',
  ['thermometer','ميزان الحرارة','градусник','thermomètre','termómetro','градусник','دماسنج','termometr','termometro','termômetro'],'Kısaca das Thermometer da denir.'],
 ['spritze','die Spritze','şırınga / iğne','Die Ärztin gibt damit eine Impfung oder ein Medikament.','Doktor onunla aşı veya ilaç yapar.',
  ['syringe','حقنة','шприц','seringue','jeringa','шприц','سرنگ','strzykawka','siringa','seringa']],
 ['stethoskop','das Stethoskop','stetoskop','Der Arzt hört damit dein Herz und deine Lunge.','Doktor onunla kalbini ve akciğerlerini dinler.',
  ['stethoscope','سماعة الطبيب','стетоскоп','stéthoscope','estetoscopio','стетоскоп','گوشی پزشکی','stetoskop','stetoscopio','estetoscópio']],
 ['rollstuhl','der Rollstuhl','tekerlekli sandalye','Er hat zwei große Räder. Menschen, die nicht gehen können, sitzen darin.','İki büyük tekerleği vardır. Yürüyemeyen insanlar onun içinde oturur.',
  ['wheelchair','كرسي متحرك','інвалідний візок','fauteuil roulant','silla de ruedas','инвалидная коляска','ویلچر','wózek inwalidzki','sedia a rotelle','cadeira de rodas']],
 ['trage','die Trage','sedye','Zwei Personen tragen darauf einen kranken oder verletzten Menschen.','İki kişi onun üzerinde hasta veya yaralı bir insanı taşır.',
  ['stretcher','نقالة','ноші','brancard','camilla','носилки','برانکارد','nosze','barella','maca']],
 ['kruecke','die Krücke','koltuk değneği','Wenn dein Bein verletzt ist, gehst du mit ihr.','Bacağın yaralıysa onunla yürürsün.',
  ['crutch','عكاز','милиця','béquille','muleta','костыль','عصای زیر بغل','kula','stampella','muleta']],
 ['gips','der Gips','alçı','Er ist hart und weiß. Der Arzt macht ihn um ein gebrochenes Bein.','Sert ve beyazdır. Doktor onu kırık bir bacağın etrafına yapar.',
  ['plaster cast','جبيرة جبس','гіпс','plâtre','yeso / escayola','гипс','گچ','gips','gesso','gesso']],
];

const toWords=(specs:BodySpec[],topic:string,prefix:string):ObjectWord[]=>specs.map(([id,de,tr,description,descriptionTr,,note])=>({
 id,de,tr,description,descriptionTr,...(note?{note}:{}),topic,image:'/objects/toon/'+prefix+'-'+id+'.webp',extra:true,
}));
export const bodyObjectAdditions:ObjectWord[]=[...toWords(body,'objects-body','koerper'),...toWords(health,'objects-health','gesundheit')];
const all=[...body,...health];
export const bodyObjectMeanings:Record<string,readonly [en:string,ar:string,uk:string,fr:string]>=Object.fromEntries(
 all.map(([id,,,,,meanings])=>[id,meanings.slice(0,4) as unknown as readonly [string,string,string,string]]),
);
export const bodyExtraMeanings:Record<string,readonly [es:string,ru:string,fa:string,pl:string,it:string,pt:string]>=Object.fromEntries(
 all.map(([id,,,,,meanings])=>[id,meanings.slice(4) as unknown as readonly [string,string,string,string,string,string]]),
);
