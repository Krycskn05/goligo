#!/usr/bin/env bash
# LernKoko'yu Koray'ın KENDİ Cloudflare hesabına yayınlar (GitHub Actions'ta çalışır).
# ChatGPT Sites projesine hiçbir şey göndermez, ona dokunmaz.
#
# CLOUDFLARE_API_TOKEN yoksa yalnızca DENEME yapar: paket hazırlanır, yayın yapılmaz.
# Varsa: D1 veritabanını bulur/oluşturur, şemayı (yalnızca ilk kez) uygular,
# Worker'ı yayınlar ve adresi kontrol eder. Sonuçlar "yayin-sonuclari" dalına yazılır.
set -u
OUT="$PWD/.yayin-out"
mkdir -p "$OUT"
: > "$OUT/DURUM.txt"
HATA=0
export WRANGLER_SEND_METRICS=false CLOUDFLARE_CF_FETCH_ENABLED=false
WORKER=$(node -p "require('./yayin.json').workerName")
DBNAME=$(node -p "require('./yayin.json').d1DatabaseName")
DRY=0
[ -z "${CLOUDFLARE_API_TOKEN:-}" ] && DRY=1

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
wr() { pnpm exec wrangler "$@"; }
d1_id() { # D1 listesinden adı eşleşen veritabanının kimliği
  wr d1 list --json 2>/dev/null | node -e '
    let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      const start=s.indexOf("[");const list=start>=0?JSON.parse(s.slice(start)):[];
      const db=list.find(x=>x.name===process.argv[1]);process.stdout.write(db?(db.uuid||db.id||""):"");});' "$DBNAME"
}

s_pnpm()    { node -v && corepack enable && corepack prepare pnpm@11.25.0 --activate && pnpm --version; }
s_install() { pnpm install --frozen-lockfile; }
s_hesap()   { wr whoami; }
s_d1() {
  local id
  id=$(d1_id)
  if [ -z "$id" ]; then
    echo "'$DBNAME' veritabanı yok, oluşturuluyor..."
    wr d1 create "$DBNAME" || return 1
    id=$(d1_id)
  fi
  [ -n "$id" ] || { echo "D1 kimliği bulunamadı"; return 1; }
  echo "D1 veritabanı: $DBNAME ($id)"
  echo "$id" > "$OUT/d1-id.txt"
}
s_build() {
  LERNKOKO_D1_ID="$(cat "$OUT/d1-id.txt" 2>/dev/null || true)" pnpm run build || return 1
  echo "--- dist/server/wrangler.json (özet) ---"
  node -e '
    const c=require("./dist/server/wrangler.json");
    console.log(JSON.stringify({name:c.name,main:c.main,compatibility_date:c.compatibility_date,
      compatibility_flags:c.compatibility_flags,d1_databases:c.d1_databases,vars:c.vars,
      assets:c.assets,workers_dev:c.workers_dev,routes:c.routes},null,1));'
}
s_deneme() { wr deploy --dry-run --config dist/server/wrangler.json --outdir /tmp/yayin-deneme; }
s_sema() {
  local out
  out=$(wr d1 execute "$DBNAME" --remote --json \
    --command "SELECT name FROM sqlite_master WHERE type='table' AND name='study_sessions'") || { echo "$out"; return 1; }
  if printf '%s' "$out" | grep -q '"study_sessions"'; then
    echo "Şema zaten var, dokunulmadı."
  else
    echo "Şema ilk kez uygulanıyor (migration/database/schema.sql)..."
    wr d1 execute "$DBNAME" --remote --file migration/database/schema.sql || return 1
  fi
}
s_yayin() { wr deploy --config dist/server/wrangler.json; }
s_kontrol() {
  local url
  url=$(grep -o 'https://[a-zA-Z0-9.-]*\.workers\.dev' "$OUT/07-deploy.log" | head -n 1)
  [ -n "$url" ] || { echo "Yayın adresi bulunamadı"; return 1; }
  echo "$url" > "$OUT/ADRES.txt"
  echo "Adres: $url"
  sleep 10
  for path in / /api/study /ev-esyalar; do
    curl -s -o /dev/null -w "$path -> HTTP %{http_code} %{redirect_url}\n" "$url$path"
  done
}

adim "1-pnpm" 01-pnpm.log s_pnpm
adim "2-kurulum" 02-install.log s_install
if [ "$DRY" -eq 1 ]; then
  echo "mod=DENEME (CLOUDFLARE_API_TOKEN yok; yayin yapilmadi)" >> "$OUT/DURUM.txt"
  adim "3-derleme" 03-build.log s_build && adim "4-deneme-paketi" 04-dry-run.log s_deneme
else
  echo "mod=YAYIN (worker: $WORKER, d1: $DBNAME)" >> "$OUT/DURUM.txt"
  adim "3-hesap" 03-account.log s_hesap \
    && adim "4-d1" 04-d1.log s_d1 \
    && adim "5-derleme" 05-build.log s_build \
    && adim "6-sema" 06-schema.log s_sema \
    && adim "7-yayin" 07-deploy.log s_yayin \
    && adim "8-kontrol" 08-check.log s_kontrol
fi

cd "$OUT"
{
  echo "# Yayın sonucu"
  echo
  echo "- Calisma: ${GITHUB_RUN_ID:-yerel} / commit ${GITHUB_SHA:-?}"
  echo "- Tarih (UTC): $(date -u '+%Y-%m-%d %H:%M')"
  echo
  echo '```'; cat DURUM.txt; echo '```'
  for f in *.log; do echo "## $f"; echo '```'; tail -n 80 "$f"; echo '```'; done
} > SONUC.md
if [ -n "${GH_TOKEN:-}" ] && [ -n "${REPO:-}" ]; then
  git init -q -b yayin-sonuclari .
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
  git add -A && git commit -qm "Yayın sonucu ${GITHUB_RUN_ID:-}"
  git push -q -f "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" yayin-sonuclari
fi
cat DURUM.txt
exit "$HATA"
