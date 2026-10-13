# Bağımsız barındırma için gerekenler

Mevcut teknoloji: React 19, TypeScript, Vinext/Vite, Cloudflare Worker,
Cloudflare D1 ve Drizzle. Tam sürümler package.json ve pnpm-lock.yaml dosyalarındadır.

## Kaynağı koruyarak yerelde başla

01-BASLA-BURADAN.md dosyasındaki kurulum yolunu kullan. Sadece statik sayfaları
taşımak /api/study kayıt işlemini taşımaz. DB bağını ve sunucu tarafı kimliği
korumadan cevaplar veya ilerleme kaydedilemez.

## Cloudflare'da yeni bir proje

Yeni, kendi hesabına ait bir Worker ve D1 oluştur. vite.config.ts içindeki
yerel placeholder veritabanı tanımını yeni D1'ın gerçek adı ve ID'siyle
yalnızca taşıma kopyasında yapılandır. Binding adı DB olarak kalırsa db/index.ts
değişmeden kullanılabilir. .openai/hosting.json asıl projenin kaynak izidir;
onun project_id değeriyle orijinal Sites projesine yayın yapma.

Build sonucu dist/server/wrangler.json dosyası oluşur. Yeni hesaba yayın
öncesi bu üretilen Worker yapılandırmasını, D1 bağını, route/alan adını ve
kimlik katmanını gözden geçir. Bu arşiv yayın veya Cloudflare giriş işlemi yapmaz.

## Kimlik doğrulama

app/chatgpt-auth.ts Sites dispatch katmanının doğrulayarak eklediği
oai-authenticated-user-id ve email başlıklarını bekler. /signin-with-chatgpt,
/signout-with-chatgpt ve /callback üretimde platform tarafından karşılanır.
Bu servisler proje kaynağından bağımsızdır.

build/sites-vite-plugin.ts yalnızca loopback geliştirme sunucusunda yerel
giriş taklidi sağlar. pnpm run dev sırasında bu taklit kullanılabilir.
pnpm run start ile açılan üretim Worker önizlemesi gerçek kimlik servisi
sağlamaz; o ortamda /api/study 401 dönebilir.

Yeni üretim sunucusunda doğrulanmış oturumla kullanıcı kimliği üreten bir
sunucu katmanı kur ve getChatGPTUser bağımlılığını ona uyarla. İstemciden
gelen kimlik başlıkları tek başına kimlik doğrulaması değildir.
Eski verilerle yeni kullanıcı kimliklerini eşleştir; aynı kullanıcıya ait
cevap, not, tekrar ve oturum satırları aynı kimliğe bağlı kalmalı.

## Başka Node sunucusu veya veritabanı

db/index.ts cloudflare:workers modülünden D1 bağını alır.
Başka bir sunucuya taşımak bu adaptörün ve build/sites-worker.ts girişinin
yeni çalışma ortamına uyarlanmasını gerektirir. Soru bankaları ve ID'ler
aynı bırakılabilir. SQLite/D1 yerine farklı bir SQL motoruna geçilecekse
şema ve app/api/study/route.ts içindeki sorgular uyarlanmalıdır.

## Ses ve görseller

public/ içindeki bütün kayıtlı dosyalar arşive eklenmiştir. Görseller için
atlas kırpma koordinatları lib/*art.json ve lib/housing-illustrations.ts
dosyalarındadır; bu JSON'ları görüntülerden ayırma.
WAV dosyaları özgün kısa efektlerdir. Kelime telaffuzu tarayıcı
speechSynthesis işlevine bağlıdır; kalite ve kullanılabilir sesler cihazdan cihaza değişir.

## Ortam ve dış servisler

Kaynakta Git erişim tokenı, OAuth çerezi, bulut API anahtarı veya .env sırrı
yoktur. Sites'in runtime değişken listesinden bu sürüm için ek uygulama
değişkeni bulunmadı. D1, kimlik/dispatch ve alan adı platformda ayrıca yönetilir.
Yeni sağlayıcının anahtarlarını kendi ortamında yapılandır.

## Puanlama ve içerik durumu

Kaynakta puanlanan cevapların doğruluğu, sonuç sayıları, yanlış tekrarları ve
zamanlanmış tekrar kayıtları korunmuştur. Eski study-app bileşeninin yüzdelik
başarı hesapları da alınmıştır. Aktif ana kategori kartlarında ayrı bir
yüzdelik başarı paneli bu yayın sürümünde yoktur; taşıma sırasında varmış
gibi işaretleme.

A1.1/A1.2'de 20 ünite başlığı ve resimleri bulunur. Aktif kitabın 11. ünitesi
Ev ve Yaşam A–D dersleri ve sorularıdır. Diğer katalog başlıklarını henüz
oluşturulmamış tam dersler olarak sunma.

## Arşive alınmayan çalışma dosyaları

.git kimlik/remote bilgileri, node_modules, .wrangler yerel state, .sites-runtime,
derleme önbellekleri ve kişisel tarayıcı depolaması paketlenmemiştir.
Bağımlılıkların kilit dosyası, kaynak kurulum betikleri ve vendor lisansları
pakettedir; bunlar kurulumu yeniden oluşturmak içindir.
Bu arşiv kaynak kodunu ve mevcut veri okuma sonuçlarını taşır; çalışan platform
hesabını, alan adını veya tam veritabanını otomatik devralmaz.
