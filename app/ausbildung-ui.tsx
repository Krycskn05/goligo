'use client';
import {Fragment,useEffect,useState,type ReactNode} from 'react';
import {Check,CheckCircle2,Eye,EyeOff,RotateCcw,Volume2} from 'lucide-react';
import {useAnswerSound} from './study-shared';
import {gradeExercise,gradeItem,matchesAnswer,wordSpeech,type L12Block,type L12Exercise,type L12Item,type L12Value} from '@/lib/ausbildung-course';

/** Inline markup: *German* (italic, marked as German) and **bold**. */
export function Rich({text}:{text:string}){
 const parts=text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
 return <>{parts.map((part,i)=>part.length>4&&part.startsWith('**')&&part.endsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:part.length>2&&part.startsWith('*')&&part.endsWith('*')?<em key={i} lang="de">{part.slice(1,-1)}</em>:<Fragment key={i}>{part}</Fragment>)}</>;
}

type Speak={speak:(text:string)=>void;busy:boolean};

export function LessonBlocks({blocks,speech}:{blocks:L12Block[];speech:Speak}){
 return <>{blocks.map((block,i)=>{
  switch(block.t){
   case 'p':return <p key={i} className="l12-p"><Rich text={block.text}/></p>;
   case 'h':return <h3 key={i} className="l12-h">{block.text}</h3>;
   case 'note':return <p key={i} className="l12-note"><Rich text={block.text}/></p>;
   case 'list':{const List=block.ordered?'ol':'ul';return <List key={i} className="l12-list">{block.items.map((item,j)=><li key={j}><Rich text={item}/></li>)}</List>;}
   case 'letter':return <div key={i} className="l12-letter" lang="de" dir="ltr">{block.lines.map((line,j)=><p key={j}>{line}</p>)}</div>;
   case 'listen':return null;
   case 'table':return <div key={i} className={'l12-table-wrap'+(block.frame?' l12-frame':block.head.length>=4?' l12-wide':'')}><table className="l12-table"><thead><tr>{block.head.map((cell,j)=><th key={j} scope="col">{cell}</th>)}</tr></thead><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k} lang={block.frame?'de':undefined}><Rich text={cell}/></td>)}</tr>)}</tbody></table></div>;
   case 'vocab':return <div key={i} className="l12-vocab">
    {block.title&&<h3 className="l12-h">{block.title}</h3>}
    {block.lead&&<p className="l12-p"><Rich text={block.lead}/></p>}
    <ul className="l12-words">{block.words.map((word,j)=><li key={j}>
     <button type="button" className="l12-say" disabled={speech.busy} aria-label={'Dinle: '+wordSpeech(word)} title="Dinle" onClick={()=>speech.speak(wordSpeech(word))}><Volume2 size={17} aria-hidden="true"/></button>
     <span className="l12-word-de" lang="de" dir="ltr">{word[0]}</span>
     <span className="l12-word-tr"><Rich text={word[1]}/></span>
    </li>)}</ul>
   </div>;
  }
 })}</>;
}

/** Saved answers for one exercise (in this browser): the values and whether it was checked. */
type Saved={v:Record<number,L12Value>;checked:boolean};
const storageKey=(id:string)=>'lernkoko-l12:'+id;
export const SCORE_KEY='lernkoko-l12-scores';
export type ScoreMap=Record<string,{right:number;total:number;points?:number}>;
export function readScores():ScoreMap{try{const value=JSON.parse(localStorage.getItem(SCORE_KEY)??'{}');return value&&typeof value==='object'?value as ScoreMap:{};}catch{return {};}}
function saveScore(id:string,score:ScoreMap[string]|null){try{const all=readScores();if(score)all[id]=score;else delete all[id];localStorage.setItem(SCORE_KEY,JSON.stringify(all));}catch{}}

const gapWidth=(answers:string[])=>Math.min(22,Math.max(3,...answers.map(answer=>answer.length))+2)+'ch';

