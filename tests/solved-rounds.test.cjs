// A new test after solving everything (the learner asked, 3 November 2026: "hepsini çözdükten sonra tekrar teste girmek
// istiyorum, sürekli yanlış cevaplarımı tekrarlatıyor"). A question answered right once is solved; a normal round is not
// filled with old mistakes in any part of the site, and the review button still has them.
const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const course=load('course'),study=load('study'),objects=load('object-practice'),english=load('english-objects'),housing=load('housing-course'),verbs=load('verb-practice');
const seeded=seed=>{let state=seed>>>0;return()=>(state=(Math.imul(state,1103515245)+12345)>>>0)/4294967296;};
const now=Date.now(),later=now+86400000;
const row=(question_id,wrong_count,streak,seen,due_at=later)=>({question_id,wrong_count,streak,seen,last_answer:'',last_wrong:'',last_at:now,due_at});
const right=id=>row(id,0,1,1); // right the first time
const fixed=id=>row(id,1,1,2); // wrong once, then right: still on the mistakes list
const slipped=id=>row(id,1,0,2,now); // right once, then wrong
const wrong=id=>row(id,1,0,1,now); // never answered right

test('solved = answered right at least once, everywhere; the mistakes list still waits for three right answers in a row',()=>{
 for(const solved of [objects.isObjectSolved,housing.isHousingSolved,verbs.isVerbSolved]){
  assert.ok(solved(right('a'))&&solved(fixed('a'))&&solved(slipped('a')),solved.name);
  assert.ok(!solved(wrong('a'))&&!solved(undefined),solved.name);
 }
 for(const mistake of [objects.isObjectMistake,housing.isHousingMistake,verbs.isVerbMistake])assert.ok(mistake(fixed('a'))&&mistake(slipped('a'))&&mistake(wrong('a'))&&!mistake(right('a')));
});

test('Nesne Kasası: once everything is solved a new test mixes all the questions, not only the old mistakes',()=>{
 for(const [pick,is] of [[objects.pickPictureQuiz,objects.isObjectPictureQuestion],[objects.pickObjectWritingQuiz,objects.isObjectWritingQuestion],[objects.pickObjectListeningQuiz,objects.isObjectListeningQuestion]]){
  const ids=course.questions.filter(q=>is(q)&&q.topic==='objects-house').map(q=>q.id);assert(ids.length>12,pick.name);
  const reviews=ids.map((id,i)=>i===0?fixed(id):i===1?slipped(id):right(id));
  for(let seed=1;seed<4;seed++)assert.equal(pick('objects-house',10,reviews,false,undefined,{fresh:true,random:seeded(seed)}).length,10,pick.name+' a full round');
  assert.equal(ids.filter(id=>!objects.isObjectSolved(reviews.find(r=>r.question_id===id))).length,0,'"Buradaki tüm soruları çözdün" is shown');
  assert.deepEqual(pick('objects-house','all',reviews,true,undefined,{}).map(q=>q.id).sort(),[ids[0],ids[1]].sort(),pick.name+' the old mistakes stay on the review button');
  // A question never answered right is still the next one to solve.
  const open=[...reviews.slice(0,-1),wrong(ids.at(-1))];
  assert.deepEqual(pick('objects-house',10,open,false,undefined,{fresh:true}).map(q=>q.id),[ids.at(-1)],pick.name);
 }
 // English vault: old mistakes are not put first; a question never answered right is.
 const en=english.englishObjectQuestions.filter(q=>english.isEnglishObjectPictureQuestion(q)&&q.topic==='en-objects-house').map(q=>q.id);assert(en.length>12);
 const reviews=en.map((id,i)=>i===0?fixed(id):i===1?slipped(id):right(id));
 const firstTwo=Array.from({length:20},()=>english.pickEnglishObjectQuiz('objects-house',2,reviews).map(q=>q.id).sort().join());
 assert.ok(firstTwo.some(ids=>ids!==[en[0],en[1]].sort().join()),'a round of two is not always the two old mistakes');
 assert.equal(english.pickEnglishObjectQuiz('objects-house',1,[...reviews.slice(0,-1),wrong(en.at(-1))])[0].id,en.at(-1));
 assert.deepEqual(english.pickEnglishObjectQuiz('objects-house','all',reviews,true).map(q=>q.id).sort(),[en[0],en[1]].sort());
});

test('Ev ve Yaşam and Fiiller: the same rule',()=>{
 const pool=housing.housingPool('a','write').map(q=>q.id);
 const reviews=pool.map((id,i)=>i===0?fixed(id):i===1?slipped(id):right(id));
 assert.equal(housing.pickHousingQuestions('a','write',10,reviews,0,false,undefined,new Set(),seeded(1)).length,10);
 assert.deepEqual(housing.pickHousingQuestions('a','write',10,[...reviews.slice(0,-1),wrong(pool.at(-1))],0,false,undefined,new Set(),seeded(2)).map(q=>q.id),[pool.at(-1)]);
 assert.deepEqual(housing.pickHousingQuestions('a','write','all',reviews,0,true,undefined,new Set()).map(q=>q.id).sort(),[pool[0],pool[1]].sort());
 const verbIds=verbs.verbPool('test','verbs-1').map(q=>q.id);
 const verbReviews=verbIds.map((id,i)=>i===0?fixed(id):i===1?slipped(id):right(id));
 assert.equal(verbs.pickVerbRound('test','verbs-1',verbReviews,false,undefined,{fresh:true}).length,verbIds.length);
 assert.deepEqual(verbs.pickVerbRound('test','verbs-1',[...verbReviews.slice(0,-1),wrong(verbIds.at(-1))],false,undefined,{fresh:true}).map(q=>q.id),[verbIds.at(-1)]);
});

test('the server puts new and unsolved questions first, old mistakes only in a review round',()=>{
 const ids=course.questions.filter(q=>q.topic==='objects-house'&&q.image).map(q=>q.id);assert(ids.length>5);
 const reviews=ids.map((id,i)=>i===0?fixed(id):i===1?slipped(id):right(id));
 const two=study.selectQuestions('visual','objects-house',2,reviews).map(q=>q.id).sort();
 assert.notDeepEqual(two,[ids[0],ids[1]].sort(),'a normal round does not start with the old mistakes');
 assert.deepEqual(study.selectQuestions('review','objects-house',2,reviews).map(q=>q.id).sort(),[ids[0],ids[1]].sort());
 assert.equal(study.selectQuestions('visual','objects-house',1,[...reviews.slice(0,-1),wrong(ids.at(-1))])[0].id,ids.at(-1));
 assert.equal(study.selectQuestions('visual','objects-house',1,reviews.slice(0,-1))[0].id,ids.at(-1),'a new question comes first');
});
