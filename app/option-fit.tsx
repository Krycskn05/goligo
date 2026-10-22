'use client';
import {useEffect} from 'react';

const BOXES='.picture-word-options';
const WORDS='.picture-option-word';
// A German article and a noun of one or two words (die Pommes frites); longer phrases wrap between their words.
const ARTICLE=/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+(\S+(?:\s\S+)?)$/;

/**
 * The text of an answer choice. "die Zitronenpresse" is drawn as article + noun, so a line can only break between
 * the two, never inside a word (the learner asked, 22 October 2026: "Zitronenpress / e" broke in the middle).
 */
export function OptionText({text,className='picture-option-word',lang='de',dir='ltr'}:{text:string;className?:string;lang?:string;dir?:string}){
 const parts=lang==='de'?ARTICLE.exec(text):null;
 return <span className={className} lang={lang} dir={dir}>{parts?<><span className="option-article">{parts[1]}</span> <span className="option-noun">{parts[2]}</span></>:text}</span>;
}

// Tidy steps, tried in this order until every choice fits; all four choices always get the same step and size:
// 1. one line (a little smaller if needed) → 2. the article above the noun → 3. one choice per row (full width).
const STEPS:{stacked:boolean;column:boolean;smallest:(base:number)=>number}[]=[
 {stacked:false,column:false,smallest:base=>Math.round(base*0.85)},
 {stacked:true,column:false,smallest:base=>Math.round(base*0.75)},
 {stacked:false,column:true,smallest:base=>Math.round(base*0.8)},
 {stacked:true,column:true,smallest:()=>12},
];
export function fitOptions(box:HTMLElement){
 const words=[...box.querySelectorAll<HTMLElement>(WORDS)];
 if(!words.length)return;
 const set=(size?:number)=>words.forEach(word=>{if(size)word.style.fontSize=size+'px';else word.style.removeProperty('font-size');});
 const over=()=>words.some(word=>word.scrollWidth>word.clientWidth+1);
 box.classList.remove('options-stacked','options-column');set();
 const base=parseFloat(getComputedStyle(words[0]).fontSize)||16;
 for(const step of STEPS){
  box.classList.toggle('options-stacked',step.stacked);box.classList.toggle('options-column',step.column);set();
  let size=base;const smallest=Math.max(12,step.smallest(base));
  while(over()&&size>smallest){size-=1;set(size);}
  if(!over())return;
 }
}

/** Keeps every set of answer choices on the page tidy: when choices appear, change, get a tick or the screen turns. */
export function OptionFit(){
 useEffect(()=>{
  const signature=(box:HTMLElement)=>[...box.querySelectorAll(WORDS)].map(word=>word.textContent).join('|')+'#'+box.querySelectorAll('svg').length+'@'+Math.round(box.getBoundingClientRect().width);
  const check=(box:HTMLElement)=>{const next=signature(box);if(box.dataset.optionFit!==next){fitOptions(box);box.dataset.optionFit=signature(box);}};
  const watched=new WeakSet<Element>();
  const resize=new ResizeObserver(entries=>entries.forEach(entry=>check(entry.target as HTMLElement)));
  const scan=()=>document.querySelectorAll<HTMLElement>(BOXES).forEach(box=>{check(box);if(!watched.has(box)){watched.add(box);resize.observe(box);}});
  let queued=0;const later=()=>{if(!queued)queued=requestAnimationFrame(()=>{queued=0;scan();});};
  const changes=new MutationObserver(later);
  changes.observe(document.body,{childList:true,subtree:true,characterData:true});
  scan();void document.fonts?.ready.then(()=>document.querySelectorAll<HTMLElement>(BOXES).forEach(box=>{fitOptions(box);box.dataset.optionFit=signature(box);}));
  return()=>{changes.disconnect();resize.disconnect();if(queued)cancelAnimationFrame(queued);};
 },[]);
 return null;
}
