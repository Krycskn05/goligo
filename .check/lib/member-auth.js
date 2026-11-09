"use strict";
// Goliqo üyelik yardımcıları (veritabanına dokunmaz).
// - Şifreler PBKDF2-SHA256 ile, her üyeye ayrı rastgele tuzla özetlenir; açık hali saklanmaz.
// - Oturum çerezi 32 baytlık rastgele bir anahtardır; veritabanında yalnızca SHA-256 özeti durur.
// - Çerez HttpOnly (sayfa betikleri okuyamaz) ve SameSite=Lax'tır; https'te Secure olur.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST_PAGES = exports.AUTH_PATHS = exports.PUBLIC_PAGES = exports.RESET_MS = exports.RESET_MINUTES = exports.RESET_PAGE = exports.DUMMY_HASH = exports.EMAIL_MAX = exports.NAME_MAX = exports.PASSWORD_MAX = exports.PASSWORD_MIN = exports.PBKDF2_ITERATIONS = exports.SESSION_MS = exports.SESSION_DAYS = exports.SESSION_COOKIE = void 0;
exports.sameBytes = sameBytes;
exports.normalizeEmail = normalizeEmail;
exports.validEmail = validEmail;
exports.passwordIssue = passwordIssue;
exports.passwordProblem = passwordProblem;
exports.cleanName = cleanName;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.newToken = newToken;
exports.tokenHash = tokenHash;
exports.validToken = validToken;
exports.newMemberId = newMemberId;
exports.readCookie = readCookie;
exports.sessionCookie = sessionCookie;
exports.clearSessionCookie = clearSessionCookie;
exports.isAssetPath = isAssetPath;
exports.isPublicPath = isPublicPath;
exports.safeReturnTo = safeReturnTo;
exports.signInPath = signInPath;
exports.SESSION_COOKIE = 'lk_session';
exports.SESSION_DAYS = 30;
exports.SESSION_MS = exports.SESSION_DAYS * 24 * 60 * 60 * 1000;
/** Cloudflare Workers'ta PBKDF2 için izin verilen en yüksek sayı. Özetle birlikte saklanır, sonra artırılabilir. */
exports.PBKDF2_ITERATIONS = 100_000;
exports.PASSWORD_MIN = 8;
exports.PASSWORD_MAX = 128;
exports.NAME_MAX = 60;
exports.EMAIL_MAX = 254;
const encoder = new TextEncoder();
function toBase64Url(bytes) {
    let binary = '';
    for (const byte of bytes)
        binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(value) {
    if (!/^[A-Za-z0-9_-]*$/.test(value))
        return null;
    try {
        const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++)
            bytes[i] = binary.charCodeAt(i);
        return bytes;
    }
    catch {
        return null;
    }
}
function randomBytes(length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
}
/** İki bayt dizisini, ilk farklı baytta erken çıkmadan karşılaştırır. */
function sameBytes(a, b) {
    if (a.length !== b.length)
        return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b[i];
    return diff === 0;
}
/** E-postayı karşılaştırma ve saklama için tek biçime getirir (boşluksuz, küçük harf). */
function normalizeEmail(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
function validEmail(email) {
    return email.length >= 3 && email.length <= exports.EMAIL_MAX && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}
function passwordIssue(password, email = '') {
    if (typeof password !== 'string' || password.length < exports.PASSWORD_MIN)
        return { code: 'pwShort', n: exports.PASSWORD_MIN };
    if (password.length > exports.PASSWORD_MAX)
        return { code: 'pwLong', n: exports.PASSWORD_MAX };
    if (!password.trim())
        return { code: 'pwSpaces' };
    if (email && password.trim().toLowerCase() === email)
        return { code: 'pwEmail' };
    if (/^(.)\1+$/.test(password))
        return { code: 'pwRepeat' };
    return null;
}
const PASSWORD_TEXT = {
    pwShort: (n) => `Şifre en az ${n} karakter olmalı.`,
    pwLong: (n) => `Şifre en fazla ${n} karakter olabilir.`,
    pwSpaces: () => 'Şifre yalnızca boşluktan oluşamaz.',
    pwEmail: () => 'Şifre e-posta adresinle aynı olamaz.',
    pwRepeat: () => 'Şifre tek bir karakterin tekrarı olamaz.',
};
/** Şifrede sorun varsa kısa Türkçe açıklamasını, yoksa null döndürür. */
function passwordProblem(password, email = '') {
    const issue = passwordIssue(password, email);
    return issue ? PASSWORD_TEXT[issue.code](issue.n) : null;
}
/** Görünen adı temizler: kontrol karakterleri çıkar, boşluklar teke iner, en fazla NAME_MAX karakter. */
function cleanName(value) {
    if (typeof value !== 'string')
        return '';
    // eslint-disable-next-line no-control-regex
    const name = value.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim();
    return Array.from(name).slice(0, exports.NAME_MAX).join('').trim();
}
async function derive(password, salt, iterations) {
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
    return new Uint8Array(bits);
}
/** Şifreyi "pbkdf2-sha256$<tur>$<tuz>$<özet>" biçiminde saklanacak hale getirir. */
async function hashPassword(password, iterations = exports.PBKDF2_ITERATIONS) {
    const salt = randomBytes(16);
    const hash = await derive(password, salt, iterations);
    return `pbkdf2-sha256$${iterations}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}
/** Şifre saklanan özetle eşleşiyor mu? Bozuk ya da tanınmayan özetler her zaman false döner. */
async function verifyPassword(password, stored) {
    const parts = typeof stored === 'string' ? stored.split('$') : [];
    if (parts.length !== 4 || parts[0] !== 'pbkdf2-sha256')
        return false;
    const iterations = Number(parts[1]);
    if (!Number.isInteger(iterations) || iterations < 1_000 || iterations > exports.PBKDF2_ITERATIONS)
        return false;
    const salt = fromBase64Url(parts[2]);
    const expected = fromBase64Url(parts[3]);
    if (!salt || salt.length < 8 || !expected || expected.length !== 32)
        return false;
    if (typeof password !== 'string')
        return false;
    return sameBytes(await derive(password, salt, iterations), expected);
}
/** Bilinmeyen bir e-postada da aynı sürede cevap vermek için kullanılan sahte özet. */
exports.DUMMY_HASH = `pbkdf2-sha256$${exports.PBKDF2_ITERATIONS}$bGVybmtva28tZHVtbXk$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
/** Çerez için yeni rastgele oturum anahtarı. */
function newToken() {
    return toBase64Url(randomBytes(32));
}
/** Oturum anahtarının veritabanında saklanan SHA-256 özeti (onaltılık). */
async function tokenHash(token) {
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token)));
    return Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
}
function validToken(token) {
    return typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token);
}
function newMemberId() {
    return `member:${crypto.randomUUID()}`;
}
/** Cookie başlığından tek bir çerezi okur (aynı adla birden çok çerez varsa hiçbirine güvenmez). */
function readCookie(header, name) {
    if (!header)
        return null;
    const values = header
        .split(';')
        .map(part => part.trim())
        .filter(part => part.startsWith(name + '='))
        .map(part => part.slice(name.length + 1));
    return values.length === 1 && values[0] ? values[0] : null;
}
function sessionCookie(token, secure) {
    return `${exports.SESSION_COOKIE}=${token}; Path=/; Max-Age=${exports.SESSION_DAYS * 24 * 60 * 60}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}
function clearSessionCookie(secure) {
    return `${exports.SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}
/** Şifre yenileme sayfası (e-postadaki bağlantı buraya gelir). */
exports.RESET_PAGE = '/sifre-yenile';
/** Şifre yenileme bağlantısı bu kadar süre geçerlidir (tek kullanımlık). */
exports.RESET_MINUTES = 60;
exports.RESET_MS = exports.RESET_MINUTES * 60 * 1000;
/** Giriş yapmadan açılabilen sayfalar: tanıtım, giriş, üye ol, şifre yenileme ve yasal metinler. */
exports.PUBLIC_PAGES = new Set(['/', '/giris', '/uye-ol', exports.RESET_PAGE, '/gizlilik', '/kullanim-kosullari', '/impressum']);
/** Giriş ve çıkış adresleri (dönüş adresi olarak kullanılmaz). */
exports.AUTH_PATHS = new Set(['/giris', '/uye-ol', exports.RESET_PAGE, '/cikis', '/signin-with-chatgpt', '/signout-with-chatgpt', '/auth/login', '/auth/logout', '/callback']);
/** Dosya (resim, ses, betik, stil…) ya da çerçevenin kendi adresi mi? */
function isAssetPath(pathname) {
    return /\.[a-z0-9]{1,8}$/i.test(pathname) || pathname.startsWith('/_next/') || pathname.startsWith('/@') || pathname.startsWith('/__') || pathname.startsWith('/cdn-cgi/') || pathname.startsWith('/node_modules/');
}
/**
 * Pages a visitor without an account may open for the guest taste (lib/guest-taste.ts): the first part of each is open,
 * the rest asks to sign up. Of the units only Lektion 1 (GUEST_UNIT, 3 November 2026); Hesabım and the admin page stay
 * for members.
 */
exports.GUEST_PAGES = new Set(['/konular', '/ev-esyalar', '/fiiller', '/oyunlar', '/yanlislarim', '/a1-1/willkommen', '/a1-sinavi']);
function isPublicPath(pathname) {
    return exports.PUBLIC_PAGES.has(pathname) || exports.GUEST_PAGES.has(pathname) || pathname === '/api' || pathname.startsWith('/api/') || isAssetPath(pathname);
}
/** Giriş sonrası dönülecek adres: yalnızca bu sitenin kendi sayfaları; giriş/çıkış sayfaları olmaz. */
function safeReturnTo(value) {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\'))
        return '/';
    let url;
    try {
        url = new URL(value, 'https://goligo.local');
    }
    catch {
        return '/';
    }
    if (url.origin !== 'https://goligo.local' || exports.AUTH_PATHS.has(url.pathname) || url.pathname.startsWith('/api/'))
        return '/';
    return url.pathname + url.search + url.hash;
}
function signInPath(returnTo) {
    const target = safeReturnTo(returnTo);
    return target === '/' ? '/giris' : `/giris?return_to=${encodeURIComponent(target)}`;
}
