// The site moved to goligo.<account>.workers.dev (the learner renamed it Goligo). The old address sends everybody to
// the same page there and carries the browser's own settings along once; the new address takes them only from its own
// old address, only the site's keys and never over a newer value.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const move=require(path.join(compiled,'storage-move.js'));

function storage(initial){const map=new Map(Object.entries(initial));return {map,get length(){return map.size;},key:i=>[...map.keys()][i]??null,getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};}
const oldPageScript=target=>move.oldAddressPage(target).match(/<script>([\s\S]*)<\/script>/)[1];

test('the old address goes to the same page on the new one',()=>{
 assert.equal(move.newAddress('https://lernkoko.koray.workers.dev/fiiller?bolum=oyunlar','https://goligo.koray.workers.dev'),'https://goligo.koray.workers.dev/fiiller?bolum=oyunlar');
 const page=move.oldAddressPage('https://goligo.koray.workers.dev/');
 assert.ok(page.includes('Goligo ist umgezogen')&&page.includes('Goligo yeni adresine taşındı')&&page.includes('<html lang="de">')&&page.includes('<meta http-equiv="refresh" content="0;url=https://goligo.koray.workers.dev/">'));
 const worker=fs.readFileSync('ci/eski-adres/worker.ts','utf8');
 assert.ok(worker.includes("if(!page)return Response.redirect(target,308);")&&worker.includes("'referrer-policy':'origin'"));
 const deploy=fs.readFileSync('ci/yayin.sh','utf8');
 assert.ok(deploy.includes('wr deploy --config ci/eski-adres/wrangler.json --name "$old" --var "NEW_ORIGIN:$url"')&&deploy.includes('&& adim "9-eski-adres" 09-old-address.log s_eski'));
});

test('the browser settings move once, only from the old address, never over newer ones',()=>{
 const old=storage({'lernkoko-effects-v1':'{"enabled":false}','german-study-language':'uk','lernkoko-l12-scores':'{"a":3}','something-else':'x'});
 let to=null;vm.runInNewContext(oldPageScript('https://goligo.koray.workers.dev/'),{localStorage:old,location:{replace:url=>{to=url;}}});
 assert.ok(to.startsWith('https://goligo.koray.workers.dev/'+move.MOVE_HASH));
 let again=null;vm.runInNewContext(oldPageScript('https://goligo.koray.workers.dev/'),{localStorage:old,location:{replace:url=>{again=url;}}});
 assert.equal(again,'https://goligo.koray.workers.dev/','only once');
 const url=new URL(to);
 const run=(store,referrer)=>{let clean=null;vm.runInNewContext(move.STORAGE_MOVE_SCRIPT,{localStorage:store,location:{hash:url.hash,host:url.host,pathname:url.pathname,search:url.search},document:{referrer},history:{replaceState:(a,b,c)=>{clean=c;}}});return clean;};
 const fresh=storage({'german-study-language':'tr'});
 assert.equal(run(fresh,'https://lernkoko.koray.workers.dev/'),'/','the address is cleaned');
 assert.deepEqual(Object.fromEntries(fresh.map),{'german-study-language':'tr','lernkoko-effects-v1':'{"enabled":false}','lernkoko-l12-scores':'{"a":3}','goligo-tasindi':'1'});
 const stranger=storage({});run(stranger,'https://lernkoko.someone-else.workers.dev/');
 assert.equal(stranger.map.size,0,'not from another account');
 assert.ok(fs.readFileSync('app/layout.tsx','utf8').includes('<script dangerouslySetInnerHTML={{ __html: STORAGE_MOVE_SCRIPT }} />'));
});
