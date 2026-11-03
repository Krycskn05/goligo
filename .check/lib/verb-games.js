"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATCH_PREVIEW_SECONDS = exports.gameIds = void 0;
exports.mix = mix;
exports.gameVerbs = gameVerbs;
exports.sentenceRound = sentenceRound;
exports.sentenceCorrect = sentenceCorrect;
exports.auxRound = auxRound;
exports.auxCorrect = auxCorrect;
exports.buildRound = buildRound;
exports.buildTarget = buildTarget;
exports.buildCorrect = buildCorrect;
exports.buildSuffix = buildSuffix;
exports.matchKinds = matchKinds;
exports.matchRound = matchRound;
exports.bestKey = bestKey;
const verb_course_1 = require("./verb-course");
const verb_themes_1 = require("./verb-themes");
const verb_logic_1 = require("./verb-logic");
// Offered on the page: the matching cards and the new games (the learner asked for them, October 2026; their rounds are
// in lib/object-games.ts). Cümle kurma, hat mı ist mi? and Biçim yapbozu were taken off at the learner's request (their
// rounds stay here, unused, so nothing else breaks).
exports.gameIds = ['match', 'rain', 'catch', 'quick', 'search', 'rescue', 'plural'];
function mix(items, random = Math.random) { const result = [...items]; for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
} return result; }
/** The verbs of a round: all, a textbook group, or a Fiil grupları topic (lib/verb-themes.ts). */
function gameVerbs(topic) { const theme = verb_themes_1.verbThemeMap.get(topic); return verb_course_1.verbs.filter(verb => topic === 'verbs-all' || verb.group === topic || !!theme?.verbs.includes(verb.id)); }
const tiles = (texts, prefix) => texts.map((text, index) => ({ id: prefix + index, text }));
/** Put the sentence parts in order; one tempting wrong form is mixed in. */
function sentenceRound(topic, count = 10, random = Math.random) {
    return mix(gameVerbs(topic), random).slice(0, count).map((verb, index) => {
        const tense = random() < 0.5 ? 'praesens' : 'perfekt';
        const chunks = (0, verb_logic_1.sentenceChunks)(verb, tense);
        return { verbId: verb.id, tense, chunks, tiles: mix(tiles([...chunks.map(chunk => chunk.text), (0, verb_logic_1.sentenceDistractor)(verb, tense)], 's' + index + '-'), random) };
    });
}
function sentenceCorrect(task, placed) { return placed.join(' ') === task.chunks.map(chunk => chunk.text).join(' '); }
function auxRound(topic, count = 10, random = Math.random) { return mix(gameVerbs(topic), random).slice(0, count).map(verb => ({ verbId: verb.id })); }
/** liegen takes hat (and ist in the south); every other verb has one helping verb. */
function auxCorrect(verb, choice) { return choice === verb.aux || (verb.alsoIst && choice === 'ist'); }
/** Build the Partizip II (all verbs) or the sie/er Präsens form (verbs whose form changes) from pieces. */
function buildRound(topic, count = 10, random = Math.random) {
    const pool = [];
    for (const verb of gameVerbs(topic)) {
        pool.push({ verbId: verb.id, kind: 'participle', pieces: (0, verb_logic_1.participlePieces)(verb), tiles: [] });
        const ps = (0, verb_logic_1.praesensPieces)(verb);
        if (ps)
            pool.push({ verbId: verb.id, kind: 'praesens', pieces: ps, tiles: [] });
    }
    const picked = [];
    const used = new Set();
    // One task per verb first, so a short round meets more verbs.
    for (const task of mix(pool, random)) {
        if (picked.length >= count)
            break;
        if (used.has(task.verbId))
            continue;
        used.add(task.verbId);
        picked.push(task);
    }
    for (const task of mix(pool, random)) {
        if (picked.length >= count)
            break;
        if (!picked.includes(task))
            picked.push(task);
    }
    return picked.map((task, index) => { const verb = verb_course_1.verbs.find(item => item.id === task.verbId); const wrong = task.kind === 'participle' ? (0, verb_logic_1.participleWrongPieces)(verb) : (0, verb_logic_1.praesensWrongPieces)(verb); return { ...task, tiles: mix(tiles([...task.pieces, ...wrong], 'b' + index + '-'), random) }; });
}
function buildTarget(task) { return task.pieces.join(''); }
function buildCorrect(task, placed) { return placed.join('') === buildTarget(task); }
/** The separable prefix that follows a Präsens form (fährt … ab), shown next to the puzzle. */
function buildSuffix(task) { const verb = verb_course_1.verbs.find(item => item.id === task.verbId); return task.kind === 'praesens' ? (0, verb_logic_1.verbPrefix)(verb) : ''; }
function matchKinds(topic) { return gameVerbs(topic).filter(verb => (0, verb_logic_1.verbPicture)(verb)).length >= 6 ? ['picture', 'perfekt', 'meaning'] : ['perfekt', 'meaning']; }
/** Six pairs: the infinitive on one card, its picture, Perfekt or meaning on the other. */
function matchRound(topic, kind, language, pairs = 6, random = Math.random) {
    const pool = gameVerbs(topic).filter(verb => kind !== 'picture' || (0, verb_logic_1.verbPicture)(verb));
    const cards = [];
    for (const verb of mix(pool, random).slice(0, pairs)) {
        cards.push({ id: verb.id + ':verb', pair: verb.id, face: 'verb', text: verb.display });
        if (kind === 'picture')
            cards.push({ id: verb.id + ':picture', pair: verb.id, face: 'picture', text: (0, verb_course_1.verbMeaning)(verb, language), picture: (0, verb_logic_1.verbPicture)(verb) });
        else if (kind === 'perfekt')
            cards.push({ id: verb.id + ':perfekt', pair: verb.id, face: 'perfekt', text: (0, verb_course_1.verbPronoun)(verb) + ' ' + (verb.alsoIst ? 'hat/ist ' + verb.participle : verb.perfekt) });
        else
            cards.push({ id: verb.id + ':meaning', pair: verb.id, face: 'meaning', text: (0, verb_course_1.verbMeaning)(verb, language) });
    }
    return mix(cards, random);
}
/** Matching cards (Eşleştirme kartları, Çoğul eşleştirme): all cards are shown face up for this many seconds first, then
 * they turn over and the game starts (the learner asked). */
exports.MATCH_PREVIEW_SECONDS = 5;
/** Best scores stay in this browser only (higher is better; for memory fewer moves is better). */
function bestKey(game, topic, kind = '') { return 'lernkoko-verb-game:' + game + ':' + topic + (kind ? ':' + kind : ''); }
