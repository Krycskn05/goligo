// Yönetici panelinin ziyaret ve üye davranışı bölümleri (app/yonetim; 4 Kasım 2026). Kayıtlar lib/visits.ts'ten gelir.
// "Ziyaretçi" o gün siteye giren farklı kişi (cihaz) demektir; aynı kişi iki gün gelirse iki ziyaret sayılır, çünkü
// ziyaretçiyi tanıyan anahtar her gün değişir (kimse günden güne izlenmez).
import type { Db } from './member-store';
import { DAY, dayNumber, dayStart, zoneOffsetMs } from './admin-stats';
import { DEVICE_NAMES, ONLINE_MS, pageName, sourceName, type Device } from './visits';
import { siteLanguages } from './site-languages';

export type VisitDay = { day: number; visitors: number; members: number; views: number };
export type CountRow = { key: string; name: string; views: number; visitors: number };
export type VisitOverview = {
  online: number; onlineMembers: number;
  today: { visitors: number; views: number; members: number };
  yesterday: { visitors: number; views: number };
  week: { visits: number; views: number };
  month: { visits: number; views: number };
  days: VisitDay[];
  pages: CountRow[]; sources: CountRow[]; devices: CountRow[]; countries: CountRow[]; languages: CountRow[];
  funnel: { guests: number; signupPage: number; newMembers: number };
};

const num = (value: unknown) => Number(value ?? 0) || 0;
/** Bir günün farklı ziyaretçisi: gün + günlük anahtar. */
const VISIT = "COUNT(DISTINCT day||'.'||visitor)";

/** Ülke kodu → Türkçe adı ve bayrağı (ad bulunamazsa kod). */
export function countryName(code: string): string {
  let name = code;
  try { name = new Intl.DisplayNames(['tr'], { type: 'region' }).of(code) ?? code; } catch { /* kod kalır */ }
  const flag = /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';
  return (flag ? flag + ' ' : '') + name;
}
export function languageName(id: string): string {
  const language = siteLanguages.find(item => item.id === id);
  return language ? `${language.label} (${id})` : id;
}

async function grouped(db: Db, column: string, from: number, name: (key: string) => string, limit: number, where = ''): Promise<CountRow[]> {
  const rows = await db.prepare(`SELECT ${column} AS k,COUNT(*) AS views,${VISIT} AS visitors FROM site_visits WHERE day>=? AND ${column}<>''${where} GROUP BY ${column} ORDER BY visitors DESC,views DESC LIMIT ?`).bind(from, limit).all<{ k: string; views: number; visitors: number }>();
  return rows.results.map(row => ({ key: row.k, name: name(row.k), views: num(row.views), visitors: num(row.visitors) }));
}

/** Son `days` günün ziyaretleri (Berlin günü) ve dökümleri. */
export async function loadVisits(db: Db, now = Date.now(), days = 30): Promise<VisitOverview> {
  const offset = zoneOffsetMs(now); const today = dayNumber(now, offset); const from = today - days + 1;
  const [online, daily, pages, sources, devices, countries, languages, funnel, members] = await Promise.all([
    db.prepare("SELECT COUNT(DISTINCT visitor) AS n,COUNT(DISTINCT CASE WHEN member=1 THEN visitor END) AS m FROM site_visits WHERE at>=?").bind(now - ONLINE_MS).first(),
    db.prepare("SELECT day,COUNT(DISTINCT visitor) AS visitors,COUNT(DISTINCT CASE WHEN member=1 THEN visitor END) AS members,COUNT(*) AS views FROM site_visits WHERE day>=? GROUP BY day").bind(from).all<{ day: number; visitors: number; members: number; views: number }>(),
    grouped(db, 'path', from, pageName, 15),
    grouped(db, 'source', from, sourceName, 12),
    grouped(db, 'device', from, key => DEVICE_NAMES[key as Device] ?? key, 3),
    grouped(db, 'country', from, countryName, 12),
    grouped(db, 'language', from, languageName, 12),
    db.prepare(`SELECT ${VISIT} AS guests,COUNT(DISTINCT CASE WHEN path='/uye-ol' THEN day||'.'||visitor END) AS signup FROM site_visits WHERE day>=? AND member=0`).bind(from).first(),
    db.prepare('SELECT COUNT(*) AS n FROM members WHERE created_at>=?').bind(dayStart(from, offset)).first(),
  ]);
  const byDay = new Map(daily.results.map(row => [num(row.day), row]));
  const list: VisitDay[] = Array.from({ length: days }, (_, i) => {
    const day = from + i; const row = byDay.get(day);
    return { day, visitors: num(row?.visitors), members: num(row?.members), views: num(row?.views) };
  });
  const sum = (rows: VisitDay[], key: 'visitors' | 'views') => rows.reduce((total, row) => total + row[key], 0);
  const last = list[list.length - 1]; const before = list[list.length - 2];
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

export type SeenMember = { id: string; name: string; at: number; online: boolean };
export type MemberHabits = {
  seen: SeenMember[];
  /** Son 30 günde üye olanlar; içlerinden bugünden önce üye olup sonraki bir gün yeniden gelenler. */
  newMembers: number; backEligible: number; cameBack: number;
  /** 7–60 gün önce üye olanlar; içlerinden üye olduktan en az 7 gün sonra yeniden gelenler. */
  weekEligible: number; weekLater: number;
};

/** Şu an çevrimiçi ve son görülen üyeler; yeni üyelerin geri gelip gelmediği (giriş, cevap ya da sayfa açma). */
export async function loadMemberHabits(db: Db, now = Date.now()): Promise<MemberHabits> {
  const offset = zoneOffsetMs(now); const today = dayNumber(now, offset);
  const [seen, joined] = await Promise.all([
    db.prepare('SELECT s.member_id AS id,s.at AS at,m.name AS name FROM member_seen s JOIN members m ON m.id=s.member_id ORDER BY s.at DESC LIMIT 12').all<{ id: string; at: number; name: string }>(),
    db.prepare(`SELECT m.id AS id,m.created_at AS created,MAX(
      COALESCE((SELECT MAX(a.created_at) FROM study_answers a WHERE a.user_id=m.id),0),
      COALESCE((SELECT MAX(l.at) FROM member_logins l WHERE l.member_id=m.id),0),
      COALESCE((SELECT s.at FROM member_seen s WHERE s.member_id=m.id),0)) AS last
      FROM members m WHERE m.created_at>=?`).bind(now - 60 * DAY).all<{ id: string; created: number; last: number }>(),
  ]);
  const rows = joined.results.map(row => ({ created: num(row.created), last: num(row.last) }));
  const recent = rows.filter(row => row.created >= now - 30 * DAY);
  const back = recent.filter(row => dayNumber(row.created, offset) < today);
  const week = rows.filter(row => row.created <= now - 7 * DAY);
  return {
    seen: seen.results.map(row => ({ id: row.id, name: row.name, at: num(row.at), online: num(row.at) >= now - ONLINE_MS })),
    newMembers: recent.length,
    backEligible: back.length,
    cameBack: back.filter(row => row.last >= dayStart(dayNumber(row.created, offset) + 1, offset)).length,
    weekEligible: week.length,
    weekLater: week.filter(row => row.last >= row.created + 7 * DAY).length,
  };
}
