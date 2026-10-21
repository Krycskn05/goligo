'use client';
import {Fragment,useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowRight,Check,CheckCircle2,Eye,EyeOff,Layers,Lightbulb,RotateCcw,Shuffle,Volume2,X} from 'lucide-react';
import {useAnswerSound} from './study-shared';
import {exampleSpeech,frameSpeech,gradeExercise,gradeItem,matchesAnswer,wordSpeech,type L12Block,type L12Exercise,type L12Item,type L12Section,type L12Value,type L12Word} from '@/lib/ausbildung-course';
import {wordArticle,type L12ScoreMap} from '@/lib/ausbildung-progress';
import {wordPicture} from '@/lib/ausbildung-art';
import {RasterArt} from './toon-art';
import {PaulHoca} from './paul-hoca';

/** Inline markup: *German* (marked as German) and **bold**. */
export function Rich({text}:{text:string}){
 const parts=text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
 return <>{parts.map((part,i)=>part.length>4&&part.startsWith('**')&&part.endsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:part.length>2&&part.startsWith('*')&&part.endsWith('*')?<span key={i} className="l12-de" lang="de">{part.slice(1,-1)}</span>:<Fragment key={i}>{part}</Fragment>)}</>;
}

/** The site's speech, as the lesson uses it: read one German text, show which one is playing. */
export type Speech={speak:(text:string)=>void;busy:boolean;activeText?:string};

export function SayButton({text,speech,label}:{text:string;speech:Speech;label?:string}){
 const playing=speech.busy&&speech.activeText===text;
 return <button type="button" className={'l12-say'+(playing?' playing':'')} disabled={speech.busy&&!playing} aria-label={(label??'Dinle')+': '+text} title="Dinle" onClick={()=>speech.speak(text)}><Volume2 size={18} aria-hidden="true"/></button>;
}

/* ---------- Words ---------- */

/** A German word with its article coloured, separable prefixes marked and the plural ending kept small. */
export function GermanWord({de}:{de:string}){
 // Two words in one row (der Monat, -e · die Woche, -n): each keeps its own article and plural.
 const pair=de.split(' · ');
 if(pair.length>1&&pair.every(part=>part.trim()))return <span className="l12-word-pair">{pair.map((part,i)=><Fragment key={i}>{i>0&&<span className="l12-or"> · </span>}<GermanWord de={part}/></Fragment>)}</span>;
 const comma=de.indexOf(', ');const main=comma>0?de.slice(0,comma):de;const plural=comma>0?de.slice(comma+2):'';
 return <span className="l12-word" lang="de" dir="ltr">{main.split(' / ').map((option,n)=>{
  const article=wordArticle(option);const rest=article?option.slice(article.length+1):option;
  return <Fragment key={n}>{n>0&&<span className="l12-or"> / </span>}{article&&<span className={'l12-article l12-'+article}>{article}</span>}<strong>{rest.split('|').map((piece,i)=><Fragment key={i}>{i>0&&<span className="l12-sep">|</span>}{piece}</Fragment>)}</strong></Fragment>;
 })}{plural&&<small className={'l12-plural'+(plural.length>14?' long':'')} title="çoğul">{plural}</small>}</span>;
}

/** The word's picture, when it has one (the word itself is written next to it). */
export function WordPicture({de,className='l12-word-pic'}:{de:string;className?:string}){
 const picture=wordPicture(de);
 return picture?<span className={className} aria-hidden="true"><RasterArt art={picture} title={de.replace(/\|/g,'')}/></span>:null;
}

export function WordGrid({words,speech,known}:{words:readonly L12Word[];speech:Speech;known?:ReadonlySet<string>}){
 return <ul className="l12-word-grid">{words.map(word=><li key={word[0]} className={'l12-word-tile'+(known?.has(word[0])?' known':'')+(wordPicture(word[0])?' has-pic':'')}>
  {wordPicture(word[0])?<div className="l12-word-media"><WordPicture de={word[0]}/><SayButton text={wordSpeech(word)} speech={speech}/></div>:<SayButton text={wordSpeech(word)} speech={speech}/>}
  <div className="l12-word-text"><GermanWord de={word[0]}/><span className="l12-word-tr"><Rich text={word[1]}/></span></div>
 </li>)}</ul>;
}

