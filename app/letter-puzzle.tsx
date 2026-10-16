'use client';
import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {ArrowRight,Lightbulb} from 'lucide-react';
import {makeLetterPuzzle,makeLetterBank,remainingLetterChoices,completeLetterPuzzle,placedLetters,readLetterBankDraft,readPuzzleExtras,letterFits,tileForLetter,scoredLetterAnswer,hintLimit,noMistakes,noHints,type LetterPlacements,type PuzzleMistakes,type PuzzleHints} from '@/lib/letter-puzzle';
import {vaultText,type VaultLanguage} from '@/lib/object-vault-copy';
import {puzzleText} from '@/lib/article-logic';
import type {LearningLanguage} from '@/lib/learning-language';

/**
 * Fill the gaps letter by letter. A tapped letter jumps into the next empty box; a right letter pops in,
 * a wrong one shakes and goes back (the question then counts as a mistake). Tapping a filled box sends its
 * letter back, the hint places the next right letter, and the answer is checked as soon as every box is full.
 */
export function LetterPuzzle({answer,storageKey,language,onChange,onSubmit,busy=false,locked=false,result,strictCase=false,course='de'}:{answer:string;course?:LearningLanguage;storageKey:string;language:VaultLanguage;onChange:(answer:string)=>void;onSubmit:(answer:string)=>void;busy?:boolean;locked?:boolean;result?:boolean;strictCase?:boolean}){
 const text=(key:Parameters<typeof vaultText>[1],params?:Record<string,string|number>)=>vaultText(language,key,params,course);
 const puzzle=useMemo(()=>makeLetterPuzzle(answer,storageKey,course),[answer,storageKey,course]);
 const bank=useMemo(()=>makeLetterBank(puzzle,storageKey,course),[puzzle,storageKey,course]);
 const [placements,setPlacements]=useState<LetterPlacements>({});const [ready,setReady]=useState(false);const [active,setActive]=useState<number|undefined>(puzzle.editable[0]);
 const [mistakes,setMistakes]=useState<PuzzleMistakes>(noMistakes);const [hints,setHints]=useState<PuzzleHints>(noHints);
 const [shake,setShake]=useState<{index:number;letter:string;turn:number}|null>(null);const [note,setNote]=useState(false);
 const fields=useRef(new Map<number,HTMLButtonElement>());const id=useId();const sent=useRef(false);const turn=useRef(0);
 const letters=placedLetters(placements,bank);const completed=completeLetterPuzzle(puzzle,letters);const unavailable=busy||locked||!ready;
 const scored=scoredLetterAnswer(puzzle,letters,mistakes);
 const choices=remainingLetterChoices(bank,placements);const hintsLeft=hintLimit(puzzle)-hints.used;
 useEffect(()=>{const saved=readLetterBankDraft(puzzle,bank,storageKey);const extras=readPuzzleExtras(puzzle,storageKey);setPlacements(saved);setMistakes(extras.mistakes);setHints(extras.hints);setActive(puzzle.editable.find(index=>!saved[index])??puzzle.editable[0]);sent.current=false;setReady(true);},[puzzle,bank,storageKey]);
 useEffect(()=>{onChange(completed.complete?scored:'');},[completed.complete,scored,onChange]);
 useEffect(()=>{if(!ready)return;try{if(result!==undefined)localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,JSON.stringify({version:3,slots:placements,mistakes,hints}));}catch{}},[placements,mistakes,hints,storageKey,result,ready]);
 // Every box full: a short moment to see the last letter, then the answer is checked by itself.
 const submitLatest=useRef(()=>{});submitLatest.current=()=>onSubmit(scored);
 useEffect(()=>{
  if(!completed.complete){sent.current=false;return;}
  if(unavailable||sent.current||result!==undefined)return;
  const timer=setTimeout(()=>{sent.current=true;submitLatest.current();},520);
  return()=>clearTimeout(timer);
 },[completed.complete,unavailable,result]);
 useEffect(()=>{if(!shake)return;const timer=setTimeout(()=>setShake(current=>current?.turn===shake.turn?null:current),520);return()=>clearTimeout(timer);},[shake]);
 function focus(index:number|undefined){if(index!==undefined)requestAnimationFrame(()=>fields.current.get(index)?.focus({preventScroll:true}));}
 /** The box a letter goes into: the chosen box if it is empty, otherwise the first empty one. */
 function target(){return active!==undefined&&!placements[active]?active:puzzle.editable.find(index=>!placements[index]);}
 function place(index:number,tokenId:string,hinted=false){
  const next={...placements,[index]:tokenId};setPlacements(next);
  if(hinted)setHints(previous=>({used:previous.used+1,boxes:[...previous.boxes.filter(box=>box!==index),index]}));
  const nextIndex=puzzle.editable.find(item=>item>index&&!next[item])??puzzle.editable.find(item=>!next[item]);setActive(nextIndex??index);focus(nextIndex??index);
 }
 function miss(index:number,letter:string){
  turn.current++;setShake({index,letter,turn:turn.current});setNote(true);
  setMistakes(previous=>({count:previous.count+1,first:previous.first??{index,letter},boxes:previous.boxes.includes(index)?previous.boxes:[...previous.boxes,index]}));
 }
 function pick(tokenId:string){
  if(unavailable)return;const index=target();if(index===undefined)return;
  const token=bank.find(item=>item.id===tokenId);if(!token||Object.values(placements).includes(tokenId))return;
  if(letterFits(puzzle,index,token.letter,strictCase,course))place(index,tokenId);else miss(index,token.letter);
 }
 /** A filled box sends its letter back to the bank and becomes the box to fill. */
 function giveBack(index:number){
  if(unavailable)return;
  if(!placements[index]){setActive(index);return;}
  const next={...placements};delete next[index];setPlacements(next);setActive(index);focus(index);
 }
 function hint(){
  if(unavailable||hintsLeft<=0)return;const index=target();if(index===undefined)return;
  const tile=tileForLetter(choices,puzzle.parts[index].character,course);if(tile)place(index,tile.id,true);
 }
 /** Typing on a keyboard works like tapping the matching tile. */
 function typeLetter(key:string){
  const index=target();if(index===undefined)return;
  const needed=puzzle.parts[index].character;
  const right=letterFits(puzzle,index,key,strictCase,course)?tileForLetter(choices,strictCase?key:needed,course):undefined;
  if(right){pick(right.id);return;}
  if(tileForLetter(choices,key,course))miss(index,key);else{turn.current++;setShake({index,letter:key,turn:turn.current});}
 }
 function removeLast(){
  if(unavailable)return;
  const filled=puzzle.editable.filter(index=>placements[index]);if(!filled.length)return;
  const before=active!==undefined?filled.filter(index=>index<=active):filled;const index=(before.length?before:filled)[(before.length?before:filled).length-1];
  giveBack(index);
 }
 const keyHandler=useRef<(event:KeyboardEvent)=>void>(()=>{});
 keyHandler.current=event=>{
  if(unavailable||event.metaKey||event.ctrlKey||event.altKey)return;
  const element=event.target as HTMLElement|null;if(element&&(/^(INPUT|SELECT|TEXTAREA)$/.test(element.tagName)||element.isContentEditable))return;
  if(event.key.length===1&&/\p{L}/u.test(event.key)){event.preventDefault();typeLetter(event.key);}
  else if(event.key==='Backspace'){event.preventDefault();removeLast();}
 };
 useEffect(()=>{const listener=(event:KeyboardEvent)=>keyHandler.current(event);window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);},[]);
 const words:typeof puzzle.parts[]=[];let group:typeof puzzle.parts=[];for(const part of puzzle.parts){if(/\s/.test(part.character)){if(group.length)words.push(group);group=[];}else group.push(part);}if(group.length)words.push(group);
 const done=completed.complete&&!locked;
 return <form className={'letter-puzzle letter-bank-puzzle'+(done?' complete':'')} onSubmit={event=>{event.preventDefault();if(completed.complete&&!unavailable){sent.current=true;onSubmit(scored);}}}>
  {!locked&&<p id={id+'-hint'} className="puzzle-hint">{text('letterBankHint')}</p>}
  <fieldset className="puzzle-board" dir="ltr" lang={course} aria-describedby={id+'-hint '+id+'-progress'}><legend className="sr-only" lang={language}>{text('puzzlePrompt')}</legend>
   {words.map((word,number)=><span className="puzzle-word" key={number}>{word.map(part=>{
    if(!part.editable)return <span key={part.index} className={'puzzle-letter '+(/[\p{L}\p{N}]/u.test(part.character)?'puzzle-given':'puzzle-punctuation')} aria-label={/[\p{L}\p{N}]/u.test(part.character)?text('puzzleGiven',{letter:part.character}):undefined}>{part.character}</span>;
    const value=letters[part.index];const shaking=shake?.index===part.index;const order=puzzle.editable.indexOf(part.index);
    const state=result!==undefined?(value&&letterFits(puzzle,part.index,value,strictCase,course)?'right':'wrong'):value?'filled':'';
    return <button key={part.index} ref={node=>{if(node)fields.current.set(part.index,node);else fields.current.delete(part.index);}} type="button"
     className={'puzzle-letter puzzle-empty '+state+(active===part.index&&!locked&&!value?' active':'')+(shaking?' shake':'')+(mistakes.boxes.includes(part.index)?' missed':'')+(hints.boxes.includes(part.index)&&value?' hinted':'')}
     style={done?{animationDelay:order*45+'ms'}:undefined} disabled={unavailable} aria-pressed={active===part.index}
     aria-label={text('puzzleLetter',{n:order+1,total:puzzle.editable.length})+(value?': '+value:'')} data-puzzle-index={part.index}
     onClick={()=>giveBack(part.index)}
     onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=puzzle.editable[order+(event.key==='ArrowRight'?1:-1)];if(next!==undefined){setActive(next);focus(next);}}else if(event.key==='Backspace'||event.key==='Delete'){event.preventDefault();event.stopPropagation();giveBack(part.index);}}}>
     {shaking&&!value?<span className="puzzle-wrong-letter" aria-hidden="true">{shake.letter}</span>:value||<span aria-hidden="true">_</span>}
    </button>;
   })}</span>)}
  </fieldset>
  <div className="puzzle-meta">
   <p id={id+'-progress'} className="puzzle-letter-progress" role="status">{text('puzzleFilled',{n:completed.filled,total:puzzle.editable.length})}{mistakes.count>0&&<span className="puzzle-mistakes"> · {text('puzzleMistakes',{n:mistakes.count})}</span>}</p>
   {!locked&&<button type="button" className="puzzle-hint-button" disabled={unavailable||hintsLeft<=0||completed.complete} onClick={hint} aria-label={text('puzzleHintAria',{n:hintsLeft})} title={text('puzzleHintAria',{n:hintsLeft})}><Lightbulb size={15} aria-hidden="true"/>{text('puzzleHintButton')}<span className="puzzle-hint-count" aria-hidden="true">{hintsLeft}</span></button>}
  </div>
  {note&&!locked&&<p className="puzzle-mistake-note" role="alert">{text('puzzleMistakeNote')}</p>}
  {!locked&&choices.length>0&&<div className="letter-bank-wrap"><div className="letter-bank-heading"><strong>{text('letterBank')}</strong></div>
   <div className="letter-bank" role="group" aria-label={text('letterBank')} dir="ltr" lang={course}>{choices.map(choice=><button type="button" key={choice.letter} className="letter-tile" disabled={unavailable} data-letter={choice.letter} data-token-id={choice.id} aria-label={text('puzzleCopies',{letter:choice.letter,n:choice.count})} onClick={()=>pick(choice.id)}><span>{choice.letter}</span>{choice.count>1&&<small className="letter-tile-count" aria-hidden="true">{choice.count}</small>}</button>)}</div>
  </div>}
  {!locked&&<p className="puzzle-keyboard-tip">{puzzleText(language,'keyboardTip')}</p>}
  {!locked&&<button type="submit" className="btn check-button" disabled={unavailable||!completed.complete}>{text('checkAnswer')}<ArrowRight size={18}/></button>}
 </form>;
}
