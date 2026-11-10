'use client';
import {Square,Volume2} from 'lucide-react';
import type {AbcChoice,AudioLine,ExamAnswer,HoerenExam,ListenOption,TrueFalse} from '@/lib/a1-exam-types';
import {HOEREN_PLAYS} from '@/lib/a1-exam-types';
import {examText} from '@/lib/a1-exam-copy';
import {languageDirection,isSiteLanguage} from '@/lib/site-languages';
import {HEAD,Hint,Num,TrueFalseBoxes,Why,boxClass,type MarkProps} from './a1-exam-paper';
import type {ExamAudio} from './a1-exam-audio';

/**
 * The Hören paper of A1 sınavı, built like the telc and Goethe practice sets: Teil 1 — short talks, a question with three
 * answers (small pictures where the paper has them), heard twice; Teil 2 — announcements, Richtig / Falsch, heard once;
 * Teil 3 — messages on the phone, three answers, heard twice. A text is played with its button; in the exam-like mode
 * (`limit`) only as often as in the exam. Nothing is marked right or wrong before the end; after handing in (`review`)
 * the spoken text is shown, can be heard again without a limit, and the answer is explained.
 */
export type ListenProps=MarkProps&{audio:ExamAudio;plays:Record<string,number>;limit:boolean;onPlay:(key:string)=>void};

const dirOf=(language:string)=>languageDirection(isSiteLanguage(language)?language:'en');
/** The play button of a text, with how often it may still be heard. */
function PlayButton({playKey,lines,max,free,audio,plays,limit,onPlay,language,review}:{playKey:string;lines:readonly AudioLine[];max:number;free?:boolean}&Pick<ListenProps,'audio'|'plays'|'limit'|'onPlay'|'language'|'review'>){
 const on=audio.playing===playKey;const used=plays[playKey]??0;const counted=limit&&!review&&!free;const left=counted?Math.max(0,max-used):Infinity;
 const label=on?examText(language,'stopAudio'):left<=0?examText(language,'noPlays'):used>0?examText(language,'playAgain'):examText(language,'play');
 return <div className="x1-listen" lang={language} dir={dirOf(language)}>
  <button type="button" className={'x1-play'+(on?' on':'')} disabled={!on&&left<=0} data-x1-play={playKey} aria-pressed={on}
   onClick={()=>{if(on){audio.stop();return;}onPlay(playKey);audio.play(playKey,lines);}}>
   {on?<Square size={16} aria-hidden="true"/>:<Volume2 size={18} aria-hidden="true"/>}<span>{label}</span>{on&&<i className="x1-wave" aria-hidden="true"><b/><b/><b/></i>}
  </button>
  {counted&&<span className="x1-plays" title={examText(language,'playsLeft',{n:left})} aria-label={examText(language,'playsLeft',{n:left})} data-x1-left={left}>{Array.from({length:max},(_,i)=><i key={i} className={i<used?'used':''}/>)}</span>}
 </div>;
}
/** The spoken text, shown after the exam. */
function Script({lines,language}:{lines:readonly AudioLine[];language:string}){
 const many=new Set(lines.map(line=>line.who)).size>1;
 return <div className="x1-script" data-x1-script>
  <p className="x1-script-title" lang={language} dir={dirOf(language)}>{examText(language,'transcript')}</p>
  {lines.map((line,i)=><p key={i}>{many&&<b>{line.who}: </b>}{line.text}</p>)}
 </div>;
}
const LETTERS=['a','b','c'] as const;

/** A question with three answers (Teil 1 with small pictures, Teil 3 as a list). `cards`: the answers are name cards
 * (the spelling practice, app/a1-exam-spell.tsx), which brings its explanation in the page's language (`explained`). */
