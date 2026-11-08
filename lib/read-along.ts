/**
 * Read-along by word (the learner chose "Vurgu" among six styles, 8 November 2026): while a dialogue is read with
 * "Tümünü dinle", the word being spoken is marked in its line (app/willkommen-ui.tsx `showWord`). The voice players say
 * which word they are at (lib/german-speech.ts `onWord`): the device voice from the browser's word boundary events, a
 * natural site clip (lib/site-voices.ts) from how far it has played, with the time of every word estimated here from
 * its letters — a calm, even pace, a pause after a comma and a longer one after a sentence. Words are counted the same
 * way on both sides (`wordSpans`), so whitespace never shifts them.
 */
export type WordSpan={start:number;end:number;text:string};
/** The words of a text as runs of non-space characters, with their character offsets. */
export function wordSpans(text:string):WordSpan[]{
 const spans:WordSpan[]=[];const re=/\S+/g;let found:RegExpExecArray|null;
 while((found=re.exec(text)))spans.push({start:found.index,end:found.index+found[0].length,text:found[0]});
 return spans;
}
/** The index of the word that contains (or last began before) a character offset; -1 before the first word. */
export function wordAtChar(spans:readonly WordSpan[],charIndex:number):number{
 let k=-1;for(let i=0;i<spans.length;i++){if(spans[i].start<=charIndex)k=i;else break;}
 return k;
}
/** How long a word takes, in letter units: an onset, its letters and digits, a pause after a comma, a longer one after a sentence. */
export function wordUnits(word:string):number{
 const letters=word.replace(/[^\p{L}\p{N}]/gu,'').length;
 return 1+letters+(/[,;:]["“”»)]*$/.test(word)?2.5:0)+(/[.!?…]["“”»)]*$/.test(word)?4.5:0);
}
/** A clip's words on a 0–1 scale of its playing time: where each word begins. A short tail keeps the last word from
 * running into the clip's closing silence. */
export type WordTimeline={spans:WordSpan[];starts:number[];units:number};
const TAIL_UNITS=2;
export function wordTimeline(text:string):WordTimeline{
 const spans=wordSpans(text);const weights=spans.map(span=>wordUnits(span.text));
 const units=weights.reduce((sum,weight)=>sum+weight,0)+TAIL_UNITS;
 const starts:number[]=[];let sum=0;
 for(const weight of weights){starts.push(sum/units);sum+=weight;}
 return {spans,starts,units};
}
/** The word being read when a clip is this far (0–1) into its playing time; -1 before the first word, the last word through the tail. */
export function wordAtRatio(timeline:WordTimeline,ratio:number):number{
 if(!(ratio>=0))return -1;
 let k=-1;for(let i=0;i<timeline.starts.length;i++){if(timeline.starts[i]<=ratio)k=i;else break;}
 return k;
}
/** Roughly how long a device voice takes for a text at a rate (about 68 ms a unit at rate 1), so a voice that sends no
 * word events can still be followed by the clock. */
export function estimatedDurationMs(timeline:WordTimeline,rate:number):number{return timeline.units*68/Math.max(0.5,rate);}
/** Where each part of a split text begins in the whole: the parts were cut from the text and go back together with a space. */
export function partOffsets(parts:readonly string[]):number[]{
 const offsets:number[]=[];let at=0;
 for(const part of parts){offsets.push(at);at+=part.length+1;}
 return offsets;
}
/** Measured word starts of a clip (scripts/voices/word_times.py: the voice's words heard by whisper and aligned to the
 * text, stored as <voice>/times.json and read by lib/site-voices.ts `clipWordTimes`) as a timeline — the exact
 * read-along for a natural clip; null when they do not fit the text's words, so the estimate above stays. The first word
 * begins with the clip and no word starts before the one before it. */
export function measuredTimeline(text:string,starts:readonly number[]|null|undefined):WordTimeline|null{
 const spans=wordSpans(text);
 if(!starts||starts.length!==spans.length||!spans.length)return null;
 const clean:number[]=[];let last=0;
 for(const value of starts){if(typeof value!=='number'||!Number.isFinite(value))return null;last=Math.min(1,Math.max(last,value));clean.push(last);}
 clean[0]=0;
 return {spans,starts:clean,units:wordTimeline(text).units};
}
