import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const compiled=process.env.STUDY_CHECK_DIR;
assert.ok(compiled,'Set STUDY_CHECK_DIR to compiled lib directory.');
const require=createRequire(import.meta.url);
const voices=require(compiled+'/site-voices.js');
const speech=require(compiled+'/german-speech.js');
const effects=require(compiled+'/effect-sounds.js');
const copy=require(compiled+'/effects-copy.js');

const manifest=voices.parseVoiceManifest({version:3,voices:['F1','M2','bad'],clips:{'das  Haus ':'0123456789abcdef','Hallo!':'fedcba9876543210','x':'not-a-hash'}});

test('site voice manifest: normalised lookup, default voice and safe parsing',()=>{
 assert.equal(voices.normalizeSpeechText('  das \n Haus  '),'das Haus');
 assert.deepEqual(manifest.voices,['F1','M2']);
 assert.equal(manifest.clips['das Haus'],'0123456789abcdef');
 assert.equal(manifest.clips.x,undefined);
 assert.equal(voices.parseVoiceManifest(null),null);
 assert.equal(voices.parseVoiceManifest({voices:'F1'}),null);
 assert.deepEqual(voices.availableSiteVoices(manifest).map(v=>v.id),['site:F1','site:M2']);
 assert.equal(voices.resolveSiteVoice('',manifest).id,voices.DEFAULT_SITE_VOICE,'automatic uses the default site voice');
 assert.equal(voices.resolveSiteVoice('site:M2',manifest).name,'Felix');
 assert.equal(voices.resolveSiteVoice('site:F3',manifest),undefined,'a voice without clips is not used');
 assert.equal(voices.resolveSiteVoice('Anna',manifest),undefined,'a chosen device voice stays a device voice');
 assert.equal(voices.resolveSiteVoice('',null),undefined);
 const lena=voices.siteVoiceById('site:F1');
 assert.equal(voices.siteClipUrl(lena,'das   Haus',manifest),'/voices/F1/0123456789abcdef.mp3');
 assert.equal(voices.siteClipUrl(lena,'die Küche',manifest),null);
 assert.equal(voices.clipPlaybackRate(0.94),1);
 assert.ok(Math.abs(voices.clipPlaybackRate(0.65)-0.65/0.94)<1e-9);
 assert.equal(voices.clipPlaybackRate(5),1.3);
 assert.equal(voices.siteVoices.length,10);
 assert.equal(new Set(voices.siteVoices.map(v=>v.name)).size,10);
 assert.match(voices.voiceGreeting(lena),/Lena/);
});

test('an old device-voice choice moves once to the natural site voice; later choices are kept',()=>{
 assert.equal(voices.savedVoiceName({voiceName:'Helena',rate:'0.94'},'de'),'','a pre-site-voice choice falls back to automatic (Lena)');
 assert.equal(voices.savedVoiceName({voiceName:'Helena',voices:voices.VOICE_PREFERENCE_VERSION},'de'),'Helena','a device voice chosen later stays');
 assert.equal(voices.savedVoiceName({voiceName:'site:M2'},'de'),'site:M2');
 assert.equal(voices.savedVoiceName({voiceName:'Samantha'},'en'),'Samantha','other courses are untouched');
 assert.equal(voices.savedVoiceName(null,'de'),'');assert.equal(voices.savedVoiceName({voiceName:3},'de'),'');
 const shared=readFileSync('app/study-shared.tsx','utf8');
 assert.ok(shared.includes('savedVoiceName(saved,course)')&&shared.includes('voices:VOICE_PREFERENCE_VERSION'));
 assert.ok(readFileSync('app/learning-effects.tsx','utf8').includes('const deviceVoice=savedDevice??chooseGermanVoice(speech.voices)'));
});

function setup(t,resolve){
 t.mock.timers.enable({apis:['setTimeout','Date']});
 const states=[];const utterances=[];const plays=[];let unlocks=0,stops=0;
 const synth={paused:false,speaking:false,pending:false,getVoices:()=>[{name:'Anna',lang:'de-DE',localService:true}],speak(u){if(u.text)utterances.push(u);this.pending=true;},cancel(){this.pending=false;this.speaking=false;},resume(){}};
 const player={unlock(){unlocks++;},play(url,rate,events){plays.push({url,rate,events});},stop(){stops++;}};
 const controller=speech.createGermanSpeechPlayer(synth,text=>({text}),state=>states.push(state),'de',{},{player,resolve});
 t.after(()=>controller.stop());
 return {controller,states,utterances,plays,counts:()=>({unlocks,stops})};
}

