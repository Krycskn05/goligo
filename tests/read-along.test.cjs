// Read-along by word (8 November 2026; the learner chose "Vurgu"): while a dialogue is read with "Tümünü dinle", the word
// being spoken is marked in its line. The clip player reports how far it is, the device voice its word boundaries, and
// lib/read-along.ts turns both into the word's index.
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const dir=process.env.STUDY_CHECK_DIR;const load=name=>require(path.join(dir,name+'.js'));
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

test('words are counted as runs of non-space characters, with their offsets',()=>{
 const {wordSpans,wordAtChar,partOffsets}=load('read-along');
 const spans=wordSpans('Das ist  meine Familie.');
 assert.deepEqual(spans.map(s=>[s.start,s.end,s.text]),[[0,3,'Das'],[4,7,'ist'],[9,14,'meine'],[15,23,'Familie.']]);
 assert.equal(wordAtChar(spans,0),0);assert.equal(wordAtChar(spans,5),1);assert.equal(wordAtChar(spans,8),1);assert.equal(wordAtChar(spans,15),3);
 assert.equal(wordAtChar(spans,-1),-1);
 assert.deepEqual(partOffsets(['Hallo.','Wie geht es?']),[0,7]);
});

test('the timeline gives every word its share of the clip: letters, a pause after a comma, a longer one after a sentence',()=>{
 const {wordTimeline,wordAtRatio,wordUnits,estimatedDurationMs}=load('read-along');
 assert.equal(wordUnits('in'),3);assert.equal(wordUnits('Ja,'),1+2+2.5);assert.equal(wordUnits('Beirut.'),1+6+4.5);
 const t=wordTimeline('Ja, in Beirut.');
 assert.equal(t.units,5.5+3+11.5+2);
 assert.deepEqual(t.starts.map(v=>Number(v.toFixed(4))),[0,Number((5.5/22).toFixed(4)),Number((8.5/22).toFixed(4))]);
 assert.equal(wordAtRatio(t,0),0);assert.equal(wordAtRatio(t,0.3),1);assert.equal(wordAtRatio(t,0.5),2);assert.equal(wordAtRatio(t,0.999),2);
 assert.equal(wordAtRatio(t,-0.1),-1);assert.equal(wordAtRatio(t,NaN),-1);
 assert.equal(wordAtRatio(wordTimeline(''),0.5),-1);
 assert.ok(estimatedDurationMs(t,1)>estimatedDurationMs(t,1.2));
});

test('a natural clip reports how far it is while it plays, and stops reporting when it ends',async()=>{
 const voices=load('site-voices');
 const audio={setAttribute(){},pause(){},play(){return Promise.resolve();},duration:2,currentTime:0.5};
 const ratios=[];let started=0,ended=0;
 const player=voices.createClipPlayer(()=>audio);
 player.play('/voices/F1/x.mp3',voices.SITE_CLIP_BASE_RATE,{onStart(){started++;},onEnd(){ended++;},onError(){},onProgress(r){ratios.push(r);}});
 audio.onplaying();
 await wait(200);
 assert.equal(started,1);assert.ok(ratios.length>=1,'reported while playing');assert.equal(ratios[ratios.length-1],0.25);
 audio.currentTime=1;audio.onended();
 const count=ratios.length;await wait(150);
 assert.equal(ended,1);assert.equal(ratios.length,count,'nothing more after the end');
 // without a listener nothing ticks
 player.play('/voices/F1/y.mp3',voices.SITE_CLIP_BASE_RATE,{onStart(){},onEnd(){},onError(){}});audio.onplaying();await wait(100);audio.onended();
});

