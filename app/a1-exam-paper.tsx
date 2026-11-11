'use client';
import type {ReactNode} from 'react';
import {BookOpen,Check,Headphones,Mail,PenLine,X} from 'lucide-react';
import type {Ad,AdChoice,AdMode,ExamAnswer,LesenExam,Notice,ReadingText,TrueFalse} from '@/lib/a1-exam-types';
import type {ExamAnswers} from '@/lib/a1-exam-course';
import {examText,examWhy} from '@/lib/a1-exam-copy';
import {languageDirection,isSiteLanguage} from '@/lib/site-languages';

/**
 * The exam paper of A1 sınavı (app/a1-exam-study.tsx), drawn like the learner's photos of the written exam: Teil 1 with
 * a mail window or a letter and Richtig / Falsch boxes (+ / −), Teil 2 with two small ads in different frames and the
 * phone number (or web address) to mark as a / b, Teil 3 with a notice and where it hangs. The paper is German and
 * left-to-right in every site language. `review`: after handing in — the right answer is marked and explained, nothing
 * can be changed.
 */
export type MarkProps={answers:ExamAnswers;onMark?:(id:string,value:ExamAnswer)=>void;review?:boolean;language:string};

/** German with `**bold**`. */
export function Bold({text}:{text:string}){const parts=text.split(/(\*\*[^*]+\*\*)/g);return <>{parts.map((part,i)=>part.length>4&&part.startsWith('**')&&part.endsWith('**')?<b key={i}>{part.slice(2,-2)}</b>:part)}</>;}
/** An explanation in the help language: `*German words*` stay German. */
function Quoted({text}:{text:string}){const parts=text.split(/(\*[^*]+\*)/g);return <>{parts.map((part,i)=>part.length>2&&part.startsWith('*')&&part.endsWith('*')?<bdi key={i} className="x1-quote" lang="de" dir="ltr">{part.slice(1,-1)}</bdi>:part)}</>;}

const TF_WORD:Record<TrueFalse,string>={r:'Richtig',f:'Falsch'};
const TF_SIGN:Record<TrueFalse,string>={r:'+',f:'–'};
/** How a box looks: crossed by the learner; after handing in also right (green) or wrong (red). */
export function boxClass(base:string,mine:boolean,right:boolean,review:boolean){return base+(mine?' on':'')+(review&&right?' is-right':'')+(review&&mine&&!right?' is-wrong':'');}

/** Richtig / Falsch with + and − under the boxes, like the paper; the marked box is crossed. */
export function TrueFalseBoxes({id,value,answer,onMark,review=false,example=false,label}:{id?:string;value:ExamAnswer|undefined;answer:TrueFalse;onMark?:(id:string,value:ExamAnswer)=>void;review?:boolean;example?:boolean;label:string}){
 const fixed=review||example||!onMark||!id;
 return <div className="x1-tf" role="radiogroup" aria-label={label}>
  {(['r','f'] as const).map(choice=><button type="button" key={choice} role="radio" aria-checked={value===choice} disabled={fixed} data-choice={choice}
   className={boxClass('x1-box',value===choice,answer===choice,review)} onClick={()=>{if(id&&onMark)onMark(id,choice);}}>
   <span className="x1-box-word">{TF_WORD[choice]}</span><span className="x1-sign" aria-hidden="true">{TF_SIGN[choice]}</span>
  </button>)}
 </div>;
}
/** The line under an item after handing in: right or wrong, the right answer and why. `explained`: an explanation that is
 * already in the page's language (the spelling practice builds it from the labels) instead of the one looked up by id. */
export function Why({id,given,answer,why,language,explained}:{id:string;given:ExamAnswer|undefined;answer:ExamAnswer;why:string;language:string;explained?:{text:string;lang:string}}){
 const right=given===answer;const name=(value:ExamAnswer)=>value==='r'||value==='f'?TF_WORD[value]:value;
 const shown=explained??examWhy(language,id,why);const dir=isSiteLanguage(shown.lang)?languageDirection(shown.lang):'ltr';
 return <div className={'x1-why '+(right?'ok':'no')} lang={language} dir={languageDirection(isSiteLanguage(language)?language:'en')} data-x1-why={right?'right':'wrong'}>
  <p className="x1-why-head">{right?<Check size={18} aria-hidden="true"/>:<X size={18} aria-hidden="true"/>}<strong>{examText(language,right?'correct':'wrong')}</strong>
   {!right&&<span>{examText(language,'yourAnswer')}: <b lang="de" dir="ltr">{given?name(given):'—'}</b>{!given&&<> ({examText(language,'noAnswer')})</>}</span>}
   <span>{examText(language,'rightAnswer')}: <b lang="de" dir="ltr">{name(answer)}</b></span></p>
  <p className="x1-why-text" lang={shown.lang} dir={dir}><Quoted text={shown.text}/></p>
 </div>;
}
/** The big number of an item (0 = Beispiel). */
export const Num=({n}:{n:number})=><span className={'x1-num'+(n===0?' zero':'')} aria-hidden="true">{n}</span>;

