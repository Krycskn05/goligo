// Word times for the natural clips (8 November 2026): scripts/voices/make-voices.py measures where each word of a clip begins
// (word_times.py: faster-whisper word times aligned to the text, a few clips in one window) and stores <voice>/times.json;
// the manifest lists the voices that have one under "times"; lib/site-voices.ts fetches a voice's table once, when its first
// clip is asked for. A manifest without "times" (the old shape) still works. tests/read-along.test.cjs covers the player.
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {spawnSync}=require('node:child_process');
const dir=process.env.STUDY_CHECK_DIR;const load=name=>require(path.join(dir,name+'.js'));
const root=path.join(__dirname,'..');const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('the manifest lists the voices with word times; an old manifest has none',()=>{
 const voices=load('site-voices');
 const manifest=voices.parseVoiceManifest({version:9,voices:['F1','M1'],clips:{'Ja, in Beirut.':'0123456789abcdef'},times:['F1','zz',3]});
 assert.deepEqual(manifest.times,['F1']);
 assert.deepEqual(voices.parseVoiceManifest({version:1,voices:['F1'],clips:{}}).times,[]);
 assert.deepEqual(voices.parseVoiceManifest({version:1,voices:['F1'],clips:{},times:'F1'}).times,[]);
 assert.deepEqual(voices.availableSiteVoices(manifest).map(v=>v.id),['site:F1','site:M1'],'the rest as before');
});

test('a times table keeps only well-formed entries: a clip id and shares 0–1, one per word',()=>{
 const voices=load('site-voices');
 assert.deepEqual(voices.parseWordTimes({'0123456789abcdef':[0,0.5],'ffffffffffffffff':[0,2],bad:[0],'eeeeeeeeeeeeeeee':[],'dddddddddddddddd':[0,'x'],'cccccccccccccccc':[0,-0.1]}),{'0123456789abcdef':[0,0.5]});
 assert.deepEqual(voices.parseWordTimes(null),{});assert.deepEqual(voices.parseWordTimes([1]),{});
});

test('a voice\'s word times are fetched once, when its first clip is asked for; a voice without them costs no request',async()=>{
 const voices=load('site-voices');
 voices.setVoiceManifest(null);
 const id='0123456789abcdef';
 const manifest=voices.parseVoiceManifest({version:9,voices:['F1','M1'],clips:{'Ja, in Beirut.':id},times:['F1']});
 const calls=[];
 const fetcher=async url=>{calls.push(url);return {ok:true,json:async()=>({[id]:[0,0.25,0.4],ffffffffffffffff:[0,1.5]})};};
 assert.equal(voices.clipWordTimes('/voices/M1/'+id+'.mp3',manifest,fetcher),null,'no times for this voice: none, at once');
 assert.equal(voices.clipWordTimes('/voices/F1/x.mp3',manifest,fetcher),null,'not a clip address');
 assert.equal(voices.clipWordTimes('/voices/F1/'+id+'.mp3',null,fetcher),null,'no manifest yet');
 assert.equal(voices.clipWordTimes('/voices/F1/'+id+'.mp3',manifest,null),null,'no fetch (the server)');
 assert.equal(calls.length,0);
 const first=voices.clipWordTimes('/voices/F1/'+id+'.mp3',manifest,fetcher);
 assert.equal(typeof first.then,'function','still loading: a promise');
 const second=voices.clipWordTimes('/voices/F1/'+id+'.mp3',manifest,fetcher);
 assert.deepEqual(await first,[0,0.25,0.4]);assert.deepEqual(await second,[0,0.25,0.4]);
 assert.deepEqual(calls,['/voices/F1/times.json?v=9'],'one request per voice, with the manifest version against stale caches');
 assert.deepEqual(voices.clipWordTimes('/voices/F1/'+id+'.mp3',manifest,fetcher),[0,0.25,0.4],'known: at once');
 assert.equal(voices.clipWordTimes('/voices/F1/ffffffffffffffff.mp3',manifest,fetcher),null,'a bad entry was dropped');
 assert.equal(voices.clipWordTimes('/voices/F1/0000000000000000.mp3',manifest,fetcher),null,'a clip without an entry');
 assert.equal(calls.length,1);
 // a download that fails or a missing file: no times, and no new try for every clip
 voices.setVoiceManifest(null);
 const failing=async url=>{calls.push(url);throw new Error('offline');};
 assert.equal(await voices.clipWordTimes('/voices/F1/'+id+'.mp3',manifest,failing),null);
 assert.equal(voices.clipWordTimes('/voices/F1/'+id+'.mp3',manifest,failing),null);
 assert.equal(calls.length,2);
 voices.setVoiceManifest(null);
 const missing=async url=>{calls.push(url);return {ok:false,json:async()=>({})};};
 assert.equal(await voices.clipWordTimes('/voices/F1/'+id+'.mp3',manifest,missing),null);
 assert.equal(calls.length,3);
 voices.setVoiceManifest(null);
});

test('the site wires the times into the player and the render script writes them',()=>{
 assert.ok(read('app/study-shared.tsx').includes('resolve:(text:string,name:string)=>siteClipUrls(name,text),times:clipWordTimes}'),'the shared hook passes the times source');
 assert.ok(read('lib/site-voices.ts').includes('void clipWordTimes(url); // the voice\'s word times come along with its first clip'),'warming a clip loads its voice\'s times');
 const script=read('scripts/voices/make-voices.py');
 for(const piece of ["import word_times","'times': with_times","MEASURE_SHARE","os.environ.get('VOICE_TIMES', '1')","os.environ.get('VOICE_TIMES_MODEL', 'base')","def needs_times(text)"])assert.ok(script.includes(piece),piece);
 const helper=read('scripts/voices/word_times.py');
 for(const piece of ['word_timestamps=True',"language='de'",'def align(words, heard, duration)','class Measurer','def estimate(words)'])assert.ok(helper.includes(piece),piece);
 assert.match(read('AGENTS.md'),/times\.json/,'AGENTS.md says where the times live');
});

test('the alignment helper passes its own check on a fake transcript (python3 where available)',t=>{
 const run=spawnSync('python3',['-I',path.join(root,'scripts/voices/word_times.py'),'--self-test'],{encoding:'utf8'});
 if(run.error&&run.error.code==='ENOENT'){t.skip('python3 is not installed');return;}
 assert.equal(run.status,0,run.stderr||run.stdout);
 assert.match(run.stdout,/"self_test": "ok"/);
});
