'use client';
import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,RotateCcw,Trophy,X} from 'lucide-react';
import {verbMap,verbMeaning,verbGroups,spokenSubject,type Verb} from '@/lib/verb-course';
import {verbPicture,verbRules,verbRuleKeys,ruleText,sentenceText,type VerbTense} from '@/lib/verb-logic';
import {sentenceRound,sentenceCorrect,auxRound,auxCorrect,buildRound,buildCorrect,buildTarget,buildSuffix,matchRound,matchKinds,bestKey,type GameId,type MatchKind,type Tile} from '@/lib/verb-games';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {vaultText,vaultDirection,type VaultLanguage,type VaultCopyKey} from '@/lib/object-vault-copy';

type Feedback={answer:(correct:boolean,text:string)=>void;stop:()=>void;complete:()=>void;busy:boolean};
type Props={game:GameId;language:VaultLanguage;topic:string;onTopic:(topic:string)=>void;onExit:()=>void;feedback:Feedback};
const gameTitle:Record<GameId,VerbCopyKey>={sentence:'gameSentence',aux:'gameAux',build:'gameBuild',match:'gameMatch'};

function readBest(key:string):number|null{try{const value=Number(localStorage.getItem(key));return Number.isFinite(value)&&value>0?value:null;}catch{return null;}}
function saveBest(key:string,value:number,lowerIsBetter=false){const best=readBest(key);if(best===null||(lowerIsBetter?value<best:value>best)){try{localStorage.setItem(key,String(value));}catch{}return value;}return best;}

export function VerbPicture({verb,language,small=false}:{verb:Verb;language:VaultLanguage;small?:boolean}){
 const src=verbPicture(verb);
 return src?<img className={'verb-picture'+(small?' small':'')} src={src} alt={verbMeaning(verb,language)} width={512} height={512} loading="lazy" decoding="async"/>:<span className={'verb-picture verb-picture-empty'+(small?' small':'')} aria-hidden="true" lang="de" dir="ltr">{verb.display}</span>;
}
/** Rule lines shown after an answer, so the learner sees why the form is right. */
export function RuleBox({lines,language}:{lines:string[];language:VaultLanguage}){
 return lines.length?<div className="verb-rules" lang={language} dir={vaultDirection(language)}><strong>{verbText(language,'ruleTitle')}</strong><ul>{lines.map(line=><li key={line}>{line}</li>)}</ul></div>:null;
}
function useTiles(){
 const [placed,setPlaced]=useState<Tile[]>([]);
 return {placed,reset:()=>setPlaced([]),add:(tile:Tile)=>setPlaced(list=>list.some(item=>item.id===tile.id)?list:[...list,tile]),remove:(tile:Tile)=>setPlaced(list=>list.filter(item=>item.id!==tile.id))};
}

export function VerbGame({game,language,topic,onTopic,onExit,feedback}:Props){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const dir=vaultDirection(language);
 const [seed,setSeed]=useState(0);
 useEffect(()=>()=>feedback.stop(),[]);// eslint-disable-line react-hooks/exhaustive-deps
 const topics=['verbs-all',...verbGroups.map(group=>group.id)];
 const topicName=(id:string)=>id==='verbs-all'?t('allVerbs'):t('groupTitle',{n:verbGroups.findIndex(group=>group.id===id)+1});
 return <section className="verb-game panel" data-verb-game={game} lang={language} dir={dir}>
  <button type="button" className="text-button vault-back-categories" onClick={()=>{feedback.stop();onExit();}}><ArrowLeft size={18} className="vault-direction-icon"/>{t('backGames')}</button>
  <h1 id="verb-game-heading" tabIndex={-1}>{t(gameTitle[game])}</h1>
  <div className="verb-game-topics" role="group" aria-label={t('chooseGroup')}>{topics.map(id=><button type="button" key={id} className={'verb-topic-chip'+(id===topic?' active':'')} aria-pressed={id===topic} onClick={()=>{feedback.stop();onTopic(id);setSeed(value=>value+1);}}>{topicName(id)}</button>)}</div>
  {game==='sentence'?<SentenceGame key={topic+seed} language={language} topic={topic} feedback={feedback} onRestart={()=>setSeed(value=>value+1)}/>:
   game==='aux'?<AuxGame key={topic+seed} language={language} topic={topic} feedback={feedback} onRestart={()=>setSeed(value=>value+1)}/>:
   game==='build'?<BuildGame key={topic+seed} language={language} topic={topic} feedback={feedback} onRestart={()=>setSeed(value=>value+1)}/>:
   <MatchGame key={topic+seed} language={language} topic={topic} feedback={feedback} onRestart={()=>setSeed(value=>value+1)}/>}
 </section>;
}
type GameProps={language:VaultLanguage;topic:string;feedback:Feedback;onRestart:()=>void};

