"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATTEMPT_KEEP_MS = exports.LOGIN_KEEP_MS = void 0;
exports.memberByEmail = memberByEmail;
exports.memberById = memberById;
exports.createMember = createMember;
exports.setPasswordHash = setPasswordHash;
exports.createSession = createSession;
exports.memberForToken = memberForToken;
exports.deleteSession = deleteSession;
exports.deleteMemberSessions = deleteMemberSessions;
exports.deleteMember = deleteMember;
exports.resetProgress = resetProgress;
exports.exportMember = exportMember;
exports.isLimited = isLimited;
exports.countAttempt = countAttempt;
exports.setMemberName = setMemberName;
exports.clearAttempts = clearAttempts;
exports.createPasswordReset = createPasswordReset;
exports.memberForReset = memberForReset;
exports.finishPasswordReset = finishPasswordReset;
// Goliqo üyelik kayıtları (Cloudflare D1). Tablolar: migration/database/members.sql.
const member_auth_1 = require("./member-auth");
const lesson_sync_1 = require("./lesson-sync");
const MEMBER_COLUMNS = 'id,email,name,created_at,last_login_at';
async function memberByEmail(db, email) {
    return db.prepare(`SELECT ${MEMBER_COLUMNS},password_hash FROM members WHERE email=?`).bind(email).first();
}
async function memberById(db, id) {
    return db.prepare(`SELECT ${MEMBER_COLUMNS},password_hash FROM members WHERE id=?`).bind(id).first();
}
async function createMember(db, member, now = Date.now()) {
    await db
        .prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)')
        .bind(member.id, member.email, member.name, member.passwordHash, now, now, now)
        .run();
}
async function setPasswordHash(db, id, passwordHash) {
    await db.prepare('UPDATE members SET password_hash=? WHERE id=?').bind(passwordHash, id).run();
}
/** Giriş kayıtları (yönetici panelindeki "Girişler") en fazla bu kadar tutulur. */
exports.LOGIN_KEEP_MS = 90 * 24 * 60 * 60 * 1000;
/** Yeni oturum açar ve çereze yazılacak anahtarı döndürür. Üyenin süresi geçmiş oturumları temizlenir;
 * girişin zamanı member_logins tablosuna yazılır, 90 günden eski giriş kayıtları silinir. */
async function createSession(db, memberId, now = Date.now()) {
    const token = (0, member_auth_1.newToken)();
    await db.batch([
        db.prepare('DELETE FROM member_sessions WHERE member_id=? AND expires_at<=?').bind(memberId, now),
        db.prepare('INSERT INTO member_sessions (id,member_id,created_at,expires_at) VALUES (?,?,?,?)').bind(await (0, member_auth_1.tokenHash)(token), memberId, now, now + member_auth_1.SESSION_MS),
        db.prepare('UPDATE members SET last_login_at=? WHERE id=?').bind(now, memberId),
        db.prepare('DELETE FROM member_logins WHERE at<?').bind(now - exports.LOGIN_KEEP_MS),
        db.prepare('INSERT INTO member_logins (member_id,at) VALUES (?,?)').bind(memberId, now),
    ]);
    return token;
}
/** Çerezdeki anahtarın üyesi (oturum geçerliyse). */
async function memberForToken(db, token, now = Date.now()) {
    if (!(0, member_auth_1.validToken)(token))
        return null;
    return db
        .prepare(`SELECT m.id,m.email,m.name,m.created_at,m.last_login_at FROM member_sessions s JOIN members m ON m.id=s.member_id WHERE s.id=? AND s.expires_at>?`)
        .bind(await (0, member_auth_1.tokenHash)(token), now)
        .first();
}
async function deleteSession(db, token) {
    if (!(0, member_auth_1.validToken)(token))
        return;
    await db.prepare('DELETE FROM member_sessions WHERE id=?').bind(await (0, member_auth_1.tokenHash)(token)).run();
}
async function deleteMemberSessions(db, memberId) {
    await db.prepare('DELETE FROM member_sessions WHERE member_id=?').bind(memberId).run();
}
/** Üyeyi ve bütün çalışma kayıtlarını siler. */
async function deleteMember(db, memberId, email) {
    await db.batch([
        db.prepare('DELETE FROM study_answers WHERE user_id=?').bind(memberId),
        db.prepare('DELETE FROM study_review WHERE user_id=?').bind(memberId),
        db.prepare('DELETE FROM study_notes WHERE user_id=?').bind(memberId),
        db.prepare('DELETE FROM study_sessions WHERE user_id=?').bind(memberId),
        db.prepare('DELETE FROM member_sessions WHERE member_id=?').bind(memberId),
        db.prepare('DELETE FROM password_resets WHERE member_id=?').bind(memberId),
        db.prepare('DELETE FROM member_logins WHERE member_id=?').bind(memberId),
        db.prepare('DELETE FROM member_seen WHERE member_id=?').bind(memberId),
        db.prepare('DELETE FROM member_pages WHERE member_id=?').bind(memberId),
        db.prepare('DELETE FROM auth_attempts WHERE key=?').bind('login:' + email),
        db.prepare('DELETE FROM members WHERE id=?').bind(memberId),
    ]);
}
/**
 * Hesabım → İlerlememi sıfırla: cevaplar, tekrar listesi (yanlışlar), testler ve "çalıştım" işaretleri silinir. Ders
 * ilerlemesi (`sync:…` satırları, lib/lesson-sync.ts) silinmez, her anahtarı "kaldırıldı" diye yazılır; diğer cihazlar
 * bir sonraki eşitlemede kendi kopyalarını da siler. Hesap, ad, yıldızlar, tanışma metni ve tur kaydı kalır.
 */
