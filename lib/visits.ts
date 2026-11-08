// Ziyaret istatistikleri (yönetici paneli; site sahibi istedi, 4 Kasım 2026: "siteye kimler girmiş, kaç kişi ziyaret
// etmiş"). Her sayfa açılışında app/visit-beacon.tsx app/api/ziyaret'e küçük bir sinyal yollar; burada kaydedilir.
// - Çerez yok, IP adresi saklanmaz. Ziyaretçi, IP + tarayıcı bilgisinin o güne özel rastgele bir tuzla alınmış özetiyle
//   sayılır; tuz iki gün sonra silinir, özet bir kişiye geri götürülemez. Aynı kişi iki gün gelirse iki ziyaret sayılır.
// - Yalnızca bilinen sayfa adresleri tutulur (sorgu kısmı hiç), kaynak olarak yalnızca gelinen sitenin adı.
// - Satırlar 90 gün saklanır. Üyelerin sitede en son görüldüğü an (member_seen) ve açtıkları sayfalar (member_pages,
//   "Kim ne yaptı") hesaplarına bağlı tutulur; ikisi de hesapla silinir.
// - Site yöneticisinin kendi ziyaretleri ve botlar sayılmaz.
// Tablolar: migration/database/members.sql. Gizlilik metni: lib/legal-copy.ts whatVisits.
import type { Db } from './member-store';
import { siteLanguages } from './site-languages';
import { DAY, dayNumber, zoneOffsetMs } from './admin-stats';

export const VISIT_KEEP_MS = 90 * DAY;
/** "Şu an sitede": son 5 dakikada bir sayfa açan. */
export const ONLINE_MS = 5 * 60000;
/** Aynı ziyaretçi aynı sayfayı bu süre içinde yeniden açarsa (yenileme, çift sinyal) bir kez sayılır. */
const REPEAT_MS = 10000;
export const VISIT_REQUEST_MAX = 2048;

export type Device = 'phone' | 'tablet' | 'computer';
const DEVICES: readonly Device[] = ['phone', 'tablet', 'computer'];
export const DEVICE_NAMES: Record<Device, string> = { phone: 'Telefon', tablet: 'Tablet', computer: 'Bilgisayar' };

/** Sitenin sayfaları ve paneldeki adları; başka bir adres "Diğer" olarak sayılır (yazılan hiçbir şey saklanmaz). */
export const PAGE_NAMES: Record<string, string> = {
  '/': 'Ana sayfa',
  '/konular': 'Üniteler ve konular',
  '/ev-esyalar': 'Kelime Kasası',
  '/fiiller': 'Fiil Atölyesi',
  '/oyunlar': 'Oyunlar',
  '/yanlislarim': 'Yanlışlarım',
  '/a1-1/willkommen': 'Lektion 1 · Willkommen',
  '/a1-1/berufe': 'Lektion 2 · Berufe',
  '/a1-1/orte-und-dinge': 'Lektion 3 · Orte und Dinge',
  '/a1-1/familie': 'Lektion 4 · Familie',
  '/a1-1/alltag-und-freizeit': 'Lektion 5 · Alltag und Freizeit',
  '/a1-2/ev-ve-yasam': 'Ev ve Yaşam',
  '/a1-2/ausbildung': 'Lektion 12 · Ausbildung',
  '/a1-2/ausbildung/hoeren': 'Lektion 12 · Hören',
  '/a1-2/wege-in-der-stadt': 'Lektion 15 · Wege in der Stadt',
  '/uye-ol': 'Üye ol',
  '/giris': 'Giriş',
  '/sifre-yenile': 'Şifre yenileme',
  '/hesabim': 'Hesabım',
  '/gizlilik': 'Gizlilik',
  '/kullanim-kosullari': 'Kullanım koşulları',
  '/impressum': 'Impressum',
};
export const OTHER_PAGE = '(diğer)';

