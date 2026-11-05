"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingPictures = exports.orteCovers = exports.objectPic = void 0;
/**
 * The pictures of Lektion 3. The things that already have a picture in the Kelime Kasası use it (`objectPic`); the
 * covers and the pictures still to be made (`missingPictures`, the learner makes them in ChatGPT, 5 November 2026) show
 * a temporary cover or the word's emoji until they come (public/toon/lektion3).
 */
exports.objectPic = {
    tisch: '/objects/drawn/tisch.svg', stuhl: '/objects/drawn/stuhl.svg', sofa: '/objects/drawn/sofa.svg', bett: '/objects/drawn/bett.svg',
    schrank: '/objects/drawn/schrank.svg', regal: '/objects/drawn/regal.svg', herd: '/objects/drawn/herd.svg', fenster: '/objects/drawn/fenster.svg',
    kuehlschrank: '/objects/drawn/kuehlschrank.svg', waschmaschine: '/objects/drawn/waschmaschine.svg',
    bank: '/objects/toon/draussen-bank.webp', tasche: '/objects/toon/schule-tasche.webp', buch: '/objects/toon/schule-buch.webp',
    heft: '/objects/toon/schule-heft.webp', stift: '/objects/toon/schule-kugelschreiber.webp', bleistift: '/objects/toon/schule-bleistift.webp',
    foto: '/objects/toon/schule-foto.webp', kaffee: '/objects/toon/getraenke-kaffee.webp', kaffeemaschine: '/objects/toon/kueche-kaffeemaschine.webp',
    tafel: '/objects/toon/schule-tafel.webp', tuer: '/objects/toon/schule-tuer.webp', kleid: '/objects/toon/kleidung-kleid.webp',
    schere: '/objects/toon/gesundheit-schere.webp', topf: '/objects/toon/kueche-topf.webp',
};
/** The part covers (960 × 540). Until the learner's pictures come, a temporary cover drawn from the unit's things. */
const cover = (file) => ({ src: '/toon/lektion3/' + file, width: 960, height: 540 });
exports.orteCovers = { a: cover('gecici-kapak-a.webp'), b: cover('gecici-kapak-b.webp'), c: cover('gecici-kapak-c.webp'), d: cover('gecici-kapak-d.webp') };
/** The pictures still to be made: the file name in public/toon/lektion3, its size and what it shows (in Turkish, for the prompt). */
exports.missingPictures = [
    { file: 'kapak-a.webp', width: 960, height: 540, shows: 'Teil A kapağı: solda Mei odasında masada kitap okuyor (yatak var, sandalye yok); sağda parkta Sabine ve Tomasz bir bankta defterle, arkada çocuklar oynuyor' },
    { file: 'kapak-b.webp', width: 960, height: 540, shows: 'Teil B kapağı: Omar’ın küçük büfesi (Kiosk): büyük buzdolabı, eski kasa, kahve makinesi; Omar tezgâhın arkasında anahtar tutuyor' },
    { file: 'kapak-c.webp', width: 960, height: 540, shows: 'Teil C kapağı: Yasemin telefonla konuşuyor, önünde laptopta küçük ilanlar: çamaşır makinesi, buzdolabı, ocak; fiyat etiketleri (€)' },
    { file: 'kapak-d.webp', width: 960, height: 540, shows: 'Teil D kapağı: Aisha terzi atölyesinde dikiş makinesinin başında; büyük pencere, eski bir makas, askıda bir elbise' },
    { file: 'plakat.webp', width: 640, height: 480, shows: 'duvarda bir afiş (poster), üzerinde yazı yok' },
    { file: 'handy.webp', width: 640, height: 480, shows: 'bir cep telefonu (Handy), ekranı açık' },
    { file: 'computer.webp', width: 640, height: 480, shows: 'masada bir masaüstü bilgisayar (monitör ve klavye)' },
    { file: 'laptop.webp', width: 640, height: 480, shows: 'açık bir dizüstü bilgisayar (laptop)' },
    { file: 'kasse.webp', width: 640, height: 480, shows: 'büfe tezgâhında eski bir yazar kasa' },
    { file: 'kiosk.webp', width: 640, height: 480, shows: 'Almanya’da bir sokak büfesi (Kiosk), dışarıdan' },
    { file: 'schluessel.webp', width: 640, height: 480, shows: 'tek bir anahtar' },
    { file: 'spuelmaschine.webp', width: 640, height: 480, shows: 'kapağı açık bir bulaşık makinesi' },
    { file: 'naehmaschine.webp', width: 640, height: 480, shows: 'bir dikiş makinesi' },
    { file: 'woerterbuch.webp', width: 640, height: 480, shows: 'kalın bir sözlük kitabı' },
    { file: 'wortkarte.webp', width: 640, height: 480, shows: 'renkli kelime kartları (önünde yazı yok)' },
    { file: 'arbeitsplatz.webp', width: 640, height: 480, shows: 'Aisha’nın atölyesinde çalışma masası: dikiş makinesi, makas, kumaşlar' },
];
