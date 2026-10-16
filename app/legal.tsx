import {SITE_CONTACT_EMAIL} from '@/lib/site-brand';
/** Gizlilik metni ve kullanım koşullarının son güncelleme tarihi. */
export const LEGAL_UPDATED='16 Ekim 2026';
/** İletişim adresi (lib/site-brand.ts); henüz yoksa bunu açıkça söyler. */
export function Contact(){
 return SITE_CONTACT_EMAIL?<a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>:<>iletişim adresi bu sayfaya yakında eklenecek</>;
}
