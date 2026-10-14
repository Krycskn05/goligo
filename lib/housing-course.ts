import type {Question} from './course';
import type {Topic} from './lessons';
import type {Translations,StudyLanguage} from './study-languages';
import {translate} from './study-languages';
import type {Review} from './study';
import {housingTraps,trapPassages,trapReasons,type TrapReason} from './housing-traps';

export type HousingSection='a'|'b'|'c'|'d';
export type HousingExercise=Question&{section:HousingSection;step:number;meaning:Translations;cueDe:string;resultDe:string;rule:HousingRule;art?:string;passageMeaning?:Translations;trap?:TrapReason};
const tx=(tr:string,en:string,ar:string,uk:string,fr:string,de=''):Translations=>[tr,de,en,ar,uk,fr];
export const housingSections=[
 {id:'a' as const,topic:'book-11-a',de:'Das ist unsere Wohnung.',title:tx('Evimiz, odalar ve eşyalar','Our home, rooms and furniture','بيتنا والغرف والأثاث','Наш дім, кімнати й меблі','Notre logement, les pièces et les meubles','Unsere Wohnung, Zimmer und Möbel'),pages:'98–99',art:'tisch',steps:['Hier ist unser Wohnzimmer.','Die Lampe ist super!','Das ist unsere Wohnung.']},
 {id:'b' as const,topic:'book-11-b',de:'Wir haben eine Wohnung gefunden.',title:tx('Ev bulma, taşınma ve geçmiş zaman','Finding a home, moving and the past','العثور على سكن والانتقال والماضي','Пошук житла, переїзд і минулий час','Trouver un logement, déménager et parler du passé','Wohnungssuche, Umzug und Vergangenheit'),pages:'100–101',art:'karton',steps:['Wie habt ihr die Wohnung gefunden?','Am Samstag haben wir den Umzug gemacht.','Was haben Sie am Wochenende gemacht?']},
 {id:'c' as const,topic:'book-11-c',de:'Können Sie mir helfen?',title:tx('Apartman duyuruları ve komşudan yardım isteme','Building notices and asking neighbours for help','إعلانات المبنى وطلب المساعدة من الجيران','Оголошення в будинку й допомога сусідів','Les annonces de l’immeuble et l’aide des voisins','Hausmitteilungen und Nachbarschaftshilfe'),pages:'102–103',art:'pflanze',steps:['Kinderwagen bitte hier abstellen.','Ich habe eine Bitte.']},
 {id:'d' as const,topic:'book-11-d',de:'Ich habe ein Jahr gesucht.',title:tx('Ev arama önerileri ve fiil kartları','Housing search tips and verb cards','نصائح البحث عن سكن وبطاقات الأفعال','Поради щодо пошуку житла й картки дієслів','Conseils pour chercher un logement et cartes de verbes','Tipps zur Wohnungssuche und Verbkarten'),pages:'104–105',art:'zeitschrift',steps:['Wer kann helfen?','Mit Wortkarten lernen','Was hast du gemacht?']},
];

