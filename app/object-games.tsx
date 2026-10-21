'use client';
import {useEffect,useMemo,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {ArrowRight,CheckCircle2,Heart,RotateCcw,Trophy,Volume2,X} from 'lucide-react';
import {ObjectArt} from './toon-art';
import {objectMeaning} from '@/lib/object-translations';
import {verbMap,verbMeaning} from '@/lib/verb-course';
import {verbPicture} from '@/lib/verb-logic';
import {verbText} from '@/lib/verb-copy';
import {vaultText,vaultDirection,type VaultLanguage} from '@/lib/object-vault-copy';
import {gameText,type GameCopyKey} from '@/lib/game-copy';
import {motionAllowed} from '@/lib/learning-effects';
import {bestKey} from '@/lib/verb-games';
import {
 ARTICLES,RAIN_LIVES,rainRound,rainSeconds,catchRound,catchPoints,catchMultiplier,CATCH_SECONDS,quickDeck,QUICK_SECONDS,
 searchGrid,searchFind,searchCells,rescueRound,rescueMask,rescueSolved,rescueMisses,RESCUE_BALLOONS,RESCUE_KEYS,pluralRound,
 gameObject,type Article,type QuickCard,
} from '@/lib/object-games';

/**
 * The new games (the learner asked for them, October 2026). Every answer gets the right/wrong sound and then only the
 * correct form is read aloud (feedback.answer); in "Duy ve yakala" the word to find is the question and is heard by
 * itself — prepared in the "Başla" tap so phones allow it.
 */
export type GameFeedback={answer:(correct:boolean,text:string)=>void;stop:()=>void;complete:()=>void;busy:boolean;speak:(text:string)=>void;prepare:()=>void};
type Props={language:VaultLanguage;feedback:GameFeedback;onRestart:()=>void};

function readBest(key:string):number|null{try{const value=Number(localStorage.getItem(key));return Number.isFinite(value)&&value>0?value:null;}catch{return null;}}
function saveBest(key:string,value:number,lowerIsBetter=false){const best=readBest(key);if(value>0&&(best===null||(lowerIsBetter?value<best:value>best))){try{localStorage.setItem(key,String(value));}catch{}return value;}return best;}
function useLater(){
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>()=>{timers.current.forEach(clearTimeout);},[]);
 return {later:(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms));},clear:()=>{timers.current.forEach(clearTimeout);timers.current=[];}};
}
function Picture({id,language}:{id:string;language:VaultLanguage}){return <span className="game-picture"><ObjectArt id={id} title={objectMeaning(id,language)}/></span>;}
function Over({language,line,best,onRestart,children}:{language:VaultLanguage;line:string;best?:string|null;onRestart:()=>void;children?:ReactNode}){
 return <div className="verb-game-over game-over" data-game-over><Trophy size={36} aria-hidden="true"/><h2>{verbText(language,'gameOver')}</h2>
  <p className="vault-result-score">{line}</p>{best&&<p>{best}</p>}{children}
  <button type="button" className="btn" onClick={onRestart}><RotateCcw size={18}/>{verbText(language,'playAgain')}</button></div>;
}
function Start({language,hint,onStart}:{language:VaultLanguage;hint:string;onStart:()=>void}){
 return <div className="game-start"><p>{hint}</p><button type="button" className="btn" onClick={onStart} data-game-start>{gameText(language,'startGame')}<ArrowRight size={18} className="vault-direction-icon"/></button></div>;
}

