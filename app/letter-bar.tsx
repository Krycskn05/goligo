'use client';
import {useEffect,useRef,useState} from 'react';

/**
 * Special German letters (the learner asked, 30 October 2026: "ß and the umlauts are hard to type on my tablet").
 * While a German text box has the focus — an input or textarea whose own lang, or a parent's, is German — a small row
 * ä ö ü ß Ä Ö Ü sits at the bottom of the visible screen, right above the on-screen keyboard. A tap writes the letter
 * where the cursor is; the box keeps the focus, so the keyboard stays open. The page scrolls a little when the box
 * would be under the row. Boxes that bring their own row (`.umlaut-row`: Lektion 12, Ev ve Yaşam, the study
 * screens) are left alone. Mounted once for the whole site in app/layout.tsx.
 */
export const GERMAN_LETTERS=['ä','ö','ü','ß','Ä','Ö','Ü'] as const;
type Field=HTMLInputElement|HTMLTextAreaElement;
const TEXT_TYPES=new Set(['text','search']);

/** A German text box the learner writes into. The page's own <html lang> does not count, only the box and its parents. */
export function isGermanField(el:EventTarget|null):el is Field{
 if(typeof HTMLElement==='undefined'||!(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement))return false;
 if(el instanceof HTMLInputElement&&!TEXT_TYPES.has(el.type))return false;
 if(el.readOnly||el.disabled||el.inputMode==='numeric'||el.hasAttribute('data-no-letters'))return false;
 for(let node:Element|null=el;node&&node!==document.documentElement;node=node.parentElement){
  const lang=node.getAttribute('lang');if(lang)return lang.toLowerCase().startsWith('de');
 }
 return false;
}
/** The box already has its own letter row next to it. */
function hasOwnRow(el:Field){return !!el.closest('form,article,section,.panel,.practice-shell')?.querySelector('.umlaut-row');}

/** Writes a letter at the cursor the way typing does, so React's onChange sees it. */
export function writeLetter(el:Field,letter:string){
 const start=el.selectionStart??el.value.length,end=el.selectionEnd??start;
 const value=el.value.slice(0,start)+letter+el.value.slice(end);
 if(el.maxLength>0&&value.length>el.maxLength)return false;
 const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
 Object.getOwnPropertyDescriptor(proto,'value')?.set?.call(el,value);
 el.dispatchEvent(new Event('input',{bubbles:true}));
 const at=start+letter.length;try{el.setSelectionRange(at,at);}catch{}
 return true;
}

export function LetterBar(){
 const [field,setField]=useState<Field|null>(null);
 const [top,setTop]=useState<number|null>(null);
 const bar=useRef<HTMLDivElement>(null);const fieldRef=useRef<Field|null>(null);
 useEffect(()=>{
  let timer=0;
  const pick=(target:EventTarget|null)=>isGermanField(target)&&!hasOwnRow(target)?target:null;
  const onIn=(event:FocusEvent)=>{window.clearTimeout(timer);const next=pick(event.target);if(next||!bar.current?.contains(event.target as Node))setField(next);};
  // A tap on another part of the page: hide once the focus has really gone (not while it moves between boxes).
  const onOut=()=>{window.clearTimeout(timer);timer=window.setTimeout(()=>setField(pick(document.activeElement)),150);};
  document.addEventListener('focusin',onIn);document.addEventListener('focusout',onOut);
  return ()=>{window.clearTimeout(timer);document.removeEventListener('focusin',onIn);document.removeEventListener('focusout',onOut);};
 },[]);
 useEffect(()=>{
  fieldRef.current=field;
  if(!field){setTop(null);document.documentElement.style.removeProperty('--letter-bar-space');return;}
  let frame=0;let scrolled=false;
  const place=()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    if(!field.isConnected||!isGermanField(field)){setField(null);return;}
    const view=window.visualViewport;const height=bar.current?.offsetHeight??52;
    const bottom=view?view.offsetTop+view.height:window.innerHeight;
    const at=Math.round(bottom-height-8);setTop(at);
    document.documentElement.style.setProperty('--letter-bar-space',height+16+'px');
    // Keep the box itself above the row (once per focus, so the learner can still scroll freely).
    const box=field.getBoundingClientRect();
    if(!scrolled&&box.bottom>at-8&&box.top>0){scrolled=true;window.scrollBy({top:box.bottom-at+16,behavior:'smooth'});}
   });
  };
  place();
  const view=window.visualViewport;
  view?.addEventListener('resize',place);view?.addEventListener('scroll',place);window.addEventListener('resize',place);
  return ()=>{cancelAnimationFrame(frame);view?.removeEventListener('resize',place);view?.removeEventListener('scroll',place);window.removeEventListener('resize',place);};
 },[field]);
 // A finger on a letter must not take the focus from the box (that would close the keyboard): the letter is written on
 // touchstart and the tap goes no further. Mouse and keyboard use the click.
 useEffect(()=>{
  const row=bar.current;if(!row)return;
  const touch=(event:TouchEvent)=>{const button=(event.target as Element|null)?.closest<HTMLButtonElement>('button[data-letter]');if(!button)return;event.preventDefault();type(button.dataset.letter??'');};
  row.addEventListener('touchstart',touch,{passive:false});
  return ()=>row.removeEventListener('touchstart',touch);
 },[top===null]);
 function type(letter:string){
  const el=fieldRef.current;if(!el||!letter||!el.isConnected)return;
  if(!isGermanField(el)){setField(null);return;} // checked meanwhile (read-only) or gone
  if(document.activeElement!==el)el.focus({preventScroll:true});
  writeLetter(el,letter);
 }
 if(!field||top===null)return null;
 return <div ref={bar} className="letter-bar" role="toolbar" aria-label="ä ö ü ß" lang="de" dir="ltr" style={{top}}>
  {GERMAN_LETTERS.map(letter=><button type="button" key={letter} data-letter={letter} tabIndex={-1} aria-label={letter} onMouseDown={event=>event.preventDefault()} onClick={()=>type(letter)}>{letter}</button>)}
 </div>;
}
