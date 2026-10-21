import type {VaultLanguage,VaultTranslations} from './object-vault-copy';
import {pickText} from './site-languages';

/** Texts of the header clock (app/site-greeting.tsx), ordered like the site languages (tr de en ar uk fr es ru fa pl it
 * pt); the other site languages read the English line from their language pack. Each tap says the time another way
 * (lib/clock-sayings.ts, texts of the info under the clock in lib/clock-copy.ts). */
const copy={
 tapToHear:['Dokun: saati Almanca dinle','Tippen: die Uhrzeit auf Deutsch hören','Tap to hear the time in German','المس لتسمع الوقت بالألمانية','Торкнися, щоб почути час німецькою','Touche pour entendre l’heure en allemand','Toca para oír la hora en alemán','Нажми, чтобы услышать время по-немецки','بزن تا ساعت را به آلمانی بشنوی','Dotknij, aby usłyszeć godzinę po niemiecku','Tocca per sentire l’ora in tedesco','Toque para ouvir as horas em alemão'],
} as const satisfies Record<string,VaultTranslations>;
export type GreetingCopyKey=keyof typeof copy;
export const greetingCopy=copy;
export function greetingText(language:VaultLanguage,key:GreetingCopyKey){return pickText(copy[key],language);}
