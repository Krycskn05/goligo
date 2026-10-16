export type PuzzlePart={index:number;character:string;editable:boolean};
export type LetterPuzzleModel={parts:PuzzlePart[];editable: number[]};
export type PuzzleLetters=Record<number,string>;
export const puzzleCharacter=(value:string)=>Array.from(value.normalize('NFC')).filter(character=>/[\p{L}\p{N}]/u.test(character));

function seedNumber(value:string){let result=2166136261;for(const character of value){result=Math.imul(result^character.charCodeAt(0),16777619);}return result>>>0;}

/** Stable clues for a saved question; every word retains at least one gap. */
export function makeLetterPuzzle(answer:string,seed=answer,course:'de'|'en'='de'):LetterPuzzleModel{
 const characters=Array.from(answer.normalize('NFC'));const visible=new Set<number>();
 let word:number[]=[];let wordNumber=0;
 function finishWord(){
  const size=word.length;if(!size)return;
  if(course==='de'&&/\s/.test(answer)&&/^(der|die|das)$/i.test(word.map(index=>characters[index]).join(''))){word.forEach(index=>visible.add(index));word=[];wordNumber++;return;}
  const target=Math.min(size-1,Math.max(1,Math.floor(size*0.4)));
  const anchor=/[äöüÄÖÜß]/.test(characters[word[0]])?word[size-1]:word[0];
  if(target>0)visible.add(anchor);
  const interior=word.filter(index=>index!==anchor&&!/[äöüÄÖÜß]/.test(characters[index])).sort((a,b)=>seedNumber(seed+':'+wordNumber+':'+a)-seedNumber(seed+':'+wordNumber+':'+b));
  for(const index of interior){if(word.filter(i=>visible.has(i)).length>=target)break;visible.add(index);}
  word=[];wordNumber++;
 }
 characters.forEach((character,index)=>{if(/[\p{L}\p{N}]/u.test(character))word.push(index);else finishWord();});finishWord();
 const parts=characters.map((character,index)=>({index,character,editable:/[\p{L}\p{N}]/u.test(character)&&!visible.has(index)}));
 return {parts,editable:parts.filter(part=>part.editable).map(part=>part.index)};
}

export function completeLetterPuzzle(puzzle:LetterPuzzleModel,letters:PuzzleLetters){
 const filled=puzzle.editable.filter(index=>puzzleCharacter(letters[index]??'').length===1).length;
 const complete=filled===puzzle.editable.length;
 const answer=puzzle.parts.map(part=>part.editable?(letters[part.index]??''):part.character).join('');
 return {filled,complete,answer};
}

export function readPuzzleDraft(puzzle:LetterPuzzleModel,key:string):PuzzleLetters{
 try{const data=JSON.parse(localStorage.getItem(key)??'{}');const result:PuzzleLetters={};for(const index of puzzle.editable){const letter=typeof data?.[index]==='string'?puzzleCharacter(data[index]):[];if(letter.length===1)result[index]=letter[0];}return result;}catch{return {};}
}

