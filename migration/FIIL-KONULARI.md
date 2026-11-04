# Fiil Atölyesi: kitap bölümlerinden konulara geçiş (4 Kasım 2026)

Kullanıcı isteği: "Bu fiilleri de kategorize et, bu bölümdeki oyunu Oyunlar'a çek."
Seçilen yol: Macera haritası artık 4 kitap bölümü yerine 6 konudan oluşuyor.
Eşleştirme kartları Oyunlar'a taşındı; orada tüm fiiller ya da tek bir konu seçilebiliyor.

## Değişmeyenler

- Soru kimlikleri aynı kaldı (`verb-meaning-…`, `verb-write-…`, `verb-partizip-…`, `verb-write-partizip-…`).
- Fiil kimlikleri aynı kaldı.
- Veritabanında hiçbir satır değişmiyor, silinmiyor; şema değişikliği yok.
- Eski turlar (`study_sessions`, `mode='workshop'`, `topic='verbs-all'`) olduğu gibi duruyor ve okunmaya devam ediyor.
- Yanlışlarım turları `mode='review'`, `topic='verbs-all'` ile kaydedilmeye devam ediyor.
- Kitap bölümü kimlikleri (`verbs-w1` … `verbs-w4`) veritabanında hiç tutulmadı. Yalnızca adreste (`?parca=`) ve kodda vardı.
  Kodda `bookParts` adıyla duruyorlar; tek görevleri eski turları okumak.

## Yeni olanlar

- Haritanın bölümleri: `lib/verb-themes.ts` içindeki 6 konu.
  - Kimlikleri `theme-unterwegs`, `theme-essen`, `theme-alltag`, `theme-sprechen`, `theme-geld`, `theme-gefuehle`.
  - Bu kimlikler 3 Kasım'dan beri vardı (Fiil grupları ve oyun rekorları). Yeni bir kimlik eklenmedi.
- Yeni konu turları `topic='verbs-topics'` ile kaydediliyor (`VERB_TOPIC_ROUND`).
  - Böylece aynı fiille başlayan bir konu turu, eski bir kitap turuyla karıştırılmıyor. Örnek: hem 1. kitap bölümü hem
    "Yolculuk ve hareket" konusu `abfahren` ile başlıyor.
  - Sunucu bu konuyu yalnızca `mode='workshop'` için kabul ediyor.
  - Misafirler 1. konuyu (`theme-unterwegs`) deneyebiliyor; misafir turları kaydedilmiyor.

## Kullanıcı ilerlemesi nasıl eşleşiyor

Bir fiil bir konuda "yapıldı" sayılır, aşağıdakilerden biri doğruysa:

1. Eski bir kitap bölümü turunda yapıldıysa. Eskisiyle aynı kurallar geçerli (`bookVerbStatus`):
   - eski sıralar, devam turları ve 152 soruluk ilk tur dahil;
   - bitmiş bir bölüm tikini korur.
2. Cevap kayıtlarında (`study_review`) adımları cevaplanmışsa:
   - anlam tiki: `meaning` + `write`;
   - geçmiş hal tiki: `partizip` + `write-partizip`, ya da eski turlardaki `perfekt` + `write-perfekt`.
3. Bir konu turunda yapıldıysa (`verbs-topics`).

Her fiil tek bir konuda olduğu için hiçbir fiil iki kez sayılmaz. Bir konunun yüzdesi kendi fiillerinin adımlarından hesaplanır.

## Yarım kalan eski turlar

- Yarım kalmış bir kitap bölümü turu haritadan artık açılmıyor. Ama turdaki her cevap fiillere işlenmiş durumda.
- O fiiller kendi konularında yapılmış sayılıyor.
- Bir konuya girildiğinde yeni tur yalnızca eksik olanları soruyor:
  - bitmiş fiiller sorulmuyor;
  - anlamı bitmiş bir fiilde yalnızca geçmiş hal adımları geliyor.
- Konu tamamsa ya da "Baştan başla" seçildiyse konunun tamamı soruluyor.
- Yarım kalmış bir konu turu "Devam et" ile sürüyor. Bu, tamamlanmış bir konu yeniden çalışılırken de geçerli.

## Eski adresler

- `?grup=theme-…` (3 Kasım'daki grup sayfası): o konunun bölüm sayfasını açar.
- `?parca=verbs-w1` gibi eski bölüm adresleri haritaya döner.

## Geri dönüş

Geri dönmek gerekirse kod eski sürüme alınır. Eski kitap turları zaten hiç değişmedi.
`verbs-topics` turları eski kodda kitap bölümü gibi okunur. Bu yüzden geri dönülecekse önce şunu kontrol et:

```sql
SELECT COUNT(*) FROM study_sessions WHERE topic='verbs-topics';
```

Gerekirse bu turlar için ayrı bir okuma kuralı yaz. Satırları silme; cevaplar `study_review` içinde fiillere işlenmiş durumda.

## Testler

- `tests/verb-themes.test.cjs`:
  - konular;
  - Oyunlar seçimi;
  - eski kitap, cevap ve konu turu ilerlemesinin birleşmesi;
  - kalan sorular.
- `tests/verbs.test.cjs`:
  - kitap bölümlerinin eski kuralları;
  - konu sırası;
  - konu turuyla Yanlışlarım (API üzerinden).
- `tests/progress-fixes.test.cjs`: tamamlanmış bir konunun tiki ve yarım tur.
