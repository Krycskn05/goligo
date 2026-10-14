const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const preference=require(path.join(compiled,'learning-language.js'));

test('while the English course is paused the site always opens the German course',()=>{
 assert.equal(preference.ENGLISH_COURSE_ENABLED,false);
 const saved=new Map([['lernkoko-learning-language','en']]);const storage={getItem:key=>saved.get(key)??null};
 assert.equal(preference.activeLearningLanguage(storage,'?learn=en'),'de');
 assert.equal(preference.activeLearningLanguage(storage),'de');
 assert.equal(preference.readLearningLanguage(storage,'?learn=en'),'en','the stored English choice itself is kept for later');
});

test('the DE/EN course switch is not offered on the home page or in the object vault',()=>{
 for(const file of ['app/category-study.tsx','app/object-study.tsx']){
  const source=fs.readFileSync(file,'utf8');
  assert(source.includes('onCourse={ENGLISH_COURSE_ENABLED?changeCourse:undefined}'),file);
  assert(source.includes('activeLearningLanguage(localStorage,window.location.search)'),file);
  assert(!source.includes('readLearningLanguage(localStorage'),file);
 }
});
