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
 logoWave:'/branding/goliqo-logo-el-salla.webp',logoWaveStill:'/branding/goliqo-logo-buyuk.webp',
 mascot:'/branding/goliqo-maskot.webp',mascotWave:'/branding/goliqo-maskot-el-salla.webp',
} as const;
/** True once the animated picture has loaded (the small still picture shows until then; never with motion off). */
function useAnimated(src:string){
 const motion=usePaulMotion();const [loaded,setLoaded]=useState(false);
 useEffect(()=>{
  if(!motion)return;
  let alive=true;const image=new Image();image.onload=()=>{if(alive)setLoaded(true);};image.src=src;
  return()=>{alive=false;};
 },[motion,src]);
 return loaded&&motion;
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

/** The whole logo with the mascot waving (the big logo on the introduction page). */
export function BrandLogoWave({className=''}:{className?:string}){
 const animated=useAnimated(BRAND.logoWave);
 return <img className={('brand-logo-wave '+className).trim()} src={animated?BRAND.logoWave:BRAND.logoWaveStill} alt="Goliqo" width={560} height={205} decoding="async" draggable={false}/>;
}
