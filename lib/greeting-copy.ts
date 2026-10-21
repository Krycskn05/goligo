import type {VaultLanguage,VaultTranslations} from './object-vault-copy';
import {pickText} from './site-languages';

/** Texts of the header clock (app/site-greeting.tsx), ordered like the site languages (tr de en ar uk fr es ru fa pl it
 * pt); the other site languages read the English line from their language pack. A tap says another German sentence
 * about now (the learner asked: no window any more). */
const copy={
 tapToHear:['Dokun: saati ve günü Almanca dinle','Tippen: Uhrzeit und Tag auf Deutsch hören','Tap to hear the time and the day in German','المس لتسمع الوقت واليوم بالألمانية','Торкнися, щоб почути час і день німецькою','Touche pour entendre l’heure et le jour en allemand','Toca para oír la hora y el día en alemán','Нажми, чтобы услышать время и день по-немецки','لمس کن تا ساعت و روز را به آلمانی بشنوی','Dotknij, aby usłyszeć godzinę i dzień po niemiecku','Tocca per sentire l’ora e il giorno in tedesco','Toque para ouvir a hora e o dia em alemão'],
} as const satisfies Record<string,VaultTranslations>;
export type GreetingCopyKey=keyof typeof copy;
export const greetingCopy=copy;
export function greetingText(language:VaultLanguage,key:GreetingCopyKey){return pickText(copy[key],language);}