export const housingRules={
 noun:tx('İsimleri artikeliyle birlikte öğren. Almanca isimler büyük harfle başlar.','Learn each noun with its article. German nouns begin with a capital letter.','تعلّم الاسم مع أداة التعريف. تبدأ الأسماء الألمانية بحرف كبير.','Вчи іменник разом з артиклем. Німецькі іменники пишуться з великої літери.','Apprends chaque nom avec son article. Les noms allemands commencent par une majuscule.','Lerne Nomen mit Artikel. Nomen beginnen mit einem Großbuchstaben.'),
 adjective:tx('Bir odayı ist ile anlatırken sıfat yalın kalır: Das Zimmer ist hell.','After ist, the adjective describing a room stays unchanged: Das Zimmer ist hell.','بعد ist تبقى الصفة دون تغيير: Das Zimmer ist hell.','Після ist прикметник не змінюється: Das Zimmer ist hell.','Après ist, l’adjectif reste inchangé : Das Zimmer ist hell.','Nach ist bleibt das Adjektiv unverändert: Das Zimmer ist hell.'),
 possessive:tx('Bizim: unser / unsere. Sizin: euer / eure. die ve çoğul isimlerle unsere / eure kullanılır. euer → eure olur.','Our: unser / unsere. Your, plural informal: euer / eure. Use unsere / eure with feminine or plural nouns.','لنا: unser / unsere. لكم: euer / eure. مع المؤنث والجمع نستخدم unsere / eure.','Наш: unser / unsere. Ваш: euer / eure. З жіночим родом і множиною — unsere / eure.','Notre : unser / unsere. Votre au pluriel familier : euer / eure. Avec le féminin ou le pluriel : unsere / eure.','wir: unser / unsere; ihr: euer / eure. Bei femininen Nomen und im Plural: unsere / eure.'),
 haben:tx('Perfekt: özne + çekimli haben + diğer bilgiler + Partizip II. ich habe, du hast, er/sie hat, wir/ihr/sie: haben/habt/haben.','Perfect tense: subject + conjugated haben + other information + past participle at the end.','الماضي التام: الفاعل + تصريف haben + بقية الجملة + اسم المفعول في النهاية.','Perfekt: підмет + відмінюване haben + решта речення + дієприкметник наприкінці.','Perfekt : sujet + haben conjugué + autres informations + participe passé à la fin.','Perfekt: Subjekt + konjugiertes haben + weitere Angaben + Partizip II am Satzende.'),
 regular:tx('Düzenli fiillerde Partizip II genellikle ge- + kök + -t olur. arbeiten → gearbeitet; reden → geredet.','Regular verbs usually form the participle with ge- + stem + -t. arbeiten → gearbeitet; reden → geredet.','غالبًا يكون اسم المفعول للفعل المنتظم ge- + الجذر + -t. arbeiten → gearbeitet.','Регулярні дієслова: зазвичай ge- + основа + -t. arbeiten → gearbeitet.','Verbes réguliers : généralement ge- + radical + -t. arbeiten → gearbeitet.','Regelmäßige Verben: meist ge- + Stamm + -t. arbeiten → gearbeitet; reden → geredet.'),
 irregular:tx('Bu fiilin Partizip II biçimini ayrıca öğren. Birçok düzensiz fiil -en ile biter: lesen → gelesen, finden → gefunden.','Learn this past participle separately. Many irregular forms end in -en: lesen → gelesen, finden → gefunden.','تعلّم هذه الصيغة وحدها. كثير من الأفعال غير المنتظمة تنتهي بـ -en: lesen → gelesen.','Вчи цю форму окремо. Багато нерегулярних форм закінчуються на -en: lesen → gelesen.','Apprends cette forme séparément. Beaucoup de participes irréguliers finissent en -en : lesen → gelesen.','Lerne diese Form einzeln. Viele unregelmäßige Formen enden auf -en: lesen → gelesen, finden → gefunden.'),
 notice:tx('Duyuruda yer, kişi ve saat bilgisini ayrı ayrı bul. dürfen izin; dürfen nicht yasak bildirir.','Find the place, person and time in the notice. dürfen expresses permission; dürfen nicht expresses a ban.','ابحث عن المكان والشخص والوقت. dürfen للإذن وdürfen nicht للمنع.','Знайди місце, особу й час. dürfen означає дозвіл, dürfen nicht — заборону.','Repère le lieu, la personne et l’heure. dürfen indique une permission, dürfen nicht une interdiction.','Achte auf Ort, Person und Zeit. dürfen zeigt Erlaubnis, dürfen nicht ein Verbot.'),
 polite:tx('Kibar bir istekte Können Sie …? veya Haben Sie …? kullan. Yardım için mir, iyilik için bitte ve teşekkür kullanabilirsin.','Use Können Sie …? or Haben Sie …? for polite requests. mir means to me; bitte makes the request polite.','للطلب المهذب استعمل Können Sie …? أو Haben Sie …? وأضف bitte للشكر واللطف.','Для ввічливого прохання: Können Sie …? або Haben Sie …? Додай bitte.','Pour une demande polie : Können Sie …? ou Haben Sie …? Ajoute bitte.','Für höfliche Bitten: Können Sie …? oder Haben Sie …? Benutze bitte und bedanke dich.'),
 order:tx('Normal cümlede çekimli fiil ikinci konumdadır. Evet/hayır sorusunda başa gelir. Perfekt biçimi cümlenin sonunda kalır.','The conjugated verb is second in statements and first in yes/no questions. The participle stays at the end.','الفعل المصرف في الموضع الثاني في الخبر والأول في سؤال نعم/لا. اسم المفعول في النهاية.','У твердженні дієслово на другому місці, у питанні так/ні — на першому. Дієприкметник наприкінці.','Le verbe conjugué est en deuxième position dans l’énoncé et en première dans une question oui/non. Le participe est à la fin.','Aussagesatz: Verb auf Position 2. Ja/Nein-Frage: Verb auf Position 1. Partizip II am Ende.'),
 reading:tx('Cevabı metindeki bilgiye göre yaz. zuerst = önce, dann = sonra; schon = zaten, noch nicht = henüz değil.','Answer from the text. zuerst = first, dann = then; schon = already, noch nicht = not yet.','أجب حسب النص. zuerst أولًا، dann ثم، schon بالفعل، noch nicht ليس بعد.','Відповідай за текстом. zuerst — спочатку, dann — потім, schon — вже, noch nicht — ще ні.','Réponds selon le texte. zuerst = d’abord, dann = ensuite, schon = déjà, noch nicht = pas encore.','Antworte mit Informationen aus dem Text. Achte auf zuerst, dann, schon und noch nicht.'),
 email:tx('Kısa e-postada hitapla başla, yaşadıklarını Perfekt ile anlat ve bir selamla bitir.','Start a short email with a greeting, describe events in the perfect tense and finish with a closing.','ابدأ البريد بتحية، احكِ الأحداث بصيغة Perfekt واختم بتحية.','Почни лист зі звертання, опиши події в Perfekt і закінчи привітанням.','Commence le message par une formule d’adresse, raconte au Perfekt puis termine par une salutation.','Beginne die E-Mail mit einer Anrede, berichte im Perfekt und schließe mit einem Gruß.'),
};
export type HousingRule=keyof typeof housingRules;
export const housingNotes:Record<HousingSection,{step:number;rule:HousingRule;example:string;meaning:Translations}[]>={
 a:[{step:1,rule:'possessive',example:'Unser Wohnzimmer ist hell. Eure Küche ist klein.',meaning:tx('Bizim oturma odamız aydınlık. Sizin mutfağınız küçük.','Our living room is bright. Your kitchen is small.','غرفة معيشتنا مضيئة. مطبخكم صغير.','Наша вітальня світла. Ваша кухня маленька.','Notre salon est lumineux. Votre cuisine est petite.')},{step:2,rule:'adjective',example:'Die Wohnung ist ruhig. Die Miete ist teuer.',meaning:tx('Daire sakin. Kira pahalı.','The flat is quiet. The rent is expensive.','الشقة هادئة. الإيجار غالٍ.','Квартира тиха. Оренда дорога.','L’appartement est calme. Le loyer est cher.')},{step:3,rule:'order',example:'Unsere Wohnung hat zwei Zimmer und einen Balkon.',meaning:tx('Bizim dairemizde iki oda ve bir balkon var.','Our flat has two rooms and a balcony.','في شقتنا غرفتان وشرفة.','У нашій квартирі дві кімнати й балкон.','Notre appartement a deux pièces et un balcon.')}],
 b:[{step:1,rule:'haben',example:'Ich habe eine Wohnung gefunden.',meaning:tx('Bir daire buldum.','I found a flat.','وجدت شقة.','Я знайшов квартиру.','J’ai trouvé un appartement.')},{step:2,rule:'regular',example:'Wir haben gekocht. Er hat geschlafen.',meaning:tx('Yemek pişirdik. O uyudu.','We cooked. He slept.','طبخنا. هو نام.','Ми готували. Він спав.','Nous avons cuisiné. Il a dormi.')},{step:3,rule:'email',example:'Liebe Mila, am Samstag habe ich geputzt. Liebe Grüße, Deniz',meaning:tx('Sevgili Mila, cumartesi günü temizlik yaptım. Sevgiler, Deniz.','Dear Mila, I cleaned on Saturday. Best wishes, Deniz.','عزيزتي ميلا، نظفت يوم السبت. مع التحية، دينيز.','Люба Міло, у суботу я прибрав. З найкращими побажаннями, Деніз.','Chère Mila, samedi j’ai fait le ménage. Amitiés, Deniz.')}],
 c:[{step:1,rule:'notice',example:'Das Paket ist bei Ihrem Nachbarn.',meaning:tx('Paket komşunuzda.','The parcel is with your neighbour.','الطرد عند جاركم.','Посилка у вашого сусіда.','Le colis est chez votre voisin.')},{step:2,rule:'polite',example:'Können Sie bitte unsere Blumen gießen?',meaning:tx('Lütfen bizim çiçeklerimizi sulayabilir misiniz?','Could you please water our flowers?','هل يمكنكم سقي أزهارنا من فضلكم؟','Чи можете ви, будь ласка, полити наші квіти?','Pouvez-vous arroser nos fleurs, s’il vous plaît ?')}],
 d:[{step:1,rule:'reading',example:'Zuerst habe ich im Internet gesucht. Dann habe ich Freunde gefragt.',meaning:tx('Önce internette aradım. Sonra arkadaşlarıma sordum.','First I searched online. Then I asked friends.','بحثت أولًا على الإنترنت، ثم سألت أصدقائي.','Спочатку я шукав в інтернеті, потім запитав друзів.','J’ai d’abord cherché sur Internet, puis demandé à des amis.')},{step:2,rule:'irregular',example:'fragen → gefragt · finden → gefunden · schreiben → geschrieben',meaning:tx('sormak → sordu · bulmak → buldu · yazmak → yazdı','ask → asked · find → found · write → wrote','يسأل ← سأل · يجد ← وجد · يكتب ← كتب','питати → запитав · знаходити → знайшов · писати → написав','demander → demandé · trouver → trouvé · écrire → écrit')},{step:3,rule:'order',example:'Was hast du am Wochenende gemacht?',meaning:tx('Hafta sonunda ne yaptın?','What did you do at the weekend?','ماذا فعلت في عطلة نهاية الأسبوع؟','Що ти робив на вихідних?','Qu’as-tu fait pendant le week-end ?')}],
};

