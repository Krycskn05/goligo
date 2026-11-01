'use client';
import {useEffect} from 'react';

/**
 * Tap a word row to hear it (the learner asked, 2 November 2026: "reading it when I tap the row is better than the
 * speaker"). On every lesson page a word or phrase row with exactly one listen button (`.l12-say`) reads aloud
 * when it is tapped anywhere; the speaker icon stays as a sign that the row can be heard. Rows with answer fields,
 * choice buttons or two listen buttons (Sie / du tables) are left alone, and so are taps on links and buttons.
 */
export const TAP_ROWS='.l1a-phrase,.l15-word,.l12-word-tile,.l1a-table tbody tr,.l1a-say-list li,.l1a-pos-row';
const SKIP='button,a,input,select,textarea,label,summary,[role="button"],[contenteditable="true"]';

/** The row's only listen button, or null when the row is not a plain word row. */
export function rowSayButton(row:Element):HTMLButtonElement|null{
 if(row.querySelector('input,select,textarea'))return null;
 const buttons=row.querySelectorAll('button');
 if(buttons.length!==1)return null;
 const button=buttons[0];
 return button.classList.contains('l12-say')?button:null;
}

function rowAt(target:EventTarget|null):HTMLElement|null{
 if(!(target instanceof Element)||target.closest(SKIP))return null;
 const row=target.closest<HTMLElement>(TAP_ROWS);
 return row&&rowSayButton(row)?row:null;
}

export function TapToSay(){
 useEffect(()=>{
  // Marks a row as tappable (pointer cursor, soft highlight) the first time the pointer or a finger reaches it.
  const mark=(event:PointerEvent)=>{rowAt(event.target)?.classList.add('tap-say');};
  const tap=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0)return;
   const row=rowAt(event.target);if(!row)return;
   if(window.getSelection()?.toString().trim())return; // selecting text to copy, not tapping
   const button=rowSayButton(row);
   if(button&&!button.disabled)button.click();
  };
  document.addEventListener('pointerover',mark);
  document.addEventListener('click',tap);
  return()=>{document.removeEventListener('pointerover',mark);document.removeEventListener('click',tap);};
 },[]);
 return null;
}
