// Goliqo duman testi: yerel geliştirme sunucusunu (http://localhost:5173)
// gerçek bir tarayıcıyla açar, ekran görüntüsü alır; üyelik akışını (üye ol, çıkış,
// giriş, Hesabım, hesabı silme) yerel bir deneme hesabıyla dener ve kayıt API'sini
// yerel giriş taklidiyle (local_seedy) dener. Yalnızca yerel veritabanına yazar.
const { chromium, devices } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const BASE = "http://localhost:5173";
const OUT = path.join(process.env.LOGS || ".ci-out", "screens");
fs.mkdirSync(OUT, { recursive: true });

const results = [];
let failed = false;
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  if (!ok) failed = true;
  console.log(`${ok ? "GECTI " : "HATA  "} ${name}${detail ? " — " + detail : ""}`);
}

async function visit(page, url, shot, errors) {
  errors.length = 0;
  const response = await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, shot), fullPage: false });
  const title = await page.title();
  const status = response ? response.status() : 0;
  const text = (await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 160);
  const crashes = errors.filter((e) => e.startsWith("pageerror"));
  record(`Sayfa ${url}`, status === 200 && crashes.length === 0,
    `HTTP ${status}, baslik "${title}", hata ${errors.length}${errors.length ? " (" + errors.slice(0, 2).join(" | ") + ")" : ""}, metin: ${text}`);
}

