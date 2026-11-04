// Kim ne yaptı (site sahibi istedi, 4 Kasım 2026: "hangi üye hangi sayfalarda gezinmiş, ne yapmış; ziyaretçi olsa
// bile"): üyelerin açtığı sayfalar hesaba bağlı (90 gün, hesapla silinir) ve testleri; misafirler o günün anahtarıyla,
// yalnızca sayfalar. Gizlilik metni 31 dilde söyler.
const {test}=require('node:test');const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const visits=load('visits'),vstats=load('visit-stats'),store=load('member-store'),legal=load('legal-copy'),site=load('site-languages');
const read=file=>fs.readFileSync(file,'utf8');
function fakeDb(){
 const sql=new DatabaseSync(':memory:');
 sql.exec(read('drizzle/0000_heavy_brood.sql'));
 sql.exec(read('migration/database/members.sql'));sql.exec(read('migration/database/members.sql'));
 return {sql,prepare(query){return{query,args:[],bind(...args){this.args=args;return this;},async first(){const row=sql.prepare(this.query).get(...this.args);return row?{...row}:null;},async all(){return {results:sql.prepare(this.query).all(...this.args).map(r=>({...r}))};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(list){sql.exec('BEGIN');try{const out=[];for(const item of list)out.push(await item.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
}
const MIN=60000;const NOW=Date.UTC(2026,10,4,12,0);
const PHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1';
const PC='Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15';
const visit=(over={})=>({path:'/',referrer:'',internal:false,device:'phone',language:'tr',ip:'203.0.113.7',userAgent:PHONE,country:'DE',host:'goliqo.com',memberId:null,...over});

test('a member\'s pages and tests, a visitor\'s pages: each in order, the latest person first',async()=>{
 const db=fakeDb();
 db.sql.prepare("INSERT INTO members (id,name,email,password_hash,created_at,terms_accepted_at) VALUES ('m1','Ayşe','ayse@example.test','x',?,?)").run(NOW-10*86400000,NOW-10*86400000);
 // A visitor from WhatsApp opens the home page and the verbs; Ayşe (signed in, another device) opens pages and starts a test.
 await visits.recordVisit(db,visit({path:'/',referrer:'https://web.whatsapp.com/'}),NOW-50*MIN);
 await visits.recordVisit(db,visit({path:'/fiiller',internal:true}),NOW-49*MIN);
 await visits.recordVisit(db,visit({path:'/',memberId:'m1',ip:'198.51.100.2',userAgent:PC,device:'computer'}),NOW-30*MIN);
 await visits.recordVisit(db,visit({path:'/ev-esyalar?kat=mutfak',memberId:'m1',ip:'198.51.100.2',userAgent:PC,device:'computer',internal:true}),NOW-29*MIN);
 await visits.recordVisit(db,visit({path:'/ev-esyalar',memberId:'m1',ip:'198.51.100.2',userAgent:PC,device:'computer',internal:true}),NOW-29*MIN+2000);
 db.sql.prepare("INSERT INTO study_sessions (id,user_id,mode,topic,questions,created_at,finished_at) VALUES ('s1','m1','write','objects-kitchen',?,?,?)").run(JSON.stringify(['a','b','c','d']),NOW-28*MIN,NOW-20*MIN);
 for(const [i,ok] of [[0,1],[1,1],[2,0],[3,1]].entries())db.sql.prepare("INSERT INTO study_answers (id,user_id,session_id,question_id,answer,correct,created_at) VALUES (?,?,?,?,?,?,?)").run('a'+i,'m1','s1','q'+i,'x',ok[1],NOW-27*MIN+i*MIN);
 const pages=db.sql.prepare('SELECT member_id,path FROM member_pages ORDER BY at').all().map(r=>r.member_id+' '+r.path);
 assert.deepEqual(pages,['m1 /','m1 /ev-esyalar'],'only signed-in pages are tied to the member; a repeat within 10 s once; no query');
 const j=await vstats.loadJourneys(db,NOW);
 assert.equal(j.members.length,1);const m=j.members[0];
 assert.equal(m.name,'Ayşe');assert.equal(m.memberId,'m1');assert.equal(m.pages,2);assert.equal(m.rounds,1);
 assert.deepEqual(m.steps.map(s=>s.kind+':'+s.text),['page:Ana sayfa','page:Kelime Kasası','round:Test: '+load('admin-stats').topicName('objects-kitchen')+' · '+load('admin-stats').modeName('write')]);
 assert.match(m.steps[2].note,/4 \/ 4 cevap · %75 doğru · bitirdi/);
 assert.equal(j.guests.length,1,'the member\'s own visits are not shown again as a visitor');const g=j.guests[0];
 assert.match(g.name,/^Ziyaretçi #[0-9a-f]{4}$/);assert.deepEqual(g.steps.map(s=>s.text),['Ana sayfa','Fiil Atölyesi']);
 assert.match(g.meta,/Telefon/);assert.match(g.meta,/kaynak: WhatsApp/);
 assert.ok(!JSON.stringify(j).includes('203.0.113.7'),'no IP address anywhere');
 // The member page shows the same, day by day.
 const own=await vstats.loadMemberJourneys(db,'m1',NOW);assert.equal(own.length,1);assert.equal(own[0].steps.length,3);
 // Gone with the account.
 await store.deleteMember(db,'m1','ayse@example.test');
 assert.equal(db.sql.prepare('SELECT COUNT(*) AS n FROM member_pages').get().n,0);
});

test('the panel has the section, the member page the daily list; the privacy page says it in 31 languages',()=>{
 const page=read('app/yonetim/page.tsx');
 for(const piece of ['loadJourneys(db,now)','<WhoDidWhat j={journeys} now={now}/>','id="kim-ne-yapti"','<a href="#kim-ne-yapti">Kim ne yaptı</a>','loadMemberJourneys(db,memberId,now)','id="gezinti"','<JourneyList rows={journeys} now={now} openFirst/>'])assert.ok(page.includes(piece),piece);
 assert.ok(read('lib/member-store.ts').includes("db.prepare('DELETE FROM member_pages WHERE member_id=?').bind(memberId),"));
 assert.ok(read('migration/database/members.sql').includes('CREATE TABLE IF NOT EXISTS member_pages ('));
 assert.ok(read('app/privacy-view.tsx').includes("<li>{rich('whatVisits')}</li>\n    <li>{rich('whatJourneys')}</li>"));
 const english=legal.legalText('en','whatJourneys');
 for(const {id} of site.siteLanguages){
  const index=site.siteLanguageIndex(id);
  const text=index<6?legal.legalText(id,'whatJourneys'):JSON.parse(read('lib/language-packs/'+id+'.json'))[english];
  assert.ok(text&&text.startsWith('{b}')&&text.includes('{/b}')&&/90|۹۰/.test(text),id);
  if(id!=='en')assert.notEqual(text,english,id+' is translated');
 }
});
