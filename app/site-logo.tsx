'use client';
import {useEffect,useState} from 'react';
import {usePaulMotion} from './paul-hoca';

/**
 * Goliqo's logo and mascot, from the learner's own logo files (made in ChatGPT): the book mascot with the word
 * "Goliqo", a bouncing gold ball (it jumps out of the mascot's hand over the letters onto the "i") and the mascot
 * waving. public/branding: 20 frames a second like the learner's files, twice the shown size, cropped to the logo;
 * the still pictures are single frames of them.
 * With motion off (the site setting or the device) only the still pictures show.
 */
export const BRAND={
 logo:'/branding/goliqo-logo.webp',logoBounce:'/branding/goliqo-logo-zipla.webp',
 mascot:'/branding/goliqo-maskot.webp',mascotWave:'/branding/goliqo-maskot-el-salla.webp',
} as const;
/** True once the animated picture has loaded (the small still picture shows until then; never with motion off). */
function useAnimated(src:string){
 const motion=usePaulMotion();const [loaded,setLoaded]=useState(false);
 useEffect(()=>{
  if(!motion||!wantsAnimation())return;
  // The animated files are big (2–3 MB): they are fetched once the page is idle, so the page itself loads first.
  let alive=true;let image:HTMLImageElement|null=null;
  const start=()=>{if(!alive)return;image=new Image();image.onload=()=>{if(alive)setLoaded(true);};image.src=src;};
  const idle='requestIdleCallback' in window?window.requestIdleCallback.bind(window):null;
  const handle=idle?idle(start,{timeout:2500}):window.setTimeout(start,600);
  return()=>{alive=false;if(idle)window.cancelIdleCallback(handle);else clearTimeout(handle);};
 },[motion,src]);
 return loaded&&motion;
}
/** Not on a slow or metered connection: the still picture is enough there (the big animated file is never fetched). */
function wantsAnimation(){
 const connection=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
 if(!connection)return true;
 return !connection.saveData&&!/(^|-)2g$/.test(connection.effectiveType??'');
}

/**
 * The header logo (every page): the gold ball bounces over the letters onto the "i", again and again (the learner
 * asked for it to play all the time, in high quality: 20 frames a second, twice the shown size). The still logo comes
 * first; the animation is fetched after the page is ready and shown as soon as it has loaded.
 */
export function SiteLogo(){
 const bounce=useAnimated(BRAND.logoBounce);
 return <img className="site-logo-art" src={bounce?BRAND.logoBounce:BRAND.logo} alt="" width={496} height={182} decoding="async" draggable={false} data-logo-bounce={bounce?'':undefined}/>;
}

/** The book mascot waving (welcome page, sign-in and sign-up, Hesabım, the "Alles klar?" test of Lektion 12). */
export function BrandMascot({className=''}:{className?:string}){
 const animated=useAnimated(BRAND.mascotWave);
 return <img className={('brand-mascot '+className).trim()} src={animated?BRAND.mascotWave:BRAND.mascot} alt="" width={340} height={256} decoding="async" draggable={false}/>;
}