const exercises:HousingExercise[]=[];
function make(section:HousingSection,step:number,id:string,answer:string,meaning:Translations,rule:HousingRule,extra:Partial<HousingExercise>={}):HousingExercise{
 const gap=extra.gap;const resultDe=extra.resultDe??(gap?gap.replace('___',answer):answer);
 return {id:'housing-11-'+section+'-'+id,topic:'book-11-'+section,section,step,kind:'write',writingTask:gap?'gap':'sentence',prompt:gap?'Boşluğu Almanca yazarak tamamla.':'Anlamı verilen ifadeyi Almanca yaz.',answer,answerTr:meaning[0],meaning,cueDe:'Ergänze den Satz.',resultDe,rule,explanation:resultDe+' = '+meaning[0]+' '+housingRules[rule][0],...extra};
}
function add(section:HousingSection,step:number,id:string,answer:string,meaning:Translations,rule:HousingRule,extra:Partial<HousingExercise>={}){
 const q=make(section,step,id,answer,meaning,rule,extra);exercises.push(q);return q;
}
function words(section:HousingSection,step:number,rows:string){
 const parsed=rows.trim().split('\n').map(line=>line.split('|'));
 for(const [id,de,tr,en,ar,uk,fr,definition,art] of parsed){
  const alternatives=parsed.filter(row=>row[0]!==id).slice(0,3).map(row=>row[1]);
  add(section,step,'word-'+id,de,tx(tr,en,ar,uk,fr,de),de.startsWith('der ')||de.startsWith('die ')||de.startsWith('das ')?'noun':'adjective',{writingTask:'word',cueDe:definition,art});
  const q=exercises.at(-1)!;
  if(alternatives.length===3)exercises.push({...q,id:q.id+'-test',kind:'choice',options:[de,...alternatives]});
 }
}
words('a',1,`haus|das Haus|ev|house|بيت|будинок|maison|Ein Gebäude zum Wohnen.|dach
wohnung|die Wohnung|daire|flat / apartment|شقة|квартира|appartement|Mehrere Räume in einem Haus zum Wohnen.
wg|die Wohngemeinschaft|paylaşımlı ev|shared flat|سكن مشترك|спільна квартира|colocation|Mehrere Personen teilen sich eine Wohnung.
wohnzimmer|das Wohnzimmer|oturma odası|living room|غرفة المعيشة|вітальня|salon|Hier sitzen die Familie und die Gäste.|sessel
schlafzimmer|das Schlafzimmer|yatak odası|bedroom|غرفة النوم|спальня|chambre|Hier schläfst du nachts.|bett
kinderzimmer|das Kinderzimmer|çocuk odası|children’s room|غرفة الأطفال|дитяча кімната|chambre d’enfant|Das Zimmer für ein Kind.
kueche|die Küche|mutfak|kitchen|مطبخ|кухня|cuisine|Hier kochst du.|kueche
bad|das Bad|banyo|bathroom|حمّام|ванна кімната|salle de bains|Hier wäschst du dich.|bad
toilette|die Toilette|tuvalet|toilet|مرحاض|туалет|toilettes|Hier gehst du zur Toilette.
balkon|der Balkon|balkon|balcony|شرفة|балкон|balcon|Ein Platz draußen an der Wohnung.
flur|der Flur|koridor|hallway|ممر|коридор|couloir|Von hier gehst du in die anderen Zimmer.
moebel|die Möbel|mobilyalar|furniture|أثاث|меблі|meubles|Tische, Stühle und Schränke zusammen.|tisch`);
words('a',2,`lampe|die Lampe|lamba|lamp|مصباح|лампа|lampe|Sie macht Licht.|lampe
stuhl|der Stuhl|sandalye|chair|كرسي|стілець|chaise|Du sitzt darauf. Er hat eine Rückenlehne.|stuhl
bett|das Bett|yatak|bed|سرير|ліжко|lit|Du schläfst darin.|bett
tisch|der Tisch|masa|table|طاولة|стіл|table|Hier stehen die Teller.|tisch
sofa|das Sofa|kanepe|sofa|أريكة|диван|canapé|Mehrere Personen können darauf sitzen.|sofa
schrank|der Schrank|dolap|cupboard|خزانة|шафа|armoire|Er hat Türen und Platz für Kleidung.|schrank
hell|hell|aydınlık|bright|مضيء|світлий|lumineux|Es gibt viel Licht.
dunkel|dunkel|karanlık|dark|مظلم|темний|sombre|Es gibt wenig Licht.
laut|laut|gürültülü|noisy|صاخب|шумний|bruyant|Du hörst viel Lärm.
ruhig|ruhig|sakin / sessiz|quiet|هادئ|тихий|calme|Du hörst wenig Lärm.
billig|billig|ucuz|cheap|رخيص|дешевий|bon marché|Es kostet wenig Geld.
teuer|teuer|pahalı|expensive|غالٍ|дорогий|cher|Es kostet viel Geld.`);

