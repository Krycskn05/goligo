// LernKoko üyelik kayıtları (Cloudflare D1). Tablolar: migration/database/members.sql.
import { SESSION_MS, newToken, tokenHash, validToken } from './member-auth';

/** D1'in burada kullanılan kısmı (testlerde node:sqlite ile taklit edilir). */
export type Statement = {
  bind(...values: unknown[]): Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
};
export type Db = { prepare(query: string): Statement; batch(list: Statement[]): Promise<unknown[]> };

export type Member = { id: string; email: string; name: string; created_at: number; last_login_at: number | null };
export type MemberWithHash = Member & { password_hash: string };

const MEMBER_COLUMNS = 'id,email,name,created_at,last_login_at';

export async function memberByEmail(db: Db, email: string): Promise<MemberWithHash | null> {
  return db.prepare(`SELECT ${MEMBER_COLUMNS},password_hash FROM members WHERE email=?`).bind(email).first<MemberWithHash>();
}

export async function memberById(db: Db, id: string): Promise<MemberWithHash | null> {
  return db.prepare(`SELECT ${MEMBER_COLUMNS},password_hash FROM members WHERE id=?`).bind(id).first<MemberWithHash>();
}

export async function createMember(
  db: Db,
  member: { id: string; email: string; name: string; passwordHash: string },
  now = Date.now(),
): Promise<void> {
  await db
    .prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)')
    .bind(member.id, member.email, member.name, member.passwordHash, now, now, now)
    .run();
}

export async function setPasswordHash(db: Db, id: string, passwordHash: string): Promise<void> {
  await db.prepare('UPDATE members SET password_hash=? WHERE id=?').bind(passwordHash, id).run();
}

/** Giriş kayıtları (yönetici panelindeki "Girişler") en fazla bu kadar tutulur. */
export const LOGIN_KEEP_MS = 90 * 24 * 60 * 60 * 1000;

/** Yeni oturum açar ve çereze yazılacak anahtarı döndürür. Üyenin süresi geçmiş oturumları temizlenir;
 * girişin zamanı member_logins tablosuna yazılır, 90 günden eski giriş kayıtları silinir. */
export async function createSession(db: Db, memberId: string, now = Date.now()): Promise<string> {
  const token = newToken();
  await db.batch([
    db.prepare('DELETE FROM member_sessions WHERE member_id=? AND expires_at<=?').bind(memberId, now),
    db.prepare('INSERT INTO member_sessions (id,member_id,created_at,expires_at) VALUES (?,?,?,?)').bind(await tokenHash(token), memberId, now, now + SESSION_MS),
    db.prepare('UPDATE members SET last_login_at=? WHERE id=?').bind(now, memberId),
    db.prepare('DELETE FROM member_logins WHERE at<?').bind(now - LOGIN_KEEP_MS),
    db.prepare('INSERT INTO member_logins (member_id,at) VALUES (?,?)').bind(memberId, now),
  ]);
  return token;
}

/** Çerezdeki anahtarın üyesi (oturum geçerliyse). */
export async function memberForToken(db: Db, token: string | null | undefined, now = Date.now()): Promise<Member | null> {
  if (!validToken(token)) return null;
  return db
    .prepare(`SELECT m.id,m.email,m.name,m.created_at,m.last_login_at FROM member_sessions s JOIN members m ON m.id=s.member_id WHERE s.id=? AND s.expires_at>?`)
    .bind(await tokenHash(token), now)
    .first<Member>();
}

export async function deleteSession(db: Db, token: string | null | undefined): Promise<void> {
  if (!validToken(token)) return;
  await db.prepare('DELETE FROM member_sessions WHERE id=?').bind(await tokenHash(token)).run();
}

export async function deleteMemberSessions(db: Db, memberId: string): Promise<void> {
  await db.prepare('DELETE FROM member_sessions WHERE member_id=?').bind(memberId).run();
}

