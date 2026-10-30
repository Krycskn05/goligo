import {env} from 'cloudflare:workers';
import {getRawDb} from '@/db';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {countAttempt,isLimited} from '@/lib/member-store';
import {talkScenarios} from '@/lib/talk-scenarios';
import {TALK_DAILY_LIMIT,TALK_MODEL,TALK_TEXT_MAX,parseTalkReply,talkMessages,talkReplySchema,type TalkTurn} from '@/lib/talk-prompt';

/**
 * "Konuş": one turn of a lesson's spoken role play (the learner asked, 30 October 2026). Members only; the browser sends
 * the scenario id and the conversation so far, the server writes the prompt (lib/talk-prompt.ts) and asks Workers AI
 * (the AI binding exists only in the published site, vite.config.ts). A member may send TALK_DAILY_LIMIT lines a day.
 */
export const dynamic='force-dynamic';
const noCache={'Cache-Control':'no-store'};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:noCache});
const DAY=24*60*60*1000;
type Ai={run(model:string,input:Record<string,unknown>):Promise<unknown>};

export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Geçersiz istek.'},403);
 const user=await getChatGPTUser();
 if(!user)return json({error:'Konuşmak için giriş yap.',signIn:true},401);
 let body:Record<string,unknown>;try{body=await request.json() as Record<string,unknown>;}catch{return json({error:'Geçersiz istek.'},400);}
 const scenario=typeof body.scenario==='string'?talkScenarios[body.scenario]:undefined;
 if(!scenario)return json({error:'Bu konuşma bulunamadı.'},404);
 const history=(Array.isArray(body.history)?body.history:[]).filter((turn):turn is TalkTurn=>!!turn&&typeof turn==='object'&&((turn as TalkTurn).role==='partner'||(turn as TalkTurn).role==='learner')&&typeof (turn as TalkTurn).text==='string');
 const last=history[history.length-1];
 if(!last||last.role!=='learner'||!last.text.trim())return json({error:'Önce bir şey söyle ya da yaz.'},400);
 if(last.text.length>TALK_TEXT_MAX*2)return json({error:'Bu cümle çok uzun.'},400);
 const ai=(env as unknown as {AI?:Ai}).AI;
 if(!ai||typeof ai.run!=='function')return json({error:'Konuşma şu anda kullanılamıyor.'},503);
 const db=getRawDb();const key='talk:'+user.userId;
 if(await isLimited(db,key,TALK_DAILY_LIMIT,DAY))return json({error:'Bugünlük konuşma hakkın doldu. Yarın devam edelim!',limit:true},429);
 const messages=talkMessages(scenario,history);
 try{
  let raw:unknown;
  try{raw=await ai.run(TALK_MODEL,{messages,max_tokens:350,temperature:0.6,response_format:{type:'json_schema',json_schema:talkReplySchema}});}
  catch{raw=await ai.run(TALK_MODEL,{messages,max_tokens:350,temperature:0.6});}
  const reply=parseTalkReply(raw);
  if(!reply)throw new Error('Empty talk reply');
  await countAttempt(db,key,DAY);
  return json({reply});
 }catch(error){
  console.error('Talk failed',error);
  return json({error:'Şu anda cevap gelmedi. Biraz sonra yeniden dene.'},503);
 }
}