const aGaps:[string,string,string,Translations][]=[
 ['unser','___ Wohnzimmer ist groß.','Unser',tx('Bizim oturma odamız büyük.','Our living room is big.','غرفة معيشتنا كبيرة.','Наша вітальня велика.','Notre salon est grand.')],
 ['unsere','___ Küche ist hell.','Unsere',tx('Bizim mutfağımız aydınlık.','Our kitchen is bright.','مطبخنا مضيء.','Наша кухня світла.','Notre cuisine est lumineuse.')],
 ['unser-bad','___ Bad ist klein.','Unser',tx('Bizim banyomuz küçük.','Our bathroom is small.','حمّامنا صغير.','Наша ванна кімната маленька.','Notre salle de bains est petite.')],
 ['unsere-zimmer','___ Zimmer sind ruhig.','Unsere',tx('Bizim odalarımız sessiz.','Our rooms are quiet.','غرفنا هادئة.','Наші кімнати тихі.','Nos pièces sont calmes.')],
 ['euer','Ist ___ Flur lang?','euer',tx('Sizin koridorunuz uzun mu?','Is your hallway long?','هل ممركم طويل؟','Ваш коридор довгий?','Votre couloir est-il long ?')],
 ['eure','Ist ___ Wohnung teuer?','eure',tx('Sizin daireniz pahalı mı?','Is your flat expensive?','هل شقتكم غالية؟','Ваша квартира дорога?','Votre appartement est-il cher ?')],
 ['euer-zimmer','Ist ___ Zimmer dunkel?','euer',tx('Sizin odanız karanlık mı?','Is your room dark?','هل غرفتكم مظلمة؟','Ваша кімната темна?','Votre chambre est-elle sombre ?')],
 ['eure-stuehle','Sind ___ Stühle neu?','eure',tx('Sizin sandalyeleriniz yeni mi?','Are your chairs new?','هل كراسيكم جديدة؟','Ваші стільці нові?','Vos chaises sont-elles neuves ?')],
];
for(const [id,gap,answer,meaning] of aGaps)add('a',1,'possessive-'+id,answer,meaning,'possessive',{gap,cueDe:gap+(id.startsWith('euer')||id.startsWith('eure')?' (ihr)':' (wir)')});

const sentence=(section:HousingSection,step:number,id:string,de:string,meaning:Translations,rule:HousingRule='order')=>add(section,step,id,de,meaning,rule,{cueDe:'Bilde einen Satz aus den Wörtern.',wordBank:de.replace(/[.!?]/g,'').split(' ').reverse()});
sentence('a',3,'two-rooms','Unsere Wohnung hat zwei Zimmer.',tx('Bizim dairemizde iki oda var.','Our flat has two rooms.','في شقتنا غرفتان.','У нашій квартирі дві кімнати.','Notre appartement a deux pièces.'));
sentence('a',3,'balcony','Die Wohnung hat einen Balkon.',tx('Dairede bir balkon var.','The flat has a balcony.','في الشقة شرفة.','У квартирі є балкон.','L’appartement a un balcon.'));
sentence('a',3,'living-room','Unser Wohnzimmer ist groß und hell.',tx('Bizim oturma odamız büyük ve aydınlık.','Our living room is big and bright.','غرفة معيشتنا كبيرة ومضيئة.','Наша вітальня велика й світла.','Notre salon est grand et lumineux.'));
sentence('a',3,'kitchen-question','Wie ist eure Küche?',tx('Sizin mutfağınız nasıl?','What is your kitchen like?','كيف مطبخكم؟','Яка ваша кухня?','Comment est votre cuisine ?'),'possessive');
sentence('a',3,'toilet','Entschuldigung, wo ist die Toilette?',tx('Affedersiniz, tuvalet nerede?','Excuse me, where is the toilet?','عذرًا، أين المرحاض؟','Вибачте, де туалет?','Excusez-moi, où sont les toilettes ?'),'polite');
sentence('a',3,'furniture','Wir brauchen einen Tisch.',tx('Bir masaya ihtiyacımız var.','We need a table.','نحتاج إلى طاولة.','Нам потрібен стіл.','Nous avons besoin d’une table.'));

