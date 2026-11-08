"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alltagWaiting = exports.alltagCovers = exports.alltagPic = void 0;
/**
 * The pictures of Lektion 5 „Alltag und Freizeit“. The learner makes the 3D pictures in ChatGPT from our list (Claude
 * outputs/lektion5-resim-listesi.txt, 8 November 2026); the ones that have arrived are named in `arrived` and live in
 * public/toon/lektion5 (the things 640 × 480, the part covers 960 × 540). Until a picture arrives, a word shows the
 * site's picture of the same verb when there is one (public/verbs, Lektion 2–4), else its emoji.
 */
const arrived = new Set([]);
const own = (name, instead) => arrived.has(name) ? '/toon/lektion5/' + name + '.webp' : instead;
const verb = (name) => '/verbs/' + name + '.webp';
const l3 = (name) => '/toon/lektion3/' + name + '.webp';
const l4 = (name) => '/toon/lektion4/' + name + '.webp';
exports.alltagPic = {
    // Teil A: the day
    duschen: own('duschen'), fruehstuecken: own('fruehstuecken'), zurArbeit: own('zur-arbeit-gehen', verb('gehen')), insBett: own('ins-bett-gehen'),
    surfen: own('im-internet-surfen', l3('laptop')), kochen: own('kochen'), lebensmittel: own('lebensmittel-kaufen'), musik: own('musik-hoeren'),
    putzen: own('putzen'), schlafen: verb('schlafen'), telefonieren: own('telefonieren', l3('handy')), tischtennis: own('tischtennis-spielen'),
    sport: own('sport-machen'), arbeiten: own('arbeiten'), kaffee: own('kaffee-trinken', verb('trinken')), lernen: own('deutsch-lernen'),
    morgen: own('morgen'), vormittag: own('vormittag'), mittag: own('mittag'), nachmittag: own('nachmittag'), abend: own('abend'), nacht: own('nacht'),
    // Teil B: free time and the city
    film: own('film-sehen'), fahrrad: own('fahrrad-fahren'), laufen: verb('laufen'), essen: verb('essen'), treffen: verb('treffen'), lesen: verb('lesen'),
    sprechen: verb('sprechen'), schwimmen: verb('schwimmen'), spaziergang: own('spaziergang'), picknick: own('picknick'), fussball: own('fussball-spielen'), grillen: own('grillen'),
    tanzen: '/toon/lektion2/b-tanzen.webp',
    stadt: own('stadt'), park: own('park'), zoo: own('zoo'), kino: own('kino'), schwimmbad: own('schwimmbad'), bibliothek: own('bibliothek'),
    cafe: l4('cafe'), restaurant: own('restaurant'), sprachcafe: own('sprachcafe'),
    // Teil C: the boxing club and the week
    boxen: own('boxen'), verein: own('verein'), kinderkurs: own('kinderkurs'), hausaufgaben: own('hausaufgaben'), jugendliche: own('jugendliche'), trainieren: own('trainieren'),
    woche: own('woche'), wochenende: own('wochenende'), anmeldung: own('anmeldung'), preis: own('preis'),
    // Teil C: what you think (the faces of Alıştırma 5)
    spass: own('spass'), interessant: own('interessant'), langweilig: own('langweilig'), weissNicht: own('weiss-nicht'), nichtSoGern: own('nicht-so-gern'), kommeAuch: own('ich-komme-auch'),
    // Teil D: a hobby that is a job
    kochkurs: own('kochkurs'), kellnerin: own('kellnerin'), interview: own('interview'), trainer: own('basketball-trainer'), schwimmkurs: own('schwimmkurs'), pantomime: own('pantomime'),
    unterrichten: own('unterrichten'), plakate: own('plakate', l3('plakat')), langeSchlafen: own('lange-schlafen'), hobby: own('hobby'), beruf: own('beruf'),
};
/** The part covers (960 × 540). Until the learner's covers come, four temporary ones (public/toon/lektion5/gecici-kapak-*.webp). */
const cover = (part) => ({ src: '/toon/lektion5/' + (arrived.has('kapak-' + part) ? '' : 'gecici-') + 'kapak-' + part + '.webp', width: 960, height: 540 });
exports.alltagCovers = { a: cover('a'), b: cover('b'), c: cover('c'), d: cover('d') };
/** The 3D pictures still to come (for the list and tests/alltag.test.cjs). */
const alltagWaiting = () => [
    'duschen', 'fruehstuecken', 'kaffee-trinken', 'zur-arbeit-gehen', 'arbeiten', 'deutsch-lernen', 'lebensmittel-kaufen', 'kochen', 'putzen', 'telefonieren', 'im-internet-surfen', 'musik-hoeren',
    'sport-machen', 'tischtennis-spielen', 'ins-bett-gehen', 'lange-schlafen', 'hobby', 'beruf', 'morgen', 'vormittag', 'mittag', 'nachmittag', 'abend', 'nacht',
    'film-sehen', 'fahrrad-fahren', 'spaziergang', 'picknick', 'fussball-spielen', 'grillen', 'stadt', 'park', 'zoo', 'kino', 'schwimmbad', 'bibliothek',
    'restaurant', 'sprachcafe', 'boxen', 'trainieren', 'verein', 'kinderkurs', 'jugendliche', 'hausaufgaben', 'anmeldung', 'preis', 'woche', 'wochenende',
    'spass', 'interessant', 'langweilig', 'weiss-nicht', 'nicht-so-gern', 'ich-komme-auch', 'unterrichten', 'kochkurs', 'kellnerin', 'interview', 'basketball-trainer', 'schwimmkurs',
    'pantomime', 'plakate', 'kapak-a', 'kapak-b', 'kapak-c', 'kapak-d',
].filter(name => !arrived.has(name));
exports.alltagWaiting = alltagWaiting;
