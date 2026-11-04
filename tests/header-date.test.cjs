// The date on the header clock (the learner chose design 3 "Takvim yaprağı" of five drafts, 29 October 2026, with the
// clock moved to the other side): a calendar leaf with the German month short and the day of the month comes first,
// then the weekday and the part of the day, the clock last.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the leaf shows the German month short and the day of the month, before the words; the clock comes last',()=>{
 const bubble=read('app/site-greeting.tsx');
 assert.ok(bubble.includes("export const MONTH_SHORT=['JAN','FEB','MÄR','APR','MAI','JUN','JUL','AUG','SEP','OKT','NOV','DEZ'];"));
 assert.ok(bubble.includes('<span className="sg-leaf" aria-hidden="true"><span className="sg-leaf-month">{MONTH_SHORT[date.getMonth()]}</span><span className="sg-leaf-day">{date.getDate()}</span></span>'));
 const leaf=bubble.indexOf('<DateLeaf date={now}/>'),words=bubble.indexOf('<span className="site-greeting-words"'),clock=bubble.indexOf('<AnalogClock date={now} seconds={motion}/>');
 assert.ok(leaf>0&&leaf<words&&words<clock,'leaf, words, clock');
 // Screen readers hear the date too (the leaf itself is decoration).
 assert.ok(bubble.includes("+now.getDate()+'. '+MONTHS[now.getMonth()]+', '+PART_NOUN[moment.part]"));
});

test('the capsule is mirrored and the leaf fits every phone',()=>{
 const css=read('app/koko-theme.css');
 const at=css.indexOf('/* The date on the header clock');
 assert.ok(at>0,'the leaf styles');
 const part=css.slice(at);
 assert.ok(part.includes('.sg-leaf { flex:none; display:grid; grid-template-rows:auto 1fr; width:34px; height:36px;'));
 assert.ok(part.includes('.sg-leaf-month { display:block; background:linear-gradient(180deg,#f28a4b,#e8742c);'),'the orange strip');
 assert.ok(part.includes('.site-header:not(.lk-public-header) .site-greeting { padding-block:3px; padding-inline:8px 3px; }'),'room before the leaf, the clock near the end');
 assert.ok(part.includes('.sg-leaf { width:25px; height:27px; border-radius:6px; }'),'smaller on phones');
 assert.ok(part.includes('@media (max-width:340px) {')&&part.includes('.sg-leaf { width:21px; height:24px;'),'the narrowest phones');
 // The leaf styles come after the header row styles, so they win.
 assert.ok(at>css.indexOf('Header "Tek satır şerit"'));
});
