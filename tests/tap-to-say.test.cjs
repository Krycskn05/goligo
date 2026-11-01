// Tap a word row to hear it (2 November 2026, the learner: reading on a tap of the row is better than only the
// speaker button). app/tap-to-say.tsx is mounted once in the layout and works on every lesson page.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the layout mounts the tap-to-hear helper once',()=>{
 const layout=read('app/layout.tsx');
 assert(layout.includes("import { TapToSay } from './tap-to-say';"));
 assert.equal(layout.split('<TapToSay/>').length-1,1);
});

test('word rows of every lesson are covered, the speaker icon stays and exercise rows are left alone',()=>{
 const code=read('app/tap-to-say.tsx');
 for(const row of ['.l1a-phrase','.l15-word','.l12-word-tile','.l1a-table tbody tr','.l1a-say-list li','.l1a-pos-row'])assert(code.includes(row),row);
 assert(code.includes("classList.contains('l12-say')"),'only the round listen button is pressed');
 assert(code.includes('buttons.length!==1'),'rows with two listen buttons or choice buttons are skipped');
 assert(code.includes("querySelector('input,select,textarea')"),'rows with answer fields are skipped');
 assert(read('app/willkommen.css').includes('.tap-say {'),'tappable rows show a pointer');
});
