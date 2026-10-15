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
  const karmaPanels = await page.locator("[data-verb-karma]").count();
  record("Fiil Atolyesi sayfasinda yol ve karma sinav paneli var", workshopPanels === 1 && karmaPanels === 1, `yol ${workshopPanels}, karma ${karmaPanels}`);

  const phone = await browser.newContext({ ...devices["iPhone 13"], locale: "tr-TR" });
  const p2 = await phone.newPage();
  await p2.goto(BASE + "/", { waitUntil: "networkidle", timeout: 90000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: path.join(OUT, "05-telefon-ana-sayfa.png") });
  record("Telefon gorunumu acildi", true, "");
  await p2.goto(BASE + "/fiiller", { waitUntil: "networkidle", timeout: 90000 });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: path.join(OUT, "07-telefon-fiiller.png"), fullPage: true });

  await browser.close();
  fs.writeFileSync(path.join(path.dirname(OUT), "smoke-results.json"), JSON.stringify(results, null, 2));
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("Duman testi calisamadi:", e);
  process.exit(1);
});
