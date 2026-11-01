// Read-along (2 November 2026, the learner: while a dialogue is read the page should move down with the sentences):
// app/willkommen-ui.tsx marks the line being read and scrolls to it during "read one after the other" (speakAll).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('dialogue lines are followed and marked while a dialogue is read, not on a single tap',()=>{
 const ui=read('app/willkommen-ui.tsx');
 for(const piece of ['export function findReadLine(',"querySelectorAll<HTMLElement>('.l1a-line')","line.querySelector('.l1a-de')",'scrollIntoView({block:\'center\'','following.current=true','handScroll.current=true'])assert(ui.includes(piece),piece);
 assert(/const speakOne=useCallback\(\(item:SayItem\)=>\{queue\.current=\[\];following\.current=false;clearReading\(\);/.test(ui),'a single tap does not scroll');
 assert(/prefers-reduced-motion: reduce/.test(ui),'no smooth scrolling when motion is off');
 assert(read('app/willkommen.css').includes('.l1a-line.l1a-reading .l1a-bubble'),'the line being read is ringed');
});
