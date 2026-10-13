import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAnswerFeedbackPlayer} from '../lib/answer-feedback.ts';

function setup({silent=false}={}) {
 const events=[],callbacks=[];
 const cue=kind=>after=>{events.push(kind);callbacks.push(after);if(silent)after();};
 const sound={prepare(){events.push('prepare');},correct:cue('correct'),wrong:cue('wrong'),
  stop(){events.push('stop-effect');},complete(){events.push('complete');}};
 const speech={prepare(){events.push('prepare-speech');},speak(text){events.push('speak:'+text);},stop(){events.push('stop-speech');}};
 const player=createAnswerFeedbackPlayer(sound,speech,waiting=>events.push('waiting:'+waiting));
 return {events,callbacks,player};
}
test('correct and incorrect submissions finish their effect before the canonical pronunciation',()=>{
 for(const correct of [true,false]){
  const s=setup();s.player.answer(correct,'das Fenster');
  assert(s.player.isWaiting());assert(s.events.includes(correct?'correct':'wrong'));
  assert(s.events.indexOf('prepare-speech')<s.events.indexOf(correct?'correct':'wrong'),'speech permission prepared synchronously before the effect');
  assert(!s.events.some(event=>event.startsWith('speak:')));
  s.callbacks[0]();assert(!s.player.isWaiting());
  assert.deepEqual(s.events.slice(-2),['speak:das Fenster','waiting:false']);
  s.callbacks[0]();assert.equal(s.events.filter(event=>event==='speak:das Fenster').length,1);
 }
});
test('the next-question action can cancel a cue immediately without pronouncing its old answer',()=>{
 const s=setup();s.player.answer(true,'der Tisch');
 s.player.stop();s.callbacks[0]();
 assert(!s.player.isWaiting());assert(!s.events.includes('speak:der Tisch'));
});
test('article puzzles and sentence gaps speak their supplied complete correct form',()=>{
 for(const text of ['die Betten','der Kühlschrank','Wir haben eine Wohnung gefunden.','the window']){
  const s=setup();s.player.answer(false,text);s.callbacks[0]();
  assert(s.events.includes('speak:'+text));
 }
});
test('muted or unavailable effects still pronounce the answer and release the cue lock',()=>{
 const s=setup({silent:true});s.player.answer(true,'die Tür');
 assert(!s.player.isWaiting());assert(s.events.includes('speak:die Tür'));
});
test('exiting, hiding the page or changing languages cancels any delayed pronunciation',()=>{
 const s=setup();s.player.answer(false,'der alte Tisch');s.player.stop();const stopped=s.events.length;
 s.callbacks[0]();assert.equal(s.events.length,stopped);assert(!s.player.isWaiting());
});
test('a newer submission invalidates callbacks belonging to the previous question',()=>{
 const s=setup();s.player.answer(false,'der Tisch');s.player.answer(true,'die Lampe');
 s.callbacks[0]();assert(!s.events.includes('speak:der Tisch'));assert(s.player.isWaiting());
 s.callbacks[1]();assert(s.events.includes('speak:die Lampe'));assert(!s.player.isWaiting());
});
test('round completion cannot revive the pronunciation of an old answer',()=>{
 const s=setup();s.player.answer(true,'das Bett');s.player.complete();s.callbacks[0]();
 assert(s.events.includes('complete'));assert(!s.events.includes('speak:das Bett'));assert(!s.player.isWaiting());
});
