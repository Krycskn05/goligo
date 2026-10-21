// The site is called Goliqo (it was LernKoko). Every name a learner sees says Goliqo; the browser keys
// (lernkoko-…), the database and the Cloudflare worker keep their old internal names, so nobody loses settings or data.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=file=>fs.readFileSync(file,'utf8');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);

test('the site name is Goliqo everywhere a learner can see it',()=>{
 assert.ok(read('lib/site-brand.ts').includes("export const SITE_NAME = 'Goliqo';"));
 const manifest=JSON.parse(read('public/manifest.json'));
 assert.equal(manifest.name,'Goliqo');assert.equal(manifest.short_name,'Goliqo');
 assert.ok(read('public/favicon.svg').includes('<title>Goliqo</title>'));
 for(const file of [...walk('app'),...walk('lib')].filter(file=>/\.(tsx?|json|css)$/.test(file)))
  assert.ok(!read(file).includes('LernKoko'),file+' still says LernKoko');
 const home=read('lib/home-copy.ts');
 assert.ok(home.includes("'Goliqo’ya hoş geldin!'")&&home.includes("'Goliqo’yu uygulama gibi kullan'"));
 assert.ok(read('app/yonetim/page.tsx').includes('<span className="eyebrow">{SITE_NAME}</span>'));
 // The data download is named after the site, too.
 assert.ok(read('app/account-panel.tsx').includes('download="goliqo-verilerim.json"'));
 assert.ok(read('app/api/auth/route.ts').includes('filename="goliqo-verilerim.json"'));
});

test('the logo shows the book mascot with the word Goliqo',()=>{
 assert.ok(read('app/site-logo.tsx').includes('<image href="/branding/goliqo-logo.png" x="0" y="0" width="1536" height="1024"/>'));
 const png=fs.readFileSync('public/branding/goliqo-logo.png');
 assert.equal(png.toString('ascii',1,4),'PNG');
 assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[1536,1024],'same frame as the old logo, so the header crop stays');
 assert.equal(png[25],6,'RGBA: a clear background');
});

test('internal names stay, so saved settings, sign-ins and data keep working',()=>{
 assert.ok(read('lib/learning-effects.ts').includes("export const EFFECTS_KEY = 'lernkoko-effects-v1';"));
 assert.ok(read('lib/learning-language.ts').includes("'lernkoko-learning-language'"));
 const hosting=JSON.parse(read('yayin.json'));
 assert.equal(hosting.workerName,'lernkoko');assert.equal(hosting.d1DatabaseName,'lernkoko-db');
});
