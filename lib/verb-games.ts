import {verbs,verbMeaning,type Verb} from './verb-course';
import type {VaultLanguage} from './object-vault-copy';
import {sentenceChunks,sentenceDistractor,participlePieces,participleWrongPieces,praesensPieces,praesensWrongPieces,verbPicture,verbPrefix,type VerbTense,type SentenceChunk} from './verb-logic';

/** Fiiller games: rounds are built here (pure functions), the page only shows them. */
export type GameId='sentence'|'aux'|'build'|'match'|'rain'|'catch'|'quick'|'search'|'rescue'|'plural';
// Offered on the page: the matching cards and the new games (the learner asked for them, October 2026; their rounds are
// in lib/object-games.ts). Cümle kurma, hat mı ist mi? and Biçim yapbozu were taken off at the learner's request (their
// rounds stay here, unused, so nothing else breaks).
export const gameIds:GameId[]=['match','rain','catch','quick','search','rescue','plural'];
export type Tile={id:string;text:string};
type Random=()=>number;
export function mix<T>(items:readonly T[],random:Random=Math.random):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function gameVerbs(topic:string){return verbs.filter(verb=>topic==='verbs-all'||verb.group===topic);}
const tiles=(texts:readonly string[],prefix:string)=>texts.map((text,index)=>({id:prefix+index,text}));

export type SentenceTask={verbId:string;tense:VerbTense;chunks:SentenceChunk[];tiles:Tile[]};
/** Put the sentence parts in order; one tempting wrong form is mixed in. */
export function sentenceRound(topic:string,count=10,random:Random=Math.random):SentenceTask[]{
 return mix(gameVerbs(topic),random).slice(0,count).map((verb,index)=>{
  const tense:VerbTense=random()<0.5?'praesens':'perfekt';const chunks=sentenceChunks(verb,tense);
  return {verbId:verb.id,tense,chunks,tiles:mix(tiles([...chunks.map(chunk=>chunk.text),sentenceDistractor(verb,tense)],'s'+index+'-'),random)};
 });
}
export function sentenceCorrect(task:SentenceTask,placed:readonly string[]){return placed.join(' ')===task.chunks.map(chunk=>chunk.text).join(' ');}

export type AuxTask={verbId:string};
export function auxRound(topic:string,count=10,random:Random=Math.random):AuxTask[]{return mix(gameVerbs(topic),random).slice(0,count).map(verb=>({verbId:verb.id}));}
/** liegen takes hat (and ist in the south); every other verb has one helping verb. */
export function auxCorrect(verb:Verb,choice:string){return choice===verb.aux||(verb.alsoIst&&choice==='ist');}

export type BuildTask={verbId:string;kind:'participle'|'praesens';pieces:string[];tiles:Tile[]};
/** Build the Partizip II (all verbs) or the sie/er Präsens form (verbs whose form changes) from pieces. */
export function buildRound(topic:string,count=10,random:Random=Math.random):BuildTask[]{
 const pool:BuildTask[]=[];
 for(const verb of gameVerbs(topic)){
  pool.push({verbId:verb.id,kind:'participle',pieces:participlePieces(verb),tiles:[]});
  const ps=praesensPieces(verb);if(ps)pool.push({verbId:verb.id,kind:'praesens',pieces:ps,tiles:[]});
 }
 const picked:BuildTask[]=[];const used=new Set<string>();
 // One task per verb first, so a short round meets more verbs.
 for(const task of mix(pool,random)){if(picked.length>=count)break;if(used.has(task.verbId))continue;used.add(task.verbId);picked.push(task);}
 for(const task of mix(pool,random)){if(picked.length>=count)break;if(!picked.includes(task))picked.push(task);}
 return picked.map((task,index)=>{const verb=verbs.find(item=>item.id===task.verbId)!;const wrong=task.kind==='participle'?participleWrongPieces(verb):praesensWrongPieces(verb);return {...task,tiles:mix(tiles([...task.pieces,...wrong],'b'+index+'-'),random)};});
}
export function buildTarget(task:BuildTask){return task.pieces.join('');}
export function buildCorrect(task:BuildTask,placed:readonly string[]){return placed.join('')===buildTarget(task);}
/** The separable prefix that follows a Präsens form (fährt … ab), shown next to the puzzle. */
export function buildSuffix(task:BuildTask){const verb=verbs.find(item=>item.id===task.verbId)!;return task.kind==='praesens'?verbPrefix(verb):'';}

export type MatchKind='picture'|'perfekt'|'meaning';
export type MatchCard={id:string;pair:string;face:'verb'|'picture'|'perfekt'|'meaning';text:string;picture?:string};
export function matchKinds(topic:string):MatchKind[]{return gameVerbs(topic).filter(verb=>verbPicture(verb)).length>=6?['picture','perfekt','meaning']:['perfekt','meaning'];}
/** Six pairs: the infinitive on one card, its picture, Perfekt or meaning on the other. */
export function matchRound(topic:string,kind:MatchKind,language:VaultLanguage,pairs=6,random:Random=Math.random):MatchCard[]{
 const pool=gameVerbs(topic).filter(verb=>kind!=='picture'||verbPicture(verb));
 const cards:MatchCard[]=[];
 for(const verb of mix(pool,random).slice(0,pairs)){
  cards.push({id:verb.id+':verb',pair:verb.id,face:'verb',text:verb.display});
  if(kind==='picture')cards.push({id:verb.id+':picture',pair:verb.id,face:'picture',text:verbMeaning(verb,language),picture:verbPicture(verb)!});
  else if(kind==='perfekt')cards.push({id:verb.id+':perfekt',pair:verb.id,face:'perfekt',text:verb.subject+' '+(verb.alsoIst?'hat/ist '+verb.participle:verb.perfekt)});
  else cards.push({id:verb.id+':meaning',pair:verb.id,face:'meaning',text:verbMeaning(verb,language)});
 }
 return mix(cards,random);
}
/** Best scores stay in this browser only (higher is better; for memory fewer moves is better). */
export function bestKey(game:GameId,topic:string,kind=''){return 'lernkoko-verb-game:'+game+':'+topic+(kind?':'+kind:'');}
