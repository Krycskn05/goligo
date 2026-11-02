"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percent = exports.dayStart = exports.dayNumber = exports.modeName = exports.AREA_NAMES = exports.DAY = exports.isAdminEmail = exports.ADMIN_EMAILS = void 0;
exports.areaOf = areaOf;
exports.questionInfo = questionInfo;
exports.topicName = topicName;
exports.zoneOffsetMs = zoneOffsetMs;
exports.loadOverview = loadOverview;
exports.loadAreas = loadAreas;
exports.loadMembers = loadMembers;
exports.loadTopMistakes = loadTopMistakes;
exports.loadSessions = loadSessions;
exports.loadMember = loadMember;
exports.formatTime = formatTime;
exports.ago = ago;
const course_1 = require("./course");
var admin_access_1 = require("./admin-access");
Object.defineProperty(exports, "ADMIN_EMAILS", { enumerable: true, get: function () { return admin_access_1.ADMIN_EMAILS; } });
Object.defineProperty(exports, "isAdminEmail", { enumerable: true, get: function () { return admin_access_1.isAdminEmail; } });
exports.DAY = 86400000;
exports.AREA_NAMES = { housing: 'Ev ve Yaşam', vault: 'Kelime Kasası', vaultEn: 'Kelime Kasası (İngilizce)', verbs: 'Fiil Atölyesi', other: 'Diğer konular' };
function areaOf(questionId) {
    if (questionId.startsWith('housing-'))
        return 'housing';
    if (questionId.startsWith('en-obj-'))
        return 'vaultEn';
    if (questionId.startsWith('obj-'))
        return 'vault';
    if (questionId.startsWith('verb-'))
        return 'verbs';
    return 'other';
}
const AREA_SQL = "CASE WHEN question_id LIKE 'housing-%' THEN 'housing' WHEN question_id LIKE 'en-obj-%' THEN 'vaultEn' WHEN question_id LIKE 'obj-%' THEN 'vault' WHEN question_id LIKE 'verb-%' THEN 'verbs' ELSE 'other' END";
const TASKS = [
    ['obj-hear', 'Dinle ve bul'], ['obj-picture', 'Resim testi'], ['obj-write', 'Yazma'], ['obj-article', 'Artikel'], ['obj-gap', 'Boşluk doldurma'], ['obj-read', 'Okuma'], ['obj-dictation', 'Dikte'], ['obj-scene', 'Resimde bul'], ['obj-puzzle', 'Harf bulmacası'], ['en-obj-', 'İngilizce nesne'],
    ['verb-meaning', 'Anlam'], ['verb-word', 'Kelime'], ['verb-fit', 'Uygun fiil'], ['verb-praesens', 'Präsens'], ['verb-perfekt', 'Perfekt'], ['verb-partizip', 'Partizip II'], ['verb-write', 'Yazma'], ['verb-hear', 'Dinleme'],
];
const KINDS = { choice: 'Test', write: 'Yazma', listen: 'Dinleme', read: 'Okuma' };
/** What a question asked and its right answer, for the tables of the panel. */
function questionInfo(id) {
    const question = course_1.questionMap.get(id);
    const area = areaOf(id);
    const task = TASKS.find(([prefix]) => id.startsWith(prefix))?.[1] ?? (question ? KINDS[question.kind] ?? 'Soru' : 'Soru');
    // The general instruction ("Boşluğu Almanca yazarak tamamla.") says little, so the gap sentence or the meaning is added.
    const extra = question;
    const meaning = typeof extra?.answerTr === 'string' && extra.answerTr ? extra.answerTr : Array.isArray(extra?.meaning) && typeof extra.meaning[0] === 'string' ? extra.meaning[0] : '';
    const detail = question?.gap ? question.gap : meaning ? 'Anlamı: ' + meaning : '';
    return { id, area, areaName: exports.AREA_NAMES[area], task, prompt: question ? question.prompt.replace(/\|/g, '') : id, detail, answer: question ? question.answer : '' };
}
const topicTitles = new Map(course_1.learningTopics.map(topic => [topic.id, topic.title]));
function topicName(topic) {
    if (topic === 'all')
        return 'Bütün konular';
    if (topic === 'en-all')
        return 'Bütün konular (İngilizce)';
    return topicTitles.get(topic) ?? (topic.startsWith('verb') ? 'Fiil Atölyesi' : topic.startsWith('objects') || topic.startsWith('en-objects') ? 'Kelime Kasası' : topic);
}
const modeName = (mode) => course_1.modeLabels[mode] ?? mode;
exports.modeName = modeName;
/** Milliseconds to add to a UTC time to get the wall clock time in Berlin (summer and winter time). */
function zoneOffsetMs(at, timeZone = 'Europe/Berlin') {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(new Date(at));
    const get = (type) => Number(parts.find(part => part.type === type)?.value ?? 0);
    return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')) - Math.floor(at / 1000) * 1000;
}
/** The day number (days since 1970 in Berlin) and the first moment of that day as a UTC time. */
const dayNumber = (at, offset) => Math.floor((at + offset) / exports.DAY);
exports.dayNumber = dayNumber;
const dayStart = (day, offset) => day * exports.DAY - offset;
exports.dayStart = dayStart;
const num = (value) => Number(value ?? 0) || 0;
/** The cards and the 30-day chart at the top of the panel. */
async function loadOverview(db, now = Date.now(), days = 30) {
    const offset = zoneOffsetMs(now);
    const today = (0, exports.dayNumber)(now, offset);
    const todayStart = (0, exports.dayStart)(today, offset);
    const from = (0, exports.dayStart)(today - days + 1, offset);
    const [members, answers, sessions, logins7, daily, loginDays, memberDays] = await Promise.all([
        db.prepare('SELECT COUNT(*) AS n,SUM(CASE WHEN created_at>=? THEN 1 ELSE 0 END) AS new7,SUM(CASE WHEN created_at>=? THEN 1 ELSE 0 END) AS new30 FROM members').bind(now - 7 * exports.DAY, now - 30 * exports.DAY).first(),
        db.prepare('SELECT COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct,COUNT(DISTINCT user_id) AS learners,COUNT(DISTINCT CASE WHEN created_at>=? THEN user_id END) AS today,COUNT(DISTINCT CASE WHEN created_at>=? THEN user_id END) AS week,COUNT(DISTINCT CASE WHEN created_at>=? THEN user_id END) AS month FROM study_answers').bind(todayStart, now - 7 * exports.DAY, now - 30 * exports.DAY).first(),
        db.prepare('SELECT COUNT(*) AS n FROM study_sessions').first(),
        db.prepare('SELECT COUNT(*) AS n FROM member_logins WHERE at>=?').bind(now - 7 * exports.DAY).first(),
        db.prepare('SELECT CAST((created_at+?)/86400000 AS INTEGER) AS day,COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct,COUNT(DISTINCT user_id) AS learners FROM study_answers WHERE created_at>=? GROUP BY day').bind(offset, from).all(),
        db.prepare('SELECT CAST((at+?)/86400000 AS INTEGER) AS day,COUNT(*) AS n FROM member_logins WHERE at>=? GROUP BY day').bind(offset, from).all(),
        db.prepare('SELECT CAST((created_at+?)/86400000 AS INTEGER) AS day,COUNT(*) AS n FROM members WHERE created_at>=? GROUP BY day').bind(offset, from).all(),
    ]);
    const byDay = new Map();
    for (let day = today - days + 1; day <= today; day++)
        byDay.set(day, { day, answers: 0, correct: 0, learners: 0, logins: 0, newMembers: 0 });
    for (const row of daily.results) {
        const item = byDay.get(num(row.day));
        if (item) {
            item.answers = num(row.answers);
            item.correct = num(row.correct);
            item.learners = num(row.learners);
        }
    }
    for (const row of loginDays.results) {
        const item = byDay.get(num(row.day));
        if (item)
            item.logins = num(row.n);
    }
    for (const row of memberDays.results) {
        const item = byDay.get(num(row.day));
        if (item)
            item.newMembers = num(row.n);
    }
    return { members: num(members?.n), new7: num(members?.new7), new30: num(members?.new30), learnersToday: num(answers?.today), learners7: num(answers?.week), learners30: num(answers?.month), answers: num(answers?.answers), correct: num(answers?.correct), learnersEver: num(answers?.learners), sessions: num(sessions?.n), logins7: num(logins7?.n), days: [...byDay.values()] };
}
/** Answers, right answers and learners per part of the site (all members, or one member). */
async function loadAreas(db, userId) {
    const query = `SELECT ${AREA_SQL} AS area,COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct,COUNT(DISTINCT user_id) AS learners FROM study_answers${userId ? ' WHERE user_id=?' : ''} GROUP BY area`;
    const { results } = await (userId ? db.prepare(query).bind(userId) : db.prepare(query)).all();
    const rows = new Map(results.map(row => [String(row.area), row]));
    return Object.keys(exports.AREA_NAMES).map(area => { const row = rows.get(area); return { area, name: exports.AREA_NAMES[area], answers: num(row?.answers), correct: num(row?.correct), learners: num(row?.learners) }; }).filter(row => row.answers > 0 || row.area !== 'other' && row.area !== 'vaultEn');
}
/** Every member (and every older account that only has study records) with their totals. */
async function loadMembers(db, now = Date.now()) {
    const offset = zoneOffsetMs(now);
    const [members, study, areas] = await Promise.all([
        db.prepare('SELECT m.id,m.name,m.email,m.created_at,m.last_login_at,(SELECT COUNT(*) FROM member_logins l WHERE l.member_id=m.id) AS logins FROM members m').all(),
        db.prepare('SELECT user_id,COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct,MAX(created_at) AS last_at,COUNT(DISTINCT CAST((created_at+?)/86400000 AS INTEGER)) AS days FROM study_answers GROUP BY user_id').bind(offset).all(),
        db.prepare(`SELECT user_id,${AREA_SQL} AS area,COUNT(*) AS n FROM study_answers GROUP BY user_id,area`).all(),
    ]);
    const studyBy = new Map(study.results.map(row => [String(row.user_id), row]));
    const mainArea = new Map();
    for (const row of areas.results) {
        const user = String(row.user_id);
        const n = num(row.n);
        const best = mainArea.get(user);
        if (!best || n > best.n)
            mainArea.set(user, { area: String(row.area), n });
    }
    const rowFor = (id, base) => {
        const s = studyBy.get(id);
        const area = mainArea.get(id)?.area;
        return { id, ...base, answers: num(s?.answers), correct: num(s?.correct), lastStudyAt: s ? num(s.last_at) : null, activeDays: num(s?.days), mainArea: area ? exports.AREA_NAMES[area] : '' };
    };
    const known = new Set();
    const rows = [];
    for (const m of members.results) {
        const id = String(m.id);
        known.add(id);
        rows.push(rowFor(id, { name: String(m.name ?? ''), email: String(m.email ?? ''), legacy: false, createdAt: num(m.created_at) || null, lastLoginAt: m.last_login_at == null ? null : num(m.last_login_at), logins: num(m.logins) }));
    }
    for (const id of studyBy.keys())
        if (!known.has(id))
            rows.push(rowFor(id, { name: 'Eski hesap', email: '', legacy: true, createdAt: null, lastLoginAt: null, logins: 0 }));
    const latest = (row) => Math.max(row.lastStudyAt ?? 0, row.lastLoginAt ?? 0, row.createdAt ?? 0);
    return rows.sort((a, b) => latest(b) - latest(a));
}
/** The questions answered wrong most often by all members, with the wrong answers given most often. */
async function loadTopMistakes(db, limit = 25) {
    const { results } = await db.prepare('SELECT question_id,SUM(CASE WHEN correct=0 THEN 1 ELSE 0 END) AS wrong,COUNT(*) AS total,COUNT(DISTINCT CASE WHEN correct=0 THEN user_id END) AS learners FROM study_answers GROUP BY question_id HAVING wrong>0 ORDER BY wrong DESC,total DESC LIMIT ?').bind(Math.max(1, Math.min(limit, 60))).all();
    if (!results.length)
        return [];
    const ids = results.map(row => String(row.question_id));
    const { results: answers } = await db.prepare(`SELECT question_id,answer,COUNT(*) AS n FROM study_answers WHERE correct=0 AND question_id IN (${ids.map(() => '?').join(',')}) GROUP BY question_id,answer ORDER BY n DESC`).bind(...ids).all();
    const wrongBy = new Map();
    for (const row of answers) {
        const id = String(row.question_id);
        const list = wrongBy.get(id) ?? [];
        if (list.length < 3)
            list.push({ answer: String(row.answer), n: num(row.n) });
        wrongBy.set(id, list);
    }
    return results.map(row => { const id = String(row.question_id); return { ...questionInfo(id), wrong: num(row.wrong), total: num(row.total), learners: num(row.learners), wrongAnswers: wrongBy.get(id) ?? [] }; });
}
const questionCount = (raw) => { try {
    const list = JSON.parse(String(raw ?? '[]'));
    return Array.isArray(list) ? list.length : 0;
}
catch {
    return 0;
} };
/** The latest tests and rounds (of everyone, or of one member). */
async function loadSessions(db, limit = 30, userId) {
    const query = `SELECT s.id,s.user_id,s.mode,s.topic,s.created_at,s.finished_at,s.questions,m.name,m.email,COUNT(a.id) AS answered,COALESCE(SUM(a.correct),0) AS correct FROM study_sessions s LEFT JOIN members m ON m.id=s.user_id LEFT JOIN study_answers a ON a.session_id=s.id AND a.user_id=s.user_id${userId ? ' WHERE s.user_id=?' : ''} GROUP BY s.id ORDER BY s.created_at DESC LIMIT ?`;
    const capped = Math.max(1, Math.min(limit, 200));
    const { results } = await (userId ? db.prepare(query).bind(userId, capped) : db.prepare(query).bind(capped)).all();
    return results.map(row => ({ id: String(row.id), userId: String(row.user_id), name: row.name == null ? 'Eski hesap' : String(row.name), email: String(row.email ?? ''), mode: String(row.mode), topic: String(row.topic), createdAt: num(row.created_at), finishedAt: row.finished_at == null ? null : num(row.finished_at), answered: num(row.answered), correct: num(row.correct), questions: questionCount(row.questions) }));
}
/** Everything about one member: logins, study days, parts, tests, wrong answers and the hardest questions. */
async function loadMember(db, id, now = Date.now(), days = 60) {
    if (typeof id !== 'string' || !id || id.length > 200)
        return null;
    const offset = zoneOffsetMs(now);
    const today = (0, exports.dayNumber)(now, offset);
    const from = (0, exports.dayStart)(today - days + 1, offset);
    const [member, logins, totals, daily, loginDays, mistakes, hardest] = await Promise.all([
        db.prepare('SELECT id,name,email,created_at,last_login_at FROM members WHERE id=?').bind(id).first(),
        db.prepare('SELECT at FROM member_logins WHERE member_id=? ORDER BY at DESC LIMIT 200').bind(id).all(),
        db.prepare('SELECT COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct,MIN(created_at) AS first_at,MAX(created_at) AS last_at,COUNT(DISTINCT CAST((created_at+?)/86400000 AS INTEGER)) AS days FROM study_answers WHERE user_id=?').bind(offset, id).first(),
        db.prepare('SELECT CAST((created_at+?)/86400000 AS INTEGER) AS day,COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct FROM study_answers WHERE user_id=? AND created_at>=? GROUP BY day').bind(offset, id, from).all(),
        db.prepare('SELECT CAST((at+?)/86400000 AS INTEGER) AS day,COUNT(*) AS n FROM member_logins WHERE member_id=? AND at>=? GROUP BY day').bind(offset, id, from).all(),
        db.prepare('SELECT question_id,answer,created_at FROM study_answers WHERE user_id=? AND correct=0 ORDER BY created_at DESC LIMIT 100').bind(id).all(),
        db.prepare('SELECT question_id,wrong_count,seen,streak,last_wrong,last_at FROM study_review WHERE user_id=? AND wrong_count>0 ORDER BY wrong_count DESC,last_at DESC LIMIT 30').bind(id).all(),
    ]);
    const answers = num(totals?.answers);
    if (!member && !answers)
        return null;
    const byDay = new Map();
    for (let day = today - days + 1; day <= today; day++)
        byDay.set(day, { day, answers: 0, correct: 0, learners: 0, logins: 0, newMembers: 0 });
    for (const row of daily.results) {
        const item = byDay.get(num(row.day));
        if (item) {
            item.answers = num(row.answers);
            item.correct = num(row.correct);
            item.learners = item.answers ? 1 : 0;
        }
    }
    for (const row of loginDays.results) {
        const item = byDay.get(num(row.day));
        if (item)
            item.logins = num(row.n);
    }
    const [areas, sessions] = await Promise.all([loadAreas(db, id), loadSessions(db, 50, id)]);
    return {
        id, name: member ? String(member.name ?? '') : 'Eski hesap', email: member ? String(member.email ?? '') : '', legacy: !member,
        createdAt: member ? num(member.created_at) || null : null, lastLoginAt: member?.last_login_at == null ? null : num(member.last_login_at),
        logins: logins.results.map(row => num(row.at)), answers, correct: num(totals?.correct), activeDays: num(totals?.days),
        firstStudyAt: answers ? num(totals?.first_at) : null, lastStudyAt: answers ? num(totals?.last_at) : null,
        days: [...byDay.values()], areas, sessions,
        mistakes: mistakes.results.map(row => ({ ...questionInfo(String(row.question_id)), given: String(row.answer), at: num(row.created_at) })),
        hardest: hardest.results.map(row => ({ ...questionInfo(String(row.question_id)), wrongCount: num(row.wrong_count), seen: num(row.seen), streak: num(row.streak), lastWrong: String(row.last_wrong ?? ''), lastAt: num(row.last_at) })),
    };
}
/** "20.10.2026 14:05" in Berlin time; "—" when there is no time. */
function formatTime(at, withTime = true) {
    if (!at)
        return '—';
    return new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) }).format(new Date(at));
}
/** "3 gün önce", "5 dk önce" … */
function ago(at, now = Date.now()) {
    if (!at)
        return '';
    const minutes = Math.max(0, Math.round((now - at) / 60000));
    if (minutes < 1)
        return 'şimdi';
    if (minutes < 60)
        return minutes + ' dk önce';
    const hours = Math.round(minutes / 60);
    if (hours < 24)
        return hours + ' saat önce';
    const daysAgo = Math.round(hours / 24);
    if (daysAgo < 31)
        return daysAgo + ' gün önce';
    return Math.round(daysAgo / 30) + ' ay önce';
}
const percent = (correct, total) => total ? Math.round(correct / total * 100) : 0;
exports.percent = percent;
