export type WrongSoundId = 'soft' | 'beep' | 'retro' | 'low' | 'cartoon';
export type TapSoundId = 'tap' | 'tap2' | 'tap3';
/** The learner chooses one sound for each moment (like the wrong-answer sound); the first one is the default. */
export type TapChoiceId = 'tap' | 'tapWood' | 'tapPop' | 'tapDrop' | 'tapBell' | 'tapChip';
export type PageSoundId = 'whoosh' | 'pageFlip' | 'pageSlide' | 'pageHarp' | 'pageBubbles' | 'pageChip';
export type CorrectSoundId = 'correct' | 'correctMarimba' | 'correctCoin' | 'correctDing' | 'correctFanfare' | 'correctBubbles';
export type CompleteSoundId = 'complete' | 'completeFanfare' | 'completeLevel' | 'completeChimes' | 'completeHarp' | 'completeMarimba';
export type SoundId = WrongSoundId | TapSoundId | TapChoiceId | PageSoundId | CorrectSoundId | CompleteSoundId;
export type SoundNote = { f:number; end?:number; start:number; duration:number; gain:number; type:'sine'|'triangle' };
export const wrongSoundIds:readonly WrongSoundId[] = ['soft','beep','retro','low','cartoon'];
export const tapSoundIds:readonly TapSoundId[] = ['tap','tap2','tap3'];
export const tapChoiceIds:readonly TapChoiceId[] = ['tap','tapWood','tapPop','tapDrop','tapBell','tapChip'];
export const pageSoundIds:readonly PageSoundId[] = ['whoosh','pageFlip','pageSlide','pageHarp','pageBubbles','pageChip'];
export const correctSoundIds:readonly CorrectSoundId[] = ['correct','correctMarimba','correctCoin','correctDing','correctFanfare','correctBubbles'];
export const completeSoundIds:readonly CompleteSoundId[] = ['complete','completeFanfare','completeLevel','completeChimes','completeHarp','completeMarimba'];
/** The real sounds are rendered by scripts/sounds/make-sounds.mjs into /sfx.
 * These short Web Audio sketches are only a fallback when a file cannot play. */