const verbRows=`suchen|gesucht|aramak|search|يبحث|шукати|chercher|regular
fragen|gefragt|sormak|ask|يسأل|питати|demander|regular
lesen|gelesen|okumak|read|يقرأ|читати|lire|irregular
schreiben|geschrieben|yazmak|write|يكتب|писати|écrire|irregular
finden|gefunden|bulmak|find|يجد|знаходити|trouver|irregular
sehen|gesehen|görmek|see|يرى|бачити|voir|irregular
mieten|gemietet|kiralamak|rent|يستأجر|орендувати|louer|regular
machen|gemacht|yapmak|do / make|يفعل|робити|faire|regular
kaufen|gekauft|satın almak|buy|يشتري|купувати|acheter|regular
putzen|geputzt|temizlik yapmak|clean|ينظف|прибирати|nettoyer|regular
kochen|gekocht|yemek pişirmek|cook|يطبخ|готувати|cuisiner|regular
reden|geredet|konuşmak|talk|يتحدث|розмовляти|parler|regular
schlafen|geschlafen|uyumak|sleep|ينام|спати|dormir|irregular
essen|gegessen|yemek yemek|eat|يأكل|їсти|manger|irregular
trinken|getrunken|içmek|drink|يشرب|пити|boire|irregular
hängen|gehängt|bir şeyi asmak|hang something|يعلّق شيئًا|вішати щось|accrocher quelque chose|regular
wohnen|gewohnt|oturmak / ikamet etmek|live / reside|يسكن|мешкати|habiter|regular
spielen|gespielt|oynamak|play|يلعب|грати|jouer|regular
arbeiten|gearbeitet|çalışmak|work|يعمل|працювати|travailler|regular
duschen|geduscht|duş almak|shower|يستحم|приймати душ|se doucher|regular
frühstücken|gefrühstückt|kahvaltı yapmak|have breakfast|يتناول الفطور|снідати|prendre le petit-déjeuner|regular
surfen|gesurft|internette gezinmek|surf the internet|يتصفح الإنترنت|переглядати інтернет|surfer sur Internet|regular
grillen|gegrillt|ızgara yapmak|barbecue|يشوي|готувати на грилі|faire un barbecue|regular`.split('\n').map(row=>row.split('|'));
export const housingVerbCards=verbRows.map(([verb,participle,tr,en,ar,uk,fr,rule])=>({verb,participle,meaning:tx(tr,en,ar,uk,fr,verb),rule:rule as HousingRule}));
for(const [i,v] of housingVerbCards.entries()){
 if(i<17)add('b',i<7?1:2,'participle-'+v.verb,v.participle,v.meaning,v.rule,{writingTask:'word',cueDe:v.verb+' → Partizip II',gap:'Ich habe ___ . ('+v.verb+')',resultDe:v.verb+' → '+v.participle});
 add('d',2,'card-'+v.verb,v.participle,v.meaning,v.rule,{writingTask:'word',cueDe:v.verb+' → Partizip II',gap:v.verb+' → ___',resultDe:v.verb+' → '+v.participle});
}
const habenRows:[string,string,string,Translations][]=[
 ['ich','Ich ___ eine Wohnung gefunden.','habe',tx('Bir daire buldum.','I found a flat.','وجدت شقة.','Я знайшов квартиру.','J’ai trouvé un appartement.')],
 ['du','Du ___ eine Nachricht geschrieben.','hast',tx('Bir mesaj yazdın.','You wrote a message.','كتبت رسالة.','Ти написав повідомлення.','Tu as écrit un message.')],
 ['er','Er ___ eine Anzeige gelesen.','hat',tx('O bir ilan okudu.','He read an advert.','هو قرأ إعلانًا.','Він прочитав оголошення.','Il a lu une annonce.')],
 ['wir','Wir ___ die Wohnung geputzt.','haben',tx('Daireyi temizledik.','We cleaned the flat.','نظفنا الشقة.','Ми прибрали квартиру.','Nous avons nettoyé l’appartement.')],
 ['ihr','Ihr ___ zusammen gekocht.','habt',tx('Birlikte yemek pişirdiniz.','You cooked together.','طبختم معًا.','Ви готували разом.','Vous avez cuisiné ensemble.')],
 ['sie','Sie ___ eine Lampe gekauft. (onlar)','haben',tx('Onlar bir lamba satın aldı.','They bought a lamp.','اشتروا مصباحًا.','Вони купили лампу.','Ils ont acheté une lampe.')],
];
for(const [id,gap,answer,meaning] of habenRows)add('b',1,'haben-'+id,answer,meaning,'haben',{gap:gap.replace('(onlar)','(Plural)'),cueDe:gap.replace('(onlar)','(Plural)'),resultDe:gap.replace('___',answer).replace(' (onlar)','')});
sentence('b',2,'move','Am Samstag haben wir den Umzug gemacht.',tx('Cumartesi günü taşınmayı yaptık.','We moved on Saturday.','انتقلنا يوم السبت.','У суботу ми переїхали.','Nous avons déménagé samedi.'),'haben');
sentence('b',2,'purchase','Wir haben eine Lampe gekauft.',tx('Bir lamba satın aldık.','We bought a lamp.','اشترينا مصباحًا.','Ми купили лампу.','Nous avons acheté une lampe.'),'haben');
sentence('b',2,'cook','Gestern habe ich gekocht.',tx('Dün yemek pişirdim.','I cooked yesterday.','طبخت أمس.','Учора я готував.','Hier, j’ai cuisiné.'),'haben');
sentence('b',2,'sleep','Am Sonntag haben wir lange geschlafen.',tx('Pazar günü uzun süre uyuduk.','We slept for a long time on Sunday.','نمنا طويلًا يوم الأحد.','У неділю ми довго спали.','Dimanche, nous avons dormi longtemps.'),'haben');
sentence('b',2,'eat','Wir haben zusammen gegessen.',tx('Birlikte yemek yedik.','We ate together.','أكلنا معًا.','Ми їли разом.','Nous avons mangé ensemble.'),'haben');
sentence('b',2,'search-question','Wie habt ihr die Wohnung gefunden?',tx('Daireyi nasıl buldunuz?','How did you find the flat?','كيف وجدتم الشقة؟','Як ви знайшли квартиру?','Comment avez-vous trouvé l’appartement ?'),'haben');
sentence('b',3,'email-greeting','Liebe Mila,',tx('Sevgili Mila,','Dear Mila,','عزيزتي ميلا،','Люба Міло,','Chère Mila,'),'email');
sentence('b',3,'email-found','Wir haben eine Wohnung gefunden.',tx('Bir daire bulduk.','We found a flat.','وجدنا شقة.','Ми знайшли квартиру.','Nous avons trouvé un appartement.'),'email');
sentence('b',3,'email-clean','Am Wochenende haben wir geputzt.',tx('Hafta sonunda temizlik yaptık.','We cleaned at the weekend.','نظفنا في عطلة نهاية الأسبوع.','На вихідних ми прибрали.','Nous avons fait le ménage pendant le week-end.'),'email');
sentence('b',3,'email-close','Liebe Grüße,',tx('Sevgiler,','Best wishes,','مع أطيب التحيات،','З найкращими побажаннями,','Amitiés,'),'email');

