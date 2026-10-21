import {pickText,type SiteLanguage} from './site-languages';

type Six=readonly [tr:string,de:string,en:string,ar:string,uk:string,fr:string];
/** The footer's texts (app/site-footer.tsx), on every page; the same as in lib/public-copy.ts, kept small for the
 * study pages. Tuples hold tr de en ar uk fr, the other languages read the English text from their language pack. */
const copy={
 rights:['Tüm hakları saklıdır.','Alle Rechte vorbehalten.','All rights reserved.','جميع الحقوق محفوظة.','Усі права захищено.','Tous droits réservés.'],
 privacyLink:['Gizlilik','Datenschutz','Privacy','الخصوصية','Конфіденційність','Confidentialité'],
 termsLink:['Kullanım koşulları','Nutzungsbedingungen','Terms of use','شروط الاستخدام','Умови користування','Conditions d’utilisation'],
 legalNav:['Yasal bilgiler','Rechtliches','Legal information','معلومات قانونية','Правова інформація','Informations légales'],
} as const satisfies Record<string,Six>;
export type FooterCopyKey=keyof typeof copy;
export const footerCopy=copy;
export function footerText(language:SiteLanguage,key:FooterCopyKey){return pickText(copy[key],language);}
