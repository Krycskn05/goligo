import {numberWord} from './german-time';

/**
 * The ways to say a clock time in German (the learner's plan "Goliqo – Almanca Saat Söyleme Sistemi", 22 October 2026):
 * the header clock says them one after another, one per tap, and starts again with the first. Only the ways that are
 * right for this minute are made — never the 14 patterns for every time:
 *  Uhr (drei Uhr) · formal (drei Uhr zehn, 24 hours: fünfzehn Uhr zehn) · nach / vor (zehn nach drei, zehn vor vier)
 *  · Viertel nach / Viertel vor · halb (halb vier) · vor halb / nach halb (zehn vor halb vier, zehn nach halb vier)
 *  · kurz nach / kurz vor (about: 1–4 minutes past, 1–4 minutes to; marked as approximate, never as the exact time)
 *  · regional viertel vier / dreiviertel vier (the learner asked: every way, no switch).
 * Order as in the plan's example for 14:20: vierzehn Uhr zwanzig · zwanzig nach zwei · zehn vor halb drei · zwei Uhr
 * zwanzig. Formal times use 24 hours ("ein Uhr", not "eins Uhr"), everyday ones 12 hours ("halb eins").
 */
export type SayingKind='formal'|'everyday'|'regional'|'approx';
/** What a saying is built from; the explanation under it follows this (lib/clock-copy.ts). */
export type SayingPattern='formal'|'short'|'genau'|'nach'|'vor'|'viertel'|'halb'|'vorHalb'|'nachHalb'|'kurz'|'regional';
export type ClockSaying={
 /** The German sentence: "Es ist zehn vor halb vier." */
 de:string;
 kind:SayingKind;
 pattern:SayingPattern;
 /** The hour the half hour belongs to, in German ("vier" in halb vier), and the minutes before/after it. */
 next:string;
 minutes:number;
 /** The hour this saying uses: 0–23 for the formal 24-hour way, 1–12 otherwise. */
 hour:number;
};

const formalHour=(hour:number)=>hour===1?'ein':numberWord(hour);
/** Everyday hour words: "eins" on its own (fünf nach eins, halb eins). */
const everydayHour=(hour:number)=>numberWord(hour);
/** Minutes in an everyday sentence: "eine Minute" for one, else the number word. */
const minuteWords=(value:number)=>value===1?'eine Minute':numberWord(value);

export function clockSayings(hour:number,minute:number):ClockSaying[]{
 const h=((hour%24)+24)%24,m=((minute%60)+60)%60;
 const h12=h%12||12,next12=h12%12+1;
 const now=everydayHour(h12),then=everydayHour(next12);
 const out:ClockSaying[]=[];
 const add=(text:string,kind:SayingKind,pattern:SayingPattern,sayingHour:number,minutes=m)=>{
  const de='Es ist '+text+'.';
  if(!out.some(item=>item.de===de))out.push({de,kind,pattern,next:then,minutes,hour:sayingHour});
 };
 const formal=(value:number)=>formalHour(value)+' Uhr'+(m?' '+numberWord(m):'');
 // 1. Formal, 24 hours (the same as the 12-hour way before noon).
 add(formal(h),'formal','formal',h);
 // 2. Everyday: first the way counted from the full hour, then the one counted from the half hour.
 if(m===0){add(now,'everyday','short',h12);add('genau '+formalHour(h12)+' Uhr','everyday','genau',h12);}
 else if(m===15)add('Viertel nach '+now,'everyday','viertel',h12);
 else if(m===30)add('halb '+then,'everyday','halb',h12);
 else if(m===45)add('Viertel vor '+then,'everyday','viertel',h12);
 else if(m<30){
  // Up to 25 past it is counted from the full hour; from 20 past also from the half hour (26–29: only from the half).
  if(m<=25)add(minuteWords(m)+' nach '+now,'everyday','nach',h12);
  if(m>=20)add(minuteWords(30-m)+' vor halb '+then,'everyday','vorHalb',h12,30-m);
 }else{
  // From 35 it is counted to the next full hour; up to 40 also from the half hour (31–34: only from the half).
  if(m>=35)add(minuteWords(60-m)+' vor '+then,'everyday','vor',h12,60-m);
  if(m<=40)add(minuteWords(m-30)+' nach halb '+then,'everyday','nachHalb',h12,m-30);
 }
 // 3. Formal, 12 hours (only when it differs from the 24-hour way).
 add(formal(h12),'formal','formal',h12);
 // 4. Regional quarters (southern and eastern Germany, Austria).
 if(m===15)add('viertel '+then,'regional','regional',h12);
 if(m===45)add('dreiviertel '+then,'regional','regional',h12);
 // 5. About the time: just past or just before the full hour.
 if(m>=1&&m<=4)add('kurz nach '+now,'approx','kurz',h12);
 if(m>=56)add('kurz vor '+then,'approx','kurz',h12);
 return out;
}

const TR_ONES=['sıfır','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];
const TR_TENS=['','on','yirmi','otuz','kırk','elli'];
/** 0–59 in Turkish words: yirmi beş, on bir … */
export function turkishNumber(n:number){
 if(n<10)return TR_ONES[n];
 const tens=Math.floor(n/10),ones=n%10;
 return TR_TENS[tens]+(ones?' '+TR_ONES[ones]:'');
}
// "geçiyor" takes the accusative of the hour, "var" the dative (Saat üçü yirmi geçiyor. Saat dörde on var.).
const TR_ACC:Record<number,string>={1:'biri',2:'ikiyi',3:'üçü',4:'dördü',5:'beşi',6:'altıyı',7:'yediyi',8:'sekizi',9:'dokuzu',10:'onu',11:'on biri',12:'on ikiyi'};
const TR_DAT:Record<number,string>={1:'bire',2:'ikiye',3:'üçe',4:'dörde',5:'beşe',6:'altıya',7:'yediye',8:'sekize',9:'dokuza',10:'ona',11:'on bire',12:'on ikiye'};

/** The Turkish way to say the same time, for the line under the German sentence. */
export function turkishTime(saying:ClockSaying,hour:number,minute:number){
 const h12=hour%12||12,next=h12%12+1,m=minute;
 if(saying.kind==='formal')return 'Saat '+turkishNumber(saying.hour)+(m?' '+turkishNumber(m):'')+'.';
 if(saying.pattern==='kurz')return m<30?'Saat '+TR_ACC[h12]+' birkaç dakika geçiyor.':'Saat '+TR_DAT[next]+' birkaç dakika var.';
 if(m===0)return saying.pattern==='genau'?'Saat tam '+turkishNumber(h12)+'.':'Saat '+turkishNumber(h12)+'.';
 if(m===30)return 'Saat '+turkishNumber(h12)+' buçuk.';
 if(m<30)return 'Saat '+TR_ACC[h12]+' '+(m===15?'çeyrek':turkishNumber(m))+' geçiyor.';
 return 'Saat '+TR_DAT[next]+' '+(m===45?'çeyrek':turkishNumber(60-m))+' var.';
}

/** "3:20" for the explanations (12 hours, as the everyday ways count). */
export const clockDigits=(hour:number,minute:number)=>`${hour}:${String(minute).padStart(2,'0')}`;