test('a natural clip plays when available and the device voice is the fallback',t=>{
 const s=setup(t,(text,name)=>name.startsWith('site:')||name===''?'/voices/F1/a.mp3':null);
 s.controller.prepare();assert.equal(s.counts().unlocks,1,'the clip element is unlocked inside the tap');
 s.controller.speak('das Haus',{voiceName:'',rate:0.94});
 assert.equal(s.plays.length,1);assert.equal(s.utterances.length,0);assert.equal(s.states.at(-1).status,'loading');
 s.plays[0].events.onStart();assert.equal(s.states.at(-1).status,'speaking');
 s.plays[0].events.onEnd();assert.equal(s.controller.isActive(),false);
 // A clip that fails before it starts is spoken by the device instead.
 s.controller.speak('die Küche',{voiceName:'site:F1',rate:0.65});
 s.plays[1].events.onError();
 assert.equal(s.utterances.length,1);assert.equal(s.utterances[0].text,'die Küche');assert.equal(s.utterances[0].voice.name,'Anna');assert.equal(s.utterances[0].rate,0.65);
 // A clip that never starts also falls back after a short wait.
 s.controller.speak('der Flur',{voiceName:'site:F1'});t.mock.timers.tick(4100);
 assert.equal(s.utterances.at(-1).text,'der Flur');
 // A device voice chosen by the learner never uses clips.
 const before=s.plays.length;s.controller.speak('das Bad',{voiceName:'Anna'});
 assert.equal(s.plays.length,before);assert.equal(s.utterances.at(-1).text,'das Bad');
 s.controller.stop();assert.ok(s.counts().stops>0);
});

test('late clip events after stop or a newer request are ignored',t=>{
 const s=setup(t,()=>'/voices/F1/a.mp3');
 s.controller.speak('eins');const first=s.plays[0];
 s.controller.speak('zwei');first.events.onError();
 assert.equal(s.utterances.length,0,'the old clip error does not start the device voice');
 s.plays[1].events.onStart();s.controller.stop();s.plays[1].events.onEnd();
 assert.equal(s.controller.isActive(),false);
});

test('every effect has a rendered sound, a fallback recipe and readable labels',()=>{
 const folder=mkdtempSync(join(tmpdir(),'lk-sfx-'));
 const output=execFileSync(process.execPath,['scripts/sounds/make-sounds.mjs',folder],{encoding:'utf8'});
 assert.match(output,/hazır/);
 const info=JSON.parse(readFileSync(join(folder,'manifest.json'),'utf8'));
 const rendered=Object.keys(info.durations).sort();
 assert.deepEqual(rendered,Object.keys(effects.soundRecipes).sort());
 for(const id of rendered){
  const file=readFileSync(join(folder,id+'.wav'));
  assert.equal(file.toString('ascii',0,4),'RIFF',id);assert.equal(file.readUInt32LE(24),44100,id);
  const samples=(file.length-44)/2;let peak=0;for(let i=0;i<samples;i++)peak=Math.max(peak,Math.abs(file.readInt16LE(44+i*2)));
  assert.ok(peak>3000&&peak<=0.8*32767,id+' peak '+peak);
  assert.ok(info.durations[id]>=0.1&&info.durations[id]<=1.7,id+' duration');
  assert.ok(effects.soundDuration(id)*1000+1200>info.durations[id]*1000,id+' playback timer outlasts the sound');
 }
 assert.ok(['tap','tap2','tap3'].includes(effects.nextTapSound()));
 const languages=['tr','de','en','ar','uk','fr','es','ru','fa','pl','it','pt'];
 for(const key of ['whoosh','voiceTitle','voiceFemale','voiceMale','voiceSpeed','voicePreview','effectsTitle',...effects.wrongSoundIds])
  for(const language of languages)assert.ok(copy.effectsText(language,key)?.trim(),key+':'+language);
});

test('the voice list covers each greeting, the speech pages and the deploy step',()=>{
 const texts=JSON.parse(execFileSync(process.execPath,['scripts/voices/list-texts.cjs'],{encoding:'utf8',env:{...process.env,STUDY_CHECK_DIR:compiled}}));
 for(const voice of voices.siteVoices)assert.ok(texts.includes(voices.voiceGreeting(voice)),voice.name);
 assert.ok(texts.includes(speech.germanSpeechPreview));
 assert.equal(new Set(texts).size,texts.length);
 assert.ok(texts.every(text=>text===voices.normalizeSpeechText(text)));
 assert.match(readFileSync('ci/yayin.sh','utf8'),/s_sesler/);
 assert.match(readFileSync('package.json','utf8'),/make-sounds\.mjs && node scripts\/run-framework\.mjs build/);
 const shared=readFileSync('app/study-shared.tsx','utf8');
 assert.ok(shared.includes('createClipPlayer()')&&shared.includes('SPEECH_CHANGED'));
 assert.ok(existsSync('.github/workflows/sesler.yml'),'the voice workflow exists');
});
