// The clock says the time in every correct German way, one per tap (the learner's plan "Goliqo – Almanca Saat Söyleme
// Sistemi", 22 October 2026).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const clock=load('clock-sayings'),copy=load('clock-copy'),site=load('site-languages');
const read=file=>fs.readFileSync(file,'utf8');
const say=(h,m)=>clock.clockSayings(h,m).map(item=>item.de);

test('the plan\'s example times, in the plan\'s order',()=>{
 assert.deepEqual(say(14,20),['Es ist vierzehn Uhr zwanzig.','Es ist zwanzig nach zwei.','Es ist zehn vor halb drei.','Es ist zwei Uhr zwanzig.'],'the example 14:20, then it starts again');
 assert.deepEqual(say(3,0),['Es ist drei Uhr.','Es ist drei.','Es ist genau drei Uhr.']);
 assert.deepEqual(say(3,5),['Es ist drei Uhr fünf.','Es ist fünf nach drei.']);
 assert.deepEqual(say(3,10),['Es ist drei Uhr zehn.','Es ist zehn nach drei.']);
 assert.deepEqual(say(3,15),['Es ist drei Uhr fünfzehn.','Es ist Viertel nach drei.','Es ist viertel vier.']);
 assert.deepEqual(say(3,20),['Es ist drei Uhr zwanzig.','Es ist zwanzig nach drei.','Es ist zehn vor halb vier.']);
 assert.deepEqual(say(3,25),['Es ist drei Uhr fünfundzwanzig.','Es ist fünfundzwanzig nach drei.','Es ist fünf vor halb vier.']);
 assert.deepEqual(say(3,30),['Es ist drei Uhr dreißig.','Es ist halb vier.']);
 assert.deepEqual(say(3,35),['Es ist drei Uhr fünfunddreißig.','Es ist fünfundzwanzig vor vier.','Es ist fünf nach halb vier.']);
 assert.deepEqual(say(3,40),['Es ist drei Uhr vierzig.','Es ist zwanzig vor vier.','Es ist zehn nach halb vier.']);
 assert.deepEqual(say(3,45),['Es ist drei Uhr fünfundvierzig.','Es ist Viertel vor vier.','Es ist dreiviertel vier.']);
 assert.deepEqual(say(3,50),['Es ist drei Uhr fünfzig.','Es ist zehn vor vier.']);
 assert.deepEqual(say(3,55),['Es ist drei Uhr fünfundfünfzig.','Es ist fünf vor vier.']);
});

test('grammar rules: ein Uhr, eins on its own, 24 hours formal, 12 hours everyday, midnight and noon',()=>{
 assert.deepEqual(say(1,0),['Es ist ein Uhr.','Es ist eins.','Es ist genau ein Uhr.'],'ein Uhr, not eins Uhr');
 assert.deepEqual(say(13,0),['Es ist dreizehn Uhr.','Es ist eins.','Es ist genau ein Uhr.','Es ist ein Uhr.']);
 assert.deepEqual(say(0,30),['Es ist null Uhr dreißig.','Es ist halb eins.','Es ist zwölf Uhr dreißig.']);
 assert.deepEqual(say(12,45),['Es ist zwölf Uhr fünfundvierzig.','Es ist Viertel vor eins.','Es ist dreiviertel eins.']);
 assert.deepEqual(say(23,50),['Es ist dreiundzwanzig Uhr fünfzig.','Es ist zehn vor zwölf.','Es ist elf Uhr fünfzig.']);
 assert.deepEqual(say(21,21),['Es ist einundzwanzig Uhr einundzwanzig.','Es ist einundzwanzig nach neun.','Es ist neun vor halb zehn.','Es ist neun Uhr einundzwanzig.']);
});

