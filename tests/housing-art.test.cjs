const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const {housingQuestions}=require(path.join(compiled,'housing-course.js'));const {housingIllustration}=require(path.join(compiled,'housing-illustrations.js'));
test('every housing writing and choice question has an existing image and a valid crop',()=>{
 const files=new Set();
 for(const q of housingQuestions){
  const art=housingIllustration(q);assert(art,q.id);assert(art.src.startsWith('/toon/')||art.src.startsWith('/objects/toon/'),q.id);
  assert(art.crop.x>=0&&art.crop.y>=0&&art.crop.width>0&&art.crop.height>0,q.id);
  assert(art.crop.x+art.crop.width<=art.width&&art.crop.y+art.crop.height<=art.height,q.id);
  const file=path.join(process.cwd(),'public',art.src);assert(fs.existsSync(file),q.id+' '+art.src);files.add(file);
 }
 assert(housingQuestions.length>200);assert(files.size>1);
});