const knownKey=(id:string)=>'lernkoko-l12-known:'+id;
export function readKnown(id:string):Set<string>{try{const value=JSON.parse(localStorage.getItem(knownKey(id))??'[]');return new Set(Array.isArray(value)?value.filter(item=>typeof item==='string'):[]);}catch{return new Set();}}
function saveKnown(id:string,known:ReadonlySet<string>){try{localStorage.setItem(knownKey(id),JSON.stringify([...known]));}catch{}}

/** Word cards: see the German word, think, turn the card, then say whether you knew it. */
export function Flashcards({id,words,speech,onClose,onChange}:{id:string;words:readonly L12Word[];speech:Speech;onClose:()=>void;onChange:(known:Set<string>)=>void}){
 const [deck,setDeck]=useState<L12Word[]>(()=>[...words]);const [index,setIndex]=useState(0);const [flipped,setFlipped]=useState(false);
 const [reverse,setReverse]=useState(false);const [round,setRound]=useState({known:0,again:[] as L12Word[]});
 const card=deck[index];const finished=index>=deck.length;
 function answer(knew:boolean){
  if(!card)return;const known=readKnown(id);if(knew)known.add(card[0]);else known.delete(card[0]);saveKnown(id,known);onChange(known);
  setRound(previous=>({known:previous.known+(knew?1:0),again:knew?previous.again:[...previous.again,card]}));setFlipped(false);setIndex(value=>value+1);
 }
 function restart(list:L12Word[]){setDeck(list);setIndex(0);setFlipped(false);setRound({known:0,again:[]});}
 function shuffle(){const list=[...deck];for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}restart(list);}
 return <section className="panel l12-cards" aria-label="Kelime kartları">
  <div className="object-practice-top l12-cards-top"><span className="object-pill"><Layers size={14} aria-hidden="true"/>Kelime kartları</span><span>{Math.min(index+1,deck.length)} / {deck.length}</span><button type="button" className="object-exit" aria-label="Kartları kapat" onClick={onClose}><X size={20}/></button></div>
  <div className="l12-track" aria-hidden="true"><span style={{width:(deck.length?Math.round(index*100/deck.length):0)+'%'}}/></div>
  {finished?<div className="l12-cards-done" role="status">
   <CheckCircle2 size={38} aria-hidden="true"/>
   <h3>Tur bitti!</h3>
   <p><strong>{round.known}</strong> / {deck.length} kelimeyi bildin.{round.again.length?' Bilmediklerini bir tur daha çalış.':' Hepsini bildin, harika!'}</p>
   <div className="object-actions">{round.again.length>0&&<button type="button" className="btn orange" onClick={()=>restart(round.again)}><RotateCcw size={18} aria-hidden="true"/>Bilmediklerimi tekrar et ({round.again.length})</button>}<button type="button" className="btn secondary" onClick={()=>restart([...words])}>Baştan başla</button><button type="button" className="btn" onClick={onClose}>Listeye dön</button></div>
  </div>:<>
   <button type="button" className={'l12-flash'+(flipped?' flipped':'')} aria-live="polite" onClick={()=>setFlipped(value=>!value)}>
    {/* the picture goes with the meaning: on the front when the meaning is asked first, otherwise after turning */}
    {(reverse||flipped)&&<WordPicture de={card[0]} className="l12-flash-pic"/>}
    <span className="l12-card-face">{reverse?<span className="l12-card-tr"><Rich text={card[1]}/></span>:<GermanWord de={card[0]}/>}</span>
    {flipped?<span className="l12-card-back">{reverse?<GermanWord de={card[0]}/>:<Rich text={card[1]}/>}</span>:<small className="l12-card-hint">Düşün, sonra kartı çevirmek için dokun</small>}
   </button>
   <div className="l12-card-tools"><SayButton text={wordSpeech(card)} speech={speech}/><button type="button" className="text-button" onClick={shuffle}><Shuffle size={16} aria-hidden="true"/>Karıştır</button><button type="button" className="text-button" aria-pressed={reverse} onClick={()=>{setReverse(value=>!value);setFlipped(false);}}>{reverse?'Almanca → Türkçe':'Türkçe → Almanca'}</button></div>
   {flipped?<div className="l12-card-answer"><button type="button" className="btn secondary" onClick={()=>answer(false)}><RotateCcw size={18} aria-hidden="true"/>Bilmedim</button><button type="button" className="btn" onClick={()=>answer(true)}><Check size={18} aria-hidden="true"/>Bildim</button></div>
   :<div className="l12-card-answer"><button type="button" className="btn orange" onClick={()=>setFlipped(true)}>Kartı çevir</button></div>}
  </>}
 </section>;
}

