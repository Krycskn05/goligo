import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRequire} from 'node:module';
const compiled=process.env.STUDY_CHECK_DIR;
assert.ok(compiled,'Set STUDY_CHECK_DIR to compiled lib directory.');
const {createGermanSpeechPlayer,chooseGermanVoice,chooseStudyVoice,splitSpeechText,defaultSpeechRate,deviceStandIn,deviceVoiceKind}=createRequire(import.meta.url)(compiled+'/german-speech.js');

const local={name:'Deutsch lokal',lang:'de-DE',localService:true};
const remote={name:'Deutsch online',lang:'de-DE',localService:false};

function setup(t,voices=[remote,local],options={}){
 t.mock.timers.enable({apis:['setTimeout','Date']});
 const states=[];const utterances=[];
 const synth={voices,paused:false,speaking:false,pending:false,cancels:0,resumes:0,
  getVoices(){return this.voices;},
  speak(u){utterances.push(u);this.pending=true;},
  cancel(){this.cancels++;this.pending=false;this.speaking=false;},
  resume(){this.resumes++;this.paused=false;},
 };
 const player=createGermanSpeechPlayer(synth,text=>({text,voice:null}),state=>states.push(state),'de',options);
 const start=(u=utterances.at(-1))=>{synth.pending=false;synth.speaking=true;u.onstart({});};
 const end=(u=utterances.at(-1))=>{synth.pending=false;synth.speaking=false;u.onend({});};
 t.after(()=>player.stop());
 return {player,synth,states,utterances,start,end};
}

test('answers stay blocked from the tap through delayed playback and completion',t=>{
 const s=setup(t);s.player.speak('Ich habe einen Termin.');
 assert.equal(s.player.isActive(),true);assert.equal(s.states.at(-1).status,'loading');
 assert.equal(s.synth.cancels,0); // An idle engine must not cancel the new request.
 t.mock.timers.tick(4000);assert.equal(s.player.isActive(),true);
 s.start();assert.equal(s.states.at(-1).status,'speaking');
 s.end();assert.equal(s.player.isActive(),false);assert.equal(s.states.at(-1).warning,'');
});

test('an initially empty voice list still starts German from the user gesture',t=>{
 const s=setup(t,[]);s.player.speak('Guten Tag.');
 assert.equal(s.utterances.length,1);assert.equal(s.utterances[0].lang,'de-DE');
 assert.equal(s.utterances[0].voice,null);s.start();s.end();
 assert.equal(s.player.isActive(),false);
});

test('the first delayed pronunciation unlocks speech from the answer tap on an iOS-style engine',t=>{
 const s=setup(t);let tapping=false,unlocked=false;const enqueue=s.synth.speak.bind(s.synth);
 s.synth.speak=u=>{if(tapping)unlocked=true;if(unlocked)enqueue(u);};
 // Reproduce the original failure: first speak() from an effect callback is
 // silently ignored by an engine whose speech session has not been unlocked.
 s.player.speak('das Fenster');assert.equal(s.utterances.length,0);s.player.stop();
 const beforePrepare=s.synth.cancels;tapping=true;s.player.prepare();tapping=false;
 assert.equal(s.utterances.length,1);assert.equal(s.utterances[0].text,'');
 assert.equal(s.utterances[0].volume,0);assert(!s.player.isActive());assert.equal(s.synth.cancels,beforePrepare);s.end(s.utterances[0]);assert(!s.synth.pending);
 t.mock.timers.tick(800);s.player.speak('das Fenster');
 assert.equal(s.utterances.length,2);assert.equal(s.utterances[1].text,'das Fenster');
 s.start();s.end();assert(!s.player.isActive());
});

test('silent speech preparation is idempotent and never interrupts active listening',t=>{
 const s=setup(t);s.player.prepare();s.player.prepare();
 assert.equal(s.utterances.length,1);assert(!s.player.isActive());assert.equal(s.synth.cancels,0);s.end(s.utterances[0]);
 s.player.speak('die Tür');s.player.prepare();
 assert.equal(s.utterances.length,2);assert.equal(s.states.at(-1).text,'die Tür');
 s.start();s.end();
});

test('natural German is preferred while an explicit learner choice is preserved',()=>{
 const google={name:'Google Deutsch',lang:'de-DE',localService:false};
 const enhanced={name:'Anna (Enhanced)',lang:'de-DE',localService:true};
 const natural={name:'Microsoft Katja Online (Natural)',lang:'de-DE',localService:false};
 assert.equal(chooseGermanVoice([local,google]),google);
 assert.equal(chooseGermanVoice([google,enhanced]),enhanced);
 assert.equal(chooseGermanVoice([google,enhanced,natural]),natural);
 assert.equal(chooseGermanVoice([natural,local],local.name),local);
 assert.equal(chooseGermanVoice([google,local],'uninstalled voice'),google);
 assert.equal(chooseGermanVoice([{name:'English',lang:'en-US',localService:true}]),undefined);
});