words('c',1,`hausmeister|der Hausmeister|bina görevlisi|caretaker|مسؤول المبنى|доглядач будинку|concierge|Er kümmert sich um das Haus.
schluessel|der Schlüssel|anahtar|key|مفتاح|ключ|clé|Damit öffnest du eine Tür.
paket|das Paket|paket / kargo|parcel|طرد|посилка|colis|Die Post bringt es zu dir.|karton
nachbar|der Nachbar|erkek komşu|male neighbour|جار|сусід|voisin|Ein Mann, der neben dir wohnt.
nachbarin|die Nachbarin|kadın komşu|female neighbour|جارة|сусідка|voisine|Eine Frau, die neben dir wohnt.
treppenhaus|das Treppenhaus|apartmanın merdiven bölümü|stairwell|درج المبنى|сходова клітка|cage d’escalier|Hier sind die Treppen im Haus.|treppe
fahrradkeller|der Fahrradkeller|bisiklet deposu|bicycle cellar|قبو الدراجات|підвал для велосипедів|local à vélos|Hier stellst du Fahrräder ab.|keller
kinderwagen|der Kinderwagen|bebek arabası|pram / stroller|عربة أطفال|дитячий візок|poussette|Du schiebst ein kleines Kind darin.
hammer|der Hammer|çekiç|hammer|مطرقة|молоток|marteau|Damit schlägst du einen Nagel in die Wand.
zucker|der Zucker|şeker|sugar|سكر|цукор|sucre|Er ist süß und du brauchst ihn zum Backen.`);
const notices:[string,string,string,Translations,string][]=[
 ['bike','Fahrräder bitte im ___ abstellen!','Fahrradkeller',tx('Bisikletleri lütfen bisiklet deposuna bırakın.','Please park bicycles in the bicycle cellar.','ضعوا الدراجات في قبو الدراجات من فضلكم.','Будь ласка, залишайте велосипеди в підвалі для велосипедів.','Veuillez ranger les vélos dans le local à vélos.'),'Fahrräder gehören in den Raum für Fahrräder.'],
 ['ban','Kinderwagen dürfen ___ im Treppenhaus stehen.','nicht',tx('Bebek arabaları apartmanın merdiven bölümünde duramaz.','Prams must not stand in the stairwell.','لا يجوز وضع عربات الأطفال في درج المبنى.','Дитячі візки не можна залишати на сходовій клітці.','Les poussettes ne doivent pas rester dans la cage d’escalier.'),'Das ist verboten.'],
 ['parcel','Ihr Paket ist bei Ihrem ___.','Nachbarn',tx('Paketiniz komşunuzda.','Your parcel is with your neighbour.','طردكم عند جاركم.','Ваша посилка у вашого сусіда.','Votre colis est chez votre voisin.'),'Nicht bei der Post: neben Ihrer Wohnung.'],
 ['key','Hat jemand meinen Schlüssel ___? (finden)','gefunden',tx('Birisi anahtarımı buldu mu?','Has anyone found my key?','هل وجد أحد مفتاحي؟','Хтось знайшов мій ключ?','Quelqu’un a-t-il trouvé ma clé ?'),'Schreibe die Perfekt-Form von finden.'],
 ['return','Bitte den Schlüssel beim Hausmeister ___.','abgeben',tx('Lütfen anahtarı bina görevlisine teslim edin.','Please hand the key to the caretaker.','سلّموا المفتاح لمسؤول المبنى من فضلكم.','Будь ласка, передайте ключ доглядачеві будинку.','Veuillez remettre la clé au concierge.'),'Du gibst den Schlüssel dem Hausmeister.'],
 ['time','Der Hausmeister ist von neun ___ zwölf Uhr da.','bis',tx('Bina görevlisi saat dokuzdan on ikiye kadar orada.','The caretaker is there from nine until twelve.','مسؤول المبنى موجود من التاسعة حتى الثانية عشرة.','Доглядач працює з дев’ятої до дванадцятої.','Le concierge est présent de neuf heures à midi.'),'Schreibe das Wort für das Ende des Zeitraums.'],
];
for(const [id,gap,answer,meaning,cueDe] of notices)add('c',1,'notice-'+id,answer,meaning,'notice',{gap,cueDe});
sentence('c',2,'help','Können Sie mir helfen?',tx('Bana yardım edebilir misiniz?','Could you help me?','هل يمكنكم مساعدتي؟','Чи можете ви мені допомогти?','Pouvez-vous m’aider ?'),'polite');
sentence('c',2,'request','Ich habe eine Bitte.',tx('Bir ricam var.','I have a request.','لدي طلب.','У мене є прохання.','J’ai une demande.'),'polite');
sentence('c',2,'flowers','Können Sie bitte unsere Blumen gießen?',tx('Lütfen bizim çiçeklerimizi sulayabilir misiniz?','Could you please water our flowers?','هل يمكنكم سقي أزهارنا من فضلكم؟','Чи можете ви, будь ласка, полити наші квіти?','Pouvez-vous arroser nos fleurs, s’il vous plaît ?'),'polite');
sentence('c',2,'sugar','Haben Sie eine Tasse Zucker?',tx('Bir fincan şekeriniz var mı?','Do you have a cup of sugar?','هل لديكم فنجان من السكر؟','Чи маєте ви чашку цукру?','Avez-vous une tasse de sucre ?'),'polite');
sentence('c',2,'hammer','Haben Sie einen Hammer?',tx('Bir çekiciniz var mı?','Do you have a hammer?','هل لديكم مطرقة؟','Чи маєте ви молоток?','Avez-vous un marteau ?'),'polite');
sentence('c',2,'thanks','Danke, das ist nett.',tx('Teşekkürler, çok naziksiniz.','Thank you, that is kind.','شكرًا، هذا لطف منكم.','Дякую, це дуже люб’язно.','Merci, c’est gentil.'),'polite');
sentence('c',2,'new-neighbour','Guten Tag, ich bin neu hier.',tx('İyi günler, ben burada yeniyim.','Hello, I am new here.','مرحبًا، أنا جديد هنا.','Добрий день, я тут новий.','Bonjour, je suis nouveau ici.'),'polite');
sentence('c',2,'know','Ich kenne meine Nachbarn gut.',tx('Komşularımı iyi tanıyorum.','I know my neighbours well.','أعرف جيراني جيدًا.','Я добре знаю своїх сусідів.','Je connais bien mes voisins.'),'polite');

