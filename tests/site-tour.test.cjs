// The welcome tour (the learner asked): after signing up everyone is first asked about the sounds, then shown around
// the site — design "Spot ışığı" (the learner chose it): the page dims, the real part lights up, Paul explains it.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const tour=require(path.join(compiled,'site-tour.js'));
const copy=require(path.join(compiled,'tour-copy.js'));
const site=require(path.join(compiled,'site-languages.js'));
const read=file=>fs.readFileSync(file,'utf8');
const vm=require('node:vm');const {DatabaseSync}=require('node:sqlite');const ts=require('typescript');
const course=require(path.join(compiled,'course.js'));const study=require(path.join(compiled,'study.js'));

test('the sounds come first, then the header, the menu and "Hazırsın!"',()=>{
 assert.deepEqual(tour.TOUR_STEPS.map(step=>step.id),['sounds','clock','language','effects','account','units','vault','verbs','games','mistakes','install','done']);
 assert.equal(tour.TOUR_STEPS[0].target,null);assert.equal(tour.TOUR_STEPS.at(-1).target,null);
 // Every lit part is a real part of the home page.
 const header=read('app/site-header.tsx'),greeting=read('app/site-greeting.tsx'),home=read('app/category-study.tsx'),effects=read('app/learning-effects.tsx'),install=read('app/install-guide.tsx');
 assert.ok(greeting.includes('className="site-greeting site-greeting-button"')&&header.includes('className="site-language"')&&effects.includes('className="lk-effects-button"')&&read('app/account-menu.tsx').includes('className="site-home site-account"')&&header.includes('<AccountMenu'));
 assert.ok(home.includes("href={home?'/konular':'#curriculum'}")&&home.includes("href={'/ev-esyalar?learn='+course}")&&home.includes('verb-nav-link')&&home.includes('data-verb-section-link="games"')&&home.includes('data-verb-section-link="mistakes"')&&install.includes('ig-trigger'));
});

test('shown once per member (the account remembers it); ?tur=1 starts it again',()=>{
 assert.equal(tour.tourPlan('',null),'show');
 assert.equal(tour.tourPlan(undefined,null),'show');
 assert.equal(tour.tourPlan('done',null),'skip','seen on another device');
 assert.equal(tour.tourPlan('done','done'),'skip');
 assert.equal(tour.tourPlan('','done'),'sync','seen in this browser before the account kept it');
 assert.equal(tour.tourReplay('?tur=1'),true);assert.equal(tour.tourReplay('?learn=de'),false);
 const ui=read('app/site-tour.tsx');
 // Remembered as soon as it opens, so leaving half way or another device does not bring it back.
 assert.ok(ui.includes("if(plan!=='skip')remember();")&&ui.includes("void api({action:'note',key:TOUR_NOTE,value:TOUR_DONE})")&&ui.includes("fetch('/api/study?note='+TOUR_NOTE"));
 // A new member always gets it, even on a browser that has seen it.
 const auth=read('app/auth-form.tsx');assert.ok(auth.includes("if(register){try{localStorage.removeItem(TOUR_KEY);}catch{}}"));
 // Hesabım can start it again.
 assert.ok(read('app/account-panel.tsx').includes('<a className="btn secondary small" href="/?tur=1" data-account-tour>{texts.tourStart}</a>')&&read('lib/public-copy.ts').includes("tourStart:['Site turunu başlat',"));
 // Only on the home page of the German course, where the header and the whole menu are.
 assert.ok(read('app/category-study.tsx').includes('{home?<><HomeTour language={language}/><SiteTour language={language}/></>:<>'));
});