test('English selection keeps its existing local voice preference',()=>{
 const englishLocal={name:'English local',lang:'en-GB',localService:true};
 const englishNatural={name:'English Natural',lang:'en-GB',localService:false};
 assert.equal(chooseStudyVoice([englishNatural,englishLocal],'en'),englishLocal);
});

test('Apple Siri voices and conversational natural German voices are preferred when advertised',()=>{
 const siri={name:'Helena',voiceURI:'com.apple.ttsbundle.siri_female_de-DE',lang:'de-DE',localService:true};
 const google={name:'Google Deutsch',lang:'de-DE',localService:false};
 const conrad={name:'Microsoft Conrad Online (Natural)',lang:'de-DE',localService:false};
 const katja={name:'Microsoft Katja Online (Natural)',lang:'de-DE',localService:false};
 const enhanced={name:'Anna (Enhanced)',lang:'de-DE',localService:true};
 assert.equal(chooseGermanVoice([google,local,siri]),siri);
 assert.equal(chooseGermanVoice([siri,enhanced]),enhanced);
 assert.equal(chooseGermanVoice([conrad,katja]),katja);
 assert.equal(chooseGermanVoice([katja,conrad],conrad.name),conrad);
});

test('short passages retain sentence-to-sentence intonation without cutting between utterances',()=>{
 const text='Hallo! Schön, dass du da bist. Wir lernen zusammen Deutsch.';
 assert.deepEqual(splitSpeechText(text),[text]);
 const long=Array(12).fill('Ich lerne jeden Tag ein bisschen Deutsch.').join(' ');
 const parts=splitSpeechText(long);
 assert(parts.length>1);assert(parts.every(part=>part.length<=180&&part.endsWith('.')));
 assert.equal(parts.join(' '),long);
});

test('calm German pace keeps the natural pitch and rejects a malformed rate',t=>{
 const s=setup(t);s.player.speak('Guten Morgen.');
 assert.equal(s.utterances[0].rate,defaultSpeechRate('de'));assert.equal(s.utterances[0].pitch,1);
 s.player.speak('Hallo.',{rate:NaN});assert.equal(s.utterances[1].rate,defaultSpeechRate('de'));
});

test('paused engines resume before speech',t=>{
 const s=setup(t);s.synth.paused=true;s.player.speak('Hallo.');
 assert.equal(s.synth.resumes,1);assert.equal(s.synth.paused,false);
});

test('old start/end/error events cannot change a newer question or playback',t=>{
 const s=setup(t);s.player.speak('Der alte Termin.');const old=s.utterances[0];
 s.player.stop();s.player.speak('Die neue Frage.');
 old.onstart({});old.onend({});old.onerror({error:'interrupted'});
 assert.equal(s.states.at(-1).text,'Die neue Frage.');
 assert.equal(s.states.at(-1).status,'loading');assert.equal(s.player.isActive(),true);
 s.start();s.end();assert.equal(s.player.isActive(),false);
});

test('a queued request times out, clears the engine and cannot start after an answer',t=>{
 const s=setup(t,[]);s.player.speak('Um zehn Uhr.');const old=s.utterances[0];
 t.mock.timers.tick(7000);
 assert.equal(s.player.isActive(),false);assert.equal(s.synth.pending,false);
 assert.match(s.states.at(-1).warning,/Ses başlamadı/);
 const events=s.states.length;old.onstart({});old.onend({});
 assert.equal(s.states.length,events);
});

test('an online voice that never starts retries the same part with local speech',t=>{
 const s=setup(t);s.player.speak('Das Waschbecken.',{voiceName:remote.name,rate:0.65});
 const stalled=s.utterances[0];
 // Some engines dispatch cancellation events synchronously from cancel().
 const cancel=s.synth.cancel.bind(s.synth);
 s.synth.cancel=()=>{cancel();stalled.onend({});stalled.onerror({error:'interrupted'});};
 t.mock.timers.tick(7000);
 assert.equal(s.synth.cancels,1);assert.equal(s.utterances.length,2);
 const fallback=s.utterances[1];
 assert.equal(fallback.text,stalled.text);assert.equal(fallback.voice,local);
 assert.equal(fallback.rate,0.65);assert.equal(s.player.isActive(),true);
 const events=s.states.length;stalled.onstart({});stalled.onend({});stalled.onerror({error:'network'});
 assert.equal(s.states.length,events);assert.equal(s.utterances.length,2);
 s.start(fallback);s.end(fallback);assert.equal(s.player.isActive(),false);
});