/** A statement with its boxes. */
function Statement({n,id,text,answer,why,example=false,answers,onMark,review,language}:{n:number;id?:string;text:string;answer:TrueFalse;why?:string;example?:boolean}&MarkProps){
 const value=example?answer:id?answers[id]:undefined;
 return <div className={'x1-item'+(example?' x1-example':'')} data-x1-item={id??'example'}>
  <div className="x1-row"><Num n={n}/><p className="x1-statement" id={id?'x1-s-'+id:undefined}>{text}</p>
   <TrueFalseBoxes id={id} value={value} answer={answer} onMark={onMark} review={review} example={example} label={(n?n+'. ':'Beispiel. ')+text}/></div>
  {review&&id&&why&&<Why id={id} given={answers[id]} answer={answer} why={why} language={language}/>}
 </div>;
}

/* ---------- Teil 1: a mail window, a letter or a note ---------- */
function Lines({lines}:{lines:readonly string[]}){return <>{lines.map((line,i)=><p key={i}><Bold text={line}/></p>)}</>;}
function Reading({text}:{text:ReadingText}){
 if(text.kind==='mail')return <div className="x1-mail" data-x1-text="mail">
  <div className="x1-mail-bar"><Mail size={15} aria-hidden="true"/><span>{text.subject} – Nachricht</span><span className="x1-mail-keys" aria-hidden="true"><i/><i/><i/></span></div>
  <div className="x1-mail-menu" aria-hidden="true"><span>Datei</span><span>Bearbeiten</span><span>Ansicht</span><span>Einfügen</span><span>Format</span><span>Extras</span><span>?</span></div>
  <div className="x1-mail-tools" aria-hidden="true"><span>Antworten</span><span>Allen antworten</span><span>Weiterleiten</span></div>
  <dl className="x1-mail-head"><div><dt>Von:</dt><dd>{text.from}</dd></div><div><dt>An:</dt><dd>{text.to}</dd></div><div><dt>Betreff:</dt><dd>{text.subject}</dd></div></dl>
  <div className="x1-mail-body"><Lines lines={text.lines}/></div>
 </div>;
 return <div className={'x1-text-'+text.kind} data-x1-text={text.kind}><Lines lines={text.lines}/></div>;
}
export const HEAD=(module:number,title:string)=><h2 className="x1-teil" id="x1-teil-heading" tabIndex={-1}><span className="x1-teil-num" aria-hidden="true">{module}</span>{title}</h2>;
export function Hint({language,text}:{language:string;text:string}){
 if(language==='de')return null; // the German instruction says it already
 return <p className="x1-hint" lang={language} dir={languageDirection(isSiteLanguage(language)?language:'en')}>{text}</p>;
}

function TeilOne({lesen,...marks}:{lesen:LesenExam}&MarkProps){
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="1">
  {HEAD(2,'Lesen, Teil 1')}
  <p className="x1-task">Sind die Aussagen 1–5 <b>Richtig</b> (+) oder <b>Falsch</b> (–)?<br/>Markieren Sie.</p>
  <Hint language={marks.language} text={examText(marks.language,'hint1')}/>
  {lesen.teil1.map((text,i)=><div className="x1-block" key={i}>
   {text.example&&<><p className="x1-beispiel">Beispiel</p><Statement n={0} text={text.example.text} answer={text.example.answer} example {...marks}/></>}
   <Reading text={text}/>
   {text.items.map(item=><Statement key={item.id} n={item.n} id={item.id} text={item.text} answer={item.answer} why={item.why} {...marks}/>)}
  </div>)}
 </section>;
}

/* ---------- Teil 2: two ads, a or b ---------- */
function AdBox({ad,mode}:{ad:Ad;mode:AdMode}){
 if(mode==='web')return <div className="x1-web"><div className="x1-web-bar" aria-hidden="true"><i/><i/><i/><span>{ad.label}</span></div><div className="x1-web-body"><Lines lines={ad.lines}/></div></div>;
 return <div className={'x1-ad x1-frame-'+ad.frame+(ad.face==='serif'?' x1-serif':'')}><Lines lines={ad.lines}/></div>;
}
function AdPair({n,id,situation,ads,answer,why,mode,example=false,answers,onMark,review=false,language}:{n:number;id?:string;situation:string;ads:readonly [Ad,Ad];answer:AdChoice;why?:string;mode:AdMode;example?:boolean}&MarkProps){
 const value=example?answer:id?answers[id]:undefined;const fixed=review||example||!onMark||!id;
 return <div className={'x1-item x1-pair'+(example?' x1-example':'')} data-x1-item={id??'example'}>
  <div className="x1-row"><Num n={n}/><p className="x1-statement">{situation}</p></div>
  <div className="x1-ads" role="radiogroup" aria-label={(n?n+'. ':'Beispiel. ')+situation}>
   {(['a','b'] as const).map((choice,i)=><div className="x1-ad-col" key={choice}>
    <AdBox ad={ads[i]} mode={mode}/>
    <button type="button" role="radio" aria-checked={value===choice} disabled={fixed} data-choice={choice} className={boxClass('x1-pick',value===choice,answer===choice,review)} onClick={()=>{if(id&&onMark)onMark(id,choice);}}>
     <span className="x1-letter">{choice}</span><span className="x1-pick-label">{ads[i].label}</span>
    </button>
   </div>)}
  </div>
  {review&&id&&why&&<Why id={id} given={answers[id]} answer={answer} why={why} language={language}/>}
 </div>;
}
function TeilTwo({lesen,...marks}:{lesen:LesenExam}&MarkProps){
 const {mode,example,items}=lesen.teil2;
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="2" data-x1-mode={mode}>
  {HEAD(2,'Lesen, Teil 2')}
  <p className="x1-task">Lesen Sie die Texte und die Aufgaben 6–10.<br/>{mode==='web'?'Wo finden Sie Informationen?':'Welche Anzeige passt?'}<br/>Markieren Sie: <span className="x1-letter inline">a</span> oder <span className="x1-letter inline">b</span>?</p>
  <Hint language={marks.language} text={examText(marks.language,mode==='web'?'hint2web':'hint2ad')}/>
  <p className="x1-beispiel">Beispiel</p>
  <AdPair n={0} situation={example.situation} ads={example.ads} answer={example.answer} mode={mode} example {...marks}/>
  {items.map(item=><AdPair key={item.id} n={item.n} id={item.id} situation={item.situation} ads={item.ads} answer={item.answer} why={item.why} mode={mode} {...marks}/>)}
 </section>;
}

