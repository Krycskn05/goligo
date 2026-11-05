"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageName = exports.OTHER_PAGE = exports.PAGE_NAMES = exports.DEVICE_NAMES = exports.VISIT_REQUEST_MAX = exports.ONLINE_MS = exports.VISIT_KEEP_MS = void 0;
exports.cleanPath = cleanPath;
exports.deviceOf = deviceOf;
exports.isBot = isBot;
exports.countryOf = countryOf;
exports.languageOf = languageOf;
exports.sourceOf = sourceOf;
exports.sourceName = sourceName;
exports.visitorHash = visitorHash;
exports.recordVisit = recordVisit;
const site_languages_1 = require("./site-languages");
const admin_stats_1 = require("./admin-stats");
exports.VISIT_KEEP_MS = 90 * admin_stats_1.DAY;
/** "Şu an sitede": son 5 dakikada bir sayfa açan. */
exports.ONLINE_MS = 5 * 60000;
/** Aynı ziyaretçi aynı sayfayı bu süre içinde yeniden açarsa (yenileme, çift sinyal) bir kez sayılır. */
const REPEAT_MS = 10000;
exports.VISIT_REQUEST_MAX = 2048;
const DEVICES = ['phone', 'tablet', 'computer'];
exports.DEVICE_NAMES = { phone: 'Telefon', tablet: 'Tablet', computer: 'Bilgisayar' };
/** Sitenin sayfaları ve paneldeki adları; başka bir adres "Diğer" olarak sayılır (yazılan hiçbir şey saklanmaz). */
exports.PAGE_NAMES = {
    '/': 'Ana sayfa',
    '/konular': 'Üniteler ve konular',
    '/ev-esyalar': 'Kelime Kasası',
    '/fiiller': 'Fiil Atölyesi',
    '/oyunlar': 'Oyunlar',
    '/yanlislarim': 'Yanlışlarım',
    '/a1-1/willkommen': 'Lektion 1 · Willkommen',
    '/a1-1/berufe': 'Lektion 2 · Berufe',
    '/a1-1/orte-und-dinge': 'Lektion 3 · Orte und Dinge',
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
exports.OTHER_PAGE = '(diğer)';
/** Sayfa adresi: sorgu ve # kısmı atılır, sondaki / silinir; bilinmeyen adres "(diğer)", yönetici paneli hiç. */
function cleanPath(value) {
    if (typeof value !== 'string' || !value.startsWith('/'))
        return null;
    let path = value.split(/[?#]/)[0].slice(0, 200);
    if (path.length > 1)
        path = path.replace(/\/+$/, '');
    if (path === '/yonetim' || path.startsWith('/yonetim/') || path.startsWith('/api/'))
        return null;
    return exports.PAGE_NAMES[path] ? path : exports.OTHER_PAGE;
}
const pageName = (path) => exports.PAGE_NAMES[path] ?? 'Diğer sayfalar';
exports.pageName = pageName;
/** Cihaz türü (sayfa, dokunmatik ekran ve ekran boyutuna göre söyler). */
function deviceOf(value) {
    return DEVICES.includes(value) ? value : '';
}
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|node-fetch|go-http|axios|playwright|puppeteer/i;
/** Arama motorları, bağlantı önizlemeleri ve otomatik araçlar sayılmaz. */
function isBot(userAgent) {
    return !userAgent || BOT.test(userAgent);
}
/** Ülke: Cloudflare'in iki harfli kodu; bilinmeyen (XX, T1 = Tor) boş. */
function countryOf(value) {
    const code = (value ?? '').trim().toUpperCase();
    return /^[A-Z]{2}$/.test(code) && code !== 'XX' && code !== 'T1' ? code : '';
}
/** Site dili: sitenin 31 dilinden biri, yoksa boş. */
function languageOf(value) {
    return typeof value === 'string' && site_languages_1.siteLanguages.some(item => item.id === value) ? value : '';
}
/**
 * Nereden gelindi: başka bir sitenin adı (www. olmadan), site içinden geçişte '' (kaynak değil), hiçbir yerden gelmeyen
 * (yazılan adres, yer imi, çoğu uygulama) '-'. Yalnızca site adı saklanır; adresin geri kalanı hiç.
 */
function sourceOf(referrer, ownHost, internal = false) {
    if (internal)
        return '';
    if (typeof referrer !== 'string' || !referrer)
        return '-';
    let host;
    try {
        host = new URL(referrer).hostname.toLowerCase();
    }
    catch {
        return '-';
    }
    if (!host)
        return '-';
    host = host.replace(/^www\./, '');
    const own = ownHost.toLowerCase().replace(/^www\./, '').split(':')[0];
    if (host === own || host === 'localhost' || host.endsWith('.' + own))
        return '';
    return host.slice(0, 100);
}
const SOURCE_NAMES = [
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
function sourceName(source) {
    if (source === '-' || !source)
        return 'Doğrudan (adres, yer imi, uygulama)';
    for (const [pattern, name] of SOURCE_NAMES)
        if (pattern.test(source))
            return name;
    return source;
}
const hex = (buffer) => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
/** Günün ziyaretçi özeti: tuz + IP + tarayıcı, SHA-256'nın ilk 16 harfi. IP'nin kendisi hiçbir yere yazılmaz. */
async function visitorHash(salt, ip, userAgent) {
    return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + '|' + ip + '|' + userAgent))).slice(0, 16);
}
function randomSalt() { const bytes = new Uint8Array(16); crypto.getRandomValues(bytes); return hex(bytes.buffer); }
/** Bugünün tuzu (yoksa yaratılır); iki günden eski tuzlar silinir, eski özetler böylece hiçbir IP'ye bağlanamaz. */
async function todaysSalt(db, day) {
    await db.batch([
        db.prepare('INSERT OR IGNORE INTO visit_salts (day,salt) VALUES (?,?)').bind(day, randomSalt()),
        db.prepare('DELETE FROM visit_salts WHERE day<?').bind(day - 1),
    ]);
    const row = await db.prepare('SELECT salt FROM visit_salts WHERE day=?').bind(day).first();
    return row?.salt ?? randomSalt();
}
/** Bir sayfa açılışını kaydeder. Geçersiz bir adres ya da aynı sayfanın 10 saniye içinde tekrarı yazılmaz. */
async function recordVisit(db, input, now = Date.now()) {
    const path = cleanPath(input.path);
    if (!path)
        return false;
    const day = (0, admin_stats_1.dayNumber)(now, (0, admin_stats_1.zoneOffsetMs)(now));
    const visitor = await visitorHash(await todaysSalt(db, day), input.ip, input.userAgent);
    const repeat = await db.prepare('SELECT 1 AS x FROM site_visits WHERE day=? AND visitor=? AND path=? AND at>? LIMIT 1').bind(day, visitor, path, now - REPEAT_MS).first();
    const writes = [];
    if (!repeat)
        writes.push(db.prepare('INSERT INTO site_visits (at,day,visitor,member,path,source,device,country,language) VALUES (?,?,?,?,?,?,?,?,?)')
            .bind(now, day, visitor, input.memberId ? 1 : 0, path, sourceOf(input.referrer, input.host, input.internal === true), deviceOf(input.device), countryOf(input.country), languageOf(input.language)));
    if (input.memberId)
        writes.push(db.prepare('INSERT INTO member_seen (member_id,at) VALUES (?,?) ON CONFLICT(member_id) DO UPDATE SET at=excluded.at').bind(input.memberId, now));
    // Üyenin açtığı sayfa hesabına bağlı da tutulur ("Kim ne yaptı"; gizlilik metni whatJourneys).
    if (input.memberId && !repeat)
        writes.push(db.prepare('INSERT INTO member_pages (member_id,at,path) VALUES (?,?,?)').bind(input.memberId, now, path));
    // Eski satırlar ara sıra silinir (her istekte değil).
    if (Math.random() < 0.05)
        writes.push(db.prepare('DELETE FROM site_visits WHERE at<?').bind(now - exports.VISIT_KEEP_MS), db.prepare('DELETE FROM member_pages WHERE at<?').bind(now - exports.VISIT_KEEP_MS));
    if (writes.length)
        await db.batch(writes);
    return !repeat;
}
