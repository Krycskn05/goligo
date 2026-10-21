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

test('the sounds come first, then the header, the menu and "Hazırsın!"',()=>{
 assert.deepEqual(tour.TOUR_STEPS.map(step=>step.id),['sounds','clock','language','effects','account','units','vault','verbs','games','mistakes','install','done']);
 assert.equal(tour.TOUR_STEPS[0].target,null);assert.equal(tour.TOUR_STEPS.at(-1).target,null);
 // Every lit part is a real part of the home page.
 const header=read('app/site-header.tsx'),greeting=read('app/site-greeting.tsx'),home=read('app/category-study.tsx'),effects=read('app/learning-effects.tsx'),install=read('app/install-guide.tsx');
 assert.ok(greeting.includes('className="site-greeting site-greeting-button"')&&header.includes('className="site-language"')&&effects.includes('className="lk-effects-button"')&&header.includes('className="site-home site-account"'));
 assert.ok(home.includes("href={home?'/konular':'#curriculum'}")&&home.includes("href={'/ev-esyalar?learn='+course}")&&home.includes('verb-nav-link')&&home.includes('data-verb-section-link="games"')&&home.includes('data-verb-section-link="mistakes"')&&install.includes('ig-trigger'));
});

test('shown once in each browser; ?tur=1 starts it again',()=>{
 assert.equal(tour.shouldStartTour(null,''),true);
 assert.equal(tour.shouldStartTour('done',''),false);
 assert.equal(tour.shouldStartTour('done','?tur=1'),true);
 assert.equal(tour.shouldStartTour('done','?learn=de'),false);
 // A new member always gets it, even on a browser that has seen it.
 const auth=read('app/auth-form.tsx');assert.ok(auth.includes("if(register){try{localStorage.removeItem(TOUR_KEY);}catch{}}"));
 // Hesabım can start it again.
 assert.ok(read('app/account-panel.tsx').includes('<a className="btn secondary small" href="/?tur=1" data-account-tour>Site turunu başlat</a>'));
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
