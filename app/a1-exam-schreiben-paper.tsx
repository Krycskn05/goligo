'use client';
import {Check,X} from 'lucide-react';
import type {ExamAnswer,FormGap,SchreibenExam} from '@/lib/a1-exam-types';
import {SCHREIBEN_CRITERIA,checkEntry,countWords,criterionId,schreibenTextId,selfPoints,type ExamAnswers,type ExamTexts} from '@/lib/a1-exam-course';
import {examText,type ExamCopyKey} from '@/lib/a1-exam-copy';
import {languageDirection,isSiteLanguage} from '@/lib/site-languages';
import {HEAD,Hint} from './a1-exam-paper';

/**
 * The Schreiben paper of A1 sınavı (the learner asked, 11 November 2026), built like the exam: Teil 1 — a short text
 * about someone and a form with five missing entries; Teil 2 — the task with its three points and a message of about
 * 30 words. Nothing is a choice (the learner: „seçmeli olmayacak … ben yazmalıyım, özgün bir şekilde“): the form is
 * filled in by typing, the message is written freely. Nothing is marked before the end.
 *
 * After handing in (`review`): the form is marked by the page — what was typed is shown, a wrong entry crossed out
 * with the model entry beside it, and every gap explained in the site language (lib/a1-exam-copy.ts `sw_text` /
 * `sw_infer`). The message is the learner's own, so the page does not judge it: it shows the text, a sample answer,
 * and the exam's scale (3 points for each point of the task, 1 for greeting and ending) for the learner to mark the own
 * message (`onSelf`; the marks are kept like answers under `<exam>-06` … `-09`).
 */
export type WriteProps={examId:string;answers:ExamAnswers;texts:ExamTexts;onText?:(id:string,value:string)=>void;onSelf?:(id:string,value:ExamAnswer)=>void;review?:boolean;language:string};

const dirOf=(language:string)=>languageDirection(isSiteLanguage(language)?language:'en');
/** A site-language text with `*German words*`. */
function Starred({text}:{text:string}){const parts=text.split(/(\*[^*]+\*)/g);return <>{parts.map((part,i)=>part.length>2&&part.startsWith('*')&&part.endsWith('*')?<bdi key={i} className="x1-quote" lang="de" dir="ltr">{part.slice(1,-1)}</bdi>:part)}</>;}

/** A gap of the form: a field to type in; after handing in what was typed, marked. */
function Entry({item,label,texts,onText,review}:{item:FormGap;label:string}&Pick<WriteProps,'texts'|'onText'|'review'>){
 const given=texts[item.id]??'';const model=item.accept[0];
 if(!review)return <span className="x1-gap" data-x1-item={item.id} data-x1-gap={item.n}><span className="x1-gap-n">{item.n}</span>
  <input className="x1-entry" type="text" value={given} onChange={event=>onText?.(item.id,event.target.value)} readOnly={!onText} maxLength={80}
   aria-label={item.n+'. '+label} lang="de" dir="ltr" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} enterKeyHint="next"/></span>;
 const check=checkEntry(given,item.accept);const good=check==='right'||check==='near';
 return <span className={'x1-gap filled '+(good?'is-right':'is-wrong')} data-x1-item={item.id} data-x1-gap={item.n} data-x1-entry={check}><span className="x1-gap-n">{item.n}</span>
  {good?<span className="x1-gap-word">{given.trim()}</span>:<>{check==='wrong'&&<s className="x1-gap-word">{given.trim()}</s>}<span className="x1-gap-word x1-gap-right">{model}</span></>}
 </span>;
}
/** The line under the form for a gap after handing in: right or wrong, what was typed, the model entry and why. */
function EntryWhy({item,texts,language}:{item:FormGap}&Pick<WriteProps,'texts'|'language'>){
 const given=(texts[item.id]??'').trim();const model=item.accept[0];const check=checkEntry(given,item.accept);const good=check==='right'||check==='near';
 return <div className={'x1-why '+(good?'ok':'no')} lang={language} dir={dirOf(language)} data-x1-why={good?'right':'wrong'}>
  <p className="x1-why-head">{good?<Check size={18} aria-hidden="true"/>:<X size={18} aria-hidden="true"/>}<strong><span dir="ltr">{item.n}.</span> {examText(language,good?'correct':'wrong')}</strong>
   {!good&&<span>{examText(language,'yourAnswer')}: <b lang="de" dir="ltr">{given||'—'}</b>{!given&&<> ({examText(language,'noAnswer')})</>}</span>}
   <span>{examText(language,'rightAnswer')}: <b lang="de" dir="ltr">{model}</b></span></p>
  <p className="x1-why-text"><Starred text={examText(language,('sw_'+item.why.kind) as ExamCopyKey,{quote:item.why.quote,right:model})+(check==='near'?' '+examText(language,'entryNear',{right:model}):'')}/></p>
 </div>;
}

