// Nesne Kasası (the learner asked, 29 October 2026): after a round the results screen leads back to the same
// category's screen (Gör ve Seç / Yazarak Pekiştir / Dinle ve Bul), not to the list of all categories.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the results screen goes back to the category that was just practised',()=>{
 const page=read('app/object-study.tsx');
 assert.ok(page.includes("function backToCategory(){if(mutation.current)return;stopFeedback();setSession(null);clearAnswer();setView('configure');setError(null);pendingStart.current=null;void refresh();focus('vault-config-heading');}"));
 assert.ok(page.includes('onClick={backToCategory} data-vault-back-category><ArrowLeft size={18} className="vault-direction-icon"/>{categoryName(group,language)}</button>'),'the button names the category');
 const results=page.slice(page.indexOf('<section className="object-results panel">'),page.indexOf('</section>:q&&currentWord?'));
 assert.ok(results.includes('onClick={backToCategory}')&&!results.includes('onClick={overview}'),'no jump to the list of all categories at the end of a round');
 assert.ok(!/setPracticeMode\(/.test(page.slice(page.indexOf('function backToCategory'),page.indexOf('function chooseCategory'))),'the mode just played stays chosen');
});
