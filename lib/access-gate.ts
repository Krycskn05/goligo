// Cloudflare Access kimlik katmanı — ChatGPT Sites'ın "dispatch" katmanının yerini alır.
//
// Üretimde (Cloudflare Worker) her istekte çalışır:
// 1. İstemciden gelen `oai-authenticated-user-*` başlıklarını HER ZAMAN siler;
//    böylece kimse bu başlıkları kendisi yazarak başka biri gibi davranamaz.
// 2. Cloudflare Access'in eklediği `Cf-Access-Jwt-Assertion` belgesini (JWT)
//    Access'in açık anahtarlarıyla doğrular (imza, aud, iss, süre).
// 3. Doğrulanan kullanıcıyı uygulamanın zaten beklediği başlıklarla iletir
//    (app/chatgpt-auth.ts değişmeden çalışır).
// 4. Access ayarları (TEAM_DOMAIN, POLICY_AUD) yoksa siteyi kapalı tutar.

export type AccessSettings = { TEAM_DOMAIN?: string; POLICY_AUD?: string };
export type AccessClaims = { sub: string; email: string };
type Jwks = { keys?: (JsonWebKey & { kid?: string })[] };

const IDENTITY_HEADER_PREFIX = "oai-authenticated-user-";
const JWKS_TTL_MS = 60 * 60 * 1000;
const CLOCK_SKEW_S = 60;
const keyCache = new Map<string, { expires: number; keys: Map<string, CryptoKey> }>();

/** "takim", "takim.cloudflareaccess.com" veya tam adresi https://takim.cloudflareaccess.com biçimine çevirir. */
export function normalizeTeamDomain(value: string | undefined): string | null {
  const raw = value?.trim().replace(/\/+$/, "");
  if (!raw) return null;
  const host = raw.replace(/^https?:\/\//, "");
  const full = host.includes(".") ? host : `${host}.cloudflareaccess.com`;
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(full)) return null;
  return `https://${full.toLowerCase()}`;
}

/** İstemcinin gönderdiği kimlik başlıklarını silinmiş bir kopya döndürür. */
export function withoutClientIdentity(headers: Headers): Headers {
  const copy = new Headers(headers);
  const names: string[] = [];
  copy.forEach((_value, name) => names.push(name));
  for (const name of names) {
    if (name.toLowerCase().startsWith(IDENTITY_HEADER_PREFIX)) copy.delete(name);
  }
  return copy;
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJson(part: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(new TextDecoder().decode(base64UrlToBytes(part)));
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function signingKeys(teamDomain: string, fetcher: typeof fetch, refresh: boolean): Promise<Map<string, CryptoKey>> {
  const cached = keyCache.get(teamDomain);
  if (cached && !refresh && cached.expires > Date.now()) return cached.keys;
  const response = await fetcher(`${teamDomain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error(`Access anahtarları alınamadı (${response.status})`);
  const body = (await response.json()) as Jwks;
  const keys = new Map<string, CryptoKey>();
  for (const jwk of body.keys ?? []) {
    if (!jwk.kid || jwk.kty !== "RSA") continue;
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    keys.set(jwk.kid, key);
  }
  keyCache.set(teamDomain, { expires: Date.now() + JWKS_TTL_MS, keys });
  return keys;
}

/** Access JWT'sini doğrular; geçerliyse kullanıcı bilgisini, değilse null döndürür. */
export async function verifyAccessJwt(
  token: string,
  teamDomain: string,
  audience: string,
  fetcher: typeof fetch = fetch,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<AccessClaims | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const header = decodeJson(parts[0]);
  const payload = decodeJson(parts[1]);
  if (!header || !payload || header.alg !== "RS256" || typeof header.kid !== "string") return null;

  let keys = await signingKeys(teamDomain, fetcher, false);
  if (!keys.has(header.kid)) keys = await signingKeys(teamDomain, fetcher, true);
  const key = keys.get(header.kid);
  if (!key) return null;

  const signed = new Uint8Array(new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  let signature: Uint8Array<ArrayBuffer>;
  try {
    signature = base64UrlToBytes(parts[2]);
  } catch {
    return null;
  }
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, signed);
  if (!valid) return null;

  const aud = payload.aud;
  const audiences = Array.isArray(aud) ? aud : [aud];
  if (!audiences.includes(audience)) return null;
  if (payload.iss !== teamDomain) return null;
  if (typeof payload.exp !== "number" || payload.exp + CLOCK_SKEW_S < nowSeconds) return null;
  if (typeof payload.nbf === "number" && payload.nbf - CLOCK_SKEW_S > nowSeconds) return null;
  if (typeof payload.sub !== "string" || !payload.sub) return null;
  if (typeof payload.email !== "string" || !payload.email.includes("@")) return null;
  return { sub: payload.sub, email: payload.email };
}

function safeReturnPath(url: URL, request: Request): string {
  const fromQuery = url.searchParams.get("return_to");
  if (fromQuery && fromQuery.startsWith("/") && !fromQuery.startsWith("//")) return fromQuery;
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const ref = new URL(referer);
      if (ref.origin === url.origin && !ref.pathname.startsWith("/auth/")) return ref.pathname + ref.search;
    } catch {
      // geçersiz referer: ana sayfaya dön
    }
  }
  return "/";
}

function html(status: number, title: string, message: string): Response {
  const body = `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1rem;color:#24414b"><h1 style="font-size:1.5rem">${title}</h1><p>${message}</p></body></html>`;
  return new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

function redirect(location: string): Response {
  return new Response(null, { status: 302, headers: { location, "cache-control": "no-store" } });
}

/**
 * Üretim isteğini kapıdan geçirir. Ya uygulamaya iletilecek (kimliği eklenmiş)
 * yeni bir Request ya da doğrudan döndürülecek bir Response verir.
 */
export async function accessGate(
  request: Request,
  settings: AccessSettings,
  fetcher: typeof fetch = fetch,
): Promise<Request | Response> {
  const teamDomain = normalizeTeamDomain(settings.TEAM_DOMAIN);
  const audience = settings.POLICY_AUD?.trim();
  if (!teamDomain || !audience) {
    return html(503, "LernKoko hazırlanıyor", "Giriş kapısı henüz açılmadı. Kurulum bitince bu adres açılacak.");
  }

  const token = request.headers.get("cf-access-jwt-assertion");
  let claims: AccessClaims | null = null;
  if (token) {
    try {
      claims = await verifyAccessJwt(token, teamDomain, audience, fetcher);
    } catch (error) {
      console.error("Access doğrulaması yapılamadı", error);
      return html(503, "Giriş doğrulanamadı", "Giriş servisine şu anda ulaşılamıyor. Biraz sonra yeniden dene.");
    }
  }
  if (!claims) return html(403, "Giriş gerekli", "Bu siteyi görmek için Cloudflare girişinden geçmen gerekiyor.");

  const url = new URL(request.url);
  // ChatGPT Sites'ın yönettiği eski giriş/çıkış adresleri artık burada karşılanır.
  if (url.pathname === "/signin-with-chatgpt" || url.pathname === "/auth/login") return redirect(safeReturnPath(url, request));
  if (url.pathname === "/signout-with-chatgpt" || url.pathname === "/auth/logout") return redirect("/cdn-cgi/access/logout");
  if (url.pathname === "/callback") return redirect("/");

  const headers = withoutClientIdentity(request.headers);
  headers.set("oai-authenticated-user-id", `cf-access:${claims.sub}`);
  headers.set("oai-authenticated-user-email", claims.email);
  return new Request(request, { headers });
}
