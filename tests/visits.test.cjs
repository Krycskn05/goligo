// Ziyaret istatistikleri ve üye davranışı (yönetici paneli; site sahibi istedi, 4 Kasım 2026): çerez ve IP adresi
// tutulmadan kaç kişinin geldiği, hangi sayfalar, nereden, hangi cihaz/ülke/dil; kim şu an çevrimiçi, yeni üyeler geri
// geliyor mu, misafirlerden kaçı üye oluyor.
const {test}=require('node:test');const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const visits=load('visits'),vstats=load('visit-stats'),store=load('member-store'),admin=load('admin-stats'),legal=load('legal-copy'),site=load('site-languages');
const read=file=>fs.readFileSync(file,'utf8');

function fakeDb(){
 const sql=new DatabaseSync(':memory:');
 sql.exec(read('drizzle/0000_heavy_brood.sql'));
 sql.exec(read('migration/database/members.sql'));sql.exec(read('migration/database/members.sql'));
 const db={sql,prepare(query){return{query,args:[],bind(...args){this.args=args;return this;},async first(){const row=sql.prepare(this.query).get(...this.args);return row?{...row}:null;},async all(){return {results:sql.prepare(this.query).all(...this.args).map(r=>({...r}))};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(list){sql.exec('BEGIN');try{const out=[];for(const item of list)out.push(await item.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 return db;
}
const DAY=86400000;const NOW=Date.UTC(2026,10,4,12,0);
const PHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1';
const visit=(over={})=>({path:'/',referrer:'',internal:false,device:'phone',language:'tr',ip:'203.0.113.7',userAgent:PHONE,country:'DE',host:'goliqo.com',memberId:null,...over});

test('what is kept of a visit: a known page, the site name it came from, device, country, language — never the query, an IP or a cookie',()=>{
 assert.equal(visits.cleanPath('/fiiller?parca=theme-essen#x'),'/fiiller');assert.equal(visits.cleanPath('/fiiller/'),'/fiiller');
 assert.equal(visits.cleanPath('/sifre-yenile?token=abc'),'/sifre-yenile','the reset token never reaches the table');
 assert.equal(visits.cleanPath('/bir/yazi/ozel'),visits.OTHER_PAGE,'an unknown address is only "(diğer)"');
 for(const bad of ['/yonetim','/yonetim?uye=1','/api/study','fiiller','',null,42])assert.equal(visits.cleanPath(bad),null,String(bad));
 for(const page of ['/','/konular','/ev-esyalar','/fiiller','/oyunlar','/yanlislarim','/a1-1/willkommen','/a1-1/berufe','/a1-2/ev-ve-yasam','/a1-2/ausbildung','/a1-2/ausbildung/hoeren','/a1-2/wege-in-der-stadt','/uye-ol','/giris','/sifre-yenile','/hesabim','/gizlilik','/kullanim-kosullari','/impressum'])assert.ok(visits.PAGE_NAMES[page],page);
 // Every page of the site has a name (app/**/page.tsx), except the admin panel.
 const pages=[];const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name==='page.tsx')pages.push(('/'+path.relative('app',dir)).replace(/\/$/,'')||'/');}};walk('app');
 assert.ok(pages.length>15);for(const page of pages)if(page!=='/yonetim')assert.ok(visits.PAGE_NAMES[page],'named: '+page);
 assert.equal(visits.sourceOf('https://www.google.com/search?q=almanca','goliqo.com'),'google.com','only the site name, no search words');
 assert.equal(visits.sourceOf('https://goliqo.com/fiiller','goliqo.com'),'','inside the site is no source');
 assert.equal(visits.sourceOf('','goliqo.com'),'-');assert.equal(visits.sourceOf('nonsense','goliqo.com'),'-');assert.equal(visits.sourceOf('https://l.instagram.com/x','goliqo.com',true),'');
 assert.equal(visits.sourceName('google.com.tr'),'Google');assert.equal(visits.sourceName('l.instagram.com'),'Instagram');assert.equal(visits.sourceName('-'),'Doğrudan (adres, yer imi, uygulama)');assert.equal(visits.sourceName('example.org'),'example.org');
 assert.equal(visits.deviceOf('tablet'),'tablet');assert.equal(visits.deviceOf('toaster'),'');
 assert.equal(visits.countryOf('de'),'DE');assert.equal(visits.countryOf('XX'),'');assert.equal(visits.countryOf('T1'),'');assert.equal(visits.countryOf(null),'');
 assert.equal(visits.languageOf('uk'),'uk');assert.equal(visits.languageOf('xx'),'');
 for(const bot of ['Googlebot/2.1','Mozilla/5.0 HeadlessChrome/140','WhatsApp/2.24','facebookexternalhit/1.1','curl/8.0','',null])assert.ok(visits.isBot(bot),String(bot));
 assert.ok(!visits.isBot(PHONE));
});

test('visits are counted per day with a key that changes every day; the IP is never stored and the old salts are deleted',async()=>{
 const db=fakeDb();
 assert.ok(await visits.recordVisit(db,visit(),NOW));
 assert.ok(!await visits.recordVisit(db,visit(),NOW+3000),'the same page again within 10 seconds counts once');
 assert.ok(await visits.recordVisit(db,visit({path:'/fiiller',referrer:'https://goliqo.com/',internal:true}),NOW+20000));
 assert.ok(await visits.recordVisit(db,visit({ip:'198.51.100.2',device:'computer',referrer:'https://www.google.de/',language:'de',country:'TR'}),NOW+30000));
 const rows=db.sql.prepare('SELECT * FROM site_visits ORDER BY at').all();
 assert.equal(rows.length,3);assert.equal(new Set(rows.map(r=>r.visitor)).size,2,'two people');
 assert.deepEqual(rows.map(r=>[r.path,r.source,r.device,r.country,r.language,r.member]),[['/','-','phone','DE','tr',0],['/fiiller','','phone','DE','tr',0],['/','google.de','computer','TR','de',0]]);
 const dump=JSON.stringify(db.sql.prepare('SELECT * FROM site_visits').all())+JSON.stringify(db.sql.prepare('SELECT * FROM visit_salts').all());
 assert.ok(!dump.includes('203.0.113.7')&&!dump.includes('198.51.100.2')&&!dump.includes('iPhone'),'no IP address, no browser text');
 assert.match(rows[0].visitor,/^[0-9a-f]{16}$/);
 // The next day the same person gets another key; salts older than yesterday are gone.
 await visits.recordVisit(db,visit(),NOW+DAY);await visits.recordVisit(db,visit(),NOW+3*DAY);
 assert.ok(!db.sql.prepare("SELECT name FROM pragma_table_info('site_visits')").all().some(c=>/ip|agent|cookie/i.test(c.name)),'the table has no IP or browser column');
 const own=db.sql.prepare('SELECT DISTINCT visitor FROM site_visits WHERE country=?').all('DE').map(r=>r.visitor);assert.equal(own.length,3,'one key per day for the same person');
 assert.ok(db.sql.prepare('SELECT day FROM visit_salts').all().length<=2,'only today\'s and yesterday\'s salt are kept');
 // A member: the visit says "member", the last-seen time is kept and goes with the account.
 db.sql.prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)').run('m1','ada@example.com','Ada','x',NOW-DAY,NOW-DAY,NOW-DAY);
 await visits.recordVisit(db,visit({memberId:'m1',path:'/ev-esyalar'}),NOW+4*DAY);
 assert.equal(db.sql.prepare('SELECT at FROM member_seen WHERE member_id=?').get('m1').at,NOW+4*DAY);
 assert.equal(db.sql.prepare("SELECT member FROM site_visits WHERE path='/ev-esyalar'").get().member,1);
 assert.ok(!JSON.stringify(db.sql.prepare('SELECT * FROM site_visits').all()).includes('m1'),'a visit never names the member');
 await store.deleteMember(db,'m1','ada@example.com');assert.equal(db.sql.prepare('SELECT COUNT(*) AS n FROM member_seen').get().n,0,'deleted with the account');
 // Old rows go after 90 days (the cleanup runs now and then; here by hand with the same rule).
 db.sql.prepare('INSERT INTO site_visits (at,day,visitor,path) VALUES (?,?,?,?)').run(NOW-91*DAY,0,'old','/');
 const random=Math.random;Math.random=()=>0;try{await visits.recordVisit(db,visit({path:'/oyunlar'}),NOW+5*DAY);}finally{Math.random=random;}
 assert.equal(db.sql.prepare("SELECT COUNT(*) AS n FROM site_visits WHERE visitor='old'").get().n,0);
});

test('the panel numbers: online now, today, 7 and 30 days, pages, sources, devices, countries, languages, guests to members',async()=>{
 const db=fakeDb();const at=(daysAgo,min=0)=>NOW-daysAgo*DAY+min*60000;
 // Today: three people (one member) — two on phones from Google, one on a computer directly; one is still on the site.
 await visits.recordVisit(db,visit({ip:'1.1.1.1',referrer:'https://www.google.com/'}),at(0,-60));
 await visits.recordVisit(db,visit({ip:'1.1.1.1',path:'/uye-ol',internal:true}),at(0,-59));
 await visits.recordVisit(db,visit({ip:'2.2.2.2',referrer:'https://www.google.com/',country:'AT'}),at(0,-30));
 db.sql.prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)').run('m1','ada@example.com','Ada','x',at(0,-58),at(0,-58),at(0,-58));
 await visits.recordVisit(db,visit({ip:'3.3.3.3',device:'computer',memberId:'m1',path:'/fiiller',language:'de'}),at(0,-2));
 // Yesterday: one guest from Instagram.
 await visits.recordVisit(db,visit({ip:'4.4.4.4',referrer:'https://l.instagram.com/',device:'tablet',country:'TR'}),at(1));
 const v=await vstats.loadVisits(db,NOW);
 assert.equal(v.online,1);assert.equal(v.onlineMembers,1);
 assert.equal(v.today.visitors,3);assert.equal(v.today.views,4);assert.equal(v.today.members,1);assert.equal(v.yesterday.visitors,1);
 assert.equal(v.week.visits,4);assert.equal(v.month.visits,4);assert.equal(v.days.length,30);assert.equal(v.days.at(-1).visitors,3);
 const pairs=(rows,keys)=>rows.map(r=>keys.map(k=>r[k]).join(':'));
 assert.equal(v.pages[0].name,'Ana sayfa');assert.deepEqual(pairs(v.pages,['name','visitors','views']).sort(),['Ana sayfa:3:3','Fiil Atölyesi:1:1','Üye ol:1:1']);
 assert.equal(v.sources[0].name,'Google');assert.deepEqual(pairs(v.sources,['name','visitors']).sort(),['Doğrudan (adres, yer imi, uygulama):1','Google:2','Instagram:1']);
 assert.equal(v.devices[0].name,'Telefon');assert.deepEqual(pairs(v.devices,['name','visitors']).sort(),['Bilgisayar:1','Tablet:1','Telefon:2']);
 assert.equal(v.countries[0].key,'DE');assert.ok(v.countries[0].name.includes('Almanya')||v.countries[0].name.includes('DE'));
 assert.deepEqual(v.languages.map(l=>l.key),['tr','de']);assert.equal(v.languages[0].name,'Türkçe (tr)');
 assert.deepEqual(v.funnel,{guests:3,signupPage:1,newMembers:1});
 // Members: who is on the site, and do new members come back?
 db.sql.prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)').run('m2','can@example.com','Can','x',at(10),at(10),at(10));
 db.sql.prepare('INSERT INTO member_logins (member_id,at) VALUES (?,?)').run('m2',at(1));
 db.sql.prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)').run('m3','eda@example.com','Eda','x',at(20),at(20),at(20));
 db.sql.prepare('INSERT INTO member_seen (member_id,at) VALUES (?,?)').run('m3',at(20,30));
 const h=await vstats.loadMemberHabits(db,NOW);
 assert.deepEqual(h.seen.map(m=>[m.name,m.online]),[['Ada',true],['Eda',false]]);
 assert.equal(h.newMembers,3);assert.equal(h.backEligible,2,'Ada joined today');assert.equal(h.cameBack,1,'Can came back, Eda only on her first day');
 assert.equal(h.weekEligible,2);assert.equal(h.weekLater,1,'Can came back 9 days later');
});

