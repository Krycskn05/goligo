/**
 * "Bu ünitede": what a unit teaches, for the left page of a unit's notebook (the learner asked, 25 October 2026).
 * Written in our own words from the topics of the learner's textbook contents page — no sentences, names or titles
 * of the book are copied; the German examples are everyday phrases. Bold with **…**.
 * Lektion 3's list follows its pages (5 November 2026), Lektion 4's too (8 November 2026).
 */
export const unitGoalsById:Record<string,string[]>={
 // Lektion 1 „Willkommen!“
 'book-01':[
  'Selamlaş ve vedalaş: **Guten Tag! · Hallo! · Tschüss!**',
  'Kendini tanıt: **Ich heiße … · Ich komme aus …**',
  'Dillerini söyle: **Ich spreche … und ein bisschen Deutsch.**',
  'Resmî mi samimi mi? **Wie heißen Sie? · Wie heißt du?**',
  'Hâl hatır sor ve teşekkür et: **Wie geht’s? · Danke!**',
  'Anlamadığında sor, adını harf harf söyle: **Wie bitte? · Ich buchstabiere: …**',
  'Farklı dillerdeki selamlaşmaları karşılaştır, kısa bir çizgi roman oku',
  'Gramer: **ich / du / Sie** ile fiiller, **aus** + ülke, fiil cümlede 2. sırada',
  'Telaffuz: W-sorularında ses sonda düşer — **Woher kommst du? ↘** · İpucu: önemli cümleleri ezberle, telefonunla tekrar et',
 ],
 // Lektion 2 „Berufe“
 'book-02':[
  'Mesleğini söyle ve sor: **Was sind Sie von Beruf? · Ich bin Lehrerin.**',
  'Kendini ve başka birini tanıt: **Das ist … · Sie heißt …**',
  'Bir bilgiyi onayla ya da düzelt: **Ja, richtig. · Nein, …**',
  'Kişiler hakkında kısa metin yaz, bir form doldur',
  'Sayılar 0–20',
  'Yardım iste, anlamadığını göster: **Können Sie mir helfen? · Noch einmal, bitte.**',
  'Sayıların elle nasıl gösterildiğini farklı kültürlerde karşılaştır',
  'Gramer: kadın meslek adları **-in** ile (**Lehrer → Lehrerin**), fiillerin şimdiki zamanı',
  'Telaffuz: kelime vurgusu · İpucu: uzun kelimeleri parça parça öğren',
 ],
 // Lektion 3 „Orte und Dinge“
 'book-03':[
  'Eşyaların adını söyle, Almancasını sor: **Wie heißt das auf Deutsch?**',
  'Bir yeri anlat: **Hier ist ein Tisch, aber kein Stuhl.**',
  'Küçük ilanları anla, telefonda kendini tanıt ve bilgi iste',
  'Sayılar 21–1000, fiyat sor: **Was kostet …?**',
  'Neyi önemli bulduğunu söyle: **Ich finde … wichtig.**',
  'Sözlükte artikeli bul, bir iş yerini anlat: **Die Schere ist alt, aber gut.**',
  'Gramer: artikeller **der / das / die**, **er / es / sie**',
  'Telaffuz: **a, e, i, o, u** · İpucu: kelime kartlarıyla ve sözlükle çalış',
 ],
 // Lektion 4 „Familie“
 'book-04':[
  'Aileni tanıt, kim kimin nesi: **Das ist meine Mutter. · der Vater von Rami**',
  'Kaç kardeş, kaç çocuk: **Wie viele Geschwister hast du? · Ich habe zwei Brüder.**',
  'Medeni durumunu söyle: **Ich bin ledig / verheiratet / geschieden.**',
  'Neyin var, neyin yok, neye ihtiyacın var: **Ich habe ein Handy, aber kein Auto. · Ich brauche …**',
  'Gelecek planları: **In 15 Jahren habe ich vielleicht ein Haus.**',
  'Özel sorulara nazikçe hayır de: **Entschuldigung, das ist meine Privatsache.**',
  'Bir Elfchen (on bir kelimelik şiir) yaz, kelimeleri alanlara göre öğren',
  'Gramer: çoğul, **haben**, Akkusativ **einen / keinen**, iyelik **mein, dein, sein, ihr, unser, euer, Ihr**',
  'Telaffuz: sondaki **-er**, **-e / -en** · Yazım: **ie / ei** · Fiil ekleri: **arbeiten, sprechen, heißen**',
 ],
 // Lektion 15 „Wege in der Stadt“ (Teil A since 30 October 2026, from the learner's lesson page)
 'book-15':[
  'Bir binada yolu sor ve tarif et: **Wo ist …? · Gehen Sie nach links.**',
  'Danışmada yardım iste: **Können Sie mir bitte helfen?**',
  'Katları söyle: **im Erdgeschoss · im ersten Stock · im Keller**',
  'Hangi daireye gideceğini söyle: **zum / zur** + **müssen**',
  'Bir şeyin olup olmadığını sor: **Gibt es hier einen Aufzug?**',
  'Resmî daireleri tanı: Bürgerbüro, Ausländerbehörde, Führerscheinstelle',
  'Bilgi panosunu oku, anladığını kontrol et: **Also …? – Ja, genau!**',
  'Telaffuz: **Ach-Laut** ve **Ich-Laut**, uzun kelimelerde vurgu ilk parçada',
 ],
};
export const unitGoalsFor=(unitId:string)=>unitGoalsById[unitId]??[];
