'use client';
import {House} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {SiteLogo} from './site-logo';
import {SiteGreeting} from './site-greeting';
import {TopIcon} from './top-icons';
import {EffectsSettingsButton} from './learning-effects';
import {AccountMenu} from './account-menu';
import type {StudyStats} from '@/lib/progress';
import type {VaultLanguage,VaultTranslations} from '@/lib/object-vault-copy';
import {pickText} from '@/lib/site-languages';
import {accountLabel,siteLanguageLabel} from '@/lib/header-copy';
export {accountLabel,siteLanguageLabel};

/** The friendly line of the speech bubble in the site language, ordered like the site languages (later languages read it
 * from their language pack; shown until the page knows the clock, then in its window). */
const greetingLine:VaultTranslations=['Bugün de birlikte öğrenelim.','Lass uns heute zusammen lernen.','Let’s learn together today.','لنتعلّم معًا اليوم.','Повчімося сьогодні разом.','Apprenons ensemble aujourd’hui.','Aprendamos juntos hoy.','Давай сегодня учиться вместе.','امروز هم با هم یاد بگیریم.','Uczmy się dziś razem.','Impariamo insieme oggi.','Vamos aprender juntos hoje.'];
type Props={language:VaultLanguage;languages:readonly {id:string;label:string}[];onLanguage:(id:string)=>void;homeHref:string;homeLabel:string;stats?:StudyStats|null;showHome?:boolean;guest?:boolean};
/**
 * The page header shared by the study pages: logo, site language, the home link, the sound
 * settings and the account button with its menu (app/account-menu.tsx; a visitor without an account — the guest taste —
 * gets sign in and sign up there). The learner's progress lives at the bottom of the home page's left menu (stats is kept
 * for the pages that still pass it).
 */
export function SiteHeader({language,languages,onLanguage,homeHref,homeLabel,showHome=true,guest=false}:Props){
 const label=pickText(siteLanguageLabel,language);
 // The bubble says "Hallo!" until the page knows the learner's own clock (the server and the phone may be in different time zones).
 return <header className="work-header logo-header site-header">
  <span className="site-sparkle one" aria-hidden="true"/><span className="site-sparkle two" aria-hidden="true"/><span className="site-sparkle three" aria-hidden="true"/>
  <a className="work-brand site-logo-brand" href={homeHref} aria-label={SITE_NAME+' · '+homeLabel}><SiteLogo/></a>
  <SiteGreeting language={language} line={pickText(greetingLine,language)}/>
  <div className="site-header-tools">
   <label className="site-language"><TopIcon name="language" size={26}/><span className="site-language-label">{label}</span><span className="site-language-code" aria-hidden="true">{language.toUpperCase()}</span><select value={language} aria-label={label} onChange={event=>onLanguage(event.target.value)}>{languages.map(item=><option key={item.id} value={item.id} lang={item.id}>{item.label}</option>)}</select></label>
   <div className="site-header-buttons">
    {showHome&&<a className="object-back site-home" href={homeHref}><House size={17} aria-hidden="true"/><span>{homeLabel}</span></a>}
    <EffectsSettingsButton language={language}/>
    <AccountMenu language={language} guest={guest}/>
   </div>
  </div>
 </header>;
}
