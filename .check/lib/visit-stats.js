"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryName = countryName;
exports.languageName = languageName;
exports.loadVisits = loadVisits;
exports.loadMemberHabits = loadMemberHabits;
const admin_stats_1 = require("./admin-stats");
const visits_1 = require("./visits");
const site_languages_1 = require("./site-languages");
const num = (value) => Number(value ?? 0) || 0;
/** Bir günün farklı ziyaretçisi: gün + günlük anahtar. */
const VISIT = "COUNT(DISTINCT day||'.'||visitor)";
/** Ülke kodu → Türkçe adı ve bayrağı (ad bulunamazsa kod). */
function countryName(code) {
    let name = code;
    try {
        name = new Intl.DisplayNames(['tr'], { type: 'region' }).of(code) ?? code;
    }
    catch { /* kod kalır */ }
    const flag = /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';
    return (flag ? flag + ' ' : '') + name;
}
function languageName(id) {
    const language = site_languages_1.siteLanguages.find(item => item.id === id);
    return language ? `${language.label} (${id})` : id;
}
async function grouped(db, column, from, name, limit, where = '') {
    const rows = await db.prepare(`SELECT ${column} AS k,COUNT(*) AS views,${VISIT} AS visitors FROM site_visits WHERE day>=? AND ${column}<>''${where} GROUP BY ${column} ORDER BY visitors DESC,views DESC LIMIT ?`).bind(from, limit).all();
    return rows.results.map(row => ({ key: row.k, name: name(row.k), views: num(row.views), visitors: num(row.visitors) }));
}
/** Son `days` günün ziyaretleri (Berlin günü) ve dökümleri. */
async function loadVisits(db, now = Date.now(), days = 30) {
    const offset = (0, admin_stats_1.zoneOffsetMs)(now);
    const today = (0, admin_stats_1.dayNumber)(now, offset);
    const from = today - days + 1;
    const [online, daily, pages, sources, devices, countries, languages, funnel, members] = await Promise.all([
        db.prepare("SELECT COUNT(DISTINCT visitor) AS n,COUNT(DISTINCT CASE WHEN member=1 THEN visitor END) AS m FROM site_visits WHERE at>=?").bind(now - visits_1.ONLINE_MS).first(),
        db.prepare("SELECT day,COUNT(DISTINCT visitor) AS visitors,COUNT(DISTINCT CASE WHEN member=1 THEN visitor END) AS members,COUNT(*) AS views FROM site_visits WHERE day>=? GROUP BY day").bind(from).all(),
        grouped(db, 'path', from, visits_1.pageName, 15),
        grouped(db, 'source', from, visits_1.sourceName, 12),
        grouped(db, 'device', from, key => visits_1.DEVICE_NAMES[key] ?? key, 3),
        grouped(db, 'country', from, countryName, 12),
        grouped(db, 'language', from, languageName, 12),
        db.prepare(`SELECT ${VISIT} AS guests,COUNT(DISTINCT CASE WHEN path='/uye-ol' THEN day||'.'||visitor END) AS signup FROM site_visits WHERE day>=? AND member=0`).bind(from).first(),
        db.prepare('SELECT COUNT(*) AS n FROM members WHERE created_at>=?').bind((0, admin_stats_1.dayStart)(from, offset)).first(),
    ]);
    const byDay = new Map(daily.results.map(row => [num(row.day), row]));
    const list = Array.from({ length: days }, (_, i) => {
        const day = from + i;
        const row = byDay.get(day);
        return { day, visitors: num(row?.visitors), members: num(row?.members), views: num(row?.views) };
    });
    const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);
    const last = list[list.length - 1];
    const before = list[list.length - 2];
    return {
        online: num(online?.n), onlineMembers: num(online?.m),
        today: { visitors: last.visitors, views: last.views, members: last.members },
        yesterday: { visitors: before?.visitors ?? 0, views: before?.views ?? 0 },
        week: { visits: sum(list.slice(-7), 'visitors'), views: sum(list.slice(-7), 'views') },
        month: { visits: sum(list, 'visitors'), views: sum(list, 'views') },
        days: list, pages, sources, devices, countries, languages,
        funnel: { guests: num(funnel?.guests), signupPage: num(funnel?.signup), newMembers: num(members?.n) },
    };
}
/** Şu an çevrimiçi ve son görülen üyeler; yeni üyelerin geri gelip gelmediği (giriş, cevap ya da sayfa açma). */
async function loadMemberHabits(db, now = Date.now()) {
    const offset = (0, admin_stats_1.zoneOffsetMs)(now);
    const today = (0, admin_stats_1.dayNumber)(now, offset);
    const [seen, joined] = await Promise.all([
        db.prepare('SELECT s.member_id AS id,s.at AS at,m.name AS name FROM member_seen s JOIN members m ON m.id=s.member_id ORDER BY s.at DESC LIMIT 12').all(),
        db.prepare(`SELECT m.id AS id,m.created_at AS created,MAX(
      COALESCE((SELECT MAX(a.created_at) FROM study_answers a WHERE a.user_id=m.id),0),
      COALESCE((SELECT MAX(l.at) FROM member_logins l WHERE l.member_id=m.id),0),
      COALESCE((SELECT s.at FROM member_seen s WHERE s.member_id=m.id),0)) AS last
      FROM members m WHERE m.created_at>=?`).bind(now - 60 * admin_stats_1.DAY).all(),
    ]);
    const rows = joined.results.map(row => ({ created: num(row.created), last: num(row.last) }));
    const recent = rows.filter(row => row.created >= now - 30 * admin_stats_1.DAY);
    const back = recent.filter(row => (0, admin_stats_1.dayNumber)(row.created, offset) < today);
    const week = rows.filter(row => row.created <= now - 7 * admin_stats_1.DAY);
    return {
        seen: seen.results.map(row => ({ id: row.id, name: row.name, at: num(row.at), online: num(row.at) >= now - visits_1.ONLINE_MS })),
        newMembers: recent.length,
        backEligible: back.length,
        cameBack: back.filter(row => row.last >= (0, admin_stats_1.dayStart)((0, admin_stats_1.dayNumber)(row.created, offset) + 1, offset)).length,
        weekEligible: week.length,
        weekLater: week.filter(row => row.last >= row.created + 7 * admin_stats_1.DAY).length,
    };
}
