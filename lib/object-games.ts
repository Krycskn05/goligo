import objectArt from './object-toon-art.json';
import {objectVocabulary,type ObjectWord} from './object-course';
import {pluralNouns} from './article-challenges';
import {verbs,type Verb} from './verb-course';
import {verbPicture} from './verb-logic';

/**
 * The new games (the learner asked, October 2026): Artikel yağmuru, Duy ve yakala, 30 saniye: doğru mu?, Kelime avı,
 * Koko'yu kurtar and Çoğul eşleştirme. They use the Nesne Kasası words and pictures (and, in the quick game, the verbs).
 * Rounds are built here as pure functions; app/object-games.tsx only shows them.
 */
type Random=()=>number;
export type Article='der'|'die'|'das';
export const ARTICLES:readonly Article[]=['der','die','das'];

function mix<T>(items:readonly T[],random:Random=Math.random):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
/** "der Tisch" → {article:'der',noun:'Tisch'}; null for anything else. */
export function splitNoun(de:string):{article:Article;noun:string}|null{
 const match=/^(der|die|das) (\S+)$/.exec(de);return match?{article:match[1] as Article,noun:match[2]}:null;
}
const hasArt=(word:ObjectWord)=>Object.prototype.hasOwnProperty.call(objectArt,word.id);
/** The vault words a game can show: with a picture and "article + one word". */
export const gameObjects:readonly ObjectWord[]=objectVocabulary.filter(word=>hasArt(word)&&!!splitNoun(word.de));
export const gameObject=(id:string)=>gameObjects.find(word=>word.id===id);

// ---- Artikel yağmuru ----
export type RainItem={id:string;article:Article;noun:string;de:string};
/** The pictures that fall, each word once, in a new order every time. */
export function rainRound(count=20,random:Random=Math.random):RainItem[]{
 return mix(gameObjects,random).slice(0,count).map(word=>{const {article,noun}=splitNoun(word.de)!;return {id:word.id,article,noun,de:word.de};});
}
export const RAIN_LIVES=3;
/** Seconds for a picture to fall: slower at first, faster with every right answer (never under 2.8 s). */
export function rainSeconds(correct:number){return Math.max(2.8,6-correct*0.25);}

// ---- Duy ve yakala ----
export type CatchItem={id:string;de:string;options:string[]};
/** A word to hear and four pictures (the other three from the same part of the vault when possible). */
export function catchRound(count=10,random:Random=Math.random):CatchItem[]{
 return mix(gameObjects,random).slice(0,count).map(word=>{
  const near=mix(gameObjects.filter(other=>other.id!==word.id&&other.topic===word.topic),random);
  const far=mix(gameObjects.filter(other=>other.id!==word.id&&other.topic!==word.topic),random);
  const others=[...near,...far].slice(0,3).map(other=>other.id);
  return {id:word.id,de:word.de,options:mix([word.id,...others],random)};
 });
}
export const CATCH_SECONDS=8;
/** Points for a right answer: 10, doubled after three right answers in a row, tripled after six. */
export function catchPoints(streakBefore:number){return 10*Math.min(3,1+Math.floor(streakBefore/3));}
export function catchMultiplier(streak:number){return Math.min(3,1+Math.floor(streak/3));}

// ---- 30 saniye: doğru mu? ----
export type QuickCard={key:string;kind:'object'|'verb';id:string;shown:string;correct:string;right:boolean};
/**
 * Picture + word cards, about half of them right. Wrong ones are near misses: another article for the same noun, or
 * the other helping verb / a wrong Perfekt form for the verb. `correct` is the right form, shown after a mistake.
 */
export function quickDeck(count=60,random:Random=Math.random):QuickCard[]{
 const cards:QuickCard[]=[];
 const objects=mix(gameObjects,random);const pictured=mix(verbs.filter(verb=>verbPicture(verb)),random);
 for(let i=0;cards.length<count&&(i<objects.length||i<pictured.length);i++){
  const word=objects[i%objects.length];
  if(word){const {article,noun}=splitNoun(word.de)!;const right=random()<0.5;const wrongArticle=mix(ARTICLES.filter(a=>a!==article),random)[0];
   cards.push({key:'o'+i,kind:'object',id:word.id,shown:right?word.de:wrongArticle+' '+noun,correct:word.de,right});}
  const verb=pictured[i%pictured.length];
  if(verb&&cards.length<count){const right=random()<0.5;const correct=verbPerfekt(verb);const wrong=mix(verb.perfektWrong.filter(form=>form&&form!==verb.perfekt),random)[0]??swapAux(verb);
   cards.push({key:'v'+i,kind:'verb',id:verb.id,shown:right?correct:wrong,correct,right:right||wrong===correct});}
 }
 return mix(cards,random).slice(0,count);
}
const verbPerfekt=(verb:Verb)=>verb.alsoIst?'hat/ist '+verb.participle:verb.perfekt;
const swapAux=(verb:Verb)=>(verb.aux==='hat'?'ist ':'hat ')+verb.participle;
export const QUICK_SECONDS=30;

