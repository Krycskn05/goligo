// Cloudflare Access yardımcıları. Site artık üyelikle açılır (lib/site-gate.ts);
// Access belgesi (JWT) yalnızca geçiş döneminde doğrulanır: Access açıkken siteye
// girmiş kişinin eski kayıtları, üye olduğunda yeni hesabına bağlanabilsin diye.
//
// - İstemciden gelen `oai-authenticated-user-*` başlıkları HER ZAMAN silinir;
//   böylece kimse bu başlıkları kendisi yazarak başka biri gibi davranamaz.
// - `Cf-Access-Jwt-Assertion` belgesi Access'in açık anahtarlarıyla doğrulanır
//   (imza, aud, iss, süre).

export type AccessSettings = { TEAM_DOMAIN?: string; POLICY_AUD?: string };
export type AccessClaims = { sub: string; email: string };
type Jwks = { keys?: (JsonWebKey & { kid?: string })[] };

const IDENTITY_HEADER_PREFIX = "oai-authenticated-user-";
/** Kapının uygulamaya ilettiği iç başlıklar (doğrulanmış Access kimliği); istemci yazamaz. */
export const INTERNAL_HEADER_PREFIX = "lk-verified-";
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

/** İstemcinin gönderdiği kimlik (ve iç) başlıklarını silinmiş bir kopya döndürür. */
export function withoutClientIdentity(headers: Headers): Headers {
  const copy = new Headers(headers);
  const names: string[] = [];
  copy.forEach((_value, name) => names.push(name));
  for (const name of names) {
    const lower = name.toLowerCase();
    if (lower.startsWith(IDENTITY_HEADER_PREFIX) || lower.startsWith(INTERNAL_HEADER_PREFIX)) copy.delete(name);
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
