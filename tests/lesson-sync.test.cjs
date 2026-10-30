// Lesson progress on every device (30 October 2026, the learner: "my progress on the tablet does not show on the computer").
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const sync=require(path.join(compiled,'lesson-sync.js'));
const read=file=>fs.readFileSync(file,'utf8');

test('which browser keys travel with the account',()=>{
 const cases={'lernkoko-l1-part':'l1','lernkoko-l1a-scores':'l1','lernkoko-l1d-step':'l1','lernkoko-l1c-run':'l1','lernkoko-l12-scores':'l12','lernkoko-l12:a3':'l12','lernkoko-l12-ex:b':'l12','lernkoko-l12-hoeren:t4':'l12','lernkoko-l12-known:a':'l12','lernkoko-l15a-scores':'l15','lernkoko-l15-part':'l15','lernkoko-l15a-run':'l15'};
 for(const [key,lesson] of Object.entries(cases))assert.equal(sync.syncLessonOf(key),lesson,key);
 for(const key of ['lernkoko-l12-speed','lernkoko-effects-v1','lernkoko-tour-v1','lernkoko-sync-meta','lernkoko-l13-x','lernkoko-l1x-step','goligo-dil'])assert.equal(sync.syncLessonOf(key),null,key);
});

test('changes in the browser get a time; keys from before syncing get age 0; removals are kept',()=>{
 let meta=sync.scanLocal({'lernkoko-l15a-scores':'{"a":1}','lernkoko-effects-v1':'x'},{},1000);
 assert.deepEqual(Object.keys(meta),['lernkoko-l15a-scores']);assert.equal(meta['lernkoko-l15a-scores'].t,0);
 meta=sync.scanLocal({'lernkoko-l15a-scores':'{"a":1}'},meta,2000);assert.equal(meta['lernkoko-l15a-scores'].t,0,'unchanged keeps its time');
 meta=sync.scanLocal({'lernkoko-l15a-scores':'{"a":2}','lernkoko-l15a-step':'pano'},meta,3000);
 assert.equal(meta['lernkoko-l15a-scores'].t,3000);assert.equal(meta['lernkoko-l15a-step'].t,0);
 meta=sync.scanLocal({'lernkoko-l15a-scores':'{"a":2}'},meta,4000);
 assert.deepEqual(meta['lernkoko-l15a-step'],{h:'-',t:4000},'a removed key is remembered');
 const items=sync.localItems('l15',{'lernkoko-l15a-scores':'{"a":2}'},meta);
 assert.deepEqual(items,{'lernkoko-l15a-scores':{v:'{"a":2}',t:3000},'lernkoko-l15a-step':{v:null,t:4000}});
 assert.deepEqual(sync.localItems('l1',{'lernkoko-l15a-scores':'{"a":2}'},meta),{});
});

test('merging: the newer change wins, removals travel, unknown age never beats a known change',()=>{
 const kept={'lernkoko-l15a-step':{v:'pano',t:500},'lernkoko-l15a-run':{v:'{"test":{}}',t:600}};
 const merged=sync.mergeItems(kept,{'lernkoko-l15a-step':{v:'dinle',t:700},'lernkoko-l15a-run':{v:null,t:650},'lernkoko-l15-part':{v:'a',t:0}},9999);
 assert.deepEqual(merged['lernkoko-l15a-step'],{v:'dinle',t:700});
 assert.deepEqual(merged['lernkoko-l15a-run'],{v:null,t:650});
 assert.deepEqual(merged['lernkoko-l15-part'],{v:'a',t:0});
 assert.deepEqual(sync.mergeItems(kept,{'lernkoko-l15a-step':{v:'kapak',t:400}},9999)['lernkoko-l15a-step'],{v:'pano',t:500},'an older change loses');
 assert.deepEqual(sync.mergeItems(kept,{'lernkoko-l15a-step':{v:'kapak',t:0}},9999)['lernkoko-l15a-step'],{v:'pano',t:500},'unknown age loses');
});

