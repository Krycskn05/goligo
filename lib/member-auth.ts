// LernKoko üyelik yardımcıları (veritabanına dokunmaz).
// - Şifreler PBKDF2-SHA256 ile, her üyeye ayrı rastgele tuzla özetlenir; açık hali saklanmaz.
// - Oturum çerezi 32 baytlık rastgele bir anahtardır; veritabanında yalnızca SHA-256 özeti durur.
// - Çerez HttpOnly (sayfa betikleri okuyamaz) ve SameSite=Lax'tır; https'te Secure olur.

export const SESSION_COOKIE = 'lk_session';
export const SESSION_DAYS = 30;
export const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;
/** Cloudflare Workers'ta PBKDF2 için izin verilen en yüksek sayı. Özetle birlikte saklanır, sonra artırılabilir. */
export const PBKDF2_ITERATIONS = 100_000;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const NAME_MAX = 60;
export const EMAIL_MAX = 254;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) return null;
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/** İki bayt dizisini, ilk farklı baytta erken çıkmadan karşılaştırır. */
export function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** E-postayı karşılaştırma ve saklama için tek biçime getirir (boşluksuz, küçük harf). */
export function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function validEmail(email: string): boolean {
  return email.length >= 3 && email.length <= EMAIL_MAX && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}

/** Şifrede sorun varsa kısa Türkçe açıklamasını, yoksa null döndürür. */
export function passwordProblem(password: unknown, email = ''): string | null {
  if (typeof password !== 'string' || password.length < PASSWORD_MIN) return `Şifre en az ${PASSWORD_MIN} karakter olmalı.`;
  if (password.length > PASSWORD_MAX) return `Şifre en fazla ${PASSWORD_MAX} karakter olabilir.`;
  if (!password.trim()) return 'Şifre yalnızca boşluktan oluşamaz.';
  if (email && password.trim().toLowerCase() === email) return 'Şifre e-posta adresinle aynı olamaz.';
  if (/^(.)\1+$/.test(password)) return 'Şifre tek bir karakterin tekrarı olamaz.';
  return null;
}

/** Görünen adı temizler: kontrol karakterleri çıkar, boşluklar teke iner, en fazla NAME_MAX karakter. */
export function cleanName(value: unknown): string {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  const name = value.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim();
  return Array.from(name).slice(0, NAME_MAX).join('').trim();
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

/** Şifreyi "pbkdf2-sha256$<tur>$<tuz>$<özet>" biçiminde saklanacak hale getirir. */
export async function hashPassword(password: string, iterations = PBKDF2_ITERATIONS): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, iterations);
  return `pbkdf2-sha256$${iterations}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

/** Şifre saklanan özetle eşleşiyor mu? Bozuk ya da tanınmayan özetler her zaman false döner. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = typeof stored === 'string' ? stored.split('$') : [];
  if (parts.length !== 4 || parts[0] !== 'pbkdf2-sha256') return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1_000 || iterations > PBKDF2_ITERATIONS) return false;
  const salt = fromBase64Url(parts[2]);
  const expected = fromBase64Url(parts[3]);
  if (!salt || salt.length < 8 || !expected || expected.length !== 32) return false;
  if (typeof password !== 'string') return false;
  return sameBytes(await derive(password, salt, iterations), expected);
}

/** Bilinmeyen bir e-postada da aynı sürede cevap vermek için kullanılan sahte özet. */
export const DUMMY_HASH = `pbkdf2-sha256$${PBKDF2_ITERATIONS}$bGVybmtva28tZHVtbXk$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;

/** Çerez için yeni rastgele oturum anahtarı. */
export function newToken(): string {
  return toBase64Url(randomBytes(32));
}

/** Oturum anahtarının veritabanında saklanan SHA-256 özeti (onaltılık). */
export async function tokenHash(token: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token)));
  return Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validToken(token: string | null | undefined): token is string {
  return typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function newMemberId(): string {
  return `member:${crypto.randomUUID()}`;
}

/** Cookie başlığından tek bir çerezi okur (aynı adla birden çok çerez varsa hiçbirine güvenmez). */
export function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null;
  const values = header
    .split(';')
    .map(part => part.trim())
    .filter(part => part.startsWith(name + '='))
    .map(part => part.slice(name.length + 1));
  return values.length === 1 && values[0] ? values[0] : null;
}

export function sessionCookie(token: string, secure: boolean): string {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_DAYS * 24 * 60 * 60}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

export function clearSessionCookie(secure: boolean): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

/** Giriş yapmadan açılabilen sayfalar: tanıtım, giriş, üye ol ve yasal metinler. */
export const PUBLIC_PAGES = new Set(['/', '/giris', '/uye-ol', '/gizlilik', '/kullanim-kosullari']);
/** Giriş ve çıkış adresleri (dönüş adresi olarak kullanılmaz). */
export const AUTH_PATHS = new Set(['/giris', '/uye-ol', '/cikis', '/signin-with-chatgpt', '/signout-with-chatgpt', '/auth/login', '/auth/logout', '/callback']);

/** Dosya (resim, ses, betik, stil…) ya da çerçevenin kendi adresi mi? */
export function isAssetPath(pathname: string): boolean {
  return /\.[a-z0-9]{1,8}$/i.test(pathname) || pathname.startsWith('/_next/') || pathname.startsWith('/@') || pathname.startsWith('/__') || pathname.startsWith('/cdn-cgi/') || pathname.startsWith('/node_modules/');
}

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PAGES.has(pathname) || pathname === '/api' || pathname.startsWith('/api/') || isAssetPath(pathname);
}

/** Giriş sonrası dönülecek adres: yalnızca bu sitenin kendi sayfaları; giriş/çıkış sayfaları olmaz. */
export function safeReturnTo(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  let url: URL;
  try {
    url = new URL(value, 'https://lernkoko.local');
  } catch {
    return '/';
  }
  if (url.origin !== 'https://lernkoko.local' || AUTH_PATHS.has(url.pathname) || url.pathname.startsWith('/api/')) return '/';
  return url.pathname + url.search + url.hash;
}

export function signInPath(returnTo: string): string {
  const target = safeReturnTo(returnTo);
  return target === '/' ? '/giris' : `/giris?return_to=${encodeURIComponent(target)}`;
}