/** Üyeyi ve bütün çalışma kayıtlarını siler. */
export async function deleteMember(db: Db, memberId: string, email: string): Promise<void> {
  await db.batch([
    db.prepare('DELETE FROM study_answers WHERE user_id=?').bind(memberId),
    db.prepare('DELETE FROM study_review WHERE user_id=?').bind(memberId),
    db.prepare('DELETE FROM study_notes WHERE user_id=?').bind(memberId),
    db.prepare('DELETE FROM study_sessions WHERE user_id=?').bind(memberId),
    db.prepare('DELETE FROM member_sessions WHERE member_id=?').bind(memberId),
    db.prepare('DELETE FROM member_logins WHERE member_id=?').bind(memberId),
    db.prepare('DELETE FROM auth_attempts WHERE key=?').bind('login:' + email),
    db.prepare('DELETE FROM members WHERE id=?').bind(memberId),
  ]);
}

/** Üyenin kendi kayıtlarının dökümü (Hesabım → Verilerimi indir). */
export async function exportMember(db: Db, member: Member): Promise<Record<string, unknown>> {
  const [sessions, answers, reviews, notes, logins] = await Promise.all([
    db.prepare('SELECT id,mode,topic,created_at,finished_at FROM study_sessions WHERE user_id=? ORDER BY created_at').bind(member.id).all(),
    db.prepare('SELECT session_id,question_id,answer,correct,created_at FROM study_answers WHERE user_id=? ORDER BY created_at').bind(member.id).all(),
    db.prepare('SELECT question_id,wrong_count,streak,seen,last_answer,last_wrong,last_at,due_at FROM study_review WHERE user_id=? ORDER BY question_id').bind(member.id).all(),
    db.prepare('SELECT key,value FROM study_notes WHERE user_id=? ORDER BY key').bind(member.id).all(),
    db.prepare('SELECT at FROM member_logins WHERE member_id=? ORDER BY at').bind(member.id).all<{ at: number }>(),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    member: { name: member.name, email: member.email, createdAt: new Date(member.created_at).toISOString() },
    sessions: sessions.results,
    answers: answers.results,
    reviews: reviews.results,
    notes: notes.results,
    logins: logins.results.map((row) => new Date(Number(row.at)).toISOString()),
  };
}

/** Deneme sınırı: pencere içindeki hatalı deneme sayısı sınıra ulaştıysa true. */
export async function isLimited(db: Db, key: string, limit: number, windowMs: number, now = Date.now()): Promise<boolean> {
  const row = await db.prepare('SELECT count,window_start FROM auth_attempts WHERE key=?').bind(key).first<{ count: number; window_start: number }>();
  return !!row && now - Number(row.window_start) < windowMs && Number(row.count) >= limit;
}

/** Deneme sayaçları (IP adresi içerebilir) en fazla bu kadar tutulur. */
export const ATTEMPT_KEEP_MS = 24 * 60 * 60 * 1000;

/** Bir denemeyi sayar; pencere dolduysa sayım yeniden başlar. Bir günden eski sayaçlar silinir. */
export async function countAttempt(db: Db, key: string, windowMs: number, now = Date.now()): Promise<void> {
  await db.batch([
    db.prepare('DELETE FROM auth_attempts WHERE window_start<?').bind(now - ATTEMPT_KEEP_MS),
    db
      .prepare(
        'INSERT INTO auth_attempts (key,count,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN ?-auth_attempts.window_start>=? THEN 1 ELSE auth_attempts.count+1 END, window_start=CASE WHEN ?-auth_attempts.window_start>=? THEN ? ELSE auth_attempts.window_start END',
      )
      .bind(key, now, now, windowMs, now, windowMs, now),
  ]);
}

export async function setMemberName(db: Db, id: string, name: string): Promise<void> {
  await db.prepare('UPDATE members SET name=? WHERE id=?').bind(name, id).run();
}

export async function clearAttempts(db: Db, key: string): Promise<void> {
  await db.prepare('DELETE FROM auth_attempts WHERE key=?').bind(key).run();
}
