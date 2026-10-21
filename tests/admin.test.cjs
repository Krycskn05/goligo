// Yönetici paneli: yalnızca site sahibi görür; üyelerin girişleri, çalışmaları ve yanlışları doğru sayılır.
const {test}=require('node:test');const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const stats=load('admin-stats'),access=load('admin-access'),store=load('member-store');
const read=file=>fs.readFileSync(file,'utf8');

function fakeDb(){
 const sql=new DatabaseSync(':memory:');
 sql.exec(read('drizzle/0000_heavy_brood.sql'));
 sql.exec(read('migration/database/members.sql'));sql.exec(read('migration/database/members.sql'));
 const db={sql,prepare(query){return{query,args:[],bind(...args){this.args=args;return this;},async first(){const row=sql.prepare(this.query).get(...this.args);return row?{...row}:null;},async all(){return {results:sql.prepare(this.query).all(...this.args).map(r=>({...r}))};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(list){sql.exec('BEGIN');try{const out=[];for(const item of list)out.push(await item.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 return db;
}
const DAY=86400000;const NOW=Date.UTC(2026,9,20,12,0);
let n=0;
function answer(db,user,question,given,correct,at,session='s-'+user){db.sql.prepare('INSERT INTO study_answers (id,user_id,session_id,question_id,answer,correct,created_at) VALUES (?,?,?,?,?,?,?)').run('a'+(n++),user,session,question,given,correct?1:0,at);}
function seed(){
 const db=fakeDb();
 db.sql.prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)').run('m1','ada@example.com','Ada','x',NOW-40*DAY,NOW-40*DAY,NOW-2*3600000);
 db.sql.prepare('INSERT INTO members (id,email,name,password_hash,created_at,terms_accepted_at,last_login_at) VALUES (?,?,?,?,?,?,?)').run('m2','can@example.com','Can','x',NOW-3*DAY,NOW-3*DAY,NOW-3*DAY);
 for(const at of [NOW-2*3600000,NOW-DAY,NOW-5*DAY])db.sql.prepare('INSERT INTO member_logins (member_id,at) VALUES (?,?)').run('m1',at);
 db.sql.prepare('INSERT INTO member_logins (member_id,at) VALUES (?,?)').run('m2',NOW-3*DAY);
 db.sql.prepare('INSERT INTO study_sessions (id,user_id,mode,topic,questions,created_at,finished_at) VALUES (?,?,?,?,?,?,?)').run('s-m1','m1','workshop','verbs-1','[{"id":"verb-perfekt-abfahren"},{"id":"verb-meaning-abfahren"},{"id":"obj-picture-bad"}]',NOW-3600000,null);
 db.sql.prepare('INSERT INTO study_sessions (id,user_id,mode,topic,questions,created_at,finished_at) VALUES (?,?,?,?,?,?,?)').run('s-m2','m2','visual','objects-house','[]',NOW-3*DAY,NOW-3*DAY+60000);
 answer(db,'m1','verb-perfekt-abfahren','hat abgefahren',false,NOW-3600000);
 answer(db,'m1','verb-perfekt-abfahren','ist abgefahren',true,NOW-3500000);
 answer(db,'m1','verb-meaning-abfahren','abfahren',true,NOW-3400000);
 answer(db,'m1','obj-picture-bad','das Bad',true,NOW-10*DAY);
 answer(db,'m2','verb-perfekt-abfahren','hat abgefahren',false,NOW-3*DAY,'s-m2');
 answer(db,'m2','obj-picture-bad','der Bad',false,NOW-3*DAY,'s-m2');
 answer(db,'old-user','housing-11-a-word-haus','das Haus',true,NOW-90*DAY,'s-old');
 db.sql.prepare('INSERT INTO study_review (user_id,question_id,wrong_count,streak,seen,last_answer,last_wrong,last_at,due_at) VALUES (?,?,?,?,?,?,?,?,?)').run('m1','verb-perfekt-abfahren',1,1,2,'ist abgefahren','hat abgefahren',NOW-3500000,NOW);
 return db;
}

test('only the site owner may open the panel; everyone else sees no records',()=>{
 assert.ok(access.isAdminEmail('kooraycoskun@gmail.com'));assert.ok(access.isAdminEmail('  KoorayCoskun@Gmail.com '));
 assert.ok(access.isAdminEmail('koraycoskun@hotmail.com'));assert.ok(access.isAdminEmail(' KorayCoskun@Hotmail.com '));
 for(const other of ['','ada@example.com','kooraycoskun@gmail.com.evil.test','koraycoskun@gmail.com','kooraycoskun@hotmail.com',null,undefined,42])assert.ok(!access.isAdminEmail(other),String(other));
 const page=read('app/yonetim/page.tsx');
 const guard=page.indexOf('if(!isAdminEmail(user.email))return');
 assert.ok(guard>0&&guard<page.indexOf('getRawDb()'),'no database read before the e-mail check');
 assert.ok(page.includes("if(!user)redirect(signInPath('/yonetim'));")&&page.includes('robots:{index:false,follow:false}')&&page.includes("export const dynamic='force-dynamic';"));
 assert.ok(!read('lib/member-auth.ts').match(/PUBLIC_PAGES = new Set\([^)]*yonetim/),'the panel is not a public page');
 // The way in: a button on Hesabım, for the owner only.
 const account=read('app/hesabim/page.tsx');
 assert.ok(account.includes('{isAdminEmail(member.email)&&<p className="adm-entry"><a className="btn" href="/yonetim">{p(\'adminPanel\')}</a></p>}'));
 assert.ok(read('lib/public-copy.ts').includes("adminPanel:['Yönetici paneli',"));
 assert.ok(read('app/layout.tsx').includes('import "./admin.css";'));
});

test('every login is recorded for 90 days and removed with the account; members can download their own',async()=>{
 const db=fakeDb();
 await store.createMember(db,{id:'mx',email:'x@example.com',name:'X',passwordHash:'h'},NOW-100*DAY);
 db.sql.prepare('INSERT INTO member_logins (member_id,at) VALUES (?,?)').run('mx',NOW-91*DAY);
 await store.createSession(db,'mx',NOW);await store.createSession(db,'mx',NOW+60000);
 assert.deepEqual(db.sql.prepare('SELECT at FROM member_logins WHERE member_id=? ORDER BY at').all('mx').map(r=>r.at),[NOW,NOW+60000],'older than 90 days is gone');
 const exported=await store.exportMember(db,{id:'mx',email:'x@example.com',name:'X',created_at:NOW,last_login_at:NOW});
 assert.deepEqual(exported.logins,[new Date(NOW).toISOString(),new Date(NOW+60000).toISOString()]);
 await store.deleteMember(db,'mx','x@example.com');
 assert.equal(db.sql.prepare('SELECT COUNT(*) AS n FROM member_logins').get().n,0);
 assert.ok(!/DROP|DELETE|ALTER/i.test(read('migration/database/members.sql').replace(/--.*$/gm,'')));
 // The privacy notice (in every site language, lib/legal-copy.ts) tells members.
 const legal=read('lib/legal-copy.ts'),privacy=read('app/privacy-view.tsx');
 assert.ok(legal.includes('Giriş zamanların:')&&legal.includes('yönetici panelinde görebilir'),'the privacy page tells members');
 assert.ok(privacy.includes("rich('whatSignins')")&&privacy.includes("text('whyAdmin')"));
});

test('the overview counts members, learners, logins and answers per Berlin day',async()=>{
 const db=seed();const o=await stats.loadOverview(db,NOW);
 assert.deepEqual([o.members,o.new7,o.new30],[2,1,1]);
 assert.deepEqual([o.learnersToday,o.learners7,o.learners30,o.learnersEver],[1,2,2,3]);
 assert.deepEqual([o.answers,o.correct,o.sessions,o.logins7],[7,4,2,4]);
 assert.equal(o.days.length,30);const today=o.days.at(-1);
 assert.deepEqual([today.answers,today.correct,today.learners,today.logins],[3,2,1,1]);
 assert.equal(o.days.reduce((s,d)=>s+d.newMembers,0),1);
 // Berlin is UTC+2 in October: 23:30 UTC already belongs to the next day there.
 assert.equal(stats.dayNumber(Date.UTC(2026,9,20,23,30),stats.zoneOffsetMs(NOW)),stats.dayNumber(Date.UTC(2026,9,21,8),stats.zoneOffsetMs(NOW)));
 const areas=await stats.loadAreas(db);
 assert.deepEqual(areas.map(a=>[a.name,a.answers,a.correct,a.learners]),[['Ev ve Yaşam',1,1,1],['Nesne Kasası',2,1,2],['Fiil Atölyesi',4,2,2]]);
});

test('the member list has every member and older accounts, newest activity first',async()=>{
 const rows=await stats.loadMembers(seed(),NOW);
 assert.deepEqual(rows.map(r=>[r.id,r.name,r.legacy,r.logins,r.answers,r.correct,r.activeDays]),[
  ['m1','Ada',false,3,4,3,2],['m2','Can',false,1,2,0,1],['old-user','Eski hesap',true,0,1,1,1]]);
 assert.deepEqual([rows[0].mainArea,rows[2].mainArea],['Fiil Atölyesi','Ev ve Yaşam'],'the part with the most answers');
});

test('the hardest questions show the right answer and the wrong answers given most often',async()=>{
 const top=await stats.loadTopMistakes(seed());
 assert.equal(top[0].id,'verb-perfekt-abfahren');
 assert.deepEqual([top[0].wrong,top[0].total,top[0].learners,top[0].answer,top[0].areaName,top[0].task],[2,3,2,'ist abgefahren','Fiil Atölyesi','Perfekt']);
 assert.deepEqual(top[0].wrongAnswers,[{answer:'hat abgefahren',n:2}]);
 assert.equal(top[0].prompt,'abfahren · Perfekt: sie/er …','the prompt without the | of separable verbs');
 assert.deepEqual(top.map(q=>q.id),['verb-perfekt-abfahren','obj-picture-bad']);
 assert.equal(stats.questionInfo('unknown-id').prompt,'unknown-id');
});

test('one member: logins, days, parts, tests, wrong answers and hardest questions',async()=>{
 const db=seed();const m=await stats.loadMember(db,'m1',NOW);
 assert.equal(m.name,'Ada');assert.equal(m.email,'ada@example.com');assert.equal(m.legacy,false);
 assert.deepEqual(m.logins,[NOW-2*3600000,NOW-DAY,NOW-5*DAY]);
 assert.deepEqual([m.answers,m.correct,m.activeDays,m.firstStudyAt,m.lastStudyAt],[4,3,2,NOW-10*DAY,NOW-3400000]);
 assert.equal(m.days.length,60);assert.deepEqual([m.days.at(-1).answers,m.days.at(-1).logins],[3,1]);
 assert.deepEqual(m.mistakes.map(q=>[q.id,q.given,q.answer]),[['verb-perfekt-abfahren','hat abgefahren','ist abgefahren']]);
 assert.deepEqual(m.hardest.map(q=>[q.id,q.wrongCount,q.lastWrong]),[['verb-perfekt-abfahren',1,'hat abgefahren']]);
 assert.deepEqual(m.sessions.map(s=>[s.id,s.answered,s.correct,s.questions,stats.topicName(s.topic),stats.modeName(s.mode)]),[['s-m1',4,3,3,'Fiiller 1','Fiil Atölyesi']]);
 const old=await stats.loadMember(db,'old-user',NOW);assert.equal(old.legacy,true);assert.equal(old.name,'Eski hesap');
 assert.equal(await stats.loadMember(db,'nobody',NOW),null);assert.equal(await stats.loadMember(db,'x'.repeat(300),NOW),null);
 const recent=await stats.loadSessions(db,10);assert.deepEqual(recent.map(s=>[s.id,s.name]),[['s-m1','Ada'],['s-m2','Can']]);
});

test('times are written in Berlin time',()=>{
 assert.equal(stats.formatTime(Date.UTC(2026,9,20,12,5)),'20.10.2026 14:05');
 assert.equal(stats.formatTime(null),'—');
 assert.equal(stats.ago(NOW-3*DAY,NOW),'3 gün önce');assert.equal(stats.ago(NOW-5*60000,NOW),'5 dk önce');
 assert.equal(stats.percent(3,4),75);assert.equal(stats.percent(0,0),0);
});
