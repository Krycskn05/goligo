// The header greeting tells the time in German for the learner's own clock (the learner asked): greeting, part of the
// day, day and date, calendar week and time, each in several correct ways.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const g=require(path.join(compiled,'german-time.js'));
const copy=require(path.join(compiled,'greeting-copy.js'));
const site=require(path.join(compiled,'site-languages.js'));
const de=list=>list.map(item=>item.de);

test('numbers, ordinals, parts of the day and calendar weeks',()=>{
 assert.deepEqual([0,1,7,16,20,21,30,43,59].map(g.numberWord),['null','eins','sieben','sechzehn','zwanzig','einundzwanzig','dreißig','dreiundvierzig','neunundfünfzig']);
 assert.deepEqual([1,2,3,7,8,19,20,21,31,43].map(g.ordinalWord),['erste','zweite','dritte','siebte','achte','neunzehnte','zwanzigste','einundzwanzigste','einunddreißigste','dreiundvierzigste']);
 assert.deepEqual([4,5,8,9,11,12,13,14,17,18,21,22,23,0].map(g.partOfDay),['nacht','morgen','morgen','vormittag','vormittag','mittag','mittag','nachmittag','nachmittag','abend','abend','nacht','nacht','nacht']);
 // ISO 8601 weeks as in Germany (KW): the week with the year's first Thursday is week 1.
 assert.equal(g.isoWeek(new Date(2026,9,21)),43);assert.equal(g.isoWeek(new Date(2026,0,1)),1);
 assert.equal(g.isoWeek(new Date(2021,0,3)),53);assert.equal(g.isoWeek(new Date(2020,11,31)),53);assert.equal(g.isoWeek(new Date(2024,11,30)),1);
});

test('greetings fit the hour, with honest notes',()=>{
 assert.equal(g.greetings(7)[0].de,'Guten Morgen!');assert.equal(g.greetings(10)[0].de,'Guten Morgen!');assert.equal(g.greetings(11)[0].de,'Guten Tag!');
 assert.ok(de(g.greetings(12.5|0)).includes('Mahlzeit!'));assert.equal(g.greetings(15)[0].de,'Guten Nachmittag!');assert.equal(g.greetings(19)[0].de,'Guten Abend!');
 // At night "Gute Nacht!" is a goodbye before bed, so it is only an alternative with that note.
 const night=g.greetings(2);assert.equal(night[0].de,'Hallo, du Nachteule!');assert.ok(de(night).includes('Na, noch wach?'));assert.deepEqual(night.find(item=>item.de==='Gute Nacht!'),{de:'Gute Nacht!',note:'beforeBed'});
 assert.deepEqual(de(g.partPhrases(15)),['Es ist Nachmittag.','Es ist schon Nachmittag.','Heute Nachmittag lernen wir Deutsch.','Nachmittags lerne ich Deutsch.']);
 assert.equal(g.partPhrases(2)[1].de,'Es ist mitten in der Nacht.');
});

test('the time in several ways: digits, official and everyday',()=>{
 const time=(h,m)=>de(g.timePhrases(h,m));
 assert.deepEqual(time(16,20),['Es ist 16:20 Uhr.','Es ist sechzehn Uhr zwanzig.','Es ist zwanzig nach vier.','Es ist zehn vor halb fünf.','Es ist vier Uhr zwanzig nachmittags.']);
 assert.deepEqual(time(12,30),['Es ist 12:30 Uhr.','Es ist zwölf Uhr dreißig.','Es ist halb eins.','Es ist zwölf Uhr dreißig mittags.']);
 assert.ok(time(7,45).includes('Es ist Viertel vor acht.')&&time(7,15).includes('Es ist Viertel nach sieben.'));
 assert.ok(time(19,0).includes('Es ist neunzehn Uhr.')&&time(19,0).includes('Es ist sieben Uhr.')&&time(19,0).includes('Es ist genau sieben.'));
 assert.ok(time(13,1).includes('Es ist dreizehn Uhr eins.')&&time(13,1).includes('Es ist eine Minute nach eins.')&&time(13,1).includes('Es ist kurz nach eins.'));
 assert.ok(time(23,58).includes('Es ist zwei vor zwölf.')&&time(23,58).includes('Es ist kurz vor zwölf.'));
 assert.ok(time(10,27).includes('Es ist drei vor halb elf.')&&time(10,38).includes('Es ist acht nach halb elf.')&&time(10,40).includes('Es ist zehn nach halb elf.'));
 assert.ok(time(0,5).includes('Es ist null Uhr fünf.')&&time(1,0).includes('Es ist ein Uhr.'));
 assert.ok(time(16,21).includes('Es ist neun vor halb fünf.')&&time(16,21).includes('Es ist einundzwanzig nach vier.')&&time(16,38).includes('Es ist zweiundzwanzig vor fünf.'));
 assert.equal(g.timePhrases(16,20)[1].note,'official');assert.equal(g.timePhrases(16,20)[2].note,'everyday');
});

