// Nesne Kasası after an answer (the learner asked, 4 November 2026: no scrolling down after a right or wrong answer on
// phone, tablet and computer; of three designs they chose "Yan yana"). Checked in a browser at 390×720, 820×1080 and
// 1366×680: "Sonraki" is on the screen in Gör ve Seç, Yazarak Pekiştir and Dinle ve Bul.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the answered question card puts the result next to the picture, only in Nesne Kasası',()=>{
 const page=read('app/object-study.tsx');
 assert.ok(page.includes(`<article className={'object-question panel'+(feedback?' vault-answered':'')+(session.mode==='listen'?' vault-listen':'')}>`));
 // Fiil Atölyesi uses the same card classes; it keeps its own layout.
 for(const file of ['app/verb-study.tsx','app/housing-study.tsx'])assert.ok(!read(file).includes('vault-answered'),file);
 const css=read('app/koko-theme.css');
 for(const rule of [
  '.toon-app .object-question.vault-answered { display:grid; grid-template-columns:minmax(0,2fr) minmax(0,3fr);',
  '.toon-app .object-question.vault-answered>* { grid-column:1 / -1; }',
  '.toon-app .object-question.vault-answered>.object-picture { grid-row:2; grid-column:1;',
  '.toon-app .object-question.vault-answered>#object-feedback { grid-row:2; grid-column:2;',
  // Dinle ve Bul: the card takes the place of the listening buttons, over the whole width.
  '.toon-app .object-question.vault-answered>.vault-listen-player { display:none; }',
  '.toon-app .object-question.vault-answered.vault-listen>#object-feedback { grid-column:1 / -1; }',
  // Wide screens: the four listening pictures in one row.
  '.toon-app .object-question.vault-listen>.vault-listening-options { grid-template-columns:repeat(4,minmax(0,1fr)); }',
 ])assert.ok(css.includes(rule),rule);
 // The card keeps its "Tekrar dinle" and "Sonraki" buttons (only the layout changes).
 assert.match(page,/<button type="button" className="btn object-next" disabled=\{busy\} onClick=\{next\}>/);
 assert.match(page,/onClick=\{\(\)=>speech\.speak\(pronunciation\)\}><Volume2 size=\{18\}\/>\{text\('repeatAudio'\)\}<\/button>/);
});