test('first sync of two devices: score lists are joined, nothing done on either device is lost',()=>{
 const tablet={'lernkoko-l15a-scores':{v:JSON.stringify({eslestir:{right:6,total:6},test:{right:12,total:14}}),t:0}};
 const computer={'lernkoko-l15a-scores':{v:JSON.stringify({sirala:{right:5,total:5},test:{right:3,total:14}}),t:0}};
 const afterTablet=sync.mergeItems({},tablet,100);
 const afterComputer=sync.mergeItems(afterTablet,computer,200);
 const scores=JSON.parse(afterComputer['lernkoko-l15a-scores'].v);
 assert.deepEqual(Object.keys(scores).sort(),['eslestir','sirala','test']);
 assert.deepEqual(scores.test,{right:12,total:14},'the account (first device) keeps its own entry');
 assert.equal(afterComputer['lernkoko-l15a-scores'].t,200,'the joined list is new for every device');
 const write=sync.toWrite(afterComputer,{'lernkoko-l15a-scores':computer['lernkoko-l15a-scores'].v,'lernkoko-l15a-step':'x'});
 assert.deepEqual(Object.keys(write),['lernkoko-l15a-scores']);
 assert.deepEqual(sync.toWrite({'lernkoko-l15a-step':{v:null,t:5}},{'lernkoko-l15a-step':'x'}),{'lernkoko-l15a-step':null});
});

test('what the server accepts and stores',()=>{
 const items=sync.cleanItems('l12',{'lernkoko-l12:a1':{v:'{"v":{}}',t:5.7},'lernkoko-l15a-step':{v:'x',t:1},'lernkoko-l12-seen':{v:7,t:1},'lernkoko-l12-last':{v:'x',t:-1},'lernkoko-l12-known:a':{v:'x'.repeat(sync.SYNC_VALUE_MAX+1),t:1},'lernkoko-l12-ex:a':{v:null,t:3}});
 assert.deepEqual(items,{'lernkoko-l12:a1':{v:'{"v":{}}',t:5},'lernkoko-l12-ex:a':{v:null,t:3}});
 assert.deepEqual(sync.parseStored('l12','{"items":{"lernkoko-l12:a1":{"v":"1","t":2}}}'),{'lernkoko-l12:a1':{v:'1',t:2}});
 assert.deepEqual(sync.parseStored('l12','oops'),{});
 const route=read('app/api/ilerleme/route.ts');
 for(const piece of ['getChatGPTUser','signIn:true},401)',"origin!==new URL(request.url).origin","'sync:'+lesson",'mergeItems(kept,incoming,now)','SYNC_LESSON_MAX','db.batch(writes)'])assert(route.includes(piece),piece);
 assert(read('app/api/study/route.ts').includes("key NOT LIKE 'sync:%'"),'the study screens do not load the progress rows');
});

test('every lesson page reads progress from another device again; the sync and the letter row run on every page',()=>{
 const layout=read('app/layout.tsx');assert(layout.includes('<LetterBar/><LessonSync/>'));
 for(const [file,lesson,component] of [['app/willkommen-study.tsx','l1','WillkommenLesson'],['app/stadt-study.tsx','l15','StadtLesson'],['app/ausbildung-study.tsx','l12','AusbildungLesson'],['app/ausbildung-hoeren.tsx','l12','HoerenPage']]){
  const code=read(file);assert(code.includes(`useSyncVersion('${lesson}')`),file);assert(code.includes(`<${component} key={synced}`),file);
 }
 assert.equal((read('app/category-study.tsx').match(/\},\[course,home,synced\]\);/g)||[]).length,3,'the unit cards read Lektion 1, 12 and 15 again');
 const client=read('app/lesson-sync.tsx');
 for(const piece of ["fetch('/api/ilerleme'",'15000',"'visibilitychange'","'pagehide'",'response.status===401','SYNC_EVENT'])assert(client.includes(piece),piece);
});

test('special letters: ä ö ü ß Ä Ö Ü under German boxes that have no row of their own',()=>{
 const bar=read('app/letter-bar.tsx');
 assert(bar.includes("export const GERMAN_LETTERS=['ä','ö','ü','ß','Ä','Ö','Ü']"));
 for(const piece of ["startsWith('de')",'node!==document.documentElement','.umlaut-row',"addEventListener('touchstart',touch,{passive:false})",'onMouseDown={event=>event.preventDefault()}',"dispatchEvent(new Event('input',{bubbles:true}))",'visualViewport','el.readOnly||el.disabled'])assert(bar.includes(piece),piece);
 const css=read('app/globals.css');assert(css.includes('.letter-bar{position:fixed;'));assert(css.includes('body::after{content:"";display:block;height:var(--letter-bar-space,0px)}'));
});