test('day, date and week sentences',()=>{
 const day=de(g.dayPhrases(new Date(2026,9,21)));
 assert.deepEqual(day,['Heute ist Mittwoch.','Wir haben heute Mittwoch.','Heute ist Mittwoch, der 21. Oktober 2026.','Heute ist der einundzwanzigste Oktober.','Gestern war Dienstag.','Morgen ist Donnerstag.']);
 assert.ok(de(g.dayPhrases(new Date(2026,9,24))).includes('Es ist Wochenende!')&&de(g.dayPhrases(new Date(2026,9,23))).includes('Bald ist Wochenende!'));
 assert.deepEqual(de(g.weekPhrases(new Date(2026,9,21))),['Wir haben die 43. Kalenderwoche.','Wir haben KW 43.','Wir sind in der 43. Woche.','Das ist die dreiundvierzigste Woche des Jahres.']);
});

test('the header clock: every tap says another German sentence about now',()=>{
 const header=fs.readFileSync('app/site-header.tsx','utf8'),bubble=fs.readFileSync('app/site-greeting.tsx','utf8');
 assert.ok(header.includes('<SiteGreeting language={language} line={pickText(greetingLine,language)}/>'));
 assert.ok(bubble.includes('if(!now)return <span className="site-greeting site-greeting-waiting" aria-hidden="true"/>;'),'the place stays empty until the page knows the clock');
 // Only the clock, the day and the part of the day, without a frame (the learner asked); no greeting, week or
 // sentences in the header any more — they are in the window.
 assert.ok(bubble.includes('<AnalogClock date={now} seconds={motion}/>'));
 assert.ok(bubble.includes('<strong className="site-greeting-day"><TopIcon name="calendar" size={24} className="sg-day-icon"/>{WEEKDAYS[now.getDay()]}</strong>'));
 assert.ok(bubble.includes("<span className={'site-greeting-part part-'+moment.part}><PartOfDayIcon part={moment.part}/>{PART_NOUN[moment.part]}</span>"));
 for(const gone of ['site-greeting-time','site-greeting-facts','site-greeting-say','Math.random'])assert.ok(!bubble.includes(gone),gone);
 assert.ok(bubble.includes('setInterval(tick,motion?1000:15000)'),'the clock ticks every second');
 assert.ok(bubble.includes('transform={`rotate(${angle} 50 50)`}')&&bubble.includes('const hourAngle=(h+m/60)*30,minuteAngle=(m+sec/60)*6,secondAngle=sec*6;'));
 for(const part of ['morgen','vormittag','mittag','nachmittag','abend','nacht'])assert.ok(bubble.includes(part),'a picture for '+part);
 // No window (the learner asked, 21 October 2026): a tap says the time the next way (lib/clock-sayings.ts, tested in
 // tests/clock-sayings.test.cjs) and shows it in a small box under the clock.
 for(const gone of ['createPortal(','role="dialog"','sg-panel','setOpen','momentSayings'])assert.ok(!bubble.includes(gone),gone);
 assert.ok(bubble.includes('onClick={say}')&&bubble.includes('measure();speech.speak(saying.de);'));
 const css=fs.readFileSync('app/koko-theme.css','utf8');
 assert.ok(css.includes('.site-greeting { position:relative; margin:0; padding:4px 10px 4px 4px; background:none; border:0;'),'no frame');
 assert.ok(!css.includes('.site-greeting::before')&&!css.includes('.site-greeting::after'),'no speech-bubble tail');
 for(const rule of ['.site-greeting-button {','.site-greeting-day {','.site-greeting-part {','.site-greeting-button .analog-clock {','.sg-info {','.sg-info-de {'])assert.ok(css.includes(rule),rule);
 for(const gone of ['.sg-backdrop','.sg-panel','.sg-group'])assert.ok(!css.includes(gone),gone);
 // Placed neatly: wide screens in the middle, middle widths on the right above the buttons, phones in the middle of
 // the one thin row (tests/header-row.test.cjs).
 assert.ok(css.includes(' .site-header .site-greeting { margin-inline:auto; }')&&css.includes(' .site-header .site-greeting { grid-area:bubble; justify-self:end; }')&&css.includes(' .site-header .site-greeting { flex:none; margin-inline:auto;'));
 // Texts in every site language (12 in the tuples, the others in their language pack).
 for(const id of site.siteLanguages.map(item=>item.id))for(const key of Object.keys(copy.greetingCopy))assert.ok(copy.greetingText(id,key).trim(),key+' '+id);
 for(const id of ['bg','zh','ti','ur'])for(const key of Object.keys(copy.greetingCopy)){const pack=JSON.parse(fs.readFileSync('lib/language-packs/'+id+'.json','utf8'));assert.ok(pack[copy.greetingCopy[key][2]],key+' in '+id);}
});