// ---- Artikel yağmuru: the picture falls; tap der, die or das before it lands. ----
export function RainGame({language,feedback,onRestart}:Props){
 const g=(key:GameCopyKey,params?:Record<string,string|number>)=>gameText(language,key,params);
 const items=useMemo(()=>rainRound(20),[]);
 const [started,setStarted]=useState(false);const [index,setIndex]=useState(0);const [lives,setLives]=useState(RAIN_LIVES);const [score,setScore]=useState(0);
 const [last,setLast]=useState<{ok:boolean;chosen:Article|null}|null>(null);const [best,setBest]=useState<number|null>(null);
 const {later,clear}=useLater();const still=useMemo(()=>!motionAllowed(),[]);
 const item=items[index];const over=started&&(lives<=0||index>=items.length);
 const seconds=rainSeconds(score);
 // The picture lands when its time is over (one timer per picture, so it also works without the falling motion).
 const land=useRef(()=>{});land.current=()=>finish(null);
 const falling=started&&!over&&!last&&!!item;
 useEffect(()=>{if(!falling)return;const timer=setTimeout(()=>land.current(),seconds*1000);return()=>clearTimeout(timer);},[falling,index]);// eslint-disable-line react-hooks/exhaustive-deps
 function finish(chosen:Article|null){
  if(!item||last)return;const ok=chosen===item.article;
  const nextLives=ok?lives:lives-1;const nextScore=score+(ok?1:0);
  setLast({ok,chosen});setScore(nextScore);setLives(nextLives);feedback.answer(ok,item.de);
  later(()=>{setLast(null);if(nextLives<=0||index+1>=items.length){setBest(saveBest(bestKey('rain','objects'),nextScore));feedback.complete();}setIndex(value=>value+1);},1400);
 }
 if(!started)return <Start language={language} hint={g('rainHint')} onStart={()=>{feedback.prepare();setBest(readBest(bestKey('rain','objects')));setStarted(true);}}/>;
 if(over||!item)return <Over language={language} line={verbText(language,'score',{n:score})} best={best?verbText(language,'bestScore',{n:best}):null} onRestart={()=>{clear();onRestart();}}/>;
 return <div className="game-rain" data-game="rain">
  <div className="verb-game-status"><span className="game-lives" aria-label={g('lives',{n:lives})}>{Array.from({length:RAIN_LIVES},(_,i)=><Heart key={i} size={18} className={i<lives?'on':'off'} aria-hidden="true"/>)}</span><span>{verbText(language,'score',{n:score})}</span><span>{g('speed',{n:Math.round(60/seconds)/10})}</span></div>
  <div className={'rain-sky'+(still?' still':'')} style={{'--rain-time':seconds+'s'} as CSSProperties}>
   <div key={index} className={'rain-drop'+(last?' stopped '+(last.ok?'right':'wrong'):'')} data-rain-item={item.id}>
    <Picture id={item.id} language={language}/>
    <span className="rain-noun" lang="de" dir="ltr">{last?<><b className={'article-'+item.article}>{item.article}</b> </>:null}{item.noun}</span>
   </div>
   {!last&&<span key={'t'+index} className="rain-timer" aria-hidden="true"/>}
   {last&&!last.chosen&&<p className="rain-missed" role="status">{g('missed')}</p>}
  </div>
  <div className="rain-buckets" role="group" aria-label={g('rainHint')}>{ARTICLES.map(article=><button type="button" key={article} lang="de" className={'rain-bucket article-'+article+(last&&article===item.article?' right':'')+(last&&last.chosen===article&&!last.ok?' wrong':'')} disabled={!!last} onClick={()=>finish(article)} data-rain-article={article} data-answer-tap>{article}</button>)}</div>
 </div>;
}