// Uyelik akisi (yalniz yerel veritabani, her calismada yeni bir deneme hesabi):
// uye ol -> Hesabim -> cikis -> yanlis sifre -> giris -> hesabi sil.
async function memberFlow(browser) {
  const ctx = await browser.newContext({ ...devices["iPhone 13"], locale: "tr-TR" });
  const m = await ctx.newPage();
  const crashes = [];
  m.on("pageerror", (e) => crashes.push(e.message));
  const email = `deneme-${Date.now()}@example.test`;
  const password = "Koko-" + Math.random().toString(36).slice(2, 10) + "-9";
  const step = async (name, fn) => {
    try { const [ok, detail] = await fn(); record(name, !!ok, detail || ""); return !!ok; }
    catch (e) { record(name, false, String((e && e.message) || e).slice(0, 200)); return false; }
  };
  const go = (url) => m.goto(BASE + url, { waitUntil: "networkidle", timeout: 90000 });
  const errorText = async () => ((await m.locator(".lk-form-error").first().textContent({ timeout: 15000 })) || "").trim();
  await step("Uyelik: kosullar onaylanmadan hesap acilmiyor", async () => {
    await go("/uye-ol?return_to=%2Ffiiller");
    await m.fill('input[name="name"]', "Deneme Öğrenci");
    await m.fill('input[name="email"]', email);
    await m.fill('input[name="password"]', password);
    await m.screenshot({ path: path.join(OUT, "20-telefon-uye-ol.png") });
    await m.click('button[type="submit"]');
    const text = await errorText();
    return [/akzeptieren|kabul/.test(text) && new URL(m.url()).pathname === "/uye-ol", text];
  });
  const joined = await step("Uyelik: uye olunca istenen sayfaya donuluyor (/fiiller)", async () => {
    await m.check('input[name="accept"]');
    await Promise.all([m.waitForURL((u) => new URL(u).pathname === "/fiiller", { timeout: 30000 }), m.click('button[type="submit"]')]);
    await m.waitForTimeout(1500);
    await m.screenshot({ path: path.join(OUT, "21-telefon-uye-olduktan-sonra.png") });
    return [(await m.locator("[data-verb-workshop]").count()) === 1, m.url()];
  });
  if (!joined) { await ctx.close(); return; }
  await step("Uyelik: oturum cerezi HttpOnly ve SameSite=Lax", async () => {
    const c = (await ctx.cookies()).find((x) => x.name === "lk_session");
    return [!!c && c.httpOnly && c.sameSite === "Lax", c ? `httpOnly ${c.httpOnly}, sameSite ${c.sameSite}` : "cerez yok"];
  });
  await step("Uyelik: uye kendi kayitlarini okuyabiliyor", async () => {
    const r = await m.request.get(BASE + "/api/study");
    return [r.status() === 200, `HTTP ${r.status()}`];
  });
  await step("Uyelik: Hesabim sayfasi ad ve e-postayi gosteriyor", async () => {
    await go("/hesabim");
    await m.screenshot({ path: path.join(OUT, "22-telefon-hesabim.png"), fullPage: true });
    const shown = ((await m.locator("[data-account-email]").textContent()) || "").trim();
    const name = ((await m.locator("[data-account-name]").textContent()) || "").trim();
    return [shown === email && name === "Deneme Öğrenci", `${name} · ${shown}`];
  });
  await step("Uyelik: cikis yapinca tanitim sayfasi ve kayitlar kapali", async () => {
    await Promise.all([m.waitForURL((u) => new URL(u).pathname === "/", { timeout: 30000 }), m.click("[data-account-logout]")]);
    await m.waitForLoadState("networkidle");
    const landing = await m.locator("[data-landing]").count();
    const r = await m.request.get(BASE + "/api/study");
    return [landing === 1 && r.status() === 401, `tanitim ${landing}, kayitlar HTTP ${r.status()}`];
  });
  await step("Uyelik: yanlis sifreyle giris olmuyor", async () => {
    await go("/giris?return_to=%2Fhesabim");
    await m.fill('input[name="email"]', email.toUpperCase());
    await m.fill('input[name="password"]', password + "x");
    await m.click('button[type="submit"]');
    const text = await errorText();
    await m.screenshot({ path: path.join(OUT, "23-telefon-giris-hatasi.png") });
    return [/falsch|yanlış/.test(text) && new URL(m.url()).pathname === "/giris", text];
  });
  await step("Uyelik: dogru sifreyle giris yapinca istenen sayfaya donuluyor", async () => {
    await m.fill('input[name="password"]', password);
    await Promise.all([m.waitForURL((u) => new URL(u).pathname === "/hesabim", { timeout: 30000 }), m.click('button[type="submit"]')]);
    await m.waitForLoadState("networkidle");
    return [(await m.locator("[data-account]").count()) === 1, m.url()];
  });
  await step("Uyelik: hesap silinince kayitlar gidiyor ve giris artik olmuyor", async () => {
    await m.locator(".lk-danger summary").click();
    await m.fill('[data-account-delete] input[name="current"]', password);
    await m.check('[data-account-delete] input[name="confirm"]');
    await m.screenshot({ path: path.join(OUT, "24-telefon-hesabi-sil.png"), fullPage: true });
    await Promise.all([m.waitForURL((u) => new URL(u).pathname === "/", { timeout: 30000 }), m.click('[data-account-delete] button[type="submit"]')]);
    const r = await m.request.post(BASE + "/api/auth", { headers: { origin: BASE, "content-type": "application/json" }, data: { action: "login", email, password } });
    return [r.status() === 401, `silindikten sonra giris HTTP ${r.status()}`];
  });
  record("Uyelik sayfalarinda betik hatasi yok", crashes.length === 0, crashes.slice(0, 2).join(" | "));
  await ctx.close();
}