test('Paul\'s card goes where it fits next to the lit part',()=>{
 const card={width:340,height:220};
 // Computer: beside a menu item on the left, below a header part.
 assert.equal(tour.placeTip({left:12,top:330,width:197,height:80},card,{width:1280,height:860}).side,'right');
 const below=tour.placeTip({left:1135,top:50,width:58,height:58},card,{width:1280,height:860});
 assert.equal(below.side,'below');assert.ok(below.left+card.width<=1280-12,'kept on the screen');assert.ok(below.arrow>card.width/2,'the arrow points right at the button');
 // Phone: below, or above when the part is low on the screen.
 assert.equal(tour.placeTip({left:4,top:335,width:193,height:62},card,{width:390,height:844}).side,'below');
 assert.equal(tour.placeTip({left:4,top:700,width:382,height:67},card,{width:390,height:844}).side,'above');
 for(const box of [{left:0,top:0,width:390,height:844},{left:200,top:400,width:10,height:10}]){const place=tour.placeTip(box,card,{width:390,height:844});assert.ok(place.left>=12&&place.top>=12,'never off the screen');}
});

test('the tour speaks every site language and asks about the sounds',()=>{
 for(const id of site.siteLanguages.map(item=>item.id))for(const key of Object.keys(copy.tourCopy))assert.ok(copy.tourText(id,key).trim(),key+' '+id);
 for(const id of ['bg','cs','el','hbs','hi','hu','ja','ko','ku','nl','prs','ps','ro','so','sq','ti','ur','vi','zh']){
  const pack=JSON.parse(read('lib/language-packs/'+id+'.json'));
  for(const key of Object.keys(copy.tourCopy))assert.ok(pack[copy.tourCopy[key][2]],key+' in '+id);
 }
 const ui=read('app/site-tour.tsx');
 // The sound window: the ten site voices (a tap lets the voice say hello), speed, effects on/off and volume, saved at once.
 assert.ok(ui.includes('speech.siteVoices.map(voice=>')&&ui.includes('onClick={()=>chooseVoice(voice.id,voiceGreeting(voice))}'));
 assert.ok(ui.includes('VOICE_SPEEDS.map(')&&ui.includes('update({enabled:event.target.checked})')&&ui.includes('update({volume:Number(event.target.value)/100})'));
 assert.ok(ui.includes('saveEffects(next)'),'saved like the sound settings');
 // Nothing is read aloud by itself: only a tap on a voice or "Dinle" plays a sound.
 assert.ok(!/useEffect\([^;]*speak\(/.test(ui));
 // Spotlight: the page behind cannot be tapped, Escape ends it, it is remembered as done.
 assert.ok(ui.includes("element.setAttribute('inert','')")&&ui.includes("if(event.key==='Escape')")&&ui.includes('localStorage.setItem(TOUR_KEY,TOUR_DONE)'));
 assert.ok(read('app/paul-hoca.tsx').includes(".sg-backdrop,.st-layer')"),'Paul does not pop up during the tour');
 assert.ok(read('app/layout.tsx').includes('import "./site-tour.css";'));
});

// The study API keeps the member's tour note (the same harness as tests/housing-review.test.cjs).
function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));
 const db={prepare(query){return {query,args:[],bind(...args){this.args=args;return this;},async first(column){const r=sql.prepare(this.query).get(...this.args);return column?r?.[column]??null:r??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(items){sql.exec('BEGIN');try{const result=[];for(const item of items)result.push(await item.run());sql.exec('COMMIT');return result;}catch(error){sql.exec('ROLLBACK');throw error;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,console,Date,require(name){if(name==='@/db')return {getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return {getChatGPTUser:async()=>({userId:'star-student'})};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw Error(name);}});
 return {post(body){return module.exports.POST(new Request('https://tour.test/api/study',{method:'POST',headers:{'content-type':'application/json',origin:'https://tour.test'},body:JSON.stringify(body)}));},get(query=''){return module.exports.GET(new Request('https://tour.test/api/study'+query));}};
}

test('the account keeps the tour note for the member',async()=>{
 const a=app();
 assert.deepEqual(await (await a.get('?note=tour')).json(),{tour:''});
 assert.equal((await a.post({action:'note',key:'tour',value:'done'})).status,200);
 assert.deepEqual(await (await a.get('?note=tour')).json(),{tour:'done'});
 assert.equal((await a.post({action:'note',key:'tour',value:'yes'})).status,400,'only done or empty');
});
