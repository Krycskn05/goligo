// Nesne Kasası picture strip (the learner asked, 4 November 2026: switch between the questions of a round; the ones done
// before do not disappear when the category is opened again, they stay done and can be opened to look at; of three
// designs they chose "Resimli şerit"; everything fits the screen with no scrolling on phone, tablet and computer).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');
const page=read('app/object-study.tsx');

test('a normal round keeps the questions solved before in its strip, done and not asked again',()=>{
 assert.ok(page.includes("const earlierIds=fresh?scopeFor(mode).filter(item=>!ids.includes(item.id)&&isObjectSolved(rows.get(item.id))).map(item=>item.id):[];"));
 assert.ok(page.includes('setEarlier(request.earlier);setSession(data.session);'));
 // Done before first (category order), then the round itself; the counter counts the whole strip.
 assert.ok(page.includes("const strip=session?[...earlier.map(id=>({id,result:'done'"));
 assert.ok(page.includes("text(session.mode==='write'?'puzzleRoundProgress':'progress',{n:stripShown+1,total:strip.length})"));
 assert.ok(!page.includes('<progress max={session.questions.length}'),'the strip replaces the progress bar');
});

test('done questions open to look at; the current one comes back; later ones stay closed',()=>{
 assert.ok(page.includes("disabled={busy||(!result&&!item.current)}"),'questions not reached yet cannot be opened (answers go in order)');
 assert.ok(page.includes("onClick={()=>showQuestion(item.current?null:item.id)}"));
 assert.ok(page.includes("function showQuestion(id:string|null){if(mutation.current)return;stopFeedback();setViewId(id&&id!==q?.id?id:null);focus();}"));
 // The opened question is shown answered: picture, right answer, its own result or "done before"; no choices to answer.
 const view=page.slice(page.indexOf("{viewQ&&viewWord?<article"),page.indexOf("</article>:",page.indexOf("{viewQ&&viewWord?<article")));
 assert.ok(view.includes("vault-answered vault-viewing")&&view.includes("text('doneEarlier')")&&view.includes("text('backToCurrent')"));
 assert.ok(!view.includes('submit('),'nothing is answered again');
 // No automatic move while a done question is open; the 3 seconds start again after coming back.
 assert.ok(page.includes("if(!feedback||viewId)return;"));
 // Done tiles show their own picture, cut from the picture sheet like everywhere else.
 assert.ok(page.includes("{result&&word?<ObjectArt id={word.id} title={objectMeaning(word.id,language)}/>:<span className=\"vault-strip-number\">{i+1}</span>}"));
});

test('the strip texts exist in every site language',()=>{
 const {vaultText,vaultLanguages}=require(process.env.STUDY_CHECK_DIR+'/object-vault-copy.js');
 const {packLanguages}=require(process.env.STUDY_CHECK_DIR+'/site-languages.js');
 const keys=['navQuestions','navDone','navCurrent','navLater','backToCurrent','doneEarlier'];
 assert.equal(vaultLanguages.length,31);
 for(const {id} of vaultLanguages)for(const key of keys)assert.ok(vaultText(id,key).trim(),id+' '+key);
 const english=keys.map(key=>vaultText('en',key));
 for(const id of packLanguages){const pack=JSON.parse(read(`lib/language-packs/${id}.json`));for(const text of english)assert.ok(pack[text]&&pack[text].trim(),id+' '+text);}
});

test('the strip stays one row high and slides sideways',()=>{
 const css=read('app/koko-theme.css');
 assert.ok(css.includes('.toon-app .vault-strip { margin:0 0 8px; padding:3px 2px 7px; overflow-x:auto;'));
 assert.ok(css.includes('.toon-app .vault-strip ol { display:flex; gap:7px; width:max-content;'));
});
