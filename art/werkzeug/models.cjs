// All Nesne Kasası shader models: the tools (objects.cjs) and the other objects (models/*.cjs).
const fs=require('node:fs');const path=require('node:path');
const all={...require('./objects.cjs')};
const dir=path.join(__dirname,'models');
for(const file of fs.existsSync(dir)?fs.readdirSync(dir).filter(name=>name.endsWith('.cjs')).sort():[]){
 const part=require(path.join(dir,file));
 for(const [id,model] of Object.entries(part)){if(all[id])throw new Error('duplicate model '+id+' in '+file);all[id]=model;}
}
module.exports=all;