// ---- Duy ve yakala: hear the word, tap its picture before the time runs out. ----
export function CatchGame({language,feedback,onRestart}:Props){
 const g=(key:GameCopyKey,params?:Record<string,string|number>)=>gameText(language,key,params);
 const items=useMemo(()=>catchRound(10),[]);
 const [started,setStarted]=useState(false);const [index,setIndex]=useState(0);const [points,setPoints]=useState(0);const [streak,setStreak]=useState(0);const [right,setRight]=useState(0);
 const [chosen,setChosen]=useState<string|null|undefined>(undefined);const [best,setBest]=useState<number|null>(null);
 const item=items[index];const over=started&&index>=items.length;const answered=chosen!==undefined;
 const late=useRef(()=>{});late.current=()=>choose(null);
 const listening=started&&!over&&!answered&&!!item;
 useEffect(()=>{if(!listening)return;const timer=setTimeout(()=>late.current(),CATCH_SECONDS*1000);return()=>clearTimeout(timer);},[listening,index]);
 // After an answer: its sound and the correct word first (at most 4 s), then the next word is heard by itself.
 const busy=useRef(feedback.busy);busy.current=feedback.busy;
 const advance=useRef(()=>{});advance.current=()=>{
  const nextIndex=index+1;setChosen(undefined);setIndex(nextIndex);
  if(nextIndex>=items.length){setBest(saveBest(bestKey('catch','objects'),points));feedback.complete();}
  else feedback.speak(items[nextIndex].de);
 };
 useEffect(()=>{if(!answered)return;const at=Date.now();const timer=setInterval(()=>{const elapsed=Date.now()-at;if((elapsed>=900&&!busy.current)||elapsed>=4000){clearInterval(timer);advance.current();}},150);return()=>clearInterval(timer);},[answered,index]);
 function choose(id:string|null){
  if(!item||answered)return;const ok=id===item.id;
  setChosen(id);setRight(n=>n+(ok?1:0));setPoints(n=>n+(ok?catchPoints(streak):0));setStreak(n=>ok?n+1:0);
  feedback.answer(ok,item.de);
 }
 if(!started)return <Start language={language} hint={g('soundHint')} onStart={()=>{feedback.prepare();setBest(readBest(bestKey('catch','objects')));setStarted(true);if(items[0])feedback.speak(items[0].de);}}/>;
 if(over||!item)return <Over language={language} line={verbText(language,'score',{n:points})+' · '+vaultText(language,'resultScore',{correct:right,total:items.length})} best={best?verbText(language,'bestScore',{n:best}):null} onRestart={onRestart}/>;
 return <div className="game-catch" data-game="catch">
  <div className="verb-game-status"><span>{vaultText(language,'progress',{n:index+1,total:items.length})}</span><span>{verbText(language,'score',{n:points})}</span><span className="game-multiplier">{g('multiplier',{n:catchMultiplier(streak)})}</span></div>
  <div className="catch-head"><p>{g('catchPrompt')}</p><button type="button" className="btn secondary small" disabled={answered} onClick={()=>feedback.speak(item.de)}><Volume2 size={18}/>{g('hearAgain')}</button></div>
  {!answered&&<span key={'t'+index} className="game-timebar" style={{'--game-time':CATCH_SECONDS+'s'} as CSSProperties} aria-hidden="true"/>}
  <div className="catch-options" role="group" aria-label={g('catchPrompt')}>{item.options.map(id=>{const word=gameObject(id);return <button type="button" key={id} className={'catch-option'+(answered&&id===item.id?' right':'')+(answered&&chosen===id&&id!==item.id?' wrong':'')} disabled={answered} onClick={()=>choose(id)} data-catch-option={id} data-answer-tap><Picture id={id} language={language}/>{answered&&word&&<span lang="de" dir="ltr">{word.de}</span>}</button>;})}</div>
  {answered&&<div className={'object-feedback '+(chosen===item.id?'success':'retry')} role="status"><h2>{chosen===item.id?<CheckCircle2 size={22}/>:<X size={22}/>} {chosen===null?g('timeUp'):vaultText(language,chosen===item.id?'correct':'wrong')}</h2><p lang="de" dir="ltr"><strong>{item.de}</strong></p></div>}
 </div>;
}

