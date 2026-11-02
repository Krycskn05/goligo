"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthCode = exports.AUTH_CODES = void 0;
exports.pluralPick = pluralPick;
exports.fillText = fillText;
exports.authMessage = authMessage;
/**
 * Small helpers shared by the copy files and the forms in the browser (kept apart from the big text tables, so a form
 * does not carry every text of the site).
 */
/** A text may hold a singular and a plural as "one||other" ("{n} mistake||{n} mistakes", 2 November 2026: the English
 * pages said "1 mistakes"): n = 1 takes the first form, every other n the second. A text without "||" stays as it is. */
function pluralPick(text, params = {}) {
    if (!text.includes('||'))
        return text;
    const [one, other] = text.split('||');
    return Number(params.n) === 1 ? one : other ?? one;
}
/** Fills {name} with params[name] (unknown names stay as they are); "one||other" texts take the form for n. */
function fillText(text, params = {}) { return pluralPick(text, params).replace(/\{(\w+)\}/g, (hole, name) => Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : hole); }
/** The codes app/api/auth sends with its messages; lib/public-copy.ts has a text for each. */
exports.AUTH_CODES = ['errService', 'errTooMany', 'errSignedOut', 'errBadRequest', 'errTooBig', 'errName', 'errEmail', 'errAccept', 'errTaken', 'errMissingLogin', 'errWrongLogin', 'errSamePassword', 'errConfirm', 'errCurrent', 'errResetLink', 'pwShort', 'pwLong', 'pwSpaces', 'pwEmail', 'pwRepeat'];
const isAuthCode = (value) => typeof value === 'string' && exports.AUTH_CODES.includes(value);
exports.isAuthCode = isAuthCode;
/** What a form shows for an answer of app/api/auth: the text of its code (with {n} filled in), otherwise `fallback`. */
function authMessage(texts, result, fallback) {
    return (0, exports.isAuthCode)(result.code) ? fillText(texts[result.code], { n: typeof result.n === 'number' ? result.n : '' }) : fallback;
}
