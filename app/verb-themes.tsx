'use client';
import type {CSSProperties} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,Play,Sparkles,Volume2} from 'lucide-react';
import {verbMap,verbMeaning,perfektLabel,verbRowSpeech,type Verb} from '@/lib/verb-course';
import {verbThemes,themeTitle,themeGerman,type VerbTheme} from '@/lib/verb-themes';
import {verbPicture} from '@/lib/verb-logic';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {vaultDirection,type VaultLanguage} from '@/lib/object-vault-copy';
import type {VerbMarks} from '@/lib/verb-workshop';
import {kindClass} from './verb-workshop';

/**
 * Fiil grupları (lib/verb-themes.ts; the learner asked, 3 November 2026): a playful second way into the 72 verbs, by
 * topic. The cards sit under the adventure map; a group shows its verbs as picture tiles (a tap says the verb and its
 * forms, like the verb list) and starts the matching cards with just those verbs. A verb counts as learned when its
 * Perfekt is done on the path (the full sticker of "Fiil koleksiyonun").
 */
type Marks=ReadonlyMap<string,VerbMarks>;
const members=(theme:VerbTheme)=>theme.verbs.map(id=>verbMap.get(id)).filter((verb):verb is Verb=>!!verb);
const learned=(theme:VerbTheme,marks:Marks)=>theme.verbs.filter(id=>marks.get(id)?.perfekt).length;

export function VerbThemeCards({language,marks,onOpen}:{language:VaultLanguage;marks:Marks;onOpen:(theme:VerbTheme)=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 return <section className="verb-themes" aria-labelledby="verb-themes-heading" data-verb-themes="">
  <h2 id="verb-themes-heading" className="verb-themes-title" tabIndex={-1}><Sparkles size={26} aria-hidden="true"/>{t('themesTitle')}</h2>
  <p className="verb-themes-lead">{t('themesLead')}</p>
  <ul className="verb-theme-grid">{verbThemes.map(theme=>{
   const n=learned(theme,marks);const total=theme.verbs.length;const done=n===total;
   return <li key={theme.id}><button type="button" className={'verb-theme-card tone-'+theme.tone+(done?' done':'')} style={{'--p':Math.round(n/total*100)+'%'} as CSSProperties} onClick={()=>onOpen(theme)} data-verb-theme={theme.id}>
    <span className="verb-theme-emoji" aria-hidden="true">{theme.emoji}</span>
    <span className="verb-theme-words"><strong>{themeTitle(theme,language)}</strong>{language!=='de'&&<small lang="de" dir="ltr">{themeGerman(theme)}</small>}</span>
    <span className="verb-theme-pics" aria-hidden="true">{members(theme).slice(0,4).map(verb=><img key={verb.id} src={verbPicture(verb)??''} alt="" width={96} height={96} loading="lazy" decoding="async"/>)}</span>
    <span className="verb-theme-meta">{done?<><CheckCircle2 size={15} aria-hidden="true"/>{t('themeDone')}</>:t('verbsLearned',{n,total})}</span>
    <span className="verb-theme-bar" aria-hidden="true"><span/></span>
    <span className="verb-theme-go">{t('themeOpen')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></span>
   </button></li>;
  })}</ul>
 </section>;
}

export function VerbThemeView({theme,language,marks,speech,onBack,onPlay}:{theme:VerbTheme;language:VaultLanguage;marks:Marks;speech:{speak:(text:string)=>void;busy:boolean};onBack:()=>void;onPlay:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const dir=vaultDirection(language);
 const n=learned(theme,marks);const total=theme.verbs.length;
 return <section className={'verb-theme-view panel tone-'+theme.tone} aria-labelledby="verb-theme-heading" data-verb-theme-view={theme.id} style={{'--p':Math.round(n/total*100)+'%'} as CSSProperties}>
  <button type="button" className="text-button verb-back" onClick={onBack}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{t('backThemes')}</button>
  <header className="verb-theme-head">
   <span className="verb-theme-emoji big" aria-hidden="true">{theme.emoji}</span>
   <div className="verb-theme-words">
    <h1 id="verb-theme-heading" tabIndex={-1}>{themeTitle(theme,language)}</h1>
    {language!=='de'&&<p lang="de" dir="ltr">{themeGerman(theme)}</p>}
    <p className="verb-theme-meta">{n===total?<><CheckCircle2 size={15} aria-hidden="true"/>{t('themeDone')}</>:t('verbsLearned',{n,total})}</p>
    <span className="verb-theme-bar" aria-hidden="true"><span/></span>
   </div>
  </header>
  <div className="verb-theme-play">
   <div><strong>{t('themeMatch')}</strong><small>{t('themeMatchLead')}</small></div>
   <button type="button" className="btn" onClick={onPlay} data-verb-theme-play={theme.id}><Play size={18} aria-hidden="true"/>{t('play')}</button>
  </div>
  <p className="verb-theme-tap">{t('themeTap')}</p>
  <ul className="verb-theme-tiles">{members(theme).map(verb=>{const mark=marks.get(verb.id);return <li key={verb.id}>
   <button type="button" className={'verb-theme-tile'+(mark?.perfekt?' full':mark?.meaning?' got':'')} disabled={speech.busy} title={t('listenRow',{verb:verb.display})} onClick={()=>speech.speak(verbRowSpeech(verb))} data-verb-theme-tile={verb.id}>
    <img src={verbPicture(verb)??''} alt="" width={160} height={160} loading="lazy" decoding="async"/>
    <strong lang="de" dir="ltr" className={kindClass(verb)}>{verb.display}</strong>
    <span lang={language} dir={dir}>{verbMeaning(verb,language)}</span>
    <small lang="de" dir="ltr">{perfektLabel(verb)}</small>
    <Volume2 size={16} className="verb-theme-tile-sound" aria-hidden="true"/>
    {mark?.perfekt&&<CheckCircle2 size={18} className="verb-theme-tile-check" aria-hidden="true"/>}
   </button>
  </li>;})}</ul>
 </section>;
}