// ---- 30 saniye: doğru mu? Picture + word: right or wrong, as many as possible in 30 seconds. ----
export function QuickGame({language,feedback,onRestart}:Props){
 const g=(key:GameCopyKey,params?:Record<string,string|number>)=>gameText(language,key,params);
 const deck=useMemo(()=>quickDeck(80),[]);
 const [startedAt,setStartedAt]=useState<number|null>(null);const [now,setNow]=useState(0);const [index,setIndex]=useState(0);const [score,setScore]=useState(0);
 const [mistakes,setMistakes]=useState<QuickCard[]>([]);const [flash,setFlash]=useState<'right'|'wrong'|null>(null);const [best,setBest]=useState<number|null>(null);const [ended,setEnded]=useState(false);
 const {later}=useLater();
 const left=startedAt===null?QUICK_SECONDS:Math.max(0,QUICK_SECONDS-Math.floor((now-startedAt)/1000));
 useEffect(()=>{if(startedAt===null||ended)return;const timer=setInterval(()=>setNow(Date.now()),200);return()=>clearInterval(timer);},[startedAt,ended]);
 useEffect(()=>{if(startedAt===null||ended)return;if(left<=0||index>=deck.length){setEnded(true);setBest(saveBest(bestKey('quick','mixed'),score));feedback.complete();}},[left,index]);// eslint-disable-line react-hooks/exhaustive-deps
 const card=deck[index];
 function answer(saysRight:boolean){
  if(!card||ended||flash)return;const ok=saysRight===card.right;
  feedback.answer(ok,'');setFlash(ok?'right':'wrong');if(ok)setScore(n=>n+1);else setMistakes(list=>[...list,card]);
  later(()=>{setFlash(null);setIndex(n=>n+1);},320);
 }
 if(startedAt===null)return <Start language={language} hint={g('gameQuickDetail')} onStart={()=>{feedback.prepare();setBest(readBest(bestKey('quick','mixed')));const at=Date.now();setStartedAt(at);setNow(at);}}/>;
 if(ended||!card)return <Over language={language} line={g('quickScore',{n:score})} best={best?verbText(language,'bestScore',{n:best}):null} onRestart={onRestart}>
  {mistakes.length>0&&<div className="quick-mistakes"><h3>{g('quickMistakes')}</h3><ul lang="de" dir="ltr">{mistakes.slice(0,8).map(item=><li key={item.key}><s>{item.shown}</s> → <strong>{item.correct}</strong></li>)}</ul></div>}
 </Over>;
 const verb=card.kind==='verb'?verbMap.get(card.id):undefined;const picture=verb?verbPicture(verb):null;
 return <div className="game-quick" data-game="quick">
  <div className="verb-game-status"><span className={'quick-clock'+(left<=5?' hurry':'')}>{g('secondsLeft',{n:left})}</span><span>{g('quickScore',{n:score})}</span></div>
  <div className={'quick-card'+(flash?' '+flash:'')} data-quick-card={card.key}>
   {card.kind==='object'?<Picture id={card.id} language={language}/>:picture?<span className="game-picture"><img src={picture} alt={verb?verbMeaning(verb,language):''} width={512} height={512}/></span>:null}
   <p className="quick-text" lang="de" dir="ltr">{verb?verb.subject+' ':''}{card.shown}</p>
  </div>
  <p className="quick-prompt">{g('quickPrompt')}</p>
  <div className="quick-buttons"><button type="button" className="btn quick-yes" onClick={()=>answer(true)} data-quick-answer="right" data-answer-tap><CheckCircle2 size={20}/>{g('answerRight')}</button><button type="button" className="btn quick-no" onClick={()=>answer(false)} data-quick-answer="wrong" data-answer-tap><X size={20}/>{g('answerWrong')}</button></div>
 </div>;
}

