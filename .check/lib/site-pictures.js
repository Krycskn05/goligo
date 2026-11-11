"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANDING_COVERS = exports.WIDE_MEDIA = exports.HOME_COVERS_PC = exports.HOME_COVERS = exports.PICTURE_PERIOD_MS = exports.PART_PICTURES = void 0;
exports.pickPictures = pickPictures;
exports.nextPictureChange = nextPictureChange;
/**
 * The learner's pictures for the parts of the site (made in ChatGPT): the home page set (public/toon/home), the
 * introduction page set (public/toon/landing), the first drawings (*-2) and the simple drawings (*-3, only for the
 * parts they fit: welcome, Nesne Kasası, Oyunlar). The learner asked to mix them so the pages do not always look the
 * same, and to change them every 30 minutes: every half hour each part shows its next picture, the parts each at
 * their own step, so the pages mix the sets.
 */
exports.PART_PICTURES = {
    welcome: ['/toon/landing/karsilama.webp', '/toon/landing/karsilama-2.webp', '/toon/landing/karsilama-3.webp'],
    units: ['/toon/home/units.webp', '/toon/landing/uniteler.webp', '/toon/landing/uniteler-2.webp'],
    vault: ['/toon/home/vault.webp', '/toon/landing/nesne-kasasi.webp', '/toon/landing/nesne-kasasi-2.webp', '/toon/landing/nesne-kasasi-3.webp'],
    verbs: ['/toon/home/verbs.webp', '/toon/landing/fiil-atolyesi.webp', '/toon/landing/fiil-atolyesi-2.webp'],
    games: ['/toon/home/games.webp', '/toon/landing/oyunlar.webp', '/toon/landing/oyunlar-2.webp', '/toon/landing/oyunlar-3.webp'],
    mistakes: ['/toon/home/mistakes.webp', '/toon/landing/yanlislarim.webp', '/toon/landing/yanlislarim-2.webp'],
};
/** The pictures change every 30 minutes (the learner asked). */
exports.PICTURE_PERIOD_MS = 30 * 60 * 1000;
/** Each part starts at its own step, so one half hour shows pictures from different sets. */
const STEP = { welcome: 0, units: 1, vault: 2, verbs: 0, games: 1, mistakes: 2 };
/** The pictures for this half hour (`now` in milliseconds, Date.now()). */
function pickPictures(now = Date.now()) {
    const slot = Math.floor(now / exports.PICTURE_PERIOD_MS);
    const pick = {};
    for (const part of Object.keys(exports.PART_PICTURES)) {
        const list = exports.PART_PICTURES[part];
        pick[part] = list[(slot + STEP[part]) % list.length];
    }
    return pick;
}
/**
 * The covers of the parts on the home page and on the introduction page: one picture per part, always the same, no
 * 30-minute change (only the welcome picture of the introduction page still changes). Since 5 November 2026 every
 * screen uses the learner's panoramic pictures (Goliqo-panoramik-kapaklar-1536x1024.zip, "put these on the home page":
 * everywhere, the earlier covers of Goliqo-ana-sayfa-kapaklari.zip are gone). Each set is cut from them for its frames,
 * every picture centred on its people and things. Since 6 November 2026 the learner's second set
 * (Goliqo-panoramik-kapaklar-1536x1024 (1).zip: the same scenes on a plain cream background, no table), under new names
 * (`-2`) so no phone keeps the earlier pictures. Since 11 November 2026 the Üniteler cover is the site's earlier picture
 * again (the book with the house, the clock, the bag and the suitcase; `units-*-3`, cut for the three frames): the
 * panoramic one showed the teacher, whose pictures the learner had removed.
 */
// Their own file names (public/toon/kapak): phones and browsers keep a picture under the same address for days, so new
// covers under old names did not show (the learner saw the old ones, 4 November 2026).
/** Phones (up to 760 px): every card frame is 2:1, so 1200×600, at the same scale as HOME_COVERS_PC. */
exports.HOME_COVERS = {
    units: '/toon/kapak/units-phone-3.webp',
    vault: '/toon/kapak/vault-phone-2.webp',
    verbs: '/toon/kapak/verbs-phone-2.webp',
    games: '/toon/kapak/games-phone-2.webp',
    mistakes: '/toon/kapak/mistakes-phone-2.webp',
};
/**
 * Tablets and computers (from 761 px, WIDE_MEDIA). There the home page fits one screen, so the card frames are 2:1 or
 * lower (a 1536×730 laptop gives the small cards 2.5:1 and the wide Üniteler card 4.3 to 5.4:1): the four small cards
 * 1200×520, Üniteler 2600×520 (the plain wall and table carried on at its sides), all at the same scale. In a 2:1 frame
 * a small card still shows all of its people and things (the widest, Fiil Atölyesi, is 903 of the 1040 shown).
 */
exports.HOME_COVERS_PC = {
    units: '/toon/kapak/units-pc-3.webp',
    vault: '/toon/kapak/vault-pc-2.webp',
    verbs: '/toon/kapak/verbs-pc-2.webp',
    games: '/toon/kapak/games-pc-2.webp',
    mistakes: '/toon/kapak/mistakes-pc-2.webp',
};
/** The screens that get HOME_COVERS_PC: wider than a phone (tablets and computers); app/koko-theme.css uses the same query. */
exports.WIDE_MEDIA = '(min-width:761px)';
/**
 * The introduction page's tiles (app/landing.tsx): 4:3 frames (the last tile 3:1 on a phone), so 960×720, cut closer
 * than the home page covers so the people stay big in the small tiles; Üniteler a little wider to keep its books.
 */
exports.LANDING_COVERS = {
    units: '/toon/kapak/units-intro-3.webp',
    vault: '/toon/kapak/vault-intro-2.webp',
    verbs: '/toon/kapak/verbs-intro-2.webp',
    games: '/toon/kapak/games-intro-2.webp',
    mistakes: '/toon/kapak/mistakes-intro-2.webp',
};
/** Milliseconds until the pictures change next. */
function nextPictureChange(now = Date.now()) { return exports.PICTURE_PERIOD_MS - now % exports.PICTURE_PERIOD_MS; }
