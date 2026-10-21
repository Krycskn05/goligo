#!/usr/bin/env bash
# Goliqo kurulum kontrolü — GitHub Actions'ta çalışır.
# 01-BASLA-BURADAN.md içindeki yerel kurulum adımlarını sırayla dener:
# pnpm 11.25.0, kilit dosyasıyla kurulum, derleme, TypeScript, testler,
# yalnızca YEREL veritabanı şeması ve sitenin tarayıcıda açılması.
# Hiçbir yere yayın (deploy) yapmaz; ChatGPT Sites projesine dokunmaz.
# Sonuçlar "kurulum-sonuclari" dalına kaydedilir.
set -u
OUT="$PWD/.ci-out"
mkdir -p "$OUT/screens"
: > "$OUT/DURUM.txt"
HATA=0

adim() { # adim <ad> <log-dosyasi> <fonksiyon>
  local ad="$1" log="$2" fn="$3"
  echo "::group::$ad"
  "$fn" 2>&1 | tee "$OUT/$log"
  local rc=${PIPESTATUS[0]}
  echo "::endgroup::"
  if [ "$rc" -eq 0 ]; then echo "$ad=basarili" >> "$OUT/DURUM.txt"
  else echo "$ad=HATA($rc)" >> "$OUT/DURUM.txt"; HATA=1; fi
  return "$rc"
}

s_pnpm()    { node -v && corepack enable && corepack prepare pnpm@11.25.0 --activate && pnpm --version; }
s_install() { pnpm install --frozen-lockfile; }
s_build()   { pnpm run build; }
s_ts()      { pnpm exec tsc --noEmit -p tsconfig.json; }
s_tests() {
  rm -rf .check
  # Testler lib/ klasörünün CommonJS derlemesini ister (STUDY_CHECK_DIR).
  pnpm exec tsc lib/*.ts --outDir .check/lib --rootDir lib \
    --module commonjs --moduleResolution node --target es2022 \
    --esModuleInterop --resolveJsonModule --skipLibCheck \
    --types node --lib es2023,dom,dom.iterable --noEmitOnError false || true
  # Proje "type": "module" olduğu için derlenen klasörü CommonJS olarak işaretle.
  echo '{"type":"commonjs"}' > .check/lib/package.json
  echo "Derlenen dosya sayisi: $(ls .check/lib 2>/dev/null | wc -l)"
  STUDY_CHECK_DIR="$PWD/.check/lib" node --test --test-reporter=spec tests/*.test.*
}
s_db() {
  local f
  for f in migration/database/schema.sql migration/database/members.sql; do
    echo "Yerel veritabanı: $f"
    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js \
      d1 execute DB --local --config dist/server/wrangler.json \
      --persist-to .wrangler/state --file "$f" || return 1
  done
}
s_site() {
  (pnpm run dev > "$OUT/07-dev-server.log" 2>&1 &)
  local ok=0
  for i in $(seq 1 90); do
    if curl -fsS -o /dev/null http://localhost:5173/; then echo "Site ${i}. denemede acildi"; ok=1; break; fi
    sleep 2
  done
  [ "$ok" -eq 1 ] || { echo "Site 3 dakikada acilmadi"; tail -n 80 "$OUT/07-dev-server.log"; return 1; }
  # Playwright'ın indirilmesi bazen ağ yüzünden takılıyor: 3 kez dener (bir kez "Playwright kurulamadi" yayını durdurmuştu).
  local pw=0
  for i in 1 2 3; do
    if (mkdir -p /tmp/pw && cd /tmp/pw && { [ -f package.json ] || npm init -y >/dev/null; } \
      && npm i --no-audit --no-fund playwright@1.55.1 >/dev/null \
      && npx playwright install --with-deps chromium >/dev/null 2>&1); then pw=1; break; fi
    echo "Playwright kurulumu ${i}. denemede olmadi, yeniden deneniyor"; sleep 15
  done
  [ "$pw" -eq 1 ] || { echo "Playwright kurulamadi"; return 1; }
  LOGS="$OUT" NODE_PATH=/tmp/pw/node_modules node ci/smoke.cjs
}

s_sesler_kontrol() { # Okunan her metnin doğal sesi var mı? Eksik varsa "Ses dosyalari" iş akışını başlatır.
  [ -d .check/lib ] || { echo "Derlenmiş lib yok; atlandı."; return 0; }
  STUDY_CHECK_DIR="$PWD/.check/lib" node scripts/voices/list-texts.cjs > "$OUT/voice-texts.json" || { echo "Metin listesi alınamadı."; return 0; }
  : > "$OUT/voice-files.txt"; echo '{}' > "$OUT/voice-manifest.json"
  if git fetch -q --depth 1 --filter=blob:none origin sesler 2>/dev/null; then
    git ls-tree -r --name-only FETCH_HEAD > "$OUT/voice-files.txt"
    git show FETCH_HEAD:manifest.json > "$OUT/voice-manifest.json" 2>/dev/null || echo '{}' > "$OUT/voice-manifest.json"
  fi
  local eksik
  eksik="$(VOICE_MISSING_LIST=1 node scripts/voices/missing.cjs "$OUT/voice-texts.json" "$OUT/voice-manifest.json" "$OUT/voice-files.txt")" || eksik=0
  echo "Doğal sesi eksik metin: $eksik"
  if [ "$eksik" != "0" ] && [ -n "${GH_TOKEN:-}" ] && [ -n "${REPO:-}" ]; then
    gh workflow run sesler.yml --ref main -R "$REPO" && echo "Ses iş akışı başlatıldı (eksik sesler üretilecek)."
  fi
  rm -f "$OUT/voice-files.txt" "$OUT/voice-manifest.json" "$OUT/voice-texts.json"
  return 0
}

adim "1-pnpm"       01-pnpm.log       s_pnpm
adim "2-kurulum"    02-install.log    s_install && KURULDU=1 || KURULDU=0
adim "3-derleme"    03-build.log      s_build   && DERLENDI=1 || DERLENDI=0
adim "4-typescript" 04-typescript.log s_ts
adim "5-testler"    05-tests.log      s_tests
adim "5-sesler"     05-voices.log     s_sesler_kontrol
if [ "$DERLENDI" -eq 1 ]; then adim "6-veritabani" 06-db.log s_db; else echo "6-veritabani=atlandi(derleme yok)" >> "$OUT/DURUM.txt"; fi
if [ "$KURULDU" -eq 1 ]; then adim "7-site" 08-smoke.log s_site; else echo "7-site=atlandi(kurulum yok)" >> "$OUT/DURUM.txt"; fi

# Sonuçları ayrı bir dala kaydet (Claude buradan okur).
cd "$OUT"
{
  echo "# Kurulum sonucu"
  echo
  echo "- Calisma: ${GITHUB_RUN_ID:-yerel} / commit ${GITHUB_SHA:-?}"
  echo "- Tarih (UTC): $(date -u '+%Y-%m-%d %H:%M')"
  echo
  echo '```'; cat DURUM.txt; echo '```'
  for f in *.log; do echo "## $f"; echo '```'; tail -n 80 "$f"; echo '```'; done
} > SONUC.md
if [ -n "${GH_TOKEN:-}" ] && [ -n "${REPO:-}" ]; then
  git init -q -b kurulum-sonuclari .
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
  git add -A && git commit -qm "Kurulum sonucu ${GITHUB_RUN_ID:-}"
  git push -q -f "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" kurulum-sonuclari
fi
cat DURUM.txt
exit "$HATA"
