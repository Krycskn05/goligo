import {NavIcon} from './nav-icons';
import {c} from '@/lib/category-copy';
import {vaultText} from '@/lib/object-vault-copy';
import {verbText} from '@/lib/verb-copy';
import {t,type StudyLanguage} from '@/lib/study-languages';
import {InstallGuide} from './install-guide';

/** Where the learner is: the menu line drawn as active (the Lektion pages belong to Üniteler). */
export type MenuPart='home'|'units'|'vault'|'verbs'|'games'|'mistakes';

/**
 * The left menu of every part of the site (the learner asked, 22 October 2026: the menu was on the home page and the
 * units page only, and went away everywhere else). The same links in the same order on every page, so the learner can
 * go straight from one part to another; on phones it sits above the page as two columns and hides during a test.
 * `unitsHref`: the units page links to its own list (#curriculum).
 */
export function SiteMenu({language,current,course='de',unitsHref='/konular'}:{language:StudyLanguage;current:MenuPart;course?:'de'|'en';unitsHref?:string}){
 const link=(part:MenuPart)=>'work-nav'+(current===part?' active':' object-nav-link');
 const here=(part:MenuPart)=>current===part?'page' as const:undefined;
 return <nav aria-label={t(language,'home')} data-site-menu="">
  {course==='de'&&<a className={link('home')} href="/" aria-current={here('home')}><NavIcon name="home"/>{vaultText(language,'home')}</a>}
  <a className={link('units')} href={unitsHref} aria-current={here('units')}><NavIcon name="units"/>{c(language,'catalogTitle')}</a>
  <a className={link('vault')} href={'/ev-esyalar?learn='+course} aria-current={here('vault')}><NavIcon name="vault"/>{vaultText(language,'vaultTitle')}</a>
  {course==='de'&&<>
   <a className={link('verbs')+' verb-nav-link'} href="/fiiller" aria-current={here('verbs')}><NavIcon name="verbs"/>{verbText(language,'workshopTitle')}</a>
   <a className={link('games')} href="/fiiller?bolum=oyunlar" data-verb-section-link="games" aria-current={here('games')}><NavIcon name="games"/>{verbText(language,'gamesTitle')}</a>
   <a className={link('mistakes')} href="/fiiller?bolum=yanlislar" data-verb-section-link="mistakes" aria-current={here('mistakes')}><NavIcon name="mistakes"/>{verbText(language,'mistakesTitle')}</a>
  </>}
 </nav>;
}

/** The menu column of a page: the menu, then "Uygulama olarak indir" (as on the home page). */
export function SiteMenuAside({language,current,course='de'}:{language:StudyLanguage;current:MenuPart;course?:'de'|'en'}){
 return <aside className="work-sidebar"><SiteMenu language={language} current={current} course={course}/><InstallGuide language={language}/></aside>;
}
