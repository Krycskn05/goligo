// The lessons' choice exercises that show one question at a time go on by themselves 3 seconds after the answer (the
// learner asked, 8 November 2026, as the Kelime Kasası does since 4 November): no "Sonraki" button, a thin line shows the wait.
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const ui=read('app/willkommen-ui.tsx');

test('the shared hook waits 3 seconds, then for the reading of the right answer, and while the page is hidden',()=>{
 assert.match(ui,/export const AUTO_NEXT_MS=3000;const AUTO_NEXT_GRACE_MS=6000;/);
 const hook=ui.slice(ui.indexOf('export function useAutoNext('),ui.indexOf('export function AutoNextBar('));
 assert.ok(hook.includes('busy.current&&now<due+AUTO_NEXT_GRACE_MS'),'waits while the answer is still being read');
 assert.ok(hook.includes('if(document.hidden)due=Math.max(due,now+AUTO_NEXT_MS)'),'waits while the page is hidden');
 assert.ok(hook.includes('return()=>clearTimeout(timer);'),'the timer goes with the question');
 assert.match(ui,/export function AutoNextBar\(\)\{return <span className="l1a-auto" aria-hidden="true"\/>;\}/);
 assert.match(read('app/willkommen.css'),/\.l1a-auto \{[^}]*animation:l1a-auto 3s linear forwards;/);
});

const quizzes={
 'app/willkommen-ui.tsx':'useAutoNext(picked!==null&&!over,speech,()=>advance(i,score));', // every lesson's test
 'app/orte-steps.tsx':'useAutoNext(picked!==null&&!over,speech,next);', // Lektion 3 quizzes
 'app/familie-steps.tsx':'useAutoNext(picked!==null&&!over,speech,next);', // Lektion 4 quizzes
 'app/alltag-steps.tsx':'useAutoNext(picked!==null&&!over,speech,next);', // Lektion 5 quizzes
 'app/berufe-a-steps.tsx':'useAutoNext(picked!==null&&!over,speech,next);', // Lektion 2A pictures
 'app/berufe-c-steps.tsx':'useAutoNext(picked!==null&&!ended,speech,next);', // Lektion 2C numbers heard
 'app/stadt-a-steps.tsx':'useAutoNext(picked!==null&&!over,speech,next);', // Lektion 15A Mei's questions
};
for(const [file,call] of Object.entries(quizzes))test(file+' goes on by itself and shows the wait',()=>{
 const page=read(file);
 assert.ok(page.includes(call),file+' calls useAutoNext');
 assert.ok(page.includes('<AutoNextBar/>'),file+' shows the wait');
 assert.ok(!/picked!==null&&!over&&<button[^\n]*ut\('Sonraki'\)/.test(page),file+' has no "Sonraki" button after a choice');
 assert.ok(!page.includes('setTimeout(()=>advance(i,total),1600)')&&!page.includes('setTimeout(next,1800)'),file+' keeps no timer of its own');
});
