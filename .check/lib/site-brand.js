"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPRESSUM = exports.SITE_CONTACT_EMAIL = exports.OLD_SITE_HOSTS = exports.SITE_DOMAIN = exports.SITE_NAME = void 0;
/** The site's name (the learner chose Goliqo in October 2026, the same as the logo). */
exports.SITE_NAME = 'Goliqo';
/** The site's own web address (bought by the learner on Cloudflare, October 2026). www.goliqo.com goes here too. */
exports.SITE_DOMAIN = 'goliqo.com';
/**
 * The free addresses the site had before (Cloudflare workers.dev, the learner's account "kooraycoskun"): they send
 * everybody to the same page on SITE_DOMAIN and carry the browser's saved settings along once (lib/storage-move.ts).
 */
exports.OLD_SITE_HOSTS = ['goligo.kooraycoskun.workers.dev', 'lernkoko.kooraycoskun.workers.dev'];
/** Gizlilik ve kullanım koşulları sayfalarında gösterilen iletişim adresi (boşsa "yakında eklenecek" yazar). */
exports.SITE_CONTACT_EMAIL = 'info@goliqo.com';
/** The legal notice (app/impressum, § 5 DDG), as the learner gave it, 22 October 2026: for now only the city as the
 * address (the learner will add the street later). Mail to info@goliqo.com is forwarded by Cloudflare Email Routing. */
exports.IMPRESSUM = { name: 'Koray Coşkun', address: ['Berlin'], email: exports.SITE_CONTACT_EMAIL };
