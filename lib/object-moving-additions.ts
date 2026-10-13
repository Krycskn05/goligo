import type {ObjectWord} from './object-course';

type Meanings=readonly [en:string,ar:string,uk:string,fr:string,es:string,ru:string,fa:string,pl:string,it:string,pt:string];
type MovingSpec=readonly [id:string,de:string,tr:string,description:string,descriptionTr:string,meanings:Meanings];

// Additional identifiable objects from the moving illustration. Existing IDs
// remain in their original categories so saved practice stays compatible.
const specs:MovingSpec[]=[
 ['bilderrahmen','der Bilderrahmen','resim çerçevesi','Du legst ein Bild hinein und hängst es an die Wand.','İçine bir resim koyar ve onu duvara asarsın.',
  ['picture frame','إطار صورة','рамка для картини','cadre','marco','рамка для картины','قاب عکس','rama obrazu','cornice','moldura']],
 ['buegeleisen','das Bügeleisen','ütü','Es wird heiß. Damit machst du deine Kleidung glatt.','Isınır. Onunla kıyafetlerini düzleştirirsin.',
  ['iron','مكواة','праска','fer à repasser','plancha','утюг','اتو','żelazko','ferro da stiro','ferro de passar']],
 ['staubsauger','der Staubsauger','elektrikli süpürge','Er saugt Staub vom Boden auf.','Yerdeki tozu içine çeker.',
  ['vacuum cleaner','مكنسة كهربائية','пилосос','aspirateur','aspiradora','пылесос','جاروبرقی','odkurzacz','aspirapolvere','aspirador de pó']],
 ['seil','das Seil','ip / halat','Es ist lang und stark. Du kannst damit Dinge festbinden.','Uzun ve sağlamdır. Onunla eşyaları bağlayabilirsin.',
  ['rope','حبل','мотузка','corde','cuerda','верёвка','طناب','lina','corda','corda']],
 ['flasche','die Flasche','şişe','Du füllst Wasser oder Saft hinein. Sie hat einen schmalen Hals.','İçine su veya meyve suyu doldurursun. Dar bir boynu vardır.',
  ['bottle','زجاجة','пляшка','bouteille','botella','бутылка','بطری','butelka','bottiglia','garrafa']],
 ['apfel','der Apfel','elma','Diese Frucht ist rund. Sie kann rot oder grün sein.','Bu meyve yuvarlaktır. Kırmızı veya yeşil olabilir.',
  ['apple','تفاحة','яблуко','pomme','manzana','яблоко','سیب','jabłko','mela','maçã']],
 ['schirmstaender','der Schirmständer','şemsiyelik','Er steht oft im Flur. Du stellst deine Regenschirme hinein.','Genellikle koridorda durur. Şemsiyelerini içine koyarsın.',
  ['umbrella stand','حامل مظلّات','підставка для парасоль','porte-parapluies','paragüero','подставка для зонтов','جای چتر','stojak na parasole','portaombrelli','porta-guarda-chuvas']],
 ['aquarium','das Aquarium','akvaryum / balık fanusu','Es ist aus Glas. Darin leben Fische im Wasser.','Camdandır. İçinde balıklar suda yaşar.',
  ['aquarium / fishbowl','حوض أسماك','акваріум','aquarium','acuario','аквариум','آکواریوم','akwarium','acquario','aquário']],
 ['fisch','der Fisch','balık','Dieses Tier lebt im Wasser und hat Flossen.','Bu hayvan suda yaşar ve yüzgeçleri vardır.',
  ['fish','سمكة','риба','poisson','pez','рыба','ماهی','ryba','pesce','peixe']],
 ['palme','die Palme','palmiye','Diese Pflanze hat einen Stamm und lange Blätter oben.','Bu bitkinin bir gövdesi ve üst kısmında uzun yaprakları vardır.',
  ['palm tree','نخلة','пальма','palmier','palmera','пальма','نخل','palma','palma','palmeira']],
 ['blumentopf','der Blumentopf','saksı','Du füllst Erde hinein und pflanzt eine Blume darin.','İçine toprak doldurur ve bir çiçek dikersin.',
  ['flowerpot','أصيص','горщик для квітів','pot de fleurs','maceta','цветочный горшок','گلدان','doniczka','vaso da fiori','vaso de plantas']],
 ['kaktus','der Kaktus','kaktüs','Diese Pflanze hat Dornen und braucht wenig Wasser.','Bu bitkinin dikenleri vardır ve az suya ihtiyaç duyar.',
  ['cactus','صبّار','кактус','cactus','cactus','кактус','کاکتوس','kaktus','cactus','cacto']],
 ['vogel','der Vogel','kuş','Dieses Tier hat Federn, Flügel und einen Schnabel.','Bu hayvanın tüyleri, kanatları ve bir gagası vardır.',
  ['bird','طائر','птах','oiseau','pájaro','птица','پرنده','ptak','uccello','pássaro']],
 ['tasse','die Tasse','fincan','Du trinkst Kaffee oder Tee daraus. Sie hat einen Henkel.','İçinden kahve veya çay içersin. Bir kulpu vardır.',
  ['cup','فنجان','чашка','tasse','taza','чашка','فنجان','filiżanka','tazza','xícara']],
 ['teekanne','die Teekanne','demlik','Du füllst Tee hinein und gießt ihn damit in eine Tasse.','İçine çay doldurur ve onunla bir fincana dökersin.',
  ['teapot','إبريق شاي','чайник для заварювання','théière','tetera','заварочный чайник','قوری','czajniczek','teiera','bule de chá']],
 ['teller','der Teller','tabak','Du legst dein Essen darauf. Er steht auf dem Tisch.','Yemeğini üzerine koyarsın. Masanın üzerinde durur.',
  ['plate','طبق','тарілка','assiette','plato','тарелка','بشقاب','talerz','piatto','prato']],
 ['tischdecke','die Tischdecke','masa örtüsü','Du legst sie über den Tisch. Sie schützt den Tisch.','Onu masanın üzerine serersin. Masayı korur.',
  ['tablecloth','مفرش طاولة','скатертина','nappe','mantel','скатерть','رومیزی','obrus','tovaglia','toalha de mesa']],
 ['zeitschrift','die Zeitschrift','dergi','Sie hat viele Seiten mit Texten und Bildern. Eine neue Ausgabe kommt regelmäßig.','Yazı ve resim içeren birçok sayfası vardır. Düzenli olarak yeni bir sayısı çıkar.',
  ['magazine','مجلة','журнал','magazine / revue','revista','журнал','مجله','czasopismo','rivista','revista']],
 ['brille','die Brille','gözlük','Du trägst sie vor den Augen. Damit kannst du besser sehen.','Onu gözlerinin önünde takarsın. Onunla daha iyi görebilirsin.',
  ['glasses','نظّارة','окуляри','lunettes','gafas','очки','عینک','okulary','occhiali','óculos']],
 ['bogen','der Bogen','yay','Er hat eine Sehne. Du schießt damit einen Pfeil.','Bir kirişi vardır. Onunla bir ok atarsın.',
  ['archery bow','قوس','лук для стрільби','arc','arco','лук для стрельбы','کمان','łuk','arco','arco']],
 ['pfeil','der Pfeil','ok','Er hat eine Spitze. Du schießt ihn mit einem Bogen.','Bir sivri ucu vardır. Onu bir yayla atarsın.',
  ['arrow','سهم','стріла','flèche','flecha','стрела','تیر','strzała','freccia','flecha']],
 ['feder','die Feder','tüy','Sie ist leicht und weich. Vögel haben viele davon.','Hafif ve yumuşaktır. Kuşlarda bunlardan çok sayıda bulunur.',
  ['feather','ريشة','пір’їна','plume','pluma','перо','پر','pióro','piuma','pena']],
 ['rad','das Rad','tekerlek','Es ist rund und dreht sich. Fahrzeuge fahren darauf.','Yuvarlaktır ve döner. Taşıtlar onun üzerinde ilerler.',
  ['wheel','عجلة','колесо','roue','rueda','колесо','چرخ','koło','ruota','roda']],
 ['kette','die Kette','zincir','Sie besteht aus vielen verbundenen Metallringen.','Birbirine bağlanmış birçok metal halkadan oluşur.',
  ['chain','سلسلة','ланцюг','chaîne','cadena','цепь','زنجیر','łańcuch','catena','corrente']],
 ['lastwagen','der Lastwagen','kamyon','Dieses große Fahrzeug transportiert schwere Dinge.','Bu büyük taşıt ağır eşyalar taşır.',
  ['truck / lorry','شاحنة','вантажівка','camion','camión','грузовик','کامیون','ciężarówka','camion','caminhão']],
];

export const movingObjectAdditions:ObjectWord[]=specs.map(([id,de,tr,description,descriptionTr])=>({
 id,de,tr,description,descriptionTr,topic:'objects-moving',image:'/objects/toon/moving-'+id+'.webp',extra:true,
}));
export const movingObjectMeanings:Record<string,readonly [en:string,ar:string,uk:string,fr:string]>=Object.fromEntries(
 specs.map(([id,,,,,meanings])=>[id,meanings.slice(0,4) as unknown as readonly [string,string,string,string]]),
);
export const movingExtraMeanings:Record<string,readonly [es:string,ru:string,fa:string,pl:string,it:string,pt:string]>=Object.fromEntries(
 specs.map(([id,,,,,meanings])=>[id,meanings.slice(4) as unknown as readonly [string,string,string,string,string,string]]),
);