test('only the ways that fit the minute; approximate and regional ways are marked; every way is in the list (no switch)',()=>{
 assert.deepEqual(say(3,28),['Es ist drei Uhr achtundzwanzig.','Es ist zwei vor halb vier.'],'26–29: from the half hour only');
 assert.deepEqual(say(3,33),['Es ist drei Uhr dreiunddreißig.','Es ist drei nach halb vier.'],'31–34: from the half hour only');
 assert.deepEqual(say(3,42),['Es ist drei Uhr zweiundvierzig.','Es ist achtzehn vor vier.']);
 const early=clock.clockSayings(3,2);assert.deepEqual(early.map(i=>i.de),['Es ist drei Uhr zwei.','Es ist zwei nach drei.','Es ist kurz nach drei.']);assert.equal(early.at(-1).kind,'approx');
 const late=clock.clockSayings(3,59);assert.deepEqual(late.map(i=>i.de),['Es ist drei Uhr neunundfünfzig.','Es ist eine Minute vor vier.','Es ist kurz vor vier.']);assert.equal(late.at(-1).kind,'approx');
 for(const m of [0,5,15,20,30,45])assert.ok(!say(3,m).some(text=>text.includes('kurz')),'never "kurz" for an exact time');
 assert.equal(clock.clockSayings(3,45).at(-1).kind,'regional');assert.equal(clock.clockSayings(15,15).at(-1).kind,'regional');
 for(let h=0;h<24;h++)for(let m=0;m<60;m++){
  const list=clock.clockSayings(h,m);
  assert.ok(list.length>=2,h+':'+m);assert.equal(new Set(list.map(i=>i.de)).size,list.length,'no saying twice '+h+':'+m);
  for(const item of list){assert.match(item.de,/^Es ist [A-Za-zäöüß ]+\.$/,h+':'+m);assert.ok(!/eins Uhr|undefined/.test(item.de),item.de);}
 }
});

test('the Turkish meaning and the explanation',()=>{
 const at=(h,m,i)=>clock.turkishTime(clock.clockSayings(h,m)[i],h,m);
 assert.equal(at(14,20,0),'Saat on dört yirmi.');assert.equal(at(14,20,1),'Saat ikiyi yirmi geçiyor.');assert.equal(at(14,20,3),'Saat iki yirmi.');
 assert.equal(at(3,20,2),'Saat üçü yirmi geçiyor.','zehn vor halb vier = Saat üçü yirmi geçiyor (the plan\'s example)');
 assert.equal(at(3,30,1),'Saat üç buçuk.');assert.equal(at(3,45,1),'Saat dörde çeyrek var.');assert.equal(at(3,15,1),'Saat üçü çeyrek geçiyor.');
 assert.equal(at(3,50,1),'Saat dörde on var.');assert.equal(at(3,0,2),'Saat tam üç.');assert.equal(at(3,2,2),'Saat üçü birkaç dakika geçiyor.');
 const fill=(language,h,m,i)=>{const s=clock.clockSayings(h,m)[i],h12=h%12||12;return copy.clockText(language,copy.EXPLAIN_KEY[s.pattern],{next:s.next,halfTime:clock.clockDigits(h12,30),n:s.minutes,time:clock.clockDigits(h12,m)});};
 assert.equal(copy.EXPLAIN_KEY.formal,undefined,'no explanation under the formal ways (the learner asked)');
 assert.equal(fill('tr',3,20,2),'„halb vier“ = 3:30. Bundan 10 dakika öncesi 3:20.','the plan\'s explanation');
 assert.equal(fill('tr',15,40,2),'„halb vier“ = 3:30. Bundan 10 dakika sonrası 3:40.');
 assert.equal(fill('de',3,30,1),'„halb vier“ = 3:30: Die halbe Stunde zählt schon zur nächsten Stunde.');
 const page=read('app/site-greeting.tsx');
 assert.ok(page.includes("language==='tr'?turkishTime(item.saying,item.hour,item.minute)")&&page.includes('{info.index+1}/{info.total}'),'the Turkish sentence and the counter 2/4');
 assert.ok(page.includes("if(turn.current.key!==key)turn.current={key,index:0};"),'a new minute starts again from the first way');
 assert.ok(!page.includes('aria-pressed')&&!page.includes('regionalToggle'),'no switch: every way is said (the learner asked)');
});

test('every text in every site language, with its marks',()=>{
 for(const [key,tuple] of Object.entries(copy.clockCopy)){
  assert.equal(tuple.length,12,key);
  const marks=(tuple[2].match(/\{\w+\}/g)??[]).sort().join();
  for(const id of site.siteLanguages.map(item=>item.id)){
   const text=id==='tr'||site.siteLanguageIndex(id)<12?tuple[site.siteLanguageIndex(id)]:JSON.parse(read('lib/language-packs/'+id+'.json'))[tuple[2]];
   assert.ok(text?.trim(),key+' '+id);assert.equal((text.match(/\{\w+\}/g)??[]).sort().join(),marks,key+' '+id);
  }
 }
});
