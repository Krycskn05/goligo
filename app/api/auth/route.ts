// Üyelik API'si: üye ol, giriş yap, çıkış, şifremi unuttum (e-postayla yenileme), ad ve şifre değiştir, hesabı sil,
// verilerimi indir.
// Kimlik yalnızca HttpOnly oturum çerezinden (lk_session) okunur; istemcinin gönderdiği
// kimlik başlıklarına güvenilmez (lib/site-gate.ts onları zaten siler).
import {getMailer,getRawDb} from '@/db';
import {DUMMY_HASH,SESSION_COOKIE,cleanName,clearSessionCookie,hashPassword,newMemberId,normalizeEmail,passwordIssue,passwordProblem,readCookie,safeReturnTo,sessionCookie,validEmail,verifyPassword} from '@/lib/member-auth';
import {clearAttempts,countAttempt,createMember,createPasswordReset,createSession,deleteMember,deleteMemberSessions,deleteSession,exportMember,finishPasswordReset,isLimited,memberByEmail,memberById,memberForReset,memberForToken,setMemberName,setPasswordHash,type Db} from '@/lib/member-store';
import {resetLink,resetMail} from '@/lib/reset-mail';
import {requestLanguage} from '@/lib/device-language';
import {isSiteLanguage} from '@/lib/site-languages';
import {VERIFIED_ACCESS_ID} from '@/lib/site-gate';

export const dynamic='force-dynamic';

const MINUTE=60*1000;
const LOGIN_WINDOW=15*MINUTE;
const LOGIN_EMAIL_LIMIT=10;
const LOGIN_IP_LIMIT=30;
const REGISTER_WINDOW=60*MINUTE;
const REGISTER_IP_LIMIT=30;
const ACCOUNT_LIMIT=10;
// Şifremi unuttum: bir adrese saatte en fazla 3 e-posta, bir bağlantıdan (IP) saatte 10 istek; yanlış bağlantı denemesi
// 15 dakikada 20.
const FORGOT_WINDOW=60*MINUTE;
const FORGOT_EMAIL_LIMIT=3;
const FORGOT_IP_LIMIT=10;
const RESET_IP_LIMIT=20;
const ACTIONS=new Set(['register','login','logout','forgot','reset','profile','password','delete']);

function json(data:unknown,status=200,cookie?:string){
 const headers=new Headers({'Cache-Control':'no-store'});
 if(cookie)headers.append('Set-Cookie',cookie);
 return Response.json(data,{status,headers});
}
function failure(error:unknown){console.error('Üyelik işlemi yapılamadı',error);return json({error:'Üyelik servisine şu anda ulaşılamıyor. Biraz sonra yeniden dene.',code:'errService'},503);}
const tooMany=()=>json({error:'Çok fazla deneme yapıldı. Biraz bekleyip yeniden dene.',code:'errTooMany'},429);
const signedOut=()=>json({error:'Oturumun kapanmış. Yeniden giriş yap.',code:'errSignedOut',signIn:true},401);
const database=()=>getRawDb() as unknown as Db;
const text=(value:unknown)=>typeof value==='string'?value:'';
const sessionToken=(request:Request)=>readCookie(request.headers.get('cookie'),SESSION_COOKIE);

export async function GET(request:Request){
 try{
  const db=database();const url=new URL(request.url);
  const member=await memberForToken(db,sessionToken(request));
  if(url.searchParams.get('export')==='1'){
   if(!member)return signedOut();
   return new Response(JSON.stringify(await exportMember(db,member),null,2),{headers:{'Content-Type':'application/json; charset=utf-8','Content-Disposition':'attachment; filename="goliqo-verilerim.json"','Cache-Control':'no-store'}});
  }
  return json({member:member?{name:member.name,email:member.email,createdAt:member.created_at}:null});
 }catch(error){return failure(error);}
}

