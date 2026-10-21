import type {ReactNode} from 'react';
import {SITE_NAME} from '@/lib/site-brand';
import {publicText} from '@/lib/public-copy';
import {siteLanguageLabel} from '@/lib/header-copy';
import {languageDirection,pickText,type SiteLanguage} from '@/lib/site-languages';
import {SiteLogo} from './site-logo';
import {SiteFooter} from './site-footer';
import {PublicLanguage} from './public-language';

/** Üst çubuk: tanıtım, giriş, üye ol, Hesabım ve yasal sayfalar için (ders sayfaları SiteHeader kullanır); site dili seçilebilir. */
export function PublicHeader({language,signedIn=false}:{language:SiteLanguage;signedIn?:boolean}){
 const p=(key:Parameters<typeof publicText>[1])=>publicText(language,key);
 return <header className="work-header logo-header site-header lk-public-header">
  <a className="work-brand site-logo-brand" href="/" aria-label={SITE_NAME+' · '+p('homeAria')}><SiteLogo/></a>
  <div className="site-header-tools">
   <PublicLanguage language={language} label={pickText(siteLanguageLabel,language)}/>
   <nav className="lk-public-nav site-header-buttons" aria-label={p('accountNav')}>
    {signedIn
     ?<><a className="btn secondary small" href="/hesabim">{p('myAccount')}</a><a className="btn small" href="/">{p('toLessons')}</a></>
     :<><a className="btn secondary small" href="/giris">{p('signIn')}</a><a className="btn small" href="/uye-ol">{p('register')}</a></>}
   </nav>
  </div>
 </header>;
}

/** Tanıtım dışındaki açık sayfaların ortak çerçevesi, ziyaretçinin dilinde (app/page-language.ts). */
export function PublicPage({language,signedIn=false,narrow=false,children}:{language:SiteLanguage;signedIn?:boolean;narrow?:boolean;children:ReactNode}){
 return <div className="lk-public" lang={language} dir={languageDirection(language)}>
  <a className="skip-link" href="#main">{publicText(language,'skip')}</a>
  <PublicHeader language={language} signedIn={signedIn}/>
  <main id="main" tabIndex={-1} className={'lk-public-main'+(narrow?' narrow':'')}>{children}</main>
  <SiteFooter language={language}/>
 </div>;
}
