'use client';
import {useCallback,useEffect,useLayoutEffect,useRef,useState,type ReactNode} from 'react';

/**
 * A lesson step on one screen (design proposal, 6 November 2026; the learner asked: "no scrolling down with the mouse",
 * and then: "the topic must not fall onto another page, all of it on one page"). On a tablet or computer the whole
 * step is shown at once: its content is spread over side-by-side columns (all visible, nothing to turn) and, when it is
 * still higher than the room above Geri / İleri, drawn a little smaller (down to `MIN_ZOOM`). Phones keep the normal
 * page. While only a proposal it is switched on with `?tasarim=tek`.
 */
export function oneScreenDesign(){
 if(typeof window==='undefined')return false;
 return new URLSearchParams(window.location.search).get('tasarim')==='tek';
}
const MIN_ZOOM=.72;const COLUMN=330;
export function OneScreenStep({children}:{children:ReactNode}){
 const box=useRef<HTMLDivElement>(null);const flow=useRef<HTMLDivElement>(null);
 const [fit,setFit]=useState<{columns:number;zoom:number;height:number}|null>(null);
 const measure=useCallback(()=>{
  const element=box.current,content=flow.current;if(!element||!content)return;
  if(window.innerWidth<761){setFit(null);return;}
  const top=element.getBoundingClientRect().top+window.scrollY;
  const pager=element.closest('.l1a-card')?.querySelector('.l1a-pager') as HTMLElement|null;
  const room=Math.max(260,Math.floor(window.innerHeight-top-(pager?.getBoundingClientRect().height??48)-30));
  const width=element.clientWidth;const most=Math.max(1,Math.min(3,Math.floor(width/COLUMN)));
  // Fewest columns that fit; else the most columns, drawn smaller.
  content.style.zoom='1';
  for(let columns=1;columns<=most;columns++){
   content.style.columnCount=String(columns);
   const height=content.scrollHeight;
   if(height<=room||columns===most){
    const zoom=height<=room?1:Math.max(MIN_ZOOM,room/height);content.style.zoom=String(zoom);
    setFit({columns,zoom,height:Math.round(height*zoom)});element.dataset.fit=height*zoom<=room+1?'ok':'over';element.dataset.room=String(room);return;
   }
  }
 },[]);
 useLayoutEffect(()=>{measure();},[measure,children]);
 useEffect(()=>{
  const content=flow.current;if(!content)return;
  window.addEventListener('resize',measure);void document.fonts?.ready.then(measure);
  const mutations=new MutationObserver(()=>requestAnimationFrame(measure));mutations.observe(content,{childList:true,subtree:true,characterData:true});
  const images=()=>requestAnimationFrame(measure);content.addEventListener('load',images,true);
  return()=>{mutations.disconnect();window.removeEventListener('resize',measure);content.removeEventListener('load',images,true);};
 },[measure]);
 return <div className="l3-one" ref={box} data-columns={fit?.columns}>
  <div className="l3-one-flow" ref={flow}>{children}</div>
 </div>;
}
