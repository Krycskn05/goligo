#!/usr/bin/env bash
# Goliqo'yu Koray'ın KENDİ Cloudflare hesabına yayınlar (GitHub Actions'ta çalışır).
# ChatGPT Sites projesine hiçbir şey göndermez, ona dokunmaz.
#
# CLOUDFLARE_API_TOKEN yoksa yalnızca DENEME yapar: paket hazırlanır, yayın yapılmaz.
# Varsa: D1 veritabanını bulur/oluşturur, şemayı (yalnızca ilk kez) uygular,
# üyelik tablolarını (her seferinde, var olanlara dokunmadan) kurar,
# Worker'ı yayınlar ve adresi kontrol eder. Sonuçlar "yayin-sonuclari" dalına yazılır.
set -u
OUT="$PWD/.yayin-out"
mkdir -p "$OUT"
: > "$OUT/DURUM.txt"
HATA=0
export WRANGLER_SEND_METRICS=false CLOUDFLARE_CF_FETCH_ENABLED=false
WORKER=$(node -p "require('./yayin.json').workerName")
DOMAIN=$(node -p "require('./yayin.json').siteDomain||''")
DBNAME=$(node -p "require('./yayin.json').d1DatabaseName")
# Anahtarı temizle: baştaki/sondaki boşluk ve satır sonları; yanlışlıkla
# Cloudflare'in "curl ... Authorization: Bearer <anahtar>" deneme metni
# kopyalandıysa içindeki anahtar alınır. Anahtar hiçbir yere yazdırılmaz.
TOKEN_NOTE="olduğu gibi"
TOKEN_RAW="${CLOUDFLARE_API_TOKEN:-}"
if [[ "$TOKEN_RAW" =~ Bearer[[:space:]]+([A-Za-z0-9._-]+) ]]; then
  TOKEN_RAW="${BASH_REMATCH[1]}"; TOKEN_NOTE="curl metninden ayıklandı"
fi
TOKEN_CLEAN=$(printf '%s' "$TOKEN_RAW" | tr -d '[:space:]')
if [ -n "$TOKEN_CLEAN" ]; then
  [ "$TOKEN_CLEAN" != "${CLOUDFLARE_API_TOKEN:-}" ] && [ "$TOKEN_NOTE" = "olduğu gibi" ] && TOKEN_NOTE="boşluklar temizlendi"
  echo "::add-mask::$TOKEN_CLEAN"
  export CLOUDFLARE_API_TOKEN="$TOKEN_CLEAN"
