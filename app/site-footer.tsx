import {SITE_NAME} from '@/lib/site-brand';
import {footerText,type FooterCopyKey} from '@/lib/footer-copy';
import type {SiteLanguage} from '@/lib/site-languages';
/** The footer of every page, in the page's language (legal links: privacy notice, terms of use and the Impressum, which
 * keeps its German name in every language). */
export function SiteFooter({language}:{language:SiteLanguage}){const p=(key:FooterCopyKey)=>footerText(language,key);return <footer className="site-copyright"><img className="site-footer-logo" src="/branding/goliqo-logo.webp" alt="" width={496} height={182} loading="lazy" decoding="async"/><strong>© {new Date().getFullYear()} {SITE_NAME}</strong><span>{p('rights')}</span><nav className="site-footer-links" aria-label={p('legalNav')}><a href="/gizlilik">{p('privacyLink')}</a><a href="/kullanim-kosullari">{p('termsLink')}</a><a href="/impressum" lang="de" data-footer-impressum>Impressum</a></nav></footer>;}