export function ExerciseCard({exercise,onScore}:{exercise:L12Exercise;onScore?:()=>void}){
 const [values,setValues]=useState<Record<number,L12Value>>({});
 const [checked,setChecked]=useState(false);const [showKey,setShowKey]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey(exercise.id))??'null') as Saved|null;if(saved&&typeof saved==='object'){setValues(saved.v??{});setChecked(!!saved.checked);}}catch{}setReady(true);},[exercise.id]);
 useEffect(()=>{if(!ready)return;try{localStorage.setItem(storageKey(exercise.id),JSON.stringify({v:values,checked} satisfies Saved));}catch{}},[values,checked,ready,exercise.id]);
 const set=(index:number,value:L12Value)=>{setValues(previous=>({...previous,[index]:value}));if(checked)setChecked(false);};
 const checkable=exercise.items.some(item=>item.k!=='open');const sound=useAnswerSound();
 const score=gradeExercise(exercise,values);
 function check(){sound.prepare();if(score.right===score.total&&score.total>0)sound.correct();else sound.wrong();setChecked(true);saveScore(exercise.id,{right:score.right,total:score.total,points:score.points});onScore?.();}
 function reset(){setValues({});setChecked(false);setShowKey(false);saveScore(exercise.id,null);onScore?.();try{localStorage.removeItem(storageKey(exercise.id));}catch{}}
 const reveal=showKey;
 return <article className="panel l12-exercise" id={'ex-'+exercise.id} data-l12-exercise={exercise.id}>
  <header className="l12-exercise-head"><h3>{exercise.title}</h3>{exercise.points!==undefined&&<span className="l12-points">{exercise.points.toString().replace('.',',')} P.</span>}</header>
  {exercise.hint&&<p className="l12-hint"><Rich text={exercise.hint}/></p>}
  {exercise.reading&&<div className="l12-reading" lang="de" dir="ltr">{exercise.reading.title&&<h4>{exercise.reading.title}</h4>}{exercise.reading.lines.map((line,i)=><p key={i}><Rich text={line}/></p>)}</div>}
  {exercise.bank&&<p className="l12-bank" lang="de" dir="ltr">{exercise.bank.map(word=><span key={word}>{word}</span>)}</p>}
  <ol className="l12-items">{exercise.items.map((item,i)=><li key={i} className={'l12-item l12-k-'+item.k+(checked&&item.k!=='open'?(gradeItem(item,values[i]).right===gradeItem(item,values[i]).total?' ok':' bad'):'')}>
   <ItemView item={item} value={values[i]} onChange={value=>set(i,value)} checked={checked} reveal={reveal} index={i}/>
  </li>)}</ol>
  {reveal&&exercise.key&&<p className="l12-key-note"><Rich text={exercise.key}/></p>}
  <div className="l12-actions">
   {checkable&&<button type="button" className="btn" onClick={check}><Check size={18} aria-hidden="true"/>Kontrol et</button>}
   <button type="button" className="btn secondary" aria-pressed={showKey} onClick={()=>setShowKey(value=>!value)}>{showKey?<EyeOff size={18} aria-hidden="true"/>:<Eye size={18} aria-hidden="true"/>}{showKey?'Cevapları gizle':checkable?'Cevap anahtarı':'Örnek cevap'}</button>
   <button type="button" className="text-button l12-reset" onClick={reset}><RotateCcw size={16} aria-hidden="true"/>Baştan</button>
  </div>
  {checked&&checkable&&<p className="l12-score" role="status">{score.right===score.total?<CheckCircle2 size={18} aria-hidden="true"/>:null}Sonuç: {score.right} / {score.total}{score.points!==undefined&&exercise.points!==undefined?` · ${String(score.points).replace('.',',')} / ${String(exercise.points).replace('.',',')} Punkte`:''}</p>}
 </article>;
}

function Solution({children}:{children:ReactNode}){return <p className="l12-solution"><span>Doğrusu:</span> <strong lang="de" dir="ltr">{children}</strong></p>;}

