// Nesne Kasası without extra taps (the learner asked): an article answer is checked as soon as der/die/das is tapped,
// a filled letter puzzle checks itself, and in "Dinle ve Bul" every word — the first one too — is heard by itself.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('article questions are answered with the tap on der/die/das',()=>{
 const puzzle=read('app/article-puzzle.tsx');
 assert.ok(puzzle.includes('function choose(value:string){if(unavailable)return;setSelected(value);onSubmit(value);}')&&puzzle.includes('onClick={()=>choose(value)} data-article-answer>'));
 assert.ok(!puzzle.includes('check-button')&&!puzzle.includes("text('checkAnswer')"),'no "Kontrol et" button');
 assert.ok(read('app/learning-effects.tsx').includes('[data-article-answer]'),'no tap pop over the right/wrong sound');
 // The letter puzzle already checks itself when every box is full.
 assert.ok(read('app/letter-puzzle.tsx').includes("const first=setTimeout(()=>{sent.current=true;submitLatest.current();},350);"));
});

test('Dinle ve Bul plays the first word and every next word by itself',()=>{
 const page=read('app/object-study.tsx');
 assert.ok(page.includes("if(practiceMode==='listen')speech.prepare();"),'prepared in the start tap for phones');
 assert.ok(page.includes("const first=data.session.mode==='listen'?questionMap.get(data.session.questions[data.session.answers.length]?.id??''):undefined;")&&page.includes('if(first?.audio){setHeardQuestionId(first.id);speech.speak(first.audio);}'));
 assert.ok(page.includes('if(following?.audio){setHeardQuestionId(following.id);speech.speak(following.audio);}'),'the next word too');
 // Only the listening word: picture and writing questions are never read aloud by themselves.
 assert.equal((page.match(/speech\.speak\((first|following)\.audio\)/g)??[]).length,2);
});
