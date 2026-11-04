// Nesne Kasası after an answer (the learner asked, 4 November 2026: no scrolling down after a right or wrong answer on
// phone, tablet and computer; of three designs they chose "Yan yana"). Checked in a browser at 390×720, 820×1080 and
// 1366×680: "Sonraki" is on the screen in Gör ve Seç, Yazarak Pekiştir and Dinle ve Bul.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the answered question card puts the result next to the picture, only in Nesne Kasası',()=>{
 const page=read('app/object-study.tsx');
 assert.ok(page.includes(`<article className={'object-question panel'+(feedback?' vault-answered':'')+(session.mode==='listen'?' vault-listen':'')} data-paul-picture>`));
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
 // The card keeps its "Tekrar dinle" button; "Sonraki" is gone (next test).
 assert.ok(page.includes("onClick={()=>{speech.speak(pronunciation);setReplays(n=>n+1);}}><Volume2 size={18}/>{text('repeatAudio')}</button>"));
});

test('Nesne Kasası opens the next question by itself 4 seconds after an answer, with no "Sonraki" button',()=>{
 // The learner asked, 4 November 2026.
 const page=read('app/object-study.tsx');
 assert.ok(page.includes('const AUTO_NEXT_MS=4000,AUTO_NEXT_GRACE_MS=6000;'));
 assert.ok(!page.includes('object-next'),'no next button in Nesne Kasası');
 assert.ok(page.includes("<span key={replays} className=\"vault-auto-next\" aria-hidden=\"true\"/>"),'the bar that empties in 4 seconds');
 // The timer starts with each answer and again after "Tekrar dinle"; it waits while the right answer is read.
 assert.ok(page.includes('timer=setTimeout(tick,AUTO_NEXT_MS);'));
 assert.ok(page.includes('const reading=(speech.isActive()||answerAudio.isWaiting())&&now<due+AUTO_NEXT_GRACE_MS;'));
 assert.ok(page.includes('},[feedback,replays,viewId]);'));
 assert.ok(page.includes('nextRef.current();'));
 const css=read('app/koko-theme.css');
 assert.ok(css.includes('.vault-auto-next { position:absolute;')&&css.includes('animation:vault-auto-next 4s linear both;'));
 // Fiil Atölyesi and Ev ve Yaşam keep their own "Sonraki" buttons.
 for(const file of ['app/verb-study.tsx','app/housing-study.tsx'])assert.ok(!read(file).includes('AUTO_NEXT_MS'),file);
});

test('a mode card in Nesne Kasası starts its round at once; no "Teste başla" button or unsolved counter',()=>{
 // The learner asked, 4 November 2026.
 const page=read('app/object-study.tsx');
 assert.ok(page.includes('async function start(reviewOnly=false,onlyIds?:string[],all=false,mode:PracticeMode=practiceMode){'));
 assert.ok(page.includes('<PracticeModes labels={modeLabels} topicLabel={categoryName(group,language)} active={practiceMode} starts disabled={busy||!ready} onChoose={mode=>{stopFeedback();setPracticeMode(mode);pendingStart.current=null;void start(false,undefined,false,mode);}}/>'));
 // The chosen mode, not the one shown before the tap, decides the questions, their history and the sound preparation.
 assert.ok(page.includes("if(mode==='listen')speech.prepare();"));
 assert.ok(page.includes("const history=mode===practiceMode?reviews:snapshot.reviews.filter(r=>modePredicate(mode)(questionMap.get(r.question_id)));"));
 assert.ok(page.includes("(mode==='write'?pickWriting:mode==='listen'?pickListening:pickPicture)(group,count,history,reviewOnly,eligibleIds,{starred,fresh})"));
 assert.ok(page.includes("mode:mode==='write'?'write':mode==='listen'?'listen':'visual'"));
 for(const gone of ["'startTest'","'startPuzzles'","'startListening'",'housing-remaining',"text('remaining'"])assert.ok(!page.includes(gone),gone);
 // The cards start something, so they are not toggle buttons there.
 assert.ok(read('app/practice-modes.tsx').includes('aria-pressed={active&&!starts?active===mode:undefined}'));
});

test('Paul reacts inside the question picture in Nesne Kasası',()=>{
 // The learner asked, 4 November 2026; in Dinle ve Bul (no picture) and at the end of a round he stays in the badge.
 const page=read('app/object-study.tsx');
 assert.ok(page.includes("(session.mode==='listen'?' vault-listen':'')} data-paul-picture>"));
 const effects=read('app/learning-effects.tsx');
 assert.ok(effects.includes("const host=kind==='complete'?null:document.querySelector<HTMLElement>('[data-paul-picture]>.object-picture');"));
 assert.ok(effects.includes('{reaction?.host?.isConnected&&createPortal('));
 assert.ok(effects.includes('{reaction&&!reaction.host?.isConnected&&<div key={reaction.id} className={\'lk-reaction-layer \''));
 const css=read('app/paul-hoca.css');
 assert.ok(css.includes('[data-paul-picture]>.object-picture { position:relative; }')&&css.includes('.toon-app [data-paul-picture]>.object-picture>.lk-picture-reaction>img.lk-picture-paul { position:absolute; bottom:0; inset-inline-end:3%; width:min(56%,180px); height:min(64%,180px);'));
});