// ---- Kelime avı ----
export type SearchWord={id:string;de:string;letters:string;row:number;col:number;across:boolean};
export type SearchGrid={size:number;cells:string[];words:SearchWord[]};
const FILL='ABCDEFGHIJKLMNOPRSTUVWZÄÖÜ';
const searchable=(noun:string,size:number)=>noun.length>=3&&noun.length<=size&&/^[A-Za-zÄÖÜäöü]+$/.test(noun);
/**
 * A square of letters with `count` hidden nouns (upper case), each left to right or top to bottom; crossing words share
 * a letter. Words come from one part of the vault when it has enough, so the grid has a theme.
 */
export function searchGrid(size=8,count=6,random:Random=Math.random):SearchGrid{
 const fits=gameObjects.filter(word=>searchable(splitNoun(word.de)!.noun,size));
 const topics=mix([...new Set(fits.map(word=>word.topic))],random);
 const topic=topics.find(id=>fits.filter(word=>word.topic===id).length>=count+2);
 const pool=mix(topic?fits.filter(word=>word.topic===topic):fits,random);
 for(let attempt=0;attempt<40;attempt++){
  const cells:string[]=Array(size*size).fill('');const words:SearchWord[]=[];const used=new Set<string>();
  for(const word of pool){
   if(words.length>=count)break;const letters=splitNoun(word.de)!.noun.toUpperCase();if(used.has(letters))continue;
   const spots:{row:number;col:number;across:boolean}[]=[];
   for(let row=0;row<size;row++)for(let col=0;col<size;col++)for(const across of [true,false]){
    if((across?col:row)+letters.length>size)continue;
    let ok=true;for(let k=0;k<letters.length&&ok;k++){const cell=cells[(row+(across?0:k))*size+col+(across?k:0)];if(cell&&cell!==letters[k])ok=false;}
    if(ok)spots.push({row,col,across});
   }
   if(!spots.length)continue;const spot=spots[Math.floor(random()*spots.length)];
   for(let k=0;k<letters.length;k++)cells[(spot.row+(spot.across?0:k))*size+spot.col+(spot.across?k:0)]=letters[k];
   words.push({id:word.id,de:word.de,letters,...spot});used.add(letters);
  }
  if(words.length<Math.min(count,pool.length))continue;
  return {size,cells:cells.map(cell=>cell||FILL[Math.floor(random()*FILL.length)]),words};
 }
 return {size,cells:Array(size*size).fill('A'),words:[]};
}
/** The word a straight line from one cell to another spells (left to right or top to bottom), if it is hidden there. */
export function searchFind(grid:SearchGrid,from:number,to:number):SearchWord|null{
 const a={row:Math.floor(from/grid.size),col:from%grid.size},b={row:Math.floor(to/grid.size),col:to%grid.size};
 const start=a.row<b.row||(a.row===b.row&&a.col<b.col)?a:b,end=start===a?b:a;
 const across=start.row===end.row;if(!across&&start.col!==end.col)return null;
 return grid.words.find(word=>word.across===across&&word.row===start.row&&word.col===start.col&&word.letters.length===(across?end.col-start.col:end.row-start.row)+1)??null;
}
/** The cells a hidden word covers. */
export function searchCells(grid:SearchGrid,word:SearchWord){return Array.from(word.letters,(_,k)=>(word.row+(word.across?0:k))*grid.size+word.col+(word.across?k:0));}

// ---- Koko'yu kurtar ----
export type RescueItem={id:string;article:Article;noun:string;de:string};
export const RESCUE_BALLOONS=6;
/** Letters of the on-screen keyboard. */
export const RESCUE_KEYS=[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ','Ä','Ö','Ü'];
export function rescueRound(count=5,random:Random=Math.random):RescueItem[]{
 return mix(gameObjects.filter(word=>{const noun=splitNoun(word.de)!.noun;return noun.length>=4&&noun.length<=11&&/^[A-Za-zÄÖÜäöü]+$/.test(noun);}),random).slice(0,count).map(word=>{const {article,noun}=splitNoun(word.de)!;return {id:word.id,article,noun,de:word.de};});
}
/** The noun with the guessed letters shown and the rest as blanks (case does not matter when guessing). */
export function rescueMask(noun:string,guessed:ReadonlySet<string>){return Array.from(noun,letter=>guessed.has(letter.toUpperCase())?letter:'_');}
export const rescueSolved=(noun:string,guessed:ReadonlySet<string>)=>Array.from(noun).every(letter=>guessed.has(letter.toUpperCase()));
export const rescueMisses=(noun:string,guessed:ReadonlySet<string>)=>[...guessed].filter(letter=>!noun.toUpperCase().includes(letter)).length;

// ---- Çoğul eşleştirme ----
export type PluralCard={id:string;pair:string;face:'singular'|'plural';text:string};
/** Six pairs: "der Tisch" ↔ "die Tische" (every plural takes die). */
export function pluralRound(pairs=6,random:Random=Math.random):PluralCard[]{
 const pool=gameObjects.filter(word=>Object.prototype.hasOwnProperty.call(pluralNouns,word.id));
 const cards:PluralCard[]=[];
 for(const word of mix(pool,random).slice(0,pairs)){
  cards.push({id:word.id+':singular',pair:word.id,face:'singular',text:word.de});
  cards.push({id:word.id+':plural',pair:word.id,face:'plural',text:'die '+pluralNouns[word.id]});
 }
 return mix(cards,random);
}
