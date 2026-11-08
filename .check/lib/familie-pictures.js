"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.familieCovers = exports.familiePic = void 0;
/**
 * The pictures of Lektion 4. The learner makes the 3D pictures in ChatGPT from our list (Claude outputs/
 * lektion4-resim-listesi.txt, 8 November 2026); the ones that have arrived are named in `arrived` and live in
 * public/toon/lektion4 (the things 640 × 480, the part covers 960 × 540). A word without its picture yet shows its
 * emoji. Things the site already draws keep their picture (Lektion 2 and 3, the Kelime Kasası, the verbs).
 */
const arrived = new Set([]);
const own = (name) => arrived.has(name) ? '/toon/lektion4/' + name + '.webp' : undefined;
const l3 = (name) => '/toon/lektion3/' + name + '.webp';
const vault = (name) => '/objects/toon/' + name + '.webp';
exports.familiePic = {
    // Teil A: the family (to be made)
    familie: own('familie'), eltern: own('eltern'), mutter: own('mutter'), vater: own('vater'), kind: own('kind'), baby: own('baby'),
    sohn: own('sohn'), tochter: own('tochter'), geschwister: own('geschwister'), bruder: own('bruder'), schwester: own('schwester'), grosseltern: own('grosseltern'),
    oma: own('oma'), opa: own('opa'), tante: own('tante'), onkel: own('onkel'), cousine: own('cousine'), cousin: own('cousin'),
    // Teil B: Familienstand, the house, the job
    ehemann: own('ehemann'), ehefrau: own('ehefrau'), enkel: own('enkel'), enkelin: own('enkelin'), garten: own('garten'), auto: own('auto'),
    chef: own('chef'), chefin: own('chefin'), job: own('job'), ledig: own('ledig'), verheiratet: own('verheiratet'), geschieden: own('geschieden'),
    haus: '/toon/lektion2/haus.webp', kiosk: l3('kiosk'), laptop: l3('laptop'), handy: l3('handy'), computer: l3('computer'),
    // Teil C: neighbours, the café, the interview
    nachbar: own('nachbar'), nachbarin: own('nachbarin'), cafe: own('cafe'), exfrau: own('ex-frau'), exmann: own('ex-mann'), besuchen: own('besuchen'), gespraech: own('gespraech'), privat: own('privat'), million: own('million'),
    kennen: '/verbs/kennen.webp', denken: '/verbs/denken.webp', woerterbuch: l3('woerterbuch'),
    // Teil D: the course room (the Kelime Kasası draws most of it)
    tafel: vault('schule-tafel'), lampe: vault('3d-lampe'), heizung: vault('3d-heizung'), steckdose: vault('3d-steckdose'), lichtschalter: vault('schule-lichtschalter'),
    landkarte: vault('schule-landkarte'), kreide: vault('schule-kreide'), lineal: vault('schule-lineal'), radiergummi: vault('schule-radiergummi'), papierkorb: vault('schule-papierkorb'),
    kabel: vault('3d-kabel'), tuerklinke: vault('schule-tuerklinke'), fenster: l3('fenster'), tuer: vault('schule-tuer'),
    wanduhr: own('wanduhr'), klimaanlage: own('klimaanlage'), lautsprecher: own('lautsprecher'), leinwand: own('leinwand'), garderobe: own('garderobe'), smartboard: own('smartboard'),
    gedicht: own('gedicht'),
    // things of the exercises and the summary
    tisch: l3('tisch'), stuhl: l3('stuhl'), bett: l3('bett'), sofa: l3('sofa'), regal: l3('regal'), schrank: l3('schrank'), schere: vault('gesundheit-schere'),
    buch: vault('schule-buch'), heft: vault('schule-heft'), foto: vault('schule-foto'),
};
/** The part covers (960 × 540). Until the learner's covers come, four temporary ones (public/toon/lektion4/gecici-kapak-*.webp). */
const cover = (part) => ({ src: '/toon/lektion4/gecici-kapak-' + part + '.webp', width: 960, height: 540 });
exports.familieCovers = { a: cover('a'), b: cover('b'), c: cover('c'), d: cover('d') };
