// The site is called Goliqo, like its logo (the learner chose it with the address goliqo.com, October 2026; it was
// LernKoko, then Goligo). Every name a learner sees says Goliqo; the browser keys (lernkoko-…, goligo-dil), the worker
// and the database keep their old internal names, so nobody loses settings or data; the old addresses send everybody
// to goliqo.com (tests/storage-move.test.cjs).
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=file=>fs.readFileSync(file,'utf8');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);

test('the site name is Goliqo everywhere a learner can see it',()=>{
 assert.ok(read('lib/site-brand.ts').includes("export const SITE_NAME = 'Goliqo';")&&read('lib/site-brand.ts').includes("export const SITE_DOMAIN = 'goliqo.com';"));
 const manifest=JSON.parse(read('public/manifest.json'));
 assert.equal(manifest.name,'Goliqo');assert.equal(manifest.short_name,'Goliqo');
 assert.ok(read('public/favicon.svg').includes('<title>Goliqo</title>'));
 // The browser tab shows only the name (the learner removed "Almanca ve İngilizce Eğitimi").
 const layout=read('app/layout.tsx');assert.ok(layout.includes('  title: SITE_NAME,')&&!layout.includes('İngilizce Eğitimi'));
 for(const file of [...walk('app'),...walk('lib')].filter(file=>/\.(tsx?|json|css)$/.test(file))){
  const text=read(file);assert.ok(!text.includes('LernKok')&&!text.includes('Goligo'),file+' still says LernKoko or Goligo');
 }
 const home=read('lib/home-copy.ts');
 assert.ok(home.includes("'Goliqo’ya hoş geldin!'")&&home.includes("'Goliqo’yu uygulama gibi kullan'"));
 for(const file of fs.readdirSync('lib/language-packs')){const pack=read('lib/language-packs/'+file);assert.ok(!pack.includes('Goligo')&&pack.includes('"Welcome to Goliqo!"'),file);}
 assert.ok(read('app/yonetim/page.tsx').includes('<span className="eyebrow">{SITE_NAME}</span>'));
 // The data download is named after the site, too.
 assert.ok(read('app/account-panel.tsx').includes('download="goliqo-verilerim.json"'));
 assert.ok(read('app/api/auth/route.ts').includes('filename="goliqo-verilerim.json"'));
 // Everywhere else too (the learner asked): the project, the build and the notes.
 assert.equal(JSON.parse(read('package.json')).name,'goligo');
 assert.ok(read('vite.config.ts').includes('process.env.GOLIGO_D1_ID')&&read('ci/yayin.sh').includes('GOLIGO_D1_ID=')&&!read('ci/yayin.sh').includes('LERNKOKO_D1_ID'));
 for(const file of ['migration/database/members.sql','public/manifest.json','ci/yayin.sh'])assert.ok(read(file).includes('Goliqo')&&!read(file).includes('Goligo'),file);
 assert.ok(!read('lib/member-auth.ts').includes('lernkoko.local'));
 assert.ok(!read('app/landing.tsx').includes('tilki Koko'));
});

/** Width, height, frame count and loop count of a WebP file. */
function webp(file){
 const data=fs.readFileSync(file);let frames=0,size=null,loop=null;
 assert.equal(data.toString('ascii',8,12),'WEBP',file);
 for(let at=12;at+8<=data.length;){
  const tag=data.toString('ascii',at,at+4),length=data.readUInt32LE(at+4);
  if(tag==='VP8X')size=[1+data.readUIntLE(at+12,3),1+data.readUIntLE(at+15,3)];
  if(tag==='ANIM')loop=data.readUInt16LE(at+12);
  if(tag==='ANMF')frames++;
  at+=8+length+(length&1);
 }
 return {size,frames,loop,bytes:data.length};
}

test('the learner\'s Goliqo logo and animations are used in many places',()=>{
 // The learner's own logo files (ChatGPT): a still logo, the gold ball bouncing onto the "i", the mascot waving.
 const logo=read('app/site-logo.tsx');
 // High quality (the learner asked): all 20 frames a second of the learner's files, twice the shown size, and every
 // animation loops (the header bounce plays all the time).
 for(const [file,size,frames,loop] of [['goliqo-logo.webp',[496,182],0,null],['goliqo-logo-zipla.webp',[496,182],128,0],['goliqo-logo-el-salla.webp',[560,205],100,0],['goliqo-logo-buyuk.webp',[560,205],0,null],['goliqo-maskot-el-salla.webp',[340,256],100,0],['goliqo-maskot.webp',[340,256],0,null]]){
  const info=webp('public/branding/'+file);
  assert.deepEqual(info.size,size,file);assert.equal(info.frames,frames,file);if(loop!==null)assert.equal(info.loop,loop,file+' loop');
  assert.ok(info.bytes<(frames?3300:60)*1024,file+' size: '+info.bytes);
  assert.ok(logo.includes("'/branding/"+file+"'"),file+' is used');
 }
 // Header (every page): the still logo first, then the bounce again and again once it has loaded.
 assert.ok(logo.includes('<img className="site-logo-art" src={bounce?BRAND.logoBounce:BRAND.logo} alt="" width={496} height={182}'));
 assert.ok(logo.includes('const bounce=useAnimated(BRAND.logoBounce);')&&!logo.includes('sessionStorage'),'on every page, not once per visit');
 assert.ok(logo.includes('const image=new Image();image.onload=()=>{if(alive)setLoaded(true);};image.src=src;')&&logo.includes('return loaded&&motion;'),'animations only with motion on, after they have loaded');
 // The waving mascot and the big waving logo where the old Koko pictures were, and more.
 // The welcome box on the home page has no mascot or logo any more (the learner removed it).
 const tour=read('app/home-tour.tsx');assert.ok(!tour.includes('BrandMascot')&&!tour.includes('ht-koko')&&!tour.includes('koko-mascot'));
 assert.ok(read('app/landing.tsx').includes('<BrandLogoWave className="lk-hero-logo"/>'));
 for(const page of ['app/giris/page.tsx','app/uye-ol/page.tsx'])assert.ok(read(page).includes('<BrandMascot className="lk-auth-mascot"/>'),page);
 assert.ok(read('app/account-panel.tsx').includes('<BrandMascot className="lk-account-mascot"/>'));
 assert.equal((read('app/ausbildung-study.tsx').match(/<BrandMascot className="l12-koko"\/>/g)||[]).length,2);
 assert.ok(read('app/site-footer.tsx').includes('<img className="site-footer-logo" src="/branding/goliqo-logo.webp" alt="" width={496} height={182}'));
 for(const file of ['app/home-tour.tsx','app/ausbildung-study.tsx'])assert.ok(!read(file).includes('koko-mascot.png'),file);
});

test('internal names stay, so saved settings and data keep working; the address is goliqo.com now',()=>{
 assert.ok(read('lib/learning-effects.ts').includes("export const EFFECTS_KEY = 'lernkoko-effects-v1';"));
 assert.ok(read('lib/learning-language.ts').includes("'lernkoko-learning-language'"));
 const hosting=JSON.parse(read('yayin.json'));
 assert.equal(hosting.workerName,'goligo');assert.equal(hosting.siteDomain,'goliqo.com');assert.deepEqual(hosting.oldWorkerNames,['lernkoko']);assert.equal(hosting.d1DatabaseName,'lernkoko-db');
});