/* ---------- Teaching cards ---------- */

/** One teaching card: a title and the blocks under it (a word group is a card of its own). */
export type TeachCard={title?:string;blocks:L12Block[];words?:boolean;intro?:boolean};
/** Splits sections into cards: every sub-heading and every word group starts a new card. */
export function teachingCards(sections:readonly L12Section[]):TeachCard[]{
 const cards:TeachCard[]=[];
 for(const section of sections){
  let current:TeachCard={title:section.title,blocks:[],intro:section.blocks.some(block=>block.t==='h')};
  for(const block of section.blocks){
   if(block.t==='h'){if(current.blocks.length)cards.push(current);current={title:block.text,blocks:[]};}
   else if(block.t==='vocab'){if(current.blocks.length)cards.push(current);cards.push({title:block.title,blocks:[block],words:true});current={blocks:[]};}
   else current.blocks.push(block);
  }
  if(current.blocks.length)cards.push(current);
 }
 return cards;
}

function ExampleLine({text,speech}:{text:string;speech:Speech}){
 const say=exampleSpeech(text);
 return <><Rich text={text}/>{say&&<> <SayButton text={say} speech={speech}/></>}</>;
}

/** A sentence frame (Satzklammer): each row as coloured sentence parts, like the Ev ve Yaşam lessons. */
function SentenceFrames({head,rows,speech}:{head:string[];rows:string[][];speech:Speech}){
 const last=head.length-1;const tone=(j:number)=>j===1?' housing-part-verb':j===last&&last>1?' housing-part-infinitive':'';
 return <div className="l12-frames">
  <div className="l12-frame-row l12-frame-head" aria-hidden="true"><div className="housing-sentence-frame">{head.map((cell,j)=><span key={j} className={'l12-frame-label'+tone(j)}>{cell}</span>)}</div><span className="l12-frame-gap"/></div>
  {rows.map((row,i)=>{const say=frameSpeech(row);return <div className="l12-frame-row" key={i}>
   <div className="housing-sentence-frame" lang="de" dir="ltr">{row.map((cell,j)=><div key={j} className={'housing-sentence-part'+tone(j)+(cell.trim()==='–'?' l12-part-empty':'')}><strong>{cell.trim()==='–'?'—':cell}</strong><span className="l12-sr">{head[j]}</span></div>)}</div>
   {say?<SayButton text={say} speech={speech} label="Cümleyi dinle"/>:<span className="l12-frame-gap"/>}
  </div>;})}
 </div>;
}

export function LessonBlocks({blocks,speech,known}:{blocks:readonly L12Block[];speech:Speech;known?:ReadonlySet<string>}){
 return <>{blocks.map((block,i)=>{
  switch(block.t){
   case 'p':return <p key={i} className="l12-p"><ExampleLine text={block.text} speech={speech}/></p>;
   case 'h':return <h3 key={i} className="l12-h">{block.text}</h3>;
   case 'note':return <p key={i} className="housing-rule-reminder l12-note"><Lightbulb size={18} aria-hidden="true"/><span><Rich text={block.text}/></span></p>;
   case 'list':{const List=block.ordered?'ol':'ul';return <List key={i} className={'l12-list'+(block.ordered?' housing-build-steps':'')}>{block.items.map((item,j)=><li key={j}><ExampleLine text={item} speech={speech}/></li>)}</List>;}
   case 'letter':return <div key={i} className="l12-mail" lang="de" dir="ltr">{block.lines.map((line,j)=><p key={j}>{line}</p>)}</div>;
   case 'listen':return null;
   case 'vocab':return <Fragment key={i}>{block.lead&&<p className="l12-p"><Rich text={block.lead}/></p>}<WordGrid words={block.words} speech={speech} known={known}/></Fragment>;
   case 'table':return block.frame?<SentenceFrames key={i} head={block.head} rows={block.rows} speech={speech}/>
    :<div key={i} className="housing-lesson-table-wrap"><table className="housing-lesson-table l12-table"><thead><tr>{block.head.map((cell,j)=><th key={j} scope="col">{cell}</th>)}</tr></thead><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k}><Rich text={cell}/></td>)}</tr>)}</tbody></table></div>;
  }
 })}</>;
}

