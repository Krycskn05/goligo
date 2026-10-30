import {getRawDb} from '@/db';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {SYNC_LESSONS,SYNC_LESSON_MAX,SYNC_REQUEST_MAX,cleanItems,mergeItems,parseStored,type SyncItems,type SyncLesson} from '@/lib/lesson-sync';

export const dynamic='force-dynamic';
const noCache={'Cache-Control':'no-store'};
function json(data:unknown,status=200){return Response.json(data,{status,headers:noCache});}

/**
 * Lesson progress on every device (lib/lesson-sync.ts, app/lesson-sync.tsx; the learner asked, 30 October 2026).
 * POST {lessons:{l1:{key:{v,t}},l12:…,l15:…}} merges this browser's keys into the member's (study_notes rows
 * `sync:l1`, `sync:l12`, `sync:l15`) and answers {lessons:{…}} with the merged keys. An empty list only reads.
 * Members only: the user comes from the server-checked session, never from the request.
 */
export async function POST(request:Request){
 try{
  const user=(await getChatGPTUser())?.userId;
  if(!user)return json({error:'İlerlemeni kaydetmek için giriş yap.',signIn:true},401);
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Geçersiz istek.'},403);
  if(Number(request.headers.get('content-length')??0)>SYNC_REQUEST_MAX)return json({error:'İstek çok büyük.'},413);
  const text=await request.text();if(text.length>SYNC_REQUEST_MAX)return json({error:'İstek çok büyük.'},413);
  let body:{lessons?:Record<string,unknown>};
  try{body=JSON.parse(text) as {lessons?:Record<string,unknown>};}catch{return json({error:'Geçersiz istek.'},400);}
  const lessons=body&&typeof body.lessons==='object'&&body.lessons?body.lessons:{};
  const db=getRawDb();const now=Date.now();
  const rows=await db.prepare('SELECT key,value FROM study_notes WHERE user_id=? AND key IN (?,?,?)').bind(user,...SYNC_LESSONS.map(lesson=>'sync:'+lesson)).all<{key:string;value:string}>();
  const stored=new Map(rows.results.map(row=>[row.key,row.value]));
  const out={} as Record<SyncLesson,SyncItems>;const writes:D1PreparedStatement[]=[];
  for(const lesson of SYNC_LESSONS){
   const kept=parseStored(lesson,stored.get('sync:'+lesson));
   const incoming=cleanItems(lesson,lessons[lesson]);
   const merged=Object.keys(incoming).length?mergeItems(kept,incoming,now):kept;
   const before=JSON.stringify({items:kept});const value=JSON.stringify({items:merged});
   if(value.length>SYNC_LESSON_MAX){out[lesson]=kept;continue;}
   if(value!==before)writes.push(db.prepare('INSERT INTO study_notes (user_id,key,value,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at').bind(user,'sync:'+lesson,value,now));
   out[lesson]=merged;
  }
  if(writes.length)await db.batch(writes);
  return json({lessons:out});
 }catch(error){console.error('Lesson sync failed',error);return json({error:'İlerleme şu anda kaydedilemedi.'},503);}
}
