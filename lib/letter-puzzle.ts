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
 try{const data=JSON.parse(localStorage.getItem(key)??'{}');const slots=data?.version===2?data.slots:null;const result:LetterPlacements={};const used=new Set<string>();for(const index of puzzle.editable){const token=slots?bank.find(item=>item.id===slots[index]):bank.find(item=>item.letter.toLocaleLowerCase('de')===String(data?.[index]??'').toLocaleLowerCase('de')&&!used.has(item.id));if(token&&!used.has(token.id)){result[index]=token.id;used.add(token.id);}}return result;}catch{return {};}
}