export function TeachingCard({card,number,speech,known}:{card:TeachCard;number?:number;speech:Speech;known?:ReadonlySet<string>}){
 return <article className={'panel housing-teaching-card l12-teach'+(card.words?' l12-teach-words':'')+(card.intro?' l12-teach-intro':'')}>
  {card.title&&<h2>{number!==undefined&&<span className="l12-teach-number">{number}</span>}{card.title}</h2>}
  <LessonBlocks blocks={card.blocks} speech={speech} known={known}/>
 </article>;
}

/* ---------- Exercises ---------- */

/** Saved answers for one exercise (in this browser): the values and whether it was checked. */
type Saved={v:Record<number,L12Value>;checked:boolean};
const storageKey=(id:string)=>'lernkoko-l12:'+id;
export const SCORE_KEY='lernkoko-l12-scores';
export function readScores():L12ScoreMap{try{const value=JSON.parse(localStorage.getItem(SCORE_KEY)??'{}');return value&&typeof value==='object'?value as L12ScoreMap:{};}catch{return {};}}
function saveScore(id:string,score:L12ScoreMap[string]|null){try{const all=readScores();if(score)all[id]=score;else delete all[id];localStorage.setItem(SCORE_KEY,JSON.stringify(all));}catch{}}

const gapWidth=(answers:string[])=>Math.min(22,Math.max(3,...answers.map(answer=>answer.length))+2)+'ch';
const formatPoints=(value:number)=>String(value).replace('.',',');
type Typing={el:HTMLInputElement|HTMLTextAreaElement;apply:(value:string)=>void}|null;
const UMLAUTS=['ä','ö','ü','ß','Ä','Ö','Ü'];

