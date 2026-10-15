import {getRawDb} from '@/db';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {gradeAnswer,questionMap,modeLabels,learningTopics as topics,shuffle} from '@/lib/course';
import {selectQuestions,STAR_NOTE_PREFIX,type Review,type SessionQuestion} from '@/lib/study';

export const dynamic='force-dynamic';
const noCache={'Cache-Control':'no-store'};
function json(data:unknown,status=200){return Response.json(data,{status,headers:noCache});}
function failure(error:unknown){console.error('Study persistence failed',error);return json({error:'Kayıtlarına şu anda ulaşılamıyor. Cevabını koruduk; biraz sonra yeniden dene.'},503);}
async function identity(){const user=await getChatGPTUser();return user?.userId??null;}
// Study totals for XP, level, daily goal and day streak. tz is Date#getTimezoneOffset() in minutes.
async function loadStats(db:D1Database,user:string,english:boolean,rawOffset:string|null){
 const parsed=Number(rawOffset??0);const offset=Number.isInteger(parsed)&&Math.abs(parsed)<=840?parsed:0;const shift=offset*60000;const now=Date.now();
 const course="((?=1 AND question_id LIKE 'en-%') OR (?=0 AND question_id NOT LIKE 'en-%'))";const flag=english?1:0;
 const [totals,days]=await Promise.all([
  db.prepare('SELECT COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct FROM study_answers WHERE user_id=? AND '+course).bind(user,flag,flag).first<{answers:number;correct:number}>(),
  db.prepare('SELECT CAST((created_at-?)/86400000 AS INTEGER) AS day,COUNT(*) AS answers,COALESCE(SUM(correct),0) AS correct FROM study_answers WHERE user_id=? AND created_at>=? AND '+course+' GROUP BY day ORDER BY day DESC LIMIT 400').bind(shift,user,now-400*86400000,flag,flag).all<{day:number;answers:number;correct:number}>()
 ]);
 return {answers:Number(totals?.answers??0),correct:Number(totals?.correct??0),days:days.results.map(row=>({day:Number(row.day),answers:Number(row.answers),correct:Number(row.correct)})),today:Math.floor((now-shift)/86400000)};
}
async function loadSession(db:D1Database,user:string,id:string){
 const row=await db.prepare('SELECT * FROM study_sessions WHERE id=? AND user_id=?').bind(id,user).first<Record<string,unknown>>();
 if(!row)return null;
 const {results}=await db.prepare('SELECT id,question_id,answer,correct,created_at FROM study_answers WHERE session_id=? AND user_id=? ORDER BY created_at,id').bind(id,user).all();
 return {...row,topic:String(row.topic),user_id:undefined,questions:JSON.parse(row.questions as string),answers:results};
}
export async function GET(request:Request){
 try{
  const user=await identity();if(!user)return json({error:'Kayıtlarını görmek için ChatGPT hesabınla giriş yap.',signIn:true},401);
  const db=getRawDb();const url=new URL(request.url);const id=url.searchParams.get('session');const english=url.searchParams.get('learn')==='en';
  if(id){const session=await loadSession(db,user,id);return session&&String(session.topic).startsWith('en-')===english?json({session}):json({error:'Test bulunamadı.'},404);}
  const [reviews,notes,sessions,activePicture,activeVerb]=await Promise.all([
   db.prepare('SELECT question_id,wrong_count,streak,seen,last_answer,last_wrong,last_at,due_at FROM study_review WHERE user_id=?').bind(user).all(),
   db.prepare('SELECT key,value FROM study_notes WHERE user_id=?').bind(user).all<{key:string;value:string}>(),
   db.prepare("SELECT s.id,s.mode,s.topic,s.created_at,s.finished_at,s.questions,COUNT(a.id) AS answered,COALESCE(SUM(a.correct),0) AS correct FROM study_sessions s LEFT JOIN study_answers a ON a.session_id=s.id AND a.user_id=s.user_id WHERE s.user_id=? AND ((?=1 AND s.topic LIKE 'en-%') OR (?=0 AND s.topic NOT LIKE 'en-%')) GROUP BY s.id ORDER BY s.created_at DESC LIMIT 40").bind(user,english?1:0,english?1:0).all<Record<string,unknown>>(),
   db.prepare("SELECT id FROM study_sessions WHERE user_id=? AND mode IN ('visual','write','listen') AND topic LIKE ? AND finished_at IS NULL ORDER BY created_at DESC LIMIT 1").bind(user,english?'en-objects-%':'objects-%').first<{id:string}>(),
   english?Promise.resolve(null):db.prepare("SELECT id FROM study_sessions WHERE user_id=? AND mode='workshop' AND topic LIKE 'verbs-%' AND finished_at IS NULL ORDER BY created_at DESC LIMIT 1").bind(user).first<{id:string}>()
  ]);
  const stats=url.searchParams.get('stats')==='1'?await loadStats(db,user,english,url.searchParams.get('tz')):undefined;
  return json({stats,reviews:(reviews.results as Review[]).filter(r=>r.question_id.startsWith('en-')===english),notes:Object.fromEntries(notes.results.map(n=>[n.key,n.value])),activePictureSessionId:activePicture?.id??null,activeVerbSessionId:activeVerb?.id??null,sessions:sessions.results.map(s=>({...s,questions:undefined,total:JSON.parse(s.questions as string).length}))});
 }catch(error){return failure(error);}
}
export async function POST(request:Request){
 try{
  const user=await identity();if(!user)return json({error:'İlerlemeni kaydetmek için ChatGPT hesabınla giriş yap.',signIn:true},401);
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Geçersiz istek.'},403);
  if(Number(request.headers.get('content-length')??0)>24000)return json({error:'Metin çok uzun.'},413);
  const body=await request.json() as Record<string,unknown>;const db=getRawDb();const now=Date.now();
  if(body.action==='start'){
   const id=typeof body.id==='string'?body.id:'';const mode=String(body.mode??'mixed');const english=body.course==='en';const requestedTopic=String(body.topic??'all');const topic=english&&requestedTopic==='all'?'en-all':requestedTopic;
   const count=Number(body.count??20);if(!/^[a-zA-Z0-9-]{16,64}$/.test(id)||!modeLabels[mode]||!['all','unit-1','unit-8','unit-9',...topics.map(t=>t.id)].includes(topic)||(topic!=='all'&&topic.startsWith('en-')!==english)||!Number.isInteger(count)||count<1||count>2000)return json({error:'Test seçenekleri geçersiz.'},400);
   const existing=await loadSession(db,user,id);if(existing)return existing.topic.startsWith('en-')===english?json({session:existing}):json({error:'Testin eğitim dili farklı.'},409);
   const {results:reviews}=await db.prepare('SELECT * FROM study_review WHERE user_id=?').bind(user).all<Review>();
   const onlyIds=Array.isArray(body.onlyIds)?body.onlyIds.filter((x):x is string=>typeof x==='string'&&questionMap.has(x)).slice(0,2000):undefined;
   const picked=selectQuestions(mode,topic,count,reviews,onlyIds,english?'en':'de');if(!picked.length)return json({error:mode==='review'?'Tekrar bekleyen yanlışın yok. Karma tekrar yapabilirsin.':'Bu konu için seçtiğin türde soru yok. Başka bir tür seç.'},400);
   const items:SessionQuestion[]=picked.map(q=>({id:q.id,...(q.options?{options:shuffle(q.options)}:{})}));
   await db.prepare('INSERT INTO study_sessions (id,user_id,mode,topic,questions,created_at) VALUES (?,?,?,?,?,?)').bind(id,user,mode,topic,JSON.stringify(items),now).run();
   return json({session:await loadSession(db,user,id)},201);
  }
  if(body.action==='answer'){
   const sessionId=String(body.sessionId??'');const questionId=String(body.questionId??'');const answer=typeof body.answer==='string'?body.answer.trim():'';
   if(!answer||answer.length>1500)return json({error:'Bir cevap yaz veya bir şık seç.'},400);
   const row=await db.prepare('SELECT questions,finished_at FROM study_sessions WHERE id=? AND user_id=?').bind(sessionId,user).first<{questions:string;finished_at:number|null}>();
   if(!row)return json({error:'Test bulunamadı.'},404);
   const order=JSON.parse(row.questions) as SessionQuestion[];if(!order.some(q=>q.id===questionId))return json({error:'Soru bu testte yok.'},400);
   const q=questionMap.get(questionId);if(!q)return json({error:'Soru bulunamadı.'},404);
   const answerId=sessionId+':'+questionId;
   const saved=await db.prepare('SELECT id,question_id,answer,correct,created_at FROM study_answers WHERE id=? AND user_id=?').bind(answerId,user).first();
   if(saved)return json({result:saved,correctAnswer:q.answer,explanation:q.explanation});
   if(row.finished_at)return json({error:'Bu test tamamlandı.'},409);
   const answered=await db.prepare('SELECT COUNT(*) AS n FROM study_answers WHERE session_id=? AND user_id=?').bind(sessionId,user).first<{n:number}>();
   if(order[answered?.n??0]?.id!==questionId)return json({error:'Test ilerlemesi değişti. Sayfayı yenileyerek devam et.'},409);
   // A saved round keeps the choices it was shown, even if the catalogue changed later.
   const shown=order.find(item=>item.id===questionId)?.options??q.options;
   if(shown&&!shown.includes(answer))return json({error:'Geçerli bir şık seç.'},400);
   const correct=gradeAnswer(q,answer)?1:0;
   // The insert and review update share one transaction. changes() prevents duplicate retries from inflating counts.
   const interval='CASE WHEN study_review.streak+1=1 THEN 86400000 WHEN study_review.streak+1=2 THEN 259200000 ELSE 604800000 END';
   await db.batch([
    db.prepare('INSERT OR IGNORE INTO study_answers (id,user_id,session_id,question_id,answer,correct,created_at) VALUES (?,?,?,?,?,?,?)').bind(answerId,user,sessionId,questionId,answer,correct,now),
    db.prepare(`INSERT INTO study_review (user_id,question_id,wrong_count,streak,seen,last_answer,last_wrong,last_at,due_at) SELECT ?,?,?,?,?,?,?,?,? WHERE changes()=1 ON CONFLICT(user_id,question_id) DO UPDATE SET wrong_count=study_review.wrong_count+excluded.wrong_count,streak=CASE WHEN excluded.wrong_count=0 THEN study_review.streak+1 ELSE 0 END,seen=study_review.seen+1,last_answer=excluded.last_answer,last_wrong=CASE WHEN excluded.wrong_count=1 THEN excluded.last_wrong ELSE study_review.last_wrong END,last_at=excluded.last_at,due_at=CASE WHEN excluded.wrong_count=1 THEN excluded.last_at ELSE excluded.last_at+${interval} END`).bind(user,questionId,1-correct,correct,1,answer,correct?'':answer,now,correct?now+86400000:now),
    db.prepare('UPDATE study_sessions SET finished_at=? WHERE id=? AND user_id=? AND (SELECT COUNT(*) FROM study_answers WHERE session_id=? AND user_id=?)>=?').bind(now,sessionId,user,sessionId,user,order.length)
   ]);
   const result=await db.prepare('SELECT id,question_id,answer,correct,created_at FROM study_answers WHERE id=? AND user_id=?').bind(answerId,user).first();
   return json({result,correctAnswer:q.answer,explanation:q.explanation});
  }
  if(body.action==='note'){
   const key=String(body.key??'');const value=typeof body.value==='string'?body.value:'';
   const starred=key.startsWith(STAR_NOTE_PREFIX)?key.slice(STAR_NOTE_PREFIX.length):'';
   const star=!!starred&&(questionMap.has(starred)||questionMap.has(starred+'-test'))&&(value===''||value==='1');
   if(!(key==='profile'||star||(key.startsWith('lesson:')&&topics.some(t=>'lesson:'+t.id===key)))||value.length>10000)return json({error:'Geçersiz çalışma kaydı.'},400);
   await db.prepare('INSERT INTO study_notes (user_id,key,value,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at').bind(user,key,value,now).run();
   return json({saved:true});
  }
  return json({error:'İşlem tanınmadı.'},400);
 }catch(error){return failure(error);}
}