test('the player tells which word it is at: the clip from its progress, the device voice from its boundary events',async()=>{
 const speech=load('german-speech');
 const words=[];const spoken=[];
 const synthesis={speaking:false,pending:false,paused:false,getVoices:()=>[],cancel(){},resume(){},speak(u){spoken.push(u);}};
 const player=speech.createGermanSpeechPlayer(synthesis,text=>({text}),()=>{},'de',{onWord:(k,t)=>words.push([k,t])});
 player.speak('Hallo Welt. Wie geht es?');
 const u=spoken[0];u.onstart();
 assert.deepEqual(words,[[0,'Hallo Welt. Wie geht es?']],'the first word at the start');
 u.onboundary({name:'word',charIndex:6});u.onboundary({name:'sentence',charIndex:0});u.onboundary({name:'word',charIndex:12});u.onboundary({name:'word',charIndex:12});
 assert.deepEqual(words.slice(1).map(w=>w[0]),[1,2],'a word per boundary event, sentences and repeats ignored');
 u.onend();
 assert.deepEqual(words[words.length-1],[-1,''],'none when the reading ends');
 // a clip: the ratio of its playing time becomes the word
 const clipWords=[];let events=null;
 const clips={player:{unlock(){},play(url,rate,ev){events=ev;},stop(){},loading:()=>false},resolve:()=>'/voices/F1/a.mp3'};
 const clipPlayer=speech.createGermanSpeechPlayer(synthesis,text=>({text}),()=>{},'de',{onWord:(k,t)=>clipWords.push([k,t])},clips);
 clipPlayer.speak('Ja, in Beirut.');
 events.onStart();events.onProgress(0);events.onProgress(0.1);events.onProgress(0.3);events.onProgress(0.6);events.onEnd();
 assert.deepEqual(clipWords.map(w=>w[0]),[0,1,2,-1]);
 assert.equal(clipWords[0][1],'Ja, in Beirut.');
});

