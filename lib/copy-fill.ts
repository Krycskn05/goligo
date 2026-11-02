/**
 * Small helpers shared by the copy files and the forms in the browser (kept apart from the big text tables, so a form
 * does not carry every text of the site).
 */
/** A text may hold a singular and a plural as "one||other" ("{n} mistake||{n} mistakes", 2 November 2026: the English
 * pages said "1 mistakes"): n = 1 takes the first form, every other n the second. A text without "||" stays as it is. */
export function pluralPick(text:string,params:Record<string,unknown>={}){
 if(!text.includes('||'))return text;
 const [one,other]=text.split('||');return Number(params.n)===1?one:other??one;
}
/** Fills {name} with params[name] (unknown names stay as they are); "one||other" texts take the form for n. */
export function fillText(text:string,params:Record<string,string|number>={}){return pluralPick(text,params).replace(/\{(\w+)\}/g,(hole,name:string)=>Object.prototype.hasOwnProperty.call(params,name)?String(params[name]):hole);}
/** The codes app/api/auth sends with its messages; lib/public-copy.ts has a text for each. */
export const AUTH_CODES=['errService','errTooMany','errSignedOut','errBadRequest','errTooBig','errName','errEmail','errAccept','errTaken','errMissingLogin','errWrongLogin','errSamePassword','errConfirm','errCurrent','errResetLink','pwShort','pwLong','pwSpaces','pwEmail','pwRepeat'] as const;
export type AuthCode=typeof AUTH_CODES[number];
export const isAuthCode=(value:unknown):value is AuthCode=>typeof value==='string'&&(AUTH_CODES as readonly string[]).includes(value);
/** What a form shows for an answer of app/api/auth: the text of its code (with {n} filled in), otherwise `fallback`. */
export function authMessage(texts:Record<AuthCode,string>,result:{code?:unknown;n?:unknown},fallback:string){
 return isAuthCode(result.code)?fillText(texts[result.code],{n:typeof result.n==='number'?result.n:''}):fallback;
}
