// The site has its own address now: goliqo.com (the learner bought it and named the site Goliqo, October 2026). The
// old addresses (goligo.… and lernkoko.….workers.dev) and www.goliqo.com send everybody to the same page there, and a
// browser's own settings move along once; the new address takes them only from its own old addresses, only the
// site's keys and never over a newer value.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const move=require(path.join(compiled,'storage-move.js'));
const brand=require(path.join(compiled,'site-brand.js'));

function storage(initial){const map=new Map(Object.entries(initial));return {map,get length(){return map.size;},key:i=>[...map.keys()][i]??null,getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};}
const oldPageScript=target=>move.oldAddressPage(target).match(/<script>([\s\S]*)<\/script>/)[1];
const page=(url,accept='text/html,application/xhtml+xml')=>new Request(url,{headers:{accept}});

test('the site address is goliqo.com; the old ones and www go to the same page there',async()=>{
 assert.equal(brand.SITE_DOMAIN,'goliqo.com');assert.equal(move.SITE_ORIGIN,'https://goliqo.com');
 assert.deepEqual(brand.OLD_SITE_HOSTS,['goligo.kooraycoskun.workers.dev','lernkoko.kooraycoskun.workers.dev']);
 assert.equal(JSON.parse(fs.readFileSync('yayin.json','utf8')).siteDomain,brand.SITE_DOMAIN);
 assert.equal(move.newAddress('https://goligo.kooraycoskun.workers.dev/fiiller?bolum=oyunlar','https://goliqo.com'),'https://goliqo.com/fiiller?bolum=oyunlar');
 // A page in a browser: the short moving page, with the name and both languages.
 const old=move.siteAddressMove(page('https://goligo.kooraycoskun.workers.dev/fiiller?bolum=oyunlar'));
 assert.equal(old.status,200);assert.equal(old.headers.get('referrer-policy'),'origin');assert.equal(old.headers.get('cache-control'),'no-store');
 const html=await old.text();
 assert.ok(html.includes('Goliqo hat eine neue Adresse')&&html.includes('Goliqo yeni adresine taşındı')&&html.includes('<html lang="de">')&&html.includes('<title>Goliqo</title>'));
 assert.ok(html.includes('<meta http-equiv="refresh" content="0;url=https://goliqo.com/fiiller?bolum=oyunlar">'));
 // Everything else (API calls, pictures) is redirected straight away; www goes to the address without www.
 const api=move.siteAddressMove(new Request('https://goligo.kooraycoskun.workers.dev/api/study',{method:'POST'}));
 assert.equal(api.status,308);assert.equal(api.headers.get('location'),'https://goliqo.com/api/study');
 const www=move.siteAddressMove(page('https://www.goliqo.com/giris?return_to=%2F'));
 assert.equal(www.status,301);assert.equal(www.headers.get('location'),'https://goliqo.com/giris?return_to=%2F');
 // The site itself, local development and the preview addresses are served as usual.
 for(const url of ['https://goliqo.com/','http://localhost:5173/','https://abc123-goligo.kooraycoskun.workers.dev/','https://goligo.someone-else.workers.dev/'])assert.equal(move.siteAddressMove(page(url)),null,url);
 // The worker runs this first; the first old address (ci/eski-adres) sends everybody straight to goliqo.com.
 const worker=fs.readFileSync('build/sites-worker.ts','utf8');
 assert.ok(worker.indexOf('const moved = siteAddressMove(request);\n    if (moved) return moved;')>0&&worker.indexOf('siteAddressMove(request)')<worker.indexOf('await siteGate('));
 assert.ok(fs.readFileSync('ci/eski-adres/worker.ts','utf8').includes('return oldAddressResponse(request,env.NEW_ORIGIN);'));
 const deploy=fs.readFileSync('ci/yayin.sh','utf8');
 assert.ok(deploy.includes(`DOMAIN=$(node -p "require('./yayin.json').siteDomain||''")`)&&deploy.includes('[ -n "$DOMAIN" ] && url="https://$DOMAIN"'));
 assert.ok(deploy.includes('wr deploy --config ci/eski-adres/wrangler.json --name "$old" --var "NEW_ORIGIN:$url"')&&deploy.includes('&& adim "9-eski-adres" 09-old-address.log s_eski'));
});

test('the browser settings move once, only from the old addresses, never over newer ones',()=>{
 const old=storage({'lernkoko-effects-v1':'{"enabled":false}','german-study-language':'uk','lernkoko-l12-scores':'{"a":3}','goligo-tasindi':'1','something-else':'x'});
 let to=null;vm.runInNewContext(oldPageScript('https://goliqo.com/'),{localStorage:old,location:{replace:url=>{to=url;}}});
 assert.ok(to.startsWith('https://goliqo.com/'+move.MOVE_HASH),'also when the settings came over from lernkoko before');
 let again=null;vm.runInNewContext(oldPageScript('https://goliqo.com/'),{localStorage:old,location:{replace:url=>{again=url;}}});
 assert.equal(again,'https://goliqo.com/','only once');
 const url=new URL(to);
 const run=(store,referrer)=>{let clean=null;vm.runInNewContext(move.STORAGE_MOVE_SCRIPT,{localStorage:store,location:{hash:url.hash,host:url.host,pathname:url.pathname,search:url.search},document:{referrer},history:{replaceState:(a,b,c)=>{clean=c;}}});return clean;};
 const fresh=storage({'german-study-language':'tr'});
 assert.equal(run(fresh,'https://goligo.kooraycoskun.workers.dev/'),'/','the address is cleaned');
 assert.deepEqual(Object.fromEntries(fresh.map),{'german-study-language':'tr','lernkoko-effects-v1':'{"enabled":false}','lernkoko-l12-scores':'{"a":3}','goliqo-tasindi':'1'});
 const fromFirst=storage({});run(fromFirst,'https://lernkoko.kooraycoskun.workers.dev/');
 assert.equal(fromFirst.map.get('german-study-language'),'uk','from the first old address too');
 for(const stranger of ['https://goligo.someone-else.workers.dev/','https://goliqo.com.evil.test/','https://evil.test/goligo.kooraycoskun.workers.dev/','']){
  const store=storage({});run(store,stranger);assert.equal(store.map.size,0,'not from '+stranger);
 }
 assert.ok(fs.readFileSync('app/layout.tsx','utf8').includes('<script dangerouslySetInnerHTML={{ __html: STORAGE_MOVE_SCRIPT }} />'));
});
