"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.housingSectionScene = exports.housingSceneArt = void 0;
exports.housingSceneFor = housingSceneFor;
exports.housingIllustration = housingIllustration;
const object_toon_art_json_1 = __importDefault(require("./object-toon-art.json"));
const sceneKeys = ['home-interior', 'housing-search', 'moving', 'neighbours', 'notices', 'weekend', 'verb-cards', 'home-features'];
exports.housingSceneArt = Object.fromEntries(sceneKeys.map((key, i) => [key, { src: '/toon/housing-scenes/housing-scenes-atlas.webp', width: 2172, height: 724, crop: { x: 2 + (i % 4) * 543, y: 2 + Math.floor(i / 4) * 362, width: 539, height: 358 } }]));
exports.housingSectionScene = { a: 'home-interior', b: 'moving', c: 'neighbours', d: 'housing-search' };
const nounIds = ['a-word-wg', 'a-word-kinderzimmer', 'a-word-toilette', 'a-word-balkon', 'a-word-flur', 'c-word-hausmeister', 'c-word-schluessel', 'c-word-nachbar', 'c-word-nachbarin', 'c-word-kinderwagen', 'c-word-hammer', 'c-word-zucker'];
const adjectiveIds = ['a-word-hell', 'a-word-dunkel', 'a-word-laut', 'a-word-ruhig', 'a-word-billig', 'a-word-teuer'];
const literalArt = {};
nounIds.forEach((id, i) => { const x = [2, 445, 889, 1332][i % 4], y = [2, 297, 593][Math.floor(i / 4)]; literalArt['housing-11-' + id] = { src: '/toon/housing-scenes/housing-nouns-atlas.webp', width: 1774, height: 887, crop: { x, y, width: i % 2 === 0 ? 439 : 440, height: i < 4 ? 291 : 292 } }; });
adjectiveIds.forEach((id, i) => { literalArt['housing-11-' + id] = { src: '/toon/housing-scenes/housing-adjectives-atlas.webp', width: 1881, height: 836, crop: { x: 2 + (i % 3) * 627, y: i < 3 ? 2 : 420, width: 623, height: 414 } }; });
function housingSceneFor(q) {
    if (/-(?:participle|card)-/.test(q.id)) {
        if (/-(?:suchen|finden|mieten)(?:-test)?$/.test(q.id))
            return 'housing-search';
        if (/-(?:fragen|reden)(?:-test)?$/.test(q.id))
            return 'neighbours';
        if (/-(?:lesen|schreiben|sehen|arbeiten)(?:-test)?$/.test(q.id))
            return 'verb-cards';
        return 'weekend';
    }
    if (q.section === 'a')
        return q.rule === 'adjective' || q.step === 2 ? 'home-features' : 'home-interior';
    if (q.section === 'b')
        return q.step === 1 ? 'housing-search' : q.step === 2 ? 'moving' : 'weekend';
    if (q.section === 'c')
        return q.step === 1 ? 'notices' : 'neighbours';
    return q.step === 1 ? 'housing-search' : q.step === 2 ? 'verb-cards' : 'weekend';
}
function housingIllustration(q) {
    const existing = q.art ? object_toon_art_json_1.default[q.art] : undefined;
    return existing ?? literalArt[q.id.replace(/-test$/, '')] ?? exports.housingSceneArt[housingSceneFor(q)];
}
