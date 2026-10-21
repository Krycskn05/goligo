import {publicText} from './public-copy';
import {SITE_DOMAIN,SITE_NAME} from './site-brand';
import {languageDirection,loadLanguagePack,type SiteLanguage} from './site-languages';
import {RESET_PAGE} from './member-auth';

/**
 * The "Şifremi unuttum" email (the learner asked for password reset once the site had its own address, October 2026):
 * sent from noreply@goliqo.com through Cloudflare Email Service (the `EMAIL` binding, app/api/auth/route.ts), in the
 * language of the page it was asked from. Only the link and a short note; no picture, no tracking.
 */
export const RESET_FROM='noreply@'+SITE_DOMAIN;
export type ResetMail={to:string;from:string;subject:string;text:string;html:string};

const escapeHtml=(text:string)=>text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/** The link in the email: the reset page of this site with the one-time key. */
export function resetLink(origin:string,token:string){return `${origin}${RESET_PAGE}?anahtar=${encodeURIComponent(token)}`;}

export async function resetMail(language:SiteLanguage,to:string,name:string,link:string):Promise<ResetMail>{
 await loadLanguagePack(language);
 const t=(key:Parameters<typeof publicText>[1],params:Record<string,string>={})=>publicText(language,key,{site:SITE_NAME,...params});
 const subject=t('mailSubject');const hello=t('mailHello',{name});const intro=t('mailIntro');const button=t('resetTitle');const ignore=t('mailIgnore');
 const text=[hello,'',intro,'',link,'',ignore,'','— '+SITE_NAME+' · '+SITE_DOMAIN].join('\n');
 const dir=languageDirection(language);
 const html=`<!doctype html><html lang="${language}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>`+
  `<body style="margin:0;padding:24px;background:#fdf8ec;color:#1f3b5c;font:16px/1.55 -apple-system,'Segoe UI',Roboto,Arial,sans-serif">`+
  `<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px 26px">`+
  `<p style="margin:0 0 6px;font-weight:800;font-size:22px;color:#1f3b5c">${escapeHtml(SITE_NAME)}</p>`+
  `<p style="margin:16px 0 0">${escapeHtml(hello)}</p><p style="margin:12px 0 0">${escapeHtml(intro)}</p>`+
  `<p style="margin:22px 0"><a href="${escapeHtml(link)}" style="display:inline-block;background:#3f9b4a;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">${escapeHtml(button)}</a></p>`+
  `<p style="margin:0;font-size:13px;color:#5b6b7c;word-break:break-all" dir="ltr">${escapeHtml(link)}</p>`+
  `<p style="margin:18px 0 0;font-size:14px;color:#5b6b7c">${escapeHtml(ignore)}</p>`+
  `</div><p style="text-align:center;font-size:12px;color:#8a97a5;margin:14px 0 0">${escapeHtml(SITE_NAME)} · ${escapeHtml(SITE_DOMAIN)}</p></body></html>`;
 return {to,from:RESET_FROM,subject,text,html};
}
