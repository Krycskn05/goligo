'use client';
import {House} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {SiteLogo} from './site-logo';
import {SiteGreeting} from './site-greeting';
import {TopIcon} from './top-icons';
import {EffectsSettingsButton} from './learning-effects';
import type {StudyStats} from '@/lib/progress';
import type {VaultLanguage,VaultTranslations} from '@/lib/object-vault-copy';
import {pickText} from '@/lib/site-languages';

/** "My account", "Site language" and Koko's line, ordered like the site languages; later languages read them from their language pack. */
export const accountLabel:VaultTranslations=['Hesabım','Mein Konto','My account','حسابي','Мій акаунт','Mon compte','Mi cuenta','Мой аккаунт','حساب من','Moje konto','Il mio account','Minha conta'];
export const siteLanguageLabel:VaultTranslations=['Site dili','Seitensprache','Site language','لغة الموقع','Мова сайту','Langue du site','Idioma del sitio','Язык сайта','زبان سایت','Język strony','Lingua del sito','Idioma do site'];
/** The friendly line of the speech bubble in the site language (shown until the page knows the clock, then in its window). */
const greetingLine:VaultTranslations=['Bugün de birlikte öğrenelim.','Lass uns heute zusammen lernen.','Let’s learn together today.','لنتعلّم معًا اليوم.','Повчімося сьогодні разом.','Apprenons ensemble aujourd’hui.','Aprendamos juntos hoy.','Давай сегодня учиться вместе.','امروز هم با هم یاد بگیریم.','Uczmy się dziś razem.','Impariamo insieme oggi.','Vamos aprender juntos hoje.'];
type Props={language:VaultLanguage;languages:readonly {id:string;label:string}[];onLanguage:(id:string)=>void;homeHref:string;homeLabel:string;stats?:StudyStats|null;showHome?:boolean};
/**
 * The page header shared by the study pages: logo, site language, the home link, the sound
 * settings and the member's account page. The learner's progress lives at the bottom of the home page's left menu (stats is kept
 * for the pages that still pass it).
 */
export function SiteHeader({language,languages,onLanguage,homeHref,homeLabel,showHome=true}:Props){
 const label=pickText(siteLanguageLabel,language);const account=pickText(accountLabel,language);
 // The bubble says "Hallo!" until the page knows the learner's own clock (the server and the phone may be in different time zones).
 return <header className="work-header logo-header site-header">
  <span className="site-sparkle one" aria-hidden="true"/><span className="site-sparkle two" aria-hidden="true"/><span className="site-sparkle three" aria-hidden="true"/>
  <a className="work-brand site-logo-brand" href={homeHref} aria-label={SITE_NAME+' · '+homeLabel}><SiteLogo/></a>
  <SiteGreeting language={language} line={pickText(greetingLine,language)}/>
  <div className="site-header-tools">
   <label className="site-language"><TopIcon name="language" size={26}/><span className="site-language-label">{label}</span><select value={language} aria-label={label} onChange={event=>onLanguage(event.target.value)}>{languages.map(item=><option key={item.id} value={item.id} lang={item.id}>{item.label}</option>)}</select></label>
   <div className="site-header-buttons">
    {showHome&&<a className="object-back site-home" href={homeHref}><House size={17} aria-hidden="true"/><span>{homeLabel}</span></a>}
    <EffectsSettingsButton language={language}/>
    <a className="site-home site-account" href="/hesabim" aria-label={account} title={account}><TopIcon name="account" size={30}/></a>
   </div>
  </div>
 </header>;
}
