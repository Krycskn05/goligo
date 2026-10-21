/** The site's name (the learner chose Goliqo in October 2026, the same as the logo). */
export const SITE_NAME = 'Goliqo';
/** The site's own web address (bought by the learner on Cloudflare, October 2026). www.goliqo.com goes here too. */
export const SITE_DOMAIN = 'goliqo.com';
/**
 * The free addresses the site had before (Cloudflare workers.dev, the learner's account "kooraycoskun"): they send
 * everybody to the same page on SITE_DOMAIN and carry the browser's saved settings along once (lib/storage-move.ts).
 */
export const OLD_SITE_HOSTS: readonly string[] = ['goligo.kooraycoskun.workers.dev', 'lernkoko.kooraycoskun.workers.dev'];
/** Gizlilik ve kullanım koşulları sayfalarında gösterilen iletişim adresi (boşsa "yakında eklenecek" yazar). */
export const SITE_CONTACT_EMAIL = '';