async function resetProgress(db, memberId, now = Date.now()) {
    const keys = lesson_sync_1.SYNC_LESSONS.map((lesson) => 'sync:' + lesson);
    const rows = await db
        .prepare(`SELECT key,value FROM study_notes WHERE user_id=? AND key IN (${keys.map(() => '?').join(',')})`)
        .bind(memberId, ...keys)
        .all();
    await db.batch([
        db.prepare('DELETE FROM study_answers WHERE user_id=?').bind(memberId),
        db.prepare('DELETE FROM study_review WHERE user_id=?').bind(memberId),
        db.prepare('DELETE FROM study_sessions WHERE user_id=?').bind(memberId),
        db.prepare("DELETE FROM study_notes WHERE user_id=? AND key LIKE 'lesson:%'").bind(memberId),
        ...rows.results.map((row) => {
            const items = (0, lesson_sync_1.resetItems)((0, lesson_sync_1.parseStored)(row.key.slice(5), row.value), now);
            return db.prepare('UPDATE study_notes SET value=?,updated_at=? WHERE user_id=? AND key=?').bind(JSON.stringify({ items }), now, memberId, row.key);
        }),
    ]);
}
/** Üyenin kendi kayıtlarının dökümü (Hesabım → Verilerimi indir). */
async function exportMember(db, member) {
    const [sessions, answers, reviews, notes, logins] = await Promise.all([
        db.prepare('SELECT id,mode,topic,created_at,finished_at FROM study_sessions WHERE user_id=? ORDER BY created_at').bind(member.id).all(),
        db.prepare('SELECT session_id,question_id,answer,correct,created_at FROM study_answers WHERE user_id=? ORDER BY created_at').bind(member.id).all(),
        db.prepare('SELECT question_id,wrong_count,streak,seen,last_answer,last_wrong,last_at,due_at FROM study_review WHERE user_id=? ORDER BY question_id').bind(member.id).all(),
        db.prepare('SELECT key,value FROM study_notes WHERE user_id=? ORDER BY key').bind(member.id).all(),
        db.prepare('SELECT at FROM member_logins WHERE member_id=? ORDER BY at').bind(member.id).all(),
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
async function isLimited(db, key, limit, windowMs, now = Date.now()) {
    const row = await db.prepare('SELECT count,window_start FROM auth_attempts WHERE key=?').bind(key).first();
    return !!row && now - Number(row.window_start) < windowMs && Number(row.count) >= limit;
}
/** Deneme sayaçları (IP adresi içerebilir) en fazla bu kadar tutulur. */
exports.ATTEMPT_KEEP_MS = 24 * 60 * 60 * 1000;
/** Bir denemeyi sayar; pencere dolduysa sayım yeniden başlar. Bir günden eski sayaçlar silinir. */
async function countAttempt(db, key, windowMs, now = Date.now()) {
    await db.batch([
        db.prepare('DELETE FROM auth_attempts WHERE window_start<?').bind(now - exports.ATTEMPT_KEEP_MS),
        db
            .prepare('INSERT INTO auth_attempts (key,count,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN ?-auth_attempts.window_start>=? THEN 1 ELSE auth_attempts.count+1 END, window_start=CASE WHEN ?-auth_attempts.window_start>=? THEN ? ELSE auth_attempts.window_start END')
            .bind(key, now, now, windowMs, now, windowMs, now),
    ]);
}
async function setMemberName(db, id, name) {
    await db.prepare('UPDATE members SET name=? WHERE id=?').bind(name, id).run();
}
async function clearAttempts(db, key) {
    await db.prepare('DELETE FROM auth_attempts WHERE key=?').bind(key).run();
}
/**
 * Şifre yenileme ("Şifremi unuttum"): e-postaya giden bağlantının rastgele anahtarı. Veritabanında yalnızca SHA-256
 * özeti durur; bağlantı RESET_MS (1 saat) geçerli ve tek kullanımlıktır. Üyenin önceki bağlantıları ve süresi geçmiş
 * bütün bağlantılar silinir, yani her zaman yalnızca en son gönderilen bağlantı çalışır.
 */
async function createPasswordReset(db, memberId, now = Date.now()) {
    const token = (0, member_auth_1.newToken)();
    await db.batch([
        db.prepare('DELETE FROM password_resets WHERE member_id=? OR expires_at<=?').bind(memberId, now),
        db.prepare('INSERT INTO password_resets (id,member_id,created_at,expires_at) VALUES (?,?,?,?)').bind(await (0, member_auth_1.tokenHash)(token), memberId, now, now + member_auth_1.RESET_MS),
    ]);
    return token;
}
/** Bağlantının üyesi (bağlantı geçerliyse). */
async function memberForReset(db, token, now = Date.now()) {
    if (!(0, member_auth_1.validToken)(token))
        return null;
    return db
        .prepare('SELECT m.id,m.email,m.name,m.created_at,m.last_login_at FROM password_resets r JOIN members m ON m.id=r.member_id WHERE r.id=? AND r.expires_at>?')
        .bind(await (0, member_auth_1.tokenHash)(token), now)
        .first();
}
/** Yeni şifreyi kaydeder; üyenin bütün yenileme bağlantıları ve bütün oturumları kapanır. */
async function finishPasswordReset(db, memberId, passwordHash) {
    await db.batch([
        db.prepare('UPDATE members SET password_hash=? WHERE id=?').bind(passwordHash, memberId),
        db.prepare('DELETE FROM password_resets WHERE member_id=?').bind(memberId),
        db.prepare('DELETE FROM member_sessions WHERE member_id=?').bind(memberId),
    ]);
}