function GameHeader({language,index,total,score,streak}:{language:VaultLanguage;index:number;total:number;score:number;streak:number}){
 return <div className="verb-game-status"><span>{vaultText(language,'progress',{n:Math.min(index+1,total),total})}</span><span>{verbText(language,'score',{n:score})}</span><span>{verbText(language,'streakNow',{n:streak})}</span></div>;
}
function GameOver({language,score,total,best,onRestart,lowerIsBetter=false}:{language:VaultLanguage;score:number;total:number;best:number|null;onRestart:()=>void;lowerIsBetter?:boolean}){
 return <div className="verb-game-over"><Trophy size={36} aria-hidden="true"/><h2>{verbText(language,'gameOver')}</h2>
  <p className="vault-result-score">{lowerIsBetter?verbText(language,'moves',{n:score}):vaultText(language,'resultScore',{correct:score,total})}</p>
  {best!==null&&<p>{verbText(language,'bestScore',{n:best})}</p>}
  <button type="button" className="btn" onClick={onRestart}><RotateCcw size={18}/>{verbText(language,'playAgain')}</button></div>;
}
function VerbPrompt({verb,language,label}:{verb:Verb;language:VaultLanguage;label?:string}){
 return <div className="verb-game-prompt"><VerbPicture verb={verb} language={language}/><div><p className="verb-game-word" lang="de" dir="ltr">{verb.display}</p><p className="verb-game-meaning" lang={language} dir={vaultDirection(language)}>{verbMeaning(verb,language)}</p>{label&&<p className="verb-game-label">{label}</p>}</div></div>;
}
function Result({correct,language,children}:{correct:boolean;language:VaultLanguage;children:ReactNode}){
 return <div className={'object-feedback verb-game-result '+(correct?'success':'retry')} role="status" aria-live="polite"><h2>{correct?<CheckCircle2 size={22}/>:<X size={22}/>} {vaultText(language,correct?'correct':'wrong')}</h2>{children}</div>;
}
/** Tap-to-place tiles: used by the sentence game and the form puzzle. */
function TileBoard({tiles,placed,onAdd,onRemove,locked,joiner,hint,suffix}:{tiles:Tile[];placed:Tile[];onAdd:(tile:Tile)=>void;onRemove:(tile:Tile)=>void;locked:boolean;joiner:'space'|'none';hint:string;suffix?:string}){
 return <div className={'verb-tiles '+(joiner==='none'?'pieces':'words')}>
  <p className="puzzle-hint">{hint}</p>
  <div className="verb-tile-line" lang="de" dir="ltr" aria-live="polite">{placed.length?placed.map(tile=><button type="button" key={tile.id} className="verb-tile placed" disabled={locked} onClick={()=>onRemove(tile)}>{tile.text}</button>):<span className="verb-tile-empty">…</span>}{suffix&&<span className="verb-tile-suffix">… {suffix}</span>}</div>
  <div className="verb-tile-bank" lang="de" dir="ltr">{tiles.filter(tile=>!placed.some(item=>item.id===tile.id)).map(tile=><button type="button" key={tile.id} className="verb-tile" disabled={locked} onClick={()=>onAdd(tile)}>{tile.text}</button>)}</div>
 </div>;
}

function SentenceGame({language,topic,feedback,onRestart}:GameProps){
 const tasks=useMemo(()=>sentenceRound(topic,10),[topic]);
 const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [streak,setStreak]=useState(0);const [result,setResult]=useState<boolean|null>(null);const [best,setBest]=useState<number|null>(null);
 const board=useTiles();const task=tasks[index];const verb=task?verbMap.get(task.verbId):undefined;
 const tense=(value:VerbTense)=>value==='praesens'?'Präsens':'Perfekt';
 function check(){if(!task||!verb||result!==null||board.placed.length!==task.chunks.length)return;const ok=sentenceCorrect(task,board.placed.map(tile=>tile.text));setResult(ok);setScore(value=>value+(ok?1:0));setStreak(value=>ok?value+1:0);feedback.answer(ok,sentenceText(verb,task.tense));}
 function next(){feedback.stop();setResult(null);board.reset();if(index+1>=tasks.length){setBest(saveBest(bestKey('sentence',topic),score));feedback.complete();}setIndex(value=>value+1);}
 if(!task||!verb)return <GameOver language={language} score={score} total={tasks.length} best={best} onRestart={onRestart}/>;
 const extra=task.tiles.length-task.chunks.length;
 return <div className="verb-game-body">
  <GameHeader language={language} index={index} total={tasks.length} score={score} streak={streak}/>
  <VerbPrompt verb={verb} language={language} label={verbText(language,'sentenceTense',{t:tense(task.tense)})}/>
  <TileBoard tiles={task.tiles} placed={board.placed} onAdd={board.add} onRemove={board.remove} locked={result!==null} joiner="space" hint={verbText(language,'tapTiles')+' '+verbText(language,extra>1?'extraPieces':'extraPiece')}/>
  {result===null?<button type="button" className="btn check-button" disabled={board.placed.length!==task.chunks.length||feedback.busy} onClick={check}>{vaultText(language,'checkAnswer')}<ArrowRight size={18} className="vault-direction-icon"/></button>:
  <Result correct={result} language={language}>
   <p className="verb-sentence-answer" lang="de" dir="ltr">{task.chunks.map((chunk,i)=><span key={i} className={'verb-chunk '+chunk.role}>{chunk.text}</span>)}.</p>
   <RuleBox lines={verbRules(verb,task.tense,language)} language={language}/>
   <button type="button" className="btn object-next" onClick={next}>{verbText(language,'nextGame')}<ArrowRight size={18} className="vault-direction-icon"/></button>
  </Result>}
 </div>;
}

