// The learner's own icon (Goliqo-ikonlar.zip, 4 November 2026): Kelime Kasası in the menu (the chest with the key and the
// mug). The header's calendar and clock from the same zip were tried and taken back the same day (the learner asked).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');
const size=file=>{const d=fs.readFileSync(file);assert.equal(d.toString('ascii',8,12),'WEBP',file);
 for(let at=12;at+8<=d.length;){const tag=d.toString('ascii',at,at+4),length=d.readUInt32LE(at+4);
  if(tag==='VP8X')return [1+d.readUIntLE(at+12,3),1+d.readUIntLE(at+15,3)];
  if(tag==='VP8 ')return [d.readUInt16LE(at+14)&0x3fff,d.readUInt16LE(at+16)&0x3fff];
  if(tag==='VP8L'){const b=d.readUInt32LE(at+9);return [(b&0x3fff)+1,((b>>14)&0x3fff)+1];}
  at+=8+length+(length&1);}
 throw Error('no size: '+file);};

test('Kelime Kasası in the menu: the learner\'s chest, 128 × 128 like the other menu icons',()=>{
 assert.deepEqual(size('public/icons/menu/vault.webp'),[128,128],'menu icons are 128 × 128');
 assert.ok(read('app/nav-icons.tsx').includes("vault:'/icons/menu/vault.webp'"),'the menu, the home cards and the vault page take it from here');
 // The header's calendar and clock went back to their own drawings (the learner asked, 4 November 2026).
 assert.ok(!fs.existsSync('public/icons/header/clock.webp')&&!read('app/site-greeting.tsx').includes('/icons/header/'));
});
