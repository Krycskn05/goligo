// Paul Hoca animasyonları öğrencinin isteğiyle kaldırıldı: hiçbir sayfa onları göstermez.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');

function sources(dir){
 const out=[];
 for(const name of fs.readdirSync(dir)){
  const file=path.join(dir,name);
  if(fs.statSync(file).isDirectory())out.push(...sources(file));
  else if(/\.(tsx?|css)$/.test(name)&&!/^paul-hoca\./.test(name))out.push(file);
 }
 return out;
}

test('no page shows the Paul Hoca animations any more',()=>{
 for(const file of sources('app')){
  const text=fs.readFileSync(file,'utf8');
  for(const word of ['paul-hoca','PaulHoca','PAUL_PICTURES','/paul/','paul-box','lk-reaction-paul'])assert.ok(!text.includes(word),file+': '+word);
 }
 // The wrong-answer badge is back to its own icon and its usual length.
 const effects=fs.readFileSync('app/learning-effects.tsx','utf8');
 assert.ok(effects.includes(":<RotateCcw size={24}/>}")&&effects.includes("kind==='complete'?1500:1050"));
});
