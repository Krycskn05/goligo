import {objectWordMap} from './object-course';
import type {VaultLanguage} from './object-vault-copy';
import {packText} from './site-languages';
import {extraObjectMeanings} from './object-extra-translations';
import {movingObjectMeanings} from './object-moving-additions';
import {buildingObjectMeanings} from './object-building-additions';
import {toolObjectMeanings} from './object-tool-additions';
import {bodyObjectMeanings} from './object-body-additions';

type ForeignMeanings=readonly [en:string,ar:string,uk:string,fr:string];
// Meanings match the illustrated objects, including Kamin as a chimney.
export const objectMeanings:Record<string,ForeignMeanings>={
 ...movingObjectMeanings,
 ...buildingObjectMeanings,
 ...toolObjectMeanings,
 ...bodyObjectMeanings,
 bad:['bathroom','حمّام','ванна кімната','salle de bains'],
 brett:['wooden board','لوح خشبي','дошка','planche de bois'],
 dach:['roof','سقف المنزل','дах','toit'],
 dachboden:['attic','علّية','горище','grenier'],
 dusche:['shower','دش','душ','douche'],
 fenster:['window','نافذة','вікно','fenêtre'],
 haustuer:['front door','باب المنزل','вхідні двері','porte d’entrée'],
 heizung:['heating / radiator','التدفئة / المشعّ الحراري','опалення / радіатор','chauffage / radiateur'],
 herd:['stove / cooker','موقد','кухонна плита','cuisinière'],
 kamin:['chimney','مدخنة','димохід','cheminée'],
 keller:['basement / cellar','قبو','підвал','cave / sous-sol'],
 kueche:['kitchen','مطبخ','кухня','cuisine'],
 mauer:['brick wall','جدار من الطوب','цегляна стіна','mur de briques'],
 rohr:['pipe','أنبوب','труба','tuyau'],
 steckdose:['power socket / outlet','مقبس كهربائي','розетка','prise électrique'],
 stecker:['power plug','قابس كهربائي','електрична вилка','fiche électrique'],
 treppe:['stairs / staircase','درج','сходи','escalier'],
 waschbecken:['washbasin / sink','حوض غسيل','умивальник','lavabo'],
 wasserhahn:['tap / faucet','صنبور','водопровідний кран','robinet'],
 ziegelstein:['brick','طوبة','цеглина','brique'],
 bett:['bed','سرير','ліжко','lit'],
 bild:['picture / painting','صورة / لوحة','картина / зображення','image / tableau'],
 fernseher:['television','تلفاز','телевізор','téléviseur'],
 hocker:['stool','مقعد بلا مسند','табурет','tabouret'],
 kofferradio:['portable radio','راديو محمول','портативний радіоприймач','radio portable'],
 kuehlschrank:['refrigerator / fridge','ثلاجة','холодильник','réfrigérateur'],
 lampe:['lamp','مصباح','лампа','lampe'],
 matratze:['mattress','مرتبة','матрац','matelas'],
 plattenspieler:['record player','مشغّل الأسطوانات','програвач платівок','tourne-disque'],
 regal:['shelf / shelving unit','رف / وحدة رفوف','полиця / стелаж','étagère'],
 schrank:['cupboard / wardrobe','خزانة','шафа','armoire'],
 sessel:['armchair','كرسي بذراعين','крісло','fauteuil'],
 sofa:['sofa / couch','أريكة','диван','canapé'],
 spiegel:['mirror','مرآة','дзеркало','miroir'],
 stuhl:['chair','كرسي','стілець','chaise'],
 teppich:['carpet / rug','سجادة','килим','tapis'],
 tisch:['table','طاولة','стіл','table'],
 truhe:['storage chest','صندوق تخزين','скриня','coffre'],
 vorhang:['curtain','ستارة','штора','rideau'],
 waschmaschine:['washing machine','غسالة','пральна машина','machine à laver'],
 leiter:['ladder','سلّم متنقّل','драбина','échelle'],
 eimer:['bucket','دلو','відро','seau'],
 pinsel:['paintbrush','فرشاة طلاء','пензель','pinceau'],
 farbrolle:['paint roller','أسطوانة طلاء','малярний валик','rouleau à peinture'],
 schaufel:['shovel','مجرفة','лопата','pelle'],
 schubkarre:['wheelbarrow','عربة يد','тачка','brouette'],
 saege:['saw','منشار','пилка','scie'],
 zementmischer:['cement mixer','خلاطة الإسمنت','бетономішалка','bétonnière'],
 geruest:['scaffolding','سقالات','риштування','échafaudage'],
 antenne:['antenna','هوائي','антена','antenne'],
 dachziegel:['roof tile','قرميدة','черепиця','tuile'],
 schlauch:['hose','خرطوم','шланг','tuyau souple'],
 maurerkelle:['bricklayer’s trowel','مسطرين البناء','кельма','truelle'],
 karton:['cardboard box','صندوق كرتوني','картонна коробка','carton'],
 pflanze:['plant','نبتة','рослина','plante'],
 besen:['broom','مكنسة','мітла','balai'],
 regenschirm:['umbrella','مظلّة','парасоля','parapluie'],
 kissen:['pillow / cushion','وسادة','подушка','oreiller / coussin'],
 vogelkaefig:['birdcage','قفص طيور','клітка для птахів','cage à oiseaux'],
 umzugswagen:['moving truck / removal van','شاحنة نقل الأثاث','вантажівка для переїзду','camion de déménagement'],
};
const index={en:0,ar:1,uk:2,fr:3} as const;
const extraIndex={es:0,ru:1,fa:2,pl:3,it:4,pt:5} as const;
export function objectMeaning(id:string,language:VaultLanguage):string{
 const word=objectWordMap.get(id);if(!word)return '';
 if(language==='tr')return word.tr;
 if(language==='de')return word.description;
 if(language==='en'||language==='ar'||language==='uk'||language==='fr')return objectMeanings[id]?.[index[language]]??'';
 if(language==='es'||language==='ru'||language==='fa'||language==='pl'||language==='it'||language==='pt')return extraObjectMeanings[id]?.[extraIndex[language]]??'';
 // Later site languages read the meaning from their language pack, by the English meaning.
 const english=objectMeanings[id]?.[0]??'';return english?packText(language,english):'';
}