test('the lessons mark the word with the CSS highlight API, outside React state',()=>{
 const ui=read('app/willkommen-ui.tsx');
 for(const piece of ["import {wordSpans} from '@/lib/read-along';",'export function showWord(line:HTMLElement,spoken:string,word:number)','registry.set(WORD,new Highlight(range))','if(lastLine.current&&lastText.current===text)showWord(lastLine.current,text,word);','if(lastWord.current>=0)showWord(line,activeText,lastWord.current);','function clearReading(){document.querySelectorAll(\'.\'+READING).forEach(line=>line.classList.remove(READING));clearWord();}'])assert.ok(ui.includes(piece),piece);
 assert.match(read('app/willkommen.css'),/::highlight\(l1a-word\) \{ background-color:#cfe6ff; \}/);
 const shared=read('app/study-shared.tsx');
 assert.ok(shared.includes('onWord:(word,text)=>{if(mounted)wordListeners.current.forEach(listener=>listener(word,text));}'),'the hook passes the word on');
 assert.ok(shared.includes('prepare,speak,stop,isActive,onWord}'),'the hook offers the subscription');
 assert.ok(read('lib/site-voices.ts').includes('onProgress?:(ratio:number)=>void'));
});

// Measured word times (8 November 2026): scripts/voices/word_times.py hears every clip with whisper and stores where each word
// begins (<voice>/times.json); the clip player uses them instead of the letter estimate when the clip that plays has them.
test('measured word starts become a timeline when they fit the text; otherwise the estimate stays',()=>{
 const {measuredTimeline,wordAtRatio,wordTimeline}=load('read-along');
 const measured=measuredTimeline('Ja, in Beirut.',[0.02,0.5,0.7]);
 assert.deepEqual(measured.starts,[0,0.5,0.7],'the first word begins with the clip');
 assert.deepEqual(measured.spans.map(s=>s.text),['Ja,','in','Beirut.']);
 assert.equal(measured.units,wordTimeline('Ja, in Beirut.').units);
 assert.equal(wordAtRatio(measured,0.3),0);assert.equal(wordAtRatio(measured,0.5),1);assert.equal(wordAtRatio(measured,0.95),2);
 assert.equal(measuredTimeline('Ja, in Beirut.',[0,0.5]),null,'one start per word');
 assert.equal(measuredTimeline('Ja, in Beirut.',null),null);assert.equal(measuredTimeline('Ja, in Beirut.',undefined),null);
 assert.equal(measuredTimeline('',[]),null);
 assert.equal(measuredTimeline('Ja, in Beirut.',[0,NaN,0.7]),null);assert.equal(measuredTimeline('Ja, in Beirut.',[0,'x',0.7]),null);
 assert.deepEqual(measuredTimeline('a b c',[0,0.6,0.4]).starts,[0,0.6,0.6],'no word before the one before it');
 assert.deepEqual(measuredTimeline('a b',[0,1.4]).starts,[0,1]);
});

test('the clip player prefers the measured times of the clip that plays and keeps the estimate without them',async()=>{
 const speech=load('german-speech');
 const synthesis={speaking:false,pending:false,paused:false,getVoices:()=>[],cancel(){},resume(){},speak(){}};
 const F1='/voices/F1/0123456789abcdef.mp3',M1='/voices/M1/0123456789abcdef.mp3';
 const make=(times,urls)=>{
  const words=[],asked=[];let events=null;
  const clips={player:{unlock(){},play(url,rate,ev){events=ev;},stop(){},loading:()=>false},resolve:()=>urls,...(times?{times:url=>{asked.push(url);return times(url);}}:{})};
  const player=speech.createGermanSpeechPlayer(synthesis,text=>({text}),()=>{},'de',{onWord:k=>words.push(k)},clips);
  return {words,asked,player,events:()=>events};
 };
 // The estimate for "Ja, in Beirut." starts its words at 0, 0.25 and 0.39; the measured clip at 0, 0.5 and 0.7.
 let p=make(()=>[0,0.5,0.7],[F1]);
 p.player.speak('Ja, in Beirut.');let e=p.events();e.onStart();e.onProgress(0.3);e.onProgress(0.45);e.onProgress(0.55);e.onProgress(0.75);e.onEnd();
 assert.deepEqual(p.words,[0,1,2,-1],'measured: "in" only from the middle');
 assert.deepEqual(p.asked,[F1],'asked for the clip that plays');
 p=make(()=>null,[F1]);
 p.player.speak('Ja, in Beirut.');e=p.events();e.onStart();e.onProgress(0.3);e.onProgress(0.45);e.onEnd();
 assert.deepEqual(p.words,[1,2,-1],'no times: the estimate');
 p=make(()=>[0,0.5],[F1]);
 p.player.speak('Ja, in Beirut.');e=p.events();e.onStart();e.onProgress(0.3);e.onEnd();
 assert.deepEqual(p.words,[1,-1],'times that do not fit the words: the estimate');
 p=make(null,[F1]);
 p.player.speak('Ja, in Beirut.');e=p.events();e.onStart();e.onProgress(0.3);e.onEnd();
 assert.deepEqual(p.words,[1,-1],'a player without a times source: the estimate');
 // times still loading: the estimate until they arrive
 let resolve;p=make(()=>new Promise(r=>{resolve=r;}),[F1]);
 p.player.speak('Ja, in Beirut.');e=p.events();e.onStart();e.onProgress(0.3);
 assert.deepEqual(p.words,[1]);
 resolve([0,0.5,0.7]);await wait(0);
 e.onProgress(0.45);e.onProgress(0.55);e.onProgress(0.75);e.onEnd();
 assert.deepEqual(p.words,[1,0,1,2,-1],'measured once they are known');
 // a failing times source does not stop the reading
 p=make(()=>Promise.reject(new Error('offline')),[F1]);
 p.player.speak('Ja, in Beirut.');e=p.events();e.onStart();await wait(0);e.onProgress(0.3);e.onEnd();
 assert.deepEqual(p.words,[1,-1]);
 p=make(()=>{throw new Error('broken');},[F1]);
 p.player.speak('Ja, in Beirut.');e=p.events();e.onStart();e.onProgress(0.3);e.onEnd();
 assert.deepEqual(p.words,[1,-1]);
 // another voice's clip (the chosen voice's clip failed before it started) brings its own times
 p=make(url=>url===M1?[0,0.6,0.8]:[0,0.5,0.7],[F1,M1]);
 p.player.speak('Ja, in Beirut.');e=p.events();e.onError();e=p.events();e.onStart();e.onProgress(0.55);e.onProgress(0.65);e.onProgress(0.85);e.onEnd();
 assert.deepEqual(p.asked,[F1,M1]);
 assert.deepEqual(p.words,[0,1,2,-1],'the second clip\'s "in" begins at 0.6');
});
