// Üyelik: şifre özeti, oturumlar, giriş kapısı ve üyelik API'si.
const {test}=require('node:test');const assert=require('node:assert/strict');const {DatabaseSync}=require('node:sqlite');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const auth=load('member-auth'),store=load('member-store'),gate=load('site-gate');

const SITE='https://goligo.test';
function fakeDb(){
 const sql=new DatabaseSync(':memory:');
 sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));
 sql.exec(fs.readFileSync('migration/database/members.sql','utf8'));
 // Her yayında yeniden çalıştırılır: ikinci kez çalışınca da hata vermemeli, kayıtlara dokunmamalı.
 sql.exec(fs.readFileSync('migration/database/members.sql','utf8'));
 const db={sql,broken:false,prepare(query){if(db.broken)throw new Error('database down');return{query,args:[],bind(...args){this.args=args;return this;},async first(){const row=sql.prepare(this.query).get(...this.args);return row?{...row}:null;},async all(){return {results:sql.prepare(this.query).all(...this.args).map(r=>({...r}))};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(list){sql.exec('BEGIN');try{const out=[];for(const item of list)out.push(await item.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 return db;
}
const count=(db,table,where='1=1',...args)=>Number(db.sql.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${where}`).get(...args).n);
function addStudy(db,user){
 const now=Date.now();
 db.sql.prepare('INSERT INTO study_sessions (id,user_id,mode,topic,questions,created_at) VALUES (?,?,?,?,?,?)').run('s-'+user,user,'mixed','all','[]',now);
 db.sql.prepare('INSERT INTO study_answers (id,user_id,session_id,question_id,answer,correct,created_at) VALUES (?,?,?,?,?,?,?)').run('a-'+user,user,'s-'+user,'q1','Tisch',1,now);
 db.sql.prepare('INSERT INTO study_review (user_id,question_id,wrong_count,streak,seen,last_answer,last_at,due_at) VALUES (?,?,?,?,?,?,?,?)').run(user,'q1',0,1,1,'Tisch',now,now);
 db.sql.prepare('INSERT INTO study_notes (user_id,key,value,updated_at) VALUES (?,?,?,?)').run(user,'profile','merhaba',now);
}
const cookieOf=response=>{const raw=response.headers.get('set-cookie')||'';const m=raw.match(/lk_session=([^;]*)/);return m?m[1]:null;};

test('e-posta, şifre ve ad kuralları',()=>{
 assert.equal(auth.normalizeEmail('  Koray@Example.COM '),'koray@example.com');assert.equal(auth.normalizeEmail(5),'');
 for(const ok of ['a@b.co','koray.coskun+lern@mail.example.test'])assert.ok(auth.validEmail(ok),ok);
 for(const bad of ['','koray','koray@','@x.de','a@b','a b@c.de','a@b..de','x@'+'y'.repeat(260)+'.de'])assert.ok(!auth.validEmail(bad),bad);
 assert.match(auth.passwordProblem('kurz'),/en az 8/);assert.match(auth.passwordProblem('x'.repeat(129)),/en fazla 128/);assert.match(auth.passwordProblem(undefined),/en az 8/);
 assert.match(auth.passwordProblem('        '),/boşluk/);assert.match(auth.passwordProblem('aaaaaaaaaa'),/tekrar/);assert.match(auth.passwordProblem('a@b.co.uk','a@b.co.uk'),/e-posta/);
 assert.equal(auth.passwordProblem('Lern-Koko 2026'),null);
 assert.equal(auth.cleanName('  Koray \n  Coşkun  '),'Koray Coşkun');assert.equal(auth.cleanName('<script>'),'script');assert.equal(auth.cleanName('   '),'');assert.equal(auth.cleanName(null),'');
 assert.equal(Array.from(auth.cleanName('ğ'.repeat(80))).length,60);
});

test('şifre özetlenir, açık hali saklanmaz; yanlış ya da bozuk özet eşleşmez',async()=>{
 const stored=await auth.hashPassword('Lern-Koko 2026');
 assert.match(stored,/^pbkdf2-sha256\$100000\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{43}$/);assert.ok(!stored.includes('Lern-Koko'));
 assert.ok(await auth.verifyPassword('Lern-Koko 2026',stored));assert.ok(!(await auth.verifyPassword('lern-koko 2026',stored)));
 assert.notEqual(await auth.hashPassword('Lern-Koko 2026'),stored,'her özetin tuzu ayrı');
 const quick=await auth.hashPassword('kısa-tur',1000);assert.ok(await auth.verifyPassword('kısa-tur',quick));
 const parts=stored.split('$');
 for(const bad of ['',stored.replace('pbkdf2-sha256','sha1'),[parts[0],'200000',parts[2],parts[3]].join('$'),[parts[0],'10',parts[2],parts[3]].join('$'),[parts[0],parts[1],'',parts[3]].join('$'),[parts[0],parts[1],parts[2],parts[3].slice(2)].join('$'),parts.slice(0,3).join('$')])assert.ok(!(await auth.verifyPassword('Lern-Koko 2026',bad)),bad);
 assert.ok(!(await auth.verifyPassword('anything',auth.DUMMY_HASH)));assert.ok(!(await auth.verifyPassword('',auth.DUMMY_HASH)));
 assert.ok(auth.sameBytes(new Uint8Array([1,2]),new Uint8Array([1,2])));assert.ok(!auth.sameBytes(new Uint8Array([1,2]),new Uint8Array([1,3])));assert.ok(!auth.sameBytes(new Uint8Array([1]),new Uint8Array([1,2])));
});

test('oturum anahtarı, çerez ve dönüş adresi',async()=>{
 const token=auth.newToken();assert.ok(auth.validToken(token));assert.notEqual(auth.newToken(),token);assert.ok(!auth.validToken('kısa'));assert.ok(!auth.validToken(null));
 assert.match(await auth.tokenHash(token),/^[0-9a-f]{64}$/);assert.equal(await auth.tokenHash(token),await auth.tokenHash(token));
 assert.match(auth.newMemberId(),/^member:[0-9a-f-]{36}$/);
 assert.equal(auth.readCookie('a=1; lk_session=abc; b=2','lk_session'),'abc');assert.equal(auth.readCookie('lk_session=a; lk_session=b','lk_session'),null,'aynı adla iki çereze güvenilmez');assert.equal(auth.readCookie('',"lk_session"),null);assert.equal(auth.readCookie('xlk_session=1','lk_session'),null);
 const set=auth.sessionCookie(token,true);assert.match(set,/HttpOnly/);assert.match(set,/SameSite=Lax/);assert.match(set,/Secure/);assert.match(set,/Max-Age=2592000/);assert.match(set,/Path=\//);
 assert.ok(!auth.sessionCookie(token,false).includes('Secure'));assert.match(auth.clearSessionCookie(true),/Max-Age=0/);
 assert.equal(auth.safeReturnTo('/fiiller?x=1#a'),'/fiiller?x=1#a');
 for(const bad of ['//evil.example','https://evil.example','/\\evil','fiiller','/giris','/uye-ol?return_to=/x','/cikis','/api/auth',null,5])assert.equal(auth.safeReturnTo(bad),'/',String(bad));
 assert.equal(auth.signInPath('/fiiller'),'/giris?return_to=%2Ffiiller');assert.equal(auth.signInPath('/'),'/giris');
 for(const open of ['/','/giris','/uye-ol','/sifre-yenile','/gizlilik','/kullanim-kosullari','/api/study','/api/auth','/favicon.svg','/verbs/abfahren.webp','/assets/app.js','/_next/x'])assert.ok(auth.isPublicPath(open),open);
 for(const closed of ['/fiiller','/ev-esyalar','/a1-2/ev-ve-yasam','/hesabim','/apis'])assert.ok(!auth.isPublicPath(closed),closed);
});

test('oturumlar: açılır, süresi dolar, kapanır; deneme sınırı pencere içinde sayılır',async()=>{
 const db=fakeDb();const now=Date.now();
 await store.createMember(db,{id:'member:1',email:'a@b.co',name:'Ada',passwordHash:'x'},now);
 const token=await store.createSession(db,'member:1',now);
 assert.equal((await store.memberForToken(db,token,now+1000)).email,'a@b.co');
 assert.equal(count(db,'member_sessions','id=?',token),0,'çerezdeki anahtar veritabanında açık durmaz');
 assert.equal(await store.memberForToken(db,token,now+auth.SESSION_MS+1),null,'30 gün sonra oturum geçersiz');
 assert.equal(await store.memberForToken(db,'x'.repeat(43),now),null);assert.equal(await store.memberForToken(db,null,now),null);
 await store.createSession(db,'member:1',now+auth.SESSION_MS+5);assert.equal(count(db,'member_sessions','member_id=?','member:1'),1,'süresi geçmiş oturumlar temizlenir');
 await store.deleteSession(db,token);assert.equal(await store.memberForToken(db,token,now),null);
 for(let i=0;i<3;i++)await store.countAttempt(db,'login:a@b.co',60000,now+i);
 assert.ok(await store.isLimited(db,'login:a@b.co',3,60000,now+10));assert.ok(!(await store.isLimited(db,'login:a@b.co',4,60000,now+10)));
 assert.ok(!(await store.isLimited(db,'login:a@b.co',3,60000,now+60001)),'pencere geçince sınır kalkar');
 await store.countAttempt(db,'login:a@b.co',60000,now+60001);assert.equal(count(db,'auth_attempts','key=? AND count=1','login:a@b.co'),1,'yeni pencerede sayım baştan');
 await store.countAttempt(db,'login-ip:1.2.3.4',60000,now);await store.countAttempt(db,'other',60000,now+store.ATTEMPT_KEEP_MS+70000);
 assert.equal(count(db,'auth_attempts','key=?','login-ip:1.2.3.4'),0,'bir günden eski sayaçlar (IP) silinir');
 await store.clearAttempts(db,'other');assert.equal(count(db,'auth_attempts','key=?','other'),0);
});

// ---- Giriş kapısı ----
const b64url=bytes=>Buffer.from(bytes).toString('base64url');const json64=value=>b64url(Buffer.from(JSON.stringify(value)));
async function accessTeam(name='members-test'){
 const team=`https://${name}.cloudflareaccess.com`;const AUD='aud-members';
 const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
 const jwk={...(await crypto.subtle.exportKey('jwk',pair.publicKey)),kid:'k1',alg:'RS256',use:'sig'};
 const fetcher=async()=>new Response(JSON.stringify({keys:[jwk]}),{headers:{'content-type':'application/json'}});
 async function token(sub='access-koray',email='koray@example.com'){const now=Math.floor(Date.now()/1000);const h=json64({alg:'RS256',kid:'k1',typ:'JWT'});const p=json64({aud:[AUD],iss:team,sub,email,iat:now,nbf:now,exp:now+600});const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(h+'.'+p));return h+'.'+p+'.'+b64url(new Uint8Array(sig));}
 return {settings:{TEAM_DOMAIN:team,POLICY_AUD:AUD},fetcher,token};
}
const req=(p,init={})=>new Request(SITE+p,init);
const location=r=>{assert.ok(r instanceof Response,'yönlendirme bekleniyordu');assert.equal(r.status,302);return r.headers.get('location');};

test('kapı: girişsiz ziyaretçi tanıtım ve yasal sayfaları görür, ders sayfaları girişe yönlenir',async()=>{
 const db=fakeDb();const env={DB:db};
 for(const open of ['/','/giris','/uye-ol','/sifre-yenile','/gizlilik','/kullanim-kosullari','/api/study','/api/auth','/verbs/abfahren.webp']){const out=await gate.siteGate(req(open),env);assert.ok(out instanceof Request,open);assert.equal(out.headers.get('oai-authenticated-user-id'),null,open);}
 assert.equal(location(await gate.siteGate(req('/fiiller'),env)),'/giris?return_to=%2Ffiiller');
 assert.equal(location(await gate.siteGate(req('/a1-2/ev-ve-yasam?x=1'),env)),'/giris?return_to=%2Fa1-2%2Fev-ve-yasam%3Fx%3D1');
 assert.equal(location(await gate.siteGate(req('/hesabim'),env)),'/giris?return_to=%2Fhesabim');
 const post=await gate.siteGate(req('/fiiller',{method:'POST',body:'x'}),env);assert.equal(post.status,401);
});

test('kapı: istemcinin yazdığı kimlik başlıklarına asla güvenilmez',async()=>{
 const db=fakeDb();const env={DB:db};
 const spoof={'oai-authenticated-user-id':'member:victim','oai-authenticated-user-email':'victim@example.com','lk-verified-access-id':'cf-access:victim','LK-Verified-Access-Email':'victim@example.com'};
 assert.equal(location(await gate.siteGate(req('/fiiller',{headers:spoof}),env)),'/giris?return_to=%2Ffiiller');
 const open=await gate.siteGate(req('/api/auth',{headers:spoof}),env);
 for(const name of Object.keys(spoof))assert.equal(open.headers.get(name),null,name);
 // Yalnızca yerel geliştirmede, Vite eklentisinin koyduğu deneme kimliği geçerlidir.
 const dev=await gate.siteGate(req('/fiiller',{headers:{'oai-authenticated-user-id':'local_seedy','oai-authenticated-user-email':'seedy@sites.test','oai-authenticated-user-full-name':'Seedy','lk-verified-access-id':'cf-access:x'}}),env,{devIdentity:true});
 assert.ok(dev instanceof Request);assert.equal(dev.headers.get('oai-authenticated-user-id'),'local_seedy');assert.equal(dev.headers.get('oai-authenticated-user-full-name'),'Seedy');assert.equal(dev.headers.get('lk-verified-access-id'),null);
});

test('kapı: geçerli üyelik oturumu kimliği verir; giriş ve çıkış adresleri yönlenir',async()=>{
 const db=fakeDb();const env={DB:db};const now=Date.now();
 await store.createMember(db,{id:'member:ada',email:'ada@example.com',name:'Ada Çınar',passwordHash:'x'},now);
 const token=await store.createSession(db,'member:ada',now);const cookie={cookie:'theme=1; lk_session='+token};
 const out=await gate.siteGate(req('/fiiller',{headers:{...cookie,'oai-authenticated-user-id':'member:victim'}}),env);
 assert.ok(out instanceof Request);assert.equal(out.headers.get('oai-authenticated-user-id'),'member:ada');assert.equal(out.headers.get('oai-authenticated-user-email'),'ada@example.com');
 assert.equal(decodeURIComponent(out.headers.get('oai-authenticated-user-full-name')),'Ada Çınar');assert.equal(out.headers.get('oai-authenticated-user-full-name-encoding'),'percent-encoded-utf-8');
 assert.equal(location(await gate.siteGate(req('/giris?return_to=%2Ffiiller',{headers:cookie}),env)),'/fiiller','üye giriş sayfasına gelirse kaldığı yere döner');
 assert.equal(location(await gate.siteGate(req('/uye-ol',{headers:cookie}),env)),'/');
 assert.equal(location(await gate.siteGate(req('/giris?return_to=%2F%2Fevil.example',{headers:cookie}),env)),'/');
 // Eski "ChatGPT ile giriş" adresleri.
 assert.equal(location(await gate.siteGate(req('/signin-with-chatgpt?return_to=%2Fev-esyalar'),env)),'/giris?return_to=%2Fev-esyalar');
 assert.equal(location(await gate.siteGate(req('/signin-with-chatgpt?return_to=%2Fev-esyalar',{headers:cookie}),env)),'/ev-esyalar');
 assert.equal(location(await gate.siteGate(req('/auth/login',{headers:{referer:SITE+'/a1-2/ev-ve-yasam'}}),env)),'/giris?return_to=%2Fa1-2%2Fev-ve-yasam');
 assert.equal(location(await gate.siteGate(req('/auth/login',{headers:{referer:'https://evil.example/x'}}),env)),'/giris');
 assert.equal(location(await gate.siteGate(req('/callback'),env)),'/');
 // Bozuk ya da süresi dolmuş çerez: girişsiz sayılır.
 assert.equal(location(await gate.siteGate(req('/fiiller',{headers:{cookie:'lk_session='+auth.newToken()}}),env)),'/giris?return_to=%2Ffiiller');
 assert.equal(location(await gate.siteGate(req('/fiiller',{headers:cookie}),env,{now:now+auth.SESSION_MS+1})),'/giris?return_to=%2Ffiiller');
 // Çıkış: oturum silinir, çerez temizlenir.
 const bye=await gate.siteGate(req('/cikis',{headers:cookie}),env);assert.equal(location(bye),'/');assert.match(bye.headers.get('set-cookie'),/lk_session=;.*Max-Age=0/);
 assert.equal(await store.memberForToken(db,token),null);
 assert.equal(location(await gate.siteGate(req('/signout-with-chatgpt'),env)),'/');
});

test('kapı: veritabanına ulaşılamazsa kimse içeri alınmaz',async()=>{
 const db=fakeDb();const token=await store.createSession(db,'member:x',Date.now());db.broken=true;
 const error=console.error;console.error=()=>{};
 try{assert.equal(location(await gate.siteGate(req('/fiiller',{headers:{cookie:'lk_session='+token}}),{DB:db})),'/giris?return_to=%2Ffiiller');}finally{console.error=error;}
});

test('kapı: geçiş dönemi — Access ile giren tanınır, üyelik oturumu önceliklidir',async()=>{
 const db=fakeDb();const team=await accessTeam();const env={DB:db,...team.settings};const jwt={'cf-access-jwt-assertion':await team.token()};
 const out=await gate.siteGate(req('/fiiller',{headers:jwt}),env,{fetcher:team.fetcher});
 assert.ok(out instanceof Request);assert.equal(out.headers.get('oai-authenticated-user-id'),'cf-access:access-koray');assert.equal(out.headers.get(gate.VERIFIED_ACCESS_ID),'cf-access:access-koray');assert.equal(out.headers.get(gate.VERIFIED_ACCESS_EMAIL),'koray@example.com');
 const reg=await gate.siteGate(req('/uye-ol',{headers:jwt}),env,{fetcher:team.fetcher});assert.ok(reg instanceof Request,'Access ile giren ama henüz üye olmayan kişi üye ol sayfasını görür');
 await store.createMember(db,{id:'member:other',email:'o@example.com',name:'O',passwordHash:'x'});const token=await store.createSession(db,'member:other');
 const both=await gate.siteGate(req('/fiiller',{headers:{...jwt,cookie:'lk_session='+token}}),env,{fetcher:team.fetcher});assert.equal(both.headers.get('oai-authenticated-user-id'),'member:other');
 const forged=(await team.token()).replace(/\.[^.]+$/,'.AAAA');
 assert.equal(location(await gate.siteGate(req('/fiiller',{headers:{'cf-access-jwt-assertion':forged}}),env,{fetcher:team.fetcher})),'/giris?return_to=%2Ffiiller');
 const error=console.error;console.error=()=>{};
 try{const other=await accessTeam('members-down');const down=async()=>new Response('down',{status:500});assert.equal(location(await gate.siteGate(req('/fiiller',{headers:{'cf-access-jwt-assertion':await other.token()}}),{DB:db,...other.settings},{fetcher:down})),'/giris?return_to=%2Ffiiller','Access servisi yoksa üyelikle devam edilir');}finally{console.error=error;}
 assert.equal(location(await gate.siteGate(req('/fiiller',{headers:jwt}),{DB:db},{fetcher:team.fetcher})),'/giris?return_to=%2Ffiiller','Access ayarı yoksa belge yok sayılır');
});

// ---- Üyelik API'si ----
function api(db,{mailer=null}={}){
 const source=ts.transpileModule(fs.readFileSync('app/api/auth/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,Response,Request,Headers,URL,console,Date,require(name){if(name==='@/db')return{getRawDb:()=>db,getMailer:()=>mailer};if(name==='@/lib/member-auth')return auth;if(name==='@/lib/member-store')return store;if(name==='@/lib/site-gate')return gate;if(name.startsWith('@/lib/'))return load(name.slice(6));throw Error(name);}});
 const call=async(body,{cookie,headers={},origin=SITE}={})=>{const h={'content-type':'application/json',...headers};if(origin)h.origin=origin;if(cookie)h.cookie='lk_session='+cookie;const r=await module.exports.POST(new Request(SITE+'/api/auth',{method:'POST',headers:h,body:JSON.stringify(body)}));return {r,status:r.status,body:await r.clone().json().catch(()=>null),cookie:cookieOf(r)};};
 const get=async(query='',cookie)=>module.exports.GET(new Request(SITE+'/api/auth'+query,{headers:cookie?{cookie:'lk_session='+cookie}:{}}));
 return {call,get};
}
const newUser={action:'register',name:'Ada Çınar',email:'Ada@Example.com ',password:'Lern-Koko 2026',accept:true,returnTo:'/fiiller'};

test('API: üye olma kuralları, oturum çerezi ve aynı e-postayla ikinci hesap',async()=>{
 const db=fakeDb();const {call,get}=api(db);
 assert.equal((await call(newUser,{origin:null})).status,403,'kaynağı belirsiz istek reddedilir');
 assert.equal((await call(newUser,{origin:'https://evil.example'})).status,403);
 const bad=async(change,field)=>{const out=await call({...newUser,...change});assert.equal(out.status,400,JSON.stringify(change));assert.equal(out.body.field,field);assert.equal(out.cookie,null);};
 await bad({name:'  '},'name');await bad({email:'ada'},'email');await bad({password:'kısa'},'password');await bad({password:'ada@example.com'},'password');await bad({accept:false},'accept');await bad({accept:'true'},'accept');
 assert.equal(count(db,'members'),0);
 const ok=await call(newUser);assert.equal(ok.status,201);assert.equal(ok.body.returnTo,'/fiiller');assert.ok(ok.cookie);
 assert.match(ok.r.headers.get('set-cookie'),/HttpOnly/);assert.match(ok.r.headers.get('set-cookie'),/Secure/);
 const row=db.sql.prepare('SELECT * FROM members').get();assert.equal(row.email,'ada@example.com');assert.equal(row.name,'Ada Çınar');assert.match(row.id,/^member:/);assert.ok(row.terms_accepted_at>0);
 assert.ok(!row.password_hash.includes('Lern-Koko'),'şifre açık saklanmaz');assert.ok(await auth.verifyPassword('Lern-Koko 2026',row.password_hash));
 const me=await (await get('',ok.cookie)).json();assert.deepEqual({name:me.member.name,email:me.member.email},{name:'Ada Çınar',email:'ada@example.com'});
 assert.equal((await (await get('')).json()).member,null);
 const again=await call({...newUser,email:'ADA@example.com',name:'Başka'});assert.equal(again.status,409);assert.equal(count(db,'members'),1);
 assert.equal((await call({...newUser,returnTo:'//evil.example'},{})).status,409);
 const other=await call({...newUser,email:'b@example.com',returnTo:'https://evil.example'});assert.equal(other.body.returnTo,'/');
 assert.equal((await call({action:'nope'})).status,400);assert.equal((await call([1])).status,400);
});

test('API: giriş, yanlış şifre, deneme sınırı ve çıkış',async()=>{
 const db=fakeDb();const {call}=api(db);const first=await call(newUser);
 const wrong=await call({action:'login',email:'ada@example.com',password:'yanlis-sifre'});assert.equal(wrong.status,401);assert.equal(wrong.body.error,'E-posta ya da şifre yanlış.');
 const unknown=await call({action:'login',email:'yok@example.com',password:'yanlis-sifre'});assert.equal(unknown.status,401);assert.equal(unknown.body.error,wrong.body.error,'kayıtlı olmayan e-posta aynı cevabı alır');
 const ok=await call({action:'login',email:' ADA@example.com',password:'Lern-Koko 2026',returnTo:'/ev-esyalar'},{cookie:first.cookie});
 assert.equal(ok.status,200);assert.equal(ok.body.returnTo,'/ev-esyalar');assert.ok(ok.cookie);assert.notEqual(ok.cookie,first.cookie);
 assert.equal(await store.memberForToken(db,first.cookie),null,'girişte eski oturum kapanır');assert.equal((await store.memberForToken(db,ok.cookie)).email,'ada@example.com');
 for(let i=0;i<10;i++)assert.equal((await call({action:'login',email:'ada@example.com',password:'yanlis-'+i})).status,401);
 const blocked=await call({action:'login',email:'ada@example.com',password:'Lern-Koko 2026'});assert.equal(blocked.status,429,'10 hatalı denemeden sonra doğru şifre de bekletilir');assert.equal(blocked.cookie,null);
 db.sql.prepare('UPDATE auth_attempts SET window_start=window_start-16*60*1000').run();
 assert.equal((await call({action:'login',email:'ada@example.com',password:'Lern-Koko 2026'})).status,200,'15 dakika sonra yeniden denenebilir');
 const out=await call({action:'logout'},{cookie:ok.cookie});assert.equal(out.status,200);assert.match(out.r.headers.get('set-cookie'),/Max-Age=0/);assert.equal(await store.memberForToken(db,ok.cookie),null);
 assert.equal((await call({action:'profile',name:'X'},{cookie:ok.cookie})).status,401);
});

test('API: geçiş dönemi — Access ile giren kişi üye olunca eski kayıtları hesabında kalır',async()=>{
 const db=fakeDb();const {call}=api(db);addStudy(db,'cf-access:koray');
 const koray=await call({...newUser,email:'koray@example.com'},{headers:{[gate.VERIFIED_ACCESS_ID]:'cf-access:koray'}});
 assert.equal(koray.status,201);assert.equal((await store.memberForToken(db,koray.cookie)).id,'cf-access:koray');
 const second=await call({...newUser,email:'ikinci@example.com'},{headers:{[gate.VERIFIED_ACCESS_ID]:'cf-access:koray'}});
 assert.equal(second.status,201);assert.match((await store.memberForToken(db,second.cookie)).id,/^member:/,'aynı Access kimliği ikinci hesaba bağlanmaz');
 const odd=await call({...newUser,email:'ucuncu@example.com'},{headers:{[gate.VERIFIED_ACCESS_ID]:'member:victim'}});assert.match((await store.memberForToken(db,odd.cookie)).id,/^member:[0-9a-f-]{36}$/);
});

test('API: ad ve şifre değiştirme, verilerimi indir, hesabı silme',async()=>{
 const db=fakeDb();const {call,get}=api(db);const reg=await call(newUser);const id=(await store.memberForToken(db,reg.cookie)).id;addStudy(db,id);addStudy(db,'someone-else');
 const other=await store.createSession(db,id);
 const named=await call({action:'profile',name:'  Ada  Ç. '},{cookie:reg.cookie});assert.equal(named.status,200);assert.equal(named.body.name,'Ada Ç.');
 assert.equal((await call({action:'profile',name:''},{cookie:reg.cookie})).status,400);
 assert.equal((await call({action:'password',current:'yanlis-sifre',next:'Yeni-Sifre 2026'},{cookie:reg.cookie})).status,401);
 assert.equal((await call({action:'password',current:'Lern-Koko 2026',next:'kısa'},{cookie:reg.cookie})).body.field,'next');
 assert.equal((await call({action:'password',current:'Lern-Koko 2026',next:'Lern-Koko 2026'},{cookie:reg.cookie})).body.field,'next');
 const changed=await call({action:'password',current:'Lern-Koko 2026',next:'Yeni-Sifre 2026'},{cookie:reg.cookie});
 assert.equal(changed.status,200);assert.ok(changed.cookie);
 assert.equal(await store.memberForToken(db,other),null,'diğer cihazlardaki oturumlar kapanır');assert.equal(await store.memberForToken(db,reg.cookie),null);
 assert.equal((await call({action:'login',email:'ada@example.com',password:'Lern-Koko 2026'})).status,401);
 const session=changed.cookie;
 const file=await get('?export=1',session);assert.equal(file.status,200);assert.match(file.headers.get('content-disposition'),/attachment/);
 const data=await file.json();assert.equal(data.member.email,'ada@example.com');assert.equal(data.answers.length,1);assert.equal(data.notes[0].value,'merhaba');assert.ok(!JSON.stringify(data).includes('pbkdf2'),'dökümde şifre özeti yok');
 assert.equal((await get('?export=1')).status,401);
 assert.equal((await call({action:'delete',current:'Yeni-Sifre 2026'},{cookie:session})).body.field,'confirm');
 assert.equal((await call({action:'delete',current:'yanlis',confirm:true},{cookie:session})).status,401);
 assert.equal(count(db,'members'),1);
 const gone=await call({action:'delete',current:'Yeni-Sifre 2026',confirm:true},{cookie:session});assert.equal(gone.status,200);assert.match(gone.r.headers.get('set-cookie'),/Max-Age=0/);
 for(const table of ['study_sessions','study_answers','study_review','study_notes'])assert.equal(count(db,table,'user_id=?',id),0,table);
 assert.equal(count(db,'members'),0);assert.equal(count(db,'member_sessions'),0);assert.equal(count(db,'study_answers','user_id=?','someone-else'),1,'başkasının kayıtlarına dokunulmaz');
 assert.equal((await call({action:'login',email:'ada@example.com',password:'Yeni-Sifre 2026'})).status,401);
});

test('API: veritabanı yoksa açık bir hata verir',async()=>{
 const db=fakeDb();db.broken=true;const {call,get}=api(db);const error=console.error;console.error=()=>{};
 try{assert.equal((await call(newUser)).status,503);assert.equal((await get('',auth.newToken())).status,503);assert.equal((await get('')).status,200,'çerez yoksa veritabanına gerek yok');}finally{console.error=error;}
});

test('sayfalar ve yayın: tablolar her yayında güvenle kurulur, giriş kapısı yerelde de çalışır',()=>{
 const deploy=fs.readFileSync('ci/yayin.sh','utf8');assert.ok(deploy.includes('migration/database/members.sql'),'yayında üyelik tabloları kurulur');
 const sql=fs.readFileSync('migration/database/members.sql','utf8');assert.ok(!/DROP|DELETE|ALTER/i.test(sql.replace(/--.*$/gm,'')),'yeniden çalıştırmak hiçbir kaydı silmez');
 assert.equal((sql.match(/CREATE (TABLE|INDEX) IF NOT EXISTS/g)||[]).length,(sql.match(/CREATE /g)||[]).length);
 assert.ok(fs.readFileSync('ci/kurulum.sh','utf8').includes('members.sql'));
 const worker=fs.readFileSync('build/sites-worker.ts','utf8');assert.ok(worker.includes('siteGate(request, env, { devIdentity: import.meta.env.DEV })'));assert.ok(!worker.includes('if (!import.meta.env.DEV)'),'kapı yerelde de çalışır');
 for(const page of ['app/giris/page.tsx','app/uye-ol/page.tsx','app/hesabim/page.tsx','app/gizlilik/page.tsx','app/kullanim-kosullari/page.tsx'])assert.ok(fs.existsSync(page),page);
 assert.ok(fs.readFileSync('app/page.tsx','utf8').includes('Landing'),'girişsiz ana sayfa tanıtımı gösterir');
});

test('API: every message comes with a code, so the page shows it in its own language',async()=>{
 const db=fakeDb();const {call}=api(db);const copy=require(path.join(compiled,'public-copy.js'));
 const codes=new Set();const note=out=>{assert.ok(copy.isAuthCode(out.body.code),JSON.stringify(out.body));codes.add(out.body.code);return out;};
 note(await call({...newUser,name:' '}));note(await call({...newUser,email:'ada'}));note(await call({...newUser,accept:false}));
 const short=note(await call({...newUser,password:'kısa'}));assert.equal(short.body.code,'pwShort');assert.equal(short.body.n,8);assert.match(short.body.error,/en az 8/,'the Turkish text stays for older pages');
 assert.equal(note(await call({...newUser,password:'ada@example.com'})).body.code,'pwEmail');
 await call(newUser);assert.equal(note(await call(newUser)).body.code,'errTaken');
 assert.equal(note(await call({action:'login',email:'ada@example.com',password:'yanlis-sifre'})).body.code,'errWrongLogin');
 assert.equal(note(await call({action:'login',email:'',password:''})).body.code,'errMissingLogin');
 assert.equal(note(await call({action:'nope'})).body.code,'errBadRequest');
 assert.equal(note(await call({action:'profile',name:'X'})).body.code,'errSignedOut');
 // Each code has its text, with {n} only where a number is sent.
 for(const code of copy.AUTH_CODES)assert.ok(copy.publicText('de',code).trim(),code);
 assert.equal(copy.fillText(copy.publicText('de','pwShort'),{n:8}),'Das Passwort muss mindestens 8 Zeichen lang sein.');
 assert.ok(codes.size>=9);
});

// ---- Şifremi unuttum (the learner asked once the site had its own address goliqo.com) ----
const keyOf=mail=>{const link=mail.text.match(/https:\/\/\S+/)[0];return {link,key:new URL(link).searchParams.get('anahtar')};};

test('API: şifremi unuttum — tek kullanımlık, 1 saat geçerli bağlantı e-postayla gider; yeni şifreyle giriş yapılır',async()=>{
 const db=fakeDb();const sent=[];const mailer={async send(message){sent.push(message);return {messageId:'m'+sent.length};}};
 const {call}=api(db,{mailer});const reg=await call(newUser);const id=(await store.memberForToken(db,reg.cookie)).id;const elsewhere=await store.createSession(db,id);
 // Kayıtlı olmayan adres de aynı cevabı alır; e-posta gitmez.
 const unknown=await call({action:'forgot',email:'yok@example.com',language:'de'});assert.equal(unknown.status,200);assert.deepEqual(unknown.body,{ok:true});assert.equal(sent.length,0);
 assert.equal((await call({action:'forgot',email:'ada'})).body.code,'errEmail');
 assert.equal((await call({action:'forgot',email:'ada@example.com'},{origin:'https://evil.example'})).status,403);
 const asked=await call({action:'forgot',email:' ADA@example.com',language:'de'});assert.deepEqual(asked.body,{ok:true});assert.equal(sent.length,1);
 const mail=sent[0];assert.equal(mail.to,'ada@example.com');assert.equal(mail.from,'noreply@goliqo.com');assert.equal(mail.subject,'Goliqo: Passwort zurücksetzen');
 assert.ok(mail.text.startsWith('Hallo Ada Çınar,\n')&&mail.text.includes('1 Stunde gültig'));assert.ok(mail.html.includes('<html lang="de" dir="ltr">')&&!mail.html.includes('<script'));
 const first=keyOf(mail);assert.ok(first.link.startsWith(SITE+'/sifre-yenile?anahtar='));assert.ok(auth.validToken(first.key));
 assert.equal(count(db,'password_resets','id=?',first.key),0,'anahtarın kendisi saklanmaz');assert.equal(count(db,'password_resets'),1);
 // Arapça sayfadan istenince e-posta Arapça ve sağdan sola.
 await call({action:'forgot',email:'ada@example.com',language:'ar'});assert.ok(sent[1].html.includes('<html lang="ar" dir="rtl">'));
 const second=keyOf(sent[1]);assert.equal(count(db,'password_resets'),1,'yeni bağlantı eskisinin yerine geçer');
 assert.equal((await call({action:'reset',token:first.key,password:'Yeni-Sifre 2026'})).body.code,'errResetLink','eski bağlantı çalışmaz');
 assert.equal((await call({action:'reset',token:second.key,password:'kısa'})).body.code,'pwShort');
 assert.equal((await call({action:'reset',token:second.key,password:'ada@example.com'})).body.code,'pwEmail');
 const done=await call({action:'reset',token:second.key,password:'Yeni-Sifre 2026'});assert.equal(done.status,200);assert.equal(done.body.returnTo,'/');assert.ok(done.cookie);
 assert.equal((await store.memberForToken(db,done.cookie)).email,'ada@example.com','bu cihaz giriş yapmış olur');
 assert.equal(await store.memberForToken(db,elsewhere),null,'başka cihazlardaki oturumlar kapanır');assert.equal(await store.memberForToken(db,reg.cookie),null);
 assert.equal((await call({action:'reset',token:second.key,password:'Baska-Sifre 2026'})).body.code,'errResetLink','bağlantı tek kullanımlık');
 assert.equal((await call({action:'login',email:'ada@example.com',password:'Lern-Koko 2026'})).status,401);
 assert.equal((await call({action:'login',email:'ada@example.com',password:'Yeni-Sifre 2026'})).status,200);
 // Dil gelmezse sayfanın dil çerezi, o da yoksa Almanca.
 const third=await call({action:'forgot',email:'ada@example.com'},{headers:{cookie:'goligo-dil=tr'}});assert.equal(third.status,200);assert.equal(sent[2].subject,'Goliqo: şifreni yenile');
 db.sql.prepare('UPDATE password_resets SET expires_at=?').run(Date.now()-1);
 assert.equal((await call({action:'reset',token:keyOf(sent[2]).key,password:'Ucuncu-Sifre 2026'})).body.code,'errResetLink','1 saat sonra geçersiz');
 // Bir adrese saatte en fazla 3 e-posta.
 assert.equal((await call({action:'forgot',email:'ada@example.com'})).status,429);assert.equal(sent.length,3);
 db.sql.prepare("UPDATE auth_attempts SET window_start=window_start-61*60*1000 WHERE key LIKE 'forgot%'").run();
 assert.equal((await call({action:'forgot',email:'ada@example.com'})).status,200,'bir saat sonra yeniden');assert.equal(sent.length,4);assert.equal(sent[3].subject,'Goliqo: Passwort zurücksetzen');
 // Hesap silinince bağlantıları da silinir.
 const me=await call({action:'login',email:'ada@example.com',password:'Yeni-Sifre 2026'});
 await call({action:'delete',current:'Yeni-Sifre 2026',confirm:true},{cookie:me.cookie});assert.equal(count(db,'password_resets'),0);
});

test('API: şifremi unuttum — e-posta gönderilemezse açık hata; yanlış anahtarlar sınırlanır',async()=>{
 const db=fakeDb();const {call}=api(db);await call(newUser);const error=console.error;console.error=()=>{};
 try{
  assert.equal((await call({action:'forgot',email:'ada@example.com'})).body.code,'errService','kayıtlı adreste e-posta gidemezse söylenir');
  assert.equal((await call({action:'forgot',email:'yok@example.com'})).status,200);
 }finally{console.error=error;}
 for(let i=0;i<20;i++)assert.equal((await call({action:'reset',token:auth.newToken(),password:'Yeni-Sifre 2026'})).body.code,'errResetLink');
 assert.equal((await call({action:'reset',token:auth.newToken(),password:'Yeni-Sifre 2026'})).status,429,'20 yanlış anahtardan sonra bekletilir');
});

test('pages: "Şifremi unuttum" form on the sign in page, the link page, the email binding only in the deployed build',()=>{
 const signIn=fs.readFileSync('app/giris/page.tsx','utf8');assert.ok(signIn.includes('<ForgotForm language={language} texts={forgotFormTexts(language)}/>')&&!signIn.includes("p('noReset')"));
 const page=fs.readFileSync('app/sifre-yenile/page.tsx','utf8');
 assert.ok(page.includes("referrer:'no-referrer'")&&page.includes('robots:{index:false,follow:false}')&&page.includes('validToken(token)')&&page.includes('<ResetForm token={token} texts={resetFormTexts(language)}/>'));
 assert.ok(fs.readFileSync('app/forgot-form.tsx','utf8').includes("JSON.stringify({action:'forgot',email,language})"));
 assert.ok(fs.readFileSync('app/reset-form.tsx','utf8').includes("JSON.stringify({action:'reset',token,password})"));
 assert.ok(fs.readFileSync('vite.config.ts','utf8').includes('...(productionDatabaseId ? { send_email: [{ name: "EMAIL" }] } : {}),'));
 assert.ok(fs.readFileSync('db/index.ts','utf8').includes('export function getMailer(): Mailer | null'));
 assert.ok(fs.readFileSync('app/privacy-view.tsx','utf8').includes("<li>{rich('whatReset')}</li>"));
});
