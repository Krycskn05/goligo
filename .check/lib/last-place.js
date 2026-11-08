"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonStepHref = exports.placeUnit = exports.LAST_PLACE_KEY = void 0;
exports.isPlaceHref = isPlaceHref;
exports.placePath = placePath;
exports.saveLastPlace = saveLastPlace;
exports.readLastPlace = readLastPlace;
exports.dayNumber = dayNumber;
exports.dailyIndex = dailyIndex;
exports.LAST_PLACE_KEY = 'lernkoko-last-place';
const paths = { housing: '/a1-2/ev-ve-yasam', ausbildung: '/a1-2/ausbildung', hoeren: '/a1-2/ausbildung/hoeren', vault: '/ev-esyalar', verbs: '/fiiller', willkommen: '/a1-1/willkommen', berufe: '/a1-1/berufe', orte: '/a1-1/orte-und-dinge', familie: '/a1-1/familie', alltag: '/a1-1/alltag-und-freizeit', stadt: '/a1-2/wege-in-der-stadt' };
/** The textbook unit of a lesson place (its name on the units page); the other places have their own titles. */
exports.placeUnit = { ausbildung: 'book-12', hoeren: 'book-12', willkommen: 'book-01', berufe: 'book-02', orte: 'book-03', familie: 'book-04', alltag: 'book-05', stadt: 'book-15' };
/** A lesson step's address: Teil A without `teil`, the other parts with it. */
const lessonStepHref = (id, part, step) => paths[id] + '?' + (part === 'a' ? '' : 'teil=' + part + '&') + 'adim=' + step;
exports.lessonStepHref = lessonStepHref;
const isPlaceId = (value) => typeof value === 'string' && Object.hasOwn(paths, value);
/** The page path itself, optionally with a plain query (letters, digits, = & . _ -). */
function isPlaceHref(id, href) {
    if (typeof href !== 'string' || href.length > 160)
        return false;
    const base = paths[id];
    if (href === base)
        return true;
    return href.startsWith(base + '?') && /^[\w=&.-]*$/.test(href.slice(base.length + 1));
}
function placePath(id) { return paths[id]; }
function saveLastPlace(storage, place, now = Date.now()) {
    const href = place.href && isPlaceHref(place.id, place.href) ? place.href : paths[place.id];
    const detail = typeof place.detail === 'string' && place.detail.trim() ? place.detail.trim().slice(0, 60) : undefined;
    try {
        storage.setItem(exports.LAST_PLACE_KEY, JSON.stringify({ id: place.id, href, ...(detail ? { detail } : {}), at: now }));
    }
    catch { }
}
function readLastPlace(storage) {
    let data = null;
    try {
        data = JSON.parse(storage.getItem(exports.LAST_PLACE_KEY) ?? 'null');
    }
    catch {
        return null;
    }
    if (!data || typeof data !== 'object')
        return null;
    const { id, href, detail, at } = data;
    if (!isPlaceId(id) || !isPlaceHref(id, href))
        return null;
    return { id, href, at: typeof at === 'number' && Number.isFinite(at) ? at : 0, ...(typeof detail === 'string' && detail.trim() ? { detail: detail.trim().slice(0, 60) } : {}) };
}
/** The verb of the day: the same verb all day long in the learner's time zone, then the next one. */
function dayNumber(now = Date.now(), timezoneOffset = new Date(now).getTimezoneOffset()) { return Math.floor((now - timezoneOffset * 60000) / 86400000); }
function dailyIndex(length, now = Date.now(), timezoneOffset) {
    if (length <= 0)
        return 0;
    const day = dayNumber(now, timezoneOffset);
    return ((day % length) + length) % length;
}