export function ChoiceItem({n,id,playKey,question,options,answer,lines,why,example=false,cards=false,explained,max,answers,onMark,review=false,language,...listen}:{n:number;id?:string;playKey:string;question:string;options:readonly ListenOption[];answer:AbcChoice;lines:readonly AudioLine[];why?:string;example?:boolean;cards?:boolean;explained?:{text:string;lang:string};max:number}&ListenProps){
 const value=example?answer:id?answers[id]:undefined;const fixed=review||example||!onMark||!id;
 const tiles=options.every(option=>option.text.length<=18)||options.some(option=>option.icon);
 return <div className={'x1-item x1-hear'+(example?' x1-example':'')} data-x1-item={id??'example'}>
  <div className="x1-row"><Num n={n}/>{example&&<span className="x1-beispiel inline">Beispiel</span>}<p className="x1-statement">{question}</p></div>
  <PlayButton playKey={playKey} lines={lines} max={max} free={example} language={language} review={review} {...listen}/>
  <div className={'x1-abc'+(tiles?' tiles':' rows')+(cards?' x1-names':'')} role="radiogroup" aria-label={(n?n+'. ':'Beispiel. ')+question}>
   {LETTERS.map((choice,i)=><button type="button" key={choice} role="radio" aria-checked={value===choice} disabled={fixed} data-choice={choice}
    className={boxClass('x1-pick x1-opt',value===choice,answer===choice,review)} onClick={()=>{if(id&&onMark)onMark(id,choice as ExamAnswer);}}>
    <span className="x1-letter">{choice}</span>{options[i].icon&&<span className="x1-opt-icon" aria-hidden="true">{options[i].icon}</span>}<span className="x1-pick-label">{options[i].text}</span>
   </button>)}
  </div>
  {review&&<Script lines={lines} language={language}/>}
  {review&&id&&why&&<Why id={id} given={answers[id]} answer={answer} why={why} language={language}/>}
  {review&&id&&!why&&explained&&<Why id={id} given={answers[id]} answer={answer} why="" explained={explained} language={language}/>}
 </div>;
}
/** An announcement and a statement to mark Richtig or Falsch (Teil 2). */
function TrueFalseHear({n,id,playKey,text,answer,lines,why,example=false,max,answers,onMark,review=false,language,...listen}:{n:number;id?:string;playKey:string;text:string;answer:TrueFalse;lines:readonly AudioLine[];why?:string;example?:boolean;max:number}&ListenProps){
 const value=example?answer:id?answers[id]:undefined;
 return <div className={'x1-item x1-hear'+(example?' x1-example':'')} data-x1-item={id??'example'}>
  <div className="x1-row">{example?<><Num n={0}/><span className="x1-beispiel inline">Beispiel</span></>:<Num n={n}/>}<PlayButton playKey={playKey} lines={lines} max={max} free={example} language={language} review={review} {...listen}/></div>
  <div className="x1-row x1-row-claim"><p className="x1-statement">{text}</p>
   <TrueFalseBoxes id={id} value={value} answer={answer} onMark={onMark} review={review} example={example} label={(n?n+'. ':'Beispiel. ')+text}/></div>
  {review&&<Script lines={lines} language={language}/>}
  {review&&id&&why&&<Why id={id} given={answers[id]} answer={answer} why={why} language={language}/>}
 </div>;
}

/** One Teil of a Hören exam on the paper. `examId` names the examples' play counts (`<exam>-b1`, `-b2`). */
export function HoerenTeil({hoeren,teil,examId,...props}:{hoeren:HoerenExam;teil:1|2|3;examId:string}&ListenProps){
 const max=HOEREN_PLAYS[teil];
 if(teil===2)return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="2">
  {HEAD(1,'Hören, Teil 2')}
  <p className="x1-task">Markieren Sie: <b>Richtig</b> (+) oder <b>Falsch</b> (–)?<br/>Sie hören jeden Text <b>einmal</b>.</p>
  <Hint language={props.language} text={examText(props.language,'hhint2')}/>
  <TrueFalseHear n={0} playKey={examId+'-b2'} text={hoeren.teil2.example.text} answer={hoeren.teil2.example.answer} lines={hoeren.teil2.example.lines} example max={max} {...props}/>
  {hoeren.teil2.items.map(item=><TrueFalseHear key={item.id} n={item.n} id={item.id} playKey={item.id} text={item.text} answer={item.answer} lines={item.lines} why={item.why} max={max} {...props}/>)}
 </section>;
 const items=teil===1?hoeren.teil1.items:hoeren.teil3.items;
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil={teil}>
  {HEAD(1,'Hören, Teil '+teil)}
  <p className="x1-task">Was ist richtig? Markieren Sie: <span className="x1-letter inline">a</span>, <span className="x1-letter inline">b</span> oder <span className="x1-letter inline">c</span>.<br/>Sie hören jeden Text <b>zweimal</b>.</p>
  <Hint language={props.language} text={examText(props.language,'hhint13')}/>
  {teil===1&&<ChoiceItem n={0} playKey={examId+'-b1'} question={hoeren.teil1.example.question} options={hoeren.teil1.example.options} answer={hoeren.teil1.example.answer} lines={hoeren.teil1.example.lines} example max={max} {...props}/>}
  {items.map(item=><ChoiceItem key={item.id} n={item.n} id={item.id} playKey={item.id} question={item.question} options={item.options} answer={item.answer} lines={item.lines} why={item.why} max={max} {...props}/>)}
 </section>;
}
