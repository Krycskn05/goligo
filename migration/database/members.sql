-- Goliqo üyelik tabloları (e-posta + şifre).
-- Her yayında yeniden çalıştırılır; IF NOT EXISTS sayesinde var olan tablolara ve
-- kayıtlara dokunmaz. Çalışma kayıtları (study_*) değişmez: üyenin kimliği (members.id)
-- study_* tablolarındaki user_id ile aynıdır.

-- Üyeler. Şifrenin kendisi saklanmaz; yalnızca PBKDF2-SHA256 özeti (tuzlu) tutulur.
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  terms_accepted_at INTEGER NOT NULL,
  last_login_at INTEGER
);

-- Oturumlar. Çerezdeki rastgele anahtarın kendisi değil, SHA-256 özeti saklanır.
CREATE TABLE IF NOT EXISTS member_sessions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS member_sessions_member ON member_sessions(member_id);

-- Hatalı giriş ve kayıt denemeleri (deneme yanılmayı yavaşlatmak için).
CREATE TABLE IF NOT EXISTS auth_attempts (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

-- Giriş kayıtları: her girişin zamanı (yönetici panelinde "Girişler"). En fazla 90 gün tutulur;
-- daha eskileri yeni bir giriş olduğunda silinir.
CREATE TABLE IF NOT EXISTS member_logins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS member_logins_member ON member_logins(member_id, at);

-- Şifre yenileme bağlantıları ("Şifremi unuttum"). E-postadaki rastgele anahtarın kendisi değil, SHA-256 özeti
-- saklanır; bağlantı 1 saat geçerli ve tek kullanımlıktır (lib/member-store.ts).
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS password_resets_member ON password_resets(member_id);

-- Ziyaret istatistikleri (yönetici paneli, 4 Kasım 2026; lib/visits.ts). Çerez ve IP adresi saklanmaz: ziyaretçi,
-- o güne özel rastgele bir tuzla alınmış bir özetle sayılır (visitor). Tuzlar iki gün sonra silinir, satırlar 90 gün.
-- source: gelinen sitenin adı ('-' doğrudan, '' site içi); device: phone/tablet/computer; country: iki harfli kod.
CREATE TABLE IF NOT EXISTS site_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  day INTEGER NOT NULL,
  visitor TEXT NOT NULL,
  member INTEGER NOT NULL DEFAULT 0,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  device TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS site_visits_at ON site_visits(at);
CREATE INDEX IF NOT EXISTS site_visits_day ON site_visits(day, visitor);
CREATE TABLE IF NOT EXISTS visit_salts (
  day INTEGER PRIMARY KEY,
  salt TEXT NOT NULL
);

-- Üyenin sitede en son görüldüğü an (yönetici panelinde "şu an çevrimiçi"); hesap silinince silinir.
CREATE TABLE IF NOT EXISTS member_seen (
  member_id TEXT PRIMARY KEY,
  at INTEGER NOT NULL
);

-- Hangi üye hangi sayfayı ne zaman açtı (yönetici panelinde "Kim ne yaptı"; site sahibi istedi, 4 Kasım 2026).
-- Yalnızca giriş yapmış üyeler; satırlar 90 gün saklanır, hesap silinince silinir. Misafirler burada yoktur: onların
-- sayfaları site_visits'te yalnızca o güne özel anahtarla görünür.
CREATE TABLE IF NOT EXISTS member_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL,
  at INTEGER NOT NULL,
  path TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS member_pages_member ON member_pages(member_id, at);
CREATE INDEX IF NOT EXISTS member_pages_at ON member_pages(at);