const story='Mira sucht eine Wohnung mit zwei Zimmern. Zuerst hat sie im Internet gesucht. Die Wohnungen waren teuer. Dann hat sie Freunde gefragt. Ein Freund hat einen Zettel im Café gesehen. Mira hat eine Nachricht geschrieben. Jetzt hat sie eine Wohnung mit Balkon.';
const storyMeaning=tx('Mira iki odalı bir daire arıyor. Önce internette aradı. Daireler pahalıydı. Sonra arkadaşlarına sordu. Bir arkadaşı kafede bir not gördü. Mira bir mesaj yazdı. Şimdi balkonlu bir dairesi var.','Mira wants a two-room flat. First she searched online. The flats were expensive. Then she asked friends. A friend saw a notice in a café. Mira wrote a message. Now she has a flat with a balcony.','تبحث ميرا عن شقة بغرفتين. بحثت أولًا على الإنترنت وكانت الشقق غالية. ثم سألت أصدقاءها. رأى صديق إعلانًا في مقهى. كتبت ميرا رسالة. ولديها الآن شقة بشرفة.','Міра шукає двокімнатну квартиру. Спочатку вона шукала в інтернеті, але квартири були дорогими. Потім запитала друзів. Друг побачив оголошення в кафе. Міра написала повідомлення. Тепер у неї квартира з балконом.','Mira cherche un appartement de deux pièces. Elle a d’abord cherché sur Internet, mais les logements étaient chers. Puis elle a demandé à des amis. Un ami a vu une annonce dans un café. Mira a écrit un message. Elle a maintenant un appartement avec un balcon.');
const reads:[string,string,string,Translations][]=[
 ['rooms','Mira sucht eine Wohnung mit ___ Zimmern.','zwei',tx('Mira iki odalı bir daire arıyor.','Mira is looking for a two-room flat.','تبحث ميرا عن شقة بغرفتين.','Міра шукає двокімнатну квартиру.','Mira cherche un appartement de deux pièces.')],
 ['online','Zuerst hat Mira im ___ gesucht.','Internet',tx('Mira önce internette aradı.','First Mira searched online.','بحثت ميرا أولًا على الإنترنت.','Спочатку Міра шукала в інтернеті.','Mira a d’abord cherché sur Internet.')],
 ['price','Die Wohnungen waren ___.','teuer',tx('Daireler pahalıydı.','The flats were expensive.','كانت الشقق غالية.','Квартири були дорогими.','Les appartements étaient chers.')],
 ['friends','Dann hat Mira ihre Freunde ___.','gefragt',tx('Mira sonra arkadaşlarına sordu.','Then Mira asked her friends.','ثم سألت ميرا أصدقاءها.','Потім Міра запитала своїх друзів.','Mira a ensuite demandé à ses amis.')],
 ['notice','Ein Freund hat einen Zettel im ___ gesehen.','Café',tx('Bir arkadaşı kafede bir not gördü.','A friend saw a notice in a café.','رأى صديق إعلانًا في مقهى.','Друг побачив оголошення в кафе.','Un ami a vu une annonce dans un café.')],
 ['message','Mira hat eine Nachricht ___.','geschrieben',tx('Mira bir mesaj yazdı.','Mira wrote a message.','كتبت ميرا رسالة.','Міра написала повідомлення.','Mira a écrit un message.')],
 ['balcony','Jetzt hat Mira eine Wohnung mit ___.','Balkon',tx('Mira’nın şimdi balkonlu bir dairesi var.','Mira now has a flat with a balcony.','لدى ميرا الآن شقة بشرفة.','Тепер у Міри квартира з балконом.','Mira a maintenant un appartement avec un balcon.')],
];
for(const [id,gap,answer,meaning] of reads)add('d',1,'reading-'+id,answer,meaning,'reading',{gap,passage:story,passageTr:storyMeaning[0],passageMeaning:storyMeaning,cueDe:'Lies den Text und ergänze den Satz.'});
sentence('d',3,'weekend-question','Was hast du am Wochenende gemacht?',tx('Hafta sonunda ne yaptın?','What did you do at the weekend?','ماذا فعلت في عطلة نهاية الأسبوع؟','Що ти робив на вихідних?','Qu’as-tu fait pendant le week-end ?'),'haben');
sentence('d',3,'work-question','Hast du gestern gearbeitet?',tx('Dün çalıştın mı?','Did you work yesterday?','هل عملت أمس؟','Ти вчора працював?','As-tu travaillé hier ?'),'haben');
sentence('d',3,'breakfast-question','Habt ihr heute gefrühstückt?',tx('Bugün kahvaltı yaptınız mı?','Did you have breakfast today?','هل تناولتم الفطور اليوم؟','Ви сьогодні снідали?','Avez-vous pris le petit-déjeuner aujourd’hui ?'),'haben');
sentence('d',3,'first','Zuerst habe ich eine Anzeige gelesen.',tx('Önce bir ilan okudum.','First I read an advert.','قرأت إعلانًا أولًا.','Спочатку я прочитав оголошення.','J’ai d’abord lu une annonce.'),'haben');
sentence('d',3,'then','Dann habe ich eine Nachricht geschrieben.',tx('Sonra bir mesaj yazdım.','Then I wrote a message.','ثم كتبت رسالة.','Потім я написав повідомлення.','Puis j’ai écrit un message.'),'haben');
sentence('d',3,'not-yet','Ich habe noch keine Wohnung gefunden.',tx('Henüz bir daire bulamadım.','I have not found a flat yet.','لم أجد شقة بعد.','Я ще не знайшов квартиру.','Je n’ai pas encore trouvé d’appartement.'),'reading');
sentence('d',3,'one-year','Ich habe ein Jahr gesucht.',tx('Bir yıl aradım.','I searched for a year.','بحثت لمدة سنة.','Я шукав протягом року.','J’ai cherché pendant un an.'),'haben');

