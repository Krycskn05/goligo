// The learner's own icons (Goliqo-ikonlar.zip, 4 November 2026): Kelime Kasası in the menu (the chest with the key and
// the mug), and the header's calendar and clock. The clock picture has no hands of its own; the header draws the time of
// now on it, around the centre of its face.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');
const size=file=>{const d=fs.readFileSync(file);assert.equal(d.toString('ascii',8,12),'WEBP',file);
 for(let at=12;at+8<=d.length;){const tag=d.toString('ascii',at,at+4),length=d.readUInt32LE(at+4);
  if(tag==='VP8X')return [1+d.readUIntLE(at+12,3),1+d.readUIntLE(at+15,3)];
  if(tag==='VP8 ')return [d.readUInt16LE(at+14)&0x3fff,d.readUInt16LE(at+16)&0x3fff];
  if(tag==='VP8L'){const b=d.readUInt32LE(at+9);return [(b&0x3fff)+1,((b>>14)&0x3fff)+1];}
  at+=8+length+(length&1);}
 throw Error('no size: '+file);};

test('the three pictures are in place, small and square',()=>{
 assert.deepEqual(size('public/icons/menu/vault.webp'),[128,128],'menu icons are 128 × 128');
 for(const file of ['public/icons/header/calendar.webp','public/icons/header/clock.webp']){assert.deepEqual(size(file),[192,192],file);assert.ok(fs.statSync(file).size<20000,file);}
 assert.ok(read('app/nav-icons.tsx').includes("vault:'/icons/menu/vault.webp'"),'the menu, the home cards and the vault page take it from here');
});

test('the header clock draws the time of now on the picture, around its face',()=>{
 const greeting=read('app/site-greeting.tsx');
 assert.ok(greeting.includes('export const CLOCK_FACE={x:50.52,y:49.05,r:33.16};'));
 assert.ok(greeting.includes('<image href="/icons/header/clock.webp" x="0" y="0" width="100" height="100"/>'));
 assert.ok(greeting.includes('x1={x} y1={y} x2={x} y2={y-length}')&&greeting.includes('transform={`rotate(${angle} ${x} ${y})`}'),'the hands turn around the face centre');
 assert.ok(greeting.includes("{seconds&&hand(secondAngle,r*0.82,1.7,'#e8742c','second')}"),'the ticking second hand with motion on');
 const {x,y,r}={x:50.52,y:49.05,r:33.16};assert.ok(x-r>5&&x+r<95&&y-r>5&&y+r<95,'the face lies inside the picture');
 assert.ok(read('app/koko-theme.css').includes('background:url(/icons/header/calendar.webp) center / contain no-repeat;'),'the calendar picture under the month and the day');
});
