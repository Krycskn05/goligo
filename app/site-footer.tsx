import {SITE_NAME} from '@/lib/site-brand';
export function SiteFooter(){return <footer className="site-copyright"><strong>© {new Date().getFullYear()} {SITE_NAME}</strong><span lang="tr">Tüm hakları saklıdır.</span><span lang="en">All rights reserved.</span></footer>;}