function AuxGame({language,topic,feedback,onRestart}:GameProps){
 const tasks=useMemo(()=>auxRound(topic,10),[topic]);
 const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [streak,setStreak]=useState(0);const [choice,setChoice]=useState<string|null>(null);const [best,setBest]=useState<number|null>(null);
 const task=tasks[index];const verb=task?verbMap.get(task.verbId):undefined;
 function pick(value:'hat'|'ist'){if(!verb||choice!==null)return;const ok=auxCorrect(verb,value);setChoice(value);setScore(n=>n+(ok?1:0));setStreak(n=>ok?n+1:0);feedback.answer(ok,spokenSubject(verb)+' '+verb.perfekt);}
 function next(){feedback.stop();setChoice(null);if(index+1>=tasks.length){setBest(saveBest(bestKey('aux',topic),score));feedback.complete();}setIndex(value=>value+1);}
 if(!task||!verb)return <GameOver language={language} score={score} total={tasks.length} best={best} onRestart={onRestart}/>;
 const ok=choice!==null&&auxCorrect(verb,choice);
 const lines=verbRuleKeys(verb,'perfekt').filter(rule=>['move','change','bleiben','hat','clothes'].includes(rule.key)).map(rule=>ruleText(language,rule.key,rule.params));
 if(verb.alsoIst)lines.push(verbText(language,'liegenNote'));
 return <div className="verb-game-body">
  <GameHeader language={language} index={index} total={tasks.length} score={score} streak={streak}/>
  <VerbPrompt verb={verb} language={language} label={verbText(language,'auxQuestion')}/>
  <p className="verb-frame verb-game-frame" lang="de" dir="ltr">{verb.subject} <span className="verb-frame-gap">{choice??'___'}</span> {verb.participle}</p>
  <div className="verb-aux-big" role="group" aria-label={verbText(language,'auxQuestion')}>{(['hat','ist'] as const).map(value=><button type="button" key={value} className={'verb-aux-big-button '+value+(choice===null?'':auxCorrect(verb,value)?' right':choice===value?' wrong':'')} disabled={choice!==null||feedback.busy} onClick={()=>pick(value)} lang="de">{value}</button>)}</div>
  {choice!==null&&<Result correct={ok} language={language}>
   <p lang="de" dir="ltr"><strong>{verb.subject} {verb.alsoIst?'hat/ist '+verb.participle:verb.perfekt}</strong></p>
   <RuleBox lines={lines} language={language}/>
   <button type="button" className="btn object-next" onClick={next}>{verbText(language,'nextGame')}<ArrowRight size={18} className="vault-direction-icon"/></button>
  </Result>}
 </div>;
}

