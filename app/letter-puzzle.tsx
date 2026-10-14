'use client';
import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {ArrowRight,Undo2} from 'lucide-react';
import {makeLetterPuzzle,makeLetterBank,remainingLetterChoices,completeLetterPuzzle,placedLetters,readLetterBankDraft,type LetterPlacements} from '@/lib/letter-puzzle';
import {vaultText,type VaultLanguage} from '@/lib/object-vault-copy';
import {puzzleText} from '@/lib/article-logic';
import type {LearningLanguage} from '@/lib/learning-language';

export function LetterPuzzle({answer,storageKey,language,onChange,onSubmit,busy=false,locked=false,result,strictCase=false,course='de'}:{answer:string;course?:LearningLanguage;storageKey:string;language:VaultLanguage;onChange:(answer:string)=>void;onSubmit:(answer:string)=>void;busy?:boolean;locked?:boolean;result?:boolean;strictCase?:boolean}){
 const text=(key:Parameters<typeof vaultText>[1],params?:Record<string,string|number>)=>vaultText(language,key,params,course);
 const puzzle=useMemo(()=>makeLetterPuzzle(answer,storageKey,course),[answer,storageKey,course]);
 const bank=useMemo(()=>makeLetterBank(puzzle,storageKey,course),[puzzle,storageKey,course]);
 const [placements,setPlacements]=useState<LetterPlacements>({});const [ready,setReady]=useState(false);const [active,setActive]=useState<number|undefined>(puzzle.editable[0]);
 const fields=useRef(new Map<number,HTMLButtonElement>());const id=useId();
 const letters=placedLetters(placements,bank);const completed=completeLetterPuzzle(puzzle,letters);const unavailable=busy||locked||!ready;const used=new Set(Object.values(placements));
 const choices=remainingLetterChoices(bank,placements);
 useEffect(()=>{const saved=readLetterBankDraft(puzzle,bank,storageKey);setPlacements(saved);setActive(puzzle.editable.find(index=>!saved[index])??puzzle.editable[0]);setReady(true);},[puzzle,bank,storageKey]);
 useEffect(()=>{onChange(completed.complete?completed.answer:'');},[completed.complete,completed.answer,onChange]);
 useEffect(()=>{if(!ready)return;try{if(result!==undefined)localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,JSON.stringify({version:2,slots:placements}));}catch{}},[placements,storageKey,result,ready]);
 function focus(index:number|undefined){if(index!==undefined)requestAnimationFrame(()=>fields.current.get(index)?.focus());}
 function pick(tokenId:string){if(unavailable||active===undefined||used.has(tokenId))return;const next={...placements,[active]:tokenId};setPlacements(next);const nextIndex=puzzle.editable.find(index=>!next[index])??active;setActive(nextIndex);focus(nextIndex);}
 function remove(){if(unavailable||active===undefined)return;const next={...placements};delete next[active];setPlacements(next);focus(active);}
 /** Typing on a keyboard places the matching letter tile (exact case first). */
 function typeLetter(key:string){const match=choices.find(choice=>choice.letter===key)??choices.find(choice=>choice.letter.toLocaleLowerCase(course)===key.toLocaleLowerCase(course));if(match)pick(match.id);}
 const keyHandler=useRef<(event:KeyboardEvent)=>void>(()=>{});
 keyHandler.current=event=>{
  if(unavailable||event.metaKey||event.ctrlKey||event.altKey)return;
  const target=event.target as HTMLElement|null;if(target&&(/^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName)||target.isContentEditable))return;
  if(event.key.length===1&&/\p{L}/u.test(event.key)){event.preventDefault();typeLetter(event.key);}
  else if(event.key==='Backspace'){event.preventDefault();remove();}
 };
 useEffect(()=>{const listener=(event:KeyboardEvent)=>keyHandler.current(event);window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);},[]);
 const words:typeof puzzle.parts[]=[];let group:typeof puzzle.parts=[];for(const part of puzzle.parts){if(/\s/.test(part.character)){if(group.length)words.push(group);group=[];}else group.push(part);}if(group.length)words.push(group);
 const compare=(left:string,right:string)=>strictCase?left===right:left.toLocaleLowerCase(course)===right.toLocaleLowerCase(course);
 return <form className="letter-puzzle letter-bank-puzzle" onSubmit={event=>{event.preventDefault();if(completed.complete&&!unavailable)onSubmit(completed.answer);}}>
  <p id={id+'-hint'} className="puzzle-hint">{text('letterBankHint')}</p>
  <fieldset className="puzzle-board" dir="ltr" lang={course} aria-describedby={id+'-hint '+id+'-progress'}><legend className="sr-only" lang={language}>{text('puzzlePrompt')}</legend>
   {words.map((word,number)=><span className="puzzle-word" key={number}>{word.map(part=>part.editable?<button key={part.index} ref={node=>{if(node)fields.current.set(part.index,node);else fields.current.delete(part.index);}} type="button" className={'puzzle-letter puzzle-empty '+(active===part.index&&!locked?'active ':'')+(result!==undefined?(compare(letters[part.index]??'',part.character)?'right':'wrong'):'')} disabled={unavailable} aria-pressed={active===part.index} aria-label={text('puzzleLetter',{n:puzzle.editable.indexOf(part.index)+1,total:puzzle.editable.length})+(letters[part.index]?': '+letters[part.index]:'')} data-puzzle-index={part.index} onClick={()=>setActive(part.index)} onKeyDown={event=>{const at=puzzle.editable.indexOf(part.index);if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=puzzle.editable[at+(event.key==='ArrowRight'?1:-1)];if(next!==undefined){setActive(next);focus(next);}}else if(event.key==='Backspace'||event.key==='Delete'){event.preventDefault();event.stopPropagation();remove();}}}>{letters[part.index]||<span aria-hidden="true">_</span>}</button>:<span key={part.index} className={'puzzle-letter '+(/[\p{L}\p{N}]/u.test(part.character)?'puzzle-given':'puzzle-punctuation')} aria-label={/[\p{L}\p{N}]/u.test(part.character)?text('puzzleGiven',{letter:part.character}):undefined}>{part.character}</span>)}</span>)}
  </fieldset>
  <div className="puzzle-meta"><p id={id+'-progress'} className="puzzle-letter-progress" role="status">{text('puzzleFilled',{n:completed.filled,total:puzzle.editable.length})}</p>{!locked&&<button type="button" className="puzzle-remove text-button" disabled={unavailable||active===undefined||!placements[active]} onClick={remove}><Undo2 size={14}/>{text('removeLetter')}</button>}</div>
  {!locked&&choices.length>0&&<div className="letter-bank-wrap"><div className="letter-bank-heading"><strong>{text('letterBank')}</strong></div>
   <div className="letter-bank" role="group" aria-label={text('letterBank')} dir="ltr" lang={course}>{choices.map(choice=><button type="button" key={choice.letter} className="letter-tile" disabled={unavailable} data-letter={choice.letter} data-token-id={choice.id} aria-label={text('puzzleCopies',{letter:choice.letter,n:choice.count})} onClick={()=>pick(choice.id)}><span>{choice.letter}</span>{choice.count>1&&<small className="letter-tile-count" aria-hidden="true">{choice.count}</small>}</button>)}</div>
  </div>}
  {!locked&&<p className="puzzle-keyboard-tip">{puzzleText(language,'keyboardTip')}</p>}
  {!locked&&<button type="submit" className="btn check-button" disabled={unavailable||!completed.complete}>{text('checkAnswer')}<ArrowRight size={18}/></button>}
 </form>;
}
