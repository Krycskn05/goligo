import type {VaultTranslations} from './object-vault-copy';

/** "My account" and "Site language", ordered like the site languages; later languages read them from their language
 * pack. Here (not in app/site-header.tsx) so the pages the server writes can use them too. */
export const accountLabel:VaultTranslations=['Hesabım','Mein Konto','My account','حسابي','Мій акаунт','Mon compte','Mi cuenta','Мой аккаунт','حساب من','Moje konto','Il mio account','Minha conta'];
export const siteLanguageLabel:VaultTranslations=['Site dili','Seitensprache','Site language','لغة الموقع','Мова сайту','Langue du site','Idioma del sitio','Язык сайта','زبان سایت','Język strony','Lingua del sito','Idioma do site'];
