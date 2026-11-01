// Word boxes under a gap (2 November 2026, the learner: a faded word gave the answer away): every word in the box looks
// the same in every lesson, also when it is already in another gap.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('no word of a gap box is faded because it is used in another gap',()=>{
 const ui=read('app/willkommen-ui.tsx');
 assert(!ui.includes("' used'"),'no used class on a choice word');
 assert(!/used\?:readonly string\[\]/.test(ui),'WordChoice has no used list');
 for(const file of ['app/willkommen-ui.tsx','app/stadt-a-steps.tsx','app/willkommen-b-steps.tsx','app/willkommen-c-steps.tsx','app/willkommen-d-steps.tsx','app/willkommen-study.tsx'])
  assert(!/<WordChoice[^>]*\bused=/.test(read(file)),file);
 assert(!read('app/willkommen.css').includes('.l1a-choice-word.used'),'no faded style');
});
