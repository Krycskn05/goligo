const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const load=name=>require(path.join(compiled,name+'.js'));
const housing=load('housing-course'),study=load('study'),practice=load('object-practice'),objects=load('object-course');
const row=(question_id,wrong_count,streak)=>({question_id,wrong_count,streak,seen:1,last_answer:'',last_wrong:'',last_at:0,due_at:0});
// The start request must stay below the API body limit even for the biggest round.
const startBody=ids=>Buffer.byteLength(JSON.stringify({action:'start',course:'de',id:crypto.randomUUID(),mode:'write',topic:'objects-all',count:ids.length,onlyIds:ids}));

test('Çalışmaya başla gives every unsolved question in one round on both pages',()=>{
 const wohnen=fs.readFileSync('app/housing-study.tsx','utf8');
 assert(wohnen.includes("const [count]=useState<number|'all'>('all');"),'Ev ve Yaşam asks all remaining questions at once');
 const vault=fs.readFileSync('app/object-study.tsx','utf8');
 assert(vault.includes("const [count]=useState<PictureQuizSize>('all');")&&!vault.includes('setCount('),'Nesne Kasası asks all remaining questions at once, also after resuming an older round');
});

test('the server keeps every chosen question of a full Ev ve Yaşam round',()=>{
 for(const section of ['a','b','c','d','all'])for(const mode of ['test','write']){
  const pool=housing.housingPool(section,mode);const solved=pool.slice(0,5).map(q=>row(q.id,0,1));
  const ids=housing.pickHousingQuestions(section,mode,'all',solved,0,false,undefined,new Set()).map(q=>q.id);
  assert.equal(ids.length,pool.length-5,section+' '+mode+' all unsolved questions, none solved');
  const topic=housing.housingSections.find(item=>item.id===section)?.topic??'book-11';
  const saved=study.selectQuestions(mode,topic,ids.length,[],ids).map(q=>q.id);
  assert.deepEqual([...saved].sort(),[...ids].sort(),section+' '+mode);
  assert(startBody(ids)<20000,section+' '+mode+' request size');
 }
});

test('the server keeps every chosen question of a full Nesne Kasası round',()=>{
 const modes=[['test',practice.pickPictureQuiz,'visual'],['write',practice.pickObjectWritingQuiz,'write'],['listen',practice.pickObjectListeningQuiz,'listen']];
 for(const group of ['all',...objects.objectGroups.map(item=>item.id)])for(const [mode,pick,server] of modes){
  const everything=pick(group,'all',[],false,undefined,{fresh:true});const solved=everything.slice(0,3).map(q=>row(q.id,0,2));
  const ids=pick(group,'all',solved,false,undefined,{fresh:true}).map(q=>q.id);
  assert.equal(ids.length,everything.length-3,group+' '+mode+' all unsolved questions, none solved');
  const saved=study.selectQuestions(server,group==='all'?'objects-all':group,ids.length,[],ids).map(q=>q.id);
  assert.deepEqual([...saved].sort(),[...ids].sort(),group+' '+mode);
  assert(startBody(ids)<20000,group+' '+mode+' request size');
 }
});
