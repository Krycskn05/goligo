# Veritabanı verilerini ayrıca dışa aktarma

Kaynak sürümü dört D1 tablosu kullanır:

| Tablo | İşlev | Bu paketteki veri |
| --- | --- | --- |
| study_answers | Verilen cevap ve doğru/yanlış sonucu | 762 satır; okunan değerler kırpılmadı |
| study_review | Yanlış sayısı, seri, tekrar tarihi | 417 satır; okunan değerler kırpılmadı |
| study_notes | Kullanıcı notları | 1 satır; okunan değerler kırpılmadı |
| study_sessions | Oturum ve sıralı soru/seçenek listesi | 122 satırın metadata'sı; questions alanı yok |

JSON dosyaları ve records-only.sql sayfalı, salt okunur canlı okumalardan
üretilmiştir. Bu okumalar tek bir transaction/snapshot içinde alınmadığı için
okuma sırasında değişen bir veritabanının tek ana ait tam yedeği sayılmaz.
questions alanındaki 24 değer araçta kırpıldığı için eksik soru listeleri
aktarılmamıştır. Soru sırasını veya şıkları tahmin ederek tamamlama.

## Tam yedeği alma

Mevcut kaynak .openai/hosting.json dosyasında DB bağını bildirir.
vite.config.ts içindeki 00000000-0000-4000-8000-000000000000 kimliği yerel
placeholder'dır; mevcut canlı veritabanının gerçek ID'si değildir.

Canlı D1'ın bulunduğu Cloudflare hesabına ve gerçek veritabanına erişimin varsa,
yetkili hesapta şu komutla şema ve tüm veriyi birlikte dışa aktar:

    pnpm exec wrangler d1 export GERCEK_VERITABANI_ADI --remote --output ./lernkoko-live-full.sql

Bu komutu hangi hesaba ve veritabanına uyguladığını kontrol et. Mevcut D1
Sites tarafından yönetilen sağlayıcı hesabındaysa kendi Cloudflare girişin
ona otomatik erişim vermez. Sites veritabanı görünümünden tam veriyi veya
sağlayıcı destek kanalından dört tablonun **kırpılmamış tam SQL dökümünü**
iste. Görünümde yalnızca tablo görüntüleme olması bir dışa aktarma düğmesi
bulunduğunu garanti etmez. Bu çalışma alanındaki araçla tam SQL dökümü alınamadı.

Tam yedek için şunlar korunmalı:

- study_sessions.questions JSON metninin tamamı, soru sırası ve seçenek sırası.
- Tüm user_id, session id ve question id değerleri.
- Zaman damgaları, doğru/yanlış, yanlış sayıları, seri ve due_at değerleri.
- Tabloların şeması, indeksler ve bütün satırlar.

## Tam yedeği yeni yere aktarma

Tam SQL dökümü şema içeriyorsa aynı şemayı önceden tekrar oluşturma.
Yeni, boş yerel veritabanına aktarım:

    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file ./lernkoko-live-full.sql

Yeni Cloudflare hesabındaki **ayrı, boş hedef** D1 için:

    pnpm exec wrangler d1 execute YENI_HEDEF_VERITABANI --remote --file ./lernkoko-live-full.sql

Bu komut bir hedefe veri yazar. Mevcut LernKoko canlı veritabanını hedef olarak
kullanma. İçe aktarım sonrası dört tablo satır sayısını, questions JSON'larını,
yarım kalmış oturumları ve birkaç doğru/yanlış örneğini doğrula.

## Yalnızca bu paketteki kısmi kayıtları denemek

Tam yedek gelmeden yerelde cevap/tekrar/not verisini incelemek için, boş yerel
DB'ye schema.sql uygulanmış olması gerekir. Sonra:

    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file migration/database/records-only.sql

Bu işlem study_sessions satırlarını oluşturmaz; kaldığın yerden devam özelliğini
tam olarak geri getirmez. JSON'ları yeni bir veri modeline dönüştürmek için
kullanabilirsin; onları tam canlı yedek diye içe aktarma.

Yeni giriş sisteminin kullanıcı kimlikleri eskileriyle aynı olmayabilir.
Doğrulanmış eski-yeni kullanıcı eşleştirmesini oluştur ve dört tablodaki
user_id alanlarını birlikte taşı. Eski kimliği her yeni ziyaretçiye atama.

## Tarayıcıdaki taslak ve ses ayarları

Bu kaynakların dışa aktarımı, senin açık tarayıcındaki localStorage verilerini
otomatik okuyamaz. Eski siteyi giriş yaptığın tarayıcıda aç. Geliştirici
araçlarının Application/Storage bölümünde localStorage kayıtlarını ayrıca
kaydet. Aşağıdaki salt okunur komut yalnızca ilgili uygulama anahtarlarını kopyalar:

    const keys = Object.keys(localStorage).filter(k => /^(lernkoko|german-study)/.test(k));
    const draft = {origin: location.origin, exportedAt: new Date().toISOString(), values: Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)]))};
    copy(JSON.stringify(draft, null, 2));

copy, tarayıcının geliştirici konsolu yardımcısıdır; normal sayfa JavaScript'inde
bulunmayabilir. Çıktıyı yerel bir JSON dosyasına kaydet. OAuth çerezlerini veya
kimlik tokenlarını taşıma. Yeni origin'de taslakları içe almadan önce oturum ve
soru ID'lerinin gerçekten taşınmış olduğunu doğrula.

## Resmî komut belgeleri

- https://developers.cloudflare.com/d1/best-practices/import-export-data/
- https://developers.cloudflare.com/workers/wrangler/commands/d1/

Komutlar 13 Ekim 2026 tarihinde bu belgelerle kontrol edildi.
