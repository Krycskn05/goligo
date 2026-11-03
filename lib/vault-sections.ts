import type {VaultLanguage,VaultTranslations} from './object-vault-copy';
import {pickText} from './site-languages';

/**
 * Kelime Kasası's categories under a few headings (the learner asked, 3 November 2026: "remove Tüm kelimeler and tidy up
 * the categories"). Only the page's order changes: the category ids, their words and their progress stay as they are.
 * Every category of lib/object-course.ts is under exactly one heading (tests/vault-sections.test.cjs checks it). Titles
 * are ordered like the site languages (tr de en ar uk fr es ru fa pl it pt); the later languages read the English line
 * from their pack.
 */
export type VaultSection={id:string;emoji:string;groups:readonly string[];title:VaultTranslations};
export const vaultSections:readonly VaultSection[]=[
 {id:'home',emoji:'🏠',groups:['objects-house','objects-furniture','objects-cleaning','objects-moving'],
  title:['Ev ve yaşam','Wohnen und Haushalt','Home and household','البيت والمنزل','Дім і побут','Maison et foyer','Casa y hogar','Дом и быт','خانه و زندگی','Dom i gospodarstwo','Casa e vita domestica','Casa e lar']},
 {id:'food',emoji:'🍽️',groups:['objects-food','objects-drinks','objects-kitchen','objects-cooking'],
  title:['Yemek ve mutfak','Essen und Küche','Food and kitchen','الطعام والمطبخ','Їжа і кухня','Repas et cuisine','Comida y cocina','Еда и кухня','غذا و آشپزخانه','Jedzenie i kuchnia','Cibo e cucina','Comida e cozinha']},
 {id:'people',emoji:'🧍',groups:['objects-body','objects-health','objects-clothes'],
  title:['Beden, sağlık ve giyim','Körper, Gesundheit und Kleidung','Body, health and clothes','الجسم والصحة والملابس','Тіло, здоров’я і одяг','Corps, santé et vêtements','Cuerpo, salud y ropa','Тело, здоровье и одежда','بدن، سلامت و پوشاک','Ciało, zdrowie i ubrania','Corpo, salute e vestiti','Corpo, saúde e roupa']},
 {id:'work',emoji:'🔧',groups:['objects-jobs','objects-tools','objects-building'],
  title:['İş ve meslekler','Arbeit und Berufe','Work and jobs','العمل والمهن','Робота і професії','Travail et métiers','Trabajo y profesiones','Работа и профессии','کار و شغل‌ها','Praca i zawody','Lavoro e professioni','Trabalho e profissões']},
 {id:'outside',emoji:'🌳',groups:['objects-school','objects-nature','objects-outdoors'],
  title:['Okul, doğa ve şehir','Schule, Natur und Stadt','School, nature and town','المدرسة والطبيعة والمدينة','Школа, природа і місто','École, nature et ville','Escuela, naturaleza y ciudad','Школа, природа и город','مدرسه، طبیعت و شهر','Szkoła, przyroda i miasto','Scuola, natura e città','Escola, natureza e cidade']},
 {id:'lessons',emoji:'📘',groups:['objects-lektion1'],
  title:['Ders kelimeleri','Wörter aus den Lektionen','Words from the lessons','كلمات من الدروس','Слова з уроків','Mots des leçons','Palabras de las lecciones','Слова из уроков','واژه‌های درس‌ها','Słowa z lekcji','Parole delle lezioni','Palavras das lições']},
];
export function sectionTitle(section:VaultSection,language:VaultLanguage){return pickText(section.title,language);}
/** The headings with the categories the page shows (`shown`, in the headings' order); a category under no heading comes last. */
export function sectionsFor(shown:readonly string[]){
 const placed=new Set(vaultSections.flatMap(section=>section.groups));
 const list=vaultSections.map(section=>({section,groups:section.groups.filter(id=>shown.includes(id))})).filter(item=>item.groups.length>0);
 const rest=shown.filter(id=>!placed.has(id));
 return {list,rest};
}
