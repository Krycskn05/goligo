const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;
assert.ok(compiled,'Set STUDY_CHECK_DIR to compiled libraries.');
const homeCopy=require(path.join(compiled,'home-copy.js'));
const site=require(path.join(compiled,'site-languages.js'));
const read=file=>fs.readFileSync(file,'utf8');

test('the home page introduces the site; the units catalogue moved to /konular',()=>{
 const page=read('app/page.tsx');
 assert.ok(page.includes('<StudyApp page="home" />')&&page.includes('<Landing />'),'members see the introduction, visitors the landing page');
 assert.ok(read('app/konular/page.tsx').includes('<StudyApp page="units" guest={!(await getChatGPTUser())}/>'));
 const home=read('app/category-study.tsx');
 // (with the welcome tour beside it, app/site-tour.tsx)
 assert.ok(home.includes('{home?<><HomeTour language={language}/><SiteTour language={language}/></>:<>'),'the introduction replaces the catalogue on the home page');
 // The introduction shows no progress: no sidebar progress panel and no progress requests on the home page.
 assert.ok(home.includes("{course==='de'&&!home&&snapshot?.stats&&<SidebarProgress ")&&home.includes("if(course!=='de'||home){setSnapshot(null);return;}"));
 // The menu starts with "Ana sayfa"; "Üniteler ve konular" opens /konular from the home page.
 // The menu is app/site-menu.tsx (the same on every page, 22 October 2026).
 const nav=read('app/site-menu.tsx');
 assert.ok(nav.indexOf('href="/"')<nav.indexOf('href={unitsHref}')&&home.includes("<SiteMenu language={language} current={home?'home':'units'} course={course} unitsHref={home?'/konular':'#curriculum'}/>"));
 assert.ok(nav.includes('<NavIcon name="home"/>{vaultText(language,\'home\')}'));
 // Old links to "/?level=A1.2" still reach the catalogue.
 assert.ok(home.includes("window.location.replace('/konular?level='+level)"));
 for(const file of ['app/housing-study.tsx','app/ausbildung-study.tsx','app/ausbildung-hoeren.tsx']){
  const source=read(file);
  assert.ok(!source.includes('/?learn=de&level=A1.2'),file);
  // The header leads back to A1.2; the "A1.2 › …" breadcrumb was removed at the learner's request (30 October 2026).
  assert.ok(source.includes('homeHref="/konular?level=A1.2"')&&!source.includes('className="object-breadcrumb"'),file);
 }
 for(const file of ['app/object-study.tsx','app/verb-study.tsx'])assert.ok(!read(file).includes('className="object-breadcrumb"'),file+': no "Ana sayfa ›" breadcrumb');
 assert.ok(read('app/layout.tsx').includes('import "./home-tour.css";'));
 const icons=read('app/nav-icons.tsx');
 for(const name of ['home','housing','ausbildung'])assert.ok(icons.includes(' '+name+':<>')&&read('app/koko-theme.css').includes('.nav-icon-'+name+' {'),name);
});

