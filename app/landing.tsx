import {ArrowRight,CheckCircle2,Lock,PenLine,RotateCcw,Sparkles} from 'lucide-react';
import {guestText,type GuestCopyKey} from '@/lib/guest-copy';
import {SITE_NAME} from '@/lib/site-brand';
import {PublicHeader} from './public-shell';
import {SiteFooter} from './site-footer';
import AuthForm from './auth-form';
import {authFormTexts} from '@/lib/auth-texts';
import {pickPictures,type PicturePart} from '@/lib/site-pictures';
import {publicText,type PublicCopyKey} from '@/lib/public-copy';
import {languageDirection,type SiteLanguage} from '@/lib/site-languages';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {verbText} from '@/lib/verb-copy';
import {objectVocabulary} from '@/lib/object-course';
import {verbs} from '@/lib/verb-course';
import {gameIds} from '@/lib/verb-games';
import {pageLanguage} from './page-language';

// One tile for each part of the site, in the order of the menu, with the names the menu uses and a short German line
// (as on the home page); the pictures come from all the learner's sets and change every 30 minutes (lib/site-pictures.ts).
// `href`: the part a visitor can try without an account (the guest taste); Yanlışlarım needs saved answers, so it leads
// to the sign-up form below.
function features(language:SiteLanguage):{part:PicturePart;title:string;de:string;href?:string}[]{
 return [
  {part:'units',title:c(language,'catalogTitle'),de:'A1.1 · A1.2',href:'/konular'},
  {part:'vault',title:vaultText(language,'vaultTitle'),de:objectVocabulary.length+' Gegenstände',href:'/ev-esyalar'},
  {part:'verbs',title:verbText(language,'workshopTitle'),de:verbs.length+' Verben',href:'/fiiller'},
  {part:'games',title:verbText(language,'gamesTitle'),de:gameIds.length+' Spiele',href:'/fiiller?bolum=oyunlar'},
  {part:'mistakes',title:verbText(language,'mistakesTitle'),de:'Fehler'},
 ];
}
// What an account adds (texts of lib/public-copy.ts).
const perks=[{icon:RotateCcw,key:'perkProgress'},{icon:PenLine,key:'step3'},{icon:Sparkles,key:'perkStreak'}] as const;

/** Giriş yapmamış ziyaretçinin gördüğü tanıtım sayfası, ziyaretçinin dilinde (önce seçtiği dil, sonra telefonun dili, yoksa Almanca). */
export default async function Landing(){return <LandingView language={await pageLanguage()}/>;}

/**
 * The page a visitor sees first (the learner chose, 22 October 2026: design 2 "Önce dene" with the sign-up form of
 * design 1, the form small and next to the title): the picture, the title, a line and "try it without an account" on
 * one side, the sign-up form on the other; then one picture tile per part of the site, each a door to its free first
 * part; then what an account adds.
 */
export function LandingView({language}:{language:SiteLanguage}){
 const p=(key:PublicCopyKey)=>publicText(language,key,{site:SITE_NAME});
 const g=(key:GuestCopyKey)=>guestText(language,key);
 const pictures=pickPictures();
 return <div className="lk-public lk-landing" data-landing lang={language} dir={languageDirection(language)}>
  <a className="skip-link" href="#main">{p('skip')}</a>
  <PublicHeader language={language}/>
  <main id="main" tabIndex={-1} className="lk-public-main">
   <section className="lk-hero" aria-labelledby="lk-hero-title">
    <div className="lk-hero-text">
     <img src={pictures.welcome} className="lk-hero-art" alt={p('heroAlt')} width={1400} height={700}/>
     <h1 id="lk-hero-title">{p('landingTitle')}</h1>
     <p className="lk-lead">{g('guestTryText')}</p>
     <div className="lk-hero-actions">
      <a className="btn" href="#lk-parts-title" data-landing-try-top>{g('guestTryTitle')}<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></a>
     </div>
     <p className="lk-hero-note"><CheckCircle2 size={18} aria-hidden="true"/>{p('freeNoAds')}</p>
    </div>
    <div className="lk-hero-form" id="uye-ol" data-landing-register>
     <h2>{p('registerFree')}</h2>
     <AuthForm mode="register" returnTo="/" texts={authFormTexts(language)}/>
     <p className="lk-auth-switch">{p('alreadyMemberQ')} <a href="/giris">{p('signIn')}</a></p>
    </div>
   </section>

   <section className="lk-section" aria-labelledby="lk-parts-title">
    <h2 id="lk-parts-title">{g('guestPickPart')}</h2>
    <ul className="lk-parts">
     {features(language).map(item=><li key={item.part}>
      <a className={'lk-part'+(item.href?'':' locked')} href={item.href??'#uye-ol'} data-landing-try={item.href?item.part:undefined} data-landing-locked={item.href?undefined:item.part}>
       <img src={pictures[item.part]} alt="" width={1200} height={600} loading="lazy"/>
       <strong>{item.title}</strong>
       <small lang="de" dir="ltr">{item.de}</small>
       {item.href?<span className="lk-part-try">{g('guestTryShort')}</span>:<span className="lk-part-lock"><Lock size={14} aria-hidden="true"/>{g('guestLocked')}</span>}
      </a>
     </li>)}
    </ul>
   </section>

   <section className="lk-section lk-perks" aria-labelledby="lk-perks-title">
    <h2 id="lk-perks-title">{g('guestMemberTitle')}</h2>
    <ul>{perks.map(({icon:Icon,key})=><li key={key}><Icon size={20} aria-hidden="true"/><span>{p(key)}</span></li>)}</ul>
   </section>
  </main>
  <SiteFooter language={language}/>
 </div>;
}
