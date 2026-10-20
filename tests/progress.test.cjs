const {test}=require('node:test');
const assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript');
const compiled=process.env.STUDY_CHECK_DIR;
assert.ok(compiled,'Set STUDY_CHECK_DIR to compiled libraries.');
const course=require(path.join(compiled,'course.js'));
const study=require(path.join(compiled,'study.js'));
const progress=require(path.join(compiled,'progress.js'));
const copy=require(path.join(compiled,'progress-copy.js'));
const housing=require(path.join(compiled,'housing-course.js'));
const objects=require(path.join(compiled,'object-course.js'));
const practice=require(path.join(compiled,'object-practice.js'));

const review=(id,streak,seen=1)=>({question_id:id,wrong_count:streak?0:1,streak,seen,last_answer:'',last_wrong:'',last_at:0,due_at:0});

test('topic percentage counts exercises whose latest answer was correct',()=>{
 const ids=['a','b','c','d'];
 const empty=progress.topicProgress(ids,[]);
 assert.deepEqual([empty.total,empty.tried,empty.learned,empty.percent,empty.stage,empty.stars],[4,0,0,0,'new',0]);
 const some=progress.topicProgress([...ids,'a'],[review('a',2),review('b',0),review('other',1)]);
 assert.deepEqual([some.total,some.tried,some.learned,some.percent,some.triedPercent,some.stage,some.stars],[4,2,1,25,50,'warming',1]);
 const all=progress.topicProgress(ids,ids.map(id=>review(id,1)));
 assert.deepEqual([all.percent,all.stage,all.stars],[100,'master',3]);
 const many=Array.from({length:233},(_,i)=>'q'+i);
 assert.equal(progress.topicProgress(many,[review('q0',1)]).percent,1,'one learned exercise is already visible');
 assert.equal(progress.topicProgress(many,many.slice(1).map(id=>review(id,1))).percent,99,'100 % only when everything is learned');
 assert.equal(progress.topicProgress(many,[review('q0',0)]).stage,'started');
 assert.deepEqual([0,24,25,49,50,74,75,99,100].map(progress.starsFor),[0,0,1,1,2,2,3,3,3]);
 assert.deepEqual([0,10,30,60,80,100].map(p=>progress.stageFor(p,1)),['started','started','warming','half','almost','master']);
});

test('progress pools match the exercises that the Ev ve Yaşam and Nesne Kasası pages offer',()=>{
 const all=progress.housingProgressIds('all');
 assert.equal(new Set(all).size,all.length);
 const practisable=new Set([...housing.housingPool('all','write'),...housing.housingPool('all','test')].map(q=>q.id));
 assert.deepEqual(new Set(all),practisable);
 assert.equal(['a','b','c','d'].reduce((sum,id)=>sum+progress.housingProgressIds(id).length,0),all.length);
 for(const id of all)assert(course.questionMap.has(id),id);

 const vault=progress.objectProgressIds('all');
 assert.equal(new Set(vault).size,vault.length);
 const offered=objects.objectQuestions.filter(q=>practice.isObjectPictureQuestion(q)||practice.isObjectWritingQuestion(q)||practice.isObjectListeningQuestion(q)).map(q=>q.id);
 assert.deepEqual(new Set(vault),new Set(offered));
 assert.equal(objects.objectGroups.reduce((sum,group)=>sum+progress.objectProgressIds(group.id).length,0),vault.length);
 for(const group of objects.objectGroups){
  const ids=progress.objectProgressIds(group.id);assert(ids.length>0,group.id);
  assert(ids.every(id=>course.questionMap.get(id).topic===group.id));
  assert.equal(practice.objectWritingPool(group.id).length+practice.objectListeningPool(group.id).length+objects.objectQuestions.filter(q=>practice.isObjectPictureQuestion(q)&&q.topic===group.id).length,ids.length);
 }
});

