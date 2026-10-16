'use client';
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
type Props={language:VaultLanguage;languages:readonly {id:string;label:string}[];onLanguage:(id:string)=>void;homeHref:string;homeLabel:string;stats?:StudyStats|null;showHome?:boolean};
/**
 * The page header shared by the study pages: logo, site language, the home link, the sound
 * settings and the member's account page. The learner's progress lives at the bottom of the home page's left menu (stats is kept
 * for the pages that still pass it).
 */
export function SiteHeader({language,languages,onLanguage,homeHref,homeLabel,showHome=true}:Props){
 const label=siteLanguageLabel[language];
 return <header className="work-header logo-header site-header">
  <a className="work-brand site-logo-brand" href={homeHref} aria-label={SITE_NAME+' · '+homeLabel}><SiteLogo/></a>
  <div className="site-header-tools">
   <label className="site-language"><Globe size={16} aria-hidden="true"/><span className="site-language-label">{label}</span><select value={language} aria-label={label} onChange={event=>onLanguage(event.target.value)}>{languages.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
   {showHome&&<a className="object-back site-home" href={homeHref}><House size={17} aria-hidden="true"/><span>{homeLabel}</span></a>}
   <EffectsSettingsButton language={language}/>
   <a className="site-home site-account" href="/hesabim" aria-label={accountLabel[language]??accountLabel.tr} title={accountLabel[language]??accountLabel.tr}><UserRound size={19} aria-hidden="true"/></a>
  </div>
 </header>;
}
