// Fiil Atölyesi practice on one screen (the learner asked, 4 November 2026: "work like Nesne Kasası, fit one page, no
// scrolling — not even inside a box"; design "1 · Kasa düzeni"): the picture strip of the verbs, the steps as chips, one
// fixed place for the question card and the result so the choices and letters never move, the next question after 3 s.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the top: the topic, the picture strip of the verbs, "Fiil n / N", the steps as chips',()=>{
 const page=read('app/verb-study.tsx');const cards=read('app/verb-workshop.tsx');
 assert.ok(page.includes("<span className=\"object-pill\">{place?familyTitle(place.family,language):firstRound?v('repeatPill'):t('workshopTitle')}</span>"),'the pill names the topic (or the repeat)');
 assert.ok(page.includes('<nav className="vault-strip verb-strip" aria-label={v(\'navQuestions\')}>'),'the same strip as Nesne Kasası');
 assert.ok(page.includes("const picture=item.done?verbPicture(item.verb):null;"),'only a finished verb shows its picture (a picture would give the meaning away)');
 assert.ok(page.includes("className={'vault-strip-item '+(item.done?(item.wrong?'wrong':'right'):item.current?'current':'later')+(shown&&!item.current?' shown':'')}"),'tick, cross, now, later (and the one opened)');
 assert.ok(page.includes("t('verbOf',{n:shownAt+1,total:strip.length})"),'"Fiil 4 / 13"');
 assert.ok(page.includes('{!strip&&<progress max={end}'),'the strip replaces the long bar');
 assert.ok(cards.includes('<ol className="verb-stepper verb-step-chips"')&&!cards.includes('verb-stepper-head'),'the steps as chips');
});

test('the question card keeps one place for the question and the result; no next button; the next question after 3 s',()=>{
 const page=read('app/verb-study.tsx');const cards=read('app/verb-workshop.tsx');const css=read('app/verbs.css');
 assert.ok(page.includes('<div className="verb-slot" data-paul-slot="">{feedback?<AnswerResult '),'the result opens where the question card was');
 // Paul's reaction comes into this frame, in the room kept free on its right (never over the picture or the words).
 assert.ok(read('app/learning-effects.tsx').includes("??document.querySelector<HTMLElement>('[data-paul-slot]')"));
 assert.ok(css.includes('padding:10px calc(var(--paul) + 8px) 13px 14px;')&&css.includes('.verb-practice .verb-slot>.lk-picture-reaction { inset:auto; top:0; bottom:0; inset-inline-end:0; width:var(--paul);'),'room for Paul');
 assert.ok(css.includes('--qslot:clamp(160px,31vh,250px);'),'the question picture as big as the screen allows');
 assert.ok(!page.includes('verb-write-feedback')&&!page.includes("v(index+1===end?'viewResults':'nextPuzzle')")&&!cards.includes('verb-result-next'),'no "Sonraki" button, no second feedback block under the letters');
 assert.ok(page.includes('const AUTO_NEXT_MS=3000,AUTO_NEXT_GRACE_MS=6000;')&&page.includes('const nextRef=useRef(next);nextRef.current=next;')&&page.includes('},[feedback,replays,viewing]);'),'the next question by itself, as in Nesne Kasası');
 assert.ok(page.includes("const resultSpeech={speak:(text:string)=>{setReplays(n=>n+1);speech.speak(text);}"),'the speaker on the result gives the 3 seconds again');
 assert.ok(cards.includes('<span key={replays} className="vault-auto-next" aria-hidden="true"/>'),'the 3-second bar');
 // Only the right answer is spoken by itself; the example sentence only when tapped.
 assert.ok(cards.includes("onClick={()=>speech.speak(row.text)} data-verb-example="));
 assert.ok(/\.verb-slot \{ position:relative; height:var\(--qslot\);/.test(css),'the place has a fixed height');
 assert.ok(css.includes('.verb-app .verb-practice .verb-options .object-option>svg { position:absolute;'),'the tick does not make the right choice taller');
 assert.ok(css.includes('.verb-practice .verb-conj-grid { grid-template-columns:repeat(3,minmax(0,1fr));'),'the Präsens table in two rows');
 assert.ok(read('app/koko-theme.css').includes('.toon-app:has(.verb-practice) .work-layout>.work-sidebar,'),'on phones the menu goes away while practising');
 assert.ok(!/\.verb-slot[^{]*\{[^}]*overflow(-y)?:(auto|scroll)/.test(css),'no scrolling inside the card');
});

// 5 November 2026, the learner asked: switch between the verbs in the picture strip.
test('every verb of the strip opens its card; the round waits and comes back where it was',()=>{
 const page=read('app/verb-study.tsx');const cards=read('app/verb-workshop.tsx');const css=read('app/verbs.css');
 assert.ok(page.includes("<button type=\"button\" disabled={busy} aria-current={shown?'step':undefined}")&&page.includes("onClick={()=>showVerb(item.current?null:item.verb.id)}"),'done and coming verbs open; the verb now goes back');
 assert.ok(page.includes("const viewItem=strip&&viewVerb?strip.find(item=>item.verb.id===viewVerb&&!item.current)??null:null;"));
 assert.ok(page.includes('if(!feedback||viewing)return;'),'the next question waits while a verb is open');
 assert.ok(page.includes("<article className={'object-question panel verb-question'+(feedback?' answered':'')} style={viewItem?{display:'none'}:undefined}>"),'the question stays, hidden, so the letters and the result keep');
 assert.ok(page.includes('{place&&!viewItem&&<PathStepper')&&page.includes('{!guest&&!viewItem&&<button'),'the steps and the star belong to the question');
 assert.ok(page.includes("function clearAnswer(){setViewVerb(null);"),'the next question starts on the question');
 assert.ok(page.includes("status={viewItem.done?v('navDone')+(viewItem.misses?' · '+t('mistakesCount',{n:viewItem.misses}):''):v('navLater')} returnLabel={v('backToCurrent')}"),'how it went, in the learner\'s language');
 assert.ok(cards.includes('export function StripVerbCard(')&&cards.includes('<h1 id="verb-view-heading" tabIndex={-1}')&&cards.includes('<ConjugationTable verb={verb} language={language} speech={speech}/>'));
 // Never read aloud by itself: no speak call outside the buttons.
 const card=cards.slice(cards.indexOf('export function StripVerbCard('),cards.indexOf('/** After an answer: one example sentence for every person'));
 assert.equal(card.match(/speech\.speak\(/g).length,1,'only the speaker button speaks');
 assert.ok(css.includes('.verb-view-state.wrong { background:#fff0f4; color:#b23a5b; }'));
});
