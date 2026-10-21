import {Fragment,type ReactNode} from 'react';

/**
 * Turns the marks of a translated text into page parts: {name}…{/name} wraps a phrase (bold, a link) and {name} alone
 * is a value (lib/public-copy.ts, lib/legal-copy.ts). Marks without a part stay as written; nothing is read as HTML.
 */
export function richText(text:string,parts:Record<string,(inner:string)=>ReactNode>):ReactNode[]{
 const out:ReactNode[]=[];const pattern=/\{(\w+)\}(?:([\s\S]*?)\{\/\1\})?/g;
 let last=0,key=0;let match:RegExpExecArray|null;
 while((match=pattern.exec(text))){
  const make=Object.prototype.hasOwnProperty.call(parts,match[1])?parts[match[1]]:null;
  if(!make)continue;
  if(match.index>last)out.push(text.slice(last,match.index));
  out.push(<Fragment key={key++}>{make(match[2]??'')}</Fragment>);
  last=pattern.lastIndex;
 }
 if(last<text.length)out.push(text.slice(last));
 return out;
}
