'use client';
import type {ReactNode} from 'react';
import {NavIcon,type NavIconName} from './nav-icons';
import {PaulHoca} from './paul-hoca';
import {HeroArt} from './toon-art';
import type {StudyLanguage} from '@/lib/study-languages';
import {homeText,type HomeCopyKey} from '@/lib/home-copy';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {verbText} from '@/lib/verb-copy';
import {objectVocabulary} from '@/lib/object-course';
import {verbs} from '@/lib/verb-course';
import {verbPicture,verbsHeroPicture} from '@/lib/verb-logic';

export const KOKO_PICTURE='/branding/koko-mascot.png';
type Part={id:string;icon:NavIconName;href:string;title:string;de:string;text:string;art:ReactNode};
const verbArt=(id:string)=>{const verb=verbs.find(item=>item.id===id);const src=verb?verbPicture(verb):null;return src?<img src={src} alt="" width={512} height={512} loading="lazy"/>:null;};

/** The main parts of the site, exactly the items of the left menu, in the same order (no lessons inside them). */
function siteParts(language:StudyLanguage):Part[]{
 const h=(key:HomeCopyKey)=>homeText(language,key);
 return [
  {id:'units',icon:'units',href:'/konular',title:c(language,'catalogTitle'),de:'A1.1 · A1.2',text:h('unitsText'),art:<HeroArt alt=""/>},
  {id:'vault',icon:'vault',href:'/ev-esyalar?learn=de',title:vaultText(language,'vaultTitle'),de:objectVocabulary.length+' Gegenstände',text:h('vaultText'),art:<HeroArt variant="objects" alt=""/>},
  {id:'verbs',icon:'verbs',href:'/fiiller',title:verbText(language,'workshopTitle'),de:verbs.length+' Verben',text:h('verbsText'),art:<img src={verbsHeroPicture} alt="" width={1200} height={800} loading="lazy"/>},
  {id:'games',icon:'games',href:'/fiiller?bolum=oyunlar',title:verbText(language,'gamesTitle'),de:'Spiele',text:h('gamesText'),art:verbArt('fahren')},
  {id:'mistakes',icon:'mistakes',href:'/fiiller?bolum=yanlislar',title:verbText(language,'mistakesTitle'),de:'Fehler',text:h('mistakesText'),art:verbArt('schreiben')},
 ];
}

/**
 * The home page a signed-in learner sees first (design "Resimli tanıtım", as the learner chose): it only
 * introduces the site — Koko and Paul Hoca (waving), a welcome and a short text, then one picture card per main part of the site
 * (the items of the left menu; the lessons inside them are not shown here).
 * The whole card is the link. Nothing to study or track here; the units catalogue is at /konular.
 */
export function HomeTour({language}:{language:StudyLanguage}){
 const h=(key:HomeCopyKey)=>homeText(language,key);
 return <div className="ht" data-home-tour="">
  <section className="ht-hero" aria-labelledby="work-heading">
   {/* Koko and Paul Hoca (waving) welcome the learner together. */}
   <div className="ht-hosts"><img className="ht-koko" src={KOKO_PICTURE} alt="" width={400} height={319}/><PaulHoca pose="hello" className="ht-paul"/></div>
   <h1 id="work-heading" tabIndex={-1}>{h('welcome')}</h1>
   <p>{h('about')}</p>
  </section>
  <h2 className="ht-title">{h('tourTitle')}</h2>
  <ul className="ht-grid">{siteParts(language).map(part=><li key={part.id} data-home-part={part.id}>
   <a className="ht-card panel" href={part.href}>
    <span className="ht-art" aria-hidden="true">{part.art}</span>
    <span className="ht-name"><NavIcon name={part.icon}/><strong>{part.title}</strong></span>
    <small lang="de" dir="ltr">{part.de}</small>
    <span className="ht-text">{part.text}</span>
   </a>
  </li>)}</ul>
 </div>;
}