test('XP, levels, day streak and daily goal',()=>{
 assert.equal(progress.xpFor(5,3),3*10+2*2);
 assert.equal(progress.roundXp([{correct:1},{correct:0},{correct:true}]),22);
 assert.deepEqual([1,2,3,4,5].map(level=>progress.levelStart(level)),[0,100,300,600,1000]);
 const level=xp=>{const info=progress.levelFromXp(xp);return [info.level,info.intoLevel,info.span,info.toNext,info.percent];};
 assert.deepEqual(level(0),[1,0,100,100,0]);
 assert.deepEqual(level(99),[1,99,100,1,99]);
 assert.deepEqual(level(100),[2,0,200,200,0]);
 assert.deepEqual(level(450),[3,150,300,150,50]);
 assert.equal(progress.dayStreak([10,9,8,6],10),3);
 assert.equal(progress.dayStreak([9,8,6],10),2,'yesterday keeps the streak alive');
 assert.equal(progress.dayStreak([8,7],10),0);
 assert.equal(progress.dayStreak([],10),0);
 const berlinEvening=Date.UTC(2026,9,13,22,30);
 assert.equal(progress.dayKey(berlinEvening,-120),progress.dayKey(Date.UTC(2026,9,14,1),0),'22:30 UTC is already the next day in Berlin (UTC+2)');
 assert.equal(progress.dayKey(berlinEvening,0)+1,progress.dayKey(berlinEvening,-120));
 const summary=progress.progressSummary({answers:25,correct:20,today:100,days:[{day:100,answers:12,correct:10},{day:99,answers:8,correct:6},{day:98,answers:5,correct:4}]});
 assert.deepEqual([summary.xp,summary.level.level,summary.streak,summary.practisedToday,summary.todayAnswers,summary.goalPercent],[210,2,3,true,12,60]);
 assert.equal(progress.progressSummary({answers:40,correct:40,today:5,days:[{day:5,answers:40,correct:40}]}).goalPercent,100);
});

test('progress copy is complete in every vault language',()=>{
 const languages=['tr','de','en','ar','uk','fr','es','ru','fa','pl','it','pt'];
 for(const [key,values] of Object.entries(copy.progressCopy)){
  assert.equal(values.length,12,key);
  const placeholders=values[0].match(/\{\w+\}/g)?.sort().join()??'';
  for(const [i,value] of values.entries()){assert(value.trim(),key+':'+languages[i]);assert.equal(value.match(/\{\w+\}/g)?.sort().join()??'',placeholders,key+':'+languages[i]);}
 }
 assert.equal(copy.progressText('tr','level',{n:3}),'Seviye 3');
 assert.equal(copy.progressText('de','learned',{n:4,total:9}),'Gelernt: 4/9');
 assert.equal(copy.formatPercent(41,'tr'),'%41');
 assert.equal(copy.formatPercent(41,'en'),'41%');
 // Every site language (the later ones read the stage names from their language pack).
 for(const {id:language} of require(path.join(compiled,'site-languages.js')).siteLanguages)for(const stage of ['new','started','warming','half','almost','master'])assert(copy.stageText(language,stage));
});

