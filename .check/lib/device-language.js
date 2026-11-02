"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGUAGE_COOKIE = exports.LANGUAGE_STORAGE_KEY = exports.DEFAULT_SITE_LANGUAGE = void 0;
exports.chooseSiteLanguage = chooseSiteLanguage;
exports.tagLanguage = tagLanguage;
exports.deviceLanguage = deviceLanguage;
exports.acceptedLanguages = acceptedLanguages;
exports.cookieLanguage = cookieLanguage;
exports.requestLanguage = requestLanguage;
exports.browserLanguage = browserLanguage;
exports.languageCookie = languageCookie;
exports.rememberSiteLanguage = rememberSiteLanguage;
const site_languages_1 = require("./site-languages");
/**
 * Which language a visitor sees. A language the visitor chose on the site (the site-language picker, no account needed)
 * always wins. Otherwise the language of the phone or computer, when it is one of the site languages (the learner asked,
 * 22 October 2026: on the first visit the site opens in the device's language; this replaced "always German first").
 * Otherwise German, the site's main language.
 */
exports.DEFAULT_SITE_LANGUAGE = 'de';
/** The saved choice in the browser (shared by every page) and, for the pages the server writes, a cookie copy of it. */
exports.LANGUAGE_STORAGE_KEY = 'german-study-language';
exports.LANGUAGE_COOKIE = 'goligo-dil';
const YEAR = 365 * 24 * 60 * 60;
/** The saved choice if it is a site language, otherwise the device's language, otherwise German. */
function chooseSiteLanguage(saved, device = null) {
    return saved && (0, site_languages_1.isSiteLanguage)(saved) ? saved : device ?? exports.DEFAULT_SITE_LANGUAGE;
}
/** Device language codes that differ from the site's ids: Serbian, Croatian, Bosnian and Montenegrin are the site's
 * Bosanski / Hrvatski / Srpski; Kurmanji is the site's Kurdish (Sorani has another script, so it is not matched). */
const TAG_ALIASES = { sr: 'hbs', hr: 'hbs', bs: 'hbs', sh: 'hbs', cnr: 'hbs', kmr: 'ku' };
/** One language tag of a phone or browser (tr-TR, de, pt_BR, fa-AF) as a site language, or null. Persian of
 * Afghanistan (fa-AF) is Dari. */
function tagLanguage(tag) {
    const parts = String(tag ?? '').trim().toLowerCase().replace(/_/g, '-').split('-');
    const base = parts[0];
    if (!base || !/^[a-z]{2,3}$/.test(base))
        return null;
    if (base === 'fa' && parts.slice(1).includes('af'))
        return 'prs';
    const id = Object.prototype.hasOwnProperty.call(TAG_ALIASES, base) ? TAG_ALIASES[base] : base;
    return (0, site_languages_1.isSiteLanguage)(id) ? id : null;
}
/** The first of the device's languages (in its order of preference) that the site has, or null. */
function deviceLanguage(tags) {
    for (const tag of tags ?? []) {
        const language = tagLanguage(tag);
        if (language)
            return language;
    }
    return null;
}
/** The languages of an Accept-Language header, most wanted first (q=0 means "not this one"). */
function acceptedLanguages(header) {
    return String(header ?? '').split(',').slice(0, 20).map((part, index) => {
        const [tag, ...params] = part.trim().split(';');
        const q = params.map(item => item.trim()).find(item => item.startsWith('q='));
        const weight = q ? Number(q.slice(2)) : 1;
        return { tag: tag.trim(), weight: Number.isFinite(weight) ? weight : 0, index };
    }).filter(item => item.tag && item.weight > 0).sort((a, b) => b.weight - a.weight || a.index - b.index).map(item => item.tag);
}
/** The language cookie's value from a Cookie header. */
function cookieLanguage(cookieHeader) {
    for (const part of (cookieHeader ?? '').split(';')) {
        const at = part.indexOf('=');
        if (at < 0)
            continue;
        if (part.slice(0, at).trim() === exports.LANGUAGE_COOKIE)
            return part.slice(at + 1).trim() || null;
    }
    return null;
}
/** On the server: the visitor's choice (cookie), otherwise the browser's languages (Accept-Language), otherwise German. */
function requestLanguage(cookieHeader, acceptLanguage) {
    return chooseSiteLanguage(cookieLanguage(cookieHeader), deviceLanguage(acceptedLanguages(acceptLanguage)));
}
/** In the browser: the saved choice (this browser, then the cookie), otherwise the device's languages, otherwise German. */
function browserLanguage() {
    let saved = null;
    try {
        saved = localStorage.getItem(exports.LANGUAGE_STORAGE_KEY);
    }
    catch { }
    if (!saved || !(0, site_languages_1.isSiteLanguage)(saved))
        saved = cookieLanguage(typeof document === 'undefined' ? '' : document.cookie);
    let device = null;
    try {
        if (typeof navigator !== 'undefined')
            device = deviceLanguage(navigator.languages?.length ? navigator.languages : [navigator.language]);
    }
    catch { }
    return chooseSiteLanguage(saved, device);
}
/** The Set-Cookie value that keeps the language for the pages the server writes (sign in, sign up, legal pages). */
function languageCookie(language) { return `${exports.LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=${YEAR}; SameSite=Lax`; }
/** Keeps the shown language: in this browser and in the cookie. */
function rememberSiteLanguage(language) {
    try {
        localStorage.setItem(exports.LANGUAGE_STORAGE_KEY, language);
    }
    catch { }
    try {
        if (typeof document !== 'undefined' && cookieLanguage(document.cookie) !== language)
            document.cookie = languageCookie(language) + (location.protocol === 'https:' ? '; Secure' : '');
    }
    catch { }
}
