import {publicTexts} from './public-copy';
import {AUTH_CODES} from './copy-fill';
import type {SiteLanguage} from './site-languages';

/**
 * The texts of the sign in / sign up form and of Hesabım. The server picks them in the page's language and hands them
 * to the form, so the browser needs no language pack; the membership service's messages arrive as codes
 * (app/api/auth) and the form shows them with these texts (authMessage in lib/copy-fill.ts).
 */
export const AUTH_FORM_KEYS=['nameLabel','emailLabel','passwordLabel','hidePassword','showPassword','passwordHelp','acceptText','genericError','offline','register','signIn',...AUTH_CODES] as const;
export const ACCOUNT_KEYS=['myAccount','memberSince','backToLessons','signOut','nameLabel','displayName','save','nameSaved','changePassword','currentPassword','newPassword','minChars','passwordChanged','tourCard','tourText','tourStart','dataCard','dataText','dataDownload','deleteCard','deleteSummary','deleteWarning','yourPassword','deleteConfirm','deleteButton','deleted','genericError','offline',...AUTH_CODES] as const;
export type AuthFormTexts=Record<typeof AUTH_FORM_KEYS[number],string>;
export type AccountTexts=Record<typeof ACCOUNT_KEYS[number],string>;
export const authFormTexts=(language:SiteLanguage):AuthFormTexts=>publicTexts(language,AUTH_FORM_KEYS);
export const accountTexts=(language:SiteLanguage):AccountTexts=>publicTexts(language,ACCOUNT_KEYS);
