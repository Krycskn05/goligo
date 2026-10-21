# Goliqo taşıma kopyası (eski adı LernKoko)

Bu klasör yayımdaki kaynakların dışa aktarımıdır. Önce 01-BASLA-BURADAN.md,
migration/BAGIMSIZ-YAYIN.md ve migration/VERITABANI-AKTARIMI.md dosyalarını oku.

- Kullanıcı mevcut yayımdaki siteyi değiştirmemeyi istedi. Bu kopyadan orijinal
  Sites projesine push, deploy, silme, veri yazma veya şema güncellemesi yapma.
- .openai/hosting.json içindeki project_id kaynak kökenini gösterir; yeni bir
  projenin kimliği değildir. Yeni barındırmayı ayrı hesap/proje/veritabanında kur.
- Orijinal kaynak dosyaları aynen korunmuştur. AGENTS.md mevcut sitenin
  çalışma kurallarını içerir; bu dışa aktarımda yayınlama izni vermez.
- Önce Node 24, pnpm 11.25.0 ve pnpm-lock.yaml ile yerel kurulum yap.
- Soru, kelime, kategori ve oturum ID'lerini değiştirme. Değişiklik gerekirse
  veritabanı ve kullanıcı eşleştirmesi için açık bir göç planı hazırla.
- Almanca A1.1/A1.2 katalogları ile aktif Ev ve Yaşam ve Nesne Kasası ayrımını koru.
- Cevapta doğru/yanlış efektinden sonra yalnızca doğru cevap okunur.
  Soru metnini, çeviriyi veya açıklamayı otomatik seslendirme.
- migration/database/records-only.sql tam veritabanı yedeği değildir.
  Oturum soru listeleri dahil değildir. Bu dosyayı canlıya otomatik uygulama.
- Gizli anahtarlar ve node_modules pakete dahil değildir. Giriş altyapısını
  sunucuda doğrulanmış oturum kimliğiyle kur; kullanıcıdan gelen kimlik
  başlıklarına güvenerek üretim kimlik doğrulaması yapma.
- Yayımdaki kaynakta bulunmayan ayrı kategori yüzdelik panelini mevcutmuş gibi sunma.
- Test veya derleme sonucu olmadan projeyi doğrulandı diye raporlama.
