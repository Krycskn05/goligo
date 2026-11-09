// Nesne Kasası and Fiil Atölyesi letter puzzles (the learner asked, 4 November 2026: "give a rule of 3 tries for a wrong
// spelling, and 3 hints too"): three hearts, a wrong letter takes one and the word still counts while one is left, the
// third ends the question as a mistake (even before the article, helper verb or prefix is chosen); 3 hints per word.
// Ev ve Yaşam keeps its own rule (one wrong letter counts).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the puzzle shows three hearts, keeps the word right while a try is left and sends it as a mistake after the last',()=>{
 const ui=read('app/letter-puzzle.tsx');
 assert.ok(ui.includes('const left=tries?triesLeft(mistakes,tries):0;const out=!!tries&&left===0;const finished=completed.complete||out;'));
 assert.ok(ui.includes('const scored=triedLetterAnswer(puzzle,letters,mistakes,tries);'));
 assert.ok(ui.includes('submitLatest.current=()=>onSubmit(scored,out);')&&ui.includes('if(!finished){sent.current=false;return;}'),'the last try sends the answer by itself');
 assert.ok(ui.includes('const blocked=busy||locked||!ready;const unavailable=blocked||out;'),'no more letters once the tries are used up');
 assert.ok(ui.includes("aria-label={text('puzzleTriesLeft',{n:left})}")&&ui.includes("<Heart key={i} size={15} fill={i<left?'currentColor':'none'}"),'a heart for each try');
 assert.ok(ui.includes("{tries?text('puzzleWrongLetter')+(out?'':' '+text('puzzleTriesLeft',{n:left})):text('puzzleMistakeNote')}"),'the note says how many tries are left');
 assert.ok(ui.includes(`<div className="puzzle-hint-slot"><p id={id+'-hint'} className={'puzzle-hint'+(note?' covered':'')}>`),'the note takes the place of the instructions, so nothing moves');
 const styles=read('app/globals.css');assert.ok(styles.includes('.puzzle-hint-slot>* { grid-area:1 / 1; }')&&styles.includes('.puzzle-hint-slot .puzzle-hint.covered { visibility:hidden; }'));
 assert.ok(ui.includes('hintLimit(puzzle,hintCount)')&&ui.includes('readPuzzleExtras(puzzle,storageKey,hintCount)'));
 const css=read('app/globals.css');assert.ok(css.includes('.puzzle-tries { display:inline-flex;')&&css.includes('.puzzle-tries .lost {'));
 // The tries used up (the learner asked, 9 November 2026): the empty boxes show their right letter, filled in by the site.
 assert.ok(ui.includes("const revealed=out&&!value?part.character:'';")&&ui.includes("const state=revealed?'revealed':")&&ui.includes("value||revealed||<span aria-hidden=\"true\">_</span>"),'the right letters fill the empty boxes');
 assert.ok(css.includes('.puzzle-empty.revealed {'),'in their own colour');
 // A wrong letter typed on the keyboard takes a heart too, also one the letter bank does not offer (9 November 2026).
 assert.ok(ui.includes('if(tries||tileForLetter(choices,key,course))miss(index,key);'),'typed wrong letters take a heart');
});

test('Nesne Kasası and Fiil Atölyesi use the rule, Ev ve Yaşam does not',()=>{
 for(const file of ['app/object-study.tsx','app/verb-study.tsx'])assert.ok(read(file).includes('tries={PUZZLE_TRIES} hintCount={PUZZLE_HINTS}/>'),file);
 assert.ok(!read('app/housing-study.tsx').includes('tries='));
 assert.ok(read('app/object-study.tsx').includes("if(!nounArticle&&!out){setArticleWarning(true);return;}void submit((nounArticle?nounArticle+' ':'')+answer);"),'the last try ends it even without der/die/das');
 const verbs=read('app/verb-study.tsx');
 assert.ok(verbs.includes("if(!aux&&!out){setAuxWarning(true);return;}void submit((aux?aux+' ':'')+answer);")&&verbs.includes("if(!prefix&&!out){setPrefixWarning(true);return;}void submit(answer+(prefix?' '+prefix:''));"));
});