function ItemView({item,value,onChange,checked,reveal,index}:{item:L12Item;value:L12Value;onChange:(value:L12Value)=>void;checked:boolean;reveal:boolean;index:number}){
 if(item.k==='gap'){
  const given=Array.isArray(value)?value:[];const pieces=item.text.split('___');
  const wrong=checked&&item.answers.some((accepted,i)=>!matchesAnswer(given[i]??'',accepted));
  return <><p className="l12-gap-text" lang="de" dir="ltr">{pieces.map((piece,i)=><Fragment key={i}><Rich text={piece}/>{i<pieces.length-1&&<input type="text" className={'l12-gap'+(checked?(matchesAnswer(given[i]??'',item.answers[i])?' ok':' bad'):'')} style={{width:gapWidth(item.answers[i])}} value={given[i]??''} aria-label={'Boşluk '+(i+1)} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} onChange={event=>{const next=[...given];next[i]=event.target.value;onChange(next);}}/>}</Fragment>)}</p>
   {(reveal||wrong)&&<Solution>{item.answers.map(accepted=>accepted[0]).join(' · ')}</Solution>}</>;
 }
 if(item.k==='choice'){
  const chosen=typeof value==='number'?value:null;
  return <div className="l12-choice-row"><p className="l12-prompt" lang="de" dir="ltr"><Rich text={item.text}/></p><div className="l12-options" role="radiogroup" aria-label={item.text}>{item.options.map((option,i)=><button type="button" key={option} role="radio" aria-checked={chosen===i} className={'l12-option'+(chosen===i?' selected':'')+((checked||reveal)&&i===item.answer?' right':'')+(checked&&chosen===i&&i!==item.answer?' wrong':'')} onClick={()=>onChange(i)}>{option}</button>)}</div></div>;
 }
 if(item.k==='sentence'){
  const text=typeof value==='string'?value:'';const wrong=checked&&!matchesAnswer(text,item.answers);
  return <><p className="l12-prompt" lang="de" dir="ltr"><Rich text={item.prompt}/></p><input type="text" className={'l12-line'+(checked?(wrong?' bad':' ok'):'')} lang="de" dir="ltr" value={text} aria-label={'Cevap '+(index+1)} autoComplete="off" autoCapitalize="sentences" spellCheck={false} onChange={event=>onChange(event.target.value)}/>{(reveal||wrong)&&<Solution>{item.answers[0]}</Solution>}</>;
 }
 if(item.k==='pick'){
  const picked=Array.isArray(value)?value:[];
  const toggle=(word:string)=>onChange(picked.includes(word)?picked.filter(item=>item!==word):picked.length>=item.need?[...picked.slice(1),word]:[...picked,word]);
  return <><p className="l12-prompt" lang="de" dir="ltr"><strong>{item.prompt}</strong> <small>({picked.length}/{item.need})</small></p><div className="l12-options l12-pick" lang="de" dir="ltr">{item.options.map(word=><button type="button" key={word} aria-pressed={picked.includes(word)} className={'l12-option'+(picked.includes(word)?' selected':'')+(checked&&picked.includes(word)?(item.accept.includes(word)?' right':' wrong'):'')} onClick={()=>toggle(word)}>{word}</button>)}</div>{(reveal||(checked&&gradeItem(item,picked).right===0))&&<Solution>{item.accept.join(', ')}</Solution>}</>;
 }
 const text=typeof value==='string'?value:'';
 return <><p className="l12-prompt" lang="de" dir="ltr"><Rich text={item.prompt}/></p><textarea className="l12-open" lang="de" dir="ltr" rows={item.sample&&item.sample.includes('\n')?6:3} value={text} aria-label={item.prompt} spellCheck={false} onChange={event=>onChange(event.target.value)}/>{reveal&&item.sample&&<div className="l12-sample"><span>Örnek:</span><p lang="de" dir="ltr">{item.sample}</p></div>}</>;
}

