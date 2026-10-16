# Üyelik (e-posta + şifre)

LernKoko herkese açık bir üyelik sitesidir. Giriş yapmamış ziyaretçi tanıtım
sayfasını (`/`), giriş (`/giris`), üye ol (`/uye-ol`), gizlilik (`/gizlilik`) ve
kullanım koşulları (`/kullanim-kosullari`) sayfalarını görür. Ders sayfaları
giriş sayfasına yönlenir; giriş sonrası kişi istediği sayfaya döner.

## Parçalar

| Dosya | Görevi |
| --- | --- |
| `lib/site-gate.ts` | Her istekte çalışan kapı. İstemcinin yazdığı kimlik başlıklarını siler, oturum çerezini D1'de doğrular, kimliği uygulamaya iletir, girişsiz ziyaretçiyi yönlendirir. |
| `lib/member-auth.ts` | Şifre özeti (PBKDF2-SHA256, 100 000 tur, üyeye özel tuz), oturum anahtarı, çerez, e-posta/şifre kuralları, güvenli dönüş adresi. |
| `lib/member-store.ts` | D1 sorguları: üyeler, oturumlar, deneme sınırı, hesabı silme, veri dökümü. |
| `app/api/auth/route.ts` | Üye ol, giriş, çıkış, ad ve şifre değiştirme, hesabı silme, verilerimi indir. |
| `migration/database/members.sql` | `members`, `member_sessions`, `auth_attempts` tabloları. Her yayında `ci/yayin.sh` çalıştırır; `IF NOT EXISTS` sayesinde kayıtlara dokunmaz. |

Üyenin kimliği (`members.id`) çalışma tablolarındaki `user_id` ile aynıdır.

## Güvenlik notları

- Şifrenin kendisi hiçbir yerde saklanmaz; oturum çerezindeki anahtarın da yalnızca SHA-256 özeti saklanır.
- Çerez `HttpOnly`, `SameSite=Lax`, https'te `Secure`; 30 gün geçerli. Şifre değişince diğer oturumlar kapanır.
- Hatalı giriş sınırı: aynı e-postaya 15 dakikada 10, aynı IP'ye 15 dakikada 30 deneme. Sayaçlar en fazla 24 saat tutulur.
- `/api/auth` yalnızca aynı siteden (Origin başlığı) gelen isteği kabul eder.

## Cloudflare Access'ten geçiş

Access açıkken siteye girmiş kişi `/uye-ol` sayfasından üye olursa, yeni hesabı
eski Access kimliğini (`cf-access:...`) alır; eski ilerlemesi kaybolmaz. Bundan sonra
Cloudflare panelinden Access uygulaması kaldırılınca site herkese açılır. Access
belgesi yoksa ya da doğrulanamazsa kapı onu yok sayar ve üyelikle devam eder.

## Henüz olmayanlar

- Şifre sıfırlama e-postası (bir e-posta gönderme servisi gerekir).
- E-posta adresinin doğrulanması.
- İletişim adresi: `lib/site-brand.ts` içindeki `SITE_CONTACT_EMAIL` boş.
