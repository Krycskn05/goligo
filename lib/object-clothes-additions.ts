import type {ObjectWord} from './object-course';

type Meanings=readonly [en:string,ar:string,uk:string,fr:string,es:string,ru:string,fa:string,pl:string,it:string,pt:string];
type Spec=readonly [id:string,de:string,tr:string,description:string,descriptionTr:string,meanings:Meanings,note?:string];

// Kıyafetler (Kleidung): the learner's 50 transparent clothing pictures (2 November 2026). der Rock was already in
// the vault (draussen-rock) and only moves into this group, so its card, answers and stars stay; the other 49 are new.
// The pictures are fitted onto the vault's cream background (public/objects/toon/kleidung-<id>.webp, 512 × 512).
// Word IDs carry the kleidung- prefix so they never meet an older vault ID. The English meaning is also the key of
// the language packs.

const clothes:Spec[]=[
 // Hemden und Pullover
 ['hemd','das Hemd','gömlek','Es hat einen Kragen, lange Ärmel und vorne viele Knöpfe. Männer tragen es oft mit einer Krawatte.','Bir yakası, uzun kolları ve önünde birçok düğmesi vardır. Erkekler onu sık sık kravatla giyer.',
  ['shirt','قميص','сорочка','chemise','camisa','рубашка','پیراهن','koszula','camicia','camisa'],'Çoğulu: die Hemden.'],
 ['bluse','die Bluse','bluz','Frauen tragen sie oben. Sie ist leicht und hat vorne oft Knöpfe.','Kadınlar onu üstte giyer. Hafiftir ve önünde çoğu zaman düğmeler vardır.',
  ['blouse','بلوزة','блузка','chemisier','blusa','блузка','بلوز','bluzka','camicetta','blusa'],'Çoğulu: die Blusen.'],
 ['tshirt','das T-Shirt','tişört','Es hat kurze Ärmel und keine Knöpfe. Im Sommer trägst du es sehr oft.','Kısa kolludur ve düğmesi yoktur. Yazın onu çok sık giyersin.',
  ['T-shirt','تي شيرت','футболка','tee-shirt','camiseta','футболка','تی‌شرت','koszulka','maglietta','camiseta'],'Çoğulu: die T-Shirts.'],
 ['top','das Top','askılı üst','Es hat keine Ärmel, nur zwei dünne Träger. Frauen tragen es im Sommer.','Kolu yoktur, yalnızca iki ince askısı vardır. Kadınlar onu yazın giyer.',
  ['tank top','بلوزة بحمالات','майка-топ','débardeur','camiseta de tirantes','топ на бретелях','تاپ بندی','top na ramiączkach','canotta','regata / top de alças'],'Çoğulu: die Tops.'],
 ['pullover','der Pullover','kazak','Er ist warm und oft aus Wolle. Im Winter trägst du ihn über dem Hemd.','Sıcaktır ve çoğu zaman yündendir. Kışın onu gömleğin üzerine giyersin.',
  ['jumper / sweater','كنزة صوفية','светр','pull','jersey','свитер','پلیور','sweter','maglione','camisola / suéter'],'Kısaca: der Pulli. Çoğulu: die Pullover.'],
 ['sweatshirt','das Sweatshirt','sweatshirt','Es ist weich und bequem und hat lange Ärmel. Viele Menschen tragen es beim Sport oder zu Hause.','Yumuşak ve rahattır, uzun kolları vardır. Birçok insan onu sporda ya da evde giyer.',
  ['sweatshirt','سويت شيرت','світшот','sweat-shirt','sudadera','свитшот','سویشرت','bluza','felpa','moletom / sweatshirt'],'Çoğulu: die Sweatshirts.'],
 ['kapuzenpullover','der Kapuzenpullover','kapüşonlu kazak','Er ist ein warmer Pulli mit einer Kapuze für den Kopf. Vorne hat er oft eine große Tasche.','Başa geçirilen bir kapüşonu olan sıcak bir kazaktır. Önünde çoğu zaman büyük bir cebi vardır.',
  ['hoodie','هودي','худі','sweat à capuche','sudadera con capucha','худи','هودی','bluza z kapturem','felpa con cappuccio','moletom com capuz'],'Kısaca: der Hoodie. Çoğulu: die Kapuzenpullover.'],
 ['strickjacke','die Strickjacke','hırka','Sie ist aus Wolle und hat vorne Knöpfe. Du kannst sie offen über der Bluse tragen.','Yündendir ve önünde düğmeler vardır. Onu açık bırakıp bluzun üzerine giyebilirsin.',
  ['cardigan','سترة صوفية بأزرار','кардиган','gilet en laine','chaqueta de punto','кардиган','ژاکت بافتنی','sweter rozpinany','cardigan','casaco de malha'],'Çoğulu: die Strickjacken.'],
 ['weste','die Weste','yelek','Sie hat keine Ärmel. Du trägst sie über dem Hemd oder über dem Pullover.','Kolları yoktur. Onu gömleğin ya da kazağın üzerine giyersin.',
  ['waistcoat / vest','صدرية','жилет','gilet','chaleco','жилет','جلیقه','kamizelka','gilet','colete'],'Çoğulu: die Westen.'],
 // Jacken und Mäntel
 ['jacke','die Jacke','ceket / mont','Du ziehst sie über dem Pullover an, wenn du nach draußen gehst. Sie hat lange Ärmel und oft einen Reißverschluss.','Dışarı çıktığında onu kazağın üzerine giyersin. Uzun kolları ve çoğu zaman bir fermuarı vardır.',
  ['jacket','سترة','куртка','veste','chaqueta','куртка','کاپشن / ژاکت','kurtka','giacca','casaco / jaqueta'],'Çoğulu: die Jacken.'],
 ['lederjacke','die Lederjacke','deri ceket','Sie ist aus Leder und oft braun oder schwarz. Motorradfahrer tragen sie gern.','Deridendir ve çoğu zaman kahverengi ya da siyahtır. Motosikletçiler onu severek giyer.',
  ['leather jacket','سترة جلدية','шкіряна куртка','blouson en cuir','chaqueta de cuero','кожаная куртка','کاپشن چرمی','kurtka skórzana','giacca di pelle','jaqueta de couro'],'Çoğulu: die Lederjacken.'],
 ['regenjacke','die Regenjacke','yağmurluk','Sie hält dich trocken, wenn es regnet. Sie hat eine Kapuze und ist oft gelb.','Yağmur yağdığında seni kuru tutar. Kapüşonu vardır ve çoğu zaman sarıdır.',
  ['raincoat','معطف واقٍ من المطر','дощовик','imperméable','chubasquero','дождевик','بارانی','kurtka przeciwdeszczowa','impermeabile','capa de chuva'],'Çoğulu: die Regenjacken.'],
 ['winterjacke','die Winterjacke','kışlık mont','Sie ist dick und sehr warm. Du trägst sie, wenn es draußen kalt ist und schneit.','Kalın ve çok sıcaktır. Dışarısı soğuk olduğunda ve kar yağdığında onu giyersin.',
  ['winter jacket','سترة شتوية','зимова куртка','doudoune','chaqueta de invierno','зимняя куртка','کاپشن زمستانی','kurtka zimowa','giaccone invernale','casaco de inverno'],'Çoğulu: die Winterjacken.'],
 ['mantel','der Mantel','palto','Er ist lang und warm und geht bis zu den Knien. Du trägst ihn im Herbst und im Winter.','Uzun ve sıcaktır, dizlere kadar iner. Onu sonbaharda ve kışın giyersin.',
  ['coat','معطف','пальто','manteau','abrigo','пальто','پالتو','płaszcz','cappotto','sobretudo / casaco comprido'],'Çoğulu: die Mäntel.'],
 ['pelzmantel','der Pelzmantel','kürk manto','Er ist lang, weich und sehr warm. Er ist aus Fell, wie das Fell von einem Tier.','Uzun, yumuşak ve çok sıcaktır. Kürktendir, bir hayvanın postu gibi.',
  ['fur coat','معطف من الفرو','шуба','manteau de fourrure','abrigo de piel','шуба','پالتوی خز','futro','pelliccia','casaco de pele'],'Çoğulu: die Pelzmäntel.'],
 // Hosen, Röcke und Kleider
 ['hose','die Hose','pantolon','Du trägst sie an den Beinen. Sie geht vom Bauch bis zu den Füßen.','Onu bacaklarında giyersin. Karından ayaklarına kadar iner.',
  ['trousers / pants','بنطال','штани','pantalon','pantalón','брюки','شلوار','spodnie','pantaloni','calça'],'Almancada tekildir: die Hose. Çoğulu: die Hosen.'],
 ['jeans','die Jeans','kot pantolon','Sie ist blau und aus festem Stoff. Viele Menschen tragen sie jeden Tag.','Mavidir ve sağlam bir kumaştandır. Birçok insan onu her gün giyer.',
  ['jeans','بنطال جينز','джинси','jean','vaqueros','джинсы','شلوار جین','dżinsy','jeans','calça jeans'],'Tekili ve çoğulu aynıdır: die Jeans.'],
 ['kurze-hose','die kurze Hose','şort / kısa pantolon','Sie geht nur bis zu den Knien. Im Sommer ist sie schön kühl.','Yalnızca dizlere kadar iner. Yazın insanı güzelce serin tutar.',
  ['shorts','شورت','шорти','short','pantalón corto','шорты','شلوارک','krótkie spodenki','pantaloncini','shorts / calção'],'Kısaca: die Shorts. Çoğulu: die kurzen Hosen.'],
 ['jogginghose','die Jogginghose','eşofman altı','Sie ist weich und bequem und hat oben ein Gummiband. Du trägst sie beim Sport oder auf dem Sofa.','Yumuşak ve rahattır, belinde bir lastik vardır. Onu sporda ya da kanepede giyersin.',
  ['tracksuit bottoms / sweatpants','بنطال رياضي','спортивні штани','pantalon de jogging','pantalón de chándal','спортивные штаны','شلوار ورزشی','spodnie dresowe','pantaloni della tuta','calça de moletom'],'Çoğulu: die Jogginghosen.'],
 ['leggings','die Leggings','tayt','Sie sind eng und weich und sitzen ganz nah an den Beinen. Frauen tragen sie beim Sport oder unter einem Kleid.','Dar ve yumuşaktır, bacaklara tam oturur. Kadınlar onu sporda ya da bir elbisenin altına giyer.',
  ['leggings','بنطال ضيق (ليقنز)','легінси','legging','mallas','леггинсы','ساپورت','legginsy','leggings','legging'],'Almancada çoğul kullanılır: die Leggings.'],
 ['kleid','das Kleid','elbise','Frauen und Mädchen tragen es. Oben und unten ist es ein Teil, wie eine Bluse und ein Rock zusammen.','Kadınlar ve kızlar onu giyer. Üstü ve altı tek parçadır; bir bluz ile bir eteğin birleşimi gibidir.',
  ['dress','فستان','сукня','robe','vestido','платье','پیراهن زنانه','sukienka','vestito','vestido'],'Çoğulu: die Kleider. Dikkat: die Kleidung = giysiler.'],
 ['anzug','der Anzug','takım elbise','Er hat eine Jacke und eine Hose aus dem gleichen Stoff. Männer tragen ihn oft im Büro oder bei einer Hochzeit.','Aynı kumaştan bir ceketi ve bir pantolonu vardır. Erkekler onu sık sık büroda ya da bir düğünde giyer.',
  ['suit','بدلة','костюм','costume','traje','костюм','کت‌وشلوار','garnitur','abito da uomo','terno'],'Çoğulu: die Anzüge.'],
 ['trainingsanzug','der Trainingsanzug','eşofman takımı','Er hat eine Jacke und eine Hose für den Sport. Beide Teile haben die gleiche Farbe.','Spor için bir ceketi ve bir pantolonu vardır. İki parçanın rengi aynıdır.',
  ['tracksuit','بدلة رياضية','спортивний костюм','survêtement','chándal','спортивный костюм','گرمکن ورزشی','dres','tuta da ginnastica','agasalho / fato de treino'],'Çoğulu: die Trainingsanzüge.'],
 // Nachtwäsche und Unterwäsche
 ['schlafanzug','der Schlafanzug','pijama','Du ziehst ihn abends an und schläfst darin. Er hat ein Oberteil und eine Hose.','Onu akşam giyer ve içinde uyursun. Bir üstü ve bir pantolonu vardır.',
  ['pyjamas','بيجامة','піжама','pyjama','pijama','пижама','پیژامه','piżama','pigiama','pijama'],'Çoğulu: die Schlafanzüge.'],
 ['nachthemd','das Nachthemd','gecelik','Es ist lang und weich wie ein Kleid. Frauen und Mädchen schlafen darin.','Bir elbise gibi uzun ve yumuşaktır. Kadınlar ve kızlar içinde uyur.',
  ['nightdress / nightgown','قميص نوم','нічна сорочка','chemise de nuit','camisón','ночная рубашка','لباس خواب زنانه','koszula nocna','camicia da notte','camisola de dormir'],'Çoğulu: die Nachthemden.'],
 ['bademantel','der Bademantel','bornoz','Er ist weich und dick. Nach der Dusche ziehst du ihn an und wirst trocken.','Yumuşak ve kalındır. Duştan sonra onu giyer ve kurulanırsın.',
  ['bathrobe','رداء الحمّام','халат','peignoir','albornoz','банный халат','حوله‌تن','szlafrok','accappatoio','roupão de banho'],'Çoğulu: die Bademäntel.'],
 ['unterhemd','das Unterhemd','atlet','Du trägst es direkt auf der Haut, unter dem Hemd. Es ist oft weiß und hat keine Ärmel.','Onu doğrudan tenin üzerine, gömleğin altına giyersin. Çoğu zaman beyazdır ve kolsuzdur.',
  ['undershirt / vest','قميص داخلي','майка','maillot de corps','camiseta interior','майка','زیرپوش','podkoszulek','canottiera','camiseta interior'],'Çoğulu: die Unterhemden.'],
 ['unterhose','die Unterhose','külot / iç çamaşırı','Du trägst sie direkt auf der Haut, unter der Hose. Du wechselst sie jeden Tag.','Onu doğrudan tenin üzerine, pantolonun altına giyersin. Onu her gün değiştirirsin.',
  ['underpants','سروال داخلي','труси','caleçon','calzoncillos','трусы','شورت زیر','majtki','mutande','cueca'],'Çoğulu: die Unterhosen.'],
 ['slip','der Slip','külot','Er ist klein und kurz und hat keine Beine. Du trägst ihn unter der Hose oder unter dem Rock.','Küçük ve kısadır, paçası yoktur. Onu pantolonun ya da eteğin altına giyersin.',
  ['briefs','سروال داخلي قصير','сліпи','slip','braga / slip','трусы-слипы','شورت اسلیپ','slipy','slip','calcinha / cueca slip'],'Çoğulu: die Slips.'],
 ['buestenhalter','der Büstenhalter','sütyen','Frauen tragen ihn unter der Bluse, direkt auf der Haut. Kurz sagt man oft „BH“.','Kadınlar onu bluzun altına, doğrudan tenin üzerine giyer. Kısaca çoğu zaman „BH“ denir.',
  ['bra','حمّالة صدر','бюстгальтер','soutien-gorge','sujetador','бюстгальтер','سوتین','biustonosz','reggiseno','sutiã'],'Kısaca: der BH. Çoğulu: die Büstenhalter.'],
 // Badesachen
 ['badeanzug','der Badeanzug','kadın mayosu','Frauen tragen ihn beim Schwimmen. Er ist ganz aus einem Stück.','Kadınlar onu yüzerken giyer. Tamamen tek parçadır.',
  ['swimsuit','ملابس سباحة نسائية','купальник','maillot de bain','bañador','купальник','مایوی زنانه','strój kąpielowy','costume da bagno','maiô'],'Çoğulu: die Badeanzüge.'],
 ['badehose','die Badehose','erkek mayosu','Männer und Jungen tragen sie im Schwimmbad oder am Meer.','Erkekler ve oğlanlar onu yüzme havuzunda ya da denizde giyer.',
  ['swimming trunks','سروال سباحة','плавки','maillot de bain (homme)','bañador de hombre','плавки','مایوی مردانه','kąpielówki','costume da bagno da uomo','sunga / calção de banho'],'Çoğulu: die Badehosen.'],
 ['bikini','der Bikini','bikini','Er hat zwei Teile: ein Oberteil und ein Unterteil. Frauen tragen ihn am Strand.','İki parçası vardır: bir üst ve bir alt. Kadınlar onu plajda giyer.',
  ['bikini','بيكيني','бікіні','bikini','bikini','бикини','بیکینی','bikini','bikini','biquíni'],'Çoğulu: die Bikinis.'],
 // Socken und Schuhe
 ['socke','die Socke','çorap','Du trägst sie am Fuß, in deinem Schuh. Sie ist kurz und oft aus Baumwolle.','Onu ayağında, ayakkabının içinde giyersin. Kısadır ve çoğu zaman pamuktandır.',
  ['sock','جورب','шкарпетка','chaussette','calcetín','носок','جوراب','skarpetka','calzino','meia'],'Genellikle çift olarak: die Socken.'],
 ['strumpf','der Strumpf','uzun çorap','Er ist lang und geht bis zum Knie oder noch höher.','Uzundur ve dize kadar ya da daha yukarıya çıkar.',
  ['stocking / long sock','جورب طويل','панчоха','bas','media','чулок','جوراب بلند','pończocha','calza','meia comprida'],'Çoğulu: die Strümpfe.'],
 ['strumpfhose','die Strumpfhose','külotlu çorap','Sie ist dünn und geht von den Füßen bis zum Bauch. Frauen und Mädchen tragen sie unter dem Rock.','İncedir; ayaklardan karına kadar çıkar. Kadınlar ve kızlar onu eteğin altına giyer.',
  ['tights','جوارب طويلة نسائية','колготки','collant','medias / pantis','колготки','جوراب‌شلواری','rajstopy','collant','meia-calça'],'Çoğulu: die Strumpfhosen.'],
 ['schuh','der Schuh','ayakkabı','Du trägst ihn am Fuß, wenn du nach draußen gehst. Er ist oft aus Leder.','Dışarı çıktığında onu ayağına giyersin. Çoğu zaman deridendir.',
  ['shoe','حذاء','черевик','chaussure','zapato','ботинок / туфля','کفش','but','scarpa','sapato'],'Çoğulu: die Schuhe.'],
 ['turnschuh','der Turnschuh','spor ayakkabı','Er ist leicht und bequem. Du trägst ihn beim Sport oder beim Laufen.','Hafif ve rahattır. Onu sporda ya da koşarken giyersin.',
  ['trainer / sneaker','حذاء رياضي','кросівка','basket','zapatilla de deporte','кроссовка','کفش ورزشی','but sportowy','scarpa da ginnastica','tênis'],'Çoğulu: die Turnschuhe.'],
 ['hausschuh','der Hausschuh','ev terliği','Du trägst ihn nur in der Wohnung. Er ist weich und warm.','Onu yalnızca evde giyersin. Yumuşak ve sıcaktır.',
  ['slipper','خفّ منزلي','капець','chausson','zapatilla de casa','тапочка','دمپایی رو فرشی','kapeć','pantofola','pantufa / chinelo'],'Çoğulu: die Hausschuhe.'],
 ['sandale','die Sandale','sandalet','Sie ist offen, und du siehst deine Zehen. Im Sommer trägst du sie ohne Socken.','Açıktır ve ayak parmaklarını görürsün. Yazın onu çorapsız giyersin.',
  ['sandal','صندل','сандаля','sandale','sandalia','сандалия','صندل','sandał','sandalo','sandália'],'Çoğulu: die Sandalen.'],
 ['stiefel','der Stiefel','çizme','Er ist ein hoher Schuh und geht bis zum Knie. Im Winter oder bei Regen ist er gut.','Dize kadar çıkan yüksek bir ayakkabıdır. Kışın ya da yağmurda işe yarar.',
  ['boot','جزمة','чобіт','botte','bota','сапог','چکمه','kozak','stivale','bota'],'Çoğulu: die Stiefel.'],
 // Hüte und Accessoires
 ['damenhut','der Damenhut','kadın şapkası','Frauen tragen ihn auf dem Kopf. Er hat einen breiten Rand und oft eine Schleife.','Kadınlar onu başlarına takar. Geniş bir kenarı ve çoğu zaman bir fiyongu vardır.',
  ['woman’s hat','قبعة نسائية','жіночий капелюх','chapeau de femme','sombrero de mujer','женская шляпа','کلاه زنانه','kapelusz damski','cappello da donna','chapéu feminino'],'Çoğulu: die Damenhüte. Genel kelime: der Hut.'],
 ['herrenhut','der Herrenhut','erkek şapkası','Männer tragen ihn auf dem Kopf. Er ist oft grau oder schwarz und hat ein Band.','Erkekler onu başlarına takar. Çoğu zaman gri ya da siyahtır ve bir bandı vardır.',
  ['man’s hat','قبعة رجالية','чоловічий капелюх','chapeau d’homme','sombrero de hombre','мужская шляпа','کلاه مردانه','kapelusz męski','cappello da uomo','chapéu masculino'],'Çoğulu: die Herrenhüte. Genel kelime: der Hut.'],
 ['muetze','die Mütze','bere','Sie ist warm und oft aus Wolle. Im Winter trägst du sie auf dem Kopf.','Sıcaktır ve çoğu zaman yündendir. Kışın onu başına takarsın.',
  ['beanie / woolly hat','قبعة صوفية','шапка','bonnet','gorro de lana','шапка','کلاه بافتنی','czapka','berretto di lana','gorro'],'Çoğulu: die Mützen.'],
 ['kappe','die Kappe','siperlikli şapka','Sie hat vorne einen Schirm gegen die Sonne. Viele Menschen tragen sie beim Sport.','Önünde güneşe karşı bir siperliği vardır. Birçok insan onu sporda takar.',
  ['cap / baseball cap','قبعة بحافة أمامية','кепка','casquette','gorra','кепка','کلاه کپ','czapka z daszkiem','cappellino con visiera','boné'],'Çoğulu: die Kappen. Basecap da denir.'],
 ['schal','der Schal','atkı','Er ist lang und warm. Im Winter trägst du ihn um den Hals.','Uzun ve sıcaktır. Kışın onu boynuna sararsın.',
  ['scarf','وشاح','шарф','écharpe','bufanda','шарф','شال‌گردن','szalik','sciarpa','cachecol'],'Çoğulu: die Schals.'],
 ['handschuh','der Handschuh','eldiven','Du trägst ihn an der Hand, wenn es kalt ist. Er hat fünf Finger.','Hava soğukken onu eline takarsın. Beş parmağı vardır.',
  ['glove','قفّاز','рукавичка','gant','guante','перчатка','دستکش','rękawiczka','guanto','luva'],'Genellikle çift olarak: die Handschuhe.'],
 ['krawatte','die Krawatte','kravat','Sie ist lang und schmal. Männer tragen sie am Hals, zum Hemd und zum Anzug.','Uzun ve dardır. Erkekler onu boyunlarına, gömlek ve takım elbiseyle takar.',
  ['tie','ربطة عنق','краватка','cravate','corbata','галстук','کراوات','krawat','cravatta','gravata'],'Çoğulu: die Krawatten.'],
 ['guertel','der Gürtel','kemer','Er ist oft aus Leder und hat eine Schnalle. Er hält die Hose am Bauch fest.','Çoğu zaman deridendir ve bir tokası vardır. Pantolonu belde sabit tutar.',
  ['belt','حزام','ремінь','ceinture','cinturón','ремень','کمربند','pasek','cintura','cinto'],'Çoğulu: die Gürtel.'],
];

