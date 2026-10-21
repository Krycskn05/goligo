import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRequire} from 'node:module';
const compiled=process.env.STUDY_CHECK_DIR;
assert.ok(compiled,'Set STUDY_CHECK_DIR to compiled lib directory.');
const load=createRequire(import.meta.url);
const {verifyAccessJwt,normalizeTeamDomain,withoutClientIdentity}=load(compiled+'/access-gate.js');
// The site now opens with membership (lib/site-gate.ts); a verified Access token is still
// accepted while Cloudflare Access is being switched off, so old progress can be linked.
const {siteGate}=load(compiled+'/site-gate.js');

const AUD='aud-goliqo-test';
const b64url=bytes=>Buffer.from(bytes).toString('base64url');
const json64=value=>b64url(Buffer.from(JSON.stringify(value)));
let teamCounter=0;

async function makeTeam(){
 const team=`https://team${++teamCounter}.cloudflareaccess.com`;
 const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
 const jwk={...(await crypto.subtle.exportKey('jwk',pair.publicKey)),kid:'key-1',alg:'RS256',use:'sig'};
 const calls=[];let keys=[jwk];
 const fetcher=async url=>{calls.push(String(url));return new Response(JSON.stringify({keys}),{headers:{'content-type':'application/json'}});};
 async function token(claims={},header={}){
  const now=Math.floor(Date.now()/1000);
  const h=json64({alg:'RS256',kid:'key-1',typ:'JWT',...header});
  const p=json64({aud:[AUD],iss:team,sub:'user-123',email:'koray@example.com',iat:now,nbf:now,exp:now+600,...claims});
  const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(h+'.'+p));
  return h+'.'+p+'.'+b64url(new Uint8Array(sig));
 }
 return {team,fetcher,token,calls,setKeys(next){keys=next;},jwk};
}
const req=(path,init={})=>new Request('https://lernkoko.example.workers.dev'+path,init);

test('team domain accepts a name, a host or a full address',()=>{
 assert.equal(normalizeTeamDomain('koray'),'https://koray.cloudflareaccess.com');
 assert.equal(normalizeTeamDomain('koray.cloudflareaccess.com/'),'https://koray.cloudflareaccess.com');
 assert.equal(normalizeTeamDomain(' https://Koray.cloudflareaccess.com '),'https://koray.cloudflareaccess.com');
 assert.equal(normalizeTeamDomain(''),null);assert.equal(normalizeTeamDomain(undefined),null);assert.equal(normalizeTeamDomain('bad host!'),null);
});

test('without a valid Access token nobody is signed in; client identity headers alone never count',async()=>{
 const t=await makeTeam();const settings={TEAM_DOMAIN:t.team,POLICY_AUD:AUD};
 const none=await siteGate(req('/api/study'),settings,{fetcher:t.fetcher});assert(none instanceof Request);assert.equal(none.headers.get('oai-authenticated-user-id'),null);
 const spoofed=await siteGate(req('/fiiller',{headers:{'oai-authenticated-user-id':'someone-else','oai-authenticated-user-email':'x@y.z'}}),settings,{fetcher:t.fetcher});
 assert(spoofed instanceof Response);assert.equal(spoofed.status,302,'client identity headers alone must never sign anyone in');assert.equal(spoofed.headers.get('location'),'/giris?return_to=%2Ffiiller');
});

test('a valid token signs the user in and replaces any client-supplied identity',async()=>{
 const t=await makeTeam();const settings={TEAM_DOMAIN:t.team,POLICY_AUD:AUD};
 const out=await siteGate(req('/api/study',{headers:{'cf-access-jwt-assertion':await t.token(),'oai-authenticated-user-id':'attacker','OAI-Authenticated-User-Full-Name':'Fake'}}),settings,{fetcher:t.fetcher});
 assert(out instanceof Request);
 assert.equal(out.headers.get('oai-authenticated-user-id'),'cf-access:user-123');
 assert.equal(out.headers.get('oai-authenticated-user-email'),'koray@example.com');
 assert.equal(out.headers.get('oai-authenticated-user-full-name'),null);
});

test('POST bodies survive the gate unchanged',async()=>{
 const t=await makeTeam();const settings={TEAM_DOMAIN:t.team,POLICY_AUD:AUD};
 const body=JSON.stringify({action:'note',key:'profile',value:'merhaba'});
 const out=await siteGate(req('/api/study',{method:'POST',body,headers:{'content-type':'application/json','cf-access-jwt-assertion':await t.token()}}),settings,{fetcher:t.fetcher});
 assert(out instanceof Request);assert.equal(out.method,'POST');assert.equal(await out.text(),body);
});

