// Exercise endings (2 November 2026, the learner: six right answers ended with the wrong sound and a red score): the sound
// at the end goes by the last answer, the score line is never red, and Alıştırma 9 (Ach/Ich) does not read the word again.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('the last answer decides the sound, the score line is green or neutral',()=>{
 const ui=read('app/willkommen-ui.tsx');
 assert(ui.includes('if(lastOk??right===total)sound.correct(read);else sound.wrong(lastOk===undefined?undefined:read);'));
 assert(ui.includes("export function scoreFeedback(right:number,total:number):Feedback"));
 assert(ui.includes("feedback.info?' info'"),'neutral score line');
 assert(read('app/willkommen.css').includes('.l1a-feedback.info'));
 assert(ui.includes('finish(right,rows.length,row.say?[row.say]:undefined,ok);'),'ChoiceRows passes the last answer');
 for(const file of ['app/willkommen-b-steps.tsx','app/willkommen-study.tsx','app/willkommen-ui.tsx'])
  assert(!/setFeedback\(\{ok:right===\w+\.length,text:`\$\{right\} \/ \$\{\w+\.length\} doğru`\}\)/.test(read(file)),file+': no red score line');
});

test('Ach/Ich rows are not read again after the answer',()=>{
 const page=read('app/stadt-a-steps.tsx');
 const block=page.slice(page.indexOf('function AchIchExercise'),page.indexOf('function RoleExercise'));
 assert(block.length>0&&!block.includes('say:word'),'no say on the Ach/Ich rows');
});

test('sentence building shows what each sentence means',()=>{
 const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)return;
 const path=require('node:path');const load=name=>require(path.join(compiled,name+'.js'));
 const stadt=load('stadt-course'),l1=load('willkommen-course'),l1c=load('willkommen-c-course');
 assert.equal(stadt.orderMeanings.length,stadt.orderSentences.length);
 assert.equal(l1.orderMeanings.length,l1.orderSentences.length);
 assert(l1c.orderVerbSentences.every(item=>item.tr&&item.tr.trim()));
 const ui=read('app/willkommen-ui.tsx');assert(ui.includes('Bu cümleyi kur: <b>{meanings[round]}</b>'));
 for(const file of ['app/stadt-a-steps.tsx','app/willkommen-study.tsx','app/willkommen-c-steps.tsx'])assert(read(file).split('\n').some(line=>line.includes('<OrderExercise')&&line.includes('meanings=')),file);
});