export const CLOTHES_TOPIC='objects-clothes';
/** Plurals of the new nouns (without die), for the plural puzzle and Çoğul eşleştirme. die Jeans and die Leggings
 * have no separate plural, so they stay out of the plural games. */
export const clothesPlurals:Record<string,string>={'kleidung-hemd':'Hemden','kleidung-bluse':'Blusen','kleidung-tshirt':'T-Shirts','kleidung-top':'Tops','kleidung-pullover':'Pullover','kleidung-sweatshirt':'Sweatshirts','kleidung-kapuzenpullover':'Kapuzenpullover','kleidung-strickjacke':'Strickjacken','kleidung-weste':'Westen','kleidung-jacke':'Jacken','kleidung-lederjacke':'Lederjacken','kleidung-regenjacke':'Regenjacken','kleidung-winterjacke':'Winterjacken','kleidung-mantel':'Mäntel','kleidung-pelzmantel':'Pelzmäntel','kleidung-hose':'Hosen','kleidung-kurze-hose':'kurzen Hosen','kleidung-jogginghose':'Jogginghosen','kleidung-kleid':'Kleider','kleidung-anzug':'Anzüge','kleidung-trainingsanzug':'Trainingsanzüge','kleidung-schlafanzug':'Schlafanzüge','kleidung-nachthemd':'Nachthemden','kleidung-bademantel':'Bademäntel','kleidung-unterhemd':'Unterhemden','kleidung-unterhose':'Unterhosen','kleidung-slip':'Slips','kleidung-buestenhalter':'Büstenhalter','kleidung-badeanzug':'Badeanzüge','kleidung-badehose':'Badehosen','kleidung-bikini':'Bikinis','kleidung-socke':'Socken','kleidung-strumpf':'Strümpfe','kleidung-strumpfhose':'Strumpfhosen','kleidung-schuh':'Schuhe','kleidung-turnschuh':'Turnschuhe','kleidung-hausschuh':'Hausschuhe','kleidung-sandale':'Sandalen','kleidung-stiefel':'Stiefel','kleidung-damenhut':'Damenhüte','kleidung-herrenhut':'Herrenhüte','kleidung-muetze':'Mützen','kleidung-kappe':'Kappen','kleidung-schal':'Schals','kleidung-handschuh':'Handschuhe','kleidung-krawatte':'Krawatten','kleidung-guertel':'Gürtel'};
export const clothesObjectAdditions:ObjectWord[]=clothes.map(([id,de,tr,description,descriptionTr,,note])=>({
 id:'kleidung-'+id,de,tr,description,descriptionTr,...(note?{note}:{}),topic:CLOTHES_TOPIC,image:'/objects/toon/kleidung-'+id+'.webp',extra:true,
}));
export const clothesObjectMeanings:Record<string,readonly [en:string,ar:string,uk:string,fr:string]>=Object.fromEntries(
 clothes.map(([id,,,,,meanings])=>['kleidung-'+id,meanings.slice(0,4) as unknown as readonly [string,string,string,string]]),
);
export const clothesExtraMeanings:Record<string,readonly [es:string,ru:string,fa:string,pl:string,it:string,pt:string]>=Object.fromEntries(
 clothes.map(([id,,,,,meanings])=>['kleidung-'+id,meanings.slice(4) as unknown as readonly [string,string,string,string,string,string]]),
);
