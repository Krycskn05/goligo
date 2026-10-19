'use client';
import {useEffect,useState} from 'react';
import {Globe,House,UserRound} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {SiteLogo} from './site-logo';
import {EffectsSettingsButton} from './learning-effects';
import type {StudyStats} from '@/lib/progress';
import type {VaultLanguage} from '@/lib/object-vault-copy';

/** "Site language" in every interface language (the picker changes the whole page, not only explanations). */
/** "My account" in every interface language. */
const accountLabel:Record<VaultLanguage,string>={tr:'Hesabım',de:'Mein Konto',en:'My account',ar:'حسابي',uk:'Мій акаунт',fr:'Mon compte',es:'Mi cuenta',ru:'Мой аккаунт',fa:'حساب من',pl:'Moje konto',it:'Il mio account',pt:'Minha conta'};
const siteLanguageLabel:Record<VaultLanguage,string>={tr:'Site dili',de:'Seitensprache',en:'Site language',ar:'لغة الموقع',uk:'Мова сайту',fr:'Langue du site',es:'Idioma del sitio',ru:'Язык сайта',fa:'زبان سایت',pl:'Język strony',it:'Lingua del sito',pt:'Idioma do site'};
/** Koko's speech bubble: a German greeting for the time of day, and one friendly line in the site language. */
const greetingLine:Record<VaultLanguage,string>={tr:'Bugün de birlikte öğrenelim.',de:'Lass uns heute zusammen lernen.',en:'Let’s learn together today.',ar:'لنتعلّم معًا اليوم.',uk:'Повчімося сьогодні разом.',fr:'Apprenons ensemble aujourd’hui.',es:'Aprendamos juntos hoy.',ru:'Давай сегодня учиться вместе.',fa:'امروز هم با هم یاد بگیریم.',pl:'Uczmy się dziś razem.',it:'Impariamo insieme oggi.',pt:'Vamos aprender juntos hoje.'};
export function germanGreeting(hour:number){return hour>=5&&hour<11?'Guten Morgen!':hour>=11&&hour<18?'Guten Tag!':hour>=18?'Guten Abend!':'Hallo!';}
type Props={language:VaultLanguage;languages:readonly {id:string;label:string}[];onLanguage:(id:string)=>void;homeHref:string;homeLabel:string;stats?:StudyStats|null;showHome?:boolean};
/**
 * The page header shared by the study pages: logo, site language, the home link, the sound
 * settings and the member's account page. The learner's progress lives at the bottom of the home page's left menu (stats is kept
 * for the pages that still pass it).
 */
export function SiteHeader({language,languages,onLanguage,homeHref,homeLabel,showHome=true}:Props){
 const label=siteLanguageLabel[language];
 // "Hallo!" until the page knows the learner's own clock (the server and the phone may be in different time zones).
 const [greeting,setGreeting]=useState('Hallo!');
 useEffect(()=>{setGreeting(germanGreeting(new Date().getHours()));},[]);
 return <header className="work-header logo-header site-header">
  <span className="site-sparkle one" aria-hidden="true"/><span className="site-sparkle two" aria-hidden="true"/><span className="site-sparkle three" aria-hidden="true"/>
  <a className="work-brand site-logo-brand" href={homeHref} aria-label={SITE_NAME+' · '+homeLabel}><SiteLogo/></a>
  <p className="site-greeting"><b lang="de" dir="ltr">{greeting}</b><span lang={language}>{greetingLine[language]??greetingLine.tr}</span></p>
  <div className="site-header-tools">
   <label className="site-language"><Globe size={16} aria-hidden="true"/><span className="site-language-label">{label}</span><select value={language} aria-label={label} onChange={event=>onLanguage(event.target.value)}>{languages.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
   {showHome&&<a className="object-back site-home" href={homeHref}><House size={17} aria-hidden="true"/><span>{homeLabel}</span></a>}
   <EffectsSettingsButton language={language}/>
   <a className="site-home site-account" href="/hesabim" aria-label={accountLabel[language]??accountLabel.tr} title={accountLabel[language]??accountLabel.tr}><UserRound size={19} aria-hidden="true"/></a>
  </div>
 </header>;
}
