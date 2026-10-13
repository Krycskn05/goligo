import {useId} from 'react';
import topicArt from '@/lib/toon-topic-art.json';
import objectArt from '@/lib/object-toon-art.json';
import heroArt from '@/lib/toon-hero-art.json';
export type RasterSprite={src:string;width:number;height:number;crop:{x:number;y:number;width:number;height:number}};
export function RasterArt({art,title,className=''}:{art:RasterSprite;title:string;className?:string}){
 const clipId=useId();
 return <svg className={'toon-art '+className} role="img" aria-label={title} focusable="false" width="400" height="280" viewBox={[art.crop.x,art.crop.y,art.crop.width,art.crop.height].join(' ')} preserveAspectRatio="xMidYMid meet"><defs><clipPath id={clipId} clipPathUnits="userSpaceOnUse"><rect x={art.crop.x} y={art.crop.y} width={art.crop.width} height={art.crop.height}/></clipPath></defs><image href={art.src} x="0" y="0" width={art.width} height={art.height} clipPath={'url(#'+clipId+')'}/></svg>;
}
export function TopicArt({id,title}:{id:string;title:string}){
 const art=(topicArt.units as Record<string,RasterSprite>)[id];return art?<RasterArt art={art} title={title}/>:null;
}
export function ObjectArt({id,title}:{id:string;title:string}){
 const art=(objectArt as Record<string,RasterSprite>)[id];return art?<RasterArt art={art} title={title}/>:null;
}
export function HeroArt({variant='course',alt}:{variant?:'course'|'objects';alt?:string}){const art=heroArt[variant];return <img className="toon-hero-image" src={art.src} alt={alt??art.alt} width={art.width} height={art.height}/>;}