test('the signal, the endpoint, the panel and the privacy text',()=>{
 const layout=read('app/layout.tsx');assert.ok(layout.includes("import { VisitBeacon } from './visit-beacon';")&&layout.includes('<VisitBeacon/></body>'));
 const beacon=read('app/visit-beacon.tsx');
 assert.ok(beacon.includes("navigator.sendBeacon('/api/ziyaret'")&&!/localStorage|document\.cookie/.test(beacon),'no cookie, nothing kept in the browser');
 assert.ok(beacon.includes("referrer:internal?'':document.referrer"));
 const route=read('app/api/ziyaret/route.ts');
 for(const piece of ['if(origin&&origin!==own.origin)return done();','if(isBot(userAgent))return done();','if(user&&isAdminEmail(user.email))return done();','memberId:user?.userId??null',"request.headers.get('cf-ipcountry')"])assert.ok(route.includes(piece),piece);
 assert.ok(!/body\.(member|user|email)/.test(route),'the member comes from the checked session, never from the request');
 const sql=read('migration/database/members.sql');
 for(const table of ['site_visits','visit_salts','member_seen'])assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS '+table+' ('),table);
 assert.ok(!sql.split('\n').some(line=>/\S.*--/.test(line)&&!line.trim().startsWith('--')),'no comments after SQL on a line (the deploy drops comment lines only)');
 const page=read('app/yonetim/page.tsx');
 for(const piece of ['loadVisits(db,now),loadMemberHabits(db,now)','<Visitors v={visits} now={now}/>','<Habits h={habits} funnel={visits.funnel} now={now}/>','id="ziyaret"','id="davranis"','En çok açılan sayfalar','Nereden geldiler','Site dili','Şu an çevrimiçi','Misafirden üyeye'])assert.ok(page.includes(piece),piece);
 assert.ok(read('app/admin.css').includes('.adm-visit-chart .adm-bar-ok'));
 // The privacy page names it, in all 31 languages.
 assert.ok(read('app/privacy-view.tsx').includes("<li>{rich('whatVisits')}</li>"));
 const english=legal.legalText('en','whatVisits');
 for(const {id} of site.siteLanguages){
  const index=site.siteLanguageIndex(id);
  const text=index<6?legal.legalText(id,'whatVisits'):JSON.parse(read('lib/language-packs/'+id+'.json'))[english];
  assert.ok(text&&text.includes('{b}')&&text.includes('{/b}')&&/90|۹۰/.test(text),id);
  if(id!=='en')assert.notEqual(text,english,id+' is translated');
 }
});