test('wrong audience, issuer, expiry, algorithm or signature are rejected',async()=>{
 const t=await makeTeam();const now=Math.floor(Date.now()/1000);
 const check=async token=>verifyAccessJwt(token,t.team,AUD,t.fetcher);
 assert.deepEqual(await check(await t.token()),{sub:'user-123',email:'koray@example.com'});
 assert.equal(await check(await t.token({aud:['another-app']})),null);
 assert.equal(await check(await t.token({iss:'https://evil.cloudflareaccess.com'})),null);
 assert.equal(await check(await t.token({exp:now-3600})),null);
 assert.equal(await check(await t.token({nbf:now+3600})),null);
 assert.equal(await check(await t.token({sub:''})),null);
 assert.equal(await check(await t.token({email:undefined})),null);
 assert.equal(await check(await t.token({},{alg:'none'})),null);
 const good=await t.token();const parts=good.split('.');
 const forged=parts[0]+'.'+json64({aud:[AUD],iss:t.team,sub:'admin',email:'admin@example.com',exp:now+600})+'.'+parts[2];
 assert.equal(await check(forged),null,'changing the payload must break the signature');
 assert.equal(await check('not-a-jwt'),null);
});

test('signing keys are cached and refreshed when Access rotates them',async()=>{
 const t=await makeTeam();
 t.setKeys([{...t.jwk,kid:'old-key'}]);
 assert.equal((await verifyAccessJwt(await t.token(),t.team,AUD,t.fetcher)),null);
 const before=t.calls.length;
 t.setKeys([{...t.jwk,kid:'old-key'},t.jwk]);
 assert.equal((await verifyAccessJwt(await t.token(),t.team,AUD,t.fetcher))?.sub,'user-123');
 assert(t.calls.length>before,'an unknown key id triggers one refresh');
 const after=t.calls.length;await verifyAccessJwt(await t.token(),t.team,AUD,t.fetcher);assert.equal(t.calls.length,after,'known keys come from the cache');
});

test('an unreachable Access key service signs nobody in through Access',async()=>{
 const t=await makeTeam();const token=await t.token();
 const down=async()=>new Response('down',{status:500});
 const error=console.error;console.error=()=>{};
 try{const r=await siteGate(req('/fiiller',{headers:{'cf-access-jwt-assertion':token}}),{TEAM_DOMAIN:t.team,POLICY_AUD:AUD},{fetcher:down});assert(r instanceof Response);assert.equal(r.status,302);assert.equal(r.headers.get('location'),'/giris?return_to=%2Ffiiller');}
 finally{console.error=error;}
});

test('old ChatGPT and Access sign-in and sign-out addresses lead to the member pages',async()=>{
 const t=await makeTeam();const settings={TEAM_DOMAIN:t.team,POLICY_AUD:AUD};
 const go=async(path,headers={})=>{const r=await siteGate(req(path,{headers}),settings,{fetcher:t.fetcher});assert(r instanceof Response);assert.equal(r.status,302);return r.headers.get('location');};
 assert.equal(await go('/signin-with-chatgpt?return_to=%2Fev-esyalar'),'/giris?return_to=%2Fev-esyalar');
 assert.equal(await go('/signin-with-chatgpt?return_to=%2F%2Fevil.example'),'/giris');
 assert.equal(await go('/auth/login',{referer:'https://lernkoko.example.workers.dev/a1-2/ev-ve-yasam'}),'/giris?return_to=%2Fa1-2%2Fev-ve-yasam');
 assert.equal(await go('/auth/login',{referer:'https://evil.example/steal'}),'/giris');
 assert.equal(await go('/signout-with-chatgpt?return_to=%2F'),'/');
 assert.equal(await go('/auth/logout'),'/');
 assert.equal(await go('/callback'),'/');
});

test('header cleanup removes every identity header regardless of case',()=>{
 const h=withoutClientIdentity(new Headers({'OAI-Authenticated-User-Id':'a','oai-authenticated-user-email':'b','LK-Verified-Access-Id':'cf-access:x','accept':'text/html'}));
 assert.equal(h.get('oai-authenticated-user-id'),null);assert.equal(h.get('oai-authenticated-user-email'),null);assert.equal(h.get('lk-verified-access-id'),null);assert.equal(h.get('accept'),'text/html');
});
