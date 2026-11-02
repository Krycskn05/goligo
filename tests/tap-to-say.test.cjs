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
 for(const row of ['.l1a-phrase','.l15-word','.l12-word-tile','.l1a-table tbody tr','.l1a-say-list li','.l1a-pos-row','.l1a-line','.housing-lesson-example'])assert(code.includes(row),row);
 assert(code.includes("const SAY_BUTTON='.l12-say,.housing-lesson-example > .icon-btn';")&&code.includes('button.matches(SAY_BUTTON)'),'only a listen button is pressed');
 assert(code.includes('buttons.length!==1'),'rows with two listen buttons or choice buttons are skipped');
 assert(code.includes("querySelector('input,select,textarea')"),'rows with answer fields are skipped');
 assert(read('app/willkommen.css').includes('.tap-say {'),'tappable rows show a pointer');
});

test('role play: Mei asks at once, her speaker sits in the bubble and the bubble reads when tapped',()=>{
 const page=read('app/stadt-a-steps.tsx');
 const block=page.slice(page.indexOf('function RoleExercise'));
 assert(block.includes("useEffect(()=>{if(!over)speakRef.current({text:roleQuestions[round].question,who:'mei'});},[round,over]);"));
 assert(/l15-say-bubble"><div className="l15-say-text">.*<Say text=\{item\.question\} who="mei" speech=\{speech\}\/><\/div><\/div>/.test(block),'speaker inside the bubble');
 assert(read('app/tap-to-say.tsx').includes('.l15-say-bubble'),'the bubble is tappable');
 assert(read('app/stadt.css').includes('.l15-say-bubble {'));
});