test('a stalled advertised voice can fall back once to the device-selected voice',t=>{
 const s=setup(t,[remote]);s.player.speak('Die Tür.',{voiceName:remote.name});
 t.mock.timers.tick(7000);
 assert.equal(s.utterances.length,2);assert.equal(s.utterances[1].voice,null);
 assert.equal(s.utterances[1].lang,'de-DE');
 s.start();s.end();assert.equal(s.player.isActive(),false);
});

test('a startup fallback that also stalls terminates and ignores both old requests',t=>{
 const s=setup(t);s.player.speak('Der Keller.');
 t.mock.timers.tick(7000);t.mock.timers.tick(7000);
 assert.equal(s.utterances.length,2);assert.equal(s.player.isActive(),false);
 assert.equal(s.synth.pending,false);assert.equal(s.synth.cancels,2);
 assert.match(s.states.at(-1).warning,/Ses başlamadı/);
 const events=s.states.length;
 for(const request of s.utterances){request.onstart({});request.onend({});request.onerror({error:'network'});}
 t.mock.timers.tick(90000);assert.equal(s.states.length,events);assert.equal(s.utterances.length,2);
});

test('the startup watchdog can recover when local voices load after the tap',t=>{
 const s=setup(t,[]);s.player.speak('Das Fenster.');s.synth.voices=[local];
 t.mock.timers.tick(7000);
 assert.equal(s.utterances.length,2);assert.equal(s.utterances[1].voice,local);
 s.start();s.end();assert.equal(s.player.isActive(),false);
});

test('stopping mid-passage cancels the remaining chunks and their callbacks',t=>{
 const s=setup(t);s.player.speak('Guten Tag. Ich möchte einen Termin vereinbaren.');
 s.start();const old=s.utterances[0];s.player.stop();old.onend({});
 assert.equal(s.utterances.length,1);assert.equal(s.player.isActive(),false);
 t.mock.timers.tick(90000);assert.equal(s.states.at(-1).warning,'');
});

test('multi-sentence playback releases answers only after the final part',t=>{
 const s=setup(t);const text='Guten Tag. Ich möchte einen Termin vereinbaren. Geht es am Montag?';
 s.player.speak(text);const parts=splitSpeechText(text);
 for(let i=0;i<parts.length;i++){
  assert.equal(s.utterances.at(-1).text,parts[i]);s.start();s.end();
  assert.equal(s.player.isActive(),i<parts.length-1);
 }
 assert.equal(s.utterances.length,parts.length);
});

test('a failed online voice retries the same text with local German',t=>{
 const s=setup(t);s.player.speak('Ich komme um elf Uhr.',{voiceName:remote.name,rate:0.65});
 const failed=s.utterances[0];failed.onerror({error:'network'});
 assert.equal(s.utterances.length,2);assert.equal(s.utterances[1].voice,local);
 assert.equal(s.utterances[1].text,failed.text);assert.equal(s.utterances[1].rate,0.65);
 failed.onend({});assert.equal(s.player.isActive(),true);s.start();s.end();
});

test('network failure falls back locally even when another natural online voice exists',t=>{
 const first={name:'First Natural',lang:'de-DE',localService:false};
 const second={name:'Second Neural',lang:'de-DE',localService:false};
 const s=setup(t,[first,second,local]);s.player.speak('Das Fenster.');
 assert.equal(s.utterances[0].voice,first);
 s.utterances[0].onerror({error:'network'});assert.equal(s.utterances[1].voice,local);
 s.start();s.end();assert.equal(s.player.isActive(),false);
});

test('a voice that becomes available after the first tap can recover',t=>{
 const s=setup(t,[]);s.player.speak('Das Bürgerbüro.');s.synth.voices=[local];
 s.utterances[0].onerror({error:'voice-unavailable'});
 assert.equal(s.utterances[1].voice,local);s.start();s.end();
});

test('an unrecoverable audio error releases controls with a readable retry message',t=>{
 const s=setup(t,[]);s.player.speak('Hallo.');s.utterances[0].onerror({error:'not-allowed'});
 assert.equal(s.player.isActive(),false);assert.match(s.states.at(-1).warning,/yeniden dokun/);
 assert.equal(s.synth.pending,false);
});

