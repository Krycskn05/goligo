// The learner's own top-menu icons (made in ChatGPT, "goliqo-ust-menu-simgeleri"; the learner asked to add them):
// site language, sounds (and sounds off), animations, the speaking voice, Hesabım, clock and calendar.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

/** Width, height and whether a WebP file has a clear background. */
function webp(file){
 const data=fs.readFileSync(file);let size=null,alpha=false;
 assert.equal(data.toString('ascii',8,12),'WEBP',file);
 for(let at=12;at+8<=data.length;){
  const tag=data.toString('ascii',at,at+4),length=data.readUInt32LE(at+4);
  if(tag==='VP8X'){size=[1+data.readUIntLE(at+12,3),1+data.readUIntLE(at+15,3)];alpha=!!(data[at+8]&0x10);}
  if(tag==='ALPH')alpha=true;
  at+=8+length+(length&1);
 }
 return {size,alpha,bytes:data.length};
}

test('the eight icons are small, sharp and see-through',()=>{
 const icons=read('app/top-icons.tsx');
 for(const file of ['sesler','ses-kapali','animasyonlar','konusan-ses','site-dili','hesabim','saat','takvim']){
  const info=webp('public/icons/top/'+file+'.webp');
  assert.deepEqual(info.size,[128,128],file);assert.ok(info.alpha,file+' has a clear background');assert.ok(info.bytes<20*1024,file+' '+info.bytes);
  assert.ok(icons.includes("'"+file+"'"),file+' is listed');
 }
});

test('they are used in the header, the sound settings, the clock, the tour and Hesabım',()=>{
 const header=read('app/site-header.tsx');
 assert.ok(header.includes('<label className="site-language"><TopIcon name="language" size={26}/>')&&read('app/account-menu.tsx').includes('<TopIcon name="account" size={30}/></button>'));
 const effects=read('app/learning-effects.tsx');
 // The sound button shows the speaker, crossed out while the sound effects are off.
 assert.ok(effects.includes("<TopIcon name={enabled?'sounds':'soundsOff'} size={30}/>")&&effects.includes('window.addEventListener(EFFECTS_CHANGED,sync)'));
 for(const piece of ['<TopIcon name="sounds" size={32}/>','<TopIcon name="voice" size={26}/>','<TopIcon name="animations" size={26}/>',"<TopIcon name={preferences.enabled?'sounds':'soundsOff'} size={26}/>"])assert.ok(effects.includes(piece),piece);
 const clock=read('app/site-greeting.tsx');
 assert.ok(clock.includes('<TopIcon name="calendar" size={24} className="sg-day-icon"/>'));
 assert.ok(read('app/site-tour.tsx').includes('<TopIcon name="voice" size={24}/>'));
 assert.ok(read('app/account-panel.tsx').includes('<Card icon={<TopIcon name="account" size={26}/>} title={texts.nameLabel}>'));
 // Decorative: the words are on the button or the heading.
 assert.ok(read('app/top-icons.tsx').includes('alt="" aria-hidden="true"'));
});