export const soundRecipes:Record<SoundId,readonly SoundNote[]> = {
 soft:[{f:440,start:0,duration:.35,gain:.1,type:'sine'},{f:349.23,start:.2,duration:.55,gain:.1,type:'sine'}],
 beep:[{f:587.33,start:0,duration:.25,gain:.1,type:'sine'},{f:440,start:.16,duration:.35,gain:.1,type:'sine'}],
 retro:[{f:659.25,start:0,duration:.11,gain:.07,type:'triangle'},{f:523.25,start:.14,duration:.22,gain:.07,type:'triangle'}],
 low:[{f:261.63,start:0,duration:.12,gain:.12,type:'triangle'},{f:220,start:.15,duration:.2,gain:.12,type:'triangle'}],
 cartoon:[{f:523.25,start:0,duration:.2,gain:.08,type:'sine'},{f:440,start:.22,duration:.38,gain:.08,type:'sine'}],
 tap:[{f:560,end:1060,start:0,duration:.075,gain:.085,type:'sine'},{f:1120,end:1120,start:.004,duration:.05,gain:.02,type:'sine'}],
 tap2:[{f:640,end:1210,start:0,duration:.075,gain:.085,type:'sine'},{f:1280,end:1280,start:.004,duration:.05,gain:.02,type:'sine'}],
 tap3:[{f:720,end:1360,start:0,duration:.075,gain:.085,type:'sine'},{f:1440,end:1440,start:.004,duration:.05,gain:.02,type:'sine'}],
 whoosh:[{f:320,end:900,start:0,duration:.36,gain:.03,type:'triangle'},{f:1568,end:1568,start:.24,duration:.28,gain:.03,type:'sine'}],
 correct:[{f:523.25,start:0,duration:.5,gain:.08,type:'sine'},{f:1318.5,start:0,duration:.45,gain:.09,type:'sine'},{f:1568,start:.072,duration:.45,gain:.085,type:'sine'},{f:2093,start:.144,duration:.5,gain:.08,type:'sine'},{f:2637,start:.216,duration:.55,gain:.06,type:'sine'}],
 complete:[{f:523.25,start:0,duration:.18,gain:.10,type:'triangle'},{f:659.25,start:.065,duration:.18,gain:.10,type:'triangle'},{f:783.99,start:.13,duration:.18,gain:.10,type:'triangle'},{f:1046.5,start:.27,duration:.9,gain:.10,type:'sine'},{f:1318.5,start:.27,duration:.85,gain:.06,type:'sine'},{f:1567.98,start:.27,duration:.8,gain:.05,type:'sine'},{f:2093,start:.27,duration:1.1,gain:.035,type:'sine'}],
 // Chosen sounds (rendered by scripts/sounds/make-sounds.mjs; these sketches are only the fallback).
 tapWood:[{f:1046.5,start:0,duration:.07,gain:.09,type:'triangle'},{f:2093,start:.002,duration:.035,gain:.02,type:'sine'}],
 tapPop:[{f:420,end:1100,start:0,duration:.06,gain:.09,type:'sine'}],
 tapDrop:[{f:1300,end:700,start:0,duration:.05,gain:.07,type:'sine'},{f:700,end:1500,start:.05,duration:.07,gain:.07,type:'sine'}],
 tapBell:[{f:2637,start:0,duration:.16,gain:.05,type:'sine'},{f:5274,start:0,duration:.08,gain:.015,type:'sine'}],
 tapChip:[{f:1046.5,end:1568,start:0,duration:.045,gain:.04,type:'triangle'}],
 pageFlip:[{f:2400,end:5200,start:0,duration:.16,gain:.02,type:'triangle'}],
 pageSlide:[{f:500,end:1300,start:0,duration:.32,gain:.05,type:'sine'}],
 pageHarp:[{f:523.25,start:0,duration:.25,gain:.05,type:'sine'},{f:659.25,start:.035,duration:.25,gain:.05,type:'sine'},{f:783.99,start:.07,duration:.25,gain:.05,type:'sine'},{f:1046.5,start:.105,duration:.3,gain:.05,type:'sine'}],
 pageBubbles:[{f:500,end:900,start:0,duration:.07,gain:.06,type:'sine'},{f:650,end:1170,start:.07,duration:.07,gain:.06,type:'sine'},{f:820,end:1480,start:.14,duration:.08,gain:.06,type:'sine'}],
 pageChip:[{f:523.25,start:0,duration:.04,gain:.035,type:'triangle'},{f:659.25,start:.045,duration:.04,gain:.035,type:'triangle'},{f:783.99,start:.09,duration:.06,gain:.035,type:'triangle'}],
 correctMarimba:[{f:523.25,start:0,duration:.25,gain:.09,type:'triangle'},{f:659.25,start:.08,duration:.25,gain:.09,type:'triangle'},{f:783.99,start:.16,duration:.25,gain:.09,type:'triangle'},{f:1046.5,start:.24,duration:.45,gain:.09,type:'triangle'}],
 correctCoin:[{f:987.77,start:0,duration:.07,gain:.05,type:'triangle'},{f:1318.5,start:.075,duration:.35,gain:.05,type:'triangle'}],
 correctDing:[{f:1046.5,start:0,duration:.5,gain:.07,type:'sine'},{f:1568,start:.16,duration:.6,gain:.07,type:'sine'}],
 correctFanfare:[{f:523.25,start:0,duration:.1,gain:.07,type:'triangle'},{f:659.25,start:.1,duration:.1,gain:.07,type:'triangle'},{f:783.99,start:.2,duration:.1,gain:.07,type:'triangle'},{f:1046.5,start:.3,duration:.4,gain:.07,type:'triangle'}],
 correctBubbles:[{f:500,end:900,start:0,duration:.08,gain:.06,type:'sine'},{f:630,end:1130,start:.08,duration:.08,gain:.06,type:'sine'},{f:790,end:1420,start:.16,duration:.08,gain:.06,type:'sine'},{f:1000,end:1800,start:.24,duration:.1,gain:.06,type:'sine'},{f:2093,start:.32,duration:.4,gain:.04,type:'sine'}],
 completeFanfare:[{f:523.25,start:0,duration:.12,gain:.08,type:'triangle'},{f:523.25,start:.14,duration:.12,gain:.08,type:'triangle'},{f:523.25,start:.28,duration:.12,gain:.08,type:'triangle'},{f:783.99,start:.42,duration:.8,gain:.08,type:'triangle'},{f:2093,start:.42,duration:.9,gain:.04,type:'sine'}],
 completeLevel:[{f:523.25,start:0,duration:.05,gain:.035,type:'triangle'},{f:659.25,start:.055,duration:.05,gain:.035,type:'triangle'},{f:783.99,start:.11,duration:.05,gain:.035,type:'triangle'},{f:1046.5,start:.165,duration:.05,gain:.035,type:'triangle'},{f:1318.5,start:.22,duration:.05,gain:.035,type:'triangle'},{f:1568,start:.275,duration:.05,gain:.035,type:'triangle'},{f:2093,start:.33,duration:.6,gain:.035,type:'triangle'}],
 completeChimes:[{f:1568,start:0,duration:.6,gain:.05,type:'sine'},{f:2093,start:.12,duration:.6,gain:.05,type:'sine'},{f:1760,start:.26,duration:.6,gain:.05,type:'sine'},{f:2637,start:.4,duration:.7,gain:.05,type:'sine'},{f:2349.3,start:.55,duration:.8,gain:.04,type:'sine'}],
 completeHarp:[{f:523.25,start:0,duration:.3,gain:.05,type:'sine'},{f:659.25,start:.04,duration:.3,gain:.05,type:'sine'},{f:783.99,start:.08,duration:.3,gain:.05,type:'sine'},{f:1046.5,start:.12,duration:.3,gain:.05,type:'sine'},{f:1318.5,start:.16,duration:.3,gain:.05,type:'sine'},{f:1568,start:.2,duration:.3,gain:.05,type:'sine'},{f:2093,start:.24,duration:.9,gain:.05,type:'sine'}],
 completeMarimba:[{f:261.63,start:0,duration:.15,gain:.1,type:'triangle'},{f:261.63,start:.16,duration:.15,gain:.1,type:'triangle'},{f:392,start:.32,duration:.15,gain:.1,type:'triangle'},{f:523.25,start:.48,duration:.8,gain:.1,type:'triangle'},{f:1046.5,start:.48,duration:.8,gain:.05,type:'sine'}],
};
export const soundDuration = (id:SoundId) => Math.max(...soundRecipes[id].map(note=>note.start+note.duration))+.04;
/** The bubble tap rotates through three pitches so repeated taps feel alive; any other chosen tap sound plays as it is. */
let tapIndex=0;
export function nextTapSound(choice:TapChoiceId='tap'):SoundId{if(choice!=='tap')return choice;const id=tapSoundIds[tapIndex%tapSoundIds.length];tapIndex++;return id;}
