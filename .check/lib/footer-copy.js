"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerCopy = void 0;
exports.footerText = footerText;
const site_languages_1 = require("./site-languages");
/** The footer's texts (app/site-footer.tsx), on every page; the same as in lib/public-copy.ts, kept small for the
 * study pages. Tuples hold tr de en ar uk fr, the other languages read the English text from their language pack. */
const copy = {
    rights: ['Tüm hakları saklıdır.', 'Alle Rechte vorbehalten.', 'All rights reserved.', 'جميع الحقوق محفوظة.', 'Усі права захищено.', 'Tous droits réservés.'],
    privacyLink: ['Gizlilik', 'Datenschutz', 'Privacy', 'الخصوصية', 'Конфіденційність', 'Confidentialité'],
    termsLink: ['Kullanım koşulları', 'Nutzungsbedingungen', 'Terms of use', 'شروط الاستخدام', 'Умови користування', 'Conditions d’utilisation'],
    legalNav: ['Yasal bilgiler', 'Rechtliches', 'Legal information', 'معلومات قانونية', 'Правова інформація', 'Informations légales'],
};
exports.footerCopy = copy;
function footerText(language, key) { return (0, site_languages_1.pickText)(copy[key], language); }
