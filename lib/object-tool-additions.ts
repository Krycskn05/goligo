import type {ObjectWord} from './object-course';

type Meanings=readonly [en:string,ar:string,uk:string,fr:string,es:string,ru:string,fa:string,pl:string,it:string,pt:string];
type ToolSpec=readonly [id:string,de:string,tr:string,description:string,descriptionTr:string,meanings:Meanings,note?:string];

// Tools and cleaning things from the "Wohnung" page of the textbook (10 B).
// Besen, Staubsauger, Pinsel, Säge and Nagel already live in other categories
// and keep their IDs there; only the new objects are added here.
const specs:ToolSpec[]=[
 ['bohrmaschine','die Bohrmaschine','matkap','Sie macht Löcher in die Wand. Dann kommt ein Dübel hinein.','Duvarda delik açar. Sonra içine bir dübel girer.',
  ['electric drill','مثقاب كهربائي','дриль','perceuse','taladro','дрель','دریل','wiertarka','trapano','furadeira']],
 ['buerste','die Bürste','fırça','Sie hat viele kurze Borsten. Damit putzt du den Boden.','Çok sayıda kısa kılı vardır. Onunla yeri fırçalarsın.',
  ['scrubbing brush','فرشاة تنظيف','щітка','brosse','cepillo','щётка','برس','szczotka','spazzola','escova'],'Bürste: temizlik fırçası; Pinsel: boya fırçası.'],
 ['duebel','der Dübel','dübel','Er ist aus Plastik. Du steckst ihn in das Loch in der Wand. Dann hält die Schraube gut.','Plastiktendir. Onu duvardaki deliğe sokarsın. Sonra vida iyi tutar.',
  ['wall plug / anchor','وتد جداري','дюбель','cheville','taco','дюбель','رول‌پلاک','kołek rozporowy','tassello','bucha']],
 ['haken','der Haken','kanca','Er ist gebogen. Du hängst eine Jacke oder ein Bild daran.','Kıvrıktır. Ona bir ceket veya bir resim asarsın.',
  ['hook','خطّاف','гачок','crochet','gancho','крючок','قلاب','hak','gancio','gancho']],
 ['hammer','der Hammer','çekiç','Er hat einen Stiel und einen Kopf aus Metall. Damit schlägst du Nägel in die Wand.','Bir sapı ve metal bir başı vardır. Onunla duvara çivi çakarsın.',
  ['hammer','مطرقة','молоток','marteau','martillo','молоток','چکش','młotek','martello','martelo']],
 ['kehrblech','das Kehrblech','faraş','Du kehrst den Schmutz mit dem Besen hinein. Dann wirfst du ihn weg.','Pisliği süpürgeyle içine süpürürsün. Sonra onu atarsın.',
  ['dustpan','جاروف','совок','pelle à poussière','recogedor','совок','خاک‌انداز','szufelka','paletta','pá de lixo']],
 ['kleber','der Kleber','yapıştırıcı','Er ist in einer Tube. Damit klebst du Papier oder Tapete fest.','Bir tüpün içindedir. Onunla kâğıt veya duvar kâğıdı yapıştırırsın.',
  ['glue','غراء','клей','colle','pegamento','клей','چسب','klej','colla','cola'],'Kleber ile der Klebstoff aynı anlama gelir: yapıştırıcı.'],
 ['putzeimer','der Putzeimer','temizlik kovası','In diesem Eimer ist Wasser mit Seife. Damit putzt du den Boden.','Bu kovanın içinde sabunlu su vardır. Onunla yeri silersin.',
  ['cleaning bucket','دلو التنظيف','відро для прибирання','seau de ménage','cubo de limpieza','ведро для уборки','سطل نظافت','wiadro do sprzątania','secchio per le pulizie','balde de limpeza'],'Putzeimer temizlik kovasıdır; genel kova: der Eimer.'],
 ['schraube','die Schraube','vida','Sie ist aus Metall und hat ein Gewinde. Du drehst sie mit dem Schraubenzieher in die Wand.','Metaldendir ve dişleri vardır. Onu tornavidayla döndürerek duvara takarsın.',
  ['screw','برغي','шуруп','vis','tornillo','шуруп','پیچ','wkręt','vite','parafuso']],
 ['schraubenzieher','der Schraubenzieher','tornavida','Damit drehst du Schrauben hinein und heraus.','Onunla vidaları takar ve sökersin.',
  ['screwdriver','مفك براغي','викрутка','tournevis','destornillador','отвёртка','پیچ‌گوشتی','śrubokręt','cacciavite','chave de fenda'],'Schraubenzieher ile der Schraubendreher aynı alettir.'],
 ['tapete','die Tapete','duvar kâğıdı','Sie ist aus Papier und hat oft ein Muster. Du klebst sie an die Wand.','Kâğıttandır ve genellikle desenlidir. Onu duvara yapıştırırsın.',
  ['wallpaper','ورق جدران','шпалери','papier peint','papel pintado','обои','کاغذ دیواری','tapeta','carta da parati','papel de parede']],
 ['teppichklopfer','der Teppichklopfer','halı dövme sopası','Damit schlägst du draußen den Staub aus dem Teppich.','Onunla dışarıda halının tozunu çırparsın.',
  ['carpet beater','مضرب السجاد','вибивалка для килимів','tapette à tapis','sacudidor de alfombras','выбивалка для ковров','قالی‌تکان','trzepaczka do dywanów','battipanni','batedor de tapetes']],
 ['wasserwaage','die Wasserwaage','su terazisi','Sie hat eine kleine Luftblase. Damit siehst du, ob ein Regal gerade ist.','Küçük bir hava kabarcığı vardır. Onunla bir rafın düz olup olmadığını görürsün.',
  ['spirit level','ميزان الماء','будівельний рівень','niveau à bulle','nivel de burbuja','строительный уровень','تراز','poziomica','livella','nível de bolha']],
 ['zange','die Zange','pense','Sie hat zwei Griffe. Damit hältst du Draht oder ziehst einen Nagel heraus.','İki sapı vardır. Onunla tel tutar veya bir çiviyi çekip çıkarırsın.',
  ['pliers','كمّاشة','плоскогубці','pince','alicates','плоскогубцы','انبردست','kombinerki','pinza','alicate']],
 ['zollstock','der Zollstock','katlanır metre','Du klappst ihn auf. Dann misst du damit, wie lang etwas ist.','Onu açarsın. Sonra onunla bir şeyin ne kadar uzun olduğunu ölçersin.',
  ['folding ruler','مسطرة قابلة للطي','складаний метр','mètre pliant','metro plegable','складной метр','متر تاشو','miarka składana','metro pieghevole','metro dobrável'],'Zollstock katlanır metredir; şerit metre: das Maßband.'],
];

export const toolObjectAdditions:ObjectWord[]=specs.map(([id,de,tr,description,descriptionTr,,note])=>({
 id,de,tr,description,descriptionTr,...(note?{note}:{}),topic:'objects-tools',image:'/objects/toon/werkzeug-'+id+'.webp',extra:true,
}));
export const toolObjectMeanings:Record<string,readonly [en:string,ar:string,uk:string,fr:string]>=Object.fromEntries(
 specs.map(([id,,,,,meanings])=>[id,meanings.slice(0,4) as unknown as readonly [string,string,string,string]]),
);
export const toolExtraMeanings:Record<string,readonly [es:string,ru:string,fa:string,pl:string,it:string,pt:string]>=Object.fromEntries(
 specs.map(([id,,,,,meanings])=>[id,meanings.slice(4) as unknown as readonly [string,string,string,string,string,string]]),
);
