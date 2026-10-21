import type {VaultLanguage,VaultTranslations} from './object-vault-copy';
import {pickText} from './site-languages';

/** Texts of the header greeting's panel (app/site-greeting.tsx), ordered like the site languages (tr de en ar uk fr es ru
 * fa pl it pt); the other site languages read the English line from their language pack. */
const copy={
 panelTitle:['Almanca saat ve tarih','Uhrzeit und Datum','Time and date in German','الوقت والتاريخ بالألمانية','Час і дата німецькою','L\'heure et la date en allemand','La hora y la fecha en alemán','Время и дата по-немецки','ساعت و تاریخ به آلمانی','Godzina i data po niemiecku','Ora e data in tedesco','Hora e data em alemão'],
 open:['Saat ve tarih cümlelerinin hepsini göster','Alle Sätze zu Uhrzeit und Datum zeigen','Show all sentences about time and date','اعرض كل الجمل عن الوقت والتاريخ','Показати всі речення про час і дату','Afficher toutes les phrases sur l\'heure et la date','Mostrar todas las frases sobre la hora y la fecha','Показать все предложения о времени и дате','نمایش همهٔ جمله‌ها دربارهٔ ساعت و تاریخ','Pokaż wszystkie zdania o godzinie i dacie','Mostra tutte le frasi su ora e data','Mostrar todas as frases sobre hora e data'],
 close:['Kapat','Schließen','Close','إغلاق','Закрити','Fermer','Cerrar','Закрыть','بستن','Zamknij','Chiudi','Fechar'],
 greeting:['Selamlaşma','Begrüßung','Greeting','التحية','Привітання','Salutation','Saludo','Приветствие','سلام و احوالپرسی','Powitanie','Saluto','Cumprimento'],
 partOfDay:['Günün vakti','Tageszeit','Time of day','فترة اليوم','Час доби','Moment de la journée','Momento del día','Время суток','وقت روز','Pora dnia','Momento della giornata','Período do dia'],
 day:['Gün ve tarih','Tag und Datum','Day and date','اليوم والتاريخ','День і дата','Jour et date','Día y fecha','День и дата','روز و تاریخ','Dzień i data','Giorno e data','Dia e data'],
 week:['Hafta','Woche','Week','الأسبوع','Тиждень','Semaine','Semana','Неделя','هفته','Tydzień','Settimana','Semana'],
 time:['Saat','Uhrzeit','Time','الساعة','Час','L\'heure','La hora','Время','ساعت','Godzina','Ora','Hora'],
 official:['resmî (radyo, tren, televizyon)','offiziell (Radio, Bahn, Fernsehen)','official (radio, train, TV)','رسمي (الراديو، القطار، التلفاز)','офіційно (радіо, потяг, телебачення)','officiel (radio, train, télé)','oficial (radio, tren, televisión)','официально (радио, поезд, телевидение)','رسمی (رادیو، قطار، تلویزیون)','oficjalnie (radio, pociąg, telewizja)','ufficiale (radio, treno, TV)','oficial (rádio, trem, TV)'],
 everyday:['günlük konuşma','im Alltag','everyday speech','في الكلام اليومي','у повсякденній мові','langage de tous les jours','en el habla cotidiana','в повседневной речи','در گفت‌وگوی روزمره','w mowie codziennej','nella lingua di tutti i giorni','na fala do dia a dia'],
 lunch:['öğle vakti, iş yerinde','mittags, bei der Arbeit','at lunchtime, at work','وقت الغداء، في العمل','в обід, на роботі','à midi, au travail','al mediodía, en el trabajo','в обед, на работе','ظهر، سر کار','w południe, w pracy','a pranzo, al lavoro','na hora do almoço, no trabalho'],
 north:['Kuzey Almanya\'da, gün boyu','in Norddeutschland, den ganzen Tag','in northern Germany, all day','في شمال ألمانيا، طوال اليوم','на півночі Німеччини, увесь день','dans le nord de l\'Allemagne, toute la journée','en el norte de Alemania, todo el día','на севере Германии, весь день','در شمال آلمان، در تمام روز','w północnych Niemczech, przez cały dzień','nel nord della Germania, tutto il giorno','no norte da Alemanha, o dia todo'],
 untilMidnight:['gece yarısına kadar','bis Mitternacht','until midnight','حتى منتصف الليل','до опівночі','jusqu\'à minuit','hasta la medianoche','до полуночи','تا نیمه‌شب','do północy','fino a mezzanotte','até a meia-noite'],
 beforeBed:['yatmadan önce vedalaşırken','zum Abschied vor dem Schlafengehen','when saying goodbye before bed','عند الوداع قبل النوم','на прощання перед сном','pour dire au revoir avant d\'aller dormir','al despedirse antes de dormir','на прощание перед сном','هنگام خداحافظی قبل از خواب','na pożegnanie przed snem','per salutarsi prima di andare a dormire','ao se despedir antes de dormir'],
 kw:['KW = Kalenderwoche, takvim haftası','KW = Kalenderwoche','KW = Kalenderwoche (calendar week)','KW = Kalenderwoche (أسبوع التقويم)','KW = Kalenderwoche (календарний тиждень)','KW = Kalenderwoche (semaine calendaire)','KW = Kalenderwoche (semana del calendario)','KW = Kalenderwoche (календарная неделя)','KW = Kalenderwoche (هفتهٔ تقویمی)','KW = Kalenderwoche (tydzień kalendarzowy)','KW = Kalenderwoche (settimana del calendario)','KW = Kalenderwoche (semana do calendário)'],
} as const satisfies Record<string,VaultTranslations>;
export type GreetingCopyKey=keyof typeof copy;
export const greetingCopy=copy;
export function greetingText(language:VaultLanguage,key:GreetingCopyKey){return pickText(copy[key],language);}
