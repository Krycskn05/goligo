# Arşiv doğrulaması

13 Ekim 2026 tarihinde bu dışa aktarım üzerinde yapılan kontroller:

- 354 kayıtlı kaynak dosyası yayımdaki commit ile byte byte karşılaştırıldı.
- Taşınabilir Vinext üretim derlemesi başarıyla tamamlandı.
- TypeScript kontrolü başarılı oldu.
- Ses, cevap akışı, harf bulmacaları, kategoriler, dinleme, konut soru görselleri
  ve veritabanı/API davranışları için seçilen 60 otomatik kontrol geçti.
- Kısmi records-only.sql yeni bir yerel SQLite veritabanına hatasız uygulandı:
  762 cevap, 417 tekrar kaydı ve 1 not. study_sessions tablosu boş kaldı;
  oturum verilerinin tamamı taşındı diye raporlanmadı.
- ZIP CRC ve SHA256 dosya bütünlüğü kontrol edildi.

Derleme ve testlerde önceden kurulu, mevcut proje kilidiyle eşleşen bağımlılık
ağacı kullanıldı. Arşiv node_modules içermez. Mac/Windows üzerinde sıfırdan
bağımlılık indirilmesi ve gerçek telefon sesinin dinlenmesi burada yapılmadı.
Eski, aktif sayfalardan bağımsız tüm test dosyaları arşivde korunmuştur;
bu kayıt tüm eski test dosyalarının çalıştırıldığı anlamına gelmez.

Kaynak çalışmasında gerçek tarayıcı QA'sı kullanılmadı.
Mevcut canlı site üzerinde yayın veya veri yazma işlemi yapılmadı.
