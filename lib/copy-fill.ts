/**
 * Small helpers shared by the copy files and the forms in the browser (kept apart from the big text tables, so a form
 * does not carry every text of the site).
 */
/** Fills {name} with params[name] (unknown names stay as they are). */
export function fillText(text:string,params:Record<string,string|number>={}){return text.replace(/\{(\w+)\}/g,(hole,name:string)=>Object.prototype.hasOwnProperty.call(params,name)?String(params[name]):hole);}
/** The codes app/api/auth sends with its messages; lib/public-copy.ts has a text for each. */
export const AUTH_CODES=['errService','errTooMany','errSignedOut','errBadRequest','errTooBig','errName','errEmail','errAccept','errTaken','errMissingLogin','errWrongLogin','errSamePassword','errConfirm','errCurrent','errResetLink','pwShort','pwLong','pwSpaces','pwEmail','pwRepeat'] as const;
export type AuthCode=typeof AUTH_CODES[number];
export const isAuthCode=(value:unknown):value is AuthCode=>typeof value==='string'&&(AUTH_CODES as readonly string[]).includes(value);
/** What a form shows for an answer of app/api/auth: the text of its code (with {n} filled in), otherwise `fallback`. */
export function authMessage(texts:Record<AuthCode,string>,result:{code?:unknown;n?:unknown},fallback:string){
 return isAuthCode(result.code)?fillText(texts[result.code],{n:typeof result.n==='number'?result.n:''}):fallback;
}