test('a playback that never ends is cancelled instead of blocking the quiz forever',t=>{
 const s=setup(t);s.player.speak('Hallo.');s.start();t.mock.timers.tick(30000);
 assert.equal(s.player.isActive(),false);assert.match(s.states.at(-1).warning,/Dinleme kesildi/);
});

test('all course listening texts preserve every word when split into shorter utterances',()=>{
 const require=createRequire(import.meta.url);
 const compiled=process.env.STUDY_CHECK_DIR;assert.ok(compiled,'Set STUDY_CHECK_DIR to compiled lib directory.');
 const {questions}=require(compiled+'/course.js');
 let checked=0;
 for(const q of questions){if(!q.audio)continue;
  const chunks=splitSpeechText(q.audio);
  assert.equal(chunks.join(' '),q.audio.replace(/\s+/g,' ').trim(),q.id);
  assert.ok(chunks.every(chunk=>chunk.length<=180),q.id);checked++;
 }
 assert.ok(checked>0);console.log(`Validated ${checked} listening texts.`);
});


test('asynchronous native cancellation finishes before a replacement request is queued',t=>{
 const s=setup(t,[local],{cancelDelayMs:100});
 const cancel=s.synth.cancel.bind(s.synth);let cancelled=[];
 s.synth.cancel=()=>{cancel();setTimeout(()=>{cancelled=s.utterances.slice();s.synth.pending=false;},50);};
 s.player.speak('der Tisch');const old=s.utterances[0];
 s.player.speak('die Lampe');assert.equal(s.utterances.length,1);assert(s.player.isActive());
 t.mock.timers.tick(50);assert.equal(cancelled.length,1);assert.equal(s.utterances.length,1);
 t.mock.timers.tick(50);assert.equal(s.utterances.length,2);assert.equal(s.utterances[1].text,'die Lampe');assert(s.synth.pending);
 old.onend({});assert.equal(s.states.at(-1).text,'die Lampe');s.start();s.end();assert(!s.player.isActive());
});

test('skipping while replacement speech waits cancels its timer and re-primes after page hiding',t=>{
 const s=setup(t,[local],{cancelDelayMs:100});s.player.prepare();s.end(s.utterances[0]);
 s.player.speak('der Tisch');s.player.speak('die Lampe');s.player.stop();
 t.mock.timers.tick(300);assert.equal(s.utterances.length,2);assert(!s.player.isActive());
 s.player.resetPreparation();s.player.prepare();assert.equal(s.utterances.at(-1).text,'');
});

test('a person whose natural voice has no clip yet still sounds like themselves on the device voice (25 October 2026)',t=>{
 const anna={name:'Anna',lang:'de-DE',localService:true},markus={name:'Markus',lang:'de-DE',localService:true},google={name:'Google Deutsch',lang:'de-DE',localService:false};
 assert.equal(deviceVoiceKind(anna),'female');assert.equal(deviceVoiceKind(markus),'male');assert.equal(deviceVoiceKind(google),'female');assert.equal(deviceVoiceKind(local),null);
 // A man's line takes a man's device voice when there is one; women take a woman's.
 assert.equal(deviceStandIn([anna,markus],'de','site:M2').voice,markus);assert.equal(deviceStandIn([anna,markus],'de','site:F2').voice,anna);
 // Two women never share a pitch; on a woman's voice only, men are read clearly lower.
 const women=['F1','F2','F3','F4','F5'].map(style=>deviceStandIn([anna],'de','site:'+style).pitch);assert.equal(new Set(women).size,5);
 const men=['M1','M2','M3','M4','M5'].map(style=>deviceStandIn([anna],'de','site:'+style).pitch);assert.equal(new Set(men).size,5);assert(men.every(pitch=>pitch<0.85),men.join());
 assert(['M1','M2','M3','M4','M5'].map(style=>deviceStandIn([anna,markus],'de','site:'+style).pitch).every(pitch=>pitch>0.9),'a man\'s own device voice keeps a natural pitch');
 // Not a site voice (the learner's own device voice): unchanged.
 assert.deepEqual(deviceStandIn([anna,markus],'de','Markus'),{voice:markus,pitch:1});assert.equal(deviceStandIn([anna],'de','').pitch,1);
 // The player uses it when a site voice has no clip.
 const s=setup(t,[anna,markus]);s.player.speak('Hallo Yasemin!',{voiceName:'site:F2'});
 assert.equal(s.utterances[0].voice,anna);assert.equal(s.utterances[0].pitch,deviceStandIn([anna,markus],'de','site:F2').pitch);
 s.start();s.end();s.player.speak('Guten Tag.',{voiceName:'site:M2'});assert.equal(s.utterances.at(-1).voice,markus);
});
