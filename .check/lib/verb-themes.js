"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeGerman = exports.isVerbTheme = exports.verbThemeMap = exports.verbThemes = void 0;
exports.themeTitle = themeTitle;
const site_languages_1 = require("./site-languages");
const define = (id, emoji, tone, verbs, title) => ({ id: 'theme-' + id, emoji, tone, verbs, title });
exports.verbThemes = [
    define('unterwegs', '🚆', 'sky', ['abfahren', 'ankommen', 'aussteigen', 'umsteigen', 'fahren', 'fliegen', 'gehen', 'kommen', 'laufen', 'mitkommen', 'zurückfahren', 'zurückgehen', 'zurückkommen'], ['Yolculuk ve hareket', 'Unterwegs', 'On the move', 'في الطريق', 'У дорозі', 'En route', 'De viaje', 'В пути', 'در راه', 'W drodze', 'In viaggio', 'A caminho']),
    define('essen', '🍽️', 'orange', ['essen', 'trinken', 'einladen', 'anbieten', 'empfehlen', 'mitbringen', 'schneiden', 'singen', 'treffen', 'gefallen', 'schwimmen'], ['Yemek ve boş zaman', 'Essen und Freizeit', 'Food and free time', 'الطعام ووقت الفراغ', 'Їжа і дозвілля', 'Repas et loisirs', 'Comida y tiempo libre', 'Еда и досуг', 'غذا و اوقات فراغت', 'Jedzenie i czas wolny', 'Cibo e tempo libero', 'Comida e tempo livre']),
    define('alltag', '🏠', 'green', ['aufstehen', 'anziehen', 'ausziehen', 'umziehen', 'schlafen', 'liegen', 'sitzen', 'stehen', 'schließen', 'ziehen', 'tragen', 'anfangen', 'beginnen'], ['Ev ve gün', 'Zu Hause und im Alltag', 'Home and daily life', 'البيت والحياة اليومية', 'Дім і щоденне життя', 'Maison et quotidien', 'Casa y vida diaria', 'Дом и повседневность', 'خانه و زندگی روزمره', 'Dom i codzienność', 'Casa e vita quotidiana', 'Casa e dia a dia']),
    define('sprechen', '💬', 'violet', ['anrufen', 'rufen', 'sprechen', 'heißen', 'denken', 'kennen', 'wissen', 'verstehen', 'lesen', 'schreiben', 'sehen', 'aussehen', 'vergessen', 'herunterladen'], ['Konuşma ve düşünme', 'Sprechen und Denken', 'Talking and thinking', 'الكلام والتفكير', 'Говорити й думати', 'Parler et penser', 'Hablar y pensar', 'Говорить и думать', 'حرف زدن و فکر کردن', 'Mówienie i myślenie', 'Parlare e pensare', 'Falar e pensar']),
    define('geld', '💶', 'gold', ['abgeben', 'bekommen', 'geben', 'nehmen', 'mitnehmen', 'bringen', 'leihen', 'überweisen', 'unterschreiben', 'zurückgeben', 'verlieren', 'finden', 'gelten'], ['Para ve resmî işler', 'Geld und Ämter', 'Money and paperwork', 'المال والمعاملات', 'Гроші й установи', 'Argent et démarches', 'Dinero y trámites', 'Деньги и документы', 'پول و کارهای اداری', 'Pieniądze i urzędy', 'Soldi e pratiche', 'Dinheiro e burocracia']),
    define('gefuehle', '❤️', 'rose', ['wehtun', 'leidtun', 'stoßen', 'helfen', 'bleiben', 'werden', 'tun', 'scheinen'], ['Sağlık ve hisler', 'Gesundheit und Gefühle', 'Health and feelings', 'الصحة والمشاعر', 'Здоров’я і почуття', 'Santé et sentiments', 'Salud y sentimientos', 'Здоровье и чувства', 'سلامت و احساسات', 'Zdrowie i uczucia', 'Salute e sentimenti', 'Saúde e sentimentos']),
];
exports.verbThemeMap = new Map(exports.verbThemes.map(theme => [theme.id, theme]));
const isVerbTheme = (topic) => exports.verbThemeMap.has(topic);
exports.isVerbTheme = isVerbTheme;
function themeTitle(theme, language) { return (0, site_languages_1.pickText)(theme.title, language); }
/** The group's German name (under the title, for learners of other languages). */
const themeGerman = (theme) => theme.title[1];
exports.themeGerman = themeGerman;
