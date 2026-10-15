'use client';
import {Flame,Globe,House,Trophy} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {SiteLogo} from './site-logo';
import {EffectsSettingsButton} from './learning-effects';
import {progressSummary,type StudyStats} from '@/lib/progress';
import {progressText} from '@/lib/progress-copy';
import type {VaultLanguage} from '@/lib/object-vault-copy';

/** "Site language" in every interface language (the picker changes the whole page, not only explanations). */
const siteLanguageLabel:Record<VaultLanguage,string>={tr:'Site dili',de:'Seitensprache',en:'Site language',ar:'لغة الموقع',uk:'Мова сайту',fr:'Langue du site',es:'Idioma del sitio',ru:'Язык сайта',fa:'زبان سایت',pl:'Język strony',it:'Lingua del sito',pt:'Idioma do site'};
type Props={language:VaultLanguage;languages:readonly {id:string;label:string}[];onLanguage:(id:string)=>void;homeHref:string;homeLabel:string;stats?:StudyStats|null;showHome?:boolean};
/**
 * The page header shared by the study pages: logo, site language, the learner's level and
 * day streak as one compact bar, the home link and the sound settings.
 */
export function SiteHeader({language,languages,onLanguage,homeHref,homeLabel,stats,showHome=true}:Props){
 const label=siteLanguageLabel[language];const summary=stats?progressSummary(stats):null;
 const levelLabel=summary?progressText(language,'level',{n:summary.level.level}):'';
 return <header className="work-header logo-header site-header">
  <a className="work-brand site-logo-brand" href={homeHref} aria-label={SITE_NAME+' · '+homeLabel}><SiteLogo/></a>
  <div className="site-header-tools">
   <label className="site-language"><Globe size={16} aria-hidden="true"/><span className="site-language-label">{label}</span><select value={language} aria-label={label} onChange={event=>onLanguage(event.target.value)}>{languages.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
   {summary&&<a className="site-progress" href={homeHref+(homeHref.includes('#')?'':'#progress-heading')} aria-label={levelLabel+' · '+summary.xp+' XP · '+progressText(language,'streak',{n:summary.streak})} data-site-progress="">
    <Trophy size={15} aria-hidden="true"/><span className="site-progress-level">{levelLabel}</span>
    <span className="site-progress-track" role="progressbar" aria-label={levelLabel} aria-valuemin={0} aria-valuemax={summary.level.span} aria-valuenow={summary.level.intoLevel} aria-valuetext={summary.xp+' XP'}><span className="site-progress-fill" style={{width:summary.level.percent+'%'}}/></span>
    <span className="site-progress-xp">{summary.xp} XP</span>
    <span className={'site-progress-streak'+(summary.practisedToday?' lit':'')} title={progressText(language,'streak',{n:summary.streak})}><Flame size={14} aria-hidden="true"/>{summary.streak}</span>
   </a>}
   {showHome&&<a className="object-back site-home" href={homeHref}><House size={17} aria-hidden="true"/><span>{homeLabel}</span></a>}
   <EffectsSettingsButton language={language}/>
  </div>
 </header>;
}
