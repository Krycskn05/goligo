import {useId} from 'react';
import topicArt from '@/lib/toon-topic-art.json';
import objectArt from '@/lib/object-toon-art.json';
import heroArt from '@/lib/toon-hero-art.json';
/** `fill`: a plain colour around the picture instead of its stretched edges (for pictures whose edge is not plain background). */
export type RasterSprite={src:string;width:number;height:number;crop:{x:number;y:number;width:number;height:number};fill?:string};
/**
 * A cropped picture that fills its box like one image: the picture is shown whole ("meet"),
 * and the strips beside it extend the picture's own edge colours, so no second background shows.
 */
export function RasterArt({art,title,className=''}:{art:RasterSprite;title:string;className?:string}){
 const clipId=useId();const c=art.crop;const far=4000;const edge=3;
 const box=[c.x,c.y,c.width,c.height].join(' ');
 const strip=(key:string,x:number,y:number,width:number,height:number,view:number[])=><svg key={key} x={x} y={y} width={width} height={height} viewBox={view.join(' ')} preserveAspectRatio="none" aria-hidden="true"><image href={art.src} x="0" y="0" width={art.width} height={art.height}/></svg>;
 return <svg className={'toon-art '+className} role="img" aria-label={title} focusable="false" width="400" height="280" viewBox={box} preserveAspectRatio="xMidYMid meet"><defs><clipPath id={clipId} clipPathUnits="userSpaceOnUse"><rect x={c.x} y={c.y} width={c.width} height={c.height}/></clipPath></defs>
  {art.fill?<rect x={c.x-far} y={c.y-far} width={c.width+2*far} height={c.height+2*far} fill={art.fill}/>:<>
  {strip('l',c.x-far,c.y-far,far,c.height+2*far,[c.x,c.y,edge,c.height])}
  {strip('r',c.x+c.width,c.y-far,far,c.height+2*far,[c.x+c.width-edge,c.y,edge,c.height])}
  {strip('t',c.x,c.y-far,c.width,far,[c.x,c.y,c.width,edge])}
  {strip('b',c.x,c.y+c.height,c.width,far,[c.x,c.y+c.height-edge,c.width,edge])}</>}
  <image href={art.src} x="0" y="0" width={art.width} height={art.height} clipPath={'url(#'+clipId+')'}/></svg>;
}
export function TopicArt({id,title}:{id:string;title:string}){
 const art=(topicArt.units as Record<string,RasterSprite>)[id];return art?<RasterArt art={art} title={title}/>:null;
}
export function ObjectArt({id,title}:{id:string;title:string}){
 const art=(objectArt as Record<string,RasterSprite>)[id];return art?<RasterArt art={art} title={title}/>:null;
}
export function HeroArt({variant='course',alt}:{variant?:'course'|'objects';alt?:string}){const art=heroArt[variant];return <img className="toon-hero-image" src={art.src} alt={alt??art.alt} width={art.width} height={art.height}/>;}
