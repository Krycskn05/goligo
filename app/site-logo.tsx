'use client';
import {useEffect,useState} from 'react';
import {usePaulMotion} from './paul-hoca';

/**
 * Goliqo's logo and mascot, from the learner's own logo files (made in ChatGPT): the book mascot with the word
 * "Goliqo", a bouncing gold ball (it jumps out of the mascot's hand over the letters onto the "i") and the mascot
 * waving. public/branding: 10 frames a second, cropped to the logo; the still pictures are single frames of them.
 * With motion off (the site setting or the device) only the still pictures show.
 */
export const BRAND={
 logo:'/branding/goliqo-logo.webp',logoBounce:'/branding/goliqo-logo-zipla.webp',
 logoWave:'/branding/goliqo-logo-el-salla.webp',logoWaveStill:'/branding/goliqo-logo-buyuk.webp',
 mascot:'/branding/goliqo-maskot.webp',mascotWave:'/branding/goliqo-maskot-el-salla.webp',
} as const;
const BOUNCE_KEY='lernkoko-logo-bounce';

/**
 * The header logo (every page). The first page of a visit plays the bouncing ball once — fetched after the page is
 * ready and shown as soon as it has loaded, it ends on the still logo — every other page shows the still logo.
 */
export function SiteLogo(){
 const motion=usePaulMotion();
 const [bounce,setBounce]=useState(false);
 useEffect(()=>{
  if(!motion)return;
  try{if(sessionStorage.getItem(BOUNCE_KEY))return;}catch{return;}
  let alive=true;
  const timer=setTimeout(()=>{const image=new Image();image.onload=()=>{if(!alive)return;try{sessionStorage.setItem(BOUNCE_KEY,'1');}catch{}setBounce(true);};image.src=BRAND.logoBounce;},700);
  return()=>{alive=false;clearTimeout(timer);};
 },[motion]);
 return <img className="site-logo-art" src={bounce&&motion?BRAND.logoBounce:BRAND.logo} alt="" width={372} height={136} decoding="async" draggable={false} data-logo-bounce={bounce&&motion?'':undefined}/>;
}

/** The animated picture after the page is ready (the small still picture comes first, so pages open fast). */
function useAnimated(){
 const motion=usePaulMotion();const [ready,setReady]=useState(false);
 useEffect(()=>{setReady(true);},[]);
 return ready&&motion;
}

/** The book mascot waving (welcome page, sign-in and sign-up, Hesabım, the "Alles klar?" test of Lektion 12). */
export function BrandMascot({className=''}:{className?:string}){
 const animated=useAnimated();
 return <img className={('brand-mascot '+className).trim()} src={animated?BRAND.mascotWave:BRAND.mascot} alt="" width={240} height={181} decoding="async" draggable={false}/>;
}

/** The whole logo with the mascot waving (the big logo on the introduction page). */
export function BrandLogoWave({className=''}:{className?:string}){
 const animated=useAnimated();
 return <img className={('brand-logo-wave '+className).trim()} src={animated?BRAND.logoWave:BRAND.logoWaveStill} alt="Goliqo" width={480} height={176} decoding="async" draggable={false}/>;
}
