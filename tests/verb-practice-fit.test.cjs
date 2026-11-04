// Fiil Atölyesi practice on one screen (the learner asked, 4 November 2026: "work like Nesne Kasası, fit one page, no
// scrolling — not even inside a box"; design "1 · Kasa düzeni"): the picture strip of the verbs, the steps as chips, one
// fixed place for the question card and the result so the choices and letters never move, the next question after 3 s.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the top: the topic, the picture strip of the verbs, "Fiil n / N", the steps as chips',()=>{
 const page=read('app/verb-study.tsx');const cards=read('app/verb-workshop.tsx');
 assert.ok(page.includes("<span className=\"object-pill\">{place?familyTitle(place.family,language):t('workshopTitle')}</span>"),'the pill names the topic');
 assert.ok(page.includes('<nav className="vault-strip verb-strip" aria-label={v(\'navQuestions\')}>'),'the same strip as Nesne Kasası');
 assert.ok(page.includes("const picture=item.done?verbPicture(item.verb):null;"),'only a finished verb shows its picture (a picture would give the meaning away)');
 assert.ok(page.includes("className={'vault-strip-item '+(item.done?(item.wrong?'wrong':'right'):item.current?'current':'later')}"),'tick, cross, now, later');
 assert.ok(page.includes("t('verbOf',{n:stripAt+1,total:strip.length})"),'"Fiil 4 / 13"');
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
 assert.ok(page.includes('const AUTO_NEXT_MS=3000,AUTO_NEXT_GRACE_MS=6000;')&&page.includes('const nextRef=useRef(next);nextRef.current=next;')&&page.includes('},[feedback,replays]);'),'the next question by itself, as in Nesne Kasası');
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