/** Sayfa adresi: sorgu ve # kısmı atılır, sondaki / silinir; bilinmeyen adres "(diğer)", yönetici paneli hiç. */
export function cleanPath(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/')) return null;
  let path = value.split(/[?#]/)[0].slice(0, 200);
  if (path.length > 1) path = path.replace(/\/+$/, '');
  if (path === '/yonetim' || path.startsWith('/yonetim/') || path.startsWith('/api/')) return null;
  return PAGE_NAMES[path] ? path : OTHER_PAGE;
}
export const pageName = (path: string) => PAGE_NAMES[path] ?? 'Diğer sayfalar';

/** Cihaz türü (sayfa, dokunmatik ekran ve ekran boyutuna göre söyler). */
export function deviceOf(value: unknown): Device | '' {
  return DEVICES.includes(value as Device) ? (value as Device) : '';
}

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|node-fetch|go-http|axios|playwright|puppeteer/i;
/** Arama motorları, bağlantı önizlemeleri ve otomatik araçlar sayılmaz. */
export function isBot(userAgent: string | null | undefined): boolean {
  return !userAgent || BOT.test(userAgent);
}

/** Ülke: Cloudflare'in iki harfli kodu; bilinmeyen (XX, T1 = Tor) boş. */
export function countryOf(value: string | null | undefined): string {
  const code = (value ?? '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== 'XX' && code !== 'T1' ? code : '';
}

/** Site dili: sitenin 31 dilinden biri, yoksa boş. */
export function languageOf(value: unknown): string {
  return typeof value === 'string' && siteLanguages.some(item => item.id === value) ? value : '';
}

/**
 * Nereden gelindi: başka bir sitenin adı (www. olmadan), site içinden geçişte '' (kaynak değil), hiçbir yerden gelmeyen
 * (yazılan adres, yer imi, çoğu uygulama) '-'. Yalnızca site adı saklanır; adresin geri kalanı hiç.
 */
export function sourceOf(referrer: unknown, ownHost: string, internal = false): string {
  if (internal) return '';
  if (typeof referrer !== 'string' || !referrer) return '-';
  let host: string;
  try { host = new URL(referrer).hostname.toLowerCase(); } catch { return '-'; }
  if (!host) return '-';
  host = host.replace(/^www\./, '');
  const own = ownHost.toLowerCase().replace(/^www\./, '').split(':')[0];
  if (host === own || host === 'localhost' || host.endsWith('.' + own)) return '';
  return host.slice(0, 100);
}
const SOURCE_NAMES: [RegExp, string][] = [
  [/(^|\.)google\.[a-z.]+$/, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)yandex\.[a-z.]+$/, 'Yandex'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$/, 'Facebook'],
  [/(^|\.)whatsapp\.(com|net)$|^wa\.me$/, 'WhatsApp'],
  [/(^|\.)t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, 'X (Twitter)'],
  [/(^|\.)youtube\.com$|^youtu\.be$/, 'YouTube'],
  [/(^|\.)tiktok\.com$/, 'TikTok'],
  [/(^|\.)telegram\.org$|^t\.me$/, 'Telegram'],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, 'ChatGPT'],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'LinkedIn'],
];
/** Kaynağın paneldeki adı. */
export function sourceName(source: string): string {
  if (source === '-' || !source) return 'Doğrudan (adres, yer imi, uygulama)';
  for (const [pattern, name] of SOURCE_NAMES) if (pattern.test(source)) return name;
  return source;
}

const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
/** Günün ziyaretçi özeti: tuz + IP + tarayıcı, SHA-256'nın ilk 16 harfi. IP'nin kendisi hiçbir yere yazılmaz. */
export async function visitorHash(salt: string, ip: string, userAgent: string): Promise<string> {
  return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + '|' + ip + '|' + userAgent))).slice(0, 16);
}
function randomSalt() { const bytes = new Uint8Array(16); crypto.getRandomValues(bytes); return hex(bytes.buffer); }

/** Bugünün tuzu (yoksa yaratılır); iki günden eski tuzlar silinir, eski özetler böylece hiçbir IP'ye bağlanamaz. */
async function todaysSalt(db: Db, day: number): Promise<string> {
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO visit_salts (day,salt) VALUES (?,?)').bind(day, randomSalt()),
    db.prepare('DELETE FROM visit_salts WHERE day<?').bind(day - 1),
  ]);
  const row = await db.prepare('SELECT salt FROM visit_salts WHERE day=?').bind(day).first<{ salt: string }>();
  return row?.salt ?? randomSalt();
}

export type VisitInput = {
  path: unknown; referrer: unknown; internal?: unknown; device: unknown; language: unknown;
  ip: string; userAgent: string; country: string | null; host: string; memberId: string | null;
};
/** Bir sayfa açılışını kaydeder. Geçersiz bir adres ya da aynı sayfanın 10 saniye içinde tekrarı yazılmaz. */
export async function recordVisit(db: Db, input: VisitInput, now = Date.now()): Promise<boolean> {
  const path = cleanPath(input.path);
  if (!path) return false;
  const day = dayNumber(now, zoneOffsetMs(now));
  const visitor = await visitorHash(await todaysSalt(db, day), input.ip, input.userAgent);
  const repeat = await db.prepare('SELECT 1 AS x FROM site_visits WHERE day=? AND visitor=? AND path=? AND at>? LIMIT 1').bind(day, visitor, path, now - REPEAT_MS).first();
  const writes: ReturnType<Db['prepare']>[] = [];
  if (!repeat) writes.push(db.prepare('INSERT INTO site_visits (at,day,visitor,member,path,source,device,country,language) VALUES (?,?,?,?,?,?,?,?,?)')
    .bind(now, day, visitor, input.memberId ? 1 : 0, path, sourceOf(input.referrer, input.host, input.internal === true), deviceOf(input.device), countryOf(input.country), languageOf(input.language)));
  if (input.memberId) writes.push(db.prepare('INSERT INTO member_seen (member_id,at) VALUES (?,?) ON CONFLICT(member_id) DO UPDATE SET at=excluded.at').bind(input.memberId, now));
  // Üyenin açtığı sayfa hesabına bağlı da tutulur ("Kim ne yaptı"; gizlilik metni whatJourneys).
  if (input.memberId && !repeat) writes.push(db.prepare('INSERT INTO member_pages (member_id,at,path) VALUES (?,?,?)').bind(input.memberId, now, path));
  // Eski satırlar ara sıra silinir (her istekte değil).
  if (Math.random() < 0.05) writes.push(
    db.prepare('DELETE FROM site_visits WHERE at<?').bind(now - VISIT_KEEP_MS),
    db.prepare('DELETE FROM member_pages WHERE at<?').bind(now - VISIT_KEEP_MS),
  );
  if (writes.length) await db.batch(writes);
  return !repeat;
}