// ---- Kelime avı: find the hidden nouns; tap the first letter, then the last one. ----
export function SearchGame({language,feedback,onRestart}:Props){
 const g=(key:GameCopyKey,params?:Record<string,string|number>)=>gameText(language,key,params);
 const grid=useMemo(()=>searchGrid(8,6),[]);
 const [found,setFound]=useState<string[]>([]);const [start,setStart]=useState<number|null>(null);const [miss,setMiss]=useState<number[]>([]);
 const [startedAt]=useState(()=>Date.now());const [time,setTime]=useState<number|null>(null);const [best,setBest]=useState<number|null>(null);
 const {later}=useLater();
 const foundCells=useMemo(()=>new Set(grid.words.filter(word=>found.includes(word.id)).flatMap(word=>searchCells(grid,word))),[grid,found]);
 function tap(cell:number){
  if(time!==null)return;
  if(start===null){setStart(cell);return;}
  if(start===cell){setStart(null);return;}
  const word=searchFind(grid,start,cell);setStart(null);
  if(word&&!found.includes(word.id)){
   const next=[...found,word.id];setFound(next);feedback.answer(true,word.de);
   if(next.length===grid.words.length){const seconds=Math.max(1,Math.round((Date.now()-startedAt)/1000));setTime(seconds);setBest(saveBest(bestKey('search','objects'),seconds,true));later(()=>feedback.complete(),1600);}
  }else{feedback.answer(false,'');setMiss([start,cell]);later(()=>setMiss([]),600);}
 }
 return <div className="game-search" data-game="search">
  <div className="verb-game-status"><span>{g('wordsFound',{n:found.length,total:grid.words.length})}</span></div>
  {time===null&&<p className="puzzle-hint">{g('searchHint')}</p>}
  <div className="search-grid" style={{'--search-size':grid.size} as CSSProperties} lang="de" dir="ltr" role="group" aria-label={g('gameSearch')}>{grid.cells.map((letter,cell)=><button type="button" key={cell} className={'search-cell'+(foundCells.has(cell)?' found':'')+(start===cell?' selected':'')+(miss.includes(cell)?' miss':'')} aria-pressed={start===cell} onClick={()=>tap(cell)} data-search-cell={cell}>{letter}</button>)}</div>
  <ul className="search-words" lang="de" dir="ltr">{grid.words.map(word=><li key={word.id} className={found.includes(word.id)?'found':''}><Picture id={word.id} language={language}/><span>{word.de}</span>{found.includes(word.id)&&<CheckCircle2 size={16} aria-hidden="true"/>}</li>)}</ul>
  {time!==null&&<Over language={language} line={g('searchTime',{n:time})} best={best?g('searchBest',{n:best}):null} onRestart={onRestart}/>}
 </div>;
}

// ---- Koko'yu kurtar: guess the word letter by letter; every wrong letter costs Koko a balloon. ----
export function RescueGame({language,feedback,onRestart}:Props){
 const g=(key:GameCopyKey,params?:Record<string,string|number>)=>gameText(language,key,params);
 const items=useMemo(()=>rescueRound(5),[]);
 const [index,setIndex]=useState(0);const [guessed,setGuessed]=useState<Set<string>>(new Set());const [saved,setSaved]=useState(0);const [best,setBest]=useState<number|null>(null);
 const item=items[index];
 const misses=item?rescueMisses(item.noun,guessed):0;const balloons=Math.max(0,RESCUE_BALLOONS-misses);
 const won=!!item&&rescueSolved(item.noun,guessed);const lost=!!item&&!won&&balloons<=0;const done=won||lost;
 function guess(letter:string){
  if(!item||done||guessed.has(letter))return;const next=new Set(guessed).add(letter);setGuessed(next);
  const hit=item.noun.toUpperCase().includes(letter);
  if(rescueSolved(item.noun,next)){setSaved(n=>n+1);feedback.answer(true,item.de);}
  else if(!hit){if(RESCUE_BALLOONS-rescueMisses(item.noun,next)<=0)feedback.answer(false,item.de);else feedback.answer(false,'');}
 }
 function next(){feedback.stop();setGuessed(new Set());if(index+1>=items.length){setBest(saveBest(bestKey('rescue','objects'),saved));feedback.complete();}setIndex(n=>n+1);}
 if(!item)return <Over language={language} line={g('rescueScore',{n:saved,total:items.length})} best={best?verbText(language,'bestScore',{n:best}):null} onRestart={onRestart}/>;
 return <div className="game-rescue" data-game="rescue">
  <div className="verb-game-status"><span>{vaultText(language,'progress',{n:index+1,total:items.length})}</span><span>{g('balloonsLeft',{n:balloons})}</span></div>
  <div className="rescue-stage">
   <div className={'rescue-koko'+(lost?' landed':'')+(won?' saved':'')} aria-hidden="true">
    <span className="rescue-balloons">{Array.from({length:RESCUE_BALLOONS},(_,i)=><span key={i} className={'rescue-balloon b'+i+(i<balloons?'':' popped')}/>)}</span>
    <img src="/branding/goliqo-maskot.webp" alt="" width={120} height={120}/>
   </div>
   <div className="rescue-clue"><Picture id={item.id} language={language}/><p lang={language} dir={vaultDirection(language)}>{objectMeaning(item.id,language)}</p></div>
  </div>
  <p className="rescue-word" lang="de" dir="ltr" aria-live="polite"><b className={'article-'+item.article}>{item.article}</b> {(done?Array.from(item.noun):rescueMask(item.noun,guessed)).map((letter,i)=><span key={i} className={'rescue-letter'+(letter==='_'?' empty':'')+(lost&&!guessed.has(item.noun[i].toUpperCase())?' shown':'')}>{letter==='_'?'':letter}</span>)}</p>
  {done?<div className={'object-feedback '+(won?'success':'retry')} role="status"><h2>{won?<CheckCircle2 size={22}/>:<X size={22}/>} {g(won?'rescued':'rescueLost')}</h2><p lang="de" dir="ltr"><strong>{item.de}</strong></p><button type="button" className="btn object-next" onClick={next}>{g('nextWord')}<ArrowRight size={18} className="vault-direction-icon"/></button></div>:
  <div className="rescue-keys" role="group" aria-label={g('letters')} lang="de" dir="ltr">{RESCUE_KEYS.map(letter=>{const used=guessed.has(letter);const hit=used&&item.noun.toUpperCase().includes(letter);return <button type="button" key={letter} className={'rescue-key'+(used?hit?' hit':' miss':'')} disabled={used} onClick={()=>guess(letter)} data-rescue-key={letter}>{letter}</button>;})}</div>}
  {!done&&<p className="puzzle-hint">{g('rescueHint')}</p>}
 </div>;
}