/** One exercise, the way the site's practice screens look: the task, the answers, „Kontrol et", feedback, next. */
export function ExerciseView({exercise,number,total,onScore,onNext,nextLabel}:{exercise:L12Exercise;number:number;total:number;onScore:()=>void;onNext:()=>void;nextLabel:string}){
 const [values,setValues]=useState<Record<number,L12Value>>({});
 const [checked,setChecked]=useState(false);const [showKey,setShowKey]=useState(false);
 const [loadedFor,setLoadedFor]=useState<string|null>(null);const typing=useRef<Typing>(null);
 useEffect(()=>{let saved:Saved|null=null;try{saved=JSON.parse(localStorage.getItem(storageKey(exercise.id))??'null') as Saved|null;}catch{}setValues(saved&&typeof saved==='object'?saved.v??{}:{});setChecked(!!saved?.checked);setShowKey(false);setLoadedFor(exercise.id);},[exercise.id]);
 useEffect(()=>{if(loadedFor!==exercise.id)return;try{localStorage.setItem(storageKey(exercise.id),JSON.stringify({v:values,checked} satisfies Saved));}catch{}},[values,checked,loadedFor,exercise.id]);
 const set=(index:number,value:L12Value)=>{setValues(previous=>({...previous,[index]:value}));if(checked)setChecked(false);};
 const checkable=exercise.items.some(item=>item.k!=='open');const writes=exercise.items.some(item=>item.k==='gap'||item.k==='sentence'||item.k==='open');
 const sound=useAnswerSound();
 const score=gradeExercise(exercise,values);const perfect=score.total>0&&score.right===score.total;
 function check(){sound.prepare();if(perfect)sound.correct();else sound.wrong();setChecked(true);saveScore(exercise.id,{right:score.right,total:score.total,points:score.points});onScore();requestAnimationFrame(()=>document.getElementById('l12-feedback')?.scrollIntoView({block:'nearest',behavior:'smooth'}));}
 function reset(){setValues({});setChecked(false);setShowKey(false);saveScore(exercise.id,null);onScore();try{localStorage.removeItem(storageKey(exercise.id));}catch{}}
 function insert(letter:string){
  const target=typing.current;if(!target||!target.el.isConnected)return;const el=target.el;
  const start=el.selectionStart??el.value.length;const end=el.selectionEnd??start;
  target.apply(el.value.slice(0,start)+letter+el.value.slice(end));
  requestAnimationFrame(()=>{el.focus();el.setSelectionRange(start+letter.length,start+letter.length);});
 }
 const answered=exercise.items.some((item,i)=>{const value=values[i];return Array.isArray(value)?value.some(part=>String(part).trim()):value!==undefined&&value!==null&&String(value).trim()!=='';});
 return <article className="panel object-question l12-exercise" data-l12-exercise={exercise.id} aria-labelledby={'l12-ex-'+exercise.id}>
  <div className="l12-exercise-head"><h2 id={'l12-ex-'+exercise.id} className="l12-exercise-title" lang="de" tabIndex={-1}><span className="l12-sr">Alıştırma {number} / {total}: </span>{exercise.title}</h2>{exercise.points!==undefined&&!exercise.title.includes('Punkte')&&<span className="l12-points">{formatPoints(exercise.points)} Punkte</span>}</div>
  {exercise.hint&&<div className="housing-cue l12-hint paul-box"><p className="paul-box-text"><Rich text={exercise.hint}/></p><PaulHoca pose="tip"/></div>}
  {exercise.reading&&<div className="housing-reading l12-reading" lang="de" dir="ltr">{exercise.reading.title&&<h3>{exercise.reading.title}</h3>}{exercise.reading.lines.map((line,i)=><p key={i}><Rich text={line}/></p>)}</div>}
  {exercise.bank&&<div className="housing-word-bank l12-bank"><small>Kelime kutusu</small><p lang="de" dir="ltr">{exercise.bank.map(word=><span key={word}>{word}</span>)}</p></div>}
  <ol className="l12-items">{exercise.items.map((item,i)=>{const result=checked&&item.k!=='open'?gradeItem(item,values[i]):null;return <li key={i} className={'l12-item l12-k-'+item.k+(result?(result.right===result.total?' ok':' bad'):'')}>
   <span className="l12-item-number" aria-hidden="true">{result?(result.right===result.total?<Check size={15}/>:<X size={15}/>):i+1}</span>
   <div className="l12-item-body"><ItemView item={item} value={values[i]} onChange={value=>set(i,value)} checked={checked} reveal={showKey} index={i} onTyping={(el,apply)=>{typing.current={el,apply};}}/></div>
  </li>;})}</ol>
  {writes&&<div className="umlaut-row l12-umlauts" dir="ltr" aria-label="Özel harfler">{UMLAUTS.map(letter=><button type="button" key={letter} onMouseDown={event=>event.preventDefault()} onClick={()=>insert(letter)}>{letter}</button>)}</div>}
  {showKey&&exercise.key&&<p className="housing-rule-reminder l12-key-note"><Lightbulb size={18} aria-hidden="true"/><span><Rich text={exercise.key}/></span></p>}
  {checked&&checkable?<div id="l12-feedback" tabIndex={-1} className={'object-feedback l12-feedback '+(perfect?'success':'retry')} role="status" aria-live="polite">
   <h2>{perfect?<CheckCircle2 size={23} aria-hidden="true"/>:<RotateCcw size={22} aria-hidden="true"/>} {perfect?'Harika, hepsi doğru!':`${score.right} / ${score.total} doğru`}</h2>
   <p>{perfect?'Bu alıştırma tamam.':'Yanlış olanların altında doğrusu yazıyor. İstersen düzeltip yeniden kontrol et.'}{score.points!==undefined&&exercise.points!==undefined&&<> · <strong>{formatPoints(score.points)} / {formatPoints(exercise.points)} Punkte</strong></>}</p>
   <div className="object-actions"><button type="button" className="btn" onClick={onNext}>{nextLabel}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button></div>
  </div>:<div className="object-actions l12-actions">
   {checkable?<button type="button" className="btn check-button" disabled={!answered} onClick={check}><Check size={18} aria-hidden="true"/>Kontrol et</button>:<button type="button" className="btn" onClick={onNext}>{nextLabel}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></button>}
   <button type="button" className="btn secondary small" aria-pressed={showKey} onClick={()=>setShowKey(value=>!value)}>{showKey?<EyeOff size={17} aria-hidden="true"/>:<Eye size={17} aria-hidden="true"/>}{showKey?'Cevapları gizle':checkable?'Cevap anahtarı':'Örnek cevap'}</button>
   {checkable&&!answered&&<span className="l12-skip"><button type="button" className="text-button" onClick={onNext}>Atla</button></span>}
  </div>}
  {(answered||checked)&&<button type="button" className="text-button l12-reset" onClick={reset}><RotateCcw size={15} aria-hidden="true"/>Bu alıştırmayı sıfırla</button>}
 </article>;
}

function Solution({children}:{children:ReactNode}){return <p className="l12-solution"><span>Doğrusu:</span> <strong lang="de" dir="ltr">{children}</strong></p>;}

