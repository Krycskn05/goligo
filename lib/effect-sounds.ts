export type WrongSoundId = 'soft' | 'beep' | 'retro' | 'low' | 'cartoon';
export type SoundId = WrongSoundId | 'tap' | 'correct' | 'complete';
export type SoundNote = { f:number; end?:number; start:number; duration:number; gain:number; type:'sine'|'triangle' };
export const wrongSoundIds:readonly WrongSoundId[] = ['soft','beep','retro','low','cartoon'];
export const soundRecipes:Record<SoundId,readonly SoundNote[]> = {
 soft:[{f:440,end:400,start:0,duration:.17,gain:.13,type:'sine'},{f:330,end:310,start:.18,duration:.22,gain:.12,type:'sine'}],
 beep:[{f:500,end:440,start:0,duration:.16,gain:.13,type:'sine'}],
 retro:[{f:523.25,start:0,duration:.12,gain:.085,type:'triangle'},{f:392,start:.13,duration:.12,gain:.085,type:'triangle'},{f:261.63,start:.26,duration:.24,gain:.095,type:'triangle'}],
 low:[{f:220,end:105,start:0,duration:.31,gain:.20,type:'sine'},{f:440,end:210,start:0,duration:.18,gain:.035,type:'sine'}],
 cartoon:[{f:690,end:150,start:0,duration:.43,gain:.09,type:'triangle'},{f:150,end:210,start:.43,duration:.11,gain:.10,type:'sine'}],
 tap:[{f:520,end:1020,start:0,duration:.065,gain:.085,type:'sine'},{f:1040,end:2040,start:0,duration:.04,gain:.012,type:'sine'}],
 correct:[{f:659.25,start:0,duration:.19,gain:.11,type:'sine'},{f:880,start:.10,duration:.23,gain:.10,type:'sine'},{f:1318.5,start:.22,duration:.34,gain:.09,type:'sine'},{f:2637,start:.22,duration:.22,gain:.014,type:'sine'}],
 complete:[{f:523.25,start:0,duration:.18,gain:.10,type:'triangle'},{f:659.25,start:.12,duration:.18,gain:.10,type:'triangle'},{f:783.99,start:.24,duration:.18,gain:.10,type:'triangle'},{f:1046.5,start:.39,duration:.44,gain:.10,type:'sine'},{f:1318.5,start:.39,duration:.42,gain:.06,type:'sine'},{f:1567.98,start:.39,duration:.40,gain:.035,type:'sine'}],
};
export const soundDuration = (id:SoundId) => Math.max(...soundRecipes[id].map(note=>note.start+note.duration))+.04;
