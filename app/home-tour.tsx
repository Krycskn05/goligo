'use client';
import type {ReactNode} from 'react';
import {NavIcon,type NavIconName} from './nav-icons';
import type {StudyLanguage} from '@/lib/study-languages';
import {homeText,type HomeCopyKey} from '@/lib/home-copy';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {verbText} from '@/lib/verb-copy';
import {objectVocabulary} from '@/lib/object-course';
import {verbs} from '@/lib/verb-course';

type Part={id:string;icon:NavIconName;href:string;title:string;de:string;text:string;art:ReactNode};

/** The main parts of the site, exactly the items of the left menu, in the same order (no lessons inside them). */
function siteParts(language:StudyLanguage):Part[]{
 const h=(key:HomeCopyKey)=>homeText(language,key);
 // The learner's own pictures for each card (made in ChatGPT, public/toon/home: 1200 × 600 WebP).
 const art=(id:string)=><img src={'/toon/home/'+id+'.webp'} alt="" width={1200} height={600} loading="lazy" decoding="async"/>;
 return [
  {id:'units',icon:'units',href:'/konular',title:c(language,'catalogTitle'),de:'A1.1 · A1.2',text:h('unitsText'),art:art('units')},
  {id:'vault',icon:'vault',href:'/ev-esyalar?learn=de',title:vaultText(language,'vaultTitle'),de:objectVocabulary.length+' Gegenstände',text:h('vaultText'),art:art('vault')},
  {id:'verbs',icon:'verbs',href:'/fiiller',title:verbText(language,'workshopTitle'),de:verbs.length+' Verben',text:h('verbsText'),art:art('verbs')},
  {id:'games',icon:'games',href:'/fiiller?bolum=oyunlar',title:verbText(language,'gamesTitle'),de:'Spiele',text:h('gamesText'),art:art('games')},
  {id:'mistakes',icon:'mistakes',href:'/fiiller?bolum=yanlislar',title:verbText(language,'mistakesTitle'),de:'Fehler',text:h('mistakesText'),art:art('mistakes')},
 ];
}

/**
 * The home page a signed-in learner sees first (design "Resimli tanıtım", as the learner chose): it only
 * introduces the site — a welcome and a short text (no picture above it: the learner removed it), then one picture card per main part of the site
 * (the items of the left menu; the lessons inside them are not shown here).
 * The whole card is the link. Nothing to study or track here; the units catalogue is at /konular.
 */
export function HomeTour({language}:{language:StudyLanguage}){
 const h=(key:HomeCopyKey)=>homeText(language,key);
 return <div className="ht" data-home-tour="">
  <section className="ht-hero" aria-labelledby="work-heading">
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
