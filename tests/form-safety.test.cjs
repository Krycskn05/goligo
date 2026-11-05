const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

// Site check, 5 November 2026: a form sent before the page's JavaScript ran went the browser's own way (GET) and put
// the email address and the password into the address (/giris?email=…&password=…). Every form with a password or an
// email address now keeps its button off until the page is ready, and would send with POST anyway.
test('account forms never put what was typed into the page address',()=>{
 const hook=read('app/use-hydrated.ts');
 assert.ok(hook.includes('export function useHydrated()')&&hook.includes('useEffect(()=>{setReady(true);},[]);'));
 const forms={
  'app/auth-form.tsx':[1,'disabled={busy||!ready}'],
  'app/reset-form.tsx':[1,'disabled={busy||dead||!ready}'],
  'app/forgot-form.tsx':[1,'disabled={busy||!ready}'],
  'app/account-panel.tsx':[4,'disabled={!!busy||!ready}'],
 };
 for(const [file,[count,button]] of Object.entries(forms)){
  const page=read(file);
  assert.ok(page.includes("import {useHydrated} from './use-hydrated';")&&page.includes('const ready=useHydrated();'),file);
  const tags=page.match(/<form [^>]*>/g)??[];
  assert.equal(tags.length,count,file);
  for(const tag of tags)assert.ok(tag.includes('method="post"'),file+': '+tag);
  assert.equal(page.split('type="submit" '+button).length-1,count,file+': every send button waits for the page');
 }
});

// The sign-up message stands under the field it is about (on a phone it was below the screen while the page showed the
// red field), and is scrolled into view.
test('a sign-up message stands under its field',()=>{
 const page=read('app/auth-form.tsx');
 for(const at of ["message('name')","message('email')","message('password')","message('accept')","message(null)"])assert.ok(page.includes('{'+at+'}'),at);
 assert.ok(page.includes("document.getElementById('auth-error')?.scrollIntoView({block:'nearest'})"));
 assert.equal(page.split('id="auth-error"').length-1,1,'one message at a time, one id');
 assert.ok(read('app/members.css').includes('.lk-auth-form>.lk-form-error.at-field'));
});
