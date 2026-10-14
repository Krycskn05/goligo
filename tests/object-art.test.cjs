const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR.');
const objects=require(path.join(compiled,'object-course.js'));
const art=JSON.parse(fs.readFileSync('lib/object-toon-art.json','utf8'));
const models=require(path.resolve('art/werkzeug/models.cjs'));const tools=require(path.resolve('art/werkzeug/objects.cjs'));
// WebP size: lossy VP8 keeps 14-bit sizes at 26/28, extended VP8X keeps (size-1) as 24-bit at 24/27.
function webpSize(file){const b=fs.readFileSync(file);assert.equal(b.slice(0,4).toString(),'RIFF');assert.equal(b.slice(8,12).toString(),'WEBP');const kind=b.slice(12,16).toString();
 if(kind==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];if(kind==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];throw Error(file+' '+kind);}

test('every Nesne Kasası object has its own 512 px 3D picture in the same style',()=>{
 const ids=objects.objectVocabulary.map(word=>word.id);assert.equal(ids.length,107);
 assert.deepEqual(Object.keys(art).sort(),[...ids].sort());
 for(const id of ids){
  const src='/objects/toon/'+(tools[id]?'tools-':'3d-')+id+'.webp';
  assert.deepEqual(art[id],{src,width:512,height:512,crop:{x:0,y:0,width:512,height:512}},id);
  assert.deepEqual(webpSize(path.join('public',src)),[512,512],id);
 }
});

test('every picture is drawn from a shader model kept in the repository',()=>{
 const ids=objects.objectVocabulary.map(word=>word.id);
 assert.deepEqual(Object.keys(models).sort(),[...ids].sort());
 for(const [id,model] of Object.entries(models)){
  assert(model.glsl.includes('vec2 objectMap(vec3 p)'),id);assert.equal(model.view.cam.length,3,id);assert.equal(model.view.target.length,3,id);
  // see-through glass and water must stay hidden from shadows and from the ray behind them
  if(/M_CLEAR/.test(model.glsl))assert(model.glsl.includes('gNoGlass'),id+' glass');
  assert(!model.glsl.includes('`')&&!model.glsl.includes('${'),id);
 }
 const glsl=fs.readFileSync('art/werkzeug/common.glsl','utf8');
 for(const part of ['//__OBJECT__','#define M_CLEAR','bool gNoGlass','#ifdef HAS_MAT'])assert(glsl.includes(part),part);
 const workflow=fs.readFileSync('.github/workflows/resimler.yml','utf8');
 assert(workflow.includes('art/werkzeug/render.cjs public/objects/toon')&&workflow.includes('public/objects/toon/3d-*.webp'));
});