fi
unset TOKEN_RAW
anahtar_ozeti() { # Anahtarın kendisini değil, yalnızca biçimini yazar
  local t="${CLOUDFLARE_API_TOKEN:-}" bicim="uygun"
  [[ "$t" =~ ^[A-Za-z0-9._-]+$ ]] || bicim="UYGUN DEĞİL (izin verilmeyen karakter var)"
  [[ "$t" =~ ^[0-9a-f]{32}$ ]] && bicim="UYGUN DEĞİL (Account ID'ye benziyor, anahtar değil)"
  echo "Anahtar özeti: ${#t} karakter, biçim: $bicim, not: $TOKEN_NOTE"
}
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
s_hesap()   { anahtar_ozeti; wr whoami; }
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
  GOLIGO_D1_ID="$(cat "$OUT/d1-id.txt" 2>/dev/null || true)" pnpm run build || return 1
  echo "--- dist/server/wrangler.json (özet) ---"
  node -e '
    const c=require("./dist/server/wrangler.json");
    console.log(JSON.stringify({name:c.name,main:c.main,compatibility_date:c.compatibility_date,
      compatibility_flags:c.compatibility_flags,d1_databases:c.d1_databases,vars:c.vars,
      assets:c.assets,workers_dev:c.workers_dev,routes:c.routes,ai:c.ai},null,1));'
}
s_sesler() { # Doğal site seslerini ("sesler" dalı) siteye ekler; yoksa cihaz sesi kullanılır.
  rm -rf public/voices && mkdir -p public/voices
  if git fetch -q --depth 1 origin sesler 2>/dev/null; then
    git archive FETCH_HEAD | tar -x -C public/voices
    rm -f public/voices/report.json
    echo "Site sesleri: $(find public/voices -name '*.mp3' | wc -l) dosya"
  else
    echo "Ses dalı yok; cihaz sesleri kullanılacak."
  fi
  return 0
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
s_uyelik() { # Üyelik tabloları: her yayında; IF NOT EXISTS ile var olan kayıtlara dokunmaz.
  echo "Üyelik tabloları kontrol ediliyor (migration/database/members.sql)..."
  # Açıklama satırları çıkarılıp tek komut olarak gönderilir (dosya içe aktarma akışına gerek yok).
  wr d1 execute "$DBNAME" --remote --command "$(grep -v '^[[:space:]]*--' migration/database/members.sql)" || return 1
  wr d1 execute "$DBNAME" --remote --json \
    --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('members','member_sessions','auth_attempts') ORDER BY name"
}
s_yayin() { wr deploy --config dist/server/wrangler.json; }
s_kontrol() {
  local url
  url=$(grep -o 'https://[a-zA-Z0-9.-]*\.workers\.dev' "$OUT/07-deploy.log" | head -n 1)
  [ -n "$url" ] || { echo "Yayın adresi bulunamadı"; return 1; }
  echo "$url" > "$OUT/ADRES.txt"
  echo "Adres: $url"
  sleep 10
  for path in / /giris /api/study /ev-esyalar; do
    curl -s -o /dev/null -w "$path -> HTTP %{http_code} %{redirect_url}\n" "$url$path"
  done
  if [ -n "$DOMAIN" ]; then # Sitenin kendi adresi (goliqo.com): workers.dev ve www buraya yönlenir.
    echo "Site adresi: https://$DOMAIN"
    for path in / /giris /ev-esyalar; do
      curl -s -o /dev/null -w "https://$DOMAIN$path -> HTTP %{http_code} %{redirect_url}\n" "https://$DOMAIN$path"
    done
    curl -s -o /dev/null -w "https://www.$DOMAIN/ -> HTTP %{http_code} %{redirect_url}\n" "https://www.$DOMAIN/"
  fi
}

s_eski() { # Eski adres(ler): herkesi yeni adrese gönderir, tarayıcı ayarlarını bir kez taşır (ci/eski-adres).
  local url old
  url=$(cat "$OUT/ADRES.txt" 2>/dev/null || true)
  [ -n "$DOMAIN" ] && url="https://$DOMAIN" # sitenin kendi adresi varsa eski adresler doğrudan oraya gider
  [ -n "$url" ] || { echo "Yeni adres bulunamadı"; return 1; }
  for old in $(node -p "(require('./yayin.json').oldWorkerNames||[]).join(' ')"); do
    [ "$old" = "$WORKER" ] && continue
    echo "Eski adres: $old -> $url"
    wr deploy --config ci/eski-adres/wrangler.json --name "$old" --var "NEW_ORIGIN:$url" || return 1
  done
}

adim "1-pnpm" 01-pnpm.log s_pnpm
adim "2-kurulum" 02-install.log s_install
if [ "$DRY" -eq 1 ]; then
  echo "mod=DENEME (CLOUDFLARE_API_TOKEN yok; yayin yapilmadi)" >> "$OUT/DURUM.txt"
  adim "3-sesler" 03-voices.log s_sesler; adim "3-derleme" 03-build.log s_build && adim "4-deneme-paketi" 04-dry-run.log s_deneme
else
  echo "mod=YAYIN (worker: $WORKER, d1: $DBNAME)" >> "$OUT/DURUM.txt"
  adim "3-hesap" 03-account.log s_hesap \
    && adim "4-d1" 04-d1.log s_d1 \
    && adim "5-sesler" 05-voices.log s_sesler \
    && adim "5-derleme" 05-build.log s_build \
    && adim "6-sema" 06-schema.log s_sema \
    && adim "6-uyelik" 06-members.log s_uyelik \
    && adim "7-yayin" 07-deploy.log s_yayin \
    && adim "8-kontrol" 08-check.log s_kontrol \
    && adim "9-eski-adres" 09-old-address.log s_eski
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
