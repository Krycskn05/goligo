'use client';
import {useCallback,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {ArrowRight,Check,RotateCcw,Trash2,Volume2} from 'lucide-react';
import type {StudyLanguage} from '@/lib/study-languages';
import type {TopicProgress} from '@/lib/progress';
import {acceptsAnswer,acceptsExact,portraitSrc,sayText,speakerVoice,withSpeakers,type GapLine,type SayItem,type Step} from '@/lib/willkommen-course';
import type {L1AScoreMap,L1PartId} from '@/lib/willkommen-progress';
import {useAnswerSound,useGermanSpeech} from './study-shared';
import {PaulHoca} from './paul-hoca';

/*
 * Pieces shared by Lektion 1's lesson pages (Teil A in app/willkommen-study.tsx, Teil B in app/willkommen-b-steps.tsx):
 * speech with a voice per person, the say button, headings and notes, and the exercise types both parts use.
 */

/** Site speech plus "read these one after the other" (dialogues, spelling, the learner's own sentences). A text with a
 * speaker (`who`, see `speakers` in lib/willkommen-course.ts) is read with that person's own voice — a man by a man, a
 * woman by a woman; everything else with the learner's chosen voice. `slow` reads slowly (letters when spelling). */
export type Speech={speak:(item:SayItem)=>void;speakAll:(items:SayItem[])=>void;busy:boolean;activeText?:string;stop:()=>void;prepare:()=>void};
export function useLessonSpeech():Speech&{warning?:string}{
 const german=useGermanSpeech('de');const {speak,busy,activeText,stop,prepare,warning,siteVoices}=german;
 const voices=useRef(siteVoices);voices.current=siteVoices;
 const say=useCallback((item:SayItem)=>{const who=typeof item==='string'?undefined:item.who;const slow=typeof item!=='string'&&!!item.slow;speak(sayText(item),slow,speakerVoice(who,voices.current));},[speak]);
 const queue=useRef<SayItem[]>([]);const waiting=useRef<ReturnType<typeof setTimeout>|null>(null);
 const busyRef=useRef(busy);
 const next=useCallback(()=>{
  const item=queue.current.shift();if(!item)return;
  say(item);
  // If the voice never starts (no sound support), go on after a moment so the queue never sticks.
  waiting.current=setTimeout(()=>{waiting.current=null;if(!busyRef.current)next();},1500);
 },[say]);
 useEffect(()=>{const was=busyRef.current;busyRef.current=busy;if(busy&&waiting.current){clearTimeout(waiting.current);waiting.current=null;}if(was&&!busy)next();},[busy,next]);
 const speakAll=useCallback((items:SayItem[])=>{stop();queue.current=items.filter(item=>sayText(item).trim());next();},[stop,next]);
 const speakOne=useCallback((item:SayItem)=>{queue.current=[];say(item);},[say]);
 const stopAll=useCallback(()=>{queue.current=[];if(waiting.current){clearTimeout(waiting.current);waiting.current=null;}stop();},[stop]);
 useEffect(()=>()=>{if(waiting.current)clearTimeout(waiting.current);},[]);
 return useMemo(()=>({speak:speakOne,speakAll,busy,activeText,stop:stopAll,prepare,warning}),[speakOne,speakAll,busy,activeText,stopAll,prepare,warning]);
}

export type Sound=ReturnType<typeof useAnswerSound>;
/** What every step gets: `onGo` opens a step of the same part (a negative number: the contents page), `onPart` a step of another part. */
export type StepProps={step:Step;speech:Speech;sound:Sound;scores:L1AScoreMap;progress:TopicProgress;onScore:(id:string,right:number,total:number)=>void;onGo:(index:number)=>void;onPart:(part:L1PartId,index:number)=>void;language:StudyLanguage;setInnerNext?:(next:(()=>boolean)|null)=>void};
/** The page's "İleri" goes on inside an exercise that shows one item at a time (Lektion 15A, the learner asked, 30 October
 * 2026): `next` returns true when it opened the exercise's next item (or ended it), false when the exercise is over and the
 * page may open the next step. Pages that pass no `setInnerNext` (Lektion 1) keep İleri as the next step. */
export function useInnerNext(setInnerNext:StepProps['setInnerNext'],next:()=>boolean){
 const latest=useRef(next);latest.current=next;
 useEffect(()=>{if(!setInnerNext)return;setInnerNext(()=>latest.current());return()=>setInnerNext(null);},[setInnerNext]);
}

/* ---------- small pieces ---------- */
/** A listen button. `secret`: a listening exercise, so the button's name does not give the answer away. */
export function Say({text,who,slow,speech,label='Dinle',wide=false,secret=false}:{text:string;who?:string;slow?:boolean;speech:Speech;label?:string;wide?:boolean;secret?:boolean}){
 const playing=speech.busy&&speech.activeText===text;
 return <button type="button" className={(wide?'btn secondary small l1a-say-wide':'l12-say')+(playing?' playing':'')} disabled={speech.busy&&!playing} aria-label={secret?(label==='Dinle'?label:'Dinle '+label):label+': '+text} title={label} data-who={who} onClick={()=>speech.speak({text,who,slow})}><Volume2 size={18} aria-hidden="true"/>{wide&&label}</button>;
}
export function Phrases({items,speech}:{items:readonly (readonly [string,string])[];speech:Speech}){
 return <>{items.map(([de,tr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span><span className="l1a-tr">{tr}</span></div><Say text={de} speech={speech}/></div>)}</>;
}
export const Note=({children}:{children:ReactNode})=><div className="l1a-note"><PaulHoca pose="tip" className="l1a-paul"/><p>{children}</p></div>;
/** `**bold**` inside a text. */
export function Rich({text}:{text:string}){const parts=text.split(/(\*\*[^*]+\*\*)/g);return <>{parts.map((part,i)=>part.startsWith('**')&&part.endsWith('**')&&part.length>4?<b key={i}>{part.slice(2,-2)}</b>:part)}</>;}
/** A step's heading (h2: the notebook's left page holds the h1 title of the part). */
export function Heading({children}:{children:ReactNode}){return <h2 id="l1a-heading" tabIndex={-1} className="l1a-heading">{children}</h2>;}
export function Portrait({who,name}:{who:string;name:string}){return <img className="l1a-portrait" src={portraitSrc(who)} alt={name} width={64} height={64} loading="lazy" decoding="async"/>;}
export function shuffle<T>(list:readonly T[]):T[]{const out=list.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}

/* ---------- exercises ---------- */
export type Feedback={ok:boolean;text:string}|null;
export function FeedbackLine({feedback}:{feedback:Feedback}){return <p className={'l1a-feedback'+(feedback?feedback.ok?' ok':' bad':'')} role="status" aria-live="polite">{feedback?.text??''}</p>;}
/** Finishes an exercise: saves the score, plays the sound and reads the solution after a full score. */
export function useFinish(props:StepProps){
 const {sound,speech,onScore,step}=props;
 return useCallback((right:number,total:number,say?:SayItem[])=>{
  onScore(step.id,right,total);
  if(right===total){sound.correct(()=>{if(say?.length)speech.speakAll(say);});}else sound.wrong();
 },[sound,speech,onScore,step.id]);
}
/** Gaps in a text: letters inside a word, whole sentences (wide) or a word chosen from a box. `speakers` read the
 * solution as a little dialogue (lines alternate a, b), each line by its own person. */
export function GapExercise(props:StepProps&{kicker:string;title:string;lead?:string;before?:ReactNode;lines:GapLine[];wide?:boolean;choices?:string[];say:SayItem[];speakers?:{a:string;b:string};exact?:boolean}){
 const {kicker,title,lead,before,lines,wide=false,choices,sound,speech,speakers,exact=false}=props;
 const accepts=exact?acceptsExact:acceptsAnswer;
 const say=useMemo(()=>speakers?withSpeakers(props.say.map(item=>typeof item==='string'?item:item.text),speakers):props.say,[props.say,speakers]);
 const gaps=useMemo(()=>lines.flatMap((line,l)=>line.answers.map((answers,g)=>({line:l,gap:g,answers}))),[lines]);
 const [values,setValues]=useState<string[]>(()=>gaps.map(()=>''));const [checked,setChecked]=useState<(boolean|null)[]>(()=>gaps.map(()=>null));
 const [feedback,setFeedback]=useState<Feedback>(null);const finish=useFinish(props);
 const at=(l:number,g:number)=>gaps.findIndex(item=>item.line===l&&item.gap===g);
 const check=()=>{
  sound.prepare();speech.prepare();
  const result=gaps.map((gap,i)=>accepts(values[i],gap.answers));setChecked(result);
  const right=result.filter(Boolean).length;
  setFeedback(right===gaps.length?{ok:true,text:'Hepsi doğru!'}:{ok:false,text:`${right} / ${gaps.length} doğru. Kırmızıları düzelt; doğrusu yanında yazıyor.`});
  finish(right,gaps.length,say);
 };
 const reveal=()=>{setValues(gaps.map(gap=>gap.answers[0]));setChecked(gaps.map(()=>true));setFeedback({ok:true,text:'Cevaplar gösterildi.'});};
 const field=(l:number,g:number)=>{const i=at(l,g);const state=checked[i];const cls='l1a-gap'+(wide?' wide':'')+(state===true?' ok':state===false?' bad':'');
  const input=choices?<select className={cls} value={values[i]} aria-label={`Boşluk ${i+1}`} onChange={event=>{const next=values.slice();next[i]=event.target.value;setValues(next);const ok=accepts(event.target.value,gaps[i].answers);const nextChecked=checked.slice();nextChecked[i]=event.target.value?ok:null;setChecked(nextChecked);}}><option value="">…</option>{choices.map(word=><option key={word} value={word}>{word}</option>)}</select>
   :<input className={cls} value={values[i]} lang="de" dir="ltr" autoCapitalize={exact?'sentences':'off'} autoComplete="off" spellCheck={false} placeholder={wide?'Buraya yaz…':''} aria-label={`Boşluk ${i+1}`} onChange={event=>{const next=values.slice();next[i]=event.target.value;setValues(next);if(checked[i]!==null){const nextChecked=checked.slice();nextChecked[i]=null;setChecked(nextChecked);}}}/>;
  return <span className="l1a-gap-wrap" key={g}>{input}{state===false&&<span className="l1a-hint" lang="de">→ {gaps[i].answers[0]}</span>}</span>;};
 const line=(item:GapLine,l:number)=>{const parts=item.text.split('___');return <span className="l1a-de l1a-gap-text" lang="de" dir="ltr">{parts.map((part,g)=><span key={g}>{part}{g<parts.length-1&&field(l,g)}</span>)}</span>;};
 return <>
  <p className="kicker" lang="de">{kicker}</p><Heading>{title}</Heading>{lead&&<p className="l1a-tr">{lead}</p>}{before}
  <div className="l1a-dialogue">{lines.map((item,l)=>item.who?<div className={'l1a-line '+item.who} key={l}><div className="l1a-bubble">{line(item,l)}</div></div>:<div className={'l1a-row'+(item.say?' l1a-row-say':'')} key={l}>{item.say&&<Say text={sayText(item.say)} who={typeof item.say==='string'?undefined:item.say.who} speech={speech} label={String(l+1)} wide secret/>}{line(item,l)}</div>)}</div>
  <div className="l1a-actions"><button type="button" className="btn small" onClick={check}><Check size={16} aria-hidden="true"/>Kontrol et</button><button type="button" className="btn secondary small" onClick={reveal}>Cevapları göster</button></div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Matching: tap left, then right; a right pair is read (`sayFor`). */
export function MatchExercise(props:StepProps&{kicker:string;title:string;lead?:string;pairs:readonly (readonly [string,string])[];sayFor:(index:number)=>SayItem[]}){
 const {speech,sound,pairs,sayFor,kicker,title,lead='Önce soldan, sonra sağdan dokun.'}=props;const finish=useFinish(props);
 const [order]=useState(()=>shuffle(pairs.map((_,i)=>i)));
 const [selected,setSelected]=useState<number|null>(null);const [done,setDone]=useState<number[]>([]);const [wrongAt,setWrongAt]=useState<number|null>(null);const [misses,setMisses]=useState(0);
 const [feedback,setFeedback]=useState<Feedback>(null);
 const pickRight=(i:number)=>{
  if(selected===null||done.includes(i))return;sound.prepare();speech.prepare();
  if(i===selected){const next=[...done,i];setDone(next);setSelected(null);speech.speakAll(sayFor(i));
   if(next.length===pairs.length){const right=Math.max(0,pairs.length-misses);setFeedback({ok:true,text:'Hepsi eşleşti!'});finish(right,pairs.length);}}
  else{setWrongAt(i);setMisses(m=>m+1);setFeedback({ok:false,text:'Bu ikisi uymuyor.'});sound.wrong();setTimeout(()=>setWrongAt(null),600);}
 };
 return <>
  <p className="kicker" lang="de">{kicker}</p><Heading>{title}</Heading><p className="l1a-tr">{lead}</p>
  <div className="l1a-match">
   <div>{pairs.map((pair,i)=><button type="button" key={i} className={'l1a-mbtn'+(selected===i?' sel':'')+(done.includes(i)?' done':'')} disabled={done.includes(i)} aria-pressed={selected===i} lang="de" dir="ltr" onClick={()=>setSelected(i)}>{pair[0]}</button>)}</div>
   <div>{order.map(i=><button type="button" key={i} className={'l1a-mbtn'+(done.includes(i)?' done':'')+(wrongAt===i?' bad':'')} disabled={done.includes(i)} lang="de" dir="ltr" onClick={()=>pickRight(i)}>{pairs[i][1]}</button>)}</div>
  </div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Word order: tap the chips in order; a right sentence is read (`sayFor`); `verbs` names the verb in position 2 in the feedback. */
export function OrderExercise(props:StepProps&{kicker:string;title:string;sentences:string[][];sayFor:(sentence:string)=>SayItem;verbs?:string[]}){
 const {speech,sound,sentences:orderSentences,sayFor:orderSay,kicker,title,verbs}=props;const finish=useFinish(props);
 const [round,setRound]=useState(0);const [chips,setChips]=useState<{word:string;i:number}[]>(()=>shuffle(orderSentences[0].map((word,i)=>({word,i}))));
 const [picked,setPicked]=useState<number[]>([]);const [state,setState]=useState<'open'|'ok'|'bad'>('open');const [right,setRight]=useState(0);const [feedback,setFeedback]=useState<Feedback>(null);
 const sentence=orderSentences[round];const text=picked.map(i=>sentence[i]).join(' ');
 const check=()=>{sound.prepare();speech.prepare();const ok=text===sentence.join(' ');setState(ok?'ok':'bad');
  if(ok){const total=right+1;setRight(total);setFeedback({ok:true,text:round===orderSentences.length-1?'Tüm cümleler doğru!':verbs?.[round]?`Doğru! Fiil „${verbs[round]}“ 2. pozisyonda.`:'Doğru!'});
   if(round===orderSentences.length-1)finish(total,orderSentences.length,[orderSay(sentence.join(' '))]);else sound.correct(()=>speech.speak(orderSay(sentence.join(' '))));}
  else{setFeedback({ok:false,text:verbs?'Fiil 2. sırada mı? Sırayı kontrol et.':'Sırayı kontrol et.'});sound.wrong();}};
 const next=()=>{const r=round+1;setRound(r);setChips(shuffle(orderSentences[r].map((word,i)=>({word,i}))));setPicked([]);setState('open');setFeedback(null);};
 // İleri at the bottom (Lektion 15A): the next sentence (an unsolved one is skipped); after the last one the next step.
 const ended=useRef(false);if(state==='ok'&&round===orderSentences.length-1)ended.current=true;
 useInnerNext(props.setInnerNext,()=>{
  if(ended.current)return false;
  if(round<orderSentences.length-1){next();return true;}
  ended.current=true;setFeedback({ok:false,text:`${right} / ${orderSentences.length} cümle doğru`});finish(right,orderSentences.length);return true;
 });
 return <>
  <p className="kicker" lang="de">{kicker}</p><Heading>{title}</Heading><p className="l1a-tr">Cümle {round+1} / {orderSentences.length}</p>
  <div className={'l1a-answer'+(state==='ok'?' ok':state==='bad'?' bad':'')} lang="de" dir="ltr" aria-live="polite">{text}</div>
  <div className="l1a-chips">{chips.map(chip=><button type="button" key={chip.i} className="l1a-chip" lang="de" dir="ltr" disabled={picked.includes(chip.i)||state==='ok'} onClick={()=>{setPicked([...picked,chip.i]);setState('open');}}>{chip.word}</button>)}</div>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={!picked.length||state==='ok'} onClick={()=>{setPicked(picked.slice(0,-1));setState('open');}}><Trash2 size={16} aria-hidden="true"/>Sil</button>
   <button type="button" className="btn small" disabled={picked.length!==sentence.length||state==='ok'} onClick={check}><Check size={16} aria-hidden="true"/>Kontrol et</button>
   {state==='ok'&&round<orderSentences.length-1&&<button type="button" className="btn small" onClick={next}>Sonraki<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
  </div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** One choice per row (Sie or du, which letter, right or not …): the row is read after the answer (`say`), and
 * `reveal` appears once the row is answered. */
export type ChoiceRow={key:string;before?:ReactNode;after?:ReactNode;options:{value:string;label:string}[];answer:string;say?:SayItem;reveal?:ReactNode;label:string;optionLang?:string};
export function ChoiceRows(props:StepProps&{kicker:string;title:string;lead?:string;before?:ReactNode;rows:ChoiceRow[];wide?:boolean}){
 const {speech,sound,rows,kicker,title,lead,before,wide=false}=props;const finish=useFinish(props);
 const [answers,setAnswers]=useState<Record<number,string>>({});const [feedback,setFeedback]=useState<Feedback>(null);
 const answer=(i:number,value:string)=>{if(answers[i]!==undefined)return;sound.prepare();speech.prepare();
  const next={...answers,[i]:value};setAnswers(next);const row=rows[i];const ok=value===row.answer;
  const done=Object.keys(next).length;const right=rows.filter((item,j)=>next[j]===item.answer).length;
  const say=()=>{if(row.say)speech.speak(row.say);};
  if(done===rows.length){setFeedback({ok:right===rows.length,text:`${right} / ${rows.length} doğru`});finish(right,rows.length,row.say?[row.say]:undefined);}
  else if(ok)sound.correct(say);else sound.wrong(say);};
 return <>
  <p className="kicker" lang="de">{kicker}</p><Heading>{title}</Heading>{lead&&<p className="l1a-tr">{lead}</p>}{before}
  {rows.map((row,i)=><div className={'l1a-arow'+(wide?' wide':'')} key={row.key} data-done={answers[i]!==undefined?'':undefined}>
   {row.before}
   <div className="l1a-opts" role="group" aria-label={row.label}>{row.options.map(option=><button type="button" key={option.value} className={'l1a-opt'+(answers[i]!==undefined&&option.value===row.answer?' ok':answers[i]===option.value?' bad':'')} disabled={answers[i]!==undefined} lang={row.optionLang??'de'} onClick={()=>answer(i,option.value)}>{option.label}</button>)}</div>
   {row.after}
   {answers[i]!==undefined&&row.reveal}
  </div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** The test: one question at a time, the right answer is read after the sound (`sayFor`, nothing for a Turkish answer).
 * `listen`: a listening question gets a listen button (Lektion 15A); `langOf`: the language of a question or option
 * when the lesson knows it better than the guess below. */
export function TestStep(props:StepProps&{label:string;questions:readonly (readonly [string,string[],string,...unknown[]])[];sayFor:(index:number)=>SayItem;listen?:(index:number)=>SayItem|undefined;langOf?:(text:string)=>'de'|'tr'}){
 const {speech,sound,onScore,step,questions,sayFor,label,listen,langOf}=props;
 const [i,setI]=useState(0);const [score,setScore]=useState(0);const [picked,setPicked]=useState<string|null>(null);const [options,setOptions]=useState(()=>shuffle(questions[0][1]));const [over,setOver]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const question=questions[i];
 const answer=(option:string)=>{if(picked!==null)return;sound.prepare();speech.prepare();setPicked(option);const ok=option===question[2];const total=score+(ok?1:0);setScore(total);
  const say=sayFor(i);const after=()=>{if(say)speech.speak(say);};if(ok)sound.correct(after);else sound.wrong(after);
  timer.current=setTimeout(()=>{if(i+1<questions.length){setI(i+1);setPicked(null);setOptions(shuffle(questions[i+1][1]));}else{setOver(true);onScore(step.id,total,questions.length);if(total===questions.length)sound.complete();}},1600);};
 const again=()=>{setI(0);setScore(0);setPicked(null);setOptions(shuffle(questions[0][1]));setOver(false);};
 if(over){const percent=Math.round(score/questions.length*100);return <>
  <p className="kicker" lang="de">{label}</p><Heading>Sonuç</Heading>
  <p className="l1a-score">{score} / {questions.length}</p>
  <p className="l1a-big">{percent>=80?'Harika! Bu konuyu öğrendin.':percent>=60?'İyi. Yanlışlarına bir daha bak.':'Konuyu bir kez daha oku, sonra tekrar dene.'}</p>
  {percent>=80&&<PaulHoca pose="cheer" className="l1a-paul-big"/>}
  <div className="l1a-actions"><button type="button" className="btn" onClick={again}><RotateCcw size={18} aria-hidden="true"/>Testi tekrarla</button></div></>;}
 return <>
  <p className="kicker" lang="de">{label}</p><Heading>Soru {i+1} / {questions.length}</Heading>
  <p className="l1a-question" lang={langOf?langOf(question[0]):/[çğışİ]|hangisi|nedir|nasıl|ne demek|cevap/.test(question[0])?'tr':'de'}>{question[0]}</p>
  {(()=>{const heard=listen?.(i);return heard?<div className="l1a-actions l1a-test-listen"><Say text={typeof heard==='string'?heard:heard.text} who={typeof heard==='string'?undefined:heard.who} speech={speech} secret wide/></div>:null;})()}
  <div className="l1a-opts column" role="group" aria-label={'Soru '+(i+1)}>{options.map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==null&&option===question[2]?' ok':picked===option?' bad':'')} disabled={picked!==null} lang={langOf?langOf(option):/^[A-Za-zÄÖÜäöüß–]/.test(option)&&!/^(Hoş|İyi|Teşekkürler|Efendim|Nasıl|biraz|çok|hiç|yot|ce|ji)\b/.test(option)?'de':'tr'} onClick={()=>answer(option)}>{option}</button>)}</div>
  <p className="l1a-mini">Puan: {score}</p>
 </>;
}
