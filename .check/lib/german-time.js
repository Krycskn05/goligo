"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PART_NOUN = exports.MONTHS = exports.WEEKDAYS = void 0;
exports.numberWord = numberWord;
exports.ordinalWord = ordinalWord;
exports.partOfDay = partOfDay;
exports.greetings = greetings;
exports.partPhrases = partPhrases;
exports.isoWeek = isoWeek;
exports.dayPhrases = dayPhrases;
exports.weekPhrases = weekPhrases;
exports.timePhrases = timePhrases;
exports.germanMoment = germanMoment;
const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = { 20: 'zwanzig', 30: 'dreißig', 40: 'vierzig', 50: 'fünfzig' };
exports.WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
exports.MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
/** 0–59 in words: einundzwanzig, dreißig … */
function numberWord(n) {
    if (n < 20)
        return ONES[n];
    const tens = Math.floor(n / 10) * 10, ones = n % 10;
    return ones ? (ones === 1 ? 'ein' : ONES[ones]) + 'und' + TENS[tens] : TENS[tens];
}
/** Ordinal for a date or a week (1–59): erste, dritte, siebte, einundzwanzigste … */
function ordinalWord(n) {
    const special = { 1: 'erste', 3: 'dritte', 7: 'siebte', 8: 'achte' };
    if (special[n])
        return special[n];
    return numberWord(n) + (n < 20 ? 'te' : 'ste');
}
/** Part of the day as German textbooks teach it. */
function partOfDay(hour) {
    return hour >= 5 && hour < 9 ? 'morgen' : hour >= 9 && hour < 12 ? 'vormittag' : hour >= 12 && hour < 14 ? 'mittag' : hour >= 14 && hour < 18 ? 'nachmittag' : hour >= 18 && hour < 22 ? 'abend' : 'nacht';
}
exports.PART_NOUN = { morgen: 'Morgen', vormittag: 'Vormittag', mittag: 'Mittag', nachmittag: 'Nachmittag', abend: 'Abend', nacht: 'Nacht' };
const PART_ADVERB = { morgen: 'morgens', vormittag: 'vormittags', mittag: 'mittags', nachmittag: 'nachmittags', abend: 'abends', nacht: 'nachts' };
/** The greeting for the hour, first the one shown big, then alternatives (with a note where it matters). */
function greetings(hour) {
    const part = partOfDay(hour);
    if (part === 'morgen')
        return [{ de: 'Guten Morgen!' }, { de: 'Morgen!', note: 'everyday' }, { de: 'Moin!', note: 'north' }];
    if (part === 'vormittag')
        return [{ de: hour < 11 ? 'Guten Morgen!' : 'Guten Tag!' }, { de: hour < 11 ? 'Guten Tag!' : 'Guten Morgen!' }, { de: 'Schönen Vormittag!' }, { de: 'Moin!', note: 'north' }];
    if (part === 'mittag')
        return [{ de: 'Guten Tag!' }, { de: 'Mahlzeit!', note: 'lunch' }, { de: 'Hallo!', note: 'everyday' }];
    if (part === 'nachmittag')
        return [{ de: 'Guten Nachmittag!' }, { de: 'Guten Tag!' }, { de: 'Schönen Nachmittag!' }, { de: 'Hallo!', note: 'everyday' }];
    if (part === 'abend')
        return [{ de: 'Guten Abend!' }, { de: '’n Abend!', note: 'everyday' }, { de: 'Schönen Abend!' }];
    // At night "Gute Nacht!" is said when going to bed, so the greeting itself stays "Hallo".
    return [{ de: 'Hallo, du Nachteule!' }, { de: 'Na, noch wach?', note: 'everyday' }, { de: 'Hallo!', note: 'everyday' }, { de: 'Guten Abend!', note: 'untilMidnight' }, { de: 'Gute Nacht!', note: 'beforeBed' }];
}
function partPhrases(hour) {
    const part = partOfDay(hour), noun = exports.PART_NOUN[part], adverb = PART_ADVERB[part];
    const extra = { morgen: 'Es ist früh am Morgen.', vormittag: 'Es ist noch Vormittag.', mittag: 'Es ist Mittagszeit.', nachmittag: 'Es ist schon Nachmittag.', abend: 'Es ist schon Abend.', nacht: hour < 5 ? 'Es ist mitten in der Nacht.' : 'Es ist schon spät.' };
    return [{ de: `Es ist ${noun}.` }, { de: extra[part] }, { de: `Heute ${noun} lernen wir Deutsch.` }, { de: `${adverb[0].toUpperCase() + adverb.slice(1)} lerne ich Deutsch.` }];
}
/** The ISO 8601 week (Kalenderwoche) of a local date. */
function isoWeek(date) {
    const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const weekday = day.getUTCDay() || 7;
    day.setUTCDate(day.getUTCDate() + 4 - weekday);
    const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
    return Math.ceil(((day.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
function dayPhrases(date) {
    const weekday = exports.WEEKDAYS[date.getDay()], day = date.getDate(), month = exports.MONTHS[date.getMonth()];
    const out = [
        { de: `Heute ist ${weekday}.` }, { de: `Wir haben heute ${weekday}.` },
        { de: `Heute ist ${weekday}, der ${day}. ${month} ${date.getFullYear()}.` },
        { de: `Heute ist der ${ordinalWord(day)} ${month}.` },
        { de: `Gestern war ${exports.WEEKDAYS[(date.getDay() + 6) % 7]}.` }, { de: `Morgen ist ${exports.WEEKDAYS[(date.getDay() + 1) % 7]}.` },
    ];
    if (date.getDay() === 0 || date.getDay() === 6)
        out.push({ de: 'Es ist Wochenende!' });
    else if (date.getDay() === 5)
        out.push({ de: 'Bald ist Wochenende!' });
    return out;
}
function weekPhrases(date) {
    const week = isoWeek(date);
    return [{ de: `Wir haben die ${week}. Kalenderwoche.` }, { de: `Wir haben KW ${week}.` }, { de: `Wir sind in der ${week}. Woche.` }, { de: `Das ist die ${ordinalWord(week)} Woche des Jahres.` }];
}
const hourWord = (h) => h === 1 ? 'eins' : numberWord(h);
/** The time said officially (Es ist sechzehn Uhr zwanzig.) and in everyday speech (Es ist zwanzig nach vier.). */
function timePhrases(hour, minute) {
    const digits = `${hour}:${String(minute).padStart(2, '0')}`;
    const official = minute === 0 ? `Es ist ${hour === 1 ? 'ein' : numberWord(hour)} Uhr.` : `Es ist ${hour === 1 ? 'ein' : numberWord(hour)} Uhr ${numberWord(minute)}.`;
    const h12 = hour % 12 || 12, next = h12 % 12 + 1, now = hourWord(h12), then = hourWord(next);
    const everyday = [];
    const n = (value) => value === 1 ? 'eine Minute' : numberWord(value);
    if (minute === 0)
        everyday.push(`Es ist ${h12 === 1 ? 'ein' : numberWord(h12)} Uhr.`, `Es ist genau ${now}.`);
    else if (minute === 15)
        everyday.push(`Es ist Viertel nach ${now}.`);
    else if (minute === 30)
        everyday.push(`Es ist halb ${then}.`);
    else if (minute === 45)
        everyday.push(`Es ist Viertel vor ${then}.`);
    else if (minute <= 20)
        everyday.push(`Es ist ${n(minute)} nach ${now}.`);
    else if (minute < 30)
        everyday.push(`Es ist ${n(30 - minute)} vor halb ${then}.`);
    else if (minute < 40)
        everyday.push(`Es ist ${n(minute - 30)} nach halb ${then}.`);
    else
        everyday.push(`Es ist ${n(60 - minute)} vor ${then}.`);
    // A second everyday way where German has one: 20 = zehn vor halb, 40 = zehn nach halb / zwanzig vor.
    if (minute === 20)
        everyday.push(`Es ist zehn vor halb ${then}.`);
    if (minute === 40)
        everyday.push(`Es ist zehn nach halb ${then}.`);
    // More everyday ways: just after twenty also "… nach", just after half also "… vor" the next hour.
    if (minute >= 21 && minute <= 25)
        everyday.push(`Es ist ${n(minute)} nach ${now}.`);
    if (minute >= 35 && minute <= 39)
        everyday.push(`Es ist ${n(60 - minute)} vor ${then}.`);
    if (minute >= 1 && minute <= 4)
        everyday.push(`Es ist kurz nach ${now}.`);
    if (minute >= 56)
        everyday.push(`Es ist kurz vor ${then}.`);
    const withPart = `Es ist ${h12 === 1 ? 'ein' : numberWord(h12)} Uhr${minute ? ' ' + numberWord(minute) : ''} ${PART_ADVERB[partOfDay(hour)]}.`;
    return [{ de: `Es ist ${digits} Uhr.` }, { de: official, note: 'official' }, ...everyday.map(de => ({ de, note: 'everyday' })), { de: withPart }];
}
/** Everything for one moment, in the order the header shows it. */
function germanMoment(date) {
    const hour = date.getHours(), minute = date.getMinutes();
    return { part: partOfDay(hour), greetings: greetings(hour), partPhrases: partPhrases(hour), day: dayPhrases(date), week: weekPhrases(date), time: timePhrases(hour, minute) };
}