// Site dili (ogrenci istedi): ana dil Almanca (telefonun dili ne olursa olsun); herkes uye olmadan site dilini
// degistirebilir, secilen dil cerezde kalir; yasal sayfalar da her dilde.
async function languageFlow(browser) {
  const ctx = await browser.newContext({ ...devices["iPhone 13"], locale: "tr-TR" });
  const page = await ctx.newPage();
  const info = () => page.evaluate(() => ({ lang: document.querySelector(".lk-public")?.getAttribute("lang"), dir: document.querySelector(".lk-public")?.getAttribute("dir"), h1: document.querySelector("h1")?.textContent?.trim(), note: !!document.querySelector("[data-legal-translation]") }));
  const choose = async (language) => {
    await Promise.all([page.waitForEvent("framenavigated"), page.selectOption("[data-public-language] select", language)]);
    await page.waitForLoadState("networkidle");
  };
  try {
    for (const [url, h1] of [["/", null], ["/giris", "Anmelden"], ["/uye-ol", "Kostenlos registrieren"]]) {
      await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 90000 });
      const shown = await info();
      record(`Dil: ${url} Turkce telefonda da Almanca aciliyor`, shown.lang === "de" && (!h1 || shown.h1 === h1), JSON.stringify(shown));
    }
    await page.screenshot({ path: path.join(OUT, "30-dil-uye-ol-almanca.png") });
    // Dil paketinden okunan bir dil (Rusca): sunucu paketi yukleyip sayfayi o dilde yaziyor (Ingilizceye dusmuyor).
    await choose("ru");
    const ru = await info();
    record("Dil: dil paketi olan bir dil (Rusca) sunucuda da dogru", ru.lang === "ru" && ru.h1 === "Зарегистрироваться бесплатно", JSON.stringify(ru));
    await choose("ar");
    const ar = await info();
    const cookie = (await ctx.cookies()).find((c) => c.name === "goligo-dil");
    await page.screenshot({ path: path.join(OUT, "31-dil-arapca-secildi.png") });
    record("Dil: uye olmadan Arapca secilebiliyor (sagdan sola, cerezde kaliyor)", ar.lang === "ar" && ar.dir === "rtl" && cookie?.value === "ar", `${JSON.stringify(ar)}, cerez ${cookie?.value}`);
    await page.goto(BASE + "/gizlilik", { waitUntil: "networkidle", timeout: 90000 });
    const privacy = await info();
    record("Dil: secilen dil gizlilik metninde de (ceviri notuyla)", privacy.lang === "ar" && privacy.note, JSON.stringify(privacy));
    await choose("tr");
    const tr = await info();
    await page.screenshot({ path: path.join(OUT, "32-dil-turkce-gizlilik.png") });
    record("Dil: Turkce asil metin, ceviri notu yok", tr.lang === "tr" && !tr.note, JSON.stringify(tr));
    // Sifremi unuttum (ogrenci istedi): giris sayfasindaki form; kayitli olmayan adres de ayni cevabi alir (e-posta gitmez).
    await page.goto(BASE + "/giris", { waitUntil: "networkidle", timeout: 90000 });
    await page.locator("[data-forgot] summary").click();
    await page.fill('[data-forgot-form] input[name="email"]', `kimse-yok-${Date.now()}@example.com`);
    await page.click('[data-forgot-form] button[type="submit"]');
    const sent = await page.locator("[data-forgot-sent]").textContent({ timeout: 15000 }).catch(() => "");
    await page.screenshot({ path: path.join(OUT, "33-sifremi-unuttum.png") });
    record("Sifremi unuttum: form calisiyor, cevap sayfanin dilinde", /bağlantı/.test(sent || ""), (sent || "").slice(0, 120));
    await page.goto(BASE + "/sifre-yenile?anahtar=bozuk", { waitUntil: "networkidle", timeout: 90000 });
    const dead = await page.locator("[data-reset-page] .lk-form-error").textContent().catch(() => "");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content").catch(() => "");
    record("Sifre yenileme: bozuk baglanti acikca soyleniyor, sayfa aramada cikmiyor", /geçersiz/.test(dead || "") && /noindex/.test(robots || ""), `${(dead || "").slice(0, 80)} · ${robots}`);
    // Uye olmadan tadimlik (ogrenci istedi): her bolumun ilk kismi acik, gerisi kilitli; hicbir sey kaydedilmez.
    await page.goto(BASE + "/fiiller", { waitUntil: "networkidle", timeout: 90000 });
    const verbs = { banner: await page.locator("[data-guest-banner]").count(), open: await page.locator("[data-verb-island-go]").count(), locked: await page.locator("[data-guest-locked]").count() };
    await page.locator("[data-verb-island-go]").first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT, "34-uyesiz-fiiller.png") });
    record("Uyesiz: Fiil Atolyesi'nin 1. bolumu acik, digerleri kilitli", verbs.banner === 1 && verbs.open === 1 && verbs.locked === 3, JSON.stringify(verbs));
    await page.goto(BASE + "/ev-esyalar", { waitUntil: "networkidle", timeout: 90000 });
    const vault = { banner: await page.locator("[data-guest-banner]").count(), open: await page.locator('[data-vault-category]:not(.guest-locked)').count() };
    record("Uyesiz: Nesne Kasasi'nda ilk grup acik", vault.banner === 1 && vault.open === 1, JSON.stringify(vault));
    const locked = await page.request.post(BASE + "/api/study", { headers: { origin: BASE, "content-type": "application/json" }, data: { action: "start", id: "smoke-guest-0000001", mode: "visual", topic: "objects-kitchen", count: 1, onlyIds: ["obj-picture-herd"] } });
    const snap = await (await page.request.get(BASE + "/api/study?stats=1&tz=0")).json().catch(() => ({}));
    record("Uyesiz: kilitli kisim acilmiyor, kayit tutulmuyor", locked.status() === 401 && snap.guest === true && (snap.sessions || []).length === 0, `baslat HTTP ${locked.status()}, guest ${snap.guest}`);
  } catch (e) { record("Dil kontrolu", false, String((e && e.message) || e).slice(0, 200)); }
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "tr-TR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  // A file that cannot be loaded is reported with its address. The natural voices (/voices) are added only when the
  // site is published, so here they are missing on purpose; 401 from the study API is expected before signing in.
  page.on("console", (m) => { if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push("console: " + m.text()); });
  page.on("response", (r) => { const u = r.url(); if (r.status() >= 400 && !u.includes("/voices/") && !(r.status() === 401 && u.includes("/api/"))) errors.push(`yuklenemedi ${r.status()}: ${u.replace(BASE, "")}`); });

  // Girissiz ziyaretci: tanitim sayfasini ve yasal sayfalari gorur; ders sayfalari giris sayfasina yonlenir.
  await visit(page, "/", "01-tanitim.png", errors);
  record("Girissiz ana sayfada tanitim ve uye ol dugmesi var",
    (await page.locator("[data-landing]").count()) === 1 && (await page.locator("[data-landing-register]").count()) === 1, "");
  for (const target of ["/ev-esyalar", "/fiiller", "/a1-2/ev-ve-yasam", "/hesabim"]) {
    await page.goto(BASE + target, { waitUntil: "networkidle", timeout: 90000 });
    const at = new URL(page.url());
    record(`Girissiz ${target} giris sayfasina yonleniyor`, at.pathname === "/giris" && at.searchParams.get("return_to") === target, page.url());
  }
  await visit(page, "/giris", "01b-giris.png", errors);
  await visit(page, "/uye-ol", "01c-uye-ol.png", errors);
  await visit(page, "/gizlilik", "01d-gizlilik.png", errors);
  await visit(page, "/kullanim-kosullari", "01e-kullanim-kosullari.png", errors);

  const anon = await page.request.get(BASE + "/api/study");
  record("Girissiz kayit istegi reddediliyor (401 beklenir)", anon.status() === 401, `HTTP ${anon.status()}`);
  const spoofed = await page.request.get(BASE + "/api/study", { headers: { "oai-authenticated-user-id": "local_seedy", "oai-authenticated-user-email": "seedy@sites.test" } });
  record("Sahte kimlik basligi ise yaramiyor (401 beklenir)", spoofed.status() === 401, `HTTP ${spoofed.status()}`);

  await memberFlow(browser);
  await languageFlow(browser);

  await page.goto(BASE + "/signin-with-chatgpt?return_to=%2Fev-esyalar", { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "04-yerel-giris-sonrasi.png") });
  record("Yerel giris taklidi", new URL(page.url()).pathname === "/ev-esyalar", `son adres ${page.url()}`);
  await visit(page, "/ev-esyalar", "02-nesne-kasasi.png", errors);
  await visit(page, "/a1-2/ev-ve-yasam", "03-ev-ve-yasam.png", errors);
  await visit(page, "/", "01-ana-sayfa.png", errors);
  record("Giris yapinca ana sayfada dersler var (tanitim yok)", (await page.locator("[data-landing]").count()) === 0, "");

  const headers = { origin: BASE, "content-type": "application/json" };
  const snap0 = await page.request.get(BASE + "/api/study");
  record("Giristen sonra kayitlar okunuyor", snap0.status() === 200, `HTTP ${snap0.status()}`);

  const sessionId = "kurulum-smoke-" + Date.now();
  const start = await page.request.post(BASE + "/api/study", {
    headers, data: { action: "start", id: sessionId, mode: "mixed", topic: "all", count: 1 },
  });
  const startBody = await start.json().catch(() => ({}));
  const first = startBody.session && startBody.session.questions && startBody.session.questions[0];
  record("Test oturumu basliyor (veritabanina yazma)", start.status() === 201 && !!first,
    `HTTP ${start.status()}, soru ${first ? first.id : "-"}`);

  if (first) {
    const answer = first.options ? first.options[0] : "test";
    const ans = await page.request.post(BASE + "/api/study", {
      headers, data: { action: "answer", sessionId, questionId: first.id, answer },
    });
    const ansBody = await ans.json().catch(() => ({}));
    record("Cevap kaydediliyor ve dogru cevap donuyor", ans.status() === 200 && !!ansBody.correctAnswer,
      `HTTP ${ans.status()}, dogru mu: ${ansBody.result ? ansBody.result.correct : "-"}`);

    const snap = await (await page.request.get(BASE + "/api/study")).json().catch(() => ({}));
    const s = (snap.sessions || []).find((x) => x.id === sessionId);
    record("Kayit geri okunuyor (gecmis)", !!s && Number(s.answered) === 1,
      s ? `cevaplanan ${s.answered}/${s.total}` : "oturum bulunamadi");
  }

  await visit(page, "/fiiller", "06-fiiller.png", errors);
  const workshopPanels = await page.locator("[data-verb-workshop]").count();
  const islands = await page.locator("[data-verb-island]").count();
  record("Fiil Atolyesi sayfasinda baslik ve dort bolum var", workshopPanels === 1 && islands === 4, `atolye ${workshopPanels}, bolum ${islands}`);

  const phone = await browser.newContext({ ...devices["iPhone 13"], locale: "tr-TR" });
  const p2 = await phone.newPage();
  await p2.goto(BASE + "/", { waitUntil: "networkidle", timeout: 90000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: path.join(OUT, "05-telefon-tanitim.png") });
  await p2.screenshot({ path: path.join(OUT, "05b-telefon-tanitim-tamami.png"), fullPage: true });
  const overflow = await p2.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  record("Telefonda tanitim sayfasi yana tasmiyor", overflow <= 1, `fazla genislik ${overflow}px`);
  await p2.goto(BASE + "/fiiller", { waitUntil: "networkidle", timeout: 90000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: path.join(OUT, "07-telefon-giris-sayfasi.png"), fullPage: true });

  // Telefonda Fiil Atolyesi: giris yap, yolu baslat, her adimin fotografini cek ve kartin
  // tek ekrana sigip sigmadigini olc (asagi kaydirmadan). Bilgi amaclidir; yayini durdurmaz.
  const info = (name, ok, detail) => console.log(`${ok ? "BILGI " : "UYARI "} ${name}${detail ? " — " + detail : ""}`);
  try {
    // Calinan sesleri kaydet (dogal ses dosyasi ya da cihaz sesi): yeni fiilin karti acilinca fiil okunuyor mu?
    await p2.addInitScript(() => {
      window.__played = [];
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () { window.__played.push(this.currentSrc || this.src || ""); return play.apply(this, arguments); };
      try { if (window.speechSynthesis) { const speak = window.speechSynthesis.speak.bind(window.speechSynthesis); window.speechSynthesis.speak = (u) => { if (u && u.text) window.__played.push("tts:" + u.text); return speak(u); }; } } catch (e) {}
    });
    const played = () => p2.evaluate(() => (window.__played || []).filter((x) => x && !x.startsWith("data:")));
    await p2.goto(BASE + "/signin-with-chatgpt?return_to=%2Ffiiller", { waitUntil: "networkidle", timeout: 90000 });
    await p2.waitForTimeout(1500);
    // Yol kartı kaldırıldı (öğrenci istedi): ilk bölümü açıp "Başla" düğmesine basılır.
    await p2.locator("[data-verb-island-go]").first().click();
    await p2.locator("[data-verb-part-start]").first().click();
    await p2.waitForSelector("#verb-chapter-heading, #verb-learn-heading, #object-question-heading", { timeout: 20000 });
    const shot = async (file) => {
      await p2.waitForTimeout(700);
      await p2.screenshot({ path: path.join(OUT, file) });
      return p2.evaluate(() => {
        const card = document.querySelector(".verb-practice article");
        const r = card && card.getBoundingClientRect();
        return r ? { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight } : null;
      });
    };
    const fit = (label, m) => info(`Telefon: ${label} tek ekrana sigiyor`, !!m && m.top >= 0 && m.bottom <= m.vh, m ? `ust ${m.top}, alt ${m.bottom}, ekran ${m.vh}` : "kart yok");
    let heardBefore = 0;
    if (await p2.locator("#verb-chapter-heading").count()) {
      await shot("08-telefon-bolum.png");
      heardBefore = (await played()).length;
      await p2.locator(".verb-chapter .verb-learn-next").click();
    }
    fit("ogrenme karti (resim, anlam, cekim)", await shot("09-telefon-kart.png"));
    await p2.waitForTimeout(1500);
    const heard = (await played()).slice(heardBefore);
    info("Telefon: yeni fiilin karti acilinca fiil kendiliginden okunuyor", heard.length > 0, heard.slice(0, 3).join(" | ").slice(0, 160) || "ses yok");
    await p2.locator(".verb-learn .verb-learn-next").click();
    fit("test sorusu", await shot("10-telefon-soru.png"));
    await p2.locator(".verb-options .object-option").first().click();
    await p2.waitForSelector(".verb-result", { timeout: 20000 });
    fit("test sonucu ve ornek cumleler", await shot("11-telefon-sonuc.png"));
    await p2.locator(".verb-result-next").click();
    await p2.waitForSelector(".letter-puzzle", { timeout: 20000 });
    fit("yazim", await shot("12-telefon-yazim.png"));
    // Harfleri dogru sirayla koy, hicbir dugmeye basma: kutular dolunca kendisi kontrol etmeli.
    const word = ((await p2.locator(".verb-stepper-verb").first().textContent()) || "").trim();
    const boxes = await p2.locator(".puzzle-board [data-puzzle-index]").evaluateAll((list) => list.map((b) => Number(b.getAttribute("data-puzzle-index"))));
    for (const i of boxes) {
      await p2.locator(`.letter-tile[data-letter="${word[i]}"]`).first().click();
      await p2.waitForTimeout(150);
    }
    const auto = await p2.waitForSelector(".verb-write-feedback", { timeout: 8000 }).then(() => true).catch(() => false);
    info("Telefon: yazim dolunca dugmeye basmadan kontrol ediliyor", auto, `${word} · ${boxes.length} kutu`);
    await shot("15-telefon-yazim-sonuc.png");
    // Yazimdan sonra ayni fiilin gecmis hali sorusu: siklarda hat/ist yok.
    await p2.locator(".verb-write-feedback .object-next").click();
    await p2.waitForSelector(".verb-options .object-option", { timeout: 20000 });
    await shot("16-telefon-gecmis-hali.png");
    const pastOptions = await p2.locator(".verb-options .object-option .picture-option-word").allTextContents();
    const heading = ((await p2.locator("#object-question-heading").first().textContent()) || "").trim();
    info("Telefon: yazimdan sonra gecmis hali sorusu (hat/ist yok)", /Partizip/.test(heading) && pastOptions.length === 4 && pastOptions.every((o) => !/\s/.test(o.trim())), `${heading} · ${pastOptions.join(", ")}`);
    // Gecmis hali testinden sonra ayni fiilin gecmis halini harflerle yazma: hat/ist olmadan, yalniz Partizip II.
    const right = p2.locator(".verb-options .object-option", { hasText: /^[A-D]?\s*abgefahren\s*$/ });
    await ((await right.count()) ? right.first() : p2.locator(".verb-options .object-option").first()).click();
    await p2.waitForSelector(".verb-result", { timeout: 20000 });
    await p2.locator(".verb-result-next").click();
    await p2.waitForSelector(".letter-puzzle", { timeout: 20000 });
    await shot("17-telefon-gecmis-yazim.png");
    const writeHeading = ((await p2.locator("#object-question-heading").first().textContent()) || "").trim();
    const writeStep = ((await p2.locator(".verb-stepper-steps .current").first().textContent()) || "").trim();
    info("Telefon: gecmis hali testinden sonra gecmis hali yazimi", /Partizip/.test(writeHeading) && (await p2.locator(".puzzle-board").count()) === 1, `${writeHeading} · adim: ${writeStep}`);
    // Bolume tiklayinca fiil listesi, fiile tiklayinca fiil karti (anlamli ornek cumlelerle). Bilgi amaclidir.
    await p2.goto(BASE + "/fiiller", { waitUntil: "networkidle", timeout: 90000 });
    await p2.waitForTimeout(1200);
    await p2.locator("[data-verb-island-go]").first().click();
    await p2.waitForSelector("#verb-part-heading", { timeout: 20000 });
    await p2.waitForTimeout(700);
    await p2.screenshot({ path: path.join(OUT, "13-telefon-bolum-listesi.png"), fullPage: true });
    const listed = await p2.locator("[data-verb-open]").count();
    info("Telefon: bolum listesinde fiiller gorunuyor", listed === 19, `${listed} fiil`);
    await p2.locator("[data-verb-open]").first().click();
    await p2.waitForSelector("#verb-detail-heading", { timeout: 20000 });
    await p2.waitForTimeout(1500);
    await p2.screenshot({ path: path.join(OUT, "14-telefon-fiil-karti.png"), fullPage: true });
    const meanings = await p2.locator(".verb-person-meaning").count();
    // Ornek cumlelerin anlami site dilinde yazilir; site dili Almanca (varsayilan) iken anlam satiri olmaz.
    const pageLang = await p2.evaluate(() => document.documentElement.lang);
    info("Telefon: fiil kartinda ornek cumlelerin anlami site dilinde", pageLang === "de" ? meanings === 0 : meanings === 9, `site dili ${pageLang}, ${meanings} anlam satiri`);
    // Yanlislarim: ana sayfanin sol menusunden acilir (/fiiller?bolum=yanlislar); yanlis varsa ayri bir turda calisilir.
    await p2.goto(BASE + "/fiiller?bolum=yanlislar", { waitUntil: "networkidle", timeout: 90000 });
    await p2.waitForSelector("[data-verb-mistakes]", { timeout: 20000 });
    const open = Number(await p2.locator("[data-verb-mistakes]").first().getAttribute("data-verb-mistakes"));
    await p2.locator("[data-verb-mistakes]").first().scrollIntoViewIfNeeded();
    await p2.waitForTimeout(500);
    await p2.screenshot({ path: path.join(OUT, "18-telefon-yanlislarim.png") });
    let round = "yanlis yok";
    if (open > 0) {
      await p2.locator("[data-verb-mistakes-start]").click();
      await p2.waitForSelector("#object-question-heading", { timeout: 20000 });
      await p2.waitForTimeout(700);
      await p2.screenshot({ path: path.join(OUT, "19-telefon-yanlis-turu.png") });
      round = ((await p2.locator(".object-practice-top").first().textContent()) || "").replace(/\s+/g, " ").trim();
    }
    info("Telefon: Yanlislarim bolumu var ve calisiliyor", true, `${open} yanlis · ${round}`);
  } catch (e) {
    info("Telefon: atolye adimlari", false, String(e && e.message || e).slice(0, 200));
  }

  // Oyunlar (ogrenci istedi): yedi oyun var; her biri telefonda aciliyor, ilk cevap aliniyor, betik hatasi yok.
  try {
    const gameErrors = [];
    p2.on("pageerror", (e) => gameErrors.push(e.message));
    const opened = [];
    for (const id of ["rain", "catch", "quick", "search", "rescue", "plural"]) {
      await p2.goto(BASE + "/fiiller?bolum=oyunlar", { waitUntil: "networkidle", timeout: 90000 });
      if (!opened.length) record("Oyunlar: yedi oyun listeleniyor", (await p2.locator("[data-verb-game-card]").count()) === 7, `${await p2.locator("[data-verb-game-card]").count()} oyun`);
      await p2.locator(`[data-verb-game-card="${id}"]`).click();
      if (await p2.locator("[data-game-start]").count()) await p2.locator("[data-game-start]").click();
      await p2.waitForTimeout(700);
      if (id === "plural") {
        // Eslestirme (ogrenci istedi): ilk 5 saniye butun kartlar acik, sonra kapaniyor; "Hemen basla" hemen kapatiyor.
        const all = await p2.locator(".plural-card").count();
        const shownFirst = await p2.locator(".plural-card.shown").count();
        const banner = await p2.locator("[data-match-preview]").count();
        await p2.locator("[data-match-preview-skip]").click();
        await p2.waitForTimeout(300);
        const shownAfter = await p2.locator(".plural-card.shown").count();
        record("Eslestirme: kartlar once acik, sonra kapaniyor", all > 0 && shownFirst === all && banner === 1 && shownAfter === 0, `${shownFirst}/${all} acik → ${shownAfter}`);
      }
      const answer = { rain: "[data-rain-article]", catch: "[data-catch-option]", quick: "[data-quick-answer]", search: "[data-search-cell]", rescue: "[data-rescue-key]", plural: ".plural-card" }[id];
      await p2.locator(answer).first().click();
      await p2.waitForTimeout(900);
      await p2.screenshot({ path: path.join(OUT, `40-oyun-${id}.png`) });
      opened.push(id + ((await p2.locator(`[data-game="${id}"]`).count()) ? "" : "?"));
    }
    record("Oyunlar: her oyun telefonda aciliyor ve cevap aliyor", !opened.some((id) => id.endsWith("?")) && gameErrors.length === 0, `${opened.join(", ")}${gameErrors.length ? " · hata: " + gameErrors.slice(0, 2).join(" | ") : ""}`);
  } catch (e) {
    record("Oyunlar kontrolu", false, String((e && e.message) || e).slice(0, 200));
  }

  await browser.close();
  fs.writeFileSync(path.join(path.dirname(OUT), "smoke-results.json"), JSON.stringify(results, null, 2));
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("Duman testi calisamadi:", e);
  process.exit(1);
});
