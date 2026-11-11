'use client';
import type {ReactNode} from 'react';
import type {ExamAnswer,GapItem,SchreibenExam} from '@/lib/a1-exam-types';
import type {ExamAnswers} from '@/lib/a1-exam-course';
import {examText,type ExamCopyKey} from '@/lib/a1-exam-copy';
import {HEAD,Hint,Num,Why,boxClass,type MarkProps} from './a1-exam-paper';

/**
 * The Schreiben paper of A1 sınavı (the learner asked, 11 November 2026), built like the exam: Teil 1 — a short text
 * about someone and a form with five missing entries; Teil 2 — the task with its three points and the message. In
 * the exam both are written by hand; here every gap is a tap (three ways to fill it, one right), like the rest of the
 * section. What the learner chose is shown in the form and in the message in a handwriting, so the page reads like
 * a filled-in paper; nothing is marked right or wrong before the end. After handing in (`review`) a wrong entry is
 * crossed out, the right one stands beside it, and every gap is explained in the site language
 * (lib/a1-exam-copy.ts `sw_<kind>`).
 */
const LETTERS=['a','b','c'] as const;
const at=(choice:ExamAnswer|undefined):number=>choice==='a'?0:choice==='b'?1:choice==='c'?2:-1;
/** The right way to fill a gap. */
const rightOf=(item:GapItem)=>item.options[item.answer==='a'?0:item.answer==='b'?1:2];
/** The explanation of a gap in the page's language: a label filled with the German words it is about. */
function explain(language:string,item:GapItem){
 return {text:examText(language,('sw_'+item.why.kind) as ExamCopyKey,{quote:item.why.quote,right:rightOf(item),n:item.why.point??0}),lang:language};
}
/** A text of the paper with its gaps `{n}`: an empty line, the chosen entry in handwriting, or (after handing in) the right one. */
function Filled({text,items,answers,review}:{text:string;items:readonly GapItem[];answers:ExamAnswers;review:boolean}){
 return <>{text.split(/(\{\d+\})/g).map((part,i)=>{
  const mark=/^\{(\d+)\}$/.exec(part);const item=mark?items.find(entry=>entry.n===Number(mark[1])):undefined;
  if(!item)return part;
  const given=answers[item.id];const mine=at(given);const options:readonly string[]=item.options;const right=rightOf(item);const good=given===item.answer;
  return <span key={i} className={'x1-gap'+(mine>=0?' filled':'')+(review?good?' is-right':' is-wrong':'')} data-x1-gap={item.n}>
   <sup className="x1-gap-n">{item.n}</sup>
   {review?<>{mine>=0&&!good&&<s className="x1-gap-word">{options[mine]}</s>}<span className="x1-gap-word x1-gap-right">{right}</span></>
    :mine>=0?<span className="x1-gap-word">{options[mine]}</span>:<span className="x1-gap-line" aria-hidden="true"/>}
  </span>;})}</>;
}
/** The line a gap stands in, for its question: the gap itself as a blank, the other gaps as dots. */
const contextOf=(text:string,n:number)=>text.replace(/\{(\d+)\}/g,(_,number:string)=>Number(number)===n?'_____':'…');

/** One gap: where it stands and the three ways to fill it. */
function GapChoice({item,context,answers,onMark,review=false,language}:{item:GapItem;context:ReactNode}&MarkProps){
 const value=answers[item.id];const fixed=review||!onMark;
 const tiles=item.options.every(option=>option.length<=20);
 return <div className="x1-item x1-gapitem" data-x1-item={item.id}>
  <div className="x1-row"><Num n={item.n}/><p className="x1-statement x1-gap-context">{context}</p></div>
  <div className={'x1-abc'+(tiles?' tiles':' rows')} role="radiogroup" aria-label={item.n+'.'}>
   {LETTERS.map((choice,i)=><button type="button" key={choice} role="radio" aria-checked={value===choice} disabled={fixed} data-choice={choice}
    className={boxClass('x1-pick x1-opt',value===choice,item.answer===choice,review)} onClick={()=>{if(onMark)onMark(item.id,choice);}}>
    <span className="x1-letter">{choice}</span><span className="x1-pick-label">{item.options[i]}</span>
   </button>)}
  </div>
  {review&&<Why id={item.id} given={value} answer={item.answer} why="" explained={explain(language,item)} language={language}/>}
 </div>;
}

/** Teil 1: the text, the form with its five gaps, and a question for each gap. */
function TeilOne({schreiben,...marks}:{schreiben:SchreibenExam}&MarkProps){
 const {text,form,rows,items}=schreiben.teil1;const review=!!marks.review;
 const rowOf=(n:number)=>rows.find(row=>row.value.includes('{'+n+'}'));
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="1">
  {HEAD(3,'Schreiben, Teil 1')}
  <p className="x1-s-text">{text}</p>
  <p className="x1-task">Im Formular fehlen fünf Informationen. Was ist richtig?<br/>Markieren Sie: <span className="x1-letter inline">a</span>, <span className="x1-letter inline">b</span> oder <span className="x1-letter inline">c</span>.</p>
  <Hint language={marks.language} text={examText(marks.language,'hintS1')}/>
  <div className="x1-form" data-x1-form>
   <strong className="x1-form-title">{form}</strong>
   <dl>{rows.map(row=><div key={row.label}><dt>{row.label}</dt><dd><Filled text={row.value} items={items} answers={marks.answers} review={review}/></dd></div>)}</dl>
  </div>
  {items.map(item=>{const row=rowOf(item.n);return <GapChoice key={item.id} item={item} context={row?<><b>{row.label}:</b> {contextOf(row.value,item.n)}</>:null} {...marks}/>;})}
 </section>;
}
/** Teil 2: the task with its three points, the message with its ten gaps, and a question for each gap. */
function TeilTwo({schreiben,...marks}:{schreiben:SchreibenExam}&MarkProps){
 const {task,points,lines,items}=schreiben.teil2;const review=!!marks.review;
 const lineOf=(n:number)=>lines.find(line=>line.includes('{'+n+'}'))??'';
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="2">
  {HEAD(3,'Schreiben, Teil 2')}
  <div className="x1-s-task" data-x1-task>
   <p>{task}</p>
   <ul>{points.map(point=><li key={point}>{point}</li>)}</ul>
   <p>Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter).<br/>Schreiben Sie auch eine Anrede und einen Gruß.</p>
  </div>
  <p className="x1-task">In der Nachricht fehlen zehn Wörter oder Sätze. Was ist richtig?<br/>Markieren Sie: <span className="x1-letter inline">a</span>, <span className="x1-letter inline">b</span> oder <span className="x1-letter inline">c</span>.</p>
  <Hint language={marks.language} text={examText(marks.language,'hintS2')}/>
  <div className="x1-msg" data-x1-message>{lines.map((line,i)=><p key={i}><Filled text={line} items={items} answers={marks.answers} review={review}/></p>)}</div>
  {items.map(item=><GapChoice key={item.id} item={item} context={contextOf(lineOf(item.n),item.n)} {...marks}/>)}
 </section>;
}

/** One Teil of a Schreiben exam on the paper. */
export function SchreibenTeil({schreiben,teil,...marks}:{schreiben:SchreibenExam;teil:1|2}&MarkProps){
 return teil===1?<TeilOne schreiben={schreiben} {...marks}/>:<TeilTwo schreiben={schreiben} {...marks}/>;
}
