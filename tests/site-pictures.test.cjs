// The learner's pictures for the parts of the site change every 30 minutes and mix the sets (the learner asked).
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const pictures=require(path.join(compiled,'site-pictures.js'));

test('every half hour each part shows its next picture, and the parts mix the sets',()=>{
 const half=30*60*1000,start=Date.UTC(2026,9,21,10,0,0);
 assert.equal(pictures.PICTURE_PERIOD_MS,half);
 const a=pictures.pickPictures(start),b=pictures.pickPictures(start+half-1),c=pictures.pickPictures(start+half);
 assert.deepEqual(a,b,'the same for the whole half hour');
 for(const part of Object.keys(a))assert.notEqual(a[part],c[part],part+' changes after 30 minutes');
 // Over the day every picture is shown.
 for(const [part,list] of Object.entries(pictures.PART_PICTURES)){const seen=new Set();for(let i=0;i<48;i++)seen.add(pictures.pickPictures(start+i*half)[part]);assert.equal(seen.size,list.length,part);}
 // Not all from one set at the same time.
 const sets=new Set(Object.values(a).map(src=>src.includes('/home/')?'home':src.endsWith('-2.webp')?'2':src.endsWith('-3.webp')?'3':'landing'));
 assert.ok(sets.size>1);
 assert.equal(pictures.nextPictureChange(start+1000),half-1000);
 // The simple drawings only where they fit (welcome, Nesne Kasası, Oyunlar).
 for(const [part,list] of Object.entries(pictures.PART_PICTURES))assert.equal(list.some(src=>src.endsWith('-3.webp')),['welcome','vault','games'].includes(part),part);
 for(const list of Object.values(pictures.PART_PICTURES))for(const src of list)assert.ok(fs.existsSync('public'+src),src);
});
