"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYNC_REQUEST_MAX = exports.SYNC_LESSON_MAX = exports.SYNC_VALUE_MAX = exports.SYNC_EVENT = exports.SYNC_META_KEY = exports.SYNC_LESSONS = void 0;
exports.syncLessonOf = syncLessonOf;
exports.isProgressKey = isProgressKey;
exports.resetItems = resetItems;
exports.fingerprint = fingerprint;
exports.scanLocal = scanLocal;
exports.localItems = localItems;
exports.mergeItems = mergeItems;
exports.cleanItems = cleanItems;
exports.parseStored = parseStored;
exports.toWrite = toWrite;
/**
 * Lesson progress on every device (the learner asked, 30 October 2026: "my progress on the tablet does not show on
 * the computer"). Lektion 1, 2, 12 and 15 keep their scores, the last step and half-done exercises in the browser
 * (localStorage keys `lernkoko-l1…`, `lernkoko-l2…`, `lernkoko-l12…`, `lernkoko-l15…`). For a member these keys also live in the
 * account: app/lesson-sync.tsx sends this browser's keys to app/api/ilerleme, the server merges them with what other
 * devices sent (`mergeItems`) and answers with the merged keys, which the browser writes back. Pure functions, checked
 * by tests/lesson-sync.test.cjs.
 *
 * Each key carries the time it last changed on a device (`t`, ms). The newer one wins; a removed key is kept as
 * `v:null` so a removal travels too. A key this browser had before syncing existed has `t:0` ("age unknown"): it never
 * beats a known change, and two score lists of unknown age are joined (exercises done on one device and others done on
 * the other device both stay).
 */
exports.SYNC_LESSONS = ['l1', 'l2', 'l12', 'l15', 'site'];
exports.SYNC_META_KEY = 'lernkoko-sync-meta';
/** Fired on window after keys from another device were written, so open lesson pages read them again. */
exports.SYNC_EVENT = 'lernkoko-sync';
/** Limits the server keeps to (one value, all keys of a lesson, the request). */
exports.SYNC_VALUE_MAX = 20000;
exports.SYNC_LESSON_MAX = 150000;
exports.SYNC_REQUEST_MAX = 480000;
/** Settings of one device, not progress. */
const DEVICE_ONLY = new Set(['lernkoko-l12-speed']);
/** The learner's own data — their sentences and their form in Lektion 2 (`lernkoko-l2a-own`, `lernkoko-l2d-form` …) —
 * stays on this device only (the learner asked, 2 November 2026); it is never sent to the account. */
const OWN_DATA = /^lernkoko-l2[a-d]-(own|form)$/;
/** Progress of the site that is no lesson (`site`, 2 November 2026): "Kaldığın yerden devam et" (lib/last-place.ts) and
 * the best scores of the games (Oyunlar). */
const SITE_KEY = /^lernkoko-(last-place$|verb-game:)/;
/** The lesson a browser key belongs to, or null for keys that are not synced. */
function syncLessonOf(key) {
    if (DEVICE_ONLY.has(key) || OWN_DATA.test(key))
        return null;
    if (SITE_KEY.test(key))
        return 'site';
    const match = /^lernkoko-l(1[a-d]?|12|15[a-d]?|2[a-d]?)[-:]/.exec(key);
    if (!match)
        return null;
    return match[1].startsWith('12') ? 'l12' : match[1].startsWith('15') ? 'l15' : match[1].startsWith('2') ? 'l2' : 'l1';
}
/** Half-done answers of word and verb rounds (`lernkoko-puzzle:<round>:<question>` …): they belong to a round of the account. */
const ROUND_DRAFT = /^lernkoko-(puzzle|housing-puzzle|housing-free):/;
/**
 * The keys Hesabım → "İlerlememi sıfırla" removes from this browser (the learner asked, 3 November 2026): every synced
 * key, the learner's own Lektion 2 entries and half-done round answers. Settings (language, voices, effects, the tour) stay.
 */
