export type WrongSoundId = 'soft' | 'beep' | 'retro' | 'low' | 'cartoon';
export type TapSoundId = 'tap' | 'tap2' | 'tap3';
export type SoundId = WrongSoundId | TapSoundId | 'whoosh' | 'correct' | 'complete';
export type SoundNote = { f:number; end?:number; start:number; duration:number; gain:number; type:'sine'|'triangle' };
export const wrongSoundIds:readonly WrongSoundId[] = ['soft','beep','retro','low','cartoon'];
export const tapSoundIds:readonly TapSoundId[] = ['tap','tap2','tap3'];
/** The real sounds are rendered by scripts/sounds/make-sounds.mjs into /sfx.
 * These short Web Audio sketches are only a fallback when a file cannot play. */
export const soundRecipes:Record<SoundId,readonly SoundNote[]> = {
 soft:[{f:392,end:388,start:0,duration:.3,gain:.13,type:'sine'},{f:329.6,end:326,start:.17,duration:.5,gain:.13,type:'sine'}],
 beep:[{f:920,end:1330,start:0,duration:.09,gain:.1,type:'sine'},{f:720,end:1040,start:.1,duration:.09,gain:.1,type:'sine'},{f:540,end:780,start:.2,duration:.09,gain:.1,type:'sine'},{f:400,end:580,start:.31,duration:.1,gain:.1,type:'sine'}],
 retro:[{f:783.99,start:0,duration:.085,gain:.07,type:'triangle'},{f:659.25,start:.1,duration:.085,gain:.07,type:'triangle'},{f:523.25,start:.2,duration:.085,gain:.07,type:'triangle'},{f:392,end:370,start:.3,duration:.24,gain:.08,type:'triangle'}],
 low:[{f:311,end:306,start:0,duration:.29,gain:.12,type:'triangle'},{f:293.7,end:283,start:.31,duration:.55,gain:.12,type:'triangle'}],
 cartoon:[{f:1450,end:390,start:0,duration:.38,gain:.09,type:'sine'},{f:175,end:240,start:.39,duration:.36,gain:.12,type:'sine'}],
 tap:[{f:560,end:1060,start:0,duration:.075,gain:.085,type:'sine'},{f:1120,end:1120,start:.004,duration:.05,gain:.02,type:'sine'}],
 tap2:[{f:640,end:1210,start:0,duration:.075,gain:.085,type:'sine'},{f:1280,end:1280,start:.004,duration:.05,gain:.02,type:'sine'}],
 tap3:[{f:720,end:1360,start:0,duration:.075,gain:.085,type:'sine'},{f:1440,end:1440,start:.004,duration:.05,gain:.02,type:'sine'}],
 whoosh:[{f:320,end:900,start:0,duration:.36,gain:.03,type:'triangle'},{f:1568,end:1568,start:.24,duration:.28,gain:.03,type:'sine'}],
 correct:[{f:523.25,start:0,duration:.5,gain:.08,type:'sine'},{f:1318.5,start:0,duration:.45,gain:.09,type:'sine'},{f:1568,start:.072,duration:.45,gain:.085,type:'sine'},{f:2093,start:.144,duration:.5,gain:.08,type:'sine'},{f:2637,start:.216,duration:.55,gain:.06,type:'sine'}],
 complete:[{f:523.25,start:0,duration:.18,gain:.10,type:'triangle'},{f:659.25,start:.065,duration:.18,gain:.10,type:'triangle'},{f:783.99,start:.13,duration:.18,gain:.10,type:'triangle'},{f:1046.5,start:.27,duration:.9,gain:.10,type:'sine'},{f:1318.5,start:.27,duration:.85,gain:.06,type:'sine'},{f:1567.98,start:.27,duration:.8,gain:.05,type:'sine'},{f:2093,start:.27,duration:1.1,gain:.035,type:'sine'}],
};
export const soundDuration = (id:SoundId) => Math.max(...soundRecipes[id].map(note=>note.start+note.duration))+.04;
/** Sounds rotate through the three tap pitches so repeated taps feel alive. */
let tapIndex=0;
export function nextTapSound():TapSoundId{const id=tapSoundIds[tapIndex%tapSoundIds.length];tapIndex++;return id;}
