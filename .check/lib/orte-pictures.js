"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orteCovers = exports.objectPic = void 0;
/**
 * The pictures of Lektion 3. The learner's 3D pictures (Goliqo-Lektion3-3D-Gorseller.zip, 6 November 2026, made in
 * ChatGPT from our list) are in public/toon/lektion3: the four part covers (960 × 540) and the things (640 × 480), the
 * furniture too, so all cards look alike. The things that are not in it keep their Kelime Kasası picture.
 */
const own = (name) => '/toon/lektion3/' + name + '.webp';
exports.objectPic = {
    tisch: own('tisch'), stuhl: own('stuhl'), sofa: own('sofa'), bett: own('bett'), schrank: own('schrank'), regal: own('regal'), herd: own('herd'),
    fenster: own('fenster'), kuehlschrank: own('kuehlschrank'), waschmaschine: own('waschmaschine'),
    plakat: own('plakat'), handy: own('handy'), computer: own('computer'), laptop: own('laptop'), kasse: own('kasse'), kiosk: own('kiosk'),
    schluessel: own('schluessel'), spuelmaschine: own('spuelmaschine'), naehmaschine: own('naehmaschine'), woerterbuch: own('woerterbuch'),
    wortkarte: own('wortkarte'), arbeitsplatz: own('arbeitsplatz'),
    // From the Kelime Kasası:
    bank: '/objects/toon/draussen-bank.webp', tasche: '/objects/toon/schule-tasche.webp', buch: '/objects/toon/schule-buch.webp',
    heft: '/objects/toon/schule-heft.webp', stift: '/objects/toon/schule-kugelschreiber.webp', bleistift: '/objects/toon/schule-bleistift.webp',
    foto: '/objects/toon/schule-foto.webp', kaffee: '/objects/toon/getraenke-kaffee.webp', kaffeemaschine: '/objects/toon/kueche-kaffeemaschine.webp',
    tafel: '/objects/toon/schule-tafel.webp', tuer: '/objects/toon/schule-tuer.webp', kleid: '/objects/toon/kleidung-kleid.webp',
    schere: '/objects/toon/gesundheit-schere.webp', topf: '/objects/toon/kueche-topf.webp',
};
/** The part covers (960 × 540): A Mei and Sabine & Tomasz learning, B Omar's kiosk, C Yasemin on the phone, D Aisha sewing. */
const cover = (part) => ({ src: own('kapak-' + part), width: 960, height: 540 });
exports.orteCovers = { a: cover('a'), b: cover('b'), c: cover('c'), d: cover('d') };