// ---- Çoğul eşleştirme: memory cards, the word ↔ its plural. ----
export function PluralGame({language,feedback,onRestart}:Props){
 const cards=useMemo(()=>pluralRound(6),[]);
 const [open,setOpen]=useState<string[]>([]);const [matched,setMatched]=useState<Set<string>>(new Set());const [moves,setMoves]=useState(0);const [best,setBest]=useState<number|null>(null);
 const {later}=useLater();
 useEffect(()=>{setBest(readBest(bestKey('plural','objects')));},[]);
 const pairs=cards.length/2;const done=matched.size===pairs&&pairs>0;
 function flip(id:string){
  if(open.length>=2||open.includes(id)||done)return;const card=cards.find(item=>item.id===id);if(!card||matched.has(card.pair))return;
  const next=[...open,id];setOpen(next);if(next.length<2)return;
  setMoves(value=>value+1);const [a,b]=next.map(cardId=>cards.find(item=>item.id===cardId)!);
  if(a.pair===b.pair){const plural=a.face==='plural'?a.text:b.text;const all=new Set(matched).add(a.pair);setMatched(all);setOpen([]);feedback.answer(true,plural);if(all.size===pairs)setBest(saveBest(bestKey('plural','objects'),moves+1,true));}
  else{feedback.answer(false,'');later(()=>setOpen([]),1100);}
 }
 return <div className="verb-game-body game-plural" data-game="plural">
  <div className="verb-game-status"><span>{verbText(language,'pairsFound',{n:matched.size,total:pairs})}</span><span>{verbText(language,'moves',{n:moves})}</span>{best!==null&&<span>{verbText(language,'bestScore',{n:best})}</span>}</div>
  <div className="verb-match-grid">{cards.map((card,i)=>{const shown=open.includes(card.id)||matched.has(card.pair);return <button type="button" key={card.id} className={'verb-match-card plural-card '+card.face+(shown?' shown':'')+(matched.has(card.pair)?' matched':'')} aria-pressed={shown} aria-label={shown?card.text:verbText(language,'cardHidden',{n:i+1})} disabled={matched.has(card.pair)} onClick={()=>flip(card.id)}>{shown?<>{card.face==='singular'&&<Picture id={card.pair} language={language}/>}<span lang="de" dir="ltr">{card.text}</span></>:<span className="verb-match-back" aria-hidden="true">?</span>}</button>;})}</div>
  {done&&<Over language={language} line={verbText(language,'moves',{n:moves})} best={best?verbText(language,'bestScore',{n:best}):null} onRestart={onRestart}/>}
 </div>;
}
