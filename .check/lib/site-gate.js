"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFIED_ACCESS_EMAIL = exports.VERIFIED_ACCESS_ID = void 0;
exports.siteGate = siteGate;
// Goliqo giriş kapısı: her istekte (yerelde de) çalışır.
//
// 1. İstemcinin yazdığı kimlik başlıklarını (`oai-authenticated-user-*`, `lk-verified-*`)
//    HER ZAMAN siler; kimlik yalnızca sunucuda doğrulanan bir oturumdan gelir.
// 2. Kimlik kaynakları, öncelik sırasıyla:
//    - üyelik oturumu: HttpOnly `lk_session` çerezi → D1'deki member_sessions kaydı,
//    - Cloudflare Access belgesi (geçiş dönemi; Access kapatılınca kendiliğinden biter),
//    - yalnızca yerel geliştirmede: build/sites-vite-plugin.ts'in deneme girişi.
// 3. Doğrulanan kişi, uygulamanın beklediği başlıklarla iletilir (app/chatgpt-auth.ts).
// 4. Giriş yapmamış ziyaretçi yalnızca tanıtım, giriş, üye ol ve yasal sayfaları görür;
//    ders sayfaları onu giriş sayfasına yönlendirir (API'ler kendi 401 cevabını verir).
const access_gate_1 = require("./access-gate");
const member_auth_1 = require("./member-auth");
const member_store_1 = require("./member-store");
/** Access ile doğrulanmış kimlik (üye olurken eski kayıtları bağlamak için). */
exports.VERIFIED_ACCESS_ID = 'lk-verified-access-id';
exports.VERIFIED_ACCESS_EMAIL = 'lk-verified-access-email';
const SIGN_IN_PATHS = new Set(['/signin-with-chatgpt', '/auth/login']);
const SIGN_OUT_PATHS = new Set(['/cikis', '/signout-with-chatgpt', '/auth/logout']);
function redirect(location, cookie) {
    const headers = new Headers({ location, 'cache-control': 'no-store' });
    if (cookie)
        headers.append('set-cookie', cookie);
    return new Response(null, { status: 302, headers });
}
/** Aynı sitedeki bir önceki sayfa (eski "giriş yap" bağlantıları için dönüş adresi). */
function refererPath(request, url) {
    const referer = request.headers.get('referer');
    if (!referer)
        return '/';
    try {
        const ref = new URL(referer);
        return ref.origin === url.origin ? (0, member_auth_1.safeReturnTo)(ref.pathname + ref.search) : '/';
    }
    catch {
        return '/';
    }
}
/**
 * İsteği kapıdan geçirir. Ya uygulamaya iletilecek (kimliği eklenmiş) yeni bir
 * Request ya da doğrudan döndürülecek bir Response (yönlendirme) verir.
 */
async function siteGate(request, env, options = {}) {
    const url = new URL(request.url);
    const path = url.pathname;
    const secure = url.protocol === 'https:';
    const dev = options.devIdentity
        ? {
            id: request.headers.get('oai-authenticated-user-id'),
            email: request.headers.get('oai-authenticated-user-email'),
            name: request.headers.get('oai-authenticated-user-full-name'),
            nameEncoding: request.headers.get('oai-authenticated-user-full-name-encoding'),
        }
        : null;
    const headers = (0, access_gate_1.withoutClientIdentity)(request.headers);
    if ((0, member_auth_1.isAssetPath)(path))
        return new Request(request, { headers });
    const db = env.DB;
    const token = (0, member_auth_1.readCookie)(request.headers.get('cookie'), member_auth_1.SESSION_COOKIE);
    let member = null;
    if (token && db) {
        try {
            member = await (0, member_store_1.memberForToken)(db, token, options.now);
        }
        catch (error) {
            console.error('Üyelik oturumu okunamadı', error);
        }
    }
    let access = null;
    const jwt = request.headers.get('cf-access-jwt-assertion');
    const team = (0, access_gate_1.normalizeTeamDomain)(env.TEAM_DOMAIN);
    const audience = env.POLICY_AUD?.trim();
    if (jwt && team && audience) {
        try {
            access = await (0, access_gate_1.verifyAccessJwt)(jwt, team, audience, options.fetcher ?? fetch);
        }
        catch (error) {
            console.error('Access doğrulaması yapılamadı', error);
        }
    }
    if (SIGN_OUT_PATHS.has(path)) {
        if (token && db) {
            try {
                await (0, member_store_1.deleteSession)(db, token);
            }
            catch (error) {
                console.error('Oturum kapatılamadı', error);
            }
        }
        return redirect('/', (0, member_auth_1.clearSessionCookie)(secure));
    }
    if (SIGN_IN_PATHS.has(path)) {
        const back = url.searchParams.has('return_to') ? (0, member_auth_1.safeReturnTo)(url.searchParams.get('return_to')) : refererPath(request, url);
        return redirect(member ? back : (0, member_auth_1.signInPath)(back));
    }
    if (path === '/callback')
        return redirect('/');
    if (member && (path === '/giris' || path === '/uye-ol'))
        return redirect((0, member_auth_1.safeReturnTo)(url.searchParams.get('return_to')));
    const accessId = access ? `cf-access:${access.sub}` : null;
    const userId = member?.id ?? accessId ?? dev?.id ?? null;
    const email = member?.email ?? access?.email ?? dev?.email ?? null;
    if (userId && email) {
        headers.set('oai-authenticated-user-id', userId);
        headers.set('oai-authenticated-user-email', email);
        if (member) {
            headers.set('oai-authenticated-user-full-name', encodeURIComponent(member.name));
            headers.set('oai-authenticated-user-full-name-encoding', 'percent-encoded-utf-8');
        }
        else if (!access && dev?.name) {
            headers.set('oai-authenticated-user-full-name', dev.name);
            if (dev.nameEncoding)
                headers.set('oai-authenticated-user-full-name-encoding', dev.nameEncoding);
        }
    }
    if (access && accessId) {
        headers.set(exports.VERIFIED_ACCESS_ID, accessId);
        headers.set(exports.VERIFIED_ACCESS_EMAIL, access.email);
    }
    if (!(userId && email) && !(0, member_auth_1.isPublicPath)(path)) {
        if (request.method === 'GET' || request.method === 'HEAD')
            return redirect((0, member_auth_1.signInPath)(path + url.search));
        return new Response('Giriş gerekli.', { status: 401, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
    }
    return new Request(request, { headers });
}