function isProgressKey(key) { return syncLessonOf(key) !== null || OWN_DATA.test(key) || ROUND_DRAFT.test(key); }
/** The account's keys after a reset: each one removed, newer than its last change, so no device brings an old value back. */
function resetItems(items, now) {
    const out = {};
    for (const [key, item] of Object.entries(items))
        out[key] = { v: null, t: Math.max(now, item.t + 1) };
    return out;
}
/** A short fingerprint of a value (FNV-1a and the length); '-' for a missing key. */
function fingerprint(value) {
    if (value === null)
        return '-';
    let hash = 0x811c9dc5;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(36) + '.' + value.length;
}
/** Notes what changed in the browser since the last look: changed keys get `now`, keys seen for the first time get 0. */
function scanLocal(local, meta, now) {
    const next = {};
    for (const [key, value] of Object.entries(local)) {
        if (!syncLessonOf(key))
            continue;
        const before = meta[key];
        const h = fingerprint(value);
        next[key] = !before ? { h, t: 0 } : before.h === h ? before : { h, t: now };
    }
    for (const [key, before] of Object.entries(meta)) {
        if (key in next || !syncLessonOf(key))
            continue;
        next[key] = before.h === '-' ? before : { h: '-', t: now };
    }
    return next;
}
/** This browser's keys of one lesson, with their times. */
function localItems(lesson, local, meta) {
    const items = {};
    for (const [key, info] of Object.entries(meta)) {
        if (syncLessonOf(key) !== lesson)
            continue;
        const value = key in local ? local[key] : null;
        if (value === null && info.t === 0)
            continue;
        items[key] = { v: value, t: info.t };
    }
    return items;
}
function asObject(value) {
    if (value === null)
        return null;
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    }
    catch {
        return null;
    }
}
/** A list of exercise scores (`lernkoko-l1a-scores`, `lernkoko-l12-scores` …): every entry has `right`. */
const isScoreList = (key) => /-scores$/.test(key);
const rightOf = (score) => score && typeof score === 'object' && typeof score.right === 'number' ? score.right : -1;
/** Two score lists joined: every exercise done on either device stays, with its better result. */
function joinScores(kept, incoming) {
    const out = { ...kept };
    for (const [id, score] of Object.entries(incoming))
        if (!(id in out) || rightOf(score) > rightOf(out[id]))
            out[id] = score;
    return out;
}
/**
 * Merges what a device sends (`incoming`) into what is kept (`kept`). The newer change of a key wins; a key of
 * unknown age (t 0) loses to a known change, and two JSON objects of which one has unknown age are joined (the
 * kept side wins where both have the same entry). Two score lists are always joined, whatever their age, so exercises
 * done on two devices at about the same time are both kept (the learner asked, 2 November 2026); removing a list (a
 * reset) still travels as the newer change. `now` stamps a joined value so it reaches every device.
 */
function mergeItems(kept, incoming, now) {
    const out = { ...kept };
    for (const [key, mine] of Object.entries(incoming)) {
        const theirs = kept[key];
        if (!theirs) {
            out[key] = mine;
            continue;
        }
        if (theirs.v === mine.v) {
            out[key] = { v: mine.v, t: Math.max(theirs.t, mine.t) };
            continue;
        }
        if (isScoreList(key)) {
            const a = asObject(theirs.v), b = asObject(mine.v);
            if (a && b) {
                const joined = JSON.stringify(joinScores(a, b));
                out[key] = joined === theirs.v ? theirs : joined === mine.v ? mine : { v: joined, t: now };
                continue;
            }
        }
        if (mine.t === 0 || theirs.t === 0) {
            const a = asObject(theirs.v), b = asObject(mine.v);
            if (a && b) {
                out[key] = { v: JSON.stringify({ ...b, ...a }), t: now };
                continue;
            }
            out[key] = mine.t === 0 ? theirs : mine;
            continue;
        }
        out[key] = mine.t > theirs.t ? mine : theirs;
    }
    return out;
}
/** Reads a stored or sent list of keys of one lesson; anything wrong is left out. */
function cleanItems(lesson, value) {
    const items = {};
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return items;
    for (const [key, item] of Object.entries(value)) {
        if (syncLessonOf(key) !== lesson || !item || typeof item !== 'object')
            continue;
        const { v, t } = item;
        if (!(v === null || typeof v === 'string') || typeof v === 'string' && v.length > exports.SYNC_VALUE_MAX)
            continue;
        if (typeof t !== 'number' || !Number.isFinite(t) || t < 0)
            continue;
        items[key] = { v, t: Math.floor(t) };
    }
    return items;
}
function parseStored(lesson, text) {
    if (!text)
        return {};
    try {
        return cleanItems(lesson, JSON.parse(text).items);
    }
    catch {
        return {};
    }
}
/** What the browser should write after the server answered: merged keys that differ from the browser (null = remove). */
function toWrite(merged, local) {
    const out = {};
    for (const [key, item] of Object.entries(merged)) {
        const now = key in local ? local[key] : null;
        if (item.v !== now)
            out[key] = item.v;
    }
    return out;
}
