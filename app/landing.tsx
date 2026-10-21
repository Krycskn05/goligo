import {BookOpen,CheckCircle2,Headphones,Languages,RotateCcw,Sparkles} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {PublicHeader} from './public-shell';
import {SiteFooter} from './site-footer';
import {pickPictures,type PicturePart} from '@/lib/site-pictures';
import {publicText,type PublicCopyKey} from '@/lib/public-copy';
import {languageDirection,type SiteLanguage} from '@/lib/site-languages';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {verbText} from '@/lib/verb-copy';
import {pageLanguage} from './page-language';

// One card for each part of the site, in the order of the menu, with the names the menu uses; the pictures come from all
// the learner's sets and change every 30 minutes (lib/site-pictures.ts; the learner asked: not always the same).
function features(language:SiteLanguage):{part:PicturePart;title:string;text:string}[]{
 const p=(key:PublicCopyKey)=>publicText(language,key);
 return [
  {part:'units',title:c(language,'catalogTitle'),text:p('unitsText')},
  {part:'vault',title:vaultText(language,'vaultTitle'),text:p('vaultText')},
  {part:'verbs',title:verbText(language,'workshopTitle'),text:p('verbsText')},
  {part:'games',title:verbText(language,'gamesTitle'),text:p('gamesText')},
  {part:'mistakes',title:verbText(language,'mistakesTitle'),text:p('mistakesText')},
 ];
}
const perks=[{icon:Headphones,key:'perkSound'},{icon:RotateCcw,key:'perkProgress'},{icon:Languages,key:'perkLanguages'},{icon:Sparkles,key:'perkStreak'}] as const;
const steps=['step1','step2','step3'] as const;

/** Giriş yapmamış ziyaretçinin gördüğü tanıtım sayfası, ziyaretçinin dilinde (önce seçtiği dil, sonra telefonun dili, yoksa Almanca). */
export default async function Landing(){return <LandingView language={await pageLanguage()}/>;}

export function LandingView({language}:{language:SiteLanguage}){
 const p=(key:PublicCopyKey)=>publicText(language,key,{site:SITE_NAME});
 const pictures=pickPictures();
 return <div className="lk-public lk-landing" data-landing lang={language} dir={languageDirection(language)}>
  <a className="skip-link" href="#main">{p('skip')}</a>
  <PublicHeader language={language}/>
  <main id="main" tabIndex={-1} className="lk-public-main">
   <section className="lk-hero" aria-labelledby="lk-hero-title">
    <div className="lk-hero-text">
     <p className="lk-eyebrow">{p('landingEyebrow')}</p>
     <h1 id="lk-hero-title">{p('landingTitle')}</h1>
     <p className="lk-lead">{p('landingLead')}</p>
     <div className="lk-hero-actions">
      <a className="btn" href="/uye-ol" data-landing-register>{p('registerFree')}</a>
      <a className="btn secondary" href="/giris">{p('signIn')}</a>
     </div>
     <p className="lk-hero-note"><CheckCircle2 size={18} aria-hidden="true"/>{p('freeNoAds')}</p>
    </div>
    <div className="lk-hero-art"><img src={pictures.welcome} alt={p('heroAlt')} width={1400} height={700}/></div>
   </section>

   <section className="lk-section" aria-labelledby="lk-features-title">
    <h2 id="lk-features-title">{p('whatsInside')}</h2>
    <div className="lk-features">
     {features(language).map(item=><article key={item.part} className="lk-feature">
      <img src={pictures[item.part]} alt="" width={1200} height={600} loading="lazy"/>
      <div><h3>{item.title}</h3><p>{item.text}</p></div>
     </article>)}
    </div>
   </section>

   <section className="lk-section lk-perks" aria-label={p('perksAria')}>
    <ul>{perks.map(({icon:Icon,key})=><li key={key}><Icon size={22} aria-hidden="true"/><span>{p(key)}</span></li>)}</ul>
   </section>

   <section className="lk-section lk-steps" aria-labelledby="lk-steps-title">
    <h2 id="lk-steps-title">{p('howStart')}</h2>
    <ol>{steps.map((key,index)=><li key={key}><span className="lk-step-number" aria-hidden="true">{index+1}</span><span>{p(key)}</span></li>)}</ol>
    <div className="lk-hero-actions center">
     <a className="btn" href="/uye-ol">{p('registerFree')}</a>
     <a className="btn secondary" href="/giris"><BookOpen size={18} aria-hidden="true"/>{p('alreadyMember')}</a>
    </div>
   </section>
  </main>
  <SiteFooter language={language}/>
 </div>;
}
