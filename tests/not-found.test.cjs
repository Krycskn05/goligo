const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));

// Site check, 5 November 2026: a wrong address showed the framework's "This page could not be found." in English.
test('a missing page speaks the visitor\'s language and leads home',async()=>{
 const page=fs.readFileSync('app/not-found.tsx','utf8');
 assert.ok(page.includes('export default async function NotFound()')&&page.includes('const language=await pageLanguage();'));
 assert.ok(page.includes("<PublicPage language={language} signedIn={signedIn} narrow>")&&page.includes('<a className="btn lk-submit" href="/">{p(\'notFoundHome\')}</a>'));
 assert.ok(page.includes('robots:{index:false,follow:false}'));
 const site=load('site-languages');const {publicText}=load('public-copy');
 const english=key=>publicText('en',key);
 for(const {id} of site.siteLanguages){
  await site.loadLanguagePack(id);
  for(const key of ['notFoundTitle','notFoundText','notFoundHome']){
   const text=publicText(id,key);assert.ok(text.trim(),id+' '+key);
   if(id!=='en')assert.notEqual(text,english(key),id+' '+key+' is translated');
  }
 }
});