const sentenceVariants:Record<string,string[]>={
 'housing-11-b-move':['Wir haben am Samstag den Umzug gemacht.'],
 'housing-11-b-cook':['Ich habe gestern gekocht.'],
 'housing-11-b-sleep':['Wir haben am Sonntag lange geschlafen.'],
 'housing-11-b-email-clean':['Wir haben am Wochenende geputzt.'],
 'housing-11-c-help':['Können Sie mir bitte helfen?'],
 'housing-11-c-flowers':['Können Sie unsere Blumen bitte gießen?'],
};
for(const exercise of exercises)if(sentenceVariants[exercise.id])exercise.accepted=sentenceVariants[exercise.id];

// Every gap gets a four-option counterpart. Full-sentence work stays written.
const gapQuestions=exercises.filter(q=>q.kind==='write'&&!!q.gap);
for(const q of gapQuestions){
 let wrong:string[];
 if(q.rule==='possessive')wrong=['unser','unsere','euer','eure','mein','meine'];
 else if(q.id.includes('-haben-'))wrong=['habe','hast','hat','haben','habt'];
 else if(q.id.includes('-participle-')||q.id.includes('-card-')){
  const verb=housingVerbCards.find(v=>q.id.endsWith('-'+v.verb))!;wrong=[verb.verb,...housingVerbCards.filter(v=>v.participle!==q.answer).map(v=>v.participle)];
 }else wrong=gapQuestions.filter(x=>x.answer!==q.answer&&x.section===q.section).map(x=>x.answer);
 const options=[q.answer,...[...new Set(wrong)].filter(option=>option.toLocaleLowerCase('de')!==q.answer.toLocaleLowerCase('de')).slice(0,3)];
 if(options.length===4)exercises.push({...q,id:q.id+'-test',kind:'choice',options});
}
// Tuzaklı alıştırmalar: yanlış şıklar sık yapılan hataları taklit eder. Yazma
// sürümü (varsa) aynı tuzağı ipucusuz da sorar; ID'ler yalnızca eklenir.
function wordOrder(words:string[],seed:string){
 let state=0;for(const character of seed)state=(Math.imul(state,31)+character.charCodeAt(0))>>>0;
 const result=[...words];for(let i=result.length-1;i>0;i--){state=(Math.imul(state,1103515245)+12345)>>>0;const j=state%(i+1);[result[i],result[j]]=[result[j],result[i]];}
 return result.join(' ')===words.join(' ')?[...words].reverse():result;
}
for(const t of housingTraps){
 const id='trap-'+t.id;const passage=t.passage?trapPassages[t.passage]:undefined;
 const resultDe=t.gap?t.gap.replace('___',t.answer).replace(/\s*\([^)]*\)$/,''):t.answer;
 const words=t.answer.replace(/[.!?]/g,'').split(' ');
 const extra:Partial<HousingExercise>={trap:t.why,resultDe,...(t.art?{art:t.art}:{}),...(t.strictCase?{strictCase:true}:{}),...(t.accepted?{accepted:t.accepted}:{}),
  ...(t.gap?{gap:t.gap,cueDe:t.gap}:{cueDe:t.lower?'Schreibe den Satz richtig – achte auf Groß- und Kleinschreibung.':'Bilde einen Satz aus den Wörtern.',wordBank:wordOrder(t.lower?words.map(word=>word.toLocaleLowerCase('de-DE')):words,id)}),
  ...(passage?{passage:passage.de,passageTr:passage.meaning[0],passageMeaning:passage.meaning,cueDe:'Lies den Text und ergänze den Satz.'}:{})};
 const q=make(t.section,t.step,id,t.answer,t.meaning,t.rule,extra);
 q.explanation=resultDe+' = '+t.meaning[0]+' '+trapReasons[t.why][0];
 if(t.write!==false)exercises.push(q);
 const {wordBank:_wordBank,accepted:_accepted,strictCase:_strict,...choice}=q;
 exercises.push({...choice,id:q.id+'-test',kind:'choice',options:[t.answer,...t.traps],cueDe:t.gap||passage?q.cueDe:'Welcher Satz ist richtig?'});
}
export const housingTrapIds=new Set(exercises.filter(q=>!!q.trap).map(q=>q.id));
export const housingQuestions=exercises;
export const housingQuestionMap=new Map(housingQuestions.map(q=>[q.id,q]));
export const housingTopics:Topic[]=housingSections.map(section=>({id:section.topic,title:section.id.toUpperCase()+' · '+section.title[0],de:section.de,unit:11,section:section.id.toUpperCase(),pages:section.pages,minutes:15,lead:section.title[0],blocks:[]}));
export function housingPool(section:HousingSection|'all',mode:'write'|'test',step=0){return housingQuestions.filter(q=>(section==='all'||q.section===section)&&(!step||q.step===step)&&(mode==='write'?q.kind==='write':!!q.options));}
export function housingMeaning(q:HousingExercise,language:StudyLanguage){return language==='de'?q.resultDe:translate(q.meaning,language);}
export function pickHousingQuestions(section:HousingSection|'all',mode:'write'|'test',count:number|'all',reviews:Review[],step=0,reviewOnly=false,onlyIds?:string[]){
 const review=new Map(reviews.map(row=>[row.question_id,row]));const only=onlyIds?new Set(onlyIds):null;
 const pool=housingPool(section,mode,step).filter(q=>(!only||only.has(q.id))&&(!reviewOnly||!!review.get(q.id)?.wrong_count&&review.get(q.id)!.streak<3));
 const rank=(q:HousingExercise)=>{const row=review.get(q.id);return row?.wrong_count&&row.streak<3?0:!row?1:row.due_at<=Date.now()?2:3;};
 return [...pool].sort((a,b)=>rank(a)-rank(b)||a.step-b.step||housingQuestions.indexOf(a)-housingQuestions.indexOf(b)).slice(0,count==='all'?pool.length:count);
}
