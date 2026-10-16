// LernKoko duman testi: yerel geliştirme sunucusunu (http://localhost:5173)
// gerçek bir tarayıcıyla açar, ekran görüntüsü alır ve kayıt API'sini
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

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "tr-TR" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await visit(page, "/", "01-ana-sayfa.png", errors);
  await visit(page, "/ev-esyalar", "02-nesne-kasasi.png", errors);
  await visit(page, "/a1-2/ev-ve-yasam", "03-ev-ve-yasam.png", errors);

  const anon = await page.request.get(BASE + "/api/study");
  record("Girissiz kayit istegi reddediliyor (401 beklenir)", anon.status() === 401, `HTTP ${anon.status()}`);

  await page.goto(BASE + "/signin-with-chatgpt?return_to=%2Fev-esyalar", { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "04-yerel-giris-sonrasi.png") });
  record("Yerel giris taklidi", new URL(page.url()).pathname === "/ev-esyalar", `son adres ${page.url()}`);

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
  record("Fiil Atolyesi sayfasinda yol paneli ve iki bolum var", workshopPanels === 1 && islands === 2, `yol ${workshopPanels}, bolum ${islands}`);

  const phone = await browser.newContext({ ...devices["iPhone 13"], locale: "tr-TR" });
  const p2 = await phone.newPage();
  await p2.goto(BASE + "/", { waitUntil: "networkidle", timeout: 90000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: path.join(OUT, "05-telefon-ana-sayfa.png") });
  record("Telefon gorunumu acildi", true, "");
  await p2.goto(BASE + "/fiiller", { waitUntil: "networkidle", timeout: 90000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: path.join(OUT, "07-telefon-fiiller.png"), fullPage: true });

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
    await p2.locator(".verb-path-enter").first().click();
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
    info("Telefon: fiil kartinda ornek cumlelerin anlami var", meanings === 9, `${meanings} anlam satiri`);
    // Yanlislarim: atolye sayfasinda yanlislar bolumu; yanlis varsa ayri bir turda calisilir.
    await p2.goto(BASE + "/fiiller", { waitUntil: "networkidle", timeout: 90000 });
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

  await browser.close();
  fs.writeFileSync(path.join(path.dirname(OUT), "smoke-results.json"), JSON.stringify(results, null, 2));
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("Duman testi calisamadi:", e);
  process.exit(1);
});
