import {mkdirSync,writeFileSync} from 'node:fs';
import {soundRecipes,soundDuration} from '../lib/effect-sounds.ts';
const directory=new URL('../public/sounds/',import.meta.url);mkdirSync(directory,{recursive:true});
const sampleRate=44100;
const manifest=[];
for(const [id,notes] of Object.entries(soundRecipes)){
 const duration=soundDuration(id)+.04,count=Math.ceil(duration*sampleRate);const buffer=Buffer.alloc(44+count*2);
 buffer.write('RIFF',0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(sampleRate,24);buffer.writeUInt32LE(sampleRate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(count*2,40);
 let peak=0;
 for(let index=0;index<count;index++){
  const time=index/sampleRate;let sample=0;
  for(const note of notes){
   const elapsed=time-note.start-.012;if(elapsed<0||elapsed>=note.duration)continue;
   const attack=.012,envelope=elapsed<attack?.0001*Math.pow(note.gain/.0001,elapsed/attack):note.gain*Math.pow(.0001/note.gain,(elapsed-attack)/(note.duration-attack));
   const exponent=note.end?Math.log(note.end/note.f)/note.duration:0,cycles=exponent?note.f*Math.expm1(exponent*elapsed)/exponent:note.f*elapsed;
   const sine=Math.sin(2*Math.PI*cycles),wave=note.type==='triangle'?2/Math.PI*Math.asin(sine):sine;
   sample+=wave*envelope*Math.min(1,elapsed/.002,(note.duration-elapsed)/.002);
  }
  if(!Number.isFinite(sample)||Math.abs(sample)>1)throw Error('Invalid audio sample: '+id);
  peak=Math.max(peak,Math.abs(sample));buffer.writeInt16LE(Math.round(sample*32767),44+index*2);
 }
 if(peak<.01)throw Error('Silent audio: '+id);
 writeFileSync(new URL(id+'.wav',directory),buffer);manifest.push({id,file:'/sounds/'+id+'.wav',durationSeconds:Number(duration.toFixed(3))});
}
writeFileSync(new URL('manifest.json',directory),JSON.stringify({sampleRate,format:'PCM WAV, mono, 16-bit',sounds:manifest},null,2)+'\n');
console.log('Generated '+manifest.length+' original sound effects.');