function BuildGame({language,topic,feedback,onRestart}:GameProps){
 const tasks=useMemo(()=>buildRound(topic,10),[topic]);
 const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [streak,setStreak]=useState(0);const [result,setResult]=useState<boolean|null>(null);const [best,setBest]=useState<number|null>(null);
 const board=useTiles();const task=tasks[index];const verb=task?verbMap.get(task.verbId):undefined;
 function check(){if(!task||!verb||result!==null||!board.placed.length)return;const ok=buildCorrect(task,board.placed.map(tile=>tile.text));setResult(ok);setScore(n=>n+(ok?1:0));setStreak(n=>ok?n+1:0);feedback.answer(ok,task.kind==='praesens'?verb.praesens:verb.participle);}
 function next(){feedback.stop();setResult(null);board.reset();if(index+1>=tasks.length){setBest(saveBest(bestKey('build',topic),score));feedback.complete();}setIndex(value=>value+1);}
 if(!task||!verb)return <GameOver language={language} score={score} total={tasks.length} best={best} onRestart={onRestart}/>;
 const suffix=buildSuffix(task);
 return <div className="verb-game-body">
  <GameHeader language={language} index={index} total={tasks.length} score={score} streak={streak}/>
  <VerbPrompt verb={verb} language={language} label={verbText(language,task.kind==='praesens'?'buildPraesens':'buildParticiple')}/>
  <TileBoard tiles={task.tiles} placed={board.placed} onAdd={board.add} onRemove={board.remove} locked={result!==null} joiner="none" hint={verbText(language,'tapTiles')+' '+verbText(language,'extraPieces')} suffix={suffix||undefined}/>
  {result===null?<button type="button" className="btn check-button" disabled={!board.placed.length||feedback.busy} onClick={check}>{vaultText(language,'checkAnswer')}<ArrowRight size={18} className="vault-direction-icon"/></button>:
  <Result correct={result} language={language}>
   <p className="verb-build-answer" lang="de" dir="ltr">{task.kind==='praesens'?verb.subject+' ':''}<strong>{task.pieces.join('·')}</strong>{suffix?' … '+suffix:''} = {task.kind==='praesens'?verb.praesens:buildTarget(task)}</p>
   <RuleBox lines={task.kind==='praesens'?verbRules(verb,'praesens',language):verbRuleKeys(verb,'perfekt').filter(rule=>['sepGe','noGe','strong','mixed'].includes(rule.key)).map(rule=>ruleText(language,rule.key,rule.params))} language={language}/>
   <button type="button" className="btn object-next" onClick={next}>{verbText(language,'nextGame')}<ArrowRight size={18} className="vault-direction-icon"/></button>
  </Result>}
 </div>;
}

function MatchGame({language,topic,feedback,onRestart}:GameProps){
 const kinds=matchKinds(topic);
 const [kind,setKind]=useState<MatchKind>(kinds[0]);
 const [round,setRound]=useState(0);
 const cards=useMemo(()=>matchRound(topic,kind,language),[topic,kind,language,round]);// eslint-disable-line react-hooks/exhaustive-deps
 const [open,setOpen]=useState<string[]>([]);const [matched,setMatched]=useState<Set<string>>(new Set());const [moves,setMoves]=useState(0);const [best,setBest]=useState<number|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 useEffect(()=>{setOpen([]);setMatched(new Set());setMoves(0);setBest(readBest(bestKey('match',topic,kind)));},[cards,topic,kind]);
 const pairs=cards.length/2;const done=matched.size===pairs&&pairs>0;
 function flip(id:string){
  if(open.length>=2||open.includes(id)||done)return;const card=cards.find(item=>item.id===id);if(!card||matched.has(card.pair))return;
  const next=[...open,id];setOpen(next);if(next.length<2)return;
  setMoves(value=>value+1);const [a,b]=next.map(cardId=>cards.find(item=>item.id===cardId)!);
  if(a.pair===b.pair){const verb=verbMap.get(a.pair)!;const all=new Set(matched).add(a.pair);setMatched(all);setOpen([]);feedback.answer(true,verb.infinitive);if(all.size===pairs){setBest(saveBest(bestKey('match',topic,kind),moves+1,true));}}
  else{feedback.answer(false,'');timer.current=setTimeout(()=>setOpen([]),1100);}
 }
 const labels:Record<MatchKind,VerbCopyKey>={picture:'matchPicture',perfekt:'matchPerfekt',meaning:'matchMeaning'};
 return <div className="verb-game-body">
  <div className="verb-game-topics match-kinds" role="group">{kinds.map(value=><button type="button" key={value} className={'verb-topic-chip'+(value===kind?' active':'')} aria-pressed={value===kind} onClick={()=>{feedback.stop();setKind(value);setRound(n=>n+1);}}>{verbText(language,labels[value])}</button>)}</div>
  <div className="verb-game-status"><span>{verbText(language,'pairsFound',{n:matched.size,total:pairs})}</span><span>{verbText(language,'moves',{n:moves})}</span>{best!==null&&<span>{verbText(language,'bestScore',{n:best})}</span>}</div>
  <div className="verb-match-grid">{cards.map((card,i)=>{const shown=open.includes(card.id)||matched.has(card.pair);const verb=verbMap.get(card.pair)!;return <button type="button" key={card.id} className={'verb-match-card '+card.face+(shown?' shown':'')+(matched.has(card.pair)?' matched':'')} aria-pressed={shown} aria-label={shown?card.text:verbText(language,'cardHidden',{n:i+1})} disabled={matched.has(card.pair)} onClick={()=>flip(card.id)}>{shown?card.face==='picture'?<VerbPicture verb={verb} language={language} small/>:<span lang={card.face==='meaning'?language:'de'} dir={card.face==='meaning'?vaultDirection(language):'ltr'}>{card.text}</span>:<span className="verb-match-back" aria-hidden="true">?</span>}</button>;})}</div>
  {done&&<GameOver language={language} score={moves} total={pairs} best={best} lowerIsBetter onRestart={onRestart}/>}
 </div>;
}
