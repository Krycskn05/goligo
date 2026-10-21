# Goliqo — Claude Code için kaynak arşivi

Bu arşiv, 13 Ekim 2026 tarihinde yayımdaki **36. sürümün** kaynaklarını içerir.
Kaynak commit: a13884802cce48ea38a14ad775a272918c359330
Site: https://lernkoko.koraycoskun05.chatgpt.site

354 kayıtlı proje dosyası aynen alındı. Mevcut siteye kaynak gönderilmedi,
yayın yapılmadı ve veri yazılmadı. Bu paket bağımsız bir geliştirme kopyasıdır.

## Arşivin içeriği

| Bölüm | Dosyalar |
| --- | --- |
| Sayfalar | app/page.tsx, app/ev-esyalar/page.tsx, app/a1-2/ev-ve-yasam/page.tsx |
| A1.1 / A1.2 ünite başlıkları | lib/textbook-curriculum.ts, lib/toon-topic-art.json |
| Kelime kasası ve soru bankaları | lib/object-course.ts, lib/course.ts, lib/object-practice.ts, lib/letter-puzzle.ts |
| Ev ve Yaşam dersleri ve soruları | lib/housing-course.ts, lib/housing-lessons.ts, app/housing-study.tsx |
| Ses ve animasyonlar | public/sounds/, public/toon/, public/objects/, app/learning-effects.css, lib/german-speech.ts |
| Sunucu ve kayıt işlemleri | app/api/study/route.ts, build/sites-worker.ts, db/ |
| Veritabanı şeması | db/schema.ts, drizzle/, migration/database/schema.sql |
| Bağımlılıklar | package.json, pnpm-lock.yaml, pnpm-workspace.yaml, vendor/ |
| Mevcut testler | tests/ |
| Taşıma bilgileri | migration/, CLAUDE.md, SHA256SUMS.txt |

Yayımdaki kaynakta bulunan İngilizce dosyaları ve eski bileşenler de korunmuştur.
Paket mevcut yayın sürümünü esas alır; önceki mesajlarda istenip henüz yayına
alınmamış değişiklikleri tamamlanmış gibi göstermez.

## Mac, Linux veya Windows'ta yerel başlatma

Node.js **24 LTS** ve Corepack/pnpm kullan. Projenin asıl gereksinimi Node.js
22.13 veya üzeridir; paket yöneticisinin kilitli sürümü pnpm 11.25.0'dır.
Windows'ta bash kullanan eski kurulum betikleri yerine aşağıdaki pnpm yolunu kullan.

ZIP'i aç, terminalde Goliqo klasörüne gir:

    corepack enable
    corepack prepare pnpm@11.25.0 --activate
    pnpm install --frozen-lockfile
    pnpm run build

Corepack sisteminde yoksa önce Corepack'i kur veya pnpm 11.25.0'ı doğrudan kur.
Kilit dosyasını silme ve toplu paket güncellemesi yapma. Kurulum npm kayıt
sunucusuna erişim ister; node_modules bu arşive konulmamıştır.

İlk çalıştırmada yalnızca **yerel** veritabanının şemasını oluştur:

    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file migration/database/schema.sql
    pnpm run dev

Geliştirme adresi: http://localhost:5173

Yerel kimlik denemesi için tarayıcıda şu adresi aç:
http://localhost:5173/signin-with-chatgpt?return_to=%2Fev-esyalar

Taşınabilir geliştirme modunda mevcut yerel giriş taklidi çalışır. Bu gerçek
ChatGPT hesabı değildir. Bazı eski giriş düğmeleri /auth/login yolunu kullanır;
bağımsız barındırmaya geçerken bu bağlantıları yeni kimlik sistemine uyarlamak gerekir.

Yerel şemayı bir kez oluştur. Aynı CREATE TABLE dosyasını dolu veritabanında
tekrar çalıştırma. Tam SQL yedeği geldiğinde aktarım adımları için
migration/VERITABANI-AKTARIMI.md dosyasını oku.

Arşive .sites-runtime çalışma alanı konulmadığından temiz bir açılış varsayılan
portable profili kullanır. Eski çalışma alanının .sites-runtime klasörünü
kopyalama. Mac'e Linux node_modules klasörü taşımak yerine bağımlılıkları yeniden kur.

## Claude Code'a verilecek ilk görev

Claude Code'u Goliqo klasöründe aç ve şu metni kullan:

> Önce CLAUDE.md, 01-BASLA-BURADAN.md ve migration/ dosyalarını oku.
> Bu Goliqo'nun yayımdaki 36. sürümünün bağımsız kaynak kopyasıdır.
> Mevcut ChatGPT Sites projesine push, deploy veya veri yazma.
> Bağımlılıkları kilit dosyasıyla kur, projeyi yerelde çalıştır ve
> yeni barındırma ile kimlik doğrulama için gereken değişiklikleri belirle.
> Soru, kelime ve kategori kimliklerini; kayıt şemasını; görselleri,
> sesleri ve doğru/yanlış sonrası doğru cevap telaffuzunu koru.
> Yeni bir yüzdelik puanlama sistemi varmış gibi varsayma.
> Tam canlı veritabanı yedeği olmadan tüm oturumları taşındı diye raporlama.

## Doğrudan taşınamayan parçalar

1. **Tam canlı veritabanı dökümü:** soru listelerinin 24 değeri okuma aracında
   kırpıldı. Üç tablonun okunabilen değerleri ve 122 oturumun soru listesi
   dışındaki bilgileri eklenmiştir; bunlar tek bir atomik veritabanı yedeği değildir.
2. **ChatGPT/Sites giriş altyapısı:** OAuth oturumları, kullanıcı başlığı
   üretimi, platform çerezleri ve alan adı yönlendirmesi kaynak ZIP'iyle kurulamaz.
   Yeni barındırmada kimlik doğrulama ve kullanıcı ID eşleştirmesi gerekir.
3. **Gizli anahtarlar ve sağlayıcı erişimi:** token, çerez, Git kimlik bilgisi
   ve bulut hesabı anahtarı eklenmemiştir. Görülebilen özel runtime değişkeni
   listesi bu sürümde boştur. D1'ın gerçek sağlayıcı hesabı/ID'si alınamadı.
4. **Cihazdaki telaffuz sesleri:** WAV efektleri arşivde; Almanca kelime
   telaffuzu tarayıcının speechSynthesis seslerini kullanır. Apple/Google/Microsoft
   cihaz ses paketleri proje dosyası olarak dışa aktarılamaz.
5. **Tarayıcıdaki yerel durum:** harf bulmacası taslakları, ses tercihleri ve
   yerel kayıtlara ait localStorage/IndexedDB ayrı taşınmalıdır.
6. **Puanlama durumu:** aktif kasada ve Ev ve Yaşam'da doğru/yanlış, tur sonucu,
   soru ilerlemesi ve tekrar kayıtları vardır. Eski study-app.tsx bileşeninde
   yüzdelik hesaplar da korunmuştur. Aktif kategoriler için ayrı bir yüzdelik
   başarı paneli yayımdaki 36. sürümde bulunmuyor.

## Bağımsız yayına geçiş

Bu proje düz bir HTML dosyası değildir: React/TypeScript, Vinext, Cloudflare
Worker ve D1 kullanır. Sadece index.html'i başka bir sunucuya koymak kayıt
sistemini taşımaz. Ayrıntılar migration/BAGIMSIZ-YAYIN.md dosyasındadır.

SHA256SUMS.txt dosyası arşivdeki dosyaların bütünlüğünü kontrol etmek içindir.
migration/export-info.json kaynak sürümünü ve veri okuma sınırlarını kaydeder.
