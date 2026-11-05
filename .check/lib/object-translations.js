"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectMeanings = void 0;
exports.objectMeaning = objectMeaning;
const object_course_1 = require("./object-course");
const site_languages_1 = require("./site-languages");
const object_extra_translations_1 = require("./object-extra-translations");
const object_moving_additions_1 = require("./object-moving-additions");
const object_building_additions_1 = require("./object-building-additions");
const object_tool_additions_1 = require("./object-tool-additions");
const object_body_additions_1 = require("./object-body-additions");
const object_everyday_additions_1 = require("./object-everyday-additions");
const object_word_additions_1 = require("./object-word-additions");
const object_clothes_additions_1 = require("./object-clothes-additions");
// Meanings match the illustrated objects, including Kamin as a chimney.
exports.objectMeanings = {
    ...object_moving_additions_1.movingObjectMeanings,
    ...object_building_additions_1.buildingObjectMeanings,
    ...object_tool_additions_1.toolObjectMeanings,
    ...object_body_additions_1.bodyObjectMeanings,
    ...object_everyday_additions_1.everydayObjectMeanings,
    ...object_word_additions_1.wordObjectMeanings,
    ...object_clothes_additions_1.clothesObjectMeanings,
    bad: ['bathroom', 'حمّام', 'ванна кімната', 'salle de bains'],
    brett: ['wooden board', 'لوح خشبي', 'дошка', 'planche de bois'],
    dach: ['roof', 'سقف المنزل', 'дах', 'toit'],
    dachboden: ['attic', 'علّية', 'горище', 'grenier'],
    dusche: ['shower', 'دش', 'душ', 'douche'],
    fenster: ['window', 'نافذة', 'вікно', 'fenêtre'],
    haustuer: ['front door', 'باب المنزل', 'вхідні двері', 'porte d’entrée'],
    heizung: ['heating / radiator', 'التدفئة / المشعّ الحراري', 'опалення / радіатор', 'chauffage / radiateur'],
    herd: ['stove / cooker', 'موقد', 'кухонна плита', 'cuisinière'],
    kamin: ['chimney', 'مدخنة', 'димохід', 'cheminée'],
    keller: ['basement / cellar', 'قبو', 'підвал', 'cave / sous-sol'],
    kueche: ['kitchen', 'مطبخ', 'кухня', 'cuisine'],
    mauer: ['brick wall', 'جدار من الطوب', 'цегляна стіна', 'mur de briques'],
    rohr: ['pipe', 'أنبوب', 'труба', 'tuyau'],
    steckdose: ['power socket / outlet', 'مقبس كهربائي', 'розетка', 'prise électrique'],
    stecker: ['power plug', 'قابس كهربائي', 'електрична вилка', 'fiche électrique'],
    treppe: ['stairs / staircase', 'درج', 'сходи', 'escalier'],
    waschbecken: ['washbasin / sink', 'حوض غسيل', 'умивальник', 'lavabo'],
    wasserhahn: ['tap / faucet', 'صنبور', 'водопровідний кран', 'robinet'],
    ziegelstein: ['brick', 'طوبة', 'цеглина', 'brique'],
    bett: ['bed', 'سرير', 'ліжко', 'lit'],
    bild: ['picture / painting', 'صورة / لوحة', 'картина / зображення', 'image / tableau'],
    fernseher: ['television', 'تلفاز', 'телевізор', 'téléviseur'],
    hocker: ['stool', 'مقعد بلا مسند', 'табурет', 'tabouret'],
    kofferradio: ['portable radio', 'راديو محمول', 'портативний радіоприймач', 'radio portable'],
    kuehlschrank: ['refrigerator / fridge', 'ثلاجة', 'холодильник', 'réfrigérateur'],
    lampe: ['lamp', 'مصباح', 'лампа', 'lampe'],
    matratze: ['mattress', 'مرتبة', 'матрац', 'matelas'],
    plattenspieler: ['record player', 'مشغّل الأسطوانات', 'програвач платівок', 'tourne-disque'],
    regal: ['shelf / shelving unit', 'رف / وحدة رفوف', 'полиця / стелаж', 'étagère'],
    schrank: ['cupboard / wardrobe', 'خزانة', 'шафа', 'armoire'],
    sessel: ['armchair', 'كرسي بذراعين', 'крісло', 'fauteuil'],
    sofa: ['sofa / couch', 'أريكة', 'диван', 'canapé'],
    spiegel: ['mirror', 'مرآة', 'дзеркало', 'miroir'],
    stuhl: ['chair', 'كرسي', 'стілець', 'chaise'],
    teppich: ['carpet / rug', 'سجادة', 'килим', 'tapis'],
    tisch: ['table', 'طاولة', 'стіл', 'table'],
    truhe: ['storage chest', 'صندوق تخزين', 'скриня', 'coffre'],
    vorhang: ['curtain', 'ستارة', 'штора', 'rideau'],
    waschmaschine: ['washing machine', 'غسالة', 'пральна машина', 'machine à laver'],
    leiter: ['ladder', 'سلّم متنقّل', 'драбина', 'échelle'],
    eimer: ['bucket', 'دلو', 'відро', 'seau'],
    pinsel: ['paintbrush', 'فرشاة طلاء', 'пензель', 'pinceau'],
    farbrolle: ['paint roller', 'أسطوانة طلاء', 'малярний валик', 'rouleau à peinture'],
    schaufel: ['shovel', 'مجرفة', 'лопата', 'pelle'],
    schubkarre: ['wheelbarrow', 'عربة يد', 'тачка', 'brouette'],
    saege: ['saw', 'منشار', 'пилка', 'scie'],
    zementmischer: ['cement mixer', 'خلاطة الإسمنت', 'бетономішалка', 'bétonnière'],
    geruest: ['scaffolding', 'سقالات', 'риштування', 'échafaudage'],
    antenne: ['antenna', 'هوائي', 'антена', 'antenne'],
    dachziegel: ['roof tile', 'قرميدة', 'черепиця', 'tuile'],
    schlauch: ['hose', 'خرطوم', 'шланг', 'tuyau souple'],
    maurerkelle: ['bricklayer’s trowel', 'مسطرين البناء', 'кельма', 'truelle'],
    karton: ['cardboard box', 'صندوق كرتوني', 'картонна коробка', 'carton'],
    pflanze: ['plant', 'نبتة', 'рослина', 'plante'],
    besen: ['broom', 'مكنسة', 'мітла', 'balai'],
    regenschirm: ['umbrella', 'مظلّة', 'парасоля', 'parapluie'],
    kissen: ['pillow / cushion', 'وسادة', 'подушка', 'oreiller / coussin'],
    vogelkaefig: ['birdcage', 'قفص طيور', 'клітка для птахів', 'cage à oiseaux'],
    umzugswagen: ['moving truck / removal van', 'شاحنة نقل الأثاث', 'вантажівка для переїзду', 'camion de déménagement'],
};
const index = { en: 0, ar: 1, uk: 2, fr: 3 };
const extraIndex = { es: 0, ru: 1, fa: 2, pl: 3, it: 4, pt: 5 };
function objectMeaning(id, language) {
    const word = object_course_1.objectWordMap.get(id);
    if (!word)
        return '';
    if (language === 'tr')
        return word.tr;
    if (language === 'de')
        return word.description;
    if (language === 'en' || language === 'ar' || language === 'uk' || language === 'fr')
        return exports.objectMeanings[id]?.[index[language]] ?? '';
    if (language === 'es' || language === 'ru' || language === 'fa' || language === 'pl' || language === 'it' || language === 'pt')
        return object_extra_translations_1.extraObjectMeanings[id]?.[extraIndex[language]] ?? '';
    // Later site languages read the meaning from their language pack, by the English meaning.
    const english = exports.objectMeanings[id]?.[0] ?? '';
    return english ? (0, site_languages_1.packText)(language, english) : '';
}
