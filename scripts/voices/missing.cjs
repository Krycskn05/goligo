// Counts the spoken texts that still miss a natural clip: texts not in the voice manifest, or
// texts whose clip file is missing for one of the manifest's voices.
// usage: node missing.cjs TEXTS.json MANIFEST.json FILES.txt   (FILES.txt: one path per line from the "sesler" branch)
const fs=require('node:fs');
const [textsPath,manifestPath,filesPath]=process.argv.slice(2);
const texts=JSON.parse(fs.readFileSync(textsPath,'utf8'));
let manifest={};try{manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));}catch{}
const clips=manifest.clips||{};const voices=Array.isArray(manifest.voices)&&manifest.voices.length?manifest.voices:['F1'];
const files=new Set(fs.existsSync(filesPath)?fs.readFileSync(filesPath,'utf8').split('\n').map(line=>line.trim()).filter(Boolean):[]);
const missing=texts.filter(text=>{const id=clips[text];return !id||voices.some(voice=>!files.has(voice+'/'+id+'.mp3'));});
if(process.env.VOICE_MISSING_LIST)for(const text of missing.slice(0,20))console.error('eksik: '+text);
process.stdout.write(String(missing.length)+'\n');