function app(){
 const sql=new DatabaseSync(':memory:');sql.exec(fs.readFileSync('drizzle/0000_heavy_brood.sql','utf8'));
 const db={prepare(query){return {query,args:[],bind(...args){this.args=args;return this;},async first(){return sql.prepare(this.query).get(...this.args)??null;},async all(){return {results:sql.prepare(this.query).all(...this.args)};},async run(){return sql.prepare(this.query).run(...this.args);}};},async batch(items){sql.exec('BEGIN');try{for(const item of items)await item.run();sql.exec('COMMIT');}catch(error){sql.exec('ROLLBACK');throw error;}}};
 const source=ts.transpileModule(fs.readFileSync('app/api/study/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};vm.runInNewContext(source,{module,exports:module.exports,Response,Request,URL,Date,console,require(name){if(name==='@/db')return {getRawDb:()=>db};if(name==='@/app/chatgpt-auth')return {getChatGPTUser:async()=>({userId:'learner-progress'})};if(name==='@/lib/course')return course;if(name==='@/lib/study')return study;throw new Error(name);}});
 return {sql,get(query=''){return module.exports.GET(new Request('https://learn.test/api/study'+query));}};
}

test('the study API returns answer totals and local practice days only when asked',async()=>{
 const a=app();const now=Date.now();const day=86400000;
 const insert=a.sql.prepare('INSERT INTO study_answers (id,user_id,session_id,question_id,answer,correct,created_at) VALUES (?,?,?,?,?,?,?)');
 const ids=progress.housingProgressIds('a');
 insert.run('s1:1','learner-progress','s1',ids[0],'x',1,now);
 insert.run('s1:2','learner-progress','s1',ids[1],'x',0,now);
 insert.run('s0:1','learner-progress','s0',ids[2],'x',1,now-day);
 insert.run('s9:1','learner-progress','s9',ids[3],'x',1,now-5*day);
 insert.run('en:1','learner-progress','en','en-obj-picture-x','x',1,now);
 insert.run('other:1','someone-else','other',ids[0],'x',1,now);
 const plain=await (await a.get()).json();
 assert.equal(plain.stats,undefined,'normal snapshots stay unchanged');
 const res=await a.get('?stats=1&tz=-120');assert.equal(res.status,200);
 const {stats}=await res.json();
 assert.equal(stats.answers,4);assert.equal(stats.correct,3);
 assert.equal(stats.today,progress.dayKey(now,-120));
 assert.deepEqual(stats.days.map(row=>row.day),[stats.today,stats.today-1,stats.today-5]);
 assert.deepEqual(stats.days[0],{day:stats.today,answers:2,correct:1});
 const summary=progress.progressSummary(stats);
 assert.deepEqual([summary.streak,summary.todayAnswers,summary.xp],[2,2,32]);
 const english=await (await a.get('?learn=en&stats=1')).json();
 assert.deepEqual([english.stats.answers,english.stats.correct],[1,1]);
 const odd=await (await a.get('?stats=1&tz=abc')).json();
 assert.equal(odd.stats.today,progress.dayKey(now,0),'an invalid offset falls back to UTC');
});

test('home, Ev ve Yaşam and Nesne Kasası show the progress interface',()=>{
 const home=fs.readFileSync('app/category-study.tsx','utf8');
 assert(home.includes("'stats=1&tz='+new Date().getTimezoneOffset()"));
 // The progress sits at the bottom of the left menu (after Üniteler ve konular, Nesne Kasası, Fiiller), not in the main column or the header.
 const aside=home.slice(home.indexOf('<aside className="work-sidebar">'),home.indexOf('</aside>'));
 assert(aside.indexOf('</nav>')<aside.indexOf('<SidebarProgress '),'progress under the menu');
 const main=home.slice(home.indexOf('<main id="main"'),home.indexOf('</main>'));
 assert(!main.includes('<SidebarProgress')&&!home.includes('<ProgressSummaryPanel'),'no progress panel in the main column');
 const header=fs.readFileSync('app/site-header.tsx','utf8');
 assert(!header.includes('site-progress')&&!home.includes('stats={course'),'no progress bar in the header');
 // Menu and progress stay on screen as one column, so the progress never slides over the menu links.
 const progressCss=fs.readFileSync('app/progress.css','utf8');
 assert(progressCss.includes('.work-sidebar:has(.sidebar-progress) { position:sticky; top:0; align-self:start;')&&progressCss.includes('.sidebar-progress { position:static;'));
 const page=fs.readFileSync('app/housing-study.tsx','utf8');
 assert(page.includes('housingProgress(item.id,snapshot.reviews)')&&page.includes("housingProgress('all',snapshot.reviews)")&&page.includes('<RoundReward'));
 const vault=fs.readFileSync('app/object-study.tsx','utf8');
 assert(vault.includes('objectProgress(id,snapshot.reviews)')&&vault.includes('<RoundReward'));
 assert(fs.readFileSync('app/layout.tsx','utf8').includes('import "./progress.css";'));
 const ui=fs.readFileSync('app/progress-ui.tsx','utf8');
 assert(!/speak|speechSynthesis/.test(ui),'progress never triggers speech');
});
