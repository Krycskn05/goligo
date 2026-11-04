import {getRawDb} from '@/db';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {isAdminEmail} from '@/lib/admin-access';
import {VISIT_REQUEST_MAX,isBot,recordVisit} from '@/lib/visits';
import type {Db} from '@/lib/member-store';

export const dynamic='force-dynamic';
const done=()=>new Response(null,{status:204,headers:{'Cache-Control':'no-store'}});

/**
 * Ziyaret sinyali (app/visit-beacon.tsx → lib/visits.ts; yönetici panelinin ziyaret bölümleri, 4 Kasım 2026).
 * POST {path,referrer,internal,device,language}. Çerez yazılmaz, IP adresi saklanmaz (yalnızca o güne özel özet).
 * Botlar ve site yöneticisinin kendi ziyaretleri sayılmaz. Üye, sunucuda doğrulanmış oturumdan tanınır (istekten değil).
 * Her durumda boş 204 döner: ziyaretçiye hiçbir şey göstermez, bir hata sayfayı hiç etkilemez.
 */
export async function POST(request:Request){
 try{
  const own=new URL(request.url);
  const origin=request.headers.get('origin');if(origin&&origin!==own.origin)return done();
  const userAgent=request.headers.get('user-agent')??'';if(isBot(userAgent))return done();
  if(Number(request.headers.get('content-length')??0)>VISIT_REQUEST_MAX)return done();
  const text=await request.text();if(text.length>VISIT_REQUEST_MAX)return done();
  let body:Record<string,unknown>;
  try{const parsed=JSON.parse(text) as unknown;if(!parsed||typeof parsed!=='object')return done();body=parsed as Record<string,unknown>;}catch{return done();}
  const user=await getChatGPTUser();
  if(user&&isAdminEmail(user.email))return done();
  const ip=request.headers.get('cf-connecting-ip')??request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()??'';
  await recordVisit(getRawDb() as unknown as Db,{path:body.path,referrer:body.referrer,internal:body.internal,device:body.device,language:body.language,ip,userAgent,country:request.headers.get('cf-ipcountry'),host:own.host,memberId:user?.userId??null});
 }catch(error){console.error('Ziyaret kaydedilemedi',error);}
 return done();
}
