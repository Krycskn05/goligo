import type {ReactNode} from 'react';
import {SITE_NAME} from '@/lib/site-brand';
import {SiteLogo} from './site-logo';
import {SiteFooter} from './site-footer';

/** Üst çubuk: tanıtım, giriş, üye ol ve yasal sayfalar için (ders sayfaları SiteHeader kullanır). */
export function PublicHeader({signedIn=false}:{signedIn?:boolean}){
 return <header className="work-header logo-header site-header lk-public-header">
  <a className="work-brand site-logo-brand" href="/" aria-label={SITE_NAME+' · Ana sayfa'}><SiteLogo/></a>
  <nav className="lk-public-nav" aria-label="Hesap">
   {signedIn
    ?<><a className="btn secondary small" href="/hesabim">Hesabım</a><a className="btn small" href="/">Derslere git</a></>
    :<><a className="btn secondary small" href="/giris">Giriş yap</a><a className="btn small" href="/uye-ol">Üye ol</a></>}
  </nav>
 </header>;
}

/** Tanıtım dışındaki açık sayfaların ortak çerçevesi. */
export function PublicPage({signedIn=false,narrow=false,children}:{signedIn?:boolean;narrow?:boolean;children:ReactNode}){
 return <div className="lk-public">
  <a className="skip-link" href="#main">İçeriğe geç</a>
  <PublicHeader signedIn={signedIn}/>
  <main id="main" tabIndex={-1} className={'lk-public-main'+(narrow?' narrow':'')}>{children}</main>
  <SiteFooter/>
 </div>;
}