export async function POST(request:Request){
 const url=new URL(request.url);
 if(request.headers.get('origin')!==url.origin)return json({error:'Geçersiz istek.',code:'errBadRequest'},403);
 if(Number(request.headers.get('content-length')??0)>8000)return json({error:'İstek çok büyük.',code:'errTooBig'},413);
 let body:Record<string,unknown>;
 try{const parsed=await request.json();if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('body');body=parsed as Record<string,unknown>;}catch{return json({error:'Geçersiz istek.',code:'errBadRequest'},400);}
 if(typeof body.action!=='string'||!ACTIONS.has(body.action))return json({error:'Geçersiz istek.',code:'errBadRequest'},400);
 try{
  const db=database();const secure=url.protocol==='https:';const now=Date.now();
  const ip=request.headers.get('cf-connecting-ip')?.trim()||'local';const token=sessionToken(request);

  if(body.action==='register'){
   const name=cleanName(body.name);const email=normalizeEmail(body.email);const password=text(body.password);
   if(!name)return json({error:'Adını yaz.',code:'errName',field:'name'},400);
   if(!validEmail(email))return json({error:'Geçerli bir e-posta adresi yaz.',code:'errEmail',field:'email'},400);
   const issue=passwordIssue(password,email);if(issue)return json({error:passwordProblem(password,email),code:issue.code,n:issue.n,field:'password'},400);
   if(body.accept!==true)return json({error:'Üye olmak için kullanım koşullarını ve gizlilik metnini kabul etmelisin.',code:'errAccept',field:'accept'},400);
   const ipKey='register:'+ip;
   if(await isLimited(db,ipKey,REGISTER_IP_LIMIT,REGISTER_WINDOW,now))return tooMany();
   await countAttempt(db,ipKey,REGISTER_WINDOW,now);
   const taken=()=>json({error:'Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.',code:'errTaken',field:'email'},409);
   if(await memberByEmail(db,email))return taken();
   // Geçiş dönemi: Cloudflare Access ile girmiş kişi üye olunca eski kayıtları yeni hesabında kalır.
   const accessId=request.headers.get(VERIFIED_ACCESS_ID);
   const id=accessId&&accessId.startsWith('cf-access:')&&!(await memberById(db,accessId))?accessId:newMemberId();
   const passwordHash=await hashPassword(password);
   try{await createMember(db,{id,email,name,passwordHash},now);}
   catch(error){if(await memberByEmail(db,email))return taken();throw error;}
   const session=await createSession(db,id,now);
   return json({ok:true,returnTo:safeReturnTo(body.returnTo)},201,sessionCookie(session,secure));
  }

  if(body.action==='login'){
   const email=normalizeEmail(body.email);const password=text(body.password);
   if(!validEmail(email)||!password)return json({error:'E-posta adresini ve şifreni yaz.',code:'errMissingLogin'},400);
   const emailKey='login:'+email;const ipKey='login-ip:'+ip;
   if(await isLimited(db,emailKey,LOGIN_EMAIL_LIMIT,LOGIN_WINDOW,now)||await isLimited(db,ipKey,LOGIN_IP_LIMIT,LOGIN_WINDOW,now))return tooMany();
   const member=await memberByEmail(db,email);
   // Kayıtlı olmayan e-postada da aynı hesaplama yapılır; cevap süresi hesabın varlığını ele vermez.
   const matches=await verifyPassword(password,member?.password_hash??DUMMY_HASH);
   if(!member||!matches){
    await countAttempt(db,emailKey,LOGIN_WINDOW,now);await countAttempt(db,ipKey,LOGIN_WINDOW,now);
    return json({error:'E-posta ya da şifre yanlış.',code:'errWrongLogin'},401);
   }
   await clearAttempts(db,emailKey);
   if(token)await deleteSession(db,token);
   const session=await createSession(db,member.id,now);
   return json({ok:true,returnTo:safeReturnTo(body.returnTo)},200,sessionCookie(session,secure));
  }

  if(body.action==='logout'){
   if(token)await deleteSession(db,token);
   return json({ok:true},200,clearSessionCookie(secure));
  }

  // Şifremi unuttum: kayıtlı adrese 1 saat geçerli, tek kullanımlık bir bağlantı gider (lib/reset-mail.ts).
  if(body.action==='forgot'){
   const email=normalizeEmail(body.email);
   if(!validEmail(email))return json({error:'Geçerli bir e-posta adresi yaz.',code:'errEmail',field:'email'},400);
   const emailKey='forgot:'+email;const ipKey='forgot-ip:'+ip;
   if(await isLimited(db,emailKey,FORGOT_EMAIL_LIMIT,FORGOT_WINDOW,now)||await isLimited(db,ipKey,FORGOT_IP_LIMIT,FORGOT_WINDOW,now))return tooMany();
   await countAttempt(db,emailKey,FORGOT_WINDOW,now);await countAttempt(db,ipKey,FORGOT_WINDOW,now);
   const member=await memberByEmail(db,email);
   if(member){
    const mailer=getMailer();if(!mailer)throw new Error('E-posta gönderimi (EMAIL bağlantısı) yok');
    const language=isSiteLanguage(body.language)?body.language:requestLanguage(request.headers.get('cookie'),request.headers.get('accept-language'));
    const resetToken=await createPasswordReset(db,member.id,now);
    await mailer.send(await resetMail(language,member.email,member.name,resetLink(url.origin,resetToken)));
   }
   // Hesap olsun olmasın aynı cevap: adresin kayıtlı olup olmadığı buradan anlaşılmaz.
   return json({ok:true});
  }

  // E-postadaki bağlantıyla yeni şifre: kaydedilince bütün oturumlar ve bağlantılar kapanır, bu cihaz giriş yapmış olur.
  if(body.action==='reset'){
   const ipKey='reset-ip:'+ip;
   if(await isLimited(db,ipKey,RESET_IP_LIMIT,LOGIN_WINDOW,now))return tooMany();
   const password=text(body.password);
   const member=await memberForReset(db,text(body.token),now);
   if(!member){
    await countAttempt(db,ipKey,LOGIN_WINDOW,now);
    return json({error:'Bu bağlantı geçersiz ya da süresi dolmuş. Giriş sayfasından yeni bir bağlantı iste.',code:'errResetLink'},400);
   }
   const issue=passwordIssue(password,member.email);if(issue)return json({error:passwordProblem(password,member.email),code:issue.code,n:issue.n,field:'password'},400);
   await finishPasswordReset(db,member.id,await hashPassword(password));
   await clearAttempts(db,'login:'+member.email);
   if(token)await deleteSession(db,token);
   const session=await createSession(db,member.id,now);
   return json({ok:true,returnTo:'/'},200,sessionCookie(session,secure));
  }

  // Bundan sonrası yalnızca giriş yapmış üye içindir.
  const member=await memberForToken(db,token,now);
  if(!member)return signedOut();

  if(body.action==='profile'){
   const name=cleanName(body.name);if(!name)return json({error:'Adını yaz.',code:'errName',field:'name'},400);
   await setMemberName(db,member.id,name);
   return json({ok:true,name});
  }

  if(body.action==='password'||body.action==='delete'){
   const key=(body.action==='delete'?'delete:':'password:')+member.id;
   if(await isLimited(db,key,ACCOUNT_LIMIT,LOGIN_WINDOW,now))return tooMany();
   const stored=await memberById(db,member.id);const current=text(body.current);
   if(body.action==='password'){
    const next=text(body.next);
    const issue=passwordIssue(next,member.email);if(issue)return json({error:passwordProblem(next,member.email),code:issue.code,n:issue.n,field:'next'},400);
    if(next===current)return json({error:'Yeni şifre eskisinden farklı olmalı.',code:'errSamePassword',field:'next'},400);
   }else if(body.confirm!==true)return json({error:'Silmeyi onaylamak için kutuyu işaretle.',code:'errConfirm',field:'confirm'},400);
   if(!stored||!current||!(await verifyPassword(current,stored.password_hash))){
    await countAttempt(db,key,LOGIN_WINDOW,now);
    return json({error:'Şu anki şifren yanlış.',code:'errCurrent',field:'current'},401);
   }
   await clearAttempts(db,key);
   if(body.action==='delete'){
    await deleteMember(db,member.id,member.email);
    return json({ok:true},200,clearSessionCookie(secure));
   }
   await setPasswordHash(db,member.id,await hashPassword(text(body.next)));
   // Şifre değişince başka cihazlardaki oturumlar kapanır; bu cihaz yeni bir oturumla devam eder.
   await deleteMemberSessions(db,member.id);
   const session=await createSession(db,member.id,now);
   return json({ok:true},200,sessionCookie(session,secure));
  }

  return json({error:'Geçersiz istek.',code:'errBadRequest'},400);
 }catch(error){return failure(error);}
}