test('the introduction has one picture card per main part of the left menu, in menu order, and nothing else',()=>{
 const tour=read('app/home-tour.tsx');
 const parts=[...tour.matchAll(/\{id:'(\w+)',icon:'(\w+)',href:([^,]+),/g)].map(m=>[m[1],m[3]]);
 assert.deepEqual(parts,[['units',"'/konular'"],['vault',"'/ev-esyalar?learn=de'"],['verbs',"'/fiiller'"],['games',"'/oyunlar'"],['mistakes',"'/yanlislarim'"]]);
 // The same parts and links as the left menu, and none of the lessons inside them (Ev ve Yaşam, Ausbildung).
 const menu=read('app/site-menu.tsx');
 for(const href of ['/ev-esyalar?learn=','/fiiller','/oyunlar','/yanlislarim'])assert.ok(menu.includes(href),href);
 for(const lesson of ['/a1-2/ev-ve-yasam','AUSBILDUNG_PATH','housing','ausbildung'])assert.ok(!tour.includes(lesson),lesson);
 // The whole card is the link; the picture is decoration.
 assert.ok(tour.includes('<a className="ht-card panel" href={part.href}>')&&tour.includes('<span className="ht-art" aria-hidden="true">'));
 // Only an introduction: no progress, lessons, verb of the day, sound or saved places.
 for(const word of ['ProgressMeter','Progress(','speak(','useGermanSpeech','localStorage','api('])assert.ok(!tour.includes(word),word);
});

test('every home page text exists in all site languages',()=>{
 const packs=Object.fromEntries(site.packLanguages.map(id=>[id,JSON.parse(read(`lib/language-packs/${id}.json`))]));
 assert.deepEqual(Object.keys(homeCopy.homeCopy),['welcome','about','tourTitle','unitsText','vaultText','verbsText','gamesText','mistakesText','installButton','installTitle','installLead','iosStep1','iosStep2','iosStep3','androidStep1','androidStep2','androidStep3','installNow','installNote']);
 for(const [key,tuple] of Object.entries(homeCopy.homeCopy)){
  assert.equal(tuple.length,6,key);
  for(const text of tuple)assert.ok(text.trim(),key);
  for(const [id,pack] of Object.entries(packs))assert.ok(typeof pack[tuple[2]]==='string'&&pack[tuple[2]].trim(),id+': '+key);
 }
});

const pngSize=file=>{const data=fs.readFileSync(file);assert.equal(data.toString('ascii',1,4),'PNG',file);return [data.readUInt32BE(16),data.readUInt32BE(20)];};

test('the site has the Koko app icon for the browser tab, the phone home screen and the installed app',()=>{
 const layout=read('app/layout.tsx');
 assert.ok(layout.includes('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />')&&layout.includes('<link rel="manifest" href="/manifest.json" />'));
 assert.ok(layout.includes('<meta name="apple-mobile-web-app-title" content={SITE_NAME} />'),'the name under the icon is Goliqo');
 assert.deepEqual(pngSize('public/apple-touch-icon.png'),[180,180]);
 const manifest=JSON.parse(read('public/manifest.json'));
 assert.equal(manifest.name,'Goliqo');assert.equal(manifest.short_name,'Goliqo');assert.equal(manifest.start_url,'/');assert.equal(manifest.display,'standalone');
 const sizes=Object.fromEntries(manifest.icons.map(icon=>[icon.src,pngSize('public'+icon.src).join('x')]));
 assert.deepEqual(sizes,{'/icons/icon-192.png':'192x192','/icons/icon-512.png':'512x512','/icons/icon-maskable-512.png':'512x512'});
 assert.ok(manifest.icons.some(icon=>icon.purpose==='maskable'));
 assert.ok(read('public/favicon.svg').includes('data:image/png;base64,')&&fs.existsSync('public/favicon.ico'),'the tab icon is Koko too');
 // Browsers fetch these without the login cookie, so the site gate must let them through.
 const auth=require(path.join(compiled,'member-auth.js'));
 for(const file of ['/manifest.json','/apple-touch-icon.png','/favicon.ico','/favicon.svg',...manifest.icons.map(icon=>icon.src)])assert.ok(auth.isPublicPath(file),file);
});

test('"Uygulama olarak indir" in the left menu explains how to add Goliqo to the phone',()=>{
 // A menu button right under the left menu (home page and units page), not in the welcome card.
 const home=read('app/category-study.tsx');
 const aside=home.slice(home.indexOf('<aside className="work-sidebar">'),home.indexOf('</aside>'));
 assert.ok(aside.indexOf("unitsHref={home?'/konular':'#curriculum'}/><InstallGuide language={language}/>")>0);
 assert.ok(read('app/site-menu.tsx').includes('<aside className="work-sidebar"><SiteMenu language={language} current={current} course={course}/><InstallGuide language={language}/></aside>'),'the same on every page');
 assert.ok(!read('app/home-tour.tsx').includes('InstallGuide'));
 assert.equal(homeCopy.homeCopy.installButton[0],'Uygulama olarak indir');
 const guide=read('app/install-guide.tsx');
 assert.ok(guide.includes('className="work-nav object-nav-link ig-trigger"')&&guide.includes('<NavIcon name="app"/>'));
 // The steps open in a window drawn on the page body (above the page's cards and pictures).
 assert.ok(guide.includes('createPortal(')&&guide.includes(',document.body)')&&guide.includes('role="dialog" aria-modal="true"'));
 // iPhone and Android steps; the phone's own steps only on a phone, both on a computer.
 assert.ok(guide.includes("{platform==='android'?android:platform==='ios'?ios:<>{ios}{android}</>}"));
 for(const key of ['iosStep1','iosStep2','iosStep3','androidStep1','androidStep2','androidStep3','installNote'])assert.ok(guide.includes("h('"+key+"')"),key);
 // The browser's own install window when it offers one; nothing at all inside the installed app.
 assert.ok(guide.includes("addEventListener('beforeinstallprompt',offer)")&&guide.includes('if(installed)return null;')&&guide.includes("matchMedia('(display-mode: standalone)')"));
 assert.ok(guide.includes("event.key==='Escape'")&&guide.includes('opener?.focus()'));
});

test('the learner\'s menu icons and home page pictures are used', ()=>{
 const fs=require('node:fs');
 const size=file=>{const d=fs.readFileSync(file);assert.equal(d.toString('ascii',8,12),'WEBP',file);
  for(let at=12;at+8<=d.length;){const tag=d.toString('ascii',at,at+4),length=d.readUInt32LE(at+4);
   if(tag==='VP8X')return [1+d.readUIntLE(at+12,3),1+d.readUIntLE(at+15,3)];
   if(tag==='VP8 ')return [d.readUInt16LE(at+14)&0x3fff,d.readUInt16LE(at+16)&0x3fff];
   at+=8+length+(length&1);}
  return null;};
 // Seven soft 3D icons (128 × 128, clear background) for the left menu; Ev ve Yaşam and Ausbildung keep their drawing.
 const icons=read('app/nav-icons.tsx');
 for(const name of ['home','units','vault','verbs','games','mistakes','app']){
  assert.ok(icons.includes(name+":'/icons/menu/"+name+".webp'"),name);
  assert.deepEqual(size('public/icons/menu/'+name+'.webp'),[128,128],name);
 }
 for(const name of ['housing','ausbildung'])assert.ok(!icons.includes(name+":'/icons/menu/"),name+' keeps its drawing');
 assert.ok(icons.includes("if(picture)return <span className={'nav-icon has-picture nav-icon-'+name} aria-hidden=\"true\"><img src={picture} alt=\"\" width={128} height={128}"));
 // One picture of the learner's per home page card (1200 × 600) from all their sets, changing every 30 minutes
 // (lib/site-pictures.ts; the learner asked: not always the same).
 const tour=read('app/home-tour.tsx');
 assert.ok(tour.includes("const art=(id:keyof PicturePick)=><img src={pictures[id]} alt=\"\" width={1200} height={600} loading=\"lazy\" decoding=\"async\"/>;")&&tour.includes('useState<PicturePick>(()=>pickPictures())')&&tour.includes('nextPictureChange()'));
 const pictures=read('lib/site-pictures.ts');
 for(const id of ['units','vault','verbs','games','mistakes']){
  assert.ok(tour.includes("art:art('"+id+"')"),id);
  const list=[...pictures.match(new RegExp(' '+id+':\\[([^\\]]*)\\]'))[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
  assert.ok(list.length>=3,id+': at least three pictures to mix');
  for(const src of list)assert.deepEqual(size('public'+src),[1200,600],src);
 }
 const landing=read('app/landing.tsx');
 assert.ok(landing.includes('const pictures=pickPictures();')&&landing.includes('<img src={pictures.welcome}')&&landing.includes('<img src={pictures[item.part]}'));
 for(const src of ['/toon/landing/karsilama.webp','/toon/landing/karsilama-2.webp','/toon/landing/karsilama-3.webp'])assert.deepEqual(size('public'+src),[1400,700],src);
});

test('the home page is only the cards, on one screen (25 October 2026: the welcome box and the heading were removed)',()=>{
 const tour=fs.readFileSync('app/home-tour.tsx','utf8'),css=fs.readFileSync('app/home-tour.css','utf8');
 assert.ok(!tour.includes('className="ht-hero"')&&!tour.includes('className="ht-title"'),'no welcome box, no "Sitede neler var?"');
 assert.ok(tour.includes('<h1 id="work-heading" className="sr-only" tabIndex={-1}>'),'the page heading stays for screen readers');
 // Since 29 October 2026 the page is the window high and the pictures take what is left (tests/home-one-screen.test.cjs).
 assert.ok(css.includes('.category-app:has(.ht) { display:flex; flex-direction:column; height:100vh; height:100dvh;')&&css.includes('-webkit-line-clamp:3'));
 assert.ok(fs.readFileSync('app/koko-theme.css','utf8').includes('@media (min-width:1001px) and (max-height:860px) {'),'a low screen gets a shorter menu');
});
