"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESET_FROM = void 0;
exports.resetLink = resetLink;
exports.resetMail = resetMail;
const public_copy_1 = require("./public-copy");
const site_brand_1 = require("./site-brand");
const site_languages_1 = require("./site-languages");
const member_auth_1 = require("./member-auth");
/**
 * The "Şifremi unuttum" email (the learner asked for password reset once the site had its own address, October 2026):
 * sent from noreply@goliqo.com through Cloudflare Email Service (the `EMAIL` binding, app/api/auth/route.ts), in the
 * language of the page it was asked from. Only the link and a short note; no picture, no tracking.
 */
exports.RESET_FROM = 'noreply@' + site_brand_1.SITE_DOMAIN;
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** The link in the email: the reset page of this site with the one-time key. */
function resetLink(origin, token) { return `${origin}${member_auth_1.RESET_PAGE}?anahtar=${encodeURIComponent(token)}`; }
async function resetMail(language, to, name, link) {
    await (0, site_languages_1.loadLanguagePack)(language);
    const t = (key, params = {}) => (0, public_copy_1.publicText)(language, key, { site: site_brand_1.SITE_NAME, ...params });
    const subject = t('mailSubject');
    const hello = t('mailHello', { name });
    const intro = t('mailIntro');
    const button = t('resetTitle');
    const ignore = t('mailIgnore');
    const text = [hello, '', intro, '', link, '', ignore, '', '— ' + site_brand_1.SITE_NAME + ' · ' + site_brand_1.SITE_DOMAIN].join('\n');
    const dir = (0, site_languages_1.languageDirection)(language);
    const html = `<!doctype html><html lang="${language}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>` +
        `<body style="margin:0;padding:24px;background:#fdf8ec;color:#1f3b5c;font:16px/1.55 -apple-system,'Segoe UI',Roboto,Arial,sans-serif">` +
        `<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px 26px">` +
        `<p style="margin:0 0 6px;font-weight:800;font-size:22px;color:#1f3b5c">${escapeHtml(site_brand_1.SITE_NAME)}</p>` +
        `<p style="margin:16px 0 0">${escapeHtml(hello)}</p><p style="margin:12px 0 0">${escapeHtml(intro)}</p>` +
        `<p style="margin:22px 0"><a href="${escapeHtml(link)}" style="display:inline-block;background:#3f9b4a;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">${escapeHtml(button)}</a></p>` +
        `<p style="margin:0;font-size:13px;color:#5b6b7c;word-break:break-all" dir="ltr">${escapeHtml(link)}</p>` +
        `<p style="margin:18px 0 0;font-size:14px;color:#5b6b7c">${escapeHtml(ignore)}</p>` +
        `</div><p style="text-align:center;font-size:12px;color:#8a97a5;margin:14px 0 0">${escapeHtml(site_brand_1.SITE_NAME)} · ${escapeHtml(site_brand_1.SITE_DOMAIN)}</p></body></html>`;
    return { to, from: exports.RESET_FROM, subject, text, html };
}