function ItemView({item,value,onChange,checked,reveal,index,onTyping}:{item:L12Item;value:L12Value;onChange:(value:L12Value)=>void;checked:boolean;reveal:boolean;index:number;onTyping:(el:HTMLInputElement|HTMLTextAreaElement,apply:(value:string)=>void)=>void}){
 if(item.k==='gap'){
  const given=Array.isArray(value)?value:[];const pieces=item.text.split('___');
  const wrong=checked&&item.answers.some((accepted,i)=>!matchesAnswer(given[i]??'',accepted));
  const change=(i:number,text:string)=>{const next=[...given];next[i]=text;onChange(next);};
  return <><p className="l12-gap-text" lang="de" dir="ltr">{pieces.map((piece,i)=><Fragment key={i}><Rich text={piece}/>{i<pieces.length-1&&<input type="text" className={'l12-gap'+(checked?(matchesAnswer(given[i]??'',item.answers[i])?' ok':' bad'):'')} style={{width:gapWidth(item.answers[i])}} value={given[i]??''} aria-label={'Boşluk '+(i+1)} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} onFocus={event=>onTyping(event.currentTarget,text=>change(i,text))} onChange={event=>change(i,event.target.value)}/>}</Fragment>)}</p>
   {(reveal||wrong)&&<Solution>{item.answers.map(accepted=>accepted[0]).join(' · ')}</Solution>}</>;
 }
 if(item.k==='choice'){
  const chosen=typeof value==='number'?value:null;const twoWay=item.options.length===2;
  return <div className={'l12-choice-row'+(twoWay?' two':'')}><p className="l12-prompt" lang="de" dir="ltr"><Rich text={item.text}/></p><div className="l12-options" role="radiogroup" aria-label={item.text}>{item.options.map((option,i)=><button type="button" key={option} role="radio" aria-checked={chosen===i} lang="de" className={'l12-option'+(chosen===i?' selected':'')+((checked||reveal)&&i===item.answer?' right':'')+(checked&&chosen===i&&i!==item.answer?' wrong':'')} onClick={()=>onChange(i)}>{option}</button>)}</div></div>;
 }
 if(item.k==='sentence'){
  const text=typeof value==='string'?value:'';const wrong=checked&&!matchesAnswer(text,item.answers);
  return <><p className="l12-prompt" lang="de" dir="ltr"><Rich text={item.prompt}/></p><input type="text" className={'writing-input l12-line'+(checked?(wrong?' bad':' ok'):'')} lang="de" dir="ltr" value={text} placeholder="Cümleyi yaz" aria-label={'Cevap '+(index+1)} autoComplete="off" autoCapitalize="sentences" spellCheck={false} onFocus={event=>onTyping(event.currentTarget,onChange)} onChange={event=>onChange(event.target.value)}/>{(reveal||wrong)&&<Solution>{item.answers[0]}</Solution>}</>;
 }
 if(item.k==='pick'){
  const picked=Array.isArray(value)?value:[];
  const toggle=(word:string)=>onChange(picked.includes(word)?picked.filter(entry=>entry!==word):picked.length>=item.need?[...picked.slice(1),word]:[...picked,word]);
  return <><p className="l12-prompt" lang="de" dir="ltr"><strong>{item.prompt}</strong> <small className="l12-pick-count">{picked.length} / {item.need} seç</small></p><div className="l12-options l12-pick" lang="de" dir="ltr">{item.options.map(word=><button type="button" key={word} aria-pressed={picked.includes(word)} className={'l12-option'+(picked.includes(word)?' selected':'')+(checked&&picked.includes(word)?(item.accept.includes(word)?' right':' wrong'):'')} onClick={()=>toggle(word)}>{word}</button>)}</div>{(reveal||(checked&&gradeItem(item,picked).right===0))&&<Solution>{item.accept.join(', ')}</Solution>}</>;
 }
 const text=typeof value==='string'?value:'';
 return <><p className="l12-prompt" lang="de" dir="ltr"><Rich text={item.prompt}/></p><textarea className="writing-input l12-open" lang="de" dir="ltr" rows={item.sample&&item.sample.includes('\n')?6:4} value={text} placeholder="Buraya yaz…" aria-label={item.prompt.replace(/\*/g,'')} spellCheck={false} onFocus={event=>onTyping(event.currentTarget,onChange)} onChange={event=>onChange(event.target.value)}/>{reveal&&item.sample&&<div className="l12-sample"><span>Örnek cevap</span><p lang="de" dir="ltr">{item.sample}</p></div>}</>;
}