export type LetterToken={id:string;letter:string};
export type LetterPlacements=Record<number,string>;
export function seededOrder<T>(items:readonly T[],seed:string):T[]{const result=[...items];let state=seedNumber(seed)||1;for(let i=result.length-1;i>0;i--){state^=state<<13;state^=state>>>17;state^=state<<5;const j=(state>>>0)%(i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
export function makeLetterBank(puzzle:LetterPuzzleModel,seed:string,_course:'de'|'en'='de'):LetterToken[]{
 // Keep required token IDs stable for saved drafts; only surplus tiles go away.
 const required=puzzle.editable.map(index=>puzzle.parts[index].character);
 return seededOrder(required.map((letter,index)=>({id:'tile-'+index,letter})),seed+':bank');
}
export type LetterChoice=LetterToken&{count:number};
/** One compact choice per remaining letter, retaining its actual token count. */
export function remainingLetterChoices(bank:LetterToken[],placements:LetterPlacements):LetterChoice[]{
 const used=new Set(Object.values(placements));const groups=new Map<string,LetterChoice>();
 for(const token of bank){
  let group=groups.get(token.letter);
  if(!group){group={id:'',letter:token.letter,count:0};groups.set(token.letter,group);}
  if(used.has(token.id))continue;
  if(group.count===0)group.id=token.id;
  group.count++;
 }
 return [...groups.values()].filter(group=>group.count>0);
}
export function placedLetters(placements:LetterPlacements,bank:LetterToken[]):PuzzleLetters{const byId=new Map(bank.map(token=>[token.id,token.letter]));return Object.fromEntries(Object.entries(placements).flatMap(([index,id])=>byId.has(id)?[[index,byId.get(id)!]]:[]));}
export function readLetterBankDraft(puzzle:LetterPuzzleModel,bank:LetterToken[],key:string):LetterPlacements{
 try{const data=JSON.parse(localStorage.getItem(key)??'{}');const slots=data?.version===2||data?.version===3?data.slots:null;const result:LetterPlacements={};const used=new Set<string>();for(const index of puzzle.editable){const token=slots?bank.find(item=>item.id===slots[index]):bank.find(item=>item.letter.toLocaleLowerCase('de')===String(data?.[index]??'').toLocaleLowerCase('de')&&!used.has(item.id));if(token&&!used.has(token.id)){result[index]=token.id;used.add(token.id);}}return result;}catch{return {};}
}

/** Whether a letter belongs in a box (case only counts when the answer is case-strict). */
export function letterFits(puzzle:LetterPuzzleModel,index:number,letter:string,strictCase=false,course:'de'|'en'='de'){
 const target=puzzle.parts[index]?.character??'';
 return strictCase?letter===target:letter.toLocaleLowerCase(course)===target.toLocaleLowerCase(course);
}
/** The tile to place for a letter: the exact letter first, then the same letter in the other case. */
export function tileForLetter(choices:readonly LetterChoice[],letter:string,course:'de'|'en'='de'):LetterChoice|undefined{
 return choices.find(choice=>choice.letter===letter)??choices.find(choice=>choice.letter.toLocaleLowerCase(course)===letter.toLocaleLowerCase(course));
}
/** A wrong letter goes back at once, but the answer that is checked keeps the first wrong letter, so the question counts as a mistake. */
export type PuzzleMistakes={count:number;first:{index:number;letter:string}|null;boxes:number[]};
export const noMistakes:PuzzleMistakes={count:0,first:null,boxes:[]};
export function scoredLetterAnswer(puzzle:LetterPuzzleModel,letters:PuzzleLetters,mistakes:PuzzleMistakes){
 return puzzle.parts.map(part=>mistakes.first&&part.index===mistakes.first.index?mistakes.first.letter:part.editable?(letters[part.index]??''):part.character).join('');
}
/** Hints place the next right letter; about a third of the boxes (at least one) can be helped. */
export function hintLimit(puzzle:LetterPuzzleModel){return Math.max(1,Math.floor(puzzle.editable.length/3));}
export type PuzzleHints={used:number;boxes:number[]};
export const noHints:PuzzleHints={used:0,boxes:[]};
/** Mistakes and hints saved with the draft, so leaving and coming back keeps them. */
export function readPuzzleExtras(puzzle:LetterPuzzleModel,key:string):{mistakes:PuzzleMistakes;hints:PuzzleHints}{
 try{
  const data=JSON.parse(localStorage.getItem(key)??'{}');if(data?.version!==3)return {mistakes:noMistakes,hints:noHints};
  const inPuzzle=(value:unknown):value is number=>typeof value==='number'&&puzzle.editable.includes(value);
  const m=data.mistakes??{};const first=m.first&&inPuzzle(m.first.index)&&typeof m.first.letter==='string'&&puzzleCharacter(m.first.letter).length===1?{index:m.first.index,letter:puzzleCharacter(m.first.letter)[0]}:null;
  const mistakes={count:first?Math.max(1,Number(m.count)||1):0,first,boxes:Array.isArray(m.boxes)?m.boxes.filter(inPuzzle):[]};
  const h=data.hints??{};const hints={used:Math.min(hintLimit(puzzle),Math.max(0,Number(h.used)||0)),boxes:Array.isArray(h.boxes)?h.boxes.filter(inPuzzle):[]};
  return {mistakes,hints};
 }catch{return {mistakes:noMistakes,hints:noHints};}
}
