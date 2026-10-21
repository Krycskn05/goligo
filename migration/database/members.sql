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
