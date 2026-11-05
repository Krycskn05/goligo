const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');

// 5 November 2026, the learner asked: "when I get something wrong in the verb part, let me repeat my mistakes at the end
// of the part — the same in Nesne Kasası", and chose: they come by themselves, the results after them.
test('the card brings the wrong questions after 3 seconds (or a tap) and reads nothing aloud',()=>{
 const card=read('app/mistake-repeat.tsx');
 assert.ok(card.includes('export const REPEAT_START_MS=3000;'));
 assert.ok(card.includes("const tick=()=>{if(document.hidden){timer=setTimeout(tick,500);return;}start.current();};"),'a hidden page waits');
 assert.ok(card.includes('<span className="vault-auto-next" aria-hidden="true"/>'),'the same 3-second bar as after an answer');
 assert.ok(card.includes('<h1 id="object-question-heading" tabIndex={-1}>'),'the focus lands on it as on the results');
 assert.ok(!/speak|speech|Audio/.test(card),'nothing is read aloud');
 // The wrong ones, in the round's order.
 const {roundMistakeIds}=load('mistake-repeat');
 assert.ok(card.includes("export {roundMistakeIds} from '@/lib/mistake-repeat';"));
 assert.deepEqual(roundMistakeIds({questions:[{id:'a'},{id:'b'},{id:'c'}],answers:[{question_id:'c',correct:0},{question_id:'a',correct:1},{question_id:'b',correct:0}]}),['b','c']);
});

test('Fiil Atölyesi: after a part with mistakes, its own round of them, then the part\'s results with the repeat\'s line',()=>{
 const page=read('app/verb-study.tsx');
 assert.ok(page.includes("const repeatDue=!!session&&!firstRound&&!skipRepeat&&session.mode===WORKSHOP_MODE&&roundMistakes.length>0;"),'only after a part (not after Yanlışlarım), once');
 assert.ok(page.includes("mode:guest?WORKSHOP_MODE:MISTAKES_MODE,topic:WORKSHOP_TOPIC,count:ids.length,onlyIds:ids"),'a round of its own, never taken for the part (visitors keep the mode open to them)');
 assert.ok(page.includes('const workshop=session?.mode===WORKSHOP_MODE&&!firstRound;'),'no strip and no verb cards in the repeat');
 assert.ok(page.includes('if(upcoming>=end){if(!repeatDue)answerAudio.complete();void refresh();}'),'the end sound after the repeat');
 assert.ok(page.includes("{session?finished?repeatDue?<MistakeRepeatCard title={v('repeatTitle')} lead={v('repeatLead',{n:roundMistakes.length})}"));
 assert.ok(page.includes("{firstRound&&<p className=\"mistake-repeat-score\" data-mistake-repeat-score=\"\">{v('repeatScore',"),'how the repeat went');
 assert.ok(page.includes("<RoundReward answers={resultRound.answers}")&&page.includes("const roundFamily:VerbFamily=(resultRound&&"),'the results are the part\'s');
 assert.ok(page.includes("catch(e){fail(e,'startError');setSkipRepeat(true);}"),'a failed start shows the results, it does not try again and again');
 // Still practice: on phones no menu and no visitor banner above the card.
 assert.ok(page.includes('{guest&&!(session&&(!finished||repeatDue))&&<GuestBanner'));
 assert.ok(read('app/koko-theme.css').includes(' .toon-app:has(.mistake-repeat) .work-layout>.work-sidebar,'));
 // A visitor's repeat is allowed by the server (workshop questions of the open part only).
 const guest=read('lib/guest-taste.ts');assert.ok(guest.includes("(topic===PART_ROUND_TOPIC||topic===WORKSHOP_TOPIC)&&mode===WORKSHOP_MODE"));
});

test('Nesne Kasası: the same after a normal round; a review of mistakes ends as before',()=>{
 const page=read('app/object-study.tsx');
 assert.ok(page.includes('setRepeatable(!reviewOnly&&!onlyIds);'));
 assert.ok(page.includes('const repeatDue=!!session&&repeatable&&!firstRound&&!skipRepeat&&roundMistakes.length>0;'));
 assert.ok(page.includes("mode:first.mode,topic:first.topic,count:ids.length,onlyIds:ids"),'the same kind of round');
 assert.ok(page.includes('if(index+1>=session.questions.length){if(!repeatDue)answerAudio.complete();void refresh();}}'));
 assert.ok(page.includes("{session?finished?repeatDue?<MistakeRepeatCard title={text('repeatTitle')}"));
 assert.ok(page.includes("{firstRound&&<p className=\"mistake-repeat-score\" data-mistake-repeat-score=\"\">{text('repeatScore',"));
 // "Bu testteki yanlışları tekrar et" asks what is still wrong: after a repeat, the repeat's mistakes.
 assert.ok(page.includes("onClick={()=>void start(false,session.answers.filter(a=>!a.correct).map(a=>a.question_id))}"));
 assert.ok(page.includes("<span className=\"object-pill\">{firstRound?text('repeatPill'):"));
});

test('the card and the results line speak every site language',async()=>{
 const site=load('site-languages');const {vaultText}=load('object-vault-copy');
 const keys=['repeatTitle','repeatLead','repeatStart','repeatSkip','repeatScore','repeatPill'];
 for(const {id} of site.siteLanguages){
  await site.loadLanguagePack(id);
  for(const key of keys){
   const text=vaultText(id,key,{n:3,correct:2,total:3});
   assert.ok(text.trim()&&!/\{\w+\}/.test(text),id+' '+key+': '+text);
   if(id!=='en')assert.notEqual(text,vaultText('en',key,{n:3,correct:2,total:3}),id+' '+key+' is translated');
  }
  assert.ok(vaultText(id,'repeatScore',{correct:2,total:3}).includes('2')&&vaultText(id,'repeatLead',{n:3}).includes('3'));
 }
});