/* ---------- Teil 3: a notice and where it hangs ---------- */
function NoticeBox({notice}:{notice:Notice}){
 return <div className={'x1-notice x1-frame-'+notice.frame+(notice.face==='serif'?' x1-serif':'')}>{notice.title&&<strong className="x1-notice-title">{notice.title}</strong>}<Lines lines={notice.lines}/></div>;
}
function NoticeItemView({n,id,place,notice,text,answer,why,example=false,...marks}:{n:number;id?:string;place:string;notice:Notice;text:string;answer:TrueFalse;why?:string;example?:boolean}&MarkProps){
 const value=example?answer:id?marks.answers[id]:undefined;
 return <div className={'x1-item x1-sign-item'+(example?' x1-example':'')} data-x1-item={id??'example'}>
  <div className="x1-row"><Num n={n}/>{example&&<span className="x1-beispiel inline">Beispiel</span>}<p className="x1-place"><Bold text={place}/></p></div>
  <NoticeBox notice={notice}/>
  <div className="x1-row x1-row-claim"><p className="x1-statement">{text}</p>
   <TrueFalseBoxes id={id} value={value} answer={answer} onMark={marks.onMark} review={marks.review} example={example} label={(n?n+'. ':'Beispiel. ')+text}/></div>
  {marks.review&&id&&why&&<Why id={id} given={marks.answers[id]} answer={answer} why={why} language={marks.language}/>}
 </div>;
}
function TeilThree({lesen,...marks}:{lesen:LesenExam}&MarkProps){
 const {example,items}=lesen.teil3;
 return <section className="x1-part" aria-labelledby="x1-teil-heading" data-x1-teil="3">
  {HEAD(2,'Lesen, Teil 3')}
  <p className="x1-task">Lesen Sie die Texte und die Aufgaben 11–15.<br/>Markieren Sie: <b>Richtig</b> (+) oder <b>Falsch</b> (–)?</p>
  <Hint language={marks.language} text={examText(marks.language,'hint3')}/>
  <NoticeItemView n={0} place={example.place} notice={example.notice} text={example.text} answer={example.answer} example {...marks}/>
  {items.map(item=><NoticeItemView key={item.id} n={item.n} id={item.id} place={item.place} notice={item.notice} text={item.text} answer={item.answer} why={item.why} {...marks}/>)}
 </section>;
}

/** One Teil of a Lesen exam on the paper. */
export function LesenTeil({lesen,teil,...marks}:{lesen:LesenExam;teil:1|2|3}&MarkProps){
 return teil===1?<TeilOne lesen={lesen} {...marks}/>:teil===2?<TeilTwo lesen={lesen} {...marks}/>:<TeilThree lesen={lesen} {...marks}/>;
}
/** The sheet itself: the head line of the exam paper (Hören or Lesen) and the side label. `spell`: a sheet of the
 * spelling practice — a Hören sheet that is a practice, not a part of the exam. */
export function Paper({children,minutes,module='lesen'}:{children:ReactNode;minutes:number;module?:'hoeren'|'lesen'|'schreiben'|'spell'}){
 const heard=module==='hoeren'||module==='spell';
 return <div className={'x1-paper x1-paper-'+module} lang="de" dir="ltr">
  <div className="x1-paper-head"><span className="x1-paper-icon" aria-hidden="true">{heard?<Headphones size={20}/>:module==='schreiben'?<PenLine size={20}/>:<BookOpen size={20}/>}</span><strong>{heard?'Hören':module==='schreiben'?'Schreiben':'Lesen'}</strong><span>{module==='spell'?'Übung: Buchstabieren':'(circa '+minutes+' Minuten)'}</span></div>
  <span className="x1-paper-side" aria-hidden="true">{module==='spell'?'Übung':'Schriftliche Prüfung'}</span>
  {children}
 </div>;
}