/** Teil 1: the text and the form with its five gaps to fill in. */
function TeilOne({schreiben,texts,onText,review=false,language}:{schreiben:SchreibenExam}&WriteProps){
 const {text,form,rows,items}=schreiben.teil1;
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="1">
  {HEAD(3,'Schreiben, Teil 1')}
  <p className="x1-s-text">{text}</p>
  <p className="x1-task">Schreiben Sie die <b>fünf</b> fehlenden Informationen in das Formular.</p>
  <Hint language={language} text={examText(language,'hintS1')}/>
  <div className="x1-form" data-x1-form>
   <strong className="x1-form-title">{form}</strong>
   <dl>{rows.map(row=><div key={row.label}><dt>{row.label}</dt><dd>{row.value.split(/(\{\d+\})/g).map((part,i)=>{
    const mark=/^\{(\d+)\}$/.exec(part);const item=mark?items.find(entry=>entry.n===Number(mark[1])):undefined;
    return item?<Entry key={i} item={item} label={row.label} texts={texts} onText={onText} review={review}/>:part;})}</dd></div>)}</dl>
  </div>
  {review&&items.map(item=><EntryWhy key={item.id} item={item} texts={texts} language={language}/>)}
 </section>;
}
/** Teil 2: the task with its three points and the sheet to write the message on; after handing in the learner's text,
 * a sample answer and the exam's scale to mark the own message. */
function TeilTwo({schreiben,examId,answers,texts,onText,onSelf,review=false,language}:{schreiben:SchreibenExam}&WriteProps){
 const {task,points,model}=schreiben.teil2;const id=schreibenTextId(examId);const written=texts[id]??'';const words=countWords(written);
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="2">
  {HEAD(3,'Schreiben, Teil 2')}
  <div className="x1-s-task" data-x1-task>
   <p>{task}</p>
   <ul>{points.map(point=><li key={point}>{point}</li>)}</ul>
   <p>Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter).<br/>Schreiben Sie auch eine Anrede und einen Gruß.</p>
  </div>
  {!review&&<><Hint language={language} text={examText(language,'hintS2')}/>
   <textarea className="x1-write" data-x1-message value={written} onChange={event=>onText?.(id,event.target.value)} readOnly={!onText} rows={9} maxLength={1500}
    placeholder={examText(language,'writeHere')} aria-label={examText(language,'yourText')} lang="de" dir="ltr" autoComplete="off" autoCapitalize="sentences" autoCorrect="off" spellCheck={false}/>
   <p className="x1-words" lang={language} dir={dirOf(language)} data-x1-words={words}>{examText(language,'wordCount',{n:words})}</p></>}
  {review&&<>
   <p className="x1-s-label" lang={language} dir={dirOf(language)}>{examText(language,'yourText')} · {examText(language,'wordCount',{n:words})}</p>
   <div className="x1-msg" data-x1-message>{written.trim()?written.trim().split('\n').map((line,i)=><p key={i} className="x1-own">{line||' '}</p>):<p lang={language} dir={dirOf(language)}>{examText(language,'emptyText')}</p>}</div>
   <p className="x1-s-label" lang={language} dir={dirOf(language)}>{examText(language,'modelTitle')}</p>
   <div className="x1-model" data-x1-model>{model.map((line,i)=><p key={i}>{line}</p>)}</div>
   <p className="x1-hint" lang={language} dir={dirOf(language)}>{examText(language,'modelNote')}</p>
   <div className="x1-self" lang={language} dir={dirOf(language)} data-x1-self>
    <h3>{examText(language,'selfTitle')}</h3><p>{examText(language,'selfLead')}</p>
    {SCHREIBEN_CRITERIA.map(criterion=>{const key=criterionId(examId,criterion.n);const value=answers[key];
     const choices:readonly ('a'|'b'|'c')[]=criterion.points>1?['a','b','c']:['a','c'];
     const label=(choice:'a'|'b'|'c')=>examText(language,criterion.points>1?choice==='a'?'selfFull':choice==='b'?'selfHalf':'selfNone':choice==='a'?'selfYes':'selfNo');
     const name=criterion.point?examText(language,'selfPoint',{n:criterion.point}):examText(language,'selfForm');
     return <div className="x1-self-row" key={key} data-x1-item={key} data-x1-self-points={value===undefined?'':selfPoints(criterion.points,value)}>
      <p className="x1-self-what"><b>{name}</b>{criterion.point?<>: <span lang="de" dir="ltr">{points[criterion.point-1]}</span></>:null}</p>
      <div className="x1-self-picks" role="radiogroup" aria-label={name}>{choices.map(choice=><button type="button" key={choice} role="radio" aria-checked={value===choice} disabled={!onSelf}
       className={'x1-self-pick'+(value===choice?' on':'')} data-choice={choice} onClick={()=>onSelf?.(key,choice)}>{label(choice)}</button>)}</div>
     </div>;})}
   </div>
  </>}
 </section>;
}

/** One Teil of a Schreiben exam on the paper. */
export function SchreibenTeil({schreiben,teil,...props}:{schreiben:SchreibenExam;teil:1|2}&WriteProps){
 return teil===1?<TeilOne schreiben={schreiben} {...props}/>:<TeilTwo schreiben={schreiben} {...props}/>;
}
