// Draws the Nesne Kasası pictures from the shader models in this folder.
// Usage: node art/werkzeug/render.cjs <output folder> [ids...]
// Tools (objects.cjs) become tools-<id>.webp, the other objects (models/*.cjs) 3d-<id>.webp.
// FORMAT=png writes <id>.png previews instead. Needs the playwright package
// (PLAYWRIGHT_MODULE may point to it) and its Chromium.
const fs=require('node:fs');const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const objects=require('./models.cjs');
const tools=require('./objects.cjs');
const png=process.env.FORMAT==='png';
const common=fs.readFileSync(path.join(__dirname,'common.glsl'),'utf8');
const SIZE=1024,OUT=512,FILL=0.8,BG=[252,250,237];
const page=`<!doctype html><canvas id="c"></canvas><canvas id="o" width="${OUT}" height="${OUT}"></canvas><script>
window.draw=async function(fs,o,size,probe){
 const c=document.getElementById('c');c.width=size;c.height=size;
 const gl=c.getContext('webgl2',{preserveDrawingBuffer:true,antialias:false});if(!gl)throw new Error('no webgl2');
 const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(x));return x;};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,'#version 300 es\\nin vec2 a;void main(){gl_Position=vec4(a,0,1);}'));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(pr));
 gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const u=n=>gl.getUniformLocation(pr,n);
 gl.uniform2f(u('uRes'),size,size);gl.uniform3fv(u('uCam'),o.cam);gl.uniform3fv(u('uTarget'),o.target);gl.uniform1f(u('uFov'),o.fov);gl.uniform1f(u('uGround'),o.ground||0);gl.uniform1f(u('uProbe'),probe?1:0);
 gl.viewport(0,0,size,size);gl.enable(gl.SCISSOR_TEST);
 for(let y=0;y<size;y+=32){gl.scissor(0,y,size,32);gl.drawArrays(gl.TRIANGLES,0,3);gl.finish();await new Promise(r=>setTimeout(r,0));}
 const px=new Uint8Array(size*size*4);gl.readPixels(0,0,size,size,gl.RGBA,gl.UNSIGNED_BYTE,px);
 if(probe){for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(px[(y*size+x)*4]>127)return((2*y+1-size)/size)*2.5;return null;}
 // crop a square around the object and its soft shadow, like the other vault pictures
 const bg=${JSON.stringify(BG)};let x0=size,x1=-1,y0=size,y1=-1,sy1=-1;
 for(let r=0;r<size;r++)for(let x=0;x<size;x++){const i=(r*size+x)*4;const d=Math.abs(px[i]-bg[0])+Math.abs(px[i+1]-bg[1])+Math.abs(px[i+2]-bg[2]);const y=size-1-r;
  if(d>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}if(d>14&&y>sy1)sy1=y;}
 if(x1<0)throw new Error('empty picture');window.edge=x0<=1||y0<=1||x1>=size-2||y1>=size-2;
 y1=Math.max(y1,Math.min(sy1,y1+Math.round((y1-y0)*0.12)));
 const side=Math.max(x1-x0,y1-y0)/${FILL};const cx=(x0+x1)/2,cy=(y0+y1)/2;
 const out=document.getElementById('o');const ctx=out.getContext('2d',{alpha:false});ctx.fillStyle='rgb('+bg.join(',')+')';ctx.fillRect(0,0,${OUT},${OUT});
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 ctx.drawImage(c,cx-side/2,cy-side/2,side,side,0,0,${OUT},${OUT});
 return out.toDataURL(window.format,0.9);
};</script>`;
(async()=>{
 const outDir=process.argv[2];if(!outDir)throw new Error('Give an output folder.');
 const ids=process.argv.length>3?process.argv.slice(3):Object.keys(objects);
 fs.mkdirSync(outDir,{recursive:true});
 const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const tab=await browser.newPage();tab.setDefaultTimeout(0);await tab.setContent(page);await tab.evaluate(f=>{window.format=f;},png?'image/png':'image/webp');
 let failed=0;
 for(const id of ids){
  const obj=objects[id];if(!obj){console.log(id,'unknown');failed++;continue;}
  const src=common.replace('//__OBJECT__',obj.glsl);
  try{
   const low=await tab.evaluate(([s,o])=>window.draw(s,o,512,true),[src,obj.view]);
   const view={...obj.view,ground:low-0.004};
   const url=await tab.evaluate(([s,o,size])=>window.draw(s,o,size,false),[src,view,SIZE]);
   if(!url.startsWith(png?'data:image/png':'data:image/webp'))throw new Error('no webp support');
   const file=path.join(outDir,png?id+'.png':(tools[id]?'tools-':'3d-')+id+'.webp');fs.writeFileSync(file,Buffer.from(url.split(',')[1],'base64'));
   const edge=await tab.evaluate(()=>window.edge);
   console.log(id,'->',file,fs.statSync(file).size,'bytes',edge?'WARNING: the object touches the camera frame, move the camera back or aim it better':'');
  }catch(e){failed++;console.log(id,'ERROR',String(e.message||e).slice(0,1500));}
 }
 await browser.close();process.exit(failed?1:0);
})();
