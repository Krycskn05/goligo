#!/usr/bin/env bash
# Site seslerini (doğal Almanca sesler) üretir ve "sesler" dalına yazar.
# GitHub Actions'ta "Ses dosyalari" iş akışı çalıştırır. Yalnızca eksik sesler
# üretilir; yeni ses eklenince yayın iş akışı yeniden başlatılır.
# Sonuç ve günlük her zaman "sesler-sonuclari" dalına yazılır.
set -uo pipefail
ROOT="$PWD"
WORK="$ROOT/.voices"
LOGS="$ROOT/.voices-log"
rm -rf "$WORK" "$LOGS" && mkdir -p "$WORK" "$LOGS"
STATUS=0

publish_log() {
  [ -n "${GH_TOKEN:-}" ] && [ -n "${REPO:-}" ] || return 0
  cp "$WORK/report.json" "$LOGS/" 2>/dev/null || true
  echo "durum=$1 calisma=${GITHUB_RUN_ID:-yerel} commit=${GITHUB_SHA:-?} tarih=$(date -u '+%F %H:%M')" > "$LOGS/DURUM.txt"
  (cd "$LOGS" && git init -q -b sesler-sonuclari && git config user.name "github-actions[bot]" \
    && git config user.email "41898282+github-actions[bot]@users.noreply.github.com" \
    && git add -A && git commit -qm "Ses sonucu ${GITHUB_RUN_ID:-}" \
    && git push -q -f "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" sesler-sonuclari) || true
}

{
  echo "::group::Kurulum"
  corepack enable && corepack prepare pnpm@11.25.0 --activate &&
  pnpm install --frozen-lockfile || STATUS=1
  rm -rf .check
  pnpm exec tsc lib/*.ts --outDir .check/lib --rootDir lib \
    --module commonjs --moduleResolution node --target es2022 \
    --esModuleInterop --resolveJsonModule --skipLibCheck \
    --types node --lib es2023,dom,dom.iterable --noEmitOnError false >/dev/null || true
  echo '{"type":"commonjs"}' > .check/lib/package.json
  echo "::endgroup::"
} 2>&1 | tee "$LOGS/01-kurulum.log"

STUDY_CHECK_DIR="$ROOT/.check/lib" node scripts/voices/list-texts.cjs > "$ROOT/.voice-texts.json" || { publish_log "HATA-metinler"; exit 1; }
echo "Seslendirilecek metin: $(node -p "require('$ROOT/.voice-texts.json').length")" | tee "$LOGS/02-metinler.log"

BRANCH_EXISTS=0
if git fetch -q --depth 1 origin sesler 2>/dev/null; then
  BRANCH_EXISTS=1
  git archive FETCH_HEAD | tar -x -C "$WORK"
  echo "Önceki ses dosyaları: $(find "$WORK" -name '*.mp3' | wc -l)" | tee -a "$LOGS/02-metinler.log"
fi

echo "::group::Python paketleri"
{ python -m pip install -q --upgrade pip && python -m pip install -q "supertonic>=1.2.1" lameenc soundfile numpy faster-whisper; } 2>&1 | tail -n 40 > "$LOGS/03-pip.log"
echo "::endgroup::"

python scripts/voices/make-voices.py "$ROOT/.voice-texts.json" "$WORK" 2>&1 | tee "$LOGS/04-uretim.log"
if [ "${PIPESTATUS[0]}" -ne 0 ]; then publish_log "HATA-uretim"; exit 1; fi

CHANGED="$(cat "$WORK/.changed" 2>/dev/null || echo 0)"
rm -f "$WORK/.changed"
if [ "$CHANGED" != "0" ] || [ "$BRANCH_EXISTS" = "0" ]; then
  (cd "$WORK" && git init -q -b sesler && git config user.name "github-actions[bot]" \
    && git config user.email "41898282+github-actions[bot]@users.noreply.github.com" \
    && git add -A && git commit -qm "Site sesleri ${GITHUB_RUN_ID:-}" \
    && git push -q -f "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" sesler) || { publish_log "HATA-gonderim"; exit 1; }
  echo "Sesler güncellendi ($CHANGED değişiklik); yayın başlatılıyor." | tee -a "$LOGS/04-uretim.log"
  gh workflow run yayin.yml --ref main -R "$REPO" 2>&1 | tee -a "$LOGS/04-uretim.log" || true
  publish_log "basarili-guncellendi"
else
  echo "Yeni ses yok; dal değişmedi." | tee -a "$LOGS/04-uretim.log"
  publish_log "basarili-degisiklik-yok"
fi
exit "$STATUS"
